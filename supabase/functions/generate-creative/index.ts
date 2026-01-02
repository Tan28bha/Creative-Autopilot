import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

<<<<<<< HEAD
/* -----------------------------
   CORS
-------------------------------- */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/* -----------------------------
   Edge Function
-------------------------------- */
=======
// Base64 encoding for Deno (no atob/btoa in Edge runtime)
function base64Encode(bytes: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  while (i < bytes.length) {
    const a = bytes[i++];
    const b = i < bytes.length ? bytes[i++] : 0;
    const c = i < bytes.length ? bytes[i++] : 0;
    const bitmap = (a << 16) | (b << 8) | c;
    result += chars.charAt((bitmap >> 18) & 63);
    result += chars.charAt((bitmap >> 12) & 63);
    result += i - 2 < bytes.length ? chars.charAt((bitmap >> 6) & 63) : '=';
    result += i - 1 < bytes.length ? chars.charAt(bitmap & 63) : '=';
  }
  return result;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

>>>>>>> 055de08f9cc8fc73e354e83e386e55b8d4e80f50
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
<<<<<<< HEAD

    const { brandAnalysis, format, style } = body || {};

    /* -----------------------------
       ENV
    -------------------------------- */
    const NSCALE_API_KEY = Deno.env.get("NSCALE_API_KEY");
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!NSCALE_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "NSCALE_API_KEY missing. Add it in Supabase → Edge Functions → Secrets.",
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    /* -----------------------------
       Brand Context
    -------------------------------- */
    const colorPalette = Array.isArray(brandAnalysis?.primaryColors)
      ? brandAnalysis.primaryColors.join(", ")
      : "vibrant brand colors";

    const brandStyle =
      brandAnalysis?.style ||
      brandAnalysis?.personality ||
      "modern and professional";

    const typography = brandAnalysis?.typography || "clean sans-serif";

    const styleLabel = style || "clean and engaging";

    /* -----------------------------
       Prompt
    -------------------------------- */
    const imagePrompt = `
Professional ${format || "social media"} advertisement creative.
Style: ${brandStyle}, ${styleLabel}.
Brand colors: ${colorPalette}.
Typography: ${typography}.
High-quality marketing design, balanced layout,
commercial advertising aesthetic, realistic lighting, highly detailed.
`.trim();

    /* -----------------------------
       Dimensions
    -------------------------------- */
    let size = "1024x1024";

    switch (format) {
      case "Instagram Story":
        size = "1080x1920";
        break;
      case "Instagram Post":
        size = "1080x1080";
        break;
      case "Facebook Post":
        size = "1200x630";
        break;
      case "LinkedIn Post":
        size = "1200x1200";
        break;
      default:
        size = "1920x1080";
    }

    /* -----------------------------
       NSCALE FLUX IMAGE GENERATION
    -------------------------------- */
    const nscaleRes = await fetch(
      "https://inference.api.nscale.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NSCALE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "black-forest-labs/FLUX.1-schnell",
          prompt: imagePrompt,
          size,
          n: 1,
        }),
      }
    );

    const data = await nscaleRes.json();

    if (!nscaleRes.ok) {
      return new Response(
        JSON.stringify({ error: "nscale failed", details: data }),
        { status: 500, headers: corsHeaders }
      );
    }

    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "Invalid nscale response", data }),
        { status: 500, headers: corsHeaders }
      );
    }

    const imageUrl = `data:image/png;base64,${imageBase64}`;

    /* -----------------------------
       Optional Gemini Description
    -------------------------------- */
    let description = "";

    if (GOOGLE_AI_API_KEY) {
      try {
        const descRes = await fetch(
=======
    const {
      brandAnalysis,            // { primaryColors: string[], style: string, typography?: string, personality?: string, creativeDirections?: string[] }
      format,                   // e.g., "Instagram Post", "Facebook Post"
      style,                    // UI style label, e.g., "Bold & Vibrant"
      productImageUrl,          // optional hero/packshot image URL
      assets                    // optional array of assets: [{ url, publicUrl, id, type } | string]
    } = body || {};

    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
    const HUGGINGFACE_API_KEY = Deno.env.get("HUGGINGFACE_API_KEY");

    if (!HUGGINGFACE_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "HUGGINGFACE_API_KEY is missing. To generate images: 1) Get a free token at https://huggingface.co/settings/tokens, 2) In Supabase Dashboard → Edge Functions → Settings → Secrets set HUGGINGFACE_API_KEY, 3) Redeploy this function."
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Derive brand context
    const colorPalette = Array.isArray(brandAnalysis?.primaryColors)
      ? brandAnalysis.primaryColors.join(", ")
      : (Array.isArray(brandAnalysis?.colors) ? brandAnalysis.colors.join(", ") : "vibrant brand colors");
    const brandStyle = brandAnalysis?.style || brandAnalysis?.personality || "modern and professional";
    const typography = brandAnalysis?.typography || "clean sans-serif typography";
    const directions = Array.isArray(brandAnalysis?.creativeDirections) ? `Creative directions: ${brandAnalysis.creativeDirections.slice(0,3).join('; ')}.` : "";
    const styleLabel = style || "clean and engaging";

    // Normalize asset URLs
    const assetUrls: string[] = Array.isArray(assets)
      ? assets.map((a: any) => (typeof a === 'string' ? a : (a.url || a.publicUrl))).filter(Boolean)
      : [];
    const assetSummary = assetUrls.length
      ? `Use these brand assets strictly as references for composition, color fidelity, iconography, and subject matter (the model cannot fetch URLs; treat them as guidance only): ${assetUrls.join(', ')}.`
      : "";

    // Compose prompt
    let imagePrompt = `Professional ${format || 'social media'} advertisement creative, ${brandStyle} style, ${styleLabel}, brand colors ${colorPalette}, typography ${typography}, high quality marketing design, polished and professional, balanced layout, safe text areas, commercial advertising aesthetic, realistic lighting, highly detailed. ${assetSummary} ${directions}`.trim();

    if (productImageUrl) {
      imagePrompt = `Professional ${format || 'social media'} advertisement creative featuring the product as the hero element, ${brandStyle} style, ${styleLabel}, brand colors ${colorPalette}, typography ${typography}, product photography emphasis, compelling visual composition, commercial advertising style, professional lighting, highly detailed. ${assetSummary} ${directions}`.trim();
    }

    // Dimension presets by format
    let width = 1024;
    let height = 1024;
    switch (format) {
      case "Instagram Story":
        width = 1080; height = 1920; break;
      case "Instagram Post":
        width = 1080; height = 1080; break;
      case "Facebook Post":
        width = 1200; height = 630; break;
      case "LinkedIn Post":
        width = 1200; height = 1200; break;
      default:
        width = 1920; height = 1080; break; // 16:9 generic
    }

    // If we have a clear product/seed image, attempt image-to-image with Stability SD3 first
    let seededImageUrl: string | null = null;
    const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY");
    const seedUrl = productImageUrl || (assetUrls.length ? assetUrls[0] : null);
    if (STABILITY_API_KEY && seedUrl) {
      try {
        const seedRes = await fetch(seedUrl);
        if (seedRes.ok) {
          const seedBlob = await seedRes.blob();
          const form = new FormData();
          form.append("image", new File([seedBlob], "seed.png", { type: seedBlob.type || "image/png" }));
          form.append("prompt", imagePrompt);
          form.append("mode", "image-to-image");
          form.append("output_format", "png");
          form.append("image_strength", "0.65");

          const sdRes = await fetch("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${STABILITY_API_KEY}`,
              "Accept": "image/*",
            },
            body: form,
          });

          if (sdRes.ok) {
            const imgBlob = await sdRes.blob();
            const arr = new Uint8Array(await imgBlob.arrayBuffer());
            seededImageUrl = `data:image/png;base64,${base64Encode(arr)}`;
          }
        }
      } catch (_) {
        // ignore and fall back
      }
    }

    if (seededImageUrl) {
      // Optional concise description via Gemini
      let description = "";
      if (GOOGLE_AI_API_KEY) {
        try {
          const descResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GOOGLE_AI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `Describe this ${format || 'ad'} creative in 2-3 concise sentences focusing on adherence to brand palette (${colorPalette}), style (${brandStyle}), and typography (${typography}). Prompt context: ${imagePrompt}` }] }],
                generationConfig: { maxOutputTokens: 160 }
              }),
            }
          );
          if (descResponse.ok) {
            const descData = await descResponse.json();
            description = descData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          }
        } catch (_) {}
      }

      return new Response(
        JSON.stringify({
          imageUrl: seededImageUrl,
          description,
          meta: {
            width,
            height,
            model: "stability-sd3-img2img",
            usedAssets: assetUrls,
            brand: { colorPalette, brandStyle, typography },
            format: format || "Generic",
            style: styleLabel,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // HF model
    const model = "black-forest-labs/FLUX.1-schnell";
    const hfUrl = `https://api-inference.huggingface.co/models/${model}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(HUGGINGFACE_API_KEY ? { "Authorization": `Bearer ${HUGGINGFACE_API_KEY}` } : {}),
    };

    // Call Hugging Face with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    let hfResponse: Response;
    try {
      hfResponse = await fetch(hfUrl, {
        method: "POST",
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          inputs: imagePrompt,
          parameters: {
            width,
            height,
            num_inference_steps: 28,
            guidance_scale: 7.0,
          },
          options: { wait_for_model: true }
        }),
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text().catch(() => "");
      let msg = `Hugging Face API error ${hfResponse.status}`;
      if (hfResponse.status === 401) msg += ": invalid HUGGINGFACE_API_KEY";
      if (hfResponse.status === 503) msg += ": model loading or temporarily unavailable";

      // Graceful fallback: try to provide a text description so the UI can proceed
      let fallbackDescription = "";
      if (GOOGLE_AI_API_KEY) {
        try {
          const descResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GOOGLE_AI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `Generate a 2-3 sentence description for a ${format || 'social media'} advertisement creative adhering to: Palette: ${colorPalette}. Style: ${brandStyle}. Typography: ${typography}. ${directions}` }] }],
                generationConfig: { maxOutputTokens: 160 }
              }),
            }
          );
          if (descResponse.ok) {
            const descData = await descResponse.json();
            fallbackDescription = descData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          }
        } catch (_) { /* ignore */ }
      }

      // No Gemini or failed: basic deterministic fallback
      if (!fallbackDescription) {
        fallbackDescription = `A ${format || 'social media'} advertisement in a ${brandStyle} style, using brand colors (${colorPalette}) and ${typography}. Clean layout with safe text areas and professional lighting.`;
      }

      return new Response(
        JSON.stringify({
          imageUrl: null,
          description: fallbackDescription,
          meta: {
            width,
            height,
            model,
            usedAssets: assetUrls,
            brand: { colorPalette, brandStyle, typography },
            format: format || "Generic",
            style: styleLabel,
          },
          warnings: { image: `${msg}: ${errorText.slice(0, 300)}` }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const imageBlob = await hfResponse.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64 = base64Encode(uint8Array);
    const imageUrl = `data:image/png;base64,${base64}`;

    // Optional concise description via Gemini
    let description = "";
    if (GOOGLE_AI_API_KEY) {
      try {
        const descResponse = await fetch(
>>>>>>> 055de08f9cc8fc73e354e83e386e55b8d4e80f50
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GOOGLE_AI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
<<<<<<< HEAD
              contents: [
                {
                  parts: [
                    {
                      text: `Describe this ${format || "ad"} creative in 2–3 sentences.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (descRes.ok) {
          const d = await descRes.json();
          description =
            d.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch {}
    }

    /* -----------------------------
       Response
    -------------------------------- */
=======
              contents: [{ parts: [{ text: `Describe this ${format || 'ad'} creative in 2-3 concise sentences focusing on adherence to brand palette (${colorPalette}), style (${brandStyle}), and typography (${typography}). Prompt context: ${imagePrompt}` }] }],
              generationConfig: { maxOutputTokens: 160 }
            }),
          }
        );
        if (descResponse.ok) {
          const descData = await descResponse.json();
          description = descData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (_) { /* ignore description failure */ }
    }

>>>>>>> 055de08f9cc8fc73e354e83e386e55b8d4e80f50
    return new Response(
      JSON.stringify({
        imageUrl,
        description,
        meta: {
<<<<<<< HEAD
          model: "FLUX.1-schnell",
          size,
          style: styleLabel,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: corsHeaders }
=======
          width,
          height,
          model,
          usedAssets: assetUrls,
          brand: { colorPalette, brandStyle, typography },
          format: format || "Generic",
          style: styleLabel,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
>>>>>>> 055de08f9cc8fc73e354e83e386e55b8d4e80f50
    );
  }
});
