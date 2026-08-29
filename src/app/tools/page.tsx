'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ToolsPage() {
  const router = useRouter();

  useEffect(() => {
    // Strictly restrict public access — redirect clients & visitors to homepage
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0b132b] text-[#faf8f4] flex items-center justify-center p-6 text-center font-sans">
      <div className="space-y-3 max-w-md bg-[#1c2541] p-8 rounded-3xl border border-[#3a506b]">
        <h2 className="font-serif font-bold text-2xl text-[#fbbf24]">Astrologer Portal Exclusive</h2>
        <p className="text-xs text-gray-400">
          This area is restricted to empaneled astrologers inside their portal. Redirecting to home...
        </p>
      </div>
    </div>
  );
}
