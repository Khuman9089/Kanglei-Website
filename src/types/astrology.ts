export interface PlanetPosition {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  speed: number;
  isRetrograde: boolean;
  signIndex: number;
  signName: string;
  signDegree: number;
  nakshatraIndex: number;
  nakshatraName: string;
  nakshatraPada: number;
  houseNumber: number;
}

export interface HouseData {
  houseNumber: number;
  signIndex: number;
  signName: string;
  startDegree: number;
  endDegree: number;
  planets: PlanetPosition[];
}

export interface ChartData {
  ascendant: number;
  planets: PlanetPosition[];
  houses: HouseData[];
  moonSign: string;
  sunSign: string;
  nakshatras: NakshatraInfo[];
}

export interface DashaPeriod {
  lord: string;
  lordIndex: number;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  level: 'maha' | 'antar' | 'pratyantar';
  subPeriods?: DashaPeriod[];
}

export interface NakshatraInfo {
  index: number;
  name: string;
  lord: string;
  lordIndex: number;
  pada: number;
  startDegree: number;
  endDegree: number;
}

export interface MatchingResult {
  totalScore: number;
  maxScore: number;
  breakdown: {
    Varna: number;
    Vashya: number;
    Tara: number;
    Yoni: number;
    GrahaMaitri: number;
    Gana: number;
    Bhakoot: number;
    Nadi: number;
  };
}

export interface BirthData {
  name: string;
  gender: string;
  dateOfBirth: Date | string;
  timeOfBirth: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utcOffset: number;
  ayanamsa: string;
}
