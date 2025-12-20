import { motion } from "framer-motion";
import { 
  Upload, 
  Sparkles, 
  Settings, 
  Layers,
  Download,
  Wand2,
  Check
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const steps = [
  { icon: Upload, label: "Upload", path: "/dashboard/upload", step: 1 },
  { icon: Wand2, label: "Generate", path: "/dashboard/generate", step: 2 },
  { icon: Layers, label: "Layouts", path: "/dashboard/layouts", step: 3 },
  { icon: Download, label: "Export", path: "/dashboard/export", step: 4 },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const location = useLocation();
  const currentStep = steps.findIndex(s => s.path === location.pathname) + 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="h-16 border-b border-border px-6 flex items-center justify-between bg-card"
      >
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg hidden md:block">AdForge</span>
          </Link>
          <div className="h-6 w-px bg-border hidden md:block" />
          {title && (
            <div className="hidden md:block">
              <h1 className="font-display font-semibold">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Step Navigation */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="border-b border-border bg-card/50 px-6 py-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = location.pathname === step.path;
              const isCompleted = currentStep > step.step;
              const isAccessible = step.step <= Math.max(currentStep, 1);

              return (
                <div key={step.path} className="flex items-center">
                  <Link
                    to={isAccessible ? step.path : "#"}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-primary/20 text-primary hover:bg-primary/30"
                        : isAccessible
                        ? "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        : "text-muted-foreground/50 cursor-not-allowed"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive 
                        ? "bg-primary-foreground/20" 
                        : isCompleted 
                        ? "bg-primary/20"
                        : "bg-secondary"
                    }`}>
                      {isCompleted && !isActive ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium">{step.label}</p>
                      <p className="text-xs opacity-70">Step {step.step}</p>
                    </div>
                  </Link>

                  {index < steps.length - 1 && (
                    <div className={`w-12 lg:w-24 h-0.5 mx-2 ${
                      isCompleted ? "bg-primary" : "bg-border"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
