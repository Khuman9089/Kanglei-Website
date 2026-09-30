'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col font-sans transition-all">
      {/* Accent Top Ribbon */}
      <div className="h-1 bg-amber-600" />

      {/* ───── 1. COMPACT SINGLE-LINE HEADER BANNER ───── */}
      <div className="bg-[#1e1b18] text-white px-3 py-2.5 border-b border-gray-200">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left: Nav controls + Month/Year selects */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg border border-gray-700 bg-black/40 hover:bg-black/60 text-gray-200 transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <select
              id="home-cal-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="h-7 px-2 rounded-lg text-xs font-semibold border border-gray-700 bg-[#2b241d] text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {MONTHS_LIST.map((m) => (
                <option key={m.value} value={m.value} className="bg-[#1e1b18] text-white">
                  {scriptMode === 'meetei' ? m.nameMeetei : scriptMode === 'bengali' ? m.nameBengali : m.nameEn} ({m.nameEn})
                </option>
              ))}
            </select>

            <select
              id="home-cal-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="h-7 px-2 rounded-lg text-xs font-semibold border border-gray-700 bg-[#2b241d] text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-mono"
            >
              {YEARS_LIST.map((y) => (
                <option key={y} value={y} className="bg-[#1e1b18] text-white">
                  {y}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg border border-gray-700 bg-black/40 hover:bg-black/60 text-gray-200 transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {!isCurrentMonthPresent && (
              <button
                type="button"
                onClick={handleJumpToToday}
                className="h-7 px-2 rounded-lg text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer flex items-center gap-1 transition"
                title="Jump to current month"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Today</span>
              </button>
            )}
          </div>

          {/* Center: Month title + dual-month span */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold tracking-wider text-amber-400 uppercase">
              {currentMonthItem.nameEn}
            </span>
            <span className="text-xs font-semibold text-gray-300 hidden sm:inline">
              {scriptMode === 'meetei'
                ? `${calendarData.manipuriMonthSpanMeetei} — ${calendarData.solarMonthSpanMeetei}`
                : `${calendarData.manipuriMonthSpanBengali} — ${calendarData.solarMonthSpanBengali}`}
              <span className="text-amber-400 ml-1 font-mono text-[10px] font-bold">
                ({scriptMode === 'meetei' ? `ꯁꯀꯥꯕ꯭ꯗ ${toMeeteiNumerals(calendarData.souraYearSpan)}` : `শকাব্দ ${toBengaliNumerals(calendarData.souraYearSpan)}`})
              </span>
            </span>
          </div>

          {/* Right: Script Switcher */}
          <div className="inline-flex rounded-lg border border-gray-700 p-0.5 bg-[#2b241d] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setScriptMode('bengali')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                scriptMode === 'bengali'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              বাং
            </button>
            <button
              type="button"
              onClick={() => setScriptMode('meetei')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                scriptMode === 'meetei'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ꯃꯤ
            </button>
            <button
              type="button"
              onClick={() => setScriptMode('en')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                scriptMode === 'en'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* ───── 2. WEEKDAY HEADERS (SUN - SAT) ───── */}
      <div className="grid grid-cols-7 bg-[#F8FAFC] border-b border-[#E5E7EB] text-center">
        {WEEKDAYS_MANIPURI.map((wd) => {
          const isSun = wd.day === 0;
          return (
            <div
              key={wd.day}
              className="py-1.5 md:py-2.5 px-0.5 md:px-1 flex flex-col items-center justify-center border-r border-[#E5E7EB] last:border-r-0"
            >
              {/* Mobile: single compact row SUN - SAT at 11px bold */}
              <div
                className={`text-[11px] md:text-[13px] font-bold uppercase tracking-wider leading-none ${
                  isSun ? 'text-[#DC2626]' : 'text-[#64748B]'
                }`}
              >
                {wd.shortEn}
              </div>
              {/* Desktop: trilingual stacked labels */}
              <div className="hidden md:flex flex-col items-center mt-1 space-y-0.5">
                <span
                  className={`text-[10px] font-semibold leading-none ${
                    isSun ? 'text-[#DC2626]' : 'text-[#475569]'
                  }`}
                >
                  {wd.meetei}
                </span>
                <span
                  className={`text-[10px] font-semibold leading-none ${
                    isSun ? 'text-[#DC2626]' : 'text-[#64748B]'
                  }`}
                >
                  {wd.bengali}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ───── 3. RESPONSIVE 7-COLUMN DAYS GRID ───── */}
      <div className="bg-[#E5E7EB] grid grid-cols-7 gap-[1px]">
        {calendarData.weeks.flatMap((week, wIdx) =>
          week.map((dayItem, dIdx) => {
            if (!dayItem) {
              return (
                <div
                  key={`empty-${wIdx}-${dIdx}`}
                  className="min-h-[70px] md:min-h-[115px] bg-[#FAFAFA]"
                />
              );
            }

            const isSunday = dayItem.weekday === 0;
            const isGeneralHoliday = dayItem.isGeneralHoliday || !!(dayItem.festival && dayItem.festival.isGeneralHoliday);
            const isHoliday = isSunday || isGeneralHoliday;
            const isSelected = dayItem.dateStr === selectedDateStr;
            const isToday = dayItem.isToday;

            const monthName =
              scriptMode === 'meetei'
                ? dayItem.manipuriMonth.nameMeetei
                : dayItem.manipuriMonth.nameBengali;

            const tithiNumStr =
              scriptMode === 'meetei'
                ? dayItem.isDualTithi
                  ? `${toMeeteiNumerals(dayItem.tithiNumber)}, ${toMeeteiNumerals(dayItem.tithiNumber + 1)}`
                  : toMeeteiNumerals(dayItem.tithiNumber)
                : dayItem.isDualTithi
                ? `${toBengaliNumerals(dayItem.tithiNumber)}, ${toBengaliNumerals(dayItem.tithiNumber + 1)}`
                : toBengaliNumerals(dayItem.tithiNumber);

            const nakshatraName =
              scriptMode === 'meetei'
                ? dayItem.nakshatraNameMeetei
                : dayItem.nakshatraNameBengali;

            const nakshatraNum =
              scriptMode === 'meetei'
                ? dayItem.nakshatraDisplayNumMeetei
                : dayItem.nakshatraDisplayNumBengali;

            // Event or Holiday display badge
            const eventBadgeLabel = dayItem.festival
              ? scriptMode === 'meetei'
                ? dayItem.festival.nameMeetei || dayItem.festival.nameBengali
                : dayItem.festival.nameBengali
              : dayItem.isPurnima
              ? scriptMode === 'meetei'
                ? 'ꯄꯨꯔꯅꯤꯃꯥ'
                : 'পূর্ণিমা'
              : dayItem.isAmavasya
              ? scriptMode === 'meetei'
                ? 'ꯊꯥꯁꯤ'
                : 'থাশী'
              : dayItem.isEkadashi
              ? scriptMode === 'meetei'
                ? 'ꯑꯦꯀꯥꯗꯁꯤ'
                : 'একাদশী'
              : null;

            return (
              <button
                type="button"
                key={dayItem.dateStr}
                title={`${dayItem.dateStr} • ${
                  scriptMode === 'meetei'
                    ? dayItem.tithiDisplayMeetei
                    : dayItem.tithiDisplayBengali
                } • Nakshatra: ${
                  scriptMode === 'meetei'
                    ? dayItem.nakshatraDisplayMeetei
                    : dayItem.nakshatraDisplayBengali
                }${eventBadgeLabel ? ` • ${eventBadgeLabel}` : ''}`}
                onClick={() => handleDayClick(dayItem)}
                className={`relative min-h-[74px] md:min-h-[115px] p-1 md:p-2 flex flex-col justify-center md:justify-between items-center md:items-stretch text-center md:text-left overflow-hidden cursor-pointer transition-all select-none rounded-[10px] md:rounded-none border md:border-0 ${
                  isToday
                    ? 'bg-[#FFFBEB] ring-2 ring-inset ring-amber-500 border-amber-500 rounded-lg z-10'
                    : isSelected
                    ? 'bg-[#FFFBEB] ring-2 ring-inset ring-amber-600 border-amber-600 shadow-xs z-10'
                    : isHoliday
                    ? 'bg-[#FFF5F5] border-red-200/90 hover:bg-rose-100/60'
                    : 'bg-white border-[#F1F5F9] hover:bg-slate-50'
                }`}
              >
                {/* ── MOBILE TOP-LEFT: Nakshatra Number ONLY ── */}
                <span
                  className={`md:hidden absolute top-1 left-1.5 text-[10px] font-semibold leading-none ${
                    isToday ? 'text-[#B45309]' : isHoliday ? 'text-red-400' : 'text-slate-400'
                  }`}
                >
                  {nakshatraNum}
                </span>

                {/* ── TOP ROW: Gregorian Date & Badges/Indicators ── */}
                <div className="flex items-start justify-center md:justify-between w-full gap-1">
                  <span
                    className={`text-lg md:text-xl font-extrabold tracking-tight leading-none font-sans ${
                      isHoliday
                        ? 'text-[#DC2626]'
                        : isToday
                        ? 'text-[#B45309]'
                        : 'text-[#0F172A]'
                    }`}
                  >
                    {dayItem.day}
                  </span>

                  {/* Desktop: Full Event/Holiday Badge */}
                  {eventBadgeLabel && (
                    <span
                      className={`hidden md:inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded truncate max-w-[65%] leading-tight ${
                        dayItem.isGeneralHoliday
                          ? 'bg-red-100 text-red-700'
                          : dayItem.isPurnima || dayItem.isAmavasya
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                      title={eventBadgeLabel}
                    >
                      {eventBadgeLabel}
                    </span>
                  )}

                  {/* Mobile: 5px Colored Indicator Dot */}
                  {(isHoliday || dayItem.festival || dayItem.isPurnima || dayItem.isAmavasya || dayItem.isEkadashi) && (
                    <div className="md:hidden absolute top-1.5 right-1.5 flex items-center gap-0.5">
                      {isHoliday || dayItem.isPurnima ? (
                        <span className="w-[5px] h-[5px] rounded-full bg-red-500 shrink-0" />
                      ) : (
                        <span className="w-[5px] h-[5px] rounded-full bg-amber-500 shrink-0" />
                      )}
                    </div>
                  )}
                </div>

                {/* ── MIDDLE ROW: Manipuri Month Name at Center (Just Below Date) ── */}
                <div className="my-0.5 md:my-auto py-0.5 w-full text-center">
                  {/* Desktop Layout: Month Name centered prominently */}
                  <div className="hidden md:flex flex-col items-center justify-center">
                    <span
                      className={`text-[13px] font-bold tracking-wide leading-tight truncate block ${
                        isHoliday ? 'text-[#991B1B]' : 'text-[#334155]'
                      }`}
                    >
                      {monthName}
                    </span>
                  </div>

                  {/* Mobile Layout: Month Name below Date */}
                  <div className="md:hidden flex flex-col items-center leading-tight">
                    <span
                      className={`text-[10px] font-medium truncate max-w-full block ${
                        isHoliday ? 'text-[#DC2626]' : isToday ? 'text-[#92400E]' : 'text-slate-600'
                      }`}
                    >
                      {monthName}
                    </span>
                  </div>
                </div>

                {/* ── BOTTOM ROW: Tithi (Mobile) / Nakshatra + Tithi (Desktop) ── */}
                {/* Desktop: Clean neutral Nakshatra pill on left + Tithi at bottom right */}
                <div className="hidden md:flex items-center justify-between w-full gap-1.5 mt-auto pt-0.5">
                  <div className="bg-slate-100 text-slate-700 text-xs px-1.5 py-0.5 rounded truncate flex items-center gap-1 max-w-[65%]">
                    <span className="truncate">{nakshatraName}</span>
                    <span className="font-mono text-[10px] text-slate-500 shrink-0">
                      {nakshatraNum}
                    </span>
                  </div>

                  {/* Tithi at bottom right hand side */}
                  <span
                    className={`text-[12px] font-bold tracking-tight text-right shrink-0 px-1.5 py-0.5 rounded ${
                      isHoliday
                        ? 'text-[#991B1B] bg-rose-50/80'
                        : isToday
                        ? 'text-[#B45309] bg-amber-100/60'
                        : 'text-[#1F2937] bg-slate-100/90'
                    }`}
                    title={`Tithi: ${tithiNumStr}`}
                  >
                    {tithiNumStr}
                  </span>
                </div>

                {/* Mobile: Tithi Number at bottom */}
                <div className="md:hidden text-[10.5px] font-bold leading-none mt-0.5 truncate w-full block text-center">
                  <span className={isHoliday ? 'text-[#DC2626]' : isToday ? 'text-[#92400E]' : 'text-slate-800'}>
                    {tithiNumStr}
                  </span>
                </div>

                {/* Mobile: Holiday / Event Name directly mentioned in cell */}
                {eventBadgeLabel && (
                  <span
                    className="md:hidden text-[7.5px] font-bold text-red-700 bg-red-100/95 border border-red-200/80 px-1 py-0.2 rounded leading-none truncate max-w-[95%] block mt-0.5"
                    title={eventBadgeLabel}
                  >
                    {eventBadgeLabel}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* ───── 3.5 ACTIVE SELECTED DAY RESULT BANNER ───── */}
      {(() => {
        const activeItem = calendarData.weeks.flatMap((w) => w).find((d) => d && d.dateStr === selectedDateStr);
        if (!activeItem) return null;
        const isSelSunday = activeItem.weekday === 0;
        const isSelHoliday = isSelSunday || activeItem.isGeneralHoliday || !!(activeItem.festival && activeItem.festival.isGeneralHoliday);

        return (
          <div className="p-3 bg-white border-t border-[#E5E7EB]">
            {isSelHoliday ? (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-950 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-red-600 px-2 py-0.5 rounded-full mr-1.5 shadow-2xs">
                      🔴 ছুতিগী নুমিৎ (HOLIDAY)
                    </span>
                    <strong className="text-xs text-red-950 font-bold">
                      {activeItem.festival
                        ? (scriptMode === 'meetei' ? activeItem.festival.nameMeetei : activeItem.festival.nameBengali)
                        : isSelSunday
                        ? (scriptMode === 'meetei' ? 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ (Sunday Weekly Off)' : 'রবিবার (Sunday Weekly Off)')
                        : 'ছুতিগী নুমিৎ (Holiday)'}
                    </strong>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-red-700 font-mono shrink-0">
                  {activeItem.dateStr}
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-emerald-900 truncate">
                    {scriptMode === 'meetei' ? '🟢 ꯊꯕꯛ ꯁꯨꯕ ꯅꯨꯃꯤꯠ (Normal Working Day)' : '🟢 কারবারগী নুমিৎ (Working Day / Normal Day)'}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 font-mono shrink-0">
                  {activeItem.dateStr}
                </span>
              </div>
            )}
          </div>
        );
      })()}

      {/* ───── 4. BOTTOM BAR: LEGEND & LINK ───── */}
      <div className="p-2 sm:p-2.5 bg-gray-50 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-700 font-medium border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 font-semibold text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>Holiday / Sunday</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Today</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-purple-700">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Purnima / Thasi</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Festival / Ekadashi</span>
          </span>
        </div>

        <Link
          href="/calendar"
          className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer ml-auto"
        >
          <span>Open Full Wall Calendar Details</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
