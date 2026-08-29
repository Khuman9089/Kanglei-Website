import { getNakshatraInfo } from './nakshatras';

export interface PanchangaDetails {
  sakabta: string; // e.g. "১৯৪৭ শকাব্দ"
  bangabdaYear: string; // e.g. "১৪৩১ বঙ্গাব্দ"
  bengaliMonth: string; // e.g. "বৈশাখ"
  bengaliDate: string; // e.g. "১"
  bengaliDateStr: string; // e.g. "১ বৈশাখ, ১৪৩১ বঙ্গাব্দ"
  
  // Panchanga
  tithiName: string; // e.g. "শুক্লা তৃতীয়া"
  paksha: string; // e.g. "শুক্ল পক্ষ"
  yogaName: string; // e.g. "আয়ুষ্মান"
  karanaName: string; // e.g. "বব"
  moonNakshatraName: string;
  moonNakshatraPada: number;

  // Astrological Koottas
  gana: string; // e.g. "দেব গণ"
  yoni: string; // e.g. "অশ্ব"
  nadi: string; // e.g. "আদ্য নাড়ি"
  varna: string; // e.g. "বিপ্র"
  vashya: string; // e.g. "চতুষ্পদ"

  // Dasha Balances at Birth
  vimshottariDasha: {
    lordName: string;
    lordBengali: string;
    totalYears: number;
    years: number;
    months: number;
    days: number;
    hours: number;
    formattedString: string; // e.g. "বৃহস্পতির দশা ভোগ ০১।০১।২৫।১৫"
  };
  ashtottariDasha: {
    lordName: string;
    lordBengali: string;
    totalYears: number;
    years: number;
    months: number;
    days: number;
    hours: number;
    formattedString: string; // e.g. "শুক্রর দশা ভোগ ০২।০৪।১২।০৮"
  };
  yoginiDasha: {
    name: string;
    nameBengali: string;
    rulerPlanet: string;
    totalYears: number;
    years: number;
    months: number;
    days: number;
    hours: number;
    formattedString: string; // e.g. "সংকটার দশা ভোগ ০০।০৬।১৮।১২"
  };
}

function toBengaliDigits(num: number | string): string {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bengaliNumerals[parseInt(digit)]);
}

function toBengaliDigits2(num: number): string {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const padded = String(Math.floor(Math.abs(num))).padStart(2, '0');
  return padded.replace(/[0-9]/g, (digit) => bengaliNumerals[parseInt(digit)]);
}

function getBengaliPossessive(name: string): string {
  if (name.endsWith('া') || name.endsWith('ি') || name.endsWith('ু')) {
    return name + 'র';
  }
  return name + 'ের';
}

// Bengali Solar Months Data
const BENGALI_MONTHS = [
  { name: 'বৈশাখ', startMonth: 4, startDay: 14, days: 31 },
  { name: 'জ্যৈষ্ঠ', startMonth: 5, startDay: 15, days: 31 },
  { name: 'আষাঢ়', startMonth: 6, startDay: 15, days: 31 },
  { name: 'শ্রাবণ', startMonth: 7, startDay: 16, days: 31 },
  { name: 'ভাদ্র', startMonth: 8, startDay: 17, days: 31 },
  { name: 'আশ্বিন', startMonth: 9, startDay: 17, days: 30 },
  { name: 'কার্তিক', startMonth: 10, startDay: 18, days: 30 },
  { name: 'অগ্রহায়ণ', startMonth: 11, startDay: 17, days: 30 },
  { name: 'পৌষ', startMonth: 12, startDay: 16, days: 30 },
  { name: 'মাঘ', startMonth: 1, startDay: 15, days: 30 },
  { name: 'ফাল্গুন', startMonth: 2, startDay: 13, days: 30 },
  { name: 'চৈত্র', startMonth: 3, startDay: 15, days: 30 },
];

const TITHI_NAMES = [
  'প্রথমা (প্রতিপদ)', 'দ্বিতীয়া', 'তৃতীয়া', 'চতুর্থী', 'পঞ্চমী',
  'ষষ্ঠী', 'সপ্তমী', 'অষ্টমী', 'নবমী', 'দশমী',
  'একাদশী', 'দ্বাদশী', 'ত্রয়োদশী', 'চতুর্দশী', 'পূর্ণিমা',
  'প্রথমা (প্রতিপদ)', 'দ্বিতীয়া', 'তৃতীয়া', 'চতুর্থী', 'পঞ্চমী',
  'ষষ্ঠী', 'সপ্তমী', 'অষ্টমী', 'নবমী', 'দশমী',
  'একাদশী', 'দ্বাদশী', 'ত্রয়োদশী', 'চতুর্দশী', 'অমাবস্যা'
];

const YOGA_NAMES = [
  'বিষ্কুম্ভ', 'প্রীতি', 'আয়ুষ্মান', 'সৌভাগ্য', 'শোভন', 'অতিগণ্ড', 'সুকর্মা',
  'ধৃতি', 'শূল', 'গণ্ড', 'বৃদ্ধি', 'ধ্রুব', 'ব্যাঘাত', 'হর্ষণ',
  'বজ্র', 'সিদ্ধি', 'ব্যতীপাত', 'বরীয়ান', 'পরিঘ', 'শিব', 'সিদ্ধ',
  'সাধ্য', 'শুভ', 'শুক্ল', 'ব্রহ্ম', 'ঐন্দ্র', 'বৈধৃতি'
];

const KARANA_NAMES = [
  'বব', 'বালব', 'কৌলব', 'তৈতিল', 'গরজ', 'বণিজ', 'বিষ্টি (ভদ্রা)',
  'শকুনি', 'চতুষ্পদ', 'নাগ', 'কিন্তুঘ্ন'
];

// Vimshottari Lords (9)
const VIMSHOTTARI_LORDS = [
  { name: 'Ketu', bengali: 'কেতু', years: 7 },
  { name: 'Venus', bengali: 'শুক্র', years: 20 },
  { name: 'Sun', bengali: 'রবি', years: 6 },
  { name: 'Moon', bengali: 'চন্দ্র', years: 10 },
  { name: 'Mars', bengali: 'মঙ্গল', years: 7 },
  { name: 'Rahu', bengali: 'রাহু', years: 18 },
  { name: 'Jupiter', bengali: 'বৃহস্পতি', years: 16 },
  { name: 'Saturn', bengali: 'শনি', years: 19 },
  { name: 'Mercury', bengali: 'বুধ', years: 17 },
];

// Yogini Dashas (8)
const YOGINI_DASHAS = [
  { name: 'Mangala', bengali: 'মঙ্গলা', ruler: 'চন্দ্র', years: 1 },
  { name: 'Pingala', bengali: 'পিঙ্গলা', ruler: 'রবি', years: 2 },
  { name: 'Dhanya', bengali: 'ধান্যা', ruler: 'বৃহস্পতি', years: 3 },
  { name: 'Bhramari', bengali: 'ভ্রামরী', ruler: 'মঙ্গল', years: 4 },
  { name: 'Bhadrika', bengali: 'ভদ্রিকা', ruler: 'বুধ', years: 5 },
  { name: 'Ulka', bengali: 'উল্কা', ruler: 'শনি', years: 6 },
  { name: 'Siddha', bengali: 'সিদ্ধা', ruler: 'শুক্র', years: 7 },
  { name: 'Sankata', bengali: 'সংকটা', ruler: 'রাহু', years: 8 },
];

// Ashtottari Lords Mapping (108 Years Cycle)
const ASHTOTTARI_LORDS = [
  { name: 'Sun', bengali: 'রবি', years: 6 },
  { name: 'Moon', bengali: 'চন্দ্র', years: 15 },
  { name: 'Mars', bengali: 'মঙ্গল', years: 8 },
  { name: 'Mercury', bengali: 'বুধ', years: 17 },
  { name: 'Saturn', bengali: 'শনি', years: 10 },
  { name: 'Jupiter', bengali: 'বৃহস্পতি', years: 19 },
  { name: 'Rahu', bengali: 'রাহু', years: 12 },
  { name: 'Venus', bengali: 'শুক্র', years: 21 },
];

function getAshtottariLordIndex(nakshatraIdx: number): number {
  const remapped = (nakshatraIdx + 22) % 27;
  if (remapped < 4) return 0;
  if (remapped < 7) return 1;
  if (remapped < 11) return 2;
  if (remapped < 14) return 3;
  if (remapped < 18) return 4;
  if (remapped < 21) return 5;
  if (remapped < 25) return 6;
  return 7;
}

const NAKSHATRA_ATTRIBUTES: Record<number, { gana: string; yoni: string; nadi: string; varna: string; vashya: string }> = {
  0: { gana: 'দেব গণ', yoni: 'অশ্ব (Horse)', nadi: 'আদ্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'চতুষ্পদ' },
  1: { gana: 'মনুষ্য গণ', yoni: 'গজ (Elephant)', nadi: 'মধ্য নাড়ি', varna: 'বৈশ্য', vashya: 'চতুষ্পদ' },
  2: { gana: 'রাক্ষস গণ', yoni: 'মেষ (Goat)', nadi: 'অন্ত্য নাড়ি', varna: 'ব্রাহ্মণ', vashya: 'দ্বিপদ' },
  3: { gana: 'মনুষ্য গণ', yoni: 'সর্প (Serpent)', nadi: 'আদ্য নাড়ি', varna: 'শূদ্র', vashya: 'চতুষ্পদ' },
  4: { gana: 'দেব গণ', yoni: 'সার্প (Serpent)', nadi: 'মধ্য নাড়ি', varna: 'শূদ্র', vashya: 'দ্বিপদ' },
  5: { gana: 'মনুষ্য গণ', yoni: 'শ্বান (Dog)', nadi: 'অন্ত্য নাড়ি', varna: 'শূদ্র', vashya: 'দ্বিপদ' },
  6: { gana: 'দেব গণ', yoni: 'মার্জার (Cat)', nadi: 'আদ্য নাড়ি', varna: 'বৈশ্য', vashya: 'দ্বিপদ' },
  7: { gana: 'দেব গণ', yoni: 'মেষ (Goat)', nadi: 'মধ্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'জলচর' },
  8: { gana: 'রাক্ষস গণ', yoni: 'মার্জার (Cat)', nadi: 'অন্ত্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'জলচর' },
  9: { gana: 'রাক্ষস গণ', yoni: 'মূষিক (Rat)', nadi: 'অন্ত্য নাড়ি', varna: 'শূদ্র', vashya: 'চতুষ্পদ' },
  10: { gana: 'মনুষ্য গণ', yoni: 'মূষিক (Rat)', nadi: 'মধ্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'চতুষ্পদ' },
  11: { gana: 'মনুষ্য গণ', yoni: 'গো (Cow)', nadi: 'আদ্য নাড়ি', varna: 'ব্রাহ্মণ', vashya: 'দ্বিপদ' },
  12: { gana: 'দেব গণ', yoni: 'মহিষ (Buffalo)', nadi: 'আদ্য নাড়ি', varna: 'বৈশ্য', vashya: 'দ্বিপদ' },
  13: { gana: 'রাক্ষস গণ', yoni: 'ব্যাঘ্র (Tiger)', nadi: 'মধ্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'দ্বিপদ' },
  14: { gana: 'দেব গণ', yoni: 'মহিষ (Buffalo)', nadi: 'অন্ত্য নাড়ি', varna: 'শূদ্র', vashya: 'দ্বিপদ' },
  15: { gana: 'রাক্ষস গণ', yoni: 'ব্যাঘ্র (Tiger)', nadi: 'অন্ত্য নাড়ি', varna: 'ব্রাহ্মণ', vashya: 'দ্বিপদ' },
  16: { gana: 'দেব গণ', yoni: 'মৃগ (Deer)', nadi: 'মধ্য নাড়ি', varna: 'ব্রাহ্মণ', vashya: 'দ্বিপদ' },
  17: { gana: 'রাক্ষস গণ', yoni: 'মৃগ (Deer)', nadi: 'আদ্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'কীট' },
  18: { gana: 'রাক্ষস গণ', yoni: 'শ্বান (Dog)', nadi: 'আদ্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'দ্বিপদ' },
  19: { gana: 'মনুষ্য গণ', yoni: 'বানর (Monkey)', nadi: 'মধ্য নাড়ি', varna: 'ব্রাহ্মণ', vashya: 'জলচর' },
  20: { gana: 'মনুষ্য গণ', yoni: 'নকুল (Mongoose)', nadi: 'অন্ত্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'জলচর' },
  21: { gana: 'দেব গণ', yoni: 'বানর (Monkey)', nadi: 'অন্ত্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'চতুষ্পদ' },
  22: { gana: 'রাক্ষস গণ', yoni: 'সিংহ (Lion)', nadi: 'মধ্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'চতুষ্পদ' },
  23: { gana: 'রাক্ষস গণ', yoni: 'অশ্ব (Horse)', nadi: 'আদ্য নাড়ি', varna: 'শূদ্র', vashya: 'দ্বিপদ' },
  24: { gana: 'মনুষ্য গণ', yoni: 'সিংহ (Lion)', nadi: 'আদ্য নাড়ি', varna: 'ব্রাহ্মণ', vashya: 'দ্বিপদ' },
  25: { gana: 'মনুষ্য গণ', yoni: 'গো (Cow)', nadi: 'মধ্য নাড়ি', varna: 'ক্ষত্রিয়', vashya: 'দ্বিপদ' },
  26: { gana: 'দেব গণ', yoni: 'হস্তী (Elephant)', nadi: 'অন্ত্য নাড়ি', varna: 'ব্রাহ্মণ', vashya: 'জলচর' },
};

export function calculatePanchangaDetails(
  dobStr: string,
  sunLongitude: number,
  moonLongitude: number
): PanchangaDetails {
  const date = new Date(dobStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 1. Sakabta
  const isAfterSakaNewYear = (month > 3) || (month === 3 && day >= 22);
  const sakaYear = year - (isAfterSakaNewYear ? 78 : 79);
  const sakabta = `${toBengaliDigits(sakaYear)} শকাব্দ`;

  // 2. Bangabda Year & Bengali Solar Month
  const isAfterPohelaBaisakh = (month > 4) || (month === 4 && day >= 14);
  const bangabdaVal = year - (isAfterPohelaBaisakh ? 593 : 594);
  const bangabdaYear = `${toBengaliDigits(bangabdaVal)} বঙ্গাব্দ`;

  let bMonth = BENGALI_MONTHS[0].name;
  let bDay = 1;

  if (month === 4) {
    if (day >= 14) { bMonth = 'বৈশাখ'; bDay = day - 13; }
    else { bMonth = 'চৈত্র'; bDay = day + 16; }
  } else if (month === 5) {
    if (day >= 15) { bMonth = 'জ্যৈষ্ঠ'; bDay = day - 14; }
    else { bMonth = 'বৈশাখ'; bDay = day + 17; }
  } else if (month === 6) {
    if (day >= 15) { bMonth = 'আষাঢ়'; bDay = day - 14; }
    else { bMonth = 'জ্যৈষ্ঠ'; bDay = day + 16; }
  } else if (month === 7) {
    if (day >= 16) { bMonth = 'শ্রাবণ'; bDay = day - 15; }
    else { bMonth = 'আষাঢ়'; bDay = day + 16; }
  } else if (month === 8) {
    if (day >= 17) { bMonth = 'ভাদ্র'; bDay = day - 16; }
    else { bMonth = 'শ্রাবণ'; bDay = day + 16; }
  } else if (month === 9) {
    if (day >= 17) { bMonth = 'আশ্বিন'; bDay = day - 16; }
    else { bMonth = 'ভাদ্র'; bDay = day + 15; }
  } else if (month === 10) {
    if (day >= 18) { bMonth = 'কার্তিক'; bDay = day - 17; }
    else { bMonth = 'আশ্বিন'; bDay = day + 14; }
  } else if (month === 11) {
    if (day >= 17) { bMonth = 'অগ্রহায়ণ'; bDay = day - 16; }
    else { bMonth = 'কার্তিক'; bDay = day + 13; }
  } else if (month === 12) {
    if (day >= 16) { bMonth = 'পৌষ'; bDay = day - 15; }
    else { bMonth = 'অগ্রহায়ণ'; bDay = day + 14; }
  } else if (month === 1) {
    if (day >= 15) { bMonth = 'মাঘ'; bDay = day - 14; }
    else { bMonth = 'পৌষ'; bDay = day + 16; }
  } else if (month === 2) {
    if (day >= 13) { bMonth = 'ফাল্গুন'; bDay = day - 12; }
    else { bMonth = 'মাঘ'; bDay = day + 17; }
  } else if (month === 3) {
    if (day >= 15) { bMonth = 'চৈত্র'; bDay = day - 14; }
    else { bMonth = 'ফাল্গুন'; bDay = day + 16; }
  }

  const bengaliDateStr = `${toBengaliDigits(bDay)} ${bMonth}, ${bangabdaYear}`;

  // 3. Tithi, Yoga, Karana
  const diffAngle = ((moonLongitude - sunLongitude + 360) % 360);
  const tithiIdx = Math.floor(diffAngle / 12);
  const paksha = tithiIdx < 15 ? 'শুক্ল পক্ষ' : 'কৃষ্ণ পক্ষ';
  const tithiName = `${paksha} ${TITHI_NAMES[tithiIdx]}`;

  const sumAngle = ((sunLongitude + moonLongitude) % 360);
  const yogaIdx = Math.floor(sumAngle / (360 / 27));
  const yogaName = YOGA_NAMES[yogaIdx % 27];

  const karanaIdx = Math.floor(diffAngle / 6) % 11;
  const karanaName = KARANA_NAMES[karanaIdx];

  // 4. Moon Nakshatra & Attributes
  const moonNak = getNakshatraInfo(moonLongitude);
  const moonNakshatraName = moonNak.name;
  const moonNakshatraPada = moonNak.pada;
  const attrs = NAKSHATRA_ATTRIBUTES[moonNak.index] || {
    gana: 'দেব গণ', yoni: 'অশ্ব', nadi: 'আদ্য নাড়ি', varna: 'বিপ্র', vashya: 'দ্বিপদ'
  };

  // Helper for computing Y-M-D-H from decimal years
  const computeTimeUnits = (balanceYearsVal: number) => {
    const years = Math.floor(balanceYearsVal);
    const remMonths = (balanceYearsVal - years) * 12;
    const months = Math.floor(remMonths);
    const remDays = (remMonths - months) * 30;
    const days = Math.floor(remDays);
    const remHours = (remDays - days) * 24;
    const hours = Math.floor(remHours);

    return { years, months, days, hours };
  };

  // 5. Vimshottari Dasha Balance
  const normMoon = ((moonLongitude % 360) + 360) % 360;
  const nakSpan = 13.333333333333334;
  const elapsed = normMoon % nakSpan;
  const fracRemaining = 1 - (elapsed / nakSpan);

  const vimLord = VIMSHOTTARI_LORDS[moonNak.index % 9];
  const vUnits = computeTimeUnits(vimLord.years * fracRemaining);
  const vLordPoss = getBengaliPossessive(vimLord.bengali);
  const vimStr = `${vLordPoss} দশা ভোগ ${toBengaliDigits2(vUnits.years)}।${toBengaliDigits2(vUnits.months)}।${toBengaliDigits2(vUnits.days)}।${toBengaliDigits2(vUnits.hours)}`;

  // 6. Ashtottari Dasha Balance
  const ashtLordIdx = getAshtottariLordIndex(moonNak.index);
  const ashtLord = ASHTOTTARI_LORDS[ashtLordIdx];
  const aUnits = computeTimeUnits(ashtLord.years * fracRemaining);
  const aLordPoss = getBengaliPossessive(ashtLord.bengali);
  const ashtStr = `${aLordPoss} দশা ভোগ ${toBengaliDigits2(aUnits.years)}।${toBengaliDigits2(aUnits.months)}।${toBengaliDigits2(aUnits.days)}।${toBengaliDigits2(aUnits.hours)}`;

  // 7. Yogini Dasha Balance
  const yoginiIdx = (moonNak.index + 3) % 8;
  const yoginiLord = YOGINI_DASHAS[yoginiIdx];
  const yUnits = computeTimeUnits(yoginiLord.years * fracRemaining);
  const yLordPoss = getBengaliPossessive(yoginiLord.bengali);
  const yoginiStr = `${yLordPoss} দশা ভোগ ${toBengaliDigits2(yUnits.years)}।${toBengaliDigits2(yUnits.months)}।${toBengaliDigits2(yUnits.days)}।${toBengaliDigits2(yUnits.hours)}`;

  return {
    sakabta,
    bangabdaYear,
    bengaliMonth: bMonth,
    bengaliDate: toBengaliDigits(bDay),
    bengaliDateStr,
    tithiName,
    paksha,
    yogaName,
    karanaName,
    moonNakshatraName,
    moonNakshatraPada,
    gana: attrs.gana,
    yoni: attrs.yoni,
    nadi: attrs.nadi,
    varna: attrs.varna,
    vashya: attrs.vashya,
    vimshottariDasha: {
      lordName: vimLord.name,
      lordBengali: vimLord.bengali,
      totalYears: vimLord.years,
      years: vUnits.years,
      months: vUnits.months,
      days: vUnits.days,
      hours: vUnits.hours,
      formattedString: vimStr,
    },
    ashtottariDasha: {
      lordName: ashtLord.name,
      lordBengali: ashtLord.bengali,
      totalYears: ashtLord.years,
      years: aUnits.years,
      months: aUnits.months,
      days: aUnits.days,
      hours: aUnits.hours,
      formattedString: ashtStr,
    },
    yoginiDasha: {
      name: yoginiLord.name,
      nameBengali: yoginiLord.bengali,
      rulerPlanet: yoginiLord.ruler,
      totalYears: yoginiLord.years,
      years: yUnits.years,
      months: yUnits.months,
      days: yUnits.days,
      hours: yUnits.hours,
      formattedString: yoginiStr,
    },
  };
}
