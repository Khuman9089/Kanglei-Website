'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  RotateCcw, Upload, Image as ImageIcon, X, CheckCircle2, 
  AlertCircle, Package, ArrowRight, ShieldCheck, User 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ShopReturnsPage() {
  const [orderRef, setOrderRef] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [requestType, setRequestType] = useState<'REPLACEMENT' | 'REFUND'>('REPLACEMENT');
  const [reason, setReason] = useState<'WRONG_ITEM' | 'DAMAGED_TRANSIT' | 'DEFECTIVE_QUALITY' | 'OTHER'>('DAMAGED_TRANSIT');
  const [reasonDetails, setReasonDetails] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [refundMethod, setRefundMethod] = useState<'UPI' | 'BANK'>('UPI');
  const [refundDetails, setRefundDetails] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; msg: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Auto-fill from URL params or local user account
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const qOrder = urlParams.get('orderRef') || urlParams.get('order') || urlParams.get('id');
      const qProduct = urlParams.get('product') || urlParams.get('productTitle');
      if (qOrder) setOrderRef(qOrder);
      if (qProduct) setProductTitle(qProduct);

      try {
        const stored = localStorage.getItem('kanglei_user');
        if (stored) {
          const u = JSON.parse(stored);
          if (u) {
            setIsLoggedIn(true);
            if (u.name) setCustomerName(u.name);
            if (u.phone || u.mobile || u.whatsappNo) {
              setCustomerPhone(u.phone || u.mobile || u.whatsappNo);
            }
            if (u.email) setCustomerEmail(u.email);
          }
        }
      } catch (e) {}
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 5MB. Please upload smaller images.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!orderRef.trim() || !customerName.trim() || !customerPhone.trim() || !productTitle.trim()) {
      setFormError('Please enter Order Number, Your Name, Contact Phone, and Product Name.');
      setSubmitting(false);
      return;
    }

    if (photos.length === 0) {
      setFormError('Please upload at least one photo showing the product defect, damage, or wrong package.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/shop/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef,
          customerName,
          customerPhone,
          customerEmail,
          productTitle,
          requestType,
          reason,
          reasonDetails,
          photos,
          refundMethod,
          refundDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request.');
      }

      setSubmittedTicket({
        id: data.ticketId || `RMA-${Date.now()}`,
        msg: data.message || 'Your return request has been recorded.',
      });
    } catch (err: any) {
      setFormError(err.message || 'Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans text-[#0f172a]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white pt-28 pb-16 px-4 md:px-8 border-b border-amber-900/30 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>E-Shop Return & Replacement Center</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Product <span className="text-[#fbbf24]">Return or Replacement</span> Form
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Received a damaged, defective, or incorrect product? Upload photos and submit your request below for an immediate 100% replacement or full money-back refund.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-400 pt-1">
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1 rounded-full backdrop-blur-xs text-gray-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Replacement / Refund Guarantee</span>
            </span>
            <span className="text-gray-300">
              Valid within 7 days of package delivery
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 md:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#fde68a]/70 shadow-xl space-y-8">
          
          <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#b45309] block">
                ✦ Step 1 of 1: Request Details
              </span>
              <h2 className="font-serif text-2xl font-black text-[#0f172a] mt-0.5">
                Submit Product Return / Replacement
              </h2>
            </div>
            {isLoggedIn && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1 self-start sm:self-auto">
                <User className="w-3 h-3 text-emerald-600" />
                <span>Account Pre-filled</span>
              </span>
            )}
          </div>

          {formError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {submittedTicket ? (
            <div className="p-8 rounded-3xl bg-emerald-50/80 border border-emerald-300 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-emerald-950">
                Return / Replacement Request Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-900 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{customerName}</strong>. Your request along with product photographs has been submitted to the platform administration. We will inspect the details and initiate your {requestType === 'REPLACEMENT' ? 'free express replacement' : '100% refund'} shortly.
              </p>

              <div className="inline-block px-5 py-2.5 rounded-2xl bg-white border border-emerald-300 font-mono text-xs font-bold text-emerald-950 shadow-sm">
                RMA Ticket Reference: <span className="text-[#b45309] text-sm font-black">{submittedTicket.id}</span>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/shop"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md"
                >
                  Continue Shopping in E-Store
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedTicket(null);
                    setPhotos([]);
                    setReasonDetails('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs text-gray-700">
              
              {/* SECTION 1: ORDER & CUSTOMER */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-base text-[#b45309] flex items-center gap-2 border-b border-amber-100 pb-2">
                  <Package className="w-4 h-4 text-[#d97706]" />
                  <span>1. Order & Contact Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Order Number / Reference <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ORD-2026-8942"
                      value={orderRef}
                      onChange={(e) => setOrderRef(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-mono font-bold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">Found on your order confirmation SMS or receipt</span>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Product Name / Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Natural Yellow Sapphire / Shree Yantra"
                      value={productTitle}
                      onChange={(e) => setProductTitle(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-semibold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oinam Robert Singh"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-semibold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Contact Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9862012345"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-semibold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-semibold text-gray-900 focus:border-[#d97706] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: REQUEST TYPE & REASON */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-base text-[#b45309] flex items-center gap-2 border-b border-amber-100 pb-2">
                  <RotateCcw className="w-4 h-4 text-[#d97706]" />
                  <span>2. Return or Replacement Preference</span>
                </h3>

                <div>
                  <label className="block font-bold text-gray-800 mb-2">
                    What would you like us to do? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRequestType('REPLACEMENT')}
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        requestType === 'REPLACEMENT'
                          ? 'border-[#d97706] bg-amber-50/70 font-bold'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="font-extrabold text-sm text-[#0f172a] block">
                        🔄 Send Free Replacement
                      </span>
                      <p className="text-[11px] text-gray-500 mt-1">
                        We will dispatch a fresh, certified replacement item via express courier immediately.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRequestType('REFUND')}
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        requestType === 'REFUND'
                          ? 'border-[#d97706] bg-amber-50/70 font-bold'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="font-extrabold text-sm text-[#0f172a] block">
                        💰 100% Full Money-Back Refund
                      </span>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Refund the total purchase amount back to your original payment method or UPI/Bank.
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Primary Reason for Return <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-bold text-gray-800 focus:border-[#d97706] focus:outline-none"
                  >
                    <option value="DAMAGED_TRANSIT">Product Damaged / Broken during shipping</option>
                    <option value="WRONG_ITEM">Wrong product received (Different from order)</option>
                    <option value="DEFECTIVE_QUALITY">Defective / Wrong Quality / Flawed Gemstone</option>
                    <option value="OTHER">Other Reason</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Detailed Description of the Issue <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe exactly what was wrong, damaged, or incorrect with the delivered parcel..."
                    value={reasonDetails}
                    onChange={(e) => setReasonDetails(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#faf8f5] border border-gray-300 text-xs font-medium text-gray-800 focus:border-[#d97706] focus:bg-white focus:outline-none resize-y"
                  />
                </div>
              </div>

              {/* SECTION 3: PHOTO UPLOADS */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base text-[#b45309] flex items-center gap-2 border-b border-amber-100 pb-2">
                  <Upload className="w-4 h-4 text-[#d97706]" />
                  <span>3. Upload Photos of Product & Packaging *</span>
                </h3>

                <p className="text-xs text-gray-500">
                  Please upload clear photos showing the damaged parts, wrong item label, or packaging. This allows our team to approve your request immediately without delay.
                </p>

                {/* Upload Trigger Area */}
                <label className="block p-6 border-2 border-dashed border-[#d97706]/40 hover:border-[#d97706] bg-[#fefcf6] rounded-3xl cursor-pointer text-center transition-all">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#b45309] flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-[#b45309] block">
                    Click to browse and upload product photos
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Supports JPG, PNG, WEBP files (Max 5MB per photo)
                  </span>
                </label>

                {/* Photo Previews */}
                {photos.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="font-bold text-[11px] text-gray-700 block">
                      Uploaded Photos ({photos.length}):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {photos.map((src, pIdx) => (
                        <div key={pIdx} className="relative rounded-2xl overflow-hidden border border-gray-300 group aspect-square bg-gray-100 shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Defect photo ${pIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(pIdx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs opacity-90 hover:opacity-100 transition-opacity shadow-md"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: REFUND DETAILS (CONDITIONAL) */}
              {requestType === 'REFUND' && (
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#f3e8d2] space-y-3">
                  <label className="block font-bold text-gray-800 text-xs">
                    Refund Payout Method (Where should we send your refund?)
                  </label>
                  
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                      <input
                        type="radio"
                        name="refundMethod"
                        checked={refundMethod === 'UPI'}
                        onChange={() => setRefundMethod('UPI')}
                        className="text-[#d97706] focus:ring-amber-500"
                      />
                      <span>UPI VPA ID (Instant)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                      <input
                        type="radio"
                        name="refundMethod"
                        checked={refundMethod === 'BANK'}
                        onChange={() => setRefundMethod('BANK')}
                        className="text-[#d97706] focus:ring-amber-500"
                      />
                      <span>Bank Account & IFSC</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder={refundMethod === 'UPI' ? 'e.g. yourname@upi or 9862012345@ybl' : 'e.g. Account No: 1234567890, IFSC: SBIN0001234, Name: John Doe'}
                    value={refundDetails}
                    onChange={(e) => setRefundDetails(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-gray-300 text-xs font-mono font-bold text-gray-900 focus:border-[#d97706] focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 block">
                    If you paid via PayU Online Gateway, the amount can also be refunded back directly to your original card or bank account.
                  </span>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{submitting ? 'Submitting Request & Uploading Photos...' : `Submit ${requestType === 'REPLACEMENT' ? 'Replacement' : 'Refund'} Request →`}</span>
              </button>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
