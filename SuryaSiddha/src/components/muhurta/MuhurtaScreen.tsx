// components/muhurta/MuhurtaScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Hourglass,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { UserBirthProfile, KundliData } from '../../types/astronomy';
import { MuhurtaTimeline } from '../panchang/MuhurtaTimeline';
import { ChoghadiyaTable } from '../panchang/ChoghadiyaTable';

interface MuhurtaScreenProps {
  currentDate: string;
  profile: UserBirthProfile;
  calendarData: KundliData;
  onDateChange: (newDate: string) => void;
}

export const MuhurtaScreen: React.FC<MuhurtaScreenProps> = ({
  currentDate,
  profile,
  calendarData,
  onDateChange,
}) => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    onDateChange(todayStr);
  };

  // Find active Choghadiya
  const activeChoghadiya = useMemo(() => {
    const all = [...calendarData.muhurta.choghadiyaDay, ...calendarData.muhurta.choghadiyaNight];
    return all.find((c) => c.isCurrent) || calendarData.muhurta.choghadiyaDay[0];
  }, [calendarData.muhurta]);

  return (
    <div className="space-y-4 pb-20 sm:pb-24 animate-in fade-in duration-150">
      {/* Date Stepper Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900">
              Dynamic Muhurta & Choghadiya Matrix
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Sunrise <strong>{calendarData.panchang.sunrise}</strong> • Sunset <strong>{calendarData.panchang.sunset}</strong> at {profile.place.split(',')[0]}
          </p>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevDay}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 shadow-2xs cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleToday}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 hover:bg-slate-100 active:scale-95 shadow-2xs cursor-pointer"
          >
            Today
          </button>
          <input
            type="date"
            value={currentDate}
            onChange={(e) => e.target.value && onDateChange(e.target.value)}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800 shadow-2xs focus:ring-1 focus:ring-amber-500"
          />
          <button
            onClick={handleNextDay}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 shadow-2xs cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Choghadiya Focus Banner */}
      <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF6B4A] to-[#FFA133] text-white shadow-md shadow-orange-500/25">
            <Hourglass className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.2 rounded">
                Active Choghadiya Slot
              </span>
              <span className={`text-xs font-black ${activeChoghadiya.quality === 'Good' ? 'text-emerald-800' : activeChoghadiya.quality === 'Bad' ? 'text-rose-800' : 'text-amber-800'}`}>
                {activeChoghadiya.quality} Quality ({activeChoghadiya.nature})
              </span>
            </div>
            <h3 className="font-serif font-black text-lg text-slate-900">
              {activeChoghadiya.name} ({activeChoghadiya.sanskritName})
            </h3>
            <p className="text-xs text-slate-600">
              Ruled by <strong>{activeChoghadiya.ruler}</strong> • Window: <strong className="font-mono text-slate-900">{activeChoghadiya.start} – {activeChoghadiya.end}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Abhijit Muhurta</span>
            <span className="font-mono text-xs font-black text-emerald-800">
              {calendarData.muhurta.abhijitMuhurta.start} – {calendarData.muhurta.abhijitMuhurta.end}
            </span>
          </div>
        </div>
      </div>

      {/* Complete Muhurta Timeline */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm">
        <div className="mb-3.5 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-serif font-bold text-base text-slate-900">
            Auspicious & Inauspicious Muhurta Windows (शुभ व अशुभ काल)
          </h3>
        </div>
        <MuhurtaTimeline muhurta={calendarData.muhurta} />
      </div>

      {/* Complete 16-Segment Choghadiya Suite */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm">
        <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-bold text-base text-slate-900">
              Complete 16-Segment Choghadiya Suite (दैनिक चौघड़िया)
            </h3>
          </div>
        </div>

        <ChoghadiyaTable
          dayChoghadiya={calendarData.muhurta.choghadiyaDay}
          nightChoghadiya={calendarData.muhurta.choghadiyaNight}
        />
      </div>
    </div>
  );
};
