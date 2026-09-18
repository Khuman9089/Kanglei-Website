import React from 'react';
import { PanchangData } from '../../types/astronomy';
import { Moon, Sun, Sparkles, ShieldCheck, Compass } from 'lucide-react';

interface PanchangFiveAngasProps {
  panchang: PanchangData;
}

export const PanchangFiveAngas: React.FC<PanchangFiveAngasProps> = ({ panchang }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. TITHI */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-900/80 mb-2">
            <span className="flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-amber-600" />
              1. Tithi (तिथि)
            </span>
            <span className="text-amber-800 font-mono">
              {panchang.tithi.completionPercent}%
            </span>
          </div>

          <h4 className="font-serif font-bold text-base text-slate-900 leading-snug">
            {panchang.tithi.name}
          </h4>

          <div className="mt-2 space-y-1 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Paksha: </span>
              <strong className="text-slate-800">{panchang.tithi.paksha}</strong>
            </div>
            <div>
              <span className="text-slate-400">Deity: </span>
              <strong className="text-slate-800">{panchang.tithi.deity}</strong>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-amber-100">
          <div className="text-[11px] font-mono text-amber-900 font-semibold">
            {panchang.tithi.endsAt}
          </div>
          <div className="w-full bg-amber-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${panchang.tithi.completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. NAKSHATRA */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-900/80 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              2. Nakshatra (नक्षत्र)
            </span>
            <span className="text-amber-800 font-mono">
              Pada {panchang.nakshatra.pada}
            </span>
          </div>

          <h4 className="font-serif font-bold text-base text-slate-900 leading-snug">
            {panchang.nakshatra.name}
          </h4>
          <p className="text-[11px] text-amber-800 font-serif">
            {panchang.nakshatra.sanskritName}
          </p>

          <div className="mt-2 space-y-1 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Lord: </span>
              <strong className="text-slate-800">{panchang.nakshatra.lord}</strong>
            </div>
            <div>
              <span className="text-slate-400">Deity: </span>
              <strong className="text-slate-800">{panchang.nakshatra.deity}</strong>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-amber-100">
          <div className="text-[11px] font-mono text-amber-900 font-semibold">
            {panchang.nakshatra.endsAt}
          </div>
          <div className="w-full bg-amber-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${panchang.nakshatra.completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. YOGA */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-900/80 mb-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              3. Yoga (योग)
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                panchang.yoga.isAuspicious
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {panchang.yoga.isAuspicious ? 'Shubh' : 'Ashubh'}
            </span>
          </div>

          <h4 className="font-serif font-bold text-base text-slate-900 leading-snug">
            {panchang.yoga.name}
          </h4>
          <p className="text-[11px] text-emerald-800 font-serif">
            {panchang.yoga.sanskritName}
          </p>

          <div className="mt-2 text-xs text-slate-600 leading-snug line-clamp-2" title={panchang.yoga.meaning}>
            {panchang.yoga.meaning}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-amber-100">
          <div className="text-[11px] font-mono text-emerald-900 font-semibold">
            {panchang.yoga.endsAt}
          </div>
          <div className="w-full bg-emerald-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                panchang.yoga.isAuspicious ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${panchang.yoga.completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. KARANA */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-900/80 mb-2">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              4. Karana (करण)
            </span>
            <span className="text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-semibold">
              {panchang.karana.type}
            </span>
          </div>

          <h4 className="font-serif font-bold text-base text-slate-900 leading-snug">
            {panchang.karana.name}
          </h4>
          <p className="text-[11px] text-purple-800 font-serif">
            {panchang.karana.sanskritName}
          </p>

          <div className="mt-2 space-y-1 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Lord: </span>
              <strong className="text-slate-800">{panchang.karana.lord}</strong>
            </div>
            <div>
              <span className="text-slate-400">Deity: </span>
              <strong className="text-slate-800">{panchang.karana.deity}</strong>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-amber-100">
          <div className="text-[11px] text-slate-500">
            Half-Tithi Division (6°)
          </div>
        </div>
      </div>

      {/* 5. VARA (WEEKDAY) */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-900/80 mb-2">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-orange-600" />
              5. Vara (वार)
            </span>
            <span className="text-orange-800 text-[10px] font-medium">Solar Day</span>
          </div>

          <h4 className="font-serif font-bold text-base text-slate-900 leading-snug">
            {panchang.vara.name}
          </h4>
          <p className="text-[11px] text-orange-800 font-serif">
            {panchang.vara.sanskritName}
          </p>

          <div className="mt-2 space-y-1 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Day Lord: </span>
              <strong className="text-slate-800">{panchang.vara.lord}</strong>
            </div>
            <div>
              <span className="text-slate-400">Vedic Epoch: </span>
              <strong className="text-slate-800">{panchang.vara.dayStartTime}</strong>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-amber-100">
          <div className="text-[11px] text-slate-500">
            Sunrise to Sunrise Span
          </div>
        </div>
      </div>
    </div>
  );
};
