import { zustandMMKVStorage } from "@/lib/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface FavouriteService {
  id: string;
  templateUrl: string; // URL with {DATE} placeholder
  fromStation: {
    crs: string;
    name: string;
  };
  toStation: {
    crs: string;
    name: string;
  };
  scheduledDeparture: string; // Time like "18:35"
  addedAt: number; // Timestamp
}

interface FavouritesState {
  services: FavouriteService[];

  // Actions
  addService: (service: Omit<FavouriteService, "id" | "addedAt">) => void;
  removeService: (id: string) => void;
  isServiceFavourited: (templateUrl: string) => boolean;
  getServiceUrl: (service: FavouriteService, date?: Date) => string;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      services: [],

      addService: (service) => {
        const id = `${service.fromStation.crs}-${service.toStation.crs}-${service.scheduledDeparture}-${Date.now()}`;
        set((state) => ({
          services: [
            ...state.services,
            { ...service, id, addedAt: Date.now() },
          ],
        }));
      },

      removeService: (id) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        }));
      },

      isServiceFavourited: (templateUrl) => {
        return get().services.some((s) => s.templateUrl === templateUrl);
      },

      getServiceUrl: (service, date = new Date()) => {
        const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD
        return service.templateUrl.replace("{DATE}", dateString);
      },
    }),
    {
      name: "favourites-storage",
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);
