import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wand2, Palette, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BrandAnalyzer } from "@/components/BrandAnalyzer";
import { CreativeGenerator } from "@/components/CreativeGenerator";
import { CanvasEditor } from "@/components/CanvasEditor";
import { VariationsPanel } from "@/components/VariationsPanel";
import { supabase } from "@/integrations/supabase/client";

interface BrandAsset {
  id: string;
  url: string;
  asset_type: string;
  file_name?: string;
}

interface BrandAnalysis {
  primaryColors?: string[];
  secondaryColors?: string[];
  style?: string;
  suggestions?: string[];
}

const GeneratePage = () => {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [brandAnalysis, setBrandAnalysis] = useState<BrandAnalysis | null>(null);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      const { data } = await supabase
        .from("brand_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        const assetsWithUrls = data.map((asset) => {
          const { data: urlData } = supabase.storage
            .from("brand-assets")
            .getPublicUrl(asset.file_path);
          return {
            id: asset.id,
            url: urlData.publicUrl,
            asset_type: asset.asset_type,
            file_name: asset.file_name,
          };
        });
        setAssets(assetsWithUrls);
      }
    };
    fetchAssets();
  }, []);

  return (
    <DashboardLayout title="Generate Creative" subtitle="AI-powered creative generation">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full xl:w-80 space-y-6"
          >
            {/* Brand Analysis */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                Brand Analysis
              </h3>
              <BrandAnalyzer
                assets={assets}
                onAnalysisComplete={(analysis) => setBrandAnalysis(analysis)}
              />
            </div>

            {/* Creative Generator */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary" />
                AI Creative Studio
              </h3>
              <CreativeGenerator
                brandAnalysis={brandAnalysis}
                selectedFormat={{ name: "Instagram Story", size: "1080×1920" }}
                assets={assets}
                onPreviewUpdate={(imageUrl) => setGeneratedPreview(imageUrl)}
              />
            </div>

            {/* Variations Panel */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <VariationsPanel
                brandAnalysis={brandAnalysis}
                format={{ name: "Instagram Story", size: "1080×1920" }}
                productImageUrl={undefined}
                onSelectVariation={(imageUrl) => setGeneratedPreview(imageUrl)}
                selectedVariation={generatedPreview}
              />
            </div>
          </motion.div>

          {/* Center - Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex items-start justify-center"
          >
            <CanvasEditor
              backgroundImage={generatedPreview}
              assets={assets}
              width={320}
              height={568}
            />
          </motion.div>

          {/* Right Panel - Assets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full xl:w-64 space-y-4"
          >
            <div className="p-4 rounded-2xl border border-border bg-card">
              <h4 className="font-medium text-sm mb-3">Available Assets</h4>
              {assets.length > 0 ? (
                <div className="grid grid-cols-3 xl:grid-cols-2 gap-2">
                  {assets.slice(0, 6).map((asset) => (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("assetUrl", asset.url);
                      }}
                      className="aspect-square rounded-lg overflow-hidden border border-border cursor-grab active:cursor-grabbing hover:border-primary transition-colors"
                    >
                      <img
                        src={asset.url}
                        alt={asset.file_name}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No assets uploaded yet.{" "}
                  <Link to="/dashboard/upload" className="text-primary hover:underline">
                    Upload some
                  </Link>
                </p>
              )}
              {assets.length > 6 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  +{assets.length - 6} more assets
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <h4 className="font-medium text-sm mb-2">🎨 Editing Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Drag assets onto the canvas</li>
                <li>• Click to select and resize</li>
                <li>• Use toolbar to zoom and export</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex justify-between"
        >
          <Link to="/dashboard/upload">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Upload
            </Button>
          </Link>
          <Link to="/dashboard/layouts">
            <Button variant="hero" size="lg">
              Continue to Layouts
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default GeneratePage;
