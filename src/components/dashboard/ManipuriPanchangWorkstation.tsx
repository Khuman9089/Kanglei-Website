'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Calendar,
  Clock,
  Compass,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  MapPin,
  BookOpen,
  Table as TableIcon,
  LayoutGrid,
  Printer,
  X,
  RefreshCw,
  Share2
} from 'lucide-react';
import ManipuriBookPanchangView from '@/components/panchang/ManipuriBookPanchangView';
import { getManipuriBookPanchang, ManipuriBookPanchangData } from '@/engine/manipuriPanchangBook';
import { toBengaliNumerals, toMeeteiNumerals } from '@/engine/manipuriCalendar';

const PRESET_LOCATIONS = [
  { name: 'Imphal, Manipur', lat: 24.817, lng: 93.936, tz: 5.5 },
  { name: 'New Delhi', lat: 28.6139, lng: 77.209, tz: 5.5 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, tz: 5.5 },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362, tz: 5.5 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, tz: 5.5 },
];

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
  const [script, setScript] = useState<'bengali' | 'meetei' | 'blipi'>('bengali');
  const [viewMode, setViewMode] = useState<'book' | 'excel' | 'cards'>('book');
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

  const isBlipi = script === 'blipi';
  const isBengali = script === 'bengali';

  return (
    <div
      className={`w-full font-sans transition-colors ${
        isEmbedded
          ? 'space-y-4'
          : `p-4 sm:p-6 rounded-3xl border shadow-2xl ${
              isDark ? 'bg-[#0f172a] border-[#334155] text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`
      }`}
    >
      {/* Top Workstation Header & Close Button (if modal) */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-black flex items-center gap-2">
              <span>
                {isBlipi ? 'mEnpurI p\admika' : isBengali ? 'মণিপুরী পঞ্জিকা (Manipuri Book Panchang)' : 'ꯃꯅꯤꯄꯨꯔꯤ ꯄꯟꯆꯥꯡ (Panchang)'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Astrologer Pro
              </span>
            </h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              Physical Manipuri Panchang Book format & 3x8 Kuthi preparation table
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Print Panchang Document"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
              title="Close Workstation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Date, Location & Script Controls Ribbon */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 print:hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Day Stepper & Custom Date Input */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={handlePrevDay}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-xs hover:bg-amber-700 transition-colors cursor-pointer"
              title="Jump to Today"
            >
              📅 Today
            </button>

            <button
              onClick={handleNextDay}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Next Day"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Location Selector & Script Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* Script Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setScript('bengali')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  script === 'bengali'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Bengali Script (Traditional)"
              >
                বাংলা
              </button>
              <button
                onClick={() => setScript('meetei')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  script === 'meetei'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Meetei Mayek Script (Unicode)"
              >
                ꯃꯤꯇꯩ
              </button>
              <button
                onClick={() => setScript('blipi')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  script === 'blipi'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="BLipi15 Font"
              >
                BLipi
              </button>
            </div>

            {/* Location Selector */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <select
                value={selectedLocation.name}
                onChange={(e) => {
                  const loc = PRESET_LOCATIONS.find((l) => l.name === e.target.value);
                  if (loc) setSelectedLocation(loc);
                }}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
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

        {/* View Mode Switcher */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('book')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'book'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Book View (Authentic)</span>
            </button>

            <button
              onClick={() => setViewMode('excel')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'excel'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>3x8 Table (Excel qw.xlsm)</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Modern Cards</span>
            </button>
          </div>

          {bookPanchang && (
            <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
              {bookPanchang.header.manipuriMonthBengali} · {bookPanchang.header.sakabdaBengali}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading || !bookPanchang ? (
        <div className="p-12 text-center space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Loading Manipuri Panchang Data...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* VIEW 1: AUTHENTIC MANIPURI PANCHANG BOOK VIEW */}
          {viewMode === 'book' && (
            <ManipuriBookPanchangView data={bookPanchang} script={script} />
          )}

          {/* VIEW 2: 3x8 EXCEL KUTHI PREPARATION TABLE */}
          {viewMode === 'excel' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3
                    className={`font-bold text-xl text-slate-900 dark:text-slate-100 ${
                      isBlipi ? 'font-blipi text-2xl' : 'font-serif'
                    }`}
                  >
                    {isBlipi
                      ? '3x8 msIz sarxI'
                      : isBengali
                      ? '৩x৮ সংখ্যা সারণী'
                      : '꯳x꯸ ꯃꯁꯤꯡ ꯇꯦꯕꯜ'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Danda-Pal-Bipal 3x8 table (8 rows x 3 columns)
                  </p>
                </div>

                <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                  Date: {bookPanchang.dateStr}
                </div>
              </div>

              {/* The 5x3 Table */}
              <div className="max-w-xl mx-auto border-2 border-slate-800 dark:border-slate-600 rounded-lg overflow-hidden shadow-md">
                <table
                  className={`w-full text-center divide-y-2 divide-slate-800 dark:divide-slate-600 ${
                    isBlipi ? 'font-blipi text-lg font-bold' : 'font-mono text-base font-bold'
                  }`}
                >
                  <thead className="bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="py-2.5 px-4 border-r-2 border-slate-800 dark:border-slate-600">
                        {isBlipi
                          ? bookPanchang.astronomical.numericalTable.headers.col1.blipi
                          : isBengali
                          ? bookPanchang.astronomical.numericalTable.headers.col1.bengali
                          : bookPanchang.astronomical.numericalTable.headers.col1.meetei}
                      </th>
                      <th className="py-2.5 px-4 border-r-2 border-slate-800 dark:border-slate-600 text-amber-800 dark:text-amber-400">
                        {isBlipi
                          ? bookPanchang.astronomical.numericalTable.headers.col2.blipi
                          : isBengali
                          ? bookPanchang.astronomical.numericalTable.headers.col2.bengali
                          : bookPanchang.astronomical.numericalTable.headers.col2.meetei}
                      </th>
                      <th className="py-2.5 px-4">
                        {isBlipi
                          ? bookPanchang.astronomical.numericalTable.headers.col3.blipi
                          : isBengali
                          ? bookPanchang.astronomical.numericalTable.headers.col3.bengali
                          : bookPanchang.astronomical.numericalTable.headers.col3.meetei}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-800 dark:divide-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                    {bookPanchang.astronomical.numericalTable.rows.map((row, rIdx) => (
                      <tr
                        key={`excel-row-${rIdx}`}
                        className="hover:bg-amber-50/60 dark:hover:bg-slate-900/60 transition-colors"
                        title={`${row.labelEn} (${row.labelBlipi})`}
                      >
                        <td className="py-3 px-6 border-r-2 border-slate-800 dark:border-slate-600">
                          {isBlipi ? row.yesterday.formattedBlipi : row.yesterday.formattedExcel}
                        </td>
                        <td className="py-3 px-6 border-r-2 border-slate-800 dark:border-slate-600 font-extrabold text-amber-800 dark:text-amber-400">
                          {isBlipi ? row.today.formattedBlipi : row.today.formattedExcel}
                        </td>
                        <td className="py-3 px-6">
                          {isBlipi ? row.tomorrow.formattedBlipi : row.tomorrow.formattedExcel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Row Descriptions */}
              <div className="max-w-xl mx-auto space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div
                  className={`font-bold text-slate-900 dark:text-slate-100 mb-1 ${
                    isBlipi ? 'font-blipi text-sm' : ''
                  }`}
                >
                  {isBlipi ? '3x8 dZ: p: ib: sarxI (1-8):' : '3x8 Table (Rows 1 to 8):'}
                </div>
                {bookPanchang.astronomical.numericalTable.rows.map((r, i) => (
                  <div key={`row-legend-${i}`} className="flex items-center justify-between">
                    <span className={isBlipi ? 'font-blipi' : ''}>
                      {isBlipi ? `sarxI ${i + 1}:` : isBengali ? `সারি ${toBengaliNumerals(i + 1)}:` : `ꯄꯔꯤꯡ ${toMeeteiNumerals(i + 1)}:`}
                    </span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                      {r.formattedEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: MODERN CARDS */}
          {viewMode === 'cards' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Sunrise & Sunset</span>
                    <Sun className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {bookPanchang.astronomical.sunriseTimeStr} / {bookPanchang.astronomical.sunsetTimeStr}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Day Length: {bookPanchang.rawPanchang.sunMoonTimings.dayLength}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Tithi / Thaban</span>
                    <Moon className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {bookPanchang.rawPanchang.fiveAngas.tithi.summary}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {isBlipi
                      ? bookPanchang.header.manipuriTithiStrBlipi
                      : isBengali
                      ? bookPanchang.header.manipuriTithiStrBengali
                      : bookPanchang.header.manipuriTithiStrMeetei}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Nakshatra</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {bookPanchang.rawPanchang.fiveAngas.nakshatra.name} (Pada {bookPanchang.rawPanchang.fiveAngas.nakshatra.pada})
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Lord: {bookPanchang.rawPanchang.fiveAngas.nakshatra.lord}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Yoga & Karana</span>
                    <Compass className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {bookPanchang.rawPanchang.fiveAngas.yoga.name} / {bookPanchang.rawPanchang.fiveAngas.karana.name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Rahu Kaal: {bookPanchang.rawPanchang.muhurtas.rahuKaal.start} – {bookPanchang.rawPanchang.muhurtas.rahuKaal.end}
                  </div>
                </div>
              </div>

              {/* Muhurtas */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  Auspicious & Inauspicious Muhurtas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Abhijit Muhurat</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {bookPanchang.rawPanchang.muhurtas.abhijit.start} – {bookPanchang.rawPanchang.muhurtas.abhijit.end}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                    <span className="font-bold text-rose-800 dark:text-rose-300 block mb-1">Rahu Kaal (Avoid)</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {bookPanchang.rawPanchang.muhurtas.rahuKaal.start} – {bookPanchang.rawPanchang.muhurtas.rahuKaal.end}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">Amrit Kaal</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {bookPanchang.rawPanchang.muhurtas.amritKaal.start} – {bookPanchang.rawPanchang.muhurtas.amritKaal.end}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
