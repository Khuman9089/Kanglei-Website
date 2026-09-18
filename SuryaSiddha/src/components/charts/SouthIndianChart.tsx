import React, { useState } from 'react';
import { House, PlanetPosition } from '../../types/astronomy';
import { RASHIS } from '../../data/rashis';

interface SouthIndianChartProps {
  houses: House[];
  planets: Record<string, PlanetPosition>;
  lagnaRashi: number;
  title?: string;
  onSelectHouse?: (house: House) => void;
}

const SOUTH_GRID_CELLS: { rashi: number; col: number; row: number }[] = [
  { rashi: 11, col: 0, row: 0 }, // Pisces
  { rashi: 0, col: 1, row: 0 },  // Aries
  { rashi: 1, col: 2, row: 0 },  // Taurus
  { rashi: 2, col: 3, row: 0 },  // Gemini
  { rashi: 3, col: 3, row: 1 },  // Cancer
  { rashi: 4, col: 3, row: 2 },  // Leo
  { rashi: 5, col: 3, row: 3 },  // Virgo
  { rashi: 6, col: 2, row: 3 },  // Libra
  { rashi: 7, col: 1, row: 3 },  // Scorpio
  { rashi: 8, col: 0, row: 3 },  // Sagittarius
  { rashi: 9, col: 0, row: 2 },  // Capricorn
  { rashi: 10, col: 0, row: 1 }, // Aquarius
];

export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({
  houses,
  planets,
  lagnaRashi,
  title,
  onSelectHouse,
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);

  const cellSize = 95;
  const padding = 10;

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[480px] mx-auto">
      {title && (
        <div className="text-center mb-2">
          <h4 className="text-sm font-serif font-bold text-amber-900 tracking-wider">
            {title}
          </h4>
        </div>
      )}

      <div className="relative w-full aspect-square bg-[#FEFCF8] rounded-2xl p-2 border border-amber-300/80 shadow-md shadow-amber-900/5">
        <svg viewBox="0 0 400 400" className="w-full h-full kundli-chart-svg">
          {/* Outer Border */}
          <rect
            x={padding}
            y={padding}
            width={380}
            height={380}
            fill="none"
            stroke="#B45309"
            strokeWidth="2.5"
            rx="8"
          />

          {/* Center Box */}
          <rect
            x={padding + cellSize}
            y={padding + cellSize}
            width={cellSize * 2}
            height={cellSize * 2}
            fill="#FFFBEB"
            stroke="#B45309"
            strokeWidth="1.5"
            rx="6"
          />

          {/* Center Info Text */}
          <text
            x={200}
            y={185}
            textAnchor="middle"
            className="fill-amber-900 font-serif font-bold text-xs tracking-wider"
          >
            SOUTH INDIAN GRID
          </text>
          <text
            x={200}
            y={205}
            textAnchor="middle"
            className="fill-slate-500 font-sans text-[10px]"
          >
            Fixed Zodiac (Meena to Kumbha)
          </text>
          <text
            x={200}
            y={225}
            textAnchor="middle"
            className="fill-amber-700 font-sans font-bold text-[11px]"
          >
            Lagna: {RASHIS[lagnaRashi].name} ({RASHIS[lagnaRashi].sanskritName})
          </text>

          {/* Render 12 Fixed Zodiac Boxes */}
          {SOUTH_GRID_CELLS.map((cell) => {
            const x = padding + cell.col * cellSize;
            const y = padding + cell.row * cellSize;
            const rashi = RASHIS[cell.rashi];
            const isLagna = cell.rashi === lagnaRashi;

            let houseNum = cell.rashi - lagnaRashi + 1;
            if (houseNum <= 0) houseNum += 12;

            const houseData = houses.find((h) => h.number === houseNum);
            const cellPlanets = Object.values(planets).filter((p) => p.rashi === cell.rashi);

            return (
              <g
                key={cell.rashi}
                className="cursor-pointer group"
                onClick={() => houseData && onSelectHouse && onSelectHouse(houseData)}
              >
                {/* Cell Box */}
                <rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill={isLagna ? '#FEF3C7' : '#FFFFFF'}
                  stroke="#D97706"
                  strokeWidth="1"
                  className="transition-colors group-hover:fill-amber-50"
                />

                {/* Lagna Diagonal Slash */}
                {isLagna && (
                  <line
                    x1={x}
                    y1={y}
                    x2={x + cellSize}
                    y2={y + cellSize}
                    stroke="#B45309"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Sign Label */}
                <text
                  x={x + 6}
                  y={y + 14}
                  className="fill-slate-700 text-[10px] font-semibold tracking-tight"
                >
                  {rashi.name.slice(0, 3)}
                  <tspan className="fill-amber-800 font-mono font-bold text-[9px] ml-1">
                    {' '}(H{houseNum})
                  </tspan>
                </text>

                {/* Lagna Tag */}
                {isLagna && (
                  <text
                    x={x + cellSize - 6}
                    y={y + 14}
                    textAnchor="end"
                    className="fill-amber-900 text-[9px] font-bold tracking-wider"
                  >
                    ASC
                  </text>
                )}

                {/* Planets in this Zodiac Sign */}
                <g transform={`translate(${x + cellSize / 2}, ${y + 35})`}>
                  {cellPlanets.map((planet, pIdx) => {
                    const row = Math.floor(pIdx / 2);
                    const col = pIdx % 2;
                    const xOff = cellPlanets.length === 1 ? 0 : col === 0 ? -22 : 22;
                    const yOff = row * 16;

                    return (
                      <g
                        key={planet.name}
                        transform={`translate(${xOff}, ${yOff})`}
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
                          stroke={planet.color}
                          strokeWidth="1.2"
                          filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
                        />
                        <text
                          x="0"
                          y="1"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={planet.color}
                          className="text-[9px] font-sans font-bold"
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

        {/* Hover Popover */}
        {hoveredPlanet && (
          <div className="absolute top-3 left-3 right-3 bg-white border border-amber-300 rounded-xl p-2.5 shadow-xl z-30 pointer-events-none animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-amber-100">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <span className="text-base">{hoveredPlanet.glyph}</span>
                {hoveredPlanet.name} ({hoveredPlanet.sanskritName})
              </span>
              <span className="font-mono text-amber-700 font-semibold">
                {hoveredPlanet.dms.deg}° {hoveredPlanet.dms.min}' {hoveredPlanet.dms.sec}"
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1.5 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400">Sign: </span>
                <span className="text-slate-800 font-medium">{hoveredPlanet.rashiName}</span>
              </div>
              <div>
                <span className="text-slate-400">Nakshatra: </span>
                <span className="text-slate-800 font-medium">{hoveredPlanet.nakshatra.name} (P{hoveredPlanet.nakshatra.pada})</span>
              </div>
              <div>
                <span className="text-slate-400">Dignity: </span>
                <span className="text-emerald-700 font-semibold">{hoveredPlanet.dignity}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
