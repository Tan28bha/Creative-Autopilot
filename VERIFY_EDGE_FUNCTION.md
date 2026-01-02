# Verify Edge Function Setup

## ✅ Your Current Setup

Based on your Edge Functions secrets, you have:
- ✅ `GOOGLE_AI_API_KEY` - Set (updated 29 Dec 2025)
- ✅ `SUPABASE_URL` - Set
- ✅ `SUPABASE_ANON_KEY` - Set
- ✅ Other Supabase keys - Set

## ⚠️ Important: Redeploy After Setting Secrets

**After setting or updating secrets, you MUST redeploy the function for changes to take effect.**

### Step 1: Redeploy the Function

**Option A: Using Supabase Dashboard**
1. Go to **Edge Functions** → **analyze-brand**
2. Click **Deploy** (or edit and redeploy)
3. Wait for deployment to complete

**Option B: Using CLI**
```bash
supabase functions deploy analyze-brand
```

### Step 2: Check Function Logs

1. Go to **Edge Functions** → **analyze-brand** → **Logs**
2. Look for recent invocations
3. Check for any error messages

### Step 3: Test the Function

**Using Dashboard:**
1. Go to **Edge Functions** → **analyze-brand** → **Invoke**
2. Test with sample data:
   ```json
   {
     "imageUrls": ["https://via.placeholder.com/300"],
     "assetTypes": ["logo"]
   }
   ```
3. Check the response and logs

**Using Your App:**
1. Make sure you have images uploaded
2. Go to `/dashboard/generate`
3. Click "Analyze Brand Assets"
4. Check browser console (F12) for detailed errors

## Common Issues After Setting Secrets

### Issue: Still Getting "non-2xx status code"

**Solution:**
1. **Redeploy the function** (most important!)
2. Check function logs for the actual error
3. Verify the Google API key is valid:
   - Go to https://aistudio.google.com/app/apikey
   - Check if the key is active
   - Test the key manually if needed

### Issue: "GOOGLE_AI_API_KEY is not configured"

**Solution:**
- This means the function hasn't been redeployed after setting the secret
- Redeploy the function immediately

### Issue: "Failed to process any images"

**Solution:**
- Ensure images are uploaded to Supabase Storage first
- Check that image URLs are publicly accessible
- Verify the `brand-assets` bucket exists and is public

### Issue: "AI API key is invalid" (403)

**Solution:**
1. Verify your Google AI API key:
   - Go to https://aistudio.google.com/app/apikey
   - Check if the key is valid and active
   - Generate a new key if needed

2. Update the secret:
   - Edge Functions → Settings → Secrets
   - Update `GOOGLE_AI_API_KEY` with the correct key
   - **Redeploy the function**

## Quick Checklist

- [ ] `GOOGLE_AI_API_KEY` secret is set ✅ (You have this)
- [ ] Function is deployed
- [ ] Function has been **redeployed AFTER setting the secret** ⚠️ (Most important!)
- [ ] Function logs show no errors
- [ ] Images are uploaded and accessible
- [ ] Google API key is valid

## Next Steps

1. **Redeploy the function** (if you haven't already)
2. **Check the function logs** to see what error is occurring
3. **Test with a simple image** to verify it works
4. **Check browser console** for detailed error messages

The improved error handling will now show you the exact error message from the function, making it easier to diagnose the issue.

