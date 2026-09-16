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

export default function AccountSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Load active client user or leipung user
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

      // 2. Load blocked users
      const blocked = localStorage.getItem('leipung_blocked_users');
      if (blocked) {
        try {
          setBlockedUsers(JSON.parse(blocked));
        } catch (e) {}
      }
    }
  }, []);

  const handleUnblockUser = (userId: string) => {
    const updated = blockedUsers.filter((id) => id !== userId);
    setBlockedUsers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('leipung_blocked_users', JSON.stringify(updated));
    }
    setToastMsg(`User unblocked`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleExecuteAccountDeletion = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          phone: user?.phone || user?.whatsappNo,
          reason: 'User self-service account deletion',
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Clear all client auth state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('active_client_user');
          localStorage.removeItem('leipung_user');
          localStorage.removeItem('leipung_eula_agreed');
          localStorage.removeItem('leipung_blocked_users');
          sessionStorage.clear();
        }
        alert('Your account and all associated personal data have been permanently erased.');
        router.push('/app');
      } else {
        alert(data.error || 'Failed to delete account');
      }
    } catch (err) {
      console.error('Account deletion error:', err);
      alert('Network error while requesting account deletion.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('active_client_user');
      localStorage.removeItem('leipung_user');
    }
    router.push('/app');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Account & Security</h1>
            <span className="text-[10px] text-slate-500 font-medium">Profile, Privacy & Data Safety</span>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="max-w-md mx-auto px-4 pt-3">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-in fade-in">
            {toastMsg}
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-md mx-auto p-4 space-y-4 text-xs">
        
        {/* User Identity Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-xs">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{user?.name || 'Kanglei Member'}</h2>
                <span className="text-[11px] text-slate-500 block">{user?.email || user?.phone || 'Verified User'}</span>
                <span className="inline-block mt-1 px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {user?.role || 'CLIENT'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* UGC Safety & Blocked Users List */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <UserX className="w-4 h-4 text-slate-600" />
              <span>Blocked Users ({blockedUsers.length})</span>
            </h3>
          </div>
          <p className="text-slate-500 text-[11px]">
            Users you have blocked in the Leipung community feed. You will not see their posts or comments.
          </p>

          {blockedUsers.length === 0 ? (
            <div className="py-2 text-center text-[11px] text-slate-400 bg-slate-50 rounded-xl">
              No blocked users.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {blockedUsers.map((uid) => (
                <div key={uid} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[180px]">{uid}</span>
                  <button
                    type="button"
                    onClick={() => handleUnblockUser(uid)}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200 transition"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legal & Compliance Links */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-slate-600" />
            <span>Legal & App Policies</span>
          </h3>

          <div className="divide-y divide-slate-100">
            <Link
              href="/app/privacy-policy"
              className="py-2.5 flex items-center justify-between text-slate-700 hover:text-amber-700 transition"
            >
              <span className="font-medium">Privacy Policy</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/app/terms-of-service"
              className="py-2.5 flex items-center justify-between text-slate-700 hover:text-amber-700 transition"
            >
              <span className="font-medium">Terms of Service & EULA</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/app/disclaimer"
              className="py-2.5 flex items-center justify-between text-slate-700 hover:text-amber-700 transition"
            >
              <span className="font-medium">Astrological Guidance Disclaimer</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Destructive Self-Service Account Deletion Section (Apple 5.1.1 & Google Data Safety) */}
        <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Delete Account & Erase All Data</span>
          </div>
          <p className="text-red-900 text-[11px] leading-relaxed">
            Permanently erase your account, horoscope profile, birth details, Leipung posts, and comments. This action cannot be undone.
          </p>

          <button
            type="button"
            onClick={() => {
              setDeleteConfirmText('');
              setShowDeleteModal(true);
            }}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete My Account</span>
          </button>
        </div>

      </main>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 z-10 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Confirm Account Deletion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                &quot;Are you sure you want to permanently delete your account? All your profile information, Leipung posts, and comments will be erased immediately.&quot;
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleExecuteAccountDeletion}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleting && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>{deleting ? 'Deleting...' : 'Yes, Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
