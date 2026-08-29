import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Vedic Astrological E-Store — Certified Consecrated Gemstones & Puja Items",
  description: "Shop 100% authentic, 8-stage consecrated natural gemstones, sanctified Yantras, Puja Samagri, and authentic Vedic literature.",
  keywords: ["Astrology E-Store", "Consecrated Gemstones", "Natural Yellow Sapphire", "Blue Sapphire", "Rudraksha", "Puja Items", "Yantra"],
  openGraph: {
    title: "Vedic Astrological E-Store | KangleiAstro",
    description: "Certified gemstones and consecrated remedies blessed at Master Pandit Altar.",
    url: "https://benevolent-ganache-baa904.netlify.app/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
