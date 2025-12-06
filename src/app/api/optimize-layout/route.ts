import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { layout } = await req.json();

    const prompt = `
      You are a professional ad designer.
      Improve this layout for visual balance, spacing, and hierarchy.

      Return a NEW layout JSON with:
      - No overlapping elements
      - Better alignment
      - Visual balance
      - Text positioned cleanly
      - Logo visible but not dominant
      - Product centered properly

      Return ONLY JSON.
      
      Layout:
      ${JSON.stringify(layout)}
    `;

    const result = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const optimized = JSON.parse(result.choices[0].message.content || "{}");

    return NextResponse.json({ layout: optimized });
  } catch (error) {
    console.error("Optimize layout error:", error);
    return NextResponse.json(
      { error: "Layout optimization failed" },
      { status: 500 }
    );
  }
}
