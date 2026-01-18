import { http, HttpResponse } from "msw";

// Sample station data for tests
const mockStations = [
  { crs: "CHX", name: "London Charing Cross" },
  { crs: "KDB", name: "Kidbrooke" },
  { crs: "ELT", name: "Eltham" },
  { crs: "DFD", name: "Dartford" },
  { crs: "WAE", name: "London Waterloo East" },
];

// Sample service data for tests
const mockService = {
  service: "P73390:2026-01-19",
  train_uid: "P73390",
  headcode: "2K46",
  toc: {
    atoc_code: "SE",
    name: "Southeastern",
  },
  stops: [
    {
      station_code: "CHX",
      station_name: "London Charing Cross",
      platform: "3",
      aimed_departure_time: "18:35",
      expected_departure_time: "18:35",
    },
    {
      station_code: "WAE",
      station_name: "London Waterloo East",
      platform: "2",
      aimed_departure_time: "18:38",
      expected_departure_time: "18:38",
    },
    {
      station_code: "KDB",
      station_name: "Kidbrooke",
      platform: "1",
      aimed_departure_time: "18:55",
      expected_departure_time: "18:55",
    },
  ],
};

// Sample station timetable data
const mockTimetable = {
  station_code: "CHX",
  station_name: "London Charing Cross",
  departures: {
    all: [
      {
        service: "P73390:2026-01-19",
        train_uid: "P73390",
        platform: "3",
        aimed_departure_time: "18:35",
        expected_departure_time: "18:35",
        destination_name: "Dartford",
        status: "ON TIME",
      },
      {
        service: "P73391:2026-01-19",
        train_uid: "P73391",
        platform: "5",
        aimed_departure_time: "18:45",
        expected_departure_time: "18:47",
        destination_name: "Sevenoaks",
        status: "LATE",
      },
    ],
  },
};

export const handlers = [
  // Stations list
  http.get("https://crs.codes/data/stations.json", () => {
    return HttpResponse.json(mockStations);
  }),

  // Station timetable
  http.get(
    "https://transportapi.com/v3/uk/train/station_timetables/:crs.json",
    ({ params }) => {
      return HttpResponse.json({
        ...mockTimetable,
        station_code: params.crs,
      });
    }
  ),

  // Service timetable
  http.get(
    "https://transportapi.com/v3/uk/train/service_timetables/:service.json",
    () => {
      return HttpResponse.json(mockService);
    }
  ),
];
