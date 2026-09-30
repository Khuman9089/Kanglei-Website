'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Sun,
  Moon,
  User,
  Send,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Share2,
  Check,
  Shield,
  Heart,
  Briefcase,
  Coins,
  Activity,
  Calendar,
  Clock,
  MapPin,
  Home,
  Flame,
  Star,
  Layers,
  Zap,
  Crown,
  Lock,
  Users,
  Grid,
  FileText,
  HelpCircle,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Info,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Eye,
  Sliders,
  Settings,
  Bell,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { BirthProfile, ProfileType } from '../types';
import {
  calculateZodiacSign,
  calculateNumerology,
  calculateLifeCycles,
  calculateYearlyPrediction,
  calculateCompatibilityScore,
  getDailyHoroscope,
  TAROT_CARDS,
  ZODIAC_SIGNS
} from '../services/astrologyEngine';
import { VedicKundliChart } from './VedicKundliChart';

interface DesktopStudioProps {
  activeProfile: BirthProfile;
  profiles: BirthProfile[];
  onSelectProfile: (id: string) => void;
  onEditProfile: (profile: BirthProfile) => void;
  onAddProfile: () => void;
  onOpenGuru: () => void;
  onOpenShare: () => void;
  onOpenPremium: () => void;
}

export function DesktopStudio({
  activeProfile,
  profiles,
  onSelectProfile,
  onEditProfile,
  onAddProfile,
  onOpenGuru,
  onOpenShare,
  onOpenPremium
}: DesktopStudioProps) {
  // Navigation within desktop dashboard
  const [activeView, setActiveView] = useState<string>('dashboard');

  // Astrological Data
  const zodiac = calculateZodiacSign(activeProfile.dateOfBirth);
  const numerology = calculateNumerology(activeProfile.dateOfBirth);
  const lifeCycles = calculateLifeCycles(activeProfile.dateOfBirth);
  const dailyHoroscope = getDailyHoroscope(activeProfile.dateOfBirth);
  const hasDetailedBirth = Boolean(activeProfile.dateOfBirth && activeProfile.timeOfBirth && activeProfile.birthPlace);

  // Selected Yearly Prediction Year
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const yearlyPrediction = calculateYearlyPrediction(activeProfile.dateOfBirth, selectedYear);

  // Compatibility State
  const [compatProfileBId, setCompatProfileBId] = useState<string>(profiles[1]?.id || profiles[0]?.id);
  const profileB = profiles.find((p) => p.id === compatProfileBId) || profiles[1] || activeProfile;
  const compatData = calculateCompatibilityScore(zodiac.name, calculateZodiacSign(profileB.dateOfBirth).name);

  // Tarot state
  const [drawnTarotCard, setDrawnTarotCard] = useState<typeof TAROT_CARDS[0] | null>(null);
  const [isFlippingCard, setIsFlippingCard] = useState(false);
  const [tarotPerspective, setTarotPerspective] = useState<'career' | 'love' | 'growth'>('career');

  // 7-day streak
  const [streakDays] = useState<number[]>([1, 2, 3, 4]);

  const drawNewCard = () => {
    setIsFlippingCard(true);
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * TAROT_CARDS.length);
      setDrawnTarotCard(TAROT_CARDS[randomIdx]);
      setIsFlippingCard(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* ============================================================== */}
      {/* TOP SUB-NAV BAR: Quick Deep-Dive Tabs */}
      {/* ============================================================== */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-1.5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 text-xs font-bold">
          {[
            { id: 'dashboard', label: 'Overview Dashboard', icon: Home },
            { id: 'personality', label: 'Personality', icon: User },
            { id: 'career', label: 'Career & Wealth', icon: Briefcase },
            { id: 'kundli', label: 'Vedic Kundli', icon: Grid },
            { id: 'yearly', label: '2026–2028 Forecast', icon: Sun },
            { id: 'compatibility', label: 'Compatibility', icon: Heart },
            { id: 'tarot', label: 'Daily Tarot', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeView === tab.id
                    ? 'bg-[#667EEA] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenShare}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Share</span>
          </button>
          <button
            onClick={onOpenPremium}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-xs hover:brightness-105 flex items-center gap-1.5 transition-all"
          >
            <Crown className="w-3.5 h-3.5 text-slate-950" />
            <span>Upgrade</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW: MAIN DASHBOARD OVERVIEW */}
      {/* ============================================================== */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Top Hero: Celestial Talisman & Transit Barometer */}
          <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/[0.04] rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Celestial Talisman & Zodiac Identity */}
              <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                
                {/* Luminous Zodiac Talisman */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-amber-400/40 animate-[spin_60s_linear_infinite]" />
                  <div className="absolute inset-2 rounded-full border border-purple-400/30 border-dashed animate-[spin_30s_linear_infinite_reverse]" />
                  
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 text-white flex items-center justify-center text-4xl shadow-[0_8px_25px_rgba(245,158,11,0.4)] ring-4 ring-amber-100">
                    {zodiac.symbol}
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                      {zodiac.element} Element
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black uppercase tracking-wider">
                      Ruled by {zodiac.rulingPlanet}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {zodiac.dates}
                    </span>
                  </div>

                  <h2 className="text-3xl font-black text-slate-900 font-serif tracking-tight">
                    {activeProfile.name}&apos;s Cosmic Matrix • {zodiac.name}
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                    {zodiac.trait}. Guided by high natural charisma, instinctual discernment, and proactive execution.
                  </p>

                  {/* Mode Label */}
                  <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      hasDetailedBirth
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${hasDetailedBirth ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                      <span>{hasDetailedBirth ? 'Detailed Birth Chart (Kundli)' : 'Quick DOB-Based Insight'}</span>
                    </span>

                    {!hasDetailedBirth && (
                      <button
                        onClick={() => onEditProfile(activeProfile)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline ml-1"
                      >
                        + Add Time &amp; Place
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Today's Transit Barometer (4 Energy Levels) */}
              <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    Today&apos;s Transit Barometer
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Auspicious Alignment
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1 text-slate-700">
                      <span>Vitality &amp; Physical Prana</span>
                      <span className="text-amber-600">92%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1 text-slate-700">
                      <span>Intuition &amp; Mental Clarity</span>
                      <span className="text-indigo-600">88%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-[88%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1 text-slate-700">
                      <span>Social &amp; Partnership Harmony</span>
                      <span className="text-pink-600">82%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full w-[82%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1 text-slate-700">
                      <span>Financial &amp; Career Drive</span>
                      <span className="text-emerald-600">94%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full w-[94%]" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Row 2: Today's Cosmic Message & 7-Day Cosmic Streak */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Today's Cosmic Message */}
            <div className="lg:col-span-7 bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-3 z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1.5 tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Today&apos;s Cosmic Oracle
                  </span>
                  <span className="text-[11px] text-indigo-200">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <blockquote className="text-base sm:text-lg font-serif italic text-slate-100 leading-relaxed">
                  &ldquo;{dailyHoroscope.cosmicMessage}&rdquo;
                </blockquote>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 z-10 text-xs">
                <div className="flex items-center gap-3 text-indigo-200">
                  <span>Lucky No: <strong className="text-white">{numerology.lifePathNumber}</strong></span>
                  <span>Color: <strong className="text-white">{dailyHoroscope.luckyColor}</strong></span>
                  <span>Day: <strong className="text-white">{dailyHoroscope.luckyDay}</strong></span>
                </div>
                <button
                  onClick={onOpenGuru}
                  className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ask AstroGuru</span>
                </button>
              </div>
            </div>

            {/* 7-Day Cosmic Streak */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Daily Ritual &amp; Journey
                  </span>
                  <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-black">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>4 Day Streak</span>
                  </div>
                </div>

                <h4 className="text-base font-black text-slate-900 mt-1 font-serif">
                  7-Day Cosmic Ascension
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Engage daily to deepen your planetary transit awareness.
                </p>
              </div>

              <div className="grid grid-cols-7 gap-2 pt-4">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isDone = streakDays.includes(day);
                  return (
                    <div
                      key={day}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-[#10B981] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : `D${day}`}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 12 Bento Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 font-serif">
                Astrological Pillars &amp; Reports
              </h3>
              <span className="text-xs text-slate-500">
                Click any report to view comprehensive cosmic analysis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                {
                  id: 'personality',
                  title: 'Personality & Soul',
                  badge: 'Core',
                  icon: User,
                  color: 'from-blue-500 to-indigo-600',
                  highlight: `${zodiac.name} (${zodiac.element})`,
                  desc: 'Natural inclinations, strengths, temperament and blindspots.'
                },
                {
                  id: 'career',
                  title: 'Career & Ambition',
                  badge: 'Vocational',
                  icon: Briefcase,
                  color: 'from-indigo-600 to-purple-600',
                  highlight: 'Leadership & Mastery',
                  desc: 'Vocational trajectory, best fields, and 2026-2027 timeline.'
                },
                {
                  id: 'love',
                  title: 'Love & Synastry',
                  badge: 'Relationships',
                  icon: Heart,
                  color: 'from-pink-500 to-rose-600',
                  highlight: 'Compassionate Harmony',
                  desc: 'Partnership dynamics, commitment readiness, and guidance.'
                },
                {
                  id: 'finance',
                  title: 'Money & Wealth',
                  badge: 'Finance',
                  icon: Coins,
                  color: 'from-emerald-500 to-teal-600',
                  highlight: 'Calculated Compounding',
                  desc: 'Financial habits, asset expansion windows, and precautions.'
                },
                {
                  id: 'wellness',
                  title: 'Vitality & Prana',
                  badge: 'Health',
                  icon: Activity,
                  color: 'from-teal-500 to-cyan-600',
                  highlight: 'Solar Vitality',
                  desc: 'Energy management, bodily focal points, and daily rituals.'
                },
                {
                  id: 'life_cycles',
                  title: 'Life Cycles (7-Yr)',
                  badge: 'Evolution',
                  icon: Compass,
                  color: 'from-lime-500 to-emerald-600',
                  highlight: 'Current Growth Phase',
                  desc: 'Saturn shifts, maturity chapters, and key developmental gates.'
                },
                {
                  id: 'yearly',
                  title: '2026 Yearly Forecast',
                  badge: 'Forecast',
                  icon: Sun,
                  color: 'from-amber-400 to-orange-500',
                  highlight: 'Quarterly Milestones',
                  desc: 'Quarter-by-quarter breakdown of major opportunities in 2026.'
                },
                {
                  id: 'numerology',
                  title: 'Numerology Frequency',
                  badge: 'Numbers',
                  icon: Layers,
                  color: 'from-indigo-500 to-blue-600',
                  highlight: `Life Path ${numerology.lifePathNumber}`,
                  desc: 'Destiny, Soul Urge, and Birth Day vibration frequencies.'
                },
                {
                  id: 'compatibility',
                  title: 'Compatibility Match',
                  badge: 'Synastry',
                  icon: Users,
                  color: 'from-rose-500 to-pink-500',
                  highlight: `${compatData.score}% Synergy`,
                  desc: `Synergy with ${profileB.name} across emotional and intellectual axes.`
                },
                {
                  id: 'tarot',
                  title: 'Today’s Tarot Arcana',
                  badge: 'Intuitive',
                  icon: Sparkles,
                  color: 'from-purple-900 to-indigo-950',
                  highlight: 'Intuitive Draw',
                  desc: 'Draw an arcane archetype for love, career, and spiritual focus.'
                },
                {
                  id: 'kundli',
                  title: 'Detailed Birth Chart',
                  badge: hasDetailedBirth ? 'Kundli (D-1)' : 'Upgrade',
                  icon: Grid,
                  color: 'from-slate-900 to-indigo-950',
                  highlight: hasDetailedBirth ? 'Lagna Matrix Active' : 'Add Time & Place',
                  desc: hasDetailedBirth ? 'North Indian diamond chart, 12 Bhavas, and dignities.' : 'Requires exact birth time and location for planetary degrees.'
                },
                {
                  id: 'guru',
                  title: 'AstroGuru AI Assistant',
                  badge: 'AI Oracle',
                  icon: Sparkles,
                  color: 'from-gradient-to-r from-[#667EEA] to-[#764BA2]',
                  highlight: 'Conversational',
                  desc: 'Ask direct questions about career, relationships, and transits.'
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      if (card.id === 'guru') onOpenGuru();
                      else setActiveView(card.id);
                    }}
                    className="p-5 rounded-3xl border border-slate-200/90 bg-white transition-all text-left flex flex-col justify-between group shadow-2xs hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 duration-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                          {card.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {card.title}
                        </h4>
                        <span className="text-[11px] font-bold text-indigo-600 block mt-0.5">
                          {card.highlight}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {card.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors mt-3">
                      <span>Explore Report</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW: PERSONALITY DEEP-DIVE */}
      {/* ============================================================== */}
      {activeView === 'personality' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-serif">
                Personality Matrix • {zodiac.name}
              </h3>
              <p className="text-xs text-slate-500">Quick DOB-Based Insight for {activeProfile.name}</p>
            </div>
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              ← Back to Overview
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-950">
                  Core Archetype &amp; Driving Motivation
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Under your {zodiac.name} placement ({zodiac.element} element, ruled by {zodiac.rulingPlanet}), you naturally radiate vital presence, organizational instinct, and a demand for authenticity. You thrive when given direct autonomy and leadership scope.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                  Signature Strengths
                </span>
                <ul className="space-y-1.5 text-xs text-emerald-900">
                  {zodiac.strengths.map((s, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-950">
                  Growth Edges &amp; Evolutionary Blindspots
                </span>
                <ul className="space-y-1.5 text-xs text-rose-900">
                  {zodiac.challenges.map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-rose-600">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                  Favorable Vibrations
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Lucky Color</span>
                    <strong className="text-slate-900">{dailyHoroscope.luckyColor}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Favorable Day</span>
                    <strong className="text-slate-900">{dailyHoroscope.luckyDay}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW: VEDIC KUNDLI CHART */}
      {/* ============================================================== */}
      {activeView === 'kundli' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-serif">
                Vedic Birth Chart (D-1 Kundli)
              </h3>
              <p className="text-xs text-slate-500">
                {hasDetailedBirth ? 'Full Vedic calculation with Lahiri Ayanamsha' : 'Quick DOB-Based Insight (Ascendant estimated without exact time)'}
              </p>
            </div>
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              ← Back to Overview
            </button>
          </div>

          <VedicKundliChart
            kundli={{
              ascendantSign: hasDetailedBirth ? 'Leo' : zodiac.name,
              ascendantSignIndex: 5,
              ascendantDegree: 14.5,
              ascendantNakshatra: 'Purva Phalguni',
              chartRuler: 'Sun',
              dominantElement: 'Fire',
              ayanamsaName: 'Lahiri (Chitrapaksha)',
              planets: [
                { id: '1', name: 'Sun', glyph: '☉', signName: 'Leo', signIndex: 5, degreeInSign: 28.2, nakshatra: 'Uttara Phalguni', pada: 1, houseNumber: 1, dignity: 'Own Sign' },
                { id: '2', name: 'Moon', glyph: '☽', signName: 'Aries', signIndex: 1, degreeInSign: 12.4, nakshatra: 'Ashwini', pada: 4, houseNumber: 9, dignity: 'Friendly' },
                { id: '3', name: 'Mars', glyph: '♂', signName: 'Libra', signIndex: 7, degreeInSign: 6.8, nakshatra: 'Chitra', pada: 2, houseNumber: 3, dignity: 'Neutral' },
                { id: '4', name: 'Mercury', glyph: '☿', signName: 'Virgo', signIndex: 6, degreeInSign: 18.5, nakshatra: 'Hasta', pada: 3, houseNumber: 2, dignity: 'Exalted' },
                { id: '5', name: 'Jupiter', glyph: '♃', signName: 'Scorpio', signIndex: 8, degreeInSign: 22.1, nakshatra: 'Jyeshtha', pada: 2, houseNumber: 4, dignity: 'Friendly' },
                { id: '6', name: 'Venus', glyph: '♀', signName: 'Cancer', signIndex: 4, degreeInSign: 9.3, nakshatra: 'Pushya', pada: 2, houseNumber: 12, dignity: 'Neutral' },
                { id: '7', name: 'Saturn', glyph: '♄', signName: 'Aquarius', signIndex: 11, degreeInSign: 15.0, nakshatra: 'Shatabhisha', pada: 3, houseNumber: 7, dignity: 'Own Sign' },
                { id: '8', name: 'Rahu', glyph: '☊', signName: 'Libra', signIndex: 7, degreeInSign: 4.1, nakshatra: 'Chitra', pada: 4, houseNumber: 3 },
                { id: '9', name: 'Ketu', glyph: '☋', signName: 'Aries', signIndex: 1, degreeInSign: 4.1, nakshatra: 'Ashwini', pada: 2, houseNumber: 9 }
              ],
              bhavas: Array.from({ length: 12 }, (_, i) => ({
                houseNumber: i + 1,
                signName: ZODIAC_SIGNS[(4 + i) % 12].name,
                signIndex: ((4 + i) % 12) + 1,
                cuspDegree: 14.5,
                lord: ZODIAC_SIGNS[(4 + i) % 12].rulingPlanet
              }))
            }}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW: DAILY TAROT DECK */}
      {/* ============================================================== */}
      {activeView === 'tarot' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-serif">
                Today&apos;s Tarot Arcana
              </h3>
              <p className="text-xs text-slate-500">Intuitive archetype guidance for {activeProfile.name}</p>
            </div>
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              ← Back to Overview
            </button>
          </div>

          <div className="max-w-md mx-auto text-center space-y-6">
            {/* Perspective Picker */}
            <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
              {[
                { id: 'career', label: '💼 Career' },
                { id: 'love', label: '❤️ Love' },
                { id: 'growth', label: '🌱 Spiritual Growth' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setTarotPerspective(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    tarotPerspective === p.id
                      ? 'bg-[#667EEA] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Tarot Card Card Visual */}
            <div className="relative w-56 h-88 mx-auto rounded-3xl bg-gradient-to-b from-[#1E1B4B] via-[#2E1065] to-[#0F172A] p-4 text-white border-2 border-amber-400/50 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="border border-amber-300/30 rounded-2xl h-full p-4 flex flex-col justify-between">
                <div className="flex justify-between text-xs text-amber-300 font-serif">
                  <span>{drawnTarotCard?.arcana || 'Major Arcana XVII'}</span>
                  <span>✦</span>
                </div>

                <div className="space-y-2 my-auto">
                  <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-300 mx-auto flex items-center justify-center text-3xl shadow-inner">
                    {drawnTarotCard?.symbol || '⭐'}
                  </div>
                  <h4 className="text-lg font-black font-serif text-white">
                    {drawnTarotCard?.name || 'The Star'}
                  </h4>
                  <p className="text-[10px] text-indigo-200">
                    {drawnTarotCard?.arcana || 'Major Arcana'}
                  </p>
                </div>

                <div className="text-[9px] uppercase font-bold text-amber-300 tracking-wider">
                  Arcana Guidance
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {drawnTarotCard
                ? (tarotPerspective === 'career' ? drawnTarotCard.career : tarotPerspective === 'love' ? drawnTarotCard.love : drawnTarotCard.growth)
                : 'A period of renewed hope, mental clarity, and cosmic reassurance. Trust the long arc of your journey.'}
            </p>

            <button
              onClick={drawNewCard}
              disabled={isFlippingCard}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
            >
              {isFlippingCard ? 'Shuffling Deck...' : 'Draw Another Card'}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW: COMPATIBILITY MATCHER */}
      {/* ============================================================== */}
      {activeView === 'compatibility' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-serif">
                Synastry &amp; Cosmic Compatibility
              </h3>
              <p className="text-xs text-slate-500">Evaluate dynamic harmony between two profiles</p>
            </div>
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              ← Back to Overview
            </button>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Comparer Selector */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-center">
                <span className="text-[10px] uppercase font-bold text-indigo-600 block">Person 1</span>
                <strong className="text-base text-slate-900 block font-serif">{activeProfile.name}</strong>
                <span className="text-xs text-slate-500">({zodiac.name})</span>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 text-center">
                <span className="text-[10px] uppercase font-bold text-pink-600 block">Person 2</span>
                <select
                  value={compatProfileBId}
                  onChange={(e) => setCompatProfileBId(e.target.value)}
                  className="mt-1 bg-white border border-pink-300 rounded-xl px-2 py-1 text-xs font-bold text-slate-800"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.relationship})
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-500 block mt-1">
                  ({calculateZodiacSign(profileB.dateOfBirth).name})
                </span>
              </div>
            </div>

            {/* Score Ring */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-purple-950 text-white text-center space-y-3">
              <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                Overall Cosmic Synergy • {compatData.rating}
              </span>
              <div className="text-5xl font-black text-white font-serif">
                {compatData.score}%
              </div>
              <p className="text-xs text-indigo-200 max-w-md mx-auto leading-relaxed">
                {compatData.advice}
              </p>
            </div>

            {/* Breakdown Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Emotional</span>
                <strong className="text-indigo-600 text-base">{compatData.emotionalConnection.score}%</strong>
                <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{compatData.emotionalConnection.text}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Intellectual</span>
                <strong className="text-purple-600 text-base">{compatData.communication.score}%</strong>
                <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{compatData.communication.text}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Lifestyle</span>
                <strong className="text-pink-600 text-base">{compatData.lifestyleHarmony.score}%</strong>
                <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{compatData.lifestyleHarmony.text}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Long-Term</span>
                <strong className="text-emerald-600 text-base">{compatData.longTermPotential.score}%</strong>
                <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{compatData.longTermPotential.text}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW: YEARLY PREDICTION 2026-2028 */}
      {/* ============================================================== */}
      {activeView === 'yearly' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-serif">
                {selectedYear} Yearly Cosmic Forecast
              </h3>
              <p className="text-xs text-slate-500">Yearly cycle prediction for {activeProfile.name}</p>
            </div>

            <div className="flex items-center gap-2">
              {[2026, 2027, 2028].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedYear === yr
                      ? 'bg-[#667EEA] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-950">
              Annual Cosmic Theme: {yearlyPrediction.overallTheme}
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {yearlyPrediction.careerOutlook}
            </p>
          </div>

          {/* Monthly / Quarterly Roadmap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {yearlyPrediction.months.slice(0, 4).map((m) => (
              <div key={m.month} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase">
                  {m.month}
                </span>
                <h5 className="text-xs font-black text-slate-900">{m.focus}</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {m.opportunity}
                </p>
                <div className="text-[10px] text-indigo-600 font-bold">
                  Advice: {m.advice}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimers & Legal Notice */}
      <div className="text-center text-[11px] text-slate-400 py-3 space-y-1">
        <p>Astrology readings are for personal self-discovery and entertainment purposes.</p>
        <p>AstroVista does not provide medical, legal, or financial advisory services.</p>
      </div>

    </div>
  );
}
