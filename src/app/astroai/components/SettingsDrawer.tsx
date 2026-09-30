'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Shield,
  Trash2,
  Lock,
  ExternalLink,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  ayanamsa?: string;
  onSelectAyanamsa?: (ayanamsa: string) => void;
  onEditProfile?: () => void;
  onClearData?: () => void;
}

export function SettingsDrawer({
  isOpen,
  onClose,
  userName = 'Seeker',
  birthDate = '1995-08-15',
  birthTime = '10:30',
  birthPlace = 'Delhi, India',
  ayanamsa = 'Lahiri (Chitrapaksha)',
  onSelectAyanamsa = () => {},
  onEditProfile = () => {},
  onClearData = () => {}
}: SettingsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto p-5 animate-in slide-in-from-right duration-300">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Settings &amp; Data Safety</h3>
                <p className="text-[10px] text-slate-400">Jyoti AI Preferences &amp; Controls</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Active Profile</span>
              <button
                onClick={() => {
                  onClose();
                  onEditProfile();
                }}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Edit
              </button>
            </div>
            <h4 className="font-black text-slate-900 text-sm">{userName}</h4>
            <div className="text-xs text-slate-500 space-y-0.5">
              <p>DOB: <strong className="text-slate-700">{birthDate}</strong></p>
              <p>Time: <strong className="text-slate-700">{birthTime || '12:00 PM'}</strong></p>
              <p>Place: <strong className="text-slate-700">{birthPlace || 'Default (Imphal, India)'}</strong></p>
            </div>
          </div>

          {/* Ayanamsa Preference */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider block">
              Vedic Ayanamsha System
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Lahiri', 'Raman', 'KP'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => onSelectAyanamsa(opt)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center ${
                    ayanamsa === opt
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">
              *Lahiri (Chitrapaksha) is standard in Vedic astronomy and official Indian Ephemeris.
            </p>
          </div>

          {/* Data Safety & Privacy Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Google Play Data Safety
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <Link
                href="/astroai/delete-account"
                onClick={onClose}
                className="w-full p-3 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-800 font-bold flex items-center justify-between hover:bg-rose-100/70 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Request Account &amp; Data Deletion</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  if (confirm('Clear local profile and offline storage cache?')) {
                    onClearData();
                  }
                }}
                className="w-full p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-between hover:bg-slate-200 transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-slate-600" />
                  <span>Reset Local Storage &amp; Cache</span>
                </div>
              </button>

              <Link
                href="/privacy-policy"
                onClick={onClose}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 font-medium flex items-center justify-between hover:bg-slate-100 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Privacy Policy &amp; Terms</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Zero Remote Telemetry • Standalone Sandboxed</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Jyoti AI v1.2.0 • Celestial Intelligence Engine
          </p>
        </div>
      </div>
    </div>
  );
}
