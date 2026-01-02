import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UploadPage from "./pages/dashboard/UploadPage";
import GeneratePage from "./pages/dashboard/GeneratePage";
import LayoutsPage from "./pages/dashboard/LayoutsPage";
import ExportPage from "./pages/dashboard/ExportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/upload" replace />} />
          <Route path="/dashboard/upload" element={<UploadPage />} />
          <Route path="/dashboard/generate" element={<GeneratePage />} />
          <Route path="/dashboard/layouts" element={<LayoutsPage />} />
          <Route path="/dashboard/export" element={<ExportPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
