'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import {
  Sun,
  Moon,
  Calendar,
  Clock,
  Compass,
  Sparkles,
  ChevronRight,
  MapPin,
  ChevronLeft,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface PanchangState {
  date: string;
  formattedDate: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    utcOffset: number;
  };
  sunMoonTimings: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    dayLength: string;
  };
  fiveAngas: {
    tithi: {
      name: string;
      paksha: string;
      index: number;
      completionPct: number;
      summary: string;
    };
    nakshatra: {
      name: string;
      lord: string;
      pada: number;
      index: number;
      completionPct: number;
    };
    yoga: {
      name: string;
      index: number;
      isAuspicious: boolean;
    };
    karana: {
      name: string;
      type: string;
      isBhadra: boolean;
    };
    vara: {
      name: string;
      sanskrit: string;
      ruler: string;
    };
  };
  muhurtas: {
    abhijit: { start: string; end: string; isAuspicious: boolean };
    amritKaal: { start: string; end: string };
    rahuKaal: { start: string; end: string; warning: string };
    yamaganda: { start: string; end: string };
    gulikaKaal: { start: string; end: string };
    durmuhurat: { start: string; end: string };
  };
  planetaryState: {
    sunSign: string;
    moonSign: string;
    sunDegree: string;
    moonDegree: string;
    vikramSamvat: number;
    sakaSamvat: number;
    ritu: string;
    ayana: string;
  };
  planets?: {
    id: string;
    name: string;
    signName: string;
    degreeStr: string;
    nakshatraName: string;
    nakshatraPada: number;
    nakshatraLord: string;
    isRetrograde: boolean;
  }[];
}

const PRESET_LOCATIONS = [
  { name: 'Imphal, Manipur', lat: 24.817, lng: 93.936, tz: 5.5 },
  { name: 'New Delhi', lat: 28.6139, lng: 77.209, tz: 5.5 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, tz: 5.5 },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362, tz: 5.5 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, tz: 5.5 },
];

export default function PanchangPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedLocation, setSelectedLocation] = useState(PRESET_LOCATIONS[0]);
  const [panchang, setPanchang] = useState<PanchangState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPanchangData = (date: string, loc = selectedLocation) => {
    setLoading(true);
    fetch(
      `/api/panchang?date=${date}&lat=${loc.lat}&lng=${loc.lng}&tz=${loc.tz}&location=${encodeURIComponent(loc.name)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.panchang) {
          setPanchang(data.panchang);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching panchang:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPanchangData(selectedDate, selectedLocation);
  }, [selectedDate, selectedLocation]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    const newStr = d.toISOString().split('T')[0];
    setSelectedDate(newStr);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const newStr = d.toISOString().split('T')[0];
    setSelectedDate(newStr);
  };

  const handleToday = () => {
    const newStr = new Date().toISOString().split('T')[0];
    setSelectedDate(newStr);
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-1 sm:pt-2 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Live Astronomical Vedic Almanac
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#0f172a] leading-tight">
            Vedic <span className="text-[#b45309]">Panchang</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
            Accurate real-time calculations for Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, & Abhijit Muhurat for any location & date.
          </p>
        </div>

        {/* Date & Location Controls Ribbon */}
        <div className="bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Day Stepper & Custom Date Input */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <button
                onClick={handlePrevDay}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#fef3c7] hover:border-[#c69214] font-bold text-xs flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Day</span>
              </button>

              <button
                onClick={handleToday}
                className="px-4 py-2.5 rounded-xl bg-[#b45309] text-white font-extrabold text-xs shadow-xs hover:bg-[#d97706] transition-all"
              >
                📅 Today
              </button>

              <button
                onClick={handleNextDay}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#fef3c7] hover:border-[#c69214] font-bold text-xs flex items-center gap-1 transition-all"
              >
                <span>Next Day</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="relative flex-1 sm:w-auto">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#fde68a] bg-[#fefcf6] font-bold text-xs text-[#0f172a] focus:outline-none focus:border-[#d97706]"
                />
              </div>
            </div>

            {/* Location Selector */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <MapPin className="w-4 h-4 text-[#d97706] shrink-0" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">Location:</span>
              <select
                value={selectedLocation.name}
                onChange={(e) => {
                  const loc = PRESET_LOCATIONS.find((l) => l.name === e.target.value);
                  if (loc) setSelectedLocation(loc);
                }}
                className="w-full lg:w-auto px-4 py-2.5 rounded-xl border border-[#fde68a] bg-[#fefcf6] font-extrabold text-xs text-[#0f172a] focus:outline-none focus:border-[#d97706]"
              >
                {PRESET_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    📍 {loc.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Current Formatted Date Display */}
          {panchang && (
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs sm:text-sm font-extrabold text-[#b45309] gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d97706]" />
                <span>{panchang.formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{panchang.location.name} ({panchang.location.latitude.toFixed(2)}°N, {panchang.location.longitude.toFixed(2)}°E)</span>
              </div>
            </div>
          )}
        </div>

        {/* Loading Spinner / Main Panchang Display */}
        {loading || !panchang ? (
          <div className="bg-white p-12 rounded-3xl border border-[#f3e8d2] text-center space-y-3 shadow-xs">
            <Sparkles className="w-10 h-10 text-[#d97706] animate-spin mx-auto" />
            <h3 className="font-serif font-bold text-xl text-[#0f172a]">Calculating Astronomical Panchang...</h3>
            <p className="text-xs text-gray-500">Computing Sidereal Moon phase, Tithi, Nakshatra, and Rahu Kaal</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* 4 Main Panchang Highlight Cards (BIGGER Typography) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Sunrise & Sunset */}
              <div className="bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Solar Timings</h3>
                    <span className="text-[11px] text-gray-500 font-medium">Sun Cycle & Length</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Sunrise</span>
                    <span className="font-extrabold text-[#0f172a]">{panchang.sunMoonTimings.sunrise}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Sunset</span>
                    <span className="font-extrabold text-[#0f172a]">{panchang.sunMoonTimings.sunset}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Moonrise</span>
                    <span className="font-extrabold text-[#0f172a]">{panchang.sunMoonTimings.moonrise}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-600 font-medium">Day Length</span>
                    <span className="font-extrabold text-[#b45309]">{panchang.sunMoonTimings.dayLength}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Core Five Angas */}
              <div className="bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">5 Sacred Angas</h3>
                    <span className="text-[11px] text-gray-500 font-medium">Panchang Core</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Tithi</span>
                    <span className="font-extrabold text-[#b45309]">{panchang.fiveAngas.tithi.summary}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Nakshatra</span>
                    <span className="font-extrabold text-[#b45309]">{panchang.fiveAngas.nakshatra.name} (P{panchang.fiveAngas.nakshatra.pada})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Yoga</span>
                    <span className="font-extrabold text-[#0f172a]">{panchang.fiveAngas.yoga.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-600 font-medium">Karana</span>
                    <span className="font-extrabold text-[#0f172a]">{panchang.fiveAngas.karana.name}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Key Muhurats */}
              <div className="bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Key Muhurats</h3>
                    <span className="text-[11px] text-gray-500 font-medium">Timing Slots</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Abhijit</span>
                    <span className="font-extrabold text-emerald-700">{panchang.muhurtas.abhijit.start} – {panchang.muhurtas.abhijit.end}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Rahu Kaal</span>
                    <span className="font-extrabold text-rose-700">{panchang.muhurtas.rahuKaal.start} – {panchang.muhurtas.rahuKaal.end}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Yamaganda</span>
                    <span className="font-extrabold text-gray-800">{panchang.muhurtas.yamaganda.start} – {panchang.muhurtas.yamaganda.end}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-600 font-medium">Gulika</span>
                    <span className="font-extrabold text-gray-800">{panchang.muhurtas.gulikaKaal.start} – {panchang.muhurtas.gulikaKaal.end}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Cosmic State & Samvat */}
              <div className="bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Samvat & Signs</h3>
                    <span className="text-[11px] text-gray-500 font-medium">Cosmic Alignments</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Vikram Samvat</span>
                    <span className="font-extrabold text-[#0f172a]">{panchang.planetaryState.vikramSamvat}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Sun Sign</span>
                    <span className="font-extrabold text-[#b45309]">{panchang.planetaryState.sunSign}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Moon Sign</span>
                    <span className="font-extrabold text-[#b45309]">{panchang.planetaryState.moonSign}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-600 font-medium">Ritu & Ayana</span>
                    <span className="font-extrabold text-gray-800">{panchang.planetaryState.ayana}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Detailed Auspicious vs Inauspicious Timing Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Auspicious Timings Card */}
              <div className="bg-emerald-50/70 p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 space-y-4">
                <div className="flex items-center gap-3 text-emerald-800 border-b border-emerald-200 pb-3">
                  <CheckCircle2 className="w-7 h-7 shrink-0 text-emerald-600" />
                  <div>
                    <h3 className="font-serif font-bold text-2xl">Auspicious Timings (Shubh Muhurats)</h3>
                    <p className="text-xs text-emerald-700 font-medium">Best times for negotiations, travel, purchases, & rituals</p>
                  </div>
                </div>

                <div className="space-y-3 text-base font-sans text-emerald-950">
                  <div className="p-4 rounded-2xl bg-white/80 border border-emerald-200 flex justify-between items-center shadow-2xs">
                    <div>
                      <span className="font-extrabold block">🌟 Abhijit Muhurat</span>
                      <span className="text-xs text-emerald-700">Most auspicious period of the day</span>
                    </div>
                    <span className="font-extrabold font-mono text-base text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                      {panchang.muhurtas.abhijit.start} – {panchang.muhurtas.abhijit.end}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/80 border border-emerald-200 flex justify-between items-center shadow-2xs">
                    <div>
                      <span className="font-extrabold block">✨ Amrit Kaal</span>
                      <span className="text-xs text-emerald-700">Best for important meetings & deals</span>
                    </div>
                    <span className="font-extrabold font-mono text-base text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                      {panchang.muhurtas.amritKaal.start} – {panchang.muhurtas.amritKaal.end}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inauspicious Timings Card */}
              <div className="bg-rose-50/70 p-6 sm:p-8 rounded-3xl border-2 border-rose-200 space-y-4">
                <div className="flex items-center gap-3 text-rose-900 border-b border-rose-200 pb-3">
                  <AlertTriangle className="w-7 h-7 shrink-0 text-rose-600" />
                  <div>
                    <h3 className="font-serif font-bold text-2xl">Inauspicious Timings (Ashubh Kaal)</h3>
                    <p className="text-xs text-rose-700 font-medium">Avoid starting important works during these slots</p>
                  </div>
                </div>

                <div className="space-y-3 text-base font-sans text-rose-950">
                  <div className="p-4 rounded-2xl bg-white/80 border border-rose-200 flex justify-between items-center shadow-2xs">
                    <div>
                      <span className="font-extrabold block text-rose-800">🚫 Rahu Kaal</span>
                      <span className="text-xs text-rose-600">Avoid new financial ventures</span>
                    </div>
                    <span className="font-extrabold font-mono text-base text-rose-800 bg-rose-100 px-3 py-1 rounded-xl">
                      {panchang.muhurtas.rahuKaal.start} – {panchang.muhurtas.rahuKaal.end}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/80 border border-rose-200 flex justify-between items-center shadow-2xs">
                    <div>
                      <span className="font-extrabold block">⚠️ Yamaganda Kaal</span>
                      <span className="text-xs text-gray-600">Inauspicious for long journeys</span>
                    </div>
                    <span className="font-extrabold font-mono text-base text-gray-800 bg-gray-100 px-3 py-1 rounded-xl">
                      {panchang.muhurtas.yamaganda.start} – {panchang.muhurtas.yamaganda.end}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Live Planetary Positions (Graha Sthiti) Table Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#0f172a]">
                      Planetary Positions (Graha Sthiti) for {panchang.formattedDate}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Exact sidereal longitudes, Rashi, Nakshatra Pada, & planetary motion status at Sunrise (Surya Udaya)
                    </p>
                  </div>
                </div>

                <span className="px-3.5 py-1.5 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold border border-[#fde68a]">
                  LAHIRI • SIDEREAL
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans text-[#0f172a]">
                  <thead className="bg-[#fefcf6] text-[#b45309] font-serif font-bold text-base border-b border-[#fde68a]">
                    <tr>
                      <th className="py-3 px-4">Planet</th>
                      <th className="py-3 px-4">Zodiac Sign & Degree</th>
                      <th className="py-3 px-4">Nakshatra & Pada</th>
                      <th className="py-3 px-4">Nakshatra Lord</th>
                      <th className="py-3 px-4 text-center">Motion / Speed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-medium">
                    {(panchang.planets || []).map((p) => (
                      <tr key={p.id} className="hover:bg-[#fefcf6] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#0f172a] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#d97706]" />
                          <span>{p.name}</span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-[#b45309]">
                          {p.signName} <span className="font-mono text-gray-600 font-normal">({p.degreeStr})</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-800">
                          {p.nakshatraName} <span className="text-[#b45309] font-extrabold">(Pada {p.nakshatraPada})</span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-700">
                          {p.nakshatraLord}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {p.isRetrograde ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold border border-rose-200">
                              🔴 Retrograde (R)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                              🟢 Direct
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Kundli CTA Button */}
            <div className="text-center bg-white p-8 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-3xl text-[#0f172a]">Generate Full Birth Chart for {panchang.formattedDate}</h3>
              <p className="text-base text-gray-700 max-w-lg mx-auto leading-relaxed">
                Want to analyze complete planetary houses, Vimshottari Dasha, and Lagna for a child born on this date?
              </p>
              <div className="pt-2">
                <Link
                  href={`/kundli?dob=${panchang.date}`}
                  className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-base shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <span>Generate Complete Kundli Chart</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
