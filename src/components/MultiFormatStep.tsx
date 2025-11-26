"use client";

import { useRef, useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { adaptToStory, adaptToLandscape } from "@/lib/adaptive";
import { CreativeCanvas } from "./CreativeCanvas";
import type { CreativeLayout } from "@/lib/types";
import html2canvas from "html2canvas";

export function MultiFormatStep() {
  const { layouts, setLayouts, selectedLayoutId, setSelectedLayoutId, updateLayout } =
    useStudioStore();
  const baseLayout = layouts[0];
  const [variantsGenerated, setVariantsGenerated] = useState(false);

  const containersRef = useRef<Record<string, HTMLDivElement | null>>({});

  function ensureVariants() {
    if (variantsGenerated) return;
    const story = adaptToStory(baseLayout);
    const landscape = adaptToLandscape(baseLayout);
    setLayouts([baseLayout, story, landscape]);
    setSelectedLayoutId(baseLayout.id);
    setVariantsGenerated(true);
  }

  async function handleExport(layout: CreativeLayout) {
    const container = containersRef.current[layout.id];
    if (!container) return;

    const canvas = await html2canvas(container, { backgroundColor: null, scale: 2 });
    let quality = 0.9;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);

    // shrink until under ~500KB
    while (dataUrl.length / 1024 > 500 && quality > 0.4) {
      quality -= 0.1;
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${layout.name || "creative"}.jpg`;
    a.click();
  }

  const allLayouts = layouts.length > 1 ? layouts : [baseLayout];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">4. Adaptive Layout Agent & Export</h2>
        <button
          onClick={ensureVariants}
          className="px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-sm"
        >
          Generate Story & Landscape
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {allLayouts.map((layout) => (
          <div
            key={layout.id}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2"
          >
            <p className="text-xs text-slate-300 font-semibold mb-1">{layout.name}</p>
            <div
              ref={(el) => {
                if (!containersRef.current) containersRef.current = {};
                containersRef.current[layout.id] = el;
              }}
            >
              <CreativeCanvas
                layout={layout}
                onChange={(updated) => updateLayout(updated.id, () => updated)}
              />
            </div>
            <button
              onClick={() => handleExport(layout)}
              className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs"
            >
              Export JPG (&lt;500KB)
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
