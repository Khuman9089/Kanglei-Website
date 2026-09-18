// components/admin/AdminModal.tsx - Comprehensive Admin Management Panel
import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  Megaphone,
  Bell,
  Smartphone,
  Save,
  RotateCcw,
  CheckCircle,
  Plus,
  Send,
  Lock,
  Eye,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { AdminAppConfig, AppNotification } from '../../types/admin';
import { DEFAULT_ADMIN_CONFIG } from '../../utils/adminStorage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AdminAppConfig;
  onSave: (newConfig: AdminAppConfig) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'ads' | 'notifications' | 'mobile'>('ads');
  const [formConfig, setFormConfig] = useState<AdminAppConfig>(config);
  const [savedToast, setSavedToast] = useState(false);

  // New notification broadcaster state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState<AppNotification['type']>('panchang');
  const [notifLink, setNotifLink] = useState('');

  if (!isOpen) return null;

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === formConfig.pin || pinInput.trim() === 'admin123') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSave = () => {
    onSave(formConfig);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all ads, notifications, and mobile settings to default?')) {
      setFormConfig(DEFAULT_ADMIN_CONFIG);
      onSave(DEFAULT_ADMIN_CONFIG);
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMsg.trim()) return;

    const newNotification: AppNotification = {
      id: `notif_${Date.now()}`,
      title: notifTitle.trim(),
      message: notifMsg.trim(),
      timestamp: new Date().toISOString(),
      type: notifType,
      read: false,
      linkUrl: notifLink.trim() || undefined,
    };

    const updated = {
      ...formConfig,
      notifications: {
        ...formConfig.notifications,
        items: [newNotification, ...formConfig.notifications.items],
      },
    };

    setFormConfig(updated);
    onSave(updated);
    setNotifTitle('');
    setNotifMsg('');
    setNotifLink('');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-5 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-base sm:text-lg leading-tight">
                  SuryaSiddha Admin Portal
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 text-[9px] font-black uppercase">
                  MASTER
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Manage Ads, Notifications & Mobile Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Authentication Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 ring-8 ring-amber-50">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-lg font-black text-slate-900">Admin Security Access</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Enter your Admin PIN to manage advertisements, push notifications, and mobile app configuration. (Default PIN: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-700">admin123</code>)
            </p>

            <form onSubmit={handleVerifyPin} className="mt-5 w-full max-w-xs space-y-3">
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter PIN (admin123)"
                  autoFocus
                  className="w-full h-11 px-4 text-center tracking-widest text-sm font-mono font-bold rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              {pinError && (
                <p className="text-xs font-bold text-rose-600">Incorrect PIN. Please try again.</p>
              )}

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 hover:scale-[1.01] transition-transform cursor-pointer"
              >
                Unlock Admin Controls
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="bg-slate-100/80 p-1.5 border-b border-slate-200 flex gap-1">
              <button
                onClick={() => setActiveTab('ads')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ads'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                <span>Ads Management</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-purple-600" />
                <span>Notifications</span>
              </button>

              <button
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'mobile'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mobile & App</span>
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: ADS MANAGEMENT */}
              {activeTab === 'ads' && (
                <div className="space-y-6">
                  {/* 1. Top Banner Ad */}
                  <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <h4 className="text-sm font-extrabold text-slate-900">Top Header Banner Ad</h4>
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
                                topBanner: {
                                  ...formConfig.ads.topBanner,
                                  enabled: e.target.checked,
                                },
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
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
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge Text</label>
                        <input
                          type="text"
                          value={formConfig.ads.topBanner.badge || ''}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                topBanner: { ...formConfig.ads.topBanner, badge: e.target.value },
                              },
                            })
                          }
                          placeholder="PROMO / SPECIAL"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Subtitle / Details</label>
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
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Link URL</label>
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
                          placeholder="https://kuthiyengpham.in/consultation"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">CTA Button Text</label>
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
                          placeholder="Book Consultation"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Inline Promo Card / AdSense */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        <h4 className="text-sm font-extrabold text-slate-900">Inline Card Ad / AdSense</h4>
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
                                inlineCard: {
                                  ...formConfig.ads.inlineCard,
                                  enabled: e.target.checked,
                                },
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Ad Format</label>
                        <select
                          value={formConfig.ads.inlineCard.type}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                inlineCard: {
                                  ...formConfig.ads.inlineCard,
                                  type: e.target.value as 'custom' | 'adsense',
                                },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        >
                          <option value="custom">Custom Branded Promo Card</option>
                          <option value="adsense">Google AdSense Slot</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Title / Product</label>
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
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Description / Copy</label>
                        <input
                          type="text"
                          value={formConfig.ads.inlineCard.body}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                inlineCard: { ...formConfig.ads.inlineCard, body: e.target.value },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Link URL</label>
                        <input
                          type="text"
                          value={formConfig.ads.inlineCard.linkUrl}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                inlineCard: { ...formConfig.ads.inlineCard, linkUrl: e.target.value },
                              },
                            })
                          }
                          placeholder="https://kuthiyengpham.in/shop"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">CTA Text</label>
                        <input
                          type="text"
                          value={formConfig.ads.inlineCard.ctaText}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                inlineCard: { ...formConfig.ads.inlineCard, ctaText: e.target.value },
                              },
                            })
                          }
                          placeholder="Visit Store"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Interstitial Promo Modal */}
                  <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                        <h4 className="text-sm font-extrabold text-slate-900">Fullscreen Promo Overlay</h4>
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
                                interstitial: {
                                  ...formConfig.ads.interstitial,
                                  enabled: e.target.checked,
                                },
                              },
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Popup Title</label>
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
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Frequency</label>
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
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        >
                          <option value="once_per_session">Once per user session</option>
                          <option value="once_per_day">Once per day</option>
                          <option value="always">Every app launch</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={formConfig.ads.interstitial.description}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                interstitial: { ...formConfig.ads.interstitial, description: e.target.value },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Destination URL</label>
                        <input
                          type="text"
                          value={formConfig.ads.interstitial.linkUrl}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                interstitial: { ...formConfig.ads.interstitial, linkUrl: e.target.value },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">CTA Text</label>
                        <input
                          type="text"
                          value={formConfig.ads.interstitial.ctaText}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              ads: {
                                ...formConfig.ads,
                                interstitial: { ...formConfig.ads.interstitial, ctaText: e.target.value },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NOTIFICATIONS MANAGEMENT */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {/* Announcement Ticker Bar */}
                  <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                        <h4 className="text-sm font-extrabold text-slate-900">Top Announcement Ticker</h4>
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
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                      </label>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Ticker Message Text</label>
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
                          placeholder="e.g., ✨ Special Somwar Vrat today. Auspicious timings..."
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Theme / Style</label>
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
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                          >
                            <option value="auspicious">Auspicious (Gold / Amber)</option>
                            <option value="festival">Festival (Purple / Pink)</option>
                            <option value="urgent">Urgent / Alert (Red / Crimson)</option>
                            <option value="info">General Info (Slate / Indigo)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Click Action Link</label>
                          <input
                            type="text"
                            value={formConfig.notifications.announcement.linkUrl || ''}
                            onChange={(e) =>
                              setFormConfig({
                                ...formConfig,
                                notifications: {
                                  ...formConfig.notifications,
                                  announcement: {
                                    ...formConfig.notifications.announcement,
                                    linkUrl: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="https://kuthiyengpham.in"
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Broadcast New Notification */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm font-extrabold text-slate-900">Broadcast Instant In-App Alert</h4>
                    </div>

                    <form onSubmit={handleSendNotification} className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Notification Title</label>
                          <input
                            type="text"
                            value={notifTitle}
                            onChange={(e) => setNotifTitle(e.target.value)}
                            placeholder="e.g. Mahashivratri Special Muhurta"
                            required
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                          <select
                            value={notifType}
                            onChange={(e) => setNotifType(e.target.value as any)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                          >
                            <option value="panchang">Daily Panchang</option>
                            <option value="festival">Festival Celebration</option>
                            <option value="muhurta">Auspicious Muhurta</option>
                            <option value="offer">Special Vedic Offer</option>
                            <option value="general">General Update</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Alert Message</label>
                        <textarea
                          value={notifMsg}
                          onChange={(e) => setNotifMsg(e.target.value)}
                          placeholder="Write notification message content here..."
                          required
                          rows={2}
                          className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Action URL (Optional)</label>
                        <input
                          type="text"
                          value={notifLink}
                          onChange={(e) => setNotifLink(e.target.value)}
                          placeholder="https://kuthiyengpham.in/panchang"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Send to Notification Center</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 3: MOBILE & APP SETTINGS */}
              {activeTab === 'mobile' && (
                <div className="space-y-6">
                  {/* Splash Screen Settings */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">Mobile Cosmic Splash Screen</h4>
                        <p className="text-xs text-slate-500">Shows radiant Sun Chakra on app startup</p>
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
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                      </label>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Splash Screen Duration</span>
                        <span>{formConfig.mobile.splashDurationMs} ms ({(formConfig.mobile.splashDurationMs / 1000).toFixed(1)}s)</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="4000"
                        step="200"
                        value={formConfig.mobile.splashDurationMs}
                        onChange={(e) =>
                          setFormConfig({
                            ...formConfig,
                            mobile: {
                              ...formConfig.mobile,
                              splashDurationMs: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* PWA Settings */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">Enable Mobile App Install Banner</h4>
                      <p className="text-xs text-slate-500">Prompts users to install SuryaSiddha to their home screen as a PWA</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formConfig.mobile.enablePwaInstallPrompt}
                        onChange={(e) =>
                          setFormConfig({
                            ...formConfig,
                            mobile: {
                              ...formConfig.mobile,
                              enablePwaInstallPrompt: e.target.checked,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                    </label>
                  </div>

                  {/* Security PIN Change */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                    <h4 className="text-sm font-extrabold text-slate-900">Admin Security PIN</h4>
                    <div className="max-w-xs text-xs">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">New Access PIN</label>
                      <input
                        type="text"
                        value={formConfig.pin}
                        onChange={(e) => setFormConfig({ ...formConfig, pin: e.target.value })}
                        className="w-full h-9 px-3 font-mono font-bold rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Save & Reset Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center gap-3">
                {savedToast && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle className="w-4 h-4" /> Changes Saved!
                  </span>
                )}

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
