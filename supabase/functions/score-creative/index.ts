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
    const { imageUrl, brandGuidelines, platform } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    if (!imageUrl) {
      throw new Error("Image URL is required for quality scoring");
    }

    console.log("Scoring creative quality:", { platform, hasGuidelines: !!brandGuidelines });

    const prompt = `Analyze this marketing creative and score its quality across four key dimensions:

1. Visual Hierarchy (0-100): How well does the design guide the viewer's eye? Consider focal points, composition balance, visual flow, and element prominence.

2. Brand Consistency (0-100): How well does the creative align with brand guidelines? Evaluate color usage, typography, style consistency, logo placement, and brand voice.

3. Text Readability (0-100): How easily can text be read? Assess font size, contrast ratios, text placement, hierarchy, and legibility against backgrounds.

4. Platform Fitness (0-100): How well-suited is this creative for ${platform || "social media"}? Consider format optimization, safe zones, aspect ratio, mobile viewing, and platform-specific best practices.

${brandGuidelines ? `Brand Guidelines: ${brandGuidelines}` : ""}

Provide your analysis in the following JSON format:
{
  "creativeScore": 87,
  "visualHierarchy": 85,
  "brandConsistency": 90,
  "textReadability": 88,
  "platformFitness": 85,
  "strengths": [
    "Clear CTA",
    "Strong contrast",
    "Well-balanced composition"
  ],
  "improvements": [
    "Logo visibility could be higher",
    "Text size could be increased for mobile viewing"
  ]
}

Where:
- creativeScore: Overall quality score (0-100), calculated as the average of the four dimensions
- visualHierarchy: Score for visual hierarchy (0-100)
- brandConsistency: Score for brand consistency (0-100)
- textReadability: Score for text readability (0-100)
- platformFitness: Score for platform fitness (0-100)
- strengths: Array of positive aspects (2-4 items)
- improvements: Array of actionable improvement suggestions (2-4 items)

Respond with ONLY the JSON, no other text.`;

    const modelName = "gemini-3-flash-preview";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GOOGLE_AI_API_KEY}`;
    console.log("Calling Gemini API with model (score-creative):", modelName);

    const response = await fetch(apiUrl, {
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
          temperature: 0.3,
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
          JSON.stringify({ error: "API credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse JSON from response
    let scoreData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scoreData = JSON.parse(jsonMatch[0]);
        
        // Calculate overall score if not provided or validate it
        if (!scoreData.creativeScore && scoreData.visualHierarchy && scoreData.brandConsistency && scoreData.textReadability && scoreData.platformFitness) {
          scoreData.creativeScore = Math.round(
            (scoreData.visualHierarchy + scoreData.brandConsistency + scoreData.textReadability + scoreData.platformFitness) / 4
          );
        }
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError, "Content:", content);
      // Return fallback data
      scoreData = {
        creativeScore: 75,
        visualHierarchy: 75,
        brandConsistency: 75,
        textReadability: 75,
        platformFitness: 75,
        strengths: ["Creative appears professionally designed"],
        improvements: ["Consider manual quality review for detailed feedback"]
      };
    }

    return new Response(JSON.stringify(scoreData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in score-creative:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

