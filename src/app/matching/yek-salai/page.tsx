'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, ShieldCheck, AlertTriangle, CheckCircle2, Sparkles, RefreshCw, 
  User, Calendar, Clock, MapPin, ArrowRight, Share2, Printer, Search, Info, Flame, Droplets, Mountain, Wind, Sun, Check,
  PlusCircle, Edit3, BookmarkCheck, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { 
  SALAI_TARET, MANIPUR_SURNAMES_DB, searchManipuriSurnamesWithCustom, findSurnameExact, getSalaiIdFromName,
  evaluateYekSalai, calculateNgaIshing, evaluateManglikFromPositions, calculateDetailedAshtakoot,
  SalaiItem, YekSalaiMatchResult, ManipuriSurnameEntry, CustomSurnameEntry,
  getStoredCustomSurnames, saveCustomSurname
} from '@/engine/yekSalai';
import { calculatePlanetaryPositions } from '@/engine/ephemeris';
import { getNakshatraInfo } from '@/engine/nakshatras';
import ExcelMatchReport from '@/components/ExcelMatchReport';

export default function YekSalaiMatchingPage() {
  const [viewMode, setViewMode] = useState<'EXCEL_VIEW' | 'DETAILED_VIEW'>('EXCEL_VIEW');
  const [hasCalculated, setHasCalculated] = useState(false);

  // Custom User-Saved Surnames (persisted in localStorage)
  const [customSurnames, setCustomSurnames] = useState<CustomSurnameEntry[]>([]);
  useEffect(() => {
    setCustomSurnames(getStoredCustomSurnames());
  }, []);

  // Groom Inputs
  const [groomName, setGroomName] = useState('Moirangthem Suraj Singh');
  const [groomSurnameQuery, setGroomSurnameQuery] = useState('Moirangthem');
  const [selectedGroomSurname, setSelectedGroomSurname] = useState<ManipuriSurnameEntry | undefined>(() => 
    findSurnameExact('Moirangthem') || MANIPUR_SURNAMES_DB[428]
  );
  const [groomSalaiId, setGroomSalaiId] = useState('moirang');
  const [groomDob, setGroomDob] = useState('1986-07-02');
  const [groomTob, setGroomTob] = useState('09:45');
  const [groomPob, setGroomPob] = useState('Imphal, Manipur');
  const [groomLat, setGroomLat] = useState(24.817);
  const [groomLon, setGroomLon] = useState(93.936);

  // Groom Manual Yek State
  const [showGroomManual, setShowGroomManual] = useState(false);
  const [manualGroomEnglish, setManualGroomEnglish] = useState('');
  const [manualGroomManipuri, setManualGroomManipuri] = useState('');
  const [manualGroomSalaiId, setManualGroomSalaiId] = useState('moirang');
  const [manualGroomSaveDb, setManualGroomSaveDb] = useState(true);
  const [groomManualSuccessMsg, setGroomManualSuccessMsg] = useState('');

  // Bride Inputs
  const [brideName, setBrideName] = useState('Tombi');
  const [brideSurnameQuery, setBrideSurnameQuery] = useState('Thokchom');
  const [selectedBrideSurname, setSelectedBrideSurname] = useState<ManipuriSurnameEntry | undefined>(() => 
    findSurnameExact('Thokchom') || MANIPUR_SURNAMES_DB[709]
  );
  const [brideSalaiId, setBrideSalaiId] = useState('khuman');
  const [brideDob, setBrideDob] = useState('1996-02-21');
  const [brideTob, setBrideTob] = useState('07:15');
  const [bridePob, setBridePob] = useState('Imphal, Manipur');
  const [brideLat, setBrideLat] = useState(24.817);
  const [brideLon, setBrideLon] = useState(93.936);

  // Bride Manual Yek State
  const [showBrideManual, setShowBrideManual] = useState(false);
  const [manualBrideEnglish, setManualBrideEnglish] = useState('');
  const [manualBrideManipuri, setManualBrideManipuri] = useState('');
  const [manualBrideSalaiId, setManualBrideSalaiId] = useState('khuman');
  const [manualBrideSaveDb, setManualBrideSaveDb] = useState(true);
  const [brideManualSuccessMsg, setBrideManualSuccessMsg] = useState('');

  // Autocomplete suggestions dropdown state
  const [showGroomSuggestions, setShowGroomSuggestions] = useState(false);
  const [showBrideSuggestions, setShowBrideSuggestions] = useState(false);

  // Filtered Surname Suggestions including stored Custom Surnames
  const groomSurnameSuggestions = useMemo(() => {
    return searchManipuriSurnamesWithCustom(groomSurnameQuery, customSurnames);
  }, [groomSurnameQuery, customSurnames]);

  const brideSurnameSuggestions = useMemo(() => {
    return searchManipuriSurnamesWithCustom(brideSurnameQuery, customSurnames);
  }, [brideSurnameQuery, customSurnames]);

  // Handle Groom Surname Selection
  const handleSelectGroomSurname = (entry: ManipuriSurnameEntry) => {
    setSelectedGroomSurname(entry);
    setGroomSurnameQuery(entry.english);
    const sId = getSalaiIdFromName(entry.primary_salai);
    setGroomSalaiId(sId);
    setShowGroomSuggestions(false);
  };

  // Handle Bride Surname Selection
  const handleSelectBrideSurname = (entry: ManipuriSurnameEntry) => {
    setSelectedBrideSurname(entry);
    setBrideSurnameQuery(entry.english);
    const sId = getSalaiIdFromName(entry.primary_salai);
    setBrideSalaiId(sId);
    setShowBrideSuggestions(false);
  };

  // Handle Manual Groom Salai Save
  const handleSaveGroomManualSalai = () => {
    const trimmedEng = manualGroomEnglish.trim();
    if (!trimmedEng) return;
    if (manualGroomSaveDb) {
      const saved = saveCustomSurname({
        english: trimmedEng,
        manipuri: manualGroomManipuri.trim() || trimmedEng,
        salaiId: manualGroomSalaiId
      });
      const updated = getStoredCustomSurnames();
      setCustomSurnames(updated);
      setSelectedGroomSurname(saved);
    } else {
      const sal = SALAI_TARET.find(s => s.id === manualGroomSalaiId) || SALAI_TARET[0];
      setSelectedGroomSurname({
        id: 999000 + Math.floor(Math.random() * 1000),
        english: trimmedEng,
        manipuri: manualGroomManipuri.trim() || trimmedEng,
        salais: [sal.name],
        salais_meitei: [sal.meeteiMayek],
        primary_salai: sal.name,
        primary_salai_meitei: sal.meeteiMayek,
        isCustom: true
      });
    }
    setGroomSurnameQuery(trimmedEng);
    setGroomSalaiId(manualGroomSalaiId);
    setShowGroomManual(false);
    const chosenSal = SALAI_TARET.find(s => s.id === manualGroomSalaiId)?.name;
    setGroomManualSuccessMsg(`Saved & Assigned to ${chosenSal}!`);
    setTimeout(() => setGroomManualSuccessMsg(''), 4000);
  };

  // Handle Manual Bride Salai Save
  const handleSaveBrideManualSalai = () => {
    const trimmedEng = manualBrideEnglish.trim();
    if (!trimmedEng) return;
    if (manualBrideSaveDb) {
      const saved = saveCustomSurname({
        english: trimmedEng,
        manipuri: manualBrideManipuri.trim() || trimmedEng,
        salaiId: manualBrideSalaiId
      });
      const updated = getStoredCustomSurnames();
      setCustomSurnames(updated);
      setSelectedBrideSurname(saved);
    } else {
      const sal = SALAI_TARET.find(s => s.id === manualBrideSalaiId) || SALAI_TARET[0];
      setSelectedBrideSurname({
        id: 999000 + Math.floor(Math.random() * 1000),
        english: trimmedEng,
        manipuri: manualBrideManipuri.trim() || trimmedEng,
        salais: [sal.name],
        salais_meitei: [sal.meeteiMayek],
        primary_salai: sal.name,
        primary_salai_meitei: sal.meeteiMayek,
        isCustom: true
      });
    }
    setBrideSurnameQuery(trimmedEng);
    setBrideSalaiId(manualBrideSalaiId);
    setShowBrideManual(false);
    const chosenSal = SALAI_TARET.find(s => s.id === manualBrideSalaiId)?.name;
    setBrideManualSuccessMsg(`Saved & Assigned to ${chosenSal}!`);
    setTimeout(() => setBrideManualSuccessMsg(''), 4000);
  };

  // Calculate Other / Calculate Another Handler
  const handleCalculateOther = () => {
    setGroomName('');
    setGroomSurnameQuery('');
    setSelectedGroomSurname(undefined);
    setBrideName('');
    setBrideSurnameQuery('');
    setSelectedBrideSurname(undefined);
    setHasCalculated(false);
    setTimeout(() => {
      document.getElementById('matching-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Active Salai Items
  const groomSalai = useMemo(() => {
    return SALAI_TARET.find(s => s.id === groomSalaiId) || SALAI_TARET[4]; // default Moirang
  }, [groomSalaiId]);

  const brideSalai = useMemo(() => {
    return SALAI_TARET.find(s => s.id === brideSalaiId) || SALAI_TARET[2]; // default Khuman
  }, [brideSalaiId]);

  // Evaluate Yek Salai Compatibility
  const yekSalaiResult: YekSalaiMatchResult = useMemo(() => {
    return evaluateYekSalai(groomSalaiId, brideSalaiId);
  }, [groomSalaiId, brideSalaiId]);

  // Astrological Calculations (Ephemeris & Kundali Charts)
  const calculationData = useMemo(() => {
    try {
      // Groom Planetary Chart
      const groomChart = calculatePlanetaryPositions({
        name: groomName,
        gender: 'male',
        dateOfBirth: groomDob,
        timeOfBirth: groomTob,
        latitude: groomLat,
        longitude: groomLon,
        timezone: 'Asia/Kolkata',
        utcOffset: 5.5,
        ayanamsa: 'lahiri'
      });

      // Bride Planetary Chart
      const brideChart = calculatePlanetaryPositions({
        name: brideName,
        gender: 'female',
        dateOfBirth: brideDob,
        timeOfBirth: brideTob,
        latitude: brideLat,
        longitude: brideLon,
        timezone: 'Asia/Kolkata',
        utcOffset: 5.5,
        ayanamsa: 'lahiri'
      });

      const groomMoon = groomChart.planets.find(p => p.id === 'mo') || groomChart.planets[1];
      const brideMoon = brideChart.planets.find(p => p.id === 'mo') || brideChart.planets[1];
      const groomMars = groomChart.planets.find(p => p.id === 'ma') || groomChart.planets[4];
      const brideMars = brideChart.planets.find(p => p.id === 'ma') || brideChart.planets[4];

      const groomLagnaSign = Math.floor(groomChart.ascendant / 30) % 12;
      const brideLagnaSign = Math.floor(brideChart.ascendant / 30) % 12;

      const gLagnaDeg = Math.floor(groomChart.ascendant % 30);
      const gLagnaMin = Math.floor((groomChart.ascendant % 1) * 60);
      const groomLagnaDegree = `${gLagnaDeg}°${gLagnaMin.toString().padStart(2, '0')}'`;

      const bLagnaDeg = Math.floor(brideChart.ascendant % 30);
      const bLagnaMin = Math.floor((brideChart.ascendant % 1) * 60);
      const brideLagnaDegree = `${bLagnaDeg}°${bLagnaMin.toString().padStart(2, '0')}'`;

      // Ashtakoota 36-Points Detailed Breakdown
      const ashtakoot = calculateDetailedAshtakoot(groomMoon.longitude, brideMoon.longitude);

      // Nga-Ishing Evaluation (Matching!Q54:R55 & Matching!B54:K63)
      const groomMoonSign = Math.floor(groomMoon.longitude / 30) % 12;
      const brideMoonSign = Math.floor(brideMoon.longitude / 30) % 12;
      const ngaIshing = calculateNgaIshing(groomLagnaSign, brideLagnaSign, groomMoonSign, brideMoonSign);

      // Manglik Evaluation (Matching!H22, H25, H47, H50, Z33)
      const manglik = evaluateManglikFromPositions(
        groomMars.longitude,
        groomChart.ascendant,
        groomMoon.longitude,
        brideMars.longitude,
        brideChart.ascendant,
        brideMoon.longitude
      );

      // Transform planets for Bengali Rashi Chart (1 to 9 & Bengali names)
      const PLANET_META: Record<string, { bengaliName: string; bengaliDigit: string; order: number }> = {
        su: { bengaliName: 'রবি', bengaliDigit: '১', order: 1 },
        mo: { bengaliName: 'চন্দ্র', bengaliDigit: '২', order: 2 },
        ma: { bengaliName: 'মঙ্গল', bengaliDigit: '৩', order: 3 },
        me: { bengaliName: 'বুধ', bengaliDigit: '৪', order: 4 },
        ju: { bengaliName: 'গুরু', bengaliDigit: '৫', order: 5 },
        ve: { bengaliName: 'শুক্র', bengaliDigit: '৬', order: 6 },
        sa: { bengaliName: 'শনি', bengaliDigit: '৭', order: 7 },
        ra: { bengaliName: 'রাহু', bengaliDigit: '৮', order: 8 },
        ke: { bengaliName: 'কেতু', bengaliDigit: '৯', order: 9 }
      };

      const RASHI_BENGALI_NAMES = [
        'মেষ', 'বৃষ', 'মিথুন', 'কর্কট', 'সিংহ', 'কন্যা',
        'তুলা', 'বৃশ্চিক', 'ধনু', 'মকর', 'কুম্ভ', 'মীন'
      ];
      const RASHI_ENGLISH_NAMES = [
        'Mesha', 'Vrisha', 'Mithun', 'Karkat', 'Singh', 'Kanya',
        'Tula', 'Vrishik', 'Dhanu', 'Makar', 'Kumbha', 'Meena'
      ];

      const groomPlanetsKundali = groomChart.planets.map(p => {
        const sign = p.signIndex !== undefined ? p.signIndex : Math.floor(p.longitude / 30) % 12;
        const house = ((sign - groomLagnaSign + 12) % 12) + 1;
        const deg = Math.floor(p.longitude % 30);
        const min = Math.floor((p.longitude % 1) * 60);
        return {
          id: p.id,
          name: p.name,
          bengaliName: PLANET_META[p.id]?.bengaliName || p.name,
          bengaliDigit: PLANET_META[p.id]?.bengaliDigit || '•',
          longitude: p.longitude,
          degreeInSign: `${deg}°${min.toString().padStart(2, '0')}'`,
          signIndex: sign,
          signName: RASHI_ENGLISH_NAMES[sign],
          signBengali: RASHI_BENGALI_NAMES[sign],
          house
        };
      }).sort((a, b) => (PLANET_META[a.id]?.order || 99) - (PLANET_META[b.id]?.order || 99));

      const bridePlanetsKundali = brideChart.planets.map(p => {
        const sign = p.signIndex !== undefined ? p.signIndex : Math.floor(p.longitude / 30) % 12;
        const house = ((sign - brideLagnaSign + 12) % 12) + 1;
        const deg = Math.floor(p.longitude % 30);
        const min = Math.floor((p.longitude % 1) * 60);
        return {
          id: p.id,
          name: p.name,
          bengaliName: PLANET_META[p.id]?.bengaliName || p.name,
          bengaliDigit: PLANET_META[p.id]?.bengaliDigit || '•',
          longitude: p.longitude,
          degreeInSign: `${deg}°${min.toString().padStart(2, '0')}'`,
          signIndex: sign,
          signName: RASHI_ENGLISH_NAMES[sign],
          signBengali: RASHI_BENGALI_NAMES[sign],
          house
        };
      }).sort((a, b) => (PLANET_META[a.id]?.order || 99) - (PLANET_META[b.id]?.order || 99));

      return {
        groomChart,
        brideChart,
        groomLagnaSign,
        brideLagnaSign,
        groomLagnaDegree,
        brideLagnaDegree,
        groomMoon,
        brideMoon,
        groomMars,
        brideMars,
        ashtakoot,
        ngaIshing,
        manglik,
        groomPlanetsKundali,
        bridePlanetsKundali
      };
    } catch (err) {
      console.error('Calculation error:', err);
      return null;
    }
  }, [groomDob, groomTob, groomLat, groomLon, groomName, brideDob, brideTob, brideLat, brideLon, brideName]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfbf7] via-[#fffdfa] to-[#f7f3ea] text-gray-900 pb-20">
      
      {/* HEADER BAR */}
      <header className="border-b border-amber-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/matching" 
              className="w-9 h-9 rounded-xl bg-amber-100/80 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-lg sm:text-xl text-gray-900">
                  নুপা নুপী অনীগী পক্ন-ৱাইনা য়েংবা
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                  qw.xlsm Core Engine
                </span>
              </div>
              <p className="text-xs text-amber-900/80 font-serif">
                Manipuri Yek Salai • Surname Lookup • Birth Charts • Ashtakoota • Nga-Ishing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode(viewMode === 'EXCEL_VIEW' ? 'DETAILED_VIEW' : 'EXCEL_VIEW');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{viewMode === 'EXCEL_VIEW' ? 'Switch to Detailed View' : 'Switch to Excel View'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* -------------------------------------------------------- */}
        {/* INPUT PANEL: SURNAMES, NAMES & BIRTH DETAILS */}
        {/* -------------------------------------------------------- */}
        <section id="matching-form" className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-200/80 shadow-sm space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-black text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" />
                <span>Enter Groom &amp; Bride Surnames &amp; Birth Details</span>
              </h2>
              <p className="text-xs text-gray-500">
                Type your surname (Yumnak) in English or Manipuri. If your Yek is not listed or custom, use the manual space below to assign and store it for future use.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {customSurnames.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>{customSurnames.length} Custom Stored</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>826 Surnames Database Loaded</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* GROOM (MALE) FORM */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                <span className="text-sm font-bold font-serif text-amber-950 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  Groom (নুপা) Details
                </span>
                <span className="text-xs font-serif font-bold text-amber-800 flex items-center gap-1">
                  <span>Salai:</span>
                  <span className="underline decoration-amber-500">{groomSalai.name} ({groomSalai.meeteiMayek})</span>
                  {selectedGroomSurname?.isCustom && (
                    <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold">Custom</span>
                  )}
                </span>
              </div>

              {/* Success Message Banner */}
              {groomManualSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{groomManualSuccessMsg}</span>
                </div>
              )}

              {/* Surname Input with Autocomplete & Manual Toggle */}
              <div className="space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    Surname (য়ুম্নাক শগৈ মমিং) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setManualGroomEnglish(groomSurnameQuery || '');
                      setShowGroomManual(!showGroomManual);
                    }}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{showGroomManual ? 'Close Manual' : 'Yek not available? Enter manually'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={groomSurnameQuery}
                    onChange={(e) => {
                      setGroomSurnameQuery(e.target.value);
                      setShowGroomSuggestions(true);
                      const exact = findSurnameExact(e.target.value, customSurnames);
                      if (exact) {
                        setSelectedGroomSurname(exact);
                        setGroomSalaiId(getSalaiIdFromName(exact.primary_salai));
                      }
                    }}
                    onFocus={() => setShowGroomSuggestions(true)}
                    placeholder="e.g. Moirangthem, Ningthoujam, RK, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium bg-white"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>

                {/* Suggestions dropdown */}
                {showGroomSuggestions && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-amber-200 rounded-xl shadow-xl max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {groomSurnameSuggestions.length > 0 ? (
                      <>
                        {groomSurnameSuggestions.map((item) => (
                          <button
                            key={`${item.id}-${item.english}`}
                            type="button"
                            onClick={() => handleSelectGroomSurname(item)}
                            className="w-full px-3.5 py-2 text-left hover:bg-amber-50 flex items-center justify-between text-xs cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{item.english}</span>
                              <span className="text-gray-500 font-serif">({item.manipuri})</span>
                              {item.isCustom && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  User Saved
                                </span>
                              )}
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                              {item.primary_salai}
                            </span>
                          </button>
                        ))}
                        <div className="p-2 bg-amber-50/90 border-t border-amber-200 flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">Can&apos;t find your specific Yek?</span>
                          <button
                            type="button"
                            onClick={() => {
                              setManualGroomEnglish(groomSurnameQuery || '');
                              setShowGroomManual(true);
                              setShowGroomSuggestions(false);
                            }}
                            className="font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <PlusCircle className="w-3 h-3" />
                            <span>Manual Input</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-3.5 text-center space-y-2">
                        <p className="text-xs text-gray-600">
                          Surname &ldquo;<strong className="text-amber-900">{groomSurnameQuery}</strong>&rdquo; not found in database.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setManualGroomEnglish(groomSurnameQuery || '');
                            setShowGroomManual(true);
                            setShowGroomSuggestions(false);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Manually Enter &amp; Store Yek for &ldquo;{groomSurnameQuery}&rdquo;</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MANUAL YEK / SALAI INPUT DRAWER (GROOM) */}
              {showGroomManual && (
                <div className="p-4 rounded-2xl bg-amber-100/70 border-2 border-amber-400/90 shadow-sm space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-300/80">
                    <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4 text-amber-700" />
                      Manual Yek / Salai Space (সালাই মেনুয়েল্লী খনবা)
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGroomManual(false)}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Surname (English) *</label>
                      <input
                        type="text"
                        value={manualGroomEnglish}
                        onChange={(e) => setManualGroomEnglish(e.target.value)}
                        placeholder="e.g. Khumanthem"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Manipuri Mayek / Script (Optional)</label>
                      <input
                        type="text"
                        value={manualGroomManipuri}
                        onChange={(e) => setManualGroomManipuri(e.target.value)}
                        placeholder="e.g. ꯈꯨꯃꯟꯊꯦꯝ / খুমনথেম"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-medium font-serif"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block text-xs mb-1.5">
                      Assign Clan / Salai (সালাই খনব) *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {SALAI_TARET.map((sal) => {
                        const isSel = manualGroomSalaiId === sal.id;
                        return (
                          <button
                            key={sal.id}
                            type="button"
                            onClick={() => setManualGroomSalaiId(sal.id)}
                            className={`p-2 rounded-xl text-left border text-[11px] transition-all cursor-pointer ${
                              isSel 
                                ? 'bg-amber-800 text-white border-amber-900 shadow-xs font-bold' 
                                : 'bg-white text-gray-800 border-amber-200/80 hover:bg-amber-50'
                            }`}
                          >
                            <div className="font-bold font-serif leading-tight">{sal.name}</div>
                            <div className={`text-[10px] ${isSel ? 'text-amber-200' : 'text-gray-500'}`}>{sal.meeteiMayek}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-amber-200/80">
                    <label className="flex items-center gap-1.5 text-xs text-gray-800 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={manualGroomSaveDb}
                        onChange={(e) => setManualGroomSaveDb(e.target.checked)}
                        className="rounded text-amber-700 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="font-semibold">Store for future lookups (তুংগীদমক সেভ তৌব)</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleSaveGroomManualSalai}
                      disabled={!manualGroomEnglish.trim()}
                      className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Apply &amp; Save Salai
                    </button>
                  </div>
                </div>
              )}

              {/* Branch Picker if Surname has multiple Salais */}
              {selectedGroomSurname && selectedGroomSurname.salais.length > 1 && (
                <div className="p-3 rounded-xl bg-amber-100/50 border border-amber-300/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-950 block">
                    Multiple Branches Found for {selectedGroomSurname.english}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedGroomSurname.salais.map((sal, idx) => {
                      const sId = getSalaiIdFromName(sal);
                      const isSelected = groomSalaiId === sId;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setGroomSalaiId(sId)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-800 text-white shadow-xs' 
                              : 'bg-white text-gray-700 border border-amber-300 hover:bg-amber-50'
                          }`}
                        >
                          {sal} ({selectedGroomSurname.salais_meitei[idx]})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Full Name (মমিং)</label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-amber-500 text-sm bg-white"
                />
              </div>

              {/* Date & Time of Birth */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={groomDob}
                    onChange={(e) => setGroomDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Time of Birth</label>
                  <input
                    type="time"
                    value={groomTob}
                    onChange={(e) => setGroomTob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Place of Birth */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Birth City / Place</label>
                <input
                  type="text"
                  value={groomPob}
                  onChange={(e) => setGroomPob(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                />
              </div>
            </div>

            {/* BRIDE (FEMALE) FORM */}
            <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/60 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
                <span className="text-sm font-bold font-serif text-rose-950 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  Bride (নুপী) Details
                </span>
                <span className="text-xs font-serif font-bold text-rose-800 flex items-center gap-1">
                  <span>Salai:</span>
                  <span className="underline decoration-rose-500">{brideSalai.name} ({brideSalai.meeteiMayek})</span>
                  {selectedBrideSurname?.isCustom && (
                    <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold">Custom</span>
                  )}
                </span>
              </div>

              {/* Success Message Banner */}
              {brideManualSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{brideManualSuccessMsg}</span>
                </div>
              )}

              {/* Surname Input with Autocomplete & Manual Toggle */}
              <div className="space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    Surname (য়ুম্নাক শগৈ মমিং) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setManualBrideEnglish(brideSurnameQuery || '');
                      setShowBrideManual(!showBrideManual);
                    }}
                    className="text-[11px] font-bold text-rose-800 hover:text-rose-950 underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{showBrideManual ? 'Close Manual' : 'Yek not available? Enter manually'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={brideSurnameQuery}
                    onChange={(e) => {
                      setBrideSurnameQuery(e.target.value);
                      setShowBrideSuggestions(true);
                      const exact = findSurnameExact(e.target.value, customSurnames);
                      if (exact) {
                        setSelectedBrideSurname(exact);
                        setBrideSalaiId(getSalaiIdFromName(exact.primary_salai));
                      }
                    }}
                    onFocus={() => setShowBrideSuggestions(true)}
                    placeholder="e.g. Thokchom, Laishram, Tombi, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-sm font-medium bg-white"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                </div>

                {/* Suggestions dropdown */}
                {showBrideSuggestions && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-rose-200 rounded-xl shadow-xl max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {brideSurnameSuggestions.length > 0 ? (
                      <>
                        {brideSurnameSuggestions.map((item) => (
                          <button
                            key={`${item.id}-${item.english}`}
                            type="button"
                            onClick={() => handleSelectBrideSurname(item)}
                            className="w-full px-3.5 py-2 text-left hover:bg-rose-50 flex items-center justify-between text-xs cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{item.english}</span>
                              <span className="text-gray-500 font-serif">({item.manipuri})</span>
                              {item.isCustom && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  User Saved
                                </span>
                              )}
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900">
                              {item.primary_salai}
                            </span>
                          </button>
                        ))}
                        <div className="p-2 bg-rose-50/90 border-t border-rose-200 flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">Can&apos;t find your specific Yek?</span>
                          <button
                            type="button"
                            onClick={() => {
                              setManualBrideEnglish(brideSurnameQuery || '');
                              setShowBrideManual(true);
                              setShowBrideSuggestions(false);
                            }}
                            className="font-bold text-rose-900 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <PlusCircle className="w-3 h-3" />
                            <span>Manual Input</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-3.5 text-center space-y-2">
                        <p className="text-xs text-gray-600">
                          Surname &ldquo;<strong className="text-rose-900">{brideSurnameQuery}</strong>&rdquo; not found in database.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setManualBrideEnglish(brideSurnameQuery || '');
                            setShowBrideManual(true);
                            setShowBrideSuggestions(false);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Manually Enter &amp; Store Yek for &ldquo;{brideSurnameQuery}&rdquo;</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MANUAL YEK / SALAI INPUT DRAWER (BRIDE) */}
              {showBrideManual && (
                <div className="p-4 rounded-2xl bg-rose-100/70 border-2 border-rose-400/90 shadow-sm space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between pb-1.5 border-b border-rose-300/80">
                    <span className="text-xs font-black text-rose-950 flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4 text-rose-700" />
                      Manual Yek / Salai Space (সালাই মেনুয়েল্লী খনবা)
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowBrideManual(false)}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Surname (English) *</label>
                      <input
                        type="text"
                        value={manualBrideEnglish}
                        onChange={(e) => setManualBrideEnglish(e.target.value)}
                        placeholder="e.g. Khumanthem"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Manipuri Mayek / Script (Optional)</label>
                      <input
                        type="text"
                        value={manualBrideManipuri}
                        onChange={(e) => setManualBrideManipuri(e.target.value)}
                        placeholder="e.g. ꯈꯨꯃꯟꯊꯦꯝ / খুমনথেম"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-medium font-serif"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 block text-xs mb-1.5">
                      Assign Clan / Salai (সালাই খনব) *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {SALAI_TARET.map((sal) => {
                        const isSel = manualBrideSalaiId === sal.id;
                        return (
                          <button
                            key={sal.id}
                            type="button"
                            onClick={() => setManualBrideSalaiId(sal.id)}
                            className={`p-2 rounded-xl text-left border text-[11px] transition-all cursor-pointer ${
                              isSel 
                                ? 'bg-rose-800 text-white border-rose-900 shadow-xs font-bold' 
                                : 'bg-white text-gray-800 border-rose-200/80 hover:bg-rose-50'
                            }`}
                          >
                            <div className="font-bold font-serif leading-tight">{sal.name}</div>
                            <div className={`text-[10px] ${isSel ? 'text-rose-200' : 'text-gray-500'}`}>{sal.meeteiMayek}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-rose-200/80">
                    <label className="flex items-center gap-1.5 text-xs text-gray-800 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={manualBrideSaveDb}
                        onChange={(e) => setManualBrideSaveDb(e.target.checked)}
                        className="rounded text-rose-700 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="font-semibold">Store for future lookups (তুংগীদমক সেভ তৌব)</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleSaveBrideManualSalai}
                      disabled={!manualBrideEnglish.trim()}
                      className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Apply &amp; Save Salai
                    </button>
                  </div>
                </div>
              )}

              {/* Branch Picker if Surname has multiple Salais */}
              {selectedBrideSurname && selectedBrideSurname.salais.length > 1 && (
                <div className="p-3 rounded-xl bg-rose-100/50 border border-rose-300/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-rose-950 block">
                    Multiple Branches Found for {selectedBrideSurname.english}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedBrideSurname.salais.map((sal, idx) => {
                      const sId = getSalaiIdFromName(sal);
                      const isSelected = brideSalaiId === sId;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setBrideSalaiId(sId)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-rose-800 text-white shadow-xs' 
                              : 'bg-white text-gray-700 border border-rose-300 hover:bg-rose-50'
                          }`}
                        >
                          {sal} ({selectedBrideSurname.salais_meitei[idx]})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Full Name (মমিং)</label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-rose-500 text-sm bg-white"
                />
              </div>

              {/* Date & Time of Birth */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={brideDob}
                    onChange={(e) => setBrideDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Time of Birth</label>
                  <input
                    type="time"
                    value={brideTob}
                    onChange={(e) => setBrideTob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Place of Birth */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Birth City / Place</label>
                <input
                  type="text"
                  value={bridePob}
                  onChange={(e) => setBridePob(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                />
              </div>
            </div>

          </div>

          {/* Quick Summary Pill & Calculate CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 border border-amber-300 shadow-xs">
            <div className="space-y-1 text-xs">
              <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">Current Selection:</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-gray-900 font-serif">
                  {groomName || groomSurnameQuery} ({groomSalai.name}) + {brideName || brideSurnameQuery} ({brideSalai.name})
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-black text-[11px] ${
                  yekSalaiResult.isCompatible ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {yekSalaiResult.isCompatible ? '✓ ꯌꯦꯛ ꯈꯦꯛꯏ' : '✕ ꯌꯦꯛ ꯊꯣꯛꯏ'}
                </span>
              </div>
            </div>

            <button
              type="button"
              id="calculate-match-btn"
              onClick={() => {
                setHasCalculated(true);
                setTimeout(() => {
                  document.getElementById('match-result')?.scrollIntoView({ behavior: 'smooth' });
                }, 80);
              }}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>Calculate Match &amp; Charts (পক্ন-ৱাইনা য়েংবা)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* RESULT SECTION (HIDDEN UNTIL USER CLICKS CALCULATE) */}
        {/* -------------------------------------------------------- */}
        {hasCalculated && calculationData && (
          <section id="match-result" className="space-y-6 scroll-mt-20 animate-fadeIn">
            
            {/* Top Action Bar with "Calculate Another Couple" */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/70 border border-amber-300 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950 font-serif">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>পক্ন-ৱাইনা ফলাফল (Calculated for {groomName || 'Groom'} &amp; {brideName || 'Bride'})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('matching-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleCalculateOther}
                  className="px-4 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Calculate Another Couple (অতোপ্পা য়েংবা)</span>
                </button>
              </div>
            </div>

            {/* Excel & Astrological Match Report */}
            <ExcelMatchReport
              groomName={groomName}
              brideName={brideName}
              groomSurnameEntry={selectedGroomSurname}
              brideSurnameEntry={selectedBrideSurname}
              groomSalai={groomSalai}
              brideSalai={brideSalai}
              yekSalaiMatch={yekSalaiResult}
              groomLagnaSignIndex={calculationData.groomLagnaSign}
              brideLagnaSignIndex={calculationData.brideLagnaSign}
              groomLagnaDegree={calculationData.groomLagnaDegree}
              brideLagnaDegree={calculationData.brideLagnaDegree}
              groomMarsHouseFromLagna={calculationData.manglik.groomMarsHouseFromLagna}
              groomMarsHouseFromMoon={calculationData.manglik.groomMarsHouseFromMoon}
              brideMarsHouseFromLagna={calculationData.manglik.brideMarsHouseFromLagna}
              brideMarsHouseFromMoon={calculationData.manglik.brideMarsHouseFromMoon}
              groomPlanets={calculationData.groomPlanetsKundali}
              bridePlanets={calculationData.bridePlanetsKundali}
              manglik={calculationData.manglik}
              ashtakoot={calculationData.ashtakoot}
              ngaIshing={calculationData.ngaIshing}
            />

            {/* Bottom Action Footer with "Calculate Another Couple" */}
            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-500 font-serif">
                Ready to test another prospective alliance or bride/groom horoscope?
              </span>
              <button
                type="button"
                onClick={handleCalculateOther}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Calculate Another Couple (অতোপ্পা য়েংবা)</span>
              </button>
            </div>

          </section>
        )}

      </main>
    </div>
  );
}
