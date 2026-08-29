'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, FileText, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const DEFAULT_SERVICES = [
  {
    id: 's-1',
    title: 'Career & Financial Outlook',
    badge: 'Popular',
    description: 'In-depth analysis of job changes, business growth, wealth Yogas, and favorable timing for investments.',
    price: '₹1,499',
    cta: 'Book Now',
    link: '/kundli',
    icon: Video,
  },
  {
    id: 's-2',
    title: 'Marriage & Relationship Matching',
    badge: 'High Accuracy',
    description: 'Complete 36-Gun Ashtakoot Milan, Manglik Dosh analysis, and mental/emotional compatibility assessment.',
    price: '₹1,299',
    cta: 'Check Compatibility',
    link: '/matching',
    icon: FileText,
  },
  {
    id: 's-3',
    title: '1-on-1 Live Master Consultation',
    badge: 'Best Value',
    description: 'Direct face-to-face video consultation with our Master Vedic Astrologer with instant remedial guidance.',
    price: '₹2,499',
    cta: 'Book Consultation',
    link: 'https://wa.me/918837487801?text=Hi%20Master%20Astrologer,%20I%20want%20to%20book%20a%201-on-1%20Live%20Consultation',
    icon: MessageCircle,
  },
  {
    id: 's-4',
    title: 'Yearly Transit Outlook Report',
    badge: 'Annual Report',
    description: 'Detailed 20+ page annual forecast covering major planetary transits (Saturn, Jupiter, Rahu-Ketu).',
    price: '₹999',
    cta: 'Order Report',
    link: '/kundli/report',
    icon: Sparkles,
  },
];

export default function ServicesGrid() {
  const [liveServices, setLiveServices] = useState<any[]>(DEFAULT_SERVICES);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.services && data.services.length > 0) {
          setLiveServices(data.services);
        }
      })
      .catch((err) => console.error('Error fetching live services:', err));
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 bg-[#0b132b] text-[#faf8f4]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-[#faf8f4] mb-4">Our Sacred Services</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#c69214] to-transparent"></div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {liveServices.map((service, idx) => {
            const Icon = [Video, FileText, MessageCircle, Sparkles][idx % 4];
            const targetUrl = service.link || '/kundli';
            const isExternal = targetUrl.startsWith('http');

            return (
              <motion.div
                key={service.id || idx}
                variants={item}
                className="group p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#c69214]/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(198,146,20,0.1)] flex flex-col h-full relative"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#1c2541] flex items-center justify-center border border-[#3a506b] group-hover:border-[#c69214]/50 transition-colors">
                    <Icon className="w-7 h-7 text-[#c69214]" />
                  </div>
                  {service.badge && (
                    <span className="px-3 py-1 rounded-full bg-[#c69214]/20 text-[#f4d58d] text-xs font-bold border border-[#c69214]/40 uppercase tracking-wider">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-serif text-[#f4d58d] mb-3">{service.title}</h3>
                <p className="text-[#f5f0e8]/80 mb-6 flex-grow leading-relaxed text-sm font-medium">{service.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#3a506b]/50">
                  <span className="font-extrabold text-[#e0a96d] text-lg font-mono">{service.price}</span>

                  {isExternal ? (
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-1.5 transition-all"
                    >
                      <span>{service.cta || 'Book Now'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      href={targetUrl}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 flex items-center gap-1.5 transition-all"
                    >
                      <span>{service.cta || 'Book Now'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
