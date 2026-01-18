import { zustandMMKVStorage } from "@/lib/storage";
import { Station } from "@/types/stations";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Types
export interface SavedLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface RecommendationRule {
  id: string;
  locationId?: string; // Reference to SavedLocation
  location?: SavedLocation; // Embedded for convenience
  timeStart?: string; // HH:mm format
  timeEnd?: string; // HH:mm format
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
}

export interface SavedJourney {
  id: string;
  fromStation: Station;
  toStation: Station;
  rules: RecommendationRule[];
  lastUsedAt: number;
  createdAt: number;
}

// Helper to generate unique IDs
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Check if a time is within a time window
const isTimeInWindow = (
  currentTime: string, // HH:mm
  startTime?: string,
  endTime?: string
): boolean => {
  if (!startTime || !endTime) return true; // No time restriction

  const [currentHour, currentMin] = currentTime.split(":").map(Number);
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const currentMinutes = currentHour * 60 + currentMin;
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Handle overnight windows (e.g., 22:00 - 06:00)
  if (endMinutes < startMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

// Check if current day matches rule
const isDayMatch = (daysOfWeek?: number[]): boolean => {
  if (!daysOfWeek || daysOfWeek.length === 0) return true; // No day restriction
  const today = new Date().getDay(); // 0=Sun, 1=Mon, etc.
  return daysOfWeek.includes(today);
};

// Calculate distance between two coordinates in meters (Haversine formula)
const getDistanceMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Check if user is within location radius
const isLocationMatch = (
  userLat: number | null,
  userLon: number | null,
  location?: SavedLocation
): boolean => {
  if (!location) return true; // No location restriction
  if (userLat === null || userLon === null) return false; // Can't match without user location

  const distance = getDistanceMeters(
    userLat,
    userLon,
    location.latitude,
    location.longitude
  );
  return distance <= location.radiusMeters;
};

interface JourneysState {
  journeys: SavedJourney[];
  savedLocations: SavedLocation[];

  // Journey actions
  addJourney: (fromStation: Station, toStation: Station) => SavedJourney;
  removeJourney: (id: string) => void;
  updateJourneyLastUsed: (id: string) => void;
  getJourney: (id: string) => SavedJourney | undefined;
  hasJourney: (fromCrs: string, toCrs: string) => boolean;

  // Rule actions
  addRule: (journeyId: string, rule: Omit<RecommendationRule, "id">) => void;
  updateRule: (
    journeyId: string,
    ruleId: string,
    updates: Partial<RecommendationRule>
  ) => void;
  removeRule: (journeyId: string, ruleId: string) => void;

  // Location actions
  addLocation: (location: Omit<SavedLocation, "id">) => SavedLocation;
  updateLocation: (id: string, updates: Partial<SavedLocation>) => void;
  removeLocation: (id: string) => void;

  // Matching
  getRecommendedJourneys: (
    userLat: number | null,
    userLon: number | null,
    currentTime?: string // HH:mm, defaults to now
  ) => SavedJourney[];
}

export const useJourneysStore = create<JourneysState>()(
  persist(
    (set, get) => ({
      journeys: [],
      savedLocations: [],

      // Journey actions
      addJourney: (fromStation, toStation) => {
        const newJourney: SavedJourney = {
          id: generateId(),
          fromStation,
          toStation,
          rules: [],
          lastUsedAt: Date.now(),
          createdAt: Date.now(),
        };
        set((state) => ({
          journeys: [newJourney, ...state.journeys],
        }));
        return newJourney;
      },

      removeJourney: (id) => {
        set((state) => ({
          journeys: state.journeys.filter((j) => j.id !== id),
        }));
      },

      updateJourneyLastUsed: (id) => {
        set((state) => ({
          journeys: state.journeys.map((j) =>
            j.id === id ? { ...j, lastUsedAt: Date.now() } : j
          ),
        }));
      },

      getJourney: (id) => {
        return get().journeys.find((j) => j.id === id);
      },

      hasJourney: (fromCrs, toCrs) => {
        return get().journeys.some(
          (j) => j.fromStation.crs === fromCrs && j.toStation.crs === toCrs
        );
      },

      // Rule actions
      addRule: (journeyId, rule) => {
        const newRule: RecommendationRule = {
          ...rule,
          id: generateId(),
        };
        set((state) => ({
          journeys: state.journeys.map((j) =>
            j.id === journeyId ? { ...j, rules: [...j.rules, newRule] } : j
          ),
        }));
      },

      updateRule: (journeyId, ruleId, updates) => {
        set((state) => ({
          journeys: state.journeys.map((j) =>
            j.id === journeyId
              ? {
                  ...j,
                  rules: j.rules.map((r) =>
                    r.id === ruleId ? { ...r, ...updates } : r
                  ),
                }
              : j
          ),
        }));
      },

      removeRule: (journeyId, ruleId) => {
        set((state) => ({
          journeys: state.journeys.map((j) =>
            j.id === journeyId
              ? { ...j, rules: j.rules.filter((r) => r.id !== ruleId) }
              : j
          ),
        }));
      },

      // Location actions
      addLocation: (location) => {
        const newLocation: SavedLocation = {
          ...location,
          id: generateId(),
        };
        set((state) => ({
          savedLocations: [...state.savedLocations, newLocation],
        }));
        return newLocation;
      },

      updateLocation: (id, updates) => {
        set((state) => ({
          savedLocations: state.savedLocations.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        }));
      },

      removeLocation: (id) => {
        set((state) => ({
          savedLocations: state.savedLocations.filter((l) => l.id !== id),
        }));
      },

      // Get journeys that match current context
      getRecommendedJourneys: (userLat, userLon, currentTime) => {
        const now = new Date();
        const time =
          currentTime ||
          `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

        const { journeys } = get();

        // Filter journeys that have at least one matching rule
        const matching = journeys.filter((journey) => {
          // If no rules, don't recommend (user needs to set up rules)
          if (journey.rules.length === 0) return false;

          // Check if any rule matches
          return journey.rules.some((rule) => {
            const timeMatch = isTimeInWindow(
              time,
              rule.timeStart,
              rule.timeEnd
            );
            const dayMatch = isDayMatch(rule.daysOfWeek);
            const locationMatch = isLocationMatch(
              userLat,
              userLon,
              rule.location
            );

            // All conditions must match (conditions that aren't set are automatically true)
            return timeMatch && dayMatch && locationMatch;
          });
        });

        // Sort by most recently used
        return matching.sort((a, b) => b.lastUsedAt - a.lastUsedAt);
      },
    }),
    {
      name: "journeys-storage",
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);
