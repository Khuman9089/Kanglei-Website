// components/dasha/ActiveDashaCard.tsx
import React from 'react';
import { VimshottariDashaNode } from '../../types/astronomy';
import { Activity, Clock } from 'lucide-react';

interface ActiveDashaCardProps {
  birthBalance: { planet: string; years: number; months: number; days: number };
  tree: VimshottariDashaNode[];
  activePath: { maha: string; antar: string; pratyantar: string };
}

export const ActiveDashaCard: React.FC<ActiveDashaCardProps> = ({
  birthBalance,
  tree,
}) => {
  const activeMahaNode = tree.find((m) => m.isActive) || tree[0];
  const activeAntarNode = activeMahaNode?.children?.find((a) => a.isActive) || activeMahaNode?.children?.[0];
  const activePratyantarNode = activeAntarNode?.children?.find((p) => p.isActive) || activeAntarNode?.children?.[0];

  return (
    <div className="space-y-3.5">
      {/* Current Operational Dasha Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Mahadasha: Saffron Orange */}
        <div className="p-4 rounded-2xl bg-[#FFF7ED] border border-[#FDBA74] relative overflow-hidden shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9A3412] font-black flex items-center justify-between mb-1">
            <span>Mahadasha (महादशा)</span>
            <span className="font-mono text-[#C2410C] font-bold">{activeMahaNode?.progressPercent}% Elapsed</span>
          </div>
          <div className="text-xl font-serif font-black text-[#7C2D12] flex items-center gap-2">
            <span>{activeMahaNode?.planet}</span>
            <span className="text-sm font-normal text-[#9A3412]">
              ({activeMahaNode?.sanskritName})
            </span>
          </div>
          <div className="text-xs text-[#9A3412] mt-2 font-mono font-semibold">
            {activeMahaNode?.startDate} → {activeMahaNode?.endDate}
          </div>
          <div className="w-full bg-[#FED7AA] rounded-full h-2 mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#FF6B4A] to-[#FFA133] h-full rounded-full transition-all duration-500"
              style={{ width: `${activeMahaNode?.progressPercent || 0}%` }}
            />
          </div>
        </div>

        {/* Antardasha: Electric Indigo */}
        <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#A5B4FC] relative overflow-hidden shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#3730A3] font-black flex items-center justify-between mb-1">
            <span>Antardasha (अन्तर्दशा)</span>
            <span className="font-mono text-[#4338CA] font-bold">{activeAntarNode?.progressPercent}% Elapsed</span>
          </div>
          <div className="text-xl font-serif font-black text-[#312E81] flex items-center gap-2">
            <span>{activeAntarNode?.planet}</span>
            <span className="text-sm font-normal text-[#3730A3]">
              ({activeAntarNode?.sanskritName})
            </span>
          </div>
          <div className="text-xs text-[#3730A3] mt-2 font-mono font-semibold">
            {activeAntarNode?.startDate} → {activeAntarNode?.endDate}
          </div>
          <div className="w-full bg-[#C7D2FE] rounded-full h-2 mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] h-full rounded-full transition-all duration-500"
              style={{ width: `${activeAntarNode?.progressPercent || 0}%` }}
            />
          </div>
        </div>

        {/* Pratyantardasha: Mint Emerald */}
        <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#6EE7B7] relative overflow-hidden shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#065F46] font-black flex items-center justify-between mb-1">
            <span>Pratyantar (प्रत्यन्तर्दशा)</span>
            <span className="font-mono text-[#047857] font-bold">{activePratyantarNode?.progressPercent}% Elapsed</span>
          </div>
          <div className="text-xl font-serif font-black text-[#064E3B] flex items-center gap-2">
            <span>{activePratyantarNode?.planet || 'Ketu'}</span>
            <span className="text-sm font-normal text-[#065F46]">
              ({activePratyantarNode?.sanskritName || 'केतु'})
            </span>
          </div>
          <div className="text-xs text-[#065F46] mt-2 font-mono font-semibold">
            {activePratyantarNode?.startDate} → {activePratyantarNode?.endDate}
          </div>
          <div className="w-full bg-[#A7F3D0] rounded-full h-2 mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#10B981] to-[#34D399] h-full rounded-full transition-all duration-500"
              style={{ width: `${activePratyantarNode?.progressPercent || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Birth Balance Dasha Sub-Bar */}
      <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <span className="text-slate-600">Birth Balance Dasha at Epoch: </span>
            <span className="font-bold text-slate-900">
              {birthBalance.planet} ({birthBalance.years}y {birthBalance.months}m {birthBalance.days}d balance remaining)
            </span>
          </div>
        </div>
        <div className="text-[11px] text-stone-500 font-mono">
          Vimshottari 120-Year Full Cycle Engine
        </div>
      </div>
    </div>
  );
};
