import { github } from "@/content/site";

export type RepoStat = {
  name: string;
  owner: string;
  url: string;
  description: string | null;
  stars: number;
  language: string | null;
  commits: number;
  pushedAt: string;
};

export type GitHubStats = {
  contributions: number;
  repos: number;
  orgs: number;
  stars: number;
  top: RepoStat[];
};

type Repo = {
  name: string;
  owner: { login: string };
  url: string;
  description: string | null;
  isPrivate: boolean;
  isFork: boolean;
  stargazerCount: number;
  pushedAt: string;
  primaryLanguage: { name: string } | null;
};

const REPO = `name owner { login } url description isPrivate isFork stargazerCount pushedAt primaryLanguage { name }`;

async function gql<T>(query: string, variables: Record<string, unknown>, token: string): Promise<T> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    // Refreshed at most daily; visitors never hit GitHub.
    next: { revalidate: 86400, tags: ["github"] },
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GitHub GraphQL: ${res.status}`);
  return json.data as T;
}

/**
 * Public repos Shaan committed to, owned by him or his orgs, plus the last
 * year's contribution count. Null without GITHUB_TOKEN or on any API failure,
 * so the section simply doesn't render.
 */
export async function getGitHubStats(): Promise<GitHubStats | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  try {
    const { user } = await gql<{
      user: {
        contributionsCollection: {
          contributionYears: number[];
          contributionCalendar: { totalContributions: number };
        };
      };
    }>(
      `query($login: String!) { user(login: $login) { contributionsCollection {
        contributionYears contributionCalendar { totalContributions } } } }`,
      { login: github.user },
      token
    );

    // A contributions window can span at most a year, so walk every active year.
    const years = await Promise.all(
      user.contributionsCollection.contributionYears.map((y) =>
        gql<{
          user: {
            contributionsCollection: {
              commitContributionsByRepository: { contributions: { totalCount: number }; repository: Repo }[];
            };
          };
        }>(
          `query($login: String!, $from: DateTime!, $to: DateTime!) { user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              commitContributionsByRepository(maxRepositories: 100) {
                contributions { totalCount } repository { ${REPO} } } } } }`,
          { login: github.user, from: `${y}-01-01T00:00:00Z`, to: `${y}-12-31T23:59:59Z` },
          token
        )
      )
    );

    const owners = new Set([github.user, ...github.orgs].map((o) => o.toLowerCase()));
    const repos = new Map<string, RepoStat>();
    for (const year of years) {
      for (const { contributions, repository: r } of year.user.contributionsCollection.commitContributionsByRepository) {
        if (r.isPrivate || r.isFork || !owners.has(r.owner.login.toLowerCase())) continue;
        const key = `${r.owner.login}/${r.name}`;
        const prev = repos.get(key);
        repos.set(key, {
          name: r.name,
          owner: r.owner.login,
          url: r.url,
          description: r.description,
          stars: r.stargazerCount,
          language: r.primaryLanguage?.name ?? null,
          commits: (prev?.commits ?? 0) + contributions.totalCount,
          pushedAt: r.pushedAt,
        });
      }
    }

    const list = [...repos.values()];
    // Featured: real involvement first (a 1-commit drive-by doesn't count), meaningful
    // star counts next, then commits; at most two per account so one org can't fill it.
    const weight = (r: RepoStat) => (r.stars >= github.minStars ? r.stars : 0);
    const perOwner = new Map<string, number>();
    const top = list
      .filter((r) => r.commits >= github.minCommits)
      .sort((a, b) => weight(b) - weight(a) || b.commits - a.commits)
      .filter((r) => {
        const n = (perOwner.get(r.owner) ?? 0) + 1;
        perOwner.set(r.owner, n);
        return n <= 2;
      })
      .slice(0, 4);
    return {
      contributions: user.contributionsCollection.contributionCalendar.totalContributions,
      repos: list.length,
      orgs: new Set(list.map((r) => r.owner).filter((o) => o !== github.user)).size,
      stars: list.reduce((sum, r) => sum + r.stars, 0),
      top,
    };
  } catch {
    return null;
  }
}
