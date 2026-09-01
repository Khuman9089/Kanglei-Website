'use client';

import React from 'react';
import { FileText, Download, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ReportCalloutBannersProps {
  onPrint: () => void;
}

export function ReportCalloutBanners({ onPrint }: ReportCalloutBannersProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-200/60">
      {/* BANNER 1: GET YOUR FULL KUNDLI AS A PDF */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fefce8] via-[#fffbeb] to-[#fef9c3] border-2 border-dashed border-[#fde047] shadow-xs flex flex-wrap items-center justify-between gap-3 text-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#fef08a] border border-[#facc15] flex flex-col items-center justify-center shadow-xs shrink-0">
            <FileText className="w-5 h-5 text-slate-900" />
            <span className="text-[8px] font-black text-amber-900 uppercase tracking-tighter">PDF</span>
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
              Get your full Kundli as a PDF
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Download every section — birth details, charts, dashas and predictions — in a single printable report.
            </p>
          </div>
        </div>

        <button
          onClick={onPrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#fef08a] text-slate-900 font-extrabold text-xs sm:text-sm border border-[#facc15] shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-slate-900" />
          <span>View PDF Report</span>
        </button>
      </div>

      {/* BANNER 2: DEEPER KUNDLI ANALYSIS (CHAT WITH ASTROLOGER) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-100/60 via-amber-50/80 to-emerald-100/60 border border-slate-200/80 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-white/90 border border-rose-200 shadow-xs flex items-center justify-center mx-auto text-xl">
          🔮
        </div>
        <div className="space-y-1.5 max-w-xl mx-auto">
          <h3 className="font-serif font-black text-xl sm:text-2xl text-[#b45309]">
            Want a deeper Kundli analysis?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            To know more about what your kundli says about your love, career, health and finance, consult our expert astrologers.
          </p>
        </div>

        <Link
          href="/astrologers"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#facc15] hover:bg-[#fde047] text-slate-900 font-extrabold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer mx-auto"
        >
          <MessageSquare className="w-4 h-4 text-slate-900" />
          <span>Chat with Astrologer</span>
          <ArrowRight className="w-4 h-4 text-slate-900" />
        </Link>
      </div>
    </div>
  );
}

export default ReportCalloutBanners;
