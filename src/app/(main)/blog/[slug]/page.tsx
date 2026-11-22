import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostBody } from "@/components/blog/PostBody";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { excerpt, postDate, readingMinutes } from "@/lib/blog";
import { getBlog, getPublishedBlogs } from "@/lib/content";
import { absoluteUrl, breadcrumbJsonLd, createPageMetadata, siteConfig } from "@/lib/seo";

// Static per post, refreshed hourly; new slugs render on first visit.
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getPublishedBlogs()).map((b) => ({ slug: b.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) {
    return createPageMetadata({
      title: "Post not found",
      description: `This post could not be found on ${siteConfig.domain}.`,
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }
  return createPageMetadata({
    title: blog.title,
    description: excerpt(blog.content, 155) || `${blog.title}, by Shaan Shoukath.`,
    path: `/blog/${slug}`,
    keywords: blog.tags,
    image: blog.cover_image || siteConfig.ogImage,
    type: "article",
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();
  const url = absoluteUrl(`/blog/${blog.slug}`);

  return (
    <PageShell>
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
          "@id": `${url}#article`,
          headline: blog.title,
          description: excerpt(blog.content, 155),
          image: blog.cover_image ? absoluteUrl(blog.cover_image) : undefined,
          datePublished: blog.created_at,
          dateModified: blog.created_at,
          author: { "@id": `${siteConfig.url}/#person` },
          publisher: { "@id": `${siteConfig.url}/#person` },
          mainEntityOfPage: url,
          keywords: blog.tags,
          wordCount: blog.content?.trim().split(/\s+/).length ?? 0,
          inLanguage: "en",
          isPartOf: { "@id": `${absoluteUrl("/blog")}#blog` },
        }}
      />
      <article className="band post">
        <Link href="/blog" className="post__back">
          <ArrowLeft aria-hidden="true" /> All posts
        </Link>
        <header className="post__head">
          <p className="gh-meta">
            <time dateTime={blog.created_at}>{postDate(blog.created_at)}</time>
            <span>{readingMinutes(blog.content)} min read</span>
            {blog.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
          <h1 className="post__title">{blog.title}</h1>
        </header>
        {blog.cover_image && (
          <Image
            src={blog.cover_image}
            alt=""
            width={1200}
            height={675}
            sizes="(min-width: 800px) 46rem, 100vw"
            unoptimized
            priority
            className="post__cover"
          />
        )}
        <PostBody content={blog.content} />
      </article>
    </PageShell>
  );
}
