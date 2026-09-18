// components/calendar/VedicCalendarHome.tsx
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Compass, 
  Sparkles, 
  Clock, 
  MapPin, 
  Calendar as CalendarIcon,
  ChevronDown,
  Layers
} from 'lucide-react';
import { UserBirthProfile, KundliData } from '../../types/astronomy';
import { calculatePanchang } from '../../utils/astronomy/panchang';
import { detectHinduFestival } from '../../utils/astronomy/festivals';
import { RASHIS } from '../../data/rashis';
import { LocationInput } from '../places/LocationInput';
import { PanchangFiveAngas } from './PanchangFiveAngas';
import { DailyEphemerisTable } from './DailyEphemerisTable';
import { MuhurtaTimeline } from '../panchang/MuhurtaTimeline';
import { ChoghadiyaTable } from '../panchang/ChoghadiyaTable';
import { Card } from '../common/Card';

interface VedicCalendarHomeProps {
  currentDate: string;
  profile: UserBirthProfile;
  calendarData: KundliData;
  onDateChange: (newDate: string) => void;
  onLocationChange: (loc: { place: string; lat: number; lng: number; timezone: number }) => void;
  onOpenKundliModal: () => void;
  onOpenInfoModal: () => void;
  onPrint: () => void;
}

interface DayPanchangSummary {
  dateNumber: number;
  fullDate: string;
  dayName: string;
  tithi: string;
  paksha: 'Shukla' | 'Krishna';
  nakshatra: string;
  festival?: string;
  isToday?: boolean;
}

export const VedicCalendarHome: React.FC<VedicCalendarHomeProps> = ({
  currentDate,
  profile,
  calendarData,
  onDateChange,
  onLocationChange,
  onOpenKundliModal,
}) => {
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [showFullEphemeris, setShowFullEphemeris] = useState(false);

  // Parse current selected date
  const [year, month, day] = useMemo(() => {
    const parts = currentDate.split('-').map((v) => parseInt(v, 10));
    return [parts[0] || 2026, parts[1] || 9, parts[2] || 18];
  }, [currentDate]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute 7-day week strip centered around the selected date
  const weekCalendarDays = useMemo<DayPanchangSummary[]>(() => {
    const baseDate = new Date(year, month - 1, day);
    const dayOfWeek = (baseDate.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    
    // Start from Monday of the current week
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() - dayOfWeek);

    const days: DayPanchangSummary[] = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const dYear = d.getFullYear();
      const dMonth = String(d.getMonth() + 1).padStart(2, '0');
      const dDay = String(d.getDate()).padStart(2, '0');
      const fDateStr = `${dYear}-${dMonth}-${dDay}`;

      // Calculate lightweight panchang for this day
      const dayPanchang = calculatePanchang(
        fDateStr,
        '06:00',
        profile.lat,
        profile.lng,
        profile.timezone
      );

      const festivalInfo = detectHinduFestival(dayPanchang, fDateStr);
      const tithiClean = dayPanchang.tithi.name.replace(/^(Shukla|Krishna)\s+/, '').split(' ')[0] || 'Tithi';

      days.push({
        dateNumber: d.getDate(),
        fullDate: fDateStr,
        dayName: dayNames[i],
        tithi: tithiClean,
        paksha: dayPanchang.tithi.paksha,
        nakshatra: dayPanchang.nakshatra.name.split(' ')[0] || '',
        festival: festivalInfo?.name,
        isToday: fDateStr === todayStr,
      });
    }

    return days;
  }, [year, month, day, profile.lat, profile.lng, profile.timezone, todayStr]);

  // Hindu month name formatting
  const hinduMonthHeader = useMemo(() => {
    const samvatVikram = calendarData.panchang.samvat.vikram;
    const months = [
      'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
      'Shravana', 'Bhadrapada', 'Ashwina', 'Kartika',
      'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
    ];
    const approxMonthIdx = (month + 9) % 12;
    const primaryMonth = months[approxMonthIdx] || 'Bhadrapada';
    const nextMonth = months[(approxMonthIdx + 1) % 12] || 'Ashwina';

    return `${primaryMonth} - ${nextMonth} ${samvatVikram}`;
  }, [calendarData.panchang.samvat.vikram, month]);

  // Handle navigation
  const handlePrevDay = () => {
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    onDateChange(todayStr);
  };

  // Sun & Moon telemetry
  const sunPlanet = calendarData.planets.Sun;
  const moonPlanet = calendarData.planets.Moon;
  const sunRashiName = RASHIS[sunPlanet?.rashi ?? 0]?.sanskritName || 'Kanya';
  const moonRashiName = RASHIS[moonPlanet?.rashi ?? 0]?.sanskritName || 'Vrishchika';
  const sunDeg = `${String(Math.floor(sunPlanet?.degreesInRashi || 0)).padStart(2, '0')}° ${String(Math.floor(((sunPlanet?.degreesInRashi || 0) % 1) * 60)).padStart(2, '0')}'`;
  const moonDeg = `${String(Math.floor(moonPlanet?.degreesInRashi || 0)).padStart(2, '0')}° ${String(Math.floor(((moonPlanet?.degreesInRashi || 0) % 1) * 60)).padStart(2, '0')}'`;

  // Active Choghadiya lookup
  const activeChoghadiya = useMemo(() => {
    const all = [...calendarData.muhurta.choghadiyaDay, ...calendarData.muhurta.choghadiyaNight];
    const found = all.find((c) => c.isCurrent) || calendarData.muhurta.choghadiyaDay[0];
    return found;
  }, [calendarData.muhurta]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 border-b border-amber-200/70 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-8 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-100">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-slate-900 tracking-tight">GrahaSetu</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                  Vedic Swiss Ephemeris
                </span>
              </div>
              <p className="text-xs font-medium text-amber-800">Hindu Astronomical Calendar</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Geocoded Location Badge / Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLocationSelectorOpen(!isLocationSelectorOpen)}
                className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/70 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-amber-100/70 shadow-2xs cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[220px]">
                  {profile.place.split(',')[0]} (UTC {profile.timezone >= 0 ? `+${profile.timezone}` : profile.timezone})
                </span>
                <ChevronDown className="h-3 w-3 text-stone-500" />
              </button>

              {isLocationSelectorOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-amber-200 bg-white p-4 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Set Geographic Location</span>
                    <button
                      onClick={() => setIsLocationSelectorOpen(false)}
                      className="text-xs text-stone-500 hover:text-slate-800"
                    >
                      Close
                    </button>
                  </div>
                  <LocationInput
                    value={profile.place}
                    latitude={profile.lat}
                    longitude={profile.lng}
                    timezone={profile.timezone}
                    onChange={(loc: { place: string; lat: number; lng: number; timezone: number }) => {
                      onLocationChange(loc);
                      setIsLocationSelectorOpen(false);
                    }}
                  />
                  <div className="mt-2 text-[10px] text-stone-500">
                    Latitude: {profile.lat.toFixed(4)}° • Longitude: {profile.lng.toFixed(4)}°
                  </div>
                </div>
              )}
            </div>

            {/* Kundli Modal Launch Button */}
            <button
              onClick={onOpenKundliModal}
              className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-amber-600/30 transition hover:from-amber-600 hover:to-amber-700 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Kundli Engine</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 flex-1 space-y-6">
        {/* Month Navigation & Samvat Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900 border border-amber-300">
                Vikram Samvat {calendarData.panchang.samvat.vikram}
              </span>
              <span className="rounded-md bg-stone-200/80 px-2 py-0.5 text-[11px] font-semibold text-stone-700 border border-stone-300">
                Shaka {calendarData.panchang.samvat.shaka}
              </span>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                {calendarData.panchang.ritu.name}
              </span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">{hinduMonthHeader}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-white text-slate-700 transition hover:bg-amber-50 active:scale-95 shadow-2xs cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={handleToday}
              className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:bg-amber-50 active:scale-95 shadow-2xs cursor-pointer"
            >
              Today
            </button>

            {/* Datepicker input */}
            <input
              type="date"
              value={currentDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="h-9 rounded-lg border border-amber-200 bg-white px-2.5 text-xs font-bold text-slate-800 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
            />

            <button
              onClick={handleNextDay}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-white text-slate-700 transition hover:bg-amber-50 active:scale-95 shadow-2xs cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Clean Week Calendar Strip */}
        <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-sm">
          <div className="grid grid-cols-7 border-b border-amber-100 bg-amber-50/50 text-center text-xs font-bold text-amber-950/80">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
              <div key={dayName} className="py-2.5">{dayName}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 divide-x divide-amber-100/80">
            {weekCalendarDays.map((d) => {
              const isSelected = currentDate === d.fullDate;
              return (
                <button
                  key={d.fullDate}
                  onClick={() => onDateChange(d.fullDate)}
                  className={`group relative flex flex-col items-center p-3 text-left transition-all cursor-pointer ${
                    isSelected ? 'bg-amber-50/90' : 'hover:bg-stone-50/80'
                  }`}
                >
                  {d.isToday && (
                    <span
                      title="Today"
                      className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-600 ring-2 ring-amber-200"
                    />
                  )}
                  <span className={`text-sm font-black ${isSelected ? 'text-amber-950 font-serif' : 'text-slate-800'}`}>
                    {d.dateNumber}
                  </span>
                  <span className="mt-1 text-[11px] font-semibold text-slate-900 line-clamp-1">{d.tithi}</span>
                  <span className="text-[10px] font-medium text-stone-500 line-clamp-1">{d.nakshatra}</span>

                  {d.festival && (
                    <span className="mt-2 line-clamp-1 rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 border border-rose-200/60 max-w-full text-center">
                      {d.festival}
                    </span>
                  )}
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Telemetry Dashboard */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Five Panchang Elements & Sun/Moon Transits */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-amber-600" />
                  <h3 className="font-serif text-base font-bold text-slate-900">Panchang Elements (पञ्चाङ्गम्)</h3>
                </div>
                <span className="text-xs font-semibold text-stone-600">
                  Lahiri Ayanamsa: <strong className="text-amber-900">{calendarData.panchang.ayanamsa.formatted}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {/* Tithi */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Tithi</div>
                  <div className="mt-1 text-sm sm:text-base font-bold text-slate-900 truncate">
                    {calendarData.panchang.tithi.name}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-stone-600">
                    {calendarData.panchang.tithi.endsAt}
                  </div>
                </div>

                {/* Nakshatra */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Nakshatra</div>
                  <div className="mt-1 text-sm sm:text-base font-bold text-slate-900 truncate">
                    {calendarData.panchang.nakshatra.name}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-stone-600">
                    Pada {calendarData.panchang.nakshatra.pada} • {calendarData.panchang.nakshatra.endsAt}
                  </div>
                </div>

                {/* Yoga */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Yoga</div>
                  <div className="mt-1 text-sm sm:text-base font-bold text-slate-900 truncate">
                    {calendarData.panchang.yoga.name}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-stone-600">
                    {calendarData.panchang.yoga.endsAt}
                  </div>
                </div>

                {/* Karana */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Karana</div>
                  <div className="mt-1 text-sm sm:text-base font-bold text-slate-900 truncate">
                    {calendarData.panchang.karana.name}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-stone-600">
                    Lord: {calendarData.panchang.karana.lord} ({calendarData.panchang.karana.type})
                  </div>
                </div>

                {/* Vara */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Vara (Weekday)</div>
                  <div className="mt-1 text-sm sm:text-base font-bold text-slate-900 truncate">
                    {calendarData.panchang.vara.sanskritName}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-stone-600">
                    Ruler: {calendarData.panchang.vara.lord}
                  </div>
                </div>

                {/* Sunrise Day */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Vedic Solar Day</div>
                  <div className="mt-1 text-sm sm:text-base font-bold text-slate-900 truncate">
                    {calendarData.panchang.vara.name}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium text-stone-600">
                    {calendarData.panchang.vara.dayStartTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Sun & Moon Telemetry */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-amber-200/80 bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-200 shrink-0">
                  <Sun className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-stone-500">Surya (Sun Transit)</div>
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {sunDeg} {sunRashiName}
                  </div>
                  <div className="text-xs text-amber-900 font-medium truncate">
                    Rise: {calendarData.panchang.sunrise} • Set: {calendarData.panchang.sunset}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-amber-200/80 bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-200 shrink-0">
                  <Moon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-stone-500">Chandra (Moon Transit)</div>
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {moonDeg} {moonRashiName}
                  </div>
                  <div className="text-xs text-blue-900 font-medium truncate">
                    Nakshatra: {calendarData.panchang.nakshatra.name} (Pada {calendarData.panchang.nakshatra.pada})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Muhurtas & Quick Timing Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 border-b border-amber-100 pb-3">
                <Clock className="h-4 w-4 text-amber-600" />
                <h3 className="font-serif text-base font-bold text-slate-900">Key Muhurta Windows</h3>
              </div>

              <div className="space-y-3">
                {/* Abhijit Muhurta */}
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                  <div>
                    <div className="text-xs font-bold text-emerald-950">Abhijit Muhurta</div>
                    <div className="text-[11px] font-medium text-emerald-800">Highly Auspicious</div>
                  </div>
                  <div className="text-xs font-black text-emerald-950">
                    {calendarData.muhurta.abhijitMuhurta.start} – {calendarData.muhurta.abhijitMuhurta.end}
                  </div>
                </div>

                {/* Rahu Kaal */}
                <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/70 p-3">
                  <div>
                    <div className="text-xs font-bold text-rose-950">Rahu Kaal</div>
                    <div className="text-[11px] font-medium text-rose-800">Inauspicious Period</div>
                  </div>
                  <div className="text-xs font-black text-rose-950">
                    {calendarData.muhurta.rahuKaal.start} – {calendarData.muhurta.rahuKaal.end}
                  </div>
                </div>

                {/* Yamaganda */}
                <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Yamaganda</div>
                    <div className="text-[11px] font-medium text-stone-600">Restricted Work</div>
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    {calendarData.muhurta.yamaganda.start} – {calendarData.muhurta.yamaganda.end}
                  </div>
                </div>
              </div>

              {/* Current Choghadiya */}
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-center">
                <div className="text-[11px] font-bold text-amber-900">Current Choghadiya Period</div>
                <div className="mt-1 text-sm font-black text-slate-900">
                  {activeChoghadiya.name} ({activeChoghadiya.ruler}) • {activeChoghadiya.nature}
                </div>
                <div className="text-[11px] font-medium text-stone-600 mt-0.5">
                  Window: {activeChoghadiya.start} – {activeChoghadiya.end}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Comprehensive Suite: Muhurtas, Choghadiyas & Sunrise Ephemeris */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-700" />
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Astronomical Analytics & Ephemeris Suite
              </h3>
            </div>
            <button
              onClick={() => setShowFullEphemeris(!showFullEphemeris)}
              className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-50 transition shadow-2xs cursor-pointer"
            >
              {showFullEphemeris ? 'Hide Detailed Tables' : 'View Full Muhurta & Planetary Ephemeris'}
            </button>
          </div>

          {showFullEphemeris && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Muhurta & Choghadiya Engine */}
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

              {/* Sunrise Ephemeris Table */}
              <DailyEphemerisTable
                planets={calendarData.planets}
                ayanamsaStr={calendarData.panchang.ayanamsa.formatted}
              />
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Instant Kundli */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={onOpenKundliModal}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-serif font-bold text-xs sm:text-sm shadow-xl shadow-amber-900/20 active:scale-95 transition-all border border-amber-300 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Generate Personal Kundli</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-amber-200/80 py-6 px-4 text-center text-xs text-slate-500 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-900 font-bold font-serif text-sm">
              GrahaSetu / KangleiAstro
            </span>
            <span>• Daily Hindu Astronomical Calendar & Vedic Panchang Engine</span>
          </div>
          <div>
            Swiss Ephemeris • Nirayana (Lahiri Ayanamsa) • Progressive Web App (PWA)
          </div>
        </div>
      </footer>
    </div>
  );
};
