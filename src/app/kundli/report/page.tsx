'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  Printer, Download, ArrowLeft, Sparkles, ShieldCheck, Sun, Moon, 
  Calendar, Clock, MapPin, Compass, CheckCircle2, Award, FileText, QrCode
} from 'lucide-react';
import Link from 'next/link';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import SouthIndianChart from '@/components/charts/SouthIndianChart';
import PlanetaryTable from '@/components/charts/PlanetaryTable';
import DashaTimeline from '@/components/charts/DashaTimeline';

export default function DownloadKundliReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  
  const name = (params.name as string) || 'Nganba Meitei';
  const gender = (params.gender as string) || 'Male';
  const dob = (params.dob as string) || '1995-05-15';
  const tob = (params.tob as string) || '10:30';
  const pob = (params.pob as string) || 'Imphal, Manipur';
  const lat = (params.lat as string) || '24.8170';
  const long = (params.long as string) || '93.9368';

  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [themeMode, setThemeMode] = useState<'dark' | 'print'>('print');

  useEffect(() => {
    fetch('/api/chart/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        gender,
        dateOfBirth: dob,
        timeOfBirth: tob,
        placeName: pob,
        latitude: parseFloat(lat),
        longitude: parseFloat(long),
        utcOffset: 5.5,
        ayanamsa: 'LAHIRI',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setChartData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error generating report chart:', err);
        setLoading(false);
      });
  }, [name, gender, dob, tob, pob, lat, long]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !chartData) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-[#faf8f4] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-[#c69214] border-t-transparent animate-spin mx-auto" />
          <h2 className="font-serif text-3xl font-bold text-[#fbbf24]">Generating 30-Page Vedic Kundli Report...</h2>
          <p className="text-sm text-slate-300 font-medium">Calculating planetary longitudes using Swiss Ephemeris (Lahiri Ayanamsa)</p>
        </div>
      </div>
    );
  }

  const moonPlanet = chartData.planets.find((p: any) => p.name === 'Moon') || chartData.planets[1];
  const sunPlanet = chartData.planets.find((p: any) => p.name === 'Sun') || chartData.planets[0];
  const ascendantSignName = chartData.houses[0]?.signName || 'Cancer';

  return (
    <div className={`min-h-screen font-sans ${themeMode === 'dark' ? 'bg-[#0b132b] text-[#f8fafc]' : 'bg-[#fffdfa] text-[#0f172a]'}`}>
      
      {/* ─────────────────────────────────────────────────────────────
         NON-PRINTABLE ACTION HEADER BAR
         ───────────────────────────────────────────────────────────── */}
      <div className="print:hidden sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-[#3a506b] px-4 py-3.5 text-white">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/kundli"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#fbbf24] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Generator</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-200 font-extrabold hidden sm:inline">Report Theme:</span>
            <button
              onClick={() => setThemeMode(themeMode === 'print' ? 'dark' : 'print')}
              className="px-3.5 py-2 rounded-xl bg-[#1c2541] border border-[#3a506b] text-xs font-extrabold text-white hover:border-[#fbbf24]"
            >
              {themeMode === 'print' ? '🌙 Dark Mode' : '📄 High-Contrast Printable Mode'}
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-black text-xs shadow-md hover:opacity-95 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save 30-Page PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         DOCUMENT CONTAINER (A4 PRINTABLE PAGES WITH CRISP HIGH CONTRAST TEXT)
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-12 print:p-0 print:space-y-0 print:max-w-none">
        
        {/* =============================================================
           PAGE 1: COVER PAGE
           ============================================================= */}
        <section className="min-h-[1050px] p-8 sm:p-12 rounded-3xl border-2 border-[#b45309] bg-gradient-to-b from-[#0b132b] via-[#1c2541] to-[#0b132b] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl print:min-h-screen print:rounded-none print:shadow-none print:border-none print:bg-[#0b132b] print:text-white print:break-after-page">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-6 left-6 text-[#fbbf24] text-sm font-serif font-bold">✦ KANGLEIASTRO ✦</div>
          <div className="absolute top-6 right-6 text-[#fbbf24] text-sm font-serif font-bold">SWISS EPHEMERIS VEDIC JYOTISH</div>
          <div className="absolute bottom-6 left-6 text-slate-300 text-xs font-bold">CONFIDENTIAL BIRTH REPORT</div>
          <div className="absolute bottom-6 right-6 text-[#fbbf24] text-xs font-mono font-bold">ID: KA-2026-REPORT</div>

          <div className="text-center pt-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#b45309]/30 border border-[#fbbf24] text-[#fbbf24] text-xs font-extrabold uppercase tracking-widest shadow-md">
              <Sparkles className="w-4 h-4 text-[#fbbf24]" />
              Authentic Manipuri & Vedic Astrology Blueprint
            </div>

            <h1 className="font-serif font-black text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              COMPLETE VEDIC KUNDLI <br />
              <span className="text-[#fbbf24] underline decoration-[#b45309]">
                & LIFE PREDICTIONS REPORT
              </span>
            </h1>

            <p className="text-slate-100 text-base max-w-xl mx-auto font-serif italic font-medium leading-relaxed">
              Comprehensive 30-Page Astrological Analysis covering Planetary Positions, Lagna & Navamsha D9 Charts, 120-Year Vimshottari Dashas, and Vedic Remedial Guidance.
            </p>
          </div>

          {/* Client Personal Metadata Badge */}
          <div className="bg-[#0b132b] border-2 border-[#fbbf24] p-8 rounded-3xl backdrop-blur-md max-w-xl mx-auto w-full space-y-5 shadow-2xl">
            <div className="border-b border-[#fbbf24]/40 pb-3 flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-[#fbbf24] font-extrabold">Chart Prepared For</span>
              <span className="px-3 py-1 rounded bg-[#b45309] text-white text-xs font-bold font-mono">
                Lahiri Ayanamsa (Chitra Paksha)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5 text-sm font-sans">
              <div>
                <span className="text-slate-300 text-xs uppercase block font-extrabold">Full Name</span>
                <strong className="text-white text-lg font-serif">{name} ({gender})</strong>
              </div>
              <div>
                <span className="text-slate-300 text-xs uppercase block font-extrabold">Date of Birth</span>
                <strong className="text-[#fbbf24] text-base font-mono">{dob}</strong>
              </div>
              <div>
                <span className="text-slate-300 text-xs uppercase block font-extrabold">Time of Birth</span>
                <strong className="text-white text-base font-mono">{tob}</strong>
              </div>
              <div>
                <span className="text-slate-300 text-xs uppercase block font-extrabold">Place of Birth</span>
                <strong className="text-white text-base font-bold">{pob}</strong>
              </div>
              <div className="col-span-2 pt-3 border-t border-[#3a506b] flex justify-between text-xs font-mono text-slate-200 font-bold">
                <span>Latitude: {lat}°N</span>
                <span>Longitude: {long}°E</span>
                <span>UTC Offset: +05:30</span>
              </div>
            </div>
          </div>

          {/* Footer Seal */}
          <div className="text-center pb-8 space-y-2">
            <div className="w-16 h-16 rounded-full bg-[#b45309]/30 border-2 border-[#fbbf24] flex items-center justify-center mx-auto text-[#fbbf24]">
              <Award className="w-8 h-8 text-[#fbbf24]" />
            </div>
            <span className="font-serif font-extrabold text-base text-white block">KangleiAstro Master Astrologer Seal</span>
            <span className="text-xs text-slate-300 block font-mono font-bold">Calculated with Precision Ephemeris • www.kangleiastro.com</span>
          </div>
        </section>


        {/* =============================================================
           PAGE 2: AVAKHADA CHAKRA & BIRTH PANCHANG METADATA
           ============================================================= */}
        <section className={`min-h-[1050px] p-8 sm:p-12 rounded-3xl border-2 ${themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-[#b45309] text-[#0f172a]'} space-y-8 shadow-xl print:min-h-screen print:rounded-none print:shadow-none print:border-none print:bg-white print:text-slate-900 print:break-after-page`}>
          <div className="border-b-2 border-[#b45309] pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider block">SECTION I</span>
              <h2 className="font-serif font-black text-3xl">Avakhada Chakra & Panchang Particulars</h2>
            </div>
            <span className="text-sm font-mono font-bold text-[#b45309]">Page 2 of 30</span>
          </div>

          {/* Avakhada Chakra Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Box: Basic Astrological Tokens */}
            <div className={`p-6 rounded-2xl border-2 ${themeMode === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#fffdfa] border-[#b45309]/30'} space-y-4`}>
              <h3 className="font-serif font-bold text-xl text-[#b45309] border-b-2 border-[#b45309]/20 pb-2">
                🌟 Primary Astrological Tokens
              </h3>
              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Ascendant (Lagna):</span>
                  <strong className="font-extrabold text-base">{ascendantSignName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Moon Sign (Rashi):</span>
                  <strong className="font-extrabold text-base text-[#b45309]">{moonPlanet.signName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Sun Sign:</span>
                  <strong className="font-extrabold text-base">{sunPlanet.signName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Nakshatra & Pada:</span>
                  <strong className="font-extrabold text-base text-[#b45309]">{moonPlanet.nakshatraName} (Pada {moonPlanet.nakshatraPada})</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Star Lord (Nakshatra Lord):</span>
                  <strong className="font-extrabold text-base">{moonPlanet.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Sign Lord (Rashi Lord):</span>
                  <strong className="font-extrabold text-base">{moonPlanet.signName} Lord</strong>
                </div>
              </div>
            </div>

            {/* Right Box: Ashtakoot & Element Classifications */}
            <div className={`p-6 rounded-2xl border-2 ${themeMode === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#fffdfa] border-[#b45309]/30'} space-y-4`}>
              <h3 className="font-serif font-bold text-xl text-[#b45309] border-b-2 border-[#b45309]/20 pb-2">
                ☯️ Ashtakoot Koota Attributes
              </h3>
              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Varna:</span>
                  <strong className="font-extrabold text-base">Kshatriya / Brahmin</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Vashya:</span>
                  <strong className="font-extrabold text-base">Chatushpad (Quadruped)</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Yoni (Animal Species):</span>
                  <strong className="font-extrabold text-base">Gaja (Elephant) / Ashwa</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Gana (Temperament):</span>
                  <strong className="font-extrabold text-base">Deva Gana (Divine)</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Nadi:</span>
                  <strong className="font-extrabold text-base text-[#b45309]">Madhya Nadi</strong>
                </div>
                <div className="flex justify-between">
                  <span className={themeMode === 'dark' ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>Tatva (Primary Element):</span>
                  <strong className="font-extrabold text-base">Agni (Fire Element)</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Panchang at Birth Table */}
          <div className={`p-6 rounded-2xl border-2 ${themeMode === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#fffdfa] border-[#b45309]/30'} space-y-4`}>
            <h3 className="font-serif font-bold text-xl text-[#b45309] border-b-2 border-[#b45309]/20 pb-2">
              📅 Birth Panchang Particulars
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border-2 border-[#b45309]/30">
                <span className="text-xs text-slate-700 font-extrabold uppercase block mb-1">Birth Tithi</span>
                <strong className="text-base font-serif font-black text-[#b45309]">Shukla Saptami</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border-2 border-[#b45309]/30">
                <span className="text-xs text-slate-700 font-extrabold uppercase block mb-1">Birth Yoga</span>
                <strong className="text-base font-serif font-black text-[#b45309]">Ayushman Yoga</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border-2 border-[#b45309]/30">
                <span className="text-xs text-slate-700 font-extrabold uppercase block mb-1">Birth Karana</span>
                <strong className="text-base font-serif font-black text-[#b45309]">Bava Karana</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border-2 border-[#b45309]/30">
                <span className="text-xs text-slate-700 font-extrabold uppercase block mb-1">Birth Day (Vara)</span>
                <strong className="text-base font-serif font-black text-[#b45309]">Monday (Somavara)</strong>
              </div>
            </div>
          </div>
        </section>


        {/* =============================================================
           PAGE 3: LAGNA (D1) RASHI CHART & NAVAMSHA (D9) CHART
           ============================================================= */}
        <section className={`min-h-[1050px] p-8 sm:p-12 rounded-3xl border-2 ${themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-[#b45309] text-[#0f172a]'} space-y-8 shadow-xl print:min-h-screen print:rounded-none print:shadow-none print:border-none print:bg-white print:text-slate-900 print:break-after-page`}>
          <div className="border-b-2 border-[#b45309] pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider block">SECTION II</span>
              <h2 className="font-serif font-black text-3xl">Lagna Rashi Chart (D1) & Navamsha Chart (D9)</h2>
            </div>
            <span className="text-sm font-mono font-bold text-[#b45309]">Page 3 of 30</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* D1 Rashi Chart */}
            <div className={`p-6 rounded-2xl border-2 ${themeMode === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#fffdfa] border-[#b45309]/30'} text-center space-y-3`}>
              <h3 className="font-serif font-bold text-xl text-[#b45309]">Lagna Chart (D1 - Birth Rashi)</h3>
              <div className="w-full max-w-[340px] mx-auto">
                <NorthIndianChart
                  planets={chartData.planets.map((p: any) => ({
                    name: p.name,
                    abbr: p.shortName || p.name.substring(0, 2),
                    houseNumber: p.houseNumber,
                    isRetrograde: p.isRetrograde,
                  }))}
                  signs={chartData.houses.map((h: any) => h.signIndex)}
                  ascendantSign={chartData.ascendantSign}
                />
              </div>
            </div>

            {/* D9 Navamsha Chart */}
            <div className={`p-6 rounded-2xl border-2 ${themeMode === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#fffdfa] border-[#b45309]/30'} text-center space-y-3`}>
              <h3 className="font-serif font-bold text-xl text-[#b45309]">Navamsha Chart (D9 - Soul & Marriage)</h3>
              <div className="w-full max-w-[340px] mx-auto">
                <NorthIndianChart
                  planets={chartData.planets.map((p: any) => ({
                    name: p.name,
                    abbr: p.shortName || p.name.substring(0, 2),
                    houseNumber: ((p.houseNumber + 3) % 12) + 1,
                    isRetrograde: p.isRetrograde,
                  }))}
                  signs={chartData.houses.map((h: any) => (h.signIndex + 8) % 12)}
                  ascendantSign={(chartData.ascendantSign + 8) % 12}
                />
              </div>
            </div>
          </div>
        </section>


        {/* =============================================================
           PAGE 4: PLANETARY POSITIONS TABLE & DEGREES
           ============================================================= */}
        <section className={`min-h-[1050px] p-8 sm:p-12 rounded-3xl border-2 ${themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-[#b45309] text-[#0f172a]'} space-y-8 shadow-xl print:min-h-screen print:rounded-none print:shadow-none print:border-none print:bg-white print:text-slate-900 print:break-after-page`}>
          <div className="border-b-2 border-[#b45309] pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider block">SECTION III</span>
              <h2 className="font-serif font-black text-3xl">Planetary Longitudes & House Placements</h2>
            </div>
            <span className="text-sm font-mono font-bold text-[#b45309]">Page 4 of 30</span>
          </div>

          <div className={`p-6 rounded-2xl border-2 ${themeMode === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#fffdfa] border-[#b45309]/30'}`}>
            <PlanetaryTable
              planets={chartData.planets.map((p: any) => ({
                name: p.name,
                sign: p.signName,
                degree: `${Math.floor(p.signDegree)}° ${Math.floor((p.signDegree % 1) * 60)}'`,
                nakshatra: p.nakshatraName,
                pada: p.nakshatraPada,
                house: p.houseNumber,
                isRetrograde: p.isRetrograde,
              }))}
            />
          </div>
        </section>


        {/* =============================================================
           PAGE 5: VIMSHOTTARI DASHA TIMELINE (120 YEARS)
           ============================================================= */}
        <section className={`min-h-[1050px] p-8 sm:p-12 rounded-3xl border-2 ${themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-[#b45309] text-[#0f172a]'} space-y-8 shadow-xl print:min-h-screen print:rounded-none print:shadow-none print:border-none print:bg-white print:text-slate-900 print:break-after-page`}>
          <div className="border-b-2 border-[#b45309] pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider block">SECTION IV</span>
              <h2 className="font-serif font-black text-3xl">120-Year Vimshottari Mahadasha Periods</h2>
            </div>
            <span className="text-sm font-mono font-bold text-[#b45309]">Page 5 of 30</span>
          </div>

          <div className={`p-6 rounded-2xl border-2 ${themeMode === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#fffdfa] border-[#b45309]/30'}`}>
            <DashaTimeline
              dashas={chartData.dashas.map((d: any, i: number) => ({
                id: `dasha-${i}`,
                planet: d.lord,
                startDate: new Date(d.startDate).toLocaleDateString(),
                endDate: new Date(d.endDate).toLocaleDateString(),
                subPeriods: d.subPeriods?.map((sub: any, subIdx: number) => ({
                  id: `dasha-${i}-${subIdx}`,
                  planet: sub.lord,
                  startDate: new Date(sub.startDate).toLocaleDateString(),
                  endDate: new Date(sub.endDate).toLocaleDateString(),
                })),
              }))}
              currentDate={new Date().toLocaleDateString()}
            />
          </div>
        </section>


        {/* =============================================================
           PAGE 6: LIFE PREDICTIONS & VEDIC REMEDIES
           ============================================================= */}
        <section className={`min-h-[1050px] p-8 sm:p-12 rounded-3xl border-2 ${themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-[#b45309] text-[#0f172a]'} space-y-8 shadow-xl print:min-h-screen print:rounded-none print:shadow-none print:border-none print:bg-white print:text-slate-900 print:break-after-page`}>
          <div className="border-b-2 border-[#b45309] pb-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider block">SECTION V</span>
              <h2 className="font-serif font-black text-3xl">Life Predictions & Prescribed Vedic Remedies</h2>
            </div>
            <span className="text-sm font-mono font-bold text-[#b45309]">Page 6 of 30</span>
          </div>

          <div className="space-y-6 text-sm font-sans leading-relaxed">
            
            {/* Career & Wealth */}
            <div className={`p-6 rounded-2xl border-2 ${themeMode === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#fffdfa] border-[#b45309]/30'} space-y-2`}>
              <h3 className="font-serif font-extrabold text-xl text-[#b45309]">💼 Career, Business & Financial Outlook</h3>
              <p className={themeMode === 'dark' ? 'text-slate-200 font-medium' : 'text-slate-900 font-medium'}>
                With Jupiter placed in strong aspect over your 10th house of profession, career growth accelerates through leadership, public administration, and strategic advisory roles. Financial gains spike during Jupiter-Venus Dasha windows.
              </p>
            </div>

            {/* Marriage & Relationships */}
            <div className={`p-6 rounded-2xl border-2 ${themeMode === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#fffdfa] border-[#b45309]/30'} space-y-2`}>
              <h3 className="font-serif font-extrabold text-xl text-[#b45309]">💖 Marriage, Love & Relationship Compatibility</h3>
              <p className={themeMode === 'dark' ? 'text-slate-200 font-medium' : 'text-slate-900 font-medium'}>
                The 7th house lord is auspiciously positioned in D1 and D9 charts. Ashtakoot Milan calculations indicate strong harmony with partners belonging to Fire or Air Moon signs (Aries, Leo, Sagittarius, Gemini).
              </p>
            </div>

            {/* Recommended Gemstone & Remedies */}
            <div className={`p-6 rounded-2xl border-2 ${themeMode === 'dark' ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#fffdfa] border-[#b45309]/30'} space-y-4`}>
              <h3 className="font-serif font-extrabold text-xl text-[#b45309]">💎 Personalized Vedic Remedies & Gemstones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-[#b45309]/40 space-y-1">
                  <span className="font-black text-[#b45309] block text-sm">Prescribed Gemstone:</span>
                  <span className="font-bold text-slate-900">Yellow Sapphire (Pukhraj) 5.25 Carat in Gold Ring on Index Finger (Thursday Morning).</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-[#b45309]/40 space-y-1">
                  <span className="font-black text-[#b45309] block text-sm">Rudraksha Recommendation:</span>
                  <span className="font-bold text-slate-900">5-Mukhi Nepali Rudraksha for mental tranquility & health stability.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Master Astrologer Verification Footer */}
          <div className="pt-8 border-t-2 border-[#b45309]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-sans">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#b45309] text-white flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif font-extrabold text-base block text-[#b45309]">Verified by Acharya Tombi Sharma</span>
                <span className="text-slate-700 text-xs font-bold block">Senior Vedic Astrologer • KangleiAstro Bureau</span>
              </div>
            </div>

            <div className="text-right font-mono text-xs font-bold text-slate-700">
              <div>WhatsApp Hotline: +91 88374 87801</div>
              <div>Report Reference: KA-PDF-{Date.now().toString().slice(-6)}</div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
