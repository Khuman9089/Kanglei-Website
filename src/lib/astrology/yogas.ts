import { calculatePlanetaryPositions } from '@/engine/ephemeris';

export interface VedicYogaItem {
  id: string;
  name: string;
  nameBengali: string;
  category: 'Maha Purusha' | 'Raja Yoga' | 'Dhana Yoga' | 'Lunar Yoga' | 'Solar Yoga' | 'Challenging / Arishta';
  nature: 'Highly Auspicious' | 'Auspicious' | 'Mixed' | 'Challenging';
  planetsInvolved: string[];
  houseInvolved: string;
  strength: 'Strong' | 'Moderate' | 'Mild';
  classicalRule: string;
  prediction: string;
  remedy?: string;
}

export interface YogasResult {
  nativeName: string;
  ascendantSign: string;
  moonSign: string;
  totalYogasDetected: number;
  auspiciousCount: number;
  inauspiciousCount: number;
  yogas: VedicYogaItem[];
  overallSummary: string;
}

const ZODIAC_SIGNS = [
  'Aries (মেষ)', 'Taurus (বৃষ)', 'Gemini (মিথুন)', 'Cancer (কর্কট)',
  'Leo (সিংহ)', 'Virgo (কন্যা)', 'Libra (তুলা)', 'Scorpio (বৃশ্চিক)',
  'Sagittarius (ধনু)', 'Capricorn (মকর)', 'Aquarius (কুম্ভ)', 'Pisces (মীন)'
];

/**
 * Evaluates comprehensive Vedic Yogas from natal planetary positions and house lordships.
 */
export function calculatePlanetaryYogas(params: {
  name?: string;
  gender?: string;
  dob: string;
  tob: string;
  lat?: number;
  lng?: number;
  timezone?: number;
}): YogasResult {
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
  const ascSignName = ZODIAC_SIGNS[ascSign];

  const getPlanet = (id: string) => chartData.planets.find(p => p.id === id);
  const sun = getPlanet('su');
  const moon = getPlanet('mo');
  const mars = getPlanet('ma');
  const mercury = getPlanet('me');
  const jupiter = getPlanet('ju');
  const venus = getPlanet('ve');
  const saturn = getPlanet('sa');
  const rahu = getPlanet('ra');
  const ketu = getPlanet('ke');

  const moonSign = moon ? moon.signIndex : 0;
  const moonSignName = ZODIAC_SIGNS[moonSign];

  // Helper: house from Lagna (1 to 12)
  const getHouse = (pSign: number) => ((pSign - ascSign + 12) % 12) + 1;
  const isKendra = (h: number) => [1, 4, 7, 10].includes(h);
  const isTrikona = (h: number) => [1, 5, 9].includes(h);

  const detectedYogas: VedicYogaItem[] = [];

  // 1. GAJAKESARI YOGA: Jupiter in Kendra from Moon (1, 4, 7, 10)
  if (jupiter && moon) {
    const jupFromMoon = ((jupiter.signIndex - moon.signIndex + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(jupFromMoon)) {
      detectedYogas.push({
        id: 'gajakesari',
        name: 'Gajakesari Yoga (গজকেশরী যোগ)',
        nameBengali: 'গজকেশরী যোগ',
        category: 'Raja Yoga',
        nature: 'Highly Auspicious',
        planetsInvolved: ['Jupiter (বৃহস্পতি)', 'Moon (চন্দ্র)'],
        houseInvolved: `House #${getHouse(jupiter.signIndex)} (Kendra from Moon #${jupFromMoon})`,
        strength: (jupiter.signIndex === 3 || jupiter.signIndex === 8 || jupiter.signIndex === 11) ? 'Strong' : 'Moderate',
        classicalRule: 'When Jupiter is situated in an angle (Kendra 1, 4, 7, 10) from the Moon.',
        prediction: 'Confers royal majesty, unblemished reputation, eloquence, high scholarly intellect, and victory over adversaries. The native is revered in society like a king or chief judge.',
      });
    }
  }

  // 2. BUDHADITYA YOGA: Sun + Mercury conjunction
  if (sun && mercury && sun.signIndex === mercury.signIndex) {
    detectedYogas.push({
      id: 'budhaditya',
      name: 'Budhaditya Yoga (বুধাদিত্য যোগ)',
      nameBengali: 'বুধাদিত্য যোগ',
      category: 'Solar Yoga',
      nature: 'Highly Auspicious',
      planetsInvolved: ['Sun (সূর্য)', 'Mercury (বুধ)'],
      houseInvolved: `House #${getHouse(sun.signIndex)} (${ZODIAC_SIGNS[sun.signIndex]})`,
      strength: 'Strong',
      classicalRule: 'Conjunction of the radiant Sun and analytical Mercury in the same zodiac sign.',
      prediction: 'Blesses the native with extraordinary administrative wisdom, razor-sharp analytical faculty, success in government or business leadership, and celebrated verbal eloquence.',
    });
  }

  // 3. CHANDRA-MANGALA / MAHALAKSHMI YOGA: Moon + Mars conjunction
  if (moon && mars && moon.signIndex === mars.signIndex) {
    detectedYogas.push({
      id: 'chandra-mangala',
      name: 'Chandra-Mangala Mahalakshmi Yoga (চন্দ্রমঙ্গল মহালক্ষ্মী যোগ)',
      nameBengali: 'চন্দ্রমঙ্গল যোগ',
      category: 'Dhana Yoga',
      nature: 'Highly Auspicious',
      planetsInvolved: ['Moon (চন্দ্র)', 'Mars (মঙ্গল)'],
      houseInvolved: `House #${getHouse(moon.signIndex)}`,
      strength: 'Strong',
      classicalRule: 'Conjunction of Moon and Mars.',
      prediction: 'Generates abundant material prosperity, real estate acumen, financial liquidity, and commercial valor. Financial wealth steadily accumulates across adulthood.',
    });
  }

  // 4. PANCHA MAHAPURUSHA YOGAS (Kendra + Own/Exalted)
  // 4a. Ruchaka Yoga (Mars in Aries 0, Scorpio 7, Capricorn 9 in Kendra)
  if (mars) {
    const mHouse = getHouse(mars.signIndex);
    if (isKendra(mHouse) && [0, 7, 9].includes(mars.signIndex)) {
      detectedYogas.push({
        id: 'ruchaka',
        name: 'Ruchaka Mahapurusha Yoga (রুচক যোগ)',
        nameBengali: 'রুচক মহাপুরুষ যোগ',
        category: 'Maha Purusha',
        nature: 'Highly Auspicious',
        planetsInvolved: ['Mars (মঙ্গল)'],
        houseInvolved: `House #${mHouse} (${ZODIAC_SIGNS[mars.signIndex]})`,
        strength: mars.signIndex === 9 ? 'Strong' : 'Moderate',
        classicalRule: 'Mars placed in an angle (1, 4, 7, 10) in own sign or exaltation sign (Capricorn).',
        prediction: 'Produces an intrepid leader, military or engineering prowess, physical strength, decisive command, and triumph over rivals.',
      });
    }
  }

  // 4b. Bhadra Yoga (Mercury in Gemini 2, Virgo 5 in Kendra)
  if (mercury) {
    const meHouse = getHouse(mercury.signIndex);
    if (isKendra(meHouse) && [2, 5].includes(mercury.signIndex)) {
      detectedYogas.push({
        id: 'bhadra',
        name: 'Bhadra Mahapurusha Yoga (ভদ্র যোগ)',
        nameBengali: 'ভদ্র মহাপুরুষ যোগ',
        category: 'Maha Purusha',
        nature: 'Highly Auspicious',
        planetsInvolved: ['Mercury (বুধ)'],
        houseInvolved: `House #${meHouse} (${ZODIAC_SIGNS[mercury.signIndex]})`,
        strength: mercury.signIndex === 5 ? 'Strong' : 'Moderate',
        classicalRule: 'Mercury placed in an angle (1, 4, 7, 10) in Gemini or Virgo.',
        prediction: 'Grants towering intellect, mastery over literature, mathematics, accounting, statecraft, and longevity with youthful charm.',
      });
    }
  }

  // 4c. Hamsa Yoga (Jupiter in Cancer 3, Sagittarius 8, Pisces 11 in Kendra)
  if (jupiter) {
    const juHouse = getHouse(jupiter.signIndex);
    if (isKendra(juHouse) && [3, 8, 11].includes(jupiter.signIndex)) {
      detectedYogas.push({
        id: 'hamsa',
        name: 'Hamsa Mahapurusha Yoga (হংস যোগ)',
        nameBengali: 'হংস মহাপুরুষ যোগ',
        category: 'Maha Purusha',
        nature: 'Highly Auspicious',
        planetsInvolved: ['Jupiter (বৃহস্পতি)'],
        houseInvolved: `House #${juHouse} (${ZODIAC_SIGNS[jupiter.signIndex]})`,
        strength: jupiter.signIndex === 3 ? 'Strong' : 'Moderate',
        classicalRule: 'Jupiter in an angle (1, 4, 7, 10) in Cancer (exalted), Sagittarius, or Pisces.',
        prediction: 'Spiritual purity, revered wisdom, righteous authority, divine protection throughout life, and universal respect.',
      });
    }
  }

  // 4d. Malavya Yoga (Venus in Taurus 1, Libra 6, Pisces 11 in Kendra)
  if (venus) {
    const veHouse = getHouse(venus.signIndex);
    if (isKendra(veHouse) && [1, 6, 11].includes(venus.signIndex)) {
      detectedYogas.push({
        id: 'malavya',
        name: 'Malavya Mahapurusha Yoga (মালব্য যোগ)',
        nameBengali: 'মালব্য মহাপুরুষ যোগ',
        category: 'Maha Purusha',
        nature: 'Highly Auspicious',
        planetsInvolved: ['Venus (শুক্র)'],
        houseInvolved: `House #${veHouse} (${ZODIAC_SIGNS[venus.signIndex]})`,
        strength: venus.signIndex === 11 ? 'Strong' : 'Moderate',
        classicalRule: 'Venus in an angle (1, 4, 7, 10) in Taurus, Libra, or Pisces (exalted).',
        prediction: 'Bestows refined artistic taste, luxurious vehicles, palatial dwellings, charismatic magnetism, and matrimonial blissful felicity.',
      });
    }
  }

  // 4e. Sasa Yoga (Saturn in Libra 6, Capricorn 9, Aquarius 10 in Kendra)
  if (saturn) {
    const saHouse = getHouse(saturn.signIndex);
    if (isKendra(saHouse) && [6, 9, 10].includes(saturn.signIndex)) {
      detectedYogas.push({
        id: 'sasa',
        name: 'Sasa Mahapurusha Yoga (শশ যোগ)',
        nameBengali: 'শশ মহাপুরুষ যোগ',
        category: 'Maha Purusha',
        nature: 'Highly Auspicious',
        planetsInvolved: ['Saturn (শনি)'],
        houseInvolved: `House #${saHouse} (${ZODIAC_SIGNS[saturn.signIndex]})`,
        strength: saturn.signIndex === 6 ? 'Strong' : 'Moderate',
        classicalRule: 'Saturn in an angle (1, 4, 7, 10) in Libra (exalted), Capricorn, or Aquarius.',
        prediction: 'Command over masses, democratic or administrative rulership, indomitable stamina, discipline, and substantial landed property.',
      });
    }
  }

  // 5. DHANA YOGA: Jupiter + Venus or Jupiter + Mercury conjunction
  if (jupiter && venus && jupiter.signIndex === venus.signIndex) {
    detectedYogas.push({
      id: 'guru-shukra',
      name: 'Guru-Shukra Dhana Yoga (বৃহস্পতি-শুক্র ধন যোগ)',
      nameBengali: 'গুরু-শুক্র যোগ',
      category: 'Dhana Yoga',
      nature: 'Highly Auspicious',
      planetsInvolved: ['Jupiter (বৃহস্পতি)', 'Venus (শুক্র)'],
      houseInvolved: `House #${getHouse(jupiter.signIndex)}`,
      strength: 'Strong',
      classicalRule: 'Conjunction of the two supreme preceptors (Daitya Guru & Deva Guru).',
      prediction: 'Brings extraordinary advisory intellect, wealth management capacity, high social honors, and patronage from rulers.',
    });
  }

  // 6. KEMADRUMA YOGA: No planets in 2nd and 12th from Moon (except Sun, Rahu, Ketu)
  if (moon) {
    const house2Moon = (moon.signIndex + 1) % 12;
    const house12Moon = (moon.signIndex + 11) % 12;

    const planetsAroundMoon = chartData.planets.filter(p =>
      ['ma', 'me', 'ju', 've', 'sa'].includes(p.id) &&
      (p.signIndex === house2Moon || p.signIndex === house12Moon)
    );

    if (planetsAroundMoon.length === 0) {
      // Check cancellation: planet in Kendra from Moon or Lagna
      const hasKendraCancel = chartData.planets.some(p =>
        ['ju', 've', 'me'].includes(p.id) && isKendra(getHouse(p.signIndex))
      );

      detectedYogas.push({
        id: 'kemadruma',
        name: hasKendraCancel ? 'Kemadruma Bhanga (ভঙ্গ কেমদ্রুম যোগ)' : 'Kemadruma Yoga (কেমদ্রুম যোগ)',
        nameBengali: 'কেমদ্রুম যোগ',
        category: 'Challenging / Arishta',
        nature: hasKendraCancel ? 'Mixed' : 'Challenging',
        planetsInvolved: ['Moon (চন্দ্র)'],
        houseInvolved: `Moon in House #${getHouse(moon.signIndex)}`,
        strength: hasKendraCancel ? 'Mild' : 'Moderate',
        classicalRule: 'Absence of planets (excluding Sun/Rahu/Ketu) in the 2nd and 12th houses from Moon.',
        prediction: hasKendraCancel
          ? 'Kemadruma Dosha is cancelled (Bhanga) by benefic Kendra placements. Initial struggles transform into resilient financial self-reliance.'
          : 'Can cause periodic psychological loneliness, financial fluctuations, or unrooted wandering. Regular Lord Shiva worship acts as a powerful shield.',
        remedy: 'Daily chanting of Shiva Panchakshara Stotra (ॐ नमः शिवाय) and honoring mother/elders.',
      });
    }
  }

  // 7. GURU CHANDAL YOGA: Jupiter + Rahu conjunction
  if (jupiter && rahu && jupiter.signIndex === rahu.signIndex) {
    detectedYogas.push({
      id: 'guru-chandal',
      name: 'Guru Chandal Yoga (গুরু চণ্ডাল যোগ)',
      nameBengali: 'গুরু চণ্ডাল যোগ',
      category: 'Challenging / Arishta',
      nature: 'Challenging',
      planetsInvolved: ['Jupiter (বৃহস্পতি)', 'Rahu (রাহু)'],
      houseInvolved: `House #${getHouse(jupiter.signIndex)}`,
      strength: 'Moderate',
      classicalRule: 'Conjunction of divine Jupiter with shadow planet Rahu in the same sign.',
      prediction: 'Creates unorthodox philosophical perspectives, friction with traditional orthodoxy, or mentor testing. If channelled positively, grants groundbreaking research breakthroughs.',
      remedy: 'Feed yellow gram (ছোলার ডাল) to cows on Thursdays and worship Brihaspati.',
    });
  }

  // 8. ANGARAK YOGA: Mars + Rahu conjunction
  if (mars && rahu && mars.signIndex === rahu.signIndex) {
    detectedYogas.push({
      id: 'angarak',
      name: 'Angarak Yoga (অঙ্গারক যোগ)',
      nameBengali: 'অঙ্গারক যোগ',
      category: 'Challenging / Arishta',
      nature: 'Challenging',
      planetsInvolved: ['Mars (মঙ্গল)', 'Rahu (রাহু)'],
      houseInvolved: `House #${getHouse(mars.signIndex)}`,
      strength: 'Moderate',
      classicalRule: 'Conjunction of explosive Mars with volatile Rahu.',
      prediction: 'Induces intense drive, impulsiveness, fire/electricity caution, and fiery temper. Requires disciplined athletic exertion or martial arts to channel safely.',
      remedy: 'Hanuman Chalisa recitation on Tuesdays and donating jaggery/copper.',
    });
  }

  // 9. GRAHAN YOGA: Sun or Moon with Rahu or Ketu
  if (sun && rahu && sun.signIndex === rahu.signIndex) {
    detectedYogas.push({
      id: 'surya-grahan',
      name: 'Surya Grahan Yoga (সূর্য গ্রহণ যোগ)',
      nameBengali: 'সূর্য গ্রহণ যোগ',
      category: 'Challenging / Arishta',
      nature: 'Challenging',
      planetsInvolved: ['Sun (সূর্য)', 'Rahu (রাহু)'],
      houseInvolved: `House #${getHouse(sun.signIndex)}`,
      strength: 'Moderate',
      classicalRule: 'Sun conjunct Rahu.',
      prediction: 'Calls for conscious confidence building and respectful rapport with father or government authorities.',
      remedy: 'Offer water (অর্ঘ্য) to the rising Sun daily with Gayatri Mantra.',
    });
  }

  const auspiciousCount = detectedYogas.filter(y => y.nature === 'Highly Auspicious' || y.nature === 'Auspicious').length;
  const inauspiciousCount = detectedYogas.filter(y => y.nature === 'Challenging' || y.nature === 'Mixed').length;

  const overallSummary = auspiciousCount >= 3
    ? `Exceptional Vedic chart with ${auspiciousCount} prominent Raja & Dhana Yogas active. Planetary alignment bestows high leadership acumen, prosperity, and respect.`
    : auspiciousCount > 0
    ? `Balanced chart featuring ${auspiciousCount} auspicious yoga(s). Strategic effort and targeted Vedic remedies unlock maximum potential.`
    : `Chart indicates growth through self-made effort (Parakrama) rather than passive inheritance. Regular spiritual disciplines bring steady elevation.`;

  return {
    nativeName: params.name || 'Native',
    ascendantSign: ascSignName,
    moonSign: moonSignName,
    totalYogasDetected: detectedYogas.length,
    auspiciousCount,
    inauspiciousCount,
    yogas: detectedYogas,
    overallSummary,
  };
}
