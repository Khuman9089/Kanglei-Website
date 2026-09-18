import React from 'react';
import { DivisionalChart } from '../../types/astronomy';
import { Sparkles } from 'lucide-react';

interface DivisionalSelectorProps {
  divisionalCharts: Record<string, DivisionalChart>;
  activeCode: string;
  onSelect: (code: string) => void;
  chartStyle: 'north' | 'south';
  onToggleChartStyle: (style: 'north' | 'south') => void;
}

export const DivisionalSelector: React.FC<DivisionalSelectorProps> = ({
  divisionalCharts,
  activeCode,
  onSelect,
  chartStyle,
  onToggleChartStyle,
}) => {
  const chartKeys = Object.keys(divisionalCharts);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 bg-amber-50/60 rounded-xl border border-amber-200/80 mb-3">
      {/* Divisional Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar flex-1 min-w-0">
        {chartKeys.map((code) => {
          const chart = divisionalCharts[code];
          const isActive = activeCode === code;
          return (
            <button
              key={code}
              onClick={() => onSelect(code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border flex-shrink-0 ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/30'
                  : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/70 hover:text-amber-950'
              }`}
            >
              {isActive && <Sparkles className="w-3 h-3 text-white" />}
              <span>{chart.name}</span>
            </button>
          );
        })}
      </div>

      {/* Style Toggle (North vs South Indian) */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-amber-200 self-end sm:self-auto flex-shrink-0 shadow-xs">
        <button
          onClick={() => onToggleChartStyle('north')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
            chartStyle === 'north'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-amber-900'
          }`}
        >
          North Diamond
        </button>
        <button
          onClick={() => onToggleChartStyle('south')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
            chartStyle === 'south'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-amber-900'
          }`}
        >
          South Grid
        </button>
      </div>
    </div>
  );
};
