import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ManipuriCulturalHub from '@/components/home/ManipuriCulturalHub';
import KPShowcaseSection from '@/components/home/KPShowcaseSection';
import FreeToolsSection from '@/components/home/FreeToolsSection';
import TrustPillars from '@/components/home/TrustPillars';
import TopAstrologersSection from '@/components/home/TopAstrologersSection';
import FeaturedServices from '@/components/home/FeaturedServices';
import FeaturedShopSection from '@/components/home/FeaturedShopSection';
import ZodiacGrid from '@/components/home/ZodiacGrid';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import FAQAccordion from '@/components/home/FAQAccordion';

export const metadata: Metadata = {
  title: "Kuthi Yengpham | Manipur Kuthi Yengba, Manipuri Calendar & Panjika",
  description: "Authentic Manipur kuthi yengba and online astrology portal. Check daily Manipuri calendar, panjika (panchang), Thaban Tatpa, Luhongba Thouro, Rashiphal, Nakshatra, and Kangleipak horoscopes.",
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
    "horoscope manipur"
  ],
  alternates: {
    canonical: "https://kuthiyengpham.in/",
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
        alt: "Kuthi Yengpham — Manipur Kuthi Yengba, Calendar & Panchang",
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

export default function HomePage() {
  return (
    <>
      {/* 1. Main Calendar, Live Panjika & Fast Access Category Cards */}
      <HeroSection />

      {/* 2. Authentic Manipuri Cultural Astrology Hub (Thaban Tatpa, Luhongba, Yumsharol, Numit Leppa) */}
      <section id="cultural-panjika" className="relative">
        <ManipuriCulturalHub />
      </section>

      {/* 3. KP Astrology & qw.xlsm Result Sheets Showcase */}
      <section id="kp-astrology" className="relative">
        <KPShowcaseSection />
      </section>

      {/* 4. Free Astrology Tools Suite */}
      <section id="free-tools" className="relative">
        <FreeToolsSection />
      </section>

      {/* 5. Verified Top Astrologers of Manipur */}
      <TopAstrologersSection />

      {/* 6. Featured Personalized Services & Manual Reports */}
      <FeaturedServices />

      {/* 7. Daily Rashiphal / Horoscope (12 Zodiac Signs) */}
      <ZodiacGrid />

      {/* 8. Featured E-Store Section (Gemstones, Rudraksha & Yantras) */}
      <section id="e-store" className="relative">
        <FeaturedShopSection />
      </section>

      {/* 9. Trust Pillars & Credibility */}
      <TrustPillars />

      {/* 10. Client Testimonials */}
      <section id="testimonials" className="relative">
        <TestimonialsCarousel />
      </section>

      {/* 11. Frequently Asked Questions */}
      <section id="faq" className="relative">
        <FAQAccordion />
      </section>
    </>
  );
}
