'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Clock,
  Sparkles,
  Printer,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Compass,
  Flame,
  Globe,
  RotateCcw,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { getMonthlyCalendar, CalendarDay, MonthlyCalendarData } from '@/engine/manipuriCalendar';
import {
  WEEKDAYS_MANIPURI,
  MANIPURI_MONTH_ATTRIBUTES,
  MANIPURI_MONTH_ATTRIBUTES_HEADERS,
} from '@/data/manipuriMonthAttributes';

type ScriptMode = 'bengali' | 'meetei' | 'en';

function toMeeteiNum(num: number | string): string {
  const digits: Record<string, string> = {
    '0': '꯰', '1': '꯱', '2': '꯲', '3': '꯳', '4': '꯴',
    '5': '꯵', '6': '꯶', '7': '꯷', '8': '꯸', '9': '꯹'
  };
  return String(num).split('').map(c => digits[c] || c).join('');
}

function toBengaliNum(num: number | string): string {
  const digits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).split('').map(c => digits[c] || c).join('');
}

export default function MonthlyCalendarView() {
  const now = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, [now]);

  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1); // 1-12
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [scriptMode, setScriptMode] = useState<ScriptMode>('bengali');
  const [modalDay, setModalDay] = useState<CalendarDay | null>(null);

  // Compute calendar data for current year & month
  const calendarData = useMemo(() => {
    return getMonthlyCalendar(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // Find active selected day within current month
  const activeDay = useMemo(() => {
    for (const week of calendarData.weeks) {
      for (const day of week) {
        if (day && day.dateStr === selectedDateStr) {
          return day;
        }
      }
    }
    // Fallback to first non-empty day of the month
    for (const week of calendarData.weeks) {
      for (const day of week) {
        if (day) return day;
      }
    }
    return null;
  }, [calendarData, selectedDateStr]);

  // Month navigation
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(prev => prev - 1);
      setSelectedDateStr(`${selectedYear - 1}-12-01`);
    } else {
      const prevM = selectedMonth - 1;
      setSelectedMonth(prevM);
      setSelectedDateStr(`${selectedYear}-${String(prevM).padStart(2, '0')}-01`);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(prev => prev + 1);
      setSelectedDateStr(`${selectedYear + 1}-01-01`);
    } else {
      const nextM = selectedMonth + 1;
      setSelectedMonth(nextM);
      setSelectedDateStr(`${selectedYear}-${String(nextM).padStart(2, '0')}-01`);
    }
  };

  // Jump to Present Date (Current Day & Month)
  const handleJumpToToday = () => {
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth() + 1);
    setSelectedDateStr(todayStr);
  };

  // Handle direct Date Picker selection
  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    setSelectedDateStr(val);
    const parts = val.split('-').map(Number);
    if (parts.length === 3 && parts[0] && parts[1]) {
      setSelectedYear(parts[0]);
      setSelectedMonth(parts[1]);
    }
  };

  const isCurrentMonthPresent = 
    selectedYear === now.getFullYear() && selectedMonth === (now.getMonth() + 1);

  // Month options for dropdown
  const MONTHS_LIST = [
    { value: 1, nameEn: 'January', nameBengali: 'জানুয়ারী', nameMeetei: 'ꯖꯥꯅꯨꯋꯥꯔꯤ' },
    { value: 2, nameEn: 'February', nameBengali: 'ফেব্রুয়ারী', nameMeetei: 'ꯐꯦꯕ꯭ꯔꯨꯋꯥꯔꯤ' },
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

  // Year options list from 1925 to 2050
  const YEARS_LIST = useMemo(() => {
    const years: number[] = [];
    for (let y = 1925; y <= 2050; y++) {
      years.push(y);
    }
    return years;
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-6 font-sans print:p-0 print:m-0 print:max-w-none">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. SELECTION PAGE / CONTROL PANEL                             */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-amber-200/90 p-4 sm:p-6 print:hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Title Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
                <CalendarIcon className="w-6 h-6 text-amber-600" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Manipuri Monthly Calendar</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-sans font-bold border border-amber-300">
                    থাগী ক্যালেন্ডার
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-serif">
                  {scriptMode === 'meetei'
                    ? 'ꯃꯇꯤꯡ ꯂꯩꯕ ꯀꯪꯂꯩ ꯊꯥꯒꯤ ꯀꯦꯂꯦꯟꯗꯔ — ꯊꯕꯥꯅꯤꯛ, ꯁꯧꯔ ꯁꯀꯥꯕ꯭ꯗ, ꯇꯥꯁꯤ ꯃꯍꯩ ꯑꯃꯁꯨꯡ ꯇꯠꯅꯕ ꯅꯨꯃꯤꯠ'
                    : 'প্রামাণিক কাংলৈ মাসিক ক্যালেন্ডার — চান্দ্র থবানীং, সৌর শকাব্দ, তাসী মহৈ ও তৎনবা নুমিৎ'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Present Date Button & Script Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* "Present Date" / Today Jump Button */}
            <button
              id="btn-present-date"
              onClick={handleJumpToToday}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs ${
                isCurrentMonthPresent && selectedDateStr === todayStr
                  ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400/40'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
              title="Jump to Present Date (Today)"
            >
              <span className={`w-2 h-2 rounded-full ${isCurrentMonthPresent ? 'bg-white animate-pulse' : 'bg-amber-600'}`} />
              <span>Present Date (নুমিৎ অসিদা)</span>
            </button>

            {/* Script Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-gray-100 border border-gray-200 text-xs">
              <button
                id="btn-script-bengali"
                onClick={() => setScriptMode('bengali')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  scriptMode === 'bengali'
                    ? 'bg-white text-gray-900 font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                বাংলা
              </button>
              <button
                id="btn-script-meetei"
                onClick={() => setScriptMode('meetei')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  scriptMode === 'meetei'
                    ? 'bg-white text-gray-900 font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ꯃꯤꯇꯩ ꯃꯌꯦꯛ
              </button>
              <button
                id="btn-script-en"
                onClick={() => setScriptMode('en')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                  scriptMode === 'en'
                    ? 'bg-white text-gray-900 font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Print Button */}
            <button
              id="btn-print-calendar"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs transition"
              title="Print Monthly Calendar"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              <span>Print</span>
            </button>
          </div>

        </div>

        {/* Date, Month & Year Selection Inputs Bar */}
        <div className="pt-3 border-t border-amber-100 flex flex-wrap items-center gap-3">
          
          {/* Direct Date Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 font-serif">Select Date:</span>
            <input
              type="date"
              id="input-direct-date"
              value={selectedDateStr}
              onChange={handleDatePickerChange}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-amber-300 bg-amber-50/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
            />
          </div>

          <div className="hidden sm:block h-5 w-px bg-gray-200" />

          {/* Month & Year Steppers */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-prev-month"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl border border-gray-200 hover:border-amber-400 bg-white hover:bg-amber-50 text-gray-700 transition shadow-xs"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Month Dropdown */}
            <select
              id="select-month"
              value={selectedMonth}
              onChange={(e) => {
                const newM = Number(e.target.value);
                setSelectedMonth(newM);
                setSelectedDateStr(`${selectedYear}-${String(newM).padStart(2, '0')}-01`);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
            >
              {MONTHS_LIST.map((m) => (
                <option key={m.value} value={m.value}>
                  {scriptMode === 'meetei' ? m.nameMeetei : scriptMode === 'bengali' ? m.nameBengali : m.nameEn} ({m.nameEn})
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              id="select-year"
              value={selectedYear}
              onChange={(e) => {
                const newY = Number(e.target.value);
                setSelectedYear(newY);
                setSelectedDateStr(`${newY}-${String(selectedMonth).padStart(2, '0')}-01`);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer font-mono"
            >
              {YEARS_LIST.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              id="btn-next-month"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl border border-gray-200 hover:border-amber-400 bg-white hover:bg-amber-50 text-gray-700 transition shadow-xs"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Selection Indicator */}
          <div className="ml-auto text-xs font-serif text-gray-500">
            Active: <strong className="text-amber-800">{calendarData.monthNameEn}</strong> ({calendarData.daysInMonth} Days)
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. EXCEL & REFERENCE THEME CALENDAR BANNER                    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-[#051c4a] text-white shadow-md p-4 sm:p-5 border-2 border-[#031333]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Main Month & Year in Bright Yellow (Matching Reference Image) */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wider text-[#ffe600] uppercase drop-shadow-xs">
              {calendarData.monthNameEn} {calendarData.year}
            </h2>
            <div className="text-[11px] sm:text-xs text-sky-200/90 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-serif">
              <span>
                সৌর মাস: <strong className="text-amber-300">{scriptMode === 'meetei' ? calendarData.solarMonthSpanMeetei : calendarData.solarMonthSpanBengali}</strong>
              </span>
              <span>•</span>
              <span>
                সৌর শকাব্দ: <strong className="text-amber-300 font-mono">{calendarData.souraYearSpan}</strong>
              </span>
            </div>
          </div>

          {/* Central / Right: Manipuri Lunar Month Span in Bright Yellow */}
          <div className="text-left sm:text-right">
            <span className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#ffe600] tracking-wide block drop-shadow-xs">
              {scriptMode === 'meetei'
                ? calendarData.manipuriMonthSpanMeetei
                : calendarData.manipuriMonthSpanBengali}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-sky-200 font-sans font-semibold">
              Manipuri Lunar Month Span
            </span>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. CALENDAR 7-COLUMN GRID (Matching Reference Image)          */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#edf6fc] rounded-2xl shadow-sm border-2 border-[#8db5d4] overflow-hidden">
        
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b-2 border-[#8db5d4] bg-[#e4f1fa] text-gray-900 font-serif">
          {WEEKDAYS_MANIPURI.map((wd) => {
            const isSun = wd.day === 0;
            return (
              <div
                key={wd.day}
                className={`py-2 px-1 text-center border-r border-[#8db5d4] last:border-r-0 ${
                  isSun ? 'text-red-600 font-black bg-red-50/50' : 'text-gray-900 font-black'
                }`}
              >
                <div className="text-xs sm:text-sm md:text-base font-black tracking-wide">
                  {wd.shortEn === 'Thu' ? 'THR' : wd.shortEn.toUpperCase()}
                </div>
                <div className={`text-[10.5px] sm:text-xs md:text-sm font-serif truncate ${
                  isSun ? 'text-red-600 font-bold' : 'text-gray-800 font-bold'
                }`}>
                  {scriptMode === 'meetei'
                    ? wd.meetei
                    : wd.day === 3
                    ? 'য়ুমশেকৈশা'
                    : wd.day === 4
                    ? 'শগোলশেন'
                    : wd.bengali}
                </div>
              </div>
            );
          })}
        </div>

        {/* Days Grid - ALWAYS 7 columns on ALL devices (Mobile alignment fixed!) */}
        <div className="divide-y divide-[#8db5d4]">
          {calendarData.weeks.map((week, wIdx) => (
            <div
              key={`week-${wIdx}`}
              className="grid grid-cols-7 divide-x divide-[#8db5d4] w-full"
            >
              {week.map((dayItem, dIdx) => {
                // FIXED FOR MOBILE: Empty padding cells are ALWAYS rendered (never hidden)
                // so week 1 strictly starts under the correct weekday starting from Sunday!
                if (!dayItem) {
                  return (
                    <div
                      key={`empty-${wIdx}-${dIdx}`}
                      className="bg-[#e2eef7]/40 min-h-[85px] sm:min-h-[115px] md:min-h-[130px]"
                    />
                  );
                }

                const isSunday = dayItem.weekday === 0;
                const isHoliday = isSunday || dayItem.isGeneralHoliday;
                const isSelected = dayItem.dateStr === selectedDateStr;

                return (
                  <div
                    key={dayItem.dateStr}
                    id={`cal-day-${dayItem.day}`}
                    onClick={() => {
                      setSelectedDateStr(dayItem.dateStr);
                    }}
                    onDoubleClick={() => setModalDay(dayItem)}
                    className={`relative p-1 sm:p-1.5 cursor-pointer transition-all duration-150 flex flex-col justify-between select-none min-h-[85px] sm:min-h-[115px] md:min-h-[130px] group ${
                      isSelected
                        ? 'bg-amber-100/90 ring-2 ring-inset ring-amber-600 shadow-md z-10'
                        : dayItem.isToday
                        ? 'bg-amber-50 ring-2 ring-inset ring-amber-400'
                        : isHoliday
                        ? 'bg-[#fcf5f5] hover:bg-red-50/80'
                        : 'bg-[#edf6fc] hover:bg-[#e0effa]'
                    }`}
                  >
                    {/* Top Row: Festival note / Saka date badge */}
                    <div className="flex items-start justify-between gap-0.5 min-h-[16px]">
                      {/* Festival or Special Event Name */}
                      {dayItem.festival ? (
                        <span
                          className={`text-[8.5px] sm:text-[10px] font-bold leading-tight block truncate max-w-[80%] ${
                            isHoliday ? 'text-red-600' : 'text-amber-800'
                          }`}
                          title={`${dayItem.festival.nameEn} (${dayItem.festival.category})`}
                        >
                          {scriptMode === 'meetei'
                            ? dayItem.festival.nameMeetei
                            : dayItem.festival.nameBengali}
                        </span>
                      ) : (
                        <span />
                      )}

                      {/* Small Saka Solar Day (Saka / Soura Date) */}
                      <span
                        className="text-[8px] sm:text-[9.5px] font-mono font-semibold text-gray-500 hover:text-gray-900 ml-auto shrink-0"
                        title={`Soura Date: ${dayItem.souraDate} (${dayItem.solarMonth.bengali})`}
                      >
                        {scriptMode === 'meetei' ? toMeeteiNum(dayItem.souraDate) : toBengaliNum(dayItem.souraDate)}
                      </span>
                    </div>

                    {/* CENTER: BIG BOLD DATE NUMBER & FLOATING AUSPICIOUS ICONS */}
                    <div className="flex-1 flex flex-col items-center justify-center relative my-0.5">
                      
                      {/* Ekadashi Crescent Badge (Like day 3 & 19 in Reference Image) */}
                      {dayItem.isEkadashi && (
                        <div
                          className="mb-0.5 px-2 py-0.5 rounded-t-full rounded-b-md bg-black text-white text-[8px] sm:text-[9.5px] font-serif font-bold shadow-xs"
                          title="Ekadashi (একাদশী)"
                        >
                          <span>{scriptMode === 'meetei' ? 'ꯑꯦꯀꯥꯗꯁꯤ' : 'একাদশী'}</span>
                        </div>
                      )}

                      {/* Thasi (Amavasya) Solid Black Circle (Like day 7 in Reference Image) */}
                      {dayItem.isAmavasya && (
                        <div
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black text-white text-[7.5px] sm:text-[8.5px] font-serif font-bold flex items-center justify-center shadow-xs mx-auto mb-0.5"
                          title="Thasi / Amavasya (থাসী)"
                        >
                          <span>{scriptMode === 'meetei' ? 'ꯊꯥꯁꯤ' : 'থাসী'}</span>
                        </div>
                      )}

                      {/* Purnima White Circle with Black Border (Like day 22 in Reference Image) */}
                      {dayItem.isPurnima && (
                        <div
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black border-2 border-black text-[7.5px] sm:text-[8.5px] font-serif font-bold flex items-center justify-center shadow-xs mx-auto mb-0.5"
                          title="Purnima (পূর্ণিমা)"
                        >
                          <span>{scriptMode === 'meetei' ? 'ꯄꯨꯔꯅꯤꯃꯥ' : 'পূর্ণিমা'}</span>
                        </div>
                      )}

                      {/* Christmas Tree Accent */}
                      {dayItem.festival?.id === 'christmas' && (
                        <span className="text-sm sm:text-base leading-none mb-0.5">🎄</span>
                      )}

                      {/* THE BIG CENTERED DATE NUMBER (1, 2, ... 31 in Serif font) */}
                      <span
                        className={`font-serif font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none tracking-tight ${
                          isHoliday
                            ? 'text-red-600 font-bold'
                            : 'text-gray-900 font-bold'
                        }`}
                      >
                        {dayItem.day}
                      </span>

                    </div>

                    {/* BOTTOM: MANIPURI LUNAR MONTH & TITHI (In Red if Sunday/Holiday) */}
                    <div className="pt-0.5 border-t border-[#c5dceb] flex items-center justify-between px-0.5 text-[9px] sm:text-[10.5px] md:text-xs leading-tight">
                      <span
                        className={`font-serif font-bold truncate ${
                          isHoliday ? 'text-red-600' : 'text-gray-800'
                        }`}
                        title={`Lunar Month & Tithi: ${dayItem.tithiDisplayBengali}`}
                      >
                        {scriptMode === 'meetei'
                          ? dayItem.tithiDisplayMeetei
                          : dayItem.tithiDisplayBengali}
                      </span>

                      {/* Small Tithi Ending Time */}
                      <span
                        className="text-[8px] sm:text-[9px] font-mono text-gray-500 font-semibold tracking-tight hidden sm:inline"
                        title={`Tithi Ending: ${dayItem.tithiEndingStandard} (${dayItem.tithiEndingTime})`}
                      >
                        {dayItem.tithiEndingTime}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. ACTIVE SELECTED DAY DETAIL CARD (Embedded On-Page)         */}
      {/* ------------------------------------------------------------- */}
      {activeDay && (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-300 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-serif font-black ${activeDay.isGeneralHoliday || activeDay.weekday === 0 ? 'text-red-700' : 'text-gray-900'}`}>
                  {activeDay.dateStr}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  activeDay.weekday === 0
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {activeDay.weekdayName.bengali} ({activeDay.weekdayName.en})
                </span>
                {activeDay.isToday && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                    TODAY (নুমিৎ অসি)
                  </span>
                )}
                {activeDay.isGeneralHoliday && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white">
                    General Holiday (ছুটি)
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-serif mt-0.5">
                {scriptMode === 'meetei' ? activeDay.tithiDisplayMeetei : activeDay.tithiDisplayBengali} • Soura {activeDay.souraDate} {activeDay.solarMonth.bengali}, Saka {activeDay.sakaYear}
              </p>
              {activeDay.festival && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-xs font-bold text-red-900 font-serif">
                    {scriptMode === 'meetei' ? activeDay.festival.nameMeetei : activeDay.festival.nameBengali}
                  </span>
                  <span className="text-[11px] text-red-700">
                    ({activeDay.festival.nameEn})
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalDay(activeDay)}
                className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition shadow-xs"
              >
                Expand Details
              </button>
              <Link
                href={`/panchang?date=${activeDay.dateStr}`}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs inline-flex items-center gap-1"
              >
                <span>Full Panchang</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-serif">
            
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="text-[11px] text-gray-500 block">থবানীং (Tithi Ending):</span>
              <strong className="text-sm text-gray-900 block">{activeDay.tithiDisplayBengali}</strong>
              <span className="font-mono text-[11px] text-amber-800 font-bold block">
                Ending: {activeDay.tithiEndingStandard} ({activeDay.tithiEndingTime})
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="text-[11px] text-gray-500 block">Surya Udaya & Asta:</span>
              <div className="flex items-center justify-between font-mono font-bold text-gray-900">
                <span>🌅 {activeDay.panchang.sunMoonTimings.sunrise}</span>
                <span>🌇 {activeDay.panchang.sunMoonTimings.sunset}</span>
              </div>
              <span className="text-[11px] text-gray-500 block">
                Length: {activeDay.panchang.sunMoonTimings.dayLength}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="text-[11px] text-gray-500 block">Nakshatra & Pada:</span>
              <strong className="text-sm text-gray-900 block">
                {activeDay.panchang.fiveAngas.nakshatra.name}
              </strong>
              <span className="text-[11px] text-gray-600 block">
                Pada {activeDay.panchang.fiveAngas.nakshatra.pada} • Lord {activeDay.panchang.fiveAngas.nakshatra.lord}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="text-[11px] text-gray-500 block">Ee Khudeng Status:</span>
              <strong className={`text-sm block ${activeDay.isKongbaLeiba ? 'text-emerald-700' : 'text-rose-700'}`}>
                {activeDay.isKongbaLeiba
                  ? (scriptMode === 'meetei' ? 'ꯏ ꯈꯨꯗꯦꯡ ꯂꯩꯕ (Auspicious)' : 'ঈ খুদেং লৈবা (Auspicious)')
                  : (scriptMode === 'meetei' ? 'ꯏ ꯈꯨꯗꯦꯡ ꯂꯩꯇꯕ (Prohibited)' : 'ঈ খুদেং লৈতবা (Prohibited)')}
              </strong>
              <span className="font-mono text-[11px] text-rose-700 block">
                Rahu: {activeDay.panchang.muhurtas.rahuKaal.start} – {activeDay.panchang.muhurtas.rahuKaal.end}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. BOTTOM SECTION: MONTH ATTRIBUTES TABLE & KONGBA LEIBA RULES */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table of Monthly Attributes (থা মমিং অমসুং নুমিৎশিং - Blipi15 Month Attributes) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-amber-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-serif font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>
                {scriptMode === 'meetei' ? 'ꯊꯥ ꯃꯃꯤꯡ ꯑꯃꯁꯨꯡ ꯅꯨꯃꯤꯠꯁꯤꯡ' : 'থা মমিং অমসুং নুমিৎশিং'}
              </span>
            </h3>
          </div>

          {/* Theme-matched Table with Blipi15 font */}
          <div className="overflow-x-auto rounded-xl border border-amber-200 shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100/60 text-amber-950 border-b border-amber-200 font-blipi">
                  <th className="py-3 px-4 border-r border-amber-200/80 font-normal text-sm sm:text-base tracking-wide whitespace-nowrap text-amber-950">
                    {scriptMode === 'meetei' ? 'ꯊꯥ ꯃꯃꯤꯡ' : 'Ta mimz'}
                  </th>
                  <th className="py-3 px-4 border-r border-amber-200/80 font-normal text-sm sm:text-base tracking-wide whitespace-nowrap text-amber-950">
                    {scriptMode === 'meetei' ? 'ꯇꯠꯅꯕ ꯅꯨꯃꯤꯠꯁꯤꯡ' : 't\\nba nuim\\iSz'}
                  </th>
                  <th className="py-3 px-4 border-r border-amber-200/80 font-normal text-sm sm:text-base tracking-wide whitespace-nowrap text-amber-950">
                    {scriptMode === 'meetei' ? 'ꯊꯥꯁꯤ ꯃꯥꯏꯒꯩ' : 'TaiS mah~e~g'}
                  </th>
                  <th className="py-3 px-4 border-r border-amber-200/80 font-normal text-sm sm:text-base tracking-wide whitespace-nowrap text-amber-950">
                    {scriptMode === 'meetei' ? 'ꯋꯥꯏꯇꯦꯛ ꯅꯨꯃꯤꯠꯁꯤꯡ' : 'wah~etk nuim\\iSz'}
                  </th>
                  <th className="py-3 px-4 font-normal text-sm sm:text-base tracking-wide whitespace-nowrap text-amber-950">
                    {scriptMode === 'meetei' ? 'ꯆꯩ ꯀꯥꯕ ꯅꯨꯃꯤꯠꯁꯤꯡ' : 'E~c kab nuim\\iSz'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100 font-blipi">
                {calendarData.activeMonthAttributes.map((attr) => (
                  <tr key={attr.monthCode} className="hover:bg-amber-50/70 even:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4 border-r border-amber-100 font-normal text-sm sm:text-base whitespace-nowrap text-amber-950 font-bold">
                      {scriptMode === 'meetei' ? attr.meetei.month : attr.blipi.month}
                    </td>
                    <td className="py-3 px-4 border-r border-amber-100 font-normal text-sm sm:text-base text-gray-800">
                      {scriptMode === 'meetei' ? attr.meetei.tatnaba : attr.blipi.tatnaba}
                    </td>
                    <td className="py-3 px-4 border-r border-amber-100 font-normal text-sm sm:text-base text-gray-800">
                      {scriptMode === 'meetei' ? attr.meetei.thasiMaigei : attr.blipi.thasiMaigei}
                    </td>
                    <td className="py-3 px-4 border-r border-amber-100 font-normal text-sm sm:text-base text-gray-800">
                      {scriptMode === 'meetei' ? attr.meetei.waitek : attr.blipi.waitek}
                    </td>
                    <td className="py-3 px-4 font-normal text-sm sm:text-base text-gray-800">
                      {scriptMode === 'meetei' ? attr.meetei.cheiKaba : attr.blipi.cheiKaba}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ee Khudeng Leiba / Leitaba Thabanis Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Compass className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-serif font-black text-gray-900">
                {scriptMode === 'meetei' ? 'ꯏ ꯈꯨꯗꯦꯡ ꯂꯩꯕ / ꯂꯩꯇꯕ ꯊꯕꯥꯅꯤꯡ' : 'ঈ খুদেং লৈবা / লৈতবা থবানীং'}
              </h3>
            </div>

            {/* Ee Khudeng Leitaba List */}
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-rose-900 font-serif">
                <span>
                  {scriptMode === 'meetei' ? 'ꯏ ꯈꯨꯗꯦꯡ ꯂꯩꯇꯕ ꯊꯕꯥꯅꯤꯡꯁꯤꯡ (Leitaba)' : 'ঈ খুদেং লৈতবা থবানীংশিং (Leitaba)'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 font-mono">
                  {calendarData.kongbaLeitabaList.length} Days
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-rose-700 tracking-wide">
                {calendarData.kongbaLeitabaList.join(', ')}
              </p>
              <p className="text-[11px] text-rose-800/80 font-serif">
                {scriptMode === 'meetei'
                  ? 'ꯊꯕꯥꯅꯤꯡ ꯱, ꯲, ꯳, ꯵, ꯱꯱, ꯱꯲, ꯱꯳, ꯱꯵, ꯲꯱, ꯲꯲, ꯲꯳, ꯲꯵ ꯑꯁꯤꯅꯤ꯫'
                  : 'থবানীং ১, ২, ৩, ৫, ১১, ১২, ১৩, ১৫, ২১, ২২, ২৩, ২৫ অসিনি।'}
              </p>
            </div>

            {/* Festivals & Holidays in this month */}
            {calendarData.monthFestivals.length > 0 && (
              <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-red-950 font-serif">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-600" />
                    <span>মণিপুরগী কুহ্মৈ অমসুং ছুটীশিং (Festivals & Holidays)</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-200 text-red-900 font-mono font-bold">
                    {calendarData.monthFestivals.length} Days
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {calendarData.monthFestivals.map((fItem) => (
                    <div
                      key={fItem.dateStr}
                      onClick={() => setSelectedDateStr(fItem.dateStr)}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-red-100 text-xs hover:border-red-300 transition cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-red-700 w-5 text-sm">
                          {fItem.day}
                        </span>
                        <div>
                          <strong className="block text-gray-900 font-serif text-[11px]">
                            {scriptMode === 'meetei' ? fItem.festival.nameMeetei : fItem.festival.nameBengali}
                          </strong>
                          <span className="text-[10px] text-gray-500 block">
                            {fItem.festival.nameEn}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        fItem.festival.isGeneralHoliday
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {fItem.festival.isGeneralHoliday ? 'Holiday' : 'Festival'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ee Khudeng Leiba List */}
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900 font-serif">
                <span>
                  {scriptMode === 'meetei' ? 'ꯏ ꯈꯨꯗꯦꯡ ꯂꯩꯕ ꯊꯕꯥꯅꯤꯡꯁꯤꯡ (Leiba)' : 'ঈ খুদেং লৈবা থবানীংশিং (Leiba)'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-mono">
                  {calendarData.kongbaLeibaList.length} Days
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-emerald-700 tracking-wide">
                {calendarData.kongbaLeibaList.join(', ')}
              </p>
              <p className="text-[11px] text-emerald-800/80 font-serif">
                {scriptMode === 'meetei'
                  ? 'ꯊꯕꯥꯅꯤꯡ ꯴, ꯶, ꯷, ꯸, ꯹, ꯱꯰, ꯱꯴, ꯱꯶, ꯱꯷, ꯱꯸, ꯱꯹, ꯲꯰, ꯲꯴, ꯲꯶, ꯲꯷, ꯲꯸, ꯲꯹, ꯳꯰ ꯑꯁꯤꯅꯤ꯫'
                  : 'থবানীং ৪, ৬, ৭, ৮, ৯, ১০, ১৪, ১৬, ১৭, ১৮, ১৯, ২০, ২৪, ২৬, ২৭, ২৮, ২৯, ৩০ অসিনি।'}
              </p>
            </div>
          </div>

          {/* Quick link to Panchang */}
          <div className="pt-2 border-t border-gray-100">
            <Link
              href="/panchang"
              className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs"
            >
              <span>View Daily Panchang (নুমিৎ খুদিংগী পঞ্চাং)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. DAY DETAIL MODAL POPUP (ON DOUBLE CLICK OR EXPAND)          */}
      {/* ------------------------------------------------------------- */}
      {modalDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 max-w-lg w-full overflow-hidden p-6 space-y-5 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-serif font-black ${modalDay.isGeneralHoliday || modalDay.weekday === 0 ? 'text-red-700' : 'text-gray-900'}`}>
                    {modalDay.dateStr}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    modalDay.weekday === 0
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {modalDay.weekdayName.bengali} ({modalDay.weekdayName.en})
                  </span>
                  {modalDay.isGeneralHoliday && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white">
                      General Holiday (ছুটি)
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-serif mt-0.5">
                  {scriptMode === 'meetei' ? modalDay.tithiDisplayMeetei : modalDay.tithiDisplayBengali} • Soura {modalDay.souraDate} {modalDay.solarMonth.bengali}, Saka {modalDay.sakaYear}
                </p>
                {modalDay.festival && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 border border-red-200">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-xs font-bold text-red-900 font-serif">
                      {scriptMode === 'meetei' ? modalDay.festival.nameMeetei : modalDay.festival.nameBengali}
                    </span>
                    <span className="text-[11px] text-red-700">
                      ({modalDay.festival.nameEn})
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setModalDay(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-900 block font-serif">Surya Udaya (Sunrise)</span>
                <span className="text-base font-mono font-bold text-gray-900">
                  {modalDay.panchang.sunMoonTimings.sunrise}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-bold text-stone-900 block font-serif">Surya Asta (Sunset)</span>
                <span className="text-base font-mono font-bold text-gray-900">
                  {modalDay.panchang.sunMoonTimings.sunset}
                </span>
              </div>
            </div>

            {/* Five Angas Snapshot */}
            <div className="space-y-2 text-xs font-serif">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Tithi (থবানীং):</span>
                <span className="font-bold text-gray-900">
                  {modalDay.panchang.fiveAngas.tithi.summary} (Ending: {modalDay.tithiEndingStandard} / {modalDay.tithiEndingTime})
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Nakshatra:</span>
                <span className="font-bold text-gray-900">
                  {modalDay.panchang.fiveAngas.nakshatra.name} (Pada {modalDay.panchang.fiveAngas.nakshatra.pada})
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Yoga:</span>
                <span className="font-bold text-gray-900">
                  {modalDay.panchang.fiveAngas.yoga.name} {modalDay.panchang.fiveAngas.yoga.isAuspicious ? '✓ Auspicious' : '⚠ Inauspicious'}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Karana:</span>
                <span className="font-bold text-gray-900">
                  {modalDay.panchang.fiveAngas.karana.name}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Ee Khudeng Status:</span>
                <span className={`font-bold ${modalDay.isKongbaLeiba ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {modalDay.isKongbaLeiba
                    ? (scriptMode === 'meetei' ? 'ꯏ ꯈꯨꯗꯦꯡ ꯂꯩꯕ (Auspicious)' : 'ঈ খুদেং লৈবা (Auspicious)')
                    : (scriptMode === 'meetei' ? 'ꯏ ꯈꯨꯗꯦꯡ ꯂꯩꯇꯕ (Prohibited)' : 'ঈ খুদেং লৈতবা (Prohibited)')}
                </span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Rahu Kaal:</span>
                <span className="font-mono text-rose-700 font-bold">
                  {modalDay.panchang.muhurtas.rahuKaal.start} – {modalDay.panchang.muhurtas.rahuKaal.end}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/panchang?date=${modalDay.dateStr}`}
                className="flex-1 text-center py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
              >
                Full Day Panchang
              </Link>
              <button
                onClick={() => setModalDay(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
