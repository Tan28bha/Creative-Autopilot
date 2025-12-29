# Fix Invalid/Expired Google AI API Key

## Problem
You're getting: "AI API key is invalid or expired"

This means Google's API is rejecting your API key (403 error).

## Quick Fix Steps

### Step 1: Verify Your API Key

1. **Go to Google AI Studio:**
   - Visit https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Check Your API Key:**
   - Look for your API key in the list
   - Check if it's **Active** or **Expired**
   - If expired or missing, create a new one

3. **Create New API Key (if needed):**
   - Click **Create API Key**
   - Select your Google Cloud project (or create one)
   - Copy the new API key (starts with `AIza...`)

### Step 2: Update in Supabase

1. **Go to Supabase Dashboard:**
   - Visit https://app.supabase.com
   - Select your project (`rslyvblyizosebqqxnmv`)

2. **Update the Secret:**
   - Go to **Edge Functions** → **Settings** (or **Project Settings** → **Edge Functions**)
   - Click on **Secrets** tab
   - Find `GOOGLE_AI_API_KEY`
   - Click **Edit** or **Update**
   - Paste your **new/verified** API key
   - Click **Save**

### Step 3: Redeploy ALL Functions

**⚠️ IMPORTANT:** After updating the secret, you MUST redeploy all functions!

**Using Dashboard:**
1. Go to **Edge Functions**
2. For each function, click **Deploy**:
   - `analyze-brand`
   - `generate-creative`
   - `analyze-attention`
   - `edit-creative`
   - `check-compliance`

**Using CLI:**
```bash
supabase functions deploy analyze-brand
supabase functions deploy generate-creative
supabase functions deploy analyze-attention
supabase functions deploy edit-creative
supabase functions deploy check-compliance
```

### Step 4: Test

1. **Try brand analysis again** in your app
2. **Check function logs** if it still fails:
   - Edge Functions → analyze-brand → Logs
   - Look for the exact error message

## Common Issues

### "API key doesn't have permission"
- Make sure the API key has access to Gemini API
- Enable Gemini API in your Google Cloud project:
  - Go to https://console.cloud.google.com
  - Enable "Generative Language API"

### "API key quota exceeded"
- Check your Google Cloud project quotas
- You might need to enable billing or upgrade your plan

### "Still getting 403 after updating"
- Make sure you **redeployed** the function after updating the secret
- Secrets don't take effect until functions are redeployed
- Wait a few seconds after redeployment before testing

## Verify API Key Works

You can test your API key manually:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{"text": "Hello"}]
    }]
  }'
```

Replace `YOUR_API_KEY` with your actual key. If it works, you'll get a JSON response. If not, you'll see the error.

## Quick Checklist

- [ ] API key is active in Google AI Studio
- [ ] API key has access to Gemini API
- [ ] Updated `GOOGLE_AI_API_KEY` in Supabase Edge Functions secrets
- [ ] **Redeployed ALL functions** (most important!)
- [ ] Tested brand analysis again

After completing these steps, your API key should work!

