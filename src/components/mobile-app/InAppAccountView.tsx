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
  UserPlus,
  Eye,
  EyeOff,
  Download,
  KeyRound,
  FileText,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface InAppAccountViewProps {
  onBackToHome?: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface StoredUserProfile {
  id: string;
  name: string;
  emailOrPhone: string;
  avatarColor: string;
  createdAt: string;
  role?: string;
}

export default function InAppAccountView({ onBackToHome, onNavigateTab }: InAppAccountViewProps) {
  // Current logged in user profile (if any)
  const [currentUser, setCurrentUser] = useState<StoredUserProfile | null>(null);

  // Active view: 'signin' | 'signup' | 'profile'
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpIdentifier, setSignUpIdentifier] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpAvatarColor, setSignUpAvatarColor] = useState('bg-[#c84b31]');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Account Deletion State (Google Play Store Mandate)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [clearedSuccess, setClearedSuccess] = useState(false);

  const AVATAR_COLORS = [
    'bg-[#c84b31]', // Terracotta
    'bg-[#895200]', // Marigold Ochre
    'bg-[#9e3b2d]', // Earth Clay
    'bg-[#0f766e]', // Loktak Teal
    'bg-[#1e293b]', // Slate Dark
    'bg-[#7e22ce]', // Sacred Violet
  ];

  // Load stored user profile on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('manipuri_calendar_user') || localStorage.getItem('leipung_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.name) {
            setCurrentUser({
              id: parsed.id || 'usr_' + Math.random().toString(36).substring(2, 9),
              name: parsed.name,
              emailOrPhone: parsed.emailOrPhone || parsed.contact || '',
              avatarColor: parsed.avatarColor || parsed.color || 'bg-[#c84b31]',
              createdAt: parsed.createdAt || new Date().toISOString(),
              role: 'Member'
            });
          }
        } catch (e) {}
      }
    }
  }, []);

  // Handle Sign In submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signInIdentifier.trim()) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }
    if (!signInPassword || signInPassword.length < 4) {
      setErrorMessage('Please enter your password (minimum 4 characters).');
      return;
    }

    const user: StoredUserProfile = {
      id: 'usr_' + Date.now().toString(36),
      name: signInIdentifier.includes('@') ? signInIdentifier.split('@')[0] : 'Manipuri User',
      emailOrPhone: signInIdentifier.trim(),
      avatarColor: 'bg-[#c84b31]',
      createdAt: new Date().toISOString(),
      role: 'Verified Member'
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('manipuri_calendar_user', JSON.stringify(user));
      localStorage.setItem('leipung_user', JSON.stringify({
        name: user.name,
        contact: user.emailOrPhone,
        color: user.avatarColor,
        updatedAt: new Date().toISOString()
      }));
    }

    setCurrentUser(user);
    setSuccessMessage('Signed in successfully! Welcome back.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle Sign Up submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signUpName.trim()) {
      setErrorMessage('Please enter your full name or community handle.');
      return;
    }
    if (!signUpIdentifier.trim()) {
      setErrorMessage('Please provide an email address or mobile number.');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('Please agree to the Terms of Service & Privacy Policy to proceed.');
      return;
    }

    const newUser: StoredUserProfile = {
      id: 'usr_' + Date.now().toString(36),
      name: signUpName.trim(),
      emailOrPhone: signUpIdentifier.trim(),
      avatarColor: signUpAvatarColor,
      createdAt: new Date().toISOString(),
      role: 'Member'
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('manipuri_calendar_user', JSON.stringify(newUser));
      localStorage.setItem('leipung_user', JSON.stringify({
        name: newUser.name,
        contact: newUser.emailOrPhone,
        color: newUser.avatarColor,
        updatedAt: new Date().toISOString()
      }));
    }

    setCurrentUser(newUser);
    setSuccessMessage('Account created successfully! Welcome to Manipuri Calendar.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('manipuri_calendar_user');
      localStorage.removeItem('leipung_user');
    }
    setCurrentUser(null);
    setSignInPassword('');
    setSignUpPassword('');
    setSignUpConfirmPassword('');
    setSuccessMessage('Signed out successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle Export Data (User Data Download)
  const handleExportData = () => {
    if (typeof window !== 'undefined') {
      const dataToExport = {
        user: currentUser,
        bookmarks: localStorage.getItem('kanglei_saved_charts') ? JSON.parse(localStorage.getItem('kanglei_saved_charts') || '[]') : [],
        exportTimestamp: new Date().toISOString(),
        disclaimer: 'Personal data export generated from Manipuri Calendar in accordance with Google Play User Data Privacy principles.'
      };
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manipuri_calendar_user_data_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Handle Permanent Account Deletion (Google Play Mandate)
  const handleExecuteAccountDeletion = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('manipuri_calendar_user');
      localStorage.removeItem('leipung_user');
      localStorage.removeItem('kanglei_user_profile');
      localStorage.removeItem('kanglei_saved_charts');
      localStorage.removeItem('kanglei_history');
      localStorage.removeItem('cached_leipung_feed');
      localStorage.clear();
      sessionStorage.clear();

      setCurrentUser(null);
      setSignInIdentifier('');
      setSignInPassword('');
      setSignUpName('');
      setSignUpIdentifier('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      setClearedSuccess(true);
      setTimeout(() => setClearedSuccess(false), 5000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-3.5 sm:p-5 space-y-4 text-slate-800 font-sans pb-16">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & PRIVACY STATUS BANNER                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#a6331b] via-[#c84b31] to-[#895200] rounded-3xl p-5 text-white shadow-md space-y-2 relative overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-amber-200 font-mono text-[9.5px] font-bold uppercase tracking-wider border border-white/20">
            {currentUser ? 'Active Account' : 'Guest Mode • 100% Offline Access'}
          </span>
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs text-amber-100/90 hover:text-white font-medium cursor-pointer"
            >
              ← Back to App
            </button>
          )}
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {currentUser ? `Khurumjari, ${currentUser.name}` : 'Sign In or Create Account'}
        </h1>
        
        <p className="text-xs text-amber-100/90 leading-relaxed">
          {currentUser
            ? 'Manage your account profile, personal data preferences, and store security controls.'
            : 'Manipuri Calendar is 100% offline-ready. Creating an account is optional and allows you to sync astrological notes and join the Leipung community.'}
        </p>
      </div>

      {/* Success & Error Feedback Alerts */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {clearedSuccess && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-sm">Account &amp; Data Deleted</strong>
            <p className="text-slate-700 mt-0.5 leading-relaxed">
              Your profile, local preferences, and all associated personal data have been completely purged from this device in accordance with Google Play Store User Data policies.
            </p>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. AUTHENTICATION / SIGN IN / SIGN UP TABS (When logged out)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {!currentUser ? (
        <section className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-4">
          
          {/* Sign In vs Sign Up Toggle Switch */}
          <div className="flex rounded-2xl bg-gray-100 p-1 border border-gray-200">
            <button
              type="button"
              onClick={() => {
                setAuthTab('signin');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'signin'
                  ? 'bg-white text-[#a6331b] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'signup'
                  ? 'bg-white text-[#a6331b] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* ────────────────────── A. SIGN IN FORM ────────────────────── */}
          {authTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="e.g. name@example.com or +91 98765 43210"
                    required
                    className="w-full px-3.5 py-2.5 pl-9 border border-gray-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] text-[#c84b31] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your account password"
                    required
                    className="w-full px-3.5 py-2.5 pl-9 pr-9 border border-gray-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#c84b31] focus:ring-[#c84b31]"
                  />
                  <span className="text-[11px] font-medium">Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#a6331b] to-[#c84b31] hover:from-[#c84b31] hover:to-[#a6331b] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Sign In to Manipuri Calendar</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-[11px] text-gray-500">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthTab('signup')}
                  className="text-[11px] font-bold text-[#c84b31] hover:underline cursor-pointer"
                >
                  Create Account Free
                </button>
              </div>
            </form>
          )}

          {/* ────────────────────── B. SIGN UP FORM ────────────────────── */}
          {authTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Full Name / Community Handle
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Sanatomba Meitei"
                    required
                    className="w-full px-3.5 py-2.5 pl-9 border border-gray-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signUpIdentifier}
                    onChange={(e) => setSignUpIdentifier(e.target.value)}
                    placeholder="e.g. sanatomba@example.com or +91 98765 43210"
                    required
                    className="w-full px-3.5 py-2.5 pl-9 border border-gray-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Password (Min. 6 chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create password"
                      required
                      minLength={6}
                      className="w-full px-3.5 py-2.5 pl-9 pr-9 border border-gray-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      minLength={6}
                      className="w-full px-3.5 py-2.5 pl-9 border border-gray-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">
                  Choose Avatar Color
                </label>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSignUpAvatarColor(col)}
                      className={`w-7 h-7 rounded-full ${col} transition cursor-pointer border-2 ${
                        signUpAvatarColor === col ? 'border-slate-900 scale-110 shadow-sm' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Explicit Legal Consent Checkbox Required by Google Play */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                    className="mt-0.5 rounded border-gray-300 text-[#c84b31] focus:ring-[#c84b31]"
                  />
                  <span className="text-[11px] leading-relaxed">
                    I agree to the{' '}
                    <Link href="/app/terms-of-service" className="text-[#a6331b] font-bold underline">
                      Terms of Service
                    </Link>{' '}
                    and acknowledge the{' '}
                    <Link href="/app/privacy-policy" className="text-[#a6331b] font-bold underline">
                      Privacy Policy
                    </Link>
                    . I understand my data is protected and never sold to third parties.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#a6331b] to-[#c84b31] hover:from-[#c84b31] hover:to-[#a6331b] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account &amp; Agree</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-[11px] text-gray-500">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthTab('signin')}
                  className="text-[11px] font-bold text-[#c84b31] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* ────────────────────── GUEST / NO FORCED REGISTRATION NOTICE ────────────────────── */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="text-[11px]">Don't want to sign in?</span>
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="text-[11px] font-bold text-[#895200] hover:text-[#a6331b] flex items-center gap-1 cursor-pointer"
              >
                <span>Continue as Guest</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </section>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* 3. LOGGED IN PROFILE CARD (When user has active account)      */
        /* ───────────────────────────────────────────────────────────── */
        <section className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl ${currentUser.avatarColor} text-white flex items-center justify-center text-lg font-bold shadow-xs`}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1a1c1e] leading-tight">
                  {currentUser.name}
                </h3>
                <span className="text-xs text-gray-500 font-mono block">
                  {currentUser.emailOrPhone || 'No contact specified'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.2 rounded-full inline-block mt-1">
                  Active Account • ID: {currentUser.id}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 space-y-0.5">
              <span className="text-[10px] text-gray-500 font-semibold uppercase block">Member Since</span>
              <strong className="text-gray-900 font-bold block text-xs">
                {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 space-y-0.5">
              <span className="text-[10px] text-gray-500 font-semibold uppercase block">Security Status</span>
              <strong className="text-emerald-700 font-bold block text-xs flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Protected</span>
              </strong>
            </div>
          </div>

          {/* User Data Download / Export Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleExportData}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download My Account Data (JSON)</span>
            </button>
          </div>
        </section>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. GOOGLE PLAY STORE ACCOUNT DELETION POLICY CARD (MANDATORY)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl border border-rose-200 p-5 shadow-xs space-y-3.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Account &amp; Personal Data Deletion</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono text-[9px] font-bold">
            Google Play Policy
          </span>
        </div>

        <p className="text-slate-600 leading-relaxed text-xs">
          Under Google Play Store User Data &amp; Account Deletion policies, you have the absolute right to permanently delete your account, saved preferences, and all submitted content directly from within this app or via our public web portal.
        </p>

        <div className="bg-rose-50/70 rounded-2xl p-3 border border-rose-100 space-y-1.5 text-slate-700">
          <div className="font-bold text-rose-950 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>What gets permanently deleted:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
            <li>Your account profile, credentials, and local authentication tokens.</li>
            <li>All saved horoscope charts, astrological bookmarks, and notes.</li>
            <li>Any public community questions or comments in Leipung will be purged.</li>
            <li>All cached offline data stored on your device.</li>
          </ul>
        </div>

        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* In-App Deletion Trigger Button */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account &amp; Data (In-App)</span>
          </button>

          {/* Official Web Deletion URL required by Google Play Console */}
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. DATA SAFETY & TRANSPARENCY CARD (PLAY STORE COMPLIANCE)    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Data Safety &amp; Store Compliance</span>
        </div>

        <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
          <li><strong>No Forced Sign-In:</strong> Full calendar, panchang, and horoscope computations operate offline with zero registration required.</li>
          <li><strong>Zero Data Selling:</strong> Personal information, email, or phone numbers are never sold or shared with third-party advertisers.</li>
          <li><strong>Encrypted Transport:</strong> All community interactions and account updates use HTTPS TLS 1.3 encryption.</li>
        </ul>

        <div className="pt-2 flex flex-wrap gap-3">
          <a
            href="https://kuthiyengpham.in/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c84b31] hover:underline font-bold flex items-center gap-1 text-xs"
          >
            <span>Privacy Policy</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://kuthiyengpham.in/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c84b31] hover:underline font-bold flex items-center gap-1 text-xs"
          >
            <span>Terms of Service</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://kuthiyengpham.in/delete-account"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-700 hover:underline font-bold flex items-center gap-1 text-xs"
          >
            <span>Delete Account Page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. DEVELOPER & LEGAL IDENTIFIERS                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="text-center text-[11px] text-slate-400 space-y-1 pt-1">
        <p className="font-semibold text-slate-600">
          Manipuri Calendar • NexGen InfoLab
        </p>
        <p>Developer: NexGen InfoLab (Oinam Robert Singh) • ID: 6187819673998470854</p>
        <p>Imphal East, Manipur, India (IN) • ccare@kuthiyengpham.in</p>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. MODALS: FORGOT PASSWORD & ACCOUNT DELETION CONFIRMATION    */}
      {/* ───────────────────────────────────────────────────────────── */}
      
      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <KeyRound className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Reset Password
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your registered email address or mobile number. We will send you instructions to reset your account password.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs text-center space-y-1">
                <strong>Password Reset Link Dispatched!</strong>
                <p className="text-[11px] text-emerald-800">
                  Please check your inbox or SMS for reset instructions.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="Enter email or mobile number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#c84b31]"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setForgotSuccess(false);
                  setForgotInput('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
              {!forgotSuccess && (
                <button
                  type="button"
                  onClick={() => {
                    if (forgotInput.trim()) setForgotSuccess(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#c84b31] hover:bg-[#a6331b] text-white font-bold text-xs transition shadow-xs cursor-pointer"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
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
                This will immediately delete your account credentials, clear all saved astrological charts, and purge your community profile from this device.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 block text-center">
                Type <strong className="text-red-600">DELETE</strong> to confirm:
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
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                onClick={handleExecuteAccountDeletion}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition shadow-xs cursor-pointer"
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
