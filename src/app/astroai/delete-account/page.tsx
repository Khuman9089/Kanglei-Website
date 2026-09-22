'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Smartphone,
  Globe,
  Clock,
  Lock,
  HelpCircle,
} from 'lucide-react';

export default function JyotiAccountDeletionPage() {
  const [identifier, setIdentifier] = useState('');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your account email or user identifier.' });
      return;
    }
    if (!confirmed) {
      setStatusMessage({ type: 'error', text: 'Please check the box confirming you understand data deletion is permanent.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/jyoti/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonStringify({
          identifier: identifier.trim(),
          reason: reason.trim() || 'User submitted web deletion request',
          timestamp: new Date().toISOString(),
          app: 'Jyoti AI',
        }),
      });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: 'Your account and data deletion request for Jyoti AI has been successfully submitted and processed. All personal records, coordinates, and conversation history will be permanently erased.',
        });
        setIdentifier('');
        setReason('');
        setConfirmed(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to submit deletion request. Please try again or contact support.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error submitting request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  function jsonStringify(obj: any) {
    return JSON.stringify(obj);
  }

  return (
    <main className="min-h-screen bg-[#07090E] text-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation & Brand Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link
            href="/astroai"
            className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Jyoti AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#A855F7] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/20">
              ✦
            </div>
            <span className="font-serif font-bold text-lg text-white tracking-wide">
              Jyoti AI
            </span>
          </div>
        </div>

        {/* Hero Title Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Google Play Data Safety Compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Account & Personal Data Deletion
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed">
            In compliance with Google Play Store User Data & Account Deletion policies, you have complete sovereignty over your personal data. You can delete your Jyoti AI account and all associated celestial records at any time.
          </p>
        </div>

        {/* Two Deletion Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Method 1: In-App Deletion */}
          <div className="p-6 rounded-2xl bg-[#111622] border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Method 1: In-App Instant Deletion</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              If you have the Jyoti AI app open on your device:
            </p>
            <ol className="list-decimal list-inside text-xs text-[#94A3B8] space-y-2">
              <li>Open the <strong className="text-white">Jyoti AI</strong> application.</li>
              <li>Navigate to <strong className="text-white">Data Safety & Deletion</strong> from the dock or top menu.</li>
              <li>Tap <strong className="text-rose-400">Delete App Account & Data</strong>.</li>
              <li>Confirm the dialog to immediately wipe all local sandbox data, natal blueprints, and chat logs.</li>
            </ol>
          </div>

          {/* Method 2: Web Deletion Request Form */}
          <div className="p-6 rounded-2xl bg-[#111622] border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Method 2: Web Request Form</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              If you uninstalled the application or prefer web-based deletion:
            </p>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Use the web submission form below. Our automated systems will match your handle/identifier and execute a complete purge across all services.
            </p>
          </div>

        </div>

        {/* Interactive Web Deletion Form */}
        <div className="p-8 rounded-2xl bg-[#111622] border border-rose-500/30 shadow-2xl shadow-rose-950/20 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Submit Web Account Deletion Request</h2>
              <p className="text-xs text-[#94A3B8]">Direct web resource for permanent account & data removal</p>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Account Email / User Identifier <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. user@example.com or guest_user_id"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#07090E] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Reason for Deletion (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Let us know if you experienced any issues or have feedback..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-[#07090E] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="confirm-delete"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-700 bg-[#07090E] text-rose-500 focus:ring-rose-400"
              />
              <label htmlFor="confirm-delete" className="text-xs text-[#94A3B8] cursor-pointer leading-relaxed">
                I understand that account deletion is permanent and cannot be undone. All birth coordinates, calculated natal blueprints, and conversational AI session history will be completely erased.
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Deletion...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Permanently Delete Account & Data</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Data Types & Policy Transparency */}
        <div className="p-8 rounded-2xl bg-[#111622] border border-white/10 space-y-6">
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            Data Scope & Retention Disclosure
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Data Types Permanently Deleted
              </h3>
              <ul className="text-xs text-[#94A3B8] space-y-1.5 list-disc list-inside">
                <li>User identity, handles, and profile metadata.</li>
                <li>Date of birth, exact time, and geographic coordinates (latitude / longitude).</li>
                <li>Cached Sidereal natal charts, Bhavas, and Vimshottari Dasha trees.</li>
                <li>AI Oracle conversational transcripts, prompts, and response history.</li>
                <li>Customized user preferences and theme settings.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Retention Timeline & Exceptions
              </h3>
              <ul className="text-xs text-[#94A3B8] space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">Immediate Action</strong>: Personal data and astrological states are purged immediately upon submission.</li>
                <li><strong className="text-white">Security Logs</strong>: Basic anonymized server error logs are purged within a maximum window of 30 days.</li>
                <li><strong className="text-white">Zero Third-Party Resale</strong>: No user data is retained or shared with external data brokers.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Footer */}
        <div className="text-center text-xs text-[#64748B] pt-4 border-t border-white/10">
          <p>
            Have questions regarding our privacy practices? Read our{' '}
            <Link href="/privacy-policy" className="text-indigo-400 hover:underline">
              Privacy Policy
            </Link>{' '}
            or contact privacy support at <span className="text-white">privacy@kuthiyengpham.in</span>.
          </p>
        </div>

      </div>
    </main>
  );
}
