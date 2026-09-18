// components/calendar/FullVedicApp.tsx
import React, { useState, useMemo } from 'react';
import {
  Sun,
  Moon,
  Compass,
  Sparkles,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ShieldAlert,
  Flame,
  FileDown,
  Layers,
  Heart,
  Table,
  ChevronDown
} from 'lucide-react';
import { UserBirthProfile, KundliData } from '../../types/astronomy';
import { computeCompleteKundli } from '../../utils/astronomy/engine';
import { calculatePanchang } from '../../utils/astronomy/panchang';
import { detectHinduFestival } from '../../utils/astronomy/festivals';
import { RASHIS } from '../../data/rashis';
import { NorthIndianChart } from '../charts/NorthIndianChart';
import { SouthIndianChart } from '../charts/SouthIndianChart';
import { DivisionalSelector } from '../charts/DivisionalSelector';
import { PlanetaryTable } from '../charts/PlanetaryTable';
import { ActiveDashaCard } from '../dasha/ActiveDashaCard';
import { DashaTreeViewer } from '../dasha/DashaTreeViewer';
import { DoshaBadges } from '../doshas/DoshaBadges';
import { ManglikCard } from '../doshas/ManglikCard';
import { SadeSatiTracker } from '../doshas/SadeSatiTracker';
import { YogaList } from '../yogas/YogaList';
import { KundliMatching } from '../matching/KundliMatching';
import { LocationInput } from '../places/LocationInput';
import { MuhurtaTimeline } from '../panchang/MuhurtaTimeline';
import { ChoghadiyaTable } from '../panchang/ChoghadiyaTable';
import { DailyEphemerisTable } from './DailyEphemerisTable';
import { Card } from '../common/Card';

interface MonthCell {
  day: number;
  fullDate: string;
  tithi: string;
  paksha: 'S' | 'K'; // Shukla / Krishna
  nakshatra: string;
  festival?: string;
  isToday?: boolean;
  isCurrentMonth: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const FullVedicApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'kundli'>('calendar');
  
  // Date & View state
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().split('T')[0], [today]);

  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(8); // 0-indexed: 8 = September
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-09-18');
  
  // Geolocation & Observation coordinates
  const [profile, setProfile] = useState<UserBirthProfile>({
    name: 'Rajesh Kumar',
    gender: 'Male',
    dob: '2026-09-18',
    tob: '10:30:00',
    place: 'New Delhi, Delhi, India',
    lat: 28.6139,
    lng: 77.2090,
    timezone: 5.5,
  });

  // Kundli view options
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [activeDivisional, setActiveDivisional] = useState<string>('D1');
  const [kundliSubTab, setKundliSubTab] = useState<'chart' | 'planets' | 'dasha' | 'doshas' | 'matching'>('chart');
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState<boolean>(false);
  const [showFullEphemeris, setShowFullEphemeris] = useState<boolean>(false);

  // Selected Day number
  const selectedDay = useMemo(() => {
    const parts = selectedDateStr.split('-').map((v) => parseInt(v, 10));
    return parts[2] || 18;
  }, [selectedDateStr]);

  // Selected Month Title display
  const selectedMonthTitle = useMemo(() => {
    return `${MONTH_NAMES[currentMonthIndex]} ${currentYear}`;
  }, [currentMonthIndex, currentYear]);

  // Compute 6x7 Month Grid dynamically for currentYear & currentMonthIndex
  const fullMonthCells = useMemo<MonthCell[]>(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // Monday = 0, Sunday = 6
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

    // Previous month total days
    const lastDayOfPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();

    const cells: MonthCell[] = [];

    // 1. Trailing days from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const pDay = lastDayOfPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonthIndex - 1, pDay);
      const pYear = prevDate.getFullYear();
      const pMonthStr = String(prevDate.getMonth() + 1).padStart(2, '0');
      const pDayStr = String(pDay).padStart(2, '0');
      const fDate = `${pYear}-${pMonthStr}-${pDayStr}`;

      const pPanchang = calculatePanchang(fDate, '06:00', profile.lat, profile.lng, profile.timezone);
      const festivalInfo = detectHinduFestival(pPanchang, fDate);
      const tithiClean = pPanchang.tithi.name.replace(/^(Shukla|Krishna)\s+/, '').split(' ')[0] || 'Tithi';

      cells.push({
        day: pDay,
        fullDate: fDate,
        tithi: tithiClean,
        paksha: pPanchang.tithi.paksha === 'Shukla' ? 'S' : 'K',
        nakshatra: pPanchang.nakshatra.name.split(' ')[0] || '',
        festival: festivalInfo?.name,
        isToday: fDate === todayStr,
        isCurrentMonth: false,
      });
    }

    // 2. Days of the current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const mStr = String(currentMonthIndex + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const fDate = `${currentYear}-${mStr}-${dStr}`;

      const panchang = calculatePanchang(fDate, '06:00', profile.lat, profile.lng, profile.timezone);
      const festivalInfo = detectHinduFestival(panchang, fDate);
      const tithiClean = panchang.tithi.name.replace(/^(Shukla|Krishna)\s+/, '').split(' ')[0] || 'Tithi';

      cells.push({
        day: d,
        fullDate: fDate,
        tithi: tithiClean,
        paksha: panchang.tithi.paksha === 'Shukla' ? 'S' : 'K',
        nakshatra: panchang.nakshatra.name.split(' ')[0] || '',
        festival: festivalInfo?.name,
        isToday: fDate === todayStr,
        isCurrentMonth: true,
      });
    }

    // 3. Trailing days for the next month to complete the 35 or 42 grid
    const totalCellsNeeded = cells.length > 35 ? 42 : 35;
    const remaining = totalCellsNeeded - cells.length;
    for (let n = 1; n <= remaining; n++) {
      const nextDate = new Date(currentYear, currentMonthIndex + 1, n);
      const nYear = nextDate.getFullYear();
      const nMonthStr = String(nextDate.getMonth() + 1).padStart(2, '0');
      const nDayStr = String(n).padStart(2, '0');
      const fDate = `${nYear}-${nMonthStr}-${nDayStr}`;

      const nPanchang = calculatePanchang(fDate, '06:00', profile.lat, profile.lng, profile.timezone);
      const festivalInfo = detectHinduFestival(nPanchang, fDate);
      const tithiClean = nPanchang.tithi.name.replace(/^(Shukla|Krishna)\s+/, '').split(' ')[0] || 'Tithi';

      cells.push({
        day: n,
        fullDate: fDate,
        tithi: tithiClean,
        paksha: nPanchang.tithi.paksha === 'Shukla' ? 'S' : 'K',
        nakshatra: nPanchang.nakshatra.name.split(' ')[0] || '',
        festival: festivalInfo?.name,
        isToday: fDate === todayStr,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [currentYear, currentMonthIndex, profile.lat, profile.lng, profile.timezone, todayStr]);

  // Compute selected day Kundli / Panchang data
  const calendarData: KundliData = useMemo(() => {
    const updatedProfile: UserBirthProfile = {
      ...profile,
      dob: selectedDateStr,
    };
    return computeCompleteKundli(updatedProfile);
  }, [profile, selectedDateStr]);

  // Compute Kundli data specifically for birth profile in Tab 2
  const kundliBirthData: KundliData = useMemo(() => {
    return computeCompleteKundli(profile);
  }, [profile]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  const handleCurrentMonth = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonthIndex(today.getMonth());
    setSelectedDateStr(todayStr);
  };

  const handleDaySelect = (fullDate: string) => {
    setSelectedDateStr(fullDate);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const activeChart = kundliBirthData.divisionalCharts[activeDivisional] || kundliBirthData.divisionalCharts.D1;

  // Sun & Moon calculations
  const sunRashiName = RASHIS[calendarData.planets.Sun?.rashi ?? 0]?.sanskritName || 'Kanya';
  const moonRashiName = RASHIS[calendarData.planets.Moon?.rashi ?? 0]?.sanskritName || 'Vrishchika';

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-900 selection:bg-amber-100 selection:text-amber-950 flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 border-b border-amber-200/80 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-8 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-100">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold tracking-tight text-slate-900">GrahaSetu</h1>
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                  SIDEREAL LAHIRI
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-800">Astronomical Calendar & Ephemeris Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Geocoded Location Badge */}
            <div className="relative">
              <button
                onClick={() => setIsLocationSelectorOpen(!isLocationSelectorOpen)}
                className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/70 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-amber-100/70 transition shadow-2xs cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[200px]">
                  {profile.place.split(',')[0]} (UTC {profile.timezone >= 0 ? `+${profile.timezone}` : profile.timezone})
                </span>
                <ChevronDown className="h-3 w-3 text-stone-500" />
              </button>

              {isLocationSelectorOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-amber-200 bg-white p-4 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Set Reference Coordinates</span>
                    <button
                      onClick={() => setIsLocationSelectorOpen(false)}
                      className="text-xs text-stone-500 hover:text-slate-800 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <LocationInput
                    value={profile.place}
                    latitude={profile.lat}
                    longitude={profile.lng}
                    timezone={profile.timezone}
                    onChange={(loc) => {
                      setProfile((prev) => ({
                        ...prev,
                        place: loc.place,
                        lat: loc.lat,
                        lng: loc.lng,
                        timezone: loc.timezone,
                      }));
                      setIsLocationSelectorOpen(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex rounded-xl border border-amber-200 bg-amber-50/50 p-1">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-amber-900 hover:bg-amber-100/50'
                }`}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>Calendar & Panchang</span>
              </button>
              <button
                onClick={() => setActiveTab('kundli')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'kundli'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-amber-900 hover:bg-amber-100/50'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Kundli Engine</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 flex-1">
        {/* ================================================================= */}
        {/* TAB 1: FULL MONTH CALENDAR & SELECTED DAY PANCHANG                */}
        {/* ================================================================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Top Month Navigation Strip */}
            <div className="flex flex-col gap-3 rounded-2xl border border-amber-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 ring-1 ring-amber-200">
                  <CalendarIcon className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-100/90 px-2 py-0.5 text-[11px] font-bold text-amber-950 border border-amber-300">
                      Vikram Samvat {calendarData.panchang.samvat.vikram}
                    </span>
                    <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-bold text-stone-700 border border-stone-300">
                      Shaka {calendarData.panchang.samvat.shaka}
                    </span>
                    <span className="text-xs font-semibold text-amber-900">
                      {calendarData.panchang.ritu.name}
                    </span>
                  </div>
                  <h2 className="mt-0.5 font-serif text-xl font-bold text-slate-900">{selectedMonthTitle}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-white text-slate-700 hover:bg-amber-50 transition active:scale-95 shadow-2xs cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCurrentMonth}
                  className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-amber-50 transition active:scale-95 shadow-2xs cursor-pointer"
                >
                  Current Month
                </button>
                <button
                  onClick={handleNextMonth}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-white text-slate-700 hover:bg-amber-50 transition active:scale-95 shadow-2xs cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Complete Month Grid (6x7 Layout) */}
            <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-sm">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-amber-200 bg-amber-50/60 text-center text-xs font-bold text-amber-950">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName) => (
                  <div key={dayName} className="py-2.5 sm:block">{dayName}</div>
                ))}
              </div>

              {/* Day Grid Matrix */}
              <div className="grid grid-cols-7 divide-x divide-y divide-amber-100">
                {fullMonthCells.map((cell, idx) => {
                  const isSelected = selectedDateStr === cell.fullDate && cell.isCurrentMonth;
                  return (
                    <button
                      key={idx}
                      onClick={() => cell.isCurrentMonth && handleDaySelect(cell.fullDate)}
                      disabled={!cell.isCurrentMonth}
                      className={`relative min-h-[96px] p-2.5 text-left transition-all cursor-pointer ${
                        !cell.isCurrentMonth
                          ? 'bg-stone-50/50 opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-amber-50/95 ring-2 ring-inset ring-amber-500'
                          : 'hover:bg-amber-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-black ${isSelected ? 'text-amber-950 font-serif' : 'text-slate-800'}`}>
                          {cell.day}
                        </span>
                        {cell.isToday && (
                          <span className="rounded-full bg-amber-600 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-2xs">
                            Today
                          </span>
                        )}
                        <span className={`text-[10px] font-bold ${cell.paksha === 'S' ? 'text-amber-700' : 'text-indigo-700'}`}>
                          {cell.paksha === 'S' ? 'Shukla' : 'Krishna'}
                        </span>
                      </div>

                      <div className="mt-1 text-[11px] font-bold text-slate-900 truncate">{cell.tithi}</div>
                      <div className="text-[10px] text-stone-500 font-medium truncate">{cell.nakshatra}</div>

                      {cell.festival && (
                        <div className="mt-1 line-clamp-1 rounded border border-rose-200 bg-rose-50 px-1 py-0.5 text-[9px] font-bold text-rose-800">
                          {cell.festival}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Expanded Panchang Details */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Panchang Pillars for Selected Day */}
              <div className="lg:col-span-2 rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-amber-600" />
                    <h3 className="font-serif text-lg font-bold text-slate-900">
                      Detailed Panchang: {new Date(selectedDateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-600">
                    Lahiri Ayanamsa: <strong className="text-amber-900">{calendarData.panchang.ayanamsa.formatted}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {/* Tithi */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Tithi</div>
                    <div className="mt-1 text-base font-bold text-slate-900 truncate">
                      {calendarData.panchang.tithi.name}
                    </div>
                    <div className="mt-0.5 text-xs text-stone-600">
                      {calendarData.panchang.tithi.endsAt}
                    </div>
                  </div>

                  {/* Nakshatra */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Nakshatra</div>
                    <div className="mt-1 text-base font-bold text-slate-900 truncate">
                      {calendarData.panchang.nakshatra.name}
                    </div>
                    <div className="mt-0.5 text-xs text-stone-600">
                      Pada {calendarData.panchang.nakshatra.pada} • {calendarData.panchang.nakshatra.endsAt}
                    </div>
                  </div>

                  {/* Yoga */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Yoga</div>
                    <div className="mt-1 text-base font-bold text-slate-900 truncate">
                      {calendarData.panchang.yoga.name}
                    </div>
                    <div className="mt-0.5 text-xs text-stone-600">
                      {calendarData.panchang.yoga.endsAt}
                    </div>
                  </div>

                  {/* Karana */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Karana</div>
                    <div className="mt-1 text-base font-bold text-slate-900 truncate">
                      {calendarData.panchang.karana.name}
                    </div>
                    <div className="mt-0.5 text-xs text-stone-600">
                      Lord: {calendarData.panchang.karana.lord} ({calendarData.panchang.karana.type})
                    </div>
                  </div>

                  {/* Vara */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Vara</div>
                    <div className="mt-1 text-base font-bold text-slate-900 truncate">
                      {calendarData.panchang.vara.sanskritName}
                    </div>
                    <div className="mt-0.5 text-xs text-stone-600">
                      Ruler: {calendarData.panchang.vara.lord}
                    </div>
                  </div>

                  {/* Sun Transit Sign */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Sun Transit Sign</div>
                    <div className="mt-1 text-base font-bold text-slate-900 truncate">
                      {sunRashiName}
                    </div>
                    <div className="mt-0.5 text-xs text-stone-600">
                      Surya Sankranti Active
                    </div>
                  </div>
                </div>

                {/* Sunrise / Sunset Timing Bar */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50/80 p-3.5 text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-600" />
                    <span>Sunrise: <strong>{calendarData.panchang.sunrise}</strong></span>
                    <span className="text-stone-400">•</span>
                    <span>Sunset: <strong>{calendarData.panchang.sunset}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-indigo-600" />
                    <span>Solar Noon: <strong>{calendarData.panchang.solarNoon}</strong></span>
                    <span className="text-stone-400">•</span>
                    <span>Moon Sign: <strong>{moonRashiName}</strong></span>
                  </div>
                </div>
              </div>

              {/* Muhurtas Sidebar */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-amber-100 pb-3">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <h3 className="font-serif text-base font-bold text-slate-900">Muhurtas & Inauspicious Kaal</h3>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                    <div>
                      <div className="text-xs font-bold text-emerald-950">Abhijit Muhurta</div>
                      <div className="text-[10px] font-medium text-emerald-800">Auspicious for all deeds</div>
                    </div>
                    <div className="text-xs font-black text-emerald-950">
                      {calendarData.muhurta.abhijitMuhurta.start} – {calendarData.muhurta.abhijitMuhurta.end}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/70 p-3">
                    <div>
                      <div className="text-xs font-bold text-rose-950">Rahu Kaal</div>
                      <div className="text-[10px] font-medium text-rose-800">Avoid new ventures</div>
                    </div>
                    <div className="text-xs font-black text-rose-950">
                      {calendarData.muhurta.rahuKaal.start} – {calendarData.muhurta.rahuKaal.end}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 p-3">
                    <div>
                      <div className="text-xs font-bold text-amber-950">Yamaganda</div>
                      <div className="text-[10px] font-medium text-amber-800">Inauspicious window</div>
                    </div>
                    <div className="text-xs font-bold text-amber-950">
                      {calendarData.muhurta.yamaganda.start} – {calendarData.muhurta.yamaganda.end}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Gulika Kaal</div>
                      <div className="text-[10px] font-medium text-stone-600">Neutral/Routine actions</div>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {calendarData.muhurta.gulikaKaal.start} – {calendarData.muhurta.gulikaKaal.end}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Ephemeris & Choghadiyas */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-700" />
                  <h3 className="font-serif text-lg font-bold text-slate-900">Astronomical Ephemeris & Choghadiyas</h3>
                </div>
                <button
                  onClick={() => setShowFullEphemeris(!showFullEphemeris)}
                  className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-50 transition shadow-2xs cursor-pointer"
                >
                  {showFullEphemeris ? 'Hide Detailed Tables' : 'View Full Choghadiya & Planetary Ephemeris'}
                </button>
              </div>

              {showFullEphemeris && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                    <Card
                      title="Complete Muhurta Timeline (शुभ व अशुभ काल)"
                      subtitle="Auspicious, Sandhya, and Inauspicious Periods"
                      icon={<Clock className="w-5 h-5" />}
                    >
                      <MuhurtaTimeline muhurta={calendarData.muhurta} />
                    </Card>

                    <Card
                      title="Choghadiya Muhurta Suite (दैनिक चौघड़िया)"
                      subtitle="8 Auspicious & Inauspicious Segments of Day and Night"
                      icon={<Sparkles className="w-5 h-5" />}
                    >
                      <ChoghadiyaTable
                        dayChoghadiya={calendarData.muhurta.choghadiyaDay}
                        nightChoghadiya={calendarData.muhurta.choghadiyaNight}
                      />
                    </Card>
                  </div>

                  <DailyEphemerisTable
                    planets={calendarData.planets}
                    ayanamsaStr={calendarData.panchang.ayanamsa.formatted}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: COMPLETE KUNDLI ENGINE & DASHAS                            */}
        {/* ================================================================= */}
        {activeTab === 'kundli' && (
          <div className="space-y-6">
            {/* Birth Details Input Panel */}
            <div className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  <h2 className="font-serif text-lg font-bold text-slate-900">Horoscope & Birth Telemetry Parameters</h2>
                </div>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 cursor-pointer active:scale-95 transition"
                >
                  <FileDown className="h-4 w-4" /> Export Chart PDF
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-600">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-600">Gender</label>
                  <div className="mt-1 flex rounded-xl border border-amber-200 bg-amber-50/40 p-0.5">
                    <button
                      onClick={() => setProfile((prev) => ({ ...prev, gender: 'Male' }))}
                      className={`w-1/2 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        profile.gender === 'Male'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setProfile((prev) => ({ ...prev, gender: 'Female' }))}
                      className={`w-1/2 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        profile.gender === 'Female'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-600">Date of Birth</label>
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) => e.target.value && setProfile((prev) => ({ ...prev, dob: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none shadow-2xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-600">Time of Birth</label>
                  <input
                    type="time"
                    step="1"
                    value={profile.tob}
                    onChange={(e) => setProfile((prev) => ({ ...prev, tob: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none shadow-2xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-600">Birth Place (Google Places)</label>
                  <input
                    type="text"
                    value={profile.place}
                    onChange={(e) => setProfile((prev) => ({ ...prev, place: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none shadow-2xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Kundli Navigation Sub-tabs */}
            <div className="flex border-b border-amber-200 gap-2 pb-1 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setKundliSubTab('chart')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
                  kundliSubTab === 'chart'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-amber-900 hover:bg-amber-50'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Charts & Vargas</span>
              </button>
              <button
                onClick={() => setKundliSubTab('planets')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
                  kundliSubTab === 'planets'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-amber-900 hover:bg-amber-50'
                }`}
              >
                <Table className="h-3.5 w-3.5" />
                <span>Planetary Table</span>
              </button>
              <button
                onClick={() => setKundliSubTab('dasha')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
                  kundliSubTab === 'dasha'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-amber-900 hover:bg-amber-50'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>120-Yr Vimshottari Dasha</span>
              </button>
              <button
                onClick={() => setKundliSubTab('doshas')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
                  kundliSubTab === 'doshas'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-amber-900 hover:bg-amber-50'
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Doshas & Yogas</span>
              </button>
              <button
                onClick={() => setKundliSubTab('matching')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
                  kundliSubTab === 'matching'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-amber-900 hover:bg-amber-50'
                }`}
              >
                <Heart className="h-3.5 w-3.5" />
                <span>36-Guna Matchmaking</span>
              </button>
            </div>

            {/* Subtab 1: Charts & Vargas */}
            {kundliSubTab === 'chart' && (
              <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
                  <div>
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      {activeChart.name}: {activeChart.title}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Lagna: {kundliBirthData.lagna.rashiName} ({kundliBirthData.lagna.rashiSanskrit}) at {kundliBirthData.lagna.dms.deg}° {kundliBirthData.lagna.dms.min}'
                    </p>
                  </div>
                </div>

                {/* Divisional Selector */}
                <DivisionalSelector
                  divisionalCharts={kundliBirthData.divisionalCharts}
                  activeCode={activeDivisional}
                  onSelect={setActiveDivisional}
                  chartStyle={chartStyle}
                  onToggleChartStyle={setChartStyle}
                />

                {/* Chart SVG */}
                <div className="max-w-2xl mx-auto">
                  {chartStyle === 'north' ? (
                    <NorthIndianChart
                      houses={activeChart.houses}
                      title={activeChart.title}
                    />
                  ) : (
                    <SouthIndianChart
                      houses={activeChart.houses}
                      planets={kundliBirthData.planets}
                      lagnaRashi={kundliBirthData.lagna.rashi}
                      title={activeChart.title}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Subtab 2: Planetary Table */}
            {kundliSubTab === 'planets' && (
              <PlanetaryTable planets={kundliBirthData.planets} />
            )}

            {/* Subtab 3: Vimshottari Dasha */}
            {kundliSubTab === 'dasha' && (
              <div className="space-y-5">
                <ActiveDashaCard
                  birthBalance={kundliBirthData.dasha.birthBalance}
                  tree={kundliBirthData.dasha.tree}
                  activePath={kundliBirthData.dasha.activePath}
                />
                <div className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm">
                  <DashaTreeViewer tree={kundliBirthData.dasha.tree} />
                </div>
              </div>
            )}

            {/* Subtab 4: Doshas & Yogas */}
            {kundliSubTab === 'doshas' && (
              <div className="space-y-6">
                <DoshaBadges
                  manglik={kundliBirthData.manglik}
                  sadeSati={kundliBirthData.sadeSati}
                  yogas={kundliBirthData.yogas}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <ManglikCard manglik={kundliBirthData.manglik} />
                  <SadeSatiTracker sadeSati={kundliBirthData.sadeSati} />
                </div>
                <YogaList yogas={kundliBirthData.yogas} />
              </div>
            )}

            {/* Subtab 5: 36-Guna Milan */}
            {kundliSubTab === 'matching' && (
              <KundliMatching />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-amber-200/80 py-6 px-4 text-center text-xs text-slate-500 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-900 font-bold font-serif text-sm">
              GrahaSetu
            </span>
            <span>• Full Vedic Astronomical Calendar & Kundli Engine</span>
          </div>
          <div>
            Swiss Ephemeris • Nirayana (Lahiri Ayanamsa) • Progressive Web App (PWA)
          </div>
        </div>
      </footer>
    </div>
  );
};
