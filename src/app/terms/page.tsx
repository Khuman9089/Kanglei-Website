'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, ShieldAlert, Scale, CheckCircle2, 
  HelpCircle, BookOpen, AlertTriangle 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans text-[#0f172a]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white pt-28 pb-16 px-4 md:px-8 border-b border-amber-900/30 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Usage & Service Agreement</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Terms of <span className="text-[#fbbf24]">Service</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Please review these platform terms carefully before using KuthiYengpham by KangleiAstro consultations, calculating horoscope charts, or ordering E-Store products.
          </p>

          <div className="pt-2 text-xs text-gray-400">
            Last Revised: September 2026 • Imphal East, Manipur
          </div>
        </div>
      </section>

      {/* Main Legal Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 md:px-8 space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        
        {/* Section 1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#fde68a]/70 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the website, applications, and services provided by <strong>KuthiYengpham by KangleiAstro</strong> (&quot;Platform,&quot; &quot;we,&quot; &quot;us&quot;), you confirm that you have read, understood, and agreed to be legally bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of our platform immediately.
          </p>
        </div>

        {/* Section 2: Astrological Advisory Disclaimer */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-[#b45309]">
            <AlertTriangle className="w-5 h-5 text-[#d97706]" />
            <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
              2. Sacred Astrological Disclaimer & Advisory Nature
            </h2>
          </div>
          
          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#f3e8d2] text-xs space-y-2 text-gray-700">
            <p>
              Vedic Astrology, Manipuri Kuthi Yengba, Dasha forecasts, and Ashtakoot Gun Milan compatibility assessments represent traditional, interpretive spiritual sciences rooted in ancient philosophical scriptures, astronomy, and cultural wisdom.
            </p>
            <p>
              <strong>Not Medical, Legal, or Financial Advice:</strong> Astrological consultations, horoscope reports, and remedial gemstones provide spiritual perspective and personal reflection. They must <em>never</em> be construed as or substituted for qualified professional legal, medical, psychiatric, diagnostic, or certified financial advice.
            </p>
            <p>
              Clients retain full personal autonomy, freewill, and responsibility for all life decisions, agreements, and actions undertaken.
            </p>
          </div>
        </div>

        {/* Section 3: Consultations & Booking Rules */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            3. Astrologer Consultations & Appointments
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 text-xs">
            <li>
              <strong>Accuracy of Birth Details:</strong> Clients must provide accurate birth information (Date, Time, and Place of Birth). The platform and consulting astrologers are not liable for calculation variations arising from incorrect or estimated birth inputs provided by the client.
            </li>
            <li>
              <strong>Code of Conduct:</strong> Clients and Astrologers must maintain a courteous, respectful, and dignified tone during live calls and chats. Abusive language, harassment, or inappropriate conduct will result in immediate session termination without refund.
            </li>
            <li>
              <strong>Independent Practitioners:</strong> Astrologers on the platform act as independent verified consultants. While we rigorously curate qualifications, the specific guidance or opinions expressed during a consultation represent the astrologer&apos;s personal scholarly interpretation.
            </li>
          </ul>
        </div>

        {/* Section 4: E-Shop & Physical Merchandise */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            4. E-Commerce Store Products & Delivery
          </h2>
          <p>
            All physical items—including energized yantras, certified natural gemstones, genuine rudraksha malas, and handwritten traditional Kuthi parchment scrolls—are dispatched via reputable domestic logistics partners.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-xs">
            <li>Prices displayed on the E-Shop are inclusive of applicable taxes unless explicitly stated otherwise.</li>
            <li>Tracking details will be provided upon package dispatch via SMS or WhatsApp.</li>
            <li>
              In the unlikely event of transit damage, defect, or incorrect product delivery, clients are entitled to a 100% replacement or refund as detailed in our{' '}
              <Link href="/return-policy" className="text-[#b45309] font-bold underline">
                Return & Refund Policy
              </Link>.
            </li>
          </ul>
        </div>

        {/* Section 5: Intellectual Property */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            5. Intellectual Property Rights
          </h2>
          <p>
            All proprietary astrological algorithms, Vishuddha Siddhanta computation formulas, software code, graphic designs, Kuthi layout templates, articles, and trademarks displayed on this platform are the exclusive intellectual property of <strong>KuthiYengpham by KangleiAstro</strong>. Reproduction, scraping, reverse-engineering, or unauthorized distribution of our proprietary content without explicit written consent is strictly prohibited.
          </p>
        </div>

        {/* Section 6: Limitation of Liability & Governing Law */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0f172a]">
            6. Limitation of Liability & Governing Law
          </h2>
          <p>
            To the fullest extent permitted by law, KuthiYengpham by KangleiAstro and its directors, scholars, and affiliates shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our platform or reliance upon astrological interpretations.
          </p>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
            <strong>Jurisdiction:</strong> These Terms shall be governed by and construed in accordance with the substantive laws of India. Any disputes arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts situated in <strong>Imphal, Manipur, India</strong>.
          </div>
        </div>

        {/* Contact Us Reference */}
        <div className="bg-[#fefcf6] rounded-3xl p-6 sm:p-8 border border-[#fde68a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif font-bold text-base text-[#0f172a]">
              Have questions regarding our Terms of Service?
            </h3>
            <p className="text-xs text-gray-500">
              Reach out to our legal & customer support administration team anytime.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all shrink-0"
          >
            Contact Administration →
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
