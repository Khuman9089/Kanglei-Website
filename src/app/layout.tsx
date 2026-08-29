import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BannerAd970x90 from "@/components/ui/BannerAd970x90";

export const metadata: Metadata = {
  title: "KangleiAstro — Premium Vedic Astrology Consultations & Reports",
  description:
    "Discover your life's blueprint with personalized Vedic astrology consultations, 30-page free horoscope reports, Kundli matching, and daily Moon sign transit forecasts.",
  keywords: [
    "Vedic Astrology",
    "Kundli",
    "Horoscope Report",
    "Jyotish",
    "Gun Milan",
    "Kundli Matching",
    "Vimshottari Dasha",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fffdfa] text-[#0f172a] antialiased selection:bg-[#d97706]/20 selection:text-[#0f172a]">
        <Navbar />
        <BannerAd970x90 />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
