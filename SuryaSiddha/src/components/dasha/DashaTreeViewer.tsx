import React, { useState } from 'react';
import { VimshottariDashaNode } from '../../types/astronomy';
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react';

interface DashaTreeViewerProps {
  tree: VimshottariDashaNode[];
}

export const DashaTreeViewer: React.FC<DashaTreeViewerProps> = ({ tree }) => {
  const [expandedMaha, setExpandedMaha] = useState<string | null>(
    tree.find((m) => m.isActive)?.planet || tree[0]?.planet || null
  );
  const [expandedAntar, setExpandedAntar] = useState<string | null>(null);

  const toggleMaha = (planet: string) => {
    setExpandedMaha(expandedMaha === planet ? null : planet);
    setExpandedAntar(null);
  };

  const toggleAntar = (planet: string) => {
    setExpandedAntar(expandedAntar === planet ? null : planet);
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500 mb-3 flex items-center justify-between">
        <span>Click any Mahadasha to drill down into Antardashas & Pratyantardashas</span>
        <span className="text-[11px] text-amber-800 font-mono font-bold">120-Year Timeline</span>
      </div>

      <div className="space-y-2">
        {tree.map((maha) => {
          const isMahaOpen = expandedMaha === maha.planet;

          return (
            <div
              key={maha.planet}
              className={`rounded-xl border transition-all overflow-hidden ${
                maha.isActive
                  ? 'bg-amber-50/70 border-amber-400 shadow-sm shadow-amber-900/5'
                  : 'bg-white border-amber-200/80 hover:border-amber-300'
              }`}
            >
              {/* Mahadasha Row */}
              <div
                onClick={() => toggleMaha(maha.planet)}
                className="p-3.5 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <button className="text-slate-400 group-hover:text-amber-700 transition-colors">
                    {isMahaOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <div>
                    <div className="font-serif font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>{maha.planet} Mahadasha</span>
                      <span className="text-xs text-slate-500 font-sans font-normal">
                        ({maha.sanskritName})
                      </span>
                      {maha.isActive && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          ACTIVE NOW
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-mono">
                      {maha.startDate} — {maha.endDate} ({maha.durationYears.toFixed(1)} yrs)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="hidden sm:block">
                    <span className="text-xs font-mono text-slate-700 font-semibold">
                      {maha.progressPercent}%
                    </span>
                    <div className="w-20 bg-amber-200/60 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          maha.isActive ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${maha.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Tree: Antardashas */}
              {isMahaOpen && maha.children && (
                <div className="bg-amber-50/40 border-t border-amber-200/80 px-4 py-3 space-y-1.5">
                  <div className="text-[11px] text-amber-900/80 uppercase font-bold tracking-wider mb-2">
                    Antardashas under {maha.planet} Mahadasha:
                  </div>

                  {maha.children.map((antar) => {
                    const isAntarOpen = expandedAntar === `${maha.planet}-${antar.planet}`;

                    return (
                      <div
                        key={antar.planet}
                        className={`rounded-lg border transition-all ${
                          antar.isActive
                            ? 'bg-cyan-50/80 border-cyan-400'
                            : 'bg-white border-amber-200/70 hover:border-amber-300'
                        }`}
                      >
                        {/* Antardasha Row */}
                        <div
                          onClick={() => toggleAntar(`${maha.planet}-${antar.planet}`)}
                          className="p-2.5 flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <button className="text-slate-400 group-hover:text-cyan-700">
                              {isAntarOpen ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <div>
                              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                                <span>
                                  {maha.planet} / {antar.planet}
                                </span>
                                <span className="text-[11px] text-slate-500 font-normal">
                                  ({antar.sanskritName})
                                </span>
                                {antar.isActive && (
                                  <span className="text-[9px] bg-cyan-100 text-cyan-900 border border-cyan-300 px-1.5 py-0.2 rounded font-bold">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {antar.startDate} → {antar.endDate}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] font-mono text-cyan-800 font-semibold">
                              {antar.progressPercent}%
                            </span>
                          </div>
                        </div>

                        {/* Sub-Tree: Pratyantardashas */}
                        {isAntarOpen && antar.children && (
                          <div className="bg-amber-50/20 px-3 py-2 border-t border-amber-200/60 space-y-1">
                            <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-1">
                              Pratyantardasha Periods:
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                              {antar.children.map((praty) => (
                                <div
                                  key={praty.planet}
                                  className={`p-1.5 rounded text-[10px] border flex items-center justify-between ${
                                    praty.isActive
                                      ? 'bg-purple-100/80 border-purple-400 text-purple-900 font-medium'
                                      : 'bg-white border-amber-200/60 text-slate-700'
                                  }`}
                                >
                                  <div>
                                    <div className="font-bold">
                                      {maha.planet}/{antar.planet}/{praty.planet}
                                    </div>
                                    <div className="text-slate-500 font-mono">
                                      {praty.startDate}
                                    </div>
                                  </div>
                                  {praty.isActive && (
                                    <span className="text-purple-700 font-bold">
                                      ACTIVE
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
