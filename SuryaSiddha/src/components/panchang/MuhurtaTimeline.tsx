import React from 'react';
import { AuspiciousTimes } from '../../types/astronomy';
import { ShieldCheck, AlertTriangle, Moon, Sparkles } from 'lucide-react';

interface MuhurtaTimelineProps {
  muhurta: AuspiciousTimes;
}

export const MuhurtaTimeline: React.FC<MuhurtaTimelineProps> = ({ muhurta }) => {
  return (
    <div className="space-y-4">
      {/* Auspicious Periods */}
      <div>
        <div className="text-xs uppercase tracking-wider text-emerald-800 font-bold mb-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Auspicious Muhurtas (शुभ मुहूर्त)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Abhijit Muhurta */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-300 flex items-start justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-serif font-bold text-sm text-slate-900">
                  Abhijit Muhurta (अभिजित)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Lord Vishnu’s victorious window. Destroys doshas.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-mono text-sm font-bold text-emerald-800">
                {muhurta.abhijitMuhurta.start} - {muhurta.abhijitMuhurta.end}
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                Highly Auspicious
              </span>
            </div>
          </div>

          {/* Brahma Muhurta */}
          <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-300 flex items-start justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-cyan-600" />
                <span className="font-serif font-bold text-sm text-slate-900">
                  Brahma Muhurta (ब्रह्म)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Sacred pre-dawn time optimal for meditation & study.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-mono text-sm font-bold text-cyan-800">
                {muhurta.brahmaMuhurta.start} - {muhurta.brahmaMuhurta.end}
              </div>
              <span className="text-[10px] text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md border border-cyan-200 font-semibold">
                Divine Sādhanā
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inauspicious Cautionary Periods */}
      <div>
        <div className="text-xs uppercase tracking-wider text-rose-800 font-bold mb-2.5 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          Inauspicious Windows (अशुभ काल - Avoid Initiations)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Rahu Kaal */}
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-300 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif font-bold text-xs text-rose-900">
                Rahu Kaal (राहु काल)
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold border border-rose-200">
                Inauspicious
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-slate-900">
              {muhurta.rahuKaal.start} - {muhurta.rahuKaal.end}
            </div>
            <p className="text-[10px] text-slate-600 mt-1">
              Avoid signing contracts, journeys, or starting ventures.
            </p>
          </div>

          {/* Yamaganda */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif font-bold text-xs text-amber-900">
                Yamaganda (यमगण्ड)
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold border border-amber-200">
                Avoid
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-slate-900">
              {muhurta.yamaganda.start} - {muhurta.yamaganda.end}
            </div>
            <p className="text-[10px] text-slate-600 mt-1">
              Son of Sun (Yama). Delay critical transactions.
            </p>
          </div>

          {/* Gulika Kaal */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-serif font-bold text-xs text-slate-800">
                Gulika Kaal (गुलिक काल)
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                Neutral / Shani
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-slate-900">
              {muhurta.gulikaKaal.start} - {muhurta.gulikaKaal.end}
            </div>
            <p className="text-[10px] text-slate-600 mt-1">
              Son of Saturn. Good for routine storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
