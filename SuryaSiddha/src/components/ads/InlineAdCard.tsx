// components/ads/InlineAdCard.tsx - Inline Promo Card / Google AdSense Slot
import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { InlineAdConfig } from '../../types/admin';

interface InlineAdCardProps {
  config: InlineAdConfig;
}

export const InlineAdCard: React.FC<InlineAdCardProps> = ({ config }) => {
  if (!config.enabled) return null;

  // Google AdSense Embed Mode
  if (config.type === 'adsense' && config.adSlot) {
    return (
      <div className="my-5 rounded-2xl border border-slate-200 bg-white p-3 text-center overflow-hidden shadow-xs">
        <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Sponsored Advertisement (AdSense)</span>
        <div className="min-h-[90px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
          <p>AdSense Slot: {config.adSlot}</p>
        </div>
      </div>
    );
  }

  // Google AdMob Native Banner Mode
  if (config.type === 'admob') {
    return (
      <div className="my-5 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-3 text-center overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[9px] uppercase font-black tracking-wider text-indigo-700">Google AdMob Banner</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Mobile Ad</span>
        </div>
        <div className="min-h-[70px] sm:min-h-[90px] flex flex-col items-center justify-center bg-white rounded-xl border border-indigo-100 text-xs text-slate-600 p-3">
          <p className="font-bold text-slate-800">{config.title || 'AdMob Smart Banner 320x50 / 728x90'}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{config.body || 'Google Mobile Ads SDK Responsive Unit'}</p>
        </div>
      </div>
    );
  }

  // Custom Branded Promo Card
  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 p-4 shadow-sm hover:border-amber-300 transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          {config.imageUrl ? (
            <img
              src={config.imageUrl}
              alt={config.title}
              className="w-14 h-14 rounded-2xl object-cover shrink-0 ring-2 ring-amber-300 shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShoppingBag className="w-6 h-6" />
            </div>
          )}
          <div>
            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
              Recommended for You
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
              {config.title}
            </h4>
            <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-2">
              {config.body}
            </p>
          </div>
        </div>

        <a
          href={config.linkUrl || '#'}
          target={config.linkUrl?.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all shadow-sm hover:shadow"
        >
          <span>{config.ctaText || 'View Details'}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
