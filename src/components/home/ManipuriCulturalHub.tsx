'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  Heart,
  Home,
  Sun,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

const CULTURAL_ITEMS = [
  {
    title: 'Thaban Tatpa (থবান তাৎপা)',
    subtitle: 'Travel & Daily Activity Auspiciousness',
    description: 'Find out which weekdays are Tatpa (unfavorable for beginning journeys or work) and Tatnaba (free to travel). Follow Thasi Maikei to avoid inauspicious directions.',
    icon: Compass,
    tag: 'Tatpa / Tatnaba',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    href: '/panchang',
    badge: 'Daily Guide',
  },
  {
    title: 'Luhongba Thouro (লুহোংবা থৌরো)',
    subtitle: 'Manipuri Wedding Tithi & Muhurta',
    description: 'Auspicious wedding tithi and nakshatra calendar for Meitei marriage ceremony. Cross-verified with 36-Gun Ashtakoot compatibility matching.',
    icon: Heart,
    tag: 'Marriage Muhurta',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    href: '/matching',
    badge: 'Wedding Tithi',
  },
  {
    title: 'Yumsharol (য়ুমশারোল)',
    subtitle: 'Traditional Meitei House Architecture',
    description: 'Authentic ancestral guidance on foundation laying, boundary measurement, first pillar (Yumbi) erection, and East/North door orientation in Kangleipak.',
    icon: Home,
    tag: 'House Architecture',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    href: '/manipuri_kuthi_yengba',
    badge: 'Yumsa Thouro',
  },
  {
    title: 'Numit Leppa (নুমিৎ লেপ্পা)',
    subtitle: 'Auspicious Day & Ceremony Selection',
    description: 'Select favorable days for newborn naming (Chajumba), first grain feeding, entering new home (Yum Changba), and commencing new commercial ventures.',
    icon: Sun,
    tag: 'Ceremonial Selection',
    tagColor: 'bg-sky-100 text-sky-800 border-sky-200',
    href: '/numit_leppa_yengba',
    badge: 'Shubh Tithi',
  },
];

export default function ManipuriCulturalHub() {
  return (
    <section className="py-14 md:py-18 bg-[#fffdfa] border-t border-[#f3e8d2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Ancestral Wisdom & Meitei Traditions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0f172a] mb-3">
            Authentic Manipuri <span className="text-[#b45309]">Astrology & Panjika</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Preserving centuries of Manipuri cultural heritage — Thaban Tatpa, Luhongba Thouro, Yumsharol, and auspicious ceremonial day selection.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d97706] to-transparent mx-auto mt-4" />
        </div>

        {/* 4 Cards Grid - Styled Cleanly like manipuricalendar.in cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CULTURAL_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-white border border-[#f3e8d2] hover:border-[#d97706] shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#b45309] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-[#d97706]" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.tagColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#0f172a] mb-1 group-hover:text-[#b45309] transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-[#b45309] mb-3">
                    {item.subtitle}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <Link
                    href={item.href}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#fefcf6] group-hover:bg-[#d97706] text-[#b45309] group-hover:text-white border border-[#fde68a] group-hover:border-[#d97706] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>Check {item.badge}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
