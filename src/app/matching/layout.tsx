import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Kundli Matching — 36-Gun Ashtakoot Marriage Compatibility Calculator",
  description: "Calculate marriage compatibility score out of 36 points. Comprehensive Ashtakoot Milan covering Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, and Nadi.",
  keywords: ["Kundli Matching", "Gun Milan", "36 Gun Milan", "Ashtakoot Compatibility", "Marriage Kundli Matching", "Manglik Dosh Check"],
  openGraph: {
    title: "Ashtakoot 36-Gun Milan Marriage Matching | KangleiAstro",
    description: "Detailed marriage compatibility report with Manglik Dosh cancellation checks.",
    url: "https://benevolent-ganache-baa904.netlify.app/matching",
  },
};

export default function MatchingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
