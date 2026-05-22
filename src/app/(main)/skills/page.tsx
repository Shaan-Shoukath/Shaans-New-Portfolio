import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { IoTSection } from "@/components/scroll/IoTSection";
import { AppDevSection } from "@/components/scroll/AppDevSection";
import { UAVSection } from "@/components/scroll/UAVSection";
import { WebDevSection } from "@/components/scroll/WebDevSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Skills",
  description:
    "Technical skills and engineering domains for Shaan Shoukath: web development, app development, UAV and robotics, IoT, embedded systems, and AI.",
  path: "/skills",
  keywords: [
    "Shaan Shoukath skills",
    "Shaan Shoukath web development",
    "Shaan Shoukath app development",
    "Shaan Shoukath UAV",
    "Shaan Shoukath IoT",
    "Shaan Shoukath AI",
  ],
});

export default function SkillsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Skills", path: "/skills" },
        ])}
      />
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
