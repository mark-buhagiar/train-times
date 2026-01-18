/**
 * Station Timetable API service
 * Fetches train departures from a station
 */

import { ServiceSummary, StationTimetable } from "@/types/services";
import { apiRequest } from "./client";
import { buildApiUrl, config } from "./config";

export interface StationTimetableParams {
  /** Station CRS code */
  stationCrs: string;
  /** Optional destination CRS code to filter services */
  callingAt?: string;
  /** Base datetime for the query (ISO string or Date). Defaults to now. */
  datetime?: string | Date;
  /** Time offset before datetime (e.g., "PT00:30:00" for 30 mins before) */
  fromOffset?: string;
  /** Time offset after datetime (e.g., "PT01:30:00" for 1h30m after) */
  toOffset?: string;
  /** Maximum number of services to return */
  limit?: number;
}

interface ApiStationTimetableResponse {
  date: string;
  time_of_day: string;
  request_time: string;
  station_name: string;
  station_code: string;
  departures: {
    all: ApiServiceDeparture[];
  };
}

interface ApiServiceDeparture {
  mode: string;
  service: string;
  train_uid: string;
  platform?: string;
  operator: string;
  operator_name: string;
  aimed_departure_time: string;
  aimed_arrival_time?: string;
  aimed_pass_time?: string;
  origin_name: string;
  destination_name: string;
  source: string;
  category: string;
  service_timetable?: {
    id: string;
  };
  status?: string;
  expected_departure_time?: string;
  expected_arrival_time?: string;
  best_departure_estimate_mins?: number;
  best_arrival_estimate_mins?: number;
}

/**
 * Calculate time offset string from a Date
 * @param targetTime - The target time
 * @param baseTime - The base time to calculate offset from (defaults to now)
 * @returns Offset string in PT format (e.g., "PT01:30:00" or "-PT00:30:00")
 */
export function calculateTimeOffset(
  targetTime: Date,
  baseTime: Date = new Date()
): string {
  const diffMs = targetTime.getTime() - baseTime.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));

  const isNegative = diffMins < 0;
  const absMins = Math.abs(diffMins);

  const hours = Math.floor(absMins / 60);
  const mins = absMins % 60;

  const timeStr = `PT${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
  return isNegative ? `-${timeStr}` : timeStr;
}

/**
 * Map API status to our normalized status
 */
function normalizeStatus(
  status?: string,
  aimed?: string,
  expected?: string
): ServiceSummary["status"] {
  if (!status) {
    // Infer from times if no explicit status
    if (aimed && expected && expected !== aimed) {
      return "LATE";
    }
    return "ON TIME";
  }

  const upperStatus = status.toUpperCase();
  if (upperStatus.includes("CANCEL")) return "CANCELLED";
  if (upperStatus.includes("LATE") || upperStatus.includes("DELAY"))
    return "LATE";
  if (upperStatus.includes("EARLY")) return "EARLY";
  if (upperStatus.includes("ON TIME")) return "ON TIME";

  return status;
}

/**
 * Fetch station timetable (departures)
 */
export async function fetchStationTimetable(
  params: StationTimetableParams
): Promise<StationTimetable> {
  const {
    stationCrs,
    callingAt,
    datetime,
    fromOffset = "PT00:30:00",
    toOffset = "PT01:30:00",
    limit = 25,
  } = params;

  const queryParams: Record<string, string> = {
    from_offset: fromOffset,
    to_offset: toOffset,
    limit: limit.toString(),
    live: "true",
    train_status: "passenger",
    station_detail: "destination,origin,calling_at",
    type: "departure",
  };

  // Add datetime if specified (format: YYYY-MM-DDTHH:MM:SS+HH:MM)
  if (datetime) {
    const dt = datetime instanceof Date ? datetime : new Date(datetime);
    // Format with timezone offset (e.g., "2026-01-18T14:30:00+00:00")
    const tzOffset = -dt.getTimezoneOffset();
    const tzSign = tzOffset >= 0 ? "+" : "-";
    const tzHours = Math.floor(Math.abs(tzOffset) / 60)
      .toString()
      .padStart(2, "0");
    const tzMins = (Math.abs(tzOffset) % 60).toString().padStart(2, "0");
    const isoStr = dt.toISOString().slice(0, 19) + `${tzSign}${tzHours}:${tzMins}`;
    queryParams.datetime = isoStr;
  }

  if (callingAt) {
    queryParams.calling_at = callingAt;
  }

  const url = buildApiUrl(
    config.endpoints.stationTimetable(stationCrs),
    queryParams
  );

  const response = await apiRequest<ApiStationTimetableResponse>(url);

  // Transform API response to our types
  const services: ServiceSummary[] = response.departures.all.map((dep) => ({
    service: dep.service,
    train_uid: dep.train_uid,
    platform: dep.platform,
    aimed_departure_time: dep.aimed_departure_time,
    expected_departure_time: dep.expected_departure_time,
    destination_name: dep.destination_name,
    status: normalizeStatus(
      dep.status,
      dep.aimed_departure_time,
      dep.expected_departure_time
    ),
    operator_name: dep.operator_name,
  }));

  return {
    station_code: response.station_code,
    station_name: response.station_name,
    departures: {
      all: services,
    },
  };
}
