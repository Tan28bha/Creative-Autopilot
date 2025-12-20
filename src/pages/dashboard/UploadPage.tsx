import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Image, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AssetUploader } from "@/components/AssetUploader";
import { AssetGallery } from "@/components/AssetGallery";

const UploadPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <DashboardLayout title="Upload Assets" subtitle="Add your brand assets to get started">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Upload Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                Upload Assets
              </h2>
              <p className="text-muted-foreground">
                Upload your logos, product images, and brand assets. These will be used to generate on-brand creatives.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card">
              <AssetUploader onUploadComplete={handleUploadComplete} />
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <h4 className="font-medium text-sm mb-2">💡 Tips for best results</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Upload high-resolution images (1000px+)</li>
                <li>• Include your logo in PNG format with transparency</li>
                <li>• Add multiple product angles for variety</li>
              </ul>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Image className="w-5 h-5 text-accent" />
                </div>
                Your Assets
              </h2>
              <p className="text-muted-foreground">
                Manage your uploaded brand assets. Click on any asset to preview or delete.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card min-h-[400px]">
              <AssetGallery refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </motion.div>

        {/* Next Step CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex justify-end"
        >
          <Link to="/dashboard/generate">
            <Button variant="hero" size="lg">
              Continue to Generate
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
