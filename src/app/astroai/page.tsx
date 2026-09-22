'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  MessageSquare,
  Compass,
  Sun,
  Moon,
  User,
  Send,
  Mic,
  MicOff,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  RotateCcw,
  Shield,
  Heart,
  Briefcase,
  Coins,
  Smile,
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
  Crown
} from 'lucide-react';

interface Planet {
  id: string;
  name: string;
  glyph: string;
  signName: string;
  degreeInSign: number;
  nakshatra: string;
  houseNumber: number;
  dignity: string;
}

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  birthDate: string;
  birthTime: string;
  isTimeUnknown?: boolean;
  lat: number;
  lon: number;
  tz: number;
  place: string;
  astrologySystem: 'Vedic' | 'Western';
  language: string;
}

const ZODIAC_LIST = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire', color: 'from-orange-400 to-rose-400' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth', color: 'from-emerald-400 to-teal-500' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air', color: 'from-amber-400 to-orange-400' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water', color: 'from-sky-400 to-blue-500' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire', color: 'from-amber-500 to-red-500' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth', color: 'from-teal-400 to-emerald-500' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air', color: 'from-pink-400 to-rose-400' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water', color: 'from-purple-500 to-indigo-600' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire', color: 'from-indigo-400 to-purple-500' },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth', color: 'from-slate-500 to-gray-700' },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air', color: 'from-cyan-400 to-blue-500' },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water', color: 'from-teal-300 to-blue-400' },
];

const SUGGESTED_PILLS = [
  { label: '❤️ Love', query: 'What does my chart say about my love life and soulmate timing?' },
  { label: '💼 Career', query: 'What is the most aligned career and vocational path in my birth chart?' },
  { label: '💰 Money', query: 'What are the main financial timing indicators for this year?' },
  { label: '✨ This month', query: 'What cosmic transits and opportunities are active for me this month?' },
  { label: '🔮 My future', query: 'Explain my upcoming Dasha milestones and major growth periods.' },
  { label: '🌙 My chart', query: 'Give me a simple breakdown of my Sun, Moon, and Rising signs.' },
];

const DISCOVER_ARTICLES = [
  {
    id: 'astro101',
    title: 'Astrology 101: Understanding Your Big 3',
    category: 'Beginner Guide',
    readTime: '4 min read',
    icon: '✨',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
    description: 'Learn how your Sun, Moon, and Rising signs work together to create your unique celestial fingerprint.'
  },
  {
    id: 'moon_guide',
    title: 'Moon Insights & Emotional Cycles',
    category: 'Lunar Wisdom',
    readTime: '5 min read',
    icon: '🌙',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    description: 'How new and full moons affect your subconscious drive, intuition, and energy flow.'
  },
  {
    id: 'career_astro',
    title: 'Career Astrology & The 10th House',
    category: 'Vocational',
    readTime: '6 min read',
    icon: '💼',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
    description: 'Unlocking your vocational purpose through the Midheaven, Saturn placements, and planetary periods.'
  },
  {
    id: 'synastry_guide',
    title: 'Relationship Guide & Synastry',
    category: 'Relationships',
    readTime: '5 min read',
    icon: '❤️',
    color: 'bg-rose-50 text-rose-700 border-rose-100',
    description: 'Discover the cosmic dynamics of attraction, communication styles, and long-term compatibility.'
  },
  {
    id: 'birth_chart_guide',
    title: 'Birth Chart Guide: Houses Explained',
    category: 'Chart Mastery',
    readTime: '7 min read',
    icon: '🪐',
    color: 'bg-teal-50 text-teal-700 border-teal-100',
    description: 'A friendly walk through the 12 astrological houses and what each sector represents in your life.'
  },
  {
    id: 'zodiac_guide',
    title: 'The 12 Zodiac Archetypes',
    category: 'Foundations',
    readTime: '8 min read',
    icon: '🔮',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    description: 'Deep dive into the 4 elements (Fire, Earth, Air, Water) and the 12 archetypal zodiac energies.'
  },
];

export default function AstroAIPage() {
  // Main view: 'welcome' (splash like left reference screen) | 'app'
  const [currentView, setCurrentView] = useState<'welcome' | 'app'>('app');
  
  // App navigation tab: 'home' | 'ask' | 'discover' | 'profile' | 'kundli_modal' | 'horoscope_modal' | 'compatibility_modal' | 'predictions_modal'
  const [activeTab, setActiveTab] = useState<'home' | 'ask' | 'discover' | 'profile' | 'kundli' | 'horoscope' | 'compatibility' | 'predictions'>('home');
  
  // Predictions sub-tab
  const [predictionTimeline, setPredictionTimeline] = useState<'today' | 'week' | 'month'>('today');

  // Gatekeeper Profile State
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  // Form State
  const [profileForm, setProfileForm] = useState<UserProfile>({
    id: 'user_primary',
    name: 'Alex',
    email: 'alex@example.com',
    birthDate: '1998-05-15',
    birthTime: '14:30',
    isTimeUnknown: false,
    lat: 28.6139,
    lon: 77.2090,
    tz: 5.5,
    place: 'New Delhi, IN',
    astrologySystem: 'Vedic',
    language: 'English',
  });

  // Chart Data State
  const [loading, setLoading] = useState<boolean>(false);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [showAdvancedKundli, setShowAdvancedKundli] = useState<boolean>(false);
  const [selectedZodiac, setSelectedZodiac] = useState<any>(ZODIAC_LIST[0]);

  // Conversational AI State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'oracle'; text: string; time: string }>>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingThought, setStreamingThought] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Audio & Voice States
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Compatibility State
  const [partnerName, setPartnerName] = useState('Maya');
  const [partnerDate, setPartnerDate] = useState('1999-08-14');
  const [compatibilityResult, setCompatibilityResult] = useState<any>(null);
  const [isCopiedShare, setIsCopiedShare] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, streamingThought]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jyoti_user_profile');
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        if (parsed.name && parsed.birthDate) {
          setActiveProfile(parsed);
          setProfileForm(parsed);
          setHasProfile(true);
          fetchBlueprint(parsed, true);
        }
      } else {
        // Default seed user Alex to match reference UI seamlessly
        const defaultUser: UserProfile = {
          id: 'user_alex',
          name: 'Alex',
          email: 'alex@astroai.app',
          birthDate: '1998-05-15',
          birthTime: '14:30',
          lat: 28.6139,
          lon: 77.2090,
          tz: 5.5,
          place: 'New Delhi, IN',
          astrologySystem: 'Vedic',
          language: 'English',
        };
        setActiveProfile(defaultUser);
        setProfileForm(defaultUser);
        setHasProfile(true);
        fetchBlueprint(defaultUser, true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute Astrological Blueprint
  const fetchBlueprint = async (p: UserProfile, isInitial = false) => {
    setLoading(true);
    try {
      const birthDateTime = new Date(`${p.birthDate}T${p.isTimeUnknown ? '12:00' : p.birthTime}:00Z`).toISOString();
      const res = await fetch('/api/jyoti/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDateTime,
          latitude: p.lat,
          longitude: p.lon,
          timezoneOffset: p.tz,
          ayanamsa: 'Lahiri',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBlueprint(data);

        // Match initial zodiac
        const zSign = ZODIAC_LIST.find((z) => z.name.toLowerCase() === (data.ascendantSign || 'aries').toLowerCase());
        if (zSign) setSelectedZodiac(zSign);

        if (isInitial && chatMessages.length === 0) {
          setChatMessages([
            {
              sender: 'oracle',
              text: `### CAREER\nYour chart points toward a period traditionally associated with **reassessing long-term goals and refining your key skills**.\n\n### WHAT THIS MEANS\nYou may feel a gentle pull to reorganize your priorities, slow down hasty decisions, and trust your intuition.\n\n### WHY\nWith **${data.chartRuler || 'Mercury'}** governing your **${data.ascendantSign || 'Virgo'} Lagna** and active **${data.dashas?.[0]?.lord || 'Jupiter'} cycle**, your vocational energy thrives through strategic clarity rather than rush.`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;

    const updated: UserProfile = {
      ...profileForm,
      id: profileForm.id || `user_${Date.now()}`,
    };

    localStorage.setItem('jyoti_user_profile', JSON.stringify(updated));
    setActiveProfile(updated);
    setHasProfile(true);
    setIsCalibrating(false);
    setCurrentView('app');

    await fetchBlueprint(updated, true);
  };

  // Send message to AI Astrologer
  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isGenerating) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);
    setStreamingThought('AstroAI is reviewing your birth chart...');

    try {
      const payload = {
        query: q,
        conversationHistory: chatMessages.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })),
        birthProfile: {
          name: activeProfile?.name || 'Friend',
          date: activeProfile?.birthDate || '1998-05-15',
          time: activeProfile?.birthTime || '14:30',
          place: activeProfile?.place || 'New Delhi, IN',
          ascendantSign: blueprint?.ascendantSign || 'Virgo',
          moonSign: blueprint?.planets?.find((p: any) => p.name === 'Moon')?.signName || 'Sagittarius',
          sunSign: blueprint?.planets?.find((p: any) => p.name === 'Sun')?.signName || 'Taurus',
          nakshatra: blueprint?.ascendantNakshatra || 'Uttara Phalguni',
          currentDasha: blueprint?.dashas?.[0]?.lord || 'Jupiter',
        },
      };

      const res = await fetch('/api/jyoti/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Could not connect to AstroAI');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') break;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  fullText += parsed.text;
                }
              } catch (e) {
                // Ignore parse errors
              }
            } else if (line.trim() && !line.startsWith(':')) {
              try {
                const parsed = JSON.parse(line);
                if (parsed.response) fullText = parsed.response;
              } catch (e) {
                fullText += line;
              }
            }
          }
        }
      }

      const oracleMsg = {
        sender: 'oracle' as const,
        text: fullText || "AstroAI could not find a distinct pattern for this question. Please try asking about your career, relationships, or planetary timing.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, oracleMsg]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'oracle',
          text: `### INSIGHT\nI am analyzing your chart patterns. Please try asking again in a moment!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsGenerating(false);
      setStreamingThought(null);
    }
  };

  // Web Speech API Voice Recognition
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      setIsListening(false);
      handleSendMessage(transcript);
    };

    recognition.start();
  };

  // Ambient Sound Toggle
  const toggleAudio = () => {
    if (isPlayingAudio) {
      oscillatorRef.current?.stop();
      oscillatorRef.current?.disconnect();
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime); // 432Hz harmonic tone
        gain.gain.setValueAtTime(0.02, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscillatorRef.current = osc;
        gainRef.current = gain;
        setIsPlayingAudio(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Calculate Compatibility
  const handleCalculateCompatibility = () => {
    setCompatibilityResult({
      partner: partnerName,
      partnerDate,
      overallScore: 88,
      emotional: 'Deep emotional empathy. You both naturally sense each other’s unspoken feelings and offer steady comfort.',
      communication: 'Open and honest. A balance of logic and intuition prevents misunderstandings.',
      attraction: 'Magnetic natural chemistry with strong shared curiosity and humor.',
      longTerm: 'High mutual loyalty and grounded shared values for long-term growth and harmony.',
    });
  };

  // Render Structured Message (Clean Consumer App Formatting)
  const renderStructuredMessage = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        const title = line.replace('### ', '');
        return (
          <div key={idx} className="mt-3 mb-1.5 first:mt-0">
            <span className="text-[11px] font-bold text-[#FF552E] uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
              {title}
            </span>
          </div>
        );
      }
      if (line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 my-1 leading-relaxed">
            <span className="text-[#FF552E] mt-1 text-[8px]">●</span>
            <span dangerouslySetInnerHTML={{ __html: formatBold(content) }} />
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-gray-700 leading-relaxed my-1" dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
      );
    });
  };

  const formatBold = (str: string) => {
    return str.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>');
  };

  return (
    <div className="h-screen w-screen bg-[#F7F7FA] text-gray-900 flex flex-col antialiased selection:bg-orange-100 overflow-hidden font-sans">
      
      {/* Mobile-First Centered Application Workspace */}
      <div className="w-full max-w-md sm:max-w-lg mx-auto h-full flex flex-col relative bg-[#FBFBFD] border-x border-gray-100/80 shadow-2xl overflow-hidden">
        
        {/* ========================================================
            SCREEN 1: WELCOME / ONBOARDING VIEW (REFERENCE LEFT SCREEN)
            ======================================================== */}
        {currentView === 'welcome' && (
          <div className="h-full flex flex-col justify-between p-6 sm:p-7 bg-[#FFFDFB] overflow-y-auto animate-fadeIn relative">
            {/* Top Status & Brand Header */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span className="font-semibold text-gray-700 text-sm">9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold">●●●</span>
                <span className="text-xs">⚡</span>
              </div>
            </div>

            {/* Brand Title */}
            <div className="text-center space-y-1 mt-4">
              <div className="flex items-center justify-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FF552E]" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                  Astro<span className="text-[#FF552E]">AI</span>
                </h1>
              </div>
              <p className="text-xs text-gray-500 font-medium">Your life. The stars. Smarter.</p>
            </div>

            {/* Center 3D Illustration */}
            <div className="my-auto py-4 flex items-center justify-center relative">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden relative shadow-lg shadow-orange-500/10 border border-orange-100/50 bg-gradient-to-b from-[#FFF5F0] to-[#FBF4FF]">
                <Image
                  src="/images/astroai/welcome_hero.jpg"
                  alt="AstroAI 3D Illustration"
                  fill
                  className="object-contain p-2 hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </div>

            {/* Bottom Copy & Action Buttons */}
            <div className="space-y-4 text-center pb-2">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-tight">
                  Personalized Astrology<br />with AI
                </h2>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Get insights about your life, relationships, career and more — all in one place.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    if (!hasProfile) {
                      setIsCalibrating(true);
                    } else {
                      setCurrentView('app');
                      setActiveTab('home');
                    }
                  }}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#FF552E] hover:from-[#FF552E] hover:to-[#E0451E] text-white text-sm font-bold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-xs text-gray-500">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setCurrentView('app');
                      setActiveTab('home');
                    }}
                    className="text-[#FF552E] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 2: MAIN APPLICATION WORKSPACE
            ======================================================== */}
        {currentView === 'app' && (
          <div className="h-full flex flex-col justify-between relative bg-[#FBFBFD]">
            
            {/* Modern Top Header */}
            <header className="px-5 pt-3 pb-2 flex items-center justify-between shrink-0 bg-[#FBFBFD]/95 backdrop-blur-md z-30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('welcome')}
                  className="flex items-center gap-1.5 text-gray-900 hover:opacity-80 transition-opacity"
                  title="View Welcome Splash"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FF552E]" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                  <span className="font-extrabold text-base tracking-tight text-gray-900">
                    Astro<span className="text-[#FF552E]">AI</span>
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* 432Hz Sound Ambient Button */}
                <button
                  onClick={toggleAudio}
                  title="Toggle 432Hz Harmonic Frequency"
                  className={`p-1.5 rounded-full transition-all ${
                    isPlayingAudio
                      ? 'bg-orange-50 text-[#FF552E] border border-orange-200'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Profile / Avatar Button */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 p-0.5 shadow-sm overflow-hidden hover:scale-105 transition-transform"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#FF552E]">
                    {activeProfile?.name?.charAt(0) || 'A'}
                  </div>
                </button>
              </div>
            </header>

            {/* Scrollable Screen Body */}
            <div className="flex-1 overflow-y-auto pb-20 relative scrollbar-none">

              {/* ================= HOME DASHBOARD (REFERENCE RIGHT SCREEN) ================= */}
              {activeTab === 'home' && (
                <div className="px-5 py-2 space-y-4 animate-fadeIn">
                  
                  {/* Greeting */}
                  <div className="space-y-0.5">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-1.5">
                      <span>Good evening, {activeProfile?.name || 'Alex'}</span>
                      <span className="text-xl">👋</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-normal">
                      Let&apos;s see what the stars have for you today.
                    </p>
                  </div>

                  {/* HERO CARD 1: TODAY'S COSMIC INSIGHT */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#FFF5EE] via-[#FDF0E6] to-[#F5EAFE] border border-orange-200/50 shadow-xs relative overflow-hidden flex items-center justify-between gap-2">
                    <div className="space-y-2 z-10 flex-1 max-w-[210px] sm:max-w-[230px]">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[#FF552E] text-[10px] font-bold border border-orange-200/60 shadow-xs">
                        <Sparkles className="w-3 h-3 text-[#FF552E]" />
                        <span>Today&apos;s Insight</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                        A day to slow down and trust your instincts.
                      </h3>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        AstroAI found an interesting pattern in your chart.
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab('ask');
                          handleSendMessage('Explain today’s cosmic pattern and why I should slow down and trust my instincts.');
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#FF552E] hover:from-[#FF552E] hover:to-[#E0451E] text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all active:scale-95"
                      >
                        <span>Explore Insight</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Integrated 3D Artwork */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden relative shrink-0 shadow-sm border border-purple-100/50 bg-white/40">
                      <Image
                        src="/images/astroai/insight_girl.jpg"
                        alt="Today's Cosmic Insight"
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>

                  {/* SECTION: EXPLORE ASTROAI */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-900 tracking-tight">Explore AstroAI</h3>
                      <button
                        onClick={() => setActiveTab('discover')}
                        className="text-xs text-[#FF552E] font-semibold hover:underline"
                      >
                        See all
                      </button>
                    </div>

                    {/* HERO CARD 2: ASK ASTROAI (LARGE AI HERO BANNER) */}
                    <div
                      onClick={() => setActiveTab('ask')}
                      className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#EBF3FE] via-[#EDE9FE] to-[#FCE7F3] border border-indigo-100/70 shadow-xs cursor-pointer relative overflow-hidden flex items-center justify-between gap-3 group transition-all hover:scale-[1.01]"
                    >
                      <div className="space-y-1.5 z-10 flex-1 max-w-[210px] sm:max-w-[230px]">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900">Ask AstroAI</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Your personal astrologer, anytime.
                        </p>
                        <div className="pt-1">
                          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#FF552E] text-white text-xs font-bold shadow-md shadow-orange-500/25 group-hover:bg-[#FF552E] transition-all">
                            <span>Start Chat</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 3D Cute AI Robot Avatar */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden relative shrink-0 shadow-sm border border-indigo-100/50 bg-white/60 group-hover:scale-105 transition-transform">
                        <Image
                          src="/images/astroai/robot_avatar.jpg"
                          alt="Ask AstroAI"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* 6 FEATURE GRID TILES (2 ROWS X 3 COLUMNS) */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      
                      {/* Tile 1: My Kundli */}
                      <div
                        onClick={() => setActiveTab('kundli')}
                        className="p-2.5 rounded-2xl bg-white hover:bg-purple-50/40 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center space-y-1.5 group active:scale-95"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden relative shadow-xs group-hover:scale-105 transition-transform">
                          <Image src="/images/astroai/kundli_icon.jpg" alt="My Kundli" fill className="object-cover" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-gray-900">My Kundli</h5>
                          <p className="text-[10px] text-gray-400 line-clamp-1">Explore your chart</p>
                        </div>
                      </div>

                      {/* Tile 2: Horoscope */}
                      <div
                        onClick={() => setActiveTab('horoscope')}
                        className="p-2.5 rounded-2xl bg-white hover:bg-blue-50/40 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center space-y-1.5 group active:scale-95"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden relative shadow-xs group-hover:scale-105 transition-transform">
                          <Image src="/images/astroai/horoscope_icon.jpg" alt="Horoscope" fill className="object-cover" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-gray-900">Horoscope</h5>
                          <p className="text-[10px] text-gray-400 line-clamp-1">Today&apos;s cosmic view</p>
                        </div>
                      </div>

                      {/* Tile 3: Compatibility */}
                      <div
                        onClick={() => setActiveTab('compatibility')}
                        className="p-2.5 rounded-2xl bg-white hover:bg-pink-50/40 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center space-y-1.5 group active:scale-95"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden relative shadow-xs group-hover:scale-105 transition-transform">
                          <Image src="/images/astroai/compatibility_icon.jpg" alt="Compatibility" fill className="object-cover" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-gray-900">Compatibility</h5>
                          <p className="text-[10px] text-gray-400 line-clamp-1">Find your match</p>
                        </div>
                      </div>

                      {/* Tile 4: Predictions */}
                      <div
                        onClick={() => setActiveTab('predictions')}
                        className="p-2.5 rounded-2xl bg-white hover:bg-amber-50/40 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center space-y-1.5 group active:scale-95"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden relative shadow-xs group-hover:scale-105 transition-transform">
                          <Image src="/images/astroai/predictions_icon.jpg" alt="Predictions" fill className="object-cover" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-gray-900">Predictions</h5>
                          <p className="text-[10px] text-gray-400 line-clamp-1">Your future insights</p>
                        </div>
                      </div>

                      {/* Tile 5: Career */}
                      <div
                        onClick={() => {
                          setActiveTab('ask');
                          handleSendMessage('Give me a detailed breakdown of my career path and vocational strengths from my birth chart.');
                        }}
                        className="p-2.5 rounded-2xl bg-white hover:bg-teal-50/40 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center space-y-1.5 group active:scale-95"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden relative shadow-xs group-hover:scale-105 transition-transform">
                          <Image src="/images/astroai/career_icon.jpg" alt="Career" fill className="object-cover" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-gray-900">Career</h5>
                          <p className="text-[10px] text-gray-400 line-clamp-1">Growth & opportunities</p>
                        </div>
                      </div>

                      {/* Tile 6: Moon Insights */}
                      <div
                        onClick={() => {
                          setActiveTab('ask');
                          handleSendMessage('Explain my Moon sign Nakshatra and emotional subconscious rhythms.');
                        }}
                        className="p-2.5 rounded-2xl bg-white hover:bg-purple-50/40 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center space-y-1.5 group active:scale-95"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden relative shadow-xs group-hover:scale-105 transition-transform">
                          <Image src="/images/astroai/moon_icon.jpg" alt="Moon Insights" fill className="object-cover" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-gray-900">Moon Insights</h5>
                          <p className="text-[10px] text-gray-400 line-clamp-1">Emotional guidance</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* TODAY'S VIBE FOOTER BANNER */}
                  <div
                    onClick={() => {
                      setActiveTab('ask');
                      handleSendMessage('Tell me more about today’s vibe and why I am in a good space for new beginnings.');
                    }}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-pink-50 border border-amber-100/70 flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">☀️</span>
                      <div>
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Today&apos;s Vibe</span>
                        <p className="text-xs font-semibold text-gray-800">You&apos;re in a good space for new beginnings.</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-400">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              )}

              {/* ================= 2. ASK ASTROAI (CONVERSATIONAL AI) ================= */}
              {activeTab === 'ask' && (
                <div className="h-full flex flex-col justify-between bg-white animate-fadeIn">
                  
                  {/* Visual AI Header */}
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl overflow-hidden relative shadow-xs border border-orange-100">
                        <Image src="/images/astroai/robot_avatar.jpg" alt="AstroAI Assistant" fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">AstroAI</h3>
                        <p className="text-[11px] text-gray-400">Your personal astrologer</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Clear chat history?')) setChatMessages([]);
                      }}
                      className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      title="Clear chat"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#FAFAFC]">
                    {chatMessages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden relative shadow-sm border border-purple-100">
                          <Image src="/images/astroai/robot_avatar.jpg" alt="AstroAI" fill className="object-cover" />
                        </div>
                        <h3 className="font-bold text-base text-gray-900">What&apos;s on your mind?</h3>
                        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                          Ask anything about your life, career, relationships, or planetary timing.
                        </p>
                      </div>
                    )}

                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed max-w-[90%] sm:max-w-[85%] shadow-xs ${
                            msg.sender === 'user'
                              ? 'bg-[#FF552E] text-white rounded-tr-sm'
                              : 'bg-white border border-gray-100/90 text-gray-800 rounded-tl-sm space-y-1'
                          }`}
                        >
                          {msg.sender === 'oracle' ? renderStructuredMessage(msg.text) : msg.text}
                        </div>
                      </div>
                    ))}

                    {isGenerating && (
                      <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white border border-gray-100 text-xs text-gray-500 flex items-center gap-2.5 shadow-xs">
                        <div className="w-3.5 h-3.5 border-2 border-[#FF552E] border-t-transparent rounded-full animate-spin" />
                        <span>{streamingThought || 'AstroAI is reading your birth chart...'}</span>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestion Pills */}
                  <div className="px-3 py-2 border-t border-gray-100 bg-white overflow-x-auto flex items-center gap-2 scrollbar-none">
                    {SUGGESTED_PILLS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(item.query)}
                        disabled={isGenerating}
                        className="shrink-0 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-orange-50 border border-gray-200/60 hover:border-orange-200 text-xs font-medium text-gray-700 hover:text-[#FF552E] transition-all disabled:opacity-40 whitespace-nowrap"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Input Box */}
                  <div className="p-3 sm:p-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/80 focus-within:border-[#FF552E] rounded-2xl px-3 py-1.5 transition-all">
                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        title={isListening ? 'Stop Listening' : 'Voice Input'}
                        className={`p-2 rounded-xl transition-all ${
                          isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>

                      <input
                        type="text"
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask anything..."
                        className="flex-1 bg-transparent text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none px-2 py-1.5"
                      />

                      <button
                        onClick={() => handleSendMessage()}
                        disabled={isGenerating || !inputQuery.trim()}
                        className="p-2.5 rounded-xl bg-[#FF552E] hover:bg-[#E0451E] disabled:opacity-30 text-white font-bold transition-all shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* ================= 3. MY KUNDLI SCREEN ================= */}
              {activeTab === 'kundli' && (
                <div className="p-5 space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Your Cosmic Profile</h2>
                      <p className="text-xs text-gray-500">Key astrological pillars explained in simple language.</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative shadow-xs">
                      <Image src="/images/astroai/kundli_icon.jpg" alt="Kundli" fill className="object-cover" />
                    </div>
                  </div>

                  {/* 4 Pillars Card Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-3xl bg-white border border-amber-100 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Sun</span>
                      <h4 className="text-lg font-bold text-gray-900">{blueprint?.planets?.find((p: any) => p.name === 'Sun')?.signName || 'Leo'}</h4>
                      <p className="text-[11px] text-gray-500 leading-tight">Core vitality & purpose</p>
                    </div>

                    <div className="p-4 rounded-3xl bg-white border border-blue-100 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Moon</span>
                      <h4 className="text-lg font-bold text-gray-900">{blueprint?.planets?.find((p: any) => p.name === 'Moon')?.signName || 'Scorpio'}</h4>
                      <p className="text-[11px] text-gray-500 leading-tight">Intuition & emotion</p>
                    </div>

                    <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Rising</span>
                      <h4 className="text-lg font-bold text-gray-900">{blueprint?.ascendantSign || 'Gemini'}</h4>
                      <p className="text-[11px] text-gray-500 leading-tight">Outer persona & Lagna</p>
                    </div>

                    <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Nakshatra</span>
                      <h4 className="text-lg font-bold text-gray-900 truncate">{blueprint?.ascendantNakshatra || 'Rohini'}</h4>
                      <p className="text-[11px] text-gray-500 leading-tight">Birth lunar mansion</p>
                    </div>
                  </div>

                  {/* Personality at a Glance */}
                  <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-3">
                    <h4 className="text-sm font-bold text-gray-900">Your Personality at a Glance</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-orange-50 text-[#FF552E] font-bold text-xs border border-orange-200/60">
                        Curious
                      </span>
                      <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200/60">
                        Intense
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200/60">
                        Independent
                      </span>
                      <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-bold text-xs border border-teal-200/60">
                        Intuitive
                      </span>
                    </div>
                  </div>

                  {/* Expand Full Chart CTA */}
                  <div>
                    <button
                      onClick={() => setShowAdvancedKundli(!showAdvancedKundli)}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <span>{showAdvancedKundli ? 'Hide Full Chart' : 'Explore Full Chart →'}</span>
                      {showAdvancedKundli ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showAdvancedKundli && (
                      <div className="mt-3 p-4 rounded-3xl bg-white border border-gray-100 space-y-3 animate-fadeIn">
                        <h5 className="text-xs font-bold text-gray-900">9 Planetary Coordinates & Bhavas</h5>
                        <div className="space-y-1.5">
                          {blueprint?.planets?.map((p: Planet) => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setActiveTab('ask');
                                handleSendMessage(`Explain ${p.name} in ${p.signName} (House ${p.houseNumber}) in detail.`);
                              }}
                              className="p-2.5 rounded-xl bg-gray-50 hover:bg-orange-50/50 border border-gray-100 flex items-center justify-between text-xs cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#FF552E]">{p.glyph}</span>
                                <span className="font-semibold text-gray-900">{p.name}</span>
                              </div>
                              <span className="text-gray-500 font-medium">{p.signName} {p.degreeInSign.toFixed(1)}° (H{p.houseNumber})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ================= 4. HOROSCOPE SCREEN ================= */}
              {activeTab === 'horoscope' && (
                <div className="p-5 space-y-5 animate-fadeIn">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Today&apos;s Horoscope</h2>
                    <p className="text-xs text-gray-500">Select any zodiac sign for instant daily guidance.</p>
                  </div>

                  {/* Horizontal Zodiac Selector */}
                  <div className="overflow-x-auto flex items-center gap-2 pb-2 scrollbar-none">
                    {ZODIAC_LIST.map((z, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedZodiac(z)}
                        className={`shrink-0 px-3.5 py-2 rounded-2xl border text-center transition-all flex items-center gap-1.5 ${
                          selectedZodiac.name === z.name
                            ? 'bg-[#FF552E] text-white border-[#FF552E] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200/80 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm">{z.symbol}</span>
                        <span className="text-xs font-bold">{z.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Sign Hero Card */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border border-purple-100/70 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#FF552E] block">{selectedZodiac.dates}</span>
                        <h3 className="text-xl font-bold text-gray-900">{selectedZodiac.name} ({selectedZodiac.symbol})</h3>
                      </div>
                      <div className="w-12 h-12 rounded-2xl overflow-hidden relative shadow-xs">
                        <Image src="/images/astroai/horoscope_icon.jpg" alt="Horoscope" fill className="object-cover" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-white/90 border border-gray-100 space-y-1">
                        <span className="font-bold text-rose-600 block">❤️ Love</span>
                        <p className="text-gray-600 leading-snug">Warm openness brings harmonious connection.</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/90 border border-gray-100 space-y-1">
                        <span className="font-bold text-amber-600 block">💼 Career</span>
                        <p className="text-gray-600 leading-snug">Ideal time to refine long-term plans.</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/90 border border-gray-100 space-y-1">
                        <span className="font-bold text-emerald-600 block">💰 Money</span>
                        <p className="text-gray-600 leading-snug">Favorable for reviewing budget goals.</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/90 border border-gray-100 space-y-1">
                        <span className="font-bold text-blue-600 block">⚡ Energy</span>
                        <p className="text-gray-600 leading-snug">Peak mental focus in the afternoon.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('ask');
                        handleSendMessage(`Give me a detailed horoscope reading for ${selectedZodiac.name} today.`);
                      }}
                      className="w-full py-2.5 rounded-full bg-[#FF552E] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:bg-[#E0451E] transition-all"
                    >
                      Ask AI about {selectedZodiac.name} →
                    </button>
                  </div>
                </div>
              )}

              {/* ================= 5. COMPATIBILITY SCREEN ================= */}
              {activeTab === 'compatibility' && (
                <div className="p-5 space-y-5 animate-fadeIn">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Explore Your Connection ❤️</h2>
                    <p className="text-xs text-gray-500">Discover emotional, romantic, and communicative harmony.</p>
                  </div>

                  {/* Two Profile Illustrations */}
                  <div className="p-5 rounded-3xl bg-white border border-pink-100 shadow-xs space-y-4">
                    <div className="flex items-center justify-around py-2">
                      <div className="text-center space-y-1.5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-300 p-0.5 shadow-sm mx-auto overflow-hidden">
                          <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-base font-bold text-[#FF552E]">
                            {activeProfile?.name?.charAt(0) || 'Y'}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-900 block">YOU ({activeProfile?.name || 'Alex'})</span>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-500 font-bold text-lg">
                        +
                      </div>

                      <div className="text-center space-y-1.5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 p-0.5 shadow-sm mx-auto overflow-hidden">
                          <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-base font-bold text-pink-600">
                            {partnerName.charAt(0) || 'P'}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-900 block">PARTNER ({partnerName})</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1 font-medium">Partner Name</label>
                        <input
                          type="text"
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#FF552E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-1 font-medium">Birth Date</label>
                        <input
                          type="date"
                          value={partnerDate}
                          onChange={(e) => setPartnerDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#FF552E]"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCalculateCompatibility}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-pink-500/25 transition-all"
                    >
                      Explore Your Connection
                    </button>
                  </div>

                  {/* Results Breakdown */}
                  {compatibilityResult && (
                    <div className="p-5 rounded-3xl bg-white border border-pink-100 shadow-xs space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <h4 className="font-bold text-sm text-gray-900">A Strong Connection</h4>
                        <span className="text-xs font-bold text-pink-600 px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200">
                          High Harmony
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100/60">
                          <strong className="text-rose-900 block mb-0.5">❤️ Emotional</strong>
                          <p className="text-gray-700 leading-relaxed">{compatibilityResult.emotional}</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100/60">
                          <strong className="text-blue-900 block mb-0.5">💬 Communication</strong>
                          <p className="text-gray-700 leading-relaxed">{compatibilityResult.communication}</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100/60">
                          <strong className="text-amber-900 block mb-0.5">🔥 Attraction</strong>
                          <p className="text-gray-700 leading-relaxed">{compatibilityResult.attraction}</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100/60">
                          <strong className="text-purple-900 block mb-0.5">💍 Long-term</strong>
                          <p className="text-gray-700 leading-relaxed">{compatibilityResult.longTerm}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const text = `❤️ Our Astro Compatibility: ${activeProfile?.name} + ${compatibilityResult.partner}\n"A Strong Connection" on AstroAI!`;
                          if (navigator.share) {
                            navigator.share({ title: 'AstroAI Compatibility', text, url: window.location.href });
                          } else {
                            navigator.clipboard.writeText(text);
                            setIsCopiedShare(true);
                            setTimeout(() => setIsCopiedShare(false), 2000);
                          }
                        }}
                        className="w-full py-2.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-pink-200"
                      >
                        {isCopiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{isCopiedShare ? 'Card Copied!' : 'Share Compatibility'}</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* ================= 6. PREDICTIONS SCREEN ================= */}
              {activeTab === 'predictions' && (
                <div className="p-5 space-y-5 animate-fadeIn">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Your Predictions</h2>
                    <p className="text-xs text-gray-500">Personalized timeline forecasts calibrated to your chart.</p>
                  </div>

                  {/* Tabs: Today | This Week | This Month */}
                  <div className="flex p-1 rounded-2xl bg-gray-100 border border-gray-200/60">
                    <button
                      onClick={() => setPredictionTimeline('today')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        predictionTimeline === 'today' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setPredictionTimeline('week')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        predictionTimeline === 'week' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      This Week
                    </button>
                    <button
                      onClick={() => setPredictionTimeline('month')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        predictionTimeline === 'month' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      This Month
                    </button>
                  </div>

                  {/* Feed Items */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                        <Heart className="w-4 h-4" />
                        <span>❤️ Love & Connection</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        You may feel more open to honest conversations today. Speak authentically and listen with patience.
                      </p>
                    </div>

                    <div className="p-4 rounded-3xl bg-white border border-amber-100 shadow-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                        <Briefcase className="w-4 h-4" />
                        <span>💼 Career & Direction</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        A good day to revisit unfinished plans and refine workflows before jumping into new commitments.
                      </p>
                    </div>

                    <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                        <Coins className="w-4 h-4" />
                        <span>💰 Money & Spending</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Review your spending before making a major decision. Steady patience protects long-term security.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* ================= 7. DISCOVER LIBRARY SCREEN ================= */}
              {activeTab === 'discover' && (
                <div className="p-5 space-y-5 animate-fadeIn">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Discover</h2>
                    <p className="text-xs text-gray-500">Explore guides, wisdom, and astrological mastery.</p>
                  </div>

                  <div className="space-y-3">
                    {DISCOVER_ARTICLES.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => {
                          setActiveTab('ask');
                          handleSendMessage(`Explain the principles of: ${art.title}`);
                        }}
                        className="p-4 rounded-3xl bg-white hover:bg-orange-50/40 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${art.color}`}>
                            {art.category}
                          </span>
                          <span className="text-[11px] text-gray-400">{art.readTime}</span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#FF552E] transition-colors">
                          {art.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {art.description}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ================= 8. PROFILE & PREFERENCES ================= */}
              {activeTab === 'profile' && (
                <div className="p-5 space-y-5 animate-fadeIn">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Your Profile</h2>
                    <p className="text-xs text-gray-500">Manage birth details and personal preferences.</p>
                  </div>

                  {/* Profile Header Card */}
                  <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-300 p-0.5 shadow-sm overflow-hidden">
                        <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-lg font-bold text-[#FF552E]">
                          {activeProfile?.name?.charAt(0) || 'A'}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{activeProfile?.name || 'Alex'}</h4>
                        <p className="text-xs text-gray-500">{activeProfile?.email || 'alex@astroai.app'}</p>
                        <p className="text-[11px] text-[#FF552E] font-medium pt-0.5">
                          {blueprint?.ascendantSign || 'Virgo'} Lagna • {activeProfile?.astrologySystem || 'Vedic'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCalibrating(true)}
                      className="px-3.5 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-xs text-gray-700 font-bold border border-gray-200 transition-colors"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Tasteful Premium Upgrade Section */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FFF5EE] via-[#FFEADB] to-[#F3E8FF] border border-orange-200/60 shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#FF552E]">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span>AstroAI Unlimited</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">Unlock Full Chart Insights & Synastry</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Unlimited AI consultations, instant relationship compatibility reports, and deep transit timeline forecasts.
                    </p>
                    <button className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#FF552E] text-white text-xs font-bold shadow-md shadow-orange-500/25">
                      Explore Premium
                    </button>
                  </div>

                  {/* Settings Links */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('kundli')}
                      className="w-full p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-xs flex items-center justify-between text-xs text-gray-800 font-medium transition-all"
                    >
                      <span className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4 text-blue-500" />
                        <span>Birth Details & Chart</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => setIsCalibrating(true)}
                      className="w-full p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-xs flex items-center justify-between text-xs text-gray-800 font-medium transition-all"
                    >
                      <span className="flex items-center gap-2.5">
                        <Sliders className="w-4 h-4 text-orange-500" />
                        <span>Astrology System ({activeProfile?.astrologySystem || 'Vedic'})</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => setCurrentView('welcome')}
                      className="w-full p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-xs flex items-center justify-between text-xs text-gray-800 font-medium transition-all"
                    >
                      <span className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span>View Welcome Splash</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <Link
                      href="/astroai/delete-account"
                      className="w-full p-4 rounded-2xl bg-white hover:bg-rose-50/50 border border-rose-100 shadow-xs flex items-center justify-between text-xs text-rose-600 font-medium transition-all"
                    >
                      <span className="flex items-center gap-2.5">
                        <Shield className="w-4 h-4 text-rose-500" />
                        <span>Google Play Data Safety & Account Deletion</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-rose-300" />
                    </Link>
                  </div>

                </div>
              )}

            </div>

            {/* ================= CLEAN 4-ITEM BOTTOM NAVIGATION (REFERENCE DOCK) ================= */}
            <nav className="h-16 border-t border-gray-100 bg-white/95 backdrop-blur-md shrink-0 flex items-center justify-around px-4 z-40">
              {/* Home */}
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                  activeTab === 'home' ? 'text-[#FF552E]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              {/* Prominent Center Ask Button */}
              <button
                onClick={() => setActiveTab('ask')}
                className="flex flex-col items-center -mt-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#FF552E] flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                </div>
                <span className={`text-[11px] font-bold mt-1 ${activeTab === 'ask' ? 'text-[#FF552E]' : 'text-gray-400'}`}>
                  Ask
                </span>
              </button>

              {/* Discover */}
              <button
                onClick={() => setActiveTab('discover')}
                className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                  activeTab === 'discover' ? 'text-[#FF552E]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Discover</span>
              </button>

              {/* Profile */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                  activeTab === 'profile' ? 'text-[#FF552E]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </nav>

          </div>
        )}

      </div>

      {/* ================= CALIBRATION / BIRTH DETAILS MODAL ================= */}
      {isCalibrating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-gray-100 shadow-2xl space-y-4 my-auto animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {hasProfile ? 'Edit Birth Details' : 'Welcome to AstroAI 👋'}
                </h3>
                <p className="text-xs text-gray-500">
                  {hasProfile ? 'Update your birth coordinates' : 'Enter your details to generate your personalized chart'}
                </p>
              </div>
              {hasProfile && (
                <button onClick={() => setIsCalibrating(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF552E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Birth Date</label>
                  <input
                    type="date"
                    required
                    value={profileForm.birthDate}
                    onChange={(e) => setProfileForm({ ...profileForm, birthDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#FF552E]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-700 font-bold">Time</label>
                    <label className="flex items-center gap-1 text-[10px] text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileForm.isTimeUnknown}
                        onChange={(e) => setProfileForm({ ...profileForm, isTimeUnknown: e.target.checked })}
                        className="rounded text-[#FF552E]"
                      />
                      <span>Approx</span>
                    </label>
                  </div>
                  <input
                    type="time"
                    disabled={profileForm.isTimeUnknown}
                    value={profileForm.birthTime}
                    onChange={(e) => setProfileForm({ ...profileForm, birthTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#FF552E] disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 font-bold">Birthplace</label>
                <input
                  type="text"
                  required
                  placeholder="City, Country"
                  value={profileForm.place}
                  onChange={(e) => setProfileForm({ ...profileForm, place: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF552E]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Astrology System</label>
                <select
                  value={profileForm.astrologySystem}
                  onChange={(e) => setProfileForm({ ...profileForm, astrologySystem: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs focus:outline-none"
                >
                  <option value="Vedic">Vedic (Lahiri Sidereal - Recommended)</option>
                  <option value="Western">Western (Tropical)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                {hasProfile && (
                  <button
                    type="button"
                    onClick={() => setIsCalibrating(false)}
                    className="px-3.5 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FF552E] hover:bg-[#E0451E] text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all"
                >
                  Generate My Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
