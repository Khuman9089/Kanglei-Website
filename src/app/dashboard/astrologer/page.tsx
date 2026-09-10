'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Smartphone, Monitor } from 'lucide-react';

const AstrologerDesktopView = dynamic(
  () => import('@/components/dashboard/AstrologerDesktopView'),
  {
    ssr: false,
    loading: () => <DashboardLoading title="Loading Astrologer Desktop Portal..." />
  }
);

const AstrologerMobileView = dynamic(
  () => import('@/components/dashboard/AstrologerMobileView'),
  {
    ssr: false,
    loading: () => <DashboardLoading title="Loading Astrologer Mobile Portal..." />
  }
);

function DashboardLoading({ title = "Loading Astrologer Portal..." }: { title?: string }) {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0b132b] flex flex-col items-center justify-center text-slate-900 p-6 transition-colors">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-14 h-14 rounded-full border-4 border-amber-300 border-t-[#d97706] animate-spin" />
        <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-[#d97706] to-[#fbbf24] opacity-30 animate-pulse" />
      </div>
      <span className="font-serif text-[#b45309] dark:text-amber-400 text-base font-bold tracking-wide">
        kuthiyengpham
      </span>
      <span className="text-xs text-[#d97706] dark:text-amber-300 mt-1 font-mono">
        {title}
      </span>
    </div>
  );
}

export default function AstrologerDashboardPage() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Check saved preference first
    const saved = localStorage.getItem('astro_view_mode') as 'desktop' | 'mobile' | null;
    if (saved) {
      setViewMode(saved);
    } else {
      // Auto-detect mobile screen width on initial load
      if (window.innerWidth < 768) {
        setViewMode('mobile');
      }
    }
  }, []);

  const handleToggleView = (mode: 'desktop' | 'mobile') => {
    setViewMode(mode);
    localStorage.setItem('astro_view_mode', mode);
  };

  if (!mounted) {
    return <DashboardLoading title="Initializing Portal..." />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Floating View Switcher Toggle on Desktop (Always within the code / app shell) */}
      <div className="fixed bottom-4 right-4 z-50 hidden sm:flex items-center gap-1 p-1 rounded-2xl bg-[#0b132b]/90 dark:bg-black/90 backdrop-blur-md border border-amber-500/40 shadow-2xl">
        <button
          onClick={() => handleToggleView('desktop')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'desktop'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
          title="Switch to Full Desktop Workspace"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop View</span>
        </button>

        <button
          onClick={() => handleToggleView('mobile')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'mobile'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
          title="Switch to Mobile App View"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile View</span>
        </button>
      </div>

      {/* Render Selected View */}
      {viewMode === 'mobile' ? <AstrologerMobileView /> : <AstrologerDesktopView />}
    </div>
  );
}
