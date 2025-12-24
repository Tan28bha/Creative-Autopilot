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
    const { imageUrls, assetTypes } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    if (!imageUrls || imageUrls.length === 0) {
      throw new Error("No images provided for analysis");
    }

    console.log("Analyzing brand assets:", { imageCount: imageUrls.length, assetTypes });

    // Build the content array with images for Gemini API
    const imageContent: any[] = [];

    // Convert image URLs to base64 for Gemini API
    for (const url of imageUrls) {
      const imageData = await (async () => {
        if (url.startsWith('data:')) {
          return url.split(',')[1];
        } else {
          try {
            return await fetch(url).then(r => r.arrayBuffer()).then(b => btoa(String.fromCharCode(...new Uint8Array(b))));
          } catch (e) {
            console.error(`Failed to fetch image: ${url}`, e);
            return null;
          }
        }
      })();

      if (!imageData) continue;
      imageContent.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageData
        }
      });
    }

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
          temperature: 0.1,
          topK: 1,
          topP: 1,
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
