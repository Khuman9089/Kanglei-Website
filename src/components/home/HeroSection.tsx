'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Calendar, Sun, Moon, Clock, Compass, Heart, Orbit, CheckCircle2, FileText, UserCheck } from 'lucide-react';
import Link from 'next/link';
import HomeMonthlyCalendar from '@/components/home/HomeMonthlyCalendar';
import { NAKSHATRA_NAMES_BENGALI } from '@/engine/constants';
import { toBengaliNumerals } from '@/engine/manipuriCalendar';

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

const PLANET_META_MAP: Record<string, { bn: string; symbol: string }> = {
  Sun: { bn: 'রবি', symbol: '☉' },
  Moon: { bn: 'চন্দ্র', symbol: '☽' },
  Mars: { bn: 'মঙ্গল', symbol: '♂' },
  Mercury: { bn: 'বুধ', symbol: '☿' },
  Jupiter: { bn: 'বৃহস্পতি', symbol: '♃' },
  Venus: { bn: 'শুক্র', symbol: '♀' },
  Saturn: { bn: 'শনি', symbol: '♄' },
  Rahu: { bn: 'রাহু', symbol: '☊' },
  Ketu: { bn: 'কেতু', symbol: '☋' },
};

const DEFAULT_PLANETS = [
  { name: 'Sun', bn: 'রবি', symbol: '☉', sign: 'Leo', bnSign: 'সিংহ', deg: "12° 34'", isRetrograde: false },
  { name: 'Moon', bn: 'চন্দ্র', symbol: '☽', sign: 'Virgo', bnSign: 'কন্যা', deg: "04° 18'", isRetrograde: false },
  { name: 'Mars', bn: 'মঙ্গল', symbol: '♂', sign: 'Gemini', bnSign: 'মিথুন', deg: "18° 42'", isRetrograde: false },
  { name: 'Mercury', bn: 'বুধ', symbol: '☿', sign: 'Leo', bnSign: 'সিংহ', deg: "26° 05'", isRetrograde: false },
  { name: 'Jupiter', bn: 'বৃহস্পতি', symbol: '♃', sign: 'Taurus', bnSign: 'বৃষ', deg: "24° 51'", isRetrograde: false },
  { name: 'Venus', bn: 'শুক্র', symbol: '♀', sign: 'Virgo', bnSign: 'কন্যা', deg: "15° 11'", isRetrograde: false },
  { name: 'Saturn', bn: 'শনি', symbol: '♄', sign: 'Aquarius', bnSign: 'কুম্ভ', deg: "20° 38'", isRetrograde: true },
  { name: 'Rahu', bn: 'রাহু', symbol: '☊', sign: 'Pisces', bnSign: 'মীন', deg: "11° 14'", isRetrograde: true },
  { name: 'Ketu', bn: 'কেতু', symbol: '☋', sign: 'Virgo', bnSign: 'কন্যা', deg: "11° 14'", isRetrograde: true },
];

export default function HeroSection() {
  // Dynamic Ticker Data state from /api/ticker
  const [tickerData, setTickerData] = useState<{
    active: boolean;
    speedSeconds: number;
    items: { id: string; name: string; place: string; action: string; time: string }[];
  }>({
    active: true,
    speedSeconds: 65,
    items: [
      { id: 't-1', name: 'Nganba', place: 'Imphal West', action: 'just started a consultation with Acharya Tombi Sharma', time: '2 min ago' },
      { id: 't-2', name: 'Thoibi', place: 'Thoubal', action: 'booked Kuthi Matching report with Pandit Ningthem Meitei', time: 'just now' },
      { id: 't-3', name: 'Ibomcha', place: 'Bishnupur', action: 'got his Vimshottari Dasha read by Gurumayum Sharma', time: '4 min ago' },
      { id: 't-4', name: 'Yaiphabi', place: 'Imphal East', action: 'generated her 30-Page Free Kundli Report', time: '1 min ago' },
      { id: 't-5', name: 'Laishram Rajen', place: 'Kakching', action: 'booked Rahu Dasha remedies with Acharya Tombi', time: '3 min ago' },
      { id: 't-6', name: 'Chingkhei', place: 'Churachandpur', action: 'consulted on 36-Gun Ashtakoot Milan with Saanvi Sharma', time: '5 min ago' },
      { id: 't-7', name: 'Sanatombi', place: 'Senapati', action: 'booked Sade Sati Gemstone consultation with Pt. Ram Naresh', time: 'just now' },
      { id: 't-8', name: 'Premkumar', place: 'Ukhrul', action: 'got his Career Horoscope reading from Acharya Tombi', time: '6 min ago' },
    ],
  });

  const [homePanchang, setHomePanchang] = useState<any>(null);
  const [panchangDateLabel, setPanchangDateLabel] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    // Format the date for display
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
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
    fetch('/api/panchang')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.panchang) {
          setHomePanchang(data.panchang);
        }
      })
      .catch((err) => console.error('Error fetching home panchang:', err));

    fetch('/api/ticker')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ticker) {
          setTickerData(data.ticker);
        }
      })
      .catch((err) => console.error('Error fetching ticker:', err));
  }, []);

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const displayPlanets =
    homePanchang?.planets && homePanchang.planets.length > 0
      ? homePanchang.planets.slice(0, 9).map((p: any) => {
          const meta = PLANET_META_MAP[p.name] || { bn: p.name, symbol: '★' };
          const bnSign = RASHI_BENGALI_MAP[p.signName] || p.signName;
          return {
            name: p.name,
            bn: meta.bn,
            symbol: meta.symbol,
            sign: p.signName,
            bnSign: bnSign,
            deg: p.degreeStr,
            nakshatra: p.nakshatraName,
            pada: p.nakshatraPada,
            isRetrograde: p.isRetrograde,
          };
        })
      : DEFAULT_PLANETS;

  return (
    <section className="relative pt-6 sm:pt-8 pb-8 sm:pb-10 bg-[#fffdfa] text-[#0f172a] border-b border-[#f3e8d2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* 1. Quick Feature Pills (Hidden on Mobile, Desktop Only) */}
        {!isMobile && (
          <div className="hidden-on-mobile hidden lg:flex mobile-hide-section flex-wrap items-center justify-center gap-2.5 mb-8">
            <Link
              href="/manipuri_kuthi_yengba"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#f3e8d2] bg-white text-xs font-bold text-[#b45309] hover:border-[#d97706] transition-all shadow-xs"
            >
              <span className="text-[#d97706]">✦</span> Kuthi Yengba
            </Link>

            <Link
              href="/manipuri_kuthi"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#f3e8d2] bg-white text-xs font-bold text-[#b45309] hover:border-[#d97706] transition-all shadow-xs"
            >
              <span className="text-[#d97706]">✦</span> Kuthi Eba
            </Link>

            <Link
              href="/matching"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#f3e8d2] bg-white text-xs font-bold text-[#b45309] hover:border-[#d97706] transition-all shadow-xs"
            >
              <span className="text-[#d97706]">✦</span> Pakna Wainaba Yengba
            </Link>

            <Link
              href="/numit_leppa_yengba"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#f3e8d2] bg-white text-xs font-bold text-[#b45309] hover:border-[#d97706] transition-all shadow-xs"
            >
              <span className="text-[#d97706]">✦</span> Numit Leppa
            </Link>

            <Link
              href="/manipuri_kuthi_yengba"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#f3e8d2] bg-white text-xs font-bold text-[#b45309] hover:border-[#d97706] transition-all shadow-xs"
            >
              <span className="text-[#d97706]">✦</span> Yumsarol
            </Link>
          </div>
        )}

        {/* 2. Live Manipur Consultations & Activity Marquee Ticker (Hidden on Mobile, Desktop Only) */}
        {!isMobile && tickerData.active && tickerData.items && tickerData.items.length > 0 && (
          <div className="hidden-on-mobile hidden lg:flex mobile-hide-section w-full overflow-hidden bg-[#fef3c7]/60 border-y border-[#fde68a] py-2.5 mb-8 rounded-2xl relative shadow-xs items-center gap-3 px-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d97706] text-white text-[10px] uppercase font-extrabold shadow-sm shrink-0 z-10">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>LIVE CONSULTATIONS</span>
            </div>

            <div className="flex-1 overflow-hidden relative">
              <div
                className="animate-marquee whitespace-nowrap gap-8 flex items-center"
                style={{ animationDuration: `${tickerData.speedSeconds || 65}s` }}
              >
                {tickerData.items.map((act, idx) => (
                  <span key={act.id || idx} className="inline-flex items-center gap-2 text-xs font-semibold text-[#78350f] shrink-0">
                    <span className="text-[#d97706]">✦</span>
                    <strong className="font-extrabold text-[#0f172a]">{act.name}</strong> from <span className="font-bold text-[#b45309]">{act.place}</span> {act.action}
                    <span className="text-[10px] text-[#b45309]/80 font-mono">({act.time})</span>
                  </span>
                ))}

                {/* Duplicate array for seamless continuous looping */}
                {tickerData.items.map((act, idx) => (
                  <span key={`dup-${act.id || idx}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#78350f] shrink-0">
                    <span className="text-[#d97706]">✦</span>
                    <strong className="font-extrabold text-[#0f172a]">{act.name}</strong> from <span className="font-bold text-[#b45309]">{act.place}</span> {act.action}
                    <span className="text-[10px] text-[#b45309]/80 font-mono">({act.time})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Hero 2-Column Grid: Left Panchang Widget + Right Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
          
          {/* LEFT COLUMN: TODAY'S PANCHANG WIDGET + OUTSIDE FREE MATCH MAKING BUTTON (Desktop Only) */}
          {!isMobile && (
            <div className="hidden-on-mobile hidden lg:flex flex-col gap-4 mobile-hide-section lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-[#f3e8d2] shadow-[0_15px_50px_rgba(217,119,6,0.06)] relative overflow-hidden flex-1 flex flex-col justify-between"
              >
                {/* Top Gold Ribbon Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

                {/* 1. Header */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#fde68a]/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#b45309] shadow-xs">
                      <Calendar className="w-4.5 h-4.5 text-[#d97706]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#0f172a]">
                        {panchangDateLabel ? 'Panchang & Graha' : "Today's Panchang"}
                      </h3>
                      <p className="text-[11px] text-[#b45309] font-bold font-sans">
                        {panchangDateLabel || todayDateStr}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#fef3c7] text-[#b45309] text-[9px] font-extrabold uppercase border border-[#fde68a]">
                    VEDIC & MANIPURI
                  </span>
                </div>

                {/* 2. Sunrise / Sunset & Moonrise / Moonset */}
                <div className="grid grid-cols-2 gap-2 mb-2.5 font-sans">
                  <div className="p-2 rounded-xl bg-[#fefcf6] border border-[#f3e8d2] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Sun className="w-3.5 h-3.5 text-[#d97706]" />
                      <span className="text-[11px] font-medium">Sun</span>
                    </div>
                    <span className="font-bold text-[#0f172a] text-[11px] font-mono">
                      {homePanchang ? `${homePanchang.sunMoonTimings.sunrise} / ${homePanchang.sunMoonTimings.sunset}` : '04:57 AM / 05:31 PM'}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#fefcf6] border border-[#f3e8d2] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-[11px] font-medium">Moon</span>
                    </div>
                    <span className="font-bold text-[#0f172a] text-[11px] font-mono">
                      {homePanchang?.sunMoonTimings?.moonrise ? `${homePanchang.sunMoonTimings.moonrise} / ${homePanchang.sunMoonTimings.moonset}` : '06:12 PM / 06:40 AM'}
                    </span>
                  </div>
                </div>

                {/* 3. Core Panchang Metrics List */}
                <div className="space-y-1.5 text-xs font-sans mb-2.5">
                  <div className="flex items-center justify-between py-1 border-b border-[#f3e8d2]">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Moon className="w-3.5 h-3.5 text-[#d97706]" />
                      <span>Tithi (থিথি)</span>
                    </div>
                    <span className="font-bold text-[#b45309]">
                      {homePanchang ? homePanchang.fiveAngas.tithi.summary : 'Shukla Paksha Purnima'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#f3e8d2]">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                      <span>Nakshatra (নক্ষত্র)</span>
                    </div>
                    <span className="font-bold text-[#b45309] text-right">
                      {homePanchang ? (
                        <span>
                          {NAKSHATRA_NAMES_BENGALI[homePanchang.fiveAngas.nakshatra.index - 1] || homePanchang.fiveAngas.nakshatra.name} ({homePanchang.fiveAngas.nakshatra.index})
                          <span className="text-[10px] text-gray-500 font-normal ml-1">
                            • Pada {homePanchang.fiveAngas.nakshatra.pada}
                          </span>
                        </span>
                      ) : (
                        'শ্রবণা (২২) • Pada 2'
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#f3e8d2]">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Compass className="w-3.5 h-3.5 text-[#d97706]" />
                      <span>Yoga / Karana</span>
                    </div>
                    <span className="font-bold text-[#0f172a]">
                      {homePanchang ? `${homePanchang.fiveAngas.yoga.name} / ${homePanchang.fiveAngas.karana.name}` : 'Ayushman / Taitila'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#f3e8d2]">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Sun className="w-3.5 h-3.5 text-[#d97706]" />
                      <span>Sun / Moon Rashi</span>
                    </div>
                    <span className="font-bold text-[#0f172a] text-right">
                      {homePanchang?.planetaryState?.sunSign ? (
                        <span>
                          {RASHI_BENGALI_MAP[homePanchang.planetaryState.sunSign] || homePanchang.planetaryState.sunSign} (Sun) / {RASHI_BENGALI_MAP[homePanchang.planetaryState.moonSign] || homePanchang.planetaryState.moonSign} (Moon)
                        </span>
                      ) : (
                        'সিংহ (Sun) / কন্যা (Moon)'
                      )}
                    </span>
                  </div>
                </div>

                {/* 4. Shubh & Ashubh Muhurtas */}
                <div className="grid grid-cols-2 gap-2 mb-3 font-sans">
                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                    <div className="flex items-center gap-1 text-emerald-800 font-bold text-[10px] uppercase">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Abhijit (শুভ)</span>
                    </div>
                    <span className="font-bold text-emerald-950 font-mono text-[11px] block mt-0.5">
                      {homePanchang?.muhurtas?.abhijit?.start ? `${homePanchang.muhurtas.abhijit.start} – ${homePanchang.muhurtas.abhijit.end}` : '11:18 AM – 12:08 PM'}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-200/80">
                    <div className="flex items-center gap-1 text-rose-800 font-bold text-[10px] uppercase">
                      <Clock className="w-3 h-3 text-rose-600" />
                      <span>Rahu Kaal (অশুভ)</span>
                    </div>
                    <span className="font-bold text-rose-950 font-mono text-[11px] block mt-0.5">
                      {homePanchang?.muhurtas?.rahuKaal?.start ? `${homePanchang.muhurtas.rahuKaal.start} – ${homePanchang.muhurtas.rahuKaal.end}` : '01:58 PM – 03:34 PM'}
                    </span>
                  </div>
                </div>

                {/* 5. Graha Sfut / Planetary Positions Grid */}
                <div className="pt-2.5 border-t border-[#f3e8d2] space-y-2 mb-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <Orbit className="w-3.5 h-3.5 text-[#d97706]" />
                      <span>Graha Sfut (গ্রহ স্থিতি)</span>
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full">
                      9 Grahas Transit
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-sans">
                    {displayPlanets.slice(0, 9).map((pl: any) => (
                      <div
                        key={pl.name}
                        className="p-1.5 rounded-lg bg-[#fffdfa] border border-[#f3e8d2] flex flex-col justify-between hover:border-amber-400 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center justify-between leading-none">
                          <span className="font-bold text-gray-900 flex items-center gap-1 text-[11px]">
                            <span className="text-[#d97706] font-mono text-xs">{pl.symbol}</span>
                            <span>{pl.bn}</span>
                          </span>
                          {pl.isRetrograde && (
                            <span className="text-[8.5px] font-bold text-red-600 bg-red-50 border border-red-200 px-1 rounded-xs leading-tight" title="Retrograde (বক্রী)">
                              R
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-baseline justify-between text-[10px] leading-tight">
                          <span className="text-gray-600 font-semibold truncate">{pl.bnSign}</span>
                          <span className="text-amber-700 font-mono font-medium">{pl.deg}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Action Button */}
                <Link
                  href="/panchang"
                  className="w-full py-2.5 rounded-xl border border-[#d97706] bg-[#fefcf6] text-[#b45309] font-bold text-xs hover:bg-[#fef3c7] transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>See Full Panchang & Muhurta</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Free Match Making (Kundli Milan) Button Below Panchang Card (Desktop View) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <Link
                  href="/matching"
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 border border-[#fde68a]"
                >
                  <Heart className="w-4 h-4 fill-white/20 text-white shrink-0" />
                  <span>Free Match Making (Kundli Milan)</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </motion.div>
            </div>
          )}

          {/* RIGHT COLUMN: FREE KUNDLI REPORT FORM CARD (col-span-12 lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Free Match Making Button (Shown on mobile only, as desktop view has it below panchang card) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden"
            >
              <Link
                href="/matching"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 border border-[#fde68a]"
              >
                <Heart className="w-4 h-4 fill-white/20 text-white shrink-0" />
                <span>Free Match Making (Kundli Milan)</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </motion.div>

            {/* MONTHLY CALENDAR CARD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HomeMonthlyCalendar onDateSelect={fetchPanchangForDate} />
            </motion.div>
          </div>
        </div>

        {/* TWO PROMINENT ACTION BUTTONS BELOW HERO SECTION (FULL WIDTH) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full mt-8 pt-6 border-t border-amber-200/70"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full text-left">
            {/* Button 1: Generate Free Kundli Report */}
            <Link
              href="/manipuri_free_kuthi"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 p-0.5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="h-full flex items-center justify-between gap-4 py-4 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#ea580c] text-white">
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight">Generate Free Kundli Report</span>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/25 px-2 py-0.5 rounded-full shrink-0">Free PDF</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-100 font-medium truncate mt-0.5">
                      Instant 30+ Pages Manipuri & Vedic Birth Chart PDF
                    </p>
                  </div>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-amber-600 transition-colors">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Button 2: Generate Kundli Report By Expert (Kuthi Yengba) */}
            <Link
              href="/manipuri_kuthi_yengba"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-amber-700 p-0.5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="h-full flex items-center justify-between gap-4 py-4 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-amber-900 text-white">
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-400/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-amber-300/30 group-hover:scale-105 transition-transform">
                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight">Generate Kundli Report By Expert</span>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider bg-amber-400/25 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30 shrink-0">Kuthi Yengba</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-200/80 font-medium truncate mt-0.5">
                      Verified Astrologer Consultation & Detailed Predictions
                    </p>
                  </div>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:text-purple-950 transition-colors">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
