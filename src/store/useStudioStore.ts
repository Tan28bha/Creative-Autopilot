import { create } from "zustand";
import type { BrandProfile, CreativeLayout } from "@/lib/types";

type StudioState = {
  brandProfile?: BrandProfile;
  setBrandProfile: (bp: BrandProfile) => void;

  layouts: CreativeLayout[];
  setLayouts: (layouts: CreativeLayout[]) => void;
  updateLayout: (id: string, updater: (l: CreativeLayout) => CreativeLayout) => void;

  selectedLayoutId?: string;
  setSelectedLayoutId: (id: string) => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  brandProfile: undefined,
  setBrandProfile: (bp) => set({ brandProfile: bp }),

  layouts: [],
  setLayouts: (layouts) => set({ layouts }),

  updateLayout: (id, updater) =>
    set((state) => ({
      layouts: state.layouts.map((l) => (l.id === id ? updater(l) : l)),
    })),

  selectedLayoutId: undefined,
  setSelectedLayoutId: (id) => set({ selectedLayoutId: id }),
}));
