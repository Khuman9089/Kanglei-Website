import { HouseData, PlanetPosition } from '../types/astrology';
import { ZODIAC_SIGNS } from './constants';

export function getSignForDegree(degree: number): { signIndex: number; signName: string } {
  const normDegree = ((degree % 360) + 360) % 360;
  const signIndex = Math.floor(normDegree / 30);
  return {
    signIndex,
    signName: ZODIAC_SIGNS[signIndex].name
  };
}

export function calculateEqualHouses(ascendantDegree: number): HouseData[] {
  const houses: HouseData[] = [];
  const normAsc = ((ascendantDegree % 360) + 360) % 360;
  
  for (let i = 0; i < 12; i++) {
    const startDegree = (normAsc + i * 30) % 360;
    const endDegree = (startDegree + 30) % 360;
    const { signIndex, signName } = getSignForDegree(startDegree);
    
    houses.push({
      houseNumber: i + 1,
      signIndex,
      signName,
      startDegree,
      endDegree,
      planets: []
    });
  }
  
  return houses;
}

export function assignPlanetsToHouses(planets: PlanetPosition[], houses: HouseData[]): HouseData[] {
  const populatedHouses = houses.map(h => ({ ...h, planets: [] as PlanetPosition[] }));
  
  planets.forEach(p => {
    // Find which house the planet falls into based on start and end degree
    for (let i = 0; i < populatedHouses.length; i++) {
      const h = populatedHouses[i];
      let fallsIn = false;
      if (h.startDegree < h.endDegree) {
        fallsIn = p.longitude >= h.startDegree && p.longitude < h.endDegree;
      } else {
        // Crossing the 360 to 0 boundary
        fallsIn = p.longitude >= h.startDegree || p.longitude < h.endDegree;
      }
      
      if (fallsIn) {
        p.houseNumber = h.houseNumber;
        h.planets.push(p);
        break;
      }
    }
  });
  
  return populatedHouses;
}
