import React, { useState } from 'react';
import { YogaItem } from '../../types/astronomy';
import { Sparkles, CheckCircle2, Crown, Coins } from 'lucide-react';

interface YogaListProps {
  yogas: YogaItem[];
}

export const YogaList: React.FC<YogaListProps> = ({ yogas }) => {
  const [filter, setFilter] = useState<'all' | 'present' | 'Raja Yoga' | 'Mahapurusha' | 'Dhana Yoga'>('present');

  const filteredYogas = yogas.filter((y) => {
    if (filter === 'present') return y.isPresent;
    if (filter === 'all') return true;
    return y.category === filter;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Raja Yoga':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Mahapurusha':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'Dhana Yoga':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-purple-100 text-purple-900 border-purple-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1">
        <button
          onClick={() => setFilter('present')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
            filter === 'present'
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/25'
              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active in Chart ({yogas.filter((y) => y.isPresent).length})</span>
        </button>

        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            filter === 'all'
              ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
          }`}
        >
          All Evaluated Yogas ({yogas.length})
        </button>

        <button
          onClick={() => setFilter('Raja Yoga')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1 ${
            filter === 'Raja Yoga'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Raja Yogas</span>
        </button>

        <button
          onClick={() => setFilter('Mahapurusha')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1 ${
            filter === 'Mahapurusha'
              ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pancha Mahapurusha</span>
        </button>

        <button
          onClick={() => setFilter('Dhana Yoga')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1 ${
            filter === 'Dhana Yoga'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Dhana (Wealth) Yogas</span>
        </button>
      </div>

      {/* Grid of Yogas */}
      {filteredYogas.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-amber-200 text-slate-500 text-sm">
          No yogas match the selected filter category for this chart.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredYogas.map((yoga) => {
            return (
              <div
                key={yoga.name}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  yoga.isPresent
                    ? 'bg-white border-amber-300 shadow-sm shadow-amber-900/5 hover:border-amber-400'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                        <span>{yoga.name}</span>
                        {yoga.isPresent && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-amber-800 font-serif font-medium">
                        {yoga.sanskritName}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getCategoryBadge(
                        yoga.category
                      )}`}
                    >
                      {yoga.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mb-2 leading-relaxed">
                    {yoga.description}
                  </p>

                  <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-200/80 text-[11px] text-slate-800">
                    <strong className="text-amber-900 font-bold">Classical Effect: </strong>
                    {yoga.result}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span>Planets: </span>
                    <span className="font-mono text-amber-900 font-bold">
                      {yoga.participatingPlanets.join(', ')}
                    </span>
                  </div>
                  <div>
                    {yoga.isPresent ? (
                      <span className="text-emerald-700 font-bold text-[10px]">
                        PRESENT IN CHART
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">
                        Not Formed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
