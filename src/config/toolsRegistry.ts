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
];
