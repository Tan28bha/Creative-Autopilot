// src/app/api/ai-compliance/route.ts
import { NextResponse } from "next/server";
import { localLlama, LOCAL_LLAMA_MODEL } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    const { layout } = await req.json();

    const prompt = `
You are a retail media creative compliance auditor.

You will receive a layout JSON with fields:
- width, height
- elements: [{ id, type, x, y, width, height, text?, imageUrl? }]

Check these rules:
1. Safe margins: 40px from each side
2. Logo size: width >= 80px if a logo exists
3. Text density: sum of text area (type in ["text","offer","cta"]) <= 35% of canvas
4. CTA: present and in bottom third of canvas
5. Product/image not overlapping CTA too much
6. Overall balance: not everything pushed to one side

Return JSON ONLY:
{
  "score": number,         // 0-100
  "issues": string[],      // human-readable issue list
  "fixes": [               // optional element adjustments
    {
      "id": string,
      "x": number,
      "y": number,
      "width": number,
      "height": number
    }
  ]
}

Layout:
${JSON.stringify(layout)}
`;

    const completion = await localLlama.chat.completions.create({
      model: LOCAL_LLAMA_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const jsonText = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(jsonText);

    return NextResponse.json(result);
  } catch (err) {
    console.error("AI Compliance Error:", err);
    return NextResponse.json(
      { error: "Failed to run AI compliance" },
      { status: 500 }
    );
  }
}
