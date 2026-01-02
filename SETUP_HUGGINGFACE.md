# Setting Up Hugging Face API Key for Image Generation

## Quick Setup Guide

### Step 1: Get Your Free Hugging Face Token

1. **Go to Hugging Face:**
   - Visit: https://huggingface.co/settings/tokens
   - Sign in (or create a free account if needed)

2. **Create a New Token:**
   - Click **"New token"** button
   - **Name:** `Creative-Autopilot` (or any name you prefer)
   - **Type:** Select **"Read"** (this is sufficient for image generation)
   - Click **"Generate token"**

3. **Copy the Token:**
   - The token will start with `hf_...`
   - **IMPORTANT:** Copy it immediately - you won't be able to see it again!
   - Example: 

### Step 2: Add to Supabase Edge Functions

#### Option A: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard:**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to Edge Functions:**
   - Click **"Edge Functions"** in the left sidebar
   - Click **"Settings"** (or look for "Secrets" / "Environment Variables")

3. **Add the Secret:**
   - Click **"Add new secret"** or **"+"** button
   - **Name:** `HUGGINGFACE_API_KEY` (must be exact, case-sensitive)
   - **Value:** Paste your token (e.g., `hf_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890`)
   - Click **"Save"** or **"Add"**

4. **Verify:**
   - You should see `HUGGINGFACE_API_KEY` in the list of secrets
   - Make sure there are no extra spaces or quotes

#### Option B: Using Supabase CLI

```bash
# Make sure you're in the project directory
cd Creative-Autopilot-main

# Link your project (if not already linked)
supabase link --project-ref rslyvblyizosebqqxnmv

# Set the secret
supabase secrets set HUGGINGFACE_API_KEY=hf_your_token_here

# Replace hf_your_token_here with your actual token
```

### Step 3: Redeploy the Function (CRITICAL!)

**IMPORTANT:** Secrets only take effect after redeploying the function!

#### Using Supabase Dashboard:

1. Go to **Edge Functions**
2. Find **`generate-creative`** in the list
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"** or **"Deploy"**

#### Using Supabase CLI:

```bash
supabase functions deploy generate-creative
```

### Step 4: Verify It Works

1. **Test the Function:**
   - Try generating a creative in your app
   - Check the Edge Functions logs

2. **Check the Logs:**
   - Go to **Edge Functions** → **`generate-creative`** → **Logs**
   - You should see: `HUGGINGFACE_API_KEY present: true`
   - If you see `false`, the secret wasn't set correctly or the function wasn't redeployed

## Troubleshooting

### "HUGGINGFACE_API_KEY present: false"

**Possible causes:**
1. Secret not set - Go back to Step 2
2. Wrong name - Must be exactly `HUGGINGFACE_API_KEY` (case-sensitive)
3. Function not redeployed - Go to Step 3 and redeploy
4. Wrong project - Make sure you're setting the secret in the correct Supabase project

### "401 Unauthorized" Error

**Possible causes:**
1. Invalid token - Get a new token from Hugging Face
2. Token expired - Generate a new token
3. Wrong token type - Make sure you selected "Read" access

### "403 Forbidden" Error

**Possible causes:**
1. Token doesn't have proper permissions - Regenerate with "Read" access
2. Model access required - Some models may need explicit access approval

## Quick Checklist

- [ ] Got token from https://huggingface.co/settings/tokens
- [ ] Added `HUGGINGFACE_API_KEY` secret in Supabase Dashboard
- [ ] Secret name is exactly `HUGGINGFACE_API_KEY` (case-sensitive)
- [ ] Token value is correct (starts with `hf_...`)
- [ ] Redeployed the `generate-creative` function
- [ ] Tested and saw `HUGGINGFACE_API_KEY present: true` in logs

## Need Help?

If you're still having issues:
1. Check the Edge Functions logs for detailed error messages
2. Verify the secret is set: Go to Edge Functions → Settings → Secrets
3. Make sure you redeployed after setting the secret
4. Try generating a new token if the current one doesn't work

