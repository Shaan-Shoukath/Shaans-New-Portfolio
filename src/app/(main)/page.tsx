import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createPageMetadata,
  profilePageJsonLd,
  siteConfig,
} from "@/lib/seo";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: "/",
  type: "profile",
  keywords: [
    "official Shaan Shoukath",
    "Shaan Shoukath developer",
    "Shaan Shoukath portfolio",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={profilePageJsonLd("/")} />
      <h1 className="sr-only">
        Shaan Shoukath - Full-Stack Developer and Creative Engineer
      </h1>
      <p className="sr-only">
        Engineering anything: adaptive by default, turning unfamiliar, messy
        real-world problems into production systems across web, AI, robotics,
        IoT, infrastructure, and contact information.
      </p>
      <HomeClient />
    </>
  );
}
