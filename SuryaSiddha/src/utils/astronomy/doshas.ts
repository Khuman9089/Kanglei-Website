// Vedic Dosha Analytics: Manglik Dosha, Shani Sade Sati, Kaal Sarp
import { ManglikDoshaData, PlanetPosition, SadeSatiData, SadeSatiPhase } from '../../types/astronomy';
import { RASHIS } from '../../data/rashis';

export function calculateManglikDosha(
  planets: Record<string, PlanetPosition>,
  lagnaRashi: number
): ManglikDoshaData {
  const mars = planets.Mars;
  const moon = planets.Moon;
  const jupiter = planets.Jupiter;

  if (!mars || !moon) {
    return {
      isManglik: false,
      severity: 'None',
      marsHouseLagna: 1,
      marsHouseMoon: 1,
      cancellations: [],
      reasons: ['Planetary positions not found'],
      remedies: [],
    };
  }

  // Calculate Mars house from Lagna
  let marsHouseLagna = mars.rashi - lagnaRashi + 1;
  if (marsHouseLagna <= 0) marsHouseLagna += 12;

  // Calculate Mars house from Moon
  let marsHouseMoon = mars.rashi - moon.rashi + 1;
  if (marsHouseMoon <= 0) marsHouseMoon += 12;

  const manglikHouses = [1, 4, 7, 8, 12];
  const isFromLagna = manglikHouses.includes(marsHouseLagna);
  const isFromMoon = manglikHouses.includes(marsHouseMoon);

  const cancellations: string[] = [];
  const reasons: string[] = [];

  if (isFromLagna) {
    reasons.push(`Mars is placed in House ${marsHouseLagna} from Ascendant (Lagna).`);
  }
  if (isFromMoon) {
    reasons.push(`Mars is placed in House ${marsHouseMoon} from Moon sign (${moon.rashiName}).`);
  }

  if (!isFromLagna && !isFromMoon) {
    return {
      isManglik: false,
      severity: 'None',
      marsHouseLagna,
      marsHouseMoon,
      cancellations: [],
      reasons: ['Mars is placed in auspicious non-afflicting houses from both Lagna and Moon.'],
      remedies: [],
    };
  }

  // Classical Cancellation Conditions:
  // 1. Mars in Aries in 1st house
  if (marsHouseLagna === 1 && mars.rashi === 0) {
    cancellations.push('Mars in own sign (Aries) in the 1st house neutralizes Kuja Dosha (Brihat Parashara).');
  }
  // 2. Mars in Scorpio in 4th house
  if (marsHouseLagna === 4 && mars.rashi === 7) {
    cancellations.push('Mars in own sign (Scorpio) in the 4th house cancels affliction.');
  }
  // 3. Mars in Capricorn in 7th or 8th house (Exalted)
  if ((marsHouseLagna === 7 || marsHouseLagna === 8) && mars.rashi === 9) {
    cancellations.push('Mars is exalted (Uchha) in Capricorn in 7th/8th house, nullifying harmful results.');
  }
  // 4. Mars in Sagittarius or Pisces in 8th house
  if (marsHouseLagna === 8 && (mars.rashi === 8 || mars.rashi === 11)) {
    cancellations.push("Mars placed in Jupiter's signs (Sagittarius/Pisces) in the 8th house cancels Dosha.");
  }
  // 5. Jupiter aspect or conjunction on Mars
  if (jupiter) {
    let jupHouseLagna = jupiter.rashi - lagnaRashi + 1;
    if (jupHouseLagna <= 0) jupHouseLagna += 12;

    const jupAspects = jupiter.aspects || [];
    if (mars.rashi === jupiter.rashi) {
      cancellations.push('Jupiter is conjunct Mars (Guru-Mangal Yoga), neutralizing malefic Kuja vibrations.');
    } else if (jupAspects.includes(marsHouseLagna)) {
      cancellations.push('Divine aspect (Drishti) of benefic Jupiter falls directly upon Mars.');
    }
  }

  // 6. Moon conjunct Mars (Chandra Mangala)
  if (mars.rashi === moon.rashi) {
    cancellations.push('Mars is conjunct Moon forming the auspicious Chandra-Mangala Yoga.');
  }

  const isCancelled = cancellations.length > 0;
  let severity: 'None' | 'Mild' | 'Severe' | 'Cancelled' = 'Severe';

  if (isCancelled) {
    severity = 'Cancelled';
  } else if (!isFromLagna && isFromMoon) {
    severity = 'Mild'; // Anshik Manglik
  } else {
    severity = 'Severe';
  }

  const remedies = [
    'Chant the Mangal Gayatri or Hanuman Chalisa regularly on Tuesdays.',
    'Fast on Tuesdays or offer red flowers and sweet roti/ladoos at Lord Hanuman temple.',
    'Wear a Coral (Moonga) gemstone only if Mars is a functional benefic after thorough consultation.',
    'Perform Kumbh Vivah or Vishnu Pratima ritual if matching charts exhibit significant disparity.',
  ];

  return {
    isManglik: isFromLagna || isFromMoon,
    severity,
    marsHouseLagna,
    marsHouseMoon,
    cancellations,
    reasons,
    remedies: isCancelled ? [] : remedies,
  };
}

export function calculateSadeSati(
  natalMoonRashi: number,
  currentSaturnRashi: number = 10 // Current transit Saturn (e.g. Aquarius 10 / Pisces 11)
): SadeSatiData {
  const moonMeta = RASHIS[natalMoonRashi];
  const saturnMeta = RASHIS[currentSaturnRashi];

  // Calculate distance from Moon
  let diff = currentSaturnRashi - natalMoonRashi;
  if (diff < 0) diff += 12;

  let isUnderSadeSati = false;
  let currentPhase: SadeSatiData['currentPhase'] = 'None';
  let description = '';

  const rashiPrev = (natalMoonRashi + 11) % 12;
  const rashiCurr = natalMoonRashi;
  const rashiNext = (natalMoonRashi + 1) % 12;

  if (currentSaturnRashi === rashiPrev) {
    isUnderSadeSati = true;
    currentPhase = 'Phase 1: Rising (12th House from Moon)';
    description = `Saturn is transiting ${saturnMeta.name} (12th from natal Moon ${moonMeta.name}). This initial 2.5-year phase often prompts mental introspection, increased expenditures, and relocation.`;
  } else if (currentSaturnRashi === rashiCurr) {
    isUnderSadeSati = true;
    currentPhase = 'Phase 2: Peak (Moon Sign)';
    description = `Saturn is conjunct natal Moon in ${moonMeta.name}. This is the core 2.5-year peak phase demanding disciplined self-refinement, endurance, and structural foundation-building.`;
  } else if (currentSaturnRashi === rashiNext) {
    isUnderSadeSati = true;
    currentPhase = 'Phase 3: Setting (2nd House from Moon)';
    description = `Saturn is transiting ${saturnMeta.name} (2nd from natal Moon). The concluding 2.5-year phase brings stabilization, financial restructuring, and clarity after transformation.`;
  } else if (diff === 3) {
    currentPhase = 'Small Panoti / Kantaka Shani (4th House)';
    description = `Saturn transits the 4th house from Moon (${saturnMeta.name}), creating temporary Dhaiya pressures regarding home, comfort, or career adjustments.`;
  } else if (diff === 7) {
    currentPhase = 'Ashtama Shani (8th House)';
    description = `Saturn transits the 8th house from Moon (${saturnMeta.name}). Requires mindful health discipline, caution in joint finances, and deep spiritual sadhana.`;
  } else {
    description = `Saturn is transiting peacefully in ${saturnMeta.name} without creating direct Sade Sati or Dhaiya stress for ${moonMeta.name} Moon.`;
  }

  const timeline: SadeSatiPhase[] = [
    {
      phase: 'Phase 1: Rising (12th House)',
      sign: RASHIS[rashiPrev].name,
      signSanskrit: RASHIS[rashiPrev].sanskritName,
      status: currentSaturnRashi === rashiPrev ? 'Active' : currentSaturnRashi > rashiPrev ? 'Past' : 'Upcoming',
      period: '2.5 Years',
      description: 'Preparation, expenditure management, inner detachment.',
    },
    {
      phase: 'Phase 2: Peak (Core Moon)',
      sign: RASHIS[rashiCurr].name,
      signSanskrit: RASHIS[rashiCurr].sanskritName,
      status: currentSaturnRashi === rashiCurr ? 'Active' : currentSaturnRashi > rashiCurr ? 'Past' : 'Upcoming',
      period: '2.5 Years',
      description: 'Major karmic lessons, resilience, hard work, discipline.',
    },
    {
      phase: 'Phase 3: Setting (2nd House)',
      sign: RASHIS[rashiNext].name,
      signSanskrit: RASHIS[rashiNext].sanskritName,
      status: currentSaturnRashi === rashiNext ? 'Active' : 'Upcoming',
      period: '2.5 Years',
      description: 'Relief, recovery of resources, life wisdom solidified.',
    },
  ];

  const remedies = [
    'Recite the Shani Gayatri Mantra or Dasharatha Shani Stotram on Saturdays.',
    'Light a mustard or sesame oil lamp under a Peepal tree on Saturday evenings.',
    'Engage in selfless service, charitable acts for the elderly, disabled, or laborers.',
    'Practice daily meditation and maintain calm, disciplined speech and habits.',
  ];

  return {
    isUnderSadeSati,
    currentPhase,
    moonSign: `${moonMeta.name} (${moonMeta.sanskritName})`,
    saturnSign: `${saturnMeta.name} (${saturnMeta.sanskritName})`,
    description,
    remedies,
    timeline,
  };
}
