import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, brandName, primaryColor, secondaryColor, tone } =
      await req.json();

    const fullPrompt = `
      Ultra-clean advertisement background.
      Smooth soft gradients, premium lighting, modern commercial aesthetic.
      Brand style colors: ${primaryColor}, ${secondaryColor}
      Mood: ${tone}
      Additional style: ${prompt}

      Requirements:
      - No objects
      - No people
      - No text
      - Minimal noise
      - Product-friendly
      - Center composition
      - High resolution
      - Soft advertising gradient
    `;

    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text_prompts: [
            { text: fullPrompt, weight: 1 },
            { text: "ugly, cluttered, messy, random objects, people, text", weight: -1 }
          ],
          cfg_scale: 7,
          steps: 40,
          samples: 1,
          width: 1024,
          height: 1024,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Stability error:", err);
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const result = await response.json();
    const base64 = result.artifacts[0].base64;

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${base64}`,
    });

  } catch (error) {
    console.error("Background Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate background" },
      { status: 500 }
    );
  }
}
