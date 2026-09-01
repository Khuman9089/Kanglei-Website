'use client';

import React, { useState } from 'react';
import { X, Smartphone, ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface KundliAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { email?: string; phone?: string; method: 'google' | 'otp' }) => void;
}

export function KundliAuthModal({ isOpen, onClose, onSuccess }: KundliAuthModalProps) {
  const [authMethod, setAuthMethod] = useState<'selection' | 'mobile_input' | 'otp_verify'>('selection');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    // Simulate Google Sign-In
    const dummyGoogleUser = { email: 'user@gmail.com', method: 'google' as const };
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanglei_astro_user', JSON.stringify(dummyGoogleUser));
    }
    onSuccess(dummyGoogleUser);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage('');
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setAuthMethod('otp_verify');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setErrorMessage('Please enter the 4-digit OTP sent to your phone.');
      return;
    }
    setErrorMessage('');
    setIsVerifyingOtp(true);

    setTimeout(() => {
      setIsVerifyingOtp(false);
      const dummyMobileUser = { phone: phoneNumber, method: 'otp' as const };
      if (typeof window !== 'undefined') {
        localStorage.setItem('kanglei_astro_user', JSON.stringify(dummyMobileUser));
      }
      onSuccess(dummyMobileUser);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#fefce8] via-[#fffbeb] to-[#fef9c3] border-b border-amber-200/60 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#fef08a] border border-[#facc15] flex items-center justify-center mx-auto shadow-xs text-xl">
            📜
          </div>
          <h3 className="font-serif font-black text-xl text-[#b45309]">
            Download Full 50-Page Kundli PDF
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Sign in or create a free account to unlock and download your complete printable horoscope report.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {/* MODE 1: SELECTION */}
          {authMethod === 'selection' && (
            <div className="space-y-3.5">
              {/* Google Sign In */}
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm flex items-center justify-center gap-3 shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google / Gmail</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider absolute">
                  OR
                </span>
              </div>

              {/* Mobile OTP */}
              <button
                onClick={() => setAuthMethod('mobile_input')}
                className="w-full py-3 px-4 rounded-full bg-[#facc15] hover:bg-[#fde047] text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Smartphone className="w-5 h-5 text-slate-900" />
                <span>Continue with Mobile OTP</span>
              </button>
            </div>
          )}

          {/* MODE 2: MOBILE NUMBER INPUT */}
          {authMethod === 'mobile_input' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Enter Your 10-Digit Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl font-bold text-sm text-slate-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:border-amber-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3 px-4 rounded-full bg-[#facc15] hover:bg-[#fde047] text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {isSendingOtp ? 'Sending OTP...' : 'Send OTP Code'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod('selection')}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                ← Back to sign-in options
              </button>
            </form>
          )}

          {/* MODE 3: OTP VERIFICATION */}
          {authMethod === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Enter OTP Code sent to +91 {phoneNumber}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="1 2 3 4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl font-mono text-center text-lg tracking-widest font-black focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="w-full py-3 px-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>{isVerifyingOtp ? 'Verifying & Downloading...' : 'Verify & Download PDF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod('mobile_input')}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                Change mobile number
              </button>
            </form>
          )}

          {/* Security Guarantee Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Secure & Confidential Astrological Report</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default KundliAuthModal;
