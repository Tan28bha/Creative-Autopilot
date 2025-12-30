import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Base64 encoding helper for Deno
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let requestData;
    try {
      requestData = await req.json();
    } catch (jsonError) {
      console.error("Failed to parse request JSON:", jsonError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { brandAnalysis, format, style, productImageUrl } = requestData;
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    console.log("Generating creative:", { format, style, hasProductImage: !!productImageUrl });

    // Build prompt for image generation
    const colorPalette = brandAnalysis?.primaryColors?.join(", ") || "vibrant brand colors";
    const brandStyle = brandAnalysis?.style || "modern and professional";
    const styleLabel = style || "clean and engaging";

    // Create a more detailed prompt for better image generation
    let imagePrompt = `Professional ${format || "social media"} advertisement creative, ${brandStyle} style, ${styleLabel}, brand colors ${colorPalette}, high quality marketing design, polished and professional, clean layout, space for text overlay, modern advertising aesthetic, commercial photography style, 8k resolution, highly detailed`;

    if (productImageUrl) {
      imagePrompt = `Professional ${format || "social media"} advertisement creative featuring a product as the hero element, ${brandStyle} style, ${styleLabel}, brand colors ${colorPalette}, product photography, compelling visual composition, high quality marketing material, commercial advertising style, professional lighting, 8k resolution, highly detailed`;
    }

    let generatedImage: string | null = null;
    let description = "";

    // Use Hugging Face Inference API for image generation
    console.log("Using Hugging Face Inference API for image generation");
    console.log("Image prompt:", imagePrompt);
    
    const HUGGINGFACE_API_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
    console.log("HUGGINGFACE_API_KEY present:", !!HUGGINGFACE_API_KEY);
    
    // Debug: Check for common environment variable names
    const hasGoogleKey = !!Deno.env.get("GOOGLE_AI_API_KEY");
    console.log("Environment check - GOOGLE_AI_API_KEY:", hasGoogleKey, "HUGGINGFACE_API_KEY:", !!HUGGINGFACE_API_KEY);
    
    // Router endpoint requires API key
    if (!HUGGINGFACE_API_KEY) {
      console.error("HUGGINGFACE_API_KEY is missing");
      console.error("To fix this:\n1. Go to Supabase Dashboard → Edge Functions → Settings → Secrets\n2. Add secret: HUGGINGFACE_API_KEY = your_token\n3. Redeploy the function");
      return new Response(
        JSON.stringify({ 
          error: "HUGGINGFACE_API_KEY is required for image generation. Please:\n1. Get a free token at https://huggingface.co/settings/tokens\n2. Set it in Supabase Dashboard → Edge Functions → Settings → Secrets (name: HUGGINGFACE_API_KEY)\n3. Redeploy the function (IMPORTANT: Secrets only apply after redeployment)"
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Starting image generation process...");
    try {
      // Determine dimensions based on format
      let width = 1024;
      let height = 1024;
      if (format === "Instagram Story") {
        width = 1080;
        height = 1920;
      } else if (format === "Instagram Post") {
        width = 1080;
        height = 1080;
      } else if (format === "Facebook Post") {
        width = 1200;
        height = 630;
      } else {
        width = 1920;
        height = 1080;
      }

      // Use Flux model via Hugging Face for higher quality results
      // Flux produces more photorealistic and detailed images
      const model = "black-forest-labs/FLUX.1-schnell";
      const hfUrl = `https://api-inference.huggingface.co/models/${model}`;

      console.log("Setting up API request...");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
      };

      console.log("Calling Hugging Face API:", hfUrl);
      console.log("About to make fetch request...");
      console.log("Request parameters:", { width, height, model });
      console.log("Prompt length:", imagePrompt.length);
      
      // Add timeout to prevent hanging (60 seconds max for image generation)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.error("Hugging Face API request timed out after 60 seconds");
      }, 60000); // 60 second timeout
      
      let hfResponse: Response;
      try {
        hfResponse = await fetch(hfUrl, {
          method: "POST",
          headers: headers,
          signal: controller.signal,
          body: JSON.stringify({
            inputs: imagePrompt,
            parameters: {
              width: width,
              height: height,
              num_inference_steps: 30,
              guidance_scale: 7.5,
            },
          }),
        });
        
        clearTimeout(timeoutId);
        
        console.log("Hugging Face API response status:", hfResponse.status, hfResponse.statusText);

        if (!hfResponse.ok) {
          const errorText = await hfResponse.text();
          console.error("Hugging Face API error:", hfResponse.status, errorText);
          console.error("Error text length:", errorText.length);
          
          // Handle 401 - authentication required
          if (hfResponse.status === 401) {
            throw new Error(`Hugging Face API authentication failed (401). Please verify your HUGGINGFACE_API_KEY is correct and has proper permissions. Get a free token at https://huggingface.co/settings/tokens`);
          }
          // Handle deprecated endpoint error (410)
          else if (hfResponse.status === 410) {
            throw new Error("Hugging Face API endpoint has been updated. Please redeploy the function with the latest code.");
          }
          // If model is loading, wait and retry
          else if (hfResponse.status === 503) {
            try {
              const errorJson = JSON.parse(errorText);
              if (errorJson.error && errorJson.error.includes("loading")) {
                // Wait for model to load and retry once
                console.log("Model is loading, waiting 10 seconds...");
                await new Promise(resolve => setTimeout(resolve, 10000));
                
                const retryController = new AbortController();
                const retryTimeoutId = setTimeout(() => retryController.abort(), 60000);
                
                const retryResponse = await fetch(hfUrl, {
                  method: "POST",
                  headers: headers,
                  signal: retryController.signal,
                  body: JSON.stringify({
                    inputs: imagePrompt,
                    parameters: {
                      width: width,
                      height: height,
                      num_inference_steps: 30,
                      guidance_scale: 7.5,
                    },
                  }),
                });
                
                clearTimeout(retryTimeoutId);

                if (retryResponse.ok) {
                  const imageBlob = await retryResponse.blob();
                  const arrayBuffer = await imageBlob.arrayBuffer();
                  const uint8Array = new Uint8Array(arrayBuffer);
                  
                  // Use custom base64 encoding for reliability
                  const base64 = base64Encode(uint8Array);
                  generatedImage = `data:image/png;base64,${base64}`;
                  console.log("Image generation completed via Hugging Face (after retry)");
                } else {
                  const retryErrorText = await retryResponse.text();
                  throw new Error(`Hugging Face API error after retry: ${retryResponse.status} - ${retryErrorText}`);
                }
              } else {
                throw new Error(`Hugging Face API error: ${hfResponse.status} - ${errorText}`);
              }
            } catch (e) {
              throw new Error(`Hugging Face API error: ${hfResponse.status} - ${errorText}`);
            }
          } else {
            throw new Error(`Hugging Face API error: ${hfResponse.status} - ${errorText.substring(0, 200)}`);
          }
        } else {
          // Success - convert blob to base64
          console.log("Hugging Face API returned success, processing image...");
          try {
            const imageBlob = await hfResponse.blob();
            console.log("Image blob received, size:", imageBlob.size, "bytes, type:", imageBlob.type);
            const arrayBuffer = await imageBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            console.log("Encoding image to base64, array length:", uint8Array.length);
            // Use custom base64 encoding for reliability
            const base64 = base64Encode(uint8Array);
            generatedImage = `data:image/png;base64,${base64}`;
            console.log("Image generation completed via Hugging Face. Image size:", uint8Array.length, "bytes");
          } catch (encodeError) {
            console.error("Failed to encode image to base64:", encodeError);
            console.error("Encode error stack:", encodeError instanceof Error ? encodeError.stack : "No stack");
            throw new Error(`Failed to process generated image: ${encodeError instanceof Error ? encodeError.message : String(encodeError)}`);
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error("Hugging Face API request timed out after 60 seconds. The model may be slow or overloaded. Please try again.");
        }
        throw fetchError;
      }

      // Generate description using Gemini if available
      if (GOOGLE_AI_API_KEY && generatedImage) {
        try {
          const descResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GOOGLE_AI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{
                  parts: [{ text: `Describe this marketing creative in 2-3 sentences: ${imagePrompt}` }]
                }],
                generationConfig: { maxOutputTokens: 200 }
              }),
            }
          );
          if (descResponse.ok) {
            const descData = await descResponse.json();
            description = descData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          }
        } catch (e) {
          console.warn("Failed to generate description:", e);
        }
      }
    } catch (hfError) {
      console.error("Hugging Face image generation failed:", hfError);
      const errorMessage = hfError instanceof Error ? hfError.message : String(hfError);
      console.error("Error details:", errorMessage);
      
      return new Response(
        JSON.stringify({ 
          error: `Image generation failed: ${errorMessage}. ${HUGGINGFACE_API_KEY ? 'Please check your HUGGINGFACE_API_KEY.' : 'Consider setting HUGGINGFACE_API_KEY for better rate limits (free at https://huggingface.co/settings/tokens).'}`
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback: Use Gemini to generate description if image generation failed or not available
    if (!generatedImage && GOOGLE_AI_API_KEY) {
      console.log("Using Gemini for description generation (image generation not available)");
      
      const geminiPrompt = `Generate a detailed description for a ${format || "social media"} advertisement creative with:
- Brand colors: ${colorPalette}
- Style: ${brandStyle}, ${style || "clean and engaging"}
- Format: Professional advertisement suitable for digital marketing
${productImageUrl ? "- Featuring a product prominently" : ""}

Provide a 2-3 sentence description of what this creative should look like.`;

      try {
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GOOGLE_AI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: geminiPrompt }] }],
              generationConfig: { maxOutputTokens: 300 }
            }),
          }
        );

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          description = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (e) {
        console.error("Gemini description generation failed:", e);
      }
    }

    console.log("Creative generation completed", { hasImage: !!generatedImage, hasDescription: !!description });

    // Ensure we always return a valid response
    if (!generatedImage && !description) {
      console.warn("No image or description generated, returning error");
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate creative. No image or description was produced. Please check the logs for details."
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        imageUrl: generatedImage,
        description: description,
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in generate-creative function:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
