'use client';

import React, { useState, useEffect, Suspense } from 'react';
import LeipungFeedView from '@/components/mobile-app/LeipungFeedView';
import { Smartphone, Monitor, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LeipungPageContent() {
  const [deviceMode, setDeviceMode] = useState<'pixel' | 'fullscreen'>('pixel');
  const [currentTime, setCurrentTime] = useState<string>('07:44');

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

  return (
    <div className="min-h-screen bg-[#0d0d0f] flex flex-col items-center justify-start sm:py-6 selection:bg-amber-400 selection:text-amber-950 font-sans">
      
      {/* Desktop Device Toolbar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md px-3 py-2 mb-3 rounded-2xl bg-[#1c1b1f] border border-amber-900/30 text-amber-200 text-xs font-mono shadow-md">
        <div className="flex items-center gap-2">
          <Link
            href="/app"
            className="p-1 rounded-lg hover:bg-white/10 text-amber-300 transition flex items-center gap-1 text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>App Home</span>
          </Link>
          <span className="text-stone-600">•</span>
          <span className="font-bold text-white font-sans">Leipung Community Feed</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDeviceMode(deviceMode === 'pixel' ? 'fullscreen' : 'pixel')}
            className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/40 text-[10px] font-sans font-bold flex items-center gap-1 transition cursor-pointer"
          >
            {deviceMode === 'pixel' ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
            <span>{deviceMode === 'pixel' ? 'Wide View' : 'Phone Frame'}</span>
          </button>
        </div>
      </div>

      {/* Android Device Mockup Frame */}
      <div
        className={`w-full transition-all duration-300 relative ${
          deviceMode === 'pixel'
            ? 'sm:max-w-[412px] sm:rounded-[44px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_12px_#1e1b18,0_0_0_14px_#38322a] overflow-hidden bg-[#faf8f5]'
            : 'max-w-2xl sm:rounded-2xl overflow-hidden'
        }`}
      >
        {/* Android Status Bar */}
        <div className="bg-[#121212] text-amber-100/90 text-[11px] px-5 pt-2 pb-1.5 flex items-center justify-between font-mono select-none sticky top-0 z-50">
          <span className="font-bold tracking-tight text-white">{currentTime}</span>
          <div className="flex items-center gap-2 text-[10px] text-zinc-300">
            <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 border border-zinc-700 font-sans">4G+</span>
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

        {/* Leipung Component */}
        <LeipungFeedView />
      </div>
    </div>
  );
}

export default function LeipungAppPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0f]" />}>
      <LeipungPageContent />
    </Suspense>
  );
}
