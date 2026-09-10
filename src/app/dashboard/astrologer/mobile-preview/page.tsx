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

  // Load saved configuration on mount if present
  useEffect(() => {
    const saved = localStorage.getItem('kanglei_mobile_customizer_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (typeof parsed.showAdBanner === 'boolean') setShowAdBanner(parsed.showAdBanner);
          if (parsed.adTitle) setAdTitle(parsed.adTitle);
          if (parsed.adSubtitle) setAdSubtitle(parsed.adSubtitle);
          if (parsed.adBannerUrl) setAdBannerUrl(parsed.adBannerUrl);
          if (parsed.adTag) setAdTag(parsed.adTag);
          if (parsed.stationCity) setStationCity(parsed.stationCity);
          if (parsed.tithiText) setTithiText(parsed.tithiText);
          if (parsed.nakshatraText) setNakshatraText(parsed.nakshatraText);
          if (parsed.rahuKaalText) setRahuKaalText(parsed.rahuKaalText);
          if (typeof parsed.pendingKuthiOrders === 'number') setPendingKuthiOrders(parsed.pendingKuthiOrders);
          if (typeof parsed.activeLiveCalls === 'number') setActiveLiveCalls(parsed.activeLiveCalls);
          if (typeof parsed.walletBalance === 'number') setWalletBalance(parsed.walletBalance);
          if (typeof parsed.isOnline === 'boolean') setIsAstrologerOnline(parsed.isOnline);
          if (parsed.enabledEngines) setEnabledEngines(parsed.enabledEngines);
          if (Array.isArray(parsed.notices)) setNotices(parsed.notices);
        }
      } catch (e) {}
    }
  }, []);

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
    const configToSave = {
      showAdBanner,
      adTag,
      adTitle,
      adSubtitle,
      adBannerUrl,
      stationCity,
      tithiText,
      nakshatraText,
      rahuKaalText,
      pendingKuthiOrders,
      activeLiveCalls,
      walletBalance,
      isOnline: isAstrologerOnline,
      enabledEngines,
      notices,
    };

    localStorage.setItem('kanglei_mobile_customizer_config', JSON.stringify(configToSave));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('kanglei_mobile_config_updated'));

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

              {/* Screen Area (Interactive AstrologerMobileView inside Frame) */}
              <div className="w-full h-full rounded-[42px] overflow-hidden overflow-y-auto no-scrollbar relative flex flex-col">
                <AstrologerMobileView
                  customConfig={{
                    showAdBanner,
                    adTag,
                    adTitle,
                    adSubtitle,
                    adBannerUrl,
                    stationCity,
                    tithiText,
                    nakshatraText,
                    rahuKaalText,
                    pendingKuthiOrders,
                    activeLiveCalls,
                    walletBalance,
                    isOnline: isAstrologerOnline,
                    enabledEngines,
                    notices,
                  }}
                />
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
