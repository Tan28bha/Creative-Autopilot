# Replicate API Setup & Billing Guide

## Getting Started with Replicate

### 1. Create a Replicate Account

1. Go to https://replicate.com
2. Sign up for a free account
3. Verify your email

### 2. Get Your API Token

1. Go to https://replicate.com/account/api-tokens
2. Click **Create token**
3. Copy the token (starts with `r8_...`)
4. **Important:** Keep this token secure and never commit it to version control

### 3. Add Credits to Your Account

**Replicate requires credits to generate images.** The free tier includes some credits, but you may need to add more:

1. Go to https://replicate.com/account/billing#billing
2. Click **Add credits**
3. Choose an amount (minimum is usually $5-10)
4. Complete the payment
5. **Wait a few minutes** for credits to be activated

### 4. Set Up in Supabase

1. Go to Supabase Dashboard → **Edge Functions** → **Settings** → **Secrets**
2. Add a new secret:
   - **Name:** `REPLICATE_API_TOKEN`
   - **Value:** Your token (e.g., `r8_xxxxxxxxxxxxx`)
3. Click **Save**

### 5. Redeploy the Function

After setting the secret, redeploy:

```bash
supabase functions deploy generate-creative
```

Or use the Supabase Dashboard to redeploy.

## Understanding Replicate Pricing

- **Free Tier:** Includes some free credits to get started
- **Pay-as-you-go:** You only pay for what you use
- **Cost per image:** Typically $0.002-0.01 per image depending on the model
- **Minimum purchase:** Usually $5-10 to add credits

## Troubleshooting

### Error: "Insufficient credit" (402)

**Solution:**
1. Check your balance at https://replicate.com/account/billing
2. If balance is low, add credits
3. Wait 2-3 minutes after adding credits
4. Try generating again

### Error: "Invalid API token"

**Solution:**
1. Verify your token at https://replicate.com/account/api-tokens
2. Make sure you copied the entire token (starts with `r8_`)
3. Check that the token is set correctly in Supabase Edge Functions secrets
4. Redeploy the function after setting the token

### Error: "Rate limit exceeded"

**Solution:**
1. You're making too many requests too quickly
2. Wait a few seconds and try again
3. Consider implementing rate limiting in your application

## Free Alternatives (If Needed)

If you need a completely free solution, consider:

1. **Hugging Face Inference API** (Free tier available)
   - Requires `HUGGINGFACE_API_KEY`
   - Free tier has rate limits
   - Models: Stable Diffusion, etc.

2. **Stability AI** (Limited free tier)
   - Requires `STABILITY_API_KEY`
   - Check their pricing at https://platform.stability.ai

3. **Local Generation** (Free but requires GPU)
   - Run Stable Diffusion locally
   - Requires significant setup and hardware

## Cost Optimization Tips

1. **Use appropriate image sizes:** Smaller images cost less
2. **Cache results:** Don't regenerate the same creative multiple times
3. **Batch requests:** If generating multiple variations, consider batching
4. **Monitor usage:** Check your Replicate dashboard regularly

## Support

- **Replicate Support:** https://replicate.com/docs
- **Replicate Discord:** https://discord.gg/replicate
- **Billing Issues:** Contact Replicate support through their dashboard

