import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Base64 encoding function for Deno
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
    const { imageUrls, assetTypes } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!GOOGLE_AI_API_KEY) {
      console.error("GOOGLE_AI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ 
          error: "GOOGLE_AI_API_KEY is not configured. Please set it in Supabase Dashboard → Edge Functions → Settings → Secrets" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!imageUrls || imageUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: "No images provided for analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (imageUrls.length > 10) {
      return new Response(
        JSON.stringify({ error: "Too many images provided. Please limit to 10 images or fewer for analysis." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing brand assets:", { imageCount: imageUrls.length, assetTypes });
    console.log("Image URLs:", imageUrls);

    // Build the content array with images for Gemini API
    const imageContent: any[] = [];

    // Convert image URLs to base64 for Gemini API
    console.log("Starting image processing...");
    for (const url of imageUrls) {
      console.log(`Processing image: ${url}`);
      const imageData = await (async () => {
        if (url.startsWith('data:')) {
          return url.split(',')[1];
        } else {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              console.error(`Failed to fetch image: ${url} - Status: ${response.status}`);
              return null;
            }
            const arrayBuffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Check if image is too large (Gemini has limits)
            if (uint8Array.length > 20 * 1024 * 1024) { // 20MB limit
              console.error(`Image too large: ${url} - Size: ${uint8Array.length} bytes`);
              return null;
            }
            
            // Convert to base64 using manual implementation
            try {
              const base64 = base64Encode(uint8Array);
              return base64;
            } catch (encodeError) {
              console.error(`Failed to encode image to base64: ${url}`, encodeError);
              return null;
            }
          } catch (e) {
            console.error(`Failed to fetch image: ${url}`, e);
            return null;
          }
        }
      })();

      if (!imageData) {
        console.warn(`Skipping image due to fetch/encode failure: ${url}`);
        continue;
      }

      // Determine mime type from URL or default to jpeg
      let mimeType = "image/jpeg";
      if (url.includes('.png')) mimeType = "image/png";
      else if (url.includes('.gif')) mimeType = "image/gif";
      else if (url.includes('.webp')) mimeType = "image/webp";

      imageContent.push({
        inline_data: {
          mime_type: mimeType,
          data: imageData
        }
      });
    }


    console.log("Processed images for analysis:", imageContent.length);
    
    if (imageContent.length === 0) {
      console.error("No images were successfully processed");
      return new Response(
        JSON.stringify({ 
          error: "Failed to process any images for analysis. Please ensure images are accessible and valid. Check that image URLs are publicly accessible." 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Building prompt and calling Gemini API...");
    const prompt = `You are a brand analyst AI. Analyze the provided brand assets and extract:
1. Primary and secondary brand colors (in hex format)
2. Brand style characteristics (modern, classic, playful, professional, etc.)
3. Typography style observations
4. Visual patterns or textures
5. Overall brand personality
6. Suggested creative directions for ad variations

Provide your analysis in a structured JSON format with these exact keys:
{
  "primaryColors": ["#hex1", "#hex2"],
  "secondaryColors": ["#hex3", "#hex4"],
  "style": "modern/professional/etc",
  "typography": "description of typography style",
  "patterns": "description of visual patterns",
  "personality": "overall brand personality",
  "creativeDirections": ["suggestion1", "suggestion2"]
}

Respond with ONLY the JSON, no other text.`;

    // Use gemini-3-flash-preview on v1beta API (model not available on v1)
    const modelName = "gemini-3-flash-preview";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GOOGLE_AI_API_KEY}`;
    console.log("Calling Gemini API with model:", modelName);
    console.log("API URL (key hidden):", apiUrl.replace(GOOGLE_AI_API_KEY, "***"));
    console.log("Request payload size:", JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          ...imageContent
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      }
    }).length, "bytes");
    
    const response = await fetch(apiUrl, {
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
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Gemini API error:", response.status, errorText);

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
      if (response.status === 400) {
        return new Response(
          JSON.stringify({ error: "Invalid request to AI service. Please check your images and try again." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 403) {
        return new Response(
          JSON.stringify({ error: "AI API key is invalid or expired. Please check your configuration." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 404) {
        // Model not found - try to parse the error and provide helpful message
        let errorMessage = "Gemini model not found. The model name or API version may be incorrect.";
        try {
          const errorData = JSON.parse(errorText);
          if (errorData?.error?.message) {
            errorMessage = `Gemini API Error: ${errorData.error.message}. Please check the Google AI Studio for available models.`;
          }
        } catch (e) {
          // If parsing fails, use the raw error text
          errorMessage = `Gemini API Error (404): ${errorText}`;
        }
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Google Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Brand analysis completed successfully");

    // Try to parse JSON from the response
    let analysis;
    try {
      const jsonMatch = analysisText.match(/```json\n?([\s\S]*?)\n?```/) ||
        analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        analysis = { rawAnalysis: analysisText };
      }
    } catch {
      analysis = { rawAnalysis: analysisText };
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-brand function:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error instanceof Error && error.stack ? `\nStack: ${error.stack}` : "";
    
    return new Response(
      JSON.stringify({ 
        error: `Internal server error: ${errorMessage}${errorDetails}`,
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
