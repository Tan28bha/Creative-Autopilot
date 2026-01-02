# Storage Bucket Setup Instructions

## Quick Setup (Recommended)

### Option 1: Using Supabase SQL Editor (Easiest)

1. **Go to your Supabase Dashboard:**
   - Visit https://app.supabase.com
   - Select your project (the one matching your API key: `rslyvblyizosebqqxnmv`)

2. **Open SQL Editor:**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Run the Setup Script:**
   - Copy the entire contents of `supabase/setup-storage-bucket.sql`
   - Paste it into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)

4. **Verify Success:**
   - You should see "Bucket created successfully!" and "Table created successfully!" messages
   - Go to **Storage** in the left sidebar
   - You should see a bucket named `brand-assets`

### Option 2: Using Supabase Dashboard UI

1. **Create the Bucket:**
   - Go to **Storage** in your Supabase Dashboard
   - Click **New bucket**
   - Name: `brand-assets`
   - **Public bucket**: ✅ Check this box (IMPORTANT!)
   - Click **Create bucket**

2. **Run the SQL Migration:**
   - Go to **SQL Editor**
   - Copy and run the contents of `supabase/migrations/20251219171147_5dae2d42-4eb2-441a-a8f0-b319ca68dcc1.sql`

## What Gets Created

1. **Storage Bucket:** `brand-assets`
   - Public access enabled
   - 10MB file size limit
   - Image files only

2. **Database Table:** `brand_assets`
   - Tracks uploaded files with metadata
   - Stores file name, path, type, size, etc.

3. **Security Policies:**
   - Public read/write access (for now)
   - Storage policies for upload/download/delete

## Troubleshooting

### "Bucket already exists"
- This is fine! The script uses `ON CONFLICT DO UPDATE` so it's safe to run multiple times.

### "Permission denied"
- Make sure you're logged into the correct Supabase project
- Verify you have admin access to the project

### "Policy already exists"
- The script drops existing policies first, so this shouldn't happen
- If it does, manually drop the policy and run again

## After Setup

1. **Restart your dev server** (if it's running):
   ```bash
   npm run dev
   ```

2. **Test the upload:**
   - Go to `/dashboard/upload`
   - Try uploading an image
   - It should work now!

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Verify the bucket exists in Storage → Buckets
3. Make sure the bucket is set to **Public**
4. Check that all policies were created successfully

