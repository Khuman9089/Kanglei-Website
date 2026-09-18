import React, { useState } from 'react';
import { calculateAshtakoota } from '../../utils/astronomy/matching';
import { AshtakootaResult } from '../../types/astronomy';
import { Heart, AlertTriangle, CheckCircle2, Users } from 'lucide-react';

export const KundliMatching: React.FC = () => {
  const [maleMoonLong] = useState<number>(45.5); // Rohini Moon (Taurus)
  const [femaleMoonLong] = useState<number>(218.2); // Anuradha Moon (Scorpio)

  const [maleName] = useState('Groom (वर)');
  const [femaleName] = useState('Bride (कन्या)');

  const result: AshtakootaResult = calculateAshtakoota(maleMoonLong, femaleMoonLong);

  const getStatusBadge = () => {
    switch (result.status) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Good':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'Average':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Not Recommended':
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Matching Summary Card */}
      <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-md shadow-amber-900/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="text-xs uppercase tracking-wider text-amber-900 font-bold flex items-center justify-center md:justify-start gap-1.5">
            <Heart className="w-4 h-4 text-rose-600" />
            Ashtakoota 36 Guna Milan (अष्टकूट मिलान)
          </div>
          <h3 className="font-serif font-bold text-2xl text-slate-900">
            {maleName} & {femaleName}
          </h3>
          <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
            {result.summary}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 justify-center md:justify-start">
            {result.nadiDosha && (
              <span className="text-[10px] bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" /> Nadi Dosha Present
              </span>
            )}
            {result.bhakootDosha && (
              <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> Bhakoot Dosha Present
              </span>
            )}
            {result.ganaDosha && (
              <span className="text-[10px] bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-purple-600" /> Gana Dosha
              </span>
            )}
            {!result.nadiDosha && !result.bhakootDosha && !result.ganaDosha && (
              <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> All Major Doshas Clear
              </span>
            )}
          </div>
        </div>

        {/* Big Score Gauge */}
        <div className="flex flex-col items-center justify-center p-5 bg-amber-50/60 rounded-2xl border border-amber-200 min-w-[200px] text-center">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">
            Total Compatibility
          </div>
          <div className="font-serif font-black text-4xl text-amber-800">
            {result.totalScore}{' '}
            <span className="text-xl font-normal text-slate-400">/ 36</span>
          </div>
          <div className="mt-2">
            <span
              className={`text-xs px-3 py-1 rounded-xl border font-bold ${getStatusBadge()}`}
            >
              {result.status} ({result.percentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* 8 Kootas Detailed Table */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-md shadow-amber-900/5">
        <h4 className="font-serif font-bold text-base text-slate-900 mb-4 pb-2 border-b border-amber-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-600" />
          8-Fold Astrological Alignment Breakdown (अष्टकूट विवरण)
        </h4>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-amber-200 text-slate-500 font-semibold uppercase text-[11px] bg-amber-50/70">
                <th className="py-2.5 px-3">Koota</th>
                <th className="py-2.5 px-2">Key Domain</th>
                <th className="py-2.5 px-2">Groom Attribute</th>
                <th className="py-2.5 px-2">Bride Attribute</th>
                <th className="py-2.5 px-2 text-center">Points</th>
                <th className="py-2.5 px-2 text-center">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {result.items.map((item) => {
                const isFull = item.obtainedScore === item.maxScore;
                const isZero = item.obtainedScore === 0;

                return (
                  <tr
                    key={item.name}
                    className="hover:bg-amber-50/50 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-serif">
                        {item.sanskritName}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-700">
                      {item.area}
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-900">
                      {item.maleAttribute}
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-900">
                      {item.femaleAttribute}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold">
                      <span
                        className={
                          isFull
                            ? 'text-emerald-700'
                            : isZero
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }
                      >
                        {item.obtainedScore}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-slate-400">
                      {item.maxScore}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
