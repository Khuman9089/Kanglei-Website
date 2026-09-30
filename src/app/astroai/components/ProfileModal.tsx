'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Trash2, Info, Sparkles, Check } from 'lucide-react';
import { BirthProfile, ProfileType } from '../types';
import { PlaceAutocompleteInput } from './PlaceAutocompleteInput';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: BirthProfile) => void;
  onDelete?: (id: string) => void;
  initialProfile?: BirthProfile | null;
}

export function ProfileModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialProfile
}: ProfileModalProps) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<BirthProfile['relationship']>('Self');
  const [dateOfBirth, setDateOfBirth] = useState('1995-08-15');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [mode, setMode] = useState<ProfileType>('quick');

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setRelationship(initialProfile.relationship);
      setDateOfBirth(initialProfile.dateOfBirth);
      setTimeOfBirth(initialProfile.timeOfBirth || '');
      setBirthPlace(initialProfile.birthPlace || '');
      setMode(initialProfile.profileType || (initialProfile.timeOfBirth ? 'detailed' : 'quick'));
    } else {
      setName('');
      setRelationship('Partner');
      setDateOfBirth('1996-01-20');
      setTimeOfBirth('');
      setBirthPlace('');
      setMode('quick');
    }
  }, [initialProfile, isOpen]);

  if (!isOpen) return null;

  const hasDetailedInfo = Boolean(dateOfBirth && timeOfBirth && birthPlace.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a name for the profile.');
      return;
    }
    if (!dateOfBirth) {
      alert('Please select a valid date of birth.');
      return;
    }

    const newProfile: BirthProfile = {
      id: initialProfile?.id || `profile_${Date.now()}`,
      name: name.trim(),
      relationship,
      dateOfBirth,
      timeOfBirth: timeOfBirth.trim() || undefined,
      birthPlace: birthPlace.trim() || undefined,
      profileType: hasDetailedInfo ? 'detailed' : 'quick',
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xs transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#172554]">
                {initialProfile ? 'Edit Birth Profile' : 'Add New Profile'}
              </h3>
              <p className="text-[10px] text-[#64748B]">Personalized astrology calculation profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calculation Type Status Badge */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Calculation Output Mode
            </span>
            <span className="text-xs font-black text-[#172554] flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${hasDetailedInfo ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
              {hasDetailedInfo ? 'Detailed Birth Chart' : 'Quick DOB-Based Insight'}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-[#172554]">
            {hasDetailedInfo ? 'Vedic Kundli Ready' : 'Date Only'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#172554] block mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul, Priya, Mom"
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#172554] focus:outline-none focus:border-[#4F46E5] bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#172554] block mb-1">Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#172554] focus:outline-none focus:border-[#4F46E5] bg-white"
            >
              {['Self', 'Partner', 'Child', 'Mother', 'Father', 'Friend', 'Other'].map((rel) => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#172554] block mb-1">
              Date of Birth <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="date"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#172554] focus:outline-none focus:border-[#4F46E5] bg-white"
            />
          </div>

          {/* Optional Detailed Fields */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#172554] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Birth Time &amp; Place (Optional)
              </span>
              <span className="text-[10px] text-[#64748B]">For Detailed Kundli</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-[#475569] block mb-1">Time of Birth</label>
                <input
                  type="time"
                  value={timeOfBirth}
                  onChange={(e) => setTimeOfBirth(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#172554] focus:outline-none focus:border-[#4F46E5] bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#475569] block mb-1">Place of Birth</label>
                <PlaceAutocompleteInput
                  value={birthPlace}
                  onChange={(val) => setBirthPlace(val)}
                  placeholder="City, Country"
                  className="px-3 py-2.5 rounded-xl"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>Birth time and place help calculate your exact Ascendant, Bhavas, and house placements.</span>
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            {initialProfile && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete profile for ${initialProfile.name}?`)) {
                    onDelete(initialProfile.id);
                    onClose();
                  }
                }}
                className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
                title="Delete Profile"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialProfile ? 'Update Profile' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
