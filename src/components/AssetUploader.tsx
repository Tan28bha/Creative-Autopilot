import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image, Package, Palette, FileImage, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AssetType = "logo" | "packshot" | "creative" | "other";

interface UploadedAsset {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  asset_type: AssetType;
  file_size: number | null;
  created_at: string;
  url?: string;
}

interface AssetUploaderProps {
  onUploadComplete?: (asset: UploadedAsset) => void;
}

const assetTypes: { value: AssetType; label: string; icon: React.ElementType }[] = [
  { value: "logo", label: "Logo", icon: Palette },
  { value: "packshot", label: "Packshot", icon: Package },
  { value: "creative", label: "Creative", icon: FileImage },
  { value: "other", label: "Other", icon: Image },
];

export const AssetUploader = ({ onUploadComplete }: AssetUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<AssetType>("logo");
  const [previewFile, setPreviewFile] = useState<{ file: File; preview: string } | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const file = files[0];
      setPreviewFile({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].type.startsWith("image/")) {
      const file = files[0];
      setPreviewFile({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleUpload = async () => {
    if (!previewFile) return;

    setIsUploading(true);
    try {
      const file = previewFile.file;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${selectedType}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("brand-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("brand-assets")
        .getPublicUrl(filePath);

      // Save metadata to database
      const { data: assetData, error: dbError } = await supabase
        .from("brand_assets")
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          asset_type: selectedType,
          file_size: file.size,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success("Asset uploaded successfully!");
      
      if (onUploadComplete && assetData) {
        onUploadComplete({
          ...assetData,
          asset_type: assetData.asset_type as AssetType,
          url: urlData.publicUrl,
        });
      }

      // Reset state
      setPreviewFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload asset");
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile.preview);
    }
    setPreviewFile(null);
  };

  return (
    <div className="space-y-4">
      {/* Asset Type Selection */}
      <div className="flex flex-wrap gap-2">
        {assetTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              selectedType === type.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <type.icon className="w-4 h-4" />
            {type.label}
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50"
        }`}
      >
        <AnimatePresence mode="wait">
          {previewFile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <img
                  src={previewFile.preview}
                  alt="Preview"
                  className="w-32 h-32 object-contain rounded-xl bg-card"
                />
                <button
                  onClick={clearPreview}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground truncate max-w-full">
                {previewFile.file.name}
              </p>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                variant="hero"
                size="sm"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Upload {assetTypes.find((t) => t.value === selectedType)?.label}
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">
                  Drop your {assetTypes.find((t) => t.value === selectedType)?.label.toLowerCase()} here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, SVG up to 10MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
