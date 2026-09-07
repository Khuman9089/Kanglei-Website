'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Download, Printer, ArrowRight, Home, CreditCard } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') || 'TXN-UNKNOWN';
  const amount = searchParams.get('amount') || '0';
  const service = searchParams.get('service') || 'Astrological Consultation Service';
  const payId = searchParams.get('payId') || txnid;
  const orderRef = searchParams.get('orderRef') || txnid;

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto w-full space-y-6"
      >
        {/* SUCCESS BADGE */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PayU Gateway Payment Verified</span>
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#0f172a]">
            Payment Successful!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Your payment has been received and verified in real-time. Your consultation or order has been securely registered.
          </p>
        </div>

        {/* OFFICIAL DIGITAL RECEIPT CARD */}
        <div className="bg-white rounded-3xl border border-[#f3e8d2] shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex justify-between items-start border-b border-[#f3e8d2] pb-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">OFFICIAL RECEIPT</span>
              <h2 className="font-serif font-bold text-xl text-[#b45309]">KangleiAstro Services</h2>
              <p className="text-[11px] text-gray-500">Imphal, Manipur · support@kangleiastro.com</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">AMOUNT PAID</span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-600">₹{amount}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Service / Item:</span>
              <span className="font-bold text-right text-[#0f172a] max-w-[260px] truncate">{service}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Order Reference:</span>
              <span className="font-mono font-bold text-[#b45309]">{orderRef}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">PayU Payment ID:</span>
              <span className="font-mono font-bold text-gray-800">{payId}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Merchant Txn ID:</span>
              <span className="font-mono text-gray-700 text-[11px]">{txnid}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Date & Time:</span>
              <span className="font-medium text-gray-700">{currentDate}</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">Payment Channel:</span>
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>PayU Gateway (Cards / UPI / NetBanking)</span>
              </span>
            </div>
          </div>

          {/* NEXT STEPS BANNER */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
            <span className="font-bold text-amber-900 block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              What Happens Next?
            </span>
            <p className="text-amber-800 text-[11.5px] leading-relaxed">
              Our Vedic Astrologers and Bureau have received your verified order. You can track progress, view predictions, and download uploaded reports directly in your Client Portal.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard/client"
              className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 text-center cursor-pointer"
            >
              <span>View in Client Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>

        {/* BACK TO HOME */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#b45309] font-semibold transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to KangleiAstro Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center text-sm font-bold text-gray-500">
          Loading Payment Receipt...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
