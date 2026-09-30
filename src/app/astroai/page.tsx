'use client';

import React, { useState, useEffect } from 'react';
import { BirthProfile } from './types';
import { calculateZodiacSign } from './services/astrologyEngine';

import { DesktopStudio } from './components/DesktopStudio';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { ShareModal } from './components/ShareModal';
import { PremiumModal } from './components/PremiumModal';
import { ProfileModal } from './components/ProfileModal';
import { AstroGuruDrawer } from './components/AstroGuruDrawer';
import { SettingsDrawer } from './components/SettingsDrawer';
import { Monitor, Smartphone } from 'lucide-react';

// Default Demo Profiles
const DEFAULT_PROFILES: BirthProfile[] = [
  {
    id: 'profile_rahul_1',
    name: 'Rahul',
    relationship: 'Self',
    dateOfBirth: '1995-08-15',
    timeOfBirth: '10:30',
    birthPlace: 'Delhi, India',
    profileType: 'detailed',
    avatarColor: 'bg-indigo-600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile_priya_2',
    name: 'Priya',
    relationship: 'Partner',
    dateOfBirth: '1998-01-22',
    profileType: 'quick',
    avatarColor: 'bg-pink-600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile_mom_3',
    name: 'Mom',
    relationship: 'Mother',
    dateOfBirth: '1970-05-02',
    profileType: 'quick',
    avatarColor: 'bg-amber-600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile_dad_4',
    name: 'Dad',
    relationship: 'Father',
    dateOfBirth: '1968-11-14',
    profileType: 'quick',
    avatarColor: 'bg-blue-600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function AstroVistaApp() {
  // Desktop view switch (desktop dashboard vs mobile preview)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Mobile app starts directly on the Splash screen
  const [mobileScreen, setMobileScreen] = useState<string>('splash');

  // Profiles State
  const [profiles, setProfiles] = useState<BirthProfile[]>(DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('profile_rahul_1');

  // Active profile object
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILES[0];
  const zodiac = calculateZodiacSign(activeProfile.dateOfBirth);

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAstroGuruOpen, setIsAstroGuruOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<BirthProfile | null>(null);

  // Load saved profiles from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('astrovista_profiles');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProfiles(parsed);
            setActiveProfileId(parsed[0].id);
          }
        }
      } catch (e) {
        console.error('LocalStorage load error', e);
      }
    }
  }, []);

  const saveProfilesToStorage = (updated: BirthProfile[]) => {
    setProfiles(updated);
    try {
      localStorage.setItem('astrovista_profiles', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleSaveProfile = (newProfile: BirthProfile) => {
    const exists = profiles.some((p) => p.id === newProfile.id);
    let updated: BirthProfile[];
    if (exists) {
      updated = profiles.map((p) => (p.id === newProfile.id ? newProfile : p));
    } else {
      updated = [...profiles, newProfile];
    }
    saveProfilesToStorage(updated);
    setActiveProfileId(newProfile.id);
  };

  const handleDeleteProfile = (id: string) => {
    const filtered = profiles.filter((p) => p.id !== id);
    if (filtered.length === 0) {
      alert('Cannot delete all profiles. At least one profile must exist.');
      return;
    }
    saveProfilesToStorage(filtered);
    if (activeProfileId === id) {
      setActiveProfileId(filtered[0].id);
    }
  };

  // Sign out handler
  const handleSignOut = () => {
    try {
      localStorage.removeItem('astrovista_profiles');
      localStorage.removeItem('astrovista_has_onboarded');
    } catch (e) {}
    setProfiles(DEFAULT_PROFILES);
    setActiveProfileId(DEFAULT_PROFILES[0].id);
    setMobileScreen('splash');
  };

  return (
    <div className="min-h-screen bg-[#070A18] text-[#1F2937] font-sans antialiased selection:bg-[#667EEA] selection:text-white">
      {/* Modals & Slide-out Drawers */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={activeProfile}
        zodiac={zodiac}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />

      <AstroGuruDrawer
        isOpen={isAstroGuruOpen}
        onClose={() => setIsAstroGuruOpen(false)}
        profile={activeProfile}
        zodiac={zodiac}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        onDelete={handleDeleteProfile}
        initialProfile={editingProfile}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* ================================================================ */}
      {/* 1. DESKTOP VIEWPORT (hidden on mobile, active on desktop >= md)  */}
      {/* ================================================================ */}
      <div className="hidden md:block min-h-screen">
        {/* Floating View Mode Switcher on Desktop */}
        <div className="fixed top-3 right-4 z-50 flex items-center bg-slate-900/90 backdrop-blur-md border border-white/15 p-1 rounded-2xl shadow-2xl text-xs font-bold text-white">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop Studio</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App View</span>
          </button>
        </div>

        {viewMode === 'desktop' ? (
          <DesktopStudio
            activeProfile={activeProfile}
            profiles={profiles}
            onSelectProfile={(id) => setActiveProfileId(id)}
            onEditProfile={(p) => {
              setEditingProfile(p);
              setIsProfileModalOpen(true);
            }}
            onAddProfile={() => {
              setEditingProfile(null);
              setIsProfileModalOpen(true);
            }}
            onOpenGuru={() => setIsAstroGuruOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        ) : (
          <div className="py-8 flex justify-center items-center min-h-screen bg-[#070A18]">
            <div className="w-[390px] h-[844px] rounded-[48px] shadow-[0_0_80px_rgba(0,0,0,0.9)] border-[8px] border-slate-900 overflow-hidden relative">
              <MobileDeviceFrame
                currentScreen={mobileScreen}
                onNavigate={(s) => setMobileScreen(s)}
                profiles={profiles}
                activeProfile={activeProfile}
                onSelectProfile={(id) => setActiveProfileId(id)}
                onAddProfile={() => {
                  setEditingProfile(null);
                  setIsProfileModalOpen(true);
                }}
                onEditProfile={(p) => {
                  setEditingProfile(p);
                  setIsProfileModalOpen(true);
                }}
                onOpenGuru={() => setIsAstroGuruOpen(true)}
                onOpenShare={() => setIsShareModalOpen(true)}
                onOpenPremium={() => setIsPremiumModalOpen(true)}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* 2. NATIVE MOBILE VIEWPORT (mobile screen < md, 100% full screen) */}
      {/* ================================================================ */}
      <div className="block md:hidden fixed inset-0 w-full h-[100dvh] overflow-hidden bg-[#0A0E27]">
        <MobileDeviceFrame
          currentScreen={mobileScreen}
          onNavigate={(s) => setMobileScreen(s)}
          profiles={profiles}
          activeProfile={activeProfile}
          onSelectProfile={(id) => setActiveProfileId(id)}
          onAddProfile={() => {
            setEditingProfile(null);
            setIsProfileModalOpen(true);
          }}
          onEditProfile={(p) => {
            setEditingProfile(p);
            setIsProfileModalOpen(true);
          }}
          onOpenGuru={() => setIsAstroGuruOpen(true)}
          onOpenShare={() => setIsShareModalOpen(true)}
          onOpenPremium={() => setIsPremiumModalOpen(true)}
          onSignOut={handleSignOut}
        />
      </div>
    </div>
  );
}
