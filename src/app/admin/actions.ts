"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Pushes an admin edit to the public site right away instead of waiting for the
 * hourly ISR refresh. Only a signed-in admin may call it.
 */
export async function refreshSite(blogSlugs: string[] = []) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  // Every page under the root layout (home, /projects, /about, /skills, /blog, …).
  revalidatePath("/", "layout");
  // Route handlers aren't covered by the layout, so name them.
  for (const path of ["/feed.xml", "/sitemap.xml", "/llms.txt", "/llms-full.txt"]) revalidatePath(path);
  for (const slug of new Set(blogSlugs.filter(Boolean))) revalidatePath(`/blog/${slug}`);
}
