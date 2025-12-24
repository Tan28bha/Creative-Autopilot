import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandAnalysis, format, style, productImageUrl } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!GOOGLE_AI_API_KEY) {
      console.error("GOOGLE_AI_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error: GOOGLE_AI_API_KEY is missing." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating creative:", { format, style, hasProductImage: !!productImageUrl });

    // Build prompt for image generation
    const colorPalette = brandAnalysis?.primaryColors?.join(", ") || "vibrant brand colors";
    const brandStyle = brandAnalysis?.style || "modern and professional";

    let prompt = `Create a ${format || "social media"} advertisement creative with the following specifications:
- Brand colors: ${colorPalette}
- Style: ${brandStyle}, ${style || "clean and engaging"}
- Format: Professional advertisement suitable for digital marketing
- Include space for product placement and call-to-action text
- High quality, polished design
Ultra high resolution, professional advertising creative`;

    if (productImageUrl) {
      prompt = `Create a ${format || "social media"} advertisement creative featuring the product shown in the image. Specifications:
- Prominently feature the product from the provided image
- Brand colors: ${colorPalette}
- Style: ${brandStyle}, ${style || "clean and engaging"}
- Format: Professional advertisement suitable for digital marketing
- Add compelling visual elements around the product
- Make the product the hero of the creative
Ultra high resolution, professional advertising creative`;
    }

    const imageContent: any[] = [];

    if (productImageUrl) {
      const productImageData = await (async () => {
        if (productImageUrl.startsWith('data:')) {
          return productImageUrl.split(',')[1];
        } else {
          return await fetch(productImageUrl).then(r => r.arrayBuffer()).then(b => btoa(String.fromCharCode(...new Uint8Array(b))));
        }
      })();
      imageContent.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: productImageData
        }
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            ...imageContent
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const generatedImageBase64 = candidate?.content?.parts?.find((p: any) => p.inline_data)?.inline_data?.data;
    const textContent = candidate?.content?.parts?.find((p: any) => p.text)?.text || "";

    // Convert base64 to data URL for the image
    const generatedImage = generatedImageBase64 ? `data:image/jpeg;base64,${generatedImageBase64}` : null;

    console.log("Creative generation completed", { hasImage: !!generatedImage });

    return new Response(
      JSON.stringify({
        imageUrl: generatedImage,
        description: textContent,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-creative function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
