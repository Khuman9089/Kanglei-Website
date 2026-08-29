'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, CheckCircle2, Star, MessageCircle, Sparkles, Filter, Phone, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

interface AstrologerItem {
  id: string;
  name: string;
  badge: 'Celebrity' | 'Top Choice' | 'Master Guru' | 'Verified';
  avatar: string;
  specialties: string[];
  categoryTags: string[];
  languages: string;
  experienceYears: number;
  rating: number;
  consultationsCount: string;
  pricePerMin: number;
  whatsappPhone: string;
  bio: string;
  isTrending: boolean;
  active: boolean;
  online: boolean;
}

const CATEGORIES = ['All', 'Love', 'Education', 'Career', 'Marriage', 'Health', 'Wealth'];

export default function AstrologersDirectoryPage() {
  const [astrologers, setAstrologers] = useState<AstrologerItem[]>([]);
  const [settings, setSettings] = useState({
    title: "Talk to Manipur's",
    highlightText: "Top Rated",
    subtitleTagline: "Every astrologer below has cleared a 4-step verification — qualification, panel interview, live audits, and a 30-day probation.",
  });

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc' | 'experience'>('rating');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    fetch('/api/astrologers')
      .then((res) => res.json())
      .then((data) => {
        if (data.astrologers && Array.isArray(data.astrologers)) {
          setAstrologers(data.astrologers.filter((a: any) => a.active !== false));
        }
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error('Error fetching astrologers directory:', err));
  }, []);

  const handleStartChat = (astro: AstrologerItem) => {
    const msg = `🙏 Hello! I want to start a live consultation with ${astro.name} on KangleiAstro.`;
    const cleanPhone = astro.whatsappPhone ? astro.whatsappPhone.replace(/[^0-9]/g, '') : '919862099881';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filtered & Sorted Astrologers
  const filteredAstrologers = astrologers
    .filter((astro) => {
      const matchesSearch =
        astro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        astro.languages.toLowerCase().includes(searchQuery.toLowerCase()) ||
        astro.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        activeCategory === 'All' ||
        (astro.categoryTags && astro.categoryTags.includes(activeCategory)) ||
        astro.specialties.some((s) => s.toLowerCase().includes(activeCategory.toLowerCase()));

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'priceAsc') return a.pricePerMin - b.pricePerMin;
      if (sortBy === 'priceDesc') return b.pricePerMin - a.pricePerMin;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      return 0;
    });

  // Trending Astrologers for Sidebar
  const trendingAstrologers = astrologers.filter((a) => a.isTrending || a.rating >= 4.9).slice(0, 7);

  return (
    <div className="min-h-screen bg-[#fffdf5] text-[#0f172a] font-sans pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f172a] leading-tight">
            Talk to Manipur's <span className="text-[#c69214] font-serif">Top Rated</span> Astrologers
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-2 max-w-2xl">
            {settings.subtitleTagline}
          </p>
        </div>

        {/* Search Bar & Category Filter Controls Ribbon (Matching Reference Layout) */}
        <div className="bg-white p-4 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search name, skill, language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-50/70 border border-gray-200 text-xs font-semibold text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#c69214] focus:bg-white transition-all"
              />
            </div>

            {/* Sort Dropdown Button */}
            <div className="relative shrink-0 w-full md:w-auto">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="w-full md:w-auto px-5 py-2.5 rounded-full border border-gray-200 bg-gray-50/70 text-xs font-bold text-gray-700 flex items-center justify-between gap-2 hover:bg-white hover:border-[#c69214] transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#c69214]" />
                  <span>Sort</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#f3e8d2] shadow-xl z-20 overflow-hidden py-1 text-xs font-semibold">
                  <button
                    onClick={() => { setSortBy('rating'); setShowSortDropdown(false); }}
                    className={`w-full px-4 py-2 text-left hover:bg-[#fef3c7] ${sortBy === 'rating' ? 'text-[#b45309] font-bold' : 'text-gray-700'}`}
                  >
                    Rating (High to Low)
                  </button>
                  <button
                    onClick={() => { setSortBy('priceAsc'); setShowSortDropdown(false); }}
                    className={`w-full px-4 py-2 text-left hover:bg-[#fef3c7] ${sortBy === 'priceAsc' ? 'text-[#b45309] font-bold' : 'text-gray-700'}`}
                  >
                    Price (Low to High)
                  </button>
                  <button
                    onClick={() => { setSortBy('priceDesc'); setShowSortDropdown(false); }}
                    className={`w-full px-4 py-2 text-left hover:bg-[#fef3c7] ${sortBy === 'priceDesc' ? 'text-[#b45309] font-bold' : 'text-gray-700'}`}
                  >
                    Price (High to Low)
                  </button>
                  <button
                    onClick={() => { setSortBy('experience'); setShowSortDropdown(false); }}
                    className={`w-full px-4 py-2 text-left hover:bg-[#fef3c7] ${sortBy === 'experience' ? 'text-[#b45309] font-bold' : 'text-gray-700'}`}
                  >
                    Experience (Years)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter Pills (Horizontal Scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  activeCategory === cat
                    ? 'bg-[#c69214] text-white border-[#c69214] shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-[#c69214] hover:text-[#0f172a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ⚡ ASTROLOGER JYOTISH CALCULATOR TOOLS RIBBON */}
        <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#0b132b] p-6 rounded-3xl border border-[#3a506b] shadow-xl text-white space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#3a506b]/60 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#fbbf24] block">
                ✦ Astrologer Jyotish Workspace
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#faf8f4]">
                Astrologer Calculator & Horoscope Tools
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#d97706]/20 text-[#fbbf24] border border-[#d97706]/40 text-xs font-mono font-bold">
              ⚡ 5 New Tools Registered
            </span>
          </div>

          {/* 5 TOOL BUTTONS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
            
            {/* 1. Dasha Yengpham */}
            <button
              onClick={() => alert("📜 Dasha Yengpham (Vimshottari Dasha Details) Calculator Engine Button Active! Full natal dasha period calculations coming soon.")}
              className="p-3.5 rounded-2xl bg-[#0b132b] hover:bg-[#1e293b] border border-[#3a506b] hover:border-[#fbbf24] transition-all text-left group cursor-pointer shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                📜
              </div>
              <h4 className="font-bold text-xs text-white group-hover:text-[#fbbf24] transition-colors leading-snug">
                Dasha Yengpham
              </h4>
              <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                Get Vimshottari Dasha Details
              </p>
            </button>

            {/* 2. Shani Sade Sati */}
            <button
              onClick={() => alert("🪐 Shani Sade Sati Calculator Engine Button Active! Saturn 7.5 year transit phase analysis coming soon.")}
              className="p-3.5 rounded-2xl bg-[#0b132b] hover:bg-[#1e293b] border border-[#3a506b] hover:border-sky-400 transition-all text-left group cursor-pointer shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                🪐
              </div>
              <h4 className="font-bold text-xs text-white group-hover:text-sky-300 transition-colors leading-snug">
                Shani Sade Sati
              </h4>
              <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                Saturn 7.5 Yr Transit & Remedies
              </p>
            </button>

            {/* 3. Kaal Sarp Dosh */}
            <button
              onClick={() => alert("🐍 Kaal Sarp Dosh Calculator Engine Button Active! Rahu-Ketu axis containment analysis coming soon.")}
              className="p-3.5 rounded-2xl bg-[#0b132b] hover:bg-[#1e293b] border border-[#3a506b] hover:border-purple-400 transition-all text-left group cursor-pointer shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                🐍
              </div>
              <h4 className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors leading-snug">
                Kaal Sarp Dosh
              </h4>
              <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                Yoga Detection & Remedies
              </p>
            </button>

            {/* 4. Yoga Analysis */}
            <button
              onClick={() => alert("✨ Planetary Yogas Calculator Engine Button Active! Gajakesari, Raj & Dhana Yoga detection coming soon.")}
              className="p-3.5 rounded-2xl bg-[#0b132b] hover:bg-[#1e293b] border border-[#3a506b] hover:border-amber-300 transition-all text-left group cursor-pointer shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors leading-snug">
                Yoga Analysis
              </h4>
              <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                Major Vedic Yogas
              </p>
            </button>

            {/* 5. Match Making */}
            <button
              onClick={() => alert("💍 Match Making (Ashtakoot Gun Milan) Calculator Engine Button Active! 36-Gun marriage compatibility coming soon.")}
              className="p-3.5 rounded-2xl bg-[#0b132b] hover:bg-[#1e293b] border border-[#3a506b] hover:border-pink-400 transition-all text-left group cursor-pointer shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                💍
              </div>
              <h4 className="font-bold text-xs text-white group-hover:text-pink-300 transition-colors leading-snug">
                Match Making
              </h4>
              <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                36-Gun Ashtakoot Milan
              </p>
            </button>

            {/* 6. Kuthi Generator */}
            <Link
              href="/kundli"
              className="p-3.5 rounded-2xl bg-[#0b132b] hover:bg-[#1e293b] border border-[#3a506b] hover:border-[#d97706] transition-all text-left group cursor-pointer shadow-md block"
            >
              <div className="w-8 h-8 rounded-xl bg-[#d97706]/20 text-[#fbbf24] border border-[#d97706]/40 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h4 className="font-bold text-xs text-white group-hover:text-[#fbbf24] transition-colors leading-snug">
                Kuthi Generator
              </h4>
              <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                D1 Rashi & D9 Navamsha
              </p>
            </Link>

          </div>
        </div>

        {/* Main Content 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Astrologers Cards Grid (8 Cols on Desktop) */}
          <div className="lg:col-span-8 space-y-6">
            {filteredAstrologers.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-[#f3e8d2] text-center space-y-3">
                <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-[#0f172a]">No astrologers found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting your search query or category filter to discover empaneled astrologers.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="px-5 py-2 rounded-full bg-[#c69214] text-white font-bold text-xs shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAstrologers.map((astro, idx) => (
                  <motion.div
                    key={astro.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-5 rounded-3xl border border-[#f3e8d2] shadow-[0_10px_30px_rgba(217,119,6,0.04)] hover:shadow-xl hover:border-[#c69214] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Avatar & Badge */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 p-0.5 shadow-xs">
                            <img
                              src={astro.avatar}
                              alt={astro.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0 shadow-xs" />
                        </div>

                        {astro.badge && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] text-[10px] font-extrabold tracking-wider uppercase border border-[#fde68a]">
                            {astro.badge}
                          </span>
                        )}
                      </div>

                      {/* Name & Verified Check */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <h3 className="font-serif font-bold text-lg text-[#0f172a] group-hover:text-[#c69214] transition-colors">
                          {astro.name}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                      </div>

                      {/* Specialty Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {astro.specialties.map((spec, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200/60 text-[10px] font-semibold text-gray-700">
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Languages & Experience */}
                      <div className="text-xs text-gray-600 space-y-0.5 mb-3">
                        <div className="font-medium truncate">{astro.languages}</div>
                        <div className="font-bold text-gray-800">{astro.experienceYears} yrs exp</div>
                      </div>

                      {/* Rating & Rate Row */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 mb-4">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span className="font-extrabold text-[#0f172a]">{astro.rating.toFixed(1)}</span>
                          <span className="text-gray-400 text-[10px]">· {astro.consultationsCount}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-sm text-[#0f172a]">₹{astro.pricePerMin}</span>
                          <span className="text-[10px] text-gray-500 font-medium">/min</span>
                        </div>
                      </div>
                    </div>

                    {/* Chat Now Pill Button */}
                    <button
                      onClick={() => handleStartChat(astro)}
                      className="w-full py-2.5 px-4 rounded-full border border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs group-hover:bg-emerald-500 group-hover:text-white"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat now</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar: TRENDING NOW - Most consulted this week (4 Cols on Desktop) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b45309] block mb-1">
                  Trending Now
                </span>
                <h3 className="font-serif font-bold text-xl text-[#0f172a]">
                  Most consulted this week
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  The astrologers everyone is talking to right now.
                </p>
              </div>

              <div className="space-y-3.5">
                {trendingAstrologers.map((astro) => (
                  <div
                    key={astro.id}
                    className="p-3 rounded-2xl bg-[#faf8f5] border border-[#f3e8d2] hover:border-[#c69214] transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={astro.avatar}
                          alt={astro.name}
                          className="w-11 h-11 rounded-full object-cover border border-emerald-500 p-0.5"
                        />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white absolute bottom-0 right-0" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="font-serif font-bold text-sm text-[#0f172a] truncate group-hover:text-[#c69214] transition-colors">
                            {astro.name}
                          </h4>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                        </div>
                        <p className="text-[10px] text-gray-500 truncate font-medium">
                          {astro.specialties.slice(0, 2).join(' · ')}
                        </p>
                        <div className="text-[11px] text-[#b45309] font-bold font-mono mt-0.5">
                          ★ {astro.rating.toFixed(1)} · ₹{astro.pricePerMin}/min
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartChat(astro)}
                      className="px-3.5 py-1.5 rounded-full border border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-colors shrink-0"
                    >
                      Chat
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#f3e8d2]">
                <Link
                  href="/booking"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book Kuthi Yengba Session →</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
