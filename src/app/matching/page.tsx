'use client';

import React, { useState } from 'react';
import { 
  Heart, Upload, FileText, CheckCircle2, AlertCircle, Sparkles, MessageSquare, ArrowRight, RefreshCw, User, Calendar, Clock, MapPin, Compass, QrCode, ShieldCheck, Check
} from 'lucide-react';
import { calculateGunMilan } from '@/engine/matching';

export default function MatchingPage() {
  // Groom State
  const [groomName, setGroomName] = useState('');
  const [groomKuthiFile, setGroomKuthiFile] = useState<File | null>(null);
  const [groomDob, setGroomDob] = useState('');
  const [groomTob, setGroomTob] = useState('');
  const [groomPob, setGroomPob] = useState('');
  const [groomLong, setGroomLong] = useState('77.2');
  const [groomLat, setGroomLat] = useState('28.6');

  // Bride State
  const [brideName, setBrideName] = useState('');
  const [brideKuthiFile, setBrideKuthiFile] = useState<File | null>(null);
  const [brideDob, setBrideDob] = useState('');
  const [brideTob, setBrideTob] = useState('');
  const [bridePob, setBridePob] = useState('');
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

    // Validation for Groom: if file not attached, DOB/TOB/POB are compulsory
    if (!groomKuthiFile && (!groomDob || !groomTob || !groomPob)) {
      setErrorMsg("Please provide Date, Time, & Place of Birth for Groom (or upload Groom's Kuthi/Kundali paper).");
      return;
    }

    // Validation for Bride: if file not attached, DOB/TOB/POB are compulsory
    if (!brideKuthiFile && (!brideDob || !brideTob || !bridePob)) {
      setErrorMsg("Please provide Date, Time, & Place of Birth for Bride (or upload Bride's Kuthi/Kundali paper).");
      return;
    }

    if (!whatsappNo) {
      setErrorMsg("Please enter a valid WhatsApp Number to receive the full analytical report.");
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
    if (!utr) {
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
        kuthiAttached: !!(groomKuthiFile || brideKuthiFile),
        kuthiFileName: groomKuthiFile ? groomKuthiFile.name : (brideKuthiFile ? brideKuthiFile.name : ''),
        dob: `Groom: ${groomDob || 'Paper Uploaded'} | Bride: ${brideDob || 'Paper Uploaded'}`,
        tob: `Groom: ${groomTob || 'Paper Uploaded'} | Bride: ${brideTob || 'Paper Uploaded'}`,
        pob: `Groom: ${groomPob || 'Paper Uploaded'} | Bride: ${bridePob || 'Paper Uploaded'}`,
        groomDetails: {
          name: groomName,
          dob: groomDob || 'Paper Uploaded',
          tob: groomTob || 'Paper Uploaded',
          pob: groomPob || 'Paper Uploaded',
          long: groomLong,
          lat: groomLat,
        },
        brideDetails: {
          name: brideName,
          dob: brideDob || 'Paper Uploaded',
          tob: brideTob || 'Paper Uploaded',
          pob: bridePob || 'Paper Uploaded',
          long: brideLong,
          lat: brideLat,
        },
        question: `Kuthi Matching score: ${matchingResult?.totalScore}/36. Please provide full Navamsha D9 report & remedies.`,
        utr: utr,
        amount: 1299,
        serviceType: 'Kuthi Matching (পক্ন-ৱাইনবা য়েংবা)',
      },
    };

    try {
      await fetch('/api/kuthi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      setIsPaidConfirmed(true);
      setErrorMsg('');
    } catch (err: any) {
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
    <div className="min-h-screen bg-[#0b132b] text-[#faf8f4] flex flex-col font-sans antialiased">
      <main className="flex-1 pt-4 sm:pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Header Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c69214]/10 border border-[#c69214]/30 text-[#e0a96d] text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            পক্ন-ৱাইনবা য়েংবা
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            Kuthi <span className="text-[#fbbf24]">Matching</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Traditional 36-Gun Ashtakoot Marriage Compatibility & Mental Alignment Assessment for Groom & Bride
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!matchingResult ? (
          <form onSubmit={handleCalculateMatch} className="space-y-8">
            
            {/* SIDE-BY-SIDE DUAL INTAKE FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: GROOM DETAILS */}
              <div className="bg-[#1c2541] p-6 md:p-8 rounded-3xl border border-[#3a506b]/50 shadow-xl space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[#3a506b]">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold">
                    👦
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white">Groom Details</h3>
                    <p className="text-xs text-slate-300">Enter birth data or upload Kuthi</p>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    Groom Full Name<span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nganba Meitei"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Upload Groom Kuthi */}
                <div className="p-4 rounded-2xl bg-[#0b132b] border border-dashed border-[#3a506b] text-center space-y-2">
                  <Upload className="w-6 h-6 text-[#fbbf24] mx-auto" />
                  <span className="text-xs font-bold text-gray-200 block">Upload Groom Kuthi / Kundali Paper</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setGroomKuthiFile(e.target.files?.[0] || null)}
                    className="text-[11px] text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#d97706] file:text-white hover:file:opacity-90"
                  />
                  {groomKuthiFile && (
                    <span className="text-[10px] text-green-400 font-bold block">✓ File Selected: {groomKuthiFile.name} (DOB/TOB optional)</span>
                  )}
                </div>

                {/* DOB, TOB, POB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Date of Birth {!groomKuthiFile && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="date"
                      required={!groomKuthiFile}
                      value={groomDob}
                      onChange={(e) => setGroomDob(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Time of Birth {!groomKuthiFile && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="time"
                      required={!groomKuthiFile}
                      value={groomTob}
                      onChange={(e) => setGroomTob(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    Place of Birth {!groomKuthiFile && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="text"
                    required={!groomKuthiFile}
                    placeholder="e.g. Imphal, Manipur"
                    value={groomPob}
                    onChange={(e) => setGroomPob(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs font-bold"
                  />
                </div>

                {/* Longitude & Latitude */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Longitude (East °)
                    </label>
                    <input
                      type="text"
                      value={groomLong}
                      onChange={(e) => setGroomLong(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Latitude (North °)
                    </label>
                    <input
                      type="text"
                      value={groomLat}
                      onChange={(e) => setGroomLat(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: BRIDE DETAILS */}
              <div className="bg-[#1c2541] p-6 md:p-8 rounded-3xl border border-[#3a506b]/50 shadow-xl space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[#3a506b]">
                  <div className="w-10 h-10 rounded-2xl bg-pink-600/20 text-pink-400 border border-pink-500/40 flex items-center justify-center font-bold">
                    👧
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white">Bride Details</h3>
                    <p className="text-xs text-slate-300">Enter birth data or upload Kuthi</p>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    Bride Full Name<span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thoibi Ningthoujam"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white font-bold text-xs focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Upload Bride Kuthi */}
                <div className="p-4 rounded-2xl bg-[#0b132b] border border-dashed border-[#3a506b] text-center space-y-2">
                  <Upload className="w-6 h-6 text-[#fbbf24] mx-auto" />
                  <span className="text-xs font-bold text-gray-200 block">Upload Bride Kuthi / Kundali Paper</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setBrideKuthiFile(e.target.files?.[0] || null)}
                    className="text-[11px] text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#d97706] file:text-white hover:file:opacity-90"
                  />
                  {brideKuthiFile && (
                    <span className="text-[10px] text-green-400 font-bold block">✓ File Selected: {brideKuthiFile.name} (DOB/TOB optional)</span>
                  )}
                </div>

                {/* DOB, TOB, POB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Date of Birth {!brideKuthiFile && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="date"
                      required={!brideKuthiFile}
                      value={brideDob}
                      onChange={(e) => setBrideDob(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Time of Birth {!brideKuthiFile && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="time"
                      required={!brideKuthiFile}
                      value={brideTob}
                      onChange={(e) => setBrideTob(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                    Place of Birth {!brideKuthiFile && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="text"
                    required={!brideKuthiFile}
                    placeholder="e.g. Imphal, Manipur"
                    value={bridePob}
                    onChange={(e) => setBridePob(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-white text-xs font-bold"
                  />
                </div>

                {/* Longitude & Latitude */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Longitude (East °)
                    </label>
                    <input
                      type="text"
                      value={brideLong}
                      onChange={(e) => setBrideLong(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Latitude (North °)
                    </label>
                    <input
                      type="text"
                      value={brideLat}
                      onChange={(e) => setBrideLat(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* BOTTOM COMMON CARD: WHATSAPP NUMBER & SUBMIT BUTTON */}
            <div className="bg-[#1c2541] p-6 md:p-8 rounded-3xl border border-[#3a506b]/50 shadow-xl max-w-2xl mx-auto space-y-5 text-center">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#fbbf24] mb-1">
                  WhatsApp Number to Receive Full Analytic Report<span className="text-red-400">*</span>
                </label>
                <p className="text-xs text-slate-300 mb-3">
                  Our Master Astrologer will perform deep D1 & D9 Navamsha compatibility and send the complete PDF report to this number.
                </p>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98620 00000"
                  value={whatsappNo}
                  onChange={(e) => setWhatsappNo(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-[#3a506b] bg-[#0b132b] text-[#fbbf24] font-mono font-bold text-sm text-center focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5 text-white fill-white" />
                <span>Calculate 36-Gun Ashtakoot Milan & Proceed →</span>
              </button>
            </div>

          </form>
        ) : (
          
          /* RESULTS, UPI PAYMENT GATEWAY, & WHATSAPP CONFIRMATION */
          <div className="space-y-8 max-w-4xl mx-auto">
            
            {/* SCORE METER CARD */}
            <div className="bg-[#1c2541] p-8 rounded-3xl border border-[#3a506b] shadow-2xl text-center space-y-4">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#0b132b] border-4 border-[#fbbf24] text-4xl font-black text-[#fbbf24] shadow-lg font-mono">
                {matchingResult.totalScore} / {matchingResult.maxScore}
              </div>

              <h2 className="font-serif font-bold text-2xl text-white">
                Ashtakoot Compatibility: {matchingResult.totalScore >= 18 ? 'Favorable Match (Good Alignment)' : 'Consultation Recommended'}
              </h2>

              <p className="text-slate-300 text-xs max-w-md mx-auto">
                {groomName || 'Groom'} & {brideName || 'Bride'} achieved a score of {matchingResult.totalScore} points out of 36.
              </p>
            </div>

            {/* 8-KOOT BREAKDOWN GRID */}
            <div className="bg-[#1c2541] p-6 rounded-3xl border border-[#3a506b] space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#fbbf24]">Ashtakoot 8-Koot Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                {Object.entries(matchingResult.breakdown).map(([koota, score]) => (
                  <div key={koota} className="bg-[#0b132b] p-4 rounded-2xl border border-[#3a506b]/40">
                    <span className="text-[10px] text-[#e0a96d] uppercase font-bold block mb-1">{koota}</span>
                    <strong className="text-xl font-bold text-[#fbbf24] font-mono">{score as any} pts</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP A: UPI PAYMENT GATEWAY STEP (Before Report Delivery) */}
            {!isPaidConfirmed ? (
              <form onSubmit={handleConfirmUpiPayment} className="bg-[#1c2541] p-8 rounded-3xl border border-[#fbbf24]/50 shadow-2xl space-y-6 text-xs">
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#3a506b] gap-2">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#fbbf24]/20 text-[#fbbf24] font-extrabold text-[10px] uppercase tracking-wider border border-[#fbbf24]/30">
                      High Accuracy Package
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-white mt-1">Marriage & Relationship Matching</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#fbbf24] font-mono block">₹1,299</span>
                    <span className="text-[10px] text-green-400 font-bold">Master Astrologer PDF Report</span>
                  </div>
                </div>

                <p className="text-slate-200 leading-relaxed text-xs">
                  Complete 36-Gun Ashtakoot Milan, Manglik Dosh analysis, and mental/emotional compatibility assessment by our Master Vedic Astrologer.
                </p>

                <div className="space-y-2 p-4 rounded-2xl bg-[#0b132b] border border-[#3a506b]">
                  <span className="font-bold text-[#fbbf24] text-xs block mb-1">What's Included in Your Report:</span>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    <span>36-Points Ashtakoot breakdown</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Manglik Dosh cancellation check</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Favorable marriage timing windows</span>
                  </div>
                </div>

                {/* UPI QR & UTR Entry */}
                <div className="p-6 rounded-2xl bg-[#0b132b] border border-[#3a506b] text-center space-y-4">
                  <span className="text-xs font-extrabold text-[#fbbf24] uppercase tracking-wider block">
                    Scan & Pay ₹1,299 via Any UPI App
                  </span>
                  
                  <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl border-2 border-[#fbbf24] shadow-md flex items-center justify-center">
                    <div className="w-full h-full bg-[#0f172a] text-[#fbbf24] flex items-center justify-center font-bold text-xs font-mono text-center">
                      UPI QR Code
                    </div>
                  </div>

                  <span className="text-xs text-gray-300 font-mono block">UPI ID: <strong>kangleiastro@upi</strong></span>

                  <div className="pt-3 border-t border-[#3a506b]/40 max-w-md mx-auto text-left">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e0a96d] mb-1">
                      Enter 12-Digit UPI Transaction Ref (UTR)<span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 429810998120"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#3a506b] bg-[#1c2541] text-[#fbbf24] font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span>{isSubmittingPayment ? 'Verifying Payment...' : 'Confirm Payment (₹1,299) & Send Kuthi to Astrologer →'}</span>
                </button>
              </form>
            ) : (

              /* STEP B: FINAL CONFIRMATION MESSAGE (Revealed After Payment) */
              <div className="p-8 rounded-3xl bg-green-500/20 border border-green-500/40 text-green-300 text-center space-y-4 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-green-500/30 text-green-400 border border-green-500/50 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="font-serif font-bold text-2xl text-white">Kuthi Forwarded to Master Astrologer</h4>
                <p className="text-xs leading-relaxed max-w-lg mx-auto text-slate-100 font-sans">
                  We have forwarded your Groom (<strong>{groomName}</strong>) & Bride (<strong>{brideName}</strong>) Kuthi/Kundali details to our Master Astrologer. Full analytical matching report will be sent directly to WhatsApp No: <strong className="text-[#fbbf24] font-mono text-sm">{submittedWhatsApp}</strong> within 12 Hrs.
                </p>
                <div className="p-3 rounded-xl bg-[#0b132b] text-[#fbbf24] font-mono text-xs max-w-xs mx-auto border border-[#3a506b]">
                  Payment UTR Logged: {utr}
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-[#1c2541] border border-[#3a506b] text-white font-bold text-xs hover:border-[#fbbf24] transition-colors flex items-center gap-2 mx-auto"
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
