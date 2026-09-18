import React from 'react';
import { SadeSatiData } from '../../types/astronomy';
import { Sparkles, Activity, CheckCircle2 } from 'lucide-react';

interface SadeSatiTrackerProps {
  sadeSati: SadeSatiData;
}

export const SadeSatiTracker: React.FC<SadeSatiTrackerProps> = ({ sadeSati }) => {
  return (
    <div className="space-y-4">
      {/* Top Phase Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-200">
        <div>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Saturn (Shani) 7.5-Year Transit Cycle
          </div>
          <div className="font-serif font-bold text-lg text-slate-900 mt-0.5">
            {sadeSati.currentPhase}
          </div>
        </div>
        <div>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
              sadeSati.isUnderSadeSati
                ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-xs'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            {sadeSati.isUnderSadeSati ? (
              <>
                <Activity className="w-3.5 h-3.5 text-purple-700 animate-pulse" />
                SADE SATI ACTIVE
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                NO SADE SATI
              </>
            )}
          </span>
        </div>
      </div>

      {/* Narrative description */}
      <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs text-slate-700 leading-relaxed shadow-xs">
        <p>{sadeSati.description}</p>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-3">
          <span>Natal Moon: <strong className="text-slate-900">{sadeSati.moonSign}</strong></span>
          <span>•</span>
          <span>Transit Saturn: <strong className="text-slate-900">{sadeSati.saturnSign}</strong></span>
        </div>
      </div>

      {/* 3-Phase Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sadeSati.timeline.map((phase) => {
          const isActive = phase.status === 'Active';
          const isPast = phase.status === 'Past';

          return (
            <div
              key={phase.phase}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-purple-50/90 border-purple-400 shadow-xs ring-1 ring-purple-300'
                  : isPast
                  ? 'bg-slate-50/80 border-slate-200 text-slate-500'
                  : 'bg-white border-amber-200 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-serif font-bold text-xs text-slate-900">
                    {phase.phase}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isActive
                        ? 'bg-purple-200 text-purple-900'
                        : isPast
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-amber-800">
                  Sign: {phase.sign} ({phase.signSanskrit})
                </div>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-normal">
                  {phase.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-100 text-[10px] text-slate-400 font-mono">
                Span: {phase.period}
              </div>
            </div>
          );
        })}
      </div>

      {/* Remedies */}
      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-300">
        <div className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          Shani Shanti Classical Remedies:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
          {sadeSati.remedies.map((rem, i) => (
            <div
              key={i}
              className="flex items-start gap-2 bg-white p-2 rounded-lg border border-purple-200 shadow-xs"
            >
              <span className="text-purple-700 font-mono font-bold text-xs">
                {i + 1}.
              </span>
              <span>{rem}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
