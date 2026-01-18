import { zustandMMKVStorage } from "@/lib/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Station {
  crs: string;
  name: string;
}

interface SettingsState {
  favouriteStations: Station[];

  // Actions
  addFavouriteStation: (station: Station) => void;
  removeFavouriteStation: (crs: string) => void;
  isFavouriteStation: (crs: string) => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      favouriteStations: [],

      addFavouriteStation: (station) => {
        const current = get().favouriteStations;
        if (!current.some((s) => s.crs === station.crs)) {
          set({ favouriteStations: [...current, station] });
        }
      },

      removeFavouriteStation: (crs) => {
        set((state) => ({
          favouriteStations: state.favouriteStations.filter(
            (s) => s.crs !== crs
          ),
        }));
      },

      isFavouriteStation: (crs) => {
        return get().favouriteStations.some((s) => s.crs === crs);
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);
