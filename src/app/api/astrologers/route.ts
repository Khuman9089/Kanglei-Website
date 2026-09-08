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
  categories?: string[]; // Dynamic categories menu for /astrologers page
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
  categories: ['Love', 'Education', 'Career', 'Marriage', 'Health', 'Wealth'],
};


const DEFAULT_ASTROLOGERS: AstrologerItem[] = [];

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
      specialties: (a.specialties && a.specialties.length > 0) ? a.specialties : (a.categoryTags && a.categoryTags.length > 0) ? a.categoryTags : a.specialty ? [a.specialty] : ['Vedic Astrology'],
      languages: Array.isArray(a.languages) ? a.languages.join(' · ') : (a.languages || 'Manipuri · English'),
      rating: typeof a.rating === 'number' ? a.rating : 5.0,
      consultationsCount: a.consultationsCount || '100+ orders',
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
