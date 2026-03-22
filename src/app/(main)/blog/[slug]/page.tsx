import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogContent } from "./blog-content";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase
    .from("blogs")
    .select("title, content, tags")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!blog) return { title: "Post Not Found" };

  const description = blog.content?.slice(0, 160)?.replace(/[#*_`]/g, "") || "";

  return {
    title: `${blog.title} | Blog`,
    description,
    keywords: blog.tags,
  };
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

  return <BlogContent blog={blog} />;
}
