import React from 'react';
import { PanchangData } from '../../types/astronomy';
import { Sun, Moon, Sparkles, Compass, ShieldCheck, Flame, Clock } from 'lucide-react';

interface PanchangStripProps {
  panchang: PanchangData;
}

export const PanchangStrip: React.FC<PanchangStripProps> = ({ panchang }) => {
  return (
    <div className="space-y-4">
      {/* Top Panchang Elements Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* 1. Tithi */}
        <div className="bg-amber-50/40 rounded-xl p-3.5 border border-amber-200/80 relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="text-[11px] uppercase tracking-wider text-amber-900/70 font-semibold flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-amber-600" />
              1. Tithi (तिथि)
            </span>
            <span className="text-amber-700 font-mono text-[10px] font-bold">
              {panchang.tithi.completionPercent}%
            </span>
          </div>
          <div className="text-sm font-serif font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
            {panchang.tithi.name}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Deity: {panchang.tithi.deity}</span>
          </div>
          <div className="w-full bg-amber-200/60 rounded-full h-1 mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${panchang.tithi.completionPercent}%` }}
            />
          </div>
        </div>

        {/* 2. Vara */}
        <div className="bg-orange-50/40 rounded-xl p-3.5 border border-orange-200/80 relative overflow-hidden group hover:border-orange-400 transition-all">
          <div className="text-[11px] uppercase tracking-wider text-orange-900/70 font-semibold flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-orange-600" />
              2. Vara (वार)
            </span>
            <span className="text-orange-700 text-[10px] font-medium">Solar Day</span>
          </div>
          <div className="text-sm font-serif font-bold text-slate-900 group-hover:text-orange-800 transition-colors">
            {panchang.vara.sanskritName}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Ruler: {panchang.vara.lord}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {panchang.vara.dayStartTime}
          </div>
        </div>

        {/* 3. Nakshatra */}
        <div className="bg-amber-50/40 rounded-xl p-3.5 border border-amber-200/80 relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="text-[11px] uppercase tracking-wider text-amber-900/70 font-semibold flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              3. Nakshatra (नक्षत्र)
            </span>
            <span className="text-amber-700 font-mono text-[10px] font-bold">
              Pada {panchang.nakshatra.pada}
            </span>
          </div>
          <div className="text-sm font-serif font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
            {panchang.nakshatra.name} ({panchang.nakshatra.sanskritName})
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Lord: {panchang.nakshatra.lord} • {panchang.nakshatra.deity}
          </div>
          <div className="w-full bg-amber-200/60 rounded-full h-1 mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${panchang.nakshatra.completionPercent}%` }}
            />
          </div>
        </div>

        {/* 4. Yoga */}
        <div className="bg-emerald-50/40 rounded-xl p-3.5 border border-emerald-200/80 relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="text-[11px] uppercase tracking-wider text-emerald-900/70 font-semibold flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              4. Yoga (योग)
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                panchang.yoga.isAuspicious
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {panchang.yoga.isAuspicious ? 'Shubh' : 'Ashubh'}
            </span>
          </div>
          <div className="text-sm font-serif font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
            {panchang.yoga.name} ({panchang.yoga.sanskritName})
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate" title={panchang.yoga.meaning}>
            {panchang.yoga.meaning}
          </div>
          <div className="w-full bg-emerald-200/60 rounded-full h-1 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                panchang.yoga.isAuspicious ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${panchang.yoga.completionPercent}%` }}
            />
          </div>
        </div>

        {/* 5. Karana */}
        <div className="bg-purple-50/40 rounded-xl p-3.5 border border-purple-200/80 relative overflow-hidden group hover:border-purple-400 transition-all col-span-2 md:col-span-1">
          <div className="text-[11px] uppercase tracking-wider text-purple-900/70 font-semibold flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              5. Karana (करण)
            </span>
            <span className="text-purple-700 text-[10px] font-medium">
              {panchang.karana.type}
            </span>
          </div>
          <div className="text-sm font-serif font-bold text-slate-900 group-hover:text-purple-800 transition-colors">
            {panchang.karana.name} ({panchang.karana.sanskritName})
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Lord: {panchang.karana.lord}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Deity: {panchang.karana.deity}
          </div>
        </div>
      </div>

      {/* Solar & Astronomical Metrics Sub-Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80 text-xs">
        <div className="flex items-center gap-2.5">
          <Sun className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 font-medium uppercase">Sunrise / Sunset</div>
            <div className="font-mono text-slate-800 font-semibold">
              {panchang.sunrise} AM • {panchang.sunset} PM
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 font-medium uppercase">Solar Noon (Madhya)</div>
            <div className="font-mono text-slate-800 font-semibold">
              {panchang.solarNoon}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Flame className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 font-medium uppercase">Samvat Era</div>
            <div className="font-mono text-slate-800 font-semibold">
              Vikram {panchang.samvat.vikram} • Shaka {panchang.samvat.shaka}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 font-medium uppercase">Ayanamsa (Lahiri)</div>
            <div className="font-mono text-amber-900 font-semibold">
              {panchang.ayanamsa.formatted}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
