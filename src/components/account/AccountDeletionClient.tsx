'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Trash2,
  AlertTriangle,
  FileText,
  CheckCircle2,
  LogOut,
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react';

export default function AccountDeletionClient() {
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
    <div className="space-y-6">
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         LOGGED-IN USER PROFILE (IF DETECTED)
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
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 hover:underline cursor-pointer"
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
         WEB DELETION REQUEST FORM (NO LOGIN REQUIRED)
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
                Submit this web request if you uninstalled the app or cannot log into your account.
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
                Full Name (as registered in Manipuri Calendar KangleiAstro)
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
                  I request permanent deletion of my account, profile, birth charts (DOB/TOB/POB), and personal records in <strong>Manipuri Calendar KangleiAstro</strong> published by <strong>NexGen Info Lab</strong>. I understand this action is permanent and irreversible.
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
         CONFIRMATION MODAL FOR LOGGED-IN USERS
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
              Are you sure you want to permanently delete your <strong>Manipuri Calendar KangleiAstro</strong> account? All your personal birth charts, horoscope calculations, and community posts will be erased immediately.
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
