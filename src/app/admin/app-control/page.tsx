'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Sliders,
  DollarSign,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Save,
  Send,
  Sparkles,
  Shield,
  Eye,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  Megaphone,
  Image as ImageIcon,
  Code,
  Palette,
  Check,
  Tag,
  Share2,
  Menu,
  X,
  Upload,
  User,
  ShoppingBag,
  UserCheck,
  Phone,
  Info,
  Facebook,
  Youtube,
  Instagram,
  MessageCircle,
  Plus,
  Trash2,
  ChevronRight,
  Sun
} from 'lucide-react';
import Link from 'next/link';

interface CustomTopAdBanner {
  enabled: boolean;
  format: 'rich_promo' | 'image_banner' | 'html_embed';
  title: string;
  subtitle: string;
  badge_text: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  open_in_new_tab: boolean;
  bg_gradient: string;
  html_code?: string;
}

interface SideMenuLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  enabled: boolean;
}

interface SideMenuConfig {
  show_account: boolean;
  account_title: string;
  account_subtitle: string;
  account_link: string;
  show_share: boolean;
  share_title: string;
  share_subtitle: string;
  share_message: string;
  share_url: string;
  show_social_links: boolean;
  social_links: {
    facebook: string;
    whatsapp: string;
    youtube: string;
    instagram: string;
    telegram: string;
  };
  custom_links: SideMenuLink[];
  app_version: string;
  bottom_branding_text: string;
}

interface AppSettings {
  features: {
    maintenance_mode: boolean;
    show_rashifal: boolean;
    show_panchang: boolean;
    show_calendar_banner: boolean;
    show_kuthi_cards: boolean;
    show_useful_tab: boolean;
  };
  ads: {
    global_enabled: boolean;
    top_banner_mode?: 'custom' | 'admob' | 'both' | 'none';
    custom_top_banner?: CustomTopAdBanner;
    top_banner: {
      enabled: boolean;
      unit_id: string;
      type: string;
    };
    middle_feed: {
      enabled: boolean;
      unit_id: string;
      type: string;
    };
    bottom_sticky: {
      enabled: boolean;
      unit_id: string;
      type: string;
    };
    interstitial_enabled: boolean;
  };
  side_menu?: SideMenuConfig;
  notifications?: {
    id: string;
    title: string;
    body: string;
    timestamp: string;
    target_screen: string;
    target_id?: string;
    sent: boolean;
  }[];
}

const DEFAULT_SIDE_MENU: SideMenuConfig = {
  show_account: true,
  account_title: 'My Account / Kundli Profile',
  account_subtitle: 'View birth charts & consultations',
  account_link: '/kundli',
  show_share: true,
  share_title: 'Share App with Friends',
  share_subtitle: 'Spread Manipuri Astrology & Calendar',
  share_message: 'Explore Manipuri Calendar, Panchang & Janma Patrika on Kanglei Astro: https://kangleiastro.com',
  share_url: 'https://kangleiastro.com',
  show_social_links: true,
  social_links: {
    facebook: 'https://facebook.com/kangleiastro',
    whatsapp: 'https://wa.me/919876543210',
    youtube: 'https://youtube.com/@kangleiastro',
    instagram: 'https://instagram.com/kangleiastro',
    telegram: 'https://t.me/kangleiastro',
  },
  custom_links: [
    { id: 'link-1', label: 'Astrologer Consultation', url: '/astrologers', icon: 'UserCheck', enabled: true },
    { id: 'link-2', label: 'Kanglei Astro Store', url: '/shop', icon: 'ShoppingBag', enabled: true },
    { id: 'link-3', label: 'Contact & Support', url: '/contact', icon: 'Phone', enabled: true },
  ],
  app_version: 'v1.2.0',
  bottom_branding_text: 'Manipuri Calender by KangleiAstro',
};

export default function AdminAppControlPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'features' | 'top_banner' | 'side_menu' | 'ads' | 'notifications'>('features');
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Push Notification Composer State
  const [notifTitle, setNotifTitle] = useState<string>('');
  const [notifBody, setNotifBody] = useState<string>('');
  const [notifTarget, setNotifTarget] = useState<string>('useful');
  const [notifTargetId, setNotifTargetId] = useState<string>('');
  const [sendingNotif, setSendingNotif] = useState<boolean>(false);

  // File Upload Ref for Top Ad Banner
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/app-control');
      const data = await res.json();
      if (data.success) {
        const fetched = data.settings;
        if (!fetched.side_menu) {
          fetched.side_menu = DEFAULT_SIDE_MENU;
        }
        setSettings(fetched);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/app-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showToast('App Control settings saved & synced successfully!');
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifBody.trim()) {
      alert('Please fill in both title and message body.');
      return;
    }
    setSendingNotif(true);
    try {
      const res = await fetch('/api/admin/app-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_notification',
          title: notifTitle,
          body: notifBody,
          target_screen: notifTarget,
          target_id: notifTargetId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Push notification broadcasted to all active devices!');
        setNotifTitle('');
        setNotifBody('');
        setNotifTargetId('');
        fetchSettings();
      } else {
        alert(data.error || 'Failed to send notification');
      }
    } catch (err) {
      console.error('Send error:', err);
      alert('Error sending notification');
    } finally {
      setSendingNotif(false);
    }
  };

  // Handle Banner Image File Upload (Base64 conversion)
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert('Please choose an image under 2.5MB for fast loading.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl && settings) {
        setSettings({
          ...settings,
          ads: {
            ...settings.ads,
            custom_top_banner: {
              ...(settings.ads.custom_top_banner || {
                enabled: true,
                format: 'rich_promo',
                title: '',
                subtitle: '',
                badge_text: 'PROMO',
                image_url: '',
                cta_text: 'Open',
                cta_link: '/',
                open_in_new_tab: false,
                bg_gradient: 'from-[#211a14] via-[#2f2216] to-[#1a1511]',
              }),
              image_url: dataUrl,
            },
          },
        });
        showToast('Banner graphic uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500 font-mono">Loading App Control Matrix...</p>
      </div>
    );
  }

  const sideMenu = settings.side_menu || DEFAULT_SIDE_MENU;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      {/* Top Banner Header */}
      <header className="bg-[#1E1B18] text-white sticky top-0 z-30 shadow-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Admin</span>
            </Link>
            <div className="h-5 w-px bg-stone-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-xs">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">App Control Center & AdMob</h1>
                <span className="text-[11px] text-amber-400 font-mono leading-none block">
                  Dynamic Feature Toggles, Custom Ads, Side Menu & Push Notifications
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/useful"
              className="px-3 py-1.5 rounded-xl border border-amber-800/60 bg-[#2b241d] hover:bg-[#382f26] text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Useful Composer</span>
            </Link>
            <Link
              href="/app"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Mobile App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1E293B] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-amber-500/40 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'features'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Feature Switches</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('top_banner')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'top_banner'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Megaphone className="w-4 h-4 text-amber-500" />
              <span>Top Custom Ads Banner</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('side_menu')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'side_menu'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Menu className="w-4 h-4 text-amber-500" />
              <span>Side Menu (Drawer)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ads')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'ads'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>AdMob Monetization</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Push Notifications</span>
            </button>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveSettings}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>

        {/* ── TAB 1: FEATURE MODULE SWITCHES ── */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Mobile Screen & Navigation Modules</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Toggle key user-facing sections on or off dynamically in the mobile app.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Daily Rashifal Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <strong className="text-slate-900 block font-bold text-xs">Daily Rashifal (দৈনিক রাশিফল)</strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      12 Zodiac Sign horoscope carousel on Home Screen.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features.show_rashifal}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          features: { ...settings.features, show_rashifal: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>

                {/* Manipuri Panchang Full Workstation */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <strong className="text-slate-900 block font-bold text-xs">Panchang Tab & Workstation</strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      Vedic Panchang, Tithi, Nakshatra, Yoga & Choghadiya.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features.show_panchang}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          features: { ...settings.features, show_panchang: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>

                {/* Useful Info / Articles Tab */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <strong className="text-slate-900 block font-bold text-xs">Useful Guides (লমজিং ও নিয়ম)</strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      Shows Useful tab in Bottom Bar & Side Drawer.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features.show_useful_tab}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          features: { ...settings.features, show_useful_tab: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>

                {/* Kuthi Service Cards (Eba & Yengba) */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <strong className="text-slate-900 block font-bold text-xs">Kuthi Eba & Yengba Services</strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      Janma Patrika registration and Horoscope reading forms.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features.show_kuthi_cards}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          features: { ...settings.features, show_kuthi_cards: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>

                {/* Monthly Calendar Hero Widget */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <strong className="text-slate-900 block font-bold text-xs">Calendar Hero Mini Banner</strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      Interactive 7-day strip and quick calendar entry banner.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features.show_calendar_banner}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          features: { ...settings.features, show_calendar_banner: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>
              </div>
            </div>

            {/* Global Maintenance & Emergency Shield */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-600" />
                  <span>App Guard & Maintenance Mode</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Temporarily lock the mobile interface for updates or data sync.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Maintenance Mode</h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    When active, mobile app users will see a polite "Under Routine Maintenance" screen while server updates complete.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.features.maintenance_mode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        features: { ...settings.features, maintenance_mode: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: TOP CUSTOM ADS BANNER CONTROLLER (WITH UPLOAD OPTION) ── */}
        {activeTab === 'top_banner' && (
          <div className="space-y-6">
            {/* Master Control Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-600" />
                  <span>Top Ad Banner Master Switch & Mode</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose whether to render custom in-house ads, AdMob network units, or both.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Display Mode:</span>
                  <select
                    value={settings.ads.top_banner_mode || 'custom'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ads: {
                          ...settings.ads,
                          top_banner_mode: e.target.value as any,
                        },
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="custom">Custom Banner Only</option>
                    <option value="admob">AdMob Only</option>
                    <option value="both">Custom First (Hybrid)</option>
                    <option value="none">Disabled (No Ads)</option>
                  </select>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.ads.custom_top_banner?.enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ads: {
                          ...settings.ads,
                          custom_top_banner: {
                            ...(settings.ads.custom_top_banner || {
                              enabled: true,
                              format: 'rich_promo',
                              title: 'Authentic Manipuri Kuthi & Rudraksha',
                              subtitle: '100% Energized Puja items & Personalized Janma Patrika',
                              badge_text: '⚡ SPONSORED PROMO',
                              image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop',
                              cta_text: 'Shop Now',
                              cta_link: '/shop',
                              open_in_new_tab: false,
                              bg_gradient: 'from-[#211a14] via-[#2f2216] to-[#1a1511]',
                            }),
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600" />
                </label>
              </div>
            </div>

            {/* Hidden File Input for Image Upload */}
            <input
              type="file"
              accept="image/*"
              ref={bannerFileInputRef}
              onChange={handleBannerFileUpload}
              className="hidden"
            />

            {/* Main Form & Live Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form Settings (Left 7 Cols) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-600" />
                  <span>Custom Banner Configuration</span>
                </h4>

                {/* Banner Format Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Banner Style / Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'rich_promo', label: 'Rich Promo Card', desc: 'Title, Tagline & CTA Button' },
                      { id: 'image_banner', label: 'Image Graphic', desc: 'Clickable Graphic Banner' },
                      { id: 'html_embed', label: 'HTML / Embed', desc: 'Custom Ad / Script Code' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            ads: {
                              ...settings.ads,
                              custom_top_banner: {
                                ...(settings.ads.custom_top_banner || ({} as any)),
                                format: fmt.id as any,
                              },
                            },
                          })
                        }
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                          (settings.ads.custom_top_banner?.format || 'rich_promo') === fmt.id
                            ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900 block">{fmt.label}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{fmt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fields for Rich Promo Format */}
                {(settings.ads.custom_top_banner?.format || 'rich_promo') === 'rich_promo' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Headline / Ad Title</label>
                      <input
                        type="text"
                        value={settings.ads.custom_top_banner?.title || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ads: {
                              ...settings.ads,
                              custom_top_banner: {
                                ...(settings.ads.custom_top_banner || ({} as any)),
                                title: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="e.g. Authentic Manipuri Kuthi & Rudraksha"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Subtitle / Promo Tagline</label>
                      <input
                        type="text"
                        value={settings.ads.custom_top_banner?.subtitle || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ads: {
                              ...settings.ads,
                              custom_top_banner: {
                                ...(settings.ads.custom_top_banner || ({} as any)),
                                subtitle: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="e.g. 100% Energized Puja items & Personalized Janma Patrika"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Badge Pill Label</label>
                        <input
                          type="text"
                          value={settings.ads.custom_top_banner?.badge_text || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              ads: {
                                ...settings.ads,
                                custom_top_banner: {
                                  ...(settings.ads.custom_top_banner || ({} as any)),
                                  badge_text: e.target.value,
                                },
                              },
                            })
                          }
                          placeholder="e.g. ⚡ SPONSORED PROMO"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">CTA Button Label</label>
                        <input
                          type="text"
                          value={settings.ads.custom_top_banner?.cta_text || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              ads: {
                                ...settings.ads,
                                custom_top_banner: {
                                  ...(settings.ads.custom_top_banner || ({} as any)),
                                  cta_text: e.target.value,
                                },
                              },
                            })
                          }
                          placeholder="e.g. Shop Now"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">CTA Destination Link URL</label>
                      <input
                        type="text"
                        value={settings.ads.custom_top_banner?.cta_link || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ads: {
                              ...settings.ads,
                              custom_top_banner: {
                                ...(settings.ads.custom_top_banner || ({} as any)),
                                cta_link: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="e.g. /shop or /manipuri_kuthi_yengba or https://..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Image / Thumbnail with Direct Upload Button */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-amber-950 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                          <span>Thumbnail / Graphic Image</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => bannerFileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Image File</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={settings.ads.custom_top_banner?.image_url || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              ads: {
                                ...settings.ads,
                                custom_top_banner: {
                                  ...(settings.ads.custom_top_banner || ({} as any)),
                                  image_url: e.target.value,
                                },
                              },
                            })
                          }
                          placeholder="Paste image URL or click 'Upload Image File'"
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {settings.ads.custom_top_banner?.image_url && (
                          <button
                            type="button"
                            onClick={() =>
                              setSettings({
                                ...settings,
                                ads: {
                                  ...settings.ads,
                                  custom_top_banner: {
                                    ...(settings.ads.custom_top_banner || ({} as any)),
                                    image_url: '',
                                  },
                                },
                              })
                            }
                            className="px-2.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {settings.ads.custom_top_banner?.image_url && (
                        <div className="flex items-center gap-2 pt-1">
                          <img
                            src={settings.ads.custom_top_banner.image_url}
                            alt="Banner Thumbnail"
                            className="w-12 h-12 rounded-lg object-cover border border-amber-300 shadow-2xs"
                          />
                          <span className="text-[10px] text-amber-800 font-mono">
                            {settings.ads.custom_top_banner.image_url.startsWith('data:')
                              ? '✓ Uploaded image active (Stored safely)'
                              : '✓ Remote URL active'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Gradient Presets */}
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5 text-amber-600" />
                        <span>Background Theme Gradient</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'from-[#211a14] via-[#2f2216] to-[#1a1511]', label: 'Gold Ember', preview: 'bg-gradient-to-r from-[#211a14] to-[#1a1511]' },
                          { id: 'from-amber-900 via-amber-800 to-amber-950', label: 'Warm Amber', preview: 'bg-gradient-to-r from-amber-900 to-amber-950' },
                          { id: 'from-indigo-950 via-slate-900 to-black', label: 'Royal Midnight', preview: 'bg-gradient-to-r from-indigo-950 to-black' },
                          { id: 'from-emerald-950 via-teal-900 to-slate-900', label: 'Emerald Mystic', preview: 'bg-gradient-to-r from-emerald-950 to-slate-900' },
                          { id: 'from-rose-950 via-rose-900 to-stone-900', label: 'Ruby Sunset', preview: 'bg-gradient-to-r from-rose-950 to-stone-900' },
                          { id: 'from-purple-950 via-violet-900 to-slate-950', label: 'Velvet Astral', preview: 'bg-gradient-to-r from-purple-950 to-slate-950' },
                        ].map((grad) => (
                          <button
                            key={grad.id}
                            type="button"
                            onClick={() =>
                              setSettings({
                                ...settings,
                                ads: {
                                  ...settings.ads,
                                  custom_top_banner: {
                                    ...(settings.ads.custom_top_banner || ({} as any)),
                                    bg_gradient: grad.id,
                                  },
                                },
                              })
                            }
                            className={`p-2 rounded-xl border flex items-center gap-2 transition cursor-pointer ${
                              (settings.ads.custom_top_banner?.bg_gradient || 'from-[#211a14] via-[#2f2216] to-[#1a1511]') === grad.id
                                ? 'border-amber-600 ring-2 ring-amber-500 bg-amber-50/40'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full ${grad.preview} shrink-0 border border-white/40 shadow-xs`} />
                            <span className="text-[11px] font-bold text-slate-800 truncate">{grad.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fields for Image Banner Format */}
                {(settings.ads.custom_top_banner?.format) === 'image_banner' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-amber-950 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                          <span>Graphic Banner Image</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => bannerFileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Image File</span>
                        </button>
                      </div>

                      <input
                        type="text"
                        value={settings.ads.custom_top_banner?.image_url || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ads: {
                              ...settings.ads,
                              custom_top_banner: {
                                ...(settings.ads.custom_top_banner || ({} as any)),
                                image_url: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="https://... or upload image"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Click Target / Destination URL</label>
                      <input
                        type="text"
                        value={settings.ads.custom_top_banner?.cta_link || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ads: {
                              ...settings.ads,
                              custom_top_banner: {
                                ...(settings.ads.custom_top_banner || ({} as any)),
                                cta_link: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="e.g. /shop or https://..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}

                {/* Fields for HTML Embed Format */}
                {(settings.ads.custom_top_banner?.format) === 'html_embed' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Custom HTML / Script Code</label>
                      <textarea
                        rows={5}
                        value={settings.ads.custom_top_banner?.html_code || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ads: {
                              ...settings.ads,
                              custom_top_banner: {
                                ...(settings.ads.custom_top_banner || ({} as any)),
                                html_code: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="<div style='...'>...</div>"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview (Right 5 Cols) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>Live Mobile Simulator Preview</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 mb-4">
                    Exact representation of the custom banner at the top of the mobile screen.
                  </p>

                  {/* Simulator Device Frame */}
                  <div className="max-w-sm mx-auto rounded-3xl bg-[#121212] p-3 text-white shadow-xl border border-slate-800">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pb-2 border-b border-zinc-800">
                      <span>07:44</span>
                      <span>4G+ 100%</span>
                    </div>

                    <div className="pt-3 pb-1">
                      {/* Banner Rendering in Simulator */}
                      {settings.ads.custom_top_banner?.format === 'image_banner' ? (
                        <div className="relative rounded-2xl overflow-hidden shadow-md border border-amber-600/40">
                          <div className="absolute top-2 left-2 z-10">
                            <span className="px-1.5 py-0.5 rounded bg-black/75 text-amber-300 text-[8px] uppercase tracking-wider font-mono font-bold">
                              {settings.ads.custom_top_banner.badge_text || 'SPONSORED'}
                            </span>
                          </div>
                          {settings.ads.custom_top_banner.image_url ? (
                            <img
                              src={settings.ads.custom_top_banner.image_url}
                              alt="Banner preview"
                              className="w-full h-24 object-cover"
                            />
                          ) : (
                            <div className="w-full h-24 bg-gradient-to-r from-stone-800 to-stone-900 flex items-center justify-center text-xs text-stone-400">
                              No Graphic Uploaded
                            </div>
                          )}
                        </div>
                      ) : settings.ads.custom_top_banner?.format === 'html_embed' ? (
                        <div
                          className="p-2 rounded-2xl bg-white text-black text-xs"
                          dangerouslySetInnerHTML={{ __html: settings.ads.custom_top_banner.html_code || '<p>HTML Embed preview</p>' }}
                        />
                      ) : (
                        /* Rich Promo Card */
                        <div className={`rounded-2xl bg-gradient-to-r ${settings.ads.custom_top_banner?.bg_gradient || 'from-[#211a14] via-[#2f2216] to-[#1a1511]'} border border-amber-600/30 p-3 text-amber-100 shadow-md`}>
                          <div className="flex items-center justify-between text-[9px] font-bold text-amber-400 mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.2 rounded-xs bg-amber-500/20 border border-amber-500/40 text-[8px] uppercase tracking-wider font-mono font-bold">
                                {settings.ads.custom_top_banner?.badge_text || '⚡ PROMO'}
                              </span>
                              <span className="text-amber-300/80 text-[10px] font-serif">Kanglei Astro Feature</span>
                            </div>
                            <span className="text-amber-300/60 text-xs">✕</span>
                          </div>

                          <div className="flex items-center justify-between gap-2.5">
                            {settings.ads.custom_top_banner?.image_url && (
                              <img
                                src={settings.ads.custom_top_banner.image_url}
                                alt="Thumb"
                                className="w-11 h-11 rounded-xl object-cover border border-amber-500/30 shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-white truncate leading-snug">
                                {settings.ads.custom_top_banner?.title || 'Authentic Manipuri Kuthi & Rudraksha'}
                              </h4>
                              <p className="text-[10px] text-amber-200/80 line-clamp-1 mt-0.5 leading-tight">
                                {settings.ads.custom_top_banner?.subtitle || '100% Energized Puja items & Patrika'}
                              </p>
                            </div>

                            <span className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-[10px] tracking-tight shadow-xs shrink-0">
                              {settings.ads.custom_top_banner?.cta_text || 'Shop Now'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Apply & Save Banner'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: SIDE MENU (DRAWER) CONTROLLER ── */}
        {activeTab === 'side_menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Side Menu Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Account & Profile Link */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>Account & Kundli Profile Section</span>
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sideMenu.show_account !== false}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: { ...sideMenu, show_account: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Account Card Title</label>
                    <input
                      type="text"
                      value={sideMenu.account_title || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: { ...sideMenu, account_title: e.target.value },
                        })
                      }
                      placeholder="My Account / Kundli Profile"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Account Subtitle / Tag</label>
                    <input
                      type="text"
                      value={sideMenu.account_subtitle || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: { ...sideMenu, account_subtitle: e.target.value },
                        })
                      }
                      placeholder="View birth charts & consultations"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Destination URL</label>
                    <input
                      type="text"
                      value={sideMenu.account_link || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: { ...sideMenu, account_link: e.target.value },
                        })
                      }
                      placeholder="/kundli or /profile"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Share App Action */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-amber-600" />
                    <span>Share App Button & Preset Message</span>
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sideMenu.show_share !== false}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: { ...sideMenu, show_share: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Share Button Title</label>
                      <input
                        type="text"
                        value={sideMenu.share_title || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            side_menu: { ...sideMenu, share_title: e.target.value },
                          })
                        }
                        placeholder="Share App with Friends"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Share Button Subtitle</label>
                      <input
                        type="text"
                        value={sideMenu.share_subtitle || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            side_menu: { ...sideMenu, share_subtitle: e.target.value },
                          })
                        }
                        placeholder="Spread Manipuri Astrology"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Pre-filled Share Message</label>
                    <textarea
                      rows={2}
                      value={sideMenu.share_message || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: { ...sideMenu, share_message: e.target.value },
                        })
                      }
                      placeholder="Explore Manipuri Calendar & Panchang on Kanglei Astro"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">App Share Link URL</label>
                    <input
                      type="text"
                      value={sideMenu.share_url || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: { ...sideMenu, share_url: e.target.value },
                        })
                      }
                      placeholder="https://kangleiastro.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Social Media Channels Bar</span>
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sideMenu.show_social_links !== false}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: { ...sideMenu, show_social_links: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>Facebook Page URL</span>
                    </label>
                    <input
                      type="text"
                      value={sideMenu.social_links?.facebook || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: {
                            ...sideMenu,
                            social_links: { ...sideMenu.social_links, facebook: e.target.value },
                          },
                        })
                      }
                      placeholder="https://facebook.com/kangleiastro"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Link / Number</span>
                    </label>
                    <input
                      type="text"
                      value={sideMenu.social_links?.whatsapp || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: {
                            ...sideMenu,
                            social_links: { ...sideMenu.social_links, whatsapp: e.target.value },
                          },
                        })
                      }
                      placeholder="https://wa.me/919876543210"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <Youtube className="w-3.5 h-3.5 text-red-600" />
                      <span>YouTube Channel URL</span>
                    </label>
                    <input
                      type="text"
                      value={sideMenu.social_links?.youtube || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: {
                            ...sideMenu,
                            social_links: { ...sideMenu.social_links, youtube: e.target.value },
                          },
                        })
                      }
                      placeholder="https://youtube.com/@kangleiastro"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      <span>Instagram Profile URL</span>
                    </label>
                    <input
                      type="text"
                      value={sideMenu.social_links?.instagram || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: {
                            ...sideMenu,
                            social_links: { ...sideMenu.social_links, instagram: e.target.value },
                          },
                        })
                      }
                      placeholder="https://instagram.com/kangleiastro"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Version & Bottom Branding Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-600" />
                    <span>Drawer Footer Version & Bottom Branding</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure the version tag and bottom branding displayed at the very base of the side drawer.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Version String</label>
                    <input
                      type="text"
                      value={sideMenu.app_version || 'v1.2.0'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: { ...sideMenu, app_version: e.target.value },
                        })
                      }
                      placeholder="v1.2.0"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 text-amber-900 font-bold">
                      Bottom Branding (Below Version)
                    </label>
                    <input
                      type="text"
                      value={sideMenu.bottom_branding_text || 'Manipuri Calender by KangleiAstro'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          side_menu: { ...sideMenu, bottom_branding_text: e.target.value },
                        })
                      }
                      placeholder="Manipuri Calender by KangleiAstro"
                      className="w-full px-3 py-2 rounded-xl bg-amber-50/60 border border-amber-300 text-xs font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  💡 <strong>Display Note:</strong> The text <span className="font-bold text-amber-800">"{sideMenu.bottom_branding_text || 'Manipuri Calender by KangleiAstro'}"</span> will be displayed permanently at the very bottom/last line of the side menu in the mobile app.
                </div>
              </div>
            </div>

            {/* Right Column: Live Side Menu Simulator (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>Live Side Menu (Drawer) Preview</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 mb-3">
                  Preview how the side drawer appears to mobile app users.
                </p>

                {/* Simulated Android Drawer Frame */}
                <div className="max-w-xs mx-auto rounded-3xl bg-[#1a1714] text-amber-50 shadow-2xl border border-amber-900/40 overflow-hidden flex flex-col">
                  {/* Drawer Header */}
                  <div className="p-4 border-b border-amber-800/30 bg-gradient-to-b from-amber-950/60 to-transparent">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-2xl bg-amber-500 flex items-center justify-center text-amber-950 font-black shadow-md">
                        <Sun className="w-5 h-5" />
                      </div>
                      <span className="text-amber-300/60 text-xs">✕</span>
                    </div>
                    <h3 className="text-sm font-serif font-black text-amber-100">Kanglei Astro App</h3>
                    <p className="text-[10px] text-amber-300/80 font-serif">Manipur Astrological Portal</p>
                  </div>

                  {/* Drawer Content */}
                  <div className="p-3 space-y-2 text-xs">
                    
                    {/* Account section */}
                    {sideMenu.show_account !== false && (
                      <div className="p-2.5 rounded-xl bg-[#2a221b] border border-amber-800/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-amber-100 block leading-tight">
                              {sideMenu.account_title || 'My Account / Profile'}
                            </span>
                            <span className="text-[9px] text-amber-400/80 block leading-none">
                              {sideMenu.account_subtitle || 'View birth charts & consultations'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400/60" />
                      </div>
                    )}

                    {/* Standard Links */}
                    <div className="space-y-1 pt-1 font-serif text-[11px]">
                      <div className="px-2.5 py-1.5 rounded-lg bg-amber-600 text-white font-bold flex items-center gap-2">
                        <Sun className="w-3.5 h-3.5" />
                        <span>Home (মূল পৃষ্ঠা)</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg text-amber-100/90 font-bold flex items-center gap-2 hover:bg-white/5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Manipuri Calendar (থাগী ক্যালেন্ডার)</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg text-amber-100/90 font-bold flex items-center gap-2 hover:bg-white/5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>Useful Guides & Rules (লমজিং ও নিয়ম)</span>
                      </div>
                    </div>

                    {/* Share App Action */}
                    {sideMenu.show_share !== false && (
                      <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center gap-2 text-amber-200 mt-2">
                        <Share2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold block leading-tight">
                            {sideMenu.share_title || 'Share App with Friends'}
                          </span>
                          <span className="text-[8.5px] text-amber-400/70 block leading-none">
                            {sideMenu.share_subtitle || 'Spread Manipuri Astrology'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Social Media Row */}
                    {sideMenu.show_social_links !== false && (
                      <div className="pt-2 flex items-center justify-around border-t border-amber-800/20 text-amber-300">
                        <span className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10"><Facebook className="w-3.5 h-3.5 text-blue-400" /></span>
                        <span className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10"><MessageCircle className="w-3.5 h-3.5 text-emerald-400" /></span>
                        <span className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10"><Youtube className="w-3.5 h-3.5 text-red-400" /></span>
                        <span className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10"><Instagram className="w-3.5 h-3.5 text-pink-400" /></span>
                      </div>
                    )}
                  </div>

                  {/* Drawer Footer with Version and User Requested Bottom Branding */}
                  <div className="p-3 border-t border-amber-800/30 bg-black/40 text-center space-y-1">
                    <div className="text-[10px] text-amber-400/80 font-mono">
                      {sideMenu.app_version || 'v1.2.0'} • Vishuddha Siddhanta Manipur
                    </div>
                    <div className="text-[11px] font-bold tracking-wide text-amber-300 font-serif border-t border-amber-800/20 pt-1">
                      {sideMenu.bottom_branding_text || 'Manipuri Calender by KangleiAstro'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Apply & Save Side Menu'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: ADMOB MONETIZATION ── */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span>Global Google AdMob Network Master Toggle</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Turn off to suppress all AdMob ad banners instantly across all clients.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.ads.global_enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ads: { ...settings.ads, global_enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Banner Ad Unit */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Banner Unit</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.ads.top_banner.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ads: {
                            ...settings.ads,
                            top_banner: { ...settings.ads.top_banner, enabled: e.target.checked },
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">AdMob Unit ID</label>
                    <input
                      type="text"
                      value={settings.ads.top_banner.unit_id}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ads: {
                            ...settings.ads,
                            top_banner: { ...settings.ads.top_banner, unit_id: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Middle In-Feed Banner Ad Unit */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Middle Feed Unit</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.ads.middle_feed.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ads: {
                            ...settings.ads,
                            middle_feed: { ...settings.ads.middle_feed, enabled: e.target.checked },
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">AdMob Unit ID</label>
                    <input
                      type="text"
                      value={settings.ads.middle_feed.unit_id}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ads: {
                            ...settings.ads,
                            middle_feed: { ...settings.ads.middle_feed, unit_id: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Banner Ad Unit */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Bottom Sticky Unit</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.ads.bottom_sticky.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ads: {
                            ...settings.ads,
                            bottom_sticky: { ...settings.ads.bottom_sticky, enabled: e.target.checked },
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">AdMob Unit ID</label>
                    <input
                      type="text"
                      value={settings.ads.bottom_sticky.unit_id}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ads: {
                            ...settings.ads,
                            bottom_sticky: { ...settings.ads.bottom_sticky, unit_id: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: PUSH NOTIFICATIONS ── */}
        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-600" />
                  <span>Broadcast In-App Push Notification</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Send instant alerts to mobile users for daily panchang updates, tithi rituals, or new articles.
                </p>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Notification Title (Bangla / English / Meetei)</label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="e.g. লাংবন তর্পণ হৌরবা (Tarpan Ritual Starts Today)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Message Body</label>
                  <textarea
                    rows={3}
                    value={notifBody}
                    onChange={(e) => setNotifBody(e.target.value)}
                    placeholder="e.g. Read the complete ritual rules, auspicious muhurta, and daily tithi timings..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Target Screen</label>
                    <select
                      value={notifTarget}
                      onChange={(e) => setNotifTarget(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="useful">Useful Guide Article</option>
                      <option value="panchang">Panchang Tab</option>
                      <option value="calendar">Monthly Calendar</option>
                      <option value="horoscope">Today's Rashifal</option>
                      <option value="home">Home Screen</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Target Topic ID (Optional)</label>
                    <input
                      type="text"
                      value={notifTargetId}
                      onChange={(e) => setNotifTargetId(e.target.value)}
                      placeholder="e.g. topic-1"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sendingNotif}
                  className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{sendingNotif ? 'Broadcasting...' : 'Send Broadcast Push Now'}</span>
                </button>
              </form>
            </div>

            {/* Notification History Log */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Recent Broadcasts ({settings.notifications?.length || 0})</span>
                </h3>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto no-scrollbar">
                {(!settings.notifications || settings.notifications.length === 0) ? (
                  <p className="text-xs text-slate-400 text-center py-6">No previous notifications broadcasted yet.</p>
                ) : (
                  settings.notifications.map((notif) => (
                    <div key={notif.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="font-bold text-slate-900">{notif.title}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{notif.body}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                          Target: {notif.target_screen}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
