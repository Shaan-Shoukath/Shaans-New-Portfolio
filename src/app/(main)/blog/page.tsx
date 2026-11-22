import type { Metadata } from "next";
import { BlogsSection } from "@/components/sections/BlogsSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Articles and notes from Shaan Shoukath on software engineering, backend systems, AI, IoT, drones and building products.",
  path: "/blog",
  keywords: [
    "Shaan Shoukath blog",
    "software engineering blog",
    "full-stack development articles",
    "AI articles",
    "IoT articles",
  ],
});

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <BlogsSection />
    </>
  );
}
