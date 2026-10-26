'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Lock,
  Mail,
  Phone,
  Check,
  Sparkles,
  Info,
  LogOut,
  UserPlus
} from 'lucide-react';

interface InAppAccountViewProps {
  onBackToHome?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function InAppAccountView({ onBackToHome, onNavigateTab }: InAppAccountViewProps) {
  const [displayName, setDisplayName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [avatarColor, setAvatarColor] = useState('bg-[#c84b31]');
  const [accountMode, setAccountMode] = useState<'guest' | 'profile'>('guest');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const AVATAR_COLORS = [
    'bg-[#c84b31]', // Terracotta
    'bg-[#895200]', // Marigold Ochre
    'bg-[#9e3b2d]', // Earth Clay
    'bg-[#0f766e]', // Loktak Teal
    'bg-[#1e293b]', // Slate
    'bg-[#7e22ce]', // Sacred Violet
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('leipung_user') || localStorage.getItem('kanglei_user_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDisplayName(parsed.name || '');
          setEmailOrPhone(parsed.contact || '');
          setAvatarColor(parsed.color || 'bg-[#c84b31]');
          setAccountMode(parsed.name ? 'profile' : 'guest');
        } catch (e) {}
      }
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const userProfile = {
        name: displayName.trim() || 'Kanglei Community Member',
        contact: emailOrPhone.trim(),
        color: avatarColor,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('leipung_user', JSON.stringify(userProfile));
      localStorage.setItem('kanglei_user_profile', JSON.stringify(userProfile));
      setAccountMode('profile');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleExecuteAccountDeletion = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('leipung_user');
      localStorage.removeItem('kanglei_user_profile');
      localStorage.removeItem('kanglei_saved_charts');
      localStorage.removeItem('kanglei_history');
      localStorage.clear();
      sessionStorage.clear();

      setDisplayName('');
      setEmailOrPhone('');
      setAvatarColor('bg-[#c84b31]');
      setAccountMode('guest');
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      setClearedSuccess(true);
      setTimeout(() => setClearedSuccess(false), 4000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5 text-slate-800 font-sans pb-12">
      
      {/* Top Banner with Kanglei Sacred Rhythm Styling */}
      <div className="bg-gradient-to-br from-[#1a1c1e] via-[#2f2216] to-[#1a1c1e] rounded-3xl p-5 text-white shadow-md space-y-2 border border-amber-500/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c84b31]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
            {accountMode === 'profile' ? 'Active User Profile' : 'Guest Mode • 100% Privacy'}
          </span>
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs text-amber-300/80 hover:text-white font-medium cursor-pointer"
            >
              ← Back to App
            </button>
          )}
        </div>
        <h2 className="text-base sm:text-lg font-bold text-white font-serif">
          User Account, Identity &amp; Privacy Control
        </h2>
        <p className="text-xs text-amber-100/80 leading-relaxed font-sans">
          Manipuri Calendar operates offline-first. Panchang, astrological calculation, and calendar features do not require remote tracking.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile saved successfully to your local device.</span>
        </div>
      )}

      {clearedSuccess && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your account and all associated local data have been completely deleted.</span>
        </div>
      )}

      {/* Profile & Sign Up / Sign In Form */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <User className="w-4 h-4 text-[#c84b31]" />
            <span>{accountMode === 'profile' ? 'Profile Details' : 'Create / Sign In to Profile'}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {accountMode === 'profile' ? 'ID: LOCAL-USER' : 'Optional'}
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Display Name / Community Handle
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Sanatomba Meitei"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Email or Mobile Number (Optional for Cloud Backup)
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="e.g. yourname@example.com or +91 98765 43210"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              Avatar Color
            </label>
            <div className="flex items-center gap-2">
              {AVATAR_COLORS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setAvatarColor(col)}
                  className={`w-7 h-7 rounded-full ${col} transition cursor-pointer border-2 ${
                    avatarColor === col ? 'border-slate-900 scale-110 shadow-sm' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#c84b31] hover:bg-[#a6331b] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
            {accountMode === 'profile' && (
              <button
                type="button"
                onClick={() => {
                  setDisplayName('');
                  setEmailOrPhone('');
                  setAccountMode('guest');
                  localStorage.removeItem('leipung_user');
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Google Play Account Deletion Policy Compliance Card */}
      <section className="bg-white rounded-3xl border border-red-200 p-5 shadow-xs space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
            <Trash2 className="w-4 h-4 text-red-600" />
            <span>Account &amp; Personal Data Deletion</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-mono text-[9px] font-bold">
            Google Play Policy
          </span>
        </div>

        <p className="text-slate-600 leading-relaxed">
          In strict accordance with Google Play Store User Data &amp; Account Deletion policies, you have the absolute right to request permanent deletion of your profile, identity handle, submitted Leipung posts, and local cache.
        </p>

        <div className="bg-red-50/60 rounded-2xl p-3 border border-red-100 space-y-1.5 text-slate-700">
          <div className="font-semibold text-red-950 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>What happens when you delete your account:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
            <li>All local profile identifiers, display names, and contacts are wiped permanently.</li>
            <li>All cached panchang bookmarks and birth chart history are deleted.</li>
            <li>Any public community questions are anonymized or permanently deleted.</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* In-App Deletion Trigger Button */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account &amp; Data (In-App)</span>
          </button>

          {/* Official Web Deletion URL required by Google Play */}
          <a
            href="https://kuthiyengpham.in/delete-account"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition flex items-center justify-center gap-1.5"
          >
            <span>Web Account Deletion Portal</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </section>

      {/* Data Privacy & Permissions Card */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Data Privacy &amp; Store Compliance</span>
        </div>

        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Offline Calculation Safety:</strong> Ephemeris calculations are done on your device without transmitting your location or birth details.</li>
          <li><strong>Zero Mandatory Registration:</strong> You can use all calendar, panchang, and horoscope features freely without creating an account.</li>
          <li><strong>Encrypted Transport:</strong> All communication with community APIs is secured with HTTPS TLS 1.3 encryption.</li>
        </ul>

        <div className="pt-2 flex flex-wrap gap-3">
          <a
            href="https://kuthiyengpham.in/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c84b31] hover:underline font-semibold flex items-center gap-1 text-xs"
          >
            <span>Privacy Policy</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://kuthiyengpham.in/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c84b31] hover:underline font-semibold flex items-center gap-1 text-xs"
          >
            <span>Terms of Service</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://kuthiyengpham.in/delete-account"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-700 hover:underline font-semibold flex items-center gap-1 text-xs"
          >
            <span>Delete Account Page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* Developer & Legal Details */}
      <div className="text-center text-[11px] text-slate-400 space-y-1 pt-2">
        <p className="font-semibold text-slate-600">
          Manipuri Calendar KangleiAstro • NexGen InfoLab
        </p>
        <p>Developer: NexGen InfoLab (Oinam Robert Singh) • ID: 6187819673998470854</p>
        <p>Imphal East, Manipur, India (IN) • ccare@kuthiyengpham.in</p>
      </div>

      {/* Explicit Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-red-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Permanently Delete Account?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This will immediately delete your saved profile, clear all cached bookmarks, and purge all personal information from this device.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Type <strong>DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 text-center font-bold tracking-widest focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                onClick={handleExecuteAccountDeletion}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
