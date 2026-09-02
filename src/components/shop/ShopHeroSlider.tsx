'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ChevronLeft, ChevronRight, ArrowRight, 
  ShieldCheck, CheckCircle2, ShoppingBag, Star, Eye
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
      highlightText: 'Yellow Sapphire (Pukhraj 5.25 Ratti)',
      subtitle: 'Unheated & untreated natural Ceylon sapphire energized with Vedic mantras for Jupiter strengthening, wealth, and career promotions.',
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
      badge: '📜 TRADITIONAL MANIPURI SCRIPTURES & KUTHI BOOKS',
      title: 'Authentic Meitei Astrology',
      highlightText: 'Handwritten Kuthi Puya',
      subtitle: 'Discover handwritten and printed Manipuri Meitei Puya, Jyotish books, and astrological guides directly from Kangleipak scholars.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Explore Astrological Scriptures',
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
      highlightText: '3D Shree Yantra (3x3 inch)',
      subtitle: 'Consecrated 3D Brass Shri Yantra for home altar & cash locker. Attracts Mahalakshmi grace, removes Vastu Dosh, and enhances business prosperity.',
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
      highlightText: 'Rudraksha Mala (108+1 Beads)',
      subtitle: 'Authentic 5 Mukhi Nepal Rudraksha rosary for meditation, mental calm, blood pressure balance, and Lord Shiva protection.',
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
    }, 6000);

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
      className="relative w-full rounded-3xl overflow-hidden border-2 border-[#b45309] shadow-2xl transition-all group bg-[#070d1e]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Gradient */}
      <div className={`bg-gradient-to-r ${currentSlide.bgColor || 'from-[#0b132b] via-[#1c2541] to-[#0b132b]'} text-white p-6 sm:p-10 lg:p-12 relative overflow-hidden transition-all duration-700`}>
        
        {/* Top Gold Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

        {/* Ambient Backlight Glows (SmartSlider3 Style) */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#f59e0b]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#b45309]/20 rounded-full blur-3xl pointer-events-none" />

        {/* MAIN SHOWCASE CONTENT (SPLIT LAYOUT) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-7xl mx-auto w-full my-auto pb-4">
          
          {/* LEFT: TEXT & BRANDING DETAILS */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Top Badge Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#b45309]/30 border border-[#fbbf24] text-[#fbbf24] text-xs font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{currentSlide.badge || '✨ AUTHENTIC MANIPURI & VEDIC STORE'}</span>
            </div>
            
            {/* Main Headline Title */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-tight">
                {currentSlide.title}
              </h1>
              {currentSlide.highlightText && (
                <div className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent">
                  {currentSlide.highlightText}
                </div>
              )}
            </div>

            {/* Subtitle / Description Paragraph */}
            <p className="text-slate-200 text-xs sm:text-sm lg:text-base font-serif italic max-w-2xl leading-relaxed">
              {currentSlide.subtitle}
            </p>

            {/* PRICE & RATING TAG (IF AVAILABLE) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 border border-[#fbbf24]/50 shadow-md">
                <span className="text-xs text-slate-400 font-bold uppercase">Price:</span>
                <span className="text-xl font-serif font-black text-[#fbbf24]">
                  {currentSlide.price || '₹6,999'}
                </span>
                {currentSlide.originalPrice && (
                  <span className="text-xs text-slate-500 line-through font-mono">
                    {currentSlide.originalPrice}
                  </span>
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{currentSlide.rating || 4.9} Rating (Verified Consecrated)</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href={currentSlide.ctaLink || '/shop'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-[#fbbf24]/40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{currentSlide.ctaText || 'Shop Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Browse All Products</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: FLOATING PRODUCT SHOWCASE (SMARTSLIDER3 STYLE) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative group/img max-w-[320px] sm:max-w-[360px] aspect-square rounded-3xl p-3 bg-gradient-to-b from-[#fbbf24]/30 via-transparent to-[#b45309]/30 border-2 border-[#fbbf24] shadow-2xl transition-all duration-500 hover:scale-105">
              
              {/* Product Image Box */}
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-950 relative shadow-inner">
                {currentSlide.image ? (
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover object-center group-hover/img:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">☀️</div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Floating Certification Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full bg-slate-950/90 text-[#fbbf24] border border-[#fbbf24]/80 text-[10px] font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
                    100% Lab Certified
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider px-3 py-1 bg-slate-900/90 rounded-xl border border-slate-700 shadow-md block truncate">
                    {currentSlide.title}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM PRODUCT THUMBNAIL SHOWCASE NAVIGATOR STRIP (SMARTSLIDER3 STYLE) */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col items-center space-y-3">
          <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
            <span>SHOWCASE CATALOG SLIDES ({activeSliders.length})</span>
          </div>

          <div className="flex items-center justify-center gap-3 overflow-x-auto max-w-full pb-2 scrollbar-none px-2">
            {activeSliders.map((slide, idx) => (
              <button
                key={slide.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl border transition-all text-left cursor-pointer shrink-0 ${
                  currentIndex === idx
                    ? 'bg-[#1c2541] border-[#fbbf24] shadow-lg scale-105 ring-2 ring-[#fbbf24]/50'
                    : 'bg-slate-900/60 border-slate-700/80 opacity-70 hover:opacity-100 hover:border-slate-500'
                }`}
              >
                {slide.image && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#fbbf24]/50 shrink-0 bg-slate-950">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[140px]">
                    {slide.title}
                  </h4>
                  <span className="text-[10px] text-[#fbbf24] font-mono font-bold block">
                    {slide.price || '₹6,999'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CHEVRON NAVIGATION BUTTONS */}
        {activeSliders.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-[#b45309] text-white border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-xl backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-[#b45309] text-white border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-xl backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

      </div>
    </div>
  );
}
