// Divisional Charts (Vargas) Engine
import { DivisionalChart, House, PlanetPosition } from '../../types/astronomy';
import { RASHIS } from '../../data/rashis';
import { calculateHouses } from './houses';

// Helper to compute Navamsha sign for a given sidereal longitude
export function getNavamshaRashi(siderealLong: number): number {
  const rashi = Math.floor(siderealLong / 30);
  const degInRashi = siderealLong - rashi * 30;
  const navamshaIndex = Math.floor(degInRashi / (30 / 9)); // 0 to 8 (3°20' each)

  let startRashi = 0;
  const elementGroup = rashi % 4;
  if (elementGroup === 0) startRashi = 0; // Fire signs (Aries, Leo, Sag) -> Aries
  else if (elementGroup === 1) startRashi = 9; // Earth signs (Taurus, Virgo, Cap) -> Capricorn
  else if (elementGroup === 2) startRashi = 6; // Air signs (Gemini, Libra, Aqu) -> Libra
  else if (elementGroup === 3) startRashi = 3; // Water signs (Cancer, Scorpio, Pis) -> Cancer

  return (startRashi + navamshaIndex) % 12;
}

// Helper to compute Dashamsha (D10) sign
export function getDashamshaRashi(siderealLong: number): number {
  const rashi = Math.floor(siderealLong / 30);
  const degInRashi = siderealLong - rashi * 30;
  const part = Math.floor(degInRashi / 3); // 0 to 9 (3° each)

  // Odd signs: start from same sign
  // Even signs: start from 9th sign from itself
  const isOdd = rashi % 2 === 0; // 0=Aries (Odd in Vedic count)
  const startRashi = isOdd ? rashi : (rashi + 8) % 12;
  return (startRashi + part) % 12;
}

// Helper to compute Saptamsha (D7) sign
export function getSaptamshaRashi(siderealLong: number): number {
  const rashi = Math.floor(siderealLong / 30);
  const degInRashi = siderealLong - rashi * 30;
  const part = Math.floor(degInRashi / (30 / 7)); // 0 to 6

  const isOdd = rashi % 2 === 0;
  const startRashi = isOdd ? rashi : (rashi + 6) % 12;
  return (startRashi + part) % 12;
}

// Helper to compute Drekkana (D3) sign
export function getDrekkanaRashi(siderealLong: number): number {
  const rashi = Math.floor(siderealLong / 30);
  const degInRashi = siderealLong - rashi * 30;
  const part = Math.floor(degInRashi / 10); // 0, 1, 2

  if (part === 0) return rashi;
  if (part === 1) return (rashi + 4) % 12; // 5th sign
  return (rashi + 8) % 12; // 9th sign
}

export function generateDivisionalCharts(
  lagnaLong: number,
  planets: Record<string, PlanetPosition>
): Record<string, DivisionalChart> {
  const d1LagnaRashi = Math.floor(lagnaLong / 30);
  const d1Houses = calculateHouses(d1LagnaRashi, planets);

  // 1. D9 Navamsha Chart
  const d9LagnaRashi = getNavamshaRashi(lagnaLong);
  const d9Planets: Record<string, PlanetPosition> = {};
  Object.values(planets).forEach((p) => {
    const pNavRashi = getNavamshaRashi(p.longitude);
    let house = pNavRashi - d9LagnaRashi + 1;
    if (house <= 0) house += 12;

    d9Planets[p.name] = {
      ...p,
      rashi: pNavRashi,
      rashiName: RASHIS[pNavRashi].name,
      rashiSanskrit: RASHIS[pNavRashi].sanskritName,
      house,
    };
  });
  const d9Houses = calculateHouses(d9LagnaRashi, d9Planets);

  // 2. D10 Dashamsha Chart (Career & Status)
  const d10LagnaRashi = getDashamshaRashi(lagnaLong);
  const d10Planets: Record<string, PlanetPosition> = {};
  Object.values(planets).forEach((p) => {
    const pDashRashi = getDashamshaRashi(p.longitude);
    let house = pDashRashi - d10LagnaRashi + 1;
    if (house <= 0) house += 12;

    d10Planets[p.name] = {
      ...p,
      rashi: pDashRashi,
      rashiName: RASHIS[pDashRashi].name,
      rashiSanskrit: RASHIS[pDashRashi].sanskritName,
      house,
    };
  });
  const d10Houses = calculateHouses(d10LagnaRashi, d10Planets);

  // 3. Chandra Kundli (Moon Chart)
  const moonRashi = planets.Moon ? planets.Moon.rashi : d1LagnaRashi;
  const chandraPlanets: Record<string, PlanetPosition> = {};
  Object.values(planets).forEach((p) => {
    let house = p.rashi - moonRashi + 1;
    if (house <= 0) house += 12;
    chandraPlanets[p.name] = { ...p, house };
  });
  const chandraHouses = calculateHouses(moonRashi, chandraPlanets);

  // 4. Surya Kundli (Sun Chart)
  const sunRashi = planets.Sun ? planets.Sun.rashi : d1LagnaRashi;
  const suryaPlanets: Record<string, PlanetPosition> = {};
  Object.values(planets).forEach((p) => {
    let house = p.rashi - sunRashi + 1;
    if (house <= 0) house += 12;
    suryaPlanets[p.name] = { ...p, house };
  });
  const suryaHouses = calculateHouses(sunRashi, suryaPlanets);

  return {
    D1: {
      code: 'D1',
      name: 'Rashi (D1)',
      title: 'Lagna Chart - Physical Self & Life Path',
      houses: d1Houses,
      planets,
    },
    D9: {
      code: 'D9',
      name: 'Navamsha (D9)',
      title: 'Navamsha - Soul Destiny & Marriage',
      houses: d9Houses,
      planets: d9Planets,
    },
    D10: {
      code: 'D10',
      name: 'Dashamsha (D10)',
      title: 'Dashamsha - Career & Achievements',
      houses: d10Houses,
      planets: d10Planets,
    },
    Chandra: {
      code: 'Chandra',
      name: 'Chandra Kundli',
      title: 'Moon Chart - Mind & Emotional Framework',
      houses: chandraHouses,
      planets: chandraPlanets,
    },
    Surya: {
      code: 'Surya',
      name: 'Surya Kundli',
      title: 'Sun Chart - Vitality & Soul Purpose',
      houses: suryaHouses,
      planets: suryaPlanets,
    },
  };
}
