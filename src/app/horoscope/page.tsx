'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Sun, Sparkles, ChevronRight, Star, Calendar, Clock, Compass } from 'lucide-react';
import Link from 'next/link';

const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Aries', sanskrit: 'Mesha', dates: 'Mar 21 - Apr 19', element: 'Fire', lord: 'Mars', icon: '♈' },
  { id: 'taurus', name: 'Taurus', sanskrit: 'Vrishabha', dates: 'Apr 20 - May 20', element: 'Earth', lord: 'Venus', icon: '♉' },
  { id: 'gemini', name: 'Gemini', sanskrit: 'Mithuna', dates: 'May 21 - Jun 20', element: 'Air', lord: 'Mercury', icon: '♊' },
  { id: 'cancer', name: 'Cancer', sanskrit: 'Karka', dates: 'Jun 21 - Jul 22', element: 'Water', lord: 'Moon', icon: '♋' },
  { id: 'leo', name: 'Leo', sanskrit: 'Simha', dates: 'Jul 23 - Aug 22', element: 'Fire', lord: 'Sun', icon: '♌' },
  { id: 'virgo', name: 'Virgo', sanskrit: 'Kanya', dates: 'Aug 23 - Sep 22', element: 'Earth', lord: 'Mercury', icon: '♍' },
  { id: 'libra', name: 'Libra', sanskrit: 'Tula', dates: 'Sep 23 - Oct 22', element: 'Air', lord: 'Venus', icon: '♎' },
  { id: 'scorpio', name: 'Scorpio', sanskrit: 'Vrishchika', dates: 'Oct 23 - Nov 21', element: 'Water', lord: 'Mars', icon: '♏' },
  { id: 'sagittarius', name: 'Sagittarius', sanskrit: 'Dhanu', dates: 'Nov 22 - Dec 21', element: 'Fire', lord: 'Jupiter', icon: '♐' },
  { id: 'capricorn', name: 'Capricorn', sanskrit: 'Makara', dates: 'Dec 22 - Jan 19', element: 'Earth', lord: 'Saturn', icon: '♑' },
  { id: 'aquarius', name: 'Aquarius', sanskrit: 'Kumbha', dates: 'Jan 20 - Feb 18', element: 'Air', lord: 'Saturn', icon: '♒' },
  { id: 'pisces', name: 'Pisces', sanskrit: 'Meena', dates: 'Feb 19 - Mar 20', element: 'Water', lord: 'Jupiter', icon: '♓' },
];

export default function HoroscopeDirectoryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-4 sm:pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Page Header with BIGGER readable typography */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Vedic Moon Sign Forecast Hub
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#0f172a] leading-tight">
            Vedic Moon Sign <span className="text-[#b45309]">Horoscopes</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
            Select your Vedic Moon Sign (Rashi) to explore detailed planetary transit predictions for career, love, health, wealth, and prescribed remedies.
          </p>
        </div>

        {/* Global Period Selector Ribbon (Daily, Weekly, Monthly, Yearly) */}
        <div className="bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-4 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#d97706]" />
              <span className="font-serif font-bold text-lg text-[#0f172a]">Select Horoscope Timeframe</span>
            </div>
            <span className="text-xs font-bold text-[#b45309] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Live Sidereal Transit Calculations</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'daily', label: '☀️ Daily', desc: "Today's Transit" },
              { id: 'weekly', label: '📅 Weekly', desc: '7-Day Forecast' },
              { id: 'monthly', label: '🗓️ Monthly', desc: 'August 2026' },
              { id: 'yearly', label: '✨ Yearly', desc: '2026 Roadmap' },
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id as any)}
                className={`py-3 px-4 rounded-2xl border transition-all text-center ${
                  selectedPeriod === period.id
                    ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white border-[#d97706] shadow-md font-bold scale-[1.02]'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                }`}
              >
                <span className="text-base font-extrabold block leading-tight">{period.label}</span>
                <span className={`text-[11px] block mt-0.5 ${selectedPeriod === period.id ? 'text-amber-100' : 'text-gray-500'}`}>
                  {period.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 12 Zodiac Sign Grid (with BIGGER readable text) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ZODIAC_SIGNS.map((sign) => (
            <Link
              key={sign.id}
              href={`/horoscope/${sign.id}`}
              className="bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-xs hover:border-[#d97706] hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-3xl text-[#d97706] group-hover:scale-110 transition-transform">
                    {sign.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase border border-[#fde68a]">
                    {sign.element}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-2xl text-[#0f172a] mb-0.5">{sign.name}</h3>
                <span className="text-sm font-bold text-[#b45309] block mb-2">{sign.sanskrit} Rashi</span>
                <p className="text-xs text-gray-600 mb-4 font-medium">Lord: {sign.lord} • {sign.dates}</p>
              </div>

              <div className="pt-4 border-t border-[#f3e8d2] flex items-center justify-between text-sm font-extrabold text-[#d97706] group-hover:text-[#b45309]">
                <span>Read {selectedPeriod.toUpperCase()} Forecast</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}
