'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import {
  getMonthlyCalendar,
  CalendarDay,
  toBengaliNumerals,
  toMeeteiNumerals,
} from '@/engine/manipuriCalendar';
import { WEEKDAYS_MANIPURI } from '@/data/manipuriMonthAttributes';

type ScriptMode = 'bengali' | 'meetei' | 'en';

const MONTHS_LIST = [
  { value: 1, nameEn: 'January', nameBengali: 'জানুয়ারী', nameMeetei: 'ꯖꯥꯅꯨꯋꯥꯔꯤ' },
  { value: 2, nameEn: 'February', nameBengali: 'ফেব্রুয়ারী', nameMeetei: 'ꯐꯦꯕ꯭ꯔꯨꯋꯥꯔꯤ' },
  { value: 3, nameEn: 'March', nameBengali: 'মার্চ', nameMeetei: 'ꯃꯥꯔꯆ' },
  { value: 4, nameEn: 'April', nameBengali: 'এপ্রিল', nameMeetei: 'ꯑꯦꯄ꯭ꯔꯤꯜ' },
  { value: 5, nameEn: 'May', nameBengali: 'মে', nameMeetei: 'ꯃꯦ' },
  { value: 6, nameEn: 'June', nameBengali: 'জুন', nameMeetei: 'ꯖꯨꯟ' },
  { value: 7, nameEn: 'July', nameBengali: 'জুলাই', nameMeetei: 'ꯖꯨꯂꯥꯏ' },
  { value: 8, nameEn: 'August', nameBengali: 'আগস্ট', nameMeetei: 'ꯑꯥꯒꯁ꯭ꯠ' },
  { value: 9, nameEn: 'September', nameBengali: 'সেপ্টেম্বর', nameMeetei: 'ꯁꯦꯞꯇꯦꯝꯕꯔ' },
  { value: 10, nameEn: 'October', nameBengali: 'অক্টোবর', nameMeetei: 'ꯑꯣꯛꯇꯣꯕꯔ' },
  { value: 11, nameEn: 'November', nameBengali: 'নভেম্বর', nameMeetei: 'ꯅꯣꯚꯦꯝꯕꯔ' },
  { value: 12, nameEn: 'December', nameBengali: 'ডিসেম্বর', nameMeetei: 'ꯗꯤꯁꯦꯝꯕꯔ' },
];

const YEARS_LIST = Array.from({ length: 126 }, (_, i) => 1925 + i);

interface HomeMonthlyCalendarProps {
  /** Called when user clicks a date cell; receives the date string (YYYY-MM-DD) */
  onDateSelect?: (dateStr: string) => void;
}

export default function HomeMonthlyCalendar({ onDateSelect }: HomeMonthlyCalendarProps) {
  const now = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, [now]);

  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedDayNum, setSelectedDayNum] = useState<number>(now.getDate());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [scriptMode, setScriptMode] = useState<ScriptMode>('bengali');

  const calendarData = useMemo(() => {
    return getMonthlyCalendar(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const daysInMonthCount = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth() + 1);
    setSelectedDayNum(now.getDate());
    setSelectedDateStr(todayStr);
    onDateSelect?.(todayStr);
  };

  const handleGoSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const dayClamped = Math.min(selectedDayNum, daysInMonthCount);
    const dateFormatted = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayClamped).padStart(2, '0')}`;
    setSelectedDateStr(dateFormatted);
    onDateSelect?.(dateFormatted);
  };

  const handleDayClick = (dayItem: CalendarDay) => {
    setSelectedDayNum(dayItem.day);
    setSelectedDateStr(dayItem.dateStr);
    onDateSelect?.(dayItem.dateStr);
  };

  const currentMonthItem = MONTHS_LIST[selectedMonth - 1];

  // Lunar Month Span Text in chosen script
  const lunarMonthHeading = useMemo(() => {
    if (scriptMode === 'meetei') {
      return calendarData.manipuriMonthSpanMeetei || 'ꯂꯥꯡꯕꯟ-ꯃꯦꯔꯥ';
    }
    if (scriptMode === 'bengali') {
      return calendarData.manipuriMonthSpanBengali || 'লাংবন-মেরা';
    }
    return calendarData.manipuriMonthSpanBengali || 'Langban - Mera';
  }, [scriptMode, calendarData]);

  return (
    <div className="bg-white border border-gray-400 rounded-lg shadow-sm overflow-hidden flex flex-col font-sans">
      
      {/* ───── 1. MONTH NAVIGATION HEADER (< October 2026 >) ───── */}
      {/* Exactly replicating manipuricalendar.in centered month title */}
      <div className="py-2.5 px-3 bg-white border-b border-gray-300">
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded border border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition cursor-pointer shadow-xs"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-xl sm:text-2xl md:text-[25px] font-bold text-gray-900 tracking-tight text-center select-none">
            {currentMonthItem.nameEn} {selectedYear}
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded border border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition cursor-pointer shadow-xs"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ───── 2. FILTER ROW: YEAR / MONTH / DAY DROPDOWNS + GO + TODAY + LUNAR MONTH + SCRIPT ───── */}
      <div className="bg-[#f8fafc] border-b border-gray-400 px-3 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Form controls */}
        <form onSubmit={handleGoSubmit} className="flex items-center gap-1.5 flex-wrap">
          {/* Year */}
          <select
            id="home-cal-year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="h-7 px-1.5 rounded border border-gray-400 bg-white text-gray-900 font-semibold text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          >
            {YEARS_LIST.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Month */}
          <select
            id="home-cal-month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="h-7 px-1.5 rounded border border-gray-400 bg-white text-gray-900 font-semibold text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {MONTHS_LIST.map((m) => (
              <option key={m.value} value={m.value}>
                {m.nameEn}
              </option>
            ))}
          </select>

          {/* Day */}
          <select
            id="home-cal-day"
            value={selectedDayNum}
            onChange={(e) => setSelectedDayNum(Number(e.target.value))}
            className="h-7 px-1.5 rounded border border-gray-400 bg-white text-gray-900 font-semibold text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          >
            {Array.from({ length: daysInMonthCount }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Go Button */}
          <button
            type="submit"
            className="h-7 px-2.5 rounded border border-gray-400 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-xs cursor-pointer transition shadow-2xs"
          >
            Go
          </button>

          {/* Today Button */}
          <button
            type="button"
            onClick={handleJumpToToday}
            className="h-7 px-2.5 rounded border border-[#004d00] bg-[#004d00] hover:bg-[#006600] text-white font-bold text-xs cursor-pointer flex items-center gap-1 transition shadow-2xs ml-1"
            title="Jump to today"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Today</span>
          </button>
        </form>

        {/* Right side: Lunar month heading + script switchers */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="font-bold text-sm sm:text-base text-gray-900 tracking-wide font-sans">
            {lunarMonthHeading}
          </span>

          {/* Script Mode Buttons */}
          <div className="inline-flex rounded border border-gray-400 overflow-hidden text-[11px] font-bold bg-white">
            <button
              type="button"
              onClick={() => setScriptMode('bengali')}
              className={`px-2 py-0.5 transition cursor-pointer ${
                scriptMode === 'bengali'
                  ? 'bg-blue-600 text-white font-black'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              বাং
            </button>
            <button
              type="button"
              onClick={() => setScriptMode('meetei')}
              className={`px-2 py-0.5 border-l border-r border-gray-300 transition cursor-pointer ${
                scriptMode === 'meetei'
                  ? 'bg-blue-600 text-white font-black'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              ꯃꯤ
            </button>
            <button
              type="button"
              onClick={() => setScriptMode('en')}
              className={`px-2 py-0.5 transition cursor-pointer ${
                scriptMode === 'en'
                  ? 'bg-blue-600 text-white font-black'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* ───── 3. WEEKDAY HEADERS (SUN, MON, TUE, WED, THU, FRI, SAT) ───── */}
      {/* SUN has #ff6666, MON-SAT have #99ddff with 1px black/gray borders, matching manipuricalendar.in */}
      <div className="grid grid-cols-7 border-b border-gray-400 text-center select-none">
        {WEEKDAYS_MANIPURI.map((wd) => {
          const isSun = wd.day === 0;
          return (
            <div
              key={wd.day}
              className={`py-1.5 sm:py-2 px-0.5 border-r border-gray-400 last:border-r-0 flex flex-col items-center justify-center ${
                isSun ? 'bg-[#ff6666]' : 'bg-[#99ddff]'
              }`}
            >
              <h2 className="text-sm sm:text-base font-black text-black leading-tight tracking-wider">
                {wd.shortEn}
              </h2>
              <h4 className="text-[10px] sm:text-xs font-bold text-black leading-tight mt-0.5">
                {scriptMode === 'meetei'
                  ? wd.meetei
                  : scriptMode === 'bengali'
                  ? wd.bengali
                  : wd.shortEn}
              </h4>
            </div>
          );
        })}
      </div>

      {/* ───── 4. CALENDAR DAYS TABLE (calendar-table) ───── */}
      <div className="grid grid-cols-7 border-b border-gray-400 bg-gray-400 gap-[1px]">
        {calendarData.weeks.flatMap((week, wIdx) =>
          week.map((dayItem, dIdx) => {
            if (!dayItem) {
              const isSundayEmpty = dIdx === 0;
              return (
                <div
                  key={`empty-${wIdx}-${dIdx}`}
                  className={`min-h-[85px] sm:min-h-[105px] border-b border-gray-300 ${
                    isSundayEmpty ? 'bg-[#fff5f5]' : 'bg-gray-100'
                  }`}
                />
              );
            }

            const isSunday = dayItem.weekday === 0;
            const isGeneralHoliday = dayItem.isGeneralHoliday || !!(dayItem.festival && dayItem.festival.isGeneralHoliday);
            const isHoliday = isSunday || isGeneralHoliday;
            const isSelected = dayItem.dateStr === selectedDateStr;
            const isToday = dayItem.isToday;

            // Lunar month name
            const lunarMonthName =
              scriptMode === 'meetei'
                ? dayItem.manipuriMonth.nameMeetei
                : scriptMode === 'bengali'
                ? dayItem.manipuriMonth.nameBengali
                : dayItem.manipuriMonth.nameEn;

            // Lunar Tithi number representation
            const lunarTithiStr =
              scriptMode === 'meetei'
                ? dayItem.isDualTithi
                  ? `${toMeeteiNumerals(dayItem.tithiNumber)}/${toMeeteiNumerals(dayItem.tithiNumber + 1)}`
                  : toMeeteiNumerals(dayItem.tithiNumber)
                : scriptMode === 'bengali'
                ? dayItem.isDualTithi
                  ? `${toBengaliNumerals(dayItem.tithiNumber)}/${toBengaliNumerals(dayItem.tithiNumber + 1)}`
                  : toBengaliNumerals(dayItem.tithiNumber)
                : dayItem.isDualTithi
                ? `${dayItem.tithiNumber}/${dayItem.tithiNumber + 1}`
                : `${dayItem.tithiNumber}`;

            // Nakshatra Number representation (number only)
            const nakshatraNum =
              scriptMode === 'meetei'
                ? dayItem.nakshatraDisplayNumMeetei
                : scriptMode === 'bengali'
                ? dayItem.nakshatraDisplayNumBengali
                : dayItem.isDualNakshatra
                ? `${dayItem.nakshatraNumber}, ${dayItem.nakshatraNumber + 1}`
                : `${dayItem.nakshatraNumber}`;

            // Combined Lunar Month + Tithi label (e.g. "ꯂꯥꯡꯕꯟ ꯲꯰" or "লাংবন ২০")
            const lunarDayLabel = `${lunarMonthName} ${lunarTithiStr}`;

            // Event or Holiday display title (event-title)
            const eventTitle = dayItem.festival
              ? scriptMode === 'meetei'
                ? dayItem.festival.nameMeetei || dayItem.festival.nameBengali
                : scriptMode === 'bengali'
                ? dayItem.festival.nameBengali
                : dayItem.festival.nameBengali
              : dayItem.isPurnima
              ? scriptMode === 'meetei'
                ? 'ꯄꯨꯔꯅꯤꯃꯥ (Thanil)'
                : 'পূর্ণিমা (Thanil)'
              : dayItem.isAmavasya
              ? scriptMode === 'meetei'
                ? 'ꯊꯥꯁꯤ (Thasi)'
                : 'থাশী (Thasi)'
              : dayItem.isEkadashi
              ? scriptMode === 'meetei'
                ? 'ꯑꯦꯀꯥꯗꯁꯤ'
                : 'একাদশী'
              : '';

            return (
              <button
                type="button"
                key={dayItem.dateStr}
                title={`${dayItem.dateStr} • Nakshatra ${nakshatraNum} • ${lunarDayLabel}${eventTitle ? ` • ${eventTitle}` : ''}`}
                onClick={() => handleDayClick(dayItem)}
                className={`relative min-h-[85px] sm:min-h-[105px] p-1 sm:p-1.5 flex flex-col justify-between items-center text-center cursor-pointer transition-all select-none border-b border-gray-300 ${
                  isToday
                    ? 'bg-[#80ff80] text-[#004d00] ring-2 ring-inset ring-emerald-700 z-10'
                    : isSelected
                    ? 'bg-[#ccffb3] ring-2 ring-inset ring-emerald-600 z-10'
                    : isSunday
                    ? 'bg-[#fff5f5] hover:bg-[#ccffb3]'
                    : 'bg-white hover:bg-[#ccffb3]'
                }`}
              >
                {/* 1. TOP: EVENT / HOLIDAY TITLE (event-title, color #b30000 bold) */}
                <h5 className="text-[10px] sm:text-[11px] font-bold text-[#b30000] text-center w-full min-h-[17px] leading-tight truncate px-0.5">
                  {eventTitle}
                </h5>

                {/* Nakshatra Number ONLY (just above the date) */}
                <div
                  className={`text-[10px] sm:text-[11px] font-bold leading-none select-none ${
                    isToday ? 'text-[#004d00]/80' : isHoliday ? 'text-[#b30000]/70' : 'text-slate-500'
                  }`}
                  title={`Nakshatra No. ${nakshatraNum}`}
                >
                  {nakshatraNum}
                </div>

                {/* 2. CENTER: GREGORIAN DATE (h1, large bold) */}
                <div className="flex items-center justify-center gap-1 my-auto">
                  <h1
                    className={`text-2xl sm:text-3xl font-bold leading-none ${
                      isHoliday ? 'text-[#b30000]' : isToday ? 'text-[#004d00]' : 'text-black'
                    }`}
                  >
                    {dayItem.day}
                  </h1>

                  {/* Moon icons for Thanil (Full Moon), Thasi (New Moon), Ekadashi */}
                  {dayItem.isPurnima && (
                    <span className="text-amber-500 text-xs sm:text-sm font-bold" title="Thanil / Purnima">
                      🌕
                    </span>
                  )}
                  {dayItem.isAmavasya && (
                    <span className="text-gray-700 text-xs sm:text-sm font-bold" title="Thasi / Amavasya">
                      🌑
                    </span>
                  )}
                  {dayItem.isEkadashi && !dayItem.isPurnima && !dayItem.isAmavasya && (
                    <span className="text-indigo-600 text-[11px] font-bold" title="Ekadashi">
                      ☽
                    </span>
                  )}
                </div>

                {/* 3. BOTTOM: LUNAR MONTH & TITHI (h6, bold) */}
                <h6
                  className={`text-[10.5px] sm:text-xs font-bold leading-tight w-full truncate ${
                    isToday ? 'text-[#004d00]' : isHoliday ? 'text-[#7f1d1d]' : 'text-gray-900'
                  }`}
                >
                  {lunarDayLabel}
                </h6>
              </button>
            );
          })
        )}
      </div>

      {/* ───── 5. CALENDAR FOOTER LEGEND ───── */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-300 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-700 font-medium">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1 font-semibold text-[#b30000]">
            <span className="w-2.5 h-2.5 rounded bg-[#ff6666] border border-red-500" />
            <span>Sunday / Holiday</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#004d00]">
            <span className="w-2.5 h-2.5 rounded bg-[#80ff80] border border-green-600" />
            <span>Today</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
            <span>🌕 Thanil (Purnima)</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
            <span>🌑 Thasi (Amavasya)</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-indigo-700">
            <span>☽ Ekadashi</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
            <span className="text-[10px] bg-slate-200 px-1 rounded font-mono font-bold">1-27</span>
            <span>Nakshatra No.</span>
          </span>
        </div>

        <Link
          href="/calendar"
          className="text-blue-700 font-bold hover:underline flex items-center gap-1 ml-auto"
        >
          <span>Full Wall Calendar View</span>
          <span>→</span>
        </Link>
      </div>

    </div>
  );
}
