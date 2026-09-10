/**
 * Vedic Numerology (Ank Shastra) Engine
 *
 * Implements classical Sanskrit/Devanagari letter-to-planet mapping (Chaldean-derived):
 * - Each letter maps to a planet (not just 1-9 like Pythagorean)
 * - Calculates: Moolank (Birth Number), Bhagyank (Destiny Number), Name Numbers
 * - Personal Year/Month/Day cycles (9-year macro cycle)
 * - Pinnacles & Challenges (long-term life phases)
 * - Karmic Debt detection (13, 14, 16, 19)
 * - Vedic interpretations with planet overlays
 */

// Devanagari/Sanskrit letter to planet mapping (Chaldean system adapted for Vedic)
export const DEVANAGARI_LETTER_PLANETS: Record<string, { planet: string; number: number; planetId: string }> = {
  // Vowels (Swar)
  'अ': { planet: 'Sun', number: 1, planetId: 'su' },
  'आ': { planet: 'Sun', number: 1, planetId: 'su' },
  'इ': { planet: 'Moon', number: 2, planetId: 'mo' },
  'ई': { planet: 'Moon', number: 2, planetId: 'mo' },
  'उ': { planet: 'Jupiter', number: 3, planetId: 'ju' },
  'ऊ': { planet: 'Jupiter', number: 3, planetId: 'ju' },
  'ऋ': { planet: 'Mercury', number: 5, planetId: 'me' },
  'ॠ': { planet: 'Mercury', number: 5, planetId: 'me' },
  'ऌ': { planet: 'Venus', number: 6, planetId: 've' },
  'ॡ': { planet: 'Venus', number: 6, planetId: 've' },
  'ए': { planet: 'Mercury', number: 5, planetId: 'me' },
  'ऐ': { planet: 'Mercury', number: 5, planetId: 'me' },
  'ओ': { planet: 'Venus', number: 6, planetId: 've' },
  'औ': { planet: 'Venus', number: 6, planetId: 've' },
  'अं': { planet: 'Saturn', number: 8, planetId: 'sa' },
  'अः': { planet: 'Rahu', number: 4, planetId: 'ra' },

  // Consonants (Vyanjan) - Kavarga
  'क': { planet: 'Mars', number: 9, planetId: 'ma' },
  'ख': { planet: 'Mars', number: 9, planetId: 'ma' },
  'ग': { planet: 'Jupiter', number: 3, planetId: 'ju' },
  'घ': { planet: 'Jupiter', number: 3, planetId: 'ju' },
  'ङ': { planet: 'Mercury', number: 5, planetId: 'me' },

  // Chavarga
  'च': { planet: 'Venus', number: 6, planetId: 've' },
  'छ': { planet: 'Venus', number: 6, planetId: 've' },
  'ज': { planet: 'Jupiter', number: 3, planetId: 'ju' },
  'झ': { planet: 'Jupiter', number: 3, planetId: 'ju' },
  'ञ': { planet: 'Mercury', number: 5, planetId: 'me' },

  // Tavarga
  'ट': { planet: 'Mars', number: 9, planetId: 'ma' },
  'ठ': { planet: 'Mars', number: 9, planetId: 'ma' },
  'ड': { planet: 'Saturn', number: 8, planetId: 'sa' },
  'ढ': { planet: 'Saturn', number: 8, planetId: 'sa' },
  'ण': { planet: 'Saturn', number: 8, planetId: 'sa' },

  // Tavarga (dental)
  'त': { planet: 'Mercury', number: 5, planetId: 'me' },
  'थ': { planet: 'Mercury', number: 5, planetId: 'me' },
  'द': { planet: 'Venus', number: 6, planetId: 've' },
  'ध': { planet: 'Venus', number: 6, planetId: 've' },
  'न': { planet: 'Moon', number: 2, planetId: 'mo' },

  // Pavarga
  'प': { planet: 'Sun', number: 1, planetId: 'su' },
  'फ': { planet: 'Sun', number: 1, planetId: 'su' },
  'ब': { planet: 'Venus', number: 6, planetId: 've' },
  'भ': { planet: 'Venus', number: 6, planetId: 've' },
  'म': { planet: 'Moon', number: 2, planetId: 'mo' },

  // Semivowels/Sibilants
  'य': { planet: 'Jupiter', number: 3, planetId: 'ju' },
  'र': { planet: 'Sun', number: 1, planetId: 'su' },
  'ल': { planet: 'Mars', number: 9, planetId: 'ma' },
  'व': { planet: 'Venus', number: 6, planetId: 've' },
  'श': { planet: 'Saturn', number: 8, planetId: 'sa' },
  'ष': { planet: 'Saturn', number: 8, planetId: 'sa' },
  'स': { planet: 'Saturn', number: 8, planetId: 'sa' },
  'ह': { planet: 'Saturn', number: 8, planetId: 'sa' },

  // Conjuncts/Extensions
  'क्ष': { planet: 'Ketu', number: 7, planetId: 'ke' },
  'त्र': { planet: 'Rahu', number: 4, planetId: 'ra' },
  'ज्ञ': { planet: 'Jupiter', number: 3, planetId: 'ju' },
  'श्र': { planet: 'Venus', number: 6, planetId: 've' },

  // English fallback (Chaldean mapping)
  'a': { planet: 'Sun', number: 1, planetId: 'su' },
  'b': { planet: 'Venus', number: 2, planetId: 've' },
  'c': { planet: 'Jupiter', number: 3, planetId: 'ju' },
  'd': { planet: 'Rahu', number: 4, planetId: 'ra' },
  'e': { planet: 'Mercury', number: 5, planetId: 'me' },
  'f': { planet: 'Venus', number: 8, planetId: 've' },
  'g': { planet: 'Saturn', number: 3, planetId: 'sa' },
  'h': { planet: 'Moon', number: 5, planetId: 'mo' },
  'i': { planet: 'Sun', number: 1, planetId: 'su' },
  'j': { planet: 'Jupiter', number: 1, planetId: 'ju' },
  'k': { planet: 'Moon', number: 2, planetId: 'mo' },
  'l': { planet: 'Jupiter', number: 3, planetId: 'ju' },
  'm': { planet: 'Rahu', number: 4, planetId: 'ra' },
  'n': { planet: 'Mercury', number: 5, planetId: 'me' },
  'o': { planet: 'Venus', number: 7, planetId: 've' },
  'p': { planet: 'Saturn', number: 8, planetId: 'sa' },
  'q': { planet: 'Ketu', number: 1, planetId: 'ke' },
  'r': { planet: 'Sun', number: 2, planetId: 'su' },
  's': { planet: 'Moon', number: 3, planetId: 'mo' },
  't': { planet: 'Jupiter', number: 4, planetId: 'ju' },
  'u': { planet: 'Rahu', number: 6, planetId: 'ra' },
  'v': { planet: 'Mercury', number: 6, planetId: 'me' },
  'w': { planet: 'Venus', number: 6, planetId: 've' },
  'x': { planet: 'Saturn', number: 5, planetId: 'sa' },
  'y': { planet: 'Ketu', number: 1, planetId: 'ke' },
  'z': { planet: 'Sun', number: 7, planetId: 'su' },
};

export const PLANET_MEANINGS: Record<string, {
  name: string;
  devanagari: string;
  positive: string[];
  challenging: string[];
  karmicLesson: string;
  remedies: string[];
}> = {
  su: { name: 'Sun (सूर्य)', devanagari: 'सूर्य', positive: ['Leadership', 'Authority', 'Vitality', 'Father', 'Government'], challenging: ['Ego', 'Domination', 'Heart issues'], karmicLesson: 'Learn humility; serve without seeking recognition', remedies: ['Surya Namaskar', 'Offer water to Sun at sunrise', 'Wear ruby', 'Chant Gayatri Mantra'] },
  mo: { name: 'Moon (चन्द्र)', devanagari: 'चन्द्र', positive: ['Intuition', 'Nurturing', 'Mind', 'Mother', 'Travel'], challenging: ['Emotional instability', 'Mood swings', 'Dependency'], karmicLesson: 'Balance emotions; nurture self before others', remedies: ['Chandra Namaskar', 'Drink water in silver vessel', 'Wear pearl', 'Chant Chandra Mantra'] },
  ma: { name: 'Mars (मंगल)', devanagari: 'मंगल', positive: ['Courage', 'Energy', 'Brothers', 'Real estate', 'Surgery'], challenging: ['Anger', 'Accidents', 'Conflicts'], karmicLesson: 'Channel aggression constructively; protect the weak', remedies: ['Hanuman Chalisa', 'Donate red lentils', 'Wear red coral', 'Practice martial arts'] },
  me: { name: 'Mercury (बुध)', devanagari: 'बुध', positive: ['Intellect', 'Communication', 'Business', 'Education', 'Siblings'], challenging: ['Nervousness', 'Overthinking', 'Deception'], karmicLesson: 'Speak truth; use intelligence for service', remedies: ['Feed green grass to cows', 'Wear emerald', 'Chant Budh Mantra', 'Study scriptures'] },
  ju: { name: 'Jupiter (बृहस्पति)', devanagari: 'बृहस्पति', positive: ['Wisdom', 'Wealth', 'Children', 'Guru', 'Spirituality'], challenging: ['Excess', 'Dogmatism', 'Liver issues'], karmicLesson: 'Share knowledge freely; remain a student', remedies: ['Respect teachers', 'Donate yellow items', 'Wear yellow sapphire', 'Chant Guru Mantra'] },
  ve: { name: 'Venus (शुक्र)', devanagari: 'शुक्र', positive: ['Love', 'Beauty', 'Art', 'Luxury', 'Relationships'], challenging: ['Indulgence', 'Vanity', 'Reproductive issues'], karmicLesson: 'Love unconditionally; appreciate beauty without attachment', remedies: ['Worship Lakshmi', 'Wear diamond/white sapphire', 'Chant Shukra Mantra', 'Keep surroundings beautiful'] },
  sa: { name: 'Saturn (शनि)', devanagari: 'शनि', positive: ['Discipline', 'Karma', 'Longevity', 'Service', 'Structure'], challenging: ['Delays', 'Hardship', 'Isolation', 'Chronic issues'], karmicLesson: 'Accept responsibility; serve selflessly', remedies: ['Feed crows', 'Wear blue sapphire', 'Chant Shani Mantra', 'Help the elderly'] },
  ra: { name: 'Rahu (राहु)', devanagari: 'राहु', positive: ['Innovation', 'Foreign connections', 'Technology', 'Ambition'], challenging: ['Obsession', 'Illusion', 'Addiction', 'Sudden falls'], karmicLesson: 'Detach from material illusions; seek truth', remedies: ['Wear hessonite', 'Chant Rahu Mantra', 'Donate black/blue items', 'Meditation'] },
  ke: { name: 'Ketu (केतु)', devanagari: 'केतु', positive: ['Spirituality', 'Moksha', 'Research', 'Astrology', 'Detachment'], challenging: ['Confusion', 'Isolation', 'Past life karma'], karmicLesson: 'Surrender; transcend duality', remedies: ['Wear cat\'s eye', 'Chant Ketu Mantra', 'Donate multi-colored items', 'Spiritual practice'] },
};

export const KARMIC_DEBTS: Record<number, { number: number; lesson: string; description: string; remedies: string[] }> = {
  13: { number: 13, lesson: 'Transformation through effort', description: 'Karmic debt of laziness in past life. Must work hard to achieve success.', remedies: ['Consistent daily routine', 'Avoid shortcuts', 'Physical labor/service', 'Chant "Om Namah Shivaya"'] },
  14: { number: 14, lesson: 'Freedom through discipline', description: 'Karmic debt of misuse of freedom. Must learn self-discipline.', remedies: ['Set boundaries', 'Avoid addictions', 'Regular meditation', 'Chant "Om Gam Ganapataye Namaha"'] },
  16: { number: 16, lesson: 'Humility through fall', description: 'Karmic debt of ego/pride. Tower moment forces spiritual awakening.', remedies: ['Accept failures as lessons', 'Practice humility', 'Serve others', 'Chant "Om Namo Narayanaya"'] },
  19: { number: 19, lesson: 'Independence through service', description: 'Karmic debt of selfishness. Must learn to serve others.', remedies: ['Volunteer regularly', 'Share resources', 'Lead by serving', 'Chant "Om Sri Ramaya Namaha"'] },
};

export interface NumerologyInput {
  fullName: string; // Devanagari or English
  dob: string; // YYYY-MM-DD
  gender?: 'Male' | 'Female' | 'Other';
}

export interface LetterAnalysis {
  letter: string;
  planet: string;
  planetId: string;
  number: number;
  devanagari?: string;
}

export interface AnkKundaliPlane {
  name: string;
  numbers: number[];
  present: number[];
  status: 'Full (100%)' | 'Partial (50%)' | 'Empty (0%)';
  meaning: string;
}

export interface AnkKundaliGrid {
  grid: Record<number, number>; // counts of 1-9
  planes: {
    thought: AnkKundaliPlane;   // 4, 9, 2
    will: AnkKundaliPlane;      // 3, 5, 7
    action: AnkKundaliPlane;    // 8, 1, 6
    mental: AnkKundaliPlane;    // 4, 3, 8
    emotional: AnkKundaliPlane; // 9, 5, 1
    practical: AnkKundaliPlane; // 2, 7, 6
    goldenRaja: AnkKundaliPlane; // 4, 5, 6
    silverRaja: AnkKundaliPlane; // 2, 5, 8
  };
  missingNumbers: number[];
  repeatedNumbers: { num: number; count: number }[];
  strengthsSummary: string[];
}

export interface LuckyAttributes {
  luckyNumbers: number[];
  neutralNumbers: number[];
  enemyNumbers: number[];
  luckyColors: string[];
  luckyDays: string[];
  luckyGemstone: string;
  rulingDeity: string;
  luckyDirection: string;
  favorableYantra: string;
  keyMantra: string;
}

export interface NumerologyCore {
  moolank: number; // Birth day reduced (1-9)
  moolankPlanet: string;
  bhagyank: number; // Full date reduced (1-9)
  bhagyankPlanet: string;
  nameNumber: number; // Full name reduced
  nameNumberPlanet: string;
  compoundNameNumber: number; // Before reduction
  soulUrgeNumber: number; // Vowels sum reduced (Atmakaraka vibration)
  personalityNumber: number; // Consonants sum reduced (Outer persona)
  letterAnalysis: LetterAnalysis[];
  isMasterNumber?: {
    moolank?: number;
    bhagyank?: number;
    name?: number;
  };
}

export interface PersonalCycles {
  personalYear: number; // 1-9
  personalMonth: number; // 1-9
  personalDay: number; // 1-9
  personalYearTheme: string;
  personalMonthTheme: string;
  pinnacles: { number: number; ageRange: string; theme: string }[];
  challenges: { number: number; ageRange: string; theme: string }[];
}

export interface NumerologyResult {
  core: NumerologyCore;
  cycles: PersonalCycles;
  karmicDebts: Array<{ number: number; lesson: string; description: string; remedies: string[] }>;
  ankKundali: AnkKundaliGrid;
  luckyAttributes: LuckyAttributes;
  compatibility?: {
    lifePath: number;
    expression: number;
    soulUrge: number;
  };
  vedicBridge?: {
    moolankDashaLord: string;
    bhagyankDashaLord: string;
    nameNumberDashaLord: string;
  };
}

/**
 * Reduce number to single digit (1-9), except master numbers 11, 22, 33
 */
function reduceNumber(num: number, keepMaster = false): number {
  if (keepMaster && [11, 22, 33].includes(num)) return num;
  while (num > 9) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return num === 0 ? 9 : num;
}

const NUMBER_PLANET_MAP: Record<number, { planet: string; planetId: string }> = {
  1: { planet: 'Sun', planetId: 'su' },
  2: { planet: 'Moon', planetId: 'mo' },
  3: { planet: 'Jupiter', planetId: 'ju' },
  4: { planet: 'Rahu', planetId: 'ra' },
  5: { planet: 'Mercury', planetId: 'me' },
  6: { planet: 'Venus', planetId: 've' },
  7: { planet: 'Ketu', planetId: 'ke' },
  8: { planet: 'Saturn', planetId: 'sa' },
  9: { planet: 'Mars', planetId: 'ma' },
};

function numberToPlanetId(num: number): string {
  const reduced = reduceNumber(num);
  return NUMBER_PLANET_MAP[reduced]?.planetId || 'su';
}

/**
 * Calculate Moolank (Birth Number) from day of birth
 */
function calculateMoolank(dob: string): { number: number; planet: string; planetId: string } {
  const day = parseInt(dob.split('-')[2], 10);
  const reduced = reduceNumber(day);
  const planetInfo = Object.values(DEVANAGARI_LETTER_PLANETS).find(p => p.number === reduced) || { planet: 'Unknown', number: reduced, planetId: 'su' };
  return { number: reduced, planet: planetInfo.planet, planetId: planetInfo.planetId };
}

/**
 * Calculate Bhagyank (Destiny Number) from full date
 */
function calculateBhagyank(dob: string): { number: number; planet: string; planetId: string } {
  const digits = dob.replace(/-/g, '').split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  const reduced = reduceNumber(sum);
  const planetInfo = Object.values(DEVANAGARI_LETTER_PLANETS).find(p => p.number === reduced) || { planet: 'Unknown', number: reduced, planetId: 'su' };
  return { number: reduced, planet: planetInfo.planet, planetId: planetInfo.planetId };
}

/**
 * Is letter a vowel (in Devanagari or English)?
 */
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ॠ', 'ऌ', 'ॡ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः']);

/**
 * Analyze name letters and calculate name numbers
 */
function analyzeName(fullName: string): {
  letterAnalysis: LetterAnalysis[];
  compoundNumber: number;
  reducedNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  planet: string;
  planetId: string;
} {
  const cleanName = fullName.trim().replace(/\s+/g, '');
  const letters = [...cleanName];

  const letterAnalysis: LetterAnalysis[] = [];
  let compoundSum = 0;
  let vowelSum = 0;
  let consonantSum = 0;

  for (const letter of letters) {
    const mapping = DEVANAGARI_LETTER_PLANETS[letter] ||
                    DEVANAGARI_LETTER_PLANETS[letter.toLowerCase()] ||
                    { planet: 'Unknown', number: 0, planetId: 'su' };

    if (mapping.number > 0) {
      compoundSum += mapping.number;
      if (VOWELS.has(letter) || VOWELS.has(letter.toLowerCase())) {
        vowelSum += mapping.number;
      } else {
        consonantSum += mapping.number;
      }
    }

    letterAnalysis.push({
      letter,
      planet: mapping.planet,
      planetId: mapping.planetId,
      number: mapping.number,
      devanagari: /[\u0900-\u097F]/.test(letter) ? letter : undefined,
    });
  }

  const reduced = reduceNumber(compoundSum, true);
  const soulUrgeNumber = reduceNumber(vowelSum, true);
  const personalityNumber = reduceNumber(consonantSum, true);
  const planetInfo = Object.values(DEVANAGARI_LETTER_PLANETS).find(p => p.number === reduced) || { planet: 'Unknown', number: reduced, planetId: 'su' };

  return {
    letterAnalysis,
    compoundNumber: compoundSum,
    reducedNumber: reduced,
    soulUrgeNumber: soulUrgeNumber || 1,
    personalityNumber: personalityNumber || 1,
    planet: planetInfo.planet,
    planetId: planetInfo.planetId,
  };
}

/**
 * Calculate Vedic 3x3 Ank Kundali Grid (Lo Shu Plane System)
 */
export function calculateAnkKundaliGrid(dob: string, moolank: number, bhagyank: number): AnkKundaliGrid {
  const digits = dob.replace(/\D/g, '').split('').map(Number).filter(d => d >= 1 && d <= 9);
  
  const grid: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  
  // Count birth date digits
  for (const d of digits) {
    grid[d] = (grid[d] || 0) + 1;
  }
  // Also add Moolank and Bhagyank vibrations to the native chart
  if (moolank >= 1 && moolank <= 9) grid[moolank] = (grid[moolank] || 0) + 1;
  if (bhagyank >= 1 && bhagyank <= 9) grid[bhagyank] = (grid[bhagyank] || 0) + 1;

  const getPlaneStatus = (nums: number[]): { status: 'Full (100%)' | 'Partial (50%)' | 'Empty (0%)'; present: number[] } => {
    const present = nums.filter(n => (grid[n] || 0) > 0);
    if (present.length === nums.length) return { status: 'Full (100%)', present };
    if (present.length > 0) return { status: 'Partial (50%)', present };
    return { status: 'Empty (0%)', present };
  };

  const thought = getPlaneStatus([4, 9, 2]);
  const will = getPlaneStatus([3, 5, 7]);
  const action = getPlaneStatus([8, 1, 6]);
  const mental = getPlaneStatus([4, 3, 8]);
  const emotional = getPlaneStatus([9, 5, 1]);
  const practical = getPlaneStatus([2, 7, 6]);
  const goldenRaja = getPlaneStatus([4, 5, 6]);
  const silverRaja = getPlaneStatus([2, 5, 8]);

  const planes = {
    thought: {
      name: 'Thought Plane (4-9-2)',
      numbers: [4, 9, 2],
      present: thought.present,
      status: thought.status,
      meaning: 'Sharp intellect, conceptual vision, analytical depth, strategy and planning mastery.',
    },
    will: {
      name: 'Will Power Plane (3-5-7)',
      numbers: [3, 5, 7],
      present: will.present,
      status: will.status,
      meaning: 'Unshakeable determination, resilience through hardships, spiritual will & perseverance.',
    },
    action: {
      name: 'Action Plane (8-1-6)',
      numbers: [8, 1, 6],
      present: action.present,
      status: action.status,
      meaning: 'Execution speed, commercial success, turning mental concepts into physical reality.',
    },
    mental: {
      name: 'Mental Plane (4-3-8)',
      numbers: [4, 3, 8],
      present: mental.present,
      status: mental.status,
      meaning: 'Deep learning ability, memory retention, logical reasoning & scholarly pursuits.',
    },
    emotional: {
      name: 'Emotional / Spiritual Plane (9-5-1)',
      numbers: [9, 5, 1],
      present: emotional.present,
      status: emotional.status,
      meaning: 'Intuition, compassion, heart-centered leadership, emotional balance & public empathy.',
    },
    practical: {
      name: 'Practical / Business Plane (2-7-6)',
      numbers: [2, 7, 6],
      present: practical.present,
      status: practical.status,
      meaning: 'Hands-on practicality, craftmanship, financial prudence & grounded lifestyle.',
    },
    goldenRaja: {
      name: 'Golden Raja Yoga Plane (4-5-6)',
      numbers: [4, 5, 6],
      present: goldenRaja.present,
      status: goldenRaja.status,
      meaning: 'Auspicious Raja Yoga: Prosperity, high administrative status, name, fame & wealth accumulation.',
    },
    silverRaja: {
      name: 'Silver Property Yoga Plane (2-5-8)',
      numbers: [2, 5, 8],
      present: silverRaja.present,
      status: silverRaja.status,
      meaning: 'Real estate, land/property luck, stable foundations and long-term financial security.',
    },
  };

  const missingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => (grid[n] || 0) === 0);
  const repeatedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .filter(n => (grid[n] || 0) > 1)
    .map(num => ({ num, count: grid[num] }));

  const strengthsSummary: string[] = [];
  if (thought.status === 'Full (100%)') strengthsSummary.push('Exceptional strategic intellect & vision');
  if (will.status === 'Full (100%)') strengthsSummary.push('Unyielding willpower and crisis survival');
  if (action.status === 'Full (100%)') strengthsSummary.push('Dynamic execution & material manifestation');
  if (goldenRaja.status === 'Full (100%)') strengthsSummary.push('Golden Raja Yoga: Exceptional fortune and leadership power');
  if (silverRaja.status === 'Full (100%)') strengthsSummary.push('Silver Yoga: High property, real-estate and asset gains');
  if (strengthsSummary.length === 0) strengthsSummary.push('Balanced multidimensional chart with adaptive growth opportunities');

  return {
    grid,
    planes,
    missingNumbers,
    repeatedNumbers,
    strengthsSummary,
  };
}

/**
 * Calculate Vedic Lucky Attributes & Elements based on Moolank & Bhagyank
 */
export function calculateLuckyAttributes(moolank: number, bhagyank: number): LuckyAttributes {
  const luckyMap: Record<number, {
    lucky: number[];
    neutral: number[];
    enemy: number[];
    colors: string[];
    days: string[];
    gemstone: string;
    deity: string;
    direction: string;
    yantra: string;
    mantra: string;
  }> = {
    1: { lucky: [1, 2, 3, 9], neutral: [5], enemy: [6, 8], colors: ['Golden Yellow', 'Orange', 'Ruby Red'], days: ['Sunday', 'Thursday'], gemstone: 'Ruby (Manikya)', deity: 'Surya Dev / Lord Rama', direction: 'East', yantra: 'Surya Yantra', mantra: 'Om Hram Hreem Hroum Sah Suryaya Namah' },
    2: { lucky: [1, 2, 3, 5], neutral: [9], enemy: [4, 8, 9], colors: ['Pearl White', 'Cream', 'Silver', 'Light Green'], days: ['Monday', 'Sunday'], gemstone: 'Pearl (Moti) / Moonstone', deity: 'Lord Shiva / Parvati', direction: 'North-West', yantra: 'Chandra Yantra', mantra: 'Om Shram Shreem Shroum Sah Chandraya Namah' },
    3: { lucky: [1, 2, 3, 9], neutral: [5, 8], enemy: [6], colors: ['Bright Yellow', 'Golden', 'Saffron'], days: ['Thursday', 'Tuesday'], gemstone: 'Yellow Sapphire (Pukhraj)', deity: 'Lord Vishnu / Brihaspati', direction: 'North-East (Ishanya)', yantra: 'Guru Yantra', mantra: 'Om Gram Greem Groum Sah Gurave Namah' },
    4: { lucky: [1, 5, 6, 8], neutral: [7], enemy: [2, 4, 9], colors: ['Electric Blue', 'Grey', 'Brown', 'Smoky'], days: ['Saturday', 'Sunday'], gemstone: 'Hessonite (Gomed)', deity: 'Goddess Durga / Bhairava', direction: 'South-West', yantra: 'Rahu Yantra', mantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namah' },
    5: { lucky: [1, 3, 5, 6], neutral: [2, 8], enemy: [9], colors: ['Emerald Green', 'Light Turquoise', 'Mint'], days: ['Wednesday', 'Friday'], gemstone: 'Emerald (Panna)', deity: 'Lord Ganesha / Vishnu', direction: 'North', yantra: 'Budh Yantra', mantra: 'Om Bram Breem Broum Sah Budhaya Namah' },
    6: { lucky: [1, 5, 6, 8], neutral: [7, 9], enemy: [3], colors: ['Diamond White', 'Pink', 'Light Blue', 'Silver'], days: ['Friday', 'Wednesday'], gemstone: 'Diamond / White Sapphire (Zircon)', deity: 'Goddess Lakshmi / Shukra', direction: 'South-East', yantra: 'Shukra Yantra', mantra: 'Om Shram Shreem Shroum Sah Shukraya Namah' },
    7: { lucky: [1, 2, 4, 7], neutral: [5, 6], enemy: [8, 9], colors: ['Smoky White', 'Light Green', 'Multi-color'], days: ['Thursday', 'Monday'], gemstone: 'Cat\'s Eye (Lehsuniya)', deity: 'Lord Ganesha / Matsya Avatar', direction: 'North-East', yantra: 'Ketu Yantra', mantra: 'Om Stram Streem Stroum Sah Ketave Namah' },
    8: { lucky: [3, 4, 5, 6, 8], neutral: [7], enemy: [1, 2, 9], colors: ['Dark Blue', 'Black', 'Purple', 'Navy'], days: ['Saturday', 'Wednesday'], gemstone: 'Blue Sapphire (Neelam) / Amethyst', deity: 'Lord Hanuman / Shani Dev', direction: 'West', yantra: 'Shani Yantra', mantra: 'Om Sham Shanaishcharaya Namah' },
    9: { lucky: [1, 2, 3, 9], neutral: [7], enemy: [4, 5, 8], colors: ['Deep Red', 'Crimson', 'Coral Pink'], days: ['Tuesday', 'Thursday'], gemstone: 'Red Coral (Moonga)', deity: 'Lord Kartikeya / Hanuman', direction: 'South', yantra: 'Mangal Yantra', mantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namah' },
  };

  const mData = luckyMap[moolank] || luckyMap[1];
  const bData = luckyMap[bhagyank] || luckyMap[1];

  const uniqueNumbers = (arr: number[]) => Array.from(new Set(arr));
  const uniqueStrings = (arr: string[]) => Array.from(new Set(arr));

  return {
    luckyNumbers: uniqueNumbers([...mData.lucky, ...bData.lucky]),
    neutralNumbers: uniqueNumbers([...mData.neutral, ...bData.neutral]),
    enemyNumbers: uniqueNumbers([...mData.enemy, ...bData.enemy]),
    luckyColors: uniqueStrings([...mData.colors, ...bData.colors]),
    luckyDays: uniqueStrings([...mData.days, ...bData.days]),
    luckyGemstone: `${mData.gemstone} (for Moolank) & ${bData.gemstone} (for Bhagyank)`,
    rulingDeity: `${mData.deity}`,
    luckyDirection: mData.direction,
    favorableYantra: mData.yantra,
    keyMantra: mData.mantra,
  };
}

/**
 * Calculate Personal Year, Month, Day cycles
 */
function calculatePersonalCycles(dob: string, targetDate: Date = new Date()): PersonalCycles {
  const [, , day] = dob.split('-').map(Number);
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();
  const targetDay = targetDate.getDate();

  // Personal Year = reduced(birth day + birth month + current year)
  const pySum = day + month + year;
  const personalYear = reduceNumber(pySum);

  // Personal Month = reduced(personalYear + current month)
  const personalMonth = reduceNumber(personalYear + month);

  // Personal Day = reduced(personalMonth + current day)
  const personalDay = reduceNumber(personalMonth + targetDay);

  // Pinnacles (long-term cycles)
  const birthYear = parseInt(dob.split('-')[0], 10);
  const birthMonth = parseInt(dob.split('-')[1], 10);
  const birthDay = day;

  const pinnacle1 = reduceNumber(birthMonth + birthDay);
  const pinnacle2 = reduceNumber(birthDay + birthYear);
  const pinnacle3 = reduceNumber(pinnacle1 + pinnacle2);
  const pinnacle4 = reduceNumber(birthMonth + birthYear);

  const currentAge = year - birthYear + (targetDate.getMonth() + 1 >= birthMonth ? 1 : 0);
  const pinnacleDuration = 27; // ~27 years per pinnacle (108/4)

  const pinnacles = [
    { number: pinnacle1, ageRange: `0-${pinnacleDuration}`, theme: `First Pinnacle` },
    { number: pinnacle2, ageRange: `${pinnacleDuration + 1}-${pinnacleDuration * 2}`, theme: `Second Pinnacle` },
    { number: pinnacle3, ageRange: `${pinnacleDuration * 2 + 1}-${pinnacleDuration * 3}`, theme: `Third Pinnacle` },
    { number: pinnacle4, ageRange: `${pinnacleDuration * 3 + 1}+`, theme: `Fourth Pinnacle` },
  ];

  // Challenges
  const challenge1 = Math.abs(birthMonth - birthDay);
  const challenge2 = Math.abs(birthDay - (birthYear % 100));
  const challenge3 = Math.abs(challenge1 - challenge2);
  const challenge4 = Math.abs(birthMonth - (birthYear % 100));

  const challenges = [
    { number: reduceNumber(challenge1), ageRange: `0-${pinnacleDuration}`, theme: 'First Challenge' },
    { number: reduceNumber(challenge2), ageRange: `${pinnacleDuration + 1}-${pinnacleDuration * 2}`, theme: 'Second Challenge' },
    { number: reduceNumber(challenge3), ageRange: `${pinnacleDuration * 2 + 1}-${pinnacleDuration * 3}`, theme: 'Third Challenge' },
    { number: reduceNumber(challenge4), ageRange: `${pinnacleDuration * 3 + 1}+`, theme: 'Fourth Challenge' },
  ];

  const yearThemes: Record<number, string> = {
    1: 'New beginnings, independence, leadership, planting seeds',
    2: 'Partnership, cooperation, patience, emotional sensitivity',
    3: 'Creative expression, communication, social expansion, joy',
    4: 'Hard work, foundation building, discipline, stability',
    5: 'Change, freedom, travel, adaptability, new experiences',
    6: 'Responsibility, family, service, harmony, domestic focus',
    7: 'Introspection, spirituality, study, analysis, solitude',
    8: 'Power, achievement, material success, karmic harvest',
    9: 'Completion, letting go, humanitarian service, transformation',
  };

  const monthThemes: Record<number, string> = {
    1: 'Initiative, new projects, personal focus',
    2: 'Cooperation, relationships, patience',
    3: 'Creativity, self-expression, social',
    4: 'Work, organization, details',
    5: 'Change, movement, freedom',
    6: 'Family, responsibility, harmony',
    7: 'Study, reflection, spirituality',
    8: 'Business, finance, recognition',
    9: 'Completion, release, service',
  };

  return {
    personalYear,
    personalMonth,
    personalDay,
    personalYearTheme: yearThemes[personalYear] || '',
    personalMonthTheme: monthThemes[personalMonth] || '',
    pinnacles,
    challenges,
  };
}

/**
 * Detect Karmic Debts in core numbers
 */
function detectKarmicDebts(core: NumerologyCore): Array<{ number: number; lesson: string; description: string; remedies: string[] }> {
  const debts: Array<{ number: number; lesson: string; description: string; remedies: string[] }> = [];
  const checkNumbers = [core.moolank, core.bhagyank, core.nameNumber, core.compoundNameNumber];

  for (const num of checkNumbers) {
    if (KARMIC_DEBTS[num] && !debts.find(d => d.number === num)) {
      debts.push(KARMIC_DEBTS[num]);
    }
  }
  return debts;
}

/**
 * MASTER NUMBERS DEEP DIVE (11, 22, 33)
 */
export const MASTER_NUMBERS: Record<number, {
  name: string;
  meaning: string;
  higherOctave: string;
  challenges: string[];
  gifts: string[];
  vedicPlanet: string;
  mantra: string;
}> = {
  11: {
    name: 'Master Illuminator (एकादश)',
    meaning: 'Intuition, inspiration, spiritual messenger, visionary',
    higherOctave: '2 (Moon) - intuition amplified',
    challenges: ['Nervous tension', 'Impractical idealism', 'Self-doubt'],
    gifts: ['Psychic ability', 'Inspirational leadership', 'Spiritual teaching'],
    vedicPlanet: 'Moon (चन्द्र) + Rahu (राहु)',
    mantra: 'Om Aim Hreem Kleem Chamundaye Viche',
  },
  22: {
    name: 'Master Builder (बाईस)',
    meaning: 'Manifestation, large-scale projects, material mastery',
    higherOctave: '4 (Rahu/Saturn) - structure amplified',
    challenges: ['Overwhelming pressure', 'Perfectionism', 'Burnout'],
    gifts: ['Manifesting dreams', 'Large-scale organization', 'Legacy building'],
    vedicPlanet: 'Saturn (शनि) + Rahu (राहु)',
    mantra: 'Om Namo Bhagavate Vasudevaya',
  },
  33: {
    name: 'Master Teacher (तैंतीस)',
    meaning: 'Compassion, healing, spiritual service, Christ consciousness',
    higherOctave: '6 (Venus) - love amplified',
    challenges: ['Martyrdom', 'Over-responsibility', 'Emotional overwhelm'],
    gifts: ['Healing', 'Unconditional love', 'Spiritual leadership'],
    vedicPlanet: 'Venus (शुक्र) + Ketu (केतु)',
    mantra: 'Om Mani Padme Hum',
  },
};

/**
 * ESSENCE CYCLES - Letter-by-letter transit progressions (like Gochara for numerology)
 * Each letter in the name has a duration = its numeric value in years
 */
export interface EssenceCycle {
  age: number;
  year: number;
  letter: string;
  planet: string;
  planetId: string;
  theme: string;
}

export function calculateEssenceCycles(
  fullName: string,
  dob: string,
  targetYear?: number
): {
  cycles: EssenceCycle[];
  currentEssence: EssenceCycle | null;
} {
  const cleanName = fullName.trim().replace(/\s+/g, '');
  const letters = [...cleanName];
  const birthYear = parseInt(dob.split('-')[0], 10);
  const currentYear = targetYear || new Date().getFullYear();
  
  let runningAge = 0;
  const cycles: EssenceCycle[] = [];
  
  for (const letter of letters) {
    const mapping = DEVANAGARI_LETTER_PLANETS[letter] || 
                    DEVANAGARI_LETTER_PLANETS[letter.toLowerCase()] ||
                    { planet: 'Unknown', number: 1, planetId: 'su' };
    
    const duration = mapping.number; // Years this letter influences
    const startAge = runningAge;
    const endAge = runningAge + duration;
    const startYear = birthYear + startAge;
    const endYear = birthYear + endAge;
    
    const theme = ESSENCE_THEMES[mapping.planetId] || 'Transformation';
    
    cycles.push({
      age: startAge,
      year: startYear,
      letter: letter,
      planet: mapping.planet,
      planetId: mapping.planetId,
      theme,
    });
    
    runningAge = endAge;
  }
  
  // Find current essence
  const currentAge = currentYear - parseInt(dob.split('-')[0], 10);
  const currentEssence = cycles.find(c => currentAge >= c.age) || 
                        cycles[cycles.length - 1] || null;
  
  return { cycles, currentEssence };
}

const ESSENCE_THEMES: Record<string, string> = {
  su: 'Self-expression, leadership, identity, authority',
  mo: 'Emotions, home, nurturing, intuition',
  ma: 'Action, courage, conflict, physical energy',
  me: 'Communication, learning, commerce, skills',
  ju: 'Expansion, wisdom, growth, spirituality',
  ve: 'Relationships, beauty, pleasure, art',
  sa: 'Discipline, karma, structure, responsibility',
  ra: 'Obsession, innovation, foreign, desire',
  ke: 'Spirituality, release, research, past-life',
};

/**
 * BUSINESS / BRAND NAME ANALYZER
 * Scores names for specific intentions
 */
export interface BusinessNameAnalysis {
  name: string;
  scores: {
    wealth: number;      // 8, 4, 6
    fame: number;        // 1, 3, 5
    stability: number;   // 4, 8, 6
    innovation: number;  // 5, 3, 1
    harmony: number;     // 2, 6, 9
  };
  dominantPlanet: string;
  recommendations: string[];
}

export function analyzeBusinessName(name: string, intention: 'wealth' | 'fame' | 'stability' | 'innovation' | 'harmony'): BusinessNameAnalysis {
  const analysis = analyzeName(name);
  const num = analysis.reducedNumber;
  const planetId = analysis.planetId;
  
  // Scoring weights per intention
  const weights: Record<string, Record<number, number>> = {
    wealth:      { 8: 100, 4: 80, 6: 70, 1: 60, 3: 50, 9: 40, 2: 30, 5: 20, 7: 10 },
    fame:        { 1: 100, 3: 90, 5: 80, 8: 70, 9: 60, 6: 50, 2: 40, 4: 30, 7: 20 },
    stability:   { 4: 100, 8: 90, 6: 80, 2: 70, 1: 60, 3: 50, 5: 40, 9: 40, 7: 10 },
    innovation:  { 5: 100, 3: 90, 1: 80, 7: 70, 9: 60, 4: 50, 8: 40, 2: 30, 6: 20 },
    harmony:     { 2: 100, 6: 90, 9: 80, 3: 70, 1: 60, 5: 50, 4: 40, 8: 30, 7: 20 },
  };
  
  const weightsForIntention = weights[intention];
  const score = weightsForIntention[num] || 30;
  
  const recommendations: string[] = [];
  if (intention === 'wealth' && num !== 8 && num !== 4) {
    recommendations.push('Consider adding "ह" (Saturn/8) or "ड/ढ" (Rahu/4) to strengthen wealth vibration');
  }
  if (intention === 'fame' && num !== 1 && num !== 3) {
    recommendations.push('Add "अ/आ" (Sun/1) or "उ/ऊ" (Jupiter/3) for fame');
  }
  if (intention === 'stability' && num !== 4 && num !== 8) {
    recommendations.push('Add "ट/ठ" (Mars/Rahu) or "ड/ढ" (Saturn/Rahu) for stability');
  }
  
  return {
    name,
    scores: {
      wealth: weights.wealth[num] || 0,
      fame: weights.fame[num] || 0,
      stability: weights.stability[num] || 0,
      innovation: weights.innovation[num] || 0,
      harmony: weights.harmony[num] || 0,
    },
    dominantPlanet: PLANET_MEANINGS[analysis.planetId]?.name || 'Unknown',
    recommendations,
  };
}

/**
 * MOBILE PHONE NUMBER ANALYZER
 */
export interface MobileNumberAnalysis {
  mobileNumber: string;
  totalSum: number;
  compoundNumber: number;
  singleNumber: number;
  planet: string;
  planetId: string;
  tailDigits: string; // Last 2-4 digits
  tailVibration: number;
  auspiciousness: 'Excellent' | 'Good' | 'Average' | 'Challenging';
  businessCareerSuitability: string;
  personalityImpact: string;
  strengths: string[];
  cautions: string[];
  remedies: string[];
  nativeHarmony?: {
    isFriendlyWithMoolank: boolean;
    isFriendlyWithBhagyank: boolean;
    recommendation: string;
  };
}

/**
 * VEHICLE / HOUSE NUMBER ANALYZER
 */
export interface VehicleHouseAnalysis {
  number: string;
  reduced: number;
  planet: string;
  planetId: string;
  auspicious: 'Excellent' | 'Good' | 'Average' | 'Challenging';
  meaning: string;
  remedies?: string[];
}

export function analyzeVehicleHouseNumber(input: string): VehicleHouseAnalysis {
  const digits = input.replace(/\D/g, '').split('').map(Number);
  if (digits.length === 0) {
    return { number: input, reduced: 0, planet: 'Unknown', planetId: 'su', auspicious: 'Average', meaning: 'No digits found' };
  }

  const sum = digits.reduce((a, b) => a + b, 0);
  const reduced = reduceNumber(sum, true);
  const planetId = numberToPlanetId(reduced);
  const meta = PLANET_MEANINGS[planetId];

  const auspiciousMap: Record<number, 'Excellent' | 'Good' | 'Average' | 'Challenging'> = {
    1: 'Excellent', 2: 'Good', 3: 'Excellent', 4: 'Average',
    5: 'Good', 6: 'Excellent', 7: 'Average', 8: 'Good', 9: 'Excellent',
  };

  const meanings: Record<number, string> = {
    1: 'Leadership, independence, new beginnings',
    2: 'Partnership, harmony, diplomacy',
    3: 'Creativity, expression, growth',
    4: 'Stability, hard work, foundation',
    5: 'Change, freedom, adventure',
    6: 'Harmony, family, responsibility',
    7: 'Spirituality, analysis, introspection',
    8: 'Power, success, material gain',
    9: 'Completion, humanitarianism, wisdom',
  };

  const auspicious = auspiciousMap[reduced] || 'Average';
  const remedies = [];
  if (reduced === 4 || reduced === 7 || reduced === 8) {
    remedies.push('Add a small "ॐ" or Swastika sticker');
    remedies.push('Keep vehicle/house clean and well-maintained');
    if (reduced === 8) remedies.push('Donate on Saturdays');
  }

  return {
    number: input,
    reduced,
    planet: meta?.name || 'Unknown',
    planetId,
    auspicious,
    meaning: meanings[reduced] || 'Unknown',
    remedies: remedies.length > 0 ? remedies : undefined,
  };
}

export function analyzeMobileNumber(
  mobileInput: string,
  nativeMoolank?: number,
  nativeBhagyank?: number
): MobileNumberAnalysis {
  const digits = mobileInput.replace(/\D/g, '').split('').map(Number);
  if (digits.length === 0) {
    return {
      mobileNumber: mobileInput,
      totalSum: 0,
      compoundNumber: 0,
      singleNumber: 0,
      planet: 'Unknown',
      planetId: 'su',
      tailDigits: '',
      tailVibration: 0,
      auspiciousness: 'Average',
      businessCareerSuitability: 'N/A',
      personalityImpact: 'N/A',
      strengths: [],
      cautions: [],
      remedies: [],
    };
  }

  const totalSum = digits.reduce((a, b) => a + b, 0);
  const singleNumber = reduceNumber(totalSum, true);
  const planetId = numberToPlanetId(singleNumber);
  const meta = PLANET_MEANINGS[planetId];

  // Tail digits (last 4 digits or last 2 digits)
  const cleanStr = mobileInput.replace(/\D/g, '');
  const tailStr = cleanStr.slice(-4) || cleanStr.slice(-2) || cleanStr;
  const tailSum = tailStr.split('').map(Number).reduce((a, b) => a + b, 0);
  const tailVibration = reduceNumber(tailSum);

  // Vedic Mobile Number vibration interpretations
  const mobileVibrations: Record<number, {
    suitability: string;
    impact: string;
    strengths: string[];
    cautions: string[];
    rating: 'Excellent' | 'Good' | 'Average' | 'Challenging';
  }> = {
    1: {
      rating: 'Excellent',
      suitability: 'Corporate leaders, business owners, government contractors, CEOs, politicians & executives.',
      impact: 'Boosts command, authoritative speech, respect, independence and initiative.',
      strengths: ['High career recognition', 'Leadership presence in calls', 'Confidence booster'],
      cautions: ['May cause dominance or ego in personal relationships'],
    },
    2: {
      rating: 'Good',
      suitability: 'Counselors, diplomats, artists, public relations, hospitality & client care.',
      impact: 'Enhances peaceful communication, empathy, public trust and friendly negotiations.',
      strengths: ['Gentle persuasive negotiation', 'Attracts cooperative partnerships'],
      cautions: ['Indecisiveness or emotional sensitivity over business calls'],
    },
    3: {
      rating: 'Excellent',
      suitability: 'Astrologers, consultants, gurus, educators, lawyers, advisors & writers.',
      impact: 'Radiates wisdom, guru blessings, expansive knowledge, optimism and high credibility.',
      strengths: ['High client respect', 'Excellent for consultation income', 'Educational authority'],
      cautions: ['May over-commit or talk too long in casual calls'],
    },
    4: {
      rating: 'Average',
      suitability: 'IT professionals, software architects, analytics, mystery solvers & real estate.',
      impact: 'Calculative, sudden opportunities, unconventional ideas and technical mastery.',
      strengths: ['Tech and foreign trade success', 'Sudden breakthroughs'],
      cautions: ['High mental stress, unexpected call interruptions, secret rivals'],
    },
    5: {
      rating: 'Excellent',
      suitability: 'Sales professionals, traders, marketing, e-commerce, media, influencers & networking.',
      impact: 'Fast deals, fluid communication, massive social circle and dynamic agility.',
      strengths: ['High call conversion rate', 'Quick deal closing', 'Superb social charm'],
      cautions: ['Restlessness, frequent phone distraction or over-multitasking'],
    },
    6: {
      rating: 'Excellent',
      suitability: 'Luxury brands, beauty & wellness, entertainment, fashion, jewelry & relationship consultants.',
      impact: 'Attracts wealth, luxury clients, aesthetic charm, popularity and affluent connections.',
      strengths: ['Attracts high-paying clients', 'Pleasing voice resonance', 'Comfort & prosperity'],
      cautions: ['Excessive spending or indulgence in luxury communication'],
    },
    7: {
      rating: 'Average',
      suitability: 'Spiritual healers, occult researchers, astrologers, investigators & scholars.',
      impact: 'Deep analytical insight, intuitive guidance, spiritual detachment and solitude.',
      strengths: ['Deep intuitive foresight', 'Attracts spiritual seekers'],
      cautions: ['Fewer incoming material calls, feeling disconnected from mundane business'],
    },
    8: {
      rating: 'Good',
      suitability: 'Judges, heavy industry, mining, real estate tycoons, finance, law & long-term builders.',
      impact: 'Massive perseverance, financial discipline, karmic accountability and executive authority.',
      strengths: ['High wealth endurance', 'Respect in heavy industries & finance'],
      cautions: ['Heavy workload, delays in call responses, demanding clients'],
    },
    9: {
      rating: 'Excellent',
      suitability: 'Surgeons, military, athletes, real estate builders, activists & energetic pioneers.',
      impact: 'High drive, quick action, courage, humanitarian passion and influential charisma.',
      strengths: ['Urgent problem-solving speed', 'Courageous negotiation', 'Charismatic energy'],
      cautions: ['Impulsive reactions, hot temper during arguments on phone'],
    },
  };

  const vInfo = mobileVibrations[singleNumber] || mobileVibrations[1];

  // Specific remedies
  const remedies: string[] = [];
  if (singleNumber === 4) {
    remedies.push('Keep a golden Goddess Durga or Ganesha wallpaper on lock screen');
    remedies.push('Avoid using phone during Rahu Kaal for major business deals');
  } else if (singleNumber === 8) {
    remedies.push('Keep phone cover in blue/black or neutral tone; avoid red cover');
    remedies.push('Help needy persons or donate on Saturdays to channel Saturn vibration');
  } else if (singleNumber === 7) {
    remedies.push('Use light-colored phone wallpaper; chant Om Ketave Namah for clarity');
  } else {
    remedies.push(`Chant "${meta?.name.split(' ')[0]} Beej Mantra" on auspicious ${meta?.remedies[0] || 'mornings'}`);
  }

  // Check harmony with native's Moolank / Bhagyank
  let nativeHarmony: MobileNumberAnalysis['nativeHarmony'];
  if (nativeMoolank || nativeBhagyank) {
    const luckyM: Record<number, number[]> = {
      1: [1, 2, 3, 9],
      2: [1, 2, 3, 5],
      3: [1, 2, 3, 9],
      4: [1, 5, 6, 8],
      5: [1, 3, 5, 6],
      6: [1, 5, 6, 8],
      7: [1, 2, 4, 7],
      8: [3, 4, 5, 6, 8],
      9: [1, 2, 3, 9],
    };

    const isFriendlyWithMoolank = nativeMoolank ? (luckyM[nativeMoolank]?.includes(singleNumber) ?? false) : true;
    const isFriendlyWithBhagyank = nativeBhagyank ? (luckyM[nativeBhagyank]?.includes(singleNumber) ?? false) : true;

    const recommendation = (isFriendlyWithMoolank && isFriendlyWithBhagyank)
      ? '🌟 Highly Auspicious: Mobile vibration perfectly harmonizes with your Moolank and Bhagyank!'
      : isFriendlyWithMoolank || isFriendlyWithBhagyank
      ? '✓ Balanced Harmony: This mobile number supports your native planetary frequencies.'
      : '⚠️ Neutral / Challenging: Consider choosing a SIM total that aligns with your lucky numbers.';

    nativeHarmony = {
      isFriendlyWithMoolank,
      isFriendlyWithBhagyank,
      recommendation,
    };
  }

  return {
    mobileNumber: mobileInput,
    totalSum,
    compoundNumber: totalSum,
    singleNumber,
    planet: meta?.name || 'Unknown',
    planetId,
    tailDigits: tailStr,
    tailVibration,
    auspiciousness: vInfo.rating,
    businessCareerSuitability: vInfo.suitability,
    personalityImpact: vInfo.impact,
    strengths: vInfo.strengths,
    cautions: vInfo.cautions,
    remedies,
    nativeHarmony,
  };
}

/**
 * LOST OBJECT / HORARY NUMEROLOGY (Prashna-style)
 * Quick answer for immediate questions

 */
export interface HoraryNumerologyResult {
  question: string;
  number: number;
  planet: string;
  answer: 'Yes' | 'No' | 'Maybe' | 'Delay' | 'Effort Required';
  guidance: string;
  timing: string;
}

export function horaryNumerology(question: string, questionerName?: string): HoraryNumerologyResult {
  // Use current moment + question vibration
  const now = new Date();
  const timeNum = now.getHours() * 60 + now.getMinutes();
  const questionNum = question.length;
  const nameNum = questionerName ? analyzeName(questionerName).reducedNumber : 0;
  
  const sum = timeNum + questionNum + nameNum;
  const reduced = reduceNumber(sum, true);
  const planetId = numberToPlanetId(reduced);
  const meta = PLANET_MEANINGS[planetId];
  
  // Answer logic based on planet nature
  let answer: 'Yes' | 'No' | 'Maybe' | 'Delay' | 'Effort Required' = 'Maybe';
  const positivePlanets = ['su', 'mo', 'ju', 've'];
  const delayPlanets = ['sa', 'ke'];
  const effortPlanets = ['ma', 'ra'];
  
  if (positivePlanets.includes(numberToPlanetId(reduced))) answer = 'Yes';
  else if (delayPlanets.includes(numberToPlanetId(reduced))) answer = 'Delay';
  else if (effortPlanets.includes(numberToPlanetId(reduced))) answer = 'Effort Required';
  else answer = 'Maybe';
  
  const timingMap: Record<string, string> = {
    su: 'Within 1 day or Sunday', mo: 'Within 1 month / Monday', ma: 'Within 9 days / Tuesday',
    me: 'Within 30 days / Wednesday', ju: 'Within 3 months / Thursday', ve: 'Within 20 days / Friday',
    sa: 'Long delay (6+ months) / Saturday', ra: 'Sudden / unexpected', ke: 'Spiritual timing / meditation',
  };
  
  return {
    question,
    number: reduced,
    planet: PLANET_MEANINGS[numberToPlanetId(reduced)]?.name || 'Unknown',
    answer,
    guidance: meta?.positive[0] || 'Trust the process',
    timing: timingMap[numberToPlanetId(reduced)] || 'Divine timing',
  };
}

/**
 * PARTNERSHIP / MARRIAGE NUMEROLOGY (advanced)
 */
export interface PartnershipNumerology {
  compatibility: {
    score: number;
    harmony: 'Excellent' | 'Good' | 'Neutral' | 'Challenging';
  };
  business: {
    score: number;
    recommendation: string;
  };
  marriage: {
    score: number;
    recommendation: string;
  };
  challenges: string[];
  remedies: string[];
}

export function analyzePartnership(name1: string, name2: string): PartnershipNumerology {
  const compat = calculateNameCompatibility(name1, name2);
  const a1 = analyzeName(name1);
  const a2 = analyzeName(name2);
  
  // Business compatibility: 8, 4, 6, 1 are good
  const bizNumbers = [8, 4, 6, 1];
  const combined = reduceNumber(a1.reducedNumber + a2.reducedNumber);
  const bizScore = [8,4,6,1].includes(combined) ? 85 : [3,5,9].includes(combined) ? 70 : 50;
  
  // Marriage: 2, 6, 9, 3 are good
  const marriageNums = [2,6,9,3];
  const marScore = marriageNums.includes(combined) ? 85 : [1,5,7].includes(combined) ? 65 : 45;
  
  const challenges: string[] = [];
  const remedies: string[] = [];
  
  if (combined === 4 || combined === 8) {
    challenges.push('Karmic lessons around power/control');
    remedies.push('Chant "Om Shani Devay Namaha" on Saturdays');
  }
  if (combined === 7) {
    challenges.push('Spiritual disconnect possible');
    remedies.push('Meditate together daily');
  }
  
  return {
    compatibility: { score: compat.score, harmony: compat.harmony },
    business: { score: bizScore, recommendation: bizScore > 70 ? 'Favorable for partnership' : 'Proceed with clear contracts' },
    marriage: { score: marScore, recommendation: marScore > 70 ? 'Harmonious union indicated' : 'Requires conscious effort' },
    challenges,
    remedies,
  };
}

/**
 * Main calculation function
 */
export function calculateVedicNumerology(input: NumerologyInput): NumerologyResult {
  const moolank = calculateMoolank(input.dob);
  const bhagyank = calculateBhagyank(input.dob);
  const nameAnalysis = analyzeName(input.fullName);

  // Check master numbers
  const rawDay = parseInt(input.dob.split('-')[2], 10);
  const dateDigits = input.dob.replace(/\D/g, '').split('').map(Number);
  const rawDateSum = dateDigits.reduce((a, b) => a + b, 0);

  const isMasterNumber = {
    moolank: [11, 22].includes(rawDay) ? rawDay : undefined,
    bhagyank: [11, 22, 33].includes(rawDateSum) ? rawDateSum : undefined,
    name: [11, 22, 33].includes(nameAnalysis.compoundNumber) ? nameAnalysis.compoundNumber : undefined,
  };

  const core: NumerologyCore = {
    moolank: moolank.number,
    moolankPlanet: moolank.planet,
    bhagyank: bhagyank.number,
    bhagyankPlanet: bhagyank.planet,
    nameNumber: nameAnalysis.reducedNumber,
    nameNumberPlanet: nameAnalysis.planet,
    compoundNameNumber: nameAnalysis.compoundNumber,
    soulUrgeNumber: nameAnalysis.soulUrgeNumber,
    personalityNumber: nameAnalysis.personalityNumber,
    letterAnalysis: nameAnalysis.letterAnalysis,
    isMasterNumber,
  };

  const cycles = calculatePersonalCycles(input.dob);
  const karmicDebts = detectKarmicDebts(core);
  const ankKundali = calculateAnkKundaliGrid(input.dob, moolank.number, bhagyank.number);
  const luckyAttributes = calculateLuckyAttributes(moolank.number, bhagyank.number);

  // Vedic Bridge: map numbers to Dasha lords
  const dashaLords = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  const vedicBridge = {
    moolankDashaLord: dashaLords[(core.moolank - 1) % 9] || 'Ketu',
    bhagyankDashaLord: dashaLords[(core.bhagyank - 1) % 9] || 'Ketu',
    nameNumberDashaLord: dashaLords[(core.nameNumber - 1) % 9] || 'Ketu',
  };

  return {
    core,
    cycles,
    karmicDebts,
    ankKundali,
    luckyAttributes,
    vedicBridge,
  };
}

/**
 * Name correction suggestions - find letters to add/change to strengthen weak planets
 */
export function suggestNameCorrections(
  input: NumerologyInput,
  targetPlanetId: string
): { suggestions: string[]; addedLetters: string[] } {
  const result = calculateVedicNumerology(input);
  const weakPlanets = ['sa', 'ra', 'ke'].filter(p =>
    [result.core.moolankPlanet, result.core.bhagyankPlanet, result.core.nameNumberPlanet]
      .map(pl => Object.keys(PLANET_MEANINGS).find(k => PLANET_MEANINGS[k].devanagari === pl || PLANET_MEANINGS[k].name.includes(pl)))
      .includes(p)
  );

  const targetLetters = Object.entries(DEVANAGARI_LETTER_PLANETS)
    .filter(([, v]) => v.planetId === targetPlanetId)
    .map(([k]) => k);

  return {
    suggestions: targetLetters.slice(0, 5).map(l => `Add "${l}" (${DEVANAGARI_LETTER_PLANETS[l].planet}) to strengthen ${PLANET_MEANINGS[targetPlanetId]?.name}`),
    addedLetters: targetLetters.slice(0, 5),
  };
}

/**
 * Compatibility between two names
 */
export function calculateNameCompatibility(name1: string, name2: string): {
  score: number;
  harmony: 'Excellent' | 'Good' | 'Neutral' | 'Challenging';
  details: {
    name1: { number: number; planet: string };
    name2: { number: number; planet: string };
    combined: number;
  };
} {
  const a1 = analyzeName(name1);
  const a2 = analyzeName(name2);
  const combined = reduceNumber(a1.reducedNumber + a2.reducedNumber);

  // Harmony rules: same planet = excellent, friendly planets = good, enemy = challenging
  const friendly: Record<string, string[]> = {
    su: ['mo', 'ma', 'ju'],
    mo: ['su', 'me'],
    ma: ['su', 'ju'],
    me: ['mo', 'sa', 've'],
    ju: ['su', 'ma', 'me'],
    ve: ['me', 'sa'],
    sa: ['me', 've', 'ra'],
    ra: ['sa', 've'],
    ke: ['sa', 'ju'],
  };

  let harmony: 'Excellent' | 'Good' | 'Neutral' | 'Challenging' = 'Neutral';
  const p1 = a1.planetId;
  const p2 = a2.planetId;

  if (p1 === p2) harmony = 'Excellent';
  else if (friendly[p1]?.includes(p2)) harmony = 'Good';
  else if (friendly[p2]?.includes(p1)) harmony = 'Good';
  else harmony = 'Challenging';

  const scoreMap = { Excellent: 90, Good: 75, Neutral: 55, Challenging: 35 };

  return {
    score: scoreMap[harmony],
    harmony,
    details: {
      name1: { number: a1.reducedNumber, planet: a1.planet },
      name2: { number: a2.reducedNumber, planet: a2.planet },
      combined,
    },
  };
}