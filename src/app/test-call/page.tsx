'use client';

import React, { useState } from 'react';
import LiveConsultationRoom from '@/components/consultation/LiveConsultationRoom';
import { User, Video, ShieldCheck } from 'lucide-react';

export default function TestCallPage() {
  const [role, setRole] = useState<'CLIENT' | 'ASTROLOGER' | null>(null);
  const [sessionId] = useState<string>('TEST-SESS-999');

  const startTestSession = (selectedRole: 'CLIENT' | 'ASTROLOGER') => {
    setRole(selectedRole);
    fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'INITIATE_CALL',
        sessionId: 'TEST-SESS-999',
        callType: 'VIDEO',
        initiatedBy: selectedRole,
      }),
    }).catch(() => {});
  };

  if (role) {
    return (
      <div className="w-screen h-screen relative bg-slate-950">
        <div className="absolute top-2 right-4 z-[9999999] flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/40">
            Testing as {role}
          </span>
          <button
            onClick={() => setRole(null)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1 rounded-full border border-slate-600 transition cursor-pointer"
          >
            Switch Role
          </button>
        </div>
        <LiveConsultationRoom sessionId={sessionId} currentUserType={role} onClose={() => setRole(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center font-sans">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto">
          <Video className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">WebRTC 1-on-1 Test Lab</h1>
          <p className="text-slate-400 text-sm mt-1">
            Test local 1-on-1 video streaming using session <span className="font-mono text-amber-300 font-bold">{sessionId}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => startTestSession('CLIENT')}
            className="p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg flex flex-col items-center space-y-2 group cursor-pointer border border-emerald-400/30"
          >
            <User className="w-8 h-8 text-emerald-200 group-hover:scale-110 transition" />
            <span className="text-base">Join as CLIENT</span>
            <span className="text-xs text-emerald-200 font-normal">Sends Offer & Starts Call</span>
          </button>

          <button
            onClick={() => startTestSession('ASTROLOGER')}
            className="p-5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-lg flex flex-col items-center space-y-2 group cursor-pointer border border-teal-400/30"
          >
            <ShieldCheck className="w-8 h-8 text-teal-200 group-hover:scale-110 transition" />
            <span className="text-base">Join as ASTROLOGER</span>
            <span className="text-xs text-teal-200 font-normal">Answers Offer & Accepts Call</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left text-xs text-slate-400 space-y-2">
          <p className="font-bold text-slate-300">💡 How to test locally on 2 tabs:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Open Tab 1 and click <strong className="text-emerald-400">Join as CLIENT</strong>.</li>
            <li>Open Tab 2 and click <strong className="text-teal-400">Join as ASTROLOGER</strong>.</li>
            <li>Click the 📹 video call button in either room to connect.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
