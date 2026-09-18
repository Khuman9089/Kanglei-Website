// components/charts/NorthIndianChart.tsx
import React, { useState } from 'react';
import { House, PlanetPosition } from '../../types/astronomy';

interface NorthIndianChartProps {
  houses: House[];
  title?: string;
  onSelectHouse?: (house: House) => void;
}

// Color lookup map for high-contrast planetary visibility
const PLANET_COLOR_MAP: Record<string, string> = {
  Sun: '#C2410C',
  Moon: '#1E40AF',
  Mars: '#991B1B',
  Mercury: '#065F46',
  Jupiter: '#075985',
  Venus: '#581C87',
  Saturn: '#020617',
  Rahu: '#334155',
  Ketu: '#334155',
  Ascendant: '#9A3412',
};

// Center coordinates for 12 North Indian Chart house text centroids (in 400x400 SVG)
const HOUSE_CENTERS: { x: number; y: number; rashiX: number; rashiY: number }[] = [
  // H1 (Top Diamond)
  { x: 200, y: 135, rashiX: 200, rashiY: 180 },
  // H2 (Top Left Triangle)
  { x: 100, y: 65, rashiX: 165, rashiY: 45 },
  // H3 (Left Top Triangle)
  { x: 50, y: 115, rashiX: 45, rashiY: 165 },
  // H4 (Left Diamond)
  { x: 135, y: 200, rashiX: 180, rashiY: 200 },
  // H5 (Left Bottom Triangle)
  { x: 50, y: 285, rashiX: 45, rashiY: 235 },
  // H6 (Bottom Left Triangle)
  { x: 100, y: 335, rashiX: 165, rashiY: 355 },
  // H7 (Bottom Diamond)
  { x: 200, y: 265, rashiX: 200, rashiY: 220 },
  // H8 (Bottom Right Triangle)
  { x: 300, y: 335, rashiX: 235, rashiY: 355 },
  // H9 (Right Bottom Triangle)
  { x: 350, y: 285, rashiX: 355, rashiY: 235 },
  // H10 (Right Diamond)
  { x: 265, y: 200, rashiX: 220, rashiY: 200 },
  // H11 (Right Top Triangle)
  { x: 350, y: 115, rashiX: 355, rashiY: 165 },
  // H12 (Top Right Triangle)
  { x: 300, y: 65, rashiX: 235, rashiY: 45 },
];

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  houses,
  title,
  onSelectHouse,
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[480px] mx-auto">
      {title && (
        <div className="text-center mb-2">
          <h4 className="text-sm font-serif font-black text-[#7C2D12] tracking-wider">
            {title}
          </h4>
        </div>
      )}

      {/* SVG Container */}
      <div className="relative w-full aspect-square bg-[#FFFFFF] rounded-2xl p-2 border border-slate-300 shadow-md shadow-slate-900/5">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full kundli-chart-svg"
        >
          {/* Background Canvas */}
          <rect width="400" height="400" fill="#FFFFFF" rx="16" />

          {/* Outer Boundary Square with bold vermilion stroke (#C2410C, strokeWidth=2) */}
          <rect
            x="20"
            y="20"
            width="360"
            height="360"
            fill="none"
            stroke="#C2410C"
            strokeWidth="2"
            rx="4"
          />

          {/* Internal Diagonals (Corner to Corner) */}
          <line
            x1="20"
            y1="20"
            x2="380"
            y2="380"
            stroke="#C2410C"
            strokeWidth="2"
          />
          <line
            x1="380"
            y1="20"
            x2="20"
            y2="380"
            stroke="#C2410C"
            strokeWidth="2"
          />

          {/* Inner Diamond (Midpoints of outer square) */}
          <polygon
            points="200,20 380,200 200,380 20,200"
            fill="none"
            stroke="#C2410C"
            strokeWidth="2"
          />

          {/* Render Houses & Contents */}
          {houses.map((house, idx) => {
            const center = HOUSE_CENTERS[idx];
            if (!center) return null;

            const rashiNum = house.rashi + 1;

            return (
              <g
                key={house.number}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredHouse(house.number)}
                onMouseLeave={() => setHoveredHouse(null)}
                onClick={() => onSelectHouse && onSelectHouse(house)}
              >
                {/* Rashi Number in Deep Ink #020617 font-black */}
                <text
                  x={center.rashiX}
                  y={center.rashiY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-[#020617] font-mono font-black text-xs"
                >
                  {rashiNum}
                </text>

                {/* House Lagna Tag for House 1 */}
                {house.number === 1 && (
                  <text
                    x={200}
                    y={50}
                    textAnchor="middle"
                    className="fill-[#9A3412] text-[10px] font-sans font-black tracking-wider"
                  >
                    LAGNA (लग्न)
                  </text>
                )}

                {/* House Number Subscript */}
                <text
                  x={center.rashiX}
                  y={center.rashiY + 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-[#64748B] text-[8px] font-bold font-sans"
                >
                  H{house.number}
                </text>

                {/* Planets in this house */}
                <g transform={`translate(${center.x}, ${center.y})`}>
                  {house.planets.map((planet, pIdx) => {
                    const row = Math.floor(pIdx / 2);
                    const col = pIdx % 2;
                    const totalRows = Math.ceil(house.planets.length / 2);
                    const xOffset = house.planets.length === 1 ? 0 : col === 0 ? -24 : 24;
                    const yOffset = (row - (totalRows - 1) / 2) * 16;
                    const planetColor = PLANET_COLOR_MAP[planet.name] || '#0F172A';

                    return (
                      <g
                        key={planet.name}
                        transform={`translate(${xOffset}, ${yOffset})`}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setHoveredPlanet(planet);
                        }}
                        onMouseLeave={(e) => {
                          e.stopPropagation();
                          setHoveredPlanet(null);
                        }}
                        className="hover:scale-110 transition-transform"
                      >
                        <rect
                          x="-18"
                          y="-7"
                          width="36"
                          height="14"
                          rx="4"
                          fill="#FFFFFF"
                          stroke={planetColor}
                          strokeWidth="1.6"
                          strokeDasharray={planet.isRetrograde ? '2 1' : 'none'}
                          filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
                        />
                        <text
                          x="0"
                          y="1"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={planetColor}
                          className="text-[9px] font-sans font-black tracking-tight"
                        >
                          {planet.symbol}
                          {planet.isRetrograde ? 'ᴿ' : ''}
                          {planet.isCombust ? '🔥' : ''}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}
        </svg>

        {/* Interactive Hover Tooltip */}
        {hoveredPlanet && (
          <div className="absolute top-3 left-3 right-3 bg-white border-2 border-[#C2410C] rounded-xl p-2.5 shadow-xl z-30 pointer-events-none animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200">
              <span className="font-black text-[#020617] flex items-center gap-1.5">
                <span className="text-base">{hoveredPlanet.glyph}</span>
                {hoveredPlanet.name} ({hoveredPlanet.sanskritName})
              </span>
              <span className="font-mono text-[#C2410C] font-black">
                {hoveredPlanet.dms.deg}° {hoveredPlanet.dms.min}' {hoveredPlanet.dms.sec}"
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1.5 text-[11px] text-slate-700">
              <div>
                <span className="text-slate-500 font-bold">Sign: </span>
                <span className="text-slate-900 font-black">{hoveredPlanet.rashiName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold">Nakshatra: </span>
                <span className="text-slate-900 font-black">{hoveredPlanet.nakshatra.name} (P{hoveredPlanet.nakshatra.pada})</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold">Dignity: </span>
                <span className="text-emerald-800 font-black">{hoveredPlanet.dignity}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-[11px] text-slate-700 font-bold">
        <div className="flex items-center gap-1">
          <span className="text-[#020617] font-mono font-black">1..12</span>
          <span>Rashi (Sign)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[#991B1B] font-mono font-black">ᴿ</span>
          <span>Retrograde (Vakri)</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🔥</span>
          <span>Combust (Asta)</span>
        </div>
      </div>
    </div>
  );
};
