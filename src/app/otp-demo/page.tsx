'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle2, AlertCircle, RefreshCw, MessageSquare, Sparkles, ShieldCheck, Database, ArrowRight, Copy, Check, Flame } from 'lucide-react';
import Link from 'next/link';
import { auth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from '@/lib/firebase';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function OtpDemoPage() {
  const [phone, setPhone] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'firebase' | 'supabase'>('firebase');
  
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [providerUsed, setProviderUsed] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: any;
    if (step === 'verify' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    const rawDigits = phone.replace(/\D/g, '');
    if (rawDigits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+91${rawDigits.slice(-10)}`;
    setLoading(true);

    if (mode === 'firebase') {
      try {
        if (!auth) {
          throw new Error('Firebase Auth is not initialized. Check your .env.local file.');
        }

        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
          } catch (e) {}
          window.recaptchaVerifier = null;
        }

        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
          'expired-callback': () => {},
        });

        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
        setConfirmationResult(confirmation);
        setProviderUsed('Firebase Phone Auth (Real SMS Delivered)');
        setMessage(`Real SMS OTP dispatched via Firebase to ${formattedPhone}! Check your phone handset inbox.`);
        setResendTimer(30);
        setStep('verify');
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        if (err.code === 'auth/invalid-app-credential' || err.code === 'auth/billing-not-enabled') {
          setError('Firebase requires a Test Number (+91 99999 99999 with code 123456) when testing locally on the free plan. Try typing 9999999999!');
        } else {
          setError(err.message || 'Firebase Phone Auth error. Check your Firebase Console configuration.');
        }
      }
    } else {
      // Supabase Mode
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Demo Tester',
            email: email || `user_${Date.now()}@example.com`,
            phone,
            whatsappNo: sameAsPhone ? phone : whatsappNo,
            address: 'Imphal, Manipur',
            sex: 'Male',
            password: 'demo_password_123',
          }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
          setError(data.error || 'Failed to generate OTP.');
          return;
        }

        setGeneratedOtp(data.demoOtpCode || '');
        setProviderUsed(data.providerUsed || 'Supabase Cloud DB');
        setMessage(data.message || 'OTP sent successfully!');
        setResendTimer(30);
        setStep('verify');
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Error communicating with OTP server.');
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (otpCodeInput.length !== 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);

    if (mode === 'firebase' && confirmationResult) {
      try {
        const userCredential = await confirmationResult.confirm(otpCodeInput);
        setLoading(false);
        setMessage(`✅ SUCCESS! Mobile ${userCredential.user.phoneNumber || phone} verified successfully via Firebase!`);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Incorrect 6-digit OTP code. Please try again.');
      }
    } else {
      // Supabase verification
      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            phone,
            whatsappNo: sameAsPhone ? phone : whatsappNo,
            otpCode: otpCodeInput,
          }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
          setError(data.error || 'Verification failed. Incorrect OTP code.');
          return;
        }

        setMessage('✅ SUCCESS! Mobile OTP Verified via Supabase Cloud DB.');
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Verification request failed.');
      }
    }
  };

  const copyOtpToClipboard = () => {
    if (generatedOtp) {
      navigator.clipboard.writeText(generatedOtp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cleanNum = (sameAsPhone ? phone : whatsappNo || phone).replace(/\D/g, '');
  const targetWhatsApp = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum;

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] font-sans pt-6 pb-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      
      {/* Invisible reCAPTCHA container for Firebase */}
      <div id="recaptcha-container"></div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#fef3c7] via-[#fffbeb] to-[#fef08a] p-6 rounded-3xl border border-[#fde68a] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md">
            🔥
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-[#b45309]">
              Firebase & Supabase Mobile OTP Test Lab
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Test real SMS OTP delivery via Firebase or Supabase Cloud DB.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full border border-amber-200 text-xs font-bold text-emerald-700 shadow-xs">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Firebase Project: kuthi-9d77f</span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => { setMode('firebase'); setStep('input'); setError(''); setMessage(''); }}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
            mode === 'firebase'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Firebase Real SMS</span>
        </button>

        <button
          type="button"
          onClick={() => { setMode('supabase'); setStep('input'); setError(''); setMessage(''); }}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
            mode === 'supabase'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase DB Mode</span>
        </button>
      </div>

      {/* Main Testing Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-xl max-w-xl mx-auto space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

        {/* Global Messages */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* STEP 1: MOBILE NUMBER INPUT */}
        {step === 'input' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[#0f172a]">
                  {mode === 'firebase' ? 'Firebase Real SMS OTP' : 'Supabase Cloud DB OTP'}
                </h2>
                <p className="text-xs text-slate-500">
                  {mode === 'firebase' ? 'Sends an actual SMS directly to your phone' : 'Generates 6-digit code stored in Supabase DB'}
                </p>
              </div>
            </div>

            {mode === 'firebase' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-medium text-amber-900 space-y-1">
                <p>💡 <strong>Free Instant Test Number:</strong></p>
                <p>If testing on Firebase free tier without billing setup, enter test number <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">9999999999</strong> and code <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">123456</strong> (added in Firebase Console).</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Phone Number<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-3 bg-slate-100 border border-slate-300 rounded-xl font-bold text-xs text-slate-700">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9862012345"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-mono font-bold focus:border-[#d97706] focus:outline-none bg-[#fefcf6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'firebase' ? 'Send Real SMS via Firebase' : 'Generate Supabase Mobile OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFICATION */}
        {step === 'verify' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="font-serif font-bold text-xl text-[#0f172a]">Verify Mobile OTP Code</h2>
              <p className="text-xs text-slate-600">
                OTP sent to Mobile No: <strong className="text-[#b45309]">+91 {phone}</strong>
              </p>
            </div>

            {/* Generated Code Display Box for Supabase Mode */}
            {mode === 'supabase' && generatedOtp && (
              <div className="bg-[#fef3c7]/80 p-4 rounded-2xl border border-[#fde68a] space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#b45309]">
                  <Sparkles className="w-4 h-4 text-[#d97706]" />
                  <span>Supabase Cloud Stored OTP Code:</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-mono font-black text-[#0f172a] tracking-widest bg-white px-4 py-1.5 rounded-xl border border-[#fde68a] shadow-inner">
                    {generatedOtp}
                  </span>
                  <button
                    onClick={copyOtpToClipboard}
                    className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-[#fde68a] text-slate-700 transition-all cursor-pointer"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="pt-1">
                  <a
                    href={`https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(`Your KuthiYengpham verification code is: ${generatedOtp}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Code on WhatsApp →</span>
                  </a>
                </div>
              </div>
            )}

            {/* OTP Verification Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCodeInput}
                  onChange={(e) => setOtpCodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 482910"
                  className="w-full text-center text-2xl font-mono font-black tracking-[0.5em] py-3 rounded-xl border-2 border-[#d97706] bg-[#fefcf6] text-[#0f172a] focus:outline-none shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCodeInput.length < 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Code via {mode === 'firebase' ? 'Firebase' : 'Supabase'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setStep('input'); setError(''); setMessage(''); }}
                  className="text-[#b45309] font-bold hover:underline cursor-pointer"
                >
                  ← Change Mobile No
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      <div className="text-center">
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#b45309] hover:underline"
        >
          <span>Go to Main Auth Sign-Up Page</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
