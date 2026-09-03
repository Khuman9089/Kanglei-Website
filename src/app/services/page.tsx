'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Heart, Video, Calendar, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const ICON_MAP: Record<string, any> = {
  's-1': Briefcase,
  's-2': Heart,
  's-3': Video,
  's-4': Calendar,
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.services) {
          setServices(data.services.filter((s: any) => s.active));
        }
      })
      .catch((err) => console.error('Error loading services:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans">
      <main className="flex-1 pt-4 sm:pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Sacred Consultations & Written Reports
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a]">
            Astrology <span className="text-[#b45309]">Services Directory</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Choose from comprehensive written horoscope reports or 1-on-1 live video consultations with automated UPI payment & verification.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-8 mb-16">
          {services.map((s) => {
            const Icon = ICON_MAP[s.id] || Sparkles;
            return (
              <div
                key={s.id}
                className="bg-white p-8 rounded-3xl border border-[#f3e8d2] shadow-sm hover:border-[#d97706] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706] shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-2xl text-[#0f172a]">{s.title}</h3>
                        <span className="px-2.5 py-0.5 rounded bg-[#fef3c7] text-[#b45309] text-[10px] font-extrabold uppercase border border-[#fde68a]">
                          {s.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                    {s.features.map((feat: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-auto md:text-right border-t md:border-t-0 md:border-l border-[#f3e8d2] pt-4 md:pt-0 md:pl-8 flex flex-row md:flex-col items-center md:items-end justify-between gap-4 shrink-0">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Investment</span>
                    <span className="text-3xl font-extrabold text-[#b45309]">{s.price}</span>
                  </div>

                  <Link
                    href={s.link || '/booking'}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>{s.cta || 'Book Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="bg-[#fef3c7] p-8 rounded-3xl border border-[#fde68a] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#fde68a] flex items-center justify-center text-[#d97706]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xl text-[#0f172a]">100% Confidentiality & Satisfaction</h4>
              <p className="text-xs text-[#78350f] mt-1">All birth details remain encrypted. Manual UPI verification ensures immediate booking confirmation.</p>
            </div>
          </div>
          <Link
            href="/booking"
            className="px-6 py-3 rounded-xl bg-[#0f172a] text-[#fbbf24] font-bold text-xs hover:bg-[#1e293b] transition-colors shrink-0"
          >
            Kuthi Yengba
          </Link>
        </div>

      </main>
    </div>
  );
}
