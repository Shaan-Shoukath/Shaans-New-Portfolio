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
  description:
    "Official portfolio of Shaan Shoukath, full-stack developer and creative engineer building web, mobile, IoT, UAV, and AI projects.",
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
        Official portfolio for Shaan Shoukath covering selected projects,
        experience, web development, app development, IoT, UAV, robotics, AI,
        machine learning, and contact information.
      </p>
      <HomeClient />
    </>
  );
}
