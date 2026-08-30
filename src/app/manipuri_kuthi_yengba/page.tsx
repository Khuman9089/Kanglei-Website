'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Mail, MapPin, Calendar, Clock, FileText, Upload, CheckCircle2, 
  ArrowRight, ArrowLeft, ShieldCheck, Sparkles, QrCode, Lock, MessageSquare, X, Plus, Trash2, Check 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

interface SubService {
  id: string;
  title: string;
  price: number;
  description?: string;
}

interface ServiceCategory {
  id: string;
  badge?: string;
  title: string;
  description?: string;
  price?: string;
  active: boolean;
  subServices: SubService[];
}

const DEFAULT_SERVICES: ServiceCategory[] = [
  {
    id: 's-1',
    badge: 'Popular',
    title: 'Kuthi Yengba (Horoscope Analysis & Remedies)',
    description: 'In-depth analysis of natal Kundali, Vimshottari Dasha, planetary transits, and customized Manipuri Vedic remedies.',
    price: '₹499',
    active: true,
    subServices: [
      { id: 'sub-101', title: 'Standard Kuthi Yengba (Detailed Dasha & Remedies)', price: 499, description: 'Complete analysis delivered to your WhatsApp within 12 Hours.' },
      { id: 'sub-102', title: 'Express Fast-Track Kuthi Yengba (Delivered within 4 Hours)', price: 799, description: 'Priority queue processing delivered within 4 Hours.' },
      { id: 'sub-103', title: 'Comprehensive 5-Year Life Roadmap Kuthi Report', price: 1199, description: 'Full 5-year planetary transit timeline and personalized remedies PDF.' },
    ],
  },
  {
    id: 's-2',
    badge: 'Traditional',
    title: 'Kuthi Iba (Handwritten Kuthi Creation - কুঠি ইবা)',
    description: 'Authentic hand-written Kuthi birth scroll prepared on sacred parchment by experienced Vedic Acharyas.',
    price: '₹899',
    active: true,
    subServices: [
      { id: 'sub-201', title: 'Standard Handwritten Kuthi Paper (Single Child)', price: 899, description: 'Traditional handwritten birth scroll on sacred parchment.' },
      { id: 'sub-202', title: 'Premium Gold-Stamped Traditional Kuthi Scroll', price: 1499, description: 'Deluxe gold-bordered scroll in protective sacred case.' },
    ],
  },
  {
    id: 's-3',
    badge: 'High Accuracy',
    title: 'Pakna Wainaba Yengba (Kundli Matching & 36-Gun Milan)',
    description: 'Complete 36-Gun Ashtakoot Milan, Manglik Dosh analysis, and mental/emotional compatibility assessment.',
    price: '₹1,299',
    active: true,
    subServices: [
      { id: 'sub-301', title: '36-Gun Ashtakoot Match & Manglik Check', price: 1299, description: 'Detailed 36-point compatibility report for couple pair.' },
      { id: 'sub-302', title: 'Full D9 Navamsha Couple Compatibility & Remedial Report', price: 1999, description: 'Comprehensive marriage compatibility with specific remedial pujas.' },
    ],
  },
  {
    id: 's-4',
    badge: 'Best Value',
    title: '1-on-1 Live Master Consultation',
    description: 'Direct face-to-face video consultation with our Master Vedic Astrologer with instant remedial guidance.',
    price: '₹2,499',
    active: true,
    subServices: [
      { id: 'sub-401', title: '30-Minute Video/Phone Session', price: 1499, description: 'Direct 30-minute consultation with Master Astrologer.' },
      { id: 'sub-402', title: '60-Minute Deep Consultation + Recorded Session & PDF Remedies', price: 2499, description: 'Full 60-minute session with recorded audio and written PDF remedies.' },
    ],
  },
];

function ManipuriKuthiYengbaContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderRef, setOrderRef] = useState<string>('');

  // Dynamic Services & Sub-Services
  const [services, setServices] = useState<ServiceCategory[]>(DEFAULT_SERVICES);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('s-1');
  const [selectedSubServiceId, setSelectedSubServiceId] = useState<string>('sub-101');

  // Client Details Form State
  const [name, setName] = useState('');
  const [sex, setSex] = useState('Male');
  const [mobile, setMobile] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [email, setEmail] = useState('');

  // Multiple Kuthi File Uploads State
  const [kuthiFiles, setKuthiFiles] = useState<File[]>([]);
  
  // "I don't have Kuthi" Checkbox State
  const [noKuthiPaper, setNoKuthiPaper] = useState(false);

  // Manual Birth Details
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('Imphal, Manipur');
  const [question, setQuestion] = useState('');

  // Payment State
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Services from API
  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
          const firstSvc = data.services[0];
          setSelectedServiceId(firstSvc.id);
          if (firstSvc.subServices && firstSvc.subServices.length > 0) {
            setSelectedSubServiceId(firstSvc.subServices[0].id);
          }
        }
      })
      .catch((err) => console.error('Error fetching services:', err));
  }, []);

  useEffect(() => {
    const ref = 'KY-2026-' + Math.floor(1000 + Math.random() * 9000);
    setOrderRef(ref);
  }, []);

  // Update selected sub-service when main service changes
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const found = services.find((s) => s.id === serviceId);
    if (found && found.subServices && found.subServices.length > 0) {
      setSelectedSubServiceId(found.subServices[0].id);
    } else {
      setSelectedSubServiceId('');
    }
  };

  // Find active service & sub-service objects
  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];
  const activeSubService = activeService?.subServices?.find((sub) => sub.id === selectedSubServiceId) || activeService?.subServices?.[0] || { id: 'sub-def', title: 'Standard Kuthi Yengba', price: 499 };
  const currentFee = activeSubService?.price || 499;

  // File Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setKuthiFiles((prev) => [...prev, ...newFiles]);
      // Reset input value so same file can be chosen again if needed
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setKuthiFiles((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter Full Name.');
      return;
    }

    if (!whatsappNo.trim() && !mobile.trim()) {
      setErrorMsg('Please enter WhatsApp / Mobile Number for report delivery.');
      return;
    }

    // Validation logic: If "I don't have Kuthi" checkbox is checked OR no files uploaded, birth details become mandatory!
    if (noKuthiPaper || kuthiFiles.length === 0) {
      if (!dob || !tob || !pob.trim()) {
        setErrorMsg('Since no Kuthi paper is uploaded, Date of Birth, Time of Birth, and Place of Birth are compulsory!');
        return;
      }
    }

    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!utrNumber.trim() && !screenshotFile) {
      setErrorMsg('Please enter the 12-digit UPI UTR Transaction Number or upload a Payment Proof Screenshot.');
      return;
    }

    setLoading(true);

    // Save order payload to API
    const orderPayload = {
      action: 'CREATE_ORDER',
      order: {
        clientName: name,
        sex,
        mobile: mobile || whatsappNo,
        whatsappNo: whatsappNo || mobile,
        kuthiAttached: kuthiFiles.length > 0,
        kuthiFilesCount: kuthiFiles.length,
        kuthiFileName: kuthiFiles.map((f) => f.name).join(', '),
        dob: dob || 'Kuthi Uploaded',
        tob: tob || 'Kuthi Uploaded',
        pob: pob || 'Kuthi Uploaded',
        question: `Selected: ${activeService?.title} -> ${activeSubService?.title}. ${question}`,
        utr: utrNumber,
        amount: currentFee,
        serviceType: activeSubService?.title || 'Kuthi Yengba',
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
            KangleiAstro Manipur Vedic Service
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a]">
            Kuthi Yengba <span className="text-[#b45309]">(Horoscope Analysis & Remedies)</span>
          </h1>

          <div className="flex items-center justify-between max-w-md mx-auto mt-6 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#f3e8d2] -translate-y-1/2 z-0" />
            
            {[
              { num: 1, label: 'Form Details & Service' },
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
              className="bg-white p-6 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-xl relative overflow-hidden text-left"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#fde68a]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0f172a]">Manipuri Kuthi Yengba Details</h3>
                    <p className="text-xs text-gray-500 font-sans">Select Service, enter contact details, upload Kuthi or specify birth data</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 bg-[#fef3c7] px-3 py-1.5 rounded-xl border border-[#fde68a] text-xs font-extrabold text-[#b45309]">
                  <span>Fee: ₹{currentFee}</span>
                </div>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-6 text-xs font-sans">
                
                {/* 1. SERVICE & SUB-SERVICE DROPDOWNS */}
                <div className="p-5 rounded-2xl bg-[#fefcf6] border border-[#fde68a] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#fde68a]/60 pb-2">
                    <span className="font-bold text-[#0f172a] uppercase tracking-wider text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#d97706]" />
                      <span>Select Service & Sub-Service</span>
                    </span>
                    <span className="font-mono font-extrabold text-sm text-[#b45309] bg-white px-3 py-1 rounded-lg border border-[#fde68a]">
                      Selected Fee: ₹{currentFee}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Service Category Dropdown */}
                    <div>
                      <label className="block font-bold text-[#0f172a] mb-1.5 uppercase tracking-wider">
                        Service Category<span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedServiceId}
                        onChange={(e) => handleServiceChange(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-[#0f172a] focus:border-[#d97706] focus:outline-none"
                      >
                        {services.map((svc) => (
                          <option key={svc.id} value={svc.id}>
                            {svc.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sub-Service Dropdown */}
                    <div>
                      <label className="block font-bold text-[#0f172a] mb-1.5 uppercase tracking-wider">
                        Sub-Service & Pricing<span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedSubServiceId}
                        onChange={(e) => setSelectedSubServiceId(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-[#d97706] bg-white text-xs font-bold text-[#b45309] focus:outline-none shadow-xs"
                      >
                        {activeService?.subServices?.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.title} — ₹{sub.price}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {activeSubService?.description && (
                    <p className="text-[11px] text-[#78350f] font-medium italic bg-white p-2.5 rounded-lg border border-[#fde68a]">
                      💡 {activeSubService.description}
                    </p>
                  )}
                </div>

                {/* 2. CLIENT NAME, GENDER, EMAIL */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                      Form Name (Client Full Name)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter client's full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
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
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. MOBILE & WHATSAPP NO */}
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
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-[#0f172a] uppercase tracking-wider">
                        WhatsApp No. (For Delivery)<span className="text-red-500">*</span>
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
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {/* 4. MULTIPLE KUTHI FILE UPLOAD SECTION */}
                <div className="p-5 rounded-2xl bg-[#fef3c7]/60 border border-[#fde68a] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#d97706]" />
                      <span>Upload Physical Kuthi / Kundali Papers (Multiple Files Supported)</span>
                    </label>
                    {kuthiFiles.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded bg-green-100 text-green-800 font-extrabold text-[10px]">
                        ✓ {kuthiFiles.length} File{kuthiFiles.length > 1 ? 's' : ''} Attached
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#78350f]">
                    Upload one or multiple photos/PDFs of your Kuthi (Kundali paper). If uploaded, manual birth details below are optional!
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="px-4 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-extrabold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs transition-all">
                      <Plus className="w-4 h-4" />
                      <span>{kuthiFiles.length > 0 ? 'Upload More Kuthi Files' : 'Choose Kuthi Files'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Attached Files List */}
                  {kuthiFiles.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#fde68a]">
                      <span className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wider block">Attached Kuthi Documents:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {kuthiFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#fde68a] text-xs">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-[#d97706] shrink-0" />
                              <div className="truncate">
                                <span className="font-bold text-[#0f172a] block truncate">{file.name}</span>
                                <span className="text-[10px] text-gray-500 font-mono">{(file.size / 1024).toFixed(1)} KB</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer ml-2 shrink-0"
                              title="Remove file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. CHECKBOX TOGGLE: "I DON'T HAVE KUTHI" */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <label className="inline-flex items-center gap-2.5 font-bold text-[#0f172a] text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noKuthiPaper}
                      onChange={(e) => setNoKuthiPaper(e.target.checked)}
                      className="w-4 h-4 rounded text-[#d97706] focus:ring-[#d97706]"
                    />
                    <span>I don't have a Kuthi paper (Enter Birth Details Manually)</span>
                  </label>
                  {noKuthiPaper && (
                    <span className="px-2.5 py-0.5 rounded bg-amber-200 text-[#78350f] text-[10px] font-extrabold uppercase">
                      Manual Details Active
                    </span>
                  )}
                </div>

                {/* 6. EXPANDABLE BIRTH DETAILS FORM (Opened when checkbox checked OR no files uploaded) */}
                {(noKuthiPaper || kuthiFiles.length === 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 rounded-2xl bg-white border border-[#f3e8d2] space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#f3e8d2]">
                      <span className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#d97706]" />
                        <span>Birth Details (Compulsory)</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-100 text-red-700">
                        Compulsory
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Date of Birth<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required={noKuthiPaper || kuthiFiles.length === 0}
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Time of Birth<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          required={noKuthiPaper || kuthiFiles.length === 0}
                          value={tob}
                          onChange={(e) => setTob(e.target.value)}
                          className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Place of Birth<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={noKuthiPaper || kuthiFiles.length === 0}
                          placeholder="e.g. Imphal, Bishnupur"
                          value={pob}
                          onChange={(e) => setPob(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-bold focus:border-[#d97706] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#0f172a] mb-1 uppercase tracking-wider">
                        Specific Questions / Notes for Astrologer (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ask specific questions about career, marriage timing, health, or remedies..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-300 bg-[#fefcf6] text-xs text-[#0f172a] font-medium focus:border-[#d97706] focus:outline-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Submit Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Summary & Payment (₹{currentFee})</span>
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
                <span>Back to Form Details</span>
              </button>

              {/* Order Summary Box */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#fde68a]/50">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Kuthi Yengba Order Summary</h3>
                    <p className="text-xs text-gray-500 font-sans">Order Ref: <span className="font-mono font-bold text-[#b45309]">{orderRef}</span></p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#fef3c7] text-[#b45309] font-extrabold text-sm border border-[#fde68a]">
                    Total Fee: ₹{currentFee}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-gray-700 bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a]">
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Selected Service</span>
                    <span className="font-bold text-[#0f172a] text-sm">{activeService?.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Selected Option / Sub-Service</span>
                    <span className="font-bold text-[#b45309] text-sm">{activeSubService?.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Form Name (Client)</span>
                    <span className="font-bold text-[#0f172a] text-sm">{name} ({sex})</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">WhatsApp Delivery Number</span>
                    <span className="font-bold text-[#b45309] text-sm">{whatsappNo || mobile}</span>
                  </div>
                  <div className="md:col-span-2 pt-2 border-t border-[#fde68a]">
                    <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Kuthi Files Attached</span>
                    <span className="font-medium text-green-700">
                      {kuthiFiles.length > 0 ? `✓ ${kuthiFiles.length} file(s): ${kuthiFiles.map((f) => f.name).join(', ')}` : 'No files attached (Manual birth details)'}
                    </span>
                  </div>
                  {(noKuthiPaper || kuthiFiles.length === 0) && (
                    <div className="md:col-span-2 pt-2 border-t border-[#fde68a]">
                      <span className="text-gray-400 uppercase tracking-wider block text-[10px] font-bold">Manual Birth Particulars</span>
                      <span className="font-medium text-[#0f172a]">DOB: {dob} • Time: {tob} • Place: {pob}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* UPI Payment Box */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xl text-center relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 mb-4 text-[#b45309]">
                  <QrCode className="w-6 h-6" />
                  <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Scan & Pay ₹{currentFee} via UPI</h3>
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
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    {loading ? 'Submitting Verification...' : `Submit Order (₹${currentFee}) →`}
                  </button>
                </form>
              </div>

            </motion.div>
          )}

          {/* STEP 3: THANK YOU & CONFIRMATION */}
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
                🙏 Thank You! Your Order Has Been Submitted
              </h2>

              <div className="bg-[#fefcf6] p-6 rounded-2xl border border-[#fde68a] text-xs sm:text-sm text-[#78350f] leading-relaxed mb-8 font-medium shadow-xs">
                We have received your <strong>{activeSubService?.title}</strong> request. Your report & remedial analysis will be sent directly to your WhatsApp Number:
                <strong className="block text-base text-[#b45309] font-bold mt-2 font-mono">
                  {whatsappNo || mobile}
                </strong>
                <span className="inline-block mt-3 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                  ⚡ Delivery Window: Within 12 Hours
                </span>
              </div>

              <div className="bg-[#fffdfa] rounded-2xl p-5 text-left border border-[#f3e8d2] space-y-2.5 text-xs mb-8 font-sans">
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Order Reference:</span>
                  <span className="font-mono text-[#b45309] font-bold">{orderRef}</span>
                </div>
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Form Name (Client):</span>
                  <span className="font-bold text-[#0f172a]">{name} ({sex})</span>
                </div>
                <div className="flex justify-between border-b border-[#f3e8d2] pb-2">
                  <span className="text-gray-500">Selected Option:</span>
                  <span className="font-bold text-[#b45309]">{activeSubService?.title}</span>
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

export default function ManipuriKuthiYengbaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdfa] pt-20 text-center text-[#0f172a]">Loading Portal...</div>}>
      <ManipuriKuthiYengbaContent />
    </Suspense>
  );
}
