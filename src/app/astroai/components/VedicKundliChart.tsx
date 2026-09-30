'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, ChevronRight, Layers, Table, Grid } from 'lucide-react';

export interface VedicPlanet {
  id: string;
  name: string;
  glyph: string;
  signName: string;
  signIndex: number;
  degreeInSign: number;
  nakshatra: string;
  nakshatraLord?: string;
  pada: number;
  houseNumber: number;
  isRetrograde?: boolean;
  dignity?: string;
  element?: string;
}

export interface VedicBhava {
  houseNumber: number;
  signName: string;
  signIndex: number;
  cuspDegree: number;
  lord: string;
}

export interface KundliData {
  ascendantSign: string;
  ascendantSignIndex: number;
  ascendantDegree: number;
  ascendantNakshatra: string;
  chartRuler: string;
  dominantElement: string;
  ayanamsaName?: string;
  ayanamsaValue?: number;
  planets: VedicPlanet[];
  bhavas: VedicBhava[];
}

interface VedicKundliChartProps {
  kundli: KundliData;
}

const BHAVA_NAMES = [
  'Tanu (Self, Health)',
  'Dhana (Wealth, Speech)',
  'Sahaja (Courage, Siblings)',
  'Bandhu (Home, Mother)',
  'Putra (Creativity, Children)',
  'Ari (Challenges, Service)',
  'Yuvati (Partnership, Spouse)',
  'Randhra (Transformation, Longevity)',
  'Dharma (Fortune, Wisdom)',
  'Karma (Profession, Status)',
  'Labha (Gains, Aspirations)',
  'Vyaya (Expenses, Liberation)'
];

const PLANET_SHORT: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke'
};

export function VedicKundliChart({ kundli }: VedicKundliChartProps) {
  const [chartStyle, setChartStyle] = useState<'north' | 'table'>('north');

  const ascSignIdx = kundli.ascendantSignIndex || 1;

  // Group planets by house number (1-12)
  const planetsByHouse: Record<number, VedicPlanet[]> = {};
  for (let i = 1; i <= 12; i++) {
    planetsByHouse[i] = [];
  }
  kundli.planets.forEach((p) => {
    const h = p.houseNumber || 1;
    if (planetsByHouse[h]) {
      planetsByHouse[h].push(p);
    }
  });

  // Calculate zodiac sign number in each house for North Indian chart
  // House 1 has ascSignIdx, House 2 has (ascSignIdx % 12) + 1, etc.
  const getSignForHouse = (h: number): number => {
    return ((ascSignIdx + h - 2) % 12) + 1;
  };

  const formatDegMin = (deg: number) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    return `${d}° ${m < 10 ? '0' + m : m}'`;
  };

  return (
    <div className="space-y-4">
      {/* Top Lagna Summary Banner */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1E1B4B] to-[#311042] rounded-3xl p-5 text-white border border-indigo-500/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Vedic Lagna Matrix • {kundli.ayanamsaName || 'Lahiri'} Ayanamsha
            </span>
            <h3 className="text-xl font-black mt-1 text-white">
              {kundli.ascendantSign} Ascendant{' '}
              <span className="text-sm font-semibold text-indigo-300">
                ({formatDegMin(kundli.ascendantDegree % 30)})
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Governed by <strong className="text-amber-200">{kundli.chartRuler}</strong> • Nakshatra:{' '}
              <strong className="text-purple-200">{kundli.ascendantNakshatra}</strong>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setChartStyle('north')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                chartStyle === 'north'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>North Chart</span>
            </button>
            <button
              onClick={() => setChartStyle('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                chartStyle === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Planets Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Style: North Indian Diamond Kundli */}
      {chartStyle === 'north' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Lagna Kundli (D-1 Chart)
              </h4>
            </div>
            <span className="text-[10px] font-medium text-slate-400">
              Numbers = Signs (1=Aries ... 12=Pisces)
            </span>
          </div>

          {/* SVG Diamond Kundli Chart */}
          <div className="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto aspect-square bg-[#FBFBFE] rounded-2xl border-2 border-indigo-900/40 p-1 shadow-inner select-none">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full text-slate-800"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Border */}
              <rect x="2" y="2" width="396" height="396" fill="none" stroke="#312E81" strokeWidth="2.5" />

              {/* Main Diagonals */}
              <line x1="2" y1="2" x2="398" y2="398" stroke="#4338CA" strokeWidth="2" />
              <line x1="398" y1="2" x2="2" y2="398" stroke="#4338CA" strokeWidth="2" />

              {/* Diamond Rhombus connecting midpoints */}
              <polygon points="200,2 398,200 200,398 2,200" fill="none" stroke="#4338CA" strokeWidth="2" />

              {/* House 1 (Top Center Diamond) */}
              <text x="200" y="85" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(1)}
              </text>
              <text x="200" y="115" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[1]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 2 (Top Left Triangle) */}
              <text x="110" y="45" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(2)}
              </text>
              <text x="110" y="75" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[2]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 3 (Far Left Triangle) */}
              <text x="45" y="110" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(3)}
              </text>
              <text x="50" y="140" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[3]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 4 (Left Diamond) */}
              <text x="115" y="200" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(4)}
              </text>
              <text x="115" y="225" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[4]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 5 (Lower Left Triangle) */}
              <text x="50" y="290" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(5)}
              </text>
              <text x="50" y="315" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[5]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 6 (Bottom Left Triangle) */}
              <text x="110" y="355" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(6)}
              </text>
              <text x="110" y="375" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[6]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 7 (Bottom Center Diamond) */}
              <text x="200" y="325" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(7)}
              </text>
              <text x="200" y="295" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[7]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 8 (Bottom Right Triangle) */}
              <text x="290" y="355" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(8)}
              </text>
              <text x="290" y="375" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[8]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 9 (Lower Right Triangle) */}
              <text x="350" y="290" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(9)}
              </text>
              <text x="350" y="315" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[9]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 10 (Right Diamond) */}
              <text x="285" y="200" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(10)}
              </text>
              <text x="285" y="225" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[10]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 11 (Far Right Triangle) */}
              <text x="350" y="110" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(11)}
              </text>
              <text x="350" y="140" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[11]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>

              {/* House 12 (Top Right Triangle) */}
              <text x="290" y="45" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366F1">
                {getSignForHouse(12)}
              </text>
              <text x="290" y="75" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E1B4B">
                {planetsByHouse[12]?.map((p) => PLANET_SHORT[p.name] || p.name.slice(0, 2)).join(' ') || ''}
              </text>
            </svg>
          </div>

          {/* Quick Planet Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-2">
            {kundli.planets.map((p) => (
              <div
                key={p.name}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center text-xs"
              >
                <div className="flex items-center justify-center gap-1 font-bold text-slate-800">
                  <span className="text-indigo-600">{p.glyph || '☉'}</span>
                  <span>{p.name}</span>
                  {p.isRetrograde && <span className="text-[9px] text-rose-600 font-black">Rx</span>}
                </div>
                <span className="text-[10px] text-slate-500 block truncate">
                  {p.signName.slice(0, 3)} {formatDegMin(p.degreeInSign)}
                </span>
                <span className="text-[9px] text-indigo-500 font-bold block">
                  H{p.houseNumber} • {p.nakshatra.slice(0, 4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Planetary Matrix Full Table */}
      {chartStyle === 'table' && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3 overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Planetary Longitudes &amp; Dignities
            </h4>
            <span className="text-[10px] font-bold text-indigo-600">
              {kundli.planets.length} Placements
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[9px] font-bold tracking-wider">
                  <th className="py-2 px-1">Planet</th>
                  <th className="py-2 px-1">Sign</th>
                  <th className="py-2 px-1">Degree</th>
                  <th className="py-2 px-1">House</th>
                  <th className="py-2 px-1">Nakshatra</th>
                  <th className="py-2 px-1">Pada</th>
                  <th className="py-2 px-1">Dignity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {kundli.planets.map((p) => (
                  <tr key={p.name} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-1 font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-indigo-600 text-sm">{p.glyph || '☉'}</span>
                      <span>{p.name}</span>
                      {p.isRetrograde && (
                        <span className="px-1 py-0.2 rounded bg-rose-50 text-rose-600 font-extrabold text-[8px] border border-rose-200">
                          Rx
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-1 font-medium">{p.signName}</td>
                    <td className="py-2.5 px-1 font-mono text-[11px] text-slate-600">
                      {formatDegMin(p.degreeInSign)}
                    </td>
                    <td className="py-2.5 px-1 font-bold text-indigo-600">House {p.houseNumber}</td>
                    <td className="py-2.5 px-1">{p.nakshatra}</td>
                    <td className="py-2.5 px-1 font-bold text-slate-600">{p.pada}</td>
                    <td className="py-2.5 px-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          p.dignity === 'Exalted' || p.dignity === 'Own Sign'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.dignity === 'Debilitated'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.dignity || 'Neutral'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 12 Bhavas (Houses) Accordion/Summary */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
          <span>The 12 Bhavas (Houses of Life)</span>
          <span className="text-[10px] text-slate-400 font-medium">Vedic Cusps</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {kundli.bhavas && kundli.bhavas.length > 0 ? (
            kundli.bhavas.map((b) => (
              <div
                key={b.houseNumber}
                className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <span className="font-extrabold text-slate-900 block text-xs">
                    House {b.houseNumber}: {BHAVA_NAMES[b.houseNumber - 1]}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Sign: <strong className="text-slate-700">{b.signName}</strong> • Lord:{' '}
                    <strong className="text-indigo-600">{b.lord}</strong>
                  </span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-slate-400">
                  {formatDegMin(b.cuspDegree % 30)}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-4 text-xs text-slate-400">
              Calculating Bhavas...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
