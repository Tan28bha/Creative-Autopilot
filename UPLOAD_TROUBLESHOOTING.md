# Upload Troubleshooting Guide

If you're experiencing issues uploading logos and assets, follow these steps:

## 1. Check Environment Variables

Make sure you have a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
```

**Where to find these values:**
1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** (for `VITE_SUPABASE_URL`)
4. Copy the **anon public** key (for `VITE_SUPABASE_PUBLISHABLE_KEY`)

**Important:** After adding/updating the `.env` file, restart your dev server (`npm run dev`)

## 2. Run Database Migrations

Make sure the database migration has been applied:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migration file: `supabase/migrations/20251219171147_5dae2d42-4eb2-441a-a8f0-b319ca68dcc1.sql`

Or if using Supabase CLI:
```bash
supabase db push
```

## 3. Verify Storage Bucket Exists

1. Go to **Storage** in your Supabase dashboard
2. Check if a bucket named `brand-assets` exists
3. If it doesn't exist, create it:
   - Click **New bucket**
   - Name: `brand-assets`
   - Public bucket: **Yes** (checked)

## 4. Verify Storage Policies

The migration should have created these policies. If uploads still fail, manually run this SQL:

```sql
-- Ensure UPDATE policy exists (this is critical!)
CREATE POLICY "Allow public update on brand-assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'brand-assets')
WITH CHECK (bucket_id = 'brand-assets');
```

## 5. Check Browser Console

Open your browser's developer console (F12) and look for error messages when uploading. The improved error handling will now show specific error messages.

Common errors and solutions:

- **"Supabase is not configured"** → Check your `.env` file
- **"Bucket not found"** → Create the `brand-assets` bucket in Storage
- **"Storage policy error"** → Run the UPDATE policy SQL above
- **"JWT" or "Authentication error"** → Check your API keys are correct
- **"File size exceeds 10MB"** → Use a smaller file

## 6. Test Storage Connection

You can test if your Supabase connection works by checking the browser console. The app will log an error if environment variables are missing.

## 7. Manual SQL Fix

If nothing else works, run this complete setup SQL in your Supabase SQL Editor:

```sql
-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure UPDATE policy exists
DROP POLICY IF EXISTS "Allow public update on brand-assets" ON storage.objects;
CREATE POLICY "Allow public update on brand-assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'brand-assets')
WITH CHECK (bucket_id = 'brand-assets');
```

## 8. Fix "Signature Verification Failed" Error

This error typically means:
- **Wrong API key**: You might be using the `service_role` key instead of the `anon public` key
- **API key doesn't match project**: The key and URL are from different projects
- **Storage policies need refresh**: Policies might not be properly applied

**Solution:**

1. **Verify your API keys:**
   - Go to Supabase Dashboard → Settings → API
   - Make sure you're using the **anon public** key (NOT the service_role key)
   - Copy it exactly (no extra spaces)

2. **Run the signature verification fix SQL:**
   - Go to SQL Editor
   - Run the file: `supabase/fix-signature-verification.sql`
   - This will recreate the bucket and policies correctly

3. **Double-check your .env file:**
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon public key)
   ```
   - Make sure there are no quotes around the values
   - Make sure there are no trailing spaces
   - The URL should match your project exactly

4. **Restart your dev server** after updating .env:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

## Still Having Issues?

1. Check the browser console for detailed error messages
2. Verify your Supabase project is active and not paused
3. Make sure you're using the correct project (check the URL matches your `.env`)
4. Try uploading a small test image (< 1MB) first
5. For signature verification errors, ensure you're using the **anon public** key, not service_role

