"use client";

import dynamic from "next/dynamic";

const ResumeSection = dynamic(
  () =>
    import("@/components/sections/ResumeSection").then((mod) => ({
      default: mod.ResumeSection,
    })),
  { ssr: false }
);

export default function ResumePage() {
  return <ResumeSection />;
}
