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
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const checkDeviceAndSetMode = () => {
      // Check if user explicitly set a manual override in current session
      const savedOverride = sessionStorage.getItem('astro_view_mode_override') as 'desktop' | 'mobile' | null;
      if (savedOverride) {
        setViewMode(savedOverride);
        setIsManualOverride(true);
        return;
      }

      // Automatically determine mode: screen width < 1024px or mobile user agent = mobile view, >= 1024px = desktop view
      const isMobileScreen = window.innerWidth < 1024;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobileScreen || isMobileUA) {
        setViewMode('mobile');
      } else {
        setViewMode('desktop');
      }
    };

    checkDeviceAndSetMode();

    // Listen to resize events dynamically
    const handleResize = () => {
      const savedOverride = sessionStorage.getItem('astro_view_mode_override');
      if (!savedOverride) {
        if (window.innerWidth < 1024) {
          setViewMode('mobile');
        } else {
          setViewMode('desktop');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleView = (mode: 'desktop' | 'mobile') => {
    setViewMode(mode);
    setIsManualOverride(true);
    sessionStorage.setItem('astro_view_mode_override', mode);
  };

  const handleResetToAuto = () => {
    sessionStorage.removeItem('astro_view_mode_override');
    setIsManualOverride(false);
    if (window.innerWidth < 1024) {
      setViewMode('mobile');
    } else {
      setViewMode('desktop');
    }
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
