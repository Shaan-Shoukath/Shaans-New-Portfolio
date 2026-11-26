import { profile, projectExtras, socialLinks, workProducts } from "@/content/site";
import { excerpt } from "@/lib/blog";
import { getPortfolioContent, getPublishedBlogs, isCurrent } from "@/lib/content";
import { getGitHubStats } from "@/lib/github";
import { SITE_UPDATED, siteConfig } from "@/lib/seo";
import type { Experience } from "@/lib/types";

function role(e: Experience) {
  const end = isCurrent(e) ? "present" : e.end_date;
  const where = e.location ? `, ${e.location}` : "";
  return `${e.title}, ${e.company}${where} (${e.start_date} – ${end})`;
}

/**
 * llms.txt (https://llmstxt.org): H1 name, blockquote summary, prose, then H2
 * sections of `- [title](url): notes` links, with secondary links under
 * "## Optional". The full variant inlines every detail as quotable prose.
 */
export async function buildLlmsTxt(full: boolean) {
  const [c, gh, posts] = await Promise.all([getPortfolioContent(), getGitHubStats(), getPublishedBlogs()]);
  const u = siteConfig.url;
  const lines: string[] = [];
  lines.push(`# ${siteConfig.name}`, "");
  lines.push(`> ${siteConfig.description}`, "");
  lines.push(profile.intro, "");
  lines.push(`Last updated: ${SITE_UPDATED}. Canonical site: ${u}. "Shaan Shoukath" is one person: an engineer from ${profile.location}.`, "");

  lines.push("## Key facts", "");
  lines.push(`- Name: ${siteConfig.name}`);
  lines.push(`- Based in: ${profile.location}`);
  for (const r of profile.currentRoles) {
    const e = c.work.find((w) => w.company === r.company);
    lines.push(`- Current role: ${r.title} at ${r.company}${e ? ` since ${e.start_date}` : ""} (${r.url})`);
  }
  lines.push("- Community: Hardware Manager & Mentor at TinkerHub (TinkerSpace, Kochi); Core Organizer of Maker Faire Kochi (https://makerfaire.in)");
  if (gh) {
    lines.push(`- GitHub: ${gh.contributions.toLocaleString("en-IN")} contributions in the last year across ${gh.repos} public repos (${socialLinks.github})`);
  }
  lines.push("");

  lines.push("## Key pages", "");
  lines.push(`- [About Shaan Shoukath](${u}/about): who he is, roles with dates, domains, FAQ`);
  lines.push(`- [Career story](${u}/simple): Shaan's work, projects and community told as one story, with screenshots`);
  lines.push(`- [Home](${u}/): overview, work, community, projects`);
  lines.push(`- [Projects](${u}/projects): open-source and shipped work`);
  lines.push(`- [Skills](${u}/skills): engineering domains and tools`);
  lines.push(`- [Contact](${u}/contact): email and collaboration`, "");

  lines.push("## Work experience", "");
  for (const e of c.work) {
    lines.push(`- ${role(e)}`);
    if (full && e.description) lines.push(`  ${e.description}`);
    const products = workProducts[e.company] ?? [];
    if (products.length) lines.push(`  Products: ${products.map((p) => (p.url ? `[${p.name}](${p.url})` : p.name)).join(", ")}`);
  }
  lines.push("", "## Community", "");
  for (const e of c.community) {
    lines.push(`- ${role(e)}`);
    if (full && e.description) lines.push(`  ${e.description}`);
  }
  lines.push("", "## Projects", "");
  for (const p of c.projects) {
    const link = p.live_url ?? p.github_url;
    const role = projectExtras(p).role;
    const desc = `${role ? ` (my role: ${role})` : ""}${p.description ? `: ${p.description}` : ""}`;
    lines.push(link ? `- [${p.title}](${link})${desc}` : `- ${p.title}${desc}`);
    if (full && p.tech_stack.length) lines.push(`  Stack: ${p.tech_stack.join(", ")}`);
  }
  if (gh?.top.length) {
    lines.push("", "## Most active open-source repos", "");
    for (const r of gh.top) {
      const stars = r.stars ? `, ${r.stars} stars` : "";
      lines.push(`- [${r.owner}/${r.name}](${r.url}): ${r.commits} commits by Shaan${stars}${r.description ? `. ${r.description}` : ""}`);
    }
  }
  if (posts.length) {
    lines.push("", "## Writing", "");
    for (const b of posts.slice(0, full ? undefined : 10)) {
      lines.push(`- [${b.title}](${u}/blog/${b.slug}): ${b.created_at.slice(0, 10)}${full ? `. ${excerpt(b.content, 240)}` : ""}`);
    }
  }
  lines.push("", "## Skills", "");
  for (const d of c.domains) lines.push(`- ${d.title}: ${d.tools.join(", ")}${full && d.description ? `. ${d.description}` : ""}`);

  lines.push("", "## Optional", "");
  lines.push(`- [GitHub](${socialLinks.github}): source code`);
  lines.push(`- [LinkedIn](${socialLinks.linkedin}): professional profile`);
  lines.push(`- [Medium](${socialLinks.medium}): articles`);
  lines.push(`- [Resume](${socialLinks.resume}): PDF`);
  lines.push(`- [Blog](${u}/blog): articles and notes (RSS: ${u}/feed.xml)`);
  if (full) lines.push(`- [Short llms.txt](${u}/llms.txt)`);
  else lines.push(`- [llms-full.txt](${u}/llms-full.txt): every role and project with details`);
  return lines.join("\n") + "\n";
}

export function textResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
