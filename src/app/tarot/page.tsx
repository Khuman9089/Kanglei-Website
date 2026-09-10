'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RotateCcw,
  Printer,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Compass,
  Heart,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  Flame,
  Sun,
  ShieldAlert,
  Anchor,
  Users,
  Eye,
  Shuffle,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import {
  TAROT_DECK,
  SPREAD_POSITIONS,
  TarotCard,
  SpreadPosition,
  DrawnCard,
  drawRandomCards,
  synthesizeTarotReading,
} from '@/engine/tarotEngine';

const POSITION_ICONS: Record<string, any> = {
  Sun,
  ShieldAlert,
  Anchor,
  Compass,
  Users,
  Sparkles,
};

export default function FreeTarotReadingPage() {
  // Card Selection State
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // Progress Bar State (4 to 5 seconds cosmic loader)
  const [isCalculating, setIsCalculating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);

  // Reading Result State
  const [readingResult, setReadingResult] = useState<any>(null);
  const [activeCardDetail, setActiveCardDetail] = useState<number>(0);
  const [readingCategory, setReadingCategory] = useState<'summary' | 'love' | 'career' | 'spirituality'>('summary');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Intention input
  const [userIntention, setUserIntention] = useState('General Life Guidance & Clarity');

  const resultRef = useRef<HTMLDivElement>(null);

  // Initialize deck on mount
  useEffect(() => {
    shuffleDeck();
  }, []);

  const shuffleDeck = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setIsShuffling(false);
    }, 400);
  };

  const currentSpreadPosition = SPREAD_POSITIONS[selectedCards.length] || null;

  // Handle single card click from deck
  const handleSelectCard = (card: TarotCard) => {
    if (selectedCards.length >= 6 || isCalculating || readingResult) return;

    // Check if card is already selected
    if (selectedCards.some((c) => c.card.id === card.id)) return;

    const currentPos = SPREAD_POSITIONS[selectedCards.length];
    const isReversed = Math.random() < 0.25; // 25% chance reversed

    const newDrawn: DrawnCard = {
      card,
      isReversed,
      position: currentPos,
    };

    setSelectedCards((prev) => [...prev, newDrawn]);
  };

  // Quick Auto-Draw 6 Cards
  const handleAutoDrawAll = () => {
    if (isCalculating || readingResult) return;
    const drawn = drawRandomCards(6);
    setSelectedCards(drawn);
  };

  // Trigger 4.5s Progress Bar & Reveal
  const handleRevealReading = () => {
    if (selectedCards.length < 6) return;

    setIsCalculating(true);
    setProgressPercent(0);
    setLoadingPhaseIndex(0);

    const phases = [
      'Shuffling ancient archetypal vibrations...',
      'Aligning planetary & astrological vectors...',
      'Mapping the 6-card sacred geometry spread...',
      'Synthesizing karmic root causes & near future...',
      'Channeling divine blessings & Vedic remedies...',
    ];

    const totalDuration = 4500; // 4.5 seconds
    const intervalTime = 50;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            const synthesis = synthesizeTarotReading(selectedCards);
            setReadingResult(synthesis);
            setIsCalculating(false);
            // Smooth scroll to top of reading
            setTimeout(() => {
              resultRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }, 300);
          return 100;
        }

        // Update phase index based on progress
        const phaseIdx = Math.min(Math.floor((next / 100) * phases.length), phases.length - 1);
        setLoadingPhaseIndex(phaseIdx);

        return next;
      });
    }, intervalTime);
  };

  const handleResetReading = () => {
    setSelectedCards([]);
    setReadingResult(null);
    setProgressPercent(0);
    setActiveCardDetail(0);
    shuffleDeck();
  };

  const handleCopySummary = () => {
    if (!readingResult || selectedCards.length < 6) return;

    const cardLines = selectedCards
      .map(
        (sc) =>
          `• ${sc.position.shortRole}: ${sc.card.name} (${sc.isReversed ? 'Reversed' : 'Upright'}) - ${
            sc.isReversed ? sc.card.reversed.summary : sc.card.upright.summary
          }`
      )
      .join('\n');

    const text = `FREE 6-CARD TAROT READING DOSSIER:
Intention: ${userIntention}
Dominant Element: ${readingResult.dominantElement}
Karmic Weight: ${readingResult.karmicWeight}

CARDS DRAWN:
${cardLines}

SYNTHESIS & ADVICE:
${readingResult.actionableSummary}
${readingResult.astrologicalBridge}

Generated on KuthiYengpham / KangleiAstro Tarot Oracle`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const loadingPhases = [
    'Shuffling ancient archetypal vibrations...',
    'Aligning planetary & astrological vectors...',
    'Mapping the 6-card sacred geometry spread...',
    'Synthesizing karmic root causes & near future...',
    'Channeling divine blessings & Vedic remedies...',
  ];

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] font-sans">
      {/* Top Hero Section */}
      <div className="relative pt-6 sm:pt-10 pb-8 px-4 border-b border-[#f3e8d2] bg-gradient-to-b from-[#faf8f5] via-[#fffdfa] to-white">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Divine 6-Card Sacred Tarot Oracle</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#0f172a] tracking-tight">
            Free <span className="text-[#b45309]">6-Card Tarot</span> Reading
          </h1>

          <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
            Harness the ancient wisdom of 78 sacred archetypes. Pick 6 cards to reveal your present reality, hidden obstacles, karmic origins, near future, external influences, and ultimate destiny.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10" ref={resultRef}>
        {/* ───────────────────────────────────────────────────────────── */}
        {/* 1. SELECTION & DRAWING STAGE                                  */}
        {/* ───────────────────────────────────────────────────────────── */}
        {!readingResult && !isCalculating && (
          <div className="space-y-8">
            {/* Intention Selector Bar */}
            <div className="bg-white p-5 rounded-3xl border border-[#f3e8d2] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Focus Your Mind / Intention (Optional)
                </label>
                <select
                  value={userIntention}
                  onChange={(e) => setUserIntention(e.target.value)}
                  className="w-full sm:w-72 h-10 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-xs focus:border-[#d97706] focus:outline-none"
                >
                  <option value="General Life Guidance & Clarity">General Life Guidance &amp; Clarity</option>
                  <option value="Love, Marriage & Soulmate Connection">Love, Marriage &amp; Soulmate Connection</option>
                  <option value="Career, Job Promotion & Business Growth">Career, Job Promotion &amp; Business Growth</option>
                  <option value="Wealth, Finance & Property Investments">Wealth, Finance &amp; Investments</option>
                  <option value="Spiritual Healing & Karmic Transition">Spiritual Healing &amp; Karmic Transition</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={shuffleDeck}
                  disabled={isShuffling}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                  <span>Shuffle Deck</span>
                </button>
                <button
                  type="button"
                  onClick={handleAutoDrawAll}
                  className="px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>Quick Draw 6 Cards</span>
                </button>
              </div>
            </div>

            {/* Current Position Reason / Explanation Banner */}
            {currentSpreadPosition && selectedCards.length < 6 && (
              <motion.div
                key={currentSpreadPosition.index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-gradient-to-r from-[#fef3c7] via-[#fffbeb] to-[#fef3c7] border border-[#fde68a] text-slate-900 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#d97706] text-white font-black text-xs">
                      Step {selectedCards.length + 1} of 6
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#0f172a]">
                      {currentSpreadPosition.title} ({currentSpreadPosition.shortRole})
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-[#b45309]">
                    Select any card from the deck below ↓
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-[#fde68a]/60 space-y-1 text-xs">
                  <p className="font-extrabold text-[#b45309] flex items-center gap-1.5">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>Reason for this Card Selection:</span>
                  </p>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {currentSpreadPosition.purposeReason}
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    {currentSpreadPosition.deepMeaning}
                  </p>
                </div>
              </motion.div>
            )}

            {/* The 6-Card Spread Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {SPREAD_POSITIONS.map((pos, idx) => {
                const drawn = selectedCards[idx];
                const IconComp = POSITION_ICONS[pos.iconName] || Sparkles;
                const isCurrentNext = selectedCards.length === idx;

                return (
                  <div
                    key={pos.index}
                    className={`relative rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all min-h-[190px] ${
                      drawn
                        ? 'bg-gradient-to-b from-[#1c2541] to-[#0b132b] text-white border-2 border-[#d97706] shadow-md'
                        : isCurrentNext
                        ? 'bg-amber-50/80 border-2 border-dashed border-[#d97706] animate-pulse shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        drawn ? 'bg-[#d97706] text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        Card #{idx + 1}
                      </span>
                      <IconComp className={`w-4 h-4 ${drawn ? 'text-[#fbbf24]' : 'text-slate-400'}`} />
                    </div>

                    {drawn ? (
                      <div className="my-auto space-y-1.5 w-full">
                        <div className="w-12 h-16 mx-auto rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-200 flex items-center justify-center text-white shadow-inner">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <p className="font-serif font-bold text-xs text-[#fbbf24] truncate px-1">
                          {drawn.card.name}
                        </p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-200 block font-bold">
                          {drawn.isReversed ? 'Reversed ↺' : 'Upright ✓'}
                        </span>
                      </div>
                    ) : (
                      <div className="my-auto space-y-1">
                        <div className="w-10 h-14 mx-auto rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                          ?
                        </div>
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-1">
                          {pos.shortRole}
                        </p>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 font-medium block mt-1 truncate max-w-full">
                      {pos.title.split(':')[1] || pos.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Reveal CTA Button when 6 cards are chosen */}
            {selectedCards.length === 6 && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 rounded-3xl bg-gradient-to-r from-[#1c2541] via-[#0b132b] to-[#0f172a] text-white text-center space-y-3 shadow-xl border border-[#3a506b]"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d97706]/20 border border-[#d97706]/40 text-[#fbbf24] text-xs font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
                  <span>All 6 Divine Archetypes Selected</span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#fbbf24]">
                  Your Sacred Spread Is Ready
                </h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  Click below to synthesize the divine planetary influences, karmic lessons, and actionable future outcomes.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRevealReading}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] text-white font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Reveal Complete Tarot Reading</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetReading}
                    className="px-4 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </motion.div>
            )}

            {/* Interactive Tarot Card Deck Fan / Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0f172a] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#d97706]" />
                    <span>Draw from the Sacred Deck</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Click any card to select for the active position ({selectedCards.length}/6 chosen)
                  </p>
                </div>
                <span className="text-xs font-bold text-[#b45309]">
                  {78 - selectedCards.length} Cards Remaining
                </span>
              </div>

              {/* Card deck display */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-2 max-h-96 overflow-y-auto p-2 scrollbar-thin">
                {deck.map((card, cIdx) => {
                  const isAlreadySelected = selectedCards.some((sc) => sc.card.id === card.id);
                  return (
                    <button
                      key={card.id || cIdx}
                      type="button"
                      disabled={isAlreadySelected || selectedCards.length >= 6}
                      onClick={() => handleSelectCard(card)}
                      className={`relative aspect-[2/3] rounded-xl border transition-all flex flex-col items-center justify-between p-1.5 group cursor-pointer ${
                        isAlreadySelected
                          ? 'opacity-30 grayscale cursor-not-allowed bg-slate-100 border-slate-300'
                          : 'bg-gradient-to-br from-[#1c2541] to-[#0b132b] hover:from-[#d97706] hover:to-[#f59e0b] border-[#3a506b] hover:border-amber-300 hover:scale-105 shadow-xs'
                      }`}
                    >
                      <div className="w-full text-left">
                        <span className="text-[8px] font-mono text-amber-300 group-hover:text-white font-bold block leading-none">
                          #{cIdx + 1}
                        </span>
                      </div>
                      <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-white" />
                      <span className="text-[7px] font-bold text-gray-300 group-hover:text-white block truncate w-full text-center">
                        {isAlreadySelected ? 'Drawn' : 'Select'}
                      </span>
                    </button>
                  );
                })}
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
                <Sparkles className="w-10 h-10 text-[#fbbf24] animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#fbbf24]">
                Consulting the Celestial Arcana
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
              &quot;As the cosmic wheels turn, past, present, and destiny converge into divine illumination.&quot;
            </div>
          </motion.div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3. REVEALED RESULTS VIEW                                      */}
        {/* ───────────────────────────────────────────────────────────── */}
        {readingResult && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#f3e8d2] shadow-xs">
              <button
                type="button"
                onClick={handleResetReading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-extrabold text-xs hover:bg-[#fef3c7] hover:border-[#d97706] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#d97706]" />
                <span>Draw New 6-Card Reading</span>
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
                  <span>Print Reading</span>
                </button>
              </div>
            </div>

            {/* Spread Synthesis Summary Banner */}
            <div className="bg-gradient-to-r from-[#1c2541] via-[#0b132b] to-[#0f172a] p-6 sm:p-8 rounded-3xl border border-[#3a506b] text-white shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3a506b] pb-4">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    Oracle Synthesis • Focus: {userIntention}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fbbf24]">
                    Your 6-Card Divine Blueprint
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs">
                    Dominant Element: {readingResult.dominantElement}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs">
                    {readingResult.karmicWeight}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-200 leading-relaxed">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <span className="font-bold text-[#fbbf24] block">Elemental Harmony &amp; Energy:</span>
                  <p>{readingResult.overallTheme}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <span className="font-bold text-[#fbbf24] block">Astrological &amp; Planetary Bridge:</span>
                  <p>{readingResult.astrologicalBridge}</p>
                </div>
              </div>
            </div>

            {/* 6 Cards Interactive Display Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {selectedCards.map((drawn, idx) => {
                const isSelectedForDetail = activeCardDetail === idx;
                const pos = drawn.position;

                return (
                  <div
                    key={drawn.card.id}
                    onClick={() => setActiveCardDetail(idx)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                      isSelectedForDetail
                        ? 'bg-gradient-to-b from-[#fffbeb] to-white border-[#d97706] shadow-lg ring-2 ring-[#d97706]/20'
                        : 'bg-white hover:bg-slate-50 border-[#f3e8d2] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold uppercase tracking-wider">
                        Position #{idx + 1}: {pos.shortRole}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        drawn.isReversed ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {drawn.isReversed ? 'Reversed ↺' : 'Upright ✓'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-20 rounded-xl bg-gradient-to-br from-[#1c2541] to-[#0b132b] text-white flex flex-col items-center justify-center shrink-0 border border-amber-500/40 shadow-sm p-1 text-center">
                        <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
                        <span className="text-[8px] font-mono text-amber-200 block truncate max-w-full">
                          {drawn.card.arcana}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-base text-[#0f172a] truncate">
                          {drawn.card.name}
                        </h4>
                        <p className="text-[11px] text-[#b45309] font-medium truncate">
                          {drawn.card.astrology} • {drawn.card.element}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {drawn.card.keywords.slice(0, 2).map((kw, ki) => (
                            <span key={ki} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 text-xs text-slate-600 space-y-1">
                      <p className="line-clamp-2">
                        {drawn.isReversed ? drawn.card.reversed.summary : drawn.card.upright.summary}
                      </p>
                      <span className="text-[11px] text-[#d97706] font-bold inline-flex items-center gap-1 hover:underline">
                        <span>Click to view deep interpretation →</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* In-Depth Active Card Interpretation Panel */}
            {selectedCards[activeCardDetail] && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider block">
                      Detailed Breakdown: Card #{activeCardDetail + 1}
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-[#0f172a] flex items-center gap-2">
                      <span>{selectedCards[activeCardDetail].card.name}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full ${
                        selectedCards[activeCardDetail].isReversed ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {selectedCards[activeCardDetail].isReversed ? 'Reversed Orientation' : 'Upright Orientation'}
                      </span>
                    </h3>
                  </div>

                  {/* Dimension Tabs */}
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1">
                    {(['summary', 'love', 'career', 'spirituality'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setReadingCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-extrabold capitalize rounded-lg transition-colors cursor-pointer ${
                          readingCategory === cat
                            ? 'bg-[#d97706] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Metadata Box */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Position in Spread:</span>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">
                        {selectedCards[activeCardDetail].position.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {selectedCards[activeCardDetail].position.purposeReason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-400 block">Astrological &amp; Planetary Affinity:</span>
                      <p className="font-bold text-[#b45309]">{selectedCards[activeCardDetail].card.astrology}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Element / Tattva:</span>
                      <p className="font-bold text-slate-800">{selectedCards[activeCardDetail].card.element}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Symbolic Imagery:</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed italic">
                        {selectedCards[activeCardDetail].card.symbolism}
                      </p>
                    </div>
                  </div>

                  {/* Middle & Right Content */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                      <h4 className="font-bold text-sm text-[#b45309] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#d97706]" />
                        <span>Core Guidance for {readingCategory}</span>
                      </h4>
                      <p className="text-sm text-slate-800 leading-relaxed">
                        {selectedCards[activeCardDetail].isReversed
                          ? selectedCards[activeCardDetail].card.reversed[readingCategory]
                          : selectedCards[activeCardDetail].card.upright[readingCategory]}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Vedic Astrological Remedy &amp; Harmonization</span>
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {selectedCards[activeCardDetail].card.vedicRemedy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOTTOM CTA: Book Astrologer Consultation */}
            <div className="bg-gradient-to-r from-[#1c2541] via-[#0b132b] to-[#0f172a] p-8 rounded-3xl border border-[#3a506b] text-white shadow-2xl text-center space-y-4 print:hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/20 border border-[#d97706]/40 text-[#fbbf24] text-xs font-bold uppercase">
                <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                <span>Need Personalized Astrological Clarity?</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#fbbf24]">
                Discuss Your Tarot Spread With a Verified Vedic Acharya
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                Connect 1-on-1 with senior Manipuri and Vedic astrologers to compare your Tarot guidance with your birth chart (D1/D9) and active Vimshottari Dasha cycles.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <span>Book 1-on-1 Consultation</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/manipuri_free_kuthi"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Calculate Free Kundli</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 4. SEO-FRIENDLY HUMAN-VOICE ARTICLE                           */}
        {/* IMPORTANT RULE: Visible initially, HIDDEN when result comes   */}
        {/* ───────────────────────────────────────────────────────────── */}
        {!readingResult && (
          <div className="pt-8 border-t border-[#f3e8d2] space-y-10">
            {/* Main Article Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase">
                <BookOpen className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Complete Guide to Tarot &amp; Cosmic Archetypes</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f172a]">
                Understanding the Power of a 6-Card Tarot Reading
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Written with genuine human care by our team of practicing astrologers and tarot readers.
              </p>
            </div>

            {/* Article Sections */}
            <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#0f172a] flex items-center gap-2">
                  <Sun className="w-5 h-5 text-[#d97706]" />
                  <span>How Tarot Mirrors the Human Soul and Destiny</span>
                </h3>
                <p>
                  Have you ever felt at a crossroads in life, where logic simply wasn&apos;t enough to tell you which path to choose? That is where Tarot steps in. Tarot is not about fortune-telling in the sense of a fixed, unchangeable script. Rather, it acts as a sacred mirror reflecting your subconscious mind, your energetic frequency, and the karmic currents flowing around you at this exact moment.
                </p>
                <p>
                  Rooted in ancient Hermetic traditions, Kabbalistic symbolism, and archetypal psychology popularized by Carl Jung, each of the 78 tarot cards represents a universal chapter of human evolution. Whether you draw <em>The Fool</em> embarking on a courageous leap of faith or <em>The Tower</em> clearing out outdated structures, the cards speak directly to your soul&apos;s intuition.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#0f172a] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#d97706]" />
                  <span>The Geometry of the 6-Card Sacred Spread</span>
                </h3>
                <p>
                  While a simple 1-card or 3-card spread offers quick snapshots, our **6-Card Divine Spread** is engineered to provide a 360-degree holographic view of your life. Here is why each specific position is drawn:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-[#b45309] block mb-1">1. Current Aura (The Present)</span>
                    <p className="text-xs text-slate-600">Reveals your dominant state of mind, immediate challenges, and active frequency right now.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-[#b45309] block mb-1">2. The Hidden Cross (Obstacle)</span>
                    <p className="text-xs text-slate-600">Uncovers subconscious resistance, fears, or external blockages slowing your progress.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-[#b45309] block mb-1">3. The Subconscious Root (Karma)</span>
                    <p className="text-xs text-slate-600">Explains the origin story—past deeds, childhood impressions, or past cycles creating today&apos;s patterns.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-[#b45309] block mb-1">4. Guiding Light (Near Future)</span>
                    <p className="text-xs text-slate-600">Forecasts emerging doors, opportunities, and the next 1 to 3 months of momentum.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-[#b45309] block mb-1">5. External Forces (Environment)</span>
                    <p className="text-xs text-slate-600">Highlights how partners, coworkers, family expectations, and society influence you.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-[#b45309] block mb-1">6. Final Outcome &amp; Divine Advice</span>
                    <p className="text-xs text-slate-600">Synthesizes the reading into actionable wisdom and Vedic astrological remedies to maximize blessings.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#0f172a] flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#d97706]" />
                  <span>Bridging Tarot With Vedic Jyotish &amp; Chakras</span>
                </h3>
                <p>
                  At KuthiYengpham / KangleiAstro, we believe in the universal synthesis of sacred sciences. In classical Vedic astrology, every planet (Graha) vibrates at a specific frequency that maps onto the Major Arcana cards:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700 pl-2">
                  <li><strong>The Sun (Surya Dev)</strong> corresponds directly with <em>The Sun</em> and <em>Strength</em> cards, governing vitality and executive will.</li>
                  <li><strong>The Moon (Chandra)</strong> rules <em>The High Priestess</em> and <em>The Moon</em>, channeling intuition and emotional waters.</li>
                  <li><strong>Mercury (Budha)</strong> governs <em>The Magician</em>, stimulating intellectual articulation, trade, and clever manifestation.</li>
                  <li><strong>Jupiter (Guru Brihaspati)</strong> rules <em>The Hierophant</em> and <em>Wheel of Fortune</em>, bestowing wisdom, fortune, and moral ethics.</li>
                  <li><strong>Saturn (Shani Dev)</strong> oversees <em>The World</em> and <em>Justice</em>, rewarding patient discipline and balancing karmic debts.</li>
                </ul>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#0f172a] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#d97706]" />
                  <span>Frequently Asked Questions About Free Online Tarot Readings</span>
                </h3>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <h5 className="font-bold text-slate-900">Are online tarot card readings accurate?</h5>
                    <p className="text-slate-600 mt-1">
                      Yes. In quantum physics and metaphysical science, energy follows intention. When you focus on your question before drawing, the synchronicity principle aligns your consciousness with the archetypal cards drawn.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900">What does it mean if a card appears Reversed (Upside Down)?</h5>
                    <p className="text-slate-600 mt-1">
                      A reversed card does not mean bad luck. It simply indicates that the card&apos;s energy is internalized, blocked, or in need of conscious adjustment before it can express its highest blessing.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900">How often should I consult the 6-Card Tarot Oracle?</h5>
                    <p className="text-slate-600 mt-1">
                      We recommend consulting the cards once a day for daily guidance, or whenever you face a major life dilemma, new project, or relationship decision.
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
