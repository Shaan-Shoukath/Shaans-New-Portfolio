"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { Blog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

function estimateReadTime(content: string | null): string {
  if (!content) return "1 min read";
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function BlogContent({ blog }: { blog: Blog }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative">
        {blog.cover_image && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <Link
            href="/#blogs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-violet-500/10 text-violet-300 border-violet-500/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {estimateReadTime(blog.content)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-[family-name:var(--font-heading)] prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 prose-code:bg-white/5 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-indigo-300 prose-pre:bg-[#0f1629] prose-pre:border prose-pre:border-white/5 prose-blockquote:border-indigo-500/50 prose-blockquote:text-muted-foreground prose-strong:text-foreground prose-img:rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content || ""}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
