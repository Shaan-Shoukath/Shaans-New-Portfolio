import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { CommunityLog } from "@/components/sections/CommunityLog";
import { Contact } from "@/components/sections/Contact";
import { DomainsStory } from "@/components/sections/DomainsStory";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Statement } from "@/components/sections/Statement";
import { WorkCases } from "@/components/sections/WorkCases";
import { Writing } from "@/components/sections/Writing";
import { PointStage } from "@/components/three/PointStage";
import { profile } from "@/content/site";
import { getPortfolioContent, getPublishedBlogs } from "@/lib/content";
import { getGitHubStats } from "@/lib/github";
import { createPageMetadata, homeJsonLd, siteConfig } from "@/lib/seo";

// Static HTML, rebuilt from Supabase at most hourly (ISR).
export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  description: siteConfig.description,
  path: "/",
  type: "profile",
});

export default async function HomePage() {
  const [content, github, posts] = await Promise.all([
    getPortfolioContent(),
    getGitHubStats(),
    getPublishedBlogs(),
  ]);
  const now = [...content.work, ...content.community]
    .filter((e) => !e.end_date && (profile.currentRoles.some((r) => r.company === e.company) || e.type === "social"))
    .map((e) => ({ role: e.title, org: e.company, since: e.start_date }));

  return (
    <main id="main">
      <JsonLd data={homeJsonLd(content)} />
      <div className="stage">
        <PointStage />
        <Hero />
        <Statement text={profile.intro} now={now} />
        <DomainsStory domains={content.domains} />
      </div>
      <WorkCases items={content.work} />
      <CommunityLog items={content.community} />
      <Projects projects={content.projects} github={github} />
      {/* Hidden until the first post is published: no "coming soon" on the home page. */}
      {posts.length > 0 && <Writing posts={posts} limit={3} />}
      <Contact />
    </main>
  );
}
