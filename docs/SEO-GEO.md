# SEO + GEO checklist (things code cannot do), ordered by impact

Canonical host: https://www.shaans.works (apex redirects to www).

1. **Fix the apex redirect.** In Vercel > Domains, change `shaans.works` -> `www.shaans.works` from 307 to 308 (permanent), so link equity consolidates on www.
2. **Google Search Console.** Add the `https://www.shaans.works` URL-prefix property (or a Domain property via DNS). Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel, redeploy, verify. Submit `https://www.shaans.works/sitemap.xml`, then request indexing for `/`, `/about`, `/projects`.
3. **Bing Webmaster Tools.** Same flow with `NEXT_PUBLIC_BING_SITE_VERIFICATION` (meta `msvalidate.01`); you can import from Search Console. Submit the sitemap. Bing's index feeds ChatGPT search, Copilot and others, so this matters for GEO.
4. **Run Supabase migration 008** (`supabase/migrations/008_portfolio_revamp.sql`) so live data matches `site.ts` (roles, dates, locations); otherwise pages fall back to `site.ts`.
5. **Consistent bios off-site.** Use the same name ("Shaan Shoukath"), city (Kochi, Kerala, India), roles and start dates (Backend Engineer, Lascade, May 2026; Solution Architect, LNO Technologies, Feb 2026) on GitHub, LinkedIn, Medium, X, TinkerHub, Maker Faire Kochi (makerfaire.in), Lascade and LNO team pages. Link every one back to https://www.shaans.works. Set the GitHub profile website field and a profile README that links the site.
6. **Get cited.** Publish a few technical posts (Medium, dev.to, own /blog) and talks (Arduino Day, Raspberry Pi Jam, Maker Faire Kochi) that mention "Shaan Shoukath" with a link to /about. AI engines quote pages that other pages reference. Ask Maker Faire / TinkerHub / Lascade / LNO to list you with a link.
7. **Analytics env vars.** Set `NEXT_PUBLIC_CLARITY_ID` and the `NEXT_PUBLIC_FIREBASE_*` vars in Vercel to measure referrals (including AI referrers such as chatgpt.com, perplexity.ai).
8. **Validate.** Run https://search.google.com/test/rich-results and https://validator.schema.org on `/`, `/about`; check `/llms.txt`, `/robots.txt`, `/sitemap.xml` load on the www host. Use URL Inspection in Search Console after deploys.
9. **Wikidata item (optional).** Only if you meet notability; a sourced item gives AI engines a stable entity ID. Then add its URL to `sameAs` in `src/lib/seo.ts`.
10. **IndexNow (optional).** Bing/Yandex accept instant URL pings. Generate a key, host `/<key>.txt`, ping `https://api.indexnow.org/indexnow` after publishing posts. Google does not use it.
11. **Check AI visibility monthly.** Ask ChatGPT, Claude, Perplexity and Gemini "Who is Shaan Shoukath?" and fix any wrong facts at the source pages (usually LinkedIn or an old bio).

## What the code already does
- Unique titles/descriptions, canonical URLs, OG/Twitter cards, generated share image.
- JSON-LD: Person (sameAs GitHub, LinkedIn, Medium), WebSite, ProfilePage, roles with ISO dates, ItemList, FAQPage, BreadcrumbList. `dateModified` comes from `SITE_UPDATED` in `src/lib/seo.ts`; bump it when content changes.
- robots.txt allows search and AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bingbot, Amazonbot, DuckAssistBot and more); `/admin` is blocked.
- `/llms.txt` and `/llms-full.txt` follow llmstxt.org (H1, blockquote, link lists, Optional section). Adoption by AI vendors is uneven; it is cheap and harmless.
