/**
 * Service types based on Transport API responses
 */

export interface ServiceStop {
  station_code: string;
  tiploc_code?: string;
  station_name: string;
  stop_type?: "LO" | "LI" | "LT" | string; // LO=origin, LI=intermediate, LT=terminus
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
  request_time: string;
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
  stops: ServiceStop[];
}

export interface StationTimetable {
  station_code: string;
  station_name: string;
  departures: {
    all: ServiceSummary[];
  };
}

export type ServiceStatus = "on-time" | "delayed" | "cancelled" | "early";
