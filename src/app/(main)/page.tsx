"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { CinematicLoader } from "@/components/loader/CinematicLoader";
import { ScrollEngine } from "@/components/cinema/ScrollEngine";

const HeroDomainsSequence = dynamic(
  () =>
    import("@/components/sections/HeroDomainsSequence").then((mod) => ({
      default: mod.HeroDomainsSequence,
    })),
  { ssr: false }
);

const JourneySection = dynamic(
  () =>
    import("@/components/sections/JourneySection").then((mod) => ({
      default: mod.JourneySection,
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
          <HeroDomainsSequence />
          <JourneySection />
          <ProjectsSection />
          <ContactSection />
        </ScrollEngine>
      )}
    </>
  );
}

