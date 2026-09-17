'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Shield,
  Trash2,
  AlertTriangle,
  Lock,
  FileText,
  CheckCircle2,
  ExternalLink,
  LogOut,
  RefreshCw,
  Clock,
  Building,
  Smartphone,
  Info,
  HelpCircle,
  Mail,
  Phone
} from 'lucide-react';

export default function RootAccountDeletionPage() {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Web Request Form State (No Login Required - Google Play Mandatory)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    reason: 'I no longer need this account',
    consent: false,
  });
  const [webSubmitting, setWebSubmitting] = useState<boolean>(false);
  const [webSubmitted, setWebSubmitted] = useState<boolean>(false);
  const [webError, setWebError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClient = localStorage.getItem('active_client_user');
      const storedLeipungUser = localStorage.getItem('leipung_user');

      if (storedClient) {
        try {
          const parsed = JSON.parse(storedClient);
          setLoggedInUser(parsed);
          setFormData((prev) => ({
            ...prev,
            name: parsed.name || '',
            email: parsed.email || '',
            phone: parsed.phone || parsed.whatsappNo || '',
          }));
        } catch (e) {}
      } else if (storedLeipungUser) {
        try {
          const parsed = JSON.parse(storedLeipungUser);
          setLoggedInUser(parsed);
          setFormData((prev) => ({
            ...prev,
            name: parsed.name || '',
            email: parsed.email || '',
            phone: parsed.phone || '',
          }));
        } catch (e) {}
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('active_client_user');
      localStorage.removeItem('leipung_user');
      localStorage.removeItem('token');
      sessionStorage.clear();
      setLoggedInUser(null);
      setToastMsg('Logged out successfully.');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  // 1. Instant Self-Service In-App / Logged-in Deletion
  const handleLoggedInAccountDeletion = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      alert('Please type DELETE to confirm account deletion.');
      return;
    }

    try {
      setDeleting(true);
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loggedInUser?.id,
          email: loggedInUser?.email,
          phone: loggedInUser?.phone || loggedInUser?.whatsappNo,
          reason: 'User self-service account deletion',
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

        alert('Your account and all associated personal records have been permanently erased.');
        setLoggedInUser(null);
        setShowDeleteModal(false);
        router.push('/');
      } else {
        alert(data.error || 'Failed to delete account. Please contact support.');
      }
    } catch (e) {
      console.error('Account deletion error:', e);
      alert('Network error occurred while deleting account.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 2. Web Form Submission (For users who uninstalled app or are logged out - Google Play requirement)
  const handleWebFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWebError(null);

    if (!formData.email && !formData.phone) {
      setWebError('Please provide at least your registered Phone Number or Email Address.');
      return;
    }

    if (!formData.consent) {
      setWebError('Please confirm the checkbox to acknowledge permanent data deletion.');
      return;
    }

    try {
      setWebSubmitting(true);
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          reason: formData.reason,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setWebSubmitted(true);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('active_client_user');
          localStorage.removeItem('leipung_user');
          localStorage.removeItem('token');
        }
      } else {
        setWebError(data.error || 'Failed to submit deletion request. Please email ccare@kuthiyengpham.in');
      }
    } catch (err: any) {
      setWebError('Network error. Please try again or reach out to support.');
    } finally {
      setWebSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Top Header with App Entity Reference */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Account & Data Deletion
              </h1>
              <p className="text-[11px] text-amber-700 font-semibold">
                Kanglei Astro • Manipuri Calendar by KangleiAstro
              </p>
            </div>
          </div>
          <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Google Play Verified
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {toastMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
           1. GOOGLE PLAY ENTITY IDENTIFICATION BOX (CRITICAL FOR APPROVAL)
           ───────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-amber-900 via-[#261f18] to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md space-y-4 border border-amber-500/30">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 inline-block">
                Google Play Data Safety Compliance
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Official Account & Personal Data Deletion Portal
              </h2>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                In compliance with Google Play Developer Policy and user privacy rights, this official portal allows users of the <strong>Kanglei Astro (Manipuri Calendar)</strong> application to permanently delete their account and all associated personal records.
              </p>
            </div>
          </div>

          {/* Detailed Entity References Table */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-300/80 block">
                Application Name
              </span>
              <strong className="text-white text-xs block">
                Kanglei Astro / Manipuri Calendar
              </strong>
              <span className="text-[10px] text-slate-300 block">
                (Manipuri Calendar by KangleiAstro)
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-300/80 block">
                Developer Name
              </span>
              <strong className="text-white text-xs block">
                Oinam Robert Singh
              </strong>
              <span className="text-[10px] text-slate-300 block">
                (KangleiAstro Developer Account)
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-300/80 block">
                Entity / Company
              </span>
              <strong className="text-white text-xs block">
                KuthiYengpham by KangleiAstro
              </strong>
              <span className="text-[10px] text-slate-300 block">
                Imphal East, Manipur, India
              </span>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           2. LOGGED-IN USER PROFILE (IF DETECTED)
           ───────────────────────────────────────────────────────────── */}
        {loggedInUser && (
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-bold text-base flex items-center justify-center">
                  {loggedInUser?.name ? loggedInUser.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{loggedInUser?.name || 'Active Member'}</h3>
                  <p className="text-xs text-slate-500 font-mono">{loggedInUser?.email || 'Registered User'}</p>
                  {loggedInUser?.phone && <p className="text-[11px] text-slate-400 font-mono">{loggedInUser.phone}</p>}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 hover:underline"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-amber-900 text-xs flex items-center justify-between">
              <span>You are currently logged in. You can trigger immediate self-service account deletion below.</span>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shrink-0 ml-2 cursor-pointer"
              >
                Delete Account Now
              </button>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
           3. WEB DELETION REQUEST FORM (NO LOGIN REQUIRED - GOOGLE PLAY REQUIREMENT)
           ───────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Online Account & Data Deletion Request Form
                </h3>
                <p className="text-xs text-slate-500">
                  Use this form if you uninstalled the app or cannot log in to your account.
                </p>
              </div>
            </div>
          </div>

          {webSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-emerald-900">
                Account Deletion Request Submitted
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                Your request has been successfully recorded. All associated personal records, sacred birth charts, and authentication credentials for <strong>{formData.phone || formData.email}</strong> will be permanently wiped from our database within <strong>48 to 72 hours</strong>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setWebSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWebFormSubmit} className="space-y-4">
              {webError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{webError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Registered Mobile / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Registered Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="e.g. user@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Full Name (as used in Kanglei Astro / Manipuri Calendar)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Sanatomba Meitei"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Reason for Deletion (Optional)
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="I no longer need this account">I no longer need this account</option>
                  <option value="Privacy and personal data concerns">Privacy and personal data concerns</option>
                  <option value="Creating a new account">Creating a new account</option>
                  <option value="App uninstalled / no longer in use">App uninstalled / no longer in use</option>
                  <option value="Other reasons">Other reasons</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="w-4 h-4 rounded-md border-slate-300 text-red-600 focus:ring-red-500 mt-0.5 cursor-pointer"
                  />
                  <span>
                    I request permanent deletion of my account, profile, birth charts (DOB/TOB/POB), and community posts in <strong>Kanglei Astro (Manipuri Calendar by KangleiAstro / KuthiYengpham)</strong> developed by <strong>Oinam Robert Singh</strong>. I understand this action is irreversible.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={webSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {webSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Deletion Request...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Submit Account & Data Deletion Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* ─────────────────────────────────────────────────────────────
           4. IN-APP DELETION INSTRUCTIONS (FOR ACTIVE MOBILE USERS)
           ───────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Smartphone className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">
              How to Delete Your Account Directly Inside the Mobile App
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            If you have the <strong>Kanglei Astro / Manipuri Calendar</strong> Android application installed on your device, you can delete your account instantly at any time:
          </p>

          <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700">
            <li>
              Open the <strong>Kanglei Astro (Manipuri Calendar)</strong> app on your Android device.
            </li>
            <li>
              Navigate to <strong>Menu / Profile</strong> icon in the top header or side drawer.
            </li>
            <li>
              Tap on <strong>Account Settings</strong>.
            </li>
            <li>
              Scroll down to the <strong>Delete Account & Data</strong> section.
            </li>
            <li>
              Tap <strong>Permanently Delete My Account</strong> and type <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-red-600">DELETE</code> to confirm.
            </li>
            <li>
              Your session will terminate immediately and all personal data will be purged.
            </li>
          </ol>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           5. DATA RETENTION & DELETION DISCLOSURE (REQUIRED BY GOOGLE PLAY)
           ───────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Data Retention, Deletion Scope & Statutory Policies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* What is Deleted */}
            <div className="p-3.5 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-2">
              <span className="font-bold text-red-900 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>What is Permanently Deleted</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                <li>User identity records: Name, phone number, email, and authentication passwords.</li>
                <li>Astrological birth inputs: Date of birth, time, place, and generated Janma Patrika / Kuthi charts.</li>
                <li>Leipung social posts, photos, comments, likes, and community feedback.</li>
                <li>Astrologer 1-on-1 private chat sessions, notes, and booking consultation records.</li>
              </ul>
            </div>

            {/* What is Retained */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>What May Be Retained & Retention Period</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                <li>
                  <strong>Financial & Tax Invoices:</strong> Payment transaction records from the Jyotish E-Store or consultations are retained for up to <strong>7 years</strong> strictly to comply with Indian statutory taxation (GST) and accounting laws. These records are completely anonymized.
                </li>
                <li>
                  <strong>Audit Log:</strong> Deletion request timestamp is kept for 90 days for audit compliance.
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong>Processing Timeline:</strong> In-app deletions are executed immediately in real-time. Deletions submitted via this web form are verified and completely cleared across all backup servers within <strong>48 to 72 hours</strong>.
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           6. PRIVACY CONTACT & GRIEVANCE OFFICER
           ───────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-700" />
            <span>Developer & Privacy Desk Contacts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
            <div>
              <span className="text-slate-500 block">Developer / Publisher:</span>
              <strong>Oinam Robert Singh (KangleiAstro)</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Organization:</span>
              <strong>KuthiYengpham by KangleiAstro</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Official Support Email:</span>
              <a href="mailto:ccare@kuthiyengpham.in" className="text-amber-700 font-mono underline">
                ccare@kuthiyengpham.in
              </a>
            </div>
            <div>
              <span className="text-slate-500 block">Registered Office:</span>
              <span>Khurai Chingangbam Leikai, Tinsid Road, Imphal East, Manipur 795005, India</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4 text-xs">
            <Link href="/privacy-policy" className="text-amber-700 hover:underline flex items-center gap-1">
              <span>Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/terms-of-service" className="text-amber-700 hover:underline flex items-center gap-1">
              <span>Terms of Service</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/disclaimer" className="text-amber-700 hover:underline flex items-center gap-1">
              <span>Astrological Disclaimer</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
         7. CONFIRMATION MODAL FOR LOGGED-IN USERS
         ───────────────────────────────────────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-red-600">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Confirm Account Deletion</h4>
                <span className="text-[11px] text-red-600 font-medium">Irreversible Action</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete your <strong>Kanglei Astro</strong> account? All your personal birth charts, horoscope calculations, and community posts will be erased immediately.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-700">
                Type <strong>DELETE</strong> below to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLoggedInAccountDeletion}
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE' || deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {deleting ? (
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
