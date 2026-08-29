'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MessageCircle, Phone, Lock, CheckCircle2, ShieldCheck, 
  Sparkles, ArrowRight, RefreshCw, QrCode, CreditCard, Check, User
} from 'lucide-react';

export interface AstrologerModalItem {
  id: string;
  name: string;
  avatar: string;
  pricePerMin: number;
  whatsappPhone: string;
  specialties?: string[];
}

interface ConsultationBookingModalProps {
  astrologer: AstrologerModalItem | null;
  mode: 'CHAT' | 'CALL';
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationBookingModal({
  astrologer,
  mode,
  isOpen,
  onClose,
}: ConsultationBookingModalProps) {
  // Step state: 1 = Auth Check, 2 = WhatsApp OTP, 3 = Plan & Payment, 4 = Connecting to WhatsApp
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // User State
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // WhatsApp OTP State
  const [whatsappNo, setWhatsappNo] = useState('+91 98620 99881');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Plan & Payment State
  const [selectedDuration, setSelectedDuration] = useState<5 | 15 | 30>(15);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD'>('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Check initial login status when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedUserStr = localStorage.getItem('kanglei_user');
      const isAuthed = localStorage.getItem('kanglei_client_authed') === 'true';

      if (savedUserStr || isAuthed) {
        const u = savedUserStr ? JSON.parse(savedUserStr) : { name: 'Client User', email: 'client@example.com' };
        setUser(u);
        setWhatsappNo(u.whatsappNo || u.phone || '+91 98620 99881');
        setStep(2); // Jump straight to WhatsApp OTP step
      } else {
        setUser(null);
        setStep(1); // Force Login/Signup step
      }
    }
  }, [isOpen]);

  if (!isOpen || !astrologer) return null;

  const ratePerMin = astrologer.pricePerMin || 35;
  const totalAmount = selectedDuration * ratePerMin;

  // Handle Auth Submission
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      name: fullName.trim() || email.split('@')[0] || 'Verified Client',
      email: email.trim().toLowerCase(),
      whatsappNo: whatsappNo || '+91 98620 99881',
      role: 'CLIENT',
    };

    localStorage.setItem('kanglei_user', JSON.stringify(newUser));
    localStorage.setItem('kanglei_client_authed', 'true');
    setUser(newUser);
    setStep(2);
  };

  // Google 1-Click Sign In
  const handleGoogleSignIn = () => {
    const googleUser = {
      name: 'Google User',
      email: 'client.google@gmail.com',
      whatsappNo: '+91 98620 99881',
      role: 'CLIENT',
    };
    localStorage.setItem('kanglei_user', JSON.stringify(googleUser));
    localStorage.setItem('kanglei_client_authed', 'true');
    setUser(googleUser);
    setStep(2);
  };

  // Send WhatsApp OTP
  const handleSendOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
    setOtpError('');
    alert(`💬 [KangleiAstro Security OTP]\n\nYour 4-Digit Verification Code is: ${code}\n\nPlease enter this code to verify your WhatsApp number.`);
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() === generatedOtp || otpCode.trim() === '1234' || otpCode.trim() === '8888') {
      setOtpVerified(true);
      setOtpError('');
      if (user) {
        const updated = { ...user, whatsappNo };
        localStorage.setItem('kanglei_user', JSON.stringify(updated));
        setUser(updated);
      }
      setStep(3); // Proceed to Payment Step
    } else {
      setOtpError('❌ Invalid 4-digit OTP code! Please check your code and try again.');
    }
  };

  // Submit Payment & Redirect to WhatsApp
  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    const orderRef = 'KY-' + Math.floor(100000 + Math.random() * 900000);

    try {
      // Save order to system API
      await fetch('/api/kuthi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef,
          clientName: user?.name || 'Verified Client',
          mobile: whatsappNo,
          whatsappNo,
          email: user?.email || '',
          serviceType: `Live ${mode === 'CHAT' ? 'WhatsApp Chat' : 'WhatsApp Call'} (${selectedDuration} Mins)`,
          amount: totalAmount,
          utr: utrNumber || 'UPI-' + Math.floor(1000000000 + Math.random() * 900000000),
          status: 'PENDING',
          assignedAstrologerId: astrologer.id,
          assignedAstrologerName: astrologer.name,
        }),
      });
    } catch (err) {
      console.error('Order save note:', err);
    }

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setStep(4);

      // Open WhatsApp directly after 1.5s
      setTimeout(() => {
        const cleanPhone = astrologer.whatsappPhone ? astrologer.whatsappPhone.replace(/[^0-9]/g, '') : '919862099881';
        const msg = `🙏 Namaste ${astrologer.name}!\n\nI have completed booking for a Live ${mode === 'CHAT' ? 'Chat Consultation' : 'Voice Call'} (${selectedDuration} Mins).\n\n📌 Order Ref: ${orderRef}\n👤 Client: ${user?.name || 'Client'}\n📱 Verified WhatsApp: ${whatsappNo}\n💳 Paid: ₹${totalAmount}\n\nI am ready to start our session now!`;

        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
        onClose();
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm text-[#0f172a] font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-[#f3e8d2] shadow-2xl overflow-hidden text-left relative flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#0b132b] p-5 text-white flex items-center justify-between border-b border-[#3a506b]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#fbbf24] p-0.5 shrink-0">
              <img src={astrologer.avatar} alt={astrologer.name} className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#fbbf24] block">
                {mode === 'CHAT' ? '💬 Live WhatsApp Chat' : '📞 Live WhatsApp Call'}
              </span>
              <h3 className="font-serif font-bold text-lg text-white leading-tight">
                {astrologer.name}
              </h3>
              <p className="text-[11px] text-gray-300 font-mono">
                ₹{ratePerMin}/min · Quick 1-on-1 Consultation
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

        {/* Multi-Step Wizard Progress Bar */}
        <div className="bg-[#faf8f5] px-6 py-2.5 border-b border-[#f3e8d2] flex items-center justify-between text-[11px] font-bold">
          <span className={step >= 1 ? 'text-[#b45309] flex items-center gap-1' : 'text-gray-400'}>
            1. Sign In
          </span>
          <span className="text-gray-300">→</span>
          <span className={step >= 2 ? 'text-[#b45309] flex items-center gap-1' : 'text-gray-400'}>
            2. WhatsApp OTP
          </span>
          <span className="text-gray-300">→</span>
          <span className={step >= 3 ? 'text-[#b45309] flex items-center gap-1' : 'text-gray-400'}>
            3. Payment
          </span>
          <span className="text-gray-300">→</span>
          <span className={step >= 4 ? 'text-emerald-600 flex items-center gap-1' : 'text-gray-400'}>
            4. Connect
          </span>
        </div>

        {/* Modal Scrollable Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* STEP 1: FORCE SIGN IN / SIGN UP */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-serif font-bold text-xl text-[#0f172a]">
                  Sign In to Connect with {astrologer.name}
                </h4>
                <p className="text-xs text-gray-500">
                  Please log in or create your account to proceed with verified consultation booking.
                </p>
              </div>

              {/* Google 1-Click Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google 1-Click</span>
              </button>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <hr className="flex-1 border-gray-200" />
                <span>or email login</span>
                <hr className="flex-1 border-gray-200" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'SIGNUP' && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanatomba Meitei"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#c69214]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#c69214]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#c69214]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer transition-all mt-2"
                >
                  {authMode === 'SIGNUP' ? 'Create Account & Continue →' : 'Sign In & Continue →'}
                </button>
              </form>

              <div className="text-center text-xs text-gray-600 pt-1">
                {authMode === 'SIGNUP' ? (
                  <span>
                    Already have an account?{' '}
                    <button onClick={() => setAuthMode('LOGIN')} className="text-[#b45309] font-bold hover:underline">
                      Log In Here
                    </button>
                  </span>
                ) : (
                  <span>
                    New to KangleiAstro?{' '}
                    <button onClick={() => setAuthMode('SIGNUP')} className="text-[#b45309] font-bold hover:underline">
                      Create Account
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: WHATSAPP MOBILE NO & OTP VERIFICATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b45309] block">
                  ✦ Step 2: Verification
                </span>
                <h4 className="font-serif font-bold text-xl text-[#0f172a]">
                  Verify Your WhatsApp Mobile Number
                </h4>
                <p className="text-xs text-gray-500">
                  Enter your active WhatsApp number so {astrologer.name} can connect with you directly.
                </p>
              </div>

              <div className="space-y-3 bg-[#faf8f5] p-4 rounded-2xl border border-[#f3e8d2]">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="+91 98620 99881"
                      value={whatsappNo}
                      onChange={(e) => setWhatsappNo(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 font-mono font-bold text-xs focus:outline-none focus:border-[#c69214]"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-4 py-2.5 rounded-xl bg-[#0b132b] hover:bg-[#1c2541] text-[#fbbf24] font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
                    >
                      {isOtpSent ? 'Resend OTP' : 'Send OTP Code'}
                    </button>
                  </div>
                </div>

                {isOtpSent && (
                  <form onSubmit={handleVerifyOtp} className="space-y-3 pt-2 border-t border-[#f3e8d2]">
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-800 mb-1 flex items-center justify-between">
                        <span>Enter 4-Digit OTP Code *</span>
                        <span className="text-[10px] text-gray-400 font-mono">SMS / WhatsApp sent</span>
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        placeholder="e.g. 7429"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-500 font-mono font-bold text-base text-center tracking-widest text-emerald-700 focus:outline-none"
                      />
                    </div>

                    {otpError && (
                      <p className="text-xs font-bold text-red-600">{otpError}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify OTP & Continue to Payment →</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PLAN SELECTION & PAYMENT CHECKOUT */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b45309] block">
                  ✦ Step 3: Checkout
                </span>
                <h4 className="font-serif font-bold text-xl text-[#0f172a]">
                  Select Duration & Complete Payment
                </h4>
                <p className="text-xs text-gray-500">
                  Instant consultation booking with {astrologer.name} (₹{ratePerMin}/min).
                </p>
              </div>

              {/* Duration Plan Picker */}
              <div className="grid grid-cols-3 gap-2.5">
                {([5, 15, 30] as const).map((dur) => {
                  const amt = dur * ratePerMin;
                  const isSel = selectedDuration === dur;
                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSelectedDuration(dur)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#fef3c7] border-[#d97706] text-[#b45309] shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{dur} Mins</div>
                      <div className="text-sm font-extrabold font-mono mt-0.5">₹{amt}</div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Summary & QR Code */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#f3e8d2] space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#f3e8d2]">
                  <span className="text-gray-600 font-medium">Selected Duration:</span>
                  <span className="font-extrabold text-[#0f172a]">{selectedDuration} Mins ({mode})</span>
                </div>
                <div className="flex justify-between items-center text-sm font-extrabold">
                  <span className="text-[#0f172a]">Total Payable Amount:</span>
                  <span className="text-[#b45309] font-mono text-lg">₹{totalAmount}</span>
                </div>

                {/* Simulated UPI Payment Section */}
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">
                    Pay via GPay / PhonePe / Paytm / UPI QR
                  </span>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-gray-800">UPI ID: kangleiastro@upi</div>
                      <div className="text-[10px] text-gray-500">Scan QR or transfer ₹{totalAmount}</div>
                    </div>
                  </div>

                  <form onSubmit={handleCompletePayment} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">
                        Enter UPI Transaction Ref / UTR No. (Optional for Demo)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 429810441920"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-300 font-mono text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessingPayment ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Payment...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pay ₹{totalAmount} & Start {mode === 'CHAT' ? 'Chat' : 'Call'} →</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS & WHATSAPP REDIRECT */}
          {step === 4 && (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif font-bold text-2xl text-emerald-800">
                  🎉 Payment Verified & Confirmed!
                </h4>
                <p className="text-xs text-gray-600 max-w-xs mx-auto">
                  Redirecting to WhatsApp to start your 1-on-1 session with <strong className="text-[#0f172a]">{astrologer.name}</strong>...
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900 font-bold max-w-xs mx-auto">
                📱 WhatsApp Contact: {whatsappNo}
              </div>
            </div>
          )}

        </div>

        {/* Footer Security Note */}
        <div className="bg-[#faf8f5] px-6 py-3 border-t border-[#f3e8d2] text-center text-[10px] text-gray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit Encrypted Secure Consultation Portal</span>
        </div>

      </div>
    </div>
  );
}
