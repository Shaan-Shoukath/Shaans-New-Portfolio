import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Projects } from "@/components/sections/Projects";
import { getPortfolioContent } from "@/lib/content";
import { getGitHubStats } from "@/lib/github";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Projects by Shaan Shoukath: SpaceWorks makerspace software, makerfaire.in, Arkairo autonomous drones, LMusic, plus eSIM and ISP billing products shipped at work.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const [{ projects }, github] = await Promise.all([getPortfolioContent(), getGitHubStats()]);
  return (
    <PageShell>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }])} />
      <Projects projects={projects} level="h1" github={github} />
    </PageShell>
  );
}
