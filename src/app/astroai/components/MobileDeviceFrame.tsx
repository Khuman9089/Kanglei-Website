'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
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
  Download,
  FileDown,
  MessageCircle,
  Eye,
  Sliders,
  Settings,
  Bell,
  Compass
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

import { PlaceAutocompleteInput } from './PlaceAutocompleteInput';
import { AdMobBanner } from './AdMobBanner';
import { MobileAIGuruChat } from './MobileAIGuruChat';
import { ExploreTab } from './ExploreTab';
import { VedicKundliChart } from './VedicKundliChart';

interface MobileDeviceFrameProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  profiles: BirthProfile[];
  activeProfile: BirthProfile;
  onSelectProfile: (id: string) => void;
  onAddProfile: () => void;
  onEditProfile: (profile: BirthProfile) => void;
  onOpenGuru: () => void;
  onOpenShare: () => void;
  onOpenPremium: () => void;
  onSignOut?: () => void;
}

export function MobileDeviceFrame({
  currentScreen,
  onNavigate,
  profiles,
  activeProfile,
  onSelectProfile,
  onAddProfile,
  onEditProfile,
  onOpenGuru,
  onOpenShare,
  onOpenPremium,
  onSignOut
}: MobileDeviceFrameProps) {
  // Active Bottom Tab
  const [activeTab, setActiveTab] = useState<'home' | 'reports' | 'explore' | 'profile'>('home');

  // Mobile AI Chat Assistant state
  const [isMobileGuruOpen, setIsMobileGuruOpen] = useState(false);

  // Sign out confirmation toast state
  const [signOutNotice, setSignOutNotice] = useState(false);

  // Astrological Data for active profile
  const zodiac = calculateZodiacSign(activeProfile.dateOfBirth);
  const numerology = calculateNumerology(activeProfile.dateOfBirth);
  const dailyHoroscope = getDailyHoroscope(activeProfile.dateOfBirth);
  const hasDetailedBirth = Boolean(activeProfile.dateOfBirth && activeProfile.timeOfBirth && activeProfile.birthPlace);

  // Form states for birth entry
  const [inputName, setInputName] = useState(activeProfile.name);
  const [inputDOB, setInputDOB] = useState(activeProfile.dateOfBirth);
  const [inputTOB, setInputTOB] = useState(activeProfile.timeOfBirth || '');
  const [inputPOB, setInputPOB] = useState(activeProfile.birthPlace || '');
  const [inputCoords, setInputCoords] = useState<{ latitude?: number; longitude?: number }>({});

  // Report tab selection in Screen 8
  const [reportSubTab, setReportSubTab] = useState<'overview' | 'career' | 'love' | 'more'>('overview');

  // Tarot state in mobile
  const [drawnTarot, setDrawnTarot] = useState(TAROT_CARDS[0]);

  // Splash screen progress and auto-navigation timer
  const [splashProgress, setSplashProgress] = useState(0);

  // Mark user as onboarded in localStorage
  const markAsOnboarded = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('astrovista_has_onboarded', 'true');
      } catch (e) {}
    }
  };

  const handleSplashComplete = () => {
    let hasOnboarded = false;
    if (typeof window !== 'undefined') {
      try {
        hasOnboarded = localStorage.getItem('astrovista_has_onboarded') === 'true';
      } catch (e) {
        hasOnboarded = false;
      }
    }

    if (hasOnboarded) {
      onNavigate('home');
      setActiveTab('home');
    } else {
      onNavigate('login');
    }
  };

  useEffect(() => {
    if (currentScreen !== 'splash') {
      setSplashProgress(0);
      return;
    }

    setSplashProgress(0);
    let completed = false;
    const startTime = Date.now();
    const DURATION_MS = 2400; // 2.4 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / DURATION_MS) * 100);
      setSplashProgress(progress);

      if (elapsed >= DURATION_MS && !completed) {
        completed = true;
        clearInterval(interval);
        handleSplashComplete();
      }
    }, 30);

    return () => {
      completed = true;
      clearInterval(interval);
    };
  }, [currentScreen]);

  // Handle Sign out
  const handleSignOutClick = () => {
    setSignOutNotice(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('astrovista_has_onboarded');
      } catch (e) {}
    }
    setTimeout(() => {
      setSignOutNotice(false);
      if (onSignOut) {
        onSignOut();
      } else {
        onNavigate('splash');
      }
    }, 1200);
  };

  return (
    <div className="w-full h-full select-none flex flex-col font-sans relative overflow-hidden bg-[#0A0D2A]">
      
      {/* Mobile AI Chat Assistant Drawer */}
      <MobileAIGuruChat
        isOpen={isMobileGuruOpen}
        onClose={() => setIsMobileGuruOpen(false)}
        profile={activeProfile}
        zodiac={zodiac}
      />

      {/* Clean Native Mobile App Viewport (100% full-screen edge-to-edge) */}
      <div className="w-full h-full flex-1 bg-[#F8FAFF] flex flex-col relative overflow-hidden">

        {/* Sign Out Toast */}
        {signOutNotice && (
          <div className="absolute top-4 left-4 right-4 z-50 p-3 rounded-2xl bg-slate-900/95 text-white text-xs font-bold flex items-center justify-between shadow-2xl border border-white/10 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Signing out from AstroVista...</span>
            </div>
            <span className="text-[10px] text-slate-400">Done</span>
          </div>
        )}

          {/* Screen Content Viewport (Scrollable) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col relative">

            {/* ============================================================== */}
            {/* SCREEN 1: SPLASH SCREEN (Native Mobile App Launch) */}
            {/* ============================================================== */}
            {currentScreen === 'splash' && (
              <div 
                onClick={handleSplashComplete}
                className="w-full h-full flex-1 bg-gradient-to-b from-[#080B22] via-[#12183E] to-[#251545] text-white p-6 flex flex-col justify-between relative overflow-hidden cursor-pointer select-none"
              >
                {/* Ambient Astral Nebulas */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/25 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 h-72 bg-purple-600/30 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

                <div className="h-4" />

                {/* Central Emblem & Brand Identity */}
                <div className="text-center space-y-6 my-auto z-10">
                  <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-indigo-400/30 animate-[spin_35s_linear_infinite]" />
                    <div className="absolute inset-2.5 rounded-full border border-purple-400/25 border-dashed animate-[spin_20s_linear_infinite_reverse]" />
                    
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#667EEA] via-[#764BA2] to-[#EC4899] p-[3px] shadow-[0_0_50px_rgba(102,126,234,0.7)] flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-[#0B0F2A] flex items-center justify-center">
                        <Sparkles className="w-11 h-11 text-amber-300 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-white font-serif">
                      AstroVista
                    </h1>
                    <p className="text-[11px] font-bold tracking-widest text-indigo-200 uppercase">
                      Your Life • Your Stars • Your Future
                    </p>
                    <p className="text-xs text-slate-300/85 leading-relaxed max-w-[260px] mx-auto pt-1 font-light">
                      Personalized Vedic insights, daily horoscope &amp; cosmic intelligence.
                    </p>
                  </div>
                </div>

                {/* Native App Minimalist Loading Indicator */}
                <div className="space-y-3 z-10 pb-6 text-center">
                  <div className="w-48 mx-auto space-y-2">
                    <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#667EEA] via-[#A855F7] to-[#EC4899] rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                        style={{ width: `${splashProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-indigo-200/80 font-mono">
                      <span>{splashProgress < 50 ? 'Aligning stars...' : 'Synchronizing chart...'}</span>
                      <span>{Math.round(splashProgress)}%</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-indigo-300/60 pt-1">
                    Tap anywhere to skip
                  </p>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SCREEN 2: LOGIN / SIGN UP (With Top-Right Skip) */}
            {/* ============================================================== */}
            {currentScreen === 'login' && (
              <div className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#090D2A] via-[#141C48] to-[#1C1335] text-white">
                <div className="space-y-6 pt-2">
                  {/* Top Bar with Brand & Clean Skip Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="text-[11px] font-black tracking-wider uppercase text-indigo-200">AstroVista</span>
                    </div>
                    <button
                      onClick={() => {
                        markAsOnboarded();
                        onNavigate('home');
                        setActiveTab('home');
                      }}
                      className="text-xs font-bold text-amber-300 hover:text-white px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span>Skip to App</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-center space-y-1.5 pt-2">
                    <h2 className="text-2xl font-black text-white font-serif">Welcome Back</h2>
                    <p className="text-xs text-indigo-200/80">Log in to sync your charts and daily predictions</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => {
                        markAsOnboarded();
                        onNavigate('birth_entry');
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 shadow-sm flex items-center justify-center gap-3 text-xs font-bold text-slate-700 active:scale-[0.99] transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <button
                      onClick={() => {
                        markAsOnboarded();
                        onNavigate('birth_entry');
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 shadow-sm flex items-center justify-center gap-3 text-xs font-bold text-slate-700 active:scale-[0.99] transition-all"
                    >
                      <span className="text-base leading-none"></span>
                      <span>Continue with Apple</span>
                    </button>

                    <div className="relative flex items-center justify-center py-2">
                      <div className="border-t border-slate-200 w-full" />
                      <span className="bg-[#F8FAFF] px-3 text-[10px] text-slate-400 uppercase font-black absolute">
                        or
                      </span>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="Mobile Number / Email"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                      />
                    </div>

                    <button
                      onClick={() => {
                        markAsOnboarded();
                        onNavigate('birth_entry');
                      }}
                      className="w-full py-3.5 rounded-2xl bg-[#667EEA] text-white font-bold text-xs shadow-md hover:bg-indigo-600 active:scale-[0.98] transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </div>

                <div className="pb-4 text-center">
                  <button
                    onClick={() => {
                      markAsOnboarded();
                      onNavigate('home');
                      setActiveTab('home');
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SCREEN 3: BIRTH DETAILS ENTRY with Google Maps Autocomplete */}
            {/* ============================================================== */}
            {currentScreen === 'birth_entry' && (
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('login')}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-black text-[#1F2937] font-serif">
                        Your Birth Details
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Let&apos;s create your personalized astrology profile.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Date of Birth */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="date"
                          value={inputDOB}
                          onChange={(e) => setInputDOB(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Time of Birth */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Time of Birth (Optional)
                        </label>
                        <span className="text-[10px] text-indigo-600 font-medium">For Exact Kundli</span>
                      </div>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="time"
                          value={inputTOB}
                          onChange={(e) => setInputTOB(e.target.value)}
                          placeholder="--:--"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Place of Birth with Google Maps Places Autocomplete */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Place of Birth (Optional)
                        </label>
                        <span className="text-[10px] text-emerald-600 font-bold">Google Maps Geocoded</span>
                      </div>
                      <PlaceAutocompleteInput
                        value={inputPOB}
                        onChange={(placeName, coords) => {
                          setInputPOB(placeName);
                          if (coords) setInputCoords(coords);
                        }}
                        placeholder="Search city, district, country..."
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2 text-[10px] text-indigo-900 leading-relaxed">
                      <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>
                        Just your date of birth is enough for a quick reading. Add time &amp; place for your exact Lagna and Vedic Kundli chart.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pb-4">
                  <button
                    onClick={() => onNavigate('confirm_details')}
                    className="w-full py-3.5 rounded-2xl bg-[#667EEA] text-white font-bold text-xs shadow-md hover:bg-indigo-600 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      markAsOnboarded();
                      onNavigate('home');
                      setActiveTab('home');
                    }}
                    className="w-full py-2 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors text-center"
                  >
                    Skip for now →
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SCREEN 4: CONFIRM DETAILS (Blueprint Screen 4) */}
            {/* ============================================================== */}
            {currentScreen === 'confirm_details' && (
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('birth_entry')}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-black text-[#1F2937] font-serif">
                        Confirm Your Details
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Please check your information before proceeding.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Date of Birth
                        </span>
                        <p className="text-xs font-bold text-slate-800">
                          {inputDOB || activeProfile.dateOfBirth}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Time of Birth
                        </span>
                        <p className="text-xs font-bold text-slate-800">
                          {inputTOB || activeProfile.timeOfBirth || 'Not provided (Optional)'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Place of Birth
                        </span>
                        <p className="text-xs font-bold text-slate-800">
                          {inputPOB || activeProfile.birthPlace || 'Not provided (Optional)'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold">
                      {inputTOB && inputPOB ? 'Detailed Birth Chart Unlocked' : 'Quick DOB-Based Insight Active'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pb-4">
                  <button
                    onClick={() => {
                      markAsOnboarded();
                      onNavigate('home');
                      setActiveTab('home');
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    Save &amp; Continue
                  </button>
                  <button
                    onClick={() => onNavigate('birth_entry')}
                    className="w-full py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors text-center block"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SCREEN 5: HOME DASHBOARD (Blueprint Screen 5) */}
            {/* ============================================================== */}
            {currentScreen === 'home' && (
              <div className="p-4 space-y-4 pb-20">
                {/* Header Greeting */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#1F2937] font-serif leading-tight">
                      Good Morning, <br />
                      <span className="text-[#667EEA]">{activeProfile.name}</span>
                    </h2>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Here&apos;s your cosmic snapshot
                    </p>
                  </div>

                  {/* Ask AstroGuru AI Header Button */}
                  <button
                    onClick={() => setIsMobileGuruOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white text-[11px] font-black shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>Ask AI</span>
                  </button>
                </div>

                {/* Sun Sign Card (Gold/Orange Lion) */}
                <button
                  onClick={() => onNavigate('personality')}
                  className="w-full bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 rounded-3xl p-4 border border-amber-300/50 text-left flex items-center justify-between group shadow-sm hover:border-amber-400 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-md ring-2 ring-amber-200">
                      {zodiac.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-slate-900 font-serif">
                          {zodiac.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ({zodiac.dates})
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900 font-medium mt-0.5">
                        {zodiac.trait}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 6 Quick Category Icons Row */}
                <div className="grid grid-cols-6 gap-1.5 text-center">
                  {[
                    { id: 'personality', label: 'Personality', icon: '👤', bg: 'bg-blue-50 text-blue-600' },
                    { id: 'career', label: 'Career', icon: '💼', bg: 'bg-cyan-50 text-cyan-600' },
                    { id: 'love', label: 'Love', icon: '❤️', bg: 'bg-pink-50 text-pink-600' },
                    { id: 'finance', label: 'Money', icon: '💰', bg: 'bg-emerald-50 text-emerald-600' },
                    { id: 'wellness', label: 'Health', icon: '💚', bg: 'bg-teal-50 text-teal-600' },
                    { id: 'more_report', label: 'More', icon: '•••', bg: 'bg-slate-100 text-slate-600' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id === 'more_report' ? 'reports_overview' : item.id)}
                      className="flex flex-col items-center gap-1 p-1 rounded-xl hover:bg-white transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm shadow-xs ${item.bg}`}>
                        {item.icon}
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 truncate w-full">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Today's Insight Card */}
                <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Today&apos;s Insight
                    </span>
                    <button
                      onClick={() => onNavigate('horoscope')}
                      className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                    >
                      <span>Read More</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 font-medium leading-relaxed">
                    &ldquo;{dailyHoroscope.cosmicMessage}&rdquo;
                  </div>
                </div>

                {/* AdMob Banner Sponsored Slot on Home */}
                <AdMobBanner placement="dashboard" />

                {/* Quick Kundli / Free Access Card */}
                <div className="bg-gradient-to-tr from-[#1E1B4B] to-[#311042] text-white rounded-3xl p-4 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-amber-300 block">
                        {hasDetailedBirth ? 'Detailed Chart Active' : 'Vedic Kundli'}
                      </span>
                      <h4 className="text-xs font-black mt-0.5">
                        {hasDetailedBirth ? 'Vedic Lagna & 12 Bhavas' : 'Explore Vedic Kundli Chart (Free)'}
                      </h4>
                    </div>
                    <button
                      onClick={() => onNavigate('kundli')}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-[10px] hover:bg-amber-300 transition-colors"
                    >
                      {hasDetailedBirth ? 'View Chart' : 'View Kundli'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* EXPLORE PAGE TAB (Requested by User) */}
            {/* ============================================================== */}
            {currentScreen === 'explore' && (
              <ExploreTab
                activeProfile={activeProfile}
                onOpenTarot={() => onNavigate('tarot')}
                onOpenGuru={() => setIsMobileGuruOpen(true)}
                onOpenKundli={() => onNavigate('kundli')}
                onOpenCompatibility={() => onNavigate('compatibility')}
              />
            )}

            {/* ============================================================== */}
            {/* SCREEN 6: PROFILE MENU & SIGN OUT (Requested by User) */}
            {/* ============================================================== */}
            {currentScreen === 'profile_menu' && (
              <div className="p-5 space-y-4 flex-1 pb-20">
                <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg font-black shadow-sm">
                    {activeProfile.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-serif">
                      {activeProfile.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {activeProfile.relationship} • DOB: {activeProfile.dateOfBirth}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-sm text-xs font-bold text-slate-800">
                  <button
                    onClick={() => onNavigate('birth_entry')}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Edit2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span>My Birth Details</span>
                        <span className="block text-[10px] font-normal text-slate-400">
                          View / Edit your details
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => onNavigate('profiles')}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <span>Other Users</span>
                        <span className="block text-[10px] font-normal text-slate-400">
                          Manage profiles
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setIsMobileGuruOpen(true)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span>Ask AstroGuru AI</span>
                        <span className="block text-[10px] font-normal text-slate-400">
                          Conversational Astrology Oracle
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Working Sign Out Action */}
                  <button
                    onClick={handleSignOutClick}
                    className="w-full p-4 flex items-center justify-between hover:bg-red-50 text-red-600 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div>
                        <span>Sign Out</span>
                        <span className="block text-[10px] font-normal text-red-400">
                          Reset session &amp; return to start
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SCREEN 7: MANAGE MULTIPLE PROFILES */}
            {/* ============================================================== */}
            {currentScreen === 'profiles' && (
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between pb-20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('home')}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-black text-[#1F2937] font-serif">
                        Other Users
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Add and manage birth details for multiple people.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {profiles.map((p) => (
                      <div
                        key={p.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                          p.id === activeProfile.id
                            ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs'
                            : 'bg-white border-slate-200/90'
                        }`}
                      >
                        <button
                          onClick={() => onSelectProfile(p.id)}
                          className="flex items-center gap-3 text-left flex-1"
                        >
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                            {p.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{p.name}</span>
                              {p.id === activeProfile.id && (
                                <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                                  Active
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {p.dateOfBirth} • {p.relationship}
                            </span>
                          </div>
                        </button>

                        <button
                          onClick={() => onEditProfile(p)}
                          className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pb-4">
                  <button
                    onClick={onAddProfile}
                    className="w-full py-3.5 rounded-2xl bg-[#667EEA] text-white font-bold text-xs shadow-md hover:bg-indigo-600 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Profile</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SCREEN 8: DETAILED REPORTS OVERVIEW */}
            {/* ============================================================== */}
            {currentScreen === 'reports_overview' && (
              <div className="p-4 space-y-4 flex-1 pb-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('home')}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-base font-black text-[#1F2937] font-serif">
                        Your Astrology Report
                      </h2>
                      <p className="text-[10px] text-slate-400">
                        Based on your date of birth
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenShare}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs hover:text-indigo-600"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    Key Highlights (100% Free)
                  </span>

                  <div className="space-y-2.5 divide-y divide-slate-100 text-xs">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-600">♌ Sun Sign</span>
                      <strong className="text-slate-900">{zodiac.name}</strong>
                    </div>

                    <div className="flex items-center justify-between pt-2.5">
                      <span className="text-slate-600">⚡ Life Path Number</span>
                      <strong className="text-indigo-600">{numerology.lifePathNumber}</strong>
                    </div>

                    <div className="flex items-center justify-between pt-2.5">
                      <span className="text-slate-600">🐾 Birth Number</span>
                      <strong className="text-purple-600">{numerology.birthDayNumber}</strong>
                    </div>

                    <div className="flex items-center justify-between pt-2.5">
                      <span className="text-slate-600">🎨 Lucky Color</span>
                      <strong className="text-slate-900">{dailyHoroscope.luckyColor}</strong>
                    </div>

                    <div className="flex items-center justify-between pt-2.5">
                      <span className="text-slate-600">📅 Lucky Day</span>
                      <strong className="text-slate-900">{dailyHoroscope.luckyDay}</strong>
                    </div>
                  </div>
                </div>

                <AdMobBanner placement="reports" />

                <button
                  onClick={() => onNavigate('kundli')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Full Vedic Kundli Chart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* FULL KUNDLI VIEW INSIDE MOBILE */}
            {/* ============================================================== */}
            {currentScreen === 'kundli' && (
              <div className="p-4 space-y-4 pb-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('home')}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-base font-black text-slate-900 font-serif">
                        Vedic Kundli Chart
                      </h2>
                      <p className="text-[10px] text-slate-400">
                        {hasDetailedBirth ? 'Detailed Chart' : 'Quick DOB Insight'}
                      </p>
                    </div>
                  </div>
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
            {/* FULL TAROT VIEW INSIDE MOBILE */}
            {/* ============================================================== */}
            {currentScreen === 'tarot' && (
              <div className="p-4 space-y-4 pb-20 text-center">
                <div className="flex items-center justify-between text-left">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('explore')}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-base font-black text-[#1F2937] font-serif">
                        Today&apos;s Tarot Arcana
                      </h2>
                      <p className="text-[10px] text-slate-400">Intuitive archetype guidance</p>
                    </div>
                  </div>
                </div>

                <div className="w-48 h-72 mx-auto rounded-3xl bg-gradient-to-b from-[#1E1B4B] via-[#2E1065] to-[#0F172A] p-4 text-white border-2 border-amber-400/50 shadow-xl flex flex-col justify-between">
                  <div className="flex justify-between text-xs text-amber-300 font-serif">
                    <span>{drawnTarot.arcana}</span>
                    <span>✦</span>
                  </div>
                  <div className="space-y-1 my-auto">
                    <div className="text-4xl">{drawnTarot.symbol}</div>
                    <h4 className="text-base font-black font-serif text-white">{drawnTarot.name}</h4>
                  </div>
                  <div className="text-[9px] uppercase font-bold text-amber-300">
                    Arcana Guidance
                  </div>
                </div>

                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {drawnTarot.growth || drawnTarot.upright}
                </p>

                <button
                  onClick={() => {
                    const rnd = Math.floor(Math.random() * TAROT_CARDS.length);
                    setDrawnTarot(TAROT_CARDS[rnd]);
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white font-bold text-xs shadow-md"
                >
                  Draw Another Card
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* SCREEN 9: 100% FREE UPGRADE / SHARE ACCESS */}
            {/* ============================================================== */}
            {currentScreen === 'upgrade_screen' && (
              <div className="min-h-full flex-1 bg-gradient-to-b from-[#090D2A] via-[#141C48] to-[#2D1B4E] text-white p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="my-auto text-center space-y-6 z-10">
                  <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-purple-400/30 animate-[spin_50s_linear_infinite]" />
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#667EEA] to-[#764BA2] p-[2px] shadow-[0_0_50px_rgba(118,75,162,0.6)] flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-[#0E152E] flex items-center justify-center">
                        <Crown className="w-8 h-8 text-amber-300" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                      100% Free Forever
                    </span>
                    <h2 className="text-2xl font-black text-white font-serif tracking-tight">
                      All Insights Free
                    </h2>
                    <p className="text-xs text-indigo-200/90 leading-relaxed max-w-[240px] mx-auto">
                      All detailed Kundli charts, 2026 predictions and AI guidance are completely free for everyone.
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate('home')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white font-extrabold text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    Start Exploring Free
                  </button>

                  <div className="flex items-center justify-center gap-6 pt-2">
                    <button
                      onClick={onOpenShare}
                      className="flex flex-col items-center gap-1.5 text-[10px] text-slate-300 hover:text-white"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-indigo-300" />
                      </div>
                      <span>Share Report</span>
                    </button>

                    <button
                      onClick={onOpenShare}
                      className="flex flex-col items-center gap-1.5 text-[10px] text-slate-300 hover:text-white"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                        <FileDown className="w-4 h-4 text-purple-300" />
                      </div>
                      <span>Save PDF</span>
                    </button>

                    <button
                      onClick={onOpenShare}
                      className="flex flex-col items-center gap-1.5 text-[10px] text-slate-300 hover:text-white"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                        <Download className="w-4 h-4 text-pink-300" />
                      </div>
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="pb-4 text-center z-10">
                  <button
                    onClick={() => onNavigate('home')}
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ============================================================== */}
          {/* NATIVE BOTTOM NAVIGATION BAR (Home, Kundli, Ask AI, Explore, Profile) */}
          {/* ============================================================== */}
          {currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'birth_entry' && currentScreen !== 'confirm_details' && (
            <div className="h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 flex items-center justify-around shrink-0 z-30 select-none pb-[env(safe-area-inset-bottom)]">
              {/* Tab 1: Home */}
              <button
                onClick={() => {
                  setActiveTab('home');
                  onNavigate('home');
                }}
                className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                  activeTab === 'home' && currentScreen === 'home' ? 'text-[#667EEA]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-bold">Today</span>
              </button>

              {/* Tab 2: Reports / Kundli */}
              <button
                onClick={() => {
                  setActiveTab('reports');
                  onNavigate('reports_overview');
                }}
                className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                  activeTab === 'reports' || currentScreen === 'reports_overview' ? 'text-[#667EEA]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="text-[10px] font-bold">Reports</span>
              </button>

              {/* Tab 3: Center Floating "Ask AI" Button */}
              <button
                onClick={() => setIsMobileGuruOpen(true)}
                className="-mt-5 flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#667EEA] via-[#764BA2] to-[#EC4899] p-0.5 shadow-[0_4px_18px_rgba(102,126,234,0.5)] group-hover:scale-105 active:scale-95 transition-all">
                  <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-[#667EEA] uppercase tracking-wider">Ask AI</span>
              </button>

              {/* Tab 4: Explore */}
              <button
                onClick={() => {
                  setActiveTab('explore');
                  onNavigate('explore');
                }}
                className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                  activeTab === 'explore' || currentScreen === 'explore' ? 'text-[#667EEA]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Compass className="w-5 h-5" />
                <span className="text-[10px] font-bold">Explore</span>
              </button>

              {/* Tab 5: Profile */}
              <button
                onClick={() => {
                  setActiveTab('profile');
                  onNavigate('profile_menu');
                }}
                className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                  activeTab === 'profile' || currentScreen === 'profile_menu' ? 'text-[#667EEA]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-bold">Profile</span>
              </button>
            </div>
          )}

        </div>
      </div>
  );
}
