"use client";

import { useState } from "react";
import Image from "next/image";

import { useStudioStore } from "@/store/useStudioStore";
import type { BrandProfile } from "@/lib/types";
import { generateBaseOfferLayout } from "@/lib/layoutTemplates";

import { CreativeCanvas } from "@/components/CreativeCanvas";
import { CompliancePanel } from "@/components/CompliancePanel";
import { MultiFormatStep } from "@/components/MultiFormatStep";

import { RightSidebar, RightSidebarTabs } from "@/components/RightSidebar";

const tones = ["modern", "playful", "premium", "minimal"] as const;

export default function StudioPage() {
  // sidebar panel state
  const [panel, setPanel] = useState("background");

  // brand setup
  const { brandProfile, setBrandProfile } = useStudioStore();
  const [name, setName] = useState(brandProfile?.name ?? "");
  const [tagline, setTagline] = useState(brandProfile?.tagline ?? "");
  const [primaryColor, setPrimaryColor] = useState(
    brandProfile?.primaryColor ?? "#7c3aed"
  );
  const [secondaryColor, setSecondaryColor] = useState(
    brandProfile?.secondaryColor ?? "#ec4899"
  );
  const [tone, setTone] = useState<BrandProfile["tone"]>(
    brandProfile?.tone ?? "modern"
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    brandProfile?.logoUrl ?? null
  );
  const [productPreview, setProductPreview] = useState<string | null>(
    brandProfile?.productUrl ?? null
  );

  // steps
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const {
    layouts,
    setLayouts,
    selectedLayoutId,
    setSelectedLayoutId,
    updateLayout,
  } = useStudioStore();

  const selectedLayout = layouts.find((l) => l.id === selectedLayoutId);

  // file upload
  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "product"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (type === "logo") setLogoPreview(url);
    else setProductPreview(url);
  }

  // brand profile creation
  function handleCreateBrandProfile() {
    if (!name || !logoPreview) {
      alert("Brand name + logo required.");
      return;
    }

    const bp: BrandProfile = {
      name,
      tagline,
      primaryColor,
      secondaryColor,
      fontFamily: tone === "premium" ? "Playfair Display" : "Inter",
      tone,
      logoUrl: logoPreview,
      productUrl: productPreview ?? undefined,
    };

    setBrandProfile(bp);
    setStep(2);
  }

  // layout generation
  function handleGenerateLayout() {
    if (!brandProfile) return;

    const layout = generateBaseOfferLayout(brandProfile);
    setLayouts([layout]);
    setSelectedLayoutId(layout.id);
  }

  // PAGE
  return (
    <main className="flex min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* LEFT TOOL TABS */}
      <RightSidebarTabs selectedPanel={panel} setPanel={setPanel} />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Creative Autopilot Studio</h1>
          <p className="text-sm text-slate-400">Step {step} of 4</p>
        </header>

        {/* -------------------------------------------- */}
        {/* STEP 1 - BRAND SETUP */}
        {/* -------------------------------------------- */}
        {step === 1 && (
          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Brand Setup</h2>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Brand Name
                </label>
                <input
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="FreshBrew Coffee"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Tagline
                </label>
                <input
                  className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Brewed with love"
                />
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-700 bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-700 bg-slate-900"
                  />
                </div>
              </div>

              {/* Tone */}
              <div>
                <p className="text-sm text-slate-300 mb-1">Tone</p>
                <div className="flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-1 rounded-full text-xs capitalize border ${
                        tone === t
                          ? "border-violet-400 bg-violet-500/20"
                          : "border-slate-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateBrandProfile}
                className="mt-4 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-sm font-medium"
              >
                Continue to Layout
              </button>
            </div>

            {/* Upload */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">
                Upload Assets
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Logo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "logo")}
                  />
                  {logoPreview && (
                    <div className="mt-2 w-32 h-32 relative bg-slate-900 rounded-md border border-slate-700">
                      <Image
                        src={logoPreview}
                        alt="logo"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Product</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "product")}
                  />
                  {productPreview && (
                    <div className="mt-2 w-32 h-32 relative bg-slate-900 rounded-md border border-slate-700">
                      <Image
                        src={productPreview}
                        alt="product"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* -------------------------------------------- */}
        {/* STEP 2 - DESIGNER AGENT */}
        {/* -------------------------------------------- */}
        {step === 2 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                2. Designer Agent – Layout
              </h2>

              <button
                onClick={handleGenerateLayout}
                className="px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-sm"
              >
                Generate Layout
              </button>
            </div>

            <div className="grid md:grid-cols-[2fr,1fr] gap-6">
              {/* Canvas */}
              {selectedLayout ? (
                <CreativeCanvas
                  layout={selectedLayout}
                  onChange={(updated) =>
                    updateLayout(updated.id, () => ({ ...updated }))
                  }
                />
              ) : (
                <div className="text-slate-400 text-sm p-6 border border-slate-800 rounded-xl">
                  Click “Generate Layout” to begin.
                </div>
              )}

              {/* RIGHT SIDEBAR IS NOT HERE — outside main content */}
              <div className="text-slate-400 text-xs">
                Use right sidebar tools →
              </div>
            </div>

            {selectedLayout && (
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-sm"
              >
                Continue to Compliance
              </button>
            )}
          </section>
        )}

        {/* -------------------------------------------- */}
        {/* STEP 3 - COMPLIANCE */}
        {/* -------------------------------------------- */}
        {step === 3 && selectedLayout && (
          <section className="grid md:grid-cols-[2fr,1fr] gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Compliance Agent</h2>

              <CreativeCanvas
                layout={selectedLayout}
                onChange={(updated) =>
                  updateLayout(updated.id, () => ({ ...updated }))
                }
              />
            </div>

            <CompliancePanel
              layout={selectedLayout}
              onAutoFix={(fixed) =>
                updateLayout(fixed.id, () => ({ ...fixed }))
              }
              onNext={() => setStep(4)}
            />
          </section>
        )}

        {/* -------------------------------------------- */}
        {/* STEP 4 - MULTI FORMAT */}
        {/* -------------------------------------------- */}
        {step === 4 && selectedLayout && <MultiFormatStep />}
      </div>

      {/* RIGHT SIDEBAR (TOOLS PANEL) */}
      <RightSidebar selectedPanel={panel} />
    </main>
  );
}
