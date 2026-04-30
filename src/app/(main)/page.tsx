"use client";

import { useCallback, useLayoutEffect, useState } from "react";
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

  const shouldResetHomeScroll = useCallback(() => {
    return window.location.pathname === "/" && window.location.hash === "";
  }, []);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (shouldResetHomeScroll()) {
      window.scrollTo(0, 0);
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && shouldResetHomeScroll()) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [shouldResetHomeScroll]);

  const handleLoaderComplete = useCallback(() => {
    if (shouldResetHomeScroll()) {
      window.scrollTo(0, 0);
    }
    setLoaderDone(true);
  }, [shouldResetHomeScroll]);

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

