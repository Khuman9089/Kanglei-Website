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
    <div className="w-full rounded-2xl bg-white border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-3">
      <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900">
        Planetary Positions
      </h3>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3.5">PLANET</th>
              <th className="py-3 px-3.5">SIGN</th>
              <th className="py-3 px-3.5">SIGN LORD</th>
              <th className="py-3 px-3.5">NAKSHATRA</th>
              <th className="py-3 px-3.5">NAKSH LORD</th>
              <th className="py-3 px-3.5">DEGREE</th>
              <th className="py-3 px-3.5">RETRO</th>
              <th className="py-3 px-3.5">HOUSE</th>
              <th className="py-3 px-3.5">STATE</th>
              <th className="py-3 px-3.5">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
            {allRows.map((planet, idx) => {
              const signLord = planet.signLord || SIGN_LORDS[planet.sign] || '—';
              const nakshLord = planet.nakshatraLord || NAKSHATRA_LORDS[planet.nakshatra] || '—';
              const state = planet.state || PLANET_STATES[planet.name] || '—';
              const status = planet.status || PLANET_STATUS[planet.name] || '—';
              const isRetro = planet.isRetrograde ? 'Yes' : 'No';

              return (
                <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900 uppercase text-sm sm:text-base">
                    {planet.name}
                  </td>
                  <td className="py-3 px-3.5 text-slate-800 text-sm">{planet.sign}</td>
                  <td className="py-3 px-3.5 text-slate-800 text-sm">{signLord}</td>
                  <td className="py-3 px-3.5 text-slate-800 text-sm">{planet.nakshatra}</td>
                  <td className="py-3 px-3.5 text-slate-800 text-sm">{nakshLord}</td>
                  <td className="py-3 px-3.5 font-mono text-slate-900 text-sm">{planet.degree}</td>
                  <td className="py-3 px-3.5 text-slate-800 text-sm">{isRetro}</td>
                  <td className="py-3 px-3.5 font-mono text-slate-900 text-sm">{planet.house}</td>
                  <td className="py-3 px-3.5 text-slate-800 text-sm">{state}</td>
                  <td className="py-3 px-3.5 font-bold text-slate-900 uppercase tracking-tight text-xs sm:text-sm">
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
