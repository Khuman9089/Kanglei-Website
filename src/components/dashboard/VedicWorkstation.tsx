'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, Printer, RotateCcw, Calendar, Clock, Globe, 
  Sparkles, Compass, Eye, ChevronLeft, ChevronRight, 
  Plus, Minus, ArrowRight, ShieldCheck, Share2, Download,
  User, Moon as MoonIcon, Sun as SunIcon, MapPin
} from 'lucide-react';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import BengaliChart from '@/components/charts/BengaliChart';
import SouthIndianChart from '@/components/charts/SouthIndianChart';
import { calculatePlanetaryPositions } from '@/engine/ephemeris';
import { calculateAllNavamsha, calculateNavamsha, calculateAllDashamsha, calculateDashamsha } from '@/engine/divisional';
import { getNakshatraInfo } from '@/engine/nakshatras';
import { ZODIAC_SIGNS } from '@/engine/constants';
import { calculatePanchangaDetails } from '@/engine/panchanga';
import { calculateVimshottariDasha, getCurrentDasha } from '@/engine/dashas';
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
  calculateRemainingDashaTime,
  VedicPlanetRow,
  ShadbalaBarData,
  DashaRow,
  LordshipRow,
  GocharaTransitRow
} from '@/engine/vedicWorkstationEngine';

const BENGALI_PLANET_NAMES: Record<string, string> = {
  Sun: 'রবি',
  Moon: 'চন্দ্র',
  Mars: 'মঙ্গল',
  Mercury: 'বুধ',
  Jupiter: 'বৃহস্পতি',
  Venus: 'শুক্র',
  Saturn: 'শনি',
  Rahu: 'রাহু',
  Ketu: 'কেতু',
};

const BENGALI_RASHI_NAMES = [
  { en: 'Aries', bn: 'মেষ' },
  { en: 'Taurus', bn: 'বৃষ' },
  { en: 'Gemini', bn: 'মিথুন' },
  { en: 'Cancer', bn: 'কর্কট' },
  { en: 'Leo', bn: 'সিংহ' },
  { en: 'Virgo', bn: 'কন্যা' },
  { en: 'Libra', bn: 'তুলা' },
  { en: 'Scorpio', bn: 'বৃশ্চিক' },
  { en: 'Sagittarius', bn: 'ধনু' },
  { en: 'Capricorn', bn: 'মকর' },
  { en: 'Aquarius', bn: 'কুম্ভ' },
  { en: 'Pisces', bn: 'মীন' },
];

function formatDateNice(d: Date | string | null | undefined): string {
  if (!d) return '-';
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return String(d);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const mm = months[dateObj.getMonth()];
  const yyyy = dateObj.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function formatTimeStandard(tob: string): string {
  if (!tob) return '-';
  const [hStr, mStr] = tob.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h)) return tob;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(m || 0).padStart(2, '0')} ${ampm}`;
}

function toBengaliDigits(num: number | string): string {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bengaliNumerals[parseInt(digit)]);
}

export interface ExactAgeBreakdown {
  years: number;
  months: number;
  days: number;
  runningYear: number;
  text: string;
}

export function calculateExactAge(
  dobStr: string,
  tobStr?: string,
  targetDate: Date = new Date()
): ExactAgeBreakdown | null {
  if (!dobStr) return null;
  const parts = dobStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const bYear = parts[0];
  const bMonth = parts[1] - 1;
  const bDay = parts[2];

  let [hStr, minStr] = (tobStr || '12:00').split(':');
  const bHour = parseInt(hStr || '12', 10);
  const bMin = parseInt(minStr || '0', 10);

  const bDate = new Date(bYear, bMonth, bDay, isNaN(bHour) ? 12 : bHour, isNaN(bMin) ? 0 : bMin);
  if (isNaN(bDate.getTime())) return null;

  let tYear = targetDate.getFullYear();
  let tMonth = targetDate.getMonth();
  let tDay = targetDate.getDate();

  if (targetDate.getTime() < bDate.getTime()) {
    return {
      years: 0,
      months: 0,
      days: 0,
      runningYear: 1,
      text: '0 y 0 month 0 days Running 1 year',
    };
  }

  let years = tYear - bYear;
  let months = tMonth - bMonth;
  let days = tDay - bDay;

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(tYear, tMonth, 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const runningYear = years + 1;

  return {
    years,
    months,
    days,
    runningYear,
    text: `${years} y ${months} month ${days} days Running ${runningYear} year`,
  };
}



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

// Default Sample Data
const DEFAULT_PRESET = {
  name: '',
  sex: 'Male',
  dob: '',
  tob: '',
  pob: '',
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

  // Chart Style - Default to Bengali / Manipuri as requested
  const [chartStyle, setChartStyle] = useState<'north' | 'bengali' | 'south'>('bengali');

  // Edit Birth Details panel toggle
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editDraft, setEditDraft] = useState({ ...formData });

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

      // 6. PANCHANGA & BIRTH DETAIL INFO
      const panchanga = calculatePanchangaDetails(formData.dob, sun.longitude, moon.longitude);
      const fullVimshottari = calculateVimshottariDasha(moon.longitude, birthDateObj);
      const moonNak = getNakshatraInfo(moon.longitude);

      const now = new Date();
      const targetDate = now.getTime() < birthDateObj.getTime() ? birthDateObj : now;
      const currentDashaState = getCurrentDasha(fullVimshottari, targetDate);

      const birthDashaPeriod = fullVimshottari[0] || null;
      const activeMaha = currentDashaState.maha || fullVimshottari[0] || null;
      const activeAntar = currentDashaState.antar || (activeMaha?.subPeriods ? activeMaha.subPeriods[0] : null);
      const activePratyantar = currentDashaState.pratyantar || (activeAntar?.subPeriods ? activeAntar.subPeriods[0] : null);

      return {
        ascendant,
        ascSignIndex,
        ascSignDegree,
        ascNak,
        moon,
        moonNak,
        sun,
        planets,
        tableRows: [ascRow, ...planetRows],
        d9Planets,
        d9Asc,
        d10Planets,
        d10Asc,
        shadbalaBars,
        lordships,
        dashas,
        panchanga,
        birthDashaPeriod,
        activeMaha,
        activeAntar,
        activePratyantar,
        birthDateObj,
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

  // Exact Age & Running Year
  const exactAge = useMemo(() => {
    return calculateExactAge(formData.dob, formData.tob);
  }, [formData.dob, formData.tob]);

  // Remaining Dasha Durations
  const mahaRemaining = useMemo(() => {
    if (!calculationResults?.activeMaha?.endDate) return null;
    return calculateRemainingDashaTime(new Date(), calculationResults.activeMaha.endDate);
  }, [calculationResults?.activeMaha?.endDate]);

  const antarRemaining = useMemo(() => {
    if (!calculationResults?.activeAntar?.endDate) return null;
    return calculateRemainingDashaTime(new Date(), calculationResults.activeAntar.endDate);
  }, [calculationResults?.activeAntar?.endDate]);

  const pratyantarRemaining = useMemo(() => {
    if (!calculationResults?.activePratyantar?.endDate) return null;
    return calculateRemainingDashaTime(new Date(), calculationResults.activePratyantar.endDate);
  }, [calculationResults?.activePratyantar?.endDate]);




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
              Client: <span className="font-bold text-amber-900">{formData.name}</span>
              {exactAge && (
                <> • Age: <span className="font-bold text-emerald-800 font-mono">{exactAge.years}y {exactAge.months}m {exactAge.days}d (Running {exactAge.runningYear}th Year / চৎলিবা {exactAge.runningYear}শুবা চহি)</span></>
              )} • DOB: <span className="font-bold">{formData.dob}</span> at <span className="font-bold">{formData.tob}</span> • Lagna: <span className="font-bold text-amber-700">{SIGN_ABBRS[calculationResults.ascSignIndex]} ({formatDms(calculationResults.ascendant % 30)})</span>
            </p>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Style Switcher */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setChartStyle('bengali')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                chartStyle === 'bengali' ? 'bg-white text-amber-800 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bengali / Manipuri (Rashi)
            </button>
            <button
              onClick={() => setChartStyle('north')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                chartStyle === 'north' ? 'bg-white text-amber-800 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              North Indian (Diamond)
            </button>
            <button
              onClick={() => setChartStyle('south')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                chartStyle === 'south' ? 'bg-white text-amber-800 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
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

          {/* Edit Birth Details toggle */}
          <button
            onClick={() => { setEditDraft({ ...formData }); setShowEditForm((v) => !v); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              showEditForm
                ? 'bg-amber-600 text-white border-amber-700 shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
            }`}
            title="Edit Birth Details"
          >
            <User className="w-3.5 h-3.5" />
            <span>{showEditForm ? 'Cancel Edit' : '✏️ Edit Details'}</span>
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

      {/* EDIT BIRTH DETAILS PANEL */}
      {showEditForm && (
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-amber-100 pb-3">
            <User className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif font-black text-base text-slate-900">
              Edit Birth Particulars (পোকপগী অকুপ্পা ৱারোল)
            </h3>
            <span className="text-[10px] text-slate-500 ml-auto">Changes apply immediately on Recalculate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name (মমিং) *</label>
              <input
                type="text"
                value={editDraft.name}
                onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 bg-[#fffdfa] focus:border-amber-400 focus:outline-none"
                placeholder="e.g. Sanatomba Meitei"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Gender (নুপা / নুপী)</label>
              <select
                value={editDraft.sex}
                onChange={(e) => setEditDraft({ ...editDraft, sex: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 bg-[#fffdfa] focus:border-amber-400 focus:outline-none"
              >
                <option value="Male">Male (নুপা)</option>
                <option value="Female">Female (নুপী)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of Birth (পোকপা নুমিৎ) *</label>
              <input
                type="date"
                value={editDraft.dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setEditDraft({ ...editDraft, dob: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 bg-[#fffdfa] focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Time of Birth (পোকপা পুংফম) *</label>
              <input
                type="time"
                value={editDraft.tob}
                onChange={(e) => setEditDraft({ ...editDraft, tob: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 bg-[#fffdfa] focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Place of Birth (পোকপা মফম)</label>
              <input
                type="text"
                value={editDraft.pob}
                onChange={(e) => setEditDraft({ ...editDraft, pob: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 bg-[#fffdfa] focus:border-amber-400 focus:outline-none"
                placeholder="Imphal, Manipur"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={editDraft.lat}
                  onChange={(e) => setEditDraft({ ...editDraft, lat: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-xs text-amber-900 bg-[#fffdfa] focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={editDraft.lng}
                  onChange={(e) => setEditDraft({ ...editDraft, lng: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-xs text-amber-900 bg-[#fffdfa] focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-amber-100">
            <button
              onClick={() => {
                setFormData({ ...editDraft });
                setShowEditForm(false);
                setDashaPage(0);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-extrabold text-xs hover:from-amber-700 hover:to-amber-600 shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Recalculate Chart (অমুক্কা হন্না য়েংবা)
            </button>
            <button
              onClick={() => setShowEditForm(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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

        {/* RIGHT 4 COLS: BIRTH DETAIL INFO & DASHA PANEL (REPLACES SHAD BALA) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#c3d9c3] shadow-xs overflow-hidden flex flex-col">
          <div className="bg-[#ebf3ea] px-3 py-2 border-b border-[#c3d9c3] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">
                Birth Detail Info
              </span>
              <span className="text-[10px] text-slate-500 font-medium font-serif">
                (পোকপগী অকুপ্পা ৱারোল অমসুং দশা)
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              Lagna: {SIGN_ABBRS[calculationResults.ascSignIndex]} • Rashi: {SIGN_ABBRS[calculationResults.moon.signIndex]}
            </span>
          </div>

          <div className="p-3 flex-1 flex flex-col gap-3 bg-[#fbfdfb] overflow-y-auto max-h-[520px]">
            {/* 1. CORE BIRTH DETAILS GRID */}
            <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  Kundali Particulars (পোকপগী কুণ্ডলী)
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {formData.sex}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                {/* DOB */}
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">DOB (পোকপা নুমিৎ):</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatDateNice(formData.dob)}
                  </span>
                </div>

                {/* TOB */}
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">TOB (পোকপা পুংফম):</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatTimeStandard(formData.tob)}
                  </span>
                </div>

                {/* Exact Age & Running Year */}
                {exactAge && (
                  <div className="col-span-2 bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-300 rounded-lg p-2 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-amber-900 block text-[10px] font-black uppercase tracking-wider">
                        Age (হৌজিক চৎলিবা চহি):
                      </span>
                      <span className="font-bold text-slate-950 font-mono text-xs">
                        {exactAge.years} y {exactAge.months} month {exactAge.days} days
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-black text-[10px] border border-amber-400 shadow-2xs">
                        Running {exactAge.runningYear} Year
                      </span>
                      <span className="block text-[9px] text-amber-800 font-serif font-medium">
                        (চৎলিবা {toBengaliDigits(exactAge.runningYear)}শুবা চহি)
                      </span>
                    </div>
                  </div>
                )}

                {/* POB */}
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px] font-medium">POB (পোকপা মফম):</span>
                  <span className="font-bold text-slate-900 truncate block">
                    {formData.pob} <span className="text-[10px] text-slate-500 font-normal">({Number(formData.lat).toFixed(2)}°N, {Number(formData.lng).toFixed(2)}°E)</span>
                  </span>
                </div>

                {/* Lagna (Ascendant) */}
                <div className="bg-amber-50/70 rounded-lg p-1.5 border border-amber-200/70">
                  <span className="text-amber-800 font-black block text-[10px]">Lagna (লগ্ন):</span>
                  <span className="font-bold text-slate-900 block leading-tight">
                    {ZODIAC_SIGNS[calculationResults.ascSignIndex]?.name}
                    <span className="text-[10px] text-amber-900 font-normal ml-1">
                      ({BENGALI_RASHI_NAMES[calculationResults.ascSignIndex]?.bn || ''})
                    </span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 block">
                    {formatDms(calculationResults.ascSignDegree)}
                  </span>
                </div>

                {/* Rashi (Moon Sign) */}
                <div className="bg-blue-50/70 rounded-lg p-1.5 border border-blue-200/70">
                  <span className="text-blue-800 font-black block text-[10px]">Rashi (চন্দ্র রাশি):</span>
                  <span className="font-bold text-slate-900 block leading-tight">
                    {calculationResults.moon.signName}
                    <span className="text-[10px] text-blue-900 font-normal ml-1">
                      ({BENGALI_RASHI_NAMES[calculationResults.moon.signIndex]?.bn || ''})
                    </span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 block">
                    {formatDms(calculationResults.moon.signDegree)}
                  </span>
                </div>

                {/* Nakshatra & Pada */}
                <div className="col-span-2 bg-slate-50 rounded-lg p-1.5 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-medium">Nakshatra (নক্ষত্র ও পদ):</span>
                    <span className="font-bold text-slate-900">
                      {calculationResults.moonNak.name} ({calculationResults.panchanga.moonNakshatraName})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[10px] border border-amber-300">
                      Pada {calculationResults.moon.nakshatraPada} (পদ {toBengaliDigits(calculationResults.moon.nakshatraPada)})
                    </span>
                  </div>
                </div>

                {/* Tithi & Paksha */}
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Tithi (তিথি):</span>
                  <span className="font-bold text-slate-900 leading-tight block">
                    {calculationResults.panchanga.tithiName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {calculationResults.panchanga.paksha}
                  </span>
                </div>

                {/* Yoga & Karana */}
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Yoga & Karana (যোগ ও করণ):</span>
                  <span className="font-bold text-slate-900 leading-tight block">
                    {calculationResults.panchanga.yogaName}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono block">
                    করণ: {calculationResults.panchanga.karanaName}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. BALANCE OF DASHA AT BIRTH */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-300/80 p-2.5 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  Balance of Dasha at Birth (পোকপদা লৈরম্বা দশা ভোগ)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-black">
                  {calculationResults.panchanga.vimshottariDasha.lordName} ({calculationResults.panchanga.vimshottariDasha.lordBengali})
                </span>
              </div>

              <div className="bg-white/90 rounded-lg p-2 border border-amber-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium text-[11px]">Duration (মতম):</span>
                  <span className="font-bold text-amber-900 font-mono text-[11px]">
                    {calculationResults.panchanga.vimshottariDasha.years}Y {calculationResults.panchanga.vimshottariDasha.months}M {calculationResults.panchanga.vimshottariDasha.days}D {calculationResults.panchanga.vimshottariDasha.hours}H
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium text-[11px]">Panchanga ভোগ:</span>
                  <span className="font-bold text-slate-800 font-serif text-[11px]">
                    {calculationResults.panchanga.vimshottariDasha.formattedString}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-amber-100 text-[10px] font-mono">
                  <span className="text-slate-500">
                    Start: <strong className="text-slate-900">{formatDateNice(formData.dob)}</strong>
                  </span>
                  <span className="text-slate-500">
                    Ending: <strong className="text-emerald-700">{calculationResults.birthDashaPeriod ? formatDateNice(calculationResults.birthDashaPeriod.endDate) : '-'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* 3. PRESENT RUNNING DASHA STATUS */}
            <div className="bg-white rounded-xl border border-emerald-200 p-2.5 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Present Running Dasha (হৌজিক চৎলিবা দশা)
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Active as on Today
                </span>
              </div>

              {/* Mahadasha */}
              <div className="bg-emerald-50/50 rounded-lg p-2 border border-emerald-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium text-[11px]">Mahadasha (মহাদশা):</span>
                  <span className="font-black text-emerald-800 text-xs">
                    {calculationResults.activeMaha?.lord || '-'}
                    <span className="font-serif font-semibold ml-1 text-emerald-900">
                      ({BENGALI_PLANET_NAMES[calculationResults.activeMaha?.lord || ''] || ''})
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-slate-600">
                  <span>From: <strong className="text-slate-900">{calculationResults.activeMaha ? formatDateNice(calculationResults.activeMaha.startDate) : '-'}</strong></span>
                  <span>To: <strong className="text-emerald-700">{calculationResults.activeMaha ? formatDateNice(calculationResults.activeMaha.endDate) : '-'}</strong></span>
                </div>
                {mahaRemaining && (
                  <div className="flex items-center justify-between text-[11px] pt-1.5 mt-1.5 border-t border-emerald-200/70">
                    <span className="text-emerald-950 font-bold text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-700" />
                      Remaining (লেমহৌরিবা মতম):
                    </span>
                    <span className="font-black text-emerald-900 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-300 shadow-2xs">
                      {mahaRemaining.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Antardasha */}
              <div className="bg-teal-50/50 rounded-lg p-2 border border-teal-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium text-[11px]">Antardasha (অন্তর্দশা):</span>
                  <span className="font-black text-teal-800 text-xs">
                    {calculationResults.activeAntar?.lord || '-'}
                    <span className="font-serif font-semibold ml-1 text-teal-900">
                      ({BENGALI_PLANET_NAMES[calculationResults.activeAntar?.lord || ''] || ''})
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-slate-600">
                  <span>From: <strong className="text-slate-900">{calculationResults.activeAntar ? formatDateNice(calculationResults.activeAntar.startDate) : '-'}</strong></span>
                  <span>To: <strong className="text-teal-700">{calculationResults.activeAntar ? formatDateNice(calculationResults.activeAntar.endDate) : '-'}</strong></span>
                </div>
                {antarRemaining && (
                  <div className="flex items-center justify-between text-[11px] pt-1.5 mt-1.5 border-t border-teal-200/70">
                    <span className="text-teal-950 font-bold text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-700" />
                      Remaining (লেমহৌরিবা মতম):
                    </span>
                    <span className="font-black text-teal-900 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-teal-300 shadow-2xs">
                      {antarRemaining.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Pratyantardasha (Sub-period) */}
              {calculationResults.activePratyantar && (
                <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-200">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-medium">Pratyantardasha (প্রত্যন্তর দশা):</span>
                    <span className="font-bold text-slate-900">
                      {calculationResults.activePratyantar.lord} ({BENGALI_PLANET_NAMES[calculationResults.activePratyantar.lord] || ''})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono mt-0.5 text-slate-500">
                    <span>{formatDateNice(calculationResults.activePratyantar.startDate)}</span>
                    <span>→</span>
                    <span className="font-bold text-slate-800">{formatDateNice(calculationResults.activePratyantar.endDate)}</span>
                  </div>
                  {pratyantarRemaining && (
                    <div className="flex items-center justify-between text-[10px] pt-1 mt-1 border-t border-slate-200">
                      <span className="text-slate-600 font-medium text-[9px]">Remaining (লেমহৌরিবা):</span>
                      <span className="font-bold text-slate-900 font-mono text-[10px]">
                        {pratyantarRemaining.text}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
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
            <div className="flex justify-center p-2 bg-[#fbfdfb] border border-slate-200 rounded-2xl w-full">
              {chartStyle === 'north' ? (
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
              ) : (
                <BengaliChart
                  title="Gochara Transit Chart"
                  planets={gocharaResults.transits.map(gt => ({
                    name: gt.name,
                    abbr: VEDIC_PLANET_CONFIG[gt.id]?.abbr || gt.name.substring(0, 2),
                    houseNumber: SIGN_ABBRS.indexOf(gt.signAbbr) + 1,
                    isRetrograde: !!gt.isRetrograde,
                  }))}
                  ascendantSign={Math.floor(gocharaResults.transitAscendant / 30)}
                  theme="light"
                />
              )}
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
