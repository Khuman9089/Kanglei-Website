'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Check, ChevronDown, Sparkles, Navigation, Building2 } from 'lucide-react';

export interface LocationSelection {
  placeName: string;
  latitude: number;
  longitude: number;
  hospitalName?: string;
}

// Curated Master Directory of Manipur Hospitals & Localities with Verified GPS Coordinates
export const MANIPUR_LOCATIONS_DATABASE: Array<{
  name: string;
  category: 'hospital' | 'town' | 'district';
  lat: number;
  lng: number;
  district: string;
  aliases?: string[];
}> = [
  // Major Hospitals in Manipur
  {
    name: 'RIMS (Regional Institute of Medical Sciences), Lamphelpat',
    category: 'hospital',
    lat: 24.8214,
    lng: 93.9167,
    district: 'Imphal West',
    aliases: ['RIMS', 'RIMS Hospital', 'Lamphelpat', 'Regional Institute']
  },
  {
    name: 'JNIMS (Jawaharlal Nehru Institute of Medical Sciences), Porompat',
    category: 'hospital',
    lat: 24.8058,
    lng: 93.9634,
    district: 'Imphal East',
    aliases: ['JNIMS', 'JNIMS Hospital', 'Porompat', 'Jawaharlal Nehru']
  },
  {
    name: 'Shija Hospitals & Research Institute, Langol',
    category: 'hospital',
    lat: 24.8390,
    lng: 93.9056,
    district: 'Imphal West',
    aliases: ['Shija', 'Shija Hospital', 'Langol', 'SHRI']
  },
  {
    name: 'Raj Medicity, North AOC',
    category: 'hospital',
    lat: 24.8198,
    lng: 93.9452,
    district: 'Imphal West',
    aliases: ['Raj Medicity', 'Raj Hospital', 'North AOC']
  },
  {
    name: "Mother's Care Children Hospital & Research Centre, Sagolband",
    category: 'hospital',
    lat: 24.7997,
    lng: 93.9234,
    district: 'Imphal West',
    aliases: ["Mother's Care", 'Mothers Care', 'Sagolband Moirang Leirak']
  },
  {
    name: 'Sky Hospital & Research Institute, RIMS Road',
    category: 'hospital',
    lat: 24.8185,
    lng: 93.9312,
    district: 'Imphal West',
    aliases: ['Sky Hospital', 'RIMS Road Hospital']
  },
  {
    name: 'Babina Specialty Hospital, Sajiwa / Khabeisoi',
    category: 'hospital',
    lat: 24.8760,
    lng: 93.9710,
    district: 'Imphal East',
    aliases: ['Babina Hospital', 'Babina', 'Khabeisoi']
  },
  {
    name: 'Catholic Medical Centre (CMC) Hospital, Koirengei',
    category: 'hospital',
    lat: 24.8720,
    lng: 93.9480,
    district: 'Imphal East',
    aliases: ['CMC Hospital', 'Koirengei Hospital']
  },
  {
    name: 'Iboyaima Hospital & Research Centre, Singjamei',
    category: 'hospital',
    lat: 24.7780,
    lng: 93.9380,
    district: 'Imphal West',
    aliases: ['Iboyaima Hospital', 'Singjamei Hospital']
  },
  {
    name: 'Horizon Hospital & Research Institute, Lamphel',
    category: 'hospital',
    lat: 24.8250,
    lng: 93.9200,
    district: 'Imphal West',
    aliases: ['Horizon Hospital']
  },
  {
    name: 'Remedy Hospital & Research Centre, Khurai Lamlong',
    category: 'hospital',
    lat: 24.8250,
    lng: 93.9550,
    district: 'Imphal East',
    aliases: ['Remedy Hospital', 'Lamlong Hospital']
  },
  {
    name: 'Advanced Hospital, Palace Compound',
    category: 'hospital',
    lat: 24.8010,
    lng: 93.9510,
    district: 'Imphal East',
    aliases: ['Advanced Hospital', 'Palace Compound Hospital']
  },
  {
    name: 'City Hospital, Moirangkhom',
    category: 'hospital',
    lat: 24.7930,
    lng: 93.9390,
    district: 'Imphal West',
    aliases: ['City Hospital', 'Moirangkhom Hospital']
  },
  {
    name: 'Little Clinic & Maternity Home, Nagamapal / Paona Bazar',
    category: 'hospital',
    lat: 24.8080,
    lng: 93.9350,
    district: 'Imphal West',
    aliases: ['Little Clinic', 'Nagamapal Clinic']
  },
  {
    name: 'Kangleipak Nursing Home, Nagamapal',
    category: 'hospital',
    lat: 24.8095,
    lng: 93.9340,
    district: 'Imphal West',
    aliases: ['Kangleipak Nursing Home']
  },
  {
    name: 'Imphal Hospital & Research Centre, Uripok',
    category: 'hospital',
    lat: 24.8110,
    lng: 93.9280,
    district: 'Imphal West',
    aliases: ['Imphal Hospital', 'Uripok Hospital']
  },
  {
    name: 'District Hospital Thoubal (Athokpam)',
    category: 'hospital',
    lat: 24.6382,
    lng: 93.9961,
    district: 'Thoubal',
    aliases: ['Thoubal Hospital', 'District Hospital Thoubal', 'Athokpam']
  },
  {
    name: 'District Hospital Churachandpur (Tuibong)',
    category: 'hospital',
    lat: 24.3336,
    lng: 93.6841,
    district: 'Churachandpur',
    aliases: ['Churachandpur Hospital', 'Tuibong Hospital', 'Dympha Hospital']
  },
  {
    name: 'Jivan Hospital, Kakching',
    category: 'hospital',
    lat: 24.4850,
    lng: 93.9820,
    district: 'Kakching',
    aliases: ['Jivan Hospital', 'Jivan', 'Kakching Hospital']
  },
  {
    name: 'District Hospital Bishnupur',
    category: 'hospital',
    lat: 24.6300,
    lng: 93.7600,
    district: 'Bishnupur',
    aliases: ['Bishnupur Hospital']
  },
  {
    name: 'District Hospital Senapati',
    category: 'hospital',
    lat: 25.2670,
    lng: 94.0170,
    district: 'Senapati',
    aliases: ['Senapati Hospital']
  },
  {
    name: 'District Hospital Ukhrul (Dungrei)',
    category: 'hospital',
    lat: 25.1160,
    lng: 94.3620,
    district: 'Ukhrul',
    aliases: ['Ukhrul Hospital', 'Dungrei Hospital']
  },
  {
    name: 'District Hospital Tamenglong',
    category: 'hospital',
    lat: 24.9860,
    lng: 93.4930,
    district: 'Tamenglong',
    aliases: ['Tamenglong Hospital']
  },
  {
    name: 'District Hospital Chandel',
    category: 'hospital',
    lat: 24.3290,
    lng: 94.0040,
    district: 'Chandel',
    aliases: ['Chandel Hospital']
  },
  {
    name: 'District Hospital Jiribam',
    category: 'hospital',
    lat: 24.8020,
    lng: 93.1230,
    district: 'Jiribam',
    aliases: ['Jiribam Hospital']
  },
  {
    name: 'District Hospital Kangpokpi',
    category: 'hospital',
    lat: 25.1480,
    lng: 93.9670,
    district: 'Kangpokpi',
    aliases: ['Kangpokpi Hospital']
  },
  {
    name: 'Sub-District Hospital Moreh',
    category: 'hospital',
    lat: 24.2460,
    lng: 94.3050,
    district: 'Tengnoupal',
    aliases: ['Moreh Hospital']
  },

  // Major Towns, Municipalities & Districts in Manipur
  { name: 'Imphal, Manipur', category: 'town', lat: 24.8170, lng: 93.9368, district: 'Imphal West' },
  { name: 'Thoubal, Manipur', category: 'town', lat: 24.6382, lng: 93.9961, district: 'Thoubal' },
  { name: 'Kakching, Manipur', category: 'town', lat: 24.4850, lng: 93.9820, district: 'Kakching' },
  { name: 'Bishnupur, Manipur', category: 'town', lat: 24.6300, lng: 93.7600, district: 'Bishnupur' },
  { name: 'Moirang, Manipur', category: 'town', lat: 24.5000, lng: 93.7700, district: 'Bishnupur' },
  { name: 'Churachandpur, Manipur', category: 'town', lat: 24.3336, lng: 93.6841, district: 'Churachandpur' },
  { name: 'Ukhrul, Manipur', category: 'town', lat: 25.1160, lng: 94.3620, district: 'Ukhrul' },
  { name: 'Senapati, Manipur', category: 'town', lat: 25.2670, lng: 94.0170, district: 'Senapati' },
  { name: 'Tamenglong, Manipur', category: 'town', lat: 24.9860, lng: 93.4930, district: 'Tamenglong' },
  { name: 'Chandel, Manipur', category: 'town', lat: 24.3290, lng: 94.0040, district: 'Chandel' },
  { name: 'Jiribam, Manipur', category: 'town', lat: 24.8020, lng: 93.1230, district: 'Jiribam' },
  { name: 'Kangpokpi, Manipur', category: 'town', lat: 25.1480, lng: 93.9670, district: 'Kangpokpi' },
  { name: 'Noney, Manipur', category: 'town', lat: 24.8500, lng: 93.6000, district: 'Noney' },
  { name: 'Kamjong, Manipur', category: 'town', lat: 24.9900, lng: 94.4900, district: 'Kamjong' },
  { name: 'Pherzawl, Manipur', category: 'town', lat: 24.2500, lng: 93.2000, district: 'Pherzawl' },
  { name: 'Tengnoupal, Manipur', category: 'town', lat: 24.3800, lng: 94.1500, district: 'Tengnoupal' },
  { name: 'Moreh, Manipur', category: 'town', lat: 24.2460, lng: 94.3050, district: 'Tengnoupal' },
  { name: 'Lilong, Manipur', category: 'town', lat: 24.7200, lng: 93.9400, district: 'Thoubal' },
  { name: 'Mayang Imphal, Manipur', category: 'town', lat: 24.6200, lng: 93.8900, district: 'Imphal West' },
  { name: 'Yairipok, Manipur', category: 'town', lat: 24.6700, lng: 94.0600, district: 'Thoubal' },
  { name: 'Wangjing, Manipur', category: 'town', lat: 24.6000, lng: 94.0300, district: 'Thoubal' },
  { name: 'Nambol, Manipur', category: 'town', lat: 24.7000, lng: 93.8200, district: 'Bishnupur' },
  { name: 'Oinam, Manipur', category: 'town', lat: 24.6600, lng: 93.7900, district: 'Bishnupur' },
  { name: 'Sugnu, Manipur', category: 'town', lat: 24.3200, lng: 93.8700, district: 'Kakching' },
  { name: 'Kwakeithel, Imphal', category: 'town', lat: 24.7870, lng: 93.9210, district: 'Imphal West' },
  { name: 'Singjamei, Imphal', category: 'town', lat: 24.7780, lng: 93.9380, district: 'Imphal West' },
  { name: 'Uripok, Imphal', category: 'town', lat: 24.8110, lng: 93.9280, district: 'Imphal West' },
  { name: 'Sagolband, Imphal', category: 'town', lat: 24.8000, lng: 93.9200, district: 'Imphal West' },
  { name: 'Lamphelpat, Imphal', category: 'town', lat: 24.8214, lng: 93.9167, district: 'Imphal West' },
  { name: 'Porompat, Imphal', category: 'town', lat: 24.8058, lng: 93.9634, district: 'Imphal East' },
  { name: 'Khurai, Imphal', category: 'town', lat: 24.8250, lng: 93.9550, district: 'Imphal East' },
  { name: 'Kongba, Imphal', category: 'town', lat: 24.7800, lng: 93.9650, district: 'Imphal East' },
];

interface ManipurLocationInputProps {
  value: string;
  latitude?: number;
  longitude?: number;
  onChange: (location: LocationSelection) => void;
  required?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function ManipurLocationInput({
  value,
  latitude = 24.8170,
  longitude = 93.9368,
  onChange,
  required = false,
  label = 'Place of Birth / Hospital Name',
  placeholder = 'Search hospital or place in Manipur (e.g. RIMS, JNIMS, Shija, Imphal)',
  className = '',
}: ManipurLocationInputProps) {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCoords, setShowCoords] = useState(false);
  const [currentLat, setCurrentLat] = useState(latitude);
  const [currentLng, setCurrentLng] = useState(longitude);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with prop value if externally updated
  useEffect(() => {
    if (value !== query) {
      setQuery(value || '');
    }
  }, [value]);

  useEffect(() => {
    if (latitude) setCurrentLat(latitude);
    if (longitude) setCurrentLng(longitude);
  }, [latitude, longitude]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter internal database instantly
  const localMatches = query.trim().length >= 1
    ? MANIPUR_LOCATIONS_DATABASE.filter((loc) => {
        const q = query.toLowerCase().trim();
        if (loc.name.toLowerCase().includes(q)) return true;
        if (loc.district.toLowerCase().includes(q)) return true;
        if (loc.aliases && loc.aliases.some((a) => a.toLowerCase().includes(q))) return true;
        return false;
      }).slice(0, 8)
    : MANIPUR_LOCATIONS_DATABASE.slice(0, 6);

  // Debounced search to Google Maps / Places API endpoint
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setApiResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/places/search?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results && Array.isArray(data.results)) {
            setApiResults(data.results);
          }
        })
        .catch(() => {})
        .finally(() => setIsSearching(false));
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (name: string, lat: number, lng: number) => {
    setQuery(name);
    setCurrentLat(lat);
    setCurrentLng(lng);
    setIsOpen(false);
    onChange({
      placeName: name,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleManualCoordChange = (newLat: number, newLng: number) => {
    setCurrentLat(newLat);
    setCurrentLng(newLng);
    onChange({
      placeName: query,
      latitude: newLat,
      longitude: newLng,
    });
  };

  return (
    <div ref={containerRef} className={`w-full space-y-1.5 relative ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-extrabold text-[#0f172a]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* GPS Coordinates pill */}
        {currentLat && currentLng && (
          <button
            type="button"
            onClick={() => setShowCoords(!showCoords)}
            className="text-[10.5px] font-mono font-bold text-[#b45309] hover:text-[#d97706] flex items-center gap-1 cursor-pointer"
            title="Click to view/edit exact GPS coordinates"
          >
            <Navigation className="w-3 h-3 text-[#d97706]" />
            <span>{currentLat.toFixed(4)}°N, {currentLng.toFixed(4)}°E</span>
            <span className="underline text-[10px]">({showCoords ? 'Hide GPS' : 'Edit GPS'})</span>
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <MapPin className="w-4 h-4 text-[#d97706]" />
        </div>

        <input
          type="text"
          value={query}
          required={required}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            // Default fallback if user types custom place without selecting
            onChange({
              placeName: e.target.value,
              latitude: currentLat,
              longitude: currentLng,
            });
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#fde68a] bg-[#fefcf6] text-xs sm:text-sm text-[#0f172a] font-bold placeholder:text-gray-400 placeholder:font-normal focus:border-[#d97706] focus:outline-none shadow-2xs"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(true);
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <span className="text-xs font-bold">✕</span>
          </button>
        )}
      </div>

      {/* Manual GPS Coordinate Inputs (Toggled) */}
      {showCoords && (
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-gray-600 mb-1">Latitude (°N)</label>
            <input
              type="number"
              step="any"
              value={currentLat}
              onChange={(e) => handleManualCoordChange(parseFloat(e.target.value) || 0, currentLng)}
              className="w-full h-8 px-2 rounded-lg border border-amber-300 bg-white font-mono text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-600 mb-1">Longitude (°E)</label>
            <input
              type="number"
              step="any"
              value={currentLng}
              onChange={(e) => handleManualCoordChange(currentLat, parseFloat(e.target.value) || 0)}
              className="w-full h-8 px-2 rounded-lg border border-amber-300 bg-white font-mono text-xs font-bold"
            />
          </div>
        </div>
      )}

      {/* AUTOCOMPLETE DROPDOWN */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border-2 border-[#fde68a] shadow-xl z-50 max-h-72 overflow-y-auto divide-y divide-gray-100">
          
          {/* Header indicator */}
          <div className="p-2.5 bg-[#fefcf6] border-b border-[#fde68a] flex items-center justify-between text-[11px] font-bold text-[#b45309]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
              Manipur Hospitals & Places (Auto-Fetches GPS)
            </span>
            {isSearching && <span className="text-[10px] text-gray-500 animate-pulse">Searching Google Places...</span>}
          </div>

          {/* Local Matches (Hospitals and Towns) */}
          {localMatches.map((loc, idx) => (
            <button
              key={`local-${idx}`}
              type="button"
              onClick={() => handleSelect(loc.name, loc.lat, loc.lng)}
              className="w-full p-3 text-left hover:bg-[#fef3c7]/60 transition-colors flex items-center justify-between gap-2 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm border ${
                  loc.category === 'hospital'
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  {loc.category === 'hospital' ? '🏥' : '📍'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0f172a] truncate group-hover:text-[#b45309]">
                    {loc.name}
                  </div>
                  <div className="text-[10.5px] text-gray-500 flex items-center gap-1 font-medium">
                    <span>{loc.district}</span>
                    <span>•</span>
                    <span className="font-mono text-[9.5px] text-amber-800">{loc.lat.toFixed(4)}°N, {loc.lng.toFixed(4)}°E</span>
                  </div>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold uppercase shrink-0 border ${
                loc.category === 'hospital'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {loc.category === 'hospital' ? 'Hospital' : 'Town'}
              </span>
            </button>
          ))}

          {/* Live Google Places / Geocoder API Results */}
          {apiResults.map((item, idx) => (
            <button
              key={`api-${idx}`}
              type="button"
              onClick={() => handleSelect(item.name, item.latitude, item.longitude)}
              className="w-full p-3 text-left hover:bg-emerald-50/60 transition-colors flex items-center justify-between gap-2 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-sm text-emerald-600">
                  🌐
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0f172a] truncate group-hover:text-emerald-800">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {item.latitude}°N, {item.longitude}°E ({item.source === 'google' ? 'Google Maps' : 'GPS'})
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                {item.source === 'google' ? 'Google Maps' : 'Verified'}
              </span>
            </button>
          ))}

          {localMatches.length === 0 && apiResults.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-500 font-medium">
              No matching hospital found. You can keep &quot;{query}&quot; and we will use standard Manipur coordinates (24.8170° N, 93.9368° E).
            </div>
          )}
        </div>
      )}
    </div>
  );
}
