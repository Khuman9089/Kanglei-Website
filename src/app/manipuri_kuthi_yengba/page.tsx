'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Calendar, Clock, MapPin, FileText, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, QrCode, ShieldCheck, MessageSquare, Plus, Trash2, Upload, FileUp, Eye 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

interface PersonEntry {
  id: string;
  name: string;
  files: File[];
  noKuthiPaper: boolean;
  dob: string;
  tob: string;
  pob: string;
  notes: string;
}

function ManipuriKuthiYengbaContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderRef, setOrderRef] = useState<string>('');

  // Primary Contact Info
  const [clientName, setClientName] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');

  // Service Selection
  const [selectedSubService, setSelectedSubService] = useState<{ id: string; title: string; price: number }>({
    id: 'sub-101',
    title: 'Standard Kuthi Reading',
    price: 499,
  });

  // Array of Persons (Default: 1 person)
  const [persons, setPersons] = useState<PersonEntry[]>([
    {
      id: 'person-1',
      name: '',
      files: [],
      noKuthiPaper: false,
      dob: '',
      tob: '',
      pob: 'Imphal, Manipur',
      notes: '',
    },
  ]);

  // Payment State
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const ref = 'KY-2026-' + Math.floor(1000 + Math.random() * 9000);
    setOrderRef(ref);
  }, []);

  // Update Person count based on pill selector (1 to 5)
  const handlePersonCountChange = (count: number) => {
    setErrorMsg('');
    const currentCount = persons.length;
    if (count > currentCount) {
      const newItems: PersonEntry[] = [];
      for (let i = currentCount + 1; i <= count; i++) {
        newItems.push({
          id: `person-${Date.now()}-${i}`,
          name: '',
          files: [],
          noKuthiPaper: false,
          dob: '',
          tob: '',
          pob: 'Imphal, Manipur',
          notes: '',
        });
      }
      setPersons([...persons, ...newItems]);
    } else if (count < currentCount) {
      setPersons(persons.slice(0, count));
    }
  };

  // Add person dynamically (+ Add More Person button)
  const handleAddPerson = () => {
    const newId = `person-${Date.now()}-${persons.length + 1}`;
    setPersons([
      ...persons,
      {
        id: newId,
        name: '',
        files: [],
        noKuthiPaper: false,
        dob: '',
        tob: '',
        pob: 'Imphal, Manipur',
        notes: '',
      },
    ]);
  };

  // Remove person
  const handleRemovePerson = (id: string) => {
    if (persons.length <= 1) return;
    setPersons(persons.filter((p) => p.id !== id));
  };

  // Update specific field on person
  const handlePersonFieldChange = (id: string, field: keyof PersonEntry, value: any) => {
    setPersons(
      persons.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Multiple files upload per person
  const handlePersonFileUpload = (id: string, newFiles: FileList | null) => {
    if (!newFiles) return;
    const addedFiles = Array.from(newFiles);
    setPersons(
      persons.map((p) => {
        if (p.id === id) {
          return { ...p, files: [...p.files, ...addedFiles] };
        }
        return p;
      })
    );
  };

  // Remove file from person
  const handleRemovePersonFile = (personId: string, fileIdx: number) => {
    setPersons(
      persons.map((p) => {
        if (p.id === personId) {
          const updated = p.files.filter((_, idx) => idx !== fileIdx);
          return { ...p, files: updated };
        }
        return p;
      })
    );
  };

  // Total calculated fee
  const totalFee = selectedSubService.price * persons.length;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim()) {
      setErrorMsg('Please enter Client / Applicant Name.');
      return;
    }

    if (!whatsappNo.trim()) {
      setErrorMsg('Please enter WhatsApp Mobile Number for delivery.');
      return;
    }

    // Validate each person
    for (let i = 0; i < persons.length; i++) {
      const p = persons[i];
      const pNum = i + 1;

      if (!p.name.trim()) {
        setErrorMsg(`Please enter Name for Person #${pNum}.`);
        return;
      }

      if (p.noKuthiPaper || p.files.length === 0) {
        if (!p.dob || !p.tob || !p.pob.trim()) {
          setErrorMsg(`Please enter Date, Time, and Place of Birth for Person #${pNum} (or attach Kuthi paper files).`);
          return;
        }
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
        personsCount: persons.length,
        persons: persons.map((p) => ({
          name: p.name,
          filesCount: p.files.length,
          fileNames: p.files.map((f) => f.name),
          noKuthiPaper: p.noKuthiPaper,
          dob: p.dob,
          tob: p.tob,
          pob: p.pob,
          notes: p.notes,
        })),
        serviceTitle: selectedSubService.title,
        pricePerPerson: selectedSubService.price,
        totalAmount: totalFee,
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
      <main className="flex-1 pt-1 sm:pt-2 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        {/* Progress Tracker */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Manipuri Kuthi Yengba Consultation
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a]">
            Kuthi Yengba <span className="text-[#b45309]">Intake & Analysis Form</span>
          </h1>

          <div className="flex items-center justify-between max-w-md mx-auto mt-6 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#f3e8d2] -translate-y-1/2 z-0" />
            
            {[
              { num: 1, label: 'Person & Kuthi Details' },
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
          
          {/* STEP 1: INTAKE FORM */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white p-6 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-xl relative overflow-hidden text-left space-y-6"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#78350f] via-[#d97706] to-[#f59e0b]" />

              {/* Service Header & Total Calculator Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#fde68a]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Kuthi Reading Details</h3>
                    <p className="text-xs text-gray-500 font-sans">Upload Kuthi photo/PDF or enter birth timings for astrological analysis</p>
                  </div>
                </div>

                <div className="bg-[#fef3c7] px-4 py-2 rounded-2xl border border-[#fde68a] text-right">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase">Total Fee ({persons.length} {persons.length === 1 ? 'Person' : 'Persons'})</span>
                  <span className="text-xl font-serif font-black text-[#b45309]">₹{totalFee}</span>
                </div>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-6 text-xs font-sans">
                
                {/* 1. PRIMARY CONTACT INFORMATION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a]">
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Client / Applicant Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
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
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. NUMBER OF PERSONS SELECTOR (1, 2, 3, 4, 5) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-[#0f172a] uppercase tracking-wider">
                      How Many Persons for Kuthi Yengba?<span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-gray-500 font-medium">Select count or use + icon below</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handlePersonCountChange(num)}
                        className={`py-3 rounded-2xl font-black text-sm transition-all border cursor-pointer ${
                          persons.length === num
                            ? 'bg-[#d97706] text-white border-[#d97706] shadow-md ring-2 ring-[#d97706]/30 scale-[1.02]'
                            : 'bg-[#fefcf6] text-[#0f172a] border-[#fde68a] hover:bg-[#fef3c7]'
                        }`}
                      >
                        {num} {num === 1 ? 'Person' : 'Persons'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. ROW BY ROW PERSON ENTRIES */}
                <div className="space-y-6 pt-2">
                  {persons.map((person, index) => (
                    <div
                      key={person.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#f3e8d2] shadow-sm relative space-y-4 transition-all hover:border-[#fde68a]"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#fef3c7] text-[#b45309] font-black text-xs flex items-center justify-center border border-[#fde68a]">
                            #{index + 1}
                          </span>
                          <h4 className="font-serif font-bold text-base text-[#0f172a]">
                            Person #{index + 1} Details
                          </h4>
                        </div>

                        {persons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePerson(person.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                            title="Remove Person"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        )}
                      </div>

                      {/* Person Name Input */}
                      <div>
                        <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                          Person #{index + 1} Full Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={`Enter name of Person #${index + 1}`}
                          value={person.name}
                          onChange={(e) => handlePersonFieldChange(person.id, 'name', e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                        />
                      </div>

                      {/* File Upload Section for this Person */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block font-bold text-[#0f172a] uppercase tracking-wider">
                            Upload Kuthi Paper / Kundli Photos for {person.name || `Person #${index + 1}`}
                          </label>
                          <span className="text-[10px] text-gray-500 font-medium">Multiple files allowed (JPG, PNG, PDF)</span>
                        </div>

                        <div className="border-2 border-dashed border-[#fde68a] rounded-2xl p-4 bg-[#fefcf6] text-center hover:border-[#d97706] transition-colors relative">
                          <input
                            type="file"
                            multiple
                            accept="image/*,application/pdf"
                            onChange={(e) => handlePersonFileUpload(person.id, e.target.files)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <Upload className="w-6 h-6 text-[#d97706]" />
                            <span className="font-bold text-xs text-[#0f172a]">
                              Click or Drag & Drop Kuthi Photos
                            </span>
                            <span className="text-[11px] text-gray-500">
                              Upload Kuthi page photos or horoscope charts
                            </span>
                          </div>
                        </div>

                        {/* List of uploaded files for this person */}
                        {person.files.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            {person.files.map((file, fileIdx) => (
                              <div
                                key={fileIdx}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs"
                              >
                                <div className="flex items-center gap-2 truncate pr-2">
                                  <FileUp className="w-4 h-4 text-[#d97706] shrink-0" />
                                  <span className="font-bold text-gray-800 truncate">{file.name}</span>
                                  <span className="text-[10px] text-gray-400 font-mono">({(file.size / 1024).toFixed(0)} KB)</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePersonFile(person.id, fileIdx)}
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

                      {/* Checkbox: I don't have Kuthi Paper */}
                      <div className="pt-2 border-t border-gray-100">
                        <label className="inline-flex items-center gap-2.5 text-xs font-bold text-[#b45309] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={person.noKuthiPaper}
                            onChange={(e) => handlePersonFieldChange(person.id, 'noKuthiPaper', e.target.checked)}
                            className="rounded text-[#d97706] focus:ring-[#d97706] w-4 h-4"
                          />
                          <span>☑ I don't have a Kuthi paper for {person.name || `Person #${index + 1}`} (Enter Birth Details Manually)</span>
                        </label>

                        {/* Expanded Manual Birth Details */}
                        {(person.noKuthiPaper || person.files.length === 0) && (
                          <div className="mt-3 p-4 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-4">
                            <div className="text-[11px] font-bold text-[#78350f] uppercase tracking-wider">
                              Manual Birth Details for {person.name || `Person #${index + 1}`}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase">
                                  Date of Birth<span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="date"
                                  value={person.dob}
                                  onChange={(e) => handlePersonFieldChange(person.id, 'dob', e.target.value)}
                                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase">
                                  Time of Birth<span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="time"
                                  value={person.tob}
                                  onChange={(e) => handlePersonFieldChange(person.id, 'tob', e.target.value)}
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
                                  value={person.pob}
                                  onChange={(e) => handlePersonFieldChange(person.id, 'pob', e.target.value)}
                                  className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>

                {/* + ADD MORE PERSON BUTTON BELOW ROW ENTRIES */}
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddPerson}
                    className="px-6 py-3 rounded-2xl bg-[#fefcf6] border-2 border-dashed border-[#d97706] text-[#b45309] font-black text-xs hover:bg-[#fef3c7] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Another Person for Kuthi Reading</span>
                  </button>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to UPI Payment Summary (₹{totalFee})</span>
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
                    Total Fee: ₹{totalFee}
                  </span>
                </div>

                <div className="space-y-3 bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a] text-xs font-sans text-gray-700">
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">Client Name:</span>
                    <span className="font-bold text-[#0f172a]">{clientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">WhatsApp Number:</span>
                    <span className="font-bold text-[#0f172a]">{whatsappNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">Total Persons:</span>
                    <span className="font-bold text-[#b45309]">{persons.length} Person(s)</span>
                  </div>

                  {/* List of Persons */}
                  <div className="space-y-2 pt-1">
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Persons Breakdown:</span>
                    {persons.map((p, idx) => (
                      <div key={p.id} className="p-2.5 rounded-xl bg-white border border-[#fde68a] text-xs">
                        <span className="font-bold text-[#0f172a]">#{idx + 1} {p.name}</span>
                        {p.files.length > 0 ? (
                          <span className="text-[#b45309] block text-[11px] font-semibold mt-0.5">
                            📎 {p.files.length} Kuthi File(s) Attached ({p.files.map((f) => f.name).join(', ')})
                          </span>
                        ) : (
                          <span className="text-gray-600 block text-[11px] font-medium mt-0.5">
                            📅 DOB: {p.dob} • TOB: {p.tob} • POB: {p.pob}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* UPI Payment Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-[#b45309]">
                  <QrCode className="w-6 h-6" />
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Scan & Pay ₹{totalFee} via UPI</h3>
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
                    {loading ? 'Submitting Order...' : `Confirm Order (₹${totalFee}) →`}
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
                Your Kuthi reading request for <strong className="font-bold">{persons.length} Person(s)</strong> has been assigned to our Acharyas. Detailed astrological PDF report & voice notes will be delivered to your WhatsApp:
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
