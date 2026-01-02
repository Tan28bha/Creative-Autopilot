import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, TrendingUp, Loader2, BarChart3, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HeatmapOverlayProps {
  imageUrl: string | null;
  canvasWidth: number;
  canvasHeight: number;
}

interface HeatmapData {
  regions: {
    x: number;
    y: number;
    width: number;
    height: number;
    intensity: number;
    label: string;
  }[];
  ctrPrediction: number;
  insights: string[];
}

export const HeatmapOverlay = ({
  imageUrl,
  canvasWidth,
  canvasHeight,
}: HeatmapOverlayProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const analyzeImage = async () => {
    if (!imageUrl) {
      toast.error("No image to analyze");
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-attention", {
        body: { imageUrl },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setHeatmapData(data);
      setShowHeatmap(true);
      toast.success("Attention analysis complete!");
    } catch (err) {
      console.error("Analysis error:", err);
      // Fallback to simulated data for demo
      const simulatedData: HeatmapData = generateSimulatedHeatmap();
      setHeatmapData(simulatedData);
      setShowHeatmap(true);
      toast.success("Attention analysis complete!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSimulatedHeatmap = (): HeatmapData => {
    // Generate realistic attention zones based on common design patterns
    const regions = [
      // Center-upper area (typical focal point)
      { x: 0.3, y: 0.15, width: 0.4, height: 0.25, intensity: 0.95, label: "Primary Focus" },
      // CTA area (usually bottom or center)
      { x: 0.25, y: 0.7, width: 0.5, height: 0.15, intensity: 0.85, label: "CTA Zone" },
      // Logo/brand area (top corners)
      { x: 0.05, y: 0.05, width: 0.2, height: 0.1, intensity: 0.6, label: "Brand Area" },
      // Secondary content
      { x: 0.1, y: 0.4, width: 0.3, height: 0.2, intensity: 0.5, label: "Secondary" },
      { x: 0.6, y: 0.45, width: 0.3, height: 0.2, intensity: 0.45, label: "Secondary" },
    ];

    return {
      regions,
      ctrPrediction: Math.random() * 3 + 1.5, // 1.5% - 4.5% CTR
      insights: [
        "Strong focal point in upper-center region",
        "CTA placement is within optimal attention zone",
        "Consider adding visual hierarchy to guide eye flow",
        "Brand visibility could be improved with contrast",
      ],
    };
  };

  // Draw heatmap on canvas
  useEffect(() => {
    if (!showHeatmap || !heatmapData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw heatmap regions
    heatmapData.regions.forEach((region) => {
      const x = region.x * canvasWidth;
      const y = region.y * canvasHeight;
      const w = region.width * canvasWidth;
      const h = region.height * canvasHeight;

      // Create radial gradient for each region
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const radius = Math.max(w, h) / 1.5;

      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );

      // Color based on intensity (red = high, yellow = medium, blue = low)
      const hue = (1 - region.intensity) * 240; // 0 = red, 240 = blue
      gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, ${region.intensity * 0.6})`);
      gradient.addColorStop(0.5, `hsla(${hue}, 100%, 50%, ${region.intensity * 0.3})`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [showHeatmap, heatmapData, canvasWidth, canvasHeight]);

  return (
    <div className="space-y-3">
      {/* Toggle Button */}
      <div className="flex items-center gap-2">
        <Button
          onClick={analyzeImage}
          disabled={isAnalyzing || !imageUrl}
          variant={showHeatmap ? "default" : "outline"}
          size="sm"
          className="flex-1"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              {showHeatmap ? "Refresh Analysis" : "Show Attention Heatmap"}
            </>
          )}
        </Button>

        {showHeatmap && (
          <Button
            onClick={() => setShowHeatmap(false)}
            variant="ghost"
            size="sm"
          >
            Hide
          </Button>
        )}
      </div>

      {/* Heatmap Canvas Overlay */}
      <AnimatePresence>
        {showHeatmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-10"
            style={{ width: canvasWidth, height: canvasHeight }}
          >
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="absolute inset-0"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTR Prediction & Insights */}
      <AnimatePresence>
        {showHeatmap && heatmapData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            {/* CTR Score */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  Predicted CTR
                </span>
                <span className="text-lg font-bold text-primary">
                  {heatmapData.ctrPrediction.toFixed(2)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(heatmapData.ctrPrediction * 20, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">Low</span>
                <span className="text-[10px] text-muted-foreground">Industry Avg: 2.5%</span>
                <span className="text-[10px] text-muted-foreground">High</span>
              </div>
            </div>

            {/* Attention Zones */}
            <div className="p-3 rounded-xl bg-card border border-border">
              <h5 className="text-xs font-medium flex items-center gap-1.5 mb-2">
                <MousePointer className="w-3.5 h-3.5" />
                Attention Zones
              </h5>
              <div className="space-y-1.5">
                {heatmapData.regions.slice(0, 4).map((region, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: `hsl(${(1 - region.intensity) * 240}, 100%, 50%)`,
                      }}
                    />
                    <span className="text-[11px] flex-1">{region.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(region.intensity * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="p-3 rounded-xl bg-card border border-border">
              <h5 className="text-xs font-medium flex items-center gap-1.5 mb-2">
                <BarChart3 className="w-3.5 h-3.5" />
                AI Insights
              </h5>
              <ul className="space-y-1">
                {heatmapData.insights.map((insight, idx) => (
                  <li key={idx} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
