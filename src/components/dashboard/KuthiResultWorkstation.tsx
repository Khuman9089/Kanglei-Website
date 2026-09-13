'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Copy,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Compass,
  Sparkles,
  Sun,
  Moon,
  X,
  Share2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Flame,
  Award,
  RotateCcw,
  Calculator,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import resultTemplates from '@/data/kuthiResultTemplates.json';
import { calculatePlanetaryPositions } from '@/engine/ephemeris';
import { calculateVimshottariDasha, getCurrentDasha } from '@/engine/dashas';
import { calculateExactAge } from '@/components/dashboard/VedicWorkstation';

interface KuthiResultWorkstationProps {
  initialData?: {
    name?: string;
    dob?: string;
    tob?: string;
    day?: string;
    pob?: string;
    gender?: 'male' | 'female';
  };
  theme?: 'dark' | 'light';
  onClose?: () => void;
}

// 3 Tabs matching user request: Meitei Mayek, Sanamahi, Hinduism
export type ResultTabType = 'Meitei Mayek' | 'Sanamahi' | 'Hinduism';

const SHEET_MAP: Record<ResultTabType, string> = {
  'Meitei Mayek': 'MM_Result_M',
  'Sanamahi': 'Meetei_Result',
  'Hinduism': 'Result',
};

// Manipuri Weekdays in English, Bengali, Meetei Mayek
const WEEKDAY_MAP: Record<number, { en: string; bn: string; mm: string }> = {
  0: { en: 'Sunday', bn: 'রবিবার', mm: 'noZmaIjiz' },
  1: { en: 'Monday', bn: 'সোমবার', mm: 'niZHoUkaba' },
  2: { en: 'Tuesday', bn: 'মঙ্গলবার', mm: 'lEpaKpa' },
  3: { en: 'Wednesday', bn: 'বুধবার', mm: 'yuMskEs' },
  4: { en: 'Thursday', bn: 'বৃহস্পতিবার', mm: 'sgoLseN' },
  5: { en: 'Friday', bn: 'শুক্রবার', mm: 'IraI' },
  6: { en: 'Saturday', bn: 'শনিবার', mm: 'YaZja' },
};

// Rashi Names mapped to Meetei Mayek / Budha font and Bengali
const RASHI_DISPLAY: Record<number, { en: string; mm: string; blipi: string }> = {
  1: { en: 'Aries', mm: 'mes (mE taI|)', blipi: 'EmF ╠E~m tah~|²' },
  2: { en: 'Taurus', mm: 'bis (mE taI|)', blipi: 'b<F ╠E~m tah~|²' },
  3: { en: 'Gemini', mm: 'miTun (mE taI|)', blipi: 'imTun ╠E~m tah~|²' },
  4: { en: 'Cancer', mm: 'krkT (mE taI|)', blipi: 'kk_o_ ╠E~m tah~|²' },
  5: { en: 'Leo', mm: 'sizh (mE taI|)', blipi: 'iszh ╠E~m tah~|²' },
  6: { en: 'Virgo', mm: 'knya (mE taI|)', blipi: 'kNya ╠E~m tah~|²' },
  7: { en: 'Libra', mm: 'tula (mE taI|)', blipi: 'tula ╠E~m tah~|²' },
  8: { en: 'Scorpio', mm: 'brsic (mE taI|)', blipi: 'b<iSc ╠E~m tah~|²' },
  9: { en: 'Sagittarius', mm: 'dnu (mE taI|)', blipi: 'dnu ╠E~m tah~|²' },
  10: { en: 'Capricorn', mm: 'mkr (mE taI|)', blipi: 'mkr ╠E~m tah~|²' },
  11: { en: 'Aquarius', mm: 'kuMv (mE taI|)', blipi: 'k<m\f ╠E~m tah~|²' },
  12: { en: 'Pisces', mm: 'min (mE taI|)', blipi: 'mIn ╠E~m tah~|²' },
};

// Lagna Names
const LAGNA_DISPLAY: Record<number, { en: string; mm: string; blipi: string }> = {
  1: { en: 'Aries', mm: 'mes', blipi: 'EmF' },
  2: { en: 'Taurus', mm: 'bis', blipi: 'b<F' },
  3: { en: 'Gemini', mm: 'miTun', blipi: 'imTun' },
  4: { en: 'Cancer', mm: 'krkT', blipi: 'kk_o_' },
  5: { en: 'Leo', mm: 'noZsa', blipi: 'iszh' },
  6: { en: 'Virgo', mm: 'knya', blipi: 'kNya' },
  7: { en: 'Libra', mm: 'tula', blipi: 'tula' },
  8: { en: 'Scorpio', mm: 'brsic', blipi: 'b<iSc' },
  9: { en: 'Sagittarius', mm: 'dnu', blipi: 'dnu' },
  10: { en: 'Capricorn', mm: 'mkr', blipi: 'mkr' },
  11: { en: 'Aquarius', mm: 'kuMv', blipi: 'k<m\f' },
  12: { en: 'Pisces', mm: 'min', blipi: 'mIn' },
};

// Nakshatras 1 to 27
const NAKSHATRA_DISPLAY: Record<number, { en: string; mm: string; blipi: string }> = {
  1: { en: 'Ashwini', mm: '1-Asini', blipi: '1-AiSinI' },
  2: { en: 'Bharani', mm: '2-vrni (Yba)', blipi: '2-vrnI ╠Tba²' },
  3: { en: 'Krittika', mm: '3-k_ritika', blipi: '3-k<ito_ka' },
  4: { en: 'Rohini', mm: '4-rohini', blipi: '4-ErahinI' },
  5: { en: 'Mrigashira', mm: '5-m_rigsira', blipi: '5-m<giSra' },
  6: { en: 'Ardra', mm: '6-Aadra', blipi: '6-Aad_o[a' },
  7: { en: 'Punarvasu', mm: '7-punrbsu', blipi: '7-punb_oSu' },
  8: { en: 'Pushya', mm: '8-pusya', blipi: '8-puS_oYa' },
  9: { en: 'Ashlesha', mm: '9-Aslesa', blipi: '9-AaES_oLa' },
  10: { en: 'Magha', mm: '10-mga', blipi: '10-mGa' },
  11: { en: 'Purva Phalguni', mm: '11-purv falgun', blipi: '11-pu_ob falguin' },
  12: { en: 'Uttara Phalguni', mm: '12-Utr falgun', blipi: '12-Uo_+r falguin' },
  13: { en: 'Hasta', mm: '13-hsta', blipi: '13-h_oSta' },
  14: { en: 'Chitra', mm: '14-citra', blipi: '14-icŒ_a' },
  15: { en: 'Swati', mm: '15-swati', blipi: '15-ES_owatI' },
  16: { en: 'Vishakha', mm: '16-bisaka', blipi: '16-ibSaKa' },
  17: { en: 'Anuradha', mm: '17-Anurada', blipi: '17-AnuraDa' },
  18: { en: 'Jyeshtha', mm: '18-jest', blipi: '18-Eja_oSF' },
  19: { en: 'Mula', mm: '19-mula', blipi: '19-mula' },
  20: { en: 'Purva Ashadha', mm: '20-purv Asada', blipi: '20-pu_ob AaSaD' },
  21: { en: 'Uttara Ashadha', mm: '21-Utr Asada', blipi: '21-Uo_+r AaSaD' },
  22: { en: 'Shravana', mm: '22-sravn', blipi: '22-S_orbn' },
  23: { en: 'Dhanishta', mm: '23-dnista', blipi: '23-DiniSFa' },
  24: { en: 'Shatabhisha', mm: '24-stbisa', blipi: '24-StibSa' },
  25: { en: 'Purva Bhadrapada', mm: '25-purv badrpda', blipi: '25-pu_ob vad_o[pda' },
  26: { en: 'Uttara Bhadrapada', mm: '26-Utr badrpda', blipi: '26-Uo_+r vad_o[pda' },
  27: { en: 'Revati', mm: '27-revti', blipi: '27-ErbtI' },
};

export default function KuthiResultWorkstation({
  initialData,
  theme: parentTheme,
  onClose,
}: KuthiResultWorkstationProps) {
  // At starting, don't open the result, first open the birth details form!
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // 3 Tabs: 'Meitei Mayek' | 'Sanamahi' | 'Hinduism'
  const [activeTab, setActiveTab] = useState<ResultTabType>('Meitei Mayek');

  // Theme State
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(parentTheme || 'dark');
  const isDark = currentTheme === 'dark';

  // Toggle for the Birth Details Input Form (when viewing results)
  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  // Form State: Birth Details
  const [name, setName] = useState<string>(initialData?.name || 'Moirangthem Suraj Singh');
  const [dobInput, setDobInput] = useState<string>('1986-07-02'); // YYYY-MM-DD
  const [tobInput, setTobInput] = useState<string>('09:45'); // HH:MM
  const [pob, setPob] = useState<string>(initialData?.pob || 'Tentha Khunou Maning Leikai');
  const [gender, setGender] = useState<'male' | 'female'>(initialData?.gender || 'male');

  // Astrologer & Document Header
  const [astrologerName, setAstrologerName] = useState<string>('Moirangthem Suraj Singh');
  const [astrologerTitle, setAstrologerTitle] = useState<string>('Vedic Astro');
  const [contactNo, setContactNo] = useState<string>('Contact No.6002465337');
  const [address, setAddress] = useState<string>('Tentha Khunou Maning Leikai');
  const [refNo, setRefNo] = useState<string>('Ref. No.:- 2021   (20-04-2025)');
  const [consultDate, setConsultDate] = useState<string>('20-04-2025');

  // Calculation Trigger Counter
  const [calcVersion, setCalcVersion] = useState<number>(1);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Perform Real Astrological Calculation on the Entered Birth Details
  const calculatedAstro = useMemo(() => {
    try {
      const parts = dobInput.split('-').map(Number);
      const timeParts = tobInput.split(':').map(Number);
      const birthDate = new Date(parts[0], parts[1] - 1, parts[2], timeParts[0] || 0, timeParts[1] || 0);

      // 1. Day of Week
      const dayIdx = birthDate.getDay();
      const dayInfo = WEEKDAY_MAP[dayIdx] || WEEKDAY_MAP[3];

      // 2. Exact Age
      const ageInfo = calculateExactAge(dobInput) || { years: 38, months: 9, days: 19, runningYear: 39 };

      // 3. Ephemeris Planets & Lagna
      const pos = calculatePlanetaryPositions({
        name,
        gender,
        dateOfBirth: birthDate,
        timeOfBirth: tobInput,
        latitude: 24.8170, // Manipur default
        longitude: 93.9368,
        timezone: 'Asia/Kolkata',
        utcOffset: 5.5,
        ayanamsa: 'lahiri',
      });

      const lagnaSignNum = Math.floor(pos.ascendant / 30) + 1; // 1 to 12
      const moonPlanet = pos.planets.find((p) => p.id === 'mo');
      const moonLon = moonPlanet ? moonPlanet.longitude : 24.5;
      const rashiNum = Math.floor(moonLon / 30) + 1; // 1 to 12
      const nakNum = Math.floor(moonLon / (360 / 27)) + 1; // 1 to 27

      // 4. Vimshottari Dashas
      const dashas = calculateVimshottariDasha(moonLon, birthDate);
      const curDasha = getCurrentDasha(dashas, new Date());

      // Formatted Dates for Manipuri format
      const formattedDob = `${parts[2]}-${parts[1]}-${parts[0]} AD`;
      const h24 = timeParts[0] || 0;
      const m24 = timeParts[1] || 0;
      const ampm = h24 >= 12 ? 'PM' : 'AM';
      const h12 = h24 % 12 || 12;
      const formattedTob12 = `${h12}:${String(m24).padStart(2, '0')} ${ampm}`;

      return {
        formattedDob,
        formattedTob: formattedTob12,
        dayInfo,
        ageInfo,
        rashiNum,
        lagnaSignNum,
        nakNum,
        rashi: RASHI_DISPLAY[rashiNum] || RASHI_DISPLAY[1],
        lagna: LAGNA_DISPLAY[lagnaSignNum] || LAGNA_DISPLAY[5],
        nakshatra: NAKSHATRA_DISPLAY[nakNum] || NAKSHATRA_DISPLAY[2],
        curDasha,
      };
    } catch (e) {
      return {
        formattedDob: '2-7-1986 AD',
        formattedTob: '9:45 AM',
        dayInfo: WEEKDAY_MAP[3],
        ageInfo: { years: 38, months: 9, days: 19, runningYear: 39 },
        rashiNum: 1,
        lagnaSignNum: 5,
        nakNum: 2,
        rashi: RASHI_DISPLAY[1],
        lagna: LAGNA_DISPLAY[5],
        nakshatra: NAKSHATRA_DISPLAY[2],
        curDasha: { currentMahaDasha: 'Rahu', currentAntarDasha: 'Shani' },
      };
    }
  }, [dobInput, tobInput, calcVersion, name, gender]);

  // Active Template Sheet Data
  const sheetKey = SHEET_MAP[activeTab];
  const activeTemplate = useMemo(() => {
    const sheetData: any = (resultTemplates as any)[sheetKey] || {};
    return sheetData;
  }, [sheetKey]);

  // Helper to read template cell with fallback
  const getVal = (row: number, col: string, fallback: string = '') => {
    const rowObj = activeTemplate[String(row)];
    if (rowObj && rowObj[col] && rowObj[col].val) {
      return rowObj[col].val;
    }
    return fallback;
  };

  const dynamicNarrative = useMemo(() => {
    const rawNarrative = getVal(23, 'A', '');
    if (!rawNarrative) return '';
    return rawNarrative;
  }, [activeTemplate, calculatedAstro, name]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCalcVersion((v) => v + 1);
    setHasCalculated(true);
    setShowEditForm(false);
    showToast(`Horoscope Calculated for ${name}!`);
  };

  const handleApplyPreset = (preset: 'suraj' | 'sanatomba') => {
    if (preset === 'suraj') {
      setName('Moirangthem Suraj Singh');
      setDobInput('1986-07-02');
      setTobInput('09:45');
      setPob('Tentha Khunou Maning Leikai');
      setGender('male');
      setRefNo('Ref. No.:- 2021   (20-04-2025)');
      setConsultDate('20-04-2025');
      setCalcVersion((v) => v + 1);
      showToast('Loaded Excel Reference: Suraj Singh (1986)');
    } else {
      setName('Sanatomba Meitei');
      setDobInput('2004-06-28');
      setTobInput('06:00');
      setPob('Imphal, Manipur');
      setGender('male');
      setRefNo('Ref. No.:- 2025   (13-09-2026)');
      setConsultDate('13-09-2026');
      setCalcVersion((v) => v + 1);
      showToast('Loaded Preset: Sanatomba Meitei (2004)');
    }
  };

  const handleCopyReport = () => {
    const reportNarrative = dynamicNarrative;
    const reportText = `=====================================================
MANIPURI KUTHI HOROSCOPE RESULT (${activeTab})
=====================================================
Astrologer: ${astrologerName} (${astrologerTitle})
Address: ${address} | ${contactNo}
${refNo} | Date: ${consultDate}
-----------------------------------------------------
NATIVE PARTICULARS:
- Name: ${name}
- Date of Birth: ${calculatedAstro.formattedDob} (${calculatedAstro.dayInfo.en})
- Birth Time: ${calculatedAstro.formattedTob}
- Place of Birth: ${pob}
- Current Age: ${calculatedAstro.ageInfo?.years ?? 38} Years ${calculatedAstro.ageInfo?.months ?? 9} Months (Running ${calculatedAstro.ageInfo?.runningYear ?? 39}th Year)
- Rashi: ${activeTab === 'Meitei Mayek' ? calculatedAstro.rashi.mm : calculatedAstro.rashi.blipi}
- Lagna: ${activeTab === 'Meitei Mayek' ? calculatedAstro.lagna.mm : calculatedAstro.lagna.blipi}
- Nakshatra: ${activeTab === 'Meitei Mayek' ? calculatedAstro.nakshatra.mm : calculatedAstro.nakshatra.blipi}

LUCKY ATTRIBUTES:
- Lucky Colours: ${getVal(10, 'C', '')}
- Lucky Number: ${getVal(12, 'A', '2')}
- Good Numbers: ${getVal(12, 'C', '1, 7, 9')}
- Lucky Stone: ${getVal(12, 'E', 'Ruby')}
- Lucky Metal: ${getVal(12, 'G', 'Copper')}
- Lucky Direction: ${getVal(12, 'I', 'East')}

DIRECTION PREDICTIONS (8 DIRECTIONS):
- Nongpok (East): ${getVal(14, 'C', '') || getVal(14, 'B', '')}
- Chingkhei (North-East): ${getVal(15, 'C', '') || getVal(15, 'B', '')}
- Awang (North): ${getVal(16, 'C', '') || getVal(16, 'B', '')}
- Koubru (North-West): ${getVal(17, 'C', '') || getVal(17, 'B', '')}
- Nongchup (West): ${getVal(18, 'C', '') || getVal(18, 'B', '')}
- Santhong (South-West): ${getVal(19, 'C', '') || getVal(19, 'B', '')}
- Makha (South): ${getVal(20, 'C', '') || getVal(20, 'B', '')}
- Meiram (South-East): ${getVal(21, 'C', '') || getVal(21, 'B', '')}

DASHA & LIFE PREDICTIONS:
${reportNarrative}

REMEDIES / PRITIKAR:
1. ${getVal(113, 'B', '') || getVal(115, 'B', '') || getVal(53, 'B', '')}
2. ${getVal(114, 'B', '') || getVal(116, 'B', '') || getVal(54, 'B', '')}
=====================================================
Generated via Kanglei Kuthi • kuthiyengpham.in`;

    navigator.clipboard.writeText(reportText);
    showToast(`Copied ${activeTab} Report to Clipboard!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`w-full rounded-3xl shadow-2xl overflow-hidden font-sans border transition-colors duration-200 ${
        isDark
          ? 'bg-[#0b132b] text-white border-[#3a506b]'
          : 'bg-[#fffdfa] text-slate-900 border-[#f3e8d2]'
      }`}
    >
      {/* ── TOP TOOLBAR ── */}
      <div
        className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-[#1c2541] via-[#151f38] to-[#0b132b] border-[#3a506b]/60 text-white'
            : 'bg-gradient-to-r from-[#fff9eb] via-[#fffdfa] to-[#fef3c7] border-[#f3e8d2] text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md ${
              isDark
                ? 'bg-gradient-to-tr from-amber-600 to-amber-400 border border-amber-300/40 text-slate-950'
                : 'bg-gradient-to-tr from-amber-500 to-amber-300 border border-amber-400 text-amber-950'
            }`}
          >
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`font-serif font-black text-xl tracking-wide ${
                  isDark ? 'text-amber-300' : 'text-[#78350f]'
                }`}
              >
                Kuthi Horoscope Result Sheets
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  isDark
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                Meitei Mayek • Sanamahi • Hinduism
              </span>
            </div>
            <p
              className={`text-xs font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Enter native birth details and start calculating instant authentic horoscope documents
            </p>
          </div>
        </div>

        {/* Action Buttons & Theme Switcher */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setCurrentTheme(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isDark
                ? 'bg-[#0b132b] hover:bg-[#1c2541] border-[#3a506b] text-amber-300'
                : 'bg-white hover:bg-amber-50 border-amber-200 text-amber-900'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          {/* If already calculated, show result actions */}
          {hasCalculated && (
            <>
              <button
                onClick={() => setShowEditForm((prev) => !prev)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isDark
                    ? 'bg-[#1c2541] hover:bg-[#253258] border-[#3a506b] text-slate-200'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-amber-500" />
                <span>{showEditForm ? 'Hide Form' : 'Edit Details'}</span>
                {showEditForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <button
                onClick={handleCopyReport}
                className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isDark
                    ? 'bg-[#1c2541] hover:bg-[#253258] border-amber-500/30 text-amber-300'
                    : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Report</span>
              </button>

              <button
                onClick={handlePrint}
                className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isDark
                    ? 'bg-[#1c2541] hover:bg-[#253258] border-slate-600 text-slate-200'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 dark:text-rose-300 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Toast */}
      {toastMsg && (
        <div className="bg-emerald-500 text-slate-950 font-black text-xs py-2 px-4 text-center flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── CASE 1: AT STARTING, DON'T OPEN RESULT, FIRST OPEN THE BIRTH DETAILS FORM ── */}
      {!hasCalculated ? (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          <div
            className={`border-2 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 transition-all ${
              isDark
                ? 'bg-[#151f38] border-amber-500/40 text-white'
                : 'bg-white border-amber-300 text-slate-900 shadow-xl'
            }`}
          >
            {/* Form Header */}
            <div className="border-b pb-4 flex flex-wrap items-center justify-between gap-3 border-amber-400/30">
              <div className="space-y-1">
                <h3
                  className={`font-serif font-black text-2xl flex items-center gap-2.5 ${
                    isDark ? 'text-amber-300' : 'text-[#78350f]'
                  }`}
                >
                  <Calculator className="w-6 h-6 text-amber-500" />
                  <span>Enter Birth Details to Start Calculating</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Fill in the native details below to compute and generate the horoscope across Meitei Mayek, Sanamahi, and Hinduism sheets.
                </p>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[11px] font-bold text-slate-400">Presets:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('suraj')}
                  className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    isDark
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300'
                      : 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                  }`}
                >
                  Suraj Singh (1986-07-02)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('sanatomba')}
                  className={`px-3 py-1.5 rounded-xl border font-medium text-xs transition-all cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs'
                  }`}
                >
                  Sanatomba (2004-06-28)
                </button>
              </div>
            </div>

            {/* Input Fields */}
            <form onSubmit={handleCalculate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1.5 text-slate-400">
                    Native / Client Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Moirangthem Suraj Singh"
                      className={`w-full rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-bold focus:outline-none border ${
                        isDark
                          ? 'bg-[#0b132b] border-[#3a506b] text-white focus:border-amber-400'
                          : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900 focus:border-amber-600 shadow-xs'
                      }`}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-400">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none border ${
                      isDark
                        ? 'bg-[#0b132b] border-[#3a506b] text-white focus:border-amber-400'
                        : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900 focus:border-amber-600 shadow-xs'
                    }`}
                  >
                    <option value="male">Male (নুপা)</option>
                    <option value="female">Female (নুপী)</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-400">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                    <input
                      type="date"
                      required
                      value={dobInput}
                      onChange={(e) => setDobInput(e.target.value)}
                      className={`w-full rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-bold font-mono focus:outline-none border ${
                        isDark
                          ? 'bg-[#0b132b] border-[#3a506b] text-white focus:border-amber-400'
                          : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900 focus:border-amber-600 shadow-xs'
                      }`}
                    />
                  </div>
                </div>

                {/* Time of Birth */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-400">
                    Birth Time (24h or HH:MM)
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                    <input
                      type="time"
                      required
                      value={tobInput}
                      onChange={(e) => setTobInput(e.target.value)}
                      className={`w-full rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-bold font-mono focus:outline-none border ${
                        isDark
                          ? 'bg-[#0b132b] border-[#3a506b] text-white focus:border-amber-400'
                          : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900 focus:border-amber-600 shadow-xs'
                      }`}
                    />
                  </div>
                </div>

                {/* Place of Birth */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-400">
                    Place of Birth
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={pob}
                      onChange={(e) => setPob(e.target.value)}
                      placeholder="e.g. Tentha Khunou"
                      className={`w-full rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:outline-none border ${
                        isDark
                          ? 'bg-[#0b132b] border-[#3a506b] text-white focus:border-amber-400'
                          : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900 focus:border-amber-600 shadow-xs'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Big Calculate Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>Calculate Kuthi Horoscope Result</span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </button>
              </div>
            </form>

            {/* 3 Result Tabs Preview Banner */}
            <div className="border-t pt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div
                className={`p-3.5 rounded-2xl border space-y-1 ${
                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="font-bold text-amber-500 flex items-center gap-1.5">
                  <span>📜</span>
                  <span>Meitei Mayek Tab</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Renders Meetei Mayek script with custom Budha.ttf font and BLipi15 headings.
                </p>
              </div>

              <div
                className={`p-3.5 rounded-2xl border space-y-1 ${
                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="font-bold text-amber-500 flex items-center gap-1.5">
                  <span>🪶</span>
                  <span>Sanamahi Tab</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Authentic indigenous Manipuri Sanamahi astrological tradition & remedies.
                </p>
              </div>

              <div
                className={`p-3.5 rounded-2xl border space-y-1 ${
                  isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="font-bold text-amber-500 flex items-center gap-1.5">
                  <span>🕉️</span>
                  <span>Hinduism Tab</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Classic Vedic / Hindu horoscope result sheet with full life timeline & Dasha predictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── CASE 2: AFTER CALCULATION, SHOW 3 TABS & THE HOROSCOPE DOCUMENT ── */
        <div className="space-y-0 animate-in fade-in duration-300">
          {/* Collapsible Edit Form (when requested by user via Edit Details button) */}
          {showEditForm && (
            <div
              className={`px-6 py-5 border-b transition-all ${
                isDark
                  ? 'bg-[#0f172a] border-[#3a506b]/50'
                  : 'bg-[#faf6ee] border-[#f3e8d2]'
              }`}
            >
              <form onSubmit={handleCalculate} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-black text-sm text-amber-500 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" />
                    <span>Update Birth Details</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-200 font-bold"
                  >
                    Close Form
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                  <div className="lg:col-span-2">
                    <label className="block font-bold text-[11px] mb-1 text-slate-400">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs font-bold border focus:outline-none ${
                        isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-[#e2d5c4] text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[11px] mb-1 text-slate-400">DOB</label>
                    <input
                      type="date"
                      value={dobInput}
                      onChange={(e) => setDobInput(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs font-bold font-mono border focus:outline-none ${
                        isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-[#e2d5c4] text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[11px] mb-1 text-slate-400">Birth Time</label>
                    <input
                      type="time"
                      value={tobInput}
                      onChange={(e) => setTobInput(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs font-bold font-mono border focus:outline-none ${
                        isDark ? 'bg-[#0b132b] border-[#3a506b] text-white' : 'bg-white border-[#e2d5c4] text-slate-900'
                      }`}
                    />
                  </div>
                  <div className="lg:col-span-2 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all"
                    >
                      Recalculate Horoscope
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ── 3-TAB SWITCHER: MEITEI MAYEK, SANAMAHI, HINDUISM ── */}
          <div
            className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 transition-colors ${
              isDark
                ? 'bg-[#151f38] border-[#3a506b]/50'
                : 'bg-[#faf6ee] border-[#f3e8d2]'
            }`}
          >
            <div className="flex items-center flex-wrap gap-2.5">
              {/* TAB 1: MEITEI MAYEK (MM_Result_M with Budha.ttf font) */}
              <button
                onClick={() => setActiveTab('Meitei Mayek')}
                className={`px-4.5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'Meitei Mayek'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg scale-102 border border-amber-400'
                    : isDark
                    ? 'bg-[#0b132b] text-slate-300 hover:text-white border border-[#3a506b]/60'
                    : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-300 shadow-xs'
                }`}
              >
                <span>📜</span>
                <span className="text-sm tracking-wide">Meitei Mayek</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    activeTab === 'Meitei Mayek' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/20 text-amber-500'
                  }`}
                >
                  Budha.ttf
                </span>
              </button>

              {/* TAB 2: SANAMAHI (Meetei_Result with Blipi15) */}
              <button
                onClick={() => setActiveTab('Sanamahi')}
                className={`px-4.5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'Sanamahi'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg scale-102 border border-amber-400'
                    : isDark
                    ? 'bg-[#0b132b] text-slate-300 hover:text-white border border-[#3a506b]/60'
                    : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-300 shadow-xs'
                }`}
              >
                <span>🪶</span>
                <span className="text-sm tracking-wide">Sanamahi</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    activeTab === 'Sanamahi' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/20 text-amber-500'
                  }`}
                >
                  BLipi15
                </span>
              </button>

              {/* TAB 3: HINDUISM (Result with Blipi15 / Bengali script) */}
              <button
                onClick={() => setActiveTab('Hinduism')}
                className={`px-4.5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'Hinduism'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg scale-102 border border-amber-400'
                    : isDark
                    ? 'bg-[#0b132b] text-slate-300 hover:text-white border border-[#3a506b]/60'
                    : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-300 shadow-xs'
                }`}
              >
                <span>🕉️</span>
                <span className="text-sm tracking-wide">Hinduism</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    activeTab === 'Hinduism' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/20 text-amber-500'
                  }`}
                >
                  Vedic Result
                </span>
              </button>
            </div>

            {/* Font Indicator */}
            <div
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                isDark
                  ? 'bg-[#0b132b] border-[#3a506b] text-amber-300'
                  : 'bg-white border-[#e2d5c4] text-amber-900 shadow-xs'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {activeTab === 'Meitei Mayek'
                  ? 'Meitei Mayek (Budha.ttf) + BLipi15 Headers'
                  : 'BLipi15 Font Engine'}
              </span>
            </div>
          </div>

          {/* ── KUTHI HOROSCOPE DOCUMENT VIEW ── */}
          <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
            <div
              className={`border-2 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 transition-all relative ${
                isDark
                  ? 'bg-[#151f38] border-amber-500/40 text-white'
                  : 'bg-white border-amber-300 text-slate-900 shadow-xl'
              }`}
            >
              {/* Ornamental Border */}
              <div className="absolute inset-2.5 border border-amber-400/20 rounded-2xl pointer-events-none" />

              {/* HEADER SECTION */}
              <div className="text-center space-y-2 border-b border-amber-400/30 pb-6">
                <h1
                  className={`font-serif font-black text-2xl md:text-3xl tracking-wide ${
                    isDark ? 'text-amber-300' : 'text-[#78350f]'
                  }`}
                >
                  {astrologerName}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-semibold opacity-90">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-mono">
                    {astrologerTitle}
                  </span>
                  <span>•</span>
                  <span>{address}</span>
                  <span>•</span>
                  <span className="font-mono">{contactNo}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between text-xs font-mono pt-3 opacity-80 border-t border-amber-400/20">
                  <span>{refNo}</span>
                  <div className="flex items-center gap-1.5">
                    {/* Note: text like 'taZ :-' uses font-blipi per user instruction */}
                    <span className="font-blipi font-bold text-sm text-amber-500">
                      {activeTab === 'Meitei Mayek' ? 'taZ :- ' : 'taz:- '}
                    </span>
                    <span>{consultDate}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: NATIVE BIRTH PARTICULARS */}
              <div
                className={`rounded-2xl p-4 md:p-5 border space-y-3 transition-colors ${
                  isDark
                    ? 'bg-[#0b132b]/80 border-[#3a506b]'
                    : 'bg-[#faf6ee] border-[#e2d5c4]'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                      Name / Client:
                    </span>
                    <span className="font-serif font-black text-sm text-amber-500">
                      {name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                      Date of Birth:
                    </span>
                    <span className="font-mono font-bold text-sm">
                      {calculatedAstro.formattedDob}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                      Birth Time:
                    </span>
                    <span className="font-mono font-bold text-sm">
                      {calculatedAstro.formattedTob}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                      Birthday / Weekday:
                    </span>
                    <span className="font-bold text-sm">
                      {calculatedAstro.dayInfo.en} ({calculatedAstro.dayInfo.bn})
                    </span>
                  </div>
                </div>

                {/* ASTROLOGICAL MARKS: RASHI, LAGNA, NAKSHATRA */}
                <div
                  className={`pt-3 border-t grid grid-cols-1 md:grid-cols-3 gap-4 text-xs ${
                    isDark ? 'border-[#3a506b]/40' : 'border-[#e2d5c4]'
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                      {activeTab === 'Meitei Mayek' ? 'rasi (Moon Sign):' : 'raiS (রাশি):'}
                    </span>
                    <span
                      className={`font-bold text-base ${
                        activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                      }`}
                    >
                      {activeTab === 'Meitei Mayek'
                        ? calculatedAstro.rashi.mm
                        : calculatedAstro.rashi.blipi}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                      {activeTab === 'Meitei Mayek' ? 'lg_n (Ascendant):' : 'lgx (লগ্ন):'}
                    </span>
                    <span
                      className={`font-bold text-base ${
                        activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                      }`}
                    >
                      {activeTab === 'Meitei Mayek'
                        ? calculatedAstro.lagna.mm
                        : calculatedAstro.lagna.blipi}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                      {activeTab === 'Meitei Mayek' ? 'YwaNmicaK (Nakshatra):' : 'Twanimcak (নক্ষত্র):'}
                    </span>
                    <span
                      className={`font-bold text-base ${
                        activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                      }`}
                    >
                      {activeTab === 'Meitei Mayek'
                        ? calculatedAstro.nakshatra.mm
                        : calculatedAstro.nakshatra.blipi}
                    </span>
                    <span
                      className={`text-[11px] block text-slate-400 mt-0.5 ${
                        activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                      }`}
                    >
                      {getVal(8, 'G', '')}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: LUCKY NUMBERS & ATTRIBUTES */}
              <div className="space-y-3">
                <h3
                  className={`font-serif font-bold text-sm flex items-center gap-2 ${
                    isDark ? 'text-amber-300' : 'text-[#78350f]'
                  }`}
                >
                  <span>🍀</span> Lucky Numbers & Planetary Energies
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  <div
                    className={`p-3 rounded-2xl border ${
                      isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf6ee] border-[#e2d5c4]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Lucky No.
                    </span>
                    <span className="font-mono font-black text-xl text-amber-500">
                      {getVal(12, 'A', '2')}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border ${
                      isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf6ee] border-[#e2d5c4]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Good Numbers
                    </span>
                    <span className="font-mono font-bold text-base text-emerald-500">
                      {getVal(12, 'C', '1, 7, 9')}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border ${
                      isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf6ee] border-[#e2d5c4]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Lucky Stone
                    </span>
                    <span className="font-bold text-base text-rose-500">
                      {getVal(12, 'E', 'Ruby')}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border ${
                      isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf6ee] border-[#e2d5c4]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Lucky Metal
                    </span>
                    <span className="font-bold text-base text-amber-600">
                      {getVal(12, 'G', 'Copper')}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border col-span-2 sm:col-span-1 ${
                      isDark ? 'bg-[#0b132b] border-[#3a506b]' : 'bg-[#faf6ee] border-[#e2d5c4]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Lucky Direction
                    </span>
                    <span className="font-bold text-base text-sky-500">
                      {getVal(12, 'I', 'East')}
                    </span>
                  </div>
                </div>

                {/* Lucky Colours Banner */}
                <div
                  className={`p-3 rounded-2xl border text-xs leading-relaxed flex items-center gap-2 ${
                    isDark
                      ? 'bg-[#0b132b] border-amber-500/20 text-slate-200'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <strong>Lucky Colours: </strong>
                    <span className={activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}>
                      {getVal(10, 'C', '')}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: 8 DIRECTIONAL GUIDANCE TABLE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-serif font-bold text-sm flex items-center gap-2 ${
                      isDark ? 'text-amber-300' : 'text-[#78350f]'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-amber-500" />
                    {/* Note: 'chi taZkK Asid lM cTpgi maIkEsiZgi Af-fTt mHad pijri:-' uses font-blipi */}
                    <span className="font-blipi font-bold text-sm">
                      {activeTab === 'Meitei Mayek'
                        ? 'chi taZkK Asid lM cTpgi maIkEsiZgi Af-fTt mHad pijri:-'
                        : 'cih tazk(I mtaz Aisda lm c\\pgI mah~e~kiSzgI Af-fo_ mKada pIjir:-'}
                    </span>
                  </h3>
                </div>

                <div
                  className={`rounded-2xl border overflow-hidden transition-colors ${
                    isDark ? 'border-[#3a506b]' : 'border-[#e2d5c4]'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-500/20 text-xs">
                    {/* Column 1 */}
                    <div className="divide-y divide-gray-500/20">
                      <div className="p-3 flex items-start justify-between gap-3">
                        <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                          {getVal(14, 'A', 'noZpoK :-')}
                        </span>
                        <span className={`text-right ${activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                          {getVal(14, 'C', '') || getVal(14, 'B', '')}
                        </span>
                      </div>
                      <div className="p-3 flex items-start justify-between gap-3">
                        <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                          {getVal(15, 'A', 'ciZHE :-')}
                        </span>
                        <span className={`text-right ${activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                          {getVal(15, 'C', '') || getVal(15, 'B', '')}
                        </span>
                      </div>
                      <div className="p-3 flex items-start justify-between gap-3">
                        <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                          {getVal(16, 'A', 'AwaZ :-')}
                        </span>
                        <span className={`text-right ${activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                          {getVal(16, 'C', '') || getVal(16, 'B', '')}
                        </span>
                      </div>
                      <div className="p-3 flex items-start justify-between gap-3">
                        <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                          {getVal(17, 'A', 'kOb_ru :-')}
                        </span>
                        <span className={`text-right ${activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                          {getVal(17, 'C', '') || getVal(17, 'B', '')}
                        </span>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="divide-y divide-gray-500/20">
                      <div className="p-3 flex items-start justify-between gap-3">
                        <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                          {getVal(18, 'A', 'noZcuP :-')}
                        </span>
                        <span className={`text-right ${activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                          {getVal(18, 'C', '') || getVal(18, 'B', '')}
                        </span>
                      </div>
                      <div className="p-3 flex items-start justify-between gap-3">
                        <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                          {getVal(19, 'A', 'sNYoZ :-')}
                        </span>
                        <span className={`text-right ${activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                          {getVal(19, 'C', '') || getVal(19, 'B', '')}
                        </span>
                      </div>
                      <div className="p-3 flex items-start justify-between gap-3">
                        <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                          {getVal(20, 'A', 'mHa :-')}
                        </span>
                        <span className={`text-right ${activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                          {getVal(20, 'C', '') || getVal(20, 'B', '')}
                        </span>
                      </div>
                      <div className="p-3 flex items-start justify-between gap-3">
                        <span className="font-blipi font-bold w-24 shrink-0 text-amber-500">
                          {getVal(21, 'A', 'mErM :-')}
                        </span>
                        <span className={`text-right ${activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'}`}>
                          {getVal(21, 'C', '') || getVal(21, 'B', '')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: DETAILED LIFE PREDICTIONS & DASHA TIMELINE NARRATIVE */}
              <div className="space-y-3">
                <h3
                  className={`font-serif font-bold text-sm flex items-center gap-2 ${
                    isDark ? 'text-amber-300' : 'text-[#78350f]'
                  }`}
                >
                  <span>📜</span> Detailed Life Predictions & Running Dasha Timeline (Row 23)
                </h3>

                <div
                  className={`p-5 rounded-2xl border leading-relaxed text-sm tracking-wide transition-colors ${
                    activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                  } ${
                    isDark
                      ? 'bg-[#0b132b] border-[#3a506b] text-slate-100'
                      : 'bg-[#faf6ee] border-[#e2d5c4] text-slate-900 shadow-xs'
                  }`}
                  style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
                >
                  {dynamicNarrative}
                </div>
              </div>

              {/* SECTION 5: REMEDIAL MEASURES (PRITIKAR 1 & 2) */}
              <div className="space-y-3">
                <h3
                  className={`font-serif font-bold text-sm flex items-center gap-2 ${
                    isDark ? 'text-amber-300' : 'text-[#78350f]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>
                    {activeTab === 'Meitei Mayek'
                      ? 'p_rtikar nTtr_g AkoKloN (Remedial Ceremonies):'
                      : 'p[itkar nYga Aekakelan (Remedial Ceremonies):'}
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pritikar 1 */}
                  <div
                    className={`p-4 rounded-2xl border space-y-2 ${
                      isDark
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pritikar (1)</span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed font-medium ${
                        activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                      }`}
                    >
                      {getVal(113, 'B', '') || getVal(115, 'B', '') || getVal(53, 'B', '')}
                    </p>
                  </div>

                  {/* Pritikar 2 */}
                  <div
                    className={`p-4 rounded-2xl border space-y-2 ${
                      isDark
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        : 'bg-amber-50/70 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pritikar (2)</span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed font-medium ${
                        activeTab === 'Meitei Mayek' ? 'font-budha' : 'font-blipi'
                      }`}
                    >
                      {getVal(114, 'B', '') || getVal(116, 'B', '') || getVal(54, 'B', '')}
                    </p>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="text-center pt-4 border-t border-amber-400/20 text-[11px] text-slate-400">
                Kanglei Kuthi Horoscopy • Generated via kuthiyengpham.in • Matched with qw.xlsm
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
