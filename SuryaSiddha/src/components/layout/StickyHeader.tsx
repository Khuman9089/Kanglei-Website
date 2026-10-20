import React, { useState } from 'react';
import { Sun, MapPin, ChevronDown, Bell, Languages } from 'lucide-react';
import { UserBirthProfile, PanchangData } from '../../types/astronomy';
import { LocationInput } from '../places/LocationInput';

interface StickyHeaderProps {
  profile: UserBirthProfile;
  panchang: PanchangData;
  language: 'bn' | 'en';
  onToggleLanguage: () => void;
  onLocationChange: (loc: { place: string; lat: number; lng: number; timezone: number }) => void;
  onOpenKundliTab?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  profile,
  panchang,
  language,
  onToggleLanguage,
  onLocationChange,
  onOpenNotifications,
  unreadNotificationsCount = 0,
}) => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  return (
    <header className="w-full shrink-0 z-30 border-b border-[#e6d5b8] bg-[#fff8f4]/95 backdrop-blur-md px-3 pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))] pb-2.5 sm:px-6 shadow-sm select-none">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand Mark (Stitch Sacred Emblem) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9c1b1b] to-[#790009] text-amber-100 shadow-md ring-2 ring-[#d97706]/40">
            <Sun className="h-5 w-5 text-[#fbbf24] stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 leading-none">
              <span className="font-bengali font-bold text-[#9c1b1b] text-sm sm:text-base">পঞ্জিকা</span>
              <span className="text-[#d97706] font-extrabold text-[10px]">•</span>
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-[#790009] uppercase">Panjika</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-[#59413e] font-medium tracking-tight mt-0.5 truncate">
              {language === 'bn' ? 'বৈদিক পঞ্জিকা ও জ্যোতিষ বিজ্ঞান' : 'Vedic Almanac & Astrology Engine'}
            </p>
          </div>
        </div>

        {/* Right Actions: Language Switcher, Location & Notification Bell */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher Toggle Pill */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center rounded-full border border-[#e6d5b8] bg-white p-0.5 shadow-xs active:scale-95 transition cursor-pointer"
            title={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
          >
            <span
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold transition-all ${
                language === 'bn'
                  ? 'bg-[#790009] text-white shadow-xs font-bengali'
                  : 'text-[#59413e] hover:text-[#790009]'
              }`}
            >
              বাংলা
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold transition-all ${
                language === 'en'
                  ? 'bg-[#790009] text-white shadow-xs'
                  : 'text-[#59413e] hover:text-[#790009]'
              }`}
            >
              EN
            </span>
          </button>

          {/* Active Location Chip */}
          <div className="relative">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center gap-1 rounded-full border border-[#e6d5b8] bg-white px-2 sm:px-3 py-1 text-xs font-semibold text-[#1e1b18] hover:border-[#d97706] hover:text-[#9c1b1b] transition shadow-xs cursor-pointer active:scale-95"
            >
              <MapPin className="h-3 w-3 text-[#9c1b1b] shrink-0 stroke-[2.5]" />
              <span className="truncate max-w-[70px] sm:max-w-[140px] text-[11px] sm:text-xs">
                {profile.place.split(',')[0]}
              </span>
              <ChevronDown className="h-2.5 w-2.5 text-neutral-400 shrink-0 stroke-[2]" />
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#e6d5b8] bg-[#fff8f4] p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 text-[#1e1b18]">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1e1b18]">
                    {language === 'bn' ? 'ভৌগোলিক স্থান নির্বাচন' : 'Set Reference Coordinates'}
                  </span>
                  <button
                    onClick={() => setIsLocationDropdownOpen(false)}
                    className="text-xs font-bold text-[#59413e] hover:text-[#9c1b1b] cursor-pointer"
                  >
                    ✕
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
              title="Notifications"
              className="relative p-1.5 rounded-full bg-white hover:bg-[#faf2ed] text-[#59413e] hover:text-[#9c1b1b] transition border border-[#e6d5b8] cursor-pointer shadow-xs active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 stroke-[2]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-2 w-2 rounded-full bg-[#d97706] ring-2 ring-white" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
