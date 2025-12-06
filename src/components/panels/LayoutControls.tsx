"use client";

export function LayoutControls() {
  return (
    <div className="text-slate-200 space-y-4">
      <h2 className="font-semibold text-sm">Layout Controls</h2>

      <div className="space-y-2 text-xs">
        <label className="block">Spacing</label>
        <input type="range" min={0} max={40} className="w-full" />
      </div>

      <div className="space-y-2 text-xs">
        <label className="block">Padding</label>
        <input type="range" min={0} max={40} className="w-full" />
      </div>

      <button className="w-full bg-slate-800 py-2 rounded text-xs hover:bg-slate-700">
        Auto-Balance Layout
      </button>
    </div>
  );
}
