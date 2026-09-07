'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Copy, Check, Upload, ArrowRight, ShieldCheck, AlertCircle, CreditCard, Lock } from 'lucide-react';

interface UPIPaymentProps {
  amount: number;
  serviceName: string;
  bookingRef: string;
  onPaymentSubmitted: (data: { utr: string; screenshotUrl?: string }) => void;
}

export default function UPIPayment({
  amount,
  serviceName,
  bookingRef,
  onPaymentSubmitted,
}: UPIPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'payu' | 'manual_upi'>('payu');
  const [payuEnabled, setPayuEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [upiSettings, setUpiSettings] = useState({
    upiId: 'kangleiastro@upi',
    payeeName: 'KangleiAstro Services',
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=kangleiastro@upi&pn=KangleiAstro%20Services',
    qrNotes: 'Scan with GPay, PhonePe, Paytm, BHIM or any UPI app',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.upiSettings) {
          setUpiSettings((prev) => ({ ...prev, ...data.upiSettings }));
        }
        if (data.payuSettings) {
          const isEnabled = data.payuSettings.enabled !== false;
          setPayuEnabled(isEnabled);
          if (!isEnabled) {
            setPaymentMethod('manual_upi');
          }
        }
      })
      .catch((err) => console.error('Error fetching settings in UPIPayment:', err));
  }, []);

  const upiId = upiSettings.upiId || 'kangleiastro@upi';
  const holderName = upiSettings.payeeName || 'KangleiAstro Services';

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (paymentMethod === 'manual_upi') {
      if (!utr.trim() && !file) {
        setError('Please enter a 12-digit UTR/Transaction ID or upload a payment screenshot.');
        return;
      }

      if (utr.trim() && utr.trim().length < 8) {
        setError('Please enter a valid Transaction ID / UTR number.');
        return;
      }

      setIsSubmitting(true);

      try {
        // Pass data to parent callback
        onPaymentSubmitted({
          utr: utr.trim(),
          screenshotUrl: file ? file.name : undefined,
        });
      } catch (err) {
        setError('Failed to submit payment details. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // PayU Instant Online Gateway Flow
      setIsSubmitting(true);
      try {
        const orderPayload = {
          bookingRef,
          serviceName,
          amount,
          paymentMethod: 'PAYU',
        };

        const res = await fetch('/api/payment/payu/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            productInfo: serviceName || 'Astrology Service',
            firstname: 'Client',
            email: 'client@kangleiastro.com',
            phone: '9862012345',
            orderType: 'consultation',
            orderPayload,
          }),
        });

        const initData = await res.json();
        if (!initData.success) {
          setIsSubmitting(false);
          setError(initData.error || 'Failed to initiate PayU payment.');
          return;
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = initData.actionUrl;

        Object.entries(initData.params).forEach(([key, val]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(val ?? '');
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } catch (err: any) {
        setIsSubmitting(false);
        setError(err.message || 'Error redirecting to PayU gateway.');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto glass-card p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c69214]/10 border border-[#c69214]/20 text-[#e0a96d] text-sm font-medium mb-3">
          <ShieldCheck className="w-4 h-4 text-[#c69214]" />
          Instant UPI Payment Verification
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#faf8f4]">Complete Payment</h2>
        <p className="text-[#5c7a99] text-sm mt-1">
          Pay via any UPI App (GPay, PhonePe, Paytm) & enter the reference UTR below.
        </p>
      </div>

      {/* Summary Box */}
      <div className="bg-[#0b132b]/80 border border-[#3a506b]/50 rounded-xl p-4 mb-6 flex justify-between items-center">
        <div>
          <div className="text-[#5c7a99] text-xs uppercase tracking-wider">Service</div>
          <div className="text-[#faf8f4] font-medium">{serviceName}</div>
          <div className="text-xs text-[#e0a96d]">Ref: {bookingRef}</div>
        </div>
        <div className="text-right">
          <div className="text-[#5c7a99] text-xs uppercase tracking-wider">Amount Due</div>
          <div className="text-2xl font-bold text-gradient-gold">₹{amount}</div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Payment Method Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {payuEnabled && (
          <button
            type="button"
            onClick={() => setPaymentMethod('payu')}
            className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 relative ${
              paymentMethod === 'payu'
                ? 'border-[#c69214] bg-[#c69214]/15 shadow-sm'
                : 'border-[#3a506b]/50 hover:border-[#3a506b] bg-[#0b132b]/60'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
              paymentMethod === 'payu' ? 'border-[#c69214] bg-[#c69214]' : 'border-gray-500'
            }`}>
              {paymentMethod === 'payu' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[#faf8f4]">PayU Gateway</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold">Instant</span>
              </div>
              <p className="text-[11px] text-[#5c7a99] mt-0.5">Cards, NetBanking, GPay, PhonePe, Paytm</p>
            </div>
          </button>
        )}

        <button
          type="button"
          onClick={() => setPaymentMethod('manual_upi')}
          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 relative ${
            paymentMethod === 'manual_upi'
              ? 'border-[#c69214] bg-[#c69214]/15 shadow-sm'
              : 'border-[#3a506b]/50 hover:border-[#3a506b] bg-[#0b132b]/60'
          }`}
        >
          <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
            paymentMethod === 'manual_upi' ? 'border-[#c69214] bg-[#c69214]' : 'border-gray-500'
          }`}>
            {paymentMethod === 'manual_upi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-[#faf8f4]">Manual UPI QR</span>
              <span className="px-1.5 py-0.2 rounded bg-gray-700/50 text-gray-300 text-[10px] font-bold">UTR</span>
            </div>
            <p className="text-[11px] text-[#5c7a99] mt-0.5">Scan QR & submit 12-digit UTR</p>
          </div>
        </button>
      </div>

      {paymentMethod === 'payu' ? (
        /* PAYU GATEWAY PANEL */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-xl bg-[#1c2541]/50 border border-[#3a506b]/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Confirmation via PayU Online Gateway</span>
            </div>
            <p className="text-[#5c7a99] leading-relaxed">
              Pay securely via Credit/Debit Cards, NetBanking, or any UPI App with real-time verification and zero manual UTR wait times.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Connecting to PayU...' : `Pay ₹${amount} with PayU Gateway →`}</span>
          </button>
        </form>
      ) : (
        /* MANUAL UPI DETAILS & QR SECTION */
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-center bg-[#1c2541]/40 rounded-xl p-4 border border-[#3a506b]/30">
            {/* QR Code Display */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg text-center">
              <div className="w-36 h-36 bg-gray-100 border border-gray-300 rounded flex items-center justify-center relative overflow-hidden">
                {upiSettings.qrImageUrl ? (
                  <img src={upiSettings.qrImageUrl} alt="Merchant UPI QR Code" className="w-full h-full object-contain p-1" />
                ) : (
                  <QrCode className="w-28 h-28 text-[#0b132b]" />
                )}
              </div>
              <span className="text-[10px] text-gray-500 mt-2 font-mono">{upiSettings.qrNotes || 'Scan with any UPI App'}</span>
            </div>

            {/* UPI Details */}
            <div className="space-y-4">
              <div>
                <label className="text-[#5c7a99] text-xs block mb-1">UPI ID</label>
                <div className="flex items-center gap-2 bg-[#0b132b] border border-[#3a506b] rounded-lg p-2 text-sm font-mono text-[#faf8f4]">
                  <span className="flex-1 truncate">{upiId}</span>
                  <button
                    type="button"
                    onClick={handleCopyUPI}
                    className="p-1.5 rounded hover:bg-[#1c2541] text-[#c69214] transition-colors cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#5c7a99] text-xs block">Account Name</label>
                <span className="text-sm font-medium text-[#e0a96d]">{holderName}</span>
              </div>
            </div>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#faf8f4] mb-1">
                12-Digit UTR / Transaction Ref No.
              </label>
              <input
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 423871928341"
                className="w-full px-4 py-3 rounded-lg bg-[#0b132b] border border-[#3a506b] text-[#faf8f4] placeholder-[#5c7a99] focus:border-[#c69214] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#faf8f4] mb-1">
                Upload Payment Screenshot (Optional)
              </label>
              <div className="relative border-2 border-dashed border-[#3a506b] rounded-lg p-4 text-center hover:border-[#c69214] transition-colors cursor-pointer bg-[#0b132b]/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1 text-sm text-[#5c7a99]">
                  <Upload className="w-5 h-5 text-[#c69214]" />
                  {file ? (
                    <span className="text-green-400 font-medium">{file.name}</span>
                  ) : (
                    <span>Click or drag image screenshot to upload</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-lg bg-gradient-gold text-[#0b132b] font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0b132b] border-t-transparent rounded-full animate-spin" />
                  <span>Submitting UTR...</span>
                </>
              ) : (
                <>
                  <span>Submit Payment Verification</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
