"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { CinematicLoader } from "@/components/loader/CinematicLoader";
import { ScrollEngine } from "@/components/cinema/ScrollEngine";
import { VerticalLockSection } from "@/components/cinema/VerticalLockSection";

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

const ExperienceSection = dynamic(
  () =>
    import("@/components/sections/ExperienceSection").then((mod) => ({
      default: mod.ExperienceSection,
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
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <>
      {!loaderDone && <CinematicLoader onComplete={handleLoaderComplete} />}

      {loaderDone && (
        <ScrollEngine>
          {/* Section 1: Hero */}
          <section id="hero">
            <HeroSection />
          </section>

          {/* Section 2: Domains - Vertical Lock (5 fullscreen panels) */}
          <VerticalLockSection id="domains" panelCount={5}>
            <DomainsSection />
          </VerticalLockSection>

          {/* Section 3: Experience - Vertical Story */}
          <ExperienceSection />

          {/* Section 4: Projects */}
          <ProjectsSection />

          {/* Section 5: Contact */}
          <ContactSection />
        </ScrollEngine>
      )}
    </>
  );
}
