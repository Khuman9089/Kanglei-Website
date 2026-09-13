import sakaTableData from '../data/sakaToBirthTable.json';

export interface SakaToBirthInput {
  sakaYear: number;
  mass: number; // 0 to 11 (Solar Month)
  sangkranti: number; // 1 to 32 (Solar Day)
  danda: number; // 0 to 59
  pal: number; // 0 to 59
  bipal: number; // 0 to 59
}

export interface SakaToBirthResult {
  // Input Echo
  sakaYear: number;
  mass: number;
  sangkranti: number;
  danda: number;
  pal: number;
  bipal: number;
  totalDandaDecimal: number;
  hoursFromSunrise: number;

  // Gregorian Birth Output (Rows 7-10 of Saka_to_Birth)
  dateOfBirth: string; // YYYY-MM-DD
  day: number;
  month: number;
  year: number;
  weekday: string; // e.g. "Friday"
  weekdayBengali: string; // e.g. "শুক্রবার"
  weekdayMeetei: string; // e.g. "ꯏꯔꯥꯏ"
  birthTime: string; // HH:MM:SS
  birthTime12h: string; // e.g. "09:42:25 PM"
  hour: number;
  minute: number;
  second: number;
  sunriseTime: string; // HH:MM:SS
  sunriseDecimal: number;

  // Epakpa Details (Rows 11-14 of Saka_to_Birth)
  solarMonthNameEn: string;
  solarMonthNameBengali: string;
  solarMonthNameMeetei: string;
  zodiacSign: string;

  // Epakpa Numitki Tban (লৈপাকপা নুমিৎকী থবানীং)
  lunarMonthName: string;
  lunarMonthBengali: string;
  lunarMonthMeetei: string;
  tithiNumber: number;
  tithiDisplayBengali: string;
  tithiDisplayMeetei: string;
  tithiEndingTime: string;

  // Epakpa Numitki Rashi (লৈপাকপা নুমিৎকী রাশি)
  rashiNumber: number;
  rashiNameBengali: string;
  rashiNameMeetei: string;
  rashiNameEn: string;
  rashiEndingTime: string;

  // Epakpa Numitki Thawanmichak (লৈপাকপা নুমিৎকী থৱানমিচাক / নক্ষত্র)
  nakshatraNumber: number;
  nakshatraNameBengali: string;
  nakshatraNameMeetei: string;
  nakshatraNameEn: string;
  nakshatraEndingTime: string;

  source: 'EXCEL_EPHEM_TABLE' | 'ASTRONOMICAL_FALLBACK';
}

export const SOLAR_MASS_NAMES = [
  { index: 0, sign: 'Aries', bengali: 'বৈশাখ', meetei: 'ꯕꯩꯁꯥꯈ', en: 'Vaisakha' },
  { index: 1, sign: 'Taurus', bengali: 'জ্যৈষ্ঠ', meetei: 'ꯖ꯭ꯌꯩꯁ꯭ꯊ', en: 'Jyeshtha' },
  { index: 2, sign: 'Gemini', bengali: 'আষাঢ়', meetei: 'ꯑꯥꯁꯥꯔ', en: 'Ashadha' },
  { index: 3, sign: 'Cancer', bengali: 'শ্রাবণ', meetei: 'ꯁ꯭ꯔꯥꯕꯟ', en: 'Sravana' },
  { index: 4, sign: 'Leo', bengali: 'ভাদ্র', meetei: 'ꯚꯥꯗ꯭ꯔ', en: 'Bhadra' },
  { index: 5, sign: 'Virgo', bengali: 'আশ্বিন', meetei: 'ꯑꯥꯁ꯭ꯕꯤꯟ', en: 'Asvina' },
  { index: 6, sign: 'Libra', bengali: 'কার্ত্তিক', meetei: 'ꯀꯥꯔꯇꯤꯛ', en: 'Kartika' },
  { index: 7, sign: 'Scorpio', bengali: 'অগ্রহায়ণ', meetei: 'ꯑꯒ꯭ꯔꯍꯥꯌꯟ', en: 'Agrahayana' },
  { index: 8, sign: 'Sagittarius', bengali: 'পৌষ', meetei: 'ꯄꯧꯁ', en: 'Pausha' },
  { index: 9, sign: 'Capricorn', bengali: 'মাঘ', meetei: 'ꯃꯥꯘ', en: 'Magha' },
  { index: 10, sign: 'Aquarius', bengali: 'ফাল্গুন', meetei: 'ꯐꯥꯜꯒꯨꯟ', en: 'Phalguna' },
  { index: 11, sign: 'Pisces', bengali: 'চৈত্র', meetei: 'ꯆꯩꯇ꯭ꯔ', en: 'Chaitra' },
];

export const RASHI_NAMES: { [key: number]: { bengali: string; meetei: string; en: string } } = {
  1: { bengali: 'মেষ', meetei: 'ꯃꯦꯁ', en: 'Mesha (Aries)' },
  2: { bengali: 'বৃষ', meetei: 'ꯕ꯭ꯔꯤꯁ', en: 'Vrisha (Taurus)' },
  3: { bengali: 'মিথুন', meetei: 'ꯃꯤꯊꯨꯟ', en: 'Mithun (Gemini)' },
  4: { bengali: 'কর্কট', meetei: 'ꯀꯔꯀꯠ', en: 'Karkat (Cancer)' },
  5: { bengali: 'সিংহ', meetei: 'ꯁꯤꯡꯍ', en: 'Singh (Leo)' },
  6: { bengali: 'কন্যা', meetei: 'ꯀꯟꯌꯥ', en: 'Kanya (Virgo)' },
  7: { bengali: 'তুলা', meetei: 'ꯇꯨꯂꯥ', en: 'Tula (Libra)' },
  8: { bengali: 'বৃশ্চিক', meetei: 'ꯕ꯭ꯔꯤꯁ꯭ꯆꯤꯛ', en: 'Vrishchik (Scorpio)' },
  9: { bengali: 'ধনু', meetei: 'ꯙꯅꯨ', en: 'Dhanu (Sagittarius)' },
  10: { bengali: 'মকর', meetei: 'ꯃꯀꯔ', en: 'Makar (Capricorn)' },
  11: { bengali: 'কুম্ভ', meetei: 'ꯀꯨꯃ꯭ꯚ', en: 'Kumbha (Aquarius)' },
  12: { bengali: 'মীন', meetei: 'ꯃꯤꯟ', en: 'Meen (Pisces)' },
};

export const NAKSHATRA_NAMES: { [key: number]: { bengali: string; meetei: string; en: string } } = {
  1: { bengali: 'অশ্বিনী', meetei: 'ꯑꯁ꯭ꯕꯤꯅꯤ', en: 'Ashwini' },
  2: { bengali: 'ভরণী', meetei: 'ꯚꯔꯅꯤ', en: 'Bharani' },
  3: { bengali: 'কৃত্তিকা', meetei: 'ꯀ꯭ꯔꯤꯇꯤꯀꯥ', en: 'Krittika' },
  4: { bengali: 'রোহিণী', meetei: 'ꯔꯣꯍꯤꯅꯤ', en: 'Rohini' },
  5: { bengali: 'মৃগশিরা', meetei: 'ꯃ꯭ꯔꯤꯒꯁꯤꯔꯥ', en: 'Mrigashira' },
  6: { bengali: 'আর্দ্রা', meetei: 'ꯑꯥꯔꯗ꯭ꯔꯥ', en: 'Ardra' },
  7: { bengali: 'পুনর্বসু', meetei: 'ꯄꯨꯅꯔꯕꯁꯨ', en: 'Punarvasu' },
  8: { bengali: 'পুষ্যা', meetei: 'ꯄꯨꯁ꯭ꯌꯥ', en: 'Pushya' },
  9: { bengali: 'অশ্লেষা', meetei: 'ꯑꯁ꯭ꯂꯦꯁꯥ', en: 'Ashlesha' },
  10: { bengali: 'মঘা', meetei: 'ꯃꯘꯥ', en: 'Magha' },
  11: { bengali: 'পূর্ব ফাল্গুনী', meetei: 'ꯄꯨꯔꯕ ꯐꯥꯜꯒꯨꯅꯤ', en: 'Purva Phalguni' },
  12: { bengali: 'উত্তর ফাল্গুনী', meetei: 'ꯎꯇ꯭ꯇꯔ ꯐꯥꯜꯒꯨꯅꯤ', en: 'Uttara Phalguni' },
  13: { bengali: 'হস্তা', meetei: 'ꯍꯁ꯭ꯇꯥ', en: 'Hasta' },
  14: { bengali: 'চিত্রা', meetei: 'ꯆꯤꯇ꯭ꯔꯥ', en: 'Chitra' },
  15: { bengali: 'স্বাতী', meetei: 'ꯁ꯭ꯕꯥꯇꯤ', en: 'Swati' },
  16: { bengali: 'বিশাখা', meetei: 'ꯕꯤꯁꯥꯈꯥ', en: 'Vishakha' },
  17: { bengali: 'অনুরাধা', meetei: 'ꯑꯅꯨꯔꯥꯙꯥ', en: 'Anuradha' },
  18: { bengali: 'জ্যেষ্ঠা', meetei: 'ꯖ꯭ꯌꯦꯁ꯭ꯊꯥ', en: 'Jyeshtha' },
  19: { bengali: 'মূলা', meetei: 'ꯃꯨꯂꯥ', en: 'Mula' },
  20: { bengali: 'পূর্বাষাঢ়া', meetei: 'ꯄꯨꯔꯕꯥꯁꯥꯔꯥ', en: 'Purva Ashadha' },
  21: { bengali: 'উত্তরাষাঢ়া', meetei: 'ꯎꯇ꯭ꯇꯔꯥꯁꯥꯔꯥ', en: 'Uttara Ashadha' },
  22: { bengali: 'শ্রবণা', meetei: 'ꯁ꯭ꯔꯕꯅꯥ', en: 'Shravana' },
  23: { bengali: 'ধনিষ্ঠা', meetei: 'ꯙꯅꯤꯁ꯭ꯊꯥ', en: 'Dhanishta' },
  24: { bengali: 'শতভিষা', meetei: 'ꯁꯇꯚꯤꯁꯥ', en: 'Shatabhisha' },
  25: { bengali: 'পূর্ব ভাদ্রপদ', meetei: 'ꯄꯨꯔꯕ ꯚꯥꯗ꯭ꯔꯄꯗ', en: 'Purva Bhadrapada' },
  26: { bengali: 'উত্তর ভাদ্রপদ', meetei: 'ꯎꯇ꯭ꯇꯔ ꯚꯥꯗ꯭ꯔꯄꯗ', en: 'Uttara Bhadrapada' },
  27: { bengali: 'রেবতী', meetei: 'ꯔꯦꯕꯇꯤ', en: 'Revati' },
};

export const MANIPURI_LUNAR_MONTH_NAMES: { [key: string]: { bengali: string; meetei: string } } = {
  Sajibu: { bengali: 'শজিবু', meetei: 'ꯁꯖꯤꯕꯨ' },
  Shajibu: { bengali: 'শজিবু', meetei: 'ꯁꯖꯤꯕꯨ' },
  Kalen: { bengali: 'কালেন', meetei: 'ꯀꯥꯂꯦꯟ' },
  Inga: { bengali: 'ইঙা', meetei: 'ꯏꯉꯥ' },
  Ingen: { bengali: 'ইঙেন', meetei: 'ꯏꯉꯦꯟ' },
  Thawan: { bengali: 'থৱান', meetei: 'ꯊꯋꯥꯟ' },
  Langban: { bengali: 'লাংবন', meetei: 'ꯂꯥꯡꯕꯟ' },
  Mera: { bengali: 'মেরা', meetei: 'ꯃꯦꯔꯥ' },
  Hiyangei: { bengali: 'হিয়াংগৈ', meetei: 'ꯍꯤꯌꯥꯡꯒꯩ' },
  Poinu: { bengali: 'পোইনু', meetei: 'ꯄꯣꯏꯅꯨ' },
  Wakching: { bengali: 'ৱাকচিং', meetei: 'ꯋꯥꯛꯆꯤꯡ' },
  Phiren: { bengali: 'ফাইরেল', meetei: 'ꯐꯥꯏꯔꯦꯜ' },
  Lamta: { bengali: 'লমতা', meetei: 'ꯂꯝꯇꯥ' },
};

const WEEKDAY_NAMES_MAP: { [key: number]: { en: string; bengali: string; meetei: string } } = {
  0: { en: 'Sunday', bengali: 'রবিবার (নোংমাইজিং)', meetei: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ' },
  1: { en: 'Monday', bengali: 'সোমবার (নিংথৌকাবা)', meetei: 'ꯅꯤꯡꯊꯧꯀꯥꯕ' },
  2: { en: 'Tuesday', bengali: 'মঙ্গলবার (লৈপাকপোকপা)', meetei: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ' },
  3: { en: 'Wednesday', bengali: 'বুধবার (য়ুমশেকৈশা)', meetei: 'ꯌꯨꯝꯁꯀꯩꯁꯥ' },
  4: { en: 'Thursday', bengali: 'বৃহস্পতিবার (শগোলশেন)', meetei: 'ꯁꯒꯣꯜꯁꯦꯟ' },
  5: { en: 'Friday', bengali: 'শুক্রবার (ইরাই)', meetei: 'ꯏꯔꯥꯏ' },
  6: { en: 'Saturday', bengali: 'শনিবার (থাংজা)', meetei: 'ꯊꯥꯡꯖꯥ' },
};

/**
 * Converts traditional Manipuri Saka & Danda-Pal-Bipal into exact English Date of Birth,
 * Birth Time, Day, and Epakpa Numitki details matching Excel qw.xlsm (Saka_to_Birth).
 */
export function convertSakaToBirth(input: SakaToBirthInput): SakaToBirthResult {
  const { sakaYear, mass, sangkranti, danda, pal, bipal } = input;

  // 1. Calculate time elapsed from sunrise based on Danda, Pal, Bipal:
  // Excel formula E5 = B5 + C5/60 + D5/3600
  // Excel formula F5 = E5 * 2/5 (Total elapsed hours)
  const totalDandaDecimal = danda + pal / 60 + bipal / 3600;
  const hoursFromSunrise = totalDandaDecimal * (2 / 5);

  // 2. Build Lookup Key: YYYY-MM-DD format (e.g. "1880-00-05")
  const key = `${sakaYear}-${String(mass).padStart(2, '0')}-${String(sangkranti).padStart(2, '0')}`;
  const tableData: any = (sakaTableData as Record<string, any>)[key];

  let dateOfBirth = '';
  let sunriseStr = '05:00:00';
  let sunriseDecimal = 5.0;
  let lunarMonth = 'Sajibu';
  let tithiNum = 1;
  let tithiEndingTime = '--:--:--';
  let rashiNum = 1;
  let rashiEndingTime = '--:--:--';
  let nakshatraNum = 1;
  let nakshatraEndingTime = '--:--:--';
  let source: 'EXCEL_EPHEM_TABLE' | 'ASTRONOMICAL_FALLBACK' = 'EXCEL_EPHEM_TABLE';

  if (tableData) {
    // Array: [date_val, sunrise_str, sunrise_dec, lunar_m, tithi_num, tithi_end, rashi_num, rashi_str, nak_num, nak_end]
    dateOfBirth = tableData[0];
    sunriseStr = tableData[1] || '05:00:00';
    sunriseDecimal = tableData[2] || 5.0;
    lunarMonth = tableData[3] || 'Sajibu';
    tithiNum = tableData[4] || 1;
    tithiEndingTime = tableData[5] || '--:--:--';
    rashiNum = tableData[6] || 1;
    nakshatraNum = tableData[8] || 1;
    nakshatraEndingTime = tableData[9] || '--:--:--';

    // Parse rashi ending time from string like "22:10:08" or "Meena-22:10:08"
    const rStr = String(tableData[7] || '');
    if (rStr.includes('-')) {
      rashiEndingTime = rStr.split('-')[1];
    } else if (rStr.includes(':')) {
      rashiEndingTime = rStr;
    } else {
      rashiEndingTime = nakshatraEndingTime;
    }
  } else {
    // Fallback: estimate from Saka Year + 78
    source = 'ASTRONOMICAL_FALLBACK';
    const approxYear = sakaYear + 78;
    const approxMonth = ((mass + 3) % 12) + 1;
    const approxDay = Math.min(Math.max(sangkranti, 1), 28);
    dateOfBirth = `${approxYear}-${String(approxMonth).padStart(2, '0')}-${String(approxDay).padStart(2, '0')}`;
  }

  // 3. Calculate Birth Time (Excel formula G5 = F5 + Converter!F11)
  const totalBirthHourDecimal = hoursFromSunrise + sunriseDecimal;
  const normalizedHours = totalBirthHourDecimal % 24;
  const hour = Math.floor(normalizedHours);
  const minuteFrac = (normalizedHours - hour) * 60;
  const minute = Math.floor(minuteFrac);
  const second = Math.floor((minuteFrac - minute) * 60);

  const hourStr = String(hour).padStart(2, '0');
  const minStr = String(minute).padStart(2, '0');
  const secStr = String(second).padStart(2, '0');
  const birthTime = `${hourStr}:${minStr}:${secStr}`;

  // 12-hour AM/PM format
  const hour12 = hour % 12 || 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const birthTime12h = `${String(hour12).padStart(2, '0')}:${minStr}:${secStr} ${ampm}`;

  // 4. Parse Date components
  const dobParts = dateOfBirth.split('-');
  const year = parseInt(dobParts[0], 10);
  const month = parseInt(dobParts[1], 10);
  const day = parseInt(dobParts[2], 10);

  // Weekday calculation
  const dobObj = new Date(year, month - 1, day);
  const weekdayIdx = dobObj.getDay();
  const weekdayInfo = WEEKDAY_NAMES_MAP[weekdayIdx] || WEEKDAY_NAMES_MAP[0];

  // Solar Mass Info
  const solarMonthInfo = SOLAR_MASS_NAMES[mass] || SOLAR_MASS_NAMES[0];

  // Lunar Month Names
  const lunarMonthNames = MANIPURI_LUNAR_MONTH_NAMES[lunarMonth] || {
    bengali: lunarMonth,
    meetei: lunarMonth,
  };

  // Tithi Display matching Excel E12: =Converter!F3&" gI "&Converter!P11&" panba"
  const tithiDisplayBengali = `${lunarMonthNames.bengali}গী ${tithiNum} পানবা`;
  const tithiDisplayMeetei = `${lunarMonthNames.meetei}ꯒꯤ ${tithiNum} ꯄꯥꯟꯕ`;

  // Rashi Info
  const rashiInfo = RASHI_NAMES[rashiNum] || RASHI_NAMES[1];

  // Nakshatra Info
  const nakshatraInfo = NAKSHATRA_NAMES[nakshatraNum] || NAKSHATRA_NAMES[1];

  return {
    sakaYear,
    mass,
    sangkranti,
    danda,
    pal,
    bipal,
    totalDandaDecimal,
    hoursFromSunrise,

    dateOfBirth,
    day,
    month,
    year,
    weekday: weekdayInfo.en,
    weekdayBengali: weekdayInfo.bengali,
    weekdayMeetei: weekdayInfo.meetei,
    birthTime,
    birthTime12h,
    hour,
    minute,
    second,
    sunriseTime: sunriseStr,
    sunriseDecimal,

    solarMonthNameEn: solarMonthInfo.en,
    solarMonthNameBengali: solarMonthInfo.bengali,
    solarMonthNameMeetei: solarMonthInfo.meetei,
    zodiacSign: solarMonthInfo.sign,

    lunarMonthName: lunarMonth,
    lunarMonthBengali: lunarMonthNames.bengali,
    lunarMonthMeetei: lunarMonthNames.meetei,
    tithiNumber: tithiNum,
    tithiDisplayBengali,
    tithiDisplayMeetei,
    tithiEndingTime,

    rashiNumber: rashiNum,
    rashiNameBengali: rashiInfo.bengali,
    rashiNameMeetei: rashiInfo.meetei,
    rashiNameEn: rashiInfo.en,
    rashiEndingTime,

    nakshatraNumber: nakshatraNum,
    nakshatraNameBengali: nakshatraInfo.bengali,
    nakshatraNameMeetei: nakshatraInfo.meetei,
    nakshatraNameEn: nakshatraInfo.en,
    nakshatraEndingTime,

    source,
  };
}
