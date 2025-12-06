"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Brush,
  ImageIcon,
  Settings,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { BackgroundControls } from "./panels/BackgroundControls";
import { TextControls } from "./panels/TextControls";
import { BrandControls } from "./panels/BrandControls";
import { LayoutControls } from "./panels/LayoutControls";
import { ComplianceSummary } from "./panels/ComplianceSummary";

export function RightSidebar({ selectedPanel }: { selectedPanel: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedPanel}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-80 h-full bg-slate-900 border-l border-slate-800 p-4 flex flex-col gap-4"
      >
        {selectedPanel === "background" && <BackgroundControls fullPanel />}
        {selectedPanel === "text" && <TextControls />}
        {selectedPanel === "brand" && <BrandControls />}
        {selectedPanel === "layout" && <LayoutControls />}
        {selectedPanel === "compliance" && <ComplianceSummary />}
      </motion.div>
    </AnimatePresence>
  );
}

export function RightSidebarTabs({
  selectedPanel,
  setPanel,
}: {
  selectedPanel: string;
  setPanel: (v: string) => void;
}) {
  const buttons = [
    { id: "background", icon: ImageIcon, label: "Background" },
    { id: "text", icon: Brush, label: "Text" },
    { id: "brand", icon: Settings, label: "Brand" },
    { id: "layout", icon: LayoutDashboard, label: "Layout" },
    { id: "compliance", icon: ShieldCheck, label: "Compliance" },
  ];

  return (
    <div className="flex flex-col gap-2 bg-slate-950 border-r border-slate-800 p-3 w-16">
      {buttons.map((b) => (
        <button
          key={b.id}
          onClick={() => setPanel(b.id)}
          className={`flex flex-col items-center gap-1 py-3 rounded-xl
          ${
            selectedPanel === b.id
              ? "bg-violet-600 text-white"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          <b.icon size={20} />
          <span className="text-[10px]">{b.label}</span>
        </button>
      ))}
    </div>
  );
}
