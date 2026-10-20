// components/settings/SettingsEphemerisScreen.tsx
import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Layers,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { UserBirthProfile, KundliData } from '../../types/astronomy';
import { LocationInput } from '../places/LocationInput';
import { DailyEphemerisTable } from '../calendar/DailyEphemerisTable';

interface SettingsEphemerisScreenProps {
  profile: UserBirthProfile;
  calendarData: KundliData;
  onUpdateProfile: (profile: UserBirthProfile) => void;
}

const AYANAMSA_OPTIONS = [
  { id: 'Lahiri', name: 'Lahiri (Chitrapaksha)', desc: 'Official Indian Government standard (base 23° 51\' 25.53" at J2000.0)' },
  { id: 'KP', name: 'Krishnamurti (KP)', desc: 'Used for KP stellar & sub-lord astrology' },
  { id: 'Raman', name: 'B.V. Raman', desc: 'Classical South Indian baseline' },
  { id: 'Tropical', name: 'Sayana (Tropical)', desc: 'Western geometric equinox (0° Ayanamsa)' },
];

export const SettingsEphemerisScreen: React.FC<SettingsEphemerisScreenProps> = ({
  profile,
  calendarData,
  onUpdateProfile,
}) => {
  const [selectedAyanamsa, setSelectedAyanamsa] = useState<string>('Lahiri');
  const [monthSystem, setMonthSystem] = useState<'Purnimanta' | 'Amanta'>('Purnimanta');

  return (
    <div className="space-y-4 pb-20 sm:pb-24 animate-in fade-in duration-150">      {/* 1. Daily Planetary Ephemeris at Sunrise */}
      <div className="rounded-2xl border border-[#e6d5b8] bg-[#fff8f4] p-4 sm:p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-[#e6d5b8] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#9c1b1b] to-[#790009] text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#1e1b18]">
                Daily Sunrise Planetary Ephemeris (গ্রহ অবস্থান)
              </h2>
              <p className="text-xs text-[#59413e]">
                Calculated at 06:00 AM Local Sunrise for {profile.place.split(',')[0]}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#59413e]">
            Ayanamsa: <strong className="text-[#9c1b1b] font-mono">{calendarData.panchang.ayanamsa.formatted}</strong>
          </span>
        </div>

        <DailyEphemerisTable
          planets={calendarData.planets}
          ayanamsaStr={calendarData.panchang.ayanamsa.formatted}
        />
      </div>

      {/* 2. Location & Geographic Reference Configuration */}
      <div className="rounded-2xl border border-[#e6d5b8] bg-[#fff8f4] p-4 sm:p-5 shadow-card space-y-3">
        <div className="flex items-center gap-2 border-b border-[#e6d5b8] pb-2.5">
          <MapPin className="w-5 h-5 text-[#9c1b1b]" />
          <h3 className="font-serif text-base font-bold text-[#1e1b18]">
            Observation Coordinates (Google Places & GPS)
          </h3>
        </div>

        <LocationInput
          value={profile.place}
          latitude={profile.lat}
          longitude={profile.lng}
          timezone={profile.timezone}
          onChange={(loc) => {
            onUpdateProfile({
              ...profile,
              place: loc.place,
              lat: loc.lat,
              lng: loc.lng,
              timezone: loc.timezone,
            });
          }}
        />
      </div>

      {/* 3. Ayanamsa & Calculation Mode Selector */}
      <div className="rounded-2xl border border-[#e6d5b8] bg-[#fff8f4] p-4 sm:p-5 shadow-card space-y-3">
        <div className="flex items-center gap-2 border-b border-[#e6d5b8] pb-2.5">
          <Compass className="w-5 h-5 text-[#d97706]" />
          <h3 className="font-serif text-base font-bold text-[#1e1b18]">
            Ayanamsa System & Lunar Month Standards
          </h3>
        </div>

        {/* Ayanamsa radio cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {AYANAMSA_OPTIONS.map((opt) => {
            const isSelected = selectedAyanamsa === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedAyanamsa(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#d97706] bg-[#fef3c7] ring-1 ring-[#d97706] shadow-xs'
                    : 'border-[#e6d5b8] bg-white hover:bg-[#faf2ed]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1e1b18]">{opt.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#d97706]" />}
                </div>
                <p className="text-[11px] text-[#59413e] mt-0.5">{opt.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Month System Toggle */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-[#1e1b18]">Lunar Month Tradition (মাস পদ্ধতি)</div>
            <div className="text-[11px] text-[#59413e]">Purnimanta (North India) vs Amanta (South/West India)</div>
          </div>
          <div className="flex rounded-xl border border-[#e6d5b8] bg-white p-0.5 text-xs font-bold">
            <button
              onClick={() => setMonthSystem('Purnimanta')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                monthSystem === 'Purnimanta' ? 'bg-[#9c1b1b] text-white shadow-xs' : 'text-[#59413e] hover:text-[#1e1b18]'
              }`}
            >
              Purnimanta (পূর্ণিমান্ত)
            </button>
            <button
              onClick={() => setMonthSystem('Amanta')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                monthSystem === 'Amanta' ? 'bg-[#9c1b1b] text-white shadow-xs' : 'text-[#59413e] hover:text-[#1e1b18]'
              }`}
            >
              Amanta (অমান্ত)
            </button>
          </div>
        </div>
      </div>

      {/* 4. Astronomical Engine & Standards Info */}
      <div className="rounded-2xl border border-[#e6d5b8] bg-[#fff8f4] p-4 sm:p-5 shadow-card space-y-3">
        <div className="flex items-center gap-2 border-b border-[#e6d5b8] pb-2.5">
          <BookOpen className="w-5 h-5 text-[#9c1b1b]" />
          <h3 className="font-serif text-base font-bold text-[#1e1b18]">
            About SuryaSiddha Astronomical Engine
          </h3>
        </div>

        <div className="space-y-2 text-xs text-[#59413e] leading-relaxed font-sans">
          <p>
            <strong className="text-[#1e1b18]">SuryaSiddha</strong> delivers Swiss Ephemeris (`sweph`) astronomical precision for Vedic calendar calculations. Planetary longitudes are aligned with the official Indian Government standard (Lahiri Ayanamsa at J2000.0).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-[#fef3c7] border border-[#d97706]/30">
              <div className="font-bold text-[#904d00]">Arcsecond Precision</div>
              <div className="text-[11px] text-[#59413e]">Nirayana coordinates for all 9 Grahas & Ascendant</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#faf2ed] border border-[#e6d5b8]">
              <div className="font-bold text-[#1e1b18]">Sunrise Epoch</div>
              <div className="text-[11px] text-[#59413e]">Continuous Soli-lunar relative angular distances</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#dcfce7] border border-emerald-300">
              <div className="font-bold text-[#15803d]">Progressive Web App</div>
              <div className="text-[11px] text-[#59413e]">Offline-ready cached ephemeris tables</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Privacy Policy & Data Safety (Google Play Policy Compliance) */}
      <div className="rounded-2xl border border-[#e6d5b8] bg-[#fff8f4] p-4 sm:p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-[#e6d5b8] pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#15803d]" />
            <h3 className="font-serif text-base font-bold text-[#1e1b18]">
              Privacy, Security & Data Safety
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full border border-emerald-300">
            Google Play Verified
          </span>
        </div>

        <p className="text-xs text-[#59413e] leading-relaxed font-sans">
          We treat your astrological data with strict confidentiality. Location coordinates are used solely in real-time to compute local sunrise and astronomical panchang. We never sell your personal records.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <a
            href="https://kuthiyengpham.in/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e1b18] text-[#fef3c7] hover:bg-black text-xs font-bold transition shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>Read Privacy Policy</span>
            <ExternalLink className="w-3 h-3 text-[#e6d5b8]" />
          </a>

          <a
            href="https://kuthiyengpham.in/delete-account"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#fee2e2] text-[#9c1b1b] border border-rose-300 hover:bg-[#ffdad6] text-xs font-bold transition"
          >
            <span>Delete Account & Data</span>
            <ExternalLink className="w-3 h-3 text-[#9c1b1b]" />
          </a>
        </div>

        <div className="text-[11px] text-[#59413e] border-t border-[#e6d5b8] pt-2 flex flex-wrap items-center justify-between gap-2 font-sans">
          <span>Publisher: <strong className="text-[#1e1b18]">NexGen InfoLab</strong> (ID: 6187819673998470854)</span>
          <span>Contact: <a href="mailto:ccare@kuthiyengpham.in" className="text-[#904d00] font-mono underline">ccare@kuthiyengpham.in</a></span>
        </div>
      </div>
    </div>
  );
};
