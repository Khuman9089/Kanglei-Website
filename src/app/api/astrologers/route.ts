import { NextResponse } from 'next/server';

export interface AstrologerItem {
  id: string;
  name: string;
  badge: 'Celebrity' | 'Top Choice' | 'Master Guru' | 'Verified';
  avatar: string;
  specialties: string[];
  categoryTags: string[]; // e.g. ['Love', 'Education', 'Career', 'Marriage', 'Health', 'Wealth']
  languages: string;
  experienceYears: number;
  rating: number;
  consultationsCount: string;
  pricePerMin: number;
  whatsappPhone: string;
  email: string;
  bio: string;
  isTrending: boolean;
  active: boolean;
  online: boolean;
  showOnHome: boolean; // Controls whether displayed in Homepage Top Astrologers section
  allowedTools?: string[]; // Array of tool IDs allowed for this astrologer (controlled by Admin)
}

import { ACTIVE_TOOLS_REGISTRY } from '@/config/toolsRegistry';

export const ALL_TOOL_IDS = ACTIVE_TOOLS_REGISTRY.map((t) => t.id);

export interface AstrologerSectionSettings {
  title: string;
  highlightText: string;
  subtitleTagline: string;
  showRateOnHome: boolean; // Toggle rate display (e.g. ₹35/min) on homepage
  actionButtonType: 'both' | 'chat_only' | 'call_only'; // Control button function (Chat, Call, or Both)
}

let sectionSettings: AstrologerSectionSettings = {
  title: "Talk to Manipur's",
  highlightText: "Top Rated",
  subtitleTagline: "Every astrologer below has cleared a 4-step verification — qualification, panel interview, live audits, and a 30-day probation.",
  showRateOnHome: true,
  actionButtonType: 'both',
};

let astrologersStore: AstrologerItem[] = [
  {
    id: 'astro-1',
    name: 'Acharya Tombi Sharma',
    badge: 'Celebrity',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    specialties: ['Kuthi Yengba', 'Vedic', 'Matching'],
    categoryTags: ['Marriage', 'Career', 'Love'],
    languages: 'Manipuri · English · Hindi',
    experienceYears: 15,
    rating: 5.0,
    consultationsCount: '50k+',
    pricePerMin: 35,
    whatsappPhone: '+919862099881',
    email: 'tombi.sharma@kangleiastro.com',
    bio: 'Master Vedic Astrologer with 15+ years of expertise in Kuthi Yengba, Dasha remedies, and marital compatibility.',
    isTrending: true,
    active: true,
    online: true,
    showOnHome: true,
  },
  {
    id: 'astro-2',
    name: 'Saanvi Sharma',
    badge: 'Celebrity',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
    specialties: ['Tarot', 'Life Coach', 'Numerology'],
    categoryTags: ['Love', 'Health', 'Education'],
    languages: 'Manipuri · English',
    experienceYears: 8,
    rating: 4.9,
    consultationsCount: '10k+',
    pricePerMin: 28,
    whatsappPhone: '+919862099881',
    email: 'saanvi.sharma@kangleiastro.com',
    bio: 'Specialist in intuitive Tarot reading, relationship counseling, and psychological birth chart insights.',
    isTrending: true,
    active: true,
    online: true,
    showOnHome: true,
  },
  {
    id: 'astro-3',
    name: 'Pandit Ningthem Meitei',
    badge: 'Top Choice',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    specialties: ['Vedic', 'Face Reading', 'Gun Milan'],
    categoryTags: ['Marriage', 'Wealth', 'Career'],
    languages: 'Manipuri · Hindi',
    experienceYears: 12,
    rating: 5.0,
    consultationsCount: '25k+',
    pricePerMin: 30,
    whatsappPhone: '+919774033411',
    email: 'ningthem.meitei@kangleiastro.com',
    bio: 'Senior Jyotish Scholar specializing in 36-Gun Ashtakoot matching, Manglik remedies, and business timing.',
    isTrending: true,
    active: true,
    online: true,
    showOnHome: true,
  },
  {
    id: 'astro-4',
    name: 'Gurumayum Sharma',
    badge: 'Celebrity',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    specialties: ['Numerology', 'Dasha Remedies', 'Palmistry'],
    categoryTags: ['Career', 'Education', 'Wealth'],
    languages: 'Manipuri · English',
    experienceYears: 10,
    rating: 5.0,
    consultationsCount: '15k+',
    pricePerMin: 25,
    whatsappPhone: '+919856177122',
    email: 'gurumayum.sharma@kangleiastro.com',
    bio: 'Numerology and Palmistry specialist providing practical gemstones, Mantras, and life alignment remedies.',
    isTrending: true,
    active: true,
    online: true,
    showOnHome: true,
  },
  {
    id: 'astro-5',
    name: 'Lokamayi Devi',
    badge: 'Top Choice',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=300&q=80',
    specialties: ['Tarot', 'Life Coach', 'Face Reading'],
    categoryTags: ['Love', 'Health', 'Marriage'],
    languages: 'Manipuri · English · Hindi',
    experienceYears: 7,
    rating: 4.9,
    consultationsCount: '12k+',
    pricePerMin: 34,
    whatsappPhone: '+919862099881',
    email: 'lokamayi.devi@kangleiastro.com',
    bio: 'Renowned Face Reading expert and spiritual healer focusing on love guidance and career clarity.',
    isTrending: false,
    active: true,
    online: true,
    showOnHome: false,
  },
  {
    id: 'astro-6',
    name: 'Astro Amarmani',
    badge: 'Top Choice',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    specialties: ['Vedic', 'Numerology', 'Vastu'],
    categoryTags: ['Wealth', 'Career', 'Education'],
    languages: 'Manipuri · English · Hindi',
    experienceYears: 20,
    rating: 4.8,
    consultationsCount: '35k+',
    pricePerMin: 45,
    whatsappPhone: '+919862099881',
    email: 'amarmani@kangleiastro.com',
    bio: 'Vastu Shastra and corporate astrology advisor with 20 years of experience guiding property and investment choices.',
    isTrending: false,
    active: true,
    online: true,
    showOnHome: false,
  },
  {
    id: 'astro-7',
    name: 'Raghuvardas',
    badge: 'Verified',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
    specialties: ['Vedic', 'Face Reading', 'Psychic'],
    categoryTags: ['Health', 'Career', 'Wealth'],
    languages: 'Manipuri · Hindi',
    experienceYears: 14,
    rating: 5.0,
    consultationsCount: '40k+',
    pricePerMin: 40,
    whatsappPhone: '+919862099881',
    email: 'raghuvardas@kangleiastro.com',
    bio: 'Prashna Kundli expert offering instant precise answers to immediate burning life questions.',
    isTrending: true,
    active: true,
    online: true,
    showOnHome: false,
  },
  {
    id: 'astro-8',
    name: 'Abhas Sharma',
    badge: 'Verified',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80',
    specialties: ['Vedic', 'Nadi', 'Face Reading'],
    categoryTags: ['Education', 'Love', 'Marriage'],
    languages: 'Manipuri · English',
    experienceYears: 9,
    rating: 5.0,
    consultationsCount: '18k+',
    pricePerMin: 32,
    whatsappPhone: '+919862099881',
    email: 'abhas.sharma@kangleiastro.com',
    bio: 'Nadi astrology practitioner specializing in karmic patterns and precise planetary timing.',
    isTrending: true,
    active: true,
    online: true,
    showOnHome: false,
  },
];

export async function GET() {
  return NextResponse.json({
    settings: sectionSettings,
    astrologers: astrologersStore,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.settings) {
      sectionSettings = { ...sectionSettings, ...body.settings };
    }

    if (body.astrologers && Array.isArray(body.astrologers)) {
      astrologersStore = body.astrologers;
    }

    // Support single astrologer update (e.g., from Astrologer Dashboard or Admin)
    if (body.updateAstrologer && body.updateAstrologer.id) {
      const idx = astrologersStore.findIndex((a) => a.id === body.updateAstrologer.id || a.email === body.updateAstrologer.email);
      if (idx !== -1) {
        astrologersStore[idx] = { ...astrologersStore[idx], ...body.updateAstrologer };
      } else {
        astrologersStore.push(body.updateAstrologer);
      }
    }

    return NextResponse.json({
      success: true,
      settings: sectionSettings,
      astrologers: astrologersStore,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update astrologers' }, { status: 500 });
  }
}
