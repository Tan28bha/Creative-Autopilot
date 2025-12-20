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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    // Build messages array with optional image
    const messageContent: any[] = [{ type: "text", text: prompt }];
    
    if (productImageUrl) {
      messageContent.unshift({
        type: "image_url",
        image_url: { url: productImageUrl },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: messageContent,
          },
        ],
        modalities: ["image", "text"],
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
    const message = data.choices?.[0]?.message;
    const generatedImage = message?.images?.[0]?.image_url?.url;
    const textContent = message?.content || "";

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
