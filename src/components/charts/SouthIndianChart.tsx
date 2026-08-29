'use client';

import React from 'react';
import { PlanetPosition } from './NorthIndianChart';

interface SouthIndianChartProps {
  planets: PlanetPosition[];
  signs?: number[];
  ascendantSign?: number;
  title?: string;
  className?: string;
}

export function SouthIndianChart({
  planets,
  ascendantSign = 1,
  title = 'Rashi Chart (D1)',
  className = '',
}: SouthIndianChartProps) {
  // Fixed Sign Grid Layout (Clockwise starting from Pisces top-left)
  // Sign Index: 12 (Pisces), 1 (Aries), 2 (Taurus), 3 (Gemini), etc.
  const signCells = [
    { sign: 12, name: 'মীন', x: 0, y: 0 },
    { sign: 1, name: 'মেষ', x: 100, y: 0 },
    { sign: 2, name: 'বৃষ', x: 200, y: 0 },
    { sign: 3, name: 'মিথুন', x: 300, y: 0 },
    { sign: 11, name: 'কুম্ভ', x: 0, y: 100 },
    { sign: 4, name: 'কর্কট', x: 300, y: 100 },
    { sign: 10, name: 'মকর', x: 0, y: 200 },
    { sign: 5, name: 'সিংহ', x: 300, y: 200 },
    { sign: 9, name: 'ধনু', x: 0, y: 300 },
    { sign: 8, name: 'বৃশ্চিক', x: 100, y: 300 },
    { sign: 7, name: 'তুলা', x: 200, y: 300 },
    { sign: 6, name: 'কন্যা', x: 300, y: 300 },
  ];

  return (
    <div className={`w-full max-w-md aspect-square bg-[#0b132b] rounded-2xl overflow-hidden border border-[#c69214] shadow-lg ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full font-sans">
        {/* Background & Outer Border */}
        <rect width="400" height="400" fill="#0b132b" stroke="#c69214" strokeWidth="3" />

        {/* Center Inner Box */}
        <rect x="100" y="100" width="200" height="200" fill="#1c2541" stroke="#c69214" strokeWidth="2" />
        <text
          x="200"
          y="190"
          fill="#fbbf24"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-serif"
        >
          {title}
        </text>
        <text
          x="200"
          y="215"
          fill="#e0a96d"
          fontSize="11"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Bengali / East Grid Chart
        </text>

        {/* 12 Sign Grid Cells */}
        {signCells.map((cell) => {
          // Find planets in this sign cell
          const cellPlanets = planets.filter((p) => p.houseNumber === cell.sign);
          const isAscendant = ascendantSign === cell.sign;

          return (
            <g key={cell.sign}>
              {/* Cell Box */}
              <rect x={cell.x} y={cell.y} width="100" height="100" fill="none" stroke="#c69214" strokeWidth="1.5" />

              {/* Small Rashi Label at Top Right of Cell */}
              <text
                x={cell.x + 92}
                y={cell.y + 12}
                fill="#94a3b8"
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                {cell.name}
              </text>

              {/* Ascendant Marker (Diagonal Line + 'লগ্ন') */}
              {isAscendant && (
                <>
                  <line
                    x1={cell.x}
                    y1={cell.y}
                    x2={cell.x + 100}
                    y2={cell.y + 100}
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                  <text
                    x={cell.x + 12}
                    y={cell.y + 18}
                    fill="#fbbf24"
                    fontSize="12"
                    fontWeight="black"
                  >
                    লগ্ন
                  </text>
                </>
              )}

              {/* Planets inside Cell */}
              {cellPlanets.map((p, pIdx) => (
                <text
                  key={pIdx}
                  x={cell.x + 50}
                  y={cell.y + 36 + pIdx * 16}
                  fill={p.isRetrograde ? '#ef4444' : '#f4d58d'}
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {p.abbr}{p.isRetrograde ? '(ব)' : ''}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default SouthIndianChart;
