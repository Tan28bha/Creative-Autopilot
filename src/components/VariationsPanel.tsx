import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BrandAnalysis {
  primaryColors?: string[];
  secondaryColors?: string[];
  style?: string;
}

interface Variation {
  id: string;
  imageUrl: string;
  style: string;
  label: string;
}

interface VariationsPanelProps {
  brandAnalysis: BrandAnalysis | null;
  format: { name: string; size: string };
  productImageUrl?: string;
  onSelectVariation: (imageUrl: string) => void;
  selectedVariation?: string | null;
}

const variationStyles = [
  { id: "v1", label: "V1", style: "Bold & Vibrant with strong contrast and dynamic elements" },
  { id: "v2", label: "V2", style: "Minimal & Clean with lots of white space and subtle elegance" },
  { id: "v3", label: "V3", style: "Elegant & Premium with luxury feel and sophisticated typography" },
  { id: "v4", label: "V4", style: "Playful & Fun with bright colors and energetic composition" },
  { id: "v5", label: "V5", style: "Modern & Edgy with geometric shapes and bold gradients" },
];

export const VariationsPanel = ({
  brandAnalysis,
  format,
  productImageUrl,
  onSelectVariation,
  selectedVariation,
}: VariationsPanelProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);

  const generateAllVariations = async () => {
    setIsGenerating(true);
    setVariations([]);

    try {
      // Generate all 5 variations sequentially to avoid rate limits
      const newVariations: Variation[] = [];

      for (let i = 0; i < variationStyles.length; i++) {
        setGeneratingIndex(i);
        const styleConfig = variationStyles[i];

        try {
          const { data, error: fnError } = await supabase.functions.invoke("generate-creative", {
            body: {
              brandAnalysis,
              format: format.name,
              style: styleConfig.style,
              productImageUrl,
            },
          });

          if (fnError) throw fnError;
          if (data.error) throw new Error(data.error);

          if (data.imageUrl) {
            const variation: Variation = {
              id: styleConfig.id,
              imageUrl: data.imageUrl,
              style: styleConfig.style,
              label: styleConfig.label,
            };
            newVariations.push(variation);
            setVariations([...newVariations]);
          }
        } catch (err) {
          console.error(`Error generating ${styleConfig.label}:`, err);
          // Continue with other variations even if one fails
        }
      }

      if (newVariations.length > 0) {
        toast.success(`Generated ${newVariations.length} variations!`);
        onSelectVariation(newVariations[0].imageUrl);
      } else {
        toast.error("Failed to generate variations");
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast.error("Failed to generate variations");
    } finally {
      setIsGenerating(false);
      setGeneratingIndex(null);
    }
  };

  const regenerateVariation = async (index: number) => {
    const styleConfig = variationStyles[index];
    setGeneratingIndex(index);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-creative", {
        body: {
          brandAnalysis,
          format: format.name,
          style: styleConfig.style,
          productImageUrl,
        },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      if (data.imageUrl) {
        const newVariation: Variation = {
          id: styleConfig.id,
          imageUrl: data.imageUrl,
          style: styleConfig.style,
          label: styleConfig.label,
        };
        setVariations((prev) => {
          const updated = [...prev];
          const existingIndex = updated.findIndex((v) => v.id === styleConfig.id);
          if (existingIndex >= 0) {
            updated[existingIndex] = newVariation;
          } else {
            updated.push(newVariation);
          }
          return updated;
        });
        toast.success(`${styleConfig.label} regenerated!`);
      }
    } catch (err) {
      console.error("Regeneration error:", err);
      toast.error("Failed to regenerate variation");
    } finally {
      setGeneratingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Auto Variations
        </h4>
        <Button
          onClick={generateAllVariations}
          disabled={isGenerating}
          variant="outline"
          size="sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 mr-1.5" />
              Generate 5 Variations
            </>
          )}
        </Button>
      </div>

      {/* Variation Grid */}
      <div className="grid grid-cols-5 gap-2">
        {variationStyles.map((style, index) => {
          const variation = variations.find((v) => v.id === style.id);
          const isSelected = selectedVariation === variation?.imageUrl;
          const isCurrentlyGenerating = generatingIndex === index;

          return (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <button
                onClick={() => variation && onSelectVariation(variation.imageUrl)}
                disabled={!variation || isCurrentlyGenerating}
                className={`relative w-full aspect-[9/16] rounded-lg overflow-hidden border-2 transition-all ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30"
                    : variation
                    ? "border-border hover:border-primary/50"
                    : "border-dashed border-border/50 bg-secondary/30"
                }`}
              >
                {variation ? (
                  <>
                    <img
                      src={variation.imageUrl}
                      alt={style.label}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isCurrentlyGenerating ? (
                      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground">{style.label}</span>
                    )}
                  </div>
                )}
              </button>

              {/* Label & Regenerate */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {style.label}
                </span>
                {variation && !isGenerating && (
                  <button
                    onClick={() => regenerateVariation(index)}
                    disabled={isCurrentlyGenerating}
                    className="p-0.5 hover:bg-secondary rounded transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 text-muted-foreground ${isCurrentlyGenerating ? "animate-spin" : ""}`} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {variations.length === 0 && !isGenerating && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Generate 5 AI-powered variations with different styles
        </p>
      )}
    </div>
  );
};
