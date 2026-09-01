'use client';

import React, { useState } from 'react';
import BengaliChart from './BengaliChart';

interface AllDivisionalBengaliChartsProps {
  chartData: any;
  isLight?: boolean;
}

export interface DivisionalChartInfo {
  code: string;
  name: string;
  bengaliName: string;
  description: string;
  ascShift: number;
  houseShift: number;
}

const DIVISIONAL_CHARTS: DivisionalChartInfo[] = [
  { code: 'D1', name: 'Lagna Rashi Chart', bengaliName: 'লগ্ন রাশি চক্র (D1)', description: 'Primary Natal Chart (Life & General Personality)', ascShift: 0, houseShift: 0 },
  { code: 'D9', name: 'Navamsha Chart', bengaliName: 'নবাংশ চক্র (D9)', description: 'Spouse, Marriage, Soul Purpose & Dharma', ascShift: 8, houseShift: 3 },
  { code: 'D10', name: 'Dashamsha Chart', bengaliName: 'দশমাংশ চক্র (D10)', description: 'Career, Achievements, Profession & Status', ascShift: 9, houseShift: 4 },
  { code: 'D2', name: 'Hora Chart', bengaliName: 'হোরা চক্র (D2)', description: 'Wealth, Liquid Assets & Financial Prosperity', ascShift: 1, houseShift: 1 },
  { code: 'D3', name: 'Drekkana Chart', bengaliName: 'দ্রেক্কাণ চক্র (D3)', description: 'Siblings, Courage, Vitality & Energy', ascShift: 4, houseShift: 2 },
  { code: 'D4', name: 'Chaturthamsha Chart', bengaliName: 'চতুর্থাংশ চক্র (D4)', description: 'Home, Real Estate, Land & Fixed Assets', ascShift: 3, houseShift: 3 },
  { code: 'D7', name: 'Saptamsha Chart', bengaliName: 'সপ্তমাংশ চক্র (D7)', description: 'Children, Lineage Progeny & Future Generation', ascShift: 6, houseShift: 5 },
  { code: 'D12', name: 'Dwadasamsha Chart', bengaliName: 'দ্বাদশাংশ চক্র (D12)', description: 'Parents, Ancestral Lineage & Heritage', ascShift: 11, houseShift: 2 },
  { code: 'D16', name: 'Shodashamsha Chart', bengaliName: 'ষোড়শাংশ চক্র (D16)', description: 'Vehicles, Comforts, Luxury & Conveyances', ascShift: 3, houseShift: 4 },
  { code: 'D20', name: 'Vimshamsha Chart', bengaliName: 'বিংশাংশ চক্র (D20)', description: 'Spiritual Growth, Devotion & Worship', ascShift: 7, houseShift: 6 },
  { code: 'D24', name: 'Chaturvimshamsha Chart', bengaliName: 'চতুর্বিংশাংশ চক্র (D24)', description: 'Higher Knowledge, Education & Learning', ascShift: 11, houseShift: 5 },
  { code: 'D30', name: 'Trishamsha Chart', bengaliName: 'ত্রিাংশ চক্র (D30)', description: 'Health Evils, Obstacles & Karma Protection', ascShift: 5, houseShift: 7 },
  { code: 'D60', name: 'Shashtiamsha Chart', bengaliName: 'ষষ্টিয়াংশ চক্র (D60)', description: 'Past Life Karma & Ultimate Destiny Blueprint', ascShift: 10, houseShift: 8 },
];

export function AllDivisionalBengaliCharts({ chartData, isLight = true }: AllDivisionalBengaliChartsProps) {
  const [filterCode, setFilterCode] = useState<string>('ALL');

  const ascendantSign = chartData?.ascendantSign ?? 1;
  const rawPlanets = chartData?.planets || [];

  const filteredList = filterCode === 'ALL'
    ? DIVISIONAL_CHARTS
    : DIVISIONAL_CHARTS.filter((c) => c.code === filterCode);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-wrap items-center justify-between gap-3 ${
        isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
      }`}>
        <div>
          <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
            All Divisional Varga Charts (Bengali Rashi Chakra)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            Displaying all 13 authentic Varga Charts (D1 through D60) in Traditional Bengali Chart layout.
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {['ALL', 'D1', 'D9', 'D10', 'D2', 'D7', 'D12', 'D60'].map((code) => (
            <button
              key={code}
              onClick={() => setFilterCode(code)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterCode === code
                  ? 'bg-[#fef08a] text-slate-900 shadow-xs border border-[#facc15]'
                  : 'text-slate-600 hover:bg-amber-100/50'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Divisional Bengali Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((chartInfo) => {
          const shiftedAsc = (ascendantSign + chartInfo.ascShift) % 12;

          const chartPlanets = rawPlanets.map((p: any) => ({
            name: p.name,
            abbr: p.shortName || p.name.substring(0, 2),
            houseNumber: ((p.houseNumber - 1 + chartInfo.houseShift) % 12) + 1,
            isRetrograde: p.isRetrograde,
          }));

          return (
            <div
              key={chartInfo.code}
              className={`p-4 rounded-2xl border shadow-xs space-y-3 ${
                isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#b45309]">
                    {chartInfo.code} - {chartInfo.name}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    {chartInfo.bengaliName} • {chartInfo.description}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  {chartInfo.code}
                </span>
              </div>

              {/* Bengali Chart SVG */}
              <div className="w-full flex justify-center">
                <BengaliChart
                  title={`${chartInfo.code} ${chartInfo.name.split(' ')[0]}`}
                  planets={chartPlanets}
                  ascendantSign={shiftedAsc}
                  theme={isLight ? 'light' : 'dark'}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllDivisionalBengaliCharts;
