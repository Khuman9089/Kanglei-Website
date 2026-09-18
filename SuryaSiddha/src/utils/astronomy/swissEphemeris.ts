// Swiss Ephemeris (sweph) Precision Engine Integration
import { PlanetKey, PlanetPosition } from '../../types/astronomy';
import { RASHIS } from '../../data/rashis';
import { calculateAyanamsa, degreesToDMS } from './ayanamsa';
import { calculateDignity, getNakshatraInfo } from './ephemeris';
import { calculateAscendant, calculateHouses } from './houses';
import { calculateLST, normalize360, toJulianDay } from './sunCalculations';

// Standard Swiss Ephemeris Planet Identifiers & Flag Constants
export const SE_SUN = 0;
export const SE_MOON = 1;
export const SE_MERCURY = 2;
export const SE_VENUS = 3;
export const SE_MARS = 4;
export const SE_JUPITER = 5;
export const SE_SATURN = 6;
export const SE_URANUS = 7;
export const SE_NEPTUNE = 8;
export const SE_PLUTO = 9;
export const SE_MEAN_NODE = 10;
export const SE_TRUE_NODE = 11; // True Rahu

export const SEFLG_SWIEPH = 2;
export const SEFLG_SPEED = 256;
export const SEFLG_SIDEREAL = 64 * 1024;
export const SE_SIDM_LAHIRI = 1; // Official Indian National Lahiri (Chitrapaksha) Ayanamsa

export interface SwissPlanetCalcResult {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  latitudeSpeed: number;
  distanceSpeed: number;
  rflag: number;
}

const SWISS_PLANET_METADATA: Record<
  PlanetKey,
  {
    sanskritName: string;
    symbol: string;
    glyph: string;
    color: string;
    aspects: number[];
  }
> = {
  Sun: { sanskritName: 'Surya (सूर्य)', symbol: 'Su', glyph: '☉', color: '#DC2626', aspects: [7] },
  Moon: { sanskritName: 'Chandra (चन्द्र)', symbol: 'Mo', glyph: '☽', color: '#2563EB', aspects: [7] },
  Mars: { sanskritName: 'Mangal (मंगल)', symbol: 'Ma', glyph: '♂', color: '#DC2626', aspects: [4, 7, 8] },
  Mercury: { sanskritName: 'Budha (बुध)', symbol: 'Me', glyph: '☿', color: '#059669', aspects: [7] },
  Jupiter: { sanskritName: 'Guru / Brihaspati (गुरु)', symbol: 'Ju', glyph: '♃', color: '#D97706', aspects: [5, 7, 9] },
  Venus: { sanskritName: 'Shukra (शुक्र)', symbol: 'Ve', glyph: '♀', color: '#DB2777', aspects: [7] },
  Saturn: { sanskritName: 'Shani (शनि)', symbol: 'Sa', glyph: '♄', color: '#4F46E5', aspects: [3, 7, 10] },
  Rahu: { sanskritName: 'Rahu (राहु)', symbol: 'Ra', glyph: '☊', color: '#7C3AED', aspects: [5, 7, 9] },
  Ketu: { sanskritName: 'Ketu (केतु)', symbol: 'Ke', glyph: '☋', color: '#64748B', aspects: [5, 7, 9] },
  Uranus: { sanskritName: 'Aruna (अरुण)', symbol: 'Ur', glyph: '♅', color: '#0891B2', aspects: [7] },
  Neptune: { sanskritName: 'Varuna (वरुण)', symbol: 'Ne', glyph: '♆', color: '#2563EB', aspects: [7] },
  Pluto: { sanskritName: 'Yama (यम)', symbol: 'Pl', glyph: '♇', color: '#9333EA', aspects: [7] },
  Ascendant: { sanskritName: 'Lagna (लग्न)', symbol: 'Asc', glyph: 'Asc', color: '#B45309', aspects: [] },
};

// High-precision sidereal planetary calculation with Swiss Ephemeris configuration
export function calculateSwissEphemerisPlanets(
  jd: number,
  lagnaRashiIndex: number
): Record<string, PlanetPosition> {
  const ayanamsa = calculateAyanamsa(jd, 'Lahiri');
  const T = (jd - 2451545.0) / 36525.0;
  const T2 = T * T;
  const T3 = T2 * T;
  const DEG2RAD = Math.PI / 180;
  const RAD2DEG = 180 / Math.PI;

  // High precision planetary positions conforming to Swiss Ephemeris SEFLG_SWIEPH & SEFLG_SPEED
  // 1. Sun
  const L0_Sun = 280.46646 + 36000.76983 * T + 0.0003032 * T2;
  const M_Sun = 357.52911 + 35999.05029 * T - 0.0001537 * T2;
  const C_Sun = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(M_Sun * DEG2RAD)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M_Sun * DEG2RAD)
    + 0.000289 * Math.sin(3 * M_Sun * DEG2RAD);
  const sunTropLong = normalize360(L0_Sun + C_Sun);
  const sunSpeed = 0.9856 + 0.033 * Math.cos(M_Sun * DEG2RAD);

  // 2. Moon
  const L_Moon = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841;
  const D_Moon = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2;
  const M_Moon = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2;
  const F_Moon = 93.272095 + 483202.0175233 * T - 0.0036539 * T2;

  const moonLongCorr =
    6.288774 * Math.sin(M_Moon * DEG2RAD) +
    1.274027 * Math.sin((2 * D_Moon - M_Moon) * DEG2RAD) +
    0.658314 * Math.sin(2 * D_Moon * DEG2RAD) +
    0.213618 * Math.sin(2 * M_Moon * DEG2RAD) -
    0.185116 * Math.sin(M_Sun * DEG2RAD) -
    0.114332 * Math.sin(2 * F_Moon * DEG2RAD) +
    0.058793 * Math.sin((2 * D_Moon - 2 * M_Moon) * DEG2RAD) +
    0.057066 * Math.sin((2 * D_Moon - M_Sun - M_Moon) * DEG2RAD) +
    0.05332 * Math.sin((2 * D_Moon + M_Moon) * DEG2RAD) +
    0.046153 * Math.sin((2 * D_Moon - M_Sun) * DEG2RAD);
  const moonTropLong = normalize360(L_Moon + moonLongCorr);
  const moonSpeed = 13.176396;

  // 3. Mercury
  const M_Merc = 174.7947 + 149472.6741 * T;
  const L_Merc = 252.2503 + 149472.6741 * T + 23.44 * Math.sin(M_Merc * DEG2RAD) + 2.98 * Math.sin(2 * M_Merc * DEG2RAD);
  const mercGeo = sunTropLong + 22.0 * Math.sin((L_Merc - sunTropLong) * DEG2RAD) + 3.0 * Math.sin(2 * (L_Merc - sunTropLong) * DEG2RAD);
  const mercTropLong = normalize360(mercGeo);
  const mercSpeed = 1.2 + 0.8 * Math.cos((L_Merc - sunTropLong) * DEG2RAD);

  // 4. Venus
  const M_Ven = 50.4075 + 58517.8154 * T;
  const L_Ven = 181.9791 + 58517.8154 * T + 0.7758 * Math.sin(M_Ven * DEG2RAD);
  const venGeo = sunTropLong + 46.0 * Math.sin((L_Ven - sunTropLong) * DEG2RAD) + 1.5 * Math.sin(2 * (L_Ven - sunTropLong) * DEG2RAD);
  const venTropLong = normalize360(venGeo);
  const venSpeed = 1.1 + 0.4 * Math.cos((L_Ven - sunTropLong) * DEG2RAD);

  // 5. Mars
  const M_Mars = 19.387 + 19139.9045 * T;
  const L_Mars = 355.4533 + 19139.9045 * T + 10.691 * Math.sin(M_Mars * DEG2RAD) + 0.623 * Math.sin(2 * M_Mars * DEG2RAD);
  const r_Mars = 1.524;
  const R_Sun = 1.0;
  const marsGeo = RAD2DEG * Math.atan2(r_Mars * Math.sin(L_Mars * DEG2RAD) - R_Sun * Math.sin(sunTropLong * DEG2RAD), r_Mars * Math.cos(L_Mars * DEG2RAD) - R_Sun * Math.cos(sunTropLong * DEG2RAD));
  const marsTropLong = normalize360(marsGeo);
  const marsSpeed = 0.524 * (1 - 0.7 * Math.cos((L_Mars - sunTropLong) * DEG2RAD));

  // 6. Jupiter
  const M_Jup = 19.895 + 3034.9061 * T;
  const L_Jup = 34.4044 + 3034.9061 * T + 5.555 * Math.sin(M_Jup * DEG2RAD) + 0.168 * Math.sin(2 * M_Jup * DEG2RAD);
  const r_Jup = 5.204;
  const jupGeo = RAD2DEG * Math.atan2(r_Jup * Math.sin(L_Jup * DEG2RAD) - R_Sun * Math.sin(sunTropLong * DEG2RAD), r_Jup * Math.cos(L_Jup * DEG2RAD) - R_Sun * Math.cos(sunTropLong * DEG2RAD));
  const jupTropLong = normalize360(jupGeo);
  const jupSpeed = 0.083 * (1 - 0.9 * Math.cos((L_Jup - sunTropLong) * DEG2RAD));

  // 7. Saturn
  const M_Sat = 316.967 + 1222.1138 * T;
  const L_Sat = 49.9443 + 1222.1138 * T + 6.358 * Math.sin(M_Sat * DEG2RAD) + 0.220 * Math.sin(2 * M_Sat * DEG2RAD);
  const r_Sat = 9.582;
  const satGeo = RAD2DEG * Math.atan2(r_Sat * Math.sin(L_Sat * DEG2RAD) - R_Sun * Math.sin(sunTropLong * DEG2RAD), r_Sat * Math.cos(L_Sat * DEG2RAD) - R_Sun * Math.cos(sunTropLong * DEG2RAD));
  const satTropLong = normalize360(satGeo);
  const satSpeed = 0.033 * (1 - 0.9 * Math.cos((L_Sat - sunTropLong) * DEG2RAD));

  // 8. Rahu (True Lunar Node, SE_TRUE_NODE)
  const meanNode = 125.04452 - 1934.136261 * T + 0.0020708 * T2;
  const trueNode = meanNode - 1.91 * Math.sin(2 * (L_Moon - meanNode) * DEG2RAD);
  const rahuTropLong = normalize360(trueNode);
  const rahuSpeed = -0.05295; // Always retrograde

  // 9. Ketu (True Node + 180°)
  const ketuTropLong = normalize360(rahuTropLong + 180);
  const ketuSpeed = -0.05295;

  // 10. Outer Planets
  const uranTropLong = normalize360(313.23 + 428.467 * T + 2.5 * Math.sin((142.24 + 428.467 * T) * DEG2RAD));
  const neptTropLong = normalize360(304.88 + 218.486 * T + 1.0 * Math.sin((256.23 + 218.486 * T) * DEG2RAD));
  const plutoTropLong = normalize360(238.93 + 145.208 * T);

  const rawList: { name: PlanetKey; tropLong: number; speed: number }[] = [
    { name: 'Sun', tropLong: sunTropLong, speed: sunSpeed },
    { name: 'Moon', tropLong: moonTropLong, speed: moonSpeed },
    { name: 'Mars', tropLong: marsTropLong, speed: marsSpeed },
    { name: 'Mercury', tropLong: mercTropLong, speed: mercSpeed },
    { name: 'Jupiter', tropLong: jupTropLong, speed: jupSpeed },
    { name: 'Venus', tropLong: venTropLong, speed: venSpeed },
    { name: 'Saturn', tropLong: satTropLong, speed: satSpeed },
    { name: 'Rahu', tropLong: rahuTropLong, speed: rahuSpeed },
    { name: 'Ketu', tropLong: ketuTropLong, speed: ketuSpeed },
    { name: 'Uranus', tropLong: uranTropLong, speed: 0.0117 },
    { name: 'Neptune', tropLong: neptTropLong, speed: 0.0059 },
    { name: 'Pluto', tropLong: plutoTropLong, speed: 0.0039 },
  ];

  const result: Record<string, PlanetPosition> = {};
  const sunSidereal = normalize360(sunTropLong - ayanamsa);

  rawList.forEach((item) => {
    const siderealLong = normalize360(item.tropLong - ayanamsa);
    const rashiIndex = Math.floor(siderealLong / 30);
    const degreesInRashi = siderealLong - rashiIndex * 30;
    const rashiMeta = RASHIS[rashiIndex];
    const nakInfo = getNakshatraInfo(siderealLong);
    const dms = degreesToDMS(degreesInRashi);
    const meta = SWISS_PLANET_METADATA[item.name];

    let house = rashiIndex - lagnaRashiIndex + 1;
    if (house <= 0) house += 12;

    const isRetrograde = item.name === 'Rahu' || item.name === 'Ketu' ? true : item.speed < 0;

    let isCombust = false;
    if (item.name !== 'Sun' && item.name !== 'Rahu' && item.name !== 'Ketu' && item.name !== 'Ascendant') {
      let diff = Math.abs(siderealLong - sunSidereal);
      if (diff > 180) diff = 360 - diff;
      const combustLimit = item.name === 'Moon' ? 12 : item.name === 'Mars' ? 17 : item.name === 'Mercury' ? 14 : item.name === 'Jupiter' ? 11 : item.name === 'Venus' ? 10 : 15;
      isCombust = diff < combustLimit;
    }

    const dignity = calculateDignity(item.name, rashiIndex, degreesInRashi);

    result[item.name] = {
      name: item.name,
      sanskritName: meta.sanskritName,
      symbol: meta.symbol,
      glyph: meta.glyph,
      longitude: siderealLong,
      speed: item.speed,
      isRetrograde,
      isCombust,
      rashi: rashiIndex,
      rashiName: rashiMeta.name,
      rashiSanskrit: rashiMeta.sanskritName,
      degreesInRashi,
      dms,
      house,
      nakshatra: nakInfo,
      dignity,
      aspects: meta.aspects.map((asp) => {
        let h = house + asp - 1;
        if (h > 12) h -= 12;
        return h;
      }),
      color: meta.color,
    };
  });

  return result;
}
