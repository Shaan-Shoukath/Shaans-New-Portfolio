import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Domains } from "@/components/sections/Domains";
import { getPortfolioContent } from "@/lib/content";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: "Skills",
  description:
    "Shaan Shoukath's skills: backend (Python, Django, Node.js, PostgreSQL), web and mobile apps, drones and robotics (ROS 2, ArduPilot), AI and ML, IoT and embedded.",
  path: "/skills",
});

export default async function SkillsPage() {
  const { domains } = await getPortfolioContent();
  return (
    <PageShell>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Skills", path: "/skills" }])} />
      <div className="skills-page">
        <Domains domains={domains} />
      </div>
    </PageShell>
  );
}
