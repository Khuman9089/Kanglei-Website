'use client';

import React, { useState } from 'react';
import { X, Share2, Copy, Check, Sparkles, Download } from 'lucide-react';
import { BirthProfile, ZodiacSignInfo } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BirthProfile;
  zodiac: ZodiacSignInfo;
  headline?: string;
  insightText?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  profile,
  zodiac,
  headline = 'Cosmic Snapshot',
  insightText = 'Discovering my personalized astrology insights, vocational clarity, and life cycles on AstroVista!'
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appUrl = 'https://kuthiyengpham.in/astroai';
  const shareMessage = `✨ ${profile.name}'s ${zodiac.name} (${zodiac.symbol}) Astrology Snapshot on AstroVista: "${insightText}" — Explore your path: ${appUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xs transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-[#172554]">Share Your Reading</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Beautiful Shareable Card Artwork */}
        <div className="bg-gradient-to-tr from-[#0F172A] via-[#312E81] to-[#4C1D95] text-white p-5 rounded-2xl shadow-md space-y-3 relative overflow-hidden text-center">
          <div className="flex items-center justify-between text-xs text-indigo-200 border-b border-white/10 pb-2">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AstroVista
            </span>
            <span className="text-[10px] text-slate-300">Your Stars • Your Future</span>
          </div>

          <div className="py-2 space-y-1">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-3xl shadow-inner">
              {zodiac.symbol}
            </div>
            <h4 className="text-lg font-black text-white mt-1">
              {profile.name} • {zodiac.name}
            </h4>
            <span className="text-[11px] font-medium text-indigo-200 block">
              {zodiac.trait}
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 text-[11px] text-slate-200 leading-relaxed border border-white/10">
            &ldquo;{insightText}&rdquo;
          </div>

          <div className="pt-1 text-[9px] text-slate-300">
            Explore your personalized birth insights on AstroVista
          </div>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all"
            title="WhatsApp"
          >
            <span className="text-xl">💬</span>
            <span className="text-[10px] font-bold mt-1">WhatsApp</span>
          </button>

          <button
            onClick={handleTwitter}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all"
            title="X / Twitter"
          >
            <span className="text-xl">𝕏</span>
            <span className="text-[10px] font-bold mt-1">X</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all"
            title="Copy Link"
          >
            <Copy className="w-5 h-5 text-indigo-600" />
            <span className="text-[10px] font-bold mt-1">Copy</span>
          </button>

          <button
            onClick={() => {
              alert('Image snapshot generated! Long press or right click the card above to save.');
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-all"
            title="Save Image"
          >
            <Download className="w-5 h-5 text-purple-600" />
            <span className="text-[10px] font-bold mt-1">Save</span>
          </button>
        </div>

        {copied && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Link copied to clipboard!</span>
          </div>
        )}
      </div>
    </div>
  );
}
