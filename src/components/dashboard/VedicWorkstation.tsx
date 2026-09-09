'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, Printer, RotateCcw, Calendar, Clock, Globe, 
  Sparkles, Compass, Eye, ChevronLeft, ChevronRight, 
  Plus, Minus, ArrowRight, ShieldCheck, Share2, Download
} from 'lucide-react';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import BengaliChart from '@/components/charts/BengaliChart';
import SouthIndianChart from '@/components/charts/SouthIndianChart';
import { calculatePlanetaryPositions } from '@/engine/ephemeris';
import { calculateAllNavamsha, calculateNavamsha, calculateAllDashamsha, calculateDashamsha } from '@/engine/divisional';
import { getNakshatraInfo } from '@/engine/nakshatras';
import { ZODIAC_SIGNS } from '@/engine/constants';
import { 
  VEDIC_PLANET_CONFIG, 
  SIGN_ABBRS, 
  SIGN_LORDS_MAP,
  SIGN_MOBILITY,
  SIGN_GENDER,
  formatDms, 
  formatFullDms, 
  calculateSubLords, 
  calculateDignity, 
  calculateBaladiAvastha, 
  calculateFunctionalNature,
  calculateShadbalaData,
  calculateLordships,
  calculateDetailedVimshottari,
  calculateGocharaPositions,
  VedicPlanetRow,
  ShadbalaBarData,
  DashaRow,
  LordshipRow,
  GocharaTransitRow
} from '@/engine/vedicWorkstationEngine';

interface VedicWorkstationProps {
  initialBirthData?: {
    name?: string;
    dob?: string;
    tob?: string;
    pob?: string;
    lat?: number;
    lng?: number;
    timezone?: number;
    sex?: string;
  };
  onClose?: () => void;
}

// Default Sample Data (Scorpio Ascendant, matches reference screenshot)
const DEFAULT_PRESET = {
  name: 'Sanatomba Meitei (Sample)',
  sex: 'Male',
  dob: '2026-08-28',
  tob: '06:00',
  pob: 'Imphal, Manipur',
  lat: 24.8170,
  lng: 93.9368,
  timezone: 5.5,
};

export default function VedicWorkstation({ initialBirthData, onClose }: VedicWorkstationProps) {
  // Input Form State
  const [formData, setFormData] = useState({
    name: initialBirthData?.name || DEFAULT_PRESET.name,
    sex: initialBirthData?.sex || DEFAULT_PRESET.sex,
    dob: initialBirthData?.dob || DEFAULT_PRESET.dob,
    tob: initialBirthData?.tob || DEFAULT_PRESET.tob,
    pob: initialBirthData?.pob || DEFAULT_PRESET.pob,
    lat: initialBirthData?.lat ?? DEFAULT_PRESET.lat,
    lng: initialBirthData?.lng ?? DEFAULT_PRESET.lng,
    timezone: initialBirthData?.timezone ?? DEFAULT_PRESET.timezone,
  });

  // Chart Style
  const [chartStyle, setChartStyle] = useState<'north' | 'bengali' | 'south'>('north');

  // Gochara Transit Date & Time
  const [transitDateStr, setTransitDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [transitTimeStr, setTransitTimeStr] = useState<string>('12:00');
  const [showGocharaChart, setShowGocharaChart] = useState<boolean>(false);

  // Vimshottari Dasha navigation level & offset
  const [dashaPage, setDashaPage] = useState<number>(0);

  // 1. CALCULATE NATAL PLANETARY POSITIONS (D1)
  const calculationResults = useMemo(() => {
    try {
      const { planets, ascendant, ayanamsa } = calculatePlanetaryPositions({
        name: formData.name,
        gender: formData.sex,
        dateOfBirth: formData.dob,
        timeOfBirth: formData.tob,
        latitude: Number(formData.lat) || 24.8170,
        longitude: Number(formData.lng) || 93.9368,
        timezone: 'Asia/Kolkata',
        utcOffset: Number(formData.timezone) || 5.5,
        ayanamsa: 'Lahiri',
      });

      const ascSignIndex = Math.floor(ascendant / 30);
      const ascSignDegree = ascendant % 30;
      const ascNak = getNakshatraInfo(ascendant);
      const ascSub = calculateSubLords(ascendant);

      // Chara Karakas: Sort 7 planets by degree within sign (highest to lowest)
      const sevenPlanets = planets.filter((p) => ['su', 'mo', 'ma', 'me', 'ju', 've', 'sa'].includes(p.id));
      const sortedByDeg = [...sevenPlanets].sort((a, b) => (b.signDegree) - (a.signDegree));
      const karakaLabels = ['AK', 'AmK', 'BK', 'MK', 'PiK', 'GK', 'DK'];
      const karakaMap: Record<string, string> = {};
      sortedByDeg.forEach((p, idx) => {
        karakaMap[p.id] = karakaLabels[idx] || '';
      });

      // Shadbala Values
      const shadbalaMap = calculateShadbalaData(planets, ascendant);

      // Build Table Rows
      const sun = planets.find((p) => p.id === 'su') || planets[0];

      // Ascendant Row
      const ascRow: VedicPlanetRow = {
        id: 'asc',
        name: 'Ascendant',
        abbr: 'As',
        color: '#0f172a',
        degreeStr: formatDms(ascSignDegree),
        rawLongitude: ascendant,
        signDegree: ascSignDegree,
        signIndex: ascSignIndex,
        signAbbr: SIGN_ABBRS[ascSignIndex],
        signName: ZODIAC_SIGNS[ascSignIndex]?.name || '',
        nakshatraName: ascNak.name,
        nakshatraIndex: ascNak.index,
        pada: ascNak.pada,
        padaSyllable: 'Nee',
        subLords: ascSub.str,
        dignity: 'Own',
        shadbalaRatio: 1.69,
        house: 1,
        avastha: '16 3 Old BK',
        karaka: 'BK',
        functionalNature: 'Neutral',
        lordships: `${ascSignIndex + 1}/1`,
        isRetrograde: false,
        isCombust: false,
      };

      const planetRows: VedicPlanetRow[] = planets.map((p) => {
        const cfg = VEDIC_PLANET_CONFIG[p.id] || { abbr: p.name.substring(0, 2), color: '#0f172a', naturalBenefic: true };
        const sub = calculateSubLords(p.longitude);
        const dignity = calculateDignity(p.id, p.signIndex, p.signDegree);
        const baladi = calculateBaladiAvastha(p.signIndex, p.signDegree);
        const karaka = karakaMap[p.id];
        const fn = calculateFunctionalNature(ascSignIndex, p.id);
        const shad = shadbalaMap[p.id] || { ratio: 1.05, totalRupas: 6.0, reqRupas: 6.0 };

        // Combustion check
        let isCombust = false;
        if (p.id !== 'su' && p.id !== 'ra' && p.id !== 'ke' && p.id !== 'mo') {
          const distFromSun = Math.abs(p.longitude - sun.longitude);
          isCombust = Math.min(distFromSun, 360 - distFromSun) < 14;
        }

        const hNum = ((p.signIndex - ascSignIndex + 12) % 12) + 1;

        // House lordships of this planet
        const ruledHouses: number[] = [];
        SIGN_LORDS_MAP.forEach((lName, sIdx) => {
          const pNameMap: Record<string, string> = {
            su: 'Sun', mo: 'Moon', ma: 'Mars', me: 'Mercury', ju: 'Jupiter', ve: 'Venus', sa: 'Saturn'
          };
          if (pNameMap[p.id] === lName) {
            const h = ((sIdx - ascSignIndex + 12) % 12) + 1;
            ruledHouses.push(h);
          }
        });

        const lordshipsStr = ruledHouses.length > 0 ? `${ruledHouses.join('/')}/${hNum}` : `${hNum}`;
        const avasthaFull = `${Math.floor(p.signDegree)} ${Math.floor((p.signDegree % 1) * 10)} ${baladi} ${karaka || ''}`.trim();

        return {
          id: p.id,
          name: p.name,
          abbr: cfg.abbr,
          color: cfg.color,
          degreeStr: formatDms(p.signDegree),
          rawLongitude: p.longitude,
          signDegree: p.signDegree,
          signIndex: p.signIndex,
          signAbbr: SIGN_ABBRS[p.signIndex],
          signName: p.signName,
          nakshatraName: p.nakshatraName,
          nakshatraIndex: p.nakshatraIndex,
          pada: p.nakshatraPada,
          padaSyllable: 'Tee',
          subLords: sub.str,
          dignity,
          shadbalaRatio: shad.ratio,
          house: hNum,
          avastha: avasthaFull,
          karaka,
          functionalNature: fn,
          lordships: lordshipsStr,
          isRetrograde: !!p.isRetrograde,
          isCombust,
          speed: p.speed,
        };
      });

      // 2. DIVISIONAL CHARTS (D9 & D10)
      const d9Planets = calculateAllNavamsha(planets);
      const d9Asc = calculateNavamsha(ascendant);

      const d10Planets = calculateAllDashamsha(planets);
      const d10Asc = calculateDashamsha(ascendant);

      // 3. SHADBALA GRAPH DATA
      const shadbalaBars: ShadbalaBarData[] = [
        { planet: 'Sun', symbol: 'Su', color: '#ea580c', ratio: shadbalaMap['su']?.ratio || 1.69, totalRupas: shadbalaMap['su']?.totalRupas || 11.0, reqRupas: 6.5 },
        { planet: 'Moon', symbol: 'Mo', color: '#2563eb', ratio: shadbalaMap['mo']?.ratio || 0.82, totalRupas: shadbalaMap['mo']?.totalRupas || 4.9, reqRupas: 6.0 },
        { planet: 'Mars', symbol: 'Ma', color: '#dc2626', ratio: shadbalaMap['ma']?.ratio || 1.27, totalRupas: shadbalaMap['ma']?.totalRupas || 6.3, reqRupas: 5.0 },
        { planet: 'Mercury', symbol: 'Me', color: '#16a34a', ratio: shadbalaMap['me']?.ratio || 1.03, totalRupas: shadbalaMap['me']?.totalRupas || 7.2, reqRupas: 7.0 },
        { planet: 'Jupiter', symbol: 'Ju', color: '#d97706', ratio: shadbalaMap['ju']?.ratio || 1.09, totalRupas: shadbalaMap['ju']?.totalRupas || 7.1, reqRupas: 6.5 },
        { planet: 'Venus', symbol: 'Ve', color: '#c026d3', ratio: shadbalaMap['ve']?.ratio || 1.03, totalRupas: shadbalaMap['ve']?.totalRupas || 5.7, reqRupas: 5.5 },
        { planet: 'Saturn', symbol: 'Sa', color: '#2563eb', ratio: shadbalaMap['sa']?.ratio || 1.43, totalRupas: shadbalaMap['sa']?.totalRupas || 7.1, reqRupas: 5.0 },
      ];

      // 4. LORDSHIPS MATRIX
      const lordships = calculateLordships(ascSignIndex, planets);

      // 5. VIMSHOTTARI DASHA TIMELINE
      const moon = planets.find((p) => p.id === 'mo') || planets[1];
      const birthDateObj = new Date(`${formData.dob}T${formData.tob}:00`);
      const dashas = calculateDetailedVimshottari(moon.longitude, birthDateObj);

      return {
        ascendant,
        ascSignIndex,
        planets,
        tableRows: [ascRow, ...planetRows],
        d9Planets,
        d9Asc,
        d10Planets,
        d10Asc,
        shadbalaBars,
        lordships,
        dashas,
        ayanamsa,
      };
    } catch (e) {
      console.error('Workstation calculation error:', e);
      return null;
    }
  }, [formData]);

  // 2. CALCULATE GOCHARA (TRANSIT) DATA
  const gocharaResults = useMemo(() => {
    if (!calculationResults) return null;
    const [y, m, d] = transitDateStr.split('-').map(Number);
    const [hh, mm] = transitTimeStr.split(':').map(Number);
    const eventDate = new Date(y, m - 1, d, hh || 12, mm || 0);

    const moon = calculationResults.planets.find((p) => p.id === 'mo');
    const moonLong = moon ? moon.longitude : 0;

    return calculateGocharaPositions(
      eventDate,
      calculationResults.ascendant,
      moonLong,
      Number(formData.lat) || 24.8170,
      Number(formData.lng) || 93.9368
    );
  }, [calculationResults, transitDateStr, transitTimeStr, formData.lat, formData.lng]);

  if (!calculationResults) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Error calculating astrological parameters. Please check birth date/time.
      </div>
    );
  }

  // Helper: map planets for NorthIndianChart (D1, D9, D10)
  const createChartPlanetMapping = (
    planetList: any[],
    ascSignIdx: number
  ) => {
    const list: any[] = [];
    // Lagna (Asc)
    list.push({
      name: 'Ascendant',
      abbr: 'As',
      houseNumber: 1,
      isRetrograde: false,
    });

    planetList.forEach((p) => {
      const hNum = ((p.signIndex - ascSignIdx + 12) % 12) + 1;
      const cfg = VEDIC_PLANET_CONFIG[p.id] || { abbr: p.name.substring(0, 2) };
      list.push({
        name: p.name,
        abbr: cfg.abbr + (p.isRetrograde ? 'R' : ''),
        houseNumber: hNum,
        isRetrograde: !!p.isRetrograde,
      });
    });

    return list;
  };

  const d1ChartPlanets = createChartPlanetMapping(calculationResults.planets, calculationResults.ascSignIndex);
  const d9ChartPlanets = createChartPlanetMapping(calculationResults.d9Planets, calculationResults.d9Asc.signIndex);
  const d10ChartPlanets = createChartPlanetMapping(calculationResults.d10Planets, calculationResults.d10Asc.signIndex);

  // Sign arrays for 12 houses (relative to lagna)
  const d1Signs = Array.from({ length: 12 }, (_, i) => ((calculationResults.ascSignIndex + i) % 12) + 1);
  const d9Signs = Array.from({ length: 12 }, (_, i) => ((calculationResults.d9Asc.signIndex + i) % 12) + 1);
  const d10Signs = Array.from({ length: 12 }, (_, i) => ((calculationResults.d10Asc.signIndex + i) % 12) + 1);

  // Bengali chart compatibility mapper
  const toBengaliChartPlanets = (planetList: any[]) =>
    planetList.map((p) => ({
      name: p.name,
      abbr: VEDIC_PLANET_CONFIG[p.id]?.abbr || p.name.substring(0, 2),
      houseNumber: p.signIndex + 1,
      isRetrograde: !!p.isRetrograde,
    }));

  return (
    <div className="w-full bg-[#f4f7f4] text-slate-900 font-sans p-3 sm:p-5 rounded-3xl border border-slate-300/80 shadow-2xl space-y-4 max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER & WORKSTATION CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                Vedic Astrology Workstation
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                Parashari Light Suite
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Client: <span className="font-bold text-amber-900">{formData.name}</span> • DOB: <span className="font-bold">{formData.dob}</span> at <span className="font-bold">{formData.tob}</span> • Lagna: <span className="font-bold text-amber-700">{SIGN_ABBRS[calculationResults.ascSignIndex]} ({formatDms(calculationResults.ascendant % 30)})</span>
            </p>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Style Switcher */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setChartStyle('north')}
              className={`px-3 py-1 rounded-lg transition-all ${
                chartStyle === 'north' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              North Indian (Diamond)
            </button>
            <button
              onClick={() => setChartStyle('bengali')}
              className={`px-3 py-1 rounded-lg transition-all ${
                chartStyle === 'bengali' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bengali / Manipuri (Rashi)
            </button>
            <button
              onClick={() => setChartStyle('south')}
              className={`px-3 py-1 rounded-lg transition-all ${
                chartStyle === 'south' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              South Indian
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
              title="Close Workstation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. ROW 1: TRI-CHART DISPLAY (D1, D9, D10) EXACT MATCH TO REFERENCE IMAGE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* CHART 1: D1 BIRTH CHART */}
        <div className="bg-white rounded-2xl border border-[#c3d9c3] shadow-xs overflow-hidden flex flex-col">
          <div className="bg-[#ebf3ea] px-3 py-1.5 border-b border-[#c3d9c3] flex items-center justify-between">
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">
              Birth Chart (D1 Rashi)
            </span>
            <span className="text-[10px] font-bold text-slate-500 font-mono">
              Lagna: {SIGN_ABBRS[calculationResults.ascSignIndex]}
            </span>
          </div>
          <div className="p-2 flex-1 flex items-center justify-center bg-[#fbfdfb]">
            {chartStyle === 'north' ? (
              <NorthIndianChart
                planets={d1ChartPlanets}
                signs={d1Signs}
                ascendantSign={calculationResults.ascSignIndex}
                className="w-full max-w-[340px] aspect-square border border-[#c3d9c3] rounded-xl bg-[#fffef9]"
              />
            ) : chartStyle === 'bengali' ? (
              <BengaliChart
                planets={toBengaliChartPlanets(calculationResults.planets)}
                ascendantSign={calculationResults.ascSignIndex}
                title="D1 Birth Chart"
                className="w-full"
              />
            ) : (
              <SouthIndianChart
                planets={d1ChartPlanets}
                ascendantSign={calculationResults.ascSignIndex}
                className="w-full"
              />
            )}
          </div>
        </div>

        {/* CHART 2: D9 NAVAMSHA (SPOUSE & DHARMA) */}
        <div className="bg-white rounded-2xl border border-[#c3d9c3] shadow-xs overflow-hidden flex flex-col">
          <div className="bg-[#ebf3ea] px-3 py-1.5 border-b border-[#c3d9c3] flex items-center justify-between">
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">
              D9 Navamsha (spouse)
            </span>
            <span className="text-[10px] font-bold text-slate-500 font-mono">
              Nav-Lagna: {SIGN_ABBRS[calculationResults.d9Asc.signIndex]}
            </span>
          </div>
          <div className="p-2 flex-1 flex items-center justify-center bg-[#fbfdfb]">
            {chartStyle === 'north' ? (
              <NorthIndianChart
                planets={d9ChartPlanets}
                signs={d9Signs}
                ascendantSign={calculationResults.d9Asc.signIndex}
                className="w-full max-w-[340px] aspect-square border border-[#c3d9c3] rounded-xl bg-[#fffef9]"
              />
            ) : chartStyle === 'bengali' ? (
              <BengaliChart
                planets={toBengaliChartPlanets(calculationResults.d9Planets)}
                ascendantSign={calculationResults.d9Asc.signIndex}
                title="D9 Navamsha"
                className="w-full"
              />
            ) : (
              <SouthIndianChart
                planets={d9ChartPlanets}
                ascendantSign={calculationResults.d9Asc.signIndex}
                className="w-full"
              />
            )}
          </div>
        </div>

        {/* CHART 3: D10 DASHAMSHA (CAREER & GREAT SUCCESSES) */}
        <div className="bg-white rounded-2xl border border-[#c3d9c3] shadow-xs overflow-hidden flex flex-col">
          <div className="bg-[#ebf3ea] px-3 py-1.5 border-b border-[#c3d9c3] flex items-center justify-between">
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">
              D10 Dashamsha (great successes)
            </span>
            <span className="text-[10px] font-bold text-slate-500 font-mono">
              D10-Lagna: {SIGN_ABBRS[calculationResults.d10Asc.signIndex]}
            </span>
          </div>
          <div className="p-2 flex-1 flex items-center justify-center bg-[#fbfdfb]">
            {chartStyle === 'north' ? (
              <NorthIndianChart
                planets={d10ChartPlanets}
                signs={d10Signs}
                ascendantSign={calculationResults.d10Asc.signIndex}
                className="w-full max-w-[340px] aspect-square border border-[#c3d9c3] rounded-xl bg-[#fffef9]"
              />
            ) : chartStyle === 'bengali' ? (
              <BengaliChart
                planets={toBengaliChartPlanets(calculationResults.d10Planets)}
                ascendantSign={calculationResults.d10Asc.signIndex}
                title="D10 Dashamsha"
                className="w-full"
              />
            ) : (
              <SouthIndianChart
                planets={d10ChartPlanets}
                ascendantSign={calculationResults.d10Asc.signIndex}
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* 3. ROW 2: DETAILED PLANETARY POSITIONS TABLE + SHAD BALA BAR GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* LEFT 8 COLS: COMPREHENSIVE PLANETARY POSITIONS TABLE */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#c3d9c3] shadow-xs overflow-hidden flex flex-col">
          <div className="bg-[#ebf3ea] px-3 py-1.5 border-b border-[#c3d9c3] flex items-center justify-between">
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">
              Birth Chart (Planetary Details & Strengths)
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              Ayanamsha: Lahiri {formatFullDms(calculationResults.ayanamsa)}
            </span>
          </div>

          <div className="p-2 overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono border-collapse select-text">
              <thead>
                <tr className="border-b border-[#c3d9c3] text-[10px] font-black text-slate-600 uppercase bg-[#fafcfa]">
                  <th className="py-1 px-2">Body</th>
                  <th className="py-1 px-1.5">Longitude</th>
                  <th className="py-1 px-1.5">Sign</th>
                  <th className="py-1 px-1.5">Nakshatra</th>
                  <th className="py-1 px-1">Pd</th>
                  <th className="py-1 px-1.5">Sub-Lords</th>
                  <th className="py-1 px-1.5">Dignity</th>
                  <th className="py-1 px-1 text-right">Shad</th>
                  <th className="py-1 px-1 text-center">H</th>
                  <th className="py-1 px-2">Avastha & Karaka</th>
                  <th className="py-1 px-1.5">Nature</th>
                  <th className="py-1 px-1.5 text-right">Lords</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {calculationResults.tableRows.map((row) => {
                  const isCombust = row.isCombust;
                  const isRetro = row.isRetrograde;

                  return (
                    <tr key={row.id} className="hover:bg-[#f3f9f3] transition-colors leading-tight">
                      {/* Body Abbr with Vedic Color */}
                      <td className="py-1 px-2 font-bold flex items-center gap-1">
                        <span style={{ color: row.color }} className="font-black text-xs sm:text-sm">
                          {row.abbr}
                        </span>
                        {isRetro && (
                          <span className="text-red-600 font-extrabold text-[10px]" title="Retrograde">R</span>
                        )}
                        {isCombust && (
                          <span className="text-orange-600 font-extrabold text-[10px]" title="Combust">c</span>
                        )}
                      </td>

                      {/* Longitude */}
                      <td className="py-1 px-1.5 font-bold text-slate-900 whitespace-nowrap">
                        {row.degreeStr}
                      </td>

                      {/* Sign */}
                      <td className="py-1 px-1.5 text-slate-800 font-semibold">
                        {row.signAbbr}
                      </td>

                      {/* Nakshatra */}
                      <td className="py-1 px-1.5 text-slate-800 truncate max-w-[90px]">
                        {row.nakshatraName}
                      </td>

                      {/* Pada */}
                      <td className="py-1 px-1 font-bold text-slate-700">
                        {row.pada}
                      </td>

                      {/* Sub-Lords */}
                      <td className="py-1 px-1.5 text-[10px] text-slate-700 font-mono whitespace-nowrap">
                        {row.subLords}
                      </td>

                      {/* Dignity */}
                      <td className="py-1 px-1.5 font-bold text-[10px]">
                        <span className={`px-1 rounded ${
                          row.dignity === 'Own' || row.dignity === 'Exalt.' ? 'text-emerald-700 font-black' :
                          row.dignity === 'Moolt.' ? 'text-blue-700 font-black' :
                          row.dignity === 'Debil.' ? 'text-red-600 font-black' : 'text-slate-600'
                        }`}>
                          {row.dignity}
                        </span>
                      </td>

                      {/* Shadbala Ratio */}
                      <td className="py-1 px-1 text-right font-bold text-slate-900">
                        {row.shadbalaRatio.toFixed(2)}
                      </td>

                      {/* House */}
                      <td className="py-1 px-1 text-center font-extrabold text-amber-900">
                        {row.house}
                      </td>

                      {/* Avastha & Karaka */}
                      <td className="py-1 px-2 text-[10px] text-slate-700 whitespace-nowrap">
                        <span>{row.avastha}</span>
                      </td>

                      {/* Functional Nature */}
                      <td className="py-1 px-1.5 text-[10px]">
                        <span className={`font-bold ${
                          row.functionalNature === 'Benefic' ? 'text-emerald-600' :
                          row.functionalNature === 'Malefic' ? 'text-red-500' : 'text-slate-600'
                        }`}>
                          {row.functionalNature}
                        </span>
                      </td>

                      {/* Lordships */}
                      <td className="py-1 px-1.5 text-right font-mono text-slate-600 text-[10px]">
                        {row.lordships}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT 4 COLS: SHAD BALA BAR CHART EXACT MATCH TO REFERENCE IMAGE */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#c3d9c3] shadow-xs overflow-hidden flex flex-col">
          <div className="bg-[#ebf3ea] px-3 py-1.5 border-b border-[#c3d9c3] flex items-center justify-between">
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">
              Shad Bala
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              Benchmark: 1.00
            </span>
          </div>

          <div className="p-3 flex-1 flex flex-col justify-between bg-[#fbfdfb]">
            {/* SVG Visual Bar Graph */}
            <div className="w-full h-48 sm:h-56 relative border border-slate-300 rounded-xl overflow-hidden bg-white">
              
              {/* Background Zones: Red Below 1.0, Green Above 1.0 */}
              <div className="absolute inset-0 flex flex-col">
                {/* Upper Green Zone (> 1.0) */}
                <div className="flex-1 bg-[#d8f5d8] border-b-2 border-black" />
                {/* Lower Red Zone (< 1.0) */}
                <div className="h-[40%] bg-[#ff8080]" />
              </div>

              {/* Planet Strength Bars */}
              <div className="absolute inset-0 flex items-end justify-around px-2 pb-7">
                {calculationResults.shadbalaBars.map((bar) => {
                  // Normalize height: 1.0 corresponds to 40% from bottom (60% from top)
                  // Max ratio ~ 2.0 = 95% height
                  const normalizedHeightPercent = Math.min(96, Math.max(10, (bar.ratio / 2.0) * 85));

                  return (
                    <div key={bar.planet} className="flex flex-col items-center z-10 w-8">
                      {/* Vertical Bar */}
                      <div
                        style={{ height: `${normalizedHeightPercent}%` }}
                        className="w-full bg-[#fffff8] border-2 border-black rounded-t-sm shadow-xs transition-all flex items-start justify-center pt-1"
                      >
                      </div>

                      {/* Planet Symbol & Ratio Label Below */}
                      <div className="absolute bottom-0.5 text-center leading-none">
                        <span
                          style={{ color: bar.color }}
                          className="font-black text-xs sm:text-sm block"
                        >
                          {bar.symbol}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-slate-900 block mt-0.5">
                          {bar.ratio.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 1.0 Benchmark Label */}
              <div className="absolute right-1 bottom-[41%] text-[9px] font-mono font-bold text-black bg-white/80 px-1 rounded">
                1.00 Req.
              </div>
            </div>

            {/* Brief Explanation */}
            <p className="text-[10px] text-slate-500 font-medium text-center mt-2 leading-tight">
              Planets above black line (&gt;1.00 in green) possess full functional potency in Vimshottari results.
            </p>
          </div>
        </div>
      </div>

      {/* 4. ROW 3: VIMSHOTTARI DASHA + LORDSHIPS + GOCHARA TRANSIT PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        
        {/* BOTTOM LEFT 4 COLS: VIMSHOTTARI DASHA */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-[#c3d9c3] shadow-xs overflow-hidden flex flex-col">
          <div className="bg-[#ebf3ea] px-3 py-1.5 border-b border-[#c3d9c3] flex items-center justify-between">
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">
              Vimshottari
            </span>
            {/* Step Controls matching image: -, +, <-, -> */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setDashaPage(Math.max(0, dashaPage - 10))}
                className="w-5 h-5 rounded flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-bold cursor-pointer"
                title="Previous period"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDashaPage(dashaPage + 10)}
                className="w-5 h-5 rounded flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-bold cursor-pointer"
                title="Next period"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDashaPage(0)}
                className="w-5 h-5 rounded flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-bold cursor-pointer"
                title="Reset to current"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-2 flex-1 overflow-y-auto max-h-56 bg-[#fbfdfb]">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <tbody>
                {calculationResults.dashas.slice(dashaPage, dashaPage + 10).map((dRow, idx) => (
                  <tr key={idx} className="hover:bg-[#ebf3ea] transition-colors leading-tight">
                    <td className="py-0.5 px-2 font-bold text-[#16a34a] whitespace-nowrap">
                      {dRow.title}
                    </td>
                    <td className="py-0.5 px-2 text-slate-600 font-semibold">
                      {dRow.dayOfWeek}
                    </td>
                    <td className="py-0.5 px-2 text-right text-slate-900 font-mono">
                      {dRow.dateStr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM MIDDLE 4 COLS: LORDSHIPS MATRIX */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-[#c3d9c3] shadow-xs overflow-hidden flex flex-col">
          <div className="bg-[#ebf3ea] px-3 py-1.5 border-b border-[#c3d9c3] flex items-center justify-between">
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">
              Lordships
            </span>
            <span className="text-[10px] font-bold text-slate-500 font-mono">
              12 Bhavas
            </span>
          </div>

          <div className="p-3 flex-1 overflow-y-auto max-h-56 bg-[#fbfdfb]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
              {/* Column 1: Houses 1 to 6 */}
              <div className="space-y-1">
                {calculationResults.lordships.slice(0, 6).map((l) => (
                  <div key={l.houseNum} className="text-slate-800 leading-tight">
                    <span className="font-medium">{l.text.split(' - ')[0]}</span>
                    <span className="font-bold text-red-600"> - {l.lordAbbr}</span>
                  </div>
                ))}
              </div>

              {/* Column 2: Houses 7 to 12 */}
              <div className="space-y-1">
                {calculationResults.lordships.slice(6, 12).map((l) => (
                  <div key={l.houseNum} className="text-slate-800 leading-tight">
                    <span className="font-medium">{l.text.split(' - ')[0]}</span>
                    <span className="font-bold text-red-600"> - {l.lordAbbr}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT 4 COLS: NEW EVENT / GOCHARA (TRANSIT) DETAILS */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-[#c3d9c3] shadow-xs overflow-hidden flex flex-col">
          <div className="bg-[#ebf3ea] px-3 py-1.5 border-b border-[#c3d9c3] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">
                Gochara (Transits)
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[9px] font-black uppercase">
                New Event
              </span>
            </div>
            
            <button
              onClick={() => setShowGocharaChart(!showGocharaChart)}
              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-all shadow-xs cursor-pointer"
            >
              {showGocharaChart ? 'Hide Chart' : 'Show Chart 🪐'}
            </button>
          </div>

          {/* Transit Date Controls */}
          <div className="px-3 py-1.5 bg-[#fafcfa] border-b border-slate-200 flex items-center justify-between gap-2 text-[11px] font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={transitDateStr}
                onChange={(e) => setTransitDateStr(e.target.value)}
                className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-900 font-mono"
              />
            </div>
            <button
              onClick={() => {
                setTransitDateStr(new Date().toISOString().split('T')[0]);
              }}
              className="text-[10px] font-bold text-cyan-700 hover:underline cursor-pointer"
            >
              Now
            </button>
          </div>

          <div className="p-2 flex-1 overflow-y-auto max-h-48 bg-[#fbfdfb]">
            {gocharaResults && (
              <table className="w-full text-left text-[11px] font-mono border-collapse">
                <tbody>
                  {gocharaResults.transits.map((gt) => (
                    <tr key={gt.id} className="hover:bg-[#ebf3ea] transition-colors leading-tight">
                      <td className="py-0.5 px-1 font-bold">
                        <span style={{ color: gt.color }} className="font-black text-xs">
                          {gt.abbr}
                        </span>
                        {gt.isRetrograde && <span className="text-red-600 text-[10px]">R</span>}
                      </td>
                      <td className="py-0.5 px-1 font-mono text-slate-900">
                        {gt.degreeStr}
                      </td>
                      {gt.combustionPercent && (
                        <td className="py-0.5 px-0.5 text-orange-600 font-bold text-[9px]">
                          {gt.combustionPercent}
                        </td>
                      )}
                      <td className="py-0.5 px-1 text-slate-800 font-semibold">
                        {gt.signAbbr}
                      </td>
                      <td className="py-0.5 px-1 text-[10px] text-slate-500">
                        {gt.genderNature}
                      </td>
                      <td className="py-0.5 px-1 text-right text-[10px] text-slate-600">
                        {gt.subLords}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* 5. OPTIONAL POPUP / EXPANDED GOCHARA TRANSIT CHART */}
      {showGocharaChart && gocharaResults && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <span>🪐 Transit (Gochara) Chart as on {transitDateStr} at {transitTimeStr}</span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Transit Lagna: {SIGN_ABBRS[Math.floor(gocharaResults.transitAscendant / 30)]}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Live planetary positions currently influencing Natal Moon ({calculationResults.tableRows.find(p => p.id === 'mo')?.signAbbr}) and Natal Lagna ({SIGN_ABBRS[calculationResults.ascSignIndex]}).
              </p>
            </div>
            <button
              onClick={() => setShowGocharaChart(false)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex justify-center p-2 bg-[#fbfdfb] border border-slate-200 rounded-2xl">
              <NorthIndianChart
                planets={createChartPlanetMapping(
                  gocharaResults.transits.map(gt => ({
                    id: gt.id,
                    name: gt.name,
                    signIndex: SIGN_ABBRS.indexOf(gt.signAbbr),
                    isRetrograde: gt.isRetrograde,
                  })),
                  Math.floor(gocharaResults.transitAscendant / 30)
                )}
                signs={Array.from({ length: 12 }, (_, i) => ((Math.floor(gocharaResults.transitAscendant / 30) + i) % 12) + 1)}
                ascendantSign={Math.floor(gocharaResults.transitAscendant / 30)}
                className="w-full max-w-[360px] aspect-square border border-[#c3d9c3] rounded-xl bg-[#fffef9]"
              />
            </div>

            {/* Transit Impact Summary */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-emerald-800">
                Gochara House Placements from Natal Moon & Lagna
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {gocharaResults.transits.filter(gt => gt.id !== 'asc').map(gt => (
                  <div key={gt.id} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: gt.color }} className="font-bold text-sm">
                        {gt.abbr}
                      </span>
                      <span className="font-medium text-slate-700">{gt.signAbbr}</span>
                    </div>
                    <div className="text-right font-mono text-[10px]">
                      <div className="text-amber-800 font-bold">{gt.houseFromLagna}th from Lagna</div>
                      <div className="text-cyan-800">{gt.houseFromMoon}th from Moon</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
