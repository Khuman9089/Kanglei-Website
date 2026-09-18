// Planetary Ephemeris Calculation Engine (Meeus / VSOP87 / ELP2000 algorithms)
import { Dignity, DMS, NakshatraInfo, PlanetKey, PlanetPosition } from '../../types/astronomy';
import { NAKSHATRAS } from '../../data/nakshatras';
import { RASHIS } from '../../data/rashis';
import { calculateAyanamsa, degreesToDMS } from './ayanamsa';
import { DEG2RAD, julianCenturies, normalize360, RAD2DEG, toJulianDay } from './sunCalculations';

export interface RawPlanetCoords {
  name: PlanetKey;
  longitude: number; // Tropical longitude in degrees
  speed: number; // Degrees per day
}

// Compute tropical planetary positions using astronomical series
export function getTropicalPlanetaryLongitudes(jd: number): RawPlanetCoords[] {
  const T = julianCenturies(jd);
  const T2 = T * T;
  const T3 = T2 * T;

  // 1. Sun
  const L0_Sun = 280.46646 + 36000.76983 * T + 0.0003032 * T2;
  const M_Sun = 357.52911 + 35999.05029 * T - 0.0001537 * T2;
  const C_Sun = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(M_Sun * DEG2RAD)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M_Sun * DEG2RAD)
    + 0.000289 * Math.sin(3 * M_Sun * DEG2RAD);
  const sunLong = normalize360(L0_Sun + C_Sun);
  const sunSpeed = 0.9856; // ~1 deg/day

  // 2. Moon (Chapront-Touzé simplified series)
  const L_Moon = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - (T2 * T2) / 65194000;
  const D_Moon = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868; // Elongation
  const M_Moon = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699; // Moon anomaly
  const M_SunM = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2;
  const F_Moon = 93.272095 + 483202.0175233 * T - 0.0036539 * T2; // Argument of latitude

  const moonLongCorr =
    6.288774 * Math.sin(M_Moon * DEG2RAD) +
    1.274027 * Math.sin((2 * D_Moon - M_Moon) * DEG2RAD) +
    0.658314 * Math.sin(2 * D_Moon * DEG2RAD) +
    0.213618 * Math.sin(2 * M_Moon * DEG2RAD) -
    0.185116 * Math.sin(M_SunM * DEG2RAD) -
    0.114332 * Math.sin(2 * F_Moon * DEG2RAD) +
    0.058793 * Math.sin((2 * D_Moon - 2 * M_Moon) * DEG2RAD) +
    0.057066 * Math.sin((2 * D_Moon - M_SunM - M_Moon) * DEG2RAD) +
    0.05332 * Math.sin((2 * D_Moon + M_Moon) * DEG2RAD) +
    0.046153 * Math.sin((2 * D_Moon - M_SunM) * DEG2RAD);
  const moonLong = normalize360(L_Moon + moonLongCorr);
  const moonSpeed = 13.176; // ~13.2 deg/day

  // 3. Mercury
  const M_Merc = 174.7947 + 149472.6741 * T;
  const L_Merc = 252.2503 + 149472.6741 * T + 23.44 * Math.sin(M_Merc * DEG2RAD) + 2.98 * Math.sin(2 * M_Merc * DEG2RAD);
  // Heliocentric to geocentric approximation
  const mercGeo = sunLong + 22.0 * Math.sin((L_Merc - sunLong) * DEG2RAD) + 3.0 * Math.sin(2 * (L_Merc - sunLong) * DEG2RAD);
  const mercLong = normalize360(mercGeo);
  // Mercury speed calculation approximation
  const mercSpeed = 1.2 + 0.8 * Math.cos((L_Merc - sunLong) * DEG2RAD);

  // 4. Venus
  const M_Ven = 50.4075 + 58517.8154 * T;
  const L_Ven = 181.9791 + 58517.8154 * T + 0.7758 * Math.sin(M_Ven * DEG2RAD);
  const venGeo = sunLong + 46.0 * Math.sin((L_Ven - sunLong) * DEG2RAD) + 1.5 * Math.sin(2 * (L_Ven - sunLong) * DEG2RAD);
  const venLong = normalize360(venGeo);
  const venSpeed = 1.1 + 0.4 * Math.cos((L_Ven - sunLong) * DEG2RAD);

  // 5. Mars
  const M_Mars = 19.387 + 19139.9045 * T;
  const L_Mars = 355.4533 + 19139.9045 * T + 10.691 * Math.sin(M_Mars * DEG2RAD) + 0.623 * Math.sin(2 * M_Mars * DEG2RAD);
  const r_Mars = 1.524;
  const R_Sun = 1.0;
  const marsDiff = (L_Mars - sunLong) * DEG2RAD;
  const marsGeo = RAD2DEG * Math.atan2(r_Mars * Math.sin(L_Mars * DEG2RAD) - R_Sun * Math.sin(sunLong * DEG2RAD), r_Mars * Math.cos(L_Mars * DEG2RAD) - R_Sun * Math.cos(sunLong * DEG2RAD));
  const marsLong = normalize360(marsGeo);
  const marsSpeed = 0.524 * (1 - 0.7 * Math.cos(marsDiff));

  // 6. Jupiter
  const M_Jup = 19.895 + 3034.9061 * T;
  const L_Jup = 34.4044 + 3034.9061 * T + 5.555 * Math.sin(M_Jup * DEG2RAD) + 0.168 * Math.sin(2 * M_Jup * DEG2RAD);
  const r_Jup = 5.204;
  const jupGeo = RAD2DEG * Math.atan2(r_Jup * Math.sin(L_Jup * DEG2RAD) - R_Sun * Math.sin(sunLong * DEG2RAD), r_Jup * Math.cos(L_Jup * DEG2RAD) - R_Sun * Math.cos(sunLong * DEG2RAD));
  const jupLong = normalize360(jupGeo);
  const jupSpeed = 0.083 * (1 - 0.9 * Math.cos((L_Jup - sunLong) * DEG2RAD));

  // 7. Saturn
  const M_Sat = 316.967 + 1222.1138 * T;
  const L_Sat = 49.9443 + 1222.1138 * T + 6.358 * Math.sin(M_Sat * DEG2RAD) + 0.220 * Math.sin(2 * M_Sat * DEG2RAD);
  const r_Sat = 9.582;
  const satGeo = RAD2DEG * Math.atan2(r_Sat * Math.sin(L_Sat * DEG2RAD) - R_Sun * Math.sin(sunLong * DEG2RAD), r_Sat * Math.cos(L_Sat * DEG2RAD) - R_Sun * Math.cos(sunLong * DEG2RAD));
  const satLong = normalize360(satGeo);
  const satSpeed = 0.033 * (1 - 0.9 * Math.cos((L_Sat - sunLong) * DEG2RAD));

  // 8. Rahu (Mean Lunar Node, always moves retrograde)
  const nodeLong = 125.04452 - 1934.136261 * T + 0.0020708 * T2;
  const rahuLong = normalize360(nodeLong);
  const rahuSpeed = -0.05295; // Mean motion ~ -3.18' per day

  // 9. Ketu (Opposite 180° to Rahu)
  const ketuLong = normalize360(rahuLong + 180);
  const ketuSpeed = -0.05295;

  // 10. Uranus
  const L_Uran = 313.23 + 428.467 * T + 2.5 * Math.sin((142.24 + 428.467 * T) * DEG2RAD);
  const uranLong = normalize360(L_Uran);
  const uranSpeed = 0.0117;

  // 11. Neptune
  const L_Nept = 304.88 + 218.486 * T + 1.0 * Math.sin((256.23 + 218.486 * T) * DEG2RAD);
  const neptLong = normalize360(L_Nept);
  const neptSpeed = 0.0059;

  // 12. Pluto
  const L_Pluto = 238.93 + 145.208 * T;
  const plutoLong = normalize360(L_Pluto);
  const plutoSpeed = 0.0039;

  return [
    { name: 'Sun', longitude: sunLong, speed: sunSpeed },
    { name: 'Moon', longitude: moonLong, speed: moonSpeed },
    { name: 'Mars', longitude: marsLong, speed: marsSpeed },
    { name: 'Mercury', longitude: mercLong, speed: mercSpeed },
    { name: 'Jupiter', longitude: jupLong, speed: jupSpeed },
    { name: 'Venus', longitude: venLong, speed: venSpeed },
    { name: 'Saturn', longitude: satLong, speed: satSpeed },
    { name: 'Rahu', longitude: rahuLong, speed: rahuSpeed },
    { name: 'Ketu', longitude: ketuLong, speed: ketuSpeed },
    { name: 'Uranus', longitude: uranLong, speed: uranSpeed },
    { name: 'Neptune', longitude: neptLong, speed: neptSpeed },
    { name: 'Pluto', longitude: plutoLong, speed: plutoSpeed },
  ];
}

export function getNakshatraInfo(siderealLong: number): NakshatraInfo {
  const norm = normalize360(siderealLong);
  const nakIndex = Math.floor(norm / (360 / 27)); // 13° 20' = 13.333333°
  const safeIndex = Math.min(26, Math.max(0, nakIndex));
  const nak = NAKSHATRAS[safeIndex];

  const degreeInNak = norm - nak.startDegree;
  const pada = Math.min(4, Math.floor(degreeInNak / (13.333333333333334 / 4)) + 1);

  return {
    index: nak.index,
    name: nak.name,
    sanskritName: nak.sanskritName,
    pada,
    lord: nak.lord,
    deity: nak.deity,
    symbol: nak.symbol,
    ganam: nak.ganam,
    nadi: nak.nadi,
    yoni: nak.yoni,
    varna: nak.varna,
    vashya: nak.vashya,
  };
}

export function calculateDignity(planet: PlanetKey, rashiIndex: number, degreesInRashi: number): Dignity {
  const rashi = RASHIS[rashiIndex];

  if (planet === 'Sun') {
    if (rashiIndex === 0) return degreesInRashi <= 10 ? 'Exalted' : 'Own'; // Aries 10°
    if (rashiIndex === 6) return 'Debilitated'; // Libra
    if (rashiIndex === 4) return degreesInRashi <= 20 ? 'Moolatrikona' : 'Own'; // Leo
    if ([3, 7, 8, 11].includes(rashiIndex)) return 'Friend';
    if ([1, 2, 5, 9, 10].includes(rashiIndex)) return 'Enemy';
    return 'Neutral';
  }

  if (planet === 'Moon') {
    if (rashiIndex === 1) return degreesInRashi <= 3 ? 'Exalted' : 'Moolatrikona'; // Taurus 3°
    if (rashiIndex === 7) return 'Debilitated'; // Scorpio
    if (rashiIndex === 3) return 'Own'; // Cancer
    if ([0, 2, 4, 5, 8, 11].includes(rashiIndex)) return 'Friend';
    return 'Neutral';
  }

  if (planet === 'Mars') {
    if (rashiIndex === 9) return degreesInRashi <= 28 ? 'Exalted' : 'Neutral'; // Capricorn 28°
    if (rashiIndex === 3) return 'Debilitated'; // Cancer
    if (rashiIndex === 0) return degreesInRashi <= 12 ? 'Moolatrikona' : 'Own'; // Aries
    if (rashiIndex === 7) return 'Own'; // Scorpio
    if ([4, 8, 11].includes(rashiIndex)) return 'Friend';
    if ([2, 5].includes(rashiIndex)) return 'Enemy';
    return 'Neutral';
  }

  if (planet === 'Mercury') {
    if (rashiIndex === 5) {
      if (degreesInRashi <= 15) return 'Exalted';
      if (degreesInRashi <= 20) return 'Moolatrikona';
      return 'Own';
    }
    if (rashiIndex === 11) return 'Debilitated'; // Pisces
    if (rashiIndex === 2) return 'Own'; // Gemini
    if ([0, 4, 6].includes(rashiIndex)) return 'Friend';
    if ([3].includes(rashiIndex)) return 'Enemy';
    return 'Neutral';
  }

  if (planet === 'Jupiter') {
    if (rashiIndex === 3) return degreesInRashi <= 5 ? 'Exalted' : 'Friend'; // Cancer 5°
    if (rashiIndex === 9) return 'Debilitated'; // Capricorn
    if (rashiIndex === 8) return degreesInRashi <= 10 ? 'Moolatrikona' : 'Own'; // Sagittarius
    if (rashiIndex === 11) return 'Own'; // Pisces
    if ([0, 4, 7].includes(rashiIndex)) return 'Friend';
    if ([2, 5, 6].includes(rashiIndex)) return 'Enemy';
    return 'Neutral';
  }

  if (planet === 'Venus') {
    if (rashiIndex === 11) return degreesInRashi <= 27 ? 'Exalted' : 'Friend'; // Pisces 27°
    if (rashiIndex === 5) return 'Debilitated'; // Virgo
    if (rashiIndex === 6) return degreesInRashi <= 15 ? 'Moolatrikona' : 'Own'; // Libra
    if (rashiIndex === 1) return 'Own'; // Taurus
    if ([2, 9, 10].includes(rashiIndex)) return 'Friend';
    if ([0, 4, 7].includes(rashiIndex)) return 'Enemy';
    return 'Neutral';
  }

  if (planet === 'Saturn') {
    if (rashiIndex === 6) return degreesInRashi <= 20 ? 'Exalted' : 'Friend'; // Libra 20°
    if (rashiIndex === 0) return 'Debilitated'; // Aries
    if (rashiIndex === 10) return degreesInRashi <= 20 ? 'Moolatrikona' : 'Own'; // Aquarius
    if (rashiIndex === 9) return 'Own'; // Capricorn
    if ([1, 2, 5].includes(rashiIndex)) return 'Friend';
    if ([0, 3, 4, 7].includes(rashiIndex)) return 'Enemy';
    return 'Neutral';
  }

  if (planet === 'Rahu') {
    if (rashiIndex === 1 || rashiIndex === 2) return 'Exalted';
    if (rashiIndex === 7 || rashiIndex === 8) return 'Debilitated';
    if (rashiIndex === 10) return 'Moolatrikona';
    return 'Neutral';
  }

  if (planet === 'Ketu') {
    if (rashiIndex === 7 || rashiIndex === 8) return 'Exalted';
    if (rashiIndex === 1 || rashiIndex === 2) return 'Debilitated';
    if (rashiIndex === 8) return 'Moolatrikona';
    return 'Neutral';
  }

  return 'Neutral';
}

const PLANET_METADATA: Record<PlanetKey, { sanskritName: string; symbol: string; glyph: string; color: string; aspects: number[] }> = {
  Sun: { sanskritName: 'Surya (सूर्य)', symbol: 'Su', glyph: '☉', color: '#F59E0B', aspects: [7] },
  Moon: { sanskritName: 'Chandra (चन्द्र)', symbol: 'Mo', glyph: '☽', color: '#E2E8F0', aspects: [7] },
  Mars: { sanskritName: 'Mangal (मंगल)', symbol: 'Ma', glyph: '♂', color: '#EF4444', aspects: [4, 7, 8] },
  Mercury: { sanskritName: 'Budha (बुध)', symbol: 'Me', glyph: '☿', color: '#10B981', aspects: [7] },
  Jupiter: { sanskritName: 'Guru / Brihaspati (गुरु)', symbol: 'Ju', glyph: '♃', color: '#FBBF24', aspects: [5, 7, 9] },
  Venus: { sanskritName: 'Shukra (शुक्र)', symbol: 'Ve', glyph: '♀', color: '#EC4899', aspects: [7] },
  Saturn: { sanskritName: 'Shani (शनि)', symbol: 'Sa', glyph: '♄', color: '#6366F1', aspects: [3, 7, 10] },
  Rahu: { sanskritName: 'Rahu (राहु)', symbol: 'Ra', glyph: '☊', color: '#8B5CF6', aspects: [5, 7, 9] },
  Ketu: { sanskritName: 'Ketu (केतु)', symbol: 'Ke', glyph: '☋', color: '#94A3B8', aspects: [5, 7, 9] },
  Uranus: { sanskritName: 'Aruna (अरुण)', symbol: 'Ur', glyph: '♅', color: '#06B6D4', aspects: [7] },
  Neptune: { sanskritName: 'Varuna (वरुण)', symbol: 'Ne', glyph: '♆', color: '#3B82F6', aspects: [7] },
  Pluto: { sanskritName: 'Yama (यम)', symbol: 'Pl', glyph: '♇', color: '#A855F7', aspects: [7] },
  Ascendant: { sanskritName: 'Lagna (लग्न)', symbol: 'Asc', glyph: 'Asc', color: '#D97706', aspects: [] },
};

// Calculate all sidereal positions for planets
export function calculateAllPlanets(jd: number, lagnaRashiIndex: number): Record<string, PlanetPosition> {
  const ayanamsa = calculateAyanamsa(jd, 'Lahiri');
  const tropicalList = getTropicalPlanetaryLongitudes(jd);

  const sunCoord = tropicalList.find((p) => p.name === 'Sun');
  const sunSidereal = sunCoord ? normalize360(sunCoord.longitude - ayanamsa) : 0;

  const result: Record<string, PlanetPosition> = {};

  tropicalList.forEach((tp) => {
    const siderealLong = normalize360(tp.longitude - ayanamsa);
    const rashiIndex = Math.floor(siderealLong / 30);
    const degreesInRashi = siderealLong - rashiIndex * 30;
    const rashiMeta = RASHIS[rashiIndex];
    const nakInfo = getNakshatraInfo(siderealLong);
    const dms = degreesToDMS(degreesInRashi);
    const meta = PLANET_METADATA[tp.name];

    // House calculation: Whole sign / Equal house from Lagna
    let house = rashiIndex - lagnaRashiIndex + 1;
    if (house <= 0) house += 12;

    // Retrograde: if speed is negative or Rahu/Ketu
    const isRetrograde = tp.name === 'Rahu' || tp.name === 'Ketu' ? true : tp.speed < 0;

    // Combust: angular distance to Sun is small (< 8 to 15 deg)
    let isCombust = false;
    if (tp.name !== 'Sun' && tp.name !== 'Rahu' && tp.name !== 'Ketu' && tp.name !== 'Ascendant') {
      let diff = Math.abs(siderealLong - sunSidereal);
      if (diff > 180) diff = 360 - diff;
      const combustLimit = tp.name === 'Moon' ? 12 : tp.name === 'Mars' ? 17 : tp.name === 'Mercury' ? 14 : tp.name === 'Jupiter' ? 11 : tp.name === 'Venus' ? 10 : 15;
      isCombust = diff < combustLimit;
    }

    const dignity = calculateDignity(tp.name, rashiIndex, degreesInRashi);

    result[tp.name] = {
      name: tp.name,
      sanskritName: meta.sanskritName,
      symbol: meta.symbol,
      glyph: meta.glyph,
      longitude: siderealLong,
      speed: tp.speed,
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
