import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Check, ArrowRight, ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";

const formatOptions = [
  { 
    name: "Instagram Story", 
    size: "1080×1920", 
    ratio: "9:16",
    preview: "aspect-[9/16]",
    popular: true 
  },
  { 
    name: "Instagram Post", 
    size: "1080×1080", 
    ratio: "1:1",
    preview: "aspect-square",
    popular: true 
  },
  { 
    name: "Facebook Post", 
    size: "1200×628", 
    ratio: "1.91:1",
    preview: "aspect-[1.91/1]",
    popular: false 
  },
  { 
    name: "Twitter Post", 
    size: "1200×675", 
    ratio: "16:9",
    preview: "aspect-video",
    popular: false 
  },
  { 
    name: "LinkedIn Post", 
    size: "1200×627", 
    ratio: "1.91:1",
    preview: "aspect-[1.91/1]",
    popular: false 
  },
  { 
    name: "Pinterest Pin", 
    size: "1000×1500", 
    ratio: "2:3",
    preview: "aspect-[2/3]",
    popular: true 
  },
  { 
    name: "Web Banner", 
    size: "1920×600", 
    ratio: "3.2:1",
    preview: "aspect-[3.2/1]",
    popular: false 
  },
  { 
    name: "E-commerce", 
    size: "1000×1000", 
    ratio: "1:1",
    preview: "aspect-square",
    popular: true 
  },
];

const LayoutsPage = () => {
  const [selectedFormats, setSelectedFormats] = useState<number[]>([0]);

  const toggleFormat = (index: number) => {
    setSelectedFormats((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <DashboardLayout title="Choose Layouts" subtitle="Select output formats for your creative">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Output Formats</h2>
              <p className="text-muted-foreground">
                Select one or more formats to export your creative in different sizes
              </p>
            </div>
          </div>

          {/* Popular Formats */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
              Popular Formats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formatOptions
                .map((format, index) => ({ ...format, originalIndex: index }))
                .filter((f) => f.popular)
                .map((format) => (
                  <FormatCard
                    key={format.originalIndex}
                    format={format}
                    isSelected={selectedFormats.includes(format.originalIndex)}
                    onToggle={() => toggleFormat(format.originalIndex)}
                  />
                ))}
            </div>
          </div>

          {/* Other Formats */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
              Other Formats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formatOptions
                .map((format, index) => ({ ...format, originalIndex: index }))
                .filter((f) => !f.popular)
                .map((format) => (
                  <FormatCard
                    key={format.originalIndex}
                    format={format}
                    isSelected={selectedFormats.includes(format.originalIndex)}
                    onToggle={() => toggleFormat(format.originalIndex)}
                  />
                ))}
              
              {/* Add Custom Format */}
              <button className="p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all flex flex-col items-center justify-center min-h-[180px] group">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                  Custom Size
                </span>
              </button>
            </div>
          </div>

          {/* Selected Summary */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  {selectedFormats.length} format{selectedFormats.length !== 1 ? "s" : ""} selected
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedFormats.map((i) => formatOptions[i].name).join(", ")}
                </p>
              </div>
              {selectedFormats.length > 1 && (
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  Batch Export Ready
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-between"
        >
          <Link to="/dashboard/generate">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Generate
            </Button>
          </Link>
          <Link to="/dashboard/export">
            <Button variant="hero" size="lg" disabled={selectedFormats.length === 0}>
              Continue to Export
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

interface FormatCardProps {
  format: {
    name: string;
    size: string;
    ratio: string;
    preview: string;
    popular: boolean;
  };
  isSelected: boolean;
  onToggle: () => void;
}

const FormatCard = ({ format, isSelected, onToggle }: FormatCardProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onToggle}
    className={`p-4 rounded-2xl border-2 transition-all text-left ${
      isSelected
        ? "border-primary bg-primary/5"
        : "border-border hover:border-primary/50"
    }`}
  >
    {/* Preview */}
    <div className="flex items-center justify-center h-24 mb-4">
      <div
        className={`${format.preview} h-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 rounded-lg border border-border max-w-full`}
        style={{ maxHeight: "100%" }}
      />
    </div>

    {/* Info */}
    <div className="flex items-start justify-between">
      <div>
        <h4 className="font-medium text-sm">{format.name}</h4>
        <p className="text-xs text-muted-foreground">{format.size}</p>
        <p className="text-xs text-muted-foreground">{format.ratio}</p>
      </div>
      {isSelected && (
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  </motion.button>
);

export default LayoutsPage;
