import {
  BirthProfile,
  ZodiacSignInfo,
  NumerologyProfile,
  LifeCyclePhase,
  YearlyPredictionReport,
  YearlyMonthForecast,
  CompatibilityResult,
  TarotCard,
  DailyHoroscope
} from '../types';

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    name: 'Aries',
    symbol: '♈',
    dates: 'Mar 21 – Apr 19',
    element: 'Fire',
    rulingPlanet: 'Mars',
    quality: 'Cardinal',
    trait: 'Courage, Initiative & Vitality',
    strengths: ['Decisive', 'Pioneering', 'Passionate', 'Resilient'],
    challenges: ['Impatience', 'Impulsiveness', 'Restlessness']
  },
  {
    name: 'Taurus',
    symbol: '♉',
    dates: 'Apr 20 – May 20',
    element: 'Earth',
    rulingPlanet: 'Venus',
    quality: 'Fixed',
    trait: 'Patience, Stability & Abundance',
    strengths: ['Dependable', 'Methodical', 'Loyal', 'Sensory Awareness'],
    challenges: ['Stubbornness', 'Resistance to change', 'Over-cautious']
  },
  {
    name: 'Gemini',
    symbol: '♊',
    dates: 'May 21 – Jun 20',
    element: 'Air',
    rulingPlanet: 'Mercury',
    quality: 'Mutable',
    trait: 'Curiosity, Intellect & Adaptability',
    strengths: ['Versatile', 'Articulate', 'Witty', 'Social Flow'],
    challenges: ['Scattered focus', 'Inconsistency', 'Overthinking']
  },
  {
    name: 'Cancer',
    symbol: '♋',
    dates: 'Jun 21 – Jul 22',
    element: 'Water',
    rulingPlanet: 'Moon',
    quality: 'Cardinal',
    trait: 'Intuition, Empathy & Devotion',
    strengths: ['Deep Empathy', 'Protective', 'Nurturing', 'Instinctive'],
    challenges: ['Moodiness', 'Over-defensiveness', 'Clinging to past']
  },
  {
    name: 'Leo',
    symbol: '♌',
    dates: 'Jul 23 – Aug 22',
    element: 'Fire',
    rulingPlanet: 'Sun',
    quality: 'Fixed',
    trait: 'Radiance, Generosity & Leadership',
    strengths: ['Charismatic', 'Noble', 'Warm-hearted', 'Visionary'],
    challenges: ['Pride', 'Need for validation', 'Impatience with slow pace']
  },
  {
    name: 'Virgo',
    symbol: '♍',
    dates: 'Aug 23 – Sep 22',
    element: 'Earth',
    rulingPlanet: 'Mercury',
    quality: 'Mutable',
    trait: 'Analysis, Precision & Service',
    strengths: ['Systematic', 'Insightful', 'Practical', 'Refined'],
    challenges: ['Perfectionism', 'Self-criticism', 'Over-analyzing']
  },
  {
    name: 'Libra',
    symbol: '♎',
    dates: 'Sep 23 – Oct 22',
    element: 'Air',
    rulingPlanet: 'Venus',
    quality: 'Cardinal',
    trait: 'Harmony, Diplomacy & Balance',
    strengths: ['Charming', 'Fair-minded', 'Aesthetic eye', 'Collaborative'],
    challenges: ['Indecision', 'Avoiding friction', 'People pleasing']
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    dates: 'Oct 23 – Nov 21',
    element: 'Water',
    rulingPlanet: 'Mars & Pluto',
    quality: 'Fixed',
    trait: 'Depth, Resilience & Transformation',
    strengths: ['Unshakable', 'Perceptive', 'Loyal', 'Strategic'],
    challenges: ['Secretiveness', 'Reluctance to forgive', 'All-or-nothing mindset']
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    dates: 'Nov 22 – Dec 21',
    element: 'Fire',
    rulingPlanet: 'Jupiter',
    quality: 'Mutable',
    trait: 'Wisdom, Exploration & Optimism',
    strengths: ['Expansive', 'Philosophical', 'Honest', 'Inspirational'],
    challenges: ['Over-promising', 'Restlessness', 'Tactlessness']
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    dates: 'Dec 22 – Jan 19',
    element: 'Earth',
    rulingPlanet: 'Saturn',
    quality: 'Cardinal',
    trait: 'Discipline, Mastery & Endurance',
    strengths: ['Pragmatic', 'Structured', 'Persistent', 'Authoritative'],
    challenges: ['Emotional reserve', 'Workaholism', 'Pessimistic caution']
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    dates: 'Jan 20 – Feb 18',
    element: 'Air',
    rulingPlanet: 'Saturn & Uranus',
    quality: 'Fixed',
    trait: 'Innovation, Humanity & Freedom',
    strengths: ['Visionary', 'Altruistic', 'Original', 'Independent'],
    challenges: ['Detachment', 'Unpredictable', 'Rebellious for its own sake']
  },
  {
    name: 'Pisces',
    symbol: '♓',
    dates: 'Feb 19 – Mar 20',
    element: 'Water',
    rulingPlanet: 'Jupiter & Neptune',
    quality: 'Mutable',
    trait: 'Compassion, Intuition & Mysticism',
    strengths: ['Creative', 'Empathetic', 'Spiritual depth', 'Generous'],
    challenges: ['Escapism', 'Boundary issues', 'Over-idealism']
  }
];

// Helper: Digit Reduction for Numerology (Preserving Master Numbers 11, 22, 33)
export function reduceDigits(num: number, preserveMaster = true): number {
  let sum = num;
  while (sum > 9) {
    if (preserveMaster && (sum === 11 || sum === 22 || sum === 33)) {
      return sum;
    }
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}

// 1. ZODIAC CALCULATOR (DOB only)
export function calculateZodiacSign(dob: string): ZodiacSignInfo {
  const [yearStr, monthStr, dayStr] = (dob || '1995-08-15').split('-');
  const month = parseInt(monthStr, 10) || 8;
  const day = parseInt(dayStr, 10) || 15;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2];
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6];
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7];
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10];
  return ZODIAC_SIGNS[11];
}

// 2. NUMEROLOGY CALCULATOR (DOB only)
export function calculateNumerology(dob: string): NumerologyProfile {
  const [yearStr, monthStr, dayStr] = (dob || '1995-08-15').split('-');
  const year = parseInt(yearStr, 10) || 1995;
  const month = parseInt(monthStr, 10) || 8;
  const day = parseInt(dayStr, 10) || 15;

  // Life Path: sum of all digits
  const allDigits = `${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}`
    .split('')
    .reduce((sum, d) => sum + (parseInt(d, 10) || 0), 0);
  const lifePathNumber = reduceDigits(allDigits, true);

  // Birth Day Number: day of birth reduced
  const birthDayNumber = reduceDigits(day, false);

  const archetypes: Record<number, { meaning: string; archetype: string }> = {
    1: { meaning: 'Leadership, Innovation & Independence', archetype: 'The Pioneer' },
    2: { meaning: 'Diplomacy, Harmony & Intuition', archetype: 'The Peacemaker' },
    3: { meaning: 'Self-Expression, Creativity & Joy', archetype: 'The Communicator' },
    4: { meaning: 'Structure, Order & Practical Mastery', archetype: 'The Builder' },
    5: { meaning: 'Freedom, Adventure & Adaptability', archetype: 'The Visionary Explorer' },
    6: { meaning: 'Nurturing, Responsibility & Harmony', archetype: 'The Caregiver & Healer' },
    7: { meaning: 'Wisdom, Solitude & Deep Truth', archetype: 'The Philosopher & Seeker' },
    8: { meaning: 'Abundance, Executive Power & Authority', archetype: 'The Achiever' },
    9: { meaning: 'Compassion, Humanitarianism & Completion', archetype: 'The Sage' },
    11: { meaning: 'Illumination, High Intuition & Inspiration', archetype: 'Master Intuitive' },
    22: { meaning: 'Manifesting Big Dreams into Reality', archetype: 'Master Builder' },
    33: { meaning: 'Universal Love & Spiritual Upliftment', archetype: 'Master Teacher' }
  };

  const dayMeanings: Record<number, string> = {
    1: 'Innate Willpower & Initiative',
    2: 'Gentle Cooperation & Empathy',
    3: 'Creative Radiance & Optimism',
    4: 'Steadfast Reliability & Grounding',
    5: 'Quick Adaptability & Magnetic Charm',
    6: 'Familial Loyalty & Protective Instincts',
    7: 'Analytical Depth & Spiritual Reflection',
    8: 'Executive Clarity & Material Focus',
    9: 'Universal Kindness & Artistic Flair'
  };

  const destinyNo = ((lifePathNumber * 3) % 9) || 9;
  const soulUrgeNo = ((birthDayNumber * 2) % 9) || 1;
  const personalityNo = ((lifePathNumber + birthDayNumber) % 9) || 7;

  return {
    lifePathNumber,
    lifePathMeaning: archetypes[lifePathNumber]?.meaning || 'Unique Destiny & Cosmic Purpose',
    lifePathArchetype: archetypes[lifePathNumber]?.archetype || 'The Explorer',
    birthDayNumber,
    birthDayMeaning: dayMeanings[birthDayNumber] || 'Creative Balance',
    destinyNumber: destinyNo,
    destinyMeaning: 'Material & Intellectual Mastery',
    soulUrgeNumber: soulUrgeNo,
    soulUrgeMeaning: 'Deep Authenticity & Peaceful Connection',
    personalityNumber: personalityNo,
    luckyNumbers: [birthDayNumber, lifePathNumber, (birthDayNumber + 4) % 9 || 9],
    favorableDays: ['Sunday', 'Wednesday', 'Friday']
  };
}

// 3. LIFE CYCLES CALCULATOR (DOB only)
export function calculateLifeCycles(dob: string): LifeCyclePhase[] {
  const [yearStr] = (dob || '1995-08-15').split('-');
  const birthYear = parseInt(yearStr, 10) || 1995;
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;

  const phases = [
    {
      ageRange: '0 – 18',
      title: 'Foundation & Roots',
      theme: 'Formative Conditioning & Affinity Discovery',
      description: 'The period of learning foundational emotional habits, family integration, and identifying natural artistic or intellectual inclinations.',
      focusArea: 'Core Self-Belief',
      active: currentAge >= 0 && currentAge <= 18
    },
    {
      ageRange: '19 – 27',
      title: 'Exploration & Horizons',
      theme: 'Autonomous Trial & Identity Testing',
      description: 'Navigating independence from ancestral frames, career experimentation, defining romantic values, and discovering true personal boundaries.',
      focusArea: 'Resilience & Independence',
      active: currentAge >= 19 && currentAge <= 27
    },
    {
      ageRange: '28 – 36',
      title: 'Growth & Manifestation',
      theme: 'Saturn Return & Long-Term Commitments',
      description: 'Shedding non-essential distractions, stepping into professional authority, deepening partnership vows, and establishing financial roots.',
      focusArea: 'Sustained Execution',
      active: currentAge >= 28 && currentAge <= 36
    },
    {
      ageRange: '37 – 45',
      title: 'Consolidation & Peak Influence',
      theme: 'Executive Mastery & Asset Compounding',
      description: 'Maximizing vocational output, strategic investments, emotional calm, and guiding the next generation with hard-earned wisdom.',
      focusArea: 'Strategic Focus',
      active: currentAge >= 37 && currentAge <= 45
    },
    {
      ageRange: '46+',
      title: 'Wisdom & Cosmic Legacy',
      theme: 'Mentorship, Wholeness & Spiritual Fulfillment',
      description: 'Stepping into elder statesman status, prioritizing legacy, spiritual contribution, peace of mind, and passing down life-tested insights.',
      focusArea: 'Spiritual Legacy',
      active: currentAge >= 46
    }
  ];

  return phases;
}

// 4. YEARLY PREDICTION CALCULATOR (DOB only)
export function calculateYearlyPrediction(dob: string, year = 2026): YearlyPredictionReport {
  const zodiac = calculateZodiacSign(dob);
  const numerology = calculateNumerology(dob);

  const months: YearlyMonthForecast[] = [
    {
      month: 'January',
      theme: 'Intention & Clarity',
      focus: 'Clearing outdated commitments and architecting your 1-year blueprint.',
      opportunity: 'Resetting daily energetic routines for maximum focus.',
      advice: 'Take 2 uninterrupted hours to write down your top 3 non-negotiables.',
      cosmicScore: 88
    },
    {
      month: 'February',
      theme: 'Network Synergy',
      focus: 'Reconnecting with key professional collaborators and authentic friends.',
      opportunity: 'High alignment for strategic introductions and mentorship.',
      advice: 'Reach out to 2 people who inspire you without asking for anything in return.',
      cosmicScore: 84
    },
    {
      month: 'March',
      theme: 'Equinox Reflection',
      focus: 'Internal grounding, physical wellness check, and clearing clutter.',
      opportunity: 'Rebalancing work rhythm before the active spring surge.',
      advice: 'Schedule a digital sundown 30 minutes before sleep.',
      cosmicScore: 82
    },
    {
      month: 'April',
      theme: 'Creative Radiance',
      focus: 'High solar vitality; pitching proposals, creative output, and visibility.',
      opportunity: 'Executive leadership moments and prominent public communication.',
      advice: 'Be bold in speaking your truth during team initiatives.',
      cosmicScore: 92
    },
    {
      month: 'May',
      theme: 'Financial Structuring',
      focus: 'Auditing recurring expenditures and locking in systematic compounding.',
      opportunity: 'Favorable terms for contracts, asset additions, and debt paydown.',
      advice: 'Automate transfers into savings within 24 hours of receiving income.',
      cosmicScore: 86
    },
    {
      month: 'June',
      theme: 'Planetary Acceleration',
      focus: 'Jupiter-backed momentum; breakthroughs in vocational milestones.',
      opportunity: 'New responsibilities that stretch your leadership capabilities.',
      advice: 'Say yes to opportunities that slightly frighten and inspire you.',
      cosmicScore: 95
    },
    {
      month: 'July',
      theme: 'Emotional Sanctuary',
      focus: 'Deepening partnership bonds, family harmony, and domestic peace.',
      opportunity: 'Honest heart-to-heart discussions resolving unspoken tensions.',
      advice: 'Create an evening without screens to connect with loved ones.',
      cosmicScore: 89
    },
    {
      month: 'August',
      theme: 'Solar Vitality Renewal',
      focus: 'Peak self-confidence, physical energy rejuvenation, and clear vision.',
      opportunity: 'Launching major personal initiatives with natural charisma.',
      advice: 'Celebrate your personal progress over the past 12 months.',
      cosmicScore: 94
    },
    {
      month: 'September',
      theme: 'Systematic Execution',
      focus: 'Streamlining daily workflows and eliminating friction in projects.',
      opportunity: 'Mastering a high-leverage tool or professional skillset.',
      advice: 'Declutter your workspace and systematize repetitive tasks.',
      cosmicScore: 87
    },
    {
      month: 'October',
      theme: 'Diplomacy & Equilibrium',
      focus: 'Balancing aggressive professional goals with relational warmth.',
      opportunity: 'Negotiating mutually beneficial terms in ongoing collaborations.',
      advice: 'Listen 70% of the time in critical negotiations.',
      cosmicScore: 85
    },
    {
      month: 'November',
      theme: 'Intuitive Discernment',
      focus: 'Recognizing subtle shifts in your industry and acting with precision.',
      opportunity: 'Uncovering undervalued assets or overlooked creative pathways.',
      advice: 'Trust your first instinct when evaluating trustworthiness.',
      cosmicScore: 90
    },
    {
      month: 'December',
      theme: 'Harvest & Gratitude',
      focus: 'Acknowledging compounded achievements and closing out the cycle.',
      opportunity: 'Deep satisfaction, festive connection, and sovereign peace.',
      advice: 'Document your top 10 lessons of the year in your journal.',
      cosmicScore: 93
    }
  ];

  return {
    year,
    overallTheme: `A pivotal year of deliberate foundation-building turning into high-impact expansion for ${zodiac.name}.`,
    careerOutlook: `Under your ${zodiac.element} nature and Life Path ${numerology.lifePathNumber}, 2026 brings moments to claim executive ownership and lead with integrity rather than chasing quick validation.`,
    loveOutlook: `Partnerships stabilize through transparent communication. Singles encounter emotionally mature connections through shared philosophical and intellectual pursuits.`,
    financialOutlook: `Solidify your safety net during Q1-Q2; the mid-year planetary transit supports calculated asset accumulation and sustainable compounding.`,
    wellnessOutlook: `Prioritize circadian rhythm balance and daily breathwork to channel your energetic fire into sustained output without nervous exhaustion.`,
    personalGrowth: `A curriculum of radical self-trust: shedding people-pleasing habits and stepping unapologetically into your authentic authority.`,
    months
  };
}

// 5. COMPATIBILITY CALCULATOR
export function calculateCompatibilityScore(signA: string, signB: string): CompatibilityResult {
  const zA = ZODIAC_SIGNS.find((z) => z.name === signA) || ZODIAC_SIGNS[4];
  const zB = ZODIAC_SIGNS.find((z) => z.name === signB) || ZODIAC_SIGNS[8];

  let score = 75;
  let rating = 'Growth & Learning Alignment';
  let synergy = 'Complementary energies offering profound opportunities for mutual growth.';

  if (zA.element === zB.element) {
    score = 92;
    rating = 'Harmonic Elemental Resonance';
    synergy = `Both share the sacred ${zA.element} element, creating instant instinctual understanding, matching life tempo, and shared drive.`;
  } else if (
    (zA.element === 'Fire' && zB.element === 'Air') ||
    (zA.element === 'Air' && zB.element === 'Fire')
  ) {
    score = 88;
    rating = 'Dynamic Catalyst Synergy';
    synergy = 'Air feeds Fire, creating an inspiring bond charged with visionary discussions, intellectual playfulness, and shared adventures.';
  } else if (
    (zA.element === 'Earth' && zB.element === 'Water') ||
    (zA.element === 'Water' && zB.element === 'Earth')
  ) {
    score = 89;
    rating = 'Grounded & Nurturing Sanctuary';
    synergy = 'Water enriches Earth while Earth stabilizes Water, forging an unbreakable foundation of emotional trust, loyalty, and lasting home life.';
  } else {
    score = 72;
    rating = 'Dynamic Contrast & Evolution';
    synergy = 'Differing natural styles encourage both partners to develop new emotional muscles, patience, and fresh perspectives.';
  }

  return {
    score,
    rating,
    elementalSynergy: synergy,
    communication: {
      score: Math.min(95, score + 4),
      text: 'Openness to different viewpoints unlocks rich mutual respect and problem-solving.'
    },
    emotionalConnection: {
      score: Math.min(96, score - 2),
      text: 'Direct emotional honesty prevents assumptions from eroding initial warmth.'
    },
    lifestyleHarmony: {
      score: score,
      text: 'Harmonious when each partner preserves healthy personal autonomy.'
    },
    longTermPotential: {
      score: Math.min(98, score + 3),
      text: 'High durability when grounded in transparent mutual agreements and loyalty.'
    },
    advice: 'Celebrate what makes each of you distinct. Freedom and devoted commitment flourish together when nurtured with kindness.'
  };
}

// 6. DAILY HOROSCOPE GENERATOR (DOB only)
export function getDailyHoroscope(dob: string): DailyHoroscope {
  const zodiac = calculateZodiacSign(dob);
  const numerology = calculateNumerology(dob);
  const today = new Date().toISOString().split('T')[0];

  const messages: Record<string, string> = {
    Fire: 'Your inner fire is clear and steady today. Direct your passion into finishing high-impact tasks.',
    Earth: 'Ground yourself in deliberate, methodical steps. What you construct with care today will endure.',
    Air: 'Your mind is agile and communicative. A casual conversation could spark an unexpected breakthrough.',
    Water: 'Trust your quiet intuitive hunches today. Emotional clarity arrives through patient listening.'
  };

  return {
    date: today,
    cosmicMessage: messages[zodiac.element] || 'Trust your inner compass; quiet deliberate focus clears every hurdle.',
    overall: `Favorable cosmic tendencies surround your ${zodiac.name} placements today. Balance action with mindful presence.`,
    career: `A productive window for strategic planning and executive clarity. Protect 90 minutes for deep, distraction-free work.`,
    love: `A gentle gesture or thoughtful text fosters warmth and connection. Speak with openness and authenticity.`,
    money: `Maintain financial discipline; avoid impulsive convenience spending and celebrate your savings trajectory.`,
    wellness: `Stay hydrated and practice 5 minutes of mindful breathwork to release accumulated tension.`,
    luckyNumber: numerology.luckyNumbers[0],
    luckyColor: zodiac.element === 'Fire' ? 'Gold & Saffron' : zodiac.element === 'Earth' ? 'Emerald Green' : zodiac.element === 'Air' ? 'Sky Blue' : 'Pearl White',
    luckyDay: numerology.favorableDays[0],
    powerHour: '10:00 AM – 11:30 AM'
  };
}

// 7. TAROT DECK
export const TAROT_CARDS: TarotCard[] = [
  {
    id: 'the_sun',
    name: 'The Sun',
    arcana: 'Major Arcana XIX',
    symbol: '☀️',
    upright: 'Radiance, Vitality, Success & Clear Illumination',
    love: 'Warmth, shared joy, unconditional acceptance, and celebratory moments.',
    career: 'Public recognition, confident leadership, and major project breakthroughs.',
    growth: 'Stepping out of self-doubt into authentic, joyful self-expression.'
  },
  {
    id: 'the_star',
    name: 'The Star',
    arcana: 'Major Arcana XVII',
    symbol: '⭐',
    upright: 'Hope, Cosmic Inspiration, Renewal & Serenity',
    love: 'Peaceful healing of past misunderstandings and emotional renewal.',
    career: 'Long-term vision aligning with authentic vocation and inspiring ideas.',
    growth: 'Trusting divine timing and maintaining serene inner faith.'
  },
  {
    id: 'the_magician',
    name: 'The Magician',
    arcana: 'Major Arcana I',
    symbol: '🔮',
    upright: 'Manifestation, Resourcefulness & Focused Willpower',
    love: 'Clear communication, magnetic attraction, and proactive romantic initiative.',
    career: 'You hold all the necessary skills; execute with confidence.',
    growth: 'Aligning your thoughts, words, and daily habits with your goals.'
  },
  {
    id: 'the_empress',
    name: 'The Empress',
    arcana: 'Major Arcana III',
    symbol: '🌸',
    upright: 'Abundance, Nurturing Creativity & Natural Growth',
    love: 'Sensory warmth, deep emotional safety, and shared domestic beauty.',
    career: 'Projects bearing tangible fruit; fertile ground for collaborative creation.',
    growth: 'Embracing self-care, bodily nourishment, and nature immersion.'
  },
  {
    id: 'the_chariot',
    name: 'The Chariot',
    arcana: 'Major Arcana VII',
    symbol: '🛡️',
    upright: 'Triumph, Focused Determination & Self-Discipline',
    love: 'Overcoming external obstacles together through united loyalty.',
    career: 'Overcoming competitive challenges and advancing decisively toward goals.',
    growth: 'Mastering emotional impulses and steering your life with sovereign intent.'
  },
  {
    id: 'wheel_of_fortune',
    name: 'Wheel of Fortune',
    arcana: 'Major Arcana X',
    symbol: '☸️',
    upright: 'Cosmic Cycles, Destiny Turning & Auspicious Shifts',
    love: 'Serendipitous encounters and positive turning points in relationships.',
    career: 'Unexpected doors opening; seize auspicious timing with quick action.',
    growth: 'Flowing with life changes gracefully, knowing every cycle elevates you.'
  }
];
