// App.tsx - SuryaSiddha: Vedic Calendar Master Coordinator
import React, { useState, useMemo } from 'react';
import { UserBirthProfile, KundliData } from './types/astronomy';
import { computeCompleteKundli } from './utils/astronomy/engine';
import { StickyHeader } from './components/layout/StickyHeader';
import { BottomNavigation, MainTabType } from './components/navigation/BottomNavigation';
import { PanchangScreen } from './components/panchang/PanchangScreen';
import { KundliScreen } from './components/kundli/KundliScreen';
import { MuhurtaScreen } from './components/muhurta/MuhurtaScreen';
import { SettingsEphemerisScreen } from './components/settings/SettingsEphemerisScreen';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTabType>('panchang');

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-amber-100 selection:text-amber-950 flex flex-col font-sans antialiased">
      {/* 1. Sticky Top Navigation Header */}
      <StickyHeader
        profile={profile}
        panchang={calendarData.panchang}
        onLocationChange={handleLocationChange}
        onOpenKundliTab={() => setActiveTab('kundli')}
      />

      {/* 2. Main Screen View Canvas */}
      <main className="mx-auto max-w-5xl w-full px-3 py-4 sm:px-6 flex-1">
        {activeTab === 'panchang' && (
          <PanchangScreen
            currentDate={currentDate}
            profile={profile}
            calendarData={calendarData}
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
    </div>
  );
};
export default App;
