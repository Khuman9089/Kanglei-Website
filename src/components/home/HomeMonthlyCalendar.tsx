'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import {
  getMonthlyCalendar,
  CalendarDay,
  toBengaliNumerals,
  toMeeteiNumerals
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
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [scriptMode, setScriptMode] = useState<ScriptMode>('bengali');

  const calendarData = useMemo(() => {
    return getMonthlyCalendar(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const isCurrentMonthPresent =
    selectedYear === now.getFullYear() && selectedMonth === (now.getMonth() + 1);

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
    setSelectedDateStr(todayStr);
    onDateSelect?.(todayStr);
  };

  const handleDayClick = (dayItem: CalendarDay) => {
    setSelectedDateStr(dayItem.dateStr);
    onDateSelect?.(dayItem.dateStr);
  };

  const currentMonthItem = MONTHS_LIST[selectedMonth - 1];

  return (
    <div className="bg-transparent rounded-3xl border-2 border-[#d6c7af] dark:border-slate-800 shadow-[0_15px_50px_rgba(217,119,6,0.06)] overflow-hidden flex flex-col transition-all">
      {/* Accent Top Ribbon */}
      <div className="h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

      {/* ───── 1. COMPACT SINGLE-LINE HEADER BANNER ───── */}
      <div className="bg-[#181512] dark:bg-slate-950 text-white px-2.5 py-2 border-b-2 border-[#b8a48b]">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left: Nav controls + Month/Year selects */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-md border border-amber-600/50 bg-[#292524] hover:bg-amber-900/60 text-amber-300 transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <select
              id="home-cal-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="h-7 px-1.5 rounded-md text-[11px] font-bold border border-amber-600/50 bg-[#292524] text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              {MONTHS_LIST.map((m) => (
                <option key={m.value} value={m.value} className="bg-[#1c1917] text-white">
                  {scriptMode === 'meetei' ? m.nameMeetei : scriptMode === 'bengali' ? m.nameBengali : m.nameEn} ({m.nameEn})
                </option>
              ))}
            </select>

            <select
              id="home-cal-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="h-7 px-1.5 rounded-md text-[11px] font-bold border border-amber-600/50 bg-[#292524] text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer font-mono"
            >
              {YEARS_LIST.map((y) => (
                <option key={y} value={y} className="bg-[#1c1917] text-white">
                  {y}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-md border border-amber-600/50 bg-[#292524] hover:bg-amber-900/60 text-amber-300 transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {!isCurrentMonthPresent && (
              <button
                type="button"
                onClick={handleJumpToToday}
                className="h-7 px-1.5 rounded-md text-[10px] font-bold bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/50 cursor-pointer flex items-center gap-1"
                title="Jump to current month"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Today</span>
              </button>
            )}
          </div>

          {/* Center: Month title + dual-month span */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-serif font-black tracking-wider text-[#f59e0b] uppercase">
              {currentMonthItem.nameEn}
            </span>
            <span className="text-[10px] sm:text-[11px] font-serif font-bold text-amber-200/80 hidden sm:inline">
              {scriptMode === 'meetei'
                ? `${calendarData.manipuriMonthSpanMeetei} — ${calendarData.solarMonthSpanMeetei}`
                : `${calendarData.manipuriMonthSpanBengali} — ${calendarData.solarMonthSpanBengali}`}
              <span className="text-amber-400 ml-1 font-mono text-[9px]">
                ({scriptMode === 'meetei' ? `ꯁꯀꯥꯕ꯭ꯗ ${toMeeteiNumerals(calendarData.souraYearSpan)}` : `শকাব্দ ${toBengaliNumerals(calendarData.souraYearSpan)}`})
              </span>
            </span>
          </div>

          {/* Right: Script Switcher */}
          <div className="inline-flex rounded-md border border-amber-700/50 p-0.5 bg-[#292524] text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setScriptMode('bengali')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                scriptMode === 'bengali'
                  ? 'bg-amber-600 text-white font-black shadow-xs'
                  : 'text-amber-300/70 hover:text-amber-200'
              }`}
            >
              বাং
            </button>
            <button
              type="button"
              onClick={() => setScriptMode('meetei')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                scriptMode === 'meetei'
                  ? 'bg-amber-600 text-white font-black shadow-xs'
                  : 'text-amber-300/70 hover:text-amber-200'
              }`}
            >
              ꯃꯤ
            </button>
            <button
              type="button"
              onClick={() => setScriptMode('en')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                scriptMode === 'en'
                  ? 'bg-amber-600 text-white font-black shadow-xs'
                  : 'text-amber-300/70 hover:text-amber-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* ───── 2. WEEKDAY HEADERS (English, Meetei Mayek & Bengali) ───── */}
      <div className="grid grid-cols-7 border-b-2 border-[#b8a48b] bg-[#f4ebd9]/70 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-serif">
        {WEEKDAYS_MANIPURI.map((wd) => {
          const isSun = wd.day === 0;
          return (
            <div
              key={wd.day}
              className={`py-1 px-0.5 text-center border-r border-[#ccbba2] dark:border-slate-700 last:border-r-0 ${
                isSun ? 'text-red-600 dark:text-red-400 font-black bg-red-100/30 dark:bg-red-950/20' : 'font-bold'
              }`}
            >
              <div className="text-xs sm:text-sm font-black tracking-wider uppercase">
                {wd.shortEn === 'Thu' ? 'THU' : wd.shortEn.toUpperCase()}
              </div>
              <div className="text-[10px] sm:text-[11px] leading-tight font-serif mt-0.5">
                {wd.meetei}
              </div>
              <div className="text-[9px] sm:text-[10px] leading-tight font-serif text-slate-700 dark:text-slate-300">
                {wd.bengali}
              </div>
            </div>
          );
        })}
      </div>

      {/* ───── 3. COMPACT 7-COLUMN DAYS GRID (transparent bg) ───── */}
      <div className="divide-y border-b border-[#b8a48b] dark:border-slate-700 divide-[#b8a48b] dark:divide-slate-700 bg-transparent">
        {calendarData.weeks.map((week, wIdx) => (
          <div key={`week-${wIdx}`} className="grid grid-cols-7 divide-x divide-[#b8a48b] dark:divide-slate-700 w-full">
            {week.map((dayItem, dIdx) => {
              if (!dayItem) {
                return (
                  <div
                    key={`empty-${wIdx}-${dIdx}`}
                    className="bg-transparent min-h-[44px] sm:min-h-[50px] md:min-h-[54px]"
                  />
                );
              }

              const isSunday = dayItem.weekday === 0;
              const is2ndSaturday = dayItem.weekday === 6 && dayItem.day >= 8 && dayItem.day <= 14;
              const is4thSaturday = dayItem.weekday === 6 && dayItem.day >= 22 && dayItem.day <= 28;
              const isHoliday = isSunday || dayItem.isGeneralHoliday || is2ndSaturday || is4thSaturday;
              const isSelected = dayItem.dateStr === selectedDateStr;
              const holidayTag = is2ndSaturday ? '2nd Saturday' : is4thSaturday ? '4th Saturday' : null;

              return (
                <button
                  type="button"
                  key={dayItem.dateStr}
                  title={`${dayItem.dateStr}`}
                  onClick={() => handleDayClick(dayItem)}
                  className={`relative p-1 sm:p-1.5 cursor-pointer transition-all flex flex-col items-center justify-between select-none min-h-[44px] sm:min-h-[50px] md:min-h-[54px] group text-center ${
                    isSelected
                      ? 'bg-amber-100/90 dark:bg-amber-950/60 ring-2 ring-inset ring-amber-600 shadow-xs z-10'
                      : dayItem.isToday
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 ring-1.5 ring-inset ring-amber-500'
                      : isHoliday
                      ? 'bg-red-50/40 dark:bg-red-950/15 hover:bg-red-100/40'
                      : 'bg-transparent hover:bg-[#f5ecdd]/60'
                  }`}
                >
                  {/* TOP: Festival / Holiday Name (compact) */}
                  <div className="w-full min-h-[12px] leading-tight">
                    {dayItem.festival || holidayTag ? (
                      <span
                        className={`text-[7px] sm:text-[8.5px] font-bold block truncate max-w-full ${
                          isHoliday ? 'text-red-600 dark:text-red-400' : 'text-[#92400e] dark:text-amber-300'
                        }`}
                      >
                        {holidayTag || (scriptMode === 'meetei' ? dayItem.festival?.nameMeetei : dayItem.festival?.nameBengali)}
                      </span>
                    ) : (
                      <span />
                    )}
                  </div>

                  {/* MIDDLE: Manipuri Month Name ABOVE, then BIG Date Number */}
                  <div className="flex flex-col items-center justify-center flex-1">
                    {/* Manipuri Month Name (above date) */}
                    <span className="text-[7px] sm:text-[8.5px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-full leading-tight">
                      {scriptMode === 'meetei'
                        ? dayItem.manipuriMonth.nameMeetei.slice(0, 4)
                        : scriptMode === 'en'
                        ? dayItem.manipuriMonth.nameEn.slice(0, 4)
                        : dayItem.manipuriMonth.nameBengali.slice(0, 4)}
                    </span>

                    {/* BIG BOLD DATE NUMBER & STAMP BADGES */}
                    {dayItem.isPurnima ? (
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 text-white flex flex-col items-center justify-center shadow-xs text-center border-2 border-red-700"
                        title="Purnima (পূর্ণিমা)"
                      >
                        <span className="text-xs sm:text-sm font-serif font-black leading-none">{dayItem.day}</span>
                        <span className="text-[6px] sm:text-[7px] font-bold leading-none mt-px">
                          {scriptMode === 'meetei' ? 'ꯄꯨꯔꯅꯤ' : 'পূর্ণিমা'}
                        </span>
                      </div>
                    ) : dayItem.isAmavasya ? (
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-700 text-white flex flex-col items-center justify-center shadow-xs text-center border-2 border-black"
                        title="Thasi / Amavasya (থাসী)"
                      >
                        <span className="text-xs sm:text-sm font-serif font-black leading-none">{dayItem.day}</span>
                        <span className="text-[6px] sm:text-[7px] font-bold leading-none mt-px">
                          {scriptMode === 'meetei' ? 'ꯊꯥꯁꯤ' : 'থাসী'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-lg sm:text-xl md:text-2xl font-serif font-black tracking-tight leading-none ${
                            isHoliday
                              ? 'text-red-600 dark:text-red-400'
                              : dayItem.isToday
                              ? 'text-amber-700 dark:text-amber-300'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {dayItem.day}
                        </span>
                        {dayItem.isEkadashi && (
                          <span className="mt-px px-1 rounded-full bg-red-600 text-white text-[6px] sm:text-[7px] font-bold leading-none">
                            {scriptMode === 'meetei' ? 'ꯑꯦꯀꯥ' : 'একাদশী'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* BOTTOM ROW: Tithi + Solar Month Date */}
                  <div className="w-full flex items-center justify-between text-[7px] sm:text-[8px] font-serif border-t border-[#e2d5c3]/60 dark:border-slate-800 pt-px text-slate-600 dark:text-slate-400 leading-tight">
                    {/* Tithi */}
                    <span className="text-[#854d0e] dark:text-amber-400 font-bold truncate">
                      {scriptMode === 'meetei'
                        ? `${toMeeteiNumerals(dayItem.tithiNumber)}`
                        : `${toBengaliNumerals(dayItem.tithiNumber)}`}
                    </span>

                    {/* Solar Month & Day */}
                    <span className="font-semibold truncate">
                      {scriptMode === 'meetei'
                        ? `${dayItem.solarMonth.meetei.slice(0, 3)} ${toMeeteiNumerals(dayItem.souraDate)}`
                        : `${dayItem.solarMonth.bengali.slice(0, 3)} ${toBengaliNumerals(dayItem.souraDate)}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ───── 4. BOTTOM BAR: LEGEND & LINK ───── */}
      <div className="p-2 sm:p-2.5 bg-[#f4ebd9]/50 dark:bg-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 font-serif">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>Holiday / Sunday / 2nd Sat</span>
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Today</span>
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-red-700">
            <span className="w-2 h-2 rounded-full bg-red-700 text-white flex items-center justify-center text-[6px]">●</span>
            <span>Purnima / Thasi</span>
          </span>
        </div>

        <Link
          href="/calendar"
          className="text-amber-800 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
        >
          <span>Open Full Wall Calendar Details</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
