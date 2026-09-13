'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Copy,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Compass,
  Sparkles,
  Sun,
  Moon,
  X,
  Share2,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
} from 'lucide-react';
import resultTemplates from '@/data/kuthiResultTemplates.json';

interface KuthiResultWorkstationProps {
  initialData?: {
    name?: string;
    dob?: string;
    tob?: string;
    day?: string;
    pob?: string;
    rashi?: string;
    lagna?: string;
    nakshatra?: string;
  };
  theme?: 'dark' | 'light';
  onClose?: () => void;
}

type ResultTab = 'Result' | 'Meetei_Result' | 'MM_Result_M';

export default function KuthiResultWorkstation({
  initialData,
  theme: parentTheme,
  onClose,
}: KuthiResultWorkstationProps) {
  // Tab State
  const [activeTab, setActiveTab] = useState<ResultTab>('MM_Result_M');

  // Theme State
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(parentTheme || 'dark');
  const isDark = currentTheme === 'dark';

  // Native & Horoscope State (defaulted to Excel Kuthi reference case)
  const [name, setName] = useState<string>(initialData?.name || 'Moirangthem Suraj Singh');
  const [dob, setDob] = useState<string>(initialData?.dob || '2-7-1986 AD');
  const [tob, setTob] = useState<string>(initialData?.tob || '9:45 AM');
  const [day, setDay] = useState<string>(initialData?.day || 'Wednesday');
  const [pob, setPob] = useState<string>(initialData?.pob || 'Tentha Khunou Maning Leikai');
  const [refNo, setRefNo] = useState<string>('Ref. No.:- 2021   (20-04-2025)');
  const [consultDate, setConsultDate] = useState<string>('20-04-2025');

  // Astrologer Header Info
  const [astrologerName, setAstrologerName] = useState<string>('Moirangthem Suraj Singh');
  const [astrologerTitle, setAstrologerTitle] = useState<string>('Vedic Astro');
  const [contactNo, setContactNo] = useState<string>('Contact No.6002465337');
  const [address, setAddress] = useState<string>('Tentha Khunou Maning Leikai');

  // Copied Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Get template data for active tab
  const activeTemplate = useMemo(() => {
    const sheetData: any = (resultTemplates as any)[activeTab] || {};
    return sheetData;
  }, [activeTab]);

  // Dynamic helper to extract cell value with fallback
  const getVal = (row: number, col: string, fallback: string = '') => {
    const rowObj = activeTemplate[String(row)];
    if (rowObj && rowObj[col] && rowObj[col].val) {
      return rowObj[col].val;
    }
    return fallback;
  };

  // Copy Complete Report
  const handleCopyReport = () => {
    const reportNarrative = getVal(23, 'A', '');
    const reportText = `=====================================================
MANIPURI KUTHI HOROSCOPE RESULT (${activeTab})
=====================================================
Astrologer: ${astrologerName} (${astrologerTitle})
Address: ${address} | ${contactNo}
${refNo} | Date: ${consultDate}
-----------------------------------------------------
NATIVE PARTICULARS:
- Name: ${name}
- Date of Birth: ${dob} (${day})
- Birth Time: ${tob}
- Rashi: ${getVal(6, 'C', '')} ${getVal(6, 'E', '')}
- Lagna: ${getVal(7, 'C', '')}
- Nakshatra: ${getVal(8, 'C', '')} (${getVal(8, 'G', '')})

LUCKY ATTRIBUTES:
- Lucky Colours: ${getVal(10, 'C', '')}
- Lucky Number: ${getVal(12, 'A', '2')}
- Good Numbers: ${getVal(12, 'C', '1, 7, 9')}
- Lucky Stone: ${getVal(12, 'E', 'Ruby')}
- Lucky Metal: ${getVal(12, 'G', 'Copper')}
- Lucky Direction: ${getVal(12, 'I', 'East')}

DIRECTION PREDICTIONS (8 DIRECTIONS):
- Nongpok (East): ${getVal(14, 'C', '') || getVal(14, 'B', '')}
- Chingkhei (North-East): ${getVal(15, 'C', '') || getVal(15, 'B', '')}
- Awang (North): ${getVal(16, 'C', '') || getVal(16, 'B', '')}
- Koubru (North-West): ${getVal(17, 'C', '') || getVal(17, 'B', '')}
- Nongchup (West): ${getVal(18, 'C', '') || getVal(18, 'B', '')}
- Santhong (South-West): ${getVal(19, 'C', '') || getVal(19, 'B', '')}
- Makha (South): ${getVal(20, 'C', '') || getVal(20, 'B', '')}
- Meiram (South-East): ${getVal(21, 'C', '') || getVal(21, 'B', '')}

DASHA & LIFE PREDICTIONS:
${reportNarrative}

REMEDIES / PRITIKAR:
1. ${getVal(113, 'B', '') || getVal(115, 'B', '') || getVal(53, 'B', '')}
2. ${getVal(114, 'B', '') || getVal(116, 'B', '') || getVal(54, 'B', '')}
=====================================================
Generated via Kanglei Kuthi • kuthiyengpham.in`;

    navigator.clipboard.writeText(reportText);
    showToast(`Copied ${activeTab} Report to Clipboard!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'suraj') {
      setName('Moirangthem Suraj Singh');
      setDob('2-7-1986 AD');
      setTob('9:45 AM');
      setDay('Wednesday');
      setPob('Tentha Khunou Maning Leikai');
      showToast('Loaded Preset: Moirangthem Suraj Singh (1986)');
    } else if (presetName === 'sanatomba') {
      setName('Sanatomba Meitei');
      setDob('28-06-2004 AD');
      setTob('6:00 AM');
      setDay('Monday');
      setPob('Imphal, Manipur');
      showToast('Loaded Preset: Sanatomba Meitei (2004)');
    }
  };

  // Font family determination for the active tab
  const tabFontClass = useMemo(() => {
    if (activeTab === 'MM_Result_M') {
      return 'font-budha';
    } else if (activeTab === 'Meetei_Result') {
      return 'font-blipi';
    } else {
      return 'font-blipi';
    }
  }, [activeTab]);

  return (
    <div
      className={`w-full rounded-3xl shadow-2xl overflow-hidden font-sans border transition-colors duration-200 ${
        isDark
          ? 'bg-[#0b132b] text-white border-[#3a506b]'
          : 'bg-[#fffdfa] text-slate-900 border-[#f3e8d2]'
      }`}
    >
      {/* ── TOP HEADER TOOLBAR ── */}
      <div
        className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-[#1c2541] via-[#151f38] to-[#0b132b] border-[#3a506b]/60 text-white'
            : 'bg-gradient-to-r from-[#fff9eb] via-[#fffdfa] to-[#fef3c7] border-[#f3e8d2] text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md ${
              isDark
                ? 'bg-gradient-to-tr from-amber-600 to-amber-400 border border-amber-300/40 text-slate-950'
                : 'bg-gradient-to-tr from-amber-500 to-amber-300 border border-amber-400 text-amber-950'
            }`}
          >
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`font-serif font-black text-xl tracking-wide ${
                  isDark ? 'text-amber-300' : 'text-[#78350f]'
                }`}
              >
                Kuthi Astrological Result Sheets
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  isDark
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                3-in-1 Unified Page
              </span>
            </div>
            <p
              className={`text-xs font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Unified viewer for Result, Meetei_Result, and MM_Result_M (powered by Budha.ttf)
            </p>
          </div>
        </div>

        {/* Action Buttons & Theme Switcher */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setCurrentTheme(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isDark
                ? 'bg-[#0b132b] hover:bg-[#1c2541] border-[#3a506b] text-amber-300'
                : 'bg-white hover:bg-amber-50 border-amber-200 text-amber-900'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={handleCopyReport}
            className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isDark
                ? 'bg-[#1c2541] hover:bg-[#253258] border-amber-500/30 text-amber-300'
                : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy {activeTab}</span>
          </button>

          <button
            onClick={handlePrint}
            className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isDark
                ? 'bg-[#1c2541] hover:bg-[#253258] border-slate-600 text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 dark:text-rose-300 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Toast */}
      {toastMsg && (
        <div className="bg-emerald-500 text-slate-950 font-black text-xs py-2 px-4 text-center flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 3-TAB SWITCHER BAR ── */}
      <div
        className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 transition-colors ${
          isDark
            ? 'bg-[#151f38] border-[#3a506b]/50'
            : 'bg-[#faf6ee] border-[#f3e8d2]'
        }`}
      >
        <div className="flex items-center flex-wrap gap-2">
          {/* Tab 1: MM_Result_M (Budha font) */}
          <button
            onClick={() => setActiveTab('MM_Result_M')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'MM_Result_M'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md scale-102'
                : isDark
                ? 'bg-[#0b132b] text-slate-300 hover:text-white border border-[#3a506b]/60'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-300 shadow-xs'
            }`}
          >
            <span>📜</span>
            <span>MM_Result_M (Budha.ttf Font)</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                activeTab === 'MM_Result_M' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/20 text-amber-500'
              }`}
            >
              Meetei Mayek
            </span>
          </button>

          {/* Tab 2: Meetei_Result */}
          <button
            onClick={() => setActiveTab('Meetei_Result')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'Meetei_Result'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md scale-102'
                : isDark
                ? 'bg-[#0b132b] text-slate-300 hover:text-white border border-[#3a506b]/60'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-300 shadow-xs'
            }`}
          >
            <span>🪶</span>
            <span>Meetei_Result (BLipi15 Font)</span>
          </button>

          {/* Tab 3: Result */}
          <button
            onClick={() => setActiveTab('Result')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'Result'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md scale-102'
                : isDark
                ? 'bg-[#0b132b] text-slate-300 hover:text-white border border-[#3a506b]/60'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-300 shadow-xs'
            }`}
          >
            <span>📄</span>
            <span>Result (Classic Format)</span>
          </button>
        </div>

        {/* Font Indicator Badge */}
        <div
          className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
            activeTab === 'MM_Result_M'
              ? (isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900')
              : (isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700')
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>
            {activeTab === 'MM_Result_M'
              ? 'Font: Budha (C:\\Users\\MayNard\\Desktop\\Budha.ttf)'
              : 'Font: BLipi15 (Blipi15.TTF)'}
          </span>
        </div>
      </div>

      {/* ── BIRTH DETAILS BAR & PRESETS ── */}
      <div
        className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark
            ? 'bg-[#0f172a] border-[#3a506b]/40 text-slate-300'
            : 'bg-white border-[#f3e8d2] text-slate-700'
        }`}
      >
        <div className="flex items-center flex-wrap gap-3">
          <span className="font-bold flex items-center gap-1 text-amber-500">
            <User className="w-3.5 h-3.5" />
            <span>Active Birth Details:</span>
          </span>
          <span className="font-semibold">{name}</span>
          <span className="opacity-40">•</span>
          <span className="font-mono">{dob}</span>
          <span className="opacity-40">•</span>
          <span className="font-mono">{tob}</span>
          <span className="opacity-40">•</span>
          <span>{day}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400">Presets:</span>
          <button
            onClick={() => handleApplyPreset('suraj')}
            className={`px-2 py-0.5 rounded-md border font-semibold text-[11px] transition-all cursor-pointer ${
              isDark
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
            }`}
          >
            Suraj Singh (1986)
          </button>
          <button
            onClick={() => handleApplyPreset('sanatomba')}
            className={`px-2 py-0.5 rounded-md border font-medium text-[11px] transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
            }`}
          >
            Sanatomba (2004)
          </button>
        </div>
      </div>

      {/* ── KUTHI HOROSCOPE DOCUMENT VIEW ── */}
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div
          className={`border-2 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 transition-all relative ${
            isDark
              ? 'bg-[#151f38] border-amber-500/40 text-white'
              : 'bg-white border-amber-300 text-slate-900 shadow-xl'
          }`}
        >
          {/* Ornamental Inner Border */}
          <div className="absolute inset-2 border border-amber-400/20 rounded-2xl pointer-events-none" />

          {/* HEADER SECTION */}
          <div className="text-center space-y-2 border-b border-amber-400/30 pb-6">
            <h1
              className={`font-serif font-black text-2xl md:text-3xl tracking-wide ${
                isDark ? 'text-amber-300' : 'text-[#78350f]'
              }`}
            >
              {astrologerName}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-semibold opacity-90">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-mono">
                {astrologerTitle}
              </span>
              <span>•</span>
              <span>{address}</span>
              <span>•</span>
              <span className="font-mono">{contactNo}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between text-xs font-mono pt-3 opacity-80 border-t border-amber-400/20">
              <span>{refNo}</span>
              <span>
                {activeTab === 'MM_Result_M' ? 'taZ :- ' : 'taz:- '}
                {consultDate}
              </span>
            </div>
          </div>

          {/* SECTION 1: NATIVE BIRTH PARTICULARS */}
          <div
            className={`rounded-2xl p-4 md:p-5 border space-y-3 transition-colors ${
              isDark
                ? 'bg-[#0b132b]/80 border-[#3a506b]'
                : 'bg-[#faf6ee] border-[#e2d5c4]'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  Name / Client:
                </span>
                <span className="font-serif font-black text-sm text-amber-500">
                  {name}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  Date of Birth:
                </span>
                <span className="font-mono font-bold text-sm">
                  {dob}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  Birth Time:
                </span>
                <span className="font-mono font-bold text-sm">
                  {tob}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  Day of Week:
                </span>
                <span className="font-bold text-sm">
                  {day}
                </span>
              </div>
            </div>

            {/* ASTROLOGICAL MARKS: RASHI, LAGNA, NAKSHATRA */}
            <div
              className={`pt-3 border-t grid grid-cols-1 md:grid-cols-3 gap-4 text-xs ${
                isDark ? 'border-[#3a506b]/40' : 'border-[#e2d5c4]'
              }`}
            >
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  {activeTab === 'MM_Result_M' ? 'rasi (Moon Sign):' : 'raiS (রাশি):'}
                </span>
                <span className={`font-bold text-base ${tabFontClass}`}>
                  {getVal(6, 'C', '')} {getVal(6, 'E', '')}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  {activeTab === 'MM_Result_M' ? 'lg_n (Ascendant):' : 'lgx (লগ্ন):'}
                </span>
                <span className={`font-bold text-base ${tabFontClass}`}>
                  {getVal(7, 'C', '')}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  {activeTab === 'MM_Result_M' ? 'YwaNmicaK (Nakshatra):' : 'Twanimcak (নক্ষত্র):'}
                </span>
                <span className={`font-bold text-base ${tabFontClass}`}>
                  {getVal(8, 'C', '')}
                </span>
                <span className={`text-[11px] block text-slate-400 mt-0.5 ${tabFontClass}`}>
                  {getVal(8, 'G', '')}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: LUCKY NUMBERS & ATTRIBUTES */}
          <div className="space-y-3">
            <h3
              className={`font-serif font-bold text-sm flex items-center gap-2 ${
                isDark ? 'text-amber-300' : 'text-[#78350f]'
              }`}
            >
              <span>🍀</span> Lucky Numbers & Planetary Energies
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf6ee] border-[#e2d5c4]'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Lucky No.
                </span>
                <span className="font-mono font-black text-xl text-amber-500">
                  {getVal(12, 'A', '2')}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf6ee] border-[#e2d5c4]'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Good Numbers
                </span>
                <span className="font-mono font-bold text-base text-emerald-500">
                  {getVal(12, 'C', '1, 7, 9')}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf6ee] border-[#e2d5c4]'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Lucky Stone
                </span>
                <span className="font-bold text-base text-rose-500">
                  {getVal(12, 'E', 'Ruby')}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf6ee] border-[#e2d5c4]'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Lucky Metal
                </span>
                <span className="font-bold text-base text-amber-600">
                  {getVal(12, 'G', 'Copper')}
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border col-span-2 sm:col-span-1 ${
                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf6ee] border-[#e2d5c4]'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Lucky Direction
                </span>
                <span className="font-bold text-base text-sky-500">
                  {getVal(12, 'I', 'East')}
                </span>
              </div>
            </div>

            {/* Lucky Colours Banner */}
            <div
              className={`p-3 rounded-2xl border text-xs leading-relaxed flex items-center gap-2 ${
                isDark
                  ? 'bg-[#0b132b] border-amber-500/20 text-slate-200'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <strong>Lucky Colours: </strong>
                <span className={tabFontClass}>{getVal(10, 'C', '')}</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: 8 DIRECTIONAL GUIDANCE TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3
                className={`font-serif font-bold text-sm flex items-center gap-2 ${
                  isDark ? 'text-amber-300' : 'text-[#78350f]'
                }`}
              >
                <Compass className="w-4 h-4 text-amber-500" />
                <span>
                  {activeTab === 'MM_Result_M'
                    ? 'chi taZkK Asid lM cTpgi maIkEsiZgi Af-fTt mHad pijri:-'
                    : 'cih tazk(I mtaz Aisda lm c\\pgI mah~e~kiSzgI Af-fo_ mKada pIjir:-'}
                </span>
              </h3>
            </div>

            <div
              className={`rounded-2xl border overflow-hidden transition-colors ${
                isDark ? 'border-[#3a506b]' : 'border-[#e2d5c4]'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-500/20 text-xs">
                {/* Column 1 */}
                <div className="divide-y divide-gray-500/20">
                  <div className="p-3 flex items-start justify-between gap-3">
                    <span className={`font-bold w-24 shrink-0 text-amber-500 ${tabFontClass}`}>
                      {getVal(14, 'A', 'noZpoK :-')}
                    </span>
                    <span className={`text-right ${tabFontClass}`}>
                      {getVal(14, 'C', '') || getVal(14, 'B', '')}
                    </span>
                  </div>
                  <div className="p-3 flex items-start justify-between gap-3">
                    <span className={`font-bold w-24 shrink-0 text-amber-500 ${tabFontClass}`}>
                      {getVal(15, 'A', 'ciZHE :-')}
                    </span>
                    <span className={`text-right ${tabFontClass}`}>
                      {getVal(15, 'C', '') || getVal(15, 'B', '')}
                    </span>
                  </div>
                  <div className="p-3 flex items-start justify-between gap-3">
                    <span className={`font-bold w-24 shrink-0 text-amber-500 ${tabFontClass}`}>
                      {getVal(16, 'A', 'AwaZ :-')}
                    </span>
                    <span className={`text-right ${tabFontClass}`}>
                      {getVal(16, 'C', '') || getVal(16, 'B', '')}
                    </span>
                  </div>
                  <div className="p-3 flex items-start justify-between gap-3">
                    <span className={`font-bold w-24 shrink-0 text-amber-500 ${tabFontClass}`}>
                      {getVal(17, 'A', 'kOb_ru :-')}
                    </span>
                    <span className={`text-right ${tabFontClass}`}>
                      {getVal(17, 'C', '') || getVal(17, 'B', '')}
                    </span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="divide-y divide-gray-500/20">
                  <div className="p-3 flex items-start justify-between gap-3">
                    <span className={`font-bold w-24 shrink-0 text-amber-500 ${tabFontClass}`}>
                      {getVal(18, 'A', 'noZcuP :-')}
                    </span>
                    <span className={`text-right ${tabFontClass}`}>
                      {getVal(18, 'C', '') || getVal(18, 'B', '')}
                    </span>
                  </div>
                  <div className="p-3 flex items-start justify-between gap-3">
                    <span className={`font-bold w-24 shrink-0 text-amber-500 ${tabFontClass}`}>
                      {getVal(19, 'A', 'sNYoZ :-')}
                    </span>
                    <span className={`text-right ${tabFontClass}`}>
                      {getVal(19, 'C', '') || getVal(19, 'B', '')}
                    </span>
                  </div>
                  <div className="p-3 flex items-start justify-between gap-3">
                    <span className={`font-bold w-24 shrink-0 text-amber-500 ${tabFontClass}`}>
                      {getVal(20, 'A', 'mHa :-')}
                    </span>
                    <span className={`text-right ${tabFontClass}`}>
                      {getVal(20, 'C', '') || getVal(20, 'B', '')}
                    </span>
                  </div>
                  <div className="p-3 flex items-start justify-between gap-3">
                    <span className={`font-bold w-24 shrink-0 text-amber-500 ${tabFontClass}`}>
                      {getVal(21, 'A', 'mErM :-')}
                    </span>
                    <span className={`text-right ${tabFontClass}`}>
                      {getVal(21, 'C', '') || getVal(21, 'B', '')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: NARRATIVE DASHA & LIFE PREDICTIONS (ROW 23) */}
          <div className="space-y-3">
            <h3
              className={`font-serif font-bold text-sm flex items-center gap-2 ${
                isDark ? 'text-amber-300' : 'text-[#78350f]'
              }`}
            >
              <span>📜</span> Detailed Life Predictions & Running Dasha Narrative (Row 23)
            </h3>

            <div
              className={`p-5 rounded-2xl border leading-relaxed text-sm tracking-wide transition-colors ${tabFontClass} ${
                isDark
                  ? 'bg-[#0b132b] border-[#3a506b] text-slate-100'
                  : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900 shadow-xs'
              }`}
              style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
            >
              {getVal(23, 'A', 'Predictions narrative text loading...')}
            </div>
          </div>

          {/* SECTION 5: REMEDIES / PRITIKAR */}
          <div className="space-y-3">
            <h3
              className={`font-serif font-bold text-sm flex items-center gap-2 ${
                isDark ? 'text-amber-300' : 'text-[#78350f]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>
                {activeTab === 'MM_Result_M'
                  ? 'p_rtikar nTtr_g AkoKloN (Remedial Ceremonies):'
                  : 'p[itkar nYga Aekakelan (Remedial Ceremonies):'}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pritikar 1 */}
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pritikar (1)</span>
                </div>
                <p className={`text-xs leading-relaxed font-medium ${tabFontClass}`}>
                  {getVal(113, 'B', '') || getVal(115, 'B', '') || getVal(53, 'B', '')}
                </p>
              </div>

              {/* Pritikar 2 */}
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pritikar (2)</span>
                </div>
                <p className={`text-xs leading-relaxed font-medium ${tabFontClass}`}>
                  {getVal(114, 'B', '') || getVal(116, 'B', '') || getVal(54, 'B', '')}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="text-center pt-4 border-t border-amber-400/20 text-[11px] text-slate-400">
            Kanglei Kuthi Horoscopy • Generated via kuthiyengpham.in • Matched with qw.xlsm
          </div>
        </div>
      </div>
    </div>
  );
}
