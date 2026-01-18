/**
 * Hook for fetching service timetable data (individual train service details)
 */

import { fetchServiceTimetable, ServiceTimetableParams } from "@/lib/api";
import { ServiceDetail } from "@/types/services";
import { useQuery } from "@tanstack/react-query";

interface UseServiceTimetableOptions {
  /** Service ID from the station timetable */
  serviceId: string;
  /** Optional date for the service */
  date?: Date;
  /** Whether to enable the query */
  enabled?: boolean;
}

export function useServiceTimetable({
  serviceId,
  date,
  enabled = true,
}: UseServiceTimetableOptions) {
  const queryKey = ["serviceTimetable", serviceId, date?.toISOString()];

  return useQuery<ServiceDetail, Error>({
    queryKey,
    queryFn: async () => {
      const params: ServiceTimetableParams = {
        serviceId,
        date,
      };

      return fetchServiceTimetable(params);
    },
    enabled: enabled && !!serviceId,
    staleTime: 1000 * 30, // 30 seconds - service data changes more frequently
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for live data
  });
}
