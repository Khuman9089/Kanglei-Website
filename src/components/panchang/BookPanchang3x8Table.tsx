'use client';

import React from 'react';
import { ManipuriBookPanchangData } from '@/engine/manipuriPanchangBook';
import { toBengaliNumerals, toMeeteiNumerals } from '@/engine/manipuriCalendar';
import { Table, Sun, Moon, Sparkles, Clock, Compass } from 'lucide-react';

interface BookPanchang3x8TableProps {
  data: ManipuriBookPanchangData;
  script?: 'bengali' | 'meetei' | 'blipi' | 'en';
  theme?: 'light' | 'dark';
}

function renderCell(
  val: number | string | undefined | null,
  script: 'bengali' | 'meetei' | 'blipi' | 'en' = 'bengali'
): React.ReactNode {
  if (val === '' || val === undefined || val === null) {
    return <span className="opacity-0 select-none">-</span>;
  }
  if (val === '-') {
    return <span className="text-slate-400 font-bold">-</span>;
  }
  if (val === 'নুমিৎ' || val === 'ꯅꯨꯃꯤꯠ' || val === 'nuim\\' || val === 'Numit') {
    if (script === 'meetei') return <span className="text-amber-900 font-black">ꯅꯨꯃꯤꯠ</span>;
    if (script === 'blipi') return <span className="text-amber-900 font-black font-blipi">nuim\</span>;
    if (script === 'en') return <span className="text-amber-900 font-black">Numit</span>;
    return <span className="text-amber-900 font-black">নুমিৎ</span>;
  }
  if (val === 'চুপ্না' || val === 'ꯆꯨꯞꯅꯥ' || val === 'cup_na' || val === 'Chupna') {
    if (script === 'meetei') return <span className="text-amber-900 font-black">ꯆꯨꯞꯅꯥ</span>;
    if (script === 'blipi') return <span className="text-amber-900 font-black font-blipi">cup_na</span>;
    if (script === 'en') return <span className="text-amber-900 font-black">Chupna</span>;
    return <span className="text-amber-900 font-black">চুপ্না</span>;
  }

  const num = typeof val === 'number' ? val : Number(val);
  if (!isNaN(num)) {
    if (script === 'meetei') return toMeeteiNumerals(num);
    if (script === 'bengali') return toBengaliNumerals(num);
    return num;
  }
  return String(val);
}

export default function BookPanchang3x8Table({
  data,
  script = 'bengali',
  theme = 'light',
}: BookPanchang3x8TableProps) {
  const isDark = theme === 'dark';
  const { astronomical, header } = data;
  const isBlipi = script === 'blipi';
  const isMeetei = script === 'meetei';
  const isBengali = script === 'bengali';

  return (
    <div
      className={`rounded-2xl border-2 p-3.5 sm:p-4 space-y-3.5 shadow-sm transition-colors ${
        isDark
          ? 'bg-[#151f38] border-amber-600/50 text-slate-100'
          : 'bg-[#fffdf7] border-amber-800/40 text-slate-950'
      }`}
    >
      {/* Header with Title & Ayanamsa */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-800/20 dark:border-amber-500/20 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-950 dark:text-amber-300">
              {isMeetei
                ? '꯳x꯸ ꯕꯨꯛ ꯄꯟꯆꯥꯡ ꯗꯥꯇꯥ (ꯗꯟꯗ-ꯄꯜ-ꯕꯤꯄꯜ)'
                : isBengali
                ? '৩×৮ বুক পঞ্জিকা সারণী (দণ্ড • পল • বিপল — ২৪ খণ্ড)'
                : '3×8 Traditional Book Panchang Table (24 Segments)'}
            </h3>
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-400 block mt-0.5">
              Traditional 8 Rows × 3 Columns Astronomical Grid
            </span>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-[11px] font-mono font-bold text-amber-950 dark:text-amber-200">
          Ayanamsa: {header.ayanamsa?.formattedBengali || "24° 14' 26\""}
        </div>
      </div>

      {/* Key Astronomical Coordinates Box */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
        <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-400 block">
            {isMeetei ? 'ꯅꯨꯃꯤꯠ ꯊꯣꯛꯄ (Sunrise)' : 'সূর্যোদয় (Sunrise)'}
          </span>
          <strong className="text-xs font-mono font-black text-slate-950 dark:text-white block mt-0.5">
            {isMeetei ? astronomical.sunriseMeetei : astronomical.sunriseBengali}
          </strong>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-400 block">
            {isMeetei ? 'ꯅꯨꯃꯤꯠ ꯇꯥꯕ (Sunset)' : 'সূর্যাস্ত (Sunset)'}
          </span>
          <strong className="text-xs font-mono font-black text-slate-950 dark:text-white block mt-0.5">
            {isMeetei ? astronomical.sunsetMeetei : astronomical.sunsetBengali}
          </strong>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-400 block">
            {isMeetei ? 'ꯑꯉꯥꯟꯕ (Day Span)' : 'অঙানবা (Day Duration)'}
          </span>
          <strong className="text-xs font-mono font-black text-slate-950 dark:text-white block mt-0.5">
            {isMeetei ? astronomical.dayDurationMeetei : astronomical.dayDurationBengali}
          </strong>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-400 block">
            {isMeetei ? 'ꯑꯍꯤꯡ (Night Span)' : 'অহিং (Night Duration)'}
          </span>
          <strong className="text-xs font-mono font-black text-slate-950 dark:text-white block mt-0.5">
            {isMeetei ? astronomical.nightDurationMeetei : astronomical.nightDurationBengali}
          </strong>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-700 col-span-2 sm:col-span-2">
          <span className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-400 block">
            {isMeetei ? 'ꯂꯒ꯭ꯅ ꯊꯣꯛꯄ • ꯇꯥꯕ (Lagna Rise & Set)' : 'লগ্ন উদয় ও অস্ত (Lagna Rise & Set)'}
          </span>
          <div className="text-xs font-mono font-black text-slate-950 dark:text-white mt-0.5 flex flex-wrap gap-x-3">
            <span>• {isMeetei ? astronomical.lagnaRise.formattedMeetei : astronomical.lagnaRise.formattedBengali}</span>
            <span>• {isMeetei ? astronomical.lagnaSet.formattedMeetei : astronomical.lagnaSet.formattedBengali}</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         THE 3×8 NUMERICAL GRID (8 Rows x 3 Columns = 24 Cells)
         ───────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border-2 border-amber-800/60 dark:border-amber-500/40 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full table-fixed text-center border-collapse">
          {/* Table Column Headers */}
          <thead>
            <tr className="bg-amber-800 text-white dark:bg-amber-950 text-xs font-black uppercase tracking-wider">
              <th className="w-1/3 py-2 px-2 border-r border-amber-700 dark:border-amber-800 text-center">
                {isMeetei ? 'ꯗꯟꯗ (Danda)' : isBengali ? '১. দণ্ড (Danda)' : 'Col 1: Danda'}
              </th>
              <th className="w-1/3 py-2 px-2 border-r border-amber-700 dark:border-amber-800 text-center">
                {isMeetei ? 'ꯄꯜ (Pal)' : isBengali ? '২. পল (Pal)' : 'Col 2: Pal'}
              </th>
              <th className="w-1/3 py-2 px-2 text-center">
                {isMeetei ? 'ꯕꯤꯄꯜ (Bipal)' : isBengali ? '৩. বিপল (Bipal)' : 'Col 3: Bipal'}
              </th>
            </tr>
          </thead>

          {/* 8 Data Rows */}
          <tbody className="divide-y divide-amber-800/30 dark:divide-slate-800 font-mono text-xs sm:text-sm font-bold text-slate-950 dark:text-slate-100">
            {astronomical.numericalTable.rows.map((row, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={`3x8-row-${idx}`}
                  className={`transition-colors ${
                    isEven
                      ? 'bg-[#fffdf8] dark:bg-slate-900/60'
                      : 'bg-amber-50/50 dark:bg-amber-950/20'
                  } hover:bg-amber-100/60 dark:hover:bg-amber-900/30`}
                >
                  <td className="py-2 px-2 border-r border-amber-800/30 dark:border-slate-800 text-center truncate text-slate-950 dark:text-white font-black text-sm">
                    {renderCell(row.danda, script)}
                  </td>
                  <td className="py-2 px-2 border-r border-amber-800/30 dark:border-slate-800 text-center truncate text-slate-950 dark:text-white font-black text-sm">
                    {renderCell(row.pal, script)}
                  </td>
                  <td className="py-2 px-2 text-center truncate text-slate-950 dark:text-white font-black text-sm">
                    {renderCell(row.bipal, script)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rashi Sanchar Footer Note */}
      <div className="p-2.5 rounded-xl bg-amber-50/90 dark:bg-slate-900/90 border border-amber-300/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-200 leading-relaxed space-y-0.5">
        <div>
          • {isMeetei ? astronomical.rabiPadaStrMeetei : astronomical.rabiPadaStrBengali}
        </div>
        <div>
          • {isMeetei ? astronomical.chandraTransitMeetei : astronomical.chandraTransitBengali}
        </div>
      </div>
    </div>
  );
}
