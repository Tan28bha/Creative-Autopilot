"use client";

import { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";

export function BackgroundPanel() {
  const { layouts, selectedLayoutId, updateLayout } = useStudioStore();

  const selected = layouts.find((l) => l.id === selectedLayoutId);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (!selected) return null;

  async function generate() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setPreview(null);

    try {
      const res = await fetch("/api/generate-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          primaryColor: selected.brandPrimary,
          secondaryColor: selected.brandSecondary,
          tone: "modern",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.imageUrl) {
        setError("Failed to generate background.");
        return;
      }

      setPreview(data.imageUrl);
    } catch (e) {
      setError("Error generating image.");
    } finally {
      setLoading(false);
    }
  }

  function applyBackground() {
    if (!preview) return;

    updateLayout(selected.id, (l) => ({
      ...l,
      backgroundUrl: preview,
    }));
  }

  function removeBackground() {
    updateLayout(selected.id, (l) => ({
      ...l,
      backgroundUrl: undefined,
    }));
    setPreview(null);
  }

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4 text-xs text-slate-300">
      <p className="font-semibold text-sm">AI Background Generator</p>
      <p className="text-slate-400">
        Describe a background style and the AI will generate a usable creative backdrop.
      </p>

      <textarea
        className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-xs text-slate-200 resize-none"
        placeholder="e.g. neon gradient, premium gold shimmer, minimal pastel waves"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
      />

      <button
        onClick={generate}
        disabled={loading}
        className="w-full px-3 py-2 bg-violet-500 hover:bg-violet-600 rounded-lg text-white text-xs font-medium disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Background"}
      </button>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {preview && (
        <div className="space-y-2">
          <p className="font-semibold">Preview</p>
          <img
            src={preview}
            alt="AI Preview"
            className="w-full h-auto rounded-md border border-slate-700"
          />

          <button
            onClick={applyBackground}
            className="w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-medium text-white"
          >
            Apply to Creative
          </button>

          <button
            onClick={removeBackground}
            className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-xs font-medium text-white"
          >
            Remove Background
          </button>
        </div>
      )}
    </div>
  );
}
