/**
 * Bhrigu Nandi Nadi (BNN) Prediction Engine
 * 
 * Implements classical BNN principles with Manipuri (Meiteilon) language written in Bengali script:
 * 1. Planetary Karakatwas (Jiva, Karma, Dhana, Buddhi, etc.)
 * 2. 4-Directional Trikonas (East: নোংপোক/মৈ, South: মখা/লৈপাক, West: নোংচুপ/নুংশিৎ, North: অৱাং/ঈশিং)
 * 3. Directional Combinations (1-5-9, 2nd, 12th, 7th)
 * 4. Retrograde & Degree-order rules
 * 5. Age-wise Jupiter (12-yr) and Saturn (30-yr) progressions
 */

export type DirectionType = 'East' | 'South' | 'West' | 'North';

export interface BNNPlanet {
  id: string;
  name: string;
  bengaliName: string;
  karakatwa: string;
  bengaliKarakatwa: string;
  longitude: number;
  signIndex: number;
  signName: string;
  signDegree: number;
  formattedDegree: string;
  isRetrograde: boolean;
  direction: DirectionType;
  directionBengali: string;
  speed?: number;
}

export interface BNNDirectionGroup {
  direction: DirectionType;
  directionBengali: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  elementBengali: string;
  signs: { index: number; name: string; bengali: string }[];
  planets: BNNPlanet[];
}

export interface BNNPrediction {
  id: string;
  category: 'jiva' | 'karma' | 'marriage' | 'wealth' | 'spirituality';
  categoryTitle: string;
  title: string;
  planetsInvolved: string[];
  connectionType: '1-5-9 Trine' | '2nd Front' | '12th Past Karma' | '7th Opposition' | 'Same Sign';
  description: string;
  bengaliDescription: string;
  strength: 'High' | 'Medium' | 'Moderate';
}

export interface BNNProgressionYear {
  runningAge: number;
  calendarYear: number;
  jupiterSignIndex: number;
  jupiterSignName: string;
  saturnSignIndex: number;
  saturnSignName: string;
  activatedNatalPlanets: BNNPlanet[];
  keyThemes: string[];
  bengaliThemes: string[];
  isCurrentAge: boolean;
}

// Direction definitions in Manipuri (Meiteilon written in Bengali script)
export const BNN_DIRECTIONS: Record<DirectionType, { element: 'Fire' | 'Earth' | 'Air' | 'Water'; bn: string; elemBn: string; signs: number[] }> = {
  East: { element: 'Fire', bn: 'East (নোংপোক)', elemBn: 'Fire (মৈ)', signs: [0, 4, 8] },      // Aries, Leo, Sagittarius
  South: { element: 'Earth', bn: 'South (মখা)', elemBn: 'Earth (লৈপাক)', signs: [1, 5, 9] },     // Taurus, Virgo, Capricorn
  West: { element: 'Air', bn: 'West (নোংচুপ)', elemBn: 'Air (নুংশিৎ)', signs: [2, 6, 10] },      // Gemini, Libra, Aquarius
  North: { element: 'Water', bn: 'North (অৱাং)', elemBn: 'Water (ঈশিং)', signs: [3, 7, 11] },    // Cancer, Scorpio, Pisces
};

export const SIGN_INFO = [
  { name: 'Aries', bn: 'মেষ', direction: 'East' as DirectionType },
  { name: 'Taurus', bn: 'বৃষ', direction: 'South' as DirectionType },
  { name: 'Gemini', bn: 'মিথুন', direction: 'West' as DirectionType },
  { name: 'Cancer', bn: 'কর্কট', direction: 'North' as DirectionType },
  { name: 'Leo', bn: 'সিংহ', direction: 'East' as DirectionType },
  { name: 'Virgo', bn: 'কন্যা', direction: 'South' as DirectionType },
  { name: 'Libra', bn: 'তুলা', direction: 'West' as DirectionType },
  { name: 'Scorpio', bn: 'বৃশ্চিক', direction: 'North' as DirectionType },
  { name: 'Sagittarius', bn: 'ধনু', direction: 'East' as DirectionType },
  { name: 'Capricorn', bn: 'মকর', direction: 'South' as DirectionType },
  { name: 'Aquarius', bn: 'কুম্ভ', direction: 'West' as DirectionType },
  { name: 'Pisces', bn: 'মীন', direction: 'North' as DirectionType },
];

export const BNN_PLANET_META: Record<string, { bnName: string; karakatwa: string; bnKara: string }> = {
  ju: { bnName: 'বৃহস্পতি (গুরু)', karakatwa: 'Jiva Karaka (Self / Soul / Life)', bnKara: 'জীব কারক (থৱায়, পুন্সি শক্তম, লৌশিং)' },
  sa: { bnName: 'শনি', karakatwa: 'Karma Karaka (Profession / Livelihood)', bnKara: 'কর্ম কারক (থবক, শু-নোম্বা, থৌদাং)' },
  ve: { bnName: 'শুক্র', karakatwa: 'Dhana & Stree Karaka (Wealth / Wife / Luxury)', bnKara: 'ধন অমসুং নুপী কারক (শেন-থুম, নুপী, নুংঙাই-য়াইফবা)' },
  ma: { bnName: 'মঙ্গল', karakatwa: 'Bhratru & Pati Karaka (Husband / Courage)', bnKara: 'মপাঙ্গল অমসুং মপুরোইবা কারক (স্বামী, থৌনা, লম-লৈপাক)' },
  me: { bnName: 'বুধ', karakatwa: 'Buddhi Karaka (Intellect / Business / Speech)', bnKara: 'বুদ্ধি কারক (লৌশিং, ললোন-ইতিক, ৱাফম খঙবা)' },
  su: { bnName: 'সূর্য (নুমিৎ)', karakatwa: 'Pitru & Atma Karaka (Father / Authority)', bnKara: 'ইপা অমসুং থৱায় কারক (মপা, নিংথৌগী থৌজান, মিংচৎ)' },
  mo: { bnName: 'চন্দ্র (থা)', karakatwa: 'Matru & Manas Karaka (Mother / Mind / Travel)', bnKara: 'ইমা অমসুং ৱাখল কারক (মাতা, খোঙচৎ, ৱাখলগী শক্তম)' },
  ra: { bnName: 'রাহু', karakatwa: 'Maya & Foreign Karaka (Expansion / Shadows)', bnKara: 'মায়া অমসুং মপান লৈপাক কারক (অচৌবা আশা, মপান লৈপাক)' },
  ke: { bnName: 'কেতু', karakatwa: 'Moksha & Spiritual Karaka (Detachment / Occult)', bnKara: 'মোক্ষ অমসুং লাইনীং কারক (থৱায়গী লম্বী, লাইনীং, জ্যোতিষ)' },
};

/**
 * Format degrees to DMS string
 */
function formatDms(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.floor(((deg - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, '0')}' ${String(s).padStart(2, '0')}"`;
}

/**
 * Categorize planets into 4 Directional Groups
 */
export function buildDirectionalGroups(planets: any[]): Record<DirectionType, BNNDirectionGroup> {
  const groups: Record<DirectionType, BNNDirectionGroup> = {
    East: {
      direction: 'East',
      directionBengali: 'East (নোংপোক)',
      element: 'Fire',
      elementBengali: 'Fire (মৈ)',
      signs: [
        { index: 0, name: 'Aries', bengali: 'মেষ' },
        { index: 4, name: 'Leo', bengali: 'সিংহ' },
        { index: 8, name: 'Sagittarius', bengali: 'ধনু' },
      ],
      planets: [],
    },
    South: {
      direction: 'South',
      directionBengali: 'South (মখা)',
      element: 'Earth',
      elementBengali: 'Earth (লৈপাক)',
      signs: [
        { index: 1, name: 'Taurus', bengali: 'বৃষ' },
        { index: 5, name: 'Virgo', bengali: 'কন্যা' },
        { index: 9, name: 'Capricorn', bengali: 'মকর' },
      ],
      planets: [],
    },
    West: {
      direction: 'West',
      directionBengali: 'West (নোংচুপ)',
      element: 'Air',
      elementBengali: 'Air (নুংশিৎ)',
      signs: [
        { index: 2, name: 'Gemini', bengali: 'মিথুন' },
        { index: 6, name: 'Libra', bengali: 'তুলা' },
        { index: 10, name: 'Aquarius', bengali: 'কুম্ভ' },
      ],
      planets: [],
    },
    North: {
      direction: 'North',
      directionBengali: 'North (অৱাং)',
      element: 'Water',
      elementBengali: 'Water (ঈশিং)',
      signs: [
        { index: 3, name: 'Cancer', bengali: 'কর্কট' },
        { index: 7, name: 'Scorpio', bengali: 'বৃশ্চিক' },
        { index: 11, name: 'Pisces', bengali: 'মীন' },
      ],
      planets: [],
    },
  };

  planets.forEach((p) => {
    const meta = BNN_PLANET_META[p.id] || {
      bnName: p.name,
      karakatwa: 'Planetary Entity',
      bnKara: 'গ্রহগী শক্তি',
    };
    const signIdx = p.signIndex ?? Math.floor(p.longitude / 30);
    const signDegree = p.signDegree ?? (p.longitude % 30);
    const signMeta = SIGN_INFO[signIdx];
    const dir = signMeta ? signMeta.direction : 'East';

    const bnnPlanet: BNNPlanet = {
      id: p.id,
      name: p.name,
      bengaliName: meta.bnName,
      karakatwa: meta.karakatwa,
      bengaliKarakatwa: meta.bnKara,
      longitude: p.longitude,
      signIndex: signIdx,
      signName: SIGN_INFO[signIdx]?.name || '',
      signDegree,
      formattedDegree: formatDms(signDegree),
      isRetrograde: !!p.isRetrograde,
      direction: dir,
      directionBengali: BNN_DIRECTIONS[dir].bn,
      speed: p.speed,
    };

    groups[dir].planets.push(bnnPlanet);
  });

  // Sort planets within each direction by sign and degree
  (Object.keys(groups) as DirectionType[]).forEach((dir) => {
    groups[dir].planets.sort((a, b) => {
      if (a.signIndex !== b.signIndex) return a.signIndex - b.signIndex;
      return a.signDegree - b.signDegree;
    });
  });

  return groups;
}

/**
 * Find planetary relationships according to BNN rules:
 * - 1-5-9: Same direction (mutual union)
 * - 2nd: Next sign (resources / front)
 * - 12th: Previous sign (past karma / background)
 * - 7th: Direct opposition (complementary/facing)
 */
export function getPlanetAspects(
  targetPlanetId: string,
  allPlanets: BNNPlanet[]
): {
  sameDirection: BNNPlanet[];
  secondHouse: BNNPlanet[];
  twelfthHouse: BNNPlanet[];
  seventhHouse: BNNPlanet[];
} {
  const target = allPlanets.find((p) => p.id === targetPlanetId);
  if (!target) {
    return { sameDirection: [], secondHouse: [], twelfthHouse: [], seventhHouse: [] };
  }

  const nextSign = (target.signIndex + 1) % 12;
  const prevSign = (target.signIndex + 11) % 12;
  const oppSign = (target.signIndex + 6) % 12;

  const sameDirection = allPlanets.filter((p) => p.id !== target.id && p.direction === target.direction);
  const secondHouse = allPlanets.filter((p) => p.id !== target.id && p.signIndex === nextSign);
  const twelfthHouse = allPlanets.filter((p) => p.id !== target.id && p.signIndex === prevSign);
  const seventhHouse = allPlanets.filter((p) => p.id !== target.id && p.signIndex === oppSign);

  return { sameDirection, secondHouse, twelfthHouse, seventhHouse };
}

/**
 * Generate comprehensive BNN Predictions based on Core Karaka combinations
 * All descriptions written in authentic Manipuri (Meiteilon) using Bengali script
 */
export function generateBNNPredictions(planets: BNNPlanet[]): BNNPrediction[] {
  const predictions: BNNPrediction[] = [];

  const getP = (id: string) => planets.find((p) => p.id === id);
  const guru = getP('ju');
  const shani = getP('sa');
  const shukra = getP('ve');
  const mangal = getP('ma');
  const budha = getP('me');
  const surya = getP('su');
  const chandra = getP('mo');
  const rahu = getP('ra');
  const ketu = getP('ke');

  // Helper to check if two planets connect in BNN (1-5-9, 2nd, 12th, or 7th)
  const isLinked = (p1?: BNNPlanet, p2?: BNNPlanet) => {
    if (!p1 || !p2) return null;
    if (p1.signIndex === p2.signIndex) return 'Same Sign';
    if (p1.direction === p2.direction) return '1-5-9 Trine';
    if ((p1.signIndex + 1) % 12 === p2.signIndex) return '2nd Front';
    if ((p1.signIndex + 11) % 12 === p2.signIndex) return '12th Past Karma';
    if ((p1.signIndex + 6) % 12 === p2.signIndex) return '7th Opposition';
    return null;
  };

  // 1. JIVA (GURU) COMBINATIONS - Self, Character, Destiny
  if (guru && shani) {
    const link = isLinked(guru, shani);
    if (link) {
      predictions.push({
        id: 'guru-shani',
        category: 'jiva',
        categoryTitle: 'Jiva & Karma (পুন্সি অমসুং থবক)',
        title: 'Dharma-Karmadhipati Yoga (ধর্ম-কর্ম যোগ)',
        planetsInvolved: ['Jupiter (গুরু)', 'Saturn (শনি)'],
        connectionType: link,
        description:
          'Jiva (Jupiter) merges with Karma (Saturn). Indicates an honorable, duty-conscious person. Natural tendency toward advisory, teaching, administrative, or judiciary responsibilities. Steady life with gradual, permanent prosperity.',
        bengaliDescription:
          'জীব (গুরু) অমসুং কর্ম (শনি) পুন্সিনবা। জাতক অসি থৌদাং খঙবা, অচুম্বা ৱাঙাংবা অমসুং কুপ্না চৎপা মীওই ওই। মীয়ামগী পাউতাক পীবদা, ওজা ওইবদা নত্রগা চাউনা থবক তৌবদা মিংচৎ ফংই। পুন্সিগী মহৈ অসি তপ্না ওইরবসু চহি চুপ্পা লেংদনা লৈগনি।',
        strength: 'High',
      });
    }
  }

  if (guru && rahu) {
    const link = isLinked(guru, rahu);
    if (link) {
      predictions.push({
        id: 'guru-rahu',
        category: 'jiva',
        categoryTitle: 'Jiva & Expansion (পুন্সি অমসুং আশা)',
        title: 'Guru-Chandal Yoga / Foreign Horizon (গুরু-রাহু সংযোগ)',
        planetsInvolved: ['Jupiter (গুরু)', 'Rahu (রাহু)'],
        connectionType: link,
        description:
          'Jiva (Jupiter) meets the shadow planet of expansion (Rahu). Fosters unconventional thinking, foreign travel or settlement, attraction to modern technologies or non-traditional ideologies. Sudden life breakthroughs.',
        bengaliDescription:
          'জীব (গুরু) অমসুং রাহুগী মরী অসিনা মীওই অদু মতমগা চুনবা অনৌবা ৱাখল্লোনদা চৎহনগনি। মপান লৈপাক্কা মরী লৈনবা, অনৌবা তেক্নোলোজি অমসুং মফম হোংবদা খংহৌদনা অথোইবা কান্নবা ফংগনি।',
        strength: 'Medium',
      });
    }
  }

  if (guru && ketu) {
    const link = isLinked(guru, ketu);
    if (link) {
      predictions.push({
        id: 'guru-ketu',
        category: 'spirituality',
        categoryTitle: 'Spirituality & Moksha (মোক্ষ অমসুং লাইনীং)',
        title: 'Kula-Deepak & Jnana Yoga (কুলদীপক অমসুং জ্ঞান যোগ)',
        planetsInvolved: ['Jupiter (গুরু)', 'Ketu (কেতু)'],
        connectionType: link,
        description:
          'Jiva (Jupiter) embraces the planet of liberation (Ketu). Endows natural intuition, interest in astrology, metaphysics, philosophy, and spiritual service. Brings family prestige and spiritual elevation.',
        bengaliDescription:
          'জীব (গুরু) অমসুং কেতু পুন্সিনবনা জাতকপু লাইনীং-পথাপ, জ্যোতিষ অমসুং থৱায়গী ৱাখলদা মতিক চারবা মীশক অমা ওইহল্লি। ইমুং মনুংদা মিংচৎ পুরকপা কুলদীপক ওইগনি।',
        strength: 'High',
      });
    }
  }

  if (guru && budha) {
    const link = isLinked(guru, budha);
    if (link) {
      predictions.push({
        id: 'guru-budha',
        category: 'jiva',
        categoryTitle: 'Intellect & Wisdom (লৌশিং অমসুং বুদ্ধি)',
        title: 'Saraswati Buddhi Yoga (বিদ্যা অমসুং বাগ্মীতা যোগ)',
        planetsInvolved: ['Jupiter (গুরু)', 'Mercury (বুধ)'],
        connectionType: link,
        description:
          'Combines higher wisdom (Guru) with sharp commercial and analytical intellect (Budha). Highly educated, eloquent speaker, successful in writing, trading, accounts, and counseling.',
        bengaliDescription:
          'চাউরবা লৌশিং (গুরু) অমসুং তীক্ষ্ণ বুদ্ধি (বুধ) অমত্তা ওইনবা। মহৈ-মশীংদা হৈ-শিংবা, ললোন-ইতিক অমসুং ৱাফম খঙনা ঙাংবদা মশক থোকপা মীওই ওইগনি।',
        strength: 'High',
      });
    }
  }

  if (guru && surya) {
    const link = isLinked(guru, surya);
    if (link) {
      predictions.push({
        id: 'guru-surya',
        category: 'jiva',
        categoryTitle: 'Prestige & Nobility (মিংচৎ অমসুং ইকায়খুম্নবা)',
        title: 'Brahma-Raja Yoga (রাজ সম্মান যোগ)',
        planetsInvolved: ['Jupiter (গুরু)', 'Sun (সূর্য)'],
        connectionType: link,
        description:
          'Jiva joins hands with Atma/Father (Sun). Blessed with strong fatherly heritage, high self-esteem, support from government officials, and dignified status in society.',
        bengaliDescription:
          'গুরু অমসুং নুমিৎকী মরী অসিনা মপাগী থৌজান, লৈঙাক্কী মতেং অমসুং সমাজদা চাউনা ইকায়খুম্নবা পুরক্কনি। জাতক অসি মীচমদগী হেন্না চাউরবা ফম ফংই।',
        strength: 'High',
      });
    }
  }

  if (guru && chandra) {
    const link = isLinked(guru, chandra);
    if (link) {
      predictions.push({
        id: 'guru-chandra',
        category: 'jiva',
        categoryTitle: 'Travel & Public Grace (খোঙচৎ অমসুং মীয়াম)',
        title: 'Gajakesari Nadi Union (গজকেশরী নাড়ী যোগ)',
        planetsInvolved: ['Jupiter (গুরু)', 'Moon (চন্দ্র)'],
        connectionType: link,
        description:
          'Jiva meets the fluctuating mind and mother (Moon). Warm-hearted, generous, liked by the public, with frequent travels and creative pursuits. Wealth fluctuates positively with geographic relocation.',
        bengaliDescription:
          'গুরু অমসুং থা (চন্দ্র) অমত্তা ওইরগা জাতকপু মীয়ামগী চানবা, নোল্লুকপা অমসুং নুংশিবা মীওই ওইহল্লি। মফম হোংবা নত্রগা খোঙচৎ চৎপদা শেল-থুমগী খুদোংচাবা ফংগনি।',
        strength: 'Medium',
      });
    }
  }

  // 2. KARMA (SHANI) COMBINATIONS - Career & Profession
  if (shani && budha) {
    const link = isLinked(shani, budha);
    if (link) {
      predictions.push({
        id: 'shani-budha',
        category: 'karma',
        categoryTitle: 'Career & Analytics (কর্ম অমসুং ললোন-ইতিক)',
        title: 'Analytical & Commercial Career (ললোন-ইতিক অমসুং হিসাবকী থবক)',
        planetsInvolved: ['Saturn (শনি)', 'Mercury (বুধ)'],
        connectionType: link,
        description:
          'Saturn combines with Mercury. Excellent for accounting, banking, software analytics, journalism, publishing, logistics, or independent business enterprise.',
        bengaliDescription:
          'শনি অমসুং বুধনা জাতকপু ললোন-ইতিক, বেঙ্কিং, সফটৱ্যার নত্রগা অরিবা চে-চাং নৈনবদা মতিক চারবা কর্ম লম্বী পীরি।',
        strength: 'High',
      });
    }
  }

  if (shani && rahu) {
    const link = isLinked(shani, rahu);
    if (link) {
      predictions.push({
        id: 'shani-rahu',
        category: 'karma',
        categoryTitle: 'Corporate & Tech Karma (তেক্নোলোজি অমসুং থবক)',
        title: 'Technical / Foreign / Corporate Karma (তেক্নোলোজি অমসুং মপান লৈপাক্কী থবক)',
        planetsInvolved: ['Saturn (শনি)', 'Rahu (রাহু)'],
        connectionType: link,
        description:
          'Karma Karaka joins Rahu. Indicates work involving advanced technology, electronics, multinational corporations, chemicals, photography, or aviation. Initial professional struggle followed by substantial rise.',
        bengaliDescription:
          'কর্মকারক শনিগা রাহুগা তিন্নবনা ইলেক্ত্রোনিক্স, কম্প্যুতর, মপানগী কম্পেনি অমসুং অনৌবা তেক্নোলোজিদা থবক ফংহল্লি। অহানবদা ৱারবসু তুংদা চাউনা ইথক হৌগনি।',
        strength: 'High',
      });
    }
  }

  if (shani && ketu) {
    const link = isLinked(shani, ketu);
    if (link) {
      predictions.push({
        id: 'shani-ketu',
        category: 'karma',
        categoryTitle: 'Advisory & Healing (আইন, হিদাক অমসুং সেবা)',
        title: 'Mukti-Karma / Advisory & Healing (আইন, হিদাক অমসুং সেবাগী থবক)',
        planetsInvolved: ['Saturn (শনি)', 'Ketu (কেতু)'],
        connectionType: link,
        description:
          'Saturn links with Ketu. Suitable for legal professions, judiciary, medical sciences, occult, research, and non-profit advisory roles. Detached mindset toward corporate office politics.',
        bengaliDescription:
          'শনি অমসুং কেতুগী মরী অসিনা আইনগী ৱাফম, হিদাক-লাংথক, লাইনীং অমসুং মীয়ামদা পাউতাক পীবগী থবক্তা মাইপাকপা পীরি।',
        strength: 'Medium',
      });
    }
  }

  if (shani && shukra) {
    const link = isLinked(shani, shukra);
    if (link) {
      predictions.push({
        id: 'shani-shukra',
        category: 'wealth',
        categoryTitle: 'Wealth & Prosperity (শেন-থুম অমসুং ইনাক খুনবা)',
        title: 'Lakshmi-Karma Yoga (লক্ষ্মী-কর্ম যোগ / স্থায়ী ধনলাভ)',
        planetsInvolved: ['Saturn (শনি)', 'Venus (শুক্র)'],
        connectionType: link,
        description:
          'Saturn interacts with Venus. Very auspicious for financial institutions, luxury goods, real estate, design, and vehicle trade. Wealth solidifies significantly after marriage or age 28.',
        bengaliDescription:
          'শনি অমসুং শুক্রগী অমত্তা ওইবনা ফাইনান্স, পোৎ-চৈ য়োনবা, গাড়ী-য়ুম অমসুং নুংঙাইরবা পোৎলমদা ইনাক খুনবা পুরক্কনি। লুহোংলবা মতুংদা লাইবক হেন্না ফগনি।',
        strength: 'High',
      });
    }
  }

  if (shani && mangal) {
    const link = isLinked(shani, mangal);
    if (link) {
      predictions.push({
        id: 'shani-mangal',
        category: 'karma',
        categoryTitle: 'Technical & Engineering Force (কারিগরি অমসুং থৌনা)',
        title: 'Yantrakara Yoga / Engineering Mindset (যন্ত্রকার যোগ)',
        planetsInvolved: ['Saturn (শনি)', 'Mars (মঙ্গল)'],
        connectionType: link,
        description:
          'Saturn and Mars combination produces engineers, surgeons, military/police officers, builders, and hard-working leaders. Must manage occasional workplace frictions and impatience.',
        bengaliDescription:
          'শনি অমসুং মঙ্গল তিন্নবনা মেছিনারী, ইঞ্জিনীয়রিং, পুলিস/মিলিটারি নত্রগা লম-লৈপাক্কী থবক্তা থৌনা ফবা পুরক্কনি।',
        strength: 'Medium',
      });
    }
  }

  if (shani && chandra) {
    const link = isLinked(shani, chandra);
    if (link) {
      predictions.push({
        id: 'shani-chandra',
        category: 'karma',
        categoryTitle: 'Travel in Career (খোঙচৎ চৎতুনা শুবা থবক)',
        title: 'Kala-Pravasi / Mobile Livelihood (খোঙচৎকী কর্ম যোগ)',
        planetsInvolved: ['Saturn (শনি)', 'Moon (চন্দ্র)'],
        connectionType: link,
        description:
          'Saturn and Moon combination points to frequent changes of workplace, travelling for livelihood, or businesses dealing with liquids, logistics, food, and hospitality. Emotional resilience required.',
        bengaliDescription:
          'থবক অমসুং মফম তপ্না লেংদবা, খোঙচৎ চৎতুনা শুবা নত্রগা ঈশিং অমসুং চিঞ্জাক্কী পোৎথোক্কা লৈনবা থবক্তা চৎপা মরী পীরি।',
        strength: 'Moderate',
      });
    }
  }

  // 3. MARRIAGE & RELATIONSHIPS (SHUKRA & MANGAL)
  if (shukra && mangal) {
    const link = isLinked(shukra, mangal);
    if (link) {
      predictions.push({
        id: 'shukra-mangal',
        category: 'marriage',
        categoryTitle: 'Romance & Marriage (দাম্পত্য অমসুং নুংশিবা)',
        title: 'Bhrigu-Mangala Passion & Attraction (প্রেম অমসুং দাম্পত্য আকর্ষন)',
        planetsInvolved: ['Venus (শুক্র)', 'Mars (মঙ্গল)'],
        connectionType: link,
        description:
          'Venus and Mars create strong mutual physical attraction, dynamic romantic life, and passionate partner. Need mutual patience to maintain harmony against fiery temperaments.',
        bengaliDescription:
          'শুক্র অমসুং মঙ্গলগী মিলন অসিনা থোইদোকপা নুংশিবা অমসুং ফজরবা দাম্পত্য পুন্সি তাক্লি। অনিনা খঙন-মিন্নবনা পুন্সি হেন্না নুংঙাইহনগনি।',
        strength: 'High',
      });
    }
  }

  if (shukra && ketu) {
    const link = isLinked(shukra, ketu);
    if (link) {
      predictions.push({
        id: 'shukra-ketu',
        category: 'marriage',
        categoryTitle: 'Spiritual Bond in Marriage (দাম্পত্যদা লাইনীং)',
        title: 'Vairagya-Stree Yoga (আধ্যাত্মিক জীবনসঙ্গী)',
        planetsInvolved: ['Venus (শুক্র)', 'Ketu (কেতু)'],
        connectionType: link,
        description:
          'Venus connected with Ketu suggests a religious, philosophical, or introverted life partner. Material disputes in relationships can be dissolved through joint spiritual practices.',
        bengaliDescription:
          'পুন্সিগী খোঙলোই অদু লাইনীংদা পুকচিংবা, শান্ত ওইবা মীওই ওইগনি। লাইনীংগী মরী হেন্না ফগনি।',
        strength: 'Medium',
      });
    }
  }

  if (shukra && rahu) {
    const link = isLinked(shukra, rahu);
    if (link) {
      predictions.push({
        id: 'shukra-rahu',
        category: 'wealth',
        categoryTitle: 'Material Splendor & Wealth (বিলাসবহুল পুন্সি)',
        title: 'Maya-Lakshmi Yoga (অচৌবা ভোগ অমসুং ঐশ্বর্য)',
        planetsInvolved: ['Venus (শুক্র)', 'Rahu (রাহু)'],
        connectionType: link,
        description:
          'Venus linked with Rahu creates huge desire for grandeur, imported luxury cars, premium real estate, and unconventional/cross-cultural marriage partnerships.',
        bengaliDescription:
          'বিলাসবহুল গাড়ী, য়ুম অমসুং অতোপ্পা লৈপাক্কা মরী লৈনবা মশক ফজরবা দাম্পত্য খুদোংচাবা পুরক্কনি।',
        strength: 'High',
      });
    }
  }

  if (budha && ketu) {
    const link = isLinked(budha, ketu);
    if (link) {
      predictions.push({
        id: 'budha-ketu',
        category: 'spirituality',
        categoryTitle: 'Esoteric & Astrology (জ্যোতিষ অমসুং গূঢ়বিদ্যা)',
        title: 'Jyotisha & Micro-Analysis Yoga (জ্যোতিষ অমসুং গূঢ়বিদ্যা যোগ)',
        planetsInvolved: ['Mercury (বুধ)', 'Ketu (কেতু)'],
        connectionType: link,
        description:
          'Mercury (intellect) combines with Ketu (occult). High aptitude for astrology, coding, mathematics, encryption, micro-electronics, and abstract research.',
        bengaliDescription:
          'জ্যোতিষশাস্ত্র, কোদিং অমসুং কুপ্না নৈনবদা অচৌবা লৌশিং ফংগনি।',
        strength: 'High',
      });
    }
  }

  return predictions;
}

/**
 * Calculate BNN Age-Wise Progressions
 * 
 * Jupiter progression: 1 sign per year (12-year cycle)
 * Saturn progression: 1 sign every 2.5 years (30-year cycle)
 */
export function calculateBNNProgressions(
  natalPlanets: BNNPlanet[],
  currentRunningAge: number,
  birthYear: number
): {
  currentProgression: BNNProgressionYear;
  timeline: BNNProgressionYear[];
} {
  const guru = natalPlanets.find((p) => p.id === 'ju');
  const shani = natalPlanets.find((p) => p.id === 'sa');

  const natalGuruSign = guru ? guru.signIndex : 0;
  const natalShaniSign = shani ? shani.signIndex : 0;

  // Build progression for a window around running age (e.g. runningAge - 2 to runningAge + 6)
  const startAge = Math.max(1, currentRunningAge - 2);
  const endAge = currentRunningAge + 6;

  const timeline: BNNProgressionYear[] = [];

  for (let age = startAge; age <= endAge; age++) {
    const calYear = birthYear + age - 1;
    // Jupiter 1 sign per year
    const jupSign = (natalGuruSign + ((age - 1) % 12)) % 12;
    // Saturn 1 sign per 2.5 years
    const satSign = (natalShaniSign + Math.floor((age - 1) / 2.5) % 12) % 12;

    // Find which natal planets are in that sign or in 1-5-9 trine from Progressed Jupiter
    const jupDirection = SIGN_INFO[jupSign].direction;
    const activatedPlanets = natalPlanets.filter(
      (p) => p.signIndex === jupSign || p.direction === jupDirection
    );

    const themes: string[] = [];
    const bnThemes: string[] = [];

    // Derive themes from activated planets (Manipuri Meiteilon in Bengali script)
    if (activatedPlanets.some((p) => p.id === 've')) {
      themes.push('Favorable for Marriage, Wealth, Vehicles & Partnerships');
      bnThemes.push('লুহোংবা, শেন-থুম ফংবা, গাড়ী-য়ুম লৈবা অমসুং অফবা মরী');
    }
    if (activatedPlanets.some((p) => p.id === 'sa')) {
      themes.push('Career Milestone, Elevation in Responsibility & Major Karma');
      bnThemes.push('Career Milestone, থবক্তা পদোন্নতি, অনৌবা থৌদাং লৌবা অমসুং মিংচৎ');
    }
    if (activatedPlanets.some((p) => p.id === 'me')) {
      themes.push('Educational Success, New Business Venture & Literary Acclaim');
      bnThemes.push('মহৈ-মশীংদা মাইপাকপা, অনৌবা ললোন-ইতিক হৌদোকপা অমসুং লৌশিং');
    }
    if (activatedPlanets.some((p) => p.id === 'su')) {
      themes.push('Government Recognition, Fatherly Blessings & Authority Rise');
      bnThemes.push('লৈঙাক্কী ইকায়খুম্নবা, ইপাগী থৌজান অমসুং ফম চাউবা');
    }
    if (activatedPlanets.some((p) => p.id === 'mo')) {
      themes.push('Travel Abroad / Relocation, Motherly Events & Mental Shifts');
      bnThemes.push('মফম হোংবা, মপান লৈপাক চৎপা, ইমাগী মঙ্গল অমসুং অনৌবা পুন্সি');
    }
    if (activatedPlanets.some((p) => p.id === 'ra')) {
      themes.push('Sudden Foreign Connections, Unconventional Growth & Expansion');
      bnThemes.push('খংহৌদনা খুদোংচাবা ফংবা, মপান লৈপাক্কা মরী লৈনবা অমসুং চাউখৎপা');
    }
    if (activatedPlanets.some((p) => p.id === 'ke')) {
      themes.push('Spiritual Initiation, Occult Learning & Auspicious Detachment');
      bnThemes.push('লাইনীংগী দীক্ষা, জ্যোতিষ তমশিনবা অমসুং থৱায়গী চাউখৎপা');
    }

    if (themes.length === 0) {
      themes.push('Consolidation Year, Steady Routine & Inner Growth');
      bnThemes.push('লেংদবা মতম, আত্মউন্নয়ন অমসুং শান্ত ওইবা চহি');
    }

    timeline.push({
      runningAge: age,
      calendarYear: calYear,
      jupiterSignIndex: jupSign,
      jupiterSignName: SIGN_INFO[jupSign].name,
      saturnSignIndex: satSign,
      saturnSignName: SIGN_INFO[satSign].name,
      activatedNatalPlanets: activatedPlanets,
      keyThemes: themes,
      bengaliThemes: bnThemes,
      isCurrentAge: age === currentRunningAge,
    });
  }

  const currentProgression =
    timeline.find((t) => t.isCurrentAge) || timeline[0];

  return { currentProgression, timeline };
}

/**
 * Targeted Query Types and Predictions Engine
 * Supports: Career, Govt. Job, Dasha, Marriage, Wealth, Foreign Travel, Education, Health
 */
export type TargetedQueryType =
  | 'govt-job'
  | 'career'
  | 'dasha'
  | 'marriage'
  | 'wealth'
  | 'foreign'
  | 'education'
  | 'health';

export interface TargetedQueryOption {
  id: TargetedQueryType;
  label: string;
  bnLabel: string;
  category: string;
  iconName: string;
  color: string;
}

export const TARGETED_QUERY_OPTIONS: TargetedQueryOption[] = [
  { id: 'govt-job', label: 'Govt. Job & Authority', bnLabel: 'লৈঙাক্কী থবক অমসুং ফম', category: 'career', iconName: 'Award', color: 'text-amber-700 bg-amber-50 border-amber-300' },
  { id: 'career', label: 'Career & Business', bnLabel: 'কর্ম অমসুং থবক লম্বী', category: 'career', iconName: 'Briefcase', color: 'text-blue-700 bg-blue-50 border-blue-300' },
  { id: 'marriage', label: 'Marriage & Relationship', bnLabel: 'লুহোংবা অমসুং দাম্পত্য', category: 'marriage', iconName: 'Heart', color: 'text-rose-700 bg-rose-50 border-rose-300' },
  { id: 'dasha', label: 'Present Dasha & Timing', bnLabel: 'হৌজিক চৎলিবা দশা অমসুং মতম', category: 'dasha', iconName: 'Clock', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
  { id: 'wealth', label: 'Wealth, Assets & Money', bnLabel: 'শেন-থুম অমসুং ইনাক খুনবা', category: 'wealth', iconName: 'Coins', color: 'text-amber-800 bg-amber-100/70 border-amber-400' },
  { id: 'foreign', label: 'Foreign Travel & Settlement', bnLabel: 'মপান লৈপাক অমসুং খোঙচৎ', category: 'foreign', iconName: 'Plane', color: 'text-sky-700 bg-sky-50 border-sky-300' },
  { id: 'education', label: 'Higher Education & Exams', bnLabel: 'মহৈ-মশীং অমসুং পরীক্ষা', category: 'education', iconName: 'GraduationCap', color: 'text-indigo-700 bg-indigo-50 border-indigo-300' },
  { id: 'health', label: 'Health & Vitality', bnLabel: 'হকচাং অমসুং অনা-অয়েক', category: 'health', iconName: 'Shield', color: 'text-teal-700 bg-teal-50 border-teal-300' },
];

export interface TargetedQueryPrediction {
  queryId: TargetedQueryType;
  title: string;
  bengaliTitle: string;
  verdict: string;
  verdictType: 'excellent' | 'favorable' | 'moderate' | 'challenging';
  bengaliVerdict: string;
  timingWindow: string;
  bengaliTimingWindow: string;
  primaryPlanets: string[];
  englishPrediction: string;
  bengaliPrediction: string;
  remedies: string[];
  bengaliRemedies: string[];
  keyFactors: { label: string; value: string; bnLabel: string }[];
}

/**
 * Generate in-depth astrological prediction for a targeted client inquiry
 */
export function generateTargetedQueryPrediction(
  queryId: TargetedQueryType,
  allPlanets: BNNPlanet[],
  runningAge: number = 23,
  gender: string = 'Male',
  dashaInfo?: { activeMaha?: string; activeAntar?: string; remainingText?: string }
): TargetedQueryPrediction {
  const getP = (id: string) => allPlanets.find((p) => p.id === id);
  const guru = getP('ju');
  const shani = getP('sa');
  const shukra = getP('ve');
  const mangal = getP('ma');
  const budha = getP('me');
  const surya = getP('su');
  const chandra = getP('mo');
  const rahu = getP('ra');
  const ketu = getP('ke');

  const isTrineOrLinked = (p1?: BNNPlanet, p2?: BNNPlanet) => {
    if (!p1 || !p2) return false;
    if (p1.signIndex === p2.signIndex) return true;
    if (p1.direction === p2.direction) return true;
    if ((p1.signIndex + 1) % 12 === p2.signIndex) return true;
    if ((p1.signIndex + 11) % 12 === p2.signIndex) return true;
    if ((p1.signIndex + 6) % 12 === p2.signIndex) return true;
    return false;
  };

  switch (queryId) {
    case 'govt-job': {
      // Analyze Sun (Raja), Saturn (Karma), Jupiter (Dharma), Mars (Authority)
      const sunSaturn = isTrineOrLinked(surya, shani);
      const sunGuru = isTrineOrLinked(surya, guru);
      const sunMars = isTrineOrLinked(surya, mangal);
      const sunRahu = isTrineOrLinked(surya, rahu);

      let verdict = 'Favorable Potential with Focused Effort';
      let verdictType: 'excellent' | 'favorable' | 'moderate' = 'favorable';
      let bnVerdict = 'কুপ্না চেষ্টা তৌবদা লৈঙাক্কী থবক ফংবগী খুদোংচাবা';

      if (sunSaturn && (sunGuru || sunMars)) {
        verdict = 'High Probability of Government / Public Authority Post';
        verdictType = 'excellent';
        bnVerdict = 'লৈঙাক্কী থবক অমসুং ফম চাউবা ফংবগী চাউরবা যোগ লৈরি';
      } else if (sunRahu) {
        verdict = 'Favorable for Autonomous / Public Corporation / Semi-Govt. Role';
        verdictType = 'favorable';
        bnVerdict = 'লৈঙাক্কী নিংতম্বা বোর্দ নত্রগা কোর্পোরেসন্দা থবক ফংবা';
      } else if (!sunSaturn && !sunGuru) {
        verdict = 'Requires Sustained Competitive Preparation';
        verdictType = 'moderate';
        bnVerdict = 'কন্না শুদুনা অকনবা পরীক্ষা থাবা মথৌ তাই';
      }

      const favorableAgeMin = Math.max(runningAge, 23);
      const favorableAgeMax = favorableAgeMin + 3;

      return {
        queryId,
        title: 'Government Job & Public Sector Authority',
        bengaliTitle: 'লৈঙাক্কী থবক অমসুং ফম চাউবা নৈনবা',
        verdict,
        verdictType,
        bengaliVerdict: bnVerdict,
        timingWindow: `Most active window between Running Age ${favorableAgeMin} and ${favorableAgeMax}`,
        bengaliTimingWindow: `চৎলিবা চহি ${favorableAgeMin} দগী ${favorableAgeMax} ফাউবগী মনুংদা Career Milestone ফংগনি`,
        primaryPlanets: ['Sun (সূর্য / Atma & Authority)', 'Saturn (শনি / Karma)', 'Jupiter (গুরু / Jiva)'],
        englishPrediction:
          `In Bhrigu Nandi Nadi, the alignment between Sun (Authority) and Saturn (Karma) is the hallmark of civil service, public administration, and state governance. ` +
          `Your natal chart indicates ${sunSaturn ? 'a direct directional union between Sun and Karma Karaka Saturn, indicating natural affinity with state institutions, civil service exams, or public administration.' : 'moderate alignment with administrative bodies, indicating success through competitive examinations, technical or PSU sector entries.'} ` +
          `Jupiter's progression across your career axis triggers an auspicious milestone window around age ${favorableAgeMin}–${favorableAgeMax}.`,
        bengaliPrediction:
          `ভৃগু নন্দী নাড়ী মতুং ইন্না, নুমিৎ (সূর্য - নিংথৌগী শক্তম) অমসুং শনি (কর্ম - থবক) অনি অসিনা লৈঙাক্কী থবক অমসুং সমাজদা ফম চাউবা ফংহনবদা মরুওইবা শক্তি পীরি। ` +
          `${sunSaturn ? 'অদোমগী পোকপদা নুমিৎ অমসুং শনিগী ত্রিকোণ মরী লৈবনা লৈঙাক্কী পরীক্ষা থাবদা অমসুং সরকারগী থৌদাং লৌবদা মাইপাকপগী চাউরবা খুদোংচাবা পীরি।' : 'লৈঙাক্কী সেক্তরদা চঙনবগীদমক কুপ্না হোৎনবা অমসুং খুদোংচাবা য়েংবা চুনগনি।'} ` +
          `খংহৌদনা থোক্লকপা খুদোংচাবশিংনা চহি ${favorableAgeMin} দগী ${favorableAgeMax} ফাউবগী মনুংদা অচৌবা Career Milestone পুরক্কনি।`,
        remedies: [
          'Offer fresh water (Arghya) in a copper vessel to Lord Surya at sunrise daily with the Gayatri Mantra.',
          'Recite Aditya Hridaya Stotram on Sundays to enhance administrative clarity and competitive vigor.',
          'Wear clean copper ring or ruby on ring finger if recommended by your astrologer.',
        ],
        bengaliRemedies: [
          'আয়ুক্কী নুমিৎ য়াল্লকপদা কপারগী পোৎলমদা নুমিৎপু ঈশিং কত্থোকপীয়ু (সূর্য অর্ঘ্য)।',
          'নোংমাইজিং নুমিৎতা আদিত্য হৃদয় স্তোত্র নত্রগা গায়ত্রী মন্ত্র পাঠ তৌবীয়ু।',
          'মীয়ামদা পাউতাক পীবা ওজাশিং অমসুং ইপাগী ইকায়খুম্নবা থমবীয়ু।',
        ],
        keyFactors: [
          { label: 'Sun Alignment', value: sunSaturn ? 'Strong 1-5-9 Trine with Saturn' : 'Secondary Axis', bnLabel: 'সূর্যগী শক্তি' },
          { label: 'Authority Karaka', value: sunGuru ? 'Brahma-Raja Yoga Active' : 'Neutral Support', bnLabel: 'রাজ সম্মান' },
          { label: 'Exam Readiness', value: 'High Aptitude for State/Central Selection', bnLabel: 'পরীক্ষা থাবগী শক্তি' },
        ],
      };
    }

    case 'career': {
      // Saturn (Karma) + its 2nd and trine influences
      const satBudha = isTrineOrLinked(shani, budha);
      const satMars = isTrineOrLinked(shani, mangal);
      const satVenus = isTrineOrLinked(shani, shukra);
      const satRahu = isTrineOrLinked(shani, rahu);

      let fieldName = 'General Professional Administration & Services';
      let bnFieldName = 'থবক অমসুং ললোন-ইতিক্কী লম্বী';

      if (satBudha) {
        fieldName = 'Banking, Commercial Trade, IT Software, Accounts & Advisory';
        bnFieldName = 'বেঙ্কিং, ললোন-ইতিক, সফটৱ্যার, একাউন্তস অমসুং মিডিয়া';
      } else if (satMars) {
        fieldName = 'Engineering, Construction, Technology, Real Estate & Uniformed Services';
        bnFieldName = 'ইঞ্জিনীয়রিং, কারিগরি, লম-লৈপাক অমসুং পুলিস/ডিফেন্স';
      } else if (satVenus) {
        fieldName = 'Corporate Finance, Luxury Design, Entertainment, Architecture & Commerce';
        bnFieldName = 'ফাইনান্স, নুপীগী পোৎলম, গাড়ী-য়ুম, ডিজাইন অমসুং আর্ট';
      } else if (satRahu) {
        fieldName = 'Multinational Corporations (MNCs), Artificial Intelligence, Aviation & Foreign Media';
        bnFieldName = 'মপানগী কম্পেনি (MNC), কম্প্যুতর, অনৌবা তেক্নোলোজি অমসুং মিডিয়া';
      }

      const nextMilestoneAge = runningAge <= 24 ? 25 : runningAge <= 28 ? 29 : runningAge + 2;

      return {
        queryId,
        title: 'Career Trajectory & Professional Growth',
        bengaliTitle: 'কর্ম অমসুং থবক লম্বী নৈনবা',
        verdict: 'Expansive Career Growth with Permanent Settlement',
        verdictType: 'excellent',
        bengaliVerdict: 'থবক্তা পদোন্নতি ফংবা অমসুং লেংদনা ফবা কর্ম পুন্সি',
        timingWindow: `Major promotion and expansion window peaks at Running Age ${nextMilestoneAge}`,
        bengaliTimingWindow: `চৎলিবা চহি ${nextMilestoneAge}দা থবক্তা অচৌবা Career Milestone অমসুং পদোন্নতি ফংগনি`,
        primaryPlanets: ['Saturn (শনি / Karma Karaka)', 'Mercury (বুধ / Commerce)', 'Jupiter (গুরু / Growth)'],
        englishPrediction:
          `In BNN, Saturn represents your livelihood and professional deeds. Your chart highlights ${fieldName}. ` +
          `The directional links confirm that while your early efforts require discipline and learning, your professional status stabilizes permanently. ` +
          `A definitive Career Milestone is highlighted at age ${nextMilestoneAge}, marked by higher financial compensation and team leadership.`,
        bengaliPrediction:
          `ভৃগু নন্দী নাড়ীদ শনি অসি কর্ম কারকনি। অদোমগী থবক্কী মরুওইবা লম্বী অসি ${bnFieldName} ওইনা লৈরি। ` +
          `অহানবদা হোৎনবা চঙলবসু তুংদা থবক অসি লেংদনা অফবা ফমদা লৈগনি। ` +
          `চৎলিবা চহি ${nextMilestoneAge}দা অদোমগী থবক ফম হেনগৎলগা Career Milestone অমসুং শেল-থুমগী অফবা খুদোংচাবা ফংগনি।`,
        remedies: [
          'Feed black sesame seeds or mustard oil lamp to Lord Shani on Saturdays.',
          'Help working-class laborers and maintain humility with subordinate staff.',
          'Keep your workspace clean, orderly, and face East or North while working.',
        ],
        bengaliRemedies: [
          'থাংজা নুমিৎতা শনিগী মীংদা মৈরা থানবীয়ু অমসুং শু-নোম্বা মীওইশিংদা মতেং পাংবীয়ু।',
          'থবক শুরিবা মীওইশিংগা মচিন-মনাও চুননা চৎপীয়ু।',
          'থবক তৌবা মতমদা নোংপোক নত্রগা অৱাং মাইকৈদা মায় ওনবীয়ু।',
        ],
        keyFactors: [
          { label: 'Prime Career Domain', value: fieldName, bnLabel: 'থবক্কী কাংলুপ' },
          { label: 'Work Style', value: 'Steady, Authoritative & Independent', bnLabel: 'থবক্কী শক্তম' },
          { label: 'Next Milestone', value: `Age ${nextMilestoneAge}`, bnLabel: 'তুংগী Career Milestone' },
        ],
      };
    }

    case 'marriage': {
      // For Male: Venus is Kalatra; For Female: Mars is Pati & Jupiter is Jiva
      const isMale = gender.toLowerCase() === 'male';
      const primeKaraka = isMale ? shukra : mangal;
      const karakaName = isMale ? 'Venus (শুক্র - Stree & Kalatra Karaka)' : 'Mars & Jupiter (মঙ্গল ও গুরু - Pati Karaka)';

      const satLinked = isTrineOrLinked(primeKaraka, shani);
      const rahuLinked = isTrineOrLinked(primeKaraka, rahu);
      const ketuLinked = isTrineOrLinked(primeKaraka, ketu);

      let marriageTiming = 'Running Age 24 – 27';
      let bnMarriageTiming = 'চহি ২৪ দগী ২৭ গী মনুংদা';

      if (satLinked) {
        marriageTiming = 'Running Age 26 – 29 (Mature and solid timing)';
        bnMarriageTiming = 'চহি ২৬ দগী ২৯ গী মনুংদা (লেংদবা অমসুং কনবা দাম্পত্য)';
      }

      return {
        queryId,
        title: 'Marriage Timing & Relationship Harmony',
        bengaliTitle: 'লুহোংবা অমসুং দাম্পত্য পুন্সি নৈনবা',
        verdict: 'Auspicious Alignment for Harmonious Marital Life',
        verdictType: 'excellent',
        bengaliVerdict: 'নুংঙাইরবা দাম্পত্য অমসুং লাইবক ফবা খোঙলোই ফংবা',
        timingWindow: marriageTiming,
        bengaliTimingWindow: bnMarriageTiming,
        primaryPlanets: [karakaName, 'Jupiter (গুরু - Blessing)', 'Moon (চন্দ্র - Mind)'],
        englishPrediction:
          `In Bhrigu Nandi Nadi, marriage is governed by ${karakaName}. ` +
          `Your chart indicates a ${rahuLinked ? 'charismatic, modern, and attractive partner with broad horizons.' : ketuLinked ? 'spiritually inclined, intelligent, and deeply devoted partner.' : 'respectful, family-oriented, and affectionate life partner.'} ` +
          `${satLinked ? 'Saturn aspect ensures long-term commitment and maturity, with wedding realization most favorable around ' + marriageTiming + '.' : 'Venus and Jupiter transits open a major auspicious wedding window in ' + marriageTiming + '.'}`,
        bengaliPrediction:
          `ভৃগু নন্দী নাড়ীদ লুহোংবগী কারক অসি ${isMale ? 'শুক্র (নুপীগী কারক)' : 'মঙ্গল অমসুং গুরু (স্বামী কারক)'}নি। ` +
          `অদোমগী চার্ট মতুং ইন্না, পুন্সিগী খোঙলোই অদু ${rahuLinked ? 'মশক ফজরবা, তেক্নোলোজি নত্রগা অনৌবা ৱাখল্লোন লৈবা মীওই ওইগনি।' : ketuLinked ? 'লাইনীংদা পুকচিংবা অমসুং শান্ত ওইবা মীওই ওইগনি।' : 'ইমুংগী ইকায়খুম্নবা থম্বা অমসুং নুংশিবা মীওই ওইগনি।'} ` +
          `লুহোংবগী খ্বাইদগী ফবা মতম অসি ${bnMarriageTiming} ওইগনি। খংহৌদনা অফবা মরী পুরকপগী খুদোংচাবা লৈরি।`,
        remedies: [
          'Recite Lakshmi-Narayan or Parvati-Shiva Stotram on Fridays to strengthen romantic blessing.',
          'Offer fragrant white flowers or sweet milk offerings on Friday morning.',
          'Cultivate patience and clear communication with partner regarding family goals.',
        ],
        bengaliRemedies: [
          'ইরোকপা নুমিৎতা লক্ষ্মী-নারায়ণগী স্তোত্র পাঠ তৌবীয়ু।',
          'অঙৌবা কুহুম্বী লৈ কত্থোকপীয়ু অমসুং লুহোংবগী ৱাফমদা ইমুংগা খঙন-মিন্নবীয়ু।',
          'নুংশিবা মীওইগা ৱারী ৱাতায়দা শান্ত ওইনা চৎপীয়ু।',
        ],
        keyFactors: [
          { label: 'Marital Karaka', value: isMale ? 'Venus Active' : 'Mars-Jupiter Alignment', bnLabel: 'দাম্পত্য কারক' },
          { label: 'Partner Nature', value: 'Dignified, Supportive & Caring', bnLabel: 'খোঙলোইগী শক্তম' },
          { label: 'Best Window', value: marriageTiming, bnLabel: 'লুহোংবগী মতম' },
        ],
      };
    }

    case 'dasha': {
      const mahaLord = dashaInfo?.activeMaha || 'Active Period';
      const antarLord = dashaInfo?.activeAntar || 'Sub Period';
      const remainingTime = dashaInfo?.remainingText || 'Ongoing';

      return {
        queryId,
        title: 'Present Running Dasha & Life Timeline',
        bengaliTitle: 'হৌজিক চৎলিবা দশা অমসুং মতমগী ফল',
        verdict: `Active Vimshottari Phase: ${mahaLord} - ${antarLord}`,
        verdictType: 'favorable',
        bengaliVerdict: `চৎলিবা দশা: ${mahaLord} - ${antarLord} (${remainingTime})`,
        timingWindow: `Current Period Active with Remaining: ${remainingTime}`,
        bengaliTimingWindow: `হৌজিক চৎলিবা মতম: লেমহৌরিবা ${remainingTime}`,
        primaryPlanets: [`Mahadasha: ${mahaLord}`, `Antardasha: ${antarLord}`, 'Jupiter Transit'],
        englishPrediction:
          `You are presently traversing the ${mahaLord} Mahadasha with ${antarLord} Antardasha (${remainingTime} remaining). ` +
          `In Vedic astrology, this combination directs your consciousness toward tangible achievement, disciplined routine, and financial groundwork. ` +
          `Jupiter's Nadi progression this year simultaneously stimulates growth, urging you to seize newly opened initiatives rather than hesitating.`,
        bengaliPrediction:
          `অদোম হৌজিক ${mahaLord}গী মহাদশা অমসুং ${antarLord}গী অন্তর্দশা ভোগ তৌরি (লেমহৌরিবা মতম: ${remainingTime})। ` +
          `দশা অসিগী মতুং ইন্না, অদোমগী ৱাখল অসি থবক শুবা, শেন-থুম তুংশিনবা অমসুং তুংগীদমক শক্তি লৌশিনবদা পুকচিংলি। ` +
          `গুরুগী নাড়ী গোচরনা চহি অসিদা অনৌবা খুদোংচাবা পুরকপদা খংহৌদনা মায়পাকপা ফংহনগনি।`,
        remedies: [
          `Perform remedial prayers or japa corresponding to ${mahaLord} on its ruling weekday.`,
          'Practice 15 minutes of calm meditation each morning to keep mental clarity sharp.',
          'Give charitable food donations to needy elders to balance planetary energies.',
        ],
        bengaliRemedies: [
          `মহাদশা প্রভু ${mahaLord}গী মন্ত্র নত্রগা লাই খুরুম্বগী থবক তৌবীয়ু।`,
          'অয়ুকতা ৱাখল শান্ত ওইহন্নবা ধ্যানে তৌবীয়ু।',
          'অহল-লমনশিং অমসুং ইনাক খুন্দরবা মীওইশিংদা চিঞ্জাক পীদুনা দান তৌবীয়ু।',
        ],
        keyFactors: [
          { label: 'Mahadasha Lord', value: mahaLord, bnLabel: 'মহাদশা প্রভু' },
          { label: 'Antardasha Lord', value: antarLord, bnLabel: 'অন্তর্দশা প্রভু' },
          { label: 'Status', value: `Remaining ${remainingTime}`, bnLabel: 'লেমহৌরিবা মতম' },
        ],
      };
    }

    case 'wealth': {
      const venSat = isTrineOrLinked(shukra, shani);
      const venRahu = isTrineOrLinked(shukra, rahu);
      const venBudha = isTrineOrLinked(shukra, budha);

      return {
        queryId,
        title: 'Wealth, Assets & Financial Abundance',
        bengaliTitle: 'শেন-থুম অমসুং ইনাক খুনবা নৈনবা',
        verdict: 'Substantial Wealth Accumulation & Stable Asset Growth',
        verdictType: 'excellent',
        bengaliVerdict: 'শেন-থুম ফংবা অমসুং লন-থুম লেংদনা ফগৎপা',
        timingWindow: `Strong financial compounding from Age ${Math.max(runningAge, 24)} onwards`,
        bengaliTimingWindow: `চহি ${Math.max(runningAge, 24)} দগী হৌনা শেল-থুমগী অফবা ইথক পুরক্কনি`,
        primaryPlanets: ['Venus (শুক্র / Dhana Karaka)', 'Mercury (বুধ / Commerce)', 'Jupiter (গুরু / Wealth)'],
        englishPrediction:
          `Wealth in Nadi is governed by Venus (Dhana Karaka) and its links with Saturn (Karma) and Mercury (Commerce). ` +
          `${venSat ? 'You possess Lakshmi-Karma Yoga, which guarantees permanent real estate assets, vehicle acquisition, and long-term capital safety.' : 'Your financial indicators point to steady cash flow and business acumen.'} ` +
          `${venRahu ? 'Rahu link indicates sudden windfalls and unconventional wealth accumulation channels.' : 'Wealth multiplies significantly through systematic investments and real property.'}`,
        bengaliPrediction:
          `ভৃগু নন্দী নাড়ীদ শুক্র অসি ধন কারকনি। অদোমগী চার্ট মতুং ইন্না, ${venSat ? 'লক্ষ্মী-কর্ম যোগ লৈবনা গাড়ী-য়ুম লৈবা, লম লৈবা অমসুং স্থায়ী ওইবা লন-থুম ফংগনি।' : 'ললোন-ইতিক অমসুং থবক্তগী অফবা শেন-থুম লাক্কনি।'} ` +
          `${venRahu ? 'রাহুগী মরী অসিনা খংহৌদনা অচৌবা শেল ফংবগী খুদোংচাবসু পুরক্কনি।' : 'তুংগীদমক শেন-থুম তুংশিনবা অমসুং চাউখৎহনবা ঙমগনি।'}`,
        remedies: [
          'Keep your wallet clean and place a silver coin or Sri Yantra inside.',
          'Donate white clothes or sweets to women on Fridays.',
          'Avoid taking speculative unnecessary debts; invest systematically in gold or real property.',
        ],
        bengaliRemedies: [
          'ইরোকপা নুমিৎতা লুপাগী পোৎলম নত্রগা শ্রী যন্ত্র থম্বীয়ু।',
          'নুপীশিংদা অঙৌবা পোৎলম নত্রগা চিঞ্জাক কত্থোকপীয়ু।',
          'অচুম্বা লম্বীদা শেল তুংশিনবদা অমসুং লম-লৈপাক্তা ইনভেস্ত তৌবীয়ু।',
        ],
        keyFactors: [
          { label: 'Dhana Alignment', value: venSat ? 'Lakshmi-Karma Yoga Active' : 'Solid Financial Trine', bnLabel: 'ধন যোগ' },
          { label: 'Asset Types', value: 'Real Estate, Vehicles & Commercial Savings', bnLabel: 'লন-থুমগী শক্তম' },
          { label: 'Prosperity Horizon', value: 'Long-term High Security', bnLabel: 'তুংগী ফীভম' },
        ],
      };
    }

    case 'foreign': {
      const rahuMoon = isTrineOrLinked(rahu, chandra);
      const rahuSat = isTrineOrLinked(rahu, shani);
      const moonSat = isTrineOrLinked(chandra, shani);

      const highForeign = rahuMoon || (rahuSat && moonSat);

      return {
        queryId,
        title: 'Foreign Travel, Relocation & Overseas Horizon',
        bengaliTitle: 'মপান লৈপাক অমসুং খোঙচৎ নৈনবা',
        verdict: highForeign ? 'High Likelihood of Foreign Travel / Living Abroad' : 'Favorable for Long-Distance Travel & MNC Career',
        verdictType: highForeign ? 'excellent' : 'favorable',
        bengaliVerdict: highForeign ? 'মপান লৈপাক চৎপগী অমসুং খোঙচৎকী চাউরবা খুদোংচাবা' : 'মফম হোংবা অমসুং দূর দেশকী থবক্তা মাইপাকপা',
        timingWindow: `Triggered strongly during Rahu / Moon sub-transits (Age ${runningAge} - ${runningAge + 3})`,
        bengaliTimingWindow: `চহি ${runningAge} দগী ${runningAge + 3} গী মনুংদা মপান লৈপাক্কা মরী লৈনবা ৱাফম থোক্কনি`,
        primaryPlanets: ['Rahu (রাহু / Foreign Horizons)', 'Moon (চন্দ্র / Travel & Waters)', 'Saturn (শনি / Relocation)'],
        englishPrediction:
          `In BNN astrology, Rahu represents foreign territory, modern globalization, and life away from one's birthplace, while Moon signifies geographic movement. ` +
          `${highForeign ? 'A strong link between Rahu and Moon/Saturn is detected in your chart, indicating strong probabilities of international travel, foreign employment in MNCs, or residency overseas.' : 'Your chart supports business travel, relocation away from native town, and fruitful interactions with international firms.'} ` +
          `Relocating across boundaries serves as a direct catalyst for your financial expansion.`,
        bengaliPrediction:
          `ভৃগু নন্দী নাড়ীদ রাহু অমসুং চন্দ্রনা মপান লৈপাক অমসুং খোঙচৎপু তাক্লি। ` +
          `${highForeign ? 'অদোমগী কুণ্ডলীদা রাহু অমসুং চন্দ্রগী অফবা মরী লৈবনা মপান লৈপাক চৎপা, মপানগী কম্পেনিদা থবক শুবা নত্রগা পোকফম মফমদগী লাপ্না লৈরগা চাউখৎপগী চাউরবা লাইবক লৈ।' : 'খোঙচৎ চৎতুনা শুবা থবক অমসুং মফম হোংবদা অথোইবা কান্নবা ফংগনি।'} ` +
          `খংহৌদনা মপান লৈপাক্কা মরী লৈনবা খুদোংচাবা লাক্কনি।`,
        remedies: [
          'Maintain international travel passport and credentials up to date.',
          'Feed migratory birds or birds on terraces with grain water.',
          'Keep a small silver item or conch shell in your travel luggage.',
        ],
        bengaliRemedies: [
          'মপান লৈপাক চৎপগী চে-চাং অমসুং পাসপোর্ত য়াম্না কুপ্না থম্বীয়ু।',
          'উচেকশিংদা খুদোংচানা চিঞ্জাক অমসুং ঈশিং পীবীয়ু।',
          'খোঙচৎ চৎপদা ৱাখল শান্ত ওইনা থম্বীয়ু।',
        ],
        keyFactors: [
          { label: 'Foreign Axis', value: highForeign ? 'Direct Rahu-Moon Link' : 'Secondary Planetary Travel Trine', bnLabel: 'মপান লৈপাক্কী মরী' },
          { label: 'Relocation Benefit', value: 'Highly Positive for Wealth & Career', bnLabel: 'মফম হোংবগী ফল' },
          { label: 'Target Window', value: `Age ${runningAge}–${runningAge + 3}`, bnLabel: 'খোঙচৎকী মতম' },
        ],
      };
    }

    case 'education': {
      const budhaGuru = isTrineOrLinked(budha, guru);
      const budhaKetu = isTrineOrLinked(budha, ketu);

      return {
        queryId,
        title: 'Higher Education, Competitive Exams & Intellect',
        bengaliTitle: 'মহৈ-মশীং অমসুং বুদ্ধি নৈনবা',
        verdict: 'Superior Academic Intellect & Sharp Grasping Power',
        verdictType: 'excellent',
        bengaliVerdict: 'মহৈ-মশীংদা হৈ-শিংবা অমসুং তীক্ষ্ণ বুদ্ধি লৈবা',
        timingWindow: `Peak learning and credential mastery active right now`,
        bengaliTimingWindow: `হৌজিক্কী মতম অসি মহৈ-মশীং অমসুং পরীক্ষা থাবগী খ্বাইদগী ফবা মতম্নি`,
        primaryPlanets: ['Mercury (বুধ / Buddhi & Speech)', 'Jupiter (গুরু / Higher Wisdom)', 'Ketu (কেতু / Analysis)'],
        englishPrediction:
          `Intellect is powered by Mercury (analytical intellect) and Jupiter (higher wisdom). ` +
          `${budhaGuru ? 'You possess Saraswati Yoga, bestowing quick retention, eloquence, and success in certifications and competitive examinations.' : 'You have a practical and logical intelligence.'} ` +
          `${budhaKetu ? 'The Ketu connection endows phenomenal aptitude for software programming, astrology, mathematics, law, or micro-level research.' : 'Ideal for commerce, management, science, and strategic counseling.'}`,
        bengaliPrediction:
          `লৌশিং অমসুং বুদ্ধি অসি বুধ অমসুং গুরুনা তাক্লি। ` +
          `${budhaGuru ? 'অদোমদা সরস্বতী যোগ লৈবনা মহৈ-মশীংদা চাউনা হৈ-শিংবা, পরীক্ষা থাবদা মাইপাকপা অমসুং ৱাফম খঙনা ঙাংবা ঙমহনগনি।' : 'বুদ্ধি লৈনা অমসুং নিয়ম চুম্না মহৈ তমশিনবা ঙমগনি।'} ` +
          `${budhaKetu ? 'কেতুগী মরী অসিনা কোদিং, জ্যোতিষশাস্ত্র, আইন নত্রগা সাইন্সবু কুপ্না নৈনবদা অচৌবা লৌশিং পীরি।' : 'ললোন-ইতিক অমসুং লৈঙাক্কী কাংলুপতা অফবা মহৈ ফংগনি।'}`,
        remedies: [
          'Chant Saraswati Vandana or the Budha Mantra on Wednesdays.',
          'Keep green cardamom or tulsi leaf with you on exam days.',
          'Support underprivileged children with books or pens.',
        ],
        bengaliRemedies: [
          'য়ুমশকৈশা নুমিৎতা সরস্বতী লাই খুরুম্বীয়ু অমসুং বুধগী মন্ত্র পাঠ তৌবীয়ু।',
          'অঙাংগী মহৈ-মশীং তম্বদা লাইরিক-চে নত্রগা কলম দান তৌবীয়ু।',
          'পরীক্ষা থাবা মতমদা তুলসীগী মনা থম্বীয়ু।',
        ],
        keyFactors: [
          { label: 'Intellect Strength', value: budhaGuru ? 'Saraswati Yoga Active' : 'Strong Analytical Intellect', bnLabel: 'লৌশিংগী শক্তম' },
          { label: 'Recommended Fields', value: 'Management, IT, Law, Finance, Science', bnLabel: 'মহৈগী লম্বী' },
          { label: 'Exam Outlook', value: 'High Success in Competitive Selection', bnLabel: 'পরীক্ষাদা মাইপাকপা' },
        ],
      };
    }

    case 'health': {
      const sunAfflicted = isTrineOrLinked(surya, rahu) || isTrineOrLinked(surya, ketu);
      const moonAfflicted = isTrineOrLinked(chandra, shani) || isTrineOrLinked(chandra, rahu);

      return {
        queryId,
        title: 'Health, Vitality & Physical Well-Being',
        bengaliTitle: 'হকচাং অমসুং অনা-অয়েক নৈনবা',
        verdict: 'Sound Vitality with Need for Balanced Daily Regimen',
        verdictType: 'favorable',
        bengaliVerdict: 'হকচাংগী মপাঙ্গল লৈবা অমসুং নিয়ম চুননা চৎপগী মথৌ তাবা',
        timingWindow: 'Stable physical constitution; guard against seasonal fatigue',
        bengaliTimingWindow: 'হকচাং ফনা লৈরি; ৱাখলগী অশোয়-অঙাম লৈতবা মথৌ তাই',
        primaryPlanets: ['Sun (সূর্য / Life Force & Heart)', 'Jupiter (গুরু / Immunity)', 'Mars (মঙ্গল / Vitality)'],
        englishPrediction:
          `In BNN astrology, physical vitality is governed by Sun (Atma & Bones), Mars (Blood & Muscle vitality), and Jupiter (Immunity). ` +
          `Your vitality is protected by Jupiter's grace. ` +
          `${moonAfflicted ? 'Take conscious care of sleep hygiene, hydration, and anxiety management, as Moon-Saturn/Rahu links can induce periodic mental fatigue.' : 'Maintain active physical exercise to prevent sluggish metabolism.'} ` +
          `${sunAfflicted ? 'Ensure daily exposure to natural morning sunlight and check bone/vitamin D levels.' : 'Constitution remains resilient against major ailments.'}`,
        bengaliPrediction:
          `ভৃগু নন্দী নাড়ীদ হকচাংগী শক্তি অসি নুমিৎ (সূর্য - থৱায়গী মপাঙ্গল), মঙ্গল (ঈ অমসুং মপাঙ্গল) অমসুং গুরু (লায়না লাকশিনবা) না তাক্লি। ` +
          `অদোমগী হকচাং অসি অপাম্বা মতুং ইন্না মপাঙ্গল লৈ। ` +
          `${moonAfflicted ? 'ৱাখলদা তপ্না চৎপা, অফবা নুমিৎতুংদা তুম্বা অমসুং ঈশিং কুপ্না থকপীয়ু।' : 'নিয়ম চুননা এক্সরসাইজ তৌবনা হকচাং হেন্না কনগনি।'} ` +
          `হকচাং অসি অপাম্বা লায়নাদগী ঙাকথোকপা ঙম্মি।`,
        remedies: [
          'Practice 20 minutes of morning Pranayama (Anulom Vilom) and Surya Namaskar.',
          'Drink water stored in a copper jug overnight.',
          'Avoid skipping breakfast; eat warm, freshly cooked sattvic meals.',
        ],
        bengaliRemedies: [
          'অয়ুকতা প্রানায়াম অমসুং সূর্য নমস্কার তৌবীয়ু।',
          'কপারগী পোৎলমদা থম্বা ঈশিং থকপীয়ু।',
          'চাক চাবদা মতম কুপ্না চুননা চৎপীয়ু অমসুং অশোয়বা পোৎলম লৌদবীয়ু।',
        ],
        keyFactors: [
          { label: 'Immunity Level', value: 'Strong Protective Planetary Shield', bnLabel: 'লায়না লাকশিনবগী শক্তি' },
          { label: 'Areas of Focus', value: 'Digestive regularity, sleep hygiene & hydration', bnLabel: 'চেকশিনগদবা মফম' },
          { label: 'Longevity Horizon', value: 'Sound, Robust & Resilient', bnLabel: 'হকচাংগী তুংগী ফীভম' },
        ],
      };
    }
  }
}
