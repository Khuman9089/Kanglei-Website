import lunarMonthsData from '@/data/manipuriLunarMonths.json';
import {
  MANIPURI_MONTH_ATTRIBUTES,
  MonthAttributeEntry,
  EE_KHUDENG_LEITABA_DAYS,
  EE_KHUDENG_LEIBA_DAYS,
  KONGBA_LEITABA_DAYS,
  KONGBA_LEIBA_DAYS,
  SOLAR_MONTH_NAMES,
  WEEKDAYS_MANIPURI,
  CALENDAR_TIMING_NOTE,
} from '@/data/manipuriMonthAttributes';
import { calculateVedicPanchang, PanchangData } from './panchang';
import { getManipurFestival, ManipurFestival } from '@/data/manipurFestivals';

export interface CalendarDay {
  day: number;
  dateStr: string;
  weekday: number;
  weekdayName: typeof WEEKDAYS_MANIPURI[0];
  isToday: boolean;
  isCurrentMonth: boolean;

  // Solar & Saka
  souraDate: number;
  sakaYear: number;
  solarMonth: typeof SOLAR_MONTH_NAMES[0];

  // Manipuri Lunar
  manipuriMonth: {
    code: number;
    nameEn: string;
    nameBengali: string;
    nameMeetei: string;
  };
  tithiNumber: number; // 1 to 30
  tithiDisplayBengali: string; // e.g. "ইঙা ২৫" or "ইঙেন ১১, ১২"
  tithiDisplayMeetei: string;  // e.g. "ꯏꯉꯥ ꯲꯵"
  tithiEndingTime: string;     // e.g. "22|36|33"
  tithiEndingStandard: string; // e.g. "10:36 PM"

  // Auspicious Indicators (Ee Khudeng / Kongba)
  isEeKhudengLeiba: boolean;
  isEeKhudengLeitaba: boolean;
  isKongbaLeiba: boolean;
  isKongbaLeitaba: boolean;
  isPurnima: boolean;
  isAmavasya: boolean;
  isEkadashi: boolean;

  // Festivals & General Holidays of Manipur
  festival?: ManipurFestival | null;
  isGeneralHoliday: boolean;

  // Full Day Panchang Snapshot
  panchang: PanchangData;
}

export interface MonthlyCalendarData {
  year: number;
  month: number; // 1-12
  monthNameEn: string;
  daysInMonth: number;
  firstDayWeekday: number; // 0 = Sunday
  totalWeeks: number;

  // Month Banners
  manipuriMonthSpanBengali: string; // e.g. "ইঙা - ইঙেন"
  manipuriMonthSpanMeetei: string;  // e.g. "ꯏꯉꯥ - ꯏꯉꯦꯟ"
  souraYearSpan: string;            // e.g. "1908" or "1908 - 1909"
  solarMonthSpanBengali: string;    // e.g. "আষাঢ় - শ্রাবণ"
  solarMonthSpanMeetei: string;     // e.g. "ꯑꯥꯁꯥꯔ - ꯁ꯭ꯔꯥꯕꯟ"

  // Grid
  weeks: (CalendarDay | null)[][];

  // Month Attributes & Notes
  activeMonthAttributes: MonthAttributeEntry[];
  eeKhudengLeitabaList: number[];
  eeKhudengLeibaList: number[];
  kongbaLeitabaList: number[];
  kongbaLeibaList: number[];
  timingNote: typeof CALENDAR_TIMING_NOTE;

  // Festivals occurring in this calendar month
  monthFestivals: { day: number; dateStr: string; festival: ManipurFestival }[];
}

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function toMeeteiNumerals(num: number | string): string {
  const digits: Record<string, string> = {
    '0': '꯰', '1': '꯱', '2': '꯲', '3': '꯳', '4': '꯴',
    '5': '꯵', '6': '꯶', '7': '꯷', '8': '꯸', '9': '꯹'
  };
  return String(num).split('').map(c => digits[c] || c).join('');
}

export function toBengaliNumerals(num: number | string): string {
  const digits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).split('').map(c => digits[c] || c).join('');
}

interface LunarInterval {
  code: number;
  nameEn: string;
  nameBengali: string;
  nameMeetei: string;
  startDate: string;
  endDate: string;
  startSerial?: number;
  endSerial?: number;
}

/**
 * Finds the active Manipuri Lunar Month from structured intervals in manipuriLunarMonths.json.
 * In the traditional Manipuri Amanta system:
 * The lunar month runs from Shukla Pratipada (day after Thasi/Amavasya) to Thasi (Amavasya).
 */
function getManipuriLunarMonth(dateStr: string) {
  const intervals = lunarMonthsData as LunarInterval[];
  
  // 1. Direct interval containment check
  const matched = intervals.find(
    (inv) => dateStr >= inv.startDate && dateStr <= inv.endDate
  );
  if (matched) {
    return {
      code: matched.code,
      nameEn: matched.nameEn,
      nameBengali: matched.nameBengali,
      nameMeetei: matched.nameMeetei
    };
  }

  // 2. Fallback: closest interval
  for (let i = 0; i < intervals.length; i++) {
    if (dateStr <= intervals[i].endDate) {
      return {
        code: intervals[i].code,
        nameEn: intervals[i].nameEn,
        nameBengali: intervals[i].nameBengali,
        nameMeetei: intervals[i].nameMeetei
      };
    }
  }

  return {
    code: 1,
    nameEn: 'Sajibu',
    nameBengali: 'শজিবু',
    nameMeetei: 'ꯁꯖꯤꯕꯨ'
  };
}

export function getMonthlyCalendar(
  year: number,
  month: number, // 1 to 12
  lat = 24.817,
  lng = 93.936,
  tzOffset = 5.5
): MonthlyCalendarData {
  const monthIdx = month - 1;
  const monthNameEn = `${ENGLISH_MONTHS[monthIdx]} ${year}`;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayWeekday = new Date(year, monthIdx, 1).getDay(); // 0 = Sunday

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const rawDayData: {
    day: number;
    dateStr: string;
    weekday: number;
    isToday: boolean;
    panchang: PanchangData;
    sunLong: number;
    moonLong: number;
    rawTithi: number;
    diff: number;
  }[] = [];

  // Pass 1: Compute raw astronomical positions for each day of the month
  // plus 1 extra day at the end for next-sunrise comparison (Kshaya/Vriddhi check)
  const totalDaysToCompute = daysInMonth + 1;

  for (let d = 1; d <= totalDaysToCompute; d++) {
    const dObj = new Date(year, monthIdx, d);
    const cYear = dObj.getFullYear();
    const cMonth = dObj.getMonth() + 1;
    const cDay = dObj.getDate();
    const dateStr = `${cYear}-${String(cMonth).padStart(2, '0')}-${String(cDay).padStart(2, '0')}`;
    const weekday = dObj.getDay();
    const isToday = dateStr === todayStr;

    const panchang = calculateVedicPanchang(dateStr, lat, lng, tzOffset);

    // Extract exact Sidereal Sun & Moon longitudes at sunrise
    const sunLong = panchang.planetaryState.sunLongitude ?? 
      (panchang.planets.find(p => p.id === 'su')?.longitude ?? 0);
    const moonLong = panchang.planetaryState.moonLongitude ?? 
      (panchang.planets.find(p => p.id === 'mo')?.longitude ?? 0);

    const diff = (moonLong - sunLong + 360) % 360;
    // Tithi evaluated at sunrise (1 to 30)
    const rawTithi = panchang.fiveAngas.tithi.index || (Math.floor(diff / 12) + 1);

    rawDayData.push({
      day: d,
      dateStr,
      weekday,
      isToday,
      panchang,
      sunLong,
      moonLong,
      rawTithi,
      diff
    });
  }

  const days: CalendarDay[] = [];
  const uniqueManipuriMonths = new Map<number, { bengali: string; meetei: string }>();
  const uniqueSolarMonths = new Map<number, { bengali: string; meetei: string }>();
  const uniqueSakaYears = new Set<number>();
  const monthFestivals: { day: number; dateStr: string; festival: ManipurFestival }[] = [];

  // Pass 2: Evaluate Final Tithi (accounting for Kshaya/Vriddhi matching qw.xlsm Sun!DG)
  // and construct CalendarDay objects for days 1..daysInMonth
  for (let i = 0; i < daysInMonth; i++) {
    const cur = rawDayData[i];
    const next = rawDayData[i + 1];

    const currentTithi = cur.rawTithi;
    const nextTithi = next.rawTithi;

    // Matching Excel formula in Sun!DG:
    // IF(DF(next) = DF(cur), DF(cur),
    //   IF(DF(next) - DF(cur) = -28, DF(cur) & "," & IF(DF(cur)=29,30,1),
    //     IF(DF(next) < DF(cur), DF(cur),
    //       IF(DF(next) - DF(cur) = 1, DF(cur),
    //         DF(cur) & "," & (DF(cur)+1)))))
    let finalTithiStr = String(currentTithi);
    let tithiForBadge = currentTithi;

    const tithiDiff = (nextTithi - currentTithi + 30) % 30;
    if (tithiDiff === 2) {
      // Kshaya Tithi: a tithi ended between sunrises
      const skippedTithi = (currentTithi % 30) + 1;
      finalTithiStr = `${currentTithi}, ${skippedTithi}`;
    }

    // Tithi Ending Time Calculation (qw.xlsm Sun!DH..Sun!DK):
    // DH = remaining degrees to complete current tithi
    const nextBoundary = currentTithi * 12;
    const remainingDeg = (nextBoundary - cur.diff + 360) % 12 || 12;

    // Daily velocities:
    const moonSpeed = cur.panchang.planets.find(p => p.id === 'mo')?.speed ?? 13.176;
    const sunSpeed = cur.panchang.planets.find(p => p.id === 'su')?.speed ?? 0.9856;
    const relSpeed = Math.max(10.5, moonSpeed - sunSpeed);

    const hoursFromSunrise = (remainingDeg / relSpeed) * 24;

    const sunriseParts = cur.panchang.sunMoonTimings.sunrise.split(':').map(Number);
    const sunriseDecimal = (sunriseParts[0] || 5) + (sunriseParts[1] || 30) / 60;
    const endingDecimal = sunriseDecimal + hoursFromSunrise;

    const endingH = Math.floor(endingDecimal);
    const remM = (endingDecimal - endingH) * 60;
    const endingM = Math.floor(remM);
    const endingS = Math.round((remM - endingM) * 60);

    // Exact Excel format: HH|MM|SS
    const tithiEndingTime = `${String(endingH).padStart(2, '0')}|${String(endingM).padStart(2, '0')}|${String(endingS).padStart(2, '0')}`;

    // Standard 12-hour civil format
    const stdH = endingH % 24;
    const isPM = stdH >= 12;
    const dispH = stdH % 12 || 12;
    const tithiEndingStandard = `${dispH}:${String(endingM).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}${endingH >= 24 ? ' (+1d)' : ''}`;

    // Manipuri Lunar Month lookup
    const manipuriMonth = getManipuriLunarMonth(cur.dateStr);
    uniqueManipuriMonths.set(manipuriMonth.code, {
      bengali: manipuriMonth.nameBengali,
      meetei: manipuriMonth.nameMeetei
    });

    // Solar Month & Soura Date (Day of Solar Month)
    const solarMonthIndex = Math.floor(cur.sunLong / 30);
    const solarMonth = SOLAR_MONTH_NAMES[solarMonthIndex % 12];
    uniqueSolarMonths.set(solarMonthIndex, {
      bengali: solarMonth.bengali,
      meetei: solarMonth.meetei
    });

    // Soura Date (Saka solar day 1 to 30/31)
    const souraDate = Math.floor(cur.sunLong % 30) + 1;

    // Saka Year (Mesha Sankranti in mid-April marks Saka New Year)
    const isPreSakaNewYear = month < 4 || (month === 4 && cur.day < 14);
    const sakaYear = isPreSakaNewYear ? year - 79 : year - 78;
    uniqueSakaYears.add(sakaYear);

    // Auspicious Indicators (Ee Khudeng)
    const isEeKhudengLeitaba = EE_KHUDENG_LEITABA_DAYS.includes(currentTithi);
    const isEeKhudengLeiba = EE_KHUDENG_LEIBA_DAYS.includes(currentTithi);
    const isKongbaLeitaba = isEeKhudengLeitaba;
    const isKongbaLeiba = isEeKhudengLeiba;
    const isPurnima = currentTithi === 15;
    const isAmavasya = currentTithi === 30;
    const isEkadashi = currentTithi === 11 || currentTithi === 26;

    // Formatted display strings
    const bengaliTithiNum = finalTithiStr.split(', ').map(toBengaliNumerals).join(', ');
    const meeteiTithiNum = finalTithiStr.split(', ').map(toMeeteiNumerals).join(', ');

    const tithiDisplayBengali = `${manipuriMonth.nameBengali} ${bengaliTithiNum}`;
    const tithiDisplayMeetei = `${manipuriMonth.nameMeetei} ${meeteiTithiNum}`;

    // Festivals & General Holidays of Manipur (Explicitly excluding KUT)
    const festival = getManipurFestival(
      cur.day,
      month,
      year,
      manipuriMonth.code,
      currentTithi,
      souraDate
    );
    const isGeneralHoliday = Boolean(festival?.isGeneralHoliday);

    if (festival) {
      monthFestivals.push({ day: cur.day, dateStr: cur.dateStr, festival });
    }

    days.push({
      day: cur.day,
      dateStr: cur.dateStr,
      weekday: cur.weekday,
      weekdayName: WEEKDAYS_MANIPURI[cur.weekday],
      isToday: cur.isToday,
      isCurrentMonth: true,
      souraDate,
      sakaYear,
      solarMonth,
      manipuriMonth,
      tithiNumber: currentTithi,
      tithiDisplayBengali,
      tithiDisplayMeetei,
      tithiEndingTime,
      tithiEndingStandard,
      isEeKhudengLeiba,
      isEeKhudengLeitaba,
      isKongbaLeiba,
      isKongbaLeitaba,
      isPurnima,
      isAmavasya,
      isEkadashi,
      festival,
      isGeneralHoliday,
      panchang: cur.panchang
    });
  }

  // Build 2D week grid (Sunday to Saturday)
  const weeks: (CalendarDay | null)[][] = [];
  let currentWeek: (CalendarDay | null)[] = [];

  for (let i = 0; i < firstDayWeekday; i++) {
    currentWeek.push(null);
  }

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  // Month Banners
  const manipuriMonthCodes = Array.from(uniqueManipuriMonths.keys());
  const manipuriMonthSpanBengali = Array.from(uniqueManipuriMonths.values()).map(v => v.bengali).join(' - ');
  const manipuriMonthSpanMeetei = Array.from(uniqueManipuriMonths.values()).map(v => v.meetei).join(' - ');

  const solarMonthSpanBengali = Array.from(uniqueSolarMonths.values()).map(v => v.bengali).join(' - ');
  const solarMonthSpanMeetei = Array.from(uniqueSolarMonths.values()).map(v => v.meetei).join(' - ');

  const sortedSakaYears = Array.from(uniqueSakaYears).sort((a, b) => a - b);
  const souraYearSpan = sortedSakaYears.join(' - ');

  // Month Attributes for the spanning Manipuri Months
  const activeMonthAttributes = MANIPURI_MONTH_ATTRIBUTES.filter(attr => 
    manipuriMonthCodes.includes(attr.monthCode)
  );

  return {
    year,
    month,
    monthNameEn,
    daysInMonth,
    firstDayWeekday,
    totalWeeks: weeks.length,
    manipuriMonthSpanBengali,
    manipuriMonthSpanMeetei,
    souraYearSpan,
    solarMonthSpanBengali,
    solarMonthSpanMeetei,
    weeks,
    activeMonthAttributes,
    eeKhudengLeitabaList: EE_KHUDENG_LEITABA_DAYS,
    eeKhudengLeibaList: EE_KHUDENG_LEIBA_DAYS,
    kongbaLeitabaList: EE_KHUDENG_LEITABA_DAYS,
    kongbaLeibaList: EE_KHUDENG_LEIBA_DAYS,
    timingNote: CALENDAR_TIMING_NOTE,
    monthFestivals,
  };
}
