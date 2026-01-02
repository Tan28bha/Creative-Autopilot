-- Fix for missing UPDATE policy on storage.objects
-- Run this in your Supabase SQL Editor if uploads are not working

CREATE POLICY "Allow public update on brand-assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'brand-assets')
WITH CHECK (bucket_id = 'brand-assets');

