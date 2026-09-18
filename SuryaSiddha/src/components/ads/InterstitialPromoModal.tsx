// components/ads/InterstitialPromoModal.tsx - Fullscreen Promotional Modal
import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { InterstitialPromoConfig } from '../../types/admin';

interface InterstitialPromoModalProps {
  config: InterstitialPromoConfig;
}

export const InterstitialPromoModal: React.FC<InterstitialPromoModalProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!config.enabled) return;

    const sessionKey = 'suryasiddha_interstitial_seen';
    const seen = sessionStorage.getItem(sessionKey);

    if (config.frequency === 'once_per_session' && seen) {
      return;
    }

    // Show after 3.5 seconds of user activity
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(sessionKey, 'true');
    }, 3500);

    return () => clearTimeout(timer);
  }, [config.enabled, config.frequency]);

  if (!isOpen || !config.enabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-amber-200">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Promo Image Header */}
        {config.imageUrl && (
          <div className="relative h-44 w-full overflow-hidden bg-slate-900">
            <img
              src={config.imageUrl}
              alt={config.title}
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {config.badge && (
              <span className="absolute bottom-3 left-4 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                {config.badge}
              </span>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 text-center">
          <h3 className="font-serif text-lg sm:text-xl font-black text-slate-900 leading-snug">
            {config.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {config.description}
          </p>

          {/* Action CTAs */}
          <div className="mt-5 flex flex-col gap-2">
            <a
              href={config.linkUrl || '#'}
              target={config.linkUrl?.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 hover:scale-[1.01] transition-transform"
            >
              <span>{config.ctaText || 'Claim Offer Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsOpen(false)}
              className="py-2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
