export interface AstroAIConfig {
  appName: string;
  tagline: string;
  isFreeApp: boolean;
  
  // AdMob Settings
  admob: {
    enabled: boolean;
    appId: string;
    bannerAdUnitId: string;
    interstitialAdUnitId: string;
    rewardedAdUnitId: string;
    showOnDashboard: boolean;
    showInReports: boolean;
    showInExplore: boolean;
    showInChat: boolean;
    adFrequencyReports: number;
  };

  // Google Maps / Location Settings
  googleMaps: {
    enabled: boolean;
    apiKey: string;
    enableAutocomplete: boolean;
  };

  // Features Management
  features: {
    aiChatAssistant: boolean;
    dailyHoroscope: boolean;
    detailedKundli: boolean;
    compatibility: boolean;
    tarot: boolean;
    yearlyPrediction: boolean;
    lifeCycles: boolean;
    pdfExport: boolean;
  };

  // Daily Cosmic Message & Announcements
  announcement: {
    enabled: boolean;
    title: string;
    message: string;
    badge: string;
  };

  updatedAt: string;
}

export const DEFAULT_ASTROAI_CONFIG: AstroAIConfig = {
  appName: 'AstroVista',
  tagline: 'Your Life • Your Stars • Your Future',
  isFreeApp: true,
  
  admob: {
    enabled: true,
    appId: 'ca-app-pub-3940256099942544~3347511713', // Google AdMob Test App ID
    bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111', // Test Banner ID
    interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712', // Test Interstitial ID
    rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917', // Test Rewarded ID
    showOnDashboard: true,
    showInReports: true,
    showInExplore: true,
    showInChat: false,
    adFrequencyReports: 2,
  },

  googleMaps: {
    enabled: true,
    apiKey: '',
    enableAutocomplete: true,
  },

  features: {
    aiChatAssistant: true,
    dailyHoroscope: true,
    detailedKundli: true,
    compatibility: true,
    tarot: true,
    yearlyPrediction: true,
    lifeCycles: true,
    pdfExport: true,
  },

  announcement: {
    enabled: true,
    title: 'Welcome to AstroVista 100% Free Edition',
    message: 'All detailed Kundli charts, 2026 predictions & AI astrology readings are completely free.',
    badge: 'FREE FOREVER',
  },

  updatedAt: new Date().toISOString(),
};
