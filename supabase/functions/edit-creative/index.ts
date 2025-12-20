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
    const { creativeImageUrl, productImageUrl, editInstruction, brandAnalysis } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!creativeImageUrl && !productImageUrl) {
      throw new Error("At least one image URL is required");
    }

    console.log("Editing/merging creative:", { 
      hasCreative: !!creativeImageUrl, 
      hasProduct: !!productImageUrl,
      instruction: editInstruction 
    });

    // Build the content array with images
    const imageContent: any[] = [];
    
    if (creativeImageUrl) {
      imageContent.push({
        type: "image_url",
        image_url: { url: creativeImageUrl },
      });
    }
    
    if (productImageUrl) {
      imageContent.push({
        type: "image_url",
        image_url: { url: productImageUrl },
      });
    }

    // Build prompt based on context
    const colorPalette = brandAnalysis?.primaryColors?.join(", ") || "brand colors";
    const brandStyle = brandAnalysis?.style || "professional";
    
    let prompt = editInstruction || "";
    
    if (creativeImageUrl && productImageUrl) {
      prompt = `Merge these images: Place the product from the second image naturally into the first creative/background image. ${editInstruction || "Blend them seamlessly while maintaining brand consistency."}
Style: ${brandStyle}
Colors: ${colorPalette}
Create a professional advertisement with the product as the focal point.`;
    } else if (productImageUrl && !creativeImageUrl) {
      prompt = `Create an advertisement creative featuring this product. ${editInstruction || ""}
Style: ${brandStyle}, professional marketing creative
Colors: ${colorPalette}
Make it suitable for social media advertising with clean composition.`;
    } else {
      prompt = `Edit this creative image: ${editInstruction || "Enhance and polish for professional advertising use."}
Maintain brand consistency and professional quality.`;
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
            content: [
              { type: "text", text: prompt },
              ...imageContent,
            ],
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

    console.log("Edit/merge completed", { hasImage: !!generatedImage });

    return new Response(
      JSON.stringify({ 
        imageUrl: generatedImage,
        description: textContent,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in edit-creative function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
