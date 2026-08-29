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
 * Tool #1: Kuthi Generator
 */
export const ACTIVE_TOOLS_REGISTRY: ToolDefinition[] = [
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
    title: 'Dasha Yengpham',
    subtitle: 'Get Vimshottari Dasha Details (Mahadasha, Antardasha & Pratyantardasha timeline).',
    category: 'astrology',
    iconName: 'Clock',
    color: 'text-[#d97706]',
    description: 'Calculates 120-year planetary Vimshottari Dasha timeline based on Moon Nakshatra at birth.',
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
];
