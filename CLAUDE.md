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

## Architecture

### Routes
- `src/app/(main)/`: public pages. `page.tsx` (home), `about` (long-form + FAQ JSON-LD), `projects`, `skills`, `contact`, `blog`, `blog/[slug]`, `resume`. The layout adds `SiteHeader`, `IntroLoader`, `Cursor`, `MotionRuntime`, `Analytics` and loads `portfolio.css` (public-only styles).
- `src/app/admin/`: Supabase CMS (About, Domains, Projects, Blogs, Experiences, HeroImages). It is protected by `src/middleware.ts`, `useAdminGuard` and RLS.
- `src/app/llms.txt`, `src/app/llms-full.txt`: route handlers built by `src/lib/llms.ts`.
- `robots.ts` (allows AI crawlers, blocks `/admin`), `sitemap.ts`, `opengraph-image.tsx` / `twitter-image.tsx` (generated share card), `not-found.tsx`.

### Content and data
- **`src/content/site.ts` is canonical content.** It holds `profile` (intro, brief, current roles), `fallbackExperiences`, `fallbackProjects` (featured = the repos pinned on GitHub), `fallbackDomains`, `socialLinks`, and `workProducts` (products per company, keyed by experience company name and shown on roles and in "Shipped at work").
- **`src/lib/content.ts`** (`getPortfolioContent`) reads Supabase on the server with a cookie-less client, so pages stay static. Each table falls back to `site.ts` independently when Supabase is unreachable or empty. It splits experiences into `work` (professional/freelance) and `community` (social/education). Current roles are sorted by `order_index`, past ones by date.
- Pages using it export `revalidate = 3600` (ISR). Every word is in the HTML, with no client-side fetching on public pages.
- Experience `type: "social"` is labelled "Community" in the admin. `location` is a free-text column (migration 008).
- `supabase/migrations/008_portfolio_revamp.sql` is generated from `site.ts`. It is non-destructive: old rows are unpublished, never deleted, and it is safe to re-run. Regenerate it whenever `site.ts` changes and should be pushed to the DB.

### Home page sections (`src/components/sections/`)
Order: `Hero` → `Statement` → `DomainsStory` (all inside `.stage` with the 3D canvas) → `Timeline` work → `Timeline` community → `Projects` → `Contact`.
- `Chapter`: section opener with a label column and a title using one `<em>` serif accent word (`data-split="title"`).
- `Hero`: "Engineering anything." headline (`data-split="hero"`), brief, CTAs, meta bar (status, `KochiClock`).
- `Statement`: intro paragraph that lights up word by word on scroll.
- `DomainsStory`: pinned scrollytelling. Scroll progress picks the active domain and calls `emitShape`, which drives the 3D camera.
- `Timeline`: role rows (dates, location, products, tags). `featureLead` highlights the first current community role (TinkerHub).
- `Projects`: at 1024px and up, a pinned horizontal gallery driven by scroll. Below that, the same track is a native swipe row (scroll-snap, the next card peeks in). The screenshot links to the project (`aria-hidden`, out of tab order; the pills stay the accessible links). Only the first two screenshots load eagerly. "More experiments" follows the gallery.
- `Contact`: red band, Gmail-draft form (no backend).
- `Domains` (static list) is used only by `/skills`. `Marquee`, `BlogsSection` and `ResumeSection` are legacy or other-page components.

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
- `IntroLoader`: first visit per session only. Mini Shaan runs along a progress bar (~1.5s), then the curtain lifts. `INTRO_SKIP_SCRIPT` in the root layout marks repeat visits before paint. **Mini Shaan appears only in the loader.** The sprite is `public/mini-shaan/sheet-v1.webp` (8×9 cells, 144×156), animated by CSS `steps()` in `MiniShaan.tsx`.
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
- Check every phone width (320, 360, 375, 390, 430), landscape 844×390, and 768/1000/1280 before shipping layout changes.

### Conventions
- Path alias `@/*` → `src/*`. shadcn/Base UI primitives live in `src/components/ui/`.
- Admin array fields (`tools`, `tags`) are edited as comma-separated strings.
- `<html>` and `<body>` carry `suppressHydrationWarning` (browser extensions inject attributes).
