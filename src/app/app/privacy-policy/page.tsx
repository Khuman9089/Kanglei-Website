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
            <span>1. Account-Free Experience & Information Handled</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>No Mandatory User Accounts:</strong> Manipuri Calendar KangleiAstro does not require users to register or create an account. You can freely view daily calendars, panchang muhurtas, rashiphal, and calculate natal horoscopes without creating an account.
            </li>
            <li>
              <strong>Local Astrological Inputs:</strong> Astrological parameters (Date of Birth, Time of Birth, Place of Birth) entered into local calculation tools are computed directly and are not collected or shared off-device.
            </li>
            <li>
              <strong>Admin-Moderated Community Feed (Leipung):</strong> Anyone can submit cultural discussions or queries. To ensure family-safe, respectful interactions, all community posts are held for administrative review and verification before being published to the public feed.
            </li>
            <li>
              <strong>Anonymous Diagnostics:</strong> Crash diagnostics and non-identifying performance logs strictly to ensure app stability.
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
            We never sell, rent, or trade any personal or astrological data to third-party data brokers or advertisers. All web data transfers use encrypted HTTPS / TLS 1.3 channels.
          </p>
        </div>

        {/* Section 3 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Camera & Photo Permissions</span>
          </h2>
          <p>
            Optional image attachments for Leipung community posts are only accessed when you choose to attach a photo. Uploaded photos are reviewed by our moderation team prior to public display.
          </p>
        </div>

        {/* Section 4 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>4. Data Control & Deletion</span>
          </h2>
          <p>
            Because the app operates account-free, clearing your local device cache at <strong>Settings &gt; Local Device Storage</strong> purges all local bookmarks and chart history immediately. If you have submitted a community post or inquiry and wish to remove it, you can request removal at:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Online Portal:</strong> <a href="https://kuthiyengpham.in/delete-account" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-semibold">https://kuthiyengpham.in/delete-account</a></li>
            <li><strong>Support Email:</strong> <a href="mailto:ccare@kuthiyengpham.in" className="text-amber-700 underline font-mono">ccare@kuthiyengpham.in</a></li>
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
