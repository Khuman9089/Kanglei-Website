import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface AstrologerItem {
  id: string;
  name: string;
  username?: string;
  badge?: 'Celebrity' | 'Top Choice' | 'Master Guru' | 'Verified';
  avatar?: string;
  specialty?: string;
  specialties?: string[];
  categoryTags?: string[];
  languages?: string | string[];
  experienceYears?: number;
  phone?: string;
  whatsappNo?: string;
  whatsappPhone?: string;
  sameAsWhatsapp?: boolean;
  email?: string;
  streetLane?: string;
  cityDistrict?: string;
  state?: string;
  pincode?: string;
  address?: string;
  password?: string;
  status?: 'ACTIVE' | 'ON_HOLD' | 'SUSPENDED';
  upiId?: string;
  bankName?: string;
  accountHolder?: string;
  accountNo?: string;
  ifscCode?: string;
  payoutMethod?: 'UPI' | 'BANK';
  planTier?: 'BASIC' | 'ADVANCE' | 'PRO';
  rating?: number;
  consultationsCount?: string;
  pricePerMin?: number;
  fixedRate?: number;
  actionButtonType?: 'both' | 'chat_only' | 'call_only';
  bio?: string;
  isTrending?: boolean;
  active?: boolean;
  online?: boolean;
  showOnHome?: boolean;
  allowedTools?: string[];
  pendingPayout?: number;
  completedCount?: number;
}

import { ACTIVE_TOOLS_REGISTRY } from '@/config/toolsRegistry';

const ALL_TOOL_IDS = ACTIVE_TOOLS_REGISTRY.map((t) => t.id);

export interface AstrologerSectionSettings {
  title: string;
  highlightText: string;
  subtitleTagline: string;
  showRateOnHome: boolean; // Toggle rate display on homepage
  actionButtonType: 'both' | 'chat_only' | 'call_only'; // Control button function (Chat, Call, or Both)
  rateMode: 'fixed' | 'per_minute' | 'both' | 'none'; // Rate mode: fixed fee, per-minute rate, both, or hide
  defaultFixedRate: number; // Default fixed consultation rate (e.g. ₹499)
  fixedRateLabel?: string; // Label display e.g. "Fixed"
}

const DEFAULT_SECTION_SETTINGS: AstrologerSectionSettings = {
  title: "Talk to Manipur's",
  highlightText: "Top Rated",
  subtitleTagline: "Every astrologer below has cleared a 4-step verification — qualification, panel interview, live audits, and a 30-day probation.",
  showRateOnHome: true,
  actionButtonType: 'both',
  rateMode: 'fixed',
  defaultFixedRate: 499,
  fixedRateLabel: 'Fixed',
};


const DEFAULT_ASTROLOGERS: AstrologerItem[] = [
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
    fixedRate: 499,
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
    fixedRate: 399,
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
    fixedRate: 449,
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
    fixedRate: 349,
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
    fixedRate: 499,
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
    fixedRate: 599,
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
    fixedRate: 549,
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
    fixedRate: 449,
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
  const settings = await readPersistentDataAsync<AstrologerSectionSettings>('astrologer_settings', DEFAULT_SECTION_SETTINGS);
  let astrologers = await readPersistentDataAsync<AstrologerItem[]>('astrologers', DEFAULT_ASTROLOGERS);

  const mergedSettings: AstrologerSectionSettings = { ...DEFAULT_SECTION_SETTINGS, ...settings };
  astrologers = astrologers.map((a) => {
    const defaultItem = DEFAULT_ASTROLOGERS.find((d) => d.id === a.id);
    return {
      ...a,
      pricePerMin: a.pricePerMin || defaultItem?.pricePerMin || 35,
      fixedRate: a.fixedRate || defaultItem?.fixedRate || mergedSettings.defaultFixedRate || 499,
      actionButtonType: a.actionButtonType || mergedSettings.actionButtonType || 'both',
    };
  });

  return NextResponse.json(
    {
      settings: mergedSettings,
      astrologers,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let currentSettings = await readPersistentDataAsync<AstrologerSectionSettings>('astrologer_settings', DEFAULT_SECTION_SETTINGS);
    let currentAstrologers = await readPersistentDataAsync<AstrologerItem[]>('astrologers', DEFAULT_ASTROLOGERS);

    if (body.settings) {
      currentSettings = { ...DEFAULT_SECTION_SETTINGS, ...currentSettings, ...body.settings };
      await writePersistentDataAsync('astrologer_settings', currentSettings);
    }

    if (body.astrologers && Array.isArray(body.astrologers)) {
      currentAstrologers = body.astrologers;
      await writePersistentDataAsync('astrologers', currentAstrologers);
    }

    // Handle single action dispatch
    if (body.action === 'UPDATE_STATUS' && body.id) {
      currentAstrologers = currentAstrologers.map((a) =>
        a.id === body.id ? { ...a, status: body.status } : a
      );
      await writePersistentDataAsync('astrologers', currentAstrologers);
    } else if (body.action === 'DELETE_ASTROLOGER' && body.id) {
      currentAstrologers = currentAstrologers.filter((a) => a.id !== body.id);
      await writePersistentDataAsync('astrologers', currentAstrologers);
    }

    const astro = body.astrologer || body.updateAstrologer;
    if (astro && astro.name) {
      const idx = currentAstrologers.findIndex((a) => a.id === astro.id || (astro.whatsappNo && a.whatsappPhone === astro.whatsappNo));
      if (idx !== -1) {
        currentAstrologers[idx] = { ...currentAstrologers[idx], ...astro };
      } else {
        currentAstrologers.push(astro);
      }
      await writePersistentDataAsync('astrologers', currentAstrologers);

      // Sync to public.astrologers SQL table in Supabase
      try {
        await supabase.from('astrologers').upsert({
          id: astro.id || 'astro-' + Date.now(),
          name: astro.name,
          title: astro.badge || 'Vedic Astrologer',
          specialties: astro.specialties || [],
          languages: typeof astro.languages === 'string' ? astro.languages.split('·').map((l: string) => l.trim()) : (astro.languages || []),
          experience_years: astro.experienceYears || 5,
          rate_per_min: astro.pricePerMin || 15,
          rating: astro.rating || 5.0,
          avatar: astro.avatar || '',
          bio: astro.bio || '',
          is_online: astro.online !== false,
          phone: astro.phone || astro.whatsappPhone || '',
          email: astro.email || '',
          is_approved: true,
        }, { onConflict: 'id' });
      } catch (sbErr) {
        console.warn('Supabase astrologers table sync warning:', sbErr);
      }

      // Persist in Prisma Database if DATABASE_URL is configured
      if (process.env.DATABASE_URL) {
        try {
          const emailStr = astro.email || `astro-${(astro.whatsappNo || '000').replace(/[^\d]/g, '')}@kangleiastro.com`;
          await prisma.user.upsert({
            where: { email: emailStr },
            update: {
              name: astro.name,
              phone: astro.phone || astro.whatsappNo,
              whatsappNo: astro.whatsappNo,
              hashedPassword: astro.password || 'astro123',
              role: 'ASTROLOGER',
            },
            create: {
              name: astro.name,
              email: emailStr,
              phone: astro.phone || astro.whatsappNo,
              whatsappNo: astro.whatsappNo,
              hashedPassword: astro.password || 'astro123',
              role: 'ASTROLOGER',
            },
          });
        } catch (dbErr) {
          console.warn('Prisma Astrologer upsert error:', dbErr);
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        settings: currentSettings,
        astrologers: currentAstrologers,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update astrologers' }, { status: 500 });
  }
}
