'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AstrologerDesktopView = dynamic(
  () => import('@/components/dashboard/AstrologerDesktopView'),
  {
    ssr: false,
    loading: () => <DashboardLoading title="Loading Desktop Guru Portal..." />
  }
);

const AstrologerMobileView = dynamic(
  () => import('@/components/dashboard/AstrologerMobileView'),
  {
    ssr: false,
    loading: () => <DashboardLoading title="Loading Mobile Guru Portal..." />
  }
);

function DashboardLoading({ title = "Loading Astrologer Portal..." }: { title?: string }) {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center text-slate-900 p-6">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-14 h-14 rounded-full border-4 border-amber-300 border-t-[#d97706] animate-spin" />
        <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-[#d97706] to-[#fbbf24] opacity-30 animate-pulse" />
      </div>
      <span className="font-serif text-[#b45309] text-base font-bold tracking-wide">
        KangleiAstro
      </span>
      <span className="text-xs text-[#d97706] mt-1 font-mono">
        {title}
      </span>
    </div>
  );
}

export default function AstrologerDashboardPage() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (isDesktop === null) {
    return <DashboardLoading />;
  }

  return isDesktop ? <AstrologerDesktopView /> : <AstrologerMobileView />;
}
