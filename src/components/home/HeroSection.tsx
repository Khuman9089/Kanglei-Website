'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lock, FileText, CheckCircle2, Calendar, Sun, Moon, Clock, Compass } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const [gender, setGender] = useState('Male');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [day, setDay] = useState('15');
  const [month, setMonth] = useState('05');
  const [year, setYear] = useState('1995');
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('30');
  const [pob, setPob] = useState('Imphal, Manipur');
  const [lat, setLat] = useState('24.8170');
  const [long, setLong] = useState('93.9368');

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const query = new URLSearchParams({
      name,
      gender,
      dob: `${year}-${month}-${day}`,
      tob: `${hour}:${minute}`,
      pob,
      lat,
      long,
    }).toString();
    window.location.href = `/kundli/report?${query}`;
  };

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = [
    { value: '01', label: 'Jan' },
    { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' },
    { value: '08', label: 'Aug' },
    { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' },
  ];
  const years = Array.from({ length: 80 }, (_, i) => String(2026 - i));
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  return (
    <section className="relative pt-6 sm:pt-8 pb-8 sm:pb-10 bg-[#fffdfa] text-[#0f172a] border-b border-[#f3e8d2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* 1. Quick Feature Pills (Hidden on Mobile, Desktop Only) */}
        {!isMobile && (
          <div className="hidden-on-mobile hidden lg:flex mobile-hide-section flex-wrap items-center justify-center gap-2.5 mb-8">
            <Link
              href="/kundli"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#f3e8d2] bg-white text-xs font-bold text-[#b45309] hover:border-[#d97706] transition-all shadow-xs"
            >
              <span className="text-[#d97706]">✦</span> Today's Horoscope
            </Link>

            <Link
              href="/kundli"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#f3e8d2] bg-white text-xs font-bold text-[#b45309] hover:border-[#d97706] transition-all shadow-xs"
            >
              <span className="text-[#d97706]">✦</span> Saturn Retrograde
              <span className="ml-1 px-2 py-0.5 rounded bg-[#d97706] text-white text-[9px] font-extrabold uppercase">
                FREE REPORT
              </span>
            </Link>

            <Link
              href="/kundli"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#f3e8d2] bg-white text-xs font-bold text-[#b45309] hover:border-[#d97706] transition-all shadow-xs"
            >
              <span className="text-[#d97706]">✦</span> Dasha Analysis
            </Link>

            <Link
              href="/matching"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#f3e8d2] bg-white text-xs font-bold text-[#b45309] hover:border-[#d97706] transition-all shadow-xs"
            >
              <span className="text-[#d97706]">✦</span> Love Compatibility
              <span className="ml-1 px-2 py-0.5 rounded bg-[#d97706] text-white text-[9px] font-extrabold uppercase">
                8 POINTS RULE
              </span>
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

        {/* 2. Hero 2-Column Grid: Left Panchang Widget + Right Kundli Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* LEFT COLUMN: TODAY'S PANCHANG WIDGET (Hidden on Mobile, Desktop Only) */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden-on-mobile hidden lg:block mobile-hide-section lg:col-span-4 bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-[0_15px_50px_rgba(217,119,6,0.06)] relative overflow-hidden"
            >
              {/* Top Gold Ribbon Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#fde68a]/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#b45309] shadow-xs">
                    <Calendar className="w-5 h-5 text-[#d97706]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#0f172a]">Today's Panchang</h3>
                    <p className="text-[11px] text-[#b45309] font-bold font-sans">{todayDateStr}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#fef3c7] text-[#b45309] text-[9px] font-extrabold uppercase border border-[#fde68a]">
                  VEDIC
                </span>
              </div>

              {/* Panchang Metrics List */}
              <div className="space-y-3 text-xs font-sans mb-6">
                <div className="flex items-center justify-between py-1.5 border-b border-[#f3e8d2]">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Sun className="w-4 h-4 text-[#d97706]" />
                    <span>Sunrise / Sunset</span>
                  </div>
                  <span className="font-bold text-[#0f172a]">
                    {homePanchang ? `${homePanchang.sunMoonTimings.sunrise} / ${homePanchang.sunMoonTimings.sunset}` : '04:57 AM / 05:31 PM'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#f3e8d2]">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Moon className="w-4 h-4 text-[#d97706]" />
                    <span>Tithi</span>
                  </div>
                  <span className="font-bold text-[#b45309]">
                    {homePanchang ? homePanchang.fiveAngas.tithi.summary : 'Shukla Paksha Purnima'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#f3e8d2]">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Sparkles className="w-4 h-4 text-[#d97706]" />
                    <span>Nakshatra</span>
                  </div>
                  <span className="font-bold text-[#b45309]">
                    {homePanchang ? `${homePanchang.fiveAngas.nakshatra.name} (P${homePanchang.fiveAngas.nakshatra.pada})` : 'Shravana (Pada 2)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#f3e8d2]">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Compass className="w-4 h-4 text-[#d97706]" />
                    <span>Yoga / Karana</span>
                  </div>
                  <span className="font-bold text-[#0f172a]">
                    {homePanchang ? `${homePanchang.fiveAngas.yoga.name} / ${homePanchang.fiveAngas.karana.name}` : 'Ayushman / Taitila'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span>Rahu Kaal</span>
                  </div>
                  <span className="font-bold text-red-600">
                    {homePanchang ? `${homePanchang.muhurtas.rahuKaal.start} – ${homePanchang.muhurtas.rahuKaal.end}` : '01:58 PM – 03:34 PM'}
                  </span>
                </div>
              </div>

              {/* See Full Panchang Button */}
              <Link
                href="/panchang"
                className="w-full py-3 rounded-xl border border-[#d97706] bg-[#fefcf6] text-[#b45309] font-bold text-xs hover:bg-[#fef3c7] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>See Full Panchang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          {/* RIGHT COLUMN: FREE KUNDLI REPORT FORM CARD (col-span-12 lg:col-span-8) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-[0_15px_50px_rgba(217,119,6,0.06)] relative overflow-hidden"
          >
            {/* Accent Top Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

            <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-[#fde68a]/50 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#b45309] shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#0f172a]">Generate Free Kundli Report</h3>
                  <p className="text-xs text-gray-500 font-sans">Fill birth details below for instant PDF generation</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#b45309] font-bold bg-[#fef3c7] px-3 py-1.5 rounded-lg border border-[#fde68a]">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>30 Pages PDF Sample Ready</span>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5 font-sans">
              
              {/* ROW 1: Gender, Name, Email */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Gender<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] focus:outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Full Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Please enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] placeholder-gray-400 font-medium focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] focus:outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Email Address<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] placeholder-gray-400 font-medium focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* ROW 2: Date of Birth & Time of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* DOB Selects */}
                <div className="md:col-span-7">
                  <label className="block text-xs font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Date of Birth<span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="w-full h-10 px-2 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>Day: {d}</option>
                      ))}
                    </select>

                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full h-10 px-2 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    >
                      {months.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>

                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full h-10 px-2 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Selects */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Time of Birth<span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      className="w-full h-10 px-2 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    >
                      {hours.map((h) => (
                        <option key={h} value={h}>Hour: {h}</option>
                      ))}
                    </select>

                    <select
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      className="w-full h-10 px-2 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    >
                      {minutes.map((m) => (
                        <option key={m} value={m}>Min: {m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ROW 3: Place of Birth, Latitude (°N), Longitude (°E) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <label className="block text-xs font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Place of Birth<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City, State (e.g. Imphal, New Delhi)"
                    value={pob}
                    onChange={(e) => setPob(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] placeholder-gray-400 font-medium focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] focus:outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Latitude (°N)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24.8170"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-mono font-medium focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] focus:outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Longitude (°E)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 93.9368"
                    value={long}
                    onChange={(e) => setLong(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-mono font-medium focus:border-[#d97706] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Button & Privacy Footer */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#fde68a]/50">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <Lock className="w-4 h-4 text-[#d97706]" />
                  <span>100% Confidential • Swiss Ephemeris Calculations</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Download Report</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
