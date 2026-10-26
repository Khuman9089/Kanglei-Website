'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, X, ShieldCheck, Play, CheckCircle2, WifiOff } from 'lucide-react';

interface ManipuriAdMobBannerProps {
  appSettings?: any;
  isOnline?: boolean;
  className?: string;
}

export default function ManipuriAdMobBanner({
  appSettings,
  isOnline = true,
  className = '',
}: ManipuriAdMobBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [testClickCount, setTestClickCount] = useState(0);

  const adConfig = appSettings?.ads?.top_banner;
  const isGlobalEnabled = appSettings?.ads?.global_enabled !== false;
  const isAdmobEnabled = isGlobalEnabled && (adConfig?.enabled !== false);
  const isTestMode = Boolean(adConfig?.test_mode ?? true);
  const adUnitId = adConfig?.unit_id || 'ca-app-pub-3940256099942544/6300978111';

  // Send signal to Native Android WebView bridge if running in APK
  useEffect(() => {
    if (!isAdmobEnabled || dismissed) return;
    if (typeof window !== 'undefined' && (window as any).AndroidBridge?.showAdMobBanner) {
      try {
        (window as any).AndroidBridge.showAdMobBanner(isOnline, adUnitId);
      } catch (err) {
        console.warn('Native AdMob bridge notification:', err);
      }
    }
  }, [isAdmobEnabled, isOnline, adUnitId, dismissed]);

  if (!isGlobalEnabled || dismissed) {
    return null;
  }

  // Graceful offline fallback: Do not display broken banner or crash in offline mode
  if (!isOnline) {
    return (
      <div className={`w-full max-w-md mx-auto px-3 py-1 bg-[#1a1714] border-t border-amber-900/30 text-amber-200/70 text-[10px] flex items-center justify-between select-none ${className}`}>
        <div className="flex items-center gap-1.5 font-sans">
          <WifiOff className="w-3 h-3 text-amber-400/80" />
          <span>Offline Mode • Offline Astrological Engine Active</span>
        </div>
        <span className="font-mono text-[9px] text-amber-500/80">KangleiAstro</span>
      </div>
    );
  }

  // If AdMob is configured for test mode (safe for development & preview)
  if (isTestMode) {
    return (
      <div
        className={`w-full max-w-md mx-auto px-2.5 py-1.5 bg-[#0f172a] border-t border-amber-500/40 text-white text-xs select-none shadow-md ${className}`}
      >
        {/* Google 4-Color Accent Strip */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-red-500 via-yellow-400 to-green-500 rounded-full mb-1" />

        <div className="flex items-center justify-between gap-2">
          {/* Ad Description */}
          <div
            onClick={() => setTestClickCount((c) => c + 1)}
            className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xs shrink-0 shadow-xs">
              <Play className="w-3 h-3 fill-slate-950" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1 py-0.2 rounded bg-emerald-500 text-slate-950 font-black text-[8px] uppercase tracking-wider">
                  Ad
                </span>
                <span className="text-[10px] font-bold text-amber-400 tracking-tight truncate group-hover:text-amber-300">
                  Google AdMob Banner
                </span>
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[8.5px] text-slate-400 font-mono truncate">
                320×50 Adaptive • Unit: {adUnitId.slice(-12)}
              </p>
            </div>
          </div>

          {/* Ad Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setTestClickCount((c) => c + 1)}
              className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs transition cursor-pointer"
              title="Test Ad click"
            >
              <span>Test</span>
              <ExternalLink className="w-2 h-2" />
            </button>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
              title="Dismiss ad"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {testClickCount > 0 && (
          <div className="text-[8.5px] text-emerald-400 font-bold text-center mt-0.5 pt-0.5 border-t border-slate-800">
            ✓ Test click registered ({testClickCount}). AdMob unit functioning properly.
          </div>
        )}
      </div>
    );
  }

  // Live Production Ad Banner
  return (
    <div
      className={`w-full max-w-md mx-auto px-3 py-1.5 bg-[#18181b] border-t border-amber-900/40 text-slate-200 select-none ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <a
          href="https://kuthiyengpham.in/consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 min-w-0 flex-1 text-left group"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#c84b31] to-[#fead4d] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8.5px] font-bold uppercase tracking-wider text-amber-400">
                Sponsored Ad
              </span>
            </div>
            <h4 className="text-[10.5px] font-bold text-white truncate group-hover:text-amber-300 transition-colors leading-tight">
              Manipuri Janma Patrika &amp; Sacred Horoscopes
            </h4>
          </div>
        </a>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="https://kuthiyengpham.in/consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 rounded-lg bg-[#c84b31] hover:bg-[#a6331b] text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs transition"
          >
            <span>View</span>
            <ExternalLink className="w-2 h-2 text-amber-200" />
          </a>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
            title="Dismiss ad"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
