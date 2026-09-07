'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, AlertTriangle, UserCheck, Sparkles, 
  CheckCircle2, RefreshCw, ArrowRight, UserPlus, Phone, Mail 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function AstrologerSignupInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loadingInvite, setLoadingInvite] = useState(true);
  const [inviteValid, setInviteValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [inviteData, setInviteData] = useState<any>(null);

  // Registration Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [specialties, setSpecialties] = useState<string[]>(['Vedic Astrology', 'Manipuri Kuthi Yengba']);
  const [languages, setLanguages] = useState<string[]>(['Manipuri', 'English']);
  const [bio, setBio] = useState('');
  const [upiId, setUpiId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Validate one-time invite token on mount
  useEffect(() => {
    if (!token) {
      setLoadingInvite(false);
      setInviteValid(false);
      setErrorMessage('No invitation token found in the link. Please use the complete link sent via WhatsApp or Email.');
      return;
    }

    fetch(`/api/astrologers/invite?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        setLoadingInvite(false);
        if (data.valid && data.invite) {
          setInviteValid(true);
          setInviteData(data.invite);
          if (data.invite.name) setName(data.invite.name);
          if (data.invite.phone) setPhone(data.invite.phone);
          if (data.invite.email) setEmail(data.invite.email);
          if (data.invite.specialties && Array.isArray(data.invite.specialties)) {
            setSpecialties(data.invite.specialties);
          }
        } else {
          setInviteValid(false);
          setErrorMessage(data.message || 'This invitation link is invalid or has already been used.');
        }
      })
      .catch((err) => {
        setLoadingInvite(false);
        setInviteValid(false);
        setErrorMessage('Unable to verify invitation link. Please check your internet connection.');
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!name.trim() || !phone.trim() || !password.trim()) {
      setFormError('Please enter your full name, phone number, and account password.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/astrologers/invite', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name,
          phone,
          email,
          password,
          experienceYears,
          specialties,
          languages,
          bio,
          upiId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      setRegSuccess(true);

      // Store authenticated astrologer session
      if (typeof window !== 'undefined') {
        const astroSession = {
          id: data.astrologer.id,
          name: data.astrologer.name,
          phone: data.astrologer.phone,
          email: data.astrologer.email,
          role: 'ASTROLOGER',
          avatar: data.astrologer.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
        };
        localStorage.setItem('kanglei_astro_token', `astro-jwt-${data.astrologer.id}`);
        localStorage.setItem('kanglei_astro_active_profile', JSON.stringify(data.astrologer));
        localStorage.setItem('kanglei_user', JSON.stringify(astroSession));
        window.dispatchEvent(new Event('user-login-change'));
      }

      setTimeout(() => {
        router.push('/dashboard/astrologer');
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Registration error occurred.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans text-[#0f172a]">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-28 pb-16">
        
        {/* Loading State */}
        {loadingInvite && (
          <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center space-y-3 shadow-lg">
            <RefreshCw className="w-8 h-8 text-[#d97706] animate-spin mx-auto" />
            <h3 className="font-serif font-bold text-lg text-gray-800">Verifying One-Time Invitation Link...</h3>
            <p className="text-xs text-gray-500">Checking single-use authorization token with platform security</p>
          </div>
        )}

        {/* Invalid / Expired / Already Used State */}
        {!loadingInvite && !inviteValid && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-200 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <span className="px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 inline-block uppercase tracking-wider">
              Single-Use Link Security
            </span>

            <h2 className="font-serif font-black text-2xl text-gray-900">
              Invitation Link Invalid or Already Used
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              {errorMessage || 'For strict security, each Astrologer invite link is single-use and invalidates immediately once registered.'}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left space-y-1">
              <strong>Need Access?</strong>
              <p>
                If you already created your account with this link, you can log in directly at the{' '}
                <Link href="/auth?tab=login" className="font-bold underline text-[#b45309]">
                  Astrologer Login Portal
                </Link>. Otherwise, please contact the platform administrator for a new one-time invite.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/auth?tab=login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0f172a] text-white text-xs font-bold hover:bg-black transition-colors"
              >
                <span>Go to Astrologer Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Valid Invite Form */}
        {!loadingInvite && inviteValid && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#fde68a] shadow-xl space-y-6">
            
            <div className="border-b border-gray-100 pb-4 text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-extrabold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Astrologer Invitation • Valid Once</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#0f172a]">
                Astrologer Onboarding Sign-Up
              </h1>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Welcome to <strong>KangleiAstro</strong>. Complete your panel profile below to begin accepting live client calls and consultations.
              </p>
            </div>

            {formError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                ⚠️ {formError}
              </div>
            )}

            {regSuccess ? (
              <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-emerald-950">Registration Complete!</h3>
                <p className="text-xs text-emerald-800">
                  Your one-time invitation token has been verified and registered. Redirecting you to your Astrologer Dashboard...
                </p>
                <div className="flex justify-center pt-2">
                  <RefreshCw className="w-5 h-5 text-emerald-700 animate-spin" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs text-gray-700">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Astrologer Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acharya Tomba Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Mobile / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9862012345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-mono font-bold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="acharya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Create Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Years of Jyotish Experience
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-bold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      UPI ID for Earnings Payouts
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. astrologer@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-mono font-bold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Specialties (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={specialties.join(', ')}
                    onChange={(e) => setSpecialties(e.target.value.split(',').map((s) => s.trim()))}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-semibold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">e.g. Manipuri Kuthi Yengba, Vedic Astrology, Kundli Matching, Career Forecast</span>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Bio / Scholar Introduction
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your scholarly tradition, lineage, or consultation approach..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none resize-y"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  🔒 Once you submit this form, this invitation link will be marked as <strong>permanently used</strong> and cannot be accessed again.
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{submitting ? 'Creating Astrologer Account...' : 'Complete Sign-Up & Go to Dashboard →'}</span>
                </button>
              </form>
            )}

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function AstrologerSignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <RefreshCw className="w-8 h-8 text-[#d97706] animate-spin" />
      </div>
    }>
      <AstrologerSignupInner />
    </Suspense>
  );
}
