import { create } from "zustand";
import type { BrandProfile, CreativeLayout } from "@/lib/types";

type StudioState = {
  // BRAND PROFILE
  brandProfile: BrandProfile | null;
  setBrandProfile: (bp: BrandProfile) => void;

  // LAYOUTS
  layouts: CreativeLayout[];
  setLayouts: (layouts: CreativeLayout[]) => void;

  // SELECTED LAYOUT
  selectedLayoutId: string | null;
  setSelectedLayoutId: (id: string) => void;

  // UPDATE SINGLE LAYOUT
  updateLayout: (
    id: string,
    fn: (layout: CreativeLayout) => CreativeLayout
  ) => void;

  // RESET
  reset: () => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  /** -----------------------------
   * BRAND PROFILE
   ------------------------------ */
  brandProfile: null,
  setBrandProfile: (bp) => set({ brandProfile: bp }),

  /** -----------------------------
   * LAYOUTS (multiple sizes)
   ------------------------------ */
  layouts: [],
  setLayouts: (layouts) => set({ layouts }),

  /** -----------------------------
   * SELECTED LAYOUT ID
   ------------------------------ */
  selectedLayoutId: null,
  setSelectedLayoutId: (id) => set({ selectedLayoutId: id }),

  /** -----------------------------
   * UPDATE ONE LAYOUT CLEANLY
   ------------------------------ */
  updateLayout: (id, fn) =>
    set((state) => ({
      layouts: state.layouts.map((layout) =>
        layout.id === id ? fn(layout) : layout
      ),
    })),

  /** -----------------------------
   * RESET STUDIO
   ------------------------------ */
  reset: () =>
    set({
      brandProfile: null,
      layouts: [],
      selectedLayoutId: null,
    }),
}));
