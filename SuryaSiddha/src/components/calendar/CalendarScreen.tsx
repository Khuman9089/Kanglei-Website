// components/calendar/CalendarScreen.tsx
// Authentic Vedic & Bengali Panjika Calendar Screen (পার্বণ ও উৎসব)
// Implements Google Stitch Design System: Deep Vermilion (#790009), Marigold (#fe932c), Parchment (#fff8f4), Hairline (#e6d5b8)
// Features: Auto-defaults to Today's date, Dynamic Day Almanac & Muhurats, All 12 Bengali Months, Full Language Switching (Bengali/English)

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Clock,
  BookOpen,
  Coins,
  Flower2,
  Bell,
  Check,
  Download,
  CalendarDays,
  Flame,
  ArrowRight,
  X,
  FileText,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { UserBirthProfile, KundliData } from '../../types/astronomy';
import { AdminAppConfig } from '../../types/admin';
import { MainTabType } from '../navigation/BottomNavigation';
import { calculatePanchang } from '../../utils/astronomy/panchang';
import { calculateAuspiciousTimes } from '../../utils/astronomy/muhurta';

interface CalendarScreenProps {
  currentDate: string;
  profile: UserBirthProfile;
  calendarData: KundliData;
  adminConfig: AdminAppConfig;
  language?: 'bn' | 'en';
  onDateChange: (date: string) => void;
  onNavigate: (tab: MainTabType, subTab?: string) => void;
}

export type FestivalCategory = 'all' | 'ekadashi' | 'purnima_amavasya' | 'vrata_puja';

interface FestivalItem {
  id: string;
  nameBengali: string;
  nameEnglish: string;
  bengaliDay: number;
  gregorianDay: number;
  gregorianMonth: string;
  gregorianYear: number;
  dayOfWeekBn: string;
  dayOfWeekEn: string;
  category: FestivalCategory;
  tagBn: string;
  tagEn: string;
  tagType: 'cultural' | 'maha_shubho' | 'upavasa' | 'snan_dana' | 'puja';
  descriptionBn: string;
  descriptionEn: string;
  sunriseSunset?: string;
  muhuratHighlight?: {
    labelBn: string;
    labelEn: string;
    time: string;
    tithiStart?: string;
    tithiEnd?: string;
  };
  fastingWindow?: {
    start: string;
    parana: string;
  };
  snanTiming?: string;
}

interface BengaliMonthDef {
  nameBengali: string;
  nameEnglish: string;
  bengaliYear: number;
  gregorianRangeBn: string;
  gregorianRangeEn: string;
  rituBengali: string;
  rituEnglish: string;
  monthTagBn: string;
  monthTagEn: string;
  totalDays: number;
  startWeekday: number; // 0=Sun, 1=Mon, ..., 6=Sat
  gregorianStartDay: number;
  gregorianStartMonth: number; // 1-12
  gregorianStartYear: number;
  maheName: string;
  significanceTitleBn: string;
  significanceTitleEn: string;
  significanceDescBn: string;
  significanceDescEn: string;
  festivals: FestivalItem[];
}

// Complete 12 Months of Bengali Panjika Templates (Boishakh to Chaitra)
const BENGALI_MONTHS_RAW: BengaliMonthDef[] = [
  // 1. Boishakh
  {
    nameBengali: 'বৈশাখ ১৪৩১',
    nameEnglish: 'Boishakh 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'এপ্রিল – মে ২০২৪',
    gregorianRangeEn: 'April – May 2024',
    rituBengali: 'গ্রীষ্ম ঋতু',
    rituEnglish: 'Grishma Ritu',
    monthTagBn: 'নববর্ষ মাস',
    monthTagEn: 'New Year Month',
    totalDays: 31,
    startWeekday: 0,
    gregorianStartDay: 14,
    gregorianStartMonth: 4,
    gregorianStartYear: 2024,
    maheName: 'MAHE BAISHAKH',
    significanceTitleBn: 'বৈশাখী অক্ষয় প্রাচুর্য ও গৃহপূজা',
    significanceTitleEn: 'Boishakhi Akshaya Abundance & Domestic Rites',
    significanceDescBn: 'বৈশাখ মাস সৌর বছরের সূচনা করে। অক্ষয় তৃতীয়া ও নববর্ষের পুণ্যলগ্নে স্নান, দান ও হালখাতা নবীকরণ সম্পন্ন করুন।',
    significanceDescEn: 'The month of Boishakh initiates the Bengali solar cycle. Ensure ritual snans, charity, and Halkhata business renewals are observed.',
    festivals: [
      {
        id: 'pohela_boishakh',
        nameBengali: 'পহেলা বৈশাখ (শুভ নববর্ষ)',
        nameEnglish: 'Pohela Boishakh (Bengali New Year)',
        bengaliDay: 1,
        gregorianDay: 14,
        gregorianMonth: 'Apr',
        gregorianYear: 2024,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'vrata_puja',
        tagBn: 'নববর্ষ',
        tagEn: 'Nabobarsho',
        tagType: 'cultural',
        descriptionBn: 'বাংলা সনের প্রথম দিন। হালখাতা শুভ মহরত, কালীঘাট ও দক্ষিণেশ্বরে মঙ্গলপূজা এবং প্রভাতী সঙ্গীতানুষ্ঠান।',
        descriptionEn: 'First day of the Bengali solar calendar. Halkhata opening ceremony, temple visits to Kalighat, and celebrations.',
        sunriseSunset: 'Sunrise: 05:22 AM • Sunset: 05:58 PM',
      },
      {
        id: 'rabindra_jayanti',
        nameBengali: 'রবীন্দ্র জয়ন্তী',
        nameEnglish: 'Rabindra Jayanti',
        bengaliDay: 25,
        gregorianDay: 8,
        gregorianMonth: 'May',
        gregorianYear: 2024,
        dayOfWeekBn: 'বুধবার',
        dayOfWeekEn: 'Wednesday',
        category: 'vrata_puja',
        tagBn: 'সাংস্কৃতিক পর্ব',
        tagEn: 'Cultural Observance',
        tagType: 'cultural',
        descriptionBn: 'বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের জন্মবার্ষিকী। প্রভাতফেরি, রবীন্দ্রসঙ্গীত ও সাহিত্য আরাধনায় মুখরিত বাংলার প্রাতঃকাল।',
        descriptionEn: 'Birth anniversary of Gurudev Rabindranath Tagore. Marked by morning Prabhat Pheri, prayer songs, and recitals.',
        sunriseSunset: 'Sunrise: 05:04 AM • Sunset: 06:11 PM',
      },
      {
        id: 'akshaya_tritiya',
        nameBengali: 'অক্ষয় তৃতীয়া',
        nameEnglish: 'Akshaya Tritiya',
        bengaliDay: 27,
        gregorianDay: 10,
        gregorianMonth: 'May',
        gregorianYear: 2024,
        dayOfWeekBn: 'শুক্রবার',
        dayOfWeekEn: 'Friday',
        category: 'vrata_puja',
        tagBn: 'মহা শুভ লগ্ন',
        tagEn: 'Maha Shubho',
        tagType: 'maha_shubho',
        descriptionBn: 'স্বর্ণ ক্রয়, নতুন ব্যবসা, গৃহপ্রবেশ ও মাঙ্গলিক কর্মের শ্রেষ্ঠ দিন। অক্ষয় পুণ্য প্রাপ্তি ঘটে।',
        descriptionEn: 'Supreme auspicious day for gold purchase, business ledger renewal (Halkhata), and Griha Pravesh.',
        muhuratHighlight: {
          labelBn: 'স্বর্ণ ক্রয়ের শুভ মুহূর্ত',
          labelEn: 'Gold Buying Muhurat',
          time: '05:33 AM to 12:18 PM',
          tithiStart: '10 May, 04:17 AM',
          tithiEnd: '11 May, 02:50 AM',
        },
      },
      {
        id: 'mohini_ekadashi',
        nameBengali: 'মোহিনী একাদশী',
        nameEnglish: 'Mohini Ekadashi',
        bengaliDay: 31,
        gregorianDay: 19,
        gregorianMonth: 'May',
        gregorianYear: 2024,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'ekadashi',
        tagBn: 'উপবাস ব্রত',
        tagEn: 'Upavasa (Fasting)',
        tagType: 'upavasa',
        descriptionBn: 'ভগবান শ্রীবিষ্ণুর মোহিনী রূপের স্মরণে পরম কল্যাণময়ী একাদশী ব্রত। যাবতীয় পাপ ও মোহ ক্ষয় হয়।',
        descriptionEn: 'Sacred fast dedicated to Lord Vishnu’s Mohini incarnation. Grants spiritual peace and karmic absolution.',
        fastingWindow: {
          start: 'May 18, 11:22 PM',
          parana: 'May 20, 05:01 AM – 08:34 AM',
        },
      },
    ],
  },

  // 2. Jaishtha
  {
    nameBengali: 'জ্যৈষ্ঠ ১৪৩১',
    nameEnglish: 'Jaishtha 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'মে – জুন ২০২৪',
    gregorianRangeEn: 'May – June 2024',
    rituBengali: 'গ্রীষ্ম ঋতু',
    rituEnglish: 'Grishma Ritu',
    monthTagBn: 'রথপূর্ব মাস',
    monthTagEn: 'Pre-Rath Month',
    totalDays: 31,
    startWeekday: 3,
    gregorianStartDay: 15,
    gregorianStartMonth: 5,
    gregorianStartYear: 2024,
    maheName: 'MAHE JAISHTHA',
    significanceTitleBn: 'জামাই ষষ্ঠী ও গঙ্গা দশহরা স্নান',
    significanceDescBn: 'জ্যৈষ্ঠ মাসে ফলবতী বৃক্ষের পূজা, দশবিধ পাপ বিনাশিনী গঙ্গা দশহরা এবং পারিবারিক সৌহার্দ্যের প্রতীক জামাই ষষ্ঠী পালিত হয়।',
    significanceTitleEn: 'Jamai Sasthi & Holy Ganga Dussehra',
    significanceDescEn: 'Observance of Ganga Dussehra bathings, honorific familial bonding on Jamai Sasthi, and strict Nirjala Ekadashi.',
    festivals: [
      {
        id: 'jamai_sasthi',
        nameBengali: 'জামাই ষষ্ঠী',
        nameEnglish: 'Jamai Sasthi',
        bengaliDay: 29,
        gregorianDay: 12,
        gregorianMonth: 'Jun',
        gregorianYear: 2024,
        dayOfWeekBn: 'বুধবার',
        dayOfWeekEn: 'Wednesday',
        category: 'vrata_puja',
        tagBn: 'পারিবারিক পুজো',
        tagEn: 'Family Blessing',
        tagType: 'cultural',
        descriptionBn: 'মা ষষ্ঠীর কৃপায় জামাতাদের দীর্ঘায়ু ও সৌভাগ্য কামনায় ঐতিহ্যবাহী পারিবারিক উৎসব।',
        descriptionEn: 'Traditional celebration honoring sons-in-law with fresh mangoes and Mother Shasthi’s blessings.',
      },
      {
        id: 'nirjala_ekadashi',
        nameBengali: 'নির্জলা একাদশী (ভীম একাদশী)',
        nameEnglish: 'Nirjala Ekadashi',
        bengaliDay: 35,
        gregorianDay: 18,
        gregorianMonth: 'Jun',
        gregorianYear: 2024,
        dayOfWeekBn: 'মঙ্গলবার',
        dayOfWeekEn: 'Tuesday',
        category: 'ekadashi',
        tagBn: 'মহা উপবাস',
        tagEn: 'Maha Upavasa',
        tagType: 'upavasa',
        descriptionBn: 'বছরের ২৪টি একাদশীর মধ্যে সর্বশ্রেষ্ঠ ব্রত। জলগ্রহণ ব্যতিরেকে পালিত হয়। চব্বিশটি একাদশীর সমান পুণ্যলাভ।',
        descriptionEn: 'The strictest of all 24 Ekadashis observed without drinking water. Bestows virtue of the entire year.',
        fastingWindow: {
          start: 'Jun 17, 04:43 AM',
          parana: 'Jun 19, 04:53 AM – 07:28 AM',
        },
      },
    ],
  },

  // 3. Ashadha
  {
    nameBengali: 'আষাঢ় ১৪৩১',
    nameEnglish: 'Ashadha 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'জুন – জুলাই ২০২৪',
    gregorianRangeEn: 'June – July 2024',
    rituBengali: 'বর্ষা ঋতু',
    rituEnglish: 'Varsha Ritu',
    monthTagBn: 'রথযাত্রা মাস',
    monthTagEn: 'Ratha Yatra Month',
    totalDays: 31,
    startWeekday: 6,
    gregorianStartDay: 15,
    gregorianStartMonth: 6,
    gregorianStartYear: 2024,
    maheName: 'MAHE ASHADHA',
    significanceTitleBn: 'শ্রীশ্রী জগন্নাথ রথযাত্রা ও চতুর্মাস্য ব্রত',
    significanceDescBn: 'আষাঢ়ের বর্ষার আগমন ও ভগবান জগন্নাথের গুণ্ডিচা যাত্রা। দেবশয়নী একাদশী থেকে চার মাসের চতুর্মাস্য ব্রত আরম্ভ হয়।',
    significanceTitleEn: 'Jagannath Ratha Yatra & Chaturmasya',
    significanceDescEn: 'Monsoon arrival, chariot procession of Lord Jagannath, and commencement of the holy 4-month Chaturmasya.',
    festivals: [
      {
        id: 'ratha_yatra',
        nameBengali: 'শ্রীশ্রী রথযাত্রা',
        nameEnglish: 'Ratha Yatra',
        bengaliDay: 22,
        gregorianDay: 7,
        gregorianMonth: 'Jul',
        gregorianYear: 2024,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'vrata_puja',
        tagBn: 'মহা মহোৎসব',
        tagEn: 'Maha Mahotsav',
        tagType: 'maha_shubho',
        descriptionBn: 'জগন্নাথ, বলভদ্র ও সুভদ্রার রথারোহণ। রথের রশি স্পর্শে সমস্ত পাপ মুক্ত হয়।',
        descriptionEn: 'Grand chariot journey of Lord Jagannath, Balabhadra, and Subhadra to Gundicha temple.',
      },
      {
        id: 'guru_purnima',
        nameBengali: 'গুরু পূর্ণিমা (ব্যাস পূর্ণিমা)',
        nameEnglish: 'Guru Purnima',
        bengaliDay: 36,
        gregorianDay: 21,
        gregorianMonth: 'Jul',
        gregorianYear: 2024,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'purnima_amavasya',
        tagBn: 'গুরু আরাধনা',
        tagEn: 'Veneration',
        tagType: 'cultural',
        descriptionBn: 'মহর্ষি বেদব্যাসের আরাধনা ও আধ্যাত্মিক গুরুদেবের চরণ বন্দনা।',
        descriptionEn: 'Veneration of spiritual preceptors and sage Veda Vyasa.',
      },
    ],
  },

  // 4. Shravana
  {
    nameBengali: 'শ্রাবণ ১৪৩১',
    nameEnglish: 'Shravana 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'জুলাই – আগস্ট ২০২৪',
    gregorianRangeEn: 'July – August 2024',
    rituBengali: 'বর্ষা ঋতু',
    rituEnglish: 'Varsha Ritu',
    monthTagBn: 'শিব আরাধনা মাস',
    monthTagEn: 'Shiva Worship Month',
    totalDays: 31,
    startWeekday: 2,
    gregorianStartDay: 16,
    gregorianStartMonth: 7,
    gregorianStartYear: 2024,
    maheName: 'MAHE SHRAVANA',
    significanceTitleBn: 'শ্রাবণী শিবপূজা ও ঝুলনযাত্রা',
    significanceDescBn: 'প্রতি সোমবার তারকেশ্বরে ও শিবালয়ে পবিত্র গঙ্গাজল অভিষেক, নাগপঞ্চমী পূজা এবং রাখী পূর্ণিমা।',
    significanceTitleEn: 'Shravana Shiva Puja & Jhulan Yatra',
    significanceDescEn: 'Holy Monday water offerings to Lord Shiva, Nag Panchami, Jhulan Yatra, and Raksha Bandhan.',
    festivals: [
      {
        id: 'nag_panchami',
        nameBengali: 'নাগ পঞ্চমী',
        nameEnglish: 'Nag Panchami',
        bengaliDay: 24,
        gregorianDay: 9,
        gregorianMonth: 'Aug',
        gregorianYear: 2024,
        dayOfWeekBn: 'শুক্রবার',
        dayOfWeekEn: 'Friday',
        category: 'vrata_puja',
        tagBn: 'সর্প পূজা',
        tagEn: 'Puja',
        tagType: 'puja',
        descriptionBn: 'কালসর্প দোষ শান্তি ও সর্পকুলের উপাসনায় দুগ্ধ ও লাজা নিবেদন।',
        descriptionEn: 'Worship of serpent deities for freedom from Kaal Sarp and Rahu obstacles.',
      },
      {
        id: 'raksha_bandhan',
        nameBengali: 'রাখী পূর্ণিমা ও ঝুলন সমাপ্তি',
        nameEnglish: 'Raksha Bandhan & Jhulan Samapti',
        bengaliDay: 34,
        gregorianDay: 19,
        gregorianMonth: 'Aug',
        gregorianYear: 2024,
        dayOfWeekBn: 'সোমবার',
        dayOfWeekEn: 'Monday',
        category: 'purnima_amavasya',
        tagBn: 'স্নেহের বন্ধন',
        tagEn: 'Auspicious Bond',
        tagType: 'maha_shubho',
        descriptionBn: 'ভাই-বোনের মঙ্গলসূত্র বন্ধন এবং শ্রীশ্রী রাধাকৃষ্ণের মনোরম ঝুলনযাত্রা সমাপ্তি।',
        descriptionEn: 'Sacred protective thread celebration and conclusion of Jhulan swing festival.',
      },
    ],
  },

  // 5. Bhadra
  {
    nameBengali: 'ভাদ্র ১৪৩১',
    nameEnglish: 'Bhadra 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'আগস্ট – সেপ্টেম্বর ২০২৪',
    gregorianRangeEn: 'August – September 2024',
    rituBengali: 'বর্ষা ঋতু',
    rituEnglish: 'Varsha Ritu',
    monthTagBn: 'জন্মাষ্টমী মাস',
    monthTagEn: 'Janmashtami Month',
    totalDays: 31,
    startWeekday: 5,
    gregorianStartDay: 17,
    gregorianStartMonth: 8,
    gregorianStartYear: 2024,
    maheName: 'MAHE BHADRA',
    significanceTitleBn: 'শ্রীকৃষ্ণ জন্মাষ্টমী ও বিশ্বকর্মা পূজা',
    significanceDescBn: 'ভগবান শ্রীকৃষ্ণের আবির্ভাব তিথি, নন্দোৎসব এবং সৌর ভাদ্র সংক্রান্তিতে দেবশিল্পী বিশ্বকর্মার আরাধনা।',
    significanceTitleEn: 'Sri Krishna Janmashtami & Vishwakarma Puja',
    significanceDescEn: 'Midnight advent of Lord Krishna, Nandotsav feasts, and architectural worship of Lord Vishwakarma.',
    festivals: [
      {
        id: 'janmashtami',
        nameBengali: 'শ্রীশ্রী জন্মাষ্টমী ব্রত',
        nameEnglish: 'Sri Krishna Janmashtami',
        bengaliDay: 10,
        gregorianDay: 26,
        gregorianMonth: 'Aug',
        gregorianYear: 2024,
        dayOfWeekBn: 'সোমবার',
        dayOfWeekEn: 'Monday',
        category: 'vrata_puja',
        tagBn: 'মহা আবির্ভাব',
        tagEn: 'Maha Avatar',
        tagType: 'maha_shubho',
        descriptionBn: 'রোহিণী নক্ষত্রযুক্ত মধ্যরাত্রে ভগবান কৃষ্ণের জন্মোৎসব। উপবাস ও পঞ্চামৃত অভিষেক।',
        descriptionEn: 'Midnight appearance of Lord Krishna in Rohini Nakshatra. Fasting and Panchamrita snan.',
      },
      {
        id: 'vishwakarma_puja',
        nameBengali: 'বিশ্বকর্মা পূজা',
        nameEnglish: 'Vishwakarma Puja',
        bengaliDay: 31,
        gregorianDay: 16,
        gregorianMonth: 'Sep',
        gregorianYear: 2024,
        dayOfWeekBn: 'সোমবার',
        dayOfWeekEn: 'Monday',
        category: 'vrata_puja',
        tagBn: 'যন্ত্র পূজা',
        tagEn: 'Craft & Industry',
        tagType: 'cultural',
        descriptionBn: 'শিল্প, কারখানা ও যন্ত্রপাতির দেবতা বিশ্বকর্মার বার্ষিক আরাধনা ও ঘুড়ি ওড়ানোর উৎসব।',
        descriptionEn: 'Worship of the divine architect and machinery across Bengal factories and homes.',
      },
    ],
  },

  // 6. Ashwin
  {
    nameBengali: 'আশ্বিন ১৪৩১',
    nameEnglish: 'Ashwin 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'সেপ্টেম্বর – অক্টোবর ২০২৪',
    gregorianRangeEn: 'September – October 2024',
    rituBengali: 'শরৎ ঋতু',
    rituEnglish: 'Sharad Ritu',
    monthTagBn: 'মহাপূজা মাস',
    monthTagEn: 'Durga Puja Month',
    totalDays: 30,
    startWeekday: 2,
    gregorianStartDay: 17,
    gregorianStartMonth: 9,
    gregorianStartYear: 2024,
    maheName: 'MAHE ASHWIN',
    significanceTitleBn: 'শারদীয়া দুর্গোৎসব ও মহালয়া',
    significanceDescBn: 'বাঙালির শ্রেষ্ঠ উৎসব। দেবী দুর্গার মর্ত্যে আগমন, সন্ধিপূজা, বিজয়া দশমী ও কোজাগরী লক্ষ্মীপূজা।',
    significanceTitleEn: 'Sharad Durga Puja & Kojagari Lakshmi',
    significanceDescEn: 'The supreme festival of Bengal: Devi Durga’s descent, Sandhi Puja, Vijaya Dashami, and Lakshmi Puja.',
    festivals: [
      {
        id: 'mahalaya',
        nameBengali: 'মহালয়া (পিতৃতর্পণ)',
        nameEnglish: 'Mahalaya (Pitru Tarpan)',
        bengaliDay: 16,
        gregorianDay: 2,
        gregorianMonth: 'Oct',
        gregorianYear: 2024,
        dayOfWeekBn: 'বুধবার',
        dayOfWeekEn: 'Wednesday',
        category: 'purnima_amavasya',
        tagBn: 'পিতৃপক্ষ সমাপ্তি',
        tagEn: 'Pitru Paksha End',
        tagType: 'cultural',
        descriptionBn: 'ভোরে মহিষাসুরমর্দিনী শ্রবণ ও গঙ্গাবক্ষে পূর্বপুরুষদের উদ্দেশে তর্পণ জলদান।',
        descriptionEn: 'Dawn radio broadcast of Mahishasuramardini and holy river oblations to departed ancestors.',
      },
      {
        id: 'durga_puja',
        nameBengali: 'শারদীয়া দুর্গাপূজা (মহাষ্টমী ও সন্ধিপূজা)',
        nameEnglish: 'Maha Ashtami & Sandhi Puja',
        bengaliDay: 25,
        gregorianDay: 11,
        gregorianMonth: 'Oct',
        gregorianYear: 2024,
        dayOfWeekBn: 'শুক্রবার',
        dayOfWeekEn: 'Friday',
        category: 'vrata_puja',
        tagBn: 'মহা শুভ',
        tagEn: 'Maha Shubho',
        tagType: 'maha_shubho',
        descriptionBn: 'দুর্গাপূজার প্রধান দিন। কুমারী পূজা, পুষ্পাঞ্জলি এবং অষ্টমী-নবমীর সন্ধিক্ষণে ১০৮ পদ্ম ও প্রদীপে সন্ধিপূজা।',
        descriptionEn: 'Peak day of Durga Puja: Kumari Puja, pushpanjali, and the 48-minute sacred Sandhi Puja.',
        muhuratHighlight: {
          labelBn: 'সন্ধিপূজার শুভ কাল',
          labelEn: 'Sandhi Puja Window',
          time: '11:43 AM to 12:31 PM',
        },
      },
      {
        id: 'lakshmi_puja',
        nameBengali: 'কোজাগরী লক্ষ্মীপূজা',
        nameEnglish: 'Kojagari Lakshmi Puja',
        bengaliDay: 30,
        gregorianDay: 16,
        gregorianMonth: 'Oct',
        gregorianYear: 2024,
        dayOfWeekBn: 'বুধবার',
        dayOfWeekEn: 'Wednesday',
        category: 'purnima_amavasya',
        tagBn: 'পূর্ণিমা পুজো',
        tagEn: 'Purnima Puja',
        tagType: 'maha_shubho',
        descriptionBn: 'শরতের পূর্ণিমা নিশীথে ধনদেবী লক্ষ্মীর আরাধনা। ঘরে ঘরে চালের গুঁড়োর আলপনা ও নারকেল নাড়ু।',
        descriptionEn: 'Autumn full moon night worship of Goddess Lakshmi with rice paste alpona floor art.',
      },
    ],
  },

  // 7. Kartika (Current Autumn / Diwali Month)
  {
    nameBengali: 'কার্তিক ১৪৩১',
    nameEnglish: 'Kartika 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'অক্টোবর – নভেম্বর ২০২৪',
    gregorianRangeEn: 'October – November 2024',
    rituBengali: 'শরৎ ঋতু',
    rituEnglish: 'Sharad Ritu',
    monthTagBn: 'দীপাবলি মাস',
    monthTagEn: 'Diwali Month',
    totalDays: 30,
    startWeekday: 4,
    gregorianStartDay: 17,
    gregorianStartMonth: 10,
    gregorianStartYear: 2024,
    maheName: 'MAHE KARTIKA',
    significanceTitleBn: 'শ্যামাপূজা, দীপাবলি ও ভ্রাতৃদ্বিতীয়া',
    significanceDescBn: 'অমাবস্যায় মা কালীর নিশাপূজা, ভূতচতুর্দশীতে চৌদ্দ প্রদীপ, আলোর উৎসব দীপাবলি এবং ভাইফোঁটা।',
    significanceTitleEn: 'Kali Puja, Diwali & Bhai Phonta',
    significanceDescEn: 'Midnight adoration of Mother Kali, lighting 14 pradips, festival of lights Diwali, and Bhai Phonta.',
    festivals: [
      {
        id: 'kartika_today',
        nameBengali: 'কার্তিক নবমী ও বৈদিক ব্রত',
        nameEnglish: 'Kartika Navami & Daily Vrata',
        bengaliDay: 4,
        gregorianDay: 20,
        gregorianMonth: 'Oct',
        gregorianYear: 2024,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'vrata_puja',
        tagBn: 'নিত্য ব্রত',
        tagEn: 'Daily Vrata',
        tagType: 'puja',
        descriptionBn: 'কার্তিক মাসের পুণ্যপ্রদ নিত্য ব্রত ও আকাশপ্রদীপ দান। শ্রীহরির তুলসী সেবা।',
        descriptionEn: 'Daily holy rites of the holy month of Damodara/Kartika with sky lamp offerings.',
      },
      {
        id: 'kali_puja',
        nameBengali: 'শ্রীশ্রী শ্যামাপূজা ও দীপাবলি',
        nameEnglish: 'Kali Puja & Diwali',
        bengaliDay: 15,
        gregorianDay: 31,
        gregorianMonth: 'Oct',
        gregorianYear: 2024,
        dayOfWeekBn: 'বৃহস্পতিবার',
        dayOfWeekEn: 'Thursday',
        category: 'purnima_amavasya',
        tagBn: 'মহা শুভ',
        tagEn: 'Maha Shubho',
        tagType: 'maha_shubho',
        descriptionBn: 'অমাবস্যা তিথিতে রক্তজবা ও প্রদীপের দীপ্তিতে মা কালীর মহাশক্তি রূপের আরাধনা।',
        descriptionEn: 'Auspicious Amavasya midnight worship of Mother Kali with hibiscus flowers and earthen lamps.',
        muhuratHighlight: {
          labelBn: 'নিশীথ কাল পূজা মুহূর্ত',
          labelEn: 'Nishita Puja Muhurat',
          time: '11:15 PM to 12:07 AM',
        },
      },
      {
        id: 'bhaiphonta',
        nameBengali: 'ভ্রাতৃদ্বিতীয়া (ভাইফোঁটা)',
        nameEnglish: 'Bhai Phonta (Yama Dwitiya)',
        bengaliDay: 18,
        gregorianDay: 3,
        gregorianMonth: 'Nov',
        gregorianYear: 2024,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'vrata_puja',
        tagBn: 'পবিত্র বন্ধন',
        tagEn: 'Sacred Bond',
        tagType: 'cultural',
        descriptionBn: 'ভগ্নী কর্তৃক ভ্রাতার কপালে চন্দনতিলক লেপন ও যমদুয়ারে কাঁটা দেওয়ার পৌরাণিক শুভ আশীর্বাদ।',
        descriptionEn: 'Sisters apply protective sandalwood paste marks to brothers foreheads for longevity.',
      },
      {
        id: 'jagaddhatri_puja',
        nameBengali: 'জগদ্ধাত্রী পূজা (চন্দননগর)',
        nameEnglish: 'Jagaddhatri Puja',
        bengaliDay: 25,
        gregorianDay: 10,
        gregorianMonth: 'Nov',
        gregorianYear: 2024,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'vrata_puja',
        tagBn: 'দেবী পুজো',
        tagEn: 'Devi Puja',
        tagType: 'maha_shubho',
        descriptionBn: 'সিংহবাহিনী চতুর্ভুজা জগদ্ধাত্রী দেবীর পূজা ও বর্ণাঢ্য আলোকসজ্জা।',
        descriptionEn: 'Golden four-armed protector of the world worshipped with luminous street carnivals.',
      },
    ],
  },

  // 8. Agrahayana
  {
    nameBengali: 'অগ্রহায়ণ ১৪৩১',
    nameEnglish: 'Agrahayana 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'নভেম্বর – ডিসেম্বর ২০২৪',
    gregorianRangeEn: 'November – December 2024',
    rituBengali: 'হেমন্ত ঋতু',
    rituEnglish: 'Hemanta Ritu',
    monthTagBn: 'নবান্ন মাস',
    monthTagEn: 'Nabanna Harvest Month',
    totalDays: 30,
    startWeekday: 0,
    gregorianStartDay: 17,
    gregorianStartMonth: 11,
    gregorianStartYear: 2024,
    maheName: 'MAHE AGRAHAYANA',
    significanceTitleBn: 'নতুন ধানের নবান্ন ও ইতুপূজা',
    significanceDescBn: 'কৃষিজীবী বাংলার শস্যোৎসব নবান্ন, নতুন চালের পায়েস ও ইতু ঠাকুরের পূজা সমাপন।',
    significanceTitleEn: 'Harvest Festival Nabanna & Itu Puja',
    significanceDescEn: 'Fresh grain harvest festival Nabanna with new rice sweets and traditional Itu Vrata.',
    festivals: [
      {
        id: 'nabanna',
        nameBengali: 'নবান্ন উৎসব',
        nameEnglish: 'Nabanna Utsav',
        bengaliDay: 15,
        gregorianDay: 1,
        gregorianMonth: 'Dec',
        gregorianYear: 2024,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'vrata_puja',
        tagBn: 'কৃষি উৎসব',
        tagEn: 'Harvest Fest',
        tagType: 'cultural',
        descriptionBn: 'নতুন আমন ধানের চালে প্রথম ক্ষীর ও পিঠে তৈরি করে গৃহদেবতা ও পিতৃপুরুষকে নিবেদন।',
        descriptionEn: 'Offering the season’s first rice pudding to household deities and celebrating harvest abundance.',
      },
      {
        id: 'gita_jayanti',
        nameBengali: 'মোক্ষদা একাদশী ও গীতা জয়ন্তী',
        nameEnglish: 'Mokshada Ekadashi & Gita Jayanti',
        bengaliDay: 25,
        gregorianDay: 11,
        gregorianMonth: 'Dec',
        gregorianYear: 2024,
        dayOfWeekBn: 'বুধবার',
        dayOfWeekEn: 'Wednesday',
        category: 'ekadashi',
        tagBn: 'গীতা পাঠ',
        tagEn: 'Gita Recital',
        tagType: 'upavasa',
        descriptionBn: 'কুরুক্ষেত্রের রণাঙ্গনে অর্জুনকে শ্রীমদ্ভগবদ্গীতা উপদেশের স্মৃতিতে গীতা জয়ন্তী ও একাদশী উপবাস।',
        descriptionEn: 'Lord Krishna spoke the Srimad Bhagavad Gita to Arjuna on Kurukshetra battlefield.',
      },
    ],
  },

  // 9. Pausha
  {
    nameBengali: 'পৌষ ১৪৩১',
    nameEnglish: 'Pausha 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'ডিসেম্বর – জানুয়ারি ২০২৪/২৫',
    gregorianRangeEn: 'December – January 2024/25',
    rituBengali: 'হেমন্ত ঋতু',
    rituEnglish: 'Hemanta Ritu',
    monthTagBn: 'সংক্রান্তি মাস',
    monthTagEn: 'Sankranti Month',
    totalDays: 30,
    startWeekday: 2,
    gregorianStartDay: 16,
    gregorianStartMonth: 12,
    gregorianStartYear: 2024,
    maheName: 'MAHE PAUSHA',
    significanceTitleBn: 'পৌষ সংক্রান্তি ও গঙ্গাসাগর স্নান',
    significanceDescBn: 'মকর সংক্রান্তির পুণ্যলগ্নে গঙ্গাসাগরে লক্ষ লক্ষ পুণ্যার্থীর মহাতীর্থ স্নান ও পৌষ পার্বণের পিঠেপুলি।',
    significanceTitleEn: 'Poush Sankranti & Gangasagar Mela',
    significanceDescEn: 'Millions gather for holy pilgrimage bathing at Gangasagar and celebrate Poush Parbon sweets.',
    festivals: [
      {
        id: 'gangasagar',
        nameBengali: 'পৌষ সংক্রান্তি ও গঙ্গাসাগর স্নান',
        nameEnglish: 'Poush Sankranti (Gangasagar Snan)',
        bengaliDay: 30,
        gregorianDay: 14,
        gregorianMonth: 'Jan',
        gregorianYear: 2025,
        dayOfWeekBn: 'মঙ্গলবার',
        dayOfWeekEn: 'Tuesday',
        category: 'purnima_amavasya',
        tagBn: 'মহা স্নান',
        tagEn: 'Holy Pilgrimage',
        tagType: 'snan_dana',
        descriptionBn: 'সব তীর্থ বারবার, গঙ্গাসাগর একবার। সাগরসঙ্গমে সূর্যোদয়ে পুণ্যস্নান ও কপিলমুনি আশ্রম দর্শন।',
        descriptionEn: 'Holy dawn bath at confluence of holy Ganga and Bay of Bengal on Makara Sankranti.',
      },
    ],
  },

  // 10. Magha
  {
    nameBengali: 'মাঘ ১৪৩১',
    nameEnglish: 'Magha 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'জানুয়ারি – ফেব্রুয়ারি ২০২৫',
    gregorianRangeEn: 'January – February 2025',
    rituBengali: 'শীত ঋতু',
    rituEnglish: 'Shishira Ritu',
    monthTagBn: 'সরস্বতী পূজা মাস',
    monthTagEn: 'Saraswati Puja Month',
    totalDays: 30,
    startWeekday: 3,
    gregorianStartDay: 15,
    gregorianStartMonth: 1,
    gregorianStartYear: 2025,
    maheName: 'MAHE MAGHA',
    significanceTitleBn: 'বসন্ত পঞ্চমী ও শ্রীশ্রী সরস্বতী পূজা',
    significanceDescBn: 'বিদ্যাদেবী মা সরস্বতীর আরাধনা, বাসন্তী শাড়ির শোভা ও শিশুদের প্রথম হাতেখড়ি।',
    significanceTitleEn: 'Basant Panchami & Saraswati Puja',
    significanceDescEn: 'Veneration of Goddess Saraswati, patron of wisdom, learning, arts, and early childhood literacy initiation.',
    festivals: [
      {
        id: 'saraswati_puja',
        nameBengali: 'শ্রীশ্রী সরস্বতী পূজা (বসন্ত পঞ্চমী)',
        nameEnglish: 'Saraswati Puja (Basant Panchami)',
        bengaliDay: 19,
        gregorianDay: 2,
        gregorianMonth: 'Feb',
        gregorianYear: 2025,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'vrata_puja',
        tagBn: 'বিদ্যা বন্দনা',
        tagEn: 'Wisdom Puja',
        tagType: 'maha_shubho',
        descriptionBn: 'বিদ্যালয়, কলেজ ও ঘরে ঘরে মা সরস্বতীর শ্বেতপদ্ম পুষ্পাঞ্জলি এবং শিশুদের হাতেখড়ি।',
        descriptionEn: 'Worship of Goddess Saraswati with yellow flowers, music, and children learning their first alphabets.',
      },
    ],
  },

  // 11. Phalguna
  {
    nameBengali: 'ফাল্গুন ১৪৩১',
    nameEnglish: 'Phalguna 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'ফেব্রুয়ারি – মার্চ ২০২৫',
    gregorianRangeEn: 'February – March 2025',
    rituBengali: 'বসন্ত ঋতু',
    rituEnglish: 'Vasanta Ritu',
    monthTagBn: 'দোলযাত্রা মাস',
    monthTagEn: 'Dol Jatra Month',
    totalDays: 30,
    startWeekday: 5,
    gregorianStartDay: 14,
    gregorianStartMonth: 2,
    gregorianStartYear: 2025,
    maheName: 'MAHE PHALGUNA',
    significanceTitleBn: 'শ্রীশ্রী শিবরাত্রি ও শ্রীকৃষ্ণ দোলযাত্রা',
    significanceDescBn: 'ফাল্গুনের বসন্ত বাতাস, দেবদেবীকে আবীর নিবেদনের দোল উৎসব এবং শিবরাত্রির চতুর্দশী ব্রত।',
    significanceTitleEn: 'Maha Shivratri & Sri Krishna Dol Jatra',
    significanceDescEn: 'Spring colors on Dol Jatra / Gaura Purnima and midnight four-prahara worship of Lord Shiva.',
    festivals: [
      {
        id: 'maha_shivratri',
        nameBengali: 'মহা শিবরাত্রি ব্রত',
        nameEnglish: 'Maha Shivratri',
        bengaliDay: 13,
        gregorianDay: 26,
        gregorianMonth: 'Feb',
        gregorianYear: 2025,
        dayOfWeekBn: 'বুধবার',
        dayOfWeekEn: 'Wednesday',
        category: 'vrata_puja',
        tagBn: 'শিব ব্রত',
        tagEn: 'Shiva Vrata',
        tagType: 'upavasa',
        descriptionBn: 'চার প্রহরের বিশেষ অভিষেক, বিল্বপত্র নিবেদন ও অহোরাত্র উপবাস।',
        descriptionEn: 'All-night vigil, fasting, and four-quarter milk/bel patra offerings to Lord Shiva.',
      },
      {
        id: 'dol_jatra',
        nameBengali: 'শ্রীশ্রী দোলযাত্রা ও গৌর পূর্ণিমা',
        nameEnglish: 'Dol Jatra & Gaura Purnima',
        bengaliDay: 29,
        gregorianDay: 14,
        gregorianMonth: 'Mar',
        gregorianYear: 2025,
        dayOfWeekBn: 'শুক্রবার',
        dayOfWeekEn: 'Friday',
        category: 'purnima_amavasya',
        tagBn: 'রঙের উৎসব',
        tagEn: 'Festival of Colors',
        tagType: 'maha_shubho',
        descriptionBn: 'রাধা-কৃষ্ণের রক্তিম আবীর খেলা এবং শ্রীচৈতন্য মহাপ্রভুর আবির্ভাব তিথি মহোৎসব।',
        descriptionEn: 'Bengali spring festival of colored powders and Sri Chaitanya Mahaprabhu appearance day.',
      },
    ],
  },

  // 12. Chaitra
  {
    nameBengali: 'চৈত্র ১৪৩১',
    nameEnglish: 'Chaitra 1431',
    bengaliYear: 1431,
    gregorianRangeBn: 'মার্চ – এপ্রিল ২০২৫',
    gregorianRangeEn: 'March – April 2025',
    rituBengali: 'বসন্ত ঋতু',
    rituEnglish: 'Vasanta Ritu',
    monthTagBn: 'বর্ষশেষ মাস',
    monthTagEn: 'Year-End Month',
    totalDays: 30,
    startWeekday: 6,
    gregorianStartDay: 15,
    gregorianStartMonth: 3,
    gregorianStartYear: 2025,
    maheName: 'MAHE CHAITRA',
    significanceTitleBn: 'বাসন্তী পূজা, রামনবমী ও চড়ক উৎসব',
    significanceDescBn: 'বছরের সমাপ্তি মাস। বাসন্তী দুর্গোৎসব, শ্রীরাম নবমী এবং চৈত্র সংক্রান্তির নীলপূজা ও চড়ক মেলা।',
    significanceTitleEn: 'Basanti Puja, Ram Navami & Charak Mela',
    significanceDescEn: 'Conclusion of solar cycle with spring Basanti Durga Puja, Ram Navami, and folk Charak rituals.',
    festivals: [
      {
        id: 'ram_navami',
        nameBengali: 'শ্রীরাম নবমী',
        nameEnglish: 'Sri Ram Navami',
        bengaliDay: 23,
        gregorianDay: 6,
        gregorianMonth: 'Apr',
        gregorianYear: 2025,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'vrata_puja',
        tagBn: 'রাম জন্মোৎসব',
        tagEn: 'Ram Janma',
        tagType: 'maha_shubho',
        descriptionBn: 'মর্যাদা পুরুষোত্তম ভগবান শ্রীরামচন্দ্রের মধ্যাহ্ন আবির্ভাব তিথি পালন।',
        descriptionEn: 'Midday celebration of Lord Rama’s birth with temple recitals and ramayana chants.',
      },
      {
        id: 'charak_puja',
        nameBengali: 'চৈত্র সংক্রান্তি ও চড়ক পূজা',
        nameEnglish: 'Chaitra Sankranti & Charak Puja',
        bengaliDay: 30,
        gregorianDay: 13,
        gregorianMonth: 'Apr',
        gregorianYear: 2025,
        dayOfWeekBn: 'রবিবার',
        dayOfWeekEn: 'Sunday',
        category: 'vrata_puja',
        tagBn: 'বর্ষশেষ',
        tagEn: 'Year End',
        tagType: 'cultural',
        descriptionBn: 'বাংলা বছরের শেষ দিনে শিবের গাজন, নীলষষ্ঠী এবং ঐতিহ্যবাহী চড়ক মেলা।',
        descriptionEn: 'Solar year finale with Shiva Gajan dances, Neel Puja, and folklore Charak fair.',
      },
    ],
  },
];

// Bengali Numerals conversion utility
const toBengaliNumber = (num: number): string => {
  const benDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((c) => {
      const idx = parseInt(c, 10);
      return isNaN(idx) ? c : benDigits[idx];
    })
    .join('');
};

// Calculate the Gregorian start year for the Bengali solar year corresponding to a date
function getBengaliBaseYear(dateStr: string): number {
  const parts = (dateStr || '').split('-');
  const y = parseInt(parts[0], 10) || new Date().getFullYear();
  const m = parseInt(parts[1], 10) || (new Date().getMonth() + 1);
  const d = parseInt(parts[2], 10) || new Date().getDate();

  // If date is in Jan, Feb, Mar, or early April (before Pohela Boishakh ~ Apr 14),
  // the Bengali solar year began in April of the previous Gregorian year.
  if (m < 4 || (m === 4 && d < 14)) {
    return y - 1;
  }
  return y;
}

// Generate the 12 Bengali months dynamically for the active Gregorian base year
function getBengaliMonthsForYear(baseYear: number): BengaliMonthDef[] {
  const benYear = baseYear - 593;
  const benYearBn = toBengaliNumber(benYear);

  return BENGALI_MONTHS_RAW.map((rawMonth) => {
    const isNextYear = rawMonth.gregorianStartMonth <= 3;
    const startYear = isNextYear ? baseYear + 1 : baseYear;
    const startYearBn = toBengaliNumber(startYear);
    const startWeekday = new Date(startYear, rawMonth.gregorianStartMonth - 1, rawMonth.gregorianStartDay).getDay();

    const cleanNameBn = rawMonth.nameBengali.replace(/[০-৯0-9\s]+$/g, '').trim();
    const cleanNameEn = rawMonth.nameEnglish.replace(/\d+$/g, '').trim();

    const cleanRangeBn = rawMonth.gregorianRangeBn.replace(/[০-৯0-9\/\s]+$/g, '').trim();
    const cleanRangeEn = rawMonth.gregorianRangeEn.replace(/[\d\/\s]+$/g, '').trim();

    const festivals: FestivalItem[] = rawMonth.festivals.map((f) => {
      const fBaseDay = rawMonth.gregorianStartDay + (f.bengaliDay - 1);
      const fDate = new Date(startYear, rawMonth.gregorianStartMonth - 1, fBaseDay);
      const wDay = fDate.getDay();
      return {
        ...f,
        gregorianYear: fDate.getFullYear(),
        dayOfWeekBn: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'][wDay],
        dayOfWeekEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][wDay],
      };
    });

    return {
      ...rawMonth,
      nameBengali: `${cleanNameBn} ${benYearBn}`,
      nameEnglish: `${cleanNameEn} ${benYear}`,
      bengaliYear: benYear,
      gregorianRangeBn: `${cleanRangeBn} ${startYearBn}`,
      gregorianRangeEn: `${cleanRangeEn} ${startYear}`,
      startWeekday,
      gregorianStartYear: startYear,
      festivals,
    };
  });
}

// Calculate which Bengali month & day matches today's date
function getBengaliDateFromGregorian(dateStr: string, monthsList: BengaliMonthDef[]): { monthIdx: number; day: number } {
  const parts = (dateStr || '').split('-');
  const y = parseInt(parts[0], 10) || new Date().getFullYear();
  const m = parseInt(parts[1], 10) || (new Date().getMonth() + 1);
  const d = parseInt(parts[2], 10) || new Date().getDate();

  // Match against month definitions
  for (let i = 0; i < monthsList.length; i++) {
    const bm = monthsList[i];
    if (m === bm.gregorianStartMonth && d >= bm.gregorianStartDay) {
      const dayCalc = d - bm.gregorianStartDay + 1;
      return { monthIdx: i, day: Math.min(dayCalc, bm.totalDays) };
    }
  }

  // Handle month wrap
  for (let i = 0; i < monthsList.length; i++) {
    const bm = monthsList[i];
    const prevMonthIdx = i === 0 ? 11 : i - 1;
    const prevBm = monthsList[prevMonthIdx];

    if (m === bm.gregorianStartMonth && d < bm.gregorianStartDay) {
      const remainingDaysInPrev = 31 - prevBm.gregorianStartDay + 1;
      const dayCalc = remainingDaysInPrev + d;
      return { monthIdx: prevMonthIdx, day: Math.min(dayCalc, prevBm.totalDays) };
    }
  }

  return { monthIdx: 6, day: 4 }; // Default to Kartika 4 for Oct 20
}

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

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  currentDate,
  profile,
  calendarData,
  adminConfig,
  language = 'bn',
  onDateChange,
  onNavigate,
}) => {
  // Dynamically compute Bengali Year (e.g. 1433 for 2026) and 12 accurate months for current year
  const baseYear = useMemo(() => getBengaliBaseYear(currentDate), [currentDate]);
  const BENGALI_MONTHS = useMemo(() => getBengaliMonthsForYear(baseYear), [baseYear]);

  // Compute TODAY's Bengali Month & Day on load
  const todayBengali = useMemo(() => {
    return getBengaliDateFromGregorian(currentDate, BENGALI_MONTHS);
  }, [currentDate, BENGALI_MONTHS]);

  // Set initial selected month & day to TODAY by default
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(() => todayBengali.monthIdx);
  const [selectedDay, setSelectedDay] = useState<number>(() => todayBengali.day);

  // Sync state if currentDate changes externally
  useEffect(() => {
    const detected = getBengaliDateFromGregorian(currentDate, BENGALI_MONTHS);
    setSelectedMonthIdx(detected.monthIdx);
    setSelectedDay(detected.day);
  }, [currentDate, BENGALI_MONTHS]);

  const [activeFilter, setActiveFilter] = useState<FestivalCategory>('all');
  const [selectedFestivalModal, setSelectedFestivalModal] = useState<FestivalItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentMonth = BENGALI_MONTHS[selectedMonthIdx] || BENGALI_MONTHS[0];

  // Month navigation handlers
  const handlePrevMonth = () => {
    setSelectedMonthIdx((prev) => (prev > 0 ? prev - 1 : BENGALI_MONTHS.length - 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setSelectedMonthIdx((prev) => (prev < BENGALI_MONTHS.length - 1 ? prev + 1 : 0));
    setSelectedDay(1);
  };

  // Convert currently selected day into an exact Gregorian Date object & ISO string
  const selectedGregorianDate = useMemo(() => {
    const baseDay = currentMonth.gregorianStartDay + (selectedDay - 1);
    const startM = currentMonth.gregorianStartMonth;
    const startY = currentMonth.gregorianStartYear;

    const d = new Date(startY, startM - 1, baseDay);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const isoDate = `${d.getFullYear()}-${mm}-${dd}`;

    return {
      day: d.getDate(),
      monthEn: d.toLocaleString('en-US', { month: 'short' }),
      monthBn: ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'][d.getMonth()],
      weekdayEn: d.toLocaleDateString('en-US', { weekday: 'short' }),
      weekdayBn: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'][d.getDay()],
      isoDate,
    };
  }, [selectedDay, currentMonth]);

  // Dynamically compute real astronomical panchang & auspicious times for the SELECTED DATE
  const selectedDayAstronomy = useMemo(() => {
    try {
      const p = calculatePanchang(
        selectedGregorianDate.isoDate,
        profile.tob || '06:00:00',
        profile.lat,
        profile.lng,
        profile.timezone
      );
      const m = calculateAuspiciousTimes(
        selectedGregorianDate.isoDate,
        profile.tob || '06:00:00',
        profile.lat,
        profile.lng,
        profile.timezone
      );
      return { panchang: p, muhurta: m };
    } catch (e) {
      return { panchang: calendarData.panchang, muhurta: calendarData.muhurta };
    }
  }, [selectedGregorianDate.isoDate, profile, calendarData]);

  // Filter festivals according to current filter
  const filteredFestivals = useMemo(() => {
    if (activeFilter === 'all') return currentMonth.festivals;
    return currentMonth.festivals.filter((f) => f.category === activeFilter);
  }, [currentMonth, activeFilter]);

  // Map of days that have festivals
  const festivalDayMap = useMemo(() => {
    const map = new Map<number, FestivalItem>();
    currentMonth.festivals.forEach((f) => {
      map.set(f.bengaliDay, f);
    });
    return map;
  }, [currentMonth]);

  // Festival on currently selected day (if any)
  const festivalOnSelectedDay = useMemo(() => {
    return festivalDayMap.get(selectedDay);
  }, [festivalDayMap, selectedDay]);

  // Pre-calculate exact Tithi & Gregorian metadata for each day of the current month
  const monthDaysData = useMemo(() => {
    return Array.from({ length: currentMonth.totalDays }).map((_, idx) => {
      const dayNum = idx + 1;
      const gregDayVal = currentMonth.gregorianStartDay + idx;
      const gDate = new Date(currentMonth.gregorianStartYear, currentMonth.gregorianStartMonth - 1, gregDayVal);
      const mm = String(gDate.getMonth() + 1).padStart(2, '0');
      const dd = String(gDate.getDate()).padStart(2, '0');
      const isoDate = `${gDate.getFullYear()}-${mm}-${dd}`;
      const weekday = gDate.getDay();

      let tithiNameBn = '';
      let tithiNameEn = '';
      let isEkadashi = false;
      let isPurnima = false;
      let isAmavasya = false;

      try {
        const p = calculatePanchang(isoDate, '06:00:00', profile.lat, profile.lng, profile.timezone);
        const rawName = p.tithi.name.replace(/^(Shukla|Krishna)\s+/i, '').trim();
        const ben = BENGALI_TITHIS[rawName] || rawName;

        isEkadashi = rawName.toLowerCase().includes('ekadashi');
        isPurnima = rawName.toLowerCase().includes('purnima');
        isAmavasya = rawName.toLowerCase().includes('amavasya');

        if (isPurnima) {
          tithiNameBn = 'পূর্ণিমা 🌕';
          tithiNameEn = 'Purnima 🌕';
        } else if (isAmavasya) {
          tithiNameBn = 'অমাবস্যা 🌑';
          tithiNameEn = 'Amavasya 🌑';
        } else if (isEkadashi) {
          tithiNameBn = 'একাদশী ☽';
          tithiNameEn = 'Ekadashi ☽';
        } else {
          tithiNameBn = ben;
          tithiNameEn = rawName;
        }
      } catch (e) {
        tithiNameBn = '';
        tithiNameEn = '';
      }

      return {
        dayNum,
        displayGregDay: gDate.getDate(),
        weekday,
        isSunday: weekday === 0,
        tithiNameBn,
        tithiNameEn,
        isEkadashi,
        isPurnima,
        isAmavasya,
      };
    });
  }, [currentMonth, profile.lat, profile.lng, profile.timezone]);

  // Jump to full panchang view for the selected day
  const handleOpenFullPanchang = (day: number) => {
    const baseDay = currentMonth.gregorianStartDay + (day - 1);
    const d = new Date(currentMonth.gregorianStartYear, currentMonth.gregorianStartMonth - 1, baseDay);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${d.getFullYear()}-${mm}-${dd}`;
    onDateChange(dateStr);
    onNavigate('panchang');
  };

  // Set Reminder toast
  const handleSetReminder = (festName: string) => {
    const msg = language === 'bn'
      ? `✓ ${festName} এর শুভ অনুস্মারক সেট করা হয়েছে!`
      : `✓ Auspicious reminder set for ${festName}!`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Export / Sync to iCalendar (.ics) format
  const handleSyncToGoogleCalendar = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SuryaSiddha//Bengali Panjika Festivals//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:Bengali Panjika - ${currentMonth.nameEnglish}`,
      'X-WR-TIMEZONE:Asia/Kolkata',
    ];

    currentMonth.festivals.forEach((f) => {
      const baseDay = currentMonth.gregorianStartDay + (f.bengaliDay - 1);
      const d = new Date(currentMonth.gregorianStartYear, currentMonth.gregorianStartMonth - 1, baseDay);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}${mm}${dd}`;

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${f.id}-${dateStr}@suryasiddha.app`);
      icsContent.push(`DTSTAMP:${dateStr}T000000Z`);
      icsContent.push(`DTSTART;VALUE=DATE:${dateStr}`);
      icsContent.push(`DTEND;VALUE=DATE:${dateStr}`);
      icsContent.push(`SUMMARY:${f.nameBengali} (${f.nameEnglish})`);
      icsContent.push(`DESCRIPTION:${f.descriptionEn.replace(/,/g, '\\,')}`);
      icsContent.push(`LOCATION:${profile.place}`);
      icsContent.push('STATUS:CONFIRMED');
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Panjika_${currentMonth.nameEnglish.replace(/\s+/g, '_')}_Festivals.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const msg = language === 'bn'
      ? `✓ ${currentMonth.nameBengali} এর উৎসব সূচি ডাউনলোড সম্পন্ন!`
      : `✓ ${currentMonth.nameEnglish} festivals downloaded!`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePrintWallPanjika = () => {
    window.print();
  };

  // Weekdays bilingual definition
  const weekdays = [
    { bn: 'রবি', en: 'Sun', color: 'text-[#790009]' },
    { bn: 'সোম', en: 'Mon', color: 'text-[#59413e]' },
    { bn: 'মঙ্গল', en: 'Tue', color: 'text-[#59413e]' },
    { bn: 'বুধ', en: 'Wed', color: 'text-[#59413e]' },
    { bn: 'বৃহ', en: 'Thu', color: 'text-[#59413e]' },
    { bn: 'শুক্র', en: 'Fri', color: 'text-[#59413e]' },
    { bn: 'শনি', en: 'Sat', color: 'text-[#904d00]' },
  ];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm bg-[#9c1b1b] text-white px-4 py-3 rounded-xl shadow-sacred border border-amber-300/40 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Seasonal & Auspicious Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#faf2ed] border border-[#e6d5b8] shadow-sm p-4">
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex flex-col min-w-0">
            {/* Top Badges */}
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#663500] text-[10px] font-bold uppercase tracking-wider font-sans">
                {language === 'bn'
                  ? `${currentMonth.rituBengali} • ${currentMonth.rituEnglish}`
                  : `${currentMonth.rituEnglish} • ${currentMonth.rituBengali}`}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#790009] text-[10px] font-bold ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>
                {language === 'bn' ? currentMonth.monthTagBn : currentMonth.monthTagEn}
              </span>
            </div>

            {/* Month Titles */}
            <h1 className="font-serif text-2xl font-bold text-[#1e1b18] tracking-tight">
              {language === 'bn' ? currentMonth.nameBengali : currentMonth.nameEnglish}
            </h1>
            <p className="text-xs text-[#59413e] font-medium font-sans mt-0.5">
              {language === 'bn'
                ? `${currentMonth.nameEnglish} • ${currentMonth.gregorianRangeBn}`
                : `${currentMonth.nameBengali} • ${currentMonth.gregorianRangeEn}`}
            </p>
          </div>

          {/* Traditional Layered Motif Emblem */}
          <div className="relative w-14 h-14 rounded-full bg-[#9c1b1b] flex items-center justify-center shadow-md shrink-0">
            <div className="w-11 h-11 rounded-full bg-[#790009] flex items-center justify-center text-[#fe932c]">
              <div className="w-7 h-7 rounded-full bg-[#fff8f4] flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#9c1b1b] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#fe932c]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center justify-between mt-3 pt-2 bg-[#ffffff]/90 backdrop-blur rounded-xl px-2 py-1.5 shadow-sm border border-[#e6d5b8]/70">
          <button
            onClick={handlePrevMonth}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg text-[#59413e] hover:text-[#790009] hover:bg-[#f4ece7] transition-colors active:scale-95 cursor-pointer text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span className={language === 'bn' ? 'font-bengali' : 'font-sans'}>
              {language === 'bn' ? 'পূর্ববর্তী মাস' : 'Previous Month'}
            </span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f4ece7] border border-[#e6d5b8]">
            <Flame className="w-3.5 h-3.5 text-[#904d00]" />
            <span className="text-[10px] font-bold text-[#904d00] uppercase tracking-wider font-sans">
              Surya Sankranti
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg text-[#59413e] hover:text-[#790009] hover:bg-[#f4ece7] transition-colors active:scale-95 cursor-pointer text-xs font-semibold"
          >
            <span className={language === 'bn' ? 'font-bengali' : 'font-sans'}>
              {language === 'bn' ? 'পরবর্তী মাস' : 'Next Month'}
            </span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* 2. Filter Pills (Horizontal Scrollable Row) */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar -mx-2 px-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#790009] text-white shadow-sm ring-1 ring-[#9c1b1b]'
              : 'bg-[#f4ece7] text-[#59413e] hover:bg-[#eee7e1]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সব উৎসব (All)' : 'All Festivals (সব)'}</span>
        </button>

        <button
          onClick={() => setActiveFilter('ekadashi')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'ekadashi'
              ? 'bg-[#790009] text-white shadow-sm ring-1 ring-[#9c1b1b]'
              : 'bg-[#f4ece7] text-[#59413e] hover:bg-[#eee7e1]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#fe932c]" />
          <span>{language === 'bn' ? 'একাদশী ব্রত' : 'Ekadashi (একাদশী)'}</span>
        </button>

        <button
          onClick={() => setActiveFilter('purnima_amavasya')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'purnima_amavasya'
              ? 'bg-[#790009] text-white shadow-sm ring-1 ring-[#9c1b1b]'
              : 'bg-[#f4ece7] text-[#59413e] hover:bg-[#eee7e1]'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-[#904d00]" />
          <span>{language === 'bn' ? 'পূর্ণিমা ও অমাবস্যা' : 'Purnima & Amavasya'}</span>
        </button>

        <button
          onClick={() => setActiveFilter('vrata_puja')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilter === 'vrata_puja'
              ? 'bg-[#790009] text-white shadow-sm ring-1 ring-[#9c1b1b]'
              : 'bg-[#f4ece7] text-[#59413e] hover:bg-[#eee7e1]'
          }`}
        >
          <Flower2 className="w-3.5 h-3.5 text-[#790009]" />
          <span>{language === 'bn' ? 'ব্রত ও পূজা' : 'Vrata & Puja'}</span>
        </button>
      </div>

      {/* 3. Interactive Bengali Lunar-Solar Calendar Grid Card */}
      <section className="rounded-2xl bg-white border border-[#e6d5b8] shadow-sm p-3.5 flex flex-col gap-2.5">
        {/* Gregorian Reference & Legend Bar */}
        <div className="flex items-center justify-between px-1 pt-0.5 pb-1">
          <div className="flex items-center gap-2 text-[#59413e]">
            <span className="text-[11px] font-bold tracking-wider text-[#904d00] uppercase font-sans">
              {currentMonth.maheName}
            </span>
            <span className="text-xs text-[#8d706d]">•</span>
            <span className="text-xs font-medium text-[#59413e] font-sans">
              {language === 'bn' ? `${toBengaliNumber(currentMonth.totalDays)} দিন` : `${currentMonth.totalDays} Days`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] font-medium text-[#59413e]">
              <span className="w-2 h-2 rounded-full bg-[#fe932c]" />
              <span>{language === 'bn' ? 'পূজা' : 'Puja'}</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-[#59413e]">
              <span className="w-2 h-2 rounded-full bg-[#9c1b1b]" />
              <span>{language === 'bn' ? 'একাদশী' : 'Ekadashi'}</span>
            </span>
          </div>
        </div>

        {/* Weekday Header Row (7 cols: Sun, Mon, Tue, Wed, Thu, Fri, Sat) */}
        <div className="grid grid-cols-7 gap-1 text-center py-1.5 bg-[#faf2ed] rounded-xl border border-[#e6d5b8]/60">
          {weekdays.map((w, i) => (
            <div key={i} className={`text-xs font-bold ${w.color} ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>
              {language === 'bn' ? w.bn : w.en}
              <span className="block text-[9px] font-sans font-normal opacity-70">
                {language === 'bn' ? w.en : w.bn}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Leading blank / previous month days */}
          {Array.from({ length: currentMonth.startWeekday }).map((_, idx) => {
            const prevDayNum = 30 - (currentMonth.startWeekday - 1 - idx);
            return (
              <div
                key={`prev-${idx}`}
                className="p-1 min-h-[56px] sm:min-h-[62px] rounded-xl opacity-30 flex flex-col items-center justify-between bg-[#f4ece7]/30 border border-transparent select-none"
              >
                <span className="text-[9px] text-[#8d706d] truncate w-full text-center">•</span>
                <span className="text-sm sm:text-base font-bold text-[#8d706d]">
                  {language === 'bn' ? toBengaliNumber(prevDayNum) : prevDayNum}
                </span>
                <span className="text-[9px] text-[#8d706d] font-sans">
                  {prevDayNum}
                </span>
              </div>
            );
          })}

          {/* Current Month Days */}
          {monthDaysData.map((dayData) => {
            const dayNum = dayData.dayNum;
            const isSelected = selectedDay === dayNum;
            const isToday = todayBengali.monthIdx === selectedMonthIdx && todayBengali.day === dayNum;
            const festival = festivalDayMap.get(dayNum);

            // Styling depending on status
            let cellBg = 'bg-[#faf2ed]/60 hover:bg-[#faf2ed] text-[#1e1b18]';
            if (isSelected) {
              cellBg = 'bg-[#790009] text-white shadow-md ring-2 ring-[#fe932c] scale-105 z-10';
            } else if (isToday) {
              cellBg = 'bg-[#fff8f4] text-[#790009] font-bold border-2 border-[#9c1b1b] shadow-xs';
            } else if (dayData.isSunday) {
              cellBg = 'bg-[#fff5f5] hover:bg-[#ffebeb] text-[#1e1b18] border border-red-100';
            } else if (festival) {
              if (festival.tagType === 'maha_shubho') {
                cellBg = 'bg-[#ffdad6]/40 hover:bg-[#ffdad6]/70 text-[#790009] font-bold border border-[#9c1b1b]/30';
              } else if (festival.category === 'ekadashi') {
                cellBg = 'bg-[#ffdcc3]/40 hover:bg-[#ffdcc3]/70 text-[#663500] font-semibold border border-[#fe932c]/30';
              }
            } else if (dayData.isEkadashi) {
              cellBg = 'bg-[#ffdcc3]/35 hover:bg-[#ffdcc3]/60 text-[#663500] font-semibold border border-[#fe932c]/20';
            } else if (dayData.isPurnima || dayData.isAmavasya) {
              cellBg = 'bg-[#f4ece7] hover:bg-[#eee7e1] text-[#59413e] font-semibold border border-[#8d706d]/20';
            }

            const tithiLabel = language === 'bn' ? dayData.tithiNameBn : dayData.tithiNameEn;

            return (
              <button
                type="button"
                key={`day-${dayNum}`}
                onClick={() => setSelectedDay(dayNum)}
                className={`relative flex flex-col items-center justify-between p-1 sm:p-1.5 min-h-[56px] sm:min-h-[62px] rounded-xl cursor-pointer transition-all select-none text-left w-full ${cellBg}`}
              >
                {/* 1. ABOVE: TITHI (Lunar Phase / Tithi Name) */}
                <div
                  className={`w-full text-[9px] sm:text-[9.5px] leading-tight font-bold truncate text-center px-0.5 ${
                    isSelected
                      ? 'text-[#ffdad6]'
                      : dayData.isEkadashi || dayData.isPurnima || dayData.isAmavasya
                      ? 'text-[#790009]'
                      : dayData.isSunday
                      ? 'text-[#b30000]'
                      : 'text-[#8d706d]'
                  }`}
                  title={tithiLabel}
                >
                  {tithiLabel || '—'}
                </div>

                {/* 2. CENTER: GREGORIAN CALENDAR DATE (Prominent date numeral, e.g. 20, Sunday in red) */}
                <div className="flex items-center justify-center gap-0.5 my-auto">
                  <span
                    className={`text-base sm:text-xl leading-none font-black font-sans ${
                      isSelected
                        ? 'text-white'
                        : isToday
                        ? 'text-[#790009]'
                        : dayData.isSunday
                        ? 'text-[#b30000]'
                        : festival
                        ? 'text-[#790009]'
                        : 'text-[#1e1b18]'
                    }`}
                  >
                    {dayData.displayGregDay}
                  </span>
                </div>

                {/* 3. BOTTOM: COMPANION BENGALI DATE & FESTIVAL INDICATOR */}
                <div className="w-full flex items-center justify-center gap-1 text-[9px] leading-none">
                  <span
                    className={`${
                      isSelected ? 'text-[#ffdad6]/80' : 'text-[#8d706d]'
                    } ${language === 'bn' ? 'font-bengali font-semibold' : 'font-sans font-medium'}`}
                    title={`Bengali Solar Day ${dayNum}`}
                  >
                    {language === 'bn' ? toBengaliNumber(dayNum) : dayNum}
                  </span>
                  {festival && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-[#fe932c]'
                          : festival.category === 'ekadashi'
                          ? 'bg-[#9c1b1b]'
                          : 'bg-[#fe932c]'
                      }`}
                      title={language === 'bn' ? festival.nameBengali : festival.nameEnglish}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Day Mini Summary Strip */}
        <div className="mt-1 pt-1 bg-[#faf2ed] rounded-xl p-2.5 flex items-center justify-between border border-[#e6d5b8]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#ffdcc3] flex items-center justify-center shrink-0 text-[#904d00]">
              <Sun className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#790009] truncate">
                {language === 'bn'
                  ? `নির্বাচিত: ${selectedGregorianDate.day} ${selectedGregorianDate.monthBn} (${toBengaliNumber(selectedDay)} ${currentMonth.nameBengali.split(' ')[0]})`
                  : `Selected: ${selectedGregorianDate.day} ${selectedGregorianDate.monthEn} (${selectedDay} ${currentMonth.nameEnglish.split(' ')[0]})`}
              </p>
              <p className="text-[11px] text-[#59413e] truncate mt-0.5 font-sans">
                {selectedDayAstronomy.panchang.tithi.name} ({selectedDayAstronomy.panchang.tithi.paksha}) • {selectedDayAstronomy.panchang.nakshatra.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenFullPanchang(selectedDay)}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-[#9c1b1b] hover:bg-[#790009] text-white text-[11px] font-semibold tracking-wide shadow-sm active:scale-95 transition cursor-pointer"
          >
            {language === 'bn' ? 'সম্পূর্ণ পঞ্জিকা' : 'Full Panchang'}
          </button>
        </div>
      </section>

      {/* 4. DYNAMIC SELECTED-DAY ALMANAC & HIGHLIGHTS ("Below Materials" adapt dynamically to selected date) */}
      <section className="rounded-2xl bg-white border border-[#e6d5b8] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-4 bg-[#9c1b1b] rounded-full" />
            <h2 className={`text-sm font-bold text-[#1e1b18] ${language === 'bn' ? 'font-bengali text-base' : 'font-serif'}`}>
              {language === 'bn'
                ? `${selectedGregorianDate.day}ই ${selectedGregorianDate.monthBn} (${toBengaliNumber(selectedDay)}ই ${currentMonth.nameBengali.split(' ')[0]}) এর শুভ সময় ও পঞ্চাঙ্গ`
                : `${selectedGregorianDate.day} ${selectedGregorianDate.monthEn} (${selectedDay} ${currentMonth.nameEnglish.split(' ')[0]}) Almanac & Muhurats`}
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4ece7] text-[#904d00]">
            {selectedGregorianDate.day} {language === 'bn' ? selectedGregorianDate.monthBn : selectedGregorianDate.monthEn}
          </span>
        </div>

        {/* 4 Pillars of Selected Day's Panchang */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-[#faf2ed] rounded-xl p-2.5 border border-[#e6d5b8]">
            <span className="text-[10px] text-[#8d706d] block uppercase font-bold">
              {language === 'bn' ? 'তিথি' : 'Tithi'}
            </span>
            <span className="font-bold text-[#790009] block truncate mt-0.5">
              {selectedDayAstronomy.panchang.tithi.name}
            </span>
            <span className="text-[10px] text-[#59413e] block truncate">
              {selectedDayAstronomy.panchang.tithi.paksha} Paksha
            </span>
          </div>

          <div className="bg-[#faf2ed] rounded-xl p-2.5 border border-[#e6d5b8]">
            <span className="text-[10px] text-[#8d706d] block uppercase font-bold">
              {language === 'bn' ? 'নক্ষত্র' : 'Nakshatra'}
            </span>
            <span className="font-bold text-[#1e1b18] block truncate mt-0.5">
              {selectedDayAstronomy.panchang.nakshatra.name}
            </span>
            <span className="text-[10px] text-[#59413e] block truncate">
              Pada {selectedDayAstronomy.panchang.nakshatra.pada}
            </span>
          </div>

          <div className="bg-[#faf2ed] rounded-xl p-2.5 border border-[#e6d5b8]">
            <span className="text-[10px] text-[#8d706d] block uppercase font-bold">
              {language === 'bn' ? 'শুভ কাল (অভিজিৎ)' : 'Abhijit Muhurta'}
            </span>
            <span className="font-bold text-[#15803d] block truncate mt-0.5">
              {selectedDayAstronomy.muhurta.abhijitMuhurta ? selectedDayAstronomy.muhurta.abhijitMuhurta.start : '11:42 AM'}
            </span>
            <span className="text-[10px] text-[#15803d] block truncate">
              {language === 'bn' ? 'পরম শুভ মুহূর্ত' : 'Highly Auspicious'}
            </span>
          </div>

          <div className="bg-[#faf2ed] rounded-xl p-2.5 border border-[#e6d5b8]">
            <span className="text-[10px] text-[#8d706d] block uppercase font-bold">
              {language === 'bn' ? 'রাহু কাল' : 'Rahu Kaal'}
            </span>
            <span className="font-bold text-[#ba1a1a] block truncate mt-0.5">
              {selectedDayAstronomy.muhurta.rahuKaal ? selectedDayAstronomy.muhurta.rahuKaal.start : '02:57 PM'}
            </span>
            <span className="text-[10px] text-[#ba1a1a] block truncate">
              {language === 'bn' ? 'অশুভ বর্জনীয় কাল' : 'Inauspicious Time'}
            </span>
          </div>
        </div>

        {/* If Selected Day has a Festival: Show Dedicated Highlight Card */}
        {festivalOnSelectedDay ? (
          <div className="rounded-xl bg-gradient-to-r from-[#ffdcc3]/40 to-[#fff8f4] border border-[#fe932c] p-3.5 flex flex-col gap-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#904d00]" />
                <h3 className="font-bold text-sm text-[#790009]">
                  {language === 'bn' ? festivalOnSelectedDay.nameBengali : festivalOnSelectedDay.nameEnglish}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#9c1b1b] text-white text-[10px] font-bold">
                {language === 'bn' ? festivalOnSelectedDay.tagBn : festivalOnSelectedDay.tagEn}
              </span>
            </div>

            <p className="text-xs text-[#59413e] leading-relaxed">
              {language === 'bn' ? festivalOnSelectedDay.descriptionBn : festivalOnSelectedDay.descriptionEn}
            </p>

            {festivalOnSelectedDay.muhuratHighlight && (
              <div className="bg-white rounded-lg p-2 border border-[#e6d5b8] text-xs flex items-center justify-between">
                <span className="font-semibold text-[#1e1b18]">
                  {language === 'bn' ? festivalOnSelectedDay.muhuratHighlight.labelBn : festivalOnSelectedDay.muhuratHighlight.labelEn}:
                </span>
                <span className="font-bold text-[#790009]">
                  {festivalOnSelectedDay.muhuratHighlight.time}
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => handleSetReminder(language === 'bn' ? festivalOnSelectedDay.nameBengali : festivalOnSelectedDay.nameEnglish)}
                className="px-3 py-1.5 rounded-lg bg-[#790009] text-white text-xs font-bold hover:bg-[#9c1b1b] transition shadow-xs active:scale-95"
              >
                {language === 'bn' ? 'অনুস্মারক সেট করুন' : 'Set Reminder'}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[#faf2ed] border border-[#e6d5b8] p-3 flex items-center justify-between text-xs text-[#59413e]">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#904d00]" />
              <span>
                {language === 'bn'
                  ? 'এই দিনে নিত্য বৈদিক পূজা ও শুভ মুহূর্ত অনুযায়ী গৃহকর্ম সম্পন্ন করা অনুকূল।'
                  : 'Favorable day for regular Vedic prayers and auspicious activities per Nakshatra.'}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 5. Month's Upcoming Festivals Section */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#790009]" />
          <h2 className="font-serif text-lg font-bold text-[#1e1b18]">
            {language === 'bn'
              ? `${currentMonth.nameBengali.split(' ')[0]} এর উৎসব ও পার্বণ সূচি`
              : `${currentMonth.nameEnglish.split(' ')[0]} Parbon & Vrata Schedule`}
          </h2>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#faf2ed] text-[#59413e] border border-[#e6d5b8]">
          {language === 'bn' ? `${toBengaliNumber(filteredFestivals.length)}টি উৎসব` : `${filteredFestivals.length} Key Events`}
        </span>
      </div>

      {/* 6. Festival Cards List */}
      <div className="flex flex-col gap-3">
        {filteredFestivals.map((fest) => {
          const isMahaShubho = fest.tagType === 'maha_shubho';
          const isSelected = selectedDay === fest.bengaliDay;

          return (
            <div
              key={fest.id}
              onClick={() => setSelectedDay(fest.bengaliDay)}
              className={`rounded-2xl p-4 shadow-sm flex flex-col gap-2.5 relative overflow-hidden transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-[#faf2ed] to-[#fff8f4] border-[#9c1b1b] ring-2 ring-[#fe932c] shadow-sacred'
                  : isMahaShubho
                  ? 'bg-gradient-to-br from-[#faf2ed] to-[#fff8f4] border-[#9c1b1b]/40 shadow-xs hover:shadow-md'
                  : 'bg-white border-[#e6d5b8] hover:shadow-md'
              }`}
            >
              {/* Card Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isMahaShubho
                        ? 'bg-[#fe932c] text-[#663500]'
                        : fest.category === 'ekadashi'
                        ? 'bg-[#ffdad6] text-[#790009]'
                        : 'bg-[#faf2ed] text-[#904d00]'
                    }`}
                  >
                    {isMahaShubho ? (
                      <Coins className="w-6 h-6 stroke-[1.8]" />
                    ) : fest.category === 'ekadashi' ? (
                      <Flower2 className="w-6 h-6 stroke-[1.8]" />
                    ) : (
                      <BookOpen className="w-6 h-6 stroke-[1.8]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-serif text-base font-bold text-[#1e1b18] truncate">
                        {language === 'bn' ? fest.nameBengali : fest.nameEnglish}
                      </h3>
                      <span className="text-xs text-[#59413e] truncate">
                        • {language === 'bn' ? fest.nameEnglish : fest.nameBengali}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#904d00] mt-0.5 font-sans">
                      {language === 'bn'
                        ? `${toBengaliNumber(fest.bengaliDay)} ${currentMonth.nameBengali.split(' ')[0]} • ${fest.dayOfWeekBn}, ${fest.gregorianDay} ${currentMonth.gregorianRangeBn.split(' ')[0]}`
                        : `${fest.bengaliDay} ${currentMonth.nameEnglish.split(' ')[0]} • ${fest.dayOfWeekEn}, ${fest.gregorianDay} ${fest.gregorianMonth}`}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shrink-0 ${
                    isMahaShubho
                      ? 'bg-[#9c1b1b] text-white shadow-sm'
                      : 'bg-[#faf2ed] text-[#59413e] border border-[#e6d5b8]'
                  }`}
                >
                  {language === 'bn' ? fest.tagBn : fest.tagEn}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#59413e] leading-relaxed pl-0.5">
                {language === 'bn' ? fest.descriptionBn : fest.descriptionEn}
              </p>

              {/* Special Muhurat Highlight Block */}
              {fest.muhuratHighlight && (
                <div className="bg-[#ffffff]/90 backdrop-blur rounded-xl p-3 border border-[#e6d5b8] flex flex-col gap-1.5 text-xs shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1e1b18] flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-[#fe932c]" />
                      <span>{language === 'bn' ? fest.muhuratHighlight.labelBn : fest.muhuratHighlight.labelEn}:</span>
                    </span>
                    <span className="font-bold text-[#790009] font-sans">
                      {fest.muhuratHighlight.time}
                    </span>
                  </div>
                  {fest.muhuratHighlight.tithiStart && (
                    <div className="flex items-center justify-between text-[#59413e] text-[11px]">
                      <span>{language === 'bn' ? 'তিথি আরম্ভ:' : 'Tithi Starts:'}</span>
                      <span className="font-medium text-[#1e1b18]">
                        {fest.muhuratHighlight.tithiStart}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Fasting Info Block for Ekadashi */}
              {fest.fastingWindow && (
                <div className="bg-[#faf2ed] rounded-xl p-2.5 border border-[#e6d5b8] flex items-center justify-between text-xs text-[#59413e]">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#9c1b1b]" />
                    <span>{language === 'bn' ? `উপবাস শুরু: ${fest.fastingWindow.start}` : `Fasting starts: ${fest.fastingWindow.start}`}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#790009]">
                    {language === 'bn' ? `পারণ: ${fest.fastingWindow.parana}` : `Parana: ${fest.fastingWindow.parana}`}
                  </span>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#e6d5b8]/50">
                <span className="text-[11px] text-[#59413e] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#904d00]" />
                  <span>{profile.place.split(',')[0]}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetReminder(language === 'bn' ? fest.nameBengali : fest.nameEnglish);
                    }}
                    className="p-1.5 rounded-lg bg-[#faf2ed] hover:bg-[#eee7e1] text-[#790009] transition active:scale-95 cursor-pointer"
                    title={language === 'bn' ? 'অনুস্মারক সেট করুন' : 'Set Reminder'}
                  >
                    <Bell className="w-4 h-4 stroke-[2]" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFestivalModal(fest);
                    }}
                    className="text-xs font-bold text-[#790009] hover:text-[#9c1b1b] flex items-center gap-0.5 hover:underline cursor-pointer"
                  >
                    <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7. Traditional Panjika Art Visual Placement Card */}
      <section className="rounded-2xl bg-[#faf2ed] border border-[#e6d5b8] overflow-hidden shadow-sm flex flex-col">
        <div className="relative w-full h-36 bg-gradient-to-r from-[#790009] via-[#9c1b1b] to-[#904d00] flex items-center justify-center p-4 text-white text-center">
          <div className="absolute w-48 h-48 rounded-full border border-white/20 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold bg-black/30 backdrop-blur px-2.5 py-0.5 rounded-full mb-1 border border-white/10">
              {language === 'bn' ? 'শুদ্ধ সিদ্ধান্ত পঞ্জিকা • Gupta Press Tradition' : 'Gupta Press Traditional Almanac'}
            </span>
            <h3 className="font-serif text-lg font-bold text-amber-100">
              {language === 'bn' ? currentMonth.significanceTitleBn : currentMonth.significanceTitleEn}
            </h3>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <p className="text-xs text-[#59413e] leading-relaxed">
            {language === 'bn' ? currentMonth.significanceDescBn : currentMonth.significanceDescEn}
          </p>
        </div>
      </section>

      {/* 8. Wall Panjika PDF & Calendar Sync Utility Actions */}
      <section className="rounded-2xl bg-[#faf2ed] border border-[#e6d5b8] p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffdcc3] flex items-center justify-center shrink-0 text-[#663500]">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-[#1e1b18]">
              {language === 'bn' ? 'পঞ্জিকা ডাউনলোড ও ক্যালেন্ডার সিঙ্ক' : 'Download & Sync Almanac'}
            </h3>
            <p className="text-xs text-[#59413e]">
              {language === 'bn'
                ? 'অফলাইনে ব্যবহারের জন্য দেয়াল পঞ্জিকা বা ডিজিটাল ক্যালেন্ডারে যোগ করুন।'
                : 'Carry the classical calendar offline or sync with devices.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {/* Download PDF Action */}
          <button
            onClick={handlePrintWallPanjika}
            className="w-full py-2.5 px-4 rounded-xl bg-[#790009] hover:bg-[#9c1b1b] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>
              {language === 'bn'
                ? `${currentMonth.nameBengali.split(' ')[0]} এর মুদ্রণযোগ্য দেয়াল পঞ্জিকা (PDF)`
                : `Download ${currentMonth.nameEnglish.split(' ')[0]} Printable Wall Panjika (PDF)`}
            </span>
          </button>

          {/* Sync Google Calendar Action */}
          <button
            onClick={handleSyncToGoogleCalendar}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#f4ece7] text-[#1e1b18] text-xs font-bold border border-[#e6d5b8] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-[#904d00]" />
            <span>
              {language === 'bn'
                ? 'সমস্ত উৎসব গুগল ক্যালেন্ডারে যোগ করুন (.ics)'
                : 'Sync All Festivals to Google Calendar (.ics)'}
            </span>
          </button>
        </div>

        <p className="text-[10px] text-center text-[#8d706d] tracking-wider uppercase mt-1">
          {language === 'bn'
            ? `এন. সি. লাহিড়ী বিশুদ্ধ সিদ্ধান্ত এফিমিরাস অনুসারে গণিত • স্থানাঙ্ক: ${profile.place}`
            : `Calculated per N.C. Lahiri Ephemeris • Coordinates: ${profile.place}`}
        </p>
      </section>

      {/* Modal: Festival Details */}
      {selectedFestivalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fff8f4] border border-[#e6d5b8] rounded-2xl max-w-sm w-full p-5 shadow-sacred text-[#1e1b18] flex flex-col gap-3 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedFestivalModal(null)}
              className="absolute top-3.5 right-3.5 text-[#59413e] hover:text-[#1e1b18] p-1 rounded-full hover:bg-[#f4ece7]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#ffdcc3] flex items-center justify-center text-[#904d00]">
                <Flower2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#790009]">
                  {language === 'bn' ? selectedFestivalModal.nameBengali : selectedFestivalModal.nameEnglish}
                </h3>
                <p className="text-xs text-[#59413e]">
                  {language === 'bn' ? selectedFestivalModal.nameEnglish : selectedFestivalModal.nameBengali}
                </p>
              </div>
            </div>

            <div className="bg-[#faf2ed] rounded-xl p-3 border border-[#e6d5b8] text-xs space-y-1.5">
              <p className="font-semibold text-[#904d00]">
                📅 {language === 'bn' ? 'তারিখ:' : 'Date:'}{' '}
                {language === 'bn'
                  ? `${toBengaliNumber(selectedFestivalModal.bengaliDay)} ${currentMonth.nameBengali.split(' ')[0]} • ${selectedFestivalModal.dayOfWeekBn}, ${selectedFestivalModal.gregorianDay} ${selectedFestivalModal.gregorianMonth}`
                  : `${selectedFestivalModal.bengaliDay} ${currentMonth.nameEnglish.split(' ')[0]} • ${selectedFestivalModal.dayOfWeekEn}, ${selectedFestivalModal.gregorianDay} ${selectedFestivalModal.gregorianMonth}`}
              </p>
              <p className="text-[#59413e]">
                🏷️ {language === 'bn' ? 'বিভাগ:' : 'Category:'} <span className="capitalize">{selectedFestivalModal.category.replace('_', ' ')}</span>
              </p>
            </div>

            <p className="text-xs text-[#59413e] leading-relaxed">
              {language === 'bn' ? selectedFestivalModal.descriptionBn : selectedFestivalModal.descriptionEn}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleSetReminder(language === 'bn' ? selectedFestivalModal.nameBengali : selectedFestivalModal.nameEnglish);
                  setSelectedFestivalModal(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#790009] hover:bg-[#9c1b1b] text-white text-xs font-bold shadow-sm active:scale-95 transition"
              >
                {language === 'bn' ? 'অনুস্মারক সেট করুন' : 'Set Reminder'}
              </button>
              <button
                onClick={() => {
                  setSelectedFestivalModal(null);
                  handleOpenFullPanchang(selectedFestivalModal.bengaliDay);
                }}
                className="px-3 py-2 rounded-xl bg-[#faf2ed] hover:bg-[#eee7e1] text-[#790009] text-xs font-bold border border-[#e6d5b8]"
              >
                {language === 'bn' ? 'পঞ্জিকা দেখুন' : 'View Panchang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
