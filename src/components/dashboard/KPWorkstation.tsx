'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Calendar,
  Clock,
  User,
  Flame,
  Globe,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
  X,
  Briefcase,
  Heart,
  Coins,
  Plane,
  GraduationCap,
  Shield,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Printer,
  Download,
  Share2,
  Eye,
  Sliders,
  Scale,
  Baby,
  Home,
  Check,
  Search,
  FileText,
  Copy,
} from 'lucide-react';
import resultTemplates from '@/data/kuthiResultTemplates.json';
import { calculateExactAge } from '@/components/dashboard/VedicWorkstation';
import {
  ResultTabType,
  SHEET_MAP,
  WEEKDAY_MAP,
  RASHI_DISPLAY,
  LAGNA_DISPLAY,
  NAKSHATRA_DISPLAY,
} from '@/components/dashboard/KuthiResultWorkstation';
import BengaliChart from '@/components/charts/BengaliChart';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import SouthIndianChart from '@/components/charts/SouthIndianChart';
import {
  calculateKPWorkstation,
  calculateKPHoraryChart,
  getKP249Table,
  formatDms,
  formatSignDms,
  KP_PLANET_NAMES,
  KP_RASHIS,
  KPWorkstationCalculation,
  KPCuspData,
  KPPlanetData,
  KPCuspalVerdict,
} from '@/engine/kpEngine';

interface KPWorkstationProps {
  initialBirthData?: {
    name?: string;
    dob?: string;
    tob?: string;
    pob?: string;
    lat?: number;
    lng?: number;
    timezone?: number;
    sex?: string;
  };
  onClose?: () => void;
}

const DEFAULT_PRESET = {
  name: 'Native Client',
  sex: 'Male',
  dob: '2004-06-28',
  tob: '06:00',
  pob: 'Imphal, Manipur',
  lat: 24.817,
  lng: 93.9368,
  timezone: 5.5,
};

export default function KPWorkstation({ initialBirthData, onClose }: KPWorkstationProps) {
  const [formData, setFormData] = useState({
    name: initialBirthData?.name || DEFAULT_PRESET.name,
    sex: initialBirthData?.sex || DEFAULT_PRESET.sex,
    dob: initialBirthData?.dob || DEFAULT_PRESET.dob,
    tob: initialBirthData?.tob || DEFAULT_PRESET.tob,
    pob: initialBirthData?.pob || DEFAULT_PRESET.pob,
    lat: initialBirthData?.lat ?? DEFAULT_PRESET.lat,
    lng: initialBirthData?.lng ?? DEFAULT_PRESET.lng,
    timezone: initialBirthData?.timezone ?? DEFAULT_PRESET.timezone,
  });

  const [activeTab, setActiveTab] = useState<
    'planets' | 'cusps' | 'charts' | 'significators' | 'ruling' | 'horary' | 'interlinks' | 'dasha' | 'resultsheet'
  >('dasha');

  const [expandedMahaLord, setExpandedMahaLord] = useState<string | null>(null);
  const [expandedAntarLord, setExpandedAntarLord] = useState<string | null>(null);

  // Chart view preferences
  const [chartType, setChartType] = useState<'bhav' | 'rashi'>('bhav');
  const [chartStyle, setChartStyle] = useState<'bengali' | 'north' | 'south'>('bengali');

  // Quick edit modal
  const [showEditForm, setShowEditForm] = useState(false);
  const [editDraft, setEditDraft] = useState({ ...formData });

  // Horary 1-249 state
  const [horaryNumberInput, setHoraryNumberInput] = useState<number>(108);
  const [activeHoraryNumber, setActiveHoraryNumber] = useState<number | null>(null);
  const [horarySearch, setHorarySearch] = useState<string>('');

  // Ruling planets live mode
  const [useLiveRP, setUseLiveRP] = useState<boolean>(false);
  const [liveRPTime, setLiveRPTime] = useState<Date>(new Date());

  // Copy toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Base KP Calculation
  const kpData: KPWorkstationCalculation = useMemo(() => {
    const bData = {
      name: formData.name,
      gender: formData.sex,
      dateOfBirth: formData.dob,
      timeOfBirth: formData.tob,
      latitude: Number(formData.lat) || 24.817,
      longitude: Number(formData.lng) || 93.9368,
      timezone: 'Asia/Kolkata',
      utcOffset: Number(formData.timezone) || 5.5,
      ayanamsa: 'KP',
    };

    if (activeHoraryNumber !== null) {
      return calculateKPHoraryChart(activeHoraryNumber, bData);
    }
    return calculateKPWorkstation(bData);
  }, [formData, activeHoraryNumber]);

  // Live Ruling Planets Calculation
  const liveRPData: KPWorkstationCalculation | null = useMemo(() => {
    if (!useLiveRP) return null;
    const now = liveRPTime;
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    return calculateKPWorkstation({
      name: 'Current Moment Horary',
      gender: 'Male',
      dateOfBirth: `${yyyy}-${mm}-${dd}`,
      timeOfBirth: `${hh}:${min}`,
      latitude: Number(formData.lat) || 24.817,
      longitude: Number(formData.lng) || 93.9368,
      timezone: 'Asia/Kolkata',
      utcOffset: Number(formData.timezone) || 5.5,
      ayanamsa: 'KP',
    });
  }, [useLiveRP, liveRPTime, formData.lat, formData.lng, formData.timezone]);

  const activeRP = useLiveRP && liveRPData ? liveRPData.rulingPlanets : kpData.rulingPlanets;

  // 249 Table
  const table249 = useMemo(() => getKP249Table(), []);
  const filtered249 = useMemo(() => {
    if (!horarySearch.trim()) return table249;
    const q = horarySearch.toLowerCase();
    return table249.filter(
      (r) =>
        r.number.toString() === q ||
        r.sign.toLowerCase().includes(q) ||
        r.nakshatra.toLowerCase().includes(q) ||
        r.starLord.toLowerCase().includes(q) ||
        r.subLord.toLowerCase().includes(q)
    );
  }, [table249, horarySearch]);

  const lagnaCusp = kpData.cusps[0];
  const moonPlanet = kpData.planets.find((p) => p.id === 'mo') || kpData.planets[1];

  // ─────────────────────────────────────────────────────────────
  // qw.xlsm RESULT SHEET STATE & DATA BINDING
  // ─────────────────────────────────────────────────────────────
  const [sheetMode, setSheetMode] = useState<ResultTabType>('Meitei Mayek');
  const [astrologerName, setAstrologerName] = useState<string>('Pt. Suraj Sharma');
  const [astrologerTitle, setAstrologerTitle] = useState<string>('KP & Vedic Astro Specialist');
  const [contactNo, setContactNo] = useState<string>('Contact No. +91 98620 12345');
  const [address, setAddress] = useState<string>('Imphal West, Manipur');
  const [refNo, setRefNo] = useState<string>('Ref. No.:- 2026   (13-09-2026)');
  const [consultDate, setConsultDate] = useState<string>('13-09-2026');
  const [showSheetHeaderEdit, setShowSheetHeaderEdit] = useState<boolean>(false);

  // Load astrologer profile from localStorage if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUserStr = localStorage.getItem('kanglei_user');
        if (savedUserStr) {
          const u = JSON.parse(savedUserStr);
          if (u) {
            if (u.name) setAstrologerName(u.name);
            if (u.address) setAddress(u.address);
            if (u.phone || u.whatsappNo) {
              const p = u.phone || u.whatsappNo;
              setContactNo(p.startsWith('Contact') ? p : `Contact No. ${p}`);
            }
            if (u.specialty) setAstrologerTitle(u.specialty);
          }
        }
      } catch (e) {}
    }
  }, []);

  // Native particulars calculated from entered birth data and KP chart
  const sheetNativeDetails = useMemo(() => {
    try {
      const parts = formData.dob.split('-').map(Number);
      const timeParts = formData.tob.split(':').map(Number);
      const bDate = new Date(parts[0], parts[1] - 1, parts[2], timeParts[0] || 0, timeParts[1] || 0);

      const dayIdx = bDate.getDay();
      const dayInfo = WEEKDAY_MAP[dayIdx] || WEEKDAY_MAP[3];

      const ageInfo = calculateExactAge(formData.dob, formData.tob) || { years: 22, months: 0, days: 0, runningYear: 23 };

      const lagnaDeg = kpData.cusps[0]?.longitude ?? 0;
      const moonPl = kpData.planets.find((p) => p.id === 'mo') || kpData.planets[1];
      const moonDeg = moonPl?.longitude ?? 0;

      const rashiNum = Math.floor(moonDeg / 30) + 1;
      const lagnaNum = Math.floor(lagnaDeg / 30) + 1;
      const nakNum = Math.floor(moonDeg / (360 / 27)) + 1;

      const formattedDob = `${parts[2]}-${parts[1]}-${parts[0]} AD`;
      const h24 = timeParts[0] || 0;
      const m24 = timeParts[1] || 0;
      const ampm = h24 >= 12 ? 'PM' : 'AM';
      const h12 = h24 % 12 || 12;
      const formattedTob = `${h12}:${String(m24).padStart(2, '0')} ${ampm}`;

      return {
        formattedDob,
        formattedTob,
        dayInfo,
        ageInfo,
        rashiNum,
        lagnaNum,
        nakNum,
        rashi: RASHI_DISPLAY[rashiNum] || RASHI_DISPLAY[1],
        lagna: LAGNA_DISPLAY[lagnaNum] || LAGNA_DISPLAY[1],
        nakshatra: NAKSHATRA_DISPLAY[nakNum] || NAKSHATRA_DISPLAY[1],
      };
    } catch (e) {
      return {
        formattedDob: formData.dob,
        formattedTob: formData.tob,
        dayInfo: WEEKDAY_MAP[1],
        ageInfo: { years: 22, months: 0, days: 0, runningYear: 23 },
        rashiNum: 1,
        lagnaNum: 1,
        nakNum: 1,
        rashi: RASHI_DISPLAY[1],
        lagna: LAGNA_DISPLAY[1],
        nakshatra: NAKSHATRA_DISPLAY[1],
      };
    }
  }, [formData.dob, formData.tob, kpData]);

  // Active template sheet data from qw.xlsm json
  const sheetKey = SHEET_MAP[sheetMode];
  const activeTemplate = useMemo(() => {
    return ((resultTemplates as any)[sheetKey] || {}) as Record<string, Record<string, { val?: string }>>;
  }, [sheetKey]);

  const getSheetVal = (row: number, col: string, fallback: string = '') => {
    const rObj = activeTemplate[String(row)];
    if (rObj && rObj[col] && rObj[col].val) {
      return rObj[col].val;
    }
    return fallback;
  };

  const dynamicNarrative = useMemo(() => {
    return getSheetVal(23, 'A', '');
  }, [activeTemplate]);

  const handleCopyResultSheet = () => {
    const reportText = `=====================================================
MANIPURI KUTHI HOROSCOPE RESULT (${sheetMode})
Krishnamurti Paddhati & Kanglei Kuthi Synthesis
=====================================================
Astrologer: ${astrologerName} (${astrologerTitle})
Address: ${address} | ${contactNo}
${refNo} | Date: ${consultDate}
-----------------------------------------------------
NATIVE PARTICULARS:
- Name: ${formData.name}
- Date of Birth: ${sheetNativeDetails.formattedDob} (${sheetNativeDetails.dayInfo.en})
- Birth Time: ${sheetNativeDetails.formattedTob}
- Place of Birth: ${formData.pob}
- Current Age: ${sheetNativeDetails.ageInfo?.years ?? 0} Years ${sheetNativeDetails.ageInfo?.months ?? 0} Months (Running ${sheetNativeDetails.ageInfo?.runningYear ?? 0}th Year)
- Rashi: ${sheetMode === 'Meitei Mayek' ? sheetNativeDetails.rashi.mm : sheetNativeDetails.rashi.blipi}
- Lagna: ${sheetMode === 'Meitei Mayek' ? sheetNativeDetails.lagna.mm : sheetNativeDetails.lagna.blipi}
- Nakshatra: ${sheetMode === 'Meitei Mayek' ? sheetNativeDetails.nakshatra.mm : sheetNativeDetails.nakshatra.blipi}
- KP Ayanamsha: ${kpData.kpAyanamsaStr}
- Running KP Dasha: ${kpData.dashaPrediction?.currentDasha.maha.lord} / ${kpData.dashaPrediction?.currentDasha.antar.lord}

LUCKY ATTRIBUTES:
- Lucky Colours: ${getSheetVal(10, 'C', '')}
- Lucky Number: ${getSheetVal(12, 'A', '2')}
- Good Numbers: ${getSheetVal(12, 'C', '1, 7, 9')}
- Lucky Stone: ${getSheetVal(12, 'E', 'Ruby')}
- Lucky Metal: ${getSheetVal(12, 'G', 'Copper')}
- Lucky Direction: ${getSheetVal(12, 'I', 'East')}

DIRECTION PREDICTIONS (8 DIRECTIONS):
- East (Nongpok): ${getSheetVal(14, 'C', '') || getSheetVal(14, 'B', '')}
- North-East (Chingkhei): ${getSheetVal(15, 'C', '') || getSheetVal(15, 'B', '')}
- North (Awang): ${getSheetVal(16, 'C', '') || getSheetVal(16, 'B', '')}
- North-West (Koubru): ${getSheetVal(17, 'C', '') || getSheetVal(17, 'B', '')}
- West (Nongchup): ${getSheetVal(18, 'C', '') || getSheetVal(18, 'B', '')}
- South-West (Santhong): ${getSheetVal(19, 'C', '') || getSheetVal(19, 'B', '')}
- South (Makha): ${getSheetVal(20, 'C', '') || getSheetVal(20, 'B', '')}
- South-East (Meiram): ${getSheetVal(21, 'C', '') || getSheetVal(21, 'B', '')}

DASHA & LIFE PREDICTIONS (Row 23):
${dynamicNarrative}

REMEDIES / PRITIKAR:
1. ${getSheetVal(113, 'B', '') || getSheetVal(115, 'B', '') || getSheetVal(53, 'B', '')}
2. ${getSheetVal(114, 'B', '') || getSheetVal(116, 'B', '') || getSheetVal(54, 'B', '')}
=====================================================
Generated via Kanglei Kuthi • kuthiyengpham.in • Matched with qw.xlsm`;

    navigator.clipboard.writeText(reportText);
    showToast(`Copied ${sheetMode} Result Sheet to Clipboard!`);
  };

  const handlePrintResultSheet = () => {
    window.print();
  };

  return (
    <div className="w-full bg-[#faf8f5] dark:bg-[#070c1a] text-slate-900 dark:text-white rounded-3xl border border-amber-900/20 dark:border-[#3a506b] shadow-2xl flex flex-col overflow-hidden min-h-[85vh]">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* HEADER SECTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="px-5 py-4 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white flex flex-wrap items-center justify-between gap-4 border-b border-amber-700/40 relative">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg shadow-amber-950/40 border border-amber-300">
            ⭐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Krishnamurti Paddhati (KP) System
              </span>
              {activeHoraryNumber !== null && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Horary #{activeHoraryNumber} Active
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white flex items-center gap-2">
              <span>KP Astrology Workstation</span>
              <span className="text-amber-400 text-base font-normal">(কৃষ্ণমূর্তি জ্যোতিষ)</span>
            </h2>
            <div className="text-xs text-amber-200/90 flex flex-wrap items-center gap-x-3 gap-y-1 font-medium mt-0.5">
              <span>
                Native: <strong className="text-white">{formData.name}</strong>
              </span>
              <span>•</span>
              <span>
                DOB: <strong className="text-white">{formData.dob}</strong> {formData.tob}
              </span>
              <span>•</span>
              <span>
                POB: <strong className="text-white">{formData.pob}</strong>
              </span>
              <span>•</span>
              <span>
                KP Ayanamsha: <strong className="text-amber-300 font-mono">{kpData.kpAyanamsaStr}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {activeHoraryNumber !== null && (
            <button
              onClick={() => setActiveHoraryNumber(null)}
              className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 border border-cyan-400/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Natal</span>
            </button>
          )}

          <button
            onClick={() => {
              setEditDraft({ ...formData });
              setShowEditForm(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-700/60 hover:bg-amber-700 text-white border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-amber-300" />
            <span>Edit Birth Data</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-amber-950/60 hover:bg-black/60 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Close Workstation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* QUICK HIGHLIGHT STRIP */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="px-5 py-2.5 bg-amber-500/10 dark:bg-[#0b132b] border-b border-amber-900/10 dark:border-[#3a506b] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">Lagna Cusp:</span>
            <span className="font-bold text-amber-900 dark:text-amber-300">
              {lagnaCusp.sign} ({lagnaCusp.formattedDegree})
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold">
              RL: {lagnaCusp.signLord} • NL: {lagnaCusp.starLord} • SL: {lagnaCusp.subLord}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">Moon Cusp:</span>
            <span className="font-bold text-sky-900 dark:text-sky-300">
              {moonPlanet.sign} ({moonPlanet.formattedDegree})
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-200/60 dark:bg-sky-950 text-sky-900 dark:text-sky-300 font-bold">
              RL: {moonPlanet.signLord} • NL: {moonPlanet.starLord} • SL: {moonPlanet.subLord}
            </span>
          </div>

          {kpData.dashaPrediction && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">Running Dasha:</span>
              <button
                onClick={() => setActiveTab('dasha')}
                className="font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                title="Click to view detailed KP Dasha Predictions"
              >
                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 font-mono text-[11px] font-black">
                  {kpData.dashaPrediction.currentDasha.maha.lord} / {kpData.dashaPrediction.currentDasha.antar.lord}
                  {kpData.dashaPrediction.currentDasha.pratyantar
                    ? ` / ${kpData.dashaPrediction.currentDasha.pratyantar.lord}`
                    : ''}
                </span>
                <span className="text-[10.5px] text-amber-800 dark:text-amber-300 font-medium">
                  ({kpData.dashaPrediction.currentDasha.antar.remainingText})
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-slate-500 dark:text-gray-400">Placidus Cusps:</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">Semi-Arc Nirayana Solved (1-12)</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* NAVIGATION TABS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="px-4 bg-white dark:bg-[#0b132b]/80 border-b border-slate-200 dark:border-[#3a506b] flex overflow-x-auto no-scrollbar gap-1 pt-2">
        {[
          { id: 'resultsheet', label: 'qw Excel Result Sheet', icon: FileText, sub: 'কুথি রেজাল্ট শীট' },
          { id: 'dasha', label: 'Running Dasha & Predictions', icon: Clock, sub: 'দশা ফল ও ভবিষ্যৎবাণী' },
          { id: 'planets', label: 'KP Planets & Sub-Lords', icon: Compass, sub: 'গ্রহ স্থিতি' },
          { id: 'cusps', label: '12 House Cusps', icon: Layers, sub: '১২ ভাব কুস্প' },
          { id: 'charts', label: 'KP Bhav Chalit & Rashi', icon: Sparkles, sub: 'ভাভ চলিত চক্র' },
          { id: 'significators', label: '4-Fold Significators', icon: Award, sub: 'কারকত্ব (A-B-C-D)' },
          { id: 'ruling', label: 'Ruling Planets (RP)', icon: Flame, sub: 'শাসক গ্রহ' },
          { id: 'horary', label: 'Horary 1–249 Engine', icon: HelpCircle, sub: 'প্রশ্না ২৪৯' },
          { id: 'interlinks', label: 'Cuspal Interlinks & Queries', icon: TrendingUp, sub: 'ঘটনা বিচার' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-t-2xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border-t border-x ${
                isActive
                  ? 'bg-[#faf8f5] dark:bg-[#070c1a] text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/40 shadow-xs'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
              <div className="text-left">
                <div>{tab.label}</div>
                <div className="text-[9.5px] font-normal opacity-75">{tab.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB CONTENT CONTAINER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 1: KP PLANETS & SUB LORDS */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'planets' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Planetary Positions, Cuspal Occupancy & Sub Lords</span>
                  <span className="text-amber-600 dark:text-amber-400 text-sm font-normal">
                    (গ্রহ স্থিতি ও সাব-লর্ড)
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                  Full KP Nirayana longitudes, Star Lord (NL), Sub Lord (SL), Sub-Sub Lord (SSL), and Placidus Bhava occupied.
                </p>
              </div>
            </div>

            <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#3a506b] shadow-xs bg-white dark:bg-[#0b132b]">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="bg-amber-50/70 dark:bg-[#1c2541] border-b border-slate-200 dark:border-[#3a506b] text-[10.5px] font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
                    <th className="py-3 px-3">Planet</th>
                    <th className="py-3 px-2 text-center">Motion</th>
                    <th className="py-3 px-3">KP Longitude</th>
                    <th className="py-3 px-2 text-center">Bhava / Cusp</th>
                    <th className="py-3 px-3">Sign (Rashi)</th>
                    <th className="py-3 px-3">Sign Lord (RL)</th>
                    <th className="py-3 px-3">Nakshatra</th>
                    <th className="py-3 px-3">Star Lord (NL)</th>
                    <th className="py-3 px-3 text-amber-600 dark:text-amber-400">Sub Lord (SL)</th>
                    <th className="py-3 px-3 text-indigo-600 dark:text-indigo-400">Sub-Sub (SSL)</th>
                    <th className="py-3 px-3">Dignity</th>
                    <th className="py-3 px-3">RP Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-gray-200 font-medium">
                  {kpData.planets.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {p.name}
                          </span>
                          <span className="text-slate-400 text-[10.5px]">({p.nameBn})</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {p.isRetrograde ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300">
                            (R)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Direct</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-amber-300">
                        {p.formattedDegree}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black font-mono text-xs border border-amber-500/30">
                          {p.cusp}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold">{p.sign}</span>
                        <span className="text-slate-400 text-[10.5px] ml-1">({p.signBn})</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-gray-300">{p.signLord}</td>
                      <td className="py-2.5 px-3">{p.nakshatra}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-gray-300">{p.starLord}</td>
                      <td className="py-2.5 px-3 font-black text-amber-700 dark:text-amber-300 bg-amber-500/5">
                        {p.subLord}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/5">
                        {p.subSubLord}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-gray-400">{p.dignity}</td>
                      <td className="py-2.5 px-3">
                        {p.rulingPlanetRoles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.rulingPlanetRoles.map((role, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/40"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Rule Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs leading-relaxed">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 dark:text-amber-200">The Golden Rule of KP Astrology:</strong>
                <p className="text-slate-700 dark:text-gray-300 mt-1">
                  <em>&ldquo;A planet gives the results of its Constellation (Star) Lord. The Sub-Lord decides whether the result will be favorable or unfavorable.&rdquo;</em>{' '}
                  In Krishnamurti Paddhati, the planet is the source, the Star Lord is the conveyor of houses, and the Sub Lord delivers the final verdict.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 2: 12 HOUSE CUSPS */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'cusps' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>12 Placidus Nirayana House Cusps</span>
                <span className="text-amber-600 dark:text-amber-400 text-sm font-normal">
                  (১২ ভাব কুস্প ও ভাব সন্ধি)
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                Exact semi-arc Placidus cusps showing Sign Lord (RL), Star Lord (NL), Cusp Sub Lord (CSL), and occupants.
              </p>
            </div>

            <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#3a506b] shadow-xs bg-white dark:bg-[#0b132b]">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="bg-amber-50/70 dark:bg-[#1c2541] border-b border-slate-200 dark:border-[#3a506b] text-[10.5px] font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
                    <th className="py-3 px-3">Cusp</th>
                    <th className="py-3 px-3">Cusp Degree</th>
                    <th className="py-3 px-3">Sign (Rashi)</th>
                    <th className="py-3 px-3">Sign Lord (RL)</th>
                    <th className="py-3 px-3">Nakshatra</th>
                    <th className="py-3 px-3">Star Lord (NL)</th>
                    <th className="py-3 px-3 text-amber-600 dark:text-amber-400">Cusp Sub Lord (CSL)</th>
                    <th className="py-3 px-3 text-indigo-600 dark:text-indigo-400">Sub-Sub (CSSL)</th>
                    <th className="py-3 px-3">Occupants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-gray-200 font-medium">
                  {kpData.cusps.map((c) => (
                    <tr
                      key={c.cuspNumber}
                      className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-1 rounded-lg font-black font-mono text-xs bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                          Cusp {c.cuspNumber}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-amber-300">
                        {c.formattedDegree}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold">{c.sign}</span>
                        <span className="text-slate-400 text-[10.5px] ml-1">({c.signBn})</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-gray-300">{c.signLord}</td>
                      <td className="py-2.5 px-3">{c.nakshatra}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-gray-300">{c.starLord}</td>
                      <td className="py-2.5 px-3 font-black text-amber-700 dark:text-amber-300 bg-amber-500/5">
                        {c.subLord}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/5">
                        {c.subSubLord}
                      </td>
                      <td className="py-2.5 px-3">
                        {c.occupants.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {c.occupants.map((occ, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-400/40"
                              >
                                {occ}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 3: KP CHARTS (BHAV CHALIT & RASHI) */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'charts' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Interactive KP Bhava Chalit & Rashi Charts</span>
                  <span className="text-amber-600 dark:text-amber-400 text-sm font-normal">
                    (ভাভ চলিত ও রাশি চক্র)
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                  Compare traditional whole-sign Rashi placements against true Placidus unequal Bhava Chalit positions.
                </p>
              </div>

              {/* Chart Format Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Mode: Bhav Chalit vs Rashi */}
                <div className="flex items-center gap-1 bg-amber-100/60 dark:bg-[#1c2541] p-1 rounded-xl border border-amber-300/60 dark:border-[#3a506b]">
                  <button
                    onClick={() => setChartType('bhav')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartType === 'bhav'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-gray-300 hover:text-slate-950'
                    }`}
                  >
                    Bhav Chalit (KP)
                  </button>
                  <button
                    onClick={() => setChartType('rashi')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartType === 'rashi'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-gray-300 hover:text-slate-950'
                    }`}
                  >
                    Rashi (D1)
                  </button>
                </div>

                {/* Style: Bengali vs North vs South */}
                <div className="flex items-center gap-1 bg-amber-100/60 dark:bg-[#1c2541] p-1 rounded-xl border border-amber-300/60 dark:border-[#3a506b]">
                  <button
                    onClick={() => setChartStyle('bengali')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartStyle === 'bengali'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-gray-300 hover:text-slate-950'
                    }`}
                  >
                    Bengali (মণিপুরী)
                  </button>
                  <button
                    onClick={() => setChartStyle('north')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartStyle === 'north'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-gray-300 hover:text-slate-950'
                    }`}
                  >
                    North Indian
                  </button>
                  <button
                    onClick={() => setChartStyle('south')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartStyle === 'south'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-gray-300 hover:text-slate-950'
                    }`}
                  >
                    South Indian
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Canvas Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] shadow-md flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600 dark:text-amber-400">
                  {chartType === 'bhav' ? 'Nirayana Placidus Bhava Chalit' : 'Natal Rashi Chakra (D1)'}
                </span>
                <h4 className="text-base font-serif font-bold text-slate-900 dark:text-white">
                  {chartType === 'bhav'
                    ? 'Planets Placed According to Exact KP Bhava Cusps'
                    : 'Planets Placed According to Zodiac Signs (Rashis)'}
                </h4>
              </div>

              <div className="w-full max-w-[440px] flex justify-center">
                {chartStyle === 'bengali' ? (
                  <BengaliChart
                    title={chartType === 'bhav' ? 'KP Bhav Chalit' : 'KP Rashi Chart'}
                    planets={kpData.planets.map((p) => ({
                      name: p.name,
                      abbr: p.abbr,
                      houseNumber: chartType === 'bhav' ? p.cusp : p.signIndex + 1,
                      isRetrograde: p.isRetrograde,
                      signDegree: p.signDegree,
                    }))}
                    ascendantSign={lagnaCusp.signIndex}
                    theme="light"
                  />
                ) : chartStyle === 'north' ? (
                  <NorthIndianChart
                    planets={kpData.planets.map((p) => ({
                      name: p.name,
                      abbr: p.abbr,
                      houseNumber: chartType === 'bhav' ? p.cusp : ((p.signIndex - lagnaCusp.signIndex + 12) % 12) + 1,
                      isRetrograde: p.isRetrograde,
                    }))}
                    signs={Array.from({ length: 12 }, (_, i) => ((lagnaCusp.signIndex + i) % 12) + 1)}
                    ascendantSign={lagnaCusp.signIndex + 1}
                  />
                ) : (
                  <SouthIndianChart
                    title={chartType === 'bhav' ? 'KP Bhav Chalit' : 'KP Rashi Chart'}
                    planets={kpData.planets.map((p) => ({
                      name: p.name,
                      abbr: p.abbr,
                      houseNumber: chartType === 'bhav' ? p.cusp : p.signIndex + 1,
                      isRetrograde: p.isRetrograde,
                    }))}
                    ascendantSign={lagnaCusp.signIndex + 1}
                  />
                )}
              </div>

              {/* Chart Explanation Notes */}
              <div className="w-full max-w-xl p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b] text-xs text-slate-600 dark:text-gray-300">
                <strong className="text-slate-900 dark:text-white">Why Bhav Chalit Matters in KP:</strong>
                <p className="mt-1">
                  Because house cusps in KP are unequal (Placidus semi-arc), a planet at early or late degrees of a sign may shift to an adjacent bhava. In KP predictions, the house occupied in the <strong>Bhav Chalit Chart</strong> takes precedence over the Rashi position.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 4: 4-FOLD SIGNIFICATORS */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'significators' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>KP 4-Fold Significators (কারকত্ব বিচার)</span>
                <span className="text-amber-600 dark:text-amber-400 text-sm font-normal">
                  (Grades A, B, C, D)
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                Scientific classification of planetary strength for each house: Grade A (Star of Occupant), Grade B (Occupant), Grade C (Star of House Lord), Grade D (House Lord).
              </p>
            </div>

            {/* House-Wise Significators Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                House-Wise Significators (১-১২ ভাব কারক)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {kpData.houseSignificators.map((hs) => (
                  <div
                    key={hs.houseNumber}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-[#3a506b] bg-white dark:bg-[#0b132b] shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="font-serif font-black text-sm text-slate-900 dark:text-white">
                        House {hs.houseNumber}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 font-bold">
                        Lord: {kpData.cusps[hs.houseNumber - 1]?.signLord}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0">
                          Grade A (Star of Occ):
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-right">
                          {hs.level1.length > 0 ? hs.level1.join(', ') : '-'}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">
                          Grade B (Occupants):
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-right">
                          {hs.level2.length > 0 ? hs.level2.join(', ') : '-'}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                          Grade C (Star of Lord):
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-right">
                          {hs.level3.length > 0 ? hs.level3.join(', ') : '-'}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                          Grade D (House Lord):
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-right">
                          {hs.level4.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Planet-Wise Significators Table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Planet-Wise House Significations (গ্রহ ভিত্তিক কারক ভাব)
              </h4>

              <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#3a506b] shadow-xs bg-white dark:bg-[#0b132b]">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead>
                    <tr className="bg-amber-50/70 dark:bg-[#1c2541] border-b border-slate-200 dark:border-[#3a506b] text-[10.5px] font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
                      <th className="py-3 px-3">Planet</th>
                      <th className="py-3 px-3">Star Lord (NL)</th>
                      <th className="py-3 px-3">Sub Lord (SL)</th>
                      <th className="py-3 px-3 text-rose-600 dark:text-rose-400">Level 1 (Strongest)</th>
                      <th className="py-3 px-3 text-amber-600 dark:text-amber-400">Level 2</th>
                      <th className="py-3 px-3 text-indigo-600 dark:text-indigo-400">Level 3</th>
                      <th className="py-3 px-3 text-emerald-600 dark:text-emerald-400">Level 4</th>
                      <th className="py-3 px-3 bg-amber-500/10 font-black text-amber-800 dark:text-amber-300">
                        Sub Lord Signifies
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-gray-200 font-medium">
                    {kpData.planetSignificators.map((ps) => (
                      <tr
                        key={ps.planet}
                        className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{ps.planetName}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-gray-300">{ps.starLord}</td>
                        <td className="py-2.5 px-3 font-bold text-amber-700 dark:text-amber-400">{ps.subLord}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-rose-700 dark:text-rose-400">
                          {ps.housesL1.length > 0 ? ps.housesL1.join(', ') : '-'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                          {ps.housesL2.length > 0 ? ps.housesL2.join(', ') : '-'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                          {ps.housesL3.length > 0 ? ps.housesL3.join(', ') : '-'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {ps.housesL4.length > 0 ? ps.housesL4.join(', ') : '-'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-black text-amber-900 dark:text-amber-200 bg-amber-500/5">
                          {ps.subLordSignifies.length > 0 ? ps.subLordSignifies.join(', ') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 5: RULING PLANETS (RP) */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'ruling' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  <span>KP Ruling Planets (RP - শাসক গ্রহ)</span>
                  <span className="text-amber-600 dark:text-amber-400 text-sm font-normal">
                    (Divine Time Indicators)
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                  The supreme beacon for Birth Time Rectification (BTR), Prashna queries, and event fruition timing.
                </p>
              </div>

              {/* Live RP toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setUseLiveRP(true);
                    setLiveRPTime(new Date());
                    showToast('Ruling Planets updated for current moment');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    useLiveRP
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-100 dark:bg-[#1c2541] text-amber-900 dark:text-amber-300 border border-amber-300/60'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{useLiveRP ? 'Live RP Active (Click to Refresh)' : 'Switch to Live Current Moment RP'}</span>
                </button>

                {useLiveRP && (
                  <button
                    onClick={() => setUseLiveRP(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    Reset to Natal RP
                  </button>
                )}
              </div>
            </div>

            {/* RP Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Lagna Ruling Planets */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 space-y-2">
                <span className="text-[10.5px] uppercase font-black tracking-wider text-amber-700 dark:text-amber-400 block">
                  1. Ascendant (Lagna) Lords
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-gray-400">Sign Lord:</span>
                    <strong className="text-slate-900 dark:text-white">{activeRP.ascSignLord}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-gray-400">Star Lord:</span>
                    <strong className="text-amber-700 dark:text-amber-300">{activeRP.ascStarLord}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-gray-400">Sub Lord:</span>
                    <strong className="text-indigo-700 dark:text-indigo-300">{activeRP.ascSubLord}</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Moon Ruling Planets */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-transparent border border-sky-500/30 space-y-2">
                <span className="text-[10.5px] uppercase font-black tracking-wider text-sky-700 dark:text-sky-400 block">
                  2. Moon (Chandra) Lords
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-gray-400">Sign Lord:</span>
                    <strong className="text-slate-900 dark:text-white">{activeRP.moonSignLord}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-gray-400">Star Lord:</span>
                    <strong className="text-sky-700 dark:text-sky-300">{activeRP.moonStarLord}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-gray-400">Sub Lord:</span>
                    <strong className="text-indigo-700 dark:text-indigo-300">{activeRP.moonSubLord}</strong>
                  </div>
                </div>
              </div>

              {/* Card 3: Day Lord */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 space-y-2">
                <span className="text-[10.5px] uppercase font-black tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  3. Day Lord (Vara Lord)
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 dark:text-gray-400">Ruler of the Day:</span>
                    <strong className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                      {activeRP.dayLord}
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">
                    Governs the natural elemental prana for this cycle.
                  </p>
                </div>
              </div>

              {/* Card 4: Nodes (Rahu / Ketu) Representation */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 space-y-2">
                <span className="text-[10.5px] uppercase font-black tracking-wider text-purple-700 dark:text-purple-400 block">
                  4. Shadow Nodes (Agents)
                </span>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-gray-400 text-[11px]">Rahu acts for:</span>
                    <div className="font-bold text-purple-700 dark:text-purple-300">
                      {activeRP.rahuRepresents.length > 0 ? activeRP.rahuRepresents.join(', ') : 'None'}
                    </div>
                  </div>
                  <div className="pt-1 border-t border-purple-500/20">
                    <span className="text-slate-500 dark:text-gray-400 text-[11px]">Ketu acts for:</span>
                    <div className="font-bold text-purple-700 dark:text-purple-300">
                      {activeRP.ketuRepresents.length > 0 ? activeRP.ketuRepresents.join(', ') : 'None'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Combined RP Summary Pill Strip */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Primary Ruling Planets List for Timing & BTR:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeRP.rulingPlanetsSummary.map((rp, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-900 dark:text-amber-300 shadow-2xs"
                  >
                    #{idx + 1} {rp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 6: HORARY 1-249 ENGINE */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'horary' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  <span>KP Horary (Prashna) 1–249 Engine</span>
                  <span className="text-amber-600 dark:text-amber-400 text-sm font-normal">
                    (কৃষ্ণমূর্তি প্রশ্না ২৪৯)
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                  Select or enter client&apos;s chosen seed number (1 to 249) to lock the Horary Ascendant and generate instant Prashna charts.
                </p>
              </div>

              {/* Number Input Box */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={249}
                  value={horaryNumberInput}
                  onChange={(e) => setHoraryNumberInput(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-xl border border-amber-400 bg-white dark:bg-[#1c2541] font-mono font-bold text-sm text-center text-amber-900 dark:text-amber-300 focus:outline-none"
                  placeholder="1-249"
                />
                <button
                  onClick={() => {
                    setActiveHoraryNumber(horaryNumberInput);
                    showToast(`Horary chart locked for seed #${horaryNumberInput}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black text-xs shadow-md hover:scale-102 transition-all cursor-pointer"
                >
                  Apply Horary #{horaryNumberInput}
                </button>
                <button
                  onClick={() => {
                    const rnd = Math.floor(Math.random() * 249) + 1;
                    setHoraryNumberInput(rnd);
                    setActiveHoraryNumber(rnd);
                    showToast(`Random Horary seed #${rnd} applied`);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-300"
                >
                  🎲 Random Seed
                </button>
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={horarySearch}
                onChange={(e) => setHorarySearch(e.target.value)}
                placeholder="Search 249 Table by Sign, Nakshatra, Star Lord, or Sub Lord..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#3a506b] bg-white dark:bg-[#0b132b] text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* 249 Table Browser */}
            <div className="max-h-[500px] overflow-y-auto rounded-2xl border border-slate-200 dark:border-[#3a506b] shadow-xs bg-white dark:bg-[#0b132b]">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead className="sticky top-0 bg-amber-50 dark:bg-[#1c2541] z-10 border-b border-slate-200 dark:border-[#3a506b] text-[10.5px] font-black text-slate-600 dark:text-gray-300 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">No.</th>
                    <th className="py-2.5 px-3">Sign</th>
                    <th className="py-2.5 px-3">Sign Lord (RL)</th>
                    <th className="py-2.5 px-3">Nakshatra</th>
                    <th className="py-2.5 px-3">Star Lord (NL)</th>
                    <th className="py-2.5 px-3 text-amber-600 dark:text-amber-400">Sub Lord (SL)</th>
                    <th className="py-2.5 px-3">Degrees in Sign</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-gray-200 font-medium">
                  {filtered249.map((row) => {
                    const isSelected = activeHoraryNumber === row.number;
                    return (
                      <tr
                        key={row.number}
                        className={`hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors ${
                          isSelected ? 'bg-amber-500/15 dark:bg-amber-500/20 font-bold' : ''
                        }`}
                      >
                        <td className="py-2 px-3 font-mono font-black text-amber-800 dark:text-amber-400">
                          #{row.number}
                        </td>
                        <td className="py-2 px-3 font-semibold">{row.sign}</td>
                        <td className="py-2 px-3">{row.signLord}</td>
                        <td className="py-2 px-3">{row.nakshatra}</td>
                        <td className="py-2 px-3">{row.starLord}</td>
                        <td className="py-2 px-3 font-black text-amber-700 dark:text-amber-300">{row.subLord}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dark:text-gray-400">
                          {formatDms(row.fromDegSign)} – {formatDms(row.toDegSign)}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => {
                              setHoraryNumberInput(row.number);
                              setActiveHoraryNumber(row.number);
                              showToast(`Horary #${row.number} applied to Workstation`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-200 text-slate-700 dark:text-gray-300'
                            }`}
                          >
                            {isSelected ? 'Active ✓' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 7: CUSPAL INTERLINKS & EVENT VERDICTS */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'interlinks' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>KP Cuspal Interlinks & Key Event Analysis</span>
                <span className="text-amber-600 dark:text-amber-400 text-sm font-normal">
                  (ঘটনা বিশ্লেষণ ও কার্য সিদ্ধি)
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                Automated KP Cusp Sub Lord (CSL) evaluation across core life domains: Marriage, Job, Wealth, Child, Property, Health, Education.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpData.eventVerdicts.map((ev) => {
                const isFav = ev.verdict === 'Strongly Favorable' || ev.verdict === 'Favorable';
                const isUnfav = ev.verdict === 'Unfavorable';

                return (
                  <div
                    key={ev.id}
                    className={`p-4 rounded-3xl border shadow-xs transition-all space-y-3 ${
                      isFav
                        ? 'bg-gradient-to-br from-emerald-500/10 via-white to-transparent dark:from-emerald-950/40 dark:via-[#0b132b] dark:to-transparent border-emerald-500/40'
                        : isUnfav
                        ? 'bg-gradient-to-br from-rose-500/10 via-white to-transparent dark:from-rose-950/40 dark:via-[#0b132b] dark:to-transparent border-rose-500/40'
                        : 'bg-gradient-to-br from-amber-500/10 via-white to-transparent dark:from-amber-950/40 dark:via-[#0b132b] dark:to-transparent border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400 block">
                          Primary Cusp {ev.primaryCusp}
                        </span>
                        <h4 className="font-serif font-black text-base text-slate-900 dark:text-white">
                          {ev.title}
                        </h4>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[10.5px] font-black border ${
                          isFav
                            ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
                            : isUnfav
                            ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {ev.verdict}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-gray-400">Cusp {ev.primaryCusp} Sub Lord:</span>
                        <strong className="text-amber-700 dark:text-amber-400">{ev.subLord}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-gray-400">Favorable Houses:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {ev.favorableHouses.join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-gray-400">Detrimental Houses:</span>
                        <span className="font-bold text-rose-700 dark:text-rose-400">
                          {ev.unfavorableHouses.join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-gray-400">Houses Signified:</span>
                        <strong className="text-slate-900 dark:text-white font-bold">
                          {ev.signifiedHouses.length > 0 ? ev.signifiedHouses.join(', ') : 'None'}
                        </strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed font-sans pt-1 border-t border-slate-100 dark:border-slate-800">
                      {ev.analysisText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 8: RUNNING DASHA & KP DASHA PREDICTIONS */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'dasha' && kpData.dashaPrediction && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>Current Running Dasha & KP Predictive Analysis</span>
                <span className="text-amber-600 dark:text-amber-400 text-sm font-normal">
                  (বর্তমান দশা ফল ও ভবিষ্যৎবাণী)
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                Authentic Krishnamurti Paddhati dasha synthesis: Mahadasha sets the karmic arena, Antardasha delivers the fruition, and Pratyantardasha triggers the exact timing.
              </p>
            </div>

            {/* HERO CARD: RUNNING DASHA TRIO */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-amber-700/15 border border-amber-500/30 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md">
                    ⏳
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                      Active Vimshottari Period
                    </span>
                    <h4 className="text-lg font-serif font-black text-slate-900 dark:text-white">
                      {kpData.dashaPrediction.currentDasha.maha.lord} (মহাদ্দশা) — {kpData.dashaPrediction.currentDasha.antar.lord} (অন্তর্দশা)
                      {kpData.dashaPrediction.currentDasha.pratyantar
                        ? ` — ${kpData.dashaPrediction.currentDasha.pratyantar.lord} (প্রত্যন্তর্দশা)`
                        : ''}
                    </h4>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-[#0b132b] border border-amber-500/40 text-xs font-mono font-bold text-amber-900 dark:text-amber-300 shadow-2xs">
                  Countdown: {kpData.dashaPrediction.currentDasha.antar.remainingText}
                </div>
              </div>

              {/* 3 Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mahadasha Card */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] shadow-2xs space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold uppercase text-[10px] text-amber-700 dark:text-amber-400">
                      1. Mahadasha (MD)
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {kpData.dashaPrediction.currentDasha.maha.progressPercent}%
                    </span>
                  </div>
                  <div className="text-base font-serif font-black text-slate-900 dark:text-white">
                    {kpData.dashaPrediction.currentDasha.maha.lord}{' '}
                    <span className="text-xs font-normal text-slate-400">
                      ({kpData.dashaPrediction.currentDasha.maha.lordBn})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${kpData.dashaPrediction.currentDasha.maha.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10.5px] font-mono text-slate-500 dark:text-gray-400 pt-0.5">
                    <span>{kpData.dashaPrediction.currentDasha.maha.startDateStr}</span>
                    <span>{kpData.dashaPrediction.currentDasha.maha.endDateStr}</span>
                  </div>
                </div>

                {/* Antardasha Card */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0b132b] border border-amber-400/50 dark:border-amber-500/40 shadow-xs space-y-2 ring-1 ring-amber-400/30">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold uppercase text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <span>2. Antardasha (AD / Bhukti)</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {kpData.dashaPrediction.currentDasha.antar.progressPercent}%
                    </span>
                  </div>
                  <div className="text-base font-serif font-black text-amber-700 dark:text-amber-300">
                    {kpData.dashaPrediction.currentDasha.antar.lord}{' '}
                    <span className="text-xs font-normal text-slate-400">
                      ({kpData.dashaPrediction.currentDasha.antar.lordBn})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${kpData.dashaPrediction.currentDasha.antar.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10.5px] font-mono text-slate-500 dark:text-gray-400 pt-0.5">
                    <span>{kpData.dashaPrediction.currentDasha.antar.startDateStr}</span>
                    <span>{kpData.dashaPrediction.currentDasha.antar.endDateStr}</span>
                  </div>
                </div>

                {/* Pratyantardasha Card */}
                {kpData.dashaPrediction.currentDasha.pratyantar ? (
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] shadow-2xs space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold uppercase text-[10px] text-indigo-700 dark:text-indigo-400">
                        3. Pratyantar (PD)
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {kpData.dashaPrediction.currentDasha.pratyantar.progressPercent}%
                      </span>
                    </div>
                    <div className="text-base font-serif font-black text-slate-900 dark:text-white">
                      {kpData.dashaPrediction.currentDasha.pratyantar.lord}{' '}
                      <span className="text-xs font-normal text-slate-400">
                        ({kpData.dashaPrediction.currentDasha.pratyantar.lordBn})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${kpData.dashaPrediction.currentDasha.pratyantar.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10.5px] font-mono text-slate-500 dark:text-gray-400 pt-0.5">
                      <span>{kpData.dashaPrediction.currentDasha.pratyantar.startDateStr}</span>
                      <span>{kpData.dashaPrediction.currentDasha.pratyantar.endDateStr}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                    Pratyantar calculated dynamically
                  </div>
                )}
              </div>
            </div>

            {/* DASHA LORDS KP SIGNIFICATORS MATRIX */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                KP Significations of Active Dasha Lords (দশা পতিদের কারক ভাব)
              </h4>

              <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#3a506b] shadow-xs bg-white dark:bg-[#0b132b]">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead>
                    <tr className="bg-amber-50/70 dark:bg-[#1c2541] border-b border-slate-200 dark:border-[#3a506b] text-[10.5px] font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
                      <th className="py-3 px-3">Dasha Level</th>
                      <th className="py-3 px-3">Planet Ruler</th>
                      <th className="py-3 px-3">Star Lord (NL)</th>
                      <th className="py-3 px-3 text-amber-600 dark:text-amber-400">Sub Lord (SL)</th>
                      <th className="py-3 px-3">All Signified Houses</th>
                      <th className="py-3 px-3 text-emerald-600 dark:text-emerald-400">Sub Lord Signifies</th>
                      <th className="py-3 px-3">KP Astrological Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-gray-200 font-medium">
                    {kpData.dashaPrediction.dashaLordsSignifications.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors"
                      >
                        <td className="py-3 px-3 font-bold text-amber-800 dark:text-amber-300">
                          {row.role}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-serif font-black text-slate-900 dark:text-white">
                            {row.planetName}
                          </span>
                          <span className="text-slate-400 text-[10.5px] ml-1">({row.planetNameBn})</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700 dark:text-gray-300">
                          {row.starLord}
                        </td>
                        <td className="py-3 px-3 font-bold text-amber-700 dark:text-amber-300 bg-amber-500/5">
                          {row.subLord}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          [{row.allSignifiedHouses.join(', ') || '-'}]
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">
                          [{row.subLordHouses.join(', ') || '-'}]
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-gray-400 font-sans">
                          {row.kpRole}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DOMAIN PREDICTIONS GRID */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Detailed KP Life Predictions for Current Dasha (দশা ভিত্তিক ভবিষ্যৎ বিচার)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpData.dashaPrediction.predictions.map((p) => {
                  const isHighFav = p.status === 'Highly Favorable';
                  const isFav = p.status === 'Favorable';
                  const isChal = p.status === 'Challenging / Obstacles';

                  return (
                    <div
                      key={p.category}
                      className={`p-4 rounded-3xl border shadow-xs transition-all space-y-3 ${
                        isHighFav
                          ? 'bg-gradient-to-br from-emerald-500/10 via-white to-transparent dark:from-emerald-950/40 dark:via-[#0b132b] dark:to-transparent border-emerald-500/40'
                          : isFav
                          ? 'bg-gradient-to-br from-sky-500/10 via-white to-transparent dark:from-sky-950/40 dark:via-[#0b132b] dark:to-transparent border-sky-500/40'
                          : isChal
                          ? 'bg-gradient-to-br from-rose-500/10 via-white to-transparent dark:from-rose-950/40 dark:via-[#0b132b] dark:to-transparent border-rose-500/40'
                          : 'bg-gradient-to-br from-amber-500/10 via-white to-transparent dark:from-amber-950/40 dark:via-[#0b132b] dark:to-transparent border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                        <div>
                          <h5 className="font-serif font-black text-base text-slate-900 dark:text-white">
                            {p.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-sans block">{p.titleBn}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${
                            isHighFav || isFav
                              ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
                              : isChal
                              ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800 dark:text-gray-100 leading-snug">
                        {p.summary}
                      </p>

                      <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
                        {p.detailedAnalysis}
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b] text-[10.5px] font-mono text-slate-700 dark:text-gray-300">
                        {p.kpSignificationsText}
                      </div>

                      {p.remedyTips.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                          <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 block">
                            KP Remedial Advice:
                          </span>
                          {p.remedyTips.map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[10.5px] text-slate-600 dark:text-gray-400 font-sans">
                              <span className="text-amber-500">•</span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 120-YEAR VIMSHOTTARI TIMELINE BROWSER */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="font-serif font-black text-base text-slate-900 dark:text-white">
                    Complete 120-Year Vimshottari Timeline Browser
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Click any Mahadasha to inspect all 9 Antardashas and Pratyantardashas throughout the native&apos;s lifespan.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {kpData.dashaPrediction.allMahadashas.map((md) => {
                  const isCurrentMD = md.lord === kpData.dashaPrediction?.currentDasha.maha.lord;
                  const isExpanded = expandedMahaLord === md.lord;

                  return (
                    <div
                      key={md.lord}
                      className={`rounded-2xl border transition-all ${
                        isCurrentMD
                          ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/10'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
                      }`}
                    >
                      {/* Mahadasha Header Row */}
                      <button
                        onClick={() => setExpandedMahaLord(isExpanded ? null : md.lord)}
                        className="w-full p-3.5 flex items-center justify-between text-xs font-sans text-left cursor-pointer hover:bg-amber-100/30 rounded-2xl"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              isCurrentMD
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-gray-300'
                            }`}
                          >
                            {md.lord.substring(0, 2)}
                          </span>
                          <div>
                            <span className="font-serif font-black text-sm text-slate-900 dark:text-white">
                              {md.lord} Mahadasha ({md.durationYears} Years)
                            </span>
                            {isCurrentMD && (
                              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                                Currently Running
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-gray-400">
                          <span>
                            {md.startDateStr} — {md.endDateStr}
                          </span>
                          <span className="text-amber-600 font-bold">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </button>

                      {/* Expanded Antardashas */}
                      {isExpanded && md.subPeriods && (
                        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070c1a] rounded-b-2xl space-y-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2">
                            9 Antardashas within {md.lord} Mahadasha:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {md.subPeriods.map((ad) => {
                              const isCurrentAD =
                                isCurrentMD && ad.lord === kpData.dashaPrediction?.currentDasha.antar.lord;
                              return (
                                <div
                                  key={ad.lord}
                                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                                    isCurrentAD
                                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-950 dark:text-amber-200 font-bold'
                                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-gray-300'
                                  }`}
                                >
                                  <div>
                                    <span>
                                      {md.lord} - {ad.lord}
                                    </span>
                                    {isCurrentAD && (
                                      <span className="ml-1 text-[9.5px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <span className="font-mono text-[10px] opacity-75">
                                    {ad.startDateStr}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 9: QW EXCEL RESULT SHEET PREDICTION PAGE */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'resultsheet' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Toolbar & Sub-Mode Switcher */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] shadow-xs flex flex-wrap items-center justify-between gap-3">
              {/* 3 Sub-Tabs: Meitei Mayek, Sanamahi, Hinduism */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => setSheetMode('Meitei Mayek')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    sheetMode === 'Meitei Mayek'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>📜</span>
                  <span>Meitei Mayek</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                      sheetMode === 'Meitei Mayek'
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    Budha.ttf
                  </span>
                </button>

                <button
                  onClick={() => setSheetMode('Sanamahi')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    sheetMode === 'Sanamahi'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>🪶</span>
                  <span>Sanamahi</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                      sheetMode === 'Sanamahi'
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    BLipi15
                  </span>
                </button>

                <button
                  onClick={() => setSheetMode('Hinduism')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    sheetMode === 'Hinduism'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>🕉️</span>
                  <span>Hinduism</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                      sheetMode === 'Hinduism'
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    Vedic Result
                  </span>
                </button>
              </div>

              {/* Actions & Header Edit */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSheetHeaderEdit((prev) => !prev)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span>Astrologer Details</span>
                  {showSheetHeaderEdit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleCopyResultSheet}
                  className="px-3 py-1.5 rounded-xl border border-amber-400/50 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/50"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Sheet</span>
                </button>

                <button
                  onClick={handlePrintResultSheet}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Collapsible Astrologer Header Edit Form */}
            {showSheetHeaderEdit && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-[#151f38] border border-amber-300 dark:border-amber-500/40 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-black text-sm text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <span>👑</span>
                    <span>Customize Astrologer & Consultation Header</span>
                  </h4>
                  <button
                    onClick={() => setShowSheetHeaderEdit(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-gray-400 cursor-pointer"
                  >
                    Done
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-gray-400 mb-1">
                      Astrologer Name
                    </label>
                    <input
                      type="text"
                      value={astrologerName}
                      onChange={(e) => setAstrologerName(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-gray-400 mb-1">
                      Title / Specialty
                    </label>
                    <input
                      type="text"
                      value={astrologerTitle}
                      onChange={(e) => setAstrologerTitle(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-gray-400 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-gray-400 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-gray-400 mb-1">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      value={refNo}
                      onChange={(e) => setRefNo(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-gray-400 mb-1">
                      Consultation Date
                    </label>
                    <input
                      type="text"
                      value={consultDate}
                      onChange={(e) => setConsultDate(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── THE AUTHENTIC QW EXCEL RESULT SHEET DOCUMENT ── */}
            <div className="max-w-5xl mx-auto">
              <div className="border-2 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 transition-all relative bg-white dark:bg-[#151f38] border-amber-300 dark:border-amber-500/40 text-slate-900 dark:text-white">
                {/* Ornamental Border Frame */}
                <div className="absolute inset-2.5 border border-amber-400/25 rounded-2xl pointer-events-none" />

                {/* HEADER SECTION */}
                <div className="text-center space-y-2 border-b border-amber-400/30 pb-6">
                  <h1 className="font-serif font-black text-2xl md:text-3xl tracking-wide text-[#78350f] dark:text-amber-300">
                    {astrologerName}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-semibold opacity-90">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 font-mono">
                      {astrologerTitle}
                    </span>
                    <span>•</span>
                    <span>{address}</span>
                    <span>•</span>
                    <span className="font-mono">{contactNo}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between text-xs font-mono pt-3 opacity-80 border-t border-amber-400/20">
                    <span>{refNo}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-blipi font-bold text-sm text-amber-600 dark:text-amber-400">
                        {sheetMode === 'Meitei Mayek' ? 'taZ :- ' : 'taz:- '}
                      </span>
                      <span>{consultDate}</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 1: NATIVE BIRTH PARTICULARS */}
                <div className="rounded-2xl p-4 sm:p-5 border space-y-3 bg-[#faf6ee] dark:bg-[#0b132b]/80 border-[#e2d5c4] dark:border-[#3a506b]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                        Name / Client:
                      </span>
                      <span className="font-serif font-black text-sm text-amber-600 dark:text-amber-400">
                        {formData.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                        Date of Birth:
                      </span>
                      <span className="font-mono font-bold text-sm">
                        {sheetNativeDetails.formattedDob}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                        Birth Time:
                      </span>
                      <span className="font-mono font-bold text-sm">
                        {sheetNativeDetails.formattedTob}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                        Birthday / Weekday:
                      </span>
                      <span className="font-bold text-sm">
                        {sheetNativeDetails.dayInfo.en} ({sheetNativeDetails.dayInfo.bn})
                      </span>
                    </div>
                  </div>

                  {/* AGE & RUNNING YEAR */}
                  <div className="pt-2 border-t border-[#e2d5c4] dark:border-[#3a506b]/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">Native Age:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {sheetNativeDetails.ageInfo?.years ?? 0} Years, {sheetNativeDetails.ageInfo?.months ?? 0} Months, {sheetNativeDetails.ageInfo?.days ?? 0} Days
                      </span>
                    </div>
                    <div className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-extrabold text-[11px]">
                      Running {sheetNativeDetails.ageInfo?.runningYear ?? 0}th Year
                    </div>
                  </div>

                  {/* ASTROLOGICAL MARKS: RASHI, LAGNA, NAKSHATRA */}
                  <div className="pt-3 border-t border-[#e2d5c4] dark:border-[#3a506b]/40 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                        {sheetMode === 'Meitei Mayek' ? 'rasi (Moon Sign):' : 'raiS (রাশি):'}
                      </span>
                      <span
                        className={`font-bold text-base ${
                          sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                        }`}
                      >
                        {sheetMode === 'Meitei Mayek'
                          ? sheetNativeDetails.rashi.mm
                          : sheetNativeDetails.rashi.blipi}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                        {sheetMode === 'Meitei Mayek' ? 'lg_n (Ascendant):' : 'lgx (লগ্ন):'}
                      </span>
                      <span
                        className={`font-bold text-base ${
                          sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                        }`}
                      >
                        {sheetMode === 'Meitei Mayek'
                          ? sheetNativeDetails.lagna.mm
                          : sheetNativeDetails.lagna.blipi}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                        {sheetMode === 'Meitei Mayek' ? 'YwaNmicaK (Nakshatra):' : 'Twanimcak (নক্ষত্র):'}
                      </span>
                      <span
                        className={`font-bold text-base ${
                          sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                        }`}
                      >
                        {sheetMode === 'Meitei Mayek'
                          ? sheetNativeDetails.nakshatra.mm
                          : sheetNativeDetails.nakshatra.blipi}
                      </span>
                      <span
                        className={`text-[11px] block text-slate-400 mt-0.5 ${
                          sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                        }`}
                      >
                        {getSheetVal(8, 'G', '')}
                      </span>
                    </div>
                  </div>

                  {/* KP SUB-LORD CERTIFICATION STRIP */}
                  <div className="pt-2.5 border-t border-[#e2d5c4] dark:border-[#3a506b]/40 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600 dark:text-gray-300">
                    <div>
                      <span className="text-slate-400">Lagna Sub Lord: </span>
                      <strong className="text-amber-600 dark:text-amber-400">{lagnaCusp.subLord}</strong> (Star: {lagnaCusp.starLord})
                    </div>
                    <div>
                      <span className="text-slate-400">Moon Sub Lord: </span>
                      <strong className="text-sky-600 dark:text-sky-400">{moonPlanet.subLord}</strong> (Star: {moonPlanet.starLord})
                    </div>
                    <div>
                      <span className="text-slate-400">KP Ayanamsha: </span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{kpData.kpAyanamsaStr}</strong>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: LUCKY NUMBERS & ATTRIBUTES */}
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-sm flex items-center gap-2 text-[#78350f] dark:text-amber-300">
                    <span>🍀</span> Lucky Numbers & Planetary Energies
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-3 rounded-2xl border bg-[#faf6ee] dark:bg-[#0b132b] border-[#e2d5c4] dark:border-[#3a506b]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Lucky No.
                      </span>
                      <span className="font-mono font-black text-xl text-amber-500">
                        {getSheetVal(12, 'A', '2')}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl border bg-[#faf6ee] dark:bg-[#0b132b] border-[#e2d5c4] dark:border-[#3a506b]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Good Numbers
                      </span>
                      <span className="font-mono font-bold text-base text-emerald-500">
                        {getSheetVal(12, 'C', '1, 7, 9')}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl border bg-[#faf6ee] dark:bg-[#0b132b] border-[#e2d5c4] dark:border-[#3a506b]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Lucky Stone
                      </span>
                      <span className="font-bold text-base text-rose-500">
                        {getSheetVal(12, 'E', 'Ruby')}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl border bg-[#faf6ee] dark:bg-[#0b132b] border-[#e2d5c4] dark:border-[#3a506b]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Lucky Metal
                      </span>
                      <span className="font-bold text-base text-amber-600">
                        {getSheetVal(12, 'G', 'Copper')}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl border col-span-2 sm:col-span-1 bg-[#faf6ee] dark:bg-[#0b132b] border-[#e2d5c4] dark:border-[#3a506b]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Lucky Direction
                      </span>
                      <span className="font-bold text-base text-sky-500">
                        {getSheetVal(12, 'I', 'East')}
                      </span>
                    </div>
                  </div>

                  {/* Lucky Colours Banner */}
                  <div className="p-3 rounded-2xl border text-xs leading-relaxed flex items-center gap-2 bg-amber-50/70 dark:bg-[#0b132b] border-amber-200 dark:border-amber-500/20 text-amber-950 dark:text-slate-200">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <strong>Lucky Colours: </strong>
                      <span className={sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}>
                        {getSheetVal(10, 'C', '')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: 8 DIRECTIONAL GUIDANCE TABLE */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-sm flex items-center gap-2 text-[#78350f] dark:text-amber-300">
                      <Compass className="w-4 h-4 text-amber-500" />
                      <span className="font-blipi font-bold text-sm">
                        {sheetMode === 'Meitei Mayek'
                          ? 'chi taZkK Asid lM cTpgi maIkEsiZgi Af-fTt mHad pijri:-'
                          : 'cih tazk(I mtaz Aisda lm c\\pgI mah~e~kiSzgI Af-fo_ mKada pIjir:-'}
                      </span>
                    </h3>
                  </div>

                  <div className="rounded-2xl border overflow-hidden border-[#e2d5c4] dark:border-[#3a506b]">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-500/20 text-xs">
                      {/* Column 1 */}
                      <div className="divide-y divide-gray-500/20">
                        <div className="p-3 flex items-start justify-between gap-3">
                          <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                            {getSheetVal(14, 'A', 'noZpoK :-')}
                          </span>
                          <span className={`text-right ${sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                            {getSheetVal(14, 'C', '') || getSheetVal(14, 'B', '')}
                          </span>
                        </div>
                        <div className="p-3 flex items-start justify-between gap-3">
                          <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                            {getSheetVal(15, 'A', 'ciZHE :-')}
                          </span>
                          <span className={`text-right ${sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                            {getSheetVal(15, 'C', '') || getSheetVal(15, 'B', '')}
                          </span>
                        </div>
                        <div className="p-3 flex items-start justify-between gap-3">
                          <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                            {getSheetVal(16, 'A', 'AwaZ :-')}
                          </span>
                          <span className={`text-right ${sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                            {getSheetVal(16, 'C', '') || getSheetVal(16, 'B', '')}
                          </span>
                        </div>
                        <div className="p-3 flex items-start justify-between gap-3">
                          <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                            {getSheetVal(17, 'A', 'kOb_ru :-')}
                          </span>
                          <span className={`text-right ${sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                            {getSheetVal(17, 'C', '') || getSheetVal(17, 'B', '')}
                          </span>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="divide-y divide-gray-500/20">
                        <div className="p-3 flex items-start justify-between gap-3">
                          <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                            {getSheetVal(18, 'A', 'noZcuP :-')}
                          </span>
                          <span className={`text-right ${sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                            {getSheetVal(18, 'C', '') || getSheetVal(18, 'B', '')}
                          </span>
                        </div>
                        <div className="p-3 flex items-start justify-between gap-3">
                          <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                            {getSheetVal(19, 'A', 'sNYoZ :-')}
                          </span>
                          <span className={`text-right ${sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                            {getSheetVal(19, 'C', '') || getSheetVal(19, 'B', '')}
                          </span>
                        </div>
                        <div className="p-3 flex items-start justify-between gap-3">
                          <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                            {getSheetVal(20, 'A', 'mHa :-')}
                          </span>
                          <span className={`text-right ${sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                            {getSheetVal(20, 'C', '') || getSheetVal(20, 'B', '')}
                          </span>
                        </div>
                        <div className="p-3 flex items-start justify-between gap-3">
                          <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                            {getSheetVal(21, 'A', 'mErM :-')}
                          </span>
                          <span className={`text-right ${sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                            {getSheetVal(21, 'C', '') || getSheetVal(21, 'B', '')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: DETAILED LIFE PREDICTIONS & RUNNING DASHA TIMELINE NARRATIVE */}
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-sm flex items-center gap-2 text-[#78350f] dark:text-amber-300">
                    <span>📜</span> Detailed Life Predictions & Running Dasha Timeline (Row 23)
                  </h3>

                  {/* Authentic Row 23 Narrative from qw.xlsm */}
                  <div
                    className={`p-5 rounded-2xl border leading-relaxed text-sm tracking-wide bg-[#faf6ee] dark:bg-[#0b132b] border-[#e2d5c4] dark:border-[#3a506b] text-slate-900 dark:text-slate-100 shadow-xs ${
                      sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                    }`}
                    style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
                  >
                    {dynamicNarrative}
                  </div>

                  {/* KP Dasha Integrated Synthesis Card */}
                  {kpData.dashaPrediction && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-amber-700/10 border border-amber-500/30 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <h4 className="font-serif font-black text-sm text-amber-900 dark:text-amber-300">
                            KP Real-Time Dasha Synthesis ({kpData.dashaPrediction.currentDasha.maha.lord} - {kpData.dashaPrediction.currentDasha.antar.lord})
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded bg-amber-500/15">
                          Remaining: {kpData.dashaPrediction.currentDasha.antar.remainingText}
                        </span>
                      </div>

                      {/* 4 Life Domains at a Glance */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        {kpData.dashaPrediction.predictions
                          .filter((p) => p.category !== 'overview')
                          .slice(0, 4)
                          .map((pred, idx) => {
                            const isFav = pred.status === 'Highly Favorable' || pred.status === 'Favorable';
                            const isMix = pred.status === 'Mixed / Transitional';
                            const statusColor = isFav
                              ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                              : isMix
                              ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30';
                            return (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0b132b]/80 space-y-1"
                              >
                                <div className="font-bold text-[11px] text-slate-500 dark:text-slate-400">
                                  {pred.title}
                                </div>
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${statusColor}`}>
                                  {pred.status}
                                </span>
                                <div className="text-[10.5px] text-slate-700 dark:text-gray-300 line-clamp-2">
                                  {pred.summary}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 5: REMEDIAL MEASURES (PRITIKAR 1 & 2) */}
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-sm flex items-center gap-2 text-[#78350f] dark:text-amber-300">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>
                      {sheetMode === 'Meitei Mayek'
                        ? 'p_rtikar nTtr_g AkoKloN (Remedial Ceremonies):'
                        : 'p[itkar nYga Aekakelan (Remedial Ceremonies):'}
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pritikar 1 */}
                    <div className="p-4 rounded-2xl border space-y-2 bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pritikar (1)</span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed font-medium ${
                          sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                        }`}
                      >
                        {getSheetVal(113, 'B', '') || getSheetVal(115, 'B', '') || getSheetVal(53, 'B', '')}
                      </p>
                    </div>

                    {/* Pritikar 2 */}
                    <div className="p-4 rounded-2xl border space-y-2 bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30 text-amber-950 dark:text-amber-200">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pritikar (2)</span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed font-medium ${
                          sheetMode === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                        }`}
                      >
                        {getSheetVal(114, 'B', '') || getSheetVal(116, 'B', '') || getSheetVal(54, 'B', '')}
                      </p>
                    </div>
                  </div>

                  {/* KP Sub Lord Planetary Remedy */}
                  {kpData.dashaPrediction && (
                    <div className="p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs flex flex-wrap items-center justify-between gap-3 text-indigo-950 dark:text-indigo-200">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span>
                          <strong>Recommended KP Dasha Guidance: </strong>
                          {kpData.dashaPrediction.predictions
                            .flatMap((p) => p.remedyTips)
                            .slice(0, 2)
                            .join(' • ') || 'Strengthen Sub Lord significators with mindful planetary karma.'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* OFFICIAL VERIFICATION FOOTER */}
                <div className="text-center pt-4 border-t border-amber-400/20 text-[11px] text-slate-400">
                  Kanglei Kuthi Horoscopy • Generated via kuthiyengpham.in • Matched with qw.xlsm
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* EDIT BIRTH DATA MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0b132b] border border-amber-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                <span>Edit Native Birth Details</span>
              </h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormData({ ...editDraft });
                setShowEditForm(false);
                showToast('Birth details updated in KP Workstation');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editDraft.name}
                  onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={editDraft.dob}
                    onChange={(e) => setEditDraft({ ...editDraft, dob: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Time of Birth</label>
                  <input
                    type="time"
                    required
                    value={editDraft.tob}
                    onChange={(e) => setEditDraft({ ...editDraft, tob: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Gender</label>
                  <select
                    value={editDraft.sex}
                    onChange={(e) => setEditDraft({ ...editDraft, sex: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Place of Birth</label>
                  <input
                    type="text"
                    value={editDraft.pob}
                    onChange={(e) => setEditDraft({ ...editDraft, pob: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Latitude (°N)</label>
                  <input
                    type="number"
                    step="any"
                    value={editDraft.lat}
                    onChange={(e) => setEditDraft({ ...editDraft, lat: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Longitude (°E)</label>
                  <input
                    type="number"
                    step="any"
                    value={editDraft.lng}
                    onChange={(e) => setEditDraft({ ...editDraft, lng: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black"
                >
                  Save & Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOAST FEEDBACK */}
      {/* ───────────────────────────────────────────────────────────── */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
