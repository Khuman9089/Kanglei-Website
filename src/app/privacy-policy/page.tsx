'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Eye, FileText, CheckCircle2, 
  Database, UserCheck, Mail, Phone, MapPin 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans text-[#0f172a]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white pt-28 pb-16 px-4 md:px-8 border-b border-amber-900/30 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Confidentiality & Data Security</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Privacy <span className="text-[#fbbf24]">Policy</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            How KuthiYengpham by KangleiAstro collects, protects, and handles your sacred birth details, personal data, and consultation privacy.
          </p>

          <div className="pt-2 text-xs text-gray-400">
            Effective Date: September 2026 • KuthiYengpham by KangleiAstro
          </div>
        </div>
      </section>

      {/* Main Legal Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 md:px-8 space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        
        {/* Intro */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#fde68a]/70 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            1. Commitment to Client Confidentiality
          </h2>
          <p>
            At <strong>KuthiYengpham by KangleiAstro</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we consider your personal information and astrological birth details to be deeply sacred and private. This Privacy Policy outlines the types of information we collect, how it is utilized to provide precise Jyotish calculations and services, and the stringent security protocols employed to safeguard your data.
          </p>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>We never sell, rent, or trade your personal or astrological birth records to any third-party advertisers or data brokers.</span>
          </div>
        </div>

        {/* Information Collected */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            2. Information We Collect
          </h2>
          <div className="space-y-3">
            <div>
              <strong className="text-gray-900 block font-bold mb-1">A. Astrological & Birth Data:</strong>
              <p className="text-gray-600">
                To construct your Manipuri Kuthi, generate authentic natal Kundli charts, calculate Dasha timelines, and perform horoscope compatibility matching, we collect: Full Name, Date of Birth, Exact Time of Birth, and Place / City of Birth.
              </p>
            </div>
            <div>
              <strong className="text-gray-900 block font-bold mb-1">B. Account & Contact Credentials:</strong>
              <p className="text-gray-600">
                Email address, mobile telephone number, WhatsApp number, and password (hashed and cryptographically salted) when creating an account or booking consultations.
              </p>
            </div>
            <div>
              <strong className="text-gray-900 block font-bold mb-1">C. Shipping & E-Commerce Details:</strong>
              <p className="text-gray-600">
                Recipient name, physical delivery address, city, state, and postal pincode when ordering physical gemstones, yantras, or handwritten physical Kuthi scrolls.
              </p>
            </div>
            <div>
              <strong className="text-gray-900 block font-bold mb-1">D. Payment Information:</strong>
              <p className="text-gray-600">
                All digital transactions are processed securely via RBI-licensed payment gateways (PayU Payments Private Limited) with 256-bit SSL encryption. We do not store sensitive credit/debit card numbers or CVVs on our servers. For manual UPI transfers, only the customer-provided 12-digit UTR transaction reference is retained for accounting verification.
              </p>
            </div>
          </div>
        </div>

        {/* Live Consultation Privacy */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            3. Live Consultation Privacy (Audio & Video Calls)
          </h2>
          <p>
            Our live astrologer consultation rooms operate over secure WebRTC peer-to-peer encrypted channels. Discussions concerning your personal relationships, career, spiritual life, or financial outlook remain strictly between you and your chosen verified Astrologer.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-xs">
            <li>Astrologers on our panel are bound by strict non-disclosure and professional ethical guidelines.</li>
            <li>Consultation sessions are not publicly broadcasted or published.</li>
            <li>Clients may request deletion of their consultation history by contacting our administration.</li>
          </ul>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            4. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 text-xs">
            <li>To compute accurate astronomical planetary coordinates based on ancient Vishuddha Siddhanta principles.</li>
            <li>To compile and dispatch personalized Kuthi documents via PDF download or physical speed courier.</li>
            <li>To facilitate scheduled live chat, voice, and video consultation appointments.</li>
            <li>To transmit vital transactional notices, order status updates, and booking confirmations via SMS, WhatsApp, or email.</li>
            <li>To administer customer support inquiries, returns, and replacement requests.</li>
          </ul>
        </div>

        {/* Data Security & Retention */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            5. Data Security & Retention
          </h2>
          <p>
            We implement comprehensive technical, administrative, and physical security measures to protect your personal information against unauthorized access, loss, or misuse. Your account passwords are encrypted using one-way cryptographic algorithms. We retain your profile data for as long as your account remains active or as required by applicable laws of India.
          </p>
        </div>

        {/* Account and Data Deletion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            6. Account & Data Deletion Rights
          </h2>
          <p>
            In compliance with Google Play Developer Policy and user privacy standards, any user may request the permanent deletion of their account and all associated personal data (including birth chart data, names, phone numbers, email addresses, and community posts) at any time.
          </p>
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <p className="font-bold text-amber-950">How to Delete Your Account & Associated Data:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-amber-900">
              <li><strong>In-App Self-Service:</strong> Open the Kanglei Astro app &gt; Go to Account Settings &gt; Tap &ldquo;Delete Account&rdquo;.</li>
              <li><strong>Online Deletion Request Form (No Login/App Needed):</strong> Visit our official web deletion portal at <a href="https://kuthiyengpham.in/delete-account" className="underline font-bold text-amber-800">https://kuthiyengpham.in/delete-account</a>.</li>
              <li><strong>Direct Email:</strong> You can also email your deletion request to <a href="mailto:ccare@kuthiyengpham.in" className="underline font-mono text-amber-800">ccare@kuthiyengpham.in</a>.</li>
            </ul>
          </div>
          <p className="text-xs text-gray-500">
            Account deletion requests submitted online or via email are processed within 48–72 hours. All personal identity and astrological data will be permanently erased.
          </p>
        </div>

        {/* Grievance & Contact */}
        <div className="bg-[#fefcf6] rounded-3xl p-6 sm:p-8 border border-[#fde68a] space-y-3">
          <h2 className="font-serif text-xl font-black text-[#0f172a]">
            7. Privacy Grievance Officer & Developer Details
          </h2>
          <p className="text-xs text-gray-600">
            If you have questions about this Privacy Policy, wish to access, rectify, or request the deletion of your personal records, please reach out to our Privacy & Grievance Desk:
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-gray-800">
            <div><strong>Publisher / Developer:</strong> NexGen InfoLab (ID: 6187819673998470854)</div>
            <div><strong>Legal Representative:</strong> Oinam Robert Singh</div>
            <div><strong>Application:</strong> Manipuri Calendar KangleiAstro</div>
            <div><strong>Support Email:</strong> <a href="mailto:ccare@kuthiyengpham.in" className="text-[#b45309] underline font-mono">ccare@kuthiyengpham.in</a></div>
            <div><strong>Developer Email:</strong> <a href="mailto:aiabaazar@gmail.com" className="text-[#b45309] underline font-mono">aiabaazar@gmail.com</a></div>
            <div><strong>Contact Helpline:</strong> <a href="tel:+918837487801" className="text-[#b45309] font-mono font-bold">+91 8837487801</a></div>
            <div className="sm:col-span-2"><strong>Registered Legal Address:</strong> Khurai Chingangbam Leikai, Tinsid Road, Imphal East - 795005, Manipur, India (IN)</div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
