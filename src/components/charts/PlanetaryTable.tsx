'use client';

import React from 'react';

export interface PlanetData {
  name: string;
  sign: string;
  signLord?: string;
  nakshatra: string;
  nakshatraLord?: string;
  degree: string;
  isRetrograde: boolean;
  house: number;
  state?: string;
  status?: string;
  pada?: number;
}

interface PlanetaryTableProps {
  planets: PlanetData[];
}

// Default Sign Lords mapping
const SIGN_LORDS: Record<string, string> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter',
};

// Default Nakshatra Lords mapping
const NAKSHATRA_LORDS: Record<string, string> = {
  Ashwini: 'Ketu', Bharani: 'Venus', Krittika: 'Sun', Rohini: 'Moon', Mrigashirsha: 'Mars',
  Ardra: 'Rahu', Punarvasu: 'Jupiter', Pushya: 'Saturn', Ashlesha: 'Mercury', Magha: 'Ketu',
  'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun', Hasta: 'Moon', Chitra: 'Mars', Swati: 'Rahu',
  Vishakha: 'Jupiter', Anuradha: 'Saturn', Jyeshtha: 'Mercury', Mula: 'Ketu', 'Purva Ashadha': 'Venus',
  'Uttara Ashadha': 'Sun', Shravana: 'Moon', Dhanishta: 'Mars', Shatabhisha: 'Rahu',
  'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', Revati: 'Mercury',
};

// Sample Planetary States (Bala, Yuva, Kumara, Vridjha, Mrita)
const PLANET_STATES: Record<string, string> = {
  Sun: 'Kumara',
  Moon: 'Bala',
  Mercury: 'Mrita',
  Venus: 'Mrita',
  Mars: 'Bala',
  Jupiter: 'Yuva',
  Saturn: 'Kumara',
  Rahu: 'Kumara',
  Ketu: 'Kumara',
  Neptune: 'Vriddha',
  Uranus: 'Vriddha',
  Pluto: 'Vriddha',
};

// Sample Planetary Status (FRIENDLY, OWND, ENEMY, EXALTED)
const PLANET_STATUS: Record<string, string> = {
  Sun: 'FRIENDLY',
  Moon: 'FRIENDLY',
  Mercury: 'OWNED',
  Venus: 'FRIENDLY',
  Mars: 'ENEMY',
  Jupiter: 'EXALTED',
  Saturn: '—',
  Rahu: 'OWNED',
  Ketu: '—',
  Neptune: '—',
  Uranus: '—',
  Pluto: '—',
};

export function PlanetaryTable({ planets }: PlanetaryTableProps) {
  const allRows: PlanetData[] = [...planets];
  const hasAscendant = allRows.some((p) => p.name.toLowerCase() === 'ascendant');

  if (!hasAscendant && planets.length > 0) {
    allRows.unshift({
      name: 'Ascendant',
      sign: 'Taurus',
      signLord: 'Venus',
      nakshatra: 'Rohini',
      nakshatraLord: 'Moon',
      degree: "12° 51' 48\"",
      isRetrograde: false,
      house: 1,
      state: '—',
      status: '—',
    });
  }

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200/90 shadow-xs p-3 sm:p-4 space-y-2.5">
      <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900">
        Planetary Positions
      </h3>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th className="py-2 px-2">PLANET</th>
              <th className="py-2 px-2">SIGN</th>
              <th className="py-2 px-2">SIGN LORD</th>
              <th className="py-2 px-2">NAKSHATRA</th>
              <th className="py-2 px-2">NAKSH LORD</th>
              <th className="py-2 px-2">DEGREE</th>
              <th className="py-2 px-2">RETRO</th>
              <th className="py-2 px-2">HOUSE</th>
              <th className="py-2 px-2">STATE</th>
              <th className="py-2 px-2">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold text-[11px] sm:text-xs">
            {allRows.map((planet, idx) => {
              const signLord = planet.signLord || SIGN_LORDS[planet.sign] || '—';
              const nakshLord = planet.nakshatraLord || NAKSHATRA_LORDS[planet.nakshatra] || '—';
              const state = planet.state || PLANET_STATES[planet.name] || '—';
              const status = planet.status || PLANET_STATUS[planet.name] || '—';
              const isRetro = planet.isRetrograde ? 'Yes' : 'No';

              return (
                <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                  <td className="py-2 px-2 font-bold text-slate-900 uppercase text-xs sm:text-sm">
                    {planet.name}
                  </td>
                  <td className="py-2 px-2 text-slate-800">{planet.sign}</td>
                  <td className="py-2 px-2 text-slate-800">{signLord}</td>
                  <td className="py-2 px-2 text-slate-800">{planet.nakshatra}</td>
                  <td className="py-2 px-2 text-slate-800">{nakshLord}</td>
                  <td className="py-2 px-2 font-mono text-slate-900">{planet.degree}</td>
                  <td className="py-2 px-2 text-slate-800">{isRetro}</td>
                  <td className="py-2 px-2 font-mono text-slate-900 text-center">{planet.house}</td>
                  <td className="py-2 px-2 text-slate-800">{state}</td>
                  <td className="py-2 px-2 font-bold text-slate-900 uppercase tracking-tight text-[10px] sm:text-xs">
                    {status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlanetaryTable;
