'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  Trash2,
  Lock,
  Smartphone,
  Check
} from 'lucide-react';

interface InAppAccountViewProps {
  onBackToHome?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function InAppAccountView({ onBackToHome, onNavigateTab }: InAppAccountViewProps) {
  const [displayName, setDisplayName] = useState('');
  const [avatarColor, setAvatarColor] = useState('bg-amber-600');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

  const AVATAR_COLORS = [
    'bg-amber-600',
    'bg-emerald-600',
    'bg-blue-600',
    'bg-purple-600',
    'bg-rose-600',
    'bg-teal-600',
    'bg-indigo-600'
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('leipung_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDisplayName(parsed.name || '');
          setAvatarColor(parsed.color || 'bg-amber-600');
        } catch (e) {}
      }
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const userProfile = {
        name: displayName.trim() || 'Community Member',
        color: avatarColor,
      };
      localStorage.setItem('leipung_user', JSON.stringify(userProfile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleClearLocalData = () => {
    if (confirm('Are you sure you want to clear all locally cached calendar history and saved settings on this device?')) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        setDisplayName('');
        setAvatarColor('bg-amber-600');
        setClearedSuccess(true);
        setTimeout(() => setClearedSuccess(false), 3000);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-5 text-white shadow-md space-y-2 border border-amber-500/20">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] font-bold uppercase">
            100% Account-Free • Privacy First
          </span>
        </div>
        <h2 className="text-lg font-bold text-white">App Settings & Preferences</h2>
        <p className="text-xs text-amber-100/80 leading-relaxed">
          Manipuri Calendar KangleiAstro operates without mandatory user registration or remote account tracking. All Panchang and horoscope calculations are generated for you privately.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Local display name updated successfully.</span>
        </div>
      )}

      {clearedSuccess && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
          <span>All local cache and stored preferences have been cleared.</span>
        </div>
      )}

      {/* Local Display Name Setting */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <User className="w-4 h-4 text-amber-600" />
          <span>Community Handle / Display Name (Optional)</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Used strictly when submitting questions or cultural discussions in the Leipung community feed. Stored locally on this device only.
        </p>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Your Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Sanatomba Meitei"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Avatar Color Tag
            </label>
            <div className="flex items-center gap-2">
              {AVATAR_COLORS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setAvatarColor(col)}
                  className={`w-7 h-7 rounded-full ${col} transition cursor-pointer border-2 ${
                    avatarColor === col ? 'border-slate-900 scale-110' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </form>
      </section>

      {/* Privacy & Permissions Card */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Data Privacy & Device Security</span>
        </div>

        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>No Remote Accounts:</strong> You do not need to log in or provide personal credentials to use calendar, panchang, or horoscope tools.</li>
          <li><strong>Admin-Moderated Community:</strong> Leipung feed submissions are reviewed by human moderators before publishing to protect family-safe cultural discussions.</li>
          <li><strong>Local Storage:</strong> Saved birth charts and calendar bookmark history remain stored inside your browser/app sandbox.</li>
        </ul>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/app/privacy-policy"
            className="text-amber-700 hover:underline font-semibold flex items-center gap-1 text-xs"
          >
            <span>Privacy Policy</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/app/terms-of-service"
            className="text-amber-700 hover:underline font-semibold flex items-center gap-1 text-xs"
          >
            <span>Terms of Service</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* Reset & Clear Cache */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Trash2 className="w-4 h-4 text-red-600" />
          <span>Local Device Storage</span>
        </div>
        <p className="text-slate-600">
          Clear all locally saved settings, chart history, and cached data on this device.
        </p>
        <button
          type="button"
          onClick={handleClearLocalData}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Local Data & Cache</span>
        </button>
      </section>

      {/* Developer & Legal Details */}
      <div className="text-center text-[11px] text-slate-400 space-y-1 pt-2">
        <p className="font-semibold text-slate-600">
          Manipuri Calendar KangleiAstro • NexGen InfoLab
        </p>
        <p>Developer: NexGen InfoLab (Oinam Robert Singh) • ID: 6187819673998470854</p>
        <p>Imphal East, Manipur, India (IN) • ccare@kuthiyengpham.in</p>
      </div>
    </div>
  );
}
