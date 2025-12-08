// src/app/api/ai-generate-layout/route.ts
import { NextResponse } from "next/server";
import { localLlama, LOCAL_LLAMA_MODEL } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    const { brand, product } = await req.json();

    const prompt = `
You are an expert retail creative layout designer.

Given this brand and product info, design ONE promotional creative layout for social media in JSON format.

Brand:
${JSON.stringify(brand)}

Product:
${JSON.stringify(product)}

Design rules:
- Canvas: portrait 1080x1350
- 40px safe margin
- Logo top-left, minimum 80px width
- Main offer text prominent and centered in upper-mid area
- Product image centered or slightly off-center
- CTA button at bottom area
- Use fields: id, type ("logo" | "text" | "image" | "cta"), x, y, width, height, text?, imageUrl?

Return JSON ONLY with this shape:
{
  "id": "layout-1",
  "name": "AI Generated Layout",
  "width": 1080,
  "height": 1350,
  "brandPrimary": "use brand.primaryColor",
  "brandSecondary": "use brand.secondaryColor",
  "borderRadius": 24,
  "shadow": 28,
  "baseFontSize": 36,
  "elements": [
    {
      "id": "logo-1",
      "type": "logo",
      "x": 40,
      "y": 40,
      "width": 110,
      "height": 110,
      "imageUrl": "brand.logoUrl"
    },
    {
      "id": "headline-1",
      "type": "text",
      "text": "Write a short bold offer headline",
      "x": 120,
      "y": 260,
      "width": 840,
      "height": 200
    },
    {
      "id": "product-1",
      "type": "image",
      "imageUrl": "brand.productUrl",
      "x": 290,
      "y": 420,
      "width": 500,
      "height": 500
    },
    {
      "id": "cta-1",
      "type": "cta",
      "text": "Shop Now",
      "x": 340,
      "y": 1000,
      "width": 400,
      "height": 120
    }
  ]
}
`;

    const completion = await localLlama.chat.completions.create({
      model: LOCAL_LLAMA_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    // Llama sometimes wraps JSON in markdown, clean it:
    const jsonText = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    const layout = JSON.parse(jsonText);

    return NextResponse.json(layout);
  } catch (err) {
    console.error("AI Layout Error:", err);
    return NextResponse.json(
      { error: "Failed to generate layout" },
      { status: 500 }
    );
  }
}
