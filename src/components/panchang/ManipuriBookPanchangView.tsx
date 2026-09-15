'use client';

import React, { useState } from 'react';
import { ManipuriBookPanchangData } from '@/engine/manipuriPanchangBook';
import { toBengaliNumerals, toMeeteiNumerals } from '@/engine/manipuriCalendar';
import CircularJanmaChakra from './CircularJanmaChakra';
import BengaliChart, { BengaliPlanetInfo } from '@/components/charts/BengaliChart';
import {
  Printer,
  Copy,
  CheckCircle2,
  Sparkles,
  Table as TableIcon,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CalendarCheck,
  Check,
  X,
  Filter,
  AlertTriangle
} from 'lucide-react';

interface ManipuriBookPanchangViewProps {
  data: ManipuriBookPanchangData;
  script?: 'blipi' | 'bengali' | 'meetei';
}

function renderCellContent(
  val: number | string | undefined | null,
  script: 'blipi' | 'bengali' | 'meetei' = 'bengali'
): React.ReactNode {
  if (val === '' || val === undefined || val === null) {
    return <span className="opacity-0 select-none">-</span>;
  }
  if (val === '-') {
    return <span className="text-slate-400 dark:text-slate-500 font-bold">-</span>;
  }
  // Exceed 60 danda text mapping (Nu: / Numit, Chupna)
  if (val === 'নুমিৎ' || val === 'ꯅꯨꯃꯤꯠ' || val === 'nuim\\' || val === 'Numit') {
    if (script === 'bengali') return <span className="text-amber-800 dark:text-amber-400 font-bold">নুমিৎ</span>;
    if (script === 'meetei') return <span className="text-amber-800 dark:text-amber-400 font-bold">ꯅꯨꯃꯤꯠ</span>;
    if (script === 'blipi') return <span className="text-amber-800 dark:text-amber-400 font-bold font-blipi">nuim\</span>;
    return <span className="text-amber-800 dark:text-amber-400 font-bold">Numit</span>;
  }
  if (val === 'চুপ্না' || val === 'ꯆꯨꯞꯅꯥ' || val === 'cup_na' || val === 'Chupna') {
    if (script === 'bengali') return <span className="text-amber-800 dark:text-amber-400 font-bold">চুপ্না</span>;
    if (script === 'meetei') return <span className="text-amber-800 dark:text-amber-400 font-bold">ꯆꯨꯞꯅꯥ</span>;
    if (script === 'blipi') return <span className="text-amber-800 dark:text-amber-400 font-bold font-blipi">cup_na</span>;
    return <span className="text-amber-800 dark:text-amber-400 font-bold">Chupna</span>;
  }

  const num = typeof val === 'number' ? val : Number(val);
  if (!isNaN(num)) {
    if (script === 'bengali') return toBengaliNumerals(num);
    if (script === 'meetei') return toMeeteiNumerals(num);
    return num;
  }
  return String(val);
}

export default function ManipuriBookPanchangView({
  data,
  script = 'bengali',
}: ManipuriBookPanchangViewProps) {
  const [chakraStyle, setChakraStyle] = useState<'bengali' | 'circular'>('bengali');
  const [showThouramDetails, setShowThouramDetails] = useState(true);
  const [selectedThouramCategory, setSelectedThouramCategory] = useState<string>('ALL');
  const [copiedToast, setCopiedToast] = useState(false);

  const { header, astronomical, details } = data;
  const isBlipi = script === 'blipi';
  const isBengali = script === 'bengali';

  // Map planetary positions for traditional BengaliChart (Rashi Chakra used in other pages)
  const chartPlanets: BengaliPlanetInfo[] = astronomical.planets.map((p) => {
    const englishNameMap: Record<string, string> = {
      su: 'Sun',
      mo: 'Moon',
      ma: 'Mars',
      me: 'Mercury',
      ju: 'Jupiter',
      ve: 'Venus',
      sa: 'Saturn',
      ra: 'Rahu',
      ke: 'Ketu',
    };
    return {
      id: p.id,
      name: englishNameMap[p.id] || p.nameBengali,
      abbr: isBengali ? p.abbrBengali : (script === 'meetei' ? p.abbrMeetei : p.abbrBlipi),
      houseNumber: p.rashiIndex + 1,
      isRetrograde: false,
      signDegree: p.signDegree,
    };
  });

  const handleCopySummary = () => {
    const text = isBlipi
      ? `
=== kazEl AseT[aelajI mEnpurI p\\admika (${data.dateStr}) ===
lahIir AyaeMns: ${header.ayanamsa?.formattedBlipi || "24° 14' 26\""}
${header.fullHeaderBlipi}
${astronomical.sunriseBlipi} | ${astronomical.sunsetBlipi}
${astronomical.dayDurationBlipi}

${details.thaban.fullTextBlipi}
${details.nakshatra.fullTextBlipi}
${details.yoga.fullTextBlipi}
${details.karana.fullTextBlipi}
${details.chandraSuddhi.fullTextBlipi}
${details.dashaGanaVarna ? `${details.dashaGanaVarna.fullTextBlipi}\n` : ''}${details.amritaYoga.fullTextBlipi}
${details.mahendraYoga?.isAvailable ? `${details.mahendraYoga.fullTextBlipi}\n` : ''}${details.inauspiciousMuhurtas.fullTextBlipi}
${details.huChenbaMatam ? `${details.huChenbaMatam.fullTextBlipi}\n` : ''}${details.thadokkadaba ? `${details.thadokkadaba.fullTextBlipi}\n` : ''}${details.yogini ? `${details.yogini.fullTextBlipi}\n` : ''}${details.shraddhaKala ? `${details.shraddhaKala.fullTextBlipi}\n` : ''}${details.afabaThouram.fullTextBlipi}
      `.trim()
      : `
=== ${isBengali ? 'মণিপুরী পঞ্জিকা' : 'ꯃꯅꯤꯄꯨꯔꯤ ꯄꯟꯆꯥꯡ'} (${data.dateStr}) ===
${isBengali ? `লাহিড়ী অয়নাংশ: ${header.ayanamsa?.formattedBengali || '২৪° ১৪\' ২৬"'}` : `ꯂꯥꯍꯤꯔꯤ ꯑꯌꯅꯥꯡꯁ: ${header.ayanamsa?.formattedMeetei || '꯲꯴° ꯱꯴\' ꯲꯶"'}`}
${isBengali ? header.fullHeaderBengali : header.fullHeaderMeetei}
${isBengali ? astronomical.sunriseBengali : astronomical.sunriseMeetei} | ${isBengali ? astronomical.sunsetBengali : astronomical.sunsetMeetei}
${isBengali ? astronomical.dayDurationBengali : astronomical.dayDurationMeetei}

${isBengali ? details.thaban.fullTextBengali : details.thaban.fullTextMeetei}
${isBengali ? details.nakshatra.fullTextBengali : details.nakshatra.fullTextMeetei}
${isBengali ? details.yoga.fullTextBengali : details.yoga.fullTextMeetei}
${isBengali ? details.karana.fullTextBengali : details.karana.fullTextMeetei}
${isBengali ? details.chandraSuddhi.fullTextBengali : details.chandraSuddhi.fullTextMeetei}
${details.dashaGanaVarna ? (isBengali ? `${details.dashaGanaVarna.fullTextBengali}\n` : `${details.dashaGanaVarna.fullTextMeetei}\n`) : ''}${isBengali ? details.amritaYoga.fullTextBengali : details.amritaYoga.fullTextMeetei}
${details.mahendraYoga?.isAvailable ? (isBengali ? `${details.mahendraYoga.fullTextBengali}\n` : `${details.mahendraYoga.fullTextMeetei}\n`) : ''}${isBengali ? details.inauspiciousMuhurtas.fullTextBengali : details.inauspiciousMuhurtas.fullTextMeetei}
${details.huChenbaMatam ? (isBengali ? `${details.huChenbaMatam.fullTextBengali}\n` : `${details.huChenbaMatam.fullTextMeetei}\n`) : ''}${details.thadokkadaba ? (isBengali ? `${details.thadokkadaba.fullTextBengali}\n` : `${details.thadokkadaba.fullTextMeetei}\n`) : ''}${details.yogini ? (isBengali ? `${details.yogini.fullTextBengali}\n` : `${details.yogini.fullTextMeetei}\n`) : ''}${details.shraddhaKala ? (isBengali ? `${details.shraddhaKala.fullTextBengali}\n` : `${details.shraddhaKala.fullTextMeetei}\n`) : ''}${isBengali ? details.afabaThouram.fullTextBengali : details.afabaThouram.fullTextMeetei}
      `.trim();

    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span
              className={`text-xs font-bold text-slate-900 dark:text-slate-100 block ${
                isBlipi ? 'font-blipi text-sm' : ''
              }`}
            >
              {isBlipi
                ? 'mEnpurI p\\admika buk ivU (BLipi15 Font)'
                : isBengali
                ? 'মণিপুরী পঞ্জিকা বুক ভিউ'
                : 'ꯃꯅꯤꯄꯨꯔꯤ ꯄꯟꯆꯥꯡ ꯕꯨꯛ ꯚꯤꯎ'}
            </span>
            <span className="text-[10px] text-slate-500">
              Authentic Manipuri Almanac Page & Excel Kuthi_Preparation Sheet (BLipi15 Typeset)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy Text Summary"
          >
            {copiedToast ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-xs hover:opacity-95 shadow-xs flex items-center gap-1.5 transition-opacity cursor-pointer"
            title="Print this Page"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         AUTHENTIC MANIPURI PANCHANG BOOK SHEET (Paper Replica)
         Fully Styled with BLipi15 Font / Traditional Book Look
         ───────────────────────────────────────────────────────────── */}
      <div
        className={`bg-[#fffdfa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-2 border-slate-800 dark:border-slate-700 shadow-xl rounded-md p-4 sm:p-7 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none ${
          isBlipi ? 'font-blipi' : 'font-serif'
        }`}
      >
        {/* Inner Vintage Border Frame */}
        <div className="border border-slate-800/80 dark:border-slate-700/80 p-3 sm:p-5 space-y-4">
          {/* Sheet Top Book Header Title / Location / Sakabda */}
          <div
            className={`flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 border-b border-slate-300 dark:border-slate-800 pb-1.5 ${
              isBlipi ? 'font-blipi text-sm' : 'font-sans text-[11px]'
            }`}
          >
            <span>
              {isBlipi
                ? 'kazEl AseT[aelajI mEnpurI p\\admika'
                : isBengali
                ? 'কাংলৈ এস্ট্রোলজি মণিপুরী পঞ্জিকা'
                : 'ꯀꯥꯡꯂꯩ ꯑꯦꯁ꯭ꯇ꯭ꯔꯣꯂꯣꯖꯤ ꯃꯅꯤꯄꯨꯔꯤ ꯄꯟꯆꯥꯡ'}
            </span>
            <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
              {isBlipi ? 'h~mfal, mEnpur' : data.locationName}
            </span>
            <span>
              {isBlipi
                ? header.sakabdaBlipi
                : isBengali
                ? `শকাব্দ ${header.sakabda}`
                : `ꯁꯀꯥꯕ꯭ꯗ ${header.sakabda}`}
            </span>
          </div>

          {/* ──────────────── AYANAMSA BAR (ABOVE DATE BANNER) ──────────────── */}
          <div className="flex items-center justify-center gap-2 py-1 px-3 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300/80 dark:border-amber-700/60 rounded-md text-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span
              className={`text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 tracking-wide ${
                isBlipi ? 'font-blipi text-sm' : ''
              }`}
            >
              {isBlipi
                ? `lahIir AyaeMns: ${header.ayanamsa?.formattedBlipi || "24° 14' 26\""}`
                : isBengali
                ? `লাহিড়ী অয়নাংশ: ${header.ayanamsa?.formattedBengali || '২৪° ১৪\' ২৬"'}`
                : `ꯂꯥꯍꯤꯔꯤ ꯑꯌꯅꯥꯡꯁ: ${header.ayanamsa?.formattedMeetei || '꯲꯴° ꯱꯴\' ꯲꯶"'}`}
            </span>
          </div>

          {/* ──────────────── HEADER BANNER ──────────────── */}
          <div className="text-center border-b-2 border-slate-800 dark:border-slate-700 pb-3 pt-1">
            <h2
              className={`leading-snug text-slate-950 dark:text-amber-200 font-bold ${
                isBlipi
                  ? 'font-blipi text-base sm:text-lg md:text-xl tracking-wide'
                  : 'text-sm sm:text-base md:text-lg font-serif'
              }`}
            >
              {isBlipi
                ? header.fullHeaderBlipi
                : isBengali
                ? header.fullHeaderBengali
                : header.fullHeaderMeetei}
            </h2>
          </div>

          {/* ──────────────── 2-COLUMN BOOK BODY ──────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1">
            {/* ───── LEFT COLUMN: ASTRONOMICAL, 5x3 TABLE, PLANETS & WHEEL ───── */}
            <div className="md:col-span-5 space-y-4 md:border-r md:border-slate-800/80 dark:md:border-slate-700/80 md:pr-4">
              {/* Astronomical Timings */}
              <div
                className={`space-y-1 text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-relaxed ${
                  isBlipi ? 'font-blipi text-sm' : 'font-mono'
                }`}
              >
                <div>
                  {isBlipi
                    ? astronomical.sunriseBlipi
                    : isBengali
                    ? astronomical.sunriseBengali
                    : astronomical.sunriseMeetei}
                </div>
                <div>
                  {isBlipi
                    ? astronomical.sunsetBlipi
                    : isBengali
                    ? astronomical.sunsetBengali
                    : astronomical.sunsetMeetei}
                </div>
                <div>
                  {isBlipi
                    ? astronomical.dayDurationBlipi
                    : isBengali
                    ? astronomical.dayDurationBengali
                    : astronomical.dayDurationMeetei}
                </div>
                <div>
                  {isBlipi
                    ? astronomical.nightDurationBlipi
                    : isBengali
                    ? astronomical.nightDurationBengali
                    : astronomical.nightDurationMeetei}
                </div>
                <div>
                  {isBlipi
                    ? astronomical.lagnaRise.formattedBlipi
                    : isBengali
                    ? astronomical.lagnaRise.formattedBengali
                    : astronomical.lagnaRise.formattedMeetei}
                </div>
                <div>
                  {isBlipi
                    ? astronomical.lagnaSet.formattedBlipi
                    : isBengali
                    ? astronomical.lagnaSet.formattedBengali
                    : astronomical.lagnaSet.formattedMeetei}
                </div>
              </div>

              {/* 3x8 NUMERICAL TABLE (8 Rows x 3 Columns: 1 to 24) */}
              <div className="pt-2 border-t border-slate-300 dark:border-slate-800">
                <div className="overflow-hidden rounded-md border border-slate-300 dark:border-slate-700 bg-amber-50/15 dark:bg-slate-900/30 shadow-2xs">
                  <table
                    className={`w-full table-fixed text-center select-text ${
                      isBlipi ? 'font-blipi font-bold text-base' : 'font-mono font-bold text-xs sm:text-sm tracking-wide'
                    }`}
                  >
                    <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
                      {astronomical.numericalTable.rows.map((row, idx) => (
                        <tr
                          key={`num-row-${idx}`}
                          className="hover:bg-amber-100/30 dark:hover:bg-amber-950/20 transition-colors"
                        >
                          <td className="w-1/3 py-1 px-1 sm:px-2 border-r border-slate-200/80 dark:border-slate-800/80 text-center truncate">
                            {renderCellContent(row.danda, script)}
                          </td>
                          <td className="w-1/3 py-1 px-1 sm:px-2 border-r border-slate-200/80 dark:border-slate-800/80 text-center truncate">
                            {renderCellContent(row.pal, script)}
                          </td>
                          <td className="w-1/3 py-1 px-1 sm:px-2 text-center truncate">
                            {renderCellContent(row.bipal, script)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sun & Moon Rashi Position */}
              <div
                className={`pt-2 border-t border-slate-300 dark:border-slate-800 text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-relaxed ${
                  isBlipi ? 'font-blipi text-sm' : ''
                }`}
              >
                <div>
                  {isBlipi
                    ? astronomical.rabiPadaStrBlipi
                    : isBengali
                    ? astronomical.rabiPadaStrBengali
                    : astronomical.rabiPadaStrMeetei}
                </div>
                <div className="pt-1">
                  {isBlipi
                    ? astronomical.chandraTransitBlipi
                    : isBengali
                    ? astronomical.chandraTransitBengali
                    : astronomical.chandraTransitMeetei}
                </div>
              </div>

              {/* 9 Graha Longitudes (Degrees, Minutes, Seconds) */}
              <div className="pt-2 border-t border-slate-300 dark:border-slate-800 space-y-1 text-xs text-slate-900 dark:text-slate-100">
                <div
                  className={`text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ${
                    isBlipi ? 'font-blipi text-xs' : 'font-sans'
                  }`}
                >
                  {isBlipi
                    ? 'g[h Sf<t (Planetary Coordinates - qw.xlsm)'
                    : isBengali
                    ? 'গ্রহ স্ফুট (Planetary Coordinates)'
                    : 'ꯒ꯭ꯔꯍ ꯁ꯭ꯐꯨꯠ'}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {astronomical.planets.map((p) => {
                    const label = isBlipi
                      ? `${p.abbrBlipi} (${p.nakshatraIndex})`
                      : `${isBengali ? p.abbrBengali : p.abbrMeetei} (${
                          isBengali
                            ? toBengaliNumerals(p.nakshatraIndex)
                            : toMeeteiNumerals(p.nakshatraIndex)
                        })`;
                    const degText = isBlipi
                      ? p.degreeStrBlipi
                      : isBengali
                      ? p.degreeStrBengali
                      : p.degreeStrMeetei;

                    const statusSuffix = isBlipi
                      ? p.statusSuffixBlipi
                      : isBengali
                      ? p.statusSuffixBengali
                      : p.statusSuffixMeetei;

                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between text-xs py-0.5 border-b border-slate-100 dark:border-slate-900 ${
                          isBlipi ? 'font-blipi text-sm' : 'font-mono'
                        }`}
                      >
                        <span className="font-bold text-amber-800 dark:text-amber-400">{label}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {degText} {isBlipi ? '|' : '।'}{statusSuffix ? ` ${statusSuffix}` : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rashi Chakra / Janma Chakra (Traditional Bengali Chart used in other pages) */}
              <div className="pt-3 border-t border-slate-800 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {isBengali ? 'জন্ম চক্র (রাশি চক্র)' : (isBlipi ? 'jnm c@_' : 'ꯖꯟꯃ ꯆꯛꯔ')}
                  </span>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setChakraStyle('bengali')}
                      className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                        chakraStyle === 'bengali'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                      title="Traditional Bengali Rashi Chakra (Same as Kundli & Workstation pages)"
                    >
                      {isBengali ? 'রাশি চক্র' : 'Rashi Chart'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChakraStyle('circular')}
                      className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                        chakraStyle === 'circular'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                      title="Circular Wheel replica from book photo"
                    >
                      {isBengali ? 'গোলাকার' : 'Wheel'}
                    </button>
                  </div>
                </div>

                {chakraStyle === 'bengali' ? (
                  <div className="w-full flex justify-center py-1">
                    <BengaliChart
                      planets={chartPlanets}
                      ascendantSign={astronomical.lagnaRise.rashiIndex}
                      title={isBengali ? 'জন্ম চক্র' : (isBlipi ? 'jnm c@_' : 'ꯖꯟꯃ ꯆꯛꯔ')}
                      theme="light"
                      script={script}
                      className="w-full bg-[#fffdfa] border-slate-800/80 shadow-2xs"
                    />
                  </div>
                ) : (
                  <div className="w-full flex justify-center py-1">
                    <CircularJanmaChakra
                      chakraHouses={astronomical.chakraRashiHouses}
                      script={script}
                      size={240}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ───── RIGHT COLUMN: DETAILED ASTROLOGICAL PROSE ───── */}
            <div
              className={`md:col-span-7 space-y-3.5 text-xs sm:text-[13px] text-slate-900 dark:text-slate-100 leading-relaxed ${
                isBlipi ? 'font-blipi text-sm sm:text-[15px]' : 'font-serif'
              }`}
            >
              {/* 1. Thaban (Tithi) */}
              <div className="p-2.5 bg-amber-50/40 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-amber-900 dark:text-amber-400">
                  {isBlipi ? 'Taban:' : isBengali ? 'থাবান:' : 'ꯊꯕꯥꯟ:'}
                </span>{' '}
                <span>
                  {isBlipi
                    ? details.thaban.fullTextBlipi.replace(/^Taban: -\s*/, '')
                    : isBengali
                    ? details.thaban.fullTextBengali.replace(/^থাবান: -\s*/, '')
                    : details.thaban.fullTextMeetei.replace(/^ꯊꯕꯥꯟ: -\s*/, '')}
                </span>
              </div>

              {/* 2. Nakshatra */}
              <div>
                <span className="font-bold text-slate-950 dark:text-white">
                  {isBlipi ? 'Twanimcak:' : isBengali ? 'নক্ষত্র:' : 'ꯅꯛꯁꯇ꯭ꯔ:'}
                </span>{' '}
                <span>
                  {isBlipi
                    ? details.nakshatra.fullTextBlipi.replace(/^Twanimcak: -\s*/, '')
                    : isBengali
                    ? details.nakshatra.fullTextBengali.replace(/^নক্ষত্র: -\s*/, '')
                    : details.nakshatra.fullTextMeetei.replace(/^ꯅꯛꯁꯇ꯭ꯔ: -\s*/, '')}
                </span>
              </div>

              {/* 3. Yoga */}
              <div>
                <span className="font-bold text-slate-950 dark:text-white">
                  {isBlipi ? 'Eyaeg:' : isBengali ? 'যোগ:' : 'ꯌꯣꯒ:'}
                </span>{' '}
                <span>
                  {isBlipi
                    ? details.yoga.fullTextBlipi.replace(/^Eyaeg: -\s*/, '')
                    : isBengali
                    ? details.yoga.fullTextBengali.replace(/^যোগ: -\s*/, '')
                    : details.yoga.fullTextMeetei.replace(/^ꯌꯣꯒ: -\s*/, '')}
                </span>
              </div>

              {/* 4. Karana */}
              <div>
                <span className="font-bold text-slate-950 dark:text-white">
                  {isBlipi ? 'krx:' : isBengali ? 'করণ:' : 'ꯀꯔꯟ:'}
                </span>{' '}
                <span>
                  {isBlipi
                    ? details.karana.fullTextBlipi.replace(/^krx: -\s*/, '')
                    : isBengali
                    ? details.karana.fullTextBengali.replace(/^করণ: -\s*/, '')
                    : details.karana.fullTextMeetei.replace(/^ꯀꯔꯟ: -\s*/, '')}
                </span>
              </div>

              {/* 5. Chandra Suddhi & Ghata Chandra */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-amber-900 dark:text-amber-400">
                  {isBlipi ? 'cnd[suidD:' : isBengali ? 'চন্দ্রশুদ্ধি:' : 'ꯆꯟꯗ꯭ꯔꯁꯨꯗ꯭ꯙꯤ:'}
                </span>{' '}
                <span>
                  {isBlipi
                    ? details.chandraSuddhi.fullTextBlipi.replace(/^cnd\[suidD:\s*(-\s*)?/, '')
                    : isBengali
                    ? details.chandraSuddhi.fullTextBengali.replace(/^চন্দ্রশুদ্ধি:\s*(-\s*)?/, '')
                    : details.chandraSuddhi.fullTextMeetei.replace(/^ꯆꯟꯗ꯭ꯔꯁꯨꯗ꯭ꯙꯤ:\s*(-\s*)?/, '')}
                </span>
              </div>

              {/* 6. Dasha, Gana, Varna */}
              <div>
                <span className="font-bold text-slate-950 dark:text-white">
                  {isBlipi ? 'dSa AzS:' : isBengali ? 'দশা অংশ:' : 'ꯗꯁꯥ ꯑꯡꯁ:'}
                </span>{' '}
                <span>
                  {isBlipi
                    ? details.dashaGanaVarna.fullTextBlipi.replace(/^dSa AzS:\s*(-\s*)?/, '')
                    : isBengali
                    ? details.dashaGanaVarna.fullTextBengali.replace(/^দশা অংশ:\s*(-\s*)?/, '')
                    : details.dashaGanaVarna.fullTextMeetei.replace(/^ꯗꯁꯥ ꯑꯡꯁ:\s*(-\s*)?/, '')}
                </span>
              </div>

              {/* 7. Amrita Yoga */}
              <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                <span className="font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {isBlipi
                      ? 'Am<t Eyaeg (Afba mtm):'
                      : isBengali
                      ? 'অমৃতযোগ (শুভ সময়):'
                      : 'ꯑꯃ꯭ꯔꯤꯇꯌꯣꯒ (ꯑꯐꯕ ꯃꯇꯝ):'}
                  </span>
                </span>
                <span className="text-emerald-950 dark:text-emerald-200 font-medium">
                  {isBlipi
                    ? details.amritaYoga.fullTextBlipi.replace(/^Am<t Eyaeg:\s*(-\s*)?/, '')
                    : isBengali
                    ? details.amritaYoga.fullTextBengali.replace(/^অমৃতযোগ:\s*(-\s*)?/, '')
                    : details.amritaYoga.fullTextMeetei.replace(/^ꯑꯃ꯭ꯔꯤꯇꯌꯣꯒ:\s*(-\s*)?/, '')}
                </span>
              </div>

              {/* 7b. Mahendra Yoga (placed below Amrita Yoga when available) */}
              {details.mahendraYoga && details.mahendraYoga.isAvailable && (
                <div className="p-2.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/40">
                  <span className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>
                      {isBlipi
                        ? 'maEhnd[ Eyaeg (Afba mtm):'
                        : isBengali
                        ? 'মাহেন্দ্রযোগ (শুভ সময়):'
                        : 'ꯃꯥꯍꯦꯟꯗ꯭ꯔꯌꯣꯒ (ꯑꯐꯕ ꯃꯇꯝ):'}
                    </span>
                  </span>
                  <span className="text-amber-950 dark:text-amber-200 font-medium">
                    {isBlipi
                      ? details.mahendraYoga.fullTextBlipi.replace(/^maEhnd\[ Eyaeg:\s*(-\s*)?/, '')
                      : isBengali
                      ? details.mahendraYoga.fullTextBengali.replace(/^মাহেন্দ্রযোগ:\s*(-\s*)?/, '')
                      : details.mahendraYoga.fullTextMeetei.replace(/^ꯃꯥꯍꯦꯟꯗ꯭ꯔꯌꯣꯒ:\s*(-\s*)?/, '')}
                  </span>
                </div>
              )}

              {/* 8. Barabela, Kalabela, Kalaratri */}
              <div className="p-2.5 bg-rose-50/40 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900/40 space-y-1">
                <div className="text-[11px] font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
                  {isBlipi
                    ? 'Asuv barEbela Amsuz kalEbela'
                    : isBengali
                    ? 'অশুভ বারবেলা ও কালবেলা'
                    : 'ꯑꯁꯨꯚ ꯕꯥꯔꯕꯦꯂꯥ ꯑꯃꯁꯨꯡ ꯀꯥꯂꯕꯦꯂꯥ'}
                </div>
                <div>
                  <span className="font-bold text-rose-900 dark:text-rose-300">
                    {isBlipi ? 'barEbela:' : isBengali ? 'বারবেলা:' : 'ꯕꯥꯔꯕꯦꯂꯥ:'}
                  </span>{' '}
                  <span className="text-rose-950 dark:text-rose-200">
                    {isBlipi
                      ? details.inauspiciousMuhurtas.barabelaBlipi
                      : isBengali
                      ? details.inauspiciousMuhurtas.barabelaBengali
                      : details.inauspiciousMuhurtas.barabelaMeetei}
                    {isBlipi ? '|' : '।'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-rose-900 dark:text-rose-300">
                    {isBlipi ? 'kalEbela:' : isBengali ? 'কালবেলা:' : 'ꯀꯥꯂꯕꯦꯂꯥ:'}
                  </span>{' '}
                  <span className="text-rose-950 dark:text-rose-200">
                    {isBlipi
                      ? details.inauspiciousMuhurtas.kalabelaBlipi
                      : isBengali
                      ? details.inauspiciousMuhurtas.kalabelaBengali
                      : details.inauspiciousMuhurtas.kalabelaMeetei}
                    {isBlipi ? '|' : '।'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-rose-900 dark:text-rose-300">
                    {isBlipi ? 'kalrai@_:' : isBengali ? 'কালরাত্রি:' : 'ꯀꯥꯂꯔꯥꯇ꯭ꯔꯤ:'}
                  </span>{' '}
                  <span className="text-rose-950 dark:text-rose-200">
                    {isBlipi
                      ? details.inauspiciousMuhurtas.kalaratriBlipi
                      : isBengali
                      ? details.inauspiciousMuhurtas.kalaratriBengali
                      : details.inauspiciousMuhurtas.kalaratriMeetei}
                    {isBlipi ? '|' : '।'}
                  </span>
                </div>
              </div>

              {/* 8b. Hu Chenba Matam (Inauspicious Bad Timings / Toxic Period) */}
              {details.huChenbaMatam && (
                <div className="p-2.5 bg-red-50/50 dark:bg-red-950/25 rounded-lg border border-red-200 dark:border-red-900/40 space-y-1">
                  <div className="text-[11px] font-bold text-red-800 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    <span>
                      {isBlipi
                        ? 'hu Eenba mtm (Asuv mtm): -'
                        : isBengali
                        ? 'হু চেন্বা মতম (অশুভ সময়): -'
                        : 'ꯍꯨ ꯆꯦꯟꯕ ꯃꯇꯝ (ꯑꯁꯨꯚ ꯃꯇꯝ): -'}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-red-900 dark:text-red-300">
                      {isBlipi ? 'raHkal:' : isBengali ? 'রাহুকাল:' : 'ꯔꯥꯍꯨꯀꯥꯜ:'}
                    </span>{' '}
                    <span className="text-red-950 dark:text-red-200">
                      {isBlipi
                        ? details.huChenbaMatam.rahuKaalBlipi
                        : isBengali
                        ? details.huChenbaMatam.rahuKaalBengali
                        : details.huChenbaMatam.rahuKaalMeetei}
                      {isBlipi ? '|' : '।'}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-red-900 dark:text-red-300">
                      {isBlipi ? 'hu Eenba (biSGtI):' : isBengali ? 'হু চেন্বা (বিষঘটী):' : 'ꯍꯨ ꯆꯦꯟꯕ (ꯕꯤꯁꯘꯇꯤ):'}
                    </span>{' '}
                    <span className="text-red-950 dark:text-red-200">
                      {isBlipi
                        ? details.huChenbaMatam.vishaGhatiBlipi
                        : isBengali
                        ? details.huChenbaMatam.vishaGhatiBengali
                        : details.huChenbaMatam.vishaGhatiMeetei}
                      {isBlipi ? '|' : '।'}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-red-900 dark:text-red-300">
                      {isBlipi ? 'ymgNd:' : isBengali ? 'যমগণ্ড:' : 'ꯌꯃꯒꯟꯗ:'}
                    </span>{' '}
                    <span className="text-red-950 dark:text-red-200">
                      {isBlipi
                        ? details.huChenbaMatam.yamagandaBlipi
                        : isBengali
                        ? details.huChenbaMatam.yamagandaBengali
                        : details.huChenbaMatam.yamagandaMeetei}
                      {isBlipi ? '|' : '।'}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-red-900 dark:text-red-300">
                      {isBlipi ? 'guilk kal:' : isBengali ? 'গুলিক কাল:' : 'ꯒꯨꯂꯤꯀ ꯀꯥꯜ:'}
                    </span>{' '}
                    <span className="text-red-950 dark:text-red-200">
                      {isBlipi
                        ? details.huChenbaMatam.gulikaKaalBlipi
                        : isBengali
                        ? details.huChenbaMatam.gulikaKaalBengali
                        : details.huChenbaMatam.gulikaKaalMeetei}
                      {isBlipi ? '|' : '।'}
                    </span>
                  </div>
                </div>
              )}

              {/* 9. Thadokkadaba (Taboo / Warnings) */}
              <div>
                <span className="font-bold text-slate-950 dark:text-white">
                  {isBlipi ? 'Tadokkdba:' : isBengali ? 'থাদোক্কদবা:' : 'ꯊꯥꯗꯣꯛꯀꯗꯕ:'}
                </span>{' '}
                <span>
                  {isBlipi
                    ? details.thadokkadaba.fullTextBlipi.replace(/^Tadokkdba:?\s*-?\s*/, '')
                    : isBengali
                    ? details.thadokkadaba.fullTextBengali.replace(/^থাদোক্কদবা:?\s*-?\s*/, '')
                    : details.thadokkadaba.fullTextMeetei.replace(/^ꯊꯥꯗꯣꯛꯀꯗꯕ:?\s*-?\s*/, '')}
                </span>
              </div>

              {/* 10. Yogini Direction */}
              <div>
                <span className="font-bold text-slate-950 dark:text-white">
                  {isBlipi ? 'EyaignI:' : isBengali ? 'যোগিনী:' : 'ꯌꯣꯒꯤꯅꯤ:'}
                </span>{' '}
                <span>
                  {isBlipi
                    ? details.yogini.fullTextBlipi.replace(/^EyaignI:?\s*-?\s*/, '')
                    : isBengali
                    ? details.yogini.fullTextBengali.replace(/^যোগিনী:?\s*-?\s*/, '')
                    : details.yogini.fullTextMeetei.replace(/^ꯌꯣꯒꯤꯅꯤ:?\s*-?\s*/, '')}
                </span>
              </div>

              {/* 11. Shraddha Kala */}
              <div>
                <span className="font-bold text-slate-950 dark:text-white">
                  {isBlipi ? 'S[aD`kal:' : isBengali ? 'শ্রাদ্ধকাল:' : 'ꯁ꯭ꯔꯥꯗ꯭ꯙꯀꯥꯜ:'}
                </span>{' '}
                <span>
                  {isBlipi
                    ? details.shraddhaKala.fullTextBlipi.replace(/^S\[aD`kal:?\s*-?\s*/, '')
                    : isBengali
                    ? details.shraddhaKala.fullTextBengali.replace(/^শ্রাদ্ধকাল:?\s*-?\s*/, '')
                    : details.shraddhaKala.fullTextMeetei.replace(/^ꯁ꯭ꯔꯥꯗ꯭ꯙꯀꯥꯜ:?\s*-?\s*/, '')}
                </span>
              </div>
            </div>
          </div>

          {/* ──────────────── BOTTOM BLOCK: AFABA THOURAM (AUSPICIOUS ACTIVITIES) ──────────────── */}
          <div
            className={`border-t-2 border-slate-800 dark:border-slate-700 pt-3 leading-relaxed text-slate-900 dark:text-slate-100 ${
              isBlipi ? 'font-blipi text-sm sm:text-[15px]' : 'font-serif text-xs sm:text-[13px]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-900 dark:text-amber-400">
                  {isBlipi
                    ? 'Afba ETarm (Afba Tbk To_rm):'
                    : isBengali
                    ? 'অফবা থৌরম (শুভ অনুষ্ঠান ও কর্ম):'
                    : 'ꯑꯐꯕ ꯊꯧꯔꯝ (ꯁꯨꯚ ꯑꯅꯨꯁ꯭ꯊꯥꯟ ꯑꯃꯁꯨꯡ ꯊꯕꯛ):'}
                </span>
              </div>

              {details.afabaThouram.evaluation && (
                <button
                  type="button"
                  onClick={() => setShowThouramDetails(!showThouramDetails)}
                  className="shrink-0 self-start sm:self-auto px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-sans text-[11px] font-bold border border-amber-300 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs print:hidden"
                  title="View detailed life ritual rules (Chakumba, Luhongba, Dukan Hangba, Graha Puja, etc.)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    {showThouramDetails
                      ? isBengali ? 'সংক্ষেপ করুন' : 'Hide Registry'
                      : isBengali ? `শুভ কর্ম নির্দেশিকা (${details.afabaThouram.evaluation.evaluatedRites?.length || 22}টি অনুষ্ঠান)` : 'Subha Karma Registry'}
                  </span>
                  {showThouramDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* ───── GRAHA PUJA AVAILABILITY STRIP ───── */}
            {details.afabaThouram.grahaPuja && (
              <div
                className={`mt-2.5 flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs sm:text-[13px] transition-all shadow-2xs ${
                  details.afabaThouram.grahaPuja.isAvailable
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      details.afabaThouram.grahaPuja.isAvailable
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span>
                    {isBlipi
                      ? `g/h puja: ${details.afabaThouram.grahaPuja.statusBlipi}`
                      : isBengali
                      ? `গ্রহ পূজা: ${details.afabaThouram.grahaPuja.statusBengali}`
                      : `ꯒ꯭ꯔꯍ ꯄꯨꯖꯥ: ${details.afabaThouram.grahaPuja.statusMeetei}`}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
                  <span className="opacity-90 font-medium">
                    {isBlipi
                      ? details.afabaThouram.grahaPuja.reasonBlipi
                      : isBengali
                      ? details.afabaThouram.grahaPuja.reasonBengali
                      : details.afabaThouram.grahaPuja.reasonMeetei}
                  </span>

                  {details.afabaThouram.grahaPuja.isAvailable && details.afabaThouram.grahaPuja.timeWindowBengali && (
                    <span className="font-bold underline decoration-emerald-500 ml-auto">
                      {isBlipi
                        ? `(${details.afabaThouram.grahaPuja.timeWindowBlipi})`
                        : isBengali
                        ? `(${details.afabaThouram.grahaPuja.timeWindowBengali})`
                        : `(${details.afabaThouram.grahaPuja.timeWindowMeetei})`}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ───── INTERACTIVE SUBHA KARMA REGISTRY EXPLORER ───── */}
            {showThouramDetails && details.afabaThouram.evaluation && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 font-sans space-y-3 print:hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <CalendarCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>শুভ কর্ম ও সংস্কার নির্দেশিকা (Real-Time Subha Karma Engine)</span>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                    {[
                      { id: 'ALL', label: isBengali ? 'সব' : 'All' },
                      { id: 'Sanskara', label: isBengali ? 'সংস্কার' : 'Sanskara' },
                      { id: 'Property', label: isBengali ? 'গৃহ ও সম্পত্তি' : 'Property' },
                      { id: 'Commerce', label: isBengali ? 'বাণিজ্য' : 'Commerce' },
                      { id: 'Spiritual', label: isBengali ? 'ধর্মীয়' : 'Spiritual' },
                      { id: 'Health', label: isBengali ? 'চিকিৎসা' : 'Health' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedThouramCategory(cat.id)}
                        className={`px-2 py-0.5 rounded-full font-bold cursor-pointer transition-all ${
                          selectedThouramCategory === cat.id
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rituals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {details.afabaThouram.evaluation.evaluatedRites
                    .filter(
                      (item) =>
                        selectedThouramCategory === 'ALL' ||
                        item.rule.category === selectedThouramCategory
                    )
                    .map((item) => {
                      const isRec = item.status === 'RECOMMENDED';
                      const isPerm = item.status === 'PERMISSIBLE';
                      const isDis = item.status === 'INELIGIBLE';

                      return (
                        <div
                          key={item.rule.id}
                          className={`p-2.5 rounded-lg border text-xs transition-all space-y-1 ${
                            isRec
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                              : isPerm
                              ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50'
                              : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {isBengali
                                ? item.rule.nameBengali
                                : script === 'meetei'
                                ? item.rule.nameMeetei
                                : item.rule.nameEnglish}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shrink-0 ${
                                isRec
                                  ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                                  : isPerm
                                  ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {isRec
                                ? isBengali ? 'শুভ (উত্তম)' : 'Recommended'
                                : isPerm
                                ? isBengali ? 'চলনশীল' : 'Permissible'
                                : isBengali ? 'বর্জনীয়' : 'Ineligible'}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1 font-mono">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {isBengali ? 'শুভ সময়:' : 'Window:'}
                            </span>
                            <span>
                              {isBengali
                                ? item.timeWindowBengali
                                : script === 'meetei'
                                ? item.timeWindowMeetei
                                : item.timeWindowBlipi}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                            {item.rule.notes}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
