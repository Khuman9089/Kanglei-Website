'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Upload, FileText, CheckCircle2, AlertCircle, Sparkles, MessageSquare, ArrowRight, RefreshCw, User, Calendar, Clock, MapPin, Compass, QrCode, ShieldCheck, Check, Trash2 
} from 'lucide-react';

export default function PaknaWainabaPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderRef, setOrderRef] = useState<string>('');

  // Primary Input: Top WhatsApp Number to receive report
  const [whatsappNo, setWhatsappNo] = useState('');

  // Groom State
  const [groomName, setGroomName] = useState('');
  const [groomKuthiFile, setGroomKuthiFile] = useState<File | null>(null);
  const [groomNoKuthi, setGroomNoKuthi] = useState(false);
  const [groomDob, setGroomDob] = useState('');
  const [groomTob, setGroomTob] = useState('');
  const [groomPob, setGroomPob] = useState('Imphal, Manipur');

  // Bride State
  const [brideName, setBrideName] = useState('');
  const [brideKuthiFile, setBrideKuthiFile] = useState<File | null>(null);
  const [brideNoKuthi, setBrideNoKuthi] = useState(false);
  const [brideDob, setBrideDob] = useState('');
  const [brideTob, setBrideTob] = useState('');
  const [bridePob, setBridePob] = useState('Imphal, Manipur');

  // Payment State
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    const ref = 'PW-2026-' + Math.floor(1000 + Math.random() * 9000);
    setOrderRef(ref);
  }, []);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!whatsappNo.trim()) {
      setErrorMsg('Please enter your WhatsApp Number to receive the Master Astrologer report.');
      return;
    }

    if (!groomName.trim()) {
      setErrorMsg("Please enter Groom's Name.");
      return;
    }

    if (!groomKuthiFile && groomNoKuthi && (!groomDob || !groomTob || !groomPob.trim())) {
      setErrorMsg("Please enter Date, Time, and Place of Birth for Groom (or upload Groom's Kuthi paper).");
      return;
    }

    if (!brideName.trim()) {
      setErrorMsg("Please enter Bride's Name.");
      return;
    }

    if (!brideKuthiFile && brideNoKuthi && (!brideDob || !brideTob || !bridePob.trim())) {
      setErrorMsg("Please enter Date, Time, and Place of Birth for Bride (or upload Bride's Kuthi paper).");
      return;
    }

    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!utrNumber.trim() && !screenshotFile) {
      setErrorMsg('Please enter the 12-digit UPI Transaction UTR Number or upload a Payment Screenshot.');
      return;
    }

    setLoading(true);

    const orderPayload = {
      action: 'CREATE_ORDER',
      order: {
        category: 'pakna_wainaba',
        serviceTitle: 'Pakna-Wainaba (পক্ন-ৱাইনবা <ctrl42> Master Astrologer Compatibility)',
        clientName: `${groomName} & ${brideName}`,
        whatsappNo: whatsappNo,
        gender: 'Couple',
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
        utr: utrNumber,
        totalAmount: 1299,
      },
    };

    fetch('/api/kuthi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })
      .then(() => {
        setLoading(false);
        setStep(3);
      })
      .catch(() => {
        setLoading(false);
        setStep(3);
      });
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans antialiased">
      <main className="flex-1 pt-1 sm:pt-2 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            পক্ন-ৱাইনবা য়েংবা • Master Astrologer Analysis
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a] tracking-tight">
            Pakna-Wainaba <span className="text-[#b45309]">Paid Consultation</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-2 max-w-2xl mx-auto font-sans">
            Deep 36-Gun Ashtakoot Milan, D1 & D9 Navamsha Analysis, Manglik Dosh check, and voice report delivered directly to WhatsApp.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 1: FORM */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-8">
              
              {/* TOP PRIMARY FIELD: WHATSAPP NUMBER TO RECEIVE REPORT */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#fde68a] shadow-xl text-center space-y-3">
                <label className="block text-sm font-bold uppercase tracking-wider text-[#b45309]">
                  WhatsApp Number to Receive Master Astrologer Report<span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 max-w-lg mx-auto">
                  Our Master Astrologer will perform detailed D1/D9 Navamsha compatibility analysis and send the PDF report & voice notes directly to this WhatsApp number.
                </p>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98620 12345"
                  value={whatsappNo}
                  onChange={(e) => setWhatsappNo(e.target.value)}
                  className="w-full max-w-md h-12 px-4 rounded-xl border border-gray-300 bg-[#fefcf6] text-[#b45309] font-mono font-bold text-base text-center focus:border-[#d97706] focus:outline-none shadow-xs mx-auto block"
                />
              </div>

              {/* SIDE-BY-SIDE GROOM & BRIDE INTAKE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* LEFT COLUMN: GROOM DETAILS */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl space-y-5 text-left">
                  <div className="flex items-center gap-3 pb-4 border-b border-[#f3e8d2]">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-lg">
                      👦
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-[#0f172a]">Groom Details</h3>
                      <p className="text-xs text-gray-500">Upload Kuthi paper or enter birth data</p>
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

                  {/* Checkbox: Groom does not have Kuthi paper */}
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

                  {/* Groom Manual Birth Details */}
                  <AnimatePresence>
                    {!groomKuthiFile && groomNoKuthi && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-3 overflow-hidden"
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
                      <p className="text-xs text-gray-500">Upload Kuthi paper or enter birth data</p>
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

                  {/* Checkbox: Bride does not have Kuthi paper */}
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

                  {/* Bride Manual Birth Details */}
                  <AnimatePresence>
                    {!brideKuthiFile && brideNoKuthi && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-3 overflow-hidden"
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

              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-opacity inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span>Proceed to UPI Payment (₹1,299) →</span>
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: UPI PAYMENT GATEWAY */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white p-8 rounded-3xl border border-[#fde68a] shadow-2xl space-y-6 text-xs text-left max-w-3xl mx-auto"
            >
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#fde68a] gap-2">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] font-extrabold text-[10px] uppercase tracking-wider border border-[#fde68a]">
                    Master Astrologer Package
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a] mt-1">Pakna-Wainaba Marriage Compatibility</h3>
                  <p className="text-xs text-gray-500 font-mono">Order Ref: <strong className="text-[#b45309]">{orderRef}</strong></p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#b45309] font-mono block">₹1,299</span>
                  <span className="text-[10px] text-green-700 font-bold">PDF & Voice Guidance on WhatsApp</span>
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

                <form onSubmit={handlePaymentSubmit} className="pt-3 border-t border-[#fde68a] max-w-md mx-auto text-left space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Enter 12-Digit UPI Transaction Ref (UTR)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 429810998120"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-[#b45309] font-mono font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Upload Payment Screenshot (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && setScreenshotFile(e.target.files[0])}
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0f172a] file:text-white cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <span>{loading ? 'Verifying Payment...' : 'Confirm Payment (₹1,299) & Send Kuthi to Astrologer →'}</span>
                  </button>
                </form>
              </div>

            </motion.div>
          )}

          {/* STEP 3: ORDER CONFIRMATION */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 sm:p-12 rounded-3xl border border-[#f3e8d2] shadow-2xl text-center max-w-2xl mx-auto relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-[#d97706] to-green-500" />

              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200 shadow-md">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0f172a] mb-3">
                🙏 Pakna-Wainaba Order Forwarded to Master Astrologer!
              </h2>

              <div className="bg-[#fefcf6] p-6 rounded-2xl border border-[#fde68a] text-xs sm:text-sm text-[#78350f] leading-relaxed mb-8 font-medium shadow-xs">
                We have received Groom (<strong>{groomName}</strong>) & Bride (<strong>{brideName}</strong>) Kuthi paper details. Full analytical matching report & voice guidance will be sent to WhatsApp:
                <strong className="block text-base text-[#b45309] font-bold mt-2 font-mono">
                  {whatsappNo}
                </strong>
                <span className="inline-block mt-3 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                  ⚡ Digital Delivery: Within 12-24 Hours on WhatsApp
                </span>
              </div>

              <div className="bg-[#fffdfa] rounded-2xl p-5 text-left border border-[#f3e8d2] space-y-2.5 text-xs mb-8 font-sans">
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Order Reference:</span>
                  <span className="font-mono text-[#b45309] font-bold">{orderRef}</span>
                </div>
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Couple:</span>
                  <span className="font-bold text-[#0f172a]">{groomName} & {brideName}</span>
                </div>
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Submitted UTR:</span>
                  <span className="font-mono text-gray-800">{utrNumber || 'Proof Attached'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0f172a] text-[#fbbf24] font-bold text-xs hover:bg-[#1e293b] transition-colors"
                >
                  Return to Homepage
                </Link>

                <a
                  href={`https://wa.me/919876543210?text=Hello%20KuthiYengpham,%20I%20have%20submitted%20my%20Pakna-Wainaba%20order%20${orderRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-green-600 text-white font-bold text-xs hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Support on WhatsApp</span>
                </a>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
