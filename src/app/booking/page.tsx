'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, MapPin, Calendar, Clock, FileText, Upload, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, QrCode, Lock, MessageSquare } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

function KuthiYengbaContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderRef, setOrderRef] = useState<string>('');

  // Form State
  const [name, setName] = useState('');
  const [sex, setSex] = useState('Male');
  const [mobile, setMobile] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [email, setEmail] = useState('');
  
  // Kuthi File & Conditional Required Fields
  const [kuthiFile, setKuthiFile] = useState<File | null>(null);
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');
  const [question, setQuestion] = useState('');

  // Payment State
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Generate Kuthi Yengba unique reference number
    const ref = 'KY-2026-' + Math.floor(1000 + Math.random() * 9000);
    setOrderRef(ref);
  }, []);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMobile(val);
    if (sameAsMobile) {
      setWhatsappNo(val);
    }
  };

  const handleSameMobileToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsMobile(checked);
    if (checked) {
      setWhatsappNo(mobile);
    }
  };

  const handleKuthiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKuthiFile(e.target.files[0]);
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation logic: If kuthiFile is NOT uploaded, DOB, TOB, and POB are compulsory!
    if (!kuthiFile) {
      if (!dob || !tob || !pob.trim()) {
        setErrorMsg('Since no Kuthi file is uploaded, Date of Birth, Time of Birth, and Place of Birth are compulsory!');
        return;
      }
    }

    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!utrNumber.trim() && !screenshotFile) {
      setErrorMsg('Please provide either the 12-digit UTR Transaction Number or upload a Payment Proof Screenshot.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Proceed to Thank You Confirmation Page
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        {/* Progress Tracker */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            KangleiAstro Manipur Vedic Service
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a]">
            Kuthi Yengba <span className="text-[#b45309]">(Horoscope Analysis & Remedies)</span>
          </h1>

          <div className="flex items-center justify-between max-w-md mx-auto mt-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#f3e8d2] -translate-y-1/2 z-0" />
            
            {[
              { num: 1, label: 'Kuthi & Client Details' },
              { num: 2, label: 'UPI Summary & Payment' },
              { num: 3, label: 'Confirmation' },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step === s.num
                      ? 'bg-[#d97706] text-white ring-4 ring-[#d97706]/20 scale-110 shadow-md'
                      : step > s.num
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-[#f3e8d2] text-gray-400'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-[11px] mt-2 font-bold ${step >= s.num ? 'text-[#0f172a]' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Error Notice */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 1: KUTHI & CLIENT DETAILS FORM */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-6 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-xl relative overflow-hidden text-left"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#fde68a]/50">
                <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#0f172a]">Kuthi Yengba Form</h3>
                  <p className="text-xs text-gray-500 font-sans">Upload your existing Kuthi photo OR enter birth details</p>
                </div>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-6 text-xs font-sans">
                
                {/* ROW 1: Name, Sex, Email */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter client's full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Sex / Gender<span className="text-red-500">*</span>
                    </label>
                    <select
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-4">
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Email Address<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* ROW 2: Mobile & WhatsApp No */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Mobile Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={mobile}
                      onChange={handleMobileChange}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-[#0f172a] uppercase tracking-wider">
                        WhatsApp Number<span className="text-red-500">*</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sameAsMobile}
                          onChange={handleSameMobileToggle}
                          className="rounded text-[#d97706] focus:ring-[#d97706]"
                        />
                        <span>Same as Mobile</span>
                      </label>
                    </div>
                    <input
                      type="tel"
                      required
                      disabled={sameAsMobile}
                      placeholder="+91 98765 43210"
                      value={sameAsMobile ? mobile : whatsappNo}
                      onChange={(e) => setWhatsappNo(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {/* FILE UPLOAD: Upload Physical Kuthi / Kundali Paper */}
                <div className="p-5 rounded-2xl bg-[#fef3c7]/60 border border-[#fde68a]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#d97706]" />
                      <span>Upload Physical Kuthi Paper / Photo (Optional)</span>
                    </label>
                    {kuthiFile && (
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-extrabold text-[10px]">
                        ✓ File Attached
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#78350f] mb-3">
                    If you have a physical Kuthi (Kundali paper), upload its photo/PDF below. <strong>If uploaded, Date/Time/Place of Birth become optional!</strong>
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleKuthiFileUpload}
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#d97706] file:text-white hover:file:bg-[#b45309] cursor-pointer"
                  />
                  {kuthiFile && (
                    <span className="text-[11px] text-green-700 font-bold block mt-2">
                      Attached: {kuthiFile.name} (Birth details below are now OPTIONAL)
                    </span>
                  )}
                </div>

                {/* ROW 3: Date of Birth, Time of Birth, Place of Birth (Compulsory ONLY IF Kuthi File NOT Uploaded) */}
                <div className="p-5 rounded-2xl bg-white border border-[#f3e8d2] space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f3e8d2]">
                    <span className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px]">
                      Birth Details {kuthiFile ? '(Optional - Kuthi Uploaded)' : '(Compulsory - No Kuthi Uploaded)'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      kuthiFile ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                    }`}>
                      {kuthiFile ? 'Optional' : 'Required'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Date of Birth {!kuthiFile && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="date"
                        required={!kuthiFile}
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Time of Birth {!kuthiFile && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="time"
                        required={!kuthiFile}
                        value={tob}
                        onChange={(e) => setTob(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Place of Birth {!kuthiFile && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        required={!kuthiFile}
                        placeholder="e.g. Imphal, Bishnupur"
                        value={pob}
                        onChange={(e) => setPob(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Specific Questions / Notes */}
                <div>
                  <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Specific Life Questions / Notes for Astrologer (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ask specific questions about career, marriage timing, health, or remedies..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* Next Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Order Summary & Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </motion.div>
          )}

          {/* STEP 2: ORDER SUMMARY & UPI PAYMENT PAGE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 text-left"
            >
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b45309] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Form Details</span>
              </button>

              {/* Summary Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#fde68a]/50">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Kuthi Yengba Summary</h3>
                    <p className="text-xs text-gray-500 font-sans">Order Ref: <span className="font-mono font-bold text-[#b45309]">{orderRef}</span></p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] text-[#b45309] font-extrabold text-sm border border-[#fde68a]">
                    Fee: ₹499
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-gray-700 bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a]">
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Client Name</span>
                    <span className="font-bold text-[#0f172a] text-sm">{name} ({sex})</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">WhatsApp Number</span>
                    <span className="font-bold text-[#b45309] text-sm">{whatsappNo || mobile}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Email</span>
                    <span className="font-medium text-[#0f172a]">{email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Kuthi Document</span>
                    <span className="font-medium text-green-700">{kuthiFile ? `✓ ${kuthiFile.name}` : 'Not Uploaded'}</span>
                  </div>
                  {!kuthiFile && (
                    <div className="md:col-span-2 pt-2 border-t border-[#fde68a]">
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Birth Details</span>
                      <span className="font-medium text-[#0f172a]">DOB: {dob} • Time: {tob} • Place: {pob}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* UPI Payment Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl text-center relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 mb-4 text-[#b45309]">
                  <QrCode className="w-6 h-6" />
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Scan & Pay via UPI</h3>
                </div>

                <div className="bg-[#fef3c7] p-6 rounded-2xl border border-[#fde68a] max-w-sm mx-auto mb-6">
                  <div className="w-44 h-44 bg-white mx-auto rounded-xl p-3 border border-[#fde68a] flex items-center justify-center shadow-inner mb-3">
                    <div className="text-center font-mono text-xs text-gray-500">
                      <QrCode className="w-24 h-24 mx-auto text-[#0f172a] mb-1" />
                      <span>[UPI QR Code]</span>
                    </div>
                  </div>
                  <div className="text-xs font-sans">
                    <span className="text-gray-500 block text-[10px] font-bold uppercase">UPI ID</span>
                    <strong className="font-mono text-base text-[#b45309]">kangleiastro@upi</strong>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="max-w-md mx-auto space-y-4 text-xs font-sans text-left">
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Enter 12-Digit UTR / Transaction No.<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 429810394812"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs font-mono font-bold text-[#0f172a] focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Upload Payment Proof Screenshot (Optional)
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
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? 'Submitting Verification...' : 'Submit Kuthi for Verification →'}
                  </button>
                </form>
              </div>

            </motion.div>
          )}

          {/* STEP 3: THANK YOU & CONFIRMATION PAGE */}
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
                🙏 Thank You! Your Kuthi Has Been Submitted Successfully
              </h2>

              {/* Polished Requested Message */}
              <div className="bg-[#fefcf6] p-6 rounded-2xl border border-[#fde68a] text-xs sm:text-sm text-[#78350f] leading-relaxed mb-8 font-medium shadow-xs">
                We have forwarded your <strong>Kuthi (Kundali)</strong> to our Master Vedic Astrologer for detailed examination. Your complete Kuthi Yengba analysis & remedial report will be sent directly to your WhatsApp Number:
                <strong className="block text-base text-[#b45309] font-bold mt-2 font-mono">
                  {whatsappNo || mobile}
                </strong>
                <span className="inline-block mt-3 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                  ⚡ Delivery Window: Within 12 Hours
                </span>
              </div>

              {/* Order Summary Box */}
              <div className="bg-[#fffdfa] rounded-2xl p-5 text-left border border-[#f3e8d2] space-y-2.5 text-xs mb-8 font-sans">
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Order Reference:</span>
                  <span className="font-mono text-[#b45309] font-bold">{orderRef}</span>
                </div>
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Client Name:</span>
                  <span className="font-bold text-[#0f172a]">{name} ({sex})</span>
                </div>
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Submitted UTR:</span>
                  <span className="font-mono text-gray-800">{utrNumber || 'Proof Attached'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verification Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-extrabold uppercase">
                    Verification In Progress
                  </span>
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
                  href={`https://wa.me/919876543210?text=Hello%20KangleiAstro,%20I%20have%20submitted%20my%20Kuthi%20order%20${orderRef}`}
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

export default function KuthiYengbaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdfa] pt-36 text-center text-[#0f172a]">Loading Kuthi Yengba portal...</div>}>
      <KuthiYengbaContent />
    </Suspense>
  );
}
