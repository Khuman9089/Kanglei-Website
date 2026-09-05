'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LiveConsultationRoom from '@/components/consultation/LiveConsultationRoom';
import { 
  User, ShieldCheck, Sparkles, MessageCircle, Phone, ArrowLeft, 
  Lock, RefreshCw, Calendar, CheckCircle2, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

function ConsultationRoomInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlSessionId = searchParams.get('sessionId') || searchParams.get('id') || 'TEST-SESS-999';
  const urlRole = searchParams.get('role')?.toUpperCase();

  const [role, setRole] = useState<'CLIENT' | 'ASTROLOGER' | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auto-detect or resolve role
  useEffect(() => {
    if (urlRole === 'CLIENT' || urlRole === 'ASTROLOGER') {
      setRole(urlRole);
      setLoading(false);
      return;
    }

    if (urlRole === 'ASTRO' || urlRole === 'GURU') {
      setRole('ASTROLOGER');
      setLoading(false);
      return;
    }

    if (urlRole === 'USER') {
      setRole('CLIENT');
      setLoading(false);
      return;
    }

    // Try detecting from localStorage
    try {
      const isAstro = Boolean(localStorage.getItem('kanglei_astro_token'));
      const isClient = Boolean(localStorage.getItem('kanglei_client_authed') || localStorage.getItem('kanglei_user'));

      if (isAstro && !isClient) {
        setRole('ASTROLOGER');
      } else if (isClient && !isAstro) {
        setRole('CLIENT');
      }
    } catch (e) {}

    setLoading(false);
  }, [urlRole]);

  // Fetch session details for professional banner & metadata
  useEffect(() => {
    let mounted = true;
    const fetchSessionInfo = async () => {
      try {
        const res = await fetch(`/api/consultations?sessionId=${urlSessionId}`);
        const data = await res.json();
        if (mounted && data.session) {
          setSessionData(data.session);
        }
      } catch (e) {
        console.warn('Session metadata fetch note:', e);
      }
    };
    fetchSessionInfo();
    return () => {
      mounted = false;
    };
  }, [urlSessionId]);

  const handleManualRoleSelect = (selectedRole: 'CLIENT' | 'ASTROLOGER') => {
    setRole(selectedRole);
    // Notify session room
    fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'INITIATE_CALL',
        sessionId: urlSessionId,
        callType: sessionData?.mode === 'CALL' ? 'VIDEO' : 'AUDIO',
        initiatedBy: selectedRole,
      }),
    }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070d19] flex flex-col items-center justify-center text-white space-y-3 font-sans">
        <RefreshCw className="w-8 h-8 text-[#d97706] animate-spin" />
        <span className="text-sm font-medium text-amber-200">Preparing Divine Consultation Room...</span>
      </div>
    );
  }

  // DIRECT ACCESS: If role is defined (via ?role=client or ?role=astrologer or detected from session)
  if (role) {
    return (
      <div className="w-screen h-screen relative bg-slate-950 flex flex-col overflow-hidden font-sans">
        {/* Top Header Bar */}
        <header className="h-12 bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#0b132b] border-b border-[#3a506b] px-4 flex items-center justify-between z-50 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <Link
              href={role === 'CLIENT' ? '/dashboard/client' : '/dashboard/astrologer'}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-gray-300 hover:text-white transition flex items-center gap-1 text-xs font-bold"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-serif font-bold text-white tracking-wide">
                KangleiAstro Divine Consultation
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {sessionData?.orderRef || urlSessionId}
              </span>
            </div>
          </div>

          {/* Session Overview in Center */}
          {sessionData && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-gray-300 font-medium">
              <span className="text-amber-400 font-bold">{sessionData.astrologerName}</span>
              <span className="text-gray-500">↔</span>
              <span className="text-white font-bold">{sessionData.clientName}</span>
              <span className="text-gray-500">·</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-amber-300">
                {sessionData.shift ? `${sessionData.shift} Shift` : 'Scheduled Today'}
              </span>
            </div>
          )}

          {/* Right Controls: Role indicator & Switcher */}
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border ${
              role === 'CLIENT'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {role === 'CLIENT' ? <User className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{role === 'CLIENT' ? 'Client View' : 'Astrologer View'}</span>
            </span>

            <button
              onClick={() => setRole(role === 'CLIENT' ? 'ASTROLOGER' : 'CLIENT')}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white text-[10px] font-bold border border-slate-700 transition cursor-pointer"
              title="Switch between Client and Astrologer interface"
            >
              Switch View
            </button>
          </div>
        </header>

        {/* Live Consultation Room Body */}
        <div className="flex-1 w-full h-[calc(100vh-48px)] relative">
          <LiveConsultationRoom
            sessionId={urlSessionId}
            currentUserType={role}
            onClose={() => {
              if (role === 'CLIENT') router.push('/dashboard/client');
              else router.push('/dashboard/astrologer');
            }}
          />
        </div>
      </div>
    );
  }

  // FALLBACK LOBBY: Only shown when no role query parameter was provided and not logged in
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060b14] via-[#0b132b] to-[#070d19] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-xl w-full bg-[#0d1829]/90 border border-[#1e2f4d] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center backdrop-blur-xl relative overflow-hidden">
        {/* Decorative ambient aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d97706] to-[#f59e0b] text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#fbbf24] block">
            ✦ Divine Consultation Room Entrance
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            KangleiAstro Live Room
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Please select how you wish to enter this consultation session.
          </p>
        </div>

        {/* Session Card Info */}
        <div className="bg-[#080e1a]/80 border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
            <span>Session Reference:</span>
            <span className="font-mono font-bold text-amber-300">{sessionData?.orderRef || urlSessionId}</span>
          </div>
          {sessionData?.astrologerName && (
            <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
              <span>Astrologer:</span>
              <span className="font-bold text-white">{sessionData.astrologerName}</span>
            </div>
          )}
          {sessionData?.clientName && (
            <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
              <span>Client:</span>
              <span className="font-bold text-white">{sessionData.clientName}</span>
            </div>
          )}
          {sessionData?.shift && (
            <div className="flex justify-between items-center text-slate-400">
              <span>Scheduled Shift:</span>
              <span className="font-bold text-amber-400">{sessionData.shift} Shift</span>
            </div>
          )}
        </div>

        {/* 1-Click Entry Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => handleManualRoleSelect('CLIENT')}
            className="p-5 rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-950/40 flex flex-col items-center space-y-2 border border-emerald-400/40 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-200 group-hover:scale-110 transition">
              <User className="w-6 h-6" />
            </div>
            <span className="text-base font-serif">Enter as Client</span>
            <span className="text-[11px] text-emerald-200 font-normal">
              Direct live chat & audio/video room
            </span>
          </button>

          <button
            onClick={() => handleManualRoleSelect('ASTROLOGER')}
            className="p-5 rounded-2xl bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold transition-all shadow-lg shadow-amber-950/40 flex flex-col items-center space-y-2 border border-amber-400/40 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-200 group-hover:scale-110 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-base font-serif">Enter as Astrologer</span>
            <span className="text-[11px] text-amber-200 font-normal">
              Jyotish workspace with chart tools
            </span>
          </button>
        </div>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-800">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-Bit Encrypted High-Definition Vedic Consultation Stream</span>
        </div>
      </div>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070d19] flex flex-col items-center justify-center text-white space-y-3 font-sans">
          <RefreshCw className="w-8 h-8 text-[#d97706] animate-spin" />
          <span className="text-sm font-medium text-amber-200">Loading Consultation Room...</span>
        </div>
      }
    >
      <ConsultationRoomInner />
    </Suspense>
  );
}
