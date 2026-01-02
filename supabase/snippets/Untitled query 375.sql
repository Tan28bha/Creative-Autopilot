-- =========================================================
-- 1️⃣ Create storage bucket for brand assets
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;


-- =========================================================
-- 2️⃣ Table to track uploaded assets with metadata
-- =========================================================
CREATE TABLE IF NOT EXISTS public.brand_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (
    asset_type IN ('logo', 'packshot', 'creative', 'other')
  ),
  file_size INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- 3️⃣ Enable Row Level Security
-- =========================================================
ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;


-- =========================================================
-- 4️⃣ RLS policies for brand_assets table
-- =========================================================
DROP POLICY IF EXISTS "Allow public read access to brand_assets" ON public.brand_assets;
DROP POLICY IF EXISTS "Allow public insert access to brand_assets" ON public.brand_assets;
DROP POLICY IF EXISTS "Allow public delete access to brand_assets" ON public.brand_assets;

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


-- =========================================================
-- 5️⃣ STORAGE POLICIES (THIS IS THE IMPORTANT PART)
-- =========================================================

-- READ
DROP POLICY IF EXISTS "Allow public read access to brand-assets" ON storage.objects;
CREATE POLICY "Allow public read access to brand-assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'brand-assets');

-- INSERT (UPLOAD)
DROP POLICY IF EXISTS "Allow public upload to brand-assets" ON storage.objects;
CREATE POLICY "Allow public upload to brand-assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'brand-assets');

-- UPDATE (🔥 REQUIRED — missing causes upload failure)
DROP POLICY IF EXISTS "Allow public update on brand-assets" ON storage.objects;
CREATE POLICY "Allow public update on brand-assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'brand-assets')
WITH CHECK (bucket_id = 'brand-assets');

-- DELETE
DROP POLICY IF EXISTS "Allow public delete from brand-assets" ON storage.objects;
CREATE POLICY "Allow public delete from brand-assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'brand-assets');
