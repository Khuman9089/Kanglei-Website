'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MessageCircle, Phone, Lock, CheckCircle2, XCircle, ShieldCheck, 
  Sparkles, ArrowRight, RefreshCw, QrCode, User,
  Calendar, Sun, Moon, AlertCircle, Clock, ExternalLink, Mail, LogIn, UserPlus
} from 'lucide-react';

export interface AstrologerModalItem {
  id: string;
  name: string;
  avatar: string;
  pricePerMin: number;
  fixedRate?: number;
  whatsappPhone: string;
  specialties?: string[];
}

interface ConsultationBookingModalProps {
  astrologer: AstrologerModalItem | null;
  mode: 'CHAT' | 'CALL';
  isOpen: boolean;
  onClose: () => void;
}

const ISD_CODES = [
  { code: '+91', label: '+91' },
  { code: '+1', label: '+1' },
  { code: '+44', label: '+44' },
  { code: '+971', label: '+971' },
  { code: '+977', label: '+977' },
  { code: '+880', label: '+880' },
  { code: '+61', label: '+61' },
  { code: '+65', label: '+65' },
  { code: '+60', label: '+60' },
];

export default function ConsultationBookingModal({
  astrologer,
  mode,
  isOpen,
  onClose,
}: ConsultationBookingModalProps) {
  // Step 1: Compulsory Sign In / Sign Up (Matching main auth page)
  // Step 2: Date & Shift Selection (Morning or Evening without timings)
  // Step 3: UPI Payment & UTR
  // Step 4: Live Order Status & Meeting Link Tracker
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Auth Tab: 'LOGIN' or 'SIGNUP'
  const [authTab, setAuthTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // User State
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Sign In Form States
  const [loginIsd, setLoginIsd] = useState('+91');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupIsd, setSignupIsd] = useState('+91');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupSex, setSignupSex] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [signupPassword, setSignupPassword] = useState('');

  // Auth Status & Errors
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Scheduling State
  const [scheduledDate, setScheduledDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [shift, setShift] = useState<'Morning' | 'Evening'>('Morning');
  const [selectedDuration, setSelectedDuration] = useState<15 | 30 | 45>(15);

  // Payment State
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdOrderRef, setCreatedOrderRef] = useState<string>('');
  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null);
  const [orderPaymentStatus, setOrderPaymentStatus] = useState<'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED'>('PENDING_VERIFICATION');
  const [meetingLink, setMeetingLink] = useState<string | null>(null);

  // Check login state upon opening
  useEffect(() => {
    if (isOpen) {
      setAuthError('');
      setAuthSuccess('');
      try {
        const savedUserStr = localStorage.getItem('kanglei_user');
        const isAuthed = localStorage.getItem('kanglei_client_authed') === 'true';

        if (savedUserStr && isAuthed) {
          const u = JSON.parse(savedUserStr);
          setCurrentUser(u);
          setStep(2); // If already signed in, proceed directly to Date & Shift
        } else {
          setCurrentUser(null);
          setStep(1); // COMPULSORY Sign In / Sign Up
        }
      } catch (e) {
        setStep(1);
      }
    }
  }, [isOpen]);

  // Poll order status if in Step 4
  useEffect(() => {
    if (step === 4 && createdSessionId) {
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/consultations?sessionId=${createdSessionId}`);
          const data = await res.json();
          if (data.session) {
            setOrderPaymentStatus(data.session.paymentStatus || 'PENDING_VERIFICATION');
            if (data.session.meetingLink) {
              setMeetingLink(data.session.meetingLink);
            }
          }
        } catch (e) {}
      }, 2000);
      return () => clearInterval(pollInterval);
    }
  }, [step, createdSessionId]);

  if (!isOpen || !astrologer) return null;

  // Rate calculation
  const ratePerMin = astrologer.pricePerMin || 35;
  const isFixedRate = Boolean(astrologer.fixedRate && astrologer.fixedRate > 0);
  const totalAmount = isFixedRate ? (astrologer.fixedRate || 499) : (selectedDuration * ratePerMin);

  // Handle Sign In (Connecting to database /api/auth/login)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setAuthError('Please enter your Email or Mobile Number and Password.');
      setAuthLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword.trim(),
          role: 'CLIENT',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Incorrect email/mobile or password.');
      }

      const activeUser = data.user || {
        name: loginIdentifier.split('@')[0],
        email: loginIdentifier.includes('@') ? loginIdentifier.trim() : '',
        phone: !loginIdentifier.includes('@') ? `${loginIsd} ${loginIdentifier.trim()}` : '',
        role: 'CLIENT',
      };

      localStorage.setItem('kanglei_user', JSON.stringify(activeUser));
      localStorage.setItem('kanglei_client_authed', 'true');
      localStorage.removeItem('kanglei_logged_out');
      window.dispatchEvent(new Event('user-login-change'));

      setCurrentUser(activeUser);
      setAuthSuccess('Sign In successful! Proceeding to consultation schedule...');
      setTimeout(() => {
        setStep(2);
      }, 500);
    } catch (err: any) {
      setAuthError(err.message || 'Sign In failed. Please verify credentials or Sign Up.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Sign Up (Connecting to database /api/auth/signup with duplicate check)
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    const rawPhoneDigits = signupPhone.replace(/\D/g, '');
    if (!signupName.trim() || !signupEmail.trim() || !rawPhoneDigits || !signupPassword.trim()) {
      setAuthError('Please fill in all required fields (Name, Email, Mobile, Password).');
      setAuthLoading(false);
      return;
    }

    if (rawPhoneDigits.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      setAuthLoading(false);
      return;
    }

    const fullPhone = `${signupIsd} ${rawPhoneDigits}`;

    try {
      // 1. Check duplicate mobile & email
      const dupRes = await fetch('/api/auth/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail.trim(),
          phone: fullPhone,
          whatsappNo: fullPhone,
        }),
      });
      const dupData = await dupRes.json();
      if (!dupRes.ok) {
        throw new Error(dupData.error || 'An account with this email or mobile number already exists. Please Sign In.');
      }

      // 2. Submit new user registration to database
      const regRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          email: signupEmail.trim().toLowerCase(),
          phone: fullPhone,
          whatsappNo: fullPhone,
          sex: signupSex,
          password: signupPassword.trim(),
          isVerified: true,
        }),
      });

      const regData = await regRes.json();
      if (!regRes.ok) {
        throw new Error(regData.error || 'Registration failed. Please try again.');
      }

      const newUser = regData.user || {
        name: signupName.trim(),
        email: signupEmail.trim().toLowerCase(),
        phone: fullPhone,
        whatsappNo: fullPhone,
        sex: signupSex,
        role: 'CLIENT',
      };

      localStorage.setItem('kanglei_user', JSON.stringify(newUser));
      localStorage.setItem('kanglei_client_authed', 'true');
      localStorage.removeItem('kanglei_logged_out');
      window.dispatchEvent(new Event('user-login-change'));

      setCurrentUser(newUser);
      setAuthSuccess('Account registered successfully! Proceeding to consultation schedule...');
      setTimeout(() => {
        setStep(2);
      }, 500);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Payment & Booking Submission
  const handleCompleteBookingAndPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    const orderRef = `CONS-${Math.floor(100000 + Math.random() * 900000)}`;
    const clientPhone = currentUser?.phone || currentUser?.whatsappNo || `${signupIsd} ${signupPhone.replace(/\D/g, '')}` || '+91 98620 12345';

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_BOOKING',
          orderRef: orderRef,
          mode: mode,
          callType: mode === 'CALL' ? 'VIDEO' : 'AUDIO',
          clientName: currentUser?.name || signupName || 'Verified Client',
          clientPhone: clientPhone,
          astrologerId: astrologer.id,
          astrologerName: astrologer.name,
          astrologerAvatar: astrologer.avatar,
          astrologerPhone: astrologer.whatsappPhone,
          durationMinutes: selectedDuration,
          ratePerMin: ratePerMin,
          totalFee: totalAmount,
          scheduledDate: scheduledDate,
          shift: shift, // 'Morning' | 'Evening' without timings
          paymentUtr: utrNumber.trim() || `UPI-${Math.floor(1000000000 + Math.random() * 900000000)}`,
          paymentStatus: 'PENDING_VERIFICATION',
          status: 'PENDING_VERIFICATION',
        }),
      });

      const data = await res.json();
      if (data.session) {
        setCreatedSessionId(data.session.id);
        setCreatedOrderRef(data.session.orderRef || orderRef);
        setMeetingLink(data.session.meetingLink || `/consultation?sessionId=${data.session.id}&role=client`);
      } else {
        setCreatedOrderRef(orderRef);
      }

      setStep(4);
    } catch (err) {
      console.error('Order creation error:', err);
      setCreatedOrderRef(orderRef);
      setStep(4);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm text-[#0f172a] font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-[#f3e8d2] shadow-2xl overflow-hidden text-left relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#0b132b] p-5 text-white flex items-center justify-between border-b border-[#3a506b]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#fbbf24] p-0.5 shrink-0 shadow-md">
              <img src={astrologer.avatar} alt={astrologer.name} className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#fbbf24] block">
                {mode === 'CHAT' ? '💬 Live Chat Consultation' : '📞 Live Voice/Video Call'}
              </span>
              <h3 className="font-serif font-bold text-lg text-white leading-tight">
                {astrologer.name}
              </h3>
              <p className="text-[11px] text-gray-300 font-mono">
                {isFixedRate ? `₹${astrologer.fixedRate} Fixed Fee` : `₹${ratePerMin}/min · 1-on-1 Consultation`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Steps Bar */}
        <div className="bg-[#faf8f5] px-4 py-2.5 border-b border-[#f3e8d2] flex items-center justify-between text-[10px] sm:text-[11px] font-bold">
          <span className={step >= 1 ? 'text-[#b45309]' : 'text-gray-400'}>1. Sign In / Sign Up</span>
          <span className="text-gray-300">→</span>
          <span className={step >= 2 ? 'text-[#b45309]' : 'text-gray-400'}>2. Date & Shift</span>
          <span className="text-gray-300">→</span>
          <span className={step >= 3 ? 'text-[#b45309]' : 'text-gray-400'}>3. Payment</span>
          <span className="text-gray-300">→</span>
          <span className={step >= 4 ? 'text-emerald-600' : 'text-gray-400'}>4. Order Status</span>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">

          {/* STEP 1: COMPULSORY SIGN IN OR SIGN UP (MATCHING MAIN AUTH PAGE) */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b45309] block">
                  ✦ Compulsory Client Authentication
                </span>
                <h4 className="font-serif font-bold text-xl text-[#0f172a]">
                  Sign In or Create Account to Continue
                </h4>
                <p className="text-xs text-gray-500">
                  Please authenticate with your credentials to proceed with verified consultation booking.
                </p>
              </div>

              {/* Toggle Tabs: Sign In vs Sign Up (Styled like main auth page) */}
              <div className="flex bg-[#faf8f5] p-1 rounded-2xl border border-[#f3e8d2]">
                <button
                  type="button"
                  onClick={() => { setAuthTab('LOGIN'); setAuthError(''); }}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authTab === 'LOGIN'
                      ? 'bg-white text-[#b45309] shadow-xs font-extrabold border border-amber-200'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthTab('SIGNUP'); setAuthError(''); }}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authTab === 'SIGNUP'
                      ? 'bg-white text-[#b45309] shadow-xs font-extrabold border border-amber-200'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up (New Account)</span>
                </button>
              </div>

              {/* Status & Error Messages */}
              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  ⚠️ {authError}
                </div>
              )}
              {authSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  ✅ {authSuccess}
                </div>
              )}

              {/* TAB A: SIGN IN FORM */}
              {authTab === 'LOGIN' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Email Address or Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="name@example.com or 9862012345"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#c69214]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Account Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#c69214]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:opacity-95 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {authLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>Sign In & Continue Booking →</span>
                  </button>

                  <div className="text-center text-xs text-gray-500 pt-1">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthTab('SIGNUP')}
                      className="text-[#b45309] font-bold hover:underline cursor-pointer"
                    >
                      Sign Up here
                    </button>
                  </div>
                </form>
              )}

              {/* TAB B: SIGN UP FORM (MATCHING MAIN SIGNUP FORM) */}
              {authTab === 'SIGNUP' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanatomba Meitei"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#c69214]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#c69214]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Mobile Number (10 Digits) *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={signupIsd}
                        onChange={(e) => setSignupIsd(e.target.value)}
                        className="px-2.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none"
                      >
                        {ISD_CODES.map((item) => (
                          <option key={item.code} value={item.code}>{item.label}</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        placeholder="9862012345"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs font-bold focus:outline-none focus:border-[#c69214]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Gender *</label>
                      <select
                        value={signupSex}
                        onChange={(e) => setSignupSex(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Create Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#c69214]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:opacity-95 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {authLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>Create Account & Continue Booking →</span>
                  </button>

                  <div className="text-center text-xs text-gray-500 pt-1">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthTab('LOGIN')}
                      className="text-[#b45309] font-bold hover:underline cursor-pointer"
                    >
                      Sign In here
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: DATE & SHIFT (MORNING OR EVENING) SELECTION */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Authenticated User Status Header */}
              {currentUser && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      {currentUser.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <span className="font-bold text-emerald-950 block">{currentUser.name}</span>
                      <span className="text-[10px] text-emerald-700">{currentUser.phone || currentUser.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('kanglei_client_authed');
                      setCurrentUser(null);
                      setStep(1);
                    }}
                    className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              )}

              <div className="text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b45309] block">
                  ✦ Step 2: Schedule Selection
                </span>
                <h4 className="font-serif font-bold text-xl text-[#0f172a]">
                  Choose Date & Shift
                </h4>
                <p className="text-xs text-gray-500">
                  Select your preferred consultation date and shift with {astrologer.name}.
                </p>
              </div>

              {/* Consultation Date Picker */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#f3e8d2] space-y-3">
                <label className="block text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#b45309]" />
                  <span>Select Consultation Date *</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduledDate(new Date().toISOString().split('T')[0])}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      scheduledDate === new Date().toISOString().split('T')[0]
                        ? 'bg-[#fef3c7] border-[#d97706] text-[#b45309]'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Today ({new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tmrw = new Date();
                      tmrw.setDate(tmrw.getDate() + 1);
                      setScheduledDate(tmrw.toISOString().split('T')[0]);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      scheduledDate !== new Date().toISOString().split('T')[0]
                        ? 'bg-[#fef3c7] border-[#d97706] text-[#b45309]'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Tomorrow / Other
                  </button>
                </div>

                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-semibold focus:outline-none"
                />
              </div>

              {/* Shift Selection: Morning or Evening (Strictly NO timings displayed) */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#f3e8d2] space-y-2">
                <label className="block text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#b45309]" />
                  <span>Select Shift *</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShift('Morning')}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      shift === 'Morning'
                        ? 'bg-[#fef3c7] border-[#d97706] text-[#b45309] shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Sun className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-sm">Morning</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShift('Evening')}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      shift === 'Evening'
                        ? 'bg-[#1c2541] border-[#3a506b] text-[#fbbf24] shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                      <Moon className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-sm">Evening</span>
                  </button>
                </div>
              </div>

              {/* Duration Plan Picker (if per-min mode) */}
              {!isFixedRate && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-gray-700">
                    Consultation Duration:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([15, 30, 45] as const).map((dur) => {
                      const amt = dur * ratePerMin;
                      const isSel = selectedDuration === dur;
                      return (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setSelectedDuration(dur)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#fef3c7] border-[#d97706] text-[#b45309]'
                              : 'bg-white border-gray-200 text-gray-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{dur} Mins</div>
                          <div className="text-xs font-mono font-extrabold">₹{amt}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md cursor-pointer hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment (₹{totalAmount}) →</span>
              </button>
            </div>
          )}

          {/* STEP 3: PAYMENT CHECKOUT */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b45309] block">
                  ✦ Step 3: UPI Payment
                </span>
                <h4 className="font-serif font-bold text-xl text-[#0f172a]">
                  Scan & Pay ₹{totalAmount}
                </h4>
                <p className="text-xs text-gray-500">
                  {mode === 'CHAT' ? 'Chat Consultation' : 'Call Consultation'} · {scheduledDate} ({shift} Shift)
                </p>
              </div>

              {/* Payment Summary */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#f3e8d2] space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#f3e8d2]">
                  <span className="text-gray-600 font-medium">Astrologer:</span>
                  <span className="font-extrabold text-[#0f172a]">{astrologer.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#f3e8d2]">
                  <span className="text-gray-600 font-medium">Scheduled Shift:</span>
                  <span className="font-extrabold text-[#b45309]">{shift} Shift ({scheduledDate})</span>
                </div>
                <div className="flex justify-between items-center text-sm font-extrabold">
                  <span className="text-[#0f172a]">Total Payable:</span>
                  <span className="text-[#b45309] font-mono text-xl">₹{totalAmount}</span>
                </div>

                {/* QR Code */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
                    <div className="w-14 h-14 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-gray-900">UPI ID: kangleiastro@upi</div>
                      <div className="text-[11px] text-gray-600">Payee: KangleiAstro Services</div>
                      <div className="text-[10px] text-emerald-700 font-bold">Scan with GPay, PhonePe, Paytm or BHIM</div>
                    </div>
                  </div>

                  <form onSubmit={handleCompleteBookingAndPayment} className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Enter UPI Transaction Reference / UTR Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 429810441920"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 font-mono text-xs font-semibold focus:outline-none focus:border-[#c69214]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessingPayment || !utrNumber.trim()}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessingPayment ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Submitting Order...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Submit Booking & UTR Verification →</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER TRACKER & CONSULTATION LINK */}
          {step === 4 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif font-bold text-2xl text-[#0f172a]">
                  🎉 Consultation Order Placed!
                </h4>
                <p className="text-xs text-gray-500 font-mono">
                  Order Ref: <strong className="text-[#b45309]">{createdOrderRef}</strong>
                </p>
              </div>

              {/* Live Status Tracker Box */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#f3e8d2] text-left space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#f3e8d2]">
                  <span className="text-gray-600">Astrologer:</span>
                  <span className="font-bold text-[#0f172a]">{astrologer.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#f3e8d2]">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-bold text-[#b45309]">{scheduledDate} ({shift} Shift)</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#f3e8d2]">
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-bold text-[#0f172a]">{mode === 'CHAT' ? '💬 Live Chat' : '📞 Live Call'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Verification Status:</span>
                  {orderPaymentStatus === 'VERIFIED' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Payment Verified by Admin</span>
                    </span>
                  ) : orderPaymentStatus === 'REJECTED' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-extrabold flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-red-600" />
                      <span>Payment Verification Rejected</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold flex items-center gap-1 animate-pulse">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Pending Admin Verification</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Consultation Meeting Link Room Button or Status Alert */}
              {orderPaymentStatus === 'VERIFIED' ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                  <div className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Your Consultation Room Link is Active!</span>
                  </div>
                  <a
                    href={
                      meetingLink
                        ? meetingLink.includes('role=')
                          ? meetingLink
                          : `${meetingLink}${meetingLink.includes('?') ? '&' : '?'}role=client`
                        : `/consultation?sessionId=${createdSessionId}&role=client`
                    }
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Join Consultation Room Now →</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : orderPaymentStatus === 'REJECTED' ? (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Payment Verification Failed / Rejected</span>
                  </div>
                  <p className="text-[11px] text-red-700">
                    Admin could not verify UTR: <strong>{utrNumber}</strong>. Please check your bank transaction or contact our support team to re-verify.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800 space-y-1">
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Admin is Verifying Your Payment (UTR: {utrNumber || 'Submitted'})</span>
                  </div>
                  <p className="text-[11px] text-blue-700">
                    Once verified, your consultation room link will be dispatched here and to your Client Dashboard.
                  </p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <a
                  href="/dashboard/client"
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 text-center transition-colors"
                >
                  View in Client Dashboard
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Security Note */}
        <div className="bg-[#faf8f5] px-6 py-2.5 border-t border-[#f3e8d2] text-center text-[10px] text-gray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit Encrypted Secure Astrological Portal</span>
        </div>

      </div>
    </div>
  );
}
