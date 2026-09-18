// components/ads/TopBannerAd.tsx - Top Promotional Banner Ad Component
import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { BannerAdConfig } from '../../types/admin';

interface TopBannerAdProps {
  config: BannerAdConfig;
}

export const TopBannerAd: React.FC<TopBannerAdProps> = ({ config }) => {
  if (!config.enabled) return null;

  return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-[1px] shadow-sm hover:shadow-md transition-shadow">
      <a
        href={config.linkUrl || '#'}
        target={config.linkUrl?.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 p-3 sm:p-3.5 rounded-[15px] group"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {config.imageUrl ? (
              <img
                src={config.imageUrl}
                alt={config.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0 ring-2 ring-amber-300 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {config.badge && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 font-mono text-[9px] font-black tracking-wider uppercase border border-amber-300">
                    {config.badge}
                  </span>
                )}
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                  {config.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 font-medium line-clamp-1 mt-0.5">
                {config.subtitle}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold shadow-xs group-hover:scale-[1.02] transition-transform">
            <span>{config.ctaText || 'Learn More'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </a>
    </div>
  );
};
