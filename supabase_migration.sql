-- ════════════════════════════════════════════════════════════════
-- SHAAN PORTFOLIO — Complete Supabase Migration
-- Run this entire script in Supabase → SQL Editor → New Query
-- ════════════════════════════════════════════════════════════════

-- Enable UUID extension (usually already enabled)
create extension if not exists "uuid-ossp";


-- ────────────────────────────────────────────────────────────────
-- 1. ABOUT  (single row — your personal info)
-- ────────────────────────────────────────────────────────────────
create table if not exists about (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null default 'Shaan Shoukath',
  tagline             text,
  quote               text,
  profile_image_url   text,
  hero_floating_words text[]  not null default '{}',
  updated_at          timestamptz not null default now()
);

-- Seed one row immediately
insert into about (name, tagline, quote, hero_floating_words)
values (
  'Shaan Shoukath',
  'Full-Stack Engineer · Drone Systems · AI',
  'Building things that matter.',
  array['Engineer','Builder','Creator','Developer','Designer']
)
on conflict do nothing;


-- ────────────────────────────────────────────────────────────────
-- 2. HERO IMAGES  (rotating hero photos)
-- ────────────────────────────────────────────────────────────────
create table if not exists hero_images (
  id          uuid primary key default uuid_generate_v4(),
  image_url   text not null,
  alt_text    text not null default '',
  order_index int  not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists hero_images_order_idx on hero_images (order_index);


-- ────────────────────────────────────────────────────────────────
-- 3. DOMAINS  (skill / expertise areas)
-- ────────────────────────────────────────────────────────────────
create table if not exists domains (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  icon             text,
  description      text,
  background_tone  text,
  tools            text[]  not null default '{}',
  order_index      int     not null default 0,
  created_at       timestamptz not null default now()
);

create index if not exists domains_order_idx on domains (order_index);


-- ────────────────────────────────────────────────────────────────
-- 4. PROJECTS
-- ────────────────────────────────────────────────────────────────
create table if not exists projects (
  id          uuid primary key default uuid_generate_v4(),
  title       text    not null,
  description text,
  tech_stack  text[]  not null default '{}',
  github_url  text,
  live_url    text,
  medium_url  text,
  image_url   text,
  featured    boolean not null default false,
  published   boolean not null default true,
  order_index int     not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists projects_published_idx on projects (published);
create index if not exists projects_order_idx     on projects (order_index);


-- ────────────────────────────────────────────────────────────────
-- 5. BLOGS
-- ────────────────────────────────────────────────────────────────
create table if not exists blogs (
  id          uuid primary key default uuid_generate_v4(),
  title       text    not null,
  slug        text    not null unique,
  content     text,
  cover_image text,
  published   boolean not null default false,
  tags        text[]  not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists blogs_published_idx on blogs (published);
create index if not exists blogs_slug_idx      on blogs (slug);


-- ────────────────────────────────────────────────────────────────
-- 6. EXPERIENCES  (journey / timeline)
-- ────────────────────────────────────────────────────────────────
create table if not exists experiences (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  company     text not null,
  description text,
  image_url   text,
  type        text not null default 'professional'
                check (type in ('professional','social','education','freelance')),
  start_date  date not null,
  end_date    date,
  tags        text[]  not null default '{}',
  published   boolean not null default true,
  order_index int     not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists experiences_published_idx on experiences (published);
create index if not exists experiences_order_idx     on experiences (order_index);


-- ════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Public can READ published rows. Only authenticated users (admin) can write.
-- ════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table about        enable row level security;
alter table hero_images  enable row level security;
alter table domains      enable row level security;
alter table projects     enable row level security;
alter table blogs        enable row level security;
alter table experiences  enable row level security;

-- ── ABOUT ──────────────────────────────────────────────────────
create policy "about: public read"
  on about for select using (true);

create policy "about: admin write"
  on about for all using (auth.role() = 'authenticated');

-- ── HERO IMAGES ────────────────────────────────────────────────
create policy "hero_images: public read"
  on hero_images for select using (active = true);

create policy "hero_images: admin write"
  on hero_images for all using (auth.role() = 'authenticated');

-- ── DOMAINS ────────────────────────────────────────────────────
create policy "domains: public read"
  on domains for select using (true);

create policy "domains: admin write"
  on domains for all using (auth.role() = 'authenticated');

-- ── PROJECTS ───────────────────────────────────────────────────
create policy "projects: public read published"
  on projects for select using (published = true);

create policy "projects: admin full"
  on projects for all using (auth.role() = 'authenticated');

-- ── BLOGS ──────────────────────────────────────────────────────
create policy "blogs: public read published"
  on blogs for select using (published = true);

create policy "blogs: admin full"
  on blogs for all using (auth.role() = 'authenticated');

-- ── EXPERIENCES ────────────────────────────────────────────────
create policy "experiences: public read published"
  on experiences for select using (published = true);

create policy "experiences: admin full"
  on experiences for all using (auth.role() = 'authenticated');


-- ════════════════════════════════════════════════════════════════
-- STORAGE BUCKET  (for uploaded images)
-- Run this separately if you need image uploads in admin panel
-- ════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict do nothing;

create policy "portfolio storage: public read"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "portfolio storage: admin upload"
  on storage.objects for insert
  with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');

create policy "portfolio storage: admin delete"
  on storage.objects for delete
  using (bucket_id = 'portfolio' and auth.role() = 'authenticated');
