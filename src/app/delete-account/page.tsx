import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Trash2,
  ExternalLink,
  Clock,
  Building,
  Smartphone,
  Info,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  UserCheck
} from 'lucide-react';
import AccountDeletionClient from '@/components/account/AccountDeletionClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manipuri Calendar KangleiAstro - Account & Data Deletion | NexGen InfoLab',
  description:
    'Official Account and Personal Data Deletion Portal for Manipuri Calendar KangleiAstro published by NexGen InfoLab (Developer ID: 6187819673998470854, Owner: Oinam Robert Singh). Submit account deletion requests and review data retention policies.',
  keywords: [
    'Manipuri Calendar KangleiAstro delete account',
    'NexGen InfoLab account deletion',
    'NexGen Info Lab account deletion',
    'KangleiAstro data deletion',
    'Kuthi Yengpham account deletion',
    'delete Manipuri Calendar account',
    'Oinam Robert Singh developer',
  ],
  alternates: {
    canonical: 'https://kuthiyengpham.in/delete-account',
  },
  openGraph: {
    title: 'Manipuri Calendar KangleiAstro - Account & Data Deletion | NexGen InfoLab',
    description:
      'Official Account & Personal Data Deletion Request Page for Manipuri Calendar KangleiAstro by NexGen InfoLab.',
    url: 'https://kuthiyengpham.in/delete-account',
    siteName: 'Manipuri Calendar KangleiAstro',
    type: 'website',
  },
};

export default function RootAccountDeletionPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Manipuri Calendar KangleiAstro Account and Data Deletion',
    description:
      'Official account and personal data deletion request page for Manipuri Calendar KangleiAstro published by NexGen InfoLab.',
    url: 'https://kuthiyengpham.in/delete-account',
    publisher: {
      '@type': 'Organization',
      name: 'NexGen InfoLab',
      legalName: 'Oinam Robert Singh',
      url: 'https://kuthiyengpham.in',
      email: 'ccare@kuthiyengpham.in',
      telephone: '+918837487801',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Khurai Chingangbam Leikai, Tinsid Road',
        addressLocality: 'Imphal East',
        addressRegion: 'Manipur',
        postalCode: '795005',
        addressCountry: 'IN',
      },
    },
    about: {
      '@type': 'SoftwareApplication',
      name: 'Manipuri Calendar KangleiAstro',
      operatingSystem: 'Android',
      applicationCategory: 'LifestyleApplication',
      author: {
        '@type': 'Organization',
        name: 'NexGen InfoLab',
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header with Explicit App Entity Reference */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight block">
                Manipuri Calendar KangleiAstro
              </span>
              <p className="text-[11px] text-amber-700 font-semibold">
                Account & Data Deletion Portal • NexGen InfoLab
              </p>
            </div>
          </div>
          <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Google Play Verified
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {/* ─────────────────────────────────────────────────────────────
           1. GOOGLE PLAY ENTITY IDENTIFICATION BOX (CRITICAL FOR APPROVAL)
           ───────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-amber-950 via-[#261f18] to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md space-y-4 border border-amber-500/30">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 inline-block">
                Google Play Data Safety Compliance
              </span>
              <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Official Deletion Gateway
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              Manipuri Calendar KangleiAstro
              <span className="block text-amber-400 text-lg sm:text-xl font-bold mt-1">
                Account & Personal Data Deletion Portal
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed pt-1">
              This official portal allows users of the <strong>Manipuri Calendar KangleiAstro</strong> mobile application (published on Google Play by <strong>NexGen InfoLab</strong>, Developer ID: <code>6187819673998470854</code>) to request the permanent deletion of their account and all associated personal data in accordance with the Google Play User Data & Account Deletion Policy.
            </p>
          </div>

          {/* Detailed Entity Identification Table */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/10 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300/90 block">
                Application Name
              </span>
              <strong className="text-white text-xs block font-bold">
                Manipuri Calendar KangleiAstro
              </strong>
              <span className="text-[10px] text-slate-300 block">
                (Google Play Store Listing)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300/90 block">
                Developer / Publisher
              </span>
              <strong className="text-white text-xs block font-bold">
                NexGen InfoLab
              </strong>
              <span className="text-[10px] text-slate-300 block">
                ID: 6187819673998470854
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300/90 block">
                Legal Owner / Registered
              </span>
              <strong className="text-white text-xs block font-bold">
                Oinam Robert Singh
              </strong>
              <span className="text-[10px] text-slate-300 block">
                Imphal East, Manipur, India
              </span>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           2. INTERACTIVE SUBMISSION / CLIENT FORM & LOGGED-IN ACTIONS
           ───────────────────────────────────────────────────────────── */}
        <AccountDeletionClient />

        {/* ─────────────────────────────────────────────────────────────
           3. IN-APP DELETION INSTRUCTIONS (FOR ACTIVE MOBILE USERS)
           ───────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Smartphone className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-sm sm:text-base text-slate-900">
              How to Delete Your Account Directly Inside the Mobile App
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            If you have the <strong>Manipuri Calendar KangleiAstro</strong> application installed on your Android device, you can delete your account instantly at any time by following these steps:
          </p>

          <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700">
            <li>
              Open the <strong>Manipuri Calendar KangleiAstro</strong> app on your Android device.
            </li>
            <li>
              Tap the <strong>Profile / Menu</strong> icon in the top navigation bar or side menu.
            </li>
            <li>
              Select <strong>Account Settings</strong>.
            </li>
            <li>
              Scroll to the bottom and select <strong>Delete Account & Personal Data</strong>.
            </li>
            <li>
              Confirm by typing <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-red-600">DELETE</code> and tap <strong>Confirm Delete</strong>.
            </li>
            <li>
              Your session will terminate immediately and all personal data will be purged.
            </li>
          </ol>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           4. DATA RETENTION & DELETION DISCLOSURE (REQUIRED BY GOOGLE PLAY)
           ───────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-sm sm:text-base text-slate-900">
              Data Retention, Deletion Scope & Statutory Policies
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* What is Deleted */}
            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
              <span className="font-bold text-red-900 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>What is Permanently Deleted</span>
              </span>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                <li>User identity records: Name, phone number, email address, and authentication credentials.</li>
                <li>Astrological birth inputs: Date of birth, time of birth, place of birth, and generated Janma Patrika / Kuthi charts.</li>
                <li>Leipung community posts, photos, comments, likes, and feedback.</li>
                <li>Astrologer 1-on-1 private chat sessions, consultation notes, and booking history.</li>
              </ul>
            </div>

            {/* What is Retained */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>What May Be Retained & Retention Period</span>
              </span>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                <li>
                  <strong>Financial & Tax Invoices:</strong> Payment transaction records from astrological consultations are retained for up to <strong>7 years</strong> strictly to comply with statutory taxation (GST) and accounting laws in India. These records are completely anonymized.
                </li>
                <li>
                  <strong>Deletion Audit Log:</strong> Cryptographic deletion timestamp log is maintained for 90 days for audit compliance.
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong>Processing Timeline:</strong> In-app deletions take effect immediately in real time. Deletion requests submitted via the online web form above are verified and completely cleared across all production servers and database backups within <strong>48 to 72 hours</strong>.
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           5. PRIVACY CONTACT & DEVELOPER DETAILS
           ───────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
            <Building className="w-4 h-4 text-slate-700" />
            <span>Developer Profile & Privacy Desk Contacts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-700 font-medium">
            <div className="space-y-0.5">
              <span className="text-slate-500 block">Developer / Publisher:</span>
              <strong className="text-slate-900 text-xs block">NexGen InfoLab</strong>
              <span className="text-[10px] text-slate-400 font-mono">Developer ID: 6187819673998470854</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-500 block">Account Owner / Legal Name:</span>
              <strong className="text-slate-900 text-xs block">Oinam Robert Singh</strong>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-500 block">Support & Grievance Email:</span>
              <a href="mailto:ccare@kuthiyengpham.in" className="text-amber-700 font-mono underline font-bold block">
                ccare@kuthiyengpham.in
              </a>
              <span className="text-[10px] text-slate-400 font-mono">Dev: aiabaazar@gmail.com</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-500 block">Contact Phone / Helpline:</span>
              <a href="tel:+918837487801" className="text-slate-900 font-mono font-bold block">
                +91 8837487801
              </a>
            </div>

            <div className="sm:col-span-2 space-y-0.5 pt-1 border-t border-slate-100">
              <span className="text-slate-500 block">Registered Legal Address:</span>
              <span className="text-slate-800 font-medium block">
                Khurai Chingangbam Leikai, Tinsid Road, Imphal East - 795005, Manipur, India (IN)
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold">
            <Link href="/privacy-policy" className="text-amber-700 hover:underline flex items-center gap-1">
              <span>Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/terms-of-service" className="text-amber-700 hover:underline flex items-center gap-1">
              <span>Terms of Service</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/disclaimer" className="text-amber-700 hover:underline flex items-center gap-1">
              <span>Astrological Disclaimer</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
