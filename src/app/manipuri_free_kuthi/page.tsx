'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Printer, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import BirthDetailsForm from '@/components/forms/BirthDetailsForm';
import BengaliChart from '@/components/charts/BengaliChart';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import SouthIndianChart from '@/components/charts/SouthIndianChart';
import PlanetaryTable, { PlanetData as TablePlanetData } from '@/components/charts/PlanetaryTable';
import DashaTimeline, { DashaPeriod } from '@/components/charts/DashaTimeline';

interface ChartResult {
  ascendant: number;
  ascendantSign: number;
  planets: {
    id?: string;
    name: string;
    shortName?: string;
    sign: string;
    signName?: string;
    signDegree?: number;
    degree: string;
    nakshatra: string;
    nakshatraName?: string;
    nakshatraPada?: number;
    pada: number;
    house: number;
    houseNumber?: number;
    isRetrograde: boolean;
  }[];
  houses?: { houseNumber: number; signIndex: number; signName: string }[];
  dashas?: {
    id: string;
    planet: string;
    startDate: string;
    endDate: string;
    subPeriods?: any[];
  }[];
}

function ManipuriFreeKuthiContent() {
  const [chartData, setChartData] = useState<ChartResult | null>(null);
  const [lastFormData, setLastFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartStyle, setChartStyle] = useState<'bengali' | 'north' | 'south'>('bengali');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramName = urlParams.get('name') || 'Sanatomba Meitei';
      const paramDob = urlParams.get('dob');
      const paramTob = urlParams.get('tob') || '06:00';
      const paramPob = urlParams.get('pob') || 'Imphal, Manipur';

      if (urlParams.has('dob') || urlParams.has('name')) {
        const formData = {
          name: paramName,
          gender: urlParams.get('gender') || 'Male',
          dateOfBirth: paramDob || '2026-08-28',
          timeOfBirth: paramTob,
          placeName: paramPob,
          latitude: parseFloat(urlParams.get('lat') || '24.8170'),
          longitude: parseFloat(urlParams.get('long') || '93.9368'),
          utcOffset: 5.5,
          ayanamsa: 'LAHIRI',
        };
        handleFormSubmit(formData);
      }
    }
  }, []);

  const handleFormSubmit = async (formData: {
    name: string;
    gender: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeName: string;
    latitude: number;
    longitude: number;
    utcOffset: number;
    ayanamsa: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setLastFormData(formData);

    try {
      const response = await fetch('/api/chart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate chart. Please try again.');
      }

      const data = await response.json();
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setChartData(null);
    setError(null);
  };

  // Convert planets data to format needed by chart components
  const chartPlanets = (chartData?.planets || []).map((p) => ({
    id: p.id || p.name,
    name: p.name,
    abbr: p.shortName || p.name.substring(0, 2),
    houseNumber: p.house || p.houseNumber || 1,
    isRetrograde: p.isRetrograde,
  }));

  const tablePlanets: TablePlanetData[] = (chartData?.planets || []).map((p) => ({
    name: p.name,
    sign: p.sign || p.signName || 'Aries',
    degree: p.degree || (p.signDegree ? `${p.signDegree.toFixed(2)}°` : '0.00°'),
    nakshatra: p.nakshatra || p.nakshatraName || 'Ashwini',
    pada: p.pada || p.nakshatraPada || 1,
    house: p.house || p.houseNumber || 1,
    isRetrograde: p.isRetrograde,
  }));

  const dashaPeriods: DashaPeriod[] = (chartData?.dashas || []).map((d, idx) => ({
    id: d.id || `dasha-${idx}`,
    planet: d.planet,
    startDate: d.startDate,
    endDate: d.endDate,
    subPeriods: d.subPeriods ? d.subPeriods.map((sub, sIdx) => ({
      id: sub.id || `sub-${idx}-${sIdx}`,
      planet: sub.planet,
      startDate: sub.startDate,
      endDate: sub.endDate,
    })) : undefined,
  }));

  const signsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] print:bg-white print:p-0 font-sans">

      {/* Page Header */}
      {!chartData && (
        <div className="relative pt-1 sm:pt-2 pb-6 px-4 print:hidden">
          <div className="max-w-7xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#d97706]" />
              <span>Manipuri Free Online Kuthi Generator</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-[#0f172a]">
              Generate <span className="text-[#b45309]">Free Kuthi</span> Birth Chart
            </h1>

            <p className="text-base text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
              Enter your birth details to generate your free sidereal Kundli chart, D1 Rashi, D9 Navamsha, and Vimshottari Dasha calculations.
            </p>
          </div>
        </div>
      )}

      <div className={`max-w-6xl mx-auto px-4 ${chartData ? 'pt-1 sm:pt-2 pb-20' : 'pb-20'} print:pt-0 print:pb-0`}>
        <AnimatePresence mode="wait">
          {!chartData ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              {/* Birth Details Form Component */}
              <BirthDetailsForm onSubmit={handleFormSubmit} isLoading={isLoading} />

              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm text-center">
                  {error}
                </div>
              )}

              {/* BOTTOM CTA BUTTON TO PROFESSIONAL KUTHI */}
              <div className="bg-gradient-to-r from-[#1c2541] via-[#0b132b] to-[#0f172a] p-8 rounded-3xl border border-[#3a506b] text-white shadow-2xl text-center space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/20 border border-[#d97706]/40 text-[#fbbf24] text-xs font-bold uppercase">
                  <ShieldCheck className="w-4 h-4 text-[#fbbf24]" />
                  <span>Handwritten Vedic Parchment Scroll</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#fbbf24]">
                  Want an Authentic Hand-Written Kuthi Paper?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                  Order a traditional hand-written Kuthi prepared on sacred parchment by experienced Manipur Acharyas with personalized remedial pujas.
                </p>

                <div className="pt-2">
                  <Link
                    href="/manipuri_kuthi"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <span>Get your professional Kuthi</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#f3e8d2] shadow-xs print:hidden">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-extrabold text-xs hover:bg-[#fef3c7] hover:border-[#d97706] transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-[#d97706]" />
                  <span>Recalculate Free Kuthi</span>
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex rounded-xl overflow-hidden border border-[#fde68a] bg-[#fefcf6]">
                    <button
                      onClick={() => setChartStyle('bengali')}
                      className={`px-3.5 py-2 text-xs font-extrabold transition-colors ${
                        chartStyle === 'bengali'
                          ? 'bg-[#d97706] text-white shadow-xs'
                          : 'text-[#0f172a] hover:bg-[#fef3c7]'
                      }`}
                    >
                      Bengali / Eastern
                    </button>
                    <button
                      onClick={() => setChartStyle('north')}
                      className={`px-3.5 py-2 text-xs font-extrabold transition-colors ${
                        chartStyle === 'north'
                          ? 'bg-[#d97706] text-white shadow-xs'
                          : 'text-[#0f172a] hover:bg-[#fef3c7]'
                      }`}
                    >
                      North Indian
                    </button>
                    <button
                      onClick={() => setChartStyle('south')}
                      className={`px-3.5 py-2 text-xs font-extrabold transition-colors ${
                        chartStyle === 'south'
                          ? 'bg-[#d97706] text-white shadow-xs'
                          : 'text-[#0f172a] hover:bg-[#fef3c7]'
                      }`}
                    >
                      South Indian
                    </button>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f172a] text-white font-bold text-xs hover:bg-[#1e293b] transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Chart</span>
                  </button>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-6">
                <div className="text-center space-y-1 border-b border-gray-100 pb-4">
                  <h2 className="font-serif font-bold text-3xl text-[#0f172a]">{lastFormData?.name || 'Vedic Kundli'}</h2>
                  <p className="text-xs font-bold text-[#b45309]">
                    DOB: {lastFormData?.dateOfBirth} • TOB: {lastFormData?.timeOfBirth} • POB: {lastFormData?.placeName}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  {chartStyle === 'bengali' && <BengaliChart planets={chartPlanets} ascendantSign={chartData.ascendantSign || 0} />}
                  {chartStyle === 'north' && <NorthIndianChart planets={chartPlanets} signs={signsArray} ascendantSign={chartData.ascendantSign || 0} />}
                  {chartStyle === 'south' && <SouthIndianChart planets={chartPlanets} ascendantSign={chartData.ascendantSign || 0} />}
                </div>

                <PlanetaryTable planets={tablePlanets} />
                <DashaTimeline dashas={dashaPeriods} />
              </div>

              {/* CTA BUTTON BELOW KUTHI RESULT VIEW */}
              <div className="bg-gradient-to-r from-[#1c2541] via-[#0b132b] to-[#0f172a] p-8 rounded-3xl border border-[#3a506b] text-white shadow-2xl text-center space-y-4 print:hidden">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#fbbf24]">
                  Order Complete Hand-Written Kuthi Iba
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
                  Get full astrological house analysis, Yek, Gotra, and consecrated parchment scroll delivered to your doorstep.
                </p>
                <div className="pt-2">
                  <Link
                    href="/manipuri_kuthi"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <span>Get your professional Kuthi</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ManipuriFreeKuthiPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffdfa] pt-20 text-center text-[#0f172a]">Loading Free Kuthi Generator...</div>}>
      <ManipuriFreeKuthiContent />
    </Suspense>
  );
}
