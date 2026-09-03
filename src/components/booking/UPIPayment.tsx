'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Copy, Check, Upload, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

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
      })
      .catch((err) => console.error('Error fetching UPI settings:', err));
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
    if (!utr.trim() && !file) {
      setError('Please enter a 12-digit UTR/Transaction ID or upload a payment screenshot.');
      return;
    }

    if (utr.trim() && utr.trim().length < 8) {
      setError('Please enter a valid Transaction ID / UTR number.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

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

      {/* UPI Details & QR Section */}
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
                className="p-1.5 rounded hover:bg-[#1c2541] text-[#c69214] transition-colors"
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

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#c69214] to-[#e0a96d] text-[#0b132b] font-bold hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Submitting Payment Proof...' : 'Confirm Payment & Submit Booking'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
