'use client';

import React from 'react';

export interface PlanetPosition {
  name: string;
  abbr: string;
  houseNumber: number;
  isRetrograde?: boolean;
}

interface NorthIndianChartProps {
  planets: PlanetPosition[];
  signs: number[];
  ascendantSign?: number;
  className?: string;
}

export function NorthIndianChart({ planets, signs, ascendantSign, className = '' }: NorthIndianChartProps) {
  const getHousePlanets = (houseNum: number) => planets.filter(p => p.houseNumber === houseNum);

  const houses = [
    { num: 1, points: "200,0 300,100 200,200 100,100", labelX: 200, labelY: 100, signX: 200, signY: 20 },
    { num: 2, points: "0,0 200,0 100,100", labelX: 100, labelY: 35, signX: 180, signY: 15 },
    { num: 3, points: "0,0 100,100 0,200", labelX: 35, labelY: 100, signX: 15, signY: 20 },
    { num: 4, points: "0,200 100,100 200,200 100,300", labelX: 100, labelY: 200, signX: 20, signY: 195 },
    { num: 5, points: "0,200 100,300 0,400", labelX: 35, labelY: 300, signX: 15, signY: 385 },
    { num: 6, points: "0,400 100,300 200,400", labelX: 100, labelY: 365, signX: 180, signY: 385 },
    { num: 7, points: "200,400 100,300 200,200 300,300", labelX: 200, labelY: 300, signX: 200, signY: 385 },
    { num: 8, points: "200,400 300,300 400,400", labelX: 300, labelY: 365, signX: 220, signY: 385 },
    { num: 9, points: "400,400 300,300 400,200", labelX: 365, labelY: 300, signX: 385, signY: 385 },
    { num: 10, points: "400,200 300,300 200,200 300,100", labelX: 300, labelY: 200, signX: 385, signY: 195 },
    { num: 11, points: "400,200 300,100 400,0", labelX: 365, labelY: 100, signX: 385, signY: 20 },
    { num: 12, points: "400,0 300,100 200,0", labelX: 300, labelY: 35, signX: 220, signY: 15 }
  ];

  return (
    <div className={`w-full max-w-md aspect-square bg-[#0b132b] ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full font-sans">
        <rect width="400" height="400" fill="#0b132b" stroke="#c69214" strokeWidth="2" />
        {houses.map((house, idx) => {
          const housePlanets = getHousePlanets(house.num);
          const sign = signs[idx] || '';
          
          return (
            <g key={house.num}>
              <polygon points={house.points} fill="none" stroke="#c69214" strokeWidth="2" />
              <text x={house.signX} y={house.signY} fill="#f5f0e8" fontSize="12" textAnchor="middle" dominantBaseline="middle" className="font-bold">
                {sign}
              </text>
              {house.num === 1 && (
                <text x="200" y="45" fill="#e0a96d" fontSize="14" textAnchor="middle" dominantBaseline="middle" className="font-serif">
                  ASC
                </text>
              )}
              {housePlanets.map((p, pIdx) => (
                <text
                  key={pIdx}
                  x={house.labelX}
                  y={house.labelY - (housePlanets.length - 1) * 7 + pIdx * 14}
                  fill={p.isRetrograde ? "#ef4444" : "#f4d58d"}
                  fontSize="14"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {p.abbr}{p.isRetrograde ? '(R)' : ''}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default NorthIndianChart;

