// components/splash/SplashScreen.tsx - Mobile Cosmic Splash Screen
import React, { useEffect, useState } from 'react';
import { Sun, Sparkles, Orbit } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  durationMs = 2200,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = 25;
    const step = 100 / (durationMs / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFading(true);
          setTimeout(onComplete, 400);
          return 100;
        }
        return Math.min(100, prev + step);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [durationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#311042] text-white p-6 transition-opacity duration-400 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Starry Glow & Aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-orange-600/10 blur-[100px]" />
      </div>

      {/* Top Tagline */}
      <div className="pt-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-[11px] font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Vedic Ephemeris Engine</span>
        </div>
      </div>

      {/* Center: Radiant Surya Chakra */}
      <div className="flex flex-col items-center justify-center text-center relative z-10 my-auto">
        <div className="relative mb-6">
          {/* Outer revolving orbital ring */}
          <div className="w-28 h-28 rounded-full border border-amber-400/30 border-dashed animate-spin flex items-center justify-center" style={{ animationDuration: '14s' }}>
            <div className="w-2 h-2 rounded-full bg-amber-400 absolute top-0 shadow-lg shadow-amber-300/80" />
          </div>

          {/* Inner Glowing Sun Disc */}
          <div className="absolute inset-2 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-orange-500/40 ring-4 ring-amber-400/20 animate-pulse">
            <Sun className="w-12 h-12 text-white stroke-[2.5]" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 drop-shadow-md">
          SuryaSiddha
        </h1>
        <p className="text-amber-300/80 font-serif text-sm font-semibold tracking-wider mt-1">
          सूर्यसिद्धान्त • वैदिक पञ्चाङ्गम्
        </p>
        <p className="text-slate-400 text-xs mt-2 max-w-xs font-sans font-medium">
          Hindu Astronomical Master Calendar & Precision Kundli
        </p>
      </div>

      {/* Bottom Loading Progress & Footer */}
      <div className="w-full max-w-xs pb-6 text-center relative z-10 flex flex-col items-center">
        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden mb-2 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-75 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-[10px] text-slate-400 font-mono">
          <span>Aligning Grahas...</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <button
          onClick={onComplete}
          className="mt-4 text-[11px] text-slate-400 hover:text-amber-300 underline font-medium cursor-pointer"
        >
          Skip into App →
        </button>
      </div>
    </div>
  );
};
