import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://benevolent-ganache-baa904.netlify.app';

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
