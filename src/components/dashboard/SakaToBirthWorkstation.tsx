'use client';

import React, { useState, useMemo } from 'react';
import {
  ScrollText,
  Calendar,
  Clock,
  Sun,
  Moon,
  Sparkles,
  Copy,
  CheckCircle2,
  Printer,
  ArrowRight,
  X,
  Compass,
  Check,
} from 'lucide-react';
import {
  convertSakaToBirth,
  SOLAR_MASS_NAMES,
  SakaToBirthResult,
} from '@/engine/sakaToBirth';

interface SakaToBirthWorkstationProps {
  initialSaka?: number;
  initialMass?: number;
  initialSangkranti?: number;
  initialDanda?: number;
  initialPal?: number;
  initialBipal?: number;
  theme?: 'dark' | 'light';
  onClose?: () => void;
  onOpenKuthi?: (dob: string, tob: string, name?: string) => void;
}

/**
 * Formats a traditional time string (e.g. "06:24:46", "22:10:08", or "25:11:42")
 * into both 24h and modern 12h AM/PM format with overnight/next-day indicators.
 */
function formatEndingTimeDisplay(timeStr: string): { raw: string; display12h: string; isNextDay: boolean } {
  if (!timeStr || timeStr === '--:--:--') {
    return { raw: '--:--:--', display12h: '--:--', isNextDay: false };
  }

  const parts = timeStr.split(':').map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return { raw: timeStr, display12h: timeStr, isNextDay: false };
  }

  let h = parts[0];
  const m = String(parts[1] || 0).padStart(2, '0');
  const s = String(parts[2] || 0).padStart(2, '0');
  let isNextDay = false;

  if (h >= 24) {
    isNextDay = true;
    h = h - 24;
  }

  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const display12h = `${String(h12).padStart(2, '0')}:${m}:${s} ${ampm}${isNextDay ? ' (Next Day / অহিং)' : ''}`;

  return { raw: timeStr, display12h, isNextDay };
}

export default function SakaToBirthWorkstation({
  initialSaka = 1880,
  initialMass = 0,
  initialSangkranti = 5,
  initialDanda = 42,
  initialPal = 1,
  initialBipal = 0,
  theme: parentTheme,
  onClose,
  onOpenKuthi,
}: SakaToBirthWorkstationProps) {
  // Input State
  const [sakaYear, setSakaYear] = useState<number>(initialSaka);
  const [mass, setMass] = useState<number>(initialMass); // 0 to 11
  const [sangkranti, setSangkranti] = useState<number>(initialSangkranti); // 1 to 32
  const [danda, setDanda] = useState<number>(initialDanda); // 0 to 59
  const [pal, setPal] = useState<number>(initialPal); // 0 to 59
  const [bipal, setBipal] = useState<number>(initialBipal); // 0 to 59
  const [clientName, setClientName] = useState<string>('Native Kuthi Client');

  // Internal Theme State (supports toggle or inherits from parent)
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(parentTheme || 'dark');
  const isDark = currentTheme === 'dark';

  // UI state
  const [scriptMode, setScriptMode] = useState<'bengali' | 'meetei' | 'en'>('bengali');
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Compute conversion result directly
  const result: SakaToBirthResult = useMemo(() => {
    return convertSakaToBirth({
      sakaYear: Number(sakaYear) || 1880,
      mass: Number(mass) || 0,
      sangkranti: Number(sangkranti) || 1,
      danda: Number(danda) || 0,
      pal: Number(pal) || 0,
      bipal: Number(bipal) || 0,
    });
  }, [sakaYear, mass, sangkranti, danda, pal, bipal]);

  // Formatted Ending Times
  const tithiEnding = useMemo(() => formatEndingTimeDisplay(result.tithiEndingTime), [result.tithiEndingTime]);
  const rashiEnding = useMemo(() => formatEndingTimeDisplay(result.rashiEndingTime), [result.rashiEndingTime]);
  const nakshatraEnding = useMemo(() => formatEndingTimeDisplay(result.nakshatraEndingTime), [result.nakshatraEndingTime]);

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 2500);
  };

  const handleCopyReport = () => {
    const reportText = `===========================================
MANIPURI KUTHI: SAKA TO ENGLISH DOB CONVERTER
===========================================
Client: ${clientName}
Traditional Kuthi Records:
- Saka Year: ${result.sakaYear} (শকাব্দ)
- Solar Month (Mass): ${result.solarMonthNameBengali} (${result.solarMonthNameEn} / Index ${result.mass})
- Sangkranti Day: ${result.sangkranti}
- Birth Time: ${result.danda} Danda, ${result.pal} Pal, ${result.bipal} Bipal (${result.totalDandaDecimal.toFixed(4)} Danda)

Calculated Gregorian Birth Details:
- Date of Birth: ${result.dateOfBirth} (${result.day}-${String(result.month).padStart(2, '0')}-${result.year})
- Day of Week: ${result.weekday} (${result.weekdayBengali})
- English Birth Time: ${result.birthTime12h} (${result.birthTime} 24h)
- Sunrise on that day: ${result.sunriseTime} (Elapsed: ${result.hoursFromSunrise.toFixed(4)} hrs)

Calculated Epakpa Ending Times:
- Tithi (Thabanik): ${result.tithiDisplayBengali}
  Ending Time: ${tithiEnding.raw} (${tithiEnding.display12h})
- Janma Rashi: ${result.rashiNameBengali} (${result.rashiNameEn})
  Ending Time: ${rashiEnding.raw} (${rashiEnding.display12h})
- Nakshatra: ${result.nakshatraNameBengali} [${result.nakshatraNumber}]
  Ending Time: ${nakshatraEnding.raw} (${nakshatraEnding.display12h})
===========================================
Kanglei Kuthi Horoscopy • Generated via kuthiyengpham.in`;

    navigator.clipboard.writeText(reportText);
    showToast('Report Copied to Clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApplyPreset = (s: number, m: number, sk: number, d: number, p: number, bp: number) => {
    setSakaYear(s);
    setMass(m);
    setSangkranti(sk);
    setDanda(d);
    setPal(p);
    setBipal(bp);
    showToast(`Loaded Preset: Saka ${s}, Mass ${m}`);
  };

  return (
    <div
      className={`w-full rounded-3xl shadow-2xl overflow-hidden font-sans border transition-colors duration-200 ${
        isDark
          ? 'bg-[#0b132b] text-white border-[#3a506b]'
          : 'bg-[#fffdfa] text-slate-900 border-[#f3e8d2]'
      }`}
    >
      {/* ── HEADER TOOLBAR ── */}
      <div
        className={`px-6 py-4.5 flex flex-wrap items-center justify-between gap-4 border-b transition-colors ${
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
            <ScrollText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`font-serif font-black text-xl tracking-wide ${
                  isDark ? 'text-amber-300' : 'text-[#78350f]'
                }`}
              >
                Saka Era to Birth Converter
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  isDark
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                Excel qw.xlsm Matched
              </span>
            </div>
            <p
              className={`text-xs font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Convert traditional Manipuri Kuthi coordinates (শকাব্দ, সৌরমাস, সংক্রান্তি, দণ্ড-পল-বিপল) to English Date & Time
            </p>
          </div>
        </div>

        {/* Top Controls: Theme Toggle, Script Switcher, Actions & Close */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Theme Toggle Button */}
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

          {/* Script Mode Pill */}
          <div
            className={`flex items-center rounded-xl p-1 text-xs border ${
              isDark
                ? 'bg-[#0b132b]/80 border-[#3a506b]'
                : 'bg-white border-[#e2d5c4]'
            }`}
          >
            <button
              onClick={() => setScriptMode('bengali')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                scriptMode === 'bengali'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setScriptMode('meetei')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                scriptMode === 'meetei'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ꯃꯤꯇꯩ ꯃꯌꯦꯛ
            </button>
            <button
              onClick={() => setScriptMode('en')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                scriptMode === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={handleCopyReport}
            className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isDark
                ? 'bg-[#1c2541] hover:bg-[#253258] border-amber-500/30 text-amber-300'
                : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900'
            }`}
            title="Copy formatted conversion report"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Report</span>
          </button>

          <button
            onClick={handlePrint}
            className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isDark
                ? 'bg-[#1c2541] hover:bg-[#253258] border-slate-600 text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
            }`}
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 dark:text-rose-300 transition-all cursor-pointer"
              title="Close Converter"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Toast */}
      {copiedToast && (
        <div className="bg-emerald-500 text-slate-950 font-black text-xs py-2 px-4 text-center flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* ── QUICK PRESETS BAR ── */}
      <div
        className={`px-6 py-2.5 flex flex-wrap items-center gap-2 text-xs border-b transition-colors ${
          isDark
            ? 'bg-[#151f38]/70 border-[#3a506b]/40 text-slate-300'
            : 'bg-[#fbf7ee] border-[#f3e8d2] text-slate-700'
        }`}
      >
        <span
          className={`font-bold flex items-center gap-1 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Presets:</span>
        </span>
        <button
          onClick={() => handleApplyPreset(1880, 0, 5, 42, 1, 0)}
          className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
            isDark
              ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300'
              : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
          }`}
        >
          Excel Default (Saka 1880, Vaisakha 5, 42:1:0)
        </button>
        <button
          onClick={() => handleApplyPreset(1842, 0, 1, 15, 30, 0)}
          className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs'
          }`}
        >
          Min Bound (Saka 1842)
        </button>
        <button
          onClick={() => handleApplyPreset(1925, 4, 15, 30, 0, 0)}
          className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs'
          }`}
        >
          Mid (Saka 1925, Bhadra 15)
        </button>
        <button
          onClick={() => handleApplyPreset(1972, 11, 28, 48, 12, 30)}
          className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs'
          }`}
        >
          Max Bound (Saka 1972)
        </button>
      </div>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ════════════ LEFT COLUMN: TRADITIONAL INPUTS (5 Cols) ════════════ */}
        <div className="lg:col-span-5 space-y-5">
          <div
            className={`border rounded-3xl p-5 shadow-lg space-y-5 transition-colors ${
              isDark
                ? 'bg-[#151f38] border-[#3a506b] text-white'
                : 'bg-white border-[#f3e8d2] text-slate-900'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDark ? 'border-[#3a506b]/40' : 'border-[#f3e8d2]'
              }`}
            >
              <span
                className={`font-serif font-black text-base flex items-center gap-2 ${
                  isDark ? 'text-amber-300' : 'text-[#78350f]'
                }`}
              >
                <span>📜</span> Traditional Kuthi Record Inputs
              </span>
              <span
                className={`text-[11px] font-mono font-bold ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Range: Saka 1842–1972
              </span>
            </div>

            {/* Client Name */}
            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Client / Native Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Sanatomba Meitei"
                className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none transition-colors border ${
                  isDark
                    ? 'bg-[#0b132b] border-[#3a506b] text-white focus:border-amber-400'
                    : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900 focus:border-amber-600'
                }`}
              />
            </div>

            {/* SAKA YEAR INPUT */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    isDark ? 'text-amber-300' : 'text-amber-950'
                  }`}
                >
                  <span>1. Saka Year (শকাব্দ / ꯁꯀꯥꯕ꯭ꯗ)</span>
                </label>
                <span
                  className={`text-xs font-mono font-black ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}
                >
                  {sakaYear} Saka
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1842}
                  max={1972}
                  value={sakaYear}
                  onChange={(e) => setSakaYear(Number(e.target.value))}
                  className={`w-32 rounded-xl px-3.5 py-2.5 text-base font-black font-mono focus:outline-none border ${
                    isDark
                      ? 'bg-[#0b132b] border-[#3a506b] text-amber-300 focus:border-amber-400'
                      : 'bg-[#faf6ee] border-[#e2d5c4] text-amber-900 focus:border-amber-600'
                  }`}
                />
                <input
                  type="range"
                  min={1842}
                  max={1972}
                  value={sakaYear}
                  onChange={(e) => setSakaYear(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* SOLAR MONTH (MASS) SELECTOR */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className={`text-xs font-bold ${
                    isDark ? 'text-amber-300' : 'text-amber-950'
                  }`}
                >
                  2. Solar Month / Mass (সৌরমাস / ꯃꯥꯁ)
                </label>
                <span
                  className={`text-xs font-bold ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Index:{' '}
                  <span
                    className={`font-mono font-black ${
                      isDark ? 'text-amber-400' : 'text-amber-700'
                    }`}
                  >
                    {mass}
                  </span>
                </span>
              </div>
              <select
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none cursor-pointer border ${
                  isDark
                    ? 'bg-[#0b132b] border-[#3a506b] text-white focus:border-amber-400'
                    : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900 focus:border-amber-600'
                }`}
              >
                {SOLAR_MASS_NAMES.map((m) => (
                  <option
                    key={m.index}
                    value={m.index}
                    className={isDark ? 'bg-[#0b132b] text-white' : 'bg-white text-slate-900'}
                  >
                    {m.index}: {m.bengali} ({m.en}) • {m.sign} ({m.meetei})
                  </option>
                ))}
              </select>
            </div>

            {/* SANGKRANTI DAY SELECTOR */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className={`text-xs font-bold ${
                    isDark ? 'text-amber-300' : 'text-amber-950'
                  }`}
                >
                  3. Sangkranti Day (সংক্রান্তি / ꯁꯡꯀ꯭ꯔꯥꯟꯇꯤ)
                </label>
                <span
                  className={`text-xs font-mono font-black ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}
                >
                  Day {sangkranti} of month
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={32}
                  value={sangkranti}
                  onChange={(e) => setSangkranti(Number(e.target.value))}
                  className={`w-24 rounded-xl px-3.5 py-2.5 text-base font-black font-mono focus:outline-none border ${
                    isDark
                      ? 'bg-[#0b132b] border-[#3a506b] text-amber-300 focus:border-amber-400'
                      : 'bg-[#faf6ee] border-[#e2d5c4] text-amber-900 focus:border-amber-600'
                  }`}
                />
                <input
                  type="range"
                  min={1}
                  max={32}
                  value={sangkranti}
                  onChange={(e) => setSangkranti(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* TRADITIONAL BIRTH TIME: DANDA, PAL, BIPAL */}
            <div
              className={`border-t pt-4 space-y-3 ${
                isDark ? 'border-[#3a506b]/40' : 'border-[#f3e8d2]'
              }`}
            >
              <div className="flex items-center justify-between">
                <label
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    isDark ? 'text-amber-300' : 'text-amber-950'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>4. Birth Time (দণ্ড • পল • বিপল)</span>
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  1 Danda = 24 mins
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Danda */}
                <div
                  className={`border rounded-2xl p-3 text-center ${
                    isDark
                      ? 'bg-[#0b132b] border-[#3a506b]'
                      : 'bg-[#faf6ee] border-[#e2d5c4]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    দণ্ড (Danda)
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={danda}
                    onChange={(e) => setDanda(Math.max(0, Math.min(59, Number(e.target.value))))}
                    className={`w-full text-center bg-transparent font-mono font-black text-xl focus:outline-none ${
                      isDark ? 'text-amber-300' : 'text-amber-900'
                    }`}
                  />
                  <span
                    className={`text-[9px] block ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    0 to 59
                  </span>
                </div>

                {/* Pal */}
                <div
                  className={`border rounded-2xl p-3 text-center ${
                    isDark
                      ? 'bg-[#0b132b] border-[#3a506b]'
                      : 'bg-[#faf6ee] border-[#e2d5c4]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    পল (Pal)
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={pal}
                    onChange={(e) => setPal(Math.max(0, Math.min(59, Number(e.target.value))))}
                    className={`w-full text-center bg-transparent font-mono font-black text-xl focus:outline-none ${
                      isDark ? 'text-amber-300' : 'text-amber-900'
                    }`}
                  />
                  <span
                    className={`text-[9px] block ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    0 to 59
                  </span>
                </div>

                {/* Bipal */}
                <div
                  className={`border rounded-2xl p-3 text-center ${
                    isDark
                      ? 'bg-[#0b132b] border-[#3a506b]'
                      : 'bg-[#faf6ee] border-[#e2d5c4]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    বিপল (Bipal)
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={bipal}
                    onChange={(e) => setBipal(Math.max(0, Math.min(59, Number(e.target.value))))}
                    className={`w-full text-center bg-transparent font-mono font-black text-xl focus:outline-none ${
                      isDark ? 'text-amber-300' : 'text-amber-900'
                    }`}
                  />
                  <span
                    className={`text-[9px] block ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    0 to 59
                  </span>
                </div>
              </div>

              {/* Danda Elapsed Summary */}
              <div
                className={`rounded-2xl p-3 text-xs flex items-center justify-between border ${
                  isDark
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <span className="font-medium">Total Danda Decimal:</span>
                <span className="font-mono font-black">
                  {result.totalDandaDecimal.toFixed(4)} দণ্ড
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════ RIGHT COLUMN: RESULTS & CALCULATED ENDING TIMES (7 Cols) ════════════ */}
        <div className="lg:col-span-7 space-y-5">
          {/* ── HERO BANNER: ENGLISH DOB & LOCAL BIRTH TIME ── */}
          <div
            className={`relative overflow-hidden rounded-3xl p-6 shadow-2xl space-y-6 border-2 transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-[#1e294b] via-[#151f38] to-[#0f172a] border-amber-500/40 text-white'
                : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7]/60 to-[#fdf6e2] border-amber-400/80 text-slate-900'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-amber-400/30">
              <div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-widest block mb-1 ${
                    isDark ? 'text-amber-400' : 'text-amber-800'
                  }`}
                >
                  Decrypted Gregorian Output (Excel Saka_to_Birth E8 & E5)
                </span>
                <h3
                  className={`font-serif font-black text-2xl ${
                    isDark ? 'text-white' : 'text-[#78350f]'
                  }`}
                >
                  English Date of Birth & Local Solar Time
                </h3>
              </div>
              <div
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                  isDark
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Ephemeris Matched</span>
              </div>
            </div>

            {/* BIG DISPLAY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DOB CARD */}
              <div
                className={`rounded-2xl p-4.5 space-y-2 border transition-all ${
                  isDark
                    ? 'bg-[#0b132b]/80 border-amber-500/30 text-white hover:border-amber-400'
                    : 'bg-white border-amber-200 text-slate-900 shadow-sm hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span>Date of Birth</span>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border ${
                      isDark
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-amber-100 text-amber-900 border-amber-200'
                    }`}
                  >
                    {result.weekday}
                  </span>
                </div>
                <div
                  className={`font-serif font-black text-3xl tracking-wide ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {result.dateOfBirth}
                </div>
                <div
                  className={`text-xs flex items-center justify-between font-bold pt-1 border-t ${
                    isDark
                      ? 'text-slate-300 border-[#3a506b]/40'
                      : 'text-slate-700 border-amber-100'
                  }`}
                >
                  <span>
                    {scriptMode === 'meetei'
                      ? result.weekdayMeetei
                      : result.weekdayBengali}
                  </span>
                  <span
                    className={`font-mono font-black ${
                      isDark ? 'text-amber-400' : 'text-amber-800'
                    }`}
                  >
                    {result.day}-{String(result.month).padStart(2, '0')}-{result.year}
                  </span>
                </div>
              </div>

              {/* TOB CARD */}
              <div
                className={`rounded-2xl p-4.5 space-y-2 border transition-all ${
                  isDark
                    ? 'bg-[#0b132b]/80 border-amber-500/30 text-white hover:border-amber-400'
                    : 'bg-white border-amber-200 text-slate-900 shadow-sm hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>English Birth Time</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-black border ${
                      isDark
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                        : 'bg-sky-100 text-sky-900 border-sky-200'
                    }`}
                  >
                    24h: {result.birthTime}
                  </span>
                </div>
                <div
                  className={`font-mono font-black text-3xl tracking-wide ${
                    isDark ? 'text-amber-300' : 'text-[#78350f]'
                  }`}
                >
                  {result.birthTime12h}
                </div>
                <div
                  className={`text-xs flex items-center justify-between font-bold pt-1 border-t ${
                    isDark
                      ? 'text-slate-300 border-[#3a506b]/40'
                      : 'text-slate-700 border-amber-100'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Sunrise: {result.sunriseTime}</span>
                  </span>
                  <span
                    className={`font-mono font-black ${
                      isDark ? 'text-emerald-400' : 'text-emerald-700'
                    }`}
                  >
                    +{result.hoursFromSunrise.toFixed(2)}h
                  </span>
                </div>
              </div>
            </div>

            {/* SEND TO VEDIC WORKSTATION BUTTON */}
            {onOpenKuthi && (
              <button
                onClick={() => onOpenKuthi(result.dateOfBirth, result.birthTime, clientName)}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <span>Open in Vedic Workstation (D1/D9 Chart & Dashas)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ── EPAKPA NUMITKI STATUS & CALCULATED ENDING TIMES ── */}
          <div
            className={`border rounded-3xl p-5 shadow-lg space-y-4 transition-colors ${
              isDark
                ? 'bg-[#151f38] border-[#3a506b] text-white'
                : 'bg-white border-[#f3e8d2] text-slate-900'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDark ? 'border-[#3a506b]/40' : 'border-[#f3e8d2]'
              }`}
            >
              <div>
                <span
                  className={`font-serif font-black text-base flex items-center gap-2 ${
                    isDark ? 'text-amber-300' : 'text-[#78350f]'
                  }`}
                >
                  <span>✨</span> Epakpa Numitki & Calculated Ending Times (লৈপাকপা নুমিৎকী)
                </span>
                <p
                  className={`text-xs mt-0.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Exact ending times calculated per Converter!AA11, U21 & T31
                </p>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-900'
                }`}
              >
                Converter!E12:F14
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. THABANIK (TITHI) & ENDING TIME */}
              <div
                className={`border rounded-2xl p-4 space-y-2.5 transition-colors ${
                  isDark
                    ? 'bg-[#0b132b] border-[#3a506b] text-white'
                    : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-amber-500" />
                    <span>থবানীং (Tithi)</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isDark
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    Day #{result.tithiNumber}
                  </span>
                </div>
                <div
                  className={`font-serif font-black text-lg ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {scriptMode === 'meetei'
                    ? result.tithiDisplayMeetei
                    : result.tithiDisplayBengali}
                </div>
                <div
                  className={`pt-2 border-t space-y-1 ${
                    isDark ? 'border-[#3a506b]/40' : 'border-[#e2d5c4]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-bold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Ending Time:
                    </span>
                    <span
                      className={`font-mono font-black text-sm ${
                        isDark ? 'text-amber-300' : 'text-[#78350f]'
                      }`}
                    >
                      {tithiEnding.raw}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] font-mono text-right font-semibold ${
                      isDark ? 'text-amber-400/80' : 'text-amber-800'
                    }`}
                  >
                    {tithiEnding.display12h}
                  </div>
                </div>
              </div>

              {/* 2. JANMA RASHI & ENDING TIME */}
              <div
                className={`border rounded-2xl p-4 space-y-2.5 transition-colors ${
                  isDark
                    ? 'bg-[#0b132b] border-[#3a506b] text-white'
                    : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-sky-500" />
                    <span>রাশি (Rashi)</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isDark
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                        : 'bg-sky-100 text-sky-900 border-sky-300'
                    }`}
                  >
                    Sign #{result.rashiNumber}
                  </span>
                </div>
                <div
                  className={`font-serif font-black text-lg ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {scriptMode === 'meetei'
                    ? `${result.rashiNameMeetei}`
                    : scriptMode === 'en'
                    ? result.rashiNameEn
                    : `${result.rashiNameBengali} (${result.rashiNameEn})`}
                </div>
                <div
                  className={`pt-2 border-t space-y-1 ${
                    isDark ? 'border-[#3a506b]/40' : 'border-[#e2d5c4]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-bold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Ending Time:
                    </span>
                    <span
                      className={`font-mono font-black text-sm ${
                        isDark ? 'text-sky-300' : 'text-sky-800'
                      }`}
                    >
                      {rashiEnding.raw}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] font-mono text-right font-semibold ${
                      isDark ? 'text-sky-300/80' : 'text-sky-800'
                    }`}
                  >
                    {rashiEnding.display12h}
                  </div>
                </div>
              </div>

              {/* 3. THAWANMICHAK (NAKSHATRA) & ENDING TIME */}
              <div
                className={`border rounded-2xl p-4 space-y-2.5 transition-colors ${
                  isDark
                    ? 'bg-[#0b132b] border-[#3a506b] text-white'
                    : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>নক্ষত্র (Nakshatra)</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isDark
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}
                  >
                    Star #{result.nakshatraNumber}
                  </span>
                </div>
                <div
                  className={`font-serif font-black text-lg ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {scriptMode === 'meetei'
                    ? `${result.nakshatraNameMeetei} [${result.nakshatraNumber}]`
                    : scriptMode === 'en'
                    ? `${result.nakshatraNameEn} [${result.nakshatraNumber}]`
                    : `${result.nakshatraNameBengali} [${result.nakshatraNumber}] (${result.nakshatraNameEn})`}
                </div>
                <div
                  className={`pt-2 border-t space-y-1 ${
                    isDark ? 'border-[#3a506b]/40' : 'border-[#e2d5c4]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-bold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Ending Time:
                    </span>
                    <span
                      className={`font-mono font-black text-sm ${
                        isDark ? 'text-emerald-300' : 'text-emerald-800'
                      }`}
                    >
                      {nakshatraEnding.raw}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] font-mono text-right font-semibold ${
                      isDark ? 'text-emerald-300/80' : 'text-emerald-800'
                    }`}
                  >
                    {nakshatraEnding.display12h}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
