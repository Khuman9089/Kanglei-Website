// Ascendant (Lagna) and 12 Bhava (House) calculations
import { DMS, House, NakshatraInfo, PlanetPosition } from '../../types/astronomy';
import { RASHIS } from '../../data/rashis';
import { calculateAyanamsa, degreesToDMS } from './ayanamsa';
import { getNakshatraInfo } from './ephemeris';
import { DEG2RAD, julianCenturies, normalize360, RAD2DEG } from './sunCalculations';

export interface LagnaResult {
  longitude: number; // 0-360 sidereal
  rashi: number; // 0-11
  rashiName: string;
  rashiSanskrit: string;
  degree: number; // 0-30
  dms: DMS;
  nakshatra: NakshatraInfo;
}

// Calculate true Ascendant (Lagna) given Local Sidereal Time and Latitude
export function calculateAscendant(jd: number, lstDegrees: number, latitude: number): LagnaResult {
  const T = julianCenturies(jd);
  // Mean obliquity of ecliptic (Meeus formula)
  const eps0 = 23.43929111 - 0.013004167 * T - 0.000000164 * T * T + 0.0000005036 * T * T * T;
  const epsRad = eps0 * DEG2RAD;
  const latRad = latitude * DEG2RAD;
  const lstRad = lstDegrees * DEG2RAD;

  // Formula for Tropical Ascendant:
  // tan(Asc) = -cos(RAMC) / (sin(RAMC)*cos(eps) + tan(lat)*sin(eps))
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);

  let tropicalAsc = RAD2DEG * Math.atan2(y, x);
  tropicalAsc = normalize360(tropicalAsc);

  // Convert to Sidereal using Lahiri Ayanamsa
  const ayanamsa = calculateAyanamsa(jd, 'Lahiri');
  const siderealAsc = normalize360(tropicalAsc - ayanamsa);

  const rashiIndex = Math.floor(siderealAsc / 30);
  const degreeInRashi = siderealAsc - rashiIndex * 30;
  const rashiMeta = RASHIS[rashiIndex];
  const dms = degreesToDMS(degreeInRashi);
  const nakshatra = getNakshatraInfo(siderealAsc);

  return {
    longitude: siderealAsc,
    rashi: rashiIndex,
    rashiName: rashiMeta.name,
    rashiSanskrit: rashiMeta.sanskritName,
    degree: degreeInRashi,
    dms,
    nakshatra,
  };
}

const HOUSE_SIGNIFICATIONS = [
  ['Self, Physique, Vitality, Temperament, Appearance, Head'],
  ['Wealth, Speech, Family, Eye, Food, Liquid Assets'],
  ['Courage, Younger Siblings, Communication, Short Travel, Arms'],
  ['Mother, Home, Land, Vehicles, Happiness, Inner Peace, Chest'],
  ['Children, Intellect, Creativity, Past Karma (Purvapunya), Romance'],
  ['Enemies, Debts, Diseases, Service, Daily Routine, Competition'],
  ['Spouse, Partnerships, Business, Foreign Trade, Public Relations'],
  ['Longevity, Transformation, Occult, Sudden Events, Hidden Wealth'],
  ['Dharma, Father, Guru, Higher Knowledge, Long Journeys, Fortune'],
  ['Karma, Career, Status, Government, Fame, Authority, Knees'],
  ['Gains, Income, Elder Siblings, Aspirations, Social Circles'],
  ['Moksha, Losses, Foreign Lands, Sleep, Spiritual Retreat, Isolation'],
];

// Calculate 12 Houses (Whole Sign / Vedic Equal House)
export function calculateHouses(lagnaRashiIndex: number, planets: Record<string, PlanetPosition>): House[] {
  const houses: House[] = [];

  for (let h = 1; h <= 12; h++) {
    const rashiIndex = (lagnaRashiIndex + (h - 1)) % 12;
    const rashiMeta = RASHIS[rashiIndex];

    const housePlanets = Object.values(planets).filter((p) => p.rashi === rashiIndex);

    houses.push({
      number: h,
      rashi: rashiIndex,
      rashiName: rashiMeta.name,
      rashiSanskrit: rashiMeta.sanskritName,
      startDegree: rashiIndex * 30,
      midDegree: rashiIndex * 30 + 15,
      planets: housePlanets,
      significations: HOUSE_SIGNIFICATIONS[h - 1] || [],
    });
  }

  return houses;
}
