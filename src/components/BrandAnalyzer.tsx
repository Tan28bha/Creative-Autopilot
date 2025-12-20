import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Palette, Eye, Lightbulb, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BrandAnalysis {
  primaryColors?: string[];
  secondaryColors?: string[];
  style?: string;
  typography?: string;
  patterns?: string;
  personality?: string;
  suggestions?: string[];
  rawAnalysis?: string;
}

interface BrandAnalyzerProps {
  assets: Array<{ url: string; asset_type: string }>;
  onAnalysisComplete: (analysis: BrandAnalysis) => void;
}

export const BrandAnalyzer = ({ assets, onAnalysisComplete }: BrandAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<BrandAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeAssets = async () => {
    if (assets.length === 0) {
      toast.error("Please upload some brand assets first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const imageUrls = assets.map((a) => a.url);
      const assetTypes = assets.map((a) => a.asset_type);

      const { data, error: fnError } = await supabase.functions.invoke("analyze-brand", {
        body: { imageUrls, assetTypes },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      const analysisData = data.analysis;
      setAnalysis(analysisData);
      onAnalysisComplete(analysisData);
      toast.success("Brand analysis complete!");
    } catch (err) {
      console.error("Analysis error:", err);
      const message = err instanceof Error ? err.message : "Failed to analyze assets";
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={analyzeAssets}
        disabled={isAnalyzing || assets.length === 0}
        className="w-full"
        variant="hero"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Brand...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze Brand Assets
          </>
        )}
      </Button>

      {assets.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Upload assets to enable AI analysis
        </p>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Colors */}
            {(analysis.primaryColors || analysis.secondaryColors) && (
              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-primary" />
                  Brand Colors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[...(analysis.primaryColors || []), ...(analysis.secondaryColors || [])].map(
                    (color, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-2 py-1 rounded-lg bg-secondary"
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-mono">{color}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Style */}
            {analysis.style && (
              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-primary" />
                  Brand Style
                </h4>
                <p className="text-sm text-muted-foreground">{analysis.style}</p>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Creative Suggestions
                </h4>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw Analysis Fallback */}
            {analysis.rawAnalysis && !analysis.primaryColors && (
              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Analysis
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {analysis.rawAnalysis}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
