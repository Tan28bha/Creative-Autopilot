"use client";

import { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { generateBackground } from "@/lib/aiBackground";

export function BackgroundControls({ fullPanel }: { fullPanel?: boolean }) {
  const { layouts, selectedLayoutId, updateLayout, brandProfile } =
    useStudioStore();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const layout = layouts.find((l) => l.id === selectedLayoutId);
  if (!layout || !brandProfile) {
    return (
      <div className="text-xs text-slate-400">
        Select a creative and set up your brand to use AI background.
      </div>
    );
  }

  function handleGenerate() {
    setLoading(true);
    const result = generateBackground({
      primaryColor: brandProfile.primaryColor,
      secondaryColor: brandProfile.secondaryColor,
      tone: brandProfile.tone,
      prompt,
    });

    updateLayout(layout.id, (prev) => ({
      ...prev,
      backgroundCss: result.css,
    }));

    setInfo(result.description);
    setLoading(false);
  }

  return (
    <div className="text-slate-200 space-y-4">
      <h2 className="font-semibold text-sm">AI Background Agent</h2>

      <p className="text-xs text-slate-400">
        Generates a brand-aware gradient background from your tone, colors and a short description.
      </p>

      <textarea
        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs"
        rows={3}
        placeholder="e.g. soft festive glow, minimal premium gradient, neon tech vibe..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded text-xs font-medium disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Generate Background"}
      </button>

      {info && (
        <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
          {info}
        </p>
      )}

      {!fullPanel && (
        <p className="text-[10px] text-slate-500">
          Open the full Background panel on the right for more controls.
        </p>
      )}
    </div>
  );
}
