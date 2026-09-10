'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Printer,
  Copy,
  RotateCcw,
  Layers,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Globe,
  DoorOpen,
  Home,
  Briefcase,
  Building,
  Info,
  ArrowRight,
  BookOpen,
  Sun,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import {
  VASTU_ZONES_16,
  PADA_GATES_32,
  RoomPlacementCheck,
  evaluateVastuFloorplan,
  getZoneByAngle,
} from '@/engine/vastuEngine';

const DEFAULT_PUBLIC_PLACEMENTS: RoomPlacementCheck[] = [
  { roomType: 'entrance', roomLabel: 'Main Entrance (থোংজাল / মহাদ্বারা)', zoneId: 'n' },
  { roomType: 'kitchen', roomLabel: 'Kitchen (চাকখুম / মৈরাম)', zoneId: 'se' },
  { roomType: 'master_bedroom', roomLabel: 'Master Bedroom (য়ুমবুংগী তুমফম)', zoneId: 'sw' },
  { roomType: 'puja', roomLabel: 'Puja Room (লাই খুরুমফম / ঈশান)', zoneId: 'ne' },
  { roomType: 'toilet', roomLabel: 'Toilet (লেংফম / খোংহামফম)', zoneId: 'ssw' },
  { roomType: 'water_tank', roomLabel: 'Water Tank (ঈশিং ফমফম)', zoneId: 'ne' },
  { roomType: 'living', roomLabel: 'Living Room (মঙ্গোল / ফমফম)', zoneId: 'e' },
  { roomType: 'safe_vault', roomLabel: 'Cash Safe (লন-থুম থমফম)', zoneId: 'n' },
];

export default function FreeVastuPage() {
  const [placements, setPlacements] = useState<RoomPlacementCheck[]>(DEFAULT_PUBLIC_PLACEMENTS);
  const [propertyType, setPropertyType] = useState<'flat' | 'independent_house' | 'commercial_shop'>('independent_house');
  const [facingDirection, setFacingDirection] = useState<'North' | 'East' | 'South' | 'West' | 'North-East' | 'South-East' | 'North-West' | 'South-West'>('North');

  // 4 to 5 Second Cosmic Progress Loader
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState<number>(0);

  // Result state
  const [auditResult, setAuditResult] = useState<any>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleRoomZoneChange = (index: number, newZoneId: string) => {
    const updated = [...placements];
    updated[index].zoneId = newZoneId;
    setPlacements(updated);
  };

  const handleRunVastuAudit = () => {
    setIsCalculating(true);
    setProgressPercent(0);
    setLoadingPhaseIndex(0);

    const totalDuration = 4500; // 4.5 seconds
    const intervalTime = 50;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            const res = evaluateVastuFloorplan(placements);
            setAuditResult(res);
            setIsCalculating(false);
            setTimeout(() => {
              resultRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }, 300);
          return 100;
        }

        const phasesCount = 5;
        const phaseIdx = Math.min(Math.floor((next / 100) * phasesCount), phasesCount - 1);
        setLoadingPhaseIndex(phaseIdx);

        return next;
      });
    }, intervalTime);
  };

  const handleReset = () => {
    setAuditResult(null);
    setProgressPercent(0);
    setPlacements(DEFAULT_PUBLIC_PLACEMENTS);
  };

  const handleCopySummary = () => {
    if (!auditResult) return;

    const text = `FREE VASTU SHASTRA HARMONY AUDIT:
Property Type: ${propertyType.toUpperCase()} | Facing: ${facingDirection}
• Vastu Harmony Score: ${auditResult.overallScore}% (${auditResult.grade})
• Detected Defect Doshas: ${auditResult.doshas.length > 0 ? auditResult.doshas.join('; ') : 'Zero critical doshas.'}
• Sacred Manipur Traditions:
  - Sanamahi Kachin (South-West): ${auditResult.meiteiTraditions.sanamahiCorner}
  - Phunga Lairu (South-East): ${auditResult.meiteiTraditions.phungaLairu}

Generated on KuthiYengpham / KangleiAstro Free Vastu Tool`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const loadingPhases = [
    'Scanning 16-zone Pancha Tattva spatial balance...',
    'Evaluating Ishanya, Agneya, Nairutya & Vayavya energy flow...',
    'Checking Lainingthou Sanamahi & Phunga Lairu alignment...',
    'Diagnosing potential Vastu Doshas & energy blockages...',
    'Synthesizing non-structural elemental remedies...',
  ];

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] font-sans">
      {/* Top Header */}
      <div className="relative pt-6 sm:pt-10 pb-8 px-4 border-b border-[#f3e8d2] bg-gradient-to-b from-[#faf8f5] via-[#fffdfa] to-white">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-extrabold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#d97706]" />
            <span>Vedic Spatial Science &amp; Manipur Yumsharol</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#0f172a] tracking-tight">
            Free <span className="text-[#b45309]">Vastu Shastra</span> Harmony Audit
          </h1>

          <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
            Diagnose your home, flat, or office layout across the 8 cardinal directions and 16 MahaVastu energy zones. Calculate your Vastu score and receive non-structural remedies.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10" ref={resultRef}>
        {/* ───────────────────────────────────────────────────────────── */}
        {/* 1. INPUT FORM & ROOM PLACEMENT SELECTOR                       */}
        {/* ───────────────────────────────────────────────────────────── */}
        {!auditResult && !isCalculating && (
          <div className="space-y-8">
            {/* Quick Property Settings Bar */}
            <div className="bg-white p-6 rounded-3xl border border-[#f3e8d2] shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  Property Category
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-xs focus:border-[#d97706] focus:outline-none"
                >
                  <option value="independent_house">Independent House / Villa (Yumjao)</option>
                  <option value="flat">Apartment / High-rise Flat</option>
                  <option value="commercial_shop">Commercial Shop / Office Space</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  Main Facing Direction (Road / Front Entrance)
                </label>
                <select
                  value={facingDirection}
                  onChange={(e) => setFacingDirection(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-xs focus:border-[#d97706] focus:outline-none"
                >
                  <option value="North">North (Awang / অৱাং - লন-থুম অমসুং কুবের)</option>
                  <option value="East">East (Nongpok / নোংপোক - নুমিৎ থোকপ অমসুং হকচাং ফবা)</option>
                  <option value="North-East">North-East (Ishanya / অৱাং-নোংপোক - লাই খুরুমফম অমসুং শান্তি)</option>
                  <option value="South-East">South-East (Meiram / মৈরাম - ফুঙ্গা লৈরূ অমসুং চাকখুম)</option>
                  <option value="South">South (Makha / মখা - তুমফম অমসুং য়ম)</option>
                  <option value="South-West">South-West (Sanamahi Kachin / সনমহী কচীন - লাইনিংথৌ সনমহী)</option>
                  <option value="West">West (Nongchup / নোংচুপ - কান্নবা অমসুং ললোন-ইতিক)</option>
                  <option value="North-West">North-West (Awang-Nongchup / অৱাং-নোংচুপ - লৈমারেল শিদাবী অমসুং পোৎ-চৈ)</option>
                </select>
              </div>
            </div>

            {/* Room Direction Chooser Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#0f172a] flex items-center gap-2">
                    <Home className="w-5 h-5 text-[#d97706]" />
                    <span>Select Room Placements in Your Layout</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Choose the approximate direction or corner where each room is situated.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#b45309]">
                  8 Core Rooms
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {placements.map((p, idx) => (
                  <div key={p.roomType} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-xs text-slate-900 block truncate">
                      {p.roomLabel}
                    </span>
                    <select
                      value={p.zoneId}
                      onChange={(e) => handleRoomZoneChange(idx, e.target.value)}
                      className="w-full h-9 px-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    >
                      {VASTU_ZONES_16.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({z.sanskritName.split('/')[0].trim()})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Calculate Button */}
              <div className="pt-4 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRunVastuAudit}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] text-white font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Vastu Harmony &amp; Doshas</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2. 4 TO 5 SECOND COSMIC PROGRESS BAR MODAL/LOADER             */}
        {/* ───────────────────────────────────────────────────────────── */}
        {isCalculating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 px-6 sm:px-12 rounded-3xl bg-gradient-to-b from-[#1c2541] via-[#0b132b] to-[#0f172a] text-white border border-[#3a506b] shadow-2xl text-center space-y-6 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#d97706] to-[#fbbf24] p-1 shadow-xl flex items-center justify-center animate-pulse">
              <div className="w-full h-full rounded-full bg-[#0b132b] flex items-center justify-center">
                <Compass className="w-10 h-10 text-[#fbbf24] animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#fbbf24]">
                Calculating Vastu Purusha Energy Grid
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-medium h-6">
                {loadingPhases[loadingPhaseIndex]}
              </p>
            </div>

            {/* Glowing Golden Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-amber-500/30 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24] rounded-full transition-all duration-75 shadow-lg"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-gray-400">
                <span>Phase {loadingPhaseIndex + 1} of 5</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-gray-400 italic">
              &quot;When spatial architecture aligns with cosmic geometry, health, prosperity, and peace flow naturally.&quot;
            </div>
          </motion.div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3. REVEALED RESULTS VIEW                                      */}
        {/* ───────────────────────────────────────────────────────────── */}
        {auditResult && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#f3e8d2] shadow-xs">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-extrabold text-xs hover:bg-[#fef3c7] hover:border-[#d97706] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#d97706]" />
                <span>Re-Audit Another Floorplan</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#d97706]" />
                  <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f172a] text-white font-bold text-xs hover:bg-[#1e293b] transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Audit</span>
                </button>
              </div>
            </div>

            {/* Score & Verdict Banner */}
            <div className="bg-gradient-to-r from-[#1c2541] via-[#0b132b] to-[#0f172a] p-6 sm:p-8 rounded-3xl border border-[#3a506b] text-white shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3a506b] pb-4">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    Vastu Shastra Floorplan Verdict • Facing: {facingDirection}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fbbf24]">
                    Overall Harmony Score: {auditResult.overallScore}%
                  </h2>
                </div>
                <span className={`px-4 py-1.5 rounded-full font-serif font-bold text-sm ${
                  auditResult.overallScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                  auditResult.overallScore >= 65 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {auditResult.grade}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-200">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-[#fbbf24] block">Auspicious Placements:</span>
                  <p>{auditResult.checks.filter((c: any) => c.status === 'Auspicious').length} rooms in harmony with directional elements.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-rose-400 block">Critical Doshas Detected:</span>
                  <p>{auditResult.doshas.length > 0 ? `${auditResult.doshas.length} energy blockages identified.` : 'Zero major structural doshas found.'}</p>
                </div>
              </div>
            </div>

            {/* Room by Room Diagnostics */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-5">
              <h3 className="font-serif font-bold text-xl text-[#0f172a] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#d97706]" />
                <span>Room-by-Room Energy Analysis</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditResult.checks.map((check: any, cIdx: number) => (
                  <div
                    key={cIdx}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      check.status === 'Auspicious' ? 'bg-emerald-50/40 border-emerald-200' :
                      check.status === 'Neutral' ? 'bg-amber-50/40 border-amber-200' :
                      'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">
                        {check.roomLabel}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        check.status === 'Auspicious' ? 'bg-emerald-100 text-emerald-800' :
                        check.status === 'Neutral' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {check.status} ({check.zoneName.split(' ')[0]})
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {check.impact}
                    </p>
                    {check.remedy && (
                      <div className="p-2.5 rounded-xl bg-white/90 border border-amber-300/80 text-[11px] text-amber-950 space-y-0.5">
                        <strong className="block text-[#b45309]">✨ Non-Structural Remedy:</strong>
                        <p>{check.remedy}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Manipur Yumsharol & Sanamahi Lore Guidelines */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#0f172a] flex items-center gap-2">
                <Mountain className="w-5 h-5 text-[#d97706]" />
                <span>Manipur Meitei Yumsharol &amp; Sanamahi Sacred Rules</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                  <strong className="text-[#b45309] block text-sm">1. Sanamahi Kachin (South-West)</strong>
                  <p className="text-slate-700 leading-relaxed">{auditResult.meiteiTraditions.sanamahiCorner}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                  <strong className="text-[#b45309] block text-sm">2. Phunga Lairu (South-East Hearth)</strong>
                  <p className="text-slate-700 leading-relaxed">{auditResult.meiteiTraditions.phungaLairu}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                  <strong className="text-[#b45309] block text-sm">3. Leimarel Storage (North-West)</strong>
                  <p className="text-slate-700 leading-relaxed">{auditResult.meiteiTraditions.leimarelStorage}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                  <strong className="text-[#b45309] block text-sm">4. Central Sumang (Brahmasthan)</strong>
                  <p className="text-slate-700 leading-relaxed">{auditResult.meiteiTraditions.sumangCourtyard}</p>
                </div>
              </div>
            </div>

            {/* CTA to Consult Astrologer */}
            <div className="bg-gradient-to-r from-[#1c2541] via-[#0b132b] to-[#0f172a] p-8 rounded-3xl border border-[#3a506b] text-white shadow-2xl text-center space-y-4 print:hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/20 border border-[#d97706]/40 text-[#fbbf24] text-xs font-bold uppercase">
                <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                <span>Need an On-Site or Blueprints Vastu Audit?</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#fbbf24]">
                Book a 1-on-1 Vastu Consultation with Senior Acharyas
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                Connect directly with experienced Vastu and Yumsharol specialists to audit your blueprint, plan new foundations, and neutralize doshas without demolition.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <span>Book Vastu Consultation</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/manipuri_free_kuthi"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Generate Free Kundli</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 4. SEO-FRIENDLY HUMAN-VOICE ARTICLE                           */}
        {/* IMPORTANT RULE: Visible initially, HIDDEN when result comes   */}
        {/* ───────────────────────────────────────────────────────────── */}
        {!auditResult && (
          <div className="pt-8 border-t border-[#f3e8d2] space-y-10">
            {/* Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase">
                <BookOpen className="w-3.5 h-3.5 text-[#d97706]" />
                <span>The Sacred Science of Spatial Harmony</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f172a]">
                Understanding Vastu Shastra &amp; Manipur Yumsharol
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Written with authentic human care by our team of practicing Vedic Acharyas and Manipuri architectural scholars.
              </p>
            </div>

            {/* Sections */}
            <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#0f172a] flex items-center gap-2">
                  <Sun className="w-5 h-5 text-[#d97706]" />
                  <span>Why Your Living Space Dictates Your Destiny</span>
                </h3>
                <p>
                  Have you ever noticed that moving into a new home or office immediately changed your sleep quality, your financial luck, or the harmony between family members? That is the subtle science of Vastu Shastra in motion.
                </p>
                <p>
                  Vastu Shastra is the ancient Vedic science of spatial alignment that harmonizes the **Pancha Tattva (Five Great Elements)**—Water (Jala), Air (Vayu), Fire (Agni), Earth (Prithvi), and Space (Akasha)—with the Earth&apos;s magnetic grid and solar cycles. When energy flows unimpeded through your doors and windows, health, wealth, and mental tranquility thrive.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#0f172a] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#d97706]" />
                  <span>The Four Sacred Corners You Must Protect</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <strong className="text-[#b45309] block mb-1">1. North-East (Ishanya / অৱাং-নোংপোক - লাই খুরুমফম)</strong>
                    <p className="text-xs text-slate-600">The spiritual crown. Keep light, clean, and dedicated to meditation, prayer, or pure drinking water. Never place a toilet here.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <strong className="text-[#b45309] block mb-1">2. South-East (Meiram / মৈরাম - ফুঙ্গা লৈরূ অমসুং চাকখুম)</strong>
                    <p className="text-xs text-slate-600">The kitchen &amp; liquidity corner. Governed by fire and Phunga Lairu, this zone generates daily cash flow and kitchen vitality.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <strong className="text-[#b45309] block mb-1">3. South-West (Sanamahi Kachin / সনমহী কচীন)</strong>
                    <p className="text-xs text-slate-600">The grounding foundation. Seat of the master bedroom and Lainingthou Sanamahi. Must be kept clean, heavy, and elevated.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <strong className="text-[#b45309] block mb-1">4. North-West (Awang-Nongchup / অৱাং-নোংচুপ - লৈমারেল শিদাবী)</strong>
                    <p className="text-xs text-slate-600">The movement and resource quadrant. Regulates guest rooms, grains/goods storage, and banking support.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#0f172a] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#d97706]" />
                  <span>Frequently Asked Questions on Vastu Corrections</span>
                </h3>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <h5 className="font-bold text-slate-900">Can Vastu defects be corrected without breaking walls?</h5>
                    <p className="text-slate-600 mt-1">
                      Yes! Classical Vastu provides extensive non-structural remedies. By utilizing metallic threshold strips (copper/brass/zinc), elemental color therapies, Vastu sea salt bowls, and consecrated pyramids, over 90% of energetic blockages can be effectively neutralized.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900">What is the significance of Sanamahi Kachin in Manipur homes?</h5>
                    <p className="text-slate-600 mt-1">
                      In indigenous Meitei tradition, the South-West corner of every house is consecrated to Lainingthou Sanamahi. Maintaining purity, an evening earthen lamp, and an elevated floor in this corner protects the entire household lineage from illness and discord.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
