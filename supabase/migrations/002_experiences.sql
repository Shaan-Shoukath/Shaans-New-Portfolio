-- Create experiences table for portfolio timeline
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'professional' CHECK (type IN ('professional', 'social', 'education', 'freelance')),
  start_date TEXT NOT NULL,
  end_date TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Public read for published experiences
CREATE POLICY "Public can read published experiences"
  ON experiences FOR SELECT
  USING (published = true);

-- Authenticated users can do everything
CREATE POLICY "Authenticated users full access"
  ON experiences FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
