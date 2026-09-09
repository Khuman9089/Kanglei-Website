import { PlanetPosition } from '@/types/astrology';
import { ZODIAC_SIGNS } from '@/engine/constants';
import { getNakshatraInfo } from '@/engine/nakshatras';
import { calculatePlanetaryPositions, getJulianDay, getAyanamsa } from '@/engine/ephemeris';

export interface VedicPlanetRow {
  id: string;
  name: string;
  abbr: string;
  color: string;
  degreeStr: string;
  rawLongitude: number;
  signDegree: number;
  signIndex: number;
  signAbbr: string;
  signName: string;
  nakshatraName: string;
  nakshatraIndex: number;
  pada: number;
  padaSyllable: string;
  subLords: string; // e.g. "2,Sa/Ke/Me"
  dignity: string;  // "Own", "Exalt.", "Moolt.", "Neutr.", "Enemy", "Debil."
  shadbalaRatio: number;
  house: number;
  avastha: string;  // e.g. "16 3 Old BK"
  karaka?: string;  // "AK", "AmK", "BK", "MK", "PiK", "GK", "DK"
  functionalNature: 'Benefic' | 'Malefic' | 'Neutral';
  lordships: string; // e.g. "10/2/1"
  isRetrograde: boolean;
  isCombust: boolean;
  speed?: number;
}

export interface ShadbalaBarData {
  planet: string;
  symbol: string;
  color: string;
  ratio: number;
  totalRupas: number;
  reqRupas: number;
}

export interface DashaRow {
  title: string;       // e.g. "Me-Ju-Su-Me"
  dayOfWeek: string;   // e.g. "Sat"
  dateStr: string;     // e.g. "12-09-2026"
  startDate: Date;
  endDate: Date;
  level: number;
}

export interface LordshipRow {
  houseNum: number;
  lordName: string;
  lordAbbr: string;
  placedHouse: number;
  text: string;        // e.g. "Lord of 1 in 8 - Ma"
}

export interface GocharaTransitRow {
  id: string;
  abbr: string;
  name: string;
  color: string;
  degreeStr: string;
  signAbbr: string;
  signName: string;
  genderNature: string; // e.g. "Mal Fix", "Fem Mov", "Mal Dua"
  subLords: string;
  combustionPercent?: string;
  isRetrograde: boolean;
  houseFromLagna: number;
  houseFromMoon: number;
}

// 1. ZODIAC DATA
export const SIGN_ABBRS = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

export const SIGN_LORDS_MAP = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

export const SIGN_MOBILITY = ['Mov', 'Fix', 'Dua', 'Mov', 'Fix', 'Dua', 'Mov', 'Fix', 'Dua', 'Mov', 'Fix', 'Dua'];
export const SIGN_GENDER = ['Mal', 'Fem', 'Mal', 'Fem', 'Mal', 'Fem', 'Mal', 'Fem', 'Mal', 'Fem', 'Mal', 'Fem'];

// 2. VEDIC PLANET STYLING & SYMBOLS
export const VEDIC_PLANET_CONFIG: Record<string, { abbr: string; color: string; naturalBenefic: boolean }> = {
  asc: { abbr: 'As', color: '#0f172a', naturalBenefic: true },
  su:  { abbr: 'Su', color: '#ea580c', naturalBenefic: false },
  mo:  { abbr: 'Mo', color: '#2563eb', naturalBenefic: true },
  ma:  { abbr: 'Ma', color: '#dc2626', naturalBenefic: false },
  me:  { abbr: 'Me', color: '#16a34a', naturalBenefic: true },
  ju:  { abbr: 'Ju', color: '#d97706', naturalBenefic: true },
  ve:  { abbr: 'Ve', color: '#c026d3', naturalBenefic: true },
  sa:  { abbr: 'Sa', color: '#2563eb', naturalBenefic: false },
  ra:  { abbr: 'Ra', color: '#0d9488', naturalBenefic: false },
  ke:  { abbr: 'Ke', color: '#b45309', naturalBenefic: false },
};

// 3. NAKSHATRA PADA SYLLABLES (108 PADAS)
const PADA_SYLLABLES: string[][] = [
  ['Chu', 'Che', 'Cho', 'La'],      // 1. Ashwini
  ['Lee', 'Lu', 'Le', 'Lo'],        // 2. Bharani
  ['A', 'Ee', 'U', 'Ea'],           // 3. Krittika
  ['O', 'Va', 'Vi', 'Vu'],          // 4. Rohini
  ['Ve', 'Vo', 'Ka', 'Kee'],        // 5. Mrigashirsha
  ['Ku', 'Gha', 'Nga', 'Chha'],     // 6. Ardra
  ['Ke', 'Ko', 'Ha', 'Hee'],        // 7. Punarvasu
  ['Hu', 'He', 'Ho', 'Da'],         // 8. Pushya
  ['Dee', 'Doo', 'Day', 'Doh'],     // 9. Ashlesha
  ['Ma', 'Mee', 'Moo', 'May'],      // 10. Magha
  ['Mo', 'Ta', 'Tee', 'Too'],       // 11. Purva Phalguni
  ['Tay', 'To', 'Pa', 'Pee'],       // 12. Uttara Phalguni
  ['Pu', 'Sha', 'Na', 'Tha'],       // 13. Hasta
  ['Pe', 'Po', 'Ra', 'Ree'],        // 14. Chitra
  ['Roo', 'Ray', 'Ro', 'Ta'],       // 15. Swati
  ['Tee', 'Too', 'Tay', 'To'],      // 16. Vishakha
  ['Na', 'Nee', 'Noo', 'Nay'],      // 17. Anuradha
  ['No', 'Ya', 'Yee', 'Yoo'],       // 18. Jyeshtha
  ['Ye', 'Yo', 'Bha', 'Bhee'],      // 19. Moola
  ['Bhoo', 'Dha', 'Pha', 'Dhad'],   // 20. Purva Ashadha
  ['Bhe', 'Bho', 'Ja', 'Jee'],      // 21. Uttara Ashadha
  ['Ju', 'Je', 'Jo', 'Gha'],        // 22. Shravana
  ['Ga', 'Gee', 'Goo', 'Gay'],      // 23. Dhanishta
  ['Go', 'Sa', 'See', 'Soo'],       // 24. Shatabhisha
  ['Say', 'So', 'Da', 'Dee'],       // 25. Purva Bhadrapada
  ['Doo', 'Tha', 'Jha', 'Na'],      // 26. Uttara Bhadrapada
  ['De', 'Do', 'Cha', 'Chee'],      // 27. Revati
];

// Vimshottari Nakshatra Star Lord Order
const STAR_LORDS = ['Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju', 'Sa', 'Me'];
const VIMSHOTTARI_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // total 120

export function formatDms(deg: number): string {
  const norm = ((deg % 30) + 30) % 30;
  const d = Math.floor(norm);
  const m = Math.floor((norm % 1) * 60);
  const s = Math.floor((((norm % 1) * 60) % 1) * 60);
  return `${String(d).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatFullDms(deg: number): string {
  const norm = ((deg % 360) + 360) % 360;
  const d = Math.floor(norm);
  const m = Math.floor((norm % 1) * 60);
  const s = Math.floor((((norm % 1) * 60) % 1) * 60);
  return `${String(d).padStart(2, '0')}° ${String(m).padStart(2, '0')}' ${String(s).padStart(2, '0')}''`;
}

/**
 * Calculate KP Sub-Lord representation: [Pada],[StarLord]/[SubLord]/[SubSubLord]
 */
export function calculateSubLords(longitude: number): { str: string; star: string; sub: string; subSub: string; pada: number } {
  const norm = ((longitude % 360) + 360) % 360;
  const nakIndex = Math.floor(norm / (360 / 27)); // 0..26
  const degInNak = norm % (360 / 27); // 0..13.3333°
  const pada = Math.floor(degInNak / (13.3333333333 / 4)) + 1; // 1..4

  const starLordIndex = nakIndex % 9;
  const starLord = STAR_LORDS[starLordIndex];

  // Sub-division within 13°20' proportional to Vimshottari years
  const nakRatio = degInNak / (360 / 27); // 0..1
  let cumulative = 0;
  let subIndex = starLordIndex;
  for (let i = 0; i < 9; i++) {
    const currentIdx = (starLordIndex + i) % 9;
    const span = VIMSHOTTARI_YEARS[currentIdx] / 120;
    if (nakRatio >= cumulative && nakRatio <= cumulative + span) {
      subIndex = currentIdx;
      break;
    }
    cumulative += span;
  }
  const subLord = STAR_LORDS[subIndex];

  // Sub-sub division
  const subSubLord = STAR_LORDS[(subIndex + Math.floor(degInNak * 7)) % 9];

  return {
    str: `${pada},${starLord}/${subLord}/${subSubLord}`,
    star: starLord,
    sub: subLord,
    subSub: subSubLord,
    pada,
  };
}

/**
 * Determine Dignity of planet in given sign
 */
export function calculateDignity(planetId: string, signIndex: number, degree: number): string {
  switch (planetId) {
    case 'su':
      if (signIndex === 0) return 'Exalt.'; // Aries
      if (signIndex === 4 && degree <= 20) return 'Moolt.'; // Leo
      if (signIndex === 4) return 'Own';
      if (signIndex === 6) return 'Debil.'; // Libra
      if ([3, 7, 8].includes(signIndex)) return 'Friend';
      if ([1, 2, 9, 10].includes(signIndex)) return 'Enemy';
      return 'Neutr.';
    case 'mo':
      if (signIndex === 1 && degree <= 3) return 'Exalt.'; // Taurus
      if (signIndex === 1) return 'Moolt.';
      if (signIndex === 3) return 'Own'; // Cancer
      if (signIndex === 7) return 'Debil.'; // Scorpio
      if ([0, 4, 2, 5].includes(signIndex)) return 'Friend';
      return 'Neutr.';
    case 'ma':
      if (signIndex === 9) return 'Exalt.'; // Capricorn
      if (signIndex === 0 && degree <= 12) return 'Moolt.'; // Aries
      if ([0, 7].includes(signIndex)) return 'Own';
      if (signIndex === 3) return 'Debil.'; // Cancer
      if ([4, 3, 8, 11].includes(signIndex)) return 'Friend';
      if ([2, 5].includes(signIndex)) return 'Enemy';
      return 'Neutr.';
    case 'me':
      if (signIndex === 5 && degree <= 15) return 'Exalt.'; // Virgo
      if (signIndex === 5 && degree <= 20) return 'Moolt.';
      if ([2, 5].includes(signIndex)) return 'Own';
      if (signIndex === 11) return 'Debil.'; // Pisces
      if ([4, 6, 1].includes(signIndex)) return 'Friend';
      if (signIndex === 3) return 'Enemy';
      return 'Neutr.';
    case 'ju':
      if (signIndex === 3) return 'Exalt.'; // Cancer
      if (signIndex === 8 && degree <= 10) return 'Moolt.'; // Sagittarius
      if ([8, 11].includes(signIndex)) return 'Own';
      if (signIndex === 9) return 'Debil.'; // Capricorn
      if ([0, 4, 7].includes(signIndex)) return 'Friend';
      if ([2, 5, 1, 6].includes(signIndex)) return 'Enemy';
      return 'Neutr.';
    case 've':
      if (signIndex === 11) return 'Exalt.'; // Pisces
      if (signIndex === 6 && degree <= 15) return 'Moolt.'; // Libra
      if ([1, 6].includes(signIndex)) return 'Own';
      if (signIndex === 5) return 'Debil.'; // Virgo
      if ([2, 5, 9, 10].includes(signIndex)) return 'Friend';
      if ([4, 3].includes(signIndex)) return 'Enemy';
      return 'Neutr.';
    case 'sa':
      if (signIndex === 6) return 'Exalt.'; // Libra
      if (signIndex === 10 && degree <= 20) return 'Moolt.'; // Aquarius
      if ([9, 10].includes(signIndex)) return 'Own';
      if (signIndex === 0) return 'Debil.'; // Aries
      if ([2, 5, 1, 6].includes(signIndex)) return 'Friend';
      if ([4, 3, 0, 7].includes(signIndex)) return 'Enemy';
      return 'Neutr.';
    case 'ra':
      if ([1, 2].includes(signIndex)) return 'Exalt.';
      if (signIndex === 10) return 'Own';
      if ([7, 8].includes(signIndex)) return 'Debil.';
      return 'Neutr.';
    case 'ke':
      if ([7, 8].includes(signIndex)) return 'Exalt.';
      if (signIndex === 7) return 'Own';
      if ([1, 2].includes(signIndex)) return 'Debil.';
      return 'Neutr.';
    default:
      return 'Neutr.';
  }
}

/**
 * Calculate Baladi Avastha: Infant, Adolescent, Youth, Old, Dead
 */
export function calculateBaladiAvastha(signIndex: number, degree: number): string {
  const isOdd = signIndex % 2 === 0; // 0=Aries (odd), 1=Taurus (even)
  const deg = degree % 30;
  let state = 'Youth.';

  if (isOdd) {
    if (deg < 6) state = 'Infant';
    else if (deg < 12) state = 'Adolescent';
    else if (deg < 18) state = 'Youth.';
    else if (deg < 24) state = 'Old';
    else state = 'Dead';
  } else {
    if (deg < 6) state = 'Dead';
    else if (deg < 12) state = 'Old';
    else if (deg < 18) state = 'Youth.';
    else if (deg < 24) state = 'Adolescent';
    else state = 'Infant';
  }

  return state;
}

/**
 * Calculate Functional Nature for a given Lagna
 */
export function calculateFunctionalNature(lagnaSignIndex: number, planetId: string): 'Benefic' | 'Malefic' | 'Neutral' {
  // Parashara Functional Benefic/Malefic rules per Lagna
  const beneficsPerLagna: Record<number, string[]> = {
    0: ['su', 'ju', 'mo'],        // Aries
    1: ['sa', 'me', 've'],        // Taurus
    2: ['ve', 'me'],              // Gemini
    3: ['ma', 'ju', 'mo'],        // Cancer
    4: ['ma', 'ju', 'su'],        // Leo
    5: ['ve', 'me'],              // Virgo
    6: ['sa', 'me', 've'],        // Libra
    7: ['ju', 'mo', 'su'],        // Scorpio
    8: ['su', 'ma', 'ju'],        // Sagittarius
    9: ['ve', 'me', 'sa'],        // Capricorn
    10: ['ve', 'sa'],             // Aquarius
    11: ['mo', 'ma', 'ju'],       // Pisces
  };

  const maleficsPerLagna: Record<number, string[]> = {
    0: ['me', 've', 'sa'],
    1: ['ju', 'su', 'mo'],
    2: ['ma', 'ju', 'su'],
    3: ['me', 've'],
    4: ['me', 've'],
    5: ['ma', 'ju', 'mo'],
    6: ['ju', 'su', 'ma'],
    7: ['me', 've'],
    8: ['ve', 'me'],
    9: ['ma', 'ju', 'mo'],
    10: ['ju', 'mo', 'ma'],
    11: ['su', 've', 'me', 'sa'],
  };

  if (beneficsPerLagna[lagnaSignIndex]?.includes(planetId)) return 'Benefic';
  if (maleficsPerLagna[lagnaSignIndex]?.includes(planetId)) return 'Malefic';
  return 'Neutral';
}

/**
 * Compute realistic Shadbala Virupas and Strength Ratios
 */
export function calculateShadbalaData(
  planets: PlanetPosition[],
  ascendant: number
): Record<string, { totalRupas: number; reqRupas: number; ratio: number }> {
  const ascSign = Math.floor(ascendant / 30);
  const result: Record<string, { totalRupas: number; reqRupas: number; ratio: number }> = {};

  const reqRupasMap: Record<string, number> = {
    su: 6.5,
    mo: 6.0,
    ma: 5.0,
    me: 7.0,
    ju: 6.5,
    ve: 5.5,
    sa: 5.0,
  };

  const baseVirupas: Record<string, number> = {
    su: 390,
    mo: 360,
    ma: 300,
    me: 420,
    ju: 390,
    ve: 330,
    sa: 300,
  };

  planets.forEach((p) => {
    if (!reqRupasMap[p.id]) return;

    const house = ((p.signIndex - ascSign + 12) % 12) + 1;
    let score = baseVirupas[p.id] || 360;

    // Kendra bonus (1, 4, 7, 10)
    if ([1, 4, 7, 10].includes(house)) score += 60;
    // Trikona bonus (5, 9)
    if ([5, 9].includes(house)) score += 45;
    // Dusthana penalty (6, 8, 12)
    if ([6, 8, 12].includes(house)) score -= 40;

    // Retrograde strength bonus (Cheshta bala)
    if (p.isRetrograde) score += 50;

    // Exaltation bonus
    const dignity = calculateDignity(p.id, p.signIndex, p.signDegree);
    if (dignity === 'Exalt.') score += 60;
    else if (dignity === 'Moolt.') score += 45;
    else if (dignity === 'Own') score += 35;
    else if (dignity === 'Debil.') score -= 50;

    const totalRupas = Number((score / 60).toFixed(2));
    const req = reqRupasMap[p.id];
    const ratio = Number((totalRupas / req).toFixed(2));

    result[p.id] = {
      totalRupas,
      reqRupas: req,
      ratio,
    };
  });

  return result;
}

/**
 * Generate All Lordships (Lords 1 to 12 and their current placement)
 */
export function calculateLordships(ascSignIndex: number, planets: PlanetPosition[]): LordshipRow[] {
  const rows: LordshipRow[] = [];

  for (let h = 1; h <= 12; h++) {
    const signIndex = (ascSignIndex + h - 1) % 12;
    const lordName = SIGN_LORDS_MAP[signIndex];
    
    // Find where this lord planet is placed
    const planetIdMap: Record<string, string> = {
      Sun: 'su',
      Moon: 'mo',
      Mars: 'ma',
      Mercury: 'me',
      Jupiter: 'ju',
      Venus: 've',
      Saturn: 'sa',
    };
    const targetId = planetIdMap[lordName];
    const foundPlanet = planets.find((p) => p.id === targetId);

    const placedSign = foundPlanet ? foundPlanet.signIndex : 0;
    const placedHouse = ((placedSign - ascSignIndex + 12) % 12) + 1;
    const lordAbbr = VEDIC_PLANET_CONFIG[targetId]?.abbr || lordName.substring(0, 2);

    const prefix = h >= 10 ? `L ${h}` : h >= 7 ? `Lrd. ${h}` : `Lord of ${h}`;
    const text = `${prefix} in ${placedHouse} - ${lordAbbr}`;

    rows.push({
      houseNum: h,
      lordName,
      lordAbbr,
      placedHouse,
      text,
    });
  }

  return rows;
}

/**
 * Calculate multi-level Vimshottari Dasha timeline
 */
export function calculateDetailedVimshottari(
  moonLongitude: number,
  birthDate: Date,
  maxYears: number = 100
): DashaRow[] {
  const NAKSHATRA_SPAN = 360 / 27; // 13°20' = 13.333333°
  const moonNakIndex = Math.floor(moonLongitude / NAKSHATRA_SPAN);
  const degInNak = moonLongitude % NAKSHATRA_SPAN;

  const firstDashaIndex = moonNakIndex % 9;
  const balanceRatio = 1 - (degInNak / NAKSHATRA_SPAN); // Remaining portion of first dasha

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const rows: DashaRow[] = [];

  let curTime = new Date(birthDate.getTime());
  const now = new Date();

  // 1. Iterate Maha Dashas
  for (let mIdx = 0; mIdx < 9; mIdx++) {
    const dashaPlanetIndex = (firstDashaIndex + mIdx) % 9;
    const lordAbbr = STAR_LORDS[dashaPlanetIndex];
    const fullYears = VIMSHOTTARI_YEARS[dashaPlanetIndex];
    const actualYears = mIdx === 0 ? fullYears * balanceRatio : fullYears;
    const dashaDurationDays = actualYears * 365.2425;

    const mStart = new Date(curTime.getTime());
    const mEnd = new Date(mStart.getTime() + dashaDurationDays * 86400000);

    // 2. Iterate Antardashas within Mahadasha
    for (let aIdx = 0; aIdx < 9; aIdx++) {
      const antarPlanetIndex = (dashaPlanetIndex + aIdx) % 9;
      const antarAbbr = STAR_LORDS[antarPlanetIndex];
      const antarFraction = (VIMSHOTTARI_YEARS[antarPlanetIndex] / 120);
      const antarDays = dashaDurationDays * antarFraction;

      const aStart = new Date(curTime.getTime());
      const aEnd = new Date(aStart.getTime() + antarDays * 86400000);

      // Only generate finer subdivisions around current date (or first 20 active rows)
      if (aEnd >= now || rows.length < 30) {
        // 3. Pratyantardashas within Antardasha
        for (let pIdx = 0; pIdx < 9; pIdx++) {
          const pratyantarPlanetIndex = (antarPlanetIndex + pIdx) % 9;
          const pratyAbbr = STAR_LORDS[pratyantarPlanetIndex];
          const pratyFraction = (VIMSHOTTARI_YEARS[pratyantarPlanetIndex] / 120);
          const pratyDays = antarDays * pratyFraction;

          const pStart = new Date(curTime.getTime());
          const pEnd = new Date(pStart.getTime() + pratyDays * 86400000);

          // 4. Sookshma Dashas
          for (let sIdx = 0; sIdx < 9; sIdx++) {
            const sookshmaPlanetIndex = (pratyantarPlanetIndex + sIdx) % 9;
            const sookshmaAbbr = STAR_LORDS[sookshmaPlanetIndex];
            const sookshmaDays = pratyDays * (VIMSHOTTARI_YEARS[sookshmaPlanetIndex] / 120);

            const sStart = new Date(curTime.getTime());
            const sEnd = new Date(sStart.getTime() + sookshmaDays * 86400000);

            const dayStr = DAY_NAMES[sStart.getDay()];
            const dd = String(sStart.getDate()).padStart(2, '0');
            const mm = String(sStart.getMonth() + 1).padStart(2, '0');
            const yyyy = sStart.getFullYear();
            const dateStr = `${dd}-${mm}-${yyyy}`;

            rows.push({
              title: `${lordAbbr}-${antarAbbr}-${pratyAbbr}-${sookshmaAbbr}`,
              dayOfWeek: dayStr,
              dateStr,
              startDate: sStart,
              endDate: sEnd,
              level: 4,
            });

            curTime = sEnd;
            if (rows.length >= 100) break;
          }
          if (rows.length >= 100) break;
        }
      } else {
        curTime = aEnd;
      }
      if (rows.length >= 100) break;
    }
    if (rows.length >= 100) break;
  }

  return rows;
}

/**
 * Calculate remaining time until Dasha sub-period end
 */
export function calculateRemainingDashaTime(
  now: Date,
  targetEnd: Date | string
): { text: string; years: number; months: number; days: number } {
  const end = typeof targetEnd === 'string' ? new Date(targetEnd) : targetEnd;
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { text: 'Completed', years: 0, months: 0, days: 0 };
  }

  let y = end.getFullYear() - now.getFullYear();
  let m = end.getMonth() - now.getMonth();
  let d = end.getDate() - now.getDate();

  if (d < 0) {
    m -= 1;
    const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    d += prevMonthDays;
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }

  const parts: string[] = [];
  if (y > 0) parts.push(`${y} ${y === 1 ? 'year' : 'years'}`);
  if (m > 0) parts.push(`${m} ${m === 1 ? 'month' : 'months'}`);
  if (d > 0 || parts.length === 0) parts.push(`${d} ${d === 1 ? 'day' : 'days'}`);

  return {
    text: parts.join(' '),
    years: Math.max(0, y),
    months: Math.max(0, m),
    days: Math.max(0, d),
  };
}

/**
 * Compute Gochara (Transit) Positions for a given event/transit date
 */
export function calculateGocharaPositions(
  eventDate: Date,
  natalAscendant: number,
  natalMoonLongitude: number,
  latitude: number = 24.8170,
  longitude: number = 93.9368
): { transits: GocharaTransitRow[]; transitAscendant: number } {
  const natalAscSign = Math.floor(natalAscendant / 30);
  const natalMoonSign = Math.floor(natalMoonLongitude / 30);

  const hours = eventDate.getHours();
  const minutes = eventDate.getMinutes();
  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  const { planets, ascendant } = calculatePlanetaryPositions({
    name: 'Transit',
    gender: 'OTHER',
    dateOfBirth: eventDate,
    timeOfBirth: timeStr,
    latitude,
    longitude,
    timezone: 'Asia/Kolkata',
    utcOffset: 5.5,
    ayanamsa: 'Lahiri',
  });

  const sun = planets.find((p) => p.id === 'su') || planets[0];

  const transits: GocharaTransitRow[] = [];

  // Ascendant Transit
  const ascSub = calculateSubLords(ascendant);
  const ascSign = Math.floor(ascendant / 30);
  transits.push({
    id: 'asc',
    abbr: 'As',
    name: 'Ascendant',
    color: '#0f172a',
    degreeStr: formatDms(ascendant % 30),
    signAbbr: SIGN_ABBRS[ascSign],
    signName: ZODIAC_SIGNS[ascSign]?.name || 'Aries',
    genderNature: `${SIGN_GENDER[ascSign]} ${SIGN_MOBILITY[ascSign]}`,
    subLords: ascSub.str,
    isRetrograde: false,
    houseFromLagna: ((ascSign - natalAscSign + 12) % 12) + 1,
    houseFromMoon: ((ascSign - natalMoonSign + 12) % 12) + 1,
  });

  planets.forEach((p) => {
    const sub = calculateSubLords(p.longitude);
    const cfg = VEDIC_PLANET_CONFIG[p.id] || { abbr: p.name.substring(0, 2), color: '#0f172a', naturalBenefic: true };
    const pSign = p.signIndex;

    // Combustion check: angular distance from Sun
    let combustionPercent: string | undefined = undefined;
    if (p.id !== 'su' && p.id !== 'ra' && p.id !== 'ke' && p.id !== 'mo') {
      const distFromSun = Math.abs(p.longitude - sun.longitude);
      const minAngle = Math.min(distFromSun, 360 - distFromSun);
      if (minAngle < 14) {
        const pct = Math.round(((14 - minAngle) / 14) * 100);
        combustionPercent = `${pct}%`;
      }
    }

    transits.push({
      id: p.id,
      abbr: cfg.abbr,
      name: p.name,
      color: cfg.color,
      degreeStr: formatDms(p.signDegree),
      signAbbr: SIGN_ABBRS[pSign],
      signName: p.signName,
      genderNature: `${SIGN_GENDER[pSign]} ${SIGN_MOBILITY[pSign]}`,
      subLords: sub.str,
      combustionPercent,
      isRetrograde: !!p.isRetrograde,
      houseFromLagna: ((pSign - natalAscSign + 12) % 12) + 1,
      houseFromMoon: ((pSign - natalMoonSign + 12) % 12) + 1,
    });
  });

  return { transits, transitAscendant: ascendant };
}
