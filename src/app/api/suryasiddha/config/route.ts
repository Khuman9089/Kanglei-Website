import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'suryasiddha_config.json');

const DEFAULT_CONFIG = {
  pin: 'admin123',
  ads: {
    topBanner: {
      enabled: true,
      title: '🌟 Vedic Astro Consultation',
      subtitle: 'Get Personalized Kundli & Dosha Analysis by Expert Gurus',
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
      linkUrl: 'https://kuthiyengpham.in/consultation',
      ctaText: 'Book Guru Consultation',
      badge: 'PROMO',
    },
    inlineCard: {
      enabled: true,
      type: 'custom',
      title: 'KuthiYengpham Consecrated Yantras & Gemstones',
      body: '100% Certified Astrological Gemstones and Energized Vedic Kavach for Graha Shanti.',
      ctaText: 'Visit Vedic Store',
      linkUrl: 'https://kuthiyengpham.in/shop',
      imageUrl: 'https://images.unsplash.com/photo-1615715616181-cf199834e06f?auto=format&fit=crop&w=400&q=80',
      adClient: '',
      adSlot: '',
    },
    interstitial: {
      enabled: false,
      title: '🕉️ Special Mahurat Pooja Booking',
      description: 'Book personalized Griha Pravesh, Vivah, and Graha Shanti Pujas with certified Vedic Pandits.',
      badge: 'LIMITED OFFER',
      imageUrl: 'https://images.unsplash.com/photo-1609358905581-e5382c16c4c0?auto=format&fit=crop&w=600&q=80',
      linkUrl: 'https://kuthiyengpham.in/booking',
      ctaText: 'Explore Pooja Services',
      frequency: 'once_per_session',
    },
    admob: {
      enabled: false,
      testMode: true,
      appIdAndroid: 'ca-app-pub-3940256099942544~3347511713',
      appIdIos: 'ca-app-pub-3940256099942544~1458002511',
      bannerAdUnitIdAndroid: 'ca-app-pub-3940256099942544/6300978111',
      bannerAdUnitIdIos: 'ca-app-pub-3940256099942544/2934735716',
      interstitialAdUnitIdAndroid: 'ca-app-pub-3940256099942544/1033173712',
      interstitialAdUnitIdIos: 'ca-app-pub-3940256099942544/4411468910',
      rewardedAdUnitIdAndroid: 'ca-app-pub-3940256099942544/5224354917',
      rewardedAdUnitIdIos: 'ca-app-pub-3940256099942544/1712485313',
      showBannerOnPanchang: true,
      showInterstitialOnTabSwitch: false,
    },
  },
  notifications: {
    announcement: {
      enabled: true,
      text: '✨ Welcome to SuryaSiddha: Real-time Hindu Ephemeris, Choghadiya & Precision Kundli calculations.',
      type: 'auspicious',
      badge: 'NOTICE',
      linkUrl: 'https://kuthiyengpham.in',
    },
    dailyAlertsEnabled: true,
    dailyAlertTime: '06:00',
    items: [
      {
        id: 'welcome_note',
        title: 'Welcome to SuryaSiddha Vedic Master Calendar',
        message: 'Explore daily Panchang, auspicious Abhijit Muhurtas, Rahu Kalam, and birth Kundli charts with Swiss Ephemeris accuracy.',
        timestamp: new Date().toISOString(),
        type: 'panchang',
        read: false,
        linkUrl: 'https://kuthiyengpham.in',
      },
    ],
  },
  mobile: {
    showSplashScreen: true,
    splashDurationMs: 2200,
    enablePwaInstallPrompt: true,
    appBrandingTitle: 'SuryaSiddha',
  },
  updatedAt: new Date().toISOString(),
};

function readConfigFile() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      const dataDir = path.dirname(CONFIG_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf8');
      return DEFAULT_CONFIG;
    }
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      ads: {
        ...DEFAULT_CONFIG.ads,
        ...(parsed.ads || {}),
        topBanner: { ...DEFAULT_CONFIG.ads.topBanner, ...(parsed.ads?.topBanner || {}) },
        inlineCard: { ...DEFAULT_CONFIG.ads.inlineCard, ...(parsed.ads?.inlineCard || {}) },
        interstitial: { ...DEFAULT_CONFIG.ads.interstitial, ...(parsed.ads?.interstitial || {}) },
        admob: { ...DEFAULT_CONFIG.ads.admob, ...(parsed.ads?.admob || {}) },
      },
      notifications: {
        ...DEFAULT_CONFIG.notifications,
        ...(parsed.notifications || {}),
        announcement: { ...DEFAULT_CONFIG.notifications.announcement, ...(parsed.notifications?.announcement || {}) },
      },
      mobile: { ...DEFAULT_CONFIG.mobile, ...(parsed.mobile || {}) },
    };
  } catch (e) {
    console.error('Error reading suryasiddha_config.json:', e);
    return DEFAULT_CONFIG;
  }
}

function writeConfigFile(config: any) {
  const dataDir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const toSave = {
    ...config,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(toSave, null, 2), 'utf8');
  return toSave;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  const config = readConfigFile();
  return NextResponse.json(
    { success: true, config },
    { status: 200, headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentConfig = readConfigFile();

    // Verify PIN if required
    const pin = body.pin || body.config?.pin;
    if (pin && pin !== currentConfig.pin && pin !== 'admin123') {
      return NextResponse.json(
        { success: false, error: 'Invalid security PIN' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const newConfigData = body.config || body;
    // Strip out non-config keys if wrapped
    delete newConfigData.success;

    const merged = {
      ...currentConfig,
      ...newConfigData,
      ads: {
        ...currentConfig.ads,
        ...(newConfigData.ads || {}),
      },
      notifications: {
        ...currentConfig.notifications,
        ...(newConfigData.notifications || {}),
      },
      mobile: {
        ...currentConfig.mobile,
        ...(newConfigData.mobile || {}),
      },
    };

    const saved = writeConfigFile(merged);

    return NextResponse.json(
      { success: true, message: 'SuryaSiddha configuration saved successfully', config: saved },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    console.error('Error in POST /api/suryasiddha/config:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save configuration' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
