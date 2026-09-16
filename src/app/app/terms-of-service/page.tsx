'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, AlertTriangle, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

export default function MobileTermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Terms of Service & EULA</h1>
            <span className="text-[10px] text-slate-500 font-medium">End User License Agreement</span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          Standard EULA
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5 text-xs leading-relaxed text-slate-700">
        
        {/* Intro */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <Scale className="w-4 h-4" />
            <span>End User License Agreement (EULA)</span>
          </div>
          <p>
            By downloading, installing, or using the <strong>Kanglei Astro</strong> mobile application or accessing our online services, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application.
          </p>
        </div>

        {/* Section 1: Apple Guideline 1.2 UGC Zero-Tolerance Policy */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>1. User-Generated Content & Community Rules (Apple Guideline 1.2)</span>
          </div>
          <p className="font-semibold text-amber-950">
            Kanglei Astro enforces a strict <strong>Zero-Tolerance Policy</strong> for objectionable, abusive, or harmful content on our &quot;Leipung&quot; community feed.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-amber-900">
            <li>
              <strong>No Hate Speech or Harassment:</strong> Any content attacking individuals or groups based on race, ethnicity, caste, religion, gender, disability, or clan (Yek/Salai) is strictly prohibited.
            </li>
            <li>
              <strong>No Nudity or Sexually Explicit Material:</strong> Sharing pornographic or sexually suggestive media will lead to immediate account termination.
            </li>
            <li>
              <strong>No Defamation, Fraud, or Spam:</strong> Unsolicited advertisements, financial fraud schemes, or defamatory statements against astrologers or community members are banned.
            </li>
            <li>
              <strong>Immediate Removal & Ban:</strong> Our moderation team acts on all user reports within 24 hours. Violators will have their content removed and their account banned permanently.
            </li>
          </ul>
        </div>

        {/* Section 2: Reporting & Blocking Mechanisms */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Reporting and Blocking Content</span>
          </h2>
          <p>
            Every post and comment in the Leipung feed includes a <strong>3-dots menu</strong> with:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>
              <strong>Report Inappropriate Content:</strong> Directly alerts our admin moderation queue for review within 24 hours.
            </li>
            <li>
              <strong>Block User:</strong> Instantly hides all posts, comments, and interactions from that user across your feed session.
            </li>
          </ul>
        </div>

        {/* Section 3: Astrological Services & Payments */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Sacred Kuthi Eba & Yengba Services</span>
          </h2>
          <p>
            Astrological consultations (Kuthi Yengba) and horoscope generation (Kuthi Eba) are prepared by empaneled Manipuri astrologers following traditional Vedic and Manipuri astronomical principles. Payments are processed securely via verified UPI and standard payment gateways.
          </p>
        </div>

        {/* Section 4: Termination */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>4. Account Termination</span>
          </h2>
          <p>
            You may terminate your account at any time via <Link href="/app/settings/account" className="text-amber-700 underline font-semibold">Account Settings</Link>. We reserve the right to suspend or terminate accounts that violate our community guidelines without prior notice.
          </p>
        </div>

      </main>
    </div>
  );
}
