"use client";

export function ComplianceSummary() {
  return (
    <div className="space-y-4 text-slate-200">
      <h2 className="font-semibold text-sm">Compliance Summary</h2>

      <ul className="text-xs space-y-2">
        <li>✓ Safe zones respected</li>
        <li>✓ Logo size adequate</li>
        <li>⚠ Text density slightly high</li>
      </ul>

      <button className="bg-amber-500 hover:bg-amber-600 w-full py-2 rounded text-xs">
        Auto-Fix Issues
      </button>
    </div>
  );
}
