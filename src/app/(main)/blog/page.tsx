import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Writing } from "@/components/sections/Writing";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedBlogs } from "@/lib/content";
import { absoluteUrl, breadcrumbJsonLd, createPageMetadata, siteConfig } from "@/lib/seo";

// Server-rendered from Supabase so every post link is in the HTML crawlers read.
export const revalidate = 3600;

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

export default async function BlogPage() {
  const posts = await getPublishedBlogs();
  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${absoluteUrl("/blog")}#blog`,
          name: `${siteConfig.name}: Writing`,
          url: absoluteUrl("/blog"),
          author: { "@id": `${siteConfig.url}/#person` },
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: absoluteUrl(`/blog/${p.slug}`),
            datePublished: p.created_at,
          })),
        }}
      />
      <Writing posts={posts} level="h1" />
    </PageShell>
  );
}
