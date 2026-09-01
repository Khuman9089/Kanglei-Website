'use client';

import React from 'react';

export interface BhavaItem {
  house: number;
  houseName: string;
  sign: string;
  lord: string;
  adhipatiBala: number;
  digBala: number;
  drikBala: number;
  totalRupa: number;
  rank: number;
  strength: 'POWERFUL' | 'MODERATE' | 'NEUTRAL';
}

const DEFAULT_BHAVA_DATA: BhavaItem[] = [
  { house: 1, houseName: 'Lagna (Tanu)', sign: 'Taurus', lord: 'Venus', adhipatiBala: 154.2, digBala: 60.0, drikBala: 12.5, totalRupa: 8.78, rank: 1, strength: 'POWERFUL' },
  { house: 2, houseName: 'Dhana (Wealth)', sign: 'Gemini', lord: 'Mercury', adhipatiBala: 165.8, digBala: 40.0, drikBala: 8.2, totalRupa: 7.40, rank: 3, strength: 'POWERFUL' },
  { house: 3, houseName: 'Sahaja (Siblings)', sign: 'Cancer', lord: 'Moon', adhipatiBala: 198.2, digBala: 30.0, drikBala: 5.1, totalRupa: 6.82, rank: 6, strength: 'MODERATE' },
  { house: 4, houseName: 'Sukha (Mother & Home)', sign: 'Leo', lord: 'Sun', adhipatiBala: 185.4, digBala: 50.0, drikBala: 14.8, totalRupa: 7.95, rank: 2, strength: 'POWERFUL' },
  { house: 5, houseName: 'Putra (Children & Intelligence)', sign: 'Virgo', lord: 'Mercury', adhipatiBala: 165.8, digBala: 35.0, drikBala: 6.4, totalRupa: 6.95, rank: 5, strength: 'MODERATE' },
  { house: 6, houseName: 'Ari (Health & Enemies)', sign: 'Libra', lord: 'Venus', adhipatiBala: 154.2, digBala: 20.0, drikBala: -4.2, totalRupa: 5.80, rank: 10, strength: 'NEUTRAL' },
  { house: 7, houseName: 'Yuvati (Spouse & Partners)', sign: 'Scorpio', lord: 'Mars', adhipatiBala: 142.0, digBala: 45.0, drikBala: 10.2, totalRupa: 7.12, rank: 4, strength: 'POWERFUL' },
  { house: 8, houseName: 'Randhra (Longevity)', sign: 'Sagittarius', lord: 'Jupiter', adhipatiBala: 210.5, digBala: 15.0, drikBala: -8.1, totalRupa: 6.20, rank: 9, strength: 'MODERATE' },
  { house: 9, houseName: 'Dharma (Fortune & Higher Wisdom)', sign: 'Capricorn', lord: 'Saturn', adhipatiBala: 130.1, digBala: 55.0, drikBala: 16.5, totalRupa: 6.78, rank: 7, strength: 'MODERATE' },
  { house: 10, houseName: 'Karma (Career & Profession)', sign: 'Aquarius', lord: 'Saturn', adhipatiBala: 130.1, digBala: 60.0, drikBala: 22.4, totalRupa: 7.08, rank: 8, strength: 'POWERFUL' },
  { house: 11, houseName: 'Labha (Gains & Income)', sign: 'Pisces', lord: 'Jupiter', adhipatiBala: 210.5, digBala: 25.0, drikBala: 4.8, totalRupa: 6.50, rank: 11, strength: 'MODERATE' },
  { house: 12, houseName: 'Vyaya (Losses & Moksha)', sign: 'Aries', lord: 'Mars', adhipatiBala: 142.0, digBala: 10.0, drikBala: -12.0, totalRupa: 4.90, rank: 12, strength: 'NEUTRAL' },
];

export function BhavaBalaTable() {
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900">
            Bhava Bala Summary (12 House Strengths)
          </h3>
          <p className="text-xs text-slate-500 font-normal">
            Evaluates the net functional capability & potency of all 12 Houses in Rupas.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#fef08a] text-slate-900 border border-[#facc15]">
          12 Houses Evaluated
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3.5">HOUSE</th>
              <th className="py-3 px-3.5">SIGN</th>
              <th className="py-3 px-3.5">HOUSE LORD</th>
              <th className="py-3 px-3.5 text-right">ADHIPATI BALA</th>
              <th className="py-3 px-3.5 text-right">BHAVA DIG BALA</th>
              <th className="py-3 px-3.5 text-right">BHAVA DRIK BALA</th>
              <th className="py-3 px-3.5 text-right">TOTAL (RUPAS)</th>
              <th className="py-3 px-3.5 text-center">RANK</th>
              <th className="py-3 px-3.5 text-center">STRENGTH</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
            {DEFAULT_BHAVA_DATA.map((row, idx) => (
              <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                <td className="py-3 px-3.5 font-bold text-slate-900 text-sm sm:text-base">
                  House {row.house} <span className="font-medium text-slate-500 text-xs">({row.houseName})</span>
                </td>
                <td className="py-3 px-3.5 text-slate-800 text-sm">{row.sign}</td>
                <td className="py-3 px-3.5 text-slate-800 font-semibold text-sm">{row.lord}</td>
                <td className="py-3 px-3.5 text-right font-mono text-slate-800 text-sm">{row.adhipatiBala.toFixed(1)}</td>
                <td className="py-3 px-3.5 text-right font-mono text-slate-800 text-sm">{row.digBala.toFixed(1)}</td>
                <td className="py-3 px-3.5 text-right font-mono text-slate-800 text-sm">{row.drikBala.toFixed(1)}</td>
                <td className="py-3 px-3.5 text-right font-bold text-slate-900 font-mono text-sm">{row.totalRupa.toFixed(2)}</td>
                <td className="py-3 px-3.5 text-center font-bold text-amber-800 text-sm">#{row.rank}</td>
                <td className="py-3 px-3.5 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    row.strength === 'POWERFUL'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {row.strength}
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

export default BhavaBalaTable;
