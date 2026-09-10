'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Compass,
  MessageSquare,
  User,
  Sparkles,
  Clock,
  Layers,
  Orbit,
  Globe,
  Flame,
  Heart,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  ChevronDown,
  Phone,
  MessageCircle,
  Calendar,
  ArrowUpRight,
  Share2,
  Printer,
  Download,
  Eye,
  Bell,
  Sliders,
  ShieldCheck,
  Star,
  Zap,
  Wallet,
  RefreshCw,
  Check,
  MapPin,
  FileText,
  Moon,
  Sun,
  Video,
  PhoneIncoming,
  PhoneCall,
  KeyRound,
  Copy,
  Upload,
  Paperclip,
  FileCheck,
  TrendingUp,
  Search,
  Lock
} from 'lucide-react';
import BengaliChart, { BengaliPlanetInfo } from '@/components/charts/BengaliChart';
import LiveConsultationRoom from '@/components/consultation/LiveConsultationRoom';
import { calculateYumsharol, NAKSHATRAS_LIST } from '@/lib/astrology/yumsharol';
import { calculateSadeSati } from '@/lib/astrology/sadeSati';
import { calculateManglikDosh } from '@/lib/astrology/manglik';
import { calculateKaalSarpDosh } from '@/lib/astrology/kaalSarp';
import { calculateCoupleMatch } from '@/lib/astrology/matchMaking';
import { calculatePlanetaryYogas } from '@/lib/astrology/yogas';
import { calculateNgaEeshing, RASHI_LIST_NGA_EESHING, NgaEeshingResult } from '@/lib/astrology/ngaEeshing';
import { calculateVedicNumerology } from '@/engine/numerology';
import { calculateDetailedVimshottari } from '@/engine/vedicWorkstationEngine';
import { calculatePlanetaryPositions } from '@/engine/ephemeris';

// ==========================================
// BENGALI FORMATTING & DICTIONARIES
// ==========================================
function toBengaliDigits(num: number | string): string {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bengaliNumerals[parseInt(digit)]);
}

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================
type TabType = 'overview' | 'kuthi' | 'live' | 'charts' | 'profile';
type KuthiFilter = 'ALL' | 'PENDING' | 'COMPLETED';

interface KuthiOrder {
  id: string;
  orderRef?: string;
  clientName: string;
  serviceType: string;
  status: 'ASSIGNED' | 'IN_ANALYSIS' | 'COMPLETED';
  date: string;
  payoutFee: number;
  clientDetails: {
    sex: string;
    mobile: string;
    whatsappNo: string;
    email: string;
    dob: string;
    tob: string;
    pob: string;
    kuthiAttached: boolean;
    kuthiFileName?: string;
    kuthiFileUrl?: string;
    uploadedFiles?: string[];
    question?: string;
    lagna?: string;
    moonSign?: string;
    gotra?: string;
    yek?: string;
    faithTradition?: 'Hinduism' | 'Sanamahi Laining' | string;
  };
  d1Planets: BengaliPlanetInfo[];
  d9Planets: BengaliPlanetInfo[];
  lagnaIndex: number; // 0..11
  navLagnaIndex: number;
}

interface LiveCallAppointment {
  id: string;
  clientName: string;
  avatar: string;
  phone: string;
  mode: 'VIDEO' | 'VOICE';
  durationMinutes: number;
  scheduledTime: string;
  fee: number;
  status: 'RINGING' | 'WAITING' | 'COMPLETED';
  topic: string;
}

interface PanchangItem {
  id: string;
  label: string;
  value: string;
  sub?: string;
  icon: string;
  highlight?: boolean;
}

// ==========================================
// INITIAL DATASETS
// ==========================================
const SAMPLE_PANCHANG: PanchangItem[] = [
  { id: '1', label: 'Tithi', value: 'Shukla Navami (নৱমী)', sub: '৯২% Waxing', icon: '🌕', highlight: true },
  { id: '2', label: 'Nakshatra', value: 'Rohini (রোহিণী)', sub: 'চন্দ্রপতি (Moon)', icon: '✨' },
  { id: '3', label: 'Moon Sign', value: 'Vrishabha (বৃষ)', sub: 'তুঙ্গী ২৮° (Exalted)', icon: '🐂' },
  { id: '4', label: 'Yoga', value: 'Siddhi Yoga (সিদ্ধি)', sub: 'Auspicious', icon: '🧘' },
  { id: '5', label: 'Rahu Kaal', value: '১৬:৩০ – ১৮:০০', sub: 'শুভ কার্য বর্জনীয়', icon: '⏳', highlight: true },
  { id: '6', label: 'Sun Sign', value: 'Simha (সিংহ)', sub: 'পূর্বফল্গুনী', icon: '☀️' },
  { id: '7', label: 'Karana', value: 'Balava (বালব)', sub: '২২:৪৫ পর্যন্ত', icon: '⚖️' },
];

const INITIAL_KUTHI_ORDERS: KuthiOrder[] = [];

const INITIAL_LIVE_CALLS: LiveCallAppointment[] = [];

export interface MobileCustomizerConfig {
  showAdBanner?: boolean;
  adTag?: string;
  adTitle?: string;
  adSubtitle?: string;
  adBannerUrl?: string;
  stationCity?: string;
  tithiText?: string;
  nakshatraText?: string;
  rahuKaalText?: string;
  pendingKuthiOrders?: number;
  activeLiveCalls?: number;
  walletBalance?: number;
  isOnline?: boolean;
  enabledEngines?: {
    sadesati?: boolean;
    manglik?: boolean;
    kaalsarp?: boolean;
    ngaaeeshing?: boolean;
    matchmaking?: boolean;
    yogas?: boolean;
    yumsharol?: boolean;
    kundali?: boolean;
  };
  notices?: any[];
  sections?: any[];
}

interface AstrologerMobileDashboardProps {
  customConfig?: MobileCustomizerConfig;
}

export default function AstrologerMobileDashboard({ customConfig }: AstrologerMobileDashboardProps = {}) {
  // Theme state matching desktop version (defaults to 'light', synced with localStorage)
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [astroUser, setAstroUser] = useState<any>({
    name: 'Empaneled Astrologer',
    avatar: '',
    phone: '',
    specialty: 'Master Vedic Astrologer & Kuthi Specialist',
  });

  // Customizer Configuration State (with defaults or localStorage sync)
  const [config, setConfig] = useState<MobileCustomizerConfig>({
    showAdBanner: true,
    adTag: 'SPONSORED',
    adTitle: 'Ceylon Unheated Yellow Sapphires (Pukhraj)',
    adSubtitle: 'Lab Certified 100% Natural • Special Astrologer Partner Discount',
    adBannerUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    stationCity: 'Imphal · 24.8°N',
    tithiText: 'Shukla Navami (নৱমী)',
    nakshatraText: 'Rohini (রোহিণী)',
    rahuKaalText: '16:30 – 18:00',
    pendingKuthiOrders: 4,
    activeLiveCalls: 1,
    walletBalance: 14850,
    isOnline: true,
    enabledEngines: {
      sadesati: true,
      manglik: true,
      kaalsarp: true,
      ngaaeeshing: true,
      matchmaking: true,
      yogas: true,
      yumsharol: true,
      kundali: true,
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem('astro_theme') as 'dark' | 'light';
    if (saved) setTheme(saved);
    const savedUser = localStorage.getItem('kanglei_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && u.name) setAstroUser(u);
      } catch (e) {}
    }

    const loadSavedConfig = () => {
      const savedMobileConfig = localStorage.getItem('kanglei_mobile_customizer_config');
      if (savedMobileConfig) {
        try {
          const parsed = JSON.parse(savedMobileConfig);
          if (parsed) {
            setConfig((prev) => ({ ...prev, ...parsed }));
            if (typeof parsed.walletBalance === 'number') {
              setWalletBalance(parsed.walletBalance);
            }
            if (typeof parsed.isOnline === 'boolean') {
              setIsOnline(parsed.isOnline);
            }
          }
        } catch (e) {}
      }
    };

    loadSavedConfig();

    const handleConfigUpdate = () => {
      loadSavedConfig();
    };

    window.addEventListener('storage', handleConfigUpdate);
    window.addEventListener('kanglei_mobile_config_updated', handleConfigUpdate);

    return () => {
      window.removeEventListener('storage', handleConfigUpdate);
      window.removeEventListener('kanglei_mobile_config_updated', handleConfigUpdate);
    };
  }, []);

  // Sync if customConfig prop changes in real-time
  useEffect(() => {
    if (customConfig) {
      setConfig((prev) => ({ ...prev, ...customConfig }));
    }
  }, [customConfig]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('astro_theme', nextTheme);
  };

  // Navigation: 5 distinct app tabs
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Kuthi Orders State (NO live call here!)
  const [kuthiOrders, setKuthiOrders] = useState<KuthiOrder[]>(INITIAL_KUTHI_ORDERS);
  const [kuthiFilter, setKuthiFilter] = useState<KuthiFilter>('ALL');
  const [inspectingKuthi, setInspectingKuthi] = useState<KuthiOrder | null>(null);
  const [uploadingKuthi, setUploadingKuthi] = useState<KuthiOrder | null>(null);
  const [uploadFile, setUploadFile] = useState<string>('');
  const [uploadNotes, setUploadNotes] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Live Consultations State (Phone/Video calls & Real-Time Chat ONLY)
  const [liveAppointments, setLiveAppointments] = useState<LiveCallAppointment[]>(INITIAL_LIVE_CALLS);
  const [incomingSession, setIncomingSession] = useState<any>(null);
  const [activeLiveSessionId, setActiveLiveSessionId] = useState<string | null>(null);

  // Bengali Chart State
  const [selectedChartOrder, setSelectedChartOrder] = useState<KuthiOrder>(INITIAL_KUTHI_ORDERS[0]);
  const [selectedChartType, setSelectedChartType] = useState<'D1' | 'D9'>('D1');

  // Notifications
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Kuthi Order Assigned', desc: 'Thoibi Ningthoujam submitted paper Kuthi document', time: '10m ago', unread: true },
    { id: 2, title: 'Wallet Payout Processed', desc: '₹4,200 deposited via UPI successfully', time: '2h ago', unread: true },
    { id: 3, title: 'Eastern Lahiri Ephemeris', desc: 'Manipuri Panchanga 2026 calibrated', time: '1d ago', unread: false },
  ]);

  // Quick Tools Modal
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);
  const [mobileYumDob, setMobileYumDob] = useState('');
  const [mobileYumTob, setMobileYumTob] = useState('');
  const [mobileYumNakshatra, setMobileYumNakshatra] = useState(1);
  const [mobileYumConstant, setMobileYumConstant] = useState(15);
  const [mobileYumResult, setMobileYumResult] = useState<any>(null);
  const [mobileYumErr, setMobileYumErr] = useState('');
  const [mobileToolResult, setMobileToolResult] = useState<any>(null);
  const [mobileBirthForm, setMobileBirthForm] = useState({
    name: '',
    gender: 'Female',
    dob: '',
    tob: '',
    pob: '',
    lat: '24.8170',
    lng: '93.9368',
    timezone: '5.5',
    faithTradition: 'Sanamahi Laining',
    yek: 'Ningthouja',
    gotra: 'Kashyap',
    partnerName: '',
    partnerDob: '',
    partnerTob: '',
    partnerPob: '',
    partnerLat: '24.8170',
    partnerLng: '93.9368',
  });
  const [mobileGroomRashi, setMobileGroomRashi] = useState<number>(0);
  const [mobileBrideRashi, setMobileBrideRashi] = useState<number>(0);
  const [mobileGroomName, setMobileGroomName] = useState<string>('');
  const [mobileBrideName, setMobileBrideName] = useState<string>('');
  const [mobileNgaEeshingResult, setMobileNgaEeshingResult] = useState<NgaEeshingResult | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const copyToClipboard = (text: string, label: string = 'Copied') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopyToast(`${label} copied to clipboard!`);
      setTimeout(() => setCopyToast(null), 2500);
    }
  };

  // Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(14850);

  // Real consultation polling from /api/consultations for Live Call tab
  const [dbConsultations, setDbConsultations] = useState<any[]>([]);

  // Announcements & Banner Carousel State (Matches Desktop Dashboard)
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements.filter((a: any) => a.isActive));
        }
      })
      .catch((err) => console.error('Error fetching mobile announcements:', err));

    // Also fetch live assigned kuthi orders to sync tradition & client details
    fetch('/api/kuthi')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders && Array.isArray(data.orders)) {
          // Filter ONLY Kuthi orders (exclude live consultation sessions)
          const kuthiOnly = data.orders.filter((o: any) => 
            !o.id?.startsWith('k-SESS') && 
            !o.serviceType?.toLowerCase().includes('live call') && 
            !o.serviceType?.toLowerCase().includes('live chat')
          );

          if (kuthiOnly.length > 0) {
            const mappedOrders: KuthiOrder[] = kuthiOnly.map((o: any, idx: number) => {
              const fileList: string[] = (Array.isArray(o.uploadedFiles) && o.uploadedFiles.length > 0)
                ? o.uploadedFiles
                : (o.kuthiFileName ? [o.kuthiFileName] : [`${(o.clientName || 'client').toLowerCase().replace(/\s+/g, '_')}_kuthi_paper.pdf`]);

              return {
                id: o.id || o.orderRef || `KO-2026-${8940 + idx}`,
                orderRef: o.orderRef || o.id,
                clientName: o.clientName,
                serviceType: o.serviceType || 'Kuthi Yengba Consultation',
                status: o.status || 'ASSIGNED',
                date: o.submittedAt || 'Today',
                payoutFee: o.amount ? Math.round(o.amount * 0.6) : 599,
                clientDetails: {
                  sex: o.sex || 'Client',
                  mobile: o.mobile || o.whatsappNo || '+91 98620 99881',
                  whatsappNo: o.whatsappNo || o.mobile || '+91 98620 99881',
                  email: o.email || '',
                  dob: o.dob || '24 Oct 1998',
                  tob: o.tob || '09:45 AM',
                  pob: o.pob || 'Imphal, Manipur',
                  gotra: o.gotra || 'Sandilya',
                  yek: o.yek || 'Khuman',
                  faithTradition: o.faithTradition || 'Hinduism',
                  kuthiAttached: true,
                  kuthiFileName: o.kuthiFileName || fileList[0],
                  kuthiFileUrl: o.kuthiFileUrl || '/sample_kuthi.pdf',
                  uploadedFiles: fileList,
                  question: o.question || '',
                  lagna: 'Vrischika (বৃশ্চিক)',
                  moonSign: 'Vrishabha (বৃষ)',
                },
                d1Planets: INITIAL_KUTHI_ORDERS[0].d1Planets,
                d9Planets: INITIAL_KUTHI_ORDERS[0].d9Planets,
                lagnaIndex: 7,
                navLagnaIndex: 3,
              };
            });
            setKuthiOrders(mappedOrders);
          }
        }
      })
      .catch((e) => console.warn('Could not sync kuthi orders for mobile view:', e));
  }, []);

  useEffect(() => {
    let isMounted = true;
    const pollConsultations = async () => {
      try {
        const res = await fetch('/api/consultations');
        const data = await res.json();
        if (data.sessions && Array.isArray(data.sessions) && isMounted) {
          // Filter sessions for this astrologer
          const mySessions = data.sessions.filter((s: any) => {
            return (
              !s.astrologerId ||
              s.astrologerId === 'astro-1' ||
              !s.astrologerName ||
              s.astrologerName.toLowerCase().includes('tombi')
            );
          });
          setDbConsultations(mySessions);

          // ONLY prompt incoming call popup if meetingLinkSent === true AND fresh (< 3 mins)
          const waiting = mySessions.find((s: any) => {
            if (s.status !== 'WAITING') return false;
            if (!s.meetingLinkSent) return false; // Available ONLY when link sent by admin!
            const age = Date.now() - new Date(s.createdAt || s.startTime || Date.now()).getTime();
            return !isNaN(age) && age >= 0 && age < 3 * 60 * 1000;
          });

          if (waiting && !activeLiveSessionId) {
            setIncomingSession(waiting);
          } else if (!waiting && incomingSession && !activeLiveSessionId) {
            setIncomingSession(null);
          }

          // CRITICAL: NEVER automatically open activeLiveSessionId!
          // Astrologer should only open the chat room when clicking explicitly.
        }
      } catch (err) {
        // silent polling catch
      }
    };

    pollConsultations();
    const timer = setInterval(pollConsultations, 3500);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [activeLiveSessionId, incomingSession]);

  const handleAcceptIncomingCall = async (sessionId: string) => {
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ACCEPT_SESSION', sessionId }),
      });
      const data = await res.json();
      if (data.session) {
        setActiveLiveSessionId(data.session.id);
        setIncomingSession(null);
        setActiveTab('live');
        return;
      }
    } catch (e) {
      console.error('Failed to accept consultation:', e);
    }
    setActiveLiveSessionId(sessionId);
    setIncomingSession(null);
    setActiveTab('live');
  };

  const handleStartLiveCall = async (clientName: string = 'Laishram Sanatomba', mode: 'VIDEO' | 'VOICE' = 'VIDEO') => {
    const sessionId = `SESS-${Date.now()}`;
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_SESSION',
          id: sessionId,
          mode: 'CALL',
          callType: mode,
          clientName: clientName,
          clientPhone: '+91 98620 11223',
          astrologerId: 'astro-1',
          astrologerName: astroUser.name || 'Empaneled Astrologer',
          status: 'LIVE',
          durationMinutes: 15,
          ratePerMin: 35,
          totalFee: 525,
        }),
      });
      const data = await res.json();
      if (data.session) {
        setActiveLiveSessionId(data.session.id);
        setActiveTab('live');
        return;
      }
    } catch (err) {
      console.error('Error creating live consultation session:', err);
    }
    setActiveLiveSessionId(sessionId);
    setActiveTab('live');
  };

  const handleSimulateIncomingCall = async () => {
    const testId = `SESS-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_SESSION',
          id: testId,
          mode: 'CALL',
          callType: 'VIDEO',
          clientName: 'Laishram Sanatomba',
          clientPhone: '+91 98620 01122',
          clientGender: 'Male',
          clientDob: '1996-04-12',
          clientTob: '08:45 AM',
          clientPob: 'Imphal West',
          astrologerId: 'astro-1',
          astrologerName: astroUser.name || 'Empaneled Astrologer',
          status: 'WAITING',
          durationMinutes: 15,
          ratePerMin: 35,
          totalFee: 525,
        }),
      });
      const data = await res.json();
      if (data.session) {
        setIncomingSession(data.session);
        return;
      }
    } catch (err) {}
    setIncomingSession({
      id: testId,
      mode: 'CALL',
      callType: 'VIDEO',
      clientName: 'Laishram Sanatomba',
      clientPhone: '+91 98620 01122',
      clientGender: 'Male',
      clientDob: '1996-04-12',
      durationMinutes: 15,
      totalFee: 525,
    });
  };

  const handleDeliverReport = (orderId: string) => {
    setKuthiOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'COMPLETED' } : o))
    );
    setWalletBalance((prev) => prev + (uploadingKuthi?.payoutFee || 400));
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadingKuthi(null);
      setUploadSuccess(false);
      setUploadFile('');
      setUploadNotes('');
    }, 1200);
  };

  const filteredKuthiOrders = useMemo(() => {
    if (kuthiFilter === 'PENDING') return kuthiOrders.filter((o) => o.status !== 'COMPLETED');
    if (kuthiFilter === 'COMPLETED') return kuthiOrders.filter((o) => o.status === 'COMPLETED');
    return kuthiOrders;
  }, [kuthiOrders, kuthiFilter]);

  const pendingKuthiCount = useMemo(() => {
    return kuthiOrders.filter((o) => o.status !== 'COMPLETED').length;
  }, [kuthiOrders]);

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans selection:bg-amber-500/30 selection:text-white flex justify-center items-start transition-colors duration-300 ${
      isDark ? 'dark bg-[#070c1a] text-[#faf8f4]' : 'bg-[#faf8f5] text-[#0f172a]'
    }`}>
      {/* ========================================================================= */}
      {/* MOBILE APP CONTAINER (Fluid touch responsive layout) */}
      {/* ========================================================================= */}
      <div className={`w-full max-w-[440px] min-h-[100dvh] relative border-x shadow-xs flex flex-col pb-28 overflow-x-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0b132b] border-[#3a506b]/40 text-[#faf8f4]' : 'bg-[#faf8f5] border-slate-200 text-slate-900'
      }`}>

        {/* Ambient Cosmic Gold Lighting */}
        {isDark ? (
          <>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[430px] h-[350px] bg-gradient-to-b from-[#d97706]/15 via-amber-500/10 to-transparent blur-[90px] pointer-events-none -z-10" />
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[380px] h-[250px] bg-gradient-to-t from-amber-500/10 via-[#d97706]/5 to-transparent blur-[100px] pointer-events-none -z-10" />
          </>
        ) : (
          <>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[440px] h-[260px] bg-gradient-to-b from-amber-200/20 via-amber-100/10 to-transparent blur-[80px] pointer-events-none -z-10" />
          </>
        )}

        {/* ========================================================================= */}
        {/* 1. APP HEADER WITH THEME TOGGLE (Exact match with desktop theme) */}
        {/* ========================================================================= */}
        <header className={`sticky top-0 z-30 px-4 py-3 backdrop-blur-md border-b flex items-center justify-between transition-colors shadow-xs ${
          isDark ? 'bg-[#1c2541]/95 border-[#3a506b]' : 'bg-white/90 border-slate-200'
        }`}>
          {/* Astrologer Profile Brief */}
          <div className="flex items-center gap-2.5">
            <div 
              onClick={() => setIsOnline(!isOnline)}
              className="relative cursor-pointer group active:scale-95 transition-transform"
              title="Toggle Online status"
            >
              <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#d97706] via-[#fbbf24] to-[#f59e0b] shadow-xs">
                <img
                  src={astroUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80"}
                  alt={astroUser.name || "Astrologer"}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                isDark ? 'border-[#0b132b]' : 'border-white'
              } flex items-center justify-center ${
                isOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-400'
              }`}>
                {isOnline && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
                )}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-xs font-serif font-bold tracking-wide text-slate-900 dark:text-white">{astroUser.name || 'Empaneled Astrologer'}</h1>
                <ShieldCheck className="w-3.5 h-3.5 text-[#d97706] dark:text-[#fbbf24]" />
              </div>
              <div 
                onClick={() => setIsOnline(!isOnline)} 
                className="flex items-center gap-1 cursor-pointer text-[10px] font-medium"
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                <span className={isOnline ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}>
                  {isOnline ? 'Accepting Orders' : 'Away'}
                </span>
              </div>
            </div>
          </div>

          {/* Center Brand */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-serif font-bold text-slate-900 dark:text-amber-100 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
              <span>kuthiyengpham</span>
            </span>
            <span className="text-[9px] text-[#d97706] dark:text-[#fbbf24] font-extrabold uppercase tracking-wider">Guru Portal</span>
          </div>

          {/* Right Header Actions: Theme Switcher & Notifications */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                isDark 
                  ? 'bg-[#0b132b] text-[#fbbf24] border-[#3a506b] hover:border-[#fbbf24]' 
                  : 'bg-white text-slate-800 border-amber-300 hover:border-amber-500'
              }`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-[#d97706]" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                  isDark 
                    ? 'bg-[#0b132b] border-[#3a506b] text-slate-300 hover:text-white' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 bg-gradient-to-r from-rose-500 to-[#d97706] text-[8px] font-extrabold text-white rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              <AnimatePresence>
                {notificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 top-10 w-72 rounded-2xl border shadow-xl p-3 z-50 space-y-2 ${
                      isDark ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-[#3a506b]">
                      <span className="text-xs font-serif font-bold flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-[#d97706]" />
                        <span>Notices & Updates</span>
                      </span>
                      <button
                        onClick={() => setNotificationOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2 rounded-xl text-xs space-y-0.5 border transition-colors ${
                            n.unread 
                              ? isDark ? 'bg-[#0b132b]/80 border-amber-500/30' : 'bg-amber-50/70 border-amber-200' 
                              : isDark ? 'bg-[#0b132b]/40 border-transparent' : 'bg-slate-50 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-[11px] truncate">{n.title}</h5>
                            <span className="text-[9px] opacity-60">{n.time}</span>
                          </div>
                          <p className="text-[10px] opacity-75 line-clamp-2 leading-relaxed">{n.desc}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
                        setNotificationOpen(false);
                      }}
                      className={`w-full py-1.5 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                        isDark ? 'bg-[#0b132b] text-slate-300 border-[#3a506b]' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      Mark All as Read
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* ACTIVE LIVE CALL FLOATING RIBBON (When navigating other tabs during a call) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {activeLiveSessionId && activeTab !== 'live' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sticky top-14 z-30 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span className="text-[11px] font-bold">Live Consultation Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('live')}
                  className="px-2.5 py-1 rounded-lg bg-white text-emerald-950 font-extrabold text-[10px] shadow-xs cursor-pointer"
                >
                  Return to Room →
                </button>
                <button
                  onClick={() => setActiveLiveSessionId(null)}
                  className="p-1 rounded-lg text-white/80 hover:text-white"
                  title="End Session"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* INCOMING LIVE CALL ALERT POPUP (Same as Desktop Version!) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {incomingSession && !activeLiveSessionId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4 ${
                isDark ? 'bg-black/80' : 'bg-slate-900/60'
              }`}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`border-2 border-amber-500 rounded-3xl max-w-[380px] w-full p-5 shadow-2xl text-center space-y-4 relative overflow-hidden transition-colors ${
                  isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
                }`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500 animate-pulse" />

                <div className="w-16 h-16 bg-amber-500/20 text-amber-500 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-500/10 animate-bounce">
                  {incomingSession.mode === 'CALL' ? <Phone className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
                </div>

                <div className="space-y-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest block ${
                    isDark ? 'text-amber-400' : 'text-amber-800'
                  }`}>
                    🔔 INCOMING CONSULTATION REQUEST
                  </span>
                  <h3 className={`font-serif font-bold text-xl ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {incomingSession.clientName}
                  </h3>
                  <p className={`text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-600 font-medium'
                  }`}>
                    Requested {incomingSession.durationMinutes || 15} Mins {incomingSession.mode === 'CALL' ? 'Voice Call' : 'Live Chat'} (₹{incomingSession.totalFee || 525} Fee)
                  </p>
                </div>

                <div className={`p-3 rounded-2xl border text-xs text-left space-y-1 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-amber-50/70 border-amber-200'
                }`}>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-bold'}>Client Mobile:</span>
                    <span className={`font-mono font-bold ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>{incomingSession.clientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-bold'}>Gender / DOB:</span>
                    <span className={isDark ? 'text-slate-200' : 'text-slate-800 font-medium'}>{incomingSession.clientGender || 'Client'} · {incomingSession.clientDob || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={async () => {
                      try {
                        await fetch('/api/consultations', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'REJECT_SESSION', sessionId: incomingSession.id }),
                        });
                      } catch {}
                      setIncomingSession(null);
                    }}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-red-400 border-slate-700'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                    }`}
                  >
                    Decline Request
                  </button>

                  <button
                    onClick={() => handleAcceptIncomingCall(incomingSession.id)}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Accept & Join Now</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* MAIN BODY VIEW CONTENT */}
        {/* ========================================================================= */}
        <main className="flex-1 px-4 pt-4 space-y-5">

          {/* ------------------------------------------------------------- */}
          {/* TAB 1: OVERVIEW */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              {/* ------------------------------------------------------------- */}
              {/* SPONSORED / AD BANNER SLOT (16:5 Standard Height)            */}
              {/* ------------------------------------------------------------- */}
              {config.showAdBanner && (
                <section className="mb-2">
                  <div className={`p-2.5 rounded-2xl border transition-all shadow-xs relative overflow-hidden ${
                    isDark
                      ? 'bg-gradient-to-r from-amber-950/40 via-[#1c2541] to-[#1c2541] border-amber-500/40'
                      : 'bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 border-amber-300 shadow-amber-500/5'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={config.adBannerUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop'}
                        alt="Sponsored"
                        className="w-14 h-14 rounded-xl object-cover border border-amber-500/30 shrink-0"
                      />
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="px-1.5 py-0.2 rounded text-[7.5px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                            {config.adTag || 'SPONSORED'}
                          </span>
                        </div>
                        <h4 className="text-[11.5px] font-bold leading-tight truncate text-slate-900 dark:text-white">
                          {config.adTitle || 'Ceylon Unheated Yellow Sapphires (Pukhraj)'}
                        </h4>
                        <p className="text-[9.5px] text-slate-500 dark:text-gray-300 truncate mt-0.5">
                          {config.adSubtitle || 'Lab Certified 100% Natural • Special Astrologer Partner Discount'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />
                    </div>
                  </div>
                </section>
              )}

              {/* ADMIN ANNOUNCEMENTS, PROMO ADS & URGENT NOTICES (Exact Match to Desktop) */}
              {announcements.filter((a) => !dismissedAnnouncements.includes(a.id)).length > 0 && (
                <section className="space-y-2.5">
                  {announcements
                    .filter((a) => !dismissedAnnouncements.includes(a.id))
                    .map((ann) => (
                      <div
                        key={ann.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border shadow-sm relative overflow-hidden flex flex-col gap-3 transition-all ${
                          isDark
                            ? ann.type === 'PROMO_AD'
                              ? 'bg-gradient-to-br from-purple-950/90 via-[#1c2541] to-[#0b132b] border-purple-500/50 text-white'
                              : ann.type === 'URGENT_NOTICE'
                              ? 'bg-gradient-to-br from-amber-950/90 via-[#1c2541] to-[#0b132b] border-amber-500/50 text-white'
                              : 'bg-gradient-to-br from-blue-950/90 via-[#1c2541] to-[#0b132b] border-blue-500/50 text-white'
                            : ann.type === 'PROMO_AD'
                            ? 'bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border-purple-300 text-slate-900 shadow-xs'
                            : ann.type === 'URGENT_NOTICE'
                            ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-amber-300 text-slate-900 shadow-xs'
                            : 'bg-gradient-to-br from-sky-50 via-white to-sky-50/50 border-sky-300 text-slate-900 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {ann.imageUrl ? (
                            <img
                              src={ann.imageUrl}
                              alt={ann.title}
                              className="w-11 h-11 object-cover rounded-xl border border-slate-200 dark:border-white/20 shrink-0"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                              isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200'
                            }`}>
                              <Bell className={`w-5 h-5 ${
                                ann.type === 'PROMO_AD' ? 'text-purple-500' : ann.type === 'URGENT_NOTICE' ? 'text-amber-500' : 'text-sky-500'
                              }`} />
                            </div>
                          )}

                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className={`px-2 py-0.2 rounded-full text-[8.5px] font-black uppercase border ${
                                ann.type === 'PROMO_AD' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30' :
                                ann.type === 'URGENT_NOTICE' ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30' :
                                'bg-sky-500/20 text-sky-800 dark:text-sky-300 border-sky-500/30'
                              }`}>
                                {ann.type.replace('_', ' ')}
                              </span>
                              <span className={`text-[9.5px] font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                                Audience: {ann.targetAudience}
                              </span>
                            </div>
                            <h4 className={`font-serif font-bold text-xs sm:text-sm leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {ann.title}
                            </h4>
                            <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-700 font-medium'}`}>
                              {ann.message}
                            </p>
                          </div>

                          {/* Dismiss X Button on top-right */}
                          <button
                            onClick={() => setDismissedAnnouncements((prev) => [...prev, ann.id])}
                            className={`absolute top-3 right-3 p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                              isDark
                                ? 'bg-[#0b132b]/80 hover:bg-[#0b132b] text-gray-400 hover:text-white border-[#3a506b]'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
                            }`}
                            title="Dismiss announcement"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Action Link Button */}
                        {ann.actionText && (
                          <div className="pt-1 flex justify-end">
                            <a
                              href={ann.actionUrl || '#'}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-[11px] shadow-xs hover:opacity-95 transition-opacity font-sans flex items-center gap-1"
                            >
                              <span>{ann.actionText}</span>
                              <span>→</span>
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                </section>
              )}

              {/* Daily Panchanga Ribbon */}
              <section className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${
                    isDark ? 'text-[#e0a96d]' : 'text-amber-800'
                  }`}>
                    <Orbit className="w-3 h-3 text-[#d97706] dark:text-[#fbbf24]" />
                    <span>Daily Panchanga & Transit (পঞ্জিকা)</span>
                  </span>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-amber-200/80' : 'text-slate-500'}`}>
                    {config.stationCity || 'Imphal · 24.8°N'}
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 snap-x">
                  {SAMPLE_PANCHANG.map((item) => (
                    <div
                      key={item.id}
                      className={`snap-start shrink-0 px-3.5 py-2.5 rounded-2xl border flex items-center gap-2.5 transition-all shadow-sm ${
                        item.highlight
                          ? isDark 
                            ? 'bg-gradient-to-br from-[#d97706]/20 via-[#1c2541] to-[#1c2541] border-amber-500/50 text-amber-200'
                            : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-400 text-amber-900'
                          : isDark
                            ? 'bg-[#1c2541]/80 border-[#3a506b]/60 text-slate-200'
                            : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                          isDark ? 'text-amber-200/70' : 'text-amber-700'
                        }`}>
                          {item.label}
                        </span>
                        <span className={`text-xs font-extrabold block leading-tight ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {item.label === 'Tithi' && config.tithiText ? config.tithiText : item.label === 'Nakshatra' && config.nakshatraText ? config.nakshatraText : item.label === 'Rahu Kaal' && config.rahuKaalText ? config.rahuKaalText : item.value}
                        </span>
                        {item.sub && (
                          <span className={`text-[9px] font-mono block ${
                            isDark ? 'text-[#fbbf24]' : 'text-amber-600'
                          }`}>
                            {item.sub}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* TWO SEPARATE PORTALS: KUTHI HUB VS LIVE CALL (No Confusion!) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Box 1: Kuthi Order Hub Card */}
                <div
                  onClick={() => setActiveTab('kuthi')}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all shadow-sm active:scale-95 group ${
                    isDark ? 'bg-[#1c2541]/90 border-[#3a506b] hover:border-amber-400' : 'bg-white border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-[#d97706] dark:text-[#fbbf24] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      {pendingKuthiCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold">
                          {pendingKuthiCount} Pending
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-serif font-bold text-slate-900 dark:text-white">Kuthi Order Hub</h3>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                      Client birth documents, Kuthi matching, & report delivery (No Live Call)
                    </p>
                  </div>
                  <div className="pt-2 flex items-center text-[10px] font-bold text-[#b45309] dark:text-[#fbbf24]">
                    <span>Manage Orders →</span>
                  </div>
                </div>

                {/* Box 2: Live Consultation Call Room Card */}
                <div
                  onClick={() => setActiveTab('live')}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all shadow-sm active:scale-95 group ${
                    isDark ? 'bg-[#1c2541]/90 border-[#3a506b] hover:border-emerald-400' : 'bg-white border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Video className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold animate-pulse">
                        LIVE
                      </span>
                    </div>
                    <h3 className="text-xs font-serif font-bold text-slate-900 dark:text-white">Live Call & Chat</h3>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                      1-on-1 real-time voice, video, & encrypted live chat room
                    </p>
                  </div>
                  <div className="pt-2 flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Enter Live Room →</span>
                  </div>
                </div>
              </div>

              {/* Quick Astrological Engines */}
              <section className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${
                    isDark ? 'text-[#e0a96d]' : 'text-amber-800'
                  }`}>
                    <Sparkles className="w-3 h-3 text-[#d97706] dark:text-[#fbbf24]" />
                    <span>Quick Astrological Engines</span>
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-200/70 font-mono">Vedic Math</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {config.enabledEngines?.sadesati !== false && (
                    <button
                      onClick={() => { setActiveToolModal('sadesati'); setMobileToolResult(null); }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-xs ${
                        isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600/30 to-blue-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 text-base">
                        🪐
                      </div>
                      <span className="text-[9px] font-bold text-center leading-tight">
                        Sade Sati
                      </span>
                    </button>
                  )}

                  {config.enabledEngines?.manglik !== false && (
                    <button
                      onClick={() => { setActiveToolModal('manglik'); setMobileToolResult(null); }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-xs ${
                        isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600/30 to-orange-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-base">
                        🔥
                      </div>
                      <span className="text-[9px] font-bold text-center leading-tight">
                        Manglik
                      </span>
                    </button>
                  )}

                  {config.enabledEngines?.kaalsarp !== false && (
                    <button
                      onClick={() => { setActiveToolModal('kaalsarp'); setMobileToolResult(null); }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-xs ${
                        isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600/30 to-violet-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 text-base">
                        🐍
                      </div>
                      <span className="text-[9px] font-bold text-center leading-tight">
                        Kaal Sarp
                      </span>
                    </button>
                  )}

                  {config.enabledEngines?.ngaaeeshing !== false && (
                    <button
                      onClick={() => { setActiveToolModal('nga-eeshing'); setMobileNgaEeshingResult(null); }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-xs ${
                        isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-base">
                        🐟
                      </div>
                      <span className="text-[9px] font-bold text-center leading-tight">
                        ঙা-ঈশিং
                      </span>
                    </button>
                  )}

                  {config.enabledEngines?.matchmaking !== false && (
                    <button
                      onClick={() => { setActiveToolModal('matchmaking'); setMobileToolResult(null); }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-xs ${
                        isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600/30 to-rose-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 text-base">
                        💍
                      </div>
                      <span className="text-[9px] font-bold text-center leading-tight">
                        Matching
                      </span>
                    </button>
                  )}

                  {config.enabledEngines?.yogas !== false && (
                    <button
                      onClick={() => { setActiveToolModal('yogas'); setMobileToolResult(null); }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-xs ${
                        isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600/30 to-yellow-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-base">
                        ✨
                      </div>
                      <span className="text-[9px] font-bold text-center leading-tight">
                        Yogas
                      </span>
                    </button>
                  )}

                  {config.enabledEngines?.yumsharol !== false && (
                    <button
                      onClick={() => { setActiveToolModal('yumsharol'); setMobileYumResult(null); setMobileYumErr(''); }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-xs ${
                        isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 dark:text-emerald-400 text-base">
                        🏡
                      </div>
                      <span className="text-[9px] font-bold text-center leading-tight text-emerald-600 dark:text-emerald-400">
                        Yumsharol
                      </span>
                    </button>
                  )}

                  {config.enabledEngines?.kundali !== false && (
                    <button
                      onClick={() => setActiveToolModal('kundali')}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-xs ${
                        isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600/30 to-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[#d97706] dark:text-[#fbbf24]">
                        <Compass className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-center leading-tight">
                        Kundli
                      </span>
                    </button>
                  )}
                </div>
              </section>

              {/* Quick Summary Cards (Matching Desktop Version) */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">Kuthi Orders</span>
                  <strong className="text-base font-serif font-bold text-[#b45309] dark:text-[#fbbf24]">{kuthiOrders.length}</strong>
                </div>
                <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">Live Call Queue</span>
                  <strong className="text-base font-serif font-bold text-emerald-600 dark:text-emerald-400">{liveAppointments.length}</strong>
                </div>
                <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">Wallet Payout</span>
                  <strong className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{walletBalance.toLocaleString()}</strong>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 2: KUTHI ORDER HUB (Strictly No Video/Voice Calls!) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'kuthi' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-serif font-bold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#d97706]" />
                    <span>Kuthi Order Hub (কূথী অর্ডার্স)</span>
                  </h2>
                  <p className={`text-[10px] ${isDark ? 'text-amber-200/70' : 'text-slate-500'}`}>
                    Assigned written readings, paper Kuthi documents, & report upload
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[#b45309] dark:text-[#fbbf24] border border-amber-500/30 text-[9px] font-extrabold">
                  {pendingKuthiCount} Pending
                </span>
              </div>

              {/* Status Filter Tabs */}
              <div className={`p-1 rounded-2xl border flex items-center justify-between text-[11px] font-bold ${
                isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-slate-100 border-slate-200'
              }`}>
                {(['ALL', 'PENDING', 'COMPLETED'] as KuthiFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setKuthiFilter(f)}
                    className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer text-center ${
                      kuthiFilter === f
                        ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {f === 'ALL' ? 'All Orders' : f === 'PENDING' ? 'Pending' : 'Completed'}
                  </button>
                ))}
              </div>

              {/* Kuthi Orders List */}
              <div className="space-y-3">
                {filteredKuthiOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-4 rounded-2xl border space-y-3 shadow-sm transition-all ${
                      isDark ? 'bg-[#1c2541]/85 border-[#3a506b]' : 'bg-white border-slate-200'
                    }`}
                  >
                    {/* Header with Order Ref & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#b45309] dark:text-[#fbbf24]">
                            {order.id}
                          </span>
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold border ${
                            order.status === 'COMPLETED'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-serif font-bold mt-0.5">
                          {order.clientName}
                        </h3>
                        <p className={`text-[10px] ${isDark ? 'text-amber-200/70' : 'text-slate-500'}`}>
                          {order.serviceType}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-emerald-500 font-extrabold block">
                          +₹{order.payoutFee} Fee
                        </span>
                        <span className="text-[9px] font-mono opacity-60">
                          {order.date}
                        </span>
                      </div>
                    </div>

                    {/* Birth Details & Paper Kuthi Info */}
                    <div className={`p-2.5 rounded-xl border text-[10px] space-y-1.5 ${
                      isDark ? 'bg-[#0b132b]/80 border-[#3a506b]/50' : 'bg-slate-50 border-slate-200'
                    }`}>
                      {/* Religious Tradition Highlight Badge */}
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-[#3a506b]/40">
                        <span className="font-bold text-slate-500 dark:text-slate-400">Faith Tradition:</span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[9.5px] border ${
                          order.clientDetails.faithTradition === 'Sanamahi Laining'
                            ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-500/40'
                            : 'bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-500/40'
                        }`}>
                          {order.clientDetails.faithTradition === 'Sanamahi Laining' ? '☀️ Sanamahi Laining' : '🕉️ Hinduism'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">জন্ম তারিখ / সময়:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{order.clientDetails.dob} · {order.clientDetails.tob}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">জন্মস্থান (POB):</span>
                        <span className="font-medium truncate max-w-[190px] text-slate-800 dark:text-slate-200">{order.clientDetails.pob}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">
                          {order.clientDetails.faithTradition === 'Sanamahi Laining' ? 'Yek Salai:' : 'Gotra:'}
                        </span>
                        <span className="font-bold text-[#b45309] dark:text-[#fbbf24]">
                          {order.clientDetails.faithTradition === 'Sanamahi Laining' 
                            ? (order.clientDetails.yek || order.clientDetails.gotra || 'Khuman')
                            : (order.clientDetails.gotra || 'Sandilya')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Customer Kuthi Paper:</span>
                        <span className="text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1">
                          <Paperclip className="w-3 h-3 text-[#d97706]" />
                          <span className="truncate max-w-[150px]">
                            {order.clientDetails.uploadedFiles && order.clientDetails.uploadedFiles.length > 1
                              ? `${order.clientDetails.uploadedFiles.length} Uploaded Files`
                              : (order.clientDetails.kuthiFileName || 'Attached Paper')}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* PROMINENT DOWNLOAD BOX DIRECTLY ON CARD */}
                    <div className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 shadow-xs ${
                      isDark ? 'bg-gradient-to-r from-amber-950/40 to-orange-950/30 border-amber-500/40' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
                    }`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-black text-[#b45309] dark:text-[#fbbf24] block leading-none">
                            Kundli / Kuthi Files
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                            {(order.clientDetails.uploadedFiles && order.clientDetails.uploadedFiles.length > 0)
                              ? `${order.clientDetails.uploadedFiles.length} Uploaded Documents`
                              : (order.clientDetails.kuthiFileName || 'Customer Scan Attached')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const files = (order.clientDetails.uploadedFiles && order.clientDetails.uploadedFiles.length > 0)
                            ? order.clientDetails.uploadedFiles
                            : [order.clientDetails.kuthiFileName || 'customer_kuthi_scan.pdf'];
                          const fileUrl = order.clientDetails.kuthiFileUrl || '/sample_kuthi.pdf';
                          files.forEach((name, idx) => {
                            setTimeout(() => {
                              const a = document.createElement('a');
                              a.href = fileUrl;
                              a.download = name;
                              a.target = '_blank';
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }, idx * 350);
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download All</span>
                      </button>
                    </div>

                    {/* Question Excerpt */}
                    {order.clientDetails.question && (
                      <p className={`text-[11px] p-2 rounded-xl border line-clamp-2 ${
                        isDark ? 'bg-amber-950/20 border-amber-500/20 text-amber-100' : 'bg-amber-50/60 border-amber-200 text-amber-950'
                      }`}>
                        <span className="font-bold block text-[9px] uppercase tracking-wider text-[#b45309] dark:text-[#fbbf24]">Client Query:</span>
                        {order.clientDetails.question}
                      </p>
                    )}

                    {/* ACTIONS: Strictly Kuthi Analysis & Upload (NO Voice/Video Call!) */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => setInspectingKuthi(order)}
                          className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                            isDark ? 'bg-[#0b132b] border-[#3a506b] hover:bg-[#1e293b]' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          <Eye className="w-3 h-3 text-sky-500" />
                          <span>Inspect</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedChartOrder(order);
                            setActiveTab('charts');
                          }}
                          className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                            isDark ? 'bg-[#0b132b] border-[#3a506b] text-[#fbbf24]' : 'bg-amber-50 border-amber-300 text-amber-900'
                          }`}
                        >
                          <Compass className="w-3 h-3" />
                          <span>Bengali Chart</span>
                        </button>

                        <button
                          onClick={() => {
                            const files = (order.clientDetails.uploadedFiles && order.clientDetails.uploadedFiles.length > 0)
                              ? order.clientDetails.uploadedFiles
                              : [order.clientDetails.kuthiFileName || 'customer_kuthi_scan.pdf'];
                            const fileUrl = order.clientDetails.kuthiFileUrl || '/sample_kuthi.pdf';
                            files.forEach((name, idx) => {
                              setTimeout(() => {
                                const a = document.createElement('a');
                                a.href = fileUrl;
                                a.download = name;
                                a.target = '_blank';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                              }, idx * 350);
                            });
                          }}
                          className={`px-2 py-1.5 rounded-xl border text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-transform active:scale-95 ${
                            isDark ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
                          }`}
                        >
                          <Download className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Download Kuthi</span>
                        </button>
                      </div>

                      {order.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => setUploadingKuthi(order)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-[10px] flex items-center gap-1 shadow-sm hover:opacity-95 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Report</span>
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 3: LIVE CONSULTATION ROOM (Real-Time Audio / Video / Chat ONLY) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'live' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Workspace Header Matching Desktop */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
              }`}>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-amber-500 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>Astrologer In-App Consultation Workspace</span>
                  </h3>
                  <p className={`text-[10.5px] sm:text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Conduct live 1-on-1 chats and voice/video consultations directly inside kuthiyengpham.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-[9px] font-extrabold shrink-0">
                  Live Engine
                </span>
              </div>

              {activeLiveSessionId ? (
                /* LIVE SESSION ACTIVE IN-APP ROOM */
                <div className="space-y-3">
                  <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <div>
                        <span className="text-xs font-bold block">1-on-1 Live Room Connected</span>
                        <span className="text-[10px] opacity-75 font-mono">Session Ref: {activeLiveSessionId}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveLiveSessionId(null)}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                    >
                      Leave Room
                    </button>
                  </div>

                  <div className="h-[72vh] w-full rounded-2xl overflow-hidden border border-emerald-500/30 relative shadow-lg">
                    <LiveConsultationRoom
                      sessionId={activeLiveSessionId}
                      currentUserType="ASTROLOGER"
                      onClose={() => setActiveLiveSessionId(null)}
                    />
                  </div>
                </div>
              ) : (
                /* NO ACTIVE SESSION / WAITING WORKSPACE */
                <div className="space-y-4">
                  <div className={`text-center p-6 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>No Active Live Session</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      When a client initiates a live consultation, an incoming call popup will alert you here automatically.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => handleStartLiveCall('Client Consultation Room', 'VIDEO')}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Launch Standby Room</span>
                      </button>

                      <button
                        onClick={handleSimulateIncomingCall}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <PhoneIncoming className="w-3.5 h-3.5 animate-bounce" />
                        <span>Simulate Incoming Ringing</span>
                      </button>
                    </div>
                  </div>

                  {/* Scheduled Live Calls & Consultations Feed */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest block ${
                        isDark ? 'text-[#e0a96d]' : 'text-amber-800'
                      }`}>
                        Consultation Queue ({dbConsultations.length > 0 ? dbConsultations.length : liveAppointments.length})
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Admin Dispatch Required
                      </span>
                    </div>

                    {/* Render Real Consultation Sessions from DB first, or mock list */}
                    {(dbConsultations.length > 0 ? dbConsultations : liveAppointments).map((item: any) => {
                      const isDb = !!item.orderRef || !!item.clientPhone;
                      const sessionId = item.id;
                      const orderRef = item.orderRef || item.id;
                      const clientName = item.clientName;
                      const status = item.status || 'WAITING';
                      const isCompleted = status === 'COMPLETED';
                      const meetingLinkSent = !!item.meetingLinkSent;
                      const durationMins = item.durationMinutes || 15;
                      const fee = item.totalFee || item.fee || 525;
                      const netPayout = item.astrologerNetPayout || Math.round(fee * 0.85);
                      const modeLabel = item.mode === 'CHAT' ? 'Live Chat' : item.mode === 'CALL' ? `${item.callType || 'Video'} Call` : (item.mode || 'Consultation');
                      const phone = item.clientPhone || item.phone || '+91 98620 11223';
                      const scheduledTime = item.endedAt
                        ? `Ended ${new Date(item.endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : item.scheduledDate || item.scheduledTime || 'Today';

                      return (
                        <div
                          key={sessionId}
                          className={`p-4 rounded-2xl border space-y-3 shadow-xs transition-all ${
                            isDark
                              ? isCompleted
                                ? 'bg-[#151d32]/90 border-slate-700/60'
                                : 'bg-[#1c2541]/85 border-[#3a506b]'
                              : isCompleted
                              ? 'bg-slate-50/80 border-slate-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                                isCompleted
                                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500'
                                  : meetingLinkSent
                                  ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-500'
                                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-500'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : item.mode === 'CHAT' ? (
                                  <MessageSquare className="w-5 h-5" />
                                ) : (
                                  <Phone className="w-5 h-5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h3 className="text-xs font-serif font-bold truncate">{clientName}</h3>
                                  <span className={`px-2 py-0.2 rounded-full text-[8px] font-extrabold tracking-wide shrink-0 ${
                                    isCompleted
                                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                                      : meetingLinkSent
                                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                                  }`}>
                                    {isCompleted ? 'COMPLETED' : meetingLinkSent ? 'LINK DISPATCHED' : 'PENDING ADMIN LINK'}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono truncate">
                                  Ref: {orderRef} · {modeLabel}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[10px] font-mono text-emerald-500 font-bold block">
                                ₹{netPayout} {isCompleted ? 'Credited' : 'Net'}
                              </span>
                              <span className="text-[9px] font-mono opacity-60">
                                {durationMins} Mins
                              </span>
                            </div>
                          </div>

                          {/* DETAILS SECTION */}
                          {isCompleted ? (
                            /* COMPLETED SESSION: Order and Session details ONLY. Client phone redacted & chat closed */
                            <div className={`p-2.5 rounded-xl border text-[10.5px] space-y-1.5 ${
                              isDark ? 'bg-[#0b132b] border-[#3a506b]/40 text-slate-300' : 'bg-slate-100/70 border-slate-200 text-slate-700'
                            }`}>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Service Mode:</span>
                                <span className="font-semibold">{modeLabel}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Completed Date:</span>
                                <span className="font-mono">{scheduledTime}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Client Details:</span>
                                <span className="font-mono text-slate-400 italic">[Redacted for privacy]</span>
                              </div>
                            </div>
                          ) : (
                            /* ACTIVE / WAITING SESSION */
                            <div className={`p-2 rounded-xl border text-[10px] flex items-center justify-between ${
                              isDark ? 'bg-[#0b132b]/60 border-[#3a506b]/30 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}>
                              <span className="text-slate-500 font-medium">In-App Live Session</span>
                              <span className="font-medium text-amber-500">{scheduledTime}</span>
                            </div>
                          )}

                          {/* ACTION FOOTER */}
                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 dark:border-[#3a506b]/40">
                            {isCompleted ? (
                              <>
                                <span className="text-emerald-500 font-bold flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Session Settled
                                </span>
                                <div className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed border border-slate-300 dark:border-slate-700">
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Chat Room Closed</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="flex items-center gap-1">
                                  {meetingLinkSent ? (
                                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                      Live Link Ready
                                    </span>
                                  ) : (
                                    <span className="text-amber-500 font-medium flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                                      Awaiting Admin Dispatch
                                    </span>
                                  )}
                                </span>

                                {/* Button ONLY active when meetingLinkSent === true */}
                                {meetingLinkSent ? (
                                  <button
                                    onClick={() => setActiveLiveSessionId(sessionId)}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                                  >
                                    <PhoneCall className="w-3.5 h-3.5" />
                                    <span>Join Live Consultation</span>
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-bold text-[10.5px] flex items-center gap-1.5 cursor-not-allowed opacity-80"
                                    title="Meeting link will unlock once Admin dispatches it"
                                  >
                                    <Lock className="w-3 h-3" />
                                    <span>Link Pending Admin</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 4: BENGALI BIRTH CHART */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'charts' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4"
            >
              {/* Header with Native Switcher & D1/D9 Toggle */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-serif font-bold flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#d97706] dark:text-[#fbbf24]" />
                      <span>{selectedChartOrder.clientName}&apos;s Bengali Chart</span>
                    </h2>
                    <p className={`text-[10px] ${isDark ? 'text-amber-200/70' : 'text-slate-500'}`}>
                      {selectedChartOrder.clientDetails.dob} · {selectedChartOrder.clientDetails.tob} · {selectedChartOrder.clientDetails.pob.split(',')[0]}
                    </p>
                  </div>

                  {/* D1 / D9 Switcher */}
                  <div className={`p-1 rounded-xl border flex items-center gap-1 ${
                    isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <button
                      onClick={() => setSelectedChartType('D1')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        selectedChartType === 'D1'
                          ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-xs'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      D1 Rashi
                    </button>
                    <button
                      onClick={() => setSelectedChartType('D9')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        selectedChartType === 'D9'
                          ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-xs'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      D9 Navamsha
                    </button>
                  </div>
                </div>

                {/* Client Switcher Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {kuthiOrders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setSelectedChartOrder(o)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                        selectedChartOrder.id === o.id
                          ? 'bg-amber-500 text-slate-950 font-extrabold border-amber-400 shadow-xs'
                          : isDark 
                            ? 'bg-[#1c2541] border-[#3a506b] text-slate-300 hover:text-white' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {o.clientName}
                    </button>
                  ))}
                </div>

                {/* Direct Download Customer Uploaded Kuthi Files Banner in Chart Tab */}
                <div className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 ${
                  isDark ? 'bg-amber-950/30 border-amber-500/30' : 'bg-amber-50 border-amber-300'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                      Original Kundli / Kuthi Files ({selectedChartOrder.clientDetails.uploadedFiles?.length || 1})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const files = (selectedChartOrder.clientDetails.uploadedFiles && selectedChartOrder.clientDetails.uploadedFiles.length > 0)
                        ? selectedChartOrder.clientDetails.uploadedFiles
                        : [selectedChartOrder.clientDetails.kuthiFileName || 'customer_kuthi_scan.pdf'];
                      const fileUrl = selectedChartOrder.clientDetails.kuthiFileUrl || '/sample_kuthi.pdf';
                      files.forEach((name, idx) => {
                        setTimeout(() => {
                          const a = document.createElement('a');
                          a.href = fileUrl;
                          a.download = name;
                          a.target = '_blank';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }, idx * 350);
                      });
                    }}
                    className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-[10px] flex items-center gap-1 shadow shrink-0 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download All</span>
                  </button>
                </div>
              </div>

              {/* AUTHENTIC BENGALI CHART RENDER */}
              <div className={`p-3 rounded-3xl border shadow-lg flex flex-col items-center justify-center transition-colors ${
                isDark ? 'bg-[#1c2541]/90 border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div className="w-full flex items-center justify-between border-b pb-2 mb-3 border-slate-200 dark:border-[#3a506b]/50">
                  <span className="text-xs font-serif font-bold text-[#b45309] dark:text-[#fbbf24]">
                    {selectedChartType === 'D1' ? 'রাশি চক্র (D1 Rashi Chart - Lagna)' : 'নবাংশ চক্র (D9 Navamsha Chart)'}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300">
                    Traditional Bengali Grid
                  </span>
                </div>

                {/* Bengali Chart SVG */}
                <div className="w-full flex justify-center">
                  <BengaliChart
                    planets={selectedChartType === 'D1' ? selectedChartOrder.d1Planets : selectedChartOrder.d9Planets}
                    ascendantSign={selectedChartType === 'D1' ? selectedChartOrder.lagnaIndex : selectedChartOrder.navLagnaIndex}
                    title={selectedChartType === 'D1' ? `${selectedChartOrder.clientName} (D1)` : `${selectedChartOrder.clientName} (D9)`}
                    theme={theme}
                  />
                </div>

                <div className="w-full grid grid-cols-2 gap-2 mt-3 text-[10px]">
                  <div className={`p-2 rounded-xl border ${
                    isDark ? 'bg-[#0b132b]/80 border-[#3a506b]/50' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="opacity-70 block">জন্ম লগ্ন (Ascendant):</span>
                    <span className="text-xs font-serif font-bold text-[#b45309] dark:text-[#fbbf24]">
                      {selectedChartOrder.clientDetails.lagna || 'বৃশ্চিক (Scorpio)'}
                    </span>
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    isDark ? 'bg-[#0b132b]/80 border-[#3a506b]/50' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="opacity-70 block">জন্ম রাশি (Moon Sign):</span>
                    <span className="text-xs font-serif font-bold text-[#b45309] dark:text-[#fbbf24]">
                      {selectedChartOrder.clientDetails.moonSign || 'বৃষ (Taurus)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kuthi Order Reference Link */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-amber-50 border-amber-300'
              }`}>
                <div>
                  <span className="text-[10px] opacity-70 block">Order Ref: {selectedChartOrder.id}</span>
                  <span className="font-bold">{selectedChartOrder.serviceType}</span>
                </div>
                <button
                  onClick={() => {
                    setUploadingKuthi(selectedChartOrder);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-[11px] shadow-xs cursor-pointer"
                >
                  Upload Kuthi Report
                </button>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 5: PROFILE & WALLET */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Profile Card */}
              <div className={`p-4 rounded-3xl border text-center space-y-3 relative overflow-hidden shadow-sm ${
                isDark ? 'bg-[#1c2541]/90 border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div className="w-16 h-16 rounded-full mx-auto p-1 bg-gradient-to-tr from-[#d97706] via-[#fbbf24] to-[#f59e0b] shadow-md">
                  <img
                    src={astroUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80"}
                    alt={astroUser.name || "Astrologer"}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-serif font-bold flex items-center justify-center gap-1.5">
                    <span>{astroUser.name || 'Empaneled Astrologer'}</span>
                    <ShieldCheck className="w-4 h-4 text-[#d97706] dark:text-[#fbbf24]" />
                  </h2>
                  <p className="text-[11px] font-semibold text-[#b45309] dark:text-[#fbbf24]">{astroUser.specialty || 'Master Vedic Astrologer & Kuthi Specialist'}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">15+ Years Experience · 50k+ Kuthi Consultations</p>
                </div>

                <div className={`grid grid-cols-3 gap-2 pt-2 border-t text-center text-xs ${
                  isDark ? 'border-[#3a506b]/50' : 'border-slate-200'
                }`}>
                  <div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block">Rating</span>
                    <span className="font-extrabold text-[#d97706] dark:text-[#fbbf24] flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" /> 5.0
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block">Live Call</span>
                    <span className="font-extrabold font-mono text-slate-800 dark:text-slate-200">₹35/min</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block">Kuthi Yengba</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-300 font-mono">₹499</span>
                  </div>
                </div>
              </div>

              {/* Wallet Card */}
              <div className={`p-4 rounded-3xl border space-y-3 shadow-md ${
                isDark 
                  ? 'bg-gradient-to-br from-[#1c2541] via-[#0b132b] to-[#1e293b] border-amber-500/30' 
                  : 'bg-gradient-to-br from-amber-50 via-white to-amber-100 border-amber-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold flex items-center gap-1.5 text-[#b45309] dark:text-amber-100">
                    <Wallet className="w-4 h-4 text-[#d97706] dark:text-[#fbbf24]" />
                    <span>Astrologer Wallet Balance</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live Verified
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-[#b45309] dark:text-[#fbbf24] font-mono">₹{walletBalance.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">80% Share Earned</span>
                </div>

                <button
                  onClick={() => alert(`Payout request for ₹${walletBalance} submitted to admin via UPI!`)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
                >
                  Withdraw to UPI / Bank
                </button>
              </div>

              {/* Availability Switch */}
              <div className={`rounded-2xl border p-3 space-y-3 ${
                isDark ? 'bg-[#1c2541]/80 border-[#3a506b]' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">Consultation Availability</span>
                    <span className="text-[10px] opacity-70">Toggle availability for client bookings</span>
                  </div>
                  <button
                    onClick={() => setIsOnline(!isOnline)}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center cursor-pointer ${
                      isOnline ? 'bg-emerald-500 justify-end' : 'bg-slate-400 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md block" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </main>

        {/* ========================================================================= */}
        {/* 4. DETACHED FLOATING BOTTOM DOCK (5 Clearly Distinct App Tabs) */}
        {/* ========================================================================= */}
        <div className="fixed bottom-3 left-0 right-0 z-40 max-w-[420px] mx-auto px-3 pointer-events-none">
          <nav className={`pointer-events-auto rounded-full backdrop-blur-md border p-1.5 flex items-center justify-around transition-colors ${
            isDark 
              ? 'bg-[#0b132b]/95 border-[#3a506b] shadow-[0_12px_40px_rgba(0,0,0,0.6)]' 
              : 'bg-white/95 border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
          }`}>
            {/* Dock 1: Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-1.5 rounded-full flex flex-col items-center gap-0.5 transition-all active:scale-90 cursor-pointer ${
                activeTab === 'overview'
                  ? isDark 
                    ? 'text-amber-400 bg-amber-500/15 font-bold shadow-xs border border-amber-500/30' 
                    : 'text-[#b45309] bg-amber-50 font-extrabold border border-amber-300 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-amber-300' : 'text-slate-600 hover:text-[#b45309]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[8.5px] font-extrabold tracking-tight">Overview</span>
            </button>

            {/* Dock 2: Kuthi Hub (NO Live Call!) */}
            <button
              onClick={() => setActiveTab('kuthi')}
              className={`flex-1 py-1.5 rounded-full flex flex-col items-center gap-0.5 transition-all active:scale-90 relative cursor-pointer ${
                activeTab === 'kuthi'
                  ? isDark 
                    ? 'text-amber-400 bg-amber-500/15 font-bold shadow-xs border border-amber-500/30' 
                    : 'text-[#b45309] bg-amber-50 font-extrabold border border-amber-300 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-amber-300' : 'text-slate-600 hover:text-[#b45309]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-[8.5px] font-extrabold tracking-tight">Kuthi Hub</span>
              {pendingKuthiCount > 0 && (
                <span className="absolute top-1 right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#d97706] text-white text-[8px] font-bold flex items-center justify-center shadow">
                  {pendingKuthiCount}
                </span>
              )}
            </button>

            {/* Dock 3: Live Call & Chat (Audio/Video Consultations ONLY) */}
            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 py-1.5 rounded-full flex flex-col items-center gap-0.5 transition-all active:scale-90 relative cursor-pointer ${
                activeTab === 'live'
                  ? isDark 
                    ? 'text-emerald-400 bg-emerald-500/15 font-bold shadow-xs border border-emerald-500/30' 
                    : 'text-emerald-800 bg-emerald-50 font-extrabold border border-emerald-300 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span className="text-[8.5px] font-extrabold tracking-tight">Live Call</span>
              <span className="absolute top-1.5 right-4 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Dock 4: Bengali Chart */}
            <button
              onClick={() => setActiveTab('charts')}
              className={`flex-1 py-1.5 rounded-full flex flex-col items-center gap-0.5 transition-all active:scale-90 cursor-pointer ${
                activeTab === 'charts'
                  ? isDark 
                    ? 'text-amber-400 bg-amber-500/15 font-bold shadow-xs border border-amber-500/30' 
                    : 'text-[#b45309] bg-amber-50 font-extrabold border border-amber-300 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-amber-300' : 'text-slate-600 hover:text-[#b45309]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="text-[8.5px] font-extrabold tracking-tight">Bengali Chart</span>
            </button>

            {/* Dock 5: Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-1.5 rounded-full flex flex-col items-center gap-0.5 transition-all active:scale-90 cursor-pointer ${
                activeTab === 'profile'
                  ? isDark 
                    ? 'text-amber-400 bg-amber-500/15 font-bold shadow-xs border border-amber-500/30' 
                    : 'text-[#b45309] bg-amber-50 font-extrabold border border-amber-300 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-amber-300' : 'text-slate-600 hover:text-[#b45309]'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[8.5px] font-extrabold tracking-tight">Profile</span>
            </button>
          </nav>
        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: INSPECT KUTHI CLIENT DETAILS (Birth details & paper Kuthi scan) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {inspectingKuthi && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                className={`w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto border ${
                  isDark ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-[#3a506b]">
                  <div>
                    <span className="text-[10px] font-mono text-[#b45309] dark:text-[#fbbf24] font-bold block">
                      {inspectingKuthi.id}
                    </span>
                    <h3 className="text-sm font-serif font-bold">
                      {inspectingKuthi.clientName} · Kuthi Details
                    </h3>
                  </div>
                  <button
                    onClick={() => setInspectingKuthi(null)}
                    className="p-1 rounded-full bg-slate-200/60 dark:bg-[#0b132b]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Paper Kuthi Attachment & Multi-file Download - PROMINENT AT TOP */}
                  {(() => {
                    const files: string[] = (inspectingKuthi.clientDetails.uploadedFiles && inspectingKuthi.clientDetails.uploadedFiles.length > 0)
                      ? inspectingKuthi.clientDetails.uploadedFiles
                      : (inspectingKuthi.clientDetails.kuthiFileName ? [inspectingKuthi.clientDetails.kuthiFileName] : ['customer_kuthi_document.pdf']);
                    const fileUrl = inspectingKuthi.clientDetails.kuthiFileUrl || '/sample_kuthi.pdf';

                    return (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border-2 border-amber-500/40 space-y-3 shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                              <Paperclip className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs uppercase font-black text-[#b45309] dark:text-[#fbbf24] block">
                                Customer Uploaded Kundli / Kuthi
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                {files.length} {files.length === 1 ? 'Document' : 'Documents'} uploaded by client
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              files.forEach((name, idx) => {
                                setTimeout(() => {
                                  const a = document.createElement('a');
                                  a.href = fileUrl;
                                  a.download = name;
                                  a.target = '_blank';
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                }, idx * 350);
                              });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all shrink-0 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download All ({files.length})</span>
                          </button>
                        </div>

                        {/* List of uploaded files */}
                        <div className="space-y-1.5 pt-1">
                          {files.map((fileName, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between p-2.5 rounded-xl border border-amber-500/25 text-xs shadow-2xs ${
                                isDark ? 'bg-[#0b132b]/90 text-white' : 'bg-white/95 text-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden mr-2">
                                <FileText className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                                <div className="truncate">
                                  <span className={`font-mono text-xs font-bold truncate block ${
                                    isDark ? 'text-slate-200' : 'text-slate-900'
                                  }`}>
                                    {fileName}
                                  </span>
                                  <span className={`text-[10px] block ${
                                    isDark ? 'text-slate-400' : 'text-slate-500'
                                  }`}>Part {idx + 1} of {files.length}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = fileUrl;
                                  a.download = fileName;
                                  a.target = '_blank';
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                }}
                                className={`px-3 py-1.5 rounded-lg font-extrabold text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-transform cursor-pointer border ${
                                  isDark
                                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                                }`}
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Birth Specs */}
                  <div className={`p-3.5 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-[#0b132b]/80 border-[#3a506b]/50 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    {/* Religious Tradition Highlight */}
                    <div className={`flex items-center justify-between pb-2 border-b ${
                      isDark ? 'border-[#3a506b]/40' : 'border-slate-200'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>Faith Tradition:</span>
                      <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] border ${
                        inspectingKuthi.clientDetails.faithTradition === 'Sanamahi Laining'
                          ? (isDark ? 'bg-amber-950/60 text-amber-200 border-amber-500/40' : 'bg-amber-100 text-amber-950 border-amber-300')
                          : (isDark ? 'bg-orange-950/60 text-orange-200 border-orange-500/40' : 'bg-orange-100 text-orange-950 border-orange-300')
                      }`}>
                        {inspectingKuthi.clientDetails.faithTradition === 'Sanamahi Laining' ? '☀️ Sanamahi Laining (Indigenous)' : '🕉️ Hinduism (Vedic)'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Client Name:</span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{inspectingKuthi.clientName} ({inspectingKuthi.clientDetails.sex})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Contact Details:</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                        isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-200/80 text-slate-700 border-slate-300'
                      }`}>
                        Protected by Admin
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Date of Birth:</span>
                      <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{inspectingKuthi.clientDetails.dob}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Time of Birth:</span>
                      <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{inspectingKuthi.clientDetails.tob}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Place of Birth:</span>
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{inspectingKuthi.clientDetails.pob}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {inspectingKuthi.clientDetails.faithTradition === 'Sanamahi Laining' ? 'Yek Salai:' : 'Gotra (সালয়):'}
                      </span>
                      <span className={`font-bold ${isDark ? 'text-[#fbbf24]' : 'text-[#b45309]'}`}>
                        {inspectingKuthi.clientDetails.faithTradition === 'Sanamahi Laining'
                          ? (inspectingKuthi.clientDetails.yek || inspectingKuthi.clientDetails.gotra || 'Khuman')
                          : (inspectingKuthi.clientDetails.gotra || 'Sandilya')}
                      </span>
                    </div>
                  </div>

                  {/* Query */}
                  {inspectingKuthi.clientDetails.question && (
                    <div className={`p-3 rounded-2xl border space-y-1 ${
                      isDark ? 'bg-black/30 border-[#3a506b]/40 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold block ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>Client&apos;s Specific Inquiries:</span>
                      <p className="text-[11px] leading-relaxed">{inspectingKuthi.clientDetails.question}</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedChartOrder(inspectingKuthi);
                        setInspectingKuthi(null);
                        setActiveTab('charts');
                      }}
                      className={`py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        isDark ? 'bg-[#0b132b] text-amber-300 border-[#3a506b]' : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>View Bengali Chart</span>
                    </button>

                    <button
                      onClick={() => {
                        setUploadingKuthi(inspectingKuthi);
                        setInspectingKuthi(null);
                      }}
                      className="py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Deliver Report</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* MODAL 2: UPLOAD KUTHI REPORT (Deliver Report & Credit Astrologer Wallet) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {uploadingKuthi && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                className={`w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border ${
                  isDark ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className={`flex items-center justify-between border-b pb-3 ${
                  isDark ? 'border-[#3a506b]' : 'border-slate-200'
                }`}>
                  <div>
                    <span className={`text-[10px] font-mono font-bold block ${
                      isDark ? 'text-[#fbbf24]' : 'text-amber-800'
                    }`}>
                      Deliver Kuthi Consultation
                    </span>
                    <h3 className={`text-sm font-serif font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Upload Report for {uploadingKuthi.clientName}
                    </h3>
                  </div>
                  <button
                    onClick={() => setUploadingKuthi(null)}
                    className={`p-1 rounded-full ${
                      isDark ? 'bg-[#0b132b] text-gray-300' : 'bg-slate-200/60 text-slate-700'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {uploadSuccess ? (
                  <div className={`p-4 rounded-2xl border text-center space-y-2 ${
                    isDark ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}>
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className={`text-sm font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                      Report Delivered Successfully!
                    </h4>
                    <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-slate-700 font-medium'}`}>
                      ₹{uploadingKuthi.payoutFee} credited to your wallet balance.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleDeliverReport(uploadingKuthi.id);
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className={`block text-[10px] font-bold mb-1 ${
                        isDark ? 'text-[#e0a96d]' : 'text-slate-800'
                      }`}>
                        Select PDF / Scanned Kuthi Report File *
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => setUploadFile(e.target.files?.[0]?.name || 'kuthi_report.pdf')}
                        className={`w-full p-2.5 rounded-xl border text-xs cursor-pointer ${
                          isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-[10px] font-bold mb-1 ${
                        isDark ? 'text-[#e0a96d]' : 'text-slate-800'
                      }`}>
                        Astrological Reading Notes & Gemstone / Puja Remedies
                      </label>
                      <textarea
                        rows={3}
                        value={uploadNotes}
                        onChange={(e) => setUploadNotes(e.target.value)}
                        placeholder="Type auspicious remedies, gemstone guidance, or mantra directions for the native..."
                        className={`w-full p-3 rounded-xl border text-xs focus:outline-none ${
                          isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className={`p-2.5 rounded-xl border flex justify-between items-center text-[11px] ${
                      isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                    }`}>
                      <span className={isDark ? 'text-gray-300' : 'text-slate-700 font-medium'}>Payout Upon Delivery:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+₹{uploadingKuthi.payoutFee}</strong>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Confirm & Deliver Report to Client</span>
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* MODAL 3: QUICK TOOLS POPUP */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {activeToolModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 border shadow-2xl space-y-4 ${
                  isDark ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-500/20">
                  <span className={`text-xs font-serif font-bold flex items-center gap-2 ${
                    isDark ? 'text-[#fbbf24]' : 'text-amber-800'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {activeToolModal === 'nga-eeshing' && 'ঙা-ঈশিং (Nga-Eeshing) Matrimony'}
                      {activeToolModal === 'yumsharol' && 'Yumsharol (House Science & Vastu)'}
                      {activeToolModal === 'kundali' && 'Instant Bengali Kundli Generator'}
                      {activeToolModal === 'kuthi-generator' && 'Kuthi Birth Chart Generator'}
                      {activeToolModal === 'dasha' && 'Vimshottari Dasha Calculator'}
                      {activeToolModal === 'dasha-yengpham' && 'Vimshottari Dasha Calculator'}
                      {activeToolModal === 'sadesati' && 'Shani Sade Sati Calculator'}
                      {activeToolModal === 'shani-sade-sati' && 'Shani Sade Sati Calculator'}
                      {activeToolModal === 'manglik' && 'Manglik Dosh & Kuja Bhanga'}
                      {activeToolModal === 'mangalik-dosh' && 'Manglik Dosh & Kuja Bhanga'}
                      {activeToolModal === 'kaalsarp' && 'Kaal Sarp Dosh Calculator'}
                      {activeToolModal === 'kaal-sarp-dosh' && 'Kaal Sarp Dosh Calculator'}
                      {activeToolModal === 'matchmaking' && 'Ashtakoota 36-Gun Milan Matching'}
                      {activeToolModal === 'match-making' && 'Ashtakoota 36-Gun Milan Matching'}
                      {activeToolModal === 'yogas' && 'Planetary Vedic Yogas'}
                      {activeToolModal === 'astrology-yoga' && 'Planetary Vedic Yogas'}
                      {activeToolModal === 'vedic-numerology' && 'Vedic Numerology (Ank Shastra)'}
                      {activeToolModal === 'vedic-workstation' && 'Vedic Workstation'}
                      {activeToolModal === 'bnn-workstation' && 'Bhrigu Nandi Nadi Workstation'}
                      {activeToolModal === 'vastu-workstation' && 'Vastu Workstation'}
                      {activeToolModal === 'transit' && 'Live Ephemeris & Gochar Wheel'}
                    </span>
                  </span>
                  <button
                    onClick={() => {
                      setActiveToolModal(null);
                      setMobileYumResult(null);
                      setMobileToolResult(null);
                      setMobileNgaEeshingResult(null);
                    }}
                    className={`p-1 rounded-full cursor-pointer ${
                      isDark ? 'bg-[#0b132b] text-gray-300' : 'bg-slate-200/60 text-slate-700'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Floating Feedback Toast for Mantra / Guidance Copies */}
                {copyToast && (
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs text-center shadow-lg animate-in fade-in zoom-in-95 duration-150 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{copyToast}</span>
                  </div>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TOOL 1: NGA-EESHING ঙা-ঈশিং MATRIMONY */}
                {/* ───────────────────────────────────────────────────────────── */}
                {activeToolModal === 'nga-eeshing' && (
                  <div className="space-y-3.5 text-xs font-sans">
                    {!mobileNgaEeshingResult ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const res = calculateNgaEeshing({
                            groomRashi: mobileGroomRashi,
                            brideRashi: mobileBrideRashi,
                            groomName: mobileGroomName,
                            brideName: mobileBrideName,
                          });
                          setMobileNgaEeshingResult(res);
                        }}
                        className="space-y-3"
                      >
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-teal-500/15 border border-cyan-500/30 text-[11px] flex items-center gap-2.5">
                          <span className="text-xl">🐟</span>
                          <span className="text-cyan-900 dark:text-cyan-200 font-medium leading-relaxed">
                            Traditional Manipuri matrimonial matching: ঙা-ঈশিং য়েংবা অমসুং কোক্লবা থৌরমগী পাউতাক।
                          </span>
                        </div>

                        {/* Groom Section */}
                        <div className={`p-3.5 rounded-2xl border space-y-2 ${
                          isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200 shadow-2xs'
                        }`}>
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
                            🤵 নুপাগী অকুপ্পা (Groom)
                          </span>
                          <div>
                            <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                              নুপাগী মমিং (Groom Name)
                            </label>
                            <input
                              type="text"
                              value={mobileGroomName}
                              onChange={(e) => setMobileGroomName(e.target.value)}
                              placeholder="e.g. Sanatomba"
                              className={`w-full h-10 px-3 rounded-xl border text-xs focus:outline-none ${
                                isDark ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                              নুপাগী রাশি (Rashi 0–11) *
                            </label>
                            <select
                              value={mobileGroomRashi}
                              onChange={(e) => setMobileGroomRashi(Number(e.target.value))}
                              className={`w-full h-10 px-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                                isDark ? 'bg-[#1c2541] border-[#3a506b] text-amber-300' : 'bg-white border-slate-300 text-amber-900'
                              }`}
                            >
                              {RASHI_LIST_NGA_EESHING.map((r) => (
                                <option key={r.index} value={r.index}>
                                  {r.nameBengali} ({r.nameEnglish})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Bride Section */}
                        <div className={`p-3.5 rounded-2xl border space-y-2 ${
                          isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200 shadow-2xs'
                        }`}>
                          <span className="text-[11px] font-bold text-rose-500 dark:text-rose-400 block">
                            👰 নুপীগী অকুপ্পা (Bride)
                          </span>
                          <div>
                            <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                              নুপীগী মমিং (Bride Name)
                            </label>
                            <input
                              type="text"
                              value={mobileBrideName}
                              onChange={(e) => setMobileBrideName(e.target.value)}
                              placeholder="e.g. Thoibi"
                              className={`w-full h-10 px-3 rounded-xl border text-xs focus:outline-none ${
                                isDark ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                              নুপীগী রাশি (Rashi 0–11) *
                            </label>
                            <select
                              value={mobileBrideRashi}
                              onChange={(e) => setMobileBrideRashi(Number(e.target.value))}
                              className={`w-full h-10 px-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                                isDark ? 'bg-[#1c2541] border-[#3a506b] text-rose-300' : 'bg-white border-slate-300 text-rose-900'
                              }`}
                            >
                              {RASHI_LIST_NGA_EESHING.map((r) => (
                                <option key={r.index} value={r.index}>
                                  {r.nameBengali} ({r.nameEnglish})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 transition-all"
                        >
                          <Sparkles className="w-4 h-4 text-cyan-200" />
                          <span>ঙা-ঈশিং থিদোকউ (Calculate Matrimony)</span>
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-3.5">
                        {/* Hero Verdict Banner */}
                        <div
                          className={`p-4 sm:p-5 rounded-3xl border text-center space-y-2 shadow-md relative overflow-hidden ${
                            mobileNgaEeshingResult.isNgaEeshing
                              ? isDark
                                ? 'bg-gradient-to-br from-rose-950/70 via-[#1c2541] to-rose-900/40 border-rose-500/40 text-rose-200'
                                : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/80 border-rose-300 text-rose-900'
                              : isDark
                              ? 'bg-gradient-to-br from-emerald-950/70 via-[#1c2541] to-emerald-900/40 border-emerald-500/40 text-emerald-200'
                              : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/80 border-emerald-300 text-emerald-900'
                          }`}
                        >
                          <div className="text-3xl sm:text-4xl">
                            {mobileNgaEeshingResult.isNgaEeshing ? '🐟' : '✨'}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border inline-block ${
                              mobileNgaEeshingResult.isNgaEeshing
                                ? isDark
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                  : 'bg-rose-100 text-rose-800 border-rose-300'
                                : isDark
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            {mobileNgaEeshingResult.verdictText}
                          </span>
                          <h4 className="font-serif font-black text-lg sm:text-xl">
                            {mobileNgaEeshingResult.verdictText}
                          </h4>
                          <p className="text-[11px] font-medium opacity-90 max-w-xs mx-auto">
                            {mobileNgaEeshingResult.natureStatement}
                          </p>
                        </div>

                        {/* Partner Overviews */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`p-3 rounded-2xl border space-y-1 ${isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'}`}>
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">
                              নুপা: {mobileNgaEeshingResult.groomName || 'Groom'}
                            </span>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {mobileNgaEeshingResult.groomRashi.nameBengali}
                            </div>
                            {mobileNgaEeshingResult.isNgaEeshing && (
                              <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-md border mt-1 ${
                                mobileNgaEeshingResult.groomNature === 'ঙা'
                                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30'
                                  : 'bg-teal-500/20 text-teal-600 dark:text-teal-300 border-teal-500/30'
                              }`}>
                                মওং: {mobileNgaEeshingResult.groomNature}
                              </span>
                            )}
                          </div>

                          <div className={`p-3 rounded-2xl border space-y-1 ${isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'}`}>
                            <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 block">
                              নুপী: {mobileNgaEeshingResult.brideName || 'Bride'}
                            </span>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {mobileNgaEeshingResult.brideRashi.nameBengali}
                            </div>
                            {mobileNgaEeshingResult.isNgaEeshing && (
                              <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-md border mt-1 ${
                                mobileNgaEeshingResult.brideNature === 'ঙা'
                                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30'
                                  : 'bg-teal-500/20 text-teal-600 dark:text-teal-300 border-teal-500/30'
                              }`}>
                                মওং: {mobileNgaEeshingResult.brideNature}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remedy & Traditional Rite */}
                        {mobileNgaEeshingResult.isNgaEeshing && (
                          <div className="space-y-2.5">
                            <div className={`p-3.5 rounded-2xl border space-y-2 ${
                              isDark ? 'bg-amber-950/30 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="font-serif font-bold text-xs flex items-center gap-1.5">
                                  <span>📜</span> <span>প্রতিকারগী পাউতাক (Vedic Remedial Guidance)</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(mobileNgaEeshingResult.remedyGuidance || '', 'Nga-Eeshing Remedy')}
                                  className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </button>
                              </div>
                              <p className="whitespace-pre-line text-[11px] leading-relaxed">
                                {mobileNgaEeshingResult.remedyGuidance}
                              </p>
                            </div>

                            {mobileNgaEeshingResult.remedyTitle && (
                              <div className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
                                isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                              }`}>
                                <h5 className="font-serif font-bold text-xs text-amber-600 dark:text-amber-400 border-b pb-1.5 border-slate-200 dark:border-white/10">
                                  {mobileNgaEeshingResult.remedyTitle}
                                </h5>
                                {mobileNgaEeshingResult.potchangText && (
                                  <div>
                                    <span className="font-bold text-[10px] uppercase text-rose-500 block mb-0.5">পোৎচং মওং:</span>
                                    <p className="text-[11px] leading-relaxed text-slate-700 dark:text-gray-300">
                                      {mobileNgaEeshingResult.potchangText}
                                    </p>
                                  </div>
                                )}
                                {mobileNgaEeshingResult.laironText && (
                                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b]">
                                    <span className="font-bold text-[10px] uppercase text-amber-600 dark:text-amber-400 block mb-0.5">লাইরোন:</span>
                                    <p className="text-[11px] italic leading-relaxed text-slate-800 dark:text-gray-200">
                                      "{mobileNgaEeshingResult.laironText}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-2 pt-1">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                          >
                            <Download className="w-4 h-4" />
                            <span>Print / Save Matrimony Report</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMobileNgaEeshingResult(null)}
                            className={`w-full py-2.5 rounded-2xl font-bold text-xs border cursor-pointer ${
                              isDark ? 'border-[#3a506b] bg-[#0b132b] text-gray-300' : 'border-slate-300 bg-white text-slate-800'
                            }`}
                          >
                            Calculate Another Couple
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TOOL 2: YUMSHAROL য়ুমশারোল (TRADITIONAL HOUSE SCIENCE & VASTU) */}
                {/* ───────────────────────────────────────────────────────────── */}
                {activeToolModal === 'yumsharol' && (
                  <div className="space-y-3.5 text-xs font-sans">
                    {!mobileYumResult ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          try {
                            setMobileYumErr('');
                            const res = calculateYumsharol({
                              dob: mobileYumDob,
                              tob: mobileYumTob || '12:00',
                              nakshatra: Number(mobileYumNakshatra) || 1,
                              constantValue: Number(mobileYumConstant) || 15,
                            });
                            setMobileYumResult(res);
                          } catch (err: any) {
                            setMobileYumErr(err.message || 'Calculation error.');
                          }
                        }}
                        className="space-y-3"
                      >
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30 text-[11px] flex items-center gap-2.5">
                          <span className="text-xl">🏡</span>
                          <span className="text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                            Traditional Manipuri house-building numerology & 8-direction compatibility.
                          </span>
                        </div>

                        {mobileYumErr && (
                          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[11px] font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{mobileYumErr}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                              Date of Birth *
                            </label>
                            <input
                              type="date"
                              required
                              value={mobileYumDob}
                              max={new Date().toISOString().split('T')[0]}
                              onChange={(e) => {
                                setMobileYumDob(e.target.value);
                                setMobileYumErr('');
                              }}
                              className={`w-full h-10 px-3 rounded-xl border text-xs focus:outline-none ${
                                isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                              Time of Birth
                            </label>
                            <input
                              type="time"
                              value={mobileYumTob}
                              onChange={(e) => {
                                setMobileYumTob(e.target.value);
                                setMobileYumErr('');
                              }}
                              className={`w-full h-10 px-3 rounded-xl border text-xs focus:outline-none ${
                                isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                            Birth Nakshatra (1–27) *
                          </label>
                          <select
                            value={mobileYumNakshatra}
                            onChange={(e) => setMobileYumNakshatra(Number(e.target.value))}
                            className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold focus:outline-none ${
                              isDark ? 'bg-[#0b132b] border-[#3a506b] text-amber-300' : 'bg-white border-slate-300 text-amber-900'
                            }`}
                          >
                            {NAKSHATRAS_LIST.map((nak) => (
                              <option key={nak.index} value={nak.index}>
                                #{nak.index} {nak.name} ({nak.ruler})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className={`block text-[10px] font-bold ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                              Constant Value
                            </label>
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                              Default: 15
                            </span>
                          </div>
                          <input
                            type="number"
                            value={mobileYumConstant}
                            onChange={(e) => setMobileYumConstant(Number(e.target.value))}
                            className={`w-full h-10 px-3 rounded-xl border font-mono font-bold text-xs focus:outline-none ${
                              isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 transition-all"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-200" />
                          <span>Calculate Yumsharol (য়ুমশারোল)</span>
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-3.5">
                        {/* Result Banner */}
                        <div
                          className={`p-4 sm:p-5 rounded-3xl border text-center space-y-2 shadow-md ${
                            mobileYumResult.directionInfo.quality === 'Auspicious'
                              ? isDark
                                ? 'bg-gradient-to-br from-emerald-950/70 via-[#1c2541] to-emerald-900/40 border-emerald-500/40 text-emerald-200'
                                : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/80 border-emerald-300 text-emerald-900'
                              : isDark
                              ? 'bg-gradient-to-br from-rose-950/70 via-[#1c2541] to-rose-900/40 border-rose-500/40 text-rose-200'
                              : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/80 border-rose-300 text-rose-900'
                          }`}
                        >
                          <div className="text-3xl">{mobileYumResult.directionInfo.symbol}</div>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border inline-block ${
                              isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                          >
                            Index #{mobileYumResult.traditionalIndex} • {mobileYumResult.directionInfo.quality}
                          </span>
                          <h4 className="font-serif font-black text-xl text-slate-900 dark:text-white">
                            {mobileYumResult.directionInfo.name}
                          </h4>
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                            Direction: {mobileYumResult.directionInfo.direction} ({mobileYumResult.directionInfo.directionManipuri})
                          </p>
                        </div>

                        {/* Breakdown Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'}`}>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Running Age:</span>
                            <strong className="text-amber-600 dark:text-amber-400 text-sm font-mono block mt-0.5">{mobileYumResult.runningAge}th Year</strong>
                          </div>
                          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'}`}>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Nakshatra:</span>
                            <strong className="text-xs truncate block text-slate-900 dark:text-white mt-0.5">#{mobileYumResult.nakshatra} {mobileYumResult.nakshatraName}</strong>
                          </div>
                          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'}`}>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Constant Value:</span>
                            <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-mono block mt-0.5">{mobileYumResult.constantValue}</strong>
                          </div>
                          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'}`}>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Modulo 8:</span>
                            <strong className="text-sky-600 dark:text-cyan-400 text-sm font-mono block mt-0.5">Remainder = {mobileYumResult.standardMod}</strong>
                          </div>
                        </div>

                        {/* Remainder Card & Classical Lore */}
                        <div className={`p-4 rounded-3xl border text-center space-y-2 shadow-sm ${
                          isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-amber-50/70 border-amber-300'
                        }`}>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-gray-400 block">
                            Remainder Result
                          </span>
                          <div className="text-4xl sm:text-5xl font-black font-mono text-[#d97706] dark:text-[#fbbf24]">
                            {mobileYumResult.standardMod}
                          </div>
                          <div className={`p-3 rounded-2xl border ${
                            isDark ? 'bg-[#1c2541] border-amber-500/30' : 'bg-white border-amber-200'
                          }`}>
                            <p className="font-serif text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                              {mobileYumResult.remainderPrediction || 'Auspicious building orientation calculated.'}
                            </p>
                          </div>
                        </div>

                        {/* Significance & Guidance */}
                        <div className={`p-3.5 rounded-2xl border space-y-2 text-[11px] ${
                          isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                        }`}>
                          <p className="leading-relaxed text-slate-800 dark:text-gray-200">
                            <strong className="text-slate-900 dark:text-white">Significance: </strong>
                            {mobileYumResult.directionInfo.significance}
                          </p>
                          <p className="leading-relaxed pt-1.5 border-t border-slate-200 dark:border-white/10 text-amber-800 dark:text-amber-300">
                            <strong className="text-slate-900 dark:text-white">Guidance: </strong>
                            {mobileYumResult.directionInfo.recommendation}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 pt-1">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                          >
                            <Download className="w-4 h-4" />
                            <span>Print / Save Yumsharol PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMobileYumResult(null)}
                            className={`w-full py-2.5 rounded-2xl font-bold text-xs border cursor-pointer ${
                              isDark ? 'border-[#3a506b] bg-[#0b132b] text-gray-300' : 'border-slate-300 bg-white text-slate-800'
                            }`}
                          >
                            Calculate Another Profile
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TOOL 3: ASHTAKOOT 36-GUN MILAN (MATCH MAKING) */}
                {/* ───────────────────────────────────────────────────────────── */}
                {(activeToolModal === 'matchmaking' || activeToolModal === 'match-making') && (
                  <div className="space-y-3.5 text-xs font-sans">
                    {!mobileToolResult ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const res = calculateCoupleMatch({
                            groom: {
                              name: mobileBirthForm.name || 'Groom',
                              dob: mobileBirthForm.dob,
                              tob: mobileBirthForm.tob,
                            },
                            bride: {
                              name: mobileBirthForm.partnerName || 'Bride',
                              dob: mobileBirthForm.partnerDob,
                              tob: mobileBirthForm.partnerTob,
                            },
                          });
                          setMobileToolResult({ isMatchMaking: true, ...res });
                        }}
                        className="space-y-3"
                      >
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500/15 via-rose-500/10 to-pink-500/15 border border-pink-500/30 text-[11px] flex items-center gap-2.5">
                          <span className="text-xl">💍</span>
                          <span className="text-pink-900 dark:text-pink-200 font-medium leading-relaxed">
                            Full Ashtakoot 36-Gun Milan & Manglik mutual compatibility check.
                          </span>
                        </div>

                        {/* Groom Section */}
                        <div className={`p-3.5 rounded-2xl border space-y-2 ${
                          isDark ? 'border-cyan-500/30 bg-[#0b132b]' : 'border-sky-200 bg-sky-50/60 shadow-2xs'
                        }`}>
                          <span className={`text-[11px] font-bold uppercase block ${isDark ? 'text-cyan-400' : 'text-sky-900'}`}>
                            🤵 Groom (বর)
                          </span>
                          <input
                            type="text"
                            value={mobileBirthForm.name}
                            onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, name: e.target.value })}
                            className={`w-full h-9 px-3 rounded-xl border text-xs focus:outline-none ${
                              isDark ? 'border-[#3a506b] bg-[#1c2541] text-white' : 'border-slate-300 bg-white text-slate-900'
                            }`}
                            placeholder="Groom Full Name"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              required
                              value={mobileBirthForm.dob}
                              onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, dob: e.target.value })}
                              className={`w-full h-9 px-2.5 rounded-xl border text-xs focus:outline-none ${
                                isDark ? 'border-[#3a506b] bg-[#1c2541] text-white' : 'border-slate-300 bg-white text-slate-900'
                              }`}
                            />
                            <input
                              type="time"
                              required
                              value={mobileBirthForm.tob}
                              onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, tob: e.target.value })}
                              className={`w-full h-9 px-2.5 rounded-xl border text-xs focus:outline-none ${
                                isDark ? 'border-[#3a506b] bg-[#1c2541] text-white' : 'border-slate-300 bg-white text-slate-900'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Bride Section */}
                        <div className={`p-3.5 rounded-2xl border space-y-2 ${
                          isDark ? 'border-pink-500/30 bg-[#0b132b]' : 'border-pink-200 bg-pink-50/60 shadow-2xs'
                        }`}>
                          <span className={`text-[11px] font-bold uppercase block ${isDark ? 'text-pink-400' : 'text-pink-900'}`}>
                            👰 Bride (কন্যা)
                          </span>
                          <input
                            type="text"
                            value={mobileBirthForm.partnerName}
                            onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, partnerName: e.target.value })}
                            className={`w-full h-9 px-3 rounded-xl border text-xs focus:outline-none ${
                              isDark ? 'border-[#3a506b] bg-[#1c2541] text-white' : 'border-slate-300 bg-white text-slate-900'
                            }`}
                            placeholder="Bride Full Name"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              required
                              value={mobileBirthForm.partnerDob}
                              onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, partnerDob: e.target.value })}
                              className={`w-full h-9 px-2.5 rounded-xl border text-xs focus:outline-none ${
                                isDark ? 'border-[#3a506b] bg-[#1c2541] text-white' : 'border-slate-300 bg-white text-slate-900'
                              }`}
                            />
                            <input
                              type="time"
                              required
                              value={mobileBirthForm.partnerTob}
                              onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, partnerTob: e.target.value })}
                              className={`w-full h-9 px-2.5 rounded-xl border text-xs focus:outline-none ${
                                isDark ? 'border-[#3a506b] bg-[#1c2541] text-white' : 'border-slate-300 bg-white text-slate-900'
                              }`}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 transition-all"
                        >
                          <Sparkles className="w-4 h-4 text-pink-200" />
                          <span>Calculate 36-Gun Milan (ম্যাচিং)</span>
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-3.5">
                        {/* Hero Score Banner */}
                        <div className={`p-4 sm:p-5 rounded-3xl border text-center space-y-2 shadow-md relative overflow-hidden ${
                          mobileToolResult.totalScore >= 18
                            ? isDark
                              ? 'bg-gradient-to-br from-emerald-950/70 via-[#1c2541] to-emerald-900/40 border-emerald-500/40'
                              : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/80 border-emerald-300'
                            : isDark
                            ? 'bg-gradient-to-br from-rose-950/70 via-[#1c2541] to-rose-900/40 border-rose-500/40'
                            : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/80 border-rose-300'
                        }`}>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400 block">
                            Ashtakoot Gun Milan Score
                          </span>
                          <div className="text-4xl sm:text-5xl font-black font-mono text-[#d97706] dark:text-[#fbbf24]">
                            {mobileToolResult.totalScore}
                            <span className="text-base font-bold text-slate-400 dark:text-gray-500"> / 36</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-black inline-block border ${
                            mobileToolResult.totalScore >= 18
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/30'
                          }`}>
                            {mobileToolResult.verdict}
                          </span>
                          <div className="text-[11px] font-medium text-slate-600 dark:text-gray-300 pt-1 flex justify-center gap-3">
                            <span>🤵 {mobileToolResult.groomMoonSign}</span>
                            <span>•</span>
                            <span>👰 {mobileToolResult.brideMoonSign}</span>
                          </div>
                        </div>

                        {/* Critical Alerts */}
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                            mobileToolResult.nadiDoshAlert
                              ? (isDark ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' : 'bg-rose-50 border-rose-300 text-rose-800')
                              : (isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800')
                          }`}>
                            <span className="font-bold">Nadi Dosh:</span>
                            <span className="font-extrabold">{mobileToolResult.nadiDoshAlert ? '⚠️ Alert (0/8)' : '✓ Safe (8/8)'}</span>
                          </div>
                          <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                            mobileToolResult.bhakootDoshAlert
                              ? (isDark ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' : 'bg-rose-50 border-rose-300 text-rose-800')
                              : (isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800')
                          }`}>
                            <span className="font-bold">Bhakoot Dosh:</span>
                            <span className="font-extrabold">{mobileToolResult.bhakootDoshAlert ? '⚠️ Alert (0/7)' : '✓ Safe (7/7)'}</span>
                          </div>
                        </div>

                        {/* Manglik Analysis */}
                        <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                          isDark ? 'bg-[#0b132b] border-[#3a506b] text-gray-300' : 'bg-amber-50/80 border-amber-200 text-amber-950 shadow-2xs'
                        }`}>
                          <span className="font-bold text-[10px] uppercase text-[#d97706] block">Kuja Samya Verdict:</span>
                          <p className="text-[11px]">
                            {mobileToolResult.manglikCompatibilityVerdict}
                          </p>
                        </div>

                        {/* 8-Koot Score Breakdown */}
                        {mobileToolResult.kootBreakdown && (
                          <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                            isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                          }`}>
                            <span className="text-[11px] font-serif font-bold text-slate-900 dark:text-white block">
                              Ashtakoot 8-Fold Point Breakdown:
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                              {mobileToolResult.kootBreakdown.map((k: any, idx: number) => (
                                <div key={idx} className={`p-2 rounded-xl border flex items-center justify-between ${
                                  isDark ? 'bg-[#1c2541]/70 border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                                }`}>
                                  <span className="font-semibold">{k.kootName}</span>
                                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                    {k.obtainedPoints}/{k.maxPoints}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-2 pt-1">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                          >
                            <Download className="w-4 h-4" />
                            <span>Print / Save 36-Gun Milan PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMobileToolResult(null)}
                            className={`w-full py-2.5 rounded-2xl font-bold text-xs border cursor-pointer ${
                              isDark ? 'border-[#3a506b] bg-[#0b132b] text-gray-300' : 'border-slate-300 bg-white text-slate-800'
                            }`}
                          >
                            Calculate Another Couple
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TOOL 4: GENERAL COMPLETE FULL BIRTH DETAILS FORM */}
                {/* (For Workstations, Kundli, Dasha, Sade Sati, Manglik, Kaal Sarp, Yogas, Numerology) */}
                {/* ───────────────────────────────────────────────────────────── */}
                {activeToolModal !== 'nga-eeshing' &&
                  activeToolModal !== 'yumsharol' &&
                  activeToolModal !== 'match-making' &&
                  activeToolModal !== 'matchmaking' &&
                  activeToolModal !== 'transit' && (
                    <div className="space-y-3.5 text-xs font-sans">
                      {!mobileToolResult ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (
                              activeToolModal === 'vedic-workstation' ||
                              activeToolModal === 'bnn-workstation' ||
                              activeToolModal === 'vastu-workstation'
                            ) {
                              setMobileToolResult({ type: 'workstation-ready' });
                            } else if (activeToolModal === 'kundali' || activeToolModal === 'kuthi-generator') {
                              try {
                                const chartCalc = calculatePlanetaryPositions({
                                  name: mobileBirthForm.name || 'Native Client',
                                  gender: mobileBirthForm.gender || 'Female',
                                  dateOfBirth: mobileBirthForm.dob || '1998-10-24',
                                  timeOfBirth: mobileBirthForm.tob || '09:45',
                                  latitude: Number(mobileBirthForm.lat) || 24.8170,
                                  longitude: Number(mobileBirthForm.lng) || 93.9368,
                                  timezone: 'Asia/Kolkata',
                                  utcOffset: Number(mobileBirthForm.timezone) || 5.5,
                                  ayanamsa: 'Lahiri',
                                });
                                const moon = chartCalc.planets.find((p) => p.id === 'mo') || chartCalc.planets[1];
                                const sun = chartCalc.planets.find((p) => p.id === 'su') || chartCalc.planets[0];
                                setSelectedChartOrder((prev) => ({
                                  ...prev,
                                  clientName: mobileBirthForm.name || 'Native Client',
                                  clientDetails: {
                                    ...prev.clientDetails,
                                    sex: mobileBirthForm.gender,
                                    dob: mobileBirthForm.dob,
                                    tob: mobileBirthForm.tob,
                                    pob: mobileBirthForm.pob,
                                    faithTradition: mobileBirthForm.faithTradition,
                                    yek: mobileBirthForm.yek,
                                    gotra: mobileBirthForm.gotra,
                                    lagna: 'বৃশ্চিক (Scorpio)',
                                    moonSign: moon.signName || 'Vrishabha (বৃষ)',
                                  },
                                }));
                                setMobileToolResult({
                                  isKuthiReport: true,
                                  nativeName: mobileBirthForm.name,
                                  dob: mobileBirthForm.dob,
                                  tob: mobileBirthForm.tob,
                                  pob: mobileBirthForm.pob,
                                  faithTradition: mobileBirthForm.faithTradition,
                                  yek: mobileBirthForm.yek,
                                  gotra: mobileBirthForm.gotra,
                                  moonSign: moon.signName || 'বৃষ (Vrishabha)',
                                  sunSign: sun.signName || 'সিংহ (Simha)',
                                  nakshatra: moon.nakshatraName || 'Rohini',
                                  pada: moon.nakshatraPada || 2,
                                  lagna: 'বৃশ্চিক (Scorpio)',
                                });
                              } catch (err) {
                                setSelectedChartOrder((prev) => ({
                                  ...prev,
                                  clientName: mobileBirthForm.name || 'Native Client',
                                }));
                                setActiveToolModal(null);
                                setActiveTab('charts');
                              }
                            } else if (activeToolModal === 'sadesati' || activeToolModal === 'shani-sade-sati') {
                              const res = calculateSadeSati({
                                name: mobileBirthForm.name,
                                gender: mobileBirthForm.gender,
                                dob: mobileBirthForm.dob,
                                tob: mobileBirthForm.tob || '12:00',
                                lat: Number(mobileBirthForm.lat) || 24.8170,
                                lng: Number(mobileBirthForm.lng) || 93.9368,
                                timezone: Number(mobileBirthForm.timezone) || 5.5,
                              });
                              setMobileToolResult({ isSadeSati: true, ...res });
                            } else if (activeToolModal === 'manglik' || activeToolModal === 'mangalik-dosh') {
                              const res = calculateManglikDosh({
                                name: mobileBirthForm.name,
                                gender: mobileBirthForm.gender,
                                dob: mobileBirthForm.dob,
                                tob: mobileBirthForm.tob || '12:00',
                                lat: Number(mobileBirthForm.lat) || 24.8170,
                                lng: Number(mobileBirthForm.lng) || 93.9368,
                                timezone: Number(mobileBirthForm.timezone) || 5.5,
                              });
                              setMobileToolResult({ isManglikReport: true, ...res });
                            } else if (activeToolModal === 'kaalsarp' || activeToolModal === 'kaal-sarp-dosh') {
                              const res = calculateKaalSarpDosh({
                                name: mobileBirthForm.name,
                                gender: mobileBirthForm.gender,
                                dob: mobileBirthForm.dob,
                                tob: mobileBirthForm.tob || '12:00',
                                lat: Number(mobileBirthForm.lat) || 24.8170,
                                lng: Number(mobileBirthForm.lng) || 93.9368,
                                timezone: Number(mobileBirthForm.timezone) || 5.5,
                              });
                              setMobileToolResult({ isKaalSarp: true, ...res });
                            } else if (activeToolModal === 'yogas' || activeToolModal === 'astrology-yoga') {
                              const res = calculatePlanetaryYogas({
                                name: mobileBirthForm.name,
                                gender: mobileBirthForm.gender,
                                dob: mobileBirthForm.dob,
                                tob: mobileBirthForm.tob || '12:00',
                                lat: Number(mobileBirthForm.lat) || 24.8170,
                                lng: Number(mobileBirthForm.lng) || 93.9368,
                                timezone: Number(mobileBirthForm.timezone) || 5.5,
                              });
                              setMobileToolResult({ isPlanetaryYogas: true, ...res });
                            } else if (activeToolModal === 'dasha' || activeToolModal === 'dasha-yengpham') {
                              try {
                                const [year, month, day] = (mobileBirthForm.dob || '1998-10-24').split('-').map(Number);
                                const [hr, min] = (mobileBirthForm.tob || '09:45').split(':').map(Number);
                                const chartCalc = calculatePlanetaryPositions({
                                  name: mobileBirthForm.name || 'Native Client',
                                  gender: mobileBirthForm.gender || 'Female',
                                  dateOfBirth: mobileBirthForm.dob || '1998-10-24',
                                  timeOfBirth: mobileBirthForm.tob || '09:45',
                                  latitude: Number(mobileBirthForm.lat) || 24.8170,
                                  longitude: Number(mobileBirthForm.lng) || 93.9368,
                                  timezone: 'Asia/Kolkata',
                                  utcOffset: Number(mobileBirthForm.timezone) || 5.5,
                                  ayanamsa: 'Lahiri',
                                });
                                const moon = chartCalc.planets.find((p) => p.id === 'mo') || chartCalc.planets[1];
                                const birthDateObj = new Date(year, month - 1, day, hr, min);
                                const dashas = calculateDetailedVimshottari(moon.longitude, birthDateObj);
                                const activeDasha = dashas.find((d) => new Date(d.startDate).getTime() <= Date.now() && new Date(d.endDate).getTime() >= Date.now()) || dashas[0];
                                setMobileToolResult({
                                  isDashaReport: true,
                                  dashas,
                                  activeDasha,
                                  nativeName: mobileBirthForm.name,
                                  dob: mobileBirthForm.dob,
                                  moonSign: moon.signName,
                                  nakshatra: moon.nakshatraName,
                                });
                              } catch (err) {
                                setMobileToolResult({
                                  isDashaReport: true,
                                  nativeName: mobileBirthForm.name || 'Native Client',
                                  activeDasha: {
                                    lord: 'Jupiter (বৃহস্পতি)',
                                    startDate: '2015-04-12',
                                    endDate: '2031-04-12',
                                    antardashas: [
                                      { lord: 'Saturn (শনি)', startDate: '2024-02-10', endDate: '2027-08-20' },
                                      { lord: 'Mercury (বুধ)', startDate: '2027-08-20', endDate: '2029-11-25' },
                                    ]
                                  }
                                });
                              }
                            } else if (activeToolModal === 'vedic-numerology') {
                              try {
                                const numRes = calculateVedicNumerology({
                                  fullName: mobileBirthForm.name || 'Sanatomba Meitei',
                                  dob: mobileBirthForm.dob || '2004-06-28',
                                  gender: (mobileBirthForm.gender as any) || 'Male',
                                });
                                setMobileToolResult({
                                  isNumerologyReport: true,
                                  ...numRes,
                                  nativeName: mobileBirthForm.name,
                                });
                              } catch (err: any) {
                                setMobileToolResult({
                                  isNumerologyReport: true,
                                  nativeName: mobileBirthForm.name,
                                  core: { moolank: 1, bhagyank: 4, nameNumber: 5, moolankPlanet: 'Sun (রবি)', bhagyankPlanet: 'Rahu (রাহু)', nameNumberPlanet: 'Mercury (বুধ)' }
                                });
                              }
                            }
                          }}
                          className="space-y-3"
                        >
                          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] flex items-center gap-2.5">
                            <span className="text-xl">✨</span>
                            <span className="text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                              {activeToolModal === 'sadesati' || activeToolModal === 'shani-sade-sati'
                                ? '7.5-Year Saturn Transit Phase & Moon Sign impact analysis.'
                                : activeToolModal === 'manglik' || activeToolModal === 'mangalik-dosh'
                                ? 'Kuja Dosha calculation from Lagna, Moon & Venus with classical Bhanga.'
                                : activeToolModal === 'kaalsarp' || activeToolModal === 'kaal-sarp-dosh'
                                ? 'Identifies 12 classical Kaal Sarp yogas & nodal containment axis.'
                                : activeToolModal === 'yogas' || activeToolModal === 'astrology-yoga'
                                ? 'Evaluates Gajakesari, Raja Yogas & classical astrological combinations.'
                                : activeToolModal === 'dasha' || activeToolModal === 'dasha-yengpham'
                                ? 'Vimshottari 120-year Dasha timeline and active running Antardashas.'
                                : activeToolModal === 'vedic-numerology'
                                ? 'Ank Shastra: Moolank, Bhagyank, Name vibrations & Cheiro numerology.'
                                : 'Enter native birth parameters to generate calculation.'}
                            </span>
                          </div>

                          <div>
                            <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                              Native Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={mobileBirthForm.name}
                              onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, name: e.target.value })}
                              placeholder="e.g. Sanatombi Devi"
                              className={`w-full h-10 px-3 rounded-xl border text-xs focus:outline-none ${
                                isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                                Date of Birth *
                              </label>
                              <input
                                type="date"
                                required
                                value={mobileBirthForm.dob}
                                onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, dob: e.target.value })}
                                className={`w-full h-10 px-3 rounded-xl border text-xs focus:outline-none ${
                                  isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                                }`}
                              />
                            </div>
                            <div>
                              <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                                Time of Birth *
                              </label>
                              <input
                                type="time"
                                required
                                value={mobileBirthForm.tob}
                                onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, tob: e.target.value })}
                                className={`w-full h-10 px-3 rounded-xl border text-xs focus:outline-none ${
                                  isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                                }`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                              Gender
                            </label>
                            <select
                              value={mobileBirthForm.gender}
                              onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, gender: e.target.value })}
                              className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold focus:outline-none ${
                                isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            >
                              <option value="Female">Female (নুপী)</option>
                              <option value="Male">Male (নুপা)</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className={`block text-[10px] font-bold mb-1 ${isDark ? 'text-[#e0a96d]' : 'text-slate-800'}`}>
                              Place of Birth (City / Town)
                            </label>
                            <input
                              type="text"
                              value={mobileBirthForm.pob}
                              onChange={(e) => setMobileBirthForm({ ...mobileBirthForm, pob: e.target.value })}
                              placeholder="e.g. Imphal West, Manipur"
                              className={`w-full h-10 px-3 rounded-xl border text-xs focus:outline-none ${
                                isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 transition-all"
                          >
                            <Sparkles className="w-4 h-4 text-amber-200" />
                            <span>Calculate Astrological Analysis</span>
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-3.5">
                          {/* -------------------------------------------------- */}
                          {/* RESULT VIEW: SHANI SADE SATI */}
                          {/* -------------------------------------------------- */}
                          {mobileToolResult.isSadeSati && (
                            <div className="space-y-3.5">
                              <div className={`p-4 sm:p-5 rounded-3xl border text-center space-y-2 shadow-md ${
                                mobileToolResult.isSadeSatiActive
                                  ? (isDark ? 'bg-gradient-to-br from-rose-950/70 via-[#1c2541] to-rose-900/40 border-rose-500/40' : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/80 border-rose-300')
                                  : (isDark ? 'bg-gradient-to-br from-emerald-950/70 via-[#1c2541] to-emerald-900/40 border-emerald-500/40' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/80 border-emerald-300')
                              }`}>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400 block">
                                  Shani Sade Sati Status
                                </span>
                                <h4 className="font-serif font-black text-xl text-slate-900 dark:text-white">
                                  {mobileToolResult.phase}
                                </h4>
                                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">
                                  {mobileToolResult.phaseManipuri}
                                </span>
                                <div className="text-[11px] text-slate-600 dark:text-gray-300 pt-1 flex justify-center gap-2 font-medium">
                                  <span>Moon: <strong>{mobileToolResult.moonSign}</strong></span>
                                  <span>•</span>
                                  <span>Transit Saturn: <strong>{mobileToolResult.currentSaturnSign}</strong></span>
                                </div>
                              </div>

                              <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                                isDark ? 'bg-[#0b132b] border-[#3a506b] text-gray-300' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                              }`}>
                                {mobileToolResult.statusDescription}
                              </div>

                              {/* Domain Impacts Matrix */}
                              {mobileToolResult.domainImpacts && (
                                <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                                }`}>
                                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                                    Life Domain Impact Analysis:
                                  </span>
                                  <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                                    {Object.entries(mobileToolResult.domainImpacts).map(([domain, info]: any) => (
                                      <div key={domain} className={`p-2.5 rounded-xl border space-y-0.5 ${
                                        isDark ? 'bg-[#1c2541]/70 border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                                      }`}>
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold capitalize text-slate-900 dark:text-white">{domain}</span>
                                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                                            info.severity === 'High' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-600'
                                          }`}>
                                            {info.severity}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 dark:text-gray-400 line-clamp-2">{info.note}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Vedic Remedies & Mantra */}
                              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                                isDark ? 'bg-sky-950/30 border-sky-500/30' : 'bg-sky-50 border-sky-200 text-sky-950'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <span className="font-serif font-bold text-xs flex items-center gap-1.5">
                                    <span>🪐</span> <span>Prescribed Shani Mantra</span>
                                  </span>
                                  {mobileToolResult.vedicRemedies?.mantra && (
                                    <button
                                      type="button"
                                      onClick={() => copyToClipboard(mobileToolResult.vedicRemedies.mantra, 'Shani Mantra')}
                                      className="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-700 dark:text-sky-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                    >
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </button>
                                  )}
                                </div>
                                <p className="font-mono text-xs font-bold select-all bg-white/50 dark:bg-black/20 p-2 rounded-xl border border-sky-300/40">
                                  {mobileToolResult.vedicRemedies?.mantra}
                                </p>
                                <div className="text-[11px] pt-1 space-y-1 opacity-90">
                                  <p><strong>Charity / Daan:</strong> {mobileToolResult.vedicRemedies?.charity}</p>
                                  <p><strong>Rudraksha:</strong> {mobileToolResult.vedicRemedies?.gemstone}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* RESULT VIEW: MANGLIK DOSH (KUJA DOSHA) */}
                          {/* -------------------------------------------------- */}
                          {mobileToolResult.isManglikReport && (
                            <div className="space-y-3.5">
                              <div className={`p-4 sm:p-5 rounded-3xl border text-center space-y-2 shadow-md ${
                                mobileToolResult.score > 0
                                  ? (isDark ? 'bg-gradient-to-br from-rose-950/70 via-[#1c2541] to-rose-900/40 border-rose-500/40' : 'bg-gradient-to-br from-rose-50 via-white to-rose-100/80 border-rose-300')
                                  : (isDark ? 'bg-gradient-to-br from-emerald-950/70 via-[#1c2541] to-emerald-900/40 border-emerald-500/40' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/80 border-emerald-300')
                              }`}>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400 block">
                                  Manglik Dosh Evaluation
                                </span>
                                <h4 className="font-serif font-black text-xl text-slate-900 dark:text-white">
                                  {mobileToolResult.status}
                                </h4>
                                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">
                                  {mobileToolResult.statusManipuri}
                                </span>
                                <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
                                  Score: {mobileToolResult.score}%
                                </div>
                              </div>

                              <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                                isDark ? 'bg-[#0b132b] border-[#3a506b] text-gray-300' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                              }`}>
                                <span className="font-bold text-[10px] uppercase text-rose-500 block mb-1">Marriage Guidance:</span>
                                {mobileToolResult.marriageGuidance}
                              </div>

                              {/* Placements Matrix */}
                              {mobileToolResult.placements && (
                                <div className={`p-3.5 rounded-2xl border space-y-2 ${
                                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                                }`}>
                                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                                    3-Reference Mars Positions:
                                  </span>
                                  <div className="grid grid-cols-3 gap-2 text-center text-[10.5px]">
                                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b]">
                                      <span className="text-slate-500 dark:text-gray-400 block">Lagna</span>
                                      <strong className={mobileToolResult.placements.fromLagna?.isManglik ? 'text-rose-500' : 'text-emerald-500'}>
                                        {mobileToolResult.placements.fromLagna?.isManglik ? `H${mobileToolResult.placements.fromLagna.house} (Dosh)` : 'Clear'}
                                      </strong>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b]">
                                      <span className="text-slate-500 dark:text-gray-400 block">Moon</span>
                                      <strong className={mobileToolResult.placements.fromMoon?.isManglik ? 'text-rose-500' : 'text-emerald-500'}>
                                        {mobileToolResult.placements.fromMoon?.isManglik ? `H${mobileToolResult.placements.fromMoon.house} (Dosh)` : 'Clear'}
                                      </strong>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b]">
                                      <span className="text-slate-500 dark:text-gray-400 block">Venus</span>
                                      <strong className={mobileToolResult.placements.fromVenus?.isManglik ? 'text-rose-500' : 'text-emerald-500'}>
                                        {mobileToolResult.placements.fromVenus?.isManglik ? `H${mobileToolResult.placements.fromVenus.house} (Dosh)` : 'Clear'}
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Vedic Remedies */}
                              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                                isDark ? 'bg-rose-950/30 border-rose-500/30' : 'bg-rose-50 border-rose-200 text-rose-950'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <span className="font-serif font-bold text-xs flex items-center gap-1.5">
                                    <span>🔥</span> <span>Mangal Gayatri Mantra</span>
                                  </span>
                                  {mobileToolResult.vedicRemedies?.mantra && (
                                    <button
                                      type="button"
                                      onClick={() => copyToClipboard(mobileToolResult.vedicRemedies.mantra, 'Mangal Mantra')}
                                      className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-700 dark:text-rose-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                    >
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </button>
                                  )}
                                </div>
                                <p className="font-mono text-xs font-bold select-all bg-white/50 dark:bg-black/20 p-2 rounded-xl border border-rose-300/40">
                                  {mobileToolResult.vedicRemedies?.mantra}
                                </p>
                                <p className="text-[11px] pt-1 opacity-90">
                                  <strong>Ritual / Puja:</strong> {mobileToolResult.vedicRemedies?.ritual}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* RESULT VIEW: KAAL SARP DOSH */}
                          {/* -------------------------------------------------- */}
                          {mobileToolResult.isKaalSarp && (
                            <div className="space-y-3.5">
                              <div className={`p-4 sm:p-5 rounded-3xl border text-center space-y-2 shadow-md ${
                                mobileToolResult.hasKaalSarp
                                  ? (isDark ? 'bg-gradient-to-br from-purple-950/70 via-[#1c2541] to-purple-900/40 border-purple-500/40' : 'bg-gradient-to-br from-purple-50 via-white to-purple-100/80 border-purple-300')
                                  : (isDark ? 'bg-gradient-to-br from-emerald-950/70 via-[#1c2541] to-emerald-900/40 border-emerald-500/40' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/80 border-emerald-300')
                              }`}>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400 block">
                                  Kaal Sarp Yoga Type
                                </span>
                                <h4 className="font-serif font-black text-xl text-slate-900 dark:text-white">
                                  {mobileToolResult.doshType}
                                </h4>
                                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">
                                  {mobileToolResult.doshTypeManipuri}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block border ${
                                  mobileToolResult.hasKaalSarp ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/30' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                                }`}>
                                  Intensity: {mobileToolResult.intensity}
                                </span>
                              </div>

                              <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                                isDark ? 'bg-[#0b132b] border-[#3a506b] text-gray-300' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                              }`}>
                                {mobileToolResult.classicalDescription}
                              </div>

                              {/* Trapped vs Free Planets */}
                              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                                isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                              }`}>
                                <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                                  Nodal Containment Axis:
                                </span>
                                <div className="space-y-1 text-[11px]">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-gray-400">Trapped Planets:</span>
                                    <strong className="text-purple-600 dark:text-purple-300 font-mono">
                                      {mobileToolResult.trappedPlanets?.join(', ') || 'All 7 Planets Trapped'}
                                    </strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-gray-400">Free Planets:</span>
                                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                                      {mobileToolResult.freePlanets?.length > 0 ? mobileToolResult.freePlanets.join(', ') : 'None (Full Yoga)'}
                                    </strong>
                                  </div>
                                </div>
                              </div>

                              {/* Vedic Remedies */}
                              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                                isDark ? 'bg-purple-950/30 border-purple-500/30' : 'bg-purple-50 border-purple-200 text-purple-950'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <span className="font-serif font-bold text-xs flex items-center gap-1.5">
                                    <span>🐍</span> <span>Maha Mrityunjaya Remedy</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard('ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥', 'Maha Mrityunjaya Mantra')}
                                    className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </button>
                                </div>
                                <p className="font-mono text-xs font-bold select-all bg-white/50 dark:bg-black/20 p-2 rounded-xl border border-purple-300/40">
                                  ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥
                                </p>
                                <div className="text-[11px] pt-1 space-y-1 opacity-90">
                                  <p><strong>Shanti Ritual:</strong> {mobileToolResult.vedicRemedies?.shantiPuja}</p>
                                  <p><strong>Rudraksha:</strong> {mobileToolResult.vedicRemedies?.rudraksha}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* RESULT VIEW: PLANETARY YOGAS */}
                          {/* -------------------------------------------------- */}
                          {mobileToolResult.isPlanetaryYogas && (
                            <div className="space-y-3.5">
                              <div className={`p-4 sm:p-5 rounded-3xl border text-center space-y-2 shadow-md ${
                                isDark ? 'bg-gradient-to-br from-amber-950/70 via-[#1c2541] to-amber-900/40 border-amber-500/40' : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/80 border-amber-300'
                              }`}>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400 block">
                                  Total Yogas Identified
                                </span>
                                <div className="text-4xl font-black font-mono text-[#d97706] dark:text-[#fbbf24]">
                                  {mobileToolResult.totalYogasDetected}
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                                    {mobileToolResult.auspiciousCount} Auspicious
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                                    {mobileToolResult.inauspiciousCount} Challenging
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-600 dark:text-gray-300 pt-1 font-medium">
                                  Lagna: <strong>{mobileToolResult.ascendantSign}</strong> • Moon: <strong>{mobileToolResult.moonSign}</strong>
                                </div>
                              </div>

                              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                                {mobileToolResult.yogas?.map((y: any) => (
                                  <div key={y.id} className={`p-3.5 rounded-2xl border space-y-1.5 ${
                                    isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                                  }`}>
                                    <div className="flex justify-between items-center">
                                      <strong className="text-xs font-serif text-slate-900 dark:text-white">{y.name}</strong>
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                        y.nature === 'Challenging' ? 'bg-rose-500/20 text-rose-500 dark:text-rose-300' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                                      }`}>
                                        {y.nature}
                                      </span>
                                    </div>
                                    <p className="text-[11px] leading-relaxed text-slate-700 dark:text-gray-300">{y.prediction}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* RESULT VIEW: VIMSHOTTARI DASHA */}
                          {/* -------------------------------------------------- */}
                          {mobileToolResult.isDashaReport && (
                            <div className="space-y-3.5">
                              <div className={`p-4 sm:p-5 rounded-3xl border text-center space-y-2 shadow-md ${
                                isDark ? 'bg-gradient-to-br from-amber-950/70 via-[#1c2541] to-amber-900/40 border-amber-500/40' : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/80 border-amber-300'
                              }`}>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400 block">
                                  Current Running Mahadasha
                                </span>
                                <h4 className="font-serif font-black text-xl text-slate-900 dark:text-white">
                                  {mobileToolResult.activeDasha?.lord || 'Jupiter (বৃহস্পতি)'}
                                </h4>
                                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 block">
                                  {mobileToolResult.activeDasha?.startDate?.split('T')[0]} → {mobileToolResult.activeDasha?.endDate?.split('T')[0]}
                                </span>
                                {mobileToolResult.moonSign && (
                                  <div className="text-[11px] text-slate-600 dark:text-gray-300 pt-1 font-medium">
                                    Moon: <strong>{mobileToolResult.moonSign}</strong> ({mobileToolResult.nakshatra || 'Rohini'})
                                  </div>
                                )}
                              </div>

                              {/* Antardasha Timeline */}
                              {mobileToolResult.activeDasha?.antardashas && (
                                <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                                }`}>
                                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                                    Sub-Period (Antardasha) Sequence:
                                  </span>
                                  <div className="space-y-2 text-[11px]">
                                    {mobileToolResult.activeDasha.antardashas.slice(0, 5).map((ad: any, idx: number) => (
                                      <div key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                                        isDark ? 'bg-[#1c2541]/70 border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                                      }`}>
                                        <div>
                                          <span className="font-bold text-slate-900 dark:text-white block">{ad.lord}</span>
                                          <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                                            {ad.startDate?.split('T')[0]} → {ad.endDate?.split('T')[0]}
                                          </span>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                          Antar #{idx + 1}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* RESULT VIEW: VEDIC NUMEROLOGY (ANK SHASTRA) */}
                          {/* -------------------------------------------------- */}
                          {mobileToolResult.isNumerologyReport && (
                            <div className="space-y-3.5">
                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div className={`p-3 rounded-2xl border ${
                                  isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                                }`}>
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 block">Moolank</span>
                                  <span className="text-3xl font-black font-mono text-[#d97706] dark:text-[#fbbf24] block mt-1">
                                    {mobileToolResult.core?.moolank}
                                  </span>
                                  <span className="text-[9.5px] font-bold text-slate-600 dark:text-gray-300 block truncate">
                                    {mobileToolResult.core?.moolankPlanet?.split('(')[0]}
                                  </span>
                                </div>
                                <div className={`p-3 rounded-2xl border ${
                                  isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                                }`}>
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 block">Bhagyank</span>
                                  <span className="text-3xl font-black font-mono text-[#d97706] dark:text-[#fbbf24] block mt-1">
                                    {mobileToolResult.core?.bhagyank}
                                  </span>
                                  <span className="text-[9.5px] font-bold text-slate-600 dark:text-gray-300 block truncate">
                                    {mobileToolResult.core?.bhagyankPlanet?.split('(')[0]}
                                  </span>
                                </div>
                                <div className={`p-3 rounded-2xl border ${
                                  isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                                }`}>
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 block">Name No.</span>
                                  <span className="text-3xl font-black font-mono text-[#d97706] dark:text-[#fbbf24] block mt-1">
                                    {mobileToolResult.core?.nameNumber}
                                  </span>
                                  <span className="text-[9.5px] font-bold text-slate-600 dark:text-gray-300 block truncate">
                                    {mobileToolResult.core?.nameNumberPlanet?.split('(')[0]}
                                  </span>
                                </div>
                              </div>

                              {/* Attributes & Lucky Vibrations */}
                              {mobileToolResult.lucky && (
                                <div className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
                                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-white border-slate-200 shadow-2xs'
                                }`}>
                                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                                    Harmonious Numerology Vibrations:
                                  </span>
                                  <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b]">
                                      <span className="text-slate-500 dark:text-gray-400 block">Lucky Numbers:</span>
                                      <strong className="text-amber-600 dark:text-amber-400 font-mono">{mobileToolResult.lucky.numbers?.join(', ')}</strong>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b]">
                                      <span className="text-slate-500 dark:text-gray-400 block">Lucky Days:</span>
                                      <strong className="text-slate-900 dark:text-white">{mobileToolResult.lucky.days?.join(', ')}</strong>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b]">
                                      <span className="text-slate-500 dark:text-gray-400 block">Lucky Gemstone:</span>
                                      <strong className="text-slate-900 dark:text-white">{mobileToolResult.lucky.gemstone}</strong>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b]">
                                      <span className="text-slate-500 dark:text-gray-400 block">Lucky Direction:</span>
                                      <strong className="text-slate-900 dark:text-white">{mobileToolResult.lucky.direction}</strong>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* -------------------------------------------------- */}
                          {/* RESULT VIEW: KUTHI / NATAL KUNDLI */}
                          {/* -------------------------------------------------- */}
                          {mobileToolResult.isKuthiReport && (
                            <div className="space-y-3.5">
                              <div className={`p-4 sm:p-5 rounded-3xl border text-center space-y-2 shadow-md ${
                                isDark ? 'bg-gradient-to-br from-amber-950/70 via-[#1c2541] to-amber-900/40 border-amber-500/40' : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/80 border-amber-300'
                              }`}>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400 block">
                                  Bengali Natal Kundli
                                </span>
                                <h4 className="font-serif font-black text-xl text-slate-900 dark:text-white">
                                  {mobileToolResult.nativeName || 'Native Client'}
                                </h4>
                                <div className="text-xs font-bold text-amber-700 dark:text-amber-300">
                                  Lagna: {mobileToolResult.lagna} • Moon: {mobileToolResult.moonSign}
                                </div>
                                <div className="text-[11px] text-slate-600 dark:text-gray-300 pt-1 font-medium">
                                  Nakshatra: <strong>{mobileToolResult.nakshatra} (Pada {mobileToolResult.pada})</strong>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveToolModal(null);
                                  setActiveTab('charts');
                                }}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                              >
                                <Compass className="w-4 h-4" />
                                <span>Open Full Interactive Bengali Chart →</span>
                              </button>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="space-y-2 pt-1">
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                            >
                              <Download className="w-4 h-4" />
                              <span>Print / Save PDF Report</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setMobileToolResult(null)}
                              className={`w-full py-2.5 rounded-2xl font-bold text-xs border cursor-pointer ${
                                isDark ? 'border-[#3a506b] bg-[#0b132b] text-gray-300' : 'border-slate-300 bg-white text-slate-800'
                              }`}
                            >
                              Calculate Another Profile
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* TOOL 5: LIVE EPHEMERIS & GOCHAR WHEEL */}
                {/* ───────────────────────────────────────────────────────────── */}
                {activeToolModal === 'transit' && (
                  <div className="space-y-3 text-xs font-mono">
                    <p className={`text-[11px] font-sans ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      Live Planetary Ephemeris (Lahiri Ayanamsha ২৪°১০&apos;):
                    </p>
                    <div className={`p-3.5 rounded-2xl border space-y-2 text-[11px] ${
                      isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between">
                        <span className={`font-bold ${isDark ? 'text-[#fbbf24]' : 'text-amber-800'}`}>বৃহস্পতি (Guru):</span>
                        <span className={isDark ? 'text-gray-300' : 'text-slate-800'}>বৃষ ১৮°২২&apos; (Direct)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>শনি (Shani):</span>
                        <span className={isDark ? 'text-gray-300' : 'text-slate-800'}>কুম্ভ ২৪°১৫&apos; (Own House)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>রাহু (Rahu):</span>
                        <span className={isDark ? 'text-gray-300' : 'text-slate-800'}>মীন ১১°০৪&apos;</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveToolModal(null)}
                      className={`w-full py-2.5 rounded-2xl font-bold text-xs mt-2 border cursor-pointer ${
                        isDark ? 'bg-[#0b132b] border-[#3a506b] text-amber-300' : 'bg-slate-100 border-slate-300 text-slate-800'
                      }`}
                    >
                      Close Ephemeris
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* MODAL 4: REAL LIVE CONSULTATION ROOM (VIDEO / AUDIO / ENCRYPTED CHAT) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {activeLiveSessionId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black flex flex-col justify-between"
            >
              <LiveConsultationRoom
                sessionId={activeLiveSessionId}
                currentUserType="ASTROLOGER"
                onClose={() => setActiveLiveSessionId(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
