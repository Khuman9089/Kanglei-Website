export interface PlaceSuggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours, e.g. 5.5 for IST
  country?: string;
  state?: string;
}

export interface GeocodeResult {
  formatted_address: string;
  latitude: number;
  longitude: number;
  timezone: number;
  timezoneName?: string;
  dstOffset?: number;
}
