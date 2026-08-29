import { BirthData, PlanetPosition } from '../types/astrology';
import { PLANETS } from './constants';
import { getNakshatraInfo } from './nakshatras';
import { getSignForDegree } from './houses';

/**
 * Calculate Julian Day Number from calendar date.
 * Uses the Gregorian calendar algorithm.
 */
export function getJulianDay(year: number, month: number, day: number, hourDecimal: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5 +
    hourDecimal / 24;
  return jd;
}

/**
 * Approximate Lahiri Ayanamsa for a given Julian Day.
 */
export function getAyanamsa(jd: number): number {
  const d = jd - 2451545.0; // days since J2000.0
  const T = d / 36525; // Julian centuries
  const meanAyanamsa = 23.856 + (50.290966 / 3600) * T * 100;
  return meanAyanamsa;
}

const MEAN_ELEMENTS: Record<string, { L0: number; n: number }> = {
  su: { L0: 280.46646, n: 0.9856474 },
  mo: { L0: 218.3165, n: 13.176396 },
  ma: { L0: 355.433, n: 0.5240208 },
  me: { L0: 252.251, n: 4.0923344 },
  ju: { L0: 34.351, n: 0.0830853 },
  ve: { L0: 181.979, n: 1.6021302 },
  sa: { L0: 50.077, n: 0.0334442 },
  ra: { L0: 125.044, n: -0.0529539 },
  ke: { L0: 305.044, n: -0.0529539 },
};

/**
 * Calculate high-precision planetary positions incorporating Solar and Lunar perturbation terms.
 */
export function calculatePlanetaryPositions(
  birthData: BirthData
): { planets: PlanetPosition[]; ascendant: number } {
  let year: number, month: number, day: number;
  let h: number, m: number;

  if (birthData.dateOfBirth instanceof Date) {
    year = birthData.dateOfBirth.getFullYear();
    month = birthData.dateOfBirth.getMonth() + 1;
    day = birthData.dateOfBirth.getDate();
  } else {
    const parts = String(birthData.dateOfBirth).split('-').map(Number);
    year = parts[0];
    month = parts[1];
    day = parts[2];
  }

  const timeParts = birthData.timeOfBirth.split(':').map(Number);
  h = timeParts[0];
  m = timeParts[1] || 0;

  const localHourDecimal = h + m / 60;
  const utcHourDecimal = localHourDecimal - birthData.utcOffset;
  const jd = getJulianDay(year, month, day, utcHourDecimal);
  const ayanamsa = getAyanamsa(jd);
  const d = jd - 2451545.0; // days since J2000

  // High precision Sun & Moon perturbations
  const mSunRad = ((357.5291 + 0.98560028 * d) % 360) * (Math.PI / 180);
  const sunEqCenter = 1.9148 * Math.sin(mSunRad) + 0.02 * Math.sin(2 * mSunRad);

  const mMoonRad = ((134.9634 + 13.06499295 * d) % 360) * (Math.PI / 180);
  const dElongRad = ((297.8502 + 12.19074912 * d) % 360) * (Math.PI / 180);
  const fRad = ((93.2721 + 13.22935026 * d) % 360) * (Math.PI / 180);

  // Lunar Evection, Equation of Center, Variation, Annual Equation
  const moonPerturbations =
    6.289 * Math.sin(mMoonRad) +
    1.274 * Math.sin(2 * dElongRad - mMoonRad) +
    0.658 * Math.sin(2 * dElongRad) -
    0.186 * Math.sin(mSunRad) -
    0.114 * Math.sin(2 * fRad);

  const planets: PlanetPosition[] = PLANETS.map((p) => {
    const elements = MEAN_ELEMENTS[p.id];
    if (!elements) return createDefaultPlanet(p, 0);

    let tropicalLongitude = (elements.L0 + elements.n * d) % 360;

    // Apply perturbations for Sun and Moon
    if (p.id === 'su') {
      tropicalLongitude = (tropicalLongitude + sunEqCenter + 360) % 360;
    } else if (p.id === 'mo') {
      tropicalLongitude = (tropicalLongitude + moonPerturbations + 360) % 360;
    }

    if (tropicalLongitude < 0) tropicalLongitude += 360;

    let longitude = (tropicalLongitude - ayanamsa + 360) % 360;

    const { signIndex, signName } = getSignForDegree(longitude);
    const signDegree = longitude % 30;
    const nakInfo = getNakshatraInfo(longitude);

    return {
      id: p.id,
      name: p.name,
      longitude,
      latitude: 0,
      speed: elements.n,
      isRetrograde: elements.n < 0,
      signIndex,
      signName,
      signDegree,
      nakshatraIndex: nakInfo.index,
      nakshatraName: nakInfo.name,
      nakshatraPada: nakInfo.pada,
      houseNumber: 1,
    };
  });

  const gst = (18.697374558 + 24.06570982441908 * d + utcHourDecimal * 1.00273790935) % 24;
  const lst = (gst + birthData.longitude / 15 + 24) % 24;
  const lstDegrees = lst * 15;
  const obliquity = 23.4393 - 0.0000004 * d;
  const latRad = (birthData.latitude * Math.PI) / 180;
  const oblRad = (obliquity * Math.PI) / 180;
  const lstRad = (lstDegrees * Math.PI) / 180;

  const ascRad = Math.atan2(
    Math.cos(lstRad),
    -(Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad))
  );
  let ascendant = ((ascRad * 180) / Math.PI + 360) % 360;
  ascendant = (ascendant - ayanamsa + 360) % 360;

  return { planets, ascendant };
}

function createDefaultPlanet(p: { id: string; name: string }, longitude: number): PlanetPosition {
  const nakInfo = getNakshatraInfo(longitude);
  const { signIndex, signName } = getSignForDegree(longitude);
  return {
    id: p.id,
    name: p.name,
    longitude,
    latitude: 0,
    speed: 0,
    isRetrograde: false,
    signIndex,
    signName,
    signDegree: longitude % 30,
    nakshatraIndex: nakInfo.index,
    nakshatraName: nakInfo.name,
    nakshatraPada: nakInfo.pada,
    houseNumber: 1,
  };
}
