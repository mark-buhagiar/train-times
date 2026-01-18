/**
 * Stations API service
 * Fetches UK train station data from crs.codes
 * Uses bundled data on web to avoid CORS issues
 */

import { Station } from "@/types/stations";
import { Platform } from "react-native";
import { apiRequest } from "./client";

// Bundled station data for web (avoids CORS issues)
import stationsData from "./stations-data.json";

const STATIONS_URL = "https://crs.codes/data/stations.json";

interface CrsStationData {
  name: string;
  crs: string;
  [key: string]: unknown;
}

/**
 * Fetch all UK train stations
 * Uses bundled data on web, fetches from API on native
 * @returns Array of stations with name and CRS code
 */
export async function fetchStations(): Promise<Station[]> {
  // On web, use bundled data to avoid CORS issues
  if (Platform.OS === "web") {
    return (stationsData as CrsStationData[])
      .filter((station) => station.crs && station.name) // Filter out stations with null values
      .map((station) => ({
        crs: station.crs,
        name: station.name,
      }));
  }

  // On native, fetch from API (no CORS restrictions)
  const data = await apiRequest<CrsStationData[]>(STATIONS_URL);

  return data
    .filter((station) => station.crs && station.name) // Filter out stations with null values
    .map((station) => ({
      crs: station.crs,
      name: station.name,
    }));
}

/**
 * Search stations by name or CRS code
 * @param stations - List of all stations
 * @param query - Search query (partial name or CRS code)
 * @param limit - Maximum results to return
 */
export function searchStations(
  stations: Station[],
  query: string,
  limit = 10
): Station[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();

  // Exact CRS match first
  const exactCrsMatch = stations.find(
    (s) => s.crs.toLowerCase() === normalizedQuery
  );

  // Filter by name or CRS containing the query
  const matches = stations.filter((s) => {
    const nameMatch = s.name.toLowerCase().includes(normalizedQuery);
    const crsMatch = s.crs.toLowerCase().includes(normalizedQuery);
    return nameMatch || crsMatch;
  });

  // Sort by relevance: exact CRS match, starts with query, then contains
  const sorted = matches.sort((a, b) => {
    const aNameLower = a.name.toLowerCase();
    const bNameLower = b.name.toLowerCase();
    const aCrsLower = a.crs.toLowerCase();
    const bCrsLower = b.crs.toLowerCase();

    // Exact CRS match first
    if (aCrsLower === normalizedQuery) return -1;
    if (bCrsLower === normalizedQuery) return 1;

    // CRS starts with query
    if (
      aCrsLower.startsWith(normalizedQuery) &&
      !bCrsLower.startsWith(normalizedQuery)
    )
      return -1;
    if (
      bCrsLower.startsWith(normalizedQuery) &&
      !aCrsLower.startsWith(normalizedQuery)
    )
      return 1;

    // Name starts with query
    if (
      aNameLower.startsWith(normalizedQuery) &&
      !bNameLower.startsWith(normalizedQuery)
    )
      return -1;
    if (
      bNameLower.startsWith(normalizedQuery) &&
      !aNameLower.startsWith(normalizedQuery)
    )
      return 1;

    // Alphabetical
    return a.name.localeCompare(b.name);
  });

  return sorted.slice(0, limit);
}
