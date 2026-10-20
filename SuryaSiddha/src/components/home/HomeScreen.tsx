// components/home/HomeScreen.tsx - Panjika Sacred Vedic Astronomical Homepage (Google Stitch Design)
import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  LayoutGrid,
  Sparkles,
  Orbit,
  Heart,
  Layers,
  ShieldAlert,
  AlertTriangle,
  Crown,
  Moon,
  Sunrise,
  Hash,
  Gem,
  HelpCircle,
  Share2,
  Info,
  ChevronRight,
  Sun,
  Flame,
  CheckCircle2,
  X,
  Target,
  ArrowRight,
  Star,
  BarChart2,
  Compass,
  FlaskConical,
  Settings as SettingsIcon,
} from 'lucide-react';
import { UserBirthProfile, KundliData } from '../../types/astronomy';
import { AdminAppConfig } from '../../types/admin';
import { RASHIS } from '../../data/rashis';
import { TopBannerAd } from '../ads/TopBannerAd';
import { InlineAdCard } from '../ads/InlineAdCard';
import { InAppAnnouncementBar } from '../notifications/InAppAnnouncementBar';
import { MainTabType } from '../navigation/BottomNavigation';

interface HomeScreenProps {
  currentDate: string;
  profile: UserBirthProfile;
  calendarData: KundliData;
  adminConfig: AdminAppConfig;
  language?: 'bn' | 'en';
  onNavigate: (tab: MainTabType, subTab?: string) => void;
  onDateChange: (date: string) => void;
}

// Bengali Tithi Mapping
const BENGALI_TITHIS: Record<string, string> = {
  'Pratipada': 'প্রতিপদ',
  'Dvitiya': 'দ্বিতীয়া',
  'Tritiya': 'তৃতীয়া',
  'Chaturthi': 'চতুর্থী',
  'Panchami': 'পঞ্চমী',
  'Shashthi': 'ষষ্ঠী',
  'Saptami': 'সপ্তমী',
  'Ashtami': 'অষ্টমী',
  'Navami': 'নবমী',
  'Dashami': 'দশমী',
  'Ekadashi': 'একাদশী',
  'Dvadashi': 'দ্বাদশী',
  'Trayodashi': 'ত্রয়োদশী',
  'Chaturdashi': 'চতুর্দশী',
  'Purnima': 'পূর্ণিমা',
  'Amavasya': 'অমাবস্যা',
};

// Bengali Rashis
const BENGALI_RASHIS: { name: string; bengali: string; glyph: string }[] = [
  { name: 'Aries', bengali: 'মেষ', glyph: '♈' },
  { name: 'Taurus', bengali: 'বৃষ', glyph: '♉' },
  { name: 'Gemini', bengali: 'মিথুন', glyph: '♊' },
  { name: 'Cancer', bengali: 'কর্কট', glyph: '♋' },
  { name: 'Leo', bengali: 'সিংহ', glyph: '♌' },
  { name: 'Virgo', bengali: 'কন্যা', glyph: '♍' },
  { name: 'Libra', bengali: 'তুলা', glyph: '♎' },
  { name: 'Scorpio', bengali: 'বৃশ্চিক', glyph: '♏' },
  { name: 'Sagittarius', bengali: 'ধনু', glyph: '♐' },
  { name: 'Capricorn', bengali: 'মকর', glyph: '♑' },
  { name: 'Aquarius', bengali: 'কুম্ভ', glyph: '♒' },
  { name: 'Pisces', bengali: 'মীন', glyph: '♓' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentDate,
  profile,
  calendarData,
  adminConfig,
  language = 'bn',
  onNavigate,
}) => {
  const [activeModal, setActiveModal] = useState<
    'horoscope' | 'gochara' | 'numerology' | 'remedies' | 'prashna' | 'festivals' | 'about' | null
  >(null);
  const [selectedRashiIndex, setSelectedRashiIndex] = useState<number>(4); // Default to Leo as in Stitch
  const [shareToast, setShareToast] = useState<string | null>(null);

  const panchang = calendarData.panchang;
  const muhurta = calendarData.muhurta;

  // Format today's human-readable date
  const formattedToday = useMemo(() => {
    const d = new Date(currentDate);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [currentDate]);

  // Bengali Tithi Name lookup
  const bengaliTithi = useMemo(() => {
    const pureName = panchang.tithi.name.replace(/^(Shukla|Krishna)\s+/i, '').trim();
    const benPure = BENGALI_TITHIS[pureName] || pureName;
    const pakshaBen = panchang.tithi.paksha === 'Shukla' ? 'শুক্লা' : 'কৃষ্ণা';
    return `${pakshaBen} ${benPure}`;
  }, [panchang.tithi]);

  // Handle Share App
  const handleShareApp = async () => {
    const shareData = {
      title: 'Panjika - Vedic Astronomical Calendar & Astrology',
      text: 'Experience precision Hindu Vedic Panchang, Kundli, Muhurta, and Astrology predictions with Panjika!',
      url: 'https://play.google.com/store/apps/details?id=com.suryasiddha.app',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User dismissed
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setShareToast('App link copied to clipboard!');
        setTimeout(() => setShareToast(null), 3000);
      } catch (e) {
        setShareToast('Share: https://play.google.com/store/apps/details?id=com.suryasiddha.app');
        setTimeout(() => setShareToast(null), 4000);
      }
    }
  };

  // Google Stitch 3-in-a-Row Categories Matrix
  const categories = [
    {
      id: 'panchang',
      title: 'Panchang',
      bengali: 'পঞ্চাঙ্গ',
      desc: 'Tithi & Nakshatra',
      iconBg: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: <Calendar className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('panchang'),
    },
    {
      id: 'muhurta',
      title: 'Muhurta',
      bengali: 'শুভ মুহূর্ত',
      desc: 'Choghadiya & Hora',
      iconBg: 'bg-red-50 border-red-200 text-temple',
      icon: <Clock className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('muhurta'),
    },
    {
      id: 'kundli',
      title: 'Kundli',
      bengali: 'জন্মপত্রিকা',
      desc: 'D1, D9 Charts',
      iconBg: 'bg-purple-50 border-purple-200 text-purple-700',
      icon: <LayoutGrid className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('kundli', 'chart'),
    },
    {
      id: 'horoscope',
      title: 'Horoscope',
      bengali: 'দৈনিক রাশিফল',
      desc: '12 Rashi Forecast',
      iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
      icon: <Star className="w-5 h-5 stroke-[1.8]" />,
      action: () => setActiveModal('horoscope'),
    },
    {
      id: 'gochara',
      title: 'Gochara',
      bengali: 'গ্রহ গোচর',
      desc: 'Planetary Transits',
      iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
      icon: <Orbit className="w-5 h-5 stroke-[1.8]" />,
      action: () => setActiveModal('gochara'),
    },
    {
      id: 'matching',
      title: 'Kundli Milan',
      bengali: 'যোটক বিচার',
      desc: '36 Gunas Match',
      iconBg: 'bg-pink-50 border-pink-200 text-pink-600',
      icon: <Heart className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('kundli', 'matching'),
    },
    {
      id: 'dasha',
      title: 'Vimshottari',
      bengali: 'মহাদশা চক্র',
      desc: 'Planetary Periods',
      iconBg: 'bg-teal-50 border-teal-200 text-teal-600',
      icon: <Layers className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('kundli', 'dasha'),
    },
    {
      id: 'kp',
      title: 'KP System',
      bengali: 'কৃষ্ণমূর্তি',
      desc: 'Sub-Lord Analysis',
      iconBg: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      icon: <BarChart2 className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('kundli', 'planets'),
    },
    {
      id: 'doshas',
      title: 'Dosha Check',
      bengali: 'দোষ বিচার',
      desc: 'Manglik & Sade Sati',
      iconBg: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: <AlertTriangle className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('kundli', 'doshas'),
    },
    {
      id: 'yogas',
      title: 'Raja Yogas',
      bengali: 'শুভ যোগ',
      desc: 'GajaKesari & More',
      iconBg: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      icon: <Crown className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('kundli', 'chart'),
    },
    {
      id: 'festivals',
      title: 'Festivals',
      bengali: 'ব্রত-উৎসব',
      desc: 'Ekadashi & Vrat',
      iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: <Sparkles className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('calendar'),
    },
    {
      id: 'choghadiya',
      title: 'Choghadiya',
      bengali: 'চৌঘড়িয়া',
      desc: 'Day & Night Times',
      iconBg: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      icon: <Compass className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('muhurta'),
    },
    {
      id: 'numerology',
      title: 'Numerology',
      bengali: 'অঙ্ক জ্যোতিষ',
      desc: 'Moolank & Bhagyank',
      iconBg: 'bg-violet-50 border-violet-200 text-violet-700',
      icon: <Hash className="w-5 h-5 stroke-[1.8]" />,
      action: () => setActiveModal('numerology'),
    },
    {
      id: 'remedies',
      title: 'Remedies',
      bengali: 'রত্ন প্রতিকার',
      desc: 'Gemstones & Mantras',
      iconBg: 'bg-rose-50 border-rose-200 text-rose-700',
      icon: <FlaskConical className="w-5 h-5 stroke-[1.8]" />,
      action: () => setActiveModal('remedies'),
    },
    {
      id: 'prashna',
      title: 'Prashna',
      bengali: 'প্রশ্নকুণ্ডলী',
      desc: 'Horary Divination',
      iconBg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <HelpCircle className="w-5 h-5 stroke-[1.8]" />,
      action: () => setActiveModal('prashna'),
    },
    {
      id: 'share',
      title: 'Share App',
      bengali: 'শেয়ার করুন',
      desc: 'Tell Friends',
      iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      icon: <Share2 className="w-5 h-5 stroke-[1.8]" />,
      action: handleShareApp,
    },
    {
      id: 'about',
      title: 'About Us',
      bengali: 'অ্যাপ পরিচিতি',
      desc: 'Panjika v1.0.3',
      iconBg: 'bg-slate-50 border-slate-200 text-slate-600',
      icon: <Info className="w-5 h-5 stroke-[1.8]" />,
      action: () => setActiveModal('about'),
    },
    {
      id: 'settings',
      title: 'Settings',
      bengali: 'সেটিংস',
      desc: 'Ayanamsha & Modes',
      iconBg: 'bg-neutral-100 border-neutral-300 text-neutral-700',
      icon: <SettingsIcon className="w-5 h-5 stroke-[1.8]" />,
      action: () => onNavigate('settings'),
    },
  ];

  // Numerology calculation based on profile DOB
  const numerologyData = useMemo(() => {
    if (!profile.dob) return { moolank: 1, bhagyank: 1 };
    const parts = profile.dob.split('-');
    const dayVal = parseInt(parts[2], 10) || 1;
    let m = dayVal.toString().split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
    while (m > 9) m = m.toString().split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
    const allDigits = profile.dob.replace(/-/g, '').split('');
    let b = allDigits.reduce((acc, c) => acc + parseInt(c, 10), 0);
    while (b > 9) b = b.toString().split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
    return { moolank: m, bhagyank: b };
  }, [profile.dob]);

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20 sm:pb-24 animate-in fade-in duration-150">
      {/* 0. In-App Announcement Bar (Broadcast from /suryasiddha/admin.html) */}
      {adminConfig?.notifications?.announcement && (
        <InAppAnnouncementBar config={adminConfig.notifications.announcement} />
      )}

      {/* 1. BEGIN: HeroPanchangCard (Stitch Sacred Vermilion Gradient) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#790009] via-[#9c1b1b] to-[#681111] text-white p-4 shadow-sacred border border-amber-900/40">
        {/* Traditional Subtle Geometric Background Pattern */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border border-white/10 opacity-30 pointer-events-none" />
        <div className="absolute -right-4 -bottom-10 w-36 h-36 rounded-full border-2 border-dashed border-[#fbbf24]/20 opacity-40 pointer-events-none" />

        {/* Header Row: Live Date & Full Panchang CTA */}
        <div className="flex items-start justify-between relative z-10 mb-2.5">
          <div className="flex items-center space-x-1.5 bg-black/30 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-amber-200 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{formattedToday}</span>
            <span className="text-white/40">•</span>
            <span>{profile.place.split(',')[0]}</span>
          </div>
          <button
            onClick={() => onNavigate('panchang')}
            className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-[#fbbf24] to-[#d97706] hover:from-[#f59e0b] hover:to-[#b45309] text-[#1e1b18] text-[11px] font-bold rounded-full shadow-md active:scale-95 transition cursor-pointer"
          >
            <span>{language === 'bn' ? 'সম্পূর্ণ পঞ্জিকা' : 'Full Panchang'}</span>
            <ChevronRight className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Main Tithi & Bengali Title */}
        <div className="relative z-10 my-2">
          <h1 className="text-xl font-serif font-extrabold tracking-wide text-amber-100 flex items-baseline flex-wrap gap-x-2">
            {language === 'bn' ? (
              <>
                <span className="font-bengali font-bold text-2xl text-[#fbbf24] tracking-normal">
                  {bengaliTithi}
                </span>
                <span className="text-sm font-sans font-semibold text-amber-200/80">
                  ({panchang.tithi.name.toUpperCase()})
                </span>
              </>
            ) : (
              <>
                <span>{panchang.tithi.name.toUpperCase()}</span>
                <span className="font-bengali font-semibold text-lg text-[#fbbf24] tracking-normal">
                  ({bengaliTithi})
                </span>
              </>
            )}
          </h1>
          <p className="text-xs text-amber-200/90 font-medium mt-0.5 font-sans">
            {language === 'bn'
              ? `${panchang.tithi.paksha === 'Shukla' ? 'শুক্ল' : 'কৃষ্ণ'} পক্ষ • নক্ষত্র: ${panchang.nakshatra.name} (পদ ${panchang.nakshatra.pada}) • যোগ: ${panchang.yoga.name}`
              : `${panchang.tithi.paksha} Paksha • ${panchang.nakshatra.name} (Pada ${panchang.nakshatra.pada}) • ${panchang.yoga.name} Yoga`}
          </p>
        </div>

        {/* Quick Astronomical Indicators (Sunrise, Sunset, Abhijit Muhurta) */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/15 relative z-10">
          <div className="bg-black/25 rounded-xl px-2.5 py-2 border border-white/10 text-center">
            <div className="flex items-center justify-center space-x-1 text-amber-200/80 mb-0.5">
              <Sun className="w-3.5 h-3.5 text-[#fbbf24] stroke-[2.2]" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                {language === 'bn' ? 'সূর্যোদয়' : 'Sunrise'}
              </span>
            </div>
            <span className="text-xs font-bold text-white font-mono tracking-tight">{panchang.sunrise}</span>
          </div>

          <div className="bg-black/25 rounded-xl px-2.5 py-2 border border-white/10 text-center">
            <div className="flex items-center justify-center space-x-1 text-amber-200/80 mb-0.5">
              <Moon className="w-3.5 h-3.5 text-[#fe932c] stroke-[2.2]" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                {language === 'bn' ? 'সূর্যাস্ত' : 'Sunset'}
              </span>
            </div>
            <span className="text-xs font-bold text-white font-mono tracking-tight">{panchang.sunset}</span>
          </div>

          <div className="bg-black/25 rounded-xl px-2.5 py-2 border border-white/10 text-center">
            <div className="flex items-center justify-center space-x-1 text-[#75d789] mb-0.5">
              <Clock className="w-3.5 h-3.5 text-[#75d789] stroke-[2.2]" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                {language === 'bn' ? 'অভিজিৎ' : 'Abhijit'}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-200 font-mono tracking-tight">
              {muhurta.abhijitMuhurta ? muhurta.abhijitMuhurta.start : '11:42 AM'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Top Promotional Banner Ad (Controlled via /suryasiddha/admin.html) */}
      {adminConfig.ads?.topBanner?.enabled && (
        <TopBannerAd config={adminConfig.ads.topBanner} />
      )}


      {/* 4. BEGIN: AstrologicalServicesGrid (Spacious 2-Column Responsive Card Grid) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-3.5 bg-[#9c1b1b] rounded-full" />
            <h2 className="text-xs font-serif font-bold tracking-wider uppercase text-[#1e1b18]">
              {language === 'bn' ? 'জ্যোতিষ ও বৈদিক সেবা' : 'Astrological Services & Calculators'}
            </h2>
          </div>
          <span className="text-[10.5px] font-medium text-[#59413e]">
            {language === 'bn' ? '১৮টি বৈদিক সেবা' : '18 Vedic Engines'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {categories.map((cat) => {
            const primaryTitle = language === 'bn' ? cat.bengali : cat.title;
            const secondaryTitle = language === 'bn' ? cat.title : cat.bengali;

            return (
              <button
                key={cat.id}
                onClick={cat.action}
                className="group bg-white rounded-2xl p-3 border border-[#e6d5b8] shadow-card flex items-start text-left gap-2.5 hover:border-[#d97706] hover:shadow-level-2 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs ${cat.iconBg}`}
                >
                  {cat.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-xs font-bold text-[#1e1b18] group-hover:text-[#9c1b1b] truncate ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>
                    {primaryTitle}
                  </h3>
                  <span className={`text-[10px] font-semibold text-[#904d00] block truncate -mt-0.5 ${language === 'bn' ? 'font-sans' : 'font-bengali'}`}>
                    {secondaryTitle}
                  </span>
                  <p className="text-[10px] text-[#59413e] mt-0.5 line-clamp-1 leading-tight font-sans">
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. BEGIN: DailyRashiHoroscope (Stitch Horizontal Zodiac Ribbon) */}
      <section className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#9c1b1b] font-bold">✨</span>
            <h2 className="text-xs font-serif font-bold tracking-wider uppercase text-[#1e1b18]">
              {language === 'bn' ? (
                <>
                  <span className="font-bengali normal-case font-bold text-sm text-[#9c1b1b]">দৈনিক রাশিফল</span> • Daily Horoscope
                </>
              ) : (
                <>
                  Daily Rashi Bhavishya • <span className="font-bengali normal-case font-semibold text-sm text-[#9c1b1b]">দৈনিক রাশিফল</span>
                </>
              )}
            </h2>
          </div>
          <button
            onClick={() => setActiveModal('horoscope')}
            className="text-[11px] font-semibold text-[#9c1b1b] hover:underline flex items-center cursor-pointer"
          >
            <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
            <ChevronRight className="w-3 h-3 ml-0.5 stroke-[2.5]" />
          </button>
        </div>

        <div className="flex space-x-2.5 overflow-x-auto pb-2 pt-1 hide-scrollbar -mx-4 px-4">
          {BENGALI_RASHIS.map((rashi, idx) => {
            const isSelected = selectedRashiIndex === idx;
            const primaryRashi = language === 'bn' ? rashi.bengali : rashi.name;
            const secondaryRashi = language === 'bn' ? rashi.name : rashi.bengali;

            return (
              <button
                key={rashi.name}
                onClick={() => {
                  setSelectedRashiIndex(idx);
                  setActiveModal('horoscope');
                }}
                className={`flex-shrink-0 w-16 py-2 px-1 rounded-xl flex flex-col items-center transition cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#9c1b1b] to-[#790009] border-2 border-[#fbbf24] shadow-md ring-2 ring-[#9c1b1b]/20 text-white'
                    : 'bg-white border border-[#e6d5b8] shadow-card hover:border-[#d97706]'
                }`}
              >
                <span className={`text-base ${isSelected ? 'text-[#fbbf24]' : ''}`}>{rashi.glyph}</span>
                <span className={`text-[10.5px] mt-0.5 truncate ${language === 'bn' ? 'font-bengali font-bold' : 'font-bold'} ${isSelected ? 'text-white' : 'text-[#1e1b18]'}`}>
                  {primaryRashi}
                </span>
                <span className={`text-[9px] truncate ${language === 'bn' ? 'font-sans' : 'font-bengali'} ${isSelected ? 'text-amber-200 font-semibold' : 'text-[#59413e]'}`}>
                  {secondaryRashi}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. BEGIN: TodayKeyMuhurtas (Stitch 4-Grid Card) */}
      <section className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#d97706]" />
            <h2 className="text-xs font-serif font-bold tracking-wider uppercase text-[#1e1b18]">
              {language === 'bn' ? 'আজকের প্রধান মুহূর্ত (শুভ ও অশুভ কাল)' : "Today's Key Muhurtas"}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('muhurta')}
            className="text-[11px] font-semibold text-[#9c1b1b] hover:underline flex items-center cursor-pointer"
          >
            <span>{language === 'bn' ? 'সম্পূর্ণ সময়সূচি' : 'Full Timeline'}</span>
            <ChevronRight className="w-3 h-3 ml-0.5 stroke-[2.5]" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Abhijit */}
          <div className="bg-[#dcfce7]/70 border border-emerald-300 rounded-xl p-2.5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Abhijit</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#15803d] font-bold border border-emerald-300">
                Shubha
              </span>
            </div>
            <div className="mt-1 font-mono font-bold text-xs text-emerald-950">
              {muhurta.abhijitMuhurta ? `${muhurta.abhijitMuhurta.start} – ${muhurta.abhijitMuhurta.end}` : '11:42 – 12:28'}
            </div>
            <p className="text-[9.5px] text-[#15803d] font-medium mt-0.5 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" /> Highly Auspicious
            </p>
          </div>

          {/* Rahu Kaal */}
          <div className="bg-[#fee2e2]/70 border border-rose-300 rounded-xl p-2.5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wide">Rahu Kaal</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-100 text-[#9c1b1b] font-bold border border-rose-300">
                Ashubha
              </span>
            </div>
            <div className="mt-1 font-mono font-bold text-xs text-rose-950">
              {muhurta.rahuKaal.start} – {muhurta.rahuKaal.end}
            </div>
            <p className="text-[9.5px] text-[#9c1b1b] font-medium mt-0.5 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1" /> Inauspicious
            </p>
          </div>

          {/* Yamaganda */}
          <div className="bg-[#fef3c7]/70 border border-amber-300 rounded-xl p-2.5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide">Yamaganda</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-[#b45309] font-bold border border-amber-300">
                Avoid
              </span>
            </div>
            <div className="mt-1 font-mono font-bold text-xs text-amber-950">
              {muhurta.yamaganda.start} – {muhurta.yamaganda.end}
            </div>
            <p className="text-[9.5px] text-[#b45309] font-medium mt-0.5 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" /> Avoid Beginnings
            </p>
          </div>

          {/* Gulika Kaal */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-2.5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wide">Gulika Kaal</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                Shani
              </span>
            </div>
            <div className="mt-1 font-mono font-bold text-xs text-indigo-950">
              {muhurta.gulikaKaal.start} – {muhurta.gulikaKaal.end}
            </div>
            <p className="text-[9.5px] text-indigo-700 font-medium mt-0.5 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1" /> Neutral / Saturn
            </p>
          </div>
        </div>
      </section>

      {/* 7. BEGIN: VedicStorePromo (Stitch Consecrated Yantras Card) */}
      <section className="rounded-xl bg-[#fff8f4] border border-[#e6d5b8] p-3.5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-lg bg-[#fef3c7] border border-[#fbbf24] flex items-center justify-center text-[#9c1b1b] shadow-inner flex-shrink-0 font-bengali text-lg font-bold">
              শ্রী
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#9c1b1b]">
                RECOMMENDED FOR YOU
              </span>
              <h4 className="text-xs font-bold text-[#1e1b18] leading-snug">
                Consecrated Yantras & Gemstones
              </h4>
              <p className="text-[10.5px] text-[#59413e] leading-tight mt-0.5">
                100% Certified Vedic Kavach for Graha Shanti.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('remedies')}
            className="bg-[#1e1b18] hover:bg-black text-[#fef3c7] px-3 py-2 rounded-lg text-[10.5px] font-bold whitespace-nowrap shadow-sm active:scale-95 transition flex items-center space-x-1 cursor-pointer"
          >
            <span>Visit Store</span>
            <ChevronRight className="w-3 h-3 text-[#fbbf24] stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* 8. Bottom In-Feed Ad Banner (Google AdMob / AdSense) */}
      {adminConfig.ads?.inlineCard && (
        <InlineAdCard config={adminConfig.ads.inlineCard} />
      )}

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-full bg-sacred-charcoal text-amber-100 text-xs font-bold px-4 py-2 shadow-2xl flex items-center gap-2 border border-turmeric-500/40 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: DAILY HOROSCOPE (RASHIFAL)                          */}
      {/* ============================================================ */}
      {activeModal === 'horoscope' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#fff8f4] p-5 shadow-2xl border border-[#e6d5b8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-parchment-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-temple to-temple-crimson text-white shadow-sm ring-2 ring-turmeric-400/30">
                  <Sparkles className="w-4 h-4 text-turmeric-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-sacred-ink">
                    Daily Horoscope • <span className="font-bengali text-temple">দৈনিক রাশিফল</span>
                  </h3>
                  <p className="text-[10px] text-sacred-muted">
                    Based on Vedic Moon Transit & Solar House
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full p-1.5 text-sacred-muted hover:bg-neutral-200/60 hover:text-sacred-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rashi Selector Tabs */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {BENGALI_RASHIS.map((rashi, idx) => (
                <button
                  key={rashi.name}
                  onClick={() => setSelectedRashiIndex(idx)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedRashiIndex === idx
                      ? 'bg-temple text-white shadow-xs'
                      : 'bg-white border border-parchment-border text-sacred-charcoal hover:bg-amber-50'
                  }`}
                >
                  {rashi.glyph} {rashi.name} ({rashi.bengali})
                </button>
              ))}
            </div>

            {/* Selected Rashi Detail Card */}
            {(() => {
              const currentRashi = RASHIS[selectedRashiIndex];
              const ben = BENGALI_RASHIS[selectedRashiIndex];
              return (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-temple via-[#962020] to-temple-dark p-4 text-white shadow-md border border-amber-900/30">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl text-turmeric-400">{ben.glyph}</span>
                      <div>
                        <h4 className="text-lg font-serif font-black">{ben.name} ({ben.bengali})</h4>
                        <p className="text-xs text-amber-200/90 font-medium">
                          Ruling Planet: {currentRashi.lord} • Element: {currentRashi.element}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-parchment-border bg-white p-2.5">
                      <span className="text-[10px] font-bold text-sacred-muted block">Lucky Number</span>
                      <span className="font-mono font-black text-temple text-sm">
                        {((selectedRashiIndex * 3 + 4) % 9) + 1}
                      </span>
                    </div>
                    <div className="rounded-xl border border-parchment-border bg-white p-2.5">
                      <span className="text-[10px] font-bold text-sacred-muted block">Lucky Color</span>
                      <span className="font-bold text-sacred-ink text-sm">
                        {['Crimson', 'Emerald', 'Yellow', 'White', 'Golden', 'Green', 'Sky Blue', 'Maroon', 'Orange', 'Navy Blue', 'Cyan', 'Sea Green'][selectedRashiIndex]}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-parchment-border bg-white p-3.5 space-y-2 text-xs leading-relaxed text-sacred-charcoal">
                    <h5 className="font-serif font-bold text-sacred-ink flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-turmeric-500" />
                      Today's Planetary Influence
                    </h5>
                    <p>
                      Moon transit brings favorable alignments for creative pursuits, communication, and financial planning. Take decisive action during auspicious morning hours.
                    </p>
                    <p className="border-t border-parchment-border pt-2 text-sacred-muted">
                      <strong>Remedy:</strong> Chant the Gayatri Mantra in the morning and offer water to Surya Dev for peace and sustained focus.
                    </p>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-turmeric-500 to-turmeric-700 hover:from-turmeric-600 hover:to-turmeric-800 text-sacred-ink font-bold py-2.5 text-xs shadow-md active:scale-95 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: GOCHARA (TRANSIT OF PLANETS)                        */}
      {/* ============================================================ */}
      {activeModal === 'gochara' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#fff8f4] p-5 shadow-2xl border border-[#e6d5b8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-parchment-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-temple to-temple-crimson text-white shadow-sm ring-2 ring-turmeric-400/30">
                  <Orbit className="w-4 h-4 text-turmeric-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-sacred-ink">
                    Planetary Gochara • <span className="font-bengali text-temple">গ্রহ গোচর</span>
                  </h3>
                  <p className="text-[10px] text-sacred-muted">
                    Live Planetary Positions • Swiss Ephemeris
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full p-1.5 text-sacred-muted hover:bg-neutral-200/60 hover:text-sacred-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {calendarData.planetList.map((planet) => (
                <div
                  key={planet.name}
                  className="flex items-center justify-between rounded-xl border border-parchment-border bg-white p-2.5 text-xs shadow-card"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sacred-ink">{planet.name}</span>
                    {planet.isRetrograde && (
                      <span className="rounded bg-rose-100 px-1 py-0.2 text-[9px] font-black text-rose-700">
                        RETROGRADE (ব)
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-sacred-charcoal">{planet.rashiName}</span>
                    <span className="ml-2 font-mono text-temple font-bold">
                      {Math.floor(planet.degreesInRashi)}° {Math.floor((planet.degreesInRashi % 1) * 60)}'
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-turmeric-500 to-turmeric-700 hover:from-turmeric-600 hover:to-turmeric-800 text-sacred-ink font-bold py-2.5 text-xs shadow-md active:scale-95 transition cursor-pointer"
            >
              Close Gochara
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: NUMEROLOGY (অঙ্ক জ্যোতিষ)                           */}
      {/* ============================================================ */}
      {activeModal === 'numerology' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#fff8f4] p-5 shadow-2xl border border-[#e6d5b8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-parchment-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-temple to-temple-crimson text-white shadow-sm ring-2 ring-turmeric-400/30">
                  <Hash className="w-4 h-4 text-turmeric-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-sacred-ink">
                    Vedic Numerology • <span className="font-bengali text-temple">অঙ্ক জ্যোতিষ</span>
                  </h3>
                  <p className="text-[10px] text-sacred-muted">
                    Based on Birth Date: {profile.dob} ({profile.name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full p-1.5 text-sacred-muted hover:bg-neutral-200/60 hover:text-sacred-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-card">
                <span className="text-xs font-serif font-bold text-temple uppercase block">Moolank (মूलाংক)</span>
                <span className="font-serif text-4xl font-black text-temple mt-1 block">
                  {numerologyData.moolank}
                </span>
                <span className="text-[10px] text-sacred-muted font-medium block mt-1">Radical / Day Number</span>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-card">
                <span className="text-xs font-serif font-bold text-temple uppercase block">Bhagyank (ভাগ্যাংক)</span>
                <span className="font-serif text-4xl font-black text-turmeric-700 mt-1 block">
                  {numerologyData.bhagyank}
                </span>
                <span className="text-[10px] text-sacred-muted font-medium block mt-1">Destiny / Life Path</span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-parchment-border bg-white p-3.5 space-y-2 text-xs text-sacred-charcoal">
              <h5 className="font-serif font-bold text-sacred-ink">Numerological Archetype Insights:</h5>
              <p>
                <strong>Ruling Celestial:</strong> {['Surya (Sun)', 'Chandra (Moon)', 'Guru (Jupiter)', 'Rahu', 'Budha (Mercury)', 'Shukra (Venus)', 'Ketu', 'Shani (Saturn)', 'Mangal (Mars)'][numerologyData.moolank - 1]}
              </p>
              <p>
                <strong>Key Strengths:</strong> Leadership, intuition, resilience, and philosophical perspective.
              </p>
              <p>
                <strong>Harmonious Numbers:</strong> {[1, 3, 5, 9][(numerologyData.moolank) % 4]} and {[2, 4, 7, 8][(numerologyData.bhagyank) % 4]}
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-turmeric-500 to-turmeric-700 hover:from-turmeric-600 hover:to-turmeric-800 text-sacred-ink font-bold py-2.5 text-xs shadow-md active:scale-95 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: REMEDIES & GEMSTONES (রত্ন প্রতিকার)                */}
      {/* ============================================================ */}
      {activeModal === 'remedies' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#fff8f4] p-5 shadow-2xl border border-[#e6d5b8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-parchment-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-temple to-temple-crimson text-white shadow-sm ring-2 ring-turmeric-400/30">
                  <Gem className="w-4 h-4 text-turmeric-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-sacred-ink">
                    Vedic Remedies & Gemstones • <span className="font-bengali text-temple">রত্ন প্রতিকার</span>
                  </h3>
                  <p className="text-[10px] text-sacred-muted">
                    Auspicious Ratna, Mantras, and Rudraksha Guidance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full p-1.5 text-sacred-muted hover:bg-neutral-200/60 hover:text-sacred-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-turmeric-400/40 bg-white p-3.5 text-xs shadow-card">
                <span className="font-serif font-bold text-temple block text-sm">Recommended Gemstone (ভাগ্য রত্ন)</span>
                <p className="text-sacred-charcoal mt-1">
                  <strong>Yellow Sapphire (পোখরাজ)</strong> or <strong>Ruby (চুনী / মাণিক্য)</strong> to fortify benefic planetary placements. Always consult an astrologer before wearing.
                </p>
              </div>

              <div className="rounded-2xl border border-turmeric-400/40 bg-white p-3.5 text-xs shadow-card">
                <span className="font-serif font-bold text-temple block text-sm">Vedic Mantra Sadhana (মন্ত্র সাধনা)</span>
                <p className="text-temple mt-1 font-serif italic font-bold">
                  "ॐ হ্ৰাং হ্ৰীং হ্ৰৌং সঃ সূৰ্যায নমঃ"
                </p>
                <p className="text-sacred-muted text-[10px] mt-1">
                  Chant 108 times daily at sunrise for vitality, confidence, and radiant health.
                </p>
              </div>

              <div className="rounded-2xl border border-turmeric-400/40 bg-white p-3.5 text-xs shadow-card">
                <span className="font-serif font-bold text-temple block text-sm">Rudraksha Recommendation</span>
                <p className="text-sacred-charcoal mt-1">
                  <strong>5-Mukhi Rudraksha (পঞ্চমুখী রুদ্রাক্ষ)</strong> represents Lord Shiva (Kalagni Rudra). Brings mental calm and shields against adverse vibrations.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-turmeric-500 to-turmeric-700 hover:from-turmeric-600 hover:to-turmeric-800 text-sacred-ink font-bold py-2.5 text-xs shadow-md active:scale-95 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: PRASHNA KUNDLI (প্রশ্নকুণ্ডলী)                     */}
      {/* ============================================================ */}
      {activeModal === 'prashna' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#fff8f4] p-5 shadow-2xl border border-[#e6d5b8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-parchment-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-temple to-temple-crimson text-white shadow-sm ring-2 ring-turmeric-400/30">
                  <HelpCircle className="w-4 h-4 text-turmeric-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-sacred-ink">
                    Prashna Kundli • <span className="font-bengali text-temple">প্রশ্নকুণ্ডলী</span>
                  </h3>
                  <p className="text-[10px] text-sacred-muted">
                    Horary Query Chart for Right Now
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full p-1.5 text-sacred-muted hover:bg-neutral-200/60 hover:text-sacred-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-parchment-border bg-white p-4 text-center shadow-card">
              <span className="text-xs font-serif font-bold uppercase text-sacred-muted block">Current Horary Lagna</span>
              <span className="font-serif text-2xl font-black text-temple mt-1 block">
                {panchang.tithi.name}
              </span>
              <p className="text-xs text-sacred-charcoal font-medium mt-1">
                Moon in {panchang.nakshatra.name} (Pada {panchang.nakshatra.pada})
              </p>
            </div>

            <div className="mt-3 rounded-2xl border border-parchment-border bg-white p-3.5 text-xs text-sacred-charcoal leading-relaxed shadow-card">
              <h5 className="font-serif font-bold text-sacred-ink">Prashna Shastra Rule:</h5>
              <p className="mt-1">
                Concentrate silently on your query for 3 deep breaths before seeking answer. The Ascendant lord in harmony with the Moon indicates a swift, positive resolution to the question.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                onNavigate('kundli', 'chart');
              }}
              className="mt-4 w-full rounded-xl bg-temple hover:bg-temple-crimson text-white font-bold py-2.5 text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <span>Inspect Full Natal Chart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: FESTIVALS & VRAT (ব্রত-উৎসব)                       */}
      {/* ============================================================ */}
      {activeModal === 'festivals' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#fff8f4] p-5 shadow-2xl border border-[#e6d5b8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-parchment-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-temple to-temple-crimson text-white shadow-sm ring-2 ring-turmeric-400/30">
                  <Moon className="w-4 h-4 text-turmeric-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-sacred-ink">
                    Vrat & Festivals • <span className="font-bengali text-temple">ব্রত-উৎসব</span>
                  </h3>
                  <p className="text-[10px] text-sacred-muted">
                    Auspicious Parvas & Fasting Days
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full p-1.5 text-sacred-muted hover:bg-neutral-200/60 hover:text-sacred-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {[
                { name: 'Vijaya Ekadashi Vrat', bengali: 'বিজয়া একাদশী ব্রত', tag: 'VRAT', date: 'Upcoming Shukla Ekadashi' },
                { name: 'Maha Shivratri', bengali: 'মহা শিবরাত্রি', tag: 'PARVA', date: 'Krishna Chaturdashi' },
                { name: 'Pradosh Vrat', bengali: 'প্রদোষ ব্রত', tag: 'SHIVA PUJA', date: 'Trayodashi Tithi' },
                { name: 'Holi / Yaoshang', bengali: 'হোলিকা দহন / য়াওশঙ', tag: 'FESTIVAL', date: 'Phalguna Purnima' },
                { name: 'Chaitra Navratri / Cheiraoba', bengali: 'নব সংবৎসর / চৈরাউবা', tag: 'NEW YEAR', date: 'Chaitra Shukla Pratipada' },
              ].map((fest, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-parchment-border bg-white p-3 text-xs shadow-card"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sacred-ink">{fest.name}</span>
                      <span className="rounded bg-temple/10 px-1.5 py-0.2 text-[9px] font-black text-temple">
                        {fest.tag}
                      </span>
                    </div>
                    <span className="text-[10px] font-bengali font-semibold text-amber-700 block mt-0.5">{fest.bengali}</span>
                  </div>
                  <span className="text-[11px] font-mono text-sacred-muted font-bold">{fest.date}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                onNavigate('panchang');
              }}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-turmeric-500 to-turmeric-700 hover:from-turmeric-600 hover:to-turmeric-800 text-sacred-ink font-bold py-2.5 text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <span>Open Monthly Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 7: ABOUT US & EPHEMERIS CREDITS                       */}
      {/* ============================================================ */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#fff8f4] p-5 shadow-2xl border border-[#e6d5b8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-parchment-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-temple to-temple-crimson text-white shadow-sm ring-2 ring-turmeric-400/30">
                  <Sun className="w-4 h-4 text-turmeric-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-sacred-ink">
                    About Panjika • <span className="font-bengali text-temple">পঞ্জিকা</span>
                  </h3>
                  <p className="text-[10px] text-sacred-muted">
                    High-Precision Vedic Astronomy & Horoscope Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full p-1.5 text-sacred-muted hover:bg-neutral-200/60 hover:text-sacred-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-sacred-charcoal leading-relaxed">
              <p>
                <strong>Panjika (SuryaSiddha)</strong> is engineered to deliver classical Indian Vedic Panchang, Natal Kundli, Dasha telemetry, and Muhurta computations calculated according to the astronomical parameters established in the classic <em>Surya Siddhanta</em> combined with the high-precision <strong>Swiss Ephemeris</strong>.
              </p>

              <div className="rounded-2xl border border-parchment-border bg-white p-3 space-y-1.5 shadow-card">
                <div className="flex justify-between">
                  <span className="font-semibold text-sacred-muted">Application Version:</span>
                  <span className="font-mono font-bold text-sacred-ink">1.0.3 (Build 4)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-sacred-muted">Default Ayanamsha:</span>
                  <span className="font-mono font-bold text-sacred-ink">Lahiri (Chitra Paksha 24°05')</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-sacred-muted">Astronomical Standard:</span>
                  <span className="font-mono font-bold text-sacred-ink">Moshier / Swiss Ephemeris</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-sacred-muted">Admin Synchronization:</span>
                  <span className="font-mono font-bold text-emerald-700">Cloud Central Enabled</span>
                </div>
              </div>

              <p className="text-sacred-muted text-[11px]">
                Maintained & published by Kanglei Astro Solutions. All astronomical equations are calculated offline directly on your device.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-4 w-full rounded-xl bg-sacred-charcoal hover:bg-black text-amber-200 font-bold py-2.5 text-xs shadow-md active:scale-95 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
