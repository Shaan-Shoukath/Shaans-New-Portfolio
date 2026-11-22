import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { highlight } from "sugar-high";
import "./post-body.css";

// Kept free of server-only imports so the admin preview can render it too.
// Raw HTML in markdown is not rendered, so post content can't inject markup.
const components: Components = {
  code({ className, children }) {
    const source = String(children ?? "");
    const block = className?.startsWith("language-") || source.includes("\n");
    if (!block) return <code>{children}</code>;
    // sugar-high escapes the source and wraps tokens in spans coloured by CSS vars.
    return <code className={className} dangerouslySetInnerHTML={{ __html: highlight(source.replace(/\n$/, "")) }} />;
  },
  // Markdown images: lazy, with the optional "title" shown as a caption.
  img({ src, alt, title }) {
    if (typeof src !== "string") return null;
    return (
      <span className="post__figure">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary hosts and sizes from the editor */}
        <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
        {title && <span className="post__caption">{title}</span>}
      </span>
    );
  },
  a({ href, children }) {
    const external = href?.startsWith("http") && !href.includes("shaans.works");
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
        {children}
      </a>
    );
  },
};

/** Renders a post's markdown. Used by the post page (server) and the admin preview (client). */
export function PostBody({ content }: { content: string | null }) {
  return (
    <div className="post__body">
      {content?.trim() ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      ) : (
        <p>This post is still being written.</p>
      )}
    </div>
  );
}
