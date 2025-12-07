// src/components/panels/BrandingPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { useStudioStore } from "@/store/useStudioStore";

export function BrandingPanel() {
  const { brandProfile, setBrandProfile, layouts, setLayouts } = useStudioStore();

  const [primary, setPrimary] = useState(brandProfile?.primaryColor ?? "#7c3aed");
  const [secondary, setSecondary] = useState(brandProfile?.secondaryColor ?? "#ec4899");
  const [tagline, setTagline] = useState(brandProfile?.tagline ?? "");
  const [font, setFont] = useState(brandProfile?.fontFamily ?? "Inter");

  useEffect(() => {
    if (!brandProfile) return;
    setPrimary(brandProfile.primaryColor);
    setSecondary(brandProfile.secondaryColor);
    setTagline(brandProfile.tagline ?? "");
    setFont(brandProfile.fontFamily);
  }, [brandProfile]);

  const fonts = ["Inter", "Roboto", "Poppins", "Playfair Display"];

  function save() {
    if (!brandProfile) return;

    const updatedBrand = {
      ...brandProfile,
      primaryColor: primary,
      secondaryColor: secondary,
      tagline,
      fontFamily: font,
    };

    setBrandProfile(updatedBrand);

    // also push new colors into all layouts so you SEE the change
    setLayouts(
      layouts.map((l) => ({
        ...l,
        brandPrimary: primary,
        brandSecondary: secondary,
      }))
    );
  }

  return (
    <div className="space-y-3 text-xs text-slate-300">
      <p className="font-semibold text-sm">Branding</p>

      <div className="space-y-1">
        <p className="text-slate-400 text-[11px]">Primary Color</p>
        <input
          type="color"
          value={primary}
          onChange={(e) => setPrimary(e.target.value)}
          className="w-full h-9 bg-slate-900 border border-slate-700 rounded-md"
        />
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-[11px]">Secondary Color</p>
        <input
          type="color"
          value={secondary}
          onChange={(e) => setSecondary(e.target.value)}
          className="w-full h-9 bg-slate-900 border border-slate-700 rounded-md"
        />
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-[11px]">Tagline</p>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1"
          placeholder="Example: Brewed with love"
        />
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-[11px]">Font</p>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1"
        >
          {fonts.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={save}
        className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-medium"
      >
        Save Branding & Update Creatives
      </button>
    </div>
  );
}
