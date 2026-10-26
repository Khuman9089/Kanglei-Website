// App.tsx - SuryaSiddha: Vedic Calendar Master Coordinator
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { UserBirthProfile, KundliData } from './types/astronomy';
import { AdminAppConfig } from './types/admin';
import { loadAdminConfig, saveAdminConfig, fetchRemoteAdminConfig } from './utils/adminStorage';
import { computeCompleteKundli } from './utils/astronomy/engine';
import { StickyHeader } from './components/layout/StickyHeader';
import { BottomNavigation, MainTabType } from './components/navigation/BottomNavigation';
import { HomeScreen } from './components/home/HomeScreen';
import { CalendarScreen } from './components/calendar/CalendarScreen';
import { PanchangScreen } from './components/panchang/PanchangScreen';
import { KundliScreen } from './components/kundli/KundliScreen';
import { MuhurtaScreen } from './components/muhurta/MuhurtaScreen';
import { SettingsEphemerisScreen } from './components/settings/SettingsEphemerisScreen';
import { SplashScreen } from './components/splash/SplashScreen';
import { NotificationCenterModal } from './components/notifications/NotificationCenterModal';
import { InterstitialPromoModal } from './components/ads/InterstitialPromoModal';
import { AdMobBannerAd } from './components/ads/AdMobBannerAd';

const PROFILE_STORAGE_KEY = 'suryasiddha_user_profile_v1';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTabType>('home');
  const [kundliSubTab, setKundliSubTab] = useState<'chart' | 'planets' | 'dasha' | 'doshas' | 'matching'>('chart');
  const mainScrollRef = useRef<HTMLElement>(null);

  // Loaded Configuration (Managed via separate /suryasiddha/admin.html portal & synced with cloud API)
  const [adminConfig, setAdminConfig] = useState<AdminAppConfig>(() => loadAdminConfig());
  const [showSplash, setShowSplash] = useState<boolean>(() => Boolean(adminConfig.mobile?.showSplashScreen));
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // App Language Toggle: Bengali ('bn') or English ('en')
  const [language, setLanguage] = useState<'bn' | 'en'>(() => {
    try {
      const saved = localStorage.getItem('suryasiddha_language');
      if (saved === 'bn' || saved === 'en') return saved;
    } catch (e) {}
    return 'bn';
  });

  const handleToggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === 'bn' ? 'en' : 'bn';
      try {
        localStorage.setItem('suryasiddha_language', next);
      } catch (e) {}
      return next;
    });
  }, []);

  // Synchronize configuration from central cloud server and cross-tab storage
  useEffect(() => {
    fetchRemoteAdminConfig().then((remote) => {
      if (remote) {
        setAdminConfig(remote);
      }
    });

    const handleConfigUpdate = (e: any) => {
      if (e.detail) {
        setAdminConfig(e.detail);
      }
    };
    window.addEventListener('suryasiddha_config_updated', handleConfigUpdate);

    // Cross-tab synchronization when admin changes in another tab
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'suryasiddha_admin_config_v1' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setAdminConfig((prev) => ({
            ...prev,
            ...parsed,
            ads: { ...prev.ads, ...(parsed.ads || {}) },
            notifications: { ...prev.notifications, ...(parsed.notifications || {}) },
            mobile: { ...prev.mobile, ...(parsed.mobile || {}) },
          }));
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    const handleRefetch = () => {
      fetchRemoteAdminConfig().then((remote) => {
        if (remote) setAdminConfig(remote);
      });
    };
    window.addEventListener('online', handleRefetch);
    window.addEventListener('focus', handleRefetch);

    return () => {
      window.removeEventListener('suryasiddha_config_updated', handleConfigUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('online', handleRefetch);
      window.removeEventListener('focus', handleRefetch);
    };
  }, []);

  // Observation date for Panchang & Muhurta screens
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // User Profile & Geographic Coordinates (defaults to New Delhi, persisted locally)
  const [profile, setProfile] = useState<UserBirthProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.place && typeof parsed.lat === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      // Local storage unreadable or unavailable
    }
    return {
      name: 'Rajesh Kumar',
      gender: 'Male',
      dob: new Date().toISOString().split('T')[0],
      tob: '06:00:00', // Sunrise epoch
      place: 'New Delhi, Delhi, India',
      lat: 28.6139,
      lng: 77.2090,
      timezone: 5.5,
    };
  });

  // Persist profile to localStorage whenever it changes for offline continuity
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      // Storage quota or sandboxed
    }
  }, [profile]);

  // Synchronize activeTab with browser history to enable native Android Back button navigation
  const handleTabChange = useCallback((newTab: MainTabType) => {
    setActiveTab((currentTab) => {
      if (newTab === currentTab) return currentTab;
      try {
        window.history.pushState({ tab: newTab }, '', `#${newTab}`);
      } catch (e) {}
      return newTab;
    });
  }, []);

  const handleNavigate = useCallback((newTab: MainTabType, subTab?: string) => {
    if (newTab === 'kundli' && subTab) {
      setKundliSubTab(subTab as any);
    }
    handleTabChange(newTab);
  }, [handleTabChange]);

  // Listen to popstate event (Hardware Back button / Gesture navigation)
  useEffect(() => {
    // Ensure initial history state is established
    try {
      if (!window.history.state || !window.history.state.tab) {
        window.history.replaceState({ tab: 'home' }, '', '#home');
      }
    } catch (e) {}

    const handlePopState = (event: PopStateEvent) => {
      // 1. If notification modal is open, close it on back press
      if (isNotificationsOpen) {
        setIsNotificationsOpen(false);
        return;
      }

      // 2. Return to previous tab if state exists, or fallback to home
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isNotificationsOpen]);

  // Reset scroll position to top whenever active tab changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const handleOpenNotifications = () => {
    try {
      window.history.pushState({ modal: 'notifications', tab: activeTab }, '', '#notifications');
    } catch (e) {}
    setIsNotificationsOpen(true);
  };

  const handleCloseNotifications = () => {
    setIsNotificationsOpen(false);
    try {
      if (window.location.hash === '#notifications') {
        window.history.back();
      }
    } catch (e) {}
  };

  // Master Astronomical Engine: Calculate Daily Panchang and Kundli Data
  const calendarData: KundliData = useMemo(() => {
    const updatedProfile: UserBirthProfile = {
      ...profile,
      dob: currentDate,
    };
    return computeCompleteKundli(updatedProfile);
  }, [profile, currentDate]);

  const handleLocationChange = (loc: {
    place: string;
    lat: number;
    lng: number;
    timezone: number;
  }) => {
    setProfile((prev) => ({
      ...prev,
      place: loc.place,
      lat: loc.lat,
      lng: loc.lng,
      timezone: loc.timezone,
    }));
  };

  const handleUpdateProfile = (newProfile: UserBirthProfile) => {
    setProfile(newProfile);
    if (newProfile.dob && activeTab === 'panchang') {
      setCurrentDate(newProfile.dob);
    }
  };

  const handleSaveConfig = (newConfig: AdminAppConfig) => {
    setAdminConfig(newConfig);
    saveAdminConfig(newConfig);
  };

  const handleMarkAllRead = () => {
    const updated: AdminAppConfig = {
      ...adminConfig,
      notifications: {
        ...adminConfig.notifications,
        items: adminConfig.notifications.items.map((item) => ({ ...item, read: true })),
      },
    };
    handleSaveConfig(updated);
  };

  const handleClearAllNotifications = () => {
    const updated: AdminAppConfig = {
      ...adminConfig,
      notifications: {
        ...adminConfig.notifications,
        items: [],
      },
    };
    handleSaveConfig(updated);
  };

  const unreadNotificationsCount = useMemo(() => {
    return adminConfig.notifications.items.filter((item) => !item.read).length;
  }, [adminConfig.notifications.items]);

  return (
    <div className="h-[100dvh] h-screen w-full bg-[#fff8f4] text-[#1e1b18] selection:bg-[#9c1b1b] selection:text-white flex flex-col font-sans antialiased overflow-hidden">
      {/* Mobile Cosmic Splash Screen */}
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          durationMs={adminConfig.mobile?.splashDurationMs ?? 2200}
        />
      )}

      {/* 1. Top Navigation Header (Anchored at top, safe area padding) */}
      <StickyHeader
        profile={profile}
        panchang={calendarData.panchang}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onLocationChange={handleLocationChange}
        onOpenKundliTab={() => handleTabChange('kundli')}
        onOpenNotifications={handleOpenNotifications}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* 2. Main Screen View Canvas (Dedicated middle scrollable area) */}
      <main
        ref={mainScrollRef}
        className="flex-1 w-full overflow-y-auto overflow-x-hidden overscroll-contain px-3 py-4 sm:px-6"
      >
        <div className="mx-auto max-w-5xl w-full">
          {activeTab === 'home' && (
            <HomeScreen
              currentDate={currentDate}
              profile={profile}
              calendarData={calendarData}
              adminConfig={adminConfig}
              language={language}
              onNavigate={handleNavigate}
              onDateChange={setCurrentDate}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarScreen
              currentDate={currentDate}
              profile={profile}
              calendarData={calendarData}
              adminConfig={adminConfig}
              language={language}
              onDateChange={setCurrentDate}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'panchang' && (
            <PanchangScreen
              currentDate={currentDate}
              profile={profile}
              calendarData={calendarData}
              adminConfig={adminConfig}
              onDateChange={setCurrentDate}
              onOpenKundli={() => handleNavigate('kundli', 'chart')}
            />
          )}

          {activeTab === 'kundli' && (
            <KundliScreen
              profile={profile}
              kundliData={calendarData}
              onUpdateProfile={handleUpdateProfile}
              initialSubTab={kundliSubTab}
            />
          )}

          {activeTab === 'muhurta' && (
            <MuhurtaScreen
              currentDate={currentDate}
              profile={profile}
              calendarData={calendarData}
              onDateChange={setCurrentDate}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsEphemerisScreen
              profile={profile}
              calendarData={calendarData}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </div>
      </main>

      {/* 2c. AdMob Ad Unit (Anchored just above the bottom menu) */}
      {Boolean(
        adminConfig.ads?.admob &&
        (adminConfig.ads.admob.testMode ||
          (adminConfig.ads.admob.enabled && Boolean(adminConfig.ads.topBanner?.enabled || adminConfig.ads.inlineCard?.enabled)))
      ) && (
        <div className="w-full shrink-0 z-30 bg-[#fff8f4]/95 backdrop-blur-md border-t border-[#e6d5b8]/70 px-2 sm:px-4 py-1">
          <div className="max-w-md mx-auto">
            <AdMobBannerAd
              config={adminConfig.ads.admob}
              placement="bottom"
              allowCustomFallback={Boolean(adminConfig.ads?.topBanner?.enabled || adminConfig.ads?.inlineCard?.enabled)}
            />
          </div>
        </div>
      )}

      {/* 3. Bottom Navigation Dock (Anchored at bottom, cannot move on scroll) */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        language={language}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={handleCloseNotifications}
        notifications={adminConfig.notifications.items}
        onMarkAllRead={handleMarkAllRead}
        onClearAll={handleClearAllNotifications}
      />

      {/* Fullscreen Interstitial Promo Modal */}
      <InterstitialPromoModal
        config={adminConfig.ads.interstitial}
      />
    </div>
  );
};

export default App;

