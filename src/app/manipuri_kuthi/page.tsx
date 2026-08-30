'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, MapPin, Calendar, Clock, FileText, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, QrCode, ShieldCheck, MessageSquare, Home, Baby, Scroll 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

function ManipuriKuthiContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderRef, setOrderRef] = useState<string>('');

  // Mode Selection: 'new_born' vs 'rewrite'
  const [kuthiCategory, setKuthiCategory] = useState<'new_born' | 'rewrite'>('new_born');

  // Pricing Package
  const [packageType, setPackageType] = useState<'standard' | 'deluxe'>('standard');
  const price = packageType === 'deluxe' ? 1499 : 899;

  // Form Fields
  const [personName, setPersonName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('Imphal, Manipur');
  const [address, setAddress] = useState('');
  const [yek, setYek] = useState('');
  const [gotra, setGotra] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [sameAsAddress, setSameAsAddress] = useState(true);
  const [whatsappNo, setWhatsappNo] = useState('');
  const [notes, setNotes] = useState('');

  // Payment State
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const ref = 'KI-2026-' + Math.floor(1000 + Math.random() * 9000);
    setOrderRef(ref);
  }, []);

  const handleAddressToggle = (checked: boolean) => {
    setSameAsAddress(checked);
    if (checked) {
      setDeliveryAddress(address);
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (kuthiCategory === 'rewrite' && !personName.trim()) {
      setErrorMsg("Please enter the Person's Name for Kuthi Rewrite.");
      return;
    }

    if (!fatherName.trim()) {
      setErrorMsg("Please enter Father's Name.");
      return;
    }

    if (!motherName.trim()) {
      setErrorMsg("Please enter Mother's Name.");
      return;
    }

    if (!dob || !tob || !pob.trim()) {
      setErrorMsg("Please enter Date of Birth, Time of Birth, and Place of Birth.");
      return;
    }

    if (!whatsappNo.trim()) {
      setErrorMsg("Please enter WhatsApp Number for order updates & delivery status.");
      return;
    }

    const finalDelivery = sameAsAddress ? address : deliveryAddress;
    if (!finalDelivery.trim()) {
      setErrorMsg("Please enter complete Delivery Address for home dispatch.");
      return;
    }

    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!utrNumber.trim() && !screenshotFile) {
      setErrorMsg("Please enter the 12-digit UPI Transaction UTR Number or upload a Payment Screenshot.");
      return;
    }

    setLoading(true);

    const orderPayload = {
      action: 'CREATE_ORDER',
      order: {
        category: kuthiCategory === 'new_born' ? 'new_born_baby' : 'kuthi_rewrite',
        clientName: kuthiCategory === 'rewrite' ? personName : (personName || `Baby of ${fatherName}`),
        fatherName,
        motherName,
        dob,
        tob,
        pob,
        address,
        yek: yek || 'Not Specified',
        gotra: gotra || 'Not Specified',
        deliveryAddress: sameAsAddress ? address : deliveryAddress,
        whatsappNo,
        question: `[Kuthi Iba - ${kuthiCategory === 'new_born' ? 'Newly Born Baby' : 'Rewrite Kuthi'}] Notes: ${notes}`,
        utr: utrNumber,
        amount: price,
        serviceType: `Kuthi Iba (${packageType === 'deluxe' ? 'Gold Scroll' : 'Standard Scroll'})`,
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
      <main className="flex-1 pt-1 sm:pt-2 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        {/* Progress Tracker */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Sacred Manipuri Kuthi Creation (কুঠি ইবা)
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a]">
            Professional <span className="text-[#b45309]">Kuthi Iba Order Form</span>
          </h1>

          <div className="flex items-center justify-between max-w-md mx-auto mt-6 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#f3e8d2] -translate-y-1/2 z-0" />
            
            {[
              { num: 1, label: 'Kuthi Particulars' },
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
          
          {/* STEP 1: KUTHI IBA INTAKE FORM */}
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
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Kuthi Paper Specifications</h3>
                    <p className="text-xs text-gray-500 font-sans">Choose between Newly Born Baby Kuthi or Kuthi Rewrite (পুনৰ লিখন)</p>
                  </div>
                </div>

                <span className="font-mono font-extrabold text-sm text-[#b45309] bg-[#fef3c7] px-3.5 py-1.5 rounded-xl border border-[#fde68a]">
                  Fee: ₹{price}
                </span>
              </div>

              {/* 1. SELECTION TOGGLE: NEWLY BORN vs REWRITE */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                  Select Kuthi Creation Type<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setKuthiCategory('new_born')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                      kuthiCategory === 'new_born'
                        ? 'bg-[#fefcf6] border-[#d97706] shadow-md ring-2 ring-[#d97706]/20'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      kuthiCategory === 'new_born' ? 'bg-[#d97706] text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Baby className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#0f172a] block">Newly Born Baby (নৱজাতক)</span>
                      <span className="text-[11px] text-gray-500 font-medium block mt-0.5">First-time Kuthi creation for a newly born infant</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setKuthiCategory('rewrite')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                      kuthiCategory === 'rewrite'
                        ? 'bg-[#fefcf6] border-[#d97706] shadow-md ring-2 ring-[#d97706]/20'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      kuthiCategory === 'rewrite' ? 'bg-[#d97706] text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Scroll className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#0f172a] block">Kuthi Rewrite (কুঠি ইবা / পুনৰ লিখন)</span>
                      <span className="text-[11px] text-gray-500 font-medium block mt-0.5">Re-writing / replacing damaged or lost old Kuthi paper</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. PAPER QUALITY PACKAGE SELECTION */}
              <div className="p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-2">
                <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                  Choose Parchment Scroll Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setPackageType('standard')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                      packageType === 'standard' ? 'bg-white border-[#d97706] font-bold text-[#b45309] shadow-xs' : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" name="pkg" checked={packageType === 'standard'} readOnly />
                      <span>Standard Sacred Parchment</span>
                    </div>
                    <span className="font-mono font-extrabold text-sm">₹899</span>
                  </label>

                  <label
                    onClick={() => setPackageType('deluxe')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                      packageType === 'deluxe' ? 'bg-white border-[#d97706] font-bold text-[#b45309] shadow-xs' : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" name="pkg" checked={packageType === 'deluxe'} readOnly />
                      <span>Deluxe Gold-Bordered Scroll</span>
                    </div>
                    <span className="font-mono font-extrabold text-sm">₹1,499</span>
                  </label>
                </div>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-5 text-xs font-sans">
                
                {/* NAME FIELD: Required for Rewrite; Optional for Newly Born */}
                <div>
                  <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    {kuthiCategory === 'rewrite' ? "Person's Name" : "Child's Name (If Named)"}
                    {kuthiCategory === 'rewrite' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    required={kuthiCategory === 'rewrite'}
                    placeholder={kuthiCategory === 'rewrite' ? "Enter full name of the person" : "Enter baby's name if named (e.g. Baby of Sanatomba)"}
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                  />
                </div>

                {/* FATHER'S NAME & MOTHER'S NAME */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Father's Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Father's full name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Mother's Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mother's full name"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* BIRTH TIMINGS: DATE, TIME, PLACE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Date of Birth<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Time of Birth<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={tob}
                      onChange={(e) => setTob(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Place of Birth<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Imphal, Thoubal"
                      value={pob}
                      onChange={(e) => setPob(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* YEK & GOTRA (OPTIONAL) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Yek (এক) <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mangang, Luwang, Khuman"
                      value={yek}
                      onChange={(e) => setYek(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Gotra (গোত্র) <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Shandilya, Kashyap"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* ADDRESS & DELIVERY ADDRESS & WHATSAPP NO */}
                <div className="space-y-4 pt-2 border-t border-[#f3e8d2]">
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Permanent Address / Colony<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House No, Leikai / Colony, Village, City"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (sameAsAddress) setDeliveryAddress(e.target.value);
                      }}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-[#0f172a] uppercase tracking-wider">
                          Delivery Address (For Physical Scroll)<span className="text-red-500">*</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sameAsAddress}
                            onChange={(e) => handleAddressToggle(e.target.checked)}
                            className="rounded text-[#d97706] focus:ring-[#d97706]"
                          />
                          <span>Same as Permanent</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        required
                        disabled={sameAsAddress}
                        placeholder="House No, Landmark, Pincode for Courier"
                        value={sameAsAddress ? address : deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                        WhatsApp Number (For Dispatch Updates)<span className="text-red-500">*</span>
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
                </div>

                {/* Action Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to UPI Payment Summary (₹{price})</span>
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
                    <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Kuthi Iba Order Summary</h3>
                    <p className="text-xs text-gray-500 font-sans">Order Ref: <span className="font-mono font-bold text-[#b45309]">{orderRef}</span></p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] text-[#b45309] font-extrabold text-sm border border-[#fde68a]">
                    Total Fee: ₹{price}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-gray-700 bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a]">
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Category</span>
                    <span className="font-bold text-[#0f172a] text-sm">{kuthiCategory === 'new_born' ? 'Newly Born Baby (নৱজাতক)' : 'Kuthi Rewrite (পুনৰ লিখন)'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Parchment Scroll</span>
                    <span className="font-bold text-[#b45309] text-sm">{packageType === 'deluxe' ? 'Deluxe Gold-Bordered Scroll' : 'Standard Sacred Parchment'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Name</span>
                    <span className="font-bold text-[#0f172a] text-sm">{personName || `Baby of ${fatherName}`}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Parents</span>
                    <span className="font-bold text-[#0f172a] text-sm">F: {fatherName} • M: {motherName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Birth Timings</span>
                    <span className="font-bold text-[#0f172a] text-sm">DOB: {dob} • Time: {tob} • Place: {pob}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Yek & Gotra</span>
                    <span className="font-bold text-[#b45309] text-sm">Yek: {yek || 'N/A'} • Gotra: {gotra || 'N/A'}</span>
                  </div>
                  <div className="md:col-span-2 pt-2 border-t border-[#fde68a]">
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Delivery Address & Contact</span>
                    <span className="font-medium text-[#0f172a]">{sameAsAddress ? address : deliveryAddress} (WhatsApp: {whatsappNo})</span>
                  </div>
                </div>
              </div>

              {/* UPI Payment Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-[#b45309]">
                  <QrCode className="w-6 h-6" />
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Scan & Pay ₹{price} via UPI</h3>
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
                    {loading ? 'Submitting Order...' : `Confirm Order (₹${price}) →`}
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
                🙏 Kuthi Iba Order Successfully Received!
              </h2>

              <div className="bg-[#fefcf6] p-6 rounded-2xl border border-[#fde68a] text-xs sm:text-sm text-[#78350f] leading-relaxed mb-8 font-medium shadow-xs">
                Your handwritten Kuthi paper (<span className="font-extrabold text-[#b45309]">কুঠি ইবা</span>) is being prepared on sacred parchment by experienced Acharyas. Tracking details will be dispatched to your WhatsApp:
                <strong className="block text-base text-[#b45309] font-bold mt-2 font-mono">
                  {whatsappNo}
                </strong>
                <span className="inline-block mt-3 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                  🚚 Home Delivery: Within 3 to 5 Days
                </span>
              </div>

              <div className="bg-[#fffdfa] rounded-2xl p-5 text-left border border-[#f3e8d2] space-y-2.5 text-xs mb-8 font-sans">
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Order Reference:</span>
                  <span className="font-mono text-[#b45309] font-bold">{orderRef}</span>
                </div>
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-bold text-[#0f172a]">{personName || `Baby of ${fatherName}`}</span>
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
                  href={`https://wa.me/919876543210?text=Hello%20KangleiAstro,%20I%20have%20submitted%20my%20Kuthi%20Iba%20order%20${orderRef}`}
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

export default function ManipuriKuthiPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdfa] pt-20 text-center text-[#0f172a]">Loading Kuthi Form...</div>}>
      <ManipuriKuthiContent />
    </Suspense>
  );
}
