import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  ArrowLeft, 
  FileImage, 
  CheckCircle, 
  Loader2,
  Share2,
  Copy,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "sonner";

const exportFormats = [
  { id: "png", name: "PNG", description: "Best for web and social media", recommended: true },
  { id: "jpg", name: "JPG", description: "Smaller file size, good quality", recommended: false },
  { id: "webp", name: "WebP", description: "Modern format, smallest size", recommended: false },
  { id: "pdf", name: "PDF", description: "Print-ready vector format", recommended: false },
];

const ExportPage = () => {
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsExporting(false);
    setExportComplete(true);
    toast.success("Creative exported successfully!");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + "/shared/creative-123");
    toast.success("Link copied to clipboard!");
  };

  return (
    <DashboardLayout title="Export Creative" subtitle="Download and share your creation">
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Export Your Creative</h2>
              <p className="text-muted-foreground">
                Choose your preferred format and download your creation
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="space-y-4">
              <h3 className="font-medium">Preview</h3>
              <div className="aspect-[9/16] max-h-[500px] mx-auto rounded-2xl border border-border bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 overflow-hidden flex items-center justify-center">
                <div className="text-center p-6">
                  <FileImage className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your creative preview</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Generate a creative in the previous step
                  </p>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <h3 className="font-medium mb-4">Export Format</h3>
                <div className="space-y-2">
                  {exportFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                        selectedFormat === format.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{format.name}</span>
                          {format.recommended && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format.description}
                        </p>
                      </div>
                      {selectedFormat === format.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Options */}
              <div>
                <h3 className="font-medium mb-4">Quality</h3>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Export Quality</span>
                    <span className="text-sm font-medium">High (2x)</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full w-3/4 bg-primary rounded-full" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Higher quality exports are larger in file size
                  </p>
                </div>
              </div>

              {/* Export Button */}
              <Button
                onClick={handleExport}
                disabled={isExporting}
                variant="hero"
                size="lg"
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : exportComplete ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Download Again
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Export as {selectedFormat.toUpperCase()}
                  </>
                )}
              </Button>

              {/* Share Options */}
              {exportComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-border bg-card space-y-3"
                >
                  <h4 className="font-medium flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Your Creative
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleCopyLink}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex justify-between"
        >
          <Link to="/dashboard/layouts">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Layouts
            </Button>
          </Link>
          <Link to="/dashboard/upload">
            <Button variant="secondary" size="lg">
              Create New Creative
            </Button>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ExportPage;
