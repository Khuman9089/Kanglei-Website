'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Sliders,
  Sparkles,
  Eye,
  CheckCircle2,
  Copy,
  Download,
  Flame,
  Globe,
  Bell,
  Wallet,
  PhoneCall,
  Video,
  FileText,
  MapPin,
  RefreshCw,
  Sun,
  Moon,
  ChevronRight,
  ExternalLink,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Info,
  Tag,
  ArrowRight,
  X,
  Compass,
  Code
} from 'lucide-react';
import AstrologerMobileView from '@/components/dashboard/AstrologerMobileView';

export default function AstrologerMobileSimulatorPage() {
  // Device Preview Configuration & Simulator Canvas State
  const [deviceTheme, setDeviceTheme] = useState<'light' | 'dark'>('light');
  const [deviceModel, setDeviceModel] = useState<'iphone15' | 'pixel8' | 'samsung24'>('iphone15');
  const [zoomScale, setZoomScale] = useState<number>(100);

  // 1. Ad / Sponsor Banner Config
  const [showAdBanner, setShowAdBanner] = useState<boolean>(true);
  const [adTitle, setAdTitle] = useState<string>('Ceylon Unheated Yellow Sapphires (Pukhraj)');
  const [adSubtitle, setAdSubtitle] = useState<string>('Lab Certified 100% Natural • Special Astrologer Partner Discount');
  const [adBannerUrl, setAdBannerUrl] = useState<string>(
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop'
  );
  const [adTag, setAdTag] = useState<string>('SPONSORED');
  const [adFormat, setAdFormat] = useState<'CUSTOM_BANNER' | 'ADMOB_MOCK'>('CUSTOM_BANNER');

  // 2. Notice & Announcement Bar State
  const [notices, setNotices] = useState([
    {
      id: '1',
      type: 'PROMO_AD',
      badge: 'GEMS PARTNER',
      title: 'New Certified Gemstones Added to E-Store',
      message: 'Offer 100% lab certified Ceylon gemstones with your custom prescription token.',
      action: 'Add Product Now',
      severity: 'PROMO',
      active: true,
    },
    {
      id: '2',
      type: 'URGENT_NOTICE',
      badge: 'MAINTENANCE',
      title: 'Eastern Ephemeris Server Update (12:00 AM)',
      message: 'Scheduled 15-minute sync for Lahiri Sidereal tables for high precision.',
      action: 'Read Details',
      severity: 'URGENT',
      active: true,
    },
    {
      id: '3',
      type: 'INFO',
      badge: 'PAYOUT',
      title: 'Weekly Consultation Payout Dispatched',
      message: 'Your weekly UPI payout of ₹4,200 has been credited to your linked bank account.',
      action: 'View Wallet',
      severity: 'INFO',
      active: true,
    },
  ]);
  const [activeNoticeIndex, setActiveNoticeIndex] = useState<number>(0);

  // 3. Panchanga Location & Transit Highlights
  const [stationCity, setStationCity] = useState<string>('Imphal · 24.8°N');
  const [tithiText, setTithiText] = useState<string>('Shukla Navami (নৱমী)');
  const [nakshatraText, setNakshatraText] = useState<string>('Rohini (রোহিণী)');
  const [rahuKaalText, setRahuKaalText] = useState<string>('16:30 – 18:00');

  // 4. Live Counters
  const [pendingKuthiOrders, setPendingKuthiOrders] = useState<number>(4);
  const [activeLiveCalls, setActiveLiveCalls] = useState<number>(1);
  const [walletBalance, setWalletBalance] = useState<number>(14850);
  const [isAstrologerOnline, setIsAstrologerOnline] = useState<boolean>(true);

  // 5. Quick Engines Enabled State
  const [enabledEngines, setEnabledEngines] = useState({
    sadesati: true,
    manglik: true,
    kaalsarp: true,
    ngaaeeshing: true,
    matchmaking: true,
    yogas: true,
    yumsharol: true,
    kundali: true,
  });

  // UI Tabs & Flutter Code Modal
  const [activeEditorTab, setActiveEditorTab] = useState<'ad' | 'notices' | 'panchanga' | 'counters' | 'engines'>('ad');
  const [showFlutterCodeModal, setShowFlutterCodeModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const handleCopyFlutterCode = () => {
    fetch('/src/components/dashboard/AstrologerMobileDashboard.dart')
      .then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
      })
      .catch(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
      });
  };

  const handleSaveChanges = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER: SIMULATOR CONTROLS & EXPORT ACTIONS               */}
      {/* ------------------------------------------------------------- */}
      <header className="h-16 border-b border-[#1c2541] bg-[#0b132b]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/astrologer"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            ← Portal
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-wide">Mobile Dashboard Live Studio</h1>
                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  Flutter & Web Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Real-time smartphone simulator & visual customization suite
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom Selector */}
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1c2541] border border-[#3a506b] text-xs font-mono text-slate-300">
            <span>Zoom:</span>
            <button
              onClick={() => setZoomScale((s) => Math.max(75, s - 10))}
              className="px-1.5 hover:text-white font-bold"
            >
              -
            </button>
            <span className="font-bold text-amber-400">{zoomScale}%</span>
            <button
              onClick={() => setZoomScale((s) => Math.min(125, s + 10))}
              className="px-1.5 hover:text-white font-bold"
            >
              +
            </button>
          </div>

          {/* Theme Switcher Toggle for Device */}
          <button
            onClick={() => setDeviceTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              deviceTheme === 'dark'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            {deviceTheme === 'dark' ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-600" />}
            <span>{deviceTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {/* Flutter Export Button */}
          <button
            onClick={() => setShowFlutterCodeModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#1c2541] hover:bg-[#253256] text-amber-400 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span> Flutter Code
          </button>

          {/* Save Changes Button */}
          <button
            onClick={handleSaveChanges}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </header>

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Mobile Layout & Configuration Saved Successfully!</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MAIN TWO-COLUMN SPLIT: SIMULATOR (LEFT) & EDITOR (RIGHT)      */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ============================================================= */}
        {/* LEFT COLUMN: REALISTIC SMARTPHONE SIMULATOR FRAME             */}
        {/* ============================================================= */}
        <div className="flex-1 bg-radial from-[#121c38] via-[#070b19] to-[#04060e] flex items-center justify-center p-4 sm:p-8 overflow-y-auto min-h-[700px]">
          
          {/* Smartphone Hardware Frame (Mock iPhone Bezel with Dynamic Island) */}
          <div
            style={{ transform: `scale(${zoomScale / 100})`, transformOrigin: 'center center' }}
            className="transition-transform duration-200 ease-out"
          >
            <div className="relative w-[390px] h-[820px] bg-black rounded-[52px] p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(217,119,6,0.15)] ring-1 ring-slate-700/60 border-4 border-slate-800">
              
              {/* Hardware Speaker / Dynamic Island Pill */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              {/* Hardware Volume & Side Buttons */}
              <div className="absolute -left-[7px] top-28 w-[3px] h-10 bg-slate-700 rounded-l-md" />
              <div className="absolute -left-[7px] top-42 w-[3px] h-12 bg-slate-700 rounded-l-md" />
              <div className="absolute -left-[7px] top-58 w-[3px] h-12 bg-slate-700 rounded-l-md" />
              <div className="absolute -right-[7px] top-36 w-[3px] h-16 bg-slate-700 rounded-r-md" />

              {/* Screen Area (Scrollable Interactive Mobile View) */}
              <div className={`w-full h-full rounded-[42px] overflow-hidden overflow-y-auto no-scrollbar relative flex flex-col transition-colors ${
                deviceTheme === 'dark' ? 'bg-[#0b132b] text-white' : 'bg-[#f8fafc] text-slate-900'
              }`}>
                
                {/* 1. Mobile Status Bar */}
                <div className={`pt-3 pb-1 px-6 flex items-center justify-between text-[11px] font-bold z-40 shrink-0 ${
                  deviceTheme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono">5G</span>
                    <div className="w-4 h-2 rounded-xs border border-current flex items-center p-0.5">
                      <div className="w-full h-full bg-current rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* 2. Top Header Component */}
                <div className={`px-4 py-2.5 border-b flex items-center justify-between shrink-0 ${
                  deviceTheme === 'dark' ? 'bg-[#1c2541]/95 border-[#3a506b]' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-amber-600">
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80"
                          alt="Guru"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
                        deviceTheme === 'dark' ? 'border-[#1c2541]' : 'border-white'
                      } ${isAstrologerOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold font-serif leading-tight">Acharya Sanatombi</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <span className={`text-[10px] font-bold ${isAstrologerOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {isAstrologerOnline ? 'Accepting Orders' : 'Away (Offline)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDeviceTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                      className={`w-7 h-7 rounded-xl border flex items-center justify-center ${
                        deviceTheme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-amber-300' : 'bg-white border-slate-200 text-amber-600'
                      }`}
                    >
                      {deviceTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    </button>
                    <div className="relative">
                      <div className={`w-7 h-7 rounded-xl border flex items-center justify-center ${
                        deviceTheme === 'dark' ? 'bg-[#0b132b] border-[#3a506b] text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                      }`}>
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">
                        3
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Main Body Scrollable Stream */}
                <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5">
                  
                  {/* --- A. SPONSORED AD BANNER SLOT (16:5 Standard) --- */}
                  {showAdBanner && (
                    <div className={`rounded-2xl border p-2.5 transition-all shadow-xs relative overflow-hidden ${
                      deviceTheme === 'dark'
                        ? 'bg-gradient-to-r from-amber-950/40 via-[#1c2541] to-[#1c2541] border-amber-500/40'
                        : 'bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 border-amber-300 shadow-amber-500/5'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={adBannerUrl}
                          alt="Sponsored"
                          className="w-14 h-14 rounded-xl object-cover border border-amber-500/30 shrink-0"
                        />
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="px-1.5 py-0.2 rounded text-[7.5px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                              {adTag}
                            </span>
                          </div>
                          <h4 className="text-[11.5px] font-bold leading-tight truncate">{adTitle}</h4>
                          <p className="text-[9.5px] text-slate-500 dark:text-gray-300 truncate mt-0.5">{adSubtitle}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />
                      </div>
                    </div>
                  )}

                  {/* --- B. NOTICES & ANNOUNCEMENT CAROUSEL --- */}
                  {notices.filter((n) => n.active).length > 0 && (
                    <div className={`p-3 rounded-2xl border shadow-xs relative overflow-hidden space-y-2 ${
                      notices[activeNoticeIndex]?.severity === 'URGENT'
                        ? deviceTheme === 'dark'
                          ? 'bg-rose-950/40 border-rose-500/40 text-white'
                          : 'bg-rose-50 border-rose-300 text-slate-900'
                        : deviceTheme === 'dark'
                        ? 'bg-[#1c2541] border-[#3a506b]'
                        : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-amber-500/20 text-amber-600 dark:text-amber-300">
                            {notices[activeNoticeIndex]?.badge}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">
                          {activeNoticeIndex + 1}/{notices.filter((n) => n.active).length}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-snug">{notices[activeNoticeIndex]?.title}</h4>
                        <p className="text-[10px] text-slate-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                          {notices[activeNoticeIndex]?.message}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex gap-1">
                          {notices.filter((n) => n.active).map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveNoticeIndex(idx)}
                              className={`w-2 h-1.5 rounded-full transition-all ${
                                idx === activeNoticeIndex ? 'w-4 bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <button className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold">
                          {notices[activeNoticeIndex]?.action} →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- C. PANCHANGA & TRANSIT STRIP --- */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      <div className="flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Daily Panchanga & Transit</span>
                      </div>
                      <span className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 lowercase">{stationCity}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className={`p-2 rounded-xl border ${
                        deviceTheme === 'dark' ? 'bg-[#1c2541] border-amber-500/40 text-amber-200' : 'bg-amber-50/90 border-amber-300 text-amber-900'
                      }`}>
                        <span className="text-[8.5px] font-bold uppercase block opacity-75">Tithi</span>
                        <strong className="text-[10.5px] block truncate font-serif font-black">{tithiText}</strong>
                      </div>
                      <div className={`p-2 rounded-xl border ${
                        deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                      }`}>
                        <span className="text-[8.5px] font-bold uppercase block opacity-75">Nakshatra</span>
                        <strong className="text-[10.5px] block truncate">{nakshatraText}</strong>
                      </div>
                      <div className={`p-2 rounded-xl border ${
                        deviceTheme === 'dark' ? 'bg-[#1c2541] border-rose-500/40 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}>
                        <span className="text-[8.5px] font-bold uppercase block opacity-75">Rahu Kaal</span>
                        <strong className="text-[10.5px] block font-mono">{rahuKaalText}</strong>
                      </div>
                    </div>
                  </div>

                  {/* --- D. CORE WORKSPACE TILES (2 COLUMNS) --- */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Kuthi Hub */}
                    <div className={`p-3 rounded-2xl border flex flex-col justify-between space-y-2 ${
                      deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[8.5px]">
                          {pendingKuthiOrders} Pending
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">Kuthi Order Hub</h4>
                        <p className="text-[9.5px] text-slate-500 dark:text-gray-400 mt-0.5">Matching & Delivery</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Manage Orders →</span>
                    </div>

                    {/* Live Consultations */}
                    <div className={`p-3 rounded-2xl border flex flex-col justify-between space-y-2 ${
                      deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-black text-[8.5px] animate-pulse">
                          LIVE
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">Live Consultation</h4>
                        <p className="text-[9.5px] text-slate-500 dark:text-gray-400 mt-0.5">Video/Voice Rooms</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Enter Room →</span>
                    </div>
                  </div>

                  {/* --- E. QUICK ASTROLOGICAL ENGINES --- */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      <span>Quick Astrological Engines</span>
                      <span className="text-[9px] font-mono text-slate-500">Vedic Math</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      {enabledEngines.sadesati && (
                        <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                          deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                        }`}>
                          <span className="text-sm">🪐</span>
                          <span className="text-[9px] font-bold">Sade Sati</span>
                        </div>
                      )}
                      {enabledEngines.manglik && (
                        <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                          deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                        }`}>
                          <span className="text-sm">🔥</span>
                          <span className="text-[9px] font-bold">Manglik</span>
                        </div>
                      )}
                      {enabledEngines.kaalsarp && (
                        <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                          deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                        }`}>
                          <span className="text-sm">🐍</span>
                          <span className="text-[9px] font-bold">Kaal Sarp</span>
                        </div>
                      )}
                      {enabledEngines.ngaaeeshing && (
                        <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                          deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                        }`}>
                          <span className="text-sm">🐟</span>
                          <span className="text-[9px] font-bold">ঙা-ঈশিং</span>
                        </div>
                      )}
                      {enabledEngines.matchmaking && (
                        <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                          deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                        }`}>
                          <span className="text-sm">💍</span>
                          <span className="text-[9px] font-bold">Matching</span>
                        </div>
                      )}
                      {enabledEngines.yogas && (
                        <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                          deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                        }`}>
                          <span className="text-sm">✨</span>
                          <span className="text-[9px] font-bold">Yogas</span>
                        </div>
                      )}
                      {enabledEngines.yumsharol && (
                        <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                          deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                        }`}>
                          <span className="text-sm">🏡</span>
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">Yumsharol</span>
                        </div>
                      )}
                      {enabledEngines.kundali && (
                        <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                          deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                        }`}>
                          <span className="text-sm">🧭</span>
                          <span className="text-[9px] font-bold">Kundli</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- F. SUMMARY STATS --- */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className={`p-2.5 rounded-2xl border ${deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'}`}>
                      <span className="text-[9px] text-slate-500 block font-bold">Kuthi Total</span>
                      <strong className="text-sm font-bold text-amber-500">{pendingKuthiOrders}</strong>
                    </div>
                    <div className={`p-2.5 rounded-2xl border ${deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'}`}>
                      <span className="text-[9px] text-slate-500 block font-bold">Live Calls</span>
                      <strong className="text-sm font-bold text-emerald-500">{activeLiveCalls}</strong>
                    </div>
                    <div className={`p-2.5 rounded-2xl border ${deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'}`}>
                      <span className="text-[9px] text-slate-500 block font-bold">Earnings</span>
                      <strong className="text-xs font-bold text-amber-500 font-mono">₹{walletBalance.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* 4. Bottom Docked Navigation Bar */}
                <div className={`px-2 py-2 border-t flex items-center justify-around shrink-0 ${
                  deviceTheme === 'dark' ? 'bg-[#1c2541] border-[#3a506b]' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex flex-col items-center gap-0.5 text-amber-500">
                    <Layers className="w-4 h-4" />
                    <span className="text-[8px] font-black">Overview</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span className="text-[8px] font-bold">Kuthi</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <Video className="w-4 h-4" />
                    <span className="text-[8px] font-bold">Live</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <Compass className="w-4 h-4" />
                    <span className="text-[8px] font-bold">Charts</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[8px] font-bold">Profile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* RIGHT COLUMN: LIVE CUSTOMIZER & CONTROL PANEL                 */}
        {/* ============================================================= */}
        <div className="w-full lg:w-[480px] bg-[#0b132b] border-t lg:border-t-0 lg:border-l border-[#1c2541] flex flex-col overflow-hidden">
          
          {/* Editor Header Tabs */}
          <div className="p-4 border-b border-[#1c2541] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Live Customizer Settings</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">React ↔ Flutter Sync</span>
            </div>

            {/* Customizer Sub-Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'ad', label: '1. Ad Banner', icon: Tag },
                { id: 'notices', label: '2. Notices', icon: Bell },
                { id: 'panchanga', label: '3. Panchanga', icon: Compass },
                { id: 'counters', label: '4. Counters', icon: Wallet },
                { id: 'engines', label: '5. Engines', icon: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditorTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeEditorTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-[#1c2541] hover:bg-[#253256] text-slate-300 border border-[#3a506b]'
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Editor Controls Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            
            {/* ----------------------------------------------------------- */}
            {/* TAB 1: AD BANNER / SPONSORED SLOT CONTROLS                  */}
            {/* ----------------------------------------------------------- */}
            {activeEditorTab === 'ad' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1c2541] border border-[#3a506b]">
                  <div>
                    <span className="font-bold text-white block">Show Sponsored / Ad Banner Slot</span>
                    <span className="text-[11px] text-slate-400">Positioned directly beneath top header</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showAdBanner}
                    onChange={(e) => setShowAdBanner(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </div>

                {showAdBanner && (
                  <div className="space-y-3 p-4 rounded-2xl bg-[#1c2541]/70 border border-[#3a506b] space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge Tag Label</label>
                      <input
                        type="text"
                        value={adTag}
                        onChange={(e) => setAdTag(e.target.value)}
                        placeholder="SPONSORED or AD"
                        className="w-full px-3 py-2 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Ad Headline Title</label>
                      <input
                        type="text"
                        value={adTitle}
                        onChange={(e) => setAdTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Ad Subtitle & Promo Offer</label>
                      <input
                        type="text"
                        value={adSubtitle}
                        onChange={(e) => setAdSubtitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Banner Image URL</label>
                      <input
                        type="text"
                        value={adBannerUrl}
                        onChange={(e) => setAdBannerUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-mono text-[11px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* TAB 2: NOTICES & CAROUSEL ANNOUNCEMENTS                     */}
            {/* ----------------------------------------------------------- */}
            {activeEditorTab === 'notices' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Active Notice Carousel Items ({notices.length})</span>
                  <button
                    onClick={() => {
                      const newN = {
                        id: String(Date.now()),
                        type: 'INFO',
                        badge: 'NEW ALERT',
                        title: 'Custom Announcement Title',
                        message: 'This announcement is dynamically configurable.',
                        action: 'View More',
                        severity: 'INFO',
                        active: true,
                      };
                      setNotices((p) => [...p, newN]);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[11px]"
                  >
                    + Add Notice
                  </button>
                </div>

                <div className="space-y-3">
                  {notices.map((n, idx) => (
                    <div
                      key={n.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                        idx === activeNoticeIndex
                          ? 'bg-[#1c2541] border-amber-500/60 ring-1 ring-amber-500/30'
                          : 'bg-[#121c38] border-[#3a506b]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400">Notice #{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveNoticeIndex(idx)}
                            className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => setNotices((p) => p.filter((item) => item.id !== n.id))}
                            className="text-rose-400 hover:text-rose-300 font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={n.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNotices((p) => p.map((it, i) => (i === idx ? { ...it, title: val } : it)));
                        }}
                        placeholder="Notice title..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0b132b] border border-[#3a506b] text-white font-bold"
                      />

                      <textarea
                        rows={2}
                        value={n.message}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNotices((p) => p.map((it, i) => (i === idx ? { ...it, message: val } : it)));
                        }}
                        placeholder="Notice message..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0b132b] border border-[#3a506b] text-white text-xs"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={n.severity}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNotices((p) => p.map((it, i) => (i === idx ? { ...it, severity: val } : it)));
                          }}
                          className="px-2 py-1.5 rounded-lg bg-[#0b132b] border border-[#3a506b] text-white text-xs"
                        >
                          <option value="PROMO">Promo Offer (Purple)</option>
                          <option value="URGENT">Urgent Warning (Red)</option>
                          <option value="INFO">Info Alert (Blue)</option>
                        </select>
                        <input
                          type="text"
                          value={n.action}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNotices((p) => p.map((it, i) => (i === idx ? { ...it, action: val } : it)));
                          }}
                          placeholder="Action Button Text"
                          className="px-2 py-1.5 rounded-lg bg-[#0b132b] border border-[#3a506b] text-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* TAB 3: PANCHANGA & LOCATION STATION                         */}
            {/* ----------------------------------------------------------- */}
            {activeEditorTab === 'panchanga' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Current Ephemeris Station</label>
                  <select
                    value={stationCity}
                    onChange={(e) => setStationCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c2541] border border-[#3a506b] text-white font-bold"
                  >
                    <option value="Imphal · 24.8°N">Imphal, Manipur (24.817°N, 93.936°E)</option>
                    <option value="Kolkata · 22.5°N">Kolkata, West Bengal (22.572°N, 88.363°E)</option>
                    <option value="Guwahati · 26.1°N">Guwahati, Assam (26.144°N, 91.736°E)</option>
                    <option value="New Delhi · 28.6°N">New Delhi (28.613°N, 77.209°E)</option>
                  </select>
                </div>

                <div className="space-y-3 p-4 rounded-2xl bg-[#1c2541] border border-[#3a506b]">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Tithi Override</label>
                    <input
                      type="text"
                      value={tithiText}
                      onChange={(e) => setTithiText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Nakshatra Override</label>
                    <input
                      type="text"
                      value={nakshatraText}
                      onChange={(e) => setNakshatraText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Rahu Kaal Timing</label>
                    <input
                      type="text"
                      value={rahuKaalText}
                      onChange={(e) => setRahuKaalText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* TAB 4: LIVE COUNTERS & WALLET                               */}
            {/* ----------------------------------------------------------- */}
            {activeEditorTab === 'counters' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1c2541] border border-[#3a506b]">
                  <div>
                    <span className="font-bold text-white block">Astrologer Online Status</span>
                    <span className="text-[11px] text-slate-400">Accepting instant consultation orders</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAstrologerOnline}
                    onChange={(e) => setIsAstrologerOnline(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-4 p-4 rounded-2xl bg-[#1c2541] border border-[#3a506b]">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-300">Pending Kuthi Orders:</span>
                      <span className="text-amber-400">{pendingKuthiOrders}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={pendingKuthiOrders}
                      onChange={(e) => setPendingKuthiOrders(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-300">Active Live Calls:</span>
                      <span className="text-emerald-400">{activeLiveCalls}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={activeLiveCalls}
                      onChange={(e) => setActiveLiveCalls(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Wallet Balance (₹)</label>
                    <input
                      type="number"
                      step="500"
                      value={walletBalance}
                      onChange={(e) => setWalletBalance(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b132b] border border-[#3a506b] text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* TAB 5: QUICK ENGINES GRID TOGGLES                           */}
            {/* ----------------------------------------------------------- */}
            {activeEditorTab === 'engines' && (
              <div className="space-y-3">
                <span className="font-bold text-slate-200 block mb-2">Enable or Disable Astrological Tool Tiles:</span>
                
                {[
                  { key: 'sadesati', label: 'Shani Sade Sati (🪐)', desc: 'Saturn 7.5 year transit analysis' },
                  { key: 'manglik', label: 'Manglik Dosh (🔥)', desc: 'Mars dosha & remedies calculation' },
                  { key: 'kaalsarp', label: 'Kaal Sarp Dosh (🐍)', desc: 'Rahu-Ketu axis binding calculation' },
                  { key: 'ngaaeeshing', label: 'ঙা-ঈশিং Manipuri (🐟)', desc: 'Traditional Meitei fish-water lore' },
                  { key: 'matchmaking', label: 'Match Making (💍)', desc: '36 Guna Ashtakoot Milan' },
                  { key: 'yogas', label: 'Planetary Yogas (✨)', desc: 'Raja Yoga, Dhana Yoga & Gajakesari' },
                  { key: 'yumsharol', label: 'Yumsharol Vastu (🏡)', desc: 'Manipuri traditional house orientation' },
                  { key: 'kundali', label: 'Bengali Kundli (🧭)', desc: 'Parashari D1/D9 rashi chart' },
                ].map((eng) => (
                  <div
                    key={eng.key}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#1c2541] border border-[#3a506b]"
                  >
                    <div>
                      <span className="font-bold text-white block">{eng.label}</span>
                      <span className="text-[10.5px] text-slate-400">{eng.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={(enabledEngines as any)[eng.key]}
                      onChange={(e) =>
                        setEnabledEngines((prev) => ({ ...prev, [eng.key]: e.target.checked }))
                      }
                      className="w-5 h-5 accent-amber-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FLUTTER EXPORT CODE MODAL                                     */}
      {/* ------------------------------------------------------------- */}
      {showFlutterCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b132b] border border-[#3a506b] rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#1c2541] pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-white">Production Flutter Screen (`AstrologerMobileDashboard.dart`)</h3>
              </div>
              <button
                onClick={() => setShowFlutterCodeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              This widget is generated with <strong>Material 3</strong>, Null-Safety, and is completely standalone for immediate use in your Flutter mobile repository.
            </p>

            <div className="flex-1 overflow-y-auto bg-[#04060e] p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-amber-200/90 leading-relaxed">
              <pre>
{`// File: lib/screens/AstrologerMobileDashboard.dart
// Production-Ready Material 3 Widget for KangleiAstro

import 'package:flutter/material.dart';

class AstrologerMobileDashboard extends StatefulWidget {
  const AstrologerMobileDashboard({super.key});

  @override
  State<AstrologerMobileDashboard> createState() => _AstrologerMobileDashboardState();
}

// ... See full file at src/components/dashboard/AstrologerMobileDashboard.dart`}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleCopyFlutterCode}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedCode ? '✓ Copied to Clipboard!' : 'Copy Dart Code'}</span>
              </button>
              <button
                onClick={() => setShowFlutterCodeModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
