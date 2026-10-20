// components/ads/InlineAdCard.tsx - Inline Promo Card / Google AdSense & AdMob Slot
import React, { useEffect, useRef } from 'react';
import { ShoppingBag, ArrowRight, ExternalLink } from 'lucide-react';
import { InlineAdConfig } from '../../types/admin';

interface InlineAdCardProps {
  config: InlineAdConfig;
}

export const InlineAdCard: React.FC<InlineAdCardProps> = ({ config }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isPushed = useRef<boolean>(false);

  useEffect(() => {
    // Notify Android native bridge if present
    if (typeof window !== 'undefined' && (window as any).AndroidBridge?.showAdMobBanner) {
      if (config.enabled && (config.type === 'admob' || config.type === 'adsense')) {
        (window as any).AndroidBridge.showAdMobBanner(true, config.adSlot || config.adClient || '');
      } else {
        (window as any).AndroidBridge.showAdMobBanner(false, '');
      }
    }

    // Google AdSense / AdMob Web integration
    if (config.enabled && config.type === 'adsense' && config.adClient && config.adSlot) {
      try {
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
          const script = document.createElement('script');
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adClient}`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }

        if (!isPushed.current && typeof window !== 'undefined') {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          isPushed.current = true;
        }
      } catch (err) {
        console.warn('AdSense load notice:', err);
      }
    }
  }, [config.enabled, config.type, config.adClient, config.adSlot]);

  if (!config.enabled) return null;

  // Google AdSense Live Embed Mode
  if (config.type === 'adsense' && config.adClient && config.adSlot) {
    return (
      <div className="my-5 rounded-2xl border border-slate-200 bg-white p-3 text-center overflow-hidden shadow-xs">
        <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
          Sponsored Advertisement
        </span>
        <div ref={adRef} className="min-h-[90px] w-full flex items-center justify-center overflow-hidden">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', minWidth: '300px', width: '100%', height: '90px' }}
            data-ad-client={config.adClient}
            data-ad-slot={config.adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // Google AdMob / Native Mobile Ad Unit Mode
  if (config.type === 'admob') {
    return (
      <div className="my-5 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-indigo-50/70 p-3.5 text-center overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[9px] uppercase font-black tracking-wider text-indigo-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            Google AdMob Sponsored
          </span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
            Mobile Unit
          </span>
        </div>
        <div className="min-h-[80px] sm:min-h-[90px] flex flex-col items-center justify-center bg-white rounded-xl border border-indigo-100/80 p-3 shadow-2xs">
          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
            {config.title || 'Personalized Astrological Guidance & Vedic Gemstones'}
          </h4>
          <p className="text-[11px] text-slate-600 mt-1 max-w-md line-clamp-2">
            {config.body || 'Certified Astrological consultations, consecrated Yantras and remedies verified by top scholars.'}
          </p>
          {config.linkUrl && (
            <a
              href={config.linkUrl}
              target={config.linkUrl.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition shadow-xs"
            >
              <span>{config.ctaText || 'Learn More'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    );
  }

  // Custom Branded Promo Card (Default)
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
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <span>{config.ctaText || 'View Details'}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
