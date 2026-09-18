import React from 'react';
import { PanchangData, PlanetPosition } from '../../types/astronomy';
import { Sun, Moon, Compass, Sparkles, Clock, Globe } from 'lucide-react';

interface AstronomicalTelemetryBarProps {
  panchang: PanchangData;
  planets: Record<string, PlanetPosition>;
}

export const AstronomicalTelemetryBar: React.FC<AstronomicalTelemetryBarProps> = ({
  panchang,
  planets,
}) => {
  const sun = planets.Sun;
  const moon = planets.Moon;

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 p-4 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
        {/* Sunrise & Sunset */}
        <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/70 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 flex-shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Sunrise / Sunset
            </div>
            <div className="font-mono font-bold text-slate-900 text-xs">
              {panchang.sunrise} AM • {panchang.sunset} PM
            </div>
          </div>
        </div>

        {/* Solar Noon */}
        <div className="p-2.5 rounded-xl bg-orange-50/50 border border-orange-200/70 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-700 flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Solar Noon (Madhya)
            </div>
            <div className="font-mono font-bold text-slate-900 text-xs">
              {panchang.solarNoon}
            </div>
          </div>
        </div>

        {/* Sun Sidereal Position */}
        <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/70 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 flex-shrink-0 font-bold">
            ☉
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Surya (Sun) Sign
            </div>
            <div className="font-semibold text-slate-900 text-xs">
              {sun ? `${sun.rashiName} (${sun.dms.deg}°${sun.dms.min}')` : '—'}
            </div>
          </div>
        </div>

        {/* Moon Sidereal Position */}
        <div className="p-2.5 rounded-xl bg-cyan-50/50 border border-cyan-200/70 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-700 flex-shrink-0 font-bold">
            ☽
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Chandra (Moon) Sign
            </div>
            <div className="font-semibold text-slate-900 text-xs">
              {moon ? `${moon.rashiName} (${moon.dms.deg}°${moon.dms.min}')` : '—'}
            </div>
          </div>
        </div>

        {/* Lahiri Ayanamsa */}
        <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-200/70 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Lahiri Ayanamsa
            </div>
            <div className="font-mono font-bold text-purple-950 text-xs">
              {panchang.ayanamsa.formatted}
            </div>
          </div>
        </div>

        {/* Vedic Solar Month */}
        <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Solar Month (Masa)
            </div>
            <div className="font-semibold text-slate-900 text-xs">
              {sun?.rashiSanskrit || 'Simha'} Masa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
