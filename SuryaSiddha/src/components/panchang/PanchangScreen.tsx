// components/panchang/PanchangScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  Sun,
  Moon,
  Clock,
  Calendar as CalendarIcon,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Hourglass
} from 'lucide-react';
import { UserBirthProfile, KundliData } from '../../types/astronomy';
import { calculatePanchang } from '../../utils/astronomy/panchang';
import { detectHinduFestival } from '../../utils/astronomy/festivals';
import { RASHIS } from '../../data/rashis';

interface PanchangScreenProps {
  currentDate: string; // YYYY-MM-DD
  profile: UserBirthProfile;
  calendarData: KundliData;
  onDateChange: (date: string) => void;
  onOpenKundli: () => void;
}

interface MonthCell {
  day: number;
  fullDate: string;
  tithi: string;
  paksha: 'S' | 'K';
  nakshatra: string;
  festival?: string;
  isToday?: boolean;
  isCurrentMonth: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const PanchangScreen: React.FC<PanchangScreenProps> = ({
  currentDate,
  profile,
  calendarData,
  onDateChange,
}) => {
  const [isMonthExpanded, setIsMonthExpanded] = useState<boolean>(false);

  // Parse current selected date
  const [year, month, day] = useMemo(() => {
    const parts = currentDate.split('-').map((v) => parseInt(v, 10));
    return [parts[0] || 2026, parts[1] || 9, parts[2] || 18];
  }, [currentDate]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute 7-day horizontal carousel strip with terracotta markers
  const carouselDays = useMemo(() => {
    const baseDate = new Date(year, month - 1, day);
    const days = [];
    const dayMarkers = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    for (let offset = -3; offset <= 3; offset++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + offset);

      const dYear = d.getFullYear();
      const dMonth = String(d.getMonth() + 1).padStart(2, '0');
      const dDay = String(d.getDate()).padStart(2, '0');
      const fDateStr = `${dYear}-${dMonth}-${dDay}`;

      const dayPanchang = calculatePanchang(
        fDateStr,
        '06:00',
        profile.lat,
        profile.lng,
        profile.timezone
      );
      const festivalInfo = detectHinduFestival(dayPanchang, fDateStr);
      const tithiClean = dayPanchang.tithi.name.replace(/^(Shukla|Krishna)\s+/, '').split(' ')[0] || 'Tithi';

      let festivalTagType: 'VRAT' | 'PUJA' | 'FESTIVAL' | null = null;
      if (festivalInfo) {
        if (festivalInfo.type === 'Vrat') festivalTagType = 'VRAT';
        else if (festivalInfo.name.includes('Puja') || festivalInfo.name.includes('Teej')) festivalTagType = 'PUJA';
        else festivalTagType = 'FESTIVAL';
      }

      days.push({
        dateNumber: d.getDate(),
        fullDate: fDateStr,
        marker: dayMarkers[d.getDay()],
        tithi: tithiClean,
        paksha: dayPanchang.tithi.paksha,
        nakshatra: dayPanchang.nakshatra.name.split(' ')[0] || '',
        festival: festivalInfo?.name,
        festivalTagType,
        isToday: fDateStr === todayStr,
      });
    }
    return days;
  }, [year, month, day, profile.lat, profile.lng, profile.timezone, todayStr]);

  // Compute full 6x7 Month Grid Matrix when expanded
  const fullMonthCells = useMemo<MonthCell[]>(() => {
    if (!isMonthExpanded) return [];
    const curMonthIndex = month - 1;
    const firstDayOfMonth = new Date(year, curMonthIndex, 1);
    const lastDayOfMonth = new Date(year, curMonthIndex + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
    const lastDayOfPrevMonth = new Date(year, curMonthIndex, 0).getDate();

    const cells: MonthCell[] = [];

    // Trailing previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const pDay = lastDayOfPrevMonth - i;
      const prevDate = new Date(year, curMonthIndex - 1, pDay);
      const pDateStr = prevDate.toISOString().split('T')[0];
      const pPanchang = calculatePanchang(pDateStr, '06:00', profile.lat, profile.lng, profile.timezone);
      const festivalInfo = detectHinduFestival(pPanchang, pDateStr);
      const tithiClean = pPanchang.tithi.name.replace(/^(Shukla|Krishna)\s+/, '').split(' ')[0] || 'Tithi';

      cells.push({
        day: pDay,
        fullDate: pDateStr,
        tithi: tithiClean,
        paksha: pPanchang.tithi.paksha === 'Shukla' ? 'S' : 'K',
        nakshatra: pPanchang.nakshatra.name.split(' ')[0] || '',
        festival: festivalInfo?.name,
        isToday: pDateStr === todayStr,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const mStr = String(curMonthIndex + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const fDate = `${year}-${mStr}-${dStr}`;

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

    // Trailing next month
    const totalCellsNeeded = cells.length > 35 ? 42 : 35;
    const remaining = totalCellsNeeded - cells.length;
    for (let n = 1; n <= remaining; n++) {
      const nextDate = new Date(year, curMonthIndex + 1, n);
      const nDateStr = nextDate.toISOString().split('T')[0];
      const nPanchang = calculatePanchang(nDateStr, '06:00', profile.lat, profile.lng, profile.timezone);
      const festivalInfo = detectHinduFestival(nPanchang, nDateStr);
      const tithiClean = nPanchang.tithi.name.replace(/^(Shukla|Krishna)\s+/, '').split(' ')[0] || 'Tithi';

      cells.push({
        day: n,
        fullDate: nDateStr,
        tithi: tithiClean,
        paksha: nPanchang.tithi.paksha === 'Shukla' ? 'S' : 'K',
        nakshatra: nPanchang.nakshatra.name.split(' ')[0] || '',
        festival: festivalInfo?.name,
        isToday: nDateStr === todayStr,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [isMonthExpanded, year, month, profile.lat, profile.lng, profile.timezone, todayStr]);

  // Hindu month names (Purnimanta & Amanta)
  const hinduMonthHeader = useMemo(() => {
    const samvatVikram = calendarData.panchang.samvat.vikram;
    const months = [
      'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
      'Shravana', 'Bhadrapada', 'Ashwina', 'Kartika',
      'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
    ];
    const approxMonthIdx = (month + 9) % 12;
    const purnimantaMonth = months[approxMonthIdx] || 'Bhadrapada';
    const amantaMonth = months[(approxMonthIdx + 11) % 12] || 'Shravana';

    return {
      title: `${MONTH_NAMES[month - 1]} ${year}`,
      purnimanta: purnimantaMonth,
      amanta: amantaMonth,
      vikram: samvatVikram,
      shaka: calendarData.panchang.samvat.shaka,
      ritu: calendarData.panchang.ritu.name,
    };
  }, [calendarData.panchang, month, year]);

  // 4-Slot daytime Choghadiya ribbon tracking segments
  const daytimeChoghadiyasPreview = useMemo(() => {
    return calendarData.muhurta.choghadiyaDay.slice(0, 4);
  }, [calendarData.muhurta.choghadiyaDay]);

  const sunRashiName = RASHIS[calendarData.planets.Sun?.rashi ?? 0]?.sanskritName || 'Kanya';
  const moonRashiName = RASHIS[calendarData.planets.Moon?.rashi ?? 0]?.sanskritName || 'Vrishchika';
  const festivalToday = detectHinduFestival(calendarData.panchang, currentDate);

  return (
    <div className="space-y-4 pb-20 sm:pb-24 animate-in fade-in duration-150">
      {/* 1. Month Navigation & Samvat Indicators */}
      <div className="bg-white rounded-2xl p-4 border border-slate-300 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-black text-[#78350F] border border-[#F59E0B]">
              Vikram Samvat {hinduMonthHeader.vikram}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black text-[#1E293B] border border-slate-300">
              Shaka {hinduMonthHeader.shaka}
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-[#065F46] border border-emerald-300">
              {hinduMonthHeader.ritu}
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="font-serif text-lg sm:text-xl font-black text-[#020617]">
              {hinduMonthHeader.title}
            </h2>
            <span className="text-xs font-bold text-[#78350F]">
              ({hinduMonthHeader.purnimanta} / {hinduMonthHeader.amanta})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDateChange(todayStr)}
            className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-black text-[#020617] hover:bg-slate-200 transition active:scale-95 shadow-2xs cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setIsMonthExpanded(!isMonthExpanded)}
            className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-[#020617] hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#EA580C] stroke-[2.5]" />
            <span>{isMonthExpanded ? 'Carousel' : 'Month View'}</span>
            {isMonthExpanded ? <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* 2. Horizontal Date Strip with Terracotta Ochre (#7C2D12) Markers */}
      {!isMonthExpanded ? (
        <div className="bg-white rounded-2xl p-3 border border-slate-300 shadow-sm">
          <div className="grid grid-cols-7 gap-1.5">
            {carouselDays.map((d) => {
              const isSelected = currentDate === d.fullDate;
              return (
                <button
                  key={d.fullDate}
                  onClick={() => onDateChange(d.fullDate)}
                  className={`relative flex flex-col items-center py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FEF3C7] border-2 border-[#B45309] shadow-sm scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  {/* Weekday Label in Terracotta Ochre #7C2D12 font-black */}
                  <span className="text-[11px] font-black uppercase text-[#7C2D12]">
                    {d.marker}
                  </span>

                  {/* Solar Date Number in True Deep Ink #020617 font-black */}
                  <span className="text-base font-black font-serif my-0.5 text-[#020617]">
                    {d.dateNumber}
                  </span>

                  {/* Tithi Name in Saturated Dark Slate font-bold */}
                  <span className="text-[10px] font-bold line-clamp-1 text-[#1E293B]">
                    {d.tithi}
                  </span>

                  {/* Solid Festival Badges with Pure White Text */}
                  {d.festivalTagType ? (
                    <span
                      title={d.festival}
                      className={`mt-1 text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded uppercase text-white ${
                        d.festivalTagType === 'VRAT'
                          ? 'bg-[#BE123C]'
                          : d.festivalTagType === 'PUJA'
                          ? 'bg-[#7E22CE]'
                          : 'bg-[#B45309]'
                      }`}
                    >
                      {d.festivalTagType}
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-[#475569] line-clamp-1 mt-0.5">
                      {d.nakshatra}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Full 6x7 Month Grid Matrix */
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm animate-in fade-in zoom-in-95">
          <div className="grid grid-cols-7 border-b border-slate-300 bg-slate-100 text-center text-[11px] font-black text-[#7C2D12] py-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
              <div key={dayName}>{dayName}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 divide-x divide-y divide-slate-200">
            {fullMonthCells.map((cell, idx) => {
              const isSelected = currentDate === cell.fullDate && cell.isCurrentMonth;
              return (
                <button
                  key={idx}
                  onClick={() => cell.isCurrentMonth && onDateChange(cell.fullDate)}
                  disabled={!cell.isCurrentMonth}
                  className={`relative min-h-[72px] sm:min-h-[84px] p-2 text-left transition-all cursor-pointer ${
                    !cell.isCurrentMonth
                      ? 'bg-slate-100/60 opacity-30 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#FEF3C7] border-2 border-[#B45309]'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-black ${isSelected ? 'text-[#78350F] font-serif' : 'text-[#020617]'}`}>
                      {cell.day}
                    </span>
                    {cell.isToday && (
                      <span className="rounded-full bg-[#EA580C] px-1 py-0.2 text-[8px] font-black text-white">
                        Today
                      </span>
                    )}
                    <span className={`text-[9px] font-black ${cell.paksha === 'S' ? 'text-[#B45309]' : 'text-[#1E40AF]'}`}>
                      {cell.paksha === 'S' ? 'Shukla' : 'Krishna'}
                    </span>
                  </div>

                  <div className="mt-0.5 text-[10px] font-black text-[#020617] truncate">{cell.tithi}</div>
                  <div className="text-[9px] text-[#475569] font-bold truncate">{cell.nakshatra}</div>

                  {cell.festival && (
                    <div className="mt-0.5 line-clamp-1 rounded bg-[#BE123C] text-white px-1 text-[8px] font-black">
                      {cell.festival}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Solar & Lunar Telemetry Bar (Burnt Orange #7C2D12 & Dark Indigo #1E1B4B) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Sun Card in Burnt Orange */}
        <div className="rounded-2xl border border-orange-300 bg-white p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#EA580C] to-[#C2410C] text-white shadow-md shadow-orange-700/20">
              <Sun className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-[#7C2D12]">
                Surya (Sun) • {sunRashiName}
              </div>
              <div className="text-sm font-black text-[#020617] mt-0.5">
                Rise: <span className="text-[#7C2D12] font-mono font-black">{calendarData.panchang.sunrise}</span> • Set: <span className="text-[#020617] font-mono font-black">{calendarData.panchang.sunset}</span>
              </div>
              <div className="text-[10px] font-bold text-[#334155] mt-0.5">
                Solar Noon: {calendarData.panchang.solarNoon}
              </div>
            </div>
          </div>
        </div>

        {/* Moon Card in Dark Indigo */}
        <div className="rounded-2xl border border-indigo-300 bg-white p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4338CA] to-[#312E81] text-white shadow-md shadow-indigo-700/20">
              <Moon className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-[#1E1B4B]">
                Chandra (Moon) • {moonRashiName}
              </div>
              <div className="text-sm font-black text-[#020617] mt-0.5">
                Sign: <span className="text-[#1E1B4B]">{moonRashiName}</span> • <span className="text-[#1E1B4B]">{calendarData.panchang.tithi.paksha}</span>
              </div>
              <div className="text-[10px] font-bold text-[#334155] mt-0.5">
                Nakshatra: {calendarData.panchang.nakshatra.name.split(' ')[0]} (Pada {calendarData.panchang.nakshatra.pada})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Four Pillars of Panchang (Strict High-Contrast Saturated Tokens) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#EA580C] stroke-[2.5]" />
            <h3 className="font-serif font-black text-base text-[#020617]">
              The Four Pillars of Panchang (चतुरङ्गम्)
            </h3>
          </div>
          <span className="text-xs font-bold text-[#334155]">
            Ayanamsa: <strong className="text-[#020617] font-mono">{calendarData.panchang.ayanamsa.formatted}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* A. Tithi Card: Background #FFFBEB, Border #F59E0B (1.6px), Label #78350F, Main #451A03, Timing #78350F */}
          <div className="rounded-2xl border-[1.6px] border-[#F59E0B] bg-[#FFFBEB] p-4 shadow-sm relative overflow-hidden">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#78350F] flex items-center justify-between">
              <span>Tithi (तिथि)</span>
              <span className="text-[#78350F] font-black">{calendarData.panchang.tithi.paksha}</span>
            </div>
            <div className="mt-1 text-base sm:text-lg font-black text-[#451A03] truncate">
              {calendarData.panchang.tithi.name}
            </div>
            <div className="mt-0.5 text-xs text-[#78350F] font-black">
              {calendarData.panchang.tithi.endsAt}
            </div>
            <div className="mt-2 text-[10px] text-[#78350F] font-bold">
              Deity: {calendarData.panchang.tithi.deity}
            </div>
            <div className="absolute top-0 right-0 h-2 w-16 bg-[#F59E0B] rounded-bl-full" />
          </div>

          {/* B. Nakshatra Card: Background #F0F9FF, Border #38BDF8 (1.6px), Label #075985, Main #082F49, Timing #0369A1 */}
          <div className="rounded-2xl border-[1.6px] border-[#38BDF8] bg-[#F0F9FF] p-4 shadow-sm relative overflow-hidden">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#075985] flex items-center justify-between">
              <span>Nakshatra (नक्षत्रम्)</span>
              <span className="text-[#0369A1] font-black">Pada {calendarData.panchang.nakshatra.pada}</span>
            </div>
            <div className="mt-1 text-base sm:text-lg font-black text-[#082F49] truncate">
              {calendarData.panchang.nakshatra.name}
            </div>
            <div className="mt-0.5 text-xs text-[#0369A1] font-black">
              {calendarData.panchang.nakshatra.endsAt}
            </div>
            <div className="mt-2 text-[10px] text-[#075985] font-bold">
              Lord: {calendarData.panchang.nakshatra.lord} • Deity: {calendarData.panchang.nakshatra.deity}
            </div>
            <div className="absolute top-0 right-0 h-2 w-16 bg-[#0284C7] rounded-bl-full" />
          </div>

          {/* C. Yoga Card: Background #ECFDF5, Border #34D399 (1.6px), Label #065F46, Main #022C22, Timing #065F46 */}
          <div className="rounded-2xl border-[1.6px] border-[#34D399] bg-[#ECFDF5] p-4 shadow-sm relative overflow-hidden">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#065F46] flex items-center justify-between">
              <span>Yoga (योग)</span>
              <span className={calendarData.panchang.yoga.isAuspicious ? 'text-[#065F46] font-black' : 'text-[#991B1B] font-black'}>
                {calendarData.panchang.yoga.isAuspicious ? 'Auspicious' : 'Inauspicious'}
              </span>
            </div>
            <div className="mt-1 text-base sm:text-lg font-black text-[#022C22] truncate">
              {calendarData.panchang.yoga.name} ({calendarData.panchang.yoga.sanskritName})
            </div>
            <div className="mt-0.5 text-xs text-[#065F46] font-black">
              {calendarData.panchang.yoga.endsAt}
            </div>
            <div className="mt-2 text-[10px] text-[#065F46] font-bold line-clamp-1">
              {calendarData.panchang.yoga.meaning}
            </div>
            <div className="absolute top-0 right-0 h-2 w-16 bg-[#10B981] rounded-bl-full" />
          </div>

          {/* D. Karana Card: Background #FAF5FF, Border #C084FC (1.6px), Label #6B21A8, Main #3B0764, Timing #581C87 */}
          <div className="rounded-2xl border-[1.6px] border-[#C084FC] bg-[#FAF5FF] p-4 shadow-sm relative overflow-hidden">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#6B21A8] flex items-center justify-between">
              <span>Karana (करणम्)</span>
              <span className="text-[#581C87] font-black">{calendarData.panchang.karana.type}</span>
            </div>
            <div className="mt-1 text-base sm:text-lg font-black text-[#3B0764] truncate">
              {calendarData.panchang.karana.name} ({calendarData.panchang.karana.sanskritName})
            </div>
            <div className="mt-0.5 text-xs text-[#581C87] font-black">
              Lord: {calendarData.panchang.karana.lord}
            </div>
            <div className="mt-2 text-[10px] text-[#6B21A8] font-bold">
              Deity: {calendarData.panchang.karana.deity}
            </div>
            <div className="absolute top-0 right-0 h-2 w-16 bg-[#9333EA] rounded-bl-full" />
          </div>
        </div>
      </div>

      {/* 5. Muhurta & Daytime Choghadiya Matrix */}
      <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#EA580C] stroke-[2.5]" />
            <h3 className="font-serif font-black text-base text-[#020617]">
              Key Muhurtas & Daytime Choghadiya
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase text-[#020617] bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
            Real-time Telemetry
          </span>
        </div>

        {/* Abhijit Muhurta & Rahu Kaal Alert Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Abhijit Muhurta (Auspicious): Background #F0FDF4, Border #22C55E, Text #052E16 (font-black) */}
          <div className="rounded-2xl border-[1.6px] border-[#22C55E] bg-[#F0FDF4] p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-[#052E16] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] stroke-[2.5]" />
                <span>Abhijit Muhurta</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-[#DCFCE7] text-[#052E16] px-2 py-0.5 rounded-full border border-[#86EFAC]">
                Highly Auspicious
              </span>
            </div>
            <div className="mt-2 text-sm sm:text-base font-black text-[#052E16] font-mono">
              {calendarData.muhurta.abhijitMuhurta.start} – {calendarData.muhurta.abhijitMuhurta.end}
            </div>
            <div className="text-[11px] text-[#052E16] font-bold mt-0.5">
              Lord Vishnu’s auspicious window destroys doshas
            </div>
          </div>

          {/* Rahu Kaal (Inauspicious): Background #FFF1F2, Border #F43F5E, Text #4C0519 (font-black) */}
          <div className="rounded-2xl border-[1.6px] border-[#F43F5E] bg-[#FFF1F2] p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-[#4C0519] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#E11D48] stroke-[2.5]" />
                <span>Rahu Kaal</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-[#FFE4E6] text-[#4C0519] px-2 py-0.5 rounded-full border border-[#FDA4AF]">
                Inauspicious
              </span>
            </div>
            <div className="mt-2 text-sm sm:text-base font-black text-[#4C0519] font-mono">
              {calendarData.muhurta.rahuKaal.start} – {calendarData.muhurta.rahuKaal.end}
            </div>
            <div className="text-[11px] text-[#4C0519] font-bold mt-0.5">
              Avoid starting critical works, journeys, or contracts
            </div>
          </div>
        </div>

        {/* 4-Slot Daytime Choghadiya Ribbon */}
        <div>
          <div className="text-xs font-black text-[#020617] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Hourglass className="w-3.5 h-3.5 text-[#EA580C] stroke-[2.5]" />
              Daytime Choghadiya Segments
            </span>
            <span className="text-[10px] text-[#334155] font-bold">8 total slots</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {daytimeChoghadiyasPreview.map((slot, idx) => {
              const isCurrent = slot.isCurrent;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-2 border-[#16A34A] bg-[#DCFCE7] text-[#052E16] shadow-sm'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#020617]">{slot.name}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                        slot.quality === 'Good'
                          ? 'bg-emerald-200 text-[#064E3B]'
                          : slot.quality === 'Bad'
                          ? 'bg-rose-200 text-[#881337]'
                          : 'bg-amber-200 text-[#78350F]'
                      }`}
                    >
                      {slot.quality}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#020617] font-mono mt-1 font-black">
                    {slot.start} – {slot.end}
                  </div>
                  <div className="text-[9px] text-[#334155] font-bold mt-0.5">
                    Lord: {slot.ruler} ({slot.nature})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
