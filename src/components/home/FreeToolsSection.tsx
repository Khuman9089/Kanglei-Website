'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, Heart, Sun, ArrowRight } from 'lucide-react';

const tools = [
  {
    title: 'Free Kundli Generator',
    icon: BarChart3,
    description: 'Generate your complete Vedic birth chart with planetary positions, houses, and Vimshottari Dasha.',
    href: '/kundli'
  },
  {
    title: 'Kuthi Matching',
    icon: Heart,
    description: 'Check marriage compatibility with Ashtakoot Gun Milan scoring (out of 36).',
    href: '/matching'
  },
  {
    title: 'Daily Horoscope',
    icon: Sun,
    description: 'Read your daily Moon sign horoscope with transit predictions.',
    href: '/horoscope'
  }
];

export default function FreeToolsSection() {
  return (
    <section className="py-14 md:py-18 bg-[#faf8f4] border-t border-[#f3e8d2]">
      <div className="container mx-auto px-6">
        <div className="mb-10 text-center">
          <span className="px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider inline-block mb-3">
            Instant Calculations
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a] mb-3">
            Free Vedic <span className="text-[#b45309]">Astrology Tools</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d97706] to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link href={tool.href} key={idx}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="h-full group p-8 rounded-3xl bg-white border border-[#f3e8d2] hover:border-[#d97706] transition-all duration-300 hover:-translate-y-2 shadow-[0_4px_20px_rgba(217,119,6,0.04)] hover:shadow-[0_12px_35px_rgba(217,119,6,0.12)] flex flex-col items-center text-center relative overflow-hidden"
                >
                  {/* Top Subtle Amber Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d97706] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-16 h-16 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center mb-6 text-[#d97706] group-hover:scale-110 shadow-xs transition-all duration-300">
                    <Icon className="w-8 h-8 text-[#d97706]" />
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#0f172a] mb-3 group-hover:text-[#b45309] transition-colors">{tool.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm font-medium mb-6">{tool.description}</p>

                  <div className="mt-auto inline-flex items-center gap-1.5 text-xs font-extrabold text-[#b45309] group-hover:text-[#d97706]">
                    <span>Access Tool</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
