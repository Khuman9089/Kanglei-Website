'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ChevronLeft, ChevronRight, ArrowRight, 
  ShieldCheck, CheckCircle2, ShoppingBag 
} from 'lucide-react';
import { ShopSliderItem } from '@/app/api/shop/route';

interface ShopHeroSliderProps {
  sliders: ShopSliderItem[];
}

export default function ShopHeroSlider({ sliders }: ShopHeroSliderProps) {
  const activeSliders = (sliders && sliders.length > 0)
    ? sliders.filter((s) => s.active)
    : [
        {
          id: 'default-1',
          badge: '✨ AUTHENTIC MANIPURI & VEDIC CONSECRATED STORE',
          title: 'Sacred Vedic Remedies &',
          highlightText: 'Lab-Certified Gemstones',
          subtitle: 'Explore 100% genuine Ceylon Yellow Sapphires, traditional Kuthi reading books, 24k gold Shree Yantras, and Nepali Rudraksha beads consecrated by Master Pandits.',
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
          ctaText: 'Shop Consecrated Gemstones',
          ctaLink: '/shop',
          bgColor: 'from-[#0b132b] via-[#1c2541] to-[#0b132b]',
          active: true,
          displayOrder: 1,
        },
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play interval
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

  const currentSlide = activeSliders[currentIndex] || activeSliders[0];

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden border-2 border-[#b45309] shadow-2xl transition-all group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Gradient */}
      <div className={`bg-gradient-to-r ${currentSlide.bgColor || 'from-[#0b132b] via-[#1c2541] to-[#0b132b]'} text-white p-6 sm:p-10 lg:p-12 relative overflow-hidden transition-all duration-700 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between`}>
        
        {/* Top Gold Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

        {/* Decorative Background Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#b45309]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#f59e0b]/15 rounded-full blur-3xl pointer-events-none" />

        {/* SLIDE CONTENT */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto w-full my-auto">
          
          {/* LEFT: TEXT CONTENT */}
          <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#b45309]/30 border border-[#fbbf24] text-[#fbbf24] text-xs font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-sm animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] shrink-0" />
              <span>{currentSlide.badge || 'AUTHENTIC MANIPURI & VEDIC CONSECRATED STORE'}</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight leading-tight">
              {currentSlide.title}{' '}
              {currentSlide.highlightText && (
                <span className="text-[#fbbf24] underline decoration-[#b45309] underline-offset-4 block sm:inline">
                  {currentSlide.highlightText}
                </span>
              )}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-slate-200 text-xs sm:text-sm lg:text-base font-serif italic max-w-2xl leading-relaxed">
              {currentSlide.subtitle}
            </p>

            {/* CTA Button */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href={currentSlide.ctaLink || '/shop'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{currentSlide.ctaText || 'Shop Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* RIGHT: FEATURED IMAGE PREVIEW */}
          {currentSlide.image && (
            <div className="lg:col-span-4 hidden lg:flex items-center justify-center">
              <div className="relative group/img max-w-[260px] aspect-square rounded-2xl overflow-hidden border-4 border-[#facc15]/80 shadow-2xl bg-slate-900 transform hover:scale-105 transition-transform duration-500">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center group-hover/img:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="text-[11px] font-black text-[#fbbf24] uppercase tracking-wider px-2.5 py-1 bg-slate-900/90 rounded-md border border-[#fbbf24]/50 shadow-md">
                    Featured Product
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* TRUST BADGES BAR */}
        <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#fbbf24] shrink-0" />
            <span>100% Lab Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pran Pratishta Energized</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-[#fbbf24] shrink-0" />
            <span>Free Nationwide Delivery ₹499+</span>
          </div>
        </div>

        {/* NAVIGATION ARROWS (ONLY SHOW IF > 1 SLIDE) */}
        {activeSliders.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-[#b45309] text-white border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-[#b45309] text-white border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* PAGINATION DOTS */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {activeSliders.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-[#fbbf24] shadow-md'
                      : 'w-2 bg-white/40 hover:bg-white/70'
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
