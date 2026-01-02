-- Fix for "signature verification failed" error
-- Run this in your Supabase SQL Editor

-- 1. Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('brand-assets', 'brand-assets', true, 10485760, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE 
SET public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/*'];

-- 2. Drop and recreate storage policies to ensure they're correct
DROP POLICY IF EXISTS "Allow public read access to brand-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to brand-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on brand-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from brand-assets" ON storage.objects;

-- 3. Create policies that allow anonymous/public access
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

-- 4. Verify the bucket is public
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'brand-assets';

