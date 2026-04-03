-- Add image_url column to experiences table for journey section visuals
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS image_url TEXT;
