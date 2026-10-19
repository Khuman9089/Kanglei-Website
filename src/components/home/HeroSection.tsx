'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  FileText,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import HomeMonthlyCalendar from '@/components/home/HomeMonthlyCalendar';
import { NAKSHATRA_NAMES_BENGALI } from '@/engine/constants';
import { toBengaliNumerals, toMeeteiNumerals } from '@/engine/manipuriCalendar';

const RASHI_BENGALI_MAP: Record<string, string> = {
  Aries: 'মেষ',
  Taurus: 'বৃষ',
  Gemini: 'মিথুন',
  Cancer: 'কর্কট',
  Leo: 'সিংহ',
  Virgo: 'কন্যা',
  Libra: 'তুলা',
  Scorpio: 'বৃশ্চিক',
  Sagittarius: 'ধনু',
  Capricorn: 'মকর',
  Aquarius: 'কুম্ভ',
  Pisces: 'মীন',
};

export default function HeroSection() {
  const [homePanchang, setHomePanchang] = useState<any>(null);
  const [panchangDateLabel, setPanchangDateLabel] = useState<string>('');
  const [selectedDateFormatted, setSelectedDateFormatted] = useState<string>('');
  const [lunarDateFormatted, setLunarDateFormatted] = useState<string>('');

  /** Format Date cleanly like "19 October, 2026" */
  const formatDateDisplay = (dateObj: Date) => {
    return dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  /** Fetch panchang for a specific date string (YYYY-MM-DD) */
  const fetchPanchangForDate = useCallback((dateStr: string) => {
    fetch(`/api/panchang?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.panchang) {
          setHomePanchang(data.panchang);
        }
      })
      .catch((err) => console.error('Error fetching panchang:', err));

    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    setSelectedDateFormatted(formatDateDisplay(dt));

    const todayCheck = new Date();
    const isToday =
      dt.getFullYear() === todayCheck.getFullYear() &&
      dt.getMonth() === todayCheck.getMonth() &&
      dt.getDate() === todayCheck.getDate();

    if (isToday) {
      setPanchangDateLabel('');
    } else {
      setPanchangDateLabel(
        dt.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    setSelectedDateFormatted(formatDateDisplay(today));

    fetch('/api/panchang')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.panchang) {
          setHomePanchang(data.panchang);
        }
      })
      .catch((err) => console.error('Error fetching home panchang:', err));
  }, []);

  const todayDateDisplay = selectedDateFormatted || formatDateDisplay(new Date());

  // Lunar month & day summary string (e.g. "Mera-8, 3425" or Meetei calculation)
  const lunarDisplayStr = homePanchang?.fiveAngas?.tithi?.summary
    ? homePanchang.fiveAngas.tithi.summary
    : 'Mera-8, 3425';

  return (
    <section className="relative pt-4 sm:pt-6 pb-12 sm:pb-16 bg-[#f8fafc] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        
        {/* ── CORE 2-COLUMN SHOWCASE: CALENDAR & LIVE DAY PANJIKA (Simulating manipuricalendar.in) ── */}
        <div id="home-calendar" className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start text-left">
          
          {/* LEFT / MAIN COLUMN: MANIPURI MONTHLY CALENDAR (col-lg-8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HomeMonthlyCalendar onDateSelect={fetchPanchangForDate} />
            </motion.div>
          </div>

          {/* RIGHT / COMPANION COLUMN: DAY DETAILS TABLE (col-lg-4, exact style from manipuricalendar.in) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="bg-white border border-gray-400 rounded-lg shadow-sm overflow-hidden flex flex-col font-sans"
            >
              {/* 1. Main Day Panjika Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  {/* Header: #004d00 with white text */}
                  <thead>
                    <tr className="bg-[#004d00] text-white">
                      <th colSpan={2} className="px-3.5 py-2.5 font-bold text-base sm:text-lg tracking-tight">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span>{todayDateDisplay}</span>
                          <span className="font-normal italic text-xs sm:text-sm text-green-100">
                            {lunarDisplayStr}
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Events Row */}
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-3 py-2 font-bold text-gray-900 w-1/3">Events:</td>
                      <td className="px-3 py-2 font-bold text-[#b30000]">
                        {homePanchang?.festival?.nameBengali || homePanchang?.festival?.nameMeetei || 'Bor'}
                      </td>
                    </tr>

                    {/* Sunrise */}
                    <tr className="bg-gray-50/80 hover:bg-gray-100">
                      <td className="px-3 py-2 font-bold text-gray-900">Sunrise:</td>
                      <td className="px-3 py-2 text-gray-800 font-mono">
                        {homePanchang?.sunMoonTimings?.sunrise || '05:17 AM'}
                      </td>
                    </tr>

                    {/* Sunset */}
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-3 py-2 font-bold text-gray-900">Sunset:</td>
                      <td className="px-3 py-2 text-gray-800 font-mono">
                        {homePanchang?.sunMoonTimings?.sunset || '04:40 PM'}
                      </td>
                    </tr>

                    {/* Moonrise */}
                    <tr className="bg-gray-50/80 hover:bg-gray-100">
                      <td className="px-3 py-2 font-bold text-gray-900">Moonrise:</td>
                      <td className="px-3 py-2 text-gray-800 font-mono">
                        {homePanchang?.sunMoonTimings?.moonrise || '12:27 PM'}
                      </td>
                    </tr>

                    {/* Moonset */}
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-3 py-2 font-bold text-gray-900">Moonset:</td>
                      <td className="px-3 py-2 text-gray-800 font-mono">
                        {homePanchang?.sunMoonTimings?.moonset || '11:26 PM'}
                      </td>
                    </tr>

                    {/* Nakshatra */}
                    <tr className="bg-gray-50/80 hover:bg-gray-100">
                      <td className="px-3 py-2 font-bold text-gray-900 align-top">Nakshatra:</td>
                      <td className="px-3 py-2 text-gray-800">
                        {homePanchang?.fiveAngas?.nakshatra ? (
                          <>
                            {homePanchang.fiveAngas.nakshatra.index}-
                            {NAKSHATRA_NAMES_BENGALI[homePanchang.fiveAngas.nakshatra.index - 1] || homePanchang.fiveAngas.nakshatra.name}
                            <span className="text-gray-500 text-[11px] block">
                              Pada {homePanchang.fiveAngas.nakshatra.pada}
                            </span>
                          </>
                        ) : (
                          '21-Uttara Asadha / 22-Sravana'
                        )}
                      </td>
                    </tr>

                    {/* Tithi */}
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-3 py-2 font-bold text-gray-900 align-top">Tithi:</td>
                      <td className="px-3 py-2 text-gray-800">
                        {homePanchang?.fiveAngas?.tithi?.summary || '8-Shukla Ashtami'}
                      </td>
                    </tr>

                    {/* Yoga */}
                    <tr className="bg-gray-50/80 hover:bg-gray-100">
                      <td className="px-3 py-2 font-bold text-gray-900">Yoga:</td>
                      <td className="px-3 py-2 text-gray-800">
                        {homePanchang?.fiveAngas?.yoga?.name || '8-Dhriti'}
                      </td>
                    </tr>

                    {/* Karana */}
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-3 py-2 font-bold text-gray-900">Karana:</td>
                      <td className="px-3 py-2 text-gray-800">
                        {homePanchang?.fiveAngas?.karana?.name || '1-Bav / 2-Balav'}
                      </td>
                    </tr>

                    {/* Tatnaba */}
                    <tr className="bg-gray-50/80 hover:bg-gray-100">
                      <td className="px-3 py-2 font-bold text-gray-900 align-top">Tatnaba:</td>
                      <td className="px-3 py-2 text-gray-800">
                        Langban - Yumjakeisha, Irai
                        <br />
                        Mera - Leibakpokpa
                      </td>
                    </tr>

                    {/* Thasi Maikei */}
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-3 py-2 font-bold text-gray-900 align-top">Thasi Maikei:</td>
                      <td className="px-3 py-2 text-gray-800">
                        Langban - Awang
                        <br />
                        Mera - Nongchup
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 2. Sub-Table: Muhurta & Kaal Timings (matching secondary table on manipuricalendar.in) */}
              <div className="overflow-x-auto border-t border-gray-400">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#004d00] text-white">
                      <th className="px-3 py-1.5 font-bold text-xs">Muhurta / Kala</th>
                      <th className="px-3 py-1.5 font-bold text-xs">Start Time</th>
                      <th className="px-3 py-1.5 font-bold text-xs">End Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-white">
                      <td className="px-3 py-1.5 font-bold text-emerald-800">Abhijit (শুভ)</td>
                      <td className="px-3 py-1.5 font-mono text-gray-800">
                        {homePanchang?.muhurtas?.abhijit?.start || '11:18 AM'}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-gray-800">
                        {homePanchang?.muhurtas?.abhijit?.end || '12:08 PM'}
                      </td>
                    </tr>
                    <tr className="bg-gray-50/80">
                      <td className="px-3 py-1.5 font-bold text-rose-800">Rahu Kaal (অশুভ)</td>
                      <td className="px-3 py-1.5 font-mono text-gray-800">
                        {homePanchang?.muhurtas?.rahuKaal?.start || '01:58 PM'}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-gray-800">
                        {homePanchang?.muhurtas?.rahuKaal?.end || '03:34 PM'}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-3 py-1.5 font-bold text-gray-800">Yamaganda</td>
                      <td className="px-3 py-1.5 font-mono text-gray-800">09:12 AM</td>
                      <td className="px-3 py-1.5 font-mono text-gray-800">10:45 AM</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 3. Fast Action Links */}
              <div className="p-3 bg-gray-50 border-t border-gray-300 flex flex-col gap-2">
                <Link
                  href="/manipuri_free_kuthi"
                  className="w-full py-2 px-3 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Free Kuthi (30-Page PDF)</span>
                </Link>

                <Link
                  href="/panchang"
                  className="w-full py-2 px-3 rounded border border-gray-400 bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#004d00]" />
                  <span>View Full Panchang &amp; Choghadiya</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── BOTTOM PROMINENT DUAL LAUNCH BANNERS ── */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="w-full mt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full text-left">
            {/* Banner 1: Free Kundli */}
            <Link
              href="/manipuri_free_kuthi"
              className="group rounded-xl border border-amber-300 bg-gradient-to-r from-amber-500 to-amber-600 p-3.5 sm:p-4 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">Generate Free Kundli Report</h3>
                  <p className="text-xs text-amber-100 mt-0.5">Instant 30+ Pages Manipuri &amp; Vedic Birth Chart PDF</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Banner 2: Expert Astrologer Consultation */}
            <Link
              href="/manipuri_kuthi_yengba"
              className="group rounded-xl border border-indigo-900 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-3.5 sm:p-4 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/30 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">Kuthi Yengba (Expert Astrologer)</h3>
                  <p className="text-xs text-indigo-200 mt-0.5">Verified Pandits Consultation &amp; Dasha Remedies</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
