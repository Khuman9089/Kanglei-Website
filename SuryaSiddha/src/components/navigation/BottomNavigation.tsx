// components/navigation/BottomNavigation.tsx
import React from 'react';
import { Calendar as CalendarIcon, Sparkles, Clock, Settings as SettingsIcon, LayoutGrid } from 'lucide-react';

export type MainTabType = 'panchang' | 'kundli' | 'muhurta' | 'settings';

interface BottomNavigationProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: MainTabType; label: string; sanskrit: string; icon: React.ReactNode }[] = [
    {
      id: 'panchang',
      label: 'Panchang',
      sanskrit: 'पञ्चाङ्गम्',
      icon: <CalendarIcon className="w-5 h-5" />,
    },
    {
      id: 'kundli',
      label: 'Kundli',
      sanskrit: 'कुण्डली',
      icon: <LayoutGrid className="w-5 h-5" />,
    },
    {
      id: 'muhurta',
      label: 'Muhurta',
      sanskrit: 'शुभ मुहूर्त',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      sanskrit: 'ग्रह स्थिति',
      icon: <SettingsIcon className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg shadow-slate-900/5 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))] select-none touch-none">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-tr from-[#FF6B4A] to-[#FFA133] text-white shadow-md shadow-orange-500/25 font-bold scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white ring-2 ring-orange-500" />
                )}
              </div>
              <span className="text-[11px] leading-tight mt-0.5 tracking-tight font-sans">
                {tab.label}
              </span>
              <span className={`text-[9px] leading-none ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>
                {tab.sanskrit}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
