'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sun,
  Moon,
  Calendar as CalendarIcon,
  Clock,
  Compass,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowLeft,
  RefreshCw,
  Star,
  ShieldCheck,
  Globe,
  BookOpen,
  LayoutGrid
} from 'lucide-react';
import BengaliChart, { BengaliPlanetInfo } from '@/components/charts/BengaliChart';
import { getManipuriBookPanchang, ManipuriBookPanchangData } from '@/engine/manipuriPanchangBook';
import ManipuriBookPanchangView from '@/components/panchang/ManipuriBookPanchangView';
import BookPanchang3x8Table from '@/components/panchang/BookPanchang3x8Table';
import { toBengaliNumerals, toMeeteiNumerals } from '@/engine/manipuriCalendar';
import { MANIPURI_MONTH_ATTRIBUTES } from '@/data/manipuriMonthAttributes';

const PRESET_LOCATIONS = [
  { name: 'Imphal, Manipur', lat: 24.817, lng: 93.936, tz: 5.5 },
  { name: 'New Delhi', lat: 28.6139, lng: 77.209, tz: 5.5 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, tz: 5.5 },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362, tz: 5.5 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, tz: 5.5 },
];

const PLANET_SYMBOLS: Record<string, string> = {
  su: '☀️',
  mo: '🌙',
  ma: '🔴',
  me: '🟢',
  ju: '🟡',
  ve: '⚪',
  sa: '🪐',
  ra: '🐉',
  ke: '☄️',
};

const PLANET_ENGLISH_NAMES: Record<string, string> = {
  su: 'Sun',
  mo: 'Moon',
  ma: 'Mars',
  me: 'Mercury',
  ju: 'Jupiter',
  ve: 'Venus',
  sa: 'Saturn',
  ra: 'Rahu',
  ke: 'Ketu',
};

export interface ManipuriPanchangWorkstationProps {
  theme?: 'light' | 'dark';
  onClose?: () => void;
  isEmbedded?: boolean;
}

export default function ManipuriPanchangWorkstation({
  theme = 'light',
  onClose,
  isEmbedded = false
}: ManipuriPanchangWorkstationProps) {
  const isDark = theme === 'dark';
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedLocation, setSelectedLocation] = useState(PRESET_LOCATIONS[0]);
  const [script, setScript] = useState<'bengali' | 'meetei' | 'blipi' | 'en'>('bengali');
  const [viewMode, setViewMode] = useState<'book' | 'compact'>(isEmbedded ? 'compact' : 'book');
  const [bookPanchang, setBookPanchang] = useState<ManipuriBookPanchangData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize client data immediately
  useEffect(() => {
    try {
      const initial = getManipuriBookPanchang(
        selectedDate,
        selectedLocation.lat,
        selectedLocation.lng,
        selectedLocation.tz,
        selectedLocation.name
      );
      setBookPanchang(initial);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchPanchangData = (date: string, loc = selectedLocation) => {
    setLoading(true);
    fetch(
      `/api/panchang?date=${date}&lat=${loc.lat}&lng=${loc.lng}&tz=${loc.tz}&location=${encodeURIComponent(loc.name)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.bookPanchang) {
          setBookPanchang(data.bookPanchang);
        } else {
          const localData = getManipuriBookPanchang(date, loc.lat, loc.lng, loc.tz, loc.name);
          setBookPanchang(localData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching panchang:', err);
        const localData = getManipuriBookPanchang(date, loc.lat, loc.lng, loc.tz, loc.name);
        setBookPanchang(localData);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPanchangData(selectedDate, selectedLocation);
  }, [selectedDate, selectedLocation]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const isBengali = script === 'bengali';
  const isMeetei = script === 'meetei';

  const monthAttr = bookPanchang
    ? MANIPURI_MONTH_ATTRIBUTES.find((m) => m.monthCode === bookPanchang.header.manipuriMonthCode)
    : null;

  // Format localized display text
  const getMonthName = () => {
    if (!bookPanchang) return '';
    if (isMeetei) return bookPanchang.header.manipuriMonthMeetei;
    if (isBengali) return bookPanchang.header.manipuriMonthBengali;
    return bookPanchang.header.manipuriMonthEn;
  };

  const getTithiTitle = () => {
    if (!bookPanchang) return '';
    if (isMeetei) return bookPanchang.header.manipuriTithiStrMeetei;
    if (isBengali) return bookPanchang.header.manipuriTithiStrBengali;
    return bookPanchang.rawPanchang.fiveAngas.tithi.summary || bookPanchang.rawPanchang.fiveAngas.tithi.name;
  };

  const getDayName = () => {
    if (!bookPanchang) return '';
    if (isMeetei) return bookPanchang.header.weekdayMeetei;
    if (isBengali) return bookPanchang.header.weekdayBengali;
    return bookPanchang.header.weekdayEn;
  };

  const getThasiMaikei = () => {
    if (!monthAttr) return 'চিঙ্খৈ (North-East)';
    if (isMeetei) return monthAttr.tasiMahei.meetei;
    return monthAttr.tasiMahei.bengali;
  };

  const getTatnabaNumit = () => {
    if (!monthAttr) return 'নোংমাইজিং, নিংথৌকাবা';
    if (isMeetei) return monthAttr.tatnabaNumit.meetei;
    return monthAttr.tatnabaNumit.bengali;
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Map planets for BengaliChart Rashi Chakra
  const chartPlanets: BengaliPlanetInfo[] = useMemo(() => {
    if (!bookPanchang?.astronomical?.planets) return [];
    return bookPanchang.astronomical.planets.map((p) => ({
      id: p.id,
      name: PLANET_ENGLISH_NAMES[p.id] || p.nameBengali,
      abbr: isBengali ? p.abbrBengali : (isMeetei ? p.abbrMeetei : p.abbrBengali),
      houseNumber: p.rashiIndex + 1,
      isRetrograde: Boolean(p.statusSuffixBengali && p.statusSuffixBengali.includes('বক্র')),
      signDegree: p.signDegree,
    }));
  }, [bookPanchang, isBengali, isMeetei]);

  return (
    <div
      className={`w-full font-sans transition-colors ${
        isEmbedded
          ? 'space-y-3.5'
          : `p-3 sm:p-5 rounded-3xl border shadow-xl ${
              isDark ? 'bg-[#0b132b] border-[#3a506b]/40 text-slate-100' : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-900'
            }`
      }`}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. COMPACT STREAMLINED TOP CONTROLS & DATE NAV               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={`p-3 rounded-2xl border shadow-xs space-y-2.5 ${
        isDark ? 'bg-[#1c2541]/90 border-[#3a506b]' : 'bg-white border-[#E5E7EB]'
      }`}>
        
        {/* Row 1: Header Title + Back Button + View Mode + Script Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-gray-100 border border-[#E5E7EB] text-gray-700 hover:bg-gray-200 transition cursor-pointer shrink-0"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold leading-tight text-[#111827] dark:text-white truncate">
                {isMeetei ? 'ꯃꯅꯤꯄꯨꯔꯤ ꯄꯟꯆꯥꯡ ꯕꯨꯛ' : isBengali ? 'মণিপুরী পঞ্জিকা বই (Book Panchang)' : 'Manipuri Panchang'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Switcher: Book vs Mobile Compact */}
            <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('book')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'book'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="Authentic Book Panchang Sheet"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">বুক ভিউ</span>
                <span className="sm:hidden">Book</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'compact'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="Mobile Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">মোবাইল</span>
                <span className="sm:hidden">Cards</span>
              </button>
            </div>

            {/* Script Switcher */}
            <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-[11px]">
              <button
                type="button"
                onClick={() => setScript('bengali')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  script === 'bengali'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
                }`}
              >
                বাং
              </button>
              <button
                type="button"
                onClick={() => setScript('meetei')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  script === 'meetei'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
                }`}
              >
                ꯃꯤ
              </button>
              <button
                type="button"
                onClick={() => setScript('blipi')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  script === 'blipi'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
                }`}
              >
                BLipi
              </button>
              <button
                type="button"
                onClick={() => setScript('en')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  script === 'en'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Date Navigation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevDay}
              className="px-2 py-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-100 font-bold text-xs flex items-center gap-0.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <button
              type="button"
              onClick={handleToday}
              className={`px-2.5 py-1 rounded-xl font-bold text-xs shadow-2xs transition cursor-pointer ${
                isToday
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-slate-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={handleNextDay}
              className="px-2 py-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-100 font-bold text-xs flex items-center gap-0.5 transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2 py-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            />
          </div>

          {/* Location Picker */}
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <select
              value={selectedLocation.name}
              onChange={(e) => {
                const loc = PRESET_LOCATIONS.find((l) => l.name === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="px-2 py-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs text-gray-900 dark:text-slate-100 focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              {PRESET_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. LOADING STATE                                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {loading || !bookPanchang ? (
        <div className="p-10 text-center space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-[#E5E7EB] dark:border-slate-800">
          <RefreshCw className="w-7 h-7 text-amber-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-600 dark:text-slate-400">Loading Detail Daily Panchang...</p>
        </div>
      ) : viewMode === 'book' ? (
        /* ─────────────────────────────────────────────────────────── */
        /* 3. AUTHENTIC BOOK PANCHANG VIEW                             */
        /* ─────────────────────────────────────────────────────────── */
        <div className="space-y-4">
          <ManipuriBookPanchangView
            data={bookPanchang}
            script={script === 'blipi' ? 'blipi' : script === 'meetei' ? 'meetei' : 'bengali'}
          />
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────── */
        /* 4. CLEAN MODERN MYSTIC MOBILE APP PANCHANG VIEW             */
        /* ─────────────────────────────────────────────────────────── */
        <div className="space-y-3.5 font-sans">
          
          {/* A. HERO AUSPICIOUS CARD */}
          <div className="bg-gradient-to-br from-[#2b241d] via-[#1e1b18] to-[#151210] rounded-2xl p-4 text-white shadow-sm space-y-3 relative overflow-hidden border border-amber-500/40">
            <div className="absolute -right-6 -bottom-6 opacity-10 text-white select-none pointer-events-none">
              <Sun className="w-36 h-36" />
            </div>

            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-200 text-xs font-black uppercase tracking-wider inline-block border border-amber-400/40">
                  {bookPanchang.header.solarMonthNameBengali} · Soura {bookPanchang.header.solarDay}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  {getMonthName()} {isBengali ? 'মাস' : ''} • {getTithiTitle()}
                </h3>
                <p className="text-xs text-amber-200 font-bold">
                  {getDayName()} · {isMeetei ? `ꯁꯀꯥꯕ꯭ꯗ ${toMeeteiNumerals(bookPanchang.header.sakabda)}` : `শকাব্দ ${toBengaliNumerals(bookPanchang.header.sakabda)}`}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-amber-300 font-bold block font-mono">
                  Ayanamsa
                </span>
                <span className="text-xs font-mono font-black text-amber-300">
                  {bookPanchang.header.ayanamsa?.formattedBengali || "24° 14' 26\""}
                </span>
              </div>
            </div>

            {/* Sun & Moon Timings Ribbon */}
            <div className="relative z-10 grid grid-cols-2 gap-2 pt-2 border-t border-white/15 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 border border-white/15">
                <Sun className="w-4 h-4 text-amber-300 shrink-0" />
                <div className="min-w-0 leading-tight">
                  <span className="text-[11px] text-amber-200 font-bold block truncate">Sunrise / Sunset</span>
                  <strong className="text-xs text-white font-mono font-black block truncate">
                    {bookPanchang.astronomical.sunriseTimeStr} – {bookPanchang.astronomical.sunsetTimeStr}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 border border-white/15">
                <Moon className="w-4 h-4 text-indigo-300 shrink-0" />
                <div className="min-w-0 leading-tight">
                  <span className="text-[11px] text-amber-200 font-bold block truncate">Moonrise / Moonset</span>
                  <strong className="text-xs text-white font-mono font-black block truncate">
                    {bookPanchang.rawPanchang.sunMoonTimings.moonrise} – {bookPanchang.rawPanchang.sunMoonTimings.moonset}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* B. THE 5 PANCHANG PILLARS (PANCHA-ANGA) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-950 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>The Five Angas (পঞ্চ অঙ্গ)</span>
              </span>
              <span className="text-xs text-slate-800 dark:text-stone-200 font-bold">Core Vedic Elements</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              
              {/* 1. Tithi */}
              <div className={`p-3 rounded-2xl border-2 shadow-xs space-y-1.5 ${
                isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-amber-400">
                    ১. Tithi (থবানীং)
                  </span>
                  <Moon className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-sm font-black text-slate-950 dark:text-white leading-snug">
                  {bookPanchang.rawPanchang.fiveAngas.tithi.name}
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-stone-200 leading-tight">
                  {bookPanchang.rawPanchang.fiveAngas.tithi.paksha} Paksha ({bookPanchang.rawPanchang.fiveAngas.tithi.completionPct}% elapsed)
                </div>
              </div>

              {/* 2. Nakshatra */}
              <div className={`p-3 rounded-2xl border-2 shadow-xs space-y-1.5 ${
                isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-amber-400">
                    ২. Nakshatra (নক্ষত্র)
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-sm font-black text-slate-950 dark:text-white leading-snug">
                  {bookPanchang.rawPanchang.fiveAngas.nakshatra.name}
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-stone-200 leading-tight">
                  Pada {bookPanchang.rawPanchang.fiveAngas.nakshatra.pada} • Lord: {bookPanchang.rawPanchang.fiveAngas.nakshatra.lord}
                </div>
              </div>

              {/* 3. Yoga */}
              <div className={`p-3 rounded-2xl border-2 shadow-xs space-y-1.5 ${
                isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-amber-400">
                    ৩. Yoga (যোগ)
                  </span>
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-sm font-black text-slate-950 dark:text-white leading-snug">
                  {bookPanchang.rawPanchang.fiveAngas.yoga.name}
                </div>
                <div className="text-xs font-bold leading-tight">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-black">
                    {bookPanchang.rawPanchang.fiveAngas.yoga.isAuspicious ? '🟢 Auspicious (শুভ)' : '⚪ Neutral (সাধারণ)'}
                  </span>
                </div>
              </div>

              {/* 4. Karana */}
              <div className={`p-3 rounded-2xl border-2 shadow-xs space-y-1.5 ${
                isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-amber-400">
                    ৪. Karana (করণ)
                  </span>
                  <Flame className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <div className="text-sm font-black text-slate-950 dark:text-white leading-snug">
                  {bookPanchang.rawPanchang.fiveAngas.karana.name}
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-stone-200 leading-tight">
                  Type: {bookPanchang.rawPanchang.fiveAngas.karana.type || 'Chara (চর)'}
                </div>
              </div>

            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
             C. USER-REQUESTED 3X8 BOOK PANCHANG DATA TABLE
             ───────────────────────────────────────────────────────────── */}
          <BookPanchang3x8Table
            data={bookPanchang}
            script={script === 'blipi' ? 'blipi' : script === 'meetei' ? 'meetei' : script === 'en' ? 'en' : 'bengali'}
            theme={theme}
          />

          {/* D. RASHI CHAKRA & PLANETARY POSITIONS (GRAHA SFUT) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-950 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-600" />
                <span>{isMeetei ? 'ꯒ꯭ꯔꯍ ꯁ꯭ꯐꯨꯠ ꯑꯃꯁꯨꯡ ꯔꯥꯁꯤ ꯆꯛꯔ' : 'গ্রহ স্ফুট ও রাশি চক্র (Planetary Chart)'}</span>
              </span>
              <span className="text-xs text-amber-800 dark:text-amber-400 font-black">
                Lagna: {bookPanchang.astronomical.lagnaRise.rashiBengali}
              </span>
            </div>

            {/* Rashi Chakra Chart Container */}
            <div className={`p-3 rounded-2xl border-2 shadow-xs space-y-2.5 ${
              isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-300'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-950 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isMeetei ? 'ꯖꯟꯃ ꯆꯛꯔ (D1 Rashi Chart)' : 'জন্ম চক্র (D1 Rashi Chart)'}</span>
                </span>
                <span className="text-xs text-slate-800 font-bold font-mono">
                  Asc: {bookPanchang.astronomical.lagnaRise.rashiIndex + 1}
                </span>
              </div>

              {/* Responsive Bengali Rashi Chakra Chart */}
              <div className="w-full flex justify-center py-1 overflow-x-auto">
                <div className="w-full max-w-[360px]">
                  <BengaliChart
                    planets={chartPlanets}
                    ascendantSign={bookPanchang.astronomical.lagnaRise.rashiIndex}
                    title={isMeetei ? 'ꯖꯟꯃ ꯆꯛꯔ' : 'জন্ম চক্র'}
                    theme={isDark ? 'dark' : 'light'}
                    script={script === 'en' ? 'bengali' : script}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Planetary Coordinates Table (Graha Sfut) */}
            <div className={`p-3 rounded-2xl border-2 shadow-xs space-y-2.5 ${
              isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-300'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-950 dark:text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isMeetei ? 'ꯒ꯭ꯔꯍ ꯁ꯭ꯐꯨꯠ (Planetary Longitudes)' : 'গ্রহ স্ফুট (Planetary Longitudes)'}</span>
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {isMeetei ? 'ꯒ꯭ꯔꯍ ꯹ (9 Grahas)' : '৯ গ্রহ (9 Grahas)'}
                </span>
              </div>

              {/* Table / Grid */}
              <div className="overflow-x-auto -mx-1 px-1">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b-2 border-slate-300 dark:border-slate-800 text-xs font-black text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40">
                      <th className="py-2 px-1 font-black">Graha</th>
                      <th className="py-2 px-1 font-black">Rashi (Sign)</th>
                      <th className="py-2 px-1 font-black">Degree</th>
                      <th className="py-2 px-1 font-black text-right">Nakshatra</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans text-xs">
                    {/* 9 Planetary Rows */}
                    {bookPanchang.astronomical.planets.map((p) => {
                      const symbol = PLANET_SYMBOLS[p.id] || '✨';
                      const isRetro = Boolean(p.statusSuffixBengali && p.statusSuffixBengali.includes('বক্র'));
                      const name = isMeetei ? p.nameMeetei : p.nameBengali;
                      const rashi = isMeetei ? p.rashiMeetei : p.rashiBengali;
                      const degree = isMeetei ? p.degreeStrMeetei : p.degreeStrBengali;
                      const nakNum = isMeetei ? toMeeteiNumerals(p.nakshatraIndex) : toBengaliNumerals(p.nakshatraIndex);

                      return (
                        <tr key={p.id} className="hover:bg-amber-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-2 font-black text-slate-950 dark:text-white flex items-center gap-1.5">
                            <span>{symbol}</span>
                            <span>{name}</span>
                            {isRetro && (
                              <span className="px-1 py-0.2 rounded text-[9px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                                [R]
                              </span>
                            )}
                          </td>
                          <td className="py-2 font-bold text-slate-900 dark:text-slate-100">
                            {rashi}
                          </td>
                          <td className="py-2 font-mono font-bold text-amber-900 dark:text-amber-300">
                            {degree}
                          </td>
                          <td className="py-2 text-right font-bold text-slate-800 dark:text-slate-300">
                            Nak: {nakNum}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* E. AUSPICIOUS & INAUSPICIOUS MUHURTAS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-950 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Auspicious & Inauspicious Timings</span>
              </span>
              <span className="text-xs text-slate-800 dark:text-stone-200 font-bold">শুভ ও অশুভ সময়</span>
            </div>

            {/* Auspicious Timings (Green) */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 dark:border-emerald-800 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Auspicious Windows (শুভ মুহূর্ত — শুভ কার্যের জন্য প্রশস্ত)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border-2 border-emerald-300 dark:bg-slate-900 dark:border-emerald-800 space-y-0.5">
                  <span className="text-xs text-emerald-900 dark:text-emerald-300 font-bold block">
                    Abhijit Muhurta (অভিজিৎ)
                  </span>
                  <strong className="text-xs font-mono font-black text-emerald-950 dark:text-white block">
                    {bookPanchang.rawPanchang.muhurtas.abhijit.start} – {bookPanchang.rawPanchang.muhurtas.abhijit.end}
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-white border-2 border-emerald-300 dark:bg-slate-900 dark:border-emerald-800 space-y-0.5">
                  <span className="text-xs text-emerald-900 dark:text-emerald-300 font-bold block">
                    Amrit Kaal (অমৃত কাল)
                  </span>
                  <strong className="text-xs font-mono font-black text-emerald-950 dark:text-white block">
                    {bookPanchang.rawPanchang.muhurtas.amritKaal.start} – {bookPanchang.rawPanchang.muhurtas.amritKaal.end}
                  </strong>
                </div>
              </div>
            </div>

            {/* Inauspicious Timings (Red Alert) */}
            <div className="p-3.5 rounded-2xl bg-rose-50/90 border-2 border-rose-300 dark:border-rose-900 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-950 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>Inauspicious Timings (বর্জনীয় সময় — শুভ কাজ বর্জন করুন)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border-2 border-rose-300 dark:bg-slate-900 dark:border-rose-900 space-y-0.5">
                  <span className="text-xs text-rose-900 dark:text-rose-300 font-bold block">
                    Rahu Kaal (রাহু কাল)
                  </span>
                  <strong className="text-xs font-mono font-black text-rose-950 dark:text-rose-400 block">
                    {bookPanchang.rawPanchang.muhurtas.rahuKaal.start} – {bookPanchang.rawPanchang.muhurtas.rahuKaal.end}
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-white border-2 border-rose-300 dark:bg-slate-900 dark:border-rose-900 space-y-0.5">
                  <span className="text-xs text-rose-900 dark:text-rose-300 font-bold block">
                    Yamaganda (যমগণ্ড)
                  </span>
                  <strong className="text-xs font-mono font-black text-rose-950 dark:text-white block">
                    {bookPanchang.rawPanchang.muhurtas.yamaganda.start} – {bookPanchang.rawPanchang.muhurtas.yamaganda.end}
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-white border-2 border-rose-300 dark:bg-slate-900 dark:border-rose-900 col-span-2 sm:col-span-1 space-y-0.5">
                  <span className="text-xs text-rose-900 dark:text-rose-300 font-bold block">
                    Gulika Kaal (গুলিক কাল)
                  </span>
                  <strong className="text-xs font-mono font-black text-rose-950 dark:text-white block">
                    {bookPanchang.rawPanchang.muhurtas.gulikaKaal.start} – {bookPanchang.rawPanchang.muhurtas.gulikaKaal.end}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* F. TRADITIONAL MANIPURI ALMANAC GUIDANCE */}
          <div className={`p-3.5 rounded-2xl border-2 shadow-xs space-y-2.5 ${
            isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-300'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-black text-slate-950 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>Manipuri Almanac Guidance (কাংলৈ থৌরম)</span>
              </span>
              <span className="text-xs text-amber-900 dark:text-amber-400 font-black">
                {getMonthName()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Thasi Maikei */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-0.5">
                <span className="text-xs text-slate-800 dark:text-stone-200 font-bold block">
                  তাসী মাইকৈ (Travel Direction):
                </span>
                <strong className="text-xs font-black text-slate-950 dark:text-amber-300 block">
                  {getThasiMaikei()}
                </strong>
              </div>

              {/* Tatnaba Numit */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-0.5">
                <span className="text-xs text-slate-800 dark:text-stone-200 font-bold block">
                  তৎনবা নুমিৎ (Restricted Days):
                </span>
                <strong className="text-xs font-black text-slate-950 dark:text-amber-300 block">
                  {getTatnabaNumit()}
                </strong>
              </div>

              {/* Sun & Moon Rashi Positions */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 col-span-2 space-y-0.5">
                <span className="text-xs text-slate-800 dark:text-stone-200 font-bold block">
                  সূর্য ও চন্দ্র রাশি সঞ্চার (Sun & Moon Signs):
                </span>
                <div className="text-xs font-black text-slate-950 dark:text-slate-100 space-y-0.5">
                  <div>• {isMeetei ? bookPanchang.astronomical.rabiPadaStrMeetei : bookPanchang.astronomical.rabiPadaStrBengali}</div>
                  <div>• {isMeetei ? bookPanchang.astronomical.chandraTransitMeetei : bookPanchang.astronomical.chandraTransitBengali}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
