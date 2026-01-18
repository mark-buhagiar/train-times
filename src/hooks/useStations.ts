/**
 * Custom hooks for stations data
 */

import { fetchStations, searchStations } from "@/lib/api/stations";
import { Station } from "@/types/stations";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const STATIONS_QUERY_KEY = ["stations"];

/**
 * Hook to fetch and cache all UK train stations
 * Uses TanStack Query for caching - data is fetched once and cached for 24 hours
 */
export function useStations() {
  return useQuery({
    queryKey: STATIONS_QUERY_KEY,
    queryFn: fetchStations,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - station data rarely changes
    gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in cache for 7 days
  });
}

/**
 * Hook to search stations with a query
 * @param query - Search string
 * @param limit - Maximum results to return
 */
export function useStationSearch(query: string, limit = 10) {
  const { data: stations = [], isLoading, error } = useStations();

  const results = useMemo(() => {
    if (!stations.length) return [];
    return searchStations(stations, query, limit);
  }, [stations, query, limit]);

  return {
    results,
    isLoading,
    error,
  };
}

/**
 * Hook to get a station by CRS code
 */
export function useStationByCrs(crs: string): Station | undefined {
  const { data: stations = [] } = useStations();

  return useMemo(() => {
    if (!crs) return undefined;
    return stations.find((s) => s.crs.toLowerCase() === crs.toLowerCase());
  }, [stations, crs]);
}
