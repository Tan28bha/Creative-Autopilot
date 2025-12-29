import { useState } from "react";
import { motion } from "framer-motion";
import { Type, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TextOverlayEditorProps {
  onAddText: (config: TextConfig) => void;
}

export interface TextConfig {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  textAlign: string;
  shadow: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  stroke: {
    enabled: boolean;
    color: string;
    width: number;
  };
}

const FONT_OPTIONS = [
  { value: "Space Grotesk", label: "Space Grotesk" },
  { value: "Inter", label: "Inter" },
  { value: "Arial", label: "Arial" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier" },
  { value: "Impact", label: "Impact" },
  { value: "Comic Sans MS", label: "Comic Sans" },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];

const FONT_WEIGHTS = [
  { value: "normal", label: "Regular" },
  { value: "bold", label: "Bold" },
  { value: "lighter", label: "Light" },
];

const TEXT_ALIGNS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

const COLOR_PRESETS = [
  "#FFFFFF",
  "#000000",
  "#00D4FF",
  "#9B5DE5",
  "#F15BB5",
  "#FEE440",
  "#00F5D4",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

export const TextOverlayEditor = ({ onAddText }: TextOverlayEditorProps) => {
  const [text, setText] = useState("");
  const [fontFamily, setFontFamily] = useState("Space Grotesk");
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState("bold");
  const [color, setColor] = useState("#FFFFFF");
  const [textAlign, setTextAlign] = useState("center");
  const [isOpen, setIsOpen] = useState(false);

  // Shadow state
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowBlur, setShadowBlur] = useState(4);
  const [shadowOffsetX, setShadowOffsetX] = useState(2);
  const [shadowOffsetY, setShadowOffsetY] = useState(2);

  // Stroke state
  const [strokeEnabled, setStrokeEnabled] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const handleAddText = () => {
    if (!text.trim()) return;
    
    onAddText({
      text: text.trim(),
      fontFamily,
      fontSize,
      fontWeight,
      color,
      textAlign,
      shadow: {
        enabled: shadowEnabled,
        color: shadowColor,
        blur: shadowBlur,
        offsetX: shadowOffsetX,
        offsetY: shadowOffsetY,
      },
      stroke: {
        enabled: strokeEnabled,
        color: strokeColor,
        width: strokeWidth,
      },
    });
    
    setText("");
    setIsOpen(false);
  };

  const getPreviewStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      fontFamily,
      fontSize: Math.min(fontSize, 32),
      fontWeight,
      color,
      textAlign: textAlign as "left" | "center" | "right",
    };

    if (shadowEnabled) {
      style.textShadow = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`;
    }

    if (strokeEnabled) {
      style.WebkitTextStroke = `${strokeWidth}px ${strokeColor}`;
      style.paintOrder = "stroke fill";
    }

    return style;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2"
        >
          <Type className="w-4 h-4" />
          Add Text
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-card border-border" 
        align="start"
        sideOffset={8}
      >
        <ScrollArea className="h-[480px]">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-4"
          >
            <div className="space-y-2">
              <Label htmlFor="text-input" className="text-sm font-medium">
                Text Content
              </Label>
              <Input
                id="text-input"
                placeholder="Enter headline or CTA..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Font</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem 
                        key={font.value} 
                        value={font.value}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Size</Label>
                <Select 
                  value={fontSize.toString()} 
                  onValueChange={(v) => setFontSize(parseInt(v))}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}px
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Weight</Label>
                <Select value={fontWeight} onValueChange={setFontWeight}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {FONT_WEIGHTS.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Align</Label>
                <Select value={textAlign} onValueChange={setTextAlign}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {TEXT_ALIGNS.map((align) => (
                      <SelectItem key={align.value} value={align.value}>
                        {align.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Color</Label>
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PRESETS.map((presetColor) => (
                    <button
                      key={presetColor}
                      onClick={() => setColor(presetColor)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        color === presetColor 
                          ? "border-primary scale-110" 
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: presetColor }}
                      title={presetColor}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 p-0 border-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Shadow Options */}
            <div className="space-y-3 p-3 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Text Shadow</Label>
                <Switch
                  checked={shadowEnabled}
                  onCheckedChange={setShadowEnabled}
                />
              </div>
              
              {shadowEnabled && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-14">Color</Label>
                    <Input
                      type="color"
                      value={shadowColor}
                      onChange={(e) => setShadowColor(e.target.value)}
                      className="w-8 h-8 p-0 border-0 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">{shadowColor}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Blur</Label>
                      <span className="text-xs text-muted-foreground">{shadowBlur}px</span>
                    </div>
                    <Slider
                      value={[shadowBlur]}
                      onValueChange={([v]) => setShadowBlur(v)}
                      min={0}
                      max={20}
                      step={1}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">X Offset</Label>
                        <span className="text-xs text-muted-foreground">{shadowOffsetX}px</span>
                      </div>
                      <Slider
                        value={[shadowOffsetX]}
                        onValueChange={([v]) => setShadowOffsetX(v)}
                        min={-10}
                        max={10}
                        step={1}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Y Offset</Label>
                        <span className="text-xs text-muted-foreground">{shadowOffsetY}px</span>
                      </div>
                      <Slider
                        value={[shadowOffsetY]}
                        onValueChange={([v]) => setShadowOffsetY(v)}
                        min={-10}
                        max={10}
                        step={1}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stroke Options */}
            <div className="space-y-3 p-3 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Text Stroke</Label>
                <Switch
                  checked={strokeEnabled}
                  onCheckedChange={setStrokeEnabled}
                />
              </div>
              
              {strokeEnabled && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-14">Color</Label>
                    <Input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-8 h-8 p-0 border-0 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">{strokeColor}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Width</Label>
                      <span className="text-xs text-muted-foreground">{strokeWidth}px</span>
                    </div>
                    <Slider
                      value={[strokeWidth]}
                      onValueChange={([v]) => setStrokeWidth(v)}
                      min={1}
                      max={8}
                      step={1}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Preview</p>
              <p
                style={getPreviewStyle()}
                className="min-h-[40px] flex items-center justify-center"
              >
                {text || "Your text here"}
              </p>
            </div>

            <Button 
              onClick={handleAddText} 
              className="w-full"
              disabled={!text.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Canvas
            </Button>
          </motion.div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
