'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function MatchingPage() {
  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans antialiased">
      <main className="flex-1 pt-4 sm:pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col justify-center items-center text-center space-y-8">
        
        {/* Header Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            পক্ন-ৱাইনবা য়েংবা • Marriage Compatibility Portal
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a] tracking-tight">
            Kuthi <span className="text-[#b45309]">Matching</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto font-sans">
            Choose your preferred marriage compatibility assessment option below:
          </p>
        </div>

        {/* 3 CHOICE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          {/* CARD 1: YEK SALAI & MEITEI MATCHING (NEW FEATURED TOOL) */}
          <div className="bg-gradient-to-b from-[#fefcf6] to-white p-6 rounded-3xl border-2 border-amber-400 shadow-xl space-y-4 hover:border-amber-500 transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
              ★ Traditional Meitei
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase tracking-wider border border-amber-200 inline-block">
                ꯃꯅꯤꯄꯨꯔꯤ ꯌꯦꯛ ꯁꯂꯥꯏ • 100% Free
              </span>
              <h3 className="font-serif font-bold text-xl text-[#0f172a]">Yek Salai &amp; Meitei Matchmaking</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Evaluates Salai Taret exogamy rules (Yek Thoknaba vs Yek Khekpa), Nga-Cheenga totems, Manglik mutual cancellation, and 36-Gun Milan.
              </p>
            </div>

            <Link
              href="/matching/yek-salai"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Launch Yek Salai Matchmaker →</span>
            </Link>
          </div>

          {/* CARD 2: FREE 36-GUN ASHTAKOOTA */}
          <div className="bg-white p-6 rounded-3xl border-2 border-[#f3e8d2] shadow-xl space-y-4 hover:border-[#d97706] transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                <Heart className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] font-extrabold text-[10px] uppercase tracking-wider border border-[#fde68a] inline-block">
                Instant Score Calculator
              </span>
              <h3 className="font-serif font-bold text-xl text-[#0f172a]">Free 36-Gun Ashtakoot Score</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Enter DOB, TOB, and POB for Groom and Bride to calculate instant 36-Gun Ashtakoot compatibility points &amp; 8-koot breakdown.
              </p>
            </div>

            <Link
              href="/free_matching"
              className="w-full py-3 rounded-xl bg-[#0f172a] text-[#fbbf24] font-bold text-xs hover:bg-[#1e293b] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Go to Free Matching Form →</span>
            </Link>
          </div>

          {/* CARD 3: PAKNA WAINABA (PAID) */}
          <div className="bg-white p-6 rounded-3xl border-2 border-[#fde68a] shadow-xl space-y-4 hover:border-[#d97706] transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-extrabold text-[10px] uppercase tracking-wider border border-green-200 inline-block">
                Master Astrologer Kuthi Report
              </span>
              <div className="flex justify-between items-baseline">
                <h3 className="font-serif font-bold text-xl text-[#0f172a]">Pakna-Wainaba</h3>
                <span className="font-mono text-lg font-black text-[#b45309]">₹1,299</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                Upload Kuthi paper photos for Groom & Bride for deep D1 & D9 Navamsha analysis, Manglik Dosh check, and PDF report delivered to WhatsApp.
              </p>
            </div>

            <Link
              href="/pakna_wainaba"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Heart className="w-4 h-4 text-white fill-white" />
              <span>Go to Pakna-Wainaba (₹1,299)</span>
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}
