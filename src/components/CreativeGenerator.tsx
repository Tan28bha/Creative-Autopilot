import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wand2, 
  Loader2, 
  Download, 
  RefreshCw, 
  Image as ImageIcon,
  Layers,
  Pencil,
  Package,
  X,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BrandAnalysis {
  primaryColors?: string[];
  secondaryColors?: string[];
  style?: string;
}

interface BrandAsset {
  id: string;
  url: string;
  asset_type: string;
  file_name?: string;
}

interface GeneratedCreative {
  imageUrl: string;
  description: string;
  format: string;
  style: string;
}

interface CreativeGeneratorProps {
  brandAnalysis: BrandAnalysis | null;
  selectedFormat: { name: string; size: string };
  assets?: BrandAsset[];
  onPreviewUpdate?: (imageUrl: string | null) => void;
}

const styleOptions = [
  { id: "bold", label: "Bold & Vibrant" },
  { id: "minimal", label: "Minimal & Clean" },
  { id: "elegant", label: "Elegant & Premium" },
  { id: "playful", label: "Playful & Fun" },
];

type Mode = "generate" | "merge" | "edit";

export const CreativeGenerator = ({
  brandAnalysis,
  selectedFormat,
  assets = [],
  onPreviewUpdate,
}: CreativeGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("bold");
  const [generatedCreatives, setGeneratedCreatives] = useState<GeneratedCreative[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("generate");
  const [selectedProductImage, setSelectedProductImage] = useState<BrandAsset | null>(null);
  const [selectedCreativeToEdit, setSelectedCreativeToEdit] = useState<GeneratedCreative | null>(null);
  const [editInstruction, setEditInstruction] = useState("");

  const productAssets = assets.filter((a) => a.asset_type === "packshot" || a.asset_type === "other");

  const generateCreative = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const style = styleOptions.find((s) => s.id === selectedStyle)?.label || "Bold & Vibrant";

      const { data, error: fnError } = await supabase.functions.invoke("generate-creative", {
        body: {
          brandAnalysis,
          format: selectedFormat.name,
          style,
          productImageUrl: selectedProductImage?.url,
        },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      if (data.imageUrl) {
        const newCreative: GeneratedCreative = {
          imageUrl: data.imageUrl,
          description: data.description || "",
          format: selectedFormat.name,
          style,
        };
        setGeneratedCreatives((prev) => [newCreative, ...prev]);
        onPreviewUpdate?.(data.imageUrl);
        toast.success("Creative generated!");
      } else {
        throw new Error("No image was generated");
      }
    } catch (err) {
      console.error("Generation error:", err);
      const message = err instanceof Error ? err.message : "Failed to generate creative";
      setError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const mergeImages = async () => {
    if (!selectedProductImage) {
      toast.error("Please select a product image");
      return;
    }
    if (!selectedCreativeToEdit && generatedCreatives.length === 0) {
      toast.error("Please generate a creative first or select one to merge");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const creativeToMerge = selectedCreativeToEdit || generatedCreatives[0];

      const { data, error: fnError } = await supabase.functions.invoke("edit-creative", {
        body: {
          creativeImageUrl: creativeToMerge?.imageUrl,
          productImageUrl: selectedProductImage.url,
          editInstruction: editInstruction || "Seamlessly blend the product into the creative",
          brandAnalysis,
        },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      if (data.imageUrl) {
        const newCreative: GeneratedCreative = {
          imageUrl: data.imageUrl,
          description: data.description || "",
          format: selectedFormat.name,
          style: "Merged",
        };
        setGeneratedCreatives((prev) => [newCreative, ...prev]);
        onPreviewUpdate?.(data.imageUrl);
        toast.success("Images merged successfully!");
      } else {
        throw new Error("No image was generated");
      }
    } catch (err) {
      console.error("Merge error:", err);
      const message = err instanceof Error ? err.message : "Failed to merge images";
      setError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const editCreative = async () => {
    if (!selectedCreativeToEdit && generatedCreatives.length === 0) {
      toast.error("Please generate or select a creative to edit");
      return;
    }
    if (!editInstruction.trim()) {
      toast.error("Please enter edit instructions");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const creativeToEdit = selectedCreativeToEdit || generatedCreatives[0];

      const { data, error: fnError } = await supabase.functions.invoke("edit-creative", {
        body: {
          creativeImageUrl: creativeToEdit.imageUrl,
          editInstruction,
          brandAnalysis,
        },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      if (data.imageUrl) {
        const newCreative: GeneratedCreative = {
          imageUrl: data.imageUrl,
          description: data.description || "",
          format: selectedFormat.name,
          style: "Edited",
        };
        setGeneratedCreatives((prev) => [newCreative, ...prev]);
        onPreviewUpdate?.(data.imageUrl);
        toast.success("Creative edited!");
      } else {
        throw new Error("No image was generated");
      }
    } catch (err) {
      console.error("Edit error:", err);
      const message = err instanceof Error ? err.message : "Failed to edit creative";
      setError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCreative = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `creative-${selectedFormat.name.toLowerCase().replace(/\s/g, "-")}-${index + 1}.png`;
    link.click();
    toast.success("Download started");
  };

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-lg">
        <button
          onClick={() => setMode("generate")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-all ${
            mode === "generate"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          Generate
        </button>
        <button
          onClick={() => setMode("merge")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-all ${
            mode === "merge"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Merge
        </button>
        <button
          onClick={() => setMode("edit")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-all ${
            mode === "edit"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>

      {/* Generate Mode */}
      {mode === "generate" && (
        <>
          <div>
            <h4 className="text-sm font-medium mb-2">Creative Style</h4>
            <div className="grid grid-cols-2 gap-2">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-2 rounded-lg border text-xs transition-all ${
                    selectedStyle === style.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Product Selection */}
          {productAssets.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Package className="w-3.5 h-3.5" />
                Include Product (Optional)
              </h4>
              <div className="flex gap-2 flex-wrap">
                {productAssets.slice(0, 4).map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() =>
                      setSelectedProductImage(
                        selectedProductImage?.id === asset.id ? null : asset
                      )
                    }
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedProductImage?.id === asset.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={asset.url}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                    {selectedProductImage?.id === asset.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={generateCreative}
            disabled={isGenerating}
            className="w-full"
            variant="hero"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Creative
              </>
            )}
          </Button>
        </>
      )}

      {/* Merge Mode */}
      {mode === "merge" && (
        <>
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />
              Select Product Image
            </h4>
            {productAssets.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {productAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedProductImage(asset)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedProductImage?.id === asset.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={asset.url}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                    {selectedProductImage?.id === asset.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Upload packshot images to merge
              </p>
            )}
          </div>

          {generatedCreatives.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" />
                Select Creative to Merge Into
              </h4>
              <div className="flex gap-2 flex-wrap">
                {generatedCreatives.slice(0, 4).map((creative, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCreativeToEdit(creative)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedCreativeToEdit?.imageUrl === creative.imageUrl
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={creative.imageUrl}
                      alt="Creative"
                      className="w-full h-full object-cover"
                    />
                    {selectedCreativeToEdit?.imageUrl === creative.imageUrl && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium mb-2">Merge Instructions (Optional)</h4>
            <textarea
              value={editInstruction}
              onChange={(e) => setEditInstruction(e.target.value)}
              placeholder="E.g., Place product in center, add subtle shadow..."
              className="w-full p-2 rounded-lg border border-border bg-background text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button
            onClick={mergeImages}
            disabled={isGenerating || !selectedProductImage}
            className="w-full"
            variant="hero"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Merging...
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 mr-2" />
                Merge Images
              </>
            )}
          </Button>
        </>
      )}

      {/* Edit Mode */}
      {mode === "edit" && (
        <>
          {generatedCreatives.length > 0 ? (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" />
                Select Creative to Edit
              </h4>
              <div className="flex gap-2 flex-wrap">
                {generatedCreatives.slice(0, 6).map((creative, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCreativeToEdit(creative)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedCreativeToEdit?.imageUrl === creative.imageUrl
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={creative.imageUrl}
                      alt="Creative"
                      className="w-full h-full object-cover"
                    />
                    {selectedCreativeToEdit?.imageUrl === creative.imageUrl && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              Generate a creative first to edit it
            </p>
          )}

          <div>
            <h4 className="text-sm font-medium mb-2">Edit Instructions</h4>
            <textarea
              value={editInstruction}
              onChange={(e) => setEditInstruction(e.target.value)}
              placeholder="E.g., Make the background more vibrant, add text 'SALE', remove the shadow..."
              className="w-full p-2 rounded-lg border border-border bg-background text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button
            onClick={editCreative}
            disabled={isGenerating || generatedCreatives.length === 0 || !editInstruction.trim()}
            className="w-full"
            variant="hero"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Editing...
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Apply Edits
              </>
            )}
          </Button>
        </>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Format: {selectedFormat.name} ({selectedFormat.size})
      </p>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-destructive/10 border border-destructive/30"
        >
          <p className="text-sm text-destructive">{error}</p>
        </motion.div>
      )}

      {/* Generated Creatives */}
      <AnimatePresence>
        {generatedCreatives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Generated ({generatedCreatives.length})
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {generatedCreatives.map((creative, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group rounded-xl overflow-hidden border border-border"
                >
                  <img
                    src={creative.imageUrl}
                    alt={`Generated ${creative.format}`}
                    className="w-full aspect-video object-cover cursor-pointer"
                    onClick={() => onPreviewUpdate?.(creative.imageUrl)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <div>
                      <p className="text-xs font-medium">{creative.format}</p>
                      <p className="text-xs text-muted-foreground">{creative.style}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCreativeToEdit(creative);
                          setMode("edit");
                        }}
                        className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                        title="Edit this creative"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadCreative(creative.imageUrl, index)}
                        className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-primary-foreground" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
