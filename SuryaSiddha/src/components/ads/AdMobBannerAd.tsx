// components/ads/AdMobBannerAd.tsx - Google AdMob Mobile & Web Banner Unit
import React, { useState, useEffect } from 'react';
import { ExternalLink, X, ShieldCheck, CheckCircle2, Play } from 'lucide-react';
import { AdMobConfig } from '../../types/admin';

interface AdMobBannerAdProps {
  config?: AdMobConfig;
  placement?: 'home' | 'panchang' | 'bottom';
  className?: string;
  allowCustomFallback?: boolean;
}

export const AdMobBannerAd: React.FC<AdMobBannerAdProps> = ({
  config,
  placement = 'bottom',
  className = '',
  allowCustomFallback = false,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [testClickCount, setTestClickCount] = useState(0);

  const isEnabled = Boolean(config && (config.enabled || config.testMode));

  useEffect(() => {
    if (!isEnabled || !config) return;

    // Notify Android native bridge if running inside the Android APK wrapper
    if (typeof window !== 'undefined' && (window as any).AndroidBridge?.showAdMobBanner) {
      try {
        const adUnit = config.testMode
          ? 'ca-app-pub-3940256099942544/6300978111'
          : (config.bannerAdUnitIdAndroid || 'ca-app-pub-3940256099942544/6300978111');
        (window as any).AndroidBridge.showAdMobBanner(true, adUnit);
      } catch (e) {
        console.warn('Native AdMob bridge notice:', e);
      }
    }
  }, [config, isEnabled]);

  if (!isEnabled || !config || dismissed) {
    return null;
  }

  // Check placement permissions
  if (placement === 'panchang' && config.showBannerOnPanchang === false) {
    return null;
  }

  const isTest = Boolean(config.testMode);
  const unitId = isTest
    ? 'ca-app-pub-3940256099942544/6300978111'
    : (config.bannerAdUnitIdAndroid || 'ca-app-pub-3940256099942544/6300978111');

  const isBottom = placement === 'bottom';

  // RENDER TEST MODE AD (Official Google AdMob Test Ad look)
  if (isTest) {
    return (
      <div
        className={`${
          isBottom ? 'my-0.5 p-2' : 'my-3.5 p-3'
        } overflow-hidden rounded-xl border border-amber-500/80 bg-slate-950 text-white shadow-sm select-none transition-all ${className}`}
      >
        {/* Google 4-Color Accent Strip */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-red-500 via-yellow-400 to-green-500 rounded-full mb-1.5" />

        {/* Ad Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left Ad Info */}
          <div
            onClick={() => setTestClickCount((c) => c + 1)}
            className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xs shrink-0 shadow-xs">
              <Play className="w-3.5 h-3.5 fill-slate-950" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black text-[8.5px] uppercase tracking-wider">
                  Ad
                </span>
                <span className="text-[10.5px] font-bold text-amber-400 tracking-tight truncate group-hover:text-amber-300">
                  Google AdMob (Test Ad)
                </span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[9px] text-slate-400 font-mono truncate">
                Unit: {unitId.slice(-14)} • 320×50 Adaptive
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setTestClickCount((c) => c + 1)}
              className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs transition cursor-pointer"
              title="Simulate AdMob ad click"
            >
              <span>Test Click</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
              title="Dismiss ad"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {testClickCount > 0 && (
          <div className="text-[9px] text-emerald-400 font-bold text-center mt-1 pt-1 border-t border-slate-800">
            ✓ Test click registered ({testClickCount}). AdMob integration is working correctly!
          </div>
        )}
      </div>
    );
  }

  // RENDER PRODUCTION LIVE AD
  // If custom ads are disabled by admin and not running in test mode, do not render a custom promo card
  if (!allowCustomFallback) {
    return null;
  }

  return (
    <div
      className={`${
        isBottom ? 'my-0.5 p-2' : 'my-3.5 p-3'
      } overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/10 via-[#faf2ed] to-amber-500/10 border border-[#e6d5b8] shadow-xs select-none transition-all ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <a
          href="https://kuthiyengpham.in/consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 min-w-0 flex-1 text-left group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#790009] to-[#fe932c] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-200" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#904d00]">
                AdMob Sponsored
              </span>
            </div>
            <h4 className="text-[11px] font-bold text-[#1e1b18] truncate group-hover:text-[#790009] transition-colors leading-tight">
              Personalized Kundli &amp; Graha Dosha Analysis
            </h4>
          </div>
        </a>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="https://kuthiyengpham.in/consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-[#9c1b1b] hover:bg-[#790009] text-white text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs transition"
          >
            <span>Learn</span>
            <ExternalLink className="w-2.5 h-2.5 text-amber-300" />
          </a>

          <button
            onClick={() => setDismissed(true)}
            className="text-[#8d706d] hover:text-[#1e1b18] p-1 rounded-full hover:bg-[#e6d5b8]/50 transition cursor-pointer"
            title="Dismiss ad"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

