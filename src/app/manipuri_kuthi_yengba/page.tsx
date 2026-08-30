'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Calendar, Clock, MapPin, FileText, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, QrCode, Upload, FileUp, Plus, Trash2, Eye, MessageSquare 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

interface KuthiSlot {
  id: string;
  label: string;
  file: File | null;
}

function ManipuriKuthiYengbaContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderRef, setOrderRef] = useState<string>('');

  // Primary Contact Info
  const [clientName, setClientName] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');

  // Price per person / Kuthi
  const pricePerKuthi = 499;

  // Kuthi Slots (Default 1 slot)
  const [slots, setSlots] = useState<KuthiSlot[]>([
    { id: 'slot-1', label: 'Kuthi Paper #1', file: null },
  ]);

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
    const ref = 'KY-2026-' + Math.floor(1000 + Math.random() * 9000);
    setOrderRef(ref);
  }, []);

  // Update Slot count based on 1 to 5 selector
  const handleCountSelect = (count: number) => {
    setErrorMsg('');
    const currentCount = slots.length;
    if (count > currentCount) {
      const newSlots: KuthiSlot[] = [];
      for (let i = currentCount + 1; i <= count; i++) {
        newSlots.push({
          id: `slot-${Date.now()}-${i}`,
          label: `Kuthi Paper #${i}`,
          file: null,
        });
      }
      setSlots([...slots, ...newSlots]);
    } else if (count < currentCount) {
      setSlots(slots.slice(0, count));
    }
  };

  // Add one more slot (+ Add More button)
  const handleAddSlot = () => {
    const nextNum = slots.length + 1;
    setSlots([
      ...slots,
      {
        id: `slot-${Date.now()}-${nextNum}`,
        label: `Kuthi Paper #${nextNum}`,
        file: null,
      },
    ]);
  };

  // Remove specific slot
  const handleRemoveSlot = (id: string) => {
    if (slots.length <= 1) return;
    const updated = slots.filter((s) => s.id !== id).map((s, idx) => ({
      ...s,
      label: `Kuthi Paper #${idx + 1}`,
    }));
    setSlots(updated);
  };

  // Upload file for specific slot
  const handleFileChange = (id: string, file: File | null) => {
    setSlots(slots.map((s) => (s.id === id ? { ...s, file } : s)));
  };

  // Calculate Total Amount
  const totalAmount = pricePerKuthi * slots.length;
  const uploadedFilesCount = slots.filter((s) => s.file !== null).length;

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

    if (noKuthiPaper || uploadedFilesCount === 0) {
      if (!dob || !tob || !pob.trim()) {
        setErrorMsg('Please enter Date of Birth, Time of Birth, and Place of Birth (or upload Kuthi Paper files).');
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
        category: 'kuthi_yengba',
        clientName,
        whatsappNo,
        personCount: slots.length,
        uploadedFiles: slots.filter((s) => s.file !== null).map((s) => s.file?.name),
        noKuthiPaper,
        dob,
        tob,
        pob,
        notes,
        totalAmount,
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
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Manipuri Kuthi Yengba Form
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a]">
            Kuthi Yengba <span className="text-[#b45309]">Intake Form</span>
          </h1>

          <div className="flex items-center justify-between max-w-md mx-auto mt-6 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#f3e8d2] -translate-y-1/2 z-0" />
            
            {[
              { num: 1, label: 'Upload Kuthi' },
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
          
          {/* STEP 1: CLEAN INTAKE FORM */}
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
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Kuthi Paper Reading Form</h3>
                    <p className="text-xs text-gray-500 font-sans">Fill in your contact details and upload Kuthi paper photos</p>
                  </div>
                </div>

                <span className="font-mono font-extrabold text-sm text-[#b45309] bg-[#fef3c7] px-3.5 py-1.5 rounded-xl border border-[#fde68a]">
                  Total: ₹{totalAmount}
                </span>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-6 text-xs font-sans">
                
                {/* 1. NAME & WHATSAPP NO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Your Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      WhatsApp Number<span className="text-red-500">*</span>
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

                {/* 2. HOW MANY PERSON SELECTOR (1, 2, 3, 4, 5) */}
                <div className="space-y-2 pt-2">
                  <label className="block font-bold text-[#0f172a] uppercase tracking-wider">
                    How Many Person / Kuthi Papers?<span className="text-red-500">*</span>
                  </label>
                  
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleCountSelect(num)}
                        className={`py-3 rounded-2xl font-black text-sm transition-all border cursor-pointer ${
                          slots.length === num
                            ? 'bg-[#d97706] text-white border-[#d97706] shadow-md ring-2 ring-[#d97706]/30 scale-[1.02]'
                            : 'bg-[#fefcf6] text-[#0f172a] border-[#fde68a] hover:bg-[#fef3c7]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. UPLOAD KUTHI FILE BOXES */}
                <div className="space-y-4 pt-2">
                  <label className="block font-bold text-[#0f172a] uppercase tracking-wider">
                    Upload Kuthi Paper Files ({slots.length} {slots.length === 1 ? 'File' : 'Files'})
                  </label>

                  <div className="space-y-3">
                    {slots.map((slot, index) => (
                      <div
                        key={slot.id}
                        className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] flex flex-col sm:flex-row items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="w-7 h-7 rounded-full bg-[#d97706] text-white font-black text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-bold text-xs text-[#0f172a]">{slot.label}</span>
                        </div>

                        <div className="flex-1 w-full sm:w-auto flex items-center gap-2 justify-end">
                          {slot.file ? (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#fde68a] text-xs max-w-xs truncate">
                              <FileUp className="w-4 h-4 text-[#d97706] shrink-0" />
                              <span className="font-bold text-gray-800 truncate">{slot.file.name}</span>
                              <button
                                type="button"
                                onClick={() => handleFileChange(slot.id, null)}
                                className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer ml-1"
                                title="Remove File"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="px-4 py-2 rounded-xl bg-white border-2 border-dashed border-[#d97706] text-[#b45309] font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-[#fef3c7] transition-all">
                              <Upload className="w-4 h-4 text-[#d97706]" />
                              <span>Upload {slot.label}</span>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => e.target.files && handleFileChange(slot.id, e.target.files[0])}
                                className="hidden"
                              />
                            </label>
                          )}

                          {slots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSlot(slot.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                              title="Remove Kuthi slot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* + ADD MORE KUTHI FILE BUTTON BELOW */}
                  <div className="pt-1 flex justify-center">
                    <button
                      type="button"
                      onClick={handleAddSlot}
                      className="px-5 py-2.5 rounded-xl bg-white border-2 border-dashed border-[#d97706] text-[#b45309] font-bold text-xs hover:bg-[#fef3c7] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add More Kuthi File</span>
                    </button>
                  </div>
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
                    <span>☑ I don't have Kuthi paper (Enter Birth Details Manually)</span>
                  </label>

                  {/* Manual Birth Details Inputs */}
                  {(noKuthiPaper || uploadedFilesCount === 0) && (
                    <div className="mt-3 p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-4">
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
                          Specific Questions / Notes for Astrologer (Optional)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Enter any specific concerns (e.g. career, health, marriage)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to UPI Payment Summary (₹{totalAmount})</span>
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
                    <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Kuthi Yengba Order Summary</h3>
                    <p className="text-xs text-gray-500 font-sans">Order Ref: <span className="font-mono font-bold text-[#b45309]">{orderRef}</span></p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] text-[#b45309] font-extrabold text-sm border border-[#fde68a]">
                    Total Fee: ₹{totalAmount}
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
                    <span className="text-gray-500">Total Kuthi Papers:</span>
                    <span className="font-bold text-[#b45309]">{slots.length} Paper(s)</span>
                  </div>

                  {uploadedFilesCount > 0 ? (
                    <div className="pt-1">
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Attached Kuthi Files:</span>
                      <ul className="list-disc list-inside space-y-1 font-semibold text-[#0f172a] mt-1">
                        {slots.filter((s) => s.file !== null).map((s) => (
                          <li key={s.id}>{s.label}: {s.file?.name}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
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
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Scan & Pay ₹{totalAmount} via UPI</h3>
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
                    {loading ? 'Submitting Order...' : `Confirm Order (₹${totalAmount}) →`}
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
                🙏 Kuthi Yengba Order Successfully Submitted!
              </h2>

              <div className="bg-[#fefcf6] p-6 rounded-2xl border border-[#fde68a] text-xs sm:text-sm text-[#78350f] leading-relaxed mb-8 font-medium shadow-xs">
                Your Kuthi reading request for <strong className="font-bold">{slots.length} Paper(s)</strong> has been assigned to our Acharyas. Detailed astrological report & voice notes will be delivered to your WhatsApp:
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
                  href={`https://wa.me/919876543210?text=Hello%20KuthiYengpham,%20I%20have%20submitted%20my%20Kuthi%20Yengba%20order%20${orderRef}`}
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

export default function ManipuriKuthiYengbaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdfa] pt-20 text-center text-[#0f172a]">Loading Kuthi Yengba Form...</div>}>
      <ManipuriKuthiYengbaContent />
    </Suspense>
  );
}
