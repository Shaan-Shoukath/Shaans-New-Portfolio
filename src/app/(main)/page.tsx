"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { CinematicLoader } from "@/components/loader/CinematicLoader";
import { ScrollEngine } from "@/components/cinema/ScrollEngine";

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
          {/* Section 1: Hero (Dulcedo-style) — full viewport */}
          <section id="hero">
            <HeroSection />
          </section>

          {/* Section 2: Domains — Manages its own horizontal entrance + vertical split scroll internally */}
          <DomainsSection />

          {/* Section 3: Experience/Journey — Uses its own horizontal entrance */}
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
