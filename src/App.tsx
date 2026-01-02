import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import UploadPage from "./pages/dashboard/UploadPage";
import GeneratePage from "./pages/dashboard/GeneratePage";
import LayoutsPage from "./pages/dashboard/LayoutsPage";
import ExportPage from "./pages/dashboard/ExportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard/upload" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/generate"
              element={
                <ProtectedRoute>
                  <GeneratePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/layouts"
              element={
                <ProtectedRoute>
                  <LayoutsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/export"
              element={
                <ProtectedRoute>
                  <ExportPage />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
