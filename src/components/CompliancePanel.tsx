"use client";

import type { CreativeLayout } from "@/lib/types";
import { runCompliance, autoFixLayout } from "@/lib/compliance";

type Props = {
  layout: CreativeLayout;
  onAutoFix: (layout: CreativeLayout) => void;
  onNext: () => void;
};

export function CompliancePanel({ layout, onAutoFix, onNext }: Props) {
  const result = runCompliance(layout);

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 space-y-3">
      <div>
        <p className="font-semibold text-sm mb-1">Compliance Reasoning Agent</p>
        <p className="text-slate-400">
          Automatically checks retailer-style rules like safe zones, logo visibility and text density.
        </p>
      </div>

      <ul className="space-y-2 text-sm">
        <li className="flex items-center justify-between">
          <span>Safe margins respected</span>
          <span className={result.safeMarginsOk ? "text-emerald-400" : "text-amber-400"}>
            {result.safeMarginsOk ? "✓ OK" : "⚠ Adjusted"}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span>Logo minimum size</span>
          <span className={result.logoSizeOk ? "text-emerald-400" : "text-amber-400"}>
            {result.logoSizeOk ? "✓ OK" : "⚠ Too small"}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span>Text coverage &lt;= 35%</span>
          <span className={result.textDensityOk ? "text-emerald-400" : "text-amber-400"}>
            {result.textDensityOk ? "✓ OK" : `⚠ ${(result.textCoverage * 100).toFixed(1)}%`}
          </span>
        </li>
      </ul>

      <button
        onClick={() => onAutoFix(autoFixLayout(layout))}
        className="w-full mt-2 px-3 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-xs font-medium"
      >
        Auto-Fix Violations
      </button>

      <button
        onClick={onNext}
        className="w-full mt-2 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-medium"
      >
        Continue to Multi-Format
      </button>
    </div>
  );
}
