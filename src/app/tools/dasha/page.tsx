'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Clock, RotateCcw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function DashaPage() {
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
        currentMahadasha: 'Jupiter (Brihaspati)',
        currentAntardasha: 'Saturn (Shani)',
        currentPratyantar: 'Mercury (Budh)',
        mahaStartDate: '15 May 2021',
        mahaEndDate: '15 May 2037',
        antarStartDate: '12 September 2025',
        antarEndDate: '24 March 2028',
        moonNakshatra: 'Rohini (Pada 2)',
        nakshatraLord: 'Moon',
        balanceAtBirth: '6 Years, 4 Months (Moon Mahadasha)',
        fullTimeline: [
          { lord: 'Ketu', years: '7 Years', start: '15 May 1995', end: '15 May 2002', active: false },
          { lord: 'Venus (Shukra)', years: '20 Years', start: '15 May 2002', end: '15 May 2022', active: false },
          { lord: 'Jupiter (Brihaspati)', years: '16 Years', start: '15 May 2021', end: '15 May 2037', active: true },
          { lord: 'Saturn (Shani)', years: '19 Years', start: '15 May 2037', end: '15 May 2056', active: false },
          { lord: 'Mercury (Budh)', years: '17 Years', start: '15 May 2056', end: '15 May 2073', active: false },
        ],
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a]">
      <Navbar />

      <div className="pt-4 sm:pt-6 pb-16 px-4 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-extrabold uppercase">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Vedic Planetary Period Calculator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-[#0f172a]">
            Vimshottari Dasha Calculator
          </h1>
          <p className="text-base text-gray-700 max-w-2xl mx-auto font-medium">
            Calculate your active Mahadasha, Antardasha, and complete 120-year Vimshottari planetary timeline based on natal Moon Nakshatra.
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
                <span>{isCalculating ? 'Calculating Dasha Math...' : 'Calculate Vimshottari Dasha'}</span>
                <Sparkles className="w-5 h-5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#fde68a] shadow-xl space-y-6 max-w-3xl mx-auto">
            {/* Active Dasha Highlight */}
            <div className="bg-[#fefcf6] p-6 rounded-2xl border-2 border-[#d97706] text-center space-y-2 relative overflow-hidden">
              <span className="px-3.5 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase animate-pulse">
                Current Active Dasha Period
              </span>
              <h3 className="text-3xl font-serif font-black text-[#0f172a]">
                {result.currentMahadasha} Mahadasha
              </h3>
              <p className="text-sm font-extrabold text-[#b45309]">
                Antardasha: {result.currentAntardasha} | Pratyantar: {result.currentPratyantar}
              </p>
              <div className="text-xs text-gray-600 font-medium pt-1">
                Period Window: <strong>{result.antarStartDate}</strong> to <strong>{result.antarEndDate}</strong>
              </div>
            </div>

            {/* Birth Balance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-gray-600 font-bold uppercase block">Moon Nakshatra</span>
                <span className="text-base font-extrabold text-[#0f172a]">{result.moonNakshatra}</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-gray-600 font-bold uppercase block">Balance At Birth</span>
                <span className="text-base font-extrabold text-[#b45309]">{result.balanceAtBirth}</span>
              </div>
            </div>

            {/* Full Vimshottari Table */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-xl text-[#0f172a]">Vimshottari Mahadasha Timeline</h4>
              <div className="border border-[#fde68a] rounded-2xl overflow-hidden text-xs sm:text-sm font-sans">
                <table className="w-full text-left">
                  <thead className="bg-[#fef3c7] text-[#b45309] font-extrabold">
                    <tr>
                      <th className="p-3">Mahadasha Lord</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Period Window</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result.fullTimeline.map((row: any, idx: number) => (
                      <tr key={idx} className={row.active ? 'bg-[#fef3c7] font-extrabold text-[#0f172a]' : 'hover:bg-gray-50'}>
                        <td className="p-3">{row.lord}</td>
                        <td className="p-3">{row.years}</td>
                        <td className="p-3">{row.start} - {row.end}</td>
                        <td className="p-3 text-center">
                          {row.active ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#d97706] text-white text-[10px] font-extrabold uppercase">
                              RUNNING
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#d97706]" />
              <span>Calculate Another Birth Dasha</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
