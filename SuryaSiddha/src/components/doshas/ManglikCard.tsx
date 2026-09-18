import React from 'react';
import { ManglikDoshaData } from '../../types/astronomy';
import { AlertTriangle, CheckCircle2, ShieldCheck, Flame, BookOpen, Sparkles } from 'lucide-react';

interface ManglikCardProps {
  manglik: ManglikDoshaData;
}

export const ManglikCard: React.FC<ManglikCardProps> = ({ manglik }) => {
  const getSeverityBadge = () => {
    switch (manglik.severity) {
      case 'Cancelled':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            DOSHA CANCELLED (दोष भंग)
          </span>
        );
      case 'None':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            NON-MANGLIK (निर्दोष)
          </span>
        );
      case 'Mild':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ANSHIK / MILD MANGLIK
          </span>
        );
      case 'Severe':
        return (
          <span className="bg-rose-100 text-rose-900 border border-rose-300 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            PRABAL MANGLIK (प्रबल मांगलिक)
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-200">
        <div>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Kuja / Bhauma Dosha Analysis
          </div>
          <div className="font-serif font-bold text-lg text-slate-900 mt-0.5">
            Mars (Mangal) Placement Status
          </div>
        </div>
        <div>{getSeverityBadge()}</div>
      </div>

      {/* House Position & Reasons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs">
          <div className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2">
            Astrological Placements:
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {manglik.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cancellation Exceptions */}
        <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Classical Cancellations Found:
          </div>
          {manglik.cancellations.length === 0 ? (
            <div className="text-xs text-slate-500 italic">
              No classical cancellation exceptions apply to current planetary alignments.
            </div>
          ) : (
            <ul className="space-y-1.5 text-xs text-emerald-900 font-medium">
              {manglik.cancellations.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Classical Remedies */}
      {manglik.remedies.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Recommended Classical Remedies:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
            {manglik.remedies.map((rem, i) => (
              <div key={i} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-amber-200 shadow-xs">
                <span className="text-amber-700 font-mono font-bold text-xs">{i + 1}.</span>
                <span>{rem}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
