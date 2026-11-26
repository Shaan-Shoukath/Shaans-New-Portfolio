import type { MetadataRoute } from "next";
import { getPublishedBlogs } from "@/lib/content";
import { SITE_UPDATED, absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  noLastMod?: boolean;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/simple", changeFrequency: "monthly", priority: 0.8, noLastMod: true },
  { path: "/projects", changeFrequency: "monthly", priority: 0.85 },
  { path: "/skills", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/resume", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

async function getPublishedBlogRoutes() {
  return (await getPublishedBlogs()).map((blog) => ({
    url: absoluteUrl(`/blog/${blog.slug}`),
    lastModified: new Date(blog.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updated = new Date(SITE_UPDATED);
  const blogRoutes = await getPublishedBlogRoutes();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      ...(route.noLastMod ? {} : { lastModified: updated }),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...blogRoutes,
  ];
}
