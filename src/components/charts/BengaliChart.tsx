'use client';

import React from 'react';

export interface BengaliPlanetInfo {
  id?: string;
  name: string;
  abbr?: string;
  houseNumber: number; // Sign index 1..12 or house 1..12
  isRetrograde?: boolean;
  signDegree?: number;
}

interface BengaliChartProps {
  planets: BengaliPlanetInfo[];
  signs?: number[];
  ascendantSign: number; // 0..11 (0=Aries, 1=Taurus, ... 11=Pisces)
  title?: string;
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  className?: string;
}

// Traditional Bengali Planet Names & Short Abbreviations
const BENGALI_PLANET_NAMES: Record<string, string> = {
  Sun: 'রবি',
  Moon: 'চন্দ্র',
  Mars: 'মঙ্গল',
  Mercury: 'বুধ',
  Jupiter: 'বৃহ',
  Venus: 'শুক্র',
  Saturn: 'শনি',
  Rahu: 'রাহু',
  Ketu: 'কেতু',
  Ascendant: 'লগ্ন',
};

// 12 Compartment Configuration for 3x3 Traditional Bengali Rashi Chakra
const COMPARTMENT_CONFIGS: Record<number, { name: string; titleX: number; titleY: number }> = {
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

export function BengaliChart({
  planets,
  ascendantSign,
  title = 'D1 Rashi Chart',
  width = 600,
  height = 380,
  theme = 'light',
  className = '',
}: BengaliChartProps) {
  const isLight = theme === 'light';

  // Map planets & Lagna to target sign index (0..11)
  const signItems: Record<number, { name: string; bName: string; isRetro: boolean }[]> = {};
  for (let i = 0; i < 12; i++) {
    signItems[i] = [];
  }

  // Add Lagna to ascendantSign compartment
  signItems[ascendantSign].push({
    name: 'Ascendant',
    bName: 'লগ্ন',
    isRetro: false,
  });

  planets.forEach((p) => {
    // Determine target sign index (0..11)
    const targetSign = (p.houseNumber - 1) % 12;
    const bName = p.abbr || BENGALI_PLANET_NAMES[p.name] || p.name;

    signItems[targetSign].push({
      name: p.name,
      bName,
      isRetro: !!p.isRetrograde,
    });
  });

  const frameBg = isLight ? '#fffdf7' : '#0b132b';
  const strokeColor = isLight ? '#b45309' : '#c69214';
  const centerBoxBg = isLight ? '#fef3c7' : '#1c2541';
  const titleColor = isLight ? '#b45309' : '#fbbf24';
  const subtitleColor = isLight ? '#92400e' : '#e0a96d';
  const rashiTagColor = isLight ? '#64748b' : '#94a3b8';

  return (
    <div className={`w-full max-w-[620px] aspect-[600/380] rounded-2xl p-2 border shadow-sm transition-colors ${
      isLight ? 'bg-[#fffdf7] border-[#d97706]/40' : 'bg-[#0b132b] border-[#c69214]'
    } ${className}`}>
      <svg
        viewBox="0 0 600 380"
        width={width}
        height={height}
        className="w-full h-full select-none font-sans"
      >
        {/* Outer Frame */}
        <rect x="2" y="2" width="596" height="376" fill={frameBg} stroke={strokeColor} strokeWidth="2.5" />

        {/* 3x3 Grid Lines */}
        <line x1="200" y1="2" x2="200" y2="378" stroke={strokeColor} strokeWidth="1.5" />
        <line x1="400" y1="2" x2="400" y2="378" stroke={strokeColor} strokeWidth="1.5" />
        <line x1="2" y1="126.67" x2="598" y2="126.67" stroke={strokeColor} strokeWidth="1.5" />
        <line x1="2" y1="253.33" x2="598" y2="253.33" stroke={strokeColor} strokeWidth="1.5" />

        {/* 4 Corner Cell Diagonals (Bengali Traditional Rashi Chakra Layout) */}
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
          className="font-serif"
        >
          {title}
        </text>
        <text
          x="300"
          y="206"
          fill={subtitleColor}
          fontSize="11"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Traditional Bengali Rashi Chakra
        </text>

        {/* Render Planets & Lagna in each of the 12 Compartments */}
        {Object.entries(COMPARTMENT_CONFIGS).map(([signIdxStr, cfg]) => {
          const signIdx = parseInt(signIdxStr, 10);
          const items = signItems[signIdx] || [];

          return (
            <g key={`sign-items-${signIdx}`}>
              {/* Small Rashi Name Tag */}
              <text
                x={cfg.titleX}
                y={cfg.titleY - 14}
                textAnchor="middle"
                fill={rashiTagColor}
                fontSize="11"
                fontWeight="bold"
              >
                {cfg.name}
              </text>

              {/* Planet / Lagna Names inside Compartment */}
              {items.length > 0 && (
                <text
                  x={cfg.titleX}
                  y={cfg.titleY + 6}
                  textAnchor="middle"
                  className="font-bold text-sm sm:text-base leading-snug"
                >
                  <tspan x={cfg.titleX} dy="0">
                    {items.map((item, idx) => {
                      let itemFill = isLight ? '#0f172a' : '#f5f0e8';
                      if (item.name === 'Ascendant') itemFill = isLight ? '#b45309' : '#fbbf24';
                      else if (item.isRetro) itemFill = '#dc2626';

                      return (
                        <tspan
                          key={idx}
                          dx={idx > 0 ? 4 : 0}
                          fill={itemFill}
                          className="font-black"
                        >
                          {item.bName}{item.isRetro ? '(ব)' : ''}
                        </tspan>
                      );
                    })}
                  </tspan>
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default BengaliChart;
