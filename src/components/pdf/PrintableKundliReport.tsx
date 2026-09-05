'use client';

import React from 'react';
import BengaliChart from '../charts/BengaliChart';
import PlanetaryTable from '../charts/PlanetaryTable';
import ShadbalaTable from '../charts/ShadbalaTable';
import BhavaBalaTable from '../charts/BhavaBalaTable';
import KPSection from '../charts/KPSection';
import AshtakvargaSection from '../charts/AshtakvargaSection';
import AllDivisionalBengaliCharts from '../charts/AllDivisionalBengaliCharts';
import FreeReportSection from '../charts/FreeReportSection';
import DashaTimeline from '../charts/DashaTimeline';

interface PrintableKundliReportProps {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  lat: string;
  long: string;
  gender: string;
  chartData: any;
}

export async function downloadDirectPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element for PDF download not found:', elementId);
    window.print();
    return;
  }

  try {
    const { downloadPDF } = await import('dompdf.js');
    await downloadPDF(
      element,
      {
        format: 'a4',
        orientation: 'portrait',
        pagination: true,
        compress: true,
      },
      filename
    );
  } catch (err) {
    console.warn('WASM dompdf failed, triggering instant browser print:', err);
    window.print();
  }
}

export function PrintableKundliReport({
  name,
  dob,
  tob,
  pob,
  lat,
  long,
  gender,
  chartData,
}: PrintableKundliReportProps) {
  const ascendantSign = chartData?.ascendantSign ?? 1;
  const planets = chartData?.planets || [];

  return (
    <div
      id="printable-kundli-document"
      className="fixed top-0 -left-[9999px] w-[800px] bg-white text-slate-900 font-sans p-8 space-y-12 z-[-9999] pointer-events-none print:static print:left-0 print:z-auto print:block print:w-full"
    >
      {/* ─────────────────────────────────────────────────────────────
         PAGE 1: COVER PAGE
         ───────────────────────────────────────────────────────────── */}
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center space-y-8 border-b-2 border-amber-300 pb-12 page-break-after">
        <div className="w-24 h-24 rounded-full bg-[#fef08a] border-4 border-[#facc15] flex items-center justify-center text-4xl shadow-md">
          ☀️
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black text-amber-900 tracking-widest uppercase block">
            KUTHI YENGPHAM BY KANGLEIASTRO VEDIC ASTROLOGY REPORT
          </span>
          <h1 className="text-4xl font-serif font-black text-[#b45309]">
            {name}&apos;s Complete Kundli
          </h1>
          <div className="w-16 h-1 bg-[#facc15] mx-auto rounded-full my-4" />
          <p className="text-base font-bold text-slate-700">
            {dob} · {tob} · {pob}
          </p>
        </div>

        <div className="px-6 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs">
          GENERATED {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
        </div>

        <p className="text-xs font-bold text-slate-400 tracking-wider uppercase pt-12">
          WWW.KUTHIYENGPHAM.IN · YOUR TRUSTED ASTROLOGY PARTNER
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         PAGE 2: BASIC DETAILS & PANCHANG & AVAKHADA
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-8 page-break-after">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#b45309]">01. Basic & Birth Details</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
            <h3 className="font-bold text-base text-slate-900 border-b border-amber-200 pb-2">Birth Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Name:</span>
                <span className="font-bold">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Gender:</span>
                <span className="font-bold">{gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Date of Birth:</span>
                <span className="font-bold">{dob}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Time of Birth:</span>
                <span className="font-bold">{tob}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Place of Birth:</span>
                <span className="font-bold">{pob}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
            <h3 className="font-bold text-base text-slate-900 border-b border-amber-200 pb-2">Panchang</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Tithi:</span>
                <span className="font-bold">KrishnaSaptami</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Nakshatra:</span>
                <span className="font-bold">Ashwini</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Yoga:</span>
                <span className="font-bold">Shoola</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Ascendant:</span>
                <span className="font-bold">Taurus</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         PAGE 3: LAGNA (D1) & NAVAMSHA (D9) CHARTS
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-8 page-break-after">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#b45309]">02. Primary Kundli Charts (Bengali Rashi Chakra)</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-slate-200 text-center space-y-3">
            <h3 className="font-bold text-base text-slate-900">Lagna Chart (D1)</h3>
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

          <div className="p-5 rounded-2xl border border-slate-200 text-center space-y-3">
            <h3 className="font-bold text-base text-slate-900">Navamsha Chart (D9)</h3>
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
         PAGE 4: PLANETARY POSITIONS TABLE & SHADBALA
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-8 page-break-after">
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
         PAGE 5: KP SYSTEM & HOUSE CUSPS
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-8 page-break-after">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#b45309]">03. KP System & House Cusps</h2>
        </div>
        <KPSection chartData={chartData} isLight={true} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
         PAGE 6: ASHTAKVARGA CHARTS GRID
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-8 page-break-after">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#b45309]">04. Ashtakvarga Charts (Sarvashtakvarga)</h2>
        </div>
        <AshtakvargaSection isLight={true} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
         PAGE 7: VIMSHOTTARI DASHA TIMELINE
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-8 page-break-after">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#b45309]">05. Vimshottari Mahadasha &amp; Antardasha Timelines</h2>
        </div>
        <DashaTimeline
          dashas={chartData.dashas?.map((d: any, i: number) => ({
            id: `dasha-${i}`,
            planet: d.lord || d.planet || 'Ketu',
            startDate: d.startDate ? new Date(d.startDate).toLocaleDateString() : 'Birth',
            endDate: d.endDate ? new Date(d.endDate).toLocaleDateString() : '',
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
         PAGE 8: ALL DIVISIONAL VARGA CHARTS
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-8 page-break-after">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#b45309]">06. All Divisional Varga Charts (D1 through D60)</h2>
        </div>
        <AllDivisionalBengaliCharts chartData={chartData} isLight={true} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
         PAGE 9: FREE REPORT & HOROSCOPE PREDICTIONS
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-8 page-break-after">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-serif font-bold text-[#b45309]">07. Detailed Horoscope &amp; Prediction Analysis</h2>
        </div>
        <FreeReportSection name={name} gender={gender} isLight={true} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
         PAGE 9: BACK COVER / ASTROLOGER CONSULTATION CTA
         ───────────────────────────────────────────────────────────── */}
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-6 pt-12 border-t-2 border-amber-300">
        <div className="w-20 h-20 rounded-full bg-[#fef08a] border-4 border-[#facc15] flex items-center justify-center text-3xl shadow-xs">
          🔮
        </div>
        <h2 className="text-3xl font-serif font-black text-[#b45309]">
          Thank you for reading your Kundli Report
        </h2>
        <p className="text-sm font-semibold text-slate-600 max-w-md">
          For personalized one-on-one astrological guidance, gemstone activation, or remedial puja consultation, visit Kuthi Yengpham by KangleiAstro.
        </p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-8">
          WWW.KUTHIYENGPHAM.IN · END OF REPORT
        </p>
      </div>
    </div>
  );
}

export default PrintableKundliReport;
