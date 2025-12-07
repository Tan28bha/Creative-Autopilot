"use client";

import { useState } from "react";
import Image from "next/image";

import { useStudioStore } from "@/store/useStudioStore";
import type { BrandProfile } from "@/lib/types";

import { generateBaseOfferLayout } from "@/lib/layoutTemplates";
import { CreativeCanvas } from "@/components/CreativeCanvas";
import { CompliancePanel } from "@/components/CompliancePanel";
import { MultiFormatStep } from "@/components/MultiFormatStep";

import { RightSidebar } from "@/components/RightSidebar"; // ✅ Correct import

const tones = ["modern", "playful", "premium", "minimal"] as const;

export default function StudioPage() {
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

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const {
    layouts,
    setLayouts,
    selectedLayoutId,
    setSelectedLayoutId,
    updateLayout,
  } = useStudioStore();

  const selectedLayout = layouts.find((l) => l.id === selectedLayoutId);

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

  function handleCreateBrandProfile() {
    if (!name || !logoPreview) {
      alert("Please enter brand name and upload a logo.");
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

  function handleGenerateLayout() {
    if (!brandProfile) {
      alert("Please complete brand setup first.");
      return;
    }

    const layout = generateBaseOfferLayout(brandProfile);

    setLayouts([layout]);
    setSelectedLayoutId(layout.id);

    // remain on Step 2
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col gap-6">
      {/* ⭐ RIGHT SIDEBAR (AI Background, Tools, etc.) */}
      <RightSidebar />

      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Creative Autopilot Studio</h1>
        <p className="text-sm text-slate-400">Step {step} of 4</p>
      </header>

      {/* STEP 1 — BRAND SETUP */}
      {step === 1 && (
        <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">1. Brand Setup</h2>

            <div>
              <label className="block text-sm mb-1 text-slate-300">
                Brand Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                placeholder="Example: FreshBrew Coffee"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-slate-300">
                Tagline (optional)
              </label>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                placeholder="Example: Brewed with love"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-slate-300">
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
                <label className="block text-sm mb-1 text-slate-300">
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

            <div>
              <p className="text-sm mb-1 text-slate-300">Tone</p>
              <div className="flex gap-2">
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

          {/* Upload Assets */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">
              Upload Assets
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* LOGO */}
              <div>
                <p className="text-xs text-slate-400 mb-1">Logo</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                />
                {logoPreview && (
                  <div className="mt-2 w-32 h-32 relative bg-slate-900 border border-slate-700 rounded-md">
                    <Image
                      src={logoPreview}
                      alt="logo"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
              </div>

              {/* PRODUCT IMAGE */}
              <div>
                <p className="text-xs text-slate-400 mb-1">Product (optional)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "product")}
                />
                {productPreview && (
                  <div className="mt-2 w-32 h-32 relative bg-slate-900 border border-slate-700 rounded-md">
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

      {/* STEP 2 — DESIGNER AGENT */}
      {step === 2 && (
        <section className="space-y-4">
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

          {selectedLayout && (
            <div className="grid md:grid-cols-[2fr,1fr] gap-6">
              <CreativeCanvas
                layout={selectedLayout}
                onChange={(updated) =>
                  updateLayout(updated.id, () => updated)
                }
              />

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                <p className="font-semibold mb-1">Designer Agent</p>
                <p>
                  Drag, resize, and fine-tune elements to finalize your
                  creative composition.
                </p>

                <button
                  onClick={() => setStep(3)}
                  className="mt-4 px-4 py-2 w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm"
                >
                  Continue to Compliance
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* STEP 3 — COMPLIANCE AGENT */}
      {step === 3 && selectedLayout && (
        <section className="grid md:grid-cols-[2fr,1fr] gap-6">
          <div>
            <h2 className="text-xl font-semibold">3. Compliance Agent</h2>

            <CreativeCanvas
              layout={selectedLayout}
              onChange={(updated) =>
                updateLayout(updated.id, () => updated)
              }
            />
          </div>

          <CompliancePanel
            layout={selectedLayout}
            onAutoFix={(fixed) =>
              updateLayout(fixed.id, () => fixed)
            }
            onNext={() => setStep(4)}
          />
        </section>
      )}

      {/* STEP 4 — MULTI-FORMAT EXPORT */}
      {step === 4 && selectedLayout && <MultiFormatStep />}
    </main>
  );
}
