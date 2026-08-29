import HeroSection from '@/components/home/HeroSection';
import TrustPillars from '@/components/home/TrustPillars';
import TopAstrologersSection from '@/components/home/TopAstrologersSection';
import FeaturedServices from '@/components/home/FeaturedServices';
import FeaturedShopSection from '@/components/home/FeaturedShopSection';
import ZodiacGrid from '@/components/home/ZodiacGrid';
import FreeToolsSection from '@/components/home/FreeToolsSection';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import FAQAccordion from '@/components/home/FAQAccordion';

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
