# Edge Functions Setup Guide

## Problem
If you're seeing "Failed to send a request to the Edge Function", the Edge Functions need to be deployed and configured.

## Step 1: Deploy Edge Functions

### Option A: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   cd Creative-Autopilot-main
   supabase link --project-ref rslyvblyizosebqqxnmv
   ```
   (Use your actual project ref from your `.env.local` file)

4. **Deploy all functions:**
   ```bash
   supabase functions deploy analyze-brand
   supabase functions deploy generate-creative
   supabase functions deploy edit-creative
   supabase functions deploy analyze-attention
   supabase functions deploy check-compliance
   ```

   Or deploy all at once:
   ```bash
   supabase functions deploy
   ```

### Option B: Using Supabase Dashboard

1. **Go to Edge Functions:**
   - Visit https://app.supabase.com
   - Select your project
   - Go to **Edge Functions** in the left sidebar

2. **Create/Deploy Functions:**
   - For each function (`analyze-brand`, `generate-creative`, etc.):
     - Click **Create a new function** or select existing
     - Copy the code from `supabase/functions/[function-name]/index.ts`
     - Paste into the editor
     - Click **Deploy**

## Step 2: Set Environment Variables

The Edge Functions need the `GOOGLE_AI_API_KEY` environment variable.

### Using Supabase Dashboard:

1. **Go to Edge Functions:**
   - In your Supabase Dashboard → **Edge Functions**

2. **Set Environment Variables:**
   - Click on **Settings** or **Project Settings**
   - Go to **Edge Functions** → **Secrets**
   - Add a new secret:
     - **Name:** `GOOGLE_AI_API_KEY`
     - **Value:** Your Google AI API key (from your `.env.local` file: `AIzaSyC0Top4I0XKt3_BF17VK-C9ov4U6utwMic`)
   - Click **Save**

### Using Supabase CLI:

```bash
supabase secrets set GOOGLE_AI_API_KEY=AIzaSyC0Top4I0XKt3_BF17VK-C9ov4U6utwMic
```

## Step 3: Verify Function Configuration

1. **Check Function Status:**
   - Go to **Edge Functions** in Supabase Dashboard
   - You should see all functions listed:
     - `analyze-brand`
     - `generate-creative`
     - `edit-creative`
     - `analyze-attention`
     - `check-compliance`

2. **Verify Environment Variables:**
   - In Edge Functions settings, verify `GOOGLE_AI_API_KEY` is set
   - Make sure it matches the key in your `.env.local` file

## Step 4: Test the Functions

After deployment, test the brand analysis:

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Test Brand Analysis:**
   - Go to `/dashboard/upload`
   - Upload some images
   - Go to `/dashboard/generate`
   - Click "Analyze Brand Assets"
   - It should work now!

## Troubleshooting

### "Function not found"
- The function hasn't been deployed yet
- Deploy it using the steps above

### "GOOGLE_AI_API_KEY is not configured"
- The environment variable isn't set in Supabase
- Set it in Edge Functions → Settings → Secrets

### "Failed to send a request"
- Check your Supabase URL in `.env.local` matches your project
- Verify the function is deployed and active
- Check browser console for detailed error messages

### "CORS error"
- Edge Functions should handle CORS automatically
- If you see CORS errors, check the function code includes CORS headers

## Quick Checklist

- [ ] Edge Functions deployed to Supabase
- [ ] `GOOGLE_AI_API_KEY` set in Supabase Edge Functions secrets
- [ ] `.env.local` file has correct Supabase URL and keys
- [ ] Dev server restarted after changes
- [ ] Tested brand analysis function

## Getting Your Google AI API Key

If you don't have a Google AI API key:

1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Copy the key
4. Add it to:
   - Your `.env.local` file: `GOOGLE_AI_API_KEY=your-key-here`
   - Supabase Edge Functions secrets (as shown above)

