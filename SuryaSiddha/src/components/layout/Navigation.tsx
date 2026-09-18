import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Calendar,
  Clock,
  ShieldAlert,
  Heart,
} from 'lucide-react';

export type TabKey =
  | 'dashboard'
  | 'charts'
  | 'panchang'
  | 'dasha'
  | 'doshas'
  | 'matching';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

interface NavItem {
  key: TabKey;
  label: string;
  sanskrit: string;
  icon: React.ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navItems: NavItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      sanskrit: 'सिंहावलोकन',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      key: 'charts',
      label: 'Kundli Charts',
      sanskrit: 'कुण्डली चक्र',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      key: 'panchang',
      label: 'Panchang & Muhurta',
      sanskrit: 'पञ्चाङ्गम्',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      key: 'dasha',
      label: 'Vimshottari Dasha',
      sanskrit: 'विंशोत्तरी दशा',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      key: 'doshas',
      label: 'Doshas & Yogas',
      sanskrit: 'दोष व योग',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      key: 'matching',
      label: '36-Guna Milan',
      sanskrit: 'गुण मिलान',
      icon: <Heart className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md border-b border-amber-200/60 px-4 sm:px-8 overflow-x-auto custom-scrollbar shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                  : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50/80 border border-transparent'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-500'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              <span className={`text-[10px] font-serif hidden md:inline ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>
                ({item.sanskrit})
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
