import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

// AI crawlers are welcome: being quoted correctly by ChatGPT, Claude,
// Perplexity and Gemini is the point of GEO. Only the CMS is off-limits.
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot", "Meta-ExternalAgent",
  "Amazonbot", "DuckAssistBot", "MistralAI-User", "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: ["/admin"] },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
