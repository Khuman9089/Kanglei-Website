'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, QrCode, CheckCircle2, Truck } from 'lucide-react';
import { Input } from '../ui/Input';

interface KuthiIbaPageFormProps {
  onSubmitSuccess: (formData: any) => void;
  isLoading?: boolean;
}

const MANIPUR_YEK_OPTIONS = [
  'Mangang',
  'Luwang',
  'Khuman',
  'Angom',
  'Moirang',
  'Kha-Nganba',
  'Salai-Leishangthem',
  'Other / Non-Meitei',
];

export default function KuthiIbaPageForm({ onSubmitSuccess, isLoading = false }: KuthiIbaPageFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Form, 2: UPI Payment, 3: Order Completed
  const [category, setCategory] = useState<'new_born_baby' | 'kuthi_rewrite'>('new_born_baby');

  // Form State
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [yek, setYek] = useState(MANIPUR_YEK_OPTIONS[0]);
  const [gotra, setGotra] = useState('Sagei / Gotra');
  const [sex, setSex] = useState('Male');
  const [dateOfBirth, setDateOfBirth] = useState('2026-08-28');
  const [timeOfBirth, setTimeOfBirth] = useState('06:00');
  const [placeOfBirth, setPlaceOfBirth] = useState('Imphal, Manipur');
  const [whatsappNo, setWhatsappNo] = useState('+91 ');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [utr, setUtr] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [completedOrderRef, setCompletedOrderRef] = useState<string>('');

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (category === 'kuthi_rewrite' && !name.trim()) {
      setError('Please enter the client name for Kuthi rewrite.');
      return;
    }
    if (!fatherName.trim() || !motherName.trim()) {
      setError("Please enter Father's and Mother's name.");
      return;
    }
    if (!dateOfBirth || !timeOfBirth || !placeOfBirth.trim()) {
      setError('Please enter complete birth date, time, and place.');
      return;
    }
    if (!whatsappNo.trim() || whatsappNo.trim().length < 10) {
      setError('Please enter a valid WhatsApp mobile number for digital delivery.');
      return;
    }
    if (!deliveryAddress.trim()) {
      setError('Please enter delivery address for physical Kuthi shipment.');
      return;
    }

    setStep(2); // Move to UPI payment step
  };

  const handleConfirmPaymentSubmit = async () => {
    setError(null);
    if (!utr.trim() || utr.trim().length < 6) {
      setError('Please enter valid 12-Digit UPI Transaction Reference / UTR Number.');
      return;
    }

    try {
      const orderPayload = {
        action: 'CREATE_ORDER',
        order: {
          clientName: category === 'new_born_baby' ? `New Born Baby (Father: ${fatherName})` : name,
          fatherName,
          motherName,
          yek,
          gotra,
          sex,
          dob: dateOfBirth,
          tob: timeOfBirth,
          pob: placeOfBirth,
          mobile: whatsappNo,
          whatsappNo,
          deliveryAddress,
          category,
          utr,
          amount: 899,
          serviceType: 'Kuthi Iba (কুঠি ইবা)',
        },
      };

      const res = await fetch('/api/kuthi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success && data.order) {
        setCompletedOrderRef(data.order.orderRef || 'KY-2026-8949');
        setStep(3);

        // Also calculate live interactive chart
        onSubmitSuccess({
          name: category === 'new_born_baby' ? `New Born Baby (Father: ${fatherName})` : name,
          gender: sex,
          dateOfBirth,
          timeOfBirth,
          placeName: placeOfBirth,
          latitude: 24.8170,
          longitude: 93.9368,
          utcOffset: 5.5,
          ayanamsa: 'LAHIRI',
        });
      } else {
        throw new Error(data.error || 'Failed to submit order. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Error processing request.');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#fde68a] shadow-xl relative overflow-hidden text-[#0f172a]">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Kuthi Iba (কুঠি ইবা) Service</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0f172a]">
            Order Kuthi Iba (কুঠি ইবা) — ₹899
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
            Complete Vedic Kuthi preparation with 24-hour WhatsApp PDF & Express physical delivery
          </p>
        </div>

        <div className="bg-[#fefcf6] px-5 py-3 rounded-2xl border border-[#fde68a] text-right">
          <span className="text-[11px] text-gray-500 font-bold block uppercase">Fixed Fee</span>
          <span className="text-2xl font-serif font-black text-[#b45309]">₹899</span>
        </div>
      </div>

      {/* STEP 1: INTAKE FORM */}
      {step === 1 && (
        <form onSubmit={handleProceedToPayment} className="space-y-6">
          {/* Category Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-[#0f172a] uppercase tracking-wider">
              Select Kuthi Category:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCategory('new_born_baby')}
                className={`p-4 rounded-2xl border-2 font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                  category === 'new_born_baby'
                    ? 'bg-[#fef3c7] border-[#d97706] text-[#b45309] shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>👶 New Born Baby</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('kuthi_rewrite')}
                className={`p-4 rounded-2xl border-2 font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                  category === 'kuthi_rewrite'
                    ? 'bg-[#fef3c7] border-[#d97706] text-[#b45309] shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>📜 Kuthi Rewrite</span>
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {category === 'kuthi_rewrite' && (
              <Input
                label="Client / Baby Name (Kuthi Rewrite)"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sanatomba Meitei"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Father's Name"
                required
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="Father's full name"
              />
              <Input
                label="Mother's Name"
                required
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="Mother's full name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-extrabold text-[#0f172a]">Yek (Salai)</label>
                <select
                  value={yek}
                  onChange={(e) => setYek(e.target.value)}
                  className="w-full rounded-xl border border-[#fde68a] bg-[#fefcf6] px-3.5 py-2.5 text-sm font-extrabold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#d97706]/40"
                >
                  {MANIPUR_YEK_OPTIONS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Gotra (Sagei)"
                required
                value={gotra}
                onChange={(e) => setGotra(e.target.value)}
                placeholder="e.g. Sagei / Gotra"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-extrabold text-[#0f172a]">Sex (Gender)</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full rounded-xl border border-[#fde68a] bg-[#fefcf6] px-3.5 py-2.5 text-sm font-extrabold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#d97706]/40"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                type="date"
                label="Date Of Birth"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />

              <Input
                type="time"
                label="Time Of Birth"
                required
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
              />
            </div>

            <Input
              label="Place Of Birth"
              required
              value={placeOfBirth}
              onChange={(e) => setPlaceOfBirth(e.target.value)}
              placeholder="City, District, State (e.g. Imphal West, Manipur)"
            />

            <div className="pt-2 border-t border-gray-100 space-y-4">
              <Input
                label="WhatsApp Mobile No (Digital PDF Delivery)"
                required
                value={whatsappNo}
                onChange={(e) => setWhatsappNo(e.target.value)}
                placeholder="+91 98620 12345"
              />

              <Input
                isTextarea
                label="Delivery Address (Physical Hardcopy Delivery)"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House No, Leikai/Street, Landmark, City, District, State & Pincode"
              />
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-base shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Pay ₹899 (Kuthi Iba - কুঠি ইবা)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      )}

      {/* STEP 2: UPI PAYMENT GATEWAY */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a] text-center space-y-1">
            <span className="text-xs text-gray-500 font-bold uppercase">Kuthi Iba (কুঠি ইবা) Service</span>
            <h4 className="text-3xl font-serif font-extrabold text-[#b45309]">₹899 Only</h4>
            <p className="text-xs text-gray-600 font-medium">Scan UPI QR Code using Google Pay, PhonePe, or Paytm</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <div className="p-5 bg-white border-2 border-[#d97706] rounded-3xl shadow-lg">
              <QrCode className="w-44 h-44 text-[#0f172a]" />
            </div>
            <div className="text-center font-mono text-sm font-extrabold text-[#b45309] bg-[#fef3c7] px-5 py-2 rounded-full border border-[#fde68a]">
              UPI ID: 9862012345@upi
            </div>
          </div>

          <Input
            label="Enter 12-Digit UPI Transaction Ref / UTR Number"
            required
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder="e.g. 429810394812"
          />

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-100"
            >
              Back to Edit Details
            </button>

            <button
              type="button"
              onClick={handleConfirmPaymentSubmit}
              disabled={isLoading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-md hover:shadow-xl transition-all"
            >
              {isLoading ? 'Verifying & Generating Chart...' : 'I Have Made Payment (Confirm ₹899)'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ORDER SUCCESS */}
      {step === 3 && (
        <div className="text-center space-y-6 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
              ORDER REF: {completedOrderRef}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#0f172a]">
              Kuthi Details Forwarded to Astrologer!
            </h3>
            <p className="text-sm text-gray-700 max-w-lg mx-auto leading-relaxed font-medium">
              Your details and payment have been verified. Our Acharyas have started preparing your complete Kuthi.
            </p>
          </div>

          <div className="bg-[#fefcf6] p-5 rounded-2xl border border-[#fde68a] text-left text-xs space-y-2.5 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-[#b45309] font-extrabold">
              <Truck className="w-4 h-4" />
              <span>Delivery Timelines:</span>
            </div>
            <ul className="space-y-1.5 text-gray-700 font-medium list-disc list-inside">
              <li>Digital High-Resolution PDF sent via <strong>WhatsApp ({whatsappNo})</strong> within <strong>24 Hours</strong>.</li>
              <li>Physical Hand-written Kuthi dispatched via Express Courier to your address.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
