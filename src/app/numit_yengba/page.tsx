'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Calendar, Clock, MapPin, FileText, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, QrCode, Upload, FileUp, Plus, Trash2, Eye, Sun, ChevronDown, MessageSquare 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

export interface NumitReasonOption {
  id: string;
  title: string;
  price: number;
  description: string;
}

const DEFAULT_NUMIT_REASONS: NumitReasonOption[] = [
  { id: 'numit-1', title: 'Yum Sangba (Housewarming Date)', price: 501, description: 'Auspicious muhurat & Griha Pravesh alignment' },
  { id: 'numit-2', title: 'Luhongba (Marriage & Wedding Date)', price: 751, description: 'Subha Vivaha muhurat & lagna calculations' },
  { id: 'numit-3', title: 'Swasti Puja & Naming (Child Naming)', price: 351, description: 'Nakshatra & auspicious naming date' },
  { id: 'numit-4', title: 'Business & Office Opening', price: 501, description: 'Shubh Labh & trade inauguration date' },
  { id: 'numit-5', title: 'Vehicle & Property Registration', price: 351, description: 'Auspicious vehicle delivery & land purchase' },
  { id: 'numit-6', title: 'General Numit Yengba (Auspicious Date)', price: 401, description: 'General travel, ritual, or important event' },
];

function NumitYengbaContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderRef, setOrderRef] = useState<string>('');

  // Primary Contact Info
  const [clientName, setClientName] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');

  // Reasons list (from admin or default)
  const [reasons, setReasons] = useState<NumitReasonOption[]>(DEFAULT_NUMIT_REASONS);
  const [selectedReason, setSelectedReason] = useState<NumitReasonOption>(DEFAULT_NUMIT_REASONS[0]);

  // Uploaded Files
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Checkbox: I don't have Kuthi paper
  const [noKuthiPaper, setNoKuthiPaper] = useState(false);
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('Imphal, Manipur');
  const [notes, setNotes] = useState('');

  // Payment State
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const ref = 'NY-2026-' + Math.floor(1000 + Math.random() * 9000);
    setOrderRef(ref);

    // Fetch custom reasons configured by admin if available
    fetch('/api/admin/services')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.numitReasons && data.numitReasons.length > 0) {
          setReasons(data.numitReasons);
          setSelectedReason(data.numitReasons[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim()) {
      setErrorMsg('Please enter your Name.');
      return;
    }

    if (!whatsappNo.trim()) {
      setErrorMsg('Please enter your WhatsApp Number.');
      return;
    }

    if (noKuthiPaper) {
      if (!dob || !tob || !pob.trim()) {
        setErrorMsg('Please enter Date of Birth, Time of Birth, and Place of Birth.');
        return;
      }
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
        category: 'numit_yengba',
        clientName,
        whatsappNo,
        reasonTitle: selectedReason.title,
        price: selectedReason.price,
        noKuthiPaper,
        dob,
        tob,
        pob,
        notes,
        filesCount: uploadedFiles.length,
        fileNames: uploadedFiles.map((f) => f.name),
        totalAmount: selectedReason.price,
        utr: utrNumber,
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
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-1 sm:pt-2 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        
        {/* Progress Tracker */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-2">
            <Sun className="w-4 h-4 text-[#d97706]" />
            Manipuri Numit Yengba (Auspicious Date Selection)
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a]">
            Numit Yengba <span className="text-[#b45309]">Consultation Form</span>
          </h1>

          <div className="flex items-center justify-between max-w-md mx-auto mt-6 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#f3e8d2] -translate-y-1/2 z-0" />
            
            {[
              { num: 1, label: 'Form & Reason' },
              { num: 2, label: 'UPI Summary & Payment' },
              { num: 3, label: 'Order Confirmation' },
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

        {/* Error Notice */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 1: NUMIT YENGBA FORM */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white p-6 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-xl relative overflow-hidden text-left space-y-6"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#78350f] via-[#d97706] to-[#f59e0b]" />

              <div className="flex items-center justify-between border-b border-[#fde68a]/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Auspicious Date (Numit Yengba) Details</h3>
                    <p className="text-xs text-gray-500 font-sans">Select purpose and provide contact information</p>
                  </div>
                </div>

                <span className="font-mono font-extrabold text-sm text-[#b45309] bg-[#fef3c7] px-3.5 py-1.5 rounded-xl border border-[#fde68a]">
                  Fee: ₹{selectedReason.price}
                </span>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-6 text-xs font-sans">
                
                {/* 1. NAME & WHATSAPP NO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Your Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      WhatsApp Mobile Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={whatsappNo}
                      onChange={(e) => setWhatsappNo(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. REASON FOR CONSULTATION / LOOKING DATE (DYNAMIC MENU) */}
                <div className="space-y-2 pt-2">
                  <label className="block font-bold text-[#0f172a] uppercase tracking-wider">
                    Select Reason for Numit Yengba (Auspicious Date)<span className="text-red-500">*</span>
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reasons.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedReason(r)}
                        className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          selectedReason.id === r.id
                            ? 'bg-[#fef3c7] border-[#d97706] shadow-md ring-2 ring-[#d97706]/30'
                            : 'bg-[#fefcf6] border-[#fde68a] hover:bg-[#fef3c7]/60'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-xs text-[#0f172a]">{r.title}</span>
                          <span className="font-mono font-black text-xs text-[#b45309]">₹{r.price}</span>
                        </div>
                        {r.description && (
                          <span className="text-[11px] text-gray-500 mt-1 block">{r.description}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. OPTIONAL KUTHI FILE UPLOAD */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="block font-bold text-[#0f172a] uppercase tracking-wider">
                      Upload Kuthi / Kundli Paper Photos (Optional)
                    </label>
                    <span className="text-[10px] text-gray-500">Multiple files allowed</span>
                  </div>

                  <div className="border-2 border-dashed border-[#fde68a] rounded-2xl p-4 bg-[#fefcf6] text-center hover:border-[#d97706] transition-colors relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Upload className="w-6 h-6 text-[#d97706]" />
                      <span className="font-bold text-xs text-[#0f172a]">
                        Click or Drag & Drop Kuthi / Horoscope Files
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Helps astrologer calculate precise lagna & nakshatra
                      </span>
                    </div>
                  </div>

                  {/* List of Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <FileUp className="w-4 h-4 text-[#d97706] shrink-0" />
                            <span className="font-bold text-gray-800 truncate">{file.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono">({(file.size / 1024).toFixed(0)} KB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. CHECKBOX: I DON'T HAVE KUTHI PAPER */}
                <div className="pt-2 border-t border-[#f3e8d2]">
                  <label className="inline-flex items-center gap-2.5 text-xs font-bold text-[#b45309] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noKuthiPaper}
                      onChange={(e) => setNoKuthiPaper(e.target.checked)}
                      className="rounded text-[#d97706] focus:ring-[#d97706] w-4 h-4"
                    />
                    <span>☑ I don't have a Kuthi paper (Enter Birth Details Manually)</span>
                  </label>

                  {/* Manual Birth Details Inputs - Smoothly shown ONLY when checkbox is checked */}
                  <AnimatePresence>
                    {noKuthiPaper && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-4 overflow-hidden"
                      >
                        <div className="text-[11px] font-bold text-[#78350f] uppercase tracking-wider">
                          Enter Birth Details Manually
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase">
                              Date of Birth<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase">
                              Time of Birth<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="time"
                              value={tob}
                              onChange={(e) => setTob(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase">
                              Place of Birth<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Imphal, Thoubal"
                              value={pob}
                              onChange={(e) => setPob(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase">
                            Specific Preferred Timeframe or Event Details (Optional)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Enter any specific preferred month, week, or notes for the astrologer"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to UPI Payment (₹{selectedReason.price})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </motion.div>
          )}

          {/* STEP 2: SUMMARY & UPI PAYMENT PAGE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b45309] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Form Particulars</span>
              </button>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl relative overflow-hidden space-y-4">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#78350f] via-[#d97706] to-[#f59e0b]" />

                <div className="flex justify-between items-center pb-4 border-b border-[#fde68a]/50">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Numit Yengba Order Summary</h3>
                    <p className="text-xs text-gray-500 font-sans">Order Ref: <span className="font-mono font-bold text-[#b45309]">{orderRef}</span></p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] text-[#b45309] font-extrabold text-sm border border-[#fde68a]">
                    Total Fee: ₹{selectedReason.price}
                  </span>
                </div>

                <div className="space-y-2 bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a] text-xs font-sans text-gray-700">
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-bold text-[#0f172a]">{clientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">WhatsApp Number:</span>
                    <span className="font-bold text-[#0f172a]">{whatsappNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">Numit Yengba Purpose:</span>
                    <span className="font-bold text-[#b45309]">{selectedReason.title}</span>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="pt-1">
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Attached Files ({uploadedFiles.length}):</span>
                      <span className="font-semibold text-[#0f172a] block">{uploadedFiles.map((f) => f.name).join(', ')}</span>
                    </div>
                  )}

                  {noKuthiPaper && (
                    <div className="pt-1">
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Birth Details:</span>
                      <span className="font-semibold text-[#0f172a] block">DOB: {dob} • TOB: {tob} • POB: {pob}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* UPI Payment Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-[#b45309]">
                  <QrCode className="w-6 h-6" />
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Scan & Pay ₹{selectedReason.price} via UPI</h3>
                </div>

                <div className="bg-[#fef3c7] p-6 rounded-2xl border border-[#fde68a] max-w-sm mx-auto">
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
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? 'Submitting Order...' : `Confirm Order (₹${selectedReason.price}) →`}
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
                🙏 Numit Yengba Order Successfully Submitted!
              </h2>

              <div className="bg-[#fefcf6] p-6 rounded-2xl border border-[#fde68a] text-xs sm:text-sm text-[#78350f] leading-relaxed mb-8 font-medium shadow-xs">
                Your Numit Yengba request for <strong className="font-bold">{selectedReason.title}</strong> has been assigned to our Acharyas. Detailed auspicious date report & voice guidance will be delivered to your WhatsApp:
                <strong className="block text-base text-[#b45309] font-bold mt-2 font-mono">
                  {whatsappNo}
                </strong>
                <span className="inline-block mt-3 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                  ⚡ Delivery: Within 24 Hours on WhatsApp
                </span>
              </div>

              <div className="bg-[#fffdfa] rounded-2xl p-5 text-left border border-[#f3e8d2] space-y-2.5 text-xs mb-8 font-sans">
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Order Reference:</span>
                  <span className="font-mono text-[#b45309] font-bold">{orderRef}</span>
                </div>
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Client Name:</span>
                  <span className="font-bold text-[#0f172a]">{clientName}</span>
                </div>
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Purpose:</span>
                  <span className="font-bold text-[#0f172a]">{selectedReason.title}</span>
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
                  href={`https://wa.me/919876543210?text=Hello%20KuthiYengpham,%20I%20have%20submitted%20my%20Numit%20Yengba%20order%20${orderRef}`}
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

export default function NumitYengbaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdfa] pt-20 text-center text-[#0f172a]">Loading Numit Yengba Form...</div>}>
      <NumitYengbaContent />
    </Suspense>
  );
}
