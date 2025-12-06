import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { layout } = await req.json();

    const prompt = `
      Analyze this advertisement layout for compliance.

      Layout JSON:
      ${JSON.stringify(layout, null, 2)}

      Check:
      - Logo safe margin (>= 4% of width)
      - Text density (< 35% of total area)
      - Avoid overlapping elements
      - Product visibility
      - CTA must be readable
      - No banned words: "miracle", "guaranteed", "free*" (unless legal)

      Return JSON:
      {
        safeMarginsOk: boolean,
        textDensityOk: boolean,
        logoSizeOk: boolean,
        overlapsOk: boolean,
        issues: string[]
      }
    `;

    const result = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      compliance: JSON.parse(result.choices[0].message.content || "{}"),
    });
  } catch (error) {
    console.error("Compliance error:", error);
    return NextResponse.json(
      { error: "Compliance check failed" },
      { status: 500 }
    );
  }
}
