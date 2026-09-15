'use client';

import React from 'react';
import { toBengaliNumerals, toMeeteiNumerals } from '@/engine/manipuriCalendar';

interface CircularJanmaChakraProps {
  chakraHouses: {
    rashiIndex: number; // 0 = Mesha, 1 = Brisha ... 11 = Meena
    rashiNameBengali: string;
    rashiNameMeetei: string;
    rashiNameBlipi?: string;
    planetsInHouse: {
      abbrBengali: string;
      abbrMeetei: string;
      abbrBlipi?: string;
      nakshatraNum: number;
    }[];
  }[];
  script?: 'blipi' | 'bengali' | 'meetei';
  size?: number;
}

export default function CircularJanmaChakra({
  chakraHouses,
  script = 'blipi',
  size = 280,
}: CircularJanmaChakraProps) {
  const center = size / 2;
  const outerRadius = size * 0.48;
  const innerRadius = size * 0.22;
  const midRadius = (outerRadius + innerRadius) / 2;

  // 12 sectors of 30 degrees:
  const sectorAngle = 360 / 12;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible font-sans select-none"
      >
        {/* Outer Circle */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-900 dark:text-slate-200"
        />

        {/* 12 Radial Sector Dividers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angleDeg = i * sectorAngle - 90;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x1 = center + innerRadius * Math.cos(angleRad);
          const y1 = center + innerRadius * Math.sin(angleRad);
          const x2 = center + outerRadius * Math.cos(angleRad);
          const y2 = center + outerRadius * Math.sin(angleRad);

          return (
            <line
              key={`div-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-slate-900 dark:text-slate-300"
            />
          );
        })}

        {/* Inner Hub Circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="text-slate-900 dark:text-slate-200"
        />

        {/* Center Label: জন্ম চক্র / ꯖꯟꯃ ꯆꯛꯔ / jnm c@_ */}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          className={
            script === 'blipi'
              ? 'font-blipi font-bold text-base fill-slate-900 dark:fill-slate-100'
              : 'font-serif font-bold text-[13px] fill-slate-900 dark:fill-slate-100'
          }
        >
          {script === 'blipi' ? 'jnm' : script === 'bengali' ? 'জন্ম' : 'ꯖꯟꯃ'}
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          className={
            script === 'blipi'
              ? 'font-blipi font-bold text-base fill-slate-900 dark:fill-slate-100'
              : 'font-serif font-bold text-[13px] fill-slate-900 dark:fill-slate-100'
          }
        >
          {script === 'blipi' ? 'c@_' : script === 'bengali' ? 'চক্র' : 'ꯆꯛꯔ'}
        </text>

        {/* Planet Chips in respective Rashi sectors */}
        {chakraHouses.map((house, rIdx) => {
          const midAngleDeg = rIdx * sectorAngle + sectorAngle / 2 - 90;
          const midAngleRad = (midAngleDeg * Math.PI) / 180;
          const posX = center + midRadius * Math.cos(midAngleRad);
          const posY = center + midRadius * Math.sin(midAngleRad);

          if (!house.planetsInHouse || house.planetsInHouse.length === 0) {
            return null;
          }

          return (
            <g key={`house-${rIdx}`}>
              {house.planetsInHouse.map((p, pIdx) => {
                const count = house.planetsInHouse.length;
                const offsetStep = 11;
                const offsetY = (pIdx - (count - 1) / 2) * offsetStep;

                const abbr =
                  script === 'blipi'
                    ? (p.abbrBlipi || p.abbrBengali)
                    : script === 'bengali'
                    ? p.abbrBengali
                    : p.abbrMeetei;

                const nakNum =
                  script === 'blipi'
                    ? p.nakshatraNum
                    : script === 'bengali'
                    ? toBengaliNumerals(p.nakshatraNum)
                    : toMeeteiNumerals(p.nakshatraNum);

                return (
                  <text
                    key={`p-${rIdx}-${pIdx}`}
                    x={posX}
                    y={posY + offsetY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`font-bold text-[11px] sm:text-xs fill-slate-900 dark:fill-slate-100 tracking-tighter ${
                      script === 'blipi' ? 'font-blipi' : ''
                    }`}
                  >
                    {`${abbr} ${nakNum}`}
                  </text>
                );
              })}
            </g>
          );
        })}
      </svg>
      <span
        className={`text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 ${
          script === 'blipi' ? 'font-blipi' : ''
        }`}
      >
        {script === 'blipi'
          ? 'jnm c@_ (Janma Chakra)'
          : script === 'bengali'
          ? 'দৈনিক জন্ম চক্র (Janma Chakra Wheel)'
          : 'ꯗꯩꯅꯤꯛ ꯖꯟꯃ ꯆꯛꯔ'}
      </span>
    </div>
  );
}
