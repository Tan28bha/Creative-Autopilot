# Quick Fix: API Key Still Missing After Setting

## Most Common Issue: Function Not Redeployed

**Secrets only work after redeploying the function!** This is the #1 reason the API key shows as missing.

## Fix It Now:

### Step 1: Verify the Secret is Set

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **Edge Functions** → **Settings** → **Secrets**
4. Verify you see `HUGGINGFACE_API_KEY` in the list
5. Make sure the name is exactly `HUGGINGFACE_API_KEY` (case-sensitive, no spaces)

### Step 2: Redeploy the Function (REQUIRED!)

You MUST redeploy after setting a secret. Choose one method:

#### Option A: Using Supabase Dashboard

1. Go to **Edge Functions**
2. Find **`generate-creative`** in the list
3. Click the **"..."** (three dots) menu next to it
4. Click **"Redeploy"** or **"Deploy"**
5. Wait for deployment to complete (usually 10-30 seconds)

#### Option B: Using CLI (Faster)

```bash
# Make sure you're in the project directory
cd Creative-Autopilot-main

# Link your project (if not already linked)
supabase link --project-ref rslyvblyizosebqqxnmv

# Deploy the function
supabase functions deploy generate-creative
```

### Step 3: Test Again

1. Try generating a creative
2. Check the logs in Edge Functions → `generate-creative` → Logs
3. You should now see: `HUGGINGFACE_API_KEY present: true`

## Still Not Working?

### Check These Common Issues:

1. **Wrong Secret Name:**
   - Must be exactly: `HUGGINGFACE_API_KEY`
   - No spaces, correct case (all caps)
   - Check for typos

2. **Wrong Project:**
   - Make sure you're setting the secret in the same project where the function is deployed
   - Check your project ref matches

3. **Token Format:**
   - Should start with `hf_...`
   - No extra spaces or quotes around the token
   - Copy-paste directly, don't add anything

4. **Secret Not Saved:**
   - Make sure you clicked "Save" or "Add" after entering the secret
   - Check it appears in the secrets list

5. **Function Version:**
   - After redeploying, check the version number in the logs
   - Make sure it's a new version (higher number)

## Verify It's Working:

After redeploying, the logs should show:
```
HUGGINGFACE_API_KEY present: true
Starting image generation process...
Setting up API request...
Calling Hugging Face API: ...
```

If you see `false`, the secret wasn't set correctly or you need to redeploy again.

## Quick Checklist:

- [ ] Secret `HUGGINGFACE_API_KEY` is in Supabase Edge Functions → Settings → Secrets
- [ ] Secret name is exactly `HUGGINGFACE_API_KEY` (no typos, correct case)
- [ ] Secret value is a valid Hugging Face token (starts with `hf_...`)
- [ ] **Redeployed the function after setting the secret** ⚠️ MOST IMPORTANT!
- [ ] Tested again and checked logs for `present: true`

