'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import { User, Mail, Phone, MapPin, Lock, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, KeyRound, MessageSquare, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function AuthContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>(tabParam === 'signup' ? 'signup' : 'login');

  useEffect(() => {
    if (tabParam === 'signup') {
      setActiveTab('signup');
    } else if (tabParam === 'login') {
      setActiveTab('login');
    }
  }, [tabParam]);
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [address, setAddress] = useState('');
  const [sex, setSex] = useState('Male');
  const [password, setPassword] = useState('');

  // Login State
  const [loginRole, setLoginRole] = useState<'CLIENT' | 'ASTROLOGER'>('CLIENT');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // OTP State
  const [otpInput, setOtpInput] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetStep, setResetStep] = useState<'contact' | 'otp_reset'>('contact');
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetOtpInput, setResetOtpInput] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetDemoOtp, setResetDemoOtp] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleRequestResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetMsg('');
    setResetLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REQUEST_RESET_OTP', identifier: resetIdentifier }),
      });
      const data = await res.json();
      setResetLoading(false);

      if (!res.ok) {
        setResetError(data.error || 'Failed to send OTP.');
        return;
      }

      setResetDemoOtp(data.demoOtpCode);
      setResetStep('otp_reset');
      setResetMsg(`OTP sent to ${resetIdentifier}`);
    } catch (err: any) {
      setResetLoading(false);
      setResetError(err.message || 'Network error');
    }
  };

  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetMsg('');
    setResetLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESET_PASSWORD_WITH_OTP',
          identifier: resetIdentifier,
          otpCode: resetOtpInput,
          newPassword: resetNewPassword,
        }),
      });
      const data = await res.json();
      setResetLoading(false);

      if (!res.ok) {
        setResetError(data.error || 'Password reset failed.');
        return;
      }

      if (typeof window !== 'undefined') {
        const existingUsers = JSON.parse(localStorage.getItem('kanglei_registered_users') || '[]');
        const updated = existingUsers.map((u: any) =>
          u.email.toLowerCase() === resetIdentifier.toLowerCase() || u.phone === resetIdentifier
            ? { ...u, password: resetNewPassword }
            : u
        );
        localStorage.setItem('kanglei_registered_users', JSON.stringify(updated));
      }

      setResetMsg('✅ Password reset successfully! You can now log in with your new password.');
      setTimeout(() => {
        setShowForgotModal(false);
        setResetStep('contact');
        setResetMsg('');
        setActiveTab('login');
      }, 2000);
    } catch (err: any) {
      setResetLoading(false);
      setResetError(err.message || 'Password reset failed');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    if (sameAsPhone) {
      setWhatsappNo(val);
    }
  };

  const handleSamePhoneToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsPhone(checked);
    if (checked) {
      setWhatsappNo(phone);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          whatsappNo: sameAsPhone ? phone : whatsappNo,
          address,
          sex,
          password,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to send OTP');
        return;
      }

      setDemoOtp(data.demoOtpCode);
      setStep('otp');
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Something went wrong');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: otpInput }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid OTP');
        return;
      }

      const sessionUser = {
        name: name || 'Nganba Meitei',
        email: email || 'nganba@example.com',
        phone: phone || '+91 98620 12345',
        whatsappNo: sameAsPhone ? phone : whatsappNo,
        address: address || 'Uripok, Imphal West, Manipur, 795001',
        sex: sex || 'Male',
        role: 'CLIENT',
        memberSince: 'Today',
      };

      if (typeof window !== 'undefined') {
        localStorage.removeItem('kanglei_logged_out');
        localStorage.setItem('kanglei_user', JSON.stringify(sessionUser));

        // Save into local registered users array for persistent client login
        const existingUsers = JSON.parse(localStorage.getItem('kanglei_registered_users') || '[]');
        const updatedUsers = [...existingUsers.filter((u: any) => u.email !== sessionUser.email), sessionUser];
        localStorage.setItem('kanglei_registered_users', JSON.stringify(updatedUsers));

        window.dispatchEvent(new Event('user-login-change'));
      }

      setSuccessMsg('Account verified & signed up successfully! Redirecting to Client Dashboard...');
      setTimeout(() => {
        window.location.href = '/dashboard/client';
      }, 1200);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Verification failed');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword,
          role: loginRole,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid credentials');
        return;
      }

      // Check registered users in localStorage if available
      let foundUser = data.user;
      if (typeof window !== 'undefined' && loginRole === 'CLIENT') {
        const existingUsers = JSON.parse(localStorage.getItem('kanglei_registered_users') || '[]');
        const matched = existingUsers.find((u: any) => u.email.toLowerCase() === loginIdentifier.toLowerCase().trim());
        if (matched) {
          foundUser = matched;
        }
      }

      const sessionUser = {
        name: foundUser?.name || loginIdentifier.split('@')[0] || 'Nganba Meitei',
        email: foundUser?.email || (loginIdentifier.includes('@') ? loginIdentifier : 'nganba@example.com'),
        phone: foundUser?.phone || (!loginIdentifier.includes('@') ? loginIdentifier : '+91 98620 12345'),
        whatsappNo: foundUser?.whatsappNo || (!loginIdentifier.includes('@') ? loginIdentifier : '+91 98620 12345'),
        address: foundUser?.address || 'Uripok, Imphal West, Manipur, 795001',
        sex: foundUser?.sex || 'Male',
        role: loginRole,
        memberSince: foundUser?.memberSince || 'Today',
      };

      if (typeof window !== 'undefined') {
        localStorage.removeItem('kanglei_logged_out');
        localStorage.setItem('kanglei_user', JSON.stringify(sessionUser));

        if (loginRole === 'ASTROLOGER') {
          localStorage.setItem('kanglei_astro_authed', 'true');
        }

        window.dispatchEvent(new Event('user-login-change'));
      }

      setSuccessMsg(`Logged in successfully! Redirecting to ${loginRole === 'ASTROLOGER' ? 'Astrologer' : 'Client'} Dashboard...`);
      setTimeout(() => {
        window.location.href = data.redirectTo || (loginRole === 'ASTROLOGER' ? '/dashboard/astrologer' : '/dashboard/client');
      }, 1200);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-6 sm:pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full flex flex-col justify-center items-center">
        
        {/* Header */}
        <div className="text-center mb-6 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Secure Vedic Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a]">
            {activeTab === 'signup' ? 'Create Your' : 'Sign In To'} <span className="text-[#b45309]">KuthiYengpham Account</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Access saved birth profiles, Kuthi Yengba reports, and consultation history.
          </p>
        </div>

        {/* Tab Selector - Login First, Signup Second */}
        <div className="flex justify-center mb-6 w-full">
          <div className="bg-[#fef3c7] p-1.5 rounded-2xl border border-[#fde68a] inline-flex w-full sm:w-auto gap-1 text-center">
            <button
              onClick={() => { setActiveTab('login'); setStep('form'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 sm:flex-initial px-6 sm:px-8 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#d97706] text-white shadow-md'
                  : 'text-[#78350f] hover:text-[#0f172a]'
              }`}
            >
              Log In (Existing User)
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setStep('form'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 sm:flex-initial px-6 sm:px-8 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-[#d97706] text-white shadow-md'
                  : 'text-[#78350f] hover:text-[#0f172a]'
              }`}
            >
              Sign Up (New User)
            </button>
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGNUP WORKFLOW */}
        {activeTab === 'signup' && (
          <div className="max-w-2xl mx-auto">
            
            {/* STEP 1: FORM */}
            {step === 'form' && (
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#fde68a]/50">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Registration Details</h3>
                    <p className="text-xs text-gray-500">Enter details below to receive your OTP verification code</p>
                  </div>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-5 text-xs font-sans">
                  
                  {/* Name & Sex */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8">
                      <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                        Full Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Please enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                        Sex / Gender<span className="text-red-500">*</span>
                      </label>
                      <select
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Email & Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                        Email Address<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                        Password<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Create secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                        Phone Number<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-[#0f172a] uppercase tracking-wider">
                          WhatsApp Number<span className="text-red-500">*</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sameAsPhone}
                            onChange={handleSamePhoneToggle}
                            className="rounded text-[#d97706] focus:ring-[#d97706]"
                          />
                          <span>Same as Phone</span>
                        </label>
                      </div>
                      <input
                        type="tel"
                        required
                        disabled={sameAsPhone}
                        placeholder="+91 98765 43210"
                        value={sameAsPhone ? phone : whatsappNo}
                        onChange={(e) => setWhatsappNo(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Residential Address */}
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Residential Address<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Please enter street, city, state & pincode"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Send OTP Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#d97706]" />
                    <span>Your contact details remain 100% private & encrypted</span>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: OTP VERIFICATION SCREEN */}
            {step === 'otp' && (
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

                <div className="w-14 h-14 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706] mx-auto mb-4 shadow-xs">
                  <MessageSquare className="w-7 h-7" />
                </div>

                <h3 className="font-serif font-bold text-2xl text-[#0f172a] mb-1">Verify OTP Code</h3>
                <p className="text-xs text-gray-600 mb-4 max-w-sm mx-auto">
                  We have sent a 6-digit OTP to your WhatsApp / Phone number:
                  <span className="font-bold text-[#b45309] block mt-1">{whatsappNo || phone}</span>
                </p>

                {/* Simulated Test Badge */}
                {demoOtp && (
                  <div className="mb-6 inline-flex items-center gap-2 bg-[#fef3c7] px-4 py-2 rounded-xl border border-[#fde68a] text-xs font-bold text-[#b45309]">
                    <Sparkles className="w-4 h-4 text-[#d97706]" />
                    <span>Demo OTP Code: <strong className="text-base text-[#0f172a] font-mono tracking-widest">{demoOtp}</strong></span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="max-w-xs mx-auto space-y-5 font-sans">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 482910"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full text-center text-2xl font-mono font-extrabold tracking-[0.5em] py-3 rounded-xl border-2 border-[#d97706] bg-[#fefcf6] text-[#0f172a] focus:outline-none shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpInput.length < 6}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Complete Sign Up</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      className="hover:underline text-[#b45309] font-medium"
                    >
                      ← Change Details
                    </button>
                    <span>Resend OTP in <strong className="text-[#0f172a]">45s</strong></span>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* LOGIN TAB */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#fde68a]/50">
                <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#0f172a]">Sign In</h3>
                  <p className="text-xs text-gray-500">Access your dashboard, saved Kundlis and consultations</p>
                </div>
              </div>

              {/* Role Toggle: Client vs Astrologer */}
              <div className="mb-5">
                <label className="block font-bold text-[#0f172a] mb-2 uppercase tracking-wider text-xs">
                  I am signing in as
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginRole('CLIENT')}
                    className={`py-3 rounded-xl font-bold text-xs border-2 transition-all flex items-center justify-center gap-2 ${
                      loginRole === 'CLIENT'
                        ? 'border-[#d97706] bg-[#fef3c7] text-[#b45309] shadow-sm'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Client</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole('ASTROLOGER')}
                    className={`py-3 rounded-xl font-bold text-xs border-2 transition-all flex items-center justify-center gap-2 ${
                      loginRole === 'ASTROLOGER'
                        ? 'border-[#d97706] bg-[#fef3c7] text-[#b45309] shadow-sm'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Astrologer</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    {loginRole === 'ASTROLOGER' ? 'Registered Phone Number' : 'Email Address'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={loginRole === 'ASTROLOGER' ? 'e.g. +91 98620 99881' : 'e.g. nganba@example.com'}
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#0f172a] uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetIdentifier(loginIdentifier);
                        setShowForgotModal(true);
                      }}
                      className="text-[11px] text-[#b45309] hover:underline font-bold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Log In to {loginRole === 'ASTROLOGER' ? 'Astrologer' : 'Client'} Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#f3e8d2] shadow-2xl text-left font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0f172a]">Reset Account Password</h3>
                  <p className="text-xs text-gray-500">Verify your contact to set a new password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                ⚠️ {resetError}
              </div>
            )}

            {resetMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {resetMsg}
              </div>
            )}

            {resetStep === 'contact' ? (
              <form onSubmit={handleRequestResetOtp} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Registered Email or Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. nganba@example.com or +91 98620 99881"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-medium focus:border-[#d97706] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg cursor-pointer"
                >
                  {resetLoading ? 'Sending Reset OTP...' : 'Send Password Reset OTP →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmPasswordReset} className="space-y-4 text-xs">
                {resetDemoOtp && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[#78350f] text-xs font-mono font-bold flex items-center justify-between">
                    <span>Reset OTP Verification Code:</span>
                    <strong className="text-sm text-[#b45309] bg-white px-2 py-0.5 rounded border border-amber-300">{resetDemoOtp}</strong>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Enter 6-Digit OTP Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit code"
                    value={resetOtpInput}
                    onChange={(e) => setResetOtpInput(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-center font-mono text-base font-extrabold text-[#b45309] focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Enter New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 4 characters"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-medium focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setResetStep('contact')}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md cursor-pointer"
                  >
                    {resetLoading ? 'Resetting Password...' : 'Save New Password & Log In →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdfa] text-center pt-32 text-sm font-bold text-gray-500">Loading Portal...</div>}>
      <AuthContent />
    </Suspense>
  );
}
