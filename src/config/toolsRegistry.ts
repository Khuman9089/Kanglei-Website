export interface ToolDefinition {
  id: string;
  title: string;
  subtitle: string;
  category: 'astrology' | 'dosha' | 'numerology' | 'love';
  iconName: string;
  color: string;
  description: string;
}

/**
 * MASTER TOOL REGISTRY
 */
export const ACTIVE_TOOLS_REGISTRY: ToolDefinition[] = [
  {
    id: 'vedic-workstation',
    title: 'Vedic Workstation (D1, D9, D10 & Gochara)',
    subtitle: 'Classic Parashara workstation with Tri-Charts (D1, D9, D10), Planetary Details, Shadbala Bar Chart, Vimshottari & Live Gochara Transits.',
    category: 'astrology',
    iconName: 'Compass',
    color: 'text-amber-500',
    description: 'Renders full Jagannatha Hora style Parashari Light workstation with D1, D9 Navamsha, D10 Dashamsha, exact degrees, Shadbala strength bars, multi-level Vimshottari Dasha, Lordships, and Gochara transit analysis.',
  },
  {
    id: 'bnn-workstation',
    title: 'Bhrigu Nandi Nadi (BNN) Workstation',
    subtitle: 'Karakatwa, 4-Directional Trikona (1-5-9), 2-12 links & Jupiter 12-yr progression prediction engine.',
    category: 'astrology',
    iconName: 'Sparkles',
    color: 'text-indigo-500',
    description: 'Advanced BNN predictive system analyzing Jiva (Jupiter), Karma (Saturn), Directional elements, and year-by-year age progressions.',
  },
  {
    id: 'kuthi-generator',
    title: 'Kuthi Generator',
    subtitle: 'Generate accurate D1 Rashi & D9 Navamsha birth charts with planetary positions & house analysis.',
    category: 'astrology',
    iconName: 'User',
    color: 'text-amber-400',
    description: 'Calculates natal Lagna (Ascendant), planetary longitudes, D1 Rashi chart polygon diamond layout, and D9 Navamsha chart.',
  },
  {
    id: 'dasha-yengpham',
    title: 'Present Running Dasha & Life Timeline (Dasha Yengpham)',
    subtitle: 'Get Vimshottari Dasha details, current running Mahadasha/Antardasha & 120-year timeline.',
    category: 'astrology',
    iconName: 'Clock',
    color: 'text-[#d97706]',
    description: 'Calculates complete 120-year Vimshottari Dasha timeline, active running periods, exact remaining time countdown, and predictive guidance.',
  },
  {
    id: 'shani-sade-sati',
    title: 'Shani Sade Sati',
    subtitle: '7.5-Year Saturn Transit Phase & Remedial Guidance for Moon Sign.',
    category: 'dosha',
    iconName: 'ShieldCheck',
    color: 'text-sky-400',
    description: 'Detects current Sade Sati phase (Rising, Peak, Setting) and Dhaiya transit impacts.',
  },
  {
    id: 'mangalik-dosh',
    title: 'Manglik Dosh Calculator',
    subtitle: 'Kuja Dosha evaluation across Lagna, Moon & Venus with classical cancellations (Bhanga).',
    category: 'dosha',
    iconName: 'Flame',
    color: 'text-rose-500',
    description: 'Calculates Mars placements in 1st, 2nd, 4th, 7th, 8th, and 12th houses, severity score, and Vedic remedies.',
  },
  {
    id: 'kaal-sarp-dosh',
    title: 'Kaal Sarp Dosh',
    subtitle: 'Kaal Sarp Yoga Detection & Vedic Shanti Remedies.',
    category: 'dosha',
    iconName: 'Sparkles',
    color: 'text-purple-400',
    description: 'Analyzes Rahu-Ketu axis containment to identify Anant, Kulik, Vasuki and 12 types of Kaal Sarp Dosh.',
  },
  {
    id: 'astrology-yoga',
    title: 'Planetary Yogas',
    subtitle: 'Major Vedic Yogas (Gajakesari, Raj Yoga, Dhana Yoga & Pancha Mahapurusha).',
    category: 'astrology',
    iconName: 'Award',
    color: 'text-amber-300',
    description: 'Evaluates auspicious and inauspicious planetary combinations in natal chart.',
  },
  {
    id: 'match-making',
    title: 'Match Making (Gun Milan)',
    subtitle: 'Ashtakoot 36-Gun Marriage Compatibility & Manglik Dosh Check.',
    category: 'love',
    iconName: 'Heart',
    color: 'text-pink-400',
    description: 'Detailed 8-Koot marriage matching algorithm with Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot & Nadi scores.',
  },
  {
    id: 'yumsharol',
    title: 'Yumsharol (Traditional Vastu & House Science)',
    subtitle: 'Manipuri traditional house numerology & direction compatibility based on running age & nakshatra.',
    category: 'astrology',
    iconName: 'Compass',
    color: 'text-emerald-500',
    description: 'Calculates time-aware running age, Nakshatra summation, and Modulo 8 direction index (Yumsharol Lore).',
  },
  {
    id: 'nga-eeshing',
    title: 'Nga-Eeshing (ঙা-ঈশিং)',
    subtitle: 'Traditional Manipuri matrimonial compatibility & remedial ceremony calculation.',
    category: 'love',
    iconName: 'Waves',
    color: 'text-cyan-400',
    description: 'Calculates whether ঙা-ঈশিং falls for the couple based on Bride & Groom Janma Rashis (0–11), detects Fish/Water element, and provides remedial procedures.',
  },
  {
    id: 'numerology-workstation',
    title: 'Vedic Numerology (Ank Shastra) Workstation',
    subtitle: 'Moolank • Bhagyank • Name Number • Personal Cycles • Karmic Debt with Devanagari letter-planet mapping.',
    category: 'numerology',
    iconName: 'Hash',
    color: 'text-amber-600',
    description: 'Classical Sanskrit/Devanagari letter-to-planet numerology (Chaldean Vedic system) with Moolank, Bhagyank, Name Number, 9-year Personal Cycles, Pinnacles, Challenges, Karmic Debt detection (13/14/16/19), and Vedic Bridge to Vimshottari Dasha lords.',
  },
  {
    id: 'vastu-workstation',
    title: 'Vastu Shastra & Manipur Yumsharol Workstation',
    subtitle: 'Live 360° Compass Dial, 16 MahaVastu Zones, 32 Entrance Padas, Lainingthou Sanamahi Lore & Commercial Vastu.',
    category: 'astrology',
    iconName: 'Compass',
    color: 'text-emerald-500',
    description: 'Comprehensive Vedic spatial architecture workstation featuring live 360° compass heading, 16 MahaVastu energy zones, 32 Pada entrance gate analysis, Meitei Yumsharol modulo 8 calculation, and Sanamahi Kachin energy alignment.',
  },
  {
    id: 'saka-to-birth',
    title: 'Saka Era to Birth Converter (শকাব্দ to English DOB)',
    subtitle: 'Extract English DOB, Birth Time (Danda/Pal/Bipal), Epakpa Thabanik, Rashi & Nakshatra from Traditional Manipuri Kuthi.',
    category: 'astrology',
    iconName: 'ScrollText',
    color: 'text-amber-500',
    description: 'Direct conversion engine matching qw.xlsm Saka_to_Birth. Translates Saka Year (1842-1972), Solar Month (Mass 0-11), Sangkranti day (1-32), and Danda-Pal-Bipal into English Date of Birth, Local Solar Time, Weekday, Epakpa Numitki Tithi (Thabanik), Rashi & Nakshatra with ending times.',
  },
  {
    id: 'kuthi-result-sheets',
    title: 'Kuthi Horoscope Result Sheets (Result • Meetei_Result • MM_Result_M)',
    subtitle: '3-in-1 Unified Horoscope Result Sheets with Budha.ttf font, Directional predictions & Dasha timeline.',
    category: 'astrology',
    iconName: 'FileText',
    color: 'text-amber-600',
    description: 'Renders complete authentic Manipuri Kuthi horoscope documents across 3 tabbed sheets: Result (Classic format), Meetei_Result (BLipi15), and MM_Result_M (Budha.ttf font), with 8-direction travel predictions, lucky planetary numbers, and life dasha narrative.',
  },
];

