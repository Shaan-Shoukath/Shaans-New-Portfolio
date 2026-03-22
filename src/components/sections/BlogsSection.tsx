"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Blog } from "@/lib/types";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
} from "lucide-react";

function estimateReadTime(content: string | null): string {
  if (!content) return "1 min read";
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function BlogsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

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
  }, []);

  return (
    <SectionWrapper id="blogs">
      <AnimatedHeading subtitle="Thoughts, tutorials, and insights from my journey">
        Latest Blog Posts
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
            <Link key={blog.id} href={`/blog/${blog.slug}`}>
              <GlassCard
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer h-full"
              >
                {/* Cover Image */}
                {blog.cover_image && (
                  <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent" />
                  </div>
                )}

                {!blog.cover_image && (
                  <div className="h-32 -mx-6 -mt-6 mb-4 rounded-t-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-indigo-400/50" />
                  </div>
                )}

                <div className="space-y-3">
                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-violet-500/10 text-violet-300 border-violet-500/20 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(blog.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {estimateReadTime(blog.content)}
                    </span>
                  </div>

                  {/* Read more */}
                  <div className="flex items-center gap-1 text-sm text-indigo-400 group-hover:text-indigo-300 transition-colors pt-2">
                    Read more
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </GlassCard>
            </Link>
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
