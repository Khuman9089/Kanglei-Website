// Classical Vedic Yoga Detection Engine (Parashari & Jaimini rules)
import { PlanetPosition, YogaItem } from '../../types/astronomy';
import { RASHIS } from '../../data/rashis';

// Helper to get lord of a Rashi
function getRashiLord(rashiIndex: number): string {
  return RASHIS[rashiIndex].lord;
}

export function detectVedicYogas(
  planets: Record<string, PlanetPosition>,
  lagnaRashi: number
): YogaItem[] {
  const yogas: YogaItem[] = [];

  const sun = planets.Sun;
  const moon = planets.Moon;
  const mars = planets.Mars;
  const mercury = planets.Mercury;
  const jupiter = planets.Jupiter;
  const venus = planets.Venus;
  const saturn = planets.Saturn;
  const rahu = planets.Rahu;
  const ketu = planets.Ketu;

  if (!moon || !sun || !mars || !mercury || !jupiter || !venus || !saturn) {
    return yogas;
  }

  // 1. Gajakesari Yoga (Jupiter in Kendra from Moon: 1, 4, 7, 10)
  let jupFromMoon = jupiter.rashi - moon.rashi + 1;
  if (jupFromMoon <= 0) jupFromMoon += 12;
  const isGajakesari = [1, 4, 7, 10].includes(jupFromMoon);
  yogas.push({
    name: 'Gajakesari Yoga',
    sanskritName: 'गजकेसरी योग',
    category: 'Raja Yoga',
    description: `Jupiter is placed in Kendra (${jupFromMoon}th house) from natal Moon (${moon.rashiName}).`,
    result: 'Endows profound wisdom, eloquence, high scholarly reputation, lasting royal honor, and leadership.',
    isPresent: isGajakesari,
    participatingPlanets: ['Jupiter', 'Moon'],
  });

  // 2. Budhaditya Yoga (Sun & Mercury conjunct)
  const isBudhaditya = sun.rashi === mercury.rashi;
  yogas.push({
    name: 'Budhaditya Yoga',
    sanskritName: 'बुधादित्य योग',
    category: 'Raja Yoga',
    description: `Sun and Mercury are conjunct in the sign of ${sun.rashiName} (House ${sun.house}).`,
    result: 'Grants sharp intellectual prowess, administrative brilliance, analytical distinction, and mathematical insight.',
    isPresent: isBudhaditya,
    participatingPlanets: ['Sun', 'Mercury'],
  });

  // 3. Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in Own/Exaltation in Kendras 1, 4, 7, 10 from Lagna)
  const isKendra = (h: number) => [1, 4, 7, 10].includes(h);

  // 3a. Ruchaka Yoga (Mars)
  const isRuchaka = isKendra(mars.house) && (mars.dignity === 'Exalted' || mars.dignity === 'Own' || mars.dignity === 'Moolatrikona');
  yogas.push({
    name: 'Ruchaka Mahapurusha Yoga',
    sanskritName: 'रुचक महापुरुष योग',
    category: 'Mahapurusha',
    description: `Mars is placed strongly in ${mars.rashiName} (House ${mars.house}), a cardinal Kendra angle.`,
    result: 'Creates courage, military/executive authority, dynamic willpower, physical magnetism, and heroic enterprise.',
    isPresent: isRuchaka,
    participatingPlanets: ['Mars'],
  });

  // 3b. Bhadra Yoga (Mercury)
  const isBhadra = isKendra(mercury.house) && (mercury.dignity === 'Exalted' || mercury.dignity === 'Own' || mercury.dignity === 'Moolatrikona');
  yogas.push({
    name: 'Bhadra Mahapurusha Yoga',
    sanskritName: 'भद्र महापुरुष योग',
    category: 'Mahapurusha',
    description: `Mercury is placed in dignity in ${mercury.rashiName} (House ${mercury.house}) in Kendra.`,
    result: 'Bestows scholarly genius, commercial triumph, photographic memory, and commanding oratorical skill.',
    isPresent: isBhadra,
    participatingPlanets: ['Mercury'],
  });

  // 3c. Hamsa Yoga (Jupiter)
  const isHamsa = isKendra(jupiter.house) && (jupiter.dignity === 'Exalted' || jupiter.dignity === 'Own' || jupiter.dignity === 'Moolatrikona');
  yogas.push({
    name: 'Hamsa Mahapurusha Yoga',
    sanskritName: 'हंस महापुरुष योग',
    category: 'Mahapurusha',
    description: `Jupiter is exalted/own sign in ${jupiter.rashiName} (House ${jupiter.house}) in Kendra.`,
    result: 'Bestows spiritual reverence, noble character, saintly disposition, broad universal respect, and high divine protection.',
    isPresent: isHamsa,
    participatingPlanets: ['Jupiter'],
  });

  // 3d. Malavya Yoga (Venus)
  const isMalavya = isKendra(venus.house) && (venus.dignity === 'Exalted' || venus.dignity === 'Own' || venus.dignity === 'Moolatrikona');
  yogas.push({
    name: 'Malavya Mahapurusha Yoga',
    sanskritName: 'मालव्य महापुरुष योग',
    category: 'Mahapurusha',
    description: `Venus is placed gracefully in ${venus.rashiName} (House ${venus.house}) in Kendra.`,
    result: 'Gives exceptional artistic gifts, luxury, romantic fulfillment, vehicles, wealth, and charismatic grace.',
    isPresent: isMalavya,
    participatingPlanets: ['Venus'],
  });

  // 3e. Sasa Yoga (Saturn)
  const isSasa = isKendra(saturn.house) && (saturn.dignity === 'Exalted' || saturn.dignity === 'Own' || saturn.dignity === 'Moolatrikona');
  yogas.push({
    name: 'Sasa Mahapurusha Yoga',
    sanskritName: 'शश महापुरुष योग',
    category: 'Mahapurusha',
    description: `Saturn is exalted or in own domain in ${saturn.rashiName} (House ${saturn.house}) in Kendra.`,
    result: 'Endows steadfast endurance, leadership over large organizations or public masses, and lasting legacy through diligence.',
    isPresent: isSasa,
    participatingPlanets: ['Saturn'],
  });

  // 4. Chandra-Mangala Yoga (Moon & Mars Conjunction)
  const isChandraMangala = moon.rashi === mars.rashi;
  yogas.push({
    name: 'Chandra Mangala Yoga',
    sanskritName: 'चन्द्र मंगल योग',
    category: 'Dhana Yoga',
    description: `Moon and Mars are conjunct in ${moon.rashiName} (House ${moon.house}).`,
    result: 'Generates extraordinary financial acumen, commercial drive, self-made wealth, and swift resource mobilization.',
    isPresent: isChandraMangala,
    participatingPlanets: ['Moon', 'Mars'],
  });

  // 5. Amala Yoga (Benefic in 10th House from Lagna or Moon)
  const isAmalaLagna = [jupiter.house, venus.house, mercury.house].includes(10);
  let jupFromM = (jupiter.rashi - moon.rashi + 1 + 12) % 12 || 12;
  let venFromM = (venus.rashi - moon.rashi + 1 + 12) % 12 || 12;
  let mercFromM = (mercury.rashi - moon.rashi + 1 + 12) % 12 || 12;
  const isAmalaMoon = [jupFromM, venFromM, mercFromM].includes(10);
  const isAmala = isAmalaLagna || isAmalaMoon;

  yogas.push({
    name: 'Amala Yoga',
    sanskritName: 'अमल योग',
    category: 'Auspicious',
    description: 'Benefic planets (Jupiter, Venus, or Mercury) occupy the 10th house of career from Lagna or Moon.',
    result: 'Gives unblemished professional reputation, ethical prosperity, lasting philanthropic deeds, and lifelong renown.',
    isPresent: isAmala,
    participatingPlanets: ['Jupiter', 'Venus', 'Mercury'],
  });

  // 6. Dharma Karmadhipati Yoga (Conjunction/Mutual aspect of 9th & 10th Lords)
  const rashi9 = (lagnaRashi + 8) % 12;
  const rashi10 = (lagnaRashi + 9) % 12;
  const lord9 = getRashiLord(rashi9);
  const lord10 = getRashiLord(rashi10);
  const pLord9 = planets[lord9];
  const pLord10 = planets[lord10];

  let isDharmaKarma = false;
  if (pLord9 && pLord10) {
    if (pLord9.rashi === pLord10.rashi || (pLord9.house + 6) % 12 + 1 === pLord10.house) {
      isDharmaKarma = true;
    }
  }

  yogas.push({
    name: 'Dharma Karmadhipati Yoga',
    sanskritName: 'धर्म कर्माधिपति योग',
    category: 'Raja Yoga',
    description: `Lord of 9th (Fortune: ${lord9}) and Lord of 10th (Action: ${lord10}) form a sacred combination.`,
    result: 'The pinnacle Raja Yoga aligning spiritual destiny with monumental worldly impact and regal success.',
    isPresent: isDharmaKarma,
    participatingPlanets: [lord9, lord10],
  });

  // 7. Vipreet Raja Yogas (Dusthana lords in Dusthanas: 6, 8, 12)
  const rashi6 = (lagnaRashi + 5) % 12;
  const rashi8 = (lagnaRashi + 7) % 12;
  const rashi12 = (lagnaRashi + 11) % 12;
  const lord6 = planets[getRashiLord(rashi6)];
  const lord8 = planets[getRashiLord(rashi8)];
  const lord12 = planets[getRashiLord(rashi12)];

  const isDusthana = (h: number) => [6, 8, 12].includes(h);

  // 7a. Harsha Yoga (6th lord in 6, 8, 12)
  const isHarsha = lord6 && isDusthana(lord6.house);
  yogas.push({
    name: 'Harsha Vipreet Raja Yoga',
    sanskritName: 'हर्ष विपरीत राजयोग',
    category: 'Raja Yoga',
    description: `6th house lord (${lord6?.name}) is stationed safely in house ${lord6?.house}.`,
    result: 'Destruction of opponents, invulnerability to malice, exceptional vitality, and triumphs emerging from obstacles.',
    isPresent: !!isHarsha,
    participatingPlanets: [lord6?.name || 'Mars'],
  });

  // 7b. Sarala Yoga (8th lord in 6, 8, 12)
  const isSarala = lord8 && isDusthana(lord8.house);
  yogas.push({
    name: 'Sarala Vipreet Raja Yoga',
    sanskritName: 'सरल विपरीत राजयोग',
    category: 'Raja Yoga',
    description: `8th house lord (${lord8?.name}) is placed in house ${lord8?.house}.`,
    result: 'Fearlessness, long life, sudden windfalls, scholarly occult wisdom, and prosperity through crisis navigation.',
    isPresent: !!isSarala,
    participatingPlanets: [lord8?.name || 'Saturn'],
  });

  // 7c. Vimala Yoga (12th lord in 6, 8, 12)
  const isVimala = lord12 && isDusthana(lord12.house);
  yogas.push({
    name: 'Vimala Vipreet Raja Yoga',
    sanskritName: 'विमल विपरीत राजयोग',
    category: 'Raja Yoga',
    description: `12th house lord (${lord12?.name}) is positioned in house ${lord12?.house}.`,
    result: 'Independent wealth accumulation, virtuous conduct, joy, spiritual freedom, and immunity to heavy losses.',
    isPresent: !!isVimala,
    participatingPlanets: [lord12?.name || 'Jupiter'],
  });

  // 8. Saraswati Yoga (Mercury, Jupiter, Venus in Kendras/Trikonas/2nd house)
  const saraswatiHouses = [1, 2, 4, 5, 7, 9, 10];
  const isSaraswati = saraswatiHouses.includes(mercury.house) && saraswatiHouses.includes(jupiter.house) && saraswatiHouses.includes(venus.house);
  yogas.push({
    name: 'Saraswati Yoga',
    sanskritName: 'सरस्वती योग',
    category: 'Auspicious',
    description: 'Benefics Mercury, Jupiter, and Venus are all placed in Kendra, Trikona, or 2nd houses.',
    result: 'Blessed with mastery over fine arts, literature, divine poetry, unmatched wisdom, and scholarly acclaim.',
    isPresent: isSaraswati,
    participatingPlanets: ['Mercury', 'Jupiter', 'Venus'],
  });

  // 9. Neecha Bhanga Raja Yoga (Cancellation of Debilitation)
  let neechaBhangaFound = false;
  let neechaPlanet = '';
  Object.values(planets).forEach((p) => {
    if (p.dignity === 'Debilitated') {
      const depLord = planets[getRashiLord(p.rashi)];
      if (depLord && isKendra(depLord.house)) {
        neechaBhangaFound = true;
        neechaPlanet = p.name;
      }
    }
  });

  yogas.push({
    name: 'Neecha Bhanga Raja Yoga',
    sanskritName: 'नीचभंग राजयोग',
    category: 'Raja Yoga',
    description: neechaBhangaFound
      ? `Debilitation of ${neechaPlanet} is elevated into royal strength by strong disposition lord.`
      : 'Debilitation cancellation mechanism transforming initial setbacks into immense enduring triumphs.',
    result: 'Turns humble beginnings into extraordinary sovereign success and high social station.',
    isPresent: neechaBhangaFound,
    participatingPlanets: neechaBhangaFound ? [neechaPlanet] : [],
  });

  return yogas;
}
