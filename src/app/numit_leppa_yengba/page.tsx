'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Calendar, Clock, MapPin, FileText, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, QrCode, Upload, FileUp, Plus, Trash2, Eye, Sun, ChevronDown, MessageSquare, Truck 
} from 'lucide-react';
import Link from 'next/link';

export interface NumitLeppaSubServiceOption {
  id: string;
  title: string;
  price: number;
  description?: string;
}

interface KuthiSlot {
  id: string;
  label: string;
  file: File | null;
}

const DEFAULT_NUMIT_SUB_SERVICES: NumitLeppaSubServiceOption[] = [
  { id: 'sub-501', title: 'Yum Sangba (Housewarming Date)', price: 501, description: 'Auspicious muhurat & Griha Pravesh alignment' },
  { id: 'sub-502', title: 'Luhongba (Marriage & Wedding Date)', price: 751, description: 'Subha Vivaha muhurat & lagna calculations' },
  { id: 'sub-503', title: 'Swasti Puja & Naming (Child Naming)', price: 351, description: 'Nakshatra & auspicious naming date' },
  { id: 'sub-504', title: 'Business & Office Opening', price: 501, description: 'Shubh Labh & trade inauguration date' },
  { id: 'sub-505', title: 'Vehicle & Property Registration', price: 351, description: 'Auspicious vehicle delivery & land purchase' },
  { id: 'sub-506', title: 'General Numit Yengba (Auspicious Date)', price: 401, description: 'General travel, ritual, or important event' },
];

function NumitLeppaYengbaContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderRef, setOrderRef] = useState<string>('');

  // Primary Contact Info
  const [clientName, setClientName] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');

  // Reasons list (from admin API or default)
  const [reasons, setReasons] = useState<NumitLeppaSubServiceOption[]>(DEFAULT_NUMIT_SUB_SERVICES);
  const [selectedReason, setSelectedReason] = useState<NumitLeppaSubServiceOption>(DEFAULT_NUMIT_SUB_SERVICES[0]);
  const [customReason, setCustomReason] = useState('');

  // Kuthi Upload Slots (Default 1 slot)
  const [slots, setSlots] = useState<KuthiSlot[]>([
    { id: 'slot-1', label: 'Kuthi Paper #1', file: null },
  ]);

  // Checkbox: I don't have Kuthi paper
  const [noKuthiPaper, setNoKuthiPaper] = useState(false);
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('Imphal, Manipur');
  const [notes, setNotes] = useState('');

  // Checkbox: Want Physical Written Numit Leppa Document
  const [wantPhysicalDelivery, setWantPhysicalDelivery] = useState(false);
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [yekSalai, setYekSalai] = useState('Mangang');
  const [gotra, setGotra] = useState('Gautama');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Physical Parchment Scroll Packages (Loaded from /manipuri_kuthi service)
  const [physicalPackages, setPhysicalPackages] = useState<NumitLeppaSubServiceOption[]>([
    { id: 'sub-201', title: 'Standard Handwritten Kuthi Paper (Single Child)', price: 899 },
    { id: 'sub-202', title: 'Premium Gold-Stamped Traditional Kuthi Scroll', price: 1499 },
  ]);
  const [selectedPhysicalPackage, setSelectedPhysicalPackage] = useState<NumitLeppaSubServiceOption>(physicalPackages[0]);

  // Payment State
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const ref = 'NL-2026-' + Math.floor(1000 + Math.random() * 9000);
    setOrderRef(ref);

    // Fetch live Numit Leppa sub-categories & physical packages from Admin services API
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.services) && data.services.length > 0) {
          const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
          const targetServiceId = urlParams ? urlParams.get('service') : null;

          let targetService = null;
          if (targetServiceId) {
            targetService = data.services.find((s: any) => s.id === targetServiceId);
          }

          // Filter active admin services assigned strictly to /numit_leppa_yengba
          const matchingServices = data.services.filter((s: any) => 
            s.active !== false && (
              s.pageTarget === '/numit_leppa_yengba' ||
              s.link === '/numit_leppa_yengba' || 
              (s.link && s.link.startsWith('/numit_leppa_yengba?')) ||
              (s.link && s.link.startsWith('/numit_yengba')) ||
              s.id === 's-5'
            )
          );

          if (targetService && Array.isArray(targetService.subServices) && targetService.subServices.length > 0) {
            const formattedSubs: NumitLeppaSubServiceOption[] = targetService.subServices.map((sub: any) => ({
              id: sub.id,
              title: sub.title,
              price: Number(sub.price) || 501,
              description: sub.description || 'Auspicious muhurat alignment',
            }));
            setReasons(formattedSubs);
            setSelectedReason(formattedSubs[0]);
          } else {
            const filteredSubs: NumitLeppaSubServiceOption[] = [];
            matchingServices.forEach((s: any) => {
              if (Array.isArray(s.subServices)) {
                s.subServices.forEach((sub: any) => {
                  filteredSubs.push({
                    id: sub.id,
                    title: sub.title,
                    price: Number(sub.price) || 501,
                    description: sub.description || 'Auspicious muhurat alignment',
                  });
                });
              }
            });

            if (filteredSubs.length > 0) {
              setReasons(filteredSubs);
              setSelectedReason(filteredSubs[0]);
            }
          }

          // Fetch physical document scroll packages (from /manipuri_kuthi service)
          const physService = data.services.find((s: any) => 
            s.pageTarget === '/manipuri_kuthi' ||
            s.link === '/manipuri_kuthi' || 
            s.id === 's-2' ||
            (s.title && s.title.toLowerCase().includes('kuthi iba'))
          );

          if (physService && Array.isArray(physService.subServices) && physService.subServices.length > 0) {
            const formattedPhys: NumitLeppaSubServiceOption[] = physService.subServices.map((sub: any) => ({
              id: sub.id,
              title: sub.title,
              price: Number(sub.price) || 899,
            }));
            setPhysicalPackages(formattedPhys);
            setSelectedPhysicalPackage(formattedPhys[0]);
          }
        }
      })
      .catch((err) => console.error('Error fetching admin Numit Leppa services:', err));
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

  // Total Amount Calculation
  const baseServiceAmount = selectedReason.price * slots.length;
  const deliveryAmount = wantPhysicalDelivery ? (selectedPhysicalPackage.price * slots.length) : 0;
  const totalAmount = baseServiceAmount + deliveryAmount;

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

    if (noKuthiPaper) {
      if (!dob || !tob || !pob.trim()) {
        setErrorMsg('Please enter Date of Birth, Time of Birth, and Place of Birth.');
        return;
      }
    } else if (uploadedFilesCount === 0) {
      setErrorMsg('Please upload your Kuthi paper file(s) or check "I don\'t have a Kuthi paper".');
      return;
    }

    if (wantPhysicalDelivery) {
      if (!fatherName.trim() || !motherName.trim()) {
        setErrorMsg("Please enter Father's Name and Mother's Name for physical document writing.");
        return;
      }
      if (!deliveryAddress.trim()) {
        setErrorMsg('Please enter your complete Physical Delivery Address.');
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

    const effectiveReason = customReason.trim() ? `${selectedReason.title} (${customReason.trim()})` : selectedReason.title;

    const orderPayload = {
      action: 'CREATE_ORDER',
      order: {
        category: 'numit_leppa_yengba',
        serviceTitle: `Numit Yengba — ${effectiveReason}`,
        clientName,
        whatsappNo,
        gender,
        reasonTitle: effectiveReason,
        customReason: customReason.trim(),
        pricePerUnit: selectedReason.price,
        personCount: slots.length,
        noKuthiPaper,
        dob,
        tob,
        pob,
        notes,
        wantPhysicalDelivery,
        deliveryDetails: wantPhysicalDelivery ? {
          fatherName,
          motherName,
          yekSalai,
          gotra,
          deliveryAddress,
          packageName: selectedPhysicalPackage.title,
          packagePrice: selectedPhysicalPackage.price,
        } : null,
        filesCount: uploadedFilesCount,
        fileNames: slots.filter((s) => s.file !== null).map((s) => s.file?.name),
        baseServiceAmount,
        deliveryAmount,
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

                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-[#b45309] bg-[#fef3c7] px-3.5 py-1.5 rounded-xl border border-[#fde68a] block">
                    Total: ₹{totalAmount}
                  </span>
                  {wantPhysicalDelivery && (
                    <span className="text-[10px] text-green-700 font-bold block mt-0.5">+ Document Delivery Included</span>
                  )}
                </div>
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
                    SELECT REASON FOR NUMIT YENGBA (AUSPICIOUS DATE)<span className="text-red-500">*</span>
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reasons.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedReason(r)}
                        className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          selectedReason.id === r.id
                            ? 'bg-[#fef3c7] border-[#d97706] shadow-md ring-2 ring-[#d97706]/30 font-bold'
                            : 'bg-[#fefcf6] border-[#fde68a] hover:bg-[#fef3c7]/60 text-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-[#0f172a] text-xs sm:text-sm">{r.title}</span>
                          <span className="font-mono font-black text-xs sm:text-sm text-[#b45309]">₹{r.price}</span>
                        </div>
                        {r.description && (
                          <span className="text-[11px] text-gray-500 mt-1 block font-medium">{r.description}</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* CUSTOM EVENT / REASON FIELD (IF NOT LISTED ABOVE) */}
                  <div className="pt-3">
                    <label className="block text-[11px] font-bold text-[#b45309] uppercase tracking-wider mb-1">
                      Other Event / Custom Reason (If not listed in above options)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ear Piercing (Nahutpa), Shradha Puja, Journey, Gold Purchase, Foreign Travel..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#fde68a] bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. COMPULSORY KUTHI FILE UPLOAD SLOTS & + ADD MORE BUTTON */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="block font-bold text-[#0f172a] uppercase tracking-wider">
                      Upload Kuthi / Kundli Paper Photos {!noKuthiPaper && <span className="text-red-500">* (COMPULSORY)</span>}
                    </label>
                    <span className="text-[10px] text-gray-500">{slots.length} {slots.length === 1 ? 'Paper Slot' : 'Paper Slots'}</span>
                  </div>

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
                      <span>+ Add More Kuthi File (+₹{selectedReason.price})</span>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

                          {/* GENDER / SEX SELECTOR */}
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase">
                              Gender / Sex<span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-1.5 h-10">
                              <button
                                type="button"
                                onClick={() => setGender('Male')}
                                className={`rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                                  gender === 'Male'
                                    ? 'bg-[#d97706] text-white border-[#d97706] shadow-sm'
                                    : 'bg-white text-[#0f172a] border-gray-300 hover:bg-[#fef3c7]'
                                }`}
                              >
                                👦 Male
                              </button>
                              <button
                                type="button"
                                onClick={() => setGender('Female')}
                                className={`rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                                  gender === 'Female'
                                    ? 'bg-[#d97706] text-white border-[#d97706] shadow-sm'
                                    : 'bg-white text-[#0f172a] border-gray-300 hover:bg-[#fef3c7]'
                                }`}
                              >
                                👧 Female
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase">
                            Specific Preferred Timeframe or Event Details (Optional)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Enter any preferred month, week, or notes for the astrologer"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. CHECKBOX: WANT PHYSICAL WRITTEN NUMIT LEPPA DOCUMENT */}
                <div className="pt-3 border-t border-[#f3e8d2]">
                  <label className="inline-flex items-center gap-2.5 text-xs font-extrabold text-[#d97706] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantPhysicalDelivery}
                      onChange={(e) => setWantPhysicalDelivery(e.target.checked)}
                      className="rounded text-[#d97706] focus:ring-[#d97706] w-4 h-4"
                    />
                    <span>☑ Want Physical Written Numit Leppa Document Delivered to Home? (+₹{selectedPhysicalPackage.price} for handwritten paper delivery)</span>
                  </label>

                  {/* Physical Delivery Form - Shown ONLY when checkbox checked */}
                  <AnimatePresence>
                    {wantPhysicalDelivery && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-5 rounded-2xl bg-[#fef3c7]/60 border-2 border-[#fde68a] space-y-4 overflow-hidden"
                      >
                        <div className="flex items-center gap-2 text-[#78350f] font-bold text-xs uppercase tracking-wider pb-2 border-b border-[#fde68a]">
                          <Truck className="w-4 h-4 text-[#d97706]" />
                          <span>Physical Document Delivery Address Particulars</span>
                        </div>

                        {/* CHOOSE PARCHMENT SCROLL PACKAGE */}
                        <div className="space-y-2 pb-2 border-b border-[#fde68a]">
                          <label className="block text-[11px] font-bold text-[#78350f] uppercase tracking-wider">
                            Choose Parchment Scroll Package
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            {physicalPackages.map((pkg) => (
                              <label
                                key={pkg.id}
                                onClick={() => setSelectedPhysicalPackage(pkg)}
                                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                  selectedPhysicalPackage.id === pkg.id
                                    ? 'bg-white border-[#d97706] font-bold text-[#b45309] shadow-xs ring-2 ring-[#d97706]/20'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <input type="radio" name="phys_pkg_nl" checked={selectedPhysicalPackage.id === pkg.id} readOnly />
                                  <span>{pkg.title}</span>
                                </div>
                                <span className="font-mono font-extrabold text-sm text-[#b45309]">₹{pkg.price}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-800 mb-1 uppercase">
                              Father's Name<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required={wantPhysicalDelivery}
                              placeholder="Enter Father's Name"
                              value={fatherName}
                              onChange={(e) => setFatherName(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-800 mb-1 uppercase">
                              Mother's Name<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required={wantPhysicalDelivery}
                              placeholder="Enter Mother's Name"
                              value={motherName}
                              onChange={(e) => setMotherName(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-800 mb-1 uppercase">
                              Yek / Salai
                            </label>
                            <select
                              value={yekSalai}
                              onChange={(e) => setYekSalai(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none cursor-pointer"
                            >
                              <option value="Mangang">Mangang</option>
                              <option value="Luwang">Luwang</option>
                              <option value="Khuman">Khuman</option>
                              <option value="Angom">Angom</option>
                              <option value="Moilang">Moilang</option>
                              <option value="Kha-Nganba">Kha-Nganba</option>
                              <option value="Salai Leishangthem">Salai Leishangthem</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-800 mb-1 uppercase">
                              Gotra
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Gautama, Sandilya"
                              value={gotra}
                              onChange={(e) => setGotra(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-800 mb-1 uppercase">
                            Physical Home Delivery Address<span className="text-red-500">*</span>
                          </label>
                          <textarea
                            rows={2}
                            required={wantPhysicalDelivery}
                            placeholder="Enter complete address, locality, landmark, city & pincode for paper delivery"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
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
                    <span>Proceed to UPI Payment (₹{totalAmount})</span>
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
                    Total Fee: ₹{totalAmount}
                  </span>
                </div>

                <div className="space-y-2 bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a] text-xs font-sans text-gray-700">
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-bold text-[#0f172a]">{clientName} ({gender})</span>
                  </div>
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">WhatsApp Number:</span>
                    <span className="font-bold text-[#0f172a]">{whatsappNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">Numit Yengba Purpose:</span>
                    <span className="font-bold text-[#b45309]">
                      {customReason.trim() ? `${selectedReason.title} — ${customReason.trim()}` : selectedReason.title} (₹{selectedReason.price} × {slots.length})
                    </span>
                  </div>

                  {wantPhysicalDelivery && (
                    <div className="flex justify-between border-b border-[#fde68a] pb-2">
                      <span className="text-gray-500">Physical Document ({selectedPhysicalPackage.title}):</span>
                      <span className="font-bold text-green-700">₹{deliveryAmount}</span>
                    </div>
                  )}

                  {uploadedFilesCount > 0 ? (
                    <div className="pt-1">
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Attached Kuthi Files ({uploadedFilesCount}):</span>
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

                  {wantPhysicalDelivery && (
                    <div className="pt-2 border-t border-[#fde68a] space-y-1">
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Delivery Particulars:</span>
                      <p className="font-semibold text-[#0f172a]">Parents: {fatherName} & {motherName} | Yek: {yekSalai} | Gotra: {gotra}</p>
                      <p className="text-gray-600">Address: {deliveryAddress}</p>
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
                🙏 Numit Yengba Order Successfully Submitted!
              </h2>

              <div className="bg-[#fefcf6] p-6 rounded-2xl border border-[#fde68a] text-xs sm:text-sm text-[#78350f] leading-relaxed mb-8 font-medium shadow-xs">
                Your Numit Yengba request for <strong className="font-bold">{selectedReason.title} ({slots.length} Kuthi Paper)</strong> has been assigned to our Acharyas. Detailed auspicious date report & voice guidance will be delivered to your WhatsApp:
                <strong className="block text-base text-[#b45309] font-bold mt-2 font-mono">
                  {whatsappNo}
                </strong>

                {wantPhysicalDelivery && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-green-300 text-green-800 text-xs">
                    📦 Physical written Numit Leppa document will be dispatched to: <strong className="block text-gray-900 mt-1">{deliveryAddress}</strong>
                  </div>
                )}

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
                  <span className="font-bold text-[#0f172a]">{clientName} ({gender})</span>
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

export default function NumitLeppaYengbaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdfa] pt-20 text-center text-[#0f172a]">Loading Numit Yengba Form...</div>}>
      <NumitLeppaYengbaContent />
    </Suspense>
  );
}
