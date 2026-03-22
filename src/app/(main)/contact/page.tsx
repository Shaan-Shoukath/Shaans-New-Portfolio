"use client";

import dynamic from "next/dynamic";

const ContactSection = dynamic(
  () =>
    import("@/components/sections/ContactSection").then((mod) => ({
      default: mod.ContactSection,
    })),
  { ssr: false }
);

export default function ContactPage() {
  return <ContactSection />;
}
