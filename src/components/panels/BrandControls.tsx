"use client";

import { useStudioStore } from "@/store/useStudioStore";

export function BrandControls() {
  const { brandProfile } = useStudioStore();

  if (!brandProfile)
    return <p className="text-slate-400 text-xs">No brand loaded.</p>;

  return (
    <div className="text-slate-200 space-y-4">
      <h2 className="font-semibold text-sm">Brand Settings</h2>

      <div className="text-xs space-y-2">
        <p>Name: {brandProfile.name}</p>
        <p>Primary: {brandProfile.primaryColor}</p>
        <p>Secondary: {brandProfile.secondaryColor}</p>
      </div>

      <button className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded text-xs">
        Manage Brand
      </button>
    </div>
  );
}
