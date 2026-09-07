'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AstrologerDesktopView = dynamic(
  () => import('@/components/dashboard/AstrologerDesktopView'),
  {
    ssr: false,
    loading: () => <DashboardLoading title="Loading Astrologer Portal..." />
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
        kuthiyengpham
      </span>
      <span className="text-xs text-[#d97706] mt-1 font-mono">
        {title}
      </span>
    </div>
  );
}

export default function AstrologerDashboardPage() {
  return <AstrologerDesktopView />;
}
