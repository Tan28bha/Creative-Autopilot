import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { productName, brandName, tone, discount } = await req.json();

    const prompt = `
      Generate text copy for a retail advertisement.

      Brand: ${brandName}
      Product: ${productName}
      Tone: ${tone}
      Offer: ${discount ? discount : "None"}

      Write:
      - Primary headline (5-8 words)
      - Subheadline (max 12 words)
      - Call to action (CTA)
      
      Use clean, high-conversion marketing language.
    `;

    const result = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      copy: result.choices[0].message.content,
    });
  } catch (error) {
    console.error("Copy API error:", error);
    return NextResponse.json(
      { error: "Failed to generate copy" },
      { status: 500 }
    );
  }
}
