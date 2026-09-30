'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Moon,
  Sun,
  Flame,
  Star,
  Layers,
  Heart,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  Shield,
  Activity,
  Zap,
  Volume2
} from 'lucide-react';
import { BirthProfile } from '../types';
import { calculateZodiacSign, calculateCompatibilityScore, TAROT_CARDS, ZODIAC_SIGNS } from '../services/astrologyEngine';
import { AdMobBanner } from './AdMobBanner';

interface ExploreTabProps {
  activeProfile: BirthProfile;
  onOpenTarot: () => void;
  onOpenGuru: () => void;
  onOpenKundli: () => void;
  onOpenCompatibility: () => void;
}

export function ExploreTab({
  activeProfile,
  onOpenTarot,
  onOpenGuru,
  onOpenKundli,
  onOpenCompatibility,
}: ExploreTabProps) {
  const zodiac = calculateZodiacSign(activeProfile.dateOfBirth);

  // Sign Matcher quick state
  const [partnerSign, setPartnerSign] = useState<string>('Aries');
  const quickCompat = calculateCompatibilityScore(zodiac.name, partnerSign);

  // Daily Panchang Data
  const panchang = {
    tithi: 'Shukla Paksha Dashami',
    nakshatra: 'Purva Phalguni (Until 16:45)',
    yoga: 'Siddhi Yoga',
    karana: 'Gara Karana',
    abhijitMuhurat: '11:48 AM – 12:36 PM',
    rahuKalam: '01:30 PM – 03:00 PM',
    moonSign: 'Leo (Simha)',
    sunSign: 'Leo (Simha)',
  };

  return (
    <div className="p-4 space-y-4 pb-20 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-serif leading-tight">
            Cosmic Explore
          </h2>
          <p className="text-[11px] text-slate-500">
            Panchang, live planetary transits &amp; celestial events
          </p>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-xs">
          <Compass className="w-5 h-5 animate-[spin_30s_linear_infinite]" />
        </div>
      </div>

      {/* Moon Phase & Planetary Transits Card */}
      <div className="bg-gradient-to-tr from-[#090D2A] via-[#141C48] to-[#2D1B4E] rounded-3xl p-5 text-white shadow-md relative overflow-hidden space-y-3">
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5" />
            Moon Phase • Waxing Gibbous
          </span>
          <span className="text-[10px] text-indigo-200 bg-white/10 px-2 py-0.5 rounded-full">
            78% Illumination
          </span>
        </div>

        <div className="flex items-center gap-4 py-1">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🌔
          </div>
          <div>
            <h4 className="text-sm font-black text-white font-serif">
              Chandra in {panchang.moonSign}
            </h4>
            <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
              High creative drive and radiant willpower. Ideal for public speaking and self-expression.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] text-indigo-200">
          <div>Next Purnima: <strong className="text-white">Sep 29, 2026</strong></div>
          <div>Transit: <strong className="text-white">Mars in Libra</strong></div>
        </div>
      </div>

      {/* Today's Vedic Panchang */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Today&apos;s Vedic Panchang
          </span>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            Live Vedic Muhurat
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block font-medium">Tithi</span>
            <strong className="text-slate-800">{panchang.tithi}</strong>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block font-medium">Nakshatra</span>
            <strong className="text-slate-800 truncate block">{panchang.nakshatra}</strong>
          </div>
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
            <span className="text-[10px] text-emerald-700 block font-medium">✨ Abhijit Muhurat</span>
            <strong className="text-emerald-900">{panchang.abhijitMuhurat}</strong>
          </div>
          <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200/80">
            <span className="text-[10px] text-rose-700 block font-medium">⚠️ Rahu Kalam</span>
            <strong className="text-rose-900">{panchang.rahuKalam}</strong>
          </div>
        </div>
      </div>

      {/* AdMob Banner Sponsored Slot */}
      <AdMobBanner placement="explore" />

      {/* Daily Tarot Quick Draw */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/80 rounded-3xl p-4 border border-indigo-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Daily Tarot Card Draw
          </span>
          <span className="text-[9px] uppercase font-bold bg-white text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
            Intuitive
          </span>
        </div>
        <p className="text-xs text-slate-600">
          Draw an intuitive Arcana archetype for love, vocational clarity, or spiritual alignment today.
        </p>
        <button
          onClick={onOpenTarot}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-xs font-bold shadow-xs hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
        >
          <span>Draw Tarot Card</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Compatibility Matcher */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-500" />
            Quick Zodiac Matcher
          </span>
          <span className="text-[10px] text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-full">
            Synastry Radar
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex-1 p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
            <span className="text-[9px] text-indigo-600 uppercase font-bold block">You</span>
            <strong className="text-slate-800">{zodiac.name}</strong>
          </div>

          <span className="text-slate-400 font-black">+</span>

          <div className="flex-1 p-2 rounded-xl bg-pink-50 border border-pink-100 text-center">
            <span className="text-[9px] text-pink-600 uppercase font-bold block">Partner</span>
            <select
              value={partnerSign}
              onChange={(e) => setPartnerSign(e.target.value)}
              className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none w-full text-center"
            >
              {ZODIAC_SIGNS.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Cosmic Synergy</span>
            <span className="text-sm font-black text-indigo-600 font-serif">
              {quickCompat.score}% • {quickCompat.rating}
            </span>
          </div>
          <button
            onClick={onOpenCompatibility}
            className="text-[11px] font-bold text-[#667EEA] hover:underline flex items-center gap-1"
          >
            <span>Full Analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Daily Cosmic Mantra */}
      <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-300/40 text-amber-950 space-y-1">
        <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-amber-600" />
          Today&apos;s Energizing Mantra
        </span>
        <h5 className="text-xs font-black font-serif italic text-slate-900">
          &ldquo;Om Suryaya Namaha • I honor the eternal solar light within and lead with courage.&rdquo;
        </h5>
      </div>

    </div>
  );
}
