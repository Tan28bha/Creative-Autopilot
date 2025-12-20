import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, FabricImage, Textbox } from "fabric";
import { motion } from "framer-motion";
import { 
  Move, 
  ZoomIn, 
  ZoomOut, 
  Trash2, 
  RotateCcw, 
  Layers,
  Download,
  Image as ImageIcon,
  Grid,
  Magnet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TextOverlayEditor, TextConfig } from "./TextOverlayEditor";
import { LayerPanel } from "./LayerPanel";
import { HeatmapOverlay } from "./HeatmapOverlay";

interface CanvasEditorProps {
  backgroundImage?: string | null;
  assets?: { id: string; url: string; asset_type: string }[];
  width?: number;
  height?: number;
  showHeatmap?: boolean;
}

export const CanvasEditor = ({ 
  backgroundImage, 
  assets = [],
  width = 320,
  height = 568,
  showHeatmap = false
}: CanvasEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState(100);
  const [selectedObject, setSelectedObject] = useState<boolean>(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#1a1a2e",
      selection: true,
      preserveObjectStacking: true,
    });

    canvas.on("selection:created", () => setSelectedObject(true));
    canvas.on("selection:updated", () => setSelectedObject(true));
    canvas.on("selection:cleared", () => setSelectedObject(false));

    // Snap to grid functionality
    canvas.on("object:moving", (e) => {
      if (snapToGrid && e.target) {
        const gridSize = 20;
        const left = Math.round((e.target.left || 0) / gridSize) * gridSize;
        const top = Math.round((e.target.top || 0) / gridSize) * gridSize;
        e.target.set({ left, top });
      }
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height, snapToGrid]);

  // Load background image when it changes
  useEffect(() => {
    if (!fabricCanvas || !backgroundImage) return;

    const loadBackground = async () => {
      try {
        const img = await FabricImage.fromURL(backgroundImage, { crossOrigin: "anonymous" });
        
        // Scale to fit canvas
        const scaleX = width / (img.width || 1);
        const scaleY = height / (img.height || 1);
        const scale = Math.max(scaleX, scaleY);
        
        img.set({
          scaleX: scale,
          scaleY: scale,
          originX: "center",
          originY: "center",
          left: width / 2,
          top: height / 2,
          selectable: true,
          evented: true,
        });

        // Clear existing objects and add new background
        fabricCanvas.clear();
        fabricCanvas.backgroundColor = "#1a1a2e";
        fabricCanvas.add(img);
        fabricCanvas.sendObjectToBack(img);
        fabricCanvas.renderAll();
      } catch (error) {
        console.error("Error loading background:", error);
      }
    };

    loadBackground();
  }, [fabricCanvas, backgroundImage, width, height]);

  // Add asset to canvas
  const addAssetToCanvas = useCallback(async (assetUrl: string) => {
    if (!fabricCanvas) return;

    try {
      const img = await FabricImage.fromURL(assetUrl, { crossOrigin: "anonymous" });
      
      // Scale to reasonable size
      const maxSize = 120;
      const scale = Math.min(maxSize / (img.width || 1), maxSize / (img.height || 1));
      
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: width / 2,
        top: height / 2,
        originX: "center",
        originY: "center",
      });

      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
      toast.success("Asset added to canvas");
    } catch (error) {
      console.error("Error adding asset:", error);
      toast.error("Failed to add asset");
    }
  }, [fabricCanvas, width, height]);

  // Add text to canvas
  const addTextToCanvas = useCallback((config: TextConfig) => {
    if (!fabricCanvas) return;

    const textOptions: Record<string, unknown> = {
      left: width / 2,
      top: height / 2,
      originX: "center",
      originY: "center",
      fontFamily: config.fontFamily,
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
      fill: config.color,
      textAlign: config.textAlign,
      width: width * 0.8,
      editable: true,
      splitByGrapheme: true,
    };

    // Apply shadow if enabled
    if (config.shadow.enabled) {
      textOptions.shadow = {
        color: config.shadow.color,
        blur: config.shadow.blur,
        offsetX: config.shadow.offsetX,
        offsetY: config.shadow.offsetY,
      };
    }

    // Apply stroke if enabled
    if (config.stroke.enabled) {
      textOptions.stroke = config.stroke.color;
      textOptions.strokeWidth = config.stroke.width;
      textOptions.paintFirst = "stroke";
    }

    const text = new Textbox(config.text, textOptions);

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    toast.success("Text added to canvas");
  }, [fabricCanvas, width, height]);

  // Handle drop from asset gallery
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const assetUrl = e.dataTransfer.getData("assetUrl");
    if (assetUrl) {
      addAssetToCanvas(assetUrl);
    }
  }, [addAssetToCanvas]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Canvas controls
  const handleZoomIn = () => {
    if (!fabricCanvas) return;
    const newZoom = Math.min(zoom + 10, 200);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom / 100);
    fabricCanvas.renderAll();
  };

  const handleZoomOut = () => {
    if (!fabricCanvas) return;
    const newZoom = Math.max(zoom - 10, 50);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom / 100);
    fabricCanvas.renderAll();
  };

  const handleDelete = () => {
    if (!fabricCanvas) return;
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => fabricCanvas.remove(obj));
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      toast.success("Object deleted");
    }
  };

  const handleReset = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#1a1a2e";
    fabricCanvas.setZoom(1);
    setZoom(100);
    fabricCanvas.renderAll();
    toast.success("Canvas reset");
  };

  const handleBringForward = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.bringObjectForward(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const handleExport = () => {
    if (!fabricCanvas) return;
    const dataUrl = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    
    const link = document.createElement("a");
    link.download = "creative-export.png";
    link.href = dataUrl;
    link.click();
    toast.success("Creative exported!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex gap-4"
    >
      {/* Layer Panel */}
      {showLayers && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-56 p-3 rounded-xl border border-border bg-card"
        >
          <LayerPanel fabricCanvas={fabricCanvas} />
        </motion.div>
      )}

      <div className="flex flex-col items-center gap-4">
        {/* Canvas Container */}
        <div
          ref={containerRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative rounded-2xl border border-border overflow-hidden bg-card shadow-elegant"
          style={{ 
            width: width * (zoom / 100), 
            height: height * (zoom / 100),
            transition: "width 0.2s, height 0.2s"
          }}
        >
          {/* Grid Overlay */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none z-5"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px"
              }}
            />
          )}

          <canvas ref={canvasRef} />

          {/* Heatmap Overlay */}
          {backgroundImage && (
            <HeatmapOverlay
              imageUrl={backgroundImage}
              canvasWidth={width * (zoom / 100)}
              canvasHeight={height * (zoom / 100)}
            />
          )}

          {/* Empty State */}
          {!backgroundImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground text-center px-8">
                Generate a creative or drag assets here to start editing
              </p>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 rounded-xl glass">
          <TextOverlayEditor onAddText={addTextToCanvas} />

          <div className="w-px h-6 bg-border mx-1" />

          {/* Layer Toggle */}
          <button
            onClick={() => setShowLayers(!showLayers)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              showLayers ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle Layers"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              showGrid ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Snap Toggle */}
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              snapToGrid ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            title="Snap to Grid"
          >
            <Magnet className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-muted-foreground min-w-[50px] text-center">
            {zoom}%
          </span>
          
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          <button
            onClick={handleDelete}
            disabled={!selectedObject}
            className="w-9 h-9 rounded-lg hover:bg-destructive/20 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Reset Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            onClick={handleExport}
            variant="hero"
            size="sm"
            className="h-9"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>

        {/* Drag Hint */}
        {assets.length > 0 && (
          <p className="text-xs text-muted-foreground">
            <Move className="w-3 h-3 inline mr-1" />
            Drag assets from the gallery onto the canvas
          </p>
        )}
      </div>
    </motion.div>
  );
};
