import type { Metadata } from "next";
import { ResumeSection } from "@/components/sections/ResumeSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description:
    "Resume of Shaan Shoukath: backend engineer at Lascade, solution architect at LNO Technologies, with education, community roles and certifications.",
  path: "/resume",
  keywords: [
    "Shaan Shoukath resume",
    "Shaan Shoukath CV",
    "full-stack developer resume",
    "creative engineer resume",
  ],
});

export default function ResumePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Resume", path: "/resume" },
        ])}
      />
      <ResumeSection />
    </>
  );
}
