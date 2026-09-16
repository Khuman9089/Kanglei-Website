import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Manipuri Calendar by KangleiAstro',
    short_name: 'Manipuri Calendar',
    description: 'Authentic Manipuri Calendar, Vedic Panchang, Rashifal, and Janma Patrika Kuthi analysis.',
    start_url: '/app',
    id: '/app',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0d1322',
    theme_color: '#1e1b18',
    icons: [
      {
        src: '/app-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/app-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Manipuri Calendar',
        url: '/app?tab=calendar',
        description: 'View monthly Manipuri calendar',
      },
      {
        name: 'Vedic Panchang',
        url: '/app?tab=panchang',
        description: 'View daily Panchang muhurtas',
      },
      {
        name: 'Leipung Community',
        url: '/app?tab=leipung',
        description: 'Community social feed',
      },
    ],
  };
}
