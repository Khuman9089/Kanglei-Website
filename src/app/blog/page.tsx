'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Calendar, Clock, User, Sparkles, ArrowRight, Tag, 
  Heart, Eye, Bookmark, Share2, Compass, ShieldCheck, Sun, Moon, Flame, CheckCircle2, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime: string;
  publishedAt: string;
  views: number;
  likes: number;
  isFeatured?: boolean;
  status: 'PUBLISHED' | 'DRAFT';
}

const ZODIAC_SIGNS = [
  'Aries (Mesh)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)', 'Cancer (Karka)',
  'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrischika)',
  'Sagittarius (Dhanu)', 'Capricorn (Makara)', 'Aquarius (Kumbha)', 'Pisces (Meena)'
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export default function BlogDirectoryPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeToolTab, setActiveToolTab] = useState<'rashifal' | 'sadesati' | 'matching' | 'gemstone'>('rashifal');

  // Tool 1: Daily Rashifal Widget State
  const [selectedSign, setSelectedSign] = useState(ZODIAC_SIGNS[0]);
  
  // Tool 2: Sade Sati Widget State
  const [sadeSatiSign, setSadeSatiSign] = useState(ZODIAC_SIGNS[0]);
  
  // Tool 3: Quick Matching Widget State
  const [boyNak, setBoyNak] = useState(NAKSHATRAS[0]);
  const [girlNak, setGirlNak] = useState(NAKSHATRAS[3]);

  // Tool 4: Gemstone Quiz State
  const [lifeGoal, setLifeGoal] = useState<'career' | 'wealth' | 'marriage' | 'health'>('career');

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts.filter((p: BlogPost) => p.status === 'PUBLISHED'));
        }
      })
      .catch((err) => console.error('Error fetching blog posts:', err));
  }, []);

  const handleLikePost = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LIKE', id }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, likes: data.likes } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#faf8f4] flex flex-col font-sans antialiased">
      <main className="flex-1 pt-4 sm:pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        
        {/* ─────────────────────────────────────────────────────────────
           1. HERO & FEATURED SPOTLIGHT ARTICLE BANNER (Royal Vedic Theme)
           ───────────────────────────────────────────────────────────── */}
        <section className="pt-2">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7]/10 border border-[#fbbf24]/30 text-[#fbbf24] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-[#fbbf24]" />
              Sacred Vedic Knowledge & Predictive Astrological Insights
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight">
              KangleiAstro <span className="text-[#fbbf24]">Vedic Journal</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-3 max-w-2xl mx-auto">
              Explore deep insights on planetary transits, Sade Sati remedies, Ashtakoot marriage compatibility, and traditional Kuthi Yengba charts.
            </p>
          </div>

          {/* Featured Spotlight Hero Card */}
          {featuredPost && (
            <div className="relative rounded-3xl bg-gradient-to-r from-[#1c2541] via-[#0f172a] to-[#0b132b] border border-[#3a506b]/60 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch">
              <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-between space-y-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
                      🌟 FEATURED ARTICLE
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#0b132b] text-[#fbbf24] font-bold text-[10px] uppercase border border-[#3a506b]">
                      {featuredPost.category}
                    </span>
                  </div>

                  <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight mb-4 hover:text-[#fbbf24] transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#3a506b]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d97706] text-white font-bold text-sm flex items-center justify-center border border-[#fbbf24]/40">
                      {featuredPost.author.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">{featuredPost.author}</span>
                      <span className="text-[10px] text-[#fbbf24] font-mono block">{featuredPost.readTime} • {featuredPost.publishedAt}</span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center gap-2"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Visual Graphic Banner */}
              <div className="lg:w-1/2 min-h-[300px] bg-cover bg-center relative" style={{ backgroundImage: `url(${featuredPost.coverImage})` }}>
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0f172a] via-transparent to-transparent opacity-90" />
              </div>
            </div>
          )}
        </section>

        {/* ─────────────────────────────────────────────────────────────
           2. INTERACTIVE ASTROLOGY WIDGET TOOLS HUB
           ───────────────────────────────────────────────────────────── */}
        <section className="bg-[#1c2541] rounded-3xl border border-[#3a506b]/60 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3a506b]/40">
            <div>
              <span className="text-[10px] font-bold text-[#fbbf24] uppercase tracking-wider block">
                ⚡ Free Astrological Predictor Tools
              </span>
              <h3 className="font-serif font-bold text-2xl text-white">Instant Vedic Reading Calculators</h3>
            </div>

            {/* Widget Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveToolTab('rashifal')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeToolTab === 'rashifal'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                    : 'bg-[#0b132b] text-gray-300 hover:text-white border border-[#3a506b]'
                }`}
              >
                <Sun className="w-4 h-4 text-[#fbbf24]" />
                <span>Daily Rashifal</span>
              </button>

              <button
                onClick={() => setActiveToolTab('sadesati')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeToolTab === 'sadesati'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                    : 'bg-[#0b132b] text-gray-300 hover:text-white border border-[#3a506b]'
                }`}
              >
                <Moon className="w-4 h-4 text-[#fbbf24]" />
                <span>Sade Sati Checker</span>
              </button>

              <button
                onClick={() => setActiveToolTab('matching')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeToolTab === 'matching'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                    : 'bg-[#0b132b] text-gray-300 hover:text-white border border-[#3a506b]'
                }`}
              >
                <Compass className="w-4 h-4 text-[#fbbf24]" />
                <span>36-Gun Estimator</span>
              </button>

              <button
                onClick={() => setActiveToolTab('gemstone')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeToolTab === 'gemstone'
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                    : 'bg-[#0b132b] text-gray-300 hover:text-white border border-[#3a506b]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                <span>Gemstone Finder</span>
              </button>
            </div>
          </div>

          {/* WIDGET TOOL CONTENT PANELS */}
          <div className="bg-[#0b132b] p-6 rounded-2xl border border-[#3a506b]/50">
            
            {/* Tool 1: Daily Rashifal */}
            {activeToolTab === 'rashifal' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#fbbf24]">Select Your Moon Sign (Rashi)</h4>
                    <p className="text-xs text-gray-400">Get today's Transit forecast for your Moon sign</p>
                  </div>
                  <select
                    value={selectedSign}
                    onChange={(e) => setSelectedSign(e.target.value)}
                    className="py-2.5 px-4 rounded-xl bg-[#1c2541] border border-[#3a506b] text-xs font-bold text-white focus:border-[#d97706] focus:outline-none"
                  >
                    {ZODIAC_SIGNS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="p-5 rounded-2xl bg-[#1c2541] border border-[#3a506b]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#fbbf24]">{selectedSign} Daily Forecast</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-300 text-[10px] font-bold border border-green-500/30">
                      ★ 4.8 / 5 Planetary Harmony
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Moon transit in favorable aspect with Jupiter enhances career clarity and financial intuition today. Favorable windows for important discussions between 10:30 AM and 2:15 PM IST.
                  </p>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-gray-300 pt-2 border-t border-[#3a506b]/40">
                    <span>Lucky Color: <strong>Amber Gold</strong></span>
                    <span>•</span>
                    <span>Lucky Number: <strong>7</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Tool 2: Sade Sati Status Checker */}
            {activeToolTab === 'sadesati' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#fbbf24]">Saturn Sade Sati Calculator</h4>
                    <p className="text-xs text-gray-400">Check if your Moon sign is experiencing Saturn Sade Sati</p>
                  </div>
                  <select
                    value={sadeSatiSign}
                    onChange={(e) => setSadeSatiSign(e.target.value)}
                    className="py-2.5 px-4 rounded-xl bg-[#1c2541] border border-[#3a506b] text-xs font-bold text-white focus:border-[#d97706] focus:outline-none"
                  >
                    {ZODIAC_SIGNS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="p-5 rounded-2xl bg-[#1c2541] border border-[#3a506b]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#fbbf24]">Sade Sati Status: {sadeSatiSign.split(' ')[0]}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      Rising Phase Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Saturn is transiting near your Moon sign. Focus on discipline, charity on Saturdays, and Hanuman Chalisa recitation to smooth financial turbulence.
                  </p>
                  <Link href="/booking" className="inline-flex items-center gap-1 text-xs font-bold text-[#fbbf24] hover:underline pt-1">
                    <span>Order In-depth Sade Sati Kuthi Reading →</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Tool 3: Ashtakoot Matching Calculator */}
            {activeToolTab === 'matching' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#e0a96d] mb-1">Groom Nakshatra</label>
                    <select
                      value={boyNak}
                      onChange={(e) => setBoyNak(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-[#1c2541] border border-[#3a506b] text-xs font-bold text-white"
                    >
                      {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#e0a96d] mb-1">Bride Nakshatra</label>
                    <select
                      value={girlNak}
                      onChange={(e) => setGirlNak(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-[#1c2541] border border-[#3a506b] text-xs font-bold text-white"
                    >
                      {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#1c2541] border border-[#3a506b]/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Ashtakoot Score Estimate</span>
                    <span className="text-2xl font-black text-[#fbbf24]">28 / 36 Gunas</span>
                    <span className="text-[10px] text-green-400 font-bold block mt-0.5">High Marriage Compatibility</span>
                  </div>
                  <Link href="/matching" className="px-4 py-2 rounded-xl bg-[#d97706] text-white text-xs font-bold">
                    Full Match Analysis →
                  </Link>
                </div>
              </div>
            )}

            {/* Tool 4: Gemstone Finder Quiz */}
            {activeToolTab === 'gemstone' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif font-bold text-lg text-[#fbbf24]">Primary Life Focus & Goal</h4>
                  <div className="flex gap-2">
                    {(['career', 'wealth', 'marriage', 'health'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setLifeGoal(g)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${
                          lifeGoal === g ? 'bg-[#d97706] text-white' : 'bg-[#1c2541] text-gray-400'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#1c2541] border border-[#3a506b]/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Recommended Gemstone</span>
                    <span className="text-xl font-bold text-[#fbbf24]">
                      {lifeGoal === 'career' && 'Yellow Sapphire (Pukhraj) / Ruby'}
                      {lifeGoal === 'wealth' && 'Emerald (Panna) / Diamond'}
                      {lifeGoal === 'marriage' && 'Coral (Moonga) / Pearl'}
                      {lifeGoal === 'health' && 'Blue Sapphire (Neelam)'}
                    </span>
                    <span className="text-[10px] text-slate-300 block mt-0.5">Enhances ruling Lagna lord for peak success</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           3. SEARCH & CATEGORY FILTERING SYSTEM
           ───────────────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles on transits, remedies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-[#3a506b] bg-[#1c2541] text-xs font-medium text-white placeholder-gray-400 focus:border-[#d97706] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                      : 'bg-[#1c2541] text-gray-300 hover:text-white border border-[#3a506b]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 4. ARTICLE GRID CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-[#1c2541] rounded-3xl border border-[#3a506b]/50 shadow-md hover:border-[#d97706] transition-all hover:-translate-y-1 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Header with Badge Overlay */}
                <div className="h-52 bg-cover bg-center relative" style={{ backgroundImage: `url(${post.coverImage})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c2541] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#0b132b]/80 backdrop-blur-xs text-[#fbbf24] text-[10px] font-extrabold uppercase border border-[#3a506b]">
                      {post.category}
                    </span>

                    <button
                      onClick={(e) => handleLikePost(e, post.id)}
                      className="px-2.5 py-1 rounded-full bg-[#0b132b]/80 backdrop-blur-xs text-red-400 text-[10px] font-bold flex items-center gap-1 border border-[#3a506b] hover:scale-105 transition-transform"
                    >
                      <Heart className="w-3 h-3 fill-red-400" />
                      <span>{post.likes}</span>
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white mb-2 leading-snug group-hover:text-[#fbbf24] transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#3a506b]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#d97706] text-white flex items-center justify-center font-bold text-xs">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block truncate">{post.author}</span>
                        <span className="text-[9px] text-[#fbbf24] block">{post.readTime}</span>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#fbbf24] hover:underline"
                    >
                      <span>Read →</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
