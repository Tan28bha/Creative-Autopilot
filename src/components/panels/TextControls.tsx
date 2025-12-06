"use client";

export function TextControls() {
  return (
    <div className="text-slate-200 space-y-4">
      <h2 className="font-semibold text-sm">Text Styling</h2>

      <div className="space-y-2 text-xs">
        <label className="block text-slate-400">Font Size</label>
        <input
          type="range"
          min={10}
          max={64}
          className="w-full"
        />
      </div>

      <div className="space-y-2 text-xs">
        <label className="block text-slate-400">Text Color</label>
        <input type="color" className="w-full h-8 rounded border border-slate-700" />
      </div>

      <div className="space-y-2 text-xs">
        <label className="block text-slate-400">Shadow</label>
        <select className="bg-slate-800 border border-slate-700 rounded p-2 w-full">
          <option>None</option>
          <option>Soft Shadow</option>
          <option>Hard Shadow</option>
          <option>Glow</option>
        </select>
      </div>
    </div>
  );
}
