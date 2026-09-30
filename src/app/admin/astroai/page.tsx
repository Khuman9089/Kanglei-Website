'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Smartphone,
  Save,
  RotateCcw,
  Shield,
  Layers,
  MapPin,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  Sliders,
  DollarSign,
  Radio,
  Tv,
  Check,
  Search,
  Key,
  Flame,
  Globe
} from 'lucide-react';
import { AstroAIConfig, DEFAULT_ASTROAI_CONFIG } from '@/app/astroai/types/config';

export default function AstroAIAdminPage() {
  const [config, setConfig] = useState<AstroAIConfig>(DEFAULT_ASTROAI_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'admob' | 'maps' | 'app' | 'features'>('admob');

  // Place Autocomplete Test State
  const [testQuery, setTestQuery] = useState('Delhi');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testingMaps, setTestingMaps] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/astroai/settings');
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
      }
    } catch (e) {
      console.error('Error loading AstroAI config:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      const res = await fetch('/api/astroai/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save settings: ' + (data.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Save error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const fillTestAdMobIds = () => {
    setConfig((prev) => ({
      ...prev,
      admob: {
        ...prev.admob,
        appId: 'ca-app-pub-3940256099942544~3347511713',
        bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111',
        interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712',
        rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917',
      },
    }));
  };

  const runMapsTest = async () => {
    if (!testQuery) return;
    setTestingMaps(true);
    try {
      const res = await fetch(`/api/places/search?query=${encodeURIComponent(testQuery)}`);
      const data = await res.json();
      setTestResults(data.results || []);
    } catch (e) {
      console.error('Maps test error:', e);
    } finally {
      setTestingMaps(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 animate-spin text-indigo-400" />
          <span className="text-sm font-bold">Loading AstroVista Mobile Control Center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 font-sans antialiased p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-[#121829] rounded-3xl p-6 border border-indigo-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  AstroVista Mobile App Admin
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                  100% Free Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage AdMob ad spaces, Google Maps geocoding, features &amp; mobile release configuration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/astroai"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 shadow-sm transition-all"
            >
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Preview Live App</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>AstroAI configuration saved successfully! Live mobile app updated in real-time.</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#121829] rounded-2xl border border-indigo-950/60 overflow-x-auto text-xs font-bold">
          {[
            { id: 'admob', label: 'AdMob Ad Spaces & Monetization', icon: DollarSign },
            { id: 'maps', label: 'Google Maps & Place Search', icon: MapPin },
            { id: 'app', label: 'App Branding & 100% Free Perks', icon: Sparkles },
            { id: 'features', label: 'Core Features & AI Assistant', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ADMOB MONETIZATION SUITE */}
        {activeTab === 'admob' && (
          <div className="space-y-6">
            <div className="bg-[#121829] rounded-3xl p-6 border border-indigo-950/60 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span>Google AdMob Integration</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Monetize the 100% free astrology mobile app via banner, interstitial, and rewarded ad units.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fillTestAdMobIds}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold transition-all"
                  >
                    Insert Official Test IDs
                  </button>

                  <label className="flex items-center gap-2 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                    <input
                      type="checkbox"
                      checked={config.admob.enabled}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          admob: { ...prev.admob, enabled: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 accent-indigo-500 rounded"
                    />
                    <span className="text-xs font-bold text-white">Enable AdMob Ads</span>
                  </label>
                </div>
              </div>

              {/* Ad Unit IDs Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    AdMob App ID (Android / iOS)
                  </label>
                  <input
                    type="text"
                    value={config.admob.appId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        admob: { ...prev.admob, appId: e.target.value },
                      }))
                    }
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Your registered application identifier from Google AdMob console.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Banner Ad Unit ID (320x50 / Adaptive)
                  </label>
                  <input
                    type="text"
                    value={config.admob.bannerAdUnitId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        admob: { ...prev.admob, bannerAdUnitId: e.target.value },
                      }))
                    }
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Displayed cleanly below the Home dashboard &amp; Reports tab.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Interstitial Ad Unit ID (Full Screen Transition)
                  </label>
                  <input
                    type="text"
                    value={config.admob.interstitialAdUnitId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        admob: { ...prev.admob, interstitialAdUnitId: e.target.value },
                      }))
                    }
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Triggered during deep report generation or full Kundli inspection.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Rewarded Video Ad Unit ID (Optional Bonus)
                  </label>
                  <input
                    type="text"
                    value={config.admob.rewardedAdUnitId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        admob: { ...prev.admob, rewardedAdUnitId: e.target.value },
                      }))
                    }
                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Allows users to support the app or unlock instant premium downloads.
                  </span>
                </div>

              </div>

              {/* Placement & Frequency Controls */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400">
                  Ad Placement Toggles
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {[
                    { key: 'showOnDashboard', label: 'Show on Home Dashboard', desc: 'Banner below streak card' },
                    { key: 'showInReports', label: 'Show in Reports Tab', desc: 'Banner between report cards' },
                    { key: 'showInExplore', label: 'Show in Explore Tab', desc: 'Banner in transits section' },
                    { key: 'showInChat', label: 'Show in AI Chat Bottom', desc: 'Banner in chat assistant' },
                  ].map((p) => (
                    <label
                      key={p.key}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={(config.admob as any)[p.key]}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            admob: {
                              ...prev.admob,
                              [p.key]: e.target.checked,
                            },
                          }))
                        }
                        className="w-4 h-4 accent-indigo-500 rounded mt-0.5"
                      />
                      <div>
                        <strong className="text-white block">{p.label}</strong>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                          {p.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 flex items-center justify-between gap-4">
                  <div>
                    <strong className="text-xs text-white block">Interstitial Ad Frequency</strong>
                    <span className="text-[10px] text-slate-400">
                      Show a full-screen interstitial every N report transitions (Recommended: 2 or 3).
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={config.admob.adFrequencyReports}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          admob: {
                            ...prev.admob,
                            adFrequencyReports: parseInt(e.target.value) || 2,
                          },
                        }))
                      }
                      className="w-16 px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-center text-xs font-bold text-white"
                    />
                    <span className="text-xs text-slate-400">views</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: GOOGLE MAPS & PLACE SEARCH */}
        {activeTab === 'maps' && (
          <div className="space-y-6">
            <div className="bg-[#121829] rounded-3xl p-6 border border-indigo-950/60 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    <span>Google Maps Places &amp; Geocoding Setup</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Powers place name autocomplete and automatic latitude/longitude coordinates for exact Vedic charts.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    checked={config.googleMaps.enableAutocomplete}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        googleMaps: { ...prev.googleMaps, enableAutocomplete: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <span className="text-xs font-bold text-white">Enable Autocomplete</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Google Maps API Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={config.googleMaps.apiKey}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        googleMaps: { ...prev.googleMaps, apiKey: e.target.value },
                      }))
                    }
                    placeholder="AIzaSy..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                  <span>Leave blank to use the high-accuracy OpenStreetMap / Nominatim fallback automatically.</span>
                  <a
                    href="https://console.cloud.google.com/google/maps-apis"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Google Cloud Console</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Real-Time Live Autocomplete Test */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                  Live Autocomplete Tester
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    placeholder="Type city (e.g. Imphal, Delhi, London)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                  <button
                    onClick={runMapsTest}
                    disabled={testingMaps}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{testingMaps ? 'Searching...' : 'Test Place Search'}</span>
                  </button>
                </div>

                {testResults.length > 0 && (
                  <div className="space-y-1.5 pt-2 max-h-48 overflow-y-auto">
                    {testResults.map((r, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          <strong className="text-white">{r.name}</strong>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {r.latitude}° N, {r.longitude}° E ({r.source})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: APP BRANDING & 100% FREE PERKS */}
        {activeTab === 'app' && (
          <div className="space-y-6">
            <div className="bg-[#121829] rounded-3xl p-6 border border-indigo-950/60 shadow-xl space-y-6">
              
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>100% Free App Experience &amp; Announcements</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Ensure all astrology calculations, Vedic Kundli, and AI forecasts are 100% unlocked for users.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Application Name
                  </label>
                  <input
                    type="text"
                    value={config.appName}
                    onChange={(e) => setConfig((prev) => ({ ...prev, appName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) => setConfig((prev) => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Free App Mode Toggle */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/60 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-xs text-emerald-300 block flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Completely Free App Mode Active</span>
                  </strong>
                  <span className="text-[10px] text-slate-300 mt-0.5 block">
                    No paywalls, no paid tokens, no credit card required. All features unlocked and supported by non-intrusive AdMob banner ads.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.isFreeApp}
                  onChange={(e) => setConfig((prev) => ({ ...prev, isFreeApp: e.target.checked }))}
                  className="w-5 h-5 accent-emerald-500 rounded"
                />
              </div>

              {/* Announcement Banner Setup */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400">
                  App Notice / Daily Affirmation Announcement
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={config.announcement.badge}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          announcement: { ...prev.announcement, badge: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Title</label>
                    <input
                      type="text"
                      value={config.announcement.title}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          announcement: { ...prev.announcement, title: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Notice Message</label>
                  <textarea
                    rows={2}
                    value={config.announcement.message}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        announcement: { ...prev.announcement, message: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: CORE FEATURES & AI ASSISTANT */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="bg-[#121829] rounded-3xl p-6 border border-indigo-950/60 shadow-xl space-y-6">
              
              <div className="pb-4 border-b border-slate-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>Module &amp; Feature Flags</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Toggle individual calculation engines, AI assistant and tools for the mobile release.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'aiChatAssistant', label: 'AI Astrology Oracle (AstroGuru)', desc: 'Mobile chat assistant' },
                  { key: 'detailedKundli', label: 'Vedic Kundli Chart (D-1)', desc: 'North Indian diamond SVG' },
                  { key: 'dailyHoroscope', label: 'Daily Horoscope & Transits', desc: 'Calculated daily transits' },
                  { key: 'compatibility', label: 'Synastry & Compatibility', desc: 'Dual profile matcher' },
                  { key: 'tarot', label: 'Daily Arcana Tarot Deck', desc: 'Card flip simulation' },
                  { key: 'yearlyPrediction', label: '2026–2028 Yearly Forecast', desc: 'Quarterly timeline roadmap' },
                  { key: 'lifeCycles', label: '7-Year Life Cycle Shifts', desc: 'Saturn maturity chapters' },
                  { key: 'pdfExport', label: 'PDF Report Generation', desc: 'Client-side PDF compilation' },
                ].map((f) => (
                  <label
                    key={f.key}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 cursor-pointer hover:border-slate-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(config.features as any)[f.key]}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          features: {
                            ...prev.features,
                            [f.key]: e.target.checked,
                          },
                        }))
                      }
                      className="w-4 h-4 accent-indigo-500 rounded mt-0.5"
                    />
                    <div>
                      <strong className="text-xs text-white block">{f.label}</strong>
                      <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight">
                        {f.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
