import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { layout, target } = await req.json();

    const aspectPresets = {
      story: { width: 1080, height: 1920 },
      landscape: { width: 1920, height: 1080 },
      square: { width: 1080, height: 1080 },
    };

    const fmt = aspectPresets[target];

    const scaleX = fmt.width / layout.width;
    const scaleY = fmt.height / layout.height;

    const newElements = layout.elements.map((el: any) => ({
      ...el,
      x: Math.round(el.x * scaleX),
      y: Math.round(el.y * scaleY),
      width: Math.round(el.width * scaleX),
      height: Math.round(el.height * scaleY),
    }));

    const newLayout = {
      ...layout,
      width: fmt.width,
      height: fmt.height,
      name: `${layout.name}-${target}`,
      elements: newElements,
    };

    return NextResponse.json({ layout: newLayout });
  } catch (error) {
    console.error("Adapt layout error:", error);
    return NextResponse.json(
      { error: "Failed to adapt layout" },
      { status: 500 }
    );
  }
}
