# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run dev:clean    # Clean .next cache then start dev server
npm run build        # Production build
npm run start        # Run production server
npm run lint         # ESLint validation (only automated quality check — no test suite)
npm run clean        # Remove .next build directory
```

## Environment Setup

Copy `.env.example` to `.env.local` and populate:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — Admin account credentials

## Architecture

### Route Groups
- `src/app/(main)/` — Public-facing portfolio pages. Wrapped in a film-grain layout. Home page uses `next/dynamic` with `ssr: false` for all animation-heavy sections.
- `src/app/admin/` — CMS for portfolio content. Protected at the layout level via `useAdminGuard` (client-side redirect to `/admin/login`). Sidebar nav with CRUD pages for: About, Domains, Projects, Blogs, Experiences, HeroImages.

### Animation Architecture
The home page uses a custom scroll engine built on **GSAP** + **Lenis**:

- `ScrollEngine` (`src/components/cinema/`) — orchestrates page-level scroll sequences. Creates a Lenis instance, registers GSAP ScrollTrigger, and syncs them via `gsap.ticker.add()`.
- `HorizontalSection`, `VerticalLockSection`, `HorizontalToVerticalSection` — scroll-lock primitives that pin content and drive transforms via `scrub: 1` tweens.
- `src/components/scroll/` — domain-specific scroll sections (WebDev, AppDev, IoT, UAV) using Framer Motion `useScroll` + `useTransform` chains for parallax.
- **Framer Motion** handles component-level animations (UI transitions, section entrances).

**Critical invariants:**

- All animation-heavy sections use `next/dynamic` with `ssr: false` — GSAP/Lenis access `window` and will crash on server render. Do not remove this.
- Every scroll primitive kills its own GSAP ScrollTrigger on unmount (`tween.kill()` + filter + `forEach(t => t.kill())`). Missing cleanup causes duplicate/glitchy triggers on re-navigation.
- `HeroDomainsSequence` uses `useLayoutEffect` (not `useEffect`) for GSAP mutations to avoid paint flash. It has hardcoded fallback `about` + `domains` data for when Supabase is unavailable.

### Journey Section

`src/components/sections/JourneySection.tsx` is the most complex component. Key internals:

- **Horizontal scroll pinning** — One `ScrollTrigger.create()` pins the section and drives `translateX` on the track via `onUpdate`. `scrollDistance = pathWidth - viewportWidth`.
- **Responsive sizing** — Tracks both `viewportWidth` and `viewportHeight` state (updated on resize). `pathHeight` is computed as `clamp(340, vh * 0.56, 600)` — not a fixed constant. `HEADER_OFFSET = 60` shifts the SVG path center downward to prevent cards from colliding with the header.
- **Node card positioning** — Cards are absolutely positioned at `top: calc(50% + HEADER_OFFSET/2 - pathHeight/2 + anchor.y)`. Anchor X is clamped to `[halfCard + 20, pathWidth - halfCard - 20]` to prevent edge clipping. Even-indexed cards go above the path, odd below. On `max-width: 640px`, all cards are forced below.
- **Performance pattern** — Progress bar and label are updated via direct DOM ref (no React state). Character position is throttled via `requestAnimationFrame`. React `setActiveProgress` only fires when scroll crosses a node threshold (~0.015–0.03 delta), not on every tick.
- **`JourneyCharacter`** — An SVG rolling white ball. Roll rotation is physics-based: `(x / 2πR) × 360°`. Squash/stretch and speed lines toggle with `isWalking` prop.
- **Sub-components** — `JourneyPath.tsx` exposes `getNodePositions(nodeCount)` and `getPointOnSVGPath(pathEl, progress)` used to anchor cards and drive the character.

### Auth Protection (Three Layers)

1. **Middleware** (`src/middleware.ts`) — Edge-level. Reads Supabase session from request cookies; redirects unauthenticated users away from `/admin/*`.
2. **`useAdminGuard` hook** — Client-side safety net. Redirects to `/admin/login` if `!user && !loading`.
3. **Supabase RLS** — All write operations require `auth.role() = 'authenticated'`. Public reads filtered by `published = true` or `active = true`.

### Data Layer

- **Supabase** is the backend. `src/lib/supabase/client.ts` — browser client; `src/lib/supabase/server.ts` — server-side (requires `await cookies()` from `next/headers`).
- **Zustand** (`src/store/content-store.ts`) — global store for About, Domains, Projects, Blogs. Populated from Supabase, persists across navigation.
- Core types in `src/lib/types.ts`; Zod schemas in `src/lib/validators.ts`. Admin forms use React Hook Form + `@hookform/resolvers/zod`.
- Admin pages use `useRef(createClient()).current` to create the Supabase client once and avoid recreating on re-renders.
- Array fields (`tools`, `tags`) are Postgres arrays but admin forms use comma-separated strings — split on save, join on load.
- Domain `background_tone` in DB is a string key (e.g. `"ember"`). Resolved to gradient/accent at render time via `DOMAIN_TONE_MAP` in `src/lib/domain-tones.ts`.

### Styling

- **Tailwind CSS v4** — configured inline in `globals.css` (no `tailwind.config.ts`). Journey-specific styles live at approximately lines 1491–2150.
- Theme: noir monochrome (deep black `#050505`, light gray `#e8e8e8`) with red accent (`#dc2626`).
- Custom utilities: `.glass`, `.glass-strong`, `.glass-card` (glassmorphism). Film-grain overlay at the `(main)` layout level via `.film-grain::after` SVG noise filter.
- Fonts (CSS variables): `--font-sans` (Inter), `--font-heading` (Space Grotesk), `--font-mono-ui` (DM Mono).

### Icons & Metadata

- `src/app/icon.png` and `src/app/favicon.ico` use Next.js file-based metadata conventions — no manual `metadata.icons` config needed in `layout.tsx`.
- `<html>` and `<body>` both carry `suppressHydrationWarning` to suppress browser-extension attribute injection (e.g. Bitwarden's `bis_skin_checked`).

### UI Components

- `src/components/ui/` — shadcn/ui + Base UI React primitives
- `src/components/shared/` — reusable wrappers: `GlassCard`, `AnimatedHeading`, `SectionWrapper`, `SkeletonCard`
- Path alias `@/*` maps to `src/*`

### Database Schema
Tables: `profiles`, `about`, `domains`, `projects`, `blogs`, `experiences`, `hero_images`. Migrations in `supabase/migrations/`.
