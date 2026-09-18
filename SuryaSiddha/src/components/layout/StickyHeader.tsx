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
    <header className="w-full shrink-0 z-30 border-b border-slate-800 bg-[#0B0F19] px-3.5 py-2.5 sm:px-6 shadow-md select-none">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
        {/* Brand Mark */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#EA580C] to-[#C2410C] text-white shadow-md shadow-orange-700/30 ring-2 ring-orange-500/30">
            <Sun className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-base sm:text-lg font-black tracking-tight text-white">
                SuryaSiddha
              </h1>
              <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-black text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                VEDIC • 2083
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 line-clamp-1">
              Hindu Astronomical Calendar & Kundli Engine
            </p>
          </div>
        </div>

        {/* Right Actions: Location & Notification Bell */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Location Chip */}
          <div className="relative">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/90 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition shadow-sm cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0 stroke-[2.5]" />
              <span className="truncate max-w-[90px] sm:max-w-[180px]">
                {profile.place.split(',')[0]}
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold hidden sm:inline">
                (UTC {profile.timezone >= 0 ? `+${profile.timezone}` : profile.timezone})
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 stroke-[2.5]" />
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 text-white">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-black text-white">Set Reference Coordinates</span>
                  <button
                    onClick={() => setIsLocationDropdownOpen(false)}
                    className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
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
              className="relative p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition border border-slate-700 cursor-pointer shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[9px] font-black text-white ring-2 ring-slate-900">
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
