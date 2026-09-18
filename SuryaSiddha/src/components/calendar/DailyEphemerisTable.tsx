import React from 'react';
import { PlanetPosition } from '../../types/astronomy';
import { Sparkles } from 'lucide-react';

interface DailyEphemerisTableProps {
  planets: Record<string, PlanetPosition>;
  ayanamsaStr: string;
}

export const DailyEphemerisTable: React.FC<DailyEphemerisTableProps> = ({
  planets,
  ayanamsaStr,
}) => {
  // Only classical Navagrahas + Ascendant or all
  const navagrahaOrder = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu', 'Ascendant'];
  const planetList = navagrahaOrder
    .map((name) => planets[name])
    .filter(Boolean) as PlanetPosition[];

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h3 className="font-serif font-bold text-base text-slate-900">
            Daily Planetary Ephemeris at Sunrise (दैनिक ग्रह स्थिति)
          </h3>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Nirayana (Lahiri Ayanamsa: <span className="font-bold text-amber-900">{ayanamsaStr}</span>)
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-amber-200 text-slate-500 font-bold uppercase text-[11px] bg-amber-50/70">
              <th className="py-2.5 px-3">Graha (Planet)</th>
              <th className="py-2.5 px-2">Sidereal Sign (Rashi)</th>
              <th className="py-2.5 px-2">Degree / Min / Sec</th>
              <th className="py-2.5 px-2">Nakshatra & Pada</th>
              <th className="py-2.5 px-2 text-center">Motion</th>
              <th className="py-2.5 px-2 text-center">Combust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {planetList.map((p) => {
              return (
                <tr key={p.name} className="hover:bg-amber-50/50 transition-colors">
                  {/* Graha */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold flex-shrink-0" style={{ color: p.color }}>
                        {p.glyph}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {p.sanskritName}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rashi */}
                  <td className="py-2.5 px-2">
                    <div className="font-semibold text-slate-900">
                      {p.rashiName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {p.rashiSanskrit}
                    </div>
                  </td>

                  {/* Degree DMS */}
                  <td className="py-2.5 px-2 font-mono font-bold text-amber-950">
                    {String(p.dms.deg).padStart(2, '0')}°{' '}
                    {String(p.dms.min).padStart(2, '0')}'{' '}
                    {String(p.dms.sec).padStart(2, '0')}"
                  </td>

                  {/* Nakshatra */}
                  <td className="py-2.5 px-2">
                    <div className="font-medium text-slate-800">
                      {p.nakshatra.name}{' '}
                      <span className="text-amber-700 font-bold font-mono">
                        (P{p.nakshatra.pada})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Lord: {p.nakshatra.lord}
                    </div>
                  </td>

                  {/* Motion */}
                  <td className="py-2.5 px-2 text-center">
                    {p.isRetrograde ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        Vakri [R]
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                        Margi (Direct)
                      </span>
                    )}
                  </td>

                  {/* Combust */}
                  <td className="py-2.5 px-2 text-center">
                    {p.isCombust ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                        Combust 🔥
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
