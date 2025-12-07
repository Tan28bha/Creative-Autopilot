// src/components/panels/DesignPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { useStudioStore } from "@/store/useStudioStore";

export function DesignPanel() {
  const { layouts, selectedLayoutId, updateLayout } = useStudioStore();
  const layout = layouts.find((l) => l.id === selectedLayoutId);

  const [width, setWidth] = useState(layout?.width ?? 800);
  const [height, setHeight] = useState(layout?.height ?? 1000);
  const [radius, setRadius] = useState(layout?.borderRadius ?? 16);
  const [shadow, setShadow] = useState(layout?.shadow ?? 20);
  const [baseFont, setBaseFont] = useState(layout?.baseFontSize ?? 32);

  useEffect(() => {
    if (!layout) return;
    setWidth(layout.width);
    setHeight(layout.height);
    setRadius(layout.borderRadius ?? 16);
    setShadow(layout.shadow ?? 20);
    setBaseFont(layout.baseFontSize ?? 32);
  }, [layout]);

  if (!layout) {
    return (
      <p className="text-slate-400 text-xs">
        No layout selected. Generate a layout first.
      </p>
    );
  }

  function apply() {
    updateLayout(layout.id, (prev) => ({
      ...prev,
      width,
      height,
      borderRadius: radius,
      shadow,
      baseFontSize: baseFont,
    }));
  }

  function applyPreset(preset: "minimal" | "promo" | "neon") {
    let cfg: Partial<typeof layout> = {};
    if (preset === "minimal") {
      cfg = { borderRadius: 0, shadow: 10, baseFontSize: 30 };
    } else if (preset === "promo") {
      cfg = { borderRadius: 20, shadow: 30, baseFontSize: 40 };
    } else if (preset === "neon") {
      cfg = { borderRadius: 8, shadow: 45, baseFontSize: 44 };
    }
    updateLayout(layout.id, (prev) => ({
      ...prev,
      ...cfg,
    }));
  }

  return (
    <div className="space-y-3 text-xs text-slate-300">
      <p className="font-semibold text-sm">Design Controls</p>

      <div className="space-y-1">
        <p className="text-slate-400 text-[11px]">Canvas Size (px)</p>
        <div className="flex gap-2">
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-1/2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1"
          />
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-1/2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1"
          />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-[11px]">Border Radius</p>
        <input
          type="range"
          min={0}
          max={40}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full"
        />
        <p>{radius}px</p>
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-[11px]">Shadow Strength</p>
        <input
          type="range"
          min={0}
          max={60}
          value={shadow}
          onChange={(e) => setShadow(Number(e.target.value))}
          className="w-full"
        />
        <p>{shadow}</p>
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-[11px]">Base Font Size</p>
        <input
          type="range"
          min={20}
          max={64}
          value={baseFont}
          onChange={(e) => setBaseFont(Number(e.target.value))}
          className="w-full"
        />
        <p>{baseFont}px</p>
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-[11px]">Presets</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPreset("minimal")}
            className="px-3 py-1 rounded bg-slate-800 border border-slate-700"
          >
            Minimal
          </button>
          <button
            onClick={() => applyPreset("promo")}
            className="px-3 py-1 rounded bg-slate-800 border border-slate-700"
          >
            Promo
          </button>
          <button
            onClick={() => applyPreset("neon")}
            className="px-3 py-1 rounded bg-slate-800 border border-slate-700"
          >
            Neon
          </button>
        </div>
      </div>

      <button
        onClick={apply}
        className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-medium"
      >
        Apply Design
      </button>
    </div>
  );
}
