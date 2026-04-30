"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Blog } from "@/lib/types";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  Hash,
} from "lucide-react";

export function BlogsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function fetchBlogs() {
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (data) setBlogs(data);
      setLoading(false);
    }
    fetchBlogs();
  }, [supabase]);

  return (
    <SectionWrapper id="blogs">
      <AnimatedHeading subtitle="Thoughts, tutorials, and insights on building software">
        Latest Writings
      </AnimatedHeading>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <GlassCard
              key={blog.id}
              initial={{ opacity: 0, y: 40, rotateX: 4 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden flex flex-col"
            >
              {/* subtle shimmer line at top */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top section with cover image */}
              {blog.cover_image ? (
                <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                  <Image
                    src={blog.cover_image}
                    alt={blog.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    unoptimized
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent" />
                </div>
              ) : (
                <div className="h-28 -mx-6 -mt-6 mb-4 rounded-t-xl bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-violet-400/30" />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col flex-1 gap-3">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] group-hover:text-white transition-colors duration-300 leading-snug">
                  {blog.title}
                </h3>

                {blog.content && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                    {blog.content.replace(/[#*_`>\[\]]/g, "").slice(0, 150)}...
                  </p>
                )}

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-violet-500/[0.06] text-violet-300/80 border-violet-500/15 text-xs"
                      >
                        <Hash className="w-2.5 h-2.5 mr-0.5 opacity-60" />
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="bg-white/[0.03] text-muted-foreground border-white/[0.06] text-xs"
                      >
                        +{blog.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Read more link */}
                <div className="pt-3 border-t border-white/[0.06] mt-auto">
                  <a
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200 group/link"
                  >
                    Read Article
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {!loading && blogs.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            No blog posts yet. Start writing in the admin dashboard!
          </p>
        </div>
      )}
    </SectionWrapper>
  );
}
