"use client";

import dynamic from "next/dynamic";

const ProjectsSection = dynamic(
  () =>
    import("@/components/sections/ProjectsSection").then((mod) => ({
      default: mod.ProjectsSection,
    })),
  { ssr: false }
);

export default function ProjectsPage() {
  return <ProjectsSection />;
}
