'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Hash,
  User,
  Calendar,
  Heart,
  RefreshCw,
  X,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Fingerprint,
  Layers,
  ShieldAlert,
  Wand2,
  Link2,
  Car,
  HelpCircle,
  Briefcase,
  Grid3X3,
  Flame,
  Award,
  Printer,
  CheckCircle2,
  Copy,
  Sun,
  Clock,
  Compass,
  Phone,
  Smartphone,
} from 'lucide-react';
import {
  calculateVedicNumerology,
  calculateNameCompatibility,
  suggestNameCorrections,
  analyzeBusinessName,
  analyzeVehicleHouseNumber,
  analyzeMobileNumber,
  horaryNumerology,
  calculateEssenceCycles,
  MASTER_NUMBERS,
  PLANET_MEANINGS,
} from '@/engine/numerology';

interface NumerologyWorkstationProps {
  initialBirthData?: {
    name?: string;
    dob?: string;
    tob?: string;
    pob?: string;
    sex?: string;
  };
  onClose?: () => void;
}

const DEFAULT_PRESET = {
  name: 'Sanatomba Meitei',
  sex: 'Male',
  dob: '2004-06-28',
  tob: '06:00',
  pob: 'Imphal, Manipur',
};

const NUMEROLOGY_DASHBOARD_STYLES = {
  card: 'bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl shadow-sm p-5 sm:p-6 transition-colors',
  title: 'font-serif font-bold text-[#0f172a] dark:text-[#faf8f4]',
  subtitle: 'text-xs text-gray-600 dark:text-gray-300 font-medium',
  bigNumber: 'font-serif font-bold text-4xl text-[#d97706]',
  planetBadge: 'px-3 py-1 rounded-full bg-[#fef3c7] dark:bg-amber-500/20 text-[#b45309] dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-[#fde68a] dark:border-amber-500/30',
  tabActive: 'bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] text-white shadow-md font-extrabold border border-[#fde68a]/40',
  tabInactive: 'bg-white dark:bg-[#1c2541] text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] font-bold shadow-2xs',
  input: 'w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-[#3a506b] bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-bold text-xs focus:border-[#d97706] focus:outline-none transition-colors',
  label: 'block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5',
};

export default function NumerologyWorkstation({ initialBirthData, onClose }: NumerologyWorkstationProps) {
  const [formData, setFormData] = useState({
    name: initialBirthData?.name || DEFAULT_PRESET.name,
    sex: initialBirthData?.sex || DEFAULT_PRESET.sex,
    dob: initialBirthData?.dob || DEFAULT_PRESET.dob,
    tob: initialBirthData?.tob || DEFAULT_PRESET.tob,
    pob: initialBirthData?.pob || DEFAULT_PRESET.pob,
  });

  const [activeTab, setActiveTab] = useState<
    'core' | 'grid' | 'cycles' | 'karmic' | 'bridge' | 'correction' | 'compatibility' | 'mobile' | 'vehicle' | 'prashna'
  >('core');

  // Sub-tool states
  const [partnerName, setPartnerName] = useState('Thoibi Ningthoujam');
  const [partnerDob, setPartnerDob] = useState('2005-08-15');
  const [targetPlanet, setTargetPlanet] = useState('ju');
  const [testSpelling, setTestSpelling] = useState(formData.name);
  const [businessNameInput, setBusinessNameInput] = useState('Kanglei Astro Consult');
  const [businessIntention, setBusinessIntention] = useState<'wealth' | 'fame' | 'stability' | 'innovation' | 'harmony'>('wealth');
  const [mobileInput, setMobileInput] = useState('9862012345');
  const [vehicleInput, setVehicleInput] = useState('MN01AB1234');
  const [houseInput, setHouseInput] = useState('42');
  const [prashnaQuestion, setPrashnaQuestion] = useState('Will this new venture be prosperous?');
  const [prashnaResult, setPrashnaResult] = useState<any>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [calcError, setCalcError] = useState('');

  // Primary Numerology Result
  const result = useMemo(() => {
    try {
      if (!formData.name.trim() || !formData.dob) return null;
      setCalcError('');
      return calculateVedicNumerology({ fullName: formData.name.trim(), dob: formData.dob, gender: formData.sex as any });
    } catch (err: any) {
      setCalcError(err.message || 'Calculation error');
      return null;
    }
  }, [formData.name, formData.dob, formData.sex]);

  // Essence Cycles calculation
  const essenceResult = useMemo(() => {
    try {
      if (!formData.name.trim() || !formData.dob) return null;
      return calculateEssenceCycles(formData.name.trim(), formData.dob);
    } catch {
      return null;
    }
  }, [formData.name, formData.dob]);

  // Name Compatibility
  const compatResult = useMemo(() => {
    try {
      return calculateNameCompatibility(formData.name.trim(), partnerName.trim());
    } catch {
      return null;
    }
  }, [formData.name, partnerName]);

  // Live Test Spelling Correction
  const testSpellingResult = useMemo(() => {
    try {
      if (!testSpelling.trim() || !formData.dob) return null;
      return calculateVedicNumerology({ fullName: testSpelling.trim(), dob: formData.dob, gender: formData.sex as any });
    } catch {
      return null;
    }
  }, [testSpelling, formData.dob, formData.sex]);

  // Remedial suggestions
  const correctionSuggestions = useMemo(() => {
    try {
      return suggestNameCorrections({ fullName: formData.name.trim(), dob: formData.dob }, targetPlanet);
    } catch {
      return null;
    }
  }, [formData.name, formData.dob, targetPlanet]);

  // Business Name Analysis
  const businessAnalysis = useMemo(() => {
    try {
      if (!businessNameInput.trim()) return null;
      return analyzeBusinessName(businessNameInput.trim(), businessIntention);
    } catch {
      return null;
    }
  }, [businessNameInput, businessIntention]);

  // Mobile Number Numerology Analysis
  const mobileAnalysis = useMemo(() => {
    try {
      if (!mobileInput.trim()) return null;
      return analyzeMobileNumber(mobileInput.trim(), result?.core.moolank, result?.core.bhagyank);
    } catch {
      return null;
    }
  }, [mobileInput, result?.core.moolank, result?.core.bhagyank]);

  // Vehicle & House Number Analysis
  const vehicleAnalysis = useMemo(() => {
    try {
      if (!vehicleInput.trim()) return null;
      return analyzeVehicleHouseNumber(vehicleInput.trim());
    } catch {
      return null;
    }
  }, [vehicleInput]);

  const houseAnalysis = useMemo(() => {
    try {
      if (!houseInput.trim()) return null;
      return analyzeVehicleHouseNumber(houseInput.trim());
    } catch {
      return null;
    }
  }, [houseInput]);

  const handleRunPrashna = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prashnaQuestion.trim()) return;
    const res = horaryNumerology(prashnaQuestion.trim(), formData.name);
    setPrashnaResult(res);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (!result) return;
    const text = `VEDIC NUMEROLOGY (ANK SHASTRA) DOSSIER:
Native: ${formData.name} (${formData.sex})
DOB: ${formData.dob} | POB: ${formData.pob || 'N/A'}
• Moolank (Birth No): ${result.core.moolank} (${result.core.moolankPlanet})
• Bhagyank (Destiny No): ${result.core.bhagyank} (${result.core.bhagyankPlanet})
• Namank (Name No): ${result.core.nameNumber} (${result.core.nameNumberPlanet})
• Soul Urge (Atmakaraka): ${result.core.soulUrgeNumber}
• Outer Personality: ${result.core.personalityNumber}
• Personal Year: ${result.cycles.personalYear} (${result.cycles.personalYearTheme})
• Lucky Colors: ${result.luckyAttributes.luckyColors.join(', ')}
• Lucky Numbers: ${result.luckyAttributes.luckyNumbers.join(', ')}
• Lucky Gemstone: ${result.luckyAttributes.luckyGemstone}
• Ruling Deity: ${result.luckyAttributes.rulingDeity}
• Key Mantra: ${result.luckyAttributes.keyMantra}`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const planetMeta = (id: string) => PLANET_MEANINGS[id];
  const numberToPlanetId = (n: number) => {
    const map: Record<number, string> = { 1: 'su', 2: 'mo', 3: 'ju', 4: 'ra', 5: 'me', 6: 've', 7: 'ke', 8: 'sa', 9: 'ma' };
    return map[((n % 9) + 9) % 9] || 'su';
  };

  const tabs = [
    { id: 'core', label: 'Core Numbers', icon: Fingerprint },
    { id: 'grid', label: 'Ank Kundali (3x3 Grid)', icon: Grid3X3 },
    { id: 'cycles', label: 'Life Cycles & Pinnacles', icon: TrendingUp },
    { id: 'karmic', label: 'Master & Karmic Debts', icon: ShieldAlert },
    { id: 'bridge', label: 'Vedic Astrology Bridge', icon: Link2 },
    { id: 'correction', label: 'Name Remedy Optimizer', icon: Wand2 },
    { id: 'compatibility', label: 'Compatibility Matrix', icon: Heart },
    { id: 'mobile', label: 'Mobile No. Numerology', icon: Smartphone },
    { id: 'vehicle', label: 'Vehicle & House Vastu', icon: Car },
    { id: 'prashna', label: 'Prashna Oracle', icon: HelpCircle },
  ] as const;

  return (
    <div className="w-full bg-[#f4f7f4] dark:bg-[#0b132b] text-slate-900 dark:text-[#faf8f4] font-sans p-3 sm:p-5 rounded-3xl border border-slate-300/80 dark:border-[#3a506b] shadow-2xl space-y-5 max-w-7xl mx-auto print:p-0 transition-colors">
      {/* Workstation Header Bar */}
      <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden`}>
        <div className="flex items-start gap-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#d97706] to-[#f59e0b] text-white shadow-md">
            <Hash className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-xl flex items-center gap-2`}>
                Vedic Numerology (Ank Shastra) Workstation
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-[11px] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#d97706]" /> Classical Chaldean & Sanskrit Systems
              </span>
            </div>
            <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>
              Moolank • Bhagyank • Namank • 3x3 Ank Kundali • 9-Year Cycles • Karmic Debts • Name Correction • Vimshottari Bridge
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopySummary}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0b132b] border border-slate-300 dark:border-[#3a506b] text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-[#151d32] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-[#d97706]" />
            {copiedNotification ? '✓ Dossier Copied' : 'Copy Summary'}
          </button>
          <button
            onClick={handlePrintDossier}
            className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#d97706]" /> Print Dossier
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0b132b] border border-slate-300 dark:border-[#3a506b] text-slate-500 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#151d32] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <X className="w-4 h-4" /> Close
            </button>
          )}
        </div>
      </div>

      {/* Live Birth Profile Quick Form */}
      <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} print:hidden`}>
        <div className="flex items-center justify-between border-b pb-3 mb-3 border-amber-200/50 dark:border-[#3a506b]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#d97706]" />
            <span className="font-serif font-bold text-sm text-slate-900 dark:text-white">Native Birth Record</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-gray-400">Edit fields to dynamically recompute all 8 numerology engines</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>Full Name (English / Devanagari)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((p) => ({ ...p, name: val }));
                setTestSpelling(val);
              }}
              placeholder="e.g. Sanatomba Meitei"
              className={NUMEROLOGY_DASHBOARD_STYLES.input}
            />
          </div>
          <div>
            <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData((p) => ({ ...p, dob: e.target.value }))}
              className={NUMEROLOGY_DASHBOARD_STYLES.input}
            />
          </div>
          <div>
            <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>Time of Birth (Optional)</label>
            <input
              type="time"
              value={formData.tob}
              onChange={(e) => setFormData((p) => ({ ...p, tob: e.target.value }))}
              className={NUMEROLOGY_DASHBOARD_STYLES.input}
            />
          </div>
          <div>
            <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>Gender</label>
            <select
              value={formData.sex}
              onChange={(e) => setFormData((p) => ({ ...p, sex: e.target.value }))}
              className={NUMEROLOGY_DASHBOARD_STYLES.input}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {calcError && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {calcError}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 print:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                isActive ? NUMEROLOGY_DASHBOARD_STYLES.tabActive : NUMEROLOGY_DASHBOARD_STYLES.tabInactive
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TAB: CORE NUMBERS                                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'core' && result && (
        <div className="space-y-5">
          {/* Top 5 Core Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                title: 'Moolank (Birth No)',
                desc: 'Root vibration & core character',
                value: result.core.moolank,
                planet: result.core.moolankPlanet,
                icon: Hash,
                planetId: numberToPlanetId(result.core.moolank),
                master: result.core.isMasterNumber?.moolank,
              },
              {
                title: 'Bhagyank (Destiny No)',
                desc: 'Life purpose & divine destiny',
                value: result.core.bhagyank,
                planet: result.core.bhagyankPlanet,
                icon: Sparkles,
                planetId: numberToPlanetId(result.core.bhagyank),
                master: result.core.isMasterNumber?.bhagyank,
              },
              {
                title: 'Namank (Name No)',
                desc: 'Social projection & worldly success',
                value: result.core.nameNumber,
                planet: result.core.nameNumberPlanet,
                icon: User,
                planetId: numberToPlanetId(result.core.nameNumber),
                master: result.core.isMasterNumber?.name,
              },
              {
                title: 'Soul Urge (Atmakaraka)',
                desc: 'Inner heart desire (Vowels sum)',
                value: result.core.soulUrgeNumber,
                planet: PLANET_MEANINGS[numberToPlanetId(result.core.soulUrgeNumber)]?.name.split(' ')[0] || 'Vedic',
                icon: Heart,
                planetId: numberToPlanetId(result.core.soulUrgeNumber),
              },
              {
                title: 'Outer Personality',
                desc: 'Public impression (Consonants sum)',
                value: result.core.personalityNumber,
                planet: PLANET_MEANINGS[numberToPlanetId(result.core.personalityNumber)]?.name.split(' ')[0] || 'Vedic',
                icon: Award,
                planetId: numberToPlanetId(result.core.personalityNumber),
              },
            ].map((item, i) => {
              const meta = planetMeta(item.planetId);
              return (
                <div key={i} className={`${NUMEROLOGY_DASHBOARD_STYLES.card} text-center flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <item.icon className="w-4 h-4 text-[#d97706]" />
                      <span className="font-serif font-bold text-xs text-slate-800 dark:text-gray-200">{item.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-gray-400">{item.desc}</p>
                    <div className="my-2">
                      <span className={NUMEROLOGY_DASHBOARD_STYLES.bigNumber}>{item.value}</span>
                      {item.master && (
                        <span className="ml-1.5 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold border border-purple-300">
                          Master {item.master}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className={`${NUMEROLOGY_DASHBOARD_STYLES.planetBadge}`}>
                      {meta?.name.split(' ')[0] || item.planet}
                    </span>
                    {meta && (
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-2 leading-relaxed line-clamp-2">
                        {meta.positive.slice(0, 2).join(' • ')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Letter Breakdown */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm flex items-center gap-2`}>
                <Layers className="w-4 h-4 text-[#d97706]" /> Letter-by-Letter Sanskrit Vibration Breakdown
              </h4>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
                Compound Sum = {result.core.compoundNameNumber} → Reduced = {result.core.nameNumber} ({result.core.nameNumberPlanet})
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {result.core.letterAnalysis.map((L, i) => {
                const meta = planetMeta(L.planetId);
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] text-xs">
                    <span className="font-serif font-bold text-base text-slate-900 dark:text-white">{L.letter}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-mono font-bold text-[#d97706] text-sm">{L.number}</span>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">{meta?.name.split('(')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Guidance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card}`}>
              <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-400`}>
                <Sun className="w-4 h-4" /> Core Harmonious Vibration
              </h4>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                Native thrives under the leadership of <strong>{result.core.moolankPlanet} (Moolank {result.core.moolank})</strong>, supported by <strong>{result.core.bhagyankPlanet} (Bhagyank {result.core.bhagyank})</strong>. Career decisions and auspicious agreements should align with {result.luckyAttributes.luckyDays.join(' and ')}.
              </p>
            </div>
            <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card}`}>
              <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-400`}>
                <Compass className="w-4 h-4" /> Favorable Direction & Colors
              </h4>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                Primary auspicious direction: <strong>{result.luckyAttributes.luckyDirection}</strong>. Auspicious colors: <strong>{result.luckyAttributes.luckyColors.join(', ')}</strong>. Chant key mantra: <em>&quot;{result.luckyAttributes.keyMantra}&quot;</em>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TAB: ANK KUNDALI (3x3 VEDIC GRID)                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'grid' && result && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 3x3 Grid Graphic */}
            <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} lg:col-span-5 flex flex-col items-center justify-center text-center p-6`}>
              <div className="mb-4">
                <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-base flex items-center justify-center gap-2`}>
                  <Grid3X3 className="w-5 h-5 text-[#d97706]" /> Vedic Ank Kundali (3×3 Yantra)
                </h4>
                <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>Classical Vedic placement of natal numbers</p>
              </div>

              {/* 3x3 Table */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] aspect-square p-2 rounded-2xl bg-amber-50 dark:bg-[#0b132b] border-2 border-amber-300 dark:border-amber-600/50 shadow-inner">
                {[
                  { num: 4, label: 'Rahu (4)' },
                  { num: 9, label: 'Mars (9)' },
                  { num: 2, label: 'Moon (2)' },
                  { num: 3, label: 'Jupiter (3)' },
                  { num: 5, label: 'Mercury (5)' },
                  { num: 7, label: 'Ketu (7)' },
                  { num: 8, label: 'Saturn (8)' },
                  { num: 1, label: 'Sun (1)' },
                  { num: 6, label: 'Venus (6)' },
                ].map((cell, idx) => {
                  const count = result.ankKundali.grid[cell.num] || 0;
                  const hasNum = count > 0;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center rounded-xl border transition-all ${
                        hasNum
                          ? 'bg-white dark:bg-[#1c2541] border-amber-400 dark:border-amber-500 shadow-md scale-[1.02]'
                          : 'bg-transparent border-dashed border-slate-300 dark:border-slate-700 opacity-40'
                      }`}
                    >
                      <span className="text-[9px] font-bold text-slate-400 dark:text-gray-400">{cell.label}</span>
                      <span className={`font-serif font-black text-2xl ${hasNum ? 'text-[#d97706]' : 'text-slate-400 dark:text-gray-600'}`}>
                        {hasNum ? String(cell.num).repeat(count) : '-'}
                      </span>
                      {hasNum && (
                        <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">
                          {count === 1 ? '1× Present' : `${count}× Repeated`}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Missing & Repeated Badges */}
              <div className="w-full mt-4 space-y-2 text-left text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                  <span className="font-bold text-slate-700 dark:text-gray-300 block mb-1">Missing Vibrations (Remedial Target):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.ankKundali.missingNumbers.length > 0 ? (
                      result.ankKundali.missingNumbers.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold text-[10px] border border-red-300 dark:border-red-800">
                          Missing #{m} ({PLANET_MEANINGS[numberToPlanetId(m)]?.name.split(' ')[0]})
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-600 font-bold">Complete Golden Grid (No Missing Numbers)</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                  <span className="font-bold text-slate-700 dark:text-gray-300 block mb-1">Repeated Vibrations (High Energy):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.ankKundali.repeatedNumbers.length > 0 ? (
                      result.ankKundali.repeatedNumbers.map((r) => (
                        <span key={r.num} className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-[10px] border border-amber-300 dark:border-amber-800">
                          #{r.num} × {r.count} times
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">Equally distributed single occurrences</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 8 Planes Analysis */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm flex items-center gap-2`}>
                <Layers className="w-4 h-4 text-[#d97706]" /> 8 Vedic Planes & Yoga Evaluations
              </h4>

              <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                {Object.values(result.ankKundali.planes).map((plane, idx) => {
                  const isFull = plane.status === 'Full (100%)';
                  const isPartial = plane.status === 'Partial (50%)';
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isFull
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700'
                          : isPartial
                          ? 'bg-amber-50/40 dark:bg-[#1c2541] border-amber-200 dark:border-[#3a506b]'
                          : 'bg-slate-50 dark:bg-[#0b132b] border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-slate-900 dark:text-white">
                          {plane.name}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            isFull
                              ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                              : isPartial
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300'
                          }`}
                        >
                          {plane.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                        {plane.meaning}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. TAB: LIFE CYCLES & ESSENCE TRANSITS                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'cycles' && result && (
        <div className="space-y-5">
          {/* Personal Current Cycles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Personal Year', value: result.cycles.personalYear, theme: result.cycles.personalYearTheme, subtitle: '9-Year Macro Cycle' },
              { label: 'Personal Month', value: result.cycles.personalMonth, theme: result.cycles.personalMonthTheme, subtitle: 'Current Month Influence' },
              { label: 'Personal Day', value: result.cycles.personalDay, theme: `Active daily vibration of #${result.cycles.personalDay}`, subtitle: 'Daily House Focus' },
            ].map((c, i) => (
              <div key={i} className={`${NUMEROLOGY_DASHBOARD_STYLES.card} text-center`}>
                <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>{c.subtitle}</p>
                <h5 className="font-bold text-xs text-slate-800 dark:text-gray-200 mt-0.5">{c.label}</h5>
                <p className={NUMEROLOGY_DASHBOARD_STYLES.bigNumber}>{c.value}</p>
                <p className="text-[11px] text-slate-600 dark:text-gray-300 mt-2 leading-relaxed">{c.theme}</p>
              </div>
            ))}
          </div>

          {/* Pinnacles & Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card}`}>
              <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-400`}>
                <TrendingUp className="w-4 h-4" /> 4 Major Life Pinnacles (Golden Harvests)
              </h4>
              <div className="space-y-2">
                {result.cycles.pinnacles.map((p, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] flex items-center justify-between">
                    <div>
                      <span className="font-serif font-bold text-[#d97706] text-xl">#{p.number}</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-gray-300 ml-2">{p.theme}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-gray-300 bg-slate-200/60 dark:bg-[#151d32] px-2.5 py-1 rounded-lg border border-slate-300/40">
                      Ages {p.ageRange}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} border-red-200/60 dark:border-red-800/40`}>
              <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm mb-3 text-red-600 dark:text-red-400 flex items-center gap-2`}>
                <ShieldAlert className="w-4 h-4" /> 4 Life Challenges (Karmic Hurdles)
              </h4>
              <div className="space-y-2">
                {result.cycles.challenges.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/30 border border-red-200/70 dark:border-red-800/40 flex items-center justify-between">
                    <div>
                      <span className="font-serif font-bold text-red-600 dark:text-red-400 text-xl">#{c.number}</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-gray-300 ml-2">{c.theme}</span>
                    </div>
                    <span className="text-[10px] font-bold text-red-500 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-lg border border-red-200">
                      Ages {c.ageRange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Letter Essence Cycles (Numerology Gochara) */}
          {essenceResult && essenceResult.cycles.length > 0 && (
            <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card}`}>
              <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm mb-3 flex items-center gap-2`}>
                <Clock className="w-4 h-4 text-[#d97706]" /> Letter Essence Transits (Name Gochara Progression)
              </h4>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">
                Each letter in the birth name activates for a duration equal to its Sanskrit numerical value.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {essenceResult.cycles.map((cyc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] text-center"
                  >
                    <span className="font-serif font-black text-lg text-slate-900 dark:text-white block">{cyc.letter}</span>
                    <span className="text-[10px] font-extrabold text-[#d97706] block">{cyc.planet}</span>
                    <span className="text-[9px] text-slate-400 block mt-1">Age {cyc.age} ({cyc.year})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. TAB: MASTER NUMBERS & KARMIC DEBTS                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'karmic' && result && (
        <div className="space-y-5">
          {/* Master Numbers (11, 22, 33) Analysis */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card}`}>
            <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-base mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-300`}>
              <Sparkles className="w-5 h-5 text-purple-600" /> Master Numbers (11, 22, 33) Reference Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(MASTER_NUMBERS).map(([k, v]) => (
                <div key={k} className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-black text-2xl text-purple-800 dark:text-purple-300">{k}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-200/70 dark:bg-purple-800 text-purple-900 dark:text-purple-200">
                      {v.higherOctave}
                    </span>
                  </div>
                  <strong className="text-xs text-purple-900 dark:text-purple-200 block">{v.name}</strong>
                  <p className="text-[11px] text-slate-600 dark:text-gray-300">{v.meaning}</p>
                  <div className="pt-2 border-t border-purple-200 dark:border-purple-800/60 text-[10px] text-slate-500 dark:text-gray-400">
                    <div><strong>Gifts:</strong> {v.gifts.join(', ')}</div>
                    <div><strong>Mantra:</strong> {v.mantra}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Karmic Debts Section */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} border-red-300/60 dark:border-red-800/50`}>
            <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-base text-red-600 dark:text-red-400 mb-3 flex items-center gap-2`}>
              <ShieldAlert className="w-5 h-5" /> Karmic Debt Diagnosis (13, 14, 16, 19)
            </h4>

            {result.karmicDebts.length > 0 ? (
              <div className="space-y-3">
                {result.karmicDebts.map((d, i) => (
                  <div key={i} className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/70 dark:border-red-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-black text-lg text-red-800 dark:text-red-300">
                        Karmic Debt #{d.number} — {d.lesson}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-200 text-[10px] font-extrabold">
                        Action Required
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">{d.description}</p>
                    <div>
                      <span className="text-[10px] font-bold text-red-800 dark:text-red-300 block mb-1">Prescribed Vedic Remedies:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {d.remedies.map((r, ri) => (
                          <span key={ri} className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-[11px] font-bold border border-red-300 dark:border-red-700">
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-700 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">No Heavy Karmic Debts Detected in Core Numbers</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Native carries clean past-life merits for current worldly endeavors.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. TAB: VEDIC ASTROLOGY BRIDGE & LUCKY ATTRIBUTES             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'bridge' && result && (
        <div className="space-y-5">
          {/* Bridge Cards */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card}`}>
            <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-base mb-3 flex items-center gap-2`}>
              <Link2 className="w-5 h-5 text-[#d97706]" /> Numerology ↔ Vimshottari Dasha Bridge
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { label: 'Moolank → Mahadasha Lord', number: result.core.moolank, lord: result.vedicBridge?.moolankDashaLord },
                { label: 'Bhagyank → Mahadasha Lord', number: result.core.bhagyank, lord: result.vedicBridge?.bhagyankDashaLord },
                { label: 'Name Number → Mahadasha Lord', number: result.core.nameNumber, lord: result.vedicBridge?.nameNumberDashaLord },
              ].map((b, i) => (
                <div key={i} className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/30 text-center">
                  <span className="text-slate-500 dark:text-gray-400 block">{b.label}</span>
                  <span className="font-mono font-bold text-xl text-[#d97706] block my-1">#{b.number}</span>
                  <span className="font-bold text-slate-900 dark:text-white block">{b.lord} Dasha Lord</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lucky Attributes Full Table */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card}`}>
            <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-base mb-4 flex items-center gap-2`}>
              <Award className="w-5 h-5 text-[#d97706]" /> Complete Vedic Auspicious Elements
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                <span className="text-slate-400 block mb-1">Lucky / Friendly Numbers</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.luckyAttributes.luckyNumbers.map((n) => (
                    <span key={n} className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      #{n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                <span className="text-slate-400 block mb-1">Enemy / Caution Numbers</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.luckyAttributes.enemyNumbers.map((n) => (
                    <span key={n} className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 font-bold text-xs">
                      #{n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                <span className="text-slate-400 block mb-1">Auspicious Colors</span>
                <strong className="text-slate-900 dark:text-white">{result.luckyAttributes.luckyColors.join(', ')}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                <span className="text-slate-400 block mb-1">Auspicious Days of Week</span>
                <strong className="text-slate-900 dark:text-white">{result.luckyAttributes.luckyDays.join(', ')}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                <span className="text-slate-400 block mb-1">Prescribed Gemstones</span>
                <strong className="text-[#d97706]">{result.luckyAttributes.luckyGemstone}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                <span className="text-slate-400 block mb-1">Ruling Deity / Guru</span>
                <strong className="text-slate-900 dark:text-white">{result.luckyAttributes.rulingDeity}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                <span className="text-slate-400 block mb-1">Auspicious Direction</span>
                <strong className="text-slate-900 dark:text-white">{result.luckyAttributes.luckyDirection}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                <span className="text-slate-400 block mb-1">Favorable Vedic Yantra</span>
                <strong className="text-slate-900 dark:text-white">{result.luckyAttributes.favorableYantra}</strong>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                <span className="text-slate-400 block mb-1">Chanting Mantra</span>
                <strong className="text-xs text-amber-700 dark:text-amber-300 font-mono">{result.luckyAttributes.keyMantra}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. TAB: NAME REMEDY & SPELLING OPTIMIZER                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'correction' && (
        <div className="space-y-5">
          {/* Interactive Live Spelling Tester */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} space-y-4`}>
            <div className="flex items-center justify-between">
              <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-base flex items-center gap-2`}>
                <Wand2 className="w-5 h-5 text-[#d97706]" /> Live Name Spelling Vibration Optimizer
              </h4>
              <button
                onClick={() => setTestSpelling(formData.name)}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#0b132b] border text-[11px] font-bold text-slate-600 dark:text-gray-300 cursor-pointer"
              >
                Reset to Original
              </button>
            </div>

            <div>
              <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>
                Test Altered Spelling (Add/Remove letters to align compound vibration)
              </label>
              <input
                type="text"
                value={testSpelling}
                onChange={(e) => setTestSpelling(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-amber-300 dark:border-amber-600 bg-amber-50/50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-serif font-bold text-base focus:outline-none"
              />
            </div>

            {testSpellingResult && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Compound Number</span>
                  <span className="font-mono font-bold text-2xl text-slate-900 dark:text-white">{testSpellingResult.core.compoundNameNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Single Name Number</span>
                  <span className="font-mono font-bold text-2xl text-[#d97706]">#{testSpellingResult.core.nameNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Ruling Planet</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block mt-1">{testSpellingResult.core.nameNumberPlanet}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Harmony with Moolank #{result?.core.moolank}</span>
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 block mt-1">
                    {testSpellingResult.core.nameNumber === result?.core.moolank
                      ? '⭐ Perfect Match'
                      : result?.luckyAttributes.luckyNumbers.includes(testSpellingResult.core.nameNumber)
                      ? '✓ Friendly Harmony'
                      : '⚠️ Neutral/Caution'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Planet Strengthening Suggestions */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} space-y-4`}>
            <div>
              <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>
                <Flame className="w-3.5 h-3.5 inline mr-1 text-[#d97706]" /> Select Planet to Strengthen via Name Vibration
              </label>
              <select
                value={targetPlanet}
                onChange={(e) => setTargetPlanet(e.target.value)}
                className={NUMEROLOGY_DASHBOARD_STYLES.input}
              >
                {Object.entries(PLANET_MEANINGS).map(([id, meta]) => (
                  <option key={id} value={id}>
                    {meta.name} — {meta.positive.slice(0, 2).join(', ')}
                  </option>
                ))}
              </select>
            </div>

            {correctionSuggestions && (
              <div className="space-y-3">
                <h5 className="font-bold text-xs text-slate-800 dark:text-gray-200 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[#d97706]" /> Recommended Remedial Letters for {PLANET_MEANINGS[targetPlanet]?.name}:
                </h5>
                <div className="space-y-2">
                  {correctionSuggestions.suggestions.map((s, i) => (
                    <div key={i} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/30 text-xs font-medium text-slate-700 dark:text-gray-300 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-[#d97706] shrink-0" /> {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. TAB: COMPATIBILITY MATRIX (LOVE & BUSINESS)                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'compatibility' && (
        <div className="space-y-5">
          {/* Dual Compatibility Input */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} grid grid-cols-1 md:grid-cols-2 gap-4`}>
            <div>
              <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>
                <Heart className="w-3.5 h-3.5 inline mr-1 text-pink-500" /> Partner / Colleague Full Name
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="e.g. Thoibi Ningthoujam"
                className={NUMEROLOGY_DASHBOARD_STYLES.input}
              />
            </div>
            <div>
              <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>
                <Calendar className="w-3.5 h-3.5 inline mr-1" /> Partner Date of Birth (Optional)
              </label>
              <input
                type="date"
                value={partnerDob}
                onChange={(e) => setPartnerDob(e.target.value)}
                className={NUMEROLOGY_DASHBOARD_STYLES.input}
              />
            </div>
          </div>

          {compatResult && formData.name.trim() && (
            <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} text-center space-y-4`}>
              <div>
                <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>Ank Shastra Compatibility Score</p>
                <p className={`font-serif font-bold text-6xl my-2 ${
                  compatResult.harmony === 'Excellent' ? 'text-emerald-500' :
                  compatResult.harmony === 'Good' ? 'text-[#d97706]' :
                  compatResult.harmony === 'Neutral' ? 'text-slate-500' : 'text-red-500'
                }`}>
                  {compatResult.score}%
                </p>
                <span className={`${NUMEROLOGY_DASHBOARD_STYLES.planetBadge}`}>{compatResult.harmony} Harmony</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs max-w-xl mx-auto">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                  <span className="text-slate-400 block">{formData.name.split(' ')[0]}</span>
                  <span className="font-bold text-[#d97706] text-sm block mt-1">#{compatResult.details.name1.number} ({compatResult.details.name1.planet})</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]">
                  <span className="text-slate-400 block">{partnerName.split(' ')[0]}</span>
                  <span className="font-bold text-[#d97706] text-sm block mt-1">#{compatResult.details.name2.number} ({compatResult.details.name2.planet})</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/30">
                  <span className="text-slate-400 block">Combined Total</span>
                  <span className="font-bold text-[#d97706] text-sm block mt-1">Compound #{compatResult.details.combined}</span>
                </div>
              </div>
            </div>
          )}

          {/* Business Name Evaluator */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} space-y-4`}>
            <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm flex items-center gap-2`}>
              <Briefcase className="w-4 h-4 text-[#d97706]" /> Business / Company Brand Name Analyzer
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>Brand or Business Name</label>
                <input
                  type="text"
                  value={businessNameInput}
                  onChange={(e) => setBusinessNameInput(e.target.value)}
                  className={NUMEROLOGY_DASHBOARD_STYLES.input}
                />
              </div>
              <div>
                <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>Primary Business Goal</label>
                <select
                  value={businessIntention}
                  onChange={(e) => setBusinessIntention(e.target.value as any)}
                  className={NUMEROLOGY_DASHBOARD_STYLES.input}
                >
                  <option value="wealth">Wealth & Revenue (8, 4, 6)</option>
                  <option value="fame">Fame & Public Reach (1, 3, 5)</option>
                  <option value="stability">Stability & Long-term (4, 8)</option>
                  <option value="innovation">Innovation & Tech (5, 3)</option>
                  <option value="harmony">Service & Healing (2, 6, 9)</option>
                </select>
              </div>
            </div>

            {businessAnalysis && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-gray-200">
                    Dominant Planet: <strong>{businessAnalysis.dominantPlanet}</strong>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs">
                    Goal Alignment Score: {businessAnalysis.scores[businessIntention]}%
                  </span>
                </div>
                {businessAnalysis.recommendations.length > 0 && (
                  <div className="text-xs text-slate-600 dark:text-gray-400">
                    {businessAnalysis.recommendations.map((r, ri) => (
                      <p key={ri}>💡 {r}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 8. TAB: MOBILE NUMBER NUMEROLOGY                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'mobile' && (
        <div className="space-y-5">
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-base flex items-center gap-2`}>
                  <Smartphone className="w-5 h-5 text-[#d97706]" /> Mobile Number Numerology (Phone Ank Shastra)
                </h4>
                <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>
                  Calculates total digit sum, planetary lord, tail vibration (last 2-4 digits), business resonance, and native harmony with Moolank &amp; Bhagyank.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold w-fit">
                Carrier &amp; Calling Frequency
              </span>
            </div>

            <div>
              <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>
                Client / Business 10-Digit Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value.replace(/[^0-9+ -]/g, ''))}
                  placeholder="e.g. 9862012345 or +91 9876543210"
                  className={`${NUMEROLOGY_DASHBOARD_STYLES.input} font-mono tracking-wider text-sm pl-10`}
                />
                <Phone className="w-4 h-4 text-amber-500 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                * Note: International country codes (+91, +1) are automatically filtered so analysis focuses strictly on the 10-digit SIM frequency.
              </p>
            </div>
          </div>

          {mobileAnalysis ? (
            <div className="space-y-5">
              {/* Primary Score & Planetary Vibrations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} text-center space-y-1`}>
                  <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>Total Compound Sum</p>
                  <p className="font-serif font-bold text-3xl text-[#d97706]">{mobileAnalysis.totalSum}</p>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">Sum of all 10 digits</p>
                </div>

                <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} text-center space-y-1`}>
                  <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>Single Reduced Digit</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-serif font-bold text-4xl text-[#d97706]">#{mobileAnalysis.singleNumber}</span>
                  </div>
                  <span className={NUMEROLOGY_DASHBOARD_STYLES.planetBadge}>{mobileAnalysis.planet}</span>
                </div>

                <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} text-center space-y-1`}>
                  <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>Tail Vibration (Last 2-4 Digits)</p>
                  <p className="font-mono font-bold text-2xl text-slate-800 dark:text-gray-100">
                    ...{mobileAnalysis.tailDigits}
                  </p>
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Tail Sum #{mobileAnalysis.tailVibration}
                  </p>
                </div>

                <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} text-center space-y-1`}>
                  <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>Auspiciousness Rating</p>
                  <p className={`font-serif font-bold text-2xl ${
                    mobileAnalysis.auspiciousness === 'Excellent' ? 'text-emerald-500' :
                    mobileAnalysis.auspiciousness === 'Good' ? 'text-amber-500' : 'text-slate-500'
                  }`}>
                    {mobileAnalysis.auspiciousness}
                  </p>
                  <span className="text-[11px] text-slate-500 dark:text-gray-400">Frequency Impact</span>
                </div>
              </div>

              {/* Native Harmony Box */}
              {mobileAnalysis.nativeHarmony && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-[#faf8f4]">
                        Native Astrological Resonance
                      </p>
                      <p className="text-xs text-slate-700 dark:text-gray-300">
                        {mobileAnalysis.nativeHarmony.recommendation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      mobileAnalysis.nativeHarmony.isFriendlyWithMoolank
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                    }`}>
                      Moolank {result?.core.moolank}: {mobileAnalysis.nativeHarmony.isFriendlyWithMoolank ? '✓ Friendly' : '• Neutral'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      mobileAnalysis.nativeHarmony.isFriendlyWithBhagyank
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                    }`}>
                      Bhagyank {result?.core.bhagyank}: {mobileAnalysis.nativeHarmony.isFriendlyWithBhagyank ? '✓ Friendly' : '• Neutral'}
                    </span>
                  </div>
                </div>
              )}

              {/* Deep Details Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Career & Personality Impact */}
                <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} space-y-3`}>
                  <h5 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm flex items-center gap-2`}>
                    <Briefcase className="w-4 h-4 text-[#d97706]" /> Business &amp; Career Suitability
                  </h5>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-gray-200">
                    {mobileAnalysis.businessCareerSuitability}
                  </p>

                  <h5 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm flex items-center gap-2 pt-2`}>
                    <User className="w-4 h-4 text-[#d97706]" /> Caller Personality &amp; Aura Impact
                  </h5>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-gray-200">
                    {mobileAnalysis.personalityImpact}
                  </p>

                  <div className="pt-2 border-t border-slate-200 dark:border-[#3a506b] space-y-1.5">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Key Strengths:</span>
                    {mobileAnalysis.strengths.map((str, sIdx) => (
                      <p key={sIdx} className="text-xs text-slate-600 dark:text-gray-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {str}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Cautions & Remedies */}
                <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} space-y-3`}>
                  <h5 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm flex items-center gap-2`}>
                    <AlertCircle className="w-4 h-4 text-amber-500" /> Potential Challenges &amp; Cautions
                  </h5>
                  {mobileAnalysis.cautions.map((c, cIdx) => (
                    <p key={cIdx} className="text-xs text-slate-600 dark:text-gray-300 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">•</span> {c}
                    </p>
                  ))}

                  <div className="pt-2 border-t border-slate-200 dark:border-[#3a506b] space-y-2">
                    <h5 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-sm flex items-center gap-2`}>
                      <Wand2 className="w-4 h-4 text-[#d97706]" /> Phone &amp; SIM Remedial Actions
                    </h5>
                    {mobileAnalysis.remedies.map((rem, rIdx) => (
                      <div key={rIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] text-xs text-slate-700 dark:text-gray-300">
                        ✨ {rem}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-[#1c2541] rounded-2xl border border-dashed border-slate-300 dark:border-[#3a506b]">
              Please enter a valid 10-digit mobile number above to calculate its numerological vibration.
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 9. TAB: VEHICLE & HOUSE VASTU NUMEROLOGY                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'vehicle' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Vehicle Number */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} space-y-4`}>
            <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-base flex items-center gap-2`}>
              <Car className="w-5 h-5 text-[#d97706]" /> Vehicle Plate Number Auspiciousness
            </h4>
            <div>
              <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>Vehicle Number (e.g. MN01AB1234 or 4321)</label>
              <input
                type="text"
                value={vehicleInput}
                onChange={(e) => setVehicleInput(e.target.value)}
                className={NUMEROLOGY_DASHBOARD_STYLES.input}
              />
            </div>
            {vehicleAnalysis && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Reduced Number:</span>
                  <span className="font-mono font-bold text-xl text-[#d97706]">#{vehicleAnalysis.reduced} ({vehicleAnalysis.planet})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Auspiciousness:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{vehicleAnalysis.auspicious}</span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 mt-1">{vehicleAnalysis.meaning}</p>
                {vehicleAnalysis.remedies && (
                  <div className="pt-2 border-t border-slate-200 dark:border-[#3a506b]">
                    <span className="font-bold text-amber-700 dark:text-amber-300 block mb-1">Remedial Advice:</span>
                    {vehicleAnalysis.remedies.map((rem, rIdx) => (
                      <p key={rIdx} className="text-[11px] text-slate-500 dark:text-gray-400">✓ {rem}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* House / Flat Number */}
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} space-y-4`}>
            <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-base flex items-center gap-2`}>
              <Compass className="w-5 h-5 text-[#d97706]" /> House / Flat / Plot Number Vastu
            </h4>
            <div>
              <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>House or Flat Number (e.g. 42 or B-108)</label>
              <input
                type="text"
                value={houseInput}
                onChange={(e) => setHouseInput(e.target.value)}
                className={NUMEROLOGY_DASHBOARD_STYLES.input}
              />
            </div>
            {houseAnalysis && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Reduced Vastu Number:</span>
                  <span className="font-mono font-bold text-xl text-[#d97706]">#{houseAnalysis.reduced} ({houseAnalysis.planet})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Vastu Auspiciousness:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{houseAnalysis.auspicious}</span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 mt-1">{houseAnalysis.meaning}</p>
                {houseAnalysis.remedies && (
                  <div className="pt-2 border-t border-slate-200 dark:border-[#3a506b]">
                    <span className="font-bold text-amber-700 dark:text-amber-300 block mb-1">Vastu Remedial Action:</span>
                    {houseAnalysis.remedies.map((rem, rIdx) => (
                      <p key={rIdx} className="text-[11px] text-slate-500 dark:text-gray-400">✓ {rem}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 9. TAB: PRASHNA / HORARY NUMEROLOGY ORACLE                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'prashna' && (
        <div className="space-y-5">
          <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} space-y-4`}>
            <div>
              <h4 className={`${NUMEROLOGY_DASHBOARD_STYLES.title} text-base flex items-center gap-2`}>
                <HelpCircle className="w-5 h-5 text-[#d97706]" /> Instant Prashna / Horary Numerology Oracle
              </h4>
              <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>
                Ask a specific question; the oracle calculates the time vibration + name resonance to reveal immediate guidance.
              </p>
            </div>

            <form onSubmit={handleRunPrashna} className="space-y-3">
              <div>
                <label className={NUMEROLOGY_DASHBOARD_STYLES.label}>Enter Client&apos;s Immediate Question</label>
                <input
                  type="text"
                  required
                  value={prashnaQuestion}
                  onChange={(e) => setPrashnaQuestion(e.target.value)}
                  placeholder="e.g. Will my visa approval come this month?"
                  className={NUMEROLOGY_DASHBOARD_STYLES.input}
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Cast Numerology Prashna</span>
              </button>
            </form>

            {prashnaResult && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#0b132b] dark:to-[#1c2541] border border-amber-300 dark:border-amber-600/50 space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-amber-200 dark:border-[#3a506b]">
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">
                    Question: &quot;{prashnaResult.question}&quot;
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs ${
                      prashnaResult.answer === 'Yes'
                        ? 'bg-emerald-100 text-emerald-800'
                        : prashnaResult.answer === 'Delay'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Oracle Answer: {prashnaResult.answer}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Vibration Number</span>
                    <strong className="text-lg text-[#d97706]">#{prashnaResult.number} ({prashnaResult.planet})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Expected Timing</span>
                    <strong className="text-slate-900 dark:text-white">{prashnaResult.timing}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Vedic Guidance</span>
                    <strong className="text-slate-900 dark:text-white">{prashnaResult.guidance}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!result && !calcError && (
        <div className={`${NUMEROLOGY_DASHBOARD_STYLES.card} text-center py-10`}>
          <Sparkles className="w-10 h-10 text-[#d97706] mx-auto mb-2 animate-pulse" />
          <p className={NUMEROLOGY_DASHBOARD_STYLES.subtitle}>Enter name and date of birth above to generate full Ank Shastra dossier.</p>
        </div>
      )}
    </div>
  );
}