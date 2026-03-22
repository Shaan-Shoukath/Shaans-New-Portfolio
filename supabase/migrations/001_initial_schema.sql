-- ============================================
-- Developer Portfolio — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ABOUT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  quote TEXT,
  profile_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- DOMAINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  icon TEXT,
  tools TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- BLOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public read access for about" ON about
  FOR SELECT USING (true);

CREATE POLICY "Public read access for domains" ON domains
  FOR SELECT USING (true);

CREATE POLICY "Public read access for published projects" ON projects
  FOR SELECT USING (published = true);

CREATE POLICY "Public read access for published blogs" ON blogs
  FOR SELECT USING (published = true);

-- ADMIN WRITE POLICIES (authenticated users)
CREATE POLICY "Authenticated users can manage about" ON about
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage domains" ON domains
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all projects" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update projects" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete projects" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all blogs" ON blogs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage blogs" ON blogs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blogs" ON blogs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blogs" ON blogs
  FOR DELETE USING (auth.role() = 'authenticated');

-- PROFILES: users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = id::text);

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run this separately in the Supabase dashboard or via:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- ============================================
-- SEED DATA (Optional)
-- ============================================
INSERT INTO about (name, tagline, quote, profile_image_url)
VALUES (
  'Your Name',
  'Full-Stack Developer & Innovator',
  'Building the future, one line of code at a time.',
  NULL
) ON CONFLICT DO NOTHING;
