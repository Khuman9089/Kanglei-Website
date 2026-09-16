'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Share2,
  Clock,
  Home,
  Sun,
  Eye
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
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-[#0d0d0f] flex flex-col items-center justify-start sm:py-6 selection:bg-amber-400 selection:text-amber-950 font-sans">
      
      {/* Device frame container */}
      <div className="w-full sm:max-w-[412px] sm:rounded-[44px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_12px_#1e1b18,0_0_0_14px_#38322a] overflow-hidden bg-[#faf8f5] min-h-screen sm:min-h-[860px] flex flex-col relative pb-20">
        
        {/* 1. Android Status Bar */}
        <div className="bg-[#121212] text-amber-100/90 text-[11px] px-5 pt-2 pb-1.5 flex items-center justify-between font-mono select-none sticky top-0 z-50">
          <span className="font-bold tracking-tight text-white">{currentTime || '09:41'}</span>
          <div className="flex items-center gap-2 text-[10px] text-zinc-300">
            <span className="text-[9px] px-1 rounded bg-zinc-800 border border-zinc-700 font-sans">4G+</span>
            <div className="flex items-end gap-0.5 h-2.5">
              <span className="w-0.5 h-1 bg-white rounded-xs" />
              <span className="w-0.5 h-1.5 bg-white rounded-xs" />
              <span className="w-0.5 h-2 bg-white rounded-xs" />
              <span className="w-0.5 h-2.5 bg-white rounded-xs" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold">100%</span>
              <div className="w-4 h-2 rounded-xs border border-white/80 p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Top App Bar */}
        <header className="bg-[#1e1b18] text-white px-3.5 py-2.5 flex items-center justify-between shadow-md border-b border-stone-800 sticky top-7 z-40">
          <div className="flex items-center gap-2.5">
            <Link
              href="/app"
              className="w-8 h-8 rounded-full hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-amber-300 transition"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-sm font-serif font-black tracking-wide leading-none text-amber-100">
                Useful Info & Guides
              </h1>
              <span className="text-[10px] text-amber-400 font-serif leading-none block mt-0.5">
                মণিপুরী লমজিং অমসুং নিয়মশিং
              </span>
            </div>
          </div>

          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-amber-950 font-black shadow-xs">
            <BookOpen className="w-4 h-4 text-amber-950" />
          </div>
        </header>

        {/* 3. Search Bar & Category Chips */}
        <div className="p-3 bg-white border-b border-[#E5E7EB] space-y-2.5 sticky top-[57px] z-30 shadow-2xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rituals, panchang rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Topics Card List */}
        <div className="p-3 space-y-2.5 flex-1">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading useful guides...
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs space-y-2 bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700">No guides matching your search</p>
              <p className="text-slate-400">Try changing your search keywords or filter category.</p>
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/app/useful/${topic.id}`}
                className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 block hover:border-amber-300 active:scale-[0.99] transition shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded border border-amber-200/60">
                    {topic.category}
                  </span>
                  <span className="text-[10px] text-[#6B7280] font-mono">
                    {new Date(topic.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h2 className="text-[#111827] font-bold text-[15px] sm:text-[16px] leading-snug">
                  {topic.title}
                </h2>

                <p className="text-[#4B5563] text-[13px] line-clamp-2 leading-relaxed">
                  {topic.summary || 'Tap to read the complete ritual instructions and guidelines.'}
                </p>

                <div className="pt-1 flex items-center justify-end text-[11px] font-bold text-amber-700 gap-0.5">
                  <span>Read Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* 5. Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#1e1b18] border-t border-stone-800 px-3 py-1.5 flex items-center justify-around z-40 select-none shadow-2xl">
          <Link
            href="/app?tab=home"
            className="flex flex-col items-center gap-1 text-[10px] font-medium transition cursor-pointer text-gray-400 hover:text-white"
          >
            <div className="px-3 py-1 rounded-full transition">
              <Sun className="w-5 h-5" />
            </div>
            <span>Home</span>
          </Link>

          <Link
            href="/app?tab=calendar"
            className="flex flex-col items-center gap-1 text-[10px] font-medium transition cursor-pointer text-gray-400 hover:text-white"
          >
            <div className="px-3 py-1 rounded-full transition">
              <Calendar className="w-5 h-5" />
            </div>
            <span>Calendar</span>
          </Link>

          <Link
            href="/app?tab=panchang"
            className="flex flex-col items-center gap-1 text-[10px] font-medium transition cursor-pointer text-gray-400 hover:text-white"
          >
            <div className="px-3 py-1 rounded-full transition">
              <Clock className="w-5 h-5" />
            </div>
            <span>Panchang</span>
          </Link>

          <Link
            href="/app/useful"
            className="flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer text-[#D97706]"
          >
            <div className="px-3 py-1 rounded-full transition bg-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Useful</span>
          </Link>

          <Link
            href="/app?tab=home"
            className="flex flex-col items-center gap-1 text-[10px] font-medium transition cursor-pointer text-gray-400 hover:text-white"
          >
            <div className="px-3 py-1 rounded-full transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>Rashifall</span>
          </Link>
        </nav>

        {/* 6. Gesture Pill Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-3 bg-black flex items-center justify-center gap-12 z-50 pointer-events-none opacity-40">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>

      </div>
    </div>
  );
}
