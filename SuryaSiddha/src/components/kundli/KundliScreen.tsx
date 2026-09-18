// components/kundli/KundliScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  Clock,
  Flame,
  ShieldAlert,
  Heart,
  Table,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award
} from 'lucide-react';
import { UserBirthProfile, KundliData } from '../../types/astronomy';
import { NorthIndianChart } from '../charts/NorthIndianChart';
import { SouthIndianChart } from '../charts/SouthIndianChart';
import { DivisionalSelector } from '../charts/DivisionalSelector';
import { PlanetaryTable } from '../charts/PlanetaryTable';
import { ActiveDashaCard } from '../dasha/ActiveDashaCard';
import { DashaTreeViewer } from '../dasha/DashaTreeViewer';
import { ManglikCard } from '../doshas/ManglikCard';
import { SadeSatiTracker } from '../doshas/SadeSatiTracker';
import { YogaList } from '../yogas/YogaList';
import { KundliMatching } from '../matching/KundliMatching';
import { LocationInput } from '../places/LocationInput';

interface KundliScreenProps {
  profile: UserBirthProfile;
  kundliData: KundliData;
  onUpdateProfile: (profile: UserBirthProfile) => void;
}

export const KundliScreen: React.FC<KundliScreenProps> = ({
  profile,
  kundliData,
  onUpdateProfile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chart' | 'planets' | 'dasha' | 'doshas' | 'matching'>('chart');
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [activeDivisional, setActiveDivisional] = useState<string>('D1');

  const activeChart = kundliData.divisionalCharts[activeDivisional] || kundliData.divisionalCharts.D1;

  const handlePrint = () => {
    window.print();
  };

  // Detected prominent yogas pills (Gajakesari & Budhaditya)
  const prominentYogas = useMemo(() => {
    return kundliData.yogas.filter((y) => y.isPresent).slice(0, 3);
  }, [kundliData.yogas]);

  return (
    <div className="space-y-4 pb-20 sm:pb-24 animate-in fade-in duration-150">
      {/* 1. Birth Details Form & PDF Export Header */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF6B4A] to-[#FFA133] text-white shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                Natal Horoscope & Astronomical Telemetry
              </h2>
              <p className="text-xs text-stone-500">
                Precision Swiss Ephemeris • Lahiri Standard
              </p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition active:scale-95 shadow-2xs cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-amber-600" />
            <span>Export Chart PDF</span>
          </button>
        </div>

        {/* Input Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Full Name */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onUpdateProfile({ ...profile, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none shadow-2xs"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Gender</label>
            <div className="mt-1 flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => onUpdateProfile({ ...profile, gender: 'Male' })}
                className={`w-1/2 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  profile.gender === 'Male'
                    ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FFA133] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => onUpdateProfile({ ...profile, gender: 'Female' })}
                className={`w-1/2 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  profile.gender === 'Female'
                    ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FFA133] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Date of Birth</label>
            <input
              type="date"
              value={profile.dob}
              onChange={(e) => e.target.value && onUpdateProfile({ ...profile, dob: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 outline-none shadow-2xs focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Time of Birth */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Time of Birth (HH:MM:SS)</label>
            <input
              type="time"
              step="1"
              value={profile.tob}
              onChange={(e) => e.target.value && onUpdateProfile({ ...profile, tob: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 outline-none shadow-2xs focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Birth Place (Google Places) */}
          <div className="sm:col-span-2 lg:col-span-1">
            <LocationInput
              value={profile.place}
              latitude={profile.lat}
              longitude={profile.lng}
              timezone={profile.timezone}
              onChange={(loc) => {
                onUpdateProfile({
                  ...profile,
                  place: loc.place,
                  lat: loc.lat,
                  lng: loc.lng,
                  timezone: loc.timezone,
                });
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Distinct Diagnostic Status Badges (Manglik, Sade Sati, Yogas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* A. Manglik Dosha: Soft Berry Rose Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#E11D48]" />
              <span className="text-[10px] uppercase font-black tracking-wider text-[#881337]">
                Manglik Dosha
              </span>
            </div>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                kundliData.manglik.isManglik && kundliData.manglik.severity !== 'Cancelled'
                  ? 'bg-[#FFE4E6] text-[#9F1239] border-[#FDA4AF]'
                  : 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]'
              }`}
            >
              {kundliData.manglik.severity === 'Cancelled' ? 'Mild / Cancelled' : kundliData.manglik.severity === 'None' ? 'Non-Manglik' : `${kundliData.manglik.severity} Manglik`}
            </span>
          </div>
          <div className="mt-2 text-sm font-black text-[#881337]">
            {kundliData.manglik.severity === 'Cancelled'
              ? 'Dosha Cancelled by Benefic Aspect'
              : kundliData.manglik.severity === 'None'
              ? 'No Kuja Dosha Affliction'
              : 'Active Mars Influence in House ' + (kundliData.planets.Mars?.house || 1)}
          </div>
          <p className="mt-1 text-[11px] text-[#9F1239] leading-snug">
            {kundliData.manglik.cancellations[0] || 'Evaluated from Lagna, Chandra, and Shukra houses.'}
          </p>
        </div>

        {/* B. Shani Sade Sati: Warm Amber Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#D97706]" />
              <span className="text-[10px] uppercase font-black tracking-wider text-[#78350F]">
                Shani Sade Sati
              </span>
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
              {kundliData.sadeSati.isUnderSadeSati ? 'Active Transit' : 'Inactive'}
            </span>
          </div>
          <div className="mt-2 text-sm font-black text-[#78350F]">
            {kundliData.sadeSati.currentPhase}
          </div>
          <p className="mt-1 text-[11px] text-[#92400E] leading-snug">
            Saturn transiting relative to natal Moon sign ({kundliData.sadeSati.moonSign}).
          </p>
        </div>

        {/* C. Detected Yogas: Mint Emerald Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#059669]" />
              <span className="text-[10px] uppercase font-black tracking-wider text-[#065F46]">
                Classical Yogas
              </span>
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#6EE7B7]">
              {prominentYogas.length} Formed
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {prominentYogas.map((y) => (
              <span
                key={y.name}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#6EE7B7] text-[#064E3B] shadow-2xs"
              >
                ✨ {y.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1.5 pb-1 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveSubTab('chart')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'chart'
              ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FFA133] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Kundli & Vargas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('planets')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'planets'
              ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FFA133] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Table className="h-3.5 w-3.5" />
          <span>Planetary Table</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dasha')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'dasha'
              ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FFA133] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>120-Yr Vimshottari</span>
        </button>

        <button
          onClick={() => setActiveSubTab('doshas')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'doshas'
              ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FFA133] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          <span>Doshas & Yogas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('matching')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'matching'
              ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FFA133] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Heart className="h-3.5 w-3.5" />
          <span>36-Guna Matchmaking</span>
        </button>
      </div>

      {/* 4. Subtab Content */}

      {/* SUBTAB 1: KUNDLI CHART */}
      {activeSubTab === 'chart' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                {activeChart.name}: {activeChart.title}
              </h3>
              <p className="text-xs text-stone-500">
                Lagna: <strong>{kundliData.lagna.rashiName} ({kundliData.lagna.rashiSanskrit})</strong> at {kundliData.lagna.dms.deg}° {kundliData.lagna.dms.min}'
              </p>
            </div>
          </div>

          {/* Divisional Selector with Chart Style Toggle */}
          <DivisionalSelector
            divisionalCharts={kundliData.divisionalCharts}
            activeCode={activeDivisional}
            onSelect={setActiveDivisional}
            chartStyle={chartStyle}
            onToggleChartStyle={setChartStyle}
          />

          {/* Responsive SVG Chart Canvas */}
          <div className="max-w-xl mx-auto">
            {chartStyle === 'north' ? (
              <NorthIndianChart
                houses={activeChart.houses}
                title={activeChart.title}
              />
            ) : (
              <SouthIndianChart
                houses={activeChart.houses}
                planets={kundliData.planets}
                lagnaRashi={kundliData.lagna.rashi}
                title={activeChart.title}
              />
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PLANETARY TABLE */}
      {activeSubTab === 'planets' && (
        <PlanetaryTable planets={kundliData.planets} />
      )}

      {/* SUBTAB 3: VIMSHOTTARI DASHA */}
      {activeSubTab === 'dasha' && (
        <div className="space-y-4">
          <ActiveDashaCard
            birthBalance={kundliData.dasha.birthBalance}
            tree={kundliData.dasha.tree}
            activePath={kundliData.dasha.activePath}
          />
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm">
            <DashaTreeViewer tree={kundliData.dasha.tree} />
          </div>
        </div>
      )}

      {/* SUBTAB 4: DOSHAS & YOGAS */}
      {activeSubTab === 'doshas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ManglikCard manglik={kundliData.manglik} />
            <SadeSatiTracker sadeSati={kundliData.sadeSati} />
          </div>
          <YogaList yogas={kundliData.yogas} />
        </div>
      )}

      {/* SUBTAB 5: 36-GUNA MATCHMAKING */}
      {activeSubTab === 'matching' && (
        <KundliMatching />
      )}
    </div>
  );
};
