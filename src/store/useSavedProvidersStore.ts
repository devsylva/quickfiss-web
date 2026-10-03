"use client";

import { create } from "zustand";
import { artisansApi } from "@/lib/api/artisans";

interface SavedState {
  ids: Set<number>;
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (id: number) => Promise<void>;
}

/** Which providers the signed-in customer has bookmarked (shared by every heart button). */
export const useSavedProvidersStore = create<SavedState>((set, get) => ({
  ids: new Set(),
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    set({ loaded: true });
    try {
      const { ids } = await artisansApi.saved();
      set({ ids: new Set(ids) });
    } catch {
      set({ loaded: false }); // not signed in yet; try again next time
    }
  },

  toggle: async (id) => {
    const wasSaved = get().ids.has(id);
    const apply = (saved: boolean) =>
      set((s) => {
        const next = new Set(s.ids);
        if (saved) next.add(id);
        else next.delete(id);
        return { ids: next };
      });
    apply(!wasSaved);
    try {
      if (wasSaved) await artisansApi.unsave(id);
      else await artisansApi.save(id);
    } catch {
      apply(wasSaved);
    }
  },
}));
