// Master Vedic Astronomical Calculation Coordinator
import { KundliData, UserBirthProfile } from '../../types/astronomy';
import { calculateAyanamsa } from './ayanamsa';
import { calculateVimshottariDasha } from './dasha';
import { generateDivisionalCharts } from './divisional';
import { calculateManglikDosha, calculateSadeSati } from './doshas';
import { calculateSwissEphemerisPlanets } from './swissEphemeris';
import { calculateAscendant, calculateHouses } from './houses';
import { calculateAuspiciousTimes } from './muhurta';
import { calculatePanchang } from './panchang';
import { calculateLST, toJulianDay } from './sunCalculations';
import { detectVedicYogas } from './yogas';

export function computeCompleteKundli(profile: UserBirthProfile, targetDate: Date = new Date()): KundliData {
  const [yearStr, monthStr, dayStr] = profile.dob.split('-');
  const [hourStr, minStr, secStr] = (profile.tob || '12:00:00').split(':');

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr || '0', 10);
  const sec = parseInt(secStr || '0', 10);

  const hourUtc = hour + minute / 60 + sec / 3600 - profile.timezone;
  const jd = toJulianDay(year, month, day, hourUtc);
  const lst = calculateLST(jd, profile.lng);

  // 1. Calculate Lagna (Ascendant) via Local Sidereal Time and Latitude
  const lagna = calculateAscendant(jd, lst, profile.lat);

  // 2. Calculate Sidereal Planets via Swiss Ephemeris Precision Engine
  const planets = calculateSwissEphemerisPlanets(jd, lagna.rashi);
  const planetList = Object.values(planets);

  // 3. Calculate 12 Houses (D1)
  const houses = calculateHouses(lagna.rashi, planets);

  // 4. Calculate Divisional Charts (D1, D9 Navamsha, D10 Dashamsha, Chandra, Surya)
  const divisionalCharts = generateDivisionalCharts(lagna.longitude, planets);

  // 5. Calculate Panchang
  const panchang = calculatePanchang(
    profile.dob,
    `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    profile.lat,
    profile.lng,
    profile.timezone
  );

  // 6. Calculate Muhurta & Choghadiya
  const muhurta = calculateAuspiciousTimes(
    profile.dob,
    `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    profile.lat,
    profile.lng,
    profile.timezone
  );

  // 7. Calculate 120-Year Vimshottari Dasha
  const moonLong = planets.Moon ? planets.Moon.longitude : 0;
  const dashaResult = calculateVimshottariDasha(moonLong, profile.dob, targetDate);

  // 8. Calculate Shani Sade Sati
  const moonRashi = planets.Moon ? planets.Moon.rashi : lagna.rashi;
  const sadeSati = calculateSadeSati(moonRashi, 11);

  // 9. Calculate Manglik Dosha
  const manglik = calculateManglikDosha(planets, lagna.rashi);

  // 10. Detect Vedic Yogas
  const yogas = detectVedicYogas(planets, lagna.rashi);

  return {
    user: profile,
    lagna,
    planets,
    planetList,
    houses,
    divisionalCharts,
    panchang,
    muhurta,
    dasha: {
      birthBalance: dashaResult.birthBalance,
      tree: dashaResult.tree,
      activePath: dashaResult.activePath,
    },
    sadeSati,
    manglik,
    yogas,
  };
}
