'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, Clock, User, Sparkles, ArrowRight, Tag, 
  Heart, Eye, Bookmark, Share2, Compass, ShieldCheck, Sun, Moon, 
  Flame, CheckCircle2, TrendingUp, BookOpen, MessageCircle, ChevronRight,
  Filter, Newspaper
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
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'liked'>('latest');
  const [activeToolTab, setActiveToolTab] = useState<'rashifal' | 'sadesati' | 'matching' | 'gemstone'>('rashifal');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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
    fetch('/api/blog?t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && Array.isArray(data.posts)) {
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];

  const filteredPosts = posts
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.views - a.views;
      if (sortBy === 'liked') return b.likes - a.likes;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  const trendingPosts = [...posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fffdf5] text-[#0f172a] font-sans antialiased selection:bg-[#fde68a] selection:text-[#b45309]">
      
      {/* ─────────────────────────────────────────────────────────────
         1. TOP EDITORIAL MASTHEAD (WordPress Style Newspaper Header)
         ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-[#f3e8d2] bg-[#fffdfa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-gray-500 border-b border-gray-100 pb-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#b45309] uppercase tracking-wider flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5" />
                The Kanglei Vedic Journal
              </span>
              <span className="text-gray-300">|</span>
              <span>Authentic Jyotish & Planetary Wisdom</span>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-gray-300">|</span>
              <Link href="/astrologers" className="hover:text-[#b45309] transition-colors font-bold text-[#b45309]">
                Live Astrologers →
              </Link>
            </div>
          </div>

          <div className="py-6 sm:py-8 text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-[10px] font-extrabold uppercase tracking-widest shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#d97706]" />
              Sacred Predictive Knowledge
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#0f172a] tracking-tight leading-tight">
              KangleiAstro <span className="text-[#c69214] font-serif">Vedic Journal</span>
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Explore in-depth articles on planetary transits, Saturn Sade Sati remedies, 36-Gun Ashtakoot marriage matching, and authentic Manipuri Kuthi Yengba guidance.
            </p>
          </div>

          {/* Categories Pill Navigation Bar */}
          <div className="flex items-center justify-between gap-4 pt-2 pb-1 overflow-x-auto no-scrollbar border-t border-[#f3e8d2]">
            <div className="flex items-center gap-1.5 shrink-0 py-1">
              {categories.map((cat) => {
                const count = cat === 'All' ? posts.length : posts.filter((p) => p.category === cat).length;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#c69214] text-white shadow-xs'
                        : 'bg-white border border-[#f3e8d2] text-gray-700 hover:border-[#c69214] hover:text-[#b45309]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-gray-500 font-medium hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold text-[#0f172a] bg-white border border-[#f3e8d2] rounded-full px-3 py-1.5 focus:outline-none focus:border-[#c69214] cursor-pointer"
              >
                <option value="latest">Latest Stories</option>
                <option value="popular">Most Read</option>
                <option value="liked">Most Liked</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
         2. MAIN EDITORIAL CONTENT (Wordpress 2-Column Standard)
         ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">

        {/* FEATURED STORY HERO (Magazine Cover Lead) */}
        {featuredPost && (
          <section className="bg-white rounded-3xl border border-[#f3e8d2] p-5 sm:p-7 shadow-[0_4px_20px_rgba(217,119,6,0.04)] hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Cover Image with Zoom Effect */}
              <div className="lg:col-span-7 overflow-hidden rounded-2xl relative aspect-[16/10] bg-gray-100 group">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#d97706] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    🌟 Featured Cover Story
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#b45309] text-[10px] font-bold uppercase border border-[#fde68a]">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              {/* Cover Content */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#c69214]" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#c69214]" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0f172a] leading-tight hover:text-[#c69214] transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                {/* Author & Action Row */}
                <div className="pt-4 border-t border-[#f3e8d2] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500 p-0.5 bg-white shrink-0">
                      <img
                        src={featuredPost.authorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80'}
                        alt={featuredPost.author}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#0f172a] flex items-center gap-1">
                        {featuredPost.author}
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      </span>
                      <span className="text-[10px] text-gray-500 block">{featuredPost.authorRole || 'Senior Astrologer'}</span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-xs hover:opacity-95 transition-opacity flex items-center gap-1.5"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
           3. MAIN 2-COLUMN EDITORIAL GRID: ARTICLES FEED + SIDEBAR
           ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: ARTICLE ARCHIVES */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Search Box & Controls Ribbon */}
            <div className="bg-white p-4 rounded-2xl border border-[#f3e8d2] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles on transits, remedies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-[#fefcf6] text-xs font-medium text-[#0f172a] placeholder-gray-400 focus:border-[#c69214] focus:outline-none"
                />
              </div>

              <span className="text-xs text-gray-500 font-medium self-end sm:self-center">
                Showing <strong className="text-[#0f172a]">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
              </span>
            </div>

            {/* Articles Grid (2-Column Cards) */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#f3e8d2] p-12 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-[#0f172a]">No articles match your search</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting your search terms or select another category from the menu above.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  className="px-4 py-2 rounded-full bg-[#fef3c7] text-[#b45309] font-bold text-xs border border-[#fde68a] hover:bg-[#fde68a] transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl border border-[#f3e8d2] shadow-[0_4px_20px_rgba(217,119,6,0.03)] hover:shadow-lg hover:border-[#c69214] transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Image Header with Badge Overlay */}
                      <div className="aspect-[16/10] overflow-hidden relative bg-gray-100">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#b45309] text-[10px] font-extrabold uppercase border border-[#fde68a] shadow-xs">
                            {post.category}
                          </span>

                          <button
                            onClick={(e) => handleLikePost(e, post.id)}
                            className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-rose-500 text-[10px] font-bold flex items-center gap-1 border border-rose-100 hover:scale-105 transition-transform shadow-xs cursor-pointer"
                            title="Like article"
                          >
                            <Heart className="w-3 h-3 fill-rose-500" />
                            <span>{post.likes}</span>
                          </button>
                        </div>
                      </div>

                      {/* Post Body */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                          <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>

                        <h3 className="font-serif font-bold text-lg text-[#0f172a] leading-snug group-hover:text-[#c69214] transition-colors line-clamp-2">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="p-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#fef3c7] text-[#b45309] border border-[#fde68a] flex items-center justify-center font-bold text-xs shrink-0">
                          {post.author.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-800 truncate max-w-[120px]">{post.author}</span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#b45309] hover:text-[#d97706] transition-colors"
                      >
                        <span>Read Story</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* MID-PAGE NEWSLETTER SUBSCRIPTION BANNER */}
            <div className="rounded-3xl bg-gradient-to-br from-[#fef3c7] via-[#fffbeb] to-[#fde68a]/50 p-7 md:p-8 border border-[#fde68a] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-md">
                <span className="px-3 py-1 rounded-full bg-[#d97706] text-white text-[10px] font-extrabold uppercase tracking-wider inline-block">
                  📧 Weekly Vedic Dispatch
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#0f172a]">
                  Receive Auspicious Muhurat & Transits Weekly
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Join 15,000+ readers across Manipur. Deep astrological forecasts, festival timings, and planetary remedies delivered to your inbox every Sunday.
                </p>
              </div>

              {subscribed ? (
                <div className="p-4 rounded-2xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>🙏 Blessed to have you! You are now subscribed to the weekly dispatch.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="px-4 py-2.5 rounded-full bg-white border border-[#fde68a] text-xs font-medium text-[#0f172a] placeholder-gray-400 focus:outline-none focus:border-[#d97706] min-w-[240px]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-xs hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    Subscribe Free
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: EDITORIAL STICKY SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* SIDEBAR WIDGET 1: TRENDING & MOST POPULAR STORIES */}
            <div className="bg-white rounded-3xl border border-[#f3e8d2] p-6 shadow-xs space-y-5">
              <div className="border-b border-[#f3e8d2] pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b45309] block mb-0.5">
                  Popular Reads
                </span>
                <h3 className="font-serif font-bold text-xl text-[#0f172a]">
                  Trending Astrological Guides
                </h3>
              </div>

              <div className="space-y-4">
                {trendingPosts.map((post, idx) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="flex items-start gap-3 group p-2 rounded-2xl hover:bg-[#fffdfa] transition-colors"
                  >
                    <span className="font-serif font-extrabold text-2xl text-[#c69214]/60 group-hover:text-[#c69214] transition-colors shrink-0 w-7">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <span className="text-[10px] font-bold text-[#b45309] uppercase block">{post.category}</span>
                      <h4 className="font-serif font-bold text-xs text-[#0f172a] group-hover:text-[#c69214] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono block">
                        {post.views.toLocaleString()} reads • {post.readTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* SIDEBAR WIDGET 2: INTERACTIVE VEDIC CALCULATOR TOOLS HUB */}
            <div className="bg-white rounded-3xl border border-[#f3e8d2] p-6 shadow-xs space-y-4">
              <div className="border-b border-[#f3e8d2] pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b45309] block mb-0.5">
                  Free Vedic Calculators
                </span>
                <h3 className="font-serif font-bold text-lg text-[#0f172a]">
                  Instant Astro Predictors
                </h3>
              </div>

              {/* Tool Tabs Segmented Control */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#fffdf5] rounded-xl border border-[#f3e8d2]">
                <button
                  onClick={() => setActiveToolTab('rashifal')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeToolTab === 'rashifal'
                      ? 'bg-white text-[#b45309] shadow-xs border border-[#fde68a]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sun className="w-3 h-3 text-[#d97706]" />
                  <span>Rashifal</span>
                </button>

                <button
                  onClick={() => setActiveToolTab('sadesati')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeToolTab === 'sadesati'
                      ? 'bg-white text-[#b45309] shadow-xs border border-[#fde68a]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Moon className="w-3 h-3 text-[#d97706]" />
                  <span>Sade Sati</span>
                </button>

                <button
                  onClick={() => setActiveToolTab('matching')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeToolTab === 'matching'
                      ? 'bg-white text-[#b45309] shadow-xs border border-[#fde68a]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Compass className="w-3 h-3 text-[#d97706]" />
                  <span>Gun Milan</span>
                </button>

                <button
                  onClick={() => setActiveToolTab('gemstone')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeToolTab === 'gemstone'
                      ? 'bg-white text-[#b45309] shadow-xs border border-[#fde68a]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#d97706]" />
                  <span>Gemstone</span>
                </button>
              </div>

              {/* TOOL 1: DAILY RASHIFAL */}
              {activeToolTab === 'rashifal' && (
                <div className="space-y-3 pt-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">Select Your Moon Sign (Rashi)</label>
                  <select
                    value={selectedSign}
                    onChange={(e) => setSelectedSign(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-[#fffdf5] border border-[#f3e8d2] text-xs font-bold text-[#0f172a] focus:border-[#d97706] focus:outline-none cursor-pointer"
                  >
                    {ZODIAC_SIGNS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <div className="p-3.5 rounded-2xl bg-[#fffdfa] border border-[#fde68a] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#b45309]">{selectedSign.split(' ')[0]} Transit</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        ★ Favorable
                      </span>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">
                      Moon aspect with benefic Jupiter yields heightened career clarity and auspicious timings between 10:30 AM & 2:15 PM IST.
                    </p>
                    <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-gray-500">
                      <span>Color: <strong>Amber</strong></span>
                      <span>Number: <strong>7</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* TOOL 2: SADE SATI CHECKER */}
              {activeToolTab === 'sadesati' && (
                <div className="space-y-3 pt-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">Saturn Sade Sati Calculator</label>
                  <select
                    value={sadeSatiSign}
                    onChange={(e) => setSadeSatiSign(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-[#fffdf5] border border-[#f3e8d2] text-xs font-bold text-[#0f172a] focus:border-[#d97706] focus:outline-none cursor-pointer"
                  >
                    {ZODIAC_SIGNS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <div className="p-3.5 rounded-2xl bg-[#fffdfa] border border-[#fde68a] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#b45309]">{sadeSatiSign.split(' ')[0]} Phase</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                        Rising Influence
                      </span>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">
                      Saturn transiting 12th house from Moon. Recite Hanuman Chalisa at dusk and donate sesame seeds to ease obstacles.
                    </p>
                    <Link href="/booking" className="inline-block text-[11px] font-bold text-[#b45309] hover:underline pt-1">
                      Order Sade Sati Kuthi Report →
                    </Link>
                  </div>
                </div>
              )}

              {/* TOOL 3: 36-GUN MILAN ESTIMATOR */}
              {activeToolTab === 'matching' && (
                <div className="space-y-2.5 pt-1 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-600 block mb-1">Groom Nakshatra</span>
                    <select
                      value={boyNak}
                      onChange={(e) => setBoyNak(e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-[#fffdf5] border border-[#f3e8d2] text-xs font-bold"
                    >
                      {NAKSHATRAS.slice(0, 12).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-600 block mb-1">Bride Nakshatra</span>
                    <select
                      value={girlNak}
                      onChange={(e) => setGirlNak(e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-[#fffdf5] border border-[#f3e8d2] text-xs font-bold"
                    >
                      {NAKSHATRAS.slice(12, 24).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-gray-600 font-bold uppercase block">Ashtakoot Estimate</span>
                      <span className="text-lg font-black text-[#b45309]">28 / 36 Gunas</span>
                    </div>
                    <Link href="/matching" className="px-3 py-1.5 rounded-full bg-[#d97706] text-white text-[11px] font-bold">
                      Full Milan →
                    </Link>
                  </div>
                </div>
              )}

              {/* TOOL 4: GEMSTONE SELECTOR */}
              {activeToolTab === 'gemstone' && (
                <div className="space-y-3 pt-1 text-xs">
                  <span className="text-[10px] font-bold text-gray-600 block">Select Primary Goal:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['career', 'wealth', 'marriage', 'health'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setLifeGoal(g)}
                        className={`py-1 px-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                          lifeGoal === g ? 'bg-[#d97706] text-white' : 'bg-[#fffdf5] border border-[#f3e8d2] text-gray-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 rounded-2xl bg-[#fffdfa] border border-[#fde68a] space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Recommended Vedic Gemstone</span>
                    <h5 className="font-serif font-bold text-sm text-[#b45309]">
                      {lifeGoal === 'career' && 'Yellow Sapphire (Pukhraj) / Ruby'}
                      {lifeGoal === 'wealth' && 'Emerald (Panna) / Diamond'}
                      {lifeGoal === 'marriage' && 'Coral (Moonga) / Pearl'}
                      {lifeGoal === 'health' && 'Blue Sapphire (Neelam)'}
                    </h5>
                    <span className="text-[10px] text-gray-500 block">Strengthens Yogakaraka Lagna planets</span>
                  </div>
                </div>
              )}

            </div>

            {/* SIDEBAR WIDGET 3: CONSULT ASTROLOGERS CTA */}
            <div className="bg-gradient-to-br from-[#1c2541] to-[#0f172a] text-white rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#d97706] text-white text-[10px] font-extrabold uppercase tracking-wider inline-block">
                  Verified Scholars
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  Talk to Manipur&apos;s Top Astrologers
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Need personalized horoscope reading or marital compatibility analysis? Speak live via Call or Chat.
                </p>
              </div>

              <div className="flex -space-x-2 pt-1">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" alt="astro" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="astro" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80" alt="astro" />
                <div className="w-8 h-8 rounded-full bg-[#d97706] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  12+
                </div>
              </div>

              <Link
                href="/astrologers"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Consult Live Astrologers →</span>
              </Link>
            </div>

            {/* SIDEBAR WIDGET 4: CATEGORIES DIRECTORY CLOUD */}
            <div className="bg-white rounded-3xl border border-[#f3e8d2] p-6 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#0f172a] border-b border-[#f3e8d2] pb-2">
                Explore Topic Archives
              </h3>
              <div className="space-y-2">
                {categories.filter(c => c !== 'All').map((cat) => {
                  const count = posts.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-xl text-gray-700 hover:text-[#b45309] hover:bg-[#fffdf5] transition-colors cursor-pointer"
                    >
                      <span className="font-medium">{cat}</span>
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}
