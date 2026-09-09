'use client';

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  Calendar,
  Clock,
  User,
  Flame,
  Globe,
  Wind,
  Droplets,
  ChevronRight,
  Award,
  Layers,
  CheckCircle2,
  RefreshCw,
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
} from 'lucide-react';
import { calculatePlanetaryPositions } from '@/engine/ephemeris';
import {
  buildDirectionalGroups,
  generateBNNPredictions,
  calculateBNNProgressions,
  generateTargetedQueryPrediction,
  TARGETED_QUERY_OPTIONS,
  TargetedQueryType,
  TargetedQueryPrediction,
  BNNPlanet,
  DirectionType,
  SIGN_INFO,
} from '@/engine/bnn';
import { calculateExactAge } from '@/components/dashboard/VedicWorkstation';

interface BNNWorkstationProps {
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
  name: 'Sanatomba Meitei',
  sex: 'Male',
  dob: '2004-06-28',
  tob: '06:00',
  pob: 'Imphal, Manipur',
  lat: 24.817,
  lng: 93.9368,
  timezone: 5.5,
};

export default function BNNWorkstation({ initialBirthData, onClose }: BNNWorkstationProps) {
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

  const [activeTab, setActiveTab] = useState<'inquiry' | 'matrix' | 'predictions' | 'progression' | 'input'>('inquiry');
  const [selectedQuery, setSelectedQuery] = useState<TargetedQueryType>('govt-job');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'jiva' | 'karma' | 'marriage' | 'wealth' | 'spirituality'>('all');

  // Exact age calculation
  const exactAge = useMemo(() => {
    return calculateExactAge(formData.dob, formData.tob);
  }, [formData.dob, formData.tob]);

  const runningAge = exactAge?.runningYear || 23;
  const birthYear = parseInt((formData.dob || '2004-01-01').split('-')[0], 10) || 2004;

  const [selectedProgressionAge, setSelectedProgressionAge] = useState<number>(runningAge);

  // Compute Planetary positions using high-precision ephemeris
  const bnnData = useMemo(() => {
    try {
      const { planets, ascendant, ayanamsa } = calculatePlanetaryPositions({
        name: formData.name,
        gender: formData.sex,
        dateOfBirth: formData.dob,
        timeOfBirth: formData.tob,
        latitude: Number(formData.lat) || 24.817,
        longitude: Number(formData.lng) || 93.9368,
        timezone: 'Asia/Kolkata',
        utcOffset: Number(formData.timezone) || 5.5,
        ayanamsa: 'Lahiri',
      });

      const dirGroups = buildDirectionalGroups(planets);

      // Collect all BNN planets
      const allBNNPlanets: BNNPlanet[] = [];
      Object.values(dirGroups).forEach((g) => {
        allBNNPlanets.push(...g.planets);
      });

      const predictions = generateBNNPredictions(allBNNPlanets);
      const progressions = calculateBNNProgressions(allBNNPlanets, selectedProgressionAge, birthYear);

      return {
        ascendant,
        ayanamsa,
        dirGroups,
        allBNNPlanets,
        predictions,
        progressions,
      };
    } catch (e) {
      console.error('BNN Calculation error:', e);
      return null;
    }
  }, [formData, selectedProgressionAge, birthYear]);

  if (!bnnData) {
    return (
      <div className="p-8 text-center text-rose-500 font-bold bg-white rounded-3xl border border-rose-200">
        Error generating BNN calculations. Please check birth details.
      </div>
    );
  }

  const filteredPredictions =
    categoryFilter === 'all'
      ? bnnData.predictions
      : bnnData.predictions.filter((p) => p.category === categoryFilter);

  // Compute targeted query prediction (Dasha, Career, Marriage, Govt. Job, etc.)
  const targetedPrediction = useMemo(() => {
    if (!bnnData) return null;
    return generateTargetedQueryPrediction(
      selectedQuery,
      bnnData.allBNNPlanets,
      runningAge,
      formData.sex
    );
  }, [selectedQuery, bnnData, runningAge, formData.sex]);

  const getQueryIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'Award':
        return <Award className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'Coins':
        return <Coins className={className} />;
      case 'Plane':
        return <Plane className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const getDirectionIcon = (dir: DirectionType) => {
    switch (dir) {
      case 'East':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'South':
        return <Globe className="w-4 h-4 text-emerald-600" />;
      case 'West':
        return <Wind className="w-4 h-4 text-sky-500" />;
      case 'North':
        return <Droplets className="w-4 h-4 text-blue-600" />;
    }
  };

  const getDirectionTheme = (dir: DirectionType) => {
    switch (dir) {
      case 'East':
        return 'border-orange-200 bg-orange-50/40';
      case 'South':
        return 'border-emerald-200 bg-emerald-50/40';
      case 'West':
        return 'border-sky-200 bg-sky-50/40';
      case 'North':
        return 'border-blue-200 bg-blue-50/40';
    }
  };

  return (
    <div className="w-full bg-[#f4f7f4] text-slate-900 font-sans p-3 sm:p-5 rounded-3xl border border-slate-300/80 shadow-2xl space-y-4 max-w-7xl mx-auto">
      {/* 1. TOP HEADER & WORKSTATION CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                Bhrigu Nandi Nadi (BNN) Workstation
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-300">
                Nadi Prediction Suite
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Client: <span className="font-bold text-amber-900">{formData.name}</span>
              {exactAge && (
                <> • Age: <span className="font-bold text-emerald-800 font-mono">{exactAge.years}y {exactAge.months}m {exactAge.days}d (Running {exactAge.runningYear}th Year / চৎলিবা {exactAge.runningYear}শুবা চহি)</span></>
              )} • DOB: <span className="font-bold">{formData.dob}</span> at <span className="font-bold">{formData.tob}</span> • POB: <span className="font-bold">{formData.pob}</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation & Close */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('inquiry')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'inquiry' ? 'bg-indigo-600 text-white shadow-xs font-black' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Targeted Inquiry (পাম্বিবগী ফল)</span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'matrix' ? 'bg-white text-indigo-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Directional Matrix
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'predictions' ? 'bg-white text-indigo-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Karaka Combinations ({bnnData.predictions.length})
            </button>
            <button
              onClick={() => setActiveTab('progression')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'progression' ? 'bg-white text-indigo-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Age Progression
            </button>
            <button
              onClick={() => setActiveTab('input')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'input' ? 'bg-white text-indigo-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Edit Details
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 cursor-pointer"
              title="Close BNN Workstation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. INQUIRY FOCUS SELECTION BAR (WHAT IS CLIENT LOOKING FOR?) */}
      <div className="bg-white rounded-2xl border border-indigo-200/90 p-3.5 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  What is the client looking for?
                </h3>
                <span className="text-xs font-semibold text-indigo-700 font-serif">
                  (ক্লায়েন্টনা পাম্বিবগী কাংলুপ খনবীয়ু)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Choose a topic (Govt. Job, Career, Marriage, Dasha, Wealth, etc.) to generate an instant targeted prediction.
              </p>
            </div>
          </div>

          {/* Selection Dropdown Box */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Topic:</span>
            <select
              value={selectedQuery}
              onChange={(e) => {
                setSelectedQuery(e.target.value as TargetedQueryType);
                setActiveTab('inquiry');
              }}
              className="px-3 py-1.5 rounded-xl border border-indigo-300 bg-indigo-50/80 text-indigo-950 text-xs font-black focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
            >
              {TARGETED_QUERY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} ({opt.bnLabel})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Selection Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {TARGETED_QUERY_OPTIONS.map((opt) => {
            const isSelected = selectedQuery === opt.id && activeTab === 'inquiry';
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedQuery(opt.id);
                  setActiveTab('inquiry');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs font-black ring-2 ring-indigo-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {getQueryIcon(opt.iconName, 'w-3.5 h-3.5')}
                <span>{opt.label.split(' & ')[0]}</span>
                <span className="text-[10px] opacity-75 font-serif font-normal">
                  ({opt.bnLabel.split(' ')[0]})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TAB 0: TARGETED INQUIRY PREDICTION (GOVT JOB, CAREER, MARRIAGE, DASHA, WEALTH, ETC.) */}
      {activeTab === 'inquiry' && targetedPrediction && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-indigo-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            
            {/* Header / Title Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                  {getQueryIcon(TARGETED_QUERY_OPTIONS.find(o => o.id === selectedQuery)?.iconName || 'Sparkles', 'w-6 h-6')}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Targeted Astrological Inquiry
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      BNN & Vedic Synthesis
                    </span>
                  </div>
                  <h2 className="font-serif font-black text-xl sm:text-2xl text-slate-950 mt-0.5">
                    {targetedPrediction.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-serif font-medium">
                    {targetedPrediction.bengaliTitle}
                  </p>
                </div>
              </div>

              {/* Verdict Badge */}
              <div className="text-left sm:text-right">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-2xs border ${
                  targetedPrediction.verdictType === 'excellent'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : targetedPrediction.verdictType === 'favorable'
                    ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{targetedPrediction.verdict}</span>
                </div>
                <div className="text-[10px] text-slate-600 font-serif font-medium mt-1">
                  ({targetedPrediction.bengaliVerdict})
                </div>
              </div>
            </div>

            {/* Timing Window & Primary Influencing Planets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                    Favorable Timing Window (মতম):
                  </span>
                  <span className="text-xs font-bold text-amber-950 block font-mono">
                    {targetedPrediction.timingWindow}
                  </span>
                  <span className="text-[11px] text-amber-800 font-serif block mt-0.5">
                    {targetedPrediction.bengaliTimingWindow}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3">
                <Layers className="w-5 h-5 text-indigo-700 shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Primary Influencing Planets (মরুওইবা গ্রহশিং):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                    {targetedPrediction.primaryPlanets.map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-white text-indigo-950 font-bold text-[11px] border border-slate-200 shadow-2xs">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Predictions (English Primary, Manipuri Secondary) */}
            <div className="space-y-3 pt-1">
              {/* Primary English Synthesis */}
              <div className="bg-[#fffdfa] border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Astrological Reading & Timing Synthesis:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {targetedPrediction.englishPrediction}
                </p>
              </div>

              {/* Secondary Manipuri Synthesis in Bengali Script */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>মৈতৈলোন (Manipuri Nadi Phala):</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 font-serif leading-relaxed">
                  {targetedPrediction.bengaliPrediction}
                </p>
              </div>
            </div>

            {/* 3 Key Factors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {targetedPrediction.keyFactors.map((factor, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {factor.label} ({factor.bnLabel})
                  </span>
                  <span className="text-xs font-bold text-slate-900 block">
                    {factor.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Astrological Remedies & Recommendations */}
            <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-xs sm:text-sm text-amber-950">
                  Astrological Remedies & Recommendations (লাই খুরুম্বা ও উপায়ে)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* English Remedies */}
                <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
                    Recommended Actions & Guidance:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-800">
                    {targetedPrediction.remedies.map((rem, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Manipuri Remedies */}
                <div className="bg-white/80 rounded-xl p-3 border border-amber-200/60 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                    লাইনিংগী উপায়ে (Manipuri):
                  </span>
                  <ul className="space-y-1 text-xs text-emerald-950 font-serif">
                    {targetedPrediction.bengaliRemedies.map((rem, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. TAB 1: DIRECTIONAL MATRIX (নোংপোক, মখা, নোংচুপ, অৱাং) */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(bnnData.dirGroups) as DirectionType[]).map((dir) => {
              const group = bnnData.dirGroups[dir];
              const manipuriDir = dir === 'East' ? 'নোংপোক' : dir === 'South' ? 'মখা' : dir === 'West' ? 'নোংচুপ' : 'অৱাং';
              const manipuriElem = dir === 'East' ? 'মৈ' : dir === 'South' ? 'লৈপাক' : dir === 'West' ? 'নুংশিৎ' : 'ঈশিং';
              return (
                <div
                  key={dir}
                  className={`rounded-2xl border p-3.5 shadow-xs flex flex-col justify-between ${getDirectionTheme(dir)}`}
                >
                  <div>
                    {/* Direction Header */}
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        {getDirectionIcon(dir)}
                        <span className="font-bold text-sm text-slate-900">
                          {group.direction} <span className="text-xs font-semibold text-slate-600">({manipuriDir})</span>
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                        {group.element} ({manipuriElem})
                      </span>
                    </div>

                    {/* Signs contained */}
                    <div className="text-[11px] text-slate-500 font-medium mb-2 flex items-center gap-1.5 flex-wrap">
                      <span>Signs (রাশি):</span>
                      {group.signs.map((s) => (
                        <span key={s.index} className="bg-white/80 px-1.5 py-0.5 rounded text-[10px] text-slate-700 border border-slate-200">
                          {s.name} ({s.bengali})
                        </span>
                      ))}
                    </div>

                    {/* Planets contained */}
                    <div className="space-y-2 mt-2">
                      {group.planets.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-3 text-center">No planets in this direction (মাইকৈ অসিদা গ্রহ লৈতে)</p>
                      ) : (
                        group.planets.map((p) => (
                          <div
                            key={p.id}
                            className="bg-white rounded-xl p-2 border border-slate-200 shadow-2xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                                {p.name}
                                <span className="text-slate-500 font-normal">({p.bengaliName.split(' ')[0]})</span>
                                {p.isRetrograde && (
                                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1 rounded border border-rose-200" title="Vakri / Retrograde">
                                    [R]
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                                {p.signName} {p.formattedDegree}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-600 font-medium leading-tight">
                              <div className="font-semibold text-slate-800">{p.karakatwa}</div>
                              <div className="text-[9px] text-slate-500 italic mt-0.5">{p.bengaliKarakatwa}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px] text-slate-600 flex items-center justify-between">
                    <span>1-5-9 Trine Link (ত্রিকোণ মরী):</span>
                    <strong className="text-slate-900">{group.planets.length} {group.planets.length === 1 ? 'Planet' : 'Planets'}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Core BNN Rule Reference Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs text-xs text-slate-700 leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-sm">
              <Compass className="w-4 h-4 text-indigo-600" />
              Bhrigu Nandi Nadi Core Directional Rules (BNN ত্রিকোণ সংযোগ নীতি)
            </div>
            <p className="text-slate-700">
              In Bhrigu Nandi Nadi (BNN), planets in the <strong>same direction (1-5-9 Trine)</strong> unite with 100% mutual influence.
              The planet in the <strong>2nd house</strong> indicates upcoming fruition and wealth, while the <strong>12th house</strong> represents past-life karma. Retrograde <strong>[R]</strong> planets also cast their full influence from their preceding sign.
            </p>
            <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
              ভৃগু নন্দী নাড়ী (BNN) মতুং ইন্না, অমত্তা ওইবা মাইকৈদা লৈরিবা (১-৫-৯ ত্রিকোণ) গ্রহশিংনা অমনা অমদা ১০০% মপাঙ্গল পীদুনা পুনশিল্লি। গ্রহ অমগী ২শুবা য়ুমদা লৈবা গ্রহনা তুংগী শক্তি তাক্লি, অমসুং ১২শুবা য়ুমদা লৈবনা মমাংগী কর্মগী শক্তি পীরি। বক্রী [R] গ্রহশিংনা মমাংগী রাশিদগীসু শক্তি পীবা ঙম্মী।
            </p>
          </div>
        </div>
      )}

      {/* 3. TAB 2: KARAKA PREDICTIONS (কারক যোগ অমসুং লাইবক য়েংবা) */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Predictions (পুম্নমক)' },
              { id: 'jiva', label: 'Jiva & Self (পুন্সি অমসুং থৱায়)' },
              { id: 'karma', label: 'Karma & Career (কর্ম অমসুং থবক)' },
              { id: 'marriage', label: 'Marriage & Spouse (দাম্পত্য)' },
              { id: 'wealth', label: 'Wealth & Assets (শেন-থুম)' },
              { id: 'spirituality', label: 'Spirituality & Moksha (মোক্ষ)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  categoryFilter === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Predictions Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPredictions.length === 0 ? (
              <div className="col-span-2 bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                No major yogas found for this category (মসিগী কাংলুপ অসিদা অচৌবা যোগ লৈতে).
              </div>
            ) : (
              filteredPredictions.map((pred) => (
                <div
                  key={pred.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5 flex flex-col justify-between hover:border-indigo-300 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        {pred.categoryTitle}
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        Link: {pred.connectionType}
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-base text-slate-900">
                      {pred.title}
                    </h3>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {pred.planetsInvolved.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold"
                        >
                          {p}
                        </span>
                      ))}
                    </div>

                    {/* Primary English Description */}
                    <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-200">
                      {pred.description}
                    </p>

                    {/* Secondary Manipuri Prediction in Bengali Script */}
                    <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/80 space-y-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 block">
                        মৈতৈলোন (Manipuri Nadi Phala):
                      </span>
                      <p className="text-xs text-emerald-950 font-serif leading-relaxed">
                        {pred.bengaliDescription}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Strength: <strong className="text-indigo-800">{pred.strength}</strong></span>
                    <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                      BNN System <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. TAB 3: AGE PROGRESSION (চহি খুদিংগী নাড়ী গোচর) */}
      {activeTab === 'progression' && (
        <div className="space-y-4">
          {/* Age Selection Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 block">Select Running Age (চৎলিবা চহি খনবীয়ু):</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-serif font-black text-2xl text-indigo-900">
                  Age {selectedProgressionAge} <span className="text-base font-medium text-slate-500">(চহি {selectedProgressionAge})</span>
                </span>
                <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Year {birthYear + selectedProgressionAge - 1}
                </span>
                {selectedProgressionAge === runningAge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Current Year (হৌজিক চৎলিবা)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedProgressionAge((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200"
              >
                Previous Year (মমাংগী)
              </button>
              <button
                onClick={() => setSelectedProgressionAge(runningAge)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200"
              >
                Current ({runningAge})
              </button>
              <button
                onClick={() => setSelectedProgressionAge((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200"
              >
                Next Year (তুংগী)
              </button>
            </div>
          </div>

          {/* Current Selected Year Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Progressed Jupiter Card */}
            <div className="bg-amber-50/70 rounded-2xl border border-amber-300 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Progressed Jupiter (গুরু নাড়ী গোচর)
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded">
                  12-Yr Cycle (১২ চহি)
                </span>
              </div>
              <div className="pt-1">
                <span className="text-xl font-serif font-black text-amber-950 block">
                  {bnnData.progressions.currentProgression.jupiterSignName}
                </span>
                <span className="text-xs text-amber-800 font-medium">
                  Transit sign for Age {selectedProgressionAge} (চহি {selectedProgressionAge}গী রাশি)
                </span>
              </div>
            </div>

            {/* Progressed Saturn Card */}
            <div className="bg-sky-50/70 rounded-2xl border border-sky-300 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-sky-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-600" />
                  Progressed Saturn (শনি নাড়ী গোচর)
                </span>
                <span className="text-[10px] font-mono font-bold bg-sky-200/90 text-sky-950 px-2 py-0.5 rounded">
                  30-Yr Cycle (৩০ চহি)
                </span>
              </div>
              <div className="pt-1">
                <span className="text-xl font-serif font-black text-sky-950 block">
                  {bnnData.progressions.currentProgression.saturnSignName}
                </span>
                <span className="text-xs text-sky-800 font-medium">
                  2.5 Years per Sign (লেংদনা লৈবা কর্ম রাশি)
                </span>
              </div>
            </div>

            {/* Activated Natal Planets Card */}
            <div className="bg-emerald-50/70 rounded-2xl border border-emerald-300 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Activated Natal Planets (থোকপা গ্রহশিং)
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-200/90 text-emerald-950 px-2 py-0.5 rounded">
                  {bnnData.progressions.currentProgression.activatedNatalPlanets.length} Planets
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {bnnData.progressions.currentProgression.activatedNatalPlanets.length === 0 ? (
                  <span className="text-xs text-emerald-800 italic">No direct natal conjunction in this transit</span>
                ) : (
                  bnnData.progressions.currentProgression.activatedNatalPlanets.map((p) => (
                    <span
                      key={p.id}
                      className="px-2 py-0.5 rounded-lg bg-white text-emerald-900 font-bold text-xs border border-emerald-300 shadow-2xs"
                    >
                      {p.name} ({p.bengaliName.split(' ')[0]})
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Year Specific Prediction Themes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              Key Prediction Themes for Running Age {selectedProgressionAge} (Year {birthYear + selectedProgressionAge - 1})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bnnData.progressions.currentProgression.bengaliThemes.map((theme, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-900">
                    {bnnData.progressions.currentProgression.keyThemes[i]}
                  </p>
                  <p className="text-[11px] text-emerald-900 font-serif">
                    {theme}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Table Window */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800">
              Multi-Year Progression Timeline (চহি খুদিংগী নাড়ী য়েংবা)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 text-[11px] font-bold">
                  <tr>
                    <th className="p-2.5">Running Age (চহি)</th>
                    <th className="p-2.5">Year</th>
                    <th className="p-2.5">Jupiter Transit (গুরু)</th>
                    <th className="p-2.5">Saturn Transit (শনি)</th>
                    <th className="p-2.5">Key Themes (মরুওইবা ফল)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bnnData.progressions.timeline.map((item) => (
                    <tr
                      key={item.runningAge}
                      onClick={() => setSelectedProgressionAge(item.runningAge)}
                      className={`cursor-pointer transition-all ${
                        item.isCurrentAge
                          ? 'bg-amber-50/80 font-bold'
                          : item.runningAge === selectedProgressionAge
                          ? 'bg-indigo-50/60 font-bold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-2.5 font-mono">
                        Age {item.runningAge}
                        {item.isCurrentAge && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                            Current
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">{item.calendarYear}</td>
                      <td className="p-2.5 text-amber-900">{item.jupiterSignName}</td>
                      <td className="p-2.5 text-sky-900">{item.saturnSignName}</td>
                      <td className="p-2.5 text-slate-800 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate">{item.keyThemes[0]}</div>
                        <div className="text-[10px] text-slate-500 italic truncate">{item.bengaliThemes[0]}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 4: EDIT DETAILS (পোকপগী অকুপ্পা ৱারোল হোংদোকপা) */}
      {activeTab === 'input' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 max-w-2xl mx-auto">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-serif font-black text-lg text-slate-900">
              Edit Particulars (পোকপগী অকুপ্পা ৱারোল হোংদোকপা)
            </h3>
            <p className="text-xs text-slate-500">
              Update client birth date, time, or location to recalculate BNN directional positions and predictions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Full Name (মমিং):</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 bg-[#fffdfa]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Gender (নুপা / নুপী):</label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 bg-[#fffdfa]"
              >
                <option value="Male">Male (নুপা - Jupiter is Jiva Karaka / গুরু অসি জীবனி)</option>
                <option value="Female">Female (নুপী - Venus is Jiva Karaka / শুক্র অসি জীবনি)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Date of Birth (পোকপা নুমিৎ):</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 bg-[#fffdfa]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Time of Birth (পোকপা পুংফম):</label>
              <input
                type="time"
                value={formData.tob}
                onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 bg-[#fffdfa]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-bold mb-1">Place of Birth (পোকপা মফম):</label>
              <input
                type="text"
                value={formData.pob}
                onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 bg-[#fffdfa]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('matrix')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-xs"
            >
              Update & Recalculate (অমুক্কা হন্না য়েংবা)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
