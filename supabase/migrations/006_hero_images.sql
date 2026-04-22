-- ============================================
-- HERO IMAGES TABLE — Carousel images for the hero section
-- Run this in your Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Public read access (only active images)
CREATE POLICY "Public read access for active hero images" ON hero_images
  FOR SELECT USING (active = true);

-- Authenticated users can read all hero images (including inactive)
CREATE POLICY "Authenticated users can read all hero images" ON hero_images
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can manage hero images
CREATE POLICY "Authenticated users can insert hero images" ON hero_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update hero images" ON hero_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete hero images" ON hero_images
  FOR DELETE USING (auth.role() = 'authenticated');
