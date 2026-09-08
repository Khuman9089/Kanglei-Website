import { calculatePlanetaryPositions } from '@/engine/ephemeris';
import { getNakshatraInfo } from '@/engine/nakshatras';
import { calculateGunMilan } from '@/engine/matching';
import { calculateManglikDosh } from './manglik';

export interface MatchMakingResult {
  groomName: string;
  brideName: string;
  groomMoonSign: string;
  brideMoonSign: string;
  groomNakshatra: string;
  brideNakshatra: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  verdict: 'Excellent Match (অত্যন্ত উত্তম)' | 'Good Compatible Match (উত্তম)' | 'Average / Remedial Care Needed (মধ্যম)' | 'Inauspicious / Mismatched (অনুপযুক্ত)';
  verdictDescription: string;
  kootBreakdown: {
    kootName: string;
    maxPoints: number;
    obtainedPoints: number;
    description: string;
    significance: string;
    status: 'Pass' | 'Partial' | 'Fail';
  }[];
  nadiDoshAlert: boolean;
  nadiDoshDetails: string;
  bhakootDoshAlert: boolean;
  bhakootDoshDetails: string;
  groomManglik: {
    isManglik: boolean;
    status: string;
  };
  brideManglik: {
    isManglik: boolean;
    status: string;
  };
  manglikCompatibilityVerdict: string;
  remedies: string[];
}

const ZODIAC_SIGNS = [
  'Aries (মেষ)', 'Taurus (বৃষ)', 'Gemini (মিথুন)', 'Cancer (কর্কট)',
  'Leo (সিংহ)', 'Virgo (কন্যা)', 'Libra (তুলা)', 'Scorpio (বৃশ্চিক)',
  'Sagittarius (ধনু)', 'Capricorn (মকর)', 'Aquarius (কুম্ভ)', 'Pisces (মীন)'
];

/**
 * Calculates complete 8-Koot 36-Gun Milan matching with Manglik compatibility between Groom & Bride.
 */
export function calculateCoupleMatch(params: {
  groom: {
    name: string;
    dob: string;
    tob: string;
    pob?: string;
    lat?: number;
    lng?: number;
  };
  bride: {
    name: string;
    dob: string;
    tob: string;
    pob?: string;
    lat?: number;
    lng?: number;
  };
}): MatchMakingResult {
  // 1. Groom Chart & Moon
  const groomChart = calculatePlanetaryPositions({
    name: params.groom.name || 'Groom',
    gender: 'Male',
    dateOfBirth: params.groom.dob,
    timeOfBirth: params.groom.tob || '12:00',
    latitude: params.groom.lat || 24.8170,
    longitude: params.groom.lng || 93.9368,
    timezone: 'Asia/Kolkata',
    utcOffset: 5.5,
    ayanamsa: 'Lahiri',
  });

  // 2. Bride Chart & Moon
  const brideChart = calculatePlanetaryPositions({
    name: params.bride.name || 'Bride',
    gender: 'Female',
    dateOfBirth: params.bride.dob,
    timeOfBirth: params.bride.tob || '12:00',
    latitude: params.bride.lat || 24.8170,
    longitude: params.bride.lng || 93.9368,
    timezone: 'Asia/Kolkata',
    utcOffset: 5.5,
    ayanamsa: 'Lahiri',
  });

  const groomMoon = groomChart.planets.find(p => p.id === 'mo');
  const brideMoon = brideChart.planets.find(p => p.id === 'mo');

  const groomMoonLong = groomMoon ? (groomMoon.signIndex * 30 + groomMoon.signDegree) : 0;
  const brideMoonLong = brideMoon ? (brideMoon.signIndex * 30 + brideMoon.signDegree) : 0;

  const groomNak = getNakshatraInfo(groomMoonLong);
  const brideNak = getNakshatraInfo(brideMoonLong);

  const groomMoonSign = ZODIAC_SIGNS[groomMoon ? groomMoon.signIndex : 0];
  const brideMoonSign = ZODIAC_SIGNS[brideMoon ? brideMoon.signIndex : 0];

  // Gun Milan Calculation
  const matchingRaw = calculateGunMilan(groomMoonLong, brideMoonLong);
  const { breakdown, totalScore } = matchingRaw;

  // Check Nadi Dosh (8 pts)
  const nadiDoshAlert = breakdown.Nadi === 0;
  const nadiDoshDetails = nadiDoshAlert
    ? 'Both partners share the same physiological Nadi. This traditionally indicates genetic or health friction, but cancels if Nakshatras are different or Rashi lords are friends.'
    : 'Nadi energy flows harmoniously without physiological conflict.';

  // Check Bhakoot Dosh (7 pts)
  const bhakootDoshAlert = breakdown.Bhakoot === 0;
  const bhakootDoshDetails = bhakootDoshAlert
    ? 'Signs are in 2/12, 5/9, or 6/8 relative positions (Bhakoot Dosh). Indicates adjustment requirements in domestic finances or emotional mood rhythms.'
    : 'Bhakoot compatibility is auspicious, promoting mutual prosperity and understanding.';

  // Calculate Manglik Dosh for both
  const groomMangal = calculateManglikDosh({
    name: params.groom.name,
    gender: 'Male',
    dob: params.groom.dob,
    tob: params.groom.tob,
    lat: params.groom.lat,
    lng: params.groom.lng,
  });

  const brideMangal = calculateManglikDosh({
    name: params.bride.name,
    gender: 'Female',
    dob: params.bride.dob,
    tob: params.bride.tob,
    lat: params.bride.lat,
    lng: params.bride.lng,
  });

  let manglikCompatibilityVerdict = '';
  if (groomMangal.isManglik && brideMangal.isManglik) {
    manglikCompatibilityVerdict = 'Both partners are Manglik. By classical Vedic rules (Kuja Samya), the fiery dosha is mutually neutralized completely, yielding high marital stability.';
  } else if (!groomMangal.isManglik && !brideMangal.isManglik) {
    manglikCompatibilityVerdict = 'Neither partner has Manglik Dosh. Peaceful martial compatibility with natural planetary serenity.';
  } else {
    const manglikPerson = groomMangal.isManglik ? 'Groom' : 'Bride';
    manglikCompatibilityVerdict = `One partner (${manglikPerson}) has Manglik placement. Performing Kumbh Vivah or worshiping Lord Hanuman & Shiva prior to wedding effectively mitigates martial friction.`;
  }

  // Determine Verdict
  let verdict: MatchMakingResult['verdict'] = 'Good Compatible Match (উত্তম)';
  let verdictDescription = '';
  const percentage = Math.round((totalScore / 36) * 100);

  if (totalScore >= 28) {
    verdict = 'Excellent Match (অত্যন্ত উত্তম)';
    verdictDescription = 'Outstanding Vedic compatibility! High planetary harmony, mutual respect, and long-lasting marital prosperity are strongly indicated.';
  } else if (totalScore >= 18) {
    verdict = 'Good Compatible Match (উত্তম)';
    verdictDescription = 'Favorable compatibility meeting all standard Vedic astrological thresholds. The couple will enjoy good domestic understanding.';
  } else if (totalScore >= 14) {
    verdict = 'Average / Remedial Care Needed (মধ্যম)';
    verdictDescription = 'Moderate score with specific Koot friction areas. Proceeding with elder guidance and recommended Vedic shanti rituals is advised.';
  } else {
    verdict = 'Inauspicious / Mismatched (অনুপযুক্ত)';
    verdictDescription = 'Low score below 18 Gunas. Multiple fundamental Kootas (Nadi, Bhakoot, or Graha Maitri) conflict. Astrological consultation strongly recommended before finalizing alliance.';
  }

  const kootBreakdown: MatchMakingResult['kootBreakdown'] = [
    {
      kootName: '1. Varna (বর্ণ)',
      maxPoints: 1,
      obtainedPoints: breakdown.Varna,
      description: 'Spiritual ego, intellectual compatibility, and mutual deference.',
      significance: 'Ensures non-clashing egos and respectful division of responsibilities.',
      status: breakdown.Varna >= 1 ? 'Pass' : 'Fail',
    },
    {
      kootName: '2. Vashya (বশ্য)',
      maxPoints: 2,
      obtainedPoints: breakdown.Vashya,
      description: 'Mutual attraction, mental dominance balance, and emotional control.',
      significance: 'Maintains healthy balance of authority and affection.',
      status: breakdown.Vashya >= 1.5 ? 'Pass' : breakdown.Vashya > 0 ? 'Partial' : 'Fail',
    },
    {
      kootName: '3. Tara (তারা)',
      maxPoints: 3,
      obtainedPoints: breakdown.Tara,
      description: 'Birth star health, luck, longevity, and general destiny sync.',
      significance: 'Ensures high physical vitality and auspicious fortunes together.',
      status: breakdown.Tara >= 2 ? 'Pass' : breakdown.Tara > 0 ? 'Partial' : 'Fail',
    },
    {
      kootName: '4. Yoni (যোনি)',
      maxPoints: 4,
      obtainedPoints: breakdown.Yoni,
      description: 'Physical affinity, intimacy chemistry, and natural biological temperament.',
      significance: 'Prevents natural instinctual discord in intimate life.',
      status: breakdown.Yoni >= 3 ? 'Pass' : breakdown.Yoni >= 1 ? 'Partial' : 'Fail',
    },
    {
      kootName: '5. Graha Maitri (গ্রহ মৈত্রী)',
      maxPoints: 5,
      obtainedPoints: breakdown.GrahaMaitri,
      description: 'Psychological rapport, friendship of Moon lords, and communication style.',
      significance: 'Promotes deep day-to-day friendship, humor, and mutual understanding.',
      status: breakdown.GrahaMaitri >= 3.5 ? 'Pass' : breakdown.GrahaMaitri >= 1 ? 'Partial' : 'Fail',
    },
    {
      kootName: '6. Gana (গণ)',
      maxPoints: 6,
      obtainedPoints: breakdown.Gana,
      description: 'Behavioral demeanor, spiritual inclination, and lifestyle habits (Deva, Manushya, Rakshasa).',
      significance: 'Harmonizes daily routines, ethical values, and temperament.',
      status: breakdown.Gana >= 4 ? 'Pass' : breakdown.Gana >= 1 ? 'Partial' : 'Fail',
    },
    {
      kootName: '7. Bhakoot (ভকূট)',
      maxPoints: 7,
      obtainedPoints: breakdown.Bhakoot,
      description: 'Family welfare, progeny growth, financial expansion, and emotional depth.',
      significance: 'Protects the lineage and ensures collective household prosperity.',
      status: breakdown.Bhakoot >= 7 ? 'Pass' : 'Fail',
    },
    {
      kootName: '8. Nadi (নাড়ী)',
      maxPoints: 8,
      obtainedPoints: breakdown.Nadi,
      description: 'Physiological constitutions (Vata, Pitta, Kapha), genetics, and progeny health.',
      significance: 'The most important Koot; guarantees genetic compatibility and healthy children.',
      status: breakdown.Nadi >= 8 ? 'Pass' : 'Fail',
    },
  ];

  const remedies = [
    nadiDoshAlert ? 'Nadi Dosh Shanti Puja (নাড়ী দোষ শান্তি) or Mahamrityunjaya Japa to purify genetic and health energies.' : '',
    bhakootDoshAlert ? 'Worship of Radha-Krishna or offering gifts on Thursdays to foster unconditional love and overlook sign distance.' : '',
    (groomMangal.isManglik !== brideMangal.isManglik) ? 'Lord Shiva Abhishek & recitation of Hanuman Chalisa on Tuesdays.' : '',
    'Joint donation of sweet rice (পায়েস) or grain to temple priests on full moon days (পূর্নিমা).'
  ].filter(Boolean);

  return {
    groomName: params.groom.name || 'Groom',
    brideName: params.bride.name || 'Bride',
    groomMoonSign,
    brideMoonSign,
    groomNakshatra: `${groomNak.name} (Pada ${groomNak.pada})`,
    brideNakshatra: `${brideNak.name} (Pada ${brideNak.pada})`,
    totalScore,
    maxScore: 36,
    percentage,
    verdict,
    verdictDescription,
    kootBreakdown,
    nadiDoshAlert,
    nadiDoshDetails,
    bhakootDoshAlert,
    bhakootDoshDetails,
    groomManglik: {
      isManglik: groomMangal.isManglik,
      status: groomMangal.status,
    },
    brideManglik: {
      isManglik: brideMangal.isManglik,
      status: brideMangal.status,
    },
    manglikCompatibilityVerdict,
    remedies,
  };
}
