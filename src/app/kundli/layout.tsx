import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Kundli Generator — Accurate D1 Rashi & D9 Navamsha Birth Charts",
  description: "Generate your free Vedic birth chart (Kuthi Iba) with precise planetary longitudes, house divisions, D9 Navamsha, and full Vimshottari Dasha forecast.",
  keywords: ["Free Kundli Generator", "Vedic Birth Chart", "Kuthi Iba", "D1 Rashi Chart", "D9 Navamsha", "Vimshottari Dasha Calculator"],
  openGraph: {
    title: "Free Kundli & Birth Chart Generator | KangleiAstro",
    description: "Instant online Kundli calculation based on Lahiri Ayanamsa sidereal zodiac.",
    url: "https://benevolent-ganache-baa904.netlify.app/kundli",
  },
};

export default function KundliLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
