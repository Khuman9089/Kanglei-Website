'use client';

import React from 'react';
import Link from 'next/link';
import { 
  RotateCcw, ShieldCheck, HelpCircle, Package, ArrowRight, 
  CheckCircle2, Clock, Mail, Phone, AlertCircle, FileText
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans text-[#0f172a]">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white pt-28 pb-16 px-4 md:px-8 border-b border-amber-900/30 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Customer Protection & Assurance</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Return & <span className="text-[#fbbf24]">Refund Policy</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Transparent, fair, and customer-first guidelines for sacred astrological services and physical e-commerce store products.
          </p>

          <div className="pt-2 text-xs text-gray-400">
            Last Updated: September 2026 • KuthiYengpham by KangleiAstro
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 md:px-8 space-y-10">
        
        {/* SECTION 1: SERVICE-RELATED POLICY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#fde68a]/70 shadow-lg space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b45309] block">
                Category 1
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
                Astrological Services & Personalized Reports
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Astrological services provided by <strong>KuthiYengpham by KangleiAstro</strong>—including Manipuri Kuthi Yengba, handwritten Kuthi Iba scrolls, Live Astrologer Chat & Call consultations, Kundli matchmaking, and Numit Leppa calculations—are bespoke, individualized spiritual calculations meticulously drafted by scholars and Jyotish practitioners based on the unique birth details provided by the client.
          </p>

          <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#f3e8d2] space-y-3 text-xs">
            <h3 className="font-serif font-bold text-base text-[#b45309] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#d97706]" />
              <span>Administrative Review & Consideration Process</span>
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Because astrological readings and consultations consume dedicated astrologer preparation and mathematical calculation time, standard automatic refunds are not applicable once the consultation session has occurred or after personalized report compilation has begun.
            </p>
            <p className="text-gray-800 font-semibold leading-relaxed">
              <strong>However, your satisfaction is our highest priority.</strong> If you experienced a genuine technical failure during a live session, astrologer non-availability, or believe an administrative calculation error occurred:
            </p>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
              👉 Please write directly to our administrative desk via our{' '}
              <Link href="/contact" className="text-[#b45309] font-bold underline hover:opacity-80">
                Contact Us Details
              </Link>. Our platform administration will thoroughly review the case logs and decide on a fair resolution, such as a complimentary re-consultation, revised calculation, or refund consideration.
            </div>
          </div>
        </div>

        {/* SECTION 2: E-COMMERCE PRODUCTS POLICY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#fde68a]/70 shadow-lg space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 block">
                Category 2
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
                E-Commerce Store & Sacred Physical Products
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>100% Return or Free Replacement Guarantee for Damaged, Defective, or Wrong Items!</span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            All sacred gemstones, energized yantras, authentic rudraksha beads, traditional pooja articles, and astrological books purchased from our E-Shop are carefully inspected and securely packaged.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-gray-200 text-xs space-y-1.5">
              <span className="font-bold text-[#b45309] block">1. Wrong Product Delivered</span>
              <p className="text-gray-600 leading-relaxed">
                If the product you received does not match what you ordered, we will provide a 100% immediate replacement or full refund.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-gray-200 text-xs space-y-1.5">
              <span className="font-bold text-[#b45309] block">2. Damaged in Transit</span>
              <p className="text-gray-600 leading-relaxed">
                If the parcel arrives broken or visibly damaged during transit, upload photos via our portal for a hassle-free instant replacement.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-gray-200 text-xs space-y-1.5">
              <span className="font-bold text-[#b45309] block">3. Defective / Wrong Quality</span>
              <p className="text-gray-600 leading-relaxed">
                If the gemstone or sacred article has authentic quality discrepancies, return it for an exchange or full 100% money-back refund.
              </p>
            </div>
          </div>

          {/* Replacement / Return Action Box */}
          <div className="bg-[#fefcf6] p-6 rounded-2xl border-2 border-dashed border-[#d97706]/40 text-center space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#0f172a]">
              Need to Return or Replace an E-Shop Product?
            </h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Please submit your request within <strong>7 days</strong> of delivery using our dedicated online return portal with clear photos of the product.
            </p>
            <div className="pt-1">
              <Link
                href="/shop/returns"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all"
              >
                <span>Go to Product Return & Replacement Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 3: REFUND PROCESSING TIMELINE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4 text-xs sm:text-sm text-gray-700">
          <h3 className="font-serif font-bold text-lg text-[#0f172a] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d97706]" />
            <span>Refund Processing Timelines & Methods</span>
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-gray-600 text-xs leading-relaxed">
            <li>
              <strong>Online Payments (Cards / NetBanking / UPI via PayU):</strong> Approved refunds will be credited back to the original source account within <strong>5 to 7 business days</strong> depending on your bank's settlement cycle.
            </li>
            <li>
              <strong>Direct Manual UPI Transfers:</strong> Approved refunds will be remitted directly to the customer's designated UPI VPA ID or Bank Account within <strong>24 to 48 hours</strong> of verification.
            </li>
            <li>
              <strong>Product Replacements:</strong> Free replacement parcels will be dispatched via express courier with real-time tracking within 2 business days of return approval.
            </li>
          </ul>
        </div>

        {/* HELP DESK BOX */}
        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif font-bold text-xl text-white">
              Have Questions Regarding a Return or Order?
            </h3>
            <p className="text-xs text-gray-300">
              Our support team is available Monday through Saturday (9:30 AM – 6:00 PM IST).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
            >
              Contact Support Desk
            </Link>
            <a
              href="tel:9999999999"
              className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all border border-white/20"
            >
              Call 9999999999
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
