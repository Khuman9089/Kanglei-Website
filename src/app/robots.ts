import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function robots(): Promise<MetadataRoute.Robots> {
  let baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kuthiyengpham.in').replace(/\/$/, '');

  try {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') || 'https';
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      baseUrl = `${proto}://${host}`.replace(/\/$/, '');
    }
  } catch (err) {
    // Fallback
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
