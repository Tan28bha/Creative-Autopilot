import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));

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
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GOOGLE_AI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
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
    return new Response(
      JSON.stringify({
        imageUrl,
        description,
        meta: {
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
    );
  }
});
