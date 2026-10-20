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
      <div className="rounded-2xl border border-[#e6d5b8] bg-[#fff8f4] p-3.5 sm:p-4 shadow-card flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#9c1b1b]" />
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#1e1b18]">
              Dynamic Muhurta & Choghadiya Matrix
            </h2>
          </div>
          <p className="text-xs text-[#59413e] mt-0.5">
            Sunrise <strong className="text-[#1e1b18]">{calendarData.panchang.sunrise}</strong> • Sunset <strong className="text-[#1e1b18]">{calendarData.panchang.sunset}</strong> at {profile.place.split(',')[0]}
          </p>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevDay}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e6d5b8] bg-white text-[#1e1b18] hover:bg-[#faf2ed] active:scale-95 shadow-xs cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleToday}
            className="rounded-lg border border-[#e6d5b8] bg-[#faf2ed] px-2.5 py-1 text-xs font-bold text-[#1e1b18] hover:bg-[#f4ece7] active:scale-95 shadow-xs cursor-pointer"
          >
            Today
          </button>
          <input
            type="date"
            value={currentDate}
            onChange={(e) => e.target.value && onDateChange(e.target.value)}
            className="h-8 rounded-lg border border-[#e6d5b8] bg-white px-2 text-xs font-bold text-[#1e1b18] shadow-xs focus:ring-1 focus:ring-[#d97706]"
          />
          <button
            onClick={handleNextDay}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e6d5b8] bg-white text-[#1e1b18] hover:bg-[#faf2ed] active:scale-95 shadow-xs cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Choghadiya Focus Banner */}
      <div className="rounded-2xl border border-[#fbbf24] bg-gradient-to-r from-[#fef3c7]/90 via-[#fff8f4] to-[#fef3c7]/90 p-4 shadow-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#d97706] to-[#fbbf24] text-white shadow-md">
            <Hourglass className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d97706] text-white px-2 py-0.5 rounded">
                Active Choghadiya Slot
              </span>
              <span className={`text-xs font-bold ${activeChoghadiya.quality === 'Good' ? 'text-[#15803d]' : activeChoghadiya.quality === 'Bad' ? 'text-[#9c1b1b]' : 'text-[#b45309]'}`}>
                {activeChoghadiya.quality} Quality ({activeChoghadiya.nature})
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1e1b18]">
              {activeChoghadiya.name} ({activeChoghadiya.sanskritName})
            </h3>
            <p className="text-xs text-[#59413e]">
              Ruled by <strong className="text-[#1e1b18]">{activeChoghadiya.ruler}</strong> • Window: <strong className="font-mono text-[#1e1b18]">{activeChoghadiya.start} – {activeChoghadiya.end}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#59413e] block">Abhijit Muhurta</span>
            <span className="font-mono text-xs font-bold text-[#15803d]">
              {calendarData.muhurta.abhijitMuhurta.start} – {calendarData.muhurta.abhijitMuhurta.end}
            </span>
          </div>
        </div>
      </div>

      {/* Complete Muhurta Timeline */}
      <div className="rounded-2xl border border-[#e6d5b8] bg-[#fff8f4] p-4 sm:p-5 shadow-card">
        <div className="mb-3.5 flex items-center gap-2 border-b border-[#e6d5b8] pb-2.5">
          <ShieldCheck className="w-5 h-5 text-[#15803d]" />
          <h3 className="font-serif font-bold text-base text-[#1e1b18]">
            Auspicious & Inauspicious Muhurta Windows (শুভ ও অশুভ কাল)
          </h3>
        </div>
        <MuhurtaTimeline muhurta={calendarData.muhurta} />
      </div>

      {/* Complete 16-Segment Choghadiya Suite */}
      <div className="rounded-2xl border border-[#e6d5b8] bg-[#fff8f4] p-4 sm:p-5 shadow-card">
        <div className="mb-3.5 flex items-center justify-between border-b border-[#e6d5b8] pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d97706]" />
            <h3 className="font-serif font-bold text-base text-[#1e1b18]">
              Complete 16-Segment Choghadiya Suite (দैनिक চৌঘড়িয়া)
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
