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

### Required Secrets:

1. **GOOGLE_AI_API_KEY** - For text analysis and descriptions (optional but recommended)

### Image Generation:

The `generate-creative` function uses **Hugging Face Inference API** for image generation. An API key is optional but recommended for better rate limits.

### Using Supabase Dashboard:

1. **Go to Edge Functions:**
   - In your Supabase Dashboard → **Edge Functions**

2. **Set Environment Variables:**
   - Click on **Settings** or **Project Settings**
   - Go to **Edge Functions** → **Secrets**
   - Add secrets:
     - **Name:** `GOOGLE_AI_API_KEY`
       - **Value:** Your Google AI API key (from your `.env.local` file)
     - **Name:** `REPLICATE_API_TOKEN`
       - **Value:** Your Replicate API token (get it from https://replicate.com/account/api-tokens)
   - Click **Save** for each

### Using Supabase CLI:

```bash
supabase secrets set GOOGLE_AI_API_KEY=your_google_ai_key_here
```

**Optional (Recommended):** For better rate limits, you can also set `HUGGINGFACE_API_KEY`:
```bash
supabase secrets set HUGGINGFACE_API_KEY=your_hf_token_here
```

Get your free token at: https://huggingface.co/settings/tokens

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
   - In Edge Functions settings, verify `GOOGLE_AI_API_KEY` is set (optional but recommended for descriptions)
   - `HUGGINGFACE_API_KEY` is optional but recommended for better image generation rate limits

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

### "Hugging Face API error" or "Image generation failed"
- Image generation uses Hugging Face Inference API
- If you see rate limit errors, get a free API key at https://huggingface.co/settings/tokens
- Set `HUGGINGFACE_API_KEY` in Edge Functions secrets for better rate limits
- Some models may take time to load on first use (automatic retry is built-in)

### "Failed to send a request"
- Check your Supabase URL in `.env.local` matches your project
- Verify the function is deployed and active
- Check browser console for detailed error messages

### "CORS error"
- Edge Functions should handle CORS automatically
- If you see CORS errors, check the function code includes CORS headers

## Quick Checklist

- [ ] Edge Functions deployed to Supabase
- [ ] `GOOGLE_AI_API_KEY` set in Supabase Edge Functions secrets (optional, for descriptions)
- [ ] `.env.local` file has correct Supabase URL and keys
- [ ] Dev server restarted after changes
- [ ] Tested brand analysis function
- [ ] Tested creative generation (uses Hugging Face - API key optional but recommended)

## Getting Your API Keys

### Google AI API Key

If you don't have a Google AI API key:

1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Copy the key
4. Add it to:
   - Your `.env.local` file: `GOOGLE_AI_API_KEY=your-key-here`
   - Supabase Edge Functions secrets (as shown above)

### Image Generation with Hugging Face (FREE - API Key Optional!)

The `generate-creative` function uses **Hugging Face Inference API** for image generation:
- ✅ **Free tier available** - Works without API key (with rate limits)
- ✅ **Better with API key** - Free token at https://huggingface.co/settings/tokens
- ✅ **High quality** - Uses Stable Diffusion XL model
- ✅ **Backend compatible** - Works from Edge Functions

**Setup (Optional but Recommended):**

1. **Get a free Hugging Face token:**
   - Go to https://huggingface.co/settings/tokens
   - Click **New token**
   - Select **Read** access
   - Copy the token

2. **Add to Supabase:**
   - Go to Edge Functions → Settings → Secrets
   - Add: `HUGGINGFACE_API_KEY` = your token
   - Redeploy the function

**Note:** The function works without an API key, but you'll have better rate limits with one (and it's completely free!).

