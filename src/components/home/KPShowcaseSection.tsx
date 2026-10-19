'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  FileText,
  Layers,
  CheckCircle2,
  Flame,
} from 'lucide-react';

export default function KPShowcaseSection() {
  return (
    <section className="py-14 md:py-18 bg-gradient-to-b from-[#faf8f4] via-white to-[#fffdfa] border-t border-[#f3e8d2] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Advanced Krishnamurti Paddhati (KP) System
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f172a] mb-3">
            KP Astrology & Authentic <span className="text-[#b45309]">qw.xlsm Result Sheets</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Experience high-precision Nirayana Placidus cusps, 249 sub-lords, 4-fold significators, real-time Dasha countdown, and authentic 3-mode Manipuri Kuthi documents.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d97706] to-transparent mx-auto mt-4" />
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Card 1: Placidus Cusps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-6 rounded-3xl bg-white border border-[#f3e8d2] hover:border-[#d97706] shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#b45309] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-[#d97706]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0f172a] mb-2 group-hover:text-[#b45309] transition-colors">
                Placidus Semi-Arc Cusps
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Calculates exact unequal 1–12 Bhavas with Krishnamurti Nirayana Ayanamsha (Lahiri − 5&apos; 29.5&quot;).
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#b45309]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Houses 1 to 12 Solved</span>
            </div>
          </motion.div>

          {/* Card 2: 249 Sub-Lords */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-6 rounded-3xl bg-white border border-[#f3e8d2] hover:border-[#d97706] shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#b45309] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6 text-[#d97706]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0f172a] mb-2 group-hover:text-[#b45309] transition-colors">
                249 Sub-Lords & Horary
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Micro-zodiac subdivisions (Sign, Star, Sub, Sub-Sub) and instant 1–249 Horary Prashna calculation engine.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#b45309]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full 249 Table Index</span>
            </div>
          </motion.div>

          {/* Card 3: Running Dasha Prediction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-6 rounded-3xl bg-white border border-[#f3e8d2] hover:border-[#d97706] shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#b45309] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-[#d97706]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0f172a] mb-2 group-hover:text-[#b45309] transition-colors">
                Real-Time Dasha Synthesis
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Active Mahadasha / Antardasha countdown with 4 life domain ratings (Career, Wealth, Marriage, Health).
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#b45309]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Progress & Remedies</span>
            </div>
          </motion.div>

          {/* Card 4: qw.xlsm Result Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="p-6 rounded-3xl bg-white border border-[#f3e8d2] hover:border-[#d97706] shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#b45309] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-[#d97706]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0f172a] mb-2 group-hover:text-[#b45309] transition-colors">
                qw.xlsm Result Sheets
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Matches authentic Excel format with 3 modes: Meitei Mayek (<code className="text-amber-800">Budha.ttf</code>), Sanamahi (<code className="text-amber-800">BLipi15</code>), and Vedic Result.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#b45309]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>One-Click Copy & Print</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Hero Interactive Callout Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1c2541] via-[#151f38] to-[#0b132b] text-white shadow-2xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                ASTROLOGER TOOL
              </span>
              <span className="text-amber-300 font-mono text-xs">
                Available in Astrologer Portal
              </span>
            </div>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
              Launch the Complete KP Astrology Workstation
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Explore live Ruling Planets (RP), 4-Fold Significators (Grades A-B-C-D), Horary 1–249 calculator, and instant printable Kuthi Horoscope Result Sheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard/astrologer"
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Open KP Workstation</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              href="/manipuri_free_kuthi"
              className="py-3 px-5 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5"
            >
              <span>Instant Free Kuthi</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
