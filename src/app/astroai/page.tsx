'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageSquare,
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
  X,
  Home,
  Flame,
  Star,
  Layers,
  Zap,
  BookOpen,
  Settings,
  Bell,
  Sliders,
  Volume2,
  VolumeX,
  Award,
  Crown,
  Lock,
  Search,
  Sparkle,
  TrendingUp,
  Smile,
  Users,
  Compass as CompassIcon,
  RefreshCw,
  Copy,
  CheckCircle2,
  Info
} from 'lucide-react';

interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  sunSign: string;
  sunSignSymbol: string;
  sunSignDates: string;
  lifePathNumber: number;
  lifePathMeaning: string;
  birthNumber: number;
  birthNumberMeaning: string;
  element: string;
  elementMeaning: string;
}

const ZODIAC_LIST = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire' },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth' },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air' },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water' },
];

export default function AstroAIPage() {
  // Current Active Screen
  // 'splash' | 'dob_input' | 'home' | 'career' | 'love' | 'money' | 'health' | 'cycles' | 'prediction_2026' | 'compatibility' | 'tarot' | 'numerology' | 'oracle_ai' | 'community' | 'share' | 'profile'
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  
  // Navigation stack for back button
  const [screenHistory, setScreenHistory] = useState<string[]>(['home']);

  // Tab sub-states for multi-tab screens
  const [careerTab, setCareerTab] = useState<'overview' | 'best_fields' | 'timeline'>('overview');
  const [loveTab, setLoveTab] = useState<'overview' | 'compatibility' | 'timing'>('overview');
  const [moneyTab, setMoneyTab] = useState<'overview' | 'growth' | 'tips'>('overview');
  const [healthTab, setHealthTab] = useState<'overview' | 'fitness' | 'mental'>('overview');
  const [cyclesTab, setCyclesTab] = useState<'overview' | 'key_phases' | 'insights'>('overview');
  const [predictionTab, setPredictionTab] = useState<'overview' | 'monthly' | 'lucky_guide'>('overview');
  const [compatTypeTab, setCompatTypeTab] = useState<'love' | 'friends_business'>('love');

  // Input DOB Mode
  const [inputMode, setInputMode] = useState<'quick' | 'detailed'>('quick');

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Rahul',
    birthDate: '1995-08-15',
    birthTime: '10:30',
    birthPlace: 'New Delhi, India',
    sunSign: 'Leo',
    sunSignSymbol: '♌',
    sunSignDates: 'Jul 23 – Aug 22',
    lifePathNumber: 2,
    lifePathMeaning: 'Cooperation',
    birthNumber: 6,
    birthNumberMeaning: 'Love & Harmony',
    element: 'Fire',
    elementMeaning: 'Passion & Drive',
  });

  // Compatibility Selectors
  const [mySign, setMySign] = useState('Leo ♌');
  const [partnerSign, setPartnerSign] = useState('Sagittarius ♐');

  // Tarot State
  const [selectedTarot, setSelectedTarot] = useState<number | null>(null);
  const [tarotFlipped, setTarotFlipped] = useState(false);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'guru'; text: string }>>([
    { sender: 'guru', text: 'Namaste Rahul! I am AstroGuru, your personal celestial intelligence assistant. Ask me anything about your 2026 transits, love life, career direction, or Vedic chart!' }
  ]);
  const [queryInput, setQueryInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Share Notification Toast
  const [showShareToast, setShowShareToast] = useState(false);

  // Helper to change screen with history
  const navigateTo = (screen: string) => {
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen || 'home');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleSendMessage = () => {
    if (!queryInput.trim()) return;
    const userText = queryInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setQueryInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = `Based on your Leo Sun sign and Life Path 2 vibration, this period calls for balanced diplomacy. Jupiter's supportive aspect brings favorable momentum in career decisions and creative expression.`;
      if (userText.toLowerCase().includes('love') || userText.toLowerCase().includes('relationship')) {
        reply = `Your Venus harmony indicates strong relationship stabilization. High synergy is observed with Fire signs (Aries, Sagittarius) and Air signs (Libra, Gemini). Trust open communication.`;
      } else if (userText.toLowerCase().includes('money') || userText.toLowerCase().includes('career') || userText.toLowerCase().includes('job')) {
        reply = `For professional advancement, your 10th house indicates leadership, media, and entrepreneurial undertakings are highly favorable between 2026 and 2027. Avoid hasty financial commitments.`;
      }
      setChatMessages((prev) => [...prev, { sender: 'guru', text: reply }]);
      setIsAiTyping(false);
    }, 900);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white pb-20 md:pb-10">
      
      {/* ============================================================== */}
      {/* 1. SPLASH / ONBOARDING SCREEN (Cosmic Dark Hero) */}
      {/* ============================================================== */}
      {currentScreen === 'splash' && (
        <div className="min-h-screen bg-gradient-to-b from-[#090D1C] via-[#0E152E] to-[#1C1236] text-white flex flex-col justify-between p-6 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-64 bg-purple-600/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Top Header */}
          <div className="flex justify-between items-center z-10 pt-4">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              JYOTI AI
            </span>
            <button
              onClick={() => setCurrentScreen('home')}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-full bg-white/5 border border-white/10"
            >
              Skip
            </button>
          </div>

          {/* Center Wheel Artwork */}
          <div className="flex-1 flex flex-col items-center justify-center text-center z-10 py-6">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
              {/* Concentric Celestial Rings */}
              <div className="absolute inset-0 rounded-full border border-indigo-400/25 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-purple-400/20 border-dashed animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute inset-8 rounded-full border border-pink-400/25" />
              
              {/* Outer Zodiac Glyphs */}
              <div className="absolute inset-0 flex items-center justify-between px-2 text-indigo-300 text-xs font-serif opacity-80">
                <span>♈</span>
                <span>♎</span>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-between py-2 text-indigo-300 text-xs font-serif opacity-80">
                <span>♋</span>
                <span>♑</span>
              </div>

              {/* Center Glowing Celestial Emblem */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-500 p-1 shadow-[0_0_50px_rgba(139,92,246,0.5)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#0E152E] flex flex-col items-center justify-center text-center">
                  <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
                  <span className="text-[9px] font-bold text-indigo-200 mt-1 uppercase tracking-wider">Cosmic Key</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Your Future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200">
                in Your Hands
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xs mx-auto mt-3 leading-relaxed">
              Discover your path with the power of astrology, numerology, and cosmic wisdom.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {['Horoscope', 'Kundli', 'Numerology', 'Tarot', 'More'].map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-medium text-slate-200 backdrop-blur-md"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="space-y-4 z-10 pb-4 max-w-sm mx-auto w-full text-center">
            <button
              onClick={() => setCurrentScreen('dob_input')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-slate-400 font-medium">
              Join 10M+ people on their self-discovery journey
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. BIRTH DATE INPUT SCREEN (Clean White Minimalist Card) */}
      {/* ============================================================== */}
      {currentScreen === 'dob_input' && (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto w-full">
          {/* Top Bar */}
          <div className="flex items-center justify-between pt-2 pb-4">
            <button
              onClick={() => setCurrentScreen('splash')}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs hover:bg-slate-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 1 of 2</span>
            <div className="w-9" />
          </div>

          <div className="space-y-6 my-auto">
            {/* Title Header */}
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Enter Your Date of Birth
              </h2>
              <p className="text-xs text-slate-500">
                Get your personalized astrology insights in seconds.
              </p>
            </div>

            {/* Quick vs Detailed Toggle */}
            <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => setInputMode('quick')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  inputMode === 'quick'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quick (DOB Only)
              </button>
              <button
                onClick={() => setInputMode('detailed')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  inputMode === 'detailed'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Detailed</span>
                <Crown className="w-3.5 h-3.5 text-amber-500" />
              </button>
            </div>

            {/* Inputs Box */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Date of Birth
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-indigo-500 absolute left-3.5" />
                  <input
                    type="date"
                    value={userProfile.birthDate}
                    onChange={(e) => setUserProfile({ ...userProfile, birthDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {inputMode === 'detailed' && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      placeholder="e.g. Rahul"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Birth Time
                      </label>
                      <div className="relative flex items-center">
                        <Clock className="w-4 h-4 text-indigo-500 absolute left-3" />
                        <input
                          type="time"
                          value={userProfile.birthTime}
                          onChange={(e) => setUserProfile({ ...userProfile, birthTime: e.target.value })}
                          className="w-full pl-9 pr-2 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Place of Birth
                      </label>
                      <div className="relative flex items-center">
                        <MapPin className="w-4 h-4 text-indigo-500 absolute left-3" />
                        <input
                          type="text"
                          value={userProfile.birthPlace}
                          onChange={(e) => setUserProfile({ ...userProfile, birthPlace: e.target.value })}
                          placeholder="City, Country"
                          className="w-full pl-9 pr-2 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Continue Button */}
              <button
                onClick={() => {
                  setCurrentScreen('home');
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>Your data is safe & private</span>
              </div>
            </div>

            {/* Upsell Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Crown className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-slate-900">Unlock Full Kundli</h4>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Add time & place of birth for detailed Vedic chart, dasha and planetary periods.
                </p>
              </div>
            </div>

            {/* Inspirational Quote */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg shrink-0">
                🧘
              </div>
              <p className="text-xs italic text-slate-600 leading-relaxed">
                &ldquo;The stars don&apos;t decide your future, they guide you to make better choices.&rdquo;
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setCurrentScreen('home')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Skip to Dashboard $\rightarrow$
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MAIN DASHBOARD / HOME SCREEN (Astrological Snapshot) */}
      {/* ============================================================== */}
      {currentScreen === 'home' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-5">
          
          {/* Top Greeting Header */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5">
                <span>Good Morning, {userProfile.name}</span>
                <span className="text-amber-400">✨</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Here&apos;s your astrological snapshot
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('oracle_ai')}
                className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-all"
                title="Ask AstroGuru"
              >
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </button>
              <button
                onClick={() => navigateTo('share')}
                className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-all"
                title="Share Report"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sun Sign Hero Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-4">
              {/* Illustrated Mascot Icon (Leo Lion) */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center text-3xl shadow-md ring-4 ring-amber-100 shrink-0">
                🦁
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Your Sun Sign
                </span>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-black text-slate-900">
                    {userProfile.sunSign} {userProfile.sunSignSymbol}
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  ({userProfile.sunSignDates})
                </span>
              </div>
            </div>

            {/* 3 Metrics Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Life Path</span>
                <p className="text-sm font-black text-indigo-600">{userProfile.lifePathNumber}</p>
                <span className="text-[9px] text-slate-500 truncate block">({userProfile.lifePathMeaning})</span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Birth Number</span>
                <p className="text-sm font-black text-purple-600">{userProfile.birthNumber}</p>
                <span className="text-[9px] text-slate-500 truncate block">({userProfile.birthNumberMeaning})</span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Element</span>
                <p className="text-sm font-black text-amber-600">{userProfile.element}</p>
                <span className="text-[9px] text-slate-500 truncate block">({userProfile.elementMeaning})</span>
              </div>
            </div>
          </div>

          {/* 6 Grid Feature Cards */}
          <div className="grid grid-cols-3 gap-3">
            {/* 1. Daily Horoscope */}
            <button
              onClick={() => navigateTo('prediction_2026')}
              className="bg-white rounded-3xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
                <Sun className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Daily Horoscope
              </span>
            </button>

            {/* 2. Career */}
            <button
              onClick={() => navigateTo('career')}
              className="bg-white rounded-3xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Career
              </span>
            </button>

            {/* 3. Love & Marriage */}
            <button
              onClick={() => navigateTo('love')}
              className="bg-white rounded-3xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-pink-300 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Love & Marriage
              </span>
            </button>

            {/* 4. Money & Finance */}
            <button
              onClick={() => navigateTo('money')}
              className="bg-white rounded-3xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Money & Finance
              </span>
            </button>

            {/* 5. Health */}
            <button
              onClick={() => navigateTo('health')}
              className="bg-white rounded-3xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Health
              </span>
            </button>

            {/* 6. Life Cycles */}
            <button
              onClick={() => navigateTo('cycles')}
              className="bg-white rounded-3xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-lime-400 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-lime-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
                <CompassIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Life Cycles
              </span>
            </button>
          </div>

          {/* Today's Cosmic Message Card */}
          <div className="bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-pink-50/70 rounded-3xl p-4 border border-amber-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center text-xl shrink-0">
              🧘
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                Today&apos;s Cosmic Message
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                &ldquo;Trust your intuition. It knows the way.&rdquo;
              </p>
            </div>
          </div>

          {/* Quick Compatibility Banner */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-4 text-white shadow-md flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-purple-200">Cosmic Match</span>
              <h4 className="text-sm font-black">Check Love Compatibility</h4>
              <p className="text-[11px] text-purple-100">Leo ♌ + Sagittarius ♐ = 78% Match</p>
            </div>
            <button
              onClick={() => navigateTo('compatibility')}
              className="px-3.5 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-sm hover:bg-purple-50 transition-all"
            >
              Check $\rightarrow$
            </button>
          </div>

          {/* Bottom Interactive Feature Tiles (Matching bottom of reference image) */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Explore Celestial Tools
            </h4>

            {/* Daily Horoscope */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-4 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center text-lg">
                  🌅
                </div>
                <div>
                  <h5 className="text-xs font-bold">Daily Horoscope</h5>
                  <p className="text-[11px] text-slate-300">Fresh guidance every day for your sign</p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('prediction_2026')}
                className="text-xs font-bold text-pink-300 hover:text-white flex items-center gap-1"
              >
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tarot Reading */}
            <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-900 rounded-2xl p-4 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center text-lg">
                  🃏
                </div>
                <div>
                  <h5 className="text-xs font-bold">Tarot Reading</h5>
                  <p className="text-[11px] text-slate-300">Get clarity on love, career, life & more</p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('tarot')}
                className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1"
              >
                <span>Draw Card</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Numerology */}
            <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-2xl p-4 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center text-lg">
                  🔢
                </div>
                <div>
                  <h5 className="text-xs font-bold">Numerology</h5>
                  <p className="text-[11px] text-slate-300">Discover the power of your core numbers</p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('numerology')}
                className="text-xs font-bold text-sky-300 hover:text-white flex items-center gap-1"
              >
                <span>Calculate</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ask AstroGuru */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-4 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <h5 className="text-xs font-bold">Ask AstroGuru (AI)</h5>
                  <p className="text-[11px] text-slate-300">Chat with your personal astrology assistant</p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('oracle_ai')}
                className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1"
              >
                <span>Chat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. CAREER & PROFESSION SCREEN (Screen 4 in Reference) */}
      {/* ============================================================== */}
      {currentScreen === 'career' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900">Career &amp; Profession</h2>
          </div>

          {/* Segmented Control Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {(['overview', 'best_fields', 'timeline'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setCareerTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  careerTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Artwork Banner (Mountain Hiker with Sunset Star) */}
          <div className="relative h-44 rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-800 to-amber-700 flex items-end p-4 shadow-sm">
            <div className="absolute top-4 right-4 text-3xl opacity-80">⭐</div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                10th House Solar Radiance
              </span>
              <h3 className="text-base font-extrabold">Executive &amp; Creative Mastery</h3>
            </div>
          </div>

          {/* Content Based on Tab */}
          {careerTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
                <h4 className="text-sm font-black text-slate-900">Your Career Outlook</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are a natural leader with strong communication skills. You thrive in roles where you can express ideas, solve problems, and work with people.
                </p>
              </div>

              {/* Best Career Fields */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Best Career Fields
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-indigo-600">👤</span>
                    <span>Leadership &amp; Management</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-purple-600">📢</span>
                    <span>Communication &amp; Media</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-blue-600">💼</span>
                    <span>Business &amp; Entrepreneurship</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-pink-600">🎨</span>
                    <span>Creative Industries</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-teal-600">🧑‍🏫</span>
                    <span>Education &amp; Mentoring</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-emerald-600">📈</span>
                    <span>Sales &amp; Marketing</span>
                  </div>
                </div>
              </div>

              {/* Career Timeline */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Your Career Timeline
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5" />
                    <div>
                      <span className="font-bold text-indigo-700">2026 – 2027</span>
                      <p className="text-slate-600">Skill development &amp; foundational professional growth.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5" />
                    <div>
                      <span className="font-bold text-purple-700">2028 – 2029</span>
                      <p className="text-slate-600">Leadership expansion and entrepreneurial milestones.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {careerTab === 'best_fields' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs text-slate-600">
              <h4 className="font-black text-slate-900 text-sm">Deep Vocational Alignment</h4>
              <p>Your Leo Midheaven suggests you are best suited for visible roles that allow creative sovereignty. Roles involving management, branding, architectural vision, or counseling give you maximum energy return.</p>
            </div>
          )}

          {careerTab === 'timeline' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs text-slate-600">
              <h4 className="font-black text-slate-900 text-sm">Major Dasha Milestones</h4>
              <p>During the upcoming Sun-Mercury sub-period, contractual opportunities and expansion in public communication reach their peak.</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. LOVE & RELATIONSHIPS SCREEN (Screen 5 in Reference) */}
      {/* ============================================================== */}
      {currentScreen === 'love' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900">Love &amp; Relationships</h2>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {(['overview', 'compatibility', 'timing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setLoveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  loveTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Artwork Banner (Romantic Sunset Couple) */}
          <div className="relative h-44 rounded-3xl overflow-hidden bg-gradient-to-r from-pink-900 via-purple-900 to-amber-700 flex items-end p-4 shadow-sm">
            <div className="absolute top-4 right-4 text-3xl opacity-80">💑</div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-pink-300">
                7th House Synastry Harmony
              </span>
              <h3 className="text-base font-extrabold">Devoted &amp; Passionate Loyalty</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-sm font-black text-slate-900">Love Outlook</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                You value emotional stability and loyalty in a relationship. You may take time before committing, but once you decide, you are devoted and supportive.
              </p>
            </div>

            {/* Potential Relationship Periods */}
            <div className="bg-pink-50/60 rounded-3xl p-5 border border-pink-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-pink-700 font-bold text-xs">
                <Calendar className="w-4 h-4" />
                <span>Potential Relationship Periods</span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-extrabold text-slate-900">27 – 30 years</p>
                <p className="font-extrabold text-slate-900">32 – 34 years</p>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">
                (Date-based estimate, not a guarantee)
              </span>
            </div>

            {/* Best Matches */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Best Matches
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-lg">♈</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-1">Aries</p>
                  <span className="text-[9px] text-amber-600 font-medium">(Fire)</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-100">
                  <span className="text-lg">♊</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-1">Gemini</p>
                  <span className="text-[9px] text-sky-600 font-medium">(Air)</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-pink-50 border border-pink-100">
                  <span className="text-lg">♎</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-1">Libra</p>
                  <span className="text-[9px] text-pink-600 font-medium">(Air)</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-100">
                  <span className="text-lg">♐</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-1">Sagittarius</p>
                  <span className="text-[9px] text-purple-600 font-medium">(Fire)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('compatibility')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Check Love Compatibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. MONEY & FINANCE SCREEN (Screen 6 in Reference) */}
      {/* ============================================================== */}
      {currentScreen === 'money' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900">Money &amp; Finance</h2>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {(['overview', 'growth', 'tips'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMoneyTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  moneyTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Artwork Banner (Gold coins & growing sprout) */}
          <div className="relative h-44 rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-800 to-amber-700 flex items-end p-4 shadow-sm">
            <div className="absolute top-4 right-4 text-3xl opacity-80">🌱💰</div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                2nd &amp; 11th House Wealth Engine
              </span>
              <h3 className="text-base font-extrabold">Sustainable Wealth Building</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-sm font-black text-slate-900">Financial Outlook</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are good at planning and building long-term wealth. Consistency, discipline, and multiple income streams can bring strong financial stability.
              </p>
            </div>

            {/* Key Financial Periods */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Key Financial Periods
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-extrabold text-slate-900">29 – 32 years:</span>
                    <span className="text-slate-600 ml-1">Career &amp; income growth expansion.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-extrabold text-slate-900">35 – 38 years:</span>
                    <span className="text-slate-600 ml-1">Substantial wealth accumulation &amp; assets.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lucky Elements */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Lucky Elements
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <span className="text-[10px] text-slate-400 block font-bold">Lucky Numbers</span>
                  <p className="font-black text-indigo-700 mt-0.5">3, 6, 9</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-[10px] text-slate-400 block font-bold">Lucky Colors</span>
                  <p className="font-black text-amber-700 mt-0.5 text-[11px]">Gold, Orange, White</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block font-bold">Lucky Days</span>
                  <p className="font-black text-emerald-700 mt-0.5">Sunday, Friday</p>
                </div>
              </div>
            </div>

            {/* Finance Tips Box */}
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div className="text-xs">
                <h5 className="font-bold text-amber-950">Finance Tip</h5>
                <p className="text-amber-900 text-[11px] mt-0.5">
                  Avoid impulsive speculative spending and focus on disciplined long-term assets.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. HEALTH & WELLNESS SCREEN (Screen 7 in Reference) */}
      {/* ============================================================== */}
      {currentScreen === 'health' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900">Health &amp; Wellness</h2>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {(['overview', 'fitness', 'mental'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setHealthTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  healthTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Artwork Banner (Meditating Silhouette with Chakra Radiance) */}
          <div className="relative h-44 rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900 via-cyan-800 to-amber-700 flex items-end p-4 shadow-sm">
            <div className="absolute top-4 right-4 text-3xl opacity-80">🧘✨</div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">
                Vitality &amp; Solar Prana
              </span>
              <h3 className="text-base font-extrabold">Holistic Energy Alignment</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-sm font-black text-slate-900">Health Outlook</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have good vitality and natural solar energy. You may be prone to stress and overthinking, so balance is important.
              </p>
            </div>

            {/* Focus Areas */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Focus Areas
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                  <span className="text-purple-600">🧘</span>
                  <span>Stress Management</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                  <span className="text-indigo-600">😴</span>
                  <span>Better Sleep</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                  <span className="text-emerald-600">🏃</span>
                  <span>Regular Exercise</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                  <span className="text-teal-600">🥗</span>
                  <span>Balanced Diet</span>
                </div>
              </div>
            </div>

            {/* Wellness Tips */}
            <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 flex items-start gap-3">
              <span className="text-xl text-purple-600">⭐</span>
              <div className="text-xs">
                <h5 className="font-bold text-purple-950">Wellness Tips</h5>
                <p className="text-purple-900 text-[11px] mt-0.5">
                  Practice mindfulness, stay hydrated, and maintain a consistent daily circadian routine.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('oracle_ai')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Start 7-Day Wellness Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. LIFE CYCLES SCREEN (Screen 8 in Reference) */}
      {/* ============================================================== */}
      {currentScreen === 'cycles' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900">Life Cycles</h2>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {(['overview', 'key_phases', 'insights'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setCyclesTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  cyclesTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Chronological Growth Cycles
            </h4>

            {/* Vertical Timeline */}
            <div className="space-y-4 text-xs">
              {/* 0 - 18 */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 border border-amber-200 text-[11px]">
                  0-18
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Foundation</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Learning, family influence, character and personality development.
                  </p>
                </div>
              </div>

              {/* 19 - 27 */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center shrink-0 border border-sky-200 text-[11px]">
                  19-27
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Exploration</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Higher education, initial relationship bonds, career experimentation.
                  </p>
                </div>
              </div>

              {/* 28 - 36 */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0 border border-emerald-200 text-[11px]">
                  28-36
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Growth</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Accelerated career trajectory, financial responsibility, major life decisions.
                  </p>
                </div>
              </div>

              {/* 37 - 45 */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center shrink-0 border border-purple-200 text-[11px]">
                  37-45
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Consolidation</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Long-term stability, executive leadership, accumulated wisdom and assets.
                  </p>
                </div>
              </div>

              {/* 46+ */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-800 font-extrabold flex items-center justify-center shrink-0 border border-rose-200 text-[11px]">
                  46+
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Influence</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Mentoring, family legacy, spiritual contribution, and sharing deep wisdom.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-5 text-white text-center shadow-sm space-y-1">
            <h5 className="text-xs font-bold text-amber-300">Your journey is unique.</h5>
            <p className="text-[11px] text-slate-200">
              Every astrological phase brings fresh horizons and divine timing.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. 2026 PREDICTION SCREEN (Screen 9 in Reference) */}
      {/* ============================================================== */}
      {currentScreen === 'prediction_2026' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900">2026 Prediction</h2>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {(['overview', 'monthly', 'lucky_guide'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPredictionTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  predictionTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Artwork Banner (2026 Cosmic Typography) */}
          <div className="relative h-44 rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 flex items-center justify-center p-4 shadow-sm text-center">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
            <div className="relative z-10 text-white space-y-1">
              <span className="text-3xl sm:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-purple-200">
                2026
              </span>
              <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                Vedic Year Planetary Forecast
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Overall Theme */}
            <div className="bg-amber-50/70 rounded-3xl p-4 border border-amber-200/80 text-xs">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block mb-1">
                Overall Theme
              </span>
              <p className="font-extrabold text-slate-900">
                &ldquo;Build the foundation before making the next major move.&rdquo;
              </p>
            </div>

            {/* Categorized Forecast */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5 text-xs">
              {/* Career */}
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Career</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Strengthen your professional direction and take on greater administrative responsibility.
                  </p>
                </div>
              </div>

              {/* Money */}
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Money</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Focus on financial consistency and avoid major hasty purchases from emotion.
                  </p>
                </div>
              </div>

              {/* Love */}
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Love</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Existing relationships mature into deeper commitments. Singles discover strong mutual connections.
                  </p>
                </div>
              </div>

              {/* Family */}
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Family</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Family responsibilities increase, rewarded by closer bonding through patient communication.
                  </p>
                </div>
              </div>

              {/* Health */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Health</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Maintain regular routines, quality sleep, light daily cardio, and stress reduction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 10. COMPATIBILITY SCREEN (Screen 10 in Reference) */}
      {/* ============================================================== */}
      {currentScreen === 'compatibility' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900">Compatibility</h2>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setCompatTypeTab('love')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                compatTypeTab === 'love'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Love
            </button>
            <button
              onClick={() => setCompatTypeTab('friends_business')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                compatTypeTab === 'friends_business'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Friends / Business
            </button>
          </div>

          {/* Sign Selectors Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Your Sign</label>
                <select
                  value={mySign}
                  onChange={(e) => setMySign(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs text-slate-800"
                >
                  {ZODIAC_LIST.map((z) => (
                    <option key={z.name} value={`${z.name} ${z.symbol}`}>
                      {z.name} {z.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Partner&apos;s Sign</label>
                <select
                  value={partnerSign}
                  onChange={(e) => setPartnerSign(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs text-slate-800"
                >
                  {ZODIAC_LIST.map((z) => (
                    <option key={z.name} value={`${z.name} ${z.symbol}`}>
                      {z.name} {z.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="w-full py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 transition-all"
            >
              Check Compatibility
            </button>
          </div>

          {/* Result Gauge Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              {/* Circular Percentage Meter */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-pink-500"
                    strokeDasharray="78, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-base font-black text-slate-900">78%</span>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900">Good Compatibility</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  You both share enthusiasm, high vitality, adventure, and frank, direct communication.
                </p>
              </div>
            </div>

            {/* Strengths Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <h5 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Strengths</h5>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mutual natural attraction &amp; solar inspiration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Shared ambition &amp; future goals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Loyal emotional support through challenges</span>
                </div>
              </div>
            </div>

            {/* Upsell Banner */}
            <div className="bg-amber-50/70 rounded-2xl p-3.5 border border-amber-200 flex items-start gap-2.5 text-xs">
              <Crown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-900 text-[11px]">
                For a 36-Guna detailed Ashtakoota Vedic Kundli Milan matching report, add your partner&apos;s full birth details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 11. TAROT READING SCREEN */}
      {/* ============================================================== */}
      {currentScreen === 'tarot' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900">Tarot Reading</h2>
          </div>

          <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white text-center space-y-4">
            <Sparkles className="w-8 h-8 text-amber-300 mx-auto animate-pulse" />
            <h3 className="text-base font-extrabold">Pick Your Card of Insight</h3>
            <p className="text-xs text-slate-300">
              Clear your mind, take a deep breath, and tap one card for your personal oracle reading.
            </p>

            {/* 3 Tarot Cards */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { title: 'The Sun', symbol: '☀️', meaning: 'Joy, Success & Vitality' },
                { title: 'The Star', symbol: '⭐', meaning: 'Hope, Guidance & Faith' },
                { title: 'The Magician', symbol: '🔮', meaning: 'Creation, Willpower & Resourcefulness' },
              ].map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTarot(idx);
                    setTarotFlipped(true);
                  }}
                  className={`h-36 rounded-2xl border-2 transition-all p-2 flex flex-col items-center justify-between ${
                    selectedTarot === idx
                      ? 'border-amber-400 bg-purple-900/80 scale-105 shadow-lg'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <span className="text-xs font-bold text-purple-300">#{idx + 1}</span>
                  <span className="text-3xl">{selectedTarot === idx ? card.symbol : '🂠'}</span>
                  <span className="text-[10px] font-bold truncate">
                    {selectedTarot === idx ? card.title : 'Draw'}
                  </span>
                </button>
              ))}
            </div>

            {selectedTarot !== null && (
              <div className="bg-white/10 rounded-2xl p-4 text-left border border-white/15 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-300">Card Revelation</span>
                <h5 className="font-extrabold text-sm text-white">
                  {[
                    'The Sun — Radiance & Achievement',
                    'The Star — Cosmic Inspiration & Renewal',
                    'The Magician — Infinite Creative Power',
                  ][selectedTarot]}
                </h5>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {[
                    'Your path is illuminated with clarity. Trust your vitality and take bold strides toward your goals.',
                    'A peaceful renewal of purpose is arriving. What you hoped for is coming into divine alignment.',
                    'You possess all the tools and resources you need right now to manifest your highest outcome.',
                  ][selectedTarot]}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 12. NUMEROLOGY SCREEN */}
      {/* ============================================================== */}
      {currentScreen === 'numerology' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900">Numerology Insights</h2>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                2
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Core Frequency</span>
                <h3 className="text-base font-black text-slate-900">Life Path 2: The Diplomat</h3>
                <p className="text-xs text-slate-500">Born on 15 August 1995 (1+5+8+1+9+9+5 = 38 $\rightarrow$ 11 $\rightarrow$ 2)</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
              <p>
                As a <strong>Life Path 2</strong>, you are naturally empathetic, diplomatic, and intuitive. You bring people together, create harmony, and possess a gentle yet potent influence on everyone around you.
              </p>
            </div>

            {/* Core Numbers Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Destiny No</span>
                <p className="text-base font-black text-purple-600 mt-0.5">8</p>
                <span className="text-[9px] text-slate-500">(Abundance)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Soul Urge</span>
                <p className="text-base font-black text-indigo-600 mt-0.5">6</p>
                <span className="text-[9px] text-slate-500">(Nurturing)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Personality</span>
                <p className="text-base font-black text-emerald-600 mt-0.5">4</p>
                <span className="text-[9px] text-slate-500">(Reliability)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 13. ASK ASTROGURU (AI ASSISTANT) SCREEN */}
      {/* ============================================================== */}
      {currentScreen === 'oracle_ai' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 flex flex-col h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button
                onClick={goBack}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <span>AstroGuru (AI)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h2>
                <p className="text-[10px] text-slate-400">Vedic Chart Intelligence Engine</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold">
              Leo ♌
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {msg.sender === 'guru' && (
                    <span className="text-[10px] font-bold uppercase text-indigo-600 block mb-1">
                      AstroGuru
                    </span>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                  <span>Consulting your celestial chart...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="flex gap-2 overflow-x-auto pb-2 text-[11px]">
            {['❤️ Love Timing', '💼 Career 2026', '💰 Wealth & Assets', '🔮 Rahu-Ketu'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setQueryInput(`What does my chart indicate for ${prompt}?`)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your destiny, love, career..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
            <button
              onClick={handleSendMessage}
              disabled={!queryInput.trim()}
              className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 14. SAVE & SHARE MODAL SCREEN */}
      {/* ============================================================== */}
      {currentScreen === 'share' && (
        <div className="max-w-md mx-auto w-full px-4 pt-4 pb-12 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-slate-900">Save &amp; Share</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
              <Share2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                NEW FEATURE
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">Save &amp; Share Your Cosmic Report</h3>
              <p className="text-xs text-slate-500 mt-1">
                Share your Leo ♌ snapshot, 2026 forecast, and astrological insights with friends and family.
              </p>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  window.open(`https://wa.me/?text=Check%20out%20my%20Astrological%20Snapshot%20on%20Jyoti%20AI:%20Leo%20Sun,%20Life%20Path%202!%20https://kuthiyengpham.in/astroai`, '_blank');
                }}
                className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl shadow-sm hover:scale-105 transition-all"
                title="WhatsApp"
              >
                💬
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://kuthiyengpham.in/astroai');
                  setShowShareToast(true);
                  setTimeout(() => setShowShareToast(false), 2500);
                }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-xl shadow-sm hover:scale-105 transition-all"
                title="Instagram / Story"
              >
                📷
              </button>

              <button
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=Discovering%20my%202026%20Vedic%20Astrology%20insights%20on%20Jyoti%20AI!%20https://kuthiyengpham.in/astroai`, '_blank');
                }}
                className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-sm hover:scale-105 transition-all"
                title="X / Twitter"
              >
                𝕏
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://kuthiyengpham.in/astroai');
                  setShowShareToast(true);
                  setTimeout(() => setShowShareToast(false), 2500);
                }}
                className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center text-xl shadow-xs hover:scale-105 transition-all"
                title="Copy Link"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>

            {showShareToast && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Link copied to clipboard!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BOTTOM BRANDING & STORE BADGES FOOTER */}
      {/* ============================================================== */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 max-w-md mx-auto w-full px-4 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-indigo-900">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>More Than Just Predictions $\rightarrow$ It&apos;s Your Personal Growth Companion</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold flex items-center gap-2 shadow-xs">
            <span>▶ Google Play</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold flex items-center gap-2 shadow-xs">
            <span> App Store</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400">
          © 2026 Jyoti AI • Built with ancient Surya Siddhanta &amp; Modern Astronomical Intelligence.
        </p>
      </div>

      {/* ============================================================== */}
      {/* FLOATING BOTTOM APP NAVIGATION BAR (Mobile Bottom Bar) */}
      {/* ============================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-4">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              currentScreen === 'home'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => navigateTo('career')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              currentScreen === 'career' || currentScreen === 'money' || currentScreen === 'health'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Explore</span>
          </button>

          <button
            onClick={() => navigateTo('oracle_ai')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              currentScreen === 'oracle_ai'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px]">Ask AI</span>
          </button>

          <button
            onClick={() => navigateTo('compatibility')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              currentScreen === 'compatibility'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px]">Match</span>
          </button>

          <button
            onClick={() => navigateTo('dob_input')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              currentScreen === 'dob_input'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </div>

    </div>
  );
}
