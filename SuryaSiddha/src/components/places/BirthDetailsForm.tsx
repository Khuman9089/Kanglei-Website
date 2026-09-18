import React, { useState } from 'react';
import { User, Calendar, Clock, RefreshCw, Compass } from 'lucide-react';
import { UserBirthProfile } from '../../types/astronomy';
import { LocationInput } from './LocationInput';

interface BirthDetailsFormProps {
  initialProfile: UserBirthProfile;
  onSubmit: (profile: UserBirthProfile) => void;
  onSelectPreset?: (presetProfile: UserBirthProfile) => void;
}

export const PRESET_CHARTS: { label: string; description: string; profile: UserBirthProfile }[] = [
  {
    label: '✨ Current Live Sky (Now)',
    description: 'Real-time planetary transit chart & current Panchang',
    profile: {
      name: 'Current Transit (Gochara)',
      gender: 'Male',
      dob: new Date().toISOString().split('T')[0],
      tob: new Date().toTimeString().split(' ')[0],
      place: 'New Delhi, Delhi, India',
      lat: 28.6139,
      lng: 77.2090,
      timezone: 5.5,
    },
  },
  {
    label: '🧘 Swami Vivekananda',
    description: 'Kolkata, Jan 12, 1863 — Sagittarius Lagna, Grand Saraswati & Raja Yogas',
    profile: {
      name: 'Swami Vivekananda',
      gender: 'Male',
      dob: '1863-01-12',
      tob: '06:33:00',
      place: 'Kolkata, West Bengal, India',
      lat: 22.5726,
      lng: 88.3639,
      timezone: 5.5,
    },
  },
  {
    label: '⚡ Albert Einstein',
    description: 'Ulm, Germany, Mar 14, 1879 — Gemini Lagna, Exalted Mercury & Budhaditya',
    profile: {
      name: 'Albert Einstein',
      gender: 'Male',
      dob: '1879-03-14',
      tob: '11:30:00',
      place: 'Ulm, Germany',
      lat: 48.4011,
      lng: 9.9876,
      timezone: 1.0,
    },
  },
  {
    label: '👑 Raja Harishchandra / Traditional',
    description: 'Ujjain Prime Meridian chart, Pancha Mahapurusha alignments',
    profile: {
      name: 'Vedic Exemplar (Ujjain)',
      gender: 'Male',
      dob: '2000-01-01',
      tob: '12:00:00',
      place: 'Ujjain (Avantika), Madhya Pradesh, India',
      lat: 23.1765,
      lng: 75.7885,
      timezone: 5.5,
    },
  },
];

export const BirthDetailsForm: React.FC<BirthDetailsFormProps> = ({
  initialProfile,
  onSubmit,
  onSelectPreset,
}) => {
  const [profile, setProfile] = useState<UserBirthProfile>(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(profile);
      setIsSubmitting(false);
    }, 200);
  };

  const handlePresetChange = (index: number) => {
    const selected = PRESET_CHARTS[index];
    if (selected) {
      setProfile(selected.profile);
      onSubmit(selected.profile);
      if (onSelectPreset) onSelectPreset(selected.profile);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-amber-200/80 shadow-md shadow-amber-900/5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-amber-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100/80 border border-amber-300/80 text-amber-800">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Birth Data & Astronomical Parameters
            </h3>
            <p className="text-xs text-slate-500">
              Precise Nirayana (Lahiri Ayanamsa) Chart & Panchang Generator
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="w-full sm:w-auto">
          <select
            onChange={(e) => handlePresetChange(Number(e.target.value))}
            className="w-full sm:w-auto bg-amber-50/70 border border-amber-300 text-amber-950 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer font-medium"
            defaultValue=""
          >
            <option value="" disabled>
              ⚡ Load Astrological Benchmark Chart...
            </option>
            {PRESET_CHARTS.map((p, idx) => (
              <option key={p.label} value={idx} className="bg-white text-slate-800">
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950/70 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter name"
              className="w-full bg-white text-slate-800 border border-amber-200/80 rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition-all"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950/70 mb-1.5">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Male', 'Female', 'Other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: g })}
                  className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                    profile.gender === g
                      ? 'bg-amber-600 text-white font-semibold border-amber-600 shadow-sm shadow-amber-600/30'
                      : 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100/60'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950/70 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Date of Birth (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={profile.dob}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
              className="w-full bg-white text-slate-800 border border-amber-200/80 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition-all font-mono"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Time of Birth */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950/70 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Time of Birth (HH:MM:SS)
            </label>
            <input
              type="time"
              step="1"
              value={profile.tob}
              onChange={(e) => setProfile({ ...profile, tob: e.target.value })}
              className="w-full bg-white text-slate-800 border border-amber-200/80 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition-all font-mono"
              required
            />
          </div>

          {/* Location Autocomplete */}
          <div className="md:col-span-2">
            <LocationInput
              value={profile.place}
              latitude={profile.lat}
              longitude={profile.lng}
              timezone={profile.timezone}
              onChange={(loc) =>
                setProfile({
                  ...profile,
                  place: loc.place,
                  lat: loc.lat,
                  lng: loc.lng,
                  timezone: loc.timezone,
                })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm tracking-wide shadow-lg shadow-amber-600/25 active:scale-[0.98] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>Generate Vedic Kundli & Panchang</span>
          </button>
        </div>
      </form>
    </div>
  );
};
