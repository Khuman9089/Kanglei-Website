import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jyoti AI — Your Personal Celestial Intelligence | Global AI Astrology Platform',
  description:
    'Autonomous Astrological Intelligence Platform offering high-precision Sidereal Kundali calculations, Vimshottari Dashas, daily celestial weather, and AI Oracle synthesis.',
  keywords: [
    'Jyoti AI',
    'AI astrology',
    'Sidereal Kundali',
    'Vimshottari Dasha',
    'celestial intelligence',
    'astrology AI oracle',
  ],
  alternates: {
    canonical: 'https://kuthiyengpham.in/astroai',
  },
  openGraph: {
    title: 'Jyoti AI — Your Personal Celestial Intelligence',
    description: 'High-precision autonomous astrological intelligence platform.',
    url: 'https://kuthiyengpham.in/astroai',
    siteName: 'Jyoti AI',
    type: 'website',
  },
};

export default function JyotiAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased">{children}</div>;
}
