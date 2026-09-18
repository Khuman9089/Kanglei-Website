import React, { useState } from 'react';
import { UserBirthProfile, KundliData } from '../../types/astronomy';
import { BirthDetailsForm, PRESET_CHARTS } from '../places/BirthDetailsForm';
import { NorthIndianChart } from '../charts/NorthIndianChart';
import { SouthIndianChart } from '../charts/SouthIndianChart';
import { DivisionalSelector } from '../charts/DivisionalSelector';
import { PlanetaryTable } from '../charts/PlanetaryTable';
import { ActiveDashaCard } from '../dasha/ActiveDashaCard';
import { DashaTreeViewer } from '../dasha/DashaTreeViewer';
import { ManglikCard } from '../doshas/ManglikCard';
import { SadeSatiTracker } from '../doshas/SadeSatiTracker';
import { DoshaBadges } from '../doshas/DoshaBadges';
import { YogaList } from '../yogas/YogaList';
import { KundliMatching } from '../matching/KundliMatching';
import {
  X,
  Compass,
  Clock,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Heart,
  Table,
  User,
  Printer,
} from 'lucide-react';

interface KundliModalProps {
  isOpen: boolean;
  onClose: () => void;
  kundliData: KundliData;
  profile: UserBirthProfile;
  onUpdateProfile: (profile: UserBirthProfile) => void;
  onPrint: () => void;
}

export type KundliTab = 'chart' | 'planets' | 'dasha' | 'doshas' | 'matching';

export const KundliModal: React.FC<KundliModalProps> = ({
  isOpen,
  onClose,
  kundliData,
  profile,
  onUpdateProfile,
  onPrint,
}) => {
  const [activeTab, setActiveTab] = useState<KundliTab>('chart');
  const [activeDivisional, setActiveDivisional] = useState<string>('D1');
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');

  if (!isOpen) return null;

  const activeChart = kundliData.divisionalCharts[activeDivisional] || kundliData.divisionalCharts.D1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto custom-scrollbar">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Container Dialog */}
      <div className="relative w-full max-w-6xl bg-[#FAF7F2] border border-amber-200/90 rounded-3xl shadow-2xl z-10 flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-white border-b border-amber-200/80 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Personal Vedic Kundli & Horoscope
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {kundliData.user.name || 'Natal Chart'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {kundliData.user.dob} • {kundliData.user.tob} • {kundliData.user.place}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-xs font-semibold transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-amber-100/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {/* Birth Profile Inputs (Collapsible / Compact) */}
          <BirthDetailsForm
            initialProfile={profile}
            onSubmit={(newP) => onUpdateProfile(newP)}
          />

          {/* Quick Analytical Badges */}
          <DoshaBadges
            manglik={kundliData.manglik}
            sadeSati={kundliData.sadeSati}
            yogas={kundliData.yogas}
          />

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-amber-100/70 rounded-xl border border-amber-200 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'chart'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-amber-950 hover:bg-amber-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Kundli & Vargas</span>
            </button>

            <button
              onClick={() => setActiveTab('planets')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'planets'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-amber-950 hover:bg-amber-50'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Planetary Positions</span>
            </button>

            <button
              onClick={() => setActiveTab('dasha')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'dasha'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-amber-950 hover:bg-amber-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Vimshottari Dasha</span>
            </button>

            <button
              onClick={() => setActiveTab('doshas')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'doshas'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-amber-950 hover:bg-amber-50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Doshas & Yogas</span>
            </button>

            <button
              onClick={() => setActiveTab('matching')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'matching'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-amber-950 hover:bg-amber-50'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>36-Guna Milan</span>
            </button>
          </div>

          {/* TAB 1: KUNDLI CHART */}
          {activeTab === 'chart' && (
            <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
                <div>
                  <h4 className="font-serif font-bold text-base text-slate-900">
                    {activeChart.name}: {activeChart.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Lagna: {kundliData.lagna.rashiName} ({kundliData.lagna.rashiSanskrit}) at {kundliData.lagna.dms.deg}°{kundliData.lagna.dms.min}'
                  </p>
                </div>
              </div>

              {/* Divisional Selector */}
              <DivisionalSelector
                divisionalCharts={kundliData.divisionalCharts}
                activeCode={activeDivisional}
                onSelect={setActiveDivisional}
                chartStyle={chartStyle}
                onToggleChartStyle={setChartStyle}
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
                <div className="md:col-span-7 flex justify-center">
                  {chartStyle === 'north' ? (
                    <NorthIndianChart
                      houses={activeChart.houses}
                      title={`${activeChart.name} (Diamond View)`}
                    />
                  ) : (
                    <SouthIndianChart
                      houses={activeChart.houses}
                      planets={activeChart.planets}
                      lagnaRashi={kundliData.lagna.rashi}
                      title={`${activeChart.name} (South Grid View)`}
                    />
                  )}
                </div>

                <div className="md:col-span-5 space-y-3">
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-amber-950 font-bold block mb-1">
                      Divisional Astrological Purpose:
                    </strong>
                    {activeDivisional === 'D1' && 'Primary physical constitution, overall vitality, temperament, and life direction.'}
                    {activeDivisional === 'D9' && 'Navamsha (D9) reveals inner spiritual nature, soul evolution, and marriage harmony.'}
                    {activeDivisional === 'D10' && 'Dashamsha (D10) governs public career, high status, executive honor, and legacy.'}
                    {activeDivisional === 'Chandra' && 'Chandra Kundli maps emotional balance, subconscious mind, and psychological health.'}
                    {activeDivisional === 'Surya' && 'Surya Kundli represents inner willpower, fatherly vitality, and societal recognition.'}
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-amber-800">
                      Ascendant (Lagna) Summary
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <span className="text-slate-500">Sign: </span>
                        <strong>{kundliData.lagna.rashiName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Degree: </span>
                        <strong className="font-mono">{kundliData.lagna.dms.deg}°{kundliData.lagna.dms.min}'</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Nakshatra: </span>
                        <strong>{kundliData.lagna.nakshatra.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Pada: </span>
                        <strong>P{kundliData.lagna.nakshatra.pada}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLANETARY POSITIONS */}
          {activeTab === 'planets' && (
            <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm">
              <PlanetaryTable planets={kundliData.planets} />
            </div>
          )}

          {/* TAB 3: VIMSHOTTARI DASHA */}
          {activeTab === 'dasha' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm">
                <ActiveDashaCard
                  birthBalance={kundliData.dasha.birthBalance}
                  tree={kundliData.dasha.tree}
                  activePath={kundliData.dasha.activePath}
                />
              </div>

              <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm">
                <DashaTreeViewer tree={kundliData.dasha.tree} />
              </div>
            </div>
          )}

          {/* TAB 4: DOSHAS & YOGAS */}
          {activeTab === 'doshas' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm">
                  <ManglikCard manglik={kundliData.manglik} />
                </div>
                <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm">
                  <SadeSatiTracker sadeSati={kundliData.sadeSati} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm">
                <YogaList yogas={kundliData.yogas} />
              </div>
            </div>
          )}

          {/* TAB 5: 36-GUNA MATCHMAKING */}
          {activeTab === 'matching' && (
            <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm">
              <KundliMatching />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
