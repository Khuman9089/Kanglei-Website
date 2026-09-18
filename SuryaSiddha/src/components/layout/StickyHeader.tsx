import React, { useState } from 'react';
import { Sun, MapPin, ChevronDown, Bell } from 'lucide-react';
import { UserBirthProfile, PanchangData } from '../../types/astronomy';
import { LocationInput } from '../places/LocationInput';

interface StickyHeaderProps {
  profile: UserBirthProfile;
  panchang: PanchangData;
  onLocationChange: (loc: { place: string; lat: number; lng: number; timezone: number }) => void;
  onOpenKundliTab?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  profile,
  panchang,
  onLocationChange,
  onOpenNotifications,
  unreadNotificationsCount = 0,
}) => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-3.5 py-2.5 sm:px-6 shadow-xs select-none">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
        {/* Brand Mark */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#EA580C] to-[#C2410C] text-white shadow-md shadow-orange-700/20 ring-2 ring-orange-200">
            <Sun className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-base sm:text-lg font-black tracking-tight text-[#020617]">
                SuryaSiddha
              </h1>
              <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-black text-[#78350F] border border-amber-300 uppercase tracking-wider">
                VEDIC CALENDAR • 2083
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#334155] line-clamp-1">
              Hindu Astronomical Calendar & Precision Kundli Engine
            </p>
          </div>
        </div>

        {/* Right Actions: Location, Notification Bell & Admin */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Location Chip */}
          <div className="relative">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center gap-1.5 rounded-full border border-indigo-300 bg-indigo-50 px-2.5 sm:px-3 py-1.5 text-xs font-black text-[#1E1B4B] hover:bg-indigo-100 transition shadow-2xs cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5 text-indigo-700 shrink-0 stroke-[2.5]" />
              <span className="truncate max-w-[90px] sm:max-w-[180px]">
                {profile.place.split(',')[0]}
              </span>
              <span className="text-[10px] text-indigo-900 font-mono font-bold hidden sm:inline">
                (UTC {profile.timezone >= 0 ? `+${profile.timezone}` : profile.timezone})
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-indigo-600 shrink-0 stroke-[2.5]" />
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-300 bg-white p-4 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-black text-[#020617]">Set Reference Coordinates</span>
                  <button
                    onClick={() => setIsLocationDropdownOpen(false)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <LocationInput
                  value={profile.place}
                  latitude={profile.lat}
                  longitude={profile.lng}
                  timezone={profile.timezone}
                  onChange={(loc) => {
                    onLocationChange(loc);
                    setIsLocationDropdownOpen(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* Notification Center Button */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              title="Notification Center"
              className="relative p-2 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 transition border border-slate-200 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[9px] font-black text-white ring-2 ring-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
