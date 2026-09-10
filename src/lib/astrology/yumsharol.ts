/**
 * Traditional Manipuri Yumsharol (House Science / Vastu Numerology) Calculation Engine
 *
 * Domain Logic:
 *  - Time-aware running age calculated against target anniversary down to minute/second.
 *  - Summation: SUM = runningAge + nakshatra + constantValue (default 15).
 *  - Modulo 8: standardMod = SUM % 8 (0-7); traditionalIndex = standardMod === 0 ? 8 : standardMod (1-8).
 */

export interface NakshatraDefinition {
  index: number; // 1 to 27
  name: string;
  ruler: string;
  deity?: string;
}

export const NAKSHATRAS_LIST: NakshatraDefinition[] = [
  { index: 1, name: 'Ashwini (অশ্বিনী)', ruler: 'Ketu' },
  { index: 2, name: 'Bharani (ভরণী)', ruler: 'Venus' },
  { index: 3, name: 'Krittika (কৃত্তিকা)', ruler: 'Sun' },
  { index: 4, name: 'Rohini (রোহিণী)', ruler: 'Moon' },
  { index: 5, name: 'Mrigashira (মৃগশিরা)', ruler: 'Mars' },
  { index: 6, name: 'Ardra (আর্দ্রা)', ruler: 'Rahu' },
  { index: 7, name: 'Punarvasu (পুনর্বসু)', ruler: 'Jupiter' },
  { index: 8, name: 'Pushya (পুষ্যা)', ruler: 'Saturn' },
  { index: 9, name: 'Ashlesha (অশ্লেষা)', ruler: 'Mercury' },
  { index: 10, name: 'Magha (মঘা)', ruler: 'Ketu' },
  { index: 11, name: 'Purva Phalguni (পূর্ব ফাল্গুনী)', ruler: 'Venus' },
  { index: 12, name: 'Uttara Phalguni (উত্তর ফাল্গুনী)', ruler: 'Sun' },
  { index: 13, name: 'Hasta (হস্তা)', ruler: 'Moon' },
  { index: 14, name: 'Chitra (চিত্রা)', ruler: 'Mars' },
  { index: 15, name: 'Swati (স্বাতী)', ruler: 'Rahu' },
  { index: 16, name: 'Vishakha (বিশাখা)', ruler: 'Jupiter' },
  { index: 17, name: 'Anuradha (অনুরাধা)', ruler: 'Saturn' },
  { index: 18, name: 'Jyeshtha (জ্যেষ্ঠা)', ruler: 'Mercury' },
  { index: 19, name: 'Mula (মূলা)', ruler: 'Ketu' },
  { index: 20, name: 'Purva Ashadha (পূর্ব আষাঢ়া)', ruler: 'Venus' },
  { index: 21, name: 'Uttara Ashadha (উত্তর আষাঢ়া)', ruler: 'Sun' },
  { index: 22, name: 'Shravana (শ্রবণা)', ruler: 'Moon' },
  { index: 23, name: 'Dhanishta (ধনিষ্ঠা)', ruler: 'Mars' },
  { index: 24, name: 'Shatabhisha (শতভিষা)', ruler: 'Rahu' },
  { index: 25, name: 'Purva Bhadrapada (পূর্ব ভাদ্রপদ)', ruler: 'Jupiter' },
  { index: 26, name: 'Uttara Bhadrapada (উত্তর ভাদ্রপদ)', ruler: 'Saturn' },
  { index: 27, name: 'Revati (রেবতী)', ruler: 'Mercury' },
];

export interface YumsharolDirection {
  index: number;
  name: string;
  manipuriName: string;
  direction: string;
  directionManipuri: string;
  symbol: string;
  quality: 'Auspicious' | 'Inauspicious' | 'Mixed';
  significance: string;
  recommendation: string;
}

export const YUMSHAROL_DIRECTIONS: Record<number, YumsharolDirection> = {
  1: {
    index: 1,
    name: 'Dhwaja (Flag / ধ্বজ)',
    manipuriName: 'Dhwaja Griha (ধ্বজ গৃহ)',
    direction: 'East',
    directionManipuri: 'Nongpok (নোংপোক)',
    symbol: '🚩',
    quality: 'Auspicious',
    significance: 'Brings immense victory, honor, wealth, and spiritual growth to the household.',
    recommendation: 'Highly recommended for building residential houses, main gates, and prayer rooms.',
  },
  2: {
    index: 2,
    name: 'Dhuma (Smoke / ধূম)',
    manipuriName: 'Dhuma Griha (ধূম গৃহ)',
    direction: 'South-East',
    directionManipuri: 'Nongpok-Thambal / Meiram (মৈরাম - ফুঙ্গা লৈরূ)',
    symbol: '💨',
    quality: 'Inauspicious',
    significance: 'Associated with restlessness, mental anxiety, unexpected expenditure, and disputes.',
    recommendation: 'Avoid main dwellings; suitable only for kitchen stoves or fire ceremonies with proper pacification.',
  },
  3: {
    index: 3,
    name: 'Simha (Lion / সিংহ)',
    manipuriName: 'Simha Griha (সিংহ গৃহ)',
    direction: 'South',
    directionManipuri: 'Makha (মখা / য়ম)',
    symbol: '🦁',
    quality: 'Auspicious',
    significance: 'Denotes royal favor, courage, high status, dominance, and victory over adversaries.',
    recommendation: 'Auspicious for leadership, administration, and warriors/professionals of valor.',
  },
  4: {
    index: 4,
    name: 'Shwana (Dog / শ্বান)',
    manipuriName: 'Shwana Griha (শ্বান গৃহ)',
    direction: 'South-West',
    directionManipuri: 'Makha-Nongchup / Sanamahi Kachin (সনমহী কচীন)',
    symbol: '🐕',
    quality: 'Inauspicious',
    significance: 'Linked to instability, theft fears, quarrels among kin, and obstacles in work.',
    recommendation: 'Not advised for residential construction. Requires Sanamahi or Vastu Shanti remedies if unavoidable.',
  },
  5: {
    index: 5,
    name: 'Vrisha (Bull / বৃষ)',
    manipuriName: 'Vrisha Griha (বৃষ গৃহ)',
    direction: 'West',
    directionManipuri: 'Nongchup (নোংচুপ / বরুণ)',
    symbol: '🐂',
    quality: 'Auspicious',
    significance: 'Bestows prosperity, agricultural/business abundance, stability, and family harmony.',
    recommendation: 'Extremely favorable for long-term family settlement, granaries, and homesteads.',
  },
  6: {
    index: 6,
    name: 'Khara (Donkey / খর)',
    manipuriName: 'Khara Griha (খর গৃহ)',
    direction: 'North-West',
    directionManipuri: 'Awang-Nongchup (অৱাং-নোংচুপ / লৈমারেল শিদাবী)',
    symbol: '🐴',
    quality: 'Inauspicious',
    significance: 'Indicates fatigue, endless fruitless toil, losses during journeys, and emotional strain.',
    recommendation: 'Unfavorable for primary home foundation. Best suited for temporary storage or guest stays.',
  },
  7: {
    index: 7,
    name: 'Gaja (Elephant / গজ)',
    manipuriName: 'Gaja Griha (গজ গৃহ)',
    direction: 'North',
    directionManipuri: 'Awang (অৱাং / কুবের)',
    symbol: '🐘',
    quality: 'Auspicious',
    significance: 'Supreme auspiciousness, continuous inflow of wealth, wisdom, and royal protection.',
    recommendation: 'Peak recommendation for primary residence, study rooms, and treasury vaults.',
  },
  8: {
    index: 8,
    name: 'Kaka (Crow / কাক)',
    manipuriName: 'Kaka Griha (কাক গৃহ)',
    direction: 'North-East',
    directionManipuri: 'Awang-Nongpok (অৱাং-নোংপোক / ঈশান)',
    symbol: '🦅',
    quality: 'Inauspicious',
    significance: 'Associated with unpredictable grief, health ailments, discord, and sudden expenses.',
    recommendation: 'Tradition advises avoiding this index for new foundations without rigorous traditional remedial rituals.',
  },
};

export const YUMSHAROL_REMAINDER_PREDICTIONS: Record<number, string> = {
  0: '0 El§a lzjaen| Kuidzmo_+a feo_| Amz-yah~eTaz k=mem| iSba nz@|',
  1: '1 El§a ifralda E~ley, ln-Tum caR~K\\il|',
  2: '2 El§a E~mKuin, feo_, E~meh; lazepak nzgiL| Ec(I yum oh~rbsu h~muz Zmxmk mih laz@| f\\et|',
  3: '3 El§a EnazSain, mah~ pakpa caR~K\\pa, yumTuna Saba Zm@, E~fey|',
  4: '4 El§a lmHh~in, El;iSz taNduna Etak@, waeTak laneTak@, maz tak@|',
  5: '5 El§id ih-yah~ Apan-Arz Zmxmk fze~j@, ln tuzh~, yamxa E~f@|',
  6: '6 El§id Elalaen| Ana-Aeyk Etah~na nz@| Ku\\#-Ku\\lah~na ESakpa pnba, yumSaba, R~#ba mIga, yu§uga K\\ne~cnba nz@|',
  7: '7 El§id Samuen| mana minl nah~dna yum Saba Zme~j@| ln-Tum caR~K\\il|',
};

export interface YumsharolInput {
  dob: string | Date;
  tob?: string;
  nakshatra: number; // 1 to 27
  constantValue?: number; // default 15
  targetDateTime?: Date; // optional reference date, defaults to new Date()
}

export interface YumsharolResult {
  runningAge: number;
  sum: number;
  standardMod: number; // 0 to 7 (Excel =MOD(SUM, 8))
  traditionalIndex: number; // 1 to 8
  nakshatra: number;
  nakshatraName: string;
  nakshatraRuler: string;
  constantValue: number;
  dob: string;
  tob: string;
  directionInfo: YumsharolDirection;
  remainderPrediction: string;
  breakdown: {
    runningAgeExpression: string;
    sumFormula: string;
    moduloExpression: string;
    traditionalMapping: string;
  };
}

/**
 * Check if a calendar year is a leap year.
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Calculate Time-Aware Running Age
 * 
 * Rules:
 *  1. Determine completed years.
 *  2. If current timestamp has passed the exact birthday anniversary down to the minute/second,
 *     the elapsed fraction triggers the running year (e.g. completed 23y + 2h -> 24; completed 23y + 1m -> 24).
 *  3. If current timestamp is strictly before or at the exact birth anniversary moment,
 *     running age = completed age (minimum bound: 1).
 */
export function calculateRunningAge(
  dob: string | Date,
  tob: string = '12:00',
  targetDateTime?: Date
): number {
  let bYear: number, bMonth: number, bDay: number;

  if (typeof dob === 'string') {
    // Parse YYYY-MM-DD explicitly to prevent UTC timezone shifts
    const parts = dob.trim().split(/[-/]/).map(Number);
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
      throw new Error(`Invalid DOB format: "${dob}". Expected YYYY-MM-DD.`);
    }
    bYear = parts[0];
    bMonth = parts[1] - 1; // 0-indexed month
    bDay = parts[2];
  } else if (dob instanceof Date) {
    bYear = dob.getFullYear();
    bMonth = dob.getMonth();
    bDay = dob.getDate();
  } else {
    throw new Error('Invalid DOB parameter provided.');
  }

  const timeStr = tob && tob.trim().length > 0 ? tob.trim() : '12:00';
  const timeTokens = timeStr.split(':').map(Number);
  const bHour = !isNaN(timeTokens[0]) ? timeTokens[0] : 12;
  const bMinute = !isNaN(timeTokens[1]) ? timeTokens[1] : 0;
  const bSecond = !isNaN(timeTokens[2]) ? timeTokens[2] : 0;

  const target = targetDateTime ? new Date(targetDateTime) : new Date();

  // Construct local birth timestamp
  const birthMoment = new Date(bYear, bMonth, bDay, bHour, bMinute, bSecond, 0);

  if (birthMoment.getTime() > target.getTime()) {
    throw new Error('Date of birth and time of birth cannot be in the future.');
  }

  const tYear = target.getFullYear();

  // Handle Feb 29 birth gracefully for non-leap target years
  let annivDay = bDay;
  if (bMonth === 1 && bDay === 29 && !isLeapYear(tYear)) {
    annivDay = 28;
  }

  const anniversaryThisYear = new Date(tYear, bMonth, annivDay, bHour, bMinute, bSecond, 0);

  let runningAge: number;

  if (target.getTime() > anniversaryThisYear.getTime()) {
    // Passed the anniversary in current year: elapsed fraction triggers the running year
    const completedYears = tYear - bYear;
    runningAge = completedYears + 1;
  } else if (target.getTime() === anniversaryThisYear.getTime()) {
    // Strictly at the exact anniversary moment
    const completedYears = tYear - bYear;
    runningAge = completedYears;
  } else {
    // Current timestamp is strictly before the anniversary in current year
    // The most recent anniversary was in (tYear - 1)
    const completedYears = tYear - 1 - bYear;
    // Elapsed fraction since last year's anniversary triggers running year
    runningAge = completedYears + 1; // which evaluates to tYear - bYear
  }

  // Minimum bound: 1 (even for newborn)
  return Math.max(1, runningAge);
}

/**
 * Master Yumsharol Calculation Utility
 */
export function calculateYumsharol(input: YumsharolInput): YumsharolResult {
  const { dob, tob = '12:00', nakshatra, constantValue = 15, targetDateTime } = input;

  // Validate Nakshatra (1-27)
  const nakNum = Number(nakshatra);
  if (isNaN(nakNum) || nakNum < 1 || nakNum > 27) {
    throw new Error(`Invalid Nakshatra: ${nakshatra}. Must be an integer between 1 and 27.`);
  }

  const nakshatraObj = NAKSHATRAS_LIST.find((n) => n.index === nakNum) || {
    index: nakNum,
    name: `Nakshatra ${nakNum}`,
    ruler: 'Unknown',
  };

  const constVal = typeof constantValue === 'number' && !isNaN(constantValue) ? Math.floor(constantValue) : 15;

  // Step 1: Running Age Calculation (Time-Aware)
  const runningAge = calculateRunningAge(dob, tob, targetDateTime);

  // Step 2: Summation
  const sum = runningAge + nakNum + constVal;

  // Step 3: Modulo 8 Calculation
  const standardMod = sum % 8; // 0 to 7
  const traditionalIndex = standardMod === 0 ? 8 : standardMod; // 1 to 8

  const directionInfo = YUMSHAROL_DIRECTIONS[traditionalIndex] || YUMSHAROL_DIRECTIONS[1];

  const dobStr = typeof dob === 'string' ? dob : dob.toISOString().split('T')[0];
  const tobStr = tob || '12:00';

  return {
    runningAge,
    sum,
    standardMod,
    traditionalIndex,
    nakshatra: nakNum,
    nakshatraName: nakshatraObj.name,
    nakshatraRuler: nakshatraObj.ruler,
    constantValue: constVal,
    dob: dobStr,
    tob: tobStr,
    directionInfo,
    remainderPrediction: YUMSHAROL_REMAINDER_PREDICTIONS[standardMod] || YUMSHAROL_REMAINDER_PREDICTIONS[0],
    breakdown: {
      runningAgeExpression: `${runningAge}th Year (Time-aware)`,
      sumFormula: `(${runningAge} [Age] + ${nakNum} [Nakshatra] + ${constVal} [Constant]) = ${sum}`,
      moduloExpression: `${sum} mod 8 = ${standardMod}`,
      traditionalMapping: `${standardMod} → Index ${traditionalIndex} (${directionInfo.name})`,
    },
  };
}
