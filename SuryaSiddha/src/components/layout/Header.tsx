import React, { useState, useEffect } from 'react';
import { Printer, Info, Download, Check } from 'lucide-react';
import { UserBirthProfile } from '../../types/astronomy';

interface HeaderProps {
  currentProfile: UserBirthProfile;
  onPrint: () => void;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onPrint,
  onOpenInfo,
}) => {
  const [liveTime, setLiveTime] = useState<string>('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 px-4 sm:px-8 py-3 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-[1px] shadow-sm shadow-amber-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-amber-50 rounded-[15px] flex items-center justify-center border border-amber-200">
              <span className="text-xl">🪐</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-xl md:text-2xl tracking-wider text-slate-900">
                KangleiAstro
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                SURYA SIDDHANTA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans tracking-normal hidden sm:block">
              Hindu Astronomical Calendar • Vedic Panchang • Kundli Engine
            </p>
          </div>
        </div>

        {/* Live Clock & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Live System Time */}
          <div className="hidden md:flex flex-col text-right pr-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Live Indian Standard Time
            </span>
            <span className="font-mono text-xs font-bold text-amber-800">
              {liveTime || '--:--:--'}
            </span>
          </div>

          {/* PWA Install Button */}
          {deferredPrompt && !isInstalled && (
            <button
              onClick={handleInstallClick}
              title="Install KangleiAstro as Native App"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 animate-pulse"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {/* Print / Export Report Button */}
          <button
            onClick={onPrint}
            title="Export High-Resolution Kundli Report (PDF/Print)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {/* Info Modal Button */}
          <button
            onClick={onOpenInfo}
            title="About KangleiAstro & Astronomical Algorithms"
            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs transition-all active:scale-95"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
