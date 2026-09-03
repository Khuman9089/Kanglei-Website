'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, CheckCircle2, AlertCircle, Sparkles, RefreshCw, User, Calendar, Clock, MapPin, ShieldCheck, Check, ArrowRight 
} from 'lucide-react';
import { calculateGunMilan } from '@/engine/matching';

export default function FreeMatchingPage() {
  // Groom State
  const [groomName, setGroomName] = useState('');
  const [groomDob, setGroomDob] = useState('');
  const [groomTob, setGroomTob] = useState('');
  const [groomPob, setGroomPob] = useState('Imphal, Manipur');
  const [groomLong, setGroomLong] = useState('77.2');
  const [groomLat, setGroomLat] = useState('28.6');

  // Bride State
  const [brideName, setBrideName] = useState('');
  const [brideDob, setBrideDob] = useState('');
  const [brideTob, setBrideTob] = useState('');
  const [bridePob, setBridePob] = useState('Imphal, Manipur');
  const [brideLong, setBrideLong] = useState('72.8');
  const [brideLat, setBrideLat] = useState('19.0');

  // WhatsApp State
  const [whatsappNo, setWhatsappNo] = useState('');
  const [matchingResult, setMatchingResult] = useState<any>(null);
  const [submittedWhatsApp, setSubmittedWhatsApp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCalculateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!groomName.trim()) {
      setErrorMsg("Please enter Groom's Full Name.");
      return;
    }

    if (!groomDob || !groomTob || !groomPob.trim()) {
      setErrorMsg("Please enter Groom's Date, Time, and Place of Birth.");
      return;
    }

    if (!brideName.trim()) {
      setErrorMsg("Please enter Bride's Full Name.");
      return;
    }

    if (!brideDob || !brideTob || !bridePob.trim()) {
      setErrorMsg("Please enter Bride's Date, Time, and Place of Birth.");
      return;
    }

    if (!whatsappNo.trim()) {
      setErrorMsg("Please enter your WhatsApp Number for report delivery.");
      return;
    }

    // Compute Ashtakoot score
    const lng1 = parseFloat(groomLong) || 77.2;
    const lng2 = parseFloat(brideLong) || 72.8;
    const res = calculateGunMilan(lng1, lng2);

    setMatchingResult(res);
    setSubmittedWhatsApp(whatsappNo);
  };

  const handleReset = () => {
    setMatchingResult(null);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans antialiased">
      <main className="flex-1 pt-1 sm:pt-2 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            100% Free 36-Gun Ashtakoot Milan
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a] tracking-tight">
            Free Kuthi <span className="text-[#b45309]">Matching</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-2 max-w-2xl mx-auto font-sans">
            Enter birth details for Groom & Bride to instantly calculate 36-Gun Ashtakoot marriage compatibility score.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-gray-500">
            <span>Looking for Master Astrologer Deep Analysis?</span>
            <Link href="/pakna_wainaba" className="text-[#d97706] hover:underline font-extrabold">
              Go to Pakna-Wainaba (Paid Report) →
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!matchingResult ? (
          <form onSubmit={handleCalculateMatch} className="space-y-8">
            
            {/* SIDE-BY-SIDE GROOM & BRIDE BIRTH DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* GROOM DETAILS CARD */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl space-y-5 text-left">
                <div className="flex items-center gap-3 pb-4 border-b border-[#f3e8d2]">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-lg">
                    👦
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Groom Birth Details</h3>
                    <p className="text-xs text-gray-500">Enter full name and birth particulars</p>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                    Groom Full Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nganba Meitei"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* DOB, TOB, POB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Date of Birth<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={groomDob}
                      onChange={(e) => setGroomDob(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Time of Birth<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={groomTob}
                      onChange={(e) => setGroomTob(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                    Place of Birth<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Imphal, Manipur"
                    value={groomPob}
                    onChange={(e) => setGroomPob(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Longitude & Latitude */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Longitude (East °)
                    </label>
                    <input
                      type="text"
                      value={groomLong}
                      onChange={(e) => setGroomLong(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Latitude (North °)
                    </label>
                    <input
                      type="text"
                      value={groomLat}
                      onChange={(e) => setGroomLat(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-mono font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* BRIDE DETAILS CARD */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl space-y-5 text-left">
                <div className="flex items-center gap-3 pb-4 border-b border-[#f3e8d2]">
                  <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 border border-pink-200 flex items-center justify-center font-bold text-lg">
                    👧
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Bride Birth Details</h3>
                    <p className="text-xs text-gray-500">Enter full name and birth particulars</p>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                    Bride Full Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thoibi Ningthoujam"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] font-bold text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* DOB, TOB, POB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Date of Birth<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={brideDob}
                      onChange={(e) => setBrideDob(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                      Time of Birth<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={brideTob}
                      onChange={(e) => setBrideTob(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                    Place of Birth<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Imphal, Manipur"
                    value={bridePob}
                    onChange={(e) => setBridePob(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Longitude & Latitude */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Longitude (East °)
                    </label>
                    <input
                      type="text"
                      value={brideLong}
                      onChange={(e) => setBrideLong(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Latitude (North °)
                    </label>
                    <input
                      type="text"
                      value={brideLat}
                      onChange={(e) => setBrideLat(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-mono font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* BOTTOM CARD: WHATSAPP NUMBER & SUBMIT BUTTON */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl max-w-2xl mx-auto space-y-5 text-center">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  WhatsApp Number for Score Report Delivery<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98620 00000"
                  value={whatsappNo}
                  onChange={(e) => setWhatsappNo(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-mono font-bold text-sm text-center focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-5 h-5 text-white fill-white" />
                <span>Calculate Free 36-Gun Ashtakoot Score →</span>
              </button>
            </div>

          </form>
        ) : (
          
          /* RESULTS DISPLAY */
          <div className="space-y-8 max-w-4xl mx-auto">
            
            {/* SCORE METER CARD */}
            <div className="bg-white p-8 rounded-3xl border border-[#f3e8d2] shadow-2xl text-center space-y-4">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#fef3c7] border-4 border-[#d97706] text-4xl font-black text-[#b45309] shadow-lg font-mono">
                {matchingResult.totalScore} / {matchingResult.maxScore}
              </div>

              <h2 className="font-serif font-bold text-2xl text-[#0f172a]">
                Ashtakoot Compatibility: {matchingResult.totalScore >= 18 ? 'Favorable Match (Good Alignment)' : 'Consultation Recommended'}
              </h2>

              <p className="text-gray-600 text-xs max-w-md mx-auto">
                {groomName || 'Groom'} & {brideName || 'Bride'} achieved a score of {matchingResult.totalScore} points out of 36. Score summary sent to WhatsApp: <strong className="font-mono text-[#b45309]">{submittedWhatsApp}</strong>.
              </p>

              <div className="pt-3">
                <Link
                  href="/pakna_wainaba"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-lg hover:opacity-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                  <span>Upgrade to Pakna-Wainaba (Paid Master Astrologer Report ₹1,299) →</span>
                </Link>
              </div>
            </div>

            {/* 8-KOOT BREAKDOWN GRID */}
            <div className="bg-white p-6 rounded-3xl border border-[#f3e8d2] space-y-4 shadow-xl text-center">
              <h3 className="font-serif font-bold text-xl text-[#b45309]">Ashtakoot 8-Koot Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                {Object.entries(matchingResult.breakdown).map(([koota, score]) => (
                  <div key={koota} className="bg-[#fefcf6] p-4 rounded-2xl border border-[#fde68a]">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">{koota}</span>
                    <strong className="text-xl font-bold text-[#b45309] font-mono">{score as any} pts</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-white border border-[#f3e8d2] text-[#0f172a] font-bold text-xs hover:border-[#d97706] transition-colors flex items-center gap-2 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Calculate Another Free Matching Pair</span>
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
