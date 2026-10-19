import * as Astronomy from 'astronomy-engine';
import { BirthData } from '../types/astrology';
import { getAyanamsa } from './ephemeris';

// ============================================================================
// KP ASTROLOGY (KRISHNAMURTI PADDHATI) CONSTANTS
// ============================================================================

export const KP_PLANET_ORDER = ['su', 'mo', 'ma', 'me', 'ju', 've', 'sa', 'ra', 'ke'] as const;

export const KP_PLANET_NAMES: Record<string, { en: string; bn: string; abbr: string; color: string }> = {
  su: { en: 'Sun', bn: 'রবি', abbr: 'Su', color: '#ea580c' },
  mo: { en: 'Moon', bn: 'চন্দ্র', abbr: 'Mo', color: '#0284c7' },
  ma: { en: 'Mars', bn: 'মঙ্গল', abbr: 'Ma', color: '#dc2626' },
  me: { en: 'Mercury', bn: 'বুধ', abbr: 'Me', color: '#16a34a' },
  ju: { en: 'Jupiter', bn: 'বৃহস্পতি', abbr: 'Ju', color: '#d97706' },
  ve: { en: 'Venus', bn: 'শুক্র', abbr: 'Ve', color: '#ec4899' },
  sa: { en: 'Saturn', bn: 'শনি', abbr: 'Sa', color: '#475569' },
  ra: { en: 'Rahu', bn: 'রাহু', abbr: 'Ra', color: '#7c3aed' },
  ke: { en: 'Ketu', bn: 'কেতু', abbr: 'Ke', color: '#9333ea' },
};

export const KP_RASHIS = [
  { index: 0, en: 'Aries', bn: 'মেষ', lord: 'Mars', abbr: 'Ar' },
  { index: 1, en: 'Taurus', bn: 'বৃষ', lord: 'Venus', abbr: 'Ta' },
  { index: 2, en: 'Gemini', bn: 'মিথুন', lord: 'Mercury', abbr: 'Ge' },
  { index: 3, en: 'Cancer', bn: 'কর্কট', lord: 'Moon', abbr: 'Cn' },
  { index: 4, en: 'Leo', bn: 'সিংহ', lord: 'Sun', abbr: 'Le' },
  { index: 5, en: 'Virgo', bn: 'কন্যা', lord: 'Mercury', abbr: 'Vi' },
  { index: 6, en: 'Libra', bn: 'তুলা', lord: 'Venus', abbr: 'Li' },
  { index: 7, en: 'Scorpio', bn: 'বৃশ্চিক', lord: 'Mars', abbr: 'Sc' },
  { index: 8, en: 'Sagittarius', bn: 'ধনু', lord: 'Jupiter', abbr: 'Sg' },
  { index: 9, en: 'Capricorn', bn: 'মকর', lord: 'Saturn', abbr: 'Cp' },
  { index: 10, en: 'Aquarius', bn: 'কুম্ভ', lord: 'Saturn', abbr: 'Aq' },
  { index: 11, en: 'Pisces', bn: 'মীন', lord: 'Jupiter', abbr: 'Pi' },
];

export const VIMSHOTTARI_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

export const STAR_LORDS_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

export const KP_NAKSHATRAS = [
  { index: 0, name: 'Ashwini', bn: 'অশ্বিনী', lord: 'Ketu' },
  { index: 1, name: 'Bharani', bn: 'ভরণী', lord: 'Venus' },
  { index: 2, name: 'Krittika', bn: 'কৃত্তিকা', lord: 'Sun' },
  { index: 3, name: 'Rohini', bn: 'রোহিণী', lord: 'Moon' },
  { index: 4, name: 'Mrigashirsha', bn: 'মৃগশিরা', lord: 'Mars' },
  { index: 5, name: 'Ardra', bn: 'আর্দ্রা', lord: 'Rahu' },
  { index: 6, name: 'Punarvasu', bn: 'পুনর্বসু', lord: 'Jupiter' },
  { index: 7, name: 'Pushya', bn: 'পুষ্যা', lord: 'Saturn' },
  { index: 8, name: 'Ashlesha', bn: 'অশ্লেষা', lord: 'Mercury' },
  { index: 9, name: 'Magha', bn: 'মঘা', lord: 'Ketu' },
  { index: 10, name: 'Purva Phalguni', bn: 'পূর্ব ফাল্গুনী', lord: 'Venus' },
  { index: 11, name: 'Uttara Phalguni', bn: 'উত্তর ফাল্গুনী', lord: 'Sun' },
  { index: 12, name: 'Hasta', bn: 'হস্তা', lord: 'Moon' },
  { index: 13, name: 'Chitra', bn: 'চিত্রা', lord: 'Mars' },
  { index: 14, name: 'Swati', bn: 'স্বাতী', lord: 'Rahu' },
  { index: 15, name: 'Vishakha', bn: 'বিশাখা', lord: 'Jupiter' },
  { index: 16, name: 'Anuradha', bn: 'অনুরাধা', lord: 'Saturn' },
  { index: 17, name: 'Jyeshtha', bn: 'জ্যেষ্ঠা', lord: 'Mercury' },
  { index: 18, name: 'Mula', bn: 'মূলা', lord: 'Ketu' },
  { index: 19, name: 'Purva Ashadha', bn: 'পূর্বাষাঢ়া', lord: 'Venus' },
  { index: 20, name: 'Uttara Ashadha', bn: 'উত্তরাষাঢ়া', lord: 'Sun' },
  { index: 21, name: 'Shravana', bn: 'শ্রবণা', lord: 'Moon' },
  { index: 22, name: 'Dhanishta', bn: 'ধনিষ্ঠা', lord: 'Mars' },
  { index: 23, name: 'Shatabhisha', bn: 'শতভিষা', lord: 'Rahu' },
  { index: 24, name: 'Purva Bhadrapada', bn: 'পূর্ব ভাদ্রপদ', lord: 'Jupiter' },
  { index: 25, name: 'Uttara Bhadrapada', bn: 'উত্তর ভাদ্রপদ', lord: 'Saturn' },
  { index: 26, name: 'Revati', bn: 'রেবতী', lord: 'Mercury' },
];

export interface KPSubDivision {
  number: number; // 1 to 249
  sign: string;
  signIndex: number;
  signLord: string;
  nakshatra: string;
  nakshatraIndex: number;
  starLord: string;
  subLord: string;
  fromDegSign: number; // in sign (0-30)
  toDegSign: number;
  fromDegAbs: number; // absolute (0-360)
  toDegAbs: number;
}

export interface KPCuspData {
  cuspNumber: number; // 1 to 12
  longitude: number; // 0 to 360
  formattedDegree: string;
  sign: string;
  signBn: string;
  signIndex: number;
  signLord: string;
  nakshatra: string;
  starLord: string;
  subLord: string;
  subSubLord: string;
  startDegree: number;
  endDegree: number;
  occupants: string[];
}

export interface KPPlanetData {
  id: string;
  name: string;
  nameBn: string;
  abbr: string;
  color: string;
  longitude: number;
  signDegree: number;
  formattedDegree: string;
  sign: string;
  signBn: string;
  signIndex: number;
  signLord: string;
  nakshatra: string;
  nakshatraIndex: number;
  starLord: string;
  subLord: string;
  subSubLord: string;
  cusp: number; // 1 to 12 (Placidus house occupied)
  isRetrograde: boolean;
  speed: number;
  dignity: string;
  rulingPlanetRoles: string[]; // RP badges
}

export interface KPHouseSignificators {
  houseNumber: number;
  level1: string[]; // Planets in star of occupant
  level2: string[]; // Occupants
  level3: string[]; // Planets in star of lord
  level4: string[]; // Lord of house
}

export interface KPPlanetSignificators {
  planet: string;
  planetName: string;
  starLord: string;
  subLord: string;
  housesL1: number[];
  housesL2: number[];
  housesL3: number[];
  housesL4: number[];
  subLordSignifies: number[];
}

export interface KPRulingPlanets {
  ascSignLord: string;
  ascStarLord: string;
  ascSubLord: string;
  moonSignLord: string;
  moonStarLord: string;
  moonSubLord: string;
  dayLord: string;
  rahuRepresents: string[];
  ketuRepresents: string[];
  rulingPlanetsSummary: string[];
}

export interface KPCuspalVerdict {
  id: string;
  title: string;
  titleBn: string;
  primaryCusp: number;
  subLord: string;
  starLordOfSub: string;
  favorableHouses: number[];
  unfavorableHouses: number[];
  neutralHouses: number[];
  signifiedHouses: number[];
  verdict: 'Strongly Favorable' | 'Favorable' | 'Mixed' | 'Unfavorable';
  verdictBn: string;
  scorePercent: number;
  analysisText: string;
}

export interface KPDashaPeriod {
  lord: string;
  lordBn: string;
  startDate: Date;
  endDate: Date;
  startDateStr: string;
  endDateStr: string;
  durationYears: number;
  level: 'maha' | 'antar' | 'pratyantar';
  subPeriods?: KPDashaPeriod[];
}

export interface KPCurrentDashaInfo {
  maha: {
    lord: string;
    lordBn: string;
    startDate: Date;
    endDate: Date;
    startDateStr: string;
    endDateStr: string;
    remainingText: string;
    progressPercent: number;
  };
  antar: {
    lord: string;
    lordBn: string;
    startDate: Date;
    endDate: Date;
    startDateStr: string;
    endDateStr: string;
    remainingText: string;
    progressPercent: number;
  };
  pratyantar?: {
    lord: string;
    lordBn: string;
    startDate: Date;
    endDate: Date;
    startDateStr: string;
    endDateStr: string;
    remainingText: string;
    progressPercent: number;
  };
}

export interface KPDashaLordSignification {
  role: 'Mahadasha (MD)' | 'Antardasha (AD)' | 'Pratyantardasha (PD)';
  planetName: string;
  planetNameBn: string;
  starLord: string;
  subLord: string;
  housesL1: number[];
  housesL2: number[];
  housesL3: number[];
  housesL4: number[];
  allSignifiedHouses: number[];
  subLordHouses: number[];
  kpRole: string;
}

export interface KPDashaPredictionSection {
  category: 'overview' | 'career' | 'wealth' | 'relationship' | 'health' | 'travel';
  title: string;
  titleBn: string;
  status: 'Highly Favorable' | 'Favorable' | 'Mixed / Transitional' | 'Challenging / Obstacles';
  statusBn: string;
  score: number; // 0 to 100
  summary: string;
  detailedAnalysis: string;
  kpSignificationsText: string;
  activatedHouses: number[];
  remedyTips: string[];
}

export interface KPDashaPredictionResult {
  currentDasha: KPCurrentDashaInfo;
  allMahadashas: KPDashaPeriod[];
  dashaLordsSignifications: KPDashaLordSignification[];
  predictions: KPDashaPredictionSection[];
}

export interface KPWorkstationCalculation {
  birthData: BirthData;
  kpAyanamsa: number;
  kpAyanamsaStr: string;
  planets: KPPlanetData[];
  cusps: KPCuspData[];
  houseSignificators: KPHouseSignificators[];
  planetSignificators: KPPlanetSignificators[];
  rulingPlanets: KPRulingPlanets;
  eventVerdicts: KPCuspalVerdict[];
  dashaPrediction?: KPDashaPredictionResult;
  horaryNumber?: number;
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

export function formatDms(deg: number): string {
  const norm = ((deg % 360) + 360) % 360;
  const d = Math.floor(norm);
  const remMinutes = (norm - d) * 60;
  const m = Math.floor(remMinutes);
  const s = Math.round((remMinutes - m) * 60);
  return `${d}° ${String(m).padStart(2, '0')}' ${String(s === 60 ? 59 : s).padStart(2, '0')}"`;
}

export function formatSignDms(longitude: number): { signIndex: number; sign: string; degInSign: number; str: string } {
  const norm = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const sign = KP_RASHIS[signIndex]?.en || 'Aries';
  const degInSign = norm % 30;
  return {
    signIndex,
    sign,
    degInSign,
    str: `${sign} ${formatDms(degInSign)}`,
  };
}

// ============================================================================
// KP 249 TABLE GENERATOR (CACHED)
// ============================================================================

let cached249Table: KPSubDivision[] | null = null;

export function getKP249Table(): KPSubDivision[] {
  if (cached249Table) return cached249Table;

  const table: KPSubDivision[] = [];
  let tableIndex = 1;

  for (let nakIdx = 0; nakIdx < 27; nakIdx++) {
    const nak = KP_NAKSHATRAS[nakIdx];
    const nakStartAbs = nakIdx * (360 / 27); // 13°20' per nakshatra
    const nakSpan = 360 / 27; // 13.333333333333334 degrees

    const starLordIdx = STAR_LORDS_ORDER.indexOf(nak.lord);

    let currentOffsetInNak = 0;

    for (let sub = 0; sub < 9; sub++) {
      const currentLordIdx = (starLordIdx + sub) % 9;
      const subLordName = STAR_LORDS_ORDER[currentLordIdx];
      const years = VIMSHOTTARI_YEARS[subLordName];
      const subSpan = (years / 120) * nakSpan; // proportional degrees

      const subStartAbs = nakStartAbs + currentOffsetInNak;
      const subEndAbs = subStartAbs + subSpan;

      const signStartIdx = Math.floor(subStartAbs / 30);
      const nextSignBoundary = (signStartIdx + 1) * 30;

      // Check if this sub-lord spans across a 30° Sign Boundary
      if (subStartAbs < nextSignBoundary && subEndAbs > nextSignBoundary) {
        // Split Part 1 (First Sign)
        table.push({
          number: tableIndex++,
          sign: KP_RASHIS[signStartIdx].en,
          signIndex: signStartIdx,
          signLord: KP_RASHIS[signStartIdx].lord,
          nakshatra: nak.name,
          nakshatraIndex: nakIdx,
          starLord: nak.lord,
          subLord: subLordName,
          fromDegSign: subStartAbs % 30,
          toDegSign: 30,
          fromDegAbs: subStartAbs,
          toDegAbs: nextSignBoundary,
        });

        // Split Part 2 (Second Sign)
        const signNextIdx = (signStartIdx + 1) % 12;
        table.push({
          number: tableIndex++,
          sign: KP_RASHIS[signNextIdx].en,
          signIndex: signNextIdx,
          signLord: KP_RASHIS[signNextIdx].lord,
          nakshatra: nak.name,
          nakshatraIndex: nakIdx,
          starLord: nak.lord,
          subLord: subLordName,
          fromDegSign: 0,
          toDegSign: subEndAbs % 30,
          fromDegAbs: nextSignBoundary,
          toDegAbs: subEndAbs,
        });
      } else {
        table.push({
          number: tableIndex++,
          sign: KP_RASHIS[signStartIdx].en,
          signIndex: signStartIdx,
          signLord: KP_RASHIS[signStartIdx].lord,
          nakshatra: nak.name,
          nakshatraIndex: nakIdx,
          starLord: nak.lord,
          subLord: subLordName,
          fromDegSign: subStartAbs % 30,
          toDegSign: subEndAbs % 30,
          fromDegAbs: subStartAbs,
          toDegAbs: subEndAbs,
        });
      }

      currentOffsetInNak += subSpan;
    }
  }

  cached249Table = table;
  return table;
}

// ============================================================================
// KP SUB-LORD AND SUB-SUB-LORD DETECTOR
// ============================================================================

export function getKPSubLordAndSSL(longitude: number): {
  signIndex: number;
  sign: string;
  signBn: string;
  signLord: string;
  nakshatraIndex: number;
  nakshatra: string;
  nakshatraBn: string;
  starLord: string;
  subLord: string;
  subSubLord: string;
  pada: number;
  horaryNumber: number;
  degInSign: number;
} {
  const norm = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const degInSign = norm % 30;

  const nakSpan = 360 / 27; // 13° 20' = 13.3333333333°
  const nakIndex = Math.min(26, Math.floor(norm / nakSpan));
  const nakDeg = norm - nakIndex * nakSpan;
  const pada = Math.min(4, Math.floor(nakDeg / (nakSpan / 4)) + 1);

  const nakObj = KP_NAKSHATRAS[nakIndex];
  const starLord = nakObj.lord;
  const starLordIdx = STAR_LORDS_ORDER.indexOf(starLord);

  // Sub Lord Calculation
  let cumulative = 0;
  let subLord = starLord;
  let subStart = 0;
  let subSpan = 0;

  for (let s = 0; s < 9; s++) {
    const curIdx = (starLordIdx + s) % 9;
    const curLord = STAR_LORDS_ORDER[curIdx];
    const span = (VIMSHOTTARI_YEARS[curLord] / 120) * nakSpan;

    if (nakDeg >= cumulative && nakDeg < cumulative + span + 0.0000001) {
      subLord = curLord;
      subStart = cumulative;
      subSpan = span;
      break;
    }
    cumulative += span;
  }

  // Sub-Sub Lord Calculation (proportional division of the Sub span)
  const degInSub = Math.max(0, nakDeg - subStart);
  const subLordIdx = STAR_LORDS_ORDER.indexOf(subLord);
  let subSubLord = subLord;
  let sslCumulative = 0;

  for (let ssl = 0; ssl < 9; ssl++) {
    const curSSLIdx = (subLordIdx + ssl) % 9;
    const curSSLLord = STAR_LORDS_ORDER[curSSLIdx];
    const sslSpan = (VIMSHOTTARI_YEARS[curSSLLord] / 120) * subSpan;

    if (degInSub >= sslCumulative && degInSub < sslCumulative + sslSpan + 0.0000001) {
      subSubLord = curSSLLord;
      break;
    }
    sslCumulative += sslSpan;
  }

  // Find KP 249 Horary Number
  const table249 = getKP249Table();
  const horaryEntry = table249.find((row) => norm >= row.fromDegAbs - 0.00001 && norm < row.toDegAbs + 0.00001);
  const horaryNumber = horaryEntry ? horaryEntry.number : 1;

  return {
    signIndex,
    sign: KP_RASHIS[signIndex].en,
    signBn: KP_RASHIS[signIndex].bn,
    signLord: KP_RASHIS[signIndex].lord,
    nakshatraIndex: nakIndex,
    nakshatra: nakObj.name,
    nakshatraBn: nakObj.bn,
    starLord,
    subLord,
    subSubLord,
    pada,
    horaryNumber,
    degInSign,
  };
}

// ============================================================================
// KP AYANAMSHA (KRISHNAMURTI NEW)
// ============================================================================

/**
 * Krishnamurti Ayanamsha:
 * Calibrated against standard KP ephemeris (0° 05' 29.5" less than Lahiri).
 */
export function getKPAyanamsa(jd: number): number {
  const lahiri = getAyanamsa(jd);
  // KP Ayanamsa offset: 5 minutes 29.5 seconds = 0.0915277 degrees
  return lahiri - 0.0915277;
}

// ============================================================================
// PLACIDUS HOUSE CUSPS (NIRAYANA KP)
// ============================================================================

/**
 * Calculate tropical Placidus house cusps (1 to 12) from RAMC and geographic latitude.
 * Uses exact semi-arc iteration that converges in 3-4 steps.
 */
function solveTropicalPlacidusCusps(ramcDeg: number, latDeg: number, oblDeg: number): number[] {
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  const ramc = ramcDeg * deg2rad;
  const lat = latDeg * deg2rad;
  const obl = oblDeg * deg2rad;

  // 10th Cusp (MC)
  const mcTrop = ((Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(obl)) * rad2deg + 360) % 360);

  // 1st Cusp (Ascendant)
  const ascRad = Math.atan2(
    Math.cos(ramc),
    -(Math.sin(ramc) * Math.cos(obl) + Math.tan(lat) * Math.sin(obl))
  );
  const ascTrop = ((ascRad * rad2deg + 360) % 360);

  // Function to solve intermediate cusps (11, 12, 2, 3)
  const solveIntermediateCusp = (targetRAMCDeg: number, semiArcFactor: number): number => {
    let lambda = (mcTrop + (targetRAMCDeg - ramcDeg) + 360) % 360;

    for (let iter = 0; iter < 5; iter++) {
      const lamRad = lambda * deg2rad;
      const sinDec = Math.sin(obl) * Math.sin(lamRad);
      const dec = Math.asin(Math.max(-0.999, Math.min(0.999, sinDec)));

      // Semi-diurnal or semi-nocturnal arc addition
      const tanLatTanDec = Math.tan(lat) * Math.tan(dec);
      const clamped = Math.max(-0.999, Math.min(0.999, tanLatTanDec));
      const ascDiff = Math.asin(clamped);

      const targetRA = (targetRAMCDeg * deg2rad + semiArcFactor * ascDiff + 2 * Math.PI) % (2 * Math.PI);

      const newLamRad = Math.atan2(
        Math.sin(targetRA) / Math.cos(obl),
        Math.cos(targetRA)
      );
      lambda = ((newLamRad * rad2deg + 360) % 360);
    }
    return lambda;
  };

  const cusp11 = solveIntermediateCusp(ramcDeg + 30, 1 / 3);
  const cusp12 = solveIntermediateCusp(ramcDeg + 60, 2 / 3);
  const cusp2 = solveIntermediateCusp(ramcDeg + 120, 2 / 3);
  const cusp3 = solveIntermediateCusp(ramcDeg + 150, 1 / 3);

  const cusp1 = ascTrop;
  const cusp4 = (mcTrop + 180) % 360;
  const cusp5 = (cusp11 + 180) % 360;
  const cusp6 = (cusp12 + 180) % 360;
  const cusp7 = (ascTrop + 180) % 360;
  const cusp8 = (cusp2 + 180) % 360;
  const cusp9 = (cusp3 + 180) % 360;
  const cusp10 = mcTrop;

  return [cusp1, cusp2, cusp3, cusp4, cusp5, cusp6, cusp7, cusp8, cusp9, cusp10, cusp11, cusp12];
}

// ============================================================================
// MAIN KP ENGINE CALCULATION
// ============================================================================

export function calculateKPWorkstation(birthData: BirthData): KPWorkstationCalculation {
  let year: number, month: number, day: number;
  let h: number, m: number;

  if (birthData.dateOfBirth instanceof Date) {
    year = birthData.dateOfBirth.getFullYear();
    month = birthData.dateOfBirth.getMonth() + 1;
    day = birthData.dateOfBirth.getDate();
  } else {
    const parts = String(birthData.dateOfBirth || '').split('-').map(Number);
    year = parts[0] || 2000;
    month = parts[1] || 1;
    day = parts[2] || 1;
  }

  const timeParts = (birthData.timeOfBirth || '06:00').split(':').map(Number);
  h = timeParts[0] || 0;
  m = timeParts[1] || 0;

  const localHourDecimal = h + m / 60;
  const utcHourDecimal = localHourDecimal - (birthData.utcOffset ?? 5.5);

  const totalMinutes = Math.round(utcHourDecimal * 60);
  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, totalMinutes, 0));

  const astroTime = new Astronomy.AstroTime(utcDate);
  const jd = astroTime.ut + 2451545.0;
  const kpAyanamsa = getKPAyanamsa(jd);
  const T = (jd - 2451545.0) / 36525.0;

  // Local Sidereal Time and RAMC
  const gast = Astronomy.SiderealTime(astroTime);
  const lst = (gast + birthData.longitude / 15.0 + 24.0) % 24.0;
  const ramcDeg = lst * 15.0;
  const obliquity = 23.4392911 - 0.0130042 * T;

  // 1. Calculate Placidus Tropical Cusps & convert to Nirayana KP Cusps
  const tropicalCusps = solveTropicalPlacidusCusps(ramcDeg, birthData.latitude, obliquity);
  const nirayanaCuspsLongitudes = tropicalCusps.map((c) => (c - kpAyanamsa + 360) % 360);

  // 2. Calculate Planets (Tropical to Sidereal KP)
  const meanNodeTropical =
    (125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000.0) % 360.0;
  const rahuTropical = (meanNodeTropical + 360.0) % 360.0;
  const ketuTropical = (rahuTropical + 180.0) % 360.0;

  const bodyMap: Record<string, Astronomy.Body> = {
    su: Astronomy.Body.Sun,
    mo: Astronomy.Body.Moon,
    me: Astronomy.Body.Mercury,
    ve: Astronomy.Body.Venus,
    ma: Astronomy.Body.Mars,
    ju: Astronomy.Body.Jupiter,
    sa: Astronomy.Body.Saturn,
  };

  const rawPlanets: { id: string; longitude: number; speed: number; isRetrograde: boolean }[] = [];

  for (const pid of KP_PLANET_ORDER) {
    if (pid === 'ra') {
      const lon = (rahuTropical - kpAyanamsa + 360.0) % 360.0;
      rawPlanets.push({ id: 'ra', longitude: lon, speed: -0.05295, isRetrograde: true });
    } else if (pid === 'ke') {
      const lon = (ketuTropical - kpAyanamsa + 360.0) % 360.0;
      rawPlanets.push({ id: 'ke', longitude: lon, speed: -0.05295, isRetrograde: true });
    } else {
      const body = bodyMap[pid];
      if (body) {
        const vec = Astronomy.GeoVector(body, astroTime, true);
        const ecl = Astronomy.Ecliptic(vec);
        const lon = (ecl.elon - kpAyanamsa + 360.0) % 360.0;

        // Velocity via 1-hour differentiation
        const nextTime = astroTime.AddDays(1.0 / 24.0);
        const vecNext = Astronomy.GeoVector(body, nextTime, true);
        const eclNext = Astronomy.Ecliptic(vecNext);
        const speed = (eclNext.elon - ecl.elon) * 24.0;
        const isRetrograde = speed < 0;

        rawPlanets.push({ id: pid, longitude: lon, speed, isRetrograde });
      }
    }
  }

  // 3. Determine Cusp/House Occupied by each Planet (Placidus Nirayana Cusps)
  const getHouseOccupied = (pLon: number): number => {
    for (let h = 0; h < 12; h++) {
      const cStart = nirayanaCuspsLongitudes[h];
      const cEnd = nirayanaCuspsLongitudes[(h + 1) % 12];
      if (cStart < cEnd) {
        if (pLon >= cStart && pLon < cEnd) return h + 1;
      } else {
        // Across 360° boundary
        if (pLon >= cStart || pLon < cEnd) return h + 1;
      }
    }
    return 1;
  };

  // Build Full Planet Data
  const planets: KPPlanetData[] = rawPlanets.map((p) => {
    const pInfo = KP_PLANET_NAMES[p.id];
    const sub = getKPSubLordAndSSL(p.longitude);
    const cusp = getHouseOccupied(p.longitude);

    let dignity = 'Neutral';
    if (p.id === 'su') {
      if (sub.signIndex === 0) dignity = 'Exalted';
      else if (sub.signIndex === 4) dignity = 'Own';
      else if (sub.signIndex === 6) dignity = 'Debilitated';
    } else if (p.id === 'mo') {
      if (sub.signIndex === 1) dignity = 'Exalted';
      else if (sub.signIndex === 3) dignity = 'Own';
      else if (sub.signIndex === 7) dignity = 'Debilitated';
    } else if (p.id === 'ma') {
      if (sub.signIndex === 9) dignity = 'Exalted';
      else if (sub.signIndex === 0 || sub.signIndex === 7) dignity = 'Own';
      else if (sub.signIndex === 3) dignity = 'Debilitated';
    } else if (p.id === 'me') {
      if (sub.signIndex === 5) dignity = 'Exalted / Own';
      else if (sub.signIndex === 2) dignity = 'Own';
      else if (sub.signIndex === 11) dignity = 'Debilitated';
    } else if (p.id === 'ju') {
      if (sub.signIndex === 3) dignity = 'Exalted';
      else if (sub.signIndex === 8 || sub.signIndex === 11) dignity = 'Own';
      else if (sub.signIndex === 9) dignity = 'Debilitated';
    } else if (p.id === 've') {
      if (sub.signIndex === 11) dignity = 'Exalted';
      else if (sub.signIndex === 1 || sub.signIndex === 6) dignity = 'Own';
      else if (sub.signIndex === 5) dignity = 'Debilitated';
    } else if (p.id === 'sa') {
      if (sub.signIndex === 6) dignity = 'Exalted';
      else if (sub.signIndex === 9 || sub.signIndex === 10) dignity = 'Own';
      else if (sub.signIndex === 0) dignity = 'Debilitated';
    }

    return {
      id: p.id,
      name: pInfo.en,
      nameBn: pInfo.bn,
      abbr: pInfo.abbr,
      color: pInfo.color,
      longitude: p.longitude,
      signDegree: sub.degInSign,
      formattedDegree: formatDms(sub.degInSign),
      sign: sub.sign,
      signBn: sub.signBn,
      signIndex: sub.signIndex,
      signLord: sub.signLord,
      nakshatra: sub.nakshatra,
      nakshatraIndex: sub.nakshatraIndex,
      starLord: sub.starLord,
      subLord: sub.subLord,
      subSubLord: sub.subSubLord,
      cusp,
      isRetrograde: p.isRetrograde,
      speed: p.speed,
      dignity,
      rulingPlanetRoles: [],
    };
  });

  // Build Full Cusps Data
  const cusps: KPCuspData[] = nirayanaCuspsLongitudes.map((cLon, idx) => {
    const cuspNumber = idx + 1;
    const sub = getKPSubLordAndSSL(cLon);
    const nextLon = nirayanaCuspsLongitudes[(idx + 1) % 12];

    const occupants = planets.filter((p) => p.cusp === cuspNumber).map((p) => p.name);

    return {
      cuspNumber,
      longitude: cLon,
      formattedDegree: formatDms(sub.degInSign),
      sign: sub.sign,
      signBn: sub.signBn,
      signIndex: sub.signIndex,
      signLord: sub.signLord,
      nakshatra: sub.nakshatra,
      starLord: sub.starLord,
      subLord: sub.subLord,
      subSubLord: sub.subSubLord,
      startDegree: cLon,
      endDegree: nextLon,
      occupants,
    };
  });

  // 4. Calculate 4-Fold Significators
  // Level 1: Planets in star of occupants of the house
  // Level 2: Occupants of the house
  // Level 3: Planets in star of lord of the house
  // Level 4: Lord of the house
  const houseSignificators: KPHouseSignificators[] = [];

  for (let h = 1; h <= 12; h++) {
    const cuspObj = cusps[h - 1];
    const occupants = planets.filter((p) => p.cusp === h);
    const occupantNames = occupants.map((p) => p.name);

    // Planets in star of occupants
    const level1Planets = planets
      .filter((p) => occupantNames.includes(p.starLord))
      .map((p) => p.name);

    // Planets in star of house sign lord
    const level3Planets = planets
      .filter((p) => p.starLord === cuspObj.signLord)
      .map((p) => p.name);

    houseSignificators.push({
      houseNumber: h,
      level1: Array.from(new Set(level1Planets)),
      level2: occupantNames,
      level3: Array.from(new Set(level3Planets)),
      level4: [cuspObj.signLord],
    });
  }

  // Planet-Wise Significators
  const planetSignificators: KPPlanetSignificators[] = planets.map((p) => {
    const l1Houses: number[] = [];
    const l2Houses: number[] = [];
    const l3Houses: number[] = [];
    const l4Houses: number[] = [];

    houseSignificators.forEach((hs) => {
      if (hs.level1.includes(p.name)) l1Houses.push(hs.houseNumber);
      if (hs.level2.includes(p.name)) l2Houses.push(hs.houseNumber);
      if (hs.level3.includes(p.name)) l3Houses.push(hs.houseNumber);
      if (hs.level4.includes(p.name)) l4Houses.push(hs.houseNumber);
    });

    // Sub Lord signification
    const subLordHouses: number[] = [];
    houseSignificators.forEach((hs) => {
      if (
        hs.level1.includes(p.subLord) ||
        hs.level2.includes(p.subLord) ||
        hs.level3.includes(p.subLord) ||
        hs.level4.includes(p.subLord)
      ) {
        subLordHouses.push(hs.houseNumber);
      }
    });

    return {
      planet: p.id,
      planetName: p.name,
      starLord: p.starLord,
      subLord: p.subLord,
      housesL1: Array.from(new Set(l1Houses)),
      housesL2: Array.from(new Set(l2Houses)),
      housesL3: Array.from(new Set(l3Houses)),
      housesL4: Array.from(new Set(l4Houses)),
      subLordSignifies: Array.from(new Set(subLordHouses)),
    };
  });

  // 5. Ruling Planets (RP)
  const lagnaCusp = cusps[0];
  const moonPlanet = planets.find((p) => p.id === 'mo') || planets[1];

  // Day Lord based on birth weekday
  const weekDays = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const birthDayIdx = utcDate.getUTCDay();
  const dayLord = weekDays[birthDayIdx];

  // Rahu / Ketu agents
  const rahuP = planets.find((p) => p.id === 'ra');
  const ketuP = planets.find((p) => p.id === 'ke');

  const getAgentSummary = (nodePlanet?: KPPlanetData) => {
    if (!nodePlanet) return [];
    const agents: string[] = [nodePlanet.signLord];
    // Conjunctions within 7°
    planets.forEach((other) => {
      if (other.id !== nodePlanet.id && other.id !== 'ra' && other.id !== 'ke') {
        const diff = Math.abs(nodePlanet.longitude - other.longitude);
        if (Math.min(diff, 360 - diff) <= 7) {
          agents.push(other.name);
        }
      }
    });
    return Array.from(new Set(agents));
  };

  const rahuRepresents = getAgentSummary(rahuP);
  const ketuRepresents = getAgentSummary(ketuP);

  const rpSummary = Array.from(
    new Set([
      lagnaCusp.starLord,
      lagnaCusp.signLord,
      moonPlanet.starLord,
      moonPlanet.signLord,
      dayLord,
      ...rahuRepresents,
      ...ketuRepresents,
    ])
  );

  const rulingPlanets: KPRulingPlanets = {
    ascSignLord: lagnaCusp.signLord,
    ascStarLord: lagnaCusp.starLord,
    ascSubLord: lagnaCusp.subLord,
    moonSignLord: moonPlanet.signLord,
    moonStarLord: moonPlanet.starLord,
    moonSubLord: moonPlanet.subLord,
    dayLord,
    rahuRepresents,
    ketuRepresents,
    rulingPlanetsSummary: rpSummary,
  };

  // Add RP badges to planets
  planets.forEach((p) => {
    const roles: string[] = [];
    if (p.name === lagnaCusp.signLord) roles.push('Lagna Sign Lord');
    if (p.name === lagnaCusp.starLord) roles.push('Lagna Star Lord');
    if (p.name === lagnaCusp.subLord) roles.push('Lagna Sub Lord');
    if (p.name === moonPlanet.signLord) roles.push('Moon Sign Lord');
    if (p.name === moonPlanet.starLord) roles.push('Moon Star Lord');
    if (p.name === moonPlanet.subLord) roles.push('Moon Sub Lord');
    if (p.name === dayLord) roles.push('Day Lord');
    p.rulingPlanetRoles = roles;
  });

  // 6. Cuspal Interlink Event Predictions
  const getPlanetarySignifiedHouses = (planetName: string): number[] => {
    const pSig = planetSignificators.find((ps) => ps.planetName === planetName);
    if (!pSig) return [];
    return Array.from(new Set([...pSig.housesL1, ...pSig.housesL2, ...pSig.housesL3, ...pSig.housesL4]));
  };

  const evaluateEvent = (
    id: string,
    title: string,
    titleBn: string,
    primaryCuspNum: number,
    favorable: number[],
    unfavorable: number[],
    neutral: number[]
  ): KPCuspalVerdict => {
    const cObj = cusps[primaryCuspNum - 1];
    const csl = cObj.subLord;
    const subStar = getPlanetarySignifiedHouses(csl);

    // Sub Lord of CSL
    const cslPlanet = planets.find((p) => p.name === csl);
    const cslSubLord = cslPlanet ? cslPlanet.subLord : csl;
    const subSubHouses = getPlanetarySignifiedHouses(cslSubLord);

    const allSignified = Array.from(new Set([...subStar, ...subSubHouses]));

    const favMatches = allSignified.filter((h) => favorable.includes(h));
    const unfavMatches = allSignified.filter((h) => unfavorable.includes(h));

    let verdict: 'Strongly Favorable' | 'Favorable' | 'Mixed' | 'Unfavorable' = 'Mixed';
    let verdictBn = 'মিশ্র ফল (Mixed)';
    let score = 50;

    if (favMatches.length >= 2 && unfavMatches.length === 0) {
      verdict = 'Strongly Favorable';
      verdictBn = 'অত্যন্ত শুভ ও সিদ্ধি (Strongly Favorable)';
      score = 92;
    } else if (favMatches.length >= 1 && unfavMatches.length <= 1) {
      verdict = 'Favorable';
      verdictBn = 'শুভ ও অনুকূল (Favorable)';
      score = 75;
    } else if (unfavMatches.length >= 2 && favMatches.length === 0) {
      verdict = 'Unfavorable';
      verdictBn = 'বাধাপ্রদ ও প্রতিকূল (Unfavorable / Obstacles)';
      score = 25;
    } else {
      verdict = 'Mixed';
      verdictBn = 'মিশ্র ও বিলম্বে ফল (Mixed with Delay)';
      score = 50;
    }

    const analysisText = `Cusp ${primaryCuspNum} Sub-Lord is ${csl}, deposited in the star signifying houses [${subStar.join(', ') || '-'}], with Sub-Lord ${cslSubLord} signifying [${subSubHouses.join(', ') || '-'}]. Favorable houses connected: [${favMatches.join(', ') || 'None'}]. Detrimental houses: [${unfavMatches.join(', ') || 'None'}].`;

    return {
      id,
      title,
      titleBn,
      primaryCusp: primaryCuspNum,
      subLord: csl,
      starLordOfSub: cslPlanet?.starLord || '-',
      favorableHouses: favorable,
      unfavorableHouses: unfavorable,
      neutralHouses: neutral,
      signifiedHouses: allSignified,
      verdict,
      verdictBn,
      scorePercent: score,
      analysisText,
    };
  };

  const eventVerdicts: KPCuspalVerdict[] = [
    evaluateEvent('marriage', 'Marriage & Matrimony (বিবাহ)', 'বিবাহ বিচার (Marriage)', 7, [2, 7, 11], [1, 6, 10], [5, 8, 12]),
    evaluateEvent('career', 'Career & Job (চাকরি ও কর্ম)', 'কর্ম ও পদোন্নতি (Career & Promotion)', 10, [2, 6, 10, 11], [5, 9, 8], [1, 3, 7]),
    evaluateEvent('wealth', 'Financial Gain & Wealth (ধন-লাভ)', 'ধন ও আর্থিক উন্নতি (Wealth & Inflow)', 2, [2, 6, 11], [5, 8, 12], [1, 10]),
    evaluateEvent('childbirth', 'Progeny & Childbirth (সন্তান লাভ)', 'সন্তান প্রাপ্তি (Childbirth & Progeny)', 5, [2, 5, 11], [1, 4, 10], [3, 9]),
    evaluateEvent('foreign', 'Foreign Travel & Settlement (বিদেশ গমন)', 'বিদেশ যাত্রা ও বসবাস (Foreign Travel)', 12, [3, 9, 12], [2, 4, 11], [1, 6]),
    evaluateEvent('health', 'Health & Disease Recovery (আরোগ্য)', 'স্বাস্থ্য ও রোগমুক্তি (Health Recovery)', 6, [1, 5, 11], [6, 8, 12], [2, 10]),
    evaluateEvent('property', 'Property & Vehicles (বাড়ি ও গাড়ি)', 'ভূমি, গৃহ ও বাহন লাভ (Property & Vehicle)', 4, [4, 11, 12], [3, 6, 8], [1, 2]),
    evaluateEvent('education', 'Higher Education & Exams (উচ্চশিক্ষা)', 'উচ্চশিক্ষা ও পরীক্ষা সিদ্ধি (Education)', 9, [4, 9, 11], [3, 8], [1, 2]),
    evaluateEvent('litigation', 'Litigation & Court Disputes (আইন জয়)', 'মামলা ও বিবাদ জয় (Litigation Win)', 6, [6, 11], [12], [1, 5]),
  ];

  // 7. Calculate KP Vimshottari Dasha & Generate KP Dasha Predictions
  const moonP = planets.find((p) => p.id === 'mo') || planets[1];
  const birthDateObj = new Date(year, month - 1, day, h, m);
  const dashaPrediction = generateKPDashaAnalysis(
    moonP.longitude,
    birthDateObj,
    planetSignificators,
    planets,
    cusps
  );

  return {
    birthData,
    kpAyanamsa,
    kpAyanamsaStr: formatDms(kpAyanamsa),
    planets,
    cusps,
    houseSignificators,
    planetSignificators,
    rulingPlanets,
    eventVerdicts,
    dashaPrediction,
  };
}

// ============================================================================
// KP HORARY 1-249 CALCULATION
// ============================================================================

export function calculateKPHoraryChart(horaryNumber: number, birthData: BirthData): KPWorkstationCalculation {
  const table = getKP249Table();
  const clampedNum = Math.max(1, Math.min(249, Math.round(horaryNumber)));
  const row = table.find((r) => r.number === clampedNum) || table[0];

  // Center degree of this horary sub division
  const horaryAscendant = (row.fromDegAbs + row.toDegAbs) / 2;

  // Run base calculation for transit planets
  const baseCalc = calculateKPWorkstation(birthData);

  // Re-adjust cusps so that Cusp 1 is the Horary Ascendant
  const offset = (horaryAscendant - baseCalc.cusps[0].longitude + 360) % 360;
  const horaryCusps = baseCalc.cusps.map((c) => {
    const newLon = (c.longitude + offset) % 360;
    const sub = getKPSubLordAndSSL(newLon);
    return {
      ...c,
      longitude: newLon,
      formattedDegree: formatDms(sub.degInSign),
      sign: sub.sign,
      signBn: sub.signBn,
      signIndex: sub.signIndex,
      signLord: sub.signLord,
      nakshatra: sub.nakshatra,
      starLord: sub.starLord,
      subLord: sub.subLord,
      subSubLord: sub.subSubLord,
    };
  });

  return {
    ...baseCalc,
    cusps: horaryCusps,
    horaryNumber: clampedNum,
  };
}

// ============================================================================
// VIMSHOTTARI DASHA TIMELINE GENERATOR (120 YEARS)
// ============================================================================

const YEAR_MS = 365.2425 * 86400000;

export function calculateKPDashaTimeline(
  moonLongitude: number,
  birthDate: Date
): {
  allMahadashas: KPDashaPeriod[];
  currentDasha: KPCurrentDashaInfo;
} {
  const norm = ((moonLongitude % 360) + 360) % 360;
  const nakSpan = 360 / 27;
  const nakIdx = Math.floor(norm / nakSpan);
  const starLord = KP_NAKSHATRAS[nakIdx].lord;
  const starLordIdx = STAR_LORDS_ORDER.indexOf(starLord);

  const degInNak = norm % nakSpan;
  const fractionElapsed = degInNak / nakSpan;
  const fractionRemaining = 1 - fractionElapsed;

  // Exact calendar start time of first Mahadasha before birth
  const firstMahaTotalYears = VIMSHOTTARI_YEARS[starLord];
  const firstMahaElapsedMs = firstMahaTotalYears * fractionElapsed * YEAR_MS;
  const firstMahaStartMs = birthDate.getTime() - firstMahaElapsedMs;

  const allMahadashas: KPDashaPeriod[] = [];
  let curMahaStartMs = firstMahaStartMs;

  const formatDateStr = (d: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const getPlanetBn = (name: string): string => {
    const key = Object.keys(KP_PLANET_NAMES).find(
      (k) => KP_PLANET_NAMES[k].en.toLowerCase() === name.toLowerCase()
    );
    return key ? KP_PLANET_NAMES[key].bn : name;
  };

  for (let m = 0; m < 9; m++) {
    const mIdx = (starLordIdx + m) % 9;
    const mLord = STAR_LORDS_ORDER[mIdx];
    const mYears = VIMSHOTTARI_YEARS[mLord];
    const mDurationMs = mYears * YEAR_MS;
    const curMahaEndMs = curMahaStartMs + mDurationMs;

    const mStartDate = new Date(curMahaStartMs);
    const mEndDate = new Date(curMahaEndMs);

    // Antardashas
    const antardashas: KPDashaPeriod[] = [];
    let curAntarStartMs = curMahaStartMs;

    for (let a = 0; a < 9; a++) {
      const aIdx = (mIdx + a) % 9;
      const aLord = STAR_LORDS_ORDER[aIdx];
      const aYears = (mYears * VIMSHOTTARI_YEARS[aLord]) / 120;
      const aDurationMs = aYears * YEAR_MS;
      const curAntarEndMs = curAntarStartMs + aDurationMs;

      const aStartDate = new Date(curAntarStartMs);
      const aEndDate = new Date(curAntarEndMs);

      // Pratyantardashas
      const pratyantardashas: KPDashaPeriod[] = [];
      let curPratStartMs = curAntarStartMs;

      for (let p = 0; p < 9; p++) {
        const pIdx = (aIdx + p) % 9;
        const pLord = STAR_LORDS_ORDER[pIdx];
        const pYears = (aYears * VIMSHOTTARI_YEARS[pLord]) / 120;
        const pDurationMs = pYears * YEAR_MS;
        const curPratEndMs = curPratStartMs + pDurationMs;

        pratyantardashas.push({
          lord: pLord,
          lordBn: getPlanetBn(pLord),
          startDate: new Date(curPratStartMs),
          endDate: new Date(curPratEndMs),
          startDateStr: formatDateStr(new Date(curPratStartMs)),
          endDateStr: formatDateStr(new Date(curPratEndMs)),
          durationYears: pYears,
          level: 'pratyantar',
        });

        curPratStartMs = curPratEndMs;
      }

      antardashas.push({
        lord: aLord,
        lordBn: getPlanetBn(aLord),
        startDate: aStartDate,
        endDate: aEndDate,
        startDateStr: formatDateStr(aStartDate),
        endDateStr: formatDateStr(aEndDate),
        durationYears: aYears,
        level: 'antar',
        subPeriods: pratyantardashas,
      });

      curAntarStartMs = curAntarEndMs;
    }

    allMahadashas.push({
      lord: mLord,
      lordBn: getPlanetBn(mLord),
      startDate: mStartDate,
      endDate: mEndDate,
      startDateStr: formatDateStr(mStartDate),
      endDateStr: formatDateStr(mEndDate),
      durationYears: mYears,
      level: 'maha',
      subPeriods: antardashas,
    });

    curMahaStartMs = curMahaEndMs;
  }

  // Find Current Dasha at Date.now()
  const nowMs = Date.now();
  const currentMD =
    allMahadashas.find((md) => nowMs >= md.startDate.getTime() && nowMs < md.endDate.getTime()) ||
    allMahadashas[0];

  const currentAD =
    currentMD.subPeriods?.find((ad) => nowMs >= ad.startDate.getTime() && nowMs < ad.endDate.getTime()) ||
    currentMD.subPeriods?.[0] ||
    currentMD;

  const currentPD =
    currentAD.subPeriods?.find((pd) => nowMs >= pd.startDate.getTime() && nowMs < pd.endDate.getTime()) ||
    currentAD.subPeriods?.[0];

  const formatRemaining = (end: Date): string => {
    const diff = end.getTime() - nowMs;
    if (diff <= 0) return 'Completed';
    const totalDays = Math.floor(diff / 86400000);
    const years = Math.floor(totalDays / 365.25);
    const months = Math.floor((totalDays % 365.25) / 30.44);
    const days = Math.floor((totalDays % 365.25) % 30.44);

    if (years > 0) return `${years}y ${months}m remaining`;
    if (months > 0) return `${months}m ${days}d remaining`;
    return `${days} days remaining`;
  };

  const getProgress = (start: Date, end: Date): number => {
    const total = end.getTime() - start.getTime();
    const elapsed = Math.max(0, Math.min(total, nowMs - start.getTime()));
    return Math.round((elapsed / total) * 100);
  };

  const currentDasha: KPCurrentDashaInfo = {
    maha: {
      lord: currentMD.lord,
      lordBn: currentMD.lordBn,
      startDate: currentMD.startDate,
      endDate: currentMD.endDate,
      startDateStr: currentMD.startDateStr,
      endDateStr: currentMD.endDateStr,
      remainingText: formatRemaining(currentMD.endDate),
      progressPercent: getProgress(currentMD.startDate, currentMD.endDate),
    },
    antar: {
      lord: currentAD.lord,
      lordBn: currentAD.lordBn,
      startDate: currentAD.startDate,
      endDate: currentAD.endDate,
      startDateStr: currentAD.startDateStr,
      endDateStr: currentAD.endDateStr,
      remainingText: formatRemaining(currentAD.endDate),
      progressPercent: getProgress(currentAD.startDate, currentAD.endDate),
    },
    pratyantar: currentPD
      ? {
          lord: currentPD.lord,
          lordBn: currentPD.lordBn,
          startDate: currentPD.startDate,
          endDate: currentPD.endDate,
          startDateStr: currentPD.startDateStr,
          endDateStr: currentPD.endDateStr,
          remainingText: formatRemaining(currentPD.endDate),
          progressPercent: getProgress(currentPD.startDate, currentPD.endDate),
        }
      : undefined,
  };

  return { allMahadashas, currentDasha };
}

// ============================================================================
// KP DASHA PREDICTION ENGINE (SYNTHESIS)
// ============================================================================

export function generateKPDashaAnalysis(
  moonLongitude: number,
  birthDate: Date,
  planetSignificators: KPPlanetSignificators[],
  planets: KPPlanetData[],
  cusps: KPCuspData[]
): KPDashaPredictionResult {
  const { allMahadashas, currentDasha } = calculateKPDashaTimeline(moonLongitude, birthDate);

  const getPlanetDetails = (planetName: string) => {
    const pData = planets.find((p) => p.name.toLowerCase() === planetName.toLowerCase());
    const pSig = planetSignificators.find((ps) => ps.planetName.toLowerCase() === planetName.toLowerCase());
    const allHouses = pSig
      ? Array.from(new Set([...pSig.housesL1, ...pSig.housesL2, ...pSig.housesL3, ...pSig.housesL4]))
      : [];
    return { pData, pSig, allHouses };
  };

  const mdName = currentDasha.maha.lord;
  const adName = currentDasha.antar.lord;
  const pdName = currentDasha.pratyantar?.lord || adName;

  const mdInfo = getPlanetDetails(mdName);
  const adInfo = getPlanetDetails(adName);
  const pdInfo = getPlanetDetails(pdName);

  const getPlanetBn = (name: string): string => {
    const key = Object.keys(KP_PLANET_NAMES).find(
      (k) => KP_PLANET_NAMES[k].en.toLowerCase() === name.toLowerCase()
    );
    return key ? KP_PLANET_NAMES[key].bn : name;
  };

  // Significations for active trio
  const dashaLordsSignifications: KPDashaLordSignification[] = [
    {
      role: 'Mahadasha (MD)',
      planetName: mdName,
      planetNameBn: getPlanetBn(mdName),
      starLord: mdInfo.pData?.starLord || '-',
      subLord: mdInfo.pData?.subLord || '-',
      housesL1: mdInfo.pSig?.housesL1 || [],
      housesL2: mdInfo.pSig?.housesL2 || [],
      housesL3: mdInfo.pSig?.housesL3 || [],
      housesL4: mdInfo.pSig?.housesL4 || [],
      allSignifiedHouses: mdInfo.allHouses,
      subLordHouses: mdInfo.pSig?.subLordSignifies || [],
      kpRole: 'Primary Environment & Karmic Agenda Setter (General Climate)',
    },
    {
      role: 'Antardasha (AD)',
      planetName: adName,
      planetNameBn: getPlanetBn(adName),
      starLord: adInfo.pData?.starLord || '-',
      subLord: adInfo.pData?.subLord || '-',
      housesL1: adInfo.pSig?.housesL1 || [],
      housesL2: adInfo.pSig?.housesL2 || [],
      housesL3: adInfo.pSig?.housesL3 || [],
      housesL4: adInfo.pSig?.housesL4 || [],
      allSignifiedHouses: adInfo.allHouses,
      subLordHouses: adInfo.pSig?.subLordSignifies || [],
      kpRole: 'Prime Fruitioner / Event Trigger (Decisive Period Ruler)',
    },
  ];

  if (currentDasha.pratyantar) {
    dashaLordsSignifications.push({
      role: 'Pratyantardasha (PD)',
      planetName: pdName,
      planetNameBn: getPlanetBn(pdName),
      starLord: pdInfo.pData?.starLord || '-',
      subLord: pdInfo.pData?.subLord || '-',
      housesL1: pdInfo.pSig?.housesL1 || [],
      housesL2: pdInfo.pSig?.housesL2 || [],
      housesL3: pdInfo.pSig?.housesL3 || [],
      housesL4: pdInfo.pSig?.housesL4 || [],
      allSignifiedHouses: pdInfo.allHouses,
      subLordHouses: pdInfo.pSig?.subLordSignifies || [],
      kpRole: 'Precision Timing & Immediate Monthly Catalyst',
    });
  }

  // Combined Active Houses (MD + AD + PD)
  const activeHouses = Array.from(
    new Set([...mdInfo.allHouses, ...adInfo.allHouses, ...pdInfo.allHouses])
  );

  // Helper evaluator for life categories
  const evaluateDomain = (
    category: 'overview' | 'career' | 'wealth' | 'relationship' | 'health' | 'travel',
    title: string,
    titleBn: string,
    favorableHouses: number[],
    unfavorableHouses: number[],
    neutralHouses: number[]
  ): KPDashaPredictionSection => {
    const favMatches = activeHouses.filter((h) => favorableHouses.includes(h));
    const unfavMatches = activeHouses.filter((h) => unfavorableHouses.includes(h));

    // AD Sub Lord verification (KP Rule: AD Sub Lord decides the fruition)
    const adSubLordHouses = adInfo.pSig?.subLordSignifies || [];
    const adSubFav = adSubLordHouses.filter((h) => favorableHouses.includes(h));
    const adSubUnfav = adSubLordHouses.filter((h) => unfavorableHouses.includes(h));

    let status: 'Highly Favorable' | 'Favorable' | 'Mixed / Transitional' | 'Challenging / Obstacles' =
      'Mixed / Transitional';
    let statusBn = 'মিশ্র ও রূপান্তরকালীন সময় (Mixed / Transitional)';
    let score = 50;

    if (favMatches.length >= 2 && adSubUnfav.length === 0) {
      status = 'Highly Favorable';
      statusBn = 'অত্যন্ত শুভ ও সিদ্ধিদায়ক (Highly Favorable)';
      score = 90;
    } else if (favMatches.length >= 1 && unfavMatches.length <= 1) {
      status = 'Favorable';
      statusBn = 'অনুকূল ও প্রগতিশীল (Favorable)';
      score = 75;
    } else if (unfavMatches.length >= 2 && favMatches.length === 0) {
      status = 'Challenging / Obstacles';
      statusBn = 'সতর্কতা ও বাধাপ্রদ (Challenging / Remedies Advised)';
      score = 25;
    } else {
      status = 'Mixed / Transitional';
      statusBn = 'মিশ্র ও বিলম্বে ফল (Mixed with Delay)';
      score = 52;
    }

    let summary = '';
    let detailedAnalysis = '';
    let kpSignificationsText = '';
    const remedyTips: string[] = [];

    if (category === 'overview') {
      summary = `The running period of ${mdName} Mahadasha and ${adName} Antardasha strongly stimulates houses [${activeHouses.join(', ') || '-'}].`;
      detailedAnalysis = `According to Krishnamurti Paddhati principles, ${mdName} sets the stage through its Star Lord ${mdInfo.pData?.starLord}, while ${adName} acts as the decisive catalyst. The active significations focus life energy on houses [${activeHouses.join(', ')}]. Overall stability is rated at ${score}%.`;
      kpSignificationsText = `Active houses: [${activeHouses.join(', ')}]. Sub-Lord ${adInfo.pData?.subLord} channels results towards houses [${adSubLordHouses.join(', ') || '-'}].`;
      remedyTips.push(`Strengthen ${adName} through harmonious lifestyle alignment and regular discipline.`);
      remedyTips.push(`Balance planetary energies by respecting elders and engaging in selfless charity.`);
    } else if (category === 'career') {
      const hasCareerFav = favMatches.length > 0;
      summary = hasCareerFav
        ? `Career elevation, professional recognition, and growth are highlighted during this ${adName} Antardasha.`
        : `Professional sphere requires patient persistence; avoid impulsive job shifts or confrontations.`;
      detailedAnalysis = `Career houses [2, 6, 10, 11] interact with active significators [${favMatches.join(', ') || 'None'}]. ${
        adSubFav.length > 0
          ? `Because the Antardasha Sub-Lord ${adInfo.pData?.subLord} favors houses [${adSubFav.join(', ')}], promotional opportunities and new responsibilities will materialize.`
          : `Because unfavorable houses [${unfavMatches.join(', ') || 'None'}] are present, maintain cordial relations with superiors and document all professional transactions.`
      }`;
      kpSignificationsText = `Career Houses Promoted: [${favMatches.join(', ') || 'None'}]. Detrimental Houses: [${unfavMatches.join(', ') || 'None'}].`;
      remedyTips.push(`Wear clean attire and chant the Gayatri or Navagraha Stotram on ${adName}'s weekday.`);
      remedyTips.push(`Stay focused on long-term skill acquisition rather than short-term gains.`);
    } else if (category === 'wealth') {
      const hasWealthFav = favMatches.length > 0;
      summary = hasWealthFav
        ? `Financial inflow, business turnover, and resource accumulation are well supported.`
        : `Financial vigilance is advised; restrict speculative ventures and monitor recurring overheads.`;
      detailedAnalysis = `Wealth houses [2, 6, 11] receive activation from current Dasha lords. ${
        favMatches.includes(2) || favMatches.includes(11)
          ? `Connection to 2nd (accumulated wealth) and 11th (gains) ensures financial recovery and fulfillment of material targets.`
          : `Presence of house 12/8 warns against unverified speculative loans or impulsive spending.`
      }`;
      kpSignificationsText = `Wealth Significators: [${favMatches.join(', ') || 'None'}]. Expenditure/Loss Indicators: [${unfavMatches.join(', ') || 'None'}].`;
      remedyTips.push(`Donate grains or sesame oil on Saturdays to neutralize wasteful outflow.`);
      remedyTips.push(`Maintain transparent financial bookkeeping and avoid unauthorized sureties.`);
    } else if (category === 'relationship') {
      summary =
        favMatches.length > 0
          ? `Harmony in partnerships, matrimonial discussions, and social warmth are favored.`
          : `Domestic relationships require calm communication; beware of ego clashes or third-party interference.`;
      detailedAnalysis = `Matrimonial and domestic houses [2, 7, 11] show involvement of houses [${favMatches.join(', ') || 'None'}]. ${
        favMatches.includes(7)
          ? `The 7th house connection strongly supports romantic bonding, marital peace, and mutually rewarding social ties.`
          : `If house 6 or 10 is active, work pressures might temporarily reduce quality time with loved ones.`
      }`;
      kpSignificationsText = `Partnership Houses Activated: [${favMatches.join(', ') || 'None'}]. Detrimental Tension Houses: [${unfavMatches.join(', ') || 'None'}].`;
      remedyTips.push(`Light a ghee lamp in the evening in the North-East or Sanamahi corner.`);
      remedyTips.push(`Practice compassionate listening and avoid arguing over trivial domestic matters.`);
    } else if (category === 'health') {
      summary =
        unfavMatches.length >= 2
          ? `Health vitality needs mindful attention; practice preventive healthcare and restorative sleep.`
          : `Immunity and physical vitality remain robust; quick recovery from minor fatigue is promised.`;
      detailedAnalysis = `Health houses [1, 5, 11] (cure and energy) versus [6, 8, 12] (vulnerabilities). ${
        favMatches.includes(1) || favMatches.includes(5) || favMatches.includes(11)
          ? `Protective houses 1 and 11 are activated, providing natural recuperative power and stamina.`
          : `House 6/8 activation suggests seasonal allergies or digestive sensitivity; take wholesome home-cooked meals.`
      }`;
      kpSignificationsText = `Vitality/Healing Houses: [${favMatches.join(', ') || 'None'}]. Vulnerability Houses: [${unfavMatches.join(', ') || 'None'}].`;
      remedyTips.push(`Begin the morning with Surya Namaskar and drink water kept in a copper vessel.`);
      remedyTips.push(`Maintain regular sleep schedules and take walking breaks during intense work hours.`);
    } else {
      // travel & assets
      summary = `Opportunities for journeys, relocation, or property improvements during this planetary cycle.`;
      detailedAnalysis = `Houses [3, 4, 9, 12] govern mobility, higher studies, and real estate. ${
        activeHouses.includes(9) || activeHouses.includes(12)
          ? `Long journeys, overseas collaborations, or pilgrimage travel are clearly indicated.`
          : `Local commuting and domestic property maintenance will take center stage.`
      }`;
      kpSignificationsText = `Travel/Real Estate Significators: [${activeHouses.filter((h) => [3, 4, 9, 12].includes(h)).join(', ') || 'None'}].`;
      remedyTips.push(`Keep travel documentation well organized before embarking on distant voyages.`);
    }

    return {
      category,
      title,
      titleBn,
      status,
      statusBn,
      score,
      summary,
      detailedAnalysis,
      kpSignificationsText,
      activatedHouses: activeHouses,
      remedyTips,
    };
  };

  const predictions: KPDashaPredictionSection[] = [
    evaluateDomain('overview', 'Current Dasha Period Climate', 'বর্তমান দশা সময়কাল ও সামগ্রিক প্রভাব', [1, 2, 5, 9, 10, 11], [6, 8, 12], [3, 4, 7]),
    evaluateDomain('career', 'Career & Professional Growth', 'কর্মজীবন, চাকরি ও পদোন্নতি বিচার', [2, 6, 10, 11], [5, 8, 12], [1, 3, 7]),
    evaluateDomain('wealth', 'Wealth & Financial Prospects', 'ধন-সম্পদ, লাভ ও আর্থিক পরিস্থিতি', [2, 6, 11], [5, 8, 12], [1, 10]),
    evaluateDomain('relationship', 'Love, Marriage & Family Harmony', 'প্রেম, দাম্পত্য ও পারিবারিক শান্তি', [2, 7, 11], [1, 6, 10], [5, 8, 12]),
    evaluateDomain('health', 'Health, Vitality & Well-being', 'স্বাস্থ্য, জীবনীশক্তি ও রোগমুক্তি', [1, 5, 11], [6, 8, 12], [2, 10]),
    evaluateDomain('travel', 'Travel, Property & Higher Studies', 'যাত্রা, গৃহ সম্পত্তি ও উচ্চশিক্ষা', [3, 4, 9, 11, 12], [3, 8], [1, 2]),
  ];

  return {
    currentDasha,
    allMahadashas,
    dashaLordsSignifications,
    predictions,
  };
}

