# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. The site runs at https://www.shaans.works (the www host is canonical, and the apex redirects to it).

## Commands

```bash
npm run dev          # Start development server
npm run dev:clean    # Clean .next cache then start dev server
npm run build        # Production build
npm run start        # Run production server
npm run lint         # ESLint validation (only automated quality check — no test suite)
npm run clean        # Remove .next build directory
```

`NEXT_DIST_DIR=.next-prod npm run build` writes to a separate folder, so a production build can run beside `next dev`. The `/admin` prerender needs the Supabase env vars, even placeholder values.

## Environment Setup

Copy `.env.example` to `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project. Without them the public site falls back to `src/content/site.ts`.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin account.
- Optional analytics: `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID`, `_MEASUREMENT_ID`.
- Optional search console: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
- Optional `GITHUB_TOKEN`: a fine-grained token with public read-only access, used for the "On GitHub" block. Without it the block is hidden.

## Architecture

### Routes
- `src/app/(main)/`: public pages. `page.tsx` (home), `about` (long-form + FAQ JSON-LD), `projects`, `skills`, `contact`, `blog`, `blog/[slug]`, `resume`, `simple`. The layout adds `SiteHeader`, `IntroLoader`, `Cursor`, `MotionRuntime`, `Analytics` and loads `portfolio.css` (public-only styles).
- `src/app/admin/`: Supabase CMS for exactly what the site reads: Domains, Experience, Projects and Blogs. It is protected by `src/middleware.ts`, `useAdminGuard` and RLS.
  - Every save, publish toggle and delete calls `refreshSite()` (`admin/actions.ts`, a server action that checks the Supabase session). It revalidates every page plus the feed, sitemap and llms routes, so edits go live at once instead of after the hourly ISR.
  - The old About and Hero Images screens were removed: nothing on the revamped site read them. The intro lives in `site.ts`.
  - Blog editor: Markdown with Write/Preview. The preview uses the same `PostBody` as the live page. There's a cover upload, and images can be inserted with the button, pasted or dropped; they go to Storage `portfolio/blog/`. `![alt](url "Caption")` adds a caption. A post's date is set when it is first published.
- `/simple`: hidden "career story" (linked from no nav, only the sitemap and both llms files). It's a one-column, fuadsan.in-style page: bench banner with "Engineering anything." in HTML, intro, then chapters `#story-now`, `-before`, `-built`, `-community`, `-domains`, `-contact`. Everything comes from `getPortfolioContent` and `site.ts`. JSON-LD is a breadcrumb plus a ProfilePage pointing at `#person`. `/about` stays the fact sheet + FAQ.
  - Banner: `public/simple/bench-banner.webp` (2400×840) and `bench-banner-mobile.webp` (1400×760, ≤640px via `<picture>` + `getImageProps`) are static renders of the real Workshop. To regenerate: headless Chromium, 2400×1000 viewport, `reducedMotion: 'reduce'` (skips the loader, static frame), wait for `.point-field.is-ready canvas`, hide `.site-header, .hero__text, .scroll-progress`, screenshot `.point-stage`. Crop y 60–900 (desktop) and x 520–1920 / y 100–860 (mobile), then `cwebp -q 80`.
- `src/app/llms.txt`, `src/app/llms-full.txt`: route handlers built by `src/lib/llms.ts`. They include the GitHub line, the most active repos and the post list.
- `src/app/feed.xml`: RSS 2.0 of published posts. Every page links it through `alternates.types` in `createPageMetadata`.
- Blog: `/blog` and `/blog/[slug]` are server-rendered from `getPublishedBlogs` / `getBlog` in `content.ts` (cookie-less, ISR 1h). `/blog` has `Blog` JSON-LD and each post has `BlogPosting`. Post Markdown renders through `src/components/blog/PostBody.tsx`: react-markdown + GFM with no raw HTML, sugar-high code highlighting (tokens themed in `post-body.css`), and lazy images with captions.
- `robots.ts` (allows AI crawlers, blocks `/admin`), `sitemap.ts`, `opengraph-image.tsx` / `twitter-image.tsx` (generated share card), `not-found.tsx` (noindex, own title, Mini Shaan meme).
- Every public page has exactly one `<h1>`. `SectionHead` takes `level` (h1 on `/projects` and `/contact`, h2 on home).

### Content and data
- **`src/content/site.ts` is canonical content.** It holds `profile` (intro, brief, current roles), `fallbackExperiences`, `fallbackProjects` (featured = the repos pinned on GitHub), `fallbackDomains`, `socialLinks`, and `workProducts` (products per company, keyed by experience company name and shown on roles and in "Shipped at work").
- **`src/lib/content.ts`** (`getPortfolioContent`) reads Supabase on the server with a cookie-less client, so pages stay static. Each table falls back to `site.ts` independently when Supabase is unreachable or empty. It splits experiences into `work` (professional/freelance) and `community` (social/education). Current roles are sorted by `order_index`, past ones by date.
- Pages using it export `revalidate = 3600` (ISR). Every word is in the HTML, with no client-side fetching on public pages.
- Experience `type: "social"` is labelled "Community" in the admin. `location` is a free-text column (migration 008).
- `supabase/migrations/008_portfolio_revamp.sql` is generated from `site.ts`. It is non-destructive: old rows are unpublished, never deleted, and it is safe to re-run. Regenerate it whenever `site.ts` changes and should be pushed to the DB.
- Migrations are tracked by the Supabase CLI. The project is linked as `qmvqdmannocfkohbhtku` ("Portfolio"). 001–008 were marked applied with `migration repair` on 2026-11-26, because they ran before tracking existed. For DB changes, add a new numbered migration (e.g. `009_oxpel_end_date.sql`), then run `supabase db push --remote --dry-run` and `supabase db push --remote`. Don't edit an already-applied file and expect it to re-run. Keep 008 in sync with `site.ts` anyway, as the full re-seed reference.

### Home page sections (`src/components/sections/`)
Order: `Hero` → `Statement` → `DomainsStory` (all inside `.stage` with the 3D canvas) → `Timeline` work → `Timeline` community → `Projects` → `Writing` (only when a post is published) → `Contact`.
- `Chapter`: section opener with a label column and a title using one `<em>` serif accent word (`data-split="title"`).
- `Hero`: "Engineering anything." headline (`data-split="hero"`), brief, CTAs, meta bar (status, `KochiClock`).
- `Statement`: intro paragraph that lights up word by word on scroll.
- `DomainsStory`: pinned scrollytelling. Scroll progress picks the active domain and calls `emitShape`, which drives the 3D camera.
- `Timeline`: role rows (dates, location, products, tags). `featureLead` highlights the first current community role (TinkerHub).
- `Projects`: at 1024px and up, a pinned horizontal gallery driven by scroll. Below that, the same track is a native swipe row (scroll-snap, the next card peeks in). The screenshot links to the project (`aria-hidden`, out of tab order; the pills stay the accessible links). Only the first two screenshots load eagerly. "On GitHub" follows the gallery, then "More experiments".
  - "On GitHub" (`src/lib/github.ts`, GraphQL, cached 24h): one mono sentence (contributions in the last year, public repos across the account and orgs), then up to 4 repo rows.
  - It only counts public non-fork repos he has committed to, owned by `github.user` or one of `github.orgs` in `site.ts`. An org's popular repo he never touched must not count.
  - Featured repos need at least `minCommits` (10) of his commits. They rank by stars, counting only stars at or above `minStars` (5), then by commits, with at most two per account.
- `Writing`: post rows (date, reading time, tags, title, excerpt). The home page shows 3 (`limit`); `/blog` shows all with an h1 and an empty state.
- `Contact`: red band, Gmail-draft form (no backend).
- `Domains` (static list) is used only by `/skills`. `Marquee` and `ResumeSection` are legacy or other-page components.

### 3D workbench (`src/components/three/`)
- `PointStage` mounts `Workshop` lazily: dynamic import after `requestIdleCallback`, and only with WebGL and no Save-Data. three.js stays in its own chunk.
- `Workshop.tsx`: on touch devices it renders at a 1.25 pixel ratio with no antialiasing and no pointer parallax. One renderer drawing an outlined blueprint-noir bench (fills plus `EdgesGeometry` lines, fog, grid) with one object per station: server rack, laptop, phone, drone, AI hologram, ESP32 board.
  - The camera lerps between `SHOTS`, and the active station's edges take its accent.
  - Rendering pauses offscreen or when the tab is hidden, and draws static frames under reduced motion.
  - Teardown disposes every geometry and material.
- `stations.ts`: `ShapeName` + `shapeForDomain(title)` keyword mapping.
- `shape-events.ts`: window event bus (`emitShape`, `latestShape`) so a late-mounting canvas starts on the right shot. `[data-shape]` elements (the hero) are observed by `PointStage`.

### Motion (`src/components/motion/`)
- `MotionRuntime`: Lenis driven by `gsap.ticker` and synced to ScrollTrigger.
  - SplitText masked reveals for `[data-split]`, batched `[data-reveal]` entrances, and scrubbed clip-path opening for `[data-band-open]` bands.
  - Hero timeline held until the loader dispatches `INTRO_DONE`.
  - Magnetic (`data-magnetic`) and spotlight (`data-spotlight`) helpers.
  - Everything sits inside `gsap.context` and is reverted on unmount. Reduced motion skips it all.
- `Cursor`: one red dot locked to the pointer (no trailing element). It becomes a ring over interactive elements and a labelled pill over `[data-cursor-label]`. Mouse/trackpad only (`(hover: hover) and (pointer: fine)`, re-checked on change); touch and reduced motion keep the system cursor. Right-click, blur, drag and window-leave are all handled.
- Bench light: `MotionRuntime` writes `--bench` on `.point-stage` from scroll. The 3D field dims behind the statement, returns for the domains story, and fades out before the work band. The statement has no background while `js-motion` is set, so no opaque sheet slides over the bench.
- Content is visible by default. The only pre-hidden element is the hero title (`html.js-motion`, set by the inline script in the root layout), and it has a CSS failsafe.

### Layout (`src/components/layout/`)
- `SiteHeader`: wordmark, section links (scroll via `scrollToId`), "Let's talk" CTA, mobile menu. It hides on scroll down.
  - The solid background and blur live on `.site-header::before`. `backdrop-filter` on the header itself would make it the containing block of the fixed menu overlay, which then collapses to header height after scrolling.
  - Phone menu (≤900px): the closed nav is `inert`. While open, the header's siblings are `inert`, Tab wraps inside the header, and Escape closes and refocuses the button. Phone-only extras are `.site-header__more` (Blog, Resume, Contact) and a `Shaan Shoukath` home link on non-home pages.
- `IntroLoader`: first visit per session only. Mini Shaan runs along a progress bar (~1.5s), then the curtain lifts. `INTRO_SKIP_SCRIPT` in the root layout marks repeat visits before paint. **Mini Shaan appears only in the loader and in the 404 meme** (`src/app/not-found.tsx`: two panels, `wait` shrug then `facepalm`). The sprite is `public/mini-shaan/sheet-v1.webp` (8×9 cells, 144×156), animated by CSS `steps()` in `MiniShaan.tsx`.
- `PageShell`: `<main>` wrapper for standalone pages.

### SEO / GEO
- `src/lib/seo.ts`: `siteConfig` (www canonical), `createPageMetadata`, `breadcrumbJsonLd`, `personJsonLd` (worksFor Lascade + LNO, memberOf TinkerHub + Maker Faire Kochi, alumniOf CUSAT), `websiteJsonLd`, and `homeJsonLd` (ProfilePage + roles + ItemList of projects and shipped products).
- `/llms.txt` and `/llms-full.txt` are generated from the same content.
- `metadataBase` is set and the share images are file-based. Icons are file-based (`icon.png`, `apple-icon.png`, `favicon.ico` from the New DP portrait).

### Analytics
`src/components/analytics/Analytics.tsx`: Microsoft Clarity (`next/script` lazyOnload) and Firebase Analytics, dynamically imported after load and idle. Firebase logs `outbound_click` (it uses `data-track` labels). Both are no-ops without their env vars.

### Styling
- Tailwind v4 in `globals.css`: tokens, base, film grain, `.glass` (used by admin), scrollbar and selection only.
- Public styles live in `src/app/(main)/portfolio.css`.
- Theme: noir `#050505` / `#e8e8e8` with red `#dc2626`. Fonts: Space Grotesk (display), Inter (body), Instrument Serif italic (one accent word per heading), DM Mono (data such as dates and coordinates).
- Caching: `next.config.ts` sends immutable headers for `/mini-shaan/*` (bump the filename when the art changes).

### Mobile
- Everything after the `Phones & tablets` banner at the end of `portfolio.css` is the mobile layer.
  - `main` and `.stage` use `overflow-x: clip` (clip keeps sticky working).
  - The viewport is `viewportFit: cover`, with safe-area padding on the header and gutters.
  - On `(pointer: coarse)`: 44px minimum tap targets, pressed states, no tap flash, and no film grain.
  - On short landscape (`max-height: 520px`): a compact domain story.
- `ScrollTrigger.config({ ignoreMobileResize: true })` stops re-measuring when the iOS/Android browser bars move.
- Domain story on ≤1023px: the text block sits on its own opaque panel (`.story__inner`) so the bench never runs through copy. On ≤640px the story is `count × 50svh + 100svh`. `DomainsStory` measures travel against the pin's real height, not `innerHeight`.
- Project screenshots and credits resolve through `projectExtras(p)` (`site.ts`): it uses the id, then falls back to the title, because CMS rows have UUIDs.
- Check every phone width (320, 360, 375, 390, 430), landscape 844×390, and 768/1000/1280 before shipping layout changes.

### Conventions
- Path alias `@/*` → `src/*`. shadcn/Base UI primitives live in `src/components/ui/`.
- Admin array fields (`tools`, `tags`) are edited as comma-separated strings.
- `<html>` and `<body>` carry `suppressHydrationWarning` (browser extensions inject attributes).
