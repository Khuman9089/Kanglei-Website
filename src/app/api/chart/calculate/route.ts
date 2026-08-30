import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

import { calculatePlanetaryPositions } from '@/engine/ephemeris';
import { calculateEqualHouses, assignPlanetsToHouses } from '@/engine/houses';
import { calculateVimshottariDasha } from '@/engine/dashas';
import { calculateAllNavamsha } from '@/engine/divisional';
import type { BirthData } from '@/types/astrology';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      gender,
      dateOfBirth,
      timeOfBirth,
      placeName,
      latitude,
      longitude,
      utcOffset,
      ayanamsa = 'LAHIRI',
    } = body;

    // Validate required fields
    if (!dateOfBirth || !timeOfBirth || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required birth details: date, time, latitude, longitude' },
        { status: 400 }
      );
    }

    // Parse date and time
    const [year, month, day] = dateOfBirth.split('-').map(Number);
    const [hours, minutes] = timeOfBirth.split(':').map(Number);

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
      return NextResponse.json(
        { error: 'Invalid date or time format. Use YYYY-MM-DD and HH:mm' },
        { status: 400 }
      );
    }

    // Construct birth data
    const birthData: BirthData = {
      name: name || 'Chart',
      gender: gender || 'OTHER',
      dateOfBirth: new Date(year, month - 1, day, hours, minutes),
      timeOfBirth: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone: 'UTC',
      utcOffset: parseFloat(utcOffset) || 5.5,
      ayanamsa: ayanamsa,
    };

    // Calculate planetary positions using the ephemeris engine
    const { planets, ascendant } = calculatePlanetaryPositions(birthData);

    // Calculate houses based on ascendant
    const houses = calculateEqualHouses(ascendant);

    // Assign planets to houses
    const housesWithPlanets = assignPlanetsToHouses(planets, houses);

    // Update planets with house numbers
    const planetsWithHouses = planets.map((planet) => {
      const house = housesWithPlanets.find((h) =>
        h.planets.some((p) => p.name === planet.name)
      );
      return {
        ...planet,
        houseNumber: house?.houseNumber || 1,
        shortName: getShortName(planet.name),
      };
    });

    // Find Moon for Dasha calculation
    const moon = planets.find((p) => p.name === 'Moon');
    if (!moon) {
      return NextResponse.json(
        { error: 'Could not calculate Moon position' },
        { status: 500 }
      );
    }

    // Calculate Vimshottari Dasha
    const dashas = calculateVimshottariDasha(moon.longitude, birthData.dateOfBirth);

    // Calculate Navamsha (D9)
    const navamshaPositions = calculateAllNavamsha(planets);

    // Get ascendant sign
    const ascendantSign = Math.floor(ascendant / 30);

    // Format the response
    const response = {
      name: birthData.name,
      birthDetails: {
        date: dateOfBirth,
        time: timeOfBirth,
        place: placeName || 'Unknown',
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        utcOffset: birthData.utcOffset,
        ayanamsa,
      },
      ascendant,
      ascendantSign,
      planets: planetsWithHouses.map((p) => ({
        name: p.name,
        shortName: getShortName(p.name),
        longitude: Math.round(p.longitude * 1000) / 1000,
        signIndex: p.signIndex,
        signName: p.signName,
        signDegree: Math.round(p.signDegree * 100) / 100,
        nakshatraName: p.nakshatraName,
        nakshatraPada: p.nakshatraPada,
        houseNumber: p.houseNumber,
        isRetrograde: p.isRetrograde,
      })),
      houses: housesWithPlanets.map((h) => ({
        houseNumber: h.houseNumber,
        signIndex: h.signIndex,
        signName: h.signName,
        startDegree: h.startDegree,
        endDegree: h.endDegree,
      })),
      dashas: dashas.map(formatDashaPeriod),
      navamsha: navamshaPositions.map((p) => ({
        name: p.name,
        signIndex: p.signIndex,
        signName: p.signName,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chart calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during chart calculation' },
      { status: 500 }
    );
  }
}

function getShortName(name: string): string {
  const shortNames: Record<string, string> = {
    Sun: 'Su',
    Moon: 'Mo',
    Mars: 'Ma',
    Mercury: 'Me',
    Jupiter: 'Ju',
    Venus: 'Ve',
    Saturn: 'Sa',
    Rahu: 'Ra',
    Ketu: 'Ke',
    Ascendant: 'As',
  };
  return shortNames[name] || name.substring(0, 2);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatDashaPeriod(period: any): any {
  return {
    lord: period.lord,
    startDate: period.startDate instanceof Date ? period.startDate.toISOString() : period.startDate,
    endDate: period.endDate instanceof Date ? period.endDate.toISOString() : period.endDate,
    durationYears: Math.round(period.durationYears * 100) / 100,
    level: period.level || 'maha',
    subPeriods: period.subPeriods ? period.subPeriods.map(formatDashaPeriod) : undefined,
  };
}
