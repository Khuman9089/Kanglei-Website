'use client';

import React, { useState } from 'react';

export interface AshtakvargaChartData {
  title: string;
  subtitle?: string;
  bindus: number[]; // 12 numbers for signs 0..11 (Aries..Pisces) or houses 1..12
  isSAV?: boolean;
}

// 12 Compartment Configuration for 3x3 Traditional Bengali Rashi Chakra
const BENGALI_COMPARTMENT_CONFIGS: Record<number, { name: string; titleX: number; titleY: number }> = {
  0:  { name: 'মেষ',   titleX: 300, titleY: 65 },  // Top-Middle (Aries)
  1:  { name: 'বৃষ',   titleX: 130, titleY: 45 },  // Top-Left Top (Taurus)
  2:  { name: 'মিথুন', titleX: 65,  titleY: 90 },  // Top-Left Bottom (Gemini)
  3:  { name: 'কর্কট', titleX: 95,  titleY: 190 }, // Middle-Left (Cancer)
  4:  { name: 'সিংহ',  titleX: 65,  titleY: 290 }, // Bottom-Left Top (Leo)
  5:  { name: 'কন্যা', titleX: 130, titleY: 335 }, // Bottom-Left Bottom (Virgo)
  6:  { name: 'তুলা',  titleX: 300, titleY: 320 }, // Bottom-Middle (Libra)
  7:  { name: 'বৃশ্চিক', titleX: 470, titleY: 335 }, // Bottom-Right Bottom (Scorpio)
  8:  { name: 'ধনু',   titleX: 535, titleY: 290 }, // Bottom-Right Top (Sagittarius)
  9:  { name: 'মকর',   titleX: 505, titleY: 190 }, // Middle-Right (Capricorn)
  10: { name: 'কুম্ভ', titleX: 535, titleY: 90 },  // Top-Right Bottom (Aquarius)
  11: { name: 'মীন',   titleX: 470, titleY: 45 },  // Top-Right Top (Pisces)
};

const DEFAULT_ASHTAKVARGA_CHARTS: AshtakvargaChartData[] = [
  {
    title: 'SAV (Sarvashtakvarga)',
    subtitle: 'Combined 337 Bindus',
    bindus: [28, 31, 29, 36, 27, 23, 24, 28, 23, 26, 28, 35],
    isSAV: true,
  },
  {
    title: 'Ascendant',
    subtitle: 'Lagna Ashtakvarga',
    bindus: [5, 5, 6, 2, 5, 4, 4, 3, 4, 3, 3, 5],
  },
  {
    title: 'Sun',
    subtitle: 'Surya Ashtakvarga',
    bindus: [3, 5, 7, 6, 4, 3, 4, 3, 3, 4, 3, 5],
  },
  {
    title: 'Moon',
    subtitle: 'Chandra Ashtakvarga',
    bindus: [3, 5, 4, 5, 6, 3, 5, 3, 4, 4, 5, 4],
  },
  {
    title: 'Mars',
    subtitle: 'Mangal Ashtakvarga',
    bindus: [4, 5, 3, 3, 2, 4, 3, 4, 2, 3, 3, 3],
  },
  {
    title: 'Mercury',
    subtitle: 'Budh Ashtakvarga',
    bindus: [6, 4, 5, 5, 4, 4, 5, 2, 4, 6, 3, 6],
  },
  {
    title: 'Jupiter',
    subtitle: 'Guru Ashtakvarga',
    bindus: [5, 6, 4, 5, 5, 4, 6, 5, 4, 5, 4, 3],
  },
  {
    title: 'Venus',
    subtitle: 'Shukra Ashtakvarga',
    bindus: [5, 4, 5, 6, 4, 5, 4, 5, 4, 5, 2, 3],
  },
  {
    title: 'Saturn',
    subtitle: 'Shani Ashtakvarga',
    bindus: [3, 3, 4, 3, 2, 3, 4, 3, 3, 4, 3, 4],
  },
];

export function BengaliAshtakvargaCard({
  chart,
  isLight = true,
}: {
  chart: AshtakvargaChartData;
  isLight?: boolean;
}) {
  const strokeColor = isLight ? '#b45309' : '#c69214';
  const frameBg = isLight ? '#fffdf7' : '#0b132b';
  const centerBoxBg = chart.isSAV ? (isLight ? '#fef08a' : '#2a2205') : isLight ? '#fef3c7' : '#1c2541';
  const titleColor = chart.isSAV ? '#b45309' : isLight ? '#b45309' : '#fbbf24';

  return (
    <div className={`p-4 rounded-2xl border shadow-xs space-y-2 transition-all ${
      isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
    }`}>
      {/* Title Header */}
      <div className="text-center">
        <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
          {chart.title}
        </h4>
        {chart.subtitle && (
          <span className="text-[10px] text-slate-500 block font-medium">
            {chart.subtitle}
          </span>
        )}
      </div>

      {/* SVG Bengali Ashtakvarga Chart */}
      <div className="w-full max-w-[340px] aspect-[600/380] mx-auto">
        <svg
          viewBox="0 0 600 380"
          width="100%"
          height="100%"
          className="w-full h-full select-none font-sans"
        >
          {/* Frame */}
          <rect x="2" y="2" width="596" height="376" fill={frameBg} stroke={strokeColor} strokeWidth="2.5" />

          {/* 3x3 Grid Lines */}
          <line x1="200" y1="2" x2="200" y2="378" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="400" y1="2" x2="400" y2="378" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="2" y1="126.67" x2="598" y2="126.67" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="2" y1="253.33" x2="598" y2="253.33" stroke={strokeColor} strokeWidth="1.5" />

          {/* Corner Cell Diagonals */}
          <line x1="2" y1="2" x2="200" y2="126.67" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="400" y1="126.67" x2="598" y2="2" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="2" y1="378" x2="200" y2="253.33" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="400" y1="253.33" x2="598" y2="378" stroke={strokeColor} strokeWidth="1.5" />

          {/* Center Title Box */}
          <rect x="202" y="128.67" width="196" height="122.66" fill={centerBoxBg} stroke={strokeColor} strokeWidth="1.5" />
          <text
            x="300"
            y="180"
            fill={titleColor}
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-serif font-black"
          >
            {chart.isSAV ? 'SAV' : chart.title}
          </text>
          <text
            x="300"
            y="204"
            fill={isLight ? '#78350f' : '#e0a96d'}
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {chart.isSAV ? '337 Total Bindus' : 'Ashtakvarga'}
          </text>

          {/* Render Bindus in each of the 12 Bengali Compartments */}
          {Object.entries(BENGALI_COMPARTMENT_CONFIGS).map(([signIdxStr, cfg]) => {
            const signIdx = parseInt(signIdxStr, 10);
            const val = chart.bindus[signIdx] ?? 0;

            // Highlight color based on bindu strength
            let binduColor = isLight ? '#0f172a' : '#f5f0e8';
            if (chart.isSAV) {
              if (val >= 30) binduColor = '#15803d'; // High points green
              else if (val < 25) binduColor = '#b91c1c'; // Low points red
              else binduColor = '#b45309';
            } else {
              if (val >= 5) binduColor = '#15803d';
              else if (val <= 2) binduColor = '#b91c1c';
              else binduColor = '#b45309';
            }

            return (
              <g key={`sign-bindu-${signIdx}`}>
                {/* Rashi Name Tag */}
                <text
                  x={cfg.titleX}
                  y={cfg.titleY - 14}
                  textAnchor="middle"
                  fill={isLight ? '#64748b' : '#94a3b8'}
                  fontSize="11"
                  fontWeight="bold"
                >
                  {cfg.name}
                </text>

                {/* Bindu Score */}
                <text
                  x={cfg.titleX}
                  y={cfg.titleY + 8}
                  textAnchor="middle"
                  fill={binduColor}
                  fontSize="22"
                  fontWeight="900"
                  className="font-mono tracking-tight"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function AshtakvargaSection({ isLight = true }: { isLight?: boolean }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Banner Card */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs ${
        isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
      }`}>
        <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
          Ashtakvarga
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          Each chart shows the total bindus per house. SAV is the combined Sarvashtakvarga (337 Total Bindus).
        </p>
      </div>

      {/* Grid of 9 Ashtakvarga Charts (Matching Reference Image) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEFAULT_ASHTAKVARGA_CHARTS.map((chart, idx) => (
          <BengaliAshtakvargaCard key={idx} chart={chart} isLight={isLight} />
        ))}
      </div>
    </div>
  );
}

export default AshtakvargaSection;
