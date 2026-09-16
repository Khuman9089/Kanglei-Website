import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'app_settings.json');

const DEFAULT_SETTINGS = {
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
    top_banner_mode: 'custom',
    custom_top_banner: {
      enabled: true,
      format: 'rich_promo',
      title: 'Authentic Manipuri Kuthi & Rudraksha',
      subtitle: '100% Energized Puja items & Personalized Janma Patrika',
      badge_text: '⚡ SPONSORED PROMO',
      image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop',
      cta_text: 'Shop Now',
      cta_link: '/shop',
      open_in_new_tab: false,
      bg_gradient: 'from-[#211a14] via-[#2f2216] to-[#1a1511]',
      html_code: '',
    },
    top_banner: {
      enabled: true,
      unit_id: 'ca-app-pub-3940256099942544/6300978111',
      type: 'native_card',
    },
    middle_feed: {
      enabled: true,
      unit_id: 'ca-app-pub-3940256099942544/6300978112',
      type: 'banner',
    },
    bottom_sticky: {
      enabled: false,
      unit_id: 'ca-app-pub-3940256099942544/6300978113',
      type: 'banner',
    },
    interstitial_enabled: false,
  },
  side_menu: {
    show_account: true,
    account_title: 'My Account / Kundli Profile',
    account_subtitle: 'View birth charts & consultations',
    account_link: '/kundli',
    show_share: true,
    share_title: 'Share App with Friends',
    share_subtitle: 'Spread Manipuri Astrology & Calendar',
    share_message: 'Explore Manipuri Calendar, Panchang & Janma Patrika on Kanglei Astro: https://kangleiastro.com',
    share_url: 'https://kangleiastro.com',
    show_social_links: true,
    social_links: {
      facebook: 'https://facebook.com/kangleiastro',
      whatsapp: 'https://wa.me/919876543210',
      youtube: 'https://youtube.com/@kangleiastro',
      instagram: 'https://instagram.com/kangleiastro',
      telegram: 'https://t.me/kangleiastro',
    },
    custom_links: [
      { id: 'link-1', label: 'Astrologer Consultation', url: '/astrologers', icon: 'UserCheck', enabled: true },
      { id: 'link-2', label: 'Kanglei Astro Store', url: '/shop', icon: 'ShoppingBag', enabled: true },
      { id: 'link-3', label: 'Contact & Support', url: '/contact', icon: 'Phone', enabled: true },
    ],
    app_version: 'v1.2.0',
    bottom_branding_text: 'Manipuri Calender by KangleiAstro',
  },
  notifications: [],
};

export async function GET() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
    }
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
    const settings = JSON.parse(raw);
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}
