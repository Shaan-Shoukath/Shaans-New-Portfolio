import type { MetadataRoute } from "next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.9 },
  { path: "/skills", changeFrequency: "monthly", priority: 0.85 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/resume", changeFrequency: "monthly", priority: 0.75 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
];

async function getPublishedBlogRoutes() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return [];

  try {
    const supabase = createSupabaseClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from("blogs")
      .select("slug, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data
      .filter((blog): blog is { slug: string; created_at: string } =>
        Boolean(blog.slug)
      )
      .map((blog) => ({
        url: absoluteUrl(`/blog/${blog.slug}`),
        lastModified: blog.created_at ? new Date(blog.created_at) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.65,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogRoutes = await getPublishedBlogRoutes();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...blogRoutes,
  ];
}
