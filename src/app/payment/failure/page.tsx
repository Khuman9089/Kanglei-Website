'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, AlertTriangle, ArrowLeft, RefreshCw, HelpCircle, PhoneCall } from 'lucide-react';

function FailureContent() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') || 'TXN-UNKNOWN';
  const amount = searchParams.get('amount') || '0';
  const reason = searchParams.get('reason') || 'Transaction was declined or cancelled by customer / bank.';
  const orderRef = searchParams.get('orderRef') || txnid;

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto w-full space-y-6"
      >
        {/* FAILURE BADGE */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-rose-300">
            <XCircle className="w-12 h-12 text-rose-600" />
          </div>
          <span className="px-3.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>PayU Gateway Payment Incomplete</span>
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#0f172a]">
            Payment Unsuccessful
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Your transaction could not be processed. If any money was debited from your bank, it will be automatically refunded within 3–5 working days by your bank.
          </p>
        </div>

        {/* DETAILS CARD */}
        <div className="bg-white rounded-3xl border border-[#f3e8d2] shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex justify-between items-start border-b border-[#f3e8d2] pb-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">TRANSACTION STATUS</span>
              <h2 className="font-serif font-bold text-xl text-rose-600">Failed / Cancelled</h2>
            </div>
            {amount !== '0' && (
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">ATTEMPTED AMOUNT</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-gray-800">₹{amount}</span>
              </div>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Order Reference:</span>
              <span className="font-mono font-bold text-[#b45309]">{orderRef}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Transaction ID:</span>
              <span className="font-mono text-gray-700 text-[11px]">{txnid}</span>
            </div>

            <div className="py-2">
              <span className="text-gray-500 block mb-1">Reason / Gateway Message:</span>
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-800 text-xs leading-relaxed font-medium">
                {reason}
              </div>
            </div>
          </div>

          {/* HELP BANNER */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
            <span className="font-bold text-amber-900 block flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Need Assistance?
            </span>
            <p className="text-amber-800 text-[11.5px] leading-relaxed">
              You can retry payment using an alternative UPI ID, Debit/Credit card, Netbanking, or choose our manual direct UPI QR transfer option.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/manipuri_kuthi_yengba"
              className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 text-center cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry / Choose Alternate Payment</span>
            </Link>

            <Link
              href="/dashboard/client"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Client Portal</span>
            </Link>
          </div>
        </div>

        {/* SUPPORT */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>KangleiAstro Support Helpdesk: contact administrator if amount was deducted.</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center text-sm font-bold text-gray-500">
          Loading...
        </div>
      }
    >
      <FailureContent />
    </Suspense>
  );
}
