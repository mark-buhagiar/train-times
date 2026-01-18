/**
 * Service types based on Transport API responses
 */

export interface ServiceStop {
  station_code: string;
  station_name: string;
  platform?: string;
  aimed_departure_time?: string;
  expected_departure_time?: string;
  aimed_arrival_time?: string;
  expected_arrival_time?: string;
}

export interface ServiceSummary {
  service: string;
  train_uid: string;
  platform?: string;
  aimed_departure_time: string;
  expected_departure_time?: string;
  destination_name: string;
  status: "ON TIME" | "LATE" | "CANCELLED" | "EARLY" | string;
  operator_name?: string;
}

export interface ServiceDetail {
  service: string;
  train_uid: string;
  headcode?: string;
  toc?: {
    atoc_code: string;
    name: string;
  };
  stops: ServiceStop[];
}

export interface StationTimetable {
  station_code: string;
  station_name: string;
  departures: {
    all: ServiceSummary[];
  };
}

export type ServiceStatus = "on-time" | "delayed" | "cancelled";
