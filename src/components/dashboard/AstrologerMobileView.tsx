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
    question?: string;
    lagna?: string;
    moonSign?: string;
    gotra?: string;
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

const INITIAL_KUTHI_ORDERS: KuthiOrder[] = [
  {
    id: 'KO-2026-8942',
    clientName: 'Thoibi Ningthoujam',
    serviceType: 'Marriage Matching & Kuthi Yengba',
    status: 'ASSIGNED',
    date: 'Today, 09:40 AM',
    payoutFee: 779,
    clientDetails: {
      sex: 'Female',
      mobile: '+91 98561 88210',
      whatsappNo: '+91 98561 88210',
      email: 'thoibi@example.com',
      dob: '12 Apr 1996',
      tob: '08:30 AM',
      pob: 'Imphal East, Manipur',
      gotra: 'Ningthouja',
      kuthiAttached: true,
      kuthiFileName: 'thoibi_original_kuthi_scan.pdf',
      question: 'Looking for matching with groom born in Kakching. Awaiting Manglik dosh verification and auspicious wedding period in 2026.',
      lagna: 'Vrishabha (বৃষ)',
      moonSign: 'Dhanu (ধনু)',
    },
    lagnaIndex: 1, // Taurus
    navLagnaIndex: 5,
    d1Planets: [
      { name: 'Sun', abbr: 'রবি', houseNumber: 12, signDegree: 28.5 },
      { name: 'Moon', abbr: 'চন্দ্র', houseNumber: 8, signDegree: 14.2 },
      { name: 'Mars', abbr: 'মঙ্গল', houseNumber: 11, signDegree: 22.0 },
      { name: 'Mercury', abbr: 'বুধ', houseNumber: 12, signDegree: 10.4 },
      { name: 'Jupiter', abbr: 'বৃহ', houseNumber: 8, signDegree: 21.0 },
      { name: 'Venus', abbr: 'শুক্র', houseNumber: 1, signDegree: 18.0 },
      { name: 'Saturn', abbr: 'শনি', houseNumber: 11, signDegree: 6.0 },
      { name: 'Rahu', abbr: 'রাহু', houseNumber: 5, signDegree: 23.0 },
      { name: 'Ketu', abbr: 'কেতু', houseNumber: 11, signDegree: 23.0 },
    ],
    d9Planets: [
      { name: 'Sun', abbr: 'রবি', houseNumber: 8, signDegree: 16.0 },
      { name: 'Moon', abbr: 'চন্দ্র', houseNumber: 2, signDegree: 8.0 },
      { name: 'Mars', abbr: 'মঙ্গল', houseNumber: 6, signDegree: 14.0 },
      { name: 'Mercury', abbr: 'বুধ', houseNumber: 10, signDegree: 4.0 },
      { name: 'Jupiter', abbr: 'বৃহ', houseNumber: 1, signDegree: 19.0 },
      { name: 'Venus', abbr: 'শুক্র', houseNumber: 7, signDegree: 25.0 },
      { name: 'Saturn', abbr: 'শনি', houseNumber: 4, signDegree: 12.0 },
      { name: 'Rahu', abbr: 'রাহু', houseNumber: 3, signDegree: 11.0 },
      { name: 'Ketu', abbr: 'কেতু', houseNumber: 9, signDegree: 11.0 },
    ],
  },
  {
    id: 'KO-2026-8941',
    clientName: 'Sanatombi Devi',
    serviceType: 'Career & Dasha Janampatri Analysis',
    status: 'IN_ANALYSIS',
    date: 'Yesterday, 04:15 PM',
    payoutFee: 399,
    clientDetails: {
      sex: 'Female',
      mobile: '+91 98620 99881',
      whatsappNo: '+91 98620 99881',
      email: 'sanatombi@gmail.com',
      dob: '24 Oct 1998',
      tob: '09:45 AM',
      pob: 'Imphal West, Manipur',
      gotra: 'Khuman',
      kuthiAttached: true,
      kuthiFileName: 'sanatombi_birth_kuthi.jpg',
      question: 'Government recruitment exam upcoming in November. Requesting planetary remedies for Rahu-Saturn transit and career gemstone guidance.',
      lagna: 'Vrischika (বৃশ্চিক)',
      moonSign: 'Vrishabha (বৃষ)',
    },
    lagnaIndex: 7, // Scorpio
    navLagnaIndex: 3,
    d1Planets: [
      { name: 'Sun', abbr: 'রবি', houseNumber: 7, signDegree: 7.2 },
      { name: 'Moon', abbr: 'চন্দ্র', houseNumber: 2, signDegree: 28.6 },
      { name: 'Mars', abbr: 'মঙ্গল', houseNumber: 6, signDegree: 21.1 },
      { name: 'Mercury', abbr: 'বুধ', houseNumber: 7, signDegree: 14.5 },
      { name: 'Jupiter', abbr: 'বৃহ', houseNumber: 12, signDegree: 29.2 },
      { name: 'Venus', abbr: 'শুক্র', houseNumber: 6, signDegree: 12.4 },
      { name: 'Saturn', abbr: 'শনি', houseNumber: 1, signDegree: 6.5, isRetrograde: true },
      { name: 'Rahu', abbr: 'রাহু', houseNumber: 5, signDegree: 14.2 },
      { name: 'Ketu', abbr: 'কেতু', houseNumber: 11, signDegree: 14.2 },
    ],
    d9Planets: [
      { name: 'Sun', abbr: 'রবি', houseNumber: 9, signDegree: 12.0 },
      { name: 'Moon', abbr: 'চন্দ্র', houseNumber: 4, signDegree: 22.3 },
      { name: 'Mars', abbr: 'মঙ্গল', houseNumber: 1, signDegree: 18.5 },
      { name: 'Mercury', abbr: 'বুধ', houseNumber: 7, signDegree: 9.8 },
      { name: 'Jupiter', abbr: 'বৃহ', houseNumber: 11, signDegree: 14.0 },
      { name: 'Venus', abbr: 'শুক্র', houseNumber: 2, signDegree: 26.1 },
      { name: 'Saturn', abbr: 'শনি', houseNumber: 5, signDegree: 11.2 },
      { name: 'Rahu', abbr: 'রাহু', houseNumber: 8, signDegree: 4.1 },
      { name: 'Ketu', abbr: 'কেতু', houseNumber: 2, signDegree: 4.1 },
    ],
  },
  {
    id: 'KO-2026-8940',
    clientName: 'Heikrujam Premkumar',
    serviceType: 'Comprehensive Janampatri Kuthi Iba',
    status: 'COMPLETED',
    date: 'Sep 3, 11:05 PM',
    payoutFee: 999,
    clientDetails: {
      sex: 'Male',
      mobile: '+91 98620 99881',
      whatsappNo: '+91 98620 99881',
      email: 'premkumar@outlook.com',
      dob: '18 Nov 1987',
      tob: '11:05 PM',
      pob: 'Moirang, Manipur',
      gotra: 'Luwang',
      kuthiAttached: false,
      question: 'Full 14-page handwritten Kuthi report dispatched with detailed Mahadasha timeline and Navagraha remedies.',
      lagna: 'Dhanu (ধনু)',
      moonSign: 'Mithuna (মিথুন)',
    },
    lagnaIndex: 8, // Sagittarius
    navLagnaIndex: 2,
    d1Planets: [
      { name: 'Sun', abbr: 'রবি', houseNumber: 8, signDegree: 2.5 },
      { name: 'Moon', abbr: 'চন্দ্র', houseNumber: 3, signDegree: 18.2 },
      { name: 'Mars', abbr: 'মঙ্গল', houseNumber: 7, signDegree: 14.1 },
      { name: 'Mercury', abbr: 'বুধ', houseNumber: 8, signDegree: 22.0 },
      { name: 'Jupiter', abbr: 'বৃহ', houseNumber: 1, signDegree: 26.5 },
      { name: 'Venus', abbr: 'শুক্র', houseNumber: 9, signDegree: 9.3 },
      { name: 'Saturn', abbr: 'শনি', houseNumber: 8, signDegree: 28.0 },
      { name: 'Rahu', abbr: 'রাহু', houseNumber: 12, signDegree: 6.2 },
      { name: 'Ketu', abbr: 'কেতু', houseNumber: 6, signDegree: 6.2 },
    ],
    d9Planets: [
      { name: 'Sun', abbr: 'রবি', houseNumber: 5, signDegree: 12.0 },
      { name: 'Moon', abbr: 'চন্দ্র', houseNumber: 11, signDegree: 8.0 },
      { name: 'Mars', abbr: 'মঙ্গল', houseNumber: 3, signDegree: 21.0 },
      { name: 'Mercury', abbr: 'বুধ', houseNumber: 9, signDegree: 15.0 },
      { name: 'Jupiter', abbr: 'বৃহ', houseNumber: 7, signDegree: 2.0 },
      { name: 'Venus', abbr: 'শুক্র', houseNumber: 1, signDegree: 14.0 },
      { name: 'Saturn', abbr: 'শনি', houseNumber: 6, signDegree: 29.0 },
      { name: 'Rahu', abbr: 'রাহু', houseNumber: 4, signDegree: 11.0 },
      { name: 'Ketu', abbr: 'কেতু', houseNumber: 10, signDegree: 11.0 },
    ],
  }
];

const INITIAL_LIVE_CALLS: LiveCallAppointment[] = [
  {
    id: 'call-live-1',
    clientName: 'Nongthombam Rajesh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    phone: '+91 97740 33411',
    mode: 'VIDEO',
    durationMinutes: 30,
    scheduledTime: 'Live Now · Waiting',
    fee: 525,
    status: 'WAITING',
    topic: 'Business Timing & Yellow Sapphire Guidance',
  },
  {
    id: 'call-live-2',
    clientName: 'Laishram Memcha',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    phone: '+91 98561 77122',
    mode: 'VOICE',
    durationMinutes: 15,
    scheduledTime: 'Today, 04:30 PM',
    fee: 350,
    status: 'WAITING',
    topic: 'Birth Time Rectification & Health Query',
  },
];

export default function AstrologerMobileDashboard() {
  // Theme state matching desktop version (defaults to 'light', synced with localStorage)
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('astro_theme') as 'dark' | 'light';
    if (saved) setTheme(saved);
  }, []);

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

  // Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(14850);

  // Real consultation polling from /api/consultations for Live Call tab
  const [dbConsultations, setDbConsultations] = useState<any[]>([]);

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
          astrologerName: 'Acharya Tombi Sharma',
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
          astrologerName: 'Acharya Tombi Sharma',
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
      isDark ? 'bg-[#070c1a] text-[#faf8f4]' : 'bg-[#faf8f5] text-[#0f172a]'
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
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80"
                  alt="Acharya Tombi"
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
                <h1 className="text-xs font-serif font-bold tracking-wide text-slate-900 dark:text-white">Acharya Tombi</h1>
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
              <span>KangleiAstro</span>
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
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900 border-2 border-amber-500 rounded-3xl max-w-[380px] w-full p-5 text-slate-100 shadow-2xl text-center space-y-4 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500 animate-pulse" />

                <div className="w-16 h-16 bg-amber-500/20 text-amber-400 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-500/10 animate-bounce">
                  {incomingSession.mode === 'CALL' ? <Phone className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                    🔔 INCOMING CONSULTATION REQUEST
                  </span>
                  <h3 className="font-serif font-bold text-xl text-slate-100">
                    {incomingSession.clientName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Requested {incomingSession.durationMinutes || 15} Mins {incomingSession.mode === 'CALL' ? 'Voice Call' : 'Live Chat'} (₹{incomingSession.totalFee || 525} Fee)
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Client Mobile:</span>
                    <span className="font-mono text-amber-300">{incomingSession.clientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gender / DOB:</span>
                    <span className="text-slate-200">{incomingSession.clientGender || 'Client'} · {incomingSession.clientDob || 'N/A'}</span>
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
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 font-bold text-xs border border-slate-700 transition cursor-pointer"
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
                    Imphal · 24.8°N
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
                          {item.value}
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
                    <h3 className="text-xs font-serif font-bold">Kuthi Order Hub</h3>
                    <p className="text-[10px] opacity-70 leading-tight">
                      Client birth documents, Kuthi matching, & report delivery (No Live Call)
                    </p>
                  </div>
                  <div className="pt-2 flex items-center text-[10px] font-bold text-[#d97706] dark:text-[#fbbf24]">
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
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <Video className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold animate-pulse">
                        LIVE
                      </span>
                    </div>
                    <h3 className="text-xs font-serif font-bold">Live Call & Chat</h3>
                    <p className="text-[10px] opacity-70 leading-tight">
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

                <div className="grid grid-cols-4 gap-2.5">
                  <button
                    onClick={() => setActiveToolModal('kundali')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-sm ${
                      isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600/30 to-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[#d97706] dark:text-[#fbbf24]">
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">
                      New Kundli
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveToolModal('dasha')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-sm ${
                      isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-yellow-600/30 to-amber-600/20 border border-yellow-500/40 flex items-center justify-center text-amber-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">
                      Dasha Calc
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveToolModal('matchmaking')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-sm ${
                      isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600/30 to-amber-600/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
                      <Flame className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">
                      Matching
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveToolModal('transit')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border active:scale-95 transition-all cursor-pointer shadow-sm ${
                      isDark ? 'bg-[#1c2541]/80 hover:bg-[#1c2541] border-[#3a506b]/60' : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-amber-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">
                      Ephemeris
                    </span>
                  </button>
                </div>
              </section>

              {/* Quick Summary Cards (Matching Desktop Version) */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-[10px] opacity-70 block">Kuthi Orders</span>
                  <strong className="text-base font-serif font-bold text-[#b45309] dark:text-[#fbbf24]">{kuthiOrders.length}</strong>
                </div>
                <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-[10px] opacity-70 block">Live Call Queue</span>
                  <strong className="text-base font-serif font-bold text-emerald-500">{liveAppointments.length}</strong>
                </div>
                <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-[10px] opacity-70 block">Wallet Payout</span>
                  <strong className="text-base font-mono font-bold text-green-500">₹{walletBalance.toLocaleString()}</strong>
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
                    <div className={`p-2.5 rounded-xl border text-[10px] space-y-1 ${
                      isDark ? 'bg-[#0b132b]/80 border-[#3a506b]/50' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between">
                        <span className="opacity-70">জন্ম তারিখ / সময়:</span>
                        <span className="font-mono font-bold">{order.clientDetails.dob} · {order.clientDetails.tob}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">জন্মস্থান (POB):</span>
                        <span className="font-medium truncate max-w-[190px]">{order.clientDetails.pob}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Paper Kuthi:</span>
                        {order.clientDetails.kuthiAttached ? (
                          <span className="text-amber-600 dark:text-amber-300 font-bold flex items-center gap-1">
                            <Paperclip className="w-3 h-3 text-[#d97706]" />
                            <span className="truncate max-w-[170px]">{order.clientDetails.kuthiFileName}</span>
                          </span>
                        ) : (
                          <span className="opacity-60 italic">Birth Details Mode</span>
                        )}
                      </div>
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
                      <div className="flex items-center gap-1.5">
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

                        <a
                          href={`https://wa.me/${order.clientDetails.whatsappNo.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                          title="WhatsApp Text"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
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
                    Conduct live 1-on-1 chats and voice/video consultations directly inside KangleiAstro.
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
                              <span className="text-slate-500">Contact: {phone}</span>
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
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80"
                    alt="Acharya Tombi"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-serif font-bold flex items-center justify-center gap-1.5">
                    <span>Acharya Tombi Sharma</span>
                    <ShieldCheck className="w-4 h-4 text-[#d97706] dark:text-[#fbbf24]" />
                  </h2>
                  <p className="text-[11px] font-semibold text-[#b45309] dark:text-[#fbbf24]">Master Vedic Astrologer & Kuthi Specialist</p>
                  <p className="text-[10px] opacity-70 mt-0.5">15+ Years Experience · 50k+ Kuthi Consultations</p>
                </div>

                <div className={`grid grid-cols-3 gap-2 pt-2 border-t text-center text-xs ${
                  isDark ? 'border-[#3a506b]/50' : 'border-slate-200'
                }`}>
                  <div>
                    <span className="text-[10px] opacity-70 block">Rating</span>
                    <span className="font-extrabold text-[#d97706] dark:text-[#fbbf24] flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" /> 5.0
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-70 block">Live Call</span>
                    <span className="font-extrabold font-mono">₹35/min</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-70 block">Kuthi Yengba</span>
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
                  <span className="text-[11px] opacity-70">80% Share Earned</span>
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
                  {/* Birth Specs */}
                  <div className={`p-3 rounded-2xl border space-y-1.5 ${
                    isDark ? 'bg-[#0b132b]/80 border-[#3a506b]/50' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex justify-between">
                      <span className="opacity-70">Client Name:</span>
                      <span className="font-bold">{inspectingKuthi.clientName} ({inspectingKuthi.clientDetails.sex})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Mobile / WhatsApp:</span>
                      <span className="font-mono text-amber-500 font-bold">{inspectingKuthi.clientDetails.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Date of Birth:</span>
                      <span className="font-mono font-bold">{inspectingKuthi.clientDetails.dob}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Time of Birth:</span>
                      <span className="font-mono font-bold">{inspectingKuthi.clientDetails.tob}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Place of Birth:</span>
                      <span className="font-medium">{inspectingKuthi.clientDetails.pob}</span>
                    </div>
                    {inspectingKuthi.clientDetails.gotra && (
                      <div className="flex justify-between">
                        <span className="opacity-70">Gotra (সালয়):</span>
                        <span className="font-bold">{inspectingKuthi.clientDetails.gotra}</span>
                      </div>
                    )}
                  </div>

                  {/* Paper Kuthi Attachment */}
                  {inspectingKuthi.clientDetails.kuthiAttached && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-[#b45309] dark:text-[#fbbf24] flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Attached Paper Kuthi Document</span>
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold">{inspectingKuthi.clientDetails.kuthiFileName}</span>
                        <button
                          onClick={() => alert(`Downloading ${inspectingKuthi.clientDetails.kuthiFileName} for offline inspection`)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-[10px] shadow"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Query */}
                  {inspectingKuthi.clientDetails.question && (
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-[#3a506b]/40 space-y-1">
                      <span className="text-[10px] uppercase font-bold opacity-70 block">Client&apos;s Specific Inquiries:</span>
                      <p className="text-[11px] leading-relaxed opacity-90">{inspectingKuthi.clientDetails.question}</p>
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
                <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-[#3a506b]">
                  <div>
                    <span className="text-[10px] font-mono text-[#b45309] dark:text-[#fbbf24] font-bold block">
                      Deliver Kuthi Consultation
                    </span>
                    <h3 className="text-sm font-serif font-bold">
                      Upload Report for {uploadingKuthi.clientName}
                    </h3>
                  </div>
                  <button
                    onClick={() => setUploadingKuthi(null)}
                    className="p-1 rounded-full bg-slate-200/60 dark:bg-[#0b132b]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {uploadSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-300">
                      Report Delivered Successfully!
                    </h4>
                    <p className="text-xs opacity-80">
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
                      <label className="block text-[10px] font-bold opacity-80 mb-1">
                        Select PDF / Scanned Kuthi Report File *
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => setUploadFile(e.target.files?.[0]?.name || 'kuthi_report.pdf')}
                        className={`w-full p-2.5 rounded-xl border text-xs cursor-pointer ${
                          isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-300'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold opacity-80 mb-1">
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

                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex justify-between items-center text-[11px]">
                      <span className="opacity-80">Payout Upon Delivery:</span>
                      <strong className="text-emerald-500 font-mono font-bold">+₹{uploadingKuthi.payoutFee}</strong>
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
                className={`w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto border ${
                  isDark ? 'bg-[#1c2541] border-[#3a506b] text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-[#3a506b]">
                  <span className="text-xs font-serif font-bold flex items-center gap-2 text-[#b45309] dark:text-[#fbbf24]">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {activeToolModal === 'kundali' && 'Instant Bengali Kundli Generator'}
                      {activeToolModal === 'dasha' && 'Vimshottari Dasha Calculator'}
                      {activeToolModal === 'matchmaking' && 'Ashtakoota 36-Gun Milan Matching'}
                      {activeToolModal === 'transit' && 'Live Ephemeris & Gochar Wheel'}
                    </span>
                  </span>
                  <button
                    onClick={() => setActiveToolModal(null)}
                    className="p-1 rounded-full bg-slate-200/60 dark:bg-[#0b132b]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {activeToolModal === 'kundali' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold opacity-80 mb-1">Native Full Name *</label>
                      <input
                        type="text"
                        defaultValue="Sanatombi Devi"
                        className={`w-full h-10 px-3 rounded-xl border focus:outline-none ${
                          isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold opacity-80 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          defaultValue="1998-10-24"
                          className={`w-full h-10 px-3 rounded-xl border font-mono ${
                            isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold opacity-80 mb-1">Time of Birth</label>
                        <input
                          type="time"
                          defaultValue="09:45"
                          className={`w-full h-10 px-3 rounded-xl border font-mono ${
                            isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold opacity-80 mb-1">Place of Birth</label>
                      <input
                        type="text"
                        defaultValue="Imphal West, Manipur"
                        className={`w-full h-10 px-3 rounded-xl border ${
                          isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => {
                        setActiveToolModal(null);
                        setActiveTab('charts');
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold shadow-md mt-2 cursor-pointer"
                    >
                      Generate Bengali Kundli →
                    </button>
                  </div>
                )}

                {activeToolModal === 'dasha' && (
                  <div className="space-y-2 text-xs">
                    <p className="text-[11px] opacity-80">Current Vimshottari Mahadasha timeline for native:</p>
                    <div className={`p-3 rounded-xl border space-y-2 font-mono text-[11px] ${
                      isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between text-[#b45309] dark:text-[#fbbf24] font-bold">
                        <span>বৃহস্পতি মহাদশা (Jupiter)</span>
                        <span>২০১৫ – ২০৩১ (১৬ বছর)</span>
                      </div>
                      <div className="pl-3 border-l-2 border-amber-500/50 space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>অন্তর্দশা: শনি (Saturn)</span>
                          <span>২০২৪ – ২০২৭</span>
                        </div>
                        <div className="flex justify-between opacity-70 text-[10px]">
                          <span>প্রত্যন্তর: বুধ (Mercury)</span>
                          <span>আগস্ট ২০২৬ – জানু ২০২৭</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveToolModal(null)}
                      className={`w-full py-2 rounded-xl font-bold text-xs mt-2 border cursor-pointer ${
                        isDark ? 'bg-[#0b132b] border-[#3a506b] text-amber-300' : 'bg-slate-100 border-slate-300 text-slate-800'
                      }`}
                    >
                      Close Window
                    </button>
                  </div>
                )}

                {activeToolModal === 'matchmaking' && (
                  <div className="space-y-3 text-xs">
                    <div className={`p-3 rounded-xl border text-center ${
                      isDark ? 'bg-gradient-to-br from-[#1c2541] to-[#0b132b] border-amber-500/40' : 'bg-amber-50 border-amber-300'
                    }`}>
                      <span className="text-[10px] text-[#b45309] dark:text-[#fbbf24] uppercase font-bold block">অষ্টকূট গুণ মিলন (36-Gun Score)</span>
                      <span className="text-3xl font-black font-mono">২৯ / ৩৬</span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">উত্তম মিলন (Shubh Milan - Compatible)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#0b132b] border-[#3a506b]/40' : 'bg-slate-50 border-slate-200'}`}>নাড়ী কূট: ৮/৮</div>
                      <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#0b132b] border-[#3a506b]/40' : 'bg-slate-50 border-slate-200'}`}>ভকূট: ৭/৭</div>
                      <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#0b132b] border-[#3a506b]/40' : 'bg-slate-50 border-slate-200'}`}>গণ কূট: ৬/৬</div>
                      <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#0b132b] border-[#3a506b]/40' : 'bg-slate-50 border-slate-200'}`}>মৈত্রী কূট: ৫/৫</div>
                    </div>
                    <button
                      onClick={() => setActiveToolModal(null)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-bold text-xs mt-2 cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}

                {activeToolModal === 'transit' && (
                  <div className="space-y-2 text-xs font-mono">
                    <p className="text-[11px] font-sans opacity-80">Live Planetary Ephemeris (Lahiri Ayanamsha ২৪°১০&apos;):</p>
                    <div className={`p-2.5 rounded-xl border space-y-1.5 text-[11px] ${
                      isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between">
                        <span className="font-bold text-[#b45309] dark:text-[#fbbf24]">বৃহস্পতি (Guru):</span>
                        <span>বৃষ ১৮°২২&apos; (Direct)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-amber-600 dark:text-amber-300">শনি (Shani):</span>
                        <span>কুম্ভ ২৪°১৫&apos; (Own House)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">রাহু (Rahu):</span>
                        <span>মীন ১১°০৪&apos;</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveToolModal(null)}
                      className={`w-full py-2 rounded-xl font-bold text-xs mt-2 border cursor-pointer ${
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
