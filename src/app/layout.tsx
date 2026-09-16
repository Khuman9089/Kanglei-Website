import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BannerAd970x90 from "@/components/ui/BannerAd970x90";
import JsonLd from "@/components/seo/JsonLd";

import MobileBottomNav from "@/components/layout/MobileBottomNav";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";

import CartDrawer from "@/components/shop/CartDrawer";

const baseUrl = 'https://kuthiyengpham.in';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kuthi Yengpham | Manipur Kuthi Yengba, Manipuri Calendar & Panjika",
    template: "%s | Kuthi Yengpham",
  },
  description:
    "Authentic Manipur kuthi yengba and online astrology portal. Check daily Manipuri calendar, panjika (panchang), Thaban Tatpa, Luhongba Thouro, Rashiphal, Nakshatra, and Kangleipak horoscopes.",
  keywords: [
    "manipur kuthi yengba",
    "kuthi yengpham",
    "manipuri calendar",
    "manipuri panchang",
    "manipuri panjika",
    "thaban tatpa",
    "luhongba thouro",
    "rashiphal manipuri",
    "manipur astrology online",
    "kanglei astrology",
    "yumsa thouro",
    "thougal thouro",
    "meitei panjika",
    "meitei calendar",
    "tithi manipur",
    "nakshatra manipur",
    "thasi maikei",
    "horoscope manipur",
    "kuthi iba",
    "kangleiastro",
    "manipur astrologer"
  ],
  authors: [{ name: "Kuthi Yengpham Astrology Panel" }],
  creator: "Kuthi Yengpham",
  publisher: "Kuthi Yengpham",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://kuthiyengpham.in/",
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
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
    type: "website",
    url: "https://kuthiyengpham.in/",
    title: "Kuthi Yengpham | Manipur Kuthi Yengba, Calendar & Panchang",
    description: "Calculate your Kuthi online. Access daily Manipuri Panjika, Thaban Tatpa, Luhongba & Yumsharol auspicious dates, and Vedic horoscope readings in Manipur.",
    siteName: "Kuthi Yengpham",
    locale: "en_IN",
    images: [
      {
        url: "https://kuthiyengpham.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kuthi Yengpham — Manipur Kuthi Yengba, Manipuri Calendar & Panjika",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kuthiyengpham",
    creator: "@kuthiyengpham",
    title: "Kuthi Yengpham | Manipur Kuthi Yengba, Calendar & Panchang",
    description: "Online Manipuri astrology portal for Kuthi Yengba, daily calendar, Panjika timings, and Meitei auspicious day calculations.",
    images: ["https://kuthiyengpham.in/og-image.jpg"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Kuthi Yengpham",
  "alternateName": ["KuthiYengpham by KangleiAstro", "KangleiAstro", "Kuthi Yengpham Manipur"],
  "url": "https://kuthiyengpham.in/",
  "logo": "https://kuthiyengpham.in/og-image.jpg",
  "image": "https://kuthiyengpham.in/og-image.jpg",
  "description": "Authentic Manipur kuthi yengba and online astrology portal. Check daily Manipuri calendar, panjika (panchang), Thaban Tatpa, Luhongba Thouro, Rashiphal, Nakshatra, and Kangleipak horoscopes.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Khurai Chingangbam Leikai, Tinsid Road",
    "addressLocality": "Imphal East",
    "addressRegion": "Manipur",
    "postalCode": "795005",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "24.8170",
    "longitude": "93.9368"
  },
  "telephone": "+91 98765 43210",
  "email": "ccare@kuthiyengpham.in",
  "priceRange": "₹0 - ₹2499",
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

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Kuthi Yengpham",
  "url": "https://kuthiyengpham.in/",
  "description": "Authentic Manipur kuthi yengba and online astrology portal. Check daily Manipuri calendar, panjika (panchang), Thaban Tatpa, Luhongba Thouro, Rashiphal, Nakshatra, and Kangleipak horoscopes.",
  "inLanguage": ["en", "bn", "mni"]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Dancing+Script:wght@600;700&family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;600;700;800;900&family=Noto+Serif+Bengali:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#fffdfa" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fffdfa] text-[#0f172a] antialiased selection:bg-[#d97706]/20 selection:text-[#0f172a] pb-16 md:pb-0">
        <Navbar />
        <BannerAd970x90 />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileBottomNav />
        <CartDrawer />
      </body>
    </html>
  );
}
