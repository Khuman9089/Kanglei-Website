// AdminApp.tsx - Dedicated Standalone SuryaSiddha Admin Management Portal
import React, { useState } from 'react';
import {
  ShieldCheck,
  Megaphone,
  Bell,
  Smartphone,
  Save,
  RotateCcw,
  CheckCircle,
  Plus,
  Send,
  Lock,
  KeyRound,
  ExternalLink,
  Layers,
  Radio,
  Trash2,
  Sliders,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { AdminAppConfig, AppNotification } from './types/admin';
import { loadAdminConfig, saveAdminConfig, DEFAULT_ADMIN_CONFIG } from './utils/adminStorage';

export const AdminApp: React.FC = () => {
  const [config, setConfig] = useState<AdminAppConfig>(() => loadAdminConfig());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'admob' | 'webads' | 'notifications' | 'mobile' | 'security'>('admob');
  const [formConfig, setFormConfig] = useState<AdminAppConfig>(config);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  // Broadcaster state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState<AppNotification['type']>('general');
  const [notifLink, setNotifLink] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === formConfig.pin || pinInput === 'admin123') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSave = () => {
    setConfig(formConfig);
    saveAdminConfig(formConfig);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all configurations, ads, and notification settings to factory defaults?')) {
      setFormConfig(DEFAULT_ADMIN_CONFIG);
      setConfig(DEFAULT_ADMIN_CONFIG);
      saveAdminConfig(DEFAULT_ADMIN_CONFIG);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMsg.trim()) return;

    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title: notifTitle.trim(),
      message: notifMsg.trim(),
      timestamp: new Date().toISOString(),
      type: notifType,
      read: false,
      linkUrl: notifLink.trim() || undefined,
    };

    const updatedConfig: AdminAppConfig = {
      ...formConfig,
      notifications: {
        ...formConfig.notifications,
        items: [newNotif, ...formConfig.notifications.items],
      },
    };

    setFormConfig(updatedConfig);
    setConfig(updatedConfig);
    saveAdminConfig(updatedConfig);

    setNotifTitle('');
    setNotifMsg('');
    setNotifLink('');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleDeleteNotification = (id: string) => {
    const updated = {
      ...formConfig,
      notifications: {
        ...formConfig.notifications,
        items: formConfig.notifications.items.filter((item) => item.id !== id),
      },
    };
    setFormConfig(updated);
    setConfig(updated);
    saveAdminConfig(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Admin Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-base sm:text-lg text-white tracking-wide">
                  SuryaSiddha Admin Console
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  SECRET PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ads Management • Google AdMob • Notification Broadcaster • Mobile Controls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/suryasiddha/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>View Main App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-xl border border-rose-900/50 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold transition"
              >
                Lock Portal
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col">
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-black text-white">Administrator Access Required</h2>
                <p className="text-xs text-slate-400 mt-1.5">
                  Enter your master security PIN to configure AdMob ads, mobile app settings, and notification broadcasts.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Enter PIN (Default: admin123)"
                    autoFocus
                    className="w-full h-12 px-4 text-center tracking-widest text-base font-mono font-bold rounded-2xl border border-slate-700 bg-slate-950 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                  />
                  <KeyRound className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                </div>

                {pinError && (
                  <p className="text-xs font-bold text-rose-400 animate-bounce">
                    Incorrect PIN. Please try again or use default: admin123
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/20 hover:opacity-90 transition cursor-pointer"
                >
                  Unlock Admin Dashboard
                </button>
              </form>

              <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-4">
                Default Master PIN: <span className="text-amber-400 font-mono font-bold">admin123</span>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6 flex-1 flex flex-col">
            {/* Nav Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
              <button
                onClick={() => setActiveTab('admob')}
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'admob'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Google AdMob Ads</span>
              </button>

              <button
                onClick={() => setActiveTab('webads')}
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'webads'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>Banner & Promo Ads</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications ({formConfig.notifications.items.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'mobile'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile App & Splash</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Security PIN</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              {/* TAB 1: GOOGLE ADMOB ADS */}
              {activeTab === 'admob' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse" />
                        <h3 className="text-base font-black text-white">Google AdMob Mobile Ads Engine</h3>
                      </div>
                      <p className="text-xs text-indigo-200 mt-1">
                        Enable AdMob monetization for Android & iOS App builds and hybrid mobile WebViews.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formConfig.ads.admob?.enabled ?? false}
                        onChange={(e) =>
                          setFormConfig({
                            ...formConfig,
                            ads: {
                              ...formConfig.ads,
                              admob: {
                                ...formConfig.ads.admob,
                                enabled: e.target.checked,
                              },
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500" />
                    </label>
                  </div>

                  {/* AdMob Test Mode Indicator */}
                  <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black text-white">Google Test Mode (Safe Testing)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Use Google official sample Unit IDs during testing to prevent AdMob account policy violations.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formConfig.ads.admob?.testMode ?? true}
                        onChange={(e) =>
                          setFormConfig({
                            ...formConfig,
                            ads: {
                              ...formConfig.ads,
                              admob: {
                                ...formConfig.ads.admob,
                                testMode: e.target.checked,
                              },
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                    </label>
                  </div>

                  {/* App IDs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-2">
                      <label className="block text-xs font-bold text-slate-300">Android AdMob App ID</label>
                      <input
                        type="text"
                        value={formConfig.ads.admob?.appIdAndroid || ''}
                        onChange={(e) =>
                          setFormConfig({
                            ...formConfig,
                            ads: {
                              ...formConfig.ads,
                              admob: { ...formConfig.ads.admob, appIdAndroid: e.target.value },
                            },
                          })
                        }
                        placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
                        className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-indigo-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-500">Configured in AndroidManifest.xml / App settings</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-2">
                      <label className="block text-xs font-bold text-slate-300">iOS AdMob App ID</label>
                      <input
                        type="text"
                        value={formConfig.ads.admob?.appIdIos || ''}
                        onChange={(e) =>
                          setFormConfig({
                            ...formConfig,
                            ads: {
                              ...formConfig.ads,
                              admob: { ...formConfig.ads.admob, appIdIos: e.target.value },
                            },
                          })
                        }
                        placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
                        className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-indigo-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-500">Configured in Info.plist (GADApplicationIdentifier)</p>
                    </div>
                  </div>

                  {/* Ad Units: Banner, Interstitial, Rewarded */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      AdMob Unit Identifiers
                    </h4>

                    {/* Banner Units */}
                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Android Banner Unit ID
                        </label>
                        <input
                          type="text"
                          value={formConfig.ads.admob?.bannerAdUnitIdAndroid || ''}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                admob: { ...formConfig.ads.admob, bannerAdUnitIdAndroid: e.target.value },
                              },
                            })
                          }
                          placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz"
                          className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          iOS Banner Unit ID
                        </label>
                        <input
                          type="text"
                          value={formConfig.ads.admob?.bannerAdUnitIdIos || ''}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                admob: { ...formConfig.ads.admob, bannerAdUnitIdIos: e.target.value },
                              },
                            })
                          }
                          placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz"
                          className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Interstitial Units */}
                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Android Interstitial Unit ID
                        </label>
                        <input
                          type="text"
                          value={formConfig.ads.admob?.interstitialAdUnitIdAndroid || ''}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                admob: { ...formConfig.ads.admob, interstitialAdUnitIdAndroid: e.target.value },
                              },
                            })
                          }
                          placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/wwwwwwwwww"
                          className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          iOS Interstitial Unit ID
                        </label>
                        <input
                          type="text"
                          value={formConfig.ads.admob?.interstitialAdUnitIdIos || ''}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                admob: { ...formConfig.ads.admob, interstitialAdUnitIdIos: e.target.value },
                              },
                            })
                          }
                          placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/wwwwwwwwww"
                          className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Rewarded Units */}
                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Android Rewarded Ad Unit ID
                        </label>
                        <input
                          type="text"
                          value={formConfig.ads.admob?.rewardedAdUnitIdAndroid || ''}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                admob: { ...formConfig.ads.admob, rewardedAdUnitIdAndroid: e.target.value },
                              },
                            })
                          }
                          placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/vvvvvvvvvv"
                          className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          iOS Rewarded Ad Unit ID
                        </label>
                        <input
                          type="text"
                          value={formConfig.ads.admob?.rewardedAdUnitIdIos || ''}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                admob: { ...formConfig.ads.admob, rewardedAdUnitIdIos: e.target.value },
                              },
                            })
                          }
                          placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/vvvvvvvvvv"
                          className="w-full h-10 px-3.5 text-xs font-mono rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: WEB BANNER & PROMO ADS */}
              {activeTab === 'webads' && (
                <div className="space-y-6">
                  {/* Top Banner */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-white">Top Promotional Banner Ad</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Displayed prominently below header</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formConfig.ads.topBanner.enabled}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                topBanner: { ...formConfig.ads.topBanner, enabled: e.target.checked },
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Headline</label>
                        <input
                          type="text"
                          value={formConfig.ads.topBanner.title}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                topBanner: { ...formConfig.ads.topBanner, title: e.target.value },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={formConfig.ads.topBanner.subtitle}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                topBanner: { ...formConfig.ads.topBanner, subtitle: e.target.value },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Target Link URL</label>
                        <input
                          type="text"
                          value={formConfig.ads.topBanner.linkUrl}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                topBanner: { ...formConfig.ads.topBanner, linkUrl: e.target.value },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">CTA Button Text</label>
                        <input
                          type="text"
                          value={formConfig.ads.topBanner.ctaText}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                topBanner: { ...formConfig.ads.topBanner, ctaText: e.target.value },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inline Card Ad */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-white">In-Feed Card Ad</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Supports Custom Promos, Google AdSense, or AdMob</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formConfig.ads.inlineCard.enabled}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                inlineCard: { ...formConfig.ads.inlineCard, enabled: e.target.checked },
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Ad Format Mode</label>
                        <select
                          value={formConfig.ads.inlineCard.type}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                inlineCard: {
                                  ...formConfig.ads.inlineCard,
                                  type: e.target.value as 'custom' | 'adsense' | 'admob',
                                },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white font-medium"
                        >
                          <option value="custom">Custom Branded Promo Card</option>
                          <option value="adsense">Google AdSense Slot</option>
                          <option value="admob">Google AdMob Native Banner</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={formConfig.ads.inlineCard.title}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                inlineCard: { ...formConfig.ads.inlineCard, title: e.target.value },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interstitial Promo Popups */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-white">Fullscreen Interstitial Promo</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Special offers & major puja event bookings</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formConfig.ads.interstitial.enabled}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                interstitial: { ...formConfig.ads.interstitial, enabled: e.target.checked },
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Headline</label>
                        <input
                          type="text"
                          value={formConfig.ads.interstitial.title}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                interstitial: { ...formConfig.ads.interstitial, title: e.target.value },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Frequency</label>
                        <select
                          value={formConfig.ads.interstitial.frequency}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                interstitial: {
                                  ...formConfig.ads.interstitial,
                                  frequency: e.target.value as any,
                                },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        >
                          <option value="once_per_session">Once Per User Session</option>
                          <option value="once_per_day">Once Per Day</option>
                          <option value="always">Every Launch</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NOTIFICATIONS & BROADCASTS */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {/* Top Marquee Announcement */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-white">Top Marquee Announcement Bar</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Live ticker displayed across the top of the app</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formConfig.notifications.announcement.enabled}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              notifications: {
                                ...formConfig.notifications,
                                announcement: {
                                  ...formConfig.notifications.announcement,
                                  enabled: e.target.checked,
                                },
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Ticker Message</label>
                        <input
                          type="text"
                          value={formConfig.notifications.announcement.text}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              notifications: {
                                ...formConfig.notifications,
                                announcement: {
                                  ...formConfig.notifications.announcement,
                                  text: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Style Theme</label>
                        <select
                          value={formConfig.notifications.announcement.type}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              notifications: {
                                ...formConfig.notifications,
                                announcement: {
                                  ...formConfig.notifications.announcement,
                                  type: e.target.value as any,
                                },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        >
                          <option value="auspicious">Auspicious Golden (Shubh)</option>
                          <option value="festival">Festive Purple (Parva)</option>
                          <option value="urgent">Urgent Amber (Alert)</option>
                          <option value="info">Informational Blue</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Broadcast New Notification */}
                  <form onSubmit={handleSendNotification} className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-4">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-extrabold text-white">Broadcast New Push Alert</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Alert Title</label>
                        <input
                          type="text"
                          value={notifTitle}
                          onChange={(e) => setNotifTitle(e.target.value)}
                          placeholder="e.g. Shani Pradosh Vrat Today"
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Category</label>
                        <select
                          value={notifType}
                          onChange={(e) => setNotifType(e.target.value as any)}
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        >
                          <option value="general">General Alert</option>
                          <option value="festival">Festival / Vrat</option>
                          <option value="muhurta">Muhurta / Choghadiya</option>
                          <option value="panchang">Daily Panchang</option>
                          <option value="offer">Special Offer</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">Message Content</label>
                        <textarea
                          rows={2}
                          value={notifMsg}
                          onChange={(e) => setNotifMsg(e.target.value)}
                          placeholder="Provide auspicious timings, remedies or festival guidelines..."
                          className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!notifTitle.trim() || !notifMsg.trim()}
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
                      >
                        Send Broadcast
                      </button>
                    </div>
                  </form>

                  {/* Active Notification History */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-400">
                      Active In-App Notification Center Items ({formConfig.notifications.items.length})
                    </h5>

                    {formConfig.notifications.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{item.title}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 uppercase">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-1">{item.message}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteNotification(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition"
                          title="Delete Alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MOBILE APP & SPLASH SCREEN */}
              {activeTab === 'mobile' && (
                <div className="space-y-6">
                  {/* Splash Screen */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-white">Cosmic Mobile Splash Screen</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Shows animated Surya chakra on app launch to provide a native mobile app feel
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formConfig.mobile.showSplashScreen}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              mobile: {
                                ...formConfig.mobile,
                                showSplashScreen: e.target.checked,
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">
                          Splash Duration: {formConfig.mobile.splashDurationMs} ms ({((formConfig.mobile.splashDurationMs || 2000) / 1000).toFixed(1)}s)
                        </label>
                        <input
                          type="range"
                          min="1000"
                          max="5000"
                          step="200"
                          value={formConfig.mobile.splashDurationMs || 2200}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              mobile: {
                                ...formConfig.mobile,
                                splashDurationMs: parseInt(e.target.value, 10),
                              },
                            })
                          }
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">App Branding Title</label>
                        <input
                          type="text"
                          value={formConfig.mobile.appBrandingTitle || 'SuryaSiddha'}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              mobile: {
                                ...formConfig.mobile,
                                appBrandingTitle: e.target.value,
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-xl border border-slate-800 bg-slate-900 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SECURITY PIN */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-md">
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-4">
                    <h4 className="text-sm font-extrabold text-white">Change Master Admin PIN</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">New Security PIN</label>
                      <input
                        type="text"
                        value={formConfig.pin}
                        onChange={(e) => setFormConfig({ ...formConfig, pin: e.target.value })}
                        className="w-full h-11 px-4 text-center font-mono font-bold tracking-widest text-sm rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Floating Action Bar */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center gap-3">
                {savedToast && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-in fade-in">
                    <CheckCircle className="w-4 h-4" />
                    <span>Settings Saved Successfully!</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/20 hover:opacity-90 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminApp;
