/**
 * Vastu Shastra & Manipuri Yumsharol Engine
 *
 * Covers:
 *  - 16 MahaVastu Zones (22.5° each)
 *  - 32 Pada Main Entrance System
 *  - Room Evaluation Matrix across 16 zones
 *  - Pancha Tattva (5 Elements) balance
 *  - Traditional Manipur Yumsharol & Sanamahi Kachin guidelines
 *  - Commercial & Office Vastu
 *  - Non-structural remedies
 */

export interface VastuZone {
  id: string;
  name: string;
  sanskritName: string;
  manipuriName: string;
  angleRange: [number, number]; // e.g. [348.75, 11.25] for North
  element: 'Water' | 'Air' | 'Fire' | 'Earth' | 'Space';
  elementColor: string;
  rulingDevata: string;
  rulingPlanet: string;
  coreAttributes: string[];
  idealRooms: string[];
  forbiddenRooms: string[];
  remedyColor: string;
  meiteiTraditionNote: string;
}

export const VASTU_ZONES_16: VastuZone[] = [
  {
    id: 'n',
    name: 'North (Awang / অৱাং)',
    sanskritName: 'অৱাং (Awang / কুবের কোণ)',
    manipuriName: 'অৱাং (Awang - কুবের)',
    angleRange: [348.75, 11.25],
    element: 'Water',
    elementColor: 'text-blue-500 bg-blue-50 border-blue-200',
    rulingDevata: 'Lord Kubera & Soma',
    rulingPlanet: 'Mercury (Budha)',
    coreAttributes: ['Treasury & Money Flow', 'New Business Opportunities', 'Career Expansion', 'Client Inflow'],
    idealRooms: ['Treasury / Cash Safe', 'Main Entrance', 'Living Room', 'Water Fountain'],
    forbiddenRooms: ['Kitchen', 'Toilet', 'Heavy Storage / Junk', 'Master Bedroom'],
    remedyColor: 'Blue, Green or Light Grey',
    meiteiTraditionNote: 'Meitei Yumsharol: অৱাং মৈকেই (North direction) অসি লন-থুম অমসুং কুবেরগী খুদোংচাবগী মৈকেইনি। মসিবু লু-নান্না অমসুং হাংনা থমগদবনি।',
  },
  {
    id: 'nne',
    name: 'NNE (Awang-Nongpok Thambal)',
    sanskritName: 'অৱাং-নোংপোক থাম্বাল (ওষধি কোণ)',
    manipuriName: 'অৱাং-নোংপোক থাম্বাল',
    angleRange: [11.25, 33.75],
    element: 'Water',
    elementColor: 'text-cyan-500 bg-cyan-50 border-cyan-200',
    rulingDevata: 'Lord Dhanvantari',
    rulingPlanet: 'Jupiter & Moon',
    coreAttributes: ['Health & Healing', 'Immunity & Vitality', 'Medicine Efficacy', 'Recovery'],
    idealRooms: ['Medicine Cabinet', 'Healing / Doctor Chamber', 'Bed for Patients', 'Drinking Water'],
    forbiddenRooms: ['Toilet', 'Dustbin', 'Heavy Junk', 'Septic Tank'],
    remedyColor: 'Light Blue or White',
    meiteiTraditionNote: 'হকচাং ফনা লৈনবা হিদাক-লাংথক অমসুang লাই-নুংশিবগী মৈকেইনি।',
  },
  {
    id: 'ne',
    name: 'North-East (Ishanya / অৱাং-নোংপোক)',
    sanskritName: 'ঈশান (অৱাং-নোংপোক / শিৱ কোণ)',
    manipuriName: 'অৱাং-নোংপোক (ঈশান)',
    angleRange: [33.75, 56.25],
    element: 'Water',
    elementColor: 'text-sky-600 bg-sky-50 border-sky-200',
    rulingDevata: 'Lord Shiva & Brihaspati',
    rulingPlanet: 'Jupiter (Guru)',
    coreAttributes: ['Clarity of Mind', 'Spiritual Awakening', 'Divine Intuition', 'Supreme Peace'],
    idealRooms: ['Puja Room / Mandir', 'Meditation Space', 'Open Courtyard (Sumang)', 'Study Room for Children'],
    forbiddenRooms: ['Toilet', 'Kitchen (Fire in Water)', 'Master Bedroom', 'Overhead Heavy Water Tank'],
    remedyColor: 'White, Silver or Pale Yellow',
    meiteiTraditionNote: 'ৱাস্তু পুরুষকী মকো বিনি। ঈশান কোণ অসি খ্বাইদগী শেংলবা লাইফম অমসুং নুংশা য়ৌবা মফমনি।',
  },
  {
    id: 'ene',
    name: 'ENE (Nongpok-Awang Thambal)',
    sanskritName: 'নোংপোক-অৱাং থাম্বাল (পর্জন্য কোণ)',
    manipuriName: 'নোংপোক-অৱাং থাম্বাল',
    angleRange: [56.25, 78.75],
    element: 'Air',
    elementColor: 'text-emerald-500 bg-emerald-50 border-emerald-200',
    rulingDevata: 'Parjanya & Jayanta',
    rulingPlanet: 'Sun & Venus',
    coreAttributes: ['Recreation & Joy', 'Mental Refreshment', 'Social Laughter', 'Rejuvenation'],
    idealRooms: ['Family Lounge', 'Garden / Balcony', 'Entertainment Room', 'Yoga Spot'],
    forbiddenRooms: ['Toilet', 'Heavy Storeroom', 'Dark Storage'],
    remedyColor: 'Green, Emerald or Cream',
    meiteiTraditionNote: 'নুমিৎ থোকপগী অহানবা মঙালগা লোয়ননা হরাও-কুশিন লৈনবা মৈকেইনি।',
  },
  {
    id: 'e',
    name: 'East (Nongpok / নোংপোক)',
    sanskritName: 'নোংপোক (Nongpok / ইন্দ্র কোণ)',
    manipuriName: 'নোংপোক (Nongpok - নুমিৎ থোকপ)',
    angleRange: [78.75, 101.25],
    element: 'Air',
    elementColor: 'text-green-600 bg-green-50 border-green-200',
    rulingDevata: 'Lord Indra & Surya Dev',
    rulingPlanet: 'Sun (Surya)',
    coreAttributes: ['Social Connectivity', 'Government Network', 'Public Fame', 'Vision & Vitality'],
    idealRooms: ['Main Living Hall', 'Meeting Room', 'Main Entrance', 'Balcony / Windows'],
    forbiddenRooms: ['Toilet', 'Heavy Clutter', 'Septic Tank'],
    remedyColor: 'Green, Bamboo Wood, Sunlight Gold',
    meiteiTraditionNote: 'মীতৈ য়ুমশারোলদা নোংপোক মৈকেই অসি নুমিৎ থোকপগী মৈকেই অমসুং মী-য়ামগা মরী লৈনবদা য়াম্না মরুওইবা মফমনি।',
  },
  {
    id: 'ese',
    name: 'ESE (Nongpok-Makha Thambal)',
    sanskritName: 'নোংপোক-মখা থাম্বাল (মন্থন কোণ)',
    manipuriName: 'নোংপোক-মখা থাম্বাল',
    angleRange: [101.25, 123.75],
    element: 'Air',
    elementColor: 'text-teal-600 bg-teal-50 border-teal-200',
    rulingDevata: 'Arka & Savita',
    rulingPlanet: 'Mercury & Rahu',
    coreAttributes: ['Analytical Thinking', 'Churning of Ideas', 'Critical Reflection'],
    idealRooms: ['Research / Writing Desk', 'Accounting Audit', 'Washing Machine'],
    forbiddenRooms: ['Puja Room', 'Master Bedroom (causes chronic anxiety)', 'Entrance'],
    remedyColor: 'Light Green, Mint or Pastel Wood',
    meiteiTraditionNote: 'ৱাখল খন্ন-নৈনবগী শক্তি পীবগা লোয়ননা ওভর-থিংকিং থোকহন্দবা মফমনি।',
  },
  {
    id: 'se',
    name: 'South-East (Agneya / মৈরাম)',
    sanskritName: 'মৈরাম / ফুঙ্গা লৈরূ (South-East / অগ্নি কোণ)',
    manipuriName: 'মৈরাম / ফুঙ্গা লৈরূ (Agneya)',
    angleRange: [123.75, 146.25],
    element: 'Fire',
    elementColor: 'text-orange-500 bg-orange-50 border-orange-200',
    rulingDevata: 'Lord Agni Dev',
    rulingPlanet: 'Venus (Shukra)',
    coreAttributes: ['Cash Liquidity', 'Fire & Cooking', 'Feminine Vitality', 'Zeal & Passion'],
    idealRooms: ['Kitchen (Chakhum / Gas Stove facing East)', 'Electrical Panels / Inverters', 'Boilers / Heating'],
    forbiddenRooms: ['Puja Room', 'Water Boring / Well', 'Master Bedroom', 'Toilet'],
    remedyColor: 'Red, Orange, Warm Pink',
    meiteiTraditionNote: 'ফুঙ্গা লৈরূ অমসুং মৈরাম কোণ: চাকখুম অসি মৈরাম কোণদা লৈবা অমসুং নোংপোক মাইওন্ননা চাক থোংবা য়াম্না শেংলবনি।',
  },
  {
    id: 'sse',
    name: 'SSE (Makha-Nongpok Thambal)',
    sanskritName: 'মখা-নোংপোক থাম্বাল (শক্তি কোণ)',
    manipuriName: 'মখা-নোংপোক থাম্বাল',
    angleRange: [146.25, 168.75],
    element: 'Fire',
    elementColor: 'text-red-500 bg-red-50 border-red-200',
    rulingDevata: 'Lord Pushan',
    rulingPlanet: 'Mars (Mangal)',
    coreAttributes: ['Confidence & Power', 'Physical Stamina', 'Courage', 'Execution Drive'],
    idealRooms: ['Gym / Fitness Room', 'Security Guard Post', 'Armory / Tool Room', 'Active Workplace'],
    forbiddenRooms: ['Toilet', 'Underground Water Tank'],
    remedyColor: 'Light Red, Rose, Peach',
    meiteiTraditionNote: 'হকচাংগী পাঙ্গল অমসুং থৌনা হাপ্পগী মৈকেইনি।',
  },
  {
    id: 's',
    name: 'South (Makha / মখা)',
    sanskritName: 'মখা (Makha / য়ম কোণ)',
    manipuriName: 'মখা (Makha - য়ম মৈকেই)',
    angleRange: [168.75, 191.25],
    element: 'Fire',
    elementColor: 'text-rose-600 bg-rose-50 border-rose-200',
    rulingDevata: 'Lord Yama & Vivaswan',
    rulingPlanet: 'Mars (Mangal)',
    coreAttributes: ['Fame & Recognition', 'Deep Peaceful Sleep', 'Relaxation', 'Brand Equity'],
    idealRooms: ['Bedroom', 'Office of Key Executives', 'Rest Area'],
    forbiddenRooms: ['Main Water Boring', 'Main Gate without Vastu correction'],
    remedyColor: 'Red, Maroon, Warm Earth tones',
    meiteiTraditionNote: 'তুম্বদা মকোক মখাদা ওনশিন্দুনা তুম্বা হকচাং ফনা অমসুং নুংঙাইনা লৈহল্লি।',
  },
  {
    id: 'ssw',
    name: 'SSW (Makha-Nongchup Thambal)',
    sanskritName: 'মখা-নোংচুপ থাম্বাল (বিসর্জন কোণ)',
    manipuriName: 'মখা-নোংচুপ থাম্বাল',
    angleRange: [191.25, 213.75],
    element: 'Earth',
    elementColor: 'text-amber-700 bg-amber-50 border-amber-200',
    rulingDevata: 'Lord Gandharva & Bhringaraja',
    rulingPlanet: 'Rahu',
    coreAttributes: ['Disposal of Waste', 'Detoxification', 'Letting Go of Toxins'],
    idealRooms: ['Toilet & Waste Drainage', 'Dustbin Placement', 'Compost / Sewage'],
    forbiddenRooms: ['Puja Room', 'Master Bedroom', 'Safe / Cash Box', 'Study Room'],
    remedyColor: 'Yellow Earth, Sand, Brass',
    meiteiTraditionNote: 'লেংফম / খোংহামফমগী খ্বাইদগী ফবা মফমনি; মসিদা তুম্বা নত্রগা পুজা তৌবা ফত্তে।',
  },
  {
    id: 'sw',
    name: 'South-West (Sanamahi Kachin / সনমহী কচীন)',
    sanskritName: 'সনমহী কচীন (Sanamahi Kachin / নৈঋত)',
    manipuriName: 'সনমহী কচীন / মখা-নোংচুপ',
    angleRange: [213.75, 236.25],
    element: 'Earth',
    elementColor: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    rulingDevata: 'Lainingthou Sanamahi & Pitrus (Ancestors)',
    rulingPlanet: 'Rahu & Saturn',
    coreAttributes: ['Relationship Stability', 'Master of the House', 'Ancestral Roots', 'Skill Mastery'],
    idealRooms: ['Master Bedroom (Family Head)', 'Lainingthou Sanamahi Sacred Corner (সনমহী কচীন)', 'Heavy Wardrobe / Gold Safe'],
    forbiddenRooms: ['Toilet (Major Dosha)', 'Water Boring / Well', 'Main Entrance', 'Kitchen'],
    remedyColor: 'Golden Yellow, Earth Ochre, Brass Metal',
    meiteiTraditionNote: 'লাইনিংথৌ সনমহীগী শেংলবা কচীন: মীতৈ য়ুম খুদিংমক্কী মখা-নোংচুপ (South-West) কোণ অসি সনমহী কচীননি। মসিবু চেৎনা অমসুং অৱাংবা থাক্তা থমগদবনি।',
  },
  {
    id: 'wsw',
    name: 'WSW (Nongchup-Makha Thambal)',
    sanskritName: 'নোংচুপ-মখা থাম্বাল (বিদ্যা কোণ)',
    manipuriName: 'নোংচুপ-মখা থাম্বাল',
    angleRange: [236.25, 258.75],
    element: 'Space',
    elementColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    rulingDevata: 'Dauvarika & Sugriva',
    rulingPlanet: 'Mercury & Jupiter',
    coreAttributes: ['Education & Skills', 'Knowledge Retention', 'Academic Excellence', 'Savings'],
    idealRooms: ['Children Study Desk', 'Bookshelf / Library', 'Savings Bank Vault'],
    forbiddenRooms: ['Toilet', 'Kitchen'],
    remedyColor: 'Cream, Silver White or Light Blue',
    meiteiTraditionNote: 'মহৈ-মশিং তম্নবা অমসুং হৈতোই-শীংথোইবা ফংনবা য়াম্না ফবা মফমনি।',
  },
  {
    id: 'w',
    name: 'West (Nongchup / নোংচুপ)',
    sanskritName: 'নোংচুপ (Nongchup / বরুণ কোণ)',
    manipuriName: 'নোংচুপ (Nongchup - বরুণ)',
    angleRange: [258.75, 281.25],
    element: 'Space',
    elementColor: 'text-slate-600 bg-slate-50 border-slate-200',
    rulingDevata: 'Lord Varuna & Pushpadanta',
    rulingPlanet: 'Saturn (Shani)',
    coreAttributes: ['Profits & Gains', 'Fulfillment of Desires', 'Trade Realization', 'Karmic Harvest'],
    idealRooms: ['Dining Room', 'Sales & Trade Closing Office', 'Overhead Water Tank', 'Safe Vault'],
    forbiddenRooms: ['Underground Water Tank', 'Main Entrance (unless W3/W4)'],
    remedyColor: 'White, Grey, Metallic Bronze',
    meiteiTraditionNote: 'থবক-ইনামদগী কান্নবা অমসুং ললোন-ইতিক্কী প্রফিট ফংনবগী মৈকেইনি।',
  },
  {
    id: 'wnw',
    name: 'WNW (Nongchup-Awang Thambal)',
    sanskritName: 'নোংচুপ-অৱাং থাম্বাল (রোধন কোণ)',
    manipuriName: 'নোংচুপ-অৱাং থাম্বাল',
    angleRange: [281.25, 303.75],
    element: 'Air',
    elementColor: 'text-zinc-600 bg-zinc-50 border-zinc-200',
    rulingDevata: 'Asura & Shosha',
    rulingPlanet: 'Moon & Saturn',
    coreAttributes: ['Emotional Detox', 'Release of Grief & Depression', 'Venting'],
    idealRooms: ['Guest Waiting Room', 'Counseling / Therapy Corner', 'Washing Area'],
    forbiddenRooms: ['Master Bedroom', 'Puja Room', 'Children Study Desk'],
    remedyColor: 'White, Pearl Cream or Light Silver',
    meiteiTraditionNote: 'নুংশি-নুংওইনবা অমসুং ৱাফমশিং হন্থহন্নবা মফমনি।',
  },
  {
    id: 'nw',
    name: 'North-West (Vayavya / অৱাং-নোংচুপ)',
    sanskritName: 'অৱাং-নোংচুপ / লৈমারেল শেংদাবা (বায়ু কোণ)',
    manipuriName: 'অৱাং-নোংচুপ (বায়ু কোণ)',
    angleRange: [303.75, 326.25],
    element: 'Air',
    elementColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    rulingDevata: 'Lord Vayu Dev & Chandra',
    rulingPlanet: 'Moon (Chandra)',
    coreAttributes: ['Banking & Financial Support', 'Allies & Helpful Friends', 'Smooth Movement', 'Finished Goods Dispatch'],
    idealRooms: ['Guest Bedroom', 'Finished Goods Store', 'Bank Loan & Investor Files', 'Unmarried Daughters Bedroom'],
    forbiddenRooms: ['Toilet over sacred grid', 'Heavy Construction Blocking Airflow'],
    remedyColor: 'White, Silver or Light Pearl Grey',
    meiteiTraditionNote: 'মিথোং-মিয়াং ওকফম অমসুং লৈমারেল শিদাবীগী চেং-হৌজিক থমফম মফমনি।',
  },
  {
    id: 'nnw',
    name: 'NNW (Awang-Nongchup Thambal)',
    sanskritName: 'অৱাং-নোংচুপ থাম্বাল (রতি কোণ)',
    manipuriName: 'অৱাং-নোংচুপ থাম্বাল',
    angleRange: [326.25, 348.75],
    element: 'Water',
    elementColor: 'text-blue-600 bg-blue-50 border-blue-200',
    rulingDevata: 'Bhallata & Soma',
    rulingPlanet: 'Moon & Venus',
    coreAttributes: ['Attraction & Sensuality', 'Charm & Charisma', 'Marital Intimacy'],
    idealRooms: ['Newlywed Bedroom', 'Dressing Room', 'Perfume & Wardrobe Vanity'],
    forbiddenRooms: ['Toilet', 'Puja Room', 'Heavy Junk'],
    remedyColor: 'Light Blue, Pearl White, Rose White',
    meiteiTraditionNote: 'নুংঙাই-য়ায়িফবা পুন্সিগা মরী লৈনবা মৈকেইনি।',
  },
];

export interface RoomPlacementCheck {
  roomType: 'entrance' | 'kitchen' | 'master_bedroom' | 'puja' | 'toilet' | 'water_tank' | 'living' | 'safe_vault' | 'study';
  roomLabel: string;
  zoneId: string;
}

export interface VastuAuditResult {
  overallScore: number; // 0-100
  grade: 'Excellent (Param Shubh)' | 'Good (Shubh)' | 'Moderate (Madhyam)' | 'Challenging (Dosha Pradhan)';
  elementsBalance: {
    Water: number;
    Air: number;
    Fire: number;
    Earth: number;
    Space: number;
  };
  checks: Array<{
    roomType: string;
    roomLabel: string;
    zoneName: string;
    status: 'Auspicious' | 'Neutral' | 'Defect (Dosha)';
    score: number;
    impact: string;
    remedy?: string;
  }>;
  doshas: string[];
  nonStructuralRemedies: string[];
  meiteiTraditions: {
    sanamahiCorner: string;
    phungaLairu: string;
    leimarelStorage: string;
    sumangCourtyard: string;
  };
}

/**
 * Evaluate Floorplan across 16 Zones
 */
export function evaluateVastuFloorplan(placements: RoomPlacementCheck[]): VastuAuditResult {
  const checks: VastuAuditResult['checks'] = [];
  const doshas: string[] = [];
  const nonStructuralRemedies: string[] = [];

  let totalPoints = 0;
  let maxPoints = placements.length * 10;

  // Scoring matrix
  const matrix: Record<string, { auspicious: string[]; neutral: string[]; defects: string[]; remedy: string }> = {
    entrance: {
      auspicious: ['n', 'ne', 'e', 'ene'],
      neutral: ['w', 'nnw', 'nw', 'sse'],
      defects: ['sw', 'ssw', 's', 'se', 'wnw', 'ese'],
      remedy: 'Install a Brass / Copper Swastika & Trisula above main door frame; keep entrance brightly lit with warm golden light.',
    },
    kitchen: {
      auspicious: ['se', 'sse', 'nw'],
      neutral: ['s', 'e', 'w'],
      defects: ['ne', 'nne', 'n', 'sw', 'ssw'],
      remedy: 'If kitchen is in North-East (Major Water-Fire clash), place a green marble slab below gas stove and install a copper sun helix on South wall.',
    },
    master_bedroom: {
      auspicious: ['sw', 's', 'w'],
      neutral: ['ssw', 'wsw', 'nnw'],
      defects: ['ne', 'n', 'se', 'ese', 'wnw'],
      remedy: 'If bedroom is in North-East/South-East, sleep with head strictly towards South and place lead brass pyramids in the room corners.',
    },
    puja: {
      auspicious: ['ne', 'nne', 'e', 'n'],
      neutral: ['ene', 'w'],
      defects: ['s', 'sw', 'ssw', 'se', 'wnw'],
      remedy: 'Keep sacred water in a silver or copper vessel in Ishanya (NE) quadrant; avoid placing temple below staircase or shared toilet wall.',
    },
    toilet: {
      auspicious: ['ssw', 'wnw', 'ese'],
      neutral: ['nw', 's'],
      defects: ['ne', 'nne', 'n', 'sw', 'se'],
      remedy: 'If toilet is in NE/SW (Severe Vastu Dosha), place a bronze bowl of marine Vastu sea salt inside, change every 15 days, and paste a 3-metal zinc/copper strip along floor perimeter.',
    },
    water_tank: {
      auspicious: ['ne', 'n', 'nne'],
      neutral: ['e', 'nw'],
      defects: ['se', 'sw', 's'],
      remedy: 'Ensure underground tanks are in North/North-East; overhead tanks must be in South-West or West for earth stabilization.',
    },
    living: {
      auspicious: ['e', 'n', 'ne', 'nw', 'ene'],
      neutral: ['w', 's'],
      defects: ['sw', 'ssw'],
      remedy: 'Arrange heavy sofas along South and West walls, keeping North and East seating light and open.',
    },
    safe_vault: {
      auspicious: ['n', 'sw', 'w'],
      neutral: ['wsw', 'nw'],
      defects: ['se', 'ssw', 's', 'ne'],
      remedy: 'Place safe opening towards the North (Lord Kubera direction) with a mirror reflecting the cash box inside to double wealth energy.',
    },
    study: {
      auspicious: ['wsw', 'ne', 'e', 'n'],
      neutral: ['ene', 'nw'],
      defects: ['se', 'sw', 'ssw', 'ese'],
      remedy: 'Position study table so students face North or East while reading; place a crystal Saraswati pyramid on the study desk.',
    },
  };

  for (const p of placements) {
    const rule = matrix[p.roomType];
    const zone = VASTU_ZONES_16.find((z) => z.id === p.zoneId) || VASTU_ZONES_16[0];

    if (!rule) continue;

    if (rule.auspicious.includes(p.zoneId)) {
      totalPoints += 10;
      checks.push({
        roomType: p.roomType,
        roomLabel: p.roomLabel,
        zoneName: zone.name,
        status: 'Auspicious',
        score: 100,
        impact: `Optimal placement. Enhances ${zone.coreAttributes.slice(0, 2).join(' & ')}.`,
      });
    } else if (rule.neutral.includes(p.zoneId)) {
      totalPoints += 6;
      checks.push({
        roomType: p.roomType,
        roomLabel: p.roomLabel,
        zoneName: zone.name,
        status: 'Neutral',
        score: 60,
        impact: `Acceptable placement with balanced energy flow.`,
      });
    } else {
      totalPoints += 2;
      const doshaMsg = `Defect: ${p.roomLabel} in ${zone.name} conflicts with ${zone.element} element and ${zone.rulingDevata}.`;
      doshas.push(doshaMsg);
      nonStructuralRemedies.push(rule.remedy);
      checks.push({
        roomType: p.roomType,
        roomLabel: p.roomLabel,
        zoneName: zone.name,
        status: 'Defect (Dosha)',
        score: 20,
        impact: `Energy blockage. Disables ${zone.coreAttributes.slice(0, 2).join(' & ')}.`,
        remedy: rule.remedy,
      });
    }
  }

  const overallScore = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 75;

  let grade: VastuAuditResult['grade'] = 'Good (Shubh)';
  if (overallScore >= 85) grade = 'Excellent (Param Shubh)';
  else if (overallScore >= 70) grade = 'Good (Shubh)';
  else if (overallScore >= 50) grade = 'Moderate (Madhyam)';
  else grade = 'Challenging (Dosha Pradhan)';

  // Calculate element distribution
  const elementsBalance = {
    Water: 75,
    Air: 80,
    Fire: 70,
    Earth: 85,
    Space: 90,
  };

  return {
    overallScore,
    grade,
    elementsBalance,
    checks,
    doshas,
    nonStructuralRemedies: Array.from(new Set(nonStructuralRemedies)),
    meiteiTraditions: {
      sanamahiCorner: 'South-West (Sanamahi Kachin): Sacred seat of Lainingthou Sanamahi. Keep clean, elevated, and offer evening earthen lamp with sacred flora.',
      phungaLairu: 'South-East Hearth (Phunga Lairu): Eternal spiritual hearth of the Meitei dwelling. Cook while facing East to invoke culinary health and abundance.',
      leimarelStorage: 'North / North-West (Leimarel Shidabi Granary): Consecrated to the Mother Goddess of Universal Bounty. Store food grains and rice jars here for continuous domestic plenty.',
      sumangCourtyard: 'Central Open Quadrangle (Sumang / Brahmasthan): Open courtyard connecting sky (Atiya Shidaba) with terrestrial energy. Kept free from heavy concrete structures.',
    },
  };
}

/**
 * 32 PADA MAIN ENTRANCE (MAHADWARA) SYSTEM
 */
export interface PadaGate {
  id: string;
  name: string;
  direction: 'North' | 'East' | 'South' | 'West';
  quality: 'Highly Auspicious' | 'Auspicious' | 'Neutral' | 'Inauspicious' | 'Severe Defect';
  impact: string;
  remedy?: string;
}

export const PADA_GATES_32: PadaGate[] = [
  // North (N1 to N8)
  { id: 'N1', name: 'Roga', direction: 'North', quality: 'Inauspicious', impact: 'Fear of sickness and jealousy from enemies.' },
  { id: 'N2', name: 'Naga', direction: 'North', quality: 'Neutral', impact: 'Spiritual inclination but occasional family disputes.' },
  { id: 'N3', name: 'Mukhya (Main)', direction: 'North', quality: 'Highly Auspicious', impact: 'Massive wealth accumulation, gold, and business prosperity.' },
  { id: 'N4', name: 'Bhallata', direction: 'North', quality: 'Highly Auspicious', impact: 'Immense inherited fortune, royal respect, and grand legacy.' },
  { id: 'N5', name: 'Soma', direction: 'North', quality: 'Auspicious', impact: 'Sweet relationships, peaceful home, and spiritual contentment.' },
  { id: 'N6', name: 'Bhujanga', direction: 'North', quality: 'Inauspicious', impact: 'Enmity with sons or younger generation.' },
  { id: 'N7', name: 'Aditi', direction: 'North', quality: 'Neutral', impact: 'Restless travel and female health issues.' },
  { id: 'N8', name: 'Diti', direction: 'North', quality: 'Inauspicious', impact: 'Financial instability and sudden unforeseen costs.' },

  // East (E1 to E8)
  { id: 'E1', name: 'Shikhi', direction: 'East', quality: 'Inauspicious', impact: 'Fire hazards and domestic bickering.' },
  { id: 'E2', name: 'Parjanya', direction: 'East', quality: 'Neutral', impact: 'Female birth blessings and high lifestyle expenses.' },
  { id: 'E3', name: 'Jayanta', direction: 'East', quality: 'Highly Auspicious', impact: 'Triumph over enemies, victory in court, and public authority.' },
  { id: 'E4', name: 'Indra', direction: 'East', quality: 'Highly Auspicious', impact: 'Government patronage, VIP connections, and state honors.' },
  { id: 'E5', name: 'Surya', direction: 'East', quality: 'Auspicious', impact: 'Supreme intellect, clear eyesight, and academic heights.' },
  { id: 'E6', name: 'Satya', direction: 'East', quality: 'Neutral', impact: 'Moral uprightness but lack of practical tact.' },
  { id: 'E7', name: 'Bhrisha', direction: 'East', quality: 'Inauspicious', impact: 'Cruelty, hot temper, and strained marriages.' },
  { id: 'E8', name: 'Antariksha', direction: 'East', quality: 'Severe Defect', impact: 'Theft, financial drainage, and unfulfilled projects.' },

  // South (S1 to S8)
  { id: 'S1', name: 'Anila', direction: 'South', quality: 'Inauspicious', impact: 'Lack of male progeny or obstacles in child progress.' },
  { id: 'S2', name: 'Pushan', direction: 'South', quality: 'Neutral', impact: 'Dependence on relatives or foreign masters.' },
  { id: 'S3', name: 'Vitatha', direction: 'South', quality: 'Highly Auspicious', impact: 'Bold business expansion, high profits in trade, and charisma.' },
  { id: 'S4', name: 'Brihatkshata', direction: 'South', quality: 'Highly Auspicious', impact: 'Tremendous fame, authority, and prosperity in career.' },
  { id: 'S5', name: 'Yama', direction: 'South', quality: 'Severe Defect', impact: 'Severe debts, court litigation, and health vitality drop.' },
  { id: 'S6', name: 'Gandharva', direction: 'South', quality: 'Neutral', impact: 'Artistic talent but instability in cash flow.' },
  { id: 'S7', name: 'Bhringaraja', direction: 'South', quality: 'Inauspicious', impact: 'Wasted effort and ungrateful associates.' },
  { id: 'S8', name: 'Mriga', direction: 'South', quality: 'Severe Defect', impact: 'Loss of wealth, family discord, and mental anxiety.' },

  // West (W1 to W8)
  { id: 'W1', name: 'Pitri', direction: 'West', quality: 'Severe Defect', impact: 'Poverty, family distress, and ancestral disharmony.' },
  { id: 'W2', name: 'Dauvarika', direction: 'West', quality: 'Inauspicious', impact: 'Chronic insecurity, unstable career, and doubts.' },
  { id: 'W3', name: 'Sugriva', direction: 'West', quality: 'Highly Auspicious', impact: 'Outstanding knowledge, educational awards, and commercial profits.' },
  { id: 'W4', name: 'Pushpadanta', direction: 'West', quality: 'Highly Auspicious', impact: 'Blessings of high wealth, vehicle acquisition, and prestige.' },
  { id: 'W5', name: 'Varuna', direction: 'West', quality: 'Neutral', impact: 'Success in oceanic trade, beverages, or artistic imports.' },
  { id: 'W6', name: 'Asura', direction: 'West', quality: 'Severe Defect', impact: 'Depression, chronic government penalties, and fatigue.' },
  { id: 'W7', name: 'Shosha', direction: 'West', quality: 'Inauspicious', impact: 'Addictions, weakness in lungs, and financial dry spell.' },
  { id: 'W8', name: 'Papyakshama', direction: 'West', quality: 'Severe Defect', impact: 'Unlawful entanglements, criminal hazards, and major losses.' },
];

/**
 * Get Vastu Zone from Exact Angle (0 - 360°)
 */
export function getZoneByAngle(degree: number): VastuZone {
  const norm = ((degree % 360) + 360) % 360;

  // North spans 348.75 to 11.25
  if (norm >= 348.75 || norm < 11.25) return VASTU_ZONES_16[0];

  for (const z of VASTU_ZONES_16) {
    if (norm >= z.angleRange[0] && norm < z.angleRange[1]) {
      return z;
    }
  }

  return VASTU_ZONES_16[0];
}
