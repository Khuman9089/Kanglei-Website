import React, { useState } from 'react';
import { ChoghadiyaPeriod } from '../../types/astronomy';
import { Sun, Moon, Clock } from 'lucide-react';

interface ChoghadiyaTableProps {
  dayChoghadiya: ChoghadiyaPeriod[];
  nightChoghadiya: ChoghadiyaPeriod[];
}

export const ChoghadiyaTable: React.FC<ChoghadiyaTableProps> = ({
  dayChoghadiya,
  nightChoghadiya,
}) => {
  const [activeTab, setActiveTab] = useState<'day' | 'night'>('day');
  const activeList = activeTab === 'day' ? dayChoghadiya : nightChoghadiya;

  const getQualityBadge = (nature: string) => {
    switch (nature) {
      case 'Amrit':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Shubh':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'Labh':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300 font-bold';
      case 'Char':
        return 'bg-slate-100 text-slate-800 border-slate-300 font-medium';
      case 'Rog':
        return 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
      case 'Kaal':
        return 'bg-red-100 text-red-900 border-red-300 font-bold';
      case 'Udveg':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-3">
      {/* Day / Night Toggle Switch */}
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-amber-950 font-bold flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-600" />
          Choghadiya Muhurta (चौघड़िया)
        </div>
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
          <button
            onClick={() => setActiveTab('day')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'day'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-amber-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Day Choghadiya</span>
          </button>
          <button
            onClick={() => setActiveTab('night')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'night'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-amber-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Night Choghadiya</span>
          </button>
        </div>
      </div>

      {/* Grid of 8 Choghadiya Periods */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {activeList.map((period, idx) => {
          const badgeClass = getQualityBadge(period.nature);

          return (
            <div
              key={`${period.name}-${idx}`}
              className={`p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                period.isCurrent
                  ? 'ring-2 ring-amber-500 bg-amber-50/80 shadow-md shadow-amber-900/10'
                  : 'bg-white border-amber-200/80 hover:border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <div>
                  <div className="font-serif font-bold text-sm text-slate-900 flex items-center gap-1">
                    {period.name}
                    {period.isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {period.sanskritName}
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${badgeClass}`}
                >
                  {period.nature === 'Amrit'
                    ? 'Best'
                    : period.nature === 'Shubh' || period.nature === 'Labh'
                    ? 'Good'
                    : period.nature === 'Char'
                    ? 'Neutral'
                    : 'Avoid'}
                </span>
              </div>

              <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-900 font-bold">
                  {period.start} - {period.end}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">
                Ruler: {period.ruler}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
