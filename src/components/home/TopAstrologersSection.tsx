'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import Link from 'next/link';
import ConsultationBookingModal from '@/components/consultation/ConsultationBookingModal';

interface TopAstrologer {
  id: string;
  name: string;
  badge: string;
  avatar: string;
  specialties: string[];
  languages: string;
  experienceYears: number;
  rating: number;
  consultationsCount: string;
  pricePerMin: number;
  fixedRate?: number;
  actionButtonType?: 'both' | 'chat_only' | 'call_only';
  whatsappPhone: string;
  active?: boolean;
  showOnHome?: boolean;
}

export default function TopAstrologersSection() {
  const [astrologers, setAstrologers] = useState<TopAstrologer[]>([]);
  const [settings, setSettings] = useState({
    title: "Talk to Manipur's",
    highlightText: "Top Rated",
    subtitleTagline: "Every astrologer below has cleared a 4-step verification — qualification, panel interview, live audits, and a 30-day probation.",
    showRateOnHome: true,
    actionButtonType: 'both' as 'both' | 'chat_only' | 'call_only',
    rateMode: 'fixed' as 'fixed' | 'per_minute' | 'both' | 'none',
    defaultFixedRate: 499,
  });

  const [selectedAstrologerForModal, setSelectedAstrologerForModal] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'CHAT' | 'CALL'>('CHAT');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    // Instant client-side hydration from localStorage cache
    try {
      const cached = localStorage.getItem('kanglei_astrologer_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {}

    const fetchAstroData = () => {
      fetch('/api/astrologers?t=' + Date.now(), { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.astrologers && Array.isArray(data.astrologers)) {
            const featured = data.astrologers.filter((a: any) => a.active !== false && a.showOnHome !== false);
            setAstrologers(featured.length > 0 ? featured.slice(0, 4) : data.astrologers.filter((a: any) => a.active !== false).slice(0, 4));
          }
          if (data.settings) {
            setSettings((prev) => ({ ...prev, ...data.settings }));
            try {
              localStorage.setItem('kanglei_astrologer_settings', JSON.stringify(data.settings));
            } catch (e) {}
          }
        })
        .catch((err) => console.error('Error fetching astrologers:', err));
    };

    fetchAstroData();
    const interval = setInterval(fetchAstroData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartChatCall = (astro: TopAstrologer, type: 'Chat' | 'Call') => {
    setSelectedAstrologerForModal({
      id: astro.id,
      name: astro.name,
      avatar: astro.avatar,
      pricePerMin: astro.pricePerMin || 35,
      fixedRate: astro.fixedRate || settings.defaultFixedRate || 499,
      whatsappPhone: astro.whatsappPhone,
      specialties: astro.specialties,
    });
    setModalMode(type.toUpperCase() as 'CHAT' | 'CALL');
    setIsBookingModalOpen(true);
  };

  return (
    <section className="py-8 md:py-10 bg-[#fffdfa] text-[#0f172a] font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Top Header Row (Matching Reference Layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0f172a] leading-tight tracking-tight">
              {settings.title} <span className="text-[#c69214] font-serif">{settings.highlightText}</span> <br className="hidden sm:inline" />
              Astrologers
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
              {settings.subtitleTagline}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/astrologers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#c69214] text-[#b45309] font-bold text-sm hover:bg-[#c69214] hover:text-white transition-all shadow-xs"
            >
              <span>View all astrologers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Astrologers 4-Card Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {astrologers.map((astro, idx) => (
            <motion.div
              key={astro.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-5 rounded-3xl border border-[#f3e8d2] shadow-[0_10px_30px_rgba(217,119,6,0.05)] hover:shadow-xl hover:border-[#c69214] transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Avatar & Top Celebrity Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 p-0.5 shadow-sm">
                      <img
                        src={astro.avatar}
                        alt={astro.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    {/* Live Online Dot */}
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0 shadow-xs" />
                  </div>

                  {astro.badge && (
                    <span className="px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-[10px] font-extrabold tracking-wider uppercase border border-[#fde68a]">
                      {astro.badge}
                    </span>
                  )}
                </div>

                {/* Name & Verified Tick */}
                <div className="flex items-center gap-1.5 mb-2">
                  <h3 className="font-serif font-bold text-xl text-[#0f172a]">{astro.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                </div>

                {/* Specialty Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {astro.specialties.map((spec, sIdx) => (
                    <span key={sIdx} className="px-2.5 py-0.5 rounded-lg bg-gray-50 border border-gray-200/60 text-[11px] font-semibold text-gray-700">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Languages & Experience */}
                <div className="text-xs text-gray-600 space-y-1 mb-4">
                  <div className="font-medium truncate">{astro.languages}</div>
                  <div className="font-bold text-gray-800">{astro.experienceYears} yrs exp</div>
                </div>

                {/* Rating & Price Row */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mb-5">
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span className="font-extrabold text-[#0f172a]">{astro.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-[11px]">· {astro.consultationsCount}</span>
                  </div>

                  {settings.showRateOnHome !== false && settings.rateMode !== 'none' && (
                    <div className="text-right">
                      {settings.rateMode === 'fixed' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-extrabold text-base text-[#0f172a]">₹{astro.fixedRate || settings.defaultFixedRate || 499}</span>
                          <span className="text-[10px] text-[#b45309] font-bold bg-[#fef3c7] px-1.5 py-0.5 rounded border border-[#fde68a]">Fixed Fee</span>
                        </div>
                      ) : settings.rateMode === 'both' ? (
                        <div className="flex flex-col items-end">
                          <div className="flex items-baseline gap-1">
                            <span className="font-extrabold text-sm text-[#0f172a]">₹{astro.fixedRate || settings.defaultFixedRate || 499}</span>
                            <span className="text-[9px] text-[#b45309] font-bold">Fixed</span>
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium font-mono">
                            ₹{astro.pricePerMin || 35}/min
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-extrabold text-base text-[#0f172a]">₹{astro.pricePerMin || 35}</span>
                          <span className="text-[10px] text-gray-500 font-medium font-mono">/min</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Chat & Call Action Buttons (Controlled from Admin Panel or Astrologer Override) */}
              {(astro.actionButtonType || settings.actionButtonType) === 'chat_only' ? (
                <button
                  onClick={() => handleStartChatCall(astro, 'Chat')}
                  className="w-full py-2.5 px-4 rounded-full border border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Now</span>
                </button>
              ) : (astro.actionButtonType || settings.actionButtonType) === 'call_only' ? (
                <button
                  onClick={() => handleStartChatCall(astro, 'Call')}
                  className="w-full py-2.5 px-4 rounded-full border border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleStartChatCall(astro, 'Chat')}
                    className="w-full py-2 px-3 rounded-full border border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>

                  <button
                    onClick={() => handleStartChatCall(astro, 'Call')}
                    className="w-full py-2 px-3 rounded-full border border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>

      {/* MULTI-STEP CONSULTATION BOOKING MODAL */}
      <ConsultationBookingModal
        astrologer={selectedAstrologerForModal}
        mode={modalMode}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </section>
  );
}
