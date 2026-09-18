import { ChoghadiyaNature, ChoghadiyaQuality } from '../types/astronomy';

export interface ChoghadiyaRule {
  nature: ChoghadiyaNature;
  sanskritName: string;
  quality: ChoghadiyaQuality;
  ruler: string;
  effect: string;
}

export const CHOGHADIYA_DEFINITIONS: Record<ChoghadiyaNature, ChoghadiyaRule> = {
  Amrit: {
    nature: 'Amrit',
    sanskritName: 'अमृत',
    quality: 'Good',
    ruler: 'Moon (Chandra)',
    effect: 'Highest nectar, best for all auspicious and holy activities',
  },
  Shubh: {
    nature: 'Shubh',
    sanskritName: 'शुभ',
    quality: 'Good',
    ruler: 'Jupiter (Brihaspati)',
    effect: 'Auspicious, excellent for ceremonies, education, marriage',
  },
  Labh: {
    nature: 'Labh',
    sanskritName: 'लाभ',
    quality: 'Good',
    ruler: 'Mercury (Budha)',
    effect: 'Profitable, optimal for business, trade, financial endeavors',
  },
  Char: {
    nature: 'Char',
    sanskritName: 'चर',
    quality: 'Neutral',
    ruler: 'Venus (Shukra)',
    effect: 'Movable, good for travel, vehicle purchase, dynamic activities',
  },
  Rog: {
    nature: 'Rog',
    sanskritName: 'रोग',
    quality: 'Bad',
    ruler: 'Mars (Mangal)',
    effect: 'Disease/Loss, avoid starting healing, warfare, or transactions',
  },
  Kaal: {
    nature: 'Kaal',
    sanskritName: 'काल',
    quality: 'Bad',
    ruler: 'Saturn (Shani)',
    effect: 'Time/Death, inauspicious, delay important undertakings',
  },
  Udveg: {
    nature: 'Udveg',
    sanskritName: 'उद्वेग',
    quality: 'Bad',
    ruler: 'Sun (Surya)',
    effect: 'Anxiety/Agitation, avoid government matters and conflict',
  },
};

// Day sequences starting from Sunrise
// Index 0: Sunday (Ravivar) to 6: Saturday (Shanivar)
export const DAY_CHOGHADIYA_ORDER: ChoghadiyaNature[][] = [
  // Sunday
  ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'],
  // Monday
  ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'],
  // Tuesday
  ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],
  // Wednesday
  ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],
  // Thursday
  ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'],
  // Friday
  ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],
  // Saturday
  ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal'],
];

// Night sequences starting from Sunset
export const NIGHT_CHOGHADIYA_ORDER: ChoghadiyaNature[][] = [
  // Sunday
  ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh'],
  // Monday
  ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'],
  // Tuesday
  ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal'],
  // Wednesday
  ['Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'],
  // Thursday
  ['Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'],
  // Friday
  ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog'],
  // Saturday
  ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh'],
];
