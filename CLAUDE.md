# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run dev:clean    # Clean .next cache then start dev server
npm run build        # Production build
npm run start        # Run production server
npm run lint         # ESLint validation
npm run clean        # Remove .next build directory
```

No test infrastructure exists (no Jest/Vitest). `npm run lint` is the only automated quality check.

## Environment Setup

Copy `.env.example` to `.env.local` and populate:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — Admin account credentials

## Architecture

### Route Groups
- `src/app/(main)/` — Public-facing portfolio pages. Wrapped in a film-grain layout. Home page uses `next/dynamic` with `ssr: false` for animation-heavy sections.
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
- `HeroDomainsSequence` uses `useLayoutEffect` (not `useEffect`) for GSAP mutations to avoid paint flash. It also has hardcoded fallback `about` + `domains` data for when Supabase is unavailable.

### Auth Protection (Three Layers)

1. **Middleware** (`src/middleware.ts`) — Edge-level. Reads Supabase session from request cookies; redirects unauthenticated users away from `/admin/*` before the page renders.
2. **`useAdminGuard` hook** — Client-side safety net. Redirects to `/admin/login` if `!user && !loading`.
3. **Supabase RLS** — All write operations require `auth.role() = 'authenticated'`. Public reads are filtered by `published = true` or `active = true` at the database level.

### Data Layer

- **Supabase** is the backend. `src/lib/supabase/client.ts` is the browser client (used in components/hooks); `src/lib/supabase/server.ts` is for server-side operations (requires `await cookies()` from `next/headers`).
- **Zustand** (`src/store/content-store.ts`) — global store for About, Domains, Projects, Blogs. Populated from Supabase, persists across navigation.
- Core types live in `src/lib/types.ts`; Zod validation schemas in `src/lib/validators.ts`. Admin forms use React Hook Form + `@hookform/resolvers/zod`.
- Admin pages use `useRef(createClient()).current` to create the Supabase client once and persist it across re-renders without recreating it.
- Array fields (`tools`, `tags`) are stored as Postgres arrays but admin forms use comma-separated strings — split on save, join on load.
- Domain `background_tone` in DB is a string key (e.g. `"ember"`). Resolved to a gradient/accent object at render time via `DOMAIN_TONE_MAP` in `src/lib/domain-tones.ts`.

### Styling
- **Tailwind CSS v4** — configured inline in `globals.css` (no `tailwind.config.ts`).
- Theme: noir monochrome (deep black `#050505`, light gray `#e8e8e8`) with red accent (`#dc2626`).
- Custom utilities: `.glass`, `.glass-strong`, `.glass-card` (glassmorphism). Film-grain overlay applied at the `(main)` layout level via `.film-grain::after` SVG noise filter.
- Fonts (CSS variables): `--font-sans` (Inter), `--font-heading` (Space Grotesk), `--font-mono-ui` (DM Mono).

### UI Components
- `src/components/ui/` — shadcn/ui + Base UI React primitives
- `src/components/shared/` — reusable wrappers: `GlassCard`, `AnimatedHeading`, `SectionWrapper`, `SkeletonCard`
- Path alias `@/*` maps to `src/*`

### Database Schema
Tables: `profiles`, `about`, `domains`, `projects`, `blogs`, `experiences`, `hero_images`. Migrations in `supabase/migrations/`.
