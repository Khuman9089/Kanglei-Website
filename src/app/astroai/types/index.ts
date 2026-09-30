export type ProfileType = 'quick' | 'detailed';

export interface BirthProfile {
  id: string;
  name: string;
  relationship: 'Self' | 'Partner' | 'Child' | 'Mother' | 'Father' | 'Friend' | 'Other';
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth?: string; // HH:mm
  birthPlace?: string;
  latitude?: number;
  longitude?: number;
  profileType: ProfileType;
  avatarColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ZodiacSignInfo {
  name: string;
  symbol: string;
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  rulingPlanet: string;
  quality: 'Cardinal' | 'Fixed' | 'Mutable';
  trait: string;
  strengths: string[];
  challenges: string[];
}

export interface NumerologyProfile {
  lifePathNumber: number;
  lifePathMeaning: string;
  lifePathArchetype: string;
  birthDayNumber: number;
  birthDayMeaning: string;
  destinyNumber: number;
  destinyMeaning: string;
  soulUrgeNumber: number;
  soulUrgeMeaning: string;
  personalityNumber: number;
  luckyNumbers: number[];
  favorableDays: string[];
}

export interface LifeCyclePhase {
  ageRange: string;
  title: string;
  theme: string;
  description: string;
  focusArea: string;
  active: boolean;
}

export interface YearlyMonthForecast {
  month: string;
  theme: string;
  focus: string;
  opportunity: string;
  advice: string;
  cosmicScore: number;
}

export interface YearlyPredictionReport {
  year: number;
  overallTheme: string;
  careerOutlook: string;
  loveOutlook: string;
  financialOutlook: string;
  wellnessOutlook: string;
  personalGrowth: string;
  months: YearlyMonthForecast[];
}

export interface CompatibilityResult {
  score: number;
  rating: string;
  elementalSynergy: string;
  communication: { score: number; text: string };
  emotionalConnection: { score: number; text: string };
  lifestyleHarmony: { score: number; text: string };
  longTermPotential: { score: number; text: string };
  advice: string;
}

export interface TarotCard {
  id: string;
  name: string;
  arcana: string;
  symbol: string;
  upright: string;
  love: string;
  career: string;
  growth: string;
}

export interface DailyHoroscope {
  date: string;
  cosmicMessage: string;
  overall: string;
  career: string;
  love: string;
  money: string;
  wellness: string;
  luckyNumber: number;
  luckyColor: string;
  luckyDay: string;
  powerHour: string;
}
