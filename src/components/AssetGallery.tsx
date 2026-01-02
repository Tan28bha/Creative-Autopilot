import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Palette, Package, FileImage, Image, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AssetType = "logo" | "packshot" | "creative" | "other";

interface BrandAsset {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  asset_type: AssetType;
  file_size: number | null;
  created_at: string;
  url?: string;
}

interface AssetGalleryProps {
  refreshTrigger?: number;
}

const assetTypeIcons: Record<AssetType, React.ElementType> = {
  logo: Palette,
  packshot: Package,
  creative: FileImage,
  other: Image,
};

const assetTypeColors: Record<AssetType, string> = {
  logo: "bg-primary/20 text-primary",
  packshot: "bg-accent/20 text-accent",
  creative: "bg-green-400/20 text-green-400",
  other: "bg-orange-400/20 text-orange-400",
};

export const AssetGallery = ({ refreshTrigger }: AssetGalleryProps) => {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from("brand_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get public URLs for all assets
      const assetsWithUrls = (data || []).map((asset) => {
        const { data: urlData } = supabase.storage
          .from("brand-assets")
          .getPublicUrl(asset.file_path);
        return {
          ...asset,
          asset_type: asset.asset_type as AssetType,
          url: urlData.publicUrl,
        };
      });

      setAssets(assetsWithUrls);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to load assets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [refreshTrigger]);

  const handleDelete = async (asset: BrandAsset) => {
    setDeletingId(asset.id);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("brand-assets")
        .remove([asset.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("brand_assets")
        .delete()
        .eq("id", asset.id);

      if (dbError) throw dbError;

      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      toast.success("Asset deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete asset");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center mb-4">
          <Image className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No assets uploaded yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Upload logos, packshots, and creatives to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <AnimatePresence>
        {assets.map((asset) => {
          const Icon = assetTypeIcons[asset.asset_type];
          const colorClass = assetTypeColors[asset.asset_type];

          return (
            <motion.div
              key={asset.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              draggable
              onDragStart={(e) => {
                const dragEvent = e as unknown as React.DragEvent;
                dragEvent.dataTransfer?.setData("assetUrl", asset.url || "");
              }}
              className="group relative aspect-square rounded-xl overflow-hidden bg-card border border-border cursor-grab active:cursor-grabbing"
            >
              <img
                src={asset.url}
                alt={asset.file_name}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between">
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}>
                      <Icon className="w-3 h-3 inline mr-1" />
                      {asset.asset_type}
                    </div>
                    <button
                      onClick={() => handleDelete(asset)}
                      disabled={deletingId === asset.id}
                      className="w-8 h-8 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center"
                    >
                      {deletingId === asset.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Type Badge (always visible) */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}>
                <Icon className="w-3 h-3" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
