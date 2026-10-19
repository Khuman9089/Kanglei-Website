'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, Heart, Sun, ArrowRight, Compass, Sparkles } from 'lucide-react';

const tools = [
  {
    title: 'Free Kundli Generator',
    icon: BarChart3,
    description: 'Generate your complete Vedic birth chart with planetary positions, Bhavas, and Vimshottari Dasha timeline.',
    badge: 'Instant 30+ Pages PDF',
    href: '/manipuri_free_kuthi',
  },
  {
    title: 'KP Astrology Workstation',
    icon: Compass,
    description: 'Nirayana Placidus cusps, 249 sub-lords, 4-fold significators (A-B-C-D), Horary Prashna, and qw.xlsm Result Sheets.',
    badge: 'Sub-Lord Engine',
    href: '/dashboard/astrologer',
  },
  {
    title: 'Kuthi Matching (Milan)',
    icon: Heart,
    description: 'Check marriage compatibility with 36-Gun Ashtakoot Milan scoring, Nadi dosha, and Manglik analysis.',
    badge: '36-Gun Milan',
    href: '/matching',
  },
  {
    title: 'Daily Rashiphal',
    icon: Sun,
    description: 'Read your daily Moon sign horoscope, lucky numbers, favorable color, and daily planetary transit predictions.',
    badge: 'All 12 Signs',
    href: '/horoscope',
  },
];

export default function FreeToolsSection() {
  return (
    <section className="py-14 md:py-18 bg-[#faf8f4] border-t border-[#f3e8d2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider inline-block mb-3">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#d97706]" />
            Instant Astrological Calculations
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a] mb-3">
            Free Vedic & KP <span className="text-[#b45309]">Astrology Tools</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            High-precision algorithmic astrology engines developed for astrologers, students, and seekers in Manipur.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d97706] to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link href={tool.href} key={idx} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="h-full p-6 sm:p-7 rounded-3xl bg-white border border-[#f3e8d2] hover:border-[#d97706] transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(217,119,6,0.04)] hover:shadow-[0_12px_35px_rgba(217,119,6,0.12)] flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Top Subtle Amber Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d97706] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-13 h-13 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706] group-hover:scale-110 shadow-xs transition-all duration-300">
                        <Icon className="w-7 h-7 text-[#d97706]" />
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {tool.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-[#0f172a] mb-2 group-hover:text-[#b45309] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-xs sm:text-sm font-medium mb-6">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#b45309] group-hover:text-[#d97706]">
                    <span>Access Tool</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
