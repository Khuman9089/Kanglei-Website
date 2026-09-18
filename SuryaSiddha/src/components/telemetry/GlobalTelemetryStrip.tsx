import React, { useState, useEffect } from 'react';
import { PanchangData, AuspiciousTimes, UserBirthProfile } from '../../types/astronomy';
import { LocationInput } from '../places/LocationInput';
import { PRESET_CHARTS } from '../places/BirthDetailsForm';
import {
  Calendar,
  Clock,
  Moon,
  Sun,
  Sparkles,
  ShieldAlert,
  Compass,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface GlobalTelemetryStripProps {
  profile: UserBirthProfile;
  panchang: PanchangData;
  muhurta: AuspiciousTimes;
  onUpdateProfile: (profile: UserBirthProfile) => void;
}

export const GlobalTelemetryStrip: React.FC<GlobalTelemetryStripProps> = ({
  profile,
  panchang,
  muhurta,
  onUpdateProfile,
}) => {
  const [liveLST, setLiveLST] = useState<string>('');
  const [tempProfile, setTempProfile] = useState<UserBirthProfile>(profile);

  useEffect(() => {
    setTempProfile(profile);
  }, [profile]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getUTCHours() + now.getUTCMinutes() / 60 + profile.lng / 15;
      const normHours = ((hours % 24) + 24) % 24;
      const h = Math.floor(normHours);
      const m = Math.floor((normHours - h) * 60);
      const s = Math.floor(((normHours - h) * 60 - m) * 60);
      setLiveLST(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} LST`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [profile.lng]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(tempProfile);
  };

  const handlePresetSelect = (idx: number) => {
    const p = PRESET_CHARTS[idx];
    if (p) {
      setTempProfile(p.profile);
      onUpdateProfile(p.profile);
    }
  };

  return (
    <div className="bg-white border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Search Bar + Date/Time + Telemetry Bar */}
      <form onSubmit={handleApply} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
        {/* Location / Places Search (5 Cols) */}
        <div className="lg:col-span-4">
          <LocationInput
            value={tempProfile.place}
            latitude={tempProfile.lat}
            longitude={tempProfile.lng}
            timezone={tempProfile.timezone}
            onChange={(loc) => {
              const updated = {
                ...tempProfile,
                place: loc.place,
                lat: loc.lat,
                lng: loc.lng,
                timezone: loc.timezone,
              };
              setTempProfile(updated);
            }}
          />
        </div>

        {/* Date of Birth (2 Cols) */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950/70 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            Date (YYYY-MM-DD)
          </label>
          <input
            type="date"
            value={tempProfile.dob}
            onChange={(e) => setTempProfile({ ...tempProfile, dob: e.target.value })}
            className="w-full bg-white text-slate-900 border border-amber-200/80 rounded-xl px-3 py-2 text-xs font-mono font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
            required
          />
        </div>

        {/* Time of Birth (2 Cols) */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950/70 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Time (HH:MM:SS)
          </label>
          <input
            type="time"
            step="1"
            value={tempProfile.tob}
            onChange={(e) => setTempProfile({ ...tempProfile, tob: e.target.value })}
            className="w-full bg-white text-slate-900 border border-amber-200/80 rounded-xl px-3 py-2 text-xs font-mono font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
            required
          />
        </div>

        {/* Benchmark Presets & Action Button (4 Cols) */}
        <div className="lg:col-span-4 flex items-center gap-2">
          <select
            onChange={(e) => handlePresetSelect(Number(e.target.value))}
            className="flex-1 bg-amber-50/80 border border-amber-300 text-amber-950 text-xs rounded-xl px-2.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>
              ⚡ Presets...
            </option>
            {PRESET_CHARTS.map((p, idx) => (
              <option key={p.label} value={idx}>
                {p.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white font-semibold text-xs whitespace-nowrap shadow-sm hover:from-amber-600 hover:to-orange-700 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate</span>
          </button>
        </div>
      </form>

      {/* Quick Panchang Chips Strip */}
      <div className="pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tithi Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80">
            <Moon className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-slate-500 text-[11px]">Tithi:</span>
            <span className="font-bold text-slate-900">{panchang.tithi.name}</span>
            <span className="text-[10px] font-mono font-semibold text-amber-800">
              ({panchang.tithi.completionPercent}%)
            </span>
          </div>

          {/* Vara Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80">
            <Sun className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-slate-500 text-[11px]">Vara:</span>
            <span className="font-bold text-slate-900">{panchang.vara.sanskritName}</span>
          </div>

          {/* Nakshatra Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-slate-500 text-[11px]">Nakshatra:</span>
            <span className="font-bold text-slate-900">
              {panchang.nakshatra.name} (P{panchang.nakshatra.pada})
            </span>
          </div>

          {/* Yoga Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
            <span className="text-slate-500 text-[11px]">Yoga:</span>
            <span className="font-bold text-slate-900">{panchang.yoga.name}</span>
            <span
              className={`text-[9px] px-1 rounded font-bold ${
                panchang.yoga.isAuspicious
                  ? 'bg-emerald-200/80 text-emerald-900'
                  : 'bg-rose-200/80 text-rose-900'
              }`}
            >
              {panchang.yoga.isAuspicious ? 'Shubh' : 'Ashubh'}
            </span>
          </div>

          {/* Karana Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/80">
            <span className="text-slate-500 text-[11px]">Karana:</span>
            <span className="font-bold text-slate-900">{panchang.karana.name}</span>
          </div>

          {/* Rahu Kaal Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-rose-900 text-[11px] font-medium">Rahu Kaal:</span>
            <span className="font-mono font-bold text-rose-950">
              {muhurta.rahuKaal.start} - {muhurta.rahuKaal.end}
            </span>
          </div>
        </div>

        {/* Live Sidereal Clock Telemetry */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs font-bold shadow-xs">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>{liveLST || '00:00:00 LST'}</span>
        </div>
      </div>
    </div>
  );
};
