'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Printer, Sparkles, FileText, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import BengaliChart from '@/components/charts/BengaliChart';
import PlanetaryTable from '@/components/charts/PlanetaryTable';
import ShadbalaTable from '@/components/charts/ShadbalaTable';
import BhavaBalaTable from '@/components/charts/BhavaBalaTable';
import KPSection from '@/components/charts/KPSection';
import AshtakvargaSection from '@/components/charts/AshtakvargaSection';
import AllDivisionalBengaliCharts from '@/components/charts/AllDivisionalBengaliCharts';
import DashaTimeline from '@/components/charts/DashaTimeline';
import KundliAuthModal from '@/components/auth/KundliAuthModal';
import { generateDirectPDFDownload } from '@/utils/pdfGenerator';

export default function FullKundliReportPage({
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreparingPDF, setIsPreparingPDF] = useState(false);
  const [prepProgress, setPrepProgress] = useState(0);
  const [prepStepText, setPrepStepText] = useState('Initializing Vedic PDF Engine...');
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
        console.error('Error calculating full report chart:', err);
        setLoading(false);
      });
  }, [name, gender, dob, tob, pob, lat, long]);

  const handleSaveAsPDF = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsDownloading(true);
    setIsPreparingPDF(true);
    setPrepProgress(5);
    setPrepStepText('Preparing full unabridged report pages for A4 rendering...');

    const filename = `${name.replace(/\s+/g, '_')}_Complete_Vedic_Kundli_Report.pdf`;
    try {
      await generateDirectPDFDownload(
        'full-kundli-report-content',
        filename,
        (percent, stepText) => {
          setPrepProgress(percent);
          setPrepStepText(stepText);
        }
      );
    } catch (err) {
      console.error('PDF Download Error:', err);
    } finally {
      setTimeout(() => {
        setIsPreparingPDF(false);
        setIsDownloading(false);
      }, 600);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    setTimeout(() => {
      handleSaveAsPDF();
    }, 400);
  };

  if (loading || !chartData) {
    return (
      <div className="min-h-screen bg-[#fffdf7] text-[#0f172a] flex items-center justify-center font-sans p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-14 h-14 rounded-full border-4 border-[#b45309] border-t-transparent animate-spin mx-auto" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#b45309]">Generating Complete Unabridged Report...</h2>
          <p className="text-xs text-slate-600 font-medium font-mono">Calculating Lahiri Ayanamsa Planetary Positions & Dasha Timelines</p>
        </div>
      </div>
    );
  }

  const ascendantSign = chartData?.ascendantSign ?? 1;
  const planets = chartData?.planets || [];
  const moonPlanet = chartData?.planets?.find((p: any) => p.name === 'Moon') || chartData?.planets?.[1] || { signName: 'Cancer', nakshatraName: 'Pushya', nakshatraPada: 3 };
  const sunPlanet = chartData?.planets?.find((p: any) => p.name === 'Sun') || chartData?.planets?.[0] || { signName: 'Leo' };
  const ascendantSignName = chartData?.houses?.[0]?.signName || 'Taurus';

  const formattedDob = new Date(dob).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans pb-16">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 8mm 10mm 8mm;
          }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-hidden, .print\\:hidden {
            display: none !important;
          }
          .pdf-card {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 12px !important;
            margin-bottom: 12px !important;
            padding: 14px 16px !important;
          }
          /* Make font smaller whenever needed in print */
          .pdf-card h1 {
            font-size: 20pt !important;
          }
          .pdf-card h2 {
            font-size: 13pt !important;
            margin-bottom: 4px !important;
          }
          .pdf-card h3, .pdf-card h4 {
            font-size: 10.5pt !important;
            margin-bottom: 2px !important;
          }
          .pdf-card p, .pdf-card span, .pdf-card div {
            font-size: 9pt !important;
            line-height: 1.35 !important;
          }
          .pdf-card table {
            font-size: 7.5pt !important;
          }
          .pdf-card th, .pdf-card td {
            padding: 2px 4px !important;
          }
        }
      `}</style>

      {/* STICKY TOP TOOLBAR */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs px-4 py-3 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Link
            href={`/kundli/report?name=${encodeURIComponent(name)}&gender=${encodeURIComponent(gender)}&dob=${dob}&tob=${tob}&pob=${encodeURIComponent(pob)}&lat=${lat}&long=${long}`}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Summary</span>
          </Link>

          <div className="text-center hidden sm:block">
            <h2 className="font-serif font-black text-sm text-[#b45309]">
              {name}&apos;s Complete Unabridged Vedic Kundli Report
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Kuthi Yengpham by KangleiAstro • Full Uncut Details
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs sm:text-sm border border-amber-300 transition-all cursor-pointer shadow-xs"
              title="Instant Browser Print / Save as PDF (Takes 1 second)"
            >
              <Printer className="w-4 h-4 text-amber-800" />
              <span className="hidden sm:inline">Print / Save PDF (1 sec)</span>
            </button>

            <button
              onClick={handleSaveAsPDF}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Downloading PDF...' : 'Direct PDF File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN BEAUTIFUL A4 AUTO-FLOWING REPORT CONTAINER */}
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6" id="full-kundli-report-content">

        {/* ─────────────────────────────────────────────────────────────
           SECTION 1: COVER PAGE
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-8 sm:p-12 text-center space-y-8 min-h-[900px] flex flex-col justify-between">
          <div className="my-auto space-y-6">
            <div className="w-24 h-24 rounded-full bg-[#fef08a] border-4 border-[#facc15] flex items-center justify-center text-4xl shadow-md mx-auto">
              ☀️
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-black text-amber-900 tracking-widest uppercase block">
                KUTHI YENGPHAM BY KANGLEIASTRO VEDIC ASTROLOGY REPORT
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#b45309]">
                {name}&apos;s Complete Kundli
              </h1>
              <div className="w-16 h-1 bg-[#facc15] mx-auto rounded-full my-3" />
              <p className="text-base font-bold text-slate-700">
                {formattedDob} · {tob} · {pob}
              </p>
            </div>

            <div className="inline-block px-5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs">
              GENERATED {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>KUTHI YENGPHAM BY KANGLEIASTRO</span>
            <span>WWW.KUTHIYENGPHAM.IN</span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 2: BIRTH DETAILS, PANCHANG & AVAKHADA
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">01. Birth, Panchang &amp; Avakhada Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#fffdf7] border border-amber-200 space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 border-b border-amber-200/80 pb-1 uppercase tracking-wider">Birth Details</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Name:</span><span className="font-bold">{name}</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Gender:</span><span className="font-bold">{gender}</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Date of Birth:</span><span className="font-bold">{formattedDob}</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Time of Birth:</span><span className="font-bold">{tob}</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Place of Birth:</span><span className="font-bold">{pob}</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Latitude / Longitude:</span><span className="font-bold">{lat} / {long}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Timezone:</span><span className="font-bold">GMT +05:30</span></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#fffdf7] border border-amber-200 space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 border-b border-amber-200/80 pb-1 uppercase tracking-wider">Panchang Details</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Tithi:</span><span className="font-bold">KrishnaChaturdashi</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Karana:</span><span className="font-bold">Shakuni</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Nakshatra:</span><span className="font-bold">{moonPlanet.nakshatraName || 'Pushya'}</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Nakshatra Lord:</span><span className="font-bold">Saturn</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Yoga:</span><span className="font-bold">Vyatipata</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">Ascendant:</span><span className="font-bold">{ascendantSignName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Ascendant Lord:</span><span className="font-bold">Venus</span></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2 text-xs">
            <h3 className="font-bold text-[#b45309] border-b border-amber-200 pb-1 uppercase tracking-wider">Avakhada Chakra Details</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              <div><span className="text-slate-400 block text-[10px]">VARNA</span><span className="font-bold text-slate-900">Brahmin</span></div>
              <div><span className="text-slate-400 block text-[10px]">VASHYA</span><span className="font-bold text-slate-900">Jalchar</span></div>
              <div><span className="text-slate-400 block text-[10px]">YONI</span><span className="font-bold text-slate-900">Chaga</span></div>
              <div><span className="text-slate-400 block text-[10px]">GANA</span><span className="font-bold text-slate-900">Dev</span></div>
              <div><span className="text-slate-400 block text-[10px]">NADI</span><span className="font-bold text-slate-900">Madhya</span></div>
              <div><span className="text-slate-400 block text-[10px]">SIGN</span><span className="font-bold text-slate-900">{moonPlanet.signName || 'Cancer'}</span></div>
              <div><span className="text-slate-400 block text-[10px]">SIGN LORD</span><span className="font-bold text-slate-900">Moon</span></div>
              <div><span className="text-slate-400 block text-[10px]">CHARAN</span><span className="font-bold text-slate-900">{moonPlanet.nakshatraPada || 3}</span></div>
              <div><span className="text-slate-400 block text-[10px]">TATVA</span><span className="font-bold text-slate-900">Water</span></div>
              <div><span className="text-slate-400 block text-[10px]">PAYA</span><span className="font-bold text-slate-900">Silver</span></div>
              <div><span className="text-slate-400 block text-[10px]">YUNJA</span><span className="font-bold text-slate-900">Madhya</span></div>
              <div><span className="text-slate-400 block text-[10px]">NAME ALPHABET</span><span className="font-bold text-slate-900">Ho</span></div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 3: PRIMARY KUNDLI CHARTS (D1 & D9)
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">02. Primary Kundli Charts (Bengali Rashi Chakra)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-2xl border border-slate-200 text-center space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Lagna Chart (D1)</h3>
              <BengaliChart
                title="D1 Rashi Chart"
                planets={planets.map((p: any) => ({
                  name: p.name,
                  abbr: p.shortName || p.name.substring(0, 2),
                  houseNumber: p.houseNumber,
                  isRetrograde: p.isRetrograde,
                }))}
                ascendantSign={ascendantSign}
                theme="light"
              />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 text-center space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Navamsha Chart (D9)</h3>
              <BengaliChart
                title="D9 Navamsha Chart"
                planets={planets.map((p: any) => ({
                  name: p.name,
                  abbr: p.shortName || p.name.substring(0, 2),
                  houseNumber: ((p.houseNumber + 3) % 12) + 1,
                  isRetrograde: p.isRetrograde,
                }))}
                ascendantSign={(ascendantSign + 8) % 12}
                theme="light"
              />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 4: PLANETARY POSITIONS TABLE & SHADBALA & BHAVA BALA
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">03. Planetary Longitudes &amp; Strengths (Shadbala &amp; Bhava Bala)</h2>
          </div>

          <PlanetaryTable
            planets={planets.map((p: any) => ({
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

        {/* ─────────────────────────────────────────────────────────────
           SECTION 5: KP SYSTEM & HOUSE CUSPS
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">04. KP System &amp; House Cusps</h2>
          </div>
          <KPSection chartData={chartData} isLight={true} />
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 6: ASHTAKVARGA CHARTS GRID
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">05. Ashtakvarga Charts (Sarvashtakvarga)</h2>
          </div>
          <AshtakvargaSection isLight={true} />
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 7: ALL DIVISIONAL VARGA CHARTS
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">06. All 13 Divisional Varga Charts (Bengali Style)</h2>
          </div>
          <AllDivisionalBengaliCharts chartData={chartData} isLight={true} />
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 8: DASHA TIMELINES & ANTARDASHA
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">07. Vimshottari Mahadasha &amp; Antardasha Periods</h2>
          </div>
          <DashaTimeline
            dashas={chartData.dashas?.map((d: any, i: number) => ({
              id: `dasha-${i}`,
              planet: d.lord || d.planet || 'Ketu',
              startDate: d.startDate ? new Date(d.startDate).toLocaleDateString() : 'Birth',
              endDate: d.endDate ? new Date(d.endDate).toLocaleDateString() : '2032',
              subPeriods: d.subPeriods?.map((sub: any, subIdx: number) => ({
                id: `dasha-${i}-${subIdx}`,
                planet: sub.lord || sub.planet,
                startDate: sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '',
                endDate: sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '',
              })),
            })) || []}
            currentDate={new Date().toLocaleDateString()}
          />
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 9: UNABRIDGED VIMSHOTTARI MAHADASHA PREDICTIONS
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">08. Vimshottari Mahadasha Predictions (Full Periods)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm">Ketu Mahadasha (Birth – 21-12-2032)</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                The conjunction of Ketu in the 4th house brings initial inner transformations. The native acquires property, land, and spiritual authority through discipline.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm">Venus Mahadasha (21-12-2032 – 21-12-2052)</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Venus in the 5th house brings immense wealth, royal respect, fame, artistic skills, and prosperity for children and family.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm">Sun Mahadasha (21-12-2052 – 21-12-2058)</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Sun in the 3rd house in Cancer sign bestows immense courage, victory over hurdles, career promotion, and social prominence.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm">Moon Mahadasha (21-12-2058 – 21-12-2068)</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Moon in Aries in 12th house fosters exploration, foreign travel, spiritual growth, and loyal companionship.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm">Mars Mahadasha (21-12-2068 – 21-12-2075)</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Mars in 2nd house in Gemini brings an active period with land journeys, artistic expression, and financial accumulation.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm">Rahu Mahadasha (21-12-2075 – 21-12-2093)</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Rahu in 10th house in Aquarius grants deep attraction to sacred literature, professional breakthroughs, and wealth creation.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 10: YOGINI DASHA & SPECIAL AUSPICIOUS YOGAS
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">09. Yogini Dasha &amp; Special Auspicious Yogas</h2>
          </div>

          <div className="p-4 rounded-2xl bg-[#fffdf7] border border-amber-200 space-y-3">
            <h3 className="font-bold text-xs text-slate-900 border-b border-amber-200 pb-1.5 uppercase tracking-wider">Yogini Dasha Timeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-semibold text-slate-700">
              <div className="p-2 bg-amber-50 rounded-lg"><span className="text-[9px] text-slate-400 block uppercase font-bold">BHRAMARI</span><span>Birth to Mar 2030</span></div>
              <div className="p-2 bg-amber-50 rounded-lg"><span className="text-[9px] text-slate-400 block uppercase font-bold">BHADRIKA</span><span>Mar 2030 - 2035</span></div>
              <div className="p-2 bg-amber-50 rounded-lg"><span className="text-[9px] text-slate-400 block uppercase font-bold">ULKA</span><span>Mar 2035 - 2041</span></div>
              <div className="p-2 bg-amber-50 rounded-lg"><span className="text-[9px] text-slate-400 block uppercase font-bold">SIDDHA</span><span>Mar 2041 - 2048</span></div>
              <div className="p-2 bg-amber-50 rounded-lg"><span className="text-[9px] text-slate-400 block uppercase font-bold">SANKATA</span><span>Mar 2048 - 2056</span></div>
              <div className="p-2 bg-amber-50 rounded-lg"><span className="text-[9px] text-slate-400 block uppercase font-bold">MANGALA</span><span>Mar 2056 - 2057</span></div>
              <div className="p-2 bg-amber-50 rounded-lg"><span className="text-[9px] text-slate-400 block uppercase font-bold">PINGALA</span><span>Mar 2057 - 2059</span></div>
              <div className="p-2 bg-amber-50 rounded-lg"><span className="text-[9px] text-slate-400 block uppercase font-bold">DHANYA</span><span>Mar 2059 - 2062</span></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
            <h3 className="font-bold text-xs text-[#b45309] border-b border-amber-200 pb-1.5 uppercase tracking-wider">Special Auspicious Yogas Present</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>✨ Gajakesari Yoga</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">PRESENT</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">Jupiter in Kendra aspect from Moon. Bestows high intelligence, spotless reputation, lasting prosperity, and public respect.</p>
              </div>
              <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>☀️ Budhaditya Yoga</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">PRESENT</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">Sun &amp; Mercury placed together in 2nd house. Bestows sharp analytical acumen, fluency in speech, and career success in commerce.</p>
              </div>
              <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>👑 Dhana Yoga</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">PRESENT</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">2nd Lord Mercury &amp; 11th Lord Saturn form mutually supportive aspects, ensuring continuous financial inflow throughout life.</p>
              </div>
              <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>🌸 Amala Yoga</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">PRESENT</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">Benefic planet Venus occupies 10th house from Moon. Ensures clean professional reputation and philanthropic nature.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 11: UNABRIDGED ASCENDANT PREDICTIONS
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">10. Ascendant Predictions (Full Unabridged Text)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 space-y-1.5">
              <h3 className="font-bold text-amber-900 text-sm">Taurus Ascendant Personality</h3>
              <p className="text-slate-600 font-medium text-xs leading-relaxed">
                Those born with Taurus ascendant are introverted yet fun-loving and friendly. They create their own little world studded with luxuries and comfort, knowing that having these luxuries requires hard work and commitment.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 space-y-1.5">
              <h3 className="font-bold text-amber-900 text-sm">Physical Appearance</h3>
              <p className="text-slate-600 font-medium text-xs leading-relaxed">
                Ruled by Venus, possessing a short physique, lovely face with large gleaming eyes, nicely formed ears and nose, powerful neck, and a delightful persona.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 space-y-1.5">
              <h3 className="font-bold text-amber-900 text-sm">Health &amp; Vitality</h3>
              <p className="text-slate-600 font-medium text-xs leading-relaxed">
                Good health for the most part of life. Proper sleep is essential to maintain skin health and nervous system stability.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 space-y-1.5">
              <h3 className="font-bold text-amber-900 text-sm">Career &amp; Profession</h3>
              <p className="text-slate-600 font-medium text-xs leading-relaxed">
                Eager to put in effort for steady long-term income with low risk. Great success in construction, food, and financial sectors.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 12: UNABRIDGED PLANETARY HOUSE PLACEMENT PREDICTIONS
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">11. Detailed Planetary House Placement Predictions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-1.5">
              <h4 className="font-bold text-amber-900 text-sm">Sun Consideration (3rd House Cancer)</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Sun in 3rd house is very friendly, granting royalness, courage, victory over adversaries, and educational advancements.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-1.5">
              <h4 className="font-bold text-amber-900 text-sm">Moon Consideration (12th House Aries)</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Moon in 12th house fosters foreign travel, exploratory journeys, deep spiritual pursuits, and loyal companionships.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-1.5">
              <h4 className="font-bold text-amber-900 text-sm">Mercury Consideration (2nd House Gemini)</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Being in its own sign, Mercury proves highly beneficial for massive wealth accumulation, counseling skills, and intelligence.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-1.5">
              <h4 className="font-bold text-amber-900 text-sm">Venus Consideration (5th House Virgo)</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Venus in 5th house brings creative renown, wise counsel, and honor in society through virtuous fame and deeds.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-1.5">
              <h4 className="font-bold text-amber-900 text-sm">Mars Consideration (2nd House Gemini)</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Active period packed with land journeys, artistic expression, and financial cultivation.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-1.5">
              <h4 className="font-bold text-amber-900 text-sm">Jupiter Consideration (3rd House Cancer)</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Exalted sign placement. Grants huge gains, dignified personality, and general improvement in living conditions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-1.5">
              <h4 className="font-bold text-amber-900 text-sm">Saturn Consideration (11th House Pisces)</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Favorable gains in daily income, respect from elders, municipal prominence, and civic position.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-1.5">
              <h4 className="font-bold text-amber-900 text-sm">Rahu Consideration (10th House Aquarius)</h4>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                Attraction to sacred texts, clean living, and steady improvement in work life and wealth.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 13: GEMSTONES, RUDRAKSHA & DOSHA ANALYSIS
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">12. Gemstones, Rudraksha &amp; Dosha Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* RUDRAKSHA */}
            <div className="p-4 rounded-2xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm border-b border-amber-200 pb-1">8-Mukhi Rudraksha Recommendation</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Ruled by Ketu &amp; Lord Ganesha. Enhances willpower, removes career hurdles, aids blood circulation, and controls negative thoughts.
              </p>
              <div className="pt-1 text-xs font-bold text-slate-700 space-y-1">
                <div><span className="text-amber-900 font-bold">How to wear:</span> Wash in Gangajal or Haldi water. Chant &quot;Om Hum Namah&quot; while wearing.</div>
                <div><span className="text-amber-900 font-bold">Precautions:</span> Keep hidden, discard non-veg and alcohol, remove before sleeping.</div>
              </div>
            </div>

            {/* GEMSTONES */}
            <div className="p-4 rounded-2xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm border-b border-amber-200 pb-1">Gemstone Recommendations</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">Life Stone (Venus):</span> Diamond (Heera) in gold/silver on middle finger.
                  <div className="text-[11px] text-slate-500 font-mono">Mantra: Om dram drim draum sah shukraya namah</div>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Lucky Stone (Taurus):</span> Emerald (Panna) on little finger.
                  <div className="text-[11px] text-slate-500 font-mono">Mantra: Om bram brim braum sah budhaya namah</div>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Fortune Stone (Saturn):</span> Blue Sapphire (Neelam) on middle finger.
                  <div className="text-[11px] text-slate-500 font-mono">Mantra: Om pram prim praum sah shanaisharaya namah</div>
                </div>
              </div>
            </div>
          </div>

          {/* DOSHA ANALYSIS */}
          <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3 text-xs">
            <h3 className="font-bold text-rose-900 border-b border-rose-200 pb-1 uppercase tracking-wider">Vedic Dosha Analysis &amp; Remedies</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl"><span className="text-[10px] font-bold text-emerald-800 block">MANGLIK DOSHA</span><span className="font-extrabold text-emerald-900">NON-MANGLIK</span></div>
              <div className="p-2.5 bg-rose-100 border border-rose-300 rounded-xl"><span className="text-[10px] font-bold text-rose-800 block">KALSARPA DOSHA</span><span className="font-extrabold text-rose-900">GHATAK KALSARPA</span></div>
              <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl"><span className="text-[10px] font-bold text-slate-600 block">SADE SATI</span><span className="font-extrabold text-slate-800">NOT ACTIVE</span></div>
            </div>
            <div className="space-y-1 text-slate-600 text-xs font-medium pt-1">
              <p><span className="font-bold text-rose-900">Ghatak Kaalsarp Dosh Analysis:</span> Formed when Rahu is in 10th house and Ketu sits in 4th house. Serve your mother and respect elders.</p>
              <p><span className="font-bold text-rose-900">Remedies:</span> Read Hanuman Chalisa and fast on Tuesdays. Read Ganapati Atharvashirsha on full moon. Donate coconut &amp; black cloth on Fridays.</p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 14: GENERAL HOROSCOPE, TEMPERAMENT & LIFE PHILOSOPHY
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">13. General Vedic Horoscope &amp; Temperament Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">Moon Sign (Rashi) Emotional Influence</h4>
              <p className="text-slate-600 font-medium leading-relaxed">
                Your Moon sign highlights an empathetic, intuitive, and emotionally nurturing mind. You possess a strong memory, deep attachment to family, and creative problem-solving skills.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">Sun Sign Leadership &amp; Vitality</h4>
              <p className="text-slate-600 font-medium leading-relaxed">
                The Sun grants leadership drive, self-respect, and creative expression. You naturally command respect in group environments and inspire confidence in colleagues.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">Temperament &amp; Moral Values</h4>
              <p className="text-slate-600 font-medium leading-relaxed">
                Guided by Deva Gana, your temperament balances high ethical integrity with warm compassion. You dislike deception and value transparent communication.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fffdf7] border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">Key Life Philosophy</h4>
              <p className="text-slate-600 font-medium leading-relaxed">
                Steadfastness over speed. Building solid foundations in family wealth and spiritual discipline will ensure lifetime peace and legacy.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 15: PRESCRIBED ASTROLOGICAL REMEDIES & FASTING ROUTINES
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-5">
          <div className="border-b border-amber-200/80 pb-2">
            <h2 className="text-lg font-serif font-bold text-[#b45309]">14. Prescribed Astrological Remedies &amp; Daily Mantras</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#fffdfa] border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">💎 Recommended Auspicious Gemstone</h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                <strong>Yellow Sapphire (Pukhraj) 5.25 Ratti</strong> set in Gold ring on Index Finger of right hand, worn on Thursday morning after purifying with Panchamrut.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fffdfa] border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">📿 Sacred Rudraksha Beads</h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                <strong>5-Mukhi Nepali Rudraksha Mala (108+1 Beads)</strong> for emotional stability, blood pressure regulation, and deep meditative stillness.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fffdfa] border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">🕉️ Daily Mantra Recitation</h4>
              <p className="text-slate-700 leading-relaxed font-medium font-serif">
                Recite &ldquo;Om Namah Shivaya&rdquo; or &ldquo;Mahamrityunjaya Mantra&rdquo; 108 times daily facing East at sunrise.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fffdfa] border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">🙏 Charity &amp; Vrat (Fasting)</h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                Donate yellow lentils (chana dal) and cow ghee on Thursdays. Observe light vegetarian fasting on Mondays for Shiva grace.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           SECTION 14: BACK COVER / ASTROLOGER CONSULTATION CTA
           ───────────────────────────────────────────────────────────── */}
        <div className="pdf-card bg-white rounded-2xl border border-slate-200/90 shadow-md p-8 text-center space-y-6 min-h-[500px] flex flex-col justify-between">
          <div className="my-auto space-y-6 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#fef08a] border-4 border-[#facc15] flex items-center justify-center text-4xl shadow-xs mx-auto">
              🔮
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#b45309]">
              Thank you for reading your Kundli Report
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              For personalized one-on-one astrological guidance, gemstone activation, or remedial puja consultation, visit Kuthi Yengpham by KangleiAstro.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>KUTHI YENGPHAM BY KANGLEIASTRO</span>
            <span>WWW.KUTHIYENGPHAM.IN</span>
          </div>
        </div>

      </div>

      {/* PDF PREPARATION PROGRESS MODAL */}
      {isPreparingPDF && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#fef08a] border-2 border-[#facc15] flex items-center justify-center mx-auto shadow-md text-2xl">
              📜
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-black text-xl text-[#b45309]">
                Your Kundli Report is Preparing...
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Please wait a moment while we render all charts, planetary longitudes, and horoscope predictions into your downloadable A4 PDF.
              </p>
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-2.5">
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200 p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300 shadow-xs"
                  style={{ width: `${prepProgress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs font-bold">
                <span className="truncate text-slate-600">{prepStepText}</span>
                <span className="text-[#b45309] font-mono font-extrabold ml-2">{prepProgress}%</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Fast High-Resolution A4 Conversion</span>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL GATE BEFORE PDF DOWNLOAD */}
      <KundliAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
