import { calculatePlanetaryPositions } from '@/engine/ephemeris';

export interface SadeSatiResult {
  nativeName: string;
  moonSign: string;
  moonSignIndex: number;
  moonDegree: number;
  currentSaturnSign: string;
  currentSaturnSignIndex: number;
  isSadeSatiActive: boolean;
  phase: 'Phase 1 (Rising)' | 'Phase 2 (Peak)' | 'Phase 3 (Setting)' | 'Small Panoti / Kantaka Shani (4th)' | 'Small Panoti / Ashtama Shani (8th)' | 'Free from Sade Sati';
  phaseManipuri: string;
  severity: 'High' | 'Moderate' | 'Mild' | 'None';
  statusDescription: string;
  cycleHistory: {
    cycleNumber: number;
    phaseName: string;
    description: string;
    estimatedYears: string;
    isCurrent: boolean;
  }[];
  impactAreas: {
    area: string;
    status: 'Positive' | 'Caution' | 'Challenging';
    detail: string;
  }[];
  vedicRemedies: {
    mantra: string;
    deity: string;
    charity: string;
    gemstoneGuidance: string;
    dailyPractice: string;
  };
}

const ZODIAC_SIGNS = [
  'Aries (মেষ)', 'Taurus (বৃষ)', 'Gemini (মিথুন)', 'Cancer (কর্কট)',
  'Leo (সিংহ)', 'Virgo (কন্যা)', 'Libra (তুলা)', 'Scorpio (বৃশ্চিক)',
  'Sagittarius (ধনু)', 'Capricorn (মকর)', 'Aquarius (কুম্ভ)', 'Pisces (মীন)'
];

/**
 * Calculates Shani Sade Sati and Dhaiya transit status for a native based on birth details.
 */
export function calculateSadeSati(params: {
  name?: string;
  gender?: string;
  dob: string;
  tob: string;
  lat?: number;
  lng?: number;
  timezone?: number;
}): SadeSatiResult {
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

  const moon = chartData.planets.find(p => p.id === 'mo');
  const moonLong = moon ? (moon.signIndex * 30 + moon.signDegree) : 0;
  const moonSignIndex = moon ? moon.signIndex : 0;
  const moonDegree = moon ? moon.signDegree : 0;
  const moonSignName = ZODIAC_SIGNS[moonSignIndex];

  // Current transit Saturn calculation (Approx current Saturn in Pisces / Aquarius in 2026)
  const now = new Date();
  const currentTransitData = calculatePlanetaryPositions({
    name: 'Current Transit',
    gender: 'Male',
    dateOfBirth: now.toISOString().split('T')[0],
    timeOfBirth: '12:00',
    latitude: 24.8170,
    longitude: 93.9368,
    timezone: 'Asia/Kolkata',
    utcOffset: 5.5,
    ayanamsa: 'Lahiri',
  });

  const transitSaturn = currentTransitData.planets.find(p => p.id === 'sa');
  const saturnSignIndex = transitSaturn ? transitSaturn.signIndex : 11; // Pisces in 2026
  const saturnSignName = ZODIAC_SIGNS[saturnSignIndex];

  // Difference from Moon sign to Saturn sign (0 to 11)
  const relativeDistance = (saturnSignIndex - moonSignIndex + 12) % 12;

  let isSadeSatiActive = false;
  let phase: SadeSatiResult['phase'] = 'Free from Sade Sati';
  let phaseManipuri = 'শানিশিংগী চৈথেং লৈতে (Sade Sati Free)';
  let severity: SadeSatiResult['severity'] = 'None';
  let statusDescription = 'You are currently not experiencing Shani Sade Sati. Shani transit is currently favorable or neutral for your Moon sign.';

  if (relativeDistance === 11) {
    // 12th house from Moon
    isSadeSatiActive = true;
    phase = 'Phase 1 (Rising)';
    phaseManipuri = 'অহানবা তাঙ্কক (Rising Phase - 12th House)';
    severity = 'Moderate';
    statusDescription = 'Saturn is transiting the 12th house from your natal Moon. This is the 1st Phase (Rising) of Sade Sati, emphasizing financial discipline, sleep hygiene, and spiritual contemplation.';
  } else if (relativeDistance === 0) {
    // 1st house from Moon (Conjunct)
    isSadeSatiActive = true;
    phase = 'Phase 2 (Peak)';
    phaseManipuri = 'মপুং ফাবা তাঙ্কক (Peak Phase - Janma Shani)';
    severity = 'High';
    statusDescription = 'Saturn is transiting directly over your natal Moon (Janma Shani). This is the Core / Peak Phase of Sade Sati, calling for maximum patience, mental endurance, and righteous ethical actions.';
  } else if (relativeDistance === 1) {
    // 2nd house from Moon
    isSadeSatiActive = true;
    phase = 'Phase 3 (Setting)';
    phaseManipuri = 'অরোইবা তাঙ্কক (Setting Phase - 2nd House)';
    severity = 'Mild';
    statusDescription = 'Saturn is transiting the 2nd house from your natal Moon. This is the Setting Phase of Sade Sati, bringing progressive relief, stabilizing family matters, and financial recovery.';
  } else if (relativeDistance === 3) {
    // 4th house from Moon (Kantaka Shani / Dhaiya)
    isSadeSatiActive = true;
    phase = 'Small Panoti / Kantaka Shani (4th)';
    phaseManipuri = 'কন্টক শনি ধাইয়া (Kantaka Shani Dhaiya)';
    severity = 'Moderate';
    statusDescription = 'Saturn is transiting the 4th house from your natal Moon (Kantaka Shani Dhaiya). This 2.5-year phase encourages grounding, domestic harmony, and vehicle safety.';
  } else if (relativeDistance === 7) {
    // 8th house from Moon (Ashtama Shani / Dhaiya)
    isSadeSatiActive = true;
    phase = 'Small Panoti / Ashtama Shani (8th)';
    phaseManipuri = 'অষ্টম শনি ধাইয়া (Ashtama Shani Dhaiya)';
    severity = 'High';
    statusDescription = 'Saturn is transiting the 8th house from your natal Moon (Ashtama Shani Dhaiya). This 2.5-year transit calls for utmost caution in contracts, health maintenance, and regular Vedic remedial prayers.';
  }

  // Generate 3 Cycles history across native life
  const birthYear = parseInt(params.dob.split('-')[0]) || 1995;
  const cycleHistory = [
    {
      cycleNumber: 1,
      phaseName: 'First Sade Sati Cycle (Early Life)',
      description: 'Impacts education, parent foundation, formative character building.',
      estimatedYears: `${birthYear + 15} – ${birthYear + 22}`,
      isCurrent: isSadeSatiActive && birthYear >= 2005,
    },
    {
      cycleNumber: 2,
      phaseName: 'Second Sade Sati Cycle (Prime Adulthood)',
      description: 'Major career transformation, karmic tests, marriage, and endurance.',
      estimatedYears: `${birthYear + 44} – ${birthYear + 51}`,
      isCurrent: isSadeSatiActive && birthYear >= 1975 && birthYear < 2005,
    },
    {
      cycleNumber: 3,
      phaseName: 'Third Sade Sati Cycle (Maturity & Wisdom)',
      description: 'Spiritual liberation, detachment, legacy, and inner peace.',
      estimatedYears: `${birthYear + 74} – ${birthYear + 81}`,
      isCurrent: isSadeSatiActive && birthYear < 1975,
    },
  ];

  const impactAreas: SadeSatiResult['impactAreas'] = [
    {
      area: 'Career & Professional Life',
      status: severity === 'High' ? 'Challenging' : severity === 'Moderate' ? 'Caution' : 'Positive',
      detail: isSadeSatiActive
        ? 'Avoid hurried career transitions. Methodical persistence and avoiding shortcuts bring steady progress under Shani Dev.'
        : 'Favorable professional growth. Saturn supports systematic endeavors and long-term projects.',
    },
    {
      area: 'Mental Peace & Focus',
      status: severity === 'High' ? 'Caution' : 'Positive',
      detail: isSadeSatiActive
        ? 'Mental anxiety or restlessness may arise. Daily meditation and reading Hanuman Chalisa provide peace.'
        : 'Equanimity and strong mental clarity prevail.',
    },
    {
      area: 'Finance & Investments',
      status: severity === 'High' ? 'Challenging' : severity === 'Moderate' ? 'Caution' : 'Positive',
      detail: isSadeSatiActive
        ? 'Avoid speculative stock trading or lending without formal paperwork. Focus on steady savings.'
        : 'Stable financial situation with positive returns from hard work.',
    },
    {
      area: 'Health & Vitality',
      status: severity === 'High' ? 'Caution' : 'Positive',
      detail: isSadeSatiActive
        ? 'Guard against joint stiffness, lower back pain, or fatigue. Prioritize balanced nutrition and adequate rest.'
        : 'Robust energy levels and good physical stamina.',
    },
  ];

  const vedicRemedies = {
    mantra: 'ॐ शं शनैश्चराय नमः (Om Sham Shanaishcharaya Namah) — Recite 108 times on Saturday evening.',
    deity: 'Lord Hanuman & Lord Shiva. Regular recitation of Hanuman Chalisa brings supreme shielding from Saturnian trials.',
    charity: 'Donate black sesame seeds (তিল), mustard oil (থাউ), or dark-colored blankets to the needy on Saturdays.',
    gemstoneGuidance: 'Blue Sapphire (নীলম) or Amethyst (কাটোয়া) must only be worn after thorough chart consultation. An energised Iron Ring (ঘোড়ার নাল) worn on the middle finger is generally safe.',
    dailyPractice: 'Light a mustard oil lamp (দিয়া) under a Peepal tree on Saturdays at sunset without looking back.',
  };

  return {
    nativeName: params.name || 'Native',
    moonSign: moonSignName,
    moonSignIndex,
    moonDegree,
    currentSaturnSign: saturnSignName,
    currentSaturnSignIndex: saturnSignIndex,
    isSadeSatiActive,
    phase,
    phaseManipuri,
    severity,
    statusDescription,
    cycleHistory,
    impactAreas,
    vedicRemedies,
  };
}
