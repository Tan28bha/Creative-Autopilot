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
      const creativeImageData = await fetch(creativeImageUrl).then(r => r.arrayBuffer()).then(b => btoa(String.fromCharCode(...new Uint8Array(b))));
      imageContent.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: creativeImageData
        }
      });
    }

    if (productImageUrl) {
      const productImageData = await fetch(productImageUrl).then(r => r.arrayBuffer()).then(b => btoa(String.fromCharCode(...new Uint8Array(b))));
      imageContent.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: productImageData
        }
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
