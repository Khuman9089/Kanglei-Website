'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Calendar, Clock, MapPin, FileText, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, QrCode, Upload, FileUp, Plus, Trash2, Eye, MessageSquare, Truck, BookOpen,
  Tag, Gift, Percent, AlertCircle, X
} from 'lucide-react';
import Link from 'next/link';
import { ServiceCouponScheme } from '@/app/api/services/coupons/route';

interface KuthiSlot {
  id: string;
  label: string;
  file: File | null;
}

export interface KuthiSubServiceOption {
  id: string;
  title: string;
  price: number;
}

const DEFAULT_SUB_SERVICES: KuthiSubServiceOption[] = [
  { id: 'sub-1', title: 'Standard Kuthi Reading', price: 499 },
  { id: 'sub-2', title: 'Full Life & Dasha Analysis', price: 799 },
  { id: 'sub-3', title: 'Career & Financial Consultation', price: 599 },
  { id: 'sub-4', title: 'Health & Remedial Jyotish', price: 599 },
  { id: 'sub-5', title: 'Marriage & Relationship Reading', price: 699 },
  { id: 'sub-6', title: 'Yearly Transit & Sade Sati Report', price: 499 },
];

function ManipuriKuthiYengbaContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderRef, setOrderRef] = useState<string>('');

  // Sub-Category Services State
  const [subServices, setSubServices] = useState<KuthiSubServiceOption[]>(DEFAULT_SUB_SERVICES);
  const [selectedSubService, setSelectedSubService] = useState<KuthiSubServiceOption>(DEFAULT_SUB_SERVICES[0]);

  // Primary Contact Info
  const [clientName, setClientName] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [clientRequirement, setClientRequirement] = useState('');

  // Price per person / Kuthi
  const pricePerKuthi = selectedSubService.price;
  const kuthiRewriteFeePerPaper = 1000;

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
  const [faithTradition, setFaithTradition] = useState<'Hinduism' | 'Sanamahi Laining'>('Hinduism');

  // Checkbox: Want to Rewrite Physical Kuthi Paper
  const [wantKuthiRewrite, setWantKuthiRewrite] = useState(false);
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [yekSalai, setYekSalai] = useState('Mangang');
  const [gotra, setGotra] = useState('Gautama');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Physical Parchment Scroll Packages (Loaded from /manipuri_kuthi service)
  const [physicalPackages, setPhysicalPackages] = useState<KuthiSubServiceOption[]>([
    { id: 'sub-201', title: 'Standard Handwritten Kuthi Paper (Single Child)', price: 899 },
    { id: 'sub-202', title: 'Premium Gold-Stamped Traditional Kuthi Scroll', price: 1499 },
  ]);
  const [selectedPhysicalPackage, setSelectedPhysicalPackage] = useState<KuthiSubServiceOption>(physicalPackages[0]);

  // Payment State
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Service Coupons & Promotional Schemes State
  const [serviceCoupons, setServiceCoupons] = useState<ServiceCouponScheme[]>([]);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ServiceCouponScheme | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const ref = 'KY-2026-' + Math.floor(1000 + Math.random() * 9000);
    setOrderRef(ref);

    // Fetch active service coupons and promotional schemes
    fetch('/api/services/coupons?public=true')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.coupons)) {
          setServiceCoupons(data.coupons.filter((c: any) => c.active));
        }
      })
      .catch((err) => console.error('Error fetching service coupons:', err));

    // Fetch live sub-categories from Admin services API
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

          // Filter active admin services assigned strictly to /manipuri_kuthi_yengba
          const matchingServices = data.services.filter((s: any) => 
            s.active !== false && (
              s.pageTarget === '/manipuri_kuthi_yengba' ||
              s.link === '/manipuri_kuthi_yengba' || 
              (s.link && s.link.startsWith('/manipuri_kuthi_yengba?')) ||
              (s.link && s.link.startsWith('/manipuri_kuthi_yengba/')) ||
              s.id === 's-1'
            )
          );

          if (targetService && Array.isArray(targetService.subServices) && targetService.subServices.length > 0) {
            const formattedSubs: KuthiSubServiceOption[] = targetService.subServices.map((sub: any) => ({
              id: sub.id,
              title: sub.title,
              price: Number(sub.price) || 499,
            }));
            setSubServices(formattedSubs);
            setSelectedSubService(formattedSubs[0]);
          } else {
            const filteredSubs: KuthiSubServiceOption[] = [];
            matchingServices.forEach((s: any) => {
              if (Array.isArray(s.subServices)) {
                s.subServices.forEach((sub: any) => {
                  filteredSubs.push({
                    id: sub.id,
                    title: sub.title,
                    price: Number(sub.price) || 499,
                  });
                });
              }
            });

            if (filteredSubs.length > 0) {
              setSubServices(filteredSubs);
              setSelectedSubService(filteredSubs[0]);
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
            const formattedPhys: KuthiSubServiceOption[] = physService.subServices.map((sub: any) => ({
              id: sub.id,
              title: sub.title,
              price: Number(sub.price) || 899,
            }));
            setPhysicalPackages(formattedPhys);
            setSelectedPhysicalPackage(formattedPhys[0]);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching admin sub-services:', err);
      });
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

  // Compute discount for a given coupon scheme
  const computeDiscount = (coupon: ServiceCouponScheme, count: number, unitPrice: number, baseTotal: number) => {
    let discount = 0;
    if (coupon.schemeType === 'FIRST_M_OF_N_AT_PRICE' || coupon.schemeType === 'FIRST_N_AT_PRICE') {
      if (count >= (coupon.qualifyingQuantity || 1)) {
        const eligibleCount = Math.min(count, coupon.discountedQuantity || 1);
        const priceDiff = Math.max(0, unitPrice - (coupon.offerPrice ?? 0));
        discount = eligibleCount * priceDiff;
      }
    } else if (coupon.schemeType === 'PERCENTAGE') {
      discount = Math.round((baseTotal * (coupon.discountValue || 0)) / 100);
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else if (coupon.schemeType === 'FLAT') {
      discount = Math.min(baseTotal, coupon.discountValue || 0);
    } else if (coupon.schemeType === 'BUY_X_GET_Y') {
      if (count >= (coupon.qualifyingQuantity || 2)) {
        const freeCount = coupon.discountedQuantity || 1;
        discount = freeCount * unitPrice;
      }
    }
    return Math.max(0, Math.min(discount, baseTotal));
  };

  // Calculate Base Reading and Physical Scroll Fees
  const baseReadingAmount = pricePerKuthi * slots.length;
  const rewriteAmount = wantKuthiRewrite ? (selectedPhysicalPackage.price * slots.length) : 0;

  // Determine Active Coupon (Manual code override > Best matching Auto-Apply Scheme)
  let activeCoupon: ServiceCouponScheme | null = appliedCoupon;
  let isAutoApplied = false;

  if (!activeCoupon) {
    const eligibleAuto = serviceCoupons
      .filter((c) => c.active && c.isAutoApply && slots.length >= (c.qualifyingQuantity || 1))
      .sort((a, b) => {
        const dA = computeDiscount(a, slots.length, pricePerKuthi, baseReadingAmount);
        const dB = computeDiscount(b, slots.length, pricePerKuthi, baseReadingAmount);
        return dB - dA;
      });

    if (eligibleAuto.length > 0) {
      activeCoupon = eligibleAuto[0];
      isAutoApplied = true;
    }
  }

  const couponDiscount = activeCoupon
    ? computeDiscount(activeCoupon, slots.length, pricePerKuthi, baseReadingAmount)
    : 0;

  const finalReadingAmount = Math.max(0, baseReadingAmount - couponDiscount);
  const totalAmount = finalReadingAmount + rewriteAmount;

  // 3-Kundli special promo detection for nudges & UI badges
  const threeKundliScheme = serviceCoupons.find(
    (c) => c.active && (c.code === '3KUNDLI1' || c.schemeType === 'FIRST_M_OF_N_AT_PRICE')
  );

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponMessage({ type: 'error', text: 'Please enter a coupon code.' });
      return;
    }

    const found = serviceCoupons.find((c) => c.code.toUpperCase() === code && c.active);
    if (!found) {
      setCouponMessage({ type: 'error', text: `Coupon code "${code}" is invalid or expired.` });
      return;
    }

    if (found.qualifyingQuantity && slots.length < found.qualifyingQuantity) {
      setCouponMessage({
        type: 'error',
        text: `Scheme "${found.code}" requires at least ${found.qualifyingQuantity} Kundlis. Please select ${found.qualifyingQuantity} Kundlis.`,
      });
      return;
    }

    setAppliedCoupon(found);
    setCouponCodeInput(found.code);
    setCouponMessage({
      type: 'success',
      text: `Coupon "${found.code}" applied! ${found.title}`,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponMessage(null);
  };

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

    if (wantKuthiRewrite) {
      if (!fatherName.trim() || !motherName.trim()) {
        setErrorMsg("Please enter Father's Name and Mother's Name for physical Kuthi writing.");
        return;
      }
      if (!deliveryAddress.trim()) {
        setErrorMsg('Please enter your complete Physical Delivery Address for Kuthi paper delivery.');
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
        serviceTitle: `Kuthi Yengba — ${selectedSubService.title}`,
        subServiceTitle: selectedSubService.title,
        clientName,
        whatsappNo,
        gender,
        clientRequirement,
        personCount: slots.length,
        uploadedFiles: slots.filter((s) => s.file !== null).map((s) => s.file?.name),
        noKuthiPaper,
        dob,
        tob,
        pob,
        notes,
        faithTradition,
        wantKuthiRewrite,
        rewriteDetails: wantKuthiRewrite ? {
          fatherName,
          motherName,
          yekSalai,
          gotra,
          deliveryAddress,
        } : null,
        baseReadingAmount,
        couponCode: activeCoupon?.code || '',
        couponDiscount,
        rewriteAmount,
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
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            Manipuri Kuthi Yengba Form
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a]">
            Kuthi Yengba <span className="text-[#b45309]">Intake Form</span>
          </h1>

          <div className="flex items-center justify-between max-w-md mx-auto mt-6 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#f3e8d2] -translate-y-1/2 z-0" />
            
            {[
              { num: 1, label: 'Upload Kuthi & Details' },
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

              <div className="flex items-center justify-between border-b border-[#fde68a]/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Kuthi Paper Reading Form</h3>
                    <p className="text-xs text-gray-500 font-sans">Fill in your details, upload Kuthi, or opt for physical Kuthi rewrite</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-[#b45309] bg-[#fef3c7] px-3.5 py-1.5 rounded-xl border border-[#fde68a] block">
                    Total: ₹{totalAmount}
                  </span>
                  {wantKuthiRewrite && (
                    <span className="text-[10px] text-green-700 font-bold block mt-0.5">+ Kuthi Rewrite Included</span>
                  )}
                </div>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-6 text-xs font-sans">
                
                {/* 1. NAME, WHATSAPP NO & SUB-CATEGORY DROPDOWN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                  {/* SUB-CATEGORY DROPDOWN SELECTION */}
                  <div>
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Select Sub-Category<span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedSubService.id}
                      onChange={(e) => {
                        const found = subServices.find((s) => s.id === e.target.value);
                        if (found) setSelectedSubService(found);
                      }}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none cursor-pointer"
                    >
                      {subServices.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.title} (₹{sub.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 1B. CLIENT REQUIREMENT / SPECIAL SERVICE SPECIFICATION */}
                <div>
                  <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                    Client Requirement / Special Service Details
                  </label>
                  <input
                    type="text"
                    placeholder="Specify your custom requirements, special services needed, or specific questions for the astrologer..."
                    value={clientRequirement}
                    onChange={(e) => setClientRequirement(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                  />
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

                  {/* 3-Kundli Promotional Nudge or Celebratory Offer Badge */}
                  {threeKundliScheme && slots.length < (threeKundliScheme.qualifyingQuantity || 3) && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🎁</span>
                        <div>
                          <span className="text-xs font-black text-[#b45309] block">
                            Special Scheme: 1st Kundli at ₹1 only!
                          </span>
                          <span className="text-[11px] text-gray-600">
                            Select {threeKundliScheme.qualifyingQuantity || 3} Kundlis to get 1st Kundli at ₹1, rest at regular rate!
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCountSelect(threeKundliScheme.qualifyingQuantity || 3)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs hover:opacity-95 shadow-xs shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <span>Select {threeKundliScheme.qualifyingQuantity || 3} Kundlis (Save ₹{pricePerKuthi - 1})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {activeCoupon && couponDiscount > 0 && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🎉</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-emerald-800">
                              {activeCoupon.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono font-bold">
                              {activeCoupon.code}
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-700">
                            {isAutoApplied ? 'Auto-applied! ' : ''}1st Kundli at ₹{activeCoupon.offerPrice ?? 1}, rest at regular rate. You save ₹{couponDiscount}!
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-mono font-extrabold text-xs shrink-0 shadow-xs">
                        -₹{couponDiscount} SAVED
                      </span>
                    </div>
                  )}
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. CHECKBOX: WANT TO REWRITE PHYSICAL KUTHI PAPER (+FEES & DELIVERY ADDRESS) */}
                <div className="pt-3 border-t border-[#f3e8d2]">
                  <label className="inline-flex items-center gap-2.5 text-xs font-extrabold text-[#d97706] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantKuthiRewrite}
                      onChange={(e) => setWantKuthiRewrite(e.target.checked)}
                      className="rounded text-[#d97706] focus:ring-[#d97706] w-4 h-4"
                    />
                    <span>☑ Want to Rewrite / Create Physical Kuthi Paper? (+₹{selectedPhysicalPackage.price} for handwritten delivery)</span>
                  </label>

                  {/* Physical Delivery & Ancestral Details Form - Shown ONLY when checkbox checked */}
                  <AnimatePresence>
                    {wantKuthiRewrite && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-5 rounded-2xl bg-[#fef3c7]/60 border-2 border-[#fde68a] space-y-4 overflow-hidden"
                      >
                        <div className="flex items-center gap-2 text-[#78350f] font-bold text-xs uppercase tracking-wider pb-2 border-b border-[#fde68a]">
                          <Truck className="w-4 h-4 text-[#d97706]" />
                          <span>Physical Kuthi Writing & Home Delivery Particulars</span>
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
                                  <input type="radio" name="phys_pkg_ky" checked={selectedPhysicalPackage.id === pkg.id} readOnly />
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
                              required={wantKuthiRewrite}
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
                              required={wantKuthiRewrite}
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
                            required={wantKuthiRewrite}
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

                {/* Astrological Faith Tradition Selection */}
                <div className="bg-[#fffdfa] p-4 sm:p-5 rounded-2xl border border-[#fde68a] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                      Astrological Tradition / Faith Preference <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
                      Selected: {faithTradition}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Choose the ritual and astrological tradition you follow for this Kuthi reading:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFaithTradition('Hinduism')}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                        faithTradition === 'Hinduism'
                          ? 'bg-[#fef3c7] text-[#b45309] border-[#d97706] shadow-sm ring-1 ring-[#d97706]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#fde68a] hover:bg-[#fefcf6]'
                      }`}
                    >
                      <span className="text-base">🕉️</span>
                      <div className="text-left">
                        <div className="font-extrabold text-[#0f172a]">Hinduism</div>
                        <div className="text-[10px] text-gray-500 font-normal">Vedic Manipuri Hindu Tradition</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFaithTradition('Sanamahi Laining')}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                        faithTradition === 'Sanamahi Laining'
                          ? 'bg-[#fef3c7] text-[#b45309] border-[#d97706] shadow-sm ring-1 ring-[#d97706]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#fde68a] hover:bg-[#fefcf6]'
                      }`}
                    >
                      <span className="text-base">☀️</span>
                      <div className="text-left">
                        <div className="font-extrabold text-[#0f172a]">Sanamahi Laining</div>
                        <div className="text-[10px] text-gray-500 font-normal">Indigenous Sanamahi Tradition</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* PROMO COUPON & SPECIAL SCHEME BOX */}
                <div className="bg-[#fffdfa] p-4 sm:p-5 rounded-2xl border border-[#fde68a] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-[#d97706]" />
                      <span>Promotional Coupon or Scheme Code</span>
                    </label>
                    {activeCoupon && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {isAutoApplied ? 'Auto Scheme Active' : 'Coupon Applied'}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon Code (e.g. 3KUNDLI1, VEDIC20)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 h-10 px-3.5 rounded-xl border border-gray-300 bg-white font-mono text-xs uppercase tracking-wider text-[#b45309] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-4 h-10 rounded-xl border border-red-300 bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-5 h-10 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs hover:opacity-95 shadow-xs transition-opacity cursor-pointer shrink-0"
                      >
                        Apply Code
                      </button>
                    )}
                  </div>

                  {couponMessage && (
                    <p className={`text-xs font-bold flex items-center gap-1 ${
                      couponMessage.type === 'success' ? 'text-emerald-700' : 'text-red-600'
                    }`}>
                      {couponMessage.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{couponMessage.text}</span>
                    </p>
                  )}

                  {/* Available Public Offers Chips */}
                  {serviceCoupons.length > 0 && (
                    <div className="pt-2 border-t border-[#fde68a]/50">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1.5">
                        Available Schemes & Offers:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {serviceCoupons.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              if (c.qualifyingQuantity && slots.length < c.qualifyingQuantity) {
                                handleCountSelect(c.qualifyingQuantity);
                              }
                              handleApplyCoupon(c.code);
                            }}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              activeCoupon?.code === c.code
                                ? 'bg-amber-100 border-amber-400 text-[#b45309] ring-1 ring-amber-400'
                                : 'bg-white border-amber-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50/50'
                            }`}
                          >
                            <Tag className="w-3 h-3 text-[#d97706]" />
                            <span className="font-mono">{c.code}</span>
                            <span className="text-[10px] text-gray-500 font-normal">({c.badgeText || c.title})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* PRICE BREAKDOWN CARD */}
                <div className="bg-[#fefcf6] p-4 sm:p-5 rounded-2xl border border-[#fde68a] space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Kuthi Reading ({slots.length} × ₹{pricePerKuthi}):</span>
                    <span className="font-bold text-[#0f172a]">₹{baseReadingAmount}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <span className="flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5" />
                        <span>Discount ({activeCoupon?.code} — {activeCoupon?.title}):</span>
                      </span>
                      <span className="font-mono text-sm">-₹{couponDiscount}</span>
                    </div>
                  )}

                  {wantKuthiRewrite && (
                    <div className="flex justify-between text-green-800">
                      <span>Handwritten Physical Kuthi ({selectedPhysicalPackage.title}):</span>
                      <span className="font-bold">₹{rewriteAmount}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#fde68a] flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-700 uppercase tracking-wider text-xs">Total Payable:</span>
                    <span className="font-serif font-black text-xl text-[#b45309]">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Payment Summary (₹{totalAmount})</span>
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

                <div className="space-y-2.5 bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a] text-xs font-sans text-gray-700">
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-bold text-[#0f172a]">{clientName} ({gender})</span>
                  </div>
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">WhatsApp Number:</span>
                    <span className="font-bold text-[#0f172a]">{whatsappNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">Sub-Category Service:</span>
                    <span className="font-bold text-[#b45309]">{selectedSubService.title} (₹{selectedSubService.price} × {slots.length})</span>
                  </div>
                  {clientRequirement && (
                    <div className="flex justify-between border-b border-[#fde68a] pb-2">
                      <span className="text-gray-500">Client Requirement / Details:</span>
                      <span className="font-bold text-[#0f172a]">{clientRequirement}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">Astrological Faith Tradition:</span>
                    <span className="font-bold text-[#b45309]">{faithTradition === 'Hinduism' ? '🕉️ Hinduism' : '☀️ Sanamahi Laining'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#fde68a] pb-2">
                    <span className="text-gray-500">Reading Fee ({slots.length} Paper):</span>
                    <span className="font-bold text-[#0f172a]">₹{baseReadingAmount}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between border-b border-[#fde68a] pb-2 text-emerald-700 bg-emerald-50/70 p-2 rounded-lg">
                      <span className="font-bold">Special Scheme / Coupon ({activeCoupon?.code}):</span>
                      <span className="font-bold font-mono">-₹{couponDiscount}</span>
                    </div>
                  )}

                  {wantKuthiRewrite && (
                    <div className="flex justify-between border-b border-[#fde68a] pb-2">
                      <span className="text-gray-500">Physical Kuthi ({selectedPhysicalPackage.title}):</span>
                      <span className="font-bold text-green-700">₹{rewriteAmount}</span>
                    </div>
                  )}

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

                  {wantKuthiRewrite && (
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
                🙏 Kuthi Yengba Order Successfully Submitted!
              </h2>

              <div className="bg-[#fefcf6] p-6 rounded-2xl border border-[#fde68a] text-xs sm:text-sm text-[#78350f] leading-relaxed mb-8 font-medium shadow-xs">
                Your Kuthi reading request for <strong className="font-bold">{slots.length} Paper(s)</strong> has been assigned to our Acharyas. Detailed astrological report & voice notes will be delivered to your WhatsApp:
                <strong className="block text-base text-[#b45309] font-bold mt-2 font-mono">
                  {whatsappNo}
                </strong>

                {wantKuthiRewrite && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-green-300 text-green-800 text-xs">
                    📦 Physical Kuthi paper will be handwritten and dispatched to: <strong className="block text-gray-900 mt-1">{deliveryAddress}</strong>
                  </div>
                )}

                <span className="inline-block mt-3 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                  ⚡ Digital Delivery: Within 24 Hours on WhatsApp
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
                  <span className="text-gray-500">Tradition:</span>
                  <span className="font-bold text-[#b45309]">{faithTradition}</span>
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
