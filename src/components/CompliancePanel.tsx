// src/components/CompliancePanel.tsx
"use client";

import type { CreativeLayout } from "@/lib/types";
import { runCompliance, autoFixLayout } from "@/lib/compliance";
import { useState } from "react";

type Props = {
  layout: CreativeLayout;
  onAutoFix: (layout: CreativeLayout) => void;
  onNext: () => void;
};

type AiComplianceResult = {
  score: number;
  issues: string[];
  fixes?: { id: string; x: number; y: number; width: number; height: number }[];
};

export function CompliancePanel({ layout, onAutoFix, onNext }: Props) {
  const result = runCompliance(layout);

  const [aiResult, setAiResult] = useState<AiComplianceResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  async function handleAiCheck() {
    setAiLoading(true);
    setAiError("");
    setAiResult(null);

    try {
      const res = await fetch("/api/ai-compliance", {
        method: "POST",
        body: JSON.stringify({ layout }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || "AI compliance failed");
        return;
      }

      setAiResult(data);
    } catch (e: any) {
      console.error(e);
      setAiError("Could not reach local Llama server.");
    } finally {
      setAiLoading(false);
    }
  }

  function applyAiFixes() {
    if (!aiResult?.fixes || aiResult.fixes.length === 0) return;

    const patched: CreativeLayout = {
      ...layout,
      elements: layout.elements.map((el) => {
        const fix = aiResult.fixes!.find((f) => f.id === el.id);
        if (!fix) return el;
        return {
          ...el,
          x: fix.x ?? el.x,
          y: fix.y ?? el.y,
          width: fix.width ?? el.width,
          height: fix.height ?? el.height,
        };
      }),
    };

    onAutoFix(patched);
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 space-y-3">
      <div>
        <p className="font-semibold text-sm mb-1">Compliance Reasoning Agent</p>
        <p className="text-slate-400">
          Automatically checks retailer-style rules like safe zones, logo
          visibility and text density.
        </p>
      </div>

      {/* RULE-BASED CHECKS */}
      <ul className="space-y-2 text-sm">
        <li className="flex items-center justify-between">
          <span>Safe margins respected</span>
          <span className={result.safeMarginsOk ? "text-emerald-400" : "text-amber-400"}>
            {result.safeMarginsOk ? "✓ OK" : "⚠ Needs adjustment"}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span>Logo minimum size</span>
          <span className={result.logoSizeOk ? "text-emerald-400" : "text-amber-400"}>
            {result.logoSizeOk ? "✓ OK" : "⚠ Too small"}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span>Text coverage ≤ 35%</span>
          <span className={result.textDensityOk ? "text-emerald-400" : "text-amber-400"}>
            {result.textDensityOk
              ? `✓ ${(result.textCoverage * 100).toFixed(1)}%`
              : `⚠ ${(result.textCoverage * 100).toFixed(1)}%`}
          </span>
        </li>
      </ul>

      <button
        onClick={() => onAutoFix(autoFixLayout(layout))}
        className="w-full mt-2 px-3 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-xs font-medium"
      >
        Auto-Fix Violations (Rule-Based)
      </button>

      {/* AI COMPLIANCE SECTION */}
      <div className="mt-4 border-t border-slate-800 pt-3 space-y-2">
        <p className="font-semibold text-xs text-slate-300">AI Compliance (Llama)</p>
        <button
          onClick={handleAiCheck}
          disabled={aiLoading}
          className="w-full px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-xs font-medium"
        >
          {aiLoading ? "Running AI Check..." : "Run AI Compliance Check"}
        </button>

        {aiError && <p className="text-red-400 text-[11px]">{aiError}</p>}

        {aiResult && (
          <div className="mt-2 p-2 rounded-lg bg-slate-800 space-y-2">
            <p className="text-xs">
              AI Score:{" "}
              <span className="font-semibold text-emerald-400">
                {aiResult.score}/100
              </span>
            </p>

            {aiResult.issues?.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-200">
                {aiResult.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            )}

            {aiResult.fixes && aiResult.fixes.length > 0 && (
              <button
                onClick={applyAiFixes}
                className="w-full mt-2 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-[11px] font-medium"
              >
                Apply AI Fixes
              </button>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        className="w-full mt-2 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-medium"
      >
        Continue to Multi-Format
      </button>
    </div>
  );
}
