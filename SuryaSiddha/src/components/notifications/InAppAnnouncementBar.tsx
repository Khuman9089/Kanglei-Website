// components/notifications/InAppAnnouncementBar.tsx - Top Announcement Ticker Bar
import React, { useState } from 'react';
import { Sparkles, AlertTriangle, Bell, Info, ArrowRight, X } from 'lucide-react';
import { AnnouncementBarConfig } from '../../types/admin';

interface InAppAnnouncementBarProps {
  config: AnnouncementBarConfig;
}

export const InAppAnnouncementBar: React.FC<InAppAnnouncementBarProps> = ({ config }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!config.enabled || !config.text || isDismissed) return null;

  const getStyle = () => {
    switch (config.type) {
      case 'auspicious':
        return {
          bg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white',
          badgeBg: 'bg-amber-900/30 text-amber-100 border-amber-300/40',
          icon: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
        };
      case 'festival':
        return {
          bg: 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white',
          badgeBg: 'bg-purple-900/30 text-purple-100 border-purple-300/40',
          icon: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
        };
      case 'urgent':
        return {
          bg: 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white',
          badgeBg: 'bg-black/30 text-white border-white/30',
          icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white',
          badgeBg: 'bg-indigo-800/40 text-indigo-200 border-indigo-400/30',
          icon: <Info className="w-3.5 h-3.5 shrink-0" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`w-full py-1.5 px-3.5 sm:px-6 shadow-xs relative flex items-center justify-between gap-2 text-xs font-semibold ${style.bg}`}>
      <div className="mx-auto flex items-center justify-center gap-2 max-w-4xl text-center overflow-hidden">
        {style.icon}
        {config.badge && (
          <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider border ${style.badgeBg}`}>
            {config.badge}
          </span>
        )}
        <span className="truncate max-w-[280px] sm:max-w-xl font-medium">
          {config.text}
        </span>
        {config.linkUrl && (
          <a
            href={config.linkUrl}
            target={config.linkUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80 font-bold shrink-0 text-[11px]"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="shrink-0 p-1 hover:bg-black/20 rounded-md transition text-white/80 hover:text-white cursor-pointer"
        title="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
