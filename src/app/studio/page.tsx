"use client";

import { useState } from "react";

import { useStudioStore } from "@/store/useStudioStore";
import type { BrandProfile, CreativeLayout } from "@/lib/types";

import { generateBaseOfferLayout } from "@/lib/layoutTemplates";
import { CreativeCanvas } from "@/components/CreativeCanvas";
import { CompliancePanel } from "@/components/CompliancePanel";
import { MultiFormatStep } from "@/components/MultiFormatStep";
import { RightSidebar } from "@/components/RightSidebar";

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

  /* ---------------- AI LAYOUT (LLAMA) ---------------- */
  async function handleGenerateAiLayout() {
    if (!brandProfile) {
      alert("Complete brand setup first");
      return;
    }

    try {
      const res = await fetch("/api/ai-generate-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: brandProfile,
          product: brandProfile.productUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        alert("AI layout failed");
        return;
      }

      // 🔐 HARDEN ELEMENTS (prevent compliance crash)
      const safeElements =
        Array.isArray(data.elements) ?
          data.elements.map((el: any, i: number) => ({
            id: el.id || `el-${i}`,
            type: el.type || "text",
            content: el.content || "",
            rect: el.rect ?? {
              x: 100,
              y: 100 + i * 120,
              width: 600,
              height: 100,
            },
          })) : [];

      const layout: CreativeLayout = {
        id: data.id || "ai-layout",
        name: data.name || "AI Layout",
        width: data.width || 1080,
        height: data.height || 1350,
        brandPrimary: brandProfile.primaryColor,
        brandSecondary: brandProfile.secondaryColor,
        borderRadius: 24,
        shadow: 28,
        baseFontSize: 36,
        backgroundUrl: data.backgroundUrl,
        elements: safeElements,
      };

      setLayouts([layout]);
      setSelectedLayoutId(layout.id);
    } catch (err) {
      console.error(err);
      alert("Is Ollama running?");
    }
  }

  /* ---------------- BASIC LAYOUT ---------------- */
  function handleGenerateLayout() {
    if (!brandProfile) return;

    const layout = generateBaseOfferLayout(brandProfile);
    setLayouts([layout]);
    setSelectedLayoutId(layout.id);
  }

  /* ---------------- FILE UPLOAD ---------------- */
  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "product"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    type === "logo" ? setLogoPreview(url) : setProductPreview(url);
  }

  /* ---------------- BRAND SETUP ---------------- */
  function handleCreateBrandProfile() {
    if (!name || !logoPreview) {
      alert("Brand name and logo required");
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

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 space-y-6">
      <RightSidebar />

      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Creative Autopilot Studio</h1>
        <p className="text-sm text-slate-400">Step {step} of 4</p>
      </header>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">1. Brand Setup</h2>

            <input
              placeholder="Brand name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded"
            />

            <input
              placeholder="Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded"
            />

            <div className="flex gap-4">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
              <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
            </div>

            <div className="flex gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1 rounded border ${
                    tone === t ? "bg-violet-500/20 border-violet-400" : "border-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleCreateBrandProfile}
              className="px-4 py-2 bg-violet-500 rounded"
            >
              Continue
            </button>
          </div>

          <div className="space-y-4">
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "logo")} />
            {logoPreview && <img src={logoPreview} className="w-32 h-32 object-contain" />}

            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "product")} />
            {productPreview && <img src={productPreview} className="w-32 h-32 object-contain" />}
          </div>
        </section>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <section className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">2. Designer Agent</h2>
            <div className="flex gap-2">
              <button onClick={handleGenerateLayout} className="bg-violet-500 px-4 py-2 rounded">
                Basic Layout
              </button>
              <button onClick={handleGenerateAiLayout} className="bg-indigo-500 px-4 py-2 rounded">
                AI Layout (Llama)
              </button>
            </div>
          </div>

          {selectedLayout && (
            <div className="grid md:grid-cols-[2fr,1fr] gap-6">
              <CreativeCanvas
                layout={selectedLayout}
                onChange={(l) => updateLayout(l.id, () => l)}
              />
              <button
                onClick={() => setStep(3)}
                className="bg-emerald-500 px-4 py-2 rounded h-fit"
              >
                Continue to Compliance
              </button>
            </div>
          )}
        </section>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && selectedLayout && (
        <section className="grid md:grid-cols-[2fr,1fr] gap-6">
          <CreativeCanvas
            layout={selectedLayout}
            onChange={(l) => updateLayout(l.id, () => l)}
          />
          <CompliancePanel
            layout={selectedLayout}
            onAutoFix={(fixed) => updateLayout(fixed.id, () => fixed)}
            onNext={() => setStep(4)}
          />
        </section>
      )}

      {/* ================= STEP 4 ================= */}
      {step === 4 && <MultiFormatStep />}
    </main>
  );
}
