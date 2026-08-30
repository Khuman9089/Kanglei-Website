import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Star, Award, ShieldCheck, BookOpen, Sparkles, CheckCircle2, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-4 sm:pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            15+ Years of Vedic Excellence
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a]">
            About <span className="text-[#b45309]">KangleiAstro</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-3 max-w-xl mx-auto">
            Guiding lives across the globe with precise astronomical calculations and authentic Vedic Jyotish wisdom.
          </p>
        </div>

        {/* Bio & Credentials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif font-bold text-3xl text-[#0f172a] leading-snug">
              Authentic Vedic Predictions Backed by Precise Swiss Ephemeris Astronomy
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Founded with a mission to bring clarity, peace, and practical direction to individuals navigating career transitions, relationship decisions, and life milestones. KangleiAstro combines traditional Parashari Vedic Astrology with modern computational precision using Swiss Ephemeris tables and Lahiri Ayanamsa.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#f3e8d2] shadow-xs">
                <Award className="w-6 h-6 text-[#d97706] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#0f172a]">15+ Years Experience</h4>
                  <p className="text-xs text-gray-500">Practicing authentic Parashari & Jaimini Vedic systems.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#f3e8d2] shadow-xs">
                <Users className="w-6 h-6 text-[#d97706] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#0f172a]">10,000+ Consultations</h4>
                  <p className="text-xs text-gray-500">Satisfied clients across India and international regions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[#f3e8d2] shadow-lg text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />
            <div className="w-24 h-24 rounded-full bg-[#fef3c7] border-2 border-[#fde68a] mx-auto flex items-center justify-center text-4xl text-[#d97706] mb-6 shadow-md">
              <Star className="w-12 h-12 fill-[#d97706]" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Master Vedic Astrologer</h3>
            <p className="text-xs font-bold text-[#b45309] mt-1 mb-4">Founder & Lead Practitioner</p>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              "Astrology is not about fear or deterministic fate; it is a sacred compass showing your cosmic blueprint so you can make empowered choices."
            </p>
            <Link
              href="/booking"
              className="inline-block w-full py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
            >
              Book a Consultation
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
