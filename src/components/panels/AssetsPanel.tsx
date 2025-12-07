// src/components/panels/AssetsPanel.tsx
"use client";

import { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";

export function AssetsPanel() {
  const { layouts, selectedLayoutId, updateLayout } = useStudioStore();
  const layout = layouts.find((l) => l.id === selectedLayoutId);

  const [assets, setAssets] = useState<string[]>([]);

  if (!layout) {
    return (
      <p className="text-slate-400 text-xs">
        No layout selected. Generate a layout first.
      </p>
    );
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAssets((prev) => [...prev, url]);
  }

  function addToCanvas(asset: string) {
    updateLayout(layout.id, (prev) => ({
      ...prev,
      elements: [
        ...prev.elements,
        {
          id: `asset-${Date.now()}`,
          type: "image",
          imageUrl: asset,
          x: 100,
          y: 100,
          width: 280,
          height: 280,
        },
      ],
    }));
  }

  function deleteAsset(asset: string) {
    setAssets((prev) => prev.filter((a) => a !== asset));
  }

  return (
    <div className="space-y-3 text-xs text-slate-300">
      <p className="font-semibold text-sm">Assets</p>

      <div className="space-y-1">
        <p className="text-slate-400 text-[11px]">Upload Product Image</p>
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {assets.length === 0 && (
          <p className="text-slate-500 text-[11px]">
            No assets yet. Upload product or lifestyle images.
          </p>
        )}

        {assets.map((asset) => (
          <div
            key={asset}
            className="flex items-center gap-3 p-2 bg-slate-900 border border-slate-800 rounded-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset}
              className="w-12 h-12 object-contain rounded-md"
              alt="asset"
            />

            <div className="flex-1 flex flex-col gap-1">
              <button
                onClick={() => addToCanvas(asset)}
                className="w-full py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-[11px]"
              >
                Add to Canvas
              </button>
              <button
                onClick={() => deleteAsset(asset)}
                className="w-full py-1 rounded bg-red-500 hover:bg-red-600 text-[11px]"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
