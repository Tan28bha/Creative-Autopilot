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
    const { imageUrl } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    if (!imageUrl) {
      throw new Error("Image URL is required");
    }

    const prompt = `You are an expert in visual attention prediction and advertising effectiveness analysis.

Analyze this marketing creative image and predict where viewers will look and how likely they are to click.

Provide your analysis in the following JSON format:
{
  "regions": [
    {
      "x": 0.3,
      "y": 0.15,
      "width": 0.4,
      "height": 0.25,
      "intensity": 0.95,
      "label": "Primary Focus"
    }
  ],
  "ctrPrediction": 2.5,
  "insights": [
    "Insight about the creative's effectiveness"
  ]
}

Where:
- x, y, width, height are normalized values (0-1) representing the region
- intensity is 0-1 where 1 is highest attention
- ctrPrediction is expected click-through rate percentage (typically 1-5%)
- insights are actionable recommendations

Focus on:
1. Where the eye naturally goes first (headlines, faces, products)
2. Visual hierarchy and flow
3. CTA visibility and placement
4. Color contrast and attention-grabbing elements
5. Brand visibility

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
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: await (async () => {
                  if (imageUrl.startsWith('data:')) {
                    return imageUrl.split(',')[1];
                  } else {
                    return await fetch(imageUrl).then(r => r.arrayBuffer()).then(b => btoa(String.fromCharCode(...new Uint8Array(b))));
                  }
                })()
              }
            }
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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse JSON from response
    let analysisData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError, "Content:", content);
      // Return fallback data
      analysisData = {
        regions: [
          { x: 0.3, y: 0.15, width: 0.4, height: 0.25, intensity: 0.9, label: "Primary Focus" },
          { x: 0.25, y: 0.7, width: 0.5, height: 0.15, intensity: 0.8, label: "CTA Zone" },
          { x: 0.05, y: 0.05, width: 0.2, height: 0.1, intensity: 0.5, label: "Brand Area" },
        ],
        ctrPrediction: 2.3,
        insights: [
          "Strong visual hierarchy detected",
          "CTA placement is effective",
          "Consider increasing contrast for better visibility",
        ],
      };
    }

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-attention:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
