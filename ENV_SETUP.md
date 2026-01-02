# Environment Variables Setup Guide

## Quick Setup

1. **Create a `.env` file** in the root directory of your project (same level as `package.json`)

2. **Get your Supabase credentials:**
   - Go to https://app.supabase.com
   - Select your project (or create a new one)
   - Click **Settings** → **API**
   - Copy the **Project URL** and **anon public** key

3. **Add to `.env` file:**
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Restart your dev server:**
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

## Important Notes

### ✅ DO:
- Use the **anon public** key (starts with `eyJ`)
- Copy the keys exactly (no extra spaces)
- Make sure URL and key are from the **same project**
- Restart the dev server after changing `.env`

### ❌ DON'T:
- Use the **service_role** key (it's for backend only)
- Add quotes around the values in `.env`
- Add trailing spaces
- Mix keys from different projects

## Verifying Your Setup

1. **Check the browser console** - You should see connection status messages
2. **Use the connection test** - The upload page will automatically test your connection
3. **Try uploading** - If you see "signature verification failed", check your keys again

## Common Issues

### "Signature verification failed"
- **Cause**: API key doesn't match the project URL
- **Fix**: 
  1. Verify both values are from the same Supabase project
  2. Make sure you're using the **anon public** key (not service_role)
  3. Check for extra spaces or quotes in `.env`
  4. Restart your dev server

### "Missing environment variables"
- **Cause**: `.env` file doesn't exist or variables aren't set
- **Fix**: Create `.env` file in the root directory with both variables

### "Invalid API key format"
- **Cause**: Using the wrong key (service_role instead of anon public)
- **Fix**: Get the **anon public** key from Supabase Dashboard → Settings → API

## Example `.env` File

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.example_signature_here
```

**Note**: Replace with your actual values from your Supabase project!

