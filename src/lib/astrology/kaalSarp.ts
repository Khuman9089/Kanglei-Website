import { calculatePlanetaryPositions } from '@/engine/ephemeris';

export interface KaalSarpResult {
  nativeName: string;
  hasKaalSarp: boolean;
  doshType: string;
  doshTypeManipuri: string;
  classicalNumber: number; // 1 to 12
  direction: 'Udit (Kaal Sarp - Moving toward Rahu)' | 'Anudit (Kaal Amrit - Moving toward Ketu)' | 'None';
  intensity: 'Purna (Full)' | 'Anshik (Partial)' | 'None';
  rahuHouse: number;
  ketuHouse: number;
  rahuSign: string;
  ketuSign: string;
  planetsEnclosed: string[];
  planetsFree: string[];
  effects: {
    lifeDomain: string;
    impact: string;
  }[];
  classicalDescription: string;
  vedicRemedies: {
    shantiPuja: string;
    mantra: string;
    rudraksha: string;
    charity: string;
    specialDates: string;
  };
}

const KAAL_SARP_NAMES = [
  { no: 1, name: 'Anant Kaal Sarp Dosh (অনন্ত)', desc: 'Rahu in 1st House, Ketu in 7th House. Challenges self-confidence, delays marriage, promotes intense spiritual search.' },
  { no: 2, name: 'Kulik Kaal Sarp Dosh (কুলিক)', desc: 'Rahu in 2nd House, Ketu in 8th House. Tests financial savings, ancestral wealth, speech, and dental health.' },
  { no: 3, name: 'Vasuki Kaal Sarp Dosh (বাসুকি)', desc: 'Rahu in 3rd House, Ketu in 9th House. Strains sibling relations, creates travel hurdles and obstacles in fortune.' },
  { no: 4, name: 'Shankhpal Kaal Sarp Dosh (শঙ্খপাল)', desc: 'Rahu in 4th House, Ketu in 10th House. Brings domestic disturbances, mother health concerns, and property disputes.' },
  { no: 5, name: 'Padma Kaal Sarp Dosh (পদ্ম)', desc: 'Rahu in 5th House, Ketu in 11th House. Hurdles in education, progeny delays, speculative investments caution.' },
  { no: 6, name: 'Mahapadma Kaal Sarp Dosh (মহাপদ্ম)', desc: 'Rahu in 6th House, Ketu in 12th House. Creates hidden enemies, digestive weakness, but ultimate victory over rivals.' },
  { no: 7, name: 'Takshak Kaal Sarp Dosh (তক্ষক)', desc: 'Rahu in 7th House, Ketu in 1st House. Marital friction, business partnership friction, calls for patient negotiation.' },
  { no: 8, name: 'Karkotak Kaal Sarp Dosh (কার্কোটক)', desc: 'Rahu in 8th House, Ketu in 2nd House. Tests longevity, sudden fluctuations, inheritance delays, calls for spiritual devotion.' },
  { no: 9, name: 'Shankhachood Kaal Sarp Dosh (শঙ্খচূড়)', desc: 'Rahu in 9th House, Ketu in 3rd House. Ups and downs with father/guru, religious questioning, late blooming destiny.' },
  { no: 10, name: 'Ghatak Kaal Sarp Dosh (ঘাতক)', desc: 'Rahu in 10th House, Ketu in 4th House. High career ambition, frequent job transfers, conflict with superiors.' },
  { no: 11, name: 'Vishdhar Kaal Sarp Dosh (বিষধর)', desc: 'Rahu in 11th House, Ketu in 5th House. Fluctuating social circles, elder brother issues, deferred income realization.' },
  { no: 12, name: 'Sheshnaag Kaal Sarp Dosh (শেষনাগ)', desc: 'Rahu in 12th House, Ketu in 6th House. High expenditures, foreign settlement, litigation hurdles, spiritual liberation path.' },
];

const ZODIAC_SIGNS = [
  'Aries (মেষ)', 'Taurus (বৃষ)', 'Gemini (মিথুন)', 'Cancer (কর্কট)',
  'Leo (সিংহ)', 'Virgo (কন্যা)', 'Libra (তুলা)', 'Scorpio (বৃশ্চিক)',
  'Sagittarius (ধনু)', 'Capricorn (মকর)', 'Aquarius (কুম্ভ)', 'Pisces (মীন)'
];

/**
 * Calculates whether all physical planets are trapped between Rahu and Ketu.
 */
export function calculateKaalSarpDosh(params: {
  name?: string;
  gender?: string;
  dob: string;
  tob: string;
  lat?: number;
  lng?: number;
  timezone?: number;
}): KaalSarpResult {
  const chartData = calculatePlanetaryPositions({
    name: params.name || 'Native',
    gender: params.gender || 'Male',
    dateOfBirth: params.dob,
    timeOfBirth: params.tob || '12:00',
    latitude: params.lat || 24.8170,
    longitude: params.lng || 93.9368,
    timezone: 'Asia/Kolkata',
    utcOffset: params.timezone || 5.5,
    ayanamsa: 'Lahiri',
  });

  const ascSign = Math.floor(chartData.ascendant / 30);
  const rahu = chartData.planets.find(p => p.id === 'ra');
  const ketu = chartData.planets.find(p => p.id === 'ke');

  const rahuLong = rahu ? (rahu.signIndex * 30 + rahu.signDegree) : 0;
  const ketuLong = ketu ? (ketu.signIndex * 30 + ketu.signDegree) : 180;

  const rahuSign = rahu ? ZODIAC_SIGNS[rahu.signIndex] : 'Aries';
  const ketuSign = ketu ? ZODIAC_SIGNS[ketu.signIndex] : 'Libra';

  // Rahu House from Lagna (1-12)
  const rahuHouse = (((rahu ? rahu.signIndex : 0) - ascSign + 12) % 12) + 1;
  const ketuHouse = (((ketu ? ketu.signIndex : 6) - ascSign + 12) % 12) + 1;

  // Check the 7 planets: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
  const corePlanets = chartData.planets.filter(p => ['su', 'mo', 'ma', 'me', 'ju', 've', 'sa'].includes(p.id));

  const enclosedPlanets: string[] = [];
  const freePlanets: string[] = [];

  // Check if planet falls in arc from Rahu to Ketu
  // Arc 1: Rahu -> Ketu clockwise
  // Arc 2: Ketu -> Rahu clockwise
  let countInArc1 = 0;
  let countInArc2 = 0;

  corePlanets.forEach(p => {
    const pLong = p.signIndex * 30 + p.signDegree;
    const inArc1 = (rahuLong <= ketuLong)
      ? (pLong >= rahuLong && pLong <= ketuLong)
      : (pLong >= rahuLong || pLong <= ketuLong);

    if (inArc1) {
      countInArc1++;
      enclosedPlanets.push(p.name);
    } else {
      countInArc2++;
      freePlanets.push(p.name);
    }
  });

  const isAllInOneArc = countInArc1 === 7 || countInArc2 === 7;
  const isOneOut = countInArc1 === 6 || countInArc2 === 6;

  let hasKaalSarp = false;
  let intensity: KaalSarpResult['intensity'] = 'None';
  let direction: KaalSarpResult['direction'] = 'None';
  let classicalNumber = rahuHouse;
  let chosenDefinition = KAAL_SARP_NAMES[rahuHouse - 1] || KAAL_SARP_NAMES[0];
  let doshType = 'No Kaal Sarp Dosh';
  let doshTypeManipuri = 'কাল সর্প চৈথেং লৈতে (Free)';
  let classicalDescription = 'All planets are free from Rahu-Ketu containment axis. Auspicious planetary energy flows freely without malefic axis blockage.';

  if (isAllInOneArc) {
    hasKaalSarp = true;
    intensity = 'Purna (Full)';
    direction = countInArc1 === 7 ? 'Udit (Kaal Sarp - Moving toward Rahu)' : 'Anudit (Kaal Amrit - Moving toward Ketu)';
    doshType = chosenDefinition.name;
    doshTypeManipuri = `মপুং ফাবা কাল সর্প #${chosenDefinition.no} (${chosenDefinition.name.split(' ')[0]})`;
    classicalDescription = chosenDefinition.desc;
  } else if (isOneOut) {
    hasKaalSarp = true;
    intensity = 'Anshik (Partial)';
    direction = 'Udit (Kaal Sarp - Moving toward Rahu)';
    doshType = `Partial ${chosenDefinition.name}`;
    doshTypeManipuri = `অংশিক কাল সর্প #${chosenDefinition.no} (${chosenDefinition.name.split(' ')[0]})`;
    classicalDescription = `One planet escapes the serpent axis, creating an Anshik (partial) condition. ${chosenDefinition.desc} Effects are significantly reduced in severity.`;
  }

  const effects = [
    {
      lifeDomain: 'Early Life & Mental Peace',
      impact: hasKaalSarp
        ? 'Prone to sudden periods of restlessness, unusual dreams of snakes/water, or unexplainable delays despite high intellect.'
        : 'Smooth mental growth, stable sleep patterns, and natural emotional equilibrium.',
    },
    {
      lifeDomain: 'Career & Ambition',
      impact: hasKaalSarp
        ? 'Career success arrives after initial struggle. Post age 32 or 42, Rahu provides meteoric rise if ethical boundaries are respected.'
        : 'Steady, predictable professional growth aligned with educational qualifications.',
    },
    {
      lifeDomain: 'Relationships & Family Life',
      impact: hasKaalSarp
        ? 'Occasional trust deficits or external interference in family matters. Requires open communication.'
        : 'Harmonious domestic bond with steady familial support.',
    },
  ];

  const vedicRemedies = {
    shantiPuja: 'Kaal Sarp Dosh Shanti Puja or Nag Bali ritual at Trimbakeshwar (Nashik), Ujjain Mahakaleshwar, or local Shiva Temple.',
    mantra: 'ॐ नमः शिवाय (Om Namah Shivaya) & ॐ रां राहवे नमः (Om Ram Rahave Namah) — 108 times daily.',
    rudraksha: '8-Mukhi (Ganesh) or 9-Mukhi (Durga) Rudraksha worn on neck in silk thread.',
    charity: 'Donate lead (সীসা), black blankets, or sesame seeds on Amavasya (থাসি) or Saturday.',
    specialDates: 'Worship Nag Devta and offer milk on Nag Panchami (নাগ পঞ্চমী) day.',
  };

  return {
    nativeName: params.name || 'Native',
    hasKaalSarp,
    doshType,
    doshTypeManipuri,
    classicalNumber,
    direction,
    intensity,
    rahuHouse,
    ketuHouse,
    rahuSign,
    ketuSign,
    planetsEnclosed: hasKaalSarp ? enclosedPlanets : [],
    planetsFree: hasKaalSarp ? freePlanets : corePlanets.map(p => p.name),
    effects,
    classicalDescription,
    vedicRemedies,
  };
}
