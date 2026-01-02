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

      // Log full response for debugging
      console.log("Function response:", { data, error: fnError });
      console.log("Error details:", JSON.stringify(fnError, null, 2));
      console.log("Data details:", JSON.stringify(data, null, 2));

      // Check for error in response data first (function might return error in body even with 500 status)
      if (data?.error) {
        const errorMsg = data.error;
        console.error("Error from function:", errorMsg);
        
        // Provide helpful context based on error message
        if (errorMsg.includes("GOOGLE_AI_API_KEY is not configured")) {
          throw new Error("GOOGLE_AI_API_KEY is not configured. Please:\n1. Set it in Edge Functions → Settings → Secrets\n2. Redeploy the function (important!)");
        } else if (errorMsg.includes("API key is invalid") || errorMsg.includes("403") || errorMsg.includes("invalid or expired")) {
          throw new Error("AI API key is invalid or expired. Please:\n1. Verify your Google AI API key at https://aistudio.google.com/app/apikey\n2. Update GOOGLE_AI_API_KEY in Edge Functions secrets\n3. Redeploy the function");
        } else if (errorMsg.includes("Failed to process any images") || errorMsg.includes("Failed to process")) {
          throw new Error("Failed to process images. Please ensure:\n1. Images are uploaded to Supabase Storage\n2. Image URLs are publicly accessible\n3. Images are valid image files");
        } else if (errorMsg.includes("Internal server error")) {
          // Extract the actual error from the internal server error message
          const actualError = errorMsg.replace("Internal server error: ", "").split("\nStack:")[0];
          throw new Error(`Function error: ${actualError}\n\nCheck function logs in Supabase Dashboard → Edge Functions → analyze-brand → Logs for more details.`);
        }
        throw new Error(errorMsg);
      }

      if (fnError) {
        console.error("Edge Function error:", fnError);
        console.error("Error data:", data);
        
        // Check if it's a non-2xx status code error
        if (fnError.message?.includes("non-2xx") || fnError.message?.includes("status code") || fnError.context?.status) {
          // Try to get status code from error context or message
          const statusCode = fnError.context?.status || fnError.message?.match(/(\d{3})/)?.[1] || null;
          
          // If we have data with error, use that instead
          if (data?.error) {
            throw new Error(data.error);
          }
          
          // Common status code errors
          if (statusCode === 403 || fnError.message?.includes("403")) {
            throw new Error("AI API key is invalid or expired. Please check GOOGLE_AI_API_KEY in Edge Functions secrets and redeploy.");
          } else if (statusCode === 400 || fnError.message?.includes("400")) {
            throw new Error("Invalid request. Please check that your images are accessible and valid.");
          } else if (statusCode === 429 || fnError.message?.includes("429")) {
            throw new Error("Rate limit exceeded. Please try again in a moment.");
          } else if (statusCode === 404 || fnError.message?.includes("404")) {
            throw new Error("Model not found. Check function logs for the exact Gemini API error.");
          } else if (statusCode === 500 || fnError.message?.includes("500")) {
            throw new Error("Server error in Edge Function. Check function logs: Supabase Dashboard → Edge Functions → analyze-brand → Logs");
          }
          
          throw new Error(`Edge Function returned error (status: ${statusCode || 'unknown'}). Error: ${fnError.message}. Check function logs for details.`);
        }
        
        // Provide more specific error messages
        if (fnError.message?.includes("Function not found") || fnError.message?.includes("404")) {
          throw new Error("Edge Function 'analyze-brand' is not deployed. Please deploy it in Supabase Dashboard → Edge Functions.");
        } else if (fnError.message?.includes("Failed to send")) {
          throw new Error("Failed to connect to Edge Function. Please ensure:\n1. The function is deployed\n2. GOOGLE_AI_API_KEY is set in Edge Functions secrets\n3. Your Supabase URL is correct");
        }
        
        throw fnError;
      }

      if (!data?.analysis) {
        throw new Error("No analysis data returned from the function. The function may have encountered an error.");
      }

      const analysisData = data.analysis;
      setAnalysis(analysisData);
      onAnalysisComplete(analysisData);
      toast.success("Brand analysis complete!");
    } catch (err) {
      console.error("Analysis error:", err);
      const message = err instanceof Error ? err.message : "Failed to analyze assets";
      setError(message);
      toast.error(message, {
        duration: 6000,
      });
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
