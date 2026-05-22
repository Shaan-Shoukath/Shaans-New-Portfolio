import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  siteConfig,
} from "@/lib/seo";
import { BlogContent } from "./blog-content";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

function plainTextExcerpt(content: string | null | undefined, limit = 155) {
  if (!content) return "";
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_`>\[\]().-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase
    .from("blogs")
    .select("title, content, tags, cover_image")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!blog) {
    return createPageMetadata({
      title: "Post Not Found",
      description: `This Shaan Shoukath blog post could not be found on ${siteConfig.domain}.`,
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: blog.title,
    description:
      plainTextExcerpt(blog.content) ||
      `Read ${blog.title} by Shaan Shoukath on software engineering and product development.`,
    path: `/blog/${slug}`,
    keywords: blog.tags ?? [],
    image: blog.cover_image || siteConfig.ogImage,
    type: "article",
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!blog) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: blog.title, path: `/blog/${blog.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${absoluteUrl(`/blog/${blog.slug}`)}#article`,
          headline: blog.title,
          description: plainTextExcerpt(blog.content),
          image: blog.cover_image ? absoluteUrl(blog.cover_image) : undefined,
          datePublished: blog.created_at,
          dateModified: blog.created_at,
          author: {
            "@id": `${siteConfig.url}/#person`,
          },
          publisher: {
            "@id": `${siteConfig.url}/#person`,
          },
          mainEntityOfPage: absoluteUrl(`/blog/${blog.slug}`),
          keywords: blog.tags,
        }}
      />
      <BlogContent blog={blog} />
    </>
  );
}
