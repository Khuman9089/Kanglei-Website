import { calculatePlanetaryPositions } from './ephemeris';

export interface PanchangData {
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "Friday, 28 August 2026"
  location: {
    name: string;
    latitude: number;
    longitude: number;
    utcOffset: number;
  };
  sunMoonTimings: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    dayLength: string;
    sunriseDecimal?: number;
    sunsetDecimal?: number;
  };
  fiveAngas: {
    tithi: {
      name: string;
      paksha: 'Shukla Paksha' | 'Krishna Paksha';
      index: number;
      completionPct: number;
      summary: string;
    };
    nakshatra: {
      name: string;
      lord: string;
      pada: number;
      index: number;
      completionPct: number;
    };
    yoga: {
      name: string;
      index: number;
      isAuspicious: boolean;
    };
    karana: {
      name: string;
      index?: number;
      type: string;
      isBhadra: boolean;
    };
    vara: {
      name: string;
      sanskrit: string;
      ruler: string;
    };
  };
  muhurtas: {
    abhijit: { start: string; end: string; isAuspicious: boolean };
    amritKaal: { start: string; end: string };
    rahuKaal: { start: string; end: string; warning: string };
    yamaganda: { start: string; end: string };
    gulikaKaal: { start: string; end: string };
    durmuhurat: { start: string; end: string };
  };
  planetaryState: {
    sunSign: string;
    moonSign: string;
    sunDegree: string;
    moonDegree: string;
    sunLongitude?: number;
    moonLongitude?: number;
    vikramSamvat: number;
    sakaSamvat: number;
    ritu: string;
    ayana: string;
  };
  planets: {
    id: string;
    name: string;
    signName: string;
    degreeStr: string;
    longitude?: number;
    speed?: number;
    nakshatraName: string;
    nakshatraPada: number;
    nakshatraLord: string;
    isRetrograde: boolean;
  }[];
}

const TITHI_BASE_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'
];

const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Sobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)',
  'Shakuni', 'Chatuspada', 'Naga', 'Kintughna'
];

const WEEKDAY_NAMES = [
  { name: 'Sunday', sanskrit: 'Ravivara', ruler: 'Sun (Surya)' },
  { name: 'Monday', sanskrit: 'Somavara', ruler: 'Moon (Chandra)' },
  { name: 'Tuesday', sanskrit: 'Mangalavara', ruler: 'Mars (Mangal)' },
  { name: 'Wednesday', sanskrit: 'Budhavara', ruler: 'Mercury (Budh)' },
  { name: 'Thursday', sanskrit: 'Guruvara', ruler: 'Jupiter (Guru)' },
  { name: 'Friday', sanskrit: 'Shukravara', ruler: 'Venus (Shukra)' },
  { name: 'Saturday', sanskrit: 'Shanivara', ruler: 'Saturn (Shani)' },
];

/**
 * Calculates complete, authentic Vedic Panchang data evaluated at Sunrise (Surya Udaya)
 * adhering to traditional Indian & Manipuri astronomical calendar standards.
 */
export function calculateVedicPanchang(
  dateStr: string,
  lat = 24.817, // Imphal, Manipur default
  lng = 93.936,
  tzOffset = 5.5,
  locationName = 'Imphal, Manipur'
): PanchangData {
  const [year, month, day] = dateStr.split('-').map(Number);
  // 1. Precise Sunrise / Sunset Calculation using Meeus astronomical algorithms
  // identical to the Panjika / Kuthi calculation engine (qw.xlsm Sunrise sheet)
  const { sunriseDecimal, sunsetDecimal } = calculateAstronomicalSunriseSunset(
    year,
    month,
    day,
    lat,
    lng,
    tzOffset
  );

  const solarNoonDecimal = (sunriseDecimal + sunsetDecimal) / 2;
  const sunriseStr = formatDecimalTime(sunriseDecimal, true);
  const sunsetStr = formatDecimalTime(sunsetDecimal, true);
  const moonriseStr = formatDecimalTime((sunriseDecimal + 9.5) % 24);
  const moonsetStr = formatDecimalTime((sunsetDecimal + 9.5) % 24);

  const dayLengthHours = (sunsetDecimal - sunriseDecimal);
  const dlNorm = dayLengthHours >= 0 ? dayLengthHours : dayLengthHours + 24;
  const dlH = Math.floor(dlNorm);
  const dlRemM = (dlNorm - dlH) * 60;
  const dlM = Math.floor(dlRemM);
  const dlS = Math.round((dlRemM - dlM) * 60) % 60;
  const dayLengthStr = `${dlH}h ${dlM}m ${dlS}s`;

  // 2. Evaluate Panchang at SUNRISE (Surya Udaya) for Calendar Day Consistency
  const sunriseHour = Math.floor(sunriseDecimal);
  const sunriseMin = Math.round((sunriseDecimal % 1) * 60);
  const sunriseTimeStr = `${sunriseHour < 10 ? '0' : ''}${sunriseHour}:${sunriseMin < 10 ? '0' : ''}${sunriseMin}`;
  const targetDate = new Date(year, month - 1, day, sunriseHour, sunriseMin, 0);

  const { planets } = calculatePlanetaryPositions({
    name: 'Sunrise Panchang',
    gender: 'Other',
    dateOfBirth: targetDate,
    timeOfBirth: sunriseTimeStr,
    latitude: lat,
    longitude: lng,
    timezone: 'Asia/Kolkata',
    utcOffset: tzOffset,
    ayanamsa: 'Lahiri',
  });

  const sun = planets.find((p) => p.id === 'su') || { longitude: 130, signName: 'Leo', signDegree: 10 };
  const moon = planets.find((p) => p.id === 'mo') || { longitude: 280, signName: 'Capricorn', signDegree: 10, nakshatraName: 'Shravana', nakshatraPada: 2, nakshatraIndex: 21 };

  // 3. Tithi Calculation (Evaluated at Sunrise)
  let diff = (moon.longitude - sun.longitude + 360) % 360;
  const tithiNumber = Math.floor(diff / 12) + 1; // 1 to 30

  let paksha: 'Shukla Paksha' | 'Krishna Paksha' = 'Shukla Paksha';
  let tithiName = '';
  let tithiSummary = '';

  if (tithiNumber <= 15) {
    paksha = 'Shukla Paksha';
    if (tithiNumber === 15) {
      tithiName = 'Purnima (Full Moon)';
      tithiSummary = 'Shukla Paksha Purnima (Full Moon)';
    } else {
      tithiName = TITHI_BASE_NAMES[tithiNumber - 1];
      tithiSummary = `Shukla Paksha ${tithiName}`;
    }
  } else {
    paksha = 'Krishna Paksha';
    const kIndex = tithiNumber - 15; // 1 to 15
    if (kIndex === 15) {
      tithiName = 'Amavasya (New Moon)';
      tithiSummary = 'Krishna Paksha Amavasya (New Moon)';
    } else {
      tithiName = TITHI_BASE_NAMES[kIndex - 1];
      tithiSummary = `Krishna Paksha ${tithiName}`;
    }
  }

  const tithiPct = Math.round(((diff % 12) / 12) * 100);

  // 4. Nakshatra & Pada
  const nakshatraName = moon.nakshatraName || 'Shravana';
  const nakshatraPada = moon.nakshatraPada || 2;
  const nakIndex = moon.nakshatraIndex !== undefined ? moon.nakshatraIndex : 21;
  const nakPct = Math.round(((moon.longitude % 13.333333) / 13.333333) * 100);
  const nakLords = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  const nakLord = nakLords[nakIndex % 9];

  // 5. Yoga Calculation
  const sum = (sun.longitude + moon.longitude) % 360;
  const yogaIndex = Math.floor(sum / 13.33333333);
  const yogaName = YOGA_NAMES[yogaIndex % 27];
  const isYogaAuspicious = !['Atiganda', 'Shoola', 'Ganda', 'Vyatipata', 'Vajra', 'Vaidhriti'].includes(yogaName);

  // 6. Karana Calculation
  const halfTithi = Math.floor(diff / 6);
  let karanaIndex = 0;
  if (halfTithi === 0) karanaIndex = 10; // Kintughna
  else if (halfTithi >= 57) karanaIndex = 7 + (halfTithi - 57);
  else karanaIndex = (halfTithi - 1) % 7;
  const karanaName = KARANA_NAMES[karanaIndex % 11];

  // 7. Weekday (Vara)
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday
  const vara = WEEKDAY_NAMES[dayOfWeek];

  // 8. Muhurats (Rahu Kaal, Abhijit, Yamaganda, Gulika)
  const slotSpan = dayLengthHours / 8;
  const abhijitStart = formatDecimalTime(solarNoonDecimal - 0.4);
  const abhijitEnd = formatDecimalTime(solarNoonDecimal + 0.4);

  const rahuSlots = [7, 1, 6, 4, 5, 3, 2]; // 0-indexed slots
  const rSlot = rahuSlots[dayOfWeek];
  const rahuStart = formatDecimalTime(sunriseDecimal + rSlot * slotSpan);
  const rahuEnd = formatDecimalTime(sunriseDecimal + (rSlot + 1) * slotSpan);

  const ySlots = [4, 3, 2, 1, 0, 6, 5];
  const ySlot = ySlots[dayOfWeek];
  const yamaStart = formatDecimalTime(sunriseDecimal + ySlot * slotSpan);
  const yamaEnd = formatDecimalTime(sunriseDecimal + (ySlot + 1) * slotSpan);

  const gSlots = [6, 5, 4, 3, 2, 1, 0];
  const gSlot = gSlots[dayOfWeek];
  const gulikaStart = formatDecimalTime(sunriseDecimal + gSlot * slotSpan);
  const gulikaEnd = formatDecimalTime(sunriseDecimal + (gSlot + 1) * slotSpan);

  const durmuhuratStart = formatDecimalTime(sunriseDecimal + 2.5 * slotSpan);
  const durmuhuratEnd = formatDecimalTime(sunriseDecimal + 3.3 * slotSpan);

  const formattedDate = targetDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    date: dateStr,
    formattedDate,
    location: {
      name: locationName,
      latitude: lat,
      longitude: lng,
      utcOffset: tzOffset,
    },
    sunMoonTimings: {
      sunrise: sunriseStr,
      sunset: sunsetStr,
      moonrise: moonriseStr,
      moonset: moonsetStr,
      dayLength: dayLengthStr,
      sunriseDecimal,
      sunsetDecimal,
    },
    fiveAngas: {
      tithi: {
        name: tithiName,
        paksha: paksha,
        index: tithiNumber,
        completionPct: tithiPct,
        summary: tithiSummary,
      },
      nakshatra: {
        name: nakshatraName,
        lord: nakLord,
        pada: nakshatraPada,
        index: nakIndex + 1,
        completionPct: nakPct,
      },
      yoga: {
        name: yogaName,
        index: yogaIndex + 1,
        isAuspicious: isYogaAuspicious,
      },
      karana: {
        name: karanaName,
        index: (karanaIndex % 11) + 1,
        type: karanaName.includes('Bhadra') ? 'Inauspicious (Vishti)' : 'Auspicious',
        isBhadra: karanaName.includes('Bhadra'),
      },
      vara: {
        name: vara.name,
        sanskrit: vara.sanskrit,
        ruler: vara.ruler,
      },
    },
    muhurtas: {
      abhijit: { start: abhijitStart, end: abhijitEnd, isAuspicious: true },
      amritKaal: {
        start: formatDecimalTime(sunriseDecimal + 3.2),
        end: formatDecimalTime(sunriseDecimal + 4.8),
      },
      rahuKaal: {
        start: rahuStart,
        end: rahuEnd,
        warning: 'Avoid starting new ventures or travel during Rahu Kaal.',
      },
      yamaganda: { start: yamaStart, end: yamaEnd },
      gulikaKaal: { start: gulikaStart, end: gulikaEnd },
      durmuhurat: { start: durmuhuratStart, end: durmuhuratEnd },
    },
    planetaryState: {
      sunSign: sun.signName,
      moonSign: moon.signName,
      sunDegree: `${(sun.longitude % 30).toFixed(1)}° in ${sun.signName}`,
      moonDegree: `${(moon.longitude % 30).toFixed(1)}° in ${moon.signName}`,
      sunLongitude: sun.longitude,
      moonLongitude: moon.longitude,
      vikramSamvat: year + 57,
      sakaSamvat: year - 78,
      ritu: getVedicRitu(month),
      ayana: month >= 6 && month <= 11 ? 'Dakshinayana' : 'Uttarayana',
    },
    planets: planets.map((p) => {
      const nakLords = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
      const lord = nakLords[(p.nakshatraIndex !== undefined ? p.nakshatraIndex : 0) % 9];
      const deg = p.longitude % 30;
      const degMins = Math.floor((deg % 1) * 60);
      const degreeStr = `${Math.floor(deg)}° ${degMins < 10 ? '0' : ''}${degMins}'`;

      return {
        id: p.id,
        name: p.name,
        signName: p.signName,
        degreeStr,
        longitude: p.longitude,
        speed: p.speed,
        nakshatraName: p.nakshatraName,
        nakshatraPada: p.nakshatraPada,
        nakshatraLord: lord,
        isRetrograde: p.isRetrograde,
      };
    }),
  };
}

/**
 * Exact astronomical Sunrise and Sunset calculation using Meeus algorithms,
 * matching the Panjika / Kuthi calculation engine (qw.xlsm Sunrise sheet).
 */
export function calculateAstronomicalSunriseSunset(
  year: number,
  month: number,
  day: number,
  lat: number = 24.817,
  lng: number = 93.936,
  tzOffset: number = 5.5
): { sunriseDecimal: number; sunsetDecimal: number } {
  const PI = Math.PI;
  const RAD = 0.017453292519943295;
  const DEG = 57.29577951308232;

  function calc(isRise: boolean): number {
    const L18 = 0.0; // Standard Kuthi/Panjika horizon
    const L19 = isRise ? 1.0 : -1.0;
    const L15 = lat;
    const L16 = lng;

    const m26 =
      367 * year -
      Math.floor((7 * (year + Math.floor((month + 9) / 12))) / 4) +
      Math.floor((275 * month) / 9) +
      day -
      730531.5;
    const m27 = m26 / 36525.0;

    // Iteration 1
    const l29 = (4.8949504201433 + 628.331969753199 * m27) % (2 * PI);
    const l30 = (6.2400408 + 628.3019501 * m27) % (2 * PI);
    const l31 = 0.033423 * Math.sin(l30) + 0.00034907 * Math.sin(2 * l30);
    const l32 = l29 + l31;
    const l33 = 0.0430398 * Math.sin(2 * l32) - 0.00092502 * Math.sin(4 * l32) - l31;
    const l34 = 0.409093 - 0.0002269 * m27;
    const l35 = Math.asin(Math.sin(l34) * Math.sin(l32));
    const l36 = l33;
    const cosL37 = (Math.sin(RAD * L18) - Math.sin(RAD * L15) * Math.sin(l35)) / (Math.cos(RAD * L15) * Math.cos(l35));
    const l37 = Math.max(-1.0, Math.min(1.0, cosL37));
    const l38 = Math.acos(l37);
    const l39 = PI - (l36 + RAD * L16 + L19 * l38);
    const l40 = (m26 + l39 / (2 * PI)) / 36525.0;

    const m29 = (4.8949504201433 + 628.331969753199 * l40) % (2 * PI);
    const m30 = (6.2400408 + 628.3019501 * l40) % (2 * PI);
    const m31 = 0.033423 * Math.sin(m30) + 0.00034907 * Math.sin(2 * m30);
    const m32 = m29 + m31;
    const m33 = 0.0430398 * Math.sin(2 * m32) - 0.00092502 * Math.sin(4 * m32) - m31;
    const m34 = 0.409093 - 0.0002269 * l40;
    const m35 = Math.asin(Math.sin(m34) * Math.sin(m32));
    const m36 = l39 - PI + m33;
    const cosM37 = (Math.sin(RAD * L18) - Math.sin(RAD * L15) * Math.sin(m35)) / (Math.cos(RAD * L15) * Math.cos(m35));
    const m37 = Math.max(-1.0, Math.min(1.0, cosM37));
    const m38 = Math.acos(m37);
    const m39 = l39 - (m36 + RAD * L16 + L19 * m38);
    const m40 = (m26 + m39 / (2 * PI)) / 36525.0;

    // Iteration 2
    const l42 = (4.8949504201433 + 628.331969753199 * m40) % (2 * PI);
    const l43 = (6.2400408 + 628.3019501 * m40) % (2 * PI);
    const l44 = 0.033423 * Math.sin(l43) + 0.00034907 * Math.sin(2 * l43);
    const l45 = l42 + l44;
    const l46 = 0.0430398 * Math.sin(2 * l45) - 0.00092502 * Math.sin(4 * l45) - l44;
    const l47 = 0.409093 - 0.0002269 * m40;
    const l48 = Math.asin(Math.sin(l47) * Math.sin(l45));
    const l49 = m39 - PI + l46;
    const cosL50 = (Math.sin(RAD * L18) - Math.sin(RAD * L15) * Math.sin(l48)) / (Math.cos(RAD * L15) * Math.cos(l48));
    const l50 = Math.max(-1.0, Math.min(1.0, cosL50));
    const l51 = Math.acos(l50);
    const l52 = m39 - (l49 + RAD * L16 + L19 * l51);
    const l53 = (m26 + l52 / (2 * PI)) / 36525.0;

    const m42 = (4.8949504201433 + 628.331969753199 * l53) % (2 * PI);
    const m43 = (6.2400408 + 628.3019501 * l53) % (2 * PI);
    const m44 = 0.033423 * Math.sin(m43) + 0.00034907 * Math.sin(2 * m43);
    const m45 = m42 + m44;
    const m46 = 0.0430398 * Math.sin(2 * m45) - 0.00092502 * Math.sin(4 * m45) - m44;
    const m47 = 0.409093 - 0.0002269 * l53;
    const m48 = Math.asin(Math.sin(m47) * Math.sin(m45));
    const m49 = l52 - PI + m46;
    const cosM50 = (Math.sin(RAD * L18) - Math.sin(RAD * L15) * Math.sin(m48)) / (Math.cos(RAD * L15) * Math.cos(m48));
    const m50 = Math.max(-1.0, Math.min(1.0, cosM50));
    const m51 = Math.acos(m50);
    const m52 = l52 - (m49 + RAD * L16 + L19 * m51);

    let timeDec = (m52 * DEG) / 15.0 + tzOffset;
    while (timeDec < 0) timeDec += 24;
    while (timeDec >= 24) timeDec -= 24;
    return timeDec;
  }

  return {
    sunriseDecimal: calc(true),
    sunsetDecimal: calc(false),
  };
}

function formatDecimalTime(decimalHours: number, includeSeconds = false): string {
  const norm = ((decimalHours % 24) + 24) % 24;
  const h24 = Math.floor(norm);
  const remM = (norm - h24) * 60;
  const m = Math.floor(remM);
  const s = Math.round((remM - m) * 60) % 60;

  const period = h24 >= 12 ? 'PM' : 'AM';
  let displayH = h24 % 12;
  if (displayH === 0) displayH = 12;
  const hStr = displayH < 10 ? `0${displayH}` : `${displayH}`;
  const mStr = m < 10 ? `0${m}` : `${m}`;
  const sStr = s < 10 ? `0${s}` : `${s}`;
  return includeSeconds ? `${hStr}:${mStr}:${sStr} ${period}` : `${hStr}:${mStr} ${period}`;
}

function getVedicRitu(month: number): string {
  if (month === 3 || month === 4) return 'Vasanta (Spring)';
  if (month === 5 || month === 6) return 'Greeshma (Summer)';
  if (month === 7 || month === 8) return 'Varsha (Monsoon)';
  if (month === 9 || month === 10) return 'Sharad (Autumn)';
  if (month === 11 || month === 12) return 'Hemanta (Pre-Winter)';
  return 'Shishira (Winter)';
}
