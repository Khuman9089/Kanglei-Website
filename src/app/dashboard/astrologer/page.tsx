'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
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

function AstrologerDashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const modeParam = searchParams.get('mode');
  const appParam = searchParams.get('app');

  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [mounted, setMounted] = useState<boolean>(false);
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const checkDeviceAndSetMode = () => {
      // 1. Explicit query parameter ?mode=mobile, ?app=true, or ?tab=panchang forces Mobile App View
      if (modeParam === 'mobile' || appParam === 'true' || tabParam === 'panchang') {
        setViewMode('mobile');
        setIsManualOverride(true);
        return;
      }

      // 2. Check if user explicitly set a manual override in current session
      const savedOverride = sessionStorage.getItem('astro_view_mode_override') as 'desktop' | 'mobile' | null;
      if (savedOverride) {
        setViewMode(savedOverride);
        setIsManualOverride(true);
        return;
      }

      // 3. Automatically determine mode from viewport / UA
      const isMobileScreen = window.innerWidth < 1024;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobileScreen || isMobileUA) {
        setViewMode('mobile');
      } else {
        setViewMode('desktop');
      }
    };

    checkDeviceAndSetMode();

    const handleResize = () => {
      const savedOverride = sessionStorage.getItem('astro_view_mode_override');
      if (!savedOverride && modeParam !== 'mobile' && appParam !== 'true' && tabParam !== 'panchang') {
        if (window.innerWidth < 1024) {
          setViewMode('mobile');
        } else {
          setViewMode('desktop');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [modeParam, appParam, tabParam]);

  const handleToggleView = (mode: 'desktop' | 'mobile') => {
    setViewMode(mode);
    setIsManualOverride(true);
    sessionStorage.setItem('astro_view_mode_override', mode);
  };

  if (!mounted) {
    return <DashboardLoading title="Initializing Portal..." />;
  }

  return (
    <div className="relative min-h-screen bg-[#faf8f5] dark:bg-[#070c1a]">
      {/* Floating View Switcher Toggle on Desktop */}
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
          <span>Mobile App View</span>
        </button>
      </div>

      {/* Render Selected View */}
      {viewMode === 'mobile' ? (
        <div className="min-h-screen flex justify-center bg-[#181410] sm:py-4">
          <div className="w-full max-w-[440px] bg-[#faf8f5] dark:bg-[#0b132b] sm:rounded-3xl shadow-2xl overflow-hidden border border-amber-900/30">
            <AstrologerMobileView initialTab={tabParam as any} />
          </div>
        </div>
      ) : (
        <AstrologerDesktopView />
      )}
    </div>
  );
}

export default function AstrologerDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading title="Loading Astrologer Portal..." />}>
      <AstrologerDashboardContent />
    </Suspense>
  );
}
