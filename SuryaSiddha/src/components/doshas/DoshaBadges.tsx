import React from 'react';
import { ManglikDoshaData, SadeSatiData, YogaItem } from '../../types/astronomy';
import { ShieldCheck, Sparkles, Activity, Flame } from 'lucide-react';

interface DoshaBadgesProps {
  manglik: ManglikDoshaData;
  sadeSati: SadeSatiData;
  yogas: YogaItem[];
}

export const DoshaBadges: React.FC<DoshaBadgesProps> = ({
  manglik,
  sadeSati,
  yogas,
}) => {
  const activeYogasCount = yogas.filter((y) => y.isPresent).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {/* Manglik Badge */}
      <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
            Manglik Status
          </div>
          <div className="text-xs font-bold text-slate-900 mt-0.5">
            {manglik.severity === 'None'
              ? 'Non-Manglik'
              : manglik.severity === 'Cancelled'
              ? 'Cancelled'
              : manglik.severity === 'Mild'
              ? 'Mild (Anshik)'
              : 'Prabal Manglik'}
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200">
          {manglik.severity === 'None' || manglik.severity === 'Cancelled' ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          ) : (
            <Flame className="w-4 h-4 text-rose-600" />
          )}
        </div>
      </div>

      {/* Sade Sati Badge */}
      <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
            Shani Sade Sati
          </div>
          <div className="text-xs font-bold text-slate-900 mt-0.5 truncate max-w-[110px]">
            {sadeSati.isUnderSadeSati ? 'Active Phase' : 'Inactive'}
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200">
          <Activity
            className={`w-4 h-4 ${
              sadeSati.isUnderSadeSati ? 'text-purple-600' : 'text-emerald-600'
            }`}
          />
        </div>
      </div>

      {/* Kaal Sarp Status */}
      <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
            Kaal Sarp Yoga
          </div>
          <div className="text-xs font-bold text-slate-900 mt-0.5">
            Clear / Unafflicted
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      {/* Vedic Yogas Count */}
      <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
            Active Yogas
          </div>
          <div className="text-xs font-bold text-amber-800 mt-0.5">
            {activeYogasCount} Prominent Yogas
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200">
          <Sparkles className="w-4 h-4 text-amber-600" />
        </div>
      </div>
    </div>
  );
};
