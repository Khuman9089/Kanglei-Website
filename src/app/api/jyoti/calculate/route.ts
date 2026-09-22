import { NextRequest, NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';

function getJulianDay(year: number, month: number, day: number, hourDecimal: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5 +
    hourDecimal / 24
  );
}

function getAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.8570924 + 1.39688796 * T + 0.000307091 * T * T;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_RULERS = [
  'Mars', 'Venus', 'Mercury', 'Moon',
  'Sun', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Svati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const DASHA_LORDS = [
  { name: 'Ketu', years: 7 },
  { name: 'Venus', years: 20 },
  { name: 'Sun', years: 6 },
  { name: 'Moon', years: 10 },
  { name: 'Mars', years: 7 },
  { name: 'Rahu', years: 18 },
  { name: 'Jupiter', years: 16 },
  { name: 'Saturn', years: 19 },
  { name: 'Mercury', years: 17 }
];

const NAKSHATRA_SPAN = 360.0 / 27.0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { birthDateTime, latitude, longitude, timezoneOffset, ayanamsa = 'Lahiri' } = body;

    const bDate = new Date(birthDateTime || '1996-07-15T14:30:00Z');
    const lat = Number(latitude) || 24.8170;
    const lon = Number(longitude) || 93.9368;
    const tz = Number(timezoneOffset) || 5.5;

    const year = bDate.getUTCFullYear();
    const month = bDate.getUTCMonth() + 1;
    const day = bDate.getUTCDate();
    const localHour = bDate.getUTCHours() + bDate.getUTCMinutes() / 60.0;
    const utcHour = localHour - tz;

    const jd = getJulianDay(year, month, day, utcHour);
    const ayanamsaVal = getAyanamsa(jd);
    const astroTime = new Astronomy.AstroTime(new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60))));

    const planetDefs = [
      { id: 'su', name: 'Sun', glyph: '☉', body: Astronomy.Body.Sun },
      { id: 'mo', name: 'Moon', glyph: '☽', body: Astronomy.Body.Moon },
      { id: 'ma', name: 'Mars', glyph: '♂', body: Astronomy.Body.Mars },
      { id: 'me', name: 'Mercury', glyph: '☿', body: Astronomy.Body.Mercury },
      { id: 'ju', name: 'Jupiter', glyph: '♃', body: Astronomy.Body.Jupiter },
      { id: 've', name: 'Venus', glyph: '♀', body: Astronomy.Body.Venus },
      { id: 'sa', name: 'Saturn', glyph: '♄', body: Astronomy.Body.Saturn },
    ];

    const gmst = (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360.0;
    const lst = (gmst + lon + 360.0) % 360.0;
    const lstRad = (lst * Math.PI) / 180.0;
    const latRad = (lat * Math.PI) / 180.0;
    const eps = (23.439291 * Math.PI) / 180.0;
    const y = Math.cos(lstRad);
    const x = -(Math.sin(lstRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps));
    const tropAsc = ((Math.atan2(y, x) * 180.0) / Math.PI + 360.0) % 360.0;
    const siderealAsc = (tropAsc - ayanamsaVal + 360.0) % 360.0;
    const ascSignIdx = Math.floor(siderealAsc / 30.0) % 12;

    const planets = planetDefs.map((p) => {
      const vec = Astronomy.GeoVector(p.body, astroTime, true);
      const ecliptic = Astronomy.Ecliptic(vec);
      const siderealLong = ((ecliptic.elon - ayanamsaVal) % 360.0 + 360.0) % 360.0;
      const signIdx = Math.floor(siderealLong / 30.0) % 12;
      const degInSign = siderealLong % 30.0;
      const nakIdx = Math.floor(siderealLong / NAKSHATRA_SPAN) % 27;
      const pada = Math.floor((siderealLong % NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4.0)) + 1;
      const houseNumber = ((signIdx - ascSignIdx + 12) % 12) + 1;

      return {
        id: p.id,
        name: p.name,
        glyph: p.glyph,
        signName: ZODIAC_SIGNS[signIdx],
        signIndex: signIdx + 1,
        absoluteLongitude: siderealLong,
        degreeInSign: degInSign,
        nakshatra: NAKSHATRAS[nakIdx],
        nakshatraLord: DASHA_LORDS[nakIdx % 9].name,
        pada,
        houseNumber,
        isRetrograde: false,
        speed: 1.0,
        dignity: 'Neutral',
        element: ['Fire', 'Earth', 'Air', 'Water'][signIdx % 4],
      };
    });

    const bhavas = Array.from({ length: 12 }, (_, i) => {
      const houseNum = i + 1;
      const bhavaSignIdx = (ascSignIdx + i) % 12;
      const cuspDeg = (siderealAsc + i * 30.0) % 360.0;
      const occupying = planets.filter((p) => p.houseNumber === houseNum).map((p) => p.id);

      return {
        houseNumber: houseNum,
        signName: ZODIAC_SIGNS[bhavaSignIdx],
        signIndex: bhavaSignIdx + 1,
        cuspDegree: cuspDeg,
        startDegree: (cuspDeg - 15.0 + 360.0) % 360.0,
        endDegree: (cuspDeg + 15.0) % 360.0,
        occupyingPlanetIds: occupying,
        lord: SIGN_RULERS[bhavaSignIdx],
      };
    });

    return NextResponse.json({
      calculationTimestamp: new Date().toISOString(),
      ascendantDegree: siderealAsc,
      ascendantSign: ZODIAC_SIGNS[ascSignIdx],
      ascendantSignIndex: ascSignIdx + 1,
      ascendantNakshatra: NAKSHATRAS[Math.floor(siderealAsc / NAKSHATRA_SPAN) % 27],
      ayanamsaName: ayanamsa,
      ayanamsaValue: ayanamsaVal,
      planets,
      bhavas,
      dashas: [],
      dominantElement: 'Ether',
      chartRuler: SIGN_RULERS[ascSignIdx],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
