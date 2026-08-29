import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://benevolent-ganache-baa904.netlify.app';

  // Static core routes
  const staticRoutes = [
    '',
    '/astrologers',
    '/kundli',
    '/matching',
    '/services',
    '/shop',
    '/blog',
    '/panchang',
    '/horoscope',
    '/booking',
    '/about',
    '/tools',
    '/tools/dasha',
    '/tools/kaal-sarp-dosh',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : route === '/astrologers' || route === '/kundli' ? 0.9 : 0.8,
  }));

  // Dynamic Horoscope Moon Sign routes
  const moonSigns = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  const horoscopeRoutes = moonSigns.map((sign) => ({
    url: `${baseUrl}/horoscope/${sign}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Dynamic Blog Post routes
  const blogSlugs = [
    'understanding-kuthi-yengba-traditional-manipuri-astrology',
    'astakoot-gun-milan-36-points-compatibility',
    'vimshottari-dasha-planetary-periods-explained',
    'shani-sade-sati-remedies-and-myth-busting',
    'navamsha-d9-chart-marriage-and-[#d97706]',
  ];

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...horoscopeRoutes, ...blogRoutes];
}
