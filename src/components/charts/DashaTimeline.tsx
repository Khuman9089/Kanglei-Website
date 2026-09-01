'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export interface DashaPeriod {
  id: string;
  planet: string;
  startDate: string;
  endDate: string;
  subPeriods?: DashaPeriod[];
}

interface DashaTimelineProps {
  dashas: DashaPeriod[];
  currentDate?: string;
}

const PLANET_SYMBOLS: Record<string, string> = {
  Ketu: 'KE',
  Venus: 'VE',
  Sun: 'SU',
  Moon: 'MO',
  Mars: 'MA',
  Rahu: 'RA',
  Jupiter: 'JU',
  Saturn: 'SA',
  Mercury: 'ME',
};

export function DashaTimeline({ dashas }: DashaTimelineProps) {
  // Navigation stack for drilldown levels: 1 = Mahadasha, 2 = Antardasha, 3 = Pratyantar, 4 = Sookshma
  const [level, setLevel] = useState<number>(1);
  const [selectedMaha, setSelectedMaha] = useState<DashaPeriod | null>(null);
  const [selectedAntar, setSelectedAntar] = useState<DashaPeriod | null>(null);
  const [selectedPratyantar, setSelectedPratyantar] = useState<DashaPeriod | null>(null);

  // Get current list of periods based on level
  const getCurrentPeriods = (): DashaPeriod[] => {
    if (level === 1) return dashas;
    if (level === 2 && selectedMaha) return selectedMaha.subPeriods || generateSubPeriods(selectedMaha, 5);
    if (level === 3 && selectedAntar) return selectedAntar.subPeriods || generateSubPeriods(selectedAntar, 2);
    if (level === 4 && selectedPratyantar) return selectedPratyantar.subPeriods || generateSubPeriods(selectedPratyantar, 0.5);
    return dashas;
  };

  const handleDrillIn = (period: DashaPeriod) => {
    if (level === 1) {
      setSelectedMaha(period);
      setLevel(2);
    } else if (level === 2) {
      setSelectedAntar(period);
      setLevel(3);
    } else if (level === 3) {
      setSelectedPratyantar(period);
      setLevel(4);
    }
  };

  const handleBack = () => {
    if (level === 4) {
      setSelectedPratyantar(null);
      setLevel(3);
    } else if (level === 3) {
      setSelectedAntar(null);
      setLevel(2);
    } else if (level === 2) {
      setSelectedMaha(null);
      setLevel(1);
    }
  };

  const currentList = getCurrentPeriods();

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-5">
      {/* Title & Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900">
            Vimshottari Dasha
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            Tap any period to drill down through Mahadasha → Antardasha → Pratyantar → Sookshma.
          </p>
        </div>

        {level > 1 && (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm border border-amber-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Level {level - 1}</span>
          </button>
        )}
      </div>

      {/* 4-Step Stepper Header */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-1">
        {[
          { num: 1, name: 'Mahadasha' },
          { num: 2, name: 'Antardasha' },
          { num: 3, name: 'Pratyantar' },
          { num: 4, name: 'Sookshma' },
        ].map((step, idx) => {
          const isActive = level === step.num;
          const isDone = level > step.num;

          return (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                  isActive
                    ? 'bg-[#facc15] text-slate-900 shadow-xs font-black'
                    : isDone
                    ? 'bg-amber-200 text-amber-900 font-extrabold'
                    : 'bg-slate-100 text-slate-400 font-semibold'
                }`}>
                  {step.num}
                </span>
                <span className={`text-xs sm:text-sm font-bold ${
                  isActive ? 'text-slate-900 font-black' : isDone ? 'text-amber-900 font-semibold' : 'text-slate-400'
                }`}>
                  {step.name}
                </span>
              </div>

              {idx < 3 && (
                <div className={`h-[1.5px] flex-1 min-w-[20px] sm:min-w-[40px] ${
                  level > step.num ? 'bg-amber-300' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Dasha Period Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3.5">PLANET</th>
              <th className="py-3 px-3.5">START DATE</th>
              <th className="py-3 px-3.5">END DATE</th>
              <th className="py-3 px-3.5 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
            {currentList.map((period, idx) => {
              const symbol = PLANET_SYMBOLS[period.planet] || period.planet.substring(0, 2).toUpperCase();

              return (
                <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                  <td className="py-3.5 px-3.5 font-bold text-slate-900 text-sm sm:text-base">
                    <span className="font-black text-slate-900 uppercase mr-1">{symbol}</span>
                    <span className="font-medium text-slate-500">({period.planet.toUpperCase()})</span>
                  </td>
                  <td className="py-3.5 px-3.5 text-slate-800 text-sm sm:text-base">{period.startDate}</td>
                  <td className="py-3.5 px-3.5 text-slate-800 text-sm sm:text-base">{period.endDate}</td>
                  <td className="py-3.5 px-3.5 text-right">
                    {level < 4 ? (
                      <button
                        onClick={() => handleDrillIn(period)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#fef08a]/80 hover:bg-[#fde047] text-slate-900 font-bold text-xs sm:text-sm border border-[#facc15] shadow-xs transition-all cursor-pointer shrink-0"
                      >
                        <span>Drill in</span>
                        <ChevronRight className="w-4 h-4 text-slate-800" />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-normal">End Level</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Fallback generator for nested subperiods if none provided
function generateSubPeriods(parent: DashaPeriod, durationYears: number): DashaPeriod[] {
  const planetsOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  const pIdx = planetsOrder.indexOf(parent.planet);
  const reordered = [...planetsOrder.slice(pIdx >= 0 ? pIdx : 0), ...planetsOrder.slice(0, pIdx >= 0 ? pIdx : 0)];

  let startYr = 2026;
  try {
    const yrMatch = parent.startDate.match(/\d{4}/);
    if (yrMatch) startYr = parseInt(yrMatch[0], 10);
  } catch (e) {}

  const stepYr = durationYears / 9;

  return reordered.map((p, i) => {
    const sYr = (startYr + i * stepYr).toFixed(0);
    const eYr = (startYr + (i + 1) * stepYr).toFixed(0);
    return {
      id: `${parent.id}-sub-${i}`,
      planet: p,
      startDate: `01-Jan-${sYr}`,
      endDate: `31-Dec-${eYr}`,
    };
  });
}

export default DashaTimeline;
