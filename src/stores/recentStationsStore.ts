/**
 * Store for recent station selections
 * Persisted with MMKV for quick access to frequently used stations
 */

import { zustandMMKVStorage } from "@/lib/storage";
import { Station } from "@/types/stations";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MAX_RECENT_STATIONS = 5;

interface RecentStationsState {
  recentStations: Station[];

  // Actions
  addRecentStation: (station: Station) => void;
  clearRecentStations: () => void;
}

export const useRecentStationsStore = create<RecentStationsState>()(
  persist(
    (set, get) => ({
      recentStations: [],

      addRecentStation: (station) => {
        const current = get().recentStations;
        // Remove if already exists
        const filtered = current.filter((s) => s.crs !== station.crs);
        // Add to front, limit to max
        const updated = [station, ...filtered].slice(0, MAX_RECENT_STATIONS);
        set({ recentStations: updated });
      },

      clearRecentStations: () => set({ recentStations: [] }),
    }),
    {
      name: "recent-stations-storage",
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);
