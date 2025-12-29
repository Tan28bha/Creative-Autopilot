# Edge Function Error Troubleshooting

## "Edge Function returned a non-2xx status code"

This error means the Edge Function is deployed and reachable, but it's returning an error. Here's how to fix it:

### Step 1: Check Edge Function Logs

1. **Go to Supabase Dashboard:**
   - Visit https://app.supabase.com
   - Select your project

2. **View Function Logs:**
   - Go to **Edge Functions** → **analyze-brand**
   - Click on **Logs** tab
   - Look for error messages

### Step 2: Common Causes and Fixes

#### Error: "GOOGLE_AI_API_KEY is not configured"

**Fix:**
1. Go to **Edge Functions** → **Settings** (or **Project Settings** → **Edge Functions**)
2. Go to **Secrets**
3. Add/Update secret:
   - **Name:** `GOOGLE_AI_API_KEY`
   - **Value:** Your Google AI API key (from `.env.local`: `AIzaSyC0Top4I0XKt3_BF17VK-C9ov4U6utwMic`)
4. Click **Save**
5. **Redeploy the function** (the secret change requires redeployment)

#### Error: "AI API key is invalid or expired" (403)

**Fix:**
1. Verify your Google AI API key is valid:
   - Go to https://aistudio.google.com/app/apikey
   - Check if the key is active
   - Generate a new key if needed

2. Update the secret in Supabase:
   - Edge Functions → Settings → Secrets
   - Update `GOOGLE_AI_API_KEY` with the new key
   - Redeploy the function

#### Error: "Failed to process any images" (400)

**Fix:**
1. Ensure images are uploaded to Supabase Storage first
2. Check that image URLs are publicly accessible
3. Verify the `brand-assets` bucket exists and is public
4. Make sure images are valid image files (PNG, JPG, etc.)

#### Error: "Rate limit exceeded" (429)

**Fix:**
- Wait a few moments and try again
- Google Gemini API has rate limits on free tier

#### Error: "Server error" (500)

**Fix:**
1. Check function logs for detailed error
2. Verify the function code is correct
3. Ensure all dependencies are available
4. Try redeploying the function

### Step 3: Redeploy the Function

After fixing configuration issues, redeploy:

**Using Dashboard:**
1. Go to **Edge Functions** → **analyze-brand**
2. Click **Deploy** (or edit and redeploy)

**Using CLI:**
```bash
supabase functions deploy analyze-brand
```

### Step 4: Verify Setup

1. **Check Environment Variables:**
   - Edge Functions → Settings → Secrets
   - `GOOGLE_AI_API_KEY` should be set

2. **Test the Function:**
   - Go to **Edge Functions** → **analyze-brand**
   - Click **Invoke** tab
   - Test with sample data:
     ```json
     {
       "imageUrls": ["https://example.com/image.jpg"],
       "assetTypes": ["logo"]
     }
     ```

3. **Check Logs:**
   - View logs to see if function executes successfully
   - Look for any error messages

### Quick Checklist

- [ ] `GOOGLE_AI_API_KEY` is set in Edge Functions secrets
- [ ] Function is deployed and active
- [ ] Google AI API key is valid
- [ ] Images are uploaded and accessible
- [ ] Function logs show no errors
- [ ] Dev server restarted after changes

### Getting More Details

The improved error handling will now show:
- Specific error messages from the function
- Status codes (400, 403, 429, 500, etc.)
- Helpful guidance on what to fix

Check the browser console (F12) for detailed error messages when the error occurs.

