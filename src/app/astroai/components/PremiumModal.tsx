'use client';

import React from 'react';
import { X, Check, Sparkles, Crown, ArrowRight, ShieldCheck, Download, Layers } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export function PremiumModal({ isOpen, onClose, onUpgrade }: PremiumModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xs transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-[#172554]">AstroVista Premium</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-tr from-[#0F172A] via-[#312E81] to-[#4C1D95] rounded-2xl p-5 text-white text-center space-y-2 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-amber-300 shadow-md">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h4 className="text-xl font-black text-white">Unlock Deeper Insights</h4>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            Upgrade to full Vedic sidereal calculations, multi-year timelines, AI consulting, and detailed chart synthesis.
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div className="space-y-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
            What is Included
          </span>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
            {[
              { name: 'DOB-Based Quick Insights', free: true, prem: true },
              { name: 'Core Numerology & Life Path', free: true, prem: true },
              { name: 'Basic Yearly & Daily Readings', free: true, prem: true },
              { name: 'Detailed Birth Chart (Kundli & Houses)', free: false, prem: true },
              { name: 'Ask AstroGuru AI Assistant (Unlimited)', free: false, prem: true },
              { name: 'Full 12-Month Extended Transits', free: false, prem: true },
              { name: 'Unlimited Profiles (Family & Friends)', free: false, prem: true },
              { name: 'Export & Download PDF Reports', free: false, prem: true },
              { name: '100% Ad-Free Clean Interface', free: false, prem: true },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-white">
                <span className="text-[#172554] font-medium text-xs">{item.name}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`w-5 text-center ${item.free ? 'text-emerald-600 font-bold' : 'text-slate-300'}`}>
                    {item.free ? '✓' : '—'}
                  </span>
                  <span className="w-5 text-center text-indigo-600 font-bold">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing / CTA */}
        <div className="pt-2 space-y-3 text-center">
          <div className="bg-indigo-50/70 rounded-2xl p-3 border border-indigo-100 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-indigo-700 block">Annual Access</span>
              <p className="text-sm font-black text-[#172554]">₹999 / year <span className="text-[10px] font-normal text-slate-500">(₹83/mo)</span></p>
            </div>
            <span className="px-2 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px]">
              Save 60%
            </span>
          </div>

          <button
            onClick={() => {
              if (onUpgrade) onUpgrade();
              alert('AstroVista Premium unlocked for demo testing!');
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Upgrade to Premium</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="text-xs text-[#64748B] hover:text-[#172554] font-medium transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
