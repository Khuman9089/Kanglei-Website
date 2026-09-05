import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface NavSubItem {
  id: string;
  title: string;
  href: string;
  description?: string;
  badge?: string;
  active: boolean;
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
  badge?: string;
  type: 'link' | 'dropdown';
  subItems?: NavSubItem[];
  active: boolean;
  order: number;
}

export interface NavbarConfig {
  items: NavItem[];
  cbs: {
    showKuthiYengbaBtn: boolean;
    kuthiYengbaBtnText: string;
    kuthiYengbaBtnHref: string;
    showKuthiIbaBtn: boolean;
    kuthiIbaBtnText: string;
    kuthiIbaBtnHref: string;
    showNumitLeppaBtn: boolean;
    numitLeppaBtnText: string;
    numitLeppaBtnHref: string;
  };
}

const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
  items: [
    {
      id: 'nav-1',
      title: 'Horoscopes',
      href: '/horoscope',
      type: 'link',
      active: true,
      order: 1,
    },
    {
      id: 'nav-2',
      title: 'Astrologers',
      href: '/astrologers',
      type: 'link',
      active: true,
      order: 2,
    },
    {
      id: 'nav-3',
      title: 'Services',
      href: '/services',
      type: 'dropdown',
      active: true,
      order: 3,
      subItems: [
        { id: 'sub-s1', title: 'Kuthi Yengba (Horoscope Reading)', href: '/manipuri_kuthi_yengba', description: 'In-depth Dasha forecast & Vedic remedies', badge: 'POPULAR', active: true },
        { id: 'sub-s2', title: 'Kuthi Iba (Handwritten Creation)', href: '/manipuri_kuthi', description: 'Sacred parchment hand-written birth scroll', badge: 'TRADITIONAL', active: true },
        { id: 'sub-s3', title: 'Numit Leppa Yengba', href: '/numit_leppa_yengba', description: 'Auspicious muhurat date selection', badge: 'HOT', active: true },
        { id: 'sub-s4', title: 'Kundli Matching (36-Gun Milan)', href: '/matching', description: 'Marriage compatibility & Manglik check', active: true },
      ],
    },
    {
      id: 'nav-4',
      title: 'E-Store',
      href: '/shop',
      type: 'link',
      active: true,
      order: 4,
    },
    {
      id: 'nav-5',
      title: 'Free Tools',
      href: '/manipuri_free_kuthi',
      type: 'dropdown',
      badge: 'FREE',
      active: true,
      order: 5,
      subItems: [
        { id: 'sub-f1', title: 'Free Manipuri Kundli Generator', href: '/manipuri_free_kuthi', description: 'Generate natal chart PDF instantly', badge: 'FREE', active: true },
        { id: 'sub-f2', title: 'Free Gun Milan Matcher', href: '/matching', description: 'Quick 36-point Ashtakoot score check', active: true },
      ],
    },
    {
      id: 'nav-6',
      title: 'Blog',
      href: '/blog',
      type: 'link',
      active: true,
      order: 6,
    },
    {
      id: 'nav-7',
      title: 'Numit Leppa',
      href: '/numit_leppa_yengba',
      type: 'link',
      active: true,
      order: 7,
    },
  ],
  cbs: {
    showKuthiYengbaBtn: true,
    kuthiYengbaBtnText: 'Kuthi Yengba',
    kuthiYengbaBtnHref: '/manipuri_kuthi_yengba',
    showKuthiIbaBtn: true,
    kuthiIbaBtnText: 'Kuthi Iba',
    kuthiIbaBtnHref: '/manipuri_kuthi',
    showNumitLeppaBtn: true,
    numitLeppaBtnText: 'Numit Leppa',
    numitLeppaBtnHref: '/numit_leppa_yengba',
  },
};

export async function GET() {
  const navConfig = await readPersistentDataAsync<NavbarConfig>('navbar_config', DEFAULT_NAVBAR_CONFIG);
  return NextResponse.json(navConfig, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body && Array.isArray(body.items)) {
      await writePersistentDataAsync<NavbarConfig>('navbar_config', body);
      return NextResponse.json(
        {
          success: true,
          message: 'Navbar Navigation Menu settings saved successfully!',
          config: body,
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }
    return NextResponse.json({ error: 'Invalid navbar payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
