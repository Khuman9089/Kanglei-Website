import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import TrustPillars from '@/components/home/TrustPillars';
import TopAstrologersSection from '@/components/home/TopAstrologersSection';
import FeaturedServices from '@/components/home/FeaturedServices';
import FeaturedShopSection from '@/components/home/FeaturedShopSection';
import ZodiacGrid from '@/components/home/ZodiacGrid';
import FreeToolsSection from '@/components/home/FreeToolsSection';
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
      <HeroSection />
      <TrustPillars />
      <TopAstrologersSection />
      <FeaturedServices />
      
      {/* Featured E-Store Section */}
      <section id="e-store" className="relative">
        <FeaturedShopSection />
      </section>

      <ZodiacGrid />

      {/* Free Tools Section */}
      <section id="free-tools" className="relative">
        <FreeToolsSection />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative">
        <TestimonialsCarousel />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative">
        <FAQAccordion />
      </section>
    </>
  );
}
