import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AstroVista — Your Life • Your Stars • Your Future | Personalized Astrology Insights',
  description:
    'Discover insights, make better decisions, and unlock your true potential with AstroVista. Personalized astrology insights powered by your birth details.',
  keywords: [
    'AstroVista',
    'AstroAI',
    'AI astrology',
    'Quick Astrology',
    'Detailed Birth Chart',
    'Horoscope',
    'Numerology',
    'Compatibility'
  ],
  alternates: {
    canonical: 'https://kuthiyengpham.in/astroai',
  },
  openGraph: {
    title: 'AstroVista — Your Life • Your Stars • Your Future',
    description: 'Personalized astrology insights powered by your birth details.',
    url: 'https://kuthiyengpham.in/astroai',
    siteName: 'AstroVista',
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
