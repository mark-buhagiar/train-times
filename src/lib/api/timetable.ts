/**
 * Station & Service Timetable API services
 * Fetches train departures from a station and individual service details
 */

import {
  ServiceDetail,
  ServiceStop,
  ServiceSummary,
  StationTimetable,
} from "@/types/services";
import { apiRequest } from "./client";
import { buildApiUrl, config } from "./config";
import mockServiceData from "./mock-service.json";
import mockTimetableData from "./mock-timetable.json";

// Check if mock mode is enabled via env var
const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === "true";

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
  // API may return departures or updates depending on the endpoint
  departures?: {
    all: ApiServiceDeparture[];
  };
  updates?: {
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
 * Transform API response to our types
 */
function transformApiResponse(
  response: ApiStationTimetableResponse
): StationTimetable {
  // API may return departures or updates depending on endpoint
  const departures = response.departures?.all || response.updates?.all || [];

  const services: ServiceSummary[] = departures.map((dep) => ({
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

/**
 * Fetch station timetable (departures)
 */
export async function fetchStationTimetable(
  params: StationTimetableParams
): Promise<StationTimetable> {
  // Return mock data if mock mode is enabled
  if (USE_MOCK_API) {
    console.log("[API] Using mock timetable data");
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return transformApiResponse(
      mockTimetableData as unknown as ApiStationTimetableResponse
    );
  }

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
    const isoStr =
      dt.toISOString().slice(0, 19) + `${tzSign}${tzHours}:${tzMins}`;
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

  return transformApiResponse(response);
}

// ============================================================
// Service Timetable (individual service details with stops)
// ============================================================

interface ApiServiceTimetableResponse {
  request_time: string;
  service: string;
  train_uid: string;
  headcode?: string;
  train_status?: string;
  mode: string;
  category?: string;
  operator?: string;
  operator_name?: string;
  origin_name: string;
  destination_name: string;
  stop_of_interest?: string;
  toc?: {
    atoc_code: string;
  };
  stops: Array<{
    station_code: string;
    tiploc_code?: string;
    station_name: string;
    stop_type?: string;
    platform?: string;
    status?: string;
    aimed_departure_date?: string;
    aimed_departure_time?: string;
    expected_departure_date?: string;
    expected_departure_time?: string;
    aimed_arrival_date?: string;
    aimed_arrival_time?: string;
    expected_arrival_date?: string;
    expected_arrival_time?: string;
    aimed_pass_date?: string;
    aimed_pass_time?: string;
    expected_pass_date?: string;
    expected_pass_time?: string;
  }>;
}

/**
 * Transform API service response to our types
 */
function transformServiceResponse(
  response: ApiServiceTimetableResponse
): ServiceDetail {
  const stops: ServiceStop[] = response.stops.map((stop) => ({
    station_code: stop.station_code,
    tiploc_code: stop.tiploc_code,
    station_name: stop.station_name,
    stop_type: stop.stop_type,
    platform: stop.platform,
    status: stop.status,
    aimed_departure_date: stop.aimed_departure_date,
    aimed_departure_time: stop.aimed_departure_time,
    expected_departure_date: stop.expected_departure_date,
    expected_departure_time: stop.expected_departure_time,
    aimed_arrival_date: stop.aimed_arrival_date,
    aimed_arrival_time: stop.aimed_arrival_time,
    expected_arrival_date: stop.expected_arrival_date,
    expected_arrival_time: stop.expected_arrival_time,
    aimed_pass_date: stop.aimed_pass_date,
    aimed_pass_time: stop.aimed_pass_time,
    expected_pass_date: stop.expected_pass_date,
    expected_pass_time: stop.expected_pass_time,
  }));

  return {
    service: response.service,
    train_uid: response.train_uid,
    headcode: response.headcode,
    request_time: response.request_time,
    mode: response.mode,
    category: response.category,
    operator: response.operator,
    operator_name: response.operator_name,
    origin_name: response.origin_name,
    destination_name: response.destination_name,
    stop_of_interest: response.stop_of_interest,
    toc: response.toc,
    stops,
  };
}

export interface ServiceTimetableParams {
  /** Service ID from the timetable */
  serviceId: string;
  /** Optional date for the service (defaults to today) */
  date?: Date;
}

/**
 * Fetch service timetable (detailed service with all stops)
 */
export async function fetchServiceTimetable(
  params: ServiceTimetableParams
): Promise<ServiceDetail> {
  // Return mock data if mock mode is enabled
  if (USE_MOCK_API) {
    console.log("[API] Using mock service data");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return transformServiceResponse(
      mockServiceData as unknown as ApiServiceTimetableResponse
    );
  }

  const { serviceId, date } = params;

  const queryParams: Record<string, string> = {
    live: "true",
  };

  // Add date if specified
  if (date) {
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
    queryParams.date = dateStr;
  }

  const url = buildApiUrl(
    config.endpoints.serviceTimetable(serviceId),
    queryParams
  );

  const response = await apiRequest<ApiServiceTimetableResponse>(url);

  return transformServiceResponse(response);
}
