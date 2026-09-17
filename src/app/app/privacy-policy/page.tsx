'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function MobilePrivacyPolicyPage() {
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
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Privacy Policy</h1>
            <span className="text-[10px] text-slate-500 font-medium">Kanglei Astro Mobile & Web</span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          Updated Sept 2026
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5 text-xs leading-relaxed text-slate-700">
        
        {/* Intro Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <Shield className="w-4 h-4" />
            <span>Our Commitment to Privacy</span>
          </div>
          <p>
            Kanglei Astro (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information and privacy rights. This Privacy Policy explains how your information is collected, used, disclosed, and safeguarded when you use our mobile application and online astrological services.
          </p>
        </div>

        {/* Section 1 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Information We Collect</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>User Identifiers & Profile:</strong> Name, email address, phone number/WhatsApp number, and optional avatar selections for account authentication.
            </li>
            <li>
              <strong>Astrological Chart Inputs:</strong> Date of Birth (DOB), Time of Birth (TOB), Place of Birth (POB), and clan (Yek/Salai) provided voluntarily for Janma Patrika (Kuthi) and Panchang calculations.
            </li>
            <li>
              <strong>User-Generated Content (UGC):</strong> Public posts, comments, photos, and reactions shared on our &quot;Leipung&quot; community feed.
            </li>
            <li>
              <strong>Device & Analytics Identifiers:</strong> Non-personally identifiable diagnostic data, app version, and Google AdMob advertising IDs (in compliance with Google Play and Apple App Tracking Transparency).
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. How We Use & Protect Your Information</span>
          </h2>
          <p>
            We process your information exclusively to compute authentic Manipuri astrological charts, facilitate astrologer consultations, display daily panchang muhurtas, and deliver orders. We never sell, rent, or trade your personal birth data to third-party brokers.
          </p>
          <p>
            All data transmissions are encrypted using industry-standard HTTPS / TLS 1.3 encryption protocols.
          </p>
        </div>

        {/* Section 3 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Camera & Photo Library Permissions</span>
          </h2>
          <p>
            The app requests optional camera/photo library access strictly when you choose to attach temple or ritual photos to a Leipung community post or upload an existing handwritten Kuthi document for chart analysis. Uploaded images are stored securely on our cloud infrastructure and are never accessed without your permission.
          </p>
        </div>

        {/* Section 4 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>4. Self-Service Account & Data Deletion</span>
          </h2>
          <p>
            In full compliance with <strong>Apple App Store Guideline 5.1.1</strong> and <strong>Google Play Data Safety</strong> rules, you can permanently delete your account and all associated personal data at any time:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>In the App:</strong> Go to <strong>Settings &gt; Account &gt; Delete Account</strong>.</li>
            <li><strong>Online Web Form (No App/Login Required):</strong> Visit <a href="https://kuthiyengpham.in/delete-account" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-semibold">https://kuthiyengpham.in/delete-account</a>.</li>
            <li><strong>Email:</strong> Write to <a href="mailto:ccare@kuthiyengpham.in" className="text-amber-700 underline font-mono">ccare@kuthiyengpham.in</a>.</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            5. Developer Profile & Privacy Officer
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or your data rights, contact us at:
          </p>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
            <div><strong>Publisher:</strong> NexGen InfoLab (ID: 6187819673998470854)</div>
            <div><strong>Representative:</strong> Oinam Robert Singh</div>
            <div><strong>Support Email:</strong> <a href="mailto:ccare@kuthiyengpham.in" className="text-amber-700 underline font-mono">ccare@kuthiyengpham.in</a></div>
            <div><strong>Developer Email:</strong> <a href="mailto:aiabaazar@gmail.com" className="text-amber-700 underline font-mono">aiabaazar@gmail.com</a></div>
            <div><strong>Helpline:</strong> <a href="tel:+918837487801" className="text-slate-900 font-mono font-bold">+91 8837487801</a></div>
            <div><strong>Address:</strong> Khurai Chingangbam Leikai, Tinsid Road, Imphal East - 795005, Manipur, India</div>
          </div>
        </div>

      </main>
    </div>
  );
}
