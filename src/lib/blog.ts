/** Plain text from markdown, for excerpts, meta descriptions and the RSS feed. */
export function excerpt(content: string | null | undefined, limit = 160) {
  if (!content) return "";
  const text = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`>~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > limit ? `${text.slice(0, limit).replace(/\s+\S*$/, "")}…` : text;
}

export function readingMinutes(content: string | null | undefined) {
  const words = content?.trim().split(/\s+/).length ?? 0;
  return Math.max(1, Math.round(words / 220));
}

export function postDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
