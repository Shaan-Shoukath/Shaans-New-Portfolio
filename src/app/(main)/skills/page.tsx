"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

// Code-split heavy interactive scroll sections
const UAVSection = dynamic(
  () =>
    import("@/components/scroll/UAVSection").then((mod) => ({
      default: mod.UAVSection,
    })),
  { ssr: false }
);
const WebDevSection = dynamic(
  () =>
    import("@/components/scroll/WebDevSection").then((mod) => ({
      default: mod.WebDevSection,
    })),
  { ssr: false }
);
const AppDevSection = dynamic(
  () =>
    import("@/components/scroll/AppDevSection").then((mod) => ({
      default: mod.AppDevSection,
    })),
  { ssr: false }
);
const IoTSection = dynamic(
  () =>
    import("@/components/scroll/IoTSection").then((mod) => ({
      default: mod.IoTSection,
    })),
  { ssr: false }
);

export default function SkillsPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <UAVSection />
        <WebDevSection />
        <AppDevSection />
        <IoTSection />
      </main>
      <Footer />
    </>
  );
}
