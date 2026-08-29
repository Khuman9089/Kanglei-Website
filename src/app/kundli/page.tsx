'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Download, Printer } from 'lucide-react';
import Link from 'next/link';
import BirthDetailsForm from '@/components/forms/BirthDetailsForm';
import KuthiIbaPageForm from '@/components/forms/KuthiIbaPageForm';
import BengaliChart from '@/components/charts/BengaliChart';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import SouthIndianChart from '@/components/charts/SouthIndianChart';
import PlanetaryTable from '@/components/charts/PlanetaryTable';
import DashaTimeline from '@/components/charts/DashaTimeline';
import Navbar from '@/components/layout/Navbar';
import { KuthiIbaModal } from '@/components/modals/KuthiIbaModal';

interface PlanetData {
  name: string;
  shortName: string;
  longitude: number;
  signIndex: number;
  signName: string;
  signDegree: number;
  nakshatraName: string;
  nakshatraPada: number;
  houseNumber: number;
  isRetrograde: boolean;
}

interface DashaPeriodData {
  lord: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  level: 'maha' | 'antar' | 'pratyantar';
  subPeriods?: DashaPeriodData[];
}

interface ChartResult {
  ascendant: number;
  ascendantSign: number;
  planets: PlanetData[];
  houses: { houseNumber: number; signIndex: number; signName: string }[];
  dashas: DashaPeriodData[];
}

export default function KundliPage() {
  const [chartData, setChartData] = useState<ChartResult | null>(null);
  const [lastFormData, setLastFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartStyle, setChartStyle] = useState<'bengali' | 'north' | 'south'>('bengali');
  const [isKuthiModalOpen, setIsKuthiModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'free' | 'kuthi_iba'>('free');

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

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] print:bg-white print:p-0">
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* Page Header (Hidden when results displayed) */}
      {!chartData && (
        <div className="relative pt-36 pb-8 px-4 print:hidden">
          <div className="max-w-7xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#d97706]" />
              <span>Vedic Astrology & Kuthi Portal</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-[#0f172a]">
              Generate <span className="text-[#b45309]">Kuthi</span> & Birth Chart
            </h1>

            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
              Generate your Free Kuthi birth chart instantly OR order an authentic hand-written Kuthi Iba (<span className="font-extrabold text-[#b45309]">কুঠি ইবা</span>) prepared by expert Acharyas.
            </p>
          </div>
        </div>
      )}

      <div className={`max-w-6xl mx-auto px-4 ${chartData ? 'pt-28 sm:pt-32 pb-20' : 'pb-20'} print:pt-0 print:pb-0`}>
        <AnimatePresence mode="wait">
          {!chartData ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Dual Mode Tab Switcher */}
              <div className="flex justify-center">
                <div className="inline-flex p-1.5 rounded-2xl bg-[#fefcf6] border border-[#fde68a] shadow-sm gap-1.5">
                  <button
                    onClick={() => setActiveMode('free')}
                    className={`px-5 sm:px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                      activeMode === 'free'
                        ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-md'
                        : 'text-[#0f172a] hover:bg-[#fef3c7]'
                    }`}
                  >
                    <span>🎁 Generate Free Kuthi</span>
                  </button>

                  <button
                    onClick={() => setActiveMode('kuthi_iba')}
                    className={`px-5 sm:px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                      activeMode === 'kuthi_iba'
                        ? 'bg-[#78350f] text-white shadow-md border border-[#fde68a]'
                        : 'text-[#0f172a] hover:bg-[#fef3c7]'
                    }`}
                  >
                    <span>📜 Order Kuthi Iba (কুঠি ইবা - ₹899)</span>
                  </button>
                </div>
              </div>

              {/* Render Selected Form */}
              {activeMode === 'free' ? (
                <BirthDetailsForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              ) : (
                <KuthiIbaPageForm onSubmitSuccess={handleFormSubmit} isLoading={isLoading} />
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Controls Bar (Print Hidden) */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#f3e8d2] shadow-xs print:hidden">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-extrabold text-xs hover:bg-[#fef3c7] hover:border-[#d97706] transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-[#d97706]" />
                  <span>New Kuthi Calculation</span>
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Chart Style Switcher (Default: Bengali / Eastern) */}
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
                    onClick={() => setIsKuthiModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                    <span>Get Your Full Kuthi</span>
                  </button>
                </div>
              </div>

              {/* MAIN CONTENT CONTAINER MATCHING REFERENCE IMAGE LAYOUT */}
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-10">
                
                {/* 1. TOP CENTER SACRED GANESHA SLOKA HEADER (Exact Reference Image Text) */}
                <div className="text-center space-y-1 pb-6 border-b border-gray-100">
                  <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0f172a] tracking-wide">
                    Vedic Kuthi & Rashi Chakra
                  </h2>
                  <p className="text-xs sm:text-sm font-sans font-extrabold text-[#78350f]">
                    Calculated Sidereal Positions & Astrological Chart
                  </p>
                </div>

                {/* 2. TOP GRID: BENGALI CHART ON LEFT + CLIENT DETAILS ON RIGHT */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Eastern Style Chart (col-span-7) */}
                  <div className="md:col-span-7 flex flex-col items-center">
                    {chartStyle === 'bengali' ? (
                      <BengaliChart
                        planets={chartData.planets.map((p) => ({
                          name: p.name,
                          abbr: p.shortName || p.name.substring(0, 2),
                          houseNumber: p.houseNumber,
                          isRetrograde: p.isRetrograde,
                          signDegree: p.signDegree,
                        }))}
                        signs={chartData.houses.map((h) => h.signIndex)}
                        ascendantSign={chartData.ascendantSign}
                      />
                    ) : chartStyle === 'north' ? (
                      <NorthIndianChart
                        planets={chartData.planets.map((p) => ({
                          name: p.name,
                          abbr: p.shortName || p.name.substring(0, 2),
                          houseNumber: p.houseNumber,
                          isRetrograde: p.isRetrograde,
                        }))}
                        signs={chartData.houses.map((h) => h.signIndex)}
                        ascendantSign={chartData.ascendantSign}
                      />
                    ) : (
                      <SouthIndianChart
                        planets={chartData.planets.map((p) => ({
                          name: p.name,
                          abbr: p.shortName || p.name.substring(0, 2),
                          houseNumber: p.houseNumber,
                          isRetrograde: p.isRetrograde,
                        }))}
                        signs={chartData.houses.map((h) => h.signIndex)}
                        ascendantSign={chartData.ascendantSign}
                      />
                    )}
                  </div>

                  {/* Right Column: Client Birth Details Box (col-span-5) */}
                  <div className="md:col-span-5 bg-[#fefcf6] p-6 sm:p-8 rounded-3xl border border-[#fde68a] space-y-4 font-sans text-sm sm:text-base">
                    <h3 className="font-serif font-extrabold text-xl text-[#0f172a] border-b border-[#fde68a] pb-3">
                      Jataka Details (Birth Particulars)
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1 border-b border-gray-200/60">
                        <span className="text-gray-600 font-bold">Name:</span>
                        <span className="font-extrabold text-[#0f172a]">{lastFormData?.name || 'Client'}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1 border-b border-gray-200/60">
                        <span className="text-gray-600 font-bold">DOB:</span>
                        <span className="font-extrabold text-[#b45309]">{lastFormData?.dateOfBirth || '2026-08-28'}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1 border-b border-gray-200/60">
                        <span className="text-gray-600 font-bold">Time Of Birth:</span>
                        <span className="font-extrabold text-[#0f172a]">{lastFormData?.timeOfBirth || '06:00 AM'}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1 border-b border-gray-200/60">
                        <span className="text-gray-600 font-bold">Place Of Birth:</span>
                        <span className="font-extrabold text-[#0f172a]">{lastFormData?.placeName || 'Imphal, Manipur'}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1 border-b border-gray-200/60">
                        <span className="text-gray-600 font-bold">Coordinates:</span>
                        <span className="font-mono font-bold text-xs text-gray-700">
                          {lastFormData?.latitude || '24.8170'}°N, {lastFormData?.longitude || '93.9368'}°E
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between sm:items-center py-1">
                        <span className="text-gray-600 font-bold">Ayanamsa:</span>
                        <span className="font-extrabold text-[#b45309] text-xs uppercase">
                          {lastFormData?.ayanamsa || 'LAHIRI'} (Chitra Paksha)
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 3. MIDDLE SECTION: PLANETARY POSITION (Exact Reference Image Heading) */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0f172a]">
                      Planetary Position
                    </h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Graha Sthiti, degrees, nakshatra padas, and retrogradation
                    </p>
                  </div>

                  <PlanetaryTable
                    planets={chartData.planets.map((p) => ({
                      name: p.name,
                      sign: p.signName,
                      degree: `${Math.floor(p.signDegree)}° ${Math.floor((p.signDegree % 1) * 60)}'`,
                      nakshatra: p.nakshatraName,
                      pada: p.nakshatraPada,
                      house: p.houseNumber,
                      isRetrograde: p.isRetrograde,
                    }))}
                  />
                </div>

                {/* 4. BOTTOM SECTION: VIMSHOTTARI DASHA (Exact Reference Image Heading) */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0f172a]">
                      Vishomtarry Dasha
                    </h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Vimshottari Mahadasha & Antardasha timeline periods
                    </p>
                  </div>

                  <DashaTimeline
                    dashas={chartData.dashas.map((d, i) => ({
                      id: `dasha-${i}`,
                      planet: d.lord,
                      startDate: new Date(d.startDate).toLocaleDateString(),
                      endDate: new Date(d.endDate).toLocaleDateString(),
                      subPeriods: d.subPeriods?.map((sub, subIdx) => ({
                        id: `dasha-${i}-${subIdx}`,
                        planet: sub.lord,
                        startDate: new Date(sub.startDate).toLocaleDateString(),
                        endDate: new Date(sub.endDate).toLocaleDateString(),
                      })),
                    }))}
                    currentDate={new Date().toLocaleDateString()}
                  />
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Kuthi Iba Order Modal */}
      <KuthiIbaModal
        isOpen={isKuthiModalOpen}
        onClose={() => setIsKuthiModalOpen(false)}
        initialDob={lastFormData?.dateOfBirth}
        initialTob={lastFormData?.timeOfBirth}
        initialPob={lastFormData?.placeName}
        initialName={lastFormData?.name}
      />
    </div>
  );
}
