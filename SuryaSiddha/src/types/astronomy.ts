export type PlanetKey =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto'
  | 'Ascendant';

export type Dignity =
  | 'Exalted'
  | 'Moolatrikona'
  | 'Own'
  | 'Great Friend'
  | 'Friend'
  | 'Neutral'
  | 'Enemy'
  | 'Great Enemy'
  | 'Debilitated';

export interface DMS {
  deg: number;
  min: number;
  sec: number;
}

export interface NakshatraInfo {
  index: number;
  name: string;
  sanskritName: string;
  pada: number;
  lord: string;
  deity: string;
  symbol: string;
  ganam: 'Deva' | 'Manushya' | 'Rakshasa';
  nadi: 'Adi' | 'Madhya' | 'Antya';
  yoni: string;
  varna: string;
  vashya: string;
}

export interface PlanetPosition {
  name: PlanetKey;
  sanskritName: string;
  symbol: string;
  glyph: string;
  longitude: number; // 0 - 360 sidereal
  speed: number;
  isRetrograde: boolean;
  isCombust: boolean;
  rashi: number; // 0 to 11
  rashiName: string;
  rashiSanskrit: string;
  degreesInRashi: number; // 0 to 30
  dms: DMS;
  house: number; // 1 to 12
  nakshatra: NakshatraInfo;
  dignity: Dignity;
  aspects: number[]; // Houses aspected (1-12)
  color: string;
}

export interface House {
  number: number; // 1 - 12
  rashi: number; // 0 - 11
  rashiName: string;
  rashiSanskrit: string;
  startDegree: number;
  midDegree: number;
  planets: PlanetPosition[];
  significations: string[];
}

export interface TithiData {
  index: number; // 1 to 30
  name: string;
  sanskritName: string;
  paksha: 'Shukla' | 'Krishna';
  pakshaHindi: string;
  completionPercent: number;
  endsAt: string;
  deity: string;
}

export interface VaraData {
  index: number; // 0=Sunday to 6=Saturday
  name: string;
  sanskritName: string;
  lord: string;
  dayStartTime: string;
}

export interface YogaData {
  index: number; // 1 to 27
  name: string;
  sanskritName: string;
  completionPercent: number;
  endsAt: string;
  meaning: string;
  isAuspicious: boolean;
}

export interface KaranaData {
  index: number; // 1 to 60
  name: string;
  sanskritName: string;
  type: 'Movable' | 'Fixed';
  lord: string;
  deity: string;
}

export interface PanchangData {
  date: string;
  time: string;
  sunrise: string;
  sunset: string;
  moonrise?: string;
  solarNoon: string;
  tithi: TithiData;
  vara: VaraData;
  nakshatra: NakshatraInfo & { completionPercent: number; endsAt: string };
  yoga: YogaData;
  karana: KaranaData;
  ayanamsa: {
    type: string;
    value: number;
    formatted: string;
  };
  ritu: {
    name: string;
    sanskritName: string;
  };
  samvat: {
    vikram: number;
    shaka: number;
  };
}

export type ChoghadiyaNature = 'Amrit' | 'Shubh' | 'Labh' | 'Char' | 'Rog' | 'Kaal' | 'Udveg';
export type ChoghadiyaQuality = 'Good' | 'Neutral' | 'Bad';

export interface ChoghadiyaPeriod {
  name: string;
  sanskritName: string;
  nature: ChoghadiyaNature;
  quality: ChoghadiyaQuality;
  ruler: string;
  start: string;
  end: string;
  isCurrent: boolean;
}

export interface AuspiciousTimes {
  brahmaMuhurta: { start: string; end: string };
  abhijitMuhurta: { start: string; end: string; isAuspicious: boolean };
  rahuKaal: { start: string; end: string };
  yamaganda: { start: string; end: string };
  gulikaKaal: { start: string; end: string };
  durMuhurta: { start: string; end: string }[];
  choghadiyaDay: ChoghadiyaPeriod[];
  choghadiyaNight: ChoghadiyaPeriod[];
}

export interface VimshottariDashaNode {
  planet: string;
  sanskritName: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  level: 'Mahadasha' | 'Antardasha' | 'Pratyantardasha';
  isActive: boolean;
  progressPercent: number;
  children?: VimshottariDashaNode[];
}

export interface SadeSatiPhase {
  phase: string;
  sign: string;
  signSanskrit: string;
  status: 'Past' | 'Active' | 'Upcoming';
  period: string;
  description: string;
}

export interface SadeSatiData {
  isUnderSadeSati: boolean;
  currentPhase:
    | 'None'
    | 'Phase 1: Rising (12th House from Moon)'
    | 'Phase 2: Peak (Moon Sign)'
    | 'Phase 3: Setting (2nd House from Moon)'
    | 'Small Panoti / Kantaka Shani (4th House)'
    | 'Ashtama Shani (8th House)';
  moonSign: string;
  saturnSign: string;
  description: string;
  remedies: string[];
  timeline: SadeSatiPhase[];
}

export interface ManglikDoshaData {
  isManglik: boolean;
  severity: 'None' | 'Mild' | 'Severe' | 'Cancelled';
  marsHouseLagna: number;
  marsHouseMoon: number;
  cancellations: string[];
  reasons: string[];
  remedies: string[];
}

export interface YogaItem {
  name: string;
  sanskritName: string;
  category: 'Raja Yoga' | 'Dhana Yoga' | 'Mahapurusha' | 'Auspicious' | 'Inauspicious' | 'Arishta';
  description: string;
  result: string;
  isPresent: boolean;
  participatingPlanets: string[];
}

export interface UserBirthProfile {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string; // YYYY-MM-DD
  tob: string; // HH:MM or HH:MM:SS
  place: string;
  lat: number;
  lng: number;
  timezone: number; // e.g. 5.5 for IST
}

export interface DivisionalChart {
  code: 'D1' | 'D2' | 'D3' | 'D7' | 'D9' | 'D10' | 'D12' | 'D60' | 'Chandra' | 'Surya';
  name: string;
  title: string;
  houses: House[];
  planets: Record<string, PlanetPosition>;
}

export interface GunaScoreItem {
  name: string;
  sanskritName: string;
  maxScore: number;
  obtainedScore: number;
  area: string;
  description: string;
  maleAttribute: string;
  femaleAttribute: string;
}

export interface AshtakootaResult {
  totalScore: number;
  maxScore: 36;
  percentage: number;
  status: 'Excellent' | 'Good' | 'Average' | 'Not Recommended';
  summary: string;
  items: GunaScoreItem[];
  nadiDosha: boolean;
  bhakootDosha: boolean;
  ganaDosha: boolean;
}

export interface KundliData {
  user: UserBirthProfile;
  lagna: {
    longitude: number;
    rashi: number;
    rashiName: string;
    rashiSanskrit: string;
    degree: number;
    dms: DMS;
    nakshatra: NakshatraInfo;
  };
  planets: Record<string, PlanetPosition>;
  planetList: PlanetPosition[];
  houses: House[];
  divisionalCharts: Record<string, DivisionalChart>;
  panchang: PanchangData;
  muhurta: AuspiciousTimes;
  dasha: {
    birthBalance: {
      planet: string;
      years: number;
      months: number;
      days: number;
    };
    tree: VimshottariDashaNode[];
    activePath: {
      maha: string;
      antar: string;
      pratyantar: string;
    };
  };
  sadeSati: SadeSatiData;
  manglik: ManglikDoshaData;
  yogas: YogaItem[];
}
