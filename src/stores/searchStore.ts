import { zustandMMKVStorage } from "@/lib/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Station {
  crs: string;
  name: string;
}

interface SearchState {
  fromStation: Station | null;
  toStation: Station | null;
  when: string | null; // ISO string or null for "now"
  recentSearches: Array<{
    from: Station;
    to: Station;
    timestamp: number;
  }>;

  // Actions
  setFromStation: (station: Station | null) => void;
  setToStation: (station: Station | null) => void;
  setWhen: (when: string | null) => void;
  addRecentSearch: (from: Station, to: Station) => void;
  removeRecentSearch: (from: Station, to: Station) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      fromStation: null,
      toStation: null,
      when: null,
      recentSearches: [],

      setFromStation: (station) => set({ fromStation: station }),
      setToStation: (station) => set({ toStation: station }),
      setWhen: (when) => set({ when }),

      addRecentSearch: (from, to) => {
        const current = get().recentSearches;
        const filtered = current.filter(
          (s) => !(s.from.crs === from.crs && s.to.crs === to.crs)
        );
        const updated = [
          { from, to, timestamp: Date.now() },
          ...filtered,
        ].slice(0, 10); // Keep last 10 searches
        set({ recentSearches: updated });
      },

      removeRecentSearch: (from, to) => {
        const current = get().recentSearches;
        const filtered = current.filter(
          (s) => !(s.from.crs === from.crs && s.to.crs === to.crs)
        );
        set({ recentSearches: filtered });
      },

      clearSearch: () =>
        set({ fromStation: null, toStation: null, when: null }),
    }),
    {
      name: "search-storage",
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
