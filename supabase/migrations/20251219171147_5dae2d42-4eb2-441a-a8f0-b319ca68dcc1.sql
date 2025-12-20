-- Create storage bucket for brand assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true);

-- Create table to track uploaded assets with metadata
CREATE TABLE public.brand_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('logo', 'packshot', 'creative', 'other')),
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;

-- For now, allow public read/write since we don't have auth yet
-- This should be updated once authentication is added
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

-- Storage policies for brand-assets bucket
CREATE POLICY "Allow public read access to brand-assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'brand-assets');

CREATE POLICY "Allow public upload to brand-assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'brand-assets');

CREATE POLICY "Allow public delete from brand-assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'brand-assets');