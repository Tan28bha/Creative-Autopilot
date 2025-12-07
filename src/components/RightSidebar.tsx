"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Brush, Image as ImageIcon, Settings, Layers } from "lucide-react";

// Panels
import { AIBackgroundPanel } from "@/components/panels/AIBackgroundPanel";
import { BrandingPanel } from "@/components/panels/BrandingPanel";
import { DesignPanel } from "@/components/panels/DesignPanel";
import { AssetsPanel } from "@/components/panels/AssetsPanel";

type TabType = "design" | "backgrounds" | "branding" | "assets";

export function RightSidebar() {
  const [tab, setTab] = useState<TabType>("design");

  return (
    <div className="w-72 bg-slate-900 border-l border-slate-700 flex flex-col">
      {/* ---------------- TABS ---------------- */}
      <div className="grid grid-cols-4 bg-slate-800 border-b border-slate-700">
        {/* DESIGN TAB */}
        <button
          onClick={() => setTab("design")}
          className={`p-3 flex flex-col items-center text-xs ${
            tab === "design" ? "bg-slate-700 text-white" : "text-slate-400"
          }`}
        >
          <Brush size={16} />
          Design
        </button>

        {/* AI BACKGROUND TAB */}
        <button
          onClick={() => setTab("backgrounds")}
          className={`p-3 flex flex-col items-center text-xs ${
            tab === "backgrounds" ? "bg-slate-700 text-white" : "text-slate-400"
          }`}
        >
          <ImageIcon size={16} />
          AI BG
        </button>

        {/* BRANDING TAB */}
        <button
          onClick={() => setTab("branding")}
          className={`p-3 flex flex-col items-center text-xs ${
            tab === "branding" ? "bg-slate-700 text-white" : "text-slate-400"
          }`}
        >
          <Settings size={16} />
          Branding
        </button>

        {/* ASSETS TAB */}
        <button
          onClick={() => setTab("assets")}
          className={`p-3 flex flex-col items-center text-xs ${
            tab === "assets" ? "bg-slate-700 text-white" : "text-slate-400"
          }`}
        >
          <Layers size={16} />
          Assets
        </button>
      </div>

      {/* ---------------- PANEL CONTENT ---------------- */}
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          {/* DESIGN PANEL */}
          {tab === "design" && (
            <motion.div
              key="design"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DesignPanel />
            </motion.div>
          )}

          {/* AI BACKGROUND PANEL */}
          {tab === "backgrounds" && (
            <motion.div
              key="backgrounds"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AIBackgroundPanel />
            </motion.div>
          )}

          {/* BRANDING PANEL */}
          {tab === "branding" && (
            <motion.div
              key="branding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <BrandingPanel />
            </motion.div>
          )}

          {/* ASSETS PANEL */}
          {tab === "assets" && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AssetsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
