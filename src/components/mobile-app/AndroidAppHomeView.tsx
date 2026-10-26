'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  MessageSquare,
  WifiOff,
  Plus,
  Tag,
  ThumbsUp
} from 'lucide-react';
import { calculateVedicPanchang } from '@/engine/panchang';
import { getMonthlyCalendar, CalendarDay, toBengaliNumerals, toMeeteiNumerals } from '@/engine/manipuriCalendar';
import { NAKSHATRA_NAMES_BENGALI, NAKSHATRA_NAMES_MEETEI } from '@/engine/constants';
import { WEEKDAYS_MANIPURI, MANIPURI_MONTH_ATTRIBUTES } from '@/data/manipuriMonthAttributes';
import ManipuriPanchangWorkstation from '@/components/dashboard/ManipuriPanchangWorkstation';
import LeipungFeedView from '@/components/mobile-app/LeipungFeedView';
import AppSplashScreen from '@/components/mobile-app/AppSplashScreen';
import InAppAccountView from '@/components/mobile-app/InAppAccountView';
import ManipuriAdMobBanner from '@/components/mobile-app/ManipuriAdMobBanner';
import { DEFAULT_USEFUL_TOPICS } from '@/data/defaultUsefulTopics';
import { SEED_UPCOMING_EVENTS, UpcomingEvent } from '@/data/seedEvents';
import { SEED_LEIPUNG_POSTS, LeipungPostItem } from '@/data/seedLeipungPosts';

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

  // Scroll Container Ref to ensure page opens from top when switching tabs
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab]);

  // Dynamic Useful Topics & App Control State (Pre-seeded with offline-ready default topics)
  const [usefulTopics, setUsefulTopics] = useState<any[]>(DEFAULT_USEFUL_TOPICS);
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

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [calendarPerspective, setCalendarPerspective] = useState<'cheichat' | 'gregorian'>('cheichat');

  // Network Online / Offline Detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(window.navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Fetch Useful Topics and App Settings (Works online & offline)
  useEffect(() => {
    const getEndpointUrl = (path: string) => {
      if (typeof window !== 'undefined') {
        const origin = window.location.origin;
        if (origin.includes('localhost') || origin.startsWith('file:') || origin.startsWith('capacitor:')) {
          return `https://kuthiyengpham.in${path}`;
        }
      }
      return path;
    };

    fetch(getEndpointUrl('/api/useful'))
      .then((r) => r.json())
      .then((d) => {
        if (d && d.topics && d.topics.length > 0) setUsefulTopics(d.topics);
      })
      .catch((e) => console.log('Offline/Network notice: using local useful topics.'));

    fetch(getEndpointUrl('/api/app-settings'))
      .then((r) => r.json())
      .then((d) => {
        if (d && d.settings) setAppSettings(d.settings);
      })
      .catch((e) => console.log('Offline/Network notice: using local app settings.'));

    fetch(getEndpointUrl('/api/events'))
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success && Array.isArray(d.events) && d.events.length > 0) {
          setUpcomingEvents(d.events);
        }
      })
      .catch((e) => console.log('Offline/Network notice: using local upcoming events.'));

    fetch(getEndpointUrl('/api/leipung/posts?filter=trending'))
      .then((r) => r.json())
      .then((d) => {
        if (d && d.success && Array.isArray(d.posts) && d.posts.length > 0) {
          setCommunityPosts(d.posts.slice(0, 3));
        }
      })
      .catch((e) => console.log('Offline/Network notice: using local community posts.'));
  }, []);

  // Upcoming Cultural Events State (Pre-seeded for full offline capability)
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>(
    SEED_UPCOMING_EVENTS.filter((e) => e.status === 'approved')
  );
  const [showSubmitEventModal, setShowSubmitEventModal] = useState<boolean>(false);
  const [userEventSubmitSuccess, setUserEventSubmitSuccess] = useState<boolean>(false);
  const [submittingUserEvent, setSubmittingUserEvent] = useState<boolean>(false);
  const [userEventForm, setUserEventForm] = useState({
    title: '',
    dateStr: '',
    endDateStr: '',
    timeStr: 'All Day',
    venue: '',
    category: 'thabal',
    description: '',
    organizer: '',
    submitterName: '',
    submitterContact: '',
  });

  const handleSubmitUserEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEventForm.title.trim() || !userEventForm.dateStr.trim() || !userEventForm.venue.trim()) {
      alert('Please fill in Event Title, Date, and Venue.');
      return;
    }
    setSubmittingUserEvent(true);
    try {
      const getEndpointUrl = (path: string) => {
        if (typeof window !== 'undefined') {
          const origin = window.location.origin;
          if (origin.includes('localhost') || origin.startsWith('file:') || origin.startsWith('capacitor:')) {
            return `https://kuthiyengpham.in${path}`;
          }
        }
        return path;
      };

      const res = await fetch(getEndpointUrl('/api/events'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn: userEventForm.title.trim(),
          dateStr: userEventForm.dateStr,
          endDateStr: userEventForm.endDateStr || userEventForm.dateStr,
          timeStr: userEventForm.timeStr || 'All Day',
          venue: userEventForm.venue.trim(),
          category: userEventForm.category,
          description: userEventForm.description.trim(),
          organizer: userEventForm.organizer.trim(),
          submitterName: userEventForm.submitterName.trim(),
          submitterContact: userEventForm.submitterContact.trim(),
        }),
      });
      const data = await res.json();
      if (data && data.success) {
        setUserEventSubmitSuccess(true);
      } else {
        alert(data.error || 'Failed to submit event');
      }
    } catch (err) {
      console.error('Submit event error:', err);
      // Fallback optimistic success for offline users
      setUserEventSubmitSuccess(true);
    } finally {
      setSubmittingUserEvent(false);
    }
  };

  // Example Community Posts State (For Homepage Community Buzz Preview)
  const [communityPosts, setCommunityPosts] = useState<LeipungPostItem[]>(
    SEED_LEIPUNG_POSTS.slice(0, 3)
  );
  const [likedCommunityPostIds, setLikedCommunityPostIds] = useState<Record<string, boolean>>({});

  const handleToggleCommunityLike = (postId: string) => {
    setLikedCommunityPostIds((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

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
      `*New Sacred Kuthi Eba Order (Manipuri Calendar App)*\n\n` +
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
      `*Kuthi Yengba Consultation Request (Manipuri Calendar App)*\n\n` +
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

  // Dynamic Home Selected Date (When clicked in the 7-day strip, updates panchang details without redirecting)
  const [homeSelectedDateStr, setHomeSelectedDateStr] = useState<string>(todayStr);

  const homePanchang = useMemo(() => {
    return calculateVedicPanchang(homeSelectedDateStr || todayStr);
  }, [homeSelectedDateStr, todayStr]);

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

  // Dynamic Calendar Day for Home View
  const homeCalendarDay = useMemo(() => {
    const targetStr = homeSelectedDateStr || todayStr;
    for (const week of monthlyData.weeks) {
      for (const day of week) {
        if (day && day.dateStr === targetStr) {
          return day;
        }
      }
    }
    const parts = targetStr.split('-').map(Number);
    if (parts.length === 3) {
      const mData = getMonthlyCalendar(parts[0], parts[1]);
      for (const week of mData.weeks) {
        for (const day of week) {
          if (day && day.dateStr === targetStr) return day;
        }
      }
    }
    return todayCalendarDay;
  }, [homeSelectedDateStr, todayStr, monthlyData, todayCalendarDay]);

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
                <div className="flex items-center gap-1.5">
                  <h1 className="text-[15px] font-sans font-bold tracking-tight leading-none text-slate-50">
                    {activeTab === 'home'
                      ? 'Manipuri Calendar'
                      : activeTab === 'calendar'
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
                      : 'Manipuri Calendar'}
                  </h1>
                  {activeTab === 'home' && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#c84b31]/40 border border-[#c84b31]/60 text-amber-200 font-mono text-[9px] font-bold">
                      MEITEI
                    </span>
                  )}
                  {!isOnline && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-[8px] font-bold flex items-center gap-0.5">
                      <WifiOff className="w-2.5 h-2.5" />
                      <span>OFFLINE</span>
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-amber-400/90 font-medium leading-none block mt-1">
                  {activeTab === 'home'
                    ? (scriptMode === 'meetei' ? 'ꯃꯅꯤꯄꯨꯔꯤ ꯀꯦꯂꯦꯟꯗꯔ • Imphal (IST)' : 'মণিপুরী ক্যালেন্ডার • Imphal (IST)')
                    : activeTab === 'calendar'
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
              <h2 className="text-base font-serif font-black text-amber-100">Manipuri Calendar</h2>
              <p className="text-xs text-amber-300/80 font-serif">
                {scriptMode === 'meetei' ? 'ꯃꯅꯤꯄꯨꯔꯤ ꯀꯦꯂꯦꯟꯗꯔ ꯑꯃꯁꯨꯡ ꯄꯥꯟꯆꯥꯡ' : 'মণিপুরী ক্যালেন্ডার ও পঞ্জিকা'}
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
                      title: 'Manipuri Calendar',
                      text: appSettings?.side_menu?.share_message || 'Explore Manipuri Calendar, Panchang & Janma Patrika on Manipuri Calendar',
                      url: appSettings?.side_menu?.share_url || window.location.origin,
                    };
                    if (typeof navigator !== 'undefined' && navigator.share) {
                      navigator.share(shareData);
                    } else if (typeof navigator !== 'undefined') {
                      navigator.clipboard.writeText(shareData.url);
                      alert('Manipuri Calendar App link copied to clipboard!');
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
                {appSettings?.side_menu?.bottom_branding_text || 'Manipuri Calendar by KangleiAstro'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SCROLLABLE MIDDLE WORKSPACE CONTAINER                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overscroll-contain">
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

          {/* Dual Calendar Perspective Switcher (Stitch Kanglei Sacred Rhythm) */}
          <div className="grid grid-cols-2 p-1 bg-white rounded-2xl border border-gray-200 shadow-xs">
            <button
              type="button"
              onClick={() => setCalendarPerspective('cheichat')}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                calendarPerspective === 'cheichat'
                  ? 'bg-[#c84b31] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Cheichat View (ꯆꯩꯆꯠ)</span>
            </button>
            <button
              type="button"
              onClick={() => setCalendarPerspective('gregorian')}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                calendarPerspective === 'gregorian'
                  ? 'bg-[#c84b31] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Gregorian View</span>
            </button>
          </div>

          {/* Key Sacred Events Carousel: Thaban Thasi Highlights (Stitch Design) */}
          <section className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c84b31]"></span>
                <span>Thaban Thasi Highlights (ꯊꯥꯁꯤ ꯄꯨꯡꯐꯝ)</span>
              </span>
              <span className="text-[10px] text-amber-700 font-bold font-mono">
                {currentCalendarData.monthNameEn}
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {(() => {
                const highlights = (currentCalendarData.weeks.flat().filter(Boolean) as CalendarDay[])
                  .filter((d) => d.isPurnima || d.isAmavasya || d.festival || d.isEkadashi)
                  .slice(0, 5);

                if (highlights.length === 0) return null;

                return highlights.map((hd) => {
                  const isSelected = hd.dateStr === calSelectedDateStr;
                  return (
                    <button
                      key={`hl-${hd.dateStr}`}
                      type="button"
                      onClick={() => setCalSelectedDateStr(hd.dateStr)}
                      className={`flex-shrink-0 w-36 p-2.5 rounded-2xl bg-white border text-left transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#c84b31] ring-2 ring-[#c84b31]/40 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          hd.isPurnima
                            ? 'bg-purple-100 text-purple-800'
                            : hd.isAmavasya
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {hd.isPurnima ? 'ꯄꯨꯔꯅꯤꯃꯥ' : hd.isAmavasya ? 'ꯊꯥ-ꯑꯁꯤ' : 'ꯊꯧꯔꯝ'}
                        </span>
                        <Moon className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div className="mt-1.5">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {hd.festival ? (scriptMode === 'meetei' ? hd.festival.nameMeetei : hd.festival.nameBengali) : (scriptMode === 'meetei' ? hd.tithiDisplayMeetei : hd.tithiDisplayBengali)}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {hd.manipuriMonth.nameEn} {hd.tithiNumber} • {hd.day} {currentCalendarData.monthNameEn.slice(0, 3)}
                        </p>
                      </div>
                    </button>
                  );
                });
              })()}
            </div>
          </section>

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
                const isGeneralHoliday = day.isGeneralHoliday || !!(day.festival && day.festival.isGeneralHoliday);
                const isHoliday = isSunday || isGeneralHoliday;

                const monthName = scriptMode === 'meetei' ? day.manipuriMonth.nameMeetei : day.manipuriMonth.nameBengali;
                const tithiStr = scriptMode === 'meetei'
                  ? (day.isDualTithi ? `${toMeeteiNumerals(day.tithiNumber)}, ${toMeeteiNumerals(day.tithiNumber + 1)}` : toMeeteiNumerals(day.tithiNumber))
                  : (day.isDualTithi ? `${toBengaliNumerals(day.tithiNumber)}, ${toBengaliNumerals(day.tithiNumber + 1)}` : toBengaliNumerals(day.tithiNumber));

                const nakshatraNum = scriptMode === 'meetei'
                  ? day.nakshatraDisplayNumMeetei
                  : day.nakshatraDisplayNumBengali;

                const hasEvent = !!(day.festival || day.isGeneralHoliday || day.isPurnima || day.isAmavasya || day.isEkadashi);
                const isHolidayOrPurnima = !!(isHoliday || day.isPurnima);

                return (
                  <button
                    key={day.dateStr}
                    type="button"
                    onClick={() => setCalSelectedDateStr(day.dateStr)}
                    className={`relative min-h-[76px] p-[4px_2px] flex flex-col items-center justify-center text-center rounded-[10px] transition-all cursor-pointer select-none border ${
                      isSelected
                        ? 'bg-[#FFFBEB] ring-2 ring-[#D97706] border-[#D97706] z-10'
                        : isToday
                        ? 'bg-[#FFFBEB] ring-2 ring-[#D97706] border-[#D97706] z-10'
                        : isHoliday
                        ? 'bg-[#FFF5F5] border-red-200/90 hover:bg-[#FEE2E2]/70'
                        : 'bg-white border-[#F1F5F9] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {/* 1. Top-Left Corner — Nakshatra Number ONLY */}
                    <span
                      className={`absolute top-1 left-1.5 text-[10px] font-semibold leading-none ${
                        isToday ? 'text-[#B45309]' : isHoliday ? 'text-red-400' : 'text-slate-400'
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

                    {/* 3. Center — Prominent Centered Date & Tithi with Manipuri Day/Month Name */}
                    <div className="flex-1 flex flex-col items-center justify-center my-auto py-0.5 w-full text-center">
                      <span
                        className={`text-xl sm:text-2xl font-black tracking-tight leading-none font-sans text-center ${
                          isHoliday
                            ? 'text-[#DC2626]'
                            : isToday
                            ? 'text-[#c84b31]'
                            : 'text-[#1e1b18]'
                        }`}
                      >
                        {day.day}
                      </span>
                      <span
                        className={`text-[9.5px] sm:text-[10px] font-bold leading-tight mt-1 text-center truncate max-w-[96%] block ${
                          isHoliday
                            ? 'text-[#DC2626]'
                            : isToday
                            ? 'text-[#a6331b]'
                            : 'text-[#895200]'
                        }`}
                      >
                        {monthName} {tithiStr}
                      </span>
                    </div>

                    {/* 6. Mention Result / Festival Name Directly inside Cell */}
                    {day.festival ? (
                      <span
                        className="text-[7.5px] font-bold text-red-700 bg-red-100/95 border border-red-200 px-1 py-0.5 rounded leading-none truncate max-w-[95%] block mt-0.5 shadow-2xs"
                        title={day.festival.nameBengali}
                      >
                        {scriptMode === 'meetei' ? day.festival.nameMeetei : day.festival.nameBengali}
                      </span>
                    ) : isSunday ? (
                      <span className="text-[7.5px] font-semibold text-red-500 leading-none truncate max-w-[95%] block mt-0.5">
                        {scriptMode === 'meetei' ? 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ' : 'রবিবার'}
                      </span>
                    ) : day.isPurnima ? (
                      <span className="text-[7.5px] font-bold text-purple-700 bg-purple-100/90 px-1 py-0.5 rounded leading-none truncate max-w-[95%] block mt-0.5">
                        {scriptMode === 'meetei' ? 'ꯄꯨꯔꯅꯤꯃꯥ' : 'পূর্ণিমা'}
                      </span>
                    ) : day.isAmavasya ? (
                      <span className="text-[7.5px] font-bold text-gray-800 bg-gray-200/90 px-1 py-0.5 rounded leading-none truncate max-w-[95%] block mt-0.5">
                        {scriptMode === 'meetei' ? 'ꯊꯥꯁꯤ' : 'থাশী'}
                      </span>
                    ) : day.isEkadashi ? (
                      <span className="text-[7.5px] font-bold text-amber-800 bg-amber-100/90 px-1 py-0.5 rounded leading-none truncate max-w-[95%] block mt-0.5">
                        {scriptMode === 'meetei' ? 'ꯑꯦꯀꯥꯗꯁꯤ' : 'একাদশী'}
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

          {/* Active Selected Day Full Details & Result Card */}
          {activeCalendarDay && (() => {
            const isActiveDaySunday = activeCalendarDay.weekday === 0;
            const isActiveDayHoliday = isActiveDaySunday || activeCalendarDay.isGeneralHoliday || !!(activeCalendarDay.festival && activeCalendarDay.festival.isGeneralHoliday);

            return (
              <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#1e1b18] leading-tight flex items-center gap-1.5">
                      {activeCalendarDay.dateStr === todayStr && <span>✨</span>}
                      <span>{activeCalendarDay.dateStr}</span>
                      {isActiveDayHoliday && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                          Holiday
                        </span>
                      )}
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

                {/* ── PROMINENT HOLIDAY & DAY RESULT BANNER ── */}
                {isActiveDayHoliday ? (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 border-2 border-red-300 text-red-950 flex items-start gap-3 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
                      <CalendarIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-black uppercase tracking-wider text-white bg-red-600 px-2.5 py-0.5 rounded-full shadow-2xs">
                          🔴 ছুতিগী নুমিৎ (HOLIDAY RESULT)
                        </span>
                        {activeCalendarDay.isGeneralHoliday && (
                          <span className="text-[10px] font-bold text-red-800 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
                            General Holiday of Manipur
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-extrabold text-red-950 mt-1 leading-snug">
                        {activeCalendarDay.festival
                          ? (scriptMode === 'meetei' ? activeCalendarDay.festival.nameMeetei : activeCalendarDay.festival.nameBengali)
                          : isActiveDaySunday
                          ? (scriptMode === 'meetei' ? 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ (Sunday Weekly Holiday)' : 'রবিবার (Sunday — সাপ্তাহিক ছুটি)')
                          : 'ছুতিগী নুমিৎ (Holiday)'}
                      </h4>
                      {activeCalendarDay.festival ? (
                        <p className="text-xs text-red-800 mt-0.5 font-medium">
                          {activeCalendarDay.festival.nameEn} • {activeCalendarDay.festival.category === 'traditional' ? 'Traditional Festival' : activeCalendarDay.festival.category === 'state' ? 'State Holiday' : 'National Holiday'}
                        </p>
                      ) : isActiveDaySunday ? (
                        <p className="text-xs text-red-700 mt-0.5 font-medium">
                          Sunday Weekly Holiday (সাপ্তাহিক ছুটিগী নুমিৎ)
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs font-semibold shadow-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                      <span className="font-bold text-emerald-900">
                        {scriptMode === 'meetei' ? '🟢 ꯊꯕꯛ ꯁꯨꯕ ꯅꯨꯃꯤꯠ (Normal Working Day)' : '🟢 কারবারগী নুমিৎ (Working Day / Normal Day)'}
                      </span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Open
                    </span>
                  </div>
                )}

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

                {/* Tatnaba Numit Alert */}
                {activeCalendarDay.isEeKhudengLeitaba && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>তৎনবা নুমিৎ (ই-খুদেং লৈতাবা • Inauspicious)</span>
                  </div>
                )}
              </div>
            );
          })()}

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

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STITCH "MANIPURI CALENDAR" TOP DATE & LUNAR PHASE HERO BANNER */}
          {/* ───────────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#a6331b] via-[#c84b31] to-[#9e3b2d] p-4 text-white shadow-[0_8px_24px_-6px_rgba(166,51,27,0.35)] select-none">
            {/* Decorative Celestial Radial Glow & Orbit Circles */}
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-25"
              style={{ background: 'radial-gradient(circle, rgba(254,173,77,0.85) 0%, rgba(254,173,77,0) 70%)' }}
            />
            <svg
              className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 opacity-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="42" stroke="#ffdcbc" strokeDasharray="3 3" strokeWidth="1.2" />
              <circle cx="50" cy="50" r="28" stroke="#ffdcbc" strokeWidth="1" />
              <path d="M 50,8 L 50,92 M 8,50 L 92,50" stroke="#ffdcbc" strokeDasharray="2 4" strokeWidth="0.8" />
            </svg>

            <div className="relative z-10 flex flex-col gap-3">
              {/* Date Meta & Manipuri Cheichat Month */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center rounded-full bg-amber-500/25 px-2 py-0.5 font-mono text-[9.5px] font-bold tracking-wider text-amber-200 border border-amber-400/30">
                      {homeCalendarDay?.sakaYear || 1948} SAKABDA
                    </span>
                    <span className="text-amber-200/60">•</span>
                    <span className="text-[11px] font-semibold text-amber-200">
                      Meitei Cheichat
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                    {homeCalendarDay?.manipuriMonth?.nameEn || 'Lamta'}{' '}
                    {scriptMode === 'meetei'
                      ? toMeeteiNumerals(homeCalendarDay?.tithiNumber || 1)
                      : toBengaliNumerals(homeCalendarDay?.tithiNumber || 1)}{' '}
                    <span className="text-base font-normal text-amber-200">
                      / {scriptMode === 'meetei' ? homeCalendarDay?.manipuriMonth?.nameMeetei || 'ꯂꯝꯇꯥ' : homeCalendarDay?.manipuriMonth?.nameBengali || 'লমতা'}
                    </span>
                  </h2>

                  <p className="text-xs text-amber-100/90 font-medium">
                    {(() => {
                      const [y, m, d] = (homeSelectedDateStr || todayStr).split('-').map(Number);
                      const dObj = new Date(y, m - 1, d);
                      return dObj.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                    })()}
                  </p>
                </div>

                {/* Moon Phase Emblem */}
                <div className="flex flex-col items-center justify-center rounded-2xl bg-black/20 backdrop-blur-md p-2.5 text-center min-w-[76px] border border-white/10 shrink-0">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/20 shadow-inner">
                    <svg className="h-7 w-7 text-amber-300" fill="none" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" opacity="0.8" r="45" stroke="#fead4d" strokeDasharray="4 3" strokeWidth="3" />
                      {homeCalendarDay?.isAmavasya ? (
                        <circle cx="50" cy="50" fill="#1e1b18" r="32" />
                      ) : (
                        <>
                          <path d="M 50 14 A 36 36 0 0 0 50 86 A 26 26 0 0 1 50 14 Z" fill="#fff" opacity="0.95" />
                          <circle cx="58" cy="50" fill="#fead4d" r="14" />
                          <circle cx="58" cy="50" fill="#fffbff" r="8" />
                        </>
                      )}
                    </svg>
                  </div>
                  <span className="mt-1 text-[11px] font-bold text-white line-clamp-1">
                    {homeCalendarDay?.isPurnima
                      ? 'Purnima'
                      : homeCalendarDay?.isAmavasya
                      ? 'Amavasya'
                      : homeCalendarDay?.tithiDisplayBengali?.split(' ')[0] || 'Tithi'}
                  </span>
                  <span className="text-[9.5px] font-medium text-amber-200">
                    {homeCalendarDay?.isPurnima
                      ? 'ꯊꯥꯁꯤ ꯄꯨꯔꯅꯤꯃꯥ'
                      : homeCalendarDay?.isAmavasya
                      ? 'ꯊꯥ-ꯑꯁꯤ'
                      : (scriptMode === 'meetei' ? homeCalendarDay?.tithiDisplayMeetei : homeCalendarDay?.tithiDisplayBengali)}
                  </span>
                </div>
              </div>

              {/* Sun Times & Sunrise/Sunset Tracker */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/25 p-2 backdrop-blur-xs border border-white/10">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-300 shrink-0" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] uppercase tracking-wider text-amber-200/80 font-mono">
                      Sunrise (Imphal)
                    </span>
                    <span className="text-xs font-bold font-mono text-white">
                      {homePanchang.sunMoonTimings.sunrise}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-amber-200 shrink-0" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] uppercase tracking-wider text-amber-200/80 font-mono">
                      Sunset (Imphal)
                    </span>
                    <span className="text-xs font-bold font-mono text-white">
                      {homePanchang.sunMoonTimings.sunset}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Auspicious Muhurat Live Pill */}
              <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-1.5 text-white backdrop-blur-xs border border-white/15">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300"></span>
                  </span>
                  <span className="text-[11px] font-medium">
                    Shubha Muhurat: <strong className="text-amber-200">Abhijit Muhurat</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-200">
                  {homePanchang.muhurtas?.abhijit?.start || '11:36 AM'} – {homePanchang.muhurtas?.abhijit?.end || '12:24 PM'}
                </span>
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STITCH "CHEIRAAK / LUNAR DAYS" 7-DAY QUICK STRIP              */}
          {/* (Clicking date updates panchang in-place, NO REDIRECT)        */}
          {/* ───────────────────────────────────────────────────────────── */}
          <section className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#1e1b18]">
                  Cheiraak / Lunar Days
                </span>
                <span className="rounded-full bg-amber-100/80 px-2 py-0.5 text-[9px] font-bold text-amber-800 font-mono uppercase">
                  {homeCalendarDay?.manipuriMonth?.nameEn || 'Month'} {homeCalendarDay?.sakaYear || 1948}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCalSelectedDateStr(homeSelectedDateStr || todayStr);
                  setActiveTab('calendar');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center text-[#c84b31] hover:text-[#a6331b] text-xs font-bold transition cursor-pointer"
              >
                <span>Full Month</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            {/* Scrollable 7-day strip */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {(() => {
                const allDays = currentCalendarData.weeks.flat().filter(Boolean) as CalendarDay[];
                const activeIdx = allDays.findIndex((d) => d.dateStr === (homeSelectedDateStr || todayStr));
                const startIdx = Math.max(0, Math.min(activeIdx >= 0 ? activeIdx - 3 : 0, Math.max(0, allDays.length - 7)));
                const sevenDays = allDays.slice(startIdx, startIdx + 7);

                return sevenDays.map((d) => {
                  const isSelected = d.dateStr === (homeSelectedDateStr || todayStr);
                  const isActualToday = d.dateStr === todayStr;
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => {
                        setHomeSelectedDateStr(d.dateStr);
                      }}
                      className={`relative flex-shrink-0 w-14 py-2 px-1 rounded-xl text-center transition flex flex-col items-center justify-between cursor-pointer border ${
                        isSelected
                          ? 'bg-[#c84b31] border-[#a6331b] text-white shadow-md ring-2 ring-[#fead4d]'
                          : 'bg-[#f9f9fc] border-gray-200 text-gray-700 hover:bg-amber-50/50'
                      }`}
                    >
                      {isActualToday && (
                        <span className={`text-[7.5px] font-bold uppercase rounded-full px-1 leading-tight ${
                          isSelected ? 'bg-[#fead4d] text-[#2c1700]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Today
                        </span>
                      )}
                      <span className={`text-[9.5px] font-bold uppercase ${isSelected ? 'text-amber-200' : 'text-gray-500'}`}>
                        {d.weekdayName.shortEn}
                      </span>
                      <span className="text-base font-bold my-0.5 leading-none">
                        {d.day}
                      </span>
                      <span className={`text-[9px] font-semibold truncate max-w-full ${isSelected ? 'text-amber-100' : 'text-amber-700'}`}>
                        {scriptMode === 'meetei' ? toMeeteiNumerals(d.tithiNumber) : toBengaliNumerals(d.tithiNumber)}
                      </span>
                    </button>
                  );
                });
              })()}
            </div>
          </section>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STITCH QUICK ACTION FEATURE CARDS (2X2 GRID)                  */}
          {/* ───────────────────────────────────────────────────────────── */}
          <section className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('panchang');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 rounded-2xl bg-white p-3 border border-gray-200 shadow-xs active:scale-95 transition-all text-left cursor-pointer hover:border-[#c84b31]/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffdad3] text-[#a6331b]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1a1c1e] leading-tight truncate">Daily Panjika</h4>
                <span className="text-[10px] font-semibold text-[#895200]">
                  {scriptMode === 'meetei' ? 'ꯄꯥꯟꯖꯤꯀꯥ ꯊꯤꯕ' : 'দৈনিক পঞ্জিকা'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('today-rashifall-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 rounded-2xl bg-white p-3 border border-gray-200 shadow-xs active:scale-95 transition-all text-left cursor-pointer hover:border-amber-400/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffdcbc] text-[#895200]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1a1c1e] leading-tight truncate">Rashi Phala</h4>
                <span className="text-[10px] font-semibold text-[#895200]">
                  {scriptMode === 'meetei' ? 'ꯔꯥꯁꯤ ꯐꯜ' : 'রাশিফল'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('daily-cosmic-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 rounded-2xl bg-white p-3 border border-gray-200 shadow-xs active:scale-95 transition-all text-left cursor-pointer hover:border-rose-300"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eeeef0] text-[#9e3b2d]">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1a1c1e] leading-tight truncate">Thouram Matam</h4>
                <span className="text-[10px] font-semibold text-[#895200]">
                  {scriptMode === 'meetei' ? 'ꯊꯧꯔꯝ ꯃꯇꯝ' : 'শুভ মুহূর্ত ও সময়'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('calendar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 rounded-2xl bg-white p-3 border border-gray-200 shadow-xs active:scale-95 transition-all text-left cursor-pointer hover:border-red-300"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffdad6] text-[#a6331b]">
                <Flame className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#1a1c1e] leading-tight truncate">Festivals</h4>
                <span className="text-[10px] font-semibold text-[#895200]">
                  {scriptMode === 'meetei' ? 'ꯃꯩꯇꯩ ꯀꯨꯝꯃꯩ' : 'উৎসব ও ছুটির দিন'}
                </span>
              </div>
            </button>
          </section>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STITCH "DAILY COSMIC ATTRIBUTES" CARD (DYNAMIC TO DATE)      */}
          {/* ───────────────────────────────────────────────────────────── */}
          <section id="daily-cosmic-section" className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#a6331b]" />
                <h3 className="text-sm font-bold text-[#1a1c1e]">Daily Cosmic Attributes</h3>
              </div>
              <span className="rounded-full bg-[#ffdcbc]/70 px-2 py-0.5 text-[9px] font-bold text-[#895200] font-mono">
                IMPHAL GEO (IST)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-[#f9f9fc] p-2.5 border border-gray-100 space-y-0.5">
                <span className="text-[9.5px] uppercase font-bold text-gray-500 block">Tithi (থাবান)</span>
                <p className="font-bold text-sm text-[#1a1c1e] truncate">
                  {homeCalendarDay
                    ? (scriptMode === 'meetei' ? homeCalendarDay.tithiDisplayMeetei : homeCalendarDay.tithiDisplayBengali)
                    : homePanchang.fiveAngas.tithi.name}
                </p>
                <span className="text-[10px] text-[#a6331b] font-medium block truncate">
                  Ends: {homeCalendarDay?.tithiEndingStandard || '07:44 AM'}
                </span>
              </div>

              <div className="rounded-xl bg-[#f9f9fc] p-2.5 border border-gray-100 space-y-0.5">
                <span className="text-[9.5px] uppercase font-bold text-gray-500 block">Nakshatra (নক্ষত্র)</span>
                <p className="font-bold text-sm text-[#1a1c1e] truncate">
                  {scriptMode === 'meetei'
                    ? (homeCalendarDay?.nakshatraNameMeetei || NAKSHATRA_NAMES_MEETEI[homePanchang.fiveAngas.nakshatra.index - 1])
                    : (homeCalendarDay?.nakshatraNameBengali || NAKSHATRA_NAMES_BENGALI[homePanchang.fiveAngas.nakshatra.index - 1])}
                </p>
                <span className="text-[10px] text-[#895200] font-medium block">
                  Pada {homePanchang.fiveAngas.nakshatra.pada} • Lord {homePanchang.fiveAngas.nakshatra.lord}
                </span>
              </div>

              <div className="rounded-xl bg-[#f9f9fc] p-2.5 border border-gray-100 space-y-0.5">
                <span className="text-[9.5px] uppercase font-bold text-gray-500 block">Yoga & Karana</span>
                <p className="font-bold text-sm text-[#1a1c1e] truncate">
                  {homePanchang.fiveAngas.yoga.name} • {homePanchang.fiveAngas.karana.name}
                </p>
                <span className="text-[10px] text-gray-500 font-medium block">
                  {homePanchang.fiveAngas.yoga.isAuspicious ? 'Auspicious balance' : 'Standard balance'}
                </span>
              </div>

              <div className="rounded-xl bg-[#f9f9fc] p-2.5 border border-gray-100 space-y-0.5">
                <span className="text-[9.5px] uppercase font-bold text-gray-500 block">Paksha (পক্ষ)</span>
                <p className="font-bold text-sm text-[#1a1c1e] truncate">
                  {homePanchang.fiveAngas.tithi.paksha} Paksha
                </p>
                <span className="text-[10px] text-[#895200] font-semibold block">
                  {scriptMode === 'meetei' ? 'ꯊꯥ ꯊꯥꯒꯠꯄ' : 'শুক্ল / কৃষ্ণ পক্ষ'}
                </span>
              </div>
            </div>

            {/* Muhurat Split: Auspicious vs Rahu Kaal */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200/80 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-amber-950 block leading-tight">Abhijit Muhurat</span>
                    <span className="text-[9.5px] text-amber-700 block leading-none">Most Auspicious Window</span>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-amber-900">
                  {homePanchang.muhurtas.abhijit.start} – {homePanchang.muhurtas.abhijit.end}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-rose-50 border border-rose-200 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-700 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-rose-950 block leading-tight">Rahu Kaal</span>
                    <span className="text-[9.5px] text-rose-700 block leading-none">Inauspicious Period</span>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-rose-900">
                  {homePanchang.muhurtas.rahuKaal.start} – {homePanchang.muhurtas.rahuKaal.end}
                </span>
              </div>
            </div>
          </section>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STITCH "UPCOMING CULTURAL FESTIVALS & EVENTS" DYNAMIC CAROUSEL */}
          {/* (Managed by Admin + Community User Submissions)                */}
          {/* ───────────────────────────────────────────────────────────── */}
          <section className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#a6331b]" />
                <div>
                  <h3 className="text-sm font-bold text-[#1a1c1e] leading-tight">
                    {scriptMode === 'meetei' ? 'ꯃꯩꯇꯩ ꯀꯨꯝꯃꯩ & ꯊꯧꯔꯝ' : 'Upcoming Festivals & Kumhei'}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-medium block">
                    {upcomingEvents.length} cultural events scheduled
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setUserEventSubmitSuccess(false);
                    setShowSubmitEventModal(true);
                  }}
                  className="px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 font-bold text-[11px] flex items-center gap-1 transition active:scale-95 cursor-pointer"
                  title="Submit your local event for review"
                >
                  <Plus className="w-3 h-3 text-amber-700" />
                  <span>Submit Event</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('calendar');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#c84b31] hover:text-[#a6331b] transition cursor-pointer pl-1"
                >
                  Calendar →
                </button>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {upcomingEvents.map((evt, idx) => {
                // Determine styling category
                const isThabal = evt.category === 'thabal';
                const isRitual = evt.category === 'ritual';
                const isKumhei = evt.category === 'kumhei';

                const headerBg = isThabal
                  ? 'bg-gradient-to-r from-[#a6331b] to-[#c84b31]'
                  : isRitual
                  ? 'bg-gradient-to-r from-[#4a2810] to-[#895200]'
                  : isKumhei
                  ? 'bg-gradient-to-r from-[#9e3b2d] to-[#fead4d]'
                  : 'bg-gradient-to-r from-[#895200] to-[#c84b31]';

                const categoryLabel = isThabal
                  ? 'Thabal Chongba'
                  : isRitual
                  ? 'Temple Ritual'
                  : isKumhei
                  ? 'Traditional Kumhei'
                  : 'Meitei Festival';

                // Display localized title
                const displayTitle = scriptMode === 'meetei' && evt.titleMeetei
                  ? evt.titleMeetei
                  : scriptMode === 'bengali' && evt.titleBengali
                  ? evt.titleBengali
                  : evt.titleEn;

                // Format display date
                const formattedDate = (() => {
                  if (!evt.dateStr) return '';
                  try {
                    const [y, m, d] = evt.dateStr.split('-').map(Number);
                    const dObj = new Date(y, m - 1, d);
                    return dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  } catch {
                    return evt.dateStr;
                  }
                })();

                return (
                  <div
                    key={evt.id || `evt-${idx}`}
                    className="flex-shrink-0 w-64 rounded-xl overflow-hidden border border-gray-200 bg-[#f9f9fc] flex flex-col justify-between shadow-2xs hover:border-amber-300 transition"
                  >
                    <div className={`p-3 ${headerBg} text-white`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="rounded-full bg-white/20 backdrop-blur-xs px-2 py-0.5 text-[8.5px] font-bold text-white uppercase font-mono">
                          {categoryLabel}
                        </span>
                        <span className="text-[10px] text-amber-200 font-mono font-semibold">
                          {formattedDate}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm leading-tight text-white line-clamp-1">
                        {displayTitle}
                      </h4>
                      <p className="text-[10.5px] text-amber-100/90 mt-0.5 leading-snug flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                        <span>{evt.venue || 'Manipur'}</span>
                      </p>
                    </div>

                    <div className="p-2.5 text-xs text-gray-700 space-y-1.5 flex-1 flex flex-col justify-between">
                      <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                        {evt.description || 'Join this sacred traditional event with friends, locality elders, and community.'}
                      </p>
                      
                      <div className="pt-1.5 border-t border-gray-200/70 flex items-center justify-between text-[10px] font-bold text-[#895200]">
                        <span className="truncate max-w-[120px] text-gray-500 font-medium">
                          {evt.organizer ? `By ${evt.organizer}` : evt.timeStr || 'All Day'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (evt.dateStr) {
                              setCalSelectedDateStr(evt.dateStr);
                              const parts = evt.dateStr.split('-').map(Number);
                              if (parts.length === 3) {
                                setCalYear(parts[0]);
                                setCalMonth(parts[1]);
                              }
                            }
                            setActiveTab('calendar');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-[#c84b31] hover:underline cursor-pointer flex items-center gap-0.5 font-bold"
                        >
                          <span>Calendar</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* COMMUNITY BUZZ • ꯈꯨꯟꯅꯥꯏ (LEIPUNG FEED PREVIEW ON HOMEPAGE)      */}
          {/* Example community posts listed with like, discuss & jump CTA  */}
          {/* ───────────────────────────────────────────────────────────── */}
          <section className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a1c1e] leading-tight flex items-center gap-1.5">
                    <span>Community Buzz</span>
                    <span className="text-xs text-amber-700 font-normal">/ ꯈꯨꯟꯅꯥꯏ (Leipung)</span>
                  </h3>
                  <span className="text-[10px] text-gray-500 font-medium block">
                    Discussions, ritual questions & culture updates
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('leipung');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <span>Open Feed</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* List of sample community posts */}
            <div className="space-y-2.5">
              {communityPosts.map((post) => {
                const isLiked = !!likedCommunityPostIds[post.id];
                const likesCount = (post.likes_count || 0) + (isLiked ? 1 : 0);

                return (
                  <div
                    key={post.id}
                    className="p-3 rounded-xl bg-[#f9f9fc] border border-gray-200/80 hover:border-amber-300 transition space-y-2 shadow-2xs"
                  >
                    {/* Author & Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${post.author.color || 'bg-amber-600'} text-white flex items-center justify-center text-xs font-bold shadow-xs`}>
                          {post.author.name?.charAt(0) || 'K'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-900 leading-tight">
                              {post.author.name}
                            </span>
                            {post.author.is_verified && (
                              <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
                            )}
                          </div>
                          <span className="text-[9.5px] text-slate-500 block leading-tight">
                            {post.author.badge || 'Community Member'}
                          </span>
                        </div>
                      </div>

                      {post.category_tag && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-[9.5px] font-bold font-mono">
                          {post.category_tag}
                        </span>
                      )}
                    </div>

                    {/* Content Text */}
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {post.content_text}
                    </p>

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleCommunityLike(post.id)}
                          className={`flex items-center gap-1 transition cursor-pointer ${
                            isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600 text-slate-500'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                          <span>{likesCount}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('leipung');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-1 hover:text-amber-700 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{post.comments_count || 0}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('leipung');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 transition cursor-pointer flex items-center gap-0.5"
                      >
                        <span>Join Discussion</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Share with Community Callout */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-[11px] text-amber-950 font-medium">
                  Have a ritual question or festival update?
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('leipung');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-2xs transition active:scale-95 cursor-pointer"
              >
                Write Post ✏️
              </button>
            </div>
          </section>

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

          {/* TODAY / SELECTED PANCHANG SECTION - HIGH CONTRAST & CLEAR VISIBILITY */}
          <section className="bg-white rounded-2xl border-2 border-slate-300 p-3.5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700">
                  <Sun className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-950 leading-tight">
                    {homeSelectedDateStr === todayStr
                      ? 'Today Panchang'
                      : `Panchang (${new Date(homeSelectedDateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`} ({scriptMode === 'meetei' ? 'ꯄꯥꯟꯆꯥꯡ' : 'দৈনিক পঞ্জিকা'})
                  </h2>
                  <span className="text-xs text-slate-800 font-bold block leading-tight">
                    Surya Udaya: <span className="font-mono text-slate-950">{homePanchang.sunMoonTimings.sunrise}</span> • Surya Asta: <span className="font-mono text-slate-950">{homePanchang.sunMoonTimings.sunset}</span>
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
                  {homeCalendarDay
                    ? (scriptMode === 'meetei' ? homeCalendarDay.tithiDisplayMeetei : homeCalendarDay.tithiDisplayBengali)
                    : homePanchang.fiveAngas.tithi.name}
                </strong>
                <span className="text-xs text-slate-800 font-semibold block">
                  Ending: {homeCalendarDay?.tithiEndingStandard || '07:44 AM'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-1">
                <span className="text-xs text-slate-800 font-bold block">
                  নক্ষত্র (Nakshatra):
                </span>
                <strong className="text-[15px] text-slate-950 font-black block truncate">
                  {scriptMode === 'meetei'
                    ? `ꯅꯛ:${homeCalendarDay?.nakshatraDisplayNumMeetei || toMeeteiNumerals(homePanchang.fiveAngas.nakshatra.index)} (${homeCalendarDay?.nakshatraNameMeetei || NAKSHATRA_NAMES_MEETEI[homePanchang.fiveAngas.nakshatra.index - 1]})`
                    : `নক্ষঃ ${homeCalendarDay?.nakshatraDisplayNumBengali || toBengaliNumerals(homePanchang.fiveAngas.nakshatra.index)} (${homeCalendarDay?.nakshatraNameBengali || NAKSHATRA_NAMES_BENGALI[homePanchang.fiveAngas.nakshatra.index - 1]})`}
                </strong>
                <span className="text-xs text-slate-800 font-semibold block">
                  Pada {homePanchang.fiveAngas.nakshatra.pada} • Lord {homePanchang.fiveAngas.nakshatra.lord}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-1">
                <span className="text-xs text-slate-800 font-bold block">
                  সৌর তারিখ (Soura Date):
                </span>
                <strong className="text-[15px] text-slate-950 font-black block truncate">
                  {homeCalendarDay
                    ? `${homeCalendarDay.solarMonth.bengali} ${toBengaliNumerals(homeCalendarDay.souraDate)}, শকাব্দ ${toBengaliNumerals(homeCalendarDay.sakaYear)}`
                    : `ভাদ্র ২৮, শকাব্দ ১৯৪৮`}
                </strong>
                <span className="text-xs text-slate-800 font-semibold block">
                  Ritu: {homePanchang.planetaryState.ritu}
                </span>
              </div>

              {/* Rahu Kaal - High Visibility Alert Box */}
              <div className="p-2.5 rounded-xl bg-rose-50 border-2 border-rose-300 space-y-1">
                <span className="text-xs text-rose-950 font-black block">
                  রাহু কাল (Rahu Kaal):
                </span>
                <strong className="text-[15px] text-rose-950 font-mono font-black block">
                  {homePanchang.muhurtas.rahuKaal.start} – {homePanchang.muhurtas.rahuKaal.end}
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
                      <strong className="text-slate-950 font-black block">{homePanchang.fiveAngas.yoga.name}</strong>
                      <span className="text-slate-800 text-[11px] font-semibold">{homePanchang.fiveAngas.yoga.isAuspicious ? 'শুভ যোগ (Auspicious)' : 'সাধারণ যোগ'}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-300">
                      <span className="text-slate-700 font-bold block text-xs">করণ (Karana):</span>
                      <strong className="text-slate-950 font-black block">{homePanchang.fiveAngas.karana.name}</strong>
                      <span className="text-slate-800 text-[11px] font-semibold">Type: {homePanchang.fiveAngas.karana.type}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-300">
                      <span className="text-emerald-950 font-black block text-xs">অভিজিৎ মুহূর্ত (Abhijit):</span>
                      <strong className="text-emerald-950 font-black block">{homePanchang.muhurtas.abhijit.start} – {homePanchang.muhurtas.abhijit.end}</strong>
                      <span className="text-emerald-900 text-[11px] font-bold">Best for good works</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-300">
                      <span className="text-slate-700 font-bold block text-xs">চন্দ্র রাশি (Moon Sign):</span>
                      <strong className="text-slate-950 font-black block">{homePanchang.planetaryState.moonSign}</strong>
                      <span className="text-slate-800 text-[11px] font-semibold">Sun Sign: {homePanchang.planetaryState.sunSign}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50 border-2 border-rose-300">
                      <span className="text-rose-950 font-black block text-xs">যমগণ্ড কাল (Yamaganda):</span>
                      <strong className="text-rose-950 font-mono font-black block">{homePanchang.muhurtas.yamaganda.start} – {homePanchang.muhurtas.yamaganda.end}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50 border-2 border-rose-300">
                      <span className="text-rose-950 font-black block text-xs">গুলিক কাল (Gulika):</span>
                      <strong className="text-rose-950 font-mono font-black block">{homePanchang.muhurtas.gulikaKaal.start} – {homePanchang.muhurtas.gulikaKaal.end}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-950 font-bold">
                    <span>Day Length: {homePanchang.sunMoonTimings.dayLength}</span>
                    <span>Ayana: {homePanchang.planetaryState.ayana}</span>
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
      {/* 5.5 ADMOB BANNER UNIT (DOCKED DIRECTLY ABOVE BOTTOM NAV)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ManipuriAdMobBanner appSettings={appSettings} isOnline={isOnline} />

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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. USER EVENT SUBMISSION MODAL (APPROVAL WORKFLOW)             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showSubmitEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-amber-300">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">
                    Submit Event / Kumhei (ꯀꯨꯝꯃꯩ)
                  </h3>
                  <span className="text-[10.5px] text-amber-200/90 font-medium block">
                    Submit for admin approval to list on app
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitEventModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-800">
              {userEventSubmitSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Event Submitted for Review! 🎉
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    Thank you! Your event has been received by our editorial team. Once approved by the admin, it will be published to the Manipuri Calendar upcoming festivals list for all users.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setUserEventSubmitSuccess(false);
                      setShowSubmitEventModal(false);
                    }}
                    className="mt-2 px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitUserEvent} className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-snug">
                      Organizing a Thabal Chongba, Temple ritual, or sports festival in your locality? Submit it here for admin verification.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Event / Festival Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Uripok Yaoshang Thabal Chongba"
                      value={userEventForm.title}
                      onChange={(e) => setUserEventForm({ ...userEventForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-hidden font-sans text-xs bg-white text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={userEventForm.category}
                        onChange={(e) => setUserEventForm({ ...userEventForm, category: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-slate-900"
                      >
                        <option value="thabal">Thabal Chongba</option>
                        <option value="festival">Cultural Festival</option>
                        <option value="ritual">Temple Ritual / Lai Haraoba</option>
                        <option value="kumhei">Traditional Kumhei</option>
                        <option value="community">Community Gathering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={userEventForm.dateStr}
                        onChange={(e) => setUserEventForm({ ...userEventForm, dateStr: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-slate-900"
                      >
                      </input>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={userEventForm.endDateStr}
                        onChange={(e) => setUserEventForm({ ...userEventForm, endDateStr: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Timing
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 07:00 PM Onwards"
                        value={userEventForm.timeStr}
                        onChange={(e) => setUserEventForm({ ...userEventForm, timeStr: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Venue / Locality *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kangla West Ground, Imphal West"
                      value={userEventForm.venue}
                      onChange={(e) => setUserEventForm({ ...userEventForm, venue: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Event Details / Schedule
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Special attractions, band/orchestra, traditional attire guidelines, etc."
                      value={userEventForm.description}
                      onChange={(e) => setUserEventForm({ ...userEventForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-slate-900 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Organizer / Club
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Young Youth Club"
                        value={userEventForm.organizer}
                        onChange={(e) => setUserEventForm({ ...userEventForm, organizer: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Your Contact No.
                      </label>
                      <input
                        type="tel"
                        placeholder="Phone for admin verification"
                        value={userEventForm.submitterContact}
                        onChange={(e) => setUserEventForm({ ...userEventForm, submitterContact: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden font-sans text-xs bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowSubmitEventModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingUserEvent}
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {submittingUserEvent ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Event</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
