'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import KuthiResultWorkstation from '@/components/dashboard/KuthiResultWorkstation';

export default function KuthiResultPage() {
  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/astrologer"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors bg-[#1c2541] px-4 py-2 rounded-xl border border-[#3a506b]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Astrologer Dashboard</span>
          </Link>
        </div>

        <KuthiResultWorkstation />
      </div>
    </div>
  );
}
