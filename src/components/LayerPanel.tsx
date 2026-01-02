import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Image as ImageIcon,
  Square,
} from "lucide-react";
import { Canvas as FabricCanvas, FabricObject } from "fabric";

/* -----------------------------
   Types
-------------------------------- */
interface LayerItem {
  id: string;
  name: string;
  type: "image" | "text" | "shape";
  visible: boolean;
  locked: boolean;
  object: FabricObject;
}

interface LayerPanelProps {
  fabricCanvas: FabricCanvas | null;
  onLayerChange?: () => void;
}

/* -----------------------------
   Helpers
-------------------------------- */
const getImageSrc = (obj: FabricObject): string | null => {
  if (obj.type !== "image") return null;

  const element = (obj as any).getElement?.();
  if (!element) return null;

  return element.src || null;
};

/* -----------------------------
   Component
-------------------------------- */
export const LayerPanel = ({
  fabricCanvas,
  onLayerChange,
}: LayerPanelProps) => {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  /* -----------------------------
     Sync Layers with Canvas
  -------------------------------- */
  useEffect(() => {
    if (!fabricCanvas) return;

    const updateLayers = () => {
      const objects = fabricCanvas.getObjects();

      const newLayers: LayerItem[] = objects
        .map((obj, index) => {
          const type =
            obj.type === "image"
              ? "image"
              : obj.type === "textbox" || obj.type === "text"
              ? "text"
              : "shape";

          const stableId =
            (obj as any).__layerId ||
            ((obj as any).__layerId = `layer-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`);

          const name =
            type === "text"
              ? (obj as any).text?.slice(0, 15) || `Text ${index + 1}`
              : type === "image"
              ? `Image ${index + 1}`
              : `Shape ${index + 1}`;

          return {
            id: stableId,
            name,
            type,
            visible: obj.visible ?? true,
            locked: !obj.selectable,
            object: obj,
          };
        })
        .reverse(); // Top layer first

      setLayers(newLayers);
    };

    updateLayers();

    fabricCanvas.on("object:added", updateLayers);
    fabricCanvas.on("object:removed", updateLayers);
    fabricCanvas.on("object:modified", updateLayers);

    return () => {
      fabricCanvas.off("object:added", updateLayers);
      fabricCanvas.off("object:removed", updateLayers);
      fabricCanvas.off("object:modified", updateLayers);
    };
  }, [fabricCanvas]);

  /* -----------------------------
     Actions
  -------------------------------- */
  const toggleVisibility = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    layer.object.visible = !layer.visible;
    fabricCanvas.renderAll();

    setLayers((prev) =>
      prev.map((l) =>
        l.id === layer.id ? { ...l, visible: !l.visible } : l
      )
    );

    onLayerChange?.();
  };

  const toggleLock = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    layer.object.selectable = layer.locked;
    layer.object.evented = layer.locked;
    fabricCanvas.renderAll();

    setLayers((prev) =>
      prev.map((l) =>
        l.id === layer.id ? { ...l, locked: !l.locked } : l
      )
    );

    onLayerChange?.();
  };

  const deleteLayer = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    fabricCanvas.remove(layer.object);
    fabricCanvas.renderAll();
    onLayerChange?.();
  };

  const moveLayerUp = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    fabricCanvas.bringObjectForward(layer.object);
    fabricCanvas.renderAll();
    onLayerChange?.();
  };

  const moveLayerDown = (layer: LayerItem) => {
    if (!fabricCanvas) return;
    fabricCanvas.sendObjectBackwards(layer.object);
    fabricCanvas.renderAll();
    onLayerChange?.();
  };

  const selectLayer = (layer: LayerItem) => {
    if (!fabricCanvas || layer.locked) return;
    fabricCanvas.setActiveObject(layer.object);
    fabricCanvas.renderAll();
    setSelectedLayerId(layer.id);
  };

  const getIcon = (type: LayerItem["type"]) => {
    switch (type) {
      case "text":
        return <Type className="w-3 h-3" />;
      case "image":
        return <ImageIcon className="w-3 h-3" />;
      default:
        return <Square className="w-3 h-3" />;
    }
  };

  /* -----------------------------
     Empty State
  -------------------------------- */
  if (layers.length === 0) {
    return (
      <div className="p-3 text-center">
        <Layers className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-xs text-muted-foreground">No layers yet</p>
      </div>
    );
  }

  /* -----------------------------
     UI
  -------------------------------- */
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-medium text-muted-foreground px-1 mb-2 flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5" />
        Layers ({layers.length})
      </h4>

      <div className="space-y-1">
        {layers.map((layer) => (
          <motion.div
            key={layer.id}
            className={`flex items-center gap-1.5 p-1.5 rounded-lg cursor-pointer transition-colors ${
              selectedLayerId === layer.id
                ? "bg-primary/10 border border-primary/30"
                : "hover:bg-secondary border border-transparent"
            } ${layer.locked ? "opacity-60" : ""}`}
            onClick={() => selectLayer(layer)}
          >
            {/* Thumbnail / Icon */}
            <div className="w-6 h-6 rounded bg-secondary overflow-hidden flex items-center justify-center">
              {layer.type === "image" ? (
                (() => {
                  const src = getImageSrc(layer.object);
                  return src ? (
                    <img
                      src={src}
                      alt={layer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-3 h-3 text-muted-foreground" />
                  );
                })()
              ) : (
                <div className="text-muted-foreground">
                  {getIcon(layer.type)}
                </div>
              )}
            </div>

            {/* Name */}
            <span className="text-[11px] flex-1 truncate">
              {layer.name}
            </span>

            {/* Controls */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(layer);
                }}
              >
                {layer.visible ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(layer);
                }}
              >
                {layer.locked ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Unlock className="w-3 h-3" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLayerUp(layer);
                }}
              >
                <ChevronUp className="w-3 h-3" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLayerDown(layer);
                }}
              >
                <ChevronDown className="w-3 h-3" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteLayer(layer);
                }}
                className="text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
