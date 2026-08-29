import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Talk to Manipur's Top Rated Astrologers | Kuthi Yengba Experts",
  description: "Connect live with 4-step verified Empaneled Manipuri Vedic Astrologers. Expert guidance for Kuthi Yengba, Vimshottari Dasha, and Ashtakoot Gun Milan.",
  openGraph: {
    title: "Talk to Manipur's Top Rated Astrologers | KangleiAstro",
    description: "Connect live with verified Vedic Astrologers for personalized Kuthi Yengba and remedial guidance.",
    url: "https://benevolent-ganache-baa904.netlify.app/astrologers",
  },
};

export default function AstrologersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
