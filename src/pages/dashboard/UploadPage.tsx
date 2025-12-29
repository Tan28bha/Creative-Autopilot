import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Image, ArrowRight, AlertCircle, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AssetUploader } from "@/components/AssetUploader";
import { AssetGallery } from "@/components/AssetGallery";
import { testSupabaseConnection, getApiKeyInstructions } from "@/lib/supabase-test";
import { toast } from "sonner";

const UploadPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  }>({ tested: false, success: false, message: "" });

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const testConnection = async () => {
    const result = await testSupabaseConnection();
    setConnectionStatus({
      tested: true,
      success: result.success,
      message: result.message,
    });
    
    if (result.success) {
      toast.success("Connection test passed!");
    } else {
      toast.error("Connection test failed. Check the details below.");
    }
  };

  // Auto-test on mount
  useEffect(() => {
    testConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout title="Upload Assets" subtitle="Add your brand assets to get started">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Connection Status Alert */}
        {connectionStatus.tested && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant={connectionStatus.success ? "default" : "destructive"}>
              {connectionStatus.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {connectionStatus.success ? "Connection Successful" : "Connection Failed"}
              </AlertTitle>
              <AlertDescription className="mt-2">
                <div className="whitespace-pre-line text-sm">{connectionStatus.message}</div>
                {!connectionStatus.success && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-mono bg-muted p-3 rounded border overflow-x-auto">
                      {getApiKeyInstructions()}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testConnection}
                        className="text-xs"
                      >
                        <Loader2 className="w-3 h-3 mr-2" />
                        Test Again
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open("https://app.supabase.com", "_blank");
                        }}
                        className="text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Open Supabase Dashboard
                      </Button>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

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
