// utils/adminStorage.ts - Admin Configuration Persistence Engine
import { AdminAppConfig } from '../types/admin';

const STORAGE_KEY = 'suryasiddha_admin_config_v1';

export const DEFAULT_ADMIN_CONFIG: AdminAppConfig = {
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
      {
        id: 'auspicious_tip',
        title: 'Shubh Choghadiya & Rahu Kalam Alerts',
        message: 'Plan your auspicious beginnings (Amrit, Shubh, Labh) and avoid Rahu Kalam periods in the Muhurta tab.',
        timestamp: new Date().toISOString(),
        type: 'muhurta',
        read: false,
      },
    ],
  },
  mobile: {
    showSplashScreen: true,
    splashDurationMs: 2200,
    enablePwaInstallPrompt: true,
    appBrandingTitle: 'SuryaSiddha',
  },
};

export function loadAdminConfig(): AdminAppConfig {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ADMIN_CONFIG,
      ...parsed,
      ads: { ...DEFAULT_ADMIN_CONFIG.ads, ...(parsed.ads || {}) },
      notifications: { ...DEFAULT_ADMIN_CONFIG.notifications, ...(parsed.notifications || {}) },
      mobile: { ...DEFAULT_ADMIN_CONFIG.mobile, ...(parsed.mobile || {}) },
    };
  } catch {
    return DEFAULT_ADMIN_CONFIG;
  }
}

export function saveAdminConfig(config: AdminAppConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save admin configuration:', err);
  }
}
