// src/app/api/generate-background/route.ts
import { NextResponse } from "next/server";

const SD_URL =
  process.env.STABLE_DIFFUSION_URL ||
  "http://127.0.0.1:7860/sdapi/v1/txt2img";

export async function POST(req: Request) {
  try {
    const { prompt, width = 800, height = 1000 } = await req.json();

    const body = {
      prompt,
      steps: 20,
      cfg_scale: 7,
      width,
      height,
      sampler_name: "Euler a",
    };

    const res = await fetch(SD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("SD error status:", res.status, await res.text());
      return NextResponse.json(
        { error: "Stable Diffusion request failed" },
        { status: 500 }
      );
    }

    const json: any = await res.json();
    if (!json.images || !json.images[0]) {
      return NextResponse.json(
        { error: "No image returned from SD" },
        { status: 500 }
      );
    }

    const base64 = json.images[0] as string;
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({ imageUrl: dataUrl });
  } catch (err) {
    console.error("SD route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
