import React from 'react';
import { LocationInput } from '../places/LocationInput';
import { PanchangData, UserBirthProfile } from '../../types/astronomy';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
  Flame,
  Sun,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: string; // YYYY-MM-DD
  profile: UserBirthProfile;
  panchang: PanchangData;
  onDateChange: (newDate: string) => void;
  onLocationChange: (loc: { place: string; lat: number; lng: number; timezone: number }) => void;
  onOpenKundliModal: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  profile,
  panchang,
  onDateChange,
  onLocationChange,
  onOpenKundliModal,
}) => {
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
    onDateChange(new Date().toISOString().split('T')[0]);
  };

  // Format human-friendly display date: e.g. Friday, 18 September 2026
  const dateObj = new Date(currentDate);
  const formattedDisplayDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Row: Location Search + Date Navigation + Create Kundli Button */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Location Search (5 Cols) */}
        <div className="lg:col-span-4">
          <LocationInput
            value={profile.place}
            latitude={profile.lat}
            longitude={profile.lng}
            timezone={profile.timezone}
            onChange={(loc) => onLocationChange(loc)}
          />
        </div>

        {/* Date Navigator (5 Cols) */}
        <div className="lg:col-span-5 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-50/80 p-1 rounded-xl border border-amber-200 shadow-2xs">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-bold text-amber-950 hover:bg-amber-100 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-900 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex-1 min-w-[150px]">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-white text-slate-900 border border-amber-200/90 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
            />
          </div>
        </div>

        {/* Action Button: Create Kundli Modal (3 Cols) */}
        <div className="lg:col-span-3 flex justify-end">
          <button
            onClick={onOpenKundliModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold shadow-md shadow-amber-600/25 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Kundli / Kundali</span>
          </button>
        </div>
      </div>

      {/* Bottom Sub-Bar: Formatted Date & Traditional Samvat Eras */}
      <div className="pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-slate-900 text-sm sm:text-base">
            {formattedDisplayDate}
          </span>
          <span className="text-slate-500 hidden sm:inline">
            ({panchang.vara.sanskritName})
          </span>
        </div>

        {/* Samvat Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Vikram Samvat */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-slate-600 text-[11px] font-medium">Vikram Samvat:</span>
            <span className="font-bold text-slate-900 font-mono">
              {panchang.samvat.vikram}
            </span>
          </div>

          {/* Shaka Samvat */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-slate-600 text-[11px] font-medium">Shaka Samvat:</span>
            <span className="font-bold text-slate-900 font-mono">
              {panchang.samvat.shaka}
            </span>
          </div>

          {/* Season / Ritu */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200">
            <Sun className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-slate-600 text-[11px] font-medium">Ritu:</span>
            <span className="font-bold text-orange-950">
              {panchang.ritu.sanskritName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
