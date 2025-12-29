-- =========================================================
-- Complete Setup Script for Brand Assets Storage
-- Run this in your Supabase SQL Editor
-- =========================================================

-- 1. Create storage bucket for brand assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('brand-assets', 'brand-assets', true, 10485760, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/*'];

-- 2. Create table to track uploaded assets with metadata
CREATE TABLE IF NOT EXISTS public.brand_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('logo', 'packshot', 'creative', 'other')),
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Enable Row Level Security on the table
ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to brand_assets" ON public.brand_assets;
DROP POLICY IF EXISTS "Allow public insert access to brand_assets" ON public.brand_assets;
DROP POLICY IF EXISTS "Allow public delete access to brand_assets" ON public.brand_assets;

-- 5. Create RLS policies for brand_assets table
CREATE POLICY "Allow public read access to brand_assets"
ON public.brand_assets
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert access to brand_assets"
ON public.brand_assets
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public delete access to brand_assets"
ON public.brand_assets
FOR DELETE
USING (true);

-- 6. Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow public read access to brand-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to brand-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on brand-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from brand-assets" ON storage.objects;

-- 7. Create storage policies for brand-assets bucket
CREATE POLICY "Allow public read access to brand-assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'brand-assets');

CREATE POLICY "Allow public upload to brand-assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'brand-assets');

CREATE POLICY "Allow public update on brand-assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'brand-assets')
WITH CHECK (bucket_id = 'brand-assets');

CREATE POLICY "Allow public delete from brand-assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'brand-assets');

-- 8. Verify the setup
SELECT 
  'Bucket created successfully!' as status,
  id,
  name,
  public,
  file_size_limit
FROM storage.buckets 
WHERE id = 'brand-assets';

SELECT 
  'Table created successfully!' as status,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'brand_assets';

