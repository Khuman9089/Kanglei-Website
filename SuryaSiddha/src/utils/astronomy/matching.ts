// Ashtakoota 36-Guna Milan Vedic Compatibility Engine
import { AshtakootaResult, GunaScoreItem, NakshatraInfo } from '../../types/astronomy';
import { NAKSHATRAS } from '../../data/nakshatras';
import { RASHIS } from '../../data/rashis';

// Planetary friendship matrix
const PLANET_FRIENDS: Record<string, { friends: string[]; neutrals: string[]; enemies: string[] }> = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], neutrals: ['Mercury'], enemies: ['Venus', 'Saturn'] },
  Moon: { friends: ['Sun', 'Mercury'], neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: [] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], neutrals: ['Venus', 'Saturn'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], neutrals: ['Mars', 'Jupiter', 'Saturn'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], neutrals: ['Saturn'], enemies: ['Mercury', 'Venus'] },
  Venus: { friends: ['Mercury', 'Saturn'], neutrals: ['Mars', 'Jupiter'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus'], neutrals: ['Jupiter'], enemies: ['Sun', 'Moon', 'Mars'] },
};

export function calculateAshtakoota(
  maleMoonLong: number,
  femaleMoonLong: number
): AshtakootaResult {
  const maleNakIdx = Math.floor((((maleMoonLong % 360) + 360) % 360) / (360 / 27));
  const femaleNakIdx = Math.floor((((femaleMoonLong % 360) + 360) % 360) / (360 / 27));
  const maleNak = NAKSHATRAS[maleNakIdx];
  const femaleNak = NAKSHATRAS[femaleNakIdx];

  const maleRashiIdx = Math.floor((((maleMoonLong % 360) + 360) % 360) / 30);
  const femaleRashiIdx = Math.floor((((femaleMoonLong % 360) + 360) % 360) / 30);
  const maleRashi = RASHIS[maleRashiIdx];
  const femaleRashi = RASHIS[femaleRashiIdx];

  const items: GunaScoreItem[] = [];

  // 1. Varna (1 Point) - Spiritual Ego & Temperament
  const varnaOrder = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };
  const varnaMaleScore = varnaOrder[maleNak.varna] || 1;
  const varnaFemaleScore = varnaOrder[femaleNak.varna] || 1;
  const varnaPoints = varnaMaleScore >= varnaFemaleScore ? 1 : 0;
  items.push({
    name: 'Varna Koota',
    sanskritName: 'वर्ण कूट',
    maxScore: 1,
    obtainedScore: varnaPoints,
    area: 'Spiritual Ego & Intellectual Harmony',
    description: 'Measures spiritual alignment and mutual ego compatibility.',
    maleAttribute: maleNak.varna,
    femaleAttribute: femaleNak.varna,
  });

  // 2. Vashya (2 Points) - Mutual Dominance & Control
  let vashyaPoints = 0;
  if (maleNak.vashya === femaleNak.vashya) vashyaPoints = 2;
  else if (
    (maleNak.vashya === 'Manava' && femaleNak.vashya === 'Chatushpada') ||
    (maleNak.vashya === 'Chatushpada' && femaleNak.vashya === 'Jalachara')
  ) {
    vashyaPoints = 1;
  }
  items.push({
    name: 'Vashya Koota',
    sanskritName: 'वश्य कूट',
    maxScore: 2,
    obtainedScore: vashyaPoints,
    area: 'Mutual Magnetism & Leadership Flow',
    description: 'Evaluates mutual attraction and emotional balance.',
    maleAttribute: maleNak.vashya,
    femaleAttribute: femaleNak.vashya,
  });

  // 3. Tara (3 Points) - Destiny & Health Well-being
  // Count from bride nak to groom nak and vice versa
  let countFtoM = (maleNak.index - femaleNak.index + 27) % 27 + 1;
  let countMtoF = (femaleNak.index - maleNak.index + 27) % 27 + 1;
  let taraFtoM = countFtoM % 9;
  let taraMtoF = countMtoF % 9;
  const auspiciousTaras = [1, 2, 4, 6, 8, 9, 0];
  let taraPoints = 0;
  const isFAuspicious = auspiciousTaras.includes(taraFtoM);
  const isMAuspicious = auspiciousTaras.includes(taraMtoF);
  if (isFAuspicious && isMAuspicious) taraPoints = 3;
  else if (isFAuspicious || isMAuspicious) taraPoints = 1.5;
  items.push({
    name: 'Tara Koota',
    sanskritName: 'तारा कूट',
    maxScore: 3,
    obtainedScore: taraPoints,
    area: 'Destiny, Health & Longevity Alignment',
    description: 'Calculates the auspiciousness of birth constellations.',
    maleAttribute: `Tara ${taraMtoF || 9}`,
    femaleAttribute: `Tara ${taraFtoM || 9}`,
  });

  // 4. Yoni (4 Points) - Intimacy & Biological Affinity
  let yoniPoints = 2; // Default moderate affinity
  if (maleNak.yoni === femaleNak.yoni) {
    yoniPoints = 4;
  }
  items.push({
    name: 'Yoni Koota',
    sanskritName: 'योनि कूट',
    maxScore: 4,
    obtainedScore: yoniPoints,
    area: 'Physical Intimacy & Biological Compatibility',
    description: 'Symbolic animal instincts and psychological affinity.',
    maleAttribute: maleNak.yoni,
    femaleAttribute: femaleNak.yoni,
  });

  // 5. Graha Maitri (5 Points) - Mental Friendship & Psychological Rapport
  const maleLord = maleRashi.lord;
  const femaleLord = femaleRashi.lord;
  let maitriPoints = 1;
  if (maleLord === femaleLord) {
    maitriPoints = 5;
  } else {
    const maleRel = PLANET_FRIENDS[maleLord]?.friends.includes(femaleLord)
      ? 'Friend'
      : PLANET_FRIENDS[maleLord]?.neutrals.includes(femaleLord)
      ? 'Neutral'
      : 'Enemy';
    const femaleRel = PLANET_FRIENDS[femaleLord]?.friends.includes(maleLord)
      ? 'Friend'
      : PLANET_FRIENDS[femaleLord]?.neutrals.includes(maleLord)
      ? 'Neutral'
      : 'Enemy';

    if (maleRel === 'Friend' && femaleRel === 'Friend') maitriPoints = 5;
    else if ((maleRel === 'Friend' && femaleRel === 'Neutral') || (maleRel === 'Neutral' && femaleRel === 'Friend')) maitriPoints = 4;
    else if (maleRel === 'Neutral' && femaleRel === 'Neutral') maitriPoints = 3;
    else if ((maleRel === 'Friend' && femaleRel === 'Enemy') || (maleRel === 'Enemy' && femaleRel === 'Friend')) maitriPoints = 1;
    else if ((maleRel === 'Neutral' && femaleRel === 'Enemy') || (maleRel === 'Enemy' && femaleRel === 'Neutral')) maitriPoints = 0.5;
    else maitriPoints = 0;
  }
  items.push({
    name: 'Graha Maitri Koota',
    sanskritName: 'ग्रह मैत्री कूट',
    maxScore: 5,
    obtainedScore: maitriPoints,
    area: 'Mental Harmony & Deep Friendship',
    description: 'Evaluates intellectual alignment of Rashi planetary lords.',
    maleAttribute: `${maleRashi.name} (${maleLord})`,
    femaleAttribute: `${femaleRashi.name} (${femaleLord})`,
  });

  // 6. Gana (6 Points) - Temperament & Behavioral Rhythm (Deva, Manushya, Rakshasa)
  let ganaPoints = 0;
  let ganaDosha = false;
  if (maleNak.ganam === femaleNak.ganam) {
    ganaPoints = 6;
  } else if (
    (maleNak.ganam === 'Deva' && femaleNak.ganam === 'Manushya') ||
    (maleNak.ganam === 'Manushya' && femaleNak.ganam === 'Deva')
  ) {
    ganaPoints = 5;
  } else if (
    (maleNak.ganam === 'Rakshasa' && femaleNak.ganam === 'Deva') ||
    (maleNak.ganam === 'Deva' && femaleNak.ganam === 'Rakshasa')
  ) {
    ganaPoints = 1;
    ganaDosha = true;
  } else {
    ganaPoints = 0;
    ganaDosha = true;
  }
  items.push({
    name: 'Gana Koota',
    sanskritName: 'गण कूट',
    maxScore: 6,
    obtainedScore: ganaPoints,
    area: 'Temperament, Worldview & Behavioral Rhythm',
    description: 'Distributes temperamental classification into Deva, Manushya, and Rakshasa.',
    maleAttribute: maleNak.ganam,
    femaleAttribute: femaleNak.ganam,
  });

  // 7. Bhakoot (7 Points) - Family Growth & Emotional Prosperity
  let rashiDiff = Math.abs(maleRashiIdx - femaleRashiIdx) + 1;
  if (rashiDiff > 7) rashiDiff = 14 - rashiDiff;
  let bhakootPoints = 7;
  let bhakootDosha = false;

  // Inauspicious differences: 2/12, 6/8, 9/5
  const directDiff = (femaleRashiIdx - maleRashiIdx + 12) % 12 + 1;
  if (directDiff === 2 || directDiff === 12 || directDiff === 6 || directDiff === 8 || directDiff === 5 || directDiff === 9) {
    // If lords are same or friends, cancellation applies
    if (maleLord === femaleLord || PLANET_FRIENDS[maleLord]?.friends.includes(femaleLord)) {
      bhakootPoints = 7; // Cancellation
    } else {
      bhakootPoints = 0;
      bhakootDosha = true;
    }
  }
  items.push({
    name: 'Bhakoot Koota',
    sanskritName: 'भकूट कूट',
    maxScore: 7,
    obtainedScore: bhakootPoints,
    area: 'Family Prosperity, Emotional Joy & Children',
    description: 'Relative Moon signs distance assessing emotional longevity.',
    maleAttribute: maleRashi.name,
    femaleAttribute: femaleRashi.name,
  });

  // 8. Nadi (8 Points) - Genetic & Physiological Compatibility (Adi, Madhya, Antya)
  let nadiPoints = 0;
  let nadiDosha = false;
  if (maleNak.nadi !== femaleNak.nadi) {
    nadiPoints = 8;
  } else {
    // Same Nadi: Nadi Dosha unless Nakshatra is same with different Pada or different Rashi
    if (maleNak.index === femaleNak.index && maleRashiIdx !== femaleRashiIdx) {
      nadiPoints = 8; // Cancelled
    } else {
      nadiPoints = 0;
      nadiDosha = true;
    }
  }
  items.push({
    name: 'Nadi Koota',
    sanskritName: 'नाड़ी कूट',
    maxScore: 8,
    obtainedScore: nadiPoints,
    area: 'Genetic Health, Progeny & Vital Force Prana',
    description: 'Crucial physiological and bio-magnetic resonance.',
    maleAttribute: maleNak.nadi,
    femaleAttribute: femaleNak.nadi,
  });

  const totalScore = items.reduce((sum, it) => sum + it.obtainedScore, 0);
  const percentage = Math.round((totalScore / 36) * 100);

  let status: AshtakootaResult['status'] = 'Average';
  let summary = '';

  if (totalScore >= 28) {
    status = 'Excellent';
    summary = 'Outstanding astrological compatibility. Highly recommended for a blessed and harmonious union.';
  } else if (totalScore >= 18) {
    status = 'Good';
    summary = 'Good compatibility exceeding classical threshold (> 18/36). Minor doshas can be balanced through remedies.';
  } else {
    status = 'Not Recommended';
    summary = 'Compatibility falls below standard 18-point threshold. In-depth individual chart analysis and remedies strongly advised.';
  }

  return {
    totalScore,
    maxScore: 36,
    percentage,
    status,
    summary,
    items,
    nadiDosha,
    bhakootDosha,
    ganaDosha,
  };
}
