import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  fallbackDomains,
  fallbackExperiences,
  fallbackProjects,
} from "@/content/site";
import type { Blog, Domain, Experience, Project } from "@/lib/types";

/**
 * Server-side content loader. Uses a cookie-less Supabase client so pages stay
 * statically rendered (ISR) and every word lands in the HTML crawlers read.
 * Falls back to src/content/site.ts per table when Supabase is unavailable.
 */

const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

/** "May 2026" | "APRIL 2026" | "2026" → sortable number (yyyymm). */
export function dateValue(value: string | null | undefined): number {
  if (!value || /present|current|now/i.test(value)) return 999999;
  const year = Number(value.match(/\d{4}/)?.[0] ?? 0);
  const monthIndex = MONTHS.findIndex((m) =>
    value.toLowerCase().includes(m)
  );
  return year * 100 + (monthIndex >= 0 ? monthIndex + 1 : 1);
}

export function isCurrent(e: Experience) {
  return !e.end_date || /present|current|now/i.test(e.end_date);
}

function byRecency(a: Experience, b: Experience) {
  const current = Number(isCurrent(b)) - Number(isCurrent(a));
  if (current) return current;
  // Current roles follow the admin's order_index so the lead role is chosen.
  if (isCurrent(a)) return a.order_index - b.order_index;
  const end = dateValue(b.end_date) - dateValue(a.end_date);
  if (end) return end;
  const start = dateValue(b.start_date) - dateValue(a.start_date);
  return start || a.order_index - b.order_index;
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function rows<T>(
  table: string,
  filter: "published" | null,
  fallback: T[]
): Promise<T[]> {
  const supabase = client();
  if (!supabase) return fallback;
  try {
    let query = supabase.from(table).select("*").order("order_index");
    if (filter) query = query.eq(filter, true);
    const { data, error } = await query;
    if (error || !data?.length) return fallback;
    return data as T[];
  } catch {
    return fallback;
  }
}

export type PortfolioContent = {
  domains: Domain[];
  work: Experience[];
  community: Experience[];
  projects: Project[];
};

export const getPortfolioContent = cache(
  async (): Promise<PortfolioContent> => {
    const [domains, experiences, projects] = await Promise.all([
      rows<Domain>("domains", null, fallbackDomains),
      rows<Experience>("experiences", "published", fallbackExperiences),
      rows<Project>("projects", "published", fallbackProjects),
    ]);

    const normalized = experiences.map((e) => ({
      ...e,
      location: e.location ?? null,
      tags: e.tags ?? [],
    }));

    return {
      domains,
      work: normalized
        .filter((e) => e.type === "professional" || e.type === "freelance")
        .sort(byRecency),
      community: normalized
        .filter((e) => e.type === "social" || e.type === "education")
        .sort(byRecency),
      projects: projects.map((p) => ({ ...p, tech_stack: p.tech_stack ?? [] })),
    };
  }
);

/** Published posts, newest first. Empty without Supabase or on error. */
export const getPublishedBlogs = cache(async (): Promise<Blog[]> => {
  const supabase = client();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return error || !data ? [] : (data as Blog[]).map((b) => ({ ...b, tags: b.tags ?? [] }));
  } catch {
    return [];
  }
});

export const getBlog = cache(async (slug: string): Promise<Blog | null> => {
  const supabase = client();
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data ? { ...(data as Blog), tags: (data as Blog).tags ?? [] } : null;
  } catch {
    return null;
  }
});
