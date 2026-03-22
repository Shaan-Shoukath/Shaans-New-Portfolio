"use client";

import dynamic from "next/dynamic";

const HeroSection = dynamic(
  () =>
    import("@/components/sections/HeroSection").then((mod) => ({
      default: mod.HeroSection,
    })),
  { ssr: false }
);
const DomainsSection = dynamic(
  () =>
    import("@/components/sections/DomainsSection").then((mod) => ({
      default: mod.DomainsSection,
    })),
  { ssr: false }
);
const ProjectsSection = dynamic(
  () =>
    import("@/components/sections/ProjectsSection").then((mod) => ({
      default: mod.ProjectsSection,
    })),
  { ssr: false }
);
const ContactSection = dynamic(
  () =>
    import("@/components/sections/ContactSection").then((mod) => ({
      default: mod.ContactSection,
    })),
  { ssr: false }
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DomainsSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
