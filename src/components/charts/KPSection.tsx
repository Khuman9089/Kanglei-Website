'use client';

import React, { useState } from 'react';
import BengaliChart from './BengaliChart';
import NorthIndianChart from './NorthIndianChart';

export interface KPPlanetRow {
  planet: string;
  cusp: number;
  sign: string;
  signLord: string;
  star: string;
  starLord: string;
  subLord: string;
}

export interface KPCuspRow {
  cusp: number;
  degree: string;
  sign: string;
  signLord: string;
  star: string;
  starLord: string;
  subLord: string;
  subSubLord: string;
}

interface KPSectionProps {
  chartData: any;
  isLight?: boolean;
}

const DEFAULT_KP_PLANETS: KPPlanetRow[] = [
  { planet: 'Sun', cusp: 3, sign: 'Cancer', signLord: 'Mo', star: 'Ashlesha', starLord: 'Me', subLord: 'Me' },
  { planet: 'Moon', cusp: 11, sign: 'Aries', signLord: 'Ma', star: 'Ashwini', starLord: 'Ke', subLord: 'Ve' },
  { planet: 'Mars', cusp: 1, sign: 'Gemini', signLord: 'Me', star: 'Mrigashirsha', starLord: 'Ma', subLord: 'Me' },
  { planet: 'Mercury', cusp: 2, sign: 'Gemini', signLord: 'Me', star: 'Punarvasu', starLord: 'Ju', subLord: 'Ju' },
  { planet: 'Jupiter', cusp: 3, sign: 'Cancer', signLord: 'Mo', star: 'Pushya', starLord: 'Sa', subLord: 'Ra' },
  { planet: 'Venus', cusp: 5, sign: 'Virgo', signLord: 'Me', star: 'Uttara Phalguni', starLord: 'Su', subLord: 'Ma' },
  { planet: 'Saturn', cusp: 11, sign: 'Pisces', signLord: 'Ju', star: 'Revati', starLord: 'Me', subLord: 'Sa' },
  { planet: 'Rahu', cusp: 10, sign: 'Aquarius', signLord: 'Sa', star: 'Dhanishta', starLord: 'Ma', subLord: 'Mo' },
  { planet: 'Ketu', cusp: 4, sign: 'Leo', signLord: 'Su', star: 'Magha', starLord: 'Ke', subLord: 'Ke' },
];

const DEFAULT_KP_CUSPS: KPCuspRow[] = [
  { cusp: 1, degree: "12° 51' 48\"", sign: 'Taurus', signLord: 'Venus', star: 'Rohini', starLord: 'Moon', subLord: 'Mercury', subSubLord: 'Venus' },
  { cusp: 2, degree: "08° 14' 22\"", sign: 'Gemini', signLord: 'Mercury', star: 'Ardra', starLord: 'Rahu', subLord: 'Saturn', subSubLord: 'Jupiter' },
  { cusp: 3, degree: "03° 40' 11\"", sign: 'Cancer', signLord: 'Moon', star: 'Pushya', starLord: 'Saturn', subLord: 'Venus', subSubLord: 'Mars' },
  { cusp: 4, degree: "29° 18' 05\"", sign: 'Cancer', signLord: 'Moon', star: 'Ashlesha', starLord: 'Mercury', subLord: 'Saturn', subSubLord: 'Ketu' },
  { cusp: 5, degree: "28° 42' 19\"", sign: 'Leo', signLord: 'Sun', star: 'Uttara Phalguni', starLord: 'Sun', subLord: 'Mars', subSubLord: 'Moon' },
  { cusp: 6, degree: "01° 05' 30\"", sign: 'Libra', signLord: 'Venus', star: 'Chitra', starLord: 'Mars', subLord: 'Mercury', subSubLord: 'Rahu' },
  { cusp: 7, degree: "12° 51' 48\"", sign: 'Scorpio', signLord: 'Mars', star: 'Anuradha', starLord: 'Saturn', subLord: 'Rahu', subSubLord: 'Venus' },
  { cusp: 8, degree: "08° 14' 22\"", sign: 'Sagittarius', signLord: 'Jupiter', star: 'Mula', starLord: 'Ketu', subLord: 'Jupiter', subSubLord: 'Sun' },
  { cusp: 9, degree: "03° 40' 11\"", sign: 'Capricorn', signLord: 'Saturn', star: 'Uttara Ashadha', starLord: 'Sun', subLord: 'Saturn', subSubLord: 'Mercury' },
  { cusp: 10, degree: "29° 18' 05\"", sign: 'Capricorn', signLord: 'Saturn', star: 'Dhanishta', starLord: 'Mars', subLord: 'Ketu', subSubLord: 'Jupiter' },
  { cusp: 11, degree: "28° 42' 19\"", sign: 'Aquarius', signLord: 'Saturn', star: 'Purva Bhadrapada', starLord: 'Jupiter', subLord: 'Venus', subSubLord: 'Mars' },
  { cusp: 12, degree: "01° 05' 30\"", sign: 'Aries', signLord: 'Mars', star: 'Ashwini', starLord: 'Ketu', subLord: 'Venus', subSubLord: 'Sun' },
];

export function KPSection({ chartData, isLight = true }: KPSectionProps) {
  const [bhavStyle, setBhavStyle] = useState<'bengali' | 'north'>('bengali');

  const ascendantSign = chartData?.ascendantSign ?? 1;
  const planets = chartData?.planets || [];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ROW 1: TWO SIDE-BY-SIDE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        
        {/* CARD 1: BHAV CHALIT CHART (BENGALI STYLE DEFAULT) */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs space-y-3 ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">
              Bhav Chalit Chart
            </h3>

            {/* Toggle Pills: Bengali vs North */}
            <div className="flex items-center gap-1 bg-amber-100/60 p-0.5 rounded-full border border-amber-200 text-xs">
              <button
                onClick={() => setBhavStyle('bengali')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  bhavStyle === 'bengali'
                    ? 'bg-[#fef08a] text-slate-900 shadow-xs border border-[#facc15]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bengali
              </button>
              <button
                onClick={() => setBhavStyle('north')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  bhavStyle === 'north'
                    ? 'bg-[#fef08a] text-slate-900 shadow-xs border border-[#facc15]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                North
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="w-full flex justify-center pt-1">
            {bhavStyle === 'bengali' ? (
              <BengaliChart
                title="Bhav Chalit Chart"
                planets={planets.map((p: any) => ({
                  name: p.name,
                  abbr: p.shortName || p.name.substring(0, 2),
                  houseNumber: p.houseNumber,
                  isRetrograde: p.isRetrograde,
                }))}
                ascendantSign={ascendantSign}
                theme={isLight ? 'light' : 'dark'}
              />
            ) : (
              <div className="max-w-[320px] w-full">
                <NorthIndianChart
                  planets={planets.map((p: any) => ({
                    name: p.name,
                    abbr: p.shortName || p.name.substring(0, 2),
                    houseNumber: p.houseNumber,
                    isRetrograde: p.isRetrograde,
                  }))}
                  signs={chartData?.houses?.map((h: any) => h.signIndex) || []}
                  ascendantSign={ascendantSign}
                />
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: RULING PLANETS */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs space-y-4 ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
        }`}>
          <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 pb-2.5">
            Ruling Planets
          </h3>

          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            <div>
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">ASC SIGN LORD</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Mercury</span>
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">ASC STAR LORD</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Moon</span>
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-gray-800/60">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">ASC SUB LORD</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Mercury</span>
            </div>
            <div className="pt-2.5 border-t border-slate-100 dark:border-gray-800/60">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">MOON SIGN LORD</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Mars</span>
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-gray-800/60">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">MOON STAR LORD</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Ketu</span>
            </div>
            <div className="pt-2.5 border-t border-slate-100 dark:border-gray-800/60">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">MOON SUB LORD</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Mars</span>
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-gray-800/60 col-span-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">DAY LORD</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Mars</span>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 2: FULL-WIDTH CARD: KP PLANETS */}
      <div className={`p-3 sm:p-4 rounded-2xl border shadow-xs space-y-2.5 ${
        isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
      }`}>
        <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white border-b border-slate-100 pb-1.5">
          KP Planets
        </h3>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-2 px-2.5">PLANET</th>
                <th className="py-2 px-2.5">CUSP</th>
                <th className="py-2 px-2.5">SIGN</th>
                <th className="py-2 px-2.5">SIGN LORD</th>
                <th className="py-2 px-2.5">STAR</th>
                <th className="py-2 px-2.5">STAR LORD</th>
                <th className="py-2 px-2.5">SUB LORD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold text-[11px] sm:text-xs">
              {DEFAULT_KP_PLANETS.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                  <td className="py-1.5 px-2.5 font-bold text-slate-900 text-xs sm:text-sm">{row.planet}</td>
                  <td className="py-1.5 px-2.5 font-mono text-slate-800">{row.cusp}</td>
                  <td className="py-1.5 px-2.5 text-slate-800">{row.sign}</td>
                  <td className="py-1.5 px-2.5 text-slate-800 font-bold">{row.signLord}</td>
                  <td className="py-1.5 px-2.5 text-slate-800">{row.star}</td>
                  <td className="py-1.5 px-2.5 text-slate-800 font-bold">{row.starLord}</td>
                  <td className="py-1.5 px-2.5 text-slate-800 font-bold">{row.subLord}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROW 3: FULL-WIDTH CARD: KP HOUSE CUSPS */}
      <div className={`p-3 sm:p-4 rounded-2xl border shadow-xs space-y-2.5 ${
        isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
      }`}>
        <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white border-b border-slate-100 pb-1.5">
          KP House Cusps
        </h3>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-2 px-2.5">CUSP</th>
                <th className="py-2 px-2.5">DEGREE</th>
                <th className="py-2 px-2.5">SIGN</th>
                <th className="py-2 px-2.5">SIGN LORD</th>
                <th className="py-2 px-2.5">STAR</th>
                <th className="py-2 px-2.5">STAR LORD</th>
                <th className="py-2 px-2.5">SUB LORD</th>
                <th className="py-2 px-2.5">SUB-SUB LORD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold text-[11px] sm:text-xs">
              {DEFAULT_KP_CUSPS.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                  <td className="py-1.5 px-2.5 font-bold text-slate-900 font-mono text-xs sm:text-sm">Cusp {row.cusp}</td>
                  <td className="py-1.5 px-2.5 font-mono text-slate-800">{row.degree}</td>
                  <td className="py-1.5 px-2.5 text-slate-800">{row.sign}</td>
                  <td className="py-1.5 px-2.5 text-slate-800 font-bold">{row.signLord}</td>
                  <td className="py-1.5 px-2.5 text-slate-800">{row.star}</td>
                  <td className="py-1.5 px-2.5 text-slate-800 font-bold">{row.starLord}</td>
                  <td className="py-1.5 px-2.5 text-slate-800 font-bold">{row.subLord}</td>
                  <td className="py-1.5 px-2.5 text-slate-800 font-bold">{row.subSubLord}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default KPSection;
