export interface SalaiItem {
  id: string;
  name: string;
  meeteiMayek: string;
  aliases: string[];
  deity: string;
  color: string;
  flower: string;
  element: string;
  totemAnimal: string;
  description: string;
}

export const SALAI_TARET: SalaiItem[] = [
  {
    id: 'mangang',
    name: 'Mangang (Ningthouja)',
    meeteiMayek: 'ꯃꯉꯥꯡ (ꯅꯤꯡꯊꯧꯖꯥ)',
    aliases: ['Ningthouja', 'Mangang', 'Ningthoujam'],
    deity: 'Ibudhou Pakhangba / Lainingthou Sanamahi',
    color: 'Red (ꯑꯉꯥꯡꯕ)',
    flower: 'Langthrei (ꯂꯥꯡꯊ꯭ꯔꯩ)',
    element: 'Fire (Mei)',
    totemAnimal: 'Python / Dragon (Pakhangba)',
    description: 'The royal lineage of Kangleipak, symbolizing sovereignty, courage, and radiant leadership.'
  },
  {
    id: 'luwang',
    name: 'Luwang',
    meeteiMayek: 'ꯂꯨꯋꯥꯡ',
    aliases: ['Luwang', 'Luwangshangbam'],
    deity: 'Luwang Ningthou / Luwang Pokpa',
    color: 'White (ꯑꯉꯧꯕ)',
    flower: 'Tairen (ꯇꯥꯏꯔꯦꯟ)',
    element: 'Water (Ishing)',
    totemAnimal: 'White Horse / Swan',
    description: 'The sage clan of intellect, healing, medicine, and administrative wisdom.'
  },
  {
    id: 'khuman',
    name: 'Khuman',
    meeteiMayek: 'ꯈꯨꯃꯟ',
    aliases: ['Khuman', 'Khumanthem'],
    deity: 'Khuman Pokpa / Khuman Kwakpa',
    color: 'Black / Dark (ꯑꯃꯨꯕ)',
    flower: 'Leiri (ꯂꯩꯔꯤ)',
    element: 'Earth (Leipak)',
    totemAnimal: 'Black Crow / Bull',
    description: 'The great clan of endurance, strength, agriculture, and profound spiritual power.'
  },
  {
    id: 'angom',
    name: 'Angom',
    meeteiMayek: 'ꯑꯉꯣꯝ',
    aliases: ['Angom', 'Angomjambam'],
    deity: 'Pureiromba',
    color: 'Dark Blue / Indigo (ꯍꯤꯡꯆꯥꯕ / ꯃꯆꯤ)',
    flower: 'Khongnang (ꯈꯣꯡꯅꯥꯡ)',
    element: 'Air (Nungsit)',
    totemAnimal: 'White Elephant / Boar',
    description: 'The exalted nobility clan, protectors of customs, judiciary, and sacred heritage.'
  },
  {
    id: 'moirang',
    name: 'Moirang',
    meeteiMayek: 'ꯃꯣꯏꯔꯥꯡ',
    aliases: ['Moirang', 'Moirangthem'],
    deity: 'Ibudhou Thangjing',
    color: 'Yellow / Gold (ꯉꯥꯡꯕ / ꯑꯁꯪꯕ)',
    flower: 'Heinoujom (ꯍꯩꯅꯧꯖꯣꯝ)',
    element: 'Ether / Light (Atiya)',
    totemAnimal: 'Hornbill / Tiger',
    description: 'The heroic clan of love, romance, arts, Loktak folklore, and warrior courage.'
  },
  {
    id: 'khanganba',
    name: 'Kha Nganba',
    meeteiMayek: 'ꯈꯥ ꯉꯥꯟꯕ',
    aliases: ['Kha Nganba', 'Khangembam', 'Kha-Nganba'],
    deity: 'Khana Chaoba',
    color: 'Variegated / Smoke Ash (ꯎ-ꯃꯆꯦꯠ)',
    flower: 'Tera (ꯇꯦꯔꯥ)',
    element: 'Sun Energy',
    totemAnimal: 'Hawk / Falcon',
    description: 'The ancient fierce guardians, masters of warfare, and protectors of northern boundaries.'
  },
  {
    id: 'leishangthem',
    name: 'Salai Leishangthem',
    meeteiMayek: 'ꯁꯂꯥꯏ ꯂꯩꯁꯥꯡꯊꯦꯝ',
    aliases: ['Salai Leishangthem', 'Leishangthem', 'Sarang Leishangthem'],
    deity: 'Leishangthem Pokpa',
    color: 'Multi-color / Polychrome',
    flower: 'Singgaro (ꯁꯤꯡꯒꯥꯔꯣ)',
    element: 'Soil & Flora',
    totemAnimal: 'Spotted Deer',
    description: 'The ancient agrarian masters, cultivators of abundance, medicine, and community harmony.'
  }
];

import manipurSurnamesData from '../data/manipurSurnames.json';

export interface ManipuriSurnameEntry {
  id: number;
  english: string;
  manipuri: string;
  salais: string[];
  salais_meitei: string[];
  primary_salai: string;
  primary_salai_meitei: string;
  isCustom?: boolean;
}

export const MANIPUR_SURNAMES_DB: ManipuriSurnameEntry[] = manipurSurnamesData as ManipuriSurnameEntry[];

export interface CustomSurnameEntry extends ManipuriSurnameEntry {
  isCustom?: boolean;
}

export const STORAGE_KEY_CUSTOM_SURNAMES = 'kanglei_custom_surnames';

export function getStoredCustomSurnames(): CustomSurnameEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_SURNAMES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomSurname(entry: {
  english: string;
  manipuri?: string;
  salaiId: string;
}): CustomSurnameEntry {
  const salai = SALAI_TARET.find(s => s.id === entry.salaiId) || SALAI_TARET[0];
  const newEntry: CustomSurnameEntry = {
    id: 100000 + Math.floor(Math.random() * 900000),
    english: entry.english.trim(),
    manipuri: entry.manipuri?.trim() || entry.english.trim(),
    salais: [salai.name],
    salais_meitei: [salai.meeteiMayek],
    primary_salai: salai.name,
    primary_salai_meitei: salai.meeteiMayek,
    isCustom: true,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getStoredCustomSurnames();
      const filtered = existing.filter(e => e.english.toLowerCase() !== newEntry.english.toLowerCase());
      const updated = [newEntry, ...filtered];
      localStorage.setItem(STORAGE_KEY_CUSTOM_SURNAMES, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save custom surname:', e);
    }
  }

  return newEntry;
}

export function searchManipuriSurnamesWithCustom(
  query: string,
  customList: CustomSurnameEntry[] = []
): CustomSurnameEntry[] {
  const q = (query || '').trim().toLowerCase();
  
  // Custom matches first
  const customMatches = customList.filter(item => 
    !q || item.english.toLowerCase().includes(q) || item.manipuri.includes(q)
  );

  const customNames = new Set(customMatches.map(c => c.english.toLowerCase()));

  // Matches in authentic 826 database
  const dbMatches = (!q 
    ? MANIPUR_SURNAMES_DB.slice(0, 40) 
    : MANIPUR_SURNAMES_DB.filter(item => 
        !customNames.has(item.english.toLowerCase()) &&
        (item.english.toLowerCase().includes(q) || item.manipuri.includes(q))
      )
  ).slice(0, 30);

  return [...customMatches, ...dbMatches];
}

export function searchManipuriSurnames(query: string): ManipuriSurnameEntry[] {
  if (!query || query.trim().length === 0) return MANIPUR_SURNAMES_DB.slice(0, 50);
  const q = query.trim().toLowerCase();
  return MANIPUR_SURNAMES_DB.filter(item => 
    item.english.toLowerCase().includes(q) || 
    item.manipuri.includes(q)
  ).slice(0, 30);
}

export function findSurnameExact(name: string, customList: CustomSurnameEntry[] = []): ManipuriSurnameEntry | undefined {
  if (!name) return undefined;
  const q = name.trim().toLowerCase();
  
  // Check custom list first
  const foundCustom = customList.find(item => 
    item.english.toLowerCase() === q || item.manipuri === name.trim()
  );
  if (foundCustom) return foundCustom;

  return MANIPUR_SURNAMES_DB.find(item => 
    item.english.toLowerCase() === q ||
    item.manipuri === name.trim()
  );
}

export function getSalaiIdFromName(salaiName: string): string {
  const norm = (salaiName || '').toLowerCase();
  if (norm.includes('mangang') || norm.includes('ningthouja') || norm.includes('মঙাং')) return 'mangang';
  if (norm.includes('luwang') || norm.includes('লুৱাং')) return 'luwang';
  if (norm.includes('khuman') || norm.includes('খুমন') || norm.includes('খুমান')) return 'khuman';
  if (norm.includes('angom') || norm.includes('অঙোম')) return 'angom';
  if (norm.includes('moirang') || norm.includes('মোইরাং') || norm.includes('মৈরাং')) return 'moirang';
  if (norm.includes('khanganba') || norm.includes('kha nganba') || norm.includes('খা-ঙানবা') || norm.includes('খা ঙানবা')) return 'khanganba';
  if (norm.includes('leishangthem') || norm.includes('লৈশাংথেম')) return 'leishangthem';
  return 'mangang';
}

export interface YumnakEntry {
  yumnak: string;
  salaiId: string;
  salaiName: string;
}

export const YUMNAK_DATABASE: YumnakEntry[] = MANIPUR_SURNAMES_DB.map(s => ({
  yumnak: s.english,
  salaiId: getSalaiIdFromName(s.primary_salai),
  salaiName: s.primary_salai
}));

export interface YekSalaiMatchResult {
  isCompatible: boolean;
  status: 'PERMITTED_AUSPICIOUS' | 'STRICTLY_PROHIBITED';
  title: string;
  meeteiTitle: string;
  summary: string;
  customaryVerdict: string;
  spiritualBlessing: string;
  groomSalai: SalaiItem;
  brideSalai: SalaiItem;
  sameSalai: boolean;
  details: {
    ruleCode: string;
    consequenceText: string;
    remedyText: string;
  };
}

export function evaluateYekSalai(groomSalaiId: string, brideSalaiId: string): YekSalaiMatchResult {
  const groomSalai = SALAI_TARET.find(s => s.id === groomSalaiId) || SALAI_TARET[0];
  const brideSalai = SALAI_TARET.find(s => s.id === brideSalaiId) || SALAI_TARET[1];

  const sameSalai = groomSalai.id === brideSalai.id;

  if (sameSalai) {
    return {
      isCompatible: false,
      status: 'STRICTLY_PROHIBITED',
      title: 'Prohibited Match: Same Yek Salai (Yek Thok-e / Ek Amada Lounaba Yadaba)',
      meeteiTitle: 'ꯌꯦꯛ ꯊꯣꯛꯏ • ꯁꯂꯥꯏ ꯑꯃꯗ ꯂꯧꯅꯕ ꯌꯥꯗꯕ (Strictly Prohibited)',
      summary: `Both Groom and Bride belong to ${groomSalai.name}. In Manipuri customary law, individuals of the same Salai share identical ancestral bloodline (E-Mari).`,
      customaryVerdict: 'According to Meitei customary law and Sanamahi Laining, intermarriage within the same Salai is considered incestuous (Yek Hatnaba) and brings severe ancestral lineage misfortune. Astrologers and elders forbid this union.',
      spiritualBlessing: 'Not recommended. No rituals or Pujas can sanction a same-Salai marriage in traditional Manipuri culture.',
      groomSalai,
      brideSalai,
      sameSalai: true,
      details: {
        ruleCode: 'YEK_THOKNABA',
        consequenceText: 'Believed to cause early discord, health issues in offspring, and ancestral curse (Laigi Cheirak).',
        remedyText: 'In Manipuri tradition, no remedy exists to bypass same-Salai prohibition. Marriage should not proceed.'
      }
    };
  }

  return {
    isCompatible: true,
    status: 'PERMITTED_AUSPICIOUS',
    title: 'Auspicious Match: Different Yek Salai (Yek Khek-e / Afaba)',
    meeteiTitle: 'ꯌꯦꯛ ꯈꯦꯛꯏ • ꯁꯂꯥꯏ ꯈꯦꯠꯅꯕ ꯑꯐꯕ (Permitted & Blessed)',
    summary: `Groom is from ${groomSalai.name} and Bride is from ${brideSalai.name}. The alliance unites two distinct ancestral roots without any Yek-Hatnaba fault.`,
    customaryVerdict: `Permitted and highly respected in Manipuri society. This alliance receives the divine blessings of ${groomSalai.deity} and ${brideSalai.deity}.`,
    spiritualBlessing: `Blessed by ancestral deities. Brings prosperity, harmony between two respected families, and healthy progeny.`,
    groomSalai,
    brideSalai,
    sameSalai: false,
    details: {
      ruleCode: 'YEK_KHEKNABA',
      consequenceText: 'Fosters mutual respect, strong clan friendship, and biological diversity.',
      remedyText: 'Perform traditional Luhongba ceremony with blessings from Ibudhou Sanamahi and Leimarel Shidabi.'
    }
  };
}

// -------------------------------------------------------------
// NGA-ISHING CALCULATION FROM qw.xlsm (Matching Rows 52-65)
// -------------------------------------------------------------
export interface NgaIshingResult {
  groomType: 'Nga' | 'Ishing';
  brideType: 'Nga' | 'Ishing';
  groomTypeBengali: 'ঙা' | 'ঈশিং';
  brideTypeBengali: 'ঙা' | 'ঈশিং';
  isSame: boolean;
  excelBengaliText: string;
  meeteiText: string;
  // Moon Karmastan method from qw.xlsm (sheet Match_Matching rows 54-63)
  moonKarmastanPresent?: boolean;
  moonKarmastanText?: string;
}

export function calculateNgaIshing(
  groomLagnaSignIndex: number, 
  brideLagnaSignIndex: number,
  groomMoonSignIndex: number = 0,
  brideMoonSignIndex: number = 0
): NgaIshingResult {
  // Method 2: Lagna Method (qw.xlsm sheet Match_Matching row 52 & 55)
  // Even signs: 0(Mesha), 2(Mithun), 4(Singh), 6(Tula), 8(Dhanu), 10(Kumbha) -> ঙা (Nga)
  // Odd signs: 1(Vrisha), 3(Karkat), 5(Kanya), 7(Vrishik), 9(Makar), 11(Meena) -> ঈশিং (Ishing)
  const isGroomNga = groomLagnaSignIndex % 2 === 0;
  const isBrideNga = brideLagnaSignIndex % 2 === 0;

  const groomType: 'Nga' | 'Ishing' = isGroomNga ? 'Nga' : 'Ishing';
  const brideType: 'Nga' | 'Ishing' = isBrideNga ? 'Nga' : 'Ishing';
  const groomTypeBengali: 'ঙা' | 'ঈশিং' = isGroomNga ? 'ঙা' : 'ঈশিং';
  const brideTypeBengali: 'ঙা' | 'ঈশিং' = isBrideNga ? 'ঙা' : 'ঈশিং';

  const isSame = groomType === brideType;

  // Exact Meetei font translation from qw.xlsm cell Q55:
  // "nupa nupI AnI Ais Za-%iSz ETaeo_+| nupasu Za in| nupIsu Za in|" -> "নুপা নুপী অনী অসি ঙা-ঈশিং থোংঙে। নুপাসু ঙা নি। নুপীসু ঙা নি।"
  // "nupa nupI AnI Ais Za-%iSz ETaek}| nupana Za in| nupIna %iSz in|" -> "নুপা নুপী অনী অসি ঙা-ঈশিং থোকই। নুপানা ঙা নি। নুপীনা ঈশিং নি।"
  let excelBengaliText = '';
  if (isSame) {
    excelBengaliText = `নুপা নুপী অনী অসি ঙা-ঈশিং থোংঙে। নুপাসু ${groomTypeBengali} নি। নুপীসু ${brideTypeBengali} নি।`;
  } else {
    excelBengaliText = `নুপা নুপী অনী অসি ঙা-ঈশিং থোকই। নুপানা ${groomTypeBengali} নি। নুপীনা ${brideTypeBengali} নি।`;
  }

  const meeteiText = isSame 
    ? `ꯅꯨꯄꯥ ꯅꯨꯄꯤ ꯑꯅꯤ ꯑꯁꯤ ꯉꯥ-ꯏꯁꯤꯡ ꯊꯣꯡꯉꯦ| ꯅꯨꯄꯥꯁꯨ ${isGroomNga ? 'ꯉꯥ' : 'ꯏꯁꯤꯡ'} ꯅꯤ| ꯅꯨꯄꯤꯁꯨ ${isBrideNga ? 'ꯉꯥ' : 'ꯏꯁꯤꯡ'} ꯅꯤ|`
    : `ꯅꯨꯄꯥ ꯅꯨꯄꯤ ꯑꯅꯤ ꯑꯁꯤ ꯉꯥ-ꯏꯁꯤꯡ ꯊꯣꯛꯏ| ꯅꯨꯄꯥꯅ ${isGroomNga ? 'ꯉꯥ' : 'ꯏꯁꯤꯡ'} ꯅꯤ| ꯅꯨꯄꯤꯅ ${isBrideNga ? 'ꯉꯥ' : 'ꯏꯁআইꯡ'} ꯅꯤ|`.replace('ꯏꯁআইꯡ', 'ꯏꯁꯤꯡ');

  // Method 1: Moon Karmastan Method (qw.xlsm rows 54-63: Karmastan = 10th from Moon, +9 signs)
  const groomKarmastan = (groomMoonSignIndex + 9) % 12;
  const brideKarmastan = (brideMoonSignIndex + 9) % 12;
  let moonKarmastanPresent = false;
  let moonKarmastanText = 'ঙা-ঈশিং তাদে।';

  if (groomKarmastan === brideMoonSignIndex) {
    moonKarmastanPresent = true;
    moonKarmastanText = 'ঙা-ঈশিং তারে। নুপানা ঙা তারে, নুপীনা ঈশিং তারে।';
  } else if (brideKarmastan === groomMoonSignIndex) {
    moonKarmastanPresent = true;
    moonKarmastanText = 'ঙা-ঈশিং তারে। নুপীনা ঙা তারে, নুপানা ঈশিং তারে।';
  }

  return {
    groomType,
    brideType,
    groomTypeBengali,
    brideTypeBengali,
    isSame,
    excelBengaliText,
    meeteiText,
    moonKarmastanPresent,
    moonKarmastanText
  };
}

// -------------------------------------------------------------
// MANGLIK DOSHA & CANCELLATION EVALUATOR (qw.xlsm Rows 22, 25, 47, 50, 33)
// -------------------------------------------------------------
export interface ManglikEvaluation {
  groomManglik: boolean;
  brideManglik: boolean;
  groomMarsHouseFromLagna: number;
  groomMarsHouseFromMoon: number;
  groomLagnaDosha: boolean;
  groomMoonDosha: boolean;
  brideMarsHouseFromLagna: number;
  brideMarsHouseFromMoon: number;
  brideLagnaDosha: boolean;
  brideMoonDosha: boolean;
  groomLagnaText: string;
  groomMoonText: string;
  brideLagnaText: string;
  brideMoonText: string;
  isMutualCancellation: boolean;
  verdictText: string;
  meeteiVerdictText: string;
  excelBengaliSummary: string;
}

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export function toBengaliNumber(n: number): string {
  return n.toString().split('').map(d => BENGALI_DIGITS[parseInt(d)] || d).join('');
}

export function evaluateManglikFromPositions(
  groomMarsDegree: number,
  groomLagnaDegree: number,
  groomMoonDegree: number,
  brideMarsDegree: number,
  brideLagnaDegree: number,
  brideMoonDegree: number
): ManglikEvaluation {
  const getHouseDiff = (planetDeg: number, refDeg: number) => {
    const planetSign = Math.floor(planetDeg / 30) % 12;
    const refSign = Math.floor(refDeg / 30) % 12;
    return ((planetSign - refSign + 12) % 12) + 1;
  };

  // qw.xlsm sheet Match_Matching cell R16 & W16:
  // "If Mars is placed in 1st, 4th, 7th, 8th or 12th house in the Birth Chart then Manglik Dosha is present in the Horoscope."
  const MANGLIK_HOUSES = [1, 4, 7, 8, 12];

  const gLagnaHouse = getHouseDiff(groomMarsDegree, groomLagnaDegree);
  const gMoonHouse = getHouseDiff(groomMarsDegree, groomMoonDegree);
  const groomLagnaDosha = MANGLIK_HOUSES.includes(gLagnaHouse);
  const groomMoonDosha = MANGLIK_HOUSES.includes(gMoonHouse);
  const groomManglik = groomLagnaDosha || groomMoonDosha;

  const bLagnaHouse = getHouseDiff(brideMarsDegree, brideLagnaDegree);
  const bMoonHouse = getHouseDiff(brideMarsDegree, brideMoonDegree);
  const brideLagnaDosha = MANGLIK_HOUSES.includes(bLagnaHouse);
  const brideMoonDosha = MANGLIK_HOUSES.includes(bMoonHouse);
  const brideManglik = brideLagnaDosha || brideMoonDosha;

  const isMutualCancellation = groomManglik && brideManglik;

  const groomLagnaText = `রাশি চক্রদা মঙ্গল অসি লগ্নগী ${toBengaliNumber(gLagnaHouse)} শুবা য়ুমদা লৈরে।\nমরম অসিনা লগ্নদগী য়েংবদা মঙ্গল দোষ ${groomLagnaDosha ? 'লৈরে।' : 'লৈতে।'}`;
  const groomMoonText = `রাশি চক্রদা মঙ্গল অসি থাগী ${toBengaliNumber(gMoonHouse)} শুবা য়ুমদা লৈরে।\nমরম অসিনা থাদগী য়েংবদা মঙ্গল দোষ ${groomMoonDosha ? 'লৈরে।' : 'লৈতে।'}`;

  const brideLagnaText = `রাশি চক্রদা মঙ্গল অসি লগ্নগী ${toBengaliNumber(bLagnaHouse)} শুবা য়ুমদা লৈরে।\nমরম অসিনা লগ্নদগী য়েংবদা মঙ্গল দোষ ${brideLagnaDosha ? 'লৈরে।' : 'লৈতে।'}`;
  const brideMoonText = `রাশি চক্রদা মঙ্গল অসি থাগী ${toBengaliNumber(bMoonHouse)} শুবা য়ুমদা লৈরে।\nমরম অসিনা থাদগী য়েংবদা মঙ্গল দোষ ${brideMoonDosha ? 'লৈরে।' : 'লৈতে।'}`;

  let excelBengaliSummary = '';
  if (groomManglik !== brideManglik) {
    excelBengaliSummary = 'কুঠি অনীদা মঙ্গল দোষ লৈবা য়াওবনা অনীগী পক্নবা অমসুং ফবা ৱাংলি।';
  } else if (!groomManglik && !brideManglik) {
    excelBengaliSummary = 'কুঠি অনীদা মঙ্গল দোষ লৈবা য়াওদবনা অনী অসি পক্নবা অমসুং অফবা ওইরে।';
  } else {
    excelBengaliSummary = 'অনীমক মঙ্গল দোষ লৈরবনা কত্থোকনরিদুন পক্নবা অমসুং অফবা ওইরে।';
  }

  let verdictText = '';
  let meeteiVerdictText = '';

  if (!groomManglik && !brideManglik) {
    verdictText = 'No Manglik Dosha present in either horoscope. Safe and auspicious.';
    meeteiVerdictText = 'ꯅꯨꯄꯥ ꯑꯃꯁꯨꯡ ꯅꯨꯄꯤ ꯑꯅꯤꯃꯛꯇ ꯃꯣꯡꯒꯣꯜ ꯗꯣꯁ (Manglik) ꯂꯩꯇꯦ| (ꯆꯥꯟꯅꯩ)';
  } else if (isMutualCancellation) {
    verdictText = 'Manglik Dosha cancels out mutually. Hence this match is harmonious.';
    meeteiVerdictText = 'ꯅꯨꯄꯥ ꯑꯃꯁꯨꯡ ꯅꯨꯄꯤ ꯑꯅꯤꯃꯛ ꯃꯣꯡꯒꯣꯜ ꯑꯣꯏꯕꯅ ꯃꯣꯡꯒꯣꯜ ꯗꯣꯁ ꯊꯨꯒꯥꯏꯅꯔꯦ| (ꯆꯥꯟꯅꯔꯦ)';
  } else if (groomManglik && !brideManglik) {
    verdictText = 'Groom is Manglik while Bride is Non-Manglik. Remedy recommended.';
    meeteiVerdictText = 'ꯅꯨꯄꯥꯗ ꯃꯣꯡꯒꯣꯜ ꯂꯩ, ꯅꯨꯄꯤꯗ ꯂꯩꯇꯦ| ꯄꯨꯖꯥ ꯇꯧꯕ ꯆꯪꯏ|';
  } else {
    verdictText = 'Bride is Manglik while Groom is Non-Manglik. Astrological remedies advised.';
    meeteiVerdictText = 'ꯅꯨꯄꯤꯗ ꯃꯣꯡꯒꯣꯜ ꯂꯩ, ꯅꯨꯄꯥꯗ ꯂꯩꯇꯦ| ꯄꯨꯖꯥ ꯇꯧꯕ ꯆꯪꯏ|';
  }

  return {
    groomManglik,
    brideManglik,
    groomMarsHouseFromLagna: gLagnaHouse,
    groomMarsHouseFromMoon: gMoonHouse,
    groomLagnaDosha,
    groomMoonDosha,
    brideMarsHouseFromLagna: bLagnaHouse,
    brideMarsHouseFromMoon: bMoonHouse,
    brideLagnaDosha,
    brideMoonDosha,
    groomLagnaText,
    groomMoonText,
    brideLagnaText,
    brideMoonText,
    isMutualCancellation,
    verdictText,
    meeteiVerdictText,
    excelBengaliSummary
  };
}

export function getAshtakootPhalText(score: number): string {
  if (score < 18) {
    return 'অষ্টকূটকী চাং নেম্বনা নুপা নুপী অনীগী পক্নবা খরা ৱাংলি।';
  }
  return 'অষ্টকূটকী চাং ৱাংবনা নুপা নুপী অনী অসি য়াম্না পক্ন অমসুং পুন্সি লেল্পুন তাহী।';
}

// -------------------------------------------------------------
// DETAILED ASHTAKOOTA 8-KOOT CALCULATOR (qw.xlsm Sheet 60)
// -------------------------------------------------------------
export interface AshtakootRow {
  numLabel: string;
  name: string;
  groomVal: string;
  brideVal: string;
  maxPoint: number;
  pointsObtained: number;
}

export interface DetailedAshtakootResult {
  rows: AshtakootRow[];
  totalObtained: number;
  maxPoints: number;
  percentageString: string;
  isCompatible: boolean;
}

export const BENGALI_RASHI_NAMES = [
  'মেষ', 'বৃষ', 'মিথুন', 'কর্কট',
  'সিংহ', 'কন্যা', 'তুলা', 'বৃশ্চিক',
  'ধনু', 'মকর', 'কুম্ভ', 'মীন'
];

export const BENGALI_NAKSHATRAS = [
  'অশ্বিনী', 'ভরণী', 'কৃত্তিকা', 'রোহিণী', 'মৃগশিরা', 'আর্দ্রা',
  'পুনর্বসু', 'পুষ্যা', 'আশ্লেষা', 'মঘা', 'পূর্বফাল্গুনী', 'উত্তরফাল্গুনী',
  'হস্তা', 'চিত্রা', 'স্বাতী', 'বিশাখা', 'অনুরাধা', 'জ্যেষ্ঠা',
  'মূলা', 'পূর্বাষাঢ়া', 'উত্তরাষাঢ়া', 'শ্রবণা', 'ধনিষ্ঠা', 'শতভিষা',
  'পূর্বভাদ্রপদ', 'উত্তরভাদ্রপদ', 'রেবতী'
];

export const BENGALI_RASHI_LORDS = [
  'মঙ্গল', 'শুক্র', 'বুধ', 'চন্দ্র', 'সূর্য', 'বুধ',
  'শুক্র', 'মঙ্গল', 'গুরু', 'শনি', 'শনি', 'গুরু'
];

export const BENGALI_GANAS = ['দেব', 'নর', 'রাক্ষস'];
export const BENGALI_NADIS = ['আদি', 'মধ্য', 'অন্ত্য'];
export const BENGALI_VARNAS = ['বিপ্র', 'ক্ষত্রিয়', 'বৈশ্য', 'শূদ্র'];

// Signs: 0=Mesha, 1=Vrisha, 2=Mithun, 3=Karkat, 4=Singh, 5=Kanya, 6=Tula, 7=Vrishik, 8=Dhanu, 9=Makar, 10=Kumbha, 11=Meena
// Vashya mapping
export const SIGN_VASHYA_BENGALI = [
  'চতুষ্পদ', // Mesha
  'চতুষ্পদ', // Vrisha
  'দ্বিপদ',   // Mithuna
  'জলচর',   // Karkat
  'সিংহ',    // Simha
  'দ্বিপদ',   // Kanya
  'দ্বিপদ',   // Tula
  'কীট',     // Vrishik
  'চতুষ্পদ', // Dhanu
  'জলচর',   // Makar
  'দ্বিপদ',   // Kumbha
  'জলচর'    // Meena
];

// Yoni animals in Bengali/Meitei
export const NAKSHATRA_YONI_BENGALI = [
  'অশ্ব লাবা', 'শামু লাবা', 'হামেং লাবা', 'লীন লাবা', 'লীন অমোম', 'হুই লাবা',
  'হৌদোং লাবা', 'হামেং লাবা', 'হৌদোং অমোম', 'উচিক লাবা', 'উচিক অমোম', 'শণ লাবা',
  'ইরোই লাবা', 'কেই লাবা', 'ইরোই অমোম', 'কেই অমোম', 'সাজীক লাবা', 'সাজীক অমোম',
  'হুই অমোম', 'য়োং লাবা', 'ইথেন লাবা', 'য়োং অমোম', 'নোংশা লাবা', 'অশ্ব অমোম',
  'নোংশা অমোম', 'শণ অমোম', 'শামু অমোম'
];

export function calculateDetailedAshtakoot(groomMoonLon: number, brideMoonLon: number): DetailedAshtakootResult {
  const gSign = Math.floor(groomMoonLon / 30) % 12;
  const bSign = Math.floor(brideMoonLon / 30) % 12;

  const gNakIndex = Math.floor(groomMoonLon / (360 / 27)) % 27;
  const bNakIndex = Math.floor(brideMoonLon / (360 / 27)) % 27;

  // 1. Varna (1 Pt)
  // Brahmin(Water: Cancer=3, Scorpio=7, Pisces=11) -> 0
  // Kshatriya(Fire: Aries=0, Leo=4, Dhanu=8) -> 1
  // Vaishya(Earth: Taurus=1, Virgo=5, Makar=9) -> 2
  // Shudra(Air: Mithun=2, Tula=6, Kumbha=10) -> 3
  const SIGN_VARNA_ORDER = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0];
  const gVarnaIdx = SIGN_VARNA_ORDER[gSign];
  const bVarnaIdx = SIGN_VARNA_ORDER[bSign];
  const varnaPts = gVarnaIdx <= bVarnaIdx ? 1 : 0;

  // 2. Vashya (2 Pts)
  let vashyaPts = 1;
  if (gSign === bSign) {
    vashyaPts = 2;
  } else if (Math.abs(gSign - bSign) === 6) {
    vashyaPts = 0;
  }

  // 3. Tara (3 Pts)
  const gTaraDiff = ((bNakIndex - gNakIndex + 27) % 9) + 1;
  const bTaraDiff = ((gNakIndex - bNakIndex + 27) % 9) + 1;
  const auspiciousTaras = [2, 4, 6, 8, 9];
  let taraPts = 0;
  if (auspiciousTaras.includes(gTaraDiff)) taraPts += 1.5;
  if (auspiciousTaras.includes(bTaraDiff)) taraPts += 1.5;

  // 4. Yoni (4 Pts)
  const NAK_YONI_BASE = [
    0, 1, 2, 3, 3, 4, 5, 2, 5,
    6, 6, 7, 8, 9, 8, 9, 10, 10,
    4, 11, 12, 11, 13, 0, 13, 7, 1
  ];
  const gYoni = NAK_YONI_BASE[gNakIndex];
  const bYoni = NAK_YONI_BASE[bNakIndex];
  let yoniPts = 2;
  if (gYoni === bYoni) {
    yoniPts = 4;
  } else if (Math.abs(gYoni - bYoni) === 1) {
    yoniPts = 3;
  } else if (Math.abs(gYoni - bYoni) > 6) {
    yoniPts = 1;
  }

  // 5. Graha Maitri (5 Pts)
  const gLord = BENGALI_RASHI_LORDS[gSign];
  const bLord = BENGALI_RASHI_LORDS[bSign];
  let grahaPts = 3;
  if (gLord === bLord) {
    grahaPts = 5;
  } else if (
    (gLord === 'সূর্য' && bLord === 'গুরু') || (gLord === 'গুরু' && bLord === 'সূর্য') ||
    (gLord === 'চন্দ্র' && bLord === 'বুধ') || (gLord === 'মঙ্গল' && bLord === 'গুরু') ||
    (gLord === 'গুরু' && bLord === 'মঙ্গল')
  ) {
    grahaPts = 5;
  } else if (
    (gLord === 'সূর্য' && bLord === 'শনি') || (gLord === 'শনি' && bLord === 'সূর্য') ||
    (gLord === 'মঙ্গল' && bLord === 'বুধ') || (gLord === 'বুধ' && bLord === 'মঙ্গল')
  ) {
    grahaPts = 0.5;
  }

  // 6. Gana (6 Pts)
  const NAK_GANA_BASE = [
    0, 1, 2, 1, 0, 1, 0, 0, 2,
    2, 1, 1, 0, 2, 0, 2, 0, 2,
    2, 1, 1, 0, 2, 2, 1, 1, 0
  ];
  const gGana = NAK_GANA_BASE[gNakIndex];
  const bGana = NAK_GANA_BASE[bNakIndex];
  let ganaPts = 0;
  if (gGana === bGana) {
    ganaPts = 6;
  } else if ((gGana === 0 && bGana === 1) || (gGana === 1 && bGana === 0)) {
    ganaPts = 5;
  } else if ((gGana === 0 && bGana === 2) || (gGana === 2 && bGana === 0)) {
    ganaPts = 1;
  }

  // 7. Rashi / Bhakoot (7 Pts)
  const signDiff = (Math.abs(gSign - bSign) + 12) % 12;
  let bhakootPts = 7;
  if (signDiff === 2 || signDiff === 10 || signDiff === 5 || signDiff === 7 || signDiff === 6) {
    bhakootPts = 0;
  }

  // 8. Nadi (8 Pts)
  const NAK_NADI_BASE = [
    0, 1, 2, 2, 1, 0, 0, 1, 2,
    0, 1, 2, 2, 1, 0, 0, 1, 2,
    0, 1, 2, 2, 1, 0, 0, 1, 2
  ];
  const gNadi = NAK_NADI_BASE[gNakIndex];
  const bNadi = NAK_NADI_BASE[bNakIndex];
  let nadiPts = 8;
  if (gNadi === bNadi) {
    nadiPts = 0;
  }

  const rows: AshtakootRow[] = [
    {
      numLabel: '১। বর্ণ',
      name: 'Varna',
      groomVal: BENGALI_VARNAS[gVarnaIdx] || 'বৈশ্য',
      brideVal: BENGALI_VARNAS[bVarnaIdx] || 'বিপ্র',
      maxPoint: 1,
      pointsObtained: varnaPts
    },
    {
      numLabel: '২। বৈশ্য',
      name: 'Vashya',
      groomVal: SIGN_VASHYA_BENGALI[gSign] || 'চতুষ্পদ',
      brideVal: SIGN_VASHYA_BENGALI[bSign] || 'জলচর',
      maxPoint: 2,
      pointsObtained: vashyaPts
    },
    {
      numLabel: '৩। তারা',
      name: 'Tara',
      groomVal: BENGALI_NAKSHATRAS[gNakIndex] || 'ভরণী',
      brideVal: BENGALI_NAKSHATRAS[bNakIndex] || 'উত্তরভাদ্রপদ',
      maxPoint: 3,
      pointsObtained: Math.round(taraPts)
    },
    {
      numLabel: '৪। য়োনি',
      name: 'Yoni',
      groomVal: NAKSHATRA_YONI_BENGALI[gNakIndex] || 'শামু লাবা',
      brideVal: NAKSHATRA_YONI_BENGALI[bNakIndex] || 'শণ অমোম',
      maxPoint: 4,
      pointsObtained: yoniPts
    },
    {
      numLabel: '৫। গ্রহ মপু',
      name: 'Graha Maitri',
      groomVal: gLord,
      brideVal: bLord,
      maxPoint: 5,
      pointsObtained: Math.round(grahaPts)
    },
    {
      numLabel: '৬। গণ',
      name: 'Gana',
      groomVal: BENGALI_GANAS[gGana] || 'নর',
      brideVal: BENGALI_GANAS[bGana] || 'নর',
      maxPoint: 6,
      pointsObtained: ganaPts
    },
    {
      numLabel: '৭। রাশি',
      name: 'Rashi',
      groomVal: BENGALI_RASHI_NAMES[gSign] || 'মেষ',
      brideVal: BENGALI_RASHI_NAMES[bSign] || 'মীন',
      maxPoint: 7,
      pointsObtained: bhakootPts
    },
    {
      numLabel: '৮। নাড়ী',
      name: 'Nadi',
      groomVal: BENGALI_NADIS[gNadi] || 'মধ্য',
      brideVal: BENGALI_NADIS[bNadi] || 'মধ্য',
      maxPoint: 8,
      pointsObtained: nadiPts
    }
  ];

  const totalObtained = rows.reduce((acc, r) => acc + r.pointsObtained, 0);
  const percentageString = ((totalObtained * 100) / 36).toFixed(2) + ' %';

  return {
    rows,
    totalObtained,
    maxPoints: 36,
    percentageString,
    isCompatible: totalObtained >= 18
  };
}
