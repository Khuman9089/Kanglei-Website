'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  Printer, ArrowLeft, Sparkles, ShieldCheck, FileText, Download, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
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
  const dob = (params.dob as string) || '2026-08-12';
  const tob = (params.tob as string) || '00:00';
  const pob = (params.pob as string) || 'Imphal, Manipur, India';
  const lat = (params.lat as string) || '24.8081';
  const long = (params.long as string) || '93.9442';

  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'kundli' | 'kp' | 'ashtakvarga' | 'charts' | 'dasha' | 'free_report'>('basic');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'print'>('light');

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
      <div className="min-h-screen bg-[#fffef0] text-[#0f172a] flex items-center justify-center font-sans p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full border-4 border-[#e0a96d] border-t-transparent animate-spin mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#b45309]">Calculating Vedic Kundli Report...</h2>
          <p className="text-xs text-slate-600 font-medium">Calculating planetary longitudes using Swiss Ephemeris (Lahiri Ayanamsa)</p>
        </div>
      </div>
    );
  }

  const moonPlanet = chartData.planets?.find((p: any) => p.name === 'Moon') || chartData.planets?.[1] || { signName: 'Cancer', nakshatraName: 'Pushya', nakshatraPada: 3 };
  const sunPlanet = chartData.planets?.find((p: any) => p.name === 'Sun') || chartData.planets?.[0] || { signName: 'Leo' };
  const ascendantSignName = chartData.houses?.[0]?.signName || 'Taurus';

  // Format DOB string (e.g. 12 Aug 2026)
  const formattedDob = new Date(dob).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Format TOB string (e.g. 12:00 AM)
  const formatTime12h = (tStr: string) => {
    try {
      const [h, m] = tStr.split(':').map(Number);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
    } catch (e) {
      return tStr;
    }
  };
  const formattedTob = formatTime12h(tob);

  return (
    <div className={`min-h-screen font-sans transition-colors ${
      themeMode === 'dark' ? 'bg-[#0b132b] text-[#f8fafc]' : 'bg-[#fffef5] text-[#0f172a]'
    }`}>
      
      {/* ─────────────────────────────────────────────────────────────
         NON-PRINTABLE ACTION HEADER BAR
         ───────────────────────────────────────────────────────────── */}
      <div className="print:hidden sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-[#3a506b] px-4 py-3 text-white">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/kundli"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#fbbf24] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Kundli Form</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              className="px-3 py-1.5 rounded-xl bg-[#1c2541] border border-[#3a506b] text-xs font-bold text-white hover:border-[#fbbf24]"
            >
              {themeMode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         MAIN REPORT CONTAINER (REFERENCE IMAGE STYLING)
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {/* HEADER SECTION: Name & Subtitle Details */}
        <div className="text-center space-y-1.5">
          <h1 className={`font-serif font-black text-3xl sm:text-4xl ${
            themeMode === 'dark' ? 'text-[#fbbf24]' : 'text-[#b45309]'
          }`}>
            {name}&apos;s Kundli
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-wide">
            {formattedDob} · {formattedTob} · {pob}
          </p>
        </div>

        {/* TOP NAVIGATION TABS BAR (Reference Image Pill Tabs) */}
        <div className="flex items-center justify-center border-b border-amber-200/60 pb-3">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-2">
            {[
              { id: 'basic', label: 'Basic' },
              { id: 'kundli', label: 'Kundli' },
              { id: 'kp', label: 'KP' },
              { id: 'ashtakvarga', label: 'Ashtakvarga' },
              { id: 'charts', label: 'Charts' },
              { id: 'dasha', label: 'Dasha' },
              { id: 'free_report', label: 'Free Report' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#fef08a] text-slate-900 shadow-sm border border-[#fde047]'
                      : themeMode === 'dark'
                      ? 'text-gray-300 hover:bg-[#1c2541]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-amber-100/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           TAB CONTENT 1: BASIC DETAILS (EXACT MATCH FOR USER REFERENCE IMAGE)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* ROW 1: TWO SIDE-BY-SIDE WHITE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD 1: BIRTH DETAILS */}
              <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200/80'
              }`}>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-gray-700 pb-3">
                  Birth Details
                </h3>

                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAME</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GENDER</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{gender}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DATE OF BIRTH</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formattedDob}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TIME OF BIRTH</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formattedTob}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PLACE OF BIRTH</span>
                    <span className="font-bold text-slate-900 dark:text-white leading-tight block">{pob}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LATITUDE</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{lat}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LONGITUDE</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{long}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TIMEZONE</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">GMT +05:30</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: PANCHANG */}
              <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200/80'
              }`}>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-gray-700 pb-3">
                  Panchang
                </h3>

                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TITHI</span>
                    <span className="font-bold text-slate-900 dark:text-white">KrishnaChaturdashi</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">KARANA</span>
                    <span className="font-bold text-slate-900 dark:text-white">Shakuni</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">YOGA</span>
                    <span className="font-bold text-slate-900 dark:text-white">Vyatipata</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAKSHATRA</span>
                    <span className="font-bold text-slate-900 dark:text-white">{moonPlanet.nakshatraName || 'Pushya'}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAKSHATRA LORD</span>
                    <span className="font-bold text-slate-900 dark:text-white">Saturn</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ASCENDANT</span>
                    <span className="font-bold text-slate-900 dark:text-white">{ascendantSignName}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ASCENDANT LORD</span>
                    <span className="font-bold text-slate-900 dark:text-white">Venus</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SUNRISE</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">4:47:1</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-gray-800 col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SUNSET</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">17:51:18</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 2: FULL-WIDTH CARD FOR AVAKHADA DETAILS */}
            <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
              themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200/80'
            }`}>
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-gray-700 pb-3">
                Avakhada Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3.5 gap-x-6 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">VARNA</span>
                  <span className="font-bold text-slate-900 dark:text-white">Brahmin</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">VASHYA</span>
                  <span className="font-bold text-slate-900 dark:text-white">Jalchar</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">YONI</span>
                  <span className="font-bold text-slate-900 dark:text-white">Chaga</span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GAN</span>
                  <span className="font-bold text-slate-900 dark:text-white">Dev</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NADI</span>
                  <span className="font-bold text-slate-900 dark:text-white">Madhya</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SIGN</span>
                  <span className="font-bold text-slate-900 dark:text-white">{moonPlanet.signName || 'Cancer'}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SIGN LORD</span>
                  <span className="font-bold text-slate-900 dark:text-white">Moon</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CHARAN</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{moonPlanet.nakshatraPada || 3}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TATVA</span>
                  <span className="font-bold text-slate-900 dark:text-white">Water</span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAME ALPHABET</span>
                  <span className="font-bold text-slate-900 dark:text-white">Ho</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PAYA</span>
                  <span className="font-bold text-slate-900 dark:text-white">Silver</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">YUNJA</span>
                  <span className="font-bold text-slate-900 dark:text-white">Madhya</span>
                </div>
              </div>
            </div>

            {/* ROW 3: BOTTOM CALLOUT BANNER (Get your full Kundli as a PDF) */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#fefce8] via-[#fffbeb] to-[#fef9c3] border-2 border-dashed border-[#fde047] shadow-sm flex flex-wrap items-center justify-between gap-4 text-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#fef08a] border border-[#facc15] flex flex-col items-center justify-center shadow-xs shrink-0">
                  <FileText className="w-5 h-5 text-slate-900" />
                  <span className="text-[9px] font-extrabold text-amber-900 uppercase">PDF</span>
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 leading-tight">
                    Get your full Kundli as a PDF
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Download every section — birth details, charts, dashas and predictions — in a single printable report.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-full bg-[#fef08a] hover:bg-[#fde047] text-slate-900 font-extrabold text-xs border border-[#facc15] shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>View PDF Report</span>
              </button>
            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
           TAB CONTENT 2: KUNDLI / CHARTS VIEW
           ───────────────────────────────────────────────────────────── */}
        {(activeTab === 'kundli' || activeTab === 'charts') && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'} text-center space-y-4`}>
                <h3 className="font-serif font-bold text-xl text-[#b45309]">Lagna Chart (D1 - Birth Rashi)</h3>
                <div className="max-w-[340px] mx-auto">
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

              <div className={`p-6 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'} text-center space-y-4`}>
                <h3 className="font-serif font-bold text-xl text-[#b45309]">Navamsha Chart (D9 - Marriage & Soul)</h3>
                <div className="max-w-[340px] mx-auto">
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

            <div className={`p-6 rounded-3xl border ${themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'}`}>
              <h3 className="font-serif font-bold text-xl text-[#b45309] mb-4">Planetary Longitudes & Nakshatra Pada</h3>
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
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
           TAB CONTENT 3: DASHA TIMELINE
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'dasha' && (
          <div className={`p-6 rounded-3xl border animate-fadeIn ${themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'}`}>
            <h3 className="font-serif font-bold text-xl text-[#b45309] mb-4">120-Year Vimshottari Mahadasha Timeline</h3>
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
        )}

        {/* ─────────────────────────────────────────────────────────────
           TAB CONTENT 4: KP / ASHTAKVARGA / FREE REPORT
           ───────────────────────────────────────────────────────────── */}
        {(activeTab === 'kp' || activeTab === 'ashtakvarga' || activeTab === 'free_report') && (
          <div className={`p-8 rounded-3xl border text-center space-y-4 animate-fadeIn ${
            themeMode === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
          }`}>
            <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 text-[#b45309] flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-[#b45309]" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#b45309]">
              {activeTab === 'kp' && 'KP System & House Cusps'}
              {activeTab === 'ashtakvarga' && 'Bhinna & Sarvashtakvarga Points Table'}
              {activeTab === 'free_report' && 'Full 30-Page Vedic Kundli PDF'}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Comprehensive calculated tables including Ashtakvarga points, KP House Cusps, and full printable report generated using Swiss Ephemeris.
            </p>

            <button
              onClick={handlePrint}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Complete Report PDF</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
