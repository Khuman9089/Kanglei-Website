'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, Star, Compass, ShieldCheck } from 'lucide-react';

interface AppSplashScreenProps {
  onFinish?: () => void;
  duration?: number; // total duration in ms, default 2400ms
  autoDismiss?: boolean;
}

export default function AppSplashScreen({
  onFinish,
  duration = 2400,
  autoDismiss = true,
}: AppSplashScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Initializing Lunar Ephemeris...');
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 28) {
        setStatusText('Aligning Manipuri Lunar Ephemeris...');
      } else if (pct < 62) {
        setStatusText('Calculating Thawan & Nakshatra Muhurtas...');
      } else if (pct < 90) {
        setStatusText('Synchronizing Rashifal & Daily Panchang...');
      } else {
        setStatusText('Ready • Khurumjari');
      }

      if (pct >= 100) {
        clearInterval(interval);
        if (autoDismiss) {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
          }, 450); // fade out duration
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, [duration, autoDismiss, onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 bg-[#090b10] text-white select-none overflow-hidden transition-all duration-500 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 35%, #1e1533 0%, #0c0e17 50%, #06070a 100%)',
      }}
    >
      {/* Background Sacred Geometric Mandala / Stars Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        {/* Glowing Nebula Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Ambient Twinkling Stars */}
        <div className="absolute top-[12%] left-[18%] animate-ping text-amber-300 text-xs">✦</div>
        <div className="absolute top-[22%] right-[20%] animate-pulse text-amber-200 text-sm delay-300">★</div>
        <div className="absolute top-[48%] left-[10%] animate-pulse text-purple-300 text-xs delay-500">✦</div>
        <div className="absolute top-[65%] right-[14%] animate-ping text-amber-400 text-xs delay-200">★</div>
        <div className="absolute top-[78%] left-[24%] animate-pulse text-amber-100 text-xs delay-700">✦</div>
        <div className="absolute top-[35%] right-[8%] animate-pulse text-amber-300 text-sm delay-1000">✦</div>
      </div>

      {/* Top Bar: Skip Button & Mode indicator */}
      <div className="w-full flex items-center justify-between max-w-sm pt-4 z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-medium text-amber-300/90 tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Vedic Panchang Engine</span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-zinc-300 text-[11px] font-medium tracking-wide transition border border-white/10 backdrop-blur-md"
        >
          Skip →
        </button>
      </div>

      {/* Central Rotating Emblem & Brand Identity */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center space-y-6">
        {/* Sacred Astrological Rotating Rings & Center Badge */}
        <div className="relative flex items-center justify-center">
          {/* Outer Constellation Ring (Slow clockwise rotation) */}
          <div
            className="w-44 h-44 rounded-full border border-dashed border-amber-400/30 flex items-center justify-center animate-spin"
            style={{ animationDuration: '30s' }}
          >
            {/* Outer Nodes */}
            <div className="absolute -top-1.5 w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_10px_#f59e0b]" />
            <div className="absolute -bottom-1.5 w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_10px_#f59e0b]" />
            <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_10px_#f59e0b]" />
            <div className="absolute -right-1.5 w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_10px_#f59e0b]" />
          </div>

          {/* Middle Counter-Rotating Zodiac Ring */}
          <div
            className="absolute w-36 h-36 rounded-full border border-purple-400/30 flex items-center justify-center animate-spin"
            style={{ animationDuration: '20s', animationDirection: 'reverse' }}
          >
            <span className="absolute top-1 text-[9px] text-amber-300/80 font-serif">♈</span>
            <span className="absolute right-1 text-[9px] text-amber-300/80 font-serif">♋</span>
            <span className="absolute bottom-1 text-[9px] text-amber-300/80 font-serif">♎</span>
            <span className="absolute left-1 text-[9px] text-amber-300/80 font-serif">♑</span>
          </div>

          {/* Inner Golden Radial Glow */}
          <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-amber-300/20 blur-md animate-pulse" />

          {/* Center Brand Core Emblem */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#2a1b40] via-[#171328] to-[#0d0a17] border-2 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.35)] flex flex-col items-center justify-center transform transition-transform hover:scale-105">
            <div className="relative flex items-center justify-center">
              <Sun className="w-9 h-9 text-amber-400 animate-pulse drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
              <Moon className="w-5 h-5 text-amber-200 absolute -bottom-1 -right-1 drop-shadow" />
            </div>
            <span className="text-[9px] font-black tracking-widest text-amber-300 uppercase mt-1 font-mono">
              KANGLEI
            </span>
          </div>
        </div>

        {/* Brand Names & Manipuri Script Typography */}
        <div className="space-y-2 max-w-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-300">
            <span>কাংলৈ এস্ট্রো • ꯀꯨꯊꯤ ꯌꯦꯡꯐꯝ</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500">
            KANGLEI ASTRO
          </h1>

          <p className="text-xs text-zinc-400 font-medium tracking-wide">
            Manipuri Calendar • Vedic Panchang • Kuthi Analysis
          </p>
        </div>
      </div>

      {/* Bottom Progress & Initialization Indicator */}
      <div className="w-full max-w-xs space-y-3 pb-4 z-10">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span className="truncate max-w-[200px] text-amber-200/90">{statusText}</span>
          <span className="font-bold text-amber-400">{progress}%</span>
        </div>

        {/* Shimmer Animated Progress Bar */}
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-400 transition-all duration-75 ease-out shadow-[0_0_8px_#f59e0b]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Security & Official Engine Tag */}
        <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-500 font-mono pt-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>v2.4.0 • Enterprise Vedic Engine</span>
        </div>
      </div>
    </div>
  );
}
