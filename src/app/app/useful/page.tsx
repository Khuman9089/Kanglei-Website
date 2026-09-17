'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Clock,
  Sun
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UsefulTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  content_html: string;
  is_published: boolean;
  updated_at: string;
}

export default function UsefulTopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<UsefulTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetch('/api/useful')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.topics) {
          setTopics(data.topics);
        }
      })
      .catch((err) => console.error('Error loading useful topics:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    topics.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['All', ...Array.from(set)];
  }, [topics]);

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategory === 'All' ||
        t.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [topics, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-start sm:py-6 selection:bg-amber-400 selection:text-amber-950 font-sans">
      
      {/* Edge-to-Edge Android App Frame */}
      <div className="w-full sm:max-w-[420px] sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_8px_#0f172a,0_0_0_10px_#1e293b] overflow-hidden bg-[#f8fafc] min-h-[100dvh] flex flex-col relative pb-28 select-none-mobile">
        
        {/* 1. Fixed Native Top App Bar */}
        <div className="sticky top-0 z-40 bg-[#0f172a] shadow-mobile-appbar border-b border-slate-800 select-none-mobile pt-safe">
          <header className="px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-amber-300 transition app-active-press cursor-pointer"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-[15px] font-sans font-bold tracking-tight leading-none text-slate-50">
                  Useful Info & Guides
                </h1>
                <span className="text-[11px] text-amber-400/90 font-medium leading-none block mt-1">
                  মণিপুরী আচার, পূজা ও নিয়মাবলী
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-sm">
              <BookOpen className="w-4.5 h-4.5 text-slate-950" />
            </div>
          </header>
        </div>

        {/* 2. Search Bar & Category Chips */}
        <div className="p-3 bg-white border-b border-slate-200/80 space-y-2.5 sticky top-[53px] z-30 shadow-mobile-card">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rituals, panchang rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all app-active-press cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Topics Card List */}
        <div className="p-3.5 space-y-3 flex-1">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading useful guides...
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs space-y-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-mobile-card">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">No guides matching your search</p>
              <p className="text-slate-400">Try changing your search keywords or filter category.</p>
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/app/useful/${topic.id}`}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 block hover:border-amber-400 active:scale-[0.98] transition-all shadow-mobile-card space-y-2 app-active-press"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                    {topic.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(topic.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h2 className="text-slate-900 font-bold text-[15px] leading-snug">
                  {topic.title}
                </h2>

                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                  {topic.summary || 'Tap to read the complete ritual instructions and guidelines.'}
                </p>

                <div className="pt-1 flex items-center justify-end text-xs font-bold text-amber-600 gap-0.5">
                  <span>Read Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* 4. Native Pinned Bottom Navigation Bar */}
        <nav 
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-800/80 safe-bottom-nav pt-2 px-3 flex items-center justify-around z-40 shadow-mobile-nav select-none-mobile text-slate-400"
          aria-label="Bottom Navigation"
        >
          <Link
            href="/app?tab=home"
            className="flex flex-col items-center justify-center gap-1 min-w-[54px] min-h-[48px] py-1 px-2 rounded-2xl app-active-press transition-all cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <div className="px-3 py-1 rounded-full transition">
              <Sun className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Home</span>
          </Link>

          <Link
            href="/app?tab=calendar"
            className="flex flex-col items-center justify-center gap-1 min-w-[54px] min-h-[48px] py-1 px-2 rounded-2xl app-active-press transition-all cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <div className="px-3 py-1 rounded-full transition">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Calendar</span>
          </Link>

          <Link
            href="/app?tab=panchang"
            className="flex flex-col items-center justify-center gap-1 min-w-[54px] min-h-[48px] py-1 px-2 rounded-2xl app-active-press transition-all cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <div className="px-3 py-1 rounded-full transition">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Panchang</span>
          </Link>

          <Link
            href="/app/useful"
            className="flex flex-col items-center justify-center gap-1 min-w-[54px] min-h-[48px] py-1 px-2 rounded-2xl app-active-press transition-all cursor-pointer text-amber-400 font-bold"
          >
            <div className="px-3 py-1 rounded-full transition bg-amber-500/20 text-amber-400 scale-105 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Useful</span>
          </Link>

          <Link
            href="/app?tab=horoscope"
            className="flex flex-col items-center justify-center gap-1 min-w-[54px] min-h-[48px] py-1 px-2 rounded-2xl app-active-press transition-all cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <div className="px-3 py-1 rounded-full transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Rashifal</span>
          </Link>
        </nav>

      </div>
    </div>
  );
}
