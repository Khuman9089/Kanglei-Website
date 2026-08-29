'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, Heart, Video, Calendar, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  's-1': Briefcase,
  's-2': Heart,
  's-3': Video,
  's-4': Calendar,
};

export default function FeaturedServices() {
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
    <section className="py-8 md:py-10 bg-[#fffdfa] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Personalized Guidance & Manual PDF Reports
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0f172a]">
            Featured Vedic <span className="text-[#b45309]">Astrology Services</span>
          </h2>
          <p className="text-gray-600 text-base mt-3 max-w-xl mx-auto">
            Choose from comprehensive written reports or 1-on-1 live video consultations tailored to your birth chart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => {
            const Icon = ICON_MAP[service.id] || Sparkles;
            return (
              <motion.div
                key={service.id || service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-7 rounded-3xl border border-[#f3e8d2] shadow-[0_10px_30px_rgba(217,119,6,0.04)] hover:border-[#d97706] transition-all hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706] shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#fef3c7] text-[#b45309] text-[10px] font-extrabold uppercase tracking-wider border border-[#fde68a]">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#0f172a] mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-6">{service.description}</p>

                  <ul className="space-y-2.5 mb-8 border-t border-[#f3e8d2] pt-4">
                    {service.features.map((feat: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#f3e8d2] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Price</span>
                    <span className="text-xl font-extrabold text-[#b45309]">{service.price}</span>
                  </div>

                  <Link
                    href={service.link || '/booking'}
                    className="py-2.5 px-5 rounded-xl bg-[#0f172a] text-[#fbbf24] font-bold text-xs hover:bg-[#1e293b] transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{service.cta || 'Book Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
