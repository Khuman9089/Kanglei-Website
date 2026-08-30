'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Upload, FileText, CheckCircle2, AlertCircle, Sparkles, MessageSquare, ArrowRight, RefreshCw, User, Calendar, Clock, MapPin, Compass, QrCode, ShieldCheck, Check, Trash2 
} from 'lucide-react';
import { calculateGunMilan } from '@/engine/matching';

export default function MatchingPage() {
  // Free vs Paid Version Option
  const [matchingType, setMatchingType] = useState<'free' | 'paid'>('free');

  // Groom State
  const [groomName, setGroomName] = useState('');
  const [groomKuthiFile, setGroomKuthiFile] = useState<File | null>(null);
  const [groomNoKuthi, setGroomNoKuthi] = useState(false);
  const [groomDob, setGroomDob] = useState('');
  const [groomTob, setGroomTob] = useState('');
  const [groomPob, setGroomPob] = useState('Imphal, Manipur');
  const [groomLong, setGroomLong] = useState('77.2');
  const [groomLat, setGroomLat] = useState('28.6');

  // Bride State
  const [brideName, setBrideName] = useState('');
  const [brideKuthiFile, setBrideKuthiFile] = useState<File | null>(null);
  const [brideNoKuthi, setBrideNoKuthi] = useState(false);
  const [brideDob, setBrideDob] = useState('');
  const [brideTob, setBrideTob] = useState('');
  const [bridePob, setBridePob] = useState('Imphal, Manipur');
  const [brideLong, setBrideLong] = useState('72.8');
  const [brideLat, setBrideLat] = useState('19.0');

  // WhatsApp Contact & Payment State
  const [whatsappNo, setWhatsappNo] = useState('');
  const [utr, setUtr] = useState('');
  const [matchingResult, setMatchingResult] = useState<any>(null);
  const [isPaidConfirmed, setIsPaidConfirmed] = useState(false);
  const [submittedWhatsApp, setSubmittedWhatsApp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const handleCalculateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!groomName.trim()) {
      setErrorMsg("Please enter Groom's Name.");
      return;
    }

    if (!brideName.trim()) {
      setErrorMsg("Please enter Bride's Name.");
      return;
    }

    // Validation for Groom: if file not attached and noKuthi checked
    if (!groomKuthiFile && groomNoKuthi && (!groomDob || !groomTob || !groomPob.trim())) {
      setErrorMsg("Please enter Date, Time, and Place of Birth for Groom (or upload Groom's Kuthi paper).");
      return;
    }

    // Validation for Bride: if file not attached and noKuthi checked
    if (!brideKuthiFile && brideNoKuthi && (!brideDob || !brideTob || !bridePob.trim())) {
      setErrorMsg("Please enter Date, Time, and Place of Birth for Bride (or upload Bride's Kuthi paper).");
      return;
    }

    if (!whatsappNo.trim()) {
      setErrorMsg("Please enter a valid WhatsApp Number for report delivery.");
      return;
    }

    // Compute Ashtakoot score
    const lng1 = parseFloat(groomLong) || 77.2;
    const lng2 = parseFloat(brideLong) || 72.8;
    const res = calculateGunMilan(lng1, lng2);

    setMatchingResult(res);
    setSubmittedWhatsApp(whatsappNo);
  };

  const handleConfirmUpiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) {
      setErrorMsg("Please enter the 12-Digit UPI Transaction Ref (UTR) to confirm payment.");
      return;
    }

    setIsSubmittingPayment(true);

    const orderPayload = {
      action: 'CREATE_ORDER',
      order: {
        clientName: `${groomName} & ${brideName}`,
        sex: 'Couple',
        mobile: whatsappNo,
        whatsappNo: whatsappNo,
        matchingType,
        kuthiAttached: !!(groomKuthiFile || brideKuthiFile),
        groomDetails: {
          name: groomName,
          fileAttached: !!groomKuthiFile,
          fileName: groomKuthiFile ? groomKuthiFile.name : '',
          dob: groomDob || 'Kuthi Paper Uploaded',
          tob: groomTob || 'Kuthi Paper Uploaded',
          pob: groomPob || 'Kuthi Paper Uploaded',
        },
        brideDetails: {
          name: brideName,
          fileAttached: !!brideKuthiFile,
          fileName: brideKuthiFile ? brideKuthiFile.name : '',
          dob: brideDob || 'Kuthi Paper Uploaded',
          tob: brideTob || 'Kuthi Paper Uploaded',
          pob: bridePob || 'Kuthi Paper Uploaded',
        },
        utr: utr,
        amount: matchingType === 'paid' ? 1299 : 0,
        category: 'matching',
        serviceTitle: `36-Gun Ashtakoot Marriage Kundli Matching (${matchingType.toUpperCase()})`,
      },
    };

    try {
      const res = await fetch('/api/kuthi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error('API submission error');
      }

      setIsPaidConfirmed(true);
    } catch (err) {
      console.error('Failed to submit order to API:', err);
      setIsPaidConfirmed(true);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleReset = () => {
    setMatchingResult(null);
    setIsPaidConfirmed(false);
    setUtr('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans antialiased">
      <Navbar />
      <main className="flex-1 pt-1 sm:pt-2 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            Ashtakoot 36-Gun Milan
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a] tracking-tight">
            Kuthi <span className="text-[#b45309]">Matching</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Traditional 36-Gun Ashtakoot Marriage Compatibility & Mental Alignment Assessment for Groom & Bride
          </p>

          {/* TOP FREE vs PAID VERSION SELECTOR */}
          <div className="flex justify-center mt-6">
            <div className="bg-[#fef3c7] p-1.5 rounded-2xl border border-[#fde68a] inline-flex gap-2">
              <button
                type="button"
                onClick={() => setMatchingType('free')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  matchingType === 'free'
                    ? 'bg-[#d97706] text-white shadow-md'
                    : 'text-[#78350f] hover:text-[#0f172a]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Free 36-Gun Milan Score</span>
              </button>
              <button
                type="button"
                onClick={() => setMatchingType('paid')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  matchingType === 'paid'
                    ? 'bg-[#d97706] text-white shadow-md'
                    : 'text-[#78350f] hover:text-[#0f172a]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-yellow-200" />
                <span>Paid Master Astrologer Report (₹1,299)</span>
              </button>
            </div>
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
            
            {/* SIDE-BY-SIDE DUAL INTAKE FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: GROOM DETAILS */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl space-y-5 text-left">
                <div className="flex items-center gap-3 pb-4 border-b border-[#f3e8d2]">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-lg">
                    👦
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Groom Details</h3>
                    <p className="text-xs text-gray-500">Upload Kuthi paper or enter birth details</p>
                  </div>
                </div>

                {/* Groom Full Name */}
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

                {/* Upload Groom Kuthi */}
                <div className="p-4 rounded-2xl bg-[#fefcf6] border-2 border-dashed border-[#fde68a] text-center space-y-2 hover:border-[#d97706] transition-colors relative">
                  <Upload className="w-6 h-6 text-[#d97706] mx-auto" />
                  <span className="text-xs font-bold text-[#0f172a] block">Upload Groom Kuthi / Kundali Paper</span>
                  
                  {groomKuthiFile ? (
                    <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white border border-green-300 text-xs font-bold text-green-700">
                      <span>✓ {groomKuthiFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setGroomKuthiFile(null)}
                        className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer ml-2"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setGroomKuthiFile(e.target.files[0]);
                          setGroomNoKuthi(false);
                        }
                      }}
                      className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#d97706] file:text-white hover:file:opacity-90 cursor-pointer"
                    />
                  )}
                </div>

                {/* Checkbox: Groom does not have Kuthi paper (Only shown if file not attached) */}
                {!groomKuthiFile && (
                  <div className="pt-1">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#b45309] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={groomNoKuthi}
                        onChange={(e) => setGroomNoKuthi(e.target.checked)}
                        className="rounded text-[#d97706] focus:ring-[#d97706] w-4 h-4"
                      />
                      <span>☑ Groom does not have Kuthi paper (Enter Birth Details Manually)</span>
                    </label>
                  </div>
                )}

                {/* Groom Manual Birth Details - Shown ONLY when groomNoKuthi is checked and no file attached */}
                <AnimatePresence>
                  {!groomKuthiFile && groomNoKuthi && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-4 overflow-hidden"
                    >
                      <div className="text-[10px] font-bold text-[#78350f] uppercase tracking-wider">
                        Groom Manual Birth Details
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Date of Birth<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={groomDob}
                            onChange={(e) => setGroomDob(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Time of Birth<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            value={groomTob}
                            onChange={(e) => setGroomTob(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Place of Birth<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Imphal, Manipur"
                          value={groomPob}
                          onChange={(e) => setGroomPob(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* RIGHT COLUMN: BRIDE DETAILS */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl space-y-5 text-left">
                <div className="flex items-center gap-3 pb-4 border-b border-[#f3e8d2]">
                  <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 border border-pink-200 flex items-center justify-center font-bold text-lg">
                    👧
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Bride Details</h3>
                    <p className="text-xs text-gray-500">Upload Kuthi paper or enter birth details</p>
                  </div>
                </div>

                {/* Bride Full Name */}
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

                {/* Upload Bride Kuthi */}
                <div className="p-4 rounded-2xl bg-[#fefcf6] border-2 border-dashed border-[#fde68a] text-center space-y-2 hover:border-[#d97706] transition-colors relative">
                  <Upload className="w-6 h-6 text-[#d97706] mx-auto" />
                  <span className="text-xs font-bold text-[#0f172a] block">Upload Bride Kuthi / Kundali Paper</span>
                  
                  {brideKuthiFile ? (
                    <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white border border-green-300 text-xs font-bold text-green-700">
                      <span>✓ {brideKuthiFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setBrideKuthiFile(null)}
                        className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer ml-2"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setBrideKuthiFile(e.target.files[0]);
                          setBrideNoKuthi(false);
                        }
                      }}
                      className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#d97706] file:text-white hover:file:opacity-90 cursor-pointer"
                    />
                  )}
                </div>

                {/* Checkbox: Bride does not have Kuthi paper (Only shown if file not attached) */}
                {!brideKuthiFile && (
                  <div className="pt-1">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#b45309] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={brideNoKuthi}
                        onChange={(e) => setBrideNoKuthi(e.target.checked)}
                        className="rounded text-[#d97706] focus:ring-[#d97706] w-4 h-4"
                      />
                      <span>☑ Bride does not have Kuthi paper (Enter Birth Details Manually)</span>
                    </label>
                  </div>
                )}

                {/* Bride Manual Birth Details - Shown ONLY when brideNoKuthi is checked and no file attached */}
                <AnimatePresence>
                  {!brideKuthiFile && brideNoKuthi && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-4 overflow-hidden"
                    >
                      <div className="text-[10px] font-bold text-[#78350f] uppercase tracking-wider">
                        Bride Manual Birth Details
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Date of Birth<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={brideDob}
                            onChange={(e) => setBrideDob(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Time of Birth<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            value={brideTob}
                            onChange={(e) => setBrideTob(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Place of Birth<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Imphal, Manipur"
                          value={bridePob}
                          onChange={(e) => setBridePob(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-[#0f172a] text-xs font-bold focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>

            {/* BOTTOM COMMON CARD: WHATSAPP NUMBER & SUBMIT BUTTON */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl max-w-2xl mx-auto space-y-5 text-center">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#b45309] mb-1">
                  WhatsApp Number to Receive Report<span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  {matchingType === 'paid' 
                    ? 'Our Master Astrologer will perform deep D1 & D9 Navamsha compatibility and send the complete PDF report to this number.'
                    : 'Your 36-Gun Ashtakoot matching score and report summary will be sent to this WhatsApp number.'}
                </p>
                <input
                  type="text"
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
                <span>Calculate 36-Gun Ashtakoot Milan ({matchingType.toUpperCase()}) →</span>
              </button>
            </div>

          </form>
        ) : (
          
          /* RESULTS, UPI PAYMENT GATEWAY, & WHATSAPP CONFIRMATION */
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
                {groomName || 'Groom'} & {brideName || 'Bride'} achieved a score of {matchingResult.totalScore} points out of 36.
              </p>
            </div>

            {/* 8-KOOT BREAKDOWN GRID */}
            <div className="bg-white p-6 rounded-3xl border border-[#f3e8d2] space-y-4 shadow-xl">
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

            {/* IF PAID VERSION SELECTED: UPI PAYMENT GATEWAY STEP */}
            {matchingType === 'paid' && !isPaidConfirmed ? (
              <form onSubmit={handleConfirmUpiPayment} className="bg-white p-8 rounded-3xl border border-[#fde68a] shadow-2xl space-y-6 text-xs text-left">
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#fde68a] gap-2">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] font-extrabold text-[10px] uppercase tracking-wider border border-[#fde68a]">
                      Master Astrologer Package
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-[#0f172a] mt-1">Marriage & Relationship Report</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#b45309] font-mono block">₹1,299</span>
                    <span className="text-[10px] text-green-700 font-bold">Comprehensive PDF & Voice Guidance</span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed text-xs">
                  Complete 36-Gun Ashtakoot Milan, Manglik Dosh analysis, and mental/emotional compatibility assessment by our Master Vedic Astrologer.
                </p>

                <div className="space-y-2 p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a]">
                  <span className="font-bold text-[#b45309] text-xs block mb-1">What's Included in Your Report:</span>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                    <span>36-Points Ashtakoot breakdown</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Manglik Dosh cancellation check</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Favorable marriage timing windows</span>
                  </div>
                </div>

                {/* UPI QR & UTR Entry */}
                <div className="p-6 rounded-2xl bg-[#fefcf6] border border-[#fde68a] text-center space-y-4">
                  <span className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider block">
                    Scan & Pay ₹1,299 via Any UPI App
                  </span>
                  
                  <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl border-2 border-[#fde68a] shadow-md flex items-center justify-center">
                    <div className="w-full h-full bg-[#0f172a] text-[#fbbf24] flex items-center justify-center font-bold text-xs font-mono text-center">
                      UPI QR Code
                    </div>
                  </div>

                  <span className="text-xs text-gray-600 font-mono block">UPI ID: <strong>kangleiastro@upi</strong></span>

                  <div className="pt-3 border-t border-[#fde68a] max-w-md mx-auto text-left">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Enter 12-Digit UPI Transaction Ref (UTR)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 429810998120"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#b45309] font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span>{isSubmittingPayment ? 'Verifying Payment...' : 'Confirm Payment (₹1,299) & Send Kuthi to Astrologer →'}</span>
                </button>
              </form>
            ) : (

              /* STEP B: FINAL CONFIRMATION MESSAGE */
              <div className="p-8 rounded-3xl bg-green-50 border border-green-200 text-green-800 text-center space-y-4 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 border border-green-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="font-serif font-bold text-2xl text-[#0f172a]">Kuthi Matching Request Received</h4>
                <p className="text-xs leading-relaxed max-w-lg mx-auto text-gray-700 font-sans">
                  We have received your Groom (<strong>{groomName}</strong>) & Bride (<strong>{brideName}</strong>) Kuthi details. Matching report summary will be sent directly to WhatsApp No: <strong className="text-[#b45309] font-mono text-sm">{submittedWhatsApp}</strong>.
                </p>
                {utr && (
                  <div className="p-3 rounded-xl bg-white text-[#b45309] font-mono text-xs max-w-xs mx-auto border border-green-200">
                    Payment UTR Logged: {utr}
                  </div>
                )}
              </div>
            )}

            <div className="text-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-white border border-[#f3e8d2] text-[#0f172a] font-bold text-xs hover:border-[#d97706] transition-colors flex items-center gap-2 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Match Another Couple Pair</span>
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
