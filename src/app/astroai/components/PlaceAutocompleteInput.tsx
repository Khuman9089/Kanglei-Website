'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, Check } from 'lucide-react';

interface PlaceResult {
  name: string;
  latitude: number;
  longitude: number;
  source: string;
  type?: string;
}

interface PlaceAutocompleteInputProps {
  value: string;
  onChange: (value: string, coords?: { latitude: number; longitude: number }) => void;
  placeholder?: string;
  className?: string;
}

export function PlaceAutocompleteInput({
  value,
  onChange,
  placeholder = 'City, State, Country',
  className = '',
}: PlaceAutocompleteInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Don't search if query matches exact selected item
    if (suggestions.some((s) => s.name === query)) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/places/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          setSuggestions(data.results);
          setIsOpen(data.results.length > 0);
        }
      } catch (err) {
        console.error('Places autocomplete error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (place: PlaceResult) => {
    setQuery(place.name);
    onChange(place.name, { latitude: place.latitude, longitude: place.longitude });
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 z-10" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full pl-10 pr-9 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#667EEA] shadow-2xs ${className}`}
        />
        {loading && (
          <Loader2 className="w-4 h-4 text-indigo-500 animate-spin absolute right-3.5 top-3.5" />
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 max-h-56 overflow-y-auto">
          <div className="p-1.5 space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-2.5 py-1 block">
              Suggested Locations
            </span>
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-3 py-2 rounded-xl text-left hover:bg-indigo-50/80 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 shrink-0">
                  {item.latitude.toFixed(1)}°, {item.longitude.toFixed(1)}°
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
