'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Sparkles, Moon, Sun, ShieldAlert } from 'lucide-react';

export default function MobileDisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Astrological Disclaimer</h1>
            <span className="text-[10px] text-slate-500 font-medium">Cultural & Spiritual Guidance Notice</span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          Statutory Notice
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5 text-xs leading-relaxed text-slate-700">
        
        {/* Core Regulatory Disclaimer Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 text-slate-900 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Official Astrological & Spiritual Disclaimer</span>
          </div>
          <p className="text-xs font-semibold leading-relaxed text-slate-800 bg-white/70 p-3.5 rounded-xl border border-amber-200">
            &quot;Horoscope readings, Panchang muhurtas, and Kuthi analyses are provided for cultural, educational, and spiritual guidance only and should not replace professional financial, medical, psychiatric, or legal counsel.&quot;
          </p>
        </div>

        {/* Section 1 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>1. Traditional & Cultural Heritage Principles</span>
          </div>
          <p>
            The Panchang astronomical computations, Thaban (Tithi) determinations, Nakshatra alignments, and Janma Patrika interpretations provided in this application are derived from ancient Manipuri traditions (Vishuddha Siddhanta) and classical Vedic Jyotish scripture.
          </p>
          <p>
            Astrology is an interpretive cultural science based on planetary symbology and faith traditions. Predictive outcomes can vary based on individual choices, karma, and personal circumstance.
          </p>
        </div>

        {/* Section 2 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>2. No Guarantee of Outcomes</span>
          </div>
          <p>
            While our empaneled astrologers strive for the highest degree of scriptural accuracy in chart preparation and horoscope review, Kanglei Astro makes no warranty or guarantee regarding specific life events, matrimonial compatibility, financial investments, or medical cures.
          </p>
          <p>
            Users are advised to exercise their own discretion and logic when making critical life, legal, or health decisions.
          </p>
        </div>

        {/* Section 3 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
            <Moon className="w-4 h-4 text-amber-600" />
            <span>3. Community Content in Leipung</span>
          </div>
          <p>
            Opinions, ritual interpretations, and statements posted by community users on the Leipung feed reflect their personal viewpoints and do not necessarily represent the official position of Kanglei Astro or its astrologer board.
          </p>
        </div>

      </main>
    </div>
  );
}
