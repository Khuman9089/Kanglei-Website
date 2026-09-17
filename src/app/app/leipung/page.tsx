'use client';

import React, { useState, Suspense } from 'react';
import LeipungFeedView from '@/components/mobile-app/LeipungFeedView';
import { Smartphone, Monitor, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LeipungPageContent() {
  const [deviceMode, setDeviceMode] = useState<'pixel' | 'fullscreen'>('pixel');

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-start sm:py-6 selection:bg-amber-400 selection:text-amber-950 font-sans">
      
      {/* Desktop Device Toolbar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md px-3 py-2 mb-3 rounded-2xl bg-[#0f172a] border border-slate-800 text-slate-200 text-xs font-mono shadow-md">
        <div className="flex items-center gap-2">
          <Link
            href="/app"
            className="p-1 rounded-lg hover:bg-slate-800 text-amber-300 transition flex items-center gap-1 text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>App Home</span>
          </Link>
          <span className="text-slate-600">•</span>
          <span className="font-bold text-white font-sans">Leipung Community Feed</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDeviceMode(deviceMode === 'pixel' ? 'fullscreen' : 'pixel')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-sans font-bold flex items-center gap-1 transition cursor-pointer"
          >
            {deviceMode === 'pixel' ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
            <span>{deviceMode === 'pixel' ? 'Wide View' : 'Phone Frame'}</span>
          </button>
        </div>
      </div>

      {/* Edge-to-Edge Android App Frame */}
      <div
        className={`w-full transition-all duration-300 relative ${
          deviceMode === 'pixel'
            ? 'sm:max-w-[420px] sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_8px_#0f172a,0_0_0_10px_#1e293b] overflow-hidden bg-[#f8fafc]'
            : 'max-w-2xl sm:rounded-2xl overflow-hidden bg-[#f8fafc]'
        }`}
      >
        <LeipungFeedView />
      </div>
    </div>
  );
}

export default function LeipungAppPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090d16]" />}>
      <LeipungPageContent />
    </Suspense>
  );
}
