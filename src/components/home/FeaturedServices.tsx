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
  's-5': Sparkles,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const Icon = ICON_MAP[service.id] || Sparkles;
            const logoImage = service.iconUrl || service.imageUrl;
            return (
              <motion.div
                key={service.id || service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-[#f3e8d2] shadow-[0_4px_20px_rgba(217,119,6,0.04)] hover:border-[#d97706] transition-all hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706] shadow-xs overflow-hidden p-1 shrink-0">
                      {logoImage ? (
                        <img src={logoImage} alt={service.title} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    {service.badge && (
                      <span className="px-2.5 py-1 rounded-md bg-[#fef3c7] text-[#b45309] text-[10px] font-extrabold uppercase tracking-wider border border-[#fde68a]">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-base md:text-lg text-[#0f172a] mb-4 leading-snug">{service.title}</h3>
                </div>

                <div className="pt-4 border-t border-[#f3e8d2] flex items-center justify-between mt-3">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Price</span>
                    <span className="text-lg font-extrabold text-[#b45309]">{service.price}</span>
                  </div>

                  <Link
                    href={service.link || '/booking'}
                    className="py-2 px-3.5 rounded-xl bg-[#0f172a] text-[#fbbf24] font-bold text-xs hover:bg-[#1e293b] transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
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
