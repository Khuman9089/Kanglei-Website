// components/navigation/BottomNavigation.tsx
import React from 'react';
import { Calendar as CalendarIcon, Clock, Settings as SettingsIcon, LayoutGrid } from 'lucide-react';

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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom,0.6rem))] select-none">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-tr from-[#EA580C] to-[#F59E0B] text-slate-950 font-black shadow-lg shadow-orange-500/25 scale-[1.03]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-slate-950 ring-2 ring-amber-400" />
                )}
              </div>
              <span className={`text-[11px] leading-tight mt-0.5 tracking-tight ${isActive ? 'text-slate-950 font-black' : 'text-slate-300 font-bold'}`}>
                {tab.label}
              </span>
              <span className={`text-[9px] leading-none ${isActive ? 'text-slate-900 font-bold opacity-80' : 'text-slate-500'}`}>
                {tab.sanskrit}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
