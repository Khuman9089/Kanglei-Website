// App.tsx - SuryaSiddha: Vedic Calendar Master Coordinator
import React, { useState, useMemo } from 'react';
import { UserBirthProfile, KundliData } from './types/astronomy';
import { AdminAppConfig } from './types/admin';
import { loadAdminConfig, saveAdminConfig } from './utils/adminStorage';
import { computeCompleteKundli } from './utils/astronomy/engine';
import { StickyHeader } from './components/layout/StickyHeader';
import { BottomNavigation, MainTabType } from './components/navigation/BottomNavigation';
import { PanchangScreen } from './components/panchang/PanchangScreen';
import { KundliScreen } from './components/kundli/KundliScreen';
import { MuhurtaScreen } from './components/muhurta/MuhurtaScreen';
import { SettingsEphemerisScreen } from './components/settings/SettingsEphemerisScreen';
import { SplashScreen } from './components/splash/SplashScreen';
import { NotificationCenterModal } from './components/notifications/NotificationCenterModal';
import { InterstitialPromoModal } from './components/ads/InterstitialPromoModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTabType>('panchang');

  // Loaded Configuration (Managed via separate /suryasiddha/admin.html portal)
  const [adminConfig, setAdminConfig] = useState<AdminAppConfig>(() => loadAdminConfig());
  const [showSplash, setShowSplash] = useState<boolean>(() => Boolean(adminConfig.mobile?.showSplashScreen));
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Observation date for Panchang & Muhurta screens
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // User Profile & Geographic Coordinates (defaults to New Delhi)
  const [profile, setProfile] = useState<UserBirthProfile>({
    name: 'Rajesh Kumar',
    gender: 'Male',
    dob: currentDate,
    tob: '06:00:00', // Sunrise epoch
    place: 'New Delhi, Delhi, India',
    lat: 28.6139,
    lng: 77.2090,
    timezone: 5.5,
  });

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-amber-100 selection:text-amber-950 flex flex-col font-sans antialiased">
      {/* Mobile Cosmic Splash Screen */}
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          durationMs={adminConfig.mobile?.splashDurationMs ?? 2200}
        />
      )}

      {/* 1. Sticky Top Navigation Header */}
      <StickyHeader
        profile={profile}
        panchang={calendarData.panchang}
        onLocationChange={handleLocationChange}
        onOpenKundliTab={() => setActiveTab('kundli')}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* 2. Main Screen View Canvas */}
      <main className="mx-auto max-w-5xl w-full px-3 py-4 sm:px-6 flex-1">
        {activeTab === 'panchang' && (
          <PanchangScreen
            currentDate={currentDate}
            profile={profile}
            calendarData={calendarData}
            adminConfig={adminConfig}
            onDateChange={setCurrentDate}
            onOpenKundli={() => setActiveTab('kundli')}
          />
        )}

        {activeTab === 'kundli' && (
          <KundliScreen
            profile={profile}
            kundliData={calendarData}
            onUpdateProfile={handleUpdateProfile}
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
      </main>

      {/* 3. Fixed Bottom Navigation Dock */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
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
