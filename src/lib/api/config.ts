/**
 * API configuration and endpoints
 */

const TRANSPORT_API_BASE = "https://transportapi.com/v3/uk/train";
const STATIONS_API_BASE = "https://crs.codes/data";

export const config = {
  api: {
    appId: process.env.EXPO_PUBLIC_TRANSPORT_API_APP_ID ?? "",
    appKey: process.env.EXPO_PUBLIC_TRANSPORT_API_APP_KEY ?? "",
  },
  endpoints: {
    stations: `${STATIONS_API_BASE}/stations.json`,
    stationTimetable: (crs: string) =>
      `${TRANSPORT_API_BASE}/station_timetables/${crs}.json`,
    serviceTimetable: (serviceId: string) =>
      `${TRANSPORT_API_BASE}/service_timetables/${serviceId}.json`,
  },
};

/**
 * Build URL with API credentials
 */
export function buildApiUrl(
  endpoint: string,
  params: Record<string, string> = {}
): string {
  const url = new URL(endpoint);

  // Add API credentials
  url.searchParams.set("app_id", config.api.appId);
  url.searchParams.set("app_key", config.api.appKey);

  // Add additional params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}
