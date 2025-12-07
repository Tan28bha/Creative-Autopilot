// src/components/CreativeCanvas.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import type { CreativeLayout, CreativeElement } from "@/lib/types";

type Props = {
  layout: CreativeLayout;
  onChange: (updated: CreativeLayout) => void;
};

export function CreativeCanvas({ layout, onChange }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseDown(e: React.MouseEvent, el: CreativeElement) {
    setDraggingId(el.id);
    setOffset({
      x: e.clientX - (el.x ?? 0),
      y: e.clientY - (el.y ?? 0),
    });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!draggingId) return;

    const updatedElements = layout.elements.map((el) => {
      if (el.id !== draggingId) return el;

      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      return {
        ...el,
        x: isNaN(newX) ? 0 : Math.max(0, newX),
        y: isNaN(newY) ? 0 : Math.max(0, newY),
      };
    });

    onChange({ ...layout, elements: updatedElements });
  }

  function handleMouseUp() {
    setDraggingId(null);
  }

  const radius = layout.borderRadius ?? 16;
  const shadowStrength = layout.shadow ?? 20;
  const shadowOpacity = Math.min(0.5, 0.15 + shadowStrength / 80);

  return (
    <div
      className="relative border border-slate-700 overflow-hidden shadow-xl"
      style={{
        width: layout.width,
        height: layout.height,
        backgroundColor: layout.backgroundUrl ? "transparent" : layout.brandPrimary,
        borderRadius: radius,
        boxShadow: `0 18px 40px rgba(0,0,0,${shadowOpacity})`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Background layer */}
      {layout.backgroundUrl && (
        <Image
          src={layout.backgroundUrl}
          alt="Background"
          fill
          className="object-cover"
        />
      )}

      {/* Elements layer */}
      {layout.elements.map((el) => (
        <div
          key={el.id}
          className="absolute cursor-grab active:cursor-grabbing select-none"
          onMouseDown={(e) => handleMouseDown(e, el)}
          style={{
            top: isNaN(el.y) ? 0 : el.y,
            left: isNaN(el.x) ? 0 : el.x,
            width: el.width || 120,
            height: el.height || 120,
          }}
        >
          {/* Image-ish elements */}
          {(el.type === "logo" ||
            el.type === "product" ||
            el.type === "image") &&
          el.imageUrl ? (
            <Image
              src={el.imageUrl}
              alt={el.type}
              width={el.width || 120}
              height={el.height || 120}
              className="object-contain pointer-events-none"
            />
          ) : null}

          {/* Text-ish elements */}
          {["text", "offer", "cta"].includes(el.type) && (
            <p
              style={{
                fontSize: el.fontSize ?? layout.baseFontSize ?? 32,
                color: el.color ?? "#ffffff",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {el.text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
