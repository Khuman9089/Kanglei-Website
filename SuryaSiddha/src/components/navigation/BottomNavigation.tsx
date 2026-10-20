// components/navigation/BottomNavigation.tsx
import React from 'react';
import {
  Home as HomeIcon,
  CalendarDays,
  Calendar as CalendarIcon,
  Clock,
  Settings as SettingsIcon,
  LayoutGrid
} from 'lucide-react';

export type MainTabType = 'home' | 'calendar' | 'panchang' | 'kundli' | 'muhurta' | 'settings';

interface BottomNavigationProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  language?: 'bn' | 'en';
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  language = 'bn',
}) => {
  const tabs: { id: MainTabType; labelEn: string; labelBn: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      labelEn: 'Home',
      labelBn: 'হোম',
      icon: <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />,
    },
    {
      id: 'calendar',
      labelEn: 'Calendar',
      labelBn: 'পার্বণ',
      icon: <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />,
    },
    {
      id: 'panchang',
      labelEn: 'Panchang',
      labelBn: 'পঞ্জিকা',
      icon: <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />,
    },
    {
      id: 'kundli',
      labelEn: 'Kundli',
      labelBn: 'কুণ্ডলী',
      icon: <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />,
    },
    {
      id: 'muhurta',
      labelEn: 'Muhurta',
      labelBn: 'মুহূর্ত',
      icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />,
    },
    {
      id: 'settings',
      labelEn: 'Settings',
      labelBn: 'সেটিংস',
      icon: <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />,
    },
  ];

  return (
    <nav className="w-full shrink-0 z-40 bg-[#fff8f4]/95 backdrop-blur-md border-t border-[#e6d5b8] shadow-nav px-1 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom,0.6rem))] select-none">
      <div className="max-w-md mx-auto grid grid-cols-6 gap-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const primaryText = language === 'bn' ? tab.labelBn : tab.labelEn;
          const secondaryText = language === 'bn' ? tab.labelEn : tab.labelBn;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#9c1b1b]'
                  : 'text-[#59413e] hover:text-[#9c1b1b]'
              }`}
            >
              <div
                className={`w-8 h-7 rounded-full flex items-center justify-center mb-0.5 transition-all ${
                  isActive ? 'bg-[#9c1b1b]/10 scale-105 shadow-xs' : 'bg-transparent'
                }`}
              >
                {tab.icon}
              </div>
              <span className={`text-[10px] leading-tight truncate ${language === 'bn' ? 'font-bengali' : 'font-sans'} ${isActive ? 'font-bold text-[#9c1b1b]' : 'font-medium text-[#59413e]'}`}>
                {primaryText}
              </span>
              <span className={`text-[8.5px] leading-none mt-0.5 truncate ${language === 'bn' ? 'font-sans' : 'font-bengali'} ${isActive ? 'font-semibold text-[#9c1b1b]' : 'text-[#59413e]/75'}`}>
                {secondaryText}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
