import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { excerpt, postDate, readingMinutes } from "@/lib/blog";
import type { Blog } from "@/lib/types";

/**
 * Blog posts as rows. The home page passes `limit` and only renders this when
 * at least one post is published; /blog shows everything with an h1.
 */
export function Writing({ posts, limit, level }: { posts: Blog[]; limit?: number; level?: "h1" | "h2" }) {
  const shown = limit ? posts.slice(0, limit) : posts;
  return (
    <section id="writing" className="band band--writing" aria-labelledby="writing-title">
      <SectionHead
        level={level}
        id="writing"
        label="Writing"
        title="Notes from the bench"
        lede="What I learn building robots, drones, apps and the backends behind them."
      />
      <div className="subsection writing">
        {shown.length === 0 ? (
          <p className="writing__empty">The first posts are on the way.</p>
        ) : (
          <ol className="more-list">
            {shown.map((post) => (
              <li key={post.id} className="post-row">
                <Link href={`/blog/${post.slug}`} className="post-row__link" data-track={`Post ${post.slug}`}>
                  <p className="gh-meta">
                    <time dateTime={post.created_at}>{postDate(post.created_at)}</time>
                    <span>{readingMinutes(post.content)} min read</span>
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </p>
                  <h3 className="post-row__title">{post.title}</h3>
                  {post.content && <p className="more__text">{excerpt(post.content)}</p>}
                  <ArrowUpRight className="post-row__arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        )}
        {limit && posts.length > limit && (
          <Link href="/blog" className="gh-all">
            All {posts.length} posts <ArrowUpRight aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}
