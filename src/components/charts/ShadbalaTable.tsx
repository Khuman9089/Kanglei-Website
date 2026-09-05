'use client';

import React from 'react';

export interface ShadbalaItem {
  planet: string;
  symbol: string;
  sthanaBala: number;
  digBala: number;
  kalaBala: number;
  cheshthaBala: number;
  naisargikaBala: number;
  drikBala: number;
  totalRupa: number;
  reqRupa: number;
  ratio: number;
  rank: number;
  status: 'STRONG' | 'MODERATE' | 'WEAK';
}

const DEFAULT_SHADBALA_DATA: ShadbalaItem[] = [
  { planet: 'Sun', symbol: 'SU', sthanaBala: 185.4, digBala: 48.2, kalaBala: 260.1, cheshthaBala: 45.0, naisargikaBala: 60.0, drikBala: 12.3, totalRupa: 6.85, reqRupa: 6.5, ratio: 1.05, rank: 3, status: 'STRONG' },
  { planet: 'Moon', symbol: 'MO', sthanaBala: 198.2, digBala: 52.1, kalaBala: 245.0, cheshthaBala: 38.5, naisargikaBala: 51.4, drikBala: 8.4, totalRupa: 6.56, reqRupa: 6.0, ratio: 1.09, rank: 2, status: 'STRONG' },
  { planet: 'Mars', symbol: 'MA', sthanaBala: 142.0, digBala: 32.5, kalaBala: 198.4, cheshthaBala: 42.1, naisargikaBala: 17.1, drikBala: -5.2, totalRupa: 5.45, reqRupa: 5.0, ratio: 1.09, rank: 4, status: 'STRONG' },
  { planet: 'Mercury', symbol: 'ME', sthanaBala: 165.8, digBala: 41.0, kalaBala: 215.3, cheshthaBala: 51.2, naisargikaBala: 25.7, drikBala: 14.1, totalRupa: 6.05, reqRupa: 7.0, ratio: 0.86, rank: 6, status: 'MODERATE' },
  { planet: 'Jupiter', symbol: 'JU', sthanaBala: 210.5, digBala: 55.4, kalaBala: 280.2, cheshthaBala: 58.0, naisargikaBala: 34.3, drikBala: 18.5, totalRupa: 7.62, reqRupa: 6.5, ratio: 1.17, rank: 1, status: 'STRONG' },
  { planet: 'Venus', symbol: 'VE', sthanaBala: 154.2, digBala: 28.6, kalaBala: 205.1, cheshthaBala: 36.4, naisargikaBala: 42.8, drikBala: 2.1, totalRupa: 5.78, reqRupa: 5.5, ratio: 1.05, rank: 5, status: 'STRONG' },
  { planet: 'Saturn', symbol: 'SA', sthanaBala: 130.1, digBala: 22.0, kalaBala: 180.5, cheshthaBala: 29.3, naisargikaBala: 8.5, drikBala: -8.4, totalRupa: 4.87, reqRupa: 5.0, ratio: 0.97, rank: 7, status: 'MODERATE' },
];

export function ShadbalaTable() {
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200/90 shadow-xs p-3 sm:p-4 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div>
          <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900">
            Shadbala Summary (Planetary Strengths)
          </h3>
          <p className="text-[11px] text-slate-500 font-normal">
            Calculated in Virupas (60 Virupas = 1 Rupa) across Sthana, Dig, Kala, Cheshtha, Naisargika & Drik Balas.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          600 Virupas = 10 Rupas
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th className="py-2 px-2">PLANET</th>
              <th className="py-2 px-2 text-right">STHANA BALA</th>
              <th className="py-2 px-2 text-right">DIG BALA</th>
              <th className="py-2 px-2 text-right">KALA BALA</th>
              <th className="py-2 px-2 text-right">CHESTHA</th>
              <th className="py-2 px-2 text-right">NAISARGIKA</th>
              <th className="py-2 px-2 text-right">DRIK BALA</th>
              <th className="py-2 px-2 text-right">TOTAL (RUPA)</th>
              <th className="py-2 px-2 text-center">RATIO</th>
              <th className="py-2 px-2 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold text-[11px] sm:text-xs">
            {DEFAULT_SHADBALA_DATA.map((row, idx) => (
              <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                <td className="py-2 px-2 font-bold text-slate-900">
                  {row.planet} <span className="text-slate-400 font-normal text-[10px]">({row.symbol})</span>
                </td>
                <td className="py-2 px-2 text-right font-mono text-slate-700">{row.sthanaBala.toFixed(1)}</td>
                <td className="py-2 px-2 text-right font-mono text-slate-700">{row.digBala.toFixed(1)}</td>
                <td className="py-2 px-2 text-right font-mono text-slate-700">{row.kalaBala.toFixed(1)}</td>
                <td className="py-2 px-2 text-right font-mono text-slate-700">{row.cheshthaBala.toFixed(1)}</td>
                <td className="py-2 px-2 text-right font-mono text-slate-700">{row.naisargikaBala.toFixed(1)}</td>
                <td className="py-2 px-2 text-right font-mono text-slate-700">{row.drikBala.toFixed(1)}</td>
                <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                  {row.totalRupa.toFixed(2)}
                </td>
                <td className="py-2 px-2 text-center font-mono text-slate-700">{row.ratio.toFixed(2)}</td>
                <td className="py-2 px-2 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      row.status === 'STRONG'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShadbalaTable;
