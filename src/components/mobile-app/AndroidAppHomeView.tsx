'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  Compass,
  Clock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Flame,
  Star,
  Layers,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  Maximize2,
  Minimize2,
  RefreshCw,
  Award,
  BookOpen,
  Menu,
  X,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Heart,
  Briefcase,
  Activity,
  Filter,
  User,
  Phone,
  MapPin,
  Eye,
  Send,
  Share2,
  DollarSign,
  Facebook,
  Youtube,
  Instagram,
  MessageCircle,
  ShoppingBag,
  UserCheck,
  Info,
  MessageSquare
} from 'lucide-react';
import { calculateVedicPanchang } from '@/engine/panchang';
import { getMonthlyCalendar, CalendarDay, toBengaliNumerals, toMeeteiNumerals } from '@/engine/manipuriCalendar';
import { NAKSHATRA_NAMES_BENGALI, NAKSHATRA_NAMES_MEETEI } from '@/engine/constants';
import { WEEKDAYS_MANIPURI, MANIPURI_MONTH_ATTRIBUTES } from '@/data/manipuriMonthAttributes';
import ManipuriPanchangWorkstation from '@/components/dashboard/ManipuriPanchangWorkstation';
import LeipungFeedView from '@/components/mobile-app/LeipungFeedView';
import AppSplashScreen from '@/components/mobile-app/AppSplashScreen';
import InAppAccountView from '@/components/mobile-app/InAppAccountView';

type ScriptMode = 'bengali' | 'meetei';

interface RashiHoroscope {
  id: string;
  signIndex: number;
  nameEn: string;
  nameBengali: string;
  nameMeetei: string;
  symbol: string;
  lord: string;
  element: string;
  luckyColor: string;
  luckyNumber: string;
  luckyTime: string;
  luckScore: number;
  summaryBengali: string;
  summaryMeetei: string;
  careerBengali: string;
  careerMeetei: string;
  loveBengali: string;
  loveMeetei: string;
  healthBengali: string;
  healthMeetei: string;
}

const RASHIS: RashiHoroscope[] = [
  {
    id: 'mesha',
    signIndex: 0,
    nameEn: 'Aries',
    nameBengali: 'মেষ',
    nameMeetei: 'ꯃꯦꯁ',
    symbol: '♈',
    lord: 'মঙ্গল (Mars)',
    element: 'Fire (অগ্নি)',
    luckyColor: 'অঙাংবা (Red / Ruby)',
    luckyNumber: '৯ (9)',
    luckyTime: '০৮:০০ AM - ১০:০০ AM',
    luckScore: 88,
    summaryBengali: 'ঙসিগী নুমিৎ অসি নহাক্কীদমক য়াম্না অফবা ওইগনি। থবক-থৌরমদা অনৌবা খোংথাং লোইশিনবা ঙমগনি। ইমুং-মনুংদা নুংঙাই-য়াইফবা লৈগনি।',
    summaryMeetei: 'ꯉꯁꯤꯒꯤ ꯅꯨꯃꯤꯠ ꯑꯁꯤ ꯑꯗꯣꯃꯒꯤꯗꯃꯛ ꯌꯥꯝꯅꯥ ꯐꯕꯅꯤ꯫ ꯊꯕꯛ-ꯁꯨꯃꯗꯥ ꯑꯅꯧꯕ ꯃꯥꯌꯄꯥꯛꯄꯥ ꯂꯥꯛꯀꯅꯤ꯫ ꯏꯃꯨꯡ-ꯃꯅꯨꯡꯗꯥ ꯅꯨꯡꯉꯥꯏ-ꯌꯥꯏꯐꯕꯥ ꯂꯩꯒꯅꯤ꯫',
    careerBengali: 'থবক-শূম অমসুং ললোন-ইতিক্তা মায়পাকপা অমসুং খুমাং চাউশিনবা য়াওগনি।',
    careerMeetei: 'ꯊꯕꯛ-ꯁꯨꯃꯗꯥ ꯃꯥꯌꯄꯥꯛꯄꯥ ꯑꯃꯁꯨꯡ ꯈꯨꯃꯥꯡ ꯆꯥꯎꯁꯤꯟꯕꯥ ꯌꯥꯑꯣꯒꯅꯤ꯫',
    loveBengali: 'ইমুংগী মীওইশিংগা নুংশিনবা অমসুং চানা-হৌনবা হেনগৎলক্কনি।',
    loveMeetei: 'ꯏꯃꯨꯡꯒꯤ ꯃꯤꯑꯣꯏꯁꯤꯡꯒꯥ ꯅꯨꯡꯁꯤꯟꯕꯥ ꯍꯦꯅꯒꯠꯂꯛꯀꯅꯤ꯫',
    healthBengali: 'হকচাং ফনা লৈগনি, অদুবু চাবা-থকপদা চেকশিনবীয়ু।',
    healthMeetei: 'ꯍꯛꯆꯥꯡ ꯐꯅꯥ ꯂꯩꯒꯅꯤ, ꯑꯗꯨꯕꯨ ꯆꯥꯕꯥ-ꯊꯛꯄꯗꯥ ꯆꯦꯛꯁꯤꯟꯕꯤꯌꯨ꯫'
  },
  {
    id: 'vrisha',
    signIndex: 1,
    nameEn: 'Taurus',
    nameBengali: 'বৃষ',
    nameMeetei: 'ꯕ꯭ꯔꯤꯁ',
    symbol: '♉',
    lord: 'শুক্র (Venus)',
    element: 'Earth (ভূমি)',
    luckyColor: 'অঙৌবা (White / Silver)',
    luckyNumber: '৬ (6)',
    luckyTime: '০২:০০ PM - ০৪:০০ PM',
    luckScore: 82,
    summaryBengali: 'শেন-থুমগী ফিভমদা অফবা অহোংবা লাক্কনি। কুইনা লৈরক্লবা থৌরাং অমা ঙসি মায়পাক্না লোইশিনবা ঙমগনি।',
    summaryMeetei: 'ꯁꯦꯟ-ꯊꯨꯃꯒꯤ ꯐꯤꯚꯃꯗꯥ ꯑꯐꯕꯥ ꯑꯍꯣꯡꯕꯥ ꯂꯥꯛꯀꯅꯤ꯫ ꯀꯨꯏꯅꯥ ꯂꯩꯔꯛꯂꯕꯥ ꯊꯧꯔꯥꯡ ꯑꯃꯥ ꯉꯁꯤ ꯃꯥꯌꯄꯥꯛꯅꯥ ꯂꯣꯏꯁꯤꯟꯕꯥ ꯉꯃꯒꯅꯤ꯫',
    careerBengali: 'থবক মফমদা মতেং ফংগনি, শেন থাদবদা চেকশিনগদবনি।',
    careerMeetei: 'ꯊꯕꯛ ꯃꯐꯃꯗꯥ ꯃꯇꯦꯡ ꯐꯪꯒꯅꯤ, ꯁꯦꯟ ꯊꯥꯗꯕꯗꯥ ꯆꯦꯛꯁꯤꯟꯒꯗꯕꯅꯤ꯫',
    loveBengali: 'নুংশিবা মীওইগা পুন্না নুংঙাইবা মতম লেনবা ফংগনি।',
    loveMeetei: 'ꯅꯨꯡꯁꯤꯕꯥ ꯃꯤꯑꯣꯏꯒꯥ ꯄꯨꯟꯅꯥ ꯅꯨꯡꯉꯥꯏꯕꯥ ꯃꯇꯝ ꯂꯦꯟꯕꯥ ꯐꯪꯒꯅꯤ꯫',
    healthBengali: 'মীকুপ-নাহুম শিংনা লৈবীয়ু, মতিক চাবা পোথারবা মথৌ তাই।',
    healthMeetei: 'ꯃꯤꯀꯨꯞ-ꯅꯥꯍꯨꯝ ꯁꯤꯡꯅꯥ ꯂꯩꯕꯤꯌꯨ, ꯃꯇꯤꯛ ꯆꯥꯕꯥ ꯄꯣꯊꯥꯔꯕꯥ ꯃꯊꯧ ꯇꯥꯏ꯫'
  },
  {
    id: 'mithuna',
    signIndex: 2,
    nameEn: 'Gemini',
    nameBengali: 'মিথুন',
    nameMeetei: 'ꯃꯤꯊꯨꯟ',
    symbol: '♊',
    lord: 'বুধ (Mercury)',
    element: 'Air (বায়ু)',
    luckyColor: 'আশংবা (Green / Emerald)',
    luckyNumber: '৫ (5)',
    luckyTime: '১১:০০ AM - ০১:০০ PM',
    luckScore: 90,
    summaryBengali: 'ৱাফম পাউতাক অমসুং বুদ্ধিগী থবক্তা চাউনা মায়পাকপা ফংগনি। মরূপশিংদগী অফবা পাউ তাগনি।',
    summaryMeetei: 'ꯋꯥꯐꯝ ꯄꯥꯎꯇꯥꯛ ꯑꯃꯁꯨꯡ ꯕꯨꯗ꯭ꯙꯤꯒꯤ ꯊꯕꯛꯇꯥ ꯃꯥꯌꯄꯥꯛꯄꯥ ꯐꯪꯒꯅꯤ꯫ ꯃꯔꯨꯞꯁꯤꯡꯗꯒꯤ ꯑꯐꯕꯥ ꯄꯥꯎ ꯇꯥꯒꯅꯤ꯫',
    careerBengali: 'ইবা-পাবা অমসুং মিদিয়াগী থবক তৌবশিংদা য়াম্না ফবা নুমিৎনি।',
    careerMeetei: 'ꯏꯕꯥ-ꯄꯥꯕꯥ ꯑꯃꯁꯨꯡ ꯃꯤꯗꯤꯌꯥꯒꯤ ꯊꯕꯛ ꯇꯧꯕꯁꯤꯡꯗꯥ ꯌꯥꯝꯅꯥ ꯐꯕꯥ ꯅꯨꯃꯤꯠꯅꯤ꯫',
    loveBengali: 'ৱারি শানবনা অমগা-অমগা মরক্তা খেন্নবা কোকহনগনি।',
    loveMeetei: 'ꯋꯥꯔꯤ ꯁꯥꯟꯕꯅꯥ ꯑꯃꯒꯥ-ꯑꯃꯒꯥ ꯃꯔꯛꯇꯥ ꯈꯦꯟꯅꯕꯥ ꯀꯣꯛꯍꯟꯒꯅꯤ꯫',
    healthBengali: 'ৱাখলদা হরাও-নুংঙাইবা অমসুং শক্তি লৈগনি।',
    healthMeetei: 'ꯋꯥꯈꯜꯗꯥ ꯍꯔꯥꯎ-ꯅꯨꯡꯉꯥꯏꯕꯥ ꯑꯃꯁꯨꯡ ꯁꯛꯇꯤ ꯂꯩꯒꯅꯤ꯫'
  },
  {
    id: 'karkata',
    signIndex: 3,
    nameEn: 'Cancer',
    nameBengali: 'কর্কট',
    nameMeetei: 'ꯀꯔꯀꯠ',
    symbol: '♋',
    lord: 'চন্দ্র (Moon)',
    element: 'Water (জল)',
    luckyColor: 'মুকাক (Pearl Cream)',
    luckyNumber: '২ (2)',
    luckyTime: '০৬:৩০ PM - ০৮:৩০ PM',
    luckScore: 85,
    summaryBengali: 'ৱাখলদা শান্তি লৈগনি। ইমুং-মনুংগী থবক-থৌরমদা পুকচেল চংলগা চৎপনা হরাওবা হেনগৎলক্কনি।',
    summaryMeetei: 'ꯋꯥꯈꯜꯗꯥ ꯁꯥꯟꯇꯤ ꯂꯩꯒꯅꯤ꯫ ꯏꯃꯨꯡ-ꯃꯅꯨꯡꯒꯤ ꯊꯕꯛ-ꯊꯧꯔꯝꯗꯥ ꯄꯨꯛꯆꯦꯜ ꯆꯪꯂꯒꯥ ꯆꯠꯄꯅꯥ ꯍꯔꯥꯎꯕꯥ ꯍꯦꯅꯒꯠꯂꯛꯀꯅꯤ꯫',
    careerBengali: 'থৌনা হাপ্না থবক তৌবনা পাম্লিবা মহৈ পুরক্কনি।',
    careerMeetei: 'ꯊꯧꯅꯥ ꯍꯥꯞꯅꯥ ꯊꯕꯛ ꯇꯧꯕꯅꯥ ꯄꯥꯃꯂꯤꯕꯥ ꯃꯍꯩ ꯄꯨꯔꯛꯀꯅꯤ꯫',
    loveBengali: 'ইমুংগী নুংশিনবা অমসুং চানা-হৌনবা ফিভম লৈগনি।',
    loveMeetei: 'ꯏꯃꯨꯡꯒꯤ ꯅꯨꯡꯁꯤꯟꯕꯥ ꯑꯃꯁꯨꯡ ꯆꯥꯅꯥ-ꯍꯧꯅꯕꯥ ꯐꯤꯚꯝ ꯂꯩꯒꯅꯤ꯫',
    healthBengali: 'হকচাংগীদমক মপান্দা চানবা পোৎলমশিং থাদোকউ।',
    healthMeetei: 'ꯍꯛꯆꯥꯡꯒꯤꯗꯃꯛ ꯃꯄꯥꯟꯗꯥ ꯆꯥꯅꯕꯥ ꯄꯣꯠꯂꯝꯁꯤꯡ ꯊꯥꯗꯣꯛꯎ꯫'
  },
  {
    id: 'simha',
    signIndex: 4,
    nameEn: 'Leo',
    nameBengali: 'সিংহ',
    nameMeetei: 'ꯁꯤꯡꯍ',
    symbol: '♌',
    lord: 'সূর্য (Sun)',
    element: 'Fire (অগ্নি)',
    luckyColor: 'সনা মচু (Golden / Saffron)',
    luckyNumber: '১ (1)',
    luckyTime: '০৭:০০ AM - ০৯:০০ AM',
    luckScore: 94,
    summaryBengali: 'লুচিংবগী থৌনা অমসুং থৱায় হাপকনি। ইকায়খুম্নবা ফংগনি অমসুং মশাদা থাজবা হেনগৎলক্কনি।',
    summaryMeetei: 'ꯂꯨꯆꯤꯡꯕꯒꯤ ꯊꯧꯅꯥ ꯑꯃꯁꯨꯡ ꯊꯋꯥꯌ ꯍꯥꯄꯀꯅꯤ꯫ ꯏꯀꯥꯌꯈꯨꯃꯅꯕꯥ ꯐꯪꯒꯅꯤ ꯑꯃꯁꯨꯡ ꯃꯁꯥꯗꯥ ꯊꯥꯖꯕꯥ ꯍꯦꯅꯒꯠꯂꯛꯀꯅꯤ꯫',
    careerBengali: 'অৱাংবা থবক তৌবশিংগী মতেং ফংগনি, অনৌবা থৌদাং লাক্কনি।',
    careerMeetei: 'ꯑꯋꯥꯡꯕꯥ ꯊꯕꯛ ꯇꯧꯕꯁꯤꯡꯒꯤ ꯃꯇꯦꯡ ꯐꯪꯒꯅꯤ, ꯑꯅꯧꯕꯥ ꯊꯧꯗꯥꯡ ꯂꯥꯛꯀꯅꯤ꯫',
    loveBengali: 'চাউথোকচবা থাদোকউ, মরী ফগৎলক্কনি।',
    loveMeetei: 'ꯆꯥꯎꯊꯣꯛꯆꯕꯥ ꯊꯥꯗꯣꯛꯎ, ꯃꯔꯤ ꯐꯒꯠꯂꯛꯀꯅꯤ꯫',
    healthBengali: 'হকচাংদা শক্তি অমসুং থৱায় হাপ্পা ফাওগনি।',
    healthMeetei: 'ꯍꯛꯆꯥꯡꯗꯥ ꯁꯛꯇꯤ ꯑꯃꯁꯨꯡ ꯊꯋꯥꯌ ꯍꯥꯞꯄꯥ ꯐꯥꯑꯣꯒꯅꯤ꯫'
  },
  {
    id: 'kanya',
    signIndex: 5,
    nameEn: 'Virgo',
    nameBengali: 'কন্যা',
    nameMeetei: 'ꯀꯅ꯭ꯌꯥ',
    symbol: '♍',
    lord: 'বুধ (Mercury)',
    element: 'Earth (ভূমি)',
    luckyColor: 'লাউৱাংবা আশংবা (Light Green)',
    luckyNumber: '৩ (3)',
    luckyTime: '০৩:০০ PM - ০৫:০০ PM',
    luckScore: 84,
    summaryBengali: 'চেকশিন্না থৌরাং তৌবা অমসুং শেন্মিৎলোনগী থবক্তা মায়পাকপা লাক্কনি। অফবা মহৈ ফংগনি।',
    summaryMeetei: 'ꯆꯦꯛꯁꯤꯟꯅꯥ ꯊꯧꯔꯥꯡ ꯇꯧꯕꯥ ꯑꯃꯁꯨꯡ ꯁꯦꯅꯃꯤꯠꯂꯣꯟꯒꯤ ꯊꯕꯛꯇꯥ ꯃꯥꯌꯄꯥꯛꯄꯥ ꯂꯥꯛꯀꯅꯤ꯫ ꯑꯐꯕꯥ ꯃꯍꯩ ꯐꯪꯒꯅꯤ꯫',
    careerBengali: 'থবকপু ফজনা লোইশিনবগীদমক থাগৎপা ফংগনি।',
    careerMeetei: 'ꯊꯕꯛꯄꯨ ꯐꯖꯅꯥ ꯂꯣꯏꯁꯤꯟꯕꯒꯤꯗꯃꯛ ꯊꯥꯒꯠꯄꯥ ꯐꯪꯒꯅꯤ꯫',
    loveBengali: 'অচম্বা ৱাফমশিংদা পুকচেল পাক্না লৈবীয়ু।',
    loveMeetei: 'ꯑꯆꯝꯕꯥ ꯋꯥꯐꯝꯁꯤꯡꯗꯥ ꯄꯨꯛꯆꯦꯜ ꯄꯥꯛꯅꯥ ꯂꯩꯕꯤꯌꯨ꯫',
    healthBengali: 'হকচাংগীদমক তোইনা খোংচৎ চৎপগী হৈনবী তৌবীয়ু।',
    healthMeetei: 'ꯍꯛꯆꯥꯡꯒꯤꯗꯃꯛ ꯇꯣꯏꯅꯥ ꯈꯣꯡꯆꯠ ꯆꯠꯄꯒꯤ ꯍꯩꯅꯕꯤ ꯇꯧꯕꯤꯌꯨ꯫'
  },
  {
    id: 'tula',
    signIndex: 6,
    nameEn: 'Libra',
    nameBengali: 'তুলা',
    nameMeetei: 'ꯇꯨꯂꯥ',
    symbol: '♎',
    lord: 'শুক্র (Venus)',
    element: 'Air (বায়ু)',
    luckyColor: 'গোলাপী / আকাশী (Pink / Sky)',
    luckyNumber: '৭ (7)',
    luckyTime: '০৫:০০ PM - ০৭:০০ PM',
    luckScore: 87,
    summaryBengali: 'মরূপ-মপাং অমসুং নক্নবা মরীশিংগীদমক অফবা নুমিৎনি। কলা অমসুং নুংঙাইবা থবকশিংদা পুকচিং চংলক্কনি।',
    summaryMeetei: 'ꯃꯔꯨꯞ-ꯃꯄꯥꯡ ꯑꯃꯁꯨꯡ ꯅꯛꯅꯕꯥ ꯃꯔꯤꯁꯤꯡꯒꯤꯗꯃꯛ ꯑꯐꯕꯥ ꯅꯨꯃꯤꯠꯅꯤ꯫ ꯀꯂꯥ ꯑꯃꯁꯨꯡ ꯅꯨꯡꯉꯥꯏꯕꯥ ꯊꯕꯛꯁꯤꯡꯗꯥ ꯄꯨꯛꯆꯤꯡ ꯆꯪꯂꯛꯀꯅꯤ꯫',
    careerBengali: 'অৱাবা ৱাফমশিং ৱারি শান্না লোইশিনবা ঙমগনি।',
    careerMeetei: 'ꯑꯋꯥꯕꯥ ꯋꯥꯐꯝꯁꯤꯡ ꯋꯥꯔꯤ ꯁꯥꯟꯅꯥ ꯂꯣꯏꯁꯤꯟꯕꯥ ꯉꯃꯒꯅꯤ꯫',
    loveBengali: 'নুংশিবগী মরীদা নুংঙাইবা অমসুং হরাওবা ফংগনি।',
    loveMeetei: 'ꯅꯨꯡꯁꯤꯕꯒꯤ ꯃꯔꯤꯗꯥ ꯅꯨꯡꯉꯥꯏꯕꯥ ꯑꯃꯁꯨꯡ ꯍꯔꯥꯎꯕꯥ ꯐꯪꯒꯅꯤ꯫',
    healthBengali: 'ঈশিং হেন্না থকউ, হকচাংদা নুংঙাইবা ফাওগনি।',
    healthMeetei: 'ꯏꯁꯤꯡ ꯍꯦꯟꯅꯥ ꯊꯛꯎ, ꯍꯛꯆꯥꯡꯗꯥ ꯅꯨꯡꯉꯥꯏꯕꯥ ꯐꯥꯑꯣꯒꯅꯤ꯫'
  },
  {
    id: 'vrishchika',
    signIndex: 7,
    nameEn: 'Scorpio',
    nameBengali: 'বৃশ্চিক',
    nameMeetei: 'ꯕ꯭ꯔꯤꯁ꯭ꯆꯤꯛ',
    symbol: '♏',
    lord: 'মঙ্গল (Mars)',
    element: 'Water (জল)',
    luckyColor: 'অকূপ্পা অঙাংবা (Deep Crimson)',
    luckyNumber: '৮ (8)',
    luckyTime: '০৯:০০ PM - ১০:৩০ PM',
    luckScore: 89,
    summaryBengali: 'থৌনা অমসুং পুকচেল চেৎনা চৎপনা অৱাবা খুদিংমক মায়থিবা পীবা ঙমগনি। ৱাখলদা শক্তি লাক্কনি।',
    summaryMeetei: 'ꯊꯧꯅꯥ ꯑꯃꯁꯨꯡ ꯄꯨꯛꯆꯦꯜ ꯆꯦꯠꯅꯥ ꯆꯠꯄꯅꯥ ꯑꯋꯥꯕꯥ ꯈꯨꯗꯤꯡꯃꯛ ꯃꯥꯌꯊꯤꯕꯥ ꯄꯤꯕꯥ ꯉꯃꯒꯅꯤ꯫ ꯋꯥꯈꯜꯗꯥ ꯁꯛꯇꯤ ꯂꯥꯛꯀꯅꯤ꯫',
    careerBengali: 'কূপ্না থিজিনবা অমসুং লুচিংবা থবক্তা মায়পাকপা ফংগনি।',
    careerMeetei: 'ꯀꯨꯞꯅꯥ ꯊꯤꯖꯤꯟꯕꯥ ꯑꯃꯁꯨꯡ ꯂꯨꯆꯤꯡꯕꯥ ꯊꯕꯛꯇꯥ ꯃꯥꯌꯄꯥꯛꯄꯥ ꯐꯪꯒꯅꯤ꯫',
    loveBengali: 'অমগা-অমগা থাজবা অমসুং নুংশিবা হেনগৎলক্কনি।',
    loveMeetei: 'ꯑꯃꯒꯥ-ꯑꯃꯒꯥ ꯊꯥꯖꯕꯥ ꯑꯃꯁꯨꯡ ꯅꯨꯡꯁꯤꯕꯥ ꯍꯦꯅꯒꯠꯂꯛꯀꯅꯤ꯫',
    healthBengali: 'ৱাখলগী চাপ হন্থহন্নবা ধ্যান তৌবীয়ু।',
    healthMeetei: 'ꯋꯥꯈꯜꯒꯤ ꯆꯥꯞ ꯍꯟꯊꯍꯟꯅꯕꯥ ꯙ꯭ꯌꯥꯟ ꯇꯧꯕꯤꯌꯨ꯫'
  },
  {
    id: 'dhanu',
    signIndex: 8,
    nameEn: 'Sagittarius',
    nameBengali: 'ধনু',
    nameMeetei: 'ꯙꯅꯨ',
    symbol: '♐',
    lord: 'বৃহস্পতি (Jupiter)',
    element: 'Fire (অগ্নি)',
    luckyColor: 'নপীক (Yellow / Topaz)',
    luckyNumber: '৩ (3)',
    luckyTime: '১০:০০ AM - ১২:০০ PM',
    luckScore: 92,
    summaryBengali: 'লাইনিং-থৌরম অমসুং লাইফমদা চৎপনা থৱায়দা শান্তি লাক্কনি। লাইরিবগী থৌজালনা মায়পাকপা পুরক্কনি।',
    summaryMeetei: 'ꯂꯥꯏꯅꯤꯡ-ꯊꯧꯔꯥꯝ ꯑꯃꯁꯨꯡ ꯂꯥꯏꯐꯃꯗꯥ ꯆꯠꯄꯅꯥ ꯊꯋꯥꯌꯗꯥ ꯁꯥꯟꯇꯤ ꯂꯥꯛꯀꯅꯤ꯫ ꯂꯥꯏꯔꯤꯕꯒꯤ ꯊꯧꯖꯥꯜꯅꯥ ꯃꯥꯌꯄꯥꯛꯄꯥ ꯄꯨꯔꯛꯀꯅꯤ꯫',
    careerBengali: 'মহৈ-তম্বা অমসুং মপান লমগী থবক্তা খুমাং চাউশিনবা য়াওগনি।',
    careerMeetei: 'ꯃꯍꯩ-ꯇꯝꯕꯥ ꯑꯃꯁꯨꯡ ꯃꯄꯥꯟ ꯂꯃꯒꯤ ꯊꯕꯛꯇꯥ ꯈꯨꯃꯥꯡ ꯆꯥꯎꯁꯤꯟꯕꯥ ꯌꯥꯑꯣꯒꯅꯤ꯫',
    loveBengali: 'নুংশিবা মীওইগা পুন্না চৎপা-খোংচত্তা নুংঙাইবা ফংগনি।',
    loveMeetei: 'ꯅꯨꯡꯁꯤꯕꯥ ꯃꯤꯑꯣꯏꯒꯥ ꯄꯨꯟꯅꯥ ꯆꯠꯄꯥ-ꯈꯣꯡꯆꯠꯇꯥ ꯅꯨꯡꯉꯥꯏꯕꯥ ꯐꯪꯒꯅꯤ꯫',
    healthBengali: 'হকচাং য়াম্না ফনা অমসুং শক্তি হাপ্না লৈগনি।',
    healthMeetei: 'ꯍꯛꯆꯥꯡ ꯌꯥꯝꯅꯥ ꯐꯅꯥ ꯑꯃꯁꯨꯡ ꯁꯛꯇꯤ ꯍꯥꯞꯅꯥ ꯂꯩꯒꯅꯤ꯫'
  },
  {
    id: 'makara',
    signIndex: 9,
    nameEn: 'Capricorn',
    nameBengali: 'মকর',
    nameMeetei: 'ꯃꯀꯔ',
    symbol: '♑',
    lord: 'শনি (Saturn)',
    element: 'Earth (ভূমি)',
    luckyColor: 'হিগোক / আমুবা (Navy / Dark Blue)',
    luckyNumber: '৪ (4)',
    luckyTime: '০৪:০০ PM - ০৬:০০ PM',
    luckScore: 81,
    summaryBengali: 'হকথেংননা কন্না হোৎনবগী অফবা মহৈ ফংগনি। থবক খুদিংমক পুকচিং চেৎনা লোইশিনগদবনি।',
    summaryMeetei: 'ꯍꯛꯊꯦꯡꯅꯅꯥ ꯀꯟꯅꯥ ꯍꯣꯠꯅꯕꯒꯤ ꯑꯐꯕꯥ ꯃꯍꯩ ꯐꯪꯒꯅꯤ꯫ ꯊꯕꯛ ꯈꯨꯗꯤꯡꯃꯛ ꯄꯨꯛꯆꯤꯡ ꯆꯦꯠꯅꯥ ꯂꯣꯏꯁꯤꯟꯒꯗꯕꯅꯤ꯫',
    careerBengali: 'লুচিংবা অমসুং থৌদাং কয়া খুদুম চন্না লোইশিনগনি।',
    careerMeetei: 'ꯂꯨꯆꯤꯡꯕꯥ ꯑꯃꯁꯨꯡ ꯊꯧꯗꯥꯡ ꯀꯌꯥ ꯈꯨꯗꯨꯝ ꯆꯟꯅꯥ ꯂꯣꯏꯁꯤꯟꯒꯅꯤ꯫',
    loveBengali: 'চপ চাবা আচরণনা নুংশিবগী থাজবা হেনগৎহনগনি।',
    loveMeetei: 'ꯆꯞ ꯆꯥꯕꯥ ꯑꯥꯆꯔꯟꯅꯥ ꯅꯨꯡꯁꯤꯕꯒꯤ ꯊꯥꯖꯕꯥ ꯍꯦꯅꯒꯠꯍꯟꯒꯅꯤ꯫',
    healthBengali: 'খোং অমসুং শরুগী ফিভমদা চেকশিনবীয়ু।',
    healthMeetei: 'ꯈꯣꯡ ꯑꯃꯁꯨꯡ ꯁꯔꯨꯒꯤ ꯐꯤꯚꯃꯗꯥ ꯆꯦꯛꯁꯤꯟꯕꯤꯌꯨ꯫'
  },
  {
    id: 'kumbha',
    signIndex: 10,
    nameEn: 'Aquarius',
    nameBengali: 'কুম্ভ',
    nameMeetei: 'ꯀꯨꯃ꯭ꯚ',
    symbol: '♒',
    lord: 'শনি (Saturn)',
    element: 'Air (বায়ু)',
    luckyColor: 'লৈবাকহাক (Purple / Violet)',
    luckyNumber: '১১ (11)',
    luckyTime: '০১:০০ PM - ০৩:০০ PM',
    luckScore: 86,
    summaryBengali: 'অনৌবা ৱাখল্লোন অমসুং সমাজগী অফবা থবক্তা মায়পাকপা ফংগনি। মীচমগী পুকচেল ৱাংলক্কনি।',
    summaryMeetei: 'ꯑꯅꯧꯕꯥ ꯋꯥꯈꯜꯂꯣꯟ ꯑꯃꯁꯨꯡ ꯁꯃꯥꯖꯒꯤ ꯑꯐꯕꯥ ꯊꯕꯛꯇꯥ ꯃꯥꯌꯄꯥꯛꯄꯥ ꯐꯪꯒꯅꯤ꯫ ꯃꯤꯆꯝꯒꯤ ꯄꯨꯛꯆꯦꯜ ꯋꯥꯡꯂꯛꯀꯅꯤ꯫',
    careerBengali: 'অনৌবা তেক্নোলজি অমসুং কাংলুপকী থবক্তা মায়পাকপা লাক্কনি।',
    careerMeetei: 'ꯑꯅꯧꯕꯥ ꯇꯦꯛꯅꯣꯂꯣꯖꯤ ꯑꯃꯁꯨꯡ ꯀꯥꯡꯂꯨꯄꯀꯤ ꯊꯕꯛꯇꯥ ꯃꯥꯌꯄꯥꯛꯄꯥ ꯂꯥꯛꯀꯅꯤ꯫',
    loveBengali: 'মরূপ-মপাংগুম্না নুংশিনবনা মরী চেৎশিলহনগনি।',
    loveMeetei: 'ꯃꯔꯨꯞ-ꯃꯄꯥꯡꯒꯨꯃ꯭ꯅꯥ ꯅꯨꯡꯁꯤꯟꯕꯅꯥ ꯃꯔꯤ ꯆꯦꯠꯁꯤꯂꯍꯟꯒꯅꯤ꯫',
    healthBengali: 'মতিক চাবা পোথারবা অমসুং ৱাখল নিংথিনা লৈবীয়ু।',
    healthMeetei: 'ꯃꯇꯤꯛ ꯆꯥꯕꯥ ꯄꯣꯊꯥꯔꯕꯥ ꯑꯃꯁꯨꯡ ꯋꯥꯈꯜ ꯅꯤꯡꯊꯤꯅꯥ ꯂꯩꯕꯤꯌꯨ꯫'
  },
  {
    id: 'meena',
    signIndex: 11,
    nameEn: 'Pisces',
    nameBengali: 'মীন',
    nameMeetei: 'ꯃꯤꯟ',
    symbol: '♓',
    lord: 'বৃহস্পতি (Jupiter)',
    element: 'Water (জল)',
    luckyColor: 'সনা মচু (Golden Yellow)',
    luckyNumber: '১২ (12)',
    luckyTime: '০৯:০০ AM - ১১:০০ AM',
    luckScore: 91,
    summaryBengali: 'থৱায়গী শান্তি অমসুং পুকচেলদা মহৌশাগী মঙাল ফংগনি। লাইনিং-থৌরমদা মন পুন্না চৎপা ফগনি।',
    summaryMeetei: 'ꯊꯋꯥꯌꯒꯤ ꯁꯥꯟꯇꯤ ꯑꯃꯁꯨꯡ ꯄꯨꯛꯆꯦꯜꯗꯥ ꯃꯍꯧꯁꯥꯒꯤ ꯃꯉꯥꯜ ꯐꯪꯒꯅꯤ꯫ ꯂꯥꯏꯅꯤꯡ-ꯊꯧꯔꯥꯝꯗꯥ ꯃꯟ ꯄꯨꯟꯅꯥ ꯆꯠꯄꯥ ꯐꯒꯅꯤ꯫',
    careerBengali: 'অনৌবা পোৎলম পুথোকপা অমসুং কলাগী লমদা মায়পাকপা ফংগনি।',
    careerMeetei: 'ꯑꯅꯧꯕꯥ ꯄꯣꯠꯂꯝ ꯄꯨꯊꯣꯛꯄꯥ ꯑꯃꯁꯨꯡ ꯀꯂꯥꯒꯤ ꯂꯃꯗꯥ ꯃꯥꯌꯄꯥꯛꯄꯥ ꯐꯪꯒꯅꯤ꯫',
    loveBengali: 'নুংশিবগী ফিভমদা নিংতম্না নুংঙাইবা ফংগনি।',
    loveMeetei: 'ꯅꯨꯡꯁꯤꯕꯒꯤ ꯐꯤꯚꯃꯗꯥ ꯅꯤꯡꯇꯝꯅꯥ ꯅꯨꯡꯉꯥꯏꯕꯥ ꯐꯪꯒꯅꯤ꯫',
    healthBengali: 'তুম্বা নিংথিনা তুমউ অমসুং হকচাং নিংথিনা য়েংশিনবীয়ু।',
    healthMeetei: 'ꯇꯨꯝꯕꯥ ꯅꯤꯡꯊꯤꯅꯥ ꯇꯨꯝꯎ ꯑꯃꯁꯨꯡ ꯍꯛꯆꯥꯡ ꯅꯤꯡꯊꯤꯅꯥ ꯌꯦꯡꯁꯤꯟꯕꯤꯌꯨ꯫'
  }
];

export default function AndroidAppHomeView({
  initialTab = 'home'
}: {
  initialTab?: 'home' | 'calendar' | 'horoscope' | 'panchang' | 'kuthi_eba' | 'kuthi_yengba' | 'useful' | 'leipung' | 'account';
}) {
  const [scriptMode, setScriptMode] = useState<ScriptMode>('bengali');
  const [selectedRashiId, setSelectedRashiId] = useState<string>('mesha');
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'horoscope' | 'panchang' | 'kuthi_eba' | 'kuthi_yengba' | 'useful' | 'leipung' | 'account'>(initialTab);
  const [adDismissed, setAdDismissed] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showMorePanchang, setShowMorePanchang] = useState(false);
  const [horoscopeTab, setHoroscopeTab] = useState<'overview' | 'career' | 'love' | 'health'>('overview');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Dynamic Useful Topics & App Control State
  const [usefulTopics, setUsefulTopics] = useState<any[]>([]);
  const [selectedUsefulTopicId, setSelectedUsefulTopicId] = useState<string | null>(null);
  const [usefulSearchQuery, setUsefulSearchQuery] = useState<string>('');
  const [usefulCategoryFilter, setUsefulCategoryFilter] = useState<string>('All');
  const [appSettings, setAppSettings] = useState<any>({
    features: {
      maintenance_mode: false,
      show_rashifal: true,
      show_panchang: true,
      show_calendar_banner: true,
      show_kuthi_cards: true,
      show_useful_tab: true,
    },
    ads: {
      global_enabled: true,
      top_banner: { enabled: true, unit_id: 'ca-app-pub-3940256099942544/6300978111', type: 'native_card' },
      middle_feed: { enabled: true, unit_id: 'ca-app-pub-3940256099942544/6300978112', type: 'banner' },
      bottom_sticky: { enabled: false, unit_id: 'ca-app-pub-3940256099942544/6300978113', type: 'banner' },
      interstitial_enabled: false,
    },
  });

  // Fetch Useful Topics and App Settings
  useEffect(() => {
    fetch('/api/useful')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.topics) setUsefulTopics(d.topics);
      })
      .catch((e) => console.error('Error fetching useful topics in app:', e));

    fetch('/api/app-settings')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.settings) setAppSettings(d.settings);
      })
      .catch((e) => console.error('Error fetching app settings:', e));
  }, []);

  // Kuthi Eba (Janma Patrika) In-App Form State
  const [ebaType, setEbaType] = useState<'new_born' | 'rewrite'>('new_born');
  const [ebaName, setEbaName] = useState('');
  const [ebaFather, setEbaFather] = useState('');
  const [ebaMother, setEbaMother] = useState('');
  const [ebaDob, setEbaDob] = useState('2026-09-15');
  const [ebaTob, setEbaTob] = useState('10:30');
  const [ebaPob, setEbaPob] = useState('Imphal, Manipur');
  const [ebaYek, setEbaYek] = useState('Mangang');
  const [ebaPhone, setEbaPhone] = useState('');
  const [ebaAddress, setEbaAddress] = useState('');
  const [ebaPackage, setEbaPackage] = useState<'standard' | 'deluxe'>('standard');

  // Kuthi Yengba (Horoscope Reading) In-App Form State
  const [yengbaName, setYengbaName] = useState('');
  const [yengbaPhone, setYengbaPhone] = useState('');
  const [yengbaDob, setYengbaDob] = useState('');
  const [yengbaTob, setYengbaTob] = useState('');
  const [yengbaPob, setYengbaPob] = useState('Imphal, Manipur');
  const [yengbaService, setYengbaService] = useState('standard');
  const [yengbaQuestion, setYengbaQuestion] = useState('');

  // Calendar specific state for native in-app calendar section
  const now = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, [now]);

  const [calYear, setCalYear] = useState<number>(now.getFullYear());
  const [calMonth, setCalMonth] = useState<number>(now.getMonth() + 1);
  const [calSelectedDateStr, setCalSelectedDateStr] = useState<string>(todayStr);

  // Read URL query parameter ?tab=... on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['home', 'calendar', 'horoscope', 'panchang', 'kuthi_eba', 'kuthi_yengba', 'useful', 'leipung', 'account'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  const handleEbaWhatsAppOrder = () => {
    const pkgName = ebaPackage === 'standard' ? 'Standard Sacred Parchment (₹899)' : 'Deluxe Gold Scroll (₹1,499)';
    const text = encodeURIComponent(
      `*New Sacred Kuthi Eba Order (Kanglei Astro App)*\n\n` +
      `*Category:* ${ebaType === 'new_born' ? 'New Born Janma Patrika' : 'Rewrite Old Kuthi'}\n` +
      `*Name:* ${ebaName || 'Not provided'}\n` +
      `*Father:* ${ebaFather || 'Not provided'}\n` +
      `*Mother:* ${ebaMother || 'Not provided'}\n` +
      `*DOB:* ${ebaDob}\n` +
      `*TOB:* ${ebaTob}\n` +
      `*POB:* ${ebaPob}\n` +
      `*Yek/Salai:* ${ebaYek}\n` +
      `*Contact:* ${ebaPhone || 'Not provided'}\n` +
      `*Delivery Address:* ${ebaAddress || 'Not provided'}\n` +
      `*Package:* ${pkgName}`
    );
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
    }
  };

  const handleYengbaWhatsAppOrder = () => {
    const svcMap: Record<string, string> = {
      standard: 'Standard Kuthi Reading (₹499)',
      dasha: 'Full Life & Dasha Analysis (₹799)',
      career: 'Career & Financial Consultation (₹599)',
      marriage: 'Marriage & Compatibility Reading (₹699)'
    };
    const text = encodeURIComponent(
      `*Kuthi Yengba Consultation Request (Kanglei Astro App)*\n\n` +
      `*Service:* ${svcMap[yengbaService] || 'Sacred Horoscope Reading'}\n` +
      `*Name:* ${yengbaName || 'Not provided'}\n` +
      `*Contact:* ${yengbaPhone || 'Not provided'}\n` +
      `*DOB:* ${yengbaDob || 'Not provided'}\n` +
      `*TOB:* ${yengbaTob || 'Not provided'}\n` +
      `*POB:* ${yengbaPob || 'Imphal, Manipur'}\n` +
      `*Questions/Focus:* ${yengbaQuestion || 'General chart review'}`
    );
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Today's Panchang
  const panchang = useMemo(() => {
    return calculateVedicPanchang(todayStr);
  }, [todayStr]);

  // Today's Monthly Calendar snapshot (for Home view)
  const monthlyData = useMemo(() => {
    return getMonthlyCalendar(now.getFullYear(), now.getMonth() + 1);
  }, [now]);

  // Find today's calendar day
  const todayCalendarDay = useMemo(() => {
    for (const week of monthlyData.weeks) {
      for (const day of week) {
        if (day && day.dateStr === todayStr) {
          return day;
        }
      }
    }
    return monthlyData.weeks[0]?.find(Boolean) || null;
  }, [monthlyData, todayStr]);

  // Calendar Data for current selected year & month
  const currentCalendarData = useMemo(() => {
    return getMonthlyCalendar(calYear, calMonth);
  }, [calYear, calMonth]);

  // Active day within calendar
  const activeCalendarDay = useMemo(() => {
    for (const week of currentCalendarData.weeks) {
      for (const day of week) {
        if (day && day.dateStr === calSelectedDateStr) {
          return day;
        }
      }
    }
    // Fallback to today or first day
    for (const week of currentCalendarData.weeks) {
      for (const day of week) {
        if (day) return day;
      }
    }
    return null;
  }, [currentCalendarData, calSelectedDateStr]);

  // Month navigation handlers
  const handlePrevCalMonth = () => {
    if (calMonth === 1) {
      setCalMonth(12);
      setCalYear(prev => prev - 1);
      setCalSelectedDateStr(`${calYear - 1}-12-01`);
    } else {
      const prevM = calMonth - 1;
      setCalMonth(prevM);
      setCalSelectedDateStr(`${calYear}-${String(prevM).padStart(2, '0')}-01`);
    }
  };

  const handleNextCalMonth = () => {
    if (calMonth === 12) {
      setCalMonth(1);
      setCalYear(prev => prev + 1);
      setCalSelectedDateStr(`${calYear + 1}-01-01`);
    } else {
      const nextM = calMonth + 1;
      setCalMonth(nextM);
      setCalSelectedDateStr(`${calYear}-${String(nextM).padStart(2, '0')}-01`);
    }
  };

  const handleJumpCalToToday = () => {
    setCalYear(now.getFullYear());
    setCalMonth(now.getMonth() + 1);
    setCalSelectedDateStr(todayStr);
  };

  // Selected Rashi Horoscope
  const selectedRashi = useMemo(() => {
    return RASHIS.find((r) => r.id === selectedRashiId) || RASHIS[0];
  }, [selectedRashiId]);

  return (
    <div className="w-full max-w-md mx-auto bg-[#f8fafc] text-slate-900 h-[100vh] h-[100dvh] max-h-[100dvh] flex flex-col font-sans relative shadow-2xl border-x border-slate-200/80 select-none-mobile overflow-hidden">
      
      {/* Animated Professional Splash Screen */}
      {showSplash && <AppSplashScreen onFinish={() => setShowSplash(false)} />}
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. FIXED NATIVE ANDROID TOP APP BAR */}
      <div className="flex-shrink-0 z-40 bg-[#0f172a] shadow-mobile-appbar border-b border-slate-800 select-none-mobile pt-safe">
        {/* Native Android App Bar (Material You / Midnight Gold Header) */}
        <header className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeTab !== 'home' ? (
              <button
                type="button"
                onClick={() => {
                  if (selectedUsefulTopicId) {
                    setSelectedUsefulTopicId(null);
                  } else {
                    setActiveTab('home');
                  }
                }}
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-amber-300 transition app-active-press cursor-pointer"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowDrawer(true)}
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 flex items-center justify-center text-amber-200 transition app-active-press cursor-pointer"
                aria-label="Open navigation drawer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-sm shrink-0">
                {activeTab === 'calendar' ? (
                  <CalendarIcon className="w-4.5 h-4.5 text-slate-950" />
                ) : activeTab === 'kuthi_eba' ? (
                  <BookOpen className="w-4.5 h-4.5 text-slate-950" />
                ) : activeTab === 'kuthi_yengba' ? (
                  <Eye className="w-4.5 h-4.5 text-slate-950" />
                ) : activeTab === 'panchang' ? (
                  <Clock className="w-4.5 h-4.5 text-slate-950" />
                ) : activeTab === 'leipung' ? (
                  <MessageSquare className="w-4.5 h-4.5 text-slate-950" />
                ) : activeTab === 'account' ? (
                  <User className="w-4.5 h-4.5 text-slate-950" />
                ) : (
                  <Sun className="w-4.5 h-4.5 text-slate-950" />
                )}
              </div>
              <div>
                <h1 className="text-[15px] font-sans font-bold tracking-tight leading-none text-slate-50">
                  {activeTab === 'calendar'
                    ? 'Manipuri Calendar'
                    : activeTab === 'kuthi_eba'
                    ? (scriptMode === 'meetei' ? 'ꯀꯨꯊꯤ ꯏꯕ (Kuthi Eba)' : 'কুথি ইবা (Kuthi Eba)')
                    : activeTab === 'kuthi_yengba'
                    ? (scriptMode === 'meetei' ? 'ꯀꯨꯊꯤ ꯌꯦꯡꯕ (Kuthi Yengba)' : 'কুথি য়েংবা (Kuthi Yengba)')
                    : activeTab === 'panchang'
                    ? (scriptMode === 'meetei' ? 'ꯃꯅꯤꯄꯨꯔꯤ ꯄꯥꯟꯆꯥꯡ (Panchang)' : 'মণিপুরী পাঞ্জিকা (Manipuri Panchang)')
                    : activeTab === 'leipung'
                    ? (scriptMode === 'meetei' ? 'ꯂꯩꯄꯨꯡ (Leipung Feed)' : 'লৈপুং (Leipung Community)')
                    : activeTab === 'account'
                    ? (scriptMode === 'meetei' ? 'ꯑꯦꯀꯥꯎꯟꯠ & ꯄ꯭ꯔꯣꯐꯥꯏꯜ (Account)' : 'একাউন্ট ও প্রোফাইল (Account)')
                    : 'Kanglei Astro'}
                </h1>
                <span className="text-[11px] text-amber-400/90 font-medium leading-none block mt-1">
                  {activeTab === 'calendar'
                    ? `${currentCalendarData.monthNameEn} ${calYear}`
                    : activeTab === 'kuthi_eba'
                    ? (scriptMode === 'meetei' ? 'ꯑꯍꯣꯡꯕ ꯂꯥꯏꯔꯤꯛ ꯏꯕ' : 'অনলাইন জন্ম পত্রিকা ইবা')
                    : activeTab === 'kuthi_yengba'
                    ? (scriptMode === 'meetei' ? 'ꯍꯨꯔꯣꯁ꯭ꯀꯣꯞ ꯌꯦꯡꯕ' : 'জ্যোতিষী কন্সাল্টেশন')
                    : activeTab === 'panchang'
                    ? (scriptMode === 'meetei' ? 'ꯅꯨꯃꯤꯠ ꯈꯨꯗꯤꯡꯒꯤ ꯊꯧꯔꯝ' : 'প্রতিদিনের শুভ তিথি ও সময়')
                    : activeTab === 'leipung'
                    ? (scriptMode === 'meetei' ? 'ꯈꯨꯟꯅꯥꯏꯒꯤ ꯋꯥꯔꯤ-ꯋꯥꯇꯥ' : 'সামাজিক আলোচনা ও প্রশ্নোত্তর')
                    : activeTab === 'account'
                    ? 'Sign In, Sign Up & Manage Profile'
                    : 'মণিপুরী পঞ্জিকা ও রাশিফল'}
                </span>
              </div>
            </div>
          </div>

          {/* Script Switcher & Action Icons */}
          <div className="flex items-center gap-1.5">
            <div className="inline-flex rounded-full border border-slate-700/80 p-0.5 bg-slate-900 text-[10px] font-bold shadow-inner">
              <button
                type="button"
                onClick={() => setScriptMode('bengali')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  scriptMode === 'bengali'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setScriptMode('meetei')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  scriptMode === 'meetei'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ꯃꯤꯇꯩ
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'calendar' ? 'home' : 'calendar')}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition app-active-press cursor-pointer ${
                activeTab === 'calendar' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-800/80 hover:bg-slate-700 text-amber-300'
              }`}
              title="Toggle Calendar"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'account' ? 'home' : 'account')}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition app-active-press cursor-pointer ${
                activeTab === 'account' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-800/80 hover:bg-slate-700 text-amber-300'
              }`}
              title="Account & Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. ANDROID SLIDE-OUT NAVIGATION DRAWER                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowDrawer(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#0f172a] text-slate-50 h-full shadow-2xl flex flex-col z-10 border-r border-slate-800 animate-in slide-in-from-left duration-200 pt-safe pb-safe">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 bg-gradient-to-b from-slate-900 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-amber-950 font-black shadow-md">
                  <Sun className="w-6 h-6" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-amber-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-base font-serif font-black text-amber-100">Kanglei Astro App</h2>
              <p className="text-xs text-amber-300/80 font-serif">
                Manipur Astrological Portal & Daily Calendar
              </p>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-serif no-scrollbar">
              
              {/* Account / Kundli Profile Card (Controlled from Admin) */}
              {appSettings?.side_menu?.show_account !== false && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('account');
                    setShowDrawer(false);
                  }}
                  className="w-full text-left p-3 mb-2 rounded-2xl bg-[#2a221b] border border-amber-800/40 flex items-center justify-between hover:bg-[#382d24] transition block cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-amber-100 block leading-tight truncate font-sans">
                        {appSettings?.side_menu?.account_title || 'Sign In / My Account'}
                      </span>
                      <span className="text-[10px] text-amber-400/80 block leading-none mt-0.5 truncate font-sans">
                        {appSettings?.side_menu?.account_subtitle || 'Sign in, register & manage profile'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400/60 shrink-0" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setActiveTab('home');
                  setShowDrawer(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold transition cursor-pointer ${
                  activeTab === 'home' ? 'bg-amber-600 text-white shadow-xs' : 'hover:bg-amber-900/30 text-amber-100'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Home (মূল পৃষ্ঠা)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('calendar');
                  setShowDrawer(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold transition cursor-pointer ${
                  activeTab === 'calendar' ? 'bg-amber-600 text-white shadow-xs' : 'hover:bg-amber-900/30 text-amber-100'
                }`}
              >
                <CalendarIcon className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Manipuri Calendar (থাগী ক্যালেন্ডার)</span>
              </button>

              {appSettings?.features?.show_rashifal !== false && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('horoscope');
                    setShowDrawer(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold transition cursor-pointer ${
                    activeTab === 'horoscope' ? 'bg-amber-600 text-white shadow-xs' : 'hover:bg-amber-900/30 text-amber-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Today Rashifall (দৈনিক রাশিফল)</span>
                </button>
              )}

              {appSettings?.features?.show_kuthi_cards !== false && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('kuthi_eba');
                      setShowDrawer(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold transition cursor-pointer ${
                      activeTab === 'kuthi_eba' ? 'bg-amber-600 text-white shadow-xs' : 'hover:bg-amber-900/30 text-amber-100'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Kuthi Eba (কুথি ইবা - Janma Patrika)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('kuthi_yengba');
                      setShowDrawer(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold transition cursor-pointer ${
                      activeTab === 'kuthi_yengba' ? 'bg-amber-600 text-white shadow-xs' : 'hover:bg-amber-900/30 text-amber-100'
                    }`}
                  >
                    <Eye className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Kuthi Yengba (কুথি য়েংবা - Chart Reading)</span>
                  </button>
                </>
              )}

              {appSettings?.features?.show_panchang !== false && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('panchang');
                    setShowDrawer(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold transition cursor-pointer ${
                    activeTab === 'panchang' ? 'bg-amber-600 text-white shadow-xs' : 'hover:bg-amber-900/30 text-amber-100'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Manipuri Panchang (মণিপুরী পঞ্জিকা)</span>
                </button>
              )}

              {appSettings?.features?.show_useful_tab !== false && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('useful');
                    setSelectedUsefulTopicId(null);
                    setShowDrawer(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold transition cursor-pointer ${
                    activeTab === 'useful' ? 'bg-amber-600 text-white shadow-xs' : 'hover:bg-amber-900/30 text-amber-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Useful Guides & Rules (লমজিং ও নিয়ম)</span>
                </button>
              )}

              {/* Leipung Social Feed Drawer Link */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('leipung');
                  setShowDrawer(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold transition cursor-pointer ${
                  activeTab === 'leipung' ? 'bg-amber-600 text-white shadow-xs' : 'hover:bg-amber-900/30 text-amber-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Leipung Community (ꯂꯩꯄꯨꯡ ꯈꯨꯟꯅꯥꯏ)</span>
              </button>

              {/* Dynamic Custom Navigation Links (Configured via Admin) */}
              {appSettings?.side_menu?.custom_links?.filter((l: any) => l.enabled !== false).map((link: any) => (
                <Link
                  key={link.id}
                  href={link.url}
                  onClick={() => setShowDrawer(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left font-medium hover:bg-amber-900/30 text-amber-100 transition cursor-pointer font-sans text-xs"
                >
                  {link.icon === 'UserCheck' ? (
                    <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : link.icon === 'ShoppingBag' ? (
                    <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : link.icon === 'Phone' ? (
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Legal, Account & Store Compliance Section (Apple & Google Play Policy) */}
              <div className="pt-2 border-t border-amber-800/30 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('account');
                    setShowDrawer(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left font-medium hover:bg-amber-900/30 text-amber-100 transition cursor-pointer font-sans text-xs"
                >
                  <User className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Account, Sign In & Data Deletion</span>
                </button>

                <Link
                  href="/app/disclaimer"
                  onClick={() => setShowDrawer(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left font-medium hover:bg-amber-900/30 text-amber-200/80 transition cursor-pointer font-sans text-xs"
                >
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Astrological Disclaimer</span>
                </Link>

                <Link
                  href="/app/terms-of-service"
                  onClick={() => setShowDrawer(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left font-medium hover:bg-amber-900/30 text-amber-200/80 transition cursor-pointer font-sans text-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Terms of Service & EULA</span>
                </Link>

                <Link
                  href="/app/privacy-policy"
                  onClick={() => setShowDrawer(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left font-medium hover:bg-amber-900/30 text-amber-200/80 transition cursor-pointer font-sans text-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Privacy Policy</span>
                </Link>

                {/* Replay Splash Animation Action */}
                <button
                  type="button"
                  onClick={() => {
                    setShowSplash(true);
                    setShowDrawer(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left font-medium hover:bg-amber-900/30 text-amber-300 transition cursor-pointer font-sans text-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Replay Intro Animation</span>
                </button>
              </div>

              {/* Share App Action (Configured via Admin) */}
              {appSettings?.side_menu?.show_share !== false && (
                <button
                  type="button"
                  onClick={() => {
                    const shareData = {
                      title: 'Kanglei Astro',
                      text: appSettings?.side_menu?.share_message || 'Explore Manipuri Calendar, Panchang & Janma Patrika on Kanglei Astro',
                      url: appSettings?.side_menu?.share_url || window.location.origin,
                    };
                    if (typeof navigator !== 'undefined' && navigator.share) {
                      navigator.share(shareData);
                    } else if (typeof navigator !== 'undefined') {
                      navigator.clipboard.writeText(shareData.url);
                      alert('Kanglei Astro App link copied to clipboard!');
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left font-bold text-amber-200 hover:bg-amber-900/30 transition border border-amber-800/40 mt-3 bg-amber-950/30 cursor-pointer font-sans"
                >
                  <Share2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-bold leading-tight truncate">
                      {appSettings?.side_menu?.share_title || 'Share App with Friends'}
                    </span>
                    <span className="block text-[9.5px] text-amber-400/75 leading-tight truncate mt-0.5">
                      {appSettings?.side_menu?.share_subtitle || 'Spread Manipuri Astrology & Calendar'}
                    </span>
                  </div>
                </button>
              )}

              {/* Social Media Channels Row (Configured via Admin) */}
              {appSettings?.side_menu?.show_social_links !== false && (
                <div className="pt-2 px-1 flex items-center justify-around border-t border-amber-800/20 my-2 text-amber-300">
                  {appSettings?.side_menu?.social_links?.facebook && (
                    <a
                      href={appSettings.side_menu.social_links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-blue-400 transition"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {appSettings?.side_menu?.social_links?.whatsapp && (
                    <a
                      href={appSettings.side_menu.social_links.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 transition"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  {appSettings?.side_menu?.social_links?.youtube && (
                    <a
                      href={appSettings.side_menu.social_links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-red-400 transition"
                      title="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {appSettings?.side_menu?.social_links?.instagram && (
                    <a
                      href={appSettings.side_menu.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-pink-400 transition"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {appSettings?.side_menu?.social_links?.telegram && (
                    <a
                      href={appSettings.side_menu.social_links.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-sky-400 transition"
                      title="Telegram"
                    >
                      <Send className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer with Version and User-Requested Bottom Branding */}
            <div className="p-3.5 border-t border-amber-800/30 bg-black/40 text-center space-y-1">
              <div className="text-[10px] text-amber-400/80 font-mono">
                {appSettings?.side_menu?.app_version || 'v1.2.0'} • Vishuddha Siddhanta Manipur
              </div>
              <div className="text-[11px] font-bold tracking-wide text-amber-300 font-serif border-t border-amber-800/20 pt-1">
                {appSettings?.side_menu?.bottom_branding_text || 'Manipuri Calender by KangleiAstro'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SCROLLABLE MIDDLE WORKSPACE CONTAINER                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* 4. DEDICATED CALENDAR SECTION IN MOBILE APP                   */}
        {/* When activeTab === 'calendar', show ONLY the calendar section!*/}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'calendar' ? (
        <main className="flex-1 p-3.5 space-y-3.5">
          
          {/* Calendar Month Navigation Header */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevCalMonth}
                className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center border border-gray-200 transition active:scale-95 cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h2 className="text-base font-bold text-[#1e1b18] tracking-tight leading-tight">
                  {currentCalendarData.monthNameEn} {calYear}
                </h2>
                <span className="text-xs text-amber-600 font-semibold block mt-0.5">
                  {scriptMode === 'meetei'
                    ? `${currentCalendarData.manipuriMonthSpanMeetei} ꯊꯥ`
                    : `${currentCalendarData.manipuriMonthSpanBengali} থা`}
                  {' • '}
                  শকাব্দ {scriptMode === 'meetei' ? toMeeteiNumerals(activeCalendarDay?.sakaYear || 1948) : toBengaliNumerals(activeCalendarDay?.sakaYear || 1948)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextCalMonth}
                className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center border border-gray-200 transition active:scale-95 cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick jump to Today */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
              <span className="text-gray-500 font-medium">
                Today: {todayCalendarDay?.tithiDisplayBengali}
              </span>
              <button
                type="button"
                onClick={handleJumpCalToToday}
                className="px-3 py-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                Jump to Today
              </button>
            </div>
          </div>

          {/* 7-Column Structured Month Grid Table */}
          <div className="bg-[#E5E7EB] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm grid grid-cols-7 gap-[1px]">
            {/* Weekday Headers: Light slate fill (#F8FAFC), 11px uppercase bold labels, Sunday in red */}
            {WEEKDAYS_MANIPURI.map((wd) => {
              const isSun = wd.day === 0;
              return (
                <div
                  key={`wd-${wd.day}`}
                  className="bg-[#F8FAFC] py-2 px-1 flex flex-col items-center justify-center text-center select-none"
                >
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider leading-none ${
                      isSun ? 'text-[#DC2626]' : 'text-[#64748B]'
                    }`}
                  >
                    {wd.shortEn}
                  </span>
                  {scriptMode === 'meetei' && (
                    <span className={`text-[9px] font-semibold leading-tight mt-0.5 ${isSun ? 'text-[#DC2626]' : 'text-[#64748B]'}`}>
                      {wd.meetei}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Days Cells */}
            {currentCalendarData.weeks.map((week, wIdx) =>
              week.map((day, dIdx) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${wIdx}-${dIdx}`}
                      className="min-h-[72px] bg-[#FAFAFA] rounded-[10px]"
                    />
                  );
                }

                const isSelected = day.dateStr === calSelectedDateStr;
                const isToday = day.dateStr === todayStr;
                const isSunday = dIdx === 0;
                const monthName = scriptMode === 'meetei' ? day.manipuriMonth.nameMeetei : day.manipuriMonth.nameBengali;
                const tithiStr = scriptMode === 'meetei'
                  ? (day.isDualTithi ? `${toMeeteiNumerals(day.tithiNumber)}, ${toMeeteiNumerals(day.tithiNumber + 1)}` : toMeeteiNumerals(day.tithiNumber))
                  : (day.isDualTithi ? `${toBengaliNumerals(day.tithiNumber)}, ${toBengaliNumerals(day.tithiNumber + 1)}` : toBengaliNumerals(day.tithiNumber));

                const nakshatraNum = scriptMode === 'meetei'
                  ? day.nakshatraDisplayNumMeetei
                  : day.nakshatraDisplayNumBengali;

                const hasEvent = !!(day.festival || day.isGeneralHoliday || day.isPurnima || day.isAmavasya || day.isEkadashi);
                const isHolidayOrPurnima = !!(day.isGeneralHoliday || day.isPurnima || isSunday);

                return (
                  <button
                    key={day.dateStr}
                    type="button"
                    onClick={() => setCalSelectedDateStr(day.dateStr)}
                    className={`relative min-h-[72px] p-[4px_2px] flex flex-col items-center justify-center text-center rounded-[10px] transition-all cursor-pointer select-none border ${
                      isSelected
                        ? 'bg-[#FFFBEB] ring-2 ring-[#D97706] border-[#D97706] z-10'
                        : isToday
                        ? 'bg-[#FFFBEB] ring-2 ring-[#D97706] border-[#D97706] z-10'
                        : isSunday
                        ? 'bg-[#FFF8F8] border-[#F1F5F9] hover:bg-[#FEE2E2]/60'
                        : 'bg-white border-[#F1F5F9] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {/* 1. Top-Left Corner — Nakshatra Number ONLY */}
                    <span
                      className={`absolute top-1 left-1.5 text-[10px] font-semibold leading-none ${
                        isToday ? 'text-[#B45309]' : 'text-slate-400'
                      }`}
                    >
                      {nakshatraNum}
                    </span>

                    {/* 2. Top-Right Corner — Event / Festival Indicator Dot */}
                    {hasEvent && (
                      <span
                        className={`absolute top-1.5 right-1.5 w-[5px] h-[5px] rounded-full shrink-0 ${
                          isHolidayOrPurnima ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                        title={day.festival?.nameBengali || (day.isPurnima ? 'Purnima' : 'Special Event')}
                      />
                    )}

                    {/* 3. Center — Prominent Gregorian Date */}
                    <span
                      className={`text-lg font-extrabold tracking-tight leading-none font-sans ${
                        isSunday
                          ? 'text-[#DC2626]'
                          : isToday
                          ? 'text-[#B45309]'
                          : 'text-[#0F172A]'
                      }`}
                    >
                      {day.day}
                    </span>

                    {/* 4. Below Date — Manipuri Month Name */}
                    <span
                      className={`text-[10.5px] font-medium leading-tight mt-0.5 truncate max-w-full block ${
                        isSunday
                          ? 'text-[#DC2626]'
                          : isToday
                          ? 'text-[#92400E]'
                          : 'text-slate-600'
                      }`}
                    >
                      {monthName}
                    </span>

                    {/* 5. Bottom — Tithi Number */}
                    <span
                      className={`text-[11px] font-bold leading-none mt-0.5 ${
                        isSunday
                          ? 'text-[#DC2626]'
                          : isToday
                          ? 'text-[#92400E]'
                          : 'text-slate-800'
                      }`}
                    >
                      {tithiStr}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Selected Day Full Details Card */}
          {activeCalendarDay && (
            <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1e1b18] leading-tight">
                    {activeCalendarDay.dateStr === todayStr ? '✨ ' : ''}
                    {activeCalendarDay.dateStr}
                  </h3>
                  <span className="text-xs text-amber-600 font-semibold block mt-0.5">
                    {scriptMode === 'meetei'
                      ? `${activeCalendarDay.tithiDisplayMeetei} • ${activeCalendarDay.weekdayName.meetei}`
                      : `${activeCalendarDay.tithiDisplayBengali} • ${activeCalendarDay.weekdayName.bengali}`}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold border border-gray-200 block">
                    {activeCalendarDay.solarMonth.bengali} {toBengaliNumerals(activeCalendarDay.souraDate)}, {toBengaliNumerals(activeCalendarDay.sakaYear)}
                  </span>
                </div>
              </div>

              {/* Day Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 space-y-0.5">
                  <span className="text-xs text-gray-500 font-medium block">থাবান (Tithi Details):</span>
                  <strong className="text-sm text-[#111827] font-bold block">
                    {activeCalendarDay.tithiDisplayBengali}
                  </strong>
                  <span className="text-xs text-gray-500 font-normal block">
                    Ending: {activeCalendarDay.tithiEndingStandard || 'Sunrise'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 space-y-0.5">
                  <span className="text-xs text-gray-500 font-medium block">নক্ষত্র (Nakshatra):</span>
                  <strong className="text-sm text-[#111827] font-bold block truncate">
                    {scriptMode === 'meetei'
                      ? `ꯅꯛ:${activeCalendarDay.nakshatraDisplayNumMeetei} (${activeCalendarDay.nakshatraNameMeetei})`
                      : `নক্ষঃ ${activeCalendarDay.nakshatraDisplayNumBengali} (${activeCalendarDay.nakshatraNameBengali})`}
                  </strong>
                  <span className="text-xs text-gray-500 font-normal block">
                    Lord: {activeCalendarDay.panchang.fiveAngas.nakshatra.lord}
                  </span>
                </div>
              </div>

              {/* Festival / Holiday Alert */}
              {activeCalendarDay.festival && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                  <span>উৎসব ও ছুটি: {scriptMode === 'meetei' ? activeCalendarDay.festival.nameMeetei : activeCalendarDay.festival.nameBengali}</span>
                </div>
              )}

              {/* Tatnaba Numit Alert */}
              {activeCalendarDay.isEeKhudengLeitaba && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>তৎনবা নুমিৎ (ই-খুদেং লৈতাবা • Inauspicious)</span>
                </div>
              )}
            </div>
          )}

          {/* Month Attributes Accordion */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-[#1e1b18] border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Month Rules & Directions</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 font-medium block text-xs">
                  {scriptMode === 'meetei' ? 'ꯊꯥꯁꯤ ꯃꯥꯏꯒꯩ' : 'থাসী মাইকৈ (Thasi Maikei):'}
                </span>
                <strong className="text-[#1e1b18] font-bold block mt-0.5">
                  {scriptMode === 'meetei'
                    ? (currentCalendarData.activeMonthAttributes[0]?.tasiMahei?.meetei || 'ꯑꯋꯥꯡ')
                    : (currentCalendarData.activeMonthAttributes[0]?.tasiMahei?.bengali || 'অৱাং')}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 font-medium block text-xs">
                  {scriptMode === 'meetei' ? 'ꯇꯠꯅꯕ ꯅꯨꯃꯤꯠ' : 'তৎনবা নুমিৎ (Tatnaba Days):'}
                </span>
                <strong className="text-[#1e1b18] font-bold block mt-0.5">
                  {scriptMode === 'meetei'
                    ? (currentCalendarData.activeMonthAttributes[0]?.tatnabaNumit?.meetei || 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ')
                    : (currentCalendarData.activeMonthAttributes[0]?.tatnabaNumit?.bengali || 'নোংমাইজিং, নিংথৌকাবা')}
                </strong>
              </div>
            </div>
          </div>

        </main>
      ) : activeTab === 'kuthi_eba' ? (
        <main className="flex-1 p-3.5 space-y-3.5 font-sans animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-2xl p-4 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {scriptMode === 'meetei' ? 'ꯀꯨꯊꯤ ꯏꯕ (ꯖꯟꯃ ꯄꯠꯔꯤꯀꯥ)' : 'কুথি ইবা (জন্ম পত্রিকা)'}
                  </h2>
                  <span className="text-xs text-amber-200 block font-medium">
                    Authentic Handwritten Manipuri Horoscope
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1 rounded-xl bg-black/30 hover:bg-black/50 text-white text-xs font-bold transition cursor-pointer"
              >
                ← Back
              </button>
            </div>

            <p className="text-xs text-amber-100 leading-relaxed">
              {scriptMode === 'meetei'
                ? 'ꯃꯅꯤꯄꯨꯔꯤ ꯆꯠꯅꯕꯤꯒꯤ ꯃꯇꯨꯡ ꯏꯟꯅ ꯑꯍꯥꯟꯕ ꯄꯣꯛꯄ ꯑꯉꯥꯡꯒꯤ ꯀꯨꯊꯤ ꯏꯕ ꯑꯃꯁꯨꯡ ꯑꯔꯤꯕ ꯀꯨꯊꯤ ꯑꯅꯧꯕ ꯁꯦꯝꯕ꯫'
                : 'মণিপুরী চৎনবগী মতুং ইন্না অহানবা পোকপা অঙাংগী কুথি ইবা অমসুং অরিবা কুথি অনৌবা শেম্বা।'}
            </p>
          </div>

          {/* Service Type Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setEbaType('new_born')}
              className={`py-2 rounded-xl transition cursor-pointer ${ebaType === 'new_born' ? 'bg-white text-[#1e1b18] shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {scriptMode === 'meetei' ? 'ꯑꯅꯧꯕ ꯑꯉꯥꯡ (New Born)' : 'অনৌবা অঙাং (New Born)'}
            </button>
            <button
              type="button"
              onClick={() => setEbaType('rewrite')}
              className={`py-2 rounded-xl transition cursor-pointer ${ebaType === 'rewrite' ? 'bg-white text-[#1e1b18] shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {scriptMode === 'meetei' ? 'ꯀꯨꯊꯤ ꯑꯅꯧꯕ ꯁꯦꯝꯕ (Rewrite)' : 'কুথি অনৌবা শেম্বা (Rewrite)'}
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#1e1b18] uppercase tracking-wider border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>Client & Birth Details</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  {ebaType === 'new_born' ? 'Child Name (অঙাংগী মমিং):' : 'Person Name (মমিং):'}
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={ebaName}
                  onChange={(e) => setEbaName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Father's Name (মপা):</label>
                  <input
                    type="text"
                    placeholder="Father's Name"
                    value={ebaFather}
                    onChange={(e) => setEbaFather(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Mother's Name (মমা):</label>
                  <input
                    type="text"
                    placeholder="Mother's Name"
                    value={ebaMother}
                    onChange={(e) => setEbaMother(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Date of Birth:</label>
                  <input
                    type="date"
                    value={ebaDob}
                    onChange={(e) => setEbaDob(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Time of Birth:</label>
                  <input
                    type="time"
                    value={ebaTob}
                    onChange={(e) => setEbaTob(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Yek / Salai (য়েক/সালাই):</label>
                  <select
                    value={ebaYek}
                    onChange={(e) => setEbaYek(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-gray-300 focus:border-amber-600 bg-white outline-hidden font-sans text-xs text-gray-900"
                  >
                    <option value="Mangang">Mangang (মঙাং)</option>
                    <option value="Luwang">Luwang (লুৱাং)</option>
                    <option value="Khuman">Khuman (খুমন)</option>
                    <option value="Angom">Angom (অঙোম)</option>
                    <option value="Moirang">Moirang (মোইরাং)</option>
                    <option value="Kha Nganba">Kha Nganba (খা-ঙানবা)</option>
                    <option value="Salai Leishangthem">Salai Leishangthem (সালাই লৈশাংথেম)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Place of Birth:</label>
                  <input
                    type="text"
                    value={ebaPob}
                    onChange={(e) => setEbaPob(e.target.value)}
                    placeholder="Imphal, Manipur"
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">WhatsApp / Phone Number:</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={ebaPhone}
                  onChange={(e) => setEbaPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Delivery Address (Imphal/Manipur):</label>
                <textarea
                  rows={2}
                  placeholder="Address for home delivery of physical handwritten parchment"
                  value={ebaAddress}
                  onChange={(e) => setEbaAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Package Selection */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#1e1b18]">Select Parchment Package</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEbaPackage('standard')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  ebaPackage === 'standard' ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500' : 'bg-white border-gray-200'
                }`}
              >
                <span className="text-xs font-bold text-[#1e1b18] block">Standard Sacred</span>
                <span className="text-base font-bold text-amber-700 font-sans block mt-1">₹899</span>
                <span className="text-[11px] text-gray-500 block mt-0.5">Traditional Sacred Parchment</span>
              </button>

              <button
                type="button"
                onClick={() => setEbaPackage('deluxe')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  ebaPackage === 'deluxe' ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500' : 'bg-white border-gray-200'
                }`}
              >
                <span className="text-xs font-bold text-[#1e1b18] block">Deluxe Gold Scroll</span>
                <span className="text-base font-bold text-amber-700 font-sans block mt-1">₹1,499</span>
                <span className="text-[11px] text-gray-500 block mt-0.5">Gold-Bordered Sacred Scroll</span>
              </button>
            </div>
          </div>

          {/* Order Action Button */}
          <button
            type="button"
            onClick={handleEbaWhatsAppOrder}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Order Sacred Kuthi via WhatsApp (₹{ebaPackage === 'standard' ? '899' : '1,499'})</span>
          </button>
        </main>
      ) : activeTab === 'kuthi_yengba' ? (
        <main className="flex-1 p-3.5 space-y-3.5 font-sans animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-2xl p-4 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {scriptMode === 'meetei' ? 'ꯀꯨꯊꯤ ꯌꯦꯡꯕ (ꯍꯣꯔꯣꯁ꯭ꯀꯣꯞ)' : 'কুথি য়েংবা (হরোস্কোপ)'}
                  </h2>
                  <span className="text-xs text-amber-200 block font-medium">
                    Authentic Vedic & Manipuri Chart Reading
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1 rounded-xl bg-black/30 hover:bg-black/50 text-white text-xs font-bold transition cursor-pointer"
              >
                ← Back
              </button>
            </div>

            <p className="text-xs text-amber-100 leading-relaxed">
              {scriptMode === 'meetei'
                ? 'ꯅꯍꯥꯛꯀꯤ ꯀꯨꯊꯤ/ꯍꯣꯔꯣꯁ꯭ꯀꯣꯞ ꯍꯩꯁꯤꯡꯂꯕ ꯃꯅꯤꯄꯨꯔꯤ ꯖ꯭ꯌꯣꯇꯤꯁꯤꯡꯅ ꯀꯨꯞꯅ ꯌꯦꯡꯕꯤꯒꯅꯤ꯫'
                : 'নহাক্কী কুথি/হরোস্কোপ হৈশিংলবা মণিপুরী জ্যোতিষীশিংনা কূপ্না য়েংবীগনি।'}
            </p>
          </div>

          {/* Reading Services List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#1e1b18]">Select Reading Service</h3>
            <div className="space-y-2">
              {[
                { id: 'standard', name: 'Standard Kuthi Reading', price: 499, desc: 'Overall chart review & current planetary influence' },
                { id: 'dasha', name: 'Full Life & Dasha Analysis', price: 799, desc: 'Vimshottari Dasha period analysis & predictions' },
                { id: 'career', name: 'Career & Financial Consultation', price: 599, desc: 'Job prospects, business growth & investments' },
                { id: 'marriage', name: 'Marriage & Compatibility Reading', price: 699, desc: 'Kundli matching, compatibility & marital life' },
              ].map((svc) => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setYengbaService(svc.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                    yengbaService === svc.id ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500' : 'bg-white border-gray-200'
                  }`}
                >
                  <div>
                    <strong className="text-xs font-bold text-[#1e1b18] block">{svc.name}</strong>
                    <span className="text-[11px] text-gray-500 block mt-0.5">{svc.desc}</span>
                  </div>
                  <span className="text-sm font-bold text-amber-700 font-sans">₹{svc.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Client Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#1e1b18] border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>Your Details & Questions</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Your Full Name (মমিং):</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={yengbaName}
                  onChange={(e) => setYengbaName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">WhatsApp / Phone Number:</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={yengbaPhone}
                  onChange={(e) => setYengbaPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Date of Birth:</label>
                  <input
                    type="date"
                    value={yengbaDob}
                    onChange={(e) => setYengbaDob(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Time of Birth:</label>
                  <input
                    type="time"
                    value={yengbaTob}
                    onChange={(e) => setYengbaTob(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Place of Birth:</label>
                <input
                  type="text"
                  value={yengbaPob}
                  onChange={(e) => setYengbaPob(e.target.value)}
                  placeholder="e.g. Imphal, Manipur"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Specific Questions or Focus Area:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Asking about job promotion, marriage timing, or health..."
                  value={yengbaQuestion}
                  onChange={(e) => setYengbaQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Book Jyotish Reading via WhatsApp Button */}
          <button
            type="button"
            onClick={handleYengbaWhatsAppOrder}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Book Jyotish Reading via WhatsApp</span>
          </button>
        </main>
      ) : activeTab === 'account' ? (
        <main className="flex-1 font-sans animate-in fade-in duration-200">
          <InAppAccountView
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateTab={(tab) => {
              setActiveTab(tab as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : activeTab === 'leipung' ? (
        <main className="flex-1 font-sans animate-in fade-in duration-200">
          <LeipungFeedView />
        </main>
      ) : activeTab === 'panchang' ? (
        <main className="flex-1 p-3.5 space-y-3.5 font-sans animate-in fade-in duration-200">
          <ManipuriPanchangWorkstation
            isEmbedded={true}
            theme="light"
            onClose={() => setActiveTab('home')}
          />
        </main>
      ) : activeTab === 'useful' ? (
        <main className="flex-1 p-3.5 space-y-3 font-sans animate-in fade-in duration-200">
          {selectedUsefulTopicId ? (
            /* ── A. Detail Reader Inside App ── */
            (() => {
              const activeTopic = usefulTopics.find((t) => t.id === selectedUsefulTopicId);
              if (!activeTopic) {
                return (
                  <div className="bg-white rounded-2xl p-6 text-center text-xs space-y-3 border border-gray-200">
                    <p className="font-bold text-gray-800">Article topic not found</p>
                    <button
                      type="button"
                      onClick={() => setSelectedUsefulTopicId(null)}
                      className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs"
                    >
                      Back to All Guides
                    </button>
                  </div>
                );
              }
              return (
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4">
                  {/* Top Bar inside reader */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <button
                      type="button"
                      onClick={() => setSelectedUsefulTopicId(null)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Guides</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.share) {
                          navigator.share({
                            title: activeTopic.title,
                            text: activeTopic.summary,
                            url: window.location.origin + '/app/useful/' + activeTopic.id,
                          });
                        } else if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(window.location.origin + '/app/useful/' + activeTopic.id);
                          alert('Article link copied to clipboard!');
                        }
                      }}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                      title="Share guide"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Meta row & Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded border border-amber-200">
                        {activeTopic.category}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(activeTopic.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
                      {activeTopic.title}
                    </h2>
                  </div>

                  {/* HTML Content Body */}
                  <div
                    className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed text-[13.5px] border-t border-gray-100 pt-3"
                    dangerouslySetInnerHTML={{ __html: activeTopic.content_html }}
                  />
                </div>
              );
            })()
          ) : (
            /* ── B. Useful Topics List Screen ── */
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search rituals, panchang rules..."
                  value={usefulSearchQuery}
                  onChange={(e) => setUsefulSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                {['All', 'Rituals', 'Panchang Tips', 'Muhurtas', 'Festivals', 'Astrology', 'Guides'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setUsefulCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                      usefulCategoryFilter === cat
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Topics Card List */}
              <div className="space-y-2.5">
                {usefulTopics
                  .filter((t) => {
                    const matchSearch =
                      t.title.toLowerCase().includes(usefulSearchQuery.toLowerCase()) ||
                      t.summary.toLowerCase().includes(usefulSearchQuery.toLowerCase()) ||
                      t.category.toLowerCase().includes(usefulSearchQuery.toLowerCase());
                    const matchCat =
                      usefulCategoryFilter === 'All' ||
                      t.category.toLowerCase() === usefulCategoryFilter.toLowerCase();
                    return matchSearch && matchCat;
                  })
                  .map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        setSelectedUsefulTopicId(topic.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-left bg-white border border-[#E5E7EB] rounded-xl p-3.5 block hover:border-amber-300 active:scale-[0.99] transition shadow-xs space-y-1.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded border border-amber-200/60">
                          {topic.category}
                        </span>
                        <span className="text-[10px] text-[#6B7280] font-mono">
                          {new Date(topic.updated_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="text-[#111827] font-bold text-[15px] leading-snug">
                        {topic.title}
                      </h3>

                      <p className="text-[#4B5563] text-[13px] line-clamp-2 leading-relaxed">
                        {topic.summary || 'Tap to read the complete ritual instructions and guidelines.'}
                      </p>

                      <div className="pt-1 flex items-center justify-end text-[11px] font-bold text-amber-700 gap-0.5">
                        <span>Read Guide</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </main>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* 5. MAIN HOME APP BODY (When activeTab === 'home')             */
        /* ───────────────────────────────────────────────────────────── */
        <main className="flex-1 p-3.5 space-y-3.5">
          
          {/* Top Advertisement Banner (Controlled via /admin/app-control) */}
          {!adDismissed && appSettings?.ads?.global_enabled !== false && (
            (() => {
              const customAd = appSettings?.ads?.custom_top_banner;
              const mode = appSettings?.ads?.top_banner_mode || 'custom';
              const isCustomEnabled = customAd?.enabled !== false && mode !== 'admob' && mode !== 'none';
              const isAdmobEnabled = appSettings?.ads?.top_banner?.enabled && (mode === 'admob' || (mode === 'both' && !isCustomEnabled));

              if (!isCustomEnabled && !isAdmobEnabled) return null;

              if (isCustomEnabled && customAd) {
                if (customAd.format === 'image_banner' && customAd.image_url) {
                  return (
                    <div className="relative rounded-2xl overflow-hidden shadow-xs border border-amber-600/30">
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-1.5 py-0.5 rounded bg-black/75 text-amber-300 text-[8px] uppercase tracking-wider font-mono font-bold">
                          {customAd.badge_text || 'SPONSORED'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdDismissed(true)}
                        className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px] cursor-pointer"
                        title="Dismiss banner"
                      >
                        ✕
                      </button>
                      <Link
                        href={customAd.cta_link || '/shop'}
                        target={customAd.open_in_new_tab ? '_blank' : '_self'}
                        className="block w-full"
                      >
                        <img
                          src={customAd.image_url}
                          alt={customAd.title || 'Sponsored Banner'}
                          className="w-full h-24 sm:h-28 object-cover"
                        />
                      </Link>
                    </div>
                  );
                }

                if (customAd.format === 'html_embed' && customAd.html_code) {
                  return (
                    <div className="relative rounded-2xl bg-white border border-gray-200 p-2 overflow-hidden shadow-xs">
                      <div className="flex items-center justify-between text-[9px] text-gray-400 mb-1">
                        <span className="font-mono">{customAd.badge_text || 'SPONSORED'}</span>
                        <button type="button" onClick={() => setAdDismissed(true)} className="cursor-pointer">✕</button>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: customAd.html_code }} />
                    </div>
                  );
                }

                // Default Rich Promo Card Format
                const bgClass = customAd.bg_gradient || 'from-[#211a14] via-[#2f2216] to-[#1a1511]';
                return (
                  <div className={`relative rounded-2xl bg-gradient-to-r ${bgClass} border border-amber-600/30 p-2.5 text-amber-100 shadow-sm overflow-hidden`}>
                    <div className="flex items-center justify-between text-[9px] font-bold text-amber-400 mb-1">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded-xs bg-amber-500/20 border border-amber-500/40 text-[8px] uppercase tracking-wider font-mono font-bold">
                          {customAd.badge_text || 'Ad'}
                        </span>
                        <span className="text-amber-300/80 text-[10px] font-serif">
                          {customAd.title ? 'Sponsored Feature' : 'Google AdMob • Sponsored'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdDismissed(true)}
                        className="text-amber-300/60 hover:text-amber-200 text-xs px-1 cursor-pointer"
                        title="Dismiss ad preview"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2.5">
                      {customAd.image_url && (
                        <img
                          src={customAd.image_url}
                          alt="Ad thumbnail"
                          className="w-11 h-11 rounded-xl object-cover border border-amber-500/30 shrink-0 hidden sm:block"
                        />
                      )}
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <p className="text-xs font-bold text-white font-serif leading-tight truncate">
                          {customAd.title || 'Authentic Manipuri Kuthi & Rudraksha'}
                        </p>
                        <p className="text-[10px] text-amber-200/80 leading-tight line-clamp-2">
                          {customAd.subtitle || '100% Energized Puja items & Personalized Janma Patrika'}
                        </p>
                      </div>
                      <Link
                        href={customAd.cta_link || '/shop'}
                        target={customAd.open_in_new_tab ? '_blank' : '_self'}
                        className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 text-[11px] font-bold shadow-xs transition"
                      >
                        {customAd.cta_text || 'Shop Now'}
                      </Link>
                    </div>
                  </div>
                );
              }

              // AdMob Fallback Unit
              return (
                <div className="relative rounded-2xl bg-gradient-to-r from-[#18181b] via-[#27272a] to-[#18181b] border border-slate-700 p-2.5 text-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mb-1">
                    <div className="flex items-center gap-1">
                      <span className="px-1.5 py-0.2 rounded-xs bg-slate-700 text-[8px] uppercase tracking-wider font-mono">
                        AdMob
                      </span>
                      <span className="text-[10px]">Google Native Ad</span>
                    </div>
                    <button type="button" onClick={() => setAdDismissed(true)} className="text-slate-400 text-xs px-1 cursor-pointer">✕</button>
                  </div>
                  <div className="p-2 text-center text-xs text-slate-300 font-mono">
                    Native Ad Unit ({appSettings?.ads?.top_banner?.unit_id || 'ca-app-pub-xxx'})
                  </div>
                </div>
              );
            })()
          )}

          {/* TODAY RASHIFALL SECTION */}
          <section className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1e1b18] leading-tight tracking-tight flex items-center gap-1.5">
                    <span>Today Rashifall</span>
                    <span className="text-xs text-amber-600 font-semibold">
                      {scriptMode === 'meetei' ? '(ꯉꯁꯤꯒꯤ ꯔꯥꯁꯤꯐꯜ)' : '(দৈনিক রাশিফল)'}
                    </span>
                  </h2>
                  <span className="text-xs text-gray-500 font-medium block leading-tight">
                    Daily Horoscope ({now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>{selectedRashi.luckScore}% Luck</span>
              </div>
            </div>

            {/* 12 Rashis Horizontal Carousel */}
            <div className="overflow-x-auto scrollbar-none flex items-center gap-1.5 pb-1 -mx-1 px-1">
              {RASHIS.map((r) => {
                const isSelected = r.id === selectedRashiId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRashiId(r.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-white font-bold shadow-sm scale-[1.02]'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm">{r.symbol}</span>
                    <span>{scriptMode === 'meetei' ? r.nameMeetei : r.nameBengali}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Rashi Detail Card */}
            <div className="rounded-2xl bg-white border border-gray-200 p-3.5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1e1b18] text-sm">
                  {selectedRashi.symbol} {scriptMode === 'meetei' ? selectedRashi.nameMeetei : selectedRashi.nameBengali} ({selectedRashi.nameEn})
                </span>
                <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">
                  Lord: {selectedRashi.lord}
                </span>
              </div>

              {/* Sub-tabs */}
              <div className="flex border-b border-gray-200 text-xs font-medium gap-3 pt-0.5">
                <button
                  type="button"
                  onClick={() => setHoroscopeTab('overview')}
                  className={`pb-1.5 transition border-b-2 cursor-pointer ${
                    horoscopeTab === 'overview'
                      ? 'border-amber-600 text-amber-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-900 font-medium'
                  }`}
                >
                  Overview (মচাং)
                </button>
                <button
                  type="button"
                  onClick={() => setHoroscopeTab('career')}
                  className={`pb-1.5 transition border-b-2 cursor-pointer ${
                    horoscopeTab === 'career'
                      ? 'border-amber-600 text-amber-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-900 font-medium'
                  }`}
                >
                  Career (থবক)
                </button>
                <button
                  type="button"
                  onClick={() => setHoroscopeTab('love')}
                  className={`pb-1.5 transition border-b-2 cursor-pointer ${
                    horoscopeTab === 'love'
                      ? 'border-amber-600 text-amber-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-900 font-medium'
                  }`}
                >
                  Love (নুংশিনবা)
                </button>
                <button
                  type="button"
                  onClick={() => setHoroscopeTab('health')}
                  className={`pb-1.5 transition border-b-2 cursor-pointer ${
                    horoscopeTab === 'health'
                      ? 'border-amber-600 text-amber-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-900 font-medium'
                  }`}
                >
                  Health (হকচাং)
                </button>
              </div>

              {/* Prediction Text in authentic Manipuri language */}
              <div className="min-h-[48px] flex items-center">
                {horoscopeTab === 'overview' && (
                  <p className="text-sm text-gray-700 leading-relaxed font-normal">
                    {scriptMode === 'meetei' ? selectedRashi.summaryMeetei : selectedRashi.summaryBengali}
                  </p>
                )}
                {horoscopeTab === 'career' && (
                  <p className="text-sm text-gray-700 leading-relaxed font-normal flex items-start gap-1.5">
                    <Briefcase className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{scriptMode === 'meetei' ? selectedRashi.careerMeetei : selectedRashi.careerBengali}</span>
                  </p>
                )}
                {horoscopeTab === 'love' && (
                  <p className="text-sm text-gray-700 leading-relaxed font-normal flex items-start gap-1.5">
                    <Heart className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{scriptMode === 'meetei' ? selectedRashi.loveMeetei : selectedRashi.loveBengali}</span>
                  </p>
                )}
                {horoscopeTab === 'health' && (
                  <p className="text-sm text-gray-700 leading-relaxed font-normal flex items-start gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{scriptMode === 'meetei' ? selectedRashi.healthMeetei : selectedRashi.healthBengali}</span>
                  </p>
                )}
              </div>

              {/* Key Luck Stats - Modern Mystic Cards */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-0.5 shadow-xs">
                  <span className="text-gray-500 font-medium block text-xs">Lucky Color</span>
                  <strong className="text-[#1e1b18] font-bold block truncate text-sm">{selectedRashi.luckyColor}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-0.5 shadow-xs">
                  <span className="text-gray-500 font-medium block text-xs">Lucky Number</span>
                  <strong className="text-[#1e1b18] font-bold block text-sm">{selectedRashi.luckyNumber}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-0.5 shadow-xs">
                  <span className="text-gray-500 font-medium block text-xs">Auspicious Time</span>
                  <strong className="text-[#1e1b18] font-bold block truncate text-sm">{selectedRashi.luckyTime}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* TODAY PANCHANG SECTION - HIGH CONTRAST & CLEAR VISIBILITY */}
          <section className="bg-white rounded-2xl border-2 border-slate-300 p-3.5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700">
                  <Sun className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-950 leading-tight">
                    Today Panchang (দৈনিক পঞ্জিকা)
                  </h2>
                  <span className="text-xs text-slate-800 font-bold block leading-tight">
                    Surya Udaya: <span className="font-mono text-slate-950">{panchang.sunMoonTimings.sunrise}</span> • Surya Asta: <span className="font-mono text-slate-950">{panchang.sunMoonTimings.sunset}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Core Panchang Cards - Bold Dark Text for High Readability */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-1">
                <span className="text-xs text-slate-800 font-bold block">
                  থাবান (Tithi):
                </span>
                <strong className="text-[15px] text-slate-950 font-black block truncate">
                  {todayCalendarDay
                    ? (scriptMode === 'meetei' ? todayCalendarDay.tithiDisplayMeetei : todayCalendarDay.tithiDisplayBengali)
                    : panchang.fiveAngas.tithi.name}
                </strong>
                <span className="text-xs text-slate-800 font-semibold block">
                  Ending: {todayCalendarDay?.tithiEndingStandard || '07:44 AM'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-1">
                <span className="text-xs text-slate-800 font-bold block">
                  নক্ষত্র (Nakshatra):
                </span>
                <strong className="text-[15px] text-slate-950 font-black block truncate">
                  {scriptMode === 'meetei'
                    ? `ꯅꯛ:${todayCalendarDay?.nakshatraDisplayNumMeetei || toMeeteiNumerals(panchang.fiveAngas.nakshatra.index)} (${todayCalendarDay?.nakshatraNameMeetei || NAKSHATRA_NAMES_MEETEI[panchang.fiveAngas.nakshatra.index - 1]})`
                    : `নক্ষঃ ${todayCalendarDay?.nakshatraDisplayNumBengali || toBengaliNumerals(panchang.fiveAngas.nakshatra.index)} (${todayCalendarDay?.nakshatraNameBengali || NAKSHATRA_NAMES_BENGALI[panchang.fiveAngas.nakshatra.index - 1]})`}
                </strong>
                <span className="text-xs text-slate-800 font-semibold block">
                  Pada {panchang.fiveAngas.nakshatra.pada} • Lord {panchang.fiveAngas.nakshatra.lord}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-1">
                <span className="text-xs text-slate-800 font-bold block">
                  সৌর তারিখ (Soura Date):
                </span>
                <strong className="text-[15px] text-slate-950 font-black block truncate">
                  {todayCalendarDay
                    ? `${todayCalendarDay.solarMonth.bengali} ${toBengaliNumerals(todayCalendarDay.souraDate)}, শকাব্দ ${toBengaliNumerals(todayCalendarDay.sakaYear)}`
                    : `ভাদ্র ২৮, শকাব্দ ১৯৪৮`}
                </strong>
                <span className="text-xs text-slate-800 font-semibold block">
                  Ritu: {panchang.planetaryState.ritu}
                </span>
              </div>

              {/* Rahu Kaal - High Visibility Alert Box */}
              <div className="p-2.5 rounded-xl bg-rose-50 border-2 border-rose-300 space-y-1">
                <span className="text-xs text-rose-950 font-black block">
                  রাহু কাল (Rahu Kaal):
                </span>
                <strong className="text-[15px] text-rose-950 font-mono font-black block">
                  {panchang.muhurtas.rahuKaal.start} – {panchang.muhurtas.rahuKaal.end}
                </strong>
                <span className="text-xs text-rose-900 font-bold block">
                  Avoid auspicious works
                </span>
              </div>
            </div>

            {/* Expandable Additional Panchang Details */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowMorePanchang(!showMorePanchang)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-950 text-xs font-bold flex items-center justify-between border border-slate-300 transition cursor-pointer"
              >
                <span>{showMorePanchang ? 'Hide Additional Panchang Details' : 'View Yoga, Karana, Abhijit & Muhurtas'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-950 transition-transform ${showMorePanchang ? 'rotate-180' : ''}`} />
              </button>

              {showMorePanchang && (
                <div className="mt-2 p-3 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-300">
                      <span className="text-slate-700 font-bold block text-xs">যোগ (Yoga):</span>
                      <strong className="text-slate-950 font-black block">{panchang.fiveAngas.yoga.name}</strong>
                      <span className="text-slate-800 text-[11px] font-semibold">{panchang.fiveAngas.yoga.isAuspicious ? 'শুভ যোগ (Auspicious)' : 'সাধারণ যোগ'}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-300">
                      <span className="text-slate-700 font-bold block text-xs">করণ (Karana):</span>
                      <strong className="text-slate-950 font-black block">{panchang.fiveAngas.karana.name}</strong>
                      <span className="text-slate-800 text-[11px] font-semibold">Type: {panchang.fiveAngas.karana.type}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-300">
                      <span className="text-emerald-950 font-black block text-xs">অভিজিৎ মুহূর্ত (Abhijit):</span>
                      <strong className="text-emerald-950 font-black block">{panchang.muhurtas.abhijit.start} – {panchang.muhurtas.abhijit.end}</strong>
                      <span className="text-emerald-900 text-[11px] font-bold">Best for good works</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-300">
                      <span className="text-slate-700 font-bold block text-xs">চন্দ্র রাশি (Moon Sign):</span>
                      <strong className="text-slate-950 font-black block">{panchang.planetaryState.moonSign}</strong>
                      <span className="text-slate-800 text-[11px] font-semibold">Sun Sign: {panchang.planetaryState.sunSign}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50 border-2 border-rose-300">
                      <span className="text-rose-950 font-black block text-xs">যমগণ্ড কাল (Yamaganda):</span>
                      <strong className="text-rose-950 font-mono font-black block">{panchang.muhurtas.yamaganda.start} – {panchang.muhurtas.yamaganda.end}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50 border-2 border-rose-300">
                      <span className="text-rose-950 font-black block text-xs">গুলিক কাল (Gulika):</span>
                      <strong className="text-rose-950 font-mono font-black block">{panchang.muhurtas.gulikaKaal.start} – {panchang.muhurtas.gulikaKaal.end}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-950 font-bold">
                    <span>Day Length: {panchang.sunMoonTimings.dayLength}</span>
                    <span>Ayana: {panchang.planetaryState.ayana}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: 3X8 Book Table & Full Workstation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('panchang');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs text-center shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>3X8 Book Table & Full Panchang</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('calendar');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs text-center shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Monthly Calendar</span>
                <ChevronRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </section>

          {/* "CLICK TO SEE CALENDAR" ACTION BANNER */}
          <section className="bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-2xl p-4 text-white shadow-md space-y-3 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10 text-white select-none pointer-events-none">
              <CalendarIcon className="w-32 h-32" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider font-mono block">
                  {currentCalendarData.monthNameEn} {calYear}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
                  {scriptMode === 'meetei'
                    ? `${todayCalendarDay?.manipuriMonth.nameMeetei || 'ꯊꯋꯥꯟ'} ꯒꯤ ${toMeeteiNumerals(todayCalendarDay?.tithiNumber || 4)} ꯅꯤ ꯄꯥꯟꯕꯥ`
                    : `${todayCalendarDay?.manipuriMonth.nameBengali || 'থৱান'} গী ${toBengaliNumerals(todayCalendarDay?.tithiNumber || 4)} নি পানবা`}
                </h3>
                <div className="text-xs font-medium text-amber-200 leading-tight">
                  {scriptMode === 'meetei'
                    ? `${todayCalendarDay?.weekdayName.meetei || 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ'} ꯅꯨꯃꯤꯠ`
                    : `${todayCalendarDay?.weekdayName.bengali === 'মঙ্গলবার' ? 'লৈপাকপোকপা' : (todayCalendarDay?.weekdayName.bengali || 'লৈপাকপোকপা')} নুমিৎ`}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('calendar');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#1e1b18] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
              >
                <span>Open Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Embedded interactive snapshot box */}
            <div className="relative z-10 bg-black/20 rounded-xl p-3 border border-white/15 backdrop-blur-xs space-y-2">
              <div className="text-xs font-medium text-amber-100 flex items-center justify-between">
                <span>Today: {todayCalendarDay?.tithiDisplayBengali}</span>
                <span className="font-mono text-amber-200 font-bold">
                  {scriptMode === 'meetei'
                    ? `ꯅꯛ:${todayCalendarDay?.nakshatraDisplayNumMeetei}`
                    : `নক্ষঃ${todayCalendarDay?.nakshatraDisplayNumBengali}`}
                </span>
              </div>

              {/* Switch to native in-app calendar section */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('calendar');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs active:scale-98 cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Click to view Full Manipuri Monthly Calendar →</span>
              </button>
            </div>
          </section>

          {/* QUICK ASTROLOGICAL TOOLS */}
          <section className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('kuthi_eba');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition shadow-sm flex items-center gap-3 active:scale-98 text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs font-bold text-[#1e1b18] block leading-tight">
                  Kuthi Eba
                </strong>
                <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                  Janma Patrika
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('kuthi_yengba');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition shadow-sm flex items-center gap-3 active:scale-98 text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs font-bold text-[#1e1b18] block leading-tight">
                  Kuthi Yengba
                </strong>
                <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                  Chart Analysis
                </span>
              </div>
            </button>
          </section>
        </main>
      )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. NATIVE PINNED BOTTOM NAVIGATION BAR */}
      <nav 
        className="flex-shrink-0 z-40 w-full max-w-md mx-auto bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-800/80 safe-bottom-nav pt-2 px-3 flex items-center justify-around shadow-mobile-nav select-none-mobile text-slate-400"
        aria-label="Bottom Navigation"
      >
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-1 min-w-[54px] min-h-[48px] py-1 px-2 rounded-2xl app-active-press transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`px-3 py-1 rounded-full transition-all duration-200 ${activeTab === 'home' ? 'bg-amber-500/20 text-amber-400 scale-105 shadow-xs' : 'text-slate-400'}`}>
            <Sun className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Tab 2: Calendar */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('calendar');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-1 min-w-[54px] min-h-[48px] py-1 px-2 rounded-2xl app-active-press transition-all cursor-pointer ${
            activeTab === 'calendar' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`px-3 py-1 rounded-full transition-all duration-200 ${activeTab === 'calendar' ? 'bg-amber-500/20 text-amber-400 scale-105 shadow-xs' : 'text-slate-400'}`}>
            <CalendarIcon className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Calendar</span>
        </button>

        {/* Tab 3: Leipung */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('leipung');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-1 min-w-[54px] min-h-[48px] py-1 px-2 rounded-2xl app-active-press transition-all cursor-pointer ${
            activeTab === 'leipung' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`px-3 py-1 rounded-full transition-all duration-200 ${activeTab === 'leipung' ? 'bg-amber-500/20 text-amber-400 scale-105 shadow-xs' : 'text-slate-400'}`}>
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Leipung</span>
        </button>

        {/* Tab 4: Panchang */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('panchang');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-1 min-w-[54px] min-h-[48px] py-1 px-2 rounded-2xl app-active-press transition-all cursor-pointer ${
            activeTab === 'panchang' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`px-3 py-1 rounded-full transition-all duration-200 ${activeTab === 'panchang' ? 'bg-amber-500/20 text-amber-400 scale-105 shadow-xs' : 'text-slate-400'}`}>
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Panchang</span>
        </button>

        {/* Tab 5: Useful */}
        {appSettings?.features?.show_useful_tab !== false && (
          <button
            type="button"
            onClick={() => {
              setActiveTab('useful');
              setSelectedUsefulTopicId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center gap-1 min-w-[54px] min-h-[48px] py-1 px-2 rounded-2xl app-active-press transition-all cursor-pointer ${
              activeTab === 'useful' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`px-3 py-1 rounded-full transition-all duration-200 ${activeTab === 'useful' ? 'bg-amber-500/20 text-amber-400 scale-105 shadow-xs' : 'text-slate-400'}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Useful</span>
          </button>
        )}
      </nav>

    </div>
  );
}
