"use client";

import dynamic from "next/dynamic";

const BlogsSection = dynamic(
  () =>
    import("@/components/sections/BlogsSection").then((mod) => ({
      default: mod.BlogsSection,
    })),
  { ssr: false }
);

export default function BlogPage() {
  return <BlogsSection />;
}
