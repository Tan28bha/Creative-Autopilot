"use client";

import { Rnd } from "react-rnd";
import type { CreativeLayout, CreativeElement } from "@/lib/types";

type Props = {
  layout: CreativeLayout;
  onChange: (layout: CreativeLayout) => void;
};

export function CreativeCanvas({ layout, onChange }: Props) {
  const { width, height, background, elements } = layout;

  const handleElementChange = (id: string, updated: Partial<CreativeElement>) => {
    const next: CreativeLayout = {
      ...layout,
      elements: elements.map((el) => (el.id === id ? { ...el, ...updated } : el)),
    };
    onChange(next);
  };

  const containerRatio = width / height;

  return (
    <div className="w-full flex justify-center">
      <div className="relative border border-slate-700 rounded-xl overflow-hidden"
        style={{
          width: 400,
          height: 400 / containerRatio,
          background:
            background.type === "solid"
              ? background.color
              : background.gradient
              ? `linear-gradient(${
                  background.gradient.direction === "vertical" ? "180deg" : "90deg"
                }, ${background.gradient.from}, ${background.gradient.to})`
              : "#020617",
        }}
      >
        {elements.map((el) => {
          const left = el.rect.x * 100;
          const top = el.rect.y * 100;
          const w = el.rect.w * 100;
          const h = el.rect.h * 100;

          return (
            <Rnd
              key={el.id}
              size={{ width: `${w}%`, height: `${h}%` }}
              position={{ x: (left / 100) * 400, y: (top / 100) * (400 / containerRatio) }}
              bounds="parent"
              onDragStop={(_, d) => {
                const newX = d.x / 400;
                const newY = d.y / (400 / containerRatio);
                handleElementChange(el.id, {
                  rect: { ...el.rect, x: newX, y: newY },
                });
              }}
              onResizeStop={(_, __, ref, ___, pos) => {
                const newW = ref.offsetWidth / 400;
                const newH = ref.offsetHeight / (400 / containerRatio);
                const newX = pos.x / 400;
                const newY = pos.y / (400 / containerRatio);
                handleElementChange(el.id, {
                  rect: { x: newX, y: newY, w: newW, h: newH },
                });
              }}
              enableResizing={el.type !== "logo" ? true : true}
            >
              <div className="w-full h-full flex items-center justify-center">
                {el.imageUrl ? (
                  <img src={el.imageUrl} alt={el.type} className="w-full h-full object-contain" />
                ) : (
                  <span
                    className="text-xs text-white px-1 text-center"
                    style={{
                      fontSize: el.fontSize ?? 16,
                      fontWeight: el.fontWeight === "bold" ? 700 : 400,
                    }}
                  >
                    {el.text}
                  </span>
                )}
              </div>
            </Rnd>
          );
        })}
      </div>
    </div>
  );
}
