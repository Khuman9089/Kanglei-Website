'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ChevronLeft, ChevronRight, ArrowRight, 
  ShoppingBag, Star, ShieldCheck
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
      bgColor: 'from-[#0f172a] via-[#1e1b4b] to-[#0f172a]',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      accentColor: '#fbbf24',
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
      bgColor: 'from-[#1e1b4b] via-[#311b92] to-[#0f172a]',
      glowColor: 'rgba(168, 85, 247, 0.25)',
      accentColor: '#c084fc',
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
      bgColor: 'from-[#064e3b] via-[#14532d] to-[#0f172a]',
      glowColor: 'rgba(34, 197, 94, 0.25)',
      accentColor: '#4ade80',
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
      bgColor: 'from-[#450a0a] via-[#7f1d1d] to-[#0f172a]',
      glowColor: 'rgba(239, 68, 68, 0.25)',
      accentColor: '#f87171',
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
  const [progressKey, setProgressKey] = useState(0);

  const duration = 5000;

  // Auto-play timer reset on slide index change
  useEffect(() => {
    if (activeSliders.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSliders.length);
      setProgressKey((prev) => prev + 1);
    }, duration);

    return () => clearInterval(interval);
  }, [activeSliders.length, isPaused, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeSliders.length - 1 : prev - 1));
    setProgressKey((prev) => prev + 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSliders.length);
    setProgressKey((prev) => prev + 1);
  };

  const currentSlide = activeSliders[currentIndex] || activeSliders[0] || defaultSlides[0];

  const formattedIndex = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(activeSliders.length).padStart(2, '0');

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden border border-[#d97706]/40 shadow-2xl transition-all group bg-[#070d1e]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. LIQUID AMBIENT BACKGROUND GLOW BLOBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl transition-all duration-1000 opacity-60 animate-pulse"
          style={{ backgroundColor: (currentSlide as any).glowColor || 'rgba(245, 158, 11, 0.25)' }}
        />
        <div 
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl transition-all duration-1000 opacity-50"
          style={{ backgroundColor: (currentSlide as any).glowColor || 'rgba(245, 158, 11, 0.25)' }}
        />
        {/* Liquid Mesh Overlay Pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* TOP LIQUID GOLD GRADIENT ACCENT LINE */}
      <div className="absolute top-0 left-0 right-0 h-1 z-30 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24]" />

      {/* FIXED HEIGHT SLIDER CONTAINER */}
      <div className={`bg-gradient-to-r ${currentSlide.bgColor || 'from-[#0f172a] via-[#1e1b4b] to-[#0f172a]'} text-white px-5 sm:px-8 py-4 h-[250px] sm:h-[260px] md:h-[270px] flex flex-col justify-between relative overflow-hidden transition-colors duration-700 z-10`}>
        
        {/* TOP STATUS BAR: BADGE & SLIDE COUNTER */}
        <div className="flex items-center justify-between gap-4 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#fbbf24] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3 h-3 text-[#fbbf24] shrink-0" />
            <span>{currentSlide.badge || 'AUTHENTIC VEDIC E-STORE'}</span>
          </span>

          {/* WooCommerce Liquid Style Counter */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 bg-black/40 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
            <span className="text-[#fbbf24] font-black">{formattedIndex}</span>
            <span className="text-slate-500">/</span>
            <span>{formattedTotal}</span>
          </div>
        </div>

        {/* CENTER SLIDE CONTENT WITH ANIMATE PRESENCE */}
        <div className="relative z-20 my-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide.id || currentIndex}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center max-w-6xl mx-auto w-full"
            >
              {/* LEFT: TEXT DETAILS */}
              <div className="sm:col-span-8 space-y-2 text-center sm:text-left">
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-serif font-black text-white tracking-tight leading-tight line-clamp-1">
                  {currentSlide.title}{' '}
                  {currentSlide.highlightText && (
                    <span 
                      className="underline decoration-[#d97706] bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent"
                    >
                      {currentSlide.highlightText}
                    </span>
                  )}
                </h2>

                <p className="text-slate-200 text-xs sm:text-sm font-serif italic max-w-xl line-clamp-2 leading-relaxed">
                  {currentSlide.subtitle}
                </p>

                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <Link
                    href={currentSlide.ctaLink || '/shop'}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] hover:opacity-95 text-white font-extrabold text-xs shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{currentSlide.ctaText || 'Shop Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {currentSlide.price && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                      <span className="text-xs font-mono font-black text-[#fbbf24]">
                        {currentSlide.price}
                      </span>
                      {currentSlide.originalPrice && (
                        <span className="text-[11px] font-mono text-slate-400 line-through">
                          {currentSlide.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: FLOATING LIQUID SHOWCASE IMAGE */}
              {currentSlide.image && (
                <div className="sm:col-span-4 hidden sm:flex justify-end relative">
                  <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-3xl overflow-hidden border-2 border-[#fbbf24]/80 shadow-2xl bg-slate-950 shrink-0 transform hover:scale-105 transition-all group/img">
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      className="w-full h-full object-cover object-center group-hover/img:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Glass Reflection Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10 pointer-events-none" />

                    {/* Rating Badge */}
                    {currentSlide.rating && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 text-[#fbbf24] text-[10px] font-mono font-extrabold border border-amber-500/40 flex items-center gap-1 backdrop-blur-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{currentSlide.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM LIQUID CONTROL & PROGRESS BAR */}
        <div className="space-y-2 z-20">
          <div className="flex items-center justify-between">
            {/* CHEVRON NAV BUTTONS */}
            {activeSliders.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous Slide"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#d97706] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNext}
                  aria-label="Next Slide"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#d97706] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* DOT INDICATORS */}
            <div className="flex items-center justify-center gap-2 mx-auto">
              {activeSliders.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setProgressKey((prev) => prev + 1);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-7 bg-gradient-to-r from-[#d97706] to-[#fbbf24] shadow-sm'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {isPaused && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#fbbf24] bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                PAUSED
              </span>
            )}
          </div>

          {/* LIQUID AUTO-PLAY PROGRESS LINE */}
          {activeSliders.length > 1 && !isPaused && (
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                key={progressKey}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24]"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
