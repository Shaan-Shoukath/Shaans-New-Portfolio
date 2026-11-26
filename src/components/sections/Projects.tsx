import { SectionHead } from "./SectionHead";
import { ArrowUpRight, Github } from "lucide-react";
import Image from "next/image";
import { github as gh, productImages, projectExtras, workProducts } from "@/content/site";
import type { GitHubStats } from "@/lib/github";
import type { Project } from "@/lib/types";

type Panel = {
  key: string;
  title: string;
  text: string;
  stack: string;
  live: string | null;
  code: string | null;
  also?: { name: string; url: string }[];
  kind: string;
  image?: string;
  role?: string;
};

function Links({
  live,
  code,
  title,
  also,
}: {
  live: string | null;
  code: string | null;
  title: string;
  also?: { name: string; url: string }[];
}) {
  return (
    <div className="project__links">
      {also?.map((a) => (
        <a key={a.name} href={a.url} target="_blank" rel="noopener" className="link-pill" data-track={a.name}>
          {a.name} <ArrowUpRight aria-hidden="true" />
        </a>
      ))}
      {live && (
        <a href={live} target="_blank" rel="noopener" className="link-pill" data-track={`${title} live`}>
          Visit <ArrowUpRight aria-hidden="true" />
        </a>
      )}
      {code && (
        <a href={code} target="_blank" rel="noopener" className="link-pill link-pill--ghost" data-track={`${title} code`}>
          <Github aria-hidden="true" /> Code
        </a>
      )}
    </div>
  );
}

const count = (n: number) => n.toLocaleString("en-IN");

/** Real numbers as one sentence plus the most-starred repos, in the "More experiments" row style. */
function OnGitHub({ stats }: { stats: GitHubStats }) {
  const profile = `https://github.com/${gh.user}`;
  return (
    <div className="subsection" data-reveal>
      <h3 className="subsection__title" data-scramble>
        On GitHub
      </h3>
      <p className="gh-line">
        {count(stats.contributions)} contributions in the last year · {stats.repos} public repos
        {stats.orgs > 0 && ` across my account and ${stats.orgs} ${stats.orgs === 1 ? "org" : "orgs"}`}
      </p>
      <ul className="more-list">
        {stats.top.map((r) => (
          <li key={r.url} className="more">
            <div>
              <h4 className="more__title">{r.name}</h4>
              <p className="gh-meta">
                <span>{r.owner}</span>
                {r.language && <span>{r.language}</span>}
                {r.stars >= gh.minStars && <span aria-label={`${r.stars} stars`}>★ {r.stars}</span>}
                <span>{count(r.commits)} commits</span>
              </p>
              {r.description && <p className="more__text">{r.description}</p>}
            </div>
            <Links live={null} code={r.url} title={r.name} />
          </li>
        ))}
      </ul>
      <a href={profile} target="_blank" rel="noopener" className="gh-all" data-track="GitHub profile">
        Everything on GitHub <ArrowUpRight aria-hidden="true" />
      </a>
    </div>
  );
}

export function Projects({
  projects,
  level,
  github,
}: {
  projects: Project[];
  level?: "h1" | "h2";
  github?: GitHubStats | null;
}) {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  const panels: Panel[] = [
    ...featured.map((p) => ({
      key: p.id,
      title: p.title,
      text: p.description ?? "",
      stack: p.tech_stack.join(" · "),
      live: p.live_url,
      code: p.github_url,
      kind: "Open source & side builds",
      image: p.image_url ?? projectExtras(p).image,
      role: projectExtras(p).role,
    })),
    ...Object.entries(workProducts)
      .filter(([company]) => company === "Lascade" || company === "LNO Technologies")
      .flatMap(([company, list]) =>
        list
          .filter((w) => w.url)
          .map((w) => ({
            key: w.name,
            title: w.name,
            text: w.summary,
            stack: "",
            live: w.also ? null : w.url,
            code: null,
            also: w.also,
            kind: `Shipped at ${company}`,
            image: productImages[w.name],
            role: "Backend",
          }))
      ),
  ];

  return (
    <section id="projects" className="band band--projects" aria-labelledby="projects-title">
      <SectionHead level={level} id="projects" label="Projects" title="Things I've built" lede="Open-source tools, hardware builds and the products I ship at work." />

      {/* Desktop: pinned and driven sideways by scroll (MotionRuntime). Phones: a plain stack. */}
      <div className="gallery" data-gallery>
        <ol className="gallery__track">
          {panels.map((p, i) => {
            const href = p.live ?? p.also?.[0]?.url ?? p.code;
            const screen = p.image ? (
              <Image
                src={p.image}
                alt={`${p.title}: screenshot`}
                fill
                sizes="(max-width: 900px) 92vw, 34rem"
                className="panel__img"
                // Only the first two are near the fold; the rest load as they approach.
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
              />
            ) : (
              <span className="panel__grid" aria-hidden="true" />
            );
            return (
            <li key={p.key} className="panel">
              {/* The screenshot opens the project too; the buttons below stay the accessible links. */}
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener"
                  className="panel__screen"
                  tabIndex={-1}
                  aria-hidden="true"
                  data-track={`${p.title} screenshot`}
                  data-cursor-label={p.live || p.also ? "Visit" : "Code"}
                >
                  {screen}
                </a>
              ) : (
                <div className="panel__screen">{screen}</div>
              )}
              <div className="panel__body">
                <p className="panel__meta">
                  <span className="panel__index">
                    {String(i + 1).padStart(2, "0")}/{String(panels.length).padStart(2, "0")}
                  </span>
                  <span>{p.kind}</span>
                  {p.role && <span className="panel__role">{p.role}</span>}
                </p>
                <h3 className="panel__title">{p.title}</h3>
                <p className="panel__text">{p.text}</p>
                {p.stack && <p className="panel__stack">{p.stack}</p>}
                <Links live={p.live} code={p.code} title={p.title} also={p.also} />
              </div>
            </li>
            );
          })}
        </ol>
      </div>

      {github && github.top.length > 0 && <OnGitHub stats={github} />}

      {more.length > 0 && (
        <div className="subsection" data-reveal>
          <h3 className="subsection__title" data-scramble>
            More experiments
          </h3>
          <ul className="more-list">
            {more.map((p) => (
              <li key={p.id} className="more">
                <div>
                  <h4 className="more__title">{p.title}</h4>
                  {p.description && <p className="more__text">{p.description}</p>}
                </div>
                <Links live={p.live_url} code={p.github_url} title={p.title} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
