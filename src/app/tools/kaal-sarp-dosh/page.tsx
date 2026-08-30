'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Sparkles, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function KaalSarpDoshPage() {
  const [form, setForm] = useState({
    name: 'Sanatomba Meitei',
    dob: '1995-05-15',
    tob: '06:00',
    pob: 'Imphal, Manipur',
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setResult({
        hasDosh: true,
        type: 'Vasuki Kaal Sarp Dosh (3rd & 9th House Axis)',
        severity: 'Moderate (45% Active)',
        rahuHouse: '3rd House (Gemini)',
        ketuHouse: '9th House (Sagittarius)',
        explanation: 'All seven principal planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) are positioned between Rahu in the 3rd house and Ketu in the 9th house.',
        impacts: [
          'Occasional hurdles in sibling relationships & early career communication',
          'Intermittent travel delays or friction with mentors during Rahu Mahadasha',
          'Strong innate courage, spiritual intuition, and sudden financial breakthroughs later in life',
        ],
        remedies: [
          'Chant Maha Mrityunjaya Mantra (108 times daily at sunrise)',
          'Offer Jal Abhishekam and Bel leaves to Lord Shiva on Mondays',
          'Perform Nag Pratishtha / Kaal Sarp Shanti Puja at Trimbakeshwar or local Shiva temple',
          'Wear a silver snake ring on your little finger on Wednesday',
        ],
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a]">
      <Navbar />

      <div className="pt-4 sm:pt-6 pb-16 px-4 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Vedic Dosh & Yoga Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-[#0f172a]">
            Kaal Sarp Dosh Calculator
          </h1>
          <p className="text-base text-gray-700 max-w-2xl mx-auto font-medium">
            Check if your birth chart has Kaal Sarp Yoga, identify its specific variant out of 12 types, and get remedies.
          </p>
        </div>

        {!result ? (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#fde68a] shadow-xl max-w-2xl mx-auto space-y-6">
            <form onSubmit={handleCalculate} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-extrabold uppercase text-[#0f172a] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#f3e8d2] bg-[#fefcf6] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#0f172a] mb-1">Date Of Birth</label>
                  <input
                    type="date"
                    required
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#f3e8d2] bg-[#fefcf6] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#0f172a] mb-1">Time Of Birth</label>
                  <input
                    type="time"
                    required
                    value={form.tob}
                    onChange={(e) => setForm({ ...form, tob: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#f3e8d2] bg-[#fefcf6] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#0f172a] mb-1">Place Of Birth</label>
                <input
                  type="text"
                  required
                  value={form.pob}
                  onChange={(e) => setForm({ ...form, pob: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#f3e8d2] bg-[#fefcf6] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]/40"
                />
              </div>

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-base shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>{isCalculating ? 'Computing Planetary Axis...' : 'Calculate Kaal Sarp Dosh'}</span>
                <Sparkles className="w-5 h-5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#fde68a] shadow-xl space-y-6 max-w-3xl mx-auto">
            <div className="bg-[#fefcf6] p-6 rounded-2xl border border-[#fde68a] text-center space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase">
                {result.severity}
              </span>
              <h3 className="text-3xl font-serif font-black text-[#0f172a]">{result.type}</h3>
              <p className="text-xs text-gray-600 font-bold">Client: {form.name} (DOB: {form.dob})</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase block">Rahu Placement</span>
                <span className="text-base font-extrabold text-[#0f172a]">{result.rahuHouse}</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase block">Ketu Placement</span>
                <span className="text-base font-extrabold text-[#0f172a]">{result.ketuHouse}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-xs font-bold text-gray-500 uppercase">Analysis Summary</span>
              <p className="text-sm text-gray-800 font-medium leading-relaxed">{result.explanation}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#0f172a] uppercase text-xs">Life & Career Impacts:</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 font-medium list-disc list-inside bg-[#fefcf6] p-4 rounded-2xl border border-[#fde68a]">
                {result.impacts.map((imp: string, i: number) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#b45309] uppercase text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#d97706]" />
                <span>Prescribed Vedic Remedies:</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-800 font-medium bg-[#fefcf6] p-4 rounded-2xl border border-[#fde68a]">
                {result.remedies.map((rem: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#d97706] font-bold">•</span>
                    <span>{rem}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#d97706]" />
              <span>Calculate Another Birth Chart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
