'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  BookOpen,
  Calendar,
  Clock,
  Sun,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

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
  const router = useRouter();
  const id = params.id as string;

  const [topic, setTopic] = useState<UsefulTopic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

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
    if (!id) return;
    fetch(`/api/useful?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.topic) {
          setTopic(data.topic);
        }
      })
      .catch((err) => console.error('Error fetching topic detail:', err))
      .finally(() => setLoading(false));
  }, [id]);

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
    <div className="min-h-screen bg-[#0d0d0f] flex flex-col items-center justify-start sm:py-6 selection:bg-amber-400 selection:text-amber-950 font-sans">
      
      {/* Device frame container */}
      <div className="w-full sm:max-w-[412px] sm:rounded-[44px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_12px_#1e1b18,0_0_0_14px_#38322a] overflow-hidden bg-white min-h-screen sm:min-h-[860px] flex flex-col relative pb-20">
        
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

        {/* 2. Sticky Top Bar with Back Arrow and Share Icon */}
        <header className="bg-[#1e1b18] text-white px-3.5 py-2.5 flex items-center justify-between shadow-md border-b border-stone-800 sticky top-7 z-40">
          <div className="flex items-center gap-2.5">
            <Link
              href="/app/useful"
              className="w-8 h-8 rounded-full hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-amber-300 transition"
              aria-label="Back to useful topics list"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-xs font-serif font-bold text-amber-100 truncate max-w-[200px]">
              {topic?.title || 'Article Reader'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-full hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-amber-300 transition relative cursor-pointer"
            title="Share this guide"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </header>

        {/* 3. Detail Content Reader */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading guide details...
            </div>
          ) : !topic ? (
            <div className="py-20 text-center text-slate-500 text-xs space-y-3">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800">Article topic not found</p>
              <Link
                href="/app/useful"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs inline-block"
              >
                Back to Useful Guides
              </Link>
            </div>
          ) : (
            <>
              {/* Meta row & Title */}
              <div className="space-y-2 border-b border-slate-100 pb-3.5">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded border border-amber-200">
                    {topic.category}
                  </span>
                  <span className="text-xs text-[#6B7280] font-mono">
                    Updated {new Date(topic.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h1 className="text-xl font-bold text-slate-900 leading-snug mb-2 font-serif">
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

        {/* 4. Bottom Navigation Bar */}
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

        {/* 5. Gesture Pill Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-3 bg-black flex items-center justify-center gap-12 z-50 pointer-events-none opacity-40">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>

      </div>
    </div>
  );
}
