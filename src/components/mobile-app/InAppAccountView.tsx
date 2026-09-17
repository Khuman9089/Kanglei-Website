'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  LogIn,
  KeyRound,
  Trash2,
  FileText,
  BookOpen,
  Calendar as CalendarIcon,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface InAppAccountViewProps {
  onBackToHome?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function InAppAccountView({ onBackToHome, onNavigateTab }: InAppAccountViewProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign In form fields
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up form fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpYek, setSignUpYek] = useState('Mangang');
  const [signUpSex, setSignUpSex] = useState('Male');

  // Deletion Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Load user session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClient = localStorage.getItem('active_client_user');
      const storedLeipung = localStorage.getItem('leipung_user');

      if (storedClient) {
        try {
          setCurrentUser(JSON.parse(storedClient));
        } catch (e) {}
      } else if (storedLeipung) {
        try {
          setCurrentUser(JSON.parse(storedLeipung));
        } catch (e) {}
      }
    }
  }, []);

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signInIdentifier.trim() || !signInPassword.trim()) {
      setErrorMsg('Please enter your Phone/Email and Password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: signInIdentifier.trim(),
          password: signInPassword.trim(),
          role: 'CLIENT',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('active_client_user', JSON.stringify(data.user));
          localStorage.setItem('leipung_user', JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            phone: data.user.phone || data.user.whatsappNo,
            email: data.user.email,
            role: data.user.role || 'CLIENT',
          }));
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        }
        setCurrentUser(data.user);
        setSuccessMsg(`Welcome back, ${data.user.name || 'User'}!`);
      } else {
        setErrorMsg(data.error || 'Invalid credentials. Please check your details or create an account.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login for Reviewers
  const handleDemoLogin = () => {
    setSignInIdentifier('demo@kuthiyengpham.in');
    setSignInPassword('demo123');
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signUpName.trim() || !signUpPhone.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpName.trim(),
          phone: signUpPhone.trim(),
          whatsappNo: signUpPhone.trim(),
          email: signUpEmail.trim(),
          password: signUpPassword.trim(),
          sex: signUpSex,
          address: signUpYek ? `Yek/Salai: ${signUpYek}` : '',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('active_client_user', JSON.stringify(data.user));
          localStorage.setItem('leipung_user', JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            phone: data.user.phone,
            email: data.user.email,
            role: 'CLIENT',
          }));
        }
        setCurrentUser(data.user);
        setSuccessMsg('Your account has been created successfully!');
      } else {
        setErrorMsg(data.error || 'Failed to create account. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Log Out
  const handleLogOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('active_client_user');
      localStorage.removeItem('leipung_user');
      localStorage.removeItem('token');
      sessionStorage.clear();
    }
    setCurrentUser(null);
    setSuccessMsg('Logged out successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Handle In-App Account Deletion
  const handleDeleteAccount = async () => {
    if (deleteInput.trim().toUpperCase() !== 'DELETE') {
      alert('Please type DELETE to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          email: currentUser?.email,
          phone: currentUser?.phone || currentUser?.whatsappNo,
          reason: 'User in-app self-service account deletion',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('active_client_user');
          localStorage.removeItem('leipung_user');
          localStorage.removeItem('leipung_eula_agreed');
          localStorage.removeItem('leipung_blocked_users');
          localStorage.removeItem('token');
          sessionStorage.clear();
        }
        alert('Your account and all associated data have been permanently deleted.');
        setCurrentUser(null);
        setShowDeleteConfirm(false);
        if (onBackToHome) onBackToHome();
      } else {
        alert(data.error || 'Failed to delete account. Please try again or contact support.');
      }
    } catch (e) {
      alert('Network error during account deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-900 pb-10 animate-in fade-in duration-200">
      
      {/* Notifications */}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         STATE A: USER IS LOGGED IN (PROFILE & MANAGEMENT)
         ───────────────────────────────────────────────────────────── */}
      {currentUser ? (
        <div className="space-y-4">
          {/* User Profile Card */}
          <div className="bg-gradient-to-br from-[#1e1b18] via-[#2d241e] to-[#1a1815] rounded-3xl p-5 text-white shadow-md space-y-4 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {currentUser.name || 'Active Member'}
                  </h2>
                  <p className="text-xs text-amber-200/90 font-mono mt-0.5">
                    {currentUser.phone || currentUser.email || 'Registered Member'}
                  </p>
                  <span className="inline-block px-2 py-0.5 mt-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                    Verified {currentUser.role === 'ASTROLOGER' ? 'Astrologer' : 'Client Account'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogOut}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs text-slate-200">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-amber-300/80 font-bold block uppercase">Email Address</span>
                <strong className="text-white text-xs block truncate mt-0.5">{currentUser.email || 'Not provided'}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-amber-300/80 font-bold block uppercase">Mobile / WhatsApp</span>
                <strong className="text-white text-xs block font-mono truncate mt-0.5">{currentUser.phone || currentUser.whatsappNo || 'Not provided'}</strong>
              </div>
            </div>
          </div>

          {/* Account Services Quick Shortcuts */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Astrological Services & Records</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('kuthi_eba')}
                className="p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200 text-left transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">Kuthi Eba (জন্ম পত্রিকা)</strong>
                    <span className="text-[11px] text-slate-600 block">Handwritten Janma Patrika</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-700" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('kuthi_yengba')}
                className="p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200 text-left transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">Kuthi Yengba (হরোস্কোপ)</strong>
                    <span className="text-[11px] text-slate-600 block">Astrologer Chart Reading</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-700" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('leipung')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-300 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">Leipung Social Feed</strong>
                    <span className="text-[11px] text-slate-600 block">Community Discussions</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>

              <Link
                href="/delete-account"
                className="p-3 rounded-2xl bg-red-50/60 hover:bg-red-100/80 border border-red-200 text-left transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-red-900 block">Delete Account Portal</strong>
                    <span className="text-[11px] text-red-700 block">Google Play Compliance</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-red-600" />
              </Link>
            </div>
          </div>

          {/* In-App Account Deletion Trigger */}
          <div className="bg-white rounded-3xl border border-red-200 p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-red-900">Delete Account & Erase All Data</h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Permanently purge your account, profile, birth charts, and posts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           STATE B: USER IS NOT LOGGED IN (SIGN IN / SIGN UP TABS)
           ───────────────────────────────────────────────────────────── */
        <div className="space-y-4">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#1e1b18] via-[#2a221b] to-[#12100e] rounded-3xl p-5 text-white shadow-md space-y-2 border border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">
                  Manipuri Calendar KangleiAstro
                </h2>
                <p className="text-xs text-amber-200/90 font-medium">
                  {authMode === 'signin' ? 'Sign in to access your Janma Patrika & Consultations' : 'Create your sacred astrology account'}
                </p>
              </div>
            </div>
          </div>

          {/* Segmented Auth Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-200/80 border border-slate-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'signin'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-amber-600" />
              <span>Sign In (লগ ইন)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>Sign Up (অনৌবা একাউন্ট)</span>
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            {authMode === 'signin' ? (
              /* ── 1. SIGN IN FORM ── */
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Registered Mobile Number or Email *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. 9876543210 or user@example.com"
                      value={signInIdentifier}
                      onChange={(e) => setSignInIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 block">
                      Password *
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to My Account</span>
                    </>
                  )}
                </button>

                {/* Quick Reviewer Demo Fill */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Reviewer Testing Account:</span>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="text-amber-700 font-bold underline hover:text-amber-900 cursor-pointer"
                  >
                    Auto-Fill Demo Credentials
                  </button>
                </div>
              </form>
            ) : (
              /* ── 2. SIGN UP FORM ── */
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Sanatomba Meitei"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Mobile / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        placeholder="user@example.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Yek / Salai (সালাই)
                    </label>
                    <select
                      value={signUpYek}
                      onChange={(e) => setSignUpYek(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Mangang">Mangang (মঙাং)</option>
                      <option value="Luwang">Luwang (লুৱাং)</option>
                      <option value="Khuman">Khuman (খুমন)</option>
                      <option value="Angom">Angom (অঙোম)</option>
                      <option value="Moirang">Moirang (মোইরাং)</option>
                      <option value="Kha Nganba">Kha Nganba (খা-ঙানবা)</option>
                      <option value="Salai Leishangthem">Salai Leishangthem (সালাই লৈশাংথেম)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account (Sign Up)</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Legal Compliance Links */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 space-y-1">
            <p>
              By continuing, you agree to our{' '}
              <Link href="/app/terms-of-service" className="text-amber-800 font-bold underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/app/privacy-policy" className="text-amber-800 font-bold underline">
                Privacy Policy
              </Link>.
            </p>
            <p className="text-[11px] text-slate-500">
              Need account deletion? Visit our{' '}
              <Link href="/delete-account" className="text-red-600 font-semibold underline">
                Account & Data Deletion Portal
              </Link>.
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         DELETE CONFIRMATION MODAL
         ───────────────────────────────────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-red-600">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Confirm Account Deletion</h4>
                <span className="text-[11px] text-red-600 font-medium">Permanent & Irreversible</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete your <strong>Manipuri Calendar KangleiAstro</strong> account? All your personal records, Janma Patrika calculations, and community posts will be erased.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-700">
                Type <strong>DELETE</strong> below to confirm:
              </label>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteInput('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteInput.trim().toUpperCase() !== 'DELETE' || isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
