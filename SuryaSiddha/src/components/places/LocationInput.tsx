import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Globe, AlertCircle } from 'lucide-react';
import { PlaceSuggestion } from '../../types/places';
import { CITIES_DATABASE } from '../../data/cities';

interface LocationInputProps {
  value: string;
  latitude: number;
  longitude: number;
  timezone: number;
  onChange: (place: { place: string; lat: number; lng: number; timezone: number }) => void;
  googleApiKey?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  latitude,
  longitude,
  timezone,
  onChange,
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setSuggestions(CITIES_DATABASE.slice(0, 8));
      setIsOpen(true);
      return;
    }

    const lower = text.toLowerCase();
    const matches = CITIES_DATABASE.filter(
      (c) =>
        c.main_text.toLowerCase().includes(lower) ||
        c.secondary_text.toLowerCase().includes(lower) ||
        c.description.toLowerCase().includes(lower)
    );
    setSuggestions(matches);
    setIsOpen(true);
  };

  const selectPlace = (place: PlaceSuggestion) => {
    setQuery(place.description);
    setIsOpen(false);
    onChange({
      place: place.description,
      lat: place.latitude,
      lng: place.longitude,
      timezone: place.timezone,
    });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingGeo(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));
        const tzMinutes = new Date().getTimezoneOffset();
        const tzOffset = -tzMinutes / 60;

        const locName = `GPS Location (${lat > 0 ? lat + '°N' : Math.abs(lat) + '°S'}, ${lng > 0 ? lng + '°E' : Math.abs(lng) + '°W'})`;
        setQuery(locName);
        setIsLoadingGeo(false);
        onChange({
          place: locName,
          lat,
          lng,
          timezone: tzOffset,
        });
      },
      () => {
        setIsLoadingGeo(false);
        setGeoError('Could not retrieve GPS coordinates. Please select a city.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full">
      <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950/70 mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          Birth Place / Coordinates
        </span>
        <span className="text-[11px] text-slate-500 font-mono lowercase">
          {latitude.toFixed(2)}°, {longitude.toFixed(2)}° (UTC {timezone >= 0 ? `+${timezone}` : timezone}h)
        </span>
      </label>

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (!query) setSuggestions(CITIES_DATABASE.slice(0, 8));
            else handleSearch(query);
            setIsOpen(true);
          }}
          placeholder="Search city (e.g., Delhi, Varanasi, London, New York...)"
          className="w-full bg-white text-slate-800 border border-amber-200/80 rounded-xl px-4 py-2.5 pl-10 pr-12 text-sm placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition-all"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          title="Detect Current GPS Location"
          disabled={isLoadingGeo}
          className="absolute right-2.5 p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 hover:text-amber-950 transition-colors border border-amber-200"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLoadingGeo ? 'animate-spin text-amber-600' : ''}`} />
        </button>
      </div>

      {geoError && (
        <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-amber-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
        >
          <div className="p-2.5 border-b border-amber-100 text-[11px] font-semibold text-amber-900 bg-amber-50/60 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-600" /> Curated Astronomical Locations
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Offline database active</span>
          </div>

          {suggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching cities found. Try searching another city or use GPS.
            </div>
          ) : (
            suggestions.map((item) => (
              <div
                key={item.place_id}
                onClick={() => selectPlace(item)}
                className="px-3.5 py-2.5 hover:bg-amber-50/80 cursor-pointer transition-colors border-b border-amber-100/50 last:border-0 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">{item.main_text}</div>
                    <div className="text-xs text-slate-500">{item.secondary_text}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[11px] font-mono text-amber-700 font-medium">
                    {item.latitude.toFixed(2)}°N, {item.longitude.toFixed(2)}°E
                  </div>
                  <div className="text-[10px] text-slate-400">
                    UTC {item.timezone >= 0 ? `+${item.timezone}` : item.timezone}h
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
