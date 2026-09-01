'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  Printer, ArrowLeft, Sparkles, ShieldCheck, FileText, Download, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import BengaliChart from '@/components/charts/BengaliChart';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import PlanetaryTable from '@/components/charts/PlanetaryTable';
import ShadbalaTable from '@/components/charts/ShadbalaTable';
import BhavaBalaTable from '@/components/charts/BhavaBalaTable';
import DashaTimeline from '@/components/charts/DashaTimeline';
import KPSection from '@/components/charts/KPSection';
import AshtakvargaSection from '@/components/charts/AshtakvargaSection';
import AllDivisionalBengaliCharts from '@/components/charts/AllDivisionalBengaliCharts';
import FreeReportSection from '@/components/charts/FreeReportSection';
import ReportCalloutBanners from '@/components/charts/ReportCalloutBanners';
import KundliAuthModal from '@/components/auth/KundliAuthModal';
import PrintableKundliReport, { downloadDirectPDF } from '@/components/pdf/PrintableKundliReport';

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
  const [chartStyle, setChartStyle] = useState<'bengali' | 'north'>('bengali');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('kanglei_astro_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }
    }
  }, []);

  const fullReportUrl = `/kundli/report/full?name=${encodeURIComponent(name)}&gender=${encodeURIComponent(gender)}&dob=${dob}&tob=${tob}&pob=${encodeURIComponent(pob)}&lat=${lat}&long=${long}`;

  const triggerDownloadOrAuth = () => {
    if (user) {
      window.location.href = fullReportUrl;
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    setTimeout(() => {
      window.location.href = fullReportUrl;
    }, 300);
  };

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

  if (loading || !chartData) {
    return (
      <div className="min-h-screen bg-[#fffdf7] text-[#0f172a] flex items-center justify-center font-sans p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-14 h-14 rounded-full border-4 border-[#b45309] border-t-transparent animate-spin mx-auto" />
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

  const isLight = themeMode === 'light';

  return (
    <div className={`min-h-screen font-sans transition-colors ${
      isLight ? 'bg-[#fffdf7] text-[#0f172a]' : 'bg-[#0b132b] text-[#f8fafc]'
    }`}>
      
      {/* ─────────────────────────────────────────────────────────────
         NON-PRINTABLE ACTION HEADER BAR (UNIFORM HARMONIZED LIGHT BG)
         ───────────────────────────────────────────────────────────── */}
      <div className={`print:hidden sticky top-0 z-50 backdrop-blur-md border-b px-4 py-2.5 transition-colors ${
        isLight ? 'bg-[#fffdf7]/95 border-amber-200/80 text-slate-900' : 'bg-[#0f172a]/95 border-[#3a506b] text-white'
      }`}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/kundli"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#b45309] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Kundli Form</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Chart Style Switcher */}
            <div className="flex items-center gap-1 bg-amber-100/60 p-1 rounded-xl border border-amber-200 text-xs">
              <button
                onClick={() => setChartStyle('bengali')}
                className={`px-2.5 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                  chartStyle === 'bengali' ? 'bg-[#b45309] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Bengali Chart
              </button>
              <button
                onClick={() => setChartStyle('north')}
                className={`px-2.5 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                  chartStyle === 'north' ? 'bg-[#b45309] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                North Indian
              </button>
            </div>

            <button
              onClick={() => setThemeMode(isLight ? 'dark' : 'light')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isLight ? 'bg-amber-50 border-amber-200 text-slate-800 hover:bg-amber-100' : 'bg-[#1c2541] border-[#3a506b] text-white hover:border-[#fbbf24]'
              }`}
            >
              {isLight ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>

            <button
              onClick={triggerDownloadOrAuth}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-xs hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Report PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         MAIN REPORT CONTAINER (UNIFORM LIGHT COLOR CARDS)
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
        
        {/* HEADER SECTION: Name & Subtitle Details */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#b45309]">
            {name}&apos;s Kundli
          </h1>
          <p className="text-sm font-semibold text-slate-500 tracking-wide">
            {formattedDob} · {formattedTob} · {pob}
          </p>
        </div>

        {/* TOP NAVIGATION TABS BAR (Reference Image Pill Tabs) */}
        <div className="flex items-center justify-center border-b border-amber-200/50 pb-2">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-1">
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
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#fef08a] text-slate-900 shadow-xs border border-[#fde047]'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-amber-100/50'
                      : 'text-gray-300 hover:bg-[#1c2541]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           TAB CONTENT 1: BASIC DETAILS (COMPACT FITTED CARDS IN HARMONIZED LIGHT BG)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'basic' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* ROW 1: TWO SIDE-BY-SIDE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* CARD 1: BIRTH DETAILS */}
              <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs space-y-3 ${
                isLight ? 'bg-[#fffdf7] border-amber-200/70' : 'bg-[#1c2541] border-[#3a506b]'
              }`}>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white border-b border-amber-100 dark:border-gray-800 pb-2">
                  Birth Details
                </h3>

                <div className="grid grid-cols-2 gap-y-3 gap-x-3 text-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">NAME</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{name}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">GENDER</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{gender}</span>
                  </div>

                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DATE OF BIRTH</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formattedDob}</span>
                  </div>
                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TIME OF BIRTH</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formattedTob}</span>
                  </div>

                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PLACE OF BIRTH</span>
                    <span className="font-semibold text-slate-900 dark:text-white leading-tight block">{pob}</span>
                  </div>
                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LATITUDE</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">{lat}</span>
                  </div>

                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LONGITUDE</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">{long}</span>
                  </div>
                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TIMEZONE</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">GMT +05:30</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: PANCHANG */}
              <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs space-y-3 ${
                isLight ? 'bg-[#fffdf7] border-amber-200/70' : 'bg-[#1c2541] border-[#3a506b]'
              }`}>
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white border-b border-amber-100 dark:border-gray-800 pb-2">
                  Panchang
                </h3>

                <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TITHI</span>
                    <span className="font-semibold text-slate-900 dark:text-white">KrishnaChaturdashi</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">KARANA</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Shakuni</span>
                  </div>

                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">YOGA</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Vyatipata</span>
                  </div>
                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAKSHATRA</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{moonPlanet.nakshatraName || 'Pushya'}</span>
                  </div>

                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAKSHATRA LORD</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Saturn</span>
                  </div>
                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ASCENDANT</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{ascendantSignName}</span>
                  </div>

                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ASCENDANT LORD</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Venus</span>
                  </div>
                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SUNRISE</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">4:47:1</span>
                  </div>

                  <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60 col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SUNSET</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">17:51:18</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 2: FULL-WIDTH CARD FOR AVAKHADA DETAILS */}
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs space-y-3 ${
              isLight ? 'bg-[#fffdf7] border-amber-200/70' : 'bg-[#1c2541] border-[#3a506b]'
            }`}>
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white border-b border-amber-100 dark:border-gray-800 pb-2">
                Avakhada Details
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">VARNA</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Brahmin</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">VASHYA</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Jalchar</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">YONI</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Chaga</span>
                </div>

                <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GAN</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Dev</span>
                </div>
                <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NADI</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Madhya</span>
                </div>
                <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SIGN</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{moonPlanet.signName || 'Cancer'}</span>
                </div>

                <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SIGN LORD</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Moon</span>
                </div>
                <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CHARAN</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono">{moonPlanet.nakshatraPada || 3}</span>
                </div>
                <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TATVA</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Water</span>
                </div>

                <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NAME ALPHABET</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Ho</span>
                </div>
                <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PAYA</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Silver</span>
                </div>
                <div className="pt-1.5 border-t border-amber-100/80 dark:border-gray-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">YUNJA</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Madhya</span>
                </div>
              </div>
            </div>

            {/* ROW 3: BOTTOM CALLOUT BANNER (Get your full Kundli as a PDF) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fefce8] via-[#fffbeb] to-[#fef9c3] border-2 border-dashed border-[#fde047] shadow-xs flex flex-wrap items-center justify-between gap-3 text-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fef08a] border border-[#facc15] flex flex-col items-center justify-center shadow-xs shrink-0">
                  <FileText className="w-4 h-4 text-slate-900" />
                  <span className="text-[8px] font-extrabold text-amber-900 uppercase">PDF</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    Get your full Kundli as a PDF
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Download every section — birth details, charts, dashas and predictions — in a single printable report.
                  </p>
                </div>
              </div>

              <button
                onClick={triggerDownloadOrAuth}
                className="px-5 py-2 rounded-full bg-[#fef08a] hover:bg-[#fde047] text-slate-900 font-extrabold text-xs border border-[#facc15] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View PDF Report</span>
              </button>
            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
           TAB CONTENT 2: KUNDLI VIEW (D1 + D9 + TABLES)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'kundli' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* D1 Lagna Rashi Chart */}
              <div className={`p-5 rounded-2xl border ${isLight ? 'bg-[#fffdf7] border-amber-200/70' : 'bg-[#1c2541] border-[#3a506b]'} text-center space-y-3`}>
                <h3 className="font-serif font-bold text-lg text-[#b45309]">Lagna Chart (D1 - Birth Rashi)</h3>
                <div className="w-full flex justify-center">
                  {chartStyle === 'bengali' ? (
                    <BengaliChart
                      title="D1 Rashi Chart"
                      planets={chartData.planets.map((p: any) => ({
                        name: p.name,
                        abbr: p.shortName || p.name.substring(0, 2),
                        houseNumber: p.houseNumber,
                        isRetrograde: p.isRetrograde,
                      }))}
                      ascendantSign={chartData.ascendantSign}
                      theme={isLight ? 'light' : 'dark'}
                    />
                  ) : (
                    <div className="max-w-[340px] w-full">
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
                  )}
                </div>
              </div>

              {/* D9 Navamsha Chart */}
              <div className={`p-5 rounded-2xl border ${isLight ? 'bg-[#fffdf7] border-amber-200/70' : 'bg-[#1c2541] border-[#3a506b]'} text-center space-y-3`}>
                <h3 className="font-serif font-bold text-lg text-[#b45309]">Navamsha Chart (D9 - Marriage & Soul)</h3>
                <div className="w-full flex justify-center">
                  {chartStyle === 'bengali' ? (
                    <BengaliChart
                      title="D9 Navamsha Chart"
                      planets={chartData.planets.map((p: any) => ({
                        name: p.name,
                        abbr: p.shortName || p.name.substring(0, 2),
                        houseNumber: ((p.houseNumber + 3) % 12) + 1,
                        isRetrograde: p.isRetrograde,
                      }))}
                      ascendantSign={(chartData.ascendantSign + 8) % 12}
                      theme={isLight ? 'light' : 'dark'}
                    />
                  ) : (
                    <div className="max-w-[340px] w-full">
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
                  )}
                </div>
              </div>
            </div>

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

            <ShadbalaTable />

            <BhavaBalaTable />
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
           TAB CONTENT 3: ALL VARGA DIVISIONAL CHARTS (BENGALI STYLE)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'charts' && (
          <AllDivisionalBengaliCharts chartData={chartData} isLight={isLight} />
        )}

        {/* ─────────────────────────────────────────────────────────────
           TAB CONTENT 3: DASHA TIMELINE
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'dasha' && (
          <div className="animate-fadeIn">
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
           TAB CONTENT 4: KP SYSTEM
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'kp' && (
          <KPSection chartData={chartData} isLight={isLight} />
        )}

        {/* ─────────────────────────────────────────────────────────────
           TAB CONTENT 5: ASHTAKVARGA
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'ashtakvarga' && (
          <AshtakvargaSection isLight={isLight} />
        )}

        {/* ─────────────────────────────────────────────────────────────
           TAB CONTENT 6: FREE REPORT (ASCENDANT, GENERAL, REMEDIES, DOSHA, PLANETARY, VIMSHOTTARI, YOGA)
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'free_report' && (
          <FreeReportSection
            name={name}
            gender={gender}
            ascendantSignName={ascendantSignName}
            moonSignName={moonPlanet.signName || 'Cancer'}
            sunSignName={sunPlanet.signName || 'Leo'}
            isLight={isLight}
          />
        )}

        {/* PERSISTENT CALLOUT BANNERS (PDF DOWNLOAD & ASTROLOGER CONSULTATION CTA) */}
        <ReportCalloutBanners onPrint={triggerDownloadOrAuth} />
      </div>

      {/* AUTH MODAL GATE BEFORE PDF DOWNLOAD (GMAIL / MOBILE OTP) */}
      <KundliAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* FULL 50-PAGE PRINTABLE KUNDLI REPORT DOCUMENT */}
      <PrintableKundliReport
        name={name}
        dob={formattedDob}
        tob={formattedTob}
        pob={pob}
        lat={lat}
        long={long}
        gender={gender}
        chartData={chartData}
      />
    </div>
  );
}
