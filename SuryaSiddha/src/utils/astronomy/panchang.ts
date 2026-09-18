// Full Astronomical Vedic Panchang Calculation Engine
import { KaranaData, NakshatraInfo, PanchangData, TithiData, VaraData, YogaData } from '../../types/astronomy';
import { calculateAyanamsa, formatDMS } from './ayanamsa';
import { calculateAllPlanets, getNakshatraInfo } from './ephemeris';
import { calculateSunTimes, normalize360, toJulianDay } from './sunCalculations';

const TITHI_NAMES = [
  'Pratipada (प्रतिपदा)',
  'Dwitiya (द्वितीया)',
  'Tritiya (तृतीया)',
  'Chaturthi (चतुर्थी)',
  'Panchami (पंचमी)',
  'Shashthi (षष्ठी)',
  'Saptami (सप्तमी)',
  'Ashtami (अष्टमी)',
  'Navami (नवमी)',
  'Dashami (दशमी)',
  'Ekadashi (एकादशी)',
  'Dwadashi (द्वादशी)',
  'Trayodashi (त्रयोदशी)',
  'Chaturdashi (चतुर्दशी)',
  'Purnima / Amavasya',
];

const TITHI_DEITIES = [
  'Agni',
  'Brahma',
  'Gauri',
  'Ganesha',
  'Sarpa (Naga)',
  'Kartikeya',
  'Surya',
  'Shiva / Rudra',
  'Durga',
  'Yama',
  'Vishva Devas',
  'Vishnu',
  'Kamadeva',
  'Shiva',
  'Chandra (Purnima) / Pitris (Amavasya)',
];

const VARA_NAMES = [
  { name: 'Sunday', sanskrit: 'Ravivara (रविवार)', lord: 'Surya (Sun)' },
  { name: 'Monday', sanskrit: 'Somavara (सोमवार)', lord: 'Chandra (Moon)' },
  { name: 'Tuesday', sanskrit: 'Mangalavara (मंगलवार)', lord: 'Mangal (Mars)' },
  { name: 'Wednesday', sanskrit: 'Budhavara (बुधवार)', lord: 'Budha (Mercury)' },
  { name: 'Thursday', sanskrit: 'Guruvara (गुरुवार)', lord: 'Brihaspati (Jupiter)' },
  { name: 'Friday', sanskrit: 'Shukravara (शुक्रवार)', lord: 'Shukra (Venus)' },
  { name: 'Saturday', sanskrit: 'Shanivara (शनिवार)', lord: 'Shani (Saturn)' },
];

const YOGA_DEFINITIONS: { name: string; sanskrit: string; auspicious: boolean; meaning: string }[] = [
  { name: 'Vishkambha', sanskrit: 'विष्कम्भ', auspicious: false, meaning: 'Obstacle / Pillar - best for overcoming enemies' },
  { name: 'Priti', sanskrit: 'प्रीति', auspicious: true, meaning: 'Love / Pleasure - ideal for reconciliation and celebrations' },
  { name: 'Ayushman', sanskrit: 'आयुष्मान्', auspicious: true, meaning: 'Longevity - blessed health and enduring works' },
  { name: 'Saubhagya', sanskrit: 'सौभाग्य', auspicious: true, meaning: 'Good Fortune - marital bliss and high prosperity' },
  { name: 'Shobhana', sanskrit: 'शोभन', auspicious: true, meaning: 'Splendid / Radiant - pure beauty and ceremonial success' },
  { name: 'Atiganda', sanskrit: 'अतिगण्ड', auspicious: false, meaning: 'Severe knots - delay critical beginnings' },
  { name: 'Sukarma', sanskrit: 'सुकर्मा', auspicious: true, meaning: 'Noble Works - magnificent for starting noble ventures' },
  { name: 'Dhriti', sanskrit: 'धृति', auspicious: true, meaning: 'Patience & Steadfastness - excellent for long-term foundations' },
  { name: 'Shoola', sanskrit: 'शूल', auspicious: false, meaning: 'Spear / Pain - avoid major journeys' },
  { name: 'Ganda', sanskrit: 'गण्ड', auspicious: false, meaning: 'Obstacle knot - spiritual practices recommended' },
  { name: 'Vriddhi', sanskrit: 'वृद्धि', auspicious: true, meaning: 'Growth & Expansion - excellent for investments' },
  { name: 'Dhruva', sanskrit: 'ध्रुव', auspicious: true, meaning: 'Constant & Permanent - ideal for coronation, house foundation' },
  { name: 'Vyaghata', sanskrit: 'व्याघात', auspicious: false, meaning: 'Striking / Ferocious - avoid starting peaceful events' },
  { name: 'Harshana', sanskrit: 'हर्षण', auspicious: true, meaning: 'Joyous / Thrilling - celebratory occasions, happiness' },
  { name: 'Vajra', sanskrit: 'वज्र', auspicious: false, meaning: 'Diamond / Thunderbolt - diamond cutting, martial action' },
  { name: 'Siddhi', sanskrit: 'सिद्धि', auspicious: true, meaning: 'Accomplishment - supreme success in endeavors' },
  { name: 'Vyatipata', sanskrit: 'व्यतीपात', auspicious: false, meaning: 'Calamity - introspection and charity favored' },
  { name: 'Variyan', sanskrit: 'वरीयान्', auspicious: true, meaning: 'Superior / Best - acquiring comforts and wealth' },
  { name: 'Parigha', sanskrit: 'परिघ', auspicious: false, meaning: 'Iron Bar - defensive and protective actions only' },
  { name: 'Shiva', sanskrit: 'शिव', auspicious: true, meaning: 'Auspicious & Pure - spiritual and worldly excellence' },
  { name: 'Siddha', sanskrit: 'सिद्ध', auspicious: true, meaning: 'Perfection - effortless attainment of objectives' },
  { name: 'Sadhya', sanskrit: 'साध्य', auspicious: true, meaning: 'Feasible / Achievable - accomplishment of difficult aims' },
  { name: 'Shubha', sanskrit: 'शुभ', auspicious: true, meaning: 'Auspicious - pristine good fortune' },
  { name: 'Shukla', sanskrit: 'शुक्ल', auspicious: true, meaning: 'Bright / Luminous - clarity and auspicious beginnings' },
  { name: 'Brahma', sanskrit: 'ब्रह्म', auspicious: true, meaning: 'Divine Creation - sacred rites and higher study' },
  { name: 'Indra', sanskrit: 'इन्द्र', auspicious: true, meaning: 'King of Gods - royal favor, leadership, authority' },
  { name: 'Vaidhriti', sanskrit: 'वैधृति', auspicious: false, meaning: 'Dissonance - best dedicated to meditation & remedies' },
];

const MOVABLE_KARANAS = [
  { name: 'Bava', sanskrit: 'बव', lord: 'Sun', deity: 'Indra' },
  { name: 'Balava', sanskrit: 'बालव', lord: 'Moon', deity: 'Brahma' },
  { name: 'Kaulava', sanskrit: 'कौलव', lord: 'Mars', deity: 'Mitra' },
  { name: 'Taitila', sanskrit: 'तैतिल', lord: 'Mercury', deity: 'Aryaman' },
  { name: 'Gara', sanskrit: 'गर', lord: 'Jupiter', deity: 'Bhaga' },
  { name: 'Vanija', sanskrit: 'वणिज', lord: 'Venus', deity: 'Manibhadra' },
  { name: 'Vishti (Bhadra)', sanskrit: 'विष्टि (भद्रा)', lord: 'Saturn', deity: 'Yama' },
];

const FIXED_KARANAS: Record<number, { name: string; sanskrit: string; lord: string; deity: string }> = {
  57: { name: 'Shakuni', sanskrit: 'शकुनि', lord: 'Rahu', deity: 'Kaliyuga' },
  58: { name: 'Chatushpada', sanskrit: 'चतुष्पद', lord: 'Ketu', deity: 'Vrishabha' },
  59: { name: 'Naga', sanskrit: 'नाग', lord: 'Rahu', deity: 'Serpent' },
  0: { name: 'Kimstughna', sanskrit: 'किंस्तुघ्न', lord: 'Venus', deity: 'Maruts' },
};

export function calculatePanchang(
  dateStr: string, // YYYY-MM-DD
  timeStr: string, // HH:MM
  lat: number,
  lng: number,
  tzOffset: number
): PanchangData {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const [hourStr, minStr] = timeStr.split(':');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);

  const hourUtc = hour + minute / 60 - tzOffset;
  const jd = toJulianDay(year, month, day, hourUtc);
  const ayanamsaVal = calculateAyanamsa(jd, 'Lahiri');

  // Sun and Moon positions
  const planets = calculateAllPlanets(jd, 0);
  const sunLong = planets.Sun.longitude;
  const moonLong = planets.Moon.longitude;

  // 1. Tithi Calculation
  let diff = normalize360(moonLong - sunLong);
  const tithiIndex = Math.floor(diff / 12) + 1; // 1 to 30
  const tithiFraction = (diff % 12) / 12;
  const tithiPercent = Math.round(tithiFraction * 100);

  const isShukla = tithiIndex <= 15;
  const paksha: 'Shukla' | 'Krishna' = isShukla ? 'Shukla' : 'Krishna';
  const pakshaHindi = isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';

  const tithiSubIndex = isShukla ? tithiIndex - 1 : tithiIndex - 16;
  const rawTithiName = TITHI_NAMES[tithiSubIndex];
  let tithiNameDisplay = `${paksha} ${rawTithiName}`;
  if (tithiIndex === 15) tithiNameDisplay = 'Shukla Purnima (पूर्णिमा)';
  if (tithiIndex === 30) tithiNameDisplay = 'Krishna Amavasya (अमावस्या)';

  // Approximate ending time in hours from current
  const remainingTithiHours = ((1 - tithiFraction) * 12) / ((13.176 - 0.9856) / 24);
  const endsAtHour = (hour + minute / 60 + remainingTithiHours) % 24;
  const endsAtTimeStr = `${String(Math.floor(endsAtHour)).padStart(2, '0')}:${String(Math.floor((endsAtHour % 1) * 60)).padStart(2, '0')}`;

  const tithiData: TithiData = {
    index: tithiIndex,
    name: tithiNameDisplay,
    sanskritName: tithiNameDisplay,
    paksha,
    pakshaHindi,
    completionPercent: tithiPercent,
    endsAt: `Ends approx ~${endsAtTimeStr}`,
    deity: TITHI_DEITIES[tithiSubIndex],
  };

  // 2. Vara Calculation (from Sunrise)
  const dObj = new Date(year, month - 1, day);
  const dayOfWeek = dObj.getDay(); // 0=Sunday
  const varaInfo = VARA_NAMES[dayOfWeek];
  const sunTimes = calculateSunTimes(year, month, day, lat, lng, tzOffset);

  const varaData: VaraData = {
    index: dayOfWeek,
    name: varaInfo.name,
    sanskritName: varaInfo.sanskrit,
    lord: varaInfo.lord,
    dayStartTime: `Sunrise ${sunTimes.sunrise.str}`,
  };

  // 3. Nakshatra Calculation
  const nakInfo = getNakshatraInfo(moonLong);
  const nakFraction = (moonLong % (360 / 27)) / (360 / 27);
  const nakPercent = Math.round(nakFraction * 100);
  const remainingNakHours = ((1 - nakFraction) * (360 / 27)) / (13.176 / 24);
  const endsAtNakHour = (hour + minute / 60 + remainingNakHours) % 24;
  const endsAtNakTimeStr = `${String(Math.floor(endsAtNakHour)).padStart(2, '0')}:${String(Math.floor((endsAtNakHour % 1) * 60)).padStart(2, '0')}`;

  const nakshatraData = {
    ...nakInfo,
    completionPercent: nakPercent,
    endsAt: `Ends approx ~${endsAtNakTimeStr}`,
  };

  // 4. Yoga Calculation (Sun + Moon)
  const yogaAngle = normalize360(sunLong + moonLong);
  const yogaIndex = Math.floor(yogaAngle / (360 / 27)); // 0 to 26
  const yogaFraction = (yogaAngle % (360 / 27)) / (360 / 27);
  const yogaPercent = Math.round(yogaFraction * 100);
  const yogaDef = YOGA_DEFINITIONS[yogaIndex % 27];

  const yogaData: YogaData = {
    index: yogaIndex + 1,
    name: yogaDef.name,
    sanskritName: yogaDef.sanskrit,
    completionPercent: yogaPercent,
    endsAt: `Active (${100 - yogaPercent}% remaining)`,
    meaning: yogaDef.meaning,
    isAuspicious: yogaDef.auspicious,
  };

  // 5. Karana Calculation (Half Tithi = 6°)
  const karanaIndex = Math.floor(diff / 6); // 0 to 59
  let karanaData: KaranaData;

  if (karanaIndex === 0) {
    karanaData = {
      index: 1,
      name: FIXED_KARANAS[0].name,
      sanskritName: FIXED_KARANAS[0].sanskrit,
      type: 'Fixed',
      lord: FIXED_KARANAS[0].lord,
      deity: FIXED_KARANAS[0].deity,
    };
  } else if (karanaIndex >= 57) {
    const fixed = FIXED_KARANAS[karanaIndex];
    karanaData = {
      index: karanaIndex + 1,
      name: fixed.name,
      sanskritName: fixed.sanskrit,
      type: 'Fixed',
      lord: fixed.lord,
      deity: fixed.deity,
    };
  } else {
    const movableIdx = (karanaIndex - 1) % 7;
    const movable = MOVABLE_KARANAS[movableIdx];
    karanaData = {
      index: karanaIndex + 1,
      name: movable.name,
      sanskritName: movable.sanskrit,
      type: 'Movable',
      lord: movable.lord,
      deity: movable.deity,
    };
  }

  // 6. Ritu (Seasons)
  const sunRashi = planets.Sun.rashi;
  const rituNames = [
    { name: 'Vasanta (Spring)', sanskrit: 'वसन्त ऋतु' }, // Pisces & Aries
    { name: 'Vasanta (Spring)', sanskrit: 'वसन्त ऋतु' },
    { name: 'Grishma (Summer)', sanskrit: 'ग्रीष्म ऋतु' }, // Taurus & Gemini
    { name: 'Grishma (Summer)', sanskrit: 'ग्रीष्म ऋतु' },
    { name: 'Varsha (Monsoon)', sanskrit: 'वर्षा ऋतु' }, // Cancer & Leo
    { name: 'Varsha (Monsoon)', sanskrit: 'वर्षा ऋतु' },
    { name: 'Sharad (Autumn)', sanskrit: 'शरद् ऋतु' }, // Virgo & Libra
    { name: 'Sharad (Autumn)', sanskrit: 'शरद् ऋतु' },
    { name: 'Hemanta (Pre-Winter)', sanskrit: 'हेमन्त ऋतु' }, // Scorpio & Sagittarius
    { name: 'Hemanta (Pre-Winter)', sanskrit: 'हेमन्त ऋतु' },
    { name: 'Shishira (Winter)', sanskrit: 'शिशिर ऋतु' }, // Capricorn & Aquarius
    { name: 'Shishira (Winter)', sanskrit: 'शिशिर ऋतु' },
  ];
  const ritu = rituNames[sunRashi] || { name: 'Vasanta', sanskrit: 'वसन्त ऋतु' };

  // 7. Samvats
  const vikramSamvat = year + (month > 3 || (month === 3 && day >= 22) ? 57 : 56);
  const shakaSamvat = year - (month > 3 || (month === 3 && day >= 22) ? 78 : 79);

  return {
    date: dateStr,
    time: timeStr,
    sunrise: sunTimes.sunrise.str,
    sunset: sunTimes.sunset.str,
    solarNoon: sunTimes.solarNoon.str,
    tithi: tithiData,
    vara: varaData,
    nakshatra: nakshatraData,
    yoga: yogaData,
    karana: karanaData,
    ayanamsa: {
      type: 'Lahiri (Chitrapaksha)',
      value: ayanamsaVal,
      formatted: formatDMS(ayanamsaVal),
    },
    ritu: {
      name: ritu.name,
      sanskritName: ritu.sanskrit,
    },
    samvat: {
      vikram: vikramSamvat,
      shaka: shakaSamvat,
    },
  };
}
