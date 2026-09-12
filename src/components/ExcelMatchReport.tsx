'use client';

import React, { useState } from 'react';
import { 
  SalaiItem, YekSalaiMatchResult, NgaIshingResult, 
  ManglikEvaluation, DetailedAshtakootResult, ManipuriSurnameEntry,
  toBengaliNumber
} from '@/engine/yekSalai';
import { ShieldCheck, AlertTriangle, CheckCircle2, Heart, Sparkles, Printer, Layers } from 'lucide-react';
import BengaliChart from '@/components/charts/BengaliChart';

export interface KundaliPlanet {
  id: string;          // 'su', 'mo', 'ma', 'me', 'ju', 've', 'sa', 'ra', 'ke'
  name: string;        // 'Sun', 'Moon', etc.
  bengaliName: string; // 'রবি', 'চন্দ', 'মঙ্গ', 'বুধ', 'গুরু', 'শুক্র', 'শনি', 'রাহু', 'কেতু'
  bengaliDigit: string;// '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'
  signIndex: number;   // 0 to 11
  signName: string;    // 'Mesha', etc.
  signBengali: string; // 'মেষ', etc.
  degreeInSign?: string; // '14°25''
  house: number;       // 1 to 12
}

interface ExcelMatchReportProps {
  groomName: string;
  brideName: string;
  groomSurnameEntry?: ManipuriSurnameEntry;
  brideSurnameEntry?: ManipuriSurnameEntry;
  groomSalai: SalaiItem;
  brideSalai: SalaiItem;
  yekSalaiMatch: YekSalaiMatchResult;
  groomLagnaSignIndex: number;
  brideLagnaSignIndex: number;
  groomLagnaDegree?: string;
  brideLagnaDegree?: string;
  groomMarsHouseFromLagna: number;
  groomMarsHouseFromMoon: number;
  brideMarsHouseFromLagna: number;
  brideMarsHouseFromMoon: number;
  groomPlanets: KundaliPlanet[];
  bridePlanets: KundaliPlanet[];
  manglik: ManglikEvaluation;
  ashtakoot: DetailedAshtakootResult;
  ngaIshing: NgaIshingResult;
}

const RASHIS_DATA = [
  { index: 0, english: 'Mesha', bengali: 'মেষ' },
  { index: 1, english: 'Vrisha', bengali: 'বৃষ' },
  { index: 2, english: 'Mithun', bengali: 'মিথুন' },
  { index: 3, english: 'Karkat', bengali: 'কর্কট' },
  { index: 4, english: 'Singh', bengali: 'সিংহ' },
  { index: 5, english: 'Kanya', bengali: 'কন্যা' },
  { index: 6, english: 'Tula', bengali: 'তুলা' },
  { index: 7, english: 'Vrishik', bengali: 'বৃশ্চিক' },
  { index: 8, english: 'Dhanu', bengali: 'ধনু' },
  { index: 9, english: 'Makar', bengali: 'মকর' },
  { index: 10, english: 'Kumbha', bengali: 'কুম্ভ' },
  { index: 11, english: 'Meena', bengali: 'মীন' }
];

export default function ExcelMatchReport({
  groomName,
  brideName,
  groomSurnameEntry,
  brideSurnameEntry,
  groomSalai,
  brideSalai,
  yekSalaiMatch,
  groomLagnaSignIndex,
  brideLagnaSignIndex,
  groomLagnaDegree,
  brideLagnaDegree,
  groomMarsHouseFromLagna,
  groomMarsHouseFromMoon,
  brideMarsHouseFromLagna,
  brideMarsHouseFromMoon,
  groomPlanets = [],
  bridePlanets = [],
  manglik,
  ashtakoot,
  ngaIshing
}: ExcelMatchReportProps) {
  const [displayMode, setDisplayMode] = useState<'NUMBERS' | 'NAMES' | 'BOTH'>('NUMBERS');
  const [showPlanetTable, setShowPlanetTable] = useState(true);

  return (
    <div className="space-y-6">

      {/* -------------------------------------------------------- */}
      {/* 1. YEK & SALAI HERITAGE & MARRIAGE COMPATIBILITY CARD */}
      {/* -------------------------------------------------------- */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 transition-all shadow-md ${
        yekSalaiMatch.isCompatible 
          ? 'bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/40 border-emerald-400' 
          : 'bg-gradient-to-br from-rose-50/80 via-white to-red-50/40 border-rose-500'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-current/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${
                yekSalaiMatch.isCompatible ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {yekSalaiMatch.isCompatible ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {yekSalaiMatch.isCompatible ? 'ꯌꯦꯛ ꯈꯦꯛꯏ (Yek Khek-e)' : 'ꯌꯦꯛ ꯊꯣꯛꯏ (Yek Thok-e)'}
              </span>
              <span className="text-xs font-mono text-gray-500">
                Manipur Royal Astrological Rule
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-gray-900">
              {yekSalaiMatch.title}
            </h2>
            <p className="text-sm font-serif font-bold text-amber-900">
              {yekSalaiMatch.meeteiTitle}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Yek Salai Status</span>
            <span className={`text-sm font-black ${yekSalaiMatch.isCompatible ? 'text-emerald-700' : 'text-red-700'}`}>
              {yekSalaiMatch.isCompatible ? 'Auspicious & Permitted (ꯑꯐꯕ)' : 'Strictly Prohibited (ꯌꯥꯗꯦ)'}
            </span>
          </div>
        </div>

        {/* Surnames to Salais Connection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Groom Clan Card */}
          <div className="p-4 rounded-2xl bg-white/80 border border-gray-200/80 shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Groom Clan (নুপাগী য়ুম্নাক অমসুং সালাই)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-gray-900">
                {groomSurnameEntry ? groomSurnameEntry.english : groomName.split(' ')[0]}
              </span>
              <span className="text-sm font-bold text-emerald-800 font-serif">
                {groomSurnameEntry?.manipuri || ''}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Identified Salai:</span>
              <span className="font-bold text-[#b45309]">
                {groomSalai.name} ({groomSalai.meeteiMayek})
              </span>
            </div>
            <div className="text-[11px] text-gray-500 space-y-0.5">
              <p>• Deity: <strong>{groomSalai.deity}</strong></p>
              <p>• Sacred Flower: <strong>{groomSalai.flower}</strong></p>
            </div>
          </div>

          {/* Bride Clan Card */}
          <div className="p-4 rounded-2xl bg-white/80 border border-gray-200/80 shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Bride Clan (নুপীগী য়ুম্নাক অমসুং সালাই)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-gray-900">
                {brideSurnameEntry ? brideSurnameEntry.english : brideName.split(' ')[0]}
              </span>
              <span className="text-sm font-bold text-emerald-800 font-serif">
                {brideSurnameEntry?.manipuri || ''}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Identified Salai:</span>
              <span className="font-bold text-[#b45309]">
                {brideSalai.name} ({brideSalai.meeteiMayek})
              </span>
            </div>
            <div className="text-[11px] text-gray-500 space-y-0.5">
              <p>• Deity: <strong>{brideSalai.deity}</strong></p>
              <p>• Sacred Flower: <strong>{brideSalai.flower}</strong></p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-gray-700 bg-white/60 p-3 rounded-xl border border-current/10">
          <strong>Cultural &amp; Ancestral Verdict:</strong> {yekSalaiMatch.summary} {yekSalaiMatch.customaryVerdict}
        </p>
      </div>

      {/* -------------------------------------------------------- */}
      {/* 2. AUTHENTIC EXCEL SHEET REPLICA (Sheet: Match_Matching) */}
      {/* -------------------------------------------------------- */}
      <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-md p-4 sm:p-8 space-y-6 font-sans">
        
        {/* Main Title Header */}
        <div className="text-center border-b-2 border-gray-800 pb-3">
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 tracking-wide">
            নুপা নুপী অনীগী পক্ন-ৱাইনা য়েংবা
          </h1>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">
            Manipur Kundali Match-Making &amp; Ashtakoota Analysis (As calculated in Excel qw.xlsm)
          </p>
        </div>

        {/* Names Header Bar & Planet Display Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-600">Name (Male):</span>
            <span className="font-bold text-gray-900 underline decoration-amber-500 underline-offset-2">
              {groomName}
            </span>
          </div>

          {/* Toggle between Bengali No (১-৯), Names, or Both */}
          <div className="flex items-center gap-1.5 self-center bg-amber-50/80 p-1.5 rounded-xl border border-amber-300/80 shadow-xs text-xs">
            <span className="text-[10px] text-amber-900 font-black px-1.5 uppercase tracking-wide">
              গ্রহ চিহ্নিং (Chart Mode):
            </span>
            <button
              type="button"
              onClick={() => setDisplayMode('NUMBERS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                displayMode === 'NUMBERS' 
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-700/30' 
                  : 'text-gray-700 hover:text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              ১-৯ সংখ্যা (Bengali No)
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('NAMES')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                displayMode === 'NAMES' 
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-700/30' 
                  : 'text-gray-700 hover:text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              বাংলা নাম (রবি-কেতু)
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('BOTH')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                displayMode === 'BOTH' 
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-700/30' 
                  : 'text-gray-700 hover:text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              উভয় (১ রবি)
            </button>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <span className="font-bold text-gray-600">Name (Female):</span>
            <span className="font-bold text-gray-900 underline decoration-amber-500 underline-offset-2">
              {brideName}
            </span>
          </div>
        </div>

        {/* Side-by-Side Bengali Rashi Charts (বাংলা রাশি চক্র) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
          {/* Groom Chart */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-full flex justify-center">
              <BengaliChart 
                ascendantSign={groomLagnaSignIndex}
                planets={groomPlanets.map(p => ({
                  name: p.name,
                  houseNumber: p.signIndex + 1,
                  signDegree: p.degreeInSign ? parseFloat(p.degreeInSign) : undefined,
                  abbr: p.bengaliName,
                }))}
                title="Birth Chart (Male)"
                displayMode={displayMode}
              />
            </div>

            {/* Mars Evaluation Under Male Chart */}
            <div className="w-full max-w-[500px] text-xs font-serif text-gray-800 space-y-2.5 bg-gray-50/70 p-3 rounded-xl border border-gray-200 shadow-2xs">
              <p className="leading-snug">
                রাশি চক্রদা মঙ্গল অসি লগ্নগী <strong>{toBengaliNumber(groomMarsHouseFromLagna)}</strong> শুবা য়ুমদা লৈরে।<br />
                মরম অসিনা লগ্নদগী য়েংবদা মঙ্গল দোষ <span className={`font-bold ${manglik.groomLagnaDosha ? 'text-red-600' : 'text-emerald-700'}`}>
                  {manglik.groomLagnaDosha ? 'লৈরে।' : 'লৈতে।'}
                </span>
              </p>
              <p className="leading-snug">
                রাশি চক্রদা মঙ্গল অসি থাগী <strong>{toBengaliNumber(groomMarsHouseFromMoon)}</strong> শুবা য়ুমদা লৈরে।<br />
                মরম অসিনা থাদগী য়েংবদা মঙ্গল দোষ <span className={`font-bold ${manglik.groomMoonDosha ? 'text-red-600' : 'text-emerald-700'}`}>
                  {manglik.groomMoonDosha ? 'লৈরে।' : 'লৈতে।'}
                </span>
              </p>
            </div>
          </div>

          {/* Bride Chart */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-full flex justify-center">
              <BengaliChart 
                ascendantSign={brideLagnaSignIndex}
                planets={bridePlanets.map(p => ({
                  name: p.name,
                  houseNumber: p.signIndex + 1,
                  signDegree: p.degreeInSign ? parseFloat(p.degreeInSign) : undefined,
                  abbr: p.bengaliName,
                }))}
                title="Birth Chart (Female)"
                displayMode={displayMode}
              />
            </div>

            {/* Mars Evaluation Under Female Chart */}
            <div className="w-full max-w-[500px] text-xs font-serif text-gray-800 space-y-2.5 bg-gray-50/70 p-3 rounded-xl border border-gray-200 shadow-2xs">
              <p className="leading-snug">
                রাশি চক্রদা মঙ্গল অসি লগ্নগী <strong>{toBengaliNumber(brideMarsHouseFromLagna)}</strong> শুবা য়ুমদা লৈরে।<br />
                মরম অসিনা লগ্নদগী য়েংবদা মঙ্গল দোষ <span className={`font-bold ${manglik.brideLagnaDosha ? 'text-red-600' : 'text-emerald-700'}`}>
                  {manglik.brideLagnaDosha ? 'লৈরে।' : 'লৈতে।'}
                </span>
              </p>
              <p className="leading-snug">
                রাশি চক্রদা মঙ্গল অসি থাগী <strong>{toBengaliNumber(brideMarsHouseFromMoon)}</strong> শুবা য়ুমদা লৈরে।<br />
                মরম অসিনা থাদগী য়েংবদা মঙ্গল দোষ <span className={`font-bold ${manglik.brideMoonDosha ? 'text-red-600' : 'text-emerald-700'}`}>
                  {manglik.brideMoonDosha ? 'লৈরে।' : 'লৈতে।'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* EXPANDABLE PLANETARY RASHI TABLE (গ্রহ রাশি সারণী) */}
        {/* -------------------------------------------------------- */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/60 shadow-xs">
          <button
            type="button"
            onClick={() => setShowPlanetTable(!showPlanetTable)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>গ্রহ রাশি সারণী (Calculated Planetary Rashi &amp; Degree Table - ১ to ৯ Order)</span>
            </div>
            <span className="text-amber-700 font-mono text-[11px] font-semibold">
              {showPlanetTable ? 'Hide Table ▲' : 'Show Calculated Rashi for All Planets (১-৯) ▼'}
            </span>
          </button>

          {showPlanetTable && (
            <div className="overflow-x-auto p-3 bg-white border-t border-gray-200">
              <table className="w-full text-xs text-left border-collapse font-serif">
                <thead>
                  <tr className="bg-amber-100/80 text-gray-900 border-b border-gray-300 font-bold">
                    <th className="py-2.5 px-3">No. / গ্রহ (Planet)</th>
                    <th className="py-2.5 px-3">Groom Sign (নুপাগী রাশি)</th>
                    <th className="py-2.5 px-3">Groom Degree</th>
                    <th className="py-2.5 px-3">Groom House (ভাব)</th>
                    <th className="py-2.5 px-3">Bride Sign (নুপীগী রাশি)</th>
                    <th className="py-2.5 px-3">Bride Degree</th>
                    <th className="py-2.5 px-3">Bride House (ভাব)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Lagna Row */}
                  <tr className="bg-red-50/40">
                    <td className="py-2 px-3 font-bold text-red-700 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px]">লং</span>
                      <span>লগ্ন (Ascendant / Lagna)</span>
                    </td>
                    <td className="py-2 px-3 font-bold text-gray-900">
                      {RASHIS_DATA[groomLagnaSignIndex]?.bengali} ({RASHIS_DATA[groomLagnaSignIndex]?.english})
                    </td>
                    <td className="py-2 px-3 font-mono font-semibold text-gray-700">
                      {groomLagnaDegree || '—'}
                    </td>
                    <td className="py-2 px-3 font-bold text-red-700">
                      ১ম ভাব (Lagna)
                    </td>
                    <td className="py-2 px-3 font-bold text-gray-900">
                      {RASHIS_DATA[brideLagnaSignIndex]?.bengali} ({RASHIS_DATA[brideLagnaSignIndex]?.english})
                    </td>
                    <td className="py-2 px-3 font-mono font-semibold text-gray-700">
                      {brideLagnaDegree || '—'}
                    </td>
                    <td className="py-2 px-3 font-bold text-red-700">
                      ১ম ভাব (Lagna)
                    </td>
                  </tr>

                  {/* 1 to 9 Planets Rows */}
                  {['su', 'mo', 'ma', 'me', 'ju', 've', 'sa', 'ra', 'ke'].map((pId) => {
                    const gP = groomPlanets.find(p => p.id === pId);
                    const bP = bridePlanets.find(p => p.id === pId);
                    if (!gP && !bP) return null;
                    return (
                      <tr key={pId} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-2 px-3 font-bold text-gray-900">
                          <span className="inline-block w-5 text-amber-800 font-black">
                            {gP?.bengaliDigit || bP?.bengaliDigit}।
                          </span>
                          <span>{gP?.bengaliName || bP?.bengaliName} ({gP?.name || bP?.name})</span>
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-800">
                          {gP?.signBengali} ({gP?.signName})
                        </td>
                        <td className="py-2 px-3 font-mono text-gray-600">
                          {gP?.degreeInSign || '—'}
                        </td>
                        <td className="py-2 px-3 font-serif font-bold text-amber-900">
                          {gP?.house ? `${toBengaliNumber(gP.house)} শুবা ভাব` : '—'}
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-800">
                          {bP?.signBengali} ({bP?.signName})
                        </td>
                        <td className="py-2 px-3 font-mono text-gray-600">
                          {bP?.degreeInSign || '—'}
                        </td>
                        <td className="py-2 px-3 font-serif font-bold text-amber-900">
                          {bP?.house ? `${toBengaliNumber(bP.house)} শুবা ভাব` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* -------------------------------------------------------- */}
        {/* 3. ICONIC YELLOW ASHTAKOOTA TABLE */}
        {/* -------------------------------------------------------- */}
        <div className="space-y-2 pt-2">
          <h2 className="text-center font-serif font-bold text-base sm:text-lg text-gray-900">
            অষ্টকূটকী পান্থেন্না পক্ন-ৱাইনা য়েংবগী শক্তম
          </h2>

          <div className="overflow-x-auto border-2 border-gray-800">
            <table className="w-full text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#facc15] text-gray-900 font-serif font-bold divide-x-2 divide-gray-800 border-b-2 border-gray-800">
                  <th className="py-2 px-3 text-left">ঘোতক বিচার মখল</th>
                  <th className="py-2 px-3 text-center">নুপা</th>
                  <th className="py-2 px-3 text-center">নুপী</th>
                  <th className="py-2 px-3 text-center w-28">Maximum Point</th>
                  <th className="py-2 px-3 text-center w-28">Points Obtained</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 font-serif">
                {ashtakoot.rows.map((row, idx) => (
                  <tr key={idx} className="divide-x divide-gray-700 hover:bg-amber-50/40">
                    <td className="py-2 px-3 font-bold text-gray-900">
                      {row.numLabel}
                    </td>
                    <td className="py-2 px-3 text-center text-gray-800">
                      {row.groomVal}
                    </td>
                    <td className="py-2 px-3 text-center text-gray-800">
                      {row.brideVal}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-gray-600">
                      {row.maxPoint}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-black text-gray-900">
                      {row.pointsObtained}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-amber-100/60 font-serif font-bold divide-x-2 divide-gray-800 border-t-2 border-gray-800">
                  <td className="py-2.5 px-3 text-gray-900">
                    নুপা নুপী অনীগী চানবগী চাং
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-center font-mono text-base font-black text-gray-900">
                    {ashtakoot.percentageString}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-gray-700">
                    36
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-lg text-[#b45309]">
                    {ashtakoot.totalObtained}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* 4. ফল:- SUMMARY (Manglik & Ashtakoot Evaluation) */}
        {/* -------------------------------------------------------- */}
        <div className="space-y-3 pt-2 text-xs sm:text-sm font-serif border-t border-gray-200">
          <div className="flex items-start gap-2">
            <span className="font-bold underline text-gray-900 whitespace-nowrap">ফল:-</span>
            <div className="space-y-1 text-gray-800 leading-relaxed">
              <p>{manglik.excelBengaliSummary}</p>
              <p>
                {ashtakoot.totalObtained < 18 
                  ? 'অষ্টকূটকী চাং নেম্বনা নুপা নুপী অনীগী পক্নবা খরা ৱাংলি।' 
                  : 'অষ্টকূটকী চাং ৱাংবনা নুপা নুপী অনী অসি য়াম্না পক্ন অমসুং পুন্সি লেল্পুন তাহী।'}
              </p>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* 5. ঙা-ঈশিংগী ফল য়েংবা:- (Nga-Ishing Totem) */}
          {/* -------------------------------------------------------- */}
          <div className="pt-2 border-t border-gray-100 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold underline text-gray-900">ঙা-ঈশিংগী ফল য়েংবা:-</span>
              <span className="text-[11px] font-serif text-gray-500">
                (লগ্নদগী য়েংবা: নুপা={RASHIS_DATA[groomLagnaSignIndex]?.bengali} [{ngaIshing.groomTypeBengali}], নুপী={RASHIS_DATA[brideLagnaSignIndex]?.bengali} [{ngaIshing.brideTypeBengali}])
              </span>
            </div>
            <p className="pl-4 text-gray-900 leading-relaxed font-bold text-sm bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/80">
              {ngaIshing.excelBengaliText}
            </p>
            {ngaIshing.moonKarmastanText && (
              <p className="pl-4 text-[11px] text-gray-600 font-serif">
                <span className="font-bold text-gray-700">থাগী কর্মস্থানদগী (Moon Karmastan):</span> {ngaIshing.moonKarmastanText}
              </p>
            )}
          </div>
        </div>

        {/* Print Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Kuthi Match Certificate</span>
          </button>
        </div>

      </div>

    </div>
  );
}
