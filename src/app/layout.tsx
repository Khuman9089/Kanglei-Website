import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BannerAd970x90 from "@/components/ui/BannerAd970x90";
import JsonLd from "@/components/seo/JsonLd";

import MobileBottomNav from "@/components/layout/MobileBottomNav";

const baseUrl = 'https://benevolent-ganache-baa904.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "KangleiAstro — Premium Vedic Astrology Consultations & Kuthi Yengba",
    template: "%s | KangleiAstro",
  },
  description:
    "Discover your life's blueprint with personalized Manipuri Vedic astrology consultations, 30-page free horoscope reports, Kuthi Yengba, Ashtakoot 36-Gun Milan matching, and daily Moon sign transit forecasts.",
  keywords: [
    "Vedic Astrology",
    "KangleiAstro",
    "Kuthi Yengba",
    "Kuthi Iba",
    "Manipuri Astrologer",
    "Imphal Astrologer",
    "Kundli Generator",
    "Horoscope Report",
    "Jyotish Consultation",
    "Gun Milan",
    "Kundli Matching",
    "Vimshottari Dasha",
    "Shani Sade Sati",
    "Kaal Sarp Dosh",
  ],
  authors: [{ name: "KangleiAstro Vedic Master Panel" }],
  creator: "KangleiAstro",
  publisher: "KangleiAstro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "KangleiAstro — Premium Vedic Astrology Consultations & Kuthi Yengba",
    description: "Connect face-to-face with Manipur's top empaneled Vedic astrologers for Kuthi Yengba, Vimshottari Dasha, and 36-Gun Ashtakoot marriage matching.",
    url: baseUrl,
    siteName: "KangleiAstro",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${baseUrl}/kangleiastro_og_cover.png`,
        width: 1200,
        height: 630,
        alt: "KangleiAstro Premium Vedic Astrology Consultations & Reports",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KangleiAstro — Premium Vedic Astrology & Kuthi Yengba",
    description: "Personalized Vedic astrology consultations, birth chart calculations, and marriage matching.",
    images: [`${baseUrl}/kangleiastro_og_cover.png`],
    creator: "@kangleiastro",
  },
  alternates: {
    canonical: baseUrl,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "KangleiAstro Vedic Astrology Platform",
  "alternateName": "KangleiAstro",
  "url": baseUrl,
  "logo": `${baseUrl}/logo.png`,
  "image": `${baseUrl}/kangleiastro_og_cover.png`,
  "description": "Premier Manipuri Vedic Astrology platform providing live Kuthi Yengba consultations, D1 Rashi & D9 Navamsha chart reports, Ashtakoot Gun Milan matching, and consecration e-store.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Uripok Kangchup Road",
    "addressLocality": "Imphal West",
    "addressRegion": "Manipur",
    "postalCode": "795001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "24.8170",
    "longitude": "93.9368"
  },
  "telephone": "+91 98765 43210",
  "email": "ccare@kangleiastro.com",
  "priceRange": "₹25 - ₹2499",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "10482",
    "bestRating": "5",
    "worstRating": "1"
  }
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
        <JsonLd data={organizationSchema} />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fffdfa] text-[#0f172a] antialiased selection:bg-[#d97706]/20 selection:text-[#0f172a] pb-16 md:pb-0">
        <Navbar />
        <BannerAd970x90 />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
