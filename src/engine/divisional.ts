import { PlanetPosition } from '../types/astrology';
import { ZODIAC_SIGNS } from './constants';

export function calculateNavamsha(longitude: number): { signIndex: number; signName: string; degree: number } {
  const normLong = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normLong / 30);
  const degreeInSign = normLong % 30;
  const navamshaPart = Math.floor(degreeInSign / (30 / 9)); // 3.333333
  
  // Element of sign:
  // Fire (Aries, Leo, Sag) = 0, 4, 8 -> start at Aries (0)
  // Earth (Taurus, Virgo, Cap) = 1, 5, 9 -> start at Capricorn (9)
  // Air (Gemini, Libra, Aqu) = 2, 6, 10 -> start at Libra (6)
  // Water (Cancer, Scorpio, Pisces) = 3, 7, 11 -> start at Cancer (3)
  
  let startSign = 0;
  if ([0, 4, 8].includes(signIndex)) startSign = 0;
  else if ([1, 5, 9].includes(signIndex)) startSign = 9;
  else if ([2, 6, 10].includes(signIndex)) startSign = 6;
  else if ([3, 7, 11].includes(signIndex)) startSign = 3;
  
  const navamshaSignIndex = (startSign + navamshaPart) % 12;
  const degree = (degreeInSign % (30 / 9)) * 9; // Map 3°20' to 30°
  
  return {
    signIndex: navamshaSignIndex,
    signName: ZODIAC_SIGNS[navamshaSignIndex].name,
    degree
  };
}

export function calculateAllNavamsha(planets: PlanetPosition[]): PlanetPosition[] {
  return planets.map(p => {
    const nav = calculateNavamsha(p.longitude);
    return {
      ...p,
      signIndex: nav.signIndex,
      signName: nav.signName,
      signDegree: nav.degree,
      // The navamsha chart essentially re-plots planets into signs
      longitude: nav.signIndex * 30 + nav.degree
    };
  });
}

/**
 * Calculate D10 (Dashamsha - Career & Great Successes) for a given longitude.
 * Rules:
 * - In Odd signs (0, 2, 4, 6, 8, 10): count starts from the sign itself.
 * - In Even signs (1, 3, 5, 7, 9, 11): count starts from the 9th sign from it.
 */
export function calculateDashamsha(longitude: number): { signIndex: number; signName: string; degree: number } {
  const normLong = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normLong / 30);
  const degreeInSign = normLong % 30;
  const part = Math.min(9, Math.floor(degreeInSign / 3)); // 10 parts of 3° each (0..9)

  const isOdd = signIndex % 2 === 0; // 0=Aries (Odd), 1=Taurus (Even), 2=Gemini (Odd)
  const startSign = isOdd ? signIndex : (signIndex + 8) % 12; // 9th from even sign (+8)
  const dashamshaSignIndex = (startSign + part) % 12;
  const degree = (degreeInSign % 3) * 10;

  return {
    signIndex: dashamshaSignIndex,
    signName: ZODIAC_SIGNS[dashamshaSignIndex]?.name || 'Unknown',
    degree,
  };
}

export function calculateAllDashamsha(planets: PlanetPosition[]): PlanetPosition[] {
  return planets.map(p => {
    const d10 = calculateDashamsha(p.longitude);
    return {
      ...p,
      signIndex: d10.signIndex,
      signName: d10.signName,
      signDegree: d10.degree,
      longitude: d10.signIndex * 30 + d10.degree,
    };
  });
}

