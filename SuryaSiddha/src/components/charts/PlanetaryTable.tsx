import React from 'react';
import { PlanetPosition } from '../../types/astronomy';
import { DignityBadge } from '../common/Badge';

interface PlanetaryTableProps {
  planets: Record<string, PlanetPosition>;
}

export const PlanetaryTable: React.FC<PlanetaryTableProps> = ({ planets }) => {
  const planetList = Object.values(planets);

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-amber-200 text-slate-500 font-semibold tracking-wider uppercase text-[11px] bg-amber-50/70">
            <th className="py-3 px-3">Graha (Planet)</th>
            <th className="py-3 px-2">Longitude (DMS)</th>
            <th className="py-3 px-2">Rashi (Sign)</th>
            <th className="py-3 px-2 text-center">House</th>
            <th className="py-3 px-2">Nakshatra & Pada</th>
            <th className="py-3 px-2">Dignity (Avastha)</th>
            <th className="py-3 px-2 text-center">Status</th>
            <th className="py-3 px-2 text-center">Drishti (Aspects)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-100 font-sans">
          {planetList.map((p) => {
            return (
              <tr
                key={p.name}
                className="hover:bg-amber-50/50 transition-colors group"
              >
                {/* Planet Name & Glyph */}
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-base font-bold flex-shrink-0"
                      style={{ color: p.color }}
                    >
                      {p.glyph}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
                        {p.name}
                        {p.isRetrograde && (
                          <span className="text-[10px] text-amber-900 font-mono bg-amber-100 px-1 rounded border border-amber-300">
                            R
                          </span>
                        )}
                        {p.isCombust && (
                          <span className="text-[10px] text-rose-900 font-mono bg-rose-100 px-1 rounded border border-rose-300">
                            Combust
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {p.sanskritName}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Longitude */}
                <td className="py-2.5 px-2 font-mono text-amber-900 font-semibold">
                  {String(p.dms.deg).padStart(2, '0')}°{' '}
                  {String(p.dms.min).padStart(2, '0')}'{' '}
                  {String(p.dms.sec).padStart(2, '0')}"
                </td>

                {/* Rashi */}
                <td className="py-2.5 px-2">
                  <div className="font-semibold text-slate-800">
                    {p.rashiName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {p.rashiSanskrit}
                  </div>
                </td>

                {/* House */}
                <td className="py-2.5 px-2 text-center font-mono font-bold text-amber-700">
                  H{p.house}
                </td>

                {/* Nakshatra */}
                <td className="py-2.5 px-2">
                  <div className="font-medium text-slate-800">
                    {p.nakshatra.name}{' '}
                    <span className="text-amber-700 font-mono text-[11px] font-bold">
                      (P{p.nakshatra.pada})
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Lord: {p.nakshatra.lord}
                  </div>
                </td>

                {/* Dignity */}
                <td className="py-2.5 px-2">
                  <DignityBadge dignity={p.dignity} />
                </td>

                {/* Status */}
                <td className="py-2.5 px-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {p.isRetrograde ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 font-medium">
                        Vakri
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                        Direct
                      </span>
                    )}
                  </div>
                </td>

                {/* Aspects */}
                <td className="py-2.5 px-2 text-center font-mono text-slate-600 text-[11px]">
                  {p.aspects.length > 0
                    ? p.aspects.map((h) => `H${h}`).join(', ')
                    : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
