import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Determine baseUrl dynamically based on the requesting host so it NEVER mismatches Google Search Console property domain
  let baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kuthiyengpham.in').replace(/\/$/, '');

  try {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') || 'https';
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      baseUrl = `${proto}://${host}`.replace(/\/$/, '');
    }
  } catch (err) {
    // Fallback to configured domain
  }

  const today = new Date().toISOString().split('T')[0];

  // 1. Core High-Priority Pages
  const coreRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/manipuri_free_kuthi', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/manipuri_kuthi_yengba', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/panchang', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/calendar', priority: 0.90, changeFrequency: 'daily' as const },
    { path: '/manipuri_kuthi', priority: 0.90, changeFrequency: 'weekly' as const },
    { path: '/numit_leppa_yengba', priority: 0.90, changeFrequency: 'weekly' as const },
    { path: '/matching', priority: 0.90, changeFrequency: 'weekly' as const },
    { path: '/free_matching', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/pakna_wainaba', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/astrologers', priority: 0.85, changeFrequency: 'daily' as const },
    { path: '/consultation', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/booking', priority: 0.80, changeFrequency: 'weekly' as const },
    { path: '/services', priority: 0.80, changeFrequency: 'weekly' as const },
    { path: '/shop', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.85, changeFrequency: 'daily' as const },
    { path: '/horoscope', priority: 0.85, changeFrequency: 'daily' as const },
    { path: '/tools', priority: 0.80, changeFrequency: 'weekly' as const },
    { path: '/tools/dasha', priority: 0.80, changeFrequency: 'weekly' as const },
    { path: '/tools/kaal-sarp-dosh', priority: 0.80, changeFrequency: 'weekly' as const },
    { path: '/vastu', priority: 0.75, changeFrequency: 'weekly' as const },
    { path: '/tarot', priority: 0.75, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.70, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.70, changeFrequency: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.50, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.50, changeFrequency: 'yearly' as const },
    { path: '/refund-policy', priority: 0.50, changeFrequency: 'yearly' as const },
    { path: '/return-policy', priority: 0.50, changeFrequency: 'yearly' as const },
  ].map((item) => ({
    url: item.path === '/' ? `${baseUrl}/` : `${baseUrl}${item.path}`,
    lastModified: today,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  // 2. All 12 Moon Signs Daily Horoscope
  const moonSigns = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  const horoscopeRoutes = moonSigns.map((sign) => ({
    url: `${baseUrl}/horoscope/${sign}`,
    lastModified: today,
    changeFrequency: 'daily' as const,
    priority: 0.80,
  }));

  // 3. Published Blog Articles
  const blogSlugs = [
    'saturn-sade-sati-phases-and-remedies',
    'importance-of-36-gun-ashtakoot-milan',
    'power-of-kuthi-yengba-analysis',
    'understanding-kuthi-yengba-traditional-manipuri-astrology',
    'vimshottari-dasha-planetary-periods-explained',
    'shani-sade-sati-remedies-and-myth-busting',
  ];

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: today,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  return [...coreRoutes, ...horoscopeRoutes, ...blogRoutes];
}
