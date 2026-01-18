/**
 * Hook for fetching station timetable data
 */

import { fetchStationTimetable, StationTimetableParams } from "@/lib/api";
import { StationTimetable } from "@/types/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UseStationTimetableOptions {
  /** Origin station CRS code */
  from: string;
  /** Destination station CRS code (optional filter) */
  to?: string;
  /** Selected time as ISO string, or null for "now" */
  when?: string | null;
  /** Whether to enable the query */
  enabled?: boolean;
}

export function useStationTimetable({
  from,
  to,
  when,
  enabled = true,
}: UseStationTimetableOptions) {
  // Use selected time or current time
  const datetime = when ? new Date(when) : new Date();

  const queryKey = ["stationTimetable", from, to, datetime.toISOString()];

  return useQuery<StationTimetable, Error>({
    queryKey,
    queryFn: async () => {
      const params: StationTimetableParams = {
        stationCrs: from,
        callingAt: to,
        datetime,
        // Fixed offsets: 30 mins before to 1h30m after the selected time
        fromOffset: "PT00:30:00",
        toOffset: "PT01:30:00",
        limit: 25,
      };

      return fetchStationTimetable(params);
    },
    enabled: enabled && !!from,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60, // Refetch every minute for live data
  });
}

/**
 * Hook to manually refetch timetable data
 */
export function useRefreshTimetable() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["stationTimetable"] });
  };
}
