// Muhurta and Auspicious/Inauspicious Timing Engine
import { AuspiciousTimes, ChoghadiyaPeriod } from '../../types/astronomy';
import { CHOGHADIYA_DEFINITIONS, DAY_CHOGHADIYA_ORDER, NIGHT_CHOGHADIYA_ORDER } from '../../data/choghadiya';
import { calculateSunTimes, formatTime24, formatTimeHours, normalize24 } from './sunCalculations';

// Segment index mappings for 1/8th divisions of day (0-indexed: 0 to 7)
// Weekdays: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const RAHU_KAAL_SEGMENTS = [7, 1, 6, 4, 5, 3, 2]; // 8th, 2nd, 7th, 5th, 6th, 4th, 3rd segment
const YAMAGANDA_SEGMENTS = [4, 3, 2, 1, 0, 6, 5]; // 5th, 4th, 3rd, 2nd, 1st, 7th, 6th segment
const GULIKA_SEGMENTS = [6, 5, 4, 3, 2, 1, 0]; // 7th, 6th, 5th, 4th, 3rd, 2nd, 1st segment

export function calculateAuspiciousTimes(
  dateStr: string,
  timeStr: string,
  lat: number,
  lng: number,
  tzOffset: number
): AuspiciousTimes {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const [currentHStr, currentMStr] = timeStr.split(':');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const currentHour = parseInt(currentHStr, 10) + parseInt(currentMStr, 10) / 60;

  const sunTimes = calculateSunTimes(year, month, day, lat, lng, tzOffset);
  const dObj = new Date(year, month - 1, day);
  const dayOfWeek = dObj.getDay(); // 0=Sunday

  const riseHours = sunTimes.sunrise.hour + sunTimes.sunrise.minute / 60;
  const setHours = sunTimes.sunset.hour + sunTimes.sunset.minute / 60;

  let dayLengthHours = setHours - riseHours;
  if (dayLengthHours < 0) dayLengthHours += 24;
  const daySegmentHours = dayLengthHours / 8;

  let nightLengthHours = 24 - dayLengthHours;
  const nightSegmentHours = nightLengthHours / 8;

  // Helper to format a time range
  const makeRange = (startH: number, endH: number) => ({
    start: formatTime24(startH),
    end: formatTime24(endH),
  });

  // 1. Rahu Kaal
  const rahuSeg = RAHU_KAAL_SEGMENTS[dayOfWeek];
  const rahuStart = normalize24(riseHours + rahuSeg * daySegmentHours);
  const rahuEnd = normalize24(rahuStart + daySegmentHours);
  const rahuKaal = makeRange(rahuStart, rahuEnd);

  // 2. Yamaganda
  const yamaSeg = YAMAGANDA_SEGMENTS[dayOfWeek];
  const yamaStart = normalize24(riseHours + yamaSeg * daySegmentHours);
  const yamaEnd = normalize24(yamaStart + daySegmentHours);
  const yamaganda = makeRange(yamaStart, yamaEnd);

  // 3. Gulika Kaal
  const gulikaSeg = GULIKA_SEGMENTS[dayOfWeek];
  const gulikaStart = normalize24(riseHours + gulikaSeg * daySegmentHours);
  const gulikaEnd = normalize24(gulikaStart + daySegmentHours);
  const gulikaKaal = makeRange(gulikaStart, gulikaEnd);

  // 4. Brahma Muhurta: 2 Muhurtas (96 min to 48 min before sunrise)
  const brahmaStart = normalize24(riseHours - 96 / 60);
  const brahmaEnd = normalize24(riseHours - 48 / 60);
  const brahmaMuhurta = makeRange(brahmaStart, brahmaEnd);

  // 5. Abhijit Muhurta (8th of 15 daytime muhurtas, centered at Solar Noon)
  const muhurtaDuration = dayLengthHours / 15;
  const abhijitStart = normalize24(riseHours + 7 * muhurtaDuration);
  const abhijitEnd = normalize24(riseHours + 8 * muhurtaDuration);
  // Inauspicious on Wednesday
  const abhijitMuhurta = {
    ...makeRange(abhijitStart, abhijitEnd),
    isAuspicious: dayOfWeek !== 3,
  };

  // 6. Dur Muhurta
  const durMuhurtas: { start: string; end: string }[] = [];
  if (dayOfWeek === 0) {
    durMuhurtas.push(makeRange(riseHours + 13 * muhurtaDuration, riseHours + 14 * muhurtaDuration));
  } else if (dayOfWeek === 1) {
    durMuhurtas.push(makeRange(riseHours + 8 * muhurtaDuration, riseHours + 9 * muhurtaDuration));
    durMuhurtas.push(makeRange(riseHours + 11 * muhurtaDuration, riseHours + 12 * muhurtaDuration));
  } else if (dayOfWeek === 2) {
    durMuhurtas.push(makeRange(riseHours + 3 * muhurtaDuration, riseHours + 4 * muhurtaDuration));
    durMuhurtas.push(makeRange(riseHours + 7 * muhurtaDuration, riseHours + 8 * muhurtaDuration));
  } else if (dayOfWeek === 3) {
    durMuhurtas.push(makeRange(riseHours + 7 * muhurtaDuration, riseHours + 8 * muhurtaDuration));
  } else if (dayOfWeek === 4) {
    durMuhurtas.push(makeRange(riseHours + 5 * muhurtaDuration, riseHours + 6 * muhurtaDuration));
    durMuhurtas.push(makeRange(riseHours + 11 * muhurtaDuration, riseHours + 12 * muhurtaDuration));
  } else if (dayOfWeek === 5) {
    durMuhurtas.push(makeRange(riseHours + 3 * muhurtaDuration, riseHours + 4 * muhurtaDuration));
    durMuhurtas.push(makeRange(riseHours + 8 * muhurtaDuration, riseHours + 9 * muhurtaDuration));
  } else if (dayOfWeek === 6) {
    durMuhurtas.push(makeRange(riseHours + 1 * muhurtaDuration, riseHours + 2 * muhurtaDuration));
  }

  // 7. Day Choghadiya
  const dayChogList = DAY_CHOGHADIYA_ORDER[dayOfWeek];
  const choghadiyaDay: ChoghadiyaPeriod[] = dayChogList.map((nature, idx) => {
    const startH = normalize24(riseHours + idx * daySegmentHours);
    const endH = normalize24(startH + daySegmentHours);
    const def = CHOGHADIYA_DEFINITIONS[nature];

    // Check if current time falls in this period
    let isCurrent = false;
    if (currentHour >= startH && currentHour < endH) {
      isCurrent = true;
    }

    return {
      name: nature,
      sanskritName: def.sanskritName,
      nature,
      quality: def.quality,
      ruler: def.ruler,
      start: formatTime24(startH),
      end: formatTime24(endH),
      isCurrent,
    };
  });

  // 8. Night Choghadiya
  const nightChogList = NIGHT_CHOGHADIYA_ORDER[dayOfWeek];
  const choghadiyaNight: ChoghadiyaPeriod[] = nightChogList.map((nature, idx) => {
    const startH = normalize24(setHours + idx * nightSegmentHours);
    const endH = normalize24(startH + nightSegmentHours);
    const def = CHOGHADIYA_DEFINITIONS[nature];

    let isCurrent = false;
    if (endH > startH) {
      if (currentHour >= startH && currentHour < endH) isCurrent = true;
    } else {
      // Overnight boundary cross
      if (currentHour >= startH || currentHour < endH) isCurrent = true;
    }

    return {
      name: nature,
      sanskritName: def.sanskritName,
      nature,
      quality: def.quality,
      ruler: def.ruler,
      start: formatTime24(startH),
      end: formatTime24(endH),
      isCurrent,
    };
  });

  return {
    brahmaMuhurta,
    abhijitMuhurta,
    rahuKaal,
    yamaganda,
    gulikaKaal,
    durMuhurta: durMuhurtas,
    choghadiyaDay,
    choghadiyaNight,
  };
}
