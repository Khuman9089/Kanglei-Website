'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ChevronLeft, ChevronRight, ArrowRight, 
  ShoppingBag, Star, Eye
} from 'lucide-react';
import { ShopSliderItem } from '@/app/api/shop/route';

interface ShopHeroSliderProps {
  sliders: ShopSliderItem[];
}

export default function ShopHeroSlider({ sliders }: ShopHeroSliderProps) {
  const defaultSlides = [
    {
      id: 'showcase-1',
      badge: '✨ LAB-CERTIFIED CONSECRATED GEMSTONE',
      title: 'Natural Ceylon',
      highlightText: 'Yellow Sapphire (Pukhraj)',
      subtitle: 'Unheated & untreated natural Ceylon sapphire energized with Vedic mantras for Jupiter strengthening and wealth.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Buy Certified Pukhraj',
      ctaLink: '/shop?category=Gemstones',
      bgColor: 'from-[#0b132b] via-[#1c2541] to-[#0b132b]',
      active: true,
      displayOrder: 1,
      price: '₹6,999',
      originalPrice: '₹8,999',
      rating: 4.9,
    },
    {
      id: 'showcase-2',
      badge: '📜 TRADITIONAL MANIPURI SCRIPTURES',
      title: 'Authentic Meitei Astrology',
      highlightText: 'Kuthi Puya Books',
      subtitle: 'Original Kangleipak Jyotish scriptures and handwritten Kuthi guides directly from Meitei astrology scholars.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Explore Scriptures',
      ctaLink: '/shop?category=Astrology%20Books',
      bgColor: 'from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]',
      active: true,
      displayOrder: 2,
      price: '₹1,499',
      originalPrice: '₹1,999',
      rating: 5.0,
    },
    {
      id: 'showcase-3',
      badge: '📿 PANDIT BLESSED 24K GOLD YANTRA',
      title: 'Energized Heavy Brass',
      highlightText: '3D Shree Yantra (3x3")',
      subtitle: 'Consecrated 3D Brass Shri Yantra for home altar & cash locker. Attracts Mahalakshmi grace and removes Vastu Dosh.',
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Buy Consecrated Yantra',
      ctaLink: '/shop?category=Yantras%20%26%20Mala',
      bgColor: 'from-[#14532d] via-[#166534] to-[#064e3b]',
      active: true,
      displayOrder: 3,
      price: '₹1,299',
      originalPrice: '₹1,999',
      rating: 4.8,
    },
    {
      id: 'showcase-4',
      badge: '🌿 100% ORIGINAL NEPALESE BEADS',
      title: 'Natural 5 Mukhi Nepal',
      highlightText: 'Rudraksha Mala (108+1)',
      subtitle: 'Authentic 5 Mukhi Nepal Rudraksha rosary for meditation, mental calm, BP balance, and Lord Shiva protection.',
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Buy Original Rudraksha',
      ctaLink: '/shop?category=Yantras%20%26%20Mala',
      bgColor: 'from-[#450a0a] via-[#7f1d1d] to-[#450a0a]',
      active: true,
      displayOrder: 4,
      price: '₹999',
      originalPrice: '₹1,499',
      rating: 4.9,
    },
  ];

  const activeSliders = (sliders && sliders.length > 0)
    ? sliders.filter((s) => s.active)
    : defaultSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play timer
  useEffect(() => {
    if (activeSliders.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSliders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSliders.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeSliders.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSliders.length);
  };

  const currentSlide = activeSliders[currentIndex] || activeSliders[0] || defaultSlides[0];

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden border border-[#b45309]/80 shadow-lg transition-all group bg-[#070d1e]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Short Compact Background Gradient */}
      <div className={`bg-gradient-to-r ${currentSlide.bgColor || 'from-[#0b132b] via-[#1c2541] to-[#0b132b]'} text-white px-4 py-4 sm:px-8 sm:py-6 relative overflow-hidden transition-all duration-500`}>
        
        {/* Top Gold Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

        {/* COMPACT SHOWCASE CONTENT */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center max-w-6xl mx-auto w-full">
          
          {/* LEFT: TEXT DETAILS */}
          <div className="sm:col-span-8 space-y-2 text-center sm:text-left">
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#b45309]/40 border border-[#fbbf24] text-[#fbbf24] text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#fbbf24] shrink-0" />
                <span>{currentSlide.badge || 'AUTHENTIC MANIPURI & VEDIC STORE'}</span>
              </span>

              {currentSlide.price && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-[#fbbf24]/60 text-[#fbbf24] text-xs font-mono font-extrabold">
                  {currentSlide.price}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl lg:text-3xl font-serif font-black text-white tracking-tight leading-snug">
              {currentSlide.title}{' '}
              {currentSlide.highlightText && (
                <span className="text-[#fbbf24] underline decoration-[#b45309]">
                  {currentSlide.highlightText}
                </span>
              )}
            </h2>

            <p className="text-slate-200 text-xs font-serif italic max-w-xl line-clamp-2 leading-relaxed">
              {currentSlide.subtitle}
            </p>

            <div className="pt-1 flex items-center justify-center sm:justify-start gap-3">
              <Link
                href={currentSlide.ctaLink || '/shop'}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:opacity-95 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{currentSlide.ctaText || 'Shop Now'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT: COMPACT PRODUCT THUMBNAIL */}
          {currentSlide.image && (
            <div className="sm:col-span-4 hidden sm:flex justify-end">
              <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden border-2 border-[#fbbf24] shadow-xl bg-slate-950 shrink-0 transform hover:scale-105 transition-transform">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          )}

        </div>

        {/* CHEVRON BUTTONS */}
        {activeSliders.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-[#b45309] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer opacity-70 group-hover:opacity-100 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-[#b45309] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer opacity-70 group-hover:opacity-100 shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* DOT INDICATORS */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {activeSliders.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-[#fbbf24]'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
