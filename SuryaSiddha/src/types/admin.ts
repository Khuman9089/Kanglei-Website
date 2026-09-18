// types/admin.ts - SuryaSiddha Admin & Mobile App Types

export interface BannerAdConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  ctaText: string;
  badge?: string;
}

export interface InlineAdConfig {
  enabled: boolean;
  type: 'custom' | 'adsense';
  title: string;
  body: string;
  ctaText: string;
  linkUrl: string;
  imageUrl?: string;
  adClient?: string;
  adSlot?: string;
}

export interface InterstitialPromoConfig {
  enabled: boolean;
  title: string;
  description: string;
  badge: string;
  imageUrl: string;
  linkUrl: string;
  ctaText: string;
  frequency: 'always' | 'once_per_day' | 'once_per_session';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'general' | 'festival' | 'muhurta' | 'panchang' | 'offer';
  read: boolean;
  linkUrl?: string;
}

export interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  type: 'info' | 'auspicious' | 'festival' | 'urgent';
  linkUrl?: string;
  badge?: string;
}

export interface AdminAppConfig {
  pin: string;
  ads: {
    topBanner: BannerAdConfig;
    inlineCard: InlineAdConfig;
    interstitial: InterstitialPromoConfig;
  };
  notifications: {
    announcement: AnnouncementBarConfig;
    dailyAlertsEnabled: boolean;
    dailyAlertTime: string;
    items: AppNotification[];
  };
  mobile: {
    showSplashScreen: boolean;
    splashDurationMs: number;
    enablePwaInstallPrompt: boolean;
    appBrandingTitle: string;
  };
}
