import { calculateVedicPanchang, PanchangData } from './panchang';
import {
  WEEKDAYS_MANIPURI,
  SOLAR_MONTH_NAMES,
  MANIPURI_MONTH_ATTRIBUTES
} from '@/data/manipuriMonthAttributes';
import { toBengaliNumerals, toMeeteiNumerals } from './manipuriCalendar';
import lunarMonthsData from '@/data/manipuriLunarMonths.json';
import { evaluateSubhaKarmaThourams, ThouramDayEvaluation, GrahaPujaEvaluation } from './thouramEngine';
import { getJulianDay, getAyanamsa, calculateMoonRashiTransit, MoonRashiTransitResult } from './ephemeris';
import { SAMPLE_3X8_TABLE, Table3x8Row } from '@/config/dandaPalBipalTableConfig';

export { SAMPLE_3X8_TABLE, type Table3x8Row };

export interface DandaPalBipal {
  danda: number; // 0 to 59
  pal: number;   // 0 to 59
  bipal: number; // 0 to 59
}

export interface PanchangBookPlanet {
  id: string;
  nameBengali: string;
  nameMeetei: string;
  nameBlipi: string;
  abbrBengali: string; // e.g. "র", "চ", "ম", "বু", "বৃ", "শু", "শ", "রা", "কে"
  abbrMeetei: string;
  abbrBlipi: string;   // in BLipi15: "rib", "Esam", "mOl", "buD", "b<h", "su", "Sin", "ra", "Ek"
  nakshatraIndex: number; // 1 to 27
  rashiIndex: number;     // 0 to 11 (0 = Mesha, 1 = Brisha...)
  rashiBengali: string;
  rashiMeetei: string;
  rashiBlipi: string;     // e.g. "EmF", "b<F", "imTun"...
  degreeStrBengali: string; // e.g. "১ । ১৩ । ৫৫ । ৩৭" (Rashi . Deg . Min . Sec)
  degreeStrMeetei: string;
  degreeStrBlipi: string;
  degreeStrEn: string;
  signDegree: number;
  deg: number;
  min: number;
  sec: number;
  isRetrograde: boolean;
  isCombust: boolean;
  statusSuffixBengali: string;
  statusSuffixMeetei: string;
  statusSuffixBlipi: string;
  statusSuffixEn: string;
}

export interface NumericalTableRow {
  labelEn: string;
  labelBengali: string;
  labelMeetei: string;
  labelBlipi: string;
  danda: number | string;
  pal: number | string;
  bipal: number | string;
  formattedEn: string;
  formattedBengali: string;
  formattedMeetei: string;
  formattedBlipi: string;
  yesterday: {
    danda: number | string;
    pal: number | string;
    bipal: number | string;
    formattedExcel: string;
    formattedBlipi: string;
  };
  today: {
    danda: number | string;
    pal: number | string;
    bipal: number | string;
    formattedExcel: string;
    formattedBlipi: string;
  };
  tomorrow: {
    danda: number | string;
    pal: number | string;
    bipal: number | string;
    formattedExcel: string;
    formattedBlipi: string;
  };
}

export interface IndianNationalDate {
  day: number;
  monthNameBengali: string;
  monthNameMeetei: string;
  monthNameBlipi: string;
  sakaYear: number;
}

/**
 * Authentic Indian Civil / National Calendar (Rashtriya Panchang) calculator
 * Adopted officially across India, published in traditional Panjikas as (ভা: দিন মাস)
 */
export function getIndianNationalDate(year: number, month: number, day: number): IndianNationalDate {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const chaitraStartDay = isLeap ? 21 : 22;
  const dt = new Date(year, month - 1, day, 12, 0, 0);
  const chaitra1 = new Date(year, 2, chaitraStartDay, 12, 0, 0);

  let sakaYear = year - 78;
  let chaitraBase = chaitra1;
  let leapForChaitra = isLeap;

  if (dt < chaitra1) {
    sakaYear = year - 79;
    const prevYear = year - 1;
    const prevLeap = (prevYear % 4 === 0 && prevYear % 100 !== 0) || (prevYear % 400 === 0);
    chaitraBase = new Date(prevYear, 2, prevLeap ? 21 : 22, 12, 0, 0);
    leapForChaitra = prevLeap;
  }

  const months = [
    { b: 'চৈত্র', m: 'ꯆꯩꯇ꯭ꯔ', bl: 'Ect[', days: leapForChaitra ? 31 : 30 },
    { b: 'বৈশাখ', m: 'ꯕꯩꯁꯥꯈ', bl: 'bEs_y', days: 31 },
    { b: 'জ্যৈষ্ঠ', m: 'ꯖ꯭ꯌꯩꯁ꯭ꯊ', bl: 'E~j/', days: 31 },
    { b: 'আষাঢ়', m: 'ꯑꯥꯁꯥꯙ', bl: 'AaFaP', days: 31 },
    { b: 'শ্রাবণ', m: 'ꯁ꯭ꯔꯥꯕꯟ', bl: 'S[abn', days: 31 },
    { b: 'ভাদ্র', m: 'ꯚꯥꯗ꯭ꯔ', bl: 'vaD_', days: 31 },
    { b: 'আশ্বিন', m: 'ꯑꯥꯁ꯭ꯕꯤꯟ', bl: 'AaSiBn', days: 30 },
    { b: 'কার্তিক', m: 'ꯀꯥꯔꯇꯤꯛ', bl: 'katI{k', days: 30 },
    { b: 'অগ্রহায়ণ', m: 'ꯑꯒ꯭ꯔꯍꯥꯌꯟ', bl: 'Ag_rha', days: 30 },
    { b: 'পৌষ', m: 'ꯄꯧꯁ', bl: 'Ep;F', days: 30 },
    { b: 'মাঘ', m: 'ꯃꯥꯘ', bl: 'maG', days: 30 },
    { b: 'ফাল্গুন', m: 'ꯐꯥꯜꯒꯨꯟ', bl: 'falgun', days: 30 },
  ];

  let cur = chaitraBase.getTime();
  const targetTime = dt.getTime();
  const MS_PER_DAY = 86400000;

  for (let i = 0; i < months.length; i++) {
    const nextCur = cur + months[i].days * MS_PER_DAY;
    if (targetTime >= cur && targetTime < nextCur) {
      const dayNum = Math.floor((targetTime - cur) / MS_PER_DAY) + 1;
      return {
        day: dayNum,
        monthNameBengali: months[i].b,
        monthNameMeetei: months[i].m,
        monthNameBlipi: months[i].bl,
        sakaYear
      };
    }
    cur = nextCur;
  }

  const lastM = months[months.length - 1];
  const dayNum = Math.floor((targetTime - cur) / MS_PER_DAY) + 1;
  return {
    day: Math.max(1, dayNum),
    monthNameBengali: lastM.b,
    monthNameMeetei: lastM.m,
    monthNameBlipi: lastM.bl,
    sakaYear
  };
}

export interface ManipuriBookPanchangData {
  dateStr: string;
  lat: number;
  lng: number;
  locationName: string;

  // Header Banner
  header: {
    ayanamsa: {
      decimal: number;
      deg: number;
      min: number;
      sec: number;
      formattedBengali: string; // "২৪° ১৪' ২৬\""
      formattedMeetei: string;  // "꯲꯴° ꯱꯴' ꯲꯶\""
      formattedBlipi: string;   // "24° 14' 26\""
      formattedEn: string;      // "24° 14' 26\""
    };
    gregorianDay: number;
    gregorianMonthNameBengali: string;
    gregorianMonthNameMeetei: string;
    gregorianMonthNameBlipi: string;
    gregorianYear: number;
    gregorianFormattedBengali: string; // "২৯-মে, ২০২৪, ইং"
    gregorianFormattedMeetei: string;
    gregorianFormattedBlipi: string;   // "29-E~m, 2024, h~z"
    gregorianFormattedEn: string;
    weekdayBengali: string;            // "য়ুমশকৈশা"
    weekdayMeetei: string;             // "ꯌꯨꯝꯁꯀꯩꯁꯥ"
    weekdayBlipi: string;              // "yumSe~kS"
    weekdayEn: string;
    manipuriMonthCode: number;
    manipuriMonthBengali: string;      // "কালেন"
    manipuriMonthMeetei: string;       // "ꯀꯥꯂꯦꯟ"
    manipuriMonthBlipi: string;        // "kaeln"
    manipuriMonthEn: string;
    manipuriTithiNum: number;          // 21
    manipuriTithiStrBengali: string;   // "ইঙা-১০" (previously "লোইদাম কালেন-২১")
    manipuriTithiStrMeetei: string;    // "ꯏꯉꯥ-꯱꯰"
    manipuriTithiStrBlipi: string;     // "h~za-10"
    solarMonthNameBengali: string;     // "জ্যৈষ্ঠ"
    solarMonthNameMeetei: string;
    solarMonthNameBlipi: string;       // "E~j/"
    solarMonthNameEn: string;
    solarDay: number;                  // 15
    solarMonthFormattedBengali: string;// "জ্যৈষ্ঠ ২৮"
    solarMonthFormattedMeetei: string;
    solarMonthFormattedBlipi: string;  // "E~j/ 28"
    nationalDateBengali: string;       // "(ভা: ২৩ জ্যৈষ্ঠ)"
    nationalDateMeetei: string;
    nationalDateBlipi: string;         // "(va: 23 E~j/)"
    sakabda: number;                   // 1946
    sakabdaBengali: string;            // "শকাব্দ ১৯৪৬"
    sakabdaMeetei: string;             // "ꯁꯀꯥꯕ꯭ꯗ ꯱꯹꯴꯶"
    sakabdaBlipi: string;              // "skabd 1946"
    fullHeaderBengali: string;
    fullHeaderMeetei: string;
    fullHeaderBlipi: string;
  };

  // Left Column: Astronomical & Numerical Table
  astronomical: {
    sunriseTimeStr: string;            // "04:24:15"
    sunriseBengali: string;            // "নু: থো: পুং ৪ । ২৪ । ১৫"
    sunriseMeetei: string;
    sunriseBlipi: string;              // "nu: To: puz 4 im: 24 Es: 15"
    sunsetTimeStr: string;             // "05:54:03"
    sunsetBengali: string;             // "নু: তা: পুং ৫ । ৫৪ । ০৩"
    sunsetMeetei: string;
    sunsetBlipi: string;               // "nu: ta: puz 5 im: 54 Es: 03"
    dayDurationDPB: DandaPalBipal;     // { danda: 33, pal: 30, bipal: 0 }
    dayDurationBengali: string;        // "অঙানবা দং: ৩৩ । ৩০ । ০০"
    dayDurationMeetei: string;
    dayDurationBlipi: string;          // "AZanba dZ: 33 p: 30 ib: 00"
    nightDurationDPB: DandaPalBipal;   // { danda: 26, pal: 30, bipal: 0 }
    nightDurationBengali: string;      // "অহিং দং: ২৬ । ৩০ । ০০"
    nightDurationMeetei: string;
    nightDurationBlipi: string;        // "AihZ dZ: 26 p: 30 ib: 00"
    lagnaRise: {
      rashiIndex: number;
      rashiBengali: string;
      rashiMeetei: string;
      rashiBlipi: string;
      dpb: DandaPalBipal;
      formattedBengali: string;
      formattedMeetei: string;
      formattedBlipi: string;
    };
    lagnaSet: {
      rashiIndex: number;
      rashiBengali: string;
      rashiMeetei: string;
      rashiBlipi: string;
      dpb: DandaPalBipal;
      formattedBengali: string;
      formattedMeetei: string;
      formattedBlipi: string;
    };

    // The 5-row x 3-column table (Reference Image 2 & Kuthi_Preparation Sheet)
    numericalTable: {
      headers: {
        col1: { en: string; bengali: string; meetei: string; blipi: string };
        col2: { en: string; bengali: string; meetei: string; blipi: string };
        col3: { en: string; bengali: string; meetei: string; blipi: string };
      };
      rows: NumericalTableRow[];
    };

    // Sun Pada & Moon Position
    rabiPadaStrBengali: string;
    rabiPadaStrMeetei: string;
    rabiPadaStrBlipi: string;
    chandraTransitBengali: string;
    chandraTransitMeetei: string;
    chandraTransitBlipi: string;
    moonTransit?: MoonRashiTransitResult;

    // 9 Graha Longitudes
    planets: PanchangBookPlanet[];

    // Circular Janma Chakra House Placements (12 Rashis: 0 to 11)
    chakraRashiHouses: {
      rashiIndex: number;
      rashiNameBengali: string;
      rashiNameMeetei: string;
      rashiNameBlipi: string;
      planetsInHouse: {
        abbrBengali: string;
        abbrMeetei: string;
        abbrBlipi: string;
        nakshatraNum: number;
      }[];
    }[];
  };

  // Right Column: Detailed Manipuri Astrological Prose
  details: {
    thaban: {
      nameBengali: string;
      nameMeetei: string;
      nameBlipi: string;
      lunarMonthAnnotationBengali: string;
      lunarMonthAnnotationMeetei: string;
      lunarMonthAnnotationBlipi: string;
      dpb: DandaPalBipal;
      endingClockBengali: string;
      endingClockMeetei: string;
      endingClockBlipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    nakshatra: {
      nameBengali: string;
      nameMeetei: string;
      nameBlipi: string;
      nakshatraNum: number;
      dpb: DandaPalBipal;
      endingClockBengali: string;
      endingClockMeetei: string;
      endingClockBlipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    yoga: {
      nameBengali: string;
      nameMeetei: string;
      nameBlipi: string;
      yogaNum: number;
      dpb: DandaPalBipal;
      endingClockBengali: string;
      endingClockMeetei: string;
      endingClockBlipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    karana: {
      name1Bengali: string;
      name1Meetei: string;
      name1Blipi: string;
      endingClock1Bengali: string;
      endingClock1Meetei: string;
      endingClock1Blipi: string;
      name2Bengali: string;
      name2Meetei: string;
      name2Blipi: string;
      endingClock2Bengali: string;
      endingClock2Meetei: string;
      endingClock2Blipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    chandraSuddhi: {
      auspiciousRashisBengali: string;
      auspiciousRashisMeetei: string;
      auspiciousRashisBlipi: string;
      ghataChandraBengali: string;
      ghataChandraMeetei: string;
      ghataChandraBlipi: string;
      taraSuddhiBengali?: string;
      taraSuddhiMeetei?: string;
      taraSuddhiBlipi?: string;
      pokpaRashiBengali: string;
      pokpaRashiMeetei: string;
      pokpaRashiBlipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    taraSuddhi?: {
      nakshatrasBengali: string;
      nakshatrasMeetei: string;
      nakshatrasBlipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    dashaGanaVarna: {
      dashaLordBengali: string;
      vimsottariBengali: string;
      yoginiBengali: string;
      ganaBengali: string;
      varnaBengali: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    amritaYoga: {
      timingsBengali: string;
      timingsMeetei: string;
      timingsBlipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    mahendraYoga?: {
      timingsBengali: string;
      timingsMeetei: string;
      timingsBlipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
      isAvailable: boolean;
    };
    inauspiciousMuhurtas: {
      barabelaBengali: string;
      barabelaMeetei: string;
      barabelaBlipi: string;
      kalabelaBengali: string;
      kalabelaMeetei: string;
      kalabelaBlipi: string;
      kalaratriBengali: string;
      kalaratriMeetei: string;
      kalaratriBlipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    huChenbaMatam: {
      rahuKaalBengali: string;
      rahuKaalMeetei: string;
      rahuKaalBlipi: string;
      vishaGhatiBengali: string;
      vishaGhatiMeetei: string;
      vishaGhatiBlipi: string;
      yamagandaBengali: string;
      yamagandaMeetei: string;
      yamagandaBlipi: string;
      gulikaKaalBengali: string;
      gulikaKaalMeetei: string;
      gulikaKaalBlipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    thadokkadaba: {
      yogaTabooBengali?: string;
      yogaTabooMeetei?: string;
      yogaTabooBlipi?: string;
      vishtiTabooBengali?: string;
      vishtiTabooMeetei?: string;
      vishtiTabooBlipi?: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    yogini: {
      directionBengali: string;
      directionMeetei: string;
      directionBlipi: string;
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    shraddhaKala: {
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
    };
    afabaThouram: {
      fullTextBengali: string;
      fullTextMeetei: string;
      fullTextBlipi: string;
      grahaPuja?: GrahaPujaEvaluation;
      evaluation?: ThouramDayEvaluation;
    };
  };

  rawPanchang: PanchangData;
}

// ─────────────────────────────────────────────────────────────
// AUTHENTIC BLIPI15 DICTIONARY FROM qw.xlsm (Edit & Kuthi_Preparation)
// ─────────────────────────────────────────────────────────────

export const RASHI_NAMES_BLIPI = [
  'EmF',     // 0: Mesha
  'b<F',     // 1: Brisha
  'imTun',   // 2: Mithuna
  'kk\`P~',   // 3: Karkat
  'iszh',    // 4: Singh
  'kn/a',    // 5: Kanya
  'tula',    // 6: Tula
  'b<ick',   // 7: Vrischika
  'Dnu',     // 8: Dhanu
  'mkr',     // 9: Makara
  'k=',     // 10: Kumbha
  'mIn'      // 11: Meena
];

export const RASHI_NAMES_BENGALI = [
  'মেষ', 'বৃষ', 'মিথুন', 'কর্কট', 'সিংহ', 'কন্যা',
  'তুলা', 'বৃশ্চিক', 'ধনু', 'মকর', 'কুম্ভ', 'মীন'
];

export const RASHI_NAMES_MEETEI = [
  'ꯃꯦꯁ', 'ꯕ꯭ꯔꯤꯁ', 'ꯃꯤꯊꯨꯟ', 'ꯀꯔꯀꯠ', 'ꯁꯤꯡꯍ', 'ꯀꯟꯌꯥ',
  'ꯇꯨꯂꯥ', 'ꯕ꯭ꯔꯤꯁ꯭ꯆꯤꯛ', 'ꯙꯅꯨ', 'ꯃꯀꯔ', 'ꯀꯨꯃ꯭ꯚ', 'ꯃꯤꯟ'
];

import {
  NAKSHATRA_NAMES_BLIPI,
  NAKSHATRA_NAMES_BENGALI,
  NAKSHATRA_NAMES_MEETEI
} from './constants';

export {
  NAKSHATRA_NAMES_BLIPI,
  NAKSHATRA_NAMES_BENGALI,
  NAKSHATRA_NAMES_MEETEI
};

export const YOGA_NAMES_BLIPI = [
  'biSkuv', 'p_riti', 'Aayusman', 'EsOvag/', 'ESavn', 'Aitgnd', 'sukm\`a', 'D<it', 'Sul',
  'gnd', 'b<iDi', 'D<b', 'b/aGat', 'h<sx', 'bj[', 'isiD', 'b/itpat', 'brIyan',
  'pirG', 'Sib', 'isD', 'saD/', 'suv', 'suk_l', 'b[h~', 'h~nd[', 'EbD<it'
];

export const YOGA_NAMES_BENGALI = [
  'বিষকুম্ভ', 'প্রীতি', 'আয়ুষ্মান', 'সৌভাগ্য', 'শোভন', 'অতিগণ্ড', 'সুকর্মা', 'ধৃতি', 'শূল',
  'গণ্ড', 'বৃদ্ধি', 'ধ্রুব', 'ব্যাঘাত', 'হর্ষণ', 'বজ্র', 'সিদ্ধি', 'ব্যতীপাত', 'বরীয়ান',
  'পরিঘ', 'শিব', 'সিদ্ধ', 'সাধ্য', 'শুভ', 'শুক্ল', 'ব্রহ্ম', 'ইন্দ্র', 'বৈধৃতি'
];

export const YOGA_NAMES_MEETEI = [
  'ꯕꯤꯁꯀꯨꯃ꯭ꯚ', 'ꯄ꯭ꯔꯤꯇꯤ', 'ꯑꯥꯌꯨꯁ꯭ꯃꯥꯟ', 'ꯁꯧꯚꯥꯒ꯭ꯌ', 'ꯁꯣꯚꯟ', 'ꯑꯇꯤꯒꯟꯗ', 'ꯁꯨꯀꯔꯃꯥ', 'ꯙ꯭ꯔꯤꯇꯤ', 'ꯁꯨꯜ',
  'ꯒꯟꯗ', 'ꯕ꯭ꯔꯤꯗ꯭ꯙꯤ', 'ꯙ꯭ꯔꯨꯕ', 'ꯕ꯭ꯌꯥꯘꯥꯠ', 'ꯍꯔꯁꯟ', 'ꯕꯖ꯭ꯔ', 'ꯁꯤꯗ꯭ꯙꯤ', 'ꯕ꯭ꯌꯇꯤꯄꯥꯠ', 'ꯕꯔꯤꯌꯥꯟ',
  'ꯄꯔꯤꯘ', 'ꯁꯤꯕ', 'ꯁꯤꯗ꯭ꯙ', 'ꯁꯥꯙ꯭ꯌ', 'ꯁꯨꯚ', 'ꯁꯨꯛꯂ', 'ꯕ꯭ꯔꯍ꯭ꯃ', 'ꯏꯟꯗ꯭ꯔ', 'ꯕꯩꯙ꯭ꯔꯤꯇꯤ'
];

export const KARANA_NAMES_BLIPI = [
  'bb', 'balb', 'Ek;lb', 'E~titl', 'gr', 'bij', 'ibi&', 'skuni', 'ctuS\\pd', 'nag', 'ik:'
];

export const KARANA_NAMES_BENGALI = [
  'বব', 'বালব', 'কৌলব', 'তৈতিল', 'গর', 'বণিজ', 'বিষ্টি', 'শকুনী', 'চতুস্পদ', 'নাগ', 'কিংস্তুঘ্ন'
];

export const KARANA_NAMES_MEETEI = [
  'ꯕꯕ', 'ꯕꯥꯂꯕ', 'ꯀꯧꯂꯕ', 'ꯇꯩꯇꯤꯜ', 'ꯒꯔ', 'ꯕꯅꯤꯖ', 'ꯕꯤꯁ꯭ꯇꯤ', 'ꯁꯀꯨꯅꯤ', 'ꯆꯇꯨꯁ꯭ꯄꯗ', 'ꯅꯥꯒ', 'ꯀꯤꯡꯁ꯭ꯇꯨꯘ꯭ꯅ'
];

export const WEEKDAYS_BLIPI: Record<number, string> = {
  0: 'Enazmah~ijz',  // Sunday
  1: 'inzeT;kaba',   // Monday
  2: 'E~lbakepakpa', // Tuesday
  3: 'yumSe~kS',     // Wednesday
  4: 'SegaleSn',     // Thursday
  5: 'h~rah~',       // Friday
  6: 'Tazj'          // Saturday
};

export const MANIPURI_LUNAR_MONTHS_BLIPI: Record<number, string> = {
  1: 'Sijbu',
  2: 'kaeln',
  3: 'h~Za',
  4: 'h~eZz',
  5: 'Twan',
  6: 'lazban',
  7: 'E~mra',
  8: 'ihyae~O',
  9: 'Epah~nuu',
  10: 'wakicz',
  11: 'fah~ern',
  12: 'lmta'
};

export const SOLAR_MONTHS_BLIPI: Record<number, string> = {
  0: 'E~bSaK',
  1: 'E~j/',
  2: 'AaFaP.',
  3: 'S[ab',
  4: 'vad[',
  5: 'AaiSBn',
  6: 'kaio_\`k',
  7: 'Ag[hayn',
  8: 'Ep;F',
  9: 'ma',
  10: 'fan',
  11: 'E~c@_'
};

export const TITHI_NAMES_BLIPI: Record<number, string> = {
  1: 'p[itpid',
  2: 'idBtIyayan^',
  3: 't<tIyayan^',
  4: 'ctuT`/an^',
  5: 'p\\adm/an^',
  6: 'F/an^',
  7: 'sm/an^',
  8: 'A&m/an^',
  9: 'nbm/an^',
  10: 'dSm/an^',
  11: 'kadS/an^',
  12: 'dBadS/an^',
  13: '_eyadS/an^',
  14: 'ctu\`S/an^',
  15: 'pui\`mayan^',
  16: 'p[itpid',
  17: 'idBtIyayan^',
  18: 't<tIyayan^',
  19: 'ctuT`/an^',
  20: 'p\\adm/an^',
  21: '&/an^',
  22: 'sm/an^',
  23: 'A&m/an^',
  24: 'nbm/an^',
  25: 'dSm/an^',
  26: 'kadS/an^',
  27: 'dBadS/an^',
  28: '_eyadS/an^',
  29: 'ctu\`S/an^',
  30: 'Amabs/ayan^'
};

export const GREGORIAN_MONTHS_BLIPI = [
  'januwarI',
  'Efbu[warI',
  'mac`',
  'Aep[Il',
  'E~m',
  'jun',
  'julaI',
  'AagSt',
  'EseMb_',
  'AoTab_',
  'neavMb_',
  'idseMba'
];

export const BENGALI_MONTH_NAMES = [
  'জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগষ্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export const MEETEI_MONTH_NAMES = [
  'ꯖꯥꯅꯨꯋꯥꯔꯤ', 'ꯐꯦꯕ꯭ꯔꯨꯋꯥꯔꯤ', 'ꯃꯥꯔꯆ', 'ꯑꯦꯄ꯭ꯔꯤꯜ', 'ꯃꯦ', 'ꯖꯨꯟ',
  'ꯖꯨꯂꯥꯏ', 'ꯑꯥꯒꯁ꯭ꯠ', 'ꯁꯦꯞꯇꯦꯝꯕꯔ', 'ꯑꯣꯛꯇꯣꯕꯔ', 'ꯅꯣꯚꯦꯝꯕꯔ', 'ꯗꯤꯁꯦꯝꯕꯔ'
];

// ─────────────────────────────────────────────────────────────
// DASHA, GANA, VARNA ATTRIBUTES (Authentic Manipuri Panchang)
// ─────────────────────────────────────────────────────────────
export const VIMSHOTTARI_LORDS_BENGALI = [
  'কেতু', 'শুক্র', 'রবি', 'চন্দ্র', 'মঙ্গল', 'রাহু', 'গুরু', 'শনি', 'বুধ'
];
export const VIMSHOTTARI_LORDS_MEETEI = [
  'ꯀꯦꯇꯨ', 'ꯁꯨꯛꯔ', 'ꯔꯕꯤ', 'ꯆꯟꯗ꯭ꯔ', 'ꯃꯡꯒꯜ', 'ꯔꯥꯍꯨ', 'ꯒꯨꯔꯨ', 'ꯁꯅꯤ', 'ꯕꯨꯙ'
];
export const VIMSHOTTARI_LORDS_BLIPI = [
  'Ek', 'su', 'rib', 'Esam', 'mOl', 'raH', 'g=ru', 'Sin', 'buD'
];

export const YOGINI_NAMES_BENGALI = [
  'সংকটা', 'মঙ্গলা', 'পিঙ্গলা', 'ধান্যা', 'ভ্রামরী', 'ভদ্রিকা', 'উল্কা', 'সিদ্ধা'
];
export const YOGINI_NAMES_MEETEI = [
  'ꯁꯡꯀꯇꯥ', 'ꯃꯡꯒꯂꯥ', 'ꯄꯤꯡꯒꯂꯥ', 'ꯙꯅ꯭ꯌꯥ', 'ꯚ꯭ꯔꯥꯃꯔꯤ', 'ꯚꯗ꯭ꯔꯤꯀꯥ', 'ꯎꯜꯀꯥ', 'ꯁꯤꯗ꯭ꯙꯥ'
];
export const YOGINI_NAMES_BLIPI = [
  's$P~a', 'mzla', 'ipOla', 'Dn/a', '_amrI', 'vid[ka', 'UlkX', 'isa'
];

// Gana for 27 Nakshatras: 0 = Deva (লাই), 1 = Manushya (মী), 2 = Rakshasa (হিঞ্চাবা)
export const NAKSHATRA_GANA_BASE = [
  0, 1, 2, 1, 0, 1, 0, 0, 2,
  2, 1, 1, 0, 2, 0, 2, 0, 2,
  2, 1, 1, 0, 2, 2, 1, 1, 0
];
export const GANA_NAMES_BENGALI = ['লাই', 'মী', 'হিঞ্চাবা'];
export const GANA_NAMES_MEETEI = ['ꯂꯥꯏ', 'ꯃꯤ', 'ꯍꯤꯟꯆꯥꯕꯥ'];
export const GANA_NAMES_BLIPI = ['laI', 'mI', 'ih\\caba'];

// Rashi Varna: 0 = Brahmin (ব্রাহ্মণ), 1 = Kshatriya (ক্ষত্রিয়), 2 = Vaishya (বৈশ্য), 3 = Shudra (শূদ্র)
export const RASHI_VARNA_BASE = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0];

// Nakshatra Varna (4 classes across 27 nakshatras)
export const NAKSHATRA_VARNA_BASE = [
  1, // 1: Ashwini -> Kshatriya
  2, // 2: Bharani -> Vaishya
  0, // 3: Krittika -> Brahmin
  3, // 4: Rohini -> Shudra
  3, // 5: Mrigashira -> Shudra
  3, // 6: Ardra -> Shudra
  2, // 7: Punarvasu -> Vaishya
  1, // 8: Pushya -> Kshatriya
  1, // 9: Ashlesha -> Kshatriya
  3, // 10: Magha -> Shudra
  1, // 11: Purva Phalguni -> Kshatriya
  0, // 12: Uttara Phalguni -> Brahmin
  2, // 13: Hasta -> Vaishya
  1, // 14: Chitra -> Kshatriya
  3, // 15: Swati -> Shudra
  0, // 16: Vishakha -> Brahmin
  0, // 17: Anuradha -> Brahmin
  1, // 18: Jyeshtha -> Kshatriya
  1, // 19: Mula -> Kshatriya
  0, // 20: Purva Ashadha -> Brahmin
  1, // 21: Uttara Ashadha -> Kshatriya
  2, // 22: Shravana -> Vaishya
  3, // 23: Dhanishta -> Shudra
  3, // 24: Shatabhisha -> Shudra
  0, // 25: Purva Bhadrapada -> Brahmin
  1, // 26: Uttara Bhadrapada -> Kshatriya
  0  // 27: Revati -> Brahmin
];

export const VARNA_NAMES_BENGALI = ['ব্রাহ্মণ', 'ক্ষত্রিয়', 'বৈশ্য', 'শূদ্র'];
export const VARNA_NAMES_MEETEI = ['ꯕ꯭ꯔꯥꯍ꯭ꯃꯟ', 'ꯈꯠꯔꯤꯌ', 'ꯕꯩꯁ꯭ꯌ', 'ꯁꯨꯗ꯭ꯔ'];
export const VARNA_NAMES_BLIPI = ['b[amX', 'Ktriy', 'bEs_y', '#d['];

// Navamsha Rashi Lords (0=Mesha to 11=Meena)
export const NAVAMSHA_LORDS_BENGALI = [
  'মঙ্গল', 'শুক্র', 'বুধ', 'চন্দ্র', 'রবি', 'বুধ',
  'শুক্র', 'মঙ্গল', 'গুরু', 'শনি', 'শনি', 'গুরু'
];
export const NAVAMSHA_LORDS_MEETEI = [
  'ꯃꯡꯒꯜ', 'ꯁꯨꯛꯔ', 'ꯕꯨꯙ', 'ꯆꯟꯗ꯭ꯔ', 'ꯔꯕꯤ', 'ꯕꯨꯙ',
  'ꯁꯨꯛꯔ', 'ꯃꯡꯒꯜ', 'ꯒꯨꯔꯨ', 'ꯁꯅꯤ', 'ꯁꯅꯤ', 'ꯒꯨꯔꯨ'
];
export const NAVAMSHA_LORDS_BLIPI = [
  'mOl', 'su', 'buD', 'Esam', 'rib', 'buD',
  'su', 'mOl', 'g=ru', 'Sin', 'Sin', 'g=ru'
];

export const MANIPURI_TITHI_NAMES_BENGALI: Record<number, string> = {
  1: 'নিংথৌ তরুক্কি-১ (শুক্ল প্রতিপদ)',
  2: 'নিংথৌ তরুক্কি-২ (দ্বিতীয়া)',
  3: 'নিংথৌ তরুক্কি-৩ (তৃতীয়া)',
  4: 'নিংথৌ তরুক্কি-৪ (চতুর্থী)',
  5: 'নিংথৌ তরুক্কি-৫ (পঞ্চমী)',
  6: 'নিংথৌ তরুক্কি-৬ (ষষ্ঠী)',
  7: 'নিংথৌ তরুক্কি-৭ (সপ্তমী)',
  8: 'নিংথৌ তরুক্কি-৮ (অষ্টমী)',
  9: 'নিংথৌ তরুক্কি-৯ (নবমী)',
  10: 'নিংথৌ তরুক্কি-১০ (দশমী)',
  11: 'নিংথৌ তরুক্কি-১১ (একাদশী)',
  12: 'নিংথৌ তরুক্কি-১২ (দ্বাদশী)',
  13: 'নিংথৌ তরুক্কি-১৩ (ত্রয়োদশী)',
  14: 'নিংথৌ তরুক্কি-১৪ (চতুর্দশী)',
  15: 'থাবান-১৫ (পূর্ণিমা)',
  16: 'নিংথৌ তরুক্কি-১৬ (কৃষ্ণ প্রতিপদ)',
  17: 'নিংথৌ তরুক্কি-১৭ (দ্বিতীয়া)',
  18: 'নিংথৌ তরুক্কি-১৮ (তৃতীয়া)',
  19: 'নিংথৌ তরুক্কি-১৯ (চতুর্থী)',
  20: 'নিংথৌ তরুক্কি-২০ (পঞ্চমী)',
  21: 'নিংথৌ তরুক্কি-২১ (কৃষ্ণ ষষ্ঠী)',
  22: 'নিংথৌ তরুক্কি-২২ (সপ্তমী)',
  23: 'নিংথৌ তরুক্কি-২৩ (অষ্টমী)',
  24: 'নিংথৌ তরুক্কি-২৪ (নবমী)',
  25: 'নিংথৌ তরুক্কি-২৫ (দশমী)',
  26: 'নিংথৌ তরুক্কি-২৬ (একাদশী)',
  27: 'নিংথৌ তরুক্কি-২৭ (দ্বাদশী)',
  28: 'নিংথৌ তরুক্কি-২৮ (ত্রয়োদশী)',
  29: 'নিংথৌ তরুক্কি-২৯ (চতুর্দশী)',
  30: 'থাবান-৩০ (অমাবস্যা)'
};

// ─────────────────────────────────────────────────────────────
// TIME & NUMERICAL FORMATTING HELPERS
// ─────────────────────────────────────────────────────────────

export function hoursToDandaPalBipal(hours: number): DandaPalBipal {
  const dandaTotal = (hours / 24) * 60;
  const danda = Math.floor(dandaTotal);
  const remPal = (dandaTotal - danda) * 60;
  const pal = Math.floor(remPal);
  const remBipal = (remPal - pal) * 60;
  const bipal = Math.round(remBipal);

  return {
    danda: Math.max(0, danda % 60),
    pal: Math.max(0, pal % 60),
    bipal: Math.max(0, bipal % 60)
  };
}

export function formatPungBengali(decimalHours: number): string {
  const norm = ((decimalHours % 24) + 24) % 24;
  let h = Math.floor(norm) % 12;
  if (h === 0) h = 12;
  const remM = (norm - Math.floor(norm)) * 60;
  const m = Math.floor(remM);
  const s = Math.round((remM - m) * 60) % 60;
  return `${toBengaliNumerals(h)} । ${toBengaliNumerals(String(m).padStart(2, '0'))} । ${toBengaliNumerals(String(s).padStart(2, '0'))}`;
}

export function formatPungMeetei(decimalHours: number): string {
  const norm = ((decimalHours % 24) + 24) % 24;
  let h = Math.floor(norm) % 12;
  if (h === 0) h = 12;
  const remM = (norm - Math.floor(norm)) * 60;
  const m = Math.floor(remM);
  const s = Math.round((remM - m) * 60) % 60;
  return `${toMeeteiNumerals(h)} । ${toMeeteiNumerals(String(m).padStart(2, '0'))} । ${toMeeteiNumerals(String(s).padStart(2, '0'))}`;
}

export function formatPungBlipi(decimalHours: number): string {
  const norm = ((decimalHours % 24) + 24) % 24;
  let h = Math.floor(norm) % 12;
  if (h === 0) h = 12;
  const remM = (norm - Math.floor(norm)) * 60;
  const m = Math.floor(remM);
  const s = Math.round((remM - m) * 60) % 60;
  return `${h} | ${String(m).padStart(2, '0')} | ${String(s).padStart(2, '0')}`;
}

/**
 * Ensures daytime (Anganba) + nighttime (Ahing) = strictly 60 Danda 00 Pal 00 Bipal
 */
export function getComplementary60DPB(dpb: DandaPalBipal): DandaPalBipal {
  const totalBipalsDay = dpb.danda * 3600 + dpb.pal * 60 + dpb.bipal;
  const totalBipalsNight = Math.max(0, 60 * 3600 - totalBipalsDay);
  const danda = Math.floor(totalBipalsNight / 3600);
  const rem = totalBipalsNight % 3600;
  const pal = Math.floor(rem / 60);
  const bipal = rem % 60;
  return { danda, pal, bipal };
}

export function formatDPBBengali(dpb: { danda: number | string; pal: number | string; bipal: number | string }): string {
  if (dpb.danda === 'নুমিৎ' || dpb.pal === 'চুপ্না') {
    return 'নুমিৎ চুপ্না -';
  }
  const d = typeof dpb.danda === 'number' ? toBengaliNumerals(dpb.danda) : String(dpb.danda);
  const p = typeof dpb.pal === 'number' ? toBengaliNumerals(String(dpb.pal).padStart(2, '0')) : String(dpb.pal);
  const b = typeof dpb.bipal === 'number' ? toBengaliNumerals(String(dpb.bipal).padStart(2, '0')) : String(dpb.bipal);
  return `${d} । ${p} । ${b}`;
}

export function formatDPBMeetei(dpb: { danda: number | string; pal: number | string; bipal: number | string }): string {
  if (dpb.danda === 'নুমিৎ' || dpb.danda === 'ꯅꯨꯃꯤꯠ' || dpb.pal === 'চুপ্না' || dpb.pal === 'ꯆꯨꯞꯅꯥ') {
    return 'ꯅꯨꯃꯤꯠ ꯆꯨꯞꯅꯥ -';
  }
  const d = typeof dpb.danda === 'number' ? toMeeteiNumerals(dpb.danda) : String(dpb.danda);
  const p = typeof dpb.pal === 'number' ? toMeeteiNumerals(String(dpb.pal).padStart(2, '0')) : String(dpb.pal);
  const b = typeof dpb.bipal === 'number' ? toMeeteiNumerals(String(dpb.bipal).padStart(2, '0')) : String(dpb.bipal);
  return `${d} । ${p} । ${b}`;
}

export function formatDPBBlipi(dpb: { danda: number | string; pal: number | string; bipal: number | string }): string {
  if (dpb.danda === 'নুমিৎ' || dpb.danda === 'nuim\\' || dpb.pal === 'চুপ্না' || dpb.pal === 'cup_na') {
    return 'nuim\\ cup_na -';
  }
  const d = dpb.danda;
  const p = typeof dpb.pal === 'number' ? String(dpb.pal).padStart(2, '0') : String(dpb.pal);
  const b = typeof dpb.bipal === 'number' ? String(dpb.bipal).padStart(2, '0') : String(dpb.bipal);
  return `${d} | ${p} | ${b}`;
}

export function getMukhyoGounaNames(monthCode: number, tithiNum: number) {
  const isShukla = tithiNum <= 15;
  const mukhIdx = isShukla ? (monthCode - 1) % 12 : (monthCode - 2 + 12) % 12;
  const gounIdx = isShukla ? monthCode % 12 : (monthCode - 1) % 12;

  const mukhObj = SOLAR_MONTH_NAMES[mukhIdx] || SOLAR_MONTH_NAMES[0];
  const gounObj = SOLAR_MONTH_NAMES[gounIdx] || SOLAR_MONTH_NAMES[1];
  const mukhBl = SOLAR_MONTHS_BLIPI[mukhIdx] || 'E~bSaK';
  const gounBl = SOLAR_MONTHS_BLIPI[gounIdx] || 'E~j/';

  return {
    bengali: `(মুখ্য ${mukhObj.bengali}, গৌণ ${gounObj.bengali})`,
    meetei: `(ꯃꯨꯈ꯭ꯌ ${mukhObj.meetei}, ꯒꯧꯅ ${gounObj.meetei})`,
    blipi: `(muK_y ${mukhBl}, Egax ${gounBl})`
  };
}

export function getKaranaIndex(halfTithi: number): number {
  if (halfTithi === 0) return 10;
  if (halfTithi >= 57) return 7 + (halfTithi - 57);
  return (halfTithi - 1) % 7;
}

export function formatDPBSectionBengali(dpb: { danda: number | string; pal: number | string; bipal: number | string }, clockDec: number): string {
  if (dpb.danda === 'নুমিৎ' || dpb.pal === 'চুপ্না') {
    return 'দণ্ড: - নুমিৎ চুপ্না -';
  }
  return `দণ্ড: - ${formatDPBBengali(dpb)} ${formatManipuriClockTimeBengali(clockDec)}`;
}

export function formatDPBSectionMeetei(dpb: { danda: number | string; pal: number | string; bipal: number | string }, clockDec: number): string {
  if (dpb.danda === 'নুমিৎ' || dpb.danda === 'ꯅꯨꯃꯤꯠ' || dpb.pal === 'চুপ্না' || dpb.pal === 'ꯆꯨꯞꯅꯥ') {
    return 'ꯗꯟꯗ: - ꯅꯨꯃꯤꯠ ꯆꯨꯞꯅꯥ -';
  }
  return `ꯗꯟꯗ: - ${formatDPBMeetei(dpb)} ${formatManipuriClockTimeMeetei(clockDec)}`;
}

export function formatDPBSectionBlipi(dpb: { danda: number | string; pal: number | string; bipal: number | string }, clockDec: number): string {
  if (dpb.danda === 'নুমিৎ' || dpb.danda === 'nuim\\' || dpb.pal === 'চুপ্না' || dpb.pal === 'cup_na') {
    return 'dZ: - nuim\\ cup_na -';
  }
  return `dZ: - ${formatDPBBlipi(dpb)} ${formatManipuriClockTimeBlipi(clockDec)}`;
}

export function getAuspiciousRashis(moonRashiIdx: number): number[] {
  // Houses 2, 3, 6, 7, 9, 11 from Janma Rashi to Moon Sign
  const auspiciousHouses = [2, 3, 6, 7, 9, 11];
  const janmaRashis = auspiciousHouses.map(h => (moonRashiIdx - (h - 1) + 12) % 12);
  return janmaRashis.sort((a, b) => a - b);
}

export function getGhataChandra(moonRashiIdx: number): { bengali: string; meetei: string; blipi: string } {
  const GHATA_CHANDRA_TABLE: { [key: number]: { bengali: string; meetei: string; blipi: string } } = {
    0: { bengali: 'মেষ', meetei: 'ꯃꯦꯁ', blipi: 'EmF' },
    1: { bengali: 'বৃশ্চিক', meetei: 'ꯕ꯭ꯔꯤꯁꯆꯤꯀ', blipi: 'b<ick' },
    2: { bengali: 'কন্যা', meetei: 'ꯀꯟꯌꯥ', blipi: 'kn/a' },
    3: { bengali: 'লৈতে', meetei: 'ꯂꯩꯇꯦ', blipi: 'E~ltba' },
    4: { bengali: 'কর্কট, মকর', meetei: 'ꯀꯔꯀꯠ, ꯃꯀꯔ', blipi: 'kkP, mkr' },
    5: { bengali: 'বৃষ', meetei: 'ꯕ꯭ꯔꯤꯁ', blipi: 'b<F' },
    6: { bengali: 'বৃষ, কন্যা', meetei: 'ꯕ꯭ꯔꯤꯁ, ꯀꯟꯌꯥ', blipi: 'b<F, kn/a' },
    7: { bengali: 'লৈতে', meetei: 'ꯂꯩꯇꯦ', blipi: 'E~ltba' },
    8: { bengali: 'তুলা, কুম্ভ', meetei: 'ꯇꯨꯂꯥ, ꯀꯨꯃ꯭ꯚ', blipi: 'tula, k=U' },
    9: { bengali: 'সিংহ', meetei: 'ꯁꯤꯡꯍ', blipi: 'iszh' },
    10: { bengali: 'মীন, মিথুন', meetei: 'ꯃꯤꯟ, ꯃꯤꯊꯨꯟ', blipi: 'mIn, imTun' },
    11: { bengali: 'ধনু', meetei: 'ꯙꯅꯨ', blipi: 'Dnu' }
  };
  return GHATA_CHANDRA_TABLE[moonRashiIdx] || { bengali: 'লৈতে', meetei: 'ꯂꯩꯇꯦ', blipi: 'E~ltba' };
}

export function getAuspiciousNakshatras(nakNum: number): number[] {
  const result: number[] = [];
  for (let j = 1; j <= 27; j++) {
    const count = ((nakNum - j + 27) % 27) + 1;
    const tara = ((count - 1) % 9) + 1;
    if (tara === 2 || tara === 4 || tara === 6 || tara === 8 || tara === 9) {
      result.push(j);
    }
  }
  return result;
}

export function formatAuspiciousNakshatrasBengali(nums: number[]): string {
  return `${nums.map(toBengaliNumerals).join(' । ')} নক্ষত্রশিং`;
}

export function formatAuspiciousNakshatrasMeetei(nums: number[]): string {
  return `${nums.map(toMeeteiNumerals).join(' । ')} ꯅꯛꯁꯠꯔꯁꯤꯡ`;
}

export function formatAuspiciousNakshatrasBlipi(nums: number[]): string {
  return `${nums.join(' | ')} nKS_t[iSz`;
}

export function formatManipuriClockTimeBengali(decimalHours: number): string {
  const norm = ((decimalHours % 24) + 24) % 24;
  let period = 'অয়ুক';
  let displayHour = Math.floor(norm);
  const remM = (norm - displayHour) * 60;
  const m = Math.floor(remM);
  const s = Math.round((remM - m) * 60) % 60;

  if (norm >= 12 && norm < 16) {
    period = 'নুংথিল';
    if (displayHour > 12) displayHour -= 12;
  } else if (norm >= 16 && norm < 20) {
    period = 'নুমিদাং';
    if (displayHour > 12) displayHour -= 12;
  } else if (norm >= 20 || norm < 4) {
    period = 'অহিং';
    if (displayHour >= 12) displayHour -= 12;
    if (displayHour === 0) displayHour = 12;
  }

  return `${period} পুং ${toBengaliNumerals(displayHour)} । ${toBengaliNumerals(String(m).padStart(2, '0'))} । ${toBengaliNumerals(String(s).padStart(2, '0'))}`;
}

export function formatManipuriClockTimeMeetei(decimalHours: number): string {
  const norm = ((decimalHours % 24) + 24) % 24;
  let period = 'ꯑꯌꯨꯛ';
  let displayHour = Math.floor(norm);
  const remM = (norm - displayHour) * 60;
  const m = Math.floor(remM);
  const s = Math.round((remM - m) * 60) % 60;

  if (norm >= 12 && norm < 16) {
    period = 'ꯅꯨꯡꯊꯤꯜ';
    if (displayHour > 12) displayHour -= 12;
  } else if (norm >= 16 && norm < 20) {
    period = 'ꯅꯨꯃꯤꯗꯥꯡ';
    if (displayHour > 12) displayHour -= 12;
  } else if (norm >= 20 || norm < 4) {
    period = 'ꯑꯍꯤꯡ';
    if (displayHour >= 12) displayHour -= 12;
    if (displayHour === 0) displayHour = 12;
  }

  return `${period} ꯄꯨꯡ ${toMeeteiNumerals(displayHour)} । ${toMeeteiNumerals(String(m).padStart(2, '0'))} । ${toMeeteiNumerals(String(s).padStart(2, '0'))}`;
}

export function formatManipuriClockTimeBlipi(decimalHours: number): string {
  const norm = ((decimalHours % 24) + 24) % 24;
  let period = 'Ayuk';
  let displayHour = Math.floor(norm);
  const remM = (norm - displayHour) * 60;
  const m = Math.floor(remM);
  const s = Math.round((remM - m) * 60) % 60;

  if (norm >= 12 && norm < 16) {
    period = 'nuziTl';
    if (displayHour > 12) displayHour -= 12;
  } else if (norm >= 16 && norm < 20) {
    period = 'nuimdaZ';
    if (displayHour > 12) displayHour -= 12;
  } else if (norm >= 20 || norm < 4) {
    period = 'AihZ';
    if (displayHour >= 12) displayHour -= 12;
    if (displayHour === 0) displayHour = 12;
  }

  return `${period} puz ${displayHour} im: ${String(m).padStart(2, '0')} Es: ${String(s).padStart(2, '0')}`;
}

export function parseTimeStringToDecimal(timeStr: string): number {
  if (!timeStr) return 5.0;
  const clean = timeStr.trim();
  const isPM = clean.toUpperCase().includes('PM');
  const isAM = clean.toUpperCase().includes('AM');
  const numOnly = clean.replace(/[^\d:]/g, '');
  const parts = numOnly.split(':').map(Number);
  let h = parts[0] || 0;
  const m = parts[1] || 0;
  const s = parts[2] || 0;
  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  return h + m / 60 + s / 3600;
}

export function computeDPBWithExceedRule(dandas: number | null | undefined): {
  danda: number | string;
  pal: number | string;
  bipal: number | string;
} {
  if (dandas === null || dandas === undefined || isNaN(dandas)) {
    return { danda: '', pal: '', bipal: '' };
  }

  if (dandas >= 60) {
    return {
      danda: 'নুমিৎ',
      pal: 'চুপ্না',
      bipal: '-'
    };
  }

  const d = Math.max(0, Math.floor(dandas));
  const remPal = (dandas - d) * 60;
  const p = Math.max(0, Math.floor(remPal));
  const remBipal = (remPal - p) * 60;
  const b = Math.max(0, Math.min(59, Math.round(remBipal)));

  return { danda: d, pal: p, bipal: b };
}

export function formatTableCell(
  val: number | string | undefined | null,
  script: 'bengali' | 'meetei' | 'blipi' | 'en'
): string {
  if (val === '' || val === null || val === undefined) return '';
  if (val === '-') return '-';
  if (val === 'নুমিৎ' || val === 'ꯅꯨꯃꯤꯠ' || val === 'nuim\\' || val === 'Numit') {
    if (script === 'bengali') return 'নুমিৎ';
    if (script === 'meetei') return 'ꯅꯨꯃꯤꯠ';
    if (script === 'blipi') return 'nuim\\';
    return 'Numit';
  }
  if (val === 'চুপ্না' || val === 'ꯆꯨꯞꯅꯥ' || val === 'cup_na' || val === 'Chupna') {
    if (script === 'bengali') return 'চুপ্না';
    if (script === 'meetei') return 'ꯆꯨꯞꯅꯥ';
    if (script === 'blipi') return 'cup_na';
    return 'Chupna';
  }
  const num = typeof val === 'number' ? val : Number(val);
  if (!isNaN(num)) {
    if (script === 'bengali') return toBengaliNumerals(num);
    if (script === 'meetei') return toMeeteiNumerals(num);
    return String(num);
  }
  return String(val);
}

/**
 * Calculates raw DPB values and 5-angas values for a target date
 */
function computeDayDPB(targetDateStr: string, lat: number, lng: number, tz: number) {
  const p = calculateVedicPanchang(targetDateStr, lat, lng, tz, 'Imphal');
  const [y, m, d] = targetDateStr.split('-').map(Number);
  const dObj = new Date(y, m - 1, d, 12, 0, 0);
  const weekdayNo = dObj.getDay() + 1; // 1 = Sunday, 2 = Monday, ..., 7 = Saturday

  const nextDate = new Date(dObj.getTime() + 86400000);
  const nextStr = nextDate.toISOString().split('T')[0];
  const pNext = calculateVedicPanchang(nextStr, lat, lng, tz, 'Imphal');

  const sunriseDec = p.sunMoonTimings.sunriseDecimal ?? parseTimeStringToDecimal(p.sunMoonTimings.sunrise);
  const sunsetDec = p.sunMoonTimings.sunsetDecimal ?? parseTimeStringToDecimal(p.sunMoonTimings.sunset);
  const dayLengthHours = sunsetDec >= sunriseDec ? sunsetDec - sunriseDec : (sunsetDec + 24) - sunriseDec;
  const dayDPB = hoursToDandaPalBipal(dayLengthHours);

  const sun = p.planets?.find(x => x.id === 'su');
  const moon = p.planets?.find(x => x.id === 'mo');
  const sunNext = pNext.planets?.find(x => x.id === 'su');
  const moonNext = pNext.planets?.find(x => x.id === 'mo');

  const sunLong = sun?.longitude ?? (p.planetaryState?.sunLongitude ?? 0);
  const moonLong = moon?.longitude ?? (p.planetaryState?.moonLongitude ?? 0);

  let sunSpeed = (sunNext && typeof sunNext.longitude === 'number') ? (sunNext.longitude - sunLong + 360) % 360 : (Math.abs(sun?.speed ?? 0.9856) || 0.9856);
  let moonSpeed = (moonNext && typeof moonNext.longitude === 'number') ? (moonNext.longitude - moonLong + 360) % 360 : (Math.abs(moon?.speed ?? 13.176) || 13.176);
  if (sunSpeed < 0.5 || sunSpeed > 1.5) sunSpeed = 0.9856;
  if (moonSpeed < 10.0 || moonSpeed > 16.0) moonSpeed = 13.176;

  // 1. Tithi
  const tithiDiffDeg = (moonLong - sunLong + 360) % 360;
  const tithiNumber = p.fiveAngas?.tithi?.index || (Math.floor(tithiDiffDeg / 12) + 1);
  const tithiNext = pNext.fiveAngas?.tithi?.index || (Math.floor(((moonNext?.longitude ?? 0) - (sunNext?.longitude ?? 0) + 360) % 360 / 12) + 1);
  const tithiDiff = (tithiNext - tithiNumber + 30) % 30;

  const tithi1RemDeg = (tithiNumber * 12 - tithiDiffDeg + 360) % 12 || 12;
  const tithiRelSpeed = Math.max(10.5, moonSpeed - sunSpeed);
  const tithi1Hours = (tithi1RemDeg / tithiRelSpeed) * 24;
  const tithi1Dandas = tithi1Hours * 2.5;

  const tithi2Hours = tithi1Hours + (12 / tithiRelSpeed) * 24;
  const tithi2Dandas = tithi2Hours * 2.5;
  const isDualTithi = tithiDiff === 2 || (tithi2Dandas <= 60 && tithi1Dandas < 60);

  const tithi1DPB = computeDPBWithExceedRule(tithi1Dandas);
  const tithi2DPB = isDualTithi ? computeDPBWithExceedRule(tithi2Dandas) : { danda: '', pal: '', bipal: '' };

  // 2. Nakshatra
  const nakshatraNo = p.fiveAngas?.nakshatra?.index || (Math.floor(moonLong / 13.33333333) + 1);
  const nakNext = pNext.fiveAngas?.nakshatra?.index || (Math.floor((moonNext?.longitude ?? 0) / 13.33333333) + 1);
  const nakDiff = (nakNext - nakshatraNo + 27) % 27;

  const nak1RemDeg = 13.33333333 - (moonLong % 13.33333333);
  const nakSpeed = Math.max(11.0, moonSpeed);
  const nak1Hours = (nak1RemDeg / nakSpeed) * 24;
  const nak1Dandas = nak1Hours * 2.5;

  const nak2Hours = nak1Hours + (13.33333333 / nakSpeed) * 24;
  const nak2Dandas = nak2Hours * 2.5;
  const isDualNak = nakDiff === 2 || (nak2Dandas <= 60 && nak1Dandas < 60);

  const nak1DPB = computeDPBWithExceedRule(nak1Dandas);
  const nak2DPB = isDualNak ? computeDPBWithExceedRule(nak2Dandas) : { danda: '', pal: '', bipal: '' };

  // 3. Yoga
  const yogaSumDeg = (sunLong + moonLong) % 360;
  const yogaNo = p.fiveAngas?.yoga?.index || (Math.floor(yogaSumDeg / 13.33333333) + 1);
  const sumNext = ((sunNext?.longitude ?? 0) + (moonNext?.longitude ?? 0)) % 360;
  const yogaNext = pNext.fiveAngas?.yoga?.index || (Math.floor(sumNext / 13.33333333) + 1);
  const yogaDiff = (yogaNext - yogaNo + 27) % 27;

  const yoga1RemDeg = 13.33333333 - (yogaSumDeg % 13.33333333);
  const yogaNetSpeed = Math.max(11.5, moonSpeed + sunSpeed);
  const yoga1Hours = (yoga1RemDeg / yogaNetSpeed) * 24;
  const yoga1Dandas = yoga1Hours * 2.5;

  const yoga2Hours = yoga1Hours + (13.33333333 / yogaNetSpeed) * 24;
  const yoga2Dandas = yoga2Hours * 2.5;
  const isDualYoga = yogaDiff === 2 || (yoga2Dandas <= 60 && yoga1Dandas < 60);

  const yoga1DPB = computeDPBWithExceedRule(yoga1Dandas);
  const yoga2DPB = isDualYoga ? computeDPBWithExceedRule(yoga2Dandas) : { danda: '', pal: '', bipal: '' };

  // 4. Karana & Bengali Solar Day
  const karanaNo = p.fiveAngas?.karana?.index || 1;
  const { solarDay } = calculateBengaliSolarDay(targetDateStr, lat, lng, tz);

  return {
    weekdayNo,
    tithiNumber,
    isDualTithi,
    tithi1DPB,
    tithi2DPB,
    tithi1Dandas,
    tithi1Hours,
    tithi2Dandas,
    tithi2Hours,
    nakshatraNo,
    isDualNak,
    nak1DPB,
    nak2DPB,
    nak1Dandas,
    nak1Hours,
    nak2Dandas,
    nak2Hours,
    yogaNo,
    isDualYoga,
    yoga1DPB,
    yoga2DPB,
    yoga1Dandas,
    yoga1Hours,
    yoga2Dandas,
    yoga2Hours,
    karanaNo,
    solarDay,
    dayDPB,
    dayLengthHours,
    sunriseDec,
    sunsetDec,
    rawPanchang: p
  };
}

/**
 * Accurately calculates Bengali / Solar Month Day (Sankranti Day) matching traditional Panjika (qw.xlsm Sun sheet).
 * Traces backwards to find the exact day the Sun entered the current Nirayana Rashi,
 * applying the traditional Sankranti rule (if transit occurs before midnight, Day 1 is the next sunrise).
 */
export function calculateBengaliSolarDay(
  dateStr: string,
  lat = 24.817,
  lng = 93.936,
  tzOffset = 5.5
): { solarDay: number; solarMonthIdx: number } {
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d, 12, 0, 0);

  const pCurr = calculateVedicPanchang(dateStr, lat, lng, tzOffset, 'Imphal');
  const sunLongCurr = pCurr.planetaryState?.sunLongitude ?? 
    (pCurr.planets?.find(p => p.id === 'su')?.longitude ?? 0);
  
  const currRashi = Math.floor(sunLongCurr / 30) % 12;
  const targetBoundary = currRashi * 30.0;
  const degInSign = (sunLongCurr - targetBoundary + 360) % 360;

  // Jump backwards close to the start of the sign (approx 1 degree per day)
  const jumpDays = Math.max(1, Math.min(31, Math.floor(degInSign) - 1));

  let prevDate = new Date(targetDate.getTime() - jumpDays * 86400000);
  let prevStr = prevDate.toISOString().split('T')[0];
  let pPrev = calculateVedicPanchang(prevStr, lat, lng, tzOffset, 'Imphal');
  let prevSunLong = pPrev.planetaryState?.sunLongitude ?? 
    (pPrev.planets?.find(p => p.id === 'su')?.longitude ?? 0);
  let prevRashi = Math.floor(prevSunLong / 30) % 12;

  // If we haven't crossed yet, step backwards until rashi changes
  let steps = 0;
  while (prevRashi === currRashi && steps < 10) {
    prevDate = new Date(prevDate.getTime() - 86400000);
    prevStr = prevDate.toISOString().split('T')[0];
    pPrev = calculateVedicPanchang(prevStr, lat, lng, tzOffset, 'Imphal');
    prevSunLong = pPrev.planetaryState?.sunLongitude ?? 
      (pPrev.planets?.find(p => p.id === 'su')?.longitude ?? 0);
    prevRashi = Math.floor(prevSunLong / 30) % 12;
    steps++;
  }

  // Next date after prevDate is when Sun crossed into currRashi
  const nextDate = new Date(prevDate.getTime() + 86400000);
  const nextStr = nextDate.toISOString().split('T')[0];
  const pNext = calculateVedicPanchang(nextStr, lat, lng, tzOffset, 'Imphal');
  const nextSunLong = pNext.planetaryState?.sunLongitude ?? 
    (pNext.planets?.find(p => p.id === 'su')?.longitude ?? 0);

  const diffToBoundary = (targetBoundary - prevSunLong + 360) % 360;
  const dailyMotion = (nextSunLong - prevSunLong + 360) % 360;
  const transitFraction = dailyMotion > 0 ? diffToBoundary / dailyMotion : 0.5;

  // Transit clock time from 5:30 AM
  const transitClock = 5.5 + transitFraction * 24;
  let day1Date: Date;
  if (transitClock < 24.0) {
    day1Date = nextDate;
  } else {
    day1Date = new Date(nextDate.getTime() + 86400000);
  }

  const daysDiff = Math.round((targetDate.getTime() - day1Date.getTime()) / 86400000);
  const solarDay = Math.max(1, daysDiff + 1);

  return { solarDay, solarMonthIdx: currRashi };
}

/**
 * Main calculation engine for traditional Manipuri Book Panchang
 * Full BLipi15, Bengali, and Meetei Mayek representations matching qw.xlsm
 */
export function getManipuriBookPanchang(
  dateStr: string,
  lat = 24.817,
  lng = 93.936,
  tzOffset = 5.5,
  locationName = 'Imphal, Manipur'
): ManipuriBookPanchangData {
  const panchang = calculateVedicPanchang(dateStr, lat, lng, tzOffset, locationName);
  const [year, month, day] = dateStr.split('-').map(Number);
  const dObj = new Date(year, month - 1, day, 12, 0, 0);

  // Compute Yesterday and Tomorrow dates
  const yesterdayDate = new Date(dObj.getTime() - 86400000);
  const tomorrowDate = new Date(dObj.getTime() + 86400000);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const yestCalc = computeDayDPB(yesterdayStr, lat, lng, tzOffset);
  const currCalc = computeDayDPB(dateStr, lat, lng, tzOffset);
  const tomCalc = computeDayDPB(tomorrowStr, lat, lng, tzOffset);

  // 1. Sunrise & Sunset
  const sunriseDec = currCalc.sunriseDec;
  const sunsetDec = currCalc.sunsetDec;

  const dayLengthHours = currCalc.dayLengthHours;
  const nightLengthHours = 24 - dayLengthHours;

  const dayDurationDPB = currCalc.dayDPB;
  const nightDurationDPB = getComplementary60DPB(dayDurationDPB);

  // 2. Manipuri Lunar Month & Saka Year
  const sakaYear = panchang.planetaryState.sakaSamvat || (year - 78);
  const intervals: any[] = lunarMonthsData as any[];
  const matchedInterval = intervals.find(
    (inv) => dateStr >= inv.startDate && dateStr <= inv.endDate
  ) || intervals[0];

  const manipuriMonthCode = matchedInterval.code || 1;
  const manipuriMonthBengali = matchedInterval.nameBengali || 'কালেন';
  const manipuriMonthMeetei = matchedInterval.nameMeetei || 'ꯀꯥꯂꯦꯟ';
  const manipuriMonthBlipi = MANIPURI_LUNAR_MONTHS_BLIPI[manipuriMonthCode] || 'kaeln';
  const manipuriMonthEn = matchedInterval.nameEn || 'Kalen';

  // Solar Month & Day (Accurate Panjika Sankranti day counting matching qw.xlsm Sun sheet)
  const sunLong = panchang.planetaryState?.sunLongitude ?? (panchang.planets?.find(p => p.id === 'su')?.longitude ?? 45);
  const { solarDay, solarMonthIdx } = calculateBengaliSolarDay(dateStr, lat, lng, tzOffset);
  const solarMonthObj = SOLAR_MONTH_NAMES[solarMonthIdx] || SOLAR_MONTH_NAMES[1];
  const solarMonthBlipi = SOLAR_MONTHS_BLIPI[solarMonthIdx] || 'E~j/';

  // Tithi Number (1 to 30) & Dual Tithi (Calendar calculation method matching qw.xlsm Sun!DG)
  const tithiNumber = currCalc.tithiNumber;
  const isDualTithi = currCalc.isDualTithi;
  const skippedTithi = (tithiNumber % 30) + 1;

  const tithiBlipiName = TITHI_NAMES_BLIPI[tithiNumber] || `Taban-${tithiNumber}`;
  const manipuriTithiStrBengali = isDualTithi
    ? `${manipuriMonthBengali} ${toBengaliNumerals(tithiNumber)}, ${toBengaliNumerals(skippedTithi)}`
    : `${manipuriMonthBengali}-${toBengaliNumerals(tithiNumber)}`;
  const manipuriTithiStrMeetei = isDualTithi
    ? `${manipuriMonthMeetei} ${toMeeteiNumerals(tithiNumber)}, ${toMeeteiNumerals(skippedTithi)}`
    : `${manipuriMonthMeetei}-${toMeeteiNumerals(tithiNumber)}`;
  const manipuriTithiStrBlipi = isDualTithi
    ? `${manipuriMonthBlipi} ${tithiNumber}, ${skippedTithi}`
    : `${manipuriMonthBlipi}-${tithiNumber}`;

  // Weekday
  const weekdayIdx = dObj.getDay();
  const weekdayObj = WEEKDAYS_MANIPURI[weekdayIdx];
  const weekdayBlipi = WEEKDAYS_BLIPI[weekdayIdx] || 'yumSe~kS';

  // 3. Lagna Rise & Lagna Set
  const sunRashiIdx = Math.floor(sunLong / 30) % 12;
  const lagnaRiseRashiIdx = sunRashiIdx;
  const lagnaSetRashiIdx = (sunRashiIdx + 6) % 12;

  const lagnaRiseElapsed = (sunLong % 30) * (2 / 30);
  const lagnaRiseDPB = hoursToDandaPalBipal(lagnaRiseElapsed);
  const lagnaSetDPB = hoursToDandaPalBipal(dayLengthHours - 0.5);

  // 4. Ending times for 5 Angas in Danda-Pal-Bipal from Sunrise
  const tithiEndingDPB = typeof currCalc.tithi1DPB.danda === 'number'
    ? { danda: Number(currCalc.tithi1DPB.danda), pal: Number(currCalc.tithi1DPB.pal), bipal: Number(currCalc.tithi1DPB.bipal) }
    : hoursToDandaPalBipal(currCalc.tithi1Hours);
  const tithiEndingClockDec = (sunriseDec + currCalc.tithi1Hours) % 24;

  const nakEndingDPB = typeof currCalc.nak1DPB.danda === 'number'
    ? { danda: Number(currCalc.nak1DPB.danda), pal: Number(currCalc.nak1DPB.pal), bipal: Number(currCalc.nak1DPB.bipal) }
    : hoursToDandaPalBipal(currCalc.nak1Hours);
  const nakEndingClockDec = (sunriseDec + currCalc.nak1Hours) % 24;

  const yogaEndingDPB = typeof currCalc.yoga1DPB.danda === 'number'
    ? { danda: Number(currCalc.yoga1DPB.danda), pal: Number(currCalc.yoga1DPB.pal), bipal: Number(currCalc.yoga1DPB.bipal) }
    : hoursToDandaPalBipal(currCalc.yoga1Hours);
  const yogaEndingClockDec = (sunriseDec + currCalc.yoga1Hours) % 24;

  const karanaComplPct = (((panchang.fiveAngas.tithi.completionPct || 65) / 100 * 2) % 1);
  const karanaElapsedHours = Math.max(1, karanaComplPct * 12);
  const karanaEndingDPB = hoursToDandaPalBipal(karanaElapsedHours);
  const karanaEndingClockDec = (sunriseDec + karanaElapsedHours) % 24;

  // 5. Build the 3x8 Numerical Table (8 rows x 3 columns = 24 cells)
  const createTableRow = (
    labelEn: string,
    labelBengali: string,
    labelMeetei: string,
    labelBlipi: string,
    yDPB: { danda: number | string; pal: number | string; bipal: number | string },
    tDPB: { danda: number | string; pal: number | string; bipal: number | string },
    tomDPB: { danda: number | string; pal: number | string; bipal: number | string }
  ): NumericalTableRow => ({
    labelEn,
    labelBengali,
    labelMeetei,
    labelBlipi,
    danda: tDPB.danda,
    pal: tDPB.pal,
    bipal: tDPB.bipal,
    formattedEn: `${tDPB.danda} | ${tDPB.pal} | ${tDPB.bipal}`,
    formattedBengali: `${formatTableCell(tDPB.danda, 'bengali')}  ${formatTableCell(tDPB.pal, 'bengali')}  ${formatTableCell(tDPB.bipal, 'bengali')}`,
    formattedMeetei: `${formatTableCell(tDPB.danda, 'meetei')}  ${formatTableCell(tDPB.pal, 'meetei')}  ${formatTableCell(tDPB.bipal, 'meetei')}`,
    formattedBlipi: `${formatTableCell(tDPB.danda, 'blipi')}  ${formatTableCell(tDPB.pal, 'blipi')}  ${formatTableCell(tDPB.bipal, 'blipi')}`,
    yesterday: {
      danda: yDPB.danda,
      pal: yDPB.pal,
      bipal: yDPB.bipal,
      formattedExcel: `${yDPB.danda} | ${yDPB.pal} | ${yDPB.bipal}`,
      formattedBlipi: `${formatTableCell(yDPB.danda, 'blipi')}  ${formatTableCell(yDPB.pal, 'blipi')}  ${formatTableCell(yDPB.bipal, 'blipi')}`
    },
    today: {
      danda: tDPB.danda,
      pal: tDPB.pal,
      bipal: tDPB.bipal,
      formattedExcel: `${tDPB.danda} | ${tDPB.pal} | ${tDPB.bipal}`,
      formattedBlipi: `${formatTableCell(tDPB.danda, 'blipi')}  ${formatTableCell(tDPB.pal, 'blipi')}  ${formatTableCell(tDPB.bipal, 'blipi')}`
    },
    tomorrow: {
      danda: tomDPB.danda,
      pal: tomDPB.pal,
      bipal: tomDPB.bipal,
      formattedExcel: `${tomDPB.danda} | ${tomDPB.pal} | ${tomDPB.bipal}`,
      formattedBlipi: `${formatTableCell(tomDPB.danda, 'blipi')}  ${formatTableCell(tomDPB.pal, 'blipi')}  ${formatTableCell(tomDPB.bipal, 'blipi')}`
    }
  });

  const build3x8GridRows = (calc: ReturnType<typeof computeDayDPB>): {
    col1: number | string;
    col2: number | string;
    col3: number | string;
  }[] => {
    // Column 1: Weekday -> Tithi 1 -> Tithi 2 (if dual)
    const col1Vals: (number | string)[] = [
      calc.weekdayNo,       // Row 1: Weekday No.
      calc.tithiNumber,     // Row 2: Tithi 1 No.
      calc.tithi1DPB.danda, // Row 3: Tithi 1 Danda
      calc.tithi1DPB.pal,   // Row 4: Tithi 1 Pal
      calc.tithi1DPB.bipal  // Row 5: Tithi 1 Bipal
    ];
    if (calc.isDualTithi && calc.tithi2DPB) {
      col1Vals.push(calc.tithi2DPB.danda); // Tithi 2 Danda
      col1Vals.push(calc.tithi2DPB.pal);   // Tithi 2 Pal
      col1Vals.push(calc.tithi2DPB.bipal); // Tithi 2 Bipal
    }

    // Column 2: Nakshatra 1 -> Nakshatra 2 (if dual) -> Karana
    // If Nakshatra 2 is hidden, Karana is brought up right below Nakshatra 1 Bipal without empty space
    const col2Vals: (number | string)[] = [
      calc.nakshatraNo,     // Row 1: Nakshatra 1 No.
      calc.nak1DPB.danda,   // Row 2: Nakshatra 1 Danda
      calc.nak1DPB.pal,     // Row 3: Nakshatra 1 Pal
      calc.nak1DPB.bipal    // Row 4: Nakshatra 1 Bipal
    ];
    if (calc.isDualNak && calc.nak2DPB) {
      col2Vals.push(calc.nak2DPB.danda); // Nakshatra 2 Danda
      col2Vals.push(calc.nak2DPB.pal);   // Nakshatra 2 Pal
      col2Vals.push(calc.nak2DPB.bipal); // Nakshatra 2 Bipal
    }
    col2Vals.push(calc.karanaNo); // Karana brought up directly below

    // Column 3: Yoga 1 -> Yoga 2 (if dual) -> Bengali Solar Day / Sankranti
    // If Yoga 2 is hidden, Sankranti is brought up right below Yoga 1 Bipal without empty space
    const col3Vals: (number | string)[] = [
      calc.yogaNo,          // Row 1: Yoga 1 No.
      calc.yoga1DPB.danda,  // Row 2: Yoga 1 Danda
      calc.yoga1DPB.pal,    // Row 3: Yoga 1 Pal
      calc.yoga1DPB.bipal   // Row 4: Yoga 1 Bipal
    ];
    if (calc.isDualYoga && calc.yoga2DPB) {
      col3Vals.push(calc.yoga2DPB.danda); // Yoga 2 Danda
      col3Vals.push(calc.yoga2DPB.pal);   // Yoga 2 Pal
      col3Vals.push(calc.yoga2DPB.bipal); // Yoga 2 Bipal
    }
    col3Vals.push(calc.solarDay); // Sankranti / Solar Day brought up directly below

    const maxRows = Math.max(col1Vals.length, col2Vals.length, col3Vals.length);
    const rows: { col1: number | string; col2: number | string; col3: number | string }[] = [];
    for (let r = 0; r < maxRows; r++) {
      rows.push({
        col1: col1Vals[r] !== undefined ? col1Vals[r] : '',
        col2: col2Vals[r] !== undefined ? col2Vals[r] : '',
        col3: col3Vals[r] !== undefined ? col3Vals[r] : ''
      });
    }

    return rows;
  };

  const currGrid = build3x8GridRows(currCalc);
  const yestGrid = build3x8GridRows(yestCalc);
  const tomGrid = build3x8GridRows(tomCalc);

  const numericalRows: NumericalTableRow[] = currGrid.map((cRow, idx) => {
    const yRow = yestGrid[idx] || cRow;
    const tRow = tomGrid[idx] || cRow;
    const rowNum = idx + 1;
    return createTableRow(
      `Row ${rowNum}`,
      `সারি ${toBengaliNumerals(rowNum)}`,
      `ꯄꯔꯤꯡ ${toMeeteiNumerals(rowNum)}`,
      `sarxI ${rowNum}`,
      { danda: yRow.col1, pal: yRow.col2, bipal: yRow.col3 },
      { danda: cRow.col1, pal: cRow.col2, bipal: cRow.col3 },
      { danda: tRow.col1, pal: tRow.col2, bipal: tRow.col3 }
    );
  });

  // 6. Build 9 Graha Longitudes
  const planetDefs = [
    { id: 'su', nameB: 'রবি', nameM: 'ꯔꯕꯤ', nameBl: 'rib (Sun)', abbrB: 'র', abbrM: 'ꯔ', abbrBl: 'rib' },
    { id: 'mo', nameB: 'চন্দ্র', nameM: 'ꯆꯟꯗ꯭ꯔ', nameBl: 'Esam (Moon)', abbrB: 'চ', abbrM: 'ꯆ', abbrBl: 'Esam' },
    { id: 'ma', nameB: 'মঙ্গল', nameM: 'ꯃꯡꯒꯜ', nameBl: 'mOl (Mars)', abbrB: 'ম', abbrM: 'ꯃ', abbrBl: 'mOl' },
    { id: 'me', nameB: 'বুধ', nameM: 'ꯕꯨꯙ', nameBl: 'buD (Mercury)', abbrB: 'বু', abbrM: 'ꯕꯨ', abbrBl: 'buD' },
    { id: 'ju', nameB: 'বৃহস্পতি', nameM: 'ꯕ꯭ꯔꯤꯍꯁ꯭ꯄꯇꯤ', nameBl: 'b<h (Jupiter)', abbrB: 'বৃ', abbrM: 'ꯕ꯭ꯔꯤ', abbrBl: 'b<h' },
    { id: 've', nameB: 'শুক্র', nameM: 'ꯁꯨꯛꯔ', nameBl: 'su (Venus)', abbrB: 'শু', abbrM: 'ꯁꯨ', abbrBl: 'su' },
    { id: 'sa', nameB: 'শনি', nameM: 'ꯁꯅꯤ', nameBl: 'Sin (Saturn)', abbrB: 'শ', abbrM: 'ꯁ', abbrBl: 'Sin' },
    { id: 'ra', nameB: 'রাহু', nameM: 'ꯔꯥꯍꯨ', nameBl: 'ra (Rahu)', abbrB: 'রা', abbrM: 'ꯔꯥ', abbrBl: 'ra' },
    { id: 'ke', nameB: 'কেতু', nameM: 'ꯀꯦꯇꯨ', nameBl: 'Ek (Ketu)', abbrB: 'কে', abbrM: 'ꯀꯦ', abbrBl: 'Ek' },
  ];

  const bookPlanets: PanchangBookPlanet[] = planetDefs.map((def) => {
    const pData = panchang.planets?.find((p) => p.id === def.id);
    const totalLong: number = (pData && typeof pData.longitude === 'number') ? pData.longitude : (def.id === 'su' ? (sunLong ?? 45) : 45);
    const rashiIdx = Math.floor(totalLong / 30) % 12;
    const signDegTotal = totalLong % 30;
    const deg = Math.floor(signDegTotal);
    const remMin = (signDegTotal - deg) * 60;
    const min = Math.floor(remMin);
    const sec = Math.round((remMin - min) * 60) % 60;
    const nakIndex = Math.floor(totalLong / 13.333333) + 1;

    const degStrB = `${toBengaliNumerals(rashiIdx)} । ${toBengaliNumerals(deg)} । ${toBengaliNumerals(String(min).padStart(2, '0'))} । ${toBengaliNumerals(String(sec).padStart(2, '0'))}`;
    const degStrM = `${toMeeteiNumerals(rashiIdx)} । ${toMeeteiNumerals(deg)} । ${toMeeteiNumerals(String(min).padStart(2, '0'))} । ${toMeeteiNumerals(String(sec).padStart(2, '0'))}`;
    const degStrBl = `${rashiIdx} | ${deg} | ${String(min).padStart(2, '0')} | ${String(sec).padStart(2, '0')}`;
    const degStrEn = `${rashiIdx}s ${deg}° ${min}' ${sec}"`;

    // Retrograde & Combustion evaluation matching traditional panjika & qw.xlsm
    const isRetro = def.id === 'ra' || def.id === 'ke'
      ? true
      : (def.id === 'su' || def.id === 'mo'
          ? false
          : Boolean(pData?.isRetrograde || (pData?.speed !== undefined && pData.speed < 0)));

    let isComb = false;
    if (def.id !== 'su' && def.id !== 'mo' && def.id !== 'ra' && def.id !== 'ke') {
      const diffToSun = Math.abs(totalLong - (sunLong ?? 45));
      const angleToSun = diffToSun > 180 ? 360 - diffToSun : diffToSun;
      if (def.id === 'ma') isComb = angleToSun <= 17;
      else if (def.id === 'me') isComb = isRetro ? angleToSun <= 12 : angleToSun <= 14;
      else if (def.id === 'ju') isComb = isRetro ? angleToSun <= 8 : angleToSun <= 11;
      else if (def.id === 've') isComb = isRetro ? angleToSun <= 8 : angleToSun <= 10;
      else if (def.id === 'sa') isComb = isRetro ? angleToSun <= 8 : angleToSun <= 15;
    }

    const suffixesB: string[] = [];
    const suffixesM: string[] = [];
    const suffixesBl: string[] = [];
    const suffixesEn: string[] = [];

    if (isRetro) {
      suffixesB.push('(ব)');
      suffixesM.push('(ꯕ)');
      suffixesBl.push('(b)');
      suffixesEn.push('(R)');
    }
    if (isComb) {
      suffixesB.push('(c)');
      suffixesM.push('(c)');
      suffixesBl.push('(c)');
      suffixesEn.push('(C)');
    }

    const statusSuffixBengali = suffixesB.join(' ');
    const statusSuffixMeetei = suffixesM.join(' ');
    const statusSuffixBlipi = suffixesBl.join(' ');
    const statusSuffixEn = suffixesEn.join(' ');

    return {
      id: def.id,
      nameBengali: def.nameB,
      nameMeetei: def.nameM,
      nameBlipi: def.nameBl,
      abbrBengali: def.abbrB,
      abbrMeetei: def.abbrM,
      abbrBlipi: def.abbrBl,
      nakshatraIndex: nakIndex,
      rashiIndex: rashiIdx,
      rashiBengali: RASHI_NAMES_BENGALI[rashiIdx],
      rashiMeetei: RASHI_NAMES_MEETEI[rashiIdx],
      rashiBlipi: RASHI_NAMES_BLIPI[rashiIdx],
      degreeStrBengali: degStrB,
      degreeStrMeetei: degStrM,
      degreeStrBlipi: degStrBl,
      degreeStrEn: degStrEn,
      signDegree: signDegTotal,
      deg,
      min,
      sec,
      isRetrograde: isRetro,
      isCombust: isComb,
      statusSuffixBengali,
      statusSuffixMeetei,
      statusSuffixBlipi,
      statusSuffixEn
    };
  });

  // 7. Circular Janma Chakra House Placements (12 Rashis: Mesha=0 to Meena=11)
  const chakraRashiHouses = Array.from({ length: 12 }, (_, rIdx) => {
    const residentPlanets = bookPlanets
      .filter((bp) => bp.rashiIndex === rIdx)
      .map((bp) => ({
        abbrBengali: bp.abbrBengali,
        abbrMeetei: bp.abbrMeetei,
        abbrBlipi: bp.abbrBlipi,
        nakshatraNum: bp.nakshatraIndex
      }));

    return {
      rashiIndex: rIdx,
      rashiNameBengali: RASHI_NAMES_BENGALI[rIdx],
      rashiNameMeetei: RASHI_NAMES_MEETEI[rIdx],
      rashiNameBlipi: RASHI_NAMES_BLIPI[rIdx],
      planetsInHouse: residentPlanets
    };
  });

  // 8. Moon transit and Sun Pada
  const sunPada = panchang.planets?.find(p => p.id === 'su')?.nakshatraPada || 2;
  const sunNakNum = bookPlanets.find(p => p.id === 'su')?.nakshatraIndex || 4;
  const rabiPadaStrBengali = `রবি: - ${toBengaliNumerals(sunNakNum)} পাদ ${toBengaliNumerals(sunPada)} দা ।`;
  const rabiPadaStrMeetei = `ꯔꯕꯤ: - ${toMeeteiNumerals(sunNakNum)} ꯄꯥꯗ ${toMeeteiNumerals(sunPada)} ꯗꯥ ।`;
  const rabiPadaStrBlipi = `rib: - ${sunNakNum} pad ${sunPada} da |`;

  const moonData = bookPlanets.find(p => p.id === 'mo') || bookPlanets[1];

  const moonTransit = calculateMoonRashiTransit(
    dateStr,
    sunriseDec,
    tomCalc.sunriseDec,
    tzOffset
  );

  const curMoonRashiIdx = moonTransit.sunriseRashiIdx;
  const nextMoonRashiIdx = moonTransit.nextRashiIdx;

  const chandraTransitBengali = moonTransit.hasTransit
    ? `চন্দ্র: -${RASHI_NAMES_BENGALI[curMoonRashiIdx]}দা, ${formatManipuriClockTimeBengali(moonTransit.transitClockDec)} হৌখ্রগা ${RASHI_NAMES_BENGALI[nextMoonRashiIdx]}দা ।`
    : `চন্দ্র: -${RASHI_NAMES_BENGALI[curMoonRashiIdx]}দা ।`;

  const chandraTransitMeetei = moonTransit.hasTransit
    ? `ꯆꯟꯗ꯭ꯔ: -${RASHI_NAMES_MEETEI[curMoonRashiIdx]}ꯗꯥ, ${formatManipuriClockTimeMeetei(moonTransit.transitClockDec)} ꯍꯧꯈ꯭ꯔꯒꯥ ${RASHI_NAMES_MEETEI[nextMoonRashiIdx]}ꯗꯥ ।`
    : `ꯆꯟꯗ꯭ꯔ: -${RASHI_NAMES_MEETEI[curMoonRashiIdx]}ꯗꯥ ।`;

  const chandraTransitBlipi = moonTransit.hasTransit
    ? `Esam: - ${RASHI_NAMES_BLIPI[curMoonRashiIdx]}da, ${formatManipuriClockTimeBlipi(moonTransit.transitClockDec)} Eh;K_rga ${RASHI_NAMES_BLIPI[nextMoonRashiIdx]}da |`
    : `Esam: - ${RASHI_NAMES_BLIPI[curMoonRashiIdx]}da |`;

  // 9. Right Column Detailed Prose (Thaban / Tithi, Nakshatra, Yoga, Karana)
  const tithi1 = currCalc.tithiNumber;
  const mg1 = getMukhyoGounaNames(manipuriMonthCode, tithi1);
  const tithi1PartB = `${manipuriMonthBengali}-${toBengaliNumerals(tithi1)} নি পানবা, ${mg1.bengali} ${formatDPBSectionBengali(currCalc.tithi1DPB, tithiEndingClockDec)}`;
  const tithi1PartM = `${manipuriMonthMeetei}-${toMeeteiNumerals(tithi1)} ꯅꯤ ꯄꯥꯟꯕ, ${mg1.meetei} ${formatDPBSectionMeetei(currCalc.tithi1DPB, tithiEndingClockDec)}`;
  const tithi1PartBl = `${manipuriMonthBlipi}-${tithi1} nI panba, ${mg1.blipi} ${formatDPBSectionBlipi(currCalc.tithi1DPB, tithiEndingClockDec)}`;

  let thabanFullTextB = `থাবান: - ${tithi1PartB}`;
  let thabanFullTextM = `ꯊꯕꯥꯟ: - ${tithi1PartM}`;
  let thabanFullTextBl = `Taban: - ${tithi1PartBl}`;

  let thabanNameB = `${manipuriMonthBengali}-${toBengaliNumerals(tithi1)} নি পানবা`;
  let thabanNameM = `${manipuriMonthMeetei}-${toMeeteiNumerals(tithi1)} ꯅꯤ ꯄꯥꯟꯕ`;
  let thabanNameBl = `${manipuriMonthBlipi}-${tithi1} nI panba`;

  if (currCalc.isDualTithi) {
    const tithi2 = (tithi1 % 30) + 1;
    const mg2 = getMukhyoGounaNames(manipuriMonthCode, tithi2);
    const tithi2ClockDec = (sunriseDec + currCalc.tithi2Hours) % 24;
    thabanFullTextB += `; ${manipuriMonthBengali}-${toBengaliNumerals(tithi2)} নি পানবা, ${mg2.bengali} ${formatDPBSectionBengali(currCalc.tithi2DPB, tithi2ClockDec)}।`;
    thabanFullTextM += `; ${manipuriMonthMeetei}-${toMeeteiNumerals(tithi2)} ꯅꯤ ꯄꯥꯟꯕ, ${mg2.meetei} ${formatDPBSectionMeetei(currCalc.tithi2DPB, tithi2ClockDec)}।`;
    thabanFullTextBl += `; ${manipuriMonthBlipi}-${tithi2} nI panba, ${mg2.blipi} ${formatDPBSectionBlipi(currCalc.tithi2DPB, tithi2ClockDec)}|`;
    thabanNameB += `, ${manipuriMonthBengali}-${toBengaliNumerals(tithi2)} নি পানবা`;
    thabanNameM += `, ${manipuriMonthMeetei}-${toMeeteiNumerals(tithi2)} ꯅꯤ ꯄꯥꯟꯕ`;
    thabanNameBl += `, ${manipuriMonthBlipi}-${tithi2} nI panba`;
  } else {
    thabanFullTextB += '।';
    thabanFullTextM += '।';
    thabanFullTextBl += '|';
  }

  const thabanEndingClockB = formatManipuriClockTimeBengali(tithiEndingClockDec);
  const thabanEndingClockM = formatManipuriClockTimeMeetei(tithiEndingClockDec);
  const thabanEndingClockBl = formatManipuriClockTimeBlipi(tithiEndingClockDec);

  // Nakshatra
  const nak1 = currCalc.nakshatraNo;
  const nak1NameB = NAKSHATRA_NAMES_BENGALI[nak1 - 1] || 'অশ্বিনী';
  const nak1NameM = NAKSHATRA_NAMES_MEETEI[nak1 - 1] || 'ꯑꯁ꯭ꯕꯤꯅꯤ';
  const nak1NameBl = NAKSHATRA_NAMES_BLIPI[nak1 - 1] || 'AsSinI';

  let nakFullTextB = `নক্ষত্র: - ${nak1NameB} (${toBengaliNumerals(nak1)}), ${formatDPBSectionBengali(currCalc.nak1DPB, nakEndingClockDec)}`;
  let nakFullTextM = `ꯅꯛꯁꯇ꯭ꯔ: - ${nak1NameM} (${toMeeteiNumerals(nak1)}), ${formatDPBSectionMeetei(currCalc.nak1DPB, nakEndingClockDec)}`;
  let nakFullTextBl = `Twanimcak: - ${nak1NameBl} (${nak1}), ${formatDPBSectionBlipi(currCalc.nak1DPB, nakEndingClockDec)}`;

  let dualNakNameB = nak1NameB;
  let dualNakNameM = nak1NameM;
  let dualNakNameBl = nak1NameBl;

  if (currCalc.isDualNak) {
    const nak2 = (nak1 % 27) + 1;
    const nak2NameB = NAKSHATRA_NAMES_BENGALI[nak2 - 1] || '';
    const nak2NameM = NAKSHATRA_NAMES_MEETEI[nak2 - 1] || '';
    const nak2NameBl = NAKSHATRA_NAMES_BLIPI[nak2 - 1] || '';
    const nak2ClockDec = (sunriseDec + currCalc.nak2Hours) % 24;

    nakFullTextB += `; ${nak2NameB} (${toBengaliNumerals(nak2)}), ${formatDPBSectionBengali(currCalc.nak2DPB, nak2ClockDec)}।`;
    nakFullTextM += `; ${nak2NameM} (${toMeeteiNumerals(nak2)}), ${formatDPBSectionMeetei(currCalc.nak2DPB, nak2ClockDec)}।`;
    nakFullTextBl += `; ${nak2NameBl} (${nak2}), ${formatDPBSectionBlipi(currCalc.nak2DPB, nak2ClockDec)}|`;
    dualNakNameB += `, ${nak2NameB}`;
    dualNakNameM += `, ${nak2NameM}`;
    dualNakNameBl += `, ${nak2NameBl}`;
  } else {
    nakFullTextB += '।';
    nakFullTextM += '।';
    nakFullTextBl += '|';
  }

  const nakEndingClockB = formatManipuriClockTimeBengali(nakEndingClockDec);
  const nakEndingClockM = formatManipuriClockTimeMeetei(nakEndingClockDec);
  const nakEndingClockBl = formatManipuriClockTimeBlipi(nakEndingClockDec);

  // Yoga
  const yoga1 = currCalc.yogaNo;
  const yoga1NameB = YOGA_NAMES_BENGALI[yoga1 - 1] || 'বিষকুম্ভ';
  const yoga1NameM = YOGA_NAMES_MEETEI[yoga1 - 1] || 'ꯕꯤꯁꯀꯨꯃ꯭ꯚ';
  const yoga1NameBl = YOGA_NAMES_BLIPI[yoga1 - 1] || 'biSkuv';

  let yogaFullTextB = `যোগ: - ${yoga1NameB} (${toBengaliNumerals(yoga1)}), ${formatDPBSectionBengali(currCalc.yoga1DPB, yogaEndingClockDec)}`;
  let yogaFullTextM = `ꯌꯣꯒ: - ${yoga1NameM} (${toMeeteiNumerals(yoga1)}), ${formatDPBSectionMeetei(currCalc.yoga1DPB, yogaEndingClockDec)}`;
  let yogaFullTextBl = `Eyaeg: - ${yoga1NameBl} (${yoga1}), ${formatDPBSectionBlipi(currCalc.yoga1DPB, yogaEndingClockDec)}`;

  let yogaNameB = yoga1NameB;
  let yogaNameM = yoga1NameM;
  let yogaNameBl = yoga1NameBl;

  if (currCalc.isDualYoga) {
    const yoga2 = (yoga1 % 27) + 1;
    const yoga2NameB = YOGA_NAMES_BENGALI[yoga2 - 1] || '';
    const yoga2NameM = YOGA_NAMES_MEETEI[yoga2 - 1] || '';
    const yoga2NameBl = YOGA_NAMES_BLIPI[yoga2 - 1] || '';
    const yoga2ClockDec = (sunriseDec + currCalc.yoga2Hours) % 24;

    yogaFullTextB += `; ${yoga2NameB} (${toBengaliNumerals(yoga2)}), ${formatDPBSectionBengali(currCalc.yoga2DPB, yoga2ClockDec)}।`;
    yogaFullTextM += `; ${yoga2NameM} (${toMeeteiNumerals(yoga2)}), ${formatDPBSectionMeetei(currCalc.yoga2DPB, yoga2ClockDec)}।`;
    yogaFullTextBl += `; ${yoga2NameBl} (${yoga2}), ${formatDPBSectionBlipi(currCalc.yoga2DPB, yoga2ClockDec)}|`;
    yogaNameB += `, ${yoga2NameB}`;
    yogaNameM += `, ${yoga2NameM}`;
    yogaNameBl += `, ${yoga2NameBl}`;
  } else {
    yogaFullTextB += '।';
    yogaFullTextM += '।';
    yogaFullTextBl += '|';
  }

  const yogaEndingClockB = formatManipuriClockTimeBengali(yogaEndingClockDec);
  const yogaEndingClockM = formatManipuriClockTimeMeetei(yogaEndingClockDec);
  const yogaEndingClockBl = formatManipuriClockTimeBlipi(yogaEndingClockDec);

  // Karana
  const moonLongVal = panchang.planetaryState?.moonLongitude ?? (panchang.planets?.find(p => p.id === 'mo')?.longitude ?? 0);
  const sunLongVal = panchang.planetaryState?.sunLongitude ?? (panchang.planets?.find(p => p.id === 'su')?.longitude ?? 45);
  const tithiDiffDeg = (moonLongVal - sunLongVal + 360) % 360;
  const tithiDegInSign = tithiDiffDeg % 12;
  const isSecondHalf = tithiDegInSign >= 6.0;

  const sunNext = tomCalc.rawPanchang?.planets?.find(x => x.id === 'su');
  const moonNext = tomCalc.rawPanchang?.planets?.find(x => x.id === 'mo');
  let sunSpeedVal = (sunNext && typeof sunNext.longitude === 'number') ? (sunNext.longitude - sunLongVal + 360) % 360 : 0.9856;
  let moonSpeedVal = (moonNext && typeof moonNext.longitude === 'number') ? (moonNext.longitude - moonLongVal + 360) % 360 : 13.176;
  if (sunSpeedVal < 0.5 || sunSpeedVal > 1.5) sunSpeedVal = 0.9856;
  if (moonSpeedVal < 10.0 || moonSpeedVal > 16.0) moonSpeedVal = 13.176;
  const tithiRelSpeedVal = Math.max(10.5, moonSpeedVal - sunSpeedVal);

  let k1Idx: number;
  let k1Hours: number;
  let k2Idx: number;
  let k2Hours: number;
  let k3Idx: number;
  let k3Hours: number;

  if (!isSecondHalf) {
    const half1 = 2 * (tithi1 - 1);
    k1Idx = getKaranaIndex(half1);
    const remDegToHalf = 6.0 - tithiDegInSign;
    k1Hours = (remDegToHalf / tithiRelSpeedVal) * 24;

    const half2 = half1 + 1;
    k2Idx = getKaranaIndex(half2);
    k2Hours = currCalc.tithi1Hours;

    const half3 = half2 + 1;
    k3Idx = getKaranaIndex(half3);
    k3Hours = currCalc.tithi1Hours + (6.0 / tithiRelSpeedVal) * 24;
  } else {
    const half1 = 2 * (tithi1 - 1) + 1;
    k1Idx = getKaranaIndex(half1);
    k1Hours = currCalc.tithi1Hours;

    const half2 = 2 * (tithi1 % 30);
    k2Idx = getKaranaIndex(half2);
    k2Hours = currCalc.tithi1Hours + (6.0 / tithiRelSpeedVal) * 24;

    const half3 = half2 + 1;
    k3Idx = getKaranaIndex(half3);
    k3Hours = k2Hours + (6.0 / tithiRelSpeedVal) * 24;
  }

  const k1DPB = computeDPBWithExceedRule(k1Hours * 2.5);
  const k1ClockDec = (sunriseDec + k1Hours) % 24;
  const k2DPB = computeDPBWithExceedRule(k2Hours * 2.5);
  const k2ClockDec = (sunriseDec + k2Hours) % 24;
  const k3ClockDec = (sunriseDec + k3Hours) % 24;

  const k1Num = k1Idx + 1;
  const k2Num = k2Idx + 1;

  const karanaName1B = `${KARANA_NAMES_BENGALI[k1Idx]} (${toBengaliNumerals(k1Num)})`;
  const karanaName1M = `${KARANA_NAMES_MEETEI[k1Idx]} (${toMeeteiNumerals(k1Num)})`;
  const karanaName1Bl = `${KARANA_NAMES_BLIPI[k1Idx]} (${k1Num})`;

  const karanaName2B = `${KARANA_NAMES_BENGALI[k2Idx]} (${toBengaliNumerals(k2Num)})`;
  const karanaName2M = `${KARANA_NAMES_MEETEI[k2Idx]} (${toMeeteiNumerals(k2Num)})`;
  const karanaName2Bl = `${KARANA_NAMES_BLIPI[k2Idx]} (${k2Num})`;

  const karanaEndingClock1B = formatManipuriClockTimeBengali(k1ClockDec);
  const karanaEndingClock1M = formatManipuriClockTimeMeetei(k1ClockDec);
  const karanaEndingClock1Bl = formatManipuriClockTimeBlipi(k1ClockDec);

  const karanaEndingClock2B = formatManipuriClockTimeBengali(k2ClockDec);
  const karanaEndingClock2M = formatManipuriClockTimeMeetei(k2ClockDec);
  const karanaEndingClock2Bl = formatManipuriClockTimeBlipi(k2ClockDec);

  let karanaFullTextB = `করণ: - ${KARANA_NAMES_BENGALI[k1Idx]} (${toBengaliNumerals(k1Num)}), ${formatDPBSectionBengali(k1DPB, k1ClockDec)}; ${KARANA_NAMES_BENGALI[k2Idx]} (${toBengaliNumerals(k2Num)}), ${formatDPBSectionBengali(k2DPB, k2ClockDec)}।`;
  let karanaFullTextM = `ꯀꯔꯟ: - ${KARANA_NAMES_MEETEI[k1Idx]} (${toMeeteiNumerals(k1Num)}), ${formatDPBSectionMeetei(k1DPB, k1ClockDec)}; ${KARANA_NAMES_MEETEI[k2Idx]} (${toMeeteiNumerals(k2Num)}), ${formatDPBSectionMeetei(k2DPB, k2ClockDec)}।`;
  let karanaFullTextBl = `krx: - ${KARANA_NAMES_BLIPI[k1Idx]} (${k1Num}), ${formatDPBSectionBlipi(k1DPB, k1ClockDec)}; ${KARANA_NAMES_BLIPI[k2Idx]} (${k2Num}), ${formatDPBSectionBlipi(k2DPB, k2ClockDec)}|`;

  // Chandra Suddhi, Ghata Chandra, and Tara Suddhi
  const ausRashi1 = getAuspiciousRashis(curMoonRashiIdx);
  const ausRashis1B = ausRashi1.map(i => RASHI_NAMES_BENGALI[i]).join(', ');
  const ausRashis1M = ausRashi1.map(i => RASHI_NAMES_MEETEI[i]).join(', ');
  const ausRashis1Bl = ausRashi1.map(i => RASHI_NAMES_BLIPI[i]).join(', ');

  const ghata1 = getGhataChandra(curMoonRashiIdx);

  // Tara Shuddhi based on Nakshatra
  const taraNums1 = getAuspiciousNakshatras(nak1);
  const tara1B = formatAuspiciousNakshatrasBengali(taraNums1);
  const tara1M = formatAuspiciousNakshatrasMeetei(taraNums1);
  const tara1Bl = formatAuspiciousNakshatrasBlipi(taraNums1);

  const nak2 = (nak1 % 27) + 1;
  const taraNums2 = getAuspiciousNakshatras(nak2);
  const tara2B = formatAuspiciousNakshatrasBengali(taraNums2);
  const tara2M = formatAuspiciousNakshatrasMeetei(taraNums2);
  const tara2Bl = formatAuspiciousNakshatrasBlipi(taraNums2);

  let taraTextB: string;
  let taraTextM: string;
  let taraTextBl: string;

  if (currCalc.nak1Hours < 24) {
    taraTextB = `${nakEndingClockB} ফাওবা ${tara1B}, ${nakEndingClockB} হৌখ্রগা ${tara2B}`;
    taraTextM = `${nakEndingClockM} ꯐꯥꯑꯣꯕ ${tara1M}, ${nakEndingClockM} ꯍꯧꯈ꯭ꯔꯒꯥ ${tara2M}`;
    taraTextBl = `${nakEndingClockBl} faoba ${tara1Bl}, ${nakEndingClockBl} Eh;K_rga ${tara2Bl}`;
  } else {
    taraTextB = tara1B;
    taraTextM = tara1M;
    taraTextBl = tara1Bl;
  }

  let chandraSuddhiTextB: string;
  let chandraSuddhiTextM: string;
  let chandraSuddhiTextBl: string;

  let ghataChandraTextB: string;
  let ghataChandraTextM: string;
  let ghataChandraTextBl: string;

  if (moonTransit.hasTransit) {
    const ausRashi2 = getAuspiciousRashis(nextMoonRashiIdx);
    const ausRashis2B = ausRashi2.map(i => RASHI_NAMES_BENGALI[i]).join(', ');
    const ausRashis2M = ausRashi2.map(i => RASHI_NAMES_MEETEI[i]).join(', ');
    const ausRashis2Bl = ausRashi2.map(i => RASHI_NAMES_BLIPI[i]).join(', ');

    const ghata2 = getGhataChandra(nextMoonRashiIdx);
    const transitClockB = formatManipuriClockTimeBengali(moonTransit.transitClockDec);
    const transitClockM = formatManipuriClockTimeMeetei(moonTransit.transitClockDec);
    const transitClockBl = formatManipuriClockTimeBlipi(moonTransit.transitClockDec);

    chandraSuddhiTextB = `${transitClockB} ফাওবা ${ausRashis1B}, ${transitClockB} হৌখ্রগা ${ausRashis2B}`;
    chandraSuddhiTextM = `${transitClockM} ꯐꯥꯑꯣꯕ ${ausRashis1M}, ${transitClockM} ꯍꯧꯈ꯭ꯔꯒꯥ ${ausRashis2M}`;
    chandraSuddhiTextBl = `${transitClockBl} faoba ${ausRashis1Bl}, ${transitClockBl} Eh;K_rga ${ausRashis2Bl}`;

    ghataChandraTextB = ghata2.bengali;
    ghataChandraTextM = ghata2.meetei;
    ghataChandraTextBl = ghata2.blipi;
  } else {
    chandraSuddhiTextB = ausRashis1B;
    chandraSuddhiTextM = ausRashis1M;
    chandraSuddhiTextBl = ausRashis1Bl;

    ghataChandraTextB = ghata1.bengali;
    ghataChandraTextM = ghata1.meetei;
    ghataChandraTextBl = ghata1.blipi;
  }

  // 8-Part Division of Day and Night for Barabela, Kalabela, Kalaratri, Amrita Yoga, and Mahendra Yoga
  const dayPart = dayLengthHours / 8;
  const nightPart = nightLengthHours / 8;
  const weekday = dObj.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

  const formatIntervalB = (start: number, end: number) => {
    const sStr = formatManipuriClockTimeBengali(start);
    const eStr = formatManipuriClockTimeBengali(end);
    const particle = (sStr.endsWith('৩') || sStr.endsWith('৫') || sStr.endsWith('১')) ? 'তগী' : 'দগী';
    return `${sStr} ${particle} ${eStr} ফাওবা`;
  };

  const formatIntervalM = (start: number, end: number) => {
    const sStr = formatManipuriClockTimeMeetei(start);
    const eStr = formatManipuriClockTimeMeetei(end);
    const particle = (sStr.endsWith('꯳') || sStr.endsWith('꯵') || sStr.endsWith('꯱')) ? 'ꯇꯒꯤ' : 'ꯗꯒꯤ';
    return `${sStr} ${particle} ${eStr} ꯐꯥꯑꯣꯕ`;
  };

  const formatIntervalBl = (start: number, end: number) => {
    const sStr = formatManipuriClockTimeBlipi(start);
    const eStr = formatManipuriClockTimeBlipi(end);
    const particle = (sStr.endsWith('3') || sStr.endsWith('5') || sStr.endsWith('1')) ? 'tgI' : 'dgI';
    return `${sStr} ${particle} ${eStr} faoba`;
  };

  // Authentic Classical Yamardha Portions (1-indexed, 1 to 8):
  // Sunday=0, Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5, Saturday=6
  const barabelaDayPartByWeekday = [4, 7, 2, 5, 8, 3, 1];
  const kalabelaDayPartByWeekday = [5, 2, 6, 3, 7, 4, 8];
  const kalaratriNightPartByWeekday = [6, 4, 2, 7, 5, 3, 1];

  const bbPart = barabelaDayPartByWeekday[weekday];
  const kbPart = kalabelaDayPartByWeekday[weekday];
  const krPart = kalaratriNightPartByWeekday[weekday];

  const barabelaStart = (sunriseDec + (bbPart - 1) * dayPart) % 24;
  const barabelaEnd = (sunriseDec + bbPart * dayPart) % 24;

  const kalabelaStart = (sunriseDec + (kbPart - 1) * dayPart) % 24;
  const kalabelaEnd = (sunriseDec + kbPart * dayPart) % 24;

  const kalaratriStart = (sunsetDec + (krPart - 1) * nightPart) % 24;
  const kalaratriEnd = (sunsetDec + krPart * nightPart) % 24;

  const barabelaB = formatIntervalB(barabelaStart, barabelaEnd);
  const barabelaM = formatIntervalM(barabelaStart, barabelaEnd);
  const barabelaBl = formatIntervalBl(barabelaStart, barabelaEnd);

  const kalabelaB = formatIntervalB(kalabelaStart, kalabelaEnd);
  const kalabelaM = formatIntervalM(kalabelaStart, kalabelaEnd);
  const kalabelaBl = formatIntervalBl(kalabelaStart, kalabelaEnd);

  const kalaratriB = formatIntervalB(kalaratriStart, kalaratriEnd);
  const kalaratriM = formatIntervalM(kalaratriStart, kalaratriEnd);
  const kalaratriBl = formatIntervalBl(kalaratriStart, kalaratriEnd);

  // Amrita Yoga Daytime Auspicious Windows by Weekday (1-indexed start and end parts):
  const amritaYogaPartsByWeekday: [[number, number], [number, number]][] = [
    [[1, 3], [7, 8]], // Sun (BB=4, KB=5): Morning 1-3, Afternoon 7-8
    [[3, 5], [8, 8]], // Mon (KB=2, BB=7): Mid-day 3-5, Evening 8
    [[3, 5], [7, 8]], // Tue (BB=2, KB=6): Mid-day 3-5, Afternoon 7-8
    [[1, 2], [6, 8]], // Wed (KB=3, BB=5): Morning 1-2, Afternoon 6-8
    [[1, 3], [5, 6]], // Thu (KB=7, BB=8): Morning 1-3, Afternoon 5-6
    [[1, 2], [6, 8]], // Fri (BB=3, KB=4): Morning 1-2, Afternoon 6-8
    [[2, 4], [6, 7]], // Sat (BB=1, KB=8): Morning 2-4, Afternoon 6-7
  ];

  const amrParts = amritaYogaPartsByWeekday[weekday];
  const amrita1Start = (sunriseDec + (amrParts[0][0] - 1) * dayPart) % 24;
  const amrita1End = (sunriseDec + amrParts[0][1] * dayPart) % 24;
  const amrita2Start = (sunriseDec + (amrParts[1][0] - 1) * dayPart) % 24;
  const amrita2End = (sunriseDec + amrParts[1][1] * dayPart) % 24;

  const amritaYogaB = `${formatIntervalB(amrita1Start, amrita1End)}; ${formatIntervalB(amrita2Start, amrita2End)}`;
  const amritaYogaM = `${formatIntervalM(amrita1Start, amrita1End)}; ${formatIntervalM(amrita2Start, amrita2End)}`;
  const amritaYogaBl = `${formatIntervalBl(amrita1Start, amrita1End)}; ${formatIntervalBl(amrita2Start, amrita2End)}`;

  // Mahendra Yoga Dedicated Auspicious Daytime Window by Weekday (1-indexed start and end part):
  const mahendraYogaPartsByWeekday: [number, number][] = [
    [6, 6], // Sun: Part 6
    [1, 1], // Mon: Part 1
    [1, 1], // Tue: Part 1
    [4, 4], // Wed: Part 4
    [4, 4], // Thu: Part 4
    [5, 5], // Fri: Part 5
    [5, 5], // Sat: Part 5
  ];

  const mahParts = mahendraYogaPartsByWeekday[weekday];
  const mahendraStart = (sunriseDec + (mahParts[0] - 1) * dayPart) % 24;
  const mahendraEnd = (sunriseDec + mahParts[1] * dayPart) % 24;

  const mahendraYogaB = formatIntervalB(mahendraStart, mahendraEnd);
  const mahendraYogaM = formatIntervalM(mahendraStart, mahendraEnd);
  const mahendraYogaBl = formatIntervalBl(mahendraStart, mahendraEnd);

  // ─────────────────────────────────────────────────────────────
  // HU CHENBA MATAM (INAUSPICIOUS / BAD TIMING)
  // Rahu Kaal, Visha Ghati (Hu Chenba), Yama Ganda, Gulika Kaal
  // ─────────────────────────────────────────────────────────────
  // Rahu Kaal (1-indexed 8th part of daylight by weekday):
  const rahuDayPartByWeekday = [8, 2, 7, 5, 6, 4, 3];
  const rPart = rahuDayPartByWeekday[weekday];
  const rahuStart = (sunriseDec + (rPart - 1) * dayPart) % 24;
  const rahuEnd = (sunriseDec + rPart * dayPart) % 24;
  const rahuKaalB = formatIntervalB(rahuStart, rahuEnd);
  const rahuKaalM = formatIntervalM(rahuStart, rahuEnd);
  const rahuKaalBl = formatIntervalBl(rahuStart, rahuEnd);

  // Yama Ganda (1-indexed 8th part of daylight by weekday):
  const yamaDayPartByWeekday = [5, 4, 3, 2, 1, 7, 6];
  const yPart = yamaDayPartByWeekday[weekday];
  const yamaStart = (sunriseDec + (yPart - 1) * dayPart) % 24;
  const yamaEnd = (sunriseDec + yPart * dayPart) % 24;
  const yamagandaB = formatIntervalB(yamaStart, yamaEnd);
  const yamagandaM = formatIntervalM(yamaStart, yamaEnd);
  const yamagandaBl = formatIntervalBl(yamaStart, yamaEnd);

  // Gulika Kaal (1-indexed 8th part of daylight by weekday):
  const gulikaDayPartByWeekday = [7, 6, 5, 4, 3, 2, 1];
  const gPart = gulikaDayPartByWeekday[weekday];
  const gulikaStart = (sunriseDec + (gPart - 1) * dayPart) % 24;
  const gulikaEnd = (sunriseDec + gPart * dayPart) % 24;
  const gulikaKaalB = formatIntervalB(gulikaStart, gulikaEnd);
  const gulikaKaalM = formatIntervalM(gulikaStart, gulikaEnd);
  const gulikaKaalBl = formatIntervalBl(gulikaStart, gulikaEnd);

  // Visha Ghati / Varjyam (হু চেন্বা - 27 Nakshatras starting Ghati out of 60 Ghatis; span = 4 Ghatis / 1.6 hrs):
  const NAKSHATRA_VISHA_GHATIS = [
    50, 24, 30, 40, 14, 21, 30, 20, 32, 30,
    20, 18, 21, 20, 14, 14, 10, 14, 56, 24,
    20, 10, 10, 18, 16, 24, 30
  ];

  const nak1Start = (nakEndingClockDec - 24 + 48) % 24;
  const visha1Start = (nak1Start + (NAKSHATRA_VISHA_GHATIS[nak1 - 1] / 60) * 24) % 24;
  const visha1End = (visha1Start + 1.6) % 24;

  let activeVishaStart = visha1Start;
  let activeVishaEnd = visha1End;

  if (currCalc.isDualNak) {
    const nak2 = (nak1 % 27) + 1;
    const nak2Start = nakEndingClockDec;
    const visha2Start = (nak2Start + (NAKSHATRA_VISHA_GHATIS[nak2 - 1] / 60) * 24) % 24;
    const visha2End = (visha2Start + 1.6) % 24;

    const visha1ElapsedFromSunrise = (visha1Start - sunriseDec + 24) % 24;
    const visha2ElapsedFromSunrise = (visha2Start - sunriseDec + 24) % 24;
    if (visha1ElapsedFromSunrise > 20 && visha2ElapsedFromSunrise <= 20) {
      activeVishaStart = visha2Start;
      activeVishaEnd = visha2End;
    }
  }

  const vishaGhatiB = formatIntervalB(activeVishaStart, activeVishaEnd);
  const vishaGhatiM = formatIntervalM(activeVishaStart, activeVishaEnd);
  const vishaGhatiBl = formatIntervalBl(activeVishaStart, activeVishaEnd);

  const huChenbaFullB = `হু চেন্বা মতম: - রাহুকাল: ${rahuKaalB}। বিষঘটী (হু চেন্বা): ${vishaGhatiB}। যমগণ্ড: ${yamagandaB}। গুলিক কাল: ${gulikaKaalB}।`;
  const huChenbaFullM = `ꯍꯨ ꯆꯦꯟꯕ ꯃꯇꯝ: - ꯔꯥꯍꯨꯀꯥꯜ: ${rahuKaalM}꯫ ꯕꯤꯁꯘꯇꯤ (ꯍꯨ ꯆꯦꯟꯕ): ${vishaGhatiM}꯫ ꯌꯃꯒꯟꯗ: ${yamagandaM}꯫ ꯒꯨꯂꯤꯀ ꯀꯥꯜ: ${gulikaKaalM}꯫`;
  const huChenbaFullBl = `hu Eenba mtm: - raHkal: ${rahuKaalBl}| biSGtI (hu Eenba): ${vishaGhatiBl}| ymgNd: ${yamagandaBl}| guilk kal: ${gulikaKaalBl}|`;

  // ─────────────────────────────────────────────────────────────
  // 9. Thadokkadaba (Taboo / Inauspicious Periods to Renounce)
  // ─────────────────────────────────────────────────────────────
  // (a) Vishti Karana (Bhadra) Taboo
  let vishtiTabooB = '';
  let vishtiTabooM = '';
  let vishtiTabooBl = '';

  if (k1Idx === 6) {
    const endB = formatManipuriClockTimeBengali(k1ClockDec);
    const endM = formatManipuriClockTimeMeetei(k1ClockDec);
    const endBl = formatManipuriClockTimeBlipi(k1ClockDec);
    vishtiTabooB = `${endB} ফাওবা বিষ্টিগী ফত্তবা।`;
    vishtiTabooM = `${endM} ꯐꯥꯑꯣꯕ ꯕꯤꯁ꯭ꯇꯤꯒꯤ ꯐꯠꯇꯕ꯫`;
    vishtiTabooBl = `${endBl} faoba ibi&gI f\\tba|`;
  } else if (k2Idx === 6) {
    const startB = formatManipuriClockTimeBengali(k1ClockDec);
    const endB = formatManipuriClockTimeBengali(k2ClockDec);
    const startM = formatManipuriClockTimeMeetei(k1ClockDec);
    const endM = formatManipuriClockTimeMeetei(k2ClockDec);
    const startBl = formatManipuriClockTimeBlipi(k1ClockDec);
    const endBl = formatManipuriClockTimeBlipi(k2ClockDec);
    vishtiTabooB = `${startB} হৌখ্রগা ${endB} ফাওবা বিষ্টিগী ফত্তবা।`;
    vishtiTabooM = `${startM} ꯍꯧꯈ꯭ꯔꯒ ${endM} ꯐꯥꯑꯣꯕ ꯕꯤꯁ꯭ꯇꯤꯒꯤ ꯐꯠꯇꯕ꯫`;
    vishtiTabooBl = `${startBl} Eh;K_rga ${endBl} faoba ibi&gI f\\tba|`;
  } else if (k3Idx === 6 && k2Hours < 24) {
    const startB = formatManipuriClockTimeBengali(k2ClockDec);
    const endB = formatManipuriClockTimeBengali(k3ClockDec);
    const startM = formatManipuriClockTimeMeetei(k2ClockDec);
    const endM = formatManipuriClockTimeMeetei(k3ClockDec);
    const startBl = formatManipuriClockTimeBlipi(k2ClockDec);
    const endBl = formatManipuriClockTimeBlipi(k3ClockDec);
    vishtiTabooB = `${startB} হৌখ্রগা ${endB} ফাওবা বিষ্টিগী ফত্তবা।`;
    vishtiTabooM = `${startM} ꯍꯧꯈ꯭ꯔꯒ ${endM} ꯐꯥꯑꯣꯕ ꯕꯤꯁ꯭ꯇꯤꯒꯤ ꯐꯠꯇꯕ꯫`;
    vishtiTabooBl = `${startBl} Eh;K_rga ${endBl} faoba ibi&gI f\\tba|`;
  }

  // (b) Malefic Yoga Taboo (Vaidhriti, Vyatipata, Tyajya)
  let yogaTabooB = '';
  let yogaTabooM = '';
  let yogaTabooBl = '';

  const TYAJYA_HOURS: Record<number, number> = { 1: 1.2, 6: 2.4, 9: 2.0, 10: 2.4, 13: 3.6, 15: 1.2 };
  const yoga2 = (yoga1 % 27) + 1;

  const hasYogaTransit = currCalc.yoga1Hours < 24;

  if (hasYogaTransit) {
    if (yoga2 === 27) {
      const startB = formatManipuriClockTimeBengali(yogaEndingClockDec);
      const startM = formatManipuriClockTimeMeetei(yogaEndingClockDec);
      const startBl = formatManipuriClockTimeBlipi(yogaEndingClockDec);
      yogaTabooB = `${startB} হৌখ্রগা মথং নুমিৎ থোকপা ফাওবা বৈধৃতিযোগকী ফত্তবা।`;
      yogaTabooM = `${startM} ꯍꯧꯈ꯭ꯔꯒ ꯃꯊꯪ ꯅꯨꯃꯤꯠ ꯊꯣꯛꯄ ꯐꯥꯑꯣꯕ ꯕꯩꯙ꯭ꯔꯤꯇꯤꯌꯣꯒꯀꯤ ꯐꯠꯇꯕ꯫`;
      yogaTabooBl = `${startBl} Eh;K_rga mTz nuim\\ To_kpa faoba EbD<itEyaeggI f\\tba|`;
    } else if (yoga2 === 17) {
      const startB = formatManipuriClockTimeBengali(yogaEndingClockDec);
      const startM = formatManipuriClockTimeMeetei(yogaEndingClockDec);
      const startBl = formatManipuriClockTimeBlipi(yogaEndingClockDec);
      yogaTabooB = `${startB} হৌখ্রগা মথং নুমিৎ থোকপা ফাওবা ব্যতীপাতযোগকী ফত্তবা।`;
      yogaTabooM = `${startM} ꯍꯧꯈ꯭ꯔꯒ ꯃꯊꯪ ꯅꯨꯃꯤꯠ ꯊꯣꯛꯄ ꯐꯥꯑꯣꯕ ꯕ꯭ꯌꯇꯤꯄꯥꯠꯌꯣꯒꯀꯤ ꯐꯠꯇꯕ꯫`;
      yogaTabooBl = `${startBl} Eh;K_rga mTz nuim\\ To_kpa faoba b_ytipatEyaeggI f\\tba|`;
    } else if (TYAJYA_HOURS[yoga2]) {
      const span = TYAJYA_HOURS[yoga2];
      const startB = formatManipuriClockTimeBengali(yogaEndingClockDec);
      const endB = formatManipuriClockTimeBengali((yogaEndingClockDec + span) % 24);
      const startM = formatManipuriClockTimeMeetei(yogaEndingClockDec);
      const endM = formatManipuriClockTimeMeetei((yogaEndingClockDec + span) % 24);
      const startBl = formatManipuriClockTimeBlipi(yogaEndingClockDec);
      const endBl = formatManipuriClockTimeBlipi((yogaEndingClockDec + span) % 24);
      yogaTabooB = `${startB} হৌখ্রগা ${endB} ফাওবা ${YOGA_NAMES_BENGALI[yoga2 - 1]}যোগকী ফত্তবা।`;
      yogaTabooM = `${startM} ꯍꯧꯈ꯭ꯔꯒ ${endM} ꯐꯥꯑꯣꯕ ${YOGA_NAMES_MEETEI[yoga2 - 1]}ꯌꯣꯒꯀꯤ ꯐꯠꯇꯕ꯫`;
      yogaTabooBl = `${startBl} Eh;K_rga ${endBl} faoba ${YOGA_NAMES_BLIPI[yoga2 - 1]}EyaeggI f\\tba|`;
    }
  }

  if (!yogaTabooB) {
    if (yoga1 === 27) {
      const endB = formatManipuriClockTimeBengali(yogaEndingClockDec);
      const endM = formatManipuriClockTimeMeetei(yogaEndingClockDec);
      const endBl = formatManipuriClockTimeBlipi(yogaEndingClockDec);
      yogaTabooB = `অয়ুক নুমিৎ থোকপদগী ${endB} ফাওবা বৈধৃতিযোগকী ফত্তবা।`;
      yogaTabooM = `ꯑꯌꯨꯛ ꯅꯨꯃꯤꯠ ꯊꯣꯛꯄꯗꯒꯤ ${endM} ꯐꯥꯑꯣꯕ ꯕꯩꯙ꯭ꯔꯤꯇꯤꯌꯣꯒꯀꯤ ꯐꯠꯇꯕ꯫`;
      yogaTabooBl = `Ayuk nuim\\ To_kpadgI ${endBl} faoba EbD<itEyaeggI f\\tba|`;
    } else if (yoga1 === 17) {
      const endB = formatManipuriClockTimeBengali(yogaEndingClockDec);
      const endM = formatManipuriClockTimeMeetei(yogaEndingClockDec);
      const endBl = formatManipuriClockTimeBlipi(yogaEndingClockDec);
      yogaTabooB = `অয়ুক নুমিৎ থোকপদগী ${endB} ফাওবা ব্যতীপাতযোগকী ফত্তবা।`;
      yogaTabooM = `ꯑꯌꯨꯛ ꯅꯨꯃꯤꯠ ꯊꯣꯛꯄꯗꯒꯤ ${endM} ꯐꯥꯑꯣꯕ ꯕ꯭ꯌꯇꯤꯄꯥꯠꯌꯣꯒꯀꯤ ꯐꯠꯇꯕ꯫`;
      yogaTabooBl = `Ayuk nuim\\ To_kpadgI ${endBl} faoba b_ytipatEyaeggI f\\tba|`;
    } else if (TYAJYA_HOURS[yoga1]) {
      const span = Math.min(TYAJYA_HOURS[yoga1], currCalc.yoga1Hours);
      const endB = formatManipuriClockTimeBengali((sunriseDec + span) % 24);
      const endM = formatManipuriClockTimeMeetei((sunriseDec + span) % 24);
      const endBl = formatManipuriClockTimeBlipi((sunriseDec + span) % 24);
      yogaTabooB = `অয়ুক নুমিৎ থোকপদগী ${endB} ফাওবা ${YOGA_NAMES_BENGALI[yoga1 - 1]}যোগকী ফত্তবা।`;
      yogaTabooM = `ꯑꯌꯨꯛ ꯅꯨꯃꯤꯠ ꯊꯣꯛꯄꯗꯒꯤ ${endM} ꯐꯥꯑꯣꯕ ${YOGA_NAMES_MEETEI[yoga1 - 1]}ꯌꯣꯒꯀꯤ ꯐꯠꯇꯕ꯫`;
      yogaTabooBl = `Ayuk nuim\\ To_kpadgI ${endBl} faoba ${YOGA_NAMES_BLIPI[yoga1 - 1]}EyaeggI f\\tba|`;
    }
  }

  const thadokPartsB = [yogaTabooB, vishtiTabooB].filter(Boolean);
  const thadokPartsM = [yogaTabooM, vishtiTabooM].filter(Boolean);
  const thadokPartsBl = [yogaTabooBl, vishtiTabooBl].filter(Boolean);

  const thadokkadabaFullB = `থাদোক্কদবা: - ${thadokPartsB.length > 0 ? thadokPartsB.join(' ') : 'ফত্তবা লৈত্রে।'}`;
  const thadokkadabaFullM = `ꯊꯥꯗꯣꯛꯀꯗꯕ: - ${thadokPartsM.length > 0 ? thadokPartsM.join(' ') : 'ꯐꯠꯇꯕ ꯂꯩꯇ꯭ꯔꯦ꯫'}`;
  const thadokkadabaFullBl = `Tadokkdba: - ${thadokPartsBl.length > 0 ? thadokPartsBl.join(' ') : 'f\\tba lEt_re|'}`;

  // ─────────────────────────────────────────────────────────────
  // 10. Yogini Direction
  // ─────────────────────────────────────────────────────────────
  const yoginiDirectionsB = [
    'পূর্বদা (East)',
    'অগ্নিকোণদা (SE)',
    'দক্ষিণদা (South)',
    'নৈঋতকোণদা (SW)',
    'নোংচুপ্তা (West)',
    'বায়ুকোণ / কৌব্রুদা (NW)',
    'উত্তরদা (North)',
    'ঈশানকোণদা (NE)'
  ];
  const yoginiDirectionsM = [
    'ꯄꯨꯔꯕꯗꯥ (East)',
    'ꯑꯒ꯭ꯅꯤꯗꯥ (SE)',
    'ꯗꯛꯁꯤꯟꯗꯥ (South)',
    'ꯅꯩꯔꯤꯠꯇꯥ (SW)',
    'ꯅꯣꯡꯆꯨꯞꯇꯥ (West)',
    'ꯕꯥꯌꯨꯀꯣꯟ / ꯀꯧꯕ꯭ꯔꯨꯗꯥ (NW)',
    'ꯎꯠꯇꯔꯗꯥ (North)',
    'ꯏꯁꯥꯟꯗꯥ (NE)'
  ];
  const yoginiDirectionsBl = [
    'Enazepak (pub`) (East)',
    'Aig_n (SE)',
    'mKa (diTx) (South)',
    'nEh<t (SW)',
    'Enazcup (piScM) (West)',
    'bayu (Ek;b[>) (NW)',
    'Awaz (Utr) (North)',
    'h~San (NE)'
  ];

  const TITHI_YOGINI_MAP: Record<number, number> = {
    1: 0, 9: 0, 17: 0, 25: 0,   // East
    2: 6, 10: 6, 18: 6, 26: 6,  // North
    3: 1, 11: 1, 19: 1, 27: 1,  // SE
    4: 4, 12: 4, 20: 4, 28: 4,  // West
    5: 5, 13: 5, 21: 5, 29: 5,  // NW (Koubru)
    6: 2, 14: 2, 22: 2, 30: 2,  // South
    7: 5, 15: 5, 23: 5,         // NW (Koubru)
    8: 7, 16: 7, 24: 7          // NE
  };

  const yDirIdx1 = TITHI_YOGINI_MAP[tithiNumber] ?? ((tithiNumber * 3) % 8);
  const nextTithiNum = (tithiNumber % 30) + 1;
  const yDirIdx2 = TITHI_YOGINI_MAP[nextTithiNum] ?? ((yDirIdx1 + 1) % 8);

  let yoginiB: string;
  let yoginiM: string;
  let yoginiBl: string;

  const hasTithiTransit = currCalc.tithi1Hours < 24;

  if (hasTithiTransit) {
    yoginiB = `${yoginiDirectionsB[yDirIdx1]}, ${formatManipuriClockTimeBengali(tithiEndingClockDec)} হৌখ্রগা ${yoginiDirectionsB[yDirIdx2]}।`;
    yoginiM = `${yoginiDirectionsM[yDirIdx1]}, ${formatManipuriClockTimeMeetei(tithiEndingClockDec)} ꯍꯧꯈ꯭ꯔꯒ ${yoginiDirectionsM[yDirIdx2]}꯫`;
    yoginiBl = `${yoginiDirectionsBl[yDirIdx1]}, ${formatManipuriClockTimeBlipi(tithiEndingClockDec)} Eh;K_rga ${yoginiDirectionsBl[yDirIdx2]}|`;
  } else {
    yoginiB = `${yoginiDirectionsB[yDirIdx1]}।`;
    yoginiM = `${yoginiDirectionsM[yDirIdx1]}꯫`;
    yoginiBl = `${yoginiDirectionsBl[yDirIdx1]}|`;
  }

  const yoginiFullB = `যোগিনী: - ${yoginiB}`;
  const yoginiFullM = `ꯌꯣꯒꯤꯅꯤ: - ${yoginiM}`;
  const yoginiFullBl = `EyaignI: - ${yoginiBl}`;

  // ─────────────────────────────────────────────────────────────
  // 11. Shraddha Kala (Authentic Aparahna Muhurta: 7 to 10 hours after sunrise)
  // ─────────────────────────────────────────────────────────────
  const shraddhaStartDec = (sunriseDec + 7) % 24;
  const shraddhaEndDec = (sunriseDec + 10) % 24;
  const shraddhaStartB = formatManipuriClockTimeBengali(shraddhaStartDec);
  const shraddhaEndB = formatManipuriClockTimeBengali(shraddhaEndDec);
  const shraddhaStartM = formatManipuriClockTimeMeetei(shraddhaStartDec);
  const shraddhaEndM = formatManipuriClockTimeMeetei(shraddhaEndDec);
  const shraddhaStartBl = formatManipuriClockTimeBlipi(shraddhaStartDec);
  const shraddhaEndBl = formatManipuriClockTimeBlipi(shraddhaEndDec);

  const isParvana = tithiNumber === 30;
  const shraddhaTypeB = isParvana ? 'পার্বণ শ্রাদ্ধ শপিমুন' : 'একোদ্দিষ্ট শ্রাদ্ধ শপিমুন';
  const shraddhaTypeM = isParvana ? 'ꯄꯥꯔꯕꯅ ꯁ꯭ꯔꯥꯗ꯭ꯙ ꯁꯄꯤꯃꯨꯟ' : 'ꯑꯦꯀꯣꯗ꯭ꯗꯤꯁ꯭ꯠ ꯁ꯭ꯔꯥꯗ꯭ꯙ ꯁꯄꯤꯃꯨꯟ';
  const shraddhaTypeBl = isParvana ? 'parbn S[aD` Sipmun' : 'AekaidiSt S[aD` Sipmun';

  const shraddhaFullB = `শ্রাদ্ধকাল: - ${shraddhaStartB} দগী ${shraddhaEndB} ফাওবা ${shraddhaTypeB}।`;
  const shraddhaFullM = `ꯁ꯭ꯔꯥꯗ꯭ꯙꯀꯥꯜ: - ${shraddhaStartM} ꯗꯒꯤ ${shraddhaEndM} ꯐꯥꯑꯣꯕ ${shraddhaTypeM}꯫`;
  const shraddhaFullBl = `S[aD\`kal: - ${shraddhaStartBl} dgI ${shraddhaEndBl} faoba ${shraddhaTypeBl}|`;

  // Header Gregorian & Saka formatting
  const gregMonthNameB = BENGALI_MONTH_NAMES[month - 1];
  const gregMonthNameM = MEETEI_MONTH_NAMES[month - 1];
  const gregMonthNameBl = GREGORIAN_MONTHS_BLIPI[month - 1] || 'E~m';

  const gregorianFormattedB = `${toBengaliNumerals(day)}-${gregMonthNameB}, ${toBengaliNumerals(year)}, ইং`;
  const gregorianFormattedM = `${toMeeteiNumerals(day)}-${gregMonthNameM}, ${toMeeteiNumerals(year)}, ꯏꯡ`;
  const gregorianFormattedBl = `${day}-${gregMonthNameBl}, ${year}, h~z`;
  const gregorianFormattedEn = `${day}-${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month - 1]}-${year} (Eng)`;

  // Bengali Solar Month and Day (e.g. "জ্যৈষ্ঠ ২৮")
  const solarFormattedB = `${solarMonthObj.bengali} ${toBengaliNumerals(solarDay)}`;
  const solarFormattedM = `${solarMonthObj.meetei} ${toMeeteiNumerals(solarDay)}`;
  const solarFormattedBl = `${solarMonthBlipi} ${solarDay}`;

  // Authentic Indian National Calendar (Rashtriya Panchang)
  const natDate = getIndianNationalDate(year, month, day);
  const nationalB = `(ভা: ${toBengaliNumerals(natDate.day)} ${natDate.monthNameBengali})`;
  const nationalM = `(ꯚꯥ: ${toMeeteiNumerals(natDate.day)} ${natDate.monthNameMeetei})`;
  const nationalBl = `(va: ${natDate.day} ${natDate.monthNameBlipi})`;

  // Lahiri Ayanamsha (Chitra Paksha)
  const jd = getJulianDay(year, month, day, 6.0 - (tzOffset || 5.5));
  const ayanamsaDec = getAyanamsa(jd);
  const ayanDeg = Math.floor(ayanamsaDec);
  const ayanRemM = (ayanamsaDec - ayanDeg) * 60;
  const ayanMin = Math.floor(ayanRemM);
  const ayanSec = Math.round((ayanRemM - ayanMin) * 60);
  const ayanamsaObj = {
    decimal: ayanamsaDec,
    deg: ayanDeg,
    min: ayanMin,
    sec: ayanSec,
    formattedBengali: `${toBengaliNumerals(ayanDeg)}° ${toBengaliNumerals(ayanMin)}' ${toBengaliNumerals(ayanSec)}"`,
    formattedMeetei: `${toMeeteiNumerals(ayanDeg)}° ${toMeeteiNumerals(ayanMin)}' ${toMeeteiNumerals(ayanSec)}"`,
    formattedBlipi: `${ayanDeg}° ${ayanMin}' ${ayanSec}"`,
    formattedEn: `${ayanDeg}° ${ayanMin}' ${ayanSec}"`
  };

  // Full Header String: e.g. "১৩-জুন, ২০২৭, ইং নোংমাইজিং, ইঙা-১০, জ্যৈষ্ঠ ২৮, (ভা: ২৩ জ্যৈষ্ঠ) শকাব্দ ১৯৪৯।"
  const fullHeaderB = `${gregorianFormattedB} ${weekdayObj.bengali}, ${manipuriTithiStrBengali}, ${solarFormattedB}, ${nationalB} শকাব্দ ${toBengaliNumerals(natDate.sakaYear)}।`;
  const fullHeaderM = `${gregorianFormattedM} ${weekdayObj.meetei}, ${manipuriTithiStrMeetei}, ${solarFormattedM}, ${nationalM} ꯁꯀꯥꯕ꯭ꯗ ${toMeeteiNumerals(natDate.sakaYear)}꯫`;
  const fullHeaderBl = `${gregorianFormattedBl} ${weekdayBlipi}, ${manipuriTithiStrBlipi}, ${solarFormattedBl}, ${nationalBl} skabd ${natDate.sakaYear}|`;

  // ─────────────────────────────────────────────────────────────
  // 10. Dasha, Gana, Varna (Authentic Dynamic Calculation)
  // ─────────────────────────────────────────────────────────────
  const moonLongAtSunrise = panchang.planetaryState?.moonLongitude ?? 
    (panchang.planets?.find(p => p.id === 'mo')?.longitude ?? 0);
  const moonNavSignIdx = Math.floor((((moonLongAtSunrise % 360) + 360) % 360) / (360 / 108)) % 12;
  const amshaLordB = NAVAMSHA_LORDS_BENGALI[moonNavSignIdx];
  const amshaLordM = NAVAMSHA_LORDS_MEETEI[moonNavSignIdx];
  const amshaLordBl = NAVAMSHA_LORDS_BLIPI[moonNavSignIdx];

  const vimIdx1 = (nak1 - 1) % 9;
  const vimIdx2 = (nak2 - 1) % 9;
  const vimLord1B = VIMSHOTTARI_LORDS_BENGALI[vimIdx1];
  const vimLord1M = VIMSHOTTARI_LORDS_MEETEI[vimIdx1];
  const vimLord1Bl = VIMSHOTTARI_LORDS_BLIPI[vimIdx1];
  const vimLord2B = VIMSHOTTARI_LORDS_BENGALI[vimIdx2];
  const vimLord2M = VIMSHOTTARI_LORDS_MEETEI[vimIdx2];
  const vimLord2Bl = VIMSHOTTARI_LORDS_BLIPI[vimIdx2];

  const yoginiIdx1 = (nak1 + 3) % 8;
  const yoginiIdx2 = (nak2 + 3) % 8;
  const yogini1B = YOGINI_NAMES_BENGALI[yoginiIdx1];
  const yogini1M = YOGINI_NAMES_MEETEI[yoginiIdx1];
  const yogini1Bl = YOGINI_NAMES_BLIPI[yoginiIdx1];
  const yogini2B = YOGINI_NAMES_BENGALI[yoginiIdx2];
  const yogini2M = YOGINI_NAMES_MEETEI[yoginiIdx2];
  const yogini2Bl = YOGINI_NAMES_BLIPI[yoginiIdx2];

  const gana1Idx = NAKSHATRA_GANA_BASE[(nak1 - 1) % 27];
  const gana2Idx = NAKSHATRA_GANA_BASE[(nak2 - 1) % 27];
  const gana1B = GANA_NAMES_BENGALI[gana1Idx];
  const gana1M = GANA_NAMES_MEETEI[gana1Idx];
  const gana1Bl = GANA_NAMES_BLIPI[gana1Idx];
  const gana2B = GANA_NAMES_BENGALI[gana2Idx];
  const gana2M = GANA_NAMES_MEETEI[gana2Idx];
  const gana2Bl = GANA_NAMES_BLIPI[gana2Idx];

  const rashiVarna1Idx = RASHI_VARNA_BASE[curMoonRashiIdx];
  const rashiVarna2Idx = RASHI_VARNA_BASE[nextMoonRashiIdx];
  const nakVarna1Idx = NAKSHATRA_VARNA_BASE[(nak1 - 1) % 27];
  const nakVarna2Idx = NAKSHATRA_VARNA_BASE[(nak2 - 1) % 27];

  const rashiVarna1B = VARNA_NAMES_BENGALI[rashiVarna1Idx];
  const rashiVarna1M = VARNA_NAMES_MEETEI[rashiVarna1Idx];
  const rashiVarna1Bl = VARNA_NAMES_BLIPI[rashiVarna1Idx];
  const nakVarna1B = VARNA_NAMES_BENGALI[nakVarna1Idx];
  const nakVarna1M = VARNA_NAMES_MEETEI[nakVarna1Idx];
  const nakVarna1Bl = VARNA_NAMES_BLIPI[nakVarna1Idx];

  const rashiVarna2B = VARNA_NAMES_BENGALI[rashiVarna2Idx];
  const rashiVarna2M = VARNA_NAMES_MEETEI[rashiVarna2Idx];
  const rashiVarna2Bl = VARNA_NAMES_BLIPI[rashiVarna2Idx];
  const nakVarna2B = VARNA_NAMES_BENGALI[nakVarna2Idx];
  const nakVarna2M = VARNA_NAMES_MEETEI[nakVarna2Idx];
  const nakVarna2Bl = VARNA_NAMES_BLIPI[nakVarna2Idx];

  const hasNakTransit = currCalc.nak1Hours < 24;

  let dashaStrB = `দশা অংশ: - ${amshaLordB}; বিং: - ${vimLord1B}; য়ো: - ${yogini1B}`;
  let dashaStrM = `ꯗꯁꯥ ꯑꯡꯁ: - ${amshaLordM}; ꯕꯤꯡ: - ${vimLord1M}; ꯌꯣ: - ${yogini1M}`;
  let dashaStrBl = `dSa AzS: - ${amshaLordBl}; ibz: - ${vimLord1Bl}; Eya: - ${yogini1Bl}`;

  if (hasNakTransit) {
    dashaStrB += `; ${nakEndingClockB} হৌখ্রগা ${vimLord2B}/${yogini2B}।`;
    dashaStrM += `; ${nakEndingClockM} ꯍꯧꯈ꯭ꯔꯒꯥ ${vimLord2M}/${yogini2M}꯫`;
    dashaStrBl += `; ${nakEndingClockBl} Eh;K_rga ${vimLord2Bl}/${yogini2Bl}|`;
  } else {
    dashaStrB += '।';
    dashaStrM += '꯫';
    dashaStrBl += '|';
  }

  let ganaStrB = `গণ: - ${gana1B}`;
  let ganaStrM = `ꯒꯟ: - ${gana1M}`;
  let ganaStrBl = `gna: - ${gana1Bl}`;

  if (hasNakTransit && gana1Idx !== gana2Idx) {
    ganaStrB += `, ${nakEndingClockB} হৌখ্রগা ${gana2B}।`;
    ganaStrM += `, ${nakEndingClockM} ꯍꯧꯈ꯭ꯔꯒꯥ ${gana2M}꯫`;
    ganaStrBl += `, ${nakEndingClockBl} Eh;K_rga ${gana2Bl}|`;
  } else {
    ganaStrB += '।';
    ganaStrM += '꯫';
    ganaStrBl += '|';
  }

  let varnaStrB: string;
  let varnaStrM: string;
  let varnaStrBl: string;

  if (moonTransit.hasTransit) {
    const transitClockB = formatManipuriClockTimeBengali(moonTransit.transitClockDec);
    const transitClockM = formatManipuriClockTimeMeetei(moonTransit.transitClockDec);
    const transitClockBl = formatManipuriClockTimeBlipi(moonTransit.transitClockDec);

    varnaStrB = `বর্ণ: - ${rashiVarna1B}/${nakVarna1B}, ${transitClockB} হৌখ্রগা ${rashiVarna2B}/${hasNakTransit ? nakVarna2B : nakVarna1B}।`;
    varnaStrM = `ꯕꯔꯟ: - ${rashiVarna1M}/${nakVarna1M}, ${transitClockM} ꯍꯧꯈ꯭ꯔꯒꯥ ${rashiVarna2M}/${hasNakTransit ? nakVarna2M : nakVarna1M}꯫`;
    varnaStrBl = `brna: - ${rashiVarna1Bl}/${nakVarna1Bl}, ${transitClockBl} Eh;K_rga ${rashiVarna2Bl}/${hasNakTransit ? nakVarna2Bl : nakVarna1Bl}|`;
  } else {
    varnaStrB = `বর্ণ: - ${rashiVarna1B}/${nakVarna1B}।`;
    varnaStrM = `ꯕꯔꯟ: - ${rashiVarna1M}/${nakVarna1M}꯫`;
    varnaStrBl = `brna: - ${rashiVarna1Bl}/${nakVarna1Bl}|`;
  }

  const dashaGanaVarnaFullB = `${dashaStrB} ${ganaStrB} ${varnaStrB}`;
  const dashaGanaVarnaFullM = `${dashaStrM} ${ganaStrM} ${varnaStrM}`;
  const dashaGanaVarnaFullBl = `${dashaStrBl} ${ganaStrBl} ${varnaStrBl}`;

  return {
    dateStr,
    lat,
    lng,
    locationName,
    header: {
      ayanamsa: ayanamsaObj,
      gregorianDay: day,
      gregorianMonthNameBengali: gregMonthNameB,
      gregorianMonthNameMeetei: gregMonthNameM,
      gregorianMonthNameBlipi: gregMonthNameBl,
      gregorianYear: year,
      gregorianFormattedBengali: gregorianFormattedB,
      gregorianFormattedMeetei: gregorianFormattedM,
      gregorianFormattedBlipi: gregorianFormattedBl,
      gregorianFormattedEn,
      weekdayBengali: weekdayObj.bengali,
      weekdayMeetei: weekdayObj.meetei,
      weekdayBlipi,
      weekdayEn: weekdayObj.en,
      manipuriMonthCode,
      manipuriMonthBengali,
      manipuriMonthMeetei,
      manipuriMonthBlipi,
      manipuriMonthEn,
      manipuriTithiNum: tithiNumber,
      manipuriTithiStrBengali,
      manipuriTithiStrMeetei,
      manipuriTithiStrBlipi,
      solarMonthNameBengali: solarMonthObj.bengali,
      solarMonthNameMeetei: solarMonthObj.meetei,
      solarMonthNameBlipi: solarMonthBlipi,
      solarMonthNameEn: solarMonthObj.en,
      solarDay,
      solarMonthFormattedBengali: solarFormattedB,
      solarMonthFormattedMeetei: solarFormattedM,
      solarMonthFormattedBlipi: solarFormattedBl,
      nationalDateBengali: nationalB,
      nationalDateMeetei: nationalM,
      nationalDateBlipi: nationalBl,
      sakabda: natDate.sakaYear,
      sakabdaBengali: `শকাব্দ ${toBengaliNumerals(natDate.sakaYear)}`,
      sakabdaMeetei: `ꯁꯀꯥꯕ꯭ꯗ ${toMeeteiNumerals(natDate.sakaYear)}`,
      sakabdaBlipi: `skabd ${natDate.sakaYear}`,
      fullHeaderBengali: fullHeaderB,
      fullHeaderMeetei: fullHeaderM,
      fullHeaderBlipi: fullHeaderBl
    },
    astronomical: {
      sunriseTimeStr: panchang.sunMoonTimings.sunrise,
      sunriseBengali: `নু: থো: পুং ${formatPungBengali(sunriseDec)} ।`,
      sunriseMeetei: `ꯅꯨ: ꯊꯣ: ꯄꯨꯡ ${formatPungMeetei(sunriseDec)} ।`,
      sunriseBlipi: `nu: To: puz ${formatPungBlipi(sunriseDec)} |`,
      sunsetTimeStr: panchang.sunMoonTimings.sunset,
      sunsetBengali: `নু: তা: পুং ${formatPungBengali(sunsetDec)} ।`,
      sunsetMeetei: `ꯅꯨ: ꯇꯥ: ꯄꯨꯡ ${formatPungMeetei(sunsetDec)} ।`,
      sunsetBlipi: `nu: ta: puz ${formatPungBlipi(sunsetDec)} |`,
      dayDurationDPB,
      dayDurationBengali: `অঙানবা দং: ${formatDPBBengali(dayDurationDPB)} ।`,
      dayDurationMeetei: `ꯑꯉꯥꯟꯕ ꯗꯡ: ${formatDPBMeetei(dayDurationDPB)} ।`,
      dayDurationBlipi: `AZanba dZ: ${formatDPBBlipi(dayDurationDPB)} |`,
      nightDurationDPB,
      nightDurationBengali: `অহিং দং: ${formatDPBBengali(nightDurationDPB)} ।`,
      nightDurationMeetei: `ꯑꯍꯤꯡ ꯗꯡ: ${formatDPBMeetei(nightDurationDPB)} ।`,
      nightDurationBlipi: `AihZ dZ: ${formatDPBBlipi(nightDurationDPB)} |`,
      lagnaRise: {
        rashiIndex: lagnaRiseRashiIdx,
        rashiBengali: RASHI_NAMES_BENGALI[lagnaRiseRashiIdx],
        rashiMeetei: RASHI_NAMES_MEETEI[lagnaRiseRashiIdx],
        rashiBlipi: RASHI_NAMES_BLIPI[lagnaRiseRashiIdx],
        dpb: lagnaRiseDPB,
        formattedBengali: `লং থো: ${RASHI_NAMES_BENGALI[lagnaRiseRashiIdx]}, দং ${formatDPBBengali(lagnaRiseDPB)} ।`,
        formattedMeetei: `ꯂꯡ ꯊꯣ: ${RASHI_NAMES_MEETEI[lagnaRiseRashiIdx]}, ꯗꯡ ${formatDPBMeetei(lagnaRiseDPB)} ।`,
        formattedBlipi: `lz To: ${RASHI_NAMES_BLIPI[lagnaRiseRashiIdx]}, dZ: ${formatDPBBlipi(lagnaRiseDPB)} |`
      },
      lagnaSet: {
        rashiIndex: lagnaSetRashiIdx,
        rashiBengali: RASHI_NAMES_BENGALI[lagnaSetRashiIdx],
        rashiMeetei: RASHI_NAMES_MEETEI[lagnaSetRashiIdx],
        rashiBlipi: RASHI_NAMES_BLIPI[lagnaSetRashiIdx],
        dpb: lagnaSetDPB,
        formattedBengali: `লং অ: ${RASHI_NAMES_BENGALI[lagnaSetRashiIdx]}, দং ${formatDPBBengali(lagnaSetDPB)} ।`,
        formattedMeetei: `ꯂꯡ ꯑ: ${RASHI_NAMES_MEETEI[lagnaSetRashiIdx]}, ꯗꯡ ${formatDPBMeetei(lagnaSetDPB)} ।`,
        formattedBlipi: `lz A: ${RASHI_NAMES_BLIPI[lagnaSetRashiIdx]}, dZ: ${formatDPBBlipi(lagnaSetDPB)} |`
      },
      numericalTable: {
        headers: {
          col1: { en: '1 (Danda)', bengali: '১ (দণ্ড)', meetei: '꯱ (ꯗꯟꯗ)', blipi: '1 (dZ:)' },
          col2: { en: '2 (Pal)', bengali: '২ (পল)', meetei: '꯲ (ꯄꯜ)', blipi: '2 (p:)' },
          col3: { en: '3 (Bipal)', bengali: '৩ (বিপল)', meetei: '꯳ (ꯕꯤꯄꯜ)', blipi: '3 (ib:)' }
        },
        rows: numericalRows
      },
      rabiPadaStrBengali,
      rabiPadaStrMeetei,
      rabiPadaStrBlipi,
      chandraTransitBengali,
      chandraTransitMeetei,
      chandraTransitBlipi,
      moonTransit,
      planets: bookPlanets,
      chakraRashiHouses
    },
    details: {
      thaban: {
        nameBengali: thabanNameB,
        nameMeetei: thabanNameM,
        nameBlipi: thabanNameBl,
        lunarMonthAnnotationBengali: mg1.bengali,
        lunarMonthAnnotationMeetei: mg1.meetei,
        lunarMonthAnnotationBlipi: mg1.blipi,
        dpb: tithiEndingDPB,
        endingClockBengali: thabanEndingClockB,
        endingClockMeetei: thabanEndingClockM,
        endingClockBlipi: thabanEndingClockBl,
        fullTextBengali: thabanFullTextB,
        fullTextMeetei: thabanFullTextM,
        fullTextBlipi: thabanFullTextBl
      },
      nakshatra: {
        nameBengali: dualNakNameB,
        nameMeetei: dualNakNameM,
        nameBlipi: dualNakNameBl,
        nakshatraNum: nak1,
        dpb: nakEndingDPB,
        endingClockBengali: nakEndingClockB,
        endingClockMeetei: nakEndingClockM,
        endingClockBlipi: nakEndingClockBl,
        fullTextBengali: nakFullTextB,
        fullTextMeetei: nakFullTextM,
        fullTextBlipi: nakFullTextBl
      },
      yoga: {
        nameBengali: yogaNameB,
        nameMeetei: yogaNameM,
        nameBlipi: yogaNameBl,
        yogaNum: yoga1,
        dpb: yogaEndingDPB,
        endingClockBengali: yogaEndingClockB,
        endingClockMeetei: yogaEndingClockM,
        endingClockBlipi: yogaEndingClockBl,
        fullTextBengali: yogaFullTextB,
        fullTextMeetei: yogaFullTextM,
        fullTextBlipi: yogaFullTextBl
      },
      karana: {
        name1Bengali: karanaName1B,
        name1Meetei: karanaName1M,
        name1Blipi: karanaName1Bl,
        endingClock1Bengali: karanaEndingClock1B,
        endingClock1Meetei: karanaEndingClock1M,
        endingClock1Blipi: karanaEndingClock1Bl,
        name2Bengali: karanaName2B,
        name2Meetei: karanaName2M,
        name2Blipi: karanaName2Bl,
        endingClock2Bengali: karanaEndingClock2B,
        endingClock2Meetei: karanaEndingClock2M,
        endingClock2Blipi: karanaEndingClock2Bl,
        fullTextBengali: karanaFullTextB,
        fullTextMeetei: karanaFullTextM,
        fullTextBlipi: karanaFullTextBl
      },
      chandraSuddhi: {
        auspiciousRashisBengali: chandraSuddhiTextB,
        auspiciousRashisMeetei: chandraSuddhiTextM,
        auspiciousRashisBlipi: chandraSuddhiTextBl,
        ghataChandraBengali: ghataChandraTextB,
        ghataChandraMeetei: ghataChandraTextM,
        ghataChandraBlipi: ghataChandraTextBl,
        taraSuddhiBengali: taraTextB,
        taraSuddhiMeetei: taraTextM,
        taraSuddhiBlipi: taraTextBl,
        pokpaRashiBengali: moonTransit.hasTransit
          ? `${RASHI_NAMES_BENGALI[curMoonRashiIdx]} রাশি, ${formatManipuriClockTimeBengali(moonTransit.transitClockDec)} হৌখ্রগা ${RASHI_NAMES_BENGALI[nextMoonRashiIdx]} রাশি`
          : `${RASHI_NAMES_BENGALI[curMoonRashiIdx]} রাশি`,
        pokpaRashiMeetei: moonTransit.hasTransit
          ? `${RASHI_NAMES_MEETEI[curMoonRashiIdx]} ꯔꯥꯁꯤ, ${formatManipuriClockTimeMeetei(moonTransit.transitClockDec)} ꯍꯧꯈ꯭ꯔꯒꯥ ${RASHI_NAMES_MEETEI[nextMoonRashiIdx]} ꯔꯥꯁꯤ`
          : `${RASHI_NAMES_MEETEI[curMoonRashiIdx]} ꯔꯥꯁꯤ`,
        pokpaRashiBlipi: moonTransit.hasTransit
          ? `${RASHI_NAMES_BLIPI[curMoonRashiIdx]} raiS, ${formatManipuriClockTimeBlipi(moonTransit.transitClockDec)} Eh;K_rga ${RASHI_NAMES_BLIPI[nextMoonRashiIdx]} raiS`
          : `${RASHI_NAMES_BLIPI[curMoonRashiIdx]} raiS`,
        fullTextBengali: `চন্দ্রশুদ্ধি: - ${chandraSuddhiTextB}। ঘাতচন্দ্র: - ${ghataChandraTextB}। তারাশুদ্ধি: - ${taraTextB}; পোকপা: - ${
          moonTransit.hasTransit
            ? `${RASHI_NAMES_BENGALI[curMoonRashiIdx]} রাশি, ${formatManipuriClockTimeBengali(moonTransit.transitClockDec)} হৌখ্রগা ${RASHI_NAMES_BENGALI[nextMoonRashiIdx]} রাশি`
            : `${RASHI_NAMES_BENGALI[curMoonRashiIdx]} রাশি`
        }।`,
        fullTextMeetei: `ꯆꯟꯗ꯭ꯔꯁꯨꯗ꯭ꯙꯤ: - ${chandraSuddhiTextM}꯫ ꯘꯥꯇꯆꯟꯗ꯭ꯔ: - ${ghataChandraTextM}꯫ ꯇꯥꯔꯥꯁꯨꯗ꯭ꯙꯤ: - ${taraTextM}; ꯄꯣꯛꯄ: - ${
          moonTransit.hasTransit
            ? `${RASHI_NAMES_MEETEI[curMoonRashiIdx]} ꯔꯥꯁꯤ, ${formatManipuriClockTimeMeetei(moonTransit.transitClockDec)} ꯍꯧꯈ꯭ꯔꯒꯥ ${RASHI_NAMES_MEETEI[nextMoonRashiIdx]} ꯔꯥꯁꯤ`
            : `${RASHI_NAMES_MEETEI[curMoonRashiIdx]} ꯔꯥꯁꯤ`
        }꯫`,
        fullTextBlipi: `cnd[suidD: - ${chandraSuddhiTextBl}| Gat cnd[: - ${ghataChandraTextBl}| tara suidD: - ${taraTextBl}; Epakpa: - ${
          moonTransit.hasTransit
            ? `${RASHI_NAMES_BLIPI[curMoonRashiIdx]} raiS, ${formatManipuriClockTimeBlipi(moonTransit.transitClockDec)} Eh;K_rga ${RASHI_NAMES_BLIPI[nextMoonRashiIdx]} raiS`
            : `${RASHI_NAMES_BLIPI[curMoonRashiIdx]} raiS`
        }|`
      },
      taraSuddhi: {
        nakshatrasBengali: taraTextB,
        nakshatrasMeetei: taraTextM,
        nakshatrasBlipi: taraTextBl,
        fullTextBengali: `তারাশুদ্ধি: - ${taraTextB};`,
        fullTextMeetei: `ꯇꯥꯔꯥꯁꯨꯗ꯭ꯙꯤ: - ${taraTextM};`,
        fullTextBlipi: `tara suidD: - ${taraTextBl};`
      },
      dashaGanaVarna: {
        dashaLordBengali: amshaLordB,
        vimsottariBengali: hasNakTransit ? `${vimLord1B} / ${vimLord2B}` : vimLord1B,
        yoginiBengali: hasNakTransit ? `${yogini1B} / ${yogini2B}` : yogini1B,
        ganaBengali: hasNakTransit && gana1Idx !== gana2Idx ? `${gana1B} / ${gana2B}` : gana1B,
        varnaBengali: moonTransit.hasTransit ? `${rashiVarna1B}/${nakVarna1B} → ${rashiVarna2B}/${hasNakTransit ? nakVarna2B : nakVarna1B}` : `${rashiVarna1B} / ${nakVarna1B}`,
        fullTextBengali: dashaGanaVarnaFullB,
        fullTextMeetei: dashaGanaVarnaFullM,
        fullTextBlipi: dashaGanaVarnaFullBl
      },
      amritaYoga: {
        timingsBengali: amritaYogaB,
        timingsMeetei: amritaYogaM,
        timingsBlipi: amritaYogaBl,
        fullTextBengali: `অমৃতযোগ: - ${amritaYogaB}।`,
        fullTextMeetei: `ꯑꯃ꯭ꯔꯤꯇꯌꯣꯒ: - ${amritaYogaM}꯫`,
        fullTextBlipi: `Am<t Eyaeg: - ${amritaYogaBl}|`
      },
      mahendraYoga: {
        timingsBengali: mahendraYogaB,
        timingsMeetei: mahendraYogaM,
        timingsBlipi: mahendraYogaBl,
        fullTextBengali: `মাহেন্দ্রযোগ: - ${mahendraYogaB}।`,
        fullTextMeetei: `ꯃꯥꯍꯦꯟꯗ꯭ꯔꯌꯣꯒ: - ${mahendraYogaM}꯫`,
        fullTextBlipi: `maEhnd[ Eyaeg: - ${mahendraYogaBl}|`,
        isAvailable: true
      },
      inauspiciousMuhurtas: {
        barabelaBengali: barabelaB,
        barabelaMeetei: barabelaM,
        barabelaBlipi: barabelaBl,
        kalabelaBengali: kalabelaB,
        kalabelaMeetei: kalabelaM,
        kalabelaBlipi: kalabelaBl,
        kalaratriBengali: kalaratriB,
        kalaratriMeetei: kalaratriM,
        kalaratriBlipi: kalaratriBl,
        fullTextBengali: `বারবেলা: - ${barabelaB}। কালবেলা: - ${kalabelaB}। কালরাত্রি: - ${kalaratriB}।`,
        fullTextMeetei: `ꯕꯥꯔꯕꯦꯂꯥ: - ${barabelaM}꯫ ꯀꯥꯂꯕꯦꯂꯥ: - ${kalabelaM}꯫ ꯀꯥꯂꯔꯥꯇ꯭ꯔꯤ: - ${kalaratriM}꯫`,
        fullTextBlipi: `barEbela: - ${barabelaBl}| kalEbela: - ${kalabelaBl}| kalrai@_: - ${kalaratriBl}|`
      },
      huChenbaMatam: {
        rahuKaalBengali: rahuKaalB,
        rahuKaalMeetei: rahuKaalM,
        rahuKaalBlipi: rahuKaalBl,
        vishaGhatiBengali: vishaGhatiB,
        vishaGhatiMeetei: vishaGhatiM,
        vishaGhatiBlipi: vishaGhatiBl,
        yamagandaBengali: yamagandaB,
        yamagandaMeetei: yamagandaM,
        yamagandaBlipi: yamagandaBl,
        gulikaKaalBengali: gulikaKaalB,
        gulikaKaalMeetei: gulikaKaalM,
        gulikaKaalBlipi: gulikaKaalBl,
        fullTextBengali: huChenbaFullB,
        fullTextMeetei: huChenbaFullM,
        fullTextBlipi: huChenbaFullBl
      },
      thadokkadaba: {
        yogaTabooBengali: yogaTabooB,
        yogaTabooMeetei: yogaTabooM,
        yogaTabooBlipi: yogaTabooBl,
        vishtiTabooBengali: vishtiTabooB,
        vishtiTabooMeetei: vishtiTabooM,
        vishtiTabooBlipi: vishtiTabooBl,
        fullTextBengali: thadokkadabaFullB,
        fullTextMeetei: thadokkadabaFullM,
        fullTextBlipi: thadokkadabaFullBl
      },
      yogini: {
        directionBengali: yoginiB,
        directionMeetei: yoginiM,
        directionBlipi: yoginiBl,
        fullTextBengali: yoginiFullB,
        fullTextMeetei: yoginiFullM,
        fullTextBlipi: yoginiFullBl
      },
      shraddhaKala: {
        fullTextBengali: shraddhaFullB,
        fullTextMeetei: shraddhaFullM,
        fullTextBlipi: shraddhaFullBl
      },
      afabaThouram: (() => {
        const thouramEval = evaluateSubhaKarmaThourams({
          tithiNumber,
          nakshatraIndex: (panchang.fiveAngas.nakshatra.index || 20) + 1,
          weekdayIndex: dObj.getDay(),
          sunriseDec,
          sunsetDec,
          karanaEndingClockDec,
          lagnaRashiIndex: lagnaRiseRashiIdx,
          yogaIndex: (yoga1 === 27 || yoga2 === 27) ? 27 : (yoga1 === 17 || yoga2 === 17) ? 17 : yoga1,
          isVishtiToday: (k1Idx === 6 || k2Idx === 6 || k3Idx === 6)
        });
        return {
          fullTextBengali: thouramEval.fullTextBengali,
          fullTextMeetei: thouramEval.fullTextMeetei,
          fullTextBlipi: thouramEval.fullTextBlipi,
          grahaPuja: thouramEval.grahaPuja,
          evaluation: thouramEval
        };
      })()
    },
    rawPanchang: panchang
  };
}
