'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Briefcase,
  Heart,
  DollarSign,
  Activity,
  Share2,
  ChevronLeft,
  ChevronRight,
  Send,
  Star,
  Compass,
  Check,
  RefreshCw,
  Facebook
} from 'lucide-react';
import { DailyRashifalData, DailyRashiItem } from '@/lib/dailyRashifal';

export default function DailyRashifalPage() {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [rashifal, setRashifal] = useState<DailyRashifalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedSign, setCopiedSign] = useState<number | null>(null);
  const [fbPosting, setFbPosting] = useState<boolean>(false);
  const [fbPostResult, setFbPostResult] = useState<{ success: boolean; msg: string; postId?: string } | null>(null);

  // Initialize with today's date in IST
  useEffect(() => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
    const dateStr = istDate.toISOString().slice(0, 10);
    setCurrentDate(dateStr);
    fetchRashifal(dateStr);
  }, []);

  const fetchRashifal = async (dateStr: string, forceRefresh = false) => {
    setLoading(true);
    setFbPostResult(null);
    try {
      const url = `/api/rashifal?date=${dateStr}${forceRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setRashifal(json.data);
      }
    } catch (err) {
      console.error('Failed to load rashifal:', err);
    } finally {
      setLoading(false);
    }
  };

  const changeDateBy = (days: number) => {
    if (!currentDate) return;
    const d = new Date(currentDate + 'T12:00:00Z');
    d.setDate(d.getDate() + days);
    const newDateStr = d.toISOString().slice(0, 10);
    setCurrentDate(newDateStr);
    fetchRashifal(newDateStr);
  };

  const jumpToToday = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
    const dateStr = istDate.toISOString().slice(0, 10);
    setCurrentDate(dateStr);
    fetchRashifal(dateStr);
  };

  const scrollToSign = (serial: number) => {
    const element = document.getElementById(`rashi-${serial}`);
    if (element) {
      const yOffset = -90; // account for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const copySignShare = (item: DailyRashiItem) => {
    const rashiTitle = item.bengaliName ? `${item.bengaliName} • ${item.name}` : item.name;
    const text = `✨ Kuthiyengpham Ngasi gi Rashifal (${rashifal?.formattedDate}) ✨\n\n` +
      `${item.symbol} ${item.serial}. ${rashiTitle} (${item.englishName})\n` +
      `📌 Ngasi gi Maikei: ${item.overview}\n` +
      `💼 Thabak-Thouram: ${item.career}\n` +
      `❤️ Nungsiba & Emung Manung: ${item.love}\n` +
      `💰 Sen-Thum: ${item.wealth}\n` +
      `🌿 Haksel: ${item.health}\n` +
      `🪔 Laining Upay: ${item.remedy}\n` +
      `🎨 Shubh Machu: ${item.luckyColor} | 🔢 Shubh Number: ${item.luckyNumber}\n\n` +
      `👉 Kuthiyengpham da kupna yengbiyu: https://kuthiyengpham.in/daily-rashifal?date=${currentDate}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSign(item.serial);
      setTimeout(() => setCopiedSign(null), 2500);
    }
  };

  const handlePostToFacebook = async () => {
    if (fbPosting) return;
    setFbPosting(true);
    setFbPostResult(null);

    try {
      const res = await fetch('/api/admin/facebook-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: currentDate })
      });
      const data = await res.json();

      if (data.success) {
        setFbPostResult({
          success: true,
          msg: `Successfully posted to KuthiYengpham Facebook Page!`,
          postId: data.postId
        });
      } else {
        setFbPostResult({
          success: false,
          msg: data.error || 'Failed to post to Facebook. Please check API token.'
        });
      }
    } catch (e: any) {
      setFbPostResult({
        success: false,
        msg: e?.message || 'Network error while contacting Facebook.'
      });
    } finally {
      setFbPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] font-sans pb-24 selection:bg-[#fef3c7] selection:text-[#b45309]">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-b from-[#fef3c7]/60 via-[#fffbeb]/40 to-[#fffdfa] border-b border-[#f3e8d2] pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-extrabold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-4 h-4 text-[#d97706] animate-pulse" />
            ꯀꯨꯊꯤꯌꯦꯡꯐꯝ • Vedic Sidereal Daily Forecast
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#0f172a] tracking-tight leading-tight">
            Ngasi gi <span className="text-[#b45309]">Rashifal</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Rashi 1 dagi 12 faobagi ngasigi thabak-thouram, sen-thum, emung manung gi nungsiba amadi hakselgi yaipha-mangol. Pukning shantina khangminnasi.
          </p>

          {/* Date Navigator Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => changeDateBy(-1)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#e2e8f0] text-gray-700 hover:bg-[#fef3c7] hover:border-[#fde68a] hover:text-[#b45309] font-bold text-sm flex items-center gap-1.5 transition-all shadow-xs"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="px-4 py-2 rounded-xl bg-white border border-[#d97706]/40 shadow-xs flex items-center gap-2.5 text-[#0f172a] font-bold text-sm">
              <Calendar className="w-4 h-4 text-[#d97706]" />
              <span>{rashifal?.formattedDate || currentDate}</span>
            </div>

            <button
              onClick={() => changeDateBy(1)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#e2e8f0] text-gray-700 hover:bg-[#fef3c7] hover:border-[#fde68a] hover:text-[#b45309] font-bold text-sm flex items-center gap-1.5 transition-all shadow-xs"
              title="Next Day"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={jumpToToday}
              className="px-3.5 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-sm transition-all shadow-xs"
            >
              Today (Ngasi)
            </button>

            <button
              onClick={() => fetchRashifal(currentDate, true)}
              className="p-2 rounded-xl bg-white border border-[#e2e8f0] text-gray-600 hover:text-[#d97706] hover:border-[#fde68a] transition-all shadow-xs"
              title="Refresh / Regenerate"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Quick Jump Ribbon (1 to 12) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#f3e8d2] shadow-xs py-2.5 px-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <span className="text-xs font-black text-gray-400 uppercase tracking-wider pl-1 shrink-0 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#d97706]" />
            Jump:
          </span>
          {rashifal?.items.map((it) => (
            <button
              key={it.serial}
              onClick={() => scrollToSign(it.serial)}
              className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#f8fafc] hover:bg-[#fef3c7] text-[#0f172a] hover:text-[#b45309] border border-[#e2e8f0] hover:border-[#fde68a] transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span className="text-[#d97706] font-extrabold">{it.serial}.</span>
              <span className="font-serif text-[#b45309] font-bold">{it.bengaliName}</span>
              <span className="text-gray-600 font-medium">({it.name})</span>
              <span className="text-gray-400">{it.symbol}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Planetary Overview Banner */}
        {rashifal?.planetarySummary && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#fffbeb] border border-[#fde68a] text-[#78350f] text-sm sm:text-base leading-relaxed flex items-start gap-3 shadow-xs">
            <Sparkles className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block text-[#92400e] mb-1">
                Ngasi gi Sidereal Transit Summary:
              </span>
              {rashifal.planetarySummary}
            </div>
          </div>
        )}

        {/* Facebook Page Quick Connection Ribbon & Manual Trigger */}
        <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Facebook className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#0f172a]">KuthiYengpham.in on Facebook</div>
              <div className="text-xs text-gray-500">Official Daily Rashifal auto-posted every morning</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.facebook.com/1266050243267287"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
              <span>Visit Page</span>
            </a>

            <button
              onClick={handlePostToFacebook}
              disabled={fbPosting}
              className="px-3 py-1.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] border border-[#fde68a] font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-xs"
              title="Post today's rashifal to Facebook now"
            >
              <Send className={`w-3.5 h-3.5 ${fbPosting ? 'animate-bounce' : ''}`} />
              <span>{fbPosting ? 'Posting...' : 'Post to FB Now'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert for Facebook Post */}
        {fbPostResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 ${
              fbPostResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span>{fbPostResult.msg}</span>
            {fbPostResult.postId && (
              <a
                href={`https://www.facebook.com/${fbPostResult.postId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold shrink-0 text-emerald-900"
              >
                View Post ↗
              </a>
            )}
          </div>
        )}

        {/* Loading State with Folding Hands */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="text-5xl animate-bounce">🙏</div>
            <div className="w-10 h-10 border-4 border-[#d97706] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-800 font-bold text-base sm:text-lg flex items-center justify-center gap-2">
              <span>🙏</span>
              <span>Ngaihaktang Ngaiminnasi...</span>
            </p>
          </div>
        )}

        {/* The Continuous Vertical Serial List (1 to 12) */}
        {!loading && rashifal && (
          <div className="space-y-6">
            {rashifal.items.map((item) => (
              <article
                key={item.serial}
                id={`rashi-${item.serial}`}
                className="bg-white rounded-3xl border border-[#f3e8d2] shadow-sm hover:shadow-md transition-all p-5 sm:p-7 space-y-5 scroll-mt-24"
              >
                {/* Rashi Header with Serial, Symbol, Names */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#fef3c7] to-[#fde68a] border border-[#fde68a] flex items-center justify-center text-3xl text-[#b45309] font-serif shadow-xs">
                      {item.symbol}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-black">
                          #{item.serial}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0f172a] flex flex-wrap items-baseline gap-2">
                          <span className="text-[#b45309]">{item.bengaliName}</span>
                          <span>•</span>
                          <span>{item.name}</span>
                          <span className="text-gray-500 font-normal text-lg">({item.englishName})</span>
                        </h2>
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5 flex flex-wrap items-center gap-2">
                        <span>{item.dates}</span>
                        <span>•</span>
                        <span>Lord: <strong className="text-gray-700">{item.rashiLord}</strong></span>
                        <span>•</span>
                        <span>Element: <strong className="text-gray-700">{item.element}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < item.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Share Button */}
                    <button
                      onClick={() => copySignShare(item)}
                      className="p-2 rounded-xl bg-gray-50 hover:bg-[#fef3c7] border border-gray-200 hover:border-[#fde68a] text-gray-600 hover:text-[#b45309] transition-all"
                      title="Copy & Share this sign"
                    >
                      {copiedSign === item.serial ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Ngasi gi Maikei (Overview) */}
                <div className="bg-[#fef9ec] p-4 rounded-2xl border border-[#fef08a]/60 space-y-1">
                  <div className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Ngasi gi Maikei (Overview)</span>
                  </div>
                  <p className="text-base text-gray-800 leading-relaxed font-normal">
                    {item.overview}
                  </p>
                </div>

                {/* 4 Core Life Facets (Thabak, Nungsiba, Sen-thum, Haksel) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Thabak & Career */}
                  <div className="p-3.5 rounded-2xl bg-white border border-blue-100 hover:border-blue-200 transition-all space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-700 uppercase tracking-wide">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Thabak-Thouram & Career</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-normal">
                      {item.career}
                    </p>
                  </div>

                  {/* Nungsiba & Emung Manung */}
                  <div className="p-3.5 rounded-2xl bg-white border border-rose-100 hover:border-rose-200 transition-all space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-700 uppercase tracking-wide">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Nungsiba & Emung Manung</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-normal">
                      {item.love}
                    </p>
                  </div>

                  {/* Sen-Thum */}
                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-200 transition-all space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 uppercase tracking-wide">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Sen-Thum & Sel-Pum</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-normal">
                      {item.wealth}
                    </p>
                  </div>

                  {/* Haksel */}
                  <div className="p-3.5 rounded-2xl bg-white border border-teal-100 hover:border-teal-200 transition-all space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-teal-700 uppercase tracking-wide">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Haksel & Pukning</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-normal">
                      {item.health}
                    </p>
                  </div>
                </div>

                {/* Laining-Laison Upay (Vedic Remedy) */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <div className="text-xs font-extrabold text-[#b45309] uppercase tracking-wide flex items-center gap-1.5">
                    <span>🪔</span>
                    <span>Laining-Laison gi Upay (Daily Remedy)</span>
                  </div>
                  <p className="text-sm text-amber-950 leading-relaxed font-medium">
                    {item.remedy}
                  </p>
                </div>

                {/* Lucky Stats Strip */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100 text-center">
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[11px] text-gray-500 font-semibold block">Shubh Machu</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] block mt-0.5 truncate">
                      {item.luckyColor}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[11px] text-gray-500 font-semibold block">Shubh Number</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] block mt-0.5">
                      {item.luckyNumber}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[11px] text-gray-500 font-semibold block">Shubh Matam</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0f172a] block mt-0.5 truncate">
                      {item.luckyTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom Callout & Footer note */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white text-center space-y-3 mt-10 shadow-lg">
          <Sparkles className="w-8 h-8 text-[#fbbf24] mx-auto animate-pulse" />
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Daily Rashifal Facebook Page da Follow Toubiyu
          </h3>
          <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Numit khudinggi ayukki matamda <strong>KuthiYengpham.in</strong> Facebook page da Ngasi gi Rashifal kupna post touri. Page asida like amadi follow toubiyu!
          </p>
          <div className="pt-2">
            <a
              href="https://www.facebook.com/1266050243267287"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              <Facebook className="w-4 h-4 fill-current" />
              <span>Follow KuthiYengpham on Facebook</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
