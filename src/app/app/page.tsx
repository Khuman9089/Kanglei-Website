'use client';

import React, { useState, Suspense } from 'react';
import AndroidAppHomeView from '@/components/mobile-app/AndroidAppHomeView';
import { Smartphone, Monitor } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function AppContent() {
  const [deviceMode, setDeviceMode] = useState<'pixel' | 'fullscreen'>('pixel');
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as any;

  return (
    <div className="min-h-screen bg-[#0d0d0f] flex flex-col items-center justify-start sm:py-6 selection:bg-amber-400 selection:text-amber-950 font-sans">
      
      {/* Desktop Device Toolbar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md px-3 py-2 mb-3 rounded-2xl bg-[#1c1b1f] border border-amber-900/30 text-amber-200 text-xs font-mono shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white font-sans">Android Native Preview</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDeviceMode(deviceMode === 'pixel' ? 'fullscreen' : 'pixel')}
            className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/40 text-[10px] font-sans font-bold flex items-center gap-1 transition"
          >
            {deviceMode === 'pixel' ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
            <span>{deviceMode === 'pixel' ? 'Wide View' : 'Phone Frame'}</span>
          </button>
          
          <Link
            href="/"
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-sans font-medium transition"
          >
            Exit to Web
          </Link>
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
        {/* Android Punch Hole Camera on device frame */}
        {deviceMode === 'pixel' && (
          <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50 border border-zinc-800 shadow-inner" />
        )}

        <AndroidAppHomeView initialTab={tabParam || 'home'} />
      </div>

      {/* Footer info for desktop view */}
      <div className="hidden sm:flex items-center gap-4 mt-5 text-[11px] text-zinc-400 font-mono">
        <span>Capacitor Android Ready</span>
        <span>•</span>
        <span>Standard AdMob 320x50</span>
        <span>•</span>
        <Link href="/panchang" className="hover:text-amber-400 underline">
          Vedic Panchang
        </Link>
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0f]" />}>
      <AppContent />
    </Suspense>
  );
}
