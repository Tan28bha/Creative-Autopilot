// src/components/panels/AIBackgroundPanel.tsx
"use client";

import { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";

export function AIBackgroundPanel() {
  const { layouts, selectedLayoutId, updateLayout } = useStudioStore();
  const layout = layouts.find((l) => l.id === selectedLayoutId);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (!layout) {
    return (
      <p className="text-slate-400 text-xs">
        No layout selected. Generate a layout first.
      </p>
    );
  }

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
          width: layout.width,
          height: layout.height,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        setError(data.error || "Background generation failed");
        return;
      }

      setPreview(data.imageUrl);
    } catch (e: any) {
      console.error(e);
      setError("Request failed. Is Stable Diffusion running?");
    } finally {
      setLoading(false);
    }
  }

  function applyBackground() {
    if (!preview) return;
    updateLayout(layout.id, (prev) => ({
      ...prev,
      backgroundUrl: preview,
    }));
  }

  function clearBackground() {
    updateLayout(layout.id, (prev) => ({
      ...prev,
      backgroundUrl: undefined,
    }));
    setPreview(null);
  }

  return (
    <div className="space-y-3 text-xs text-slate-300">
      <p className="font-semibold text-sm">AI Background Generator</p>
      <p className="text-slate-400">
        Uses your local Stable Diffusion server. Make sure it&apos;s running.
      </p>

      <textarea
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. soft gradient with neon purple edges, minimal, clean"
        className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-xs"
      />

      <button
        onClick={generate}
        disabled={loading}
        className="w-full py-2 rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-xs font-medium"
      >
        {loading ? "Generating..." : "Generate Background"}
      </button>

      {error && <p className="text-red-400">{error}</p>}

      {preview && (
        <div className="space-y-2">
          <p className="font-semibold">Preview</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="AI preview"
            className="w-full rounded-md border border-slate-700"
          />

          <button
            onClick={applyBackground}
            className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-medium"
          >
            Apply to Canvas
          </button>

          <button
            onClick={clearBackground}
            className="w-full py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-medium"
          >
            Clear Background
          </button>
        </div>
      )}
    </div>
  );
}
