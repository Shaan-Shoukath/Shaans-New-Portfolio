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
    "Shaan Shoukath robotics engineer Kochi",
    "Shaan Shoukath drone engineer",
    "Shaan Shoukath ROS 2",
    "Shaan Shoukath ArduPilot",
    "Shaan Shoukath geospatial AI",
    "Shaan Shoukath embedded systems",
    "Shaan Shoukath full-stack developer",
    "Shaan Shoukath Flutter developer",
    "Shaan Shoukath fintech",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={profilePageJsonLd("/")} />
      <h1 className="sr-only">
        Shaan Shoukath - Multidisciplinary Engineer in Kochi, Kerala
      </h1>
      <p className="sr-only">
        Shaan Shoukath is a Kochi, Kerala engineer working across autonomous
        drones and robotics, geospatial AI, edge and embedded systems, computer
        vision, full-stack web and mobile software, telecom, and fintech.
      </p>
      <HomeClient />
    </>
  );
}
