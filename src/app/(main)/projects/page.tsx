import type { Metadata } from "next";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Selected work by Shaan Shoukath across full-stack web apps, SaaS platforms, UAV systems, IoT dashboards, and AI projects.",
  path: "/projects",
  keywords: [
    "Shaan Shoukath projects",
    "Shaan Shoukath work",
    "full-stack projects",
    "UAV projects",
    "IoT projects",
  ],
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
      />
      <ProjectsSection />
    </>
  );
}
