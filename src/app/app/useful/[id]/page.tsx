'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Share2,
  Calendar,
  Clock,
  Sun,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface UsefulTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  content_html: string;
  is_published: boolean;
  updated_at: string;
}

export default function UsefulTopicDetailPage() {
  const params = useParams();
  const topicId = params?.id as string;
  const [topic, setTopic] = useState<UsefulTopic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!topicId) return;
    fetch('/api/useful')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.topics) {
          const found = data.topics.find((t: UsefulTopic) => t.id === topicId);
          setTopic(found || null);
        }
      })
      .catch((err) => console.error('Error fetching topic detail:', err))
      .finally(() => setLoading(false));
  }, [topicId]);

  const handleShare = async () => {
    if (!topic) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: topic.title,
          text: topic.summary || topic.title,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-start sm:py-6 selection:bg-amber-400 selection:text-amber-950 font-sans">
      
      {/* Edge-to-Edge Android App Frame */}
      <div className="w-full sm:max-w-[420px] sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_8px_#0f172a,0_0_0_10px_#1e293b] overflow-hidden bg-white min-h-[100dvh] flex flex-col relative pb-28 select-none-mobile">
        
        {/* 1. Fixed Native Top App Bar */}
        <div className="sticky top-0 z-40 bg-[#0f172a] shadow-mobile-appbar border-b border-slate-800 select-none-mobile pt-safe">
          <header className="px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/app/useful"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-amber-300 transition app-active-press cursor-pointer"
                aria-label="Back to useful topics list"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <span className="text-sm font-sans font-bold text-slate-50 truncate max-w-[210px]">
                {topic?.title || 'Article Reader'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-amber-300 transition app-active-press cursor-pointer"
              title="Share this guide"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </header>
        </div>

        {/* 2. Detail Content Reader */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading guide details...
            </div>
          ) : !topic ? (
            <div className="py-20 text-center text-slate-500 text-xs space-y-3">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800">Article topic not found</p>
              <Link
                href="/app/useful"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs inline-block shadow-sm"
              >
                Back to Useful Guides
              </Link>
            </div>
          ) : (
            <>
              {/* Meta row & Title */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                    {topic.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Updated {new Date(topic.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h1 className="text-xl font-bold text-slate-900 leading-snug font-serif">
                  {topic.title}
                </h1>
              </div>

              {/* Body container: content_html safely styled */}
              <div
                className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed text-[15px]"
                dangerouslySetInnerHTML={{ __html: topic.content_html }}
              />
            </>
          )}
        </div>

        {/* 3. Native Pinned Bottom Navigation Bar */}
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
