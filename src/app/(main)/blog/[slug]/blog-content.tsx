"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Blog } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Hash,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface BlogContentProps {
  blog: Blog;
}

export function BlogContent({ blog }: BlogContentProps) {
  return (
    <article className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/#blogs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to all posts
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          {/* Meta info */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-violet-500/[0.08] text-violet-300/90 border-violet-500/15 text-xs"
                >
                  <Hash className="w-3 h-3 mr-0.5 opacity-60" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </motion.header>

        {/* Cover Image */}
        {blog.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden mb-10 border border-white/[0.06]"
          >
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-[family-name:var(--font-heading)]
            prose-headings:text-white
            prose-p:text-white/70
            prose-p:leading-relaxed
            prose-a:text-indigo-400
            prose-a:no-underline
            hover:prose-a:text-indigo-300
            prose-strong:text-white/90
            prose-code:text-indigo-300
            prose-code:bg-white/[0.06]
            prose-code:px-1.5
            prose-code:py-0.5
            prose-code:rounded-md
            prose-code:text-sm
            prose-pre:bg-white/[0.04]
            prose-pre:border
            prose-pre:border-white/[0.06]
            prose-pre:rounded-xl
            prose-blockquote:border-indigo-500/40
            prose-blockquote:text-white/60
            prose-li:text-white/70
            prose-hr:border-white/[0.08]
          "
        >
          {blog.content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: formatMarkdown(blog.content),
              }}
            />
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                This post doesn&apos;t have any content yet.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </article>
  );
}

/**
 * Minimal markdown-to-HTML conversion for blog content.
 * Handles headings, bold, italic, code blocks, inline code,
 * links, lists, blockquotes, horizontal rules, and paragraphs.
 */
function formatMarkdown(md: string): string {
  let html = md
    // Code blocks (``` ... ```)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) => {
      return `<pre><code class="language-${lang || ""}">${escapeHtml(code.trim())}</code></pre>`;
    })
    // Blockquotes
    .replace(/^>\s+(.+)$/gm, "<blockquote><p>$1</p></blockquote>")
    // Headings
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr />")
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Unordered lists
    .replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((<li>.*?<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Wrap remaining lines in <p> tags
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<hr")
      ) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
