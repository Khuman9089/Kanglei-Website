/**
 * Manipuri Traditional Astrology: ঙা-ঈশিং (Nga-Eeshing)
 * Matrimonial compatibility dosha and remedial rites.
 *
 * Algorithm from Traditional Excel Formula:
 * 1. Rashi indexed 0 to 11 starting from Aries = 0.
 * 2. Add 9 to Groom and Bride Rashi indices.
 * 3. If value > 11, subtract 12 (i.e. (R + 9) % 12).
 * 4. Compare:
 *    - If Groom Rashi === Bride's calculated value: Bride holds the match ("নুপীনা ঙা-ঈশিং তাই")
 *    - If Bride Rashi === Groom's calculated value: Groom holds the match ("নুপানা ঙা-ঈশিং তাই")
 *    - If neither: "ঙা-ঈশিং তাদে ॥"
 *
 * Elemental assignment (alternating 0 to 11):
 * - Even indices (0, 2, 4, 6, 8, 10): ঙা (Fish)
 * - Odd indices (1, 3, 5, 7, 9, 11): ঈশিং (Water)
 *
 * If same nature: "নুপাসু ঙা নি, নুপীসু ঙা নি" or "নুপাসু ঈশিং নি, নুপীসু ঈশিং নি"
 * If different: "নুপানা [নুপাগী] নি, নুপীনা [নুপীগী] নি"
 */

export interface RashiItem {
  index: number;
  nameBengali: string;
  nameEnglish: string;
  element: 'ঙা' | 'ঈশিং';
}

export const RASHI_LIST_NGA_EESHING: RashiItem[] = [
  { index: 0, nameBengali: '০ - মেষ', nameEnglish: 'Aries', element: 'ঙা' },
  { index: 1, nameBengali: '১ - বৃষ', nameEnglish: 'Taurus', element: 'ঈশিং' },
  { index: 2, nameBengali: '২ - মিথুন', nameEnglish: 'Gemini', element: 'ঙা' },
  { index: 3, nameBengali: '৩ - কর্কট', nameEnglish: 'Cancer', element: 'ঈশিং' },
  { index: 4, nameBengali: '৪ - সিংহ', nameEnglish: 'Leo', element: 'ঙা' },
  { index: 5, nameBengali: '৫ - কন্যা', nameEnglish: 'Virgo', element: 'ঈশিং' },
  { index: 6, nameBengali: '৬ - তুলা', nameEnglish: 'Libra', element: 'ঙা' },
  { index: 7, nameBengali: '৭ - বৃশ্চিক', nameEnglish: 'Scorpio', element: 'ঈশিং' },
  { index: 8, nameBengali: '৮ - ধনু', nameEnglish: 'Sagittarius', element: 'ঙা' },
  { index: 9, nameBengali: '৯ - মকর', nameEnglish: 'Capricorn', element: 'ঈশিং' },
  { index: 10, nameBengali: '১০ - কুম্ভ', nameEnglish: 'Aquarius', element: 'ঙা' },
  { index: 11, nameBengali: '১১ - মীন', nameEnglish: 'Pisces', element: 'ঈশিং' },
];

export interface NgaEeshingInput {
  groomRashi: number; // 0 to 11
  brideRashi: number; // 0 to 11
  groomName?: string;
  brideName?: string;
}

export interface NgaEeshingResult {
  isNgaEeshing: boolean;
  verdictText: 'ঙা-ঈশিং তাই ॥' | 'ঙা-ঈশিং তাদে ॥';
  holder: 'নুপা' | 'নুপী' | null;
  holderStatement: string | null;
  natureStatement: string;
  groomRashi: RashiItem;
  brideRashi: RashiItem;
  groomNature: 'ঙা' | 'ঈশিং';
  brideNature: 'ঙা' | 'ঈশিং';
  groomName: string;
  brideName: string;
  groomStep3: number;
  brideStep3: number;
  isGroomMatch: boolean;
  isBrideMatch: boolean;
  remedyGuidance?: string;
  remedyTitle?: string;
  potchangText?: string;
  laironText?: string;
}

export const REMEDY_GUIDANCE_TEXT =
  'ঈশিং হান্না লৈখিদবা থোক্লবা প্রতিকার তৌগনি ॥\nঙানা হান্না লৈখিদবদি থোইদোক্না প্রতিকার তৌদবসু য়াই ॥';

export const REMEDY_TITLE = 'নুপা নুপী ঙা ঈশিং তাবগী কোক্লবা থৌরম:-';

export const POTCHANG_TEXT =
  'শোন্নপুং উরেন মখোংগী অৱাংদা কোম অনি খুদোন অহুমদা লাপ্না খুবোম পাক লুনা খা ৱাং তৌরগা ঈশিং তারিবা মীদুগী কোমদা ঈশিং থন্না হৈজল্লো। নিপা ওইরগা মখারোমদা নুপী ওইরগা অৱাং লোমদা মৈরা অনি থাল্লো ঙম্মু অচংবা অমমম কোমদা থদরো ঈশিং য়াওদবা কোমদা ঈশিং য়াওবা কোমদগী ঈশিং তংখায় অমা ফাৎথরো নিপা নুপী অনি য়াওনা করিগুম্বা লৈখিদবা য়াওরবদি অরৈবদুদা য়াওনা খুরুমগনি। নহৈদুনা শেংলগা।';

export const LAIRON_TEXT =
  'তেংবানবা মপু ইবুংঙো য়ুমনাক .... য়েক্কী .... মমিং (চাওবা।চাওবী) কৌবা অনিনা ঙা ঈশিং তায় হায়বসে তাদে য়েংবীয়ু মখোয় অনিসে ঈশিংসু কংদে থৱাইসু মাংদে নুমিৎ থানা খংশনু মঙাং লুৱাং খুমন অহুমগী থৌজাননি য়েংবীয়ু য়েংবীরে ॥ (খুরুম্বা) অদুগা ঙামু অনিদু পুকখ্রি, তুরেন্দা নচা নশু শন্না নুংঙায়না পাল্লুরো হায়না থাদোকখ্রো। অদুগা কোম অনিদু ফুঞ্জল্লো কোকলে ॥';

/**
 * Calculates whether ঙা-ঈশিং falls for the couple.
 */
export function calculateNgaEeshing(input: NgaEeshingInput): NgaEeshingResult {
  const g = Math.max(0, Math.min(11, Math.floor(Number(input.groomRashi) || 0)));
  const b = Math.max(0, Math.min(11, Math.floor(Number(input.brideRashi) || 0)));

  const groomRashiItem = RASHI_LIST_NGA_EESHING[g] || RASHI_LIST_NGA_EESHING[0];
  const brideRashiItem = RASHI_LIST_NGA_EESHING[b] || RASHI_LIST_NGA_EESHING[0];

  const groomName = (input.groomName || '').trim() || 'নুপা (Groom)';
  const brideName = (input.brideName || '').trim() || 'নুপী (Bride)';

  // Step 2 & 3: Add 9; if > 11 minus 12
  const gPlus9 = g + 9;
  const groomStep3 = gPlus9 > 11 ? gPlus9 - 12 : gPlus9;

  const bPlus9 = b + 9;
  const brideStep3 = bPlus9 > 11 ? bPlus9 - 12 : bPlus9;

  // Step 4: Check matches
  // Bride's row in Excel: Bride's step 3 value === Groom's Rashi
  const isBrideMatch = g === brideStep3;
  // Groom's row in Excel: Groom's step 3 value === Bride's Rashi
  const isGroomMatch = b === groomStep3;

  const isNgaEeshing = isBrideMatch || isGroomMatch;

  let holder: 'নুপা' | 'নুপী' | null = null;
  let holderStatement: string | null = null;

  if (isBrideMatch) {
    holder = 'নুপী';
    holderStatement = 'নুপীনা ঙা-ঈশিং তাই';
  } else if (isGroomMatch) {
    holder = 'নুপা';
    holderStatement = 'নুপানা ঙা-ঈশিং তাই';
  }

  // Nature calculation (0: ঙা, 1: ঈশিং, 2: ঙা, ...)
  const groomNature: 'ঙা' | 'ঈশিং' = g % 2 === 0 ? 'ঙা' : 'ঈশিং';
  const brideNature: 'ঙা' | 'ঈশিং' = b % 2 === 0 ? 'ঙা' : 'ঈশিং';

  let natureStatement = '';
  if (groomNature === brideNature) {
    natureStatement =
      groomNature === 'ঙা' ? 'নুপাসু ঙা নি, নুপীসু ঙা নি' : 'নুপাসু ঈশিং নি, নুপীসু ঈশিং নি';
  } else {
    natureStatement = `নুপানা ${groomNature} নি, নুপীনা ${brideNature} নি`;
  }

  const result: NgaEeshingResult = {
    isNgaEeshing,
    verdictText: isNgaEeshing ? 'ঙা-ঈশিং তাই ॥' : 'ঙা-ঈশিং তাদে ॥',
    holder,
    holderStatement,
    natureStatement,
    groomRashi: groomRashiItem,
    brideRashi: brideRashiItem,
    groomNature,
    brideNature,
    groomName,
    brideName,
    groomStep3,
    brideStep3,
    isGroomMatch,
    isBrideMatch,
  };

  if (isNgaEeshing) {
    result.remedyGuidance = REMEDY_GUIDANCE_TEXT;
    result.remedyTitle = REMEDY_TITLE;
    result.potchangText = POTCHANG_TEXT;
    result.laironText = LAIRON_TEXT;
  }

  return result;
}
