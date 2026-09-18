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
    <div className="space-y-4 pb-20 sm:pb-24 animate-in fade-in duration-150">

      {/* 1. Daily Planetary Ephemeris at Sunrise */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                Daily Sunrise Planetary Ephemeris (ग्रह स्थिति)
              </h2>
              <p className="text-xs text-stone-500">
                Calculated at 06:00 AM Local Sunrise for {profile.place.split(',')[0]}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-stone-600">
            Ayanamsa: <strong className="text-indigo-900 font-mono">{calendarData.panchang.ayanamsa.formatted}</strong>
          </span>
        </div>

        <DailyEphemerisTable
          planets={calendarData.planets}
          ayanamsaStr={calendarData.panchang.ayanamsa.formatted}
        />
      </div>

      {/* 2. Location & Geographic Reference Configuration */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <h3 className="font-serif text-base font-bold text-slate-900">
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
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Compass className="w-5 h-5 text-amber-600" />
          <h3 className="font-serif text-base font-bold text-slate-900">
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
                    ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400 shadow-2xs'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{opt.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">{opt.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Month System Toggle */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-slate-900">Lunar Month Tradition (मास प्रणाली)</div>
            <div className="text-[11px] text-stone-500">Purnimanta (North India) vs Amanta (South/West India)</div>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
            <button
              onClick={() => setMonthSystem('Purnimanta')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                monthSystem === 'Purnimanta' ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FFA133] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Purnimanta (पूर्णिमान्त)
            </button>
            <button
              onClick={() => setMonthSystem('Amanta')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                monthSystem === 'Amanta' ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FFA133] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Amanta (अमान्त)
            </button>
          </div>
        </div>
      </div>

      {/* 4. Astronomical Engine & Standards Info */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <h3 className="font-serif text-base font-bold text-slate-900">
            About SuryaSiddha Astronomical Engine
          </h3>
        </div>

        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            <strong>SuryaSiddha</strong> delivers Swiss Ephemeris (`sweph`) astronomical precision for Vedic calendar calculations. Planetary longitudes are aligned with the official Indian Government standard (Lahiri Ayanamsa at J2000.0).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200">
              <div className="font-bold text-[#EA580C]">Arcsecond Precision</div>
              <div className="text-[11px] text-slate-600">Nirayana coordinates for all 9 Grahas & Ascendant</div>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
              <div className="font-bold text-indigo-900">Sunrise Epoch</div>
              <div className="text-[11px] text-slate-600">Continuous Soli-lunar relative angular distances</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="font-bold text-emerald-900">Progressive Web App</div>
              <div className="text-[11px] text-slate-600">Offline-ready cached ephemeris tables</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Privacy Policy & Data Safety (Google Play Policy Compliance) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif text-base font-bold text-slate-900">
              Privacy, Security & Data Safety
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
            Google Play Verified
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          We treat your astrological data with strict confidentiality. Location coordinates are used solely in real-time to compute local sunrise and astronomical panchang. We never sell your personal records.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <a
            href="https://kuthiyengpham.in/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Read Privacy Policy</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href="https://kuthiyengpham.in/delete-account"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold transition"
          >
            <span>Delete Account & Data</span>
            <ExternalLink className="w-3 h-3 text-rose-400" />
          </a>
        </div>

        <div className="text-[11px] text-stone-500 border-t border-slate-100 pt-2 flex flex-wrap items-center justify-between gap-2">
          <span>Publisher: <strong>NexGen InfoLab</strong> (ID: 6187819673998470854)</span>
          <span>Contact: <a href="mailto:ccare@kuthiyengpham.in" className="text-amber-700 font-mono underline">ccare@kuthiyengpham.in</a></span>
        </div>
      </div>
    </div>
  );
};
