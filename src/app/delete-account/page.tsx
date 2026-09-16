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
  UserX
} from 'lucide-react';

export default function RootAccountDeletionPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClient = localStorage.getItem('active_client_user');
      const storedLeipungUser = localStorage.getItem('leipung_user');

      if (storedClient) {
        try {
          setUser(JSON.parse(storedClient));
        } catch (e) {}
      } else if (storedLeipungUser) {
        try {
          setUser(JSON.parse(storedLeipungUser));
        } catch (e) {}
      } else {
        setUser({
          id: 'user-guest',
          name: 'Guest Member',
          email: 'demo@kuthiyengpham.in',
          role: 'CLIENT',
        });
      }

      const blocked = localStorage.getItem('leipung_blocked_users');
      if (blocked) {
        try {
          setBlockedUsers(JSON.parse(blocked));
        } catch (e) {}
      }
    }
  }, []);

  const handleUnblock = (blockedId: string) => {
    const updated = blockedUsers.filter((id) => id !== blockedId);
    setBlockedUsers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('leipung_blocked_users', JSON.stringify(updated));
    }
    setToastMsg(`User ${blockedId} unblocked.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('active_client_user');
      localStorage.removeItem('leipung_user');
      localStorage.removeItem('token');
      sessionStorage.clear();
      router.push('/');
    }
  };

  const handleDeleteAccount = async () => {
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
          userId: user?.id,
          email: user?.email,
          phone: user?.phone,
          reason: 'User self-service deletion from Account Settings',
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
        router.push('/');
      } else {
        alert(data.error || 'Failed to delete account. Please try again or contact support.');
      }
    } catch (e) {
      console.error('Account deletion error:', e);
      alert('Network error occurred while deleting account.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">Account & Data Deletion</h1>
            <p className="text-[11px] text-slate-500">Google Play & Apple Store Compliance</p>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-lg mx-auto p-4 space-y-4">
        {toastMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Profile Details Card */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-bold text-lg flex items-center justify-center">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">{user?.name || 'Member'}</h2>
              <p className="text-xs text-slate-500 font-mono">{user?.email || 'ccare@kuthiyengpham.in'}</p>
              {user?.phone && <p className="text-[11px] text-slate-400 font-mono">{user.phone}</p>}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Account Status: <strong className="text-emerald-700 font-medium">Active</strong></span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 hover:underline"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </section>

        {/* Data Safety & Policy Links */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Privacy & Policies</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <Link href="/privacy-policy" className="py-2 flex items-center justify-between hover:text-amber-700 transition">
              <span>Privacy Policy</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/terms-of-service" className="py-2 flex items-center justify-between hover:text-amber-700 transition">
              <span>Terms of Service & EULA</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/disclaimer" className="py-2 flex items-center justify-between hover:text-amber-700 transition">
              <span>Astrological Guidance Disclaimer</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </section>

        {/* Self-Service Permanent Account Deletion (Apple 5.1.1 & Google Play Data Safety) */}
        <section className="bg-white rounded-2xl border border-red-200 p-4 shadow-xs space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 text-red-600 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-700">Delete Account & Data</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Permanently delete your profile, birth charts, consultation history, and remove all your Leipung community posts and comments.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Trash2 className="w-4 h-4" />
            <span>Permanently Delete My Account</span>
          </button>
        </section>
      </main>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-red-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-900">Confirm Account Deletion</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete your account? All your profile information, Leipung posts, and comments will be erased immediately.
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
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE' || deleting}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
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
