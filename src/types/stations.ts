/**
 * Station types
 */

export interface Station {
  crs: string;
  name: string;
}

export interface StationWithDistance extends Station {
  distance?: number;
}
