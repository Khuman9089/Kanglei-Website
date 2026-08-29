'use client';

import React from 'react';

export interface PlanetData {
  name: string;
  sign: string;
  degree: string;
  nakshatra: string;
  pada: number;
  house: number;
  isRetrograde: boolean;
}

interface PlanetaryTableProps {
  planets: PlanetData[];
}

export function PlanetaryTable({ planets }: PlanetaryTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border-2 border-[#b45309]/40 bg-[#0b132b] shadow-md">
      <table className="w-full text-left text-base text-white">
        <thead className="bg-[#1c2541] text-[#fbbf24] font-serif border-b-2 border-[#b45309]">
          <tr>
            <th className="px-4 py-3.5 font-bold text-base">Planet</th>
            <th className="px-4 py-3.5 font-bold text-base">Sign</th>
            <th className="px-4 py-3.5 font-bold text-base">Degree</th>
            <th className="px-4 py-3.5 font-bold text-base">Nakshatra</th>
            <th className="px-4 py-3.5 font-bold text-base">Pada</th>
            <th className="px-4 py-3.5 font-bold text-base">House</th>
            <th className="px-4 py-3.5 font-bold text-base">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#3a506b] font-sans text-sm font-semibold">
          {planets.map((planet, idx) => (
            <tr key={idx} className="hover:bg-[#1c2541] transition-colors">
              <td className={`px-4 py-3.5 font-extrabold ${planet.isRetrograde ? 'text-[#fbbf24]' : 'text-white'}`}>
                {planet.name}
              </td>
              <td className="px-4 py-3.5 font-bold text-amber-200">{planet.sign}</td>
              <td className="px-4 py-3.5 font-mono text-slate-100">{planet.degree}</td>
              <td className="px-4 py-3.5 text-slate-100">{planet.nakshatra}</td>
              <td className="px-4 py-3.5 font-mono">{planet.pada}</td>
              <td className="px-4 py-3.5 font-bold text-[#fbbf24]">House {planet.house}</td>
              <td className="px-4 py-3.5">
                {planet.isRetrograde ? (
                  <span className="inline-flex items-center rounded-lg bg-[#b45309] px-2.5 py-1 text-xs font-black text-white shadow-xs">
                    (R) Retrograde
                  </span>
                ) : (
                  <span className="text-gray-400 font-normal">Direct</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlanetaryTable;
