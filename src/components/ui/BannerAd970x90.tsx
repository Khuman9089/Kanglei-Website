'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface BannerAdData {
  active: boolean;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  theme: 'gold' | 'crimson' | 'emerald' | 'midnight';
}

const DEFAULT_BANNER: BannerAdData = {
  active: true,
  title: '✨ Special Manipuri Astrological Offer',
  description: 'Get 20% OFF Kuthi Matching & Full 36-Gun Ashtakoot Compatibility Reports today!',
  imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&q=80',
  buttonText: 'Claim 20% Discount →',
  buttonLink: '/matching',
  theme: 'gold',
};

export default function BannerAd970x90() {
  const pathname = usePathname();
  const [banner, setBanner] = useState<BannerAdData>(DEFAULT_BANNER);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/banner')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.banner) {
          setBanner(data.banner);
        }
      })
      .catch((err) => console.error('Error loading banner ad:', err));
  }, []);

  // Do NOT show banner ad on admin pages or astrologer dashboard, or if dismissed, or if inactive
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard/astrologer') || dismissed || !banner || !banner.active) {
    return null;
  }

  const isExternal = banner.buttonLink?.startsWith('http');

  // Theme gradients
  const themeClasses = {
    gold: 'from-[#0b132b] via-[#1c2541] to-[#0b132b] border-[#c69214]',
    crimson: 'from-[#2b0b14] via-[#411c25] to-[#2b0b14] border-red-500',
    emerald: 'from-[#0b2b18] via-[#1c412e] to-[#0b2b18] border-emerald-500',
    midnight: 'from-[#0f172a] via-[#1e293b] to-[#0f172a] border-[#38bdf8]',
  }[banner.theme || 'gold'];

  return (
    <aside aria-label="Advertisement Banner" className="w-full bg-[#fffdfa] pt-20 md:pt-28 pb-3 px-4 print:hidden flex justify-center items-center relative z-20">
      {/* Exact 970px x 90px Standard Leaderboard Container */}
      <div className={`w-full max-w-[970px] min-h-[90px] rounded-2xl bg-gradient-to-r ${themeClasses} border-2 shadow-xl p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 relative overflow-hidden`}>
        
        {/* Background Decorative Twinkle Stars */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#c69214]/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-3.5 z-10 overflow-hidden">
          {/* Ad Image / Icon Thumbnail */}
          {banner.imageUrl ? (
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#c69214]/40 shadow-sm bg-black/40">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#c69214]/20 border border-[#c69214] text-[#fbbf24] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
          )}

          {/* Ad Title & Short Description Copy */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#c69214] text-white font-black text-[9px] uppercase tracking-wider">
                ADVERTISEMENT
              </span>
              <h4 className="font-serif font-bold text-white text-base truncate sm:text-lg">
                {banner.title}
              </h4>
            </div>
            <p className="text-xs text-slate-200 line-clamp-1 font-sans">
              {banner.description}
            </p>
          </div>
        </div>

        {/* Action Button & Dismiss X */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          {isExternal ? (
            <a
              href={banner.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <span>{banner.buttonText || 'Learn More'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <Link
              href={banner.buttonLink || '/'}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <span>{banner.buttonText || 'Learn More'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg bg-black/30 text-slate-300 hover:text-white hover:bg-black/60 transition-colors"
            title="Dismiss Ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
}
