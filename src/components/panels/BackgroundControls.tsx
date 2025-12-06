"use client";

import { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";

export function BackgroundControls({ fullPanel }: { fullPanel?: boolean }) {
  const { layouts, selectedLayoutId, updateLayout, brandProfile } =
    useStudioStore();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const layout = layouts.find((l) => l.id === selectedLayoutId);
  if (!layout) return null;

  async function generateBackground() {
    if (!prompt) return alert("Enter a background prompt.");

    setLoading(true);

    const res = await fetch("/api/generate-background", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        brandName: brandProfile?.name,
        primaryColor: brandProfile?.primaryColor,
        secondaryColor: brandProfile?.secondaryColor,
        tone: brandProfile?.tone,
      }),
    });

    const data = await res.json();

    updateLayout(layout.id, () => ({
      ...layout,
      background: {
        type: "image",
        imageUrl: data.imageUrl,
      },
    }));

    setLoading(false);
  }

  return (
    <div className="text-slate-200 space-y-4">
      <h2 className="font-semibold text-sm">AI Background Generator</h2>

      <textarea
        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs"
        rows={4}
        placeholder="Describe your background: minimal purple gradient, festive, premium lighting..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={generateBackground}
        disabled={loading}
        className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded text-xs disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Background"}
      </button>

      {!fullPanel && (
        <p className="text-[10px] text-slate-400">
          Use right sidebar for full styling controls →
        </p>
      )}
    </div>
  );
}
