import { calculatePlanetaryPositions } from '@/engine/ephemeris';

export interface ManglikResult {
  nativeName: string;
  gender: string;
  isManglik: boolean;
  status: 'Purna Manglik (High)' | 'Anshik Manglik (Mild)' | 'Manglik Dosh Cancelled (Bhanga)' | 'Non-Manglik (Clean)';
  statusManipuri: string;
  score: number; // 0 to 100%
  placements: {
    fromReference: 'Ascendant (Lagna)' | 'Moon (Chandra)' | 'Venus (Shukra)';
    marsHouse: number;
    isDoshaPresent: boolean;
    description: string;
  }[];
  cancellations: {
    rule: string;
    description: string;
    isApplied: boolean;
  }[];
  effectsSummary: string;
  marriageGuidance: string;
  vedicRemedies: {
    ritual: string;
    mantra: string;
    gemstone: string;
    donation: string;
    lifestyle: string;
  };
}

/**
 * Calculates Mangal (Kuja) Dosha from Lagna, Moon, and Venus, with classical cancellations.
 */
export function calculateManglikDosh(params: {
  name?: string;
  gender?: string;
  dob: string;
  tob: string;
  lat?: number;
  lng?: number;
  timezone?: number;
}): ManglikResult {
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

  const mars = chartData.planets.find(p => p.id === 'ma');
  const moon = chartData.planets.find(p => p.id === 'mo');
  const venus = chartData.planets.find(p => p.id === 've');
  const jupiter = chartData.planets.find(p => p.id === 'ju');

  const ascSign = Math.floor(chartData.ascendant / 30);
  const marsSign = mars ? mars.signIndex : 0;
  const moonSign = moon ? moon.signIndex : 0;
  const venusSign = venus ? venus.signIndex : 0;
  const jupiterSign = jupiter ? jupiter.signIndex : 0;

  // House relative to Lagna (1-12)
  const marsFromLagna = ((marsSign - ascSign + 12) % 12) + 1;
  // House relative to Moon (1-12)
  const marsFromMoon = ((marsSign - moonSign + 12) % 12) + 1;
  // House relative to Venus (1-12)
  const marsFromVenus = ((marsSign - venusSign + 12) % 12) + 1;

  // Classical Manglik houses: 1, 2, 4, 7, 8, 12
  const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];

  const hasLagnaDosh = MANGLIK_HOUSES.includes(marsFromLagna);
  const hasMoonDosh = MANGLIK_HOUSES.includes(marsFromMoon);
  const hasVenusDosh = MANGLIK_HOUSES.includes(marsFromVenus);

  const placements: ManglikResult['placements'] = [
    {
      fromReference: 'Ascendant (Lagna)',
      marsHouse: marsFromLagna,
      isDoshaPresent: hasLagnaDosh,
      description: hasLagnaDosh
        ? `Mars is placed in House #${marsFromLagna} from Lagna. Contributes to energetic drive and marital assertiveness.`
        : `Mars is placed in House #${marsFromLagna} from Lagna, outside dosha zones. Favorable.`,
    },
    {
      fromReference: 'Moon (Chandra)',
      marsHouse: marsFromMoon,
      isDoshaPresent: hasMoonDosh,
      description: hasMoonDosh
        ? `Mars is placed in House #${marsFromMoon} from Moon. Influences emotional temperament and sensitivity.`
        : `Mars is placed in House #${marsFromMoon} from Moon. No lunar Manglik affliction.`,
    },
    {
      fromReference: 'Venus (Shukra)',
      marsHouse: marsFromVenus,
      isDoshaPresent: hasVenusDosh,
      description: hasVenusDosh
        ? `Mars is placed in House #${marsFromVenus} from Venus. Impacts romantic expectations and partnership chemistry.`
        : `Mars is placed in House #${marsFromVenus} from Venus. Harmony in passion.`,
    },
  ];

  // Evaluate Classical Cancellations (Kuja Dosha Bhanga)
  const cancellations: ManglikResult['cancellations'] = [
    {
      rule: 'Mars in Own Sign or Exalted',
      description: 'Mars in Aries (মেষ), Scorpio (বৃশ্চিক), or Capricorn (মকর) nullifies dosha through digbala and self-lordship.',
      isApplied: marsSign === 0 || marsSign === 7 || marsSign === 9,
    },
    {
      rule: 'Jupiter-Mars Conjunction or Aspect',
      description: 'Divine grace of Guru aspecting or conjunct Mars quells the aggressive heat of Kuja.',
      isApplied: marsSign === jupiterSign || (Math.abs(marsSign - jupiterSign) + 12) % 12 === 6 || (jupiterSign + 4) % 12 === marsSign || (jupiterSign + 8) % 12 === marsSign,
    },
    {
      rule: 'Chandra-Mangala Yoga Conjunction',
      description: 'Moon conjunct Mars transmutes martial friction into prosperity and mutual wealth.',
      isApplied: marsSign === moonSign,
    },
    {
      rule: 'Specific House-Sign Exemptions',
      description: 'Mars in Aries in 1st, Scorpio in 4th, Capricorn in 7th, Sagittarius in 8th, or Pisces in 12th is exempt.',
      isApplied: (marsFromLagna === 1 && marsSign === 0) || (marsFromLagna === 4 && marsSign === 7) || (marsFromLagna === 7 && marsSign === 9) || (marsFromLagna === 8 && marsSign === 8) || (marsFromLagna === 12 && marsSign === 11),
    },
  ];

  const anyCancellationApplied = cancellations.some(c => c.isApplied);
  const rawDoshaCount = (hasLagnaDosh ? 2 : 0) + (hasMoonDosh ? 1 : 0) + (hasVenusDosh ? 1 : 0);

  let isManglik = false;
  let status: ManglikResult['status'] = 'Non-Manglik (Clean)';
  let statusManipuri = 'মাঙ্গলিক চৈথেং লৈতে (Non-Manglik)';
  let score = 0;
  let effectsSummary = 'Your chart has no Manglik Dosh. Planetary placements support peaceful marital relationships and stable emotional bonding.';

  if (rawDoshaCount === 0) {
    isManglik = false;
    status = 'Non-Manglik (Clean)';
    statusManipuri = 'মাঙ্গলিক চৈথেং লৈতে (Non-Manglik)';
    score = 0;
  } else if (anyCancellationApplied) {
    isManglik = false;
    status = 'Manglik Dosh Cancelled (Bhanga)';
    statusManipuri = 'মাঙ্গলিক ভঙ্গ য়ৌরে (Dosha Cancelled)';
    score = 20;
    effectsSummary = 'Mangal placement was originally present, but classical Kuja Dosha Bhanga cancellation rules apply. The negative impacts are fully neutralized by benefic planetary aspects.';
  } else if (marsFromLagna === 7 || marsFromLagna === 8) {
    isManglik = true;
    status = 'Purna Manglik (High)';
    statusManipuri = 'মপুং ফাবা মাঙ্গলিক (Purna Manglik)';
    score = 85;
    effectsSummary = `Mars is placed in House #${marsFromLagna}. This creates intense martial energy in partnership and longevity houses. Marriage with another Manglik native or performing Vedic remedies is advised.`;
  } else {
    isManglik = true;
    status = 'Anshik Manglik (Mild)';
    statusManipuri = 'অংশিক মাঙ্গলিক (Anshik / Mild)';
    score = 45;
    effectsSummary = `Mars is placed in House #${marsFromLagna}. This is a mild (Anshik) Manglik condition, typically affecting communication or career adjustments rather than fundamental harmony.`;
  }

  const marriageGuidance = isManglik
    ? 'Pairing with another Manglik individual mutually cancels the dosha completely according to Brihat Parashara Hora Shastra. Performing standard remedies before solemnizing marriage ensures everlasting harmony.'
    : 'You can marry either a Non-Manglik or an Anshik Manglik partner without hesitation. Focus on standard Gun Milan matching.';

  const vedicRemedies = {
    ritual: 'Kumbh Vivah (কুম্ভ বিবাহ) or Vishnu Vivah prior to formal wedding for Purna Manglik natives.',
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः (Om Kram Kreem Kroum Sah Bhaumaya Namah) — 108 times on Tuesdays.',
    gemstone: 'Red Coral (পবা / Moonga) of 6-8 Ratti in copper or gold ring on right ring finger, ONLY if Mars is a functional benefic for the Lagna.',
    donation: 'Donate red lentils (মশুর দাল), copper utensils, or jaggery to temple priest or needy people on Tuesdays.',
    lifestyle: 'Recite Hanuman Chalisa daily and visit Lord Hanuman temple every Tuesday evening.',
  };

  return {
    nativeName: params.name || 'Native',
    gender: params.gender || 'Male',
    isManglik,
    status,
    statusManipuri,
    score,
    placements,
    cancellations,
    effectsSummary,
    marriageGuidance,
    vedicRemedies,
  };
}
