'use client';

import React, { useState, useEffect } from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Smartphone,
  CheckCircle2,
  Tag,
  Layers,
  Edit,
  RotateCcw
} from 'lucide-react';
import AstrologerMobileView, { MobileCustomizerConfig } from '@/components/dashboard/AstrologerMobileView';

export interface MobileLayoutSection {
  id: string;
  type: 'ad_banner' | 'notices' | 'panchanga' | 'workspace_tiles' | 'consultation_queue' | 'eshop_overview' | 'quick_engines' | 'stats_cards' | 'custom_ad';
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  data?: {
    adTag?: string;
    adTitle?: string;
    adSubtitle?: string;
    adBannerUrl?: string;
    targetUrl?: string;
    badgeColor?: string;
  };
}

export const DEFAULT_MOBILE_SECTIONS: MobileLayoutSection[] = [
  {
    id: 'sec-ad-1',
    type: 'ad_banner',
    title: 'Sponsored Ad Banner Slot',
    subtitle: 'Primary promotional gemstone/product banner',
    enabled: true,
    order: 1,
    data: {
      adTag: 'SPONSORED',
      adTitle: 'Ceylon Unheated Yellow Sapphires (Pukhraj)',
      adSubtitle: 'Lab Certified 100% Natural • Special Astrologer Partner Discount',
      adBannerUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
      targetUrl: '/shop',
      badgeColor: 'amber',
    },
  },
  {
    id: 'sec-notices-2',
    type: 'notices',
    title: 'Admin Announcements & Notices Carousel',
    subtitle: 'Broadcast system updates, urgent alerts, and notifications',
    enabled: true,
    order: 2,
  },
  {
    id: 'sec-panchanga-3',
    type: 'panchanga',
    title: 'Daily Panchanga & Transit Strip',
    subtitle: 'Tithi, Nakshatra, Moon Sign, Rahu Kaal ribbon',
    enabled: true,
    order: 3,
  },
  {
    id: 'sec-workspace-4',
    type: 'workspace_tiles',
    title: 'Core Workspace Tiles',
    subtitle: 'Kuthi Order Hub and Live Consultation entry tiles',
    enabled: true,
    order: 4,
  },
  {
    id: 'sec-queue-5',
    type: 'consultation_queue',
    title: 'Active Consultation Queue',
    subtitle: 'Real-time list of waiting client calls and incoming chat requests',
    enabled: true,
    order: 5,
  },
  {
    id: 'sec-eshop-6',
    type: 'eshop_overview',
    title: 'eShop Store & Order Cards',
    subtitle: '2-card summary for listed remedies, recent orders & "Show More" shop manager',
    enabled: true,
    order: 6,
  },
  {
    id: 'sec-engines-7',
    type: 'quick_engines',
    title: 'Quick Astrological Vedic Engines',
    subtitle: 'Sade Sati, Manglik, Kaal Sarp, Nga-Eeshing, Yogas, Yumsharol, Kundli',
    enabled: true,
    order: 7,
  },
  {
    id: 'sec-stats-8',
    type: 'stats_cards',
    title: 'Summary Stats & Wallet Earnings',
    subtitle: 'Quick order totals, live call queues, and wallet payout',
    enabled: true,
    order: 8,
  },
];

export default function MobileAppLayoutBuilder() {
  const [sections, setSections] = useState<MobileLayoutSection[]>(DEFAULT_MOBILE_SECTIONS);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'layout' | 'ads'>('layout');
  const [previewScale, setPreviewScale] = useState(90);

  // New Custom Ad modal / state
  const [showAddAdModal, setShowAddAdModal] = useState(false);
  const [newAdForm, setNewAdForm] = useState({
    adTitle: '',
    adSubtitle: '',
    adTag: 'SPECIAL OFFER',
    adBannerUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    targetUrl: '/shop',
  });

  // Base customizer config
  const [baseConfig, setBaseConfig] = useState<MobileCustomizerConfig>({
    showAdBanner: true,
    adTag: 'SPONSORED',
    adTitle: 'Ceylon Unheated Yellow Sapphires (Pukhraj)',
    adSubtitle: 'Lab Certified 100% Natural • Special Astrologer Partner Discount',
    adBannerUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    stationCity: 'Imphal · 24.8°N',
    tithiText: 'Shukla Navami (নৱমী)',
    nakshatraText: 'Rohini (রোহিণী)',
    rahuKaalText: '16:30 – 18:00',
    pendingKuthiOrders: 4,
    activeLiveCalls: 1,
    walletBalance: 14850,
    isOnline: true,
    enabledEngines: {
      sadesati: true,
      manglik: true,
      kaalsarp: true,
      ngaaeeshing: true,
      matchmaking: true,
      yogas: true,
      yumsharol: true,
      kundali: true,
    },
  });

  // Load saved configuration from localStorage
  useEffect(() => {
    const savedSections = localStorage.getItem('kanglei_mobile_layout_sections');
    if (savedSections) {
      try {
        const parsed = JSON.parse(savedSections);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge in any newly introduced default sections that weren't in old localStorage
          const existingTypes = new Set(parsed.map((s: any) => s.type));
          const missingDefaults = DEFAULT_MOBILE_SECTIONS.filter((s) => !existingTypes.has(s.type));
          if (missingDefaults.length > 0) {
            const merged = [...parsed, ...missingDefaults].map((s, idx) => ({ ...s, order: idx + 1 }));
            setSections(merged);
            localStorage.setItem('kanglei_mobile_layout_sections', JSON.stringify(merged));
          } else {
            setSections(parsed);
          }
        }
      } catch (e) {}
    }

    const savedConfig = localStorage.getItem('kanglei_mobile_customizer_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed) {
          setBaseConfig((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {}
    }
  }, []);

  // Reordering functions
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const renumbered = updated.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSections(renumbered);
  };

  const handleToggleEnable = (id: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, enabled: !sec.enabled } : sec))
    );
  };

  const handleDeleteSection = (id: string) => {
    if (!confirm('Are you sure you want to remove this element from the mobile layout?')) return;
    setSections((prev) => prev.filter((sec) => sec.id !== id).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const handleCreateCustomAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdForm.adTitle.trim()) return;

    const newSec: MobileLayoutSection = {
      id: `sec-custom-ad-${Date.now()}`,
      type: 'custom_ad',
      title: `Ad: ${newAdForm.adTitle}`,
      subtitle: newAdForm.adSubtitle || 'Promotional banner card',
      enabled: true,
      order: sections.length + 1,
      data: {
        adTag: newAdForm.adTag || 'AD',
        adTitle: newAdForm.adTitle,
        adSubtitle: newAdForm.adSubtitle,
        adBannerUrl: newAdForm.adBannerUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
        targetUrl: newAdForm.targetUrl || '/shop',
        badgeColor: 'purple',
      },
    };

    setSections((prev) => [...prev, newSec]);
    setShowAddAdModal(false);
    setNewAdForm({
      adTitle: '',
      adSubtitle: '',
      adTag: 'SPECIAL OFFER',
      adBannerUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      targetUrl: '/shop',
    });
  };

  // Drag & drop handlers
  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;

    const updated = [...sections];
    const draggedItem = updated[draggedIdx];
    updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, draggedItem);

    const renumbered = updated.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSections(renumbered);
    setDraggedIdx(targetIdx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  // Save to localStorage and dispatch event
  const handleSaveAndPublish = () => {
    // Determine primary ad banner data from sections if present
    const primaryAd = sections.find((s) => s.type === 'ad_banner' && s.enabled);

    const updatedConfig: MobileCustomizerConfig = {
      ...baseConfig,
      showAdBanner: !!primaryAd,
      adTag: primaryAd?.data?.adTag || baseConfig.adTag,
      adTitle: primaryAd?.data?.adTitle || baseConfig.adTitle,
      adSubtitle: primaryAd?.data?.adSubtitle || baseConfig.adSubtitle,
      adBannerUrl: primaryAd?.data?.adBannerUrl || baseConfig.adBannerUrl,
      sections: sections,
    };

    localStorage.setItem('kanglei_mobile_layout_sections', JSON.stringify(sections));
    localStorage.setItem('kanglei_mobile_customizer_config', JSON.stringify(updatedConfig));

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('kanglei_mobile_config_updated'));

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const handleResetDefaults = () => {
    if (!confirm('Reset mobile dashboard layout to default ordering?')) return;
    setSections(DEFAULT_MOBILE_SECTIONS);
    localStorage.setItem('kanglei_mobile_layout_sections', JSON.stringify(DEFAULT_MOBILE_SECTIONS));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('kanglei_mobile_config_updated'));
  };

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#0b132b] border border-[#3a506b] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Mobile App Layout & Ads Drag-and-Drop Builder</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                  Admin CMS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Visually reorder sections, manage sponsored ad banners, and add custom promotional elements
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAddAdModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Custom Ad Element</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
            title="Reset layout to default order"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSaveAndPublish}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Mobile App Layout & Ads changes published successfully! Changes are live across all client and astrologer portals.</span>
          </div>
          <button onClick={() => setSaveToast(false)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Two-Column Studio: Left Drag & Drop Editor, Right Real-time Device Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ============================================================= */}
        {/* LEFT COLUMN (7 COLS): DRAG AND DROP BUILDER & SECTION EDITORS */}
        {/* ============================================================= */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Tabs bar */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0b132b] border border-[#1c2541]">
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'layout'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>1. Layout & Element Order ({sections.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'ads'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>2. Sponsored Ads Manager</span>
            </button>
          </div>

          {/* TAB 1: DRAG AND DROP SECTIONS LIST */}
          {activeTab === 'layout' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1 text-xs text-slate-400">
                <span>Drag the handle or use arrows to rearrange elements:</span>
                <span className="font-mono text-[11px] text-amber-400">Total: {sections.length} Elements</span>
              </div>

              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    !sec.enabled
                      ? 'bg-[#0b132b]/50 border-slate-800 opacity-60'
                      : draggedIdx === idx
                      ? 'bg-[#1c2541] border-amber-500 ring-2 ring-amber-500/40 shadow-2xl scale-[1.01]'
                      : 'bg-[#0b132b] border-[#1c2541] hover:border-[#3a506b]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    
                    {/* Drag handle & Order badge */}
                    <div className="flex items-center gap-3">
                      <button
                        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-5 h-5" />
                      </button>

                      <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{sec.title}</h4>
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase ${
                            sec.type === 'ad_banner' || sec.type === 'custom_ad'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : sec.type === 'notices'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : sec.type === 'panchanga'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : sec.type === 'consultation_queue'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : sec.type === 'eshop_overview'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {sec.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{sec.subtitle}</p>
                      </div>
                    </div>

                    {/* Action controls */}
                    <div className="flex items-center gap-1.5">
                      
                      {/* Move Up */}
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === sections.length - 1}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Visibility */}
                      <button
                        onClick={() => handleToggleEnable(sec.id)}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                          sec.enabled
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}
                        title={sec.enabled ? 'Enabled (Click to hide)' : 'Hidden (Click to enable)'}
                      >
                        {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit element fields if applicable */}
                      {(sec.type === 'ad_banner' || sec.type === 'custom_ad') && (
                        <button
                          onClick={() => setEditingSectionId(editingSectionId === sec.id ? null : sec.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors cursor-pointer"
                          title="Edit Ad Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete button (for custom ads) */}
                      {sec.type === 'custom_ad' && (
                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                          title="Delete Custom Ad"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Ad Editor for this element */}
                  {editingSectionId === sec.id && sec.data && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 p-3 rounded-xl bg-black/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">Edit Banner Configuration:</span>
                        <button
                          onClick={() => setEditingSectionId(null)}
                          className="text-[10px] text-slate-400 hover:text-white"
                        >
                          Close
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">Badge Tag</label>
                          <input
                            type="text"
                            value={sec.data.adTag || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSections((prev) =>
                                prev.map((s) => (s.id === sec.id ? { ...s, data: { ...s.data, adTag: val } } : s))
                              );
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">Target Link</label>
                          <input
                            type="text"
                            value={sec.data.targetUrl || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSections((prev) =>
                                prev.map((s) => (s.id === sec.id ? { ...s, data: { ...s.data, targetUrl: val } } : s))
                              );
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Headline Title</label>
                        <input
                          type="text"
                          value={sec.data.adTitle || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSections((prev) =>
                              prev.map((s) => (s.id === sec.id ? { ...s, data: { ...s.data, adTitle: val } } : s))
                            );
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Subtitle / Offer Description</label>
                        <input
                          type="text"
                          value={sec.data.adSubtitle || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSections((prev) =>
                              prev.map((s) => (s.id === sec.id ? { ...s, data: { ...s.data, adSubtitle: val } } : s))
                            );
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Image URL</label>
                        <input
                          type="text"
                          value={sec.data.adBannerUrl || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSections((prev) =>
                              prev.map((s) => (s.id === sec.id ? { ...s, data: { ...s.data, adBannerUrl: val } } : s))
                            );
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SPONSORED ADS MANAGER */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0b132b] border border-[#1c2541] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-500" />
                    <span>Active Promotional & Sponsored Slots</span>
                  </h3>
                  <button
                    onClick={() => setShowAddAdModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    + Add New Slot
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {sections
                    .filter((s) => s.type === 'ad_banner' || s.type === 'custom_ad')
                    .map((adSec) => (
                      <div
                        key={adSec.id}
                        className="p-3.5 rounded-xl bg-[#1c2541] border border-[#3a506b] flex items-center gap-3 justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={adSec.data?.adBannerUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop'}
                            alt="Banner"
                            className="w-12 h-12 rounded-lg object-cover border border-amber-500/30 shrink-0"
                          />
                          <div>
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-amber-500/20 text-amber-300">
                              {adSec.data?.adTag || 'AD'}
                            </span>
                            <h4 className="text-xs font-bold text-white">{adSec.data?.adTitle || adSec.title}</h4>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">{adSec.data?.adSubtitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleEnable(adSec.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              adSec.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {adSec.enabled ? 'Active' : 'Disabled'}
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('layout');
                              setEditingSectionId(adSec.id);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:text-white"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================= */}
        {/* RIGHT COLUMN (5 COLS): REAL-TIME LIVE DEVICE SIMULATOR        */}
        {/* ============================================================= */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full mb-3 flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Real-Time Device Simulator</span>
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <button
                onClick={() => setPreviewScale((s) => Math.max(70, s - 5))}
                className="px-2 py-0.5 rounded bg-[#1c2541] hover:text-white"
              >
                -
              </button>
              <span>{previewScale}%</span>
              <button
                onClick={() => setPreviewScale((s) => Math.min(100, s + 5))}
                className="px-2 py-0.5 rounded bg-[#1c2541] hover:text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Device Mock Frame with Scaled Dynamic Preview */}
          <div
            style={{ transform: `scale(${previewScale / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-150 ease-out"
          >
            <div className="relative w-[380px] h-[780px] bg-black rounded-[48px] p-[8px] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(217,119,6,0.15)] ring-1 ring-slate-700 border-4 border-slate-800 flex flex-col overflow-hidden">
              
              {/* Dynamic Island Pill */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
                <div className="w-2 h-2 rounded-full bg-[#111]" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Inner Smartphone Screen rendering AstrologerMobileView directly */}
              <div className="w-full h-full rounded-[40px] overflow-hidden overflow-y-auto no-scrollbar relative flex flex-col bg-[#0b132b]">
                <AstrologerMobileView
                  customConfig={{
                    ...baseConfig,
                    sections: sections,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD CUSTOM AD / PROMO ELEMENT                          */}
      {/* ------------------------------------------------------------- */}
      {showAddAdModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b132b] border border-[#3a506b] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#1c2541] pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base text-white">Create New Custom Ad / Promo Card</h3>
              </div>
              <button
                onClick={() => setShowAddAdModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomAd} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={newAdForm.adTag}
                  onChange={(e) => setNewAdForm({ ...newAdForm, adTag: e.target.value })}
                  placeholder="e.g. SPONSORED, SPECIAL OFFER, 30% OFF"
                  className="w-full px-3 py-2 rounded-xl bg-[#1c2541] border border-[#3a506b] text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Headline Title</label>
                <input
                  type="text"
                  value={newAdForm.adTitle}
                  onChange={(e) => setNewAdForm({ ...newAdForm, adTitle: e.target.value })}
                  placeholder="e.g. Consecrated 7-Mukhi Rudraksha Mala"
                  className="w-full px-3 py-2 rounded-xl bg-[#1c2541] border border-[#3a506b] text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Subtitle / Offer Description</label>
                <input
                  type="text"
                  value={newAdForm.adSubtitle}
                  onChange={(e) => setNewAdForm({ ...newAdForm, adSubtitle: e.target.value })}
                  placeholder="e.g. Blessed by Master Acharyas • Fast delivery"
                  className="w-full px-3 py-2 rounded-xl bg-[#1c2541] border border-[#3a506b] text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={newAdForm.adBannerUrl}
                  onChange={(e) => setNewAdForm({ ...newAdForm, adBannerUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#1c2541] border border-[#3a506b] text-white font-mono text-[11px]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Destination Target Link</label>
                <input
                  type="text"
                  value={newAdForm.targetUrl}
                  onChange={(e) => setNewAdForm({ ...newAdForm, targetUrl: e.target.value })}
                  placeholder="/shop or /services"
                  className="w-full px-3 py-2 rounded-xl bg-[#1c2541] border border-[#3a506b] text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddAdModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg"
                >
                  Add Element to Mobile App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
