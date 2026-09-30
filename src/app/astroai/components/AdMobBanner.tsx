'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Info, X } from 'lucide-react';
import { AstroAIConfig, DEFAULT_ASTROAI_CONFIG } from '@/app/astroai/types/config';

interface AdMobBannerProps {
  placement?: 'dashboard' | 'reports' | 'explore' | 'chat';
  className?: string;
}

export function AdMobBanner({ placement = 'dashboard', className = '' }: AdMobBannerProps) {
  const [admobConfig, setAdmobConfig] = useState(DEFAULT_ASTROAI_CONFIG.admob);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/astroai/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config?.admob) {
          setAdmobConfig(data.config.admob);
        }
      })
      .catch(() => {});
  }, []);

  if (!admobConfig.enabled || dismissed) {
    return null;
  }

  // Check placement rule
  if (placement === 'dashboard' && !admobConfig.showOnDashboard) return null;
  if (placement === 'reports' && !admobConfig.showInReports) return null;
  if (placement === 'explore' && !admobConfig.showInExplore) return null;
  if (placement === 'chat' && !admobConfig.showInChat) return null;

  return (
    <div className={`w-full my-3 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-100 via-indigo-50/50 to-slate-100 border border-slate-200/90 shadow-2xs p-2 text-center select-none ${className}`}>
      <div className="flex items-center justify-between px-2 pb-1 text-[9px] font-bold text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Sponsored Ad • Google AdMob ({admobConfig.bannerAdUnitId.slice(-6)})</span>
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="hover:text-slate-600 transition-colors p-0.5"
          title="Dismiss ad"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Ad Banner Body */}
      <a
        href="https://kangleiastro.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white rounded-xl p-2.5 border border-slate-200/70 hover:border-indigo-300 transition-all text-left"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-sm font-black shrink-0">
              💎
            </div>
            <div>
              <strong className="text-xs text-slate-800 font-bold block truncate">
                Certified Vedic Gems &amp; Rudraksha
              </strong>
              <span className="text-[10px] text-slate-500 block truncate">
                Lab certified astrological energization &amp; free shipping.
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#667EEA] text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
            <span>Shop</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </span>
        </div>
      </a>
    </div>
  );
}
