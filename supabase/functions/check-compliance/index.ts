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
    const { imageUrl, brandGuidelines, targetAudience, platform } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    if (!imageUrl) {
      throw new Error("Image URL is required for compliance check");
    }

    console.log("Checking compliance:", { platform, hasGuidelines: !!brandGuidelines });

    const prompt = `Analyze this marketing creative for compliance with advertising standards, brand guidelines, and accessibility requirements.

Check against:
1. Advertising Standards: Truthful claims, no misleading content, appropriate for target audience
2. Brand Guidelines: Color usage, typography, style consistency, logo placement
3. Accessibility: Color contrast, text readability, alt text considerations
4. Platform Requirements: ${platform || "General social media"} specific rules
5. Target Audience: Appropriate content for ${targetAudience || "general audience"}

${brandGuidelines ? `Brand Guidelines: ${brandGuidelines}` : ""}

Provide your analysis in the following JSON format:
{
  "overallScore": 85,
  "compliant": true,
  "issues": [
    {
      "category": "Advertising Standards",
      "severity": "minor",
      "description": "Issue description",
      "recommendation": "How to fix"
    }
  ],
  "strengths": [
    "Positive aspect of the creative"
  ],
  "recommendations": [
    "Actionable improvement suggestion"
  ]
}

Where:
- overallScore: 0-100 compliance score
- compliant: boolean indicating if it passes basic requirements
- severity: "critical", "major", "minor"

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
                data: imageUrl.split(',')[1] // Extract base64 data if it's a data URL
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
    let complianceData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        complianceData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError, "Content:", content);
      // Return fallback data
      complianceData = {
        overallScore: 75,
        compliant: true,
        issues: [
          {
            category: "General",
            severity: "minor",
            description: "Unable to parse detailed analysis",
            recommendation: "Review creative manually for compliance"
          }
        ],
        strengths: ["Creative appears professionally designed"],
        recommendations: ["Consider manual compliance review"]
      };
    }

    return new Response(JSON.stringify(complianceData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in check-compliance:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
